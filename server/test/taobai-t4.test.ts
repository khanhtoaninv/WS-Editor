// Module Tạo bài v128 (Thiết lập, Kho phiếu) + v129 (lượt gọi AI qua máy chủ). Chạy: npm run test:lop
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtempSync, existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { boot, client } from './api.test.ts';
import { taobaiRoutes } from '../src/taobai/api.ts';
import { HttpError, send, parseCookies, type Req } from '../src/http.ts';

const KT = '# Kiến thức · Unit 5 · Lesson 2: was / were\nPhiên bản: 2\n\n## Mục tiêu\nDùng was / were (bản 2).\n';

/** Máy chủ AI giả: Claude (/v1/messages) và tương thích OpenAI (/chat/completions). Ghi lại yêu cầu nhận được. */
export async function aiGia(tra: (body: any, path: string) => { status?: number; json: any; delay?: number }) {
  const nhan: { path: string; body: any; headers: any }[] = [];
  const sv = createServer(async (req, res) => {
    let b = ''; for await (const c of req) b += c;
    const body = JSON.parse(b || '{}'); nhan.push({ path: req.url || '', body, headers: req.headers });
    const r = tra(body, req.url || ''); if (r.delay) await new Promise(ok => setTimeout(ok, r.delay));
    res.writeHead(r.status || 200, { 'content-type': 'application/json' }); res.end(JSON.stringify(r.json));
  });
  await new Promise<void>(ok => sv.listen(0, '127.0.0.1', () => ok()));
  return { url: `http://127.0.0.1:${(sv.address() as any).port}`, nhan, close: () => new Promise<void>(ok => sv.close(() => ok())) };
}
export const claudeOk = (text: string) => ({ json: { model: 'claude-haiku-5-5', content: [{ type: 'text', text }], stop_reason: 'end_turn', usage: { input_tokens: 120, output_tokens: 30 } } });

test('Thiết lập: kho chép bộ mẫu lần đầu, nạp / thay / bỏ file Kiến thức (giữ bản cũ), đường dẫn lạ bị chặn', async () => {
  const { base, stop: close, data } = await boot(), c = client(base);
  try {
    let r = await c('/api/taobai/tong-quan');
    assert.equal(r.status, 200); assert.equal(r.j.quyen, true, 'máy chạy máy chủ có quyền sửa');
    const g = r.j.giaoTrinh[0], l2 = g.units[0].lessons[1];
    assert.equal(g.id, 'pinta-english-3'); assert.deepEqual(l2.kienThuc, { path: 'pinta-english-3/kien-thuc/u5-l2.md', ver: '1' }); assert.equal(l2.loi, 0);
    assert.deepEqual(g.chuyenDe.map((x: any) => [x.id, x.trinhTu.ver, x.tf.ver, x.soLesson]), [['tu-vung', '2', '2', 1], ['ngu-phap', '7', '3', 2], ['nghe', '1', '1', 1]]);
    assert.ok(existsSync(join(data, 'tao-bai', 'du-lieu', 'pinta-english-3', 'giao-trinh.md')), 'bộ mẫu chép vào thư mục dữ liệu ghi được');
    r = await c('/api/taobai/tep', { method: 'PUT', json: { path: l2.kienThuc.path, text: '﻿' + KT.replace(/\n/g, '\r\n') } });
    assert.equal(r.status, 200, JSON.stringify(r.j)); assert.equal(r.j.doi, true);
    assert.equal(r.j.giaoTrinh[0].units[0].lessons[1].kienThuc.ver, '2', 'trả cây mới');
    r = await c('/api/taobai/tep?path=' + encodeURIComponent(l2.kienThuc.path)); assert.equal(r.j.text, KT, 'bỏ BOM, đổi xuống dòng Windows');
    r = await c('/api/taobai/lesson/pinta-english-3/u5-l2'); assert.equal(r.j.kienThuc.mucTieu, 'Dùng was / were (bản 2).', 'màn Ra đề đọc ngay bản mới');
    const cu = join(data, 'tao-bai', '_cu', 'pinta-english-3', 'kien-thuc'); assert.equal(readdirSync(cu).length, 1, 'bản cũ giữ ở _cu/');
    assert.match(readFileSync(join(cu, readdirSync(cu)[0]), 'utf8'), /Phiên bản: 1/);
    r = await c('/api/taobai/tep', { method: 'PUT', json: { path: l2.kienThuc.path, text: KT } }); assert.equal(r.j.doi, false, 'nạp lại y hệt: không tạo bản cũ');
    for (const p of ['../khoa.json', 'pinta-english-3/kien-thuc/../../x.md', 'pinta-english-3/khac.md', 'a/kien-thuc/u5.md'])
      assert.equal((await c('/api/taobai/tep', { method: 'PUT', json: { path: p, text: 'x' } })).status, 400, p);
    assert.equal((await c('/api/taobai/tep', { method: 'PUT', json: { path: l2.kienThuc.path, text: '  \n' } })).status, 400, 'file trống');
    r = await c('/api/taobai/tep?path=' + encodeURIComponent('pinta-english-3/kien-thuc/u5-l1.md'), { method: 'DELETE' });
    assert.equal(r.status, 200); const l1 = r.j.giaoTrinh[0].units[0].lessons[0];
    assert.equal(l1.kienThuc.ver, null); assert.equal(l1.loi, 1); assert.match(l1.loiMsg[0], /chưa có file Kiến thức/);
    // nạp cả thư mục: giáo trình mới
    r = await c('/api/taobai/tep-nhieu', { method: 'PUT', json: { files: {
      'gt-moi/giao-trinh.md': '# Giáo trình mới\nTuổi: 5-6\n\n## Chuyên đề\n- tv: Từ vựng\n\n## Unit 1: Hello\n- Lesson 1: Hi | tv\n',
      'gt-moi/kien-thuc/u1-l1.md': '# KT\nPhiên bản: 1\n## Mục tiêu\nChào hỏi\n', 'gt-moi/linh-tinh.md': 'x' } } });
    assert.equal(r.status, 200); assert.deepEqual(r.j.ok, ['gt-moi/giao-trinh.md', 'gt-moi/kien-thuc/u1-l1.md']); assert.equal(r.j.bo.length, 1);
    const gm = r.j.giaoTrinh.find((x: any) => x.id === 'gt-moi'); assert.equal(gm.units[0].lessons[0].loi, 2, 'chưa có Trình tự / TF của chuyên đề');
  } finally { await close(); }
});

test('Thiết lập: file chung riêng thay bản mặc định, về mặc định được', async () => {
  const { base, stop: close } = await boot(), c = client(base);
  try {
    let r = await c('/api/taobai/chung/3', { method: 'PUT', json: { text: '# Quy tắc hình thức\nPhiên bản: 1\n- chữ to' } });
    assert.equal(r.status, 200); assert.deepEqual([r.j.chung[2].ver, r.j.chung[2].rieng], ['1', true]);
    r = await c('/api/taobai/lesson/pinta-english-3/u5-l2'); assert.match(r.j.chung[2].raw, /chữ to/, 'gửi AI bản riêng');
    r = await c('/api/taobai/chung/3', { method: 'DELETE' }); assert.equal(r.j.chung[2].raw, null);
    r = await c('/api/taobai/chung/1', { method: 'PUT', json: { text: '# Quy tắc MD riêng\nPhiên bản: r1' } }); assert.equal(r.j.chung[0].ver, 'r1');
    r = await c('/api/taobai/chung/1', { method: 'DELETE' }); assert.match(r.j.chung[0].ver, /nháp/, 'về bản mặc định trong docs/');
    assert.equal((await c('/api/taobai/chung/9', { method: 'PUT', json: { text: 'x' } })).status, 400);
  } finally { await close(); }
});

test('Thiết lập AI: khóa chỉ ở máy chủ (trả về 4 ký tự cuối), đổi model, xóa khóa, thử kết nối (Claude và tương thích OpenAI)', async () => {
  const { base, stop: close, data } = await boot(), c = client(base);
  const ai = await aiGia((b, p) => p.includes('/chat/completions') ? { json: { model: b.model, choices: [{ message: { content: 'OK' } }], usage: { prompt_tokens: 5, completion_tokens: 1 } } } : claudeOk('OK'));
  const env0 = process.env.ANTHROPIC_API_KEY; delete process.env.ANTHROPIC_API_KEY; process.env.LOP_AI_URL = ai.url;
  try {
    let r = await c('/api/taobai/thiet-lap');
    assert.equal(r.j.ai.san, false); assert.equal(r.j.ai.claude.model, 'claude-sonnet-5-5', 'mặc định Sonnet 5.5');
    assert.deepEqual(r.j.ai.modelClaude.map((m: any) => m.ten), ['Claude Sonnet 5.5', 'Claude Haiku 5.5']);
    assert.equal((await c('/api/taobai/thiet-lap/ai/thu', { json: {} })).status, 400, 'chưa có khóa');
    r = await c('/api/taobai/thiet-lap/ai', { method: 'PUT', json: { nhaCC: 'claude', claude: { key: 'sk-ant-bimat-123456wxyz', model: 'claude-haiku-5-5' } } });
    assert.equal(r.status, 200); assert.ok(!JSON.stringify(r.j).includes('bimat'), 'không trả khóa về trình duyệt');
    assert.deepEqual([r.j.ai.san, r.j.ai.claude.duoi, r.j.ai.dangDung.model], [true, '…wxyz', 'claude-haiku-5-5']);
    assert.ok(!JSON.stringify((await c('/api/taobai/thiet-lap')).j).includes('bimat'));
    r = await c('/api/taobai/thiet-lap/ai', { method: 'PUT', json: { claude: { key: '', model: 'claude-sonnet-5-5' } } });
    assert.equal(r.j.ai.claude.duoi, '…wxyz', 'ô khóa để trống: giữ khóa cũ'); assert.equal(r.j.ai.claude.model, 'claude-sonnet-5-5');
    r = await c('/api/taobai/thiet-lap/ai/thu', { json: {} }); assert.equal(r.status, 200, JSON.stringify(r.j)); assert.equal(r.j.text, 'OK');
    const q = ai.nhan[ai.nhan.length - 1]; assert.equal(q.path, '/v1/messages'); assert.equal(q.headers['x-api-key'], 'sk-ant-bimat-123456wxyz'); assert.equal(q.body.model, 'claude-sonnet-5-5');
    assert.equal((await c('/api/taobai/thiet-lap/ai', { method: 'PUT', json: { openai: { url: 'ftp://x' } } })).status, 400);
    r = await c('/api/taobai/thiet-lap/ai', { method: 'PUT', json: { nhaCC: 'openai', openai: { url: ai.url + '/v1/', key: 'ok-key-9999', model: 'gpt-x' } } });
    assert.deepEqual([r.j.ai.san, r.j.ai.dangDung.model, r.j.ai.openai.duoi], [true, 'gpt-x', '…9999']);
    r = await c('/api/taobai/thiet-lap/ai/thu', { json: {} }); assert.equal(r.j.text, 'OK');
    const q2 = ai.nhan[ai.nhan.length - 1]; assert.equal(q2.path, '/v1/chat/completions'); assert.equal(q2.headers.authorization, 'Bearer ok-key-9999');
    r = await c('/api/taobai/thiet-lap/ai', { method: 'PUT', json: { nhaCC: 'claude', claude: { key: null } } }); assert.equal(r.j.ai.san, false, 'xóa khóa');
    assert.ok(existsSync(join(data, 'tao-bai', 'thiet-lap.json')));
    process.env.ANTHROPIC_API_KEY = 'sk-env-abcd1234';
    r = await c('/api/taobai/thiet-lap'); assert.deepEqual([r.j.ai.san, r.j.ai.claude.tuBienMoiTruong, r.j.ai.claude.duoi], [true, true, '…1234'], 'không có khóa riêng: dùng ANTHROPIC_API_KEY');
  } finally { if (env0 === undefined) delete process.env.ANTHROPIC_API_KEY; else process.env.ANTHROPIC_API_KEY = env0; delete process.env.LOP_AI_URL; await ai.close(); await close(); }
});

test('Kho phiếu: liệt kê mọi phiếu đã lưu (mới nhất trước), bỏ phiếu (chuyển vào _cu)', async () => {
  const { base, stop: close, data } = await boot(), c = client(base);
  try {
    assert.deepEqual((await c('/api/taobai/kho-phieu')).j.phieu, []);
    const w = (id: string, n: number) => ({ id, title: 'Phiếu ' + id, tasks: Array.from({ length: n }, (_, i) => ({ id: 't' + i, gen: { status: i ? 'todo' : 'ok' } })), gen: { v: 1, src: { names: { course: 'Pinta English 3', lesson: 'Lesson 2' } } } });
    await c('/api/taobai/phieu/pinta-english-3/u5-l2/a1', { method: 'PUT', json: w('a1', 3) });
    await new Promise(ok => setTimeout(ok, 5));
    await c('/api/taobai/phieu/pinta-english-3/u5-l3/b2', { method: 'PUT', json: w('b2', 5) });
    let r = await c('/api/taobai/kho-phieu');
    assert.deepEqual(r.j.phieu.map((p: any) => [p.ls, p.id, p.n, p.duyet, p.names.course]), [['u5-l3', 'b2', 5, 1, 'Pinta English 3'], ['u5-l2', 'a1', 3, 1, 'Pinta English 3']]);
    r = await c('/api/taobai/phieu/pinta-english-3/u5-l2/a1', { method: 'DELETE' }); assert.equal(r.status, 200);
    assert.equal((await c('/api/taobai/kho-phieu')).j.phieu.length, 1);
    assert.equal(readdirSync(join(data, 'tao-bai', '_cu', 'phieu', 'pinta-english-3', 'u5-l2')).length, 1);
    assert.equal((await c('/api/taobai/phieu/pinta-english-3/u5-l2/a1', { method: 'DELETE' })).status, 404);
  } finally { await close(); }
});

test('Quyền: máy khác (không đăng nhập giáo viên) chỉ xem, không sửa dữ liệu / khóa / gọi AI', async () => {
  const data = mkdtempSync(join(tmpdir(), 'tb-q-')), routes: [string, RegExp, any][] = [];
  taobaiRoutes((m, p, h) => routes.push([m, new RegExp('^' + p.replace(/:(\w+)/g, '([^/]+)') + '$'), h]), { data, quyen: () => false });
  const sv = createServer(async (req, res) => {
    const u = new URL(req.url || '/', 'http://x'), r = req as Req; r.path = u.pathname; r.query = u.searchParams; r.cookies = parseCookies(req.headers.cookie);
    try { for (const [m, re, h] of routes) { const mm = m === req.method && r.path.match(re); if (mm) { send(res, 200, await h(r, res, mm)); return; } } throw new HttpError(404, 'x'); }
    catch (e) { send(res, (e as HttpError).code || 500, { loi: (e as Error).message }); }
  });
  await new Promise<void>(ok => sv.listen(0, '127.0.0.1', () => ok()));
  const c = client(`http://127.0.0.1:${(sv.address() as any).port}`);
  try {
    assert.equal((await c('/api/taobai/tong-quan')).j.quyen, false);
    assert.equal((await c('/api/taobai/lesson/pinta-english-3/u5-l2')).status, 200, 'xem / Ra đề vẫn được');
    for (const [m, p, j] of [['PUT', '/api/taobai/tep', { path: 'pinta-english-3/kien-thuc/u5-l2.md', text: KT }], ['PUT', '/api/taobai/thiet-lap/ai', { claude: { key: 'x' } }], ['POST', '/api/taobai/ai', { prompt: 'x' }], ['PUT', '/api/taobai/chung/1', { text: 'x' }]] as const) {
      const r = await c(p, { method: m, json: j }); assert.equal(r.status, 403, p); assert.match(r.j.loi, /đăng nhập giáo viên/);
    }
  } finally { await new Promise<void>(ok => sv.close(() => ok())); rmSync(data, { recursive: true, force: true }); }
});

// ---------- v129 ----------
import { dungNhac, nhacChep, mucQ, NHAC_VER } from '../../shared/src/taobai/index.ts';
import { chiTietLesson, DATA_DIR } from '../src/taobai/nguon.ts';

test('Đoạn nhắc sinh một bài: đủ phần, chỉ mục Q được giao, đánh dấu bài cần viết, gửi lại kèm lỗi, sinh lại kèm góp ý', () => {
  const les = chiTietLesson(DATA_DIR, 'pinta-english-3', 'u5-l2')!;
  const ct = [{ step: 1, role: 'nhận diện', q: 'Q4', n: 5 }, { step: 2, role: 'luyện', q: 'Q1', n: 6 }, { step: 4, role: 'đọc', q: 'Q5', n: 4 }] as any;
  const n = dungNhac({ les, cauTruc: ct, k: 1, ghiChu: 'chủ đề cắm trại', daCo: [{ so: 1, q: 'Q4', title: 'Circle the correct word.', ctx: 'Nhà Mai', cau: ['Mai {*was|were} at home.'] }] });
  assert.equal(n.ver, NHAC_VER); assert.equal(n.q, 'Q1'); assert.equal(n.n, 6);
  assert.match(n.system, /học sinh 7-9 tuổi/); assert.match(n.system, /File chung số 1|Khung kết quả/); assert.match(n.system, /## Q1 Điền từ/);
  assert.ok(!/## Q4 Chọn trong câu/.test(n.system), 'chỉ gửi mục của dạng được giao');
  assert.match(n.prompt, /Dùng đúng was \/ were ở câu khẳng định/, 'Kiến thức nguyên văn');
  assert.match(n.prompt, /Bước 2: Luyện có kiểm soát[\s\S]*Chi tiết: khung từ/); assert.match(n.prompt, /Nguyên tắc chung:[\s\S]*Độ khó tăng dần/);
  assert.match(n.prompt, /### Dạng 4: Điền từ có khung từ/); assert.ok(!/Dạng 1: Chọn từ đúng/.test(n.prompt), 'TF: chỉ dạng của Q1');
  assert.match(n.prompt, /- Bài 2 · Bước 2 \(luyện\) · Q1 Điền từ · 6 câu {2}← BÀI NÀY/);
  assert.match(n.prompt, /Bài 1 \(Q4\) “Circle the correct word.” · ngữ cảnh: Nhà Mai/); assert.match(n.prompt, /chủ đề cắm trại/);
  assert.match(n.prompt, /BÀI CẦN VIẾT: Bài 2 · Q1 Điền từ · 6 câu/); assert.ok(!/SỬA LỖI|Góp ý/.test(n.prompt));
  const s = dungNhac({ les, cauTruc: ct, k: 1, sua: { md: '## Task: x\n1. a', loi: ['sai số câu: cần đúng 6 câu đánh số, bài có 1 câu'] } });
  assert.match(s.prompt, /## SỬA LỖI[\s\S]*## Task: x[\s\S]*- sai số câu/);
  const g = dungNhac({ les, cauTruc: ct, k: 2, banHienTai: '## Task: Read\n1. a', gopY: 'dùng tên Nam' });
  assert.match(g.prompt, /## Bản hiện tại của bài này[\s\S]*## Góp ý của giáo viên \(phải làm theo\)\ndùng tên Nam/); assert.match(g.prompt, /BÀI CẦN VIẾT: Bài 3 · Q5 Đúng \/ Sai · 4 câu/);
  assert.match(dungNhac({ les, cauTruc: ct, k: 2, banHienTai: 'x' }).prompt, /Viết một bản MỚI khác bản hiện tại/);
  assert.match(nhacChep(n), /=========\n\n## Phiếu/);
  assert.equal(mucQ(null, 'Q1'), ''); assert.throws(() => dungNhac({ les, cauTruc: ct, k: 7 }));
});

test('Lượt gọi AI qua máy chủ: chưa có khóa → 409 (gợi ý AI ngoài); có khóa → trả chữ + token, song song tối đa 3, ghi nhật ký', async () => {
  const { base, stop: close, data } = await boot(), c = client(base);
  let dang = 0, max = 0;
  const ai = await aiGia(() => { dang++; max = Math.max(max, dang); setTimeout(() => dang--, 290); return { ...claudeOk('## Task: x'), delay: 300 }; });
  const env0 = process.env.ANTHROPIC_API_KEY; delete process.env.ANTHROPIC_API_KEY; process.env.LOP_AI_URL = ai.url;
  try {
    let r = await c('/api/taobai/ai'); assert.deepEqual([r.j.san, r.j.quyen], [false, true]);
    r = await c('/api/taobai/ai', { json: { prompt: 'x' } }); assert.equal(r.status, 409); assert.match(r.j.loi, /AI ngoài/);
    await c('/api/taobai/thiet-lap/ai', { method: 'PUT', json: { claude: { key: 'sk-ant-k1', model: 'claude-haiku-5-5' } } });
    const rs = await Promise.all([1, 2, 3, 4, 5].map(i => c('/api/taobai/ai', { json: { system: 'S', prompt: 'P' + i, loai: 'sinh', meta: { bai: i } } })));
    assert.ok(rs.every(x => x.status === 200 && x.j.text === '## Task: x' && x.j.vao === 120 && x.j.ra === 30), JSON.stringify(rs.map(x => x.j)));
    assert.equal(max, 3, 'không quá 3 lượt cùng lúc');
    assert.equal(ai.nhan[0].body.system, 'S'); assert.equal(ai.nhan[0].body.model, 'claude-haiku-5-5'); assert.equal(ai.nhan[0].headers['anthropic-version'], '2023-06-01');
    assert.equal((await c('/api/taobai/ai', { json: {} })).status, 400, 'thiếu đoạn nhắc');
    await c('/api/taobai/nhat-ky', { json: { ev: 'duyet', bai: 2, suaTay: true } });
    const nk = readFileSync(join(data, 'tao-bai', 'nhat-ky.jsonl'), 'utf8').trim().split('\n').map(l => JSON.parse(l));
    const aiEv = nk.filter(e => e.ev === 'ai'); assert.equal(aiEv.length, 5); assert.ok(aiEv.every(e => e.model === 'claude-haiku-5-5' && e.vao === 120 && e.ra === 30 && e.ms >= 250 && e.bai));
    assert.ok(nk.some(e => e.ev === 'app-duyet' && e.suaTay === true)); assert.ok(!JSON.stringify(nk).includes('sk-ant-k1'), 'nhật ký không ghi khóa');
  } finally { if (env0 === undefined) delete process.env.ANTHROPIC_API_KEY; else process.env.ANTHROPIC_API_KEY = env0; delete process.env.LOP_AI_URL; await ai.close(); await close(); }
});

test('Lượt gọi AI: lỗi 429 / khóa sai → báo tiếng Việt, ghi nhật ký lỗi', async () => {
  const { base, stop: close, data } = await boot(), c = client(base); let st = 429;
  const ai = await aiGia(() => ({ status: st, json: { type: 'error', error: { message: 'x' } } }));
  process.env.LOP_AI_URL = ai.url;
  try {
    await c('/api/taobai/thiet-lap/ai', { method: 'PUT', json: { claude: { key: 'sk-ant-k2' } } });
    let r = await c('/api/taobai/ai', { json: { prompt: 'p' } }); assert.equal(r.status, 502); assert.match(r.j.loi, /quá tải.*429/);
    st = 401; r = await c('/api/taobai/ai', { json: { prompt: 'p' } }); assert.match(r.j.loi, /khóa API không đúng/);
    const nk = readFileSync(join(data, 'tao-bai', 'nhat-ky.jsonl'), 'utf8'); assert.equal((nk.match(/"ev":"ai-loi"/g) || []).length, 2);
  } finally { delete process.env.LOP_AI_URL; await ai.close(); await close(); }
});

test('v130 giáo viên tự quyết: bài tự do (step 0), yêu cầu riêng, số câu ngoài khoảng gợi ý đều vào đoạn nhắc', () => {
  const les = chiTietLesson(DATA_DIR, 'pinta-english-3', 'u5-l2')!;
  const ct = [{ step: 1, role: 'nhận diện', q: 'Q4', n: 12, yc: 'chỉ dùng tên động vật' }, { step: 0, role: 'Bài tự do', q: 'Q2', n: 8, yc: 'viết về gia đình của em' }] as any;
  const a = dungNhac({ les, cauTruc: ct, k: 0 });
  assert.match(a.prompt, /BÀI CẦN VIẾT: Bài 1 · Q4 Chọn trong câu · 12 câu/); assert.match(a.prompt, /YÊU CẦU RIÊNG CỦA GIÁO VIÊN CHO BÀI NÀY \(phải làm theo\): chỉ dùng tên động vật/);
  assert.match(a.prompt, /12 câu đánh số 1–12 \(số giáo viên đã chọn\)/); assert.ok(!/đúng 12 câu/.test(a.prompt), 'không còn "đúng N câu"');
  assert.match(a.prompt, /chỉ là gợi ý/, 'khoảng của bước chỉ là gợi ý');
  const b = dungNhac({ les, cauTruc: ct, k: 1 });
  assert.match(b.prompt, /BÀI TỰ DO do giáo viên thêm/); assert.match(b.prompt, /- Bài 2 · Bài tự do · Q2 Viết câu · 8 câu · yêu cầu: viết về gia đình của em {2}← BÀI NÀY/);
  assert.match(b.prompt, /YÊU CẦU RIÊNG[^\n]*viết về gia đình của em/); assert.ok(!/Bước 0/.test(b.prompt));
});
