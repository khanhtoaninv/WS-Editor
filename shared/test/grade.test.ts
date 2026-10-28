import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize, sameText, grade, gradeSlot, validate, type Slot, type Key } from '../src/index.ts';

test('chuẩn hóa: chữ hoa, nháy cong, gạch nối, dấu câu hai đầu, khoảng trắng', () => {
  assert.equal(normalize('  He  GOES.  '), 'he goes');
  assert.equal(normalize('don’t', { strictContr: true }), "don't");
  assert.equal(normalize('don’t'), 'do not');
  assert.equal(normalize('twenty-one'), 'twenty one');
  assert.equal(normalize('twenty–one'), 'twenty one');
  assert.equal(normalize('Is it?'), 'is it');
  assert.equal(normalize('a, b'), 'a, b');                      // dấu câu ở giữa giữ nguyên
  assert.equal(normalize('a, b', { ignorePunct: true }), 'a b');
  assert.equal(normalize('Tom', { caseSensitive: true }), 'Tom');
  assert.ok(sameText("don't", 'do not'));                        // v116: bảng viết tắt chuẩn
  assert.ok(!sameText("don't", 'do not', { strictContr: true }));  // bật Phân biệt viết tắt
  assert.ok(sameText('Việt Nam', 'việt nam'));
});

test('v113 dấu câu: đáp án chỉ là dấu câu thì so từng dấu', () => {
  assert.ok(!sameText('.', '?')); assert.ok(!sameText('!', '?')); assert.ok(!sameText(',', '.'));
  assert.ok(sameText(' ? ', '?')); assert.ok(sameText('...', '…')); assert.ok(sameText('’', "'"));
  assert.ok(!sameText('Hello', '?')); assert.ok(!sameText('', '.'));
  assert.ok(sameText('were.', 'were'));                          // câu chữ vẫn bỏ dấu thừa hai đầu
  assert.equal(gradeSlot(S('a', 'text'), { type: 'text', score: 1, accept: ['?'] }, '.').status, 'wrong');
  assert.equal(gradeSlot(S('a', 'text'), { type: 'text', score: 1, accept: ['?'] }, '?').status, 'correct');
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

test('v116 bảng viết tắt chuẩn: hai chiều, chỉ các dạng trong bảng', () => {
  const eq: [string, string][] = [["I'm", 'I am'], ["He's", 'he is'], ["it’s raining", 'it is raining'], ["they're", 'they are'], ["isn't", 'is not'], ["aren't", 'are not'],
    ["wasn't", 'was not'], ["weren't", 'were not'], ["doesn't", 'does not'], ["didn't", 'did not'], ["haven't", 'have not'], ["hasn't", 'has not'], ["hadn't", 'had not'],
    ["can't", 'cannot'], ["can't", 'can not'], ["couldn't", 'could not'], ["won't", 'will not'], ["wouldn't", 'would not'], ["shouldn't", 'should not'], ["mustn't", 'must not'],
    ["needn't", 'need not'], ["shan't", 'shall not'], ["I'll", 'I will'], ["they'll", 'they will'], ["we've", 'we have'], ["I'd", 'I would'], ["she'd", 'she would'],
    ["who'll", 'who will'], ["that'll", 'that will'], ["there'll", 'there will'], ["let's", 'let us'], ["what's", 'what is'], ["where's your bag", 'where is your bag'],
    ["that's", 'that is'], ["there's", 'there is'], ["here's", 'here is'], ["who's", 'who is'], ["how's", 'how is']];
  for (const [a, b] of eq) { assert.ok(sameText(a, b), `${a} = ${b}`); assert.ok(sameText(b, a), `${b} = ${a}`); assert.ok(!sameText(a, b, { strictContr: true }), `phân biệt: ${a} ≠ ${b}`); }
  assert.ok(!sameText("Tom's book", 'Tom is book'));               // 's sở hữu không đổi
  assert.ok(!sameText("He's gone", 'he has gone'));                // 's = is, không đoán has
  assert.ok(!sameText("My name's Tom", 'my name is Tom'));         // name's không có trong bảng
  assert.ok(!sameText("gonna", 'going to'));
  assert.ok(sameText("o'clock", "o’clock"));
  assert.ok(sameText("I'm", 'I am', { caseSensitive: true }));
  assert.equal(gradeSlot(S('a', 'text'), { type: 'text', score: 1, accept: ["isn't"], strictContr: true }, 'is not').status, 'wrong');
  assert.equal(gradeSlot(S('a', 'text'), { type: 'text', score: 1, accept: ["isn't"] }, 'is not').status, 'correct');
});

test('v116 tìm từ: hai đầu, chiều nào cũng được', () => {
  const k = { type: 'find' as const, score: 1, correct: '0,0-0,2' };
  assert.equal(gradeSlot(S('a', 'find'), k, '0,0-0,2').status, 'correct');
  assert.equal(gradeSlot(S('a', 'find'), k, '0,2-0,0').status, 'correct');
  assert.equal(gradeSlot(S('a', 'find'), k, '1,0-1,2').status, 'wrong');
});

test('v116 gợi ý cách viết khác (quy tắc cố định)', async () => {
  const { suggest } = await import('../src/suggest.ts');
  assert.deepEqual(suggest('colour'), ['color']);
  assert.deepEqual(suggest('He has gone'), ["He's gone"]);
  assert.deepEqual(suggest("He's gone"), ['He has gone']);
  assert.deepEqual(suggest('My name is Tom'), ["My name's Tom"]);
  assert.deepEqual(suggest('ten'), ['10']);
  assert.deepEqual(suggest('1st'), ['first']);
  assert.deepEqual(suggest('ice-cream'), ['icecream']);
  assert.deepEqual(suggest('colour / color'), []);                 // đã có thì không gợi ý
  assert.deepEqual(suggest('colour', ['color']), []);              // đã bỏ thì thôi
  assert.deepEqual(suggest("isn't"), []);                          // viết tắt trong bảng máy đã tự coi là một
  assert.deepEqual(suggest('cat'), []);
});
