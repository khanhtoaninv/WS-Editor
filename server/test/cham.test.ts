// Máy chủ lớp thử v120: chấm chữa. Chạy: npm run test:lop
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boot, client, upload } from './api.test.ts';

test('chấm chữa', async () => {
  const S = await boot();
  try {
    const gv = client(S.base);
    await gv('/api/gv/dang-nhap', { json: { matKhau: '123456' } });
    const lop = (await gv('/api/lop', { json: { ten: '4A', hocSinh: ['An', 'Bình', 'Chi', 'Dũng'] } })).j;
    const g = await upload(gv), ph = (await gv('/api/phien', { json: { lop: lop.id, goi: g.j.id } })).j;
    const lam = async (i: number, a: Record<string, string>) => { const c = client(S.base); await c('/api/hs/vao', { json: { phien: ph.id, hs: lop.hocSinh[i].id } }); return c('/api/hs/nop', { json: { answers: a } }); };
    await lam(0, { 't1.i1': 'goes', 't1.i2': 'play', 't2.i1': 'b', 't3.i1': 'I like dogs.' });
    await lam(1, { 't1.i1': 'go', 't1.i2': 'play', 't2.i1': 'a' });
    await lam(2, { 't1.i1': 'goes', 't1.i2': 'play', 't2.i1': 'b' });
    const hs0 = lop.hocSinh[0].id;
    assert.equal((await gv(`/api/phien/${ph.id}/cham/${hs0}`, { method: 'PUT', json: { overrides: {} } })).status, 409, 'phiên mở: chưa chấm');
    await gv(`/api/phien/${ph.id}/ket-thuc`, { json: {} });
    const c0 = (await gv(`/api/phien/${ph.id}/cham`)).j;
    assert.equal(c0.hocSinh.length, 4); assert.ok(c0.key['t1.i1'], 'giáo viên có đáp án');
    const a0 = c0.hocSinh.find((h: any) => h.hs === hs0); assert.equal(a0.score, 2); assert.equal(a0.pending, 1);
    // chấm tay 1,5/2 (kẹp 0..tối đa), sửa câu máy chấm, nhận xét, chốt
    const r = (await gv(`/api/phien/${ph.id}/cham/${hs0}`, { method: 'PUT', json: { overrides: { 't3.i1': { score: 1.5 }, 't1.i2': { score: 9, comment: 'chấp nhận' }, 'lạ': { score: 1 } }, nhanXet: 'Tốt', xong: true } })).j;
    assert.equal(r.score, 4.5); assert.equal(r.pending, 0); assert.equal(r.xong, true);
    const c1 = (await gv(`/api/phien/${ph.id}/cham`)).j.hocSinh.find((h: any) => h.hs === hs0);
    assert.deepEqual(c1.overrides, { 't3.i1': { score: 1.5 }, 't1.i2': { score: 1, comment: 'chấp nhận' } });
    assert.equal((await gv(`/api/phien/${ph.id}`)).j.hocSinh.find((h: any) => h.id === hs0).xongCham, true);
    // học sinh / người ngoài không vào được
    const x = client(S.base);
    assert.equal((await x(`/api/phien/${ph.id}/cham`)).status, 401);
    assert.equal((await x(`/api/phien/${ph.id}/cham/${hs0}`, { method: 'PUT', json: { overrides: {} } })).status, 401);
  } finally { await S.stop(); }
});
