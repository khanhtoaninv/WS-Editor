// B6 GĐ0: bảng duyệt cho người dùng (docs/TUONG_TAC/DUYET_GD0.md): máy đọc đáp án từng chỗ trả lời ra sao.
// Cách dùng: node tests/gd0/bang_duyet.mjs <thư mục ra của slots_phieu.py> <tệp .md ra> <tên tệp json chi tiết>...
import fs from 'node:fs';
import path from 'node:path';

const [src, outFile, ...detail] = process.argv.slice(2);
const HOW = { text: 'gõ chữ', 'text-long': 'gõ câu / đoạn', 'choice-one': 'chọn một', 'choice-many': 'chọn nhiều', tf: 'chọn Đúng/Sai', match: 'nối', cell: 'gõ vào ô', draw: 'vẽ', static: 'chỉ xem' };
const GR = { auto: 'máy', manual: '**tay**', none: '—' };
const fo = o => { const x = String(o.text ?? o.img); return x === o.id || x.startsWith(o.id + '. ') ? x : `${o.id}. ${x}`; };
const cell = s => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 80);
const files = fs.readdirSync(src).filter(f => f.endsWith('.json')).sort();
const all = files.map(f => [f, JSON.parse(fs.readFileSync(path.join(src, f), 'utf8'))]);

let md = `# Bảng duyệt GĐ0: máy đọc đáp án của bạn thế nào

> Sinh tự động bởi \`tests/gd0/bang_duyet.mjs\` (${new Date().toISOString().slice(0, 10)}). Bạn chỉ cần dò cột **Đáp án máy đọc được**: có đúng đáp án bạn đã nhập trong WS Editor không, và cột **Chấm** (máy / tay) có hợp lý không.
> "Chấm tay" ở đây phần lớn là do **phiếu chưa nhập đáp án**, không phải lỗi. Nhập đáp án trong WS Editor là chỗ đó tự thành chấm máy.
> Nhiều đáp án đúng cho một chỗ viết: ghi cách nhau \` / \` (có dấu cách hai bên), ví dụ \`isn't / is not\`.

## 1. Tổng hợp ${all.length} phiếu (24 phiếu đường chuẩn + phiếu mẫu GĐ0)

| Phiếu | Số chỗ trả lời | Chấm máy | Chấm tay | Cảnh báo |
|---|---:|---:|---:|---:|
`;
for (const [, d] of all) {
  const a = d.slots.filter(s => s.grading === 'auto').length, m = d.slots.filter(s => s.grading === 'manual').length;
  md += `| ${cell(d.src)} | ${d.slots.length} | ${a} | ${m} | ${d.warn.length} |\n`;
}
const tot = all.reduce((x, [, d]) => x + d.slots.length, 0), totA = all.reduce((x, [, d]) => x + d.slots.filter(s => s.grading === 'auto').length, 0);
md += `| **Tổng** | **${tot}** | **${totA}** | **${tot - totA}** | |\n\n## 2. Chi tiết các phiếu mẫu\n`;

for (const nm of detail) {
  const d = JSON.parse(fs.readFileSync(path.join(src, nm), 'utf8'));
  md += `\n### ${cell(d.title)} (\`${d.src}\`)\n\n`;
  if (d.warn.length) md += d.warn.map(w => `- ⚠️ ${cell(w)}`).join('\n') + '\n\n';
  md += '| Task | Câu | Dạng | Cách làm | Phương án (đề) | Đáp án máy đọc được | Chấm |\n|---|---|---|---|---|---|---|\n';
  const tnum = Object.fromEntries(d.tasks.map((t, i) => [t.id, t.number || i + 1]));
  for (const s of d.slots) {
    const k = d.key[s.id] || {}, opt = id => { const o = (s.options || []).find(o => o.id === id); return o ? fo(o) : id; };
    const ans = k.accept ? k.accept.join(' / ') : k.correct != null ? [].concat(k.correct).map(opt).join(' + ') : k.sample ? `(bài mẫu) ${k.sample}` : '—';
    md += `| ${tnum[s.task]} | ${cell(s.label)} | ${s.q || ''} | ${HOW[s.interaction] || s.interaction} | ${cell((s.options || []).map(fo).join(' · '))} | ${cell(ans)} | ${GR[s.grading]} |\n`;
  }
}
fs.writeFileSync(outFile, md);
console.log('→', outFile, tot, 'chỗ');
