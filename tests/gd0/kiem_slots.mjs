// Kiểm kết quả slots_phieu.py: kiểm khuôn (shared/validate) từng phiếu; nếu trang có data-ans thì khớp 1–1 với slots.
// Cách dùng: node tests/gd0/kiem_slots.mjs <thư mục ra> [--dom]
import fs from 'node:fs';
import path from 'node:path';
import { validate } from '../../shared/src/index.ts';
const dir = process.argv[2], needDom = process.argv.includes('--dom');
let bad = 0, nS = 0, nW = 0;
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
  const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const e = validate(d.slots, d.key);
  const ids = new Set(d.slots.map(s => s.id)), dom = Object.keys(d.dom || {});
  if (needDom) {
    dom.filter(k => !ids.has(k)).forEach(k => e.push(`trang có data-ans "${k}" nhưng không có trong danh sách`));
    [...ids].filter(k => !(k in d.dom)).forEach(k => e.push(`chỗ "${k}" không thấy trên trang`));
  }
  nS += d.slots.length; nW += d.warn.length;
  console.log(e.length ? 'FAIL' : 'PASS', d.src, `${d.slots.length} chỗ`, e.length ? '\n   ' + e.slice(0, 12).join('\n   ') + (e.length > 12 ? `\n   … (${e.length})` : '') : '');
  if (e.length) bad++;
}
console.log(`Tổng: ${nS} chỗ trả lời, ${nW} cảnh báo`);
console.log(bad ? 'SOME FAIL' : 'ALL OK');
