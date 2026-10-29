#!/usr/bin/env node
// Máy kiểm phiếu v2.0 (nhóm A và D trong TIEU_CHI_DAT.md). Không cần thư viện.
// Dùng: node kiem-phieu.cjs <file phản hồi nguyên của AI> <file cấu hình của bài (kiem-cau-hinh.json)>
// Thoát mã 1 nếu có LỖI.
// Phần cố định theo chuyên đề Grammar (số Task, vị trí bắt buộc, số câu) viết thẳng trong file này,
// theo "Phiếu mặc định" của Trình tự. Phần riêng của từng bài (dấu hiệu bề mặt, mục chính, giới hạn riêng...)
// đọc từ file cấu hình; xem thu-vien/lesson/<bài>/kiem-cau-hinh.json.
const fs = require('fs');
if (process.argv.length < 4) { console.error('Dùng: node kiem-phieu.cjs <file phản hồi> <kiem-cau-hinh.json>'); process.exit(2); }
const raw = fs.readFileSync(process.argv[2], 'utf8');
const CFG = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
const CUE = new RegExp(CFG.dauHieuBeMat, 'i');
const CUE_IN_OPT_FORBIDDEN = CFG.dauHieuTrongLuaChon === 'cam';
const MAIN = {}; Object.keys(CFG.mucChinh || {}).forEach(k => MAIN[k] = new RegExp(CFG.mucChinh[k], 'gi'));
const LIM = Object.assign({ moiTaskLuyen: 4, moiTaskKhac: 3, caPhieu: 12 }, CFG.gioiHan || {});
const SPLIT = CFG.phanLoaiVe ? new RegExp(CFG.phanLoaiVe) : null;
const REVEAL = CFG.cauHoiLoDapAn ? new RegExp(CFG.cauHoiLoDapAn, 'i') : null;
const REVEAL_MAX = CFG.toiDaLoDapAn == null ? 2 : CFG.toiDaLoDapAn;
const ECHO_EXTRA = (CFG.dangKiemLapThem || []).map(r => new RegExp(r, 'gi')); // từ chỉ dùng để kiểm "đáp án lặp lại câu hỏi", không đếm giới hạn
const EXEMPT = CFG.boQuaGioiHanLapTask || []; // Task không tính vào giới hạn lặp (ví dụ bảng nhận biết lặp từ theo thiết kế)
const err = [], warn = [], info = [];
const E = m => err.push(m), W = m => warn.push(m), I = m => info.push(m);

// ---- tách hai khối ----
const lines0 = raw.split('\n');
const BLOCK_ONLY = !lines0.some(l => /^```/.test(l)); // file chỉ có khối 1 (không rào)
if (BLOCK_ONLY) W('File không có rào ``` nào: coi cả file là khối 1, bỏ kiểm khối 2 và dòng đầu');
else if (!/^```markdown\s*$/.test(lines0[0])) E('Dòng đầu tiên của phản hồi không phải ```markdown');
let start = lines0.findIndex(l => /^```/.test(l));
let md, rest = '';
if (start === 0 || /^```markdown/.test(lines0[start] || '')) {
  const end = lines0.findIndex((l, i) => i > start && /^```\s*$/.test(l));
  md = lines0.slice(start + 1, end < 0 ? undefined : end).join('\n');
  rest = end < 0 ? '' : lines0.slice(end + 1).join('\n');
} else {
  const end = lines0.findIndex(l => /^```/.test(l));
  md = lines0.slice(0, end < 0 ? undefined : end).join('\n');
  rest = end < 0 ? '' : lines0.slice(end).join('\n');
}
if (!BLOCK_ONLY && !/^```text\s*$/m.test(rest)) E('Khối 2 phải mở bằng đúng ```text (hiện: ' + ((rest.match(/^```.*$/m) || ['không có'])[0]) + ')');
rest.split('\n').forEach(l => {
  if (/^Task\s*\d/i.test(l)) E('Khối 2 có dòng bắt đầu "Task <số>" (phải là T<số>:): ' + l.slice(0, 50));
  if (/^#/.test(l)) E('Khối 2 có dòng bắt đầu bằng #: ' + l.slice(0, 50));
});

// ---- chữ rác / suy nghĩ của AI ----
const junk = /\b(Wait, (in|let|this|that|I|actually|the)|Hmm|Actually,|Let me|On second thought|I need to|Oops|Correction)\b/;
md.split('\n').forEach((l, i) => { if (junk.test(l)) E('Chữ rác trong phiếu: "' + l.trim().slice(0, 70) + '"'); });

// ---- tách Task ----
const ansIdx = md.search(/^## Đáp án\s*$/m);
const body = ansIdx < 0 ? md : md.slice(0, ansIdx);
const ansTxt = ansIdx < 0 ? '' : md.slice(ansIdx);
if (ansIdx < 0) W('Không có ## Đáp án');
else if (!/^### Task 0\s*$/m.test(ansTxt)) E('Thiếu dòng ### Task 0 ở cuối phần đáp án');
const tasks = body.split(/^## Task:/m).slice(1).map(t => {
  const L = t.split('\n'); return { title: L[0].trim(), lines: L.slice(1), dang: ((t.match(/^Dạng:\s*(.+)$/m) || [])[1] || '').trim() };
});
I('Số Task: ' + tasks.length);
if (tasks.length !== 6) E('Số Task phải là 6, hiện ' + tasks.length);
const VALID = ['bảng', 'chọn A/B/C', 'chọn trong câu', 'điền từ', 'viết câu', 'viết tự do'];
tasks.forEach((t, i) => { if (!VALID.includes(t.dang)) E('Task ' + (i + 1) + ': Dạng không hợp lệ "' + t.dang + '"'); });

// ---- đáp án ----
const keys = {}; let cur = 0;
ansTxt.split('\n').forEach(l => {
  let m;
  if ((m = l.match(/^### Task (\d+)\s*$/))) { cur = +m[1]; return; }
  if ((m = l.match(/^Task\s*\d+\s*:/i))) { E('Dòng đáp án dạng "Task N:" ghi đè khóa'); return; }
  if (cur && (m = l.match(/^(\d+)\.\s*(.*)$/))) { (keys[cur] = keys[cur] || {})[+m[1]] = m[2].trim(); }
});
// khóa dạng "a / b" là cú pháp đáp án chấp nhận hợp lệ của Editor (docs/TUONG_TAC/2_CHUAN_GOI_PHIEU.md), không cảnh báo

const totals = {}; Object.keys(MAIN).forEach(v => totals[v] = 0);
(CFG.gioiHanRieng || []).forEach(r => totals['_' + r.ten] = 0);
const seqs = {}; const stems = [];
const countRe = (re, s) => { re.lastIndex = 0; return (s.match(re) || []).length; };

tasks.forEach((t, ti) => {
  const n = ti + 1, K = keys[n] || {};
  const L = t.lines; const out = []; // văn bản học sinh thấy, chỉ đáp án đúng
  let items = [], curItem = null;
  L.forEach(l => {
    if (/^(Hướng dẫn|Dạng|Khung từ|Dòng viết|Khối chữ trên)/.test(l)) return;
    const m = l.match(/^(\d+)\.\s(.*)$/);
    if (m && !/^\s/.test(l)) { curItem = { no: +m[1], text: [m[2]], opts: [] }; items.push(curItem); return; }
    const o = l.match(/^\s+([ABC])\.\s(.*)$/);
    if (o && curItem) { curItem.opts.push({ L: o[1], t: o[2] }); return; }
    if (curItem && /^\s+\S/.test(l)) curItem.text.push(l.trim());
  });
  if (t.dang === 'chọn A/B/C') {
    const letters = [];
    items.forEach(it => {
      const ls = it.opts.map(x => x.L).join('');
      if (ls !== 'ABC') E('Task ' + n + ' câu ' + it.no + ': có ' + it.opts.length + ' lựa chọn (' + ls + '), phải đúng A B C');
      const k = K[it.no];
      if (!k) E('Task ' + n + ' câu ' + it.no + ': thiếu đáp án'); else if (!/^[ABC]$/.test(k)) E('Task ' + n + ' câu ' + it.no + ': đáp án không phải A/B/C: ' + k); else letters.push(k);
      const stem = it.text.join(' ');
      if (CUE_IN_OPT_FORBIDDEN) it.opts.forEach(x => { if (CUE.test(x.t)) E('Task ' + n + ' câu ' + it.no + ' lựa chọn ' + x.L + ' có dấu hiệu bề mặt: "' + x.t + '"'); });
      const ok = it.opts.find(x => x.L === k); if (ok) out.push(stem, ok.t);
      if (ok && it.no > 0) {
        const sw = new Set((stem.toLowerCase().match(/[a-z']+/g) || []));
        const okWords = new Set(); Object.keys(MAIN).map(v => MAIN[v]).concat(ECHO_EXTRA).forEach(re => { re.lastIndex = 0; (ok.t.toLowerCase().match(re) || []).forEach(w => okWords.add(w)); });
        const echo = [...okWords].filter(w => sw.has(w));
        if (echo.length) E('Task ' + n + ' câu ' + it.no + ': đáp án lặp lại dạng của mục chính có trong câu hỏi (' + echo.join(',') + ')');
      }
      stems.push([n, it.no, stem]);
      it.meaning = !CUE.test(stem);
    });
    seqs[n] = letters;
    if (REVEAL) {
      const rev = items.filter(it => it.no > 0 && REVEAL.test(it.text.join(' '))).map(it => it.no);
      I('Task ' + n + ' câu hỏi lộ đáp án: ' + rev.length + ' (câu ' + rev.join(',') + ')'); if (rev.length > REVEAL_MAX) E('Task ' + n + ': ' + rev.length + ' câu hỏi lộ đáp án (tối đa ' + REVEAL_MAX + ')');
    }
  } else if (t.dang === 'chọn trong câu') {
    const pos = [];
    items.forEach(it => {
      let txt = it.text.join(' ');
      const groups = txt.match(/\{[^}]*\}/g) || [];
      if (!groups.length) E('Task ' + n + ' câu ' + it.no + ': không có {…}');
      if ((txt.match(/\{/g) || []).length !== (txt.match(/\}/g) || []).length) E('Task ' + n + ' câu ' + it.no + ': ngoặc {} lệch');
      groups.forEach(g => {
        const opts = g.slice(1, -1).split('|');
        if (opts.length !== 3) E('Task ' + n + ' câu ' + it.no + ': {} có ' + opts.length + ' vế, phải đúng 3: ' + g);
        const st = opts.filter(o => o.startsWith('*')).length;
        if (st !== 1) E('Task ' + n + ' câu ' + it.no + ': {} có ' + st + ' dấu *, phải đúng 1: ' + g);
        if (SPLIT) { const c = opts.filter(o => SPLIT.test(o)).length; if (c === 0 || c === 3) E('Task ' + n + ' câu ' + it.no + ': ba vế không có cặp khác cách dùng (cần ít nhất một vế khớp và một vế không khớp /' + CFG.phanLoaiVe + '/): ' + g); }
        if (CUE_IN_OPT_FORBIDDEN) opts.forEach(o => { if (CUE.test(o)) E('Task ' + n + ' câu ' + it.no + ' vế có dấu hiệu bề mặt: ' + o); });
        pos.push(opts.findIndex(o => o.startsWith('*')) + 1);
      });
      const clean = txt.replace(/\{([^}]*)\}/g, (_, g) => (g.split('|').find(o => o.startsWith('*')) || g.split('|')[0]).replace('*', ''));
      out.push(clean); stems.push([n, it.no, clean.replace(/\{[^}]*\}/g, '')]);
      it.meaning = !CUE.test(txt.replace(/\{[^}]*\}/g, ' '));
    });
    seqs[n] = pos.map(String);
  } else if (t.dang === 'điền từ') {
    items.forEach(it => {
      const stem = it.text.join(' ');
      if (!K[it.no]) E('Task ' + n + ' câu ' + it.no + ': thiếu đáp án');
      const blanks = (stem.match(/___/g) || []).length; if (!blanks) E('Task ' + n + ' câu ' + it.no + ': không có ___');
      if (/____/.test(stem)) E('Task ' + n + ' câu ' + it.no + ': dùng ____ (phải ___)');
      out.push(stem); stems.push([n, it.no, stem]);
      it.meaning = !CUE.test(stem);
    });
  } else if (t.dang === 'viết câu') {
    L.forEach(l => { const q = (l.match(/"([^"]+)"/) || [])[1]; if (!q) return;
      (CFG.loiBanSai || []).forEach(r => { if (new RegExp(r.regex, 'i').test(q)) E('Task ' + n + ': ' + r.thongBao + ': "' + q + '"'); }); });
    out.push(L.filter(l => !/^(Hướng dẫn|Dạng|Khung từ|Dòng viết)/.test(l)).join(' '));
  } else { out.push(L.filter(l => !/^(Hướng dẫn|Dạng|Khung từ|Dòng viết)/.test(l)).join(' ')); }
  // Theo "Phiếu mặc định" của Trình tự: vị trí bắt buộc (không dấu hiệu bề mặt) và số câu
  { const MUST = { 2: [2, 4], 3: [4, 6], 4: [1, 4] }[n]; if (MUST) MUST.forEach(no => { const it = items.find(x => x.no === no); if (it && it.meaning === false) E('Task ' + n + ' câu ' + no + ': vị trí bắt buộc không có dấu hiệu bề mặt, nhưng câu có'); if (!it) E('Task ' + n + ' thiếu câu ' + no); }); }
  { const need = { 2: 5, 3: 6, 4: 5 }[n]; if (need) { const cnt = items.filter(x => x.no > 0).length; if (cnt !== need) E('Task ' + n + ': có ' + cnt + ' câu đánh số 1+, cần đúng ' + need); if (!items.some(x => x.no === 0)) E('Task ' + n + ': thiếu câu ví dụ số 0'); } }
  if (n === 1 && CFG.hangMau) { const rows = L.filter(l => /\|/.test(l) && !/^(Name|Word)\b/.test(l)); const first = rows[0] || ''; if (!new RegExp('^' + CFG.hangMau + '\\b').test(first.trim()) || /=/.test(first)) E('Task 1: hàng mẫu đầu phải là "' + CFG.hangMau + '" đã điền (không dấu =): ' + first.slice(0, 40)); }
  // tỷ lệ câu xác định bằng nghĩa (loại câu ví dụ 0)
  if (['chọn A/B/C', 'chọn trong câu', 'điền từ'].includes(t.dang)) {
    const sc = items.filter(it => it.no > 0), mc = sc.filter(it => it.meaning).length;
    const pct = sc.length ? Math.round(100 * mc / sc.length) : 0;
    I('Task ' + n + ' (' + t.dang + '): câu không có dấu hiệu bề mặt ' + mc + '/' + sc.length + ' = ' + pct + '%');
    if (pct < 20) E('Task ' + n + ': chỉ ' + pct + '% câu không có dấu hiệu bề mặt (tối thiểu 20%)');
  }
  // mục chính
  const txt = out.join(' '); const c = {};
  Object.keys(MAIN).forEach(v => { c[v] = countRe(MAIN[v], txt); if (!EXEMPT.includes(n)) totals[v] += c[v]; });
  const lim = ['chọn A/B/C', 'chọn trong câu', 'điền từ'].includes(t.dang) ? LIM.moiTaskLuyen : LIM.moiTaskKhac;
  if (!EXEMPT.includes(n)) Object.keys(c).forEach(v => { if (c[v] > lim) E('Task ' + n + ': mục chính "' + v + '" ' + c[v] + ' lần (tối đa ' + lim + ')'); });
  (CFG.gioiHanRieng || []).forEach(r => {
    const k = countRe(new RegExp(r.regex, 'g'), txt); totals['_' + r.ten] += k;
    if (r.moiTask != null && k > r.moiTask) E('Task ' + n + ': ' + k + ' lần "' + r.ten + '" (tối đa ' + r.moiTask + ' mỗi Task)');
  });
});
Object.keys(MAIN).forEach(v => { if (totals[v] > LIM.caPhieu) E('Cả phiếu: mục chính "' + v + '" ' + totals[v] + ' lần (tối đa ' + LIM.caPhieu + ')'); });
(CFG.gioiHanRieng || []).forEach(r => { if (r.caPhieu != null && totals['_' + r.ten] > r.caPhieu) E('Cả phiếu: "' + r.ten + '" ' + totals['_' + r.ten] + ' lần (tối đa ' + r.caPhieu + ')'); });
I('Mục chính cả phiếu: ' + Object.keys(MAIN).map(v => v + ' ' + totals[v]).join(', '));

// ---- dãy đáp án ----
Object.keys(seqs).forEach(n => {
  const s = seqs[n]; if (s.length < 5) return;
  I('Task ' + n + ' dãy đáp án: ' + s.join(' '));
  const set = new Set(s); if (set.size < 3) E('Task ' + n + ': dãy chưa dùng đủ 3 vị trí');
  for (let i = 2; i < s.length; i++) if (s[i] === s[i - 1] && s[i] === s[i - 2]) E('Task ' + n + ': ba đáp án giống nhau liền nhau');
  for (const p of [2, 3]) { let ok = s.length >= 2 * p; for (let i = p; i < s.length; i++) if (s[i] !== s[i - p]) ok = false; if (ok) E('Task ' + n + ': dãy lặp chu kỳ ' + p + ' (' + s.join(' ') + ')'); }
});

// ---- trùng mẫu câu hỏi ----
const stop = new RegExp('\\b(' + (CFG.tuBoQuaKhiSoMau || ['tom', 'mia', 'dad', 'mum', 'grandma', 'brother', 'sister', 'your', 'his', 'her', 'my', 'the', 'a']).join('|') + ')\\b', 'g');
const norm = s => s.toLowerCase().replace(/[^a-z' ]/g, ' ').replace(stop, '').split(/\s+/).filter(Boolean).slice(0, 5).join(' ');
const seen = {};
stems.forEach(([n, no, st]) => { if (no === 0) return; const q = (st.match(/[A-Z][^.?!:]*\?/) || [''])[0]; if (q.split(' ').length < 4) return; const k = norm(q); (seen[k] = seen[k] || []).push('T' + n + 'c' + no); });
Object.keys(seen).forEach(k => { if (seen[k].length > 1) W('Mẫu câu hỏi trùng "' + k + '": ' + seen[k].join(', ')); });

console.log('--- THÔNG TIN'); info.forEach(x => console.log(' ' + x));
console.log('--- CẢNH BÁO (' + warn.length + ')'); warn.forEach(x => console.log(' ! ' + x));
console.log('--- LỖI (' + err.length + ')'); err.forEach(x => console.log(' X ' + x));
process.exit(err.length ? 1 : 0);
