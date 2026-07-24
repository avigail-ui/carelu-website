import { json, requireConfig, isResponse, passwordMatches, signToken, sessionCookie, SESSION_DAYS } from './_shared.js';

/* ================================================================
   POST /api/sources/login  { username, password }
   Constant-time compares against SOURCES_USERNAME / SOURCES_PASSWORD,
   then sets an httpOnly Secure SameSite=Lax cookie carrying an
   HMAC-signed, 7-day session token. SOURCES_USERNAME is optional
   config — when unset, any username is accepted (password-only).
   ================================================================ */

export async function POST(request: Request): Promise<Response> {
  const cfg = requireConfig('auth');
  if (isResponse(cfg)) return cfg;

  let body: { username?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad request' }, 400);
  }
  const username = typeof body.username === 'string' ? body.username : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!password) return json({ error: 'password required' }, 400);

  const expectedUser = process.env.SOURCES_USERNAME || '';
  const userOk = !expectedUser || passwordMatches(username, expectedUser);
  if (!userOk || !passwordMatches(password, cfg.password)) {
    return json({ error: 'incorrect username or password' }, 401);
  }

  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const token = signToken(cfg.secret, Date.now() + maxAge * 1000);
  return json({ ok: true }, 200, { 'set-cookie': sessionCookie(token, maxAge) });
}
