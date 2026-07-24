import {
  json,
  requireConfig,
  isResponse,
  requireAuth,
  getRepoFileText,
  commitFiles,
  MAX_UPLOAD_BYTES,
  ALLOWED_EXTENSIONS,
  SLACK_WEBHOOK_URL,
} from './_shared.js';
import type { CommitFile, RequestsFile, SourceEvent } from './_shared.js';

/* ================================================================
   POST /api/sources/upload  (auth required)
   Body: { requestId, filename, contentBase64 }

   Commits the file to carelu-sources via the Git Database API
   (blob -> tree -> commit -> ref) so large binaries are supported,
   in ONE commit that also flips the request to `received` in
   requests.json and appends a file-received entry to events.json.
   Then best-effort-notifies Slack.
   ================================================================ */

export const config = { maxDuration: 60 };

// alnum, dash, dot only. Every run of disallowed chars — including "/" and "\"
// — collapses to a single dash, so no slash survives and the committed path is
// always a safe basename under inbox/ (no path traversal possible). Leading/
// trailing dots and dashes are stripped so no hidden/"../"-style names slip in.
function sanitizeFilename(name: string): string {
  return (
    name
      .replace(/[^A-Za-z0-9.-]+/g, '-') // "/", "\", spaces, "!" … -> "-"
      .replace(/-*\.-*/g, '.') // tidy dashes hugging a dot
      .replace(/\.{2,}/g, '.') // collapse consecutive dots ("..")
      .replace(/^[.-]+|[.-]+$/g, '') // no leading/trailing dot or dash
      .slice(0, 120) || 'upload'
  );
}

export async function POST(request: Request): Promise<Response> {
  const cfg = requireConfig();
  if (isResponse(cfg)) return cfg;

  const unauthorized = requireAuth(request, cfg.secret, Date.now());
  if (unauthorized) return unauthorized;

  let body: { requestId?: unknown; filename?: unknown; contentBase64?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad request' }, 400);
  }

  const requestId = typeof body.requestId === 'string' ? body.requestId.trim() : '';
  const rawName = typeof body.filename === 'string' ? body.filename.trim() : '';
  const rawBase64 = typeof body.contentBase64 === 'string' ? body.contentBase64 : '';
  if (!requestId || !rawName || !rawBase64) {
    return json({ error: 'requestId, filename and contentBase64 are required' }, 400);
  }

  const filename = sanitizeFilename(rawName);
  const lower = filename.toLowerCase();
  if (!ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext))) {
    return json({ error: `file type not allowed (accepted: ${ALLOWED_EXTENSIONS.join(', ')})` }, 400);
  }

  // Strip any data-URL prefix, then validate size against the decoded bytes.
  const cleanBase64 = rawBase64.replace(/^data:[^;]*;base64,/, '').replace(/\s/g, '');
  let decodedBytes: number;
  try {
    decodedBytes = Buffer.from(cleanBase64, 'base64').length;
  } catch {
    return json({ error: 'contentBase64 is not valid base64' }, 400);
  }
  if (decodedBytes === 0) return json({ error: 'empty file' }, 400);
  if (decodedBytes > MAX_UPLOAD_BYTES) {
    return json({ error: `file exceeds ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))}MB limit` }, 413);
  }

  // Load current requests.json + events.json (fresh, so we commit on top of HEAD).
  let requestsFile: RequestsFile;
  let events: SourceEvent[];
  try {
    const [requestsText, eventsText] = await Promise.all([
      getRepoFileText(cfg.token, 'requests.json'),
      getRepoFileText(cfg.token, 'events.json'),
    ]);
    requestsFile = JSON.parse(requestsText) as RequestsFile;
    events = JSON.parse(eventsText) as SourceEvent[];
  } catch (err) {
    console.error('sources/upload read failed', err);
    return json({ error: 'could not read source repository' }, 502);
  }

  const target = requestsFile.requests.find((r) => r.id === requestId);
  if (!target) return json({ error: `unknown requestId ${requestId}` }, 404);

  const now = new Date().toISOString();
  const nowDate = now.slice(0, 10);
  const inboxPath = `inbox/${requestId}-${filename}`;

  // Mutate in place: flip the request to received + record the uploaded file.
  target.status = 'received';
  target.receivedAt = now;
  target.uploadedFile = inboxPath;
  requestsFile.meta = { ...requestsFile.meta, updated: nowDate };

  const newEvent: SourceEvent = {
    ts: now,
    type: 'file-received',
    summary: `${target.title} received (${inboxPath})`,
    refId: requestId,
  };
  events.push(newEvent);

  const files: CommitFile[] = [
    { path: inboxPath, content: cleanBase64, isBase64: true },
    { path: 'requests.json', content: JSON.stringify(requestsFile, null, 1) + '\n' },
    { path: 'events.json', content: JSON.stringify(events, null, 1) + '\n' },
  ];

  try {
    await commitFiles(cfg.token, files, `sources app: ${requestId} received — ${filename}`);
  } catch (err) {
    console.error('sources/upload commit failed', err);
    return json({ error: 'upload failed while committing to the source repository' }, 502);
  }

  // Best-effort Slack notification — never fail the upload on a Slack error.
  try {
    await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        text: `Document received: ${target.title} uploaded by the team — will be processed by the next refresh.`,
      }),
    });
  } catch (err) {
    console.error('sources/upload slack notify failed (non-fatal)', err);
  }

  return json({ ok: true, request: target, event: newEvent });
}
