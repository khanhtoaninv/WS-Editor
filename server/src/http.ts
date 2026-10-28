// Tiện ích HTTP tối giản (node:http, không thư viện).
import type { IncomingMessage, ServerResponse } from 'node:http';

export type Req = IncomingMessage & { path: string; query: URLSearchParams; cookies: Record<string, string> };
export type Res = ServerResponse;

export class HttpError extends Error { code: number; constructor(code: number, msg: string) { super(msg); this.code = code; } }
export const bad = (m: string) => new HttpError(400, m);

export function parseCookies(h: string | undefined): Record<string, string> {
  const o: Record<string, string> = {};
  (h || '').split(';').forEach(p => { const i = p.indexOf('='); if (i > 0) o[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim()); });
  return o;
}
export function setCookie(res: Res, name: string, val: string, maxAge = 60 * 60 * 24 * 30) {
  const prev = res.getHeader('set-cookie'), c = `${name}=${encodeURIComponent(val)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
  res.setHeader('set-cookie', prev ? ([] as string[]).concat(prev as string | string[], c) : c);
}
export async function body(req: IncomingMessage, limit: number): Promise<Uint8Array> {
  const chunks: Buffer[] = []; let n = 0;
  for await (const c of req) { n += (c as Buffer).length; if (n > limit) throw new HttpError(413, `dữ liệu gửi lên quá lớn (tối đa ${Math.round(limit / 1048576)} MB)`); chunks.push(c as Buffer); }
  return new Uint8Array(Buffer.concat(chunks));
}
export async function json<T = any>(req: IncomingMessage, limit = 2 * 1048576): Promise<T> {
  const b = await body(req, limit); if (!b.length) return {} as T;
  try { return JSON.parse(new TextDecoder().decode(b)); } catch { throw bad('dữ liệu gửi lên không phải JSON'); }
}
export function send(res: Res, code: number, data: unknown, type = 'application/json; charset=utf-8') {
  const b = typeof data === 'string' || data instanceof Uint8Array ? data : JSON.stringify(data);
  res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
  res.end(b);
}
export const MIME: Record<string, string> = {
  html: 'text/html; charset=utf-8', css: 'text/css; charset=utf-8', js: 'text/javascript; charset=utf-8', json: 'application/json; charset=utf-8',
  woff2: 'font/woff2', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml', txt: 'text/plain; charset=utf-8',
};
export const mimeOf = (p: string) => MIME[(p.split('.').pop() || '').toLowerCase()] || 'application/octet-stream';
