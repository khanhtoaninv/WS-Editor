// GĐ0 phiếu tương tác: liệt kê CHỖ TRẢ LỜI (khối đề) và ĐÁP ÁN (khối đáp án) của một Task / cả phiếu,
// theo chuẩn gói wsp/0 (docs/TUONG_TAC/2_CHUAN_GOI_PHIEU.md mục 5, 6). Hàm thuần, chỉ đọc dữ liệu, không đụng DOM.
// Mã chỗ trả lời: "<task>.<item>" (câu một chỗ) · "<task>.<item>.<n>" (chỗ thứ n trong câu) · "<task>.lead.<n>" (chỗ trống bài đọc)
// · "<task>.leadc.<n>" (chọn {a|b} trong bài đọc) · "<task>.cell.<hàng>.<cột>" (ô bảng / ô chữ). Bài nối: "<task>.<item vế trái>".
// Không đoán: câu thiếu đáp án thì chuyển chấm tay và ghi cảnh báo; dạng chưa hỗ trợ thì ghi "chỉ xem".
import { QN, ck, gapCount, isFreeW, isGridTbl, its, keyParts, pkGroups, pkSrc, qDerived } from './model.js';
import { crossCell, exPicks, keyGaps, leadText, nlab, qnum, tblOpts } from './layout.js';
import { gapN } from './answers.js';

// Đáp án chữ: nhiều đáp án đúng cho một chỗ viết cách nhau " / " (có dấu cách hai bên): "isn't / is not"
export const altSplit = s => String(s ?? '').split(/\s+\/\s+/).map(x => x.trim()).filter(Boolean);
const LET = 'abcdefgh';
const optsOf = list => list.map((o, i) => ({ id: LET[i] || String(i), text: String(o).replace(/<[^>]+>|\u0003/g, '').replace(/^\s*\*(?!\*)/, '').trim() }));
const imgOpts = list => list.map((o, i) => ({ id: LET[i] || String(i), img: String(o) }));
const TF_ALIAS = { true: 't', false: 'f', 'đúng': 't', sai: 'f', yes: 'yes', no: 'no', right: 'right', wrong: 'wrong' };

function taskSlots0(t) {
  const slots = [], key = {}, notes = [], miss = [], k = ck(t), a = t.answer || {}, p = a.params || {}, q = qDerived(t) || t.q || null, tid = t.id;
  const add = (id, label, interaction, k0, extra = {}) => {
    const s = Object.assign({ id, task: tid, label: String(label), q: q || undefined, interaction, grading: 'auto' }, extra);
    if (k0 === null) { s.grading = 'manual'; key[id] = { type: interaction, score: 1, grading: 'manual' }; miss.push(String(label)); }
    else if (k0 && k0.grading === 'manual') { s.grading = 'manual'; key[id] = Object.assign({ type: interaction, score: 1 }, k0); }
    else key[id] = Object.assign({ type: interaction, score: 1 }, k0);
    slots.push(s);
  };
  const textKey = v => { const acc = altSplit(v); return acc.length ? { accept: acc } : null; };
  const choiceKey = (opts, idx) => !idx.length ? null : idx.length > 1 ? { type: 'choice-many', correct: idx.map(i => opts[i].id).sort() } : { correct: opts[idx[0]].id };
  let dn = 0;   // hội thoại: chỗ trống đánh số (1) (2)… liên tục qua các lượt, như trên phiếu
  const lab = (i, n, many) => k === 'dialogue' ? `(${++dn})` : `${nlab(t, qnum(t, i))}${many ? '.' + n : ''}`;

  if (k === 'empty') return { slots, key, notes, miss };
  if (k === 'trace' || a.kind === 'trace') { notes.push('Tô chữ (Q9): chỉ xem, không chấm'); return { slots, key, notes, miss }; }

  // Bảng / lưới (Q10, Q11)
  if (k === 'table') {
    const c = t.content, o = tblOpts(t);
    if (o.cross) {
      (c.rows || []).forEach((r, ri) => (r.cells || []).forEach((v, ci) => { const x = crossCell(v); if (x.k === 'ans' || x.k === 'empty') add(`${tid}.cell.${r.id}.${ci}`, `ô ${ri + 1}-${ci + 1}`, 'cell', x.k === 'ans' ? { accept: [x.ch] } : null, { item: r.id, maxLength: 1 }); }));
      return { slots, key, notes, miss };
    }
    const grid = isGridTbl(t);
    (c.rows || []).forEach((r, ri) => {
      // v98 bảng chọn đáp án: các ô tích của một hàng = một chỗ chọn (Một ô đúng mỗi hàng → chọn một, không thì chọn nhiều)
      const tk = (r.cells || []).map((v, ci) => [v, ci]).filter(([v]) => v && typeof v === 'object' && v.tick);
      if (tk.length) {
        const opts = tk.map(([v, ci]) => ({ id: String(ci), text: String(v.text || (c.cols || [])[ci] || '').trim() })), ok = tk.filter(([v]) => v.ok).map(([, ci]) => String(ci));
        const type = o.one ? 'choice-one' : 'choice-many';
        add(`${tid}.cell.${r.id}`, `hàng ${ri + 1}`, type, ok.length ? { type, correct: o.one ? ok[0] : ok } : null, { item: r.id, options: opts });
      }
      (r.cells || []).forEach((v, ci) => {
        if (v && typeof v === 'object' && v.ans != null) add(`${tid}.cell.${r.id}.${ci}`, `hàng ${ri + 1} cột ${ci + 1}`, 'cell', textKey(v.ans), { item: r.id });
        else if (v === '' && !grid) add(`${tid}.cell.${r.id}.${ci}`, `hàng ${ri + 1} cột ${ci + 1}`, 'cell', null, { item: r.id });   // ô trống để viết, chưa có đáp án
      });
    });
    if (grid && !slots.length) notes.push('Lưới (Q11, tìm từ) không có ô điền: chỉ xem');
    return { slots, key, notes, miss };
  }

  if (a.kind === 'none') return { slots, key, notes, miss };

  // Bài đọc: chỗ trống ___ và lựa chọn {a|b} ngay trong bài đọc
  if (k === 'passage' && leadText(t)) {
    const n = gapCount(leadText(t)), lk = (t.content.lead && t.content.lead.keys) || [];
    for (let j = 1; j <= n; j++) add(`${tid}.lead.${j}`, `(${j})`, 'text', textKey(lk[j - 1]));
    pkGroups({ text: leadText(t) }).forEach((g, j) => { const opts = optsOf(g.map(o => o.t)), idx = g.map((o, i) => o.ok ? i : -1).filter(i => i >= 0); add(`${tid}.leadc.${j + 1}`, `bài đọc {${j + 1}}`, 'choice-one', choiceKey(opts, idx), { options: opts }); });
  }

  // Bài nối (Q8): mỗi vế trái một chỗ; phương án = mọi vế phải (kể cả vế thừa)
  if (k === 'pairs') {
    const L = its(t).filter(x => x.pair && x.pair.l), R = its(t).filter(x => x.pair && x.pair.r), shuf = !!t.content.shuffle;
    const opts = R.map(x => ({ id: x.id, text: String(x.pair.r.text || x.pair.r.img || '').trim() }));
    if (!shuf) notes.push('Bài nối chưa bật "Xáo vế phải": chưa xác định được cặp đúng → chấm tay');
    L.forEach(x => add(`${tid}.${x.id}`, nlab(t, qnum(t, its(t).indexOf(x))), 'match', shuf && x.pair.r ? { correct: x.id } : null, { item: x.id, options: opts }));
    return { slots, key, notes, miss };
  }

  // Viết tự do (Q12)
  if (isFreeW(t)) {
    const x = its(t)[0];
    if (p.frame === 'box') notes.push('Viết tự do, khung vẽ: chỉ xem (vẽ trên máy làm sau)');
    else add(`${tid}.${x.id}`, '1', 'text-long', { grading: 'manual', score: 1, ...(String(x.key ?? '').trim() ? { sample: String(x.key).trim() } : {}) }, { item: x.id });
    return { slots, key, notes, miss };
  }

  its(t).forEach((x, i) => {
    if (!x || x.gt || x.ex) return;
    const base = `${tid}.${x.id}`;
    // Chọn ảnh (Q7): một câu, nhiều ảnh
    if (k === 'items' && t.content.variant === 'multi') {
      const opts = imgOpts(x.imgs || []); add(base, lab(i), 'choice-one', choiceKey(opts, exPicks(t, x, x.imgs || [])), { item: x.id, options: opts }); return;
    }
    if (k === 'dialogue' && !/___|\{[^{}|]+\|/.test(x.text || '')) return;   // lượt thoại không có chỗ trả lời
    if (a.kind === 'choice') {
      if (a.attach === 'inline') {
        const gs = pkGroups(x);
        if (p.ulab) {   // tìm lỗi sai: chọn phần gạch chân A–D
          const us = [...pkSrc(x).matchAll(/<u>(.*?)<\/u>/g)].map(m => m[1].replace(/<[^>]+>/g, '')), nU = us.length;
          const opts = optsOf(us.map((u, j) => `${(p.upper ? 'ABCDEFGH' : 'abcdefgh')[j]}. ${u}`));   // chữ = nhãn in trên phiếu + đoạn gạch chân
          const kk = String(x.key ?? '').trim().toLowerCase(), j = LET.indexOf(kk); add(base, lab(i), 'choice-one', kk && j >= 0 && j < nU ? { correct: opts[j].id } : null, { item: x.id, options: opts }); return;
        }
        if (!gs.length) { notes.push(`câu ${lab(i)}: không có lựa chọn {a|b}`); return; }
        const kp = keyParts(x);
        gs.forEach((g, j) => { const opts = optsOf(g.map(o => o.t)); let idx = g.map((o, n) => o.ok ? n : -1).filter(n => n >= 0);
          if (!idx.length && gs.length === 1 && kp.length) idx = exPicks(t, x, g.map(o => o.t));            // đáp án cũ ghi ở key, chưa đổi sang *
          add(gs.length > 1 ? `${base}.${j + 1}` : base, lab(i, j + 1, gs.length > 1), 'choice-one', choiceKey(opts, idx), { item: x.id, options: opts }); });
        return;
      }
      const list = x.opts || [];
      if (list.length < 2) { notes.push(`câu ${lab(i)}: dạng chọn nhưng ít hơn 2 lựa chọn`); return; }
      const opts = optsOf(list), idx = exPicks(t, x, list), ck0 = choiceKey(opts, idx);
      add(base, lab(i), ck0 && ck0.type === 'choice-many' ? 'choice-many' : 'choice-one', ck0, { item: x.id, options: opts }); return;
    }
    if (a.kind === 'tf') {
      const labs = Array.isArray(p.labs) && p.labs.length >= 2 ? p.labs.slice(0, 3) : ['T', 'F'], opts = labs.map(l => ({ id: String(l), text: String(l) }));
      const L = String(x.key ?? '').trim().toLowerCase(), al = TF_ALIAS[L] || L, j = labs.findIndex(l => { const v = String(l).toLowerCase(); return v === al || v === L; });
      add(base, lab(i), 'tf', L ? (j >= 0 ? { correct: opts[j].id } : null) : null, { item: x.id, options: opts });
      if (L && j < 0) notes.push(`câu ${lab(i)}: đáp án "${x.key}" không khớp nhãn ${labs.join('/')}`);
      return;
    }
    if (a.kind === 'tick') {   // ô tích từng câu (Q5 dạng ô tích): tích = đúng
      const L = String(x.key ?? '').trim().toLowerCase(), opts = [{ id: '✓', text: '✓' }, { id: '✗', text: '✗' }];
      const c0 = /^(✓|v|x|yes|y|true|t|đúng|1|tick)$/.test(L) ? '✓' : /^(✗|no|n|false|f|sai|0|-)$/.test(L) ? '✗' : null;
      add(base, lab(i), 'tf', c0 ? { correct: c0 } : null, { item: x.id, options: opts });
      if (L && !c0) notes.push(`câu ${lab(i)}: ô tích có đáp án "${x.key}" không rõ tích hay không`);
      return;
    }
    if (a.kind === 'word' || a.kind === 'sentence') {
      const n = gapN(x), long = a.kind === 'sentence', type = long ? 'text-long' : 'text';
      if (a.attach === 'inline' && n >= 1) {
        const g = keyGaps(x);
        for (let j = 1; j <= n; j++) add(n > 1 ? `${base}.${j}` : base, lab(i, j, n > 1), type, textKey(n > 1 ? g[j - 1] : x.key), { item: x.id });
        return;
      }
      const ml = a.layout === 'A3' && x.len ? { maxLength: x.len } : {};
      add(base, lab(i), type, textKey(x.key), Object.assign({ item: x.id }, ml));
      return;
    }
    notes.push(`câu ${lab(i)}: loại trả lời "${a.kind}" chưa hỗ trợ → chỉ xem`);
  });
  return { slots, key, notes, miss };
}

export function taskSlots(t) {
  const r = taskSlots0(t);
  if (r.miss.length) r.notes.unshift(`${r.miss.length === 1 ? 'câu' : r.miss.length + ' chỗ'} ${r.miss.join(', ')}: chưa có đáp án → chấm tay`);
  return { slots: r.slots, key: r.key, notes: r.notes };
}

// Cả phiếu: gộp các Task, kèm cảnh báo theo Task
export function sheetSlots(w) {
  const slots = [], key = {}, warn = [];
  (w.tasks || []).forEach((t, ti) => {
    const r = taskSlots(t), nm = `Task ${t.number || ti + 1}${qDerived(t) ? ` (${qDerived(t)} ${QN[qDerived(t)]})` : ''}`;
    slots.push(...r.slots); Object.assign(key, r.key); r.notes.forEach(m => warn.push(`${nm}: ${m}`));
  });
  return { slots, key, warn };
}


