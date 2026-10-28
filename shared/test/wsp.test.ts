// Gói .wsp (GĐ2): zip, chuẩn tắc, đóng / ký / mã hóa / mở, và các kiểm tra mục 9 bắt đúng lỗi.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zip, unzip, canon, buildFiles, sealWsp, inspectWsp, openWsp, checkFiles, studentView, genSignKey, genBoxKey, localSigner, readEnvelope, type Slot, type Key, type WspInput } from '../src/index.ts';
import { utf8, fromUtf8 } from '../src/zip.ts';

const slots: Slot[] = [
  { id: 't1.i1', task: 't1', item: 'i1', label: '1', q: 'Q1', interaction: 'text', grading: 'auto' },
  { id: 't1.i2', task: 't1', item: 'i2', label: '2', q: 'Q3', interaction: 'choice-one', grading: 'auto', options: [{ id: 'a', text: 'cat' }, { id: 'b', text: 'dog' }] },
  { id: 't2.i1', task: 't2', item: 'i1', label: '1', q: 'Q12', interaction: 'text-long', grading: 'manual' },
];
const key: Key = {
  't1.i1': { type: 'text', score: 1, accept: ['goes'] },
  't1.i2': { type: 'choice-one', score: 1, correct: 'b' },
  't2.i1': { type: 'text-long', score: 2, grading: 'manual', sample: 'I get up at six every morning.' },
};
const page = `<section class="task" data-task="t1"><p>He <span class="gap" data-ans="t1.i1"></span> to school.</p><div data-ans="t1.i2"><b>cat</b> <b>dog</b></div><img src="media/a.png" alt=""></section><section class="task" data-task="t2"><div class="lines" data-ans="t2.i1"></div></section>`;
const input = (): WspInput => ({ sheetId: 'ws-test', version: 1, title: 'Thử', age: '7-9', pages: [page], css: '.task{color:red}@font-face{src:url(fonts/x.woff2)}', fonts: { 'x.woff2': new Uint8Array([1, 2, 3]) }, media: { 'a.png': new Uint8Array([9, 9]) }, slots: structuredClone(slots), key: structuredClone(key), source: { title: 'Thử', tasks: [] } });

async function keys() {
  const sig = await genSignKey(), tr = await genBoxKey(), ed = await genBoxKey();
  return { sig, tr, ed, trust: { 'k-test': sig.publicKey }, signer: localSigner('k-test', sig.privateKey) };
}

test('zip: đóng mở giữ nguyên, tên tiếng Việt, cùng nội dung = cùng byte', () => {
  const f = { 'a/ả.txt': utf8('xin chào'), 'b.bin': new Uint8Array([0, 255, 7]) };
  const z = zip(f), back = unzip(z);
  assert.equal(fromUtf8(back['a/ả.txt']), 'xin chào');
  assert.deepEqual([...back['b.bin']], [0, 255, 7]);
  assert.deepEqual([...zip(f)], [...z]);
  assert.ok((() => { try { zip({ '../x': utf8('') }); return false; } catch { return true; } })(), 'chặn tên ../');
});

test('canon: khóa sắp xếp, bỏ undefined', () => {
  assert.equal(canon({ b: 1, a: [2, { d: 1, c: undefined }] }), '{"a":[2,{"d":1}],"b":1}');
});

test('đóng gói rồi mở bằng khóa tr và ed: đúng nội dung, đạt mọi kiểm tra', async () => {
  const k = await keys(), { files, manifest } = await buildFiles(input());
  assert.equal(manifest.stats.tasks, 2); assert.equal(manifest.stats.autoGraded, 2); assert.equal(manifest.stats.manualGraded, 1);
  const w = await sealWsp(files, manifest, { signer: k.signer, recipients: { tr: k.tr.publicKey, ed: k.ed.publicKey }, producer: 'test' });
  for (const [who, kp] of [['tr', k.tr], ['ed', k.ed]] as const) {
    const r = await openWsp(w, { trust: k.trust, who, privateKey: kp.privateKey });
    assert.deepEqual(r.errors, []);
    assert.deepEqual(JSON.parse(fromUtf8(r.files['key.json'])), key);
    assert.deepEqual(JSON.parse(fromUtf8(r.files['source.json'])), { title: 'Thử', tasks: [] });
  }
  const env = readEnvelope(w).envelope;
  assert.equal(env.title, 'Thử'); assert.ok(!JSON.stringify(env).includes('goes'));
});

test('sửa một byte bất kỳ → từ chối', async () => {
  const k = await keys(), { files, manifest } = await buildFiles(input());
  const w = await sealWsp(files, manifest, { signer: k.signer, recipients: { tr: k.tr.publicKey }, producer: 'test' });
  for (let at = 0; at < w.length; at++) {
    const bad = w.slice(); bad[at] ^= 1;
    const r = await inspectWsp(bad, { trust: k.trust, who: 'tr', privateKey: k.tr.privateKey });
    assert.equal(r.ok, false, `byte ${at}`);
  }
});

test('khóa ký lạ hoặc sai khóa giải mã → từ chối', async () => {
  const k = await keys(), other = await genSignKey(), { files, manifest } = await buildFiles(input());
  const w = await sealWsp(files, manifest, { signer: k.signer, recipients: { tr: k.tr.publicKey }, producer: 'test' });
  assert.equal((await inspectWsp(w, { trust: {} })).ok, false);
  assert.equal((await inspectWsp(w, { trust: { 'k-test': other.publicKey } })).ok, false);
  assert.equal((await inspectWsp(w, { trust: k.trust, who: 'tr', privateKey: k.ed.privateKey })).ok, false);
  assert.equal((await inspectWsp(w, { trust: k.trust })).ok, true, 'chỉ kiểm chữ ký');
});

test('kiểm nội dung bắt lỗi: data-ans lạ / thiếu, script, URL ngoài, đáp án trong slots, file thiếu', async () => {
  const bad = async (f: (i: WspInput) => void, want: RegExp) => {
    const i = input(); f(i);
    const { files } = await buildFiles(i), r = await checkFiles(files);
    assert.ok(r.errors.some(e => want.test(e)), `${want}: ${r.errors.join(' | ')}`);
  };
  await bad(i => { i.pages = [page.replace('t1.i1', 't1.i9')]; }, /t1\.i9|t1\.i1/);
  await bad(i => { i.pages = [page + '<script>x</script>']; }, /bị cấm/);
  await bad(i => { i.pages = [page.replace('<p>', '<p onclick="x">')]; }, /sự kiện/);
  await bad(i => { i.pages = [page.replace('media/a.png', 'https://x.com/a.png')]; }, /ngoài gói/);
  await bad(i => { i.media = {}; }, /media\/a\.png/);
  await bad(i => { (i.slots[0] as unknown as Record<string, unknown>).accept = ['goes']; }, /trường đáp án/);
  await bad(i => { i.pages = [page + '<p>I get up at six every morning.</p>']; }, /bài mẫu/);
  await bad(i => { delete i.key['t1.i2']; }, /thiếu đáp án/);
  const ok = await checkFiles((await buildFiles(input())).files);
  assert.deepEqual(ok.errors, []);
});

test('phần học sinh không có key.json, source.json', async () => {
  const v = studentView((await buildFiles(input())).files);
  assert.ok(!('key.json' in v) && !('source.json' in v) && 'slots.json' in v);
  const all = Object.entries(v).filter(([p]) => !p.endsWith('.png') && !p.endsWith('.woff2')).map(([, b]) => fromUtf8(b)).join('\n');
  assert.ok(!all.includes('"goes"') && !all.includes('every morning'));
});
