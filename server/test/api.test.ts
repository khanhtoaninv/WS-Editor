// Máy chủ lớp thử: API từ đầu tới cuối (không trình duyệt). Chạy: npm run test:lop
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from '../src/app.ts';
import { buildFiles, sealWsp, genSignKey, localSigner, fromB64, toB64, type Slot, type Key } from '../../shared/src/index.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SLOTS: Slot[] = [
  { id: 't1.i1', task: 't1', item: 'i1', label: '1', q: 'Q1', interaction: 'text', grading: 'auto' },
  { id: 't1.i2', task: 't1', item: 'i2', label: '2', q: 'Q1', interaction: 'text', grading: 'auto' },
  { id: 't2.i1', task: 't2', item: 'i1', label: '1', q: 'Q3', interaction: 'choice-one', grading: 'auto', options: [{ id: 'a', text: 'cat' }, { id: 'b', text: 'dog' }, { id: 'c', text: 'cow' }] },
  { id: 't3.i1', task: 't3', item: 'i1', label: '1', q: 'Q12', interaction: 'text-long', grading: 'manual' },
];
export const KEY: Key = {
  't1.i1': { type: 'text', score: 1, accept: ['goes'] }, 't1.i2': { type: 'text', score: 1, accept: ['plays'] },
  't2.i1': { type: 'choice-one', score: 1, correct: 'b' }, 't3.i1': { type: 'text-long', score: 2, grading: 'manual', sample: 'I like dogs because they are friendly.' },
};
const PAGE = '<div class="page paper wsp-pg"><div class="flow"><section class="task" data-task="t1"><span data-ans="t1.i1"></span><span data-ans="t1.i2"></span></section><section class="task" data-task="t2"><div data-ans="t2.i1"><b>cat</b><b>dog</b><b>cow</b></div></section><section class="task" data-task="t3"><div data-ans="t3.i1"></div></section></div></div>';

// fetch có giữ cookie (mỗi "máy" một hũ)
export function client(base: string) {
  const jar: Record<string, string> = {};
  return async (path: string, o: { method?: string; json?: unknown; body?: Uint8Array } = {}) => {
    const h: Record<string, string> = { cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join('; ') };
    if (o.json !== undefined) h['content-type'] = 'application/json';
    const r = await fetch(base + path, { method: o.method || (o.json !== undefined || o.body ? 'POST' : 'GET'), headers: h, body: o.json !== undefined ? JSON.stringify(o.json) : o.body });
    for (const c of r.headers.getSetCookie()) { const [kv] = c.split(';'); const i = kv.indexOf('='); jar[kv.slice(0, i)] = kv.slice(i + 1); }
    const t = await r.text(); let j: any = t; try { j = JSON.parse(t); } catch { /* html */ }
    return { status: r.status, j };
  };
}

export async function boot() {
  const data = mkdtempSync(join(tmpdir(), 'lop-'));
  const app = await createApp({ root: ROOT, data, matKhau: '123456' });
  await new Promise<void>(ok => app.server.listen(0, '127.0.0.1', () => ok()));
  const base = `http://127.0.0.1:${(app.server.address() as { port: number }).port}`;
  return { app, base, data, stop: async () => { await app.close(); rmSync(data, { recursive: true, force: true }); } };
}

// gói thử ký bằng máy chủ (như WS Editor mở từ /editor)
export async function upload(gv: ReturnType<typeof client>) {
  const k = (await gv('/api/wsp/khoa')).j;
  const { files, manifest } = await buildFiles({ sheetId: 'ws-thu', version: 1, title: 'Phiếu thử', pages: [PAGE], css: '.task{}', slots: SLOTS, key: KEY, docMode: 'quirks' });
  const signer = { keyId: k.keyId, sign: async (d: Uint8Array) => fromB64((await gv('/api/wsp/ky', { json: { data: toB64(d) } })).j.signature) };
  const w = await sealWsp(files, manifest, { signer, recipients: { tr: k.trPublic }, producer: 'test' });
  return gv('/api/goi', { body: w });
}

test('lớp học thử: đăng nhập, lớp, gói, phiên, học sinh làm và nộp, kết thúc', async () => {
  const S = await boot();
  try {
    const gv = client(S.base);
    assert.equal((await gv('/api/lop')).status, 401, 'chưa đăng nhập');
    assert.equal((await gv('/api/gv/dang-nhap', { json: { matKhau: 'sai' } })).status, 403);
    assert.equal((await gv('/api/gv/dang-nhap', { json: { matKhau: '123456' } })).status, 200);
    assert.equal((await gv('/api/lop', { json: { ten: '4A', hocSinh: ['An', 'an'] } })).status, 400, 'tên trùng');
    const lop = (await gv('/api/lop', { json: { ten: '4A', hocSinh: ['An', 'Bình', 'Chi'] } })).j;
    assert.equal(lop.hocSinh.length, 3);
    // gói ký bằng khóa lạ → từ chối
    const other = await genSignKey(), k = (await gv('/api/wsp/khoa')).j;
    const b0 = await buildFiles({ sheetId: 'x', version: 1, title: 'x', pages: [PAGE], css: '', slots: SLOTS, key: KEY });
    const bad = await sealWsp(b0.files, b0.manifest, { signer: localSigner('la', other.privateKey), recipients: { tr: k.trPublic }, producer: 't' });
    assert.equal((await gv('/api/goi', { body: bad })).status, 422);
    const g = await upload(gv); assert.equal(g.status, 200, JSON.stringify(g.j)); assert.equal(g.j.id, 'ws-thu@v1');
    const ph = (await gv('/api/phien', { json: { lop: lop.id, goi: g.j.id } })).j;
    assert.match(ph.ma, /^[A-Z2-9]{6}$/);
    // học sinh
    const an = client(S.base), chi = client(S.base), lau = client(S.base);
    const info = (await an(`/api/hs/phien?ma=${ph.ma.toLowerCase()}`)).j;
    assert.equal(info.hocSinh.length, 3);
    assert.equal((await an('/api/hs/bai')).status, 401, 'chưa vào');
    assert.equal((await an('/api/hs/vao', { json: { phien: info.id, hs: lop.hocSinh[0].id } })).status, 200);
    assert.equal((await lau('/api/hs/vao', { json: { phien: info.id, hs: lop.hocSinh[0].id } })).status, 409, 'tên đã có máy khác');
    const bai = (await an('/api/hs/bai')).j;
    assert.equal(bai.slots.length, 4);
    const all = JSON.stringify(bai);
    assert.ok(!all.includes('goes') && !all.includes('friendly') && !all.includes('"correct"'), 'học sinh không nhận đáp án');
    assert.equal((await an(`/api/goi/${encodeURIComponent(g.j.id)}/f/key.json`)).status, 404, 'không lấy được key.json');
    for (const bad of ["pages%2F..%2F..%2Fkey.json", "pages/../key.json", "..%2Fkey.json", "pages%5Cp1.html"]) assert.equal((await an(`/api/goi/${encodeURIComponent(g.j.id)}/f/${bad}`)).status, 404, "đường dẫn lạ bị chặn: " + bad);
    assert.equal((await an(`/api/goi/${encodeURIComponent(g.j.id)}/dap-an`)).status, 401);
    assert.equal((await an(`/api/goi/${encodeURIComponent(g.j.id)}/f/pages/p1.html`)).status, 200);
    assert.equal((await lau(`/api/goi/${encodeURIComponent(g.j.id)}/f/pages/p1.html`)).status, 401, 'người ngoài không lấy được trang');
    assert.equal((await an('/api/hs/bai', { method: 'PUT', json: { answers: { 't1.i1': 'goes', 'x.y': 'lạ' } } })).status, 200);
    let v = (await gv(`/api/phien/${ph.id}`)).j;
    const pa = v.hocSinh.find((h: any) => h.ten === 'An');
    assert.equal(pa.trangThai, 'dang-lam'); assert.equal(pa.daLam, 1); assert.equal(pa.tong, 4);
    assert.equal((await an('/api/hs/nop', { json: { answers: { 't1.i1': 'goes', 't2.i1': 'a', 't3.i1': 'I like dogs.' } } })).status, 200);
    assert.equal((await an('/api/hs/bai', { method: 'PUT', json: { answers: {} } })).status, 409, 'nộp rồi không sửa');
    // Chi vào, làm dở; giáo viên mở khóa cho Lâu dùng tên An (đổi máy)
    await chi('/api/hs/vao', { json: { phien: info.id, hs: lop.hocSinh[2].id } });
    await chi('/api/hs/bai', { method: 'PUT', json: { answers: { 't1.i2': 'plays' } } });
    await gv(`/api/phien/${ph.id}/mo-khoa/${lop.hocSinh[0].id}`, { json: {} });
    assert.equal((await lau('/api/hs/vao', { json: { phien: info.id, hs: lop.hocSinh[0].id } })).status, 200, 'sau mở khóa vào được');
    assert.equal((await lau('/api/hs/bai')).j.answers['t1.i1'], 'goes', 'bài làm giữ nguyên khi đổi máy');
    // kết thúc: Chi chưa nộp → thu bài
    v = (await gv(`/api/phien/${ph.id}/ket-thuc`, { json: {} })).j;
    const st = Object.fromEntries(v.hocSinh.map((h: any) => [h.ten, h.trangThai]));
    assert.deepEqual(st, { An: 'da-nop', 'Bình': 'chua-vao', Chi: 'da-nop' });
    assert.equal(v.hocSinh.find((h: any) => h.ten === 'Chi').tuNop, true);
    assert.equal((await chi('/api/hs/bai', { method: 'PUT', json: { answers: {} } })).status, 409, 'phiên đóng');
    // CSRF: lệnh ghi từ trang khác bị chặn
    const r = await fetch(S.base + '/api/lop', { method: 'POST', headers: { origin: 'http://evil.example', 'content-type': 'application/json' }, body: '{}' });
    assert.equal(r.status, 403);
  } finally { await S.stop(); }
});

test('dữ liệu còn sau khi khởi động lại máy chủ', async () => {
  const data = mkdtempSync(join(tmpdir(), 'lop-'));
  try {
    let app = await createApp({ root: ROOT, data, matKhau: '1' });
    app.ctx.st.lop.push({ id: 'lop-1', ten: 'X', hocSinh: [], taoLuc: '' }); app.ctx.st.touch('lop'); await app.close();
    app = await createApp({ root: ROOT, data, matKhau: '1' });
    assert.equal(app.ctx.st.lop[0].ten, 'X'); await app.close();
  } finally { rmSync(data, { recursive: true, force: true }); }
});
