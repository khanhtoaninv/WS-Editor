// Máy chủ Lớp học thử (Mốc 2, docs/KE_HOACH_LOP_HOC_THU.md). Một tiến trình Node, không thư viện.
//   /gv           trang giáo viên (lop.html): lớp, gói phiếu, phiên, theo dõi, chấm chữa, báo cáo
//   /hs           trang học sinh (lop.html): nhập mã, chọn tên, làm bài, nộp
//   /editor       WS Editor (ws-editor.html) — xuất gói thì máy chủ này ký và nhận gói ("Gửi lên lớp thử")
//   /api/…        JSON; /api/…/su-kien là kênh sự kiện trực tiếp (SSE)
// Đáp án (key.json) không bao giờ gửi cho học sinh: học sinh chỉ nhận phần đề của gói (studentView).
import { createServer, type Server } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { networkInterfaces } from 'node:os';
import { inspectWsp, studentView, isBlank, grade, fromB64, toB64, type Slot, type Key, type Answers, type Manifest } from '../../shared/src/index.ts';
import { Store, newId, newMa, type Phien, type Lop, type Goi, type Bai } from './store.ts';
import { loadKhoa, trustOf, type Khoa } from './khoa.ts';
import { HttpError, bad, parseCookies, setCookie, body, json, send, mimeOf, type Req, type Res } from './http.ts';
import { extraRoutes } from './cham.ts';

export type Opts = { root: string; data: string; matKhau: string; ai?: { key: string; model?: string } | null; log?: (m: string) => void };
export type Ctx = Awaited<ReturnType<typeof createApp>>['ctx'];

const now = () => new Date().toISOString();
const FILE_OK = /^(pages\/(p[1-9]\d*\.html|style\.css)|fonts\/[\w.-]+\.woff2|media\/[\w.-]+\.(png|jpe?g|webp|gif|svg)|slots\.json|manifest\.json)$/;

export async function createApp(o: Opts) {
  const st = new Store(o.data), khoa: Khoa = await loadKhoa(o.data);
  const gvTokens = new Set<string>();
  const log = o.log || (() => {});
  const subs = new Map<string, Set<Res>>();     // phienId → kênh giáo viên
  const hsSubs = new Map<string, Set<Res>>();   // phienId → kênh học sinh
  const slotCache = new Map<string, { slots: Slot[]; key: Key; manifest: Manifest }>();
  const goiData = (id: string) => {
    let c = slotCache.get(id);
    if (!c) { c = { slots: st.goiJson<Slot[]>(id, 'slots.json'), key: st.goiJson<Key>(id, 'key.json'), manifest: st.goiJson<Manifest>(id, 'manifest.json') }; slotCache.set(id, c); }
    return c;
  };

  // ---------- trang tĩnh ----------
  const page = (f: string) => {
    const p = join(o.root, f); if (!existsSync(p)) return null;
    // thẻ meta báo cho trang biết đang chạy trên máy chủ lớp thử (WS Editor: ký / gửi gói qua máy chủ)
    return readFileSync(p, 'utf8').replace(/<head>/i, '<head>\n<meta name="ws-lop" content="1">');
  };
  const lopHtml = () => page('server/public/lop.html') || '<meta charset="utf-8"><p>Chưa có server/public/lop.html: chạy <code>cd app && npm run build:lop</code></p>';

  // ---------- quyền ----------
  const isGv = (r: Req) => !!r.cookies.gv && gvTokens.has(r.cookies.gv);
  const needGv = (r: Req) => { if (!isGv(r)) throw new HttpError(401, 'cần đăng nhập giáo viên'); };
  const hsOf = (r: Req): { p: Phien; hs: string; bai: Bai } => {
    const [pid, hs, tok] = (r.cookies.hs || '').split('.');
    const p = st.phien.find(x => x.id === pid), bai = p && p.bai[hs];
    if (!p || !bai || !bai.token || !tok || bai.token !== tok) throw new HttpError(401, 'chưa vào phiên (nhập mã phiên và chọn tên)');
    return { p, hs, bai };
  };

  // ---------- sự kiện trực tiếp ----------
  const sse = (res: Res, set: Set<Res>) => {
    res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-store', connection: 'keep-alive' });
    res.write(': mo\n\n'); set.add(res);
    const ping = setInterval(() => res.write(': ping\n\n'), 20000);
    res.on('close', () => { clearInterval(ping); set.delete(res); });
  };
  const emit = (map: Map<string, Set<Res>>, pid: string, ev: string, data: unknown) => {
    const s = map.get(pid); if (!s) return;
    const m = `event: ${ev}\ndata: ${JSON.stringify(data)}\n\n`; s.forEach(r => r.write(m));
  };
  const chan = (map: Map<string, Set<Res>>, pid: string) => { let s = map.get(pid); if (!s) { s = new Set(); map.set(pid, s); } return s; };

  // ---------- dữ liệu trả về ----------
  const progress = (p: Phien, hs: string) => {
    const { slots } = goiData(p.goi), b = p.bai[hs], n = slots.length;
    const done = b ? slots.filter(s => !isBlank(b.answers[s.id])).length : 0;
    return { hs, trangThai: !b || !b.vaoLuc ? 'chua-vao' : b.nopLuc ? 'da-nop' : 'dang-lam', daLam: done, tong: n, nopLuc: b?.nopLuc, tuNop: !!b?.tuNop, luuLuc: b?.luuLuc, xongCham: !!b?.cham?.xongLuc };
  };
  const phienView = (p: Phien) => {
    const lop = st.lop.find(l => l.id === p.lop), g = st.goi.find(x => x.id === p.goi);
    return { ...p, bai: undefined, lopTen: lop?.ten || '(lớp đã xóa)', goiTen: g?.title || '(gói đã xóa)',
      hocSinh: (lop?.hocSinh || []).map(h => ({ ...h, ...progress(p, h.id) })) };
  };
  const cleanAnswers = (p: Phien, a: unknown): Answers => {
    if (!a || typeof a !== 'object' || Array.isArray(a)) throw bad('bài làm không hợp lệ');
    const ids = new Set(goiData(p.goi).slots.map(s => s.id)), out: Answers = {};
    for (const [k, v] of Object.entries(a as Record<string, unknown>)) {
      if (!ids.has(k)) continue;
      if (v == null || v === '') continue;
      if (typeof v === 'string') { if (v.length > 4000) throw bad('câu trả lời quá dài'); out[k] = v; }
      else if (Array.isArray(v) && v.length <= 60 && v.every(x => typeof x === 'string' && x.length <= 200)) { if (v.length) out[k] = v as string[]; }
      else throw bad('câu trả lời không hợp lệ');
    }
    return out;
  };
  const notify = (p: Phien, hs: string) => emit(subs, p.id, 'hs', progress(p, hs));

  const ctx = { st, khoa, goiData, phienView, progress, emit: (pid: string, ev: string, d: unknown) => emit(subs, pid, ev, d), ai: o.ai || null };

  // ---------- định tuyến ----------
  type H = (r: Req, res: Res, m: RegExpMatchArray) => Promise<unknown> | unknown;
  const routes: [string, RegExp, H][] = [];
  const on = (method: string, path: string, h: H) => routes.push([method, new RegExp('^' + path.replace(/:(\w+)/g, '([^/]+)') + '$'), h]);

  on('GET', '/', (_r, res) => { res.writeHead(302, { location: '/gv' }); res.end(); });
  on('GET', '/gv', (_r, res) => send(res, 200, lopHtml(), 'text/html; charset=utf-8'));
  on('GET', '/hs', (_r, res) => send(res, 200, lopHtml(), 'text/html; charset=utf-8'));
  on('GET', '/editor', (_r, res) => { const h = page('ws-editor.html'); if (!h) throw new HttpError(404, 'thiếu ws-editor.html'); send(res, 200, h, 'text/html; charset=utf-8'); });
  on('GET', '/fonts/:f', (_r, res, m) => {
    const f = decodeURIComponent(m[1]); if (!/^[\w.-]+\.woff2$/.test(f)) throw new HttpError(404, 'không có');
    const p = join(o.root, 'fonts', f); if (!existsSync(p)) throw new HttpError(404, 'không có');
    res.writeHead(200, { 'content-type': 'font/woff2', 'cache-control': 'max-age=86400' }); res.end(readFileSync(p));
  });
  on('GET', '/favicon.ico', (_r, res) => { res.writeHead(204); res.end(); });

  // giáo viên
  on('POST', '/api/gv/dang-nhap', async (r, res) => {
    const { matKhau } = await json<{ matKhau?: string }>(r);
    const a = Buffer.from(String(matKhau || '')), b = Buffer.from(o.matKhau);
    if (a.length !== b.length || !timingSafeEqual(a, b)) throw new HttpError(403, 'sai mật khẩu');
    const t = randomBytes(18).toString('hex'); gvTokens.add(t); setCookie(res, 'gv', t, 60 * 60 * 12); return { ok: true };
  });
  on('POST', '/api/gv/dang-xuat', (r, res) => { gvTokens.delete(r.cookies.gv); setCookie(res, 'gv', '', 0); return { ok: true }; });
  on('GET', '/api/gv/toi', r => ({ gv: isGv(r), ai: !!o.ai }));
  on('GET', '/api/gv/dia-chi', r => {   // địa chỉ để học sinh cùng wifi vào (hiện trên màn phiên + mã QR)
    needGv(r);
    const lan = Object.values(networkInterfaces()).flat().filter(a => a && a.family === 'IPv4' && !a.internal).map(a => a!.address);
    return { lan, port: (server.address() as { port: number } | null)?.port || 0 };
  });

  // khóa và ký (thay dịch vụ ký của công ty khi thử)
  on('GET', '/api/wsp/khoa', () => ({ keyId: khoa.keyId, signPublic: khoa.sign.publicKey, trPublic: khoa.box.publicKey }));
  on('POST', '/api/wsp/ky', async r => {
    needGv(r);
    const { data } = await json<{ data?: string }>(r); if (!data) throw bad('thiếu data');
    const k = await crypto.subtle.importKey('jwk', khoa.sign.privateKey, 'Ed25519', false, ['sign']);
    return { signature: toB64(new Uint8Array(await crypto.subtle.sign('Ed25519', k, fromB64(data)))) };
  });

  // gói phiếu
  on('GET', '/api/goi', r => { needGv(r); return st.goi.slice().reverse(); });
  on('POST', '/api/goi', async r => {
    needGv(r);
    const b = await body(r, 80 * 1048576);
    const rep = await inspectWsp(b, { trust: trustOf(o.data, khoa), who: 'tr', privateKey: khoa.box.privateKey });
    if (!rep.ok || !rep.files || !rep.manifest || !rep.envelope) throw new HttpError(422, 'Gói không đạt: ' + rep.errors.slice(0, 6).join('; '));
    const m = rep.manifest, id = `${m.sheetId.replace(/[^\w-]/g, '_')}@v${m.version}`;
    const files = { ...rep.files }; delete files['source.json'];   // máy chủ không cần phiếu gốc
    const g: Goi = { id, sheetId: m.sheetId, version: m.version, title: m.title, taoLuc: now(), contentHash: m.contentHash, stats: m.stats, warnings: rep.warnings, keyId: rep.envelope.keyId };
    st.saveGoi(g, files); slotCache.delete(id); log(`nhận gói ${id} (${m.title})`);
    return g;
  });
  on('DELETE', '/api/goi/:id', (r, _res, m) => {
    needGv(r); const id = decodeURIComponent(m[1]);
    if (st.phien.some(p => p.goi === id)) throw bad('gói đang dùng trong phiên: xóa phiên trước');
    st.delGoi(id); slotCache.delete(id); return { ok: true };
  });
  // file của gói: học sinh (đang ở phiên dùng gói) hoặc giáo viên; chỉ phần đề
  on('GET', '/api/goi/:id/f/(.+)', (r, res, m) => {
    const id = decodeURIComponent(m[1]), path = decodeURIComponent(m[2]);
    if (!isGv(r)) { const { p } = hsOf(r); if (p.goi !== id) throw new HttpError(403, 'không thuộc phiên của em'); }
    if (!FILE_OK.test(path)) throw new HttpError(404, 'không có');   // FILE_OK chỉ nhận đúng các tên file hợp lệ; không dùng path.normalize (Windows đổi / thành \\ nên mọi file bị từ chối)
    const f = st.goiFile(id, path); if (!f) throw new HttpError(404, 'không có');
    res.writeHead(200, { 'content-type': mimeOf(path), 'cache-control': 'private, max-age=3600', 'x-content-type-options': 'nosniff' }); res.end(f);
  });
  on('GET', '/api/goi/:id/dap-an', (r, _res, m) => { needGv(r); return goiData(decodeURIComponent(m[1])).key; });

  // lớp
  const hsList = (a: unknown, old: Lop['hocSinh'] = []) => {
    if (!Array.isArray(a)) throw bad('danh sách học sinh không hợp lệ');
    const names = a.map(x => String(x || '').trim()).filter(Boolean);
    if (names.length > 80) throw bad('tối đa 80 học sinh một lớp');
    if (new Set(names.map(n => n.toLowerCase())).size !== names.length) throw bad('có tên trùng nhau: thêm chữ để phân biệt (ví dụ An A, An B)');
    const left = [...old];
    return names.map(n => { const i = left.findIndex(h => h.ten === n); if (i >= 0) return left.splice(i, 1)[0]; return { id: newId('hs'), ten: n.slice(0, 60) }; });
  };
  on('GET', '/api/lop', r => { needGv(r); return st.lop; });
  on('POST', '/api/lop', async r => {
    needGv(r); const b = await json<{ ten?: string; hocSinh?: string[] }>(r);
    const ten = String(b.ten || '').trim(); if (!ten) throw bad('thiếu tên lớp');
    const l: Lop = { id: newId('lop'), ten: ten.slice(0, 80), hocSinh: hsList(b.hocSinh || []), taoLuc: now() };
    st.lop.push(l); st.touch('lop'); return l;
  });
  on('PUT', '/api/lop/:id', async (r, _res, m) => {
    needGv(r); const l = st.lop.find(x => x.id === m[1]); if (!l) throw new HttpError(404, 'không có lớp');
    const b = await json<{ ten?: string; hocSinh?: string[] }>(r);
    if (b.ten != null) { const t = String(b.ten).trim(); if (!t) throw bad('thiếu tên lớp'); l.ten = t.slice(0, 80); }
    if (b.hocSinh) l.hocSinh = hsList(b.hocSinh, l.hocSinh);
    st.touch('lop'); return l;
  });
  on('DELETE', '/api/lop/:id', (r, _res, m) => {
    needGv(r); if (st.phien.some(p => p.lop === m[1])) throw bad('lớp đang có phiên: xóa phiên trước');
    st.lop = st.lop.filter(x => x.id !== m[1]); st.touch('lop'); return { ok: true };
  });

  // phiên
  on('GET', '/api/phien', r => { needGv(r); return st.phien.slice().reverse().map(phienView); });
  on('POST', '/api/phien', async r => {
    needGv(r); const b = await json<{ lop?: string; goi?: string; ten?: string }>(r);
    const l = st.lop.find(x => x.id === b.lop); if (!l) throw bad('chọn lớp');
    const g = st.goi.find(x => x.id === b.goi); if (!g) throw bad('chọn gói phiếu');
    if (!l.hocSinh.length) throw bad('lớp chưa có học sinh');
    let ma = newMa(); while (st.phien.some(p => p.ma === ma && p.trangThai === 'mo')) ma = newMa();
    const p: Phien = { id: newId('ph'), ma, ten: String(b.ten || '').trim().slice(0, 80) || g.title, lop: l.id, goi: g.id, trangThai: 'mo', taoLuc: now(), bai: {} };
    st.phien.push(p); st.touch(`phien:${p.id}`); return phienView(p);
  });
  const phienOf = (id: string) => { const p = st.phien.find(x => x.id === id); if (!p) throw new HttpError(404, 'không có phiên'); return p; };
  on('GET', '/api/phien/:id', (r, _res, m) => { needGv(r); return phienView(phienOf(m[1])); });
  on('POST', '/api/phien/:id/ket-thuc', (r, _res, m) => {
    needGv(r); const p = phienOf(m[1]); if (p.trangThai === 'dong') return phienView(p);
    p.trangThai = 'dong'; p.dongLuc = now();
    for (const b of Object.values(p.bai)) if (b.vaoLuc && !b.nopLuc) { b.nopLuc = p.dongLuc; b.tuNop = true; }   // chưa nộp: thu bài đang làm
    st.touch(`phien:${p.id}`); emit(hsSubs, p.id, 'dong', {}); emit(subs, p.id, 'phien', phienView(p)); log(`kết thúc phiên ${p.ma}`);
    return phienView(p);
  });
  on('POST', '/api/phien/:id/mo-khoa/:hs', (r, _res, m) => {   // em đổi máy: bỏ khóa tên để vào lại (bài làm giữ nguyên)
    needGv(r); const p = phienOf(m[1]), b = p.bai[m[2]]; if (b) { delete b.token; st.touch(`phien:${p.id}`); emit(hsSubs, p.id, 'mo-khoa', { hs: m[2] }); }
    return { ok: true };
  });
  on('DELETE', '/api/phien/:id', (r, _res, m) => { needGv(r); const p = phienOf(m[1]); emit(hsSubs, p.id, 'xoa', {}); st.delPhien(p.id); return { ok: true }; });
  on('GET', '/api/phien/:id/su-kien', (r, res, m) => { needGv(r); const p = phienOf(m[1]); sse(res, chan(subs, p.id)); return undefined; });

  // học sinh
  // học sinh mở trang: đã vào phiên nào chưa (không báo lỗi 401 khi chưa vào)
  on('GET', '/api/hs/toi', r => { try { hsOf(r); return { vao: true }; } catch { return { vao: false }; } });
  on('GET', '/api/hs/phien', r => {
    const ma = String(r.query.get('ma') || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const p = st.phien.filter(x => x.ma === ma).sort((a, b) => b.taoLuc.localeCompare(a.taoLuc))[0];
    if (!p) throw new HttpError(404, 'Không có phiên với mã này. Em xem lại mã trên bảng nhé.');
    const l = st.lop.find(x => x.id === p.lop);
    return { id: p.id, ten: p.ten, trangThai: p.trangThai, lop: l?.ten, hocSinh: (l?.hocSinh || []).map(h => ({ id: h.id, ten: h.ten, daVao: !!p.bai[h.id]?.token })) };
  });
  on('POST', '/api/hs/vao', async (r, res) => {
    const b = await json<{ phien?: string; hs?: string }>(r);
    const p = phienOf(String(b.phien)), l = st.lop.find(x => x.id === p.lop), h = l?.hocSinh.find(x => x.id === b.hs);
    if (!h) throw bad('không có tên này trong lớp');
    const [pid, hs0, tok0] = (r.cookies.hs || '').split('.');
    let bai = p.bai[h.id];
    const mine = bai && bai.token && pid === p.id && hs0 === h.id && tok0 === bai.token;
    if (bai && bai.token && !mine) throw new HttpError(409, 'Tên này đã vào trên một máy khác. Em nhờ cô / thầy bấm "Mở khóa" cho tên mình.');
    if (!bai) bai = p.bai[h.id] = { answers: {} };
    if (!mine) { bai.token = randomBytes(12).toString('hex'); bai.vaoLuc = bai.vaoLuc || now(); setCookie(res, 'hs', `${p.id}.${h.id}.${bai.token}`, 60 * 60 * 24); }
    st.touch(`phien:${p.id}`); notify(p, h.id);
    return { ok: true };
  });
  on('GET', '/api/hs/bai', r => {
    const { p, hs, bai } = hsOf(r), g = st.goi.find(x => x.id === p.goi), d = goiData(p.goi);
    const h = st.lop.find(x => x.id === p.lop)?.hocSinh.find(x => x.id === hs);
    return { phien: { id: p.id, ten: p.ten, trangThai: p.trangThai }, hs: { id: hs, ten: h?.ten || '' }, goi: { id: p.goi, title: g?.title || d.manifest.title, pages: d.manifest.pages.map(x => x.file), docMode: d.manifest.docMode },
      slots: d.slots, answers: bai.answers, nopLuc: bai.nopLuc || null };
  });
  on('PUT', '/api/hs/bai', async r => {
    const { p, hs, bai } = hsOf(r);
    if (p.trangThai !== 'mo') throw new HttpError(409, 'Phiên đã kết thúc: không sửa bài được nữa.');
    if (bai.nopLuc) throw new HttpError(409, 'Em đã nộp bài rồi.');
    bai.answers = cleanAnswers(p, (await json<{ answers?: unknown }>(r)).answers); bai.luuLuc = now();
    st.touch(`phien:${p.id}`); notify(p, hs); return { ok: true, luuLuc: bai.luuLuc };
  });
  on('POST', '/api/hs/nop', async r => {
    const { p, hs, bai } = hsOf(r);
    if (p.trangThai !== 'mo') throw new HttpError(409, 'Phiên đã kết thúc.');
    if (!bai.nopLuc) { const b = await json<{ answers?: unknown }>(r); if (b.answers) bai.answers = cleanAnswers(p, b.answers); bai.luuLuc = bai.nopLuc = now(); }
    st.touch(`phien:${p.id}`); notify(p, hs); log(`phiên ${p.ma}: một em nộp bài`);
    return { ok: true, nopLuc: bai.nopLuc };
  });
  on('GET', '/api/hs/su-kien', (r, res) => { const { p } = hsOf(r); sse(res, chan(hsSubs, p.id)); return undefined; });

  extraRoutes(on, ctx, { needGv, phienOf, grade });

  // ---------- máy chủ ----------
  const server: Server = createServer(async (req0, res) => {
    const u = new URL(req0.url || '/', 'http://x'), r = req0 as Req;
    r.path = u.pathname; r.query = u.searchParams; r.cookies = parseCookies(req0.headers.cookie);
    try {
      // chặn trang khác gửi lệnh thay giáo viên (CSRF): lệnh ghi phải từ chính máy chủ này
      if (req0.method !== 'GET' && req0.headers.origin && new URL(req0.headers.origin).host !== req0.headers.host) throw new HttpError(403, 'không cho phép từ trang khác');
      for (const [m, re, h] of routes) {
        if (m !== req0.method) continue;
        const mm = r.path.match(re); if (!mm) continue;
        const out = await h(r, res, mm);
        if (!res.headersSent && out !== undefined) send(res, 200, out);
        return;
      }
      throw new HttpError(404, 'không có trang này');
    } catch (e) {
      const he = e instanceof HttpError ? e : new HttpError(500, 'lỗi máy chủ: ' + (e as Error).message);
      if (he.code === 500) log(String((e as Error).stack || e));
      if (!res.headersSent) send(res, he.code, { loi: he.message }); else res.end();
    }
  });
  const close = () => new Promise<void>(ok => { st.flush(); for (const s of [...subs.values(), ...hsSubs.values()]) s.forEach(r => r.end()); server.close(() => ok()); server.closeAllConnections?.(); });
  return { server, close, ctx };
}
