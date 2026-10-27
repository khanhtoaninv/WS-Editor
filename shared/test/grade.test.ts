import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, sameText, grade, gradeSlot, validate, type Slot, type Key } from '../src/index.ts';

test('chuẩn hóa: chữ hoa, nháy cong, gạch nối, dấu câu hai đầu, khoảng trắng', () => {
  assert.equal(normalize('  He  GOES.  '), 'he goes');
  assert.equal(normalize('don’t'), "don't");
  assert.equal(normalize('twenty-one'), 'twenty one');
  assert.equal(normalize('twenty–one'), 'twenty one');
  assert.equal(normalize('Is it?'), 'is it');
  assert.equal(normalize('a, b'), 'a, b');                      // dấu câu ở giữa giữ nguyên
  assert.equal(normalize('a, b', { ignorePunct: true }), 'a b');
  assert.equal(normalize('Tom', { caseSensitive: true }), 'Tom');
  assert.ok(!sameText("don't", 'do not'));                       // không tự mở rộng viết tắt
  assert.ok(sameText('Việt Nam', 'việt nam'));
});

const S = (id: string, interaction: Slot['interaction'], extra: Partial<Slot> = {}): Slot =>
  ({ id, task: 't1', label: id, interaction, grading: 'auto', ...extra });
const opts = (...ids: string[]) => ids.map(id => ({ id, text: id }));

test('chấm từng loại', () => {
  assert.equal(gradeSlot(S('a', 'text'), { type: 'text', score: 1, accept: ['goes'] }, 'Goes').status, 'correct');
  assert.equal(gradeSlot(S('a', 'text'), { type: 'text', score: 1, accept: ["isn't", 'is not'] }, 'is not').status, 'correct');
  assert.equal(gradeSlot(S('a', 'text'), { type: 'text', score: 1, accept: ['goes'] }, 'go').status, 'wrong');
  assert.equal(gradeSlot(S('a', 'text'), { type: 'text', score: 1, accept: ['goes'] }, '  ').status, 'blank');
  assert.equal(gradeSlot(S('a', 'choice-one', { options: opts('a', 'b') }), { type: 'choice-one', score: 1, correct: 'b' }, 'b').status, 'correct');
  assert.equal(gradeSlot(S('a', 'tf'), { type: 'tf', score: 1, correct: 'F' }, 'f').status, 'correct');
  assert.equal(gradeSlot(S('a', 'match', { options: opts('r1', 'r2') }), { type: 'match', score: 1, correct: 'r2' }, 'r1').status, 'wrong');
  const many = { type: 'choice-many' as const, score: 1, correct: ['a', 'c'] };
  assert.equal(gradeSlot(S('a', 'choice-many', { options: opts('a', 'b', 'c') }), many, ['c', 'a']).status, 'correct');
  assert.equal(gradeSlot(S('a', 'choice-many', { options: opts('a', 'b', 'c') }), many, ['a']).status, 'wrong');
  const r = gradeSlot(S('a', 'choice-many', { options: opts('a', 'b', 'c') }), { ...many, score: 2, scoring: 'partial' }, ['a']);
  assert.deepEqual([r.status, r.score], ['partial', 1]);
  assert.equal(gradeSlot(S('a', 'text-long', { grading: 'manual' }), { type: 'text-long', score: 2, grading: 'manual' }, 'My day…').status, 'pending');
  assert.equal(gradeSlot(S('a', 'static', { grading: 'none' }), undefined, 'x').status, 'ungraded');
});

test('chấm cả bài: tổng điểm, chờ chấm tay, sửa điểm', () => {
  const slots = [S('q1', 'text'), S('q2', 'choice-one', { options: opts('a', 'b') }), S('q3', 'text-long', { grading: 'manual' }), S('q4', 'static', { grading: 'none' }), S('q5', 'tf')];
  const key: Key = { q1: { type: 'text', score: 1, accept: ['went'] }, q2: { type: 'choice-one', score: 1, correct: 'a' }, q3: { type: 'text-long', score: 2, grading: 'manual' }, q5: { type: 'tf', score: 1, correct: 'T' } };
  const r = grade(slots, key, { q1: 'went', q2: 'b', q3: 'I went to school.' });
  assert.deepEqual([r.score, r.max, r.autoScore, r.pendingManual], [1, 5, 1, 1]);
  assert.deepEqual(r.counts, { correct: 1, wrong: 1, partial: 0, blank: 1, pending: 1, ungraded: 1 });
  const r2 = grade(slots, key, { q1: 'went', q2: 'b', q3: 'I went to school.' }, { q3: { score: 2 } });
  assert.deepEqual([r2.score, r2.pendingManual, r2.perSlot.q3.status], [3, 0, 'correct']);
});

test('kiểm khuôn', () => {
  const slots = [S('t1.i1', 'text'), S('t1.i2', 'choice-one', { options: opts('a', 'b') })];
  assert.deepEqual(validate(slots, { 't1.i1': { type: 'text', score: 1, accept: ['x'] }, 't1.i2': { type: 'choice-one', score: 1, correct: 'a' } }), []);
  const e = validate([...slots, S('t1.i1', 'text')], { 't1.i2': { type: 'choice-one', score: 1, correct: 'z' }, 'x.y': { type: 'text', score: 1, accept: ['a'] } });
  assert.ok(e.some(m => /trùng/.test(m)));
  assert.ok(e.some(m => /thiếu đáp án/.test(m)));
  assert.ok(e.some(m => /"z" không có trong đề/.test(m)));
  assert.ok(e.some(m => /"x.y" không ứng/.test(m)));
  assert.ok(validate([S('a', 'choice-one', { options: [{ id: 'a', ok: true } as never, { id: 'b' }] })], { a: { type: 'choice-one', score: 1, correct: 'a' } }).some(m => /đánh dấu đúng/.test(m)));
  assert.deepEqual(validate('x', {}), ['slots không phải danh sách']);
});
