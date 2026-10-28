import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classReport, studentReport, taskInfo, aiPrompt, type Sub } from '../src/baocao.ts';
import type { Slot, Key } from '../src/index.ts';

const slots: Slot[] = [
  { id: 't1.1', task: 't1', label: '1', q: 'Q1', interaction: 'text', grading: 'auto' },
  { id: 't1.2', task: 't1', label: '2', q: 'Q1', interaction: 'text', grading: 'auto' },
  { id: 't2.1', task: 't2', label: '1', q: 'Q3', interaction: 'choice-one', grading: 'auto', options: [{ id: 'a', text: 'cat' }, { id: 'b', text: 'dog' }] },
  { id: 't2.2', task: 't2', label: '2', q: 'Q3', interaction: 'choice-one', grading: 'auto', options: [{ id: 'a', text: 'red' }, { id: 'b', text: 'blue' }] },
  { id: 't3.w', task: 't3', label: '1', q: 'Q12', interaction: 'text-long', grading: 'manual' },
];
const key: Key = {
  't1.1': { type: 'text', score: 1, accept: ['goes'] }, 't1.2': { type: 'text', score: 1, accept: ['went'] },
  't2.1': { type: 'choice-one', score: 1, correct: 'b' }, 't2.2': { type: 'choice-one', score: 1, correct: 'a' },
  't3.w': { type: 'text-long', score: 2, grading: 'manual', sample: 'My name is Lan.' },
};
const sub = (hs: string, a: Record<string, string>, ov = {}, nop = true): Sub => ({ hs, ten: 'HS ' + hs, nop, vao: true, answers: a, overrides: ov, xong: false });
const subs: Sub[] = [
  sub('A', { 't1.1': 'goes', 't1.2': 'go', 't2.1': 'b', 't2.2': 'a', 't3.w': 'I am An' }, { 't3.w': { score: 2 } }),
  sub('B', { 't1.1': 'go', 't1.2': 'go', 't2.1': 'b', 't2.2': 'a', 't3.w': 'x' }),
  sub('C', { 't1.1': 'Goes', 't1.2': 'Go ', 't2.1': 'a', 't2.2': 'a' }),
  sub('D', { 't1.1': 'go' }, {}, false),
  { hs: 'E', ten: 'HS E', nop: false, vao: false, answers: {}, overrides: {}, xong: false },
];
const pages = ['<section class="task" data-task="t1"><div class="g0"><span class="num">1</span><span class="ttl">Fill &amp; write</span></div></section><section data-task="t2"><span class="num">2</span><span class="ttl">Choose</span></section>', '<section data-task="t2"></section><section data-task="t3"><span class="num">3</span><span class="ttl">Write</span></section>'];

test('taskInfo: số và tiêu đề Task, không lặp khi Task sang trang', () => {
  assert.deepEqual(taskInfo(pages), [{ id: 't1', num: '1', title: 'Fill & write' }, { id: 't2', num: '2', title: 'Choose' }, { id: 't3', num: '3', title: 'Write' }]);
});

test('báo cáo lớp: chỉ tính bài đã nộp, % từng câu, đáp án sai hay gặp, câu sai nhiều, ai chưa nộp', () => {
  const c = classReport(slots, key, subs, taskInfo(pages));
  assert.equal(c.nLop, 5); assert.equal(c.nNop, 3); assert.equal(c.nVao, 4);
  const s12 = c.slots.find(x => x.id === 't1.2')!;
  assert.equal(s12.n, 3); assert.equal(s12.pct, 0); assert.deepEqual(s12.wrongs, [{ text: 'go', n: 3 }]); assert.equal(s12.key, 'went');
  assert.equal(c.slots.find(x => x.id === 't2.1')!.pct, 66.7);
  assert.equal(c.top[0].id, 't1.2');
  assert.ok(!c.top.some(x => x.manual));
  assert.deepEqual(c.chuaNop, ['HS D']); assert.deepEqual(c.chuaVao, ['HS E']);
  assert.equal(c.pending, 1);                                   // B có bài viết chưa chấm (C bỏ trống: blank)
  assert.equal(c.students[0].hs, 'A'); assert.equal(c.students[0].pct, 83.3);
  assert.ok(c.qs.find(q => q.id === 'Q1') && c.qs.find(q => q.name === 'Chọn A/B/C'));
  assert.ok(c.insights.some(i => i.text.includes('Task 1 câu 2') && i.text.includes('"go"') && i.text.includes('went')));
  assert.ok(c.insights.some(i => i.text.includes('chưa tự nộp')));
  assert.ok(c.insights.some(i => i.text.includes('chấm tay chưa chấm')));
  assert.equal(c.dist.reduce((a, b) => a + b, 0), 3);
});

test('báo cáo từng em + nhận xét', () => {
  const c = classReport(slots, key, subs, taskInfo(pages));
  const r = studentReport(slots, key, subs[2], c);
  assert.equal(r.right.length, 2); assert.deepEqual(r.wrong.map(x => x.id), ['t1.2', 't2.1']); assert.deepEqual(r.blank.map(x => x.id), ['t3.w']);
  assert.equal(r.wrong[1].answer, 'cat'); assert.equal(r.wrong[1].key, 'dog');
  assert.ok(r.rank >= 1 && r.of === 3);
  assert.ok(r.insights.length >= 1 && r.insights[0].text.includes('HS C'));
  const d = studentReport(slots, key, subs[4], c); assert.equal(d.insights[0].text, 'HS E chưa làm bài.');
});

test('đoạn nhắc AI: ẩn danh (không tên, không bài viết tự do)', () => {
  const c = classReport(slots, key, subs, taskInfo(pages)), s = studentReport(slots, key, subs[1], c);
  for (const p of [aiPrompt(c, null, 'Phiếu thử'), aiPrompt(c, s, 'Phiếu thử')]) {
    for (const x of subs) assert.ok(!p.includes(x.ten), 'lộ tên ' + x.ten);
    assert.ok(!p.includes('I am An') && !p.includes('My name is Lan'));
    assert.ok(p.includes('"go"×3'));
  }
});
