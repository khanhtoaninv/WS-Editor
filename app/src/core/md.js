// src/core/md.js — tách nguyên văn từ v106 (app/scripts/tach-core.mjs). Không dùng trạng thái giao diện (chọn, cột trái, hoàn tác).
import { ws } from './state.js';
import { AGE, ANS_DEF, IMP_MAX, IMP_MAX_CH, LAYOUT_DEF, QN, RECIPES, attachOpts, choiceTexts, ck, clone, ensureIds, ensureRowIds, featOf, fillSheet, fillTask, gapCount, hasChoiceMarkup, hasMarkup, isFreeW, isGridTbl, isObj, its, kindsOk, newId, normAnswer, qTidy, recipeMatch, tidy } from './model.js';
import { A2MM, TA, a2cfg, autoLayout, crossCell, gtN, imgRowN, layoutOf, layoutReasons, leadText, qOf, qnum, renderTask, taOf } from './layout.js';
// Câu nhận dòng đáp án: bỏ câu ví dụ, dòng chữ, và lượt hội thoại không có chỗ trống (GĐ0)
const keyable = x => !x.ex && !x.gt && !(x.who != null && !/___|\{/.test(x.text || ''));

export const PRESET_NAME = { compact: 'Gọn', normal: 'Vừa', airy: 'Thoáng' };

export function q2cfg(t) {
  const p = t.answer.params || {};
  if (t.answer.layout === 'A1') return { start: 'below', len: 'fill', mm: p.lenMm || A2MM[ws.age] || 35, lines: Math.max(1, p.lines || 1) };
  const c = a2cfg(t, null); return { start: c.start === 'below' ? 'below' : 'end', len: c.mode === 'fill' ? 'fill' : 'fixed', mm: c.mm, lines: c.lines };
}

export function q2set(t, patch) {
  const c = Object.assign(q2cfg(t), patch), p = t.answer.params = Object.assign({}, t.answer.params || {});
  t.answer.layout = 'A2'; t.answer.attach = 'item';
  p.lenMode = c.len === 'fill' ? 'fill' : 'fixed'; p.lenMm = Math.min(150, Math.max(15, c.mm)); p.lines = Math.min(20, Math.max(1, c.lines)); p.start = c.start === 'below' ? 'below' : 'inline';
  delete p.width; delete p.frame; delete p.boxH;
}

export function crossParse(lines) {
  const rows = lines.map(l => { const o = []; for (let i = 0; i < l.length; i++) { const ch = l[i]; if (ch === '(' && l[i + 2] === ')') { o.push('(' + l[i + 1] + ')'); i += 2; } else if (ch === '#' || /\s/.test(ch)) o.push(''); else o.push(ch); } return o; }), n = Math.max(1, ...rows.map(r => r.length));
  return rows.map(r => r.concat(Array(n - r.length).fill('')));
}

export const crossLines = c => c.rows.map(r => r.cells.map(v => { const x = crossCell(v); return x.k === 'none' ? '#' : x.k === 'empty' ? '.' : x.k === 'given' ? '(' + x.ch + ')' : x.ch; }).join(''));

export const A_SHORT = { A1: 'dòng kẻ', A2: 'gạch trống', A3: 'ô chữ cái', A4: 'khoanh lựa chọn', A5: 'ô tick', A6: 'khoanh T/F', A7: 'chấm nối', A8: 'dòng tô' };

export const recipeById = id => RECIPES.find(r => r.id === id);

// Cảnh báo nhập liệu: lv 'warn' = có thể sai, 'info' = chỉ để biết
// Đáp án có chỗ trả lời riêng (không dùng ___ trong câu): Đúng/Sai, viết câu, khoanh dưới câu, viết từ theo câu
// (khoanh A/B/C không tính: "She ___ a teacher. A. am B. is" là chỗ trống hợp lệ của lựa chọn)
export const dupGapKind = t => { const a = t.answer; return a.attach === 'item' && (a.kind === 'tf' || a.kind === 'sentence' || (a.kind === 'word' && ck(t) !== 'dialogue')); };

export function descOf(t) {
  const f = featOf(t), k = f.form, a = t.answer, c = t.content, p = [];
  const base = { questions: 'Câu hỏi', items: f.variant === 'multi' ? 'Nhiều ảnh mỗi câu' : 'Ảnh mỗi câu', pairs: 'Nối cặp', dialogue: 'Hội thoại', trace: 'Tô chữ', passage: 'Bài đọc', table: 'Bảng' }[k];
  if (k === 'empty') p.push(c.list === false ? 'Chỉ có ảnh' : 'Chưa có câu');
  else if (k === 'questions' && isFreeW(t)) { p.push((a.params || {}).frame === 'box' ? 'Khung vẽ tự do' : 'Viết tự do'); if (t.image) p.push('ảnh chung'); if ((t.extras || []).length) p.push('khối tự do'); return p.join(' · '); }   // v124: Q12 không phải "Câu hỏi · viết câu"
  else p.push(base || 'Câu hỏi');
  if (k === 'table') p.push({ text: 'ô có chữ', blank: 'ô trống để viết', tick: 'ô tick' }[f.cells]);
  else if (k !== 'empty') {
    const L = a.layout, inl = a.attach === 'inline';
    const an = !L ? 'không có chỗ trả lời' : L === 'A2' ? (inl ? 'điền chỗ trống' : 'viết từ') : L === 'A4' ? (inl ? 'chọn trong câu {a|b}' : (t.answer.params || {}).lab === 'box' ? 'tick lựa chọn' : 'khoanh A/B/C') : L === 'A1' ? 'viết câu' : L === 'A6' ? 'Đúng/Sai' : L === 'A5' ? 'tick' : L === 'A8' ? (k === 'trace' ? '' : 'dòng tô') : L === 'A7' ? (k === 'pairs' ? '' : 'chấm nối') : A_SHORT[L];
    if (an) p.push(an);
  }
  if (t.image && k !== 'empty') p.push('ảnh chung');
  if (k === 'dialogue' && leadText(t)) p.push('lời dẫn');
  if (f.lines) p.push('ô nhiều dòng');
  if (t.wordBank) p.push('khung từ');
  return p.join(' · ');
}

// Đổi loại đáp án: kèm các trường nội dung cần cho loại đó (A4 → lựa chọn, A7 → vế ghép…)
export function setKind(t, k) {
  const it = its(t), c = t.content;
  if (k === 'match' && !it.some(x => x.pair)) t.content.shuffle = true;   // v90: bài nối mới: cặp gõ = cặp đúng, in thì xáo
  if (k === 'match' && !it.some(x => x.pair)) it.forEach(x => { x.pair = { l: x.img ? { img: x.img, text: x.text || '' } : { text: x.text || '' }, r: { text: '' } }; delete x.text; delete x.img; delete x.opts; delete x.who; });
  if (k !== 'match' && it.some(x => x.pair)) it.forEach(x => { if (x.pair) { const l = x.pair.l || {}; x.text = l.text || ''; if (l.img) x.img = l.img; delete x.pair; } });
  if (k === 'trace') it.forEach(x => { delete x.opts; delete x.who; });
  const hasMark = it.some(x => hasChoiceMarkup([x.text || '', ...(x.lines || [])].join(' ')));
  if (k === 'choice' && !hasMark && ck(t) !== 'items' && !it.some(x => x.opts)) it.forEach(x => { x.opts = ['', '', '']; });
  if (k !== 'choice') it.forEach(x => { delete x.opts; });
  const d = clone(ANS_DEF[k]);
  t.answer = { kind: k, attach: d.attach, layout: d.layout, params: d.params };
  if (k === 'word' && (ck(t) === 'dialogue' || it.some(x => (x.text || '').includes('___')))) t.answer.attach = 'inline';
  if (k === 'choice' && hasMark) t.answer.attach = 'inline';
  if (c.form !== 'table' && !it.length && k !== 'none') c.items = [];
  normAnswer(t);
}

// Ô bảng: '' = ô trống viết, ✓ = ô tick, [ảnh: x] = ảnh; còn lại là chữ
export const fmtCell = v => typeof v === 'string' ? v : v && v.ans != null ? '=' + v.ans : v && v.tick ? (v.ok ? '[x]' : '[ ]') + (v.text ? ' ' + v.text : '') : v && v.img ? `[ảnh: ${v.img}]${v.text ? ' ' + v.text : ''}` : '';

// v92: "=chữ" = ô học sinh điền, chữ là đáp án (in trống)
// v98: [ ] / [x] = ô tích (x = ô đúng), có thể kèm chữ phía sau
export const BRX = /\s*<br\s*\/?>\s*/gi, brIn = s => String(s).replace(BRX, '\n'), brOut = s => String(s).replace(/\n/g, '<br>');   // v104: <br> = xuống dòng trong ô bảng (MD và ô soạn)

export function parseCell(s) { s = String(s); const ma = /^\s*=\s*(\S.*?)\s*$/.exec(s); if (ma) return { ans: ma[1] }; if (/^\s*(✓|v)\s*$/i.test(s)) return { tick: 1 }; const mk = /^\s*\[\s*([xX✓]?)\s*\]\s*(.*?)\s*$/.exec(s); if (mk) { const o = { tick: 1 }; if (mk[1]) o.ok = true; if (mk[2]) o.text = mk[2]; return o; } const m = s.match(/^\s*\[ảnh:\s*([^\]]*)\]\s*(.*)$/i); if (m) return m[2] ? { img: m[1].trim(), text: brIn(m[2]) } : { img: m[1].trim() }; return brIn(s); }

export function toggleField(t, f, on) {
  const it = its(t), c = t.content;
  if (f === 'list') { if (on) { delete c.list; if (c.listAns) { t.answer = c.listAns; delete c.listAns; } } else { if (it.length) c.listAns = clone(t.answer); c.list = false; } }   // tắt: ẩn danh sách, giữ câu + đáp án để bật lại
  else if (f === 'image') { if (on) t.image = { label: 'ảnh', size: 'medium' }; else { delete t.image; if (t.uploads) delete t.uploads.G1; t.layout.frame = {}; } }
  else if (f === 'img') { if (on) { it.forEach((x, i) => { x.img = x.img || 'ảnh ' + (i + 1); }); c.variant = 'single'; } else { it.forEach(x => { delete x.img; delete x.imgs; delete x.lines; }); delete c.variant; t.layout.cells = null; } }
  else if (f === 'multi') { if (on) { it.forEach(x => { x.imgs = x.imgs || [x.img || 'A', 'B', 'C']; delete x.img; delete x.lines; if (x.text == null) x.text = ''; }); c.variant = 'multi'; } else { it.forEach(x => { x.img = (x.imgs || [])[0] || 'ảnh'; delete x.imgs; }); c.variant = 'single'; } t.layout.cells = null; t.layout.dir = null; t.layout.cols = null; }
  else if (f === 'who') { if (on) it.forEach((x, i) => { x.who = x.who || (i % 2 ? 'B' : 'A'); delete x.opts; }); else it.forEach(x => { delete x.who; }); if (!on && c.lead && c.lead.kind === 'text') delete c.lead; }
  else if (f === 'pair') { setKind(t, on ? 'match' : 'word'); return; }
  else if (f === 'passage') { if (on) c.lead = { kind: 'passage', text: (c.lead && c.lead.text) || '' }; else delete c.lead; }
  else if (f === 'intro') { if (on) c.lead = { kind: 'text', text: '' }; else delete c.lead; }
  else if (f === 'lines') { if (on) it.forEach(x => { x.lines = x.lines || [x.text || '']; delete x.text; }); else it.forEach(x => { if (x.lines) { x.text = x.lines.join(' '); delete x.lines; } }); }
  else if (f === 'bank') { if (on) t.wordBank = { words: [], placement: 'top', style: 'chips', label: 'lower' }; else delete t.wordBank; }
  else if (f === 'key') { it.forEach(x => { if (on) { if (x.key == null) x.key = ''; } else delete x.key; }); }
  normAnswer(t);
}

// Áp công thức cho Task có sẵn: giữ chữ các câu, đổi cấu trúc + đáp án + bố cục về mặc định của công thức
export function applyRecipe(t, r) {
  const mk = clone(r.make), old = its(t).map(x => ({ text: x.text != null ? x.text : x.pair ? ((x.pair.l || {}).text || '') : (x.lines || []).join(' '), r: x.pair && x.pair.r ? x.pair.r.text : '', opts: x.opts, who: x.who }));
  const oldTable = t.content.form === 'table' ? t.content : null, oldLead = t.content.lead || null;
  const c = mk.content;
  if (c.form === 'table') {
    if (oldTable) t.content = oldTable;
    else { t.content = { form: 'table', corner: c.corner || '', cols: c.cols.slice(), rows: old.length ? old.map(o => ({ head: o.text, cells: c.rows[0].cells.map(v => clone(v)) })) : clone(c.rows) }; }
  } else {
    const tpl = c.items[0] || {}, src = oldTable ? oldTable.rows.map(rw => ({ text: typeof rw.head === 'string' ? rw.head : (rw.head && rw.head.text) || '' })) : old;
    const items = (src.length ? src : c.items).map((o, i) => {
      const x = clone(tpl);
      if (x.pair) { x.pair.l = Object.assign(x.pair.l || {}, { text: o.text || '' }); x.pair.r = { text: o.r || '' }; }
      else if (x.lines) x.lines = [o.text || ''];
      else x.text = src.length ? (o.text || '') : x.text;
      if (x.img) x.img = 'ảnh ' + (i + 1);
      if (x.who != null) x.who = o.who || (i % 2 ? 'B' : 'A');
      if (x.opts && o.opts) x.opts = o.opts.slice();
      return x;
    });
    t.content = c.list === false ? { form: 'list', list: false, items: [] } : { form: 'list', items };
    if (c.variant) t.content.variant = c.variant;
    if (c.lead) t.content.lead = Object.assign(clone(c.lead), oldLead && oldLead.kind === c.lead.kind && oldLead.text ? { text: oldLead.text } : {});
    ensureIds(t);
  }
  t.answer = Object.assign({ params: {} }, clone(mk.answer));
  if (mk.image && !t.image) t.image = clone(mk.image);
  t.layout = LAYOUT_DEF(); t.typeId = r.id; t.typeName = r.name;
  normAnswer(t); tidy(t);
}


/* ================= 0d: đưa bài vào bằng dán chữ (một Task hoặc cả đề) ================= */
// Nhận dạng chỉ dùng các ký hiệu có sẵn: ___ chỗ trống, {a|b} chọn trong câu, "Tên:" người nói, A. B. C. lựa chọn, ? câu hỏi.
export const VERB_RE = /^(look|listen|read|write|match|choose|circle|tick|complete|answer|trace|colou?r|fill|underline|draw|number|put|order|find|say|copy|unscramble|label|correct|join|cross|sort|ask|talk|tell|use|make|check|spell|point|sing|play|work)\b/i;

export const HEAD_RE = /^\s*(task|exercise|part|section|activity|bài|phần)\s*[\dIVX]+\s*[.:)\-–]?\s*/i;

export const NUM_RE = /^\s*(\(?\d{1,2}[.)]|\(\d{1,2}\)|[a-h][.)](?=\s))\s*/i;

export const BARE_RE = /^\s*\d{1,2}\s+(?=\S)/;   // số hoạt động không có dấu chấm ("2 Work with…", hay gặp khi copy từ PDF)

export const stripNum = s => s.replace(NUM_RE, '');

export const normGap = s => s.replace(/_{2,}|\.{4,}|…{2,}|(?:_\s){2,}_/g, '___');

// Dòng đầu mục / dòng lệnh: một câu trong dòng bắt đầu bằng động từ lệnh (Look, Listen, Read…), hoặc "True or False"
export const HEADX = /^(true or false|yes or no|odd one out)\b/i;

export const isHead = s => { const x = s.replace(HEAD_RE, '').trim(); if (!x || NUM_RE.test(s) || x.includes('___') || /\{[^}]*\|/.test(x) || x.includes('\t') || x.length > 160) return false; return x.split(/(?<=[.?!:])\s+/).some(p => VERB_RE.test(p) || HEADX.test(p)); };

export const isInstr = s => { const x = s.replace(HEAD_RE, '').replace(NUM_RE, '').trim(); return !!x && VERB_RE.test(x) && !x.includes('___') && !/\{[^}]*\|/.test(x) && !/\?\s*$/.test(x) && x.length <= 140; };

// "(on / off)" hoặc "on / off" trong câu → {on|off}
export const inlineOpts = s => s.replace(/\(([^()]{1,40}?(?:\s\/\s[^()]{1,40}?)+)\)/g, (m, g) => `{${g.split(/\s\/\s/).map(x => x.trim()).join('|')}}`);

export function splitOptsLine(s) { // "What is it? A. cat B. dog C. pig" → [câu, [cat, dog, pig]]
  const m = [...s.matchAll(/(?:^|\s)\(?([A-Da-d])[.)]\s+(?!_{3,})/g)];   // v101: "(a) ___" là nhãn chỗ trống, không phải lựa chọn
  if (m.length >= 2 && m.map(x => x[1].toUpperCase()).join('').startsWith('AB')) {
    const head = s.slice(0, m[0].index).trim(), opts = m.map((x, i) => s.slice(x.index + x[0].length, i + 1 < m.length ? m[i + 1].index : undefined).trim());
    return [head, opts];
  }
  return null;
}

export function parseTask(raw, force, pre) {
  const notes = [];
  let L = String(raw).replace(/\r/g, '').split('\n').map(x => x.replace(/[ \u00a0]+$/, ''));
  while (L.length && !L[0].trim()) L.shift(); while (L.length && !L[L.length - 1].trim()) L.pop();
  let title = '', instruction = '', audio = '', bank = null, passage = '', table = null;
  // tiêu đề, hướng dẫn, track
  const takeHead = () => { while (L.length && !L[0].trim()) L.shift(); };
  takeHead();
  if (pre) { title = pre.title || ''; instruction = pre.instruction || ''; audio = pre.audio || ''; }
  else {
  if (L.length && BARE_RE.test(L[0]) && isHead(L[0].replace(BARE_RE, ''))) L[0] = L[0].replace(BARE_RE, '');
  if (L.length && HEAD_RE.test(L[0])) { const rest = L[0].replace(HEAD_RE, '').trim(); if (rest) L[0] = rest; else L.shift(); takeHead(); }
  // Có dòng đánh số: các dòng không đánh số ở đầu (ngắn, không phải bảng/khung từ/bài đọc) là tiêu đề + hướng dẫn
  const firstNum = L.findIndex(x => NUM_RE.test(x));
  const headOk = x => x.trim() && !NUM_RE.test(x) && x.trim().length <= 160 && !x.includes('___') && !x.includes('\t') && !/\s\|\s/.test(x) && !/^\s*(words?|word bank|box)\s*:/i.test(x) && !/^\s*[\[(].*[\])]\s*$/.test(x) && !/^([A-Z][\p{L}.' -]{0,18}):\s+/u.test(x);
  let hl = [];
  if (firstNum > 0) { for (let i = 0; i < firstNum && hl.length < 3; i++) { if (!L[i].trim()) continue; if (!headOk(L[i])) break; hl.push(i); } }
  if (hl.length) { const hs = hl.map(i => L[i].trim()); L = L.filter((_, i) => !hl.includes(i)); title = hs[0]; if (hs.length > 1) instruction = hs.slice(1).join(' '); takeHead(); }
  else if (L.length && (isHead(L[0]) || (L.length > 1 && /[.!:?]$/.test(L[0].trim()) && headOk(L[0]) && L[0].length < 100))) { title = stripNum(L.shift().trim()); takeHead(); }
  const tr = t => { const m = t.match(/\(?\s*(track\s*\d+[a-z]?|cd\s*\d+[.:]\d+)\s*\)?/i); return m ? m[1] : ''; };
  if (title && tr(title)) { audio = tr(title); title = title.replace(/\(?\s*(track\s*\d+[a-z]?|cd\s*\d+[.:]\d+)\s*\)?/i, '').trim(); }
  if (L.length && tr(L[0]) && L[0].replace(/\(?\s*(track\s*\d+[a-z]?|cd\s*\d+[.:]\d+)\s*\)?/i, '').trim().length < 3) { audio = tr(L.shift()); takeHead(); }
  if (!instruction && L.length && isInstr(L[0]) && !NUM_RE.test(L[0])) { instruction = L.shift().trim(); takeHead(); }
  }
  let body = L.filter(x => x.trim()), image = null;
  const imI = body.findIndex(x => /^\s*\[ảnh:\s*[^\]]+\]\s*$/i.test(x)); if (imI >= 0) { image = body.splice(imI, 1)[0].replace(/^\s*\[ảnh:\s*|\]\s*$/gi, '').trim(); }
  // khung từ
  const bi = body.findIndex(x => /^\s*(words?|word bank|box|từ)\s*:/i.test(x) || (/^\s*[\[(].*[\])]\s*$/.test(x) && /,|\s\/\s|\|/.test(x) && !x.includes('___') && !/^\s*\[ảnh:/i.test(x)));
  if (bi >= 0) { const s = body[bi].replace(/^\s*(words?|word bank|box|từ)\s*:/i, '').replace(/^\s*[\[(]|[\])]\s*$/g, ''); bank = s.split(/,|\s\/\s|\||\s{2,}/).map(x => x.trim()).filter(Boolean); body.splice(bi, 1); }
  // bảng: các dòng có Tab hoặc " | " cùng số cột
  const cellsOf = x => x.includes('\t') ? x.split('\t') : x.split(/\s\|\s|\|/);
  const tl = body.filter(x => x.includes('\t') || /\s\|\s/.test(x));
  if (tl.length >= 2 && tl.length >= body.length * .6) {
    const rows = tl.map(x => cellsOf(x).map(y => y.trim())), n = Math.max(...rows.map(r => r.length));
    const hd = rows.shift(); while (hd.length < n) hd.push('');
    table = { form: 'table', corner: brIn(hd[0] || ''), cols: hd.slice(1).map(brIn), rows: rows.map(r => { while (r.length < n) r.push(''); return { head: /^\s*\[ảnh:/i.test(r[0]) ? parseCell(r[0]) : brIn(r[0]), cells: r.slice(1).map(v => parseCell(/^\s*(\[\s*\]|☐|□)\s*$/.test(v) ? '✓' : v)) }; }) };
  }
  // bài đọc: đoạn dài không đánh số, đứng trước các câu hỏi
  if (pre && pre.passage) passage = pre.passage;
  else if (!table) { const pi = body.findIndex(x => x.trim().length > 150 && !NUM_RE.test(x) && !x.includes('___')); if (pi >= 0 && pi < body.length - 1) { const ps = []; while (body.length > pi && body[pi].trim().length > 60 && !NUM_RE.test(body[pi])) ps.push(body.splice(pi, 1)[0].trim()); passage = ps.join(' '); } }
  // câu
  const items = []; const instr = (title + ' ' + instruction).toLowerCase();
  if (!table) body.forEach(x0 => {
    let x = normGap(inlineOpts(x0.trim()));
    const opt = /^\s*\(?([A-Da-d])[.)]\s+/.exec(x);
    if (opt && items.length && !NUM_RE.test(x0.replace(/^\s*\(?[A-Da-d][.)]/, '')) && (items[items.length - 1].opts || opt[1].toUpperCase() === 'A')) {
      const so = splitOptsLine(x); const last = items[items.length - 1]; last.opts = (last.opts || []).concat(so ? so[1] : [x.replace(/^\s*\(?[A-Da-d][.)]\s+/, '')]); return;
    }
    x = stripNum(x);
    let im = null; const mi = /^\[ảnh:\s*([^\]]+)\]\s*/i.exec(x); if (mi) { im = mi[1].trim(); x = x.slice(mi[0].length); }
    const push = o => { if (im) o.img = im; items.push(o); };
    const so = splitOptsLine(x); if (so && (so[0] || (pre && so[1].length >= 2))) { push({ text: so[0], opts: so[1] }); return; }   // MD: câu chỉ có lựa chọn (không có thân câu) vẫn là một câu
    if (items.length && !NUM_RE.test(x0.trim()) && /^[^/]{1,25}(\s\/\s[^/]{1,25}){1,4}$/.test(x) && !x.includes('___') && !items[items.length - 1].opts && /\?$|___/.test(items[items.length - 1].text || '')) { items[items.length - 1].opts = x.split(/\s\/\s/).map(y => y.trim()); return; }
    push({ text: x });
  });
  // người nói
  const whoRe = /^([A-Z][\p{L}.' -]{0,18}):\s+(.*)$/u;
  let intro = '';
  const whoLike = items.length >= 2 && items.filter(x => whoRe.test(x.text)).length >= Math.max(2, (items.length - 1) * .6);
  // MD: hội thoại chỉ nhận qua khối "Hội thoại:" (tránh nhầm ô điền "Place of the party: ___" là lời người nói)
  if (whoLike && !pre) { while (items.length && !whoRe.test(items[0].text)) intro += (intro ? ' ' : '') + items.shift().text; items.forEach(x => { const m = whoRe.exec(x.text); if (m) { x.who = m[1]; x.text = m[2]; } else x.who = ''; }); }
  // cặp nối: "trái - phải" / Tab / 2+ dấu cách
  const pairRe = /^(.+?)\s+(?:[-–—→]|\.{3,}|\s{2,})\s*(.+)$/;
  const wantMatch = (pre && pre.match) || /\bmatch|\bjoin|\bnối/.test(instr), imgPair = x => x.img && /^[-–—→]\s*\S/.test(x.text || '');   // "[ảnh: apple] - pear": vế trái là ảnh
  const sideR = x => !x.img && /^[-–—→]\s+\S/.test(x.text || '');   // v105: "6. - F. very cold" = vế phải thừa (không có vế trái)
  if (wantMatch && items.length >= 2 && items.filter(x => pairRe.test(x.text) || imgPair(x) || sideR(x)).length >= items.length * .6) items.forEach(x => {
    if (sideR(x)) { x.pair = { r: { text: x.text.replace(/^[-–—→]\s*/, '').trim() } }; delete x.text; return; }
    if (imgPair(x)) { x.pair = { l: { img: x.img }, r: { text: x.text.replace(/^[-–—→]\s*/, '').trim() } }; delete x.img; delete x.text; return; } const m = pairRe.exec(x.text); x.pair = m ? { l: { text: m[1].trim() }, r: { text: m[2].trim() } } : { l: { text: x.text }, r: null }; delete x.text; });
  // Đúng/Sai: "... T / F", "(T/F)", "True False"
  const tfRe = /\s*(\(?\s*T\s*\/\s*F\s*\)?|\(?\s*true\s*\/?\s*false\s*\)?|\(?\s*yes\s*\/\s*no\s*\)?)\s*$/i;
  const isTF = /true or false|\bt or f\b|\btrue\b.*\bfalse\b|yes or no|đúng.*sai/.test(instr) || (items.length && items.filter(x => tfRe.test(x.text || '')).length >= items.length * .6);
  if (isTF) items.forEach(x => { if (x.text) x.text = x.text.replace(tfRe, ''); });
  // đoán CẤU HÌNH (khung + thành phần + loại đáp án) từ ký hiệu trong chữ; không chọn mẫu. Mẫu chỉ áp khi người dùng chọn (force).
  const has = re => items.some(x => re.test(x.text || ''));
  const gap = has(/___/), mark = has(/\{[^{}|]+(\|[^{}|]+)+\}/), opts = items.some(x => x.opts && x.opts.length >= 2);
  let conf = 'cao', kind, multi = false, perImg = false, listOff = false;
  if (table) kind = 'none';
  else if (!items.length && !passage) { kind = 'none'; listOff = true; if (!image && !/colou?r|draw|tô màu|vẽ/.test(instr)) { conf = 'thấp'; notes.push('Không thấy câu nào: tạo Task chỉ có ảnh (danh sách câu tắt).'); } }
  else if (items.some(x => x.pair)) kind = 'match';
  else if (items.some(x => x.who != null)) kind = 'word';
  else if (/\btick\b/.test(instr) && opts && !(pre && pre.box)) { kind = 'tick'; multi = true; }
  else if (isTF) kind = 'tf';
  else if (mark || opts) kind = 'choice';
  else if (/\btrace\b|\btô\b/.test(instr)) kind = 'trace';
  else if (gap) kind = 'word';
  else if (passage) kind = 'sentence';
  else if (/look and write|look,? read and write|write the word/.test(instr)) { kind = 'word'; perImg = true; conf = 'vừa'; }
  else if (items.length && items.filter(x => /\?\s*$/.test(x.text || '')).length >= items.length * .5) kind = 'sentence';
  else if (/answer/.test(instr)) { kind = 'sentence'; conf = 'vừa'; }
  else if (/\btick\b|listen and tick/.test(instr)) { kind = 'tick'; multi = true; conf = 'thấp'; notes.push('Cần ảnh lựa chọn: dán chữ không đủ để biết ảnh.'); }
  else { kind = 'sentence'; conf = 'thấp'; notes.push('Không thấy ký hiệu rõ ràng; đang đoán là câu hỏi, học sinh viết câu trả lời.'); }
  // dựng Task theo cấu hình đoán, chữ lấy từ bài dán
  const t = { id: 't1', typeId: 'custom', typeName: '', title, instruction, content: null, answer: { kind: 'none', attach: 'item', layout: null, params: {} }, layout: LAYOUT_DEF(), spacing: { preset: null, overrides: {} } };
  if (audio) t.audio = audio;
  if (table) t.content = table;
  else {
    t.content = { form: 'list', items: items.map((x, i) => {
      const y = {};
      if (x.pair) y.pair = x.pair; else y.text = x.text || '';
      if (x.who != null) y.who = x.who;
      if (multi) y.imgs = x.opts && x.opts.length ? x.opts.slice() : ['a', 'b', 'c'];
      else if (x.opts && kind === 'choice') y.opts = x.opts.slice();
      if (x.img) y.img = x.img;
      else if (perImg && !multi) { y.img = x.text || 'ảnh ' + (i + 1); y.len = Math.max(3, (x.text || '').length) || 4; delete y.text; }
      return y; }) };
    if (multi) t.content.variant = 'multi'; else if (t.content.items.some(y => y.img)) t.content.variant = 'single';
    if (listOff) t.content.list = false;
    if (passage) t.content.lead = { kind: 'passage', text: passage };
    else if (intro && t.content.items.some(y => y.who != null)) t.content.lead = { kind: 'text', text: intro };
    ensureIds(t);
  }
  if (image) t.image = { label: image, size: listOff ? 'large' : 'medium' };
  else if (listOff) t.image = { label: 'tranh', size: 'large' };
  if (bank) { const dl = ck(t) === 'dialogue'; t.wordBank = { words: bank, placement: dl ? 'right' : 'top', style: dl ? 'list' : 'chips', label: 'lower' }; }
  setKind(t, kind);
  const r = force ? recipeById(force) : null;
  if (r) { applyRecipe(t, r); conf = 'người dùng chọn'; if (title) t.title = title; if (instruction) t.instruction = instruction; }
  normAnswer(t); tidy(t);
  const m = recipeMatch(t);
  if (!r) { t.typeId = m.exact ? m.r.id : 'custom'; t.typeName = descOf(t); if (!t.title && m.exact) t.title = m.r.make.title || ''; }
  return { t, rid: r ? r.id : '', conf, notes };
}

// Phiếu mới từ lô đã đọc: JSON cả phiếu giữ cài đặt cấp phiếu; còn lại dùng mặc định (MD có thể ghi tên, tuổi…)
export function impSheetObj(J) {
  if (!J) return { title: 'Phiếu mới', tasks: [] };
  const base0 = J.kind === 'sheet' && J.sheet ? Object.assign({}, J.sheet) : Object.assign({ title: 'Phiếu mới' }, clone(J.meta || {}));
  base0.tasks = J.tasks.filter(r => r.t).map(r => clone(r.t)); return base0;
}

// Chữ trông như JSON (bắt đầu bằng { hoặc [): không bao giờ xử lý như chữ thô
export const looksJson = s => /^\s*[\[{]/.test(String(s || ''));

// Đọc JSON: phiếu {tasks:[…]}, mảng Task, hoặc một Task. Trả { src:'json', kind:'sheet'|'tasks', sheet, sheetNotes, tasks:[{t, notes, err}] } hoặc { err }.
export function readJson(raw) {
  const s = String(raw || '').trim();
  if (s.length > IMP_MAX_CH) return { src: 'json', err: `Dữ liệu quá lớn (${(s.length / 1e6).toFixed(1)} MB).` };
  let o; try { o = JSON.parse(s); } catch (e) { return { src: 'json', err: `JSON hỏng: ${e.message}.` }; }
  let kind, list, sheet = null;
  if (Array.isArray(o)) { kind = 'tasks'; list = o; }
  else if (isObj(o) && Array.isArray(o.tasks)) { kind = ['schema', 'title', 'age', 'page', 'spacing', 'flow'].some(k => k in o) ? 'sheet' : 'tasks'; list = o.tasks; sheet = o; }   // chỉ có tasks = danh sách Task, không phải cả phiếu
  else if (isObj(o) && (o.content != null || o.title != null)) { kind = 'tasks'; list = [o]; }
  else return { src: 'json', err: isObj(o) ? 'JSON thiếu danh sách "tasks".' : 'JSON không phải phiếu hay Task.' };
  if (list.length > IMP_MAX) return { src: 'json', err: `Có ${list.length} Task, nhiều hơn giới hạn ${IMP_MAX}. Hãy tách thành nhiều file.` };
  if (!list.length && kind !== 'sheet') return { src: 'json', err: 'JSON không có Task nào.' };
  const sheetNotes = [];
  if (sheet) { const probe = Object.assign({}, sheet, { tasks: [] }); try { fillSheet(probe, sheetNotes); } catch (_) {} }
  const tasks = list.map((t0, i) => {
    const notes = []; let t = null, err = '';
    try { t = fillTask(t0, notes); renderTask(t, null); } catch (e) { t = null; err = `Task ${i + 1}: ${e.message}`; }
    return { t, notes, err, conf: 'json' };
  });
  return { src: 'json', kind, sheet, sheetNotes, tasks };
}

export const MD_FIELD = /^\s*(hướng dẫn|instruction|track|audio|mẫu|trả lời|answer type|dòng viết|khung từ ảnh|khung từ|đáp án chỗ trống|gap answers|words?|word bank|ảnh chung|ảnh|image|lời dẫn|intro|ghi chú|lưu ý|note|dạng|bố cục|vị trí khung từ|dòng kẻ|thứ tự|khối chữ trên|khối chữ dưới|khối chữ|khối ảnh trên|khối ảnh dưới|khối ảnh|điểm trên ảnh|chữ câu hỏi|số câu|căn lề chữ|xáo vế phải|viền hai vế|tiêu đề cột|chỗ nối|kích thước ảnh|ảnh vừa ô|phân biệt viết tắt)\s*:\s*(.*)$/i;

export const MD_FKEY = { 'hướng dẫn': 'instruction', instruction: 'instruction', track: 'audio', audio: 'audio', 'mẫu': 'recipe', 'trả lời': 'kind', 'answer type': 'kind', 'dòng viết': 'lines', 'khung từ': 'bank', 'đáp án chỗ trống': 'gapkeys', 'gap answers': 'gapkeys', word: 'bank', words: 'bank', 'word bank': 'bank', 'ảnh chung': 'image', 'ảnh': 'image', image: 'image', 'lời dẫn': 'intro', intro: 'intro', 'ghi chú': 'note', 'lưu ý': 'note', note: 'note',
  'dạng': 'form', 'bố cục': 'tlay', 'khung từ ảnh': 'ibank', 'vị trí khung từ': 'bankpos', 'dòng kẻ': 'ruling', 'thứ tự': 'order', 'điểm trên ảnh': 'marks',
  'khối chữ': 'gtT', 'khối chữ dưới': 'gtT', 'khối chữ trên': 'gtTtop', 'khối ảnh': 'gtI', 'khối ảnh dưới': 'gtI', 'khối ảnh trên': 'gtItop', 'chữ câu hỏi': 'qbold', 'số câu': 'nlab', 'căn lề chữ': 'ta', 'xáo vế phải': 'shuf', 'viền hai vế': 'mbd', 'tiêu đề cột': 'heads', 'chỗ nối': 'mid', 'kích thước ảnh': 'imgPct', 'ảnh vừa ô': 'imgFit', 'phân biệt viết tắt': 'strictc' };   // v93: MD mang chữ câu hỏi đậm, xáo vế phải bài nối

// v81: "Dạng:" = dạng câu hỏi (Q1–Q12), ghi chi tiết trong ngoặc; "Bố cục:" = bố cục Task (4 kiểu)
export const MD_FORM = { 'điền từ': 'Q1', 'điền chỗ trống': 'Q1', 'viết từ': 'Q1', 'viết câu': 'Q2', 'trả lời câu hỏi': 'Q2', 'chọn a/b/c': 'Q3', 'khoanh a/b/c': 'Q3', 'chọn đáp án': 'Q3', 'chọn trong câu': 'Q4', 'gạch chân': 'Q4', 'khoanh trong câu': 'Q4', 'tìm lỗi sai': 'Q4', 'đúng/sai': 'Q5', 'đúng sai': 'Q5', 'nhìn ảnh viết': 'Q6', 'chọn ảnh': 'Q7', 'tick ảnh': 'Q7', 'nối': 'Q8', 'tô chữ': 'Q9', 'bảng': 'Q10', 'lưới': 'Q11', 'ô chữ': 'Q11', 'viết tự do': 'Q12', 'viết đoạn': 'Q12' };

export const MD_TLAY = { 'xếp dọc': 'T1', 'ảnh trái': 'T2', 'ảnh phải': 'T3', 'ảnh trong bài đọc': 'T4', 'bao chữ': 'T4' };

export const MD_EX = '\u2063', MD_GT = '\u2064';   // dấu ẩn đánh dấu câu ví dụ "0." và dòng chữ "> " khi qua bộ đoán

export function mdForm(t, val, notes, imgMark) {
  const m = /^\s*([^()]+?)\s*(?:\(([^)]*)\))?\s*$/.exec(val || ''); if (!m) { notes.push(`không hiểu "Dạng: ${val}"`); return false; }
  const nm = m[1].toLowerCase().replace(/\s*\/\s*/g, '/').replace(/\s+/g, ' ').trim();
  let opt = (m[2] || '').trim();
  const qc = /^q\s*(\d{1,2})$/i.exec(nm);
  const q = qc ? (QN['Q' + +qc[1]] ? 'Q' + +qc[1] : null) : MD_FORM[nm];
  if (!q) { notes.push(`không hiểu "Dạng: ${val}"; giữ dạng ${QN[qOf(t)] || 'đoán'}`); return false; }
  const why = qReasons(t)[q]; if (why) { notes.push(`"Dạng: ${val}" không hợp với nội dung (${why}); giữ dạng ${QN[qOf(t)] || 'đoán'}`); return false; }
  // câu có ảnh riêng (nhìn ảnh viết / chọn ảnh): "điền từ", "viết câu", "chọn…" là cách trả lời của dạng đó, không bỏ ảnh
  if (ck(t) === 'items' && imgMark && ['Q1', 'Q2', 'Q3', 'Q4'].includes(q)) { const k = q === 'Q1' ? 'word' : q === 'Q2' ? 'sentence' : t.content.variant === 'multi' ? 'tick' : 'choice'; if (kindsOk(t).includes(k) && t.answer.kind !== k) setKind(t, k); if (k === 'choice' && hasMarkup(t)) t.answer.attach = 'inline'; normAnswer(t); return true; }
  if (qOf(t) !== q || (q === 'Q4' && t.answer.attach !== 'inline')) setQ(t, q);
  const rowRe = /(?:^|[,;]\s*)(?:cùng hàng|cùng dòng)\s*(?=$|[,;])/i, tfRow = q === 'Q5' && rowRe.test(opt);   // v100: "Dạng: đúng/sai (cùng hàng)" = T F cuối hàng, bên phải câu
  opt = tfRow ? opt.replace(rowRe, '').replace(/^[,;\s]+|[,;\s]+$/g, '') : opt;
  const o = opt.toLowerCase(), p = () => t.answer.params;
  if (q === 'Q5' && /tick/.test(o)) { if (t.answer.kind !== 'tick') setKind(t, 'tick'); }
  else if (q === 'Q5' && opt) { const L = opt.split('/').map(x => x.trim()).filter(Boolean); if (L.length >= 2 && L.length <= 3) { if (t.answer.kind !== 'tf') setKind(t, 'tf'); if (L.join('|') !== 'T|F') p().labs = L; } else notes.push(`nhãn Đúng/Sai "${opt}" cần 2–3 nhãn cách nhau bằng /`); }
  if (q === 'Q5' && tfRow) { if (t.answer.kind === 'tf') p().row = true; else notes.push('“cùng hàng” chỉ dùng cho khoanh Đúng/Sai (không dùng với ô tick)'); }
  if (q === 'Q4' && /nhãn|a\s*-\s*d|lỗi/.test(o + ' ' + nm)) p().ulab = true;
  if (q === 'Q12' && /khung|vẽ/.test(o)) p().frame = 'box';
  if (['Q1', 'Q6'].includes(q) && /ô chữ cái/.test(o)) { if (t.answer.kind !== 'word') setKind(t, 'word'); t.answer.layout = 'A3'; t.answer.attach = 'item'; }
  if (['Q2', 'Q6'].includes(q) && /dòng kẻ|viết câu/.test(o) && t.answer.kind !== 'sentence') setKind(t, 'sentence');
  if (q === 'Q3' && /ô tick|☐/.test(o)) p().lab = 'box'; else if (q === 'Q3' && /khoanh|vòng|ⓐ/.test(o)) p().lab = 'circle';
  if (q === 'Q3') { const mv = /căn\s*(giữa|dưới|trên)/i.exec(o); if (mv) { const v = { 'giữa': 'center', 'dưới': 'bottom', 'trên': 'top' }[mv[1].toLowerCase()]; if (v !== 'top') p().qv = v; } }   // v106
  if (/bốn ô li|4 ô li/.test(o) && ['A1', 'A8'].includes(t.answer.layout)) p().ruling = '4';
  normAnswer(t); return true;
}

export const MD_SECT = /^\s*(bài đọc|passage|hội thoại|dialogue|ô chữ giải đố|crossword|ô chữ|word ?search)\s*:\s*$/i;

// Loại đáp án viết bằng chữ → [loại, cách gắn ưu tiên]
export const MD_KIND = { 'viết từ': ['word', 'item'], 'điền chỗ trống': ['word', 'inline'], 'điền từ': ['word', 'inline'], 'viết câu': ['sentence'], 'khoanh': ['choice'], 'khoanh a/b/c': ['choice', 'item'], 'chọn a/b/c': ['choice', 'item'], 'chọn trong câu': ['choice', 'inline'], 'gạch chân': ['choice', 'inline'], 'tick': ['tick'], 'đúng/sai': ['tf'], 'đúng sai': ['tf'], 'nối': ['match'], 'tô chữ': ['trace'], 'không': ['none'], 'không có': ['none'] };

export function readMd(raw) {
  const L = String(raw || '').replace(/\r/g, '').split('\n'), meta = {}, blocks = [], keys = {}, notes = [];
  let cur = null, inAns = false, ansFor = null, grp = 0;
  L.forEach(line => {
    const t = line.trim(), h = /^##(?!#)\s*(.*)$/.exec(t);
    // "### Phần: …" trong một Task: phần tiếp của Task đó (nối vào Task trên), có hướng dẫn / kiểu đáp án riêng
    const pm = cur && !inAns ? /^###\s*(?:phần|part)\b\s*\d*\s*[:.)\-–]?\s*(.*)$/i.exec(t) : null;
    if (pm) { cur = { title: pm[1].trim(), lines: [], part: true, grp }; blocks.push(cur); return; }
    if (h) {
      const x = h[1].trim();
      if (/^task\b/i.test(x)) { cur = { title: x.replace(/^task\s*\d*\s*[:.)\-–]?\s*/i, '').trim(), lines: [], grp: ++grp }; blocks.push(cur); inAns = false; return; }
      if (/^(đáp án|answers?|answer key)\b/i.test(x)) { cur = null; inAns = true; ansFor = null; return; }
    }
    if (inAns) {
      let m;
      if ((m = /^###\s*task\s*(\d+)/i.exec(t))) { ansFor = +m[1]; keys[ansFor] = keys[ansFor] || []; return; }
      if ((m = /^task\s*(\d+)\s*[:.]\s*(.+)$/i.exec(t))) { const a = m[2].split(/\s*;\s*/), k = keys[+m[1]] = []; a.forEach(x => { if (/^\(?0[.)]\s*/.test(x)) k.ex = x.replace(/^\(?0[.)]\s*/, '').trim(); else k.push(stripNum(x).trim()); }); ansFor = null; return; }
      if (ansFor && (m = /^(chỗ trống|gaps?)\s*:\s*(.*)$/i.exec(t))) { keys[ansFor].gap = m[2].split(/\s*[,;|]\s*/).map(x => x.trim()).filter(Boolean); return; }
      if (ansFor && t) { const n = /^\s*\(?(\d{1,2})[.)]\s*/.exec(t); const v = t.replace(/^\s*\(?\d{1,2}[.)]\s*/, '').trim(); if (n && +n[1] === 0) keys[ansFor].ex = v; else if (n) keys[ansFor][+n[1] - 1] = v; else keys[ansFor].push(v); }
      return;
    }
    if (!cur) {     // trước Task đầu: tên phiếu và vài cài đặt cấp phiếu
      let m;
      if ((m = /^#(?!#)\s*(.+)$/.exec(t))) meta.title = m[1].trim();
      else if ((m = /^(tuổi|độ tuổi|age)\s*:\s*(.+)$/i.exec(t))) { const a = m[2].replace(/[–—]/g, '-').replace(/\s/g, ''); if (AGE[a]) meta.age = a; else notes.push(`độ tuổi "${m[2]}" không hiểu`); }
      else if ((m = /^(xếp trang|flow)\s*:\s*(.+)$/i.exec(t))) meta.flow = /tách|page/i.test(m[2]) ? 'page' : 'cont';
      else if ((m = /^(khoảng cách|spacing)\s*:\s*(.+)$/i.exec(t))) { const k = { 'gọn': 'compact', 'vừa': 'normal', 'thoáng': 'airy' }[m[2].trim().toLowerCase()]; if (k) meta.spacing = { preset: k, overrides: {} }; }
      return;
    }
    cur.lines.push(line);
  });
  // v80: dòng chữ không đánh số, đứng sau một dòng trống, ngay trước câu "1." (số câu bắt đầu lại) = hướng dẫn của một PHẦN mới (như "### Phần:")
  for (let bi = 0; bi < blocks.length; bi++) {
    const b = blocks[bi]; if (b.lines.some(l => MD_SECT.test(l.trim()) || /^\s*(bài đọc|passage|hội thoại|dialogue)\s*:/i.test(l))) continue;
    const nz = b.lines.map((l, i) => [l, i]).filter(x => x[0].trim());
    for (let k = 1; k < nz.length - 1; k++) {
      const [l, i] = nz[k], t = l.trim();
      if (/^\s/.test(l) || /^>/.test(t) || NUM_RE.test(t) || MD_FIELD.test(t) || OPT_LINE.test(t) || BOX.test(t) || /\|/.test(t) || t.includes('___')) continue;
      if (b.lines[i - 1] === undefined || b.lines[i - 1].trim()) continue;                // phải có dòng trống phía trên
      if (!/^\(?1[.)]\s/.test(nz[k + 1][0].trim()) || !nz.slice(0, k).some(x => NUM_RE.test(x[0].trim()))) continue;
      const kind = b.lines.find(x => /^\s*(trả lời|answer type|dòng viết)\s*:/i.test(x));
      const nb = { title: '', part: true, grp: b.grp, auto: true, notes: [`dòng “${t.length > 50 ? t.slice(0, 50) + '…' : t}” không có số, đứng trước câu 1 mới: tách thành phần riêng của Task và dùng làm hướng dẫn (nếu không phải, sửa lại trong MD)`], lines: ['Hướng dẫn: ' + t, ...(kind ? [kind] : []), ...b.lines.slice(nz[k + 1][1])] };
      b.lines = b.lines.slice(0, i); blocks.splice(bi + 1, 0, nb); break;
    }
  }
  if (!blocks.length) return { src: 'md', err: 'MD không có dòng "## Task: …" nào.' };
  if (blocks.length > IMP_MAX) return { src: 'md', err: `Có ${blocks.length} Task, nhiều hơn giới hạn ${IMP_MAX}. Hãy tách thành nhiều file.` };
  const size = {}; blocks.forEach(b => size[b.grp] = (size[b.grp] || 0) + 1);
  const seen = {};
  const tasks = blocks.map((b, i) => {
    const k = seen[b.grp] = (seen[b.grp] || 0) + 1, no = b.part ? `${b.grp}${String.fromCharCode(96 + k)}` : size[b.grp] > 1 ? `${b.grp}a` : String(b.grp);
    try {
      const r = mdTask(b, size[b.grp] === 1 ? keys[b.grp] : undefined); if (b.part) r.t.layout.break = 'join';
      renderTask(r.t, null); return { t: r.t, notes: r.notes, conf: r.conf, err: '', joined: !!b.part, no, grp: b.grp };
    } catch (e) { return { t: null, notes: [], err: `Task ${no}: ${e.message}`, joined: !!b.part, no, grp: b.grp }; }
  });
  // Task nhiều phần: đáp án "### Task n" chạy liền qua các phần, theo thứ tự câu
  Object.keys(keys).forEach(n => {
    const g = tasks.filter(r => r.grp === +n);
    if (!g.length) { notes.push(`đáp án của Task ${n} không có Task tương ứng`); return; }
    if (g.length === 1) return;
    const all = g.filter(r => r.t).flatMap(r => its(r.t).filter(keyable)); all.forEach((x, i) => { if (keys[n][i] != null && keys[n][i] !== '') x.key = keys[n][i]; });
    if (keys[n].length > all.length) g[0].notes.push(`đáp án có ${keys[n].length} dòng, Task ${n} (cả các phần) có ${all.length} câu`);
  });
  const sheetNotes = [];
  if (!meta.age) sheetNotes.push('độ tuổi'); if (!meta.flow) sheetNotes.push('xếp trang'); if (!meta.spacing) sheetNotes.push('khoảng cách');
  return { src: 'md', kind: Object.keys(meta).length ? 'sheet' : 'tasks', sheet: null, meta, sheetNotes, mdNotes: notes, tasks };
}

// v67: dòng trong MD mà app bỏ qua hoặc chuyển chỗ (giàn giáo của bản gốc: app tự vẽ chỗ trả lời)
export const MD_SKIP = /^\s*(nội dung|content|câu hỏi|questions?|bài tập|exercise)\s*:\s*$/i;            // tiêu đề phần, không phải câu

export const MD_LABEL = /^\s*[\p{L}][\p{L}\d ()/'’-]{1,30}:\s*$/u;                                       // dòng chỉ có nhãn "Xxx:"

export const MD_SCAF = /^\s*(my answer|your answer|answer|đáp án( của em)?)\s*:?\s*[A-Da-d](\s*[\/,]\s*[A-Da-d])+\s*\.?\s*$/i;   // "My answer: A / B / C"

export const MD_RULE = /^\s*[_.…\-–—\s]{6,}\s*$/;                                                         // dòng chỉ có gạch / chấm (dòng kẻ viết)

export const BOX = /\[\s*\]|☐|□/;

export const OPT_LINE = /^\(?[A-Da-d][.)]\s+(?!_{3,})\S/;   // v101: "a. ___ nghĩa" (nhãn chữ + chỗ trống) không phải lựa chọn

export const optStr = os => os.map((o, i) => `${'ABCDEFGH'[i]}. ${o}`).join(' ');

// Dòng có ô tick: "☐ a cake ☐ a football" hoặc "1. [ ] a cake" → [thân câu, [lựa chọn]]
export function boxSplit(line) {
  const s = stripNum(line.trim()); if (!BOX.test(s)) return null;
  const parts = s.split(/\s*(?:\[\s*\]|☐|□)\s*/), stem = parts.shift().trim(), opts = parts.map(x => x.trim()).filter(Boolean);
  return opts.length ? [stem, opts] : null;
}

export function mdTask(b, keys) {
  const notes = (b.notes || []).slice(), F = {}, body = [], sec = { passage: [], dialogue: [], grid: [], cross: [] }, gts = []; let mode = null, scaf = 0, box = false, gx = null;
  const B = (s, o) => ({ s, box: o || null });          // một dòng thân Task; box = các lựa chọn ô tick của câu này
  const last = () => body[body.length - 1];
  b.lines.forEach(line => {
    const t = line.trim();
    if (gx) { if (!t) { gx.lines.push(''); return; } if (/^(\s{2,}|\t)/.test(line)) { gx.lines.push(t); return; } gx = null; }      // khối chữ: các dòng thụt lề bên dưới
    if (!t) { if (mode === 'passage') { if (sec.passage.length && sec.passage[sec.passage.length - 1] !== '') sec.passage.push(''); } else mode = null; return; }
    const si = !mode && /^\s*(bài đọc|passage|hội thoại|dialogue)\s*:\s*(\S.*)$/i.exec(t);   // v124: "Bài đọc: <chữ>" cùng dòng (AI hay viết): chữ là dòng đầu của khối, không thành câu hỏi
    if (si) { const dl = /hội thoại|dialogue/i.test(si[1]); if (!dl || /^[^:]{1,40}:\s*\S/.test(si[2])) { mode = dl ? 'dialogue' : 'passage'; sec[mode].push(si[2].trim()); notes.push(`“${si[1]}:” có chữ ngay sau dấu hai chấm: dùng làm dòng đầu của ${dl ? 'hội thoại' : 'bài đọc'} (nên viết xuống dòng dưới)`); return; } }
    const s = MD_SECT.exec(t); if (s) { mode = /bài đọc|passage/i.test(s[1]) ? 'passage' : /hội thoại|dialogue/i.test(s[1]) ? 'dialogue' : /giải đố|crossword/i.test(s[1]) ? 'cross' : 'grid'; return; }
    const f = MD_FIELD.exec(t);
    if (f) { const k = MD_FKEY[f[1].toLowerCase()]; mode = null;
      if (/^gt/.test(k)) { const g = { kind: /^gtI/.test(k) ? 'image' : 'text', pos: /top$/.test(k) ? 'top' : 'bottom', lines: f[2].trim() ? [f[2].trim()] : [] }; gts.push(g); if (g.kind === 'text') gx = g; return; }
      F[k] = k === 'note' && F.note ? F.note + ' ' + f[2].trim() : f[2].trim(); return; }
    if (/^\(?0[.)]\s+\S/.test(t)) { mode = null; body.push(B('1. ' + t.replace(/^\(?0[.)]\s*/, '') + ' ' + MD_EX)); return; }     // v81: câu ví dụ
    if (/^>\s*\S/.test(t)) { mode = null; body.push(B('1. ' + MD_GT + t.replace(/^>\s*/, ''))); return; }                       // v81: dòng chữ giữa các câu
    if (MD_SKIP.test(t)) return;
    const parLab = mode === 'passage' && /^[A-H][.)]\s/.test(t) && t.replace(/^[A-H][.)]\s*/, '').split(/\s+/).length >= 8 && !/\s[B-H][.)]\s/.test(t);   // v81: đoạn có nhãn A. B. (bài nối tiêu đề với đoạn)
    if (parLab) { if (sec.passage.length && sec.passage[sec.passage.length - 1] !== '') sec.passage.push(''); sec.passage.push(t); return; }
    if (mode === 'passage' && (NUM_RE.test(t) || /\s\|\s|\t/.test(t) || OPT_LINE.test(t) || BOX.test(t))) mode = null;      // câu đánh số / lựa chọn / bảng: hết bài đọc
    if (mode === 'dialogue' && !/^[^:]{1,40}:\s*\S/.test(t)) mode = null;
    if (mode) { sec[mode].push(t); return; }
    if (MD_SCAF.test(t)) { scaf++; return; }
    if (MD_RULE.test(t)) return;
    if (MD_LABEL.test(t)) { notes.push(`bỏ dòng “${t}” (chỉ có nhãn, không phải câu)`); return; }
    // lựa chọn A. B. C. mỗi cái một dòng (thụt lề hoặc không) ngay dưới câu: gộp vào câu đó
    if (OPT_LINE.test(t) && body.length && !last().box && NUM_RE.test(last().s)) { last().s += ' ' + t; return; }
    // ô tick ☐ / □ / [ ]: các dòng liền nhau là lựa chọn của một câu
    const bx = /\s\|\s|\t|\|/.test(t) ? null : boxSplit(line);      // dòng bảng: "[ ]" là ô tick của bảng, không phải lựa chọn
    if (bx) {
      box = true; const p = body.length ? last() : null;
      if (bx[0] || bx[1].length >= 2) { body.push(B(`1. ${bx[0]} ${optStr(bx[1])}`, bx[1].slice())); return; }
      if (p && p.box) { p.box = p.box.concat(bx[1]); p.s = p.s.replace(/(^|\s)\(?A[.)]\s.*$/, '') + ' ' + optStr(p.box); return; }
      if (p && !NUM_RE.test(p.s) && !OPT_LINE.test(p.s.trim())) { p.box = bx[1].slice(); p.s = `1. ${p.s.trim()} ${optStr(p.box)}`; return; }   // dòng hỏi ngay trên là thân câu
      body.push(B(`1. ${optStr(bx[1])}`, bx[1].slice())); return;
    }
    if (/^(\s{2,}|\t)\S/.test(line) && body.length && NUM_RE.test(last().s)) { last().s += ' ' + t; return; }   // dòng thụt lề: dòng tiếp của câu trên
    body.push(B(line));
  });
  if (scaf) notes.push(`bỏ ${scaf} dòng kiểu “My answer: A / B / C” (app tự vẽ chỗ trả lời)`);
  // dòng chữ thường nằm SAU câu cuối (không đánh số, không có chỗ trả lời): lời nhắc của bài → đưa vào hướng dẫn
  const isItem = x => NUM_RE.test(x.s) || x.box || OPT_LINE.test(x.s.trim());
  const lastI = body.reduce((k, x, i) => isItem(x) ? i : k, -1), tail = [];
  if (lastI >= 0) for (let i = body.length - 1; i > lastI; i--) { const x = body[i].s.trim(); if (!x.includes('___') && !/\{[^}]*\|/.test(x) && !/\s\|\s|\t|\[ảnh:/i.test(x) && !/^([A-Z][\p{L}.' -]{0,18}):\s+/u.test(x)) tail.unshift(body.splice(i, 1)[0].s.trim()); else break; }
  if (F.note) tail.push(F.note);
  if (tail.length) { F.instruction = [F.instruction || '', ...tail].filter(Boolean).join(' '); const s = tail.join(' '); notes.push(`đưa lời nhắc vào hướng dẫn: “${s.slice(0, 60)}${s.length > 60 ? '…' : ''}”`); }
  // v84: nhãn lựa chọn mặc định chữ thường kể cả khi file viết A. B. C. (đổi chữ hoa ở nút Nhãn của Task)
  let force = null;
  if (F.recipe) { const q = F.recipe.toLowerCase(), r = RECIPES.find(x => x.id === q || x.name.toLowerCase() === q); if (r) force = r.id; else notes.push(`không có mẫu "${F.recipe}", giữ cấu hình đoán`); }
  const img2 = F.image && F.image.includes(';') ? F.image.split(/\s*;\s*/).filter(Boolean) : null; if (img2) F.image = img2[0];
  if (F.image) body.unshift(B(`[ảnh: ${F.image}]`));
  while (sec.passage.length && sec.passage[sec.passage.length - 1] === '') sec.passage.pop();
  const passage = sec.passage.reduce((s, x) => x === '' ? s + '\n\n' : s + (s && !s.endsWith('\n') ? ' ' : '') + x, '');   // giữ đoạn văn (dòng trống = sang đoạn mới)
  const r = parseTask(body.map(x => x.s).join('\n'), force, { title: b.title, instruction: F.instruction || '', audio: F.audio || '', passage, match: (!!F.kind && /^nối/i.test(F.kind.trim())) || (!!F.form && /^nối/i.test(F.form.trim())), box });
  const t = r.t; let conf = r.conf, explicit = !!force;
  // v81: câu ví dụ / dòng chữ đã qua bộ đoán: gỡ dấu ẩn, gắn cờ
  const deep = (o, f) => { if (typeof o === 'string') return f(o); if (Array.isArray(o)) return o.map(v => deep(v, f)); if (o && typeof o === 'object') { Object.keys(o).forEach(k => { o[k] = deep(o[k], f); }); return o; } return o; };
  const hasMk = (o, ch) => JSON.stringify(o).includes(ch);
  if (t.content.items) t.content.items = t.content.items.map(x => {
    if (hasMk(x, MD_GT)) { const tx = [x.text, ...(x.lines || [])].filter(v => typeof v === 'string').join(' ').replace(new RegExp(MD_GT, 'g'), '').replace(new RegExp(MD_EX, 'g'), '').trim(); return { id: x.id, gt: true, text: tx }; }
    if (hasMk(x, MD_EX)) { deep(x, v => v.replace(new RegExp('\\s*' + MD_EX, 'g'), '')); x.ex = true; }
    return x; });
  its(t).forEach(x => { if (!(x.text || '').includes('\u2028')) return; if (x.img || x.imgs) { x.lines = x.text.split('\u2028').map(y => y.trim()); delete x.text; delete x.len; } else x.text = x.text.split('\u2028').map(y => y.trim()).filter(Boolean).join('\n'); });   // câu có ảnh: ô nhiều dòng (T5); câu không ảnh: giữ một câu, xuống dòng trong chữ (v79)
  const wk = F.kind && MD_KIND[F.kind.toLowerCase().replace(/[.!]+$/, '').trim()];
  if (!its(t).length && !passage && !sec.grid.length && !sec.cross.length && !sec.dialogue.length && wk && wk[0] === 'sentence') {   // v80: Task không có câu mà ghi "viết câu" = khung viết tự do (bài viết đoạn)
    t.content = { form: 'list', items: [{ id: 'q1', text: '' }] }; if (!F.image) delete t.image; t.layout.num = 'off'; setKind(t, 'sentence'); explicit = true;
    notes.push('Task không có câu: tạo một khung viết tự do (không số, không ảnh tự thêm). Thêm “Ảnh: …” nếu bài có ảnh');
  }
  if (sec.grid.length || sec.cross.length) {         // ô chữ: bảng chữ cái, mỗi dòng một hàng (có dấu cách thì tách theo dấu cách); crossword: # ô trống '.' ô chưa đáp án
    const cr = sec.cross.length > 0, rows = cr ? crossParse(sec.cross) : sec.grid.map(x => /\s/.test(x) ? x.split(/\s+/) : [...x]), n = Math.max(...rows.map(x => x.length));
    t.content = { form: 'table', corner: '', cols: Array(n).fill(''), rows: rows.map(x => ({ head: '', cells: x.concat(Array(n - x.length).fill('')) })) };
    t.layout.table = { head: false, rowHead: false, nm: 'off', lines: 'all', align: 'center', minH: 8 }; if (cr) t.layout.table.cross = true; delete t.image;
    ensureRowIds(t); setKind(t, 'none'); explicit = true;
    if (r.t && body.some(x => NUM_RE.test(x))) notes.push('bỏ các câu đánh số nằm cùng ô chữ (ô chữ là bảng)');
  } else if (sec.dialogue.length) {
    const other = its(t).length;
    t.content = { form: 'list', items: sec.dialogue.map(x => { const m = /^([^:]{1,40}):\s*(.*)$/.exec(x); return { who: m[1].trim(), text: normGap(m[2]) }; }) };
    if (F.intro) t.content.lead = { kind: 'text', text: F.intro };
    if (!F.image) delete t.image;      // thân Task không có câu nên bộ đoán đã thêm ảnh tô màu giả: bỏ
    ensureIds(t); setKind(t, its(t).some(x => (x.text || '').includes('___')) ? 'word' : 'none'); explicit = true;
    if (other) notes.push(`bỏ ${other} dòng ngoài khối hội thoại`);
  }
  if (F.bank) { const w = F.bank.split(/\s*[,;|]\s*|\s\/\s/).map(x => x.trim()).filter(Boolean), dl = ck(t) === 'dialogue'; t.wordBank = { words: w, placement: dl ? 'right' : 'top', style: dl ? 'list' : 'chips', label: 'lower' }; }
  if (F.gapkeys && t.content.lead && t.content.lead.kind === 'passage') { const g = F.gapkeys.split(/\s*[,;|]\s*/).map(x => x.trim()).filter(Boolean); if (g.length) t.content.lead.keys = g; }
  if (F.kind && !force) {
    let k = MD_KIND[F.kind.toLowerCase().replace(/[.!]+$/, '').trim()];
    if (k && k[0] === 'tick' && its(t).some(x => x.opts && x.opts.length >= 2 && !x.imgs)) k = ['choice', 'item'];   // tick vào lựa chọn bằng chữ = Lựa chọn (A4) kiểu ô tick
    if (!k) notes.push(`không hiểu "Trả lời: ${F.kind}"; giữ loại đáp án đoán`);
    else if (!kindsOk(t).includes(k[0])) notes.push(`"Trả lời: ${F.kind}" không hợp với nội dung; giữ loại đáp án đoán`);
    else { setKind(t, k[0]); if (k[1] && attachOpts(t).includes(k[1])) { t.answer.attach = k[1]; normAnswer(t); } explicit = true; }
  }
  if (F.form) { const q0 = qOf(t), n0 = its(t).filter(x => !x.gt).length; if (mdForm(t, F.form, notes, body.some(x => NUM_RE.test(x.s) && /\[ảnh:/i.test(x.s)))) { explicit = true; if (F.kind && q0 !== qOf(t)) notes.push(`có cả “Trả lời: ${F.kind}” và “Dạng: ${F.form}”: dùng “Dạng:”`); if (qOf(t) === 'Q12' && !n0 && !F.image && !img2) delete t.image; } }
  if (img2 && t.image) { t.image.two = true; t.image.label2 = img2[1]; if (img2.length > 2) notes.push('“Ảnh:” chỉ nhận 2 ảnh cạnh nhau; bỏ ảnh thứ 3 trở đi'); }
  if (F.ibank) { const w = F.ibank.split(/\s*[,;|]\s*/).map(x => x.trim()).filter(Boolean); t.wordBank = { words: w, placement: 'top', style: 'chips', label: 'lower', kind: 'image' }; }
  if (F.bankpos) { const v = { 'trên': 'top', 'dưới': 'bottom', 'phải': 'right', 'bên phải': 'right', top: 'top', bottom: 'bottom', right: 'right' }[F.bankpos.toLowerCase().trim()]; if (!t.wordBank) notes.push('“Vị trí khung từ” nhưng Task không có khung từ'); else if (!v) notes.push(`không hiểu "Vị trí khung từ: ${F.bankpos}" (trên / dưới / phải)`); else t.wordBank.placement = v; }
  if (F.ruling) { if (/bốn ô li|4 ô li/i.test(F.ruling)) { if (['A1', 'A8'].includes(t.answer.layout)) t.answer.params.ruling = '4'; else notes.push('“Dòng kẻ: bốn ô li” chỉ dùng cho dòng viết / tô chữ'); } else if (!/thường/i.test(F.ruling)) notes.push(`không hiểu "Dòng kẻ: ${F.ruling}"`); }
  if (gts.length) { t.extras = t.extras || []; const used = new Set(t.extras.map(y => y.id)); gts.forEach(g => { while (g.lines.length && g.lines[g.lines.length - 1] === '') g.lines.pop(); const id = newId(used, 'x'); const lb = g.lines.join(' '), mn = /\s*\((\d)\s*ảnh\)\s*$/i.exec(lb), n = mn ? Math.min(4, Math.max(1, +mn[1])) : 1; t.extras.push(g.kind === 'image' ? Object.assign({ id, kind: 'image', pos: g.pos, label: (mn ? lb.slice(0, mn.index) : lb).trim() || 'ảnh' }, n > 1 ? { n } : {}) : { id, kind: 'text', pos: g.pos, text: g.lines.join('\n') }); }); }
  if (F.marks) { if (!t.image) notes.push('“Điểm trên ảnh” nhưng Task không có ảnh chung'); else { const pts = F.marks.replace(/\(([^)]*)\)/g, '').split(/\s*;\s*/).map(x => x.trim().split(/[\s,]+/).map(parseFloat)).filter(a => a.length >= 2 && isFinite(a[0]) && isFinite(a[1])).slice(0, 20).map(([x, y]) => ({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })); if (pts.length) t.image.marks = pts; else notes.push(`không đọc được "Điểm trên ảnh: ${F.marks}" (viết x y theo %, cách nhau bằng ;)`); if (/ô trống/i.test(F.marks)) t.image.mk = { label: 'none' }; } }
  // ô tick ☐ trong MD: lựa chọn hiện bằng ô vuông (A4, nhãn ☐)
  
  if (box && t.answer.layout === 'A4' && t.answer.attach === 'item') { t.answer.params.lab = 'box'; explicit = explicit || !!F.kind; }
  else if (box && !force) notes.push(`có ô tick ☐ nhưng đáp án là “${MD_KNAME(t)}”. Nếu bài trộn nhiều loại đáp án, tách thành nhiều Task (vd 6a, 6b)`);
  // gạch ___ ở cuối câu khi đáp án đã có chỗ trả lời riêng (Đúng/Sai, viết câu, viết từ theo câu): bỏ để không trùng
  if (dupGapKind(t)) { let n = 0; its(t).forEach(x => { if (x.text && /\s*_{3,}\s*[.?!]?\s*$/.test(x.text) && x.text.split('___').length === 2 && !/:\s*_{3,}\s*$/.test(x.text)) { x.text = x.text.replace(/\s*_{3,}(\s*[.?!]?)\s*$/, '$1').replace(/\s+([.?!])$/, '$1'); n++; } }); if (n) notes.push(`bỏ gạch ___ ở cuối ${n} câu (app tự vẽ chỗ trả lời)`); }
  if (F.lines) { const n = Math.max(1, Math.min(t.answer.layout === 'A1' ? 20 : 8, parseInt(F.lines, 10) || 1)); if (['A1', 'A2'].includes(t.answer.layout)) t.answer.params.lines = n; else notes.push('“Dòng viết” chỉ dùng cho đáp án viết câu / điền chỗ trống'); }
  if (keys && keys.length) { const it = its(t).filter(keyable); if (it.length) { it.forEach((x, i) => { if (keys[i] != null && keys[i] !== '') x.key = keys[i]; }); if (keys.length > it.length) notes.push(`đáp án có ${keys.length} dòng, Task có ${it.length} câu`); } else notes.push('Task không có câu: bỏ phần đáp án'); }
  if (keys && keys.ex != null) { const x = its(t).find(y => y.ex); if (x) x.key = keys.ex; else notes.push('đáp án có dòng “0.” nhưng Task không có câu ví dụ'); }
  its(t).forEach(x => { if (x.ex && x.key == null) x.key = ''; });
  if (keys && keys.gap) { if (t.content.lead && t.content.lead.kind === 'passage') t.content.lead.keys = keys.gap; else notes.push('“Chỗ trống:” trong đáp án nhưng Task không có bài đọc'); }
  if (F.tlay) { const v = MD_TLAY[F.tlay.toLowerCase().trim()]; if (!v) notes.push(`không hiểu "Bố cục: ${F.tlay}" (xếp dọc / ảnh trái / ảnh phải / ảnh trong bài đọc)`); else if (tnReasons(t)[v]) notes.push(`"Bố cục: ${F.tlay}" không dùng được (${tnReasons(t)[v]}); để Tự động`); else qCmd(t, 'tn', v); }
  if (F.order) { if (!/câu hỏi trước|questions? first/i.test(F.order)) { if (!/bài đọc trước/i.test(F.order)) notes.push(`không hiểu "Thứ tự: ${F.order}"`); } else if (ck(t) !== 'passage') notes.push('“Thứ tự: câu hỏi trước” chỉ dùng cho Task có bài đọc'); else if (t.layout.task !== 'auto' && ['T8', 'T4'].includes(layoutOf(t))) notes.push('“Bố cục:” đã chọn đặt bài đọc cạnh câu hỏi / bao quanh ảnh: bài đọc luôn đứng trước, bỏ “Thứ tự”'); else t.layout.order = 'qfirst'; }
  if (F.ta) { const m = { 'trái': 'left', 'giữa': 'center', 'phải': 'right', 'hai bên': 'justify', 'đều hai bên': 'justify' }[F.ta.trim().toLowerCase()]; if (m) { if (m !== 'left') t.layout.ta = m; } else notes.push(`không hiểu "Căn lề chữ: ${F.ta}" (trái / giữa / phải / hai bên)`); }   // v97
  if (F.nlab) { const v = F.nlab.toLowerCase().replace(/[\s,.-]+/g, '');   // v100: "Số câu: a b c" / "ẩn" / "1 2 3"
    if (/^(abc|a[-–]?[a-z]|chữ|chữcái)$/.test(v)) t.layout.nlab = 'a'; else if (/^(ẩn|an|off|không|bỏ)$/.test(v)) { t.layout.num = 'off'; } else if (!/^(123|số|hiện|on)$/.test(v)) notes.push(`không hiểu "Số câu: ${F.nlab}" (a b c / ẩn / 1 2 3)`); }
  if (F.qbold) { if (/^(đậm|bold|có)$/i.test(F.qbold)) t.layout.qbold = true; else if (!/^(thường|bình thường|normal|không)$/i.test(F.qbold)) notes.push(`không hiểu "Chữ câu hỏi: ${F.qbold}" (đậm / thường)`); }
  if (F.heads) { if (ck(t) !== 'pairs') notes.push('“Tiêu đề cột” chỉ dùng cho bài nối'); else { const h = F.heads.split('|').map(x => x.trim()); if (h.some(Boolean)) t.content.heads = [h[0] || '', h[1] || '']; } }   // v105
  if (F.mid) { if (ck(t) !== 'pairs') notes.push('“Chỗ nối” chỉ dùng cho bài nối'); else if (/^(ô|box)/i.test(F.mid.trim())) t.answer.params.mid = 'box'; else if (/^(không|none)/i.test(F.mid.trim())) t.answer.params.mid = 'none'; else if (!/^(chấm|dot)/i.test(F.mid.trim())) notes.push(`không hiểu "Chỗ nối: ${F.mid}" (chấm / ô viết chữ / không)`); }   // v105
  if (F.strictc) { if (/^(có|bật|yes|on)$/i.test(F.strictc)) t.answer.params.strictContr = true; else if (!/^(không|tắt|no|off)$/i.test(F.strictc)) notes.push(`không hiểu "Phân biệt viết tắt: ${F.strictc}" (có / không)`); }   // v116
  if (F.imgPct) { const m = /^(\d{2,3})\s*%?$/.exec(F.imgPct.trim()); if (!imgRowN(t)) notes.push('“Kích thước ảnh” chỉ dùng cho bài có ảnh theo câu (nhìn ảnh viết, chọn ảnh)'); else if (m && +m[1] >= 50 && +m[1] <= 150) t.layout.imgPct = +m[1]; else notes.push(`không hiểu "Kích thước ảnh: ${F.imgPct}" (50% – 150%)`); }   // v115
  if (F.imgFit) { if (!imgRowN(t)) notes.push('“Ảnh vừa ô” chỉ dùng cho bài có ảnh theo câu'); else if (/^(có|bật|yes|on)$/i.test(F.imgFit)) t.layout.imgFit = true; else if (!/^(không|tắt|no|off)$/i.test(F.imgFit)) notes.push(`không hiểu "Ảnh vừa ô: ${F.imgFit}" (có / không)`); }
  if (F.mbd) { if (ck(t) !== 'pairs') notes.push('“Viền hai vế” chỉ dùng cho bài nối'); else if (/^(có|bật|yes|on)$/i.test(F.mbd)) t.layout.mbd = 'on'; else if (!/^(không|tắt|no|off)$/i.test(F.mbd)) notes.push(`không hiểu "Viền hai vế: ${F.mbd}" (có / không)`); }   // v103
  if (F.shuf) { if (ck(t) !== 'pairs') notes.push('“Xáo vế phải” chỉ dùng cho bài nối'); else if (/^(có|bật|yes|on)$/i.test(F.shuf)) t.content.shuffle = true; else if (/^(không|tắt|no|off)$/i.test(F.shuf)) delete t.content.shuffle; else notes.push(`không hiểu "Xáo vế phải: ${F.shuf}" (có / không)`); }
  if (/\s\|\s|\t/.test(body.join('\n')) && ck(t) === 'table') explicit = true;
  // v100: bài đọc có chỗ trống ___ và không có câu đánh số: chỗ trống là chỗ trả lời, không tạo dòng câu trống
  if (t.content.lead && t.content.lead.kind === 'passage' && gapCount(t.content.lead.text) > 0 && its(t).every(x => !x.text && !x.opts && !x.imgs && !x.img && !x.lines && !x.ex && !x.gt)) { t.content.items = []; t.content.list = false; notes.push('bài đọc có chỗ trống ___: vẫn dùng được, nhưng nên chuyển thành câu hỏi (mỗi đoạn một câu “1.”, bài đọc chỉ giữ tiêu đề) để có đáp án riêng cho từng chỗ trống'); }
  normAnswer(t); tidy(t);
  if (!force) { const m = recipeMatch(t); t.typeId = m.exact ? m.r.id : 'custom'; t.typeName = descOf(t); }
  if (!explicit && conf !== 'cao') notes.push(`loại đáp án do hệ thống đoán (độ chắc: ${conf}); thêm dòng “Trả lời: …” để chắc`);
  else conf = 'cao';
  return { t, notes, conf };
}

// Xuất MD theo quy ước (dùng để kiểm thử khứ hồi và làm mẫu cho người soạn; nút Xuất MD ở thanh trên)
export const MD_KNAME = t => { const a = t.answer, k = a.kind; return k === 'word' ? (a.attach === 'inline' ? 'điền chỗ trống' : 'viết từ') : k === 'choice' ? (a.attach === 'inline' ? 'chọn trong câu' : (a.params || {}).lab === 'box' ? 'tick' : 'khoanh A/B/C') : { sentence: 'viết câu', tick: 'tick', tf: 'đúng/sai', match: 'nối', trace: 'tô chữ', none: 'không' }[k] || 'không'; };

export function taskToMd(t, asPart) {
  const c = t.content, o = [(asPart ? '### Phần: ' : '## Task: ') + (t.title || '')], k = ck(t), a = t.answer, cell = v => v && v.ans != null ? '=' + v.ans : v && v.tick ? fmtCell(v) : v && v.img ? fmtCell(v) : (typeof v === 'string' ? brOut(v) : '');
  if (t.audio) o.push('Track: ' + t.audio);
  if (t.instruction) o.push('Hướng dẫn: ' + t.instruction);
  if (t.image && k !== 'table') o.push('Ảnh: ' + t.image.label + (t.image.two ? '; ' + (t.image.label2 || 'ảnh 2') : ''));
  if (t.layout.task !== 'auto' && tnOf(t) !== 'T1') o.push('Bố cục: ' + TN[tnOf(t)].toLowerCase());
  if (k !== 'table') o.push('Trả lời: ' + MD_KNAME(t));
  { const p = a.params || {}, q = qOf(t);   // v81: luôn ghi Dạng: (kèm Trả lời: để bản cũ vẫn đọc được)
    if (k !== 'table' && a.kind !== 'none' && q) { const nm = { Q1: 'điền từ', Q2: 'viết câu', Q3: 'chọn A/B/C', Q4: 'chọn trong câu', Q5: 'đúng/sai', Q6: 'nhìn ảnh viết', Q7: 'chọn ảnh', Q8: 'nối', Q9: 'tô chữ', Q12: 'viết tự do' }[q];
      const op = q === 'Q5' && a.kind === 'tf' && p.row ? [...(p.labs ? [p.labs.join('/')] : []), 'cùng hàng'].join(', ') : q === 'Q5' && p.labs ? p.labs.join('/') : q === 'Q5' && a.kind === 'tick' ? 'ô tick' : q === 'Q4' && p.ulab ? 'nhãn A-D' : q === 'Q12' && p.frame === 'box' ? 'khung vẽ' : ['Q1', 'Q6'].includes(q) && a.layout === 'A3' ? 'ô chữ cái' : q === 'Q3' ? [p.lab === 'box' ? 'ô tick' : p.lab === 'circle' ? 'khoanh' : '', p.qv === 'center' ? 'căn giữa' : p.qv === 'bottom' ? 'căn dưới' : ''].filter(Boolean).join(', ') : '';
      if (nm) o.push(`Dạng: ${nm}${op ? ` (${op})` : ''}`); }
    if (p.ruling === '4') o.push('Dòng kẻ: bốn ô li'); }
  if (t.layout.order === 'qfirst') o.push('Thứ tự: câu hỏi trước');
  if (t.layout.qbold) o.push('Chữ câu hỏi: đậm');
  if (t.layout.nlab === 'a') o.push('Số câu: a b c'); else if (t.layout.num === 'off' && its(t).length > 1) o.push('Số câu: ẩn');
  if (taOf(t) !== 'left') o.push('Căn lề chữ: ' + TA.find(y => y[0] === taOf(t))[1].toLowerCase());   // v97
  if (k === 'pairs' && c.shuffle) o.push('Xáo vế phải: có');
  if (k === 'pairs' && t.layout.mbd === 'on') o.push('Viền hai vế: có');
  if ((a.params || {}).strictContr) o.push('Phân biệt viết tắt: có');   // v116
  if (imgRowN(t) && t.layout.imgFit) o.push('Ảnh vừa ô: có'); else if (imgRowN(t) && t.layout.imgPct && t.layout.imgPct !== 100) o.push(`Kích thước ảnh: ${t.layout.imgPct}%`);   // v115
  if (k === 'pairs' && c.heads && c.heads.some(Boolean)) o.push('Tiêu đề cột: ' + c.heads.join(' | '));
  if (k === 'pairs' && (a.params || {}).mid === 'box') o.push('Chỗ nối: ô viết chữ'); else if (k === 'pairs' && (a.params || {}).mid === 'none') o.push('Chỗ nối: không');
  if (t.image && t.image.marks && t.image.marks.length) o.push('Điểm trên ảnh: ' + t.image.marks.map(m => `${m.x} ${m.y}`).join('; ') + (t.image.mk && t.image.mk.label === 'none' ? ' (ô trống)' : ''));
  (t.extras || []).forEach(x => { if (x.kind === 'image') o.push(`Khối ảnh${x.pos === 'top' ? ' trên' : ''}: ${x.label || 'ảnh'}${gtN(x) > 1 ? ` (${gtN(x)} ảnh)` : ''}`); else { o.push(`Khối chữ${x.pos === 'top' ? ' trên' : ''}:`); String(x.text || '').split('\n').forEach(l => o.push(l.trim() ? '  ' + l : '')); } });
  if (['A1', 'A2'].includes(a.layout) && (a.params.lines || 1) > 1) o.push('Dòng viết: ' + a.params.lines);
  if (k === 'passage' && c.lead && c.lead.keys && c.lead.keys.length) o.push('Đáp án chỗ trống: ' + c.lead.keys.join(', '));
  if (t.wordBank) { const wb = t.wordBank; o.push((wb.kind === 'image' ? 'Khung từ ảnh: ' : 'Khung từ: ') + wb.words.join(wb.words.some(w => w.includes(',')) ? '; ' : ', ')); const dp = k === 'dialogue' ? 'right' : 'top'; if ((wb.placement || 'top') !== dp) o.push('Vị trí khung từ: ' + { top: 'trên', bottom: 'dưới', right: 'phải' }[wb.placement || 'top']); }
  if (k === 'table') {
    const tb = t.layout.table || {};
    if (tb.cross) { o.push('Crossword:'); crossLines(c).forEach(l => o.push(l)); return o.join('\n'); }
    if (tb.head === false && tb.rowHead === false) { o.push('Ô chữ:'); c.rows.forEach(r => o.push(r.cells.map(cell).join(r.cells.every(x => String(cell(x)).length <= 1) ? '' : ' '))); }
    else { o.push([cell(c.corner || ''), ...c.cols.map(cell)].join(' | ')); c.rows.forEach(r => o.push([r.head && r.head.img ? `[ảnh: ${r.head.img}] ${r.head.text || ''}`.trim() : cell(r.head), ...r.cells.map(cell)].join(' | '))); }
    return o.join('\n');
  }
  if (k === 'passage') o.push('Bài đọc:', leadText(t), '');
  if (k === 'dialogue') { if (leadText(t)) o.push('Lời dẫn: ' + leadText(t)); o.push('Hội thoại:'); its(t).forEach(x => o.push(`${x.who || '?'}: ${x.text || ''}`)); return o.join('\n'); }
  (c.list === false || (its(t).length === 1 && !its(t)[0].text && !its(t)[0].lines && t.layout.num === 'off' && a.layout === 'A1') ? [] : its(t)).forEach((x, i) => {
    if (x.gt) { o.push('> ' + (x.text || '').replace(/\n/g, ' ')); return; }
    const n = `${qnum(t, i)}. `, im = x.img ? `[ảnh: ${x.img}] ` : '';
    if (x.pair) o.push(n + ((x.pair.l && (x.pair.l.img ? `[ảnh: ${x.pair.l.img}]` : x.pair.l.text)) || '') + (x.pair.l ? ' - ' : '- ') + ((x.pair.r && x.pair.r.text) || ''));
    else if (x.lines) { o.push(n + im + (x.lines[0] || '')); x.lines.slice(1).forEach(l => o.push('   ' + l)); }
    else if (x.imgs) o.push(n + (x.text || '') + ' ' + x.imgs.map((m, j) => `${'abcd'[j]}. ${m}`).join(' '));
    else { const ml = /\n/.test(x.text || ''), op = x.opts && a.kind === 'choice' && a.attach === 'item' ? x.opts.map((p, j) => (a.params || {}).lab === 'box' ? `☐ ${p}` : `${'ABCD'[j]}. ${p}`).join(' ') : '';
      o.push(n + im + (x.text || '').replace(/\n/g, '\n   ') + (op ? (ml ? '\n   ' : ' ') + op : '')); }
  });
  return o.join('\n');
}

export function sheetToMd(w) {
  const o = ['# ' + (w.title || ''), 'Tuổi: ' + w.age, 'Xếp trang: ' + (w.flow === 'page' ? 'tách' : 'liền')];
  if (PRESET_NAME[w.spacing && w.spacing.preset]) o.push('Khoảng cách: ' + PRESET_NAME[w.spacing.preset].toLowerCase());
  const jn = (t, i) => i > 0 && t.layout && t.layout.break === 'join';
  w.tasks.forEach((t, i) => o.push('', taskToMd(t, jn(t, i))));
  const grpKeys = []; w.tasks.forEach((t, i) => { if (!jn(t, i)) grpKeys.push([grpKeys.length + 1, [], null]); const g = grpKeys[grpKeys.length - 1]; g[1].push(...its(t).filter(x => !x.ex && !x.gt).map(x => x.key)); const e = its(t).find(x => x.ex); if (e && g[2] == null) g[2] = e.key || ''; });
  const keys = grpKeys.filter(([, k, e]) => k.some(x => x != null && x !== '') || (e != null && e !== ''));
  if (keys.length) { o.push('', '## Đáp án'); keys.forEach(([n, k, e]) => { o.push(`### Task ${n}`); if (e != null && e !== '') o.push(`0. ${e}`); k.forEach((x, i) => o.push(`${i + 1}. ${x == null ? '' : x}`)); }); }
  return o.join('\n') + '\n';
}

/* ================= v81: Kiến trúc trình bày mới (T bố cục · Q dạng câu hỏi · khối G) =================
   T = vị trí ảnh chung (G1) so với bài đọc (G2) / câu hỏi (G3): 4 kiểu. Q = dạng câu hỏi, gồm cách trả lời và cách xếp câu: 12 kiểu.
   Dữ liệu không đổi: T và Q SUY RA từ layout.task, content và answer (mã T1–T9, A1–A8 vẫn là dữ liệu bên trong), nên phiếu cũ mở ra giống v80.
   Chỉ khi Task không có chỗ trả lời thì dạng câu hỏi được nhớ ở t.q (không suy ra được). */
export const TN = { T1: 'Xếp dọc', T2: 'Ảnh trái', T3: 'Ảnh phải', T4: 'Ảnh trong bài đọc' };

export const TN_OLD = { T2: 'T2', T3: 'T3', T4: 'T8' };

export const T1FAM = ['T1', 'T4', 'T5', 'T6', 'T7', 'T9'];

export const tnOf = t => ({ T2: 'T2', T3: 'T3', T8: 'T4' })[layoutOf(t)] || 'T1';

export function tnReasons(t) { const w = layoutReasons(t); return { T1: '', T2: w.T2 || '', T3: w.T3 || '', T4: w.T8 ? 'Chỉ dùng cho bài đọc có ảnh chung' : '' }; }

// Bố cục bên trong ứng với "Xếp dọc": giữ cách xếp câu đang dùng nếu được
export function t1Old(t) {
  const L = layoutOf(t); if (T1FAM.includes(L)) return L;
  const k = ck(t); if (k === 'items') return 'T5'; if (k === 'pairs') return 'T7'; if (k === 'table') return 'T9'; if (k === 'empty') return 'T1';
  if (t.answer.layout === 'A6' && k === 'questions') return 'T4'; return t.image ? 'T1' : 'T6';
}

export function tnTarget(t, v) { if (v === 'auto') return 'auto'; if (TN_OLD[v]) return TN_OLD[v]; return T1FAM.includes(autoLayout(t)) && t.layout.task === 'auto' ? 'auto' : t1Old(t); }

export const QORDER = Object.keys(QN);

export function qReasons(t) {
  const k = ck(t), r = {};
  QORDER.forEach(q => {
    let why = '';
    if (k === 'passage' && !['Q1', 'Q2', 'Q3', 'Q5'].includes(q)) why = 'Bài đọc đi với Điền từ, Viết câu, Chọn A/B/C hoặc Đúng / Sai';
    else if (k === 'dialogue' && ['Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12'].includes(q)) why = 'Hội thoại (có người nói) đi với Q1–Q5; tắt Người nói trước';
    r[q] = why;
  });
  return r;
}

// Đổi dạng câu hỏi: giữ chữ các câu, ảnh chung, bài đọc, khung từ, khối tự do, nối Task; đổi cấu trúc câu và chỗ trả lời
export function setQ(t, q) {
  const k0 = ck(t);
  if (!QN[q] || qReasons(t)[q]) return false;
  const brk = t.layout.break, num = t.layout.num, keepT = TN_OLD[tnOf(t)] && !layoutReasons(t)[layoutOf(t)] ? layoutOf(t) : null;
  const toList = () => {
    const c = t.content;
    if (c.form === 'table') { t.content = { form: 'list', items: (c.rows || []).map(r => ({ text: typeof r.head === 'string' ? r.head : (r.head && r.head.text) || '' })) }; t.layout.table = null; }
    const c2 = t.content; if (c2.list === false) { delete c2.list; if (c2.listAns) delete c2.listAns; }
    c2.items = c2.items || []; if (!c2.items.filter(x => !x.gt).length) c2.items.push({ text: '' }, { text: '' }, { text: '' });
    ensureIds(t);
  };
  const noImgs = () => { its(t).forEach(x => { if (x.img && !String(x.text || '').trim() && !x.lines) { x.text = x.img; delete x.len; } }); if (its(t).some(x => x.img || x.imgs || x.lines)) toggleField(t, 'img', false); };
  const toTable = () => {
    const c = t.content; if (c.form === 'table') return;
    const rows = its(t).filter(x => !x.gt).map(x => ({ head: x.text != null ? x.text : x.pair && x.pair.l ? (x.pair.l.text || '') : (x.lines || []).join(' '), cells: ['', ''] }));
    t.content = { form: 'table', corner: '', cols: ['', ''], rows: rows.length ? rows : [{ head: '', cells: ['', ''] }, { head: '', cells: ['', ''] }] };
    if (c.lead) t.content.lead = c.lead; ensureRowIds(t); t.answer = { kind: 'none', attach: 'item', layout: null, params: {} };
  };
  if (['Q10', 'Q11'].includes(q)) {
    toTable(); t.layout.table = Object.assign({}, t.layout.table || {});
    if (q === 'Q11') { const c = t.content; if (!isGridTbl(t)) { t.layout.table.cross = true; if (!c.rows.some(r => r.cells.some(v => typeof v === 'string' && v.trim().length === 1))) { c.cols = ['', '', '', '', '']; c.rows = ['#C#S#', '#A#U#', '#TEN#'].map(l => ({ head: '', cells: crossParse([l])[0] })); ensureRowIds(t); } } }
    else { delete t.layout.table.cross; if (t.layout.table.head === false && t.layout.table.rowHead === false) { delete t.layout.table.head; delete t.layout.table.rowHead; } }
    if (!Object.keys(t.layout.table).length) t.layout.table = null;
  } else {
    toList();
    if (q !== 'Q4') its(t).forEach(x => { if (!x.gt && /\{…\|…\}/.test(x.text || '')) x.text = x.text.replace(/\s*\{…\|…\}\s*$/, '').replace(/\{…\|…\}/g, '___'); });   // rời Q4: bỏ chỗ giữ chỗ {…|…} chưa điền (cuối câu: bỏ; giữa câu: về ___)
    if (q === 'Q6') { if (ck(t) !== 'items' || t.content.variant === 'multi') { if (t.content.variant === 'multi') toggleField(t, 'multi', false); else toggleField(t, 'img', true); } if (!['word', 'sentence', 'choice'].includes(t.answer.kind)) setKind(t, 'word'); }
    else if (q === 'Q7') { if (ck(t) !== 'items') toggleField(t, 'img', true); if (t.content.variant !== 'multi') toggleField(t, 'multi', true); setKind(t, 'tick'); }
    else {
      if (q !== 'Q8' && its(t).some(x => x.pair)) setKind(t, 'word');
      if (ck(t) === 'items') noImgs();
      if (q === 'Q8') setKind(t, 'match');
      else if (q === 'Q9') setKind(t, 'trace');
      else if (q === 'Q5') { if (t.answer.kind !== 'tf' && t.answer.kind !== 'tick') setKind(t, 'tf'); }
      else if (q === 'Q2') setKind(t, 'sentence');
      else if (q === 'Q1') setKind(t, 'word');
      else if (q === 'Q3') { its(t).forEach(x => { if (!x.gt && !x.opts) { const m = /\{([^{}|]+(?:\|[^{}|]+)+)\}/.exec(x.text || ''); x.opts = m ? m[1].split('|').map(s => s.trim()) : ['', '', '']; if (m) x.text = (x.text || '').replace(m[0], '___'); } }); setKind(t, 'choice'); t.answer.attach = 'item'; t.answer.layout = 'A4'; }
      else if (q === 'Q4') { const real = its(t).filter(x => !x.gt), ul = real.some(x => /<u>/.test(x.text || '')) && !real.some(x => hasChoiceMarkup(x.text || '') || (x.opts && x.opts.some(o => String(o).trim())));   // câu có <u>…</u>, chưa có {a|b}: tìm lỗi sai, nhãn A–D dưới đoạn gạch chân
        if (!ul) its(t).forEach(x => { if (!x.gt && x.opts && x.opts.some(o => String(o).trim()) && !hasChoiceMarkup(x.text || '')) { const g = `{${x.opts.filter(o => String(o).trim()).join('|')}}`; x.text = /___/.test(x.text || '') ? x.text.replace('___', g) : ((x.text || '').trim() + ' ' + g).trim(); } else if (!x.gt && !hasChoiceMarkup(x.text || '')) { x.text = /___/.test(x.text || '') ? x.text.replace('___', '{…|…}') : ((x.text || '').trim() + ' {…|…}').trim(); } delete x.opts; });
        setKind(t, 'choice'); if (ul) { its(t).forEach(x => { delete x.opts; }); t.answer.params.ulab = true; } t.answer.attach = 'inline'; t.answer.layout = 'A4'; }
      else if (q === 'Q12') { const ex = its(t).find(x => !x.gt); t.content.items = [{ id: (ex && ex.id) || 'q1', text: '' }]; setKind(t, 'sentence'); t.layout.num = 'off'; t.answer.params = Object.assign({}, t.answer.params, { lines: Math.max(8, t.answer.params.lines || 1) }); }
    }
  }
  if (q !== 'Q12' && k0 !== 'table' && t.layout.num === 'off' && isFreeW(t)) t.layout.num = null; else if (q !== 'Q12') t.layout.num = num ?? null;
  // Bố cục: về Tự động (trừ Ảnh trái / phải / trong bài đọc còn dùng được), giữ trạng thái nối Task
  const fit = t.layout.frame && t.layout.frame.fit;
  Object.assign(t.layout, { task: 'auto', split: null, cols: null, cw: null, width: null, align: null, valign: null, dir: null, cells: null, break: brk });
  if (keepT && !layoutReasons(t)[keepT]) t.layout.task = keepT;
  t.layout.frame = fit ? { fit } : (t.layout.frame || {});
  t.q = q; normAnswer(t); qTidy(t); return true;
}

// Công tắc "Có chỗ trả lời": tắt = chỉ hiển thị câu (từ điển tranh, nội dung đọc); bật lại về dạng đã nhớ
export function setHasAns(t, on) {
  if (!on) { const q = qOf(t); if (t.answer.kind === 'none') return; t.q = q; t.content.noAns = clone(t.answer); setKind(t, 'none'); return; }
  const prev = t.content.noAns; delete t.content.noAns;
  if (prev && kindsOk(t).includes(prev.kind)) { t.answer = prev; normAnswer(t); }
  else setQ(t, t.q || 'Q2');
  qTidy(t);
}

// Cách trả lời (trong Q): mỗi lựa chọn là một thay đổi trên answer, không có mã A trên giao diện
export function qStyles(t) {
  const q = qOf(t), a = t.answer, p = a.params || {}, A = a.layout, out = [], S = (id, name, on, fn, dis) => out.push({ id, name, on, fn, dis: dis || '' });
  if (a.kind === 'none') return out;
  const gapIn = attachOpts(t).includes('inline') && a.kind === 'word';
  if (q === 'Q1') { S('gap', gapIn ? 'Gạch trong câu' : 'Gạch dưới câu', A === 'A2', x => { x.answer.layout = 'A2'; x.answer.attach = gapIn ? 'inline' : 'item'; }); S('box', 'Ô chữ cái', A === 'A3', x => { x.answer.layout = 'A3'; x.answer.attach = 'item'; }); }
  // v95: Q2 không còn hai nút Dòng kẻ / Gạch cuối câu; thay bằng Điểm bắt đầu · Chiều dài · Số hàng (qOptsHtml, lệnh q2)
  if (q === 'Q3') { [['dot', 'a. b. c.'], ['circle', 'Khoanh ⓐ'], ['box', '☐ Ô tick']].forEach(([v, n]) => S(v, n, (p.lab || 'dot') === v, x => { x.answer.params.lab = v === 'dot' ? null : v; })); }
  if (q === 'Q4') { const tx = choiceTexts(t); if (tx.some(hasChoiceMarkup)) S('pick', 'Gạch / khoanh từ', !p.ulab, x => { delete x.answer.params.ulab; }); if (tx.some(v => /<u>/.test(v))) S('ulab', 'Nhãn A–D dưới đoạn gạch chân', !!p.ulab, x => { x.answer.params.ulab = true; }); }
  if (q === 'Q5') { S('tf', 'Khoanh Đúng / Sai', A === 'A6', x => { if (x.answer.kind !== 'tf') setKind(x, 'tf'); }); S('tick', 'Ô tick', A === 'A5', x => { if (x.answer.kind !== 'tick') setKind(x, 'tick'); }); }
  if (q === 'Q6') { S('gap', 'Gạch', a.kind === 'word' && A === 'A2', x => { if (x.answer.kind !== 'word') setKind(x, 'word'); x.answer.layout = 'A2'; }); S('box', 'Ô chữ cái', A === 'A3', x => { if (x.answer.kind !== 'word') setKind(x, 'word'); x.answer.layout = 'A3'; }); S('line', 'Dòng kẻ', a.kind === 'sentence', x => { if (x.answer.kind !== 'sentence') setKind(x, 'sentence'); x.answer.layout = 'A1'; });
    if (hasMarkup(t)) S('pick', 'Chọn trong câu', a.kind === 'choice', x => { setKind(x, 'choice'); }); }
  if (q === 'Q7') S('tick', 'Tick ảnh', true, () => {});
  if (q === 'Q8') S('dot', 'Chấm nối', true, () => {});
  if (q === 'Q9') S('trace', 'Dòng tô', true, () => {});
  if (q === 'Q12') { S('line', 'Dòng kẻ', p.frame !== 'box', x => { delete x.answer.params.frame; delete x.answer.params.boxH; }); S('box', 'Khung trống để vẽ', p.frame === 'box', x => { x.answer.params.frame = 'box'; }); }
  return out;
}

export const LABS = { tf: ['T', 'F'], tfw: ['True', 'False'], yn: ['Yes', 'No'], ng: ['T', 'F', 'NG'], rw: ['Right', 'Wrong'] };

// Lệnh dùng chung cho Inspector (data-act) và cột trái (data-eact)
export function qCmd(t, act, v) {
  if (act === 'tn') { const L = tnTarget(t, v), fit = t.layout.frame.fit; Object.assign(t.layout, { task: L, split: null, cols: null, cw: null, width: null, align: null, valign: null }); t.layout.frame = fit ? { fit } : {}; return v === 'auto' ? 'Bố cục: Tự động' : 'Bố cục: ' + TN[v]; }
  if (act === 'q') { return setQMem(t, v) ? 'Dạng câu hỏi: ' + QN[v] : null; }
  if (act === 'hasans') { setHasAns(t, v === '1'); return v === '1' ? 'Có chỗ trả lời' : 'Không có chỗ trả lời (chỉ hiển thị câu)'; }
  if (act === 'qst') { const s = qStyles(t).find(x => x.id === v); if (s) { s.fn(t); normAnswer(t); } return s ? 'Cách trả lời: ' + s.name : null; }
  if (act === 'q2') { const [k, x] = v.split(':'), c = q2cfg(t);
    if (k === 'start') q2set(t, { start: x }); else if (k === 'len') q2set(t, { len: x }); else if (k === 'mm') q2set(t, { mm: c.mm + (+x), len: 'fixed' }); else if (k === 'ln') q2set(t, { lines: c.lines + (+x) });
    const n = q2cfg(t); return `Q2: ${n.start === 'end' ? 'từ cuối câu' : 'dòng dưới'} · ${n.len === 'fill' ? 'hết dòng' : n.mm + ' mm'} · ${n.lines} hàng`; }
  if (act === 'strictc') { if (v === '1') t.answer.params.strictContr = true; else delete t.answer.params.strictContr; return v === '1' ? 'Phân biệt viết tắt: I\'m ≠ I am' : 'Không phân biệt viết tắt: I\'m = I am'; }   // v116
  if (act === 'tfrow') { if (v === '1') t.answer.params.row = true; else delete t.answer.params.row; return v === '1' ? 'T / F cùng hàng với câu' : 'T / F dưới câu'; }
  if (act === 'labs') { if (v === 'tf') delete t.answer.params.labs; else t.answer.params.labs = LABS[v].slice(); return 'Nhãn: ' + LABS[v].join(' / '); }
  if (act === 'ruling') { if (v === '4') t.answer.params.ruling = '4'; else delete t.answer.params.ruling; return v === '4' ? 'Dòng kẻ bốn ô li' : 'Dòng kẻ thường'; }
  if (act === 'qarr') { const fit = t.layout.frame.fit; Object.assign(t.layout, { task: v, split: null, cols: null, cw: null, width: null, align: null, valign: null }); t.layout.frame = fit ? { fit } : {}; return 'Đã đổi cách xếp câu'; }
  return null;
}


// ---- Không để câu ví dụ / dòng chữ (G3-Text) lẫn vào các phép đổi cấu trúc câu ----
export function withoutGt(t, fn) {
  const c = t.content; if (!c || !Array.isArray(c.items) || !c.items.some(x => x.gt)) return fn();
  const pos = c.items.map((x, i) => x.gt ? [i, x] : null).filter(Boolean); c.items = c.items.filter(x => !x.gt);
  const r = fn(); const c2 = t.content; if (c2 && Array.isArray(c2.items) && c2.form !== 'table') pos.forEach(([i, x]) => c2.items.splice(Math.min(i, c2.items.length), 0, x)); return r;
}

setKind = (f => (t, k) => withoutGt(t, () => f(t, k)))(setKind);

toggleField = (f => (t, fl, on) => withoutGt(t, () => f(t, fl, on)))(toggleField);

/* ================= hết v85 cột trái ================= */

/* ================= v83 (V4): bộ nhớ theo dạng câu hỏi =================
   Đổi Dạng câu hỏi (Q) rồi đi một vòng quay lại thì về đúng như lần trình bày gần nhất của dạng đó, không mất nội dung đã nhập.
   Khi rời dạng Q0: cất bản chụp phần gắn với Q (câu / hàng bảng, đáp án, bố cục liên quan) vào t.qmem[Q0], kèm trạng thái ngay sau khi chuyển ("after").
   Khi vào dạng Q có bản cất: gộp 3 bên theo từng trường: trường còn y như "after" (chưa ai sửa) thì lấy bản cất; đã sửa thì giữ bản đã sửa.
   Câu mới thêm giữ nguyên, câu người dùng đã xóa thì bỏ, câu bị bộ chuyển đổi bỏ đi (vd Viết tự do chỉ giữ 1 chỗ) thì trả lại. */
export const QM_L = ['task', 'split', 'cols', 'cw', 'width', 'align', 'valign', 'num', 'table'];   // phần bố cục gắn với dạng câu hỏi

export const QM_C = ['items', 'rows', 'cols', 'corner', 'lead', 'form'];                            // khóa nội dung xử lý riêng (lead thuộc G2, không đụng)

export const qmC = v => v === undefined ? undefined : clone(v);

export const qmEq = (a, b) => JSON.stringify(a === undefined ? null : a) === JSON.stringify(b === undefined ? null : b);

export const qmForm = t => t.content.form === 'table' ? 'table' : 'list';

export const qmRows = t => qmForm(t) === 'table' ? (t.content.rows || []) : (t.content.items || []);

export const qmHead = r => typeof r.head === 'string' ? r.head : (r.head && r.head.text) || '';

export const qmRest = t => { const c = {}; Object.keys(t.content).forEach(k => { if (!QM_C.includes(k)) c[k] = qmC(t.content[k]); }); return c; };

export const qmUnits = t => { const m = {}; qmRows(t).forEach(x => { if (x.id != null) m[x.id] = qmForm(t) === 'table' ? { text: qmHead(x) } : qmC(x); }); return m; };   // trạng thái từng câu / hàng theo id

export const qmPick = t => { const o = {}; QM_L.forEach(k => { if (t.layout[k] !== undefined) o[k] = qmC(t.layout[k]); }); return o; };

// Gộp danh sách theo thứ tự hiện tại; phần tử của bản cất bị bộ chuyển đổi bỏ đi (không có trong "after") được chèn lại
export function qmList(saved, units, cur, mk) {
  const out = cur.map(x => { const th = saved.find(y => y.id === x.id); return th ? mk(th, x, units[x.id]) : x; });
  saved.forEach((th, i) => {
    if (units[th.id] !== undefined || out.some(x => x.id === th.id)) return;   // người dùng đã xóa, hoặc còn nguyên
    const prev = saved.slice(0, i).reverse().find(y => out.some(x => x.id === y.id));
    out.splice(prev ? out.findIndex(x => x.id === prev.id) + 1 : 0, 0, qmC(th));
  });
  return out;
}

export function qmRestore(t, q, P, whole) {
  const S = t.qmem && t.qmem[q]; if (!S || !S.after) return;
  const A = S.after, pre = qmC({ content: t.content, answer: t.answer, layout: t.layout });
  // 3 bên: theirs = bản cất của dạng q, base = trạng thái ngay sau khi rời q, ours = trạng thái trước lúc đổi về q (P);
  // trường người dùng chưa đụng từ lúc rời q (ours = base) thì lấy bản cất; đã sửa thì giữ kết quả chuyển đổi hiện tại (đã mang chỗ sửa theo)
  const pick3 = (th, ou, ba, cur) => qmEq(ou, ba) ? qmC(th) : cur;
  const obj3 = (th, ou, ba, cur) => { const o = {}; new Set([...Object.keys(th || {}), ...Object.keys(cur || {})]).forEach(k => { const v = pick3((th || {})[k], (ou || {})[k], (ba || {})[k], (cur || {})[k]); if (v !== undefined) o[k] = v; }); return o; };
  try {
    if (qmForm(t) !== S.form) return;
    // Chưa ai sửa gì từ lúc rời dạng này: trả lại nguyên bản cất (chính xác tuyệt đối, kể cả khi bộ chuyển đổi làm mất / tạo lại câu)
    if (whole || (qmEq(P.units, A.units) && qmEq(P.answer, A.answer) && qmEq(P.layout, A.layout) && qmEq(P.rest, A.rest))) {
      const keep = {}; ['lead'].forEach(k => { if (t.content[k] !== undefined) keep[k] = t.content[k]; });
      t.content = Object.assign(qmC(S.rest), S.form === 'list' ? { items: qmC(S.rows) } : { rows: qmC(S.rows), cols: qmC(S.cols), corner: S.corner }, S.formRaw !== undefined ? { form: S.formRaw } : {}, keep);
      t.answer = qmC(S.answer); QM_L.forEach(k => { if (S.layout[k] === undefined) delete t.layout[k]; else t.layout[k] = qmC(S.layout[k]); });
      if (qOf(t) !== q) throw new Error('qm');
      return;
    }
    if (S.form === 'list') t.content.items = qmList(S.rows, A.units, t.content.items || [], (th, x, ba) => { const pu = P.units[x.id]; return pu === undefined ? x : obj3(th, pu, ba, x); });
    else { t.content.cols = qmC(S.cols); t.content.corner = S.corner; t.content.rows = qmList(S.rows, A.units, t.content.rows || [], (th, x, ba) => { const r = qmC(th), pu = P.units[x.id]; if (ba && (!pu || qmHead(x) !== ba.text || (pu.text !== ba.text))) r.head = x.head; return r; }); }
    new Set([...Object.keys(S.rest), ...Object.keys(t.content)]).forEach(k => { if (QM_C.includes(k)) return; const v = pick3(S.rest[k], P.rest[k], A.rest[k], t.content[k]); if (v === undefined) delete t.content[k]; else t.content[k] = v; });
    const ans = obj3(S.answer, P.answer, A.answer, t.answer); ans.params = obj3((S.answer || {}).params, (P.answer || {}).params, (A.answer || {}).params, (t.answer || {}).params); t.answer = ans;
    QM_L.forEach(k => { const v = pick3(S.layout[k], P.layout[k], A.layout[k], t.layout[k]); if (v === undefined) delete t.layout[k]; else t.layout[k] = v; });
    if (qmForm(t) === 'table') ensureRowIds(t); else ensureIds(t);
    normAnswer(t);
    if (qOf(t) !== q) throw new Error('qm');   // gộp ra trạng thái không đúng dạng: bỏ, giữ kết quả chuyển đổi thường
  } catch (e) { t.content = pre.content; t.answer = pre.answer; t.layout = pre.layout; }
}

// Đổi dạng có nhớ: dùng ở cột trái / Inspector (qCmd 'q'); nhập file vẫn dùng setQ trần để không thêm dữ liệu nhớ
export function setQMem(t, q) {
  const q0 = qOf(t); if (!q0 || q0 === q || !QN[q] || qReasons(t)[q]) return setQ(t, q);
  const pre = qmRows(t).map(x => x.id), form0 = qmForm(t);
  // Dòng gốc: từ lúc rời dạng gốc tới giờ chỉ toàn đổi dạng, chưa ai sửa tay → quay về gốc thì trả nguyên bản cất của gốc
  const sigOf = () => JSON.stringify(qmC({ content: t.content, answer: t.answer, layout: t.layout })), lin = t.qmemLin, untouched = !!lin && lin.q === q0 && lin.sig === sigOf();
  const origin = untouched ? lin.origin : q0;
  const P = { units: qmUnits(t), answer: qmC(t.answer), layout: qmPick(t), rest: qmRest(t) };
  const S = { form: form0, formRaw: t.content.form, rows: qmC(qmRows(t)), cols: qmC(t.content.cols), corner: t.content.corner, rest: P.rest, answer: P.answer, layout: P.layout };
  if (!setQ(t, q)) return false;
  if (qmForm(t) !== form0) { const r = qmRows(t); if (r.length === pre.length && pre.every(x => x != null)) r.forEach((x, i) => { x.id = pre[i]; }); }   // giữ id câu khi đi qua Bảng
  S.after = { rest: qmRest(t), answer: qmC(t.answer), layout: qmPick(t), units: qmUnits(t) };
  t.qmem = t.qmem || {}; t.qmem[q0] = S;
  qmRestore(t, q, P, untouched && lin.origin === q);
  t.qmemLin = { q, origin, sig: sigOf() };
  return true;
}
