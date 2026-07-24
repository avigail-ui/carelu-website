import { json, sessionCookie } from './_shared.js';

/* ================================================================
   POST /api/sources/logout — clears the session cookie.
   Deliberately does not require config: logging out must always
   work so a stale cookie can be cleared.
   ================================================================ */

export async function POST(): Promise<Response> {
  // Max-Age=0 expires the cookie immediately.
  return json({ ok: true }, 200, { 'set-cookie': sessionCookie('', 0) });
}
