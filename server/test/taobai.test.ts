// Module Tạo bài T0: mô-đun chuyển đổi đọc bộ dữ liệu mẫu tạm (server/demo/tao-bai) và báo lỗi dữ liệu. Chạy: npm run test:lop
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { docNguon, chiTietLesson, docChung, congKhai, DATA_DIR } from '../src/taobai/nguon.ts';
import { boot, client } from './api.test.ts';

test('bộ mẫu tạm: 1 giáo trình, Unit 5, 4 lesson / 3 chuyên đề, đọc không lỗi', () => {
  const r = docNguon(DATA_DIR);
  assert.deepEqual(r.loi, []); assert.deepEqual(r.canhBao, []);
  assert.equal(r.giaoTrinh.length, 1);
  const g = congKhai(r.giaoTrinh[0]);
  assert.equal(g.id, 'pinta-english-3'); assert.ok(!('_dir' in g), 'không lộ đường dẫn máy chủ');
  assert.deepEqual(g.chuyenDe.map(c => c.ten), ['Từ vựng', 'Ngữ pháp', 'Nghe']);
  assert.deepEqual(g.units[0].lessons.map(l => l.id), ['u5-l1', 'u5-l2', 'u5-l3', 'u5-l4']);
  for (const l of g.units[0].lessons) {
    const c = chiTietLesson(DATA_DIR, g.id, l.id)!;
    assert.deepEqual(c.loi, [], l.id); assert.deepEqual(c.canhBao, [], l.id);
    assert.ok(c.kienThuc!.mucTieu && c.trinhTu!.buoc.length >= 4 && c.tf!.dang.length >= 7, l.id);
  }
  const l2 = chiTietLesson(DATA_DIR, g.id, 'u5-l2')!, l3 = chiTietLesson(DATA_DIR, g.id, 'u5-l3')!;
  assert.equal(l2.chuyenDe.id, 'ngu-phap'); assert.equal(l2.trinhTu!.ver, '7'); assert.equal(l2.tf!.ver, '3');
  assert.deepEqual(l2.trinhTu!.buoc.map(b => [b.ten, b.q.join('/'), b.min, b.max, b.batBuoc, b.toiDa]), [
    ['Khởi động', 'Q4/Q7/Q3', 5, 6, true, 1], ['Luyện có kiểm soát', 'Q1/Q4', 6, 8, true, 2], ['Luyện mở rộng', 'Q3/Q8/Q2', 5, 6, false, 1],
    ['Vận dụng: đọc', 'Q5/Q3', 4, 5, true, 1], ['Vận dụng: viết', 'Q12/Q2', 3, 5, true, 1]]);
  assert.equal(l3.trinhTu!.raw, l2.trinhTu!.raw, 'hai lesson cùng chuyên đề dùng chung Trình tự');
  assert.match(l2.kienThuc!.mucTieu, /was \/ were/);
  assert.equal(chiTietLesson(DATA_DIR, g.id, 'u9-l1'), null); assert.equal(chiTietLesson(DATA_DIR, 'khong-co', 'u5-l1'), null);
});

test('file chung: 1 và 2 có, 3–5 chưa có', () => {
  const c = docChung();
  assert.deepEqual(c.map(x => [x.so, x.raw != null]), [[1, true], [2, true], [3, false], [4, false], [5, false]]);
  assert.ok(c[0].ver && c[0].ver !== '?', 'file chung 1 có phiên bản');
});

test('dữ liệu hỏng: báo lỗi đúng lesson, không cho tạo bài', () => {
  const d = mkdtempSync(join(tmpdir(), 'taobai-')); cpSync(DATA_DIR, d, { recursive: true });
  try {
    const gdir = join(d, 'pinta-english-3');
    rmSync(join(gdir, 'chuyen-de/nghe/tf.md'));                                 // chuyên đề Nghe thiếu TF
    rmSync(join(gdir, 'kien-thuc/u5-l1.md'));                                    // lesson 1 thiếu Kiến thức
    const tt = join(gdir, 'chuyen-de/ngu-phap/trinh-tu.md');
    writeFileSync(tt, readFileSync(tt, 'utf8').replace('Dạng: Q5, Q3', 'Dạng: Q5, Q6'));   // bước 4 cho phép Q6, TF ngữ pháp không có Q6
    const gtf = join(gdir, 'giao-trinh.md');
    writeFileSync(gtf, readFileSync(gtf, 'utf8').replace('Past simple | ngu-phap', 'Past simple'));   // lesson 3 không gắn chuyên đề
    writeFileSync(join(d, 'ghi-chu.txt'), 'không phải giáo trình');
    const all = docNguon(d);
    assert.match(all.loi.map(n => n.msg).join('\n'), /Lesson 3 · Past simple \(Unit 5 · My weekend\) chưa gắn chuyên đề/);
    assert.ok(all.canhBao.length === 0, 'file lẻ ở thư mục gốc không phải giáo trình: bỏ qua im lặng');
    const L = (id: string) => chiTietLesson(d, 'pinta-english-3', id)!.loi.map(n => `${n.file} · ${n.msg}`).join('\n');
    assert.match(L('u5-l1'), /kien-thuc\/u5-l1\.md · Lesson 1 · Weekend activities chưa có file Kiến thức/);
    assert.match(L('u5-l2'), /Bước 4 \(Vận dụng: đọc\) cho phép Q6 nhưng TF chưa có/);
    assert.match(L('u5-l3'), /chưa gắn chuyên đề/); assert.match(L('u5-l3'), /chưa có Trình tự/);
    assert.match(L('u5-l4'), /chuyen-de\/nghe\/tf\.md · chuyên đề Nghe chưa có TF/);
  } finally { rmSync(d, { recursive: true, force: true }); }
  assert.deepEqual(docNguon(join(d, 'khong-co')).loi.map(n => n.msg), ['không có thư mục dữ liệu giáo trình']);
});

test('API /api/taobai: giáo trình, chi tiết lesson, lưu / mở phiếu đã tạo', async () => {
  const S = await boot();
  try {
    const c = client(S.base);
    const g = (await c('/api/taobai/giao-trinh')).j;
    assert.equal(g.giaoTrinh[0].id, 'pinta-english-3'); assert.deepEqual(g.loi, []);
    assert.ok(!JSON.stringify(g).includes('/home') && !JSON.stringify(g).includes('_dir'), 'không lộ đường dẫn máy chủ');
    const l = (await c('/api/taobai/lesson/pinta-english-3/u5-l2')).j;
    assert.equal(l.chuyenDe.id, 'ngu-phap'); assert.equal(l.trinhTu.buoc.length, 5); assert.deepEqual(l.phieu, []);
    assert.equal((await c('/api/taobai/lesson/pinta-english-3/u9-l9')).status, 404);
    assert.equal((await c('/api/taobai/lesson/pinta-english-3/..%2F..')).status, 400);
    assert.equal((await c('/api/taobai/phieu/pinta-english-3/u5-l2/p1', { method: 'PUT', json: { tasks: [] } })).status, 400, 'phiếu không có gen');
    const w = { title: 'Unit 5 · Lesson 2', tasks: [{ id: 't1' }], gen: { v: 1 } };
    assert.equal((await c('/api/taobai/phieu/pinta-english-3/u5-l2/p1', { method: 'PUT', json: w })).j.ok, true);
    const l2 = (await c('/api/taobai/lesson/pinta-english-3/u5-l2')).j;
    assert.deepEqual(l2.phieu.map((p: any) => [p.id, p.n, p.title]), [['p1', 1, 'Unit 5 · Lesson 2']]);
    assert.equal((await c('/api/taobai/phieu/pinta-english-3/u5-l2/p1')).j.title, 'Unit 5 · Lesson 2');
  } finally { await S.stop(); }
});
