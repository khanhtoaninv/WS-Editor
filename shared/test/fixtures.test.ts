// Bộ phiếu mẫu (shared/fixtures): mỗi phiếu thật có slots + key do WS Editor sinh, và các bài làm mẫu kèm trạng thái
// mong đợi từng chỗ (dựng theo ý định, không lấy từ grade()). grade() ở mọi nơi phải cho ra đúng như vậy.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { grade, validate, type Key, type Slot } from '../src/index.ts';

const DIR = new URL('../fixtures/', import.meta.url);
const read = (d: string, f: string) => JSON.parse(readFileSync(new URL(`${d}/${f}`, DIR), 'utf8'));
const dirs = existsSync(DIR) ? readdirSync(DIR).filter(d => existsSync(new URL(`${d}/slots.json`, DIR))) : [];

test('có phiếu mẫu', () => { assert.ok(dirs.length >= 5, `chỉ có ${dirs.length} phiếu mẫu`); });

for (const d of dirs) {
  test(`phiếu mẫu ${d}`, () => {
    const slots: Slot[] = read(d, 'slots.json').slots, key: Key = read(d, 'key.json');
    assert.deepEqual(validate(slots, key), [], 'kiểm khuôn');
    for (const n of ['dung-het', 'tron', 'bo-trong']) {
      const ans = read(d, `bai-${n}.json`), exp: Record<string, string> = read(d, `mong-doi-${n}.json`);
      const r = grade(slots, key, ans);
      const got = Object.fromEntries(slots.map(s => [s.id, r.perSlot[s.id].status]));
      assert.deepEqual(got, exp, `${d} / ${n}: trạng thái từng chỗ`);
      const nOk = Object.values(exp).filter(x => x === 'correct').length;
      assert.equal(r.score, nOk, `${d} / ${n}: điểm = số chỗ đúng`);
      assert.equal(r.pendingManual, Object.values(exp).filter(x => x === 'pending').length, `${d} / ${n}: số chỗ chờ chấm tay`);
    }
  });
}
