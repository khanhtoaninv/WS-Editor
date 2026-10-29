// Module Tạo bài T0: tách file dữ liệu định dạng tạm + tách meta khỏi MD do AI viết. Chạy: cd shared && node --test test/*.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseGiaoTrinh, parseTrinhTu, parseTf, parseKienThuc, ghepLesson, parseQList, parseRange, verOf, tachMeta, qUnit } from '../src/taobai/index.ts';

const GT = `# Pinta English 3
Tuổi: 7-9
## Chuyên đề
- ngu-phap: Ngữ pháp
- nghe: Nghe
## Unit 5: My weekend
- Lesson 2: was / were | ngu-phap
- Lesson 4: Tom's Saturday | nghe
`;
const TT = `# Trình tự · Ngữ pháp
Phiên bản: 7
## Bước 1: Khởi động
Vai trò: nhận diện
Dạng: Q4, Q7 Chọn ảnh, q3
Số câu: 5–6
Bắt buộc: có
Tối đa: 1 bài
Chi tiết: câu ngắn
Mỗi câu một điểm kiến thức.
## Bước 2: Viết
Vai trò: tự dùng
Dạng: Q12
Số dòng: 4
Bắt buộc: không
## Nguyên tắc
- Câu ngắn.
`;
const TF = `# TF · Ngữ pháp
Phiên bản: 3
## Dạng 1: Chọn trong ngoặc
Dạng app: Q4 Chọn trong câu
## Dạng 2: Chọn ảnh
Dạng app: Q7
## Dạng 3: Trắc nghiệm
Dạng app: Q3 Chọn A/B/C
## Dạng 4: Viết đoạn
Dạng app: Q12 Viết tự do
`;
const KT = `# Kiến thức · was / were
Phiên bản: 1
## Mục tiêu
Dùng đúng was / were.
## Từ vựng
yesterday, last Sunday
## Lỗi hay gặp
They was …
`;

test('mã Q và khoảng số câu', () => {
  assert.deepEqual(parseQList('Q4, Q7 Chọn ảnh; q3 / Q4'), { q: ['Q4', 'Q7', 'Q3'], bad: [] });
  assert.deepEqual(parseQList('Q13, nối').bad, ['Q13', 'nối']);
  assert.deepEqual(parseRange('5–6 câu'), { min: 5, max: 6 });
  assert.deepEqual(parseRange('8-6'), { min: 6, max: 8 });
  assert.deepEqual(parseRange('4'), { min: 4, max: 4 });
  assert.equal(parseRange('vài câu'), null);
  assert.equal(qUnit('Q12'), 'dòng'); assert.equal(qUnit('Q1'), 'câu');
});

test('giáo trình: chuyên đề, unit, lesson (mỗi lesson đúng một chuyên đề)', () => {
  const r = parseGiaoTrinh(GT, 'gt.md', 'pe3');
  assert.deepEqual(r.loi, []); assert.equal(r.gt.id, 'pe3'); assert.equal(r.gt.ten, 'Pinta English 3'); assert.equal(r.gt.tuoi, '7-9');
  assert.deepEqual(r.gt.chuyenDe.map(c => c.id), ['ngu-phap', 'nghe']);
  assert.equal(r.gt.units[0].id, 'u5'); assert.equal(r.gt.units[0].ten, 'Unit 5 · My weekend');
  assert.deepEqual(r.gt.units[0].lessons.map(l => [l.id, l.ten, l.chuyenDe]), [['u5-l2', 'Lesson 2 · was / were', 'ngu-phap'], ['u5-l4', "Lesson 4 · Tom's Saturday", 'nghe']]);
  const bad = parseGiaoTrinh(GT.replace('| nghe', '').replace('| ngu-phap\n', '| ngu-phap, nghe\n') + '- Lesson 9: X | toan\n', 'gt.md', 'pe3');
  const m = bad.loi.map(n => n.msg).join('\n');
  assert.match(m, /Lesson 4 · Tom's Saturday \(Unit 5 · My weekend\) chưa gắn chuyên đề/); assert.match(m, /Lesson 2 · was \/ were \(Unit 5 · My weekend\) gắn nhiều chuyên đề/); assert.match(m, /“toan” không có/);
  assert.ok(bad.loi.every(n => n.file === 'gt.md'));
  assert.match(parseGiaoTrinh('## Unit 1: A\n- Lesson 1: a | x\n- Lesson 1: b | x\n', 'g', 'g').loi.map(n => n.msg).join('\n'), /thiếu tên giáo trình[\s\S]*bị trùng[\s\S]*Chuyên đề/);
});

test('Trình tự kiểu lai: bước, Q được phép, khoảng số câu, bắt buộc, tối đa', () => {
  const r = parseTrinhTu(TT, 'tt.md', 'ngu-phap');
  assert.deepEqual(r.loi, []); assert.deepEqual(r.canhBao, []);
  const [b1, b2] = r.tt.buoc;
  assert.equal(r.tt.ver, '7'); assert.equal(r.tt.soTrangToiDa, 2); assert.equal(r.tt.buoc.length, 2);
  assert.deepEqual([b1.so, b1.ten, b1.vaiTro, b1.q, b1.min, b1.max, b1.batBuoc, b1.toiDa, b1.chiTiet], [1, 'Khởi động', 'nhận diện', ['Q4', 'Q7', 'Q3'], 5, 6, true, 1, 'câu ngắn']);
  assert.equal(b1.them, 'Mỗi câu một điểm kiến thức.');
  assert.deepEqual([b2.q, b2.min, b2.max, b2.batBuoc, b2.toiDa], [['Q12'], 4, 4, false, 2]);
  assert.equal(r.tt.nguyenTac, '- Câu ngắn.');
});

test('Trình tự lỗi: thiếu Dạng / Số câu, mã lạ, tối đa > 2, Q11, thiếu phiên bản', () => {
  const r = parseTrinhTu(`# T
## Bước 1: A
Vai trò: x
Bắt buộc: có
## Bước 2: B
Vai trò: y
Dạng: Q5, nối, Q11
Số câu: 40
Bắt buộc: hơi
Tối đa: 3
`, 'tt.md', 'x');
  const L = r.loi.map(n => n.msg).join('\n'), W = r.canhBao.map(n => n.msg).join('\n');
  assert.match(L, /Bước 1 \(A\): thiếu “Dạng:”/); assert.match(L, /Bước 1 \(A\): thiếu “Số câu:”/);
  assert.match(L, /không hiểu dạng “nối”/); assert.match(L, /Số câu: 40/);
  assert.match(W, /Phiên bản/); assert.match(W, /Q11/); assert.match(W, /tối đa 3 bài/); assert.match(W, /Bắt buộc: hơi/);
  assert.equal(r.tt.buoc[1].toiDa, 2); assert.equal(r.tt.buoc[1].batBuoc, true);
  assert.ok(r.loi.find(n => /nối/.test(n.msg))!.line! > 1, 'lỗi có số dòng');
  assert.match(parseTrinhTu('# T\nPhiên bản: 1\n', 't', 'x').loi[0].msg, /chưa có bước/);
});

test('TF: mỗi dạng một mã Q', () => {
  const r = parseTf(TF, 'tf.md', 'ngu-phap');
  assert.deepEqual(r.loi, []); assert.deepEqual(r.tf.dang.map(d => [d.so, d.q]), [[1, 'Q4'], [2, 'Q7'], [3, 'Q3'], [4, 'Q12']]);
  const bad = parseTf('# TF\nPhiên bản: 1\n## Dạng 1: A\nHướng dẫn mẫu: x\n## Dạng 2: B\nDạng app: Q4, Q5\n', 'tf.md', 'x');
  assert.match(bad.loi.map(n => n.msg).join('\n'), /Dạng 1 \(A\): thiếu “Dạng app[\s\S]*Dạng 2 \(B\): “Dạng app:” phải ghi đúng một mã Q/);
});

test('Kiến thức: chỉ chuẩn hóa thành phần', () => {
  const r = parseKienThuc(KT, 'kt.md', 'u5-l2');
  assert.deepEqual(r.loi, []); assert.equal(r.kt.mucTieu, 'Dùng đúng was / were.'); assert.equal(r.kt.tuVung, 'yesterday, last Sunday');
  assert.equal(r.kt.muc['Lỗi hay gặp'], 'They was …'); assert.equal(r.kt.ver, '1');
  assert.match(parseKienThuc('# K\nPhiên bản: 1\n## Điểm kiến thức\nx\n', 'k', 'l').canhBao[0].msg, /Mục tiêu/);
});

test('ghép lesson: kiểm chéo Trình tự ↔ TF, thiếu file', () => {
  const gt = parseGiaoTrinh(GT, 'gt.md', 'pe3').gt, ten = { kienThuc: 'kt.md', trinhTu: 'tt.md', tf: 'tf.md' };
  const ok = ghepLesson(gt, 'u5-l2', { kienThuc: KT, trinhTu: TT, tf: TF, ten }, [])!;
  assert.deepEqual(ok.loi, []); assert.equal(ok.chuyenDe.ten, 'Ngữ pháp'); assert.equal(ok.unit.ten, 'Unit 5 · My weekend');
  const miss = ghepLesson(gt, 'u5-l2', { kienThuc: KT, trinhTu: TT, tf: TF.replace('Dạng app: Q7', 'Dạng app: Q6'), ten }, [])!;
  assert.match(miss.loi.map(n => n.msg).join('\n'), /Bước 1 \(Khởi động\) cho phép Q7 nhưng TF chưa có dạng nào ghi “Dạng app: Q7”/);
  const none = ghepLesson(gt, 'u5-l4', { kienThuc: null, trinhTu: null, tf: null, ten }, [])!;
  assert.match(none.loi.map(n => n.msg).join('\n'), /chưa có file Kiến thức[\s\S]*chưa có Trình tự[\s\S]*chưa có TF/);
  assert.equal(ghepLesson(gt, 'u9-l9', { kienThuc: null, trinhTu: null, tf: null, ten }, []), null);
});

test('phiên bản file chung', () => {
  assert.equal(verOf('# x\nPhiên bản: 2\n'), '2'); assert.equal(verOf('# x\n\nBản nháp 29/10/2026, theo app'), 'nháp 29/10/2026'); assert.equal(verOf('# x'), '?'); assert.equal(verOf(null), '');
});

test('tách Mục tiêu / Ngữ cảnh khỏi MD một bài', () => {
  const r = tachMeta(`## Task: Complete the sentences.
Mục tiêu: Dùng was / were với chủ ngữ số ít / nhiều
Ngữ cảnh: Chuyến đi công viên
Dạng: điền từ
1. Tom ___ at the park.

## Đáp án
Task 1: was
Mục tiêu: không phải meta (nằm trong đáp án)`);
  assert.equal(r.goal, 'Dùng was / were với chủ ngữ số ít / nhiều'); assert.equal(r.ctx, 'Chuyến đi công viên');
  assert.ok(!/^Mục tiêu: Dùng/m.test(r.md) && !/Ngữ cảnh/.test(r.md)); assert.match(r.md, /Dạng: điền từ\n1\. Tom/); assert.match(r.md, /Mục tiêu: không phải meta/);
  assert.deepEqual(r.notes, []); assert.equal(r.tasks, 1);
  const n = tachMeta('## Task: A\n1. x\n## Task: B\n1. y').notes.join('\n');
  assert.match(n, /có 2 dòng “## Task:”/); assert.match(n, /thiếu “Mục tiêu:”/); assert.match(n, /thiếu “Ngữ cảnh:”/);
  assert.match(tachMeta('Mục tiêu: x').notes[0], /không có dòng “## Task/);
});
