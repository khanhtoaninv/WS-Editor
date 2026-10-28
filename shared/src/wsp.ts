// Gói phiếu .wsp (wsp/0, docs/TUONG_TAC/2_CHUAN_GOI_PHIEU.md mục 2, 3, 9): đóng gói, ký, mã hóa, mở và kiểm.
// Chỉ dùng WebCrypto (trình duyệt và Node ≥ 22 đều có), không thêm thư viện.
//   .wsp = ZIP(store) { envelope.json, payload.bin }
//   payload.bin = iv(12 byte) + AES-GCM-256( ZIP(store) lõi ), AAD = "wsp/0|<sheetId>|<version>"
//   wrappedKeys[người nhận] = RSA-OAEP-2048-SHA256( khóa nội dung )
//   signature = Ed25519( canon(envelope bỏ trường signature) ), trong đó có payloadSha256
import { FORMAT, type Key, type Slot } from './types.ts';
import { validate } from './validate.ts';
import { zip, unzip, utf8, fromUtf8, type Files } from './zip.ts';

export type { Files } from './zip.ts';
export { zip, unzip } from './zip.ts';

const subtle = () => {
  const s = globalThis.crypto && globalThis.crypto.subtle;
  if (!s) throw new Error('máy không có WebCrypto (cần trình duyệt mới hoặc trang chạy qua http://localhost)');
  return s;
};

// ---------- tiện ích ----------
export const toB64 = (b: Uint8Array) => { let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000)); return btoa(s); };
export const fromB64 = (s: string) => { const r = atob(s), b = new Uint8Array(r.length); for (let i = 0; i < r.length; i++) b[i] = r.charCodeAt(i); return b; };
const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
const buf = (b: Uint8Array) => b as Uint8Array<ArrayBuffer>;
export async function sha256(b: Uint8Array | string): Promise<string> { return hex(await subtle().digest('SHA-256', buf(typeof b === 'string' ? utf8(b) : b))); }

// JSON chuẩn tắc: khóa sắp xếp, không khoảng trắng (để ký / băm cho ra cùng byte ở mọi nơi)
export function canon(v: unknown): string {
  if (v === null || typeof v !== 'object') return JSON.stringify(v ?? null);
  if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
  const o = v as Record<string, unknown>;
  return '{' + Object.keys(o).filter(k => o[k] !== undefined).sort().map(k => JSON.stringify(k) + ':' + canon(o[k])).join(',') + '}';
}

// ---------- kiểu ----------
export interface Envelope {
  format: string; sheetId: string; version: number; title: string; createdAt: string; producer: string;
  keyId: string; wrappedKeys: Record<string, string>; payloadSha256: string; signature: string;
}
export interface PageRef { file: string; heightMm: number }
export interface Manifest {
  format: string; sheetId: string; version: number; title: string; age?: string; level?: string; tags?: string[];
  pageSize: { wMm: number; hMm: number }; pages: PageRef[];
  contentHash: string; keyHash: string; files: Record<string, string>;
  stats: { tasks: number; slots: number; autoGraded: number; manualGraded: number; staticOnly: number };
  warnings?: string[];
  // Chế độ tài liệu mà trang được dàn: WS Editor hiện chạy ở chế độ "quirks" (file HTML không có <!doctype>), nên trang
  // phải được hiển thị cũng trong chế độ đó mới giống hệt (khác nhau ở chiều cao dòng có ô trống). Nợ kỹ thuật: BAN_GIAO_DEV/3.
  docMode: 'quirks' | 'standards';
}
export interface WspInput {
  sheetId: string; version: number; title: string; age?: string;
  pages: string[];                    // HTML từng trang (đã làm sạch, ảnh trỏ media/…)
  css: string;                        // pages/style.css (phông trỏ fonts/…)
  fonts?: Record<string, Uint8Array>; // tên file (không kèm fonts/) → byte
  media?: Record<string, Uint8Array>; // tên file (không kèm media/) → byte
  slots: Slot[]; key: Key; source?: unknown;
  staticOnly?: number;                // số câu chỉ xem (không thành chỗ trả lời)
  docMode?: 'quirks' | 'standards';
  warnings?: string[];
}
export interface Signer { keyId: string; sign(data: Uint8Array): Promise<Uint8Array> }
export interface Report { ok: boolean; errors: string[]; warnings: string[]; envelope?: Envelope; manifest?: Manifest; files?: Files }

// Các file thuộc ĐỀ (tính contentHash): mọi file trừ đáp án, phiếu gốc và chính manifest
const NOT_CONTENT = new Set(['key.json', 'source.json', 'manifest.json']);
async function hashes(files: Files) {
  const map: Record<string, string> = {};
  for (const p of Object.keys(files).sort()) if (p !== 'manifest.json') map[p] = await sha256(files[p]);
  const content = await sha256(Object.keys(map).filter(p => !NOT_CONTENT.has(p)).map(p => `${p}:${map[p]}`).join('\n'));
  return { map, content };
}

// ---------- đóng lõi ----------
export async function buildFiles(inp: WspInput): Promise<{ files: Files; manifest: Manifest }> {
  const files: Files = {};
  inp.pages.forEach((h, i) => { files[`pages/p${i + 1}.html`] = utf8(h); });
  files['pages/style.css'] = utf8(inp.css);
  for (const [n, b] of Object.entries(inp.fonts || {})) files[`fonts/${n}`] = b;
  for (const [n, b] of Object.entries(inp.media || {})) files[`media/${n}`] = b;
  files['slots.json'] = utf8(JSON.stringify(inp.slots, null, 1));
  files['key.json'] = utf8(JSON.stringify(inp.key, null, 1));
  if (inp.source !== undefined) files['source.json'] = utf8(JSON.stringify(inp.source));
  const h = await hashes(files);
  const tasks = new Set<string>();
  inp.pages.forEach(p => { for (const m of p.matchAll(/data-task="([^"]+)"/g)) tasks.add(m[1]); });
  const manifest: Manifest = {
    format: FORMAT, sheetId: inp.sheetId, version: inp.version, title: inp.title, ...(inp.age ? { age: inp.age } : {}),
    pageSize: { wMm: 210, hMm: 297 }, pages: inp.pages.map((_, i) => ({ file: `pages/p${i + 1}.html`, heightMm: 297 })),
    contentHash: h.content, keyHash: h.map['key.json'], files: h.map,
    stats: { tasks: tasks.size, slots: inp.slots.length, autoGraded: inp.slots.filter(s => s.grading === 'auto').length, manualGraded: inp.slots.filter(s => s.grading === 'manual').length, staticOnly: inp.staticOnly || 0 },
    ...(inp.warnings && inp.warnings.length ? { warnings: inp.warnings } : {}),
    docMode: inp.docMode || 'standards',
  };
  files['manifest.json'] = utf8(JSON.stringify(manifest, null, 1));
  return { files, manifest };
}

// ---------- khóa ----------
export async function genSignKey(): Promise<{ publicKey: JsonWebKey; privateKey: JsonWebKey }> {
  const k = await subtle().generateKey('Ed25519', true, ['sign', 'verify']) as CryptoKeyPair;
  return { publicKey: await subtle().exportKey('jwk', k.publicKey), privateKey: await subtle().exportKey('jwk', k.privateKey) };
}
export async function genBoxKey(): Promise<{ publicKey: JsonWebKey; privateKey: JsonWebKey }> {
  const k = await subtle().generateKey({ name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['encrypt', 'decrypt']) as CryptoKeyPair;
  return { publicKey: await subtle().exportKey('jwk', k.publicKey), privateKey: await subtle().exportKey('jwk', k.privateKey) };
}
export function localSigner(keyId: string, privateKey: JsonWebKey): Signer {
  return { keyId, async sign(d) { const k = await subtle().importKey('jwk', privateKey, 'Ed25519', false, ['sign']); return new Uint8Array(await subtle().sign('Ed25519', k, buf(d))); } };
}
// Bỏ phần riêng (d, p, q…) và key_ops để nạp lại thành khóa công khai
export function publicOf(j: JsonWebKey): JsonWebKey {
  const r = { ...j } as Record<string, unknown>;
  ['d', 'p', 'q', 'dp', 'dq', 'qi', 'key_ops', 'ext'].forEach(k => delete r[k]);
  return r as JsonWebKey;
}

const aad = (sheetId: string, version: number) => utf8(`${FORMAT}|${sheetId}|${version}`);
const signedPart = (e: Envelope) => { const { signature, ...rest } = e; void signature; return utf8(canon(rest)); };

// ---------- niêm phong ----------
export async function sealWsp(files: Files, m: Manifest, o: { signer: Signer; recipients: Record<string, JsonWebKey>; producer: string; createdAt?: string }): Promise<Uint8Array> {
  if (!Object.keys(o.recipients).length) throw new Error('cần ít nhất một người nhận (khóa công khai)');
  const s = subtle(), raw = crypto.getRandomValues(new Uint8Array(32)), iv = crypto.getRandomValues(new Uint8Array(12));
  const ck = await s.importKey('raw', raw, 'AES-GCM', false, ['encrypt']);
  const ct = new Uint8Array(await s.encrypt({ name: 'AES-GCM', iv, additionalData: buf(aad(m.sheetId, m.version)) }, ck, buf(zip(files))));
  const payload = new Uint8Array(12 + ct.length); payload.set(iv); payload.set(ct, 12);
  const wrappedKeys: Record<string, string> = {};
  for (const [who, jwk] of Object.entries(o.recipients)) {
    const pk = await s.importKey('jwk', publicOf(jwk), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);
    wrappedKeys[who] = toB64(new Uint8Array(await s.encrypt({ name: 'RSA-OAEP' }, pk, raw)));
  }
  const env: Envelope = { format: FORMAT, sheetId: m.sheetId, version: m.version, title: m.title, createdAt: o.createdAt || new Date().toISOString(), producer: o.producer, keyId: o.signer.keyId, wrappedKeys, payloadSha256: await sha256(payload), signature: '' };
  env.signature = toB64(await o.signer.sign(signedPart(env)));
  return zip({ 'envelope.json': utf8(JSON.stringify(env, null, 1)), 'payload.bin': payload });
}

// ---------- mở + kiểm (mục 9) ----------
export function readEnvelope(b: Uint8Array): { envelope: Envelope; payload: Uint8Array } {
  const z = unzip(b);
  const names = Object.keys(z).sort().join(',');
  if (names !== 'envelope.json,payload.bin') throw new Error(`gói phải có đúng envelope.json và payload.bin (đang có: ${names || 'rỗng'})`);
  // vỏ ZIP phải đúng dạng chuẩn tắc (như zip() ghi ra): sửa bất kỳ byte nào ở vỏ cũng bị từ chối
  const again = zip(z);
  if (again.length !== b.length || again.some((x, i) => x !== b[i])) throw new Error('vỏ gói bị sửa (không đúng dạng chuẩn) → từ chối');
  let e: Envelope;
  try { e = JSON.parse(fromUtf8(z['envelope.json'])); } catch { throw new Error('envelope.json không đọc được'); }
  return { envelope: e, payload: z['payload.bin'] };
}

export interface OpenOpts {
  trust: Record<string, JsonWebKey>;   // keyId → khóa công khai Ed25519 tin cậy
  who?: string;                        // tên người nhận ('tr' / 'ed'); bỏ trống = chỉ kiểm chữ ký, không giải mã
  privateKey?: JsonWebKey;             // khóa riêng RSA-OAEP của người nhận
}
export async function inspectWsp(b: Uint8Array, o: OpenOpts): Promise<Report> {
  const r: Report = { ok: false, errors: [], warnings: [] }, s = subtle();
  let env: Envelope, payload: Uint8Array;
  try { ({ envelope: env, payload } = readEnvelope(b)); } catch (e) { r.errors.push(String((e as Error).message)); return r; }
  r.envelope = env;
  if (env.format !== FORMAT) { r.errors.push(`định dạng "${env.format}" không đọc được (máy này đọc ${FORMAT}); cần nâng cấp`); return r; }
  for (const k of ['sheetId', 'title', 'createdAt', 'producer', 'keyId', 'payloadSha256', 'signature'] as const) if (typeof env[k] !== 'string' || !env[k]) r.errors.push(`phong bì thiếu ${k}`);
  if (!Number.isInteger(env.version) || env.version < 1) r.errors.push('phong bì: version phải là số nguyên ≥ 1');
  if (!env.wrappedKeys || typeof env.wrappedKeys !== 'object') r.errors.push('phong bì thiếu wrappedKeys');
  if (r.errors.length) return r;
  // 1. chữ ký (trước khi giải mã)
  const pub = o.trust[env.keyId];
  if (!pub) { r.errors.push(`khóa ký "${env.keyId}" không có trong danh sách tin cậy → từ chối`); return r; }
  try {
    const vk = await s.importKey('jwk', publicOf(pub), 'Ed25519', false, ['verify']);
    if (!await s.verify('Ed25519', vk, buf(fromB64(env.signature)), buf(signedPart(env)))) { r.errors.push('sai chữ ký → từ chối (gói bị sửa sau khi ký hoặc ký bằng khóa khác)'); return r; }
  } catch (e) { r.errors.push(`không kiểm được chữ ký: ${(e as Error).message}`); return r; }
  // 2. hash lõi
  if (await sha256(payload) !== env.payloadSha256) { r.errors.push('payload.bin sai hash → từ chối'); return r; }
  if (!o.who) { r.ok = true; r.warnings.push('chỉ kiểm chữ ký, chưa giải mã (không có khóa riêng)'); return r; }
  // 3. giải mã
  const w = env.wrappedKeys[o.who];
  if (!w) { r.errors.push(`gói không bọc khóa cho "${o.who}"`); return r; }
  if (!o.privateKey) { r.errors.push('thiếu khóa riêng để giải mã'); return r; }
  let inner: Files;
  try {
    const pk = await s.importKey('jwk', o.privateKey, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['decrypt']);
    const raw = new Uint8Array(await s.decrypt({ name: 'RSA-OAEP' }, pk, buf(fromB64(w))));
    const ck = await s.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
    const plain = new Uint8Array(await s.decrypt({ name: 'AES-GCM', iv: buf(payload.subarray(0, 12)), additionalData: buf(aad(env.sheetId, env.version)) }, ck, buf(payload.subarray(12))));
    inner = unzip(plain);
  } catch (e) { r.errors.push(`không giải mã được lõi: ${(e as Error).message || 'sai khóa'}`); return r; }
  // 4. kiểm nội dung
  const c = await checkFiles(inner);
  r.errors.push(...c.errors); r.warnings.push(...c.warnings); r.manifest = c.manifest; r.files = inner;
  if (c.manifest) {
    if (c.manifest.sheetId !== env.sheetId || c.manifest.version !== env.version) r.errors.push('manifest và phong bì khác sheetId / version');
    if (c.manifest.title !== env.title) r.errors.push('manifest và phong bì khác tiêu đề');
  }
  r.ok = !r.errors.length;
  return r;
}
export async function openWsp(b: Uint8Array, o: OpenOpts & { who: string; privateKey: JsonWebKey }) {
  const r = await inspectWsp(b, o);
  if (!r.ok) throw new Error(r.errors.join('; '));
  return r as Required<Pick<Report, 'envelope' | 'manifest' | 'files'>> & Report;
}

const KEY_WORDS = ['accept', 'correct', 'sample', 'explain'];
function deepKeys(v: unknown, out: Set<string>) {
  if (Array.isArray(v)) v.forEach(x => deepKeys(x, out));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { out.add(k); deepKeys(x, out); }
}
const textOf = (h: string) => h.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ');

// Kiểm lõi đã giải mã: lược đồ, hash từng file, khớp data-ans ↔ slots, đáp án, HTML sạch, tài nguyên đủ
export async function checkFiles(files: Files): Promise<{ errors: string[]; warnings: string[]; manifest?: Manifest }> {
  const errors: string[] = [], warnings: string[] = [];
  const J = (p: string) => { if (!files[p]) { errors.push(`thiếu ${p}`); return undefined; } try { return JSON.parse(fromUtf8(files[p])); } catch { errors.push(`${p} không phải JSON`); return undefined; } };
  const m = J('manifest.json') as Manifest | undefined, slots = J('slots.json') as Slot[] | undefined, key = J('key.json') as Key | undefined;
  if (!m) return { errors, warnings };
  if (m.format !== FORMAT) errors.push(`manifest: format "${m.format}" khác ${FORMAT}`);
  if (typeof m.sheetId !== 'string' || !m.sheetId) errors.push('manifest thiếu sheetId');
  if (!Number.isInteger(m.version)) errors.push('manifest: version phải là số nguyên');
  if (typeof m.title !== 'string') errors.push('manifest thiếu title');
  if (!m.pageSize || m.pageSize.wMm !== 210 || m.pageSize.hMm !== 297) errors.push('manifest: pageSize phải là A4 210×297');
  if (!Array.isArray(m.pages) || !m.pages.length) errors.push('manifest: không có trang');
  if (m.docMode !== 'quirks' && m.docMode !== 'standards') errors.push('manifest: docMode phải là "quirks" hoặc "standards"');
  if (!m.files || typeof m.files !== 'object') { errors.push('manifest thiếu files'); return { errors, warnings, manifest: m }; }
  // hash từng file + không có file thừa
  const h = await hashes(files);
  for (const p of Object.keys(m.files)) if (!(p in files)) errors.push(`manifest liệt kê ${p} nhưng gói không có`);
  for (const p of Object.keys(h.map)) {
    if (!(p in m.files)) errors.push(`file ${p} không có trong manifest`);
    else if (m.files[p] !== h.map[p]) errors.push(`file ${p} sai hash`);
    if (!/^(pages\/(p[1-9]\d*\.html|style\.css)|fonts\/[\w.-]+\.woff2|media\/[\w.-]+\.(png|jpe?g|webp|gif|svg)|slots\.json|key\.json|source\.json)$/.test(p)) errors.push(`file lạ trong gói: ${p}`);
  }
  if (m.contentHash !== h.content) errors.push('contentHash không khớp nội dung đề');
  if (m.keyHash !== h.map['key.json']) errors.push('keyHash không khớp key.json');
  // lược đồ slots / key
  if (slots && key) {
    validate(slots, key).forEach(e => errors.push(`slots/key: ${e}`));
    const ks = new Set<string>(); deepKeys(slots, ks);
    KEY_WORDS.filter(k => ks.has(k)).forEach(k => errors.push(`slots.json có trường đáp án "${k}" (đáp án chỉ được nằm trong key.json)`));
  }
  // trang
  const ids = new Set((slots || []).map(s => s.id)), seen = new Set<string>(), refs = new Set<string>();
  const pageFiles = (Array.isArray(m.pages) ? m.pages : []).map(p => p && p.file);
  pageFiles.forEach((f, i) => { if (f !== `pages/p${i + 1}.html`) errors.push(`manifest: trang ${i + 1} phải là pages/p${i + 1}.html`); });
  Object.keys(files).filter(p => /^pages\/p\d+\.html$/.test(p) && !pageFiles.includes(p)).forEach(p => errors.push(`${p} không có trong danh sách trang`));
  let allText = '';
  for (const f of pageFiles) {
    if (!f || !files[f]) continue;
    const html = fromUtf8(files[f]), at = f;
    allText += textOf(html) + '\n';
    if (/<\s*(script|iframe|object|embed|link|meta|base|form|style)\b/i.test(html)) errors.push(`${at}: có thẻ bị cấm (script / iframe / link / style…)`);
    if (/\son[a-z]+\s*=/i.test(html)) errors.push(`${at}: có thuộc tính sự kiện on…`);
    if (/javascript:/i.test(html)) errors.push(`${at}: có javascript:`);
    if (/class="[^"]*\bok\b/.test(html) || /data-(ok|correct|accept|key|sample)\b/.test(html)) errors.push(`${at}: trang có đánh dấu đáp án`);
    for (const x of html.matchAll(/data-ans="([^"]+)"/g)) { seen.add(x[1]); if (!ids.has(x[1])) errors.push(`${at}: data-ans "${x[1]}" không có trong slots.json`); }
    for (const x of html.matchAll(/\b(?:src|href|xlink:href|poster|srcset)\s*=\s*"([^"]*)"/gi)) refs.add(x[1]);
    for (const x of html.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)) refs.add(x[1].replace(/&quot;/g, ''));
  }
  ids.forEach(id => { if (!seen.has(id)) errors.push(`chỗ trả lời "${id}" không thấy trên trang nào`); });
  if (files['pages/style.css']) {
    const css = fromUtf8(files['pages/style.css']);
    if (/@import|expression\(|javascript:|<\/?\s*style/i.test(css)) errors.push('pages/style.css có @import / expression / javascript');
    for (const x of css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)) refs.add(x[1]);
  } else errors.push('thiếu pages/style.css');
  refs.forEach(u => {
    if (/^data:image\/svg\+xml/i.test(u)) return;   // hình giữ chỗ (khung ảnh trống) vẽ sẵn bằng SVG nhỏ
    if (/^(https?:)?\/\//i.test(u) || /^[a-z]+:/i.test(u)) errors.push(`tham chiếu ngoài gói bị cấm: ${u.slice(0, 80)}`);
    else if (!files[u]) errors.push(`tham chiếu tới ${u} nhưng gói không có`);
  });
  // svg trong media không được có script
  Object.keys(files).filter(p => p.endsWith('.svg')).forEach(p => { const t = fromUtf8(files[p]); if (/<script|\son[a-z]+\s*=|javascript:/i.test(t)) errors.push(`${p}: SVG có script`); });
  // lộ đáp án: bài mẫu / giải thích không được có trên trang
  if (key) Object.entries(key).forEach(([id, k]) => {
    [k.sample, k.explain].forEach(t => { const s = String(t || '').trim().replace(/\s+/g, ' '); if (s.length >= 8 && allText.includes(s)) errors.push(`trang có sẵn bài mẫu / giải thích của "${id}"`); });
  });
  if (m.stats && m.stats.staticOnly) warnings.push(`${m.stats.staticOnly} câu chỉ xem (không tương tác)`);
  (m.warnings || []).forEach(w => warnings.push(w));
  return { errors, warnings, manifest: m };
}

// Phần học sinh được thấy: trang, CSS, phông, ảnh, slots (không có key.json, source.json)
export function studentView(files: Files): Files {
  const o: Files = {};
  for (const [p, b] of Object.entries(files)) if (p !== 'key.json' && p !== 'source.json') o[p] = b;
  return o;
}
