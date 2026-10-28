// src/core/model.js — tách nguyên văn từ v106 (app/scripts/tach-core.mjs). Không dùng trạng thái giao diện (chọn, cột trái, hoàn tác).

export const AGE = {
  '5-6':  { font: 16, line: 12, maxCols: 3 },
  '7-9':  { font: 14, line: 10, maxCols: 3 },
  '10-12':{ font: 12, line: 8,  maxCols: 4 }
};

// Cỡ chữ phiếu (v72): ba mức Nhỏ / Vừa / To theo độ tuổi, ghi rõ từng số pt. Mức To = cỡ chữ cũ của độ tuổi (không lưu vào phiếu).
export const SIZES = { s: 'Nhỏ', m: 'Vừa', l: 'To' };

export const PRESETS = {
  compact: { gapTask: 6,  padTask: 2, headGap: 2, groupGap: 3, itemGap: 3 },
  normal:  { gapTask: 8,  padTask: 3, headGap: 3, groupGap: 4, itemGap: 4 },
  airy:    { gapTask: 12, padTask: 4, headGap: 4, groupGap: 6, itemGap: 6 }
};

export const MINS = { gapTask: 4, padTask: 0, headGap: 1.5, groupGap: 2, itemGap: 2 };

export const AL = { A1: 'Dòng kẻ viết', A2: 'Ô trống', A3: 'Ô chữ cái', A4: 'Lựa chọn A/B/C', A5: 'Tick / số', A6: 'Cột T/F', A7: 'Chấm nối', A8: 'Dòng tô' };


/* ================= Trạng thái ================= */
/* ---- Schema 0.3: nội dung gom về hai form. content{form:'list'|'table', lead?, variant?, items[]} ----
   Mã dàn trang đọc thẳng hai form. "Kiểu" (questions, items, pairs…) chỉ là phân loại suy ra, không lưu. */
// 0.1/0.2 (content.kind) → 0.3
export function toForm(c) {
  if (c.kind === 'table') return { form: 'table', corner: c.corner, cols: c.cols, rows: c.rows };
  if (c.kind === 'picture') return { form: 'list', list: false, items: [] };   // bài chỉ có tranh = danh sách câu đang tắt, 0 câu
  if (c.kind === 'passage') return { form: 'list', lead: { kind: 'passage', text: c.text }, items: c.questions };
  if (c.kind === 'dialogue') return { form: 'list', lead: c.intro ? { kind: 'text', text: c.intro } : null, items: c.lines.map((l, i) => ({ id: 'l' + i, who: l.who, text: l.text })) };
  if (c.kind === 'trace') return { form: 'list', items: c.words.map((w, i) => ({ id: 'w' + i, text: w })) };
  if (c.kind === 'pairs') { const n = Math.max(c.left.length, c.right.length); return { form: 'list', items: Array.from({ length: n }, (_, i) => ({ id: 'p' + i, pair: { l: c.left[i] || null, r: c.right[i] || null } })) }; }
  if (c.kind === 'items') return { form: 'list', variant: c.variant, items: c.items };
  return { form: 'list', items: c.questions }; // questions
}

// Phân loại nội dung (suy ra, không lưu). A8 + danh sách chữ = tô chữ.
export function ckOf(c, A) {
  if (!c || c.form === 'table') return 'table';
  const it = c.list === false ? [] : (c.items || []), ld = c.lead;   // list:false = tắt danh sách câu (dữ liệu câu vẫn giữ)
  if (ld && ld.kind === 'passage') return 'passage';
  if (!it.length) return 'empty';                                      // 0 câu: chỉ có ảnh chung (không còn dạng "Tranh" riêng)
  if (it.some(x => x.pair)) return 'pairs';
  if (it.some(x => x.who != null) && !['A1', 'A4', 'A5', 'A6'].includes(A)) return 'dialogue';   // v81: người nói là thuộc tính câu; chỉ điền từ / không đáp án mới là hội thoại
  if (it.some(x => x.img || x.imgs)) return 'items';
  if (A === 'A8') return 'trace';
  return 'questions';
}

export const ck = t => ckOf(t.content, t.answer && t.answer.layout);

export const its = t => (t.content && t.content.list !== false && t.content.items) || [];

export const GAPP = /_{3,}/g, GAPLAB = /\(\s*[A-Za-z0-9]{1,2}\s*\)\s*$/, gapCount = x => (String(x).match(GAPP) || []).length;

export const clone = o => JSON.parse(JSON.stringify(o));

export const SCHEMA = 'ws-editor/0.3';

// Bố cục Task (schema 0.2). Khóa null hoặc vắng mặt = Tự động.
export const LAYOUT_DEF = () => ({ num: null, nlab: null, mbd: null, task: 'auto', split: null, cols: null, dir: null, align: null, valign: null, width: null, cw: null, rowH: null, whoW: null, colGap: null, break: null, frame: {}, cells: null, table: null });

export const F01 = { imageFit: 'fit', imageH: 'h', imageW: 'w', imageOx: 'ox', imageOy: 'oy', imageZoom: 'zoom', imageAlign: 'align', imageObj: 'obj' };

// Chuyển dữ liệu 0.1 sang 0.2 (đọc được cả hai)
export function migTask(t) {
  if (t.content && Array.isArray(t.content.rows)) ensureRowIds(t);
  if (t.content && t.content.kind) t.content = toForm(t.content);   // 0.1/0.2 → 0.3
  if (t.content && t.content.lead && t.content.lead.kind === 'picture') { delete t.content.lead; if (!(t.content.items || []).length) t.content.list = false; } // dạng "Tranh" cũ → danh sách câu tắt
  if (t.uploads) { const it = t.content.items || [], u = {}; Object.keys(t.uploads).forEach(k => { const m = /^([ip])(\d+)(?:\.(\d+))?$/.exec(k); if (m && it[+m[2]]) u['@' + it[+m[2]].id + (m[3] != null ? '.' + m[3] : '')] = t.uploads[k]; else u[k] = t.uploads[k]; }); t.uploads = u; } // ảnh tải lên: khóa theo id câu
  const l = t.layout || {}, n = LAYOUT_DEF();
  Object.keys(n).forEach(k => { if (l[k] != null && k !== 'frame' && k !== 'cells') n[k] = clone(l[k]); });
  if (l.frame) Object.assign(n.frame, clone(l.frame));
  if (l.cells) n.cells = clone(l.cells);
  if (l.ratio != null) n.split = l.ratio;
  if (l.cellDir) n.dir = l.cellDir;
  if (l.cellAlign) n.align = l.cellAlign;
  if (l.order) n.order = l.order;   // v81: câu hỏi trước bài đọc
  if (l.imgPct != null) n.imgPct = l.imgPct;   // v115: kích thước ảnh theo câu (% cả khối)
  if (l.imgFit) n.imgFit = l.imgFit;           // v115: ảnh vừa ô
  Object.keys(F01).forEach(k => { if (l[k] != null) n.frame[F01[k]] = l[k]; });
  if (t.image && t.image.scale != null) { if (t.image.scale !== 100 && n.frame.scale == null) n.frame.scale = t.image.scale; delete t.image.scale; }
  if (n.cells) Object.values(n.cells).forEach(c => { const f = c.frame || {}; Object.keys(F01).forEach(k => { if (c[k] != null) f[F01[k]] = c[k]; delete c[k]; }); if (c.ratio != null) c.split = c.ratio; delete c.ratio; if (Object.keys(f).length) c.frame = f; });
  if (ck(t) === 'pairs' && n.split != null) { const s = n.split; n.cw = [(100 - s) / 2, s, (100 - s) / 2]; n.split = null; }
  const tb = n.table;
  if (tb && tb.fill !== undefined) { if (tb.fh === undefined) tb.fh = tb.fill === 'head'; if (tb.fc === undefined) tb.fc = tb.fill === 'col'; if (tb.fr === undefined) tb.fr = tb.fill === 'zebra' ? 'zebra' : 'none'; delete tb.fill; }
  t.layout = n;
  t.spacing = t.spacing || { preset: null, overrides: {} };
  const p = t.answer.params = t.answer.params || {};
  if (p.perQ) { p.perItem = p.perItem || {}; Object.keys(p.perQ).forEach(q => { (p.perItem[q] = p.perItem[q] || {}).dir = p.perQ[q]; }); delete p.perQ; }
  pkMig(t);
  return t;
}

export function prune(o) { if (!o || typeof o !== 'object' || Array.isArray(o)) return o; Object.keys(o).forEach(k => { const v = o[k]; if (v == null) delete o[k]; else if (typeof v === 'object' && !Array.isArray(v)) { prune(v); if (!Object.keys(v).length) delete o[k]; } }); return o; }

export function tidy(t) {
  const L = t.layout; L.frame = prune(L.frame || {});
  if (L.cells) { prune(L.cells); if (!Object.keys(L.cells).length) L.cells = null; }
  if (Array.isArray(L.cw) && L.cw.every(x => x == null)) L.cw = null;
  if (L.table) { if (L.table.rhs) { prune(L.table.rhs); if (!Object.keys(L.table.rhs).length) L.table.rhs = null; } }
  prune(t.answer.params = t.answer.params || {});
  if (t.wordBank) ['w', 'align', 'valign'].forEach(k => { if (t.wordBank[k] == null) delete t.wordBank[k]; });
}

export function attachOpts(t) {
  const a = t.answer, q = ck(t) === 'questions';
  const gap = ck(t) === 'dialogue' || ((q || ck(t) === 'passage') && its(t).some(x => (x.text || '').includes('___')));   // v101: câu của Task có bài đọc cũng có chỗ trống ngay trong câu
  if (a.kind === 'word') return [...(gap ? ['inline'] : []), 'item', ...(q ? ['block'] : [])];
  if (a.kind === 'sentence') return ['item', ...(q ? ['block'] : [])];
  if (a.kind === 'choice') { const o = []; if (q && its(t).some(x => x.opts)) o.push('item'); if (hasMarkup(t)) o.push('inline'); return o.length ? o : [a.attach]; }
  return [a.attach];
}

export const KIND_A = { word: ['A2', 'A3'], sentence: ['A1', 'A2'], choice: ['A4'], tick: ['A5'], tf: ['A6'], match: ['A7'], trace: ['A8'], none: [] };

export function alOpts(t) {
  const a = t.answer; if (a.attach === 'inline') return a.kind === 'choice' ? ['A4'] : ['A2'];
  return ({ word: ['A2', 'A3'], sentence: ['A1', 'A2'], choice: ['A4'], tick: ['A5'], tf: ['A6'], match: ['A7'], trace: ['A8'], none: [] })[a.kind] || [];
}

export const keyParts = item => String(item.key ?? '').split(/\s*[,;]\s*/).map(x => x.trim()).filter(Boolean);

export const hasChoiceMarkup = s => /\{[^{}|]+(?:\|[^{}|]+)+\}/.test(s);

export function choiceTexts(t) { const k = ck(t); if (k === 'items') return its(t).flatMap(it => [...(it.lines || []), it.text || '']); if (k === 'questions') return its(t).map(x => x.text || ''); return []; }

export const hasMarkup = t => choiceTexts(t).some(hasChoiceMarkup) || !!((t.answer.params || {}).ulab && choiceTexts(t).some(x => /<u>/.test(x)));

// v89: vế đúng của chọn trong câu đánh dấu * ngay trong nhóm: {*goes|go}. Trước khi qua rich() đổi * thành \u0003 để không thành chữ nghiêng
export const PK_STAR = /^(\s*)\*(?!\*)/;

export const pkSrc = x => [x.text || '', ...(Array.isArray(x.lines) ? x.lines.map(l => typeof l === 'string' ? l : (l && l.text) || '') : [])].join('\n');

export function pkGroups(x) { return [...pkSrc(x).matchAll(/\{([^{}|]+(?:\|[^{}|]+)+)\}/g)].map(m => m[1].split('|').map(o => ({ t: o.replace(PK_STAR, '$1').trim(), ok: PK_STAR.test(o) }))); }

export function pkToggle(x, g, j) {
  let n = -1; const f = s => String(s).replace(/\{([^{}|]+(?:\|[^{}|]+)+)\}/g, (m, grp) => ++n !== g ? m : '{' + grp.split('|').map((o, k) => k !== j ? o : PK_STAR.test(o) ? o.replace(PK_STAR, '$1') : o.replace(/^(\s*)/, '$1*')).join('|') + '}');
  if (x.text != null) x.text = f(x.text);
  if (Array.isArray(x.lines)) x.lines = x.lines.map(l => typeof l === 'string' ? f(l) : l && l.text != null ? Object.assign(l, { text: f(l.text) }) : l);
}

// Phiếu cũ: key là chữ của vế đúng → đổi sang dấu * khi khớp đúng một vế ở mỗi nhóm; còn nhóm không khớp thì giữ key
export function pkMig(t) {
  (t.content && t.content.items || []).forEach(x => {
    const k = String(x.key ?? '').trim(); if (!k || x.opts || x.imgs) return; const gs = pkGroups(x); if (!gs.length || gs.some(g => g.some(o => o.ok))) return;
    const parts = keyParts(x).map(v => v.toLowerCase()); let all = true;
    gs.forEach((g, gi) => { const hit = g.map((o, j) => parts.includes(o.t.toLowerCase()) ? j : -1).filter(j => j >= 0); if (hit.length === 1) pkToggle(x, gi, hit[0]); else all = false; });
    if (all) { if (x.ex) x.key = ''; else delete x.key; }
  });
}

/* ---- G-Text: khối tự do của Task (v73). Chữ: đoạn, gạch đầu dòng (- ), số (1. ), **đậm**, *nghiêng* ---- */
export const GT_SIZE = { s: 'Nhỏ', m: 'Vừa', l: 'To' };


/* ================= 0b–0c: đặc điểm nội dung, công thức dạng bài, thẻ dạng bài ================= */
// Đặc điểm của một Task, suy ra từ dữ liệu (không lưu). Công thức và thẻ dạng bài chỉ đọc các đặc điểm này.
export function featOf(t) {
  const k = ck(t), c = t.content, it = its(t), a = t.answer;
  const f = { form: k, ans: a.kind, A: a.layout || null, img: !!t.image, bank: !!t.wordBank };
  if (k === 'items') f.variant = c.variant || 'single';
  if (c.form === 'table') { const cells = (c.rows || []).flatMap(r => r.cells || []); f.cells = cells.some(x => x && x.tick) ? 'tick' : cells.some(x => x === '' || (x && x.ans != null)) ? 'blank' : 'text'; }
  else {
    const tx = x => [x.text || '', ...(x.lines || [])].join('\n');
    f.opts = it.some(x => x.opts && x.opts.length);
    f.gap = it.some(x => tx(x).includes('___'));
    f.mark = it.some(x => hasChoiceMarkup(tx(x)));
    f.lines = it.some(x => x.lines);
  }
  return f;
}

export const FEAT_NAME = { form: 'kiểu nội dung', variant: 'ảnh lựa chọn', ans: 'loại đáp án', A: 'kiểu đáp án', img: 'ảnh chung', bank: 'khung từ', opts: 'lựa chọn A/B/C', gap: 'chỗ trống ___', mark: 'chọn trong câu {a|b}', lines: 'ô nhiều dòng', cells: 'kiểu ô bảng' };

export const FORM_NAME = { questions: 'danh sách câu', items: 'câu có ảnh', pairs: 'cặp nối', dialogue: 'hội thoại', trace: 'từ để tô', passage: 'bài đọc + câu hỏi', empty: 'chỉ có ảnh', table: 'bảng' };

export const KIND_NAME = { word: 'viết từ', sentence: 'viết câu', choice: 'chọn đáp án', tick: 'tick', tf: 'Đúng/Sai', match: 'nối', trace: 'tô chữ', none: 'không có' };

export const CELL_NAME = { text: 'chữ', blank: 'ô trống để viết', tick: 'ô tick' };

export function featVal(k, v) {
  if (Array.isArray(v)) return v.map(x => featVal(k, x)).join(' hoặc ');
  if (k === 'form') return FORM_NAME[v] || v; if (k === 'ans') return KIND_NAME[v] || v; if (k === 'A') return v ? AL[v] : 'không có';
  if (k === 'cells') return CELL_NAME[v] || v; if (k === 'variant') return v === 'multi' ? 'nhiều ảnh/câu' : '1 ảnh/câu';
  return v ? 'có' : 'không';
}

/* Công thức dạng bài: CHỈ LÀ DỮ LIỆU. Thêm công thức = thêm một dòng ở đây, không sửa mã.
   sig: đặc điểm bắt buộc (giá trị mảng = một trong các giá trị). make: Task mẫu khi tạo mới.
   13 mẫu, chia 5 nhóm (group). Bảng chỉ có 1 mẫu: kiểu ô do nội dung ô quyết định. */
export const RECIPES = [
  { id: 'answer-q', group: 'Danh sách câu', name: 'Trả lời câu hỏi', desc: 'Câu hỏi + dòng kẻ để viết câu trả lời.', icon: 'T6',
    sig: { form: 'questions', ans: 'sentence' },
    make: { title: 'Answer the questions.', instruction: 'Write full sentences.', content: { form: 'list', items: [{ text: '?' }, { text: '?' }, { text: '?' }] }, answer: { kind: 'sentence', attach: 'item', layout: 'A1', params: { lines: 1 } } } },
  { id: 'choose-abc', group: 'Danh sách câu', name: 'Chọn A/B/C', desc: 'Mỗi câu có các lựa chọn A, B, C.', icon: 'T6',
    sig: { form: ['questions', 'passage'], ans: 'choice', opts: true, mark: false },
    make: { title: 'Choose the correct answer.', instruction: 'Circle A, B or C.', content: { form: 'list', items: [{ text: '', opts: ['', '', ''] }, { text: '', opts: ['', '', ''] }, { text: '', opts: ['', '', ''] }] }, answer: { kind: 'choice', attach: 'item', layout: 'A4', params: { dir: 'auto' } } } },
  { id: 'gap-fill', group: 'Danh sách câu', name: 'Điền chỗ trống', desc: 'Câu có chỗ trống ___; có thể kèm khung từ.', icon: 'T6',
    sig: { form: 'questions', ans: 'word', gap: true },
    make: { title: 'Complete the sentences.', instruction: 'Write one word in each gap.', content: { form: 'list', items: [{ text: 'I like ___.' }, { text: 'She is ___.' }, { text: 'We go to ___.' }] }, answer: { kind: 'word', attach: 'inline', layout: 'A2', params: { lenMode: 'fill', lines: 1, start: 'inline' } } } },
  { id: 'choose-inline', group: 'Danh sách câu', name: 'Chọn trong câu {a|b}', desc: 'Lựa chọn nằm ngay trong câu; gạch chân hoặc khoanh từ đúng.', icon: 'T6',
    sig: { form: ['questions', 'items'], ans: 'choice', mark: true },
    make: { title: 'Read and underline.', instruction: 'Underline the correct word.', content: { form: 'list', items: [{ text: 'It is {big|small}.' }, { text: 'I {am|is} happy.' }] }, answer: { kind: 'choice', attach: 'inline', layout: 'A4' } } },
  { id: 'true-false', group: 'Danh sách câu', name: 'Đúng/Sai', desc: 'Mỗi câu khoanh T hoặc F; có thể kèm tranh hoặc bài đọc.', icon: 'T4',
    sig: { form: ['questions', 'passage'], ans: 'tf' },
    make: { title: 'True or False?', instruction: 'Circle T (true) or F (false).', content: { form: 'list', items: [{ text: '' }, { text: '' }, { text: '' }] }, answer: { kind: 'tf', attach: 'item', layout: 'A6' } } },
  { id: 'read-answer', group: 'Danh sách câu', name: 'Đọc và trả lời', desc: 'Bài đọc (có thể kèm ảnh) + câu hỏi.', icon: 'T8',
    sig: { form: 'passage', ans: ['sentence', 'word'] },
    make: { title: 'Read and answer.', instruction: 'Read the text. Answer the questions.', content: { form: 'list', lead: { kind: 'passage', text: '' }, items: [{ text: '?' }, { text: '?' }] }, answer: { kind: 'sentence', attach: 'item', layout: 'A1', params: { lines: 1 } } } },
  { id: 'trace', group: 'Danh sách câu', name: 'Tô chữ', desc: 'Mỗi từ lặp lại vài lần để tô.', icon: 'T6',
    sig: { form: 'trace', ans: 'trace' },
    make: { title: 'Trace the words.', instruction: 'Say the word. Then trace it.', content: { form: 'list', items: [{ text: '' }, { text: '' }, { text: '' }] }, answer: { kind: 'trace', attach: 'item', layout: 'A8', params: { repeat: 3 } } } },
  { id: 'look-write', group: 'Ảnh mỗi câu', name: 'Nhìn tranh viết từ', desc: 'Mỗi câu một ảnh; học sinh viết từ.', icon: 'T5',
    sig: { form: 'items', variant: 'single', ans: 'word', mark: false },
    make: { title: 'Look and write.', instruction: 'Write the word.', content: { form: 'list', variant: 'single', items: [{ img: 'ảnh 1', len: 4 }, { img: 'ảnh 2', len: 4 }, { img: 'ảnh 3', len: 4 }] }, answer: { kind: 'word', attach: 'item', layout: 'A2' } } },
  { id: 'listen-tick', group: 'Ảnh mỗi câu', name: 'Nghe và tick ảnh', desc: 'Mỗi câu có vài ảnh lựa chọn; tick ảnh đúng.', icon: 'T5',
    sig: { form: 'items', variant: 'multi', ans: 'tick' },
    make: { title: 'Listen and tick.', instruction: 'Tick the correct picture.', audio: 'Track', content: { form: 'list', variant: 'multi', items: [{ text: '', imgs: ['a', 'b', 'C'] }, { text: '', imgs: ['A', 'B', 'C'] }] }, answer: { kind: 'tick', attach: 'item', layout: 'A5' } } },
  { id: 'match', group: 'Riêng', name: 'Nối', desc: 'Vế trái (chữ hoặc ảnh) nối với vế phải.', icon: 'T7',
    sig: { form: 'pairs', ans: 'match' },
    make: { title: 'Match.', instruction: 'Draw lines.', content: { form: 'list', items: [{ pair: { l: { text: '' }, r: { text: '' } } }, { pair: { l: { text: '' }, r: { text: '' } } }, { pair: { l: { text: '' }, r: { text: '' } } }] }, answer: { kind: 'match', attach: 'item', layout: 'A7' } } },
  { id: 'dialogue', group: 'Riêng', name: 'Hội thoại', desc: 'Các lượt thoại có người nói; chỗ trống ___ tự đánh số.', icon: 'T6',
    sig: { form: 'dialogue', ans: 'word' },
    make: { title: 'Complete the conversation.', instruction: 'Write one word in each gap.', content: { form: 'list', items: [{ who: 'A', text: 'Hello!' }, { who: 'B', text: '___' }, { who: 'A', text: '' }, { who: 'B', text: '___' }] }, answer: { kind: 'word', attach: 'inline', layout: 'A2', params: { lenMode: 'fill', lines: 1, start: 'inline' } } } },
  { id: 'colour-draw', group: 'Chỉ có ảnh', name: 'Tô màu / vẽ', desc: 'Một ảnh lớn, không có câu (danh sách câu tắt). Bật lại danh sách để thêm câu.', icon: 'T1',
    sig: { form: 'empty' },
    make: { title: 'Listen and colour.', instruction: 'Colour the picture.', image: { label: 'tranh', size: 'large' }, content: { form: 'list', list: false, items: [] }, answer: { kind: 'none', attach: 'item', layout: null } } },
  { id: 'table', group: 'Bảng', name: 'Bảng', desc: 'Ô có chữ, ô trống để viết (để trống) hoặc ô tick (✓): do nội dung từng ô quyết định. Bảng dài tự cắt trang.', icon: 'T9',
    sig: { form: 'table' },
    make: { title: 'Complete the table.', instruction: 'Write one or two words.', content: { form: 'table', corner: '', cols: ['', ''], rows: [{ head: '', cells: ['', ''] }, { head: '', cells: ['', ''] }, { head: '', cells: ['', ''] }] }, answer: { kind: 'none', attach: 'item', layout: null } } }
];

export const sigOk = (want, have) => Array.isArray(want) ? want.includes(have) : want === have;

// Công thức của Task: khớp đủ = tên công thức; không khớp = gần nhất ("Tùy biến, gốc: X") + các chỗ khác
export function recipeMatch(t) {
  const f = featOf(t);
  const sc = RECIPES.map(r => { const ks = Object.keys(r.sig), miss = ks.filter(k => !sigOk(r.sig[k], f[k])); return { r, miss, n: ks.length }; });
  const ex = sc.filter(x => !x.miss.length).sort((a, b) => b.n - a.n)[0];
  if (ex) return { r: ex.r, exact: true, diffs: [] };
  // gần nhất: ưu tiên cùng kiểu nội dung, rồi ít chỗ khác nhất
  const near = sc.sort((a, b) => (a.miss.includes('form') - b.miss.includes('form')) || (a.miss.length - b.miss.length) || (b.n - a.n))[0];
  return { r: near.r, exact: false, diffs: near.miss.map(k => `${FEAT_NAME[k]}: ${featVal(k, f[k])} (gốc: ${featVal(k, near.r.sig[k])})`) };
}


/* ================= Bước 1–2: soạn nội dung trong cột trái, thao tác cấp Task ================= */
// Loại đáp án dùng được theo nội dung, và mặc định khi chọn
export const ANS_DEF = {
  word: { attach: 'item', layout: 'A2', params: { lenMode: 'fill', lines: 1, start: 'inline' } },
  sentence: { attach: 'item', layout: 'A1', params: { lines: 1 } },
  choice: { attach: 'item', layout: 'A4', params: { dir: 'auto' } },
  tick: { attach: 'item', layout: 'A5', params: {} }, tf: { attach: 'item', layout: 'A6', params: {} },
  match: { attach: 'item', layout: 'A7', params: {} }, trace: { attach: 'item', layout: 'A8', params: { repeat: 3 } },
  none: { attach: 'item', layout: null, params: {} }
};

export function kindsOk(t) {
  const c = t.content; if (c.form === 'table') return ['none'];
  const k = ck(t);
  if (k === 'empty') return ['none'];
  if (k === 'dialogue') return ['word', 'none'];
  if (k === 'items') return c.variant === 'multi' ? ['tick', 'none'] : ['word', 'sentence', 'choice', 'tick', 'none'];
  if (k === 'passage') return ['sentence', 'word', 'choice', 'tf', 'none'];
  return ['word', 'sentence', 'choice', 'tick', 'tf', 'match', 'trace', 'none']; // danh sách câu (match = bật vế ghép)
}

// Giữ đáp án hợp lệ sau khi nội dung đổi (gắn, kiểu A)
export function normAnswer(t) {
  const a = t.answer, ok = kindsOk(t);
  if (!ok.includes(a.kind)) { const k = ok[0]; Object.assign(a, clone(ANS_DEF[k]), { kind: k }); }
  if (a.kind === 'none') { a.layout = null; return; }
  const att = attachOpts(t); if (!att.includes(a.attach)) a.attach = att[0];
  const al = alOpts(t); if (!al.includes(a.layout)) a.layout = al[0];
  if (a.kind === 'word' && a.attach === 'inline' && ck(t) !== 'dialogue' && !its(t).some(x => (x.text || '').includes('___'))) a.attach = 'item';
  // v101: mọi câu đều có chỗ trống ___ ngay trong chữ (kể cả đoạn văn nhiều chỗ trống): chỗ trống là chỗ trả lời, không thêm dòng kẻ sau câu
  if (a.kind === 'word' && a.attach === 'item' && ['questions', 'passage'].includes(ck(t)) && a.layout === 'A2' && its(t).filter(x => !x.ex && !x.gt).length && its(t).filter(x => !x.ex && !x.gt).every(x => gapCount(x.text || '') >= 2 || /_{3,}\s*[^\s_.?!]/.test(x.text || ''))) a.attach = 'inline';   // chỗ trống thật trong chữ (không phải một gạch ở cuối câu hỏi)
}

// id mới không trùng trong Task / phiếu
export function newId(used, pre) { let n = 1; while (used.has(pre + n)) n++; used.add(pre + n); return pre + n; }

// Hàng bảng có id để khóa ảnh tải lên đi theo hàng khi thêm / xóa hàng
export function ensureRowIds(t) { const c = t.content; if (!c || !Array.isArray(c.rows)) return; const used = new Set(c.rows.map(r => r.id).filter(Boolean)); c.rows.forEach(r => { if (!r.id) r.id = newId(used, 'r'); }); }

export function ensureIds(t) { const used = new Set(its(t).map(x => x.id).filter(Boolean)); its(t).forEach(x => { if (!x.id) x.id = newId(used, 'q'); }); }

/* ================= Nhập file, lớp B (P0): bù trường thiếu, đọc JSON, kiểm tra trước khi đưa vào phiếu =================
   Mọi nguồn (JSON, MD, chữ thô) đều qua đây. Không bao giờ ghi đè Task có sẵn; lỗi không đổi phiếu đang mở. */
export const IMP_MAX = 40, IMP_MAX_CH = 8e6;

export const isObj = o => !!o && typeof o === 'object' && !Array.isArray(o);

export const sv = v => v == null ? '' : typeof v === 'string' ? v : String(v);

export const L2KIND = { A1: 'sentence', A2: 'word', A3: 'word', A4: 'choice', A5: 'tick', A6: 'tf', A7: 'match', A8: 'trace' };

// Bù trường cho một Task lấy từ JSON ngoài. notes: danh sách việc đã bù (để báo). Ném lỗi khi Task không dùng được.
export function fillTask(t0, notes) {
  if (!isObj(t0)) throw new Error('không phải đối tượng Task');
  const t = clone(t0), add = m => { if (notes && !notes.includes(m)) notes.push(m); };
  t.id = sv(t.id).trim() || 't'; t.title = sv(t.title); t.instruction = sv(t.instruction);
  t.audio = t.audio == null || t.audio === '' ? null : sv(t.audio);
  if (typeof t.image === 'string') t.image = t.image ? { label: t.image, size: 'medium' } : null;
  if (t.image != null && !isObj(t.image)) { t.image = null; add('bỏ ảnh chung không hợp lệ'); }
  if (t.image) { t.image.label = sv(t.image.label) || 'ảnh'; if (!['small', 'medium', 'large'].includes(t.image.size)) t.image.size = 'medium';
    if (t.image.marks != null) { if (Array.isArray(t.image.marks)) t.image.marks = t.image.marks.filter(m => isObj(m) && isFinite(parseFloat(m.x)) && isFinite(parseFloat(m.y))).slice(0, 20).map(m => ({ x: Math.max(0, Math.min(100, Math.round(parseFloat(m.x) * 10) / 10)), y: Math.max(0, Math.min(100, Math.round(parseFloat(m.y) * 10) / 10)) })); else { delete t.image.marks; add('điểm trên ảnh không hợp lệ'); } }
    if (t.image.mk != null) { const k = t.image.mk, o = {}; if (isObj(k)) { if (k.shape === 'square') o.shape = 'square'; if (k.label === 'none') o.label = 'none'; } if (Object.keys(o).length) t.image.mk = o; else delete t.image.mk; } }
  if (Array.isArray(t.wordBank)) t.wordBank = { words: t.wordBank };
  if (t.wordBank != null && !(isObj(t.wordBank) && Array.isArray(t.wordBank.words))) { t.wordBank = null; add('bỏ khung từ không hợp lệ'); }
  if (t.wordBank) { const b = t.wordBank; b.words = b.words.map(sv).filter(x => x.trim()); if (b.placement != null && !['top', 'right', 'bottom'].includes(b.placement)) b.placement = 'top'; if (b.kind != null && b.kind !== 'image') { delete b.kind; add('khung từ: loại lạ → chữ'); } if (b.kind === 'image') { if (b.ar != null && !/^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(String(b.ar))) delete b.ar; if (b.cols != null && !(Number.isInteger(b.cols) && b.cols >= 1 && b.cols <= 8)) delete b.cols; if (b.cap !== false) delete b.cap; } else ['ar', 'cols', 'cap'].forEach(k => delete b[k]); if (b.style != null && !['chips', 'list'].includes(b.style)) b.style = 'chips'; if (b.label != null && !['lower', 'upper', 'none'].includes(b.label)) b.label = 'lower'; }
  let c = t.content;
  if (!isObj(c)) { c = t.content = { form: 'list', items: [] }; add('thiếu nội dung'); }
  const arr = k => { if (!Array.isArray(c[k])) c[k] = []; return c[k]; };
  if (c.kind) {          // dữ liệu 0.1/0.2: chỉ bù mảng thiếu, migTask chuyển sang 0.3
    const K = { questions: ['questions'], items: ['items'], pairs: ['left', 'right'], trace: ['words'], dialogue: ['lines'], passage: ['questions'], table: ['cols', 'rows'], picture: [] }[c.kind];
    if (!K) throw new Error(`nội dung kiểu "${c.kind}" không đọc được`);
    K.forEach(arr); if (c.kind === 'passage') c.text = sv(c.text);
  }
  if (c.kind === 'table' || (!c.kind && c.form === 'table')) {
    c.cols = arr('cols').map(sv); c.rows = arr('rows').map(r => Array.isArray(r) ? { head: sv(r[0]), cells: r.slice(1) } : isObj(r) ? r : { head: sv(r), cells: [] });
    const n = Math.max(1, c.cols.length, ...c.rows.map(r => Array.isArray(r.cells) ? r.cells.length : 0));
    while (c.cols.length < n) c.cols.push('');
    c.rows.forEach(r => { r.cells = Array.isArray(r.cells) ? r.cells : []; while (r.cells.length < n) r.cells.push(''); r.cells = r.cells.map(v => v == null ? '' : isObj(v) ? v : sv(v)); r.head = r.head == null ? '' : isObj(r.head) ? r.head : sv(r.head); });
    c.corner = sv(c.corner);
  } else if (!c.kind) {
    if (c.form !== 'list') { if (c.form != null) add(`nội dung "${sv(c.form)}" → danh sách câu`); c.form = 'list'; }
    if (!Array.isArray(c.items)) { if (c.items != null) add('danh sách câu không hợp lệ'); c.items = []; }
    c.items = c.items.map(x => typeof x === 'string' ? { text: x } : isObj(x) ? x : { text: sv(x) });
    c.items.forEach(x => {
      if (x.text != null && typeof x.text !== 'string') x.text = sv(x.text);
      if (x.who != null) x.who = sv(x.who);
      ['opts', 'imgs', 'lines'].forEach(k => { if (x[k] != null) { if (Array.isArray(x[k])) x[k] = x[k].map(sv); else delete x[k]; } });
      if (x.img != null && typeof x.img !== 'string') x.img = sv(x.img);
      if (x.pair != null && !isObj(x.pair)) delete x.pair;
    });
    if (c.lead != null && !(isObj(c.lead) && ['passage', 'text', 'picture'].includes(c.lead.kind))) { delete c.lead; add('bỏ phần dẫn không hợp lệ'); }
    if (c.lead && c.lead.keys != null) { if (Array.isArray(c.lead.keys)) { c.lead.keys = c.lead.keys.map(sv).filter(x => x.trim()); if (!c.lead.keys.length) delete c.lead.keys; } else { delete c.lead.keys; add('đáp án chỗ trống không hợp lệ'); } }
    if (c.lead && c.lead.kind !== 'picture') c.lead.text = sv(c.lead.text);
  }
  if (!isObj(t.answer)) { t.answer = { kind: 'none' }; add('thiếu đáp án'); }
  const a = t.answer;
  if (a.layout != null && !AL[a.layout]) a.layout = null;
  if (!KIND_A[a.kind]) a.kind = L2KIND[a.layout] || 'none';
  if (!['item', 'inline', 'block'].includes(a.attach)) a.attach = 'item';
  if (!isObj(a.params)) a.params = {};
  if (a.layout === undefined) a.layout = null;
  if (!isObj(t.layout)) t.layout = {};
  if (!isObj(t.spacing) || !(t.spacing.preset == null || PRESETS[t.spacing.preset] || t.spacing.preset === 'free')) t.spacing = { preset: null, overrides: {} };
  if (!isObj(t.spacing.overrides)) t.spacing.overrides = {};
  Object.keys(t.spacing.overrides).forEach(k => { if (!(k in MINS) || typeof t.spacing.overrides[k] !== 'number') delete t.spacing.overrides[k]; });
  ['uploads', 'upMeta', 'imgAr', 'qr'].forEach(k => { if (t[k] != null && !isObj(t[k])) delete t[k]; });
  delete t.number; delete t.part;
  if (t.extras != null) {
    if (!Array.isArray(t.extras)) { delete t.extras; add('bỏ khối tự do không hợp lệ'); }
    else {
      const used = new Set(); t.extras = t.extras.filter(x => { if (!isObj(x)) { add('bỏ khối tự do không hợp lệ'); return false; } if (!['text', 'image'].includes(x.kind)) { add(`khối tự do loại "${sv(x.kind)}" chưa hỗ trợ, đã bỏ`); return false; } return true; }).map(x => {
        const img = x.kind === 'image', o = { id: sv(x.id).trim(), kind: x.kind, pos: x.pos === 'top' ? 'top' : 'bottom' };
        if (img) { o.label = sv(x.label) || 'ảnh'; if (typeof x.w === 'number' && x.w >= 20 && x.w <= 100) o.w = x.w; else if (x.w != null) add('độ rộng ảnh khối tự do không hợp lệ'); if (Number.isInteger(x.n) && x.n >= 2 && x.n <= 4) o.n = x.n; else if (x.n != null && x.n !== 1) add('số ảnh khối tự do không hợp lệ'); } else o.text = sv(x.text);
        if (!o.id || used.has(o.id)) o.id = newId(used, 'x'); else used.add(o.id);
        if (!img && GT_SIZE[x.size]) o.size = x.size; else if (!img && x.size != null) add('cỡ chữ khối tự do không hợp lệ');
        if (['center', 'right'].includes(x.align)) o.align = x.align;
        if (!img && x.cols === 2) o.cols = 2;
        if (!img && ['line', 'fill', 'both'].includes(x.frame)) o.frame = x.frame;
        return o;
      });
      if (!t.extras.length) delete t.extras;
    }
  }
  migTask(t); ensureIds(t); ensureRowIds(t);
  const a0 = JSON.stringify(t.answer); normAnswer(t); if (JSON.stringify(t.answer) !== a0) add('đáp án chỉnh cho hợp nội dung');
  tidy(t);
  if (!sv(t.typeId).trim()) { const m = recipeMatch(t); t.typeId = m.exact ? m.r.id : 'custom'; }
  t.typeName = sv(t.typeName);
  return t;
}

// Bù trường cấp phiếu (schema, id, tên, tuổi, trang, khoảng cách, xếp trang) + từng Task; id Task không trùng.
export function fillSheet(o0, notes) {
  if (!isObj(o0)) throw new Error('không phải phiếu');
  if (!Array.isArray(o0.tasks)) throw new Error('thiếu danh sách tasks');
  if (o0.tasks.length > IMP_MAX) throw new Error(`phiếu có ${o0.tasks.length} Task, nhiều hơn giới hạn ${IMP_MAX}`);
  const o = clone(o0), add = m => { if (notes && !notes.includes(m)) notes.push(m); };
  o.id = sv(o.id).trim() || ('ws-' + Date.now().toString(36)); o.title = sv(o.title).trim() || 'Phiếu mới';
  if (!AGE[o.age]) { add('độ tuổi'); o.age = '7-9'; }
  if (!isObj(o.page)) { add('khổ trang'); o.page = { size: 'A4', marginMm: { top: 14, right: 14, bottom: 14, left: 14 } }; }
  if (!isObj(o.spacing) || !(PRESETS[o.spacing.preset] || o.spacing.preset === 'free')) { add('khoảng cách'); o.spacing = { preset: 'compact', overrides: {} }; }   // v85: phiếu không ghi khoảng cách → Gọn
  if (!isObj(o.spacing.overrides)) o.spacing.overrides = {};
  if (!['cont', 'page'].includes(o.flow)) { add('xếp trang'); o.flow = 'cont'; }
  if (o.fill !== true) delete o.fill;
  if (o.font != null && (!FONTS[o.font] || o.font === 'andika')) { if (o.font !== 'andika') add('font không có trong danh sách'); delete o.font; }
  if (o.size != null && (!SIZES[o.size] || o.size === 'm')) { if (o.size !== 'm') add('cỡ chữ không hợp lệ'); delete o.size; }
  const used = new Set();
  o.tasks = o.tasks.map((t, i) => { let x; try { x = fillTask(t, notes); } catch (e) { throw new Error(`Task ${i + 1}: ${e.message}`); } if (used.has(x.id)) x.id = newId(used, 't'); else used.add(x.id); return x; });
  o.schema = SCHEMA;
  return o;
}

// Font chữ của phiếu (v69): chỉ đổi font của trang A4, giao diện giữ nguyên
export const FONTS = {
  andika: { name: 'Andika', css: '"Andika", "Comic Sans MS", "Trebuchet MS", sans-serif', hint: 'Font hiện tại: chữ a, g đơn giản như sách tập đọc, dễ phân biệt cho trẻ mới học.' },
  be: { name: 'Be Vietnam Pro', css: '"Be Vietnam Pro", "Segoe UI", system-ui, sans-serif', hint: 'Font trong ảnh bạn gửi: gọn, hiện đại, dấu tiếng Việt rõ.' },
  lexend: { name: 'Lexend', css: '"Lexend", "Be Vietnam Pro", system-ui, sans-serif', hint: 'Font thiết kế cho dễ đọc, giãn chữ rộng hơn; hợp học sinh đọc còn chậm.' }
};

export const QN = { Q1: 'Điền từ', Q2: 'Viết câu', Q3: 'Chọn A/B/C', Q4: 'Chọn trong câu', Q5: 'Đúng / Sai', Q6: 'Nhìn ảnh viết', Q7: 'Chọn ảnh', Q8: 'Nối', Q9: 'Tô chữ', Q10: 'Bảng', Q11: 'Lưới', Q12: 'Viết tự do' };

export const isFreeW = t => { const it = its(t); return it.length === 1 && !String(it[0].text || '').trim() && !it[0].opts && !it[0].img && t.layout.num === 'off'; };

export const isGridTbl = t => { const o = t.layout.table || {}; return !!o.cross || (o.head === false && o.rowHead === false); };

export function qDerived(t) {
  const k = ck(t), a = t.answer;
  if (k === 'table') return isGridTbl(t) ? 'Q11' : 'Q10';
  if (k === 'empty') return null;
  if (k === 'pairs') return 'Q8';
  if (k === 'items') return t.content.variant === 'multi' ? 'Q7' : 'Q6';
  if (k === 'trace' || a.kind === 'trace') return 'Q9';
  if (a.kind === 'tf' || a.kind === 'tick') return 'Q5';
  if (a.kind === 'choice') return a.attach === 'inline' ? 'Q4' : 'Q3';
  if (a.kind === 'match') return 'Q8';
  if (a.kind === 'sentence') return isFreeW(t) ? 'Q12' : 'Q2';
  if (a.kind === 'word') return 'Q1';
  return null;
}

// t.q chỉ giữ khi không suy ra được (Task không có chỗ trả lời)
export function qTidy(t) { if (t.q && (!QN[t.q] || qDerived(t) === t.q || (qDerived(t) && t.answer.kind !== 'none'))) delete t.q; }

tidy = (f => t => { f(t); qTidy(t); })(tidy);

// T/F: chỉ số nhãn ứng với đáp án (dùng cho máy chấm và câu ví dụ in sẵn)
const TF_ALIAS = { true: 't', false: 'f', 'đúng': 't', sai: 'f', yes: 'yes', no: 'no', right: 'right', wrong: 'wrong' };
// v113: đáp án T/F ghi khác nhãn (T với True/False, Đúng với Yes/No…): khớp theo nghĩa đúng / sai, rồi theo chữ cái đầu của nhãn
const TF_POS = ['t', 'true', 'đúng', 'đ', 'd', 'y', 'yes', 'r', 'right', 'correct', '✓'], TF_NEG = ['f', 'false', 'sai', 's', 'n', 'no', 'w', 'wrong', 'incorrect', '✗'];
export function tfIndex(labs, key) {
  const L = String(key ?? '').trim().toLowerCase().replace(/[.)]$/, ''), al = TF_ALIAS[L] || L, lw = labs.map(l => String(l).trim().toLowerCase());
  let j = lw.findIndex(v => v === al || v === L); if (j >= 0) return j;
  for (const side of [TF_POS, TF_NEG]) if (side.includes(L)) { j = lw.findIndex(v => side.includes(v)); if (j >= 0) return j; }
  const one = lw.filter(v => v[0] === L[0]); return L.length === 1 && one.length === 1 ? lw.indexOf(one[0]) : -1;
}
