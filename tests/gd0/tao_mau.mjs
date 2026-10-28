// B5 GĐ0: tạo bộ phiếu mẫu cho shared/fixtures từ kết quả slots_phieu.py.
// Mỗi phiếu: slots.json, key.json, và 3 bài làm mẫu kèm KẾT QUẢ MONG ĐỢI dựng theo ý định (không gọi grade()):
//   dung-het   : mọi chỗ chấm máy trả lời đúng (chữ viết khác hoa thường / gạch nối / nháy cong để thử chuẩn hóa)
//   tron       : lần lượt đúng, sai, bỏ trống; chỗ chấm tay có bài viết → chờ chấm
//   bo-trong   : không làm gì
// Cách dùng: node tests/gd0/tao_mau.mjs <thư mục ra của slots_phieu.py> <shared/fixtures> <tên tệp json>...
import fs from 'node:fs';
import path from 'node:path';

const [src, dst, ...names] = process.argv.slice(2);
const vary = (s, n) => {   // viết khác đi mà vẫn phải được chấm đúng
  const v = [x => x.toUpperCase(), x => '  ' + x + '  ', x => x.replace(/'/g, '’'), x => x.replace(/ /g, '  '), x => x + '.'];
  return v[n % v.length](s);
};
const wrongOf = (s, k) => {
  if (k.type === 'choice-one' || k.type === 'match' || k.type === 'tf') { const o = (s.options || []).find(o => o.id !== k.correct); return o ? o.id : null; }
  if (k.type === 'choice-many') { const o = (s.options || []).find(o => !k.correct.includes(o.id)); return o ? [o.id] : null; }
  if (k.type === 'find') return '99,99-99,98';   // v116 tìm từ: ô không có trong lưới
  return 'zzz wrong';
};
const rightOf = (s, k, n) => {
  if (k.type === 'choice-one' || k.type === 'match' || k.type === 'tf') return k.correct;
  if (k.type === 'choice-many') return [...k.correct].reverse();
  if (k.type === 'find') return n % 2 ? k.correct.split('-').reverse().join('-') : k.correct;   // kéo ngược cũng đúng
  return vary(k.accept[0], n);
};

for (const nm of names) {
  const d = JSON.parse(fs.readFileSync(path.join(src, nm), 'utf8'));
  const out = path.join(dst, nm.replace(/\.json$/, '').replace(/^(tests__(md|real|gd0)|samples)__/, '').replace(/_(md|json)$/, ''));
  fs.mkdirSync(out, { recursive: true });
  const w = (f, o) => fs.writeFileSync(path.join(out, f), JSON.stringify(o, null, 1) + '\n');
  w('slots.json', { src: d.src, title: d.title, tasks: d.tasks, slots: d.slots, warn: d.warn });
  w('key.json', d.key);
  const sets = { 'dung-het': {}, tron: {}, 'bo-trong': {} }, exp = { 'dung-het': {}, tron: {}, 'bo-trong': {} };
  let i = 0;
  for (const s of d.slots) {
    const k = d.key[s.id], manual = s.grading === 'manual';
    // đúng hết
    if (manual) { sets['dung-het'][s.id] = 'Bài làm của học sinh.'; exp['dung-het'][s.id] = 'pending'; }
    else { sets['dung-het'][s.id] = rightOf(s, k, i); exp['dung-het'][s.id] = 'correct'; }
    // trộn
    const m = i % 3;
    if (manual) { if (m === 2) exp.tron[s.id] = 'blank'; else { sets.tron[s.id] = 'Bài làm.'; exp.tron[s.id] = 'pending'; } }
    else if (m === 0) { sets.tron[s.id] = rightOf(s, k, i); exp.tron[s.id] = 'correct'; }
    else if (m === 1) { const x = wrongOf(s, k); if (x == null) { sets.tron[s.id] = rightOf(s, k, i); exp.tron[s.id] = 'correct'; } else { sets.tron[s.id] = x; exp.tron[s.id] = 'wrong'; } }
    else exp.tron[s.id] = 'blank';
    exp['bo-trong'][s.id] = 'blank';
    i++;
  }
  for (const n of Object.keys(sets)) { w(`bai-${n}.json`, sets[n]); w(`mong-doi-${n}.json`, exp[n]); }
  console.log('→', out, d.slots.length, 'chỗ');
}
