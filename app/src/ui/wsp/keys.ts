// GĐ2: khóa dùng khi xuất / mở gói .wsp trong WS Editor.
// - Ký: WS Editor không giữ khóa ký thật (quyết định H1: dịch vụ ký của công ty). Khi chưa có dịch vụ ký, dùng
//   "khóa thử trên máy này" (tạo một lần, lưu trong trình duyệt) — chỉ để thử; bên nhập thật sẽ không tin khóa này.
//   Khi app chạy trên máy chủ lớp thử (v119), máy chủ đóng vai dịch vụ ký: GET /api/wsp/khoa, POST /api/wsp/ky.
// - Nhận: "ed" = khóa của WS Editor trên máy này (để mở lại gói mà sửa); "tr" = khóa công khai bên nhập (TeacherResource
//   hoặc máy chủ lớp thử).
import { genSignKey, genBoxKey, localSigner, publicOf, toB64, fromB64, type Signer } from '../../../../shared/src/index.ts';

const K_SIGN = 'wsp.devSign.v1', K_ED = 'wsp.edBox.v1', K_TR = 'wsp.trPub.v1', K_TRUST = 'wsp.trust.v1', K_VER = 'wsp.ver.v1';
const get = (k: string) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } };
const put = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* chế độ riêng tư: dùng tạm trong phiên */ } };

type Pair = { publicKey: JsonWebKey; privateKey: JsonWebKey };
let memSign: (Pair & { kid: string }) | null = null, memEd: Pair | null = null;

export async function devSign(): Promise<Pair & { kid: string }> {
  let k = get(K_SIGN) || memSign;
  if (!k) { const p = await genSignKey(); k = { ...p, kid: 'dev-local-' + Math.random().toString(36).slice(2, 8) }; put(K_SIGN, k); }
  return (memSign = k);
}
export async function edBox(): Promise<Pair> {
  let k = get(K_ED) || memEd;
  if (!k) { k = await genBoxKey(); put(K_ED, k); }
  return (memEd = k);
}
export const trPub = (): JsonWebKey | null => get(K_TR);
export function setTrPub(txt: string): string | null {
  if (!txt.trim()) { try { localStorage.removeItem(K_TR); } catch { /* */ } return null; }
  try { const j = JSON.parse(txt); if (j.kty !== 'RSA' || !j.n || !j.e) return 'không phải khóa công khai RSA (JWK)'; put(K_TR, publicOf(j)); return null; } catch { return 'không đọc được JSON'; }
}

// Máy chủ lớp thử (v119) có thì dùng
export type ServerKeys = { keyId: string; signPublic: JsonWebKey; trPublic: JsonWebKey };
export async function serverKeys(): Promise<ServerKeys | null> {
  if (!/^https?:$/.test(location.protocol) || !document.querySelector('meta[name="ws-lop"]')) return null;   // chỉ khi máy chủ lớp thử phục vụ trang (nó chèn thẻ meta này)
  try { const r = await fetch('/api/wsp/khoa'); if (!r.ok) return null; const j = await r.json(); return j && j.keyId && j.trPublic ? j : null; } catch { return null; }
}
export function serverSigner(keyId: string): Signer {
  return { keyId, async sign(d) { const r = await fetch('/api/wsp/ky', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ data: toB64(d) }) }); if (!r.ok) throw new Error('máy chủ không ký được (' + r.status + ')'); return fromB64((await r.json()).signature); } };
}
export async function devSigner(): Promise<Signer> { const k = await devSign(); return localSigner(k.kid, k.privateKey); }

// Khóa ký tin cậy khi mở gói trong WS Editor: khóa thử trên máy + máy chủ lớp thử + danh sách thêm tay
export async function trusted(): Promise<Record<string, JsonWebKey>> {
  const t: Record<string, JsonWebKey> = { ...(get(K_TRUST) || {}) };
  const d = await devSign(); t[d.kid] = d.publicKey;
  const s = await serverKeys(); if (s) t[s.keyId] = s.signPublic;
  return t;
}

// Số phiên bản gói: cùng mã phiếu mà đề đổi (contentHash / keyHash khác lần xuất trước) thì tăng
export function nextVersion(id: string, hash: string): number {
  const m = get(K_VER) || {}, o = m[id];
  if (!o) return 1;
  return o.h === hash ? o.v : o.v + 1;
}
export function saveVersion(id: string, v: number, hash: string) { const m = get(K_VER) || {}; m[id] = { v, h: hash }; put(K_VER, m); }
