import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

/* ================================================================
   Shared helpers for the Sources document-upload app
   (/api/sources/login, /logout, /state, /upload).
   Underscore-prefixed so Vercel does not turn this into a route.

   The app lets Carelu's team upload the payer/state documents that
   block automated fetching straight into the PRIVATE carelu-sources
   repo (inbox/ + requests.json + events.json), which the monthly
   refresh then processes.

   Config is entirely via env vars, set in Vercel by the operator —
   NONE are invented here. Every endpoint returns a clear 503 when a
   required var is missing so the front-end can show a setup notice.
   ================================================================ */

export const REPO_OWNER = 'ybelson18';
export const REPO_NAME = 'carelu-sources';
export const DEFAULT_BRANCH = 'main';
export const COOKIE_NAME = 'carelu_sources';
export const SESSION_DAYS = 7;
export const MAX_UPLOAD_BYTES = 40 * 1024 * 1024; // 40MB decoded
export const ALLOWED_EXTENSIONS = ['.pdf', '.csv', '.xlsx', '.png', '.zip'];
export const NEXT_REFRESH = '1st of the month, 06:00 UTC';

// Slack workflow webhook — best-effort upload notification. Not a secret
// (it is a fixed trigger URL), so it lives here rather than in an env var.
export const SLACK_WEBHOOK_URL =
  'https://hooks.slack.com/triggers/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';

const JSON_HEADERS: Record<string, string> = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};

export function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...JSON_HEADERS, ...extraHeaders } });
}

/* ---- Config -------------------------------------------------------- */

export interface SourcesConfig {
  password: string;
  secret: string;
  token: string;
}

// The env vars the operator must set in Vercel. Named here (only) so the
// 503 message can point at the exact missing one.
const REQUIRED_VARS = ['SOURCES_PASSWORD', 'SOURCES_SESSION_SECRET', 'GH_SOURCES_TOKEN'] as const;

// Returns the resolved config, or a 503 Response naming the first missing var.
export function requireConfig(): SourcesConfig | Response {
  for (const name of REQUIRED_VARS) {
    if (!process.env[name]) {
      return json({ error: `sources app not configured (missing ${name})`, notConfigured: true }, 503);
    }
  }
  return {
    password: process.env.SOURCES_PASSWORD as string,
    secret: process.env.SOURCES_SESSION_SECRET as string,
    token: process.env.GH_SOURCES_TOKEN as string,
  };
}

export function isResponse(v: unknown): v is Response {
  return v instanceof Response;
}

/* ---- Data shapes (mirror carelu-sources requests.json/events.json) -- */

export interface SourceRequest {
  id: string;
  title: string;
  officialUrl_note: string;
  unblocks: string;
  status: 'open' | 'received' | 'fulfilled';
  requestedAt: string;
  receivedAt: string | null;
  fulfilledAt: string | null;
  uploadedFile: string | null;
}

export interface RequestsFile {
  meta: { updated: string; schema: number };
  requests: SourceRequest[];
}

export interface SourceEvent {
  ts: string;
  type: 'request-opened' | 'file-received' | 'request-fulfilled' | 'refresh-completed' | 'refresh-issue';
  summary: string;
  refId: string | null;
}

/* ---- Password compare (constant-time) ------------------------------ */

export function passwordMatches(supplied: string, expected: string): boolean {
  // Hash both to a fixed 32-byte digest first so timingSafeEqual always sees
  // equal-length buffers regardless of the raw password lengths.
  const a = createHash('sha256').update(supplied).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

/* ---- Session token (HMAC-signed, self-contained) ------------------- */

// token = base64url(JSON payload) + "." + base64url(HMAC-SHA256(payload)).
export function signToken(secret: string, expiresAtMs: number): string {
  const payload = Buffer.from(JSON.stringify({ exp: expiresAtMs })).toString('base64url');
  const sig = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyToken(secret: string, token: string | undefined, nowMs: number): boolean {
  if (!token) return false;
  const dot = token.indexOf('.');
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac('sha256', secret).update(payload).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8')) as { exp?: number };
    return typeof data.exp === 'number' && data.exp > nowMs;
  } catch {
    return false;
  }
}

/* ---- Cookies ------------------------------------------------------- */

export function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get('cookie');
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return undefined;
}

export function sessionCookie(value: string, maxAgeSeconds: number): string {
  return `${COOKIE_NAME}=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAgeSeconds}`;
}

// Guard used by state/upload: returns null when authenticated, or a 401 Response.
export function requireAuth(request: Request, secret: string, nowMs: number): Response | null {
  const token = readCookie(request, COOKIE_NAME);
  if (!verifyToken(secret, token, nowMs)) {
    return json({ error: 'not authenticated' }, 401);
  }
  return null;
}

/* ---- GitHub API ---------------------------------------------------- */

const GITHUB_API = 'https://api.github.com';

export interface GithubError extends Error {
  status: number;
  body: string;
}

async function githubFetch(
  token: string,
  path: string,
  init: RequestInit & { rawText?: boolean } = {}
): Promise<Response> {
  const { rawText, ...rest } = init;
  const headers: Record<string, string> = {
    authorization: `Bearer ${token}`,
    accept: rawText ? 'application/vnd.github.raw+json' : 'application/vnd.github+json',
    'x-github-api-version': '2022-11-28',
    'user-agent': 'carelu-sources-app',
    ...(rest.headers as Record<string, string> | undefined),
  };
  return fetch(`${GITHUB_API}${path}`, { ...rest, headers });
}

async function githubJson<T>(token: string, path: string, init: RequestInit = {}): Promise<T> {
  const res = await githubFetch(token, path, init);
  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`GitHub ${init.method ?? 'GET'} ${path} -> ${res.status}`) as GithubError;
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return (await res.json()) as T;
}

const repoPath = `/repos/${REPO_OWNER}/${REPO_NAME}`;

// Fetch a text file from the repo at DEFAULT_BRANCH via the contents API (raw).
export async function getRepoFileText(token: string, filePath: string): Promise<string> {
  const res = await githubFetch(token, `${repoPath}/contents/${filePath}?ref=${DEFAULT_BRANCH}`, {
    rawText: true,
  });
  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`GitHub GET contents/${filePath} -> ${res.status}`) as GithubError;
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return res.text();
}

// Latest commit date on the default branch (ISO string), or null if none.
export async function getLatestCommitDate(token: string): Promise<string | null> {
  const commits = await githubJson<Array<{ commit: { committer?: { date?: string }; author?: { date?: string } } }>>(
    token,
    `${repoPath}/commits?sha=${DEFAULT_BRANCH}&per_page=1`
  );
  const c = commits[0]?.commit;
  return c?.committer?.date ?? c?.author?.date ?? null;
}

/* ---- Git Database API: single commit of multiple files ------------- */

export interface CommitFile {
  path: string; // repo-relative path
  content: string; // raw content (utf-8 text, or base64 when isBase64)
  isBase64?: boolean;
}

// Create ONE commit adding/updating every file in `files`, on DEFAULT_BRANCH.
// Uses the Git Database API (blob -> tree -> commit -> update ref) rather than
// the contents API so large binary blobs are supported. Returns the new SHA.
export async function commitFiles(token: string, files: CommitFile[], message: string): Promise<string> {
  // 1. Current branch head + its tree.
  const ref = await githubJson<{ object: { sha: string } }>(token, `${repoPath}/git/ref/heads/${DEFAULT_BRANCH}`);
  const headSha = ref.object.sha;
  const headCommit = await githubJson<{ tree: { sha: string } }>(token, `${repoPath}/git/commits/${headSha}`);
  const baseTree = headCommit.tree.sha;

  // 2. A blob per file.
  const treeItems = [];
  for (const f of files) {
    const blob = await githubJson<{ sha: string }>(token, `${repoPath}/git/blobs`, {
      method: 'POST',
      body: JSON.stringify(
        f.isBase64 ? { content: f.content, encoding: 'base64' } : { content: f.content, encoding: 'utf-8' }
      ),
    });
    treeItems.push({ path: f.path, mode: '100644', type: 'blob', sha: blob.sha });
  }

  // 3. New tree on top of the current one.
  const tree = await githubJson<{ sha: string }>(token, `${repoPath}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ base_tree: baseTree, tree: treeItems }),
  });

  // 4. New commit.
  const commit = await githubJson<{ sha: string }>(token, `${repoPath}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({ message, tree: tree.sha, parents: [headSha] }),
  });

  // 5. Move the branch ref forward.
  await githubJson(token, `${repoPath}/git/refs/heads/${DEFAULT_BRANCH}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });

  return commit.sha;
}
