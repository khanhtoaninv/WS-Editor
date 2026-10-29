// Kiểm một file MD phiếu: đọc bằng bộ đọc MD của ws-editor.html, in loại câu hỏi, số câu, ghi chú từng Task.
// Đối số 2 (tiền tố ảnh, tùy chọn): dựng cả phiếu, in cảnh báo tràn trang và chụp từng trang.
// Nhận cả bài AI trả về (hai khối mã): lấy khối ```markdown.
// Chạy từ thư mục gốc repo (cần playwright): node docs/TAO_BAI/cong-cu/kiem-md.cjs <file.md> [tiền_tố_ảnh]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  let md = fs.readFileSync(process.argv[2], 'utf8');
  const shot = process.argv[3];
  const block = md.match(/```markdown\n([\s\S]*?)\n```/);
  if (block) md = block[1];

  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  const errs = [];
  pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('file://' + path.resolve(__dirname, '../../../ws-editor.html'));
  await pg.waitForTimeout(1200);

  const r = await pg.evaluate(m => {
    const r = readMd(m);
    if (r.err) return { err: r.err };
    return { n: r.tasks.length, tasks: r.tasks.map(x => x.err ? { err: x.err } : { q: qOf(x.t), items: its(x.t).length, notes: x.notes }) };
  }, md);
  console.log(JSON.stringify(r, null, 1));

  if (shot && !r.err) {
    await pg.evaluate(m => { const J = readMd(m); loadSheet({ tasks: J.tasks.filter(x => !x.err).map(x => x.t) }); }, md);
    await pg.waitForTimeout(600);
    console.log('tràn trang:', await pg.innerText('#diagBadge'));
    const n = await pg.locator('#stage .page').count();
    for (let i = 0; i < n; i++) await pg.locator('#stage .page').nth(i).screenshot({ path: `${shot}_p${i + 1}.png` });
    console.log('số trang:', n);
  }
  console.log('lỗi console:', errs);
  await b.close();
})();
