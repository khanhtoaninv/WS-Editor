#!/usr/bin/env node
// Máy kiểm phiếu v1.2 (nhóm A và D trong TIEU_CHI_DAT.md). Không cần thư viện.
// Dùng: node kiem-phieu.cjs <file phản hồi nguyên của AI>   (thoát 1 nếu có LỖI)
const fs = require('fs');
const raw = fs.readFileSync(process.argv[2], 'utf8');
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
Object.keys(keys).forEach(k => Object.values(keys[k]).forEach(v => { if (/ \/ /.test(v)) W('Task ' + k + ': khóa có "a / b" (chưa rõ editor tách): ' + v); }));

// ---- từ chỉ thời gian ----
const TIME = /\b(now|right now|at the moment|today|every ?(day|morning|evening|week|saturday|sunday)|on (saturdays|sundays|mondays|weekends|fridays)|usually|always|often|sometimes|never|after (school|dinner|lunch)|before (bed|school)|in the (morning|evening|afternoon)|at the weekend|these days|listen|look|at \d{1,2}(:\d\d)? ?([ap]\.?m\.?)?|at \d{1,2} o'clock)\b/i;
const VERBS = { play: /\bplay(s|ing)?\b/gi, read: /\bread(s|ing)?\b/gi, watch: /\bwatch(es|ing)?\b/gi, eat: /\beat(s|ing)?\b/gi, go: /\b(go|goes|going)\b/gi, ride: /\bri(de|des|ding)\b/gi, swim: /\bswim(s|ming)?\b/gi, draw: /\bdraw(s|ing)?\b/gi };
const totals = {}; Object.keys(VERBS).forEach(v => totals[v] = 0);
const seqs = {}; const stems = [];

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
      it.opts.forEach(x => { if (TIME.test(x.t)) E('Task ' + n + ' câu ' + it.no + ' lựa chọn ' + x.L + ' có từ chỉ thời gian: "' + x.t + '"'); });
      const ok = it.opts.find(x => x.L === k); if (ok) out.push(stem, ok.t);
      if (ok && it.no > 0) { const sw = new Set((stem.toLowerCase().match(/[a-z']+/g) || [])); const echo = (ok.t.toLowerCase().match(/[a-z']+/g) || []).filter(w => /^(play|read|watch|eat|go|ride|swim|draw|make|cook|wash|sing|help)(s|es|ing)$/.test(w) && sw.has(w)); if (echo.length) E('Task ' + n + ' câu ' + it.no + ': đáp án lặp lại dạng động từ có trong câu hỏi (' + echo.join(',') + ')'); }
      stems.push([n, it.no, stem]);
      it.meaning = !TIME.test(stem);
    });
    seqs[n] = letters;
    // câu hỏi lộ thì
    const rev = items.filter(it => it.no > 0 && /\b(What (does|do|is|are) \w+( \w+)? (do|doing)\b|What (sport )?do you do|What are you doing)/i.test(it.text.join(' '))).map(it => it.no);
    I('Task ' + n + ' câu hỏi lộ thì: ' + rev.length + ' (câu ' + rev.join(',') + ')'); if (rev.length > 2) E('Task ' + n + ': ' + rev.length + ' câu hỏi "lộ thì" (tối đa 2)');
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
        { const ing = opts.filter(o => /ing\b/.test(o)).length; if (ing === 0 || ing === 3) E('Task ' + n + ' câu ' + it.no + ': ba vế không có cặp khác thì (cần ít nhất một vế -ing và một vế không -ing): ' + g); }
        opts.forEach(o => { if (TIME.test(o)) E('Task ' + n + ' câu ' + it.no + ' vế có từ chỉ thời gian: ' + o); });
        pos.push(opts.findIndex(o => o.startsWith('*')) + 1);
      });
      const clean = txt.replace(/\{([^}]*)\}/g, (_, g) => (g.split('|').find(o => o.startsWith('*')) || g.split('|')[0]).replace('*', ''));
      out.push(clean); stems.push([n, it.no, clean.replace(/\{[^}]*\}/g, '')]);
      it.meaning = !TIME.test(txt.replace(/\{[^}]*\}/g, ' '));
    });
    seqs[n] = pos.map(String);
  } else if (t.dang === 'điền từ') {
    items.forEach(it => {
      const stem = it.text.join(' ');
      if (!K[it.no]) E('Task ' + n + ' câu ' + it.no + ': thiếu đáp án');
      const blanks = (stem.match(/___/g) || []).length; if (!blanks) E('Task ' + n + ' câu ' + it.no + ': không có ___');
      if (/____/.test(stem)) E('Task ' + n + ' câu ' + it.no + ': dùng ____ (phải ___)');
      out.push(stem); stems.push([n, it.no, stem]);
      it.meaning = !TIME.test(stem);
    });
  } else if (t.dang === 'viết câu') {
    L.forEach(l => { const q = (l.match(/"([^"]+)"/) || [])[1]; if (!q) return;
      if (/\b(plays|swims|reads|draws|watches|eats|rides|goes)\b[^.]*\bnow\b/i.test(q)) E('Task ' + n + ': lời của bạn sai ngữ pháp (hiện tại đơn với now): "' + q + '"');
      if (/\b(is|are) \w+ing\b[^.]*\bon (saturdays|sundays)\b/i.test(q)) E('Task ' + n + ': lời của bạn sai ngữ pháp (tiếp diễn với on Saturdays): "' + q + '"'); });
    out.push(L.filter(l => !/^(Hướng dẫn|Dạng|Khung từ|Dòng viết)/.test(l)).join(' '));
  } else { out.push(L.filter(l => !/^(Hướng dẫn|Dạng|Khung từ|Dòng viết)/.test(l)).join(' ')); }
  { const MUST = { 2: [2, 4], 3: [4, 6], 4: [1, 4] }[n]; if (MUST) MUST.forEach(no => { const it = items.find(x => x.no === no); if (it && it.meaning === false) E('Task ' + n + ' câu ' + no + ': vị trí bắt buộc không có từ chỉ thời gian, nhưng câu có'); if (!it) E('Task ' + n + ' thiếu câu ' + no); }); }
  // tỷ lệ nghĩa thuần (loại câu ví dụ 0)
  if (['chọn A/B/C', 'chọn trong câu', 'điền từ'].includes(t.dang)) {
    const sc = items.filter(it => it.no > 0), mc = sc.filter(it => it.meaning).length;
    const pct = sc.length ? Math.round(100 * mc / sc.length) : 0;
    I('Task ' + n + ' (' + t.dang + '): câu không có từ thời gian ' + mc + '/' + sc.length + ' = ' + pct + '%');
    if (pct < 20) E('Task ' + n + ': chỉ ' + pct + '% câu không có từ chỉ thời gian (tối thiểu 20%)');
  }
  // động từ
  const txt = out.join(' '); const c = {};
  Object.keys(VERBS).forEach(v => { c[v] = (txt.match(VERBS[v]) || []).length; totals[v] += c[v]; });
  const lim = ['chọn A/B/C', 'chọn trong câu', 'điền từ'].includes(t.dang) ? 4 : 3;
  Object.keys(c).forEach(v => { if (c[v] > lim) E('Task ' + n + ': động từ "' + v + '" ' + c[v] + ' lần (tối đa ' + lim + ')'); });
  const cans = (txt.match(/\b[Cc]an (I|you)\b(?!['’]t)/g) || []).length;
  if (cans > 1) E('Task ' + n + ': ' + cans + ' lượt "Can I/you" (tối đa 1)');
  const sorry = (txt.match(/Sorry, I can['’]t/g) || []).length; totals._sorry = (totals._sorry || 0) + sorry;
  // hỏi người về chính họ bằng ngôi thứ ba: "A: What does Mia do?" rồi "Mia: "
  const lm = L.join('\n').match(/^\s*(\w+): .*\b(Mia|Tom|Dad|Mum|Grandma|Ben|Lucy)\b.*$/gm) || [];
});
Object.keys(VERBS).forEach(v => { if (totals[v] > 12) E('Cả phiếu: động từ "' + v + '" ' + totals[v] + ' lần (tối đa 12)'); });
if (totals._sorry > 2) E('"Sorry, I can\'t" ' + totals._sorry + ' lần (tối đa 2)');
I('Động từ cả phiếu: ' + Object.keys(VERBS).map(v => v + ' ' + totals[v]).join(', '));

// ---- dãy đáp án ----
Object.keys(seqs).forEach(n => {
  const s = seqs[n]; if (s.length < 5) return;
  I('Task ' + n + ' dãy đáp án: ' + s.join(' '));
  const set = new Set(s); if (set.size < 3) E('Task ' + n + ': dãy chưa dùng đủ 3 vị trí');
  for (let i = 2; i < s.length; i++) if (s[i] === s[i - 1] && s[i] === s[i - 2]) E('Task ' + n + ': ba đáp án giống nhau liền nhau');
  for (const p of [2, 3]) { let ok = s.length >= 2 * p; for (let i = p; i < s.length; i++) if (s[i] !== s[i - p]) ok = false; if (ok) E('Task ' + n + ': dãy lặp chu kỳ ' + p + ' (' + s.join(' ') + ')'); }
});

// ---- trùng mẫu câu hỏi ----
const norm = s => s.toLowerCase().replace(/[^a-z' ]/g, ' ').replace(/\b(tom|mia|dad|mum|grandma|brother|sister|your|his|her|my|the|a)\b/g, '').split(/\s+/).filter(Boolean).slice(0, 5).join(' ');
const seen = {};
stems.forEach(([n, no, st]) => { if (no === 0) return; const q = (st.match(/[A-Z][^.?!:]*\?/) || [''])[0]; if (q.split(' ').length < 4) return; const k = norm(q); (seen[k] = seen[k] || []).push('T' + n + 'c' + no); });
Object.keys(seen).forEach(k => { if (seen[k].length > 1) W('Mẫu câu hỏi trùng "' + k + '": ' + seen[k].join(', ')); });

console.log('--- THÔNG TIN'); info.forEach(x => console.log(' ' + x));
console.log('--- CẢNH BÁO (' + warn.length + ')'); warn.forEach(x => console.log(' ! ' + x));
console.log('--- LỖI (' + err.length + ')'); err.forEach(x => console.log(' X ' + x));
process.exit(err.length ? 1 : 0);
