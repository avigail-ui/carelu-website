import { json, requireConfig, isResponse, passwordMatches, signToken, sessionCookie, SESSION_DAYS } from './_shared.js';

/* ================================================================
   POST /api/sources/login  { password }
   Constant-time compare against SOURCES_PASSWORD, then set an
   httpOnly Secure SameSite=Lax cookie carrying an HMAC-signed,
   7-day session token.
   ================================================================ */

export async function POST(request: Request): Promise<Response> {
  const cfg = requireConfig();
  if (isResponse(cfg)) return cfg;

  let body: { password?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad request' }, 400);
  }
  const password = typeof body.password === 'string' ? body.password : '';
  if (!password) return json({ error: 'password required' }, 400);

  if (!passwordMatches(password, cfg.password)) {
    return json({ error: 'incorrect password' }, 401);
  }

  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const token = signToken(cfg.secret, Date.now() + maxAge * 1000);
  return json({ ok: true }, 200, { 'set-cookie': sessionCookie(token, maxAge) });
}
