import { publish } from '../ui/store';
import { actions } from '../ui/actions';
import { askConfirm } from '../ui/Dialogs';
import { toast } from '../ui/Toast';
import { ws, setWs } from '../core/state.js';
import { AGE, AL, ANS_DEF, CELL_NAME, F01, FEAT_NAME, FONTS, FORM_NAME, GAPLAB, GAPP, GT_SIZE, IMP_MAX, IMP_MAX_CH, KIND_A, KIND_NAME, L2KIND, LAYOUT_DEF, MINS, PK_STAR, PRESETS, QN, RECIPES, SCHEMA, SIZES, alOpts, attachOpts, choiceTexts, ck, ckOf, clone, ensureIds, ensureRowIds, featOf, featVal, fillSheet, fillTask, gapCount, hasChoiceMarkup, hasMarkup, isFreeW, isGridTbl, isObj, its, keyParts, kindsOk, migTask, newId, normAnswer, pkGroups, pkMig, pkSrc, pkToggle, prune, qDerived, qTidy, recipeMatch, sigOk, sv, tidy, toForm } from '../core/model.js';
import { A2MM, AI, AR_OPTS, CHOICE_RE, CONTENT_H, FSZ, G1_TOP, IW8, JS, MM, PH, PHC, SAMPLE, SAMPLE2, T, T7CW, TA, TBL_DEF, TBL_ROW_MM, TL, a2cfg, a2end, a2inline, a4autoDef, a4autoMax, a4dir, alignOf, ans, ans0, ansI, arLabel, arNum, autoLayout, body, body0, body0n, cellCfg, cellDirOf, cellFr, cellSplit, ci, colsDefault, colsOf, colsRange, crossCell, crossHtml, er, esc, exFill, exPick, exPicks, fitOf, fixedImg, fixesFor, fontPt, frOf, frameH, g1Of, g1bFit, g1bFr, g3row, g4Html, gapOf, gtBody, gtHtml, gtInline, gtKeys, gtN, imgArOf, imgStyle, inheritedSpacing, inlChoice, ino, inoN, inoT, isColI, isJoined, keyGaps, layoutOf, layoutReasons, leadIntro, leadOf, leadText, meas, measure, migrate, natAr, nlab, ownFit, pOf, paginate, pairPerm, passCut, passInline, passageHtml, passageParas, pic, pkB, pkPre, place, q2end, qFirst, qOf, qReal, qnum, qrHtml, qrInner, qrUrl, qtext, qtext0, qwho, range, ratioOf, renderTask, rich, rmeta, sheetSpacing, sizeKey, spacingOf, srcOf, t7cw, taOf, tblAr, tblOpts, tpic, tplOf, units, withMarks, xOfKey } from '../core/layout.js';
import { A_SHORT, BARE_RE, BOX, BRX, HEADX, HEAD_RE, LABS, MD_EX, MD_FIELD, MD_FKEY, MD_FORM, MD_GT, MD_KIND, MD_KNAME, MD_LABEL, MD_RULE, MD_SCAF, MD_SECT, MD_SKIP, MD_TLAY, NUM_RE, OPT_LINE, PRESET_NAME, QM_C, QM_L, QORDER, T1FAM, TN, TN_OLD, VERB_RE, applyRecipe, boxSplit, brIn, brOut, crossLines, crossParse, descOf, dupGapKind, fmtCell, impSheetObj, inlineOpts, isHead, isInstr, looksJson, mdForm, mdTask, normGap, optStr, parseCell, parseTask, q2cfg, q2set, qCmd, qReasons, qStyles, qmC, qmEq, qmForm, qmHead, qmList, qmPick, qmRest, qmRestore, qmRows, qmUnits, readJson, readMd, recipeById, setHasAns, setKind, setQ, setQMem, sheetToMd, splitOptsLine, stripNum, t1Old, taskToMd, tnOf, tnReasons, tnTarget, toggleField, withoutGt } from '../core/md.js';

const SPLIT_MIN = 80;                 // mm trống tối thiểu để cắt bài thay vì đẩy sang trang mới
const SP_LABEL = { gapTask: 'Giữa các Task', padTask: 'Padding trong Task', headGap: 'G0 → nội dung', groupGap: 'Giữa các nhóm', itemGap: 'Giữa các item / câu' };
const ATTACH = { inline: 'Trong câu', item: 'Theo item', block: 'Khối riêng' };
// Bài đọc nhiều đoạn (dòng trống giữa các đoạn) → mỗi đoạn một <p>; bài một đoạn giữ nguyên như cũ
const paraHtml = s => /\n/.test(s) ? s.split(/\n\s*\n/).map(x => x.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean).map(x => `<p>${esc(x)}</p>`).join('') : esc(s);
// v100: chỗ trống đứng sau nhãn có sẵn "(a)" thì không thêm số (n)
// v101: nhãn in sẵn trước từng chỗ trống của một câu: "(a)" → "(a)", chỗ trống không có nhãn → ''
const gapLabs = tx => { const o = [], str = String(tx || ''); str.replace(/_{3,}/g, (m, at) => { const m2 = /\(\s*([A-Za-z0-9]{1,2})\s*\)\s*$/.exec(str.slice(0, at)); o.push(m2 ? `(${m2[1]})` : ''); return m; }); return o; }; SAMPLE2.tasks.forEach(t => tidy(t));
setWs(clone(SAMPLE2));
let base = clone(SAMPLE2);       // bản gốc của phiếu đang mở (để "Về kiểu đáp án ban đầu", khung từ)
let sel = { type: 'sheet' }, multi = [];
let hist = [], fut = [];
let zoom = null;                 // null = vừa khung
let lastStart = null, lastCount = 0;
let lastRes = null;
let guides = false;
const dirDefault = t => its(t) && its(t).some(it => it.lines) ? 'row' : 'col';
const cellImgMode = t => ck(t) === 'items' && layoutOf(t) === 'T5';
const hasFitImages = t => !!t.image;
function cellKeys(t, kind) {
  if (!cellImgMode(t)) return [];
  const L = its(t);
  if (kind === 'crow') return cellDirOf(t) === 'row' ? L.map(it => it.id) : [];
  return t.content.variant === 'multi' ? L.flatMap(it => it.imgs.map((_, j) => `${it.id}.${j}`)) : L.map(it => it.id);
}
// Khóa từng đáp án (ghi đè theo câu)
function itemKeys(t) { const k = ck(t); if (k === 'table' || k === 'empty') return []; if (k === 'dialogue') return its(t).filter(x => (x.text || '').includes('___')).map(x => x.id); if (k === 'pairs') return its(t).filter(x => x.pair && x.pair.l).map(x => x.id); return its(t).map(x => x.id); }
function labelOf(t, k) {
  const [a, b] = String(k).split('.'), ks = itemKeys(t), i = ks.indexOf(a);
  return (i >= 0 ? i + 1 : a) + (b != null ? '.' + (+b + 1) : '');
}
const VA = { top: 'Trên', center: 'Giữa', bottom: 'Dưới' };
const HA = { left: 'Trái', center: 'Giữa', right: 'Phải' };
// Mọi kiểu A của loại đáp án; att = chế độ gắn dùng được (giữ chế độ hiện tại nếu được), null = không dùng được
function aChoices(t) {
  const a = t.answer, att = attachOpts(t);
  return (KIND_A[a.kind] || []).map(A => {
    const fits = x => alOpts({ answer: Object.assign({}, a, { attach: x }) }).includes(A);
    return { A, att: att.includes(a.attach) && fits(a.attach) ? a.attach : (att.find(fits) || null) };
  });
}
const SCENE = 'data:image/svg+xml,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 36'><rect width='48' height='36' fill='#cfe3ee'/><circle cx='37' cy='9' r='5' fill='#f1c35a'/><path d='M0 36 L14 15 L25 28 L32 21 L48 36Z' fill='#a3c9ac'/><path d='M0 36 L9 25 L18 36Z' fill='#86b592'/><rect x='.4' y='.4' width='47.2' height='35.2' fill='none' stroke='#8fb0c2' stroke-width='.8'/></svg>");
// Các ô ảnh của một Task, theo thứ tự: G1 rồi ảnh item / ảnh cột trái bài nối
function slotsOf(t) {
  const k = ck(t), out = [];
  if (t.image) { out.push({ key: 'G1', label: t.image.label }); if (t.image.two) out.push({ key: 'G1b', label: t.image.label2 || 'ảnh 2' }); }
  if (t.wordBank && t.wordBank.kind === 'image' && k !== 'empty') t.wordBank.words.forEach((w, i) => out.push({ key: 'B.' + i, label: w || 'ảnh ' + (i + 1) }));
  if (k === 'items') its(t).forEach(it => { if (it.imgs) it.imgs.forEach((im, j) => out.push({ key: `@${it.id}.${j}`, label: im })); else if (it.img) out.push({ key: '@' + it.id, label: it.img }); });
  if (k === 'pairs') its(t).forEach(x => { const l = x.pair && x.pair.l; if (l && l.img) out.push({ key: '@' + x.id, label: l.img }); });
  if (k === 'table') (t.content.rows || []).forEach(r => { if (!r.id) return;
    if (r.head && typeof r.head === 'object' && r.head.img) out.push({ key: '@' + r.id, label: r.head.img });
    (r.cells || []).forEach((v, j) => { if (v && typeof v === 'object' && v.img) out.push({ key: `@${r.id}.${j}`, label: v.img }); }); });
  (t.extras || []).forEach(x => { if (x.kind === 'image') gtKeys(x).forEach((key, j) => out.push({ key, label: (x.label || 'ảnh') + (gtN(x) > 1 ? ' ' + (j + 1) : '') })); });
  return out;
}

// Hướng xếp đáp án A4: theo từng câu (perItem) > chung (dir). 'auto' = ngắn thì một hàng cột đều, dài thì mỗi đáp án một dòng.
const A4DIRS = { auto: 'Tự động', h: 'Ngang', g2: '2 cột', v: 'Dọc', fl: 'Tự xuống dòng' };
// Mặc định căn ngang của đáp án theo chỗ đặt
function ansAlignDef(t) { const L = layoutOf(t); if (L === 'T4' || L === 'T7' || t.content.variant === 'multi') return 'center'; if (L === 'T5' && t.layout.align) return t.layout.align; return 'left'; }
// v86 (F2): một câu có thể có nhiều đáp án đúng, ghi "a, c" (hoặc chữ của lựa chọn, cách nhau dấu phẩy)
function optsOfKey(t, x) { if (x.imgs) return x.imgs; if (x.opts) return x.opts; if (t.answer.layout === 'A6') return [...ans0(t, x).matchAll(/<span>([^<]*)<\/span>/g)].map(m => m[1]); return []; }
// v91: câu nhiều chỗ trống: key = đáp án từng chỗ, cách nhau " | "
const gapN = x => (pkSrc(x).match(/___/g) || []).length;
// v88: câu nào cần đáp án đúng (trừ tô theo nét, viết tự do, bảng, dòng chữ), câu nào đã có
function needKey(t, x) { if (!x || x.gt) return false; const k = ck(t), a = t.answer; if (['table', 'empty', 'trace'].includes(k) || ['none', 'trace'].includes(a.kind) || isFreeW(t)) return false; if (k === 'pairs') return !!(x.pair && x.pair.l && x.pair.r); if (k === 'dialogue') return !!x.ex || /___|\{[^{}|]+\|/.test(x.text || ''); return true; }
function hasKey(t, x) { if (ck(t) === 'pairs') return !!t.content.shuffle; if (!x.opts && !x.imgs && gapN(x) > 1) { const g = keyGaps(x); return Array.from({ length: gapN(x) }, (_, j) => g[j] || '').every(Boolean); } const gs = x.opts || x.imgs ? [] : pkGroups(x); if (gs.length) return gs.every(g => g.some(o => o.ok)) || String(x.key ?? '').trim() !== ''; const op = optsOfKey(t, x); if ((x.opts || x.imgs || t.answer.layout === 'A6') && op.length > 1) return exPicks(t, x, op).length > 0; return String(x.key ?? '').trim() !== ''; }
function keyState(t) { const need = [], miss = []; its(t).forEach((x, i) => { if (needKey(t, x)) { need.push(i); if (!hasKey(t, x)) miss.push(i); } }); return { need, miss }; }
function crossCount(c) {
  const mat = c.rows.map(r => r.cells.map(crossCell)), a = (r, k) => !!(mat[r] && mat[r][k] && mat[r][k].k !== 'none'); let n = 0, ac = 0, dn = 0, cells = 0;
  mat.forEach((row, r) => row.forEach((x, k) => { if (x.k === 'none') return; cells++; const A = !a(r, k - 1) && a(r, k + 1), D = !a(r - 1, k) && a(r + 1, k); if (A) ac++; if (D) dn++; if (A || D) n++; }));
  return { cells, words: n, across: ac, down: dn };
}

/* ---- Điểm trên ảnh chung (v76): image.marks = [{x,y}] theo % tọa độ ẢNH; image.mk = {shape:'circle'|'square', label:'num'|'none'} ---- */
let markMode = false;
const gtOf = (t, id) => (t.extras || []).find(x => x.id === id);
// Thứ tự gộp: [khối phía trên..., BÀI, khối phía dưới...]. Đổi chỗ = hoán vị trong danh sách này.
function gtOrder(t) { const ex = t.extras || []; return [...ex.filter(x => x.pos === 'top'), { body: 1 }, ...ex.filter(x => x.pos !== 'top')]; }
function gtMove(t, id, d) {
  const L = gtOrder(t), i = L.findIndex(x => x.id === id), j = i + d; if (i < 0 || j < 0 || j >= L.length) return false;
  [L[i], L[j]] = [L[j], L[i]]; const bi = L.findIndex(x => x.body); t.extras = [];
  L.forEach((x, k) => { if (x.body) return; x.pos = k < bi ? 'top' : 'bottom'; t.extras.push(x); }); return true;
}

/* ================= Vẽ trang ================= */
const stage = document.getElementById('stage');
function scaleNow() {
  const fit = Math.min(1, (stage.clientWidth - 8) / (210 * MM));
  return zoom == null ? Math.max(.3, fit) : zoom;
}
const FILL_MAX = 8; // mm thêm tối đa vào mỗi khoảng giữa hai Task khi "Lấp đầy trang"
function drawPages(res) {
  const n = res.pages.length, s = scaleNow(), sh = sheetSpacing(), age = AGE[ws.age];
  stage.style.setProperty('--s', s);
  const A = 14 + sh.padTask, B = A + fontPt() * 0.3528 * 1.35 + 2.5, C = 210 - 14 - sh.padTask;
  const gd = guides ? `<div class="guides" aria-hidden="true"><i style="left:${A}mm"></i><i class="b" style="left:${B.toFixed(2)}mm"></i><i style="left:${C}mm"></i></div>` : '';
  stage.innerHTML = res.pages.map((p, i) => {
    const free = Math.max(0, (res.H - p.used) / MM), over = p.items.some(x => x.over), k = p.items.length;
    const extra = ws.fill && i < n - 1 && k > 1 ? Math.min(FILL_MAX, free / (k - 1)) : 0;
    const fill = Math.min(100, (p.used + extra * (k - 1) * MM) / res.H * 100);
    const tasks = p.items.map((x, j) => { const h = renderTask(x.t, x.frag, j ? gapOf(x.t) + (isJoined(x.t) ? 0 : extra) : 0); return x.over ? h.replace('class="task ', 'class="task over ') : h; }).join('');
    return `<div class="pg-wrap"><div class="pg-scale"><div class="page" data-page="${i}"><div class="flow">${tasks}</div>${gd}<div class="pfoot"><span>${esc(ws.title)}</span><span>Trang ${i + 1}/${n}</span></div></div></div>` +
      `<div class="pstat ${over ? 'bad' : ''}">Trang ${i + 1} · ${over ? 'có Task tràn trang' : `còn trống ${Math.round(Math.max(0, free - extra * (k - 1)))} mm`}<span class="bar"><i style="width:${fill}%"></i></span></div></div>`;
  }).join('');
  markSelection(); addHandles(); resChanged = checkRes() || resChanged;
}
let resChanged = false;
let LEGEND = 'Kéo thanh hoặc cạnh = đổi kích thước · Bấm đúp = về tự động · Esc = lên cấp';
const nodeKey = s => !s || s.type === 'sheet' ? null : s.type === 'task' ? s.id : `${s.id}:${s.g}${s.item ? ':' + s.item : ''}`;
function markSelection() {
  stage.querySelectorAll('.sel').forEach(e => e.classList.remove('sel'));
  stage.querySelectorAll('.task.cur').forEach(e => e.classList.remove('cur'));
  if (sel.type !== 'sheet') stage.querySelectorAll(`.task[data-task="${sel.id}"]`).forEach(e => e.classList.add('cur'));
  [sel, ...multi].forEach(s => {
    const nid = nodeKey(s); if (!nid) return;
    stage.querySelectorAll(`[data-node="${nid}"]`).forEach(e => e.classList.add('sel'));
    if (s.type === 'group' && !s.item) stage.querySelectorAll(`[data-node^="${nid}:"]`).forEach(e => e.classList.add('sel'));
  });
}
function splitTarget(taskEl, L) {
  if (L === 'T2' || L === 'T3') { const c = taskEl.querySelector('.b2,.b3'); return c && { box: c, edge: c.querySelector('.colL') }; }
  if (L === 'T4') { const c = taskEl.querySelector('.tbl'); return c && { box: c, edge: c.querySelector('.c2') }; }
  if (L === 'T6') { const c = taskEl.querySelector('.wbwrap'); return c && { box: c, edge: c.firstElementChild }; }
  return null;
}
function refreshOverlay() { stage.querySelectorAll('.splitter,.rsz').forEach(x => x.remove()); addHandles(); }
const clampN = (v, a, b) => Math.min(b, Math.max(a, v));
const curTask = t => ws.tasks.find(x => x.id === t.id);
function relR(r, tr, s) { return { left: (r.left - tr.left) / s, top: (r.top - tr.top) / s, right: (r.right - tr.left) / s, bottom: (r.bottom - tr.top) / s, width: r.width / s, height: r.height / s }; }
const ratioLabel = t => { const r = ratioOf(t); return `${r} / ${100 - r}`; };

/* --- Tay kéo chuẩn: mọi tay kéo đều có data-for (container) và data-param (thông số), bấm đúp để về tự động --- */
function mkH(el, cls, o) {
  const d = document.createElement('div'); d.className = cls; d.dataset.for = o.for; d.dataset.param = o.param;
  d.title = (o.title || '') + ' Bấm đúp để về tự động.'; d.innerHTML = '<span class="tip"></span>'; d.__o = o; el.appendChild(d);
  d.addEventListener('dblclick', e => { e.stopPropagation(); commit(w => { const t = w.tasks.find(x => x.id === el.dataset.task); o.reset(t, w); }); });
  d.addEventListener('pointerdown', e => {
    e.preventDefault(); e.stopPropagation(); d.setPointerCapture(e.pointerId); d.classList.add('drag');
    const before = clone(ws), ctx = (o.start && o.start(e)) || {};
    ctx.x0 = e.clientX; ctx.y0 = e.clientY; ctx.s = scaleNow();
    const move = ev => { const tip = o.move(ev, ctx); if (tip != null) d.querySelector('.tip').textContent = tip; placeAll(el); };
    const up = () => {
      d.removeEventListener('pointermove', move); d.removeEventListener('pointerup', up); d.removeEventListener('pointercancel', up); d.classList.remove('drag');
      if (JSON.stringify(before) !== JSON.stringify(ws)) { propagate(before, o.sel || sel); ws.tasks.forEach(tidy); hist.push(before); fut = []; render(); return; }
      if (o.sel && nodeKey(o.sel) !== nodeKey(sel)) { sel = o.sel; multi = []; refreshSel(); }
    };
    d.addEventListener('pointermove', move); d.addEventListener('pointerup', up); d.addEventListener('pointercancel', up);
  });
  return d;
}
function placeAll(el) {
  const s = scaleNow(), tr = el.getBoundingClientRect();
  el.querySelectorAll('.rsz,.splitter').forEach(d => {
    const o = d.__o; if (!o || !o.place) return;
    const r = o.place(tr, s); if (!r) { d.hidden = true; return; } d.hidden = false;
    ['left', 'top', 'width', 'height'].forEach(k => { if (r[k] != null) d.style[k] = r[k] + 'px'; });
    if (r.tip != null && !d.classList.contains('drag')) d.querySelector('.tip').textContent = r.tip;
  });
}
// Kéo phần trăm theo cách căn: căn giữa thì mỗi bên đổi một nửa, căn phải thì kéo ngược
const dragPct = (c, ev, w0, full, align) => w0 + (align === 'center' ? 2 : 1) * (align === 'right' ? -1 : 1) * (ev.clientX - c.x0) / full * 100;

function hSplit(t, el, fk, param = 'split') {
  const L = layoutOf(t); if (ratioOf(t) == null || cellDirOf(t) === 'row') return;
  const tg = splitTarget(el, L); if (!tg || !tg.edge) return;
  const m = rmeta(t, L);
  mkH(el, 'splitter', { for: fk, param, title: 'Kéo để đổi tỉ lệ ngang (bước 5%).',
    place: (tr, s) => { const b = relR(tg.box.getBoundingClientRect(), tr, s), e = relR(tg.edge.getBoundingClientRect(), tr, s), gap = parseFloat(getComputedStyle(tg.box).columnGap) || 0; return { left: e.right + gap / 2, top: e.top, height: b.bottom - e.top, tip: ratioLabel(curTask(t)) }; },
    move: ev => { const b = tg.box.getBoundingClientRect(), r = clampN(Math.round((ev.clientX - b.left) / b.width * 20) * 5, m.range[0], m.range[1]), tt = curTask(t); if (ratioOf(tt) === r) return null; tt.layout.split = r === m.ratio ? null : r; el.style.setProperty('--tpl', tplOf(tt)); return ratioLabel(tt); },
    reset: tt => { tt.layout.split = null; } });
}
function hT7(t, el, fk) {
  if (layoutOf(t) !== 'T7') return; const box = el.querySelector('.mrows'); if (!box) return;
  const kid = i => box.children[i];
  [0, 1].forEach(k => mkH(el, 'splitter', { for: fk, param: 'cw', title: k ? 'Kéo để đổi độ rộng cột nối và cột phải (bước 5%).' : 'Kéo để đổi độ rộng cột trái và cột nối (bước 5%).',
    place: (tr, s) => { const b = relR(box.getBoundingClientRect(), tr, s), c = relR(kid(k).getBoundingClientRect(), tr, s), gap = parseFloat(getComputedStyle(box).columnGap) || 0; return { left: c.right + gap / 2, top: b.top, height: b.height, tip: t7cw(curTask(t)).map(Math.round).join(' / ') }; },
    move: ev => { const b = box.getBoundingClientRect(), x = Math.round((ev.clientX - b.left) / b.width * 20) * 5, tt = curTask(t), c = t7cw(tt).slice(); let b0 = c[0], b1 = c[0] + c[1]; if (k === 0) b0 = clampN(x, 10, b1 - 10); else b1 = clampN(x, b0 + 10, 90); const nw = [b0, b1 - b0, 100 - b1]; if (nw.join() === c.join()) return null; tt.layout.cw = nw.join() === T7CW.join() ? null : nw; el.style.setProperty('--tpl', tplOf(tt)); return nw.join(' / '); },
    reset: tt => { tt.layout.cw = null; } }));
  mkH(el, 'rsz rsz-h', { for: fk, param: 'rowH', title: 'Kéo để đổi chiều cao hàng nối (bước 1 mm).',
    place: (tr, s) => { const b = relR(box.getBoundingClientRect(), tr, s), r = relR(kid(0).getBoundingClientRect(), tr, s); return { left: b.left, width: b.width, top: r.bottom, tip: `hàng ${Math.round(r.height / MM)} mm` }; },
    start: () => ({ top: kid(0).getBoundingClientRect().top }),
    move: (ev, c) => { const mm = clampN(Math.round((ev.clientY - c.top) / c.s / MM), 8, 40), tt = curTask(t); if (tt.layout.rowH === mm) return null; tt.layout.rowH = mm; el.style.setProperty('--mrh', mm + 'mm'); return `hàng ${mm} mm`; },
    reset: tt => { tt.layout.rowH = null; } });
}
// v103: kéo cột T / F (Đúng/Sai cùng hàng) lại gần câu: đổi params.tfx (mm từ lề phải)
function hTF(t, el, fk) {
  if (t.answer.layout !== 'A6' || !(t.answer.params || {}).row) return;
  const bs = [...el.querySelectorAll('.qb > .a6')]; if (!bs.length) return;
  const a = bs[0], last = bs[bs.length - 1], qb = a.parentElement, tfx = tt => (tt.answer.params || {}).tfx || 0;
  const pct = () => { const q = qb.getBoundingClientRect(), r = a.getBoundingClientRect(); return q.width ? Math.round((r.left - q.left) / q.width * 100) : 0; }, lbl = mm => `câu ${pct()} / T-F ${100 - pct()} · cách lề phải ${mm} mm`;   // v106: hiện tỉ lệ câu / T-F
  mkH(el, 'splitter', { for: fk, param: 'tfx', title: 'Kéo để đưa cột T / F lại gần câu (bước 1 mm).',
    place: (tr, s) => { const r = relR(a.getBoundingClientRect(), tr, s), l = relR(last.getBoundingClientRect(), tr, s); return { left: r.left - 2 * MM, top: r.top - 1 * MM, height: l.bottom - r.top + 2 * MM, tip: lbl(tfx(curTask(t))) }; },
    move: (ev, c) => { const q = qb.getBoundingClientRect(), aw = a.getBoundingClientRect().width, mm = clampN(Math.round((q.right - ev.clientX - 2 * MM * c.s - aw) / c.s / MM), 0, 140), tt = curTask(t); if (tfx(tt) === mm) return null; tt.answer.params = tt.answer.params || {}; tt.answer.params.tfx = mm || null; el.style.setProperty('--tfx', mm + 'mm'); return lbl(mm); },
    reset: tt => { if (tt.answer.params) delete tt.answer.params.tfx; } });
}
function hT6(t, el, fk) {
  if (layoutOf(t) !== 'T6' || (t.wordBank && t.wordBank.placement === 'right')) return;
  const g2 = el.querySelector('.body>.g2'); if (!g2) return;
  const body = g2.parentElement;
  mkH(el, 'rsz rsz-w', { for: fk, param: 'width', title: 'Kéo để đổi độ rộng khối nội dung (bước 5%).',
    place: (tr, s) => { const r = relR(g2.getBoundingClientRect(), tr, s), al = curTask(t).layout.align; return { left: al === 'right' ? r.left : r.right, top: r.top, height: Math.min(r.height, 40 * MM), tip: `rộng ${curTask(t).layout.width || 100}%` }; },
    start: () => { const r = body.getBoundingClientRect(), s = scaleNow(), pl = parseFloat(getComputedStyle(body).paddingLeft) * s, hang = g2.classList.contains('list') ? -parseFloat(getComputedStyle(g2).marginLeft) * s : 0; return { full: r.width - pl + hang, w0: curTask(t).layout.width || 100 }; },
    move: (ev, c) => { const tt = curTask(t), pct = clampN(Math.round(dragPct(c, ev, c.w0, c.full, tt.layout.align) / 5) * 5, 40, 100), v = pct === 100 ? null : pct; if (tt.layout.width === v) return null; tt.layout.width = v; el.style.setProperty('--cw', pct); el.setAttribute('data-w2', '1'); return `rộng ${pct}%`; },
    reset: tt => { tt.layout.width = null; } });
}
// Khoảng cách giữa các item / câu (Lưới, Chỉ nội dung): kéo khe giữa hàng 1 và hàng 2
function hItemGap(t, el, fk) {
  const L = layoutOf(t); if (!['T5', 'T6'].includes(L)) return;
  const g2 = el.querySelector('.g2.grid, .g2.list, .g2.dialogue'); if (!g2) return;
  const kids = [...g2.children], n = L === 'T5' ? colsOf(t) : (g2.classList.contains('list') ? colsOf(t) : 1);
  if (kids.length <= n) return;
  const r0 = kids[0], r1 = kids[n];
  mkH(el, 'rsz rsz-g', { for: fk, param: 'sp.itemGap', title: 'Kéo để đổi khoảng cách giữa các item / câu (bước 0,5 mm).',
    place: (tr, s) => { const a = relR(r0.getBoundingClientRect(), tr, s), b = relR(r1.getBoundingClientRect(), tr, s); return { left: a.left, width: Math.min(a.width, 30 * MM), top: (a.bottom + b.top) / 2, tip: `cách ${fmtN(spacingOf(curTask(t)).itemGap)} mm` }; },
    start: () => ({ g0: spacingOf(curTask(t)).itemGap }),
    move: (ev, c) => { const mm = clampN(Math.round((c.g0 + (ev.clientY - c.y0) / c.s / MM) * 2) / 2, MINS.itemGap, 20), tt = curTask(t); if (spacingOf(tt).itemGap === mm) return null; tt.spacing.overrides.itemGap = mm; el.style.setProperty('--ig', mm + 'mm'); return `cách ${fmtN(mm)} mm`; },
    reset: tt => { delete tt.spacing.overrides.itemGap; } });
}
// Khoảng cách giữa các nhóm (bài đọc → câu hỏi ở T8; ảnh → nội dung ở T1)
function hGroupGap(t, el, fk) {
  const L = layoutOf(t); let a, b;
  if (L === 'T8') { a = el.querySelector('.wrapbox'); b = el.querySelector('.body>.g3'); }
  else if (L === 'T1') { a = el.querySelector('.body>.g1'); b = a && a.nextElementSibling; }
  if (!a || !b) return;
  mkH(el, 'rsz rsz-g', { for: fk, param: 'sp.groupGap', title: 'Kéo để đổi khoảng cách giữa các nhóm (bước 0,5 mm).',
    place: (tr, s) => { const x = relR(a.getBoundingClientRect(), tr, s), y = relR(b.getBoundingClientRect(), tr, s); return { left: x.left, width: Math.min(x.width, 30 * MM), top: (x.bottom + y.top) / 2, tip: `cách ${fmtN(spacingOf(curTask(t)).groupGap)} mm` }; },
    start: () => ({ g0: spacingOf(curTask(t)).groupGap }),
    move: (ev, c) => { const mm = clampN(Math.round((c.g0 + (ev.clientY - c.y0) / c.s / MM) * 2) / 2, MINS.groupGap, 20), tt = curTask(t); if (spacingOf(tt).groupGap === mm) return null; tt.spacing.overrides.groupGap = mm; el.style.setProperty('--gg', mm + 'mm'); return `cách ${fmtN(mm)} mm`; },
    reset: tt => { delete tt.spacing.overrides.groupGap; } });
}
function hWho(t, el, fk) {
  if (ck(t) !== 'dialogue') return; const who = el.querySelector('.dl:not(.intro) .who'); if (!who) return;
  mkH(el, 'rsz rsz-w', { for: fk, param: 'whoW', title: 'Kéo để đổi độ rộng cột tên người nói (bước 1 mm).',
    place: (tr, s) => { const r = relR(who.getBoundingClientRect(), tr, s); return { left: r.right, top: r.top, height: r.height, tip: `tên ${Math.round(r.width / MM)} mm` }; },
    start: () => ({ l: who.getBoundingClientRect().left }),
    move: (ev, c) => { const mm = clampN(Math.round((ev.clientX - c.l) / c.s / MM), 6, 40), tt = curTask(t); if (tt.layout.whoW === mm) return null; tt.layout.whoW = mm; el.style.setProperty('--who', mm + 'mm'); return `tên ${mm} mm`; },
    reset: tt => { tt.layout.whoW = null; } });
}
function hColGap(t, el, fk) {
  if (layoutOf(t) !== 'T5' || cellDirOf(t) === 'row' || colsOf(t) < 2) return;
  const grid = el.querySelector('.grid'); if (!grid || grid.children.length < 2) return;
  const a = grid.children[0], b = grid.children[1];
  mkH(el, 'rsz rsz-cg', { for: fk, param: 'colGap', title: 'Kéo để đổi khoảng cách giữa các cột (bước 1 mm).',
    place: (tr, s) => { const ra = relR(a.getBoundingClientRect(), tr, s), rb = relR(b.getBoundingClientRect(), tr, s); return { left: (ra.right + rb.left) / 2, top: ra.top, height: Math.min(ra.height, 30 * MM), tip: `cách ${Math.round((rb.left - ra.right) / MM)} mm` }; },
    start: () => ({ g0: (b.getBoundingClientRect().left - a.getBoundingClientRect().right) / scaleNow() / MM }),
    move: (ev, c) => { const mm = clampN(Math.round(c.g0 + (ev.clientX - c.x0) / c.s / MM), 2, 20), tt = curTask(t); if (tt.layout.colGap === mm) return null; tt.layout.colGap = mm; el.style.setProperty('--cg', mm + 'mm'); return `cách ${mm} mm`; },
    reset: tt => { tt.layout.colGap = null; } });
}
function hRowCell(t, el, key, withRowH) {
  const cell = el.querySelector(`.cell.row[data-cell="${key}"]`); if (!cell) return;
  const box = cell.querySelector('.rowbody'), edge = box.firstElementChild, fk = `${t.id}:G2:${key}`, sl = { type: 'group', id: t.id, g: 'G2', item: key };
  const mut = fn => { const tt = curTask(t); tt.layout.cells = tt.layout.cells || {}; fn(tt.layout.cells[key] = tt.layout.cells[key] || {}); };
  mkH(el, 'splitter rowsp', { for: fk, param: 'split', title: 'Kéo để đổi tỉ lệ ngang của hàng này (bước 5%).',
    place: (tr, s) => { const b = relR(box.getBoundingClientRect(), tr, s), e = relR(edge.getBoundingClientRect(), tr, s), gap = parseFloat(getComputedStyle(box).columnGap) || 0; const r = cellSplit(cellCfg(curTask(t), key)); return { left: e.right + gap / 2, top: b.top, height: b.height, tip: `${r} / ${100 - r}` }; },
    move: ev => { const b = box.getBoundingClientRect(), r = clampN(Math.round((ev.clientX - b.left) / b.width * 20) * 5, 15, 50); if (cellSplit(cellCfg(curTask(t), key)) === r) return null; mut(c => { c.split = r === 25 ? null : r; }); box.style.setProperty('--tpl', `${r}fr ${100 - r}fr`); return `${r} / ${100 - r}`; },
    reset: tt => { const c = tt.layout.cells && tt.layout.cells[key]; if (c) c.split = null; } });
  if (withRowH) mkH(el, 'rsz rsz-h', { for: fk, param: 'rowH', sel: sl, title: 'Kéo để đổi chiều cao hàng (bước 5 mm).',
    place: (tr, s) => { const r = relR(box.getBoundingClientRect(), tr, s); return { left: r.left, width: r.width, top: r.bottom, tip: `hàng ${Math.round(r.height / MM)} mm` }; },
    start: () => ({ top: box.getBoundingClientRect().top }),
    move: (ev, c) => { const mm = clampN(Math.round((ev.clientY - c.top) / c.s / MM / 5) * 5, 10, 120); if (cellCfg(curTask(t), key).rowH === mm) return null; mut(x => { x.rowH = mm; }); cell.style.setProperty('--rowh', mm); return `hàng ${mm} mm`; },
    reset: tt => { const c = tt.layout.cells && tt.layout.cells[key]; if (c) c.rowH = null; } });
}
// Tay kéo khung ảnh dùng chung cho ảnh G1 và ô ảnh T5: chiều cao luôn có; chấm tâm khi đã Fit
function frameHandles(el, o) { // o: {pic, fk, sl, get(), mut(fn), boxEl, attrFit, attrIh, min}
  if (o.hOk !== false) mkH(el, 'rsz rsz-h', { for: o.fk, param: 'frame.h', sel: o.sl, title: 'Kéo để đổi chiều cao khung ảnh (bước 5 mm). Ở chế độ Bình thường, kéo sẽ tạo khung Fit ngang.',
    place: (tr, s) => { const r = relR(o.pic.getBoundingClientRect(), tr, s); return { left: r.left, width: r.width, top: r.bottom, tip: `cao ${Math.round(r.height / MM)} mm` }; },
    move: (ev, c) => { const r = o.pic.getBoundingClientRect(), mm = clampN(Math.round((ev.clientY - r.top) / c.s / MM / 5) * 5, o.min || 25, 150), f = o.get(); if (f.h === mm && f.fit) return null; o.mut(fr => { if (!fr.fit) { fr.fit = 'width'; o.boxEl.setAttribute(o.attrFit, 'width'); } fr.h = mm; }); o.boxEl.style.setProperty('--ih', mm); o.boxEl.setAttribute(o.attrIh, '1'); return `cao ${mm} mm`; },
    reset: tt => o.mut(fr => { fr.h = null; }, tt) });
  if (o.get().fit) mkH(el, 'rsz rsz-c', { for: o.fk, param: 'frame.ox', sel: o.sl, title: 'Kéo để dời ảnh lệch tâm khung.',
    place: (tr, s) => { const r = relR(o.pic.getBoundingClientRect(), tr, s); return { left: (r.left + r.right) / 2, top: (r.top + r.bottom) / 2 }; },
    start: () => { const f = o.get(); return { ox0: f.ox || 0, oy0: f.oy || 0 }; },
    move: (ev, c) => { const pr = o.pic.getBoundingClientRect(), ir = o.pic.querySelector('img').getBoundingClientRect(), mx = Math.abs(ir.width - pr.width) / 2 / ir.width * 100, my = Math.abs(ir.height - pr.height) / 2 / ir.height * 100, nx = Math.round(clampN(c.ox0 + (ev.clientX - c.x0) / ir.width * 100, -mx, mx)), ny = Math.round(clampN(c.oy0 + (ev.clientY - c.y0) / ir.height * 100, -my, my)); o.mut(fr => { fr.ox = nx || null; fr.oy = ny || null; }); o.boxEl.style.setProperty('--ox', nx); o.boxEl.style.setProperty('--oy', ny); return null; },
    reset: tt => o.mut(fr => { fr.ox = fr.oy = fr.zoom = null; }, tt) });
}
function hFrame(t, el) {
  if (!t.image) return; const pic = el.querySelector('.g1 .pic'); if (!pic) return;
  const L = layoutOf(t), f = fitOf(t), fk = `${t.id}:G1`, sl = { type: 'group', id: t.id, g: 'G1' };
  frameHandles(el, { pic, fk, sl, boxEl: el, attrFit: 'data-fit', attrIh: 'data-ih', hOk: !(f === 'height' && isColI(t)),
    get: () => curTask(t).layout.frame, mut: (fn, tt) => fn((tt || curTask(t)).layout.frame) });
  if (L === 'T8') mkH(el, 'rsz rsz-w', { for: fk, param: 'frame.w', sel: sl, title: 'Kéo để đổi chiều rộng khung ảnh (bước 5%).',
    place: (tr, s) => { const r = relR(pic.getBoundingClientRect(), tr, s), g = relR(el.querySelector('.wrapbox').getBoundingClientRect(), tr, s), ia = el.getAttribute('data-ia'); return { left: ia === 'right' ? r.left : r.right, top: r.top, height: r.height, tip: `rộng ${Math.round(r.width / g.width * 100)}%` }; },
    move: ev => { const g = el.querySelector('.wrapbox').getBoundingClientRect(), ia = el.getAttribute('data-ia'), raw = ia === 'right' ? g.right - ev.clientX : ev.clientX - g.left, pct = clampN(Math.round(raw / g.width * 20) * 5, IW8[0], IW8[1]), fr = curTask(t).layout.frame, v = pct === IW8[2] ? null : pct; if ((fr.w ?? null) === v) return null; fr.w = v; el.style.setProperty('--iw', pct); return `rộng ${pct}%`; },
    reset: tt => { tt.layout.frame.w = null; } });
}
function hCellImg(t, el, key) {
  const box = el.querySelector(`.ci[data-ck="${key}"]`); if (!box) return;
  const cf = (tt, mk) => { tt.layout.cells = tt.layout.cells || {}; const c = tt.layout.cells[key] = tt.layout.cells[key] || {}; return (c.frame = c.frame || {}); };
  frameHandles(el, { pic: box.querySelector('.pic'), fk: `${t.id}:G1:${key}`, sl: { type: 'group', id: t.id, g: 'G1', item: key }, boxEl: box, attrFit: 'data-cf', attrIh: 'data-cih', min: 15,
    get: () => cellFr(curTask(t), key), mut: (fn, tt) => fn(cf(tt || curTask(t))) });
}
// Đáp án: tay kéo kích thước theo kiểu A (dòng, độ dài gạch, cỡ ô, khoảng cách lựa chọn…)
function hAnswer(t, el, key) {
  const a = t.answer, L = a.layout; if (!L) return;
  const q = key ? `[data-node="${t.id}:G3:${key}"]` : `[data-node^="${t.id}:G3:"], .a[data-node="${t.id}:G3"]`;
  const nodes = [...el.querySelectorAll(q)].filter(x => x.classList.contains('a') && !x.classList.contains('a4i') && !x.classList.contains('xl'));
  const n = nodes[0]; if (!n) return;
  const fk = key ? `${t.id}:G3:${key}` : `${t.id}:G3`, sl = key ? { type: 'group', id: t.id, g: 'G3', item: key } : { type: 'group', id: t.id, g: 'G3' };
  const setP = (tt, k, v) => { const p = tt.answer.params; if (key) { p.perItem = p.perItem || {}; (p.perItem[key] = p.perItem[key] || {})[k] = v; } else p[k] = v; };
  const eff = tt => pOf(tt, key ? { id: key } : null);
  const live = (prop, val, imp) => (key ? nodes : [...el.querySelectorAll(`[data-node^="${t.id}:G3"].a`)]).forEach(x => x.style.setProperty(prop, val, imp ? 'important' : ''));
  const sizeH = (target, param, mn, mx, def, step, title, unit, cssVar) => mkH(el, 'rsz rsz-w', { for: fk, param, sel: sl, title,
    place: (tr, s) => { const r = relR(target().getBoundingClientRect(), tr, s); return { left: r.right + 3 * MM, top: r.top - MM, height: Math.max(r.height + 2 * MM, 6 * MM), tip: `${String(eff(curTask(t))[param] ?? def).replace('.', ',')} ${unit}` }; },
    start: () => ({ l: target().getBoundingClientRect().left }),
    move: (ev, c) => { const mm = clampN(Math.round((ev.clientX - c.l) / c.s / MM / step) * step, mn, mx), tt = curTask(t); if (eff(tt)[param] === mm) return null; setP(tt, param, mm); live(cssVar, mm + 'mm'); return `${String(mm).replace('.', ',')} ${unit}`; },
    reset: tt => setP(tt, param, null) });
  if (L === 'A1' || L === 'A8') {
    const ln = L === 'A1' ? n.querySelector('.ln') : n;
    mkH(el, 'rsz rsz-h', { for: fk, param: 'lineMm', sel: sl, title: 'Kéo để đổi chiều cao dòng viết (bước 0,5 mm).',
      place: (tr, s) => { const r = relR(ln.getBoundingClientRect(), tr, s); return { left: r.left, width: Math.min(r.width, 40 * MM), top: r.bottom, tip: `dòng ${String(Math.round(r.height / MM * 2) / 2).replace('.', ',')} mm` }; },
      start: () => ({ top: ln.getBoundingClientRect().top }),
      move: (ev, c) => { const mm = clampN(Math.round((ev.clientY - c.top) / c.s / MM * 2) / 2, AGE[ws.age].line, 25), tt = curTask(t); if (Math.max(eff(tt).lineMm || 0, AGE[ws.age].line) === mm && eff(tt).lineMm) return null; setP(tt, 'lineMm', mm); live('--lh', mm + 'mm'); return `dòng ${String(mm).replace('.', ',')} mm`; },
      reset: tt => setP(tt, 'lineMm', null) });
    mkH(el, 'rsz rsz-w', { for: fk, param: 'w', sel: sl, title: 'Kéo để đổi độ rộng dòng (bước 5%).',
      place: (tr, s) => { const r = relR(n.getBoundingClientRect(), tr, s), al = eff(curTask(t)).align; return { left: al === 'right' ? r.left : r.right, top: r.top, height: Math.min(r.height, 20 * MM), tip: `rộng ${eff(curTask(t)).w || 100}%` }; },
      start: () => { const w0 = eff(curTask(t)).w || 100; return { w0, full: n.getBoundingClientRect().width / (w0 / 100) }; },
      move: (ev, c) => { const tt = curTask(t), pct = clampN(Math.round(dragPct(c, ev, c.w0, c.full, eff(tt).align) / 5) * 5, 40, 100), v = pct === 100 ? null : pct; if ((eff(tt).w ?? null) === v) return null; setP(tt, 'w', v); live('--aw', pct); return `rộng ${pct}%`; },
      reset: tt => setP(tt, 'w', null) });
  } else if (L === 'A2') {
    const inl = a.attach === 'inline';
    mkH(el, 'rsz rsz-w', { for: fk, param: inl ? 'lenMm' : 'width', sel: sl, title: inl ? 'Kéo để đổi độ dài gạch (bước 5 mm).' : 'Kéo để đổi độ rộng ô trống (bước 1 ký tự).',
      place: (tr, s) => { const r = relR(n.getBoundingClientRect(), tr, s); return { left: r.right, top: r.top - 2 * MM, height: Math.max(r.height, 6 * MM), tip: inl ? `dài ${Math.round(r.width / MM)} mm` : `${eff(curTask(t)).width || Math.round(parseFloat(n.style.width)) || ''} ký tự` }; },
      start: () => { const r = n.getBoundingClientRect(), chs = parseFloat(n.style.width) || 10; return { l: r.left, pxCh: /ch/.test(n.style.width) ? r.width / chs : MM * scaleNow() * 2.2 }; },
      move: (ev, c) => { const tt = curTask(t);
        if (inl) { const mm = clampN(Math.round((ev.clientX - c.l) / c.s / MM / 5) * 5, 15, 150); if (eff(tt).lenMm === mm && eff(tt).lenMode === 'fixed') return null; setP(tt, 'lenMm', mm); setP(tt, 'lenMode', 'fixed'); live('width', mm + 'mm'); return `dài ${mm} mm`; }
        const ch = clampN(Math.round((ev.clientX - c.l) / c.pxCh), 4, 30); if (eff(tt).width === ch) return null; setP(tt, 'width', ch); live('width', ch + 'ch', true); return `${ch} ký tự`; },
      reset: tt => { setP(tt, inl ? 'lenMm' : 'width', null); } });
  } else if (L === 'A3') sizeH(() => n.querySelector('i'), 'boxW', 5, 12, 6.5, .5, 'Kéo để đổi cỡ ô chữ (bước 0,5 mm).', 'mm', '--bw');
  else if (L === 'A4' && a.attach !== 'inline') {
    const o1 = n.querySelector('.opt');
    mkH(el, 'rsz rsz-w', { for: fk, param: 'gap', sel: sl, title: 'Kéo để đổi khoảng cách giữa các lựa chọn (bước 1 mm).',
      place: (tr, s) => { const r = relR(o1.getBoundingClientRect(), tr, s); return { left: r.right, top: r.top, height: r.height, tip: `cách ${eff(curTask(t)).gap ?? 7} mm` }; },
      start: () => ({ g0: eff(curTask(t)).gap ?? 7 }),
      move: (ev, c) => { const mm = clampN(Math.round(c.g0 + (ev.clientX - c.x0) / c.s / MM), 2, 20), tt = curTask(t); if ((eff(tt).gap ?? 7) === mm) return null; setP(tt, 'gap', mm); live('--og', mm + 'mm'); return `cách ${mm} mm`; },
      reset: tt => setP(tt, 'gap', null) });
  } else if (L === 'A5') sizeH(() => n, 'size', 4, 12, 6.5, .5, 'Kéo để đổi cỡ ô tick (bước 0,5 mm).', 'mm', '--as');
  else if (L === 'A6') sizeH(() => n.firstElementChild, 'size', 5, 12, 7.5, .5, 'Kéo để đổi cỡ ô T/F (bước 0,5 mm).', 'mm', '--as');
  else if (L === 'A7') sizeH(() => n, 'size', 1.5, 6, 2.8, .5, 'Kéo để đổi cỡ chấm nối (bước 0,5 mm).', 'mm', '--as');
}
function hBank(t, el) {
  const wb = t.wordBank; if (!wb) return; const fk = `${t.id}:G4`;
  if (wb.placement === 'right') { hSplit(t, el, fk, '@split'); return; }
  const g4 = el.querySelector('.g4'); if (!g4) return;
  mkH(el, 'rsz rsz-w', { for: fk, param: 'w', title: 'Kéo để đổi độ rộng khung từ (bước 5%).',
    place: (tr, s) => { const r = relR(g4.getBoundingClientRect(), tr, s); return { left: curTask(t).wordBank.align === 'right' ? r.left : r.right, top: r.top, height: r.height, tip: `rộng ${curTask(t).wordBank.w || 100}%` }; },
    start: () => { const w0 = curTask(t).wordBank.w || 100; return { w0, full: g4.getBoundingClientRect().width / (w0 / 100) }; },
    move: (ev, c) => { const tt = curTask(t), al = tt.wordBank.align || 'center', pct = clampN(Math.round(dragPct(c, ev, c.w0, c.full, al) / 5) * 5, 30, 100), v = pct === 100 ? null : pct; if ((tt.wordBank.w ?? null) === v) return null; tt.wordBank.w = v; g4.style.width = pct + '%'; g4.style.justifySelf = JS[al]; return `rộng ${pct}%`; },
    reset: tt => { tt.wordBank.w = null; } });
}
function placeTblHandles(el) {
  const s = scaleNow(), tr = el.getBoundingClientRect();
  el.querySelectorAll('.rsz-tc,.rsz-tr').forEach(h => {
    const g = h.__g; if (!g) return; const kids = [...g.children];
    if (h.classList.contains('rsz-tc')) {
      const k = +h.dataset.k, c = kids[1 + k], c0 = kids[1], r = c.getBoundingClientRect(), r0 = c0.getBoundingClientRect();
      h.style.left = (r.right - tr.left) / s + 'px'; h.style.top = (r0.top - tr.top) / s + 'px'; h.style.height = r0.height / s + 'px';
      h.querySelector('.tip').textContent = `${Math.round(r.width / (g.getBoundingClientRect().width - kids[0].getBoundingClientRect().width) * 100)}%`;
    } else {
      const c = kids.find(x => x.dataset.rk === h.dataset.rk), r = c.getBoundingClientRect(), gr = g.getBoundingClientRect();
      h.style.left = (gr.right - tr.left) / s + 'px'; h.style.top = (r.bottom - tr.top) / s + 'px';
      h.querySelector('.tip').textContent = `${Math.round(r.height / s / MM)} mm`;
    }
  });
}
function hTable(t, el, fk) {
  if (layoutOf(t) !== 'T9') return;
  const nC = t.content.cols.length, tot = nC + (tblOpts(t).rowHead ? 1 : 0);
  el.querySelectorAll('.tg').forEach(g => {
    g.dataset.tot = tot;
    const mk = (cls, title, param) => { const d = document.createElement('div'); d.className = 'rsz ' + cls; d.title = title; d.dataset.for = fk; d.dataset.param = param; d.innerHTML = '<span class="tip"></span>'; d.__g = g; el.appendChild(d); return d; };
    for (let k = 0; k < tot - 1; k++) { const h = mk('rsz-tc', 'Kéo để đổi độ rộng cột. Bấm đúp để về tự động.', 'tbl.cw'); h.dataset.k = k; bindTc(h, g, k); }
    const seen = new Set();
    [...g.children].forEach(c => { const rk = c.dataset.rk; if (rk == null || seen.has(rk)) return; seen.add(rk); const h = mk('rsz-tr', 'Kéo để đổi chiều cao hàng. Bấm đúp để về tự động.', 'tbl.rhs'); h.dataset.rk = rk; bindTr(h, g, rk); });
  });
  placeTblHandles(el);
  function bindTc(h, g, k) {
    h.addEventListener('dblclick', e => { e.stopPropagation(); commit(w => { const o = w.tasks.find(x => x.id === t.id).layout.table; if (o) o.cw = null; }); });
    h.addEventListener('pointerdown', e => {
      e.preventDefault(); e.stopPropagation(); h.setPointerCapture(e.pointerId);
      const before = clone(ws), kids = [...g.children], ws0 = kids.slice(1, 1 + tot).map(c => c.getBoundingClientRect().width), sx = e.clientX, s = scaleNow();
      const total = ws0.reduce((a, b) => a + b, 0), pair = ws0[k] + ws0[k + 1], minW = 10 * MM * s;
      let last = null;
      const move = ev => {
        const a = clampN(ws0[k] + (ev.clientX - sx), minW, pair - minW), w2 = ws0.slice(); w2[k] = a; w2[k + 1] = pair - a;
        const pc = w2.map(x => Math.round(x / total * 1000) / 10);
        pc[k + 1] = Math.round(((ws0[k] + ws0[k + 1]) / total * 100 - pc[k]) * 10) / 10;
        last = pc; el.querySelectorAll('.tg').forEach(n => n.style.setProperty('--tcols', pc.map(x => `minmax(0,${x}fr)`).join(' ')));
        placeTblHandles(el);
      };
      const up = () => {
        h.removeEventListener('pointermove', move); h.removeEventListener('pointerup', up); h.removeEventListener('pointercancel', up);
        if (last) { const tt = ws.tasks.find(x => x.id === t.id); tt.layout.table = Object.assign(tt.layout.table || {}, { cw: last }); hist.push(before); fut = []; }
        render();
      };
      h.addEventListener('pointermove', move); h.addEventListener('pointerup', up); h.addEventListener('pointercancel', up);
    });
  }
  function bindTr(h, g, rk) {
    h.addEventListener('dblclick', e => { e.stopPropagation(); commit(w => { const o = w.tasks.find(x => x.id === t.id).layout.table; if (o && o.rhs) { delete o.rhs[rk]; if (!Object.keys(o.rhs).length) o.rhs = null; } }); });
    h.addEventListener('pointerdown', e => {
      e.preventDefault(); e.stopPropagation(); h.setPointerCapture(e.pointerId);
      const before = clone(ws), s = scaleNow(), cells = el.querySelectorAll(`.tg > [data-rk="${rk}"]`), h0 = cells[0].getBoundingClientRect().height, sy = e.clientY;
      let last = null; el.querySelectorAll('.tg').forEach(n => { n.style.gridTemplateRows = 'none'; });
      const move = ev => { const mm = Math.max(6, Math.round((h0 + ev.clientY - sy) / s / MM)); last = mm; cells.forEach(c => { c.style.minHeight = mm + 'mm'; }); placeTblHandles(el); };
      const up = () => {
        h.removeEventListener('pointermove', move); h.removeEventListener('pointerup', up); h.removeEventListener('pointercancel', up);
        if (last != null) { const tt = ws.tasks.find(x => x.id === t.id), o = tt.layout.table = tt.layout.table || {}; o.rhs = Object.assign({}, o.rhs, { [rk]: last }); o.rows = 'auto'; hist.push(before); fut = []; }
        render();
      };
      h.addEventListener('pointermove', move); h.addEventListener('pointerup', up); h.addEventListener('pointercancel', up);
    });
  }
}
// Tay kéo theo container đang chọn
function addHandles() {
  if (sel.type === 'sheet') return;
  const t = ws.tasks.find(x => x.id === sel.id); if (!t) return;
  const el = stage.querySelector(`.task[data-task="${t.id}"]`); if (!el) return;
  const k = kindOf(t, sel), g2 = `${t.id}:G2`, elTF = [...stage.querySelectorAll(`.task[data-task="${t.id}"]`)].find(e => e.querySelector('.qb > .a6')) || el;   // v106: Task bị cắt trang: tay kéo T / F nằm ở mảnh có cột T / F
  if (k === 'task') { hSplit(t, el, g2); hT7(t, el, g2); hT6(t, el, g2); hTF(t, elTF, g2); hItemGap(t, el, g2); hGroupGap(t, el, g2); hWho(t, el, g2); hColGap(t, el, g2); hTable(t, el, g2); cellKeys(t, 'crow').forEach(key => hRowCell(t, el, key, false)); hFrame(t, el); }
  else if (k === 'frame') hFrame(t, el);
  else if (k === 'cimgs') cellKeys(t, 'cimg').forEach(key => hCellImg(t, el, key));
  else if (k === 'cimg') { hCellImg(t, el, sel.item); if (cellDirOf(t) === 'row') hRowCell(t, el, sel.item, false); }
  else if (k === 'crow') hRowCell(t, el, sel.item, true);
  else if (k === 'answer') { hAnswer(t, el, null); hTF(t, elTF, `${t.id}:G3`); }
  else if (k === 'aitem') { hAnswer(t, el, sel.item); hTF(t, elTF, `${t.id}:G3`); }
  else if (k === 'bank') hBank(t, el);
  placeAll(el); if (elTF !== el) placeAll(elTF);
}

/* ================= Mô hình container ================= */
// Mỗi thứ chọn được là một container. Loại container quyết định panel, tay kéo, thông số và cách "Áp cho…".
const GNAME = { GT: 'Khối tự do', G0: 'Tiêu đề', G1: 'Ảnh', G2: 'Nội dung', G3: 'Đáp án', G4: 'Khung từ' };
const TLS = { T1: 'Xếp dọc', T2: 'Ảnh trái', T3: 'Ảnh phải', T4: 'Hai cột', T5: 'Lưới', T6: 'Nội dung', T7: 'Nối', T8: 'Bao chữ', T9: 'Bảng' };
const cd = c => `<small class="cd">${c}</small>`;
function kindOf(t, s) {
  if (!s || s.type === 'sheet') return 'sheet';
  if (s.type === 'task') return 'task';
  if (s.tc) return 'cimg';
  const g = s.g, it = s.item;
  if (g === 'GT') return it && gtOf(t, it) ? 'gt' : 'task';
  if (g === 'G0') return 'head';
  if (g === 'G1') return it ? 'cimg' : (cellImgMode(t) && !t.image ? 'cimgs' : 'frame');   // v86: lưới ảnh có ảnh chung → G1 = ảnh chung (panel Ảnh chung); chỉnh mọi ô cùng lúc bằng "Áp cho · Cả Task"
  if (g === 'G2') return it ? 'crow' : 'task';
  if (g === 'G3') return it ? 'aitem' : 'answer';
  if (g === 'G4') return 'bank';
  return 'task';
}
// Đối tượng cấu hình của container (tham chiếu thật). mk = tạo nếu chưa có.
function cfgOf(t, s, mk) {
  const k = kindOf(t, s), L = t.layout;
  if (k === 'task' || k === 'frame') return L;
  if (k === 'cimg' || k === 'crow') { if (!L.cells) { if (!mk) return {}; L.cells = {}; } return L.cells[s.item] || (mk ? (L.cells[s.item] = {}) : {}); }
  if (k === 'answer') return t.answer.params;
  if (k === 'aitem') { const p = t.answer.params; if (!p.perItem) { if (!mk) return {}; p.perItem = {}; } return p.perItem[s.item] || (mk ? (p.perItem[s.item] = {}) : {}); }
  if (k === 'bank') return t.wordBank;
  if (k === 'gt') return gtOf(t, s.item) || {};
  return {};
}
function payloadOf(t, s) {
  const k = kindOf(t, s), L = t.layout;
  if (k === 'task') return { split: L.split, cols: L.cols, align: L.align, valign: L.valign, width: L.width, cw: L.cw, rowH: L.rowH, whoW: L.whoW, colGap: L.colGap, break: L.break, _sp: clone(t.spacing) };
  if (k === 'frame') return { frame: clone(L.frame || {}) };
  if (k === 'cimg') return { frame: clone(cellFr(t, s.item)) };
  if (k === 'crow') { const c = cellCfg(t, s.item); return { split: c.split ?? null, valign: c.valign ?? null, rowH: c.rowH ?? null }; }
  if (k === 'answer') { const o = clone(t.answer.params || {}); delete o.perItem; return o; }
  if (k === 'aitem') return clone(((t.answer.params || {}).perItem || {})[s.item] || {});
  if (k === 'bank') { const b = t.wordBank || {}; return { w: b.w ?? null, align: b.align ?? null, valign: b.valign ?? null, style: b.style, label: b.label, placement: b.placement }; }
  return {};
}
function pasteInto(t, s, pl) {
  const k = kindOf(t, s), L = t.layout;
  if (k === 'task') Object.keys(pl).forEach(x => { if (x === '_sp') t.spacing = clone(pl._sp); else L[x] = clone(pl[x] ?? null); });
  else if (k === 'frame') L.frame = clone(pl.frame || {});
  else if (k === 'cimg') cfgOf(t, s, true).frame = clone(pl.frame || {});
  else if (k === 'crow') Object.assign(cfgOf(t, s, true), clone(pl));
  else if (k === 'answer') { const pi = t.answer.params.perItem; t.answer.params = clone(pl); if (pi) t.answer.params.perItem = pi; }
  else if (k === 'aitem') { const p = t.answer.params; p.perItem = p.perItem || {}; p.perItem[s.item] = clone(pl); }
  else if (k === 'bank' && t.wordBank) Object.assign(t.wordBank, clone(pl));
  tidy(t);
}
const flat = (o, pre = '', out = {}) => { Object.keys(o || {}).forEach(k => { const v = o[k], p = pre + k; if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, p + '.', out); else out[p] = v; }); return out; };
function setRaw(obj, path, v) {
  const ks = path.split('.'); let o = obj;
  for (let i = 0; i < ks.length - 1; i++) { if (o[ks[i]] == null) o[ks[i]] = {}; o = o[ks[i]]; }
  o[ks[ks.length - 1]] = v;
}
// Kéo một container khi đang chọn nhiều: các container cùng loại nhận đúng phần đã đổi
function propagate(before, src) {
  const tg = selTargets(ws).filter(([t, s]) => nodeKey(s) !== nodeKey(src)); if (!tg.length) return;
  const t1 = ws.tasks.find(x => x.id === src.id), t0 = before.tasks.find(x => x.id === src.id); if (!t1 || !t0) return;
  const a = flat(payloadOf(t1, src)), b = flat(payloadOf(t0, src));
  const ch = Object.keys(Object.assign({}, a, b)).filter(p => JSON.stringify(a[p] ?? null) !== JSON.stringify(b[p] ?? null));
  tg.forEach(([t, s]) => { if (kindOf(t, s) !== kindOf(t1, src)) return; const c = cfgOf(t, s, true); ch.forEach(p => { if (p.startsWith('_sp.')) setRaw(t.spacing, p.slice(4), a[p] ?? undefined); else if (kindOf(t, s) === 'cimg') setRaw(c, p, a[p] ?? null); else setRaw(c, p, a[p] ?? null); }); tidy(t); });
}
// Các container đang được chỉnh: container chính + các container chọn thêm (cùng loại). Chọn nhóm Ảnh của Lưới = mọi ô ảnh.
function selTargets(w) {
  if (sel.type === 'sheet') return [];
  const t0 = w.tasks.find(x => x.id === sel.id); if (!t0) return [];
  const k0 = kindOf(t0, sel);
  if (k0 === 'cimgs') return cellKeys(t0, 'cimg').map(k => [t0, { type: 'group', id: t0.id, g: 'G1', item: k }]);
  return [sel, ...multi].map(s => [w.tasks.find(x => x.id === s.id), s]).filter(([t, s]) => t && kindOf(t, s) === k0);
}
function setPath(t, s, p, v) {
  if (p.startsWith('sp.')) { const k = p.slice(3); if (v == null) delete t.spacing.overrides[k]; else t.spacing.overrides[k] = v; return; }
  let baseObj, path = p;
  if (p[0] === '@') { baseObj = t.layout; path = p.slice(1); }
  else if (p.startsWith('tbl.')) { t.layout.table = t.layout.table || {}; baseObj = t.layout.table; path = p.slice(4); }
  else baseObj = cfgOf(t, s, true);
  const ks = path.split('.'); let o = baseObj;
  for (let i = 0; i < ks.length - 1; i++) { if (o[ks[i]] == null) o[ks[i]] = /^\d+$/.test(ks[i + 1]) ? [] : {}; o = o[ks[i]]; }
  const last = ks[ks.length - 1];
  if (Array.isArray(o)) o[+last] = v; else if (v == null && !(baseObj === t.layout && ks.length === 1)) delete o[last]; else o[last] = v;
  postSet(t, s, p, v);
}
// Hệ quả của một thay đổi (giữ dữ liệu nhất quán)
function postSet(t, s, p, v) {
  const L = t.layout, c = cfgOf(t, s, true);
  if (p === 'frame.fit' && c.frame) { c.frame.ox = c.frame.oy = c.frame.zoom = null; }
  if (p === 'frame.h' && v != null) { c.frame = c.frame || {}; if (!c.frame.fit) c.frame.fit = 'width'; }
  if (p === 'dir') { L.cols = null; L.split = null; }
  if (p.startsWith('cw.')) {
    if (v == null) L.cw = null;
    else { const cw = t7cw(t).slice(), i = +p.slice(3); cw[i] = clampN(v, 10, 80); const rest = 100 - cw[i], oth = [0, 1, 2].filter(j => j !== i), sum = oth.reduce((a, j) => a + (L.cw && L.cw[j] != null ? L.cw[j] : T7CW[j]), 0); oth.forEach(j => { cw[j] = Math.round((L.cw && L.cw[j] != null && j !== i ? L.cw[j] : T7CW[j]) / sum * rest * 10) / 10; }); L.cw = cw; }
  }
  if (p === 'lenMm' && v != null) c.lenMode = 'fixed';
  if (p === '@ta' && L.align === 'justify') L.align = null;   // v97: bỏ cách ghi cũ của Ảnh trong bài đọc
  if (p.startsWith('tbl.')) {
    const o = L.table;
    if (p === 'tbl.cols') o.cw = null;
    if (p === 'tbl.fc' && v) o.fr = 'none';
    if (p === 'tbl.nm') { delete o.num; if (v == null) o.nm = 'out'; }   // v96: dữ liệu cũ num:false không còn che lựa chọn mới
    if (p.startsWith('tbl.cw.')) { const i = +p.split('.')[2], cur = tblColPct(t); if (v == null) o.cw = null; else { const pct = clampN(v, 5, 90), rest = 100 - pct, oth = cur.map((x, j) => j).filter(j => j !== i), sum = oth.reduce((a, j) => a + cur[j], 0) || 1; const n = cur.slice(); n[i] = pct; oth.forEach(j => { n[j] = Math.round(cur[j] / sum * rest * 10) / 10; }); o.cw = n; } }
    if (p.startsWith('tbl.rhs.') && v != null) o.rows = 'auto';
  }
}
// Độ rộng hiện tại các cột bảng (%), đo trên trang nếu cần
function tblColPct(t) {
  const o = tblOpts(t), nC = t.content.cols.length, tot = nC + (o.rowHead ? 1 : 0);
  if (Array.isArray(o.cw) && o.cw.length === tot) return o.cw.slice();
  const g = stage.querySelector(`.task[data-task="${t.id}"] .tg`);
  if (g) { const kids = [...g.children].slice(1, 1 + tot).map(c => c.getBoundingClientRect().width), sum = kids.reduce((a, b) => a + b, 0); if (sum) return kids.map(x => Math.round(x / sum * 1000) / 10); }
  return Array(tot).fill(Math.round(1000 / tot) / 10);
}
const SCOPES = [['col', 'Ô cùng cột'], ['task', 'Cả Task'], ['type', 'Task cùng dạng'], ['sheet', 'Cả phiếu']];
function targetsOf(t, s, scope) {
  const k = kindOf(t, s), out = [], same = x => presetKey(x) === presetKey(t), me = nodeKey(s);
  const push = s2 => { if (nodeKey(s2) !== me) out.push(s2); };
  if (k === 'cimg' || k === 'crow' || k === 'cimgs') {
    const kk = k === 'crow' ? 'crow' : 'cimg', ks = cellKeys(t, kk), g = s.g;
    if (scope === 'col' && k !== 'cimgs') { const n = colsOf(t), ids = its(t).map(i => i.id), base0 = String(s.item).split('.'), i0 = ids.indexOf(base0[0]); ks.forEach(x => { const b = String(x).split('.'), i = ids.indexOf(b[0]); if (i % n === i0 % n && (b[1] == null || b[1] === base0[1])) push({ type: 'group', id: t.id, g, item: x }); }); }
    if (scope === 'task' && k !== 'cimgs') ks.forEach(x => push({ type: 'group', id: t.id, g, item: x }));
    if (scope === 'type' || scope === 'sheet') ws.tasks.forEach(t2 => { if (scope === 'type' && !same(t2)) return; if (k !== 'cimgs' || t2 !== t) cellKeys(t2, kk).forEach(x => push({ type: 'group', id: t2.id, g, item: x })); });
  } else if (k === 'aitem') { if (scope === 'task') itemKeys(t).forEach(x => push({ type: 'group', id: t.id, g: 'G3', item: x })); }
  else if (k === 'frame') { if (scope === 'type' || scope === 'sheet') ws.tasks.forEach(t2 => { if (t2.image && !cellImgMode(t2) && (scope === 'sheet' || same(t2))) push({ type: 'group', id: t2.id, g: 'G1' }); }); }
  else if (k === 'answer') { if (scope === 'type' || scope === 'sheet') ws.tasks.forEach(t2 => { if (t2.answer.layout === t.answer.layout && (scope === 'sheet' || same(t2))) push({ type: 'group', id: t2.id, g: 'G3' }); }); }
  else if (k === 'bank') { if (scope === 'type' || scope === 'sheet') ws.tasks.forEach(t2 => { if (t2.wordBank && (scope === 'sheet' || same(t2))) push({ type: 'group', id: t2.id, g: 'G4' }); }); }
  else if (k === 'task') { if (scope === 'type' || scope === 'sheet') ws.tasks.forEach(t2 => { if (scope === 'sheet' || same(t2)) push({ type: 'task', id: t2.id }); }); }
  return out;
}
function applyScope(scope) {
  const t = curT(ws), k = kindOf(t, sel), tg = targetsOf(t, sel, scope); if (!tg.length) return;
  const src = k === 'cimgs' ? { type: 'group', id: t.id, g: 'G1', item: cellKeys(t, 'cimg')[0] } : sel;
  commit(w => {
    const ts = w.tasks.find(x => x.id === t.id);
    if (k === 'task' && scope === 'type') { tg.forEach(s => { const x = w.tasks.find(y => y.id === s.id); const b0 = x.layout.break; x.layout = clone(ts.layout); x.layout.break = b0; x.spacing = clone(ts.spacing); x.answer.attach = ts.answer.attach; x.answer.layout = ts.answer.layout; x.answer.params = clone(ts.answer.params); tidy(x); }); return; }
    const pl = payloadOf(ts, src);
    if (k === 'task' && scope === 'sheet') { tg.forEach(s => { const x = w.tasks.find(y => y.id === s.id); x.spacing = clone(ts.spacing); if (x.layout.break !== 'join' && ts.layout.break !== 'join') x.layout.break = ts.layout.break; }); return; }
    tg.forEach(s => pasteInto(w.tasks.find(y => y.id === s.id), s, pl));
  }, `Đã áp cho ${tg.length} container`);
}
// Container có chỉnh tay không (chấm xanh trên cây)
function ovOf(t, s) {
  const k = kindOf(t, s), L = t.layout;
  if (k === 'task') return L.task !== 'auto' || ['split', 'cols', 'dir', 'align', 'valign', 'width', 'cw', 'rowH', 'whoW', 'colGap', 'break', 'table', 'num', 'order'].some(x => L[x] != null) || !!t.spacing.preset || Object.keys(t.spacing.overrides).length > 0;
  if (k === 'frame') return Object.keys(L.frame || {}).length > 0;
  if (k === 'gt') { const x = gtOf(t, s.item) || {}; return x.size != null || x.align != null || x.frame != null || x.w != null || x.cols != null; }
  if (k === 'cimgs') return cellKeys(t, 'cimg').some(x => Object.keys(cellFr(t, x)).length);
  if (k === 'cimg') return Object.keys(cellFr(t, s.item)).length > 0;
  if (k === 'crow') { const c = cellCfg(t, s.item); return c.split != null || c.valign != null || c.rowH != null; }
  if (k === 'answer') return Object.keys(payloadOf(t, s)).length > 0;
  if (k === 'aitem') return Object.keys(payloadOf(t, s)).length > 0;
  if (k === 'bank') { const b = t.wordBank, o = (baseTask(t) || {}).wordBank || {}; return b.w != null || b.align != null || b.valign != null || (o.placement && (b.placement !== o.placement || b.style !== o.style || (b.label || 'lower') !== (o.label || 'lower'))); }
  return false;
}
const baseTask = t => base.tasks.find(x => x.id === t.id);
function autoReset(t, s) {
  const k = kindOf(t, s), L = t.layout;
  if (k === 'task') { t.layout = LAYOUT_DEF(); t.spacing = { preset: null, overrides: {} }; }
  else if (k === 'frame') L.frame = {};
  else if (k === 'gt') { const x = gtOf(t, s.item); if (x) { delete x.size; delete x.align; delete x.frame; delete x.w; delete x.cols; } }
  else if (k === 'cimg') { const c = cfgOf(t, s, true); c.frame = null; }
  else if (k === 'crow') Object.assign(cfgOf(t, s, true), { split: null, valign: null, rowH: null });
  else if (k === 'answer') t.answer.params = {};
  else if (k === 'aitem') { const p = t.answer.params; if (p.perItem) delete p.perItem[s.item]; }
  else if (k === 'bank') { const o = (baseTask(t) || {}).wordBank || {}; Object.assign(t.wordBank, { w: null, align: null, valign: null }); if (o.placement) Object.assign(t.wordBank, { placement: o.placement, style: o.style, label: o.label }); }
  tidy(t);
}

/* ================= Cây container ================= */
function groupsOf(t) {
  const g = ['G0']; if (t.image || cellImgMode(t)) g.push('G1'); if (t.wordBank) g.push('G4'); if (ck(t) !== 'empty') g.push('G2');
  if (t.answer.layout) g.push('G3'); return g;
}
function hasOverride(t) { return ovOf(t, { type: 'task', id: t.id }) || Object.keys(frOf(t)).length > 0 || !!t.layout.cells; }
const isOnSel = s2 => [sel, ...multi].some(x => nodeKey(x) === nodeKey(s2));
// Task đang mở trong cột trái: chỉ một Task mở một lúc (accordion). Chuyển sang Task khác thì Task cũ tự thu gọn.
let openTask = null, lastSelTask = null, openedRendered = null;
function renderTree() {
  const tree = document.getElementById('tree');
  if (sel.type !== 'sheet') { if (sel.id !== lastSelTask) openTask = sel.id; lastSelTask = sel.id; }
  if (openTask && openTask !== sectFor) sectReset(openTask);
  if (sel.type === 'group' && sel.id === openTask && G_SEC[sel.g]) { const tt = ws.tasks.find(x => x.id === openTask), kk = tt && secOfSel(tt, sel); if (kk && !SECT[kk]) sectOne(kk); }   // ảnh của từng câu (group G1 nhưng không có ảnh chung) thuộc mục G3   // v83: chọn khối trên trang thì cột trái mở đúng mục
  let h = `<div class="ttools"><button class="btn pri" data-lib="1" title="Thêm Task vào cuối phiếu: từ mẫu có sẵn, hoặc từ file / dán (JSON, MD, chữ)">+ Task</button><button class="btn" data-newsheet="1" title="Tạo phiếu mới: từ file JSON / MD / chữ, hoặc phiếu trống. Thay phiếu đang mở sau khi xác nhận.">+ Phiếu</button></div><button class="tnode ${sel.type === 'sheet' ? 'on' : ''}" data-sel="sheet"><b>Phiếu</b><span class="tag">${ws.tasks.length} Task</span></button><ul class="tks">`;
  for (const t of ws.tasks) {
    const open = openTask === t.id, on = isOnSel({ type: 'task', id: t.id });
    h += `<li class="tk ${open ? 'open' : ''}${open && sel.type !== 'sheet' && sel.id === t.id ? ' cur' : ''}" data-tk="${t.id}"><div class="tkh"><button class="tnode ${on ? 'on' : open ? 'opn' : ''}" data-sel="task" data-id="${t.id}" aria-expanded="${open}"><span class="chev" title="${open ? 'Thu gọn Task' : 'Mở Task để soạn'}">▶</span><span class="n${t.part ? ' pt' : ''}">${t.number}${t.part || ''}</span><span class="tnm">${esc(taskLabel(t))}</span>${hasOverride(t) ? '<span class="ovmark" title="Có chỉnh tay"></span>' : ''}</button></div>`;
    if (open) h += `<div class="tkb">${edHtml(t)}</div>`;
    h += '</li>';
  }
  tree.innerHTML = h + '</ul>';
  if (openTask !== openedRendered) { openedRendered = openTask; const el = tree.querySelector('.tk.open'); if (el) el.scrollIntoView({ block: 'start' }); }
}

/* ================= Inspector ================= */
const ICON = {
  T1: '<rect x="2" y="2" width="32" height="4"/><rect class="i1" x="2" y="8" width="32" height="8"/><rect x="2" y="18" width="32" height="4"/><rect class="i3" x="2" y="24" width="32" height="3"/>',
  T2: '<rect x="2" y="2" width="32" height="4"/><rect class="i1" x="2" y="8" width="11" height="19"/><rect x="15" y="8" width="19" height="9"/><rect class="i3" x="15" y="19" width="19" height="8"/>',
  T3: '<rect x="2" y="2" width="32" height="4"/><rect x="2" y="8" width="19" height="9"/><rect class="i3" x="2" y="19" width="19" height="8"/><rect class="i1" x="23" y="8" width="11" height="19"/>',
  T4: '<rect x="2" y="2" width="32" height="4"/><rect class="i1" x="2" y="8" width="32" height="6"/><rect x="2" y="16" width="20" height="11"/><rect class="i3" x="24" y="16" width="10" height="11"/>',
  T5: '<rect x="2" y="2" width="32" height="4"/><rect class="i1" x="2" y="8" width="10" height="9"/><rect class="i1" x="13" y="8" width="10" height="9"/><rect class="i1" x="24" y="8" width="10" height="9"/><rect class="i1" x="2" y="18" width="10" height="9"/><rect class="i1" x="13" y="18" width="10" height="9"/><rect class="i1" x="24" y="18" width="10" height="9"/>',
  T6: '<rect x="2" y="2" width="32" height="4"/><rect x="2" y="8" width="32" height="12"/><rect class="i3" x="2" y="22" width="32" height="5"/>',
  T7: '<rect x="2" y="2" width="32" height="4"/><rect x="2" y="9" width="11" height="4"/><rect x="2" y="15" width="11" height="4"/><rect x="2" y="21" width="11" height="4"/><rect x="23" y="9" width="11" height="4"/><rect x="23" y="15" width="11" height="4"/><rect x="23" y="21" width="11" height="4"/><path class="i3" d="M14 11 L22 23 M14 17 L22 11" fill="none"/>',
  T8: '<rect x="2" y="2" width="32" height="4"/><rect x="2" y="8" width="32" height="3"/><rect x="2" y="13" width="20" height="3"/><rect x="2" y="18" width="20" height="3"/><rect class="i1" x="24" y="13" width="10" height="8"/><rect class="i3" x="2" y="23" width="32" height="4"/>',
  T9: '<rect x="2" y="2" width="32" height="4"/><rect class="i1" x="2" y="8" width="32" height="4"/><rect x="2" y="12" width="10" height="15"/><rect x="12" y="12" width="22" height="5"/><rect x="12" y="17" width="22" height="5"/><rect x="12" y="22" width="22" height="5"/>'
};
const layIcon = L => `<svg viewBox="0 0 36 29" fill="none" stroke="currentColor" stroke-width="1">${ICON[L]}</svg>`;
const isSet = v => v !== undefined && v !== null && v !== '';
const fmtN = v => String(v).replace('.', ',');
// Ô thông số chuẩn: nhãn, điều khiển, chấm "đã chỉnh tay", nút ↺ về tự động
function fld(p, label, ctrl, man, def, cls = '') {
  return `<div class="fld ${cls} ${man ? 'ov' : ''}" data-param="${p}"><span class="fl">${label}</span><span class="fc">${ctrl}</span><button class="rst" data-act="rst" data-p="${p}" ${man ? '' : 'hidden'} title="Về tự động${isSet(def) ? ` (${fmtN(def)})` : ''}" aria-label="Về tự động">↺</button></div>`;
}
function fNum(p, label, val, o) {
  return fld(p, label + (o.unit ? ` (${o.unit})` : ''), `<input type="number" data-pv="${p}" min="${o.min}" max="${o.max}" step="${o.step || 1}" placeholder="${isSet(o.def) ? fmtN(o.def) : 'tự động'}" value="${isSet(val) ? val : ''}" aria-label="${esc(label)}">`, isSet(val), o.def, 'n');
}
function fSeg(p, label, val, opts, def, o = {}) {
  const cur = isSet(val) ? val : def, dn = (opts.find(x => String(x[0]) === String(def)) || [])[1];
  return fld(p, label, `<span class="seg wrapseg">${opts.map(([v, n, dis]) => `<button data-act="set" data-p="${p}" data-v="${v}" data-def="${def}" class="${String(cur) === String(v) ? 'on' : ''}" ${dis ? `disabled title="${esc(dis)}"` : ''}>${n}</button>`).join('')}</span>${o.hint ? `<span class="hint fh">${o.hint}</span>` : ''}`, isSet(val), dn, 's');
}
function fRange(p, label, val, o) {
  const v = isSet(val) ? val : o.def, f = o.fmt || (x => x);
  return fld(p, label, `<span class="rng"><input type="range" data-pr="${p}" data-def="${o.def}" data-fmt="${o.fmtKey || ''}" min="${o.min}" max="${o.max}" step="${o.step || 5}" value="${v}" aria-label="${esc(label)}"><output>${f(v)}</output></span>`, isSet(val), f(o.def), 's');
}
const sec = (key, name, html) => html ? `<section class="psec" data-sec="${key}"><h3>${name}</h3>${html}</section>` : '';
function crumb(t, s) {
  // Chỉ liệt kê cấp cha (bấm để lên); tên mục đang chọn nằm ở tiêu đề bên dưới
  let h = `<div class="crumb"><button data-sel="sheet">Phiếu</button>`;
  if (s.type === 'task') return h + '</div>';
  h += ` › <button data-sel="task" data-id="${t.id}">Task ${t.number}</button>`;
  if (s.item) h += ` › <button data-sel="group" data-id="${t.id}" data-g="${s.g}">${GNAME[s.g]}</button>`;
  return h + '</div>';
}
function autoSec(t, s, extra = '') {
  const man = ovOf(t, s);
  const sc = SCOPES.map(([v, n]) => [v, n, targetsOf(t, s, v).length]).filter(x => x[2]).map(([v, n, c]) => `<button data-act="scope" data-v="${v}" title="Áp cho ${c} container">${n} · ${c}</button>`).join('');
  const st = (man ? '<button class="btn" data-act="auto">Về tự động</button>' : '') + extra;
  return (st ? `<div class="stack">${st}</div>` : '') + (sc ? `<div class="field" style="margin-top:10px"><span>Áp thông số của container này cho</span><div class="seg wrapseg scopes">${sc}</div></div>` : '') + `${multi.length ? `<p class="hint">Đang chọn ${multi.length + 1} container cùng loại: mọi thay đổi áp cho tất cả.</p>` : ''}`;
}
function panel(t, s, title, o) {
  return crumb(t, s) + `<h2>${title}</h2>` + (o.diag || '') + (o.top || '') + sec('size', 'Kích thước', o.size) + sec('align', 'Căn lề', o.align) + sec('content', o.cname || 'Nội dung', o.content) + sec('break', 'Ngắt trang', o.brk) + sec('auto', 'Về tự động', autoSec(t, s, o.autoExtra));
}
function diagBox(d) {
  return `<div class="diag"><div>${esc(d.msg)}</div><div class="fixes">${(d.fixes || []).map(f => `<button class="btn" data-act="fix" data-id="${d.id}" data-v="${f.v}">${esc(f.label)}</button>`).join('')}${sel.type === 'sheet' ? `<button class="lnk" data-sel="task" data-id="${d.id}">Mở Task</button>` : ''}</div></div>`;
}
const diagFor = t => (lastRes ? lastRes.diags.filter(d => d.id === t.id) : []).map(diagBox).join('');
function presetSeg(cur, act, withInherit) {
  const opts = (withInherit ? [['', 'Theo phiếu']] : []).concat(Object.keys(PRESETS).map(k => [k, PRESET_NAME[k]]), [['free', 'Tự do']]);
  return `<div class="seg wrapseg">${opts.map(([k, n]) => `<button data-act="${act}" data-v="${k}" class="${(cur || '') === k ? 'on' : ''}">${n}</button>`).join('')}</div>`;
}
function numRow(scope, key, val, inh, ov) {
  const label = scope === 'task' && key === 'gapTask' ? 'Cách Task phía trên' : SP_LABEL[key];
  return `<div class="fld n ${ov ? 'ov' : ''}" data-param="sp.${key}"><label class="fl" for="sp-${scope}-${key}">${label} (mm)</label><span class="fc"><input id="sp-${scope}-${key}" type="number" step="0.5" min="${MINS[key]}" value="${val}" data-sp="${scope}" data-key="${key}"></span><button class="rst" data-act="rst-sp" data-sp="${scope}" data-key="${key}" ${ov ? '' : 'hidden'} title="Về mặc định (${fmtN(inh)} mm)" aria-label="Về mặc định">↺</button></div>`;
}
// Thứ tự gợi ý các layout hợp lệ (Tự động đứng đầu); giai đoạn 3 thay bằng điểm số
function rankLayouts(t) { const why = layoutReasons(t); return Object.keys(TL).filter(k => !why[k]); }
function layoutPicker(t) {
  const lay = t.layout, why = layoutReasons(t), locked = Object.keys(TL).filter(k => why[k]), auto = autoLayout(t), rk = rankLayouts(t);
  const btn = (k, label, extra = '') => `<button class="lay ${lay.task === k ? 'on' : ''}" data-act="layout" data-v="${k}" title="${k === 'auto' ? 'Hệ thống tự chọn' : `${TL[k].name} (${k})`}">${layIcon(k === 'auto' ? auto : k)}<span>${label}</span>${extra}</button>`;
  return `<h3>Bố cục bài</h3><div class="lay-grid">${btn('auto', 'Tự động', `<small class="cd">${TLS[auto]}</small>`)}${rk.map(k => btn(k, TL[k].name, cd(k) + (rkNote(t, k)))).join('')}</div>` +
    (locked.length ? `<details class="why"><summary>Vì sao không dùng được (${locked.length})</summary><ul>${locked.map(k => `<li><b>${TL[k].name}</b> ${cd(k)}: ${esc(why[k])}</li>`).join('')}</ul></details>` : '');
}
let rkNote = () => '';
function taskPanel(t, s) {
  const L = layoutOf(t), lay = t.layout, m = rmeta(t, L), cr = colsRange(t, L), sp = spacingOf(t), inh = inheritedSpacing(t), wbR = t.wordBank && t.wordBank.placement === 'right', row = cellDirOf(t) === 'row';
  let size = '', align = '', content = '';
  if (ratioOf(t) != null && !row) size += fRange('split', L === 'T6' ? 'Tỉ lệ nội dung / khung từ' : L === 'T4' ? 'Tỉ lệ câu hỏi / đáp án' : 'Tỉ lệ ảnh / nội dung', lay.split, { min: m.range[0], max: m.range[1], step: 5, def: m.ratio, fmt: r => `${r} / ${100 - r}`, fmtKey: 'split' });
  if (L === 'T7') { ['Cột trái', 'Cột nối', 'Cột phải'].forEach((n, i) => { size += fNum('cw.' + i, n, lay.cw ? lay.cw[i] : null, { min: 10, max: 80, step: 5, unit: '%', def: T7CW[i] }); }); size += fNum('rowH', 'Chiều cao hàng', lay.rowH, { min: 8, max: 40, unit: 'mm', def: 'tự động' }); }
  if (cr) { const opts = []; for (let c = cr[0]; c <= cr[1]; c++) opts.push([c, c]); size += fSeg('cols', 'Số cột', lay.cols, opts, Math.min(cr[1], Math.max(cr[0], colsDefault(t, L)))); }
  if (L === 'T5' && !row && colsOf(t) > 1) size += fNum('colGap', 'Khoảng cách giữa các cột', lay.colGap, { min: 2, max: 20, unit: 'mm', def: sp.itemGap });
  if (L === 'T6' && !wbR) size += fNum('width', 'Độ rộng khối nội dung', lay.width, { min: 40, max: 100, step: 5, unit: '%', def: 100 });
  if (ck(t) === 'dialogue') size += fNum('whoW', 'Cột tên người nói', lay.whoW, { min: 6, max: 40, unit: 'mm', def: 'tự động' });
  if (L === 'T9') size += tblOpts(t).cross ? fNum('tbl.xc', 'Cỡ ô', (t.layout.table || {}).xc, { min: 6, max: 16, step: 1, unit: 'mm', def: 10 }) : tblSize(t);
  size += `<h4>Khoảng cách</h4><div class="fld s ${t.spacing.preset ? 'ov' : ''}" data-param="sp.preset"><span class="fl">Mức khoảng cách</span><span class="fc">${presetSeg(t.spacing.preset, 'task-preset', true)}</span><button class="rst" data-act="task-preset" data-v="" ${t.spacing.preset ? '' : 'hidden'} title="Về theo phiếu" aria-label="Về tự động">↺</button></div>` + Object.keys(SP_LABEL).map(k => numRow('task', k, sp[k], inh[k], k in t.spacing.overrides)).join('');
  if (L === 'T5' && !row) align += fSeg('align', 'Căn nội dung trong ô', lay.align, Object.entries(HA), 'left');
  if (L === 'T6' && !wbR) align += fSeg('align', 'Vị trí khối nội dung', lay.align, Object.entries(HA), 'left', { hint: lay.width ? '' : 'Có tác dụng khi độ rộng nhỏ hơn 100%.' });
  if (['T2', 'T3', 'T4', 'T7'].includes(L) || (L === 'T6' && wbR) || row) align += fSeg('valign', row ? 'Căn dọc các hàng (mặc định cho mọi ô)' : 'Căn dọc các cột', lay.valign, Object.entries(VA), ['T4', 'T7'].includes(L) || row ? 'center' : 'top');
  align += fSeg('@ta', 'Căn lề Khối text', taOf(t), TA, 'left', { hint: 'Áp cho hướng dẫn, bài đọc / lời dẫn và khối tự do chữ (khối nào chỉnh riêng thì theo khối đó). Có mã QR file nghe thì lề phải của hướng dẫn là mép trái mã QR.' });   // v97
  if (L === 'T9') align += tblOpts(t).cross ? fSeg('tbl.align', 'Vị trí ô chữ', (lay.table || {}).align, Object.entries(HA), 'center') : fSeg('tbl.align', 'Căn lề nội dung ô', (lay.table || {}).align, Object.entries(HA), 'left');
  if (L === 'T1' && ck(t) === 'empty') align += `<p class="hint" data-na="align">Bài chỉ có ảnh: căn lề nằm ở ảnh.</p>`;
  if (L === 'T5' && t.content.variant !== 'multi') content += fSeg('dir', 'Hướng ô (ảnh so với chữ)', lay.dir, [['col', 'Ảnh trên'], ['row', 'Ảnh trái']], dirDefault(t));
  if (L === 'T9') content += tblKind(t) + (!tblOpts(t).cross && (t.content.rows || []).some(r => r.cells.some(v => v && (v.ans != null || v.ok))) ? fSeg('tbl.key', 'Hiện đáp án (bản giáo viên)', (t.layout.table || {}).key, [[true, 'Hiện'], [false, 'Ẩn']], false, { hint: 'Ẩn: ô "=…" in trống, ô tích để trống cho học sinh. Hiện: in chữ đáp án vào ô, ô tích đúng có ✓ và tô nền.' }) : '') + (tblOpts(t).cross ? fSeg('tbl.key', 'Hiện đáp án (bản giáo viên)', (t.layout.table || {}).key, [[true, 'Hiện'], [false, 'Ẩn']], false, { hint: 'Ẩn: học sinh thấy ô trống. Hiện: in chữ đáp án vào ô để làm bản đáp án.' }) : tblStyle(t));
  if (cellImgMode(t)) content += `<p class="hint">Mỗi ảnh là một container: bấm vào ảnh trên trang để chỉnh riêng.</p>`;
  if (its(t).length > 1 && !['table', 'empty'].includes(ck(t))) content += fSeg('@num', 'Số câu ở lề', lay.num, [['on', 'Hiện'], ['off', 'Ẩn']], 'on', { hint: 'Ẩn khi học sinh phải tự điền số vào chỗ trống (bài xếp thứ tự), để số ở lề khỏi lẫn với số phải điền.' });
  if (its(t).length > 1 && lay.num !== 'off' && !['table', 'empty'].includes(ck(t))) content += fSeg('@nlab', 'Kiểu số câu', lay.nlab, [['n', '1 2 3'], ['a', 'a b c']], 'n', { hint: 'Chữ a, b, c khi phiếu gốc đánh a–h (vd bài nối từ với nghĩa).' });
  if (ck(t) === 'pairs') content += fSeg('@mbd', 'Viền hai vế', lay.mbd, [['off', 'Không'], ['on', 'Có']], 'off', { hint: 'Khung viền quanh chữ của vế trái và vế phải (bật / tắt cùng lúc).' });   // v103
  const brk = fSeg('break', 'Trước và sau Task này', lay.break, [['auto', 'Tự động'], ['page', 'Sang trang mới'], ['keep', 'Giữ liền Task sau'], ['join', 'Nối vào Task trên', ws.tasks[0] === t ? 'Task đầu phiếu không nối được' : '']], 'auto', { hint: lay.break === 'join' ? 'Phần tiếp của Task trên: không số, không tiêu đề (chỉ giữ hướng dẫn riêng nếu có), luôn đi liền Task trên, cách trên bằng khoảng cách giữa các nhóm. Mỗi phần giữ đáp án riêng.' : '' });
  return panel(t, s, `Task ${t.number} · ${esc(taskLabel(t))} ${cd(t.typeId)}`, { diag: diagFor(t), top: layoutPicker(t), size, align, content, cname: 'Kiểu trình bày', brk });
}
function tblSize(t) {
  const o = tblOpts(t), u = t.layout.table || {}, nC = t.content.cols.length, tot = nC + (o.rowHead ? 1 : 0), cur = tblColPct(t), cwOn = Array.isArray(u.cw) && u.cw.length === tot;
  let h = fSeg('tbl.cols', 'Độ rộng cột', cwOn ? null : u.cols, [['equal', 'Đều'], ['first', 'Cột đầu rộng'], ['auto', 'Theo nội dung']], 'first', { hint: cwOn ? 'Đang chỉnh tay từng cột (bên dưới). Bấm một mức để về tự động.' : '' });
  if (o.rowHead && !cwOn && o.cols === 'first') h += fRange('tbl.first', 'Độ rộng cột đầu', u.first, { min: 15, max: 60, step: 1, def: TBL_DEF.first, fmt: x => x + '%' });
  h += '<h4>Từng cột (%)</h4>' + cur.map((x, i) => fNum('tbl.cw.' + i, i === 0 && o.rowHead ? 'Cột đầu' : `Cột ${o.rowHead ? i : i + 1}`, cwOn ? u.cw[i] : null, { min: 5, max: 90, step: 1, unit: '%', def: Math.round(x) })).join('');
  h += fSeg('tbl.rows', 'Chiều cao hàng', u.rows, [['auto', 'Theo nội dung'], ['equal', 'Đều nhau']], 'auto') + fNum('tbl.minH', 'Chiều cao hàng tối thiểu', u.minH, { min: 0, max: 60, unit: 'mm', def: TBL_ROW_MM });
  const keys = [...(o.head ? ['h'] : []), ...t.content.rows.map((_, i) => String(i))], rhs = u.rhs || {};
  h += `<details ${Object.keys(rhs).length ? 'open' : ''}><summary>Từng hàng (mm) · ${keys.length} hàng</summary>${keys.map(k => fNum('tbl.rhs.' + k, k === 'h' ? 'Hàng tiêu đề' : `Hàng ${+k + 1}`, rhs[k], { min: 6, max: 80, unit: 'mm', def: u.minH ?? TBL_ROW_MM })).join('')}</details>`;
  return h;
}
function tblKind(t) { return fSeg('tbl.cross', 'Kiểu bảng', (t.layout.table || {}).cross, [[false, 'Bảng thường'], [true, 'Ô chữ giải đố']], false, { hint: 'Ô chữ giải đố: chỉ ô có chữ mới có viền xám, không có ô đen; số 1, 2, 3 tự đánh.' }); }
function tblStyle(t) {
  const u = t.layout.table || {}, o = tblOpts(t), B = [[true, 'Bật'], [false, 'Tắt']];
  return fSeg('tbl.head', 'Hàng tiêu đề cột', u.head, B, true) + fSeg('tbl.rowHead', 'Cột tiêu đề hàng (cột đầu)', u.rowHead, B, true)
    + fSeg('tbl.nm', 'Số thứ tự', o.nm, [['out', 'Ngoài bảng'], ['in', 'Trong cột đầu'], ['off', 'Tắt']], 'out')
    + fSeg('tbl.lines', 'Đường kẻ', u.lines, [['all', 'Đầy đủ'], ['h', 'Chỉ ngang'], ['none', 'Không']], 'all')
    + fSeg('tbl.fh', 'Tô nền hàng tiêu đề', u.fh, B, true) + fSeg('tbl.fc', 'Tô nền cột đầu', u.fc, B, false)
    + fSeg('tbl.fr', 'Tô nền các hàng nội dung', o.fc ? 'none' : u.fr, [['none', 'Không'], ['zebra', 'Xen kẽ', o.fc ? 'Đã tô cột đầu nên không tô các hàng' : '']], 'none')
    + fSeg('tbl.split', 'Cho phép cắt bảng giữa các hàng', u.split, B, true) + (o.split ? fSeg('tbl.repeat', 'Lặp hàng tiêu đề ở trang sau', u.repeat, B, true) : '');
}
function marksCtl(t) {
  if (!t.image) return '';
  const im = t.image, ms = im.marks || [], mk = im.mk || {}, on = markMode;
  const seg = (act, cur, opts) => `<span class="seg">${opts.map(([v, n]) => `<button data-act="${act}" data-v="${v}" class="${cur === v ? 'on' : ''}">${n}</button>`).join('')}</span>`;
  return `<h3>Điểm trên ảnh</h3><div class="stack"><button class="btn ${on ? 'pri' : ''}" data-act="mkmode">${on ? 'Đang đặt điểm: bấm vào ảnh' : 'Đặt điểm'}</button>${ms.length ? '<button class="btn" data-act="mkclear">Xóa hết</button>' : ''}</div>
    <div class="field"><span>Hình</span>${seg('mkshape', mk.shape === 'square' ? 'square' : 'circle', [['circle', 'Tròn'], ['square', 'Vuông']])}</div>
    <div class="field"><span>Bên trong</span>${seg('mklabel', mk.label === 'none' ? 'none' : 'num', [['num', 'Số 1, 2, 3'], ['none', 'Ô trống']])}</div>
    <p class="hint">${ms.length ? `${ms.length} điểm. Số điểm n ứng với câu n. Kéo điểm trên ảnh để dời, hoặc bấm số bên dưới để xóa.` : 'Bấm "Đặt điểm" rồi bấm vào ảnh trên trang. Vị trí tính theo ảnh; nếu đổi sang Fit, kiểm tra điểm còn nằm trong khung.'}</p>
    ${ms.length ? `<div class="mkchips">${ms.map((m, i) => `<button class="btn" data-act="mkdel" data-v="${i}" title="Xóa điểm ${i + 1}">${i + 1} ✕</button>`).join('')}</div>` : ''}`;
}
function framePanel(t, s) {
  const L = layoutOf(t), fr = frOf(t), f = fitOf(t);
  let size = '', align = '', content = '';
  if (!f && L !== 'T8') size += fRange('frame.scale', 'Kích thước ảnh (khóa tỉ lệ)', fr.scale, { min: 40, max: 100, step: 5, def: 100, fmt: x => x + '%' });
  if (!(f === 'height' && isColI(t))) size += fNum('frame.h', 'Chiều cao khung', fr.h, { min: 25, max: 150, step: 5, unit: 'mm', def: f ? (frameH(t) || 'theo ảnh') : 'theo ảnh' });
  else size += `<p class="hint">Fit dọc: khung cao theo cột nội dung bên cạnh.</p>`;
  if (L === 'T8') size += fNum('frame.w', 'Chiều rộng khung', fr.w, { min: IW8[0], max: IW8[1], step: 5, unit: '% bài đọc', def: IW8[2] });
  if (L === 'T1' || L === 'T4') align += fSeg('frame.align', 'Căn ngang', fr.align, Object.entries(HA), L === 'T1' ? 'center' : 'left', { hint: L === 'T1' ? 'Trái: ảnh thẳng đường dóng của tiêu đề.' : '' });
  if (L === 'T8') align += fSeg('frame.align', 'Căn ngang (chữ bao phía còn lại)', fr.align, [['left', 'Trái'], ['right', 'Phải']], 'right');
  if (isColI(t)) align += fSeg('frame.valign', 'Căn dọc so với nội dung', fr.valign, Object.entries(VA), 'top');
  content += fSeg('frame.fit', 'Hiển thị ảnh trong khung', fr.fit, [['normal', 'Bình thường'], ['width', 'Fit ngang'], ['height', 'Fit dọc']], 'normal', { hint: 'Fit ngang: ngang ảnh bằng ngang khung. Fit dọc: cao ảnh bằng cao khung. Tâm ảnh trùng tâm khung, phần thừa bị cắt. Fit không phóng to khung.' });
  if (f) content += fRange('frame.zoom', 'Zoom ảnh', fr.zoom, { min: 50, max: 300, step: 5, def: 100, fmt: x => x + '%', fmtKey: 'zoom' }) + `<button class="btn" data-act="center" ${fr.ox || fr.oy || fr.zoom ? '' : 'disabled'}>Đưa ảnh về giữa khung</button>`;
  content += imgCtl(t, 'G1') + marksCtl(t) + `<p class="hint">Khung chính là ảnh: kéo cạnh dưới khung trên trang để đổi chiều cao, ảnh đi theo khung.${f ? ' Kéo chấm tâm để dời góc nhìn.' : ''}</p>`;
  return panel(t, s, `Ảnh ${cd('G1')}`, { size, align, content, cname: 'Hiển thị ảnh' });
}
function cimgPanel(t, s, all) {
  const keys = cellKeys(t, 'cimg'), key = all ? keys[0] : s.item, cc = cellCfg(t, key), fr = cc.frame || {}, row = cellDirOf(t) === 'row', f = fr.fit;
  let size = fNum('frame.h', 'Chiều cao khung', fr.h, { min: 15, max: 150, step: 5, unit: 'mm', def: f === 'height' ? 35 : 'theo ảnh' }), align = '', content = '';
  if (!row) size += fNum('frame.w', 'Độ rộng ảnh', fr.w, { min: 20, max: 100, step: 5, unit: '% ô', def: 'tự động' });   // v84: mặc định = cỡ hiện tại (rộng hết ô, tối đa 34 mm)
  if (row) size += fRange('split', 'Tỉ lệ hàng (ảnh / chữ)', cc.split, { min: 15, max: 50, step: 5, def: 25, fmt: r => `${r} / ${100 - r}`, fmtKey: 'split' });
  align = row ? fSeg('valign', 'Căn dọc trong hàng', cc.valign, Object.entries(VA), t.layout.valign || 'center') : fSeg('frame.align', 'Căn ngang trong ô', fr.align, Object.entries(HA), t.content.variant === 'multi' ? 'center' : (t.layout.align || 'left'));
  content += fSeg('frame.fit', 'Hiển thị ảnh trong khung', fr.fit, [['normal', 'Bình thường'], ['width', 'Fit ngang'], ['height', 'Fit dọc']], 'normal');
  if (f) content += fRange('frame.zoom', 'Zoom ảnh', fr.zoom, { min: 50, max: 300, step: 5, def: 100, fmt: x => x + '%', fmtKey: 'zoom' }) + `<button class="btn" data-act="center" ${fr.ox || fr.oy || fr.zoom ? '' : 'disabled'}>Đưa ảnh về giữa khung</button>`;
  content += (all ? '' : imgCtl(t, '@' + key)) + (all ? `<p class="hint">Đang chỉnh cùng lúc ${keys.length} ô ảnh. Chọn một ô (trên trang) để chỉnh riêng ô đó.</p>` : `<p class="hint">Kéo cạnh dưới ảnh trên trang để đổi chiều cao khung.</p>`);
  return panel(t, s, all ? `Ảnh · tất cả ${keys.length} ô` : `Ô ${labelOf(t, key)} · Ảnh`, { size, align, content, cname: 'Hiển thị ảnh' });
}
function crowPanel(t, s) {
  const cc = cellCfg(t, s.item);
  const size = fRange('split', 'Tỉ lệ hàng (ảnh / chữ)', cc.split, { min: 15, max: 50, step: 5, def: 25, fmt: r => `${r} / ${100 - r}`, fmtKey: 'split' }) + fNum('rowH', 'Chiều cao hàng tối thiểu', cc.rowH, { min: 10, max: 120, step: 5, unit: 'mm', def: 'tự động' });
  const align = fSeg('valign', 'Căn dọc nội dung trong ô', cc.valign, Object.entries(VA), t.layout.valign || 'center');
  const content = `<p class="hint">Kéo thanh ngang dưới ô chữ để đổi chiều cao hàng. Đáp án trong ô (lựa chọn in đậm) có thông số riêng: bấm vào đáp án để chỉnh.</p>`;
  return panel(t, s, `Ô ${labelOf(t, s.item)} · Chữ`, { size, align, content });
}
function answerPanel(t, s, key) {
  const a = t.answer, p = a.params || {}, o = key ? ((p.perItem || {})[key] || {}) : p, L = a.layout, age = AGE[ws.age], inl = a.attach === 'inline';
  const D = (k, d) => key && isSet(p[k]) ? p[k] : d;
  let top = '', size = '', align = '', content = '';
  if (!key) {
    const att = attachOpts(t), chs = aChoices(t), lockedA = Object.keys(AL).filter(k => !chs.some(c => c.A === k && c.att));
    top = (att.length > 1 ? `<h3>Gắn đáp án</h3><div class="seg wrapseg">${['inline', 'item', 'block'].filter(k => att.includes(k)).map(k => `<button data-act="attach" data-v="${k}" class="${a.attach === k ? 'on' : ''}">${ATTACH[k]}</button>`).join('')}</div>` : '') + `
      <h3>Kiểu đáp án</h3><div class="lay-grid">${chs.filter(c => c.att).map(c => `<button class="lay ${L === c.A ? 'on' : ''}" data-act="al" data-v="${c.A}" title="${c.att ? (c.att === a.attach ? AL[c.A] : `Chọn sẽ chuyển Gắn đáp án sang ${ATTACH[c.att]}`) : 'Không dùng được với nội dung hiện tại'}"><b style="font-size:13px">${AL[c.A]}</b>${cd(c.A)}${c.att && c.att !== a.attach ? `<small class="sc">→ ${ATTACH[c.att]}</small>` : ''}</button>`).join('')}</div>` +
      (lockedA.length ? `<details class="why"><summary>Kiểu khác không hợp dạng bài này (${lockedA.length})</summary><p class="hint">${lockedA.map(k => `${AL[k]} ${cd(k)}`).join(' · ')}</p></details>` : '');
  }
  if (L === 'A1' || L === 'A8') {
    size = (L === 'A1' ? fNum('lines', 'Số dòng mỗi câu', o.lines, { min: 1, max: 20, def: D('lines', 1) }) : fNum('repeat', 'Số lần tô', o.repeat, { min: 1, max: 5, def: D('repeat', 3) }))
      + fNum('lineMm', `Chiều cao dòng (tối thiểu ${age.line})`, o.lineMm, { min: age.line, max: 25, step: .5, unit: 'mm', def: D('lineMm', age.line) })
      + fNum('w', 'Độ rộng dòng', o.w, { min: 40, max: 100, step: 5, unit: '%', def: D('w', 100) });
  } else if (L === 'A2' && inl) {
    const c = a2cfg(t, key ? { id: key } : null);
    size = fSeg('lenMode', 'Độ dài gạch', o.lenMode, [['fill', 'Hết lề phải'], ['fixed', 'Cố định']], D('lenMode', 'fixed')) + fNum('lenMm', c.mode === 'fill' ? 'Độ dài khi Cố định' : 'Độ dài', o.lenMm, { min: 15, max: 150, step: 5, unit: 'mm', def: D('lenMm', A2MM[ws.age]) }) + fNum('lines', 'Số dòng', o.lines, { min: 1, max: 8, def: D('lines', 1) });
    content = fSeg('start', 'Dòng đầu bắt đầu', o.start, [['inline', 'Cạnh chữ'], ['below', 'Hàng dưới']], D('start', 'inline')) + `<p class="hint">Hết lề phải và nhiều dòng chỉ dùng cho chỗ trống ở cuối câu; chỗ trống giữa câu luôn là gạch cố định.</p>`;
  } else if (L === 'A2') size = fNum('width', 'Độ rộng ô', o.width, { min: 4, max: 30, unit: 'ký tự', def: D('width', 'theo từ') });
  else if (L === 'A3') size = fNum('boxW', 'Cỡ ô chữ', o.boxW, { min: 5, max: 12, step: .5, unit: 'mm', def: D('boxW', 6.5) });
  else if (L === 'A4' && inl) { size = `<p class="hint" data-na="size">Lựa chọn nằm trong câu nên cỡ theo chữ.</p>`; content = `<p class="hint">Viết lựa chọn dạng {từ 1|từ 2} trong nội dung; hiện thành từ 1 / từ 2, mỗi từ in đậm. Học sinh gạch chân hoặc khoanh từ đúng.</p>`; }
  else if (L === 'A4') {
    size = fNum('gap', 'Khoảng cách các lựa chọn', o.gap, { min: 2, max: 20, unit: 'mm', def: D('gap', 7) });
    content = fSeg('dir', 'Cách xếp', o.dir, Object.entries(A4DIRS), D('dir', 'auto'), { hint: key ? '' : 'Tự động: nếu mọi câu trong Task đều ngắn thì xếp một hàng, chỉ cần một câu dài thì cả Task xếp mỗi đáp án một dòng.' })
      + (key ? '' : fNum('autoMax', 'Đáp án “ngắn” khi dài tối đa', o.autoMax, { min: 6, max: 60, unit: 'ký tự', def: a4autoDef() }) + fSeg('qv', 'Căn dọc (số câu, chữ câu, lựa chọn)', o.qv, [['top', 'Trên'], ['center', 'Giữa'], ['bottom', 'Dưới']], 'top', { hint: 'Áp cho mọi câu của Task: số câu, chữ câu và dòng lựa chọn cùng đường căn.' }) + fSeg('lab', 'Nhãn', o.lab, [['circle', 'ⓐ'], ['dot', 'a.'], ['box', '☐ ô tick']], 'dot') + (o.lab === 'box' ? '' : fSeg('upper', 'Chữ nhãn', o.upper, [[false, 'a b c'], [true, 'A B C']], false)));
  } else if (L === 'A5') size = fNum('size', 'Cỡ ô tick', o.size, { min: 4, max: 12, step: .5, unit: 'mm', def: D('size', 6.5) });
  else if (L === 'A6') size = fNum('size', 'Cỡ ô T/F', o.size, { min: 5, max: 12, step: .5, unit: 'mm', def: D('size', 7.5) });
  else if (L === 'A7') size = fNum('size', 'Cỡ chấm nối', o.size, { min: 1.5, max: 6, step: .5, unit: 'mm', def: D('size', 2.8) });
  if (L === 'A7' && ck(t) === 'pairs') content += fSeg('mid', 'Chỗ nối (giữa hai cột)', o.mid, [['dot', 'Chấm nối'], ['box', 'Ô viết chữ'], ['none', 'Không có']], 'dot', { hint: 'Ô viết chữ: học sinh viết chữ cái của vế phải vào ô bên cạnh vế trái (không nối dây).' });   // v105
  if (inl && (L === 'A2' || L === 'A4')) align = `<p class="hint" data-na="align">Đáp án nằm trong câu nên đi theo dòng chữ, không căn riêng.</p>`;
  else align = fSeg('align', 'Căn ngang', o.align, Object.entries(HA), D('align', ansAlignDef(t)));
  if (L === 'A6' && !key && p.row) content += fSeg('rowv', 'Căn dọc cả khối', p.rowv, [['top', 'Trên'], ['center', 'Giữa'], ['bottom', 'Dưới']], 'center', { hint: 'Áp cho mọi câu của Task: số câu, chữ câu và ô T / F.' }) + fNum('tfx', 'T / F cách lề phải', p.tfx, { min: 0, max: 140, step: 1, unit: 'mm', def: 0 });   // v101
  if (!key) content += `<p class="hint">Bấm vào đáp án của một câu trên trang để chỉnh riêng câu đó.</p>`;
  return panel(t, s, key ? `Đáp án · câu ${labelOf(t, key)}` : `Đáp án · ${AL[L]} ${cd(L)}`, { top, size, align, content, cname: 'Kiểu hiển thị', autoExtra: key ? '' : '<button class="btn" data-act="reset-answer">Về kiểu đáp án ban đầu</button>' });
}
function bankPanel(t, s) {
  const b = t.wordBank, right = b.placement === 'right';
  const size = right ? fRange('@split', 'Tỉ lệ nội dung / khung từ', t.layout.split, { min: 40, max: 80, step: 5, def: 62, fmt: r => `${r} / ${100 - r}`, fmtKey: 'split' }) : fNum('w', 'Độ rộng khung từ', b.w, { min: 30, max: 100, step: 5, unit: '%', def: 100 });
  const align = right ? fSeg('valign', 'Căn dọc', b.valign, Object.entries(VA), 'top') : fSeg('align', 'Căn ngang', b.align, Object.entries(HA), 'center', { hint: b.w ? '' : 'Có tác dụng khi độ rộng nhỏ hơn 100%.' });
  const content = `<div class="field"><span>Vị trí</span><div class="seg"><button data-act="wb" data-v="top" class="${!right ? 'on' : ''}">Trên nội dung</button><button data-act="wb" data-v="right" class="${right ? 'on' : ''}">Bên phải</button></div></div><div class="field"><span>Kiểu hiển thị</span><div class="seg"><button data-act="wbstyle" data-v="chips" class="${b.style !== 'list' ? 'on' : ''}">Từ rời</button><button data-act="wbstyle" data-v="list" class="${b.style === 'list' ? 'on' : ''}">Danh sách</button></div></div>`
    + (b.style === 'list' ? `<div class="field"><span>Nhãn</span><div class="seg">${[['lower', 'a b c'], ['upper', 'A B C'], ['none', 'Không']].map(([k, n]) => `<button data-act="wblab" data-v="${k}" class="${(b.label || 'lower') === k ? 'on' : ''}">${n}</button>`).join('')}</div></div>` : '');
  return panel(t, s, `Khung từ ${cd('G4')}`, { size, align, content, cname: 'Kiểu hiển thị' });
}
function gtPanel(t, s) {
  const x = gtOf(t, s.item), L = gtOrder(t), i = L.findIndex(y => y.id === x.id), n = (t.extras || []).findIndex(y => y.id === x.id) + 1, img = x.kind === 'image';
  const size = fSeg('size', 'Cỡ chữ', x.size, [[null, `Theo phiếu · ${FSZ[ws.age][sizeKey()]} pt`], ...Object.entries(GT_SIZE).map(([k, v]) => [k, `${v} · ${FSZ[ws.age][k]} pt`])], null);
  const align = img ? fSeg('align', 'Căn lề', x.align, [['left', 'Trái'], ['center', 'Giữa'], ['right', 'Phải']], 'left') : fSeg('align', 'Căn lề', x.align, [['', `Theo Task (${TA.find(y => y[0] === taOf(t))[1]})`], ...TA], '');   // v97
  const frame = img ? '' : fSeg('frame', 'Khung', x.frame, [['none', 'Không'], ['line', 'Viền xám'], ['fill', 'Nền xám nhẹ'], ['both', 'Viền + nền']], 'none');
  const cols2 = img ? '' : fSeg('cols', 'Số cột chữ', x.cols, [[1, '1 cột'], [2, '2 cột']], 1);
  const wd = img ? fSeg('n', 'Số ảnh trên một hàng', x.n, [[1, '1'], [2, '2'], [3, '3'], [4, '4']], 1) + fNum('w', gtN(x) > 1 ? 'Độ rộng cả hàng ảnh' : 'Độ rộng ảnh', x.w, { min: 20, max: 100, step: 5, unit: '%', def: gtN(x) > 1 ? 100 : 50 }) : '';
  const pos = `<div class="field"><span>Vị trí trong Task</span><div class="seg"><button data-act="gtmove" data-v="-1" ${i <= 0 ? 'disabled' : ''}>↑ Đưa lên</button><button data-act="gtmove" data-v="1" ${i >= L.length - 1 ? 'disabled' : ''}>↓ Đưa xuống</button></div><p class="hint" style="margin:4px 0 0">Đang ở ${x.pos === 'top' ? 'phía trên' : 'phía dưới'} phần bài của Task. Không đánh số, không có đáp án, không phụ thuộc bố cục Task.</p></div><div class="stack"><button class="btn" data-act="gtdel">Xóa khối này</button></div>`;
  return crumb(t, s) + `<h2>Khối ${img ? 'ảnh' : 'chữ'} ${n} ${cd('G-Text')}</h2>` + (img ? sec('size', 'Kích thước', wd) + sec('content', 'Ảnh', gtKeys(x).map((k, j) => (gtN(x) > 1 ? `<h4>Ảnh ${j + 1}</h4>` : '') + imgCtl(t, k)).join('')) : sec('size', 'Cỡ chữ', size + cols2)) + sec('align', img ? 'Căn lề' : 'Căn lề &amp; khung', align + frame) + sec('pos', 'Vị trí', pos) + sec('auto', 'Về tự động', autoSec(t, s));
}
function headPanel(t, s) {
  return crumb(t, s) + `<h2>Tiêu đề ${cd('G0')}</h2><p class="hint">Tiêu đề (số, tên bài, hướng dẫn${t.audio ? ', số track' : ''}) luôn nằm đầu Task, cố định và là mốc của đường dóng. Khi Task bị cắt sang trang mới, trang sau không lặp lại tiêu đề.</p>`;
}
function sheetPanel() {
  const sp = sheetSpacing(), sh = ws.spacing.preset, d = lastRes ? lastRes.diags : [], P = presetsGet(), keys = Object.keys(P);
  return `<h2>Phiếu · ${esc(ws.title)}</h2><p class="hint" style="margin:0">${ws.tasks.length} Task · ${lastRes ? lastRes.pages.length : '–'} trang A4</p>
    ${d.map(diagBox).join('')}
    <h3>Xếp trang</h3><div class="field"><div class="seg">${[['cont', 'Liền trang'], ['page', 'Tách trang']].map(([k, n]) => `<button data-act="flow" data-v="${k}" class="${(ws.flow || 'cont') === k ? 'on' : ''}">${n}</button>`).join('')}</div><p class="hint" style="margin:0">${(ws.flow || 'cont') === 'page' ? 'Tách trang: mỗi trang chỉ chứa các Task trọn vẹn. Task không vừa chỗ còn lại sẽ sang trang mới.' : 'Liền trang: các Task nối tiếp nhau, lấp đầy trang; Task dài được cắt giữa 2 trang ở ranh giới item, hàng hoặc câu.'} Muốn một Task luôn sang trang mới hoặc giữ liền Task sau: chọn Task đó, mục Ngắt trang.</p></div>
    <h3>Font chữ phiếu</h3><div class="field"><div class="seg">${Object.keys(FONTS).map(k => `<button data-act="font" data-v="${k}" class="${fontKey() === k ? 'on' : ''}" style="font-family:${FONTS[k].css}">${FONTS[k].name}</button>`).join('')}</div><p class="hint" style="margin:0">${FONTS[fontKey()].hint} Đổi font có thể đổi số trang; phiếu được dàn lại ngay.</p></div>
    <h3>Cỡ chữ phiếu</h3><div class="field"><div class="seg">${Object.keys(SIZES).map(k => `<button data-act="size" data-v="${k}" class="${sizeKey() === k ? 'on' : ''}" title="${FSZ[ws.age][k]} pt">${SIZES[k]} · ${FSZ[ws.age][k]} pt</button>`).join('')}</div><p class="hint" style="margin:0">Áp cho chữ nội dung và câu hỏi của mọi Task. Mặc định là Vừa. Dòng viết của học sinh vẫn theo độ tuổi (tối thiểu ${AGE[ws.age].line} mm). Đổi cỡ chữ có thể đổi số trang.</p></div>
    <h3>Khoảng cách</h3><div class="field"><div class="seg">${[...Object.keys(PRESETS).map(k => [k, PRESET_NAME[k]]), ['free', 'Tự do']].map(([k, n]) => `<button data-act="sheet-preset" data-v="${k}" class="${sh === k ? 'on' : ''}">${n}</button>`).join('')}</div></div>
    <p class="hint" style="margin:0 0 4px">${sh === 'free' ? 'Tự do: các số do bạn nhập. Bấm Gọn, Vừa hoặc Thoáng để về bộ số chuẩn.' : 'Các số đi theo mức đã chọn. Sửa tay một số bất kỳ thì chuyển sang Tự do.'}</p>
    ${Object.keys(SP_LABEL).map(k => numRow('sheet', k, sp[k], sp[k], sh === 'free')).join('')}
    ${sheetExtra()}
    <details class="adv"><summary>Nâng cao</summary>
      <h4>Mặc định theo dạng bài${keys.length ? ` (${keys.length})` : ''}</h4>
      ${keys.length ? `<ul class="plist">${keys.map(k => `<li><b>${esc((P[k] && P[k].name) || k)}</b><button class="lnk2" data-act="preset-del" data-v="${esc(k)}">Xóa</button></li>`).join('')}</ul>` : '<p class="hint" style="margin:0">Chưa lưu. Chọn một Task đã chỉnh vừa ý, bấm "Lưu làm mặc định cho dạng này"; các phiếu sau mở ra sẽ tự áp.</p>'}
      <div class="stack" style="margin-top:6px"><button class="btn" data-act="import">Nạp phiếu khác (JSON / MD)…</button></div>
      <h4>Quy tắc in</h4><p class="hint" style="margin:0">Dòng viết tối thiểu ${AGE[ws.age].line} mm, cỡ chữ ${fontPt()} pt (${SIZES[sizeKey()]}; mức To của độ tuổi này là ${FSZ[ws.age].l} pt), tối đa ${AGE[ws.age].maxCols} cột (độ tuổi ${ws.age}).</p>
    </details>`;
}
let sheetExtra = () => '';
function renderInspector() {
  const el = document.getElementById('insp'); stage.classList.toggle('mkmode', markMode && sel.type === 'group' && sel.g === 'G1' && !sel.item);
  if (sel.type === 'sheet') { el.innerHTML = sheetPanel(); return; }
  const t = ws.tasks.find(x => x.id === sel.id); if (!t) { sel = { type: 'sheet' }; multi = []; return renderInspector(); }
  const k = kindOf(t, sel);
  el.innerHTML = k === 'task' ? taskPanel(t, sel) : k === 'frame' ? framePanel(t, sel) : k === 'cimg' ? cimgPanel(t, sel, false) : k === 'cimgs' ? cimgPanel(t, sel, true)
    : k === 'crow' ? crowPanel(t, sel) : k === 'answer' ? answerPanel(t, sel, null) : k === 'aitem' ? answerPanel(t, sel, sel.item) : k === 'bank' ? bankPanel(t, sel) : k === 'gt' ? gtPanel(t, sel) : headPanel(t, sel);
}

/* ================= Lệnh & lịch sử ================= */
// Giữ G0 của Task đang chọn (hoặc Task đầu tiên đang thấy) đứng yên trên màn hình khi đổi khoảng cách
function keepG0(fn) {
  const sr = stage.getBoundingClientRect();
  let id = sel.type !== 'sheet' ? sel.id : null;
  if (!id) { const top = Math.max(sr.top, 0), vis = [...stage.querySelectorAll('.task')].find(e => e.querySelector('.g0') && e.querySelector('.g0').getBoundingClientRect().top >= top); id = vis && vis.dataset.task; }
  const g = () => id && stage.querySelector(`.task[data-task="${id}"] .g0`);
  const b = g(), y0 = b && b.getBoundingClientRect().top;
  fn();
  const a = g(); if (!b || !a) return;
  let sc = stage; while (sc && sc !== document.body && !(/(auto|scroll)/.test(getComputedStyle(sc).overflowY) && sc.scrollHeight > sc.clientHeight)) sc = sc.parentElement;
  const d = a.getBoundingClientRect().top - y0; if (!d) return;
  if (!sc || sc === document.body) window.scrollBy(0, d); else sc.scrollTop += d;
}
function commit(fn, msg, after) { edFlush(); hist.push(clone(ws)); fut = []; fn(ws); ws.tasks.forEach(tidy); render(); if (msg) toast(msg); if (after) after(); }
function undo() { if (!hist.length) return; fut.push(clone(ws)); setWs(hist.pop()); fixSel(); render(); toast('Đã hoàn tác'); }
function redo() { if (!fut.length) return; hist.push(clone(ws)); setWs(fut.pop()); fixSel(); render(); toast('Đã làm lại'); }
function fixSel() { if (sel.type !== 'sheet' && !ws.tasks.find(t => t.id === sel.id)) sel = { type: 'sheet' }; multi = multi.filter(s => ws.tasks.find(t => t.id === s.id)); }
const curT = w => w.tasks.find(x => x.id === sel.id);
// v84: đổi căn lề nội dung cả Task (lưới ô) thì khung ảnh các ô đi theo: bỏ căn riêng từng ô
const commitSet = (p, v) => commit(w => selTargets(w).forEach(([t, s]) => { setPath(t, s, p, v); if (p === 'align' && s.type === 'task' && t.layout.cells) Object.values(t.layout.cells).forEach(c => { if (c && c.frame) delete c.frame.align; }); }));
const parseV = v => v === 'true' ? true : v === 'false' ? false : /^-?\d+(\.\d+)?$/.test(v) ? +v : v;
// toast(): React (src/ui/Toast.tsx)
function applyFix(id, v) {
  commit(w => {
    const t = w.tasks.find(x => x.id === id); if (!t) return; const p = t.answer.params, fr = t.layout.frame;
    if (v === 'compact') { t.spacing.preset = 'compact'; t.spacing.overrides = {}; }
    else if (v === 'cols') t.layout.cols = colsOf(t) + 1;
    else if (v === 'cont') w.flow = 'cont';
    else if (v === 'lines') p.lines = Math.max(1, (p.lines || 1) - 1);
    else if (v === 'split') { t.layout.table = t.layout.table || {}; t.layout.table.split = true; }
    else if (v === 'imgh') { const h = frameH(t) || 60; fr.h = Math.max(25, Math.round((h - 10) / 5) * 5); }
    else if (v === 'scale') fr.scale = Math.max(40, (fr.scale || 100) - 20);
    else if (v === 'page') t.layout.break = 'page';
  }, 'Đã áp dụng gợi ý sửa');
}
const refreshSel = () => { renderTree(); renderInspector(); markSelection(); refreshOverlay(); };
const extraActs = {}; // lệnh bổ sung của các giai đoạn sau

['insp', 'tree'].forEach(id => document.getElementById(id).addEventListener('click', e => { const c = e.target.closest('[data-go]'); if (c) { e.stopPropagation(); goChip(c); } }, true));
document.getElementById('insp').addEventListener('click', e => {
  const b = e.target.closest('[data-act],[data-sel]'); if (!b || b.disabled) return;
  if (b.dataset.sel) return selectFrom(b, e);
  const v = b.dataset.v, act = b.dataset.act;
  if (act === 'mkmode') { markMode = !markMode; return commit(w => { const t = curT(w); if (markMode && t.image && !t.image.marks) t.image.marks = []; }); }
  if (act === 'mkclear') { markMode = false; return commit(w => { const t = curT(w); if (t.image) { delete t.image.marks; delete t.image.mk; } }, 'Đã xóa các điểm'); }
  if (act === 'mkdel') { const i = +v; return commit(w => { const t = curT(w); if (t.image && t.image.marks) t.image.marks.splice(i, 1); }); }
  if (act === 'mkshape' || act === 'mklabel') return commit(w => { const t = curT(w); if (!t.image) return; const mk = t.image.mk = t.image.mk || {}; if (act === 'mkshape') mk.shape = v; else mk.label = v; if (mk.shape !== 'square') delete mk.shape; if (mk.label !== 'none') delete mk.label; if (!Object.keys(mk).length) delete t.image.mk; });
  if (act === 'gtmove') { const id = sel.item, d = +v; return commit(w => gtMove(curT(w), id, d)); }
  if (act === 'gtdel') { const id = sel.item, tid = sel.id; return commit(w => { const t = w.tasks.find(y => y.id === tid); dropOrphans(t, id); t.extras = (t.extras || []).filter(y => y.id !== id); if (!t.extras.length) delete t.extras; }, 'Đã xóa khối', () => { sel = { type: 'task', id: tid }; refreshSel(); }); }
  if (act === 'set') { let val = parseV(v); if (b.dataset.def !== undefined && String(val) === b.dataset.def) val = null; return keepG0(() => commitSet(b.dataset.p, val)); }
  if (act === 'rst') return keepG0(() => commitSet(b.dataset.p, null));
  if (act === 'auto') return commit(w => selTargets(w).forEach(([t, s]) => autoReset(t, s)), 'Đã về tự động');
  if (act === 'scope') return applyScope(v);
  if (act === 'center') return commit(w => selTargets(w).forEach(([t, s]) => { const c = cfgOf(t, s, true); c.frame = c.frame || {}; c.frame.ox = c.frame.oy = c.frame.zoom = null; }));
  if (act === 'fix') return applyFix(b.dataset.id, v);
  if (act === 'guides') { guides = v === '1'; publish({ guides }); draw(); renderInspector(); return; }
  if (extraActs[act]) return extraActs[act](b, v);
  if (act === 'layout') commit(w => { const t = curT(w), fit = t.layout.frame.fit; Object.assign(t.layout, { task: v, split: null, cols: null, cw: null, width: null, align: null, valign: null }); t.layout.frame = fit ? { fit } : {}; });
  else if (act === 'font') commit(w => { if (v === 'andika') delete w.font; else w.font = v; }, 'Font phiếu: ' + FONTS[v].name);
  else if (act === 'size') commit(w => { if (v === 'm') delete w.size; else w.size = v; }, 'Cỡ chữ phiếu: ' + SIZES[v]);
  else if (act === 'flow') commit(w => { w.flow = v; }, v === 'page' ? 'Tách trang' : 'Liền trang');
  else if (act === 'sheet-preset') keepG0(() => commit(w => { if (v === 'free') { if (w.spacing.preset !== 'free') { w.spacing.overrides = sheetSpacing(); w.spacing.preset = 'free'; } } else { w.spacing.preset = v; w.spacing.overrides = {}; } }));
  else if (act === 'task-preset') keepG0(() => commit(w => { const t = curT(w); if (v === 'free') { if (t.spacing.preset !== 'free') { t.spacing.overrides = spacingOf(t); t.spacing.preset = 'free'; } } else { t.spacing.preset = v || null; t.spacing.overrides = {}; } }));
  else if (act === 'rst-sp') keepG0(() => commit(w => { const o = b.dataset.sp === 'sheet' ? w.spacing.overrides : curT(w).spacing.overrides; delete o[b.dataset.key]; }));
  else if (act === 'attach') commit(w => { const a = curT(w).answer; a.attach = v; if (v === 'inline') a.layout = a.kind === 'choice' ? 'A4' : 'A2'; else if (a.kind === 'sentence' && a.layout === 'A2') a.layout = 'A1'; });
  else if (act === 'al') { const t0 = curT(ws), ch = aChoices(t0).find(x => x.A === v); if (!ch || !ch.att) { toast('Kiểu này không dùng được cho nội dung hiện tại'); return; } const sw = ch.att !== t0.answer.attach;
    commit(w => { const a = curT(w).answer; a.attach = ch.att; a.layout = v; }, sw ? `Đã chuyển Gắn đáp án sang “${ATTACH[ch.att]}” vì ${AL[v]} không đặt “${ATTACH[t0.answer.attach]}” được` : null); }
  else if (act === 'wbstyle') commit(w => { curT(w).wordBank.style = v; });
  else if (act === 'wblab') commit(w => { curT(w).wordBank.label = v; });
  else if (act === 'wb') commit(w => { curT(w).wordBank.placement = v; });
  else if (act === 'reset-answer') { const orig = baseTask(curT(ws)); if (orig) commit(w => { const a = curT(w).answer; a.attach = orig.answer.attach; a.layout = orig.answer.layout; a.params = clone(orig.answer.params); }, 'Đáp án đã về kiểu ban đầu'); }
});
document.getElementById('insp').addEventListener('change', e => {
  const i = e.target;
  if (i.dataset.pv) {
    const raw = i.value.trim(); if (raw === '') return keepG0(() => commitSet(i.dataset.pv, null));
    let v = parseFloat(raw.replace(',', '.')); if (isNaN(v)) return render();
    const mn = parseFloat(i.min), mx = parseFloat(i.max);
    if (!isNaN(mn) && v < mn) { v = mn; toast(`Giá trị tối thiểu là ${fmtN(mn)}`); } if (!isNaN(mx) && v > mx) { v = mx; toast(`Giá trị tối đa là ${fmtN(mx)}`); }
    return keepG0(() => commitSet(i.dataset.pv, v));
  }
  if (i.dataset.pr) { const v = +i.value; return commitSet(i.dataset.pr, String(v) === i.dataset.def ? null : v); }
  if (i.dataset.sp) {
    const key = i.dataset.key, min = MINS[key]; let v = parseFloat(i.value);
    if (isNaN(v)) return render();
    if (v < min) { v = min; toast(`${SP_LABEL[key]} không nhỏ hơn ${min} mm`); }
    if (i.dataset.sp === 'sheet') keepG0(() => commit(w => { if (w.spacing.preset !== 'free') { w.spacing.overrides = sheetSpacing(); w.spacing.preset = 'free'; } w.spacing.overrides[key] = v; }, 'Đã chuyển sang Tự do'));
    else keepG0(() => commit(w => { const t = curT(w); if (t.spacing.preset !== 'free') { t.spacing.overrides = spacingOf(t); t.spacing.preset = 'free'; } t.spacing.overrides[key] = v; }));
  }
  if (extraActs.change) extraActs.change(i);
});
document.getElementById('insp').addEventListener('input', e => {
  const i = e.target; if (!i.dataset.pr) return;
  const v = +i.value, fk = i.dataset.fmt, out = i.nextElementSibling;
  if (fk === 'zoom' && Math.abs(v - 100) <= 7) i.value = 100;
  const x = +i.value;
  out.textContent = fk === 'split' ? `${x} / ${100 - x}` : /scale|zoom|first/.test(i.dataset.pr) ? x + '%' : x;
  const t = curT(ws), el = stage.querySelector(`.task[data-task="${sel.id}"]`); if (!el || !t) return;
  if (i.dataset.pr === 'split' && kindOf(t, sel) === 'task') { const tt = clone(t); tt.layout.split = x; el.style.setProperty('--tpl', tplOf(tt)); }
  else if (i.dataset.pr === 'split' && sel.item) { const r = el.querySelector(`.cell.row[data-cell="${sel.item}"] .rowbody`); if (r) r.style.setProperty('--tpl', `${x}fr ${100 - x}fr`); }
  else if (i.dataset.pr === 'frame.zoom') { const box = sel.item ? el.querySelector(`.ci[data-ck="${sel.item}"]`) : el; if (box) box.style.setProperty('--z', x / 100); }
});
function selectFrom(b, e) {
  const s = b.dataset.sel, fromNav = !!(b.closest('#tree') || b.closest('.crumb'));
  const s2 = s === 'sheet' ? { type: 'sheet' } : s === 'task' ? { type: 'task', id: b.dataset.id } : (b.dataset.item ? { type: 'group', id: b.dataset.id, g: b.dataset.g, item: b.dataset.item } : { type: 'group', id: b.dataset.id, g: b.dataset.g });
  pick(s2, e && (e.shiftKey || e.ctrlKey || e.metaKey));
  if (s !== 'sheet' && fromNav) {
    const tk = stage.querySelector(`.task[data-task="${s2.id}"]`), gn = s === 'group' && stage.querySelector(`[data-node="${nodeKey(s2)}"]`);
    const el = gn && s2.g !== 'G0' ? gn : tk; if (el) el.scrollIntoView({ block: el === tk ? 'start' : 'center', behavior: 'smooth' });
  }
}
// Chọn container (add = giữ Shift/Ctrl để chọn thêm, giai đoạn 3)
let pick = (s2) => { sel = s2; multi = []; refreshSel(); };
document.getElementById('tree').addEventListener('click', e => {
  const u = e.target.closest('[data-up]'), x = e.target.closest('[data-upx]');
  if (u) { const t = ws.tasks.find(y => y.id === u.dataset.up), inp = document.getElementById('upfile'); inp.dataset.task = t.id; inp.dataset.slot = ''; inp.multiple = true; inp.value = ''; inp.click(); return; }
  if (x) { commit(w => { delete w.tasks.find(y => y.id === x.dataset.upx).uploads; const t = w.tasks.find(y => y.id === x.dataset.upx); const o = baseTask(t); if (t.image && o && o.image) t.image.ar = o.image.ar; }, 'Đã xóa ảnh tải lên'); return; }
  const sg = e.target.closest('[data-stg]');
  if (sg) { sectClick(sg.dataset.stg); return; }
  const b = e.target.closest('[data-sel]');
  if (b && b.dataset.sel === 'task') {
    // Bấm mũi tên, hoặc bấm lại Task đang mở và đang chọn: thu gọn. Bấm Task khác: mở Task đó, Task cũ tự thu gọn.
    const id = b.dataset.id, add = e.shiftKey || e.ctrlKey || e.metaKey, isOpen = openTask === id;
    if (isOpen && !add && (e.target.closest('.chev') || (sel.type === 'task' && sel.id === id && !multi.length))) { openTask = null; renderTree(); return; }
    if (!isOpen && !add) openTask = id;
  }
  if (b) selectFrom(b, e);
});
// Đọc ảnh, thu nhỏ cạnh dài về tối đa 1600 px để nhẹ, trả về {src, ar}
function loadImg(file) {
  return new Promise((ok, no) => {
    const r = new FileReader();
    r.onerror = () => no(new Error('read'));
    r.onload = () => { const im = new Image(); im.onerror = () => no(new Error('decode')); im.onload = () => {
      const k = Math.min(1, 1600 / Math.max(im.naturalWidth, im.naturalHeight)), w = Math.round(im.naturalWidth * k), h = Math.round(im.naturalHeight * k);
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const g = cv.getContext('2d');
      const png = /png|gif|webp|svg/.test(file.type); if (!png) { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); }
      g.drawImage(im, 0, 0, w, h);
      ok({ src: cv.toDataURL(png ? 'image/png' : 'image/jpeg', .86), ar: +(w / h).toFixed(4), w, h }); }; im.src = r.result; };
    r.readAsDataURL(file);
  });
}
document.getElementById('upfile').addEventListener('change', e => { const inp = e.target, files = [...inp.files]; if (files.length) dropImages(inp.dataset.task, files, inp.dataset.slot || null); inp.dataset.slot = ''; });
// Chọn ngay khi nhấn chuột (không đợi click): nếu ô nhập ở Inspector đang mở thì chốt giá trị trước,
// nhờ vậy việc vẽ lại trang không làm mất cú bấm chọn container khác.
const clampMk = v => Math.max(2, Math.min(98, Math.round(v * 10) / 10));
stage.addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  const d = e.target.closest('.mkd'), task = e.target.closest('.task');
  if (d && task) {
    e.stopPropagation(); e.preventDefault(); const tid = task.dataset.task, i = +d.dataset.i, mk = d.parentElement; let moved = false, nx, ny;
    pick({ type: 'group', id: tid, g: 'G1' });
    const mv = ev => { const r = mk.getBoundingClientRect(); nx = clampMk((ev.clientX - r.left) / r.width * 100); ny = clampMk((ev.clientY - r.top) / r.height * 100); moved = true; const live = stage.querySelector(`.task[data-task="${tid}"] .mkd[data-i="${i}"]`); if (live) { live.style.left = nx + '%'; live.style.top = ny + '%'; } };
    const up = () => { document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up); if (moved) commit(w => { const t = w.tasks.find(x => x.id === tid); if (t && t.image && t.image.marks && t.image.marks[i]) { t.image.marks[i].x = nx; t.image.marks[i].y = ny; } }); };
    document.addEventListener('pointermove', mv); document.addEventListener('pointerup', up); return;
  }
  if (markMode && task && sel.type === 'group' && sel.g === 'G1' && !sel.item && task.dataset.task === sel.id) {
    const pic = e.target.closest('.g1 .pic'), mk = pic && pic.querySelector('.mk');
    if (pic && mk) { e.stopPropagation(); e.preventDefault(); const r = mk.getBoundingClientRect(), x = clampMk((e.clientX - r.left) / r.width * 100), y = clampMk((e.clientY - r.top) / r.height * 100), tid = sel.id;
      commit(w => { const t = w.tasks.find(z => z.id === tid); if (t && t.image) { t.image.marks = t.image.marks || []; if (t.image.marks.length < 20) t.image.marks.push({ x, y }); } }); return; }
  }
}, true);
stage.addEventListener('pointerdown', e => {
  if (e.button !== 0 || e.target.closest('.splitter,.rsz')) return;
  const ae = document.activeElement; if (ae && ae.closest && ae.closest('#insp')) ae.blur();
  const n = e.target.closest('[data-node]');
  if (!n) { if (e.target.closest('.page')) pick({ type: 'sheet' }); return; }
  const [id, g, item] = n.dataset.node.split(':');
  pick(g ? (item ? { type: 'group', id, g, item } : { type: 'group', id, g }) : { type: 'task', id }, e.shiftKey || e.ctrlKey || e.metaKey);
});
// Thanh trên cùng là React (src/ui/TopBar.tsx): đăng ký hành động cho các nút
actions.undo = undo;
actions.toast = toast;
actions.draw = () => draw();
actions.liveScale = () => { if (zoom == null) stage.style.setProperty('--s', scaleNow()); };
actions.redo = redo;
actions.setAge = v => commit(w => { w.age = v; }, `Đã đổi độ tuổi: ${v}`);
actions.zoomIn = () => { zoom = Math.min(1.5, Math.round((scaleNow() + .1) * 10) / 10); draw(); };
actions.zoomOut = () => { zoom = Math.max(.3, Math.round((scaleNow() - .1) * 10) / 10); draw(); };
actions.zoomFit = () => { zoom = null; draw(); };
actions.toggleGuides = () => { guides = !guides; publish({ guides }); draw(); if (sel.type === 'sheet') renderInspector(); };
// Hộp Xem JSON / Xuất MD là React (src/ui/Dialogs.tsx)
actions.showMd = () => publish({ dataDlg: { kind: 'md', text: sheetToMd(ws) } });
actions.showJson = () => publish({ dataDlg: { kind: 'json', text: JSON.stringify(ws, null, 2) } });
// Esc: lên một cấp (câu/ô → nhóm → Task → Phiếu)
function upLevel() {
  if (sel.type === 'group' && sel.item) sel = { type: 'group', id: sel.id, g: sel.g };
  else if (sel.type === 'group') sel = { type: 'task', id: sel.id };
  else sel = { type: 'sheet' };
  multi = []; refreshSel();
}
let keyExtra = () => false; // phím tắt bổ sung (giai đoạn 3)
document.addEventListener('keydown', e => {
  if (e.target.matches('input,textarea,select')) return;
  const k = e.key.toLowerCase();
  if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
  else if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); redo(); }
  else if (k === 'escape') upLevel();
  else if (keyExtra(e)) e.preventDefault();
});
let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (zoom == null) draw(); }, 150); });

/* ================= Giai đoạn 3: tự động hóa ================= */
// --- (1) Điểm bố cục: chiều cao ước tính (mm) + phạt nhẹ khi khác luật mặc định hoặc nhiều cột hơn mặc định ---
function scoreLayout(t, L, cols) {
  const c = clone(t); c.layout.task = L; c.layout.cols = cols ?? null; c.layout.split = null; c.layout.width = null; c.number = t.number;
  if (layoutReasons(c)[L]) return null;
  const h = measure(c, null) / MM, rg = colsRange(c, L), cd0 = colsDefault(c, L), A = t.answer.layout, p = t.answer.params || {};
  // Chất lượng trước tiết kiệm chỗ: đổi khác luật mặc định phạt 25 mm, mỗi cột thêm phạt 12 mm
  let pen = (L !== autoLayout(t) ? 25 : 0) + (cols && cols > cd0 ? (cols - cd0) * 12 : 0);
  // Không chia cột cho bài viết (dòng viết, nhiều dòng), không bỏ lưới ảnh, không ép item nhiều dòng vào 2 cột
  if (cols && cols > cd0 && (['A1', 'A8'].includes(A) || (p.lines || 1) > 1 || ck(t) === 'dialogue' || (its(t) || []).some(it => it.lines))) pen += 1000;
  if (autoLayout(t) === 'T5' && L !== 'T5') pen += 1000;
  if (L === 'T4' && ['A1', 'A8'].includes(A)) pen += 1000; // dòng viết không ép vào cột đáp án hẹp
  if (h > CONTENT_H) pen += 1000;
  meas.innerHTML = '';
  return { L, cols: cols ?? null, h: Math.round(h), score: h + pen, rg };
}
function candidates(t) {
  const why = layoutReasons(t), out = [];
  Object.keys(TL).filter(L => !why[L]).forEach(L => {
    const c = clone(t); c.layout.task = L; const rg = colsRange(c, L);
    if (rg) for (let n = rg[0]; n <= rg[1]; n++) { const r = scoreLayout(t, L, n === colsDefault(c, L) ? null : n); if (r) out.push(r); }
    else { const r = scoreLayout(t, L, null); if (r) out.push(r); }
  });
  return out.sort((a, b) => a.score - b.score);
}
let rankCache = { key: '', list: [] };
function rankedFor(t) {
  const key = JSON.stringify([t.id, t.layout, t.spacing, t.answer, ws.age, ws.spacing]);
  if (rankCache.key !== key) rankCache = { key, list: candidates(t) };
  return rankCache.list;
}
rankLayouts = t => { const seen = [], why = layoutReasons(t); rankedFor(t).forEach(r => { if (!seen.includes(r.L)) seen.push(r.L); }); Object.keys(TL).filter(k => !why[k] && !seen.includes(k)).forEach(k => seen.push(k)); return seen; };
rkNote = (t, k) => { const l = rankedFor(t), best = l[0], r = l.find(x => x.L === k); if (!r) return ''; return `<small class="sc">${best && best.L === k ? 'Gợi ý · ' : ''}~${r.h} mm</small>`; };
// Tối ưu bố cục cả phiếu: chỉ đổi các Task đang ở Tự động; chọn ứng viên điểm tốt hơn rõ (≥ 5 mm)
function optimizeAll(w) {
  let n = 0;
  w.tasks.forEach(t => {
    if (t.layout.task !== 'auto' || t.layout.cols != null) return;
    const cur = scoreLayout(t, layoutOf(t), null), best = candidates(t)[0];
    if (best && cur && best.score < cur.score - 10 && (best.L !== layoutOf(t) || best.cols != null)) { t.layout.task = best.L; t.layout.cols = best.cols; n++; }
  });
  return n;
}
// --- (2) Vừa N trang / Lấp đầy trang ---
function pagesOf(w) { const keep = ws; setWs(w); let r; try { r = paginate(); } finally { setWs(keep); } return r.pages.length; }
function fitPages(N) {
  const steps = [
    w => { if (w.spacing.preset === 'airy' || w.spacing.preset === 'free') { w.spacing.preset = 'normal'; w.spacing.overrides = {}; } },
    w => { w.spacing.preset = 'compact'; w.spacing.overrides = {}; },
    w => { optimizeAll(w); },
    w => { w.tasks.forEach(t => { if (!t.spacing.preset) t.spacing.preset = 'compact'; }); },
    w => { w.tasks.forEach(t => { const fr = t.layout.frame; if (t.image && !fr.fit && layoutOf(t) !== 'T8') fr.scale = Math.min(fr.scale || 100, 80); }); },
    w => { if (w.flow === 'page') w.flow = 'cont'; }
  ];
  let c = clone(ws), best = { n: pagesOf(c), w: clone(c) };
  for (const st of steps) { st(c); const n = pagesOf(c); if (n < best.n) best = { n, w: clone(c) }; if (n <= N) break; }
  return best;
}
// --- (3) Nhớ cấu hình theo dạng bài (lưu trong trình duyệt của người dùng) ---
const PKEY = 'wsEditor.typePresets.v1';
// Khóa mặc định (v77): dạng bài có sẵn thì theo typeId; Task tự chế (custom) thì theo cấu hình, để hai dạng khác nhau không dùng chung một mặc định.
const presetKey = t => t.typeId && t.typeId !== 'custom' ? t.typeId : `custom|${ck(t)}|${t.answer.kind}|${t.answer.layout || '-'}|${t.image ? 'img' : ''}|${t.wordBank ? 'bank' : ''}`;
let presetMem = {};
function presetsGet() { try { const v = JSON.parse(localStorage.getItem(PKEY) || 'null'); if (v) presetMem = v; } catch (_) {} return presetMem; }
function presetsSet(v) { presetMem = v; try { localStorage.setItem(PKEY, JSON.stringify(v)); } catch (_) {} }
function presetFrom(t) {
  const L = clone(t.layout); L.cells = null; if (L.table) { L.table.rhs = null; }
  const pa = clone(t.answer.params || {}); delete pa.perItem;
  return { name: taskLabel(t), layout: L, spacing: clone(t.spacing), answer: { attach: t.answer.attach, layout: t.answer.layout, params: pa }, bank: t.wordBank ? { placement: t.wordBank.placement, style: t.wordBank.style, label: t.wordBank.label, w: t.wordBank.w ?? null, align: t.wordBank.align ?? null, valign: t.wordBank.valign ?? null } : null };
}
function presetApply(t, pr) {
  t.layout = Object.assign(LAYOUT_DEF(), clone(pr.layout)); t.spacing = clone(pr.spacing);
  if (pr.answer && alOptsFor(t, pr.answer)) { t.answer.attach = pr.answer.attach; t.answer.layout = pr.answer.layout; t.answer.params = clone(pr.answer.params); }
  if (pr.bank && t.wordBank) Object.assign(t.wordBank, clone(pr.bank));
  tidy(t);
}
function alOptsFor(t, a) { const c = clone(t); c.answer.attach = a.attach; return attachOpts(t).includes(a.attach) && alOpts(c).includes(a.layout); }
// Áp mặc định đã lưu cho các Task chưa chỉnh tay (khi nạp phiếu)
function applyPresets(w) { const P = presetsGet(); let n = 0; w.tasks.forEach(t => { const pk = presetKey(t); if (P[pk] && !hasOverride(t)) { presetApply(t, P[pk]); n++; } }); return n; }
function loadSheet(obj, msg) {
  // Nạp phiếu an toàn: bù trường thiếu; lỗi ở bất kỳ bước nào thì giữ nguyên phiếu đang mở.
  let w; const notes = [];
  try { w = fillSheet(obj, notes); } catch (e) { toast(`Không nạp được: ${e.message}. Phiếu đang mở giữ nguyên.`); return false; }
  const old = { ws, base, hist, fut, sel, multi, lastStart, openTask };
  try {
    base = clone(w); const n = applyPresets(w); setWs(w); hist = []; fut = []; sel = { type: 'sheet' }; multi = []; lastStart = null; openTask = null; render();
    toast(msg + (n ? ` · đã áp mặc định cho ${n} Task` : '') + (notes.length ? ` · đã bù: ${notes.slice(0, 3).join(', ')}${notes.length > 3 ? '…' : ''}` : ''));
    return true;
  } catch (e) {
    setWs(old.ws); ({ base, hist, fut, sel, multi, lastStart, openTask } = old); try { render(); } catch (_) {}
    toast(`Không nạp được (lỗi khi dàn trang: ${e.message}). Phiếu đang mở giữ nguyên.`); return false;
  }
}
// --- (4) Chọn nhiều container (Shift/Ctrl + bấm) ---
pick = (s2, add) => {
  if (add && sel.type !== 'sheet' && s2.type !== 'sheet') {
    const t1 = ws.tasks.find(x => x.id === sel.id), t2 = ws.tasks.find(x => x.id === s2.id), k1 = t1 && kindOf(t1, sel);
    if (t1 && t2 && k1 === kindOf(t2, s2) && !['cimgs', 'head'].includes(k1)) {
      const k = nodeKey(s2);
      if (k !== nodeKey(sel)) { if (multi.some(x => nodeKey(x) === k)) multi = multi.filter(x => nodeKey(x) !== k); else multi.push(s2); }
      return refreshSel();
    }
    toast('Chỉ chọn thêm được các container cùng loại');
  }
  sel = s2; multi = []; refreshSel();
};
// --- (5) Phím tắt ---
let clip = null;
function domMm(sel2) { const e = stage.querySelector(sel2); return e ? e.getBoundingClientRect().height / scaleNow() / MM : null; }
// Thông số chính theo hướng phím cho từng loại container: [đường dẫn, bước, min, max, giá trị hiện tại]
function nudgeSpec(t, s, axis) {
  const k = kindOf(t, s), L = layoutOf(t), lay = t.layout, a = t.answer, key = s.item;
  if (k === 'task') {
    if (axis === 'x') {
      if (ratioOf(t) != null && cellDirOf(t) !== 'row') { const m = rmeta(t, L); return ['split', 5, m.range[0], m.range[1], ratioOf(t)]; }
      if (L === 'T6' && !(t.wordBank && t.wordBank.placement === 'right')) return ['width', 5, 40, 100, lay.width || 100];
      if (L === 'T5' && colsOf(t) > 1) return ['colGap', 1, 2, 20, lay.colGap ?? spacingOf(t).itemGap];
      return null;
    }
    return ['sp.itemGap', .5, MINS.itemGap, 20, spacingOf(t).itemGap];
  }
  if (k === 'frame') {
    if (axis === 'y') return isColI(t) && fitOf(t) === 'height' ? null : ['frame.h', 5, 25, 150, frOf(t).h || Math.round(domMm(`.task[data-task="${t.id}"] .g1 .pic`) / 5) * 5];
    if (L === 'T8') return ['frame.w', 5, IW8[0], IW8[1], frOf(t).w ?? IW8[2]];
    return fitOf(t) ? null : ['frame.scale', 5, 40, 100, frOf(t).scale || 100];
  }
  if (k === 'cimg' || k === 'cimgs') {
    const kk = key || cellKeys(t, 'cimg')[0];
    if (axis === 'y') return ['frame.h', 5, 15, 150, cellFr(t, kk).h || Math.round(domMm(`.task[data-task="${t.id}"] .ci[data-ck="${kk}"] .pic`) / 5) * 5];
    return cellDirOf(t) === 'row' ? ['split', 5, 15, 50, cellSplit(cellCfg(t, kk))] : null;
  }
  if (k === 'crow') return axis === 'x' ? ['split', 5, 15, 50, cellSplit(cellCfg(t, key))] : ['rowH', 5, 10, 120, cellCfg(t, key).rowH || Math.round(domMm(`.task[data-task="${t.id}"] .cell.row[data-cell="${key}"] .rowbody`) / 5) * 5];
  if (k === 'answer' || k === 'aitem') {
    const p = pOf(t, key ? { id: key } : null), A = a.layout, inl = a.attach === 'inline', age = AGE[ws.age];
    if (axis === 'y') return (A === 'A1' || A === 'A8') ? ['lineMm', .5, age.line, 25, Math.max(p.lineMm || 0, age.line)] : (A === 'A2' && inl) ? ['lines', 1, 1, 8, p.lines || 1] : null;
    if (A === 'A1' || A === 'A8') return ['w', 5, 40, 100, p.w || 100];
    if (A === 'A2') return inl ? ['lenMm', 5, 15, 150, p.lenMm || A2MM[ws.age]] : ['width', 1, 4, 30, p.width || 10];
    if (A === 'A3') return ['boxW', .5, 5, 12, p.boxW || 6.5];
    if (A === 'A4' && !inl) return ['gap', 1, 2, 20, p.gap ?? 7];
    if (A === 'A5') return ['size', .5, 4, 12, p.size || 6.5];
    if (A === 'A6') return ['size', .5, 5, 12, p.size || 7.5];
    if (A === 'A7') return ['size', .5, 1.5, 6, p.size || 2.8];
    return null;
  }
  if (k === 'bank') return axis === 'x' ? (t.wordBank.placement === 'right' ? ['@split', 5, 40, 80, ratioOf(t)] : ['w', 5, 30, 100, t.wordBank.w || 100]) : null;
  return null;
}
function nudge(axis, dir, big) {
  const t = curT(ws); if (!t) return false;
  const sp = nudgeSpec(t, sel, axis); if (!sp) { toast('Container này không có thông số chỉnh theo hướng đó'); return true; }
  const [p, step, mn, mx, cur] = sp, v = Math.round(clampN((cur || 0) + dir * step * (big ? 2 : 1), mn, mx) * 10) / 10;
  if (v === cur) return true;
  keepG0(() => commitSet(p, v)); toast(`${p.replace(/^@|^sp\./, '')}: ${fmtN(v)}`);
  return true;
}
// Thứ tự container để Tab: Task → các nhóm → các ô, lần lượt từng Task
function tabOrder() {
  const out = [];
  ws.tasks.forEach(t => { out.push({ type: 'task', id: t.id }); groupsOf(t).forEach(g => { out.push({ type: 'group', id: t.id, g }); if (g === 'G1' && cellImgMode(t)) cellKeys(t, 'cimg').forEach(k => out.push({ type: 'group', id: t.id, g, item: k })); if (g === 'G2' && cellDirOf(t) === 'row') cellKeys(t, 'crow').forEach(k => out.push({ type: 'group', id: t.id, g, item: k })); }); });
  return out;
}
keyExtra = e => {
  const k = e.key;
  if (!(e.target === document.body || e.target.closest('#stage'))) return false; // chỉ khi đang thao tác trên trang
  if ((k === 'Delete' || k === 'Backspace') && sel.type !== 'sheet' && sel.g === 'G1' && !sel.item && curT(ws) && curT(ws).image) { delFrame(curT(ws).id); return true; }
  if ((e.ctrlKey || e.metaKey) && (k === 'c' || k === 'C') && sel.type !== 'sheet') { const t = curT(ws), kk = kindOf(t, sel); if (kk === 'head') return false; const s0 = kk === 'cimgs' ? { type: 'group', id: t.id, g: 'G1', item: cellKeys(t, 'cimg')[0] } : sel; clip = { kind: kindOf(t, s0), pl: payloadOf(t, s0) }; toast('Đã sao chép kiểu của container'); return true; }
  if ((e.ctrlKey || e.metaKey) && (k === 'v' || k === 'V') && clip && sel.type !== 'sheet') {
    const t = curT(ws), kk = kindOf(t, sel), kind = kk === 'cimgs' ? 'cimg' : kk;
    if (kind !== clip.kind) { toast('Chỉ dán được kiểu cho container cùng loại'); return true; }
    commit(w => selTargets(w).forEach(([t2, s2]) => pasteInto(t2, s2, clip.pl)), 'Đã dán kiểu'); return true;
  }
  if (k === 'Tab' && !e.ctrlKey && !e.metaKey) {
    const o = tabOrder(), i = o.findIndex(x => nodeKey(x) === nodeKey(sel)), j = i < 0 ? 0 : (i + (e.shiftKey ? -1 : 1) + o.length) % o.length;
    sel = o[j]; multi = []; refreshSel();
    const el = stage.querySelector(`[data-node="${nodeKey(sel)}"]`) || stage.querySelector(`.task[data-task="${sel.id}"]`); if (el) el.scrollIntoView({ block: 'nearest' });
    return true;
  }
  if (sel.type === 'sheet' || e.ctrlKey || e.metaKey || e.altKey) return false;
  if (k === 'ArrowLeft') return nudge('x', -1, e.shiftKey);
  if (k === 'ArrowRight') return nudge('x', 1, e.shiftKey);
  if (k === 'ArrowUp') return nudge('y', -1, e.shiftKey);
  if (k === 'ArrowDown') return nudge('y', 1, e.shiftKey);
  return false;
};
LEGEND = 'Kéo thanh hoặc cạnh = đổi kích thước · Bấm đúp = về tự động · Esc = lên cấp · Mũi tên = chỉnh nhanh · Tab = container kế · Shift+bấm = chọn thêm · Ctrl+C / Ctrl+V = chép kiểu';
// --- Panel phiếu: tự động hóa ---
sheetExtra = () => {
  const n = lastRes ? lastRes.pages.length : 1;
  return `<h3>Tự động hóa</h3>
    <div class="stack"><button class="btn" data-act="optimize" title="Chỉ đổi các Task đang ở Tự động">Tối ưu bố cục cả phiếu</button></div>
    <div class="fitrow" data-param="fitN"><label for="fitN">Ép vừa</label><input id="fitN" type="number" min="1" max="${n}" step="1" value="${Math.max(1, n - 1)}"><span>trang</span><button class="btn" data-act="fitN" title="Thử lần lượt: khoảng cách Vừa → Gọn, tối ưu bố cục, Gọn từng Task, ảnh nhỏ hơn 20%, Liền trang. Dừng ở bước đầu tiên đạt số trang.">Thu</button></div>
    <div class="fld s ${ws.fill ? 'ov' : ''}" data-param="fill"><span class="fl">Lấp đầy trang</span><span class="fc"><span class="seg"><button data-act="fill" data-v="0" class="${ws.fill ? '' : 'on'}">Tắt</button><button data-act="fill" data-v="1" class="${ws.fill ? 'on' : ''}">Bật</button></span><span class="hint fh">Chia phần trống cuối mỗi trang (trừ trang cuối) vào khoảng giữa các Task, tối đa ${FILL_MAX} mm mỗi khoảng.</span></span><button class="rst" data-act="fill" data-v="0" ${ws.fill ? '' : 'hidden'} aria-label="Về tự động">↺</button></div>`;
};
extraActs.optimize = () => { const before = lastRes.pages.length; let n = 0; commit(w => { n = optimizeAll(w); }); toast(n ? `Đã tối ưu ${n} Task · ${before} → ${lastRes.pages.length} trang` : 'Bố cục hiện tại đã tốt nhất theo điểm'); };
extraActs.fitN = () => { const i = document.getElementById('fitN'), N = Math.max(1, parseInt(i.value, 10) || 1), before = lastRes.pages.length, r = fitPages(N); if (r.n >= before) { toast(`Không thu được dưới ${before} trang bằng các bước tự động`); return; } commit(w => { Object.assign(w, clone(r.w)); }); toast(r.n <= N ? `Đã thu phiếu về ${r.n} trang` : `Tốt nhất là ${r.n} trang (chưa đạt ${N})`); };
extraActs.fill = (b, v) => commit(w => { if (v === '1') w.fill = true; else delete w.fill; }, v === '1' ? 'Đã bật Lấp đầy trang' : 'Đã tắt Lấp đầy trang');
extraActs['preset-save'] = () => { const t = curT(ws), P = Object.assign({}, presetsGet()); P[presetKey(t)] = presetFrom(t); presetsSet(P); toast(`Đã lưu mặc định cho dạng ${taskLabel(t)}`); renderInspector(); };
extraActs['preset-apply'] = () => { const t = curT(ws), pr = presetsGet()[presetKey(t)]; if (pr) commit(w => presetApply(curT(w), pr), `Đã áp mặc định của dạng ${taskLabel(t)}`); };
extraActs['preset-del'] = (b, v) => { const P = Object.assign({}, presetsGet()); delete P[v]; presetsSet(P); toast(`Đã xóa mặc định của dạng ${v}`); renderInspector(); };
extraActs.import = () => openImport('sheet');
extraActs.change = i => { if (i.id === 'fitN') { /* chờ bấm nút */ } };
// Nút lưu / áp mặc định trong panel Task (mục Về tự động)
const _taskPanel = taskPanel;
taskPanel = (t, s) => {
  const has = !!presetsGet()[presetKey(t)];
  const extra = `<button class="btn" data-act="preset-save">Lưu làm mặc định cho dạng ${esc(taskLabel(t))}</button>${has ? `<button class="btn" data-act="preset-apply">Áp mặc định đã lưu của dạng ${esc(taskLabel(t))}</button>` : ''}`;
  return _taskPanel(t, s).replace('<div class="stack"><button class="btn" data-act="auto"', `<div class="stack">${extra}<button class="btn" data-act="auto"`);
};
// (v106: nút "Nạp phiếu này" trong hộp JSON không bao giờ hiện, đã bỏ khi chuyển sang React)
// Danh sách mẫu theo nhóm (thứ tự LIB_GROUPS)
const libGroups = () => LIB_GROUPS.map(g => [g, RECIPES.filter(r => (r.group || 'Danh sách câu') === g)]).filter(x => x[1].length);
const libOpts = (selId, mark) => libGroups().map(([g, rs]) => `<optgroup label="${esc(g)}">${rs.map(r => `<option value="${r.id}" ${selId === r.id ? 'selected' : ''}>${esc(r.name)}${mark && mark(r) ? mark(r) : ''}</option>`).join('')}</optgroup>`).join('');
const endGap = s => /\s_{3,}\s*[.?!]?\s*$/.test(s) && !/:\s*_{3,}\s*$/.test(s);   // gạch ___ ở cuối câu (không phải sau nhãn "Xxx:")
function contentWarnings(t) {
  const w = [], k = ck(t), it = its(t), a = t.answer, c = t.content;
  const W = (m, lv = 'warn') => w.push({ lv, m });
  if (t.layout.break === 'join' && ws.tasks[0] === t) W('Task đầu phiếu không nối được vào Task nào, nên hiện như Task thường.', 'info');
  const tx = x => [x.text || '', ...(x.lines || [])].join('\n');
  const blanks = it.reduce((n, x) => n + (tx(x).split('___').length - 1), 0) + (k === 'passage' ? gapCount(leadText(t)) : 0);
  if (c.form === 'table') {
    if (!(c.cols || []).length) W('Bảng chưa có cột.');
    (c.rows || []).forEach((r, i) => { if ((r.cells || []).length !== c.cols.length) W(`Hàng ${i + 1} có ${(r.cells || []).length} ô, bảng có ${c.cols.length} cột.`); });
    if (!(c.rows || []).length) W('Bảng chưa có hàng.');
    if (tblOpts(t).cross && !crossCount(c).words) W('Ô chữ chưa có từ nào (cần ít nhất hai ô liền nhau).');
    return w;
  }
  if (k === 'empty') { if (!t.image) W(c.list === false ? 'Chưa có ảnh, danh sách câu đang tắt.' : 'Chưa có ảnh và chưa có câu nào.'); (lowRes[t.id] || []).forEach(x => W(`Ảnh hơi mờ khi in (~${x.dpi} dpi, nên ≥ 150).`)); return w; }
  if (!it.length) W('Chưa có câu nào.');
  if (t.image && t.image.marks && t.image.marks.length) { if (it.length && t.image.marks.length !== it.length) W(`Ảnh có ${t.image.marks.length} điểm nhưng bài có ${it.length} câu.`, 'info'); if (fitOf(t)) W('Ảnh đang Fit (cắt khung): kiểm tra các điểm còn nằm trong khung.', 'info'); }
  if (k === 'passage' && !leadText(t).trim()) W('Bài đọc chưa có chữ.');
  const noun = k === 'dialogue' ? 'Lượt' : k === 'pairs' ? 'Cặp' : 'Câu';
  it.forEach((x, i) => {
    const n = `${noun} ${i + 1}`;
    if (['questions', 'passage', 'trace', 'dialogue'].includes(k) && !tx(x).trim() && !(x.opts && x.opts.length) && !(it.length === 1 && t.layout.num === 'off' && a.layout === 'A1')) W(`${n} chưa có chữ.`);
    if (k === 'dialogue' && !(x.who || '').trim()) W(`${n} chưa có tên người nói.`);
    if (k === 'pairs' && (!x.pair || !x.pair.l || !x.pair.r)) W(`${n} chỉ có một vế${x.pair && x.pair.r && !x.pair.l ? ' (vế phải thừa, có thể là vế gây nhiễu)' : ''}.`, x.pair && x.pair.r && !x.pair.l ? 'info' : 'warn');
    if (k === 'pairs' && x.pair && x.pair.l && !x.pair.l.img && !(x.pair.l.text || '').trim()) W(`${n}: vế trái trống.`);
    if (k === 'pairs' && x.pair && x.pair.r && !(x.pair.r.text || '').trim()) W(`${n}: vế phải trống.`);
    if (a.kind === 'choice' && a.attach === 'item' && k !== 'items' && !((x.opts || []).filter(o => String(o).trim()).length >= 2)) W(`${n} chưa có đủ lựa chọn (cần ít nhất 2).`);
    if (a.kind === 'choice' && a.attach === 'inline' && !hasChoiceMarkup(tx(x))) W(`${n} không có chỗ chọn {a|b}.`);
    if (a.kind === 'word' && a.attach === 'inline' && k !== 'dialogue' && !tx(x).includes('___')) W(`${n} không có chỗ trống ___.`);
    if (k === 'items' && c.variant === 'multi' && !(x.imgs && x.imgs.length >= 2)) W(`${n} cần ít nhất 2 ảnh lựa chọn.`);
    const s1 = tx(x).trim();
    if (/^(undefined|null|\[object object\])$/i.test(s1)) W(`${n} bị lỗi chữ (“${s1}”).`);
    else if (s1 && /:$/.test(s1) && s1.length <= 40 && !s1.includes('___') && !(x.opts && x.opts.length) && !x.img && !x.imgs) W(`${n} trông giống tiêu đề (“${s1}”), không phải câu.`);
    if (dupGapKind(t) && endGap(s1) && k !== 'items') W(`${n} có gạch ___ nhưng đáp án đã có chỗ trả lời riêng: chỗ trả lời bị trùng.`);
    if (/\[\s*\]|☐|□/.test(s1)) W(`${n} còn ký hiệu ô tick ☐ trong chữ.`);
  });
  if (k === 'dialogue' && a.attach === 'inline' && !blanks) W('Hội thoại chưa có chỗ trống ___.');
  if (t.wordBank && blanks) {
    const nw = t.wordBank.words.length;
    if (nw < blanks) W(`Khung từ có ${nw} từ nhưng có ${blanks} chỗ trống.`);
    else if (nw > blanks) W(`Khung từ thừa ${nw - blanks} từ so với ${blanks} chỗ trống (có thể là từ gây nhiễu).`, 'info');
  }
  if (k === 'passage' && c.lead && c.lead.keys) { const g = gapCount(leadText(t)); if (c.lead.keys.length !== g) W(`Bài đọc có ${g} chỗ trống nhưng ghi ${c.lead.keys.length} đáp án chỗ trống.`); }
  if (t.wordBank && !t.wordBank.words.length) W('Khung từ đang trống.');
  if (k === 'pairs' && !c.shuffle && it.some(x => x.pair && x.pair.l && x.pair.r)) W('Bài nối chưa có cặp đúng: gõ cặp đúng cạnh nhau rồi bật "Xáo vế phải khi in".', 'info');   // v90
  (lowRes[t.id] || []).forEach(x => W(`${slotName(t, x.key)[0].toUpperCase() + slotName(t, x.key).slice(1)} hơi mờ khi in (~${x.dpi} dpi, nên ≥ 150).`));
  const keyed = it.filter(x => x.key != null && String(x.key).trim() !== '').length;
  if (it.some(x => x.ex && !x.gt && !String(x.key ?? '').trim())) W('Câu ví dụ (số 0) chưa có đáp án mẫu nên phiếu chưa hiện đáp án cho câu này' + (t.answer.layout === 'A5' && it.some(x => x.imgs) ? ': tick ✓ ở ảnh đúng.' : ': gõ đáp án mẫu ở ô Đáp án của câu.'), 'info');
  if (keyed && keyed < it.length) W(`Thiếu đáp án đúng ở ${it.map((x, i) => (x.key == null || String(x.key).trim() === '') ? `${noun.toLowerCase()} ${i + 1}` : null).filter(Boolean).join(', ')}.`);
  return w;
}
// Mô tả Task bằng thành phần (khung · chỗ trả lời · phần đi kèm), suy ra từ dữ liệu. Thay cho tên công thức trên thẻ / tóm tắt.
const LIB_GROUPS = ['Danh sách câu', 'Ảnh mỗi câu', 'Riêng', 'Chỉ có ảnh', 'Bảng'];
// Thẻ dạng bài: dãy chip; go = container bấm vào để nhảy tới
function cardOf(t) {
  const f = featOf(t), m = recipeMatch(t), k = f.form, it = its(t), a = t.answer, L = layoutOf(t), chips = [];
  chips.push({ t: descOf(t), go: 'edit', cls: 'nm', title: m.exact ? `Giống mẫu có sẵn “${m.r.name}”` : 'Cấu hình riêng (không trùng mẫu có sẵn nào)' });
  if (k === 'table') chips.push({ t: `${t.content.rows.length} hàng × ${t.content.cols.length} cột`, go: 'G2' }, { t: `ô: ${CELL_NAME[f.cells]}`, go: 'G2' });
  else if (k === 'empty') chips.push(t.content.list === false ? { t: 'chỉ có ảnh', go: t.image ? 'G1' : 'task' } : { t: '0 câu', go: 'task' });
  else chips.push({ t: `${it.length} ${k === 'dialogue' ? 'lượt thoại' : k === 'pairs' ? 'cặp' : k === 'trace' ? 'từ' : 'câu'}`, go: 'G2' });
  if (k === 'passage') chips.push({ t: 'có bài đọc', go: 'G2' });
  if (k === 'dialogue' && leadText(t)) chips.push({ t: 'có lời dẫn', go: 'G2' });
  if (t.image && k !== 'empty') chips.push({ t: 'ảnh chung', go: 'G1' });
  if (k === 'items') chips.push({ t: f.variant === 'multi' ? `${Math.max(...it.map(x => (x.imgs || []).length))} ảnh lựa chọn/câu` : 'ảnh 1/câu', go: 'G1' });
  if (k === 'pairs') chips.push({ t: it.some(x => x.pair && x.pair.l && x.pair.l.img) ? 'vế trái là ảnh' : 'vế trái là chữ', go: 'G2' });
  if (f.opts) chips.push({ t: `${Math.max(...it.map(x => (x.opts || []).length))} lựa chọn/câu`, go: 'G3' });
  if (f.mark) chips.push({ t: 'chọn trong câu {a|b}', go: 'G3' });
  if (f.lines) chips.push({ t: 'ô nhiều dòng', go: 'G2' });
  if (t.wordBank) chips.push({ t: `khung từ ${t.wordBank.words.length} từ`, go: 'G4' });
  chips.push({ t: `đáp án: ${KIND_NAME[a.kind]}${a.layout ? ', ' + A_SHORT[a.layout] : ''}`, go: a.layout ? 'G3' : 'edit' });
  const cols = colsOf(t);
  chips.push({ t: `bố cục: ${TL[L].name.toLowerCase()}${cols > 1 ? `, ${cols} cột` : ''}`, go: 'task' });
  return { chips, warns: contentWarnings(t), match: m };
}
function cardHtml(t, where) {
  const c = cardOf(t);
  return `<div class="tcard" data-card="${t.id}">${c.chips.map(x => `<button class="chip ${x.cls || ''}" data-go="${x.go}" data-id="${t.id}" title="${esc(x.title || 'Bấm để tới chỗ chỉnh')}">${esc(x.t)}</button>`).join('')}</div>` +
    (c.warns.length ? `<ul class="twarn">${c.warns.map(x => `<li class="${x.lv}">${esc(x.m)}</li>`).join('')}</ul>` : '');
}
// Bấm chip: nhảy tới container tương ứng (hoặc khung soạn nội dung ở cột trái)
function goChip(b) {
  const id = b.dataset.id, g = b.dataset.go, t = ws.tasks.find(x => x.id === id); if (!t) return;
  if (g === 'edit') { sel = { type: 'task', id }; multi = []; openTask = id; sectReset(id); sectOne('cfg'); refreshSel(); const f = document.querySelector('#tree .ed .sech[data-stg="cfg"]'); if (f) { f.scrollIntoView({ block: 'nearest' }); f.focus(); } return; }
  const s2 = g === 'task' ? { type: 'task', id } : { type: 'group', id, g };
  if (s2.g && !groupsOf(t).includes(s2.g)) { sel = { type: 'task', id }; } else sel = s2;
  multi = []; refreshSel();
  const el = stage.querySelector(`[data-node="${nodeKey(sel)}"]`) || stage.querySelector(`.task[data-task="${id}"]`); if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
}
// Khu vực (section) trong Task đang mở: trạng thái mở/đóng nhớ trong trình duyệt
const SECT_KEY = 'wsEditor.sections.v2', SECT_DEF = { kind: false, info: false, content: true, parts: false, free: false };   // mặc định chỉ mở Nội dung
const SECT = Object.assign({}, SECT_DEF);
try { const v = JSON.parse(localStorage.getItem(SECT_KEY) || 'null'); if (v) Object.keys(SECT_DEF).forEach(k => { if (typeof v[k] === 'boolean') SECT[k] = v[k]; }); } catch (_) {}
const sectSave = () => { try { localStorage.setItem(SECT_KEY, JSON.stringify(SECT)); } catch (_) {} };
var sectFor = null;   // Task đã áp mặc định thu/mở các khu vực
function sectReset(id) { sectFor = id; Object.assign(SECT, SECT_DEF); sectSave(); }   // mở Task khác: chỉ mở khu vực 3 Nội dung
function sectOpen(k) { if (!SECT[k]) { SECT[k] = true; sectSave(); } }
// Câu mới: cùng bộ trường với câu cuối (trường rỗng)
function blankItem(t) {
  const it = its(t), last = it[it.length - 1] || {}, x = {};
  if (last.who != null) { const ws2 = [...new Set(it.map(y => y.who).filter(Boolean))]; const prev = it[it.length - 2]; x.who = prev && prev.who != null ? prev.who : (ws2[0] || 'A'); x.text = ''; }
  else if (last.pair) x.pair = { l: last.pair.l && last.pair.l.img ? { img: 'ảnh ' + (it.length + 1), text: '' } : { text: '' }, r: { text: '' } };
  else x.text = '';
  if (last.img) x.img = 'ảnh ' + (it.length + 1);
  if (last.imgs) x.imgs = last.imgs.map((_, j) => 'abcdef'[j]);
  if (last.opts) x.opts = last.opts.map(() => '');
  if (last.lines) { x.lines = ['']; delete x.text; }
  if (last.len) x.len = last.len;
  if (last.key != null) x.key = '';
  return x;
}
// Xóa câu: dọn chỉnh tay mồ côi (ô, đáp án từng câu, ảnh tải lên)
function dropOrphans(t, id) {
  const L = t.layout, p = t.answer.params || {};
  if (L.cells) Object.keys(L.cells).forEach(k => { if (k === id || k.startsWith(id + '.')) delete L.cells[k]; });
  if (p.perItem) delete p.perItem[id];
  if (t.uploads) Object.keys(t.uploads).forEach(k => { if (k === '@' + id || k.startsWith('@' + id + '.') || k.startsWith('@' + id + '~')) delete t.uploads[k]; });
  if (t.upMeta) Object.keys(t.upMeta).forEach(k => { if (k === '@' + id || k.startsWith('@' + id + '.')) delete t.upMeta[k]; });
  if (t.imgAr) Object.keys(t.imgAr).forEach(k => { if (k === '@' + id || k.startsWith('@' + id + '.')) delete t.imgAr[k]; });
}
const splitList = (s, re) => String(s).split(re).map(x => x.trim()).filter((x, i, a) => x || a.length > 1);
// Ghi một trường từ ô soạn vào dữ liệu
function applyField(t, k, v) {
  const p = k.split('.'), it = its(t), c = t.content;
  if (k === 'title' || k === 'instruction') { t[k] = v; return; }
  if (k === 'audio') { if (v.trim()) t.audio = v; else delete t.audio; return; }
  if (k === 'qr.link') { t.qr = t.qr || { src: 'link' }; t.qr.link = v; return; }
  if (k === 'qr.base') { ws.audioBase = v; return; }
  if (k === 'cross.grid') { const old = c.rows.slice(), L = crossParse(v.split('\n').map(x => x.replace(/\s+$/, '')).filter(x => x.length)); if (!L.length) L.push(['']); c.cols = Array(L[0].length).fill(''); c.rows = L.map((cells, i) => ({ id: old[i] && old[i].id, head: '', cells })); ensureRowIds(t); return; }
  if (k === 'lead.keys') { c.lead = c.lead || { kind: 'passage' }; const a = splitList(v, /,|\n/).map(x => x.trim()).filter(Boolean); if (a.length) c.lead.keys = a; else delete c.lead.keys; return; }
  if (k === 'lead.text') { c.lead = c.lead || { kind: 'text' }; c.lead.text = v; return; }
  if (k === 'image.label') { if (t.image) t.image.label = v; return; }
  if (k === 'wb.words') { if (t.wordBank) t.wordBank.words = splitList(v, /\n|,/).filter(Boolean); return; }
  if (p[0] === 'it') {
    const x = it[+p[1]]; if (!x) return; const f = p[2];
    if (f === 'text' || f === 'who' || f === 'img' || f === 'key') x[f] = v;
    else if (f === 'keyg') { const n = Math.max(gapN(x), +p[3] + 1), g = keyGaps(x); const a = Array.from({ length: n }, (_, j) => g[j] || ''); a[+p[3]] = String(v).replace(/\|/g, '/').trim(); if (a.some(Boolean)) x.key = n > 1 ? a.join(' | ') : a[0]; else if (x.ex) x.key = ''; else delete x.key; }
    else if (f === 'len') { const n = parseInt(v, 10); if (n > 0) x.len = n; else delete x.len; }
    else if (f === 'imgs' && p[3] != null) { x.imgs = x.imgs || []; x.imgs[+p[3]] = v; }
    else if (f === 'imgs') x.imgs = splitList(v, /,/).filter(Boolean);
    else if (f === 'opts' && p[3] != null) { x.opts = x.opts || []; const pk = exPicks(t, x, x.opts); x.opts[+p[3]] = v; if (pk.length) x.key = pk.map(j => 'abcdefgh'[j] || String(j + 1)).join(', '); }   // v87: sửa một lựa chọn, tích giữ theo vị trí
    else if (f === 'opts') x.opts = splitList(v, /\s\/\s|\n|\|/);
    else if (f === 'lines') x.lines = String(v).split('\n');
    else if (f === 'pl') { x.pair = x.pair || {}; x.pair.l = Object.assign(x.pair.l || {}, { text: v }); }
    else if (f === 'pli') { x.pair = x.pair || {}; x.pair.l = Object.assign(x.pair.l || {}, { img: v }); if (!v) delete x.pair.l.img; }
    else if (f === 'pr') { x.pair = x.pair || {}; if (v.trim() || x.pair.r) x.pair.r = { text: v }; }
    return;
  }
  if (p[0] === 'x') { const x = gtOf(t, p[1]); if (x && p[2] === 'text' && x.kind !== 'image') x.text = v; else if (x && p[2] === 'label' && x.kind === 'image') x.label = v; return; }
  if (p[0] === 'heads') { c.heads = c.heads || ['', '']; c.heads[+p[1]] = v; if (!c.heads.some(Boolean)) delete c.heads; return; }   // v105
  if (p[0] === 'tb') {
    if (p[1] === 'corner') c.corner = brIn(v);
    else if (p[1] === 'col') c.cols[+p[2]] = brIn(v);
    else if (p[1] === 'r') { const r = c.rows[+p[2]]; if (!r) return; const old = p[3] === 'head' ? r.head : r.cells[+p[4]]; let nv = parseCell(v); if (old && typeof old === 'object' && old.img && !old.tick && typeof nv === 'string') nv = nv ? { img: old.img, text: nv } : { img: old.img };   // v99: ô có ảnh: ô gõ chỉ sửa chữ, giữ ảnh
      if (p[3] === 'head') r.head = nv; else r.cells[+p[4]] = nv; }
  }
}
const fieldVal = (x, f) => f === 'imgs' ? (x.imgs || []).join(', ') : f === 'opts' ? (x.opts || []).join(' / ') : f === 'lines' ? (x.lines || []).join('\n') : f === 'pl' ? ((x.pair && x.pair.l && x.pair.l.text) || '') : f === 'pli' ? ((x.pair && x.pair.l && x.pair.l.img) || '') : f === 'pr' ? ((x.pair && x.pair.r && x.pair.r.text) || '') : (x[f] == null ? '' : String(x[f]));
// Công tắc trường nội dung (cấp Task)
function fieldToggles(t) {
  const k = ck(t), c = t.content, it = its(t), o = [];
  if (c.form === 'table') return o;
  const add = (id, label, on, dis) => o.push({ id, label, on, dis });
  add('list', 'Danh sách câu', c.list !== false);
  add('image', 'Ảnh chung', !!t.image);
  if (k !== 'empty') {
    add('img', 'Ảnh mỗi câu', it.some(x => x.img || x.imgs), ['pairs', 'dialogue', 'passage'].includes(k) ? 'Không dùng cho dạng này' : '');
    if (k === 'items') add('multi', 'Nhiều ảnh lựa chọn', c.variant === 'multi');
    add('who', 'Người nói', k === 'dialogue', ['pairs', 'items', 'passage'].includes(k) ? 'Không dùng cho dạng này' : '');
    add('pair', 'Vế ghép (nối)', k === 'pairs', ['dialogue', 'items', 'passage'].includes(k) ? 'Không dùng cho dạng này' : '');
    add('passage', 'Bài đọc', k === 'passage', ['pairs', 'dialogue', 'items'].includes(k) ? 'Không dùng cho dạng này' : '');
    if (k === 'dialogue') add('intro', 'Lời dẫn', !!(c.lead && c.lead.kind === 'text'));
    add('lines', 'Ô nhiều dòng', it.some(x => x.lines), k !== 'items' ? 'Chỉ dùng cho câu có ảnh' : '');
    add('bank', 'Khung từ', !!t.wordBank);
  }
  return o;
}
// ---- HTML khung soạn ----
const eIn = (k, v, ph, o = {}) => o.area
  ? `<textarea data-k="${k}" rows="${o.rows || 2}" placeholder="${esc(ph || '')}" aria-label="${esc(o.label || ph || k)}">${esc(v)}</textarea>`
  : `<input data-k="${k}" value="${esc(v)}" placeholder="${esc(ph || '')}" aria-label="${esc(o.label || ph || k)}"${o.w ? ` style="width:${o.w}"` : ''}>`;
// Câu / lượt nào có chỗ học sinh phải trả lời: dùng để đánh dấu trong danh sách
const GAP_RE = /___/, PICK_RE = /\{[^}]*\|[^}]*\}/;
function ansLabel(x) {
  if (x.key) return 'có đáp án đúng';
  if (x.opts) return 'có lựa chọn';
  const tx = [x.text || '', ...(Array.isArray(x.lines) ? x.lines.map(l => typeof l === 'string' ? l : (l && l.text) || '') : [])].join(' ');
  return GAP_RE.test(tx) ? 'chỗ trống' : PICK_RE.test(tx) ? 'chọn trong câu' : null;
}
function edItems(t) {
  const k = ck(t), it = its(t), c = t.content, keys = it.some(x => x.key != null);
  const noun = k === 'dialogue' ? 'lượt' : k === 'pairs' ? 'cặp' : k === 'trace' ? 'từ' : 'câu';
  const spk = []; it.forEach(x => { if (x.who != null && !spk.includes(x.who)) spk.push(x.who); });
  const rows = it.map((x, i) => {
    let f = '', whoIn = '';
    if (x.who != null) { whoIn = eIn(`it.${i}.who`, x.who, 'Tên', { w: '92px', label: `Người nói ${i + 1}` }); f += `<div class="er2">${eIn(`it.${i}.text`, x.text || '', 'Lời thoại (___ = chỗ trống)', { label: `Lời ${i + 1}` })}</div>`; }
    else if (x.pair) f += x.pair.l && x.pair.l.img != null
      ? `<div class="er2 pairimg"><div class="imgblk">${thumbHtml(t, '@' + x.id)}${eIn(`it.${i}.pli`, x.pair.l.img, 'Tên ảnh', { label: `Ảnh vế trái ${i + 1}` })}${eIn(`it.${i}.pl`, fieldVal(x, 'pl'), 'Chữ dưới ảnh', { label: `Chữ dưới ảnh vế trái ${i + 1}` })}</div><span class="eto">↔</span>${eIn(`it.${i}.pr`, fieldVal(x, 'pr'), 'Vế phải', { label: `Vế phải ${i + 1}` })}</div>`
      : `<div class="er2">${eIn(`it.${i}.pl`, fieldVal(x, 'pl'), 'Vế trái', { label: `Vế trái ${i + 1}` })}<span class="eto">↔</span>${eIn(`it.${i}.pr`, fieldVal(x, 'pr'), 'Vế phải', { label: `Vế phải ${i + 1}` })}</div>`;
    else if (x.lines) f += eIn(`it.${i}.lines`, fieldVal(x, 'lines'), 'Mỗi dòng một dòng chữ; {a|b} = chọn', { area: 1, rows: Math.max(2, x.lines.length), label: `Các dòng câu ${i + 1}` });
    else f += eIn(`it.${i}.text`, x.text || '', k === 'trace' ? 'Từ để tô' : 'Chữ (___ chỗ trống, {a|b} chọn; dòng trống = sang đoạn)', { label: `Chữ câu ${i + 1}`, area: !x.gt && !x.img && !x.imgs, rows: Math.max(1, Math.min(14, ((x.text || '').match(/\n/g) || []).length + Math.ceil((x.text || '').length / 44))) });   // v101: ô câu nhiều dòng, kéo giãn được như ô bài đọc
    if (x.img != null) f = (!x.pair && !x.who && !x.lines && !x.imgs) ? `<div class="imgrow2">${thumbHtml(t, '@' + x.id)}<div class="imgcol">${eIn(`it.${i}.img`, x.img, 'Chữ dưới ảnh / tên ảnh', { label: `Chữ dưới ảnh câu ${i + 1}` })}${f}</div></div>`
      : `<div class="imgblk">${thumbHtml(t, '@' + x.id)}${eIn(`it.${i}.img`, x.img, 'Chữ dưới ảnh / tên ảnh', { label: `Chữ dưới ảnh câu ${i + 1}` })}</div>` + f;
    if (x.imgs) f += `<div class="imgsgrid" style="--n:${x.imgs.length}">${x.imgs.map((im, j) => `<div class="imgblk">${thumbHtml(t, `@${x.id}.${j}`)}${eIn(`it.${i}.imgs.${j}`, im, 'Chữ dưới ảnh', { label: `Chữ dưới ảnh ${j + 1} của câu ${i + 1}` })}${t.answer.layout === 'A5' ? `<button type="button" class="tkq${exPicks(t, x, x.imgs).includes(j) ? ' on' : ''}" data-eact="tickopt" data-i="${i}" data-j="${j}" aria-pressed="${!!(String(x.key ?? '').trim() && exPick(t, x, x.imgs) === j)}" title="Tick ✓ = ảnh này là đáp án đúng" aria-label="Đáp án đúng: ảnh ${j + 1} của câu ${i + 1}">✓</button>` : ''}</div>`).join('')}</div>`;
    if (x.opts) { const pk = exPicks(t, x, x.opts);   // v87: mỗi lựa chọn một dòng: ô tích (đúng, chọn được nhiều) + a. b. c. + ô gõ + ✕
      f += `<div class="eopts"><div class="eoh"><span class="elb">Đáp án</span><span class="sp"></span><button type="button" class="eb eoadd" data-eact="optadd" data-i="${i}" title="Thêm đáp án" aria-label="Thêm đáp án câu ${i + 1}">+</button></div>${x.opts.map((o, j) => `<div class="eo"><button type="button" class="tkq${pk.includes(j) ? ' on' : ''}" data-eact="tickopt" data-i="${i}" data-j="${j}" aria-pressed="${pk.includes(j)}" title="Tích = đáp án đúng (chọn được nhiều)" aria-label="Đáp án đúng: ${'abcdefgh'[j] || j + 1} câu ${i + 1}">✓</button><span class="eol">${'abcdefgh'[j] || j + 1}.</span>${eIn(`it.${i}.opts.${j}`, o, 'Đáp án ' + ('abcdefgh'[j] || j + 1), { label: `Lựa chọn ${'abcdefgh'[j] || j + 1} câu ${i + 1}` })}<button type="button" class="eb" data-eact="optdel" data-i="${i}" data-j="${j}" ${x.opts.length > 2 ? '' : 'disabled'} title="Xóa đáp án này" aria-label="Xóa lựa chọn ${'abcdefgh'[j] || j + 1} câu ${i + 1}">✕</button></div>`).join('')}</div>`; }
    if (t.answer.layout === 'A3' && !x.who && !x.pair) f += `<div class="er2"><span class="elb">Số ô</span>${eIn(`it.${i}.len`, x.len || '', 'tự động', { w: '60px', label: `Số ô chữ câu ${i + 1}` })}</div>`;
    const pg = x.opts || x.imgs ? [] : pkGroups(x), ul = !pg.length && (t.answer.params || {}).ulab && t.answer.kind === 'choice' ? [...pkSrc(x).matchAll(/<u>([\s\S]*?)<\/u>/g)].map(m => m[1]) : [];
    if (pg.length && needKey(t, x)) f += `<div class="er2 kpk"><span class="elb">Đáp án</span><span class="pkr">${pg.map((g, gi) => g.map((o, j) => `<button type="button" class="pko${o.ok ? ' on' : ''}" data-eact="pickopt" data-i="${i}" data-g="${gi}" data-j="${j}" aria-pressed="${o.ok}" title="Bấm = vế đúng (bấm lại để bỏ)">${esc(o.t || '…')}</button>`).join('')).join('<span class="pks">·</span>')}</span></div>`;   // v89: bấm vế đúng ngay trên câu
    else if (ul.length && needKey(t, x)) { const up = (t.answer.params || {}).upper, L = up ? 'ABCDEFGH' : 'abcdefgh', kk = String(x.key ?? '').trim().toLowerCase(); f += `<div class="er2 kpk"><span class="elb">Phần sai</span><span class="pkr">${ul.map((u, j) => `<button type="button" class="pko ule${kk === 'abcdefgh'[j] ? ' on' : ''}" data-eact="ulpick" data-i="${i}" data-j="${j}" aria-pressed="${kk === 'abcdefgh'[j]}" title="Bấm phần gạch chân bị sai = đáp án">${L[j]}. ${esc(u.replace(/<[^>]+>|\*/g, ''))}</button>`).join('')}</span></div>`; }
    else if (needKey(t, x) && !x.opts && !x.imgs && (gapN(x) > 1 || (gapN(x) === 1 && t.wordBank && t.wordBank.kind !== 'image' && t.wordBank.words.length))) { const ks = keyGaps(x), wb = t.wordBank && t.wordBank.kind !== 'image' ? t.wordBank.words : null;   // v91: mỗi chỗ trống một ô đáp án; có Khung từ thì chọn từ trong khung
      f += `<div class="er2 kgap"><span class="elb">Đáp án</span><span class="pkr">${Array.from({ length: gapN(x) }, (_, j) => { const v = ks[j] || '', gl = gapLabs(x.text)[j], lb = gl ? `<i>${esc(gl)}</i>` : gapN(x) > 1 ? `<i>(${j + 1})</i>` : ''; return wb && wb.length ? `<label class="kg">${lb}<select data-k="it.${i}.keyg.${j}" aria-label="Đáp án chỗ trống ${j + 1} câu ${i + 1}"><option value="">—</option>${wb.concat(v && !wb.includes(v) ? [v] : []).map(w => `<option${w === v ? ' selected' : ''}>${esc(w)}</option>`).join('')}</select></label>` : `<label class="kg">${lb}${eIn(`it.${i}.keyg.${j}`, v, 'đáp án', { label: `Đáp án chỗ trống ${j + 1} câu ${i + 1}` })}</label>`; }).join('')}</span></div>`; }
    else if (needKey(t, x) && !x.pair && !(x.imgs && t.answer.layout === 'A5') && !x.opts && !(t.answer.layout === 'A6' && optsOfKey(t, x).length > 1)) f += `<div class="er2"><span class="elb">Đáp án</span>${eIn(`it.${i}.key`, x.key || '', 'đáp án đúng', { label: `Đáp án đúng câu ${i + 1}` })}</div>`;
    const al = ansLabel(x), sc = '';
    return `<div class="eit${al ? ' ans' : ''}${sc}" data-i="${i}"><div class="eih"><span class="egrip" draggable="true" data-drag="${i}" title="Kéo để đổi thứ tự">⋮⋮</span><span class="ino">${i + 1}</span>${whoIn}
      <span class="sp"></span><button class="eb" data-eact="up" data-i="${i}" ${i ? '' : 'disabled'} aria-label="Lên">↑</button><button class="eb" data-eact="down" data-i="${i}" ${i < it.length - 1 ? '' : 'disabled'} aria-label="Xuống">↓</button><button class="eb" data-eact="dupi" data-i="${i}" aria-label="Nhân đôi câu">⧉</button><button class="eb" data-eact="del" data-i="${i}" aria-label="Xóa ${noun} ${i + 1}">✕</button></div>${f}${al ? `<div class="eans" title="Câu này có chỗ học sinh phải trả lời">✎ ${al}</div>` : ''}</div>`;
  }).join('');
  const heads = k === 'pairs' ? `<div class="er2"><span class="elb">Tiêu đề cột</span>${eIn('heads.0', (t.content.heads || [])[0] || '', 'Cột trái', { label: 'Tiêu đề cột trái' })}${eIn('heads.1', (t.content.heads || [])[1] || '', 'Cột phải', { label: 'Tiêu đề cột phải' })}</div>` : '';   // v105
  return `${heads}<div class="eitems">${rows}</div><div class="erow"><button class="btn" data-eact="add">+ Thêm ${noun}</button><button class="btn" data-eact="paste-items" title="Dán nhiều dòng, mỗi dòng một ${noun}">Dán nhiều ${noun}…</button></div>` +
    (it.some(x => x.img || x.imgs) || (k === 'pairs' && it.some(x => x.pair && x.pair.l && x.pair.l.img != null)) ? `<div class="edrop" data-drop="${t.id}">Kéo nhiều ảnh vào đây: mỗi ảnh vào một ô theo thứ tự, thừa ảnh thì thêm ${noun}.</div>` : '');
}
function arSegHtml(t) {
  if (!slotsOf(t).some(x => fixedImg(t, x.key))) return '';
  return `<div class="ef"><span class="elb">Tỉ lệ ô ảnh</span><span class="seg">${AR_OPTS.map(([v, n]) => `<button type="button" data-eact="tblar" data-v="${v}" class="${tblAr(t) === v ? 'on' : ''}">${n}</button>`).join('')}</span></div>`;
}
function edTable(t) {
  const c = t.content;
  if (tblOpts(t).cross) { const n = crossCount(c); return `<p class="hint">Mỗi dòng một hàng. <b>#</b> không có ô · <b>.</b> ô trống chưa có đáp án · chữ cái = ô có đáp án · <b>(a)</b> chữ cho sẵn. Số 1, 2, 3 tự đánh.</p><div class="ef col xgin"><span class="elb">Lưới ô chữ</span>${eIn('cross.grid', crossLines(c).join('\n'), '#C#S#\n#A#U#\n#TEN#', { area: 1, rows: Math.min(14, Math.max(4, c.rows.length + 1)), label: 'Lưới ô chữ' })}</div><p class="hint"><span id="xcount">${n.cells} ô · ${n.words} từ (${n.across} ngang, ${n.down} dọc).</span> Lời gợi ý: thêm ở Khối tự do (+ Chữ).</p>`; }
  const head = `<div class="etr"><span class="ino">·</span>${eIn('tb.corner', brOut(c.corner || ''), 'Góc', { label: 'Ô góc' })}${c.cols.map((x, j) => eIn(`tb.col.${j}`, brOut(x), `Cột ${j + 1}`, { label: `Tên cột ${j + 1}` })).join('')}<span class="eb0"></span></div>`;
  const cTxt = v => brOut(v && typeof v === 'object' && v.img && !v.tick ? (v.text || '') : fmtCell(v));   // v99: ô có ảnh: ảnh nhỏ bên trái, ô gõ chỉ chữ
  const imB = (v, i, j) => v && typeof v === 'object' && (v.tick || v.ans != null) ? '' : `<button type="button" class="eimb${v && v.img ? ' x' : ''}" data-eact="tbimg" data-i="${i}" data-j="${j}" title="${v && v.img ? 'Gỡ ảnh khỏi ô (giữ chữ)' : 'Thêm ảnh vào ô'}" aria-label="${v && v.img ? 'Gỡ ảnh' : 'Thêm ảnh'}">${v && v.img ? '×' : '+ảnh'}</button>`;   // v99
  const imWrap = (v, i, j, inner) => { const bt = imB(v, i, j); return !bt ? inner : inner.startsWith('<span class="etc">') ? inner.replace(/<\/span>$/, bt + '</span>') : `<span class="etc">${inner}${bt}</span>`; };
  const tkWrap = (v, i, j, inner) => v && v.tick ? `<span class="etc"><button type="button" class="tkq${v.ok ? ' on' : ''}" data-eact="tbok" data-i="${i}" data-j="${j}" aria-pressed="${!!v.ok}" title="Đánh dấu ô đúng (bản giáo viên)">✓</button>${inner}</span>` : inner;   // v98
  const withThumb = (v, key, inner) => v && typeof v === 'object' && v.img && key ? `<span class="etc">${thumbHtml(t, key)}${inner}</span>` : inner;
  const rows = c.rows.map((r, i) => `<div class="etr"><span class="ino">${i + 1}</span>${imWrap(r.head, i, 'h', withThumb(r.head, r.id && '@' + r.id, eIn(`tb.r.${i}.head`, cTxt(r.head), 'Đầu hàng', { label: `Đầu hàng ${i + 1}` })))}${r.cells.map((v, j) => imWrap(v, i, j, tkWrap(v, i, j, withThumb(v, r.id && `@${r.id}.${j}`, eIn(`tb.r.${i}.c.${j}`, cTxt(v), '(trống)', { label: `Hàng ${i + 1} cột ${j + 1}` }).replace('<input ', v && v.ans != null ? '<input class="etka" title="Ô học sinh điền: đáp án (in trống)" ' : '<input '))))).join('')}<button class="eb" data-eact="delrow" data-i="${i}" aria-label="Xóa hàng ${i + 1}">✕</button></div>`).join('');
  return `<p class="hint">Ô để trống = chỗ viết · <b>=chữ</b> = ô học sinh điền, chữ là đáp án (in trống) · <b>[ ]</b> = ô tích, <b>[ ] chữ</b> = ô tích kèm chữ, <b>[x]</b> = ô tích đúng · <b>+ảnh</b> thêm ảnh vào ô, <b>×</b> trên ảnh nhỏ để gỡ</p><div class="etbl" style="--nc:${c.cols.length + 1}">${head}${rows}</div>
    <div class="erow"><button class="btn" data-eact="addrow">+ Hàng</button><button class="btn" data-eact="addcol">+ Cột</button><button class="btn" data-eact="delcol" ${c.cols.length > 1 ? '' : 'disabled'}>− Cột cuối</button><button class="btn" data-eact="paste-items" title="Dán bảng: mỗi dòng một hàng, ô cách nhau bằng Tab hoặc |">Dán bảng…</button></div>`;
}
const nounOf = k => k === 'dialogue' ? 'lượt' : k === 'pairs' ? 'cặp' : k === 'trace' ? 'từ' : 'câu';
// Tóm tắt hiện ở đầu mỗi khu vực (gọn mắt khi khu vực đang thu lại)
function secSums(t) {
  const k = ck(t), c = t.content, it = its(t);
  const on = fieldToggles(t).filter(x => x.on).length;
  return { kind: descOf(t), info: t.title || '', content: c.form === 'table' ? `${c.rows.length} hàng` : k === 'empty' && c.list === false ? 'chỉ có ảnh' : `${it.length} ${nounOf(k)}`, parts: on ? `${on} đang bật` : 'chưa bật', free: (t.extras || []).length ? `${t.extras.length} khối` : 'chưa có' };
}
function gtEd(t) {
  const L = gtOrder(t), ex = t.extras || [];
  const cards = ex.map(x => {
    const i = L.findIndex(y => y.id === x.id), img = x.kind === 'image', n = ex.filter(y => y.kind === x.kind).indexOf(x) + 1, nm = img ? 'ảnh' : 'chữ';
    return `<div class="gtcard" data-x="${x.id}"><div class="gthd"><b>Khối ${nm} ${n}</b><small>${x.pos === 'top' ? 'phía trên bài' : 'phía dưới bài'}</small><span class="gtbt"><button class="eb" data-eact="gtsel" data-x="${x.id}" title="Chọn trên trang để chỉnh cỡ chữ, căn lề, khung" aria-label="Chọn khối ${nm} ${n} để chỉnh định dạng">⚙</button><button class="eb" data-eact="gtup" data-x="${x.id}" ${i <= 0 ? 'disabled' : ''} aria-label="Đưa khối chữ lên">↑</button><button class="eb" data-eact="gtdown" data-x="${x.id}" ${i >= L.length - 1 ? 'disabled' : ''} aria-label="Đưa khối chữ xuống">↓</button><button class="eb" data-eact="gtrm" data-x="${x.id}" aria-label="Xóa khối ${nm} ${n}">✕</button></span></div>${img ? `<div class="ef imgrow">${gtKeys(x).map(k => thumbHtml(t, k)).join('')}${eIn(`x.${x.id}.label`, x.label || '', 'Tên ảnh', { label: 'Tên ảnh' })}</div>` : eIn(`x.${x.id}.text`, x.text || '', 'Gõ chữ. Đầu dòng "- " là gạch đầu dòng, "1. " là danh sách số, **đậm**, *nghiêng*.', { area: 1, rows: 4, label: `Khối chữ ${n}` })}</div>`;
  }).join('');
  return `<p class="hint" style="margin:0 0 6px">Khối tự do nằm ngang cả bề rộng Task, không đánh số, không có đáp án. Chữ: ghi chú, ví dụ, luật chơi, danh sách. Ảnh: ảnh minh họa, sơ đồ.</p>${cards}<div class="stack"><button class="btn" data-eact="gtadd">+ Chữ</button><button class="btn" data-eact="gtadd" data-kind="image">+ Ảnh</button></div>`;
}
function edHtml(t) {
  const m = recipeMatch(t), c = t.content, k = ck(t), a = t.answer, i = ws.tasks.indexOf(t), n = ws.tasks.length, sums = secSums(t);
  const kinds = kindsOk(t), tgl = fieldToggles(t), sl = slotsOf(t);
  const sec = (key, title, inner) => `<section class="sec ${SECT[key] ? 'open' : ''}" data-sec="${key}"><button class="sech" data-stg="${key}" aria-expanded="${SECT[key] ? 'true' : 'false'}"><span class="snum">${({ kind: 1, info: 2, content: 3, parts: 4, free: 5 })[key]}</span><span class="sect">${title}</span><span class="secs">${esc(sums[key] || '')}</span><span class="car">▶</span></button><div class="secb">${inner}</div></section>`;
  const tools = `<div class="tkt" role="toolbar" aria-label="Thao tác với Task ${i + 1}"><button class="eb" data-eact="tup" ${i ? '' : 'disabled'} title="Đưa Task lên" aria-label="Đưa Task lên">↑</button><button class="eb" data-eact="tdown" ${i < n - 1 ? '' : 'disabled'} title="Đưa Task xuống" aria-label="Đưa Task xuống">↓</button><button class="eb" data-eact="tdup" title="Nhân đôi Task" aria-label="Nhân đôi Task">⧉</button><button class="eb tjn" data-eact="tjoin" ${i ? '' : 'disabled'} aria-pressed="${t.layout.break === 'join'}" title="${i ? (t.layout.break === 'join' ? 'Đã nối vào Task phía trên (phần tiếp, không số / tiêu đề). Bấm để bỏ nối' : 'Nối vào Task phía trên: thành phần tiếp, không số / tiêu đề') : 'Task đầu phiếu không nối được'}">${t.layout.break === 'join' ? '↳ Đã nối' : '↳ Nối Task'}</button><span class="sp"></span><button class="eb dng" data-eact="tdel" title="Xóa Task (có hỏi trước, hoàn tác được)" aria-label="Xóa Task"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5M6.8 7v4M9.2 7v4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>`;
  // 1. Dạng bài và đáp án
  const kind = `<div class="tcwrap">${cardHtml(t)}</div>
    <div class="ef"><span class="elb">Áp mẫu</span><select data-eact="recipe" aria-label="Áp một mẫu có sẵn cho Task này" title="Áp một lần: giữ chữ các câu, đổi cấu trúc, đáp án và bố cục theo mẫu. Hoàn tác được."><option value="" selected>Chọn mẫu để áp…</option>${libOpts()}</select></div>
    <div class="ef"><span class="elb">Đáp án</span><select data-eact="kind" aria-label="Loại đáp án" ${kinds.length < 2 ? 'disabled' : ''}>${kinds.map(x => `<option value="${x}" ${a.kind === x ? 'selected' : ''}>${KIND_NAME[x]}</option>`).join('')}</select></div>`;
  // 2. Tiêu đề và hướng dẫn (nhóm G0)
  const info = `<div class="ef"><span class="elb">Tiêu đề</span>${eIn('title', t.title || '', 'Tên bài / lệnh', { label: 'Tiêu đề' })}</div>
    <div class="ef"><span class="elb">Hướng dẫn</span>${eIn('instruction', t.instruction || '', 'Hướng dẫn', { label: 'Hướng dẫn' })}</div>
    <div class="ef"><span class="elb">Track</span>${eIn('audio', t.audio || '', 'không có', { label: 'Track audio' })}</div>${qrEd(t)}`;
  // 3. Nội dung: phần dùng chung (ảnh, bài đọc, khung từ) rồi danh sách câu
  let cont = '';
  if (t.image) cont += `<div class="ef imgrow"><span class="elb">Ảnh chung</span>${slotsOf(t).some(x => x.key === 'G1') ? thumbHtml(t, 'G1') : ''}${eIn('image.label', t.image.label || '', 'Tên ảnh', { label: 'Tên ảnh chung' })}</div>`;
  if (c.lead && c.lead.kind === 'passage') cont += `<div class="ef col"><span class="elb">Bài đọc</span>${eIn('lead.text', c.lead.text || '', 'Dán bài đọc vào đây (___ chỗ trống, {a|b} chọn, **đậm**, *nghiêng*, __gạch chân__; dòng trống = sang đoạn)', { area: 1, rows: 5, label: 'Bài đọc' })}</div>` + ((gapCount(c.lead.text || '') || c.lead.keys) ? `<div class="ef col"><span class="elb">Đáp án chỗ trống</span>${eIn('lead.keys', (c.lead.keys || []).join(', '), 'Theo thứ tự chỗ trống: am, go, play', { label: 'Đáp án chỗ trống trong bài đọc' })}</div>` : '');
  if (c.lead && c.lead.kind === 'text') cont += `<div class="ef"><span class="elb">Lời dẫn</span>${eIn('lead.text', c.lead.text || '', 'Lời giới thiệu', { label: 'Lời dẫn' })}</div>`;
  if (t.wordBank) cont += `<div class="ef col"><span class="elb">Khung từ</span>${eIn('wb.words', t.wordBank.words.join('\n'), 'Mỗi dòng một từ (hoặc cách nhau bằng dấu phẩy)', { area: 1, rows: Math.min(6, Math.max(2, t.wordBank.words.length)), label: 'Khung từ' })}</div>`;
  cont += arSegHtml(t);
  if (c.form === 'table') cont += `<div class="subh">Bảng</div>` + edTable(t);
  else if (c.list !== false) cont += (() => { const n = its(t).length, na = its(t).filter(ansLabel).length; return `<div class="subh">Danh sách ${nounOf(k)}<small>${n}${na ? ` · ${na} có chỗ trả lời` : ''}</small></div>`; })() + edItems(t);
  else cont += `<p class="hint" style="margin:${cont ? '8px' : 0} 0 0">Danh sách câu đang tắt${(c.items || []).length ? ` (vẫn giữ ${c.items.length} câu)` : ''}. Bật ở mục 4 · Thành phần của bài.</p>`;
  // 4. Thành phần của bài (công tắc bật / tắt các trường)
  const parts = tgl.length ? `<p class="hint" style="margin:0 0 4px">Bật hoặc tắt các thành phần của bài. Mục nào mờ là không dùng cho dạng này.</p><div class="etgs">${tgl.map(x => `<label class="etg ${x.dis ? 'dis' : ''}" title="${esc(x.dis || '')}"><input type="checkbox" data-tg="${x.id}" ${x.on ? 'checked' : ''} ${x.dis && !x.on ? 'disabled' : ''}>${x.label}</label>`).join('')}</div>` : '';
  return `<div class="ed" data-ed="${t.id}">${tools}${sec('kind', 'Dạng bài &amp; đáp án', kind)}${sec('info', 'Tiêu đề &amp; hướng dẫn', info)}${sec('content', 'Nội dung', cont)}${parts ? sec('parts', 'Thành phần của bài', parts) : ''}${sec('free', 'Khối tự do', gtEd(t))}</div>`;
}
function qrEd(t) {
  if (!t.audio) return '';
  const q = t.qr || { src: 'link' }, src = q.src || 'link', inner = qrInner(t);
  const seg = `<span class="seg">${[['link', 'Link'], ['img', 'Ảnh mã'], ['file', 'File nghe']].map(([v, n]) => `<button type="button" data-eact="qrsrc" data-v="${v}" class="${src === v ? 'on' : ''}">${n}</button>`).join('')}</span>`;
  let body = '';
  if (src === 'link') body = eIn('qr.link', q.link || '', 'Link nghe, hoặc phần cuối sau địa chỉ gốc', { label: 'Link nghe' });
  else if (src === 'img') body = `<button type="button" class="btn" data-eact="qrimg">${q.img ? 'Thay ảnh mã…' : 'Tải ảnh mã…'}</button>${q.img ? '<button type="button" class="btn" data-eact="qrrm">Gỡ</button>' : ''}`;
  else body = `<button type="button" class="btn" data-eact="qrfile">${q.url ? 'Thay file nghe…' : 'Tải file nghe…'}</button>${q.file ? `<span class="qrnote">${esc(q.file)}</span>` : ''}${q.url ? '<button type="button" class="btn" data-eact="qrrm">Gỡ</button>' : ''}`;
  const base = src === 'img' ? '' : `<div class="ef col"><span class="elb">Địa chỉ gốc (cả phiếu)</span>${eIn('qr.base', ws.audioBase || '', 'Ví dụ: https://pinta.vn/audio', { label: 'Địa chỉ gốc audio' })}</div>`;
  const note = src === 'file' ? `<p class="qrnote">${q.demo ? 'Bản demo: chưa nối kho lưu file nghe, link chỉ là mẫu (không nghe được). Hệ thống thật sẽ trả về link thật.' : 'Link được hệ thống tạo khi tải file lên.'}${q.url ? ' ' + esc(qrUrl(t)) : ''}</p>` : '';
  return `<div class="ef col"><span class="elb">Mã QR nghe</span><div class="qrrow"><span class="qrp">${inner || 'Chưa có mã'}</span><div class="stack" style="flex:1;min-width:0;display:grid;gap:6px">${seg}<div class="qrrow">${body}</div></div></div></div>${note}${base}`;
}
// ---- Sửa trực tiếp: gõ = cập nhật trang ngay (không dựng lại cột trái), rời ô = ghi vào lịch sử hoàn tác ----
let edSnap = null, edTimer = null, edDirty = false;
function liveRender() {
  const res = paginate(); lastRes = res; draw(); renderInspector();
  const edE = document.querySelector('#tree .ed'), eid = edE ? edE.dataset.ed : sel.id, t0 = ws.tasks.find(x => x.id === eid);
  if (t0) { document.querySelectorAll('#tree .tcwrap').forEach(e => { e.innerHTML = cardHtml(t0); });
    document.querySelectorAll('#tree .qrp').forEach(e => { e.innerHTML = qrInner(t0) || 'Chưa có mã'; });
    const sm = secSums(t0); document.querySelectorAll('#tree .sec').forEach(e => { const o = e.querySelector('.secs'); if (o && sm[e.dataset.sec] != null) o.textContent = sm[e.dataset.sec]; }); }
  const tn = document.querySelector(`#tree .tnode[data-sel="task"][data-id="${eid}"] .tnm`); if (tn && t0) tn.textContent = t0.typeName;
  publish({ pages: res.pages.length, diags: res.diags.length });
}
function edFlush() { if (edSnap && edDirty) { hist.push(edSnap); fut = []; publish({ canUndo: true }); } edSnap = null; edDirty = false; }
const treeEl = document.getElementById('tree');
treeEl.addEventListener('focusin', e => { if (e.target.closest('.ed [data-k]')) { edFlush(); edSnap = clone(ws); } });
treeEl.addEventListener('input', e => {
  const i = e.target.closest('[data-k]'); if (!i || !i.closest('.ed')) return;
  const t = ws.tasks.find(x => x.id === i.closest('.ed').dataset.ed); if (!t) return;
  if (!edSnap) edSnap = clone(ws);
  applyField(t, i.dataset.k, i.value); edDirty = true;
  if (/^tb\.r\.\d+\.c\./.test(i.dataset.k)) i.classList.toggle('etka', /^\s*=\s*\S/.test(i.value));   // v92: ô "=…" tô xanh ngay khi gõ
  if (i.dataset.k === 'cross.grid') { const x = document.getElementById('xcount'), n = crossCount(t.content); if (x) x.textContent = `${n.cells} ô · ${n.words} từ (${n.across} ngang, ${n.down} dọc).`; }   // v99: số ô / số từ cập nhật khi gõ lưới
  clearTimeout(edTimer); edTimer = setTimeout(liveRender, 140);
});
treeEl.addEventListener('focusout', e => { if (e.target.closest('.ed [data-k]')) { clearTimeout(edTimer); if (edDirty) { ws.tasks.forEach(tidy); liveRender(); kcntSync(); } edFlush(); } });
// v88: gõ đáp án xong (rời ô) thì chip "x/y câu có đáp án" cập nhật ngay, không cần vẽ lại khung soạn
function kcntSync() { document.querySelectorAll('#tree .ed[data-ed]').forEach(ed => { const t = ws.tasks.find(x => x.id === ed.dataset.ed), b = ed.querySelector('.kcnt'); if (!t || !b) return; const ks = keyState(t); b.textContent = `${ks.need.length - ks.miss.length}/${ks.need.length} câu có đáp án`; b.classList.toggle('w', !!ks.miss.length); }); }
treeEl.addEventListener('change', e => {
  const x = e.target;
  if (x.dataset.tg) { const id = x.closest('.ed').dataset.ed, on = x.checked; return commit(w => toggleField(w.tasks.find(y => y.id === id), x.dataset.tg, on)); }
  if (x.dataset.eact === 'kind') { const id = x.closest('.ed').dataset.ed, v = x.value; return commit(w => setKind(w.tasks.find(y => y.id === id), v), `Loại đáp án: ${KIND_NAME[v]}`); }
  if (x.dataset.eact === 'recipe') { const id = x.closest('.ed').dataset.ed, v = x.value; if (!v || !recipeById(v)) return; return commit(w => applyRecipe(w.tasks.find(y => y.id === id), recipeById(v)), `Đã áp mẫu “${recipeById(v).name}” (Ctrl+Z để hoàn tác)`); }
});
let qrTask = null;
document.getElementById('qrImgFile').addEventListener('change', async e => { const f = e.target.files[0], id = qrTask; if (!f || !id) return;
  try { const im = await loadImg(f); commit(w => { const t = w.tasks.find(x => x.id === id); t.qr = Object.assign({}, t.qr, { src: 'img', img: im.src }); }, 'Đã gắn ảnh mã QR'); } catch (_) { toast('Không đọc được ảnh này'); } });
// File nghe: nối dịch vụ lưu file bằng window.WSAudioUpload.upload(file) → { url }. Chưa nối thì dùng link mẫu để thử luồng thao tác.
document.getElementById('qrAudFile').addEventListener('change', async e => { const f = e.target.files[0], id = qrTask; if (!f || !id) return;
  let r, demo = false;
  try { if (window.WSAudioUpload && typeof window.WSAudioUpload.upload === 'function') r = await window.WSAudioUpload.upload(f); else { demo = true; r = { url: 'https://example.invalid/audio/' + encodeURIComponent(f.name.replace(/\s+/g, '-')) }; } } catch (_) { toast('Không tải được file nghe'); return; }
  const url = typeof r === 'string' ? r : r && r.url; if (!url) { toast('Dịch vụ không trả link'); return; }
  commit(w => { const t = w.tasks.find(x => x.id === id); t.qr = Object.assign({}, t.qr, { src: 'file', file: f.name, url, demo: demo || undefined }); }, demo ? 'Đã tạo mã QR (link mẫu)' : 'Đã tải file và tạo mã QR'); });
treeEl.addEventListener('click', e => {
  const b = e.target.closest('[data-eact]'); if (!b || b.disabled || b.tagName === 'SELECT') return;
  const ed = b.closest('.ed'), id = ed ? ed.dataset.ed : null, act = b.dataset.eact, i = +b.dataset.i;
  const T = w => w.tasks.find(y => y.id === id);
  if (act === 'gtadd') { let nid; return commit(w => { const t = T(w); t.extras = t.extras || []; nid = newId(new Set(t.extras.map(y => y.id)), 'x'); t.extras.push(b.dataset.kind === 'image' ? { id: nid, kind: 'image', pos: 'bottom', label: 'ảnh' } : { id: nid, kind: 'text', pos: 'bottom', text: '' }); }, null, () => { SECT.gt = true; sectSave(); sel = { type: 'group', id, g: 'GT', item: nid }; refreshSel(); focusK(`x.${nid}.${b.dataset.kind === 'image' ? 'label' : 'text'}`); }); }
  if (act === 'gtsel') { sel = { type: 'group', id, g: 'GT', item: b.dataset.x }; multi = []; refreshSel(); const el = stage.querySelector(`[data-node="${nodeKey(sel)}"]`); if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
  if (act === 'gtup' || act === 'gtdown') return commit(w => gtMove(T(w), b.dataset.x, act === 'gtup' ? -1 : 1));
  if (act === 'gtrm') return commit(w => { const t = T(w); dropOrphans(t, b.dataset.x); t.extras = (t.extras || []).filter(y => y.id !== b.dataset.x); if (!t.extras.length) delete t.extras; }, 'Đã xóa khối', () => { if (sel.g === 'GT') { sel = { type: 'task', id }; refreshSel(); } });
  if (act === 'add') return commit(w => { const t = T(w); const x = blankItem(t); t.content.items = t.content.items || []; t.content.items.push(x); ensureIds(t); normAnswer(t); }, null, () => focusK(`it.${its(curT(ws)).length - 1}.` + (its(curT(ws)).slice(-1)[0].pair ? 'pl' : its(curT(ws)).slice(-1)[0].lines ? 'lines' : 'text')));
  if (act === 'del') return commit(w => { const t = T(w), x = its(t)[i]; dropOrphans(t, x.id); t.content.items.splice(i, 1); normAnswer(t); }, `Đã xóa câu ${i + 1}`);
  if (act === 'dupi') return commit(w => { const t = T(w), x = clone(its(t)[i]); delete x.id; t.content.items.splice(i + 1, 0, x); ensureIds(t); });
  if (act === 'up' || act === 'down') return commit(w => { const a = T(w).content.items, j = act === 'up' ? i - 1 : i + 1; [a[i], a[j]] = [a[j], a[i]]; });
  if (act === 'qrsrc') return commit(w => { const t = T(w); t.qr = Object.assign({}, t.qr, { src: b.dataset.v }); });
  if (act === 'qrrm') return commit(w => { const t = T(w); if (t.qr) { if (t.qr.src === 'img') delete t.qr.img; else { delete t.qr.url; delete t.qr.file; delete t.qr.demo; } } });
  if (act === 'qrimg') { qrTask = id; const f = document.getElementById('qrImgFile'); f.value = ''; return f.click(); }
  if (act === 'qrfile') { qrTask = id; const f = document.getElementById('qrAudFile'); f.value = ''; return f.click(); }
  if (act === 'tblar') return commit(w => { const t = T(w); t.content.imgAr = b.dataset.v === '4/3' ? null : b.dataset.v; }, `Tỉ lệ ô ảnh bảng: ${b.dataset.v.replace('/', ':')}`);
  if (act === 'addrow') return commit(w => { const t = T(w), c = t.content; c.rows.push({ head: '', cells: c.cols.map(() => '') }); ensureRowIds(t); });
  if (act === 'delrow') return commit(w => { const t = T(w), c = t.content; if (c.rows[i] && c.rows[i].id) dropOrphans(t, c.rows[i].id); c.rows.splice(i, 1); const o = t.layout.table; if (o && o.rhs) o.rhs = null; });
  if (act === 'addcol') return commit(w => { const t = T(w), c = t.content; c.cols.push(''); c.rows.forEach(r => r.cells.push('')); if (t.layout.table) t.layout.table.cw = null; });
  if (act === 'delcol') return commit(w => { const t = T(w), c = t.content; const jn = c.cols.length - 1; c.rows.forEach(r => { if (r.id) { if (t.uploads) delete t.uploads[`@${r.id}.${jn}`]; if (t.upMeta) delete t.upMeta[`@${r.id}.${jn}`]; if (t.imgAr) delete t.imgAr[`@${r.id}.${jn}`]; } }); c.cols.pop(); c.rows.forEach(r => r.cells.pop()); if (t.layout.table) t.layout.table.cw = null; });
  if (act === 'paste-items') return openPaste('items', id);
  if (act === 'tup' || act === 'tdown') return commit(w => { const a = w.tasks, k = a.findIndex(y => y.id === id), j = act === 'tup' ? k - 1 : k + 1; [a[k], a[j]] = [a[j], a[k]]; }, act === 'tup' ? 'Đã đưa Task lên' : 'Đã đưa Task xuống');
  if (act === 'tjoin') return commit(w => { const t = w.tasks.find(y => y.id === id); t.layout.break = t.layout.break === 'join' ? null : 'join'; }, 'Đã đổi: nối vào Task trên');
  if (act === 'tdup') { let nid; commit(w => { const k = w.tasks.findIndex(y => y.id === id), c = clone(w.tasks[k]); nid = c.id = newId(new Set(w.tasks.map(y => y.id)), 't'); w.tasks.splice(k + 1, 0, c); }); sel = { type: 'task', id: nid }; refreshSel(); toast('Đã nhân đôi Task'); return; }
  if (act === 'tdel') { const k = ws.tasks.findIndex(y => y.id === id), num = k + 1, nm = ws.tasks[k] && (ws.tasks[k].title || ws.tasks[k].typeName) || '';
    return askConfirm(`Xóa Task ${num}${nm ? ' «' + nm.slice(0, 50) + '»' : ''}?`, 'Task và mọi nội dung trong đó sẽ bị xóa khỏi phiếu. Bấm Ctrl+Z để hoàn tác.', 'Xóa Task').then(yes => { if (!yes) return; const k2 = ws.tasks.findIndex(y => y.id === id); if (k2 < 0) return; commit(w => { w.tasks.splice(k2, 1); }); sel = ws.tasks[k2] ? { type: 'task', id: ws.tasks[k2].id } : (ws.tasks[k2 - 1] ? { type: 'task', id: ws.tasks[k2 - 1].id } : { type: 'sheet' }); multi = []; refreshSel(); toast(`Đã xóa Task ${num} · Ctrl+Z để hoàn tác`); }); }
});
function focusK(k) { const e = document.querySelector(`#tree .ed [data-k="${k}"]`); if (e) { e.focus(); e.scrollIntoView({ block: 'nearest' }); } }
// Kéo đổi thứ tự câu
let dragI = null;
treeEl.addEventListener('dragstart', e => { const g = e.target.closest('[data-drag]'); if (!g) return; dragI = +g.dataset.drag; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', 'it' + dragI); });
treeEl.addEventListener('dragover', e => { const r = e.target.closest('.eit'), d = e.target.closest('.edrop'); if ((r && dragI != null) || (d && e.dataTransfer.types.includes('Files'))) { e.preventDefault(); (r || d).classList.add('dov'); } });
treeEl.addEventListener('dragleave', e => { const r = e.target.closest('.eit,.edrop'); if (r) r.classList.remove('dov'); });
treeEl.addEventListener('drop', e => {
  const r = e.target.closest('.eit'), d = e.target.closest('.edrop');
  if (d && e.dataTransfer.files.length) { e.preventDefault(); d.classList.remove('dov'); dropImages(d.dataset.drop, [...e.dataTransfer.files], null); return; }
  if (!r || dragI == null) return; e.preventDefault();
  const to = +r.dataset.i, from = dragI, id = r.closest('.ed').dataset.ed; dragI = null; if (to === from) return;
  commit(w => { const a = w.tasks.find(y => y.id === id).content.items, [x] = a.splice(from, 1); a.splice(to, 0, x); }, `Đã chuyển câu ${from + 1} tới vị trí ${to + 1}`);
});
treeEl.addEventListener('dragend', () => { dragI = null; });
// Tạo Task mới từ công thức
function newTaskFrom(r, w) {
  const m = clone(r.make), used = new Set(w.tasks.map(x => x.id));
  const t = { id: newId(used, 't'), typeId: r.id, typeName: r.name, title: m.title || '', instruction: m.instruction || '', content: m.content, answer: Object.assign({ params: {} }, m.answer), layout: LAYOUT_DEF(), spacing: { preset: null, overrides: {} } };
  if (m.audio) t.audio = m.audio; if (m.image) t.image = m.image; if (m.wordBank) t.wordBank = m.wordBank;
  ensureIds(t); tidy(t); return t;
}
function insertTask(t, w) { const k = sel.type !== 'sheet' ? w.tasks.findIndex(x => x.id === sel.id) : -1; w.tasks.splice(k >= 0 ? k + 1 : w.tasks.length, 0, t); return t.id; }
// Cắt cả đề thành từng Task: dòng "Task 1 / Exercise 2 / Part 3…", dòng lệnh (Look and…, Listen and…), hoặc 2 dòng trống liên tiếp
function splitTest(raw) {
  const L = String(raw).replace(/\r/g, '').split('\n'), parts = []; let cur = [], blank = 0, seenBody = false;
  const push = () => { const s = cur.join('\n').trim(); if (s) parts.push(s); cur = []; seenBody = false; };
  L.forEach((x, i) => {
    const t = x.trim();
    if (!t) { blank++; if (blank >= 2 && cur.length) push(); return; }
    const prevBlank = blank > 0 || i === 0; blank = 0;
    const bare = BARE_RE.test(t) && isHead(t.replace(BARE_RE, ''));
    const startHead = HEAD_RE.test(t) || (prevBlank && (isHead(t) || bare) && (seenBody || cur.filter(y => y.trim()).length >= 2));
    if (startHead && cur.length) push();
    cur.push(x); if (!HEAD_RE.test(t) && !isHead(t) && !bare) seenBody = true;
  });
  push();
  return parts;
}
// Chữ thô của một Task (để thử bộ đoán và để người dùng xem lại)
function taskToText(t) {
  const c = t.content, out = [t.title + (t.audio ? ` (${t.audio})` : '')];
  if (t.instruction) out.push(t.instruction);
  if (t.wordBank) out.push('Words: ' + t.wordBank.words.join(', '));
  if (t.image) out.push(`[ảnh: ${t.image.label}]`);
  if (c.form === 'table') { out.push([c.corner || '', ...c.cols].join('\t')); c.rows.forEach(r => out.push([fmtCell(r.head), ...r.cells.map(v => v && v.tick ? '[ ]' + (v.text ? ' ' + v.text : '') : fmtCell(v))].join('\t'))); return out.join('\n'); }
  if (c.lead && c.lead.kind === 'passage') out.push(c.lead.text);
  if (c.lead && c.lead.kind === 'text') out.push(c.lead.text);
  its(t).forEach((x, i) => {
    const n = `${i + 1}. `;
    if (x.pair) out.push(n + ((x.pair.l && (x.pair.l.text || x.pair.l.img)) || '') + ' - ' + ((x.pair.r && x.pair.r.text) || ''));
    else if (x.who != null) out.push(`${x.who}: ${x.text || ''}`);
    else if (x.lines) out.push(n + (x.img ? `[ảnh: ${x.img}] ` : '') + x.lines.join(' '));
    else if (x.imgs) out.push(n + (x.text || '') + ' ' + x.imgs.map((m, j) => `${'abc'[j]}. ${m}`).join(' '));
    else if (x.img && t.answer.kind === 'word') out.push(n + x.img);
    else out.push(n + (x.text || '') + (x.opts ? ' ' + x.opts.map((o, j) => `${'ABCD'[j]}. ${o}`).join(' ') : '') + (t.answer.kind === 'tf' ? ' T / F' : ''));
  });
  return out.join('\n');
}
// ---- Hộp nhập (P1). "+ Task": hai thẻ Mẫu có sẵn | Từ file / dán; Task luôn vào CUỐI phiếu. "+ Phiếu": từ file / dán, để trống = phiếu rỗng; thay phiếu hiện tại sau khi xác nhận.
// Nguồn: JSON (chính) → readJson; MD theo quy ước (P2) → readMd; chữ thô → đoán (parseTask), ghi rõ độ chắc thấp. Mọi kết quả qua bảng nhận diện trước khi vào phiếu.
let impMode = 'task', impTab = 'lib', impJ = null, impConfirm = false, impFile = '', pasteMode = 'task', pasteTimer = null, pasteManual = false;
const PASTE_LONG = 40;   // dán quá số dòng này vào một Task thì cảnh báo
const impDlg = () => document.getElementById('libDlg');
// Chữ có nhiều hoạt động (dòng "Task 1", "Activity 2", "1 Look and…", hoặc cắt được ≥ 2 phần) → Cả đề
function autoPasteMode(raw) { const L = String(raw).split('\n'); const heads = L.filter(x => HEAD_RE.test(x.trim()) || (BARE_RE.test(x) && isHead(x.replace(BARE_RE, '')))).length; return heads >= 2 || splitTest(raw).length > 1 ? 'test' : 'task'; }
function openImport(mode, tab, text) {
  const d = impDlg();
  impMode = mode === 'sheet' ? 'sheet' : 'task'; impTab = impMode === 'sheet' ? 'src' : (tab || 'lib');
  impJ = null; impConfirm = false; impFile = ''; pasteMode = 'task'; pasteManual = false;
  d.dataset.mode = impMode;
  d.querySelector('#libTitle').textContent = impMode === 'sheet' ? 'Phiếu mới: từ file hoặc dán' : 'Thêm Task: chọn dạng bài hoặc từ file / dán';
  d.querySelector('#imTabs').hidden = impMode === 'sheet';
  d.querySelector('#pasteTa').value = text || ''; d.querySelector('#impName').textContent = ''; d.querySelector('#impFile').value = '';
  lnReset(); impShowTab();
  if (!d.open) d.showModal();
  if (impTab === 'src') { impAnalyze(); d.querySelector('#pasteTa').focus(); } else { const b = d.querySelector('#lnQ .lnq.on'); if (b) b.focus(); }
}
function impShowTab() {
  const d = impDlg(), src = impTab === 'src';
  d.querySelectorAll('#imTabs [data-tab]').forEach(b => { const on = b.dataset.tab === impTab; b.classList.toggle('on', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
  d.dataset.tab = impTab; d.querySelector('#libPane').hidden = src; d.querySelector('#srcPane').hidden = !src; d.querySelector('#pasteOk').hidden = !src; d.querySelector('#libAdd').hidden = src;
  if (!src) lnRender();
  if (src) impAnalyze();
}
// Đọc ô nhập thành một lô Task: { src, kind, sheet, sheetNotes, tasks:[{t, notes, err, conf, raw, force, rid, skip}], err }
function impRead(raw) {
  if (looksJson(raw)) return readJson(raw);
  if (MD_RE.test(raw)) return readMd(raw);
  if (!pasteManual) pasteMode = autoPasteMode(raw);
  const chunks = pasteMode === 'test' ? splitTest(raw) : [raw], old = impJ && impJ.src === 'text' ? impJ.tasks : [];
  const tasks = chunks.map((c, i) => { const o = old[i] && old[i].raw === c ? old[i] : null, f = o ? o.force : null; const r = parseTask(c, f); return { t: r.t, notes: r.notes, conf: r.conf, rid: r.rid, raw: c, force: f, skip: o ? !!o.skip : false, err: '' }; });
  if (tasks.length > IMP_MAX) return { src: 'text', err: `Cắt được ${tasks.length} Task, nhiều hơn giới hạn ${IMP_MAX}.` };
  return { src: 'text', kind: 'tasks', tasks, lines: raw.split('\n').filter(x => x.trim()).length };
}
function impAnalyze() {
  const d = impDlg(), raw = d.querySelector('#pasteTa').value;
  impConfirm = false; d.querySelector('#srcIn').hidden = false;
  const keep = impJ; impJ = raw.trim() ? impRead(raw) : null;
  if (impJ && keep && impJ.src !== 'text' && keep.src === impJ.src && keep.raw === raw) impJ = keep;   // giữ các ô đã bỏ chọn
  if (impJ) impJ.raw = raw;
  impRender();
}
const impOk = J => J && !J.err ? J.tasks.filter(r => r.t && !r.err && !r.skip) : [];
const SRC_NAME = { json: 'JSON', md: 'MD theo quy ước', text: 'chữ thô' };
function impRender() {
  const d = impDlg(), out = d.querySelector('#pasteOut'), ok = d.querySelector('#pasteOk'), pm = d.querySelector('.pmode'), J = impJ, sheet = impMode === 'sheet';
  pm.hidden = !(J && J.src === 'text');
  d.querySelectorAll('.pmode [data-pm]').forEach(x => x.classList.toggle('on', x.dataset.pm === pasteMode));
  if (!J) {
    out.innerHTML = sheet ? '<p class="hint">Ô đang trống: bấm “Tạo phiếu trống” để bắt đầu một phiếu rỗng. Hoặc chọn file / dán JSON (nguồn chính), MD theo quy ước, chữ thô.</p>'
      : '<p class="hint">Chọn file hoặc dán vào ô trên. Nguồn chính là JSON (vd. Claude đọc PDF ra JSON). MD theo quy ước cũng nhập chính xác. Chữ thô thì hệ thống đoán. Task mới luôn thêm vào cuối phiếu.</p>';
    ok.disabled = !sheet; ok.textContent = sheet ? 'Tạo phiếu trống' : 'Thêm vào cuối phiếu'; return;
  }
  if (J.err) { out.innerHTML = `<div class="diag">${esc(J.err)} Phiếu đang mở không đổi.</div>`; ok.disabled = true; ok.textContent = sheet ? 'Tạo phiếu mới' : 'Thêm vào cuối phiếu'; return; }
  const n = J.tasks.length, bad = J.tasks.filter(r => r.err).length, list = impOk(J);
  const nParts = J.tasks.filter(r => r.joined).length, nTop = n - nParts, multi = {}; J.tasks.forEach(r => { if (r.joined) multi[r.grp] = (multi[r.grp] || 1) + 1; });
  const partTxt = nParts ? ` (${Object.keys(multi).map(g => `Task ${g} có ${multi[g]} phần`).join(', ')})` : '';
  let h = `<p class="hint">Nhận ra <b>${SRC_NAME[J.src]}</b>${J.src === 'json' ? (J.kind === 'sheet' ? ' (cả phiếu)' : ' (Task)') : ''}${impFile ? ` · file “${esc(impFile)}”` : ''}: <b>${nTop}</b> Task${partTxt}${J.src === 'text' && pasteMode === 'test' ? ' (cắt theo dòng đầu mục)' : ''}.</p>`;
  if (J.src === 'text') h += `<div class="diag info">Chữ thô: hệ thống <b>đoán</b>, độ chắc thấp. Xem lại từng Task, chọn mẫu khác nếu đoán sai. Muốn chính xác thì dùng JSON hoặc MD theo quy ước.</div>`;
  if (J.src === 'text' && pasteMode === 'task' && J.lines > PASTE_LONG) h += `<div class="diag">Đang dán ${J.lines} dòng vào <b>một</b> Task. Nếu đây là cả đề, chuyển sang “Cả đề” để cắt thành nhiều Task. <button class="btn" data-pm2="test">Chuyển sang Cả đề</button></div>`;
  if (!sheet && J.kind === 'sheet') h += `<div class="diag info">File có <b>cài đặt cấp phiếu</b>: “+ Task” chỉ lấy các Task, bỏ cài đặt cấp phiếu (tên, tuổi, khoảng cách, xếp trang). <button class="btn" data-imp="tosheet">Mở bằng “+ Phiếu” thay vì thêm</button></div>`;
  if (!sheet && n > 1) h += `<div class="diag warn">File có <b>${nTop}</b> Task${partTxt}. Bỏ chọn Task không muốn nhập; các Task được thêm vào cuối phiếu theo thứ tự trong file.</div>`;
  if (sheet && J.sheetNotes && J.sheetNotes.length) h += `<p class="hint">Cấp phiếu thiếu, sẽ bù mặc định: ${esc(J.sheetNotes.join(', '))}.</p>`;
  if (bad) h += `<div class="diag">${bad} Task không dựng được (xem dòng đỏ).${sheet ? ' Sửa file rồi nạp lại; phiếu đang mở không đổi.' : ' Các Task này sẽ bị bỏ qua.'}</div>`;
  if (J.mdNotes && J.mdNotes.length) h += `<p class="hint">${esc(J.mdNotes.join('; '))}.</p>`;
  h += J.tasks.map((r, i) => impRowHtml(r, i, { check: !sheet && n > 1, text: J.src === 'text', src: J.src })).join('');
  const w2 = sheet ? impSheetObj(J) : Object.assign(clone(ws), { tasks: ws.tasks.concat(list.map(r => clone(r.t))) });
  const est = w2 && (sheet ? (() => { try { return estPages(fillSheet(w2)); } catch (_) { return null; } })() : estPages(w2));
  if (est) h += `<p class="hint imest">Sau khi nhập: khoảng <b>${est.n}</b> trang${est.over ? `, <b style="color:var(--danger)">${est.over} lỗi tràn</b>` : ', không tràn'}.</p>`;
  out.innerHTML = h;
  ok.disabled = sheet ? !!bad || !n : !list.length;
  ok.textContent = sheet ? `Tạo phiếu mới (${n} Task)` : `Thêm ${list.length} Task vào cuối phiếu`;
}
// Bảng nhận diện: mỗi dòng = số theo file, tiêu đề, mô tả cấu hình, số câu/hàng, cảnh báo; chữ thô có thêm độ chắc + chọn mẫu
function impRowHtml(r, i, o) {
  const t = r.t, n = t ? (ck(t) === 'table' ? `${t.content.rows.length} hàng` : ck(t) === 'empty' ? 'chỉ có ảnh' : `${its(t).length} ${ck(t) === 'dialogue' ? 'lượt' : 'câu'}`) : '';
  const warns = t ? contentWarnings(t) : [], noImg = t ? slotsOf(t).filter(s => !srcOf(t, s.key)).length : 0;
  const cb = o.check ? `<input type="checkbox" data-jk="${i}" ${r.skip || !t || r.err ? '' : 'checked'} ${t && !r.err ? '' : 'disabled'} aria-label="Nhập Task ${i + 1}"> ` : '';
  const conf = o.text ? ` <span class="conf c-${r.conf === 'cao' ? 'hi' : r.conf === 'vừa' ? 'mid' : 'lo'}">đoán · độ chắc: ${esc(r.conf)}</span>` : '';
  const pick = o.text ? `<select data-pr="${i}" aria-label="Áp mẫu khác cho Task ${i + 1}" title="Mặc định giữ cấu hình hệ thống đoán; chọn một mẫu nếu đoán sai"><option value="" ${r.rid ? '' : 'selected'}>Giữ cấu hình đoán</option>${libOpts(r.rid)}</select>` : '';
  const m = t ? recipeMatch(t) : null;
  return `<div class="prv imrow${r.err ? ' bad' : ''}" data-ji="${i}"><div class="prh"><label>${cb}<b>${r.no || i + 1}.</b></label> <span class="imt">${t ? esc(t.title || '(chưa có tiêu đề)') : ''}</span>${conf}${pick}</div>
    ${t ? `<div class="prt"><b>${esc(descOf(t))}</b> <span class="hint">· ${n}${m ? (m.exact ? ` · giống mẫu “${esc(m.r.name)}”` : ' · cấu hình riêng') : ''}</span></div>` : ''}
    ${r.err || warns.length || (r.notes || []).length || noImg ? `<ul class="twarn">${r.err ? `<li>${esc(r.err)}</li>` : ''}${(r.notes || []).map(x => `<li class="info">${esc(o.src === 'json' ? 'Đã bù: ' + x : x)}</li>`).join('')}${warns.map(x => `<li class="${x.lv}">${esc(x.m)}</li>`).join('')}${noImg ? `<li class="info">${noImg} ô ảnh chưa có ảnh (ô giữ chỗ).</li>` : ''}</ul>` : ''}
    ${o.text ? `<details><summary>Chữ gốc</summary><pre>${esc(r.raw)}</pre></details>` : ''}</div>`;
}
function impDownloadOld() {
  try { const blob = new Blob([JSON.stringify(ws, null, 1)], { type: 'application/json' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = (String(ws.title || 'phieu').replace(/[\\/:*?"<>|]+/g, '').trim() || 'phieu') + '.json'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); toast('Đã tải JSON phiếu cũ'); }
  catch (e) { toast('Không tải được: ' + e.message); }
}
function impCommit() {
  const d = impDlg(), J = impJ;
  if (impMode === 'task') {
    const list = impOk(J).map(r => r.t); if (!list.length) return;
    d.close(); addTasks(list, J.kind === 'sheet' ? ' · chỉ lấy các Task, bỏ cài đặt cấp phiếu' : ''); return;
  }
  if (J && (J.err || J.tasks.some(r => r.err))) return;
  if (!impConfirm && ws.tasks.length) {     // thay phiếu hiện tại: xác nhận, kèm tải JSON phiếu cũ
    impConfirm = true; d.querySelector('#srcIn').hidden = true; d.querySelector('.pmode').hidden = true;
    d.querySelector('#pasteOut').innerHTML = `<div class="diag imconf"><b>Thay phiếu hiện tại?</b><div>Phiếu “${esc(ws.title)}” (${ws.tasks.length} Task) sẽ được thay bằng phiếu mới${J ? ` (${J.tasks.length} Task)` : ' trống'}. Nạp phiếu xóa lịch sử Hoàn tác, nên không quay lại được.</div><div class="fixes"><button class="btn" data-imp="dl">Tải JSON phiếu cũ</button><button class="btn" data-imp="back">Quay lại</button></div></div>`;
    const ok = d.querySelector('#pasteOk'); ok.disabled = false; ok.textContent = 'Thay phiếu hiện tại'; return;
  }
  const obj = impSheetObj(J);
  if (loadSheet(obj, J ? `Đã tạo phiếu mới (${obj.tasks.filter(t => !(t.layout && t.layout.break === 'join')).length} Task${obj.tasks.some(t => t.layout && t.layout.break === 'join') ? `, ${obj.tasks.length} khối` : ''})` : 'Đã tạo phiếu trống')) d.close();
}
// Chọn file: JSON / MD / TXT đọc như chữ; file khác (PDF…) chỉ đọc được khi WS Studio gắn window.WSImport.extract(file) → {tasks:[…]}
async function impPickFile(f) {
  if (!f) return; const d = impDlg(), ta = d.querySelector('#pasteTa'); impFile = f.name; d.querySelector('#impName').textContent = f.name;
  const ext = (f.name.split('.').pop() || '').toLowerCase();
  if (['json', 'md', 'markdown', 'txt', 'text'].includes(ext) || /^text\/|json/.test(f.type || '')) {
    if (f.size > IMP_MAX_CH) { impJ = { src: 'json', err: `File quá lớn (${(f.size / 1e6).toFixed(1)} MB).` }; impRender(); return; }
    ta.value = await f.text();
  } else if (window.WSImport && typeof window.WSImport.extract === 'function') {
    d.querySelector('#pasteOut').innerHTML = '<p class="hint">Đang đọc file…</p>';
    try { const r = await window.WSImport.extract(f); ta.value = typeof r === 'string' ? r : JSON.stringify(r, null, 1); }
    catch (e) { impJ = { src: 'json', err: `Không đọc được file: ${e && e.message ? e.message : 'lỗi không rõ'}.` }; impRender(); return; }
  } else { impJ = { src: 'json', err: `Chưa đọc trực tiếp được file .${ext} trong app. Gửi file cho Claude trong chat để ra JSON (đủ trường như phiếu mẫu), rồi nạp JSON ở đây.` }; impRender(); return; }
  impJ = null; impAnalyze();
  // + Task: file có đúng 1 Task (JSON/MD, không lỗi) thì chèn luôn
  if (impMode === 'task' && impJ && !impJ.err && impJ.src !== 'text' && impJ.tasks.length === 1 && impOk(impJ).length === 1) impCommit();
}
// ---- Hộp "Dán nhiều dòng vào Task đang soạn" (riêng, không phải nhập file) ----
let itemsTarget = null;
function openPaste(mode, target) {
  itemsTarget = target || null; const d = document.getElementById('pasteDlg');
  d.querySelector('#itemsTa').value = ''; d.querySelector('#itemsOut').innerHTML = '<p class="hint">Mỗi dòng một câu (bảng: mỗi dòng một hàng, ô cách nhau bằng Tab hoặc |). Số thứ tự ở đầu dòng sẽ được bỏ.</p>';
  d.querySelector('#itemsOk').disabled = true; d.querySelector('#itemsOk').textContent = 'Thêm';
  d.showModal(); d.querySelector('#itemsTa').focus();
}
{ const d = document.getElementById('pasteDlg'), ta = d.querySelector('#itemsTa');
  ta.addEventListener('input', () => { const n = ta.value.split('\n').filter(x => x.trim()).length, t = ws.tasks.find(x => x.id === itemsTarget);
    d.querySelector('#itemsOut').innerHTML = `<p class="hint">${n} dòng → ${n} ${t && ck(t) === 'table' ? 'hàng' : 'câu'} mới.</p>`; d.querySelector('#itemsOk').disabled = !n; d.querySelector('#itemsOk').textContent = `Thêm ${n} dòng`; });
  d.querySelector('#itemsCancel').onclick = () => d.close();
  d.querySelector('#itemsOk').onclick = () => { const raw = ta.value; d.close(); pasteItems(raw, itemsTarget); }; }
function pasteItems(raw, id) {
  commit(w => {
    const t = w.tasks.find(x => x.id === id), c = t.content, lines = raw.split('\n').map(x => x.replace(/\s+$/, '')).filter(x => x.trim());
    if (c.form === 'table') { lines.forEach(x => { const cs = (x.includes('\t') ? x.split('\t') : x.split('|')).map(y => y.trim()); c.rows.push({ head: brIn(cs[0] || ''), cells: c.cols.map((_, j) => parseCell(cs[j + 1] || '')) }); }); return; }
    const k = ck(t);
    lines.forEach(x0 => {
      const x = blankItem(t), s = normGap(inlineOpts(stripNum(x0.trim())));
      if (x.pair) { const m = /^(.+?)\s+(?:[-–—→]|\s{2,}|\t)\s*(.+)$/.exec(s); x.pair.l.text = m ? m[1] : s; x.pair.r = { text: m ? m[2] : '' }; }
      else if (x.who != null) { const m = /^([^:]{1,20}):\s*(.*)$/.exec(s); if (m) { x.who = m[1].trim(); x.text = m[2]; } else x.text = s; }
      else if (x.lines) x.lines = [s];
      else { const so = splitOptsLine(s); if (so && so[0] && x.opts) { x.text = so[0]; x.opts = so[1]; } else x.text = s; }
      if (x.img && k === 'items' && !x.text) x.img = s;
      c.items = c.items || []; c.items.push(x); ensureIds(t);
    });
    normAnswer(t);
  }, 'Đã thêm các dòng đã dán');
}
// Tên Task trên cột trái: tên dạng → tiêu đề → mô tả thành phần
const taskLabel = t => (t.typeName || '').trim() || (t.title || '').trim() || descOf(t);
// Số trang ước tính của một phiếu (dàn thử, không vẽ)
function estPages(w2) { const keep = ws; try { setWs(w2); const r = paginate(); return { n: r.pages.length, over: r.diags.length }; } catch (e) { return null; } finally { setWs(keep); } }
// Thêm các Task vào phiếu đang mở (bản sao, id mới, giữ thứ tự). Một lần nhập = một bước hoàn tác. Trả về id Task đầu.
function addTasks(list, note) {
  let first = null, n0 = ws.tasks.length;
  const before = { ws: clone(ws), h: hist.length };
  try {
    commit(w => { const used = new Set(w.tasks.map(x => x.id)); list.forEach(t0 => { const t = clone(t0); t.id = newId(used, 't'); delete t.number; delete t.part; if (!first) { first = t.id; if (t.layout && t.layout.break === 'join') t.layout.break = null; }  w.tasks.push(t); }); });
  } catch (e) { setWs(before.ws); hist.length = before.h; fut = []; try { render(); } catch (_) {} toast(`Không nhập được: ${e.message}. Phiếu đang mở giữ nguyên.`); return null; }
  toast(`Đã thêm ${list.length} Task vào cuối phiếu (Task ${n0 + 1}${list.length > 1 ? '–' + (n0 + list.length) : ''})${note || ''} · Ctrl+Z để hoàn tác`);
  sel = { type: 'task', id: first }; multi = []; openTask = first; sectReset(first); refreshSel();
  const tk = stage.querySelector(`.task[data-task="${first}"]`); if (tk) tk.scrollIntoView({ block: 'center' });
  return first;
}
/* ================= Nhập file (P2): MD trung gian theo quy ước (claude/QUY_UOC_MD.md) =================
   Mỗi Task bắt đầu bằng "## Task: <tiêu đề>" nên tách chắc chắn, không đoán. Trong Task: dòng trường "Tên: giá trị"
   (Hướng dẫn, Track, Mẫu, Trả lời, Dòng viết, Khung từ, Ảnh, Lời dẫn); khối "Bài đọc:", "Hội thoại:", "Ô chữ:";
   còn lại là câu đánh số / dòng bảng "|" như khi dán chữ. Đáp án nằm riêng ở "## Đáp án" cuối file. */
const MD_RE = /^\s*##\s*task\b/im;
// "Như ảnh 1" = bỏ hết chỉnh riêng của ảnh thứ hai (cả zoom, lệch tâm)
postSet = (f => (t, s, p, v) => { f(t, s, p, v); if (p === '@cells.G1b.frame.fit' && v == null && t.layout.cells) { delete t.layout.cells.G1b; if (!Object.keys(t.layout.cells).length) t.layout.cells = null; } })(postSet);
async function dropImages(id, files, slotKey, pre) {
  files = files.filter(f => f.type && f.type.startsWith('image/')); if (!files.length) { toast('Không có tệp ảnh'); return; }
  const t0 = ws.tasks.find(x => x.id === id); if (!t0) return;
  let imgs; try { imgs = pre || await Promise.all(files.map(loadImg)); } catch (e) { toast('Không đọc được ảnh này'); return; }
  let added = 0, dropped = 0;
  commit(w => {
    const t = w.tasks.find(x => x.id === id); t.uploads = t.uploads || {}; t.upMeta = t.upMeta || {};
    let sl = slotsOf(t).map(x => x.key);
    let order = slotKey && sl.includes(slotKey) ? [slotKey, ...sl.filter(k => k !== slotKey && !t.uploads[k])] : [...sl.filter(k => !t.uploads[k]), ...sl.filter(k => t.uploads[k])];
    // thừa ảnh: thêm câu (bài có ảnh mỗi câu)
    const canAdd = ['items', 'pairs'].includes(ck(t)) && t.content.variant !== 'multi';
    while (canAdd && order.length < imgs.length) {
      const x = blankItem(t); const nm = files[order.length] && files[order.length].name ? files[order.length].name.replace(/\.[^.]+$/, '') : '';
      if (x.pair) x.pair.l = { img: nm || 'ảnh', text: '' }; else x.img = nm || 'ảnh';
      t.content.items.push(x); ensureIds(t); added++;
      sl = slotsOf(t).map(y => y.key); order = order.concat(sl.filter(k => !order.includes(k) && !t.uploads[k]));
    }
    imgs.forEach((im, i) => { const k = order[i]; if (!k) { dropped++; return; } t.uploads[k] = im.src; t.upMeta[k] = { w: im.w, h: im.h };
      t.imgAr = t.imgAr || {}; t.imgAr[k] = im.ar; });
    normAnswer(t);
  }, `Đã gắn ${imgs.length - dropped} ảnh${added ? ` · thêm ${added} câu` : ''}${dropped ? ` · bỏ ${dropped} ảnh thừa` : ''}`);
}
function delFrame(id) { if (sel.type !== 'sheet' && sel.g === 'G1') sel = { type: 'task', id }; commit(w => { const t = w.tasks.find(x => x.id === id); if (!t || !t.image) return; delete t.image; if (t.uploads) delete t.uploads.G1; if (t.upMeta) delete t.upMeta.G1; t.layout.frame = {}; }, 'Đã xóa khung ảnh (thêm lại ở mục G1 · Ảnh chung)'); }
function removeImage(id, key) { commit(w => { const t = w.tasks.find(x => x.id === id); if (t.uploads) delete t.uploads[key]; if (t.upMeta) delete t.upMeta[key]; }, 'Đã gỡ ảnh, về ô giữ chỗ'); }
function setAr(id, key, ar) { commit(w => { const t = w.tasks.find(x => x.id === id); if (key === 'G1') { if (t.image) t.image.ar = ar; } else { t.imgAr = t.imgAr || {}; t.imgAr[key] = ar; } }, `Tỉ lệ khung: ${arLabel(ar)}`); }
// Khóa ô ảnh ứng với container đang chọn
function slotOfSel(t, s) { if (!s || s.type === 'sheet') return null; if (s.g === 'G1' && s.item) return '@' + s.item; if (s.g === 'G1' && t.image) return 'G1'; return null; }
// Ảnh quá mờ: số điểm ảnh / bề rộng in thật (mm) < 150 dpi
let lowRes = {};
function checkRes() {
  const s = scaleNow(), out = {};
  stage.querySelectorAll('.pic.up[data-slot]').forEach(e => {
    const task = e.closest('.task'); if (!task) return; const t = ws.tasks.find(x => x.id === task.dataset.task); if (!t || !t.upMeta) return;
    const m = t.upMeta[e.dataset.slot]; if (!m) return;
    const mm = e.getBoundingClientRect().width / s / MM, dpi = Math.round(m.w / (mm / 25.4));
    if (dpi < 150) { (out[t.id] = out[t.id] || []).push({ key: e.dataset.slot, dpi }); e.classList.add('lowres'); e.title = `Ảnh hơi mờ khi in: ~${dpi} dpi (nên ≥ 150)`; }
  });
  const ch = JSON.stringify(out) !== JSON.stringify(lowRes); lowRes = out; return ch;
}
function slotName(t, key) { if (key === 'G1') return 'ảnh chung'; if (key === 'G1b') return 'ảnh chung thứ hai'; if (/^B\.\d+$/.test(key)) return `ảnh khung từ ${'ABCDEFGHIJ'[+key.slice(2)] || ''}`; if (xOfKey(t, key)) return 'ảnh khối tự do';
  if (ck(t) === 'table') { const [id, j] = key.slice(1).split('.'), i = (t.content.rows || []).findIndex(r => r.id === id); return `ảnh hàng ${i + 1}${j != null ? ', cột ' + (+j + 1) : ' (cột đầu)'}`; } const [id, j] = key.slice(1).split('.'), i = its(t).findIndex(x => x.id === id); return `ảnh câu ${i + 1}${j != null ? '.' + (+j + 1) : ''}`; }
// Panel ảnh: tải / thay / gỡ + tỉ lệ ô giữ chỗ
function imgCtl(t, key) {
  if (!key) return '';
  const up = srcOf(t, key), ar = imgArOf(t, key) || '4/3', m = (t.upMeta || {})[key], lr = (lowRes[t.id] || []).find(x => x.key === key);
  return `<h3>Ảnh</h3><div class="stack"><div class="erow"><button class="btn" data-act="img-gen" data-v="${key}">Tạo ảnh…</button><button class="btn" data-act="img-up" data-v="${key}">${up ? 'Thay ảnh…' : 'Tải ảnh lên…'}</button>${up ? `<button class="btn" data-act="img-rm" data-v="${key}">Gỡ ảnh</button>` : ''}</div>
    ${up ? `<p class="hint">Ảnh thật${m ? ` ${m.w}×${m.h} px` : ''}, tỉ lệ ${arLabel(ar)}.${lr ? ` <b style="color:var(--danger)">Hơi mờ khi in (~${lr.dpi} dpi, nên ≥ 150).</b>` : ''}</p>`
      : fld('ar', 'Tỉ lệ ô giữ chỗ', `<span class="seg wrapseg">${AR_OPTS.map(([v, n]) => `<button data-act="img-ar" data-v="${key}|${v}" class="${String(ar) === v ? 'on' : ''}">${n}</button>`).join('')}</span>`, false, '', 's')}
    <p class="hint">Cũng có thể kéo thả ảnh vào ô trên trang, hoặc chọn ô rồi bấm Ctrl+V.</p>${key === 'G1' ? `<div class="erow"><button class="btn" data-act="img-del">Xóa khung ảnh</button></div><p class="hint">Bài không cần ảnh chung thì xóa cả khung. Phím Delete cũng được. Thêm lại bằng nút + Thêm ở mục G1 · Ảnh chung (cột trái).</p>` : ''}</div>`;
}

/* ---- Thư viện mẫu có sẵn (thẻ 1 của "+ Task") ---- */
/* v94: chọn Dạng câu hỏi (Q) rồi Bố cục (T), xem trước bằng chữ lorem. Mỗi Q dựa trên một công thức (RECIPES) rồi setQ / blkAdd / tn. */
const LN_REC = { Q1: 'gap-fill', Q2: 'answer-q', Q3: 'choose-abc', Q4: 'choose-inline', Q5: 'true-false', Q6: 'look-write', Q7: 'listen-tick', Q8: 'match', Q9: 'trace', Q10: 'table', Q11: 'table', Q12: 'answer-q', IMG: 'colour-draw' };
const LN_GROUPS = [['Viết', ['Q1', 'Q2', 'Q12', 'Q9']], ['Chọn', ['Q3', 'Q4', 'Q5', 'Q7']], ['Ghép · Ảnh · Bảng', ['Q8', 'Q6', 'Q10', 'Q11', 'IMG']]];
const lnName = q => q === 'IMG' ? 'Chỉ có ảnh' : q === 'Q11' ? 'Ô chữ / lưới' : QN[q];
const LN_HINT = { Q1: 'chỗ trống ___, hội thoại', Q2: 'trả lời câu hỏi', Q3: 'vài lựa chọn A B C', Q4: 'khoanh, gạch chân, tìm lỗi', Q5: 'cột T/F hoặc ô tick', Q6: 'một ảnh mỗi câu', Q7: 'tick ảnh đúng', Q8: 'nối vế trái, vế phải', Q9: 'luyện viết', Q10: 'ô chữ, ô trống', Q11: 'giải đố, tìm từ', Q12: 'dòng kẻ hoặc khung vẽ', IMG: 'tô màu / vẽ' };
const LN_TS = [['auto', 'Tự động'], ['T1', 'Xếp dọc'], ['T2', 'Ảnh trái'], ['T3', 'Ảnh phải'], ['T4', 'Ảnh trong bài đọc']];
const LN_BLK = [['G1', 'Ảnh chung'], ['G2', 'Bài đọc'], ['G4', 'Khung từ']];
const LN_LOREM = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Sed do eiusmod tempor incididunt ut labore et dolore.', 'Ut enim ad minim veniam, quis nostrud exercitation.', 'Duis aute irure dolor in reprehenderit in voluptate.', 'Excepteur sint occaecat cupidatat non proident.'];
let ln = { q: 'Q3', T: 'auto', G1: false, G2: false, G4: false, pos: 'end' };
function lnReset() { ln = { q: 'Q3', T: 'auto', G1: false, G2: false, G4: false, pos: 'end' }; }   // mặc định cuối phiếu (giữ quy tắc cũ: nhập / thêm Task không chen vào giữa); "Sau Task đang chọn" là lựa chọn
// Khối không dùng được với dạng này: trả lý do ('' = được)
function lnBlkWhy(g) {
  if (ln.q === 'IMG') return g === 'G1' ? 'Dạng này luôn có ảnh' : 'Dạng này chỉ có ảnh';
  if (g === 'G2' && !['Q1', 'Q2', 'Q3', 'Q5'].includes(ln.q)) return 'Bài đọc đi với Điền từ, Viết câu, Chọn A/B/C, Đúng / Sai';
  return '';
}
// Dựng Task theo lựa chọn hiện tại (w = bản phiếu để lấy mã số; Task chưa được thêm vào đâu)
function lnBuild(w) {
  const t = newTaskFrom(recipeById(LN_REC[ln.q]), w);
  if (ln.q === 'Q11' || ln.q === 'Q12') setQ(t, ln.q);
  ['G1', 'G2', 'G4'].forEach(g => { if (ln[g] && !lnBlkWhy(g) && blkAddable(t).includes(g)) blkAdd(t, g); });
  const rs = tnReasons(t); if (ln.T !== 'auto' && rs[ln.T]) ln.T = 'auto';
  if (ln.T !== 'auto') { const L = tnTarget(t, ln.T); t.layout.task = L; if (layoutReasons(t)[L]) t.layout.task = 'auto'; }
  tidy(t); return t;
}
// Chữ mẫu cho xem trước (chỉ chạy trên bản xem trước, không đụng Task thật)
function lnLorem(t) {
  let n = 0; const L = () => LN_LOREM[n++ % LN_LOREM.length], c = t.content, blank = x => !String(x || '').replace(/[?\s]/g, '');
  if (c.lead && c.lead.kind === 'passage' && blank(c.lead.text)) c.lead.text = LN_LOREM.slice(0, 3).join(' ') + '\n\n' + LN_LOREM.slice(3).join(' ');
  if (c.form === 'table') { if (blank(c.cols[0]) && blank(c.cols[1]) && !(t.layout.table && t.layout.table.cross)) { c.cols = ['Lorem', 'Ipsum']; c.rows.forEach((r, i) => { r.head = ['dolor', 'sit', 'amet'][i % 3]; }); } }
  its(t).forEach(x => {
    if (x.pair) { if (x.pair.l && !x.pair.l.img && blank(x.pair.l.text)) x.pair.l.text = 'lorem'; if (x.pair.r && blank(x.pair.r.text)) x.pair.r.text = 'ipsum'; return; }
    if (c.form === 'table' || x.img || x.imgs) { if (x.opts) x.opts = x.opts.map((o, i) => o || ['lorem', 'ipsum', 'dolor'][i]); return; }
    if (blank(x.text) && t.answer.layout !== 'A8') x.text = L(); if (x.opts) x.opts = x.opts.map((o, i) => o || ['lorem', 'ipsum', 'dolor'][i]);
  });
  if (ck(t) === 'trace') its(t).forEach((x, i) => { if (blank(x.text)) x.text = ['lorem', 'ipsum', 'dolor'][i % 3]; });
  if (t.wordBank && t.wordBank.kind !== 'image' && !t.wordBank.words.length) t.wordBank.words = ['lorem', 'ipsum', 'dolor', 'amet'];
}
function lnRender() {
  const d = impDlg(); if (!d.querySelector('#lnQ')) return;
  d.querySelector('#lnQ').innerHTML = LN_GROUPS.map(([g, qs]) => `<div class="lnqg">${g}</div><div class="lnqc">${qs.map(q => `<button type="button" class="lnq ${ln.q === q ? 'on' : ''}" data-lq="${q}" title="${esc(q === 'IMG' ? 'Một ảnh lớn, không có câu hỏi; thêm câu sau nếu cần' : QHINT[q])}"><b>${q === 'IMG' ? '' : q + ' '}${esc(lnName(q))}</b><span>${esc(LN_HINT[q])}</span></button>`).join('')}</div>`).join('');
  // khối đi kèm trước, vì Bố cục phụ thuộc vào ảnh / bài đọc
  const forceImg = ln.q === 'IMG';
  d.querySelector('#lnB').innerHTML = '<span class="hint">Kèm theo:</span>' + LN_BLK.map(([g, n]) => { const why = lnBlkWhy(g), on = forceImg && g === 'G1' ? true : ln[g] && !why; return `<button type="button" class="chip ${on ? 'on' : ''}" data-lb="${g}" ${why ? `disabled title="${esc(why)}"` : ''}>${on ? '✓ ' : '+ '}${n}</button>`; }).join('');
  const t = lnBuild(ws), rs = tnReasons(t);
  d.querySelector('#lnT').innerHTML = LN_TS.map(([v, n]) => { const why = v === 'auto' ? '' : rs[v]; return `<button type="button" class="lnt ${ln.T === v ? 'on' : ''} ${why ? 'off' : ''}" data-lt="${v}" ${why ? `data-why="${esc(why)}"` : ''} title="${esc(why || (v === 'auto' ? 'Máy chọn kiểu hợp nhất' : TN_HINT[v]))}" aria-disabled="${why ? 'true' : 'false'}">${v === 'auto' ? '<span class="au">✦</span>' : layIcon(v === 'T4' ? 'T8' : v)}<b>${n}</b></button>`; }).join('');
  d.querySelector('#lnTh').textContent = `· hợp với ${q0name()}`;
  d.querySelector('#lnPos').innerHTML = [['end', 'Cuối phiếu'], ['after', 'Sau Task đang chọn']].map(([v, n]) => { const off = v === 'after' && !(sel.type !== 'sheet' && ws.tasks.some(x => x.id === sel.id)); return `<button type="button" data-lp="${v}" class="${ln.pos === v ? 'on' : ''}" ${off ? 'disabled' : ''}>${n}</button>`; }).join('');
  // xem trước: Task cùng cấu hình, chữ lorem, số thứ tự như khi thêm
  const p = lnBuild(ws); lnLorem(p); p.id = 'tpv'; p.number = ws.tasks.length + 1; tidy(p);
  const pv = d.querySelector('#lnPv'); let html = '';
  try { html = renderTask(p, null, 0); } catch (e) { html = `<p class="hint">Không dựng được bản xem trước: ${esc(e.message)}</p>`; }
  pv.innerHTML = `<div class="lnpg"><div class="flow">${html}</div></div>`;   // không dùng class "page": mã khác tìm .page .task trong cả tài liệu
  d.querySelector('#lnCap').textContent = `${q0name()} · ${ln.T === 'auto' ? 'Tự động → ' + TN[tnOf(p)] : TN[ln.T]}. Chữ mẫu chỉ để xem, Task thật dùng câu mẫu để bạn sửa.`;
}
const q0name = () => ln.q === 'IMG' ? 'Chỉ có ảnh' : `${ln.q} ${lnName(ln.q)}`;
function lnAdd() {
  let nid, nm = q0name();
  impDlg().close();
  commit(w => { const t = lnBuild(w); nid = t.id; if (ln.pos === 'after') insertTask(t, w); else w.tasks.push(t); }, `Đã thêm Task “${nm}” ${ln.pos === 'after' ? 'sau Task đang chọn' : 'vào cuối phiếu'}`);
  sel = { type: 'task', id: nid }; multi = []; sectReset(nid); refreshSel();
  const tk = stage.querySelector(`.task[data-task="${nid}"]`); if (tk) tk.scrollIntoView({ block: 'center' });
  const first = document.querySelector('#tree .ed .eitems [data-k], #tree .ed .etbl [data-k]'); if (first) first.focus();
}
function openLib() { openImport('task', 'lib'); }
document.getElementById('libPane').addEventListener('click', e => {
  const q = e.target.closest('[data-lq]'), tb = e.target.closest('[data-lt]'), b = e.target.closest('[data-lb]'), p = e.target.closest('[data-lp]');
  if (q) { const was = ln.q; ln.q = q.dataset.lq; if (was === 'IMG' && ln.q !== 'IMG') ln.G1 = false; if (ln.q === 'IMG') { ln.G1 = true; ln.G2 = false; ln.G4 = false; } else if (lnBlkWhy('G2')) ln.G2 = false; }
  else if (tb) { if (tb.dataset.why) { toast(tb.dataset.why); return; } ln.T = tb.dataset.lt; }
  else if (b && !b.disabled) ln[b.dataset.lb] = !ln[b.dataset.lb];
  else if (p && !p.disabled) ln.pos = p.dataset.lp; else return;
  lnRender();
});
document.getElementById('libAdd').onclick = lnAdd;
impDlg().addEventListener('close', () => { const pv = document.getElementById('lnPv'); if (pv) pv.innerHTML = ''; });   // bỏ bản xem trước khi đóng hộp (tránh lẫn với Task thật)
document.getElementById('libClose').onclick = () => impDlg().close();
treeEl.addEventListener('click', e => { const b = e.target.closest('[data-lib],[data-newsheet]'); if (!b) return; if (b.dataset.lib) openImport('task', 'lib'); else openImport('sheet'); });
/* ---- Hộp nhập: sự kiện ---- */
(() => {
  const d = impDlg(), ta = d.querySelector('#pasteTa');
  d.querySelector('#imTabs').addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (!b) return; impTab = b.dataset.tab; impShowTab(); if (impTab === 'src') ta.focus(); });
  ta.addEventListener('input', () => { clearTimeout(pasteTimer); pasteTimer = setTimeout(impAnalyze, 200); });
  d.querySelector('.pmode').addEventListener('click', e => { const b = e.target.closest('[data-pm]'); if (!b) return; pasteMode = b.dataset.pm; pasteManual = true; impJ = null; impAnalyze(); });
  d.querySelector('#impPick').onclick = () => { const f = d.querySelector('#impFile'); f.value = ''; f.click(); };
  d.querySelector('#impFile').addEventListener('change', e => impPickFile(e.target.files[0]));
  d.querySelector('#pasteOut').addEventListener('click', e => {
    const b = e.target.closest('[data-pm2],[data-imp]'); if (!b) return;
    if (b.dataset.pm2) { pasteMode = b.dataset.pm2; pasteManual = true; impJ = null; impAnalyze(); }
    else if (b.dataset.imp === 'tosheet') { const raw = ta.value, fn = impFile; openImport('sheet', null, raw); impFile = fn; impRender(); }
    else if (b.dataset.imp === 'dl') impDownloadOld();
    else if (b.dataset.imp === 'back') { impConfirm = false; d.querySelector('#srcIn').hidden = false; impRender(); }
  });
  d.querySelector('#pasteOut').addEventListener('change', e => {
    const x = e.target, J = impJ; if (!J) return;
    if (x.dataset.pr != null && J.src === 'text') { const r = J.tasks[+x.dataset.pr], n = parseTask(r.raw, x.value || null); Object.assign(r, { t: n.t, notes: n.notes, conf: n.conf, rid: n.rid, force: x.value || null }); impRender(); }
    if (x.dataset.jk != null) { J.tasks[+x.dataset.jk].skip = !x.checked; impRender(); }
  });
  d.querySelector('#pasteOk').onclick = () => { clearTimeout(pasteTimer); if (!impConfirm && impJ == null && ta.value.trim()) impAnalyze(); impCommit(); };
})();
/* ---- Ảnh: kéo thả lên trang, Ctrl+V, nút trong panel ---- */
stage.addEventListener('dragover', e => { if (!e.dataTransfer || ![...e.dataTransfer.types].includes('Files')) return; const tk = e.target.closest('.task'); if (!tk) return; e.preventDefault(); stage.querySelectorAll('.dov').forEach(x => x.classList.remove('dov')); (e.target.closest('[data-slot]') || tk).classList.add('dov'); });
stage.addEventListener('dragleave', e => { const x = e.target.closest('.dov'); if (x && !x.contains(e.relatedTarget)) x.classList.remove('dov'); });
stage.addEventListener('drop', e => { const tk = e.target.closest('.task'); stage.querySelectorAll('.dov').forEach(x => x.classList.remove('dov')); if (!tk || !e.dataTransfer.files.length) return; e.preventDefault(); const sl = e.target.closest('[data-slot]'); dropImages(tk.dataset.task, [...e.dataTransfer.files], sl ? sl.dataset.slot : null); });
document.addEventListener('paste', e => {
  if (e.target.matches && e.target.matches('input,textarea,select')) return; if (document.querySelector('dialog[open]')) return;
  const cd2 = e.clipboardData; if (!cd2) return;
  const fs = [...cd2.files].filter(f => f.type.startsWith('image/'));
  if (fs.length) { e.preventDefault(); if (sel.type === 'sheet') { toast('Chọn một Task hoặc ô ảnh rồi dán ảnh'); return; } const t = curT(ws); dropImages(t.id, fs, slotOfSel(t, sel)); return; }
  const tx = cd2.getData('text/plain'); if (tx && tx.trim()) { e.preventDefault(); openImport('task', 'src', tx); }
});
extraActs['img-up'] = (b, v) => { const inp = document.getElementById('upfile'); inp.dataset.task = curT(ws).id; inp.dataset.slot = v; inp.multiple = false; inp.value = ''; inp.click(); };
extraActs['img-rm'] = (b, v) => removeImage(curT(ws).id, v);
extraActs['img-del'] = () => delFrame(curT(ws).id);
extraActs['img-ar'] = (b, v) => { const [k, a] = v.split('|'); setAr(curT(ws).id, k, a); };

/* ================= Vòng render ================= */
function draw() { if (lastRes) { drawPages(lastRes); publish({ zoomLabel: zoom == null ? 'Vừa khung' : Math.round(scaleNow() * 100) + '%' }); } }
let ready = false;
const fontKey = () => FONTS[ws.font] ? ws.font : 'andika';
let fontApplied = '';
function applyFont() {
  const k = fontKey(); if (k === fontApplied) return false;
  fontApplied = k; document.documentElement.style.setProperty('--f-sheet', FONTS[k].css);
  if (document.fonts && k !== 'andika') {
    const n = FONTS[k].name, vi = 'ăâđêôơưáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụýỳỷỹỵ';
    Promise.all(['14pt ', 'bold 14pt '].flatMap(f => [document.fonts.load(f + '"' + n + '"'), document.fonts.load(f + '"' + n + '"', vi)])).catch(() => {}).then(() => document.fonts.ready).then(() => { if (ready && fontApplied === k) { const res = paginate(); lastRes = res; draw(); publish({ pages: res.pages.length, diags: res.diags.length }); } });
  }
  return true;
}
let renderCount = 0;
function render() {
  renderCount++;
  applyFont();
  ws.tasks.forEach(ensureRowIds);
  publish({ title: ws.title, age: ws.age, canUndo: !!hist.length, canRedo: !!fut.length });
  if (!ready) return;
  const res = paginate(); lastRes = res;
  resChanged = false; renderTree(); draw(); renderInspector();
  if (resChanged) { resChanged = false; renderTree(); renderInspector(); }
  publish({ pages: res.pages.length, diags: res.diags.length });
  // Báo Task đổi trang
  const start = {}; res.pages.forEach((p, i) => p.items.forEach(x => { if (!(x.t.id in start)) start[x.t.id] = i + 1; }));
  if (lastStart) {
    const moved = ws.tasks.filter(t => lastStart[t.id] && start[t.id] !== lastStart[t.id]);
    if (res.pages.length !== lastCount) toast(`Phiếu giờ có ${res.pages.length} trang${moved.length ? ` · Task ${moved[0].number} chuyển sang trang ${start[moved[0].id]}` : ''}`);
    else if (moved.length) toast(`Task ${moved.map(t => t.number).slice(0, 3).join(', ')} chuyển sang trang ${start[moved[0].id]}`);
  }
  lastStart = start; lastCount = res.pages.length;
}
/* ================= Tạo ảnh (popup) =================
   Nối dịch vụ gen ảnh thật: gán window.WSImageGen = { generate: async ({ prompt, refs, ar }) => ({ src: 'data:image/png;base64,…' }) }
   (refs = mảng data URL của ảnh tham chiếu; ar = '4/3' | '1/1' | '3/4' | '16/9'). Chưa gán thì dùng bản demo có đóng dấu DEMO. */
function thumbHtml(t, key) {
  const src = srcOf(t, key), ar = imgArOf(t, key) || '4/3';
  return `<button type="button" class="ithumb ${src ? 'has' : ''}" data-gen="${esc(key)}" style="--tar:${ar}" title="${src ? 'Mở để thay hoặc tạo lại ảnh' : 'Tạo hoặc tải ảnh'}" aria-label="Ảnh: ${esc(slotName(t, key))}">${src ? `<img src="${src}" alt="">` : '<span>+</span>'}</button>`;
}
const genState = {}; let genCtx = null;
const GEN_DEMO = { demo: true, generate: ({ prompt, ar }) => new Promise(ok => setTimeout(() => {
  const r = arNum(ar) || 4 / 3, W = r >= 1 ? 768 : Math.round(768 * r), H = r >= 1 ? Math.round(768 / r) : 768, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const g = cv.getContext('2d'); let h = 0; for (const c of prompt) h = (h * 31 + c.charCodeAt(0)) % 360;
  const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, `hsl(${h},35%,88%)`); gr.addColorStop(1, `hsl(${(h + 50) % 360},35%,76%)`); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.fillStyle = '#1b252c'; g.font = `600 ${Math.round(W / 22)}px sans-serif`; g.textAlign = 'center';
  const words = prompt.split(/\s+/), lines = []; let cur = ''; words.forEach(w => { if ((cur + ' ' + w).length > 26) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }); lines.push(cur);
  lines.slice(0, 6).forEach((l, i) => g.fillText(l, W / 2, H / 2 - 20 + i * Math.round(W / 18)));
  g.save(); g.translate(W / 2, H - 26); g.fillStyle = 'rgba(194,65,12,.9)'; g.font = `700 ${Math.round(W / 30)}px sans-serif`; g.fillText('DEMO · chưa nối dịch vụ gen ảnh', 0, 0); g.restore();
  ok({ src: cv.toDataURL('image/png') }); }, 700)) };
function genRender() {
  const c = genCtx, st = c.st, t = ws.tasks.find(x => x.id === c.id); if (!t) return;
  const isTb = fixedImg(t, c.key); if (isTb) st.ar = tblAr(t);
  const has = st.rm ? null : srcOf(t, c.key), shown = st.cur >= 0 ? st.results[st.cur] : has;
  document.getElementById('genTitle').textContent = `Tạo ảnh · ${slotName(t, c.key)}`;
  const fr = document.getElementById('genFr'), fc = genFrameCfg(t, c.key), pg = genPageBox(c.id, c.key);
  const boxAr = fc && pg && fc.frame.h ? pg : null;                       // ô có khung (Fit): xem trước đúng tỉ lệ khung trên phiếu
  fr.style.aspectRatio = boxAr ? String(boxAr) : st.ar; fr.classList.toggle('busy', !!st.busy);
  const iar = st.cur >= 0 ? ((st.resAr || [])[st.cur] || st.ar) : shown ? ((t.imgAr || {})[c.key] || imgArOf(t, c.key) || '4/3') : st.ar, f = fc && st.fd && st.fd.fit ? st.fd : null;
  fr.classList.toggle('fit', !!(f && shown)); if (f && shown) { fr.dataset.f = f.fit; fr.style.setProperty('--z', (f.zoom || 100) / 100); fr.style.setProperty('--ox', f.ox || 0); fr.style.setProperty('--oy', f.oy || 0); fr.style.setProperty('--iar', iar); } else { delete fr.dataset.f; }
  fr.innerHTML = shown ? `<img src="${shown}" alt="Ảnh xem trước" draggable="false">` : `<div class="ph">Chưa có ảnh.<br>Nhập mô tả rồi bấm “Tạo ảnh”, hoặc tải ảnh từ máy.</div>`;
  const gf = document.getElementById('genFrame'); gf.hidden = !fc;
  if (fc) { const fit = st.fd.fit || 'normal', fd = st.fd;
    document.getElementById('genFit').innerHTML = [['normal', 'Bình thường'], ['width', 'Fit ngang'], ['height', 'Fit dọc']].map(([v, n]) => `<button type="button" data-fit="${v}" class="${fit === v ? 'on' : ''}">${n}</button>`).join('');
    document.getElementById('genZoomRow').hidden = fit === 'normal'; const z = fd.zoom || 100; document.getElementById('genZoom').value = z; document.getElementById('genZoomOut').textContent = z + '%';
    document.getElementById('genCenter').disabled = !(fd.ox || fd.oy || fd.zoom); }
  const vs = document.getElementById('genVs'); vs.style.setProperty('--tar', st.ar);
  vs.innerHTML = st.results.map((r, i) => `<button type="button" data-v="${i}" class="${i === st.cur ? 'on' : ''}" aria-label="Ảnh đã tạo ${i + 1}"><img src="${r}" alt=""></button>`).join('');
  document.getElementById('genRefs').innerHTML = st.refs.map((r, i) => `<span class="genref"><img src="${r}" alt="Ảnh tham chiếu ${i + 1}"><button type="button" data-rx="${i}" aria-label="Bỏ ảnh tham chiếu ${i + 1}">✕</button></span>`).join('') + `<button type="button" class="genadd" id="genAdd" ${st.refs.length >= 4 ? 'disabled' : ''} title="Thêm ảnh tham chiếu" aria-label="Thêm ảnh tham chiếu">+</button>`;
  document.getElementById('genAr').innerHTML = AR_OPTS.map(([v, n]) => `<button type="button" data-ar="${v}" class="${String(st.ar) === v ? 'on' : ''}"${isTb ? ' disabled' : ''}>${n}</button>`).join('');
  document.getElementById('genAr').parentNode.firstElementChild.textContent = 'Tỷ lệ';
  const prov = window.WSImageGen && typeof window.WSImageGen.generate === 'function' ? window.WSImageGen : GEN_DEMO;
  document.getElementById('genNote').textContent = st.msg || '';
  document.getElementById('genGo').disabled = !!st.busy; document.getElementById('genGo').textContent = st.busy ? 'Đang tạo…' : (st.results.length ? 'Tạo lại' : 'Tạo ảnh');
  document.getElementById('genUse').disabled = !!st.busy; document.getElementById('genRm').hidden = !has;
}
// Khung (frame) của ô ảnh: chỉ ảnh chung (G1) và ô ảnh của lưới T5 có khung chỉnh Fit / tâm / zoom. Dùng đúng dữ liệu của panel Ảnh.
function genSel(t, key) { if (xOfKey(t, key)) return { type: 'group', id: t.id, g: 'GT', item: xOfKey(t, key).id }; return key === 'G1' ? { type: 'group', id: t.id, g: 'G1' } : { type: 'group', id: t.id, g: 'G1', item: key.slice(1), tc: fixedImg(t, key) ? 1 : undefined }; }
function genFrameCfg(t, key) {
  if (xOfKey(t, key)) return null;
  if (key === 'G1') return t.image ? { frame: t.layout.frame || {} } : null;
  if (key[0] === '@' && fixedImg(t, key)) return { frame: cellFr(t, key.slice(1)) };
  if (cellImgMode(t) && cellKeys(t, 'cimg').includes(key.slice(1))) return { frame: (cellCfg(t, key.slice(1)).frame) || {} };
  return null;
}
function genPageBox(id, key) { const e = stage.querySelector(`.task[data-task="${id}"] .pic[data-slot="${key}"]`); if (!e) return null; const r = e.getBoundingClientRect(); return r.width && r.height ? +(r.width / r.height).toFixed(3) : null; }
function genSetFrame(p, v) { const fd = genCtx.st.fd; if (!fd) return; const k = p.slice(6); fd[k] = v; if (k === 'fit') fd.ox = fd.oy = fd.zoom = null; genRender(); }
// Lưu nháp khung vào layout (cùng chỗ với panel Ảnh)
function genApplyFrame(c) { const fd = c.st.fd; if (c.key === 'G1' && c.st.arTouched) { commit(w => { const t = w.tasks.find(x => x.id === c.id); if (t.image) t.image.ar = c.st.ar; }); c.st.arTouched = false; } if (!fd) return; commit(w => { const t = w.tasks.find(x => x.id === c.id), cf = cfgOf(t, genSel(t, c.key), true); cf.frame = cf.frame || {}; ['fit', 'zoom', 'ox', 'oy'].forEach(k => { cf.frame[k] = fd[k] || null; }); }); }
function openGen(id, key) {
  const t = ws.tasks.find(x => x.id === id); if (!t) return;
  const k = id + '|' + key, lab = (slotsOf(t).find(x => x.key === key) || {}).label || '';
  const st = genState[k] = genState[k] || { prompt: lab ? String(lab) : '', refs: [], results: [], cur: -1, ar: String(imgArOf(t, key) || '4/3'), busy: false, msg: '' };
  st.ar = String(imgArOf(t, key) || '4/3'); st.msg = ''; st.rm = false; st.arTouched = false; genCtx = { id, key, st };
  const fc0 = genFrameCfg(t, key); st.fd = fc0 ? { fit: fc0.frame.fit || null, zoom: fc0.frame.zoom || null, ox: fc0.frame.ox || null, oy: fc0.frame.oy || null } : null;
  if (st.fd && !st.fd.fit && !srcOf(t, key)) st.fd.fit = 'width';      // ô chưa có ảnh: mặc định Fit ngang
  const d = document.getElementById('genDlg'); document.getElementById('genPrompt').value = st.prompt; genRender();
  if (!d.open) d.showModal(); document.getElementById('genPrompt').focus();
}
async function genRun() {
  const c = genCtx, st = c.st; st.prompt = document.getElementById('genPrompt').value.trim();
  if (!st.prompt) { st.msg = 'Nhập mô tả ảnh trước.'; genRender(); return; }
  st.busy = true; st.msg = ''; genRender();
  const prov = window.WSImageGen && typeof window.WSImageGen.generate === 'function' ? window.WSImageGen : GEN_DEMO;
  try { const r = await prov.generate({ prompt: st.prompt, refs: st.refs.slice(), ar: st.ar }); const src = typeof r === 'string' ? r : r && r.src; if (!src) throw new Error('Dịch vụ không trả ảnh'); st.results.push(src); (st.resAr = st.resAr || [])[st.results.length - 1] = st.ar; (st.resWH = st.resWH || [])[st.results.length - 1] = await imgWH(src); st.cur = st.results.length - 1; }
  catch (e) { st.msg = 'Không tạo được ảnh: ' + (e && e.message ? e.message : 'lỗi không rõ'); }
  st.busy = false; if (genCtx === c) genRender();
}
function imgWH(src) { return new Promise(ok => { const im = new Image(); im.onload = () => ok({ w: im.naturalWidth, h: im.naturalHeight }); im.onerror = () => ok(null); im.src = src; }); }
async function genUse() {
  const c = genCtx, st = c.st; if (st.busy) return;
  document.getElementById('genDlg').close();
  genApplyFrame(c);
  if (st.cur >= 0) { const src = st.results[st.cur], wh = (st.resWH || [])[st.cur] || (await imgWH(src)) || { w: 1, h: 1 };
    await dropImages(c.id, [{ type: 'image/png', name: 'gen.png' }], c.key, [{ src, w: wh.w, h: wh.h, ar: +(wh.w / wh.h).toFixed(4) }]); }
  else if (st.rm) removeImage(c.id, c.key);
}
{ const d = document.getElementById('genDlg'), $ = id => document.getElementById(id);
  document.getElementById('tree').addEventListener('click', e => { const b = e.target.closest('[data-gen]'); if (!b) return; const ed = b.closest('.ed'); if (ed) { e.stopPropagation(); openGen(ed.dataset.ed, b.dataset.gen); } }, true);
  extraActs['img-gen'] = (b, v) => openGen(curT(ws).id, v);
  $('genClose').onclick = () => d.close();
  $('genGo').onclick = genRun; $('genUse').onclick = genUse;
  $('genPrompt').addEventListener('input', e => { genCtx.st.prompt = e.target.value; });
  $('genPrompt').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); genRun(); } });
  d.addEventListener('keydown', e => e.stopPropagation());
  d.addEventListener('click', e => { const b = e.target.closest('#genFit [data-fit]'); if (b) genSetFrame('frame.fit', b.dataset.fit === 'normal' ? null : b.dataset.fit); });
  $('genZoom').addEventListener('input', e => { $('genZoomOut').textContent = e.target.value + '%'; $('genFr').style.setProperty('--z', e.target.value / 100); });
  $('genZoom').addEventListener('change', e => genSetFrame('frame.zoom', +e.target.value === 100 ? null : +e.target.value));
  $('genCenter').onclick = () => { const fd = genCtx.st.fd; if (fd) { fd.ox = fd.oy = fd.zoom = null; genRender(); } };
  // kéo ảnh trong khung để lệch tâm
  $('genFr').addEventListener('pointerdown', e => {
    const fr = $('genFr'); if (!fr.classList.contains('fit') || !genCtx) return; const fc = genCtx.st.fd && { frame: genCtx.st.fd }; if (!fc) return;
    e.preventDefault(); fr.setPointerCapture(e.pointerId); fr.classList.add('pan');
    const img = fr.querySelector('img'), pr = fr.getBoundingClientRect(), ir = img.getBoundingClientRect(), ox0 = fc.frame.ox || 0, oy0 = fc.frame.oy || 0, x0 = e.clientX, y0 = e.clientY;
    const mx = Math.abs(ir.width - pr.width) / 2 / ir.width * 100, my = Math.abs(ir.height - pr.height) / 2 / ir.height * 100; let nx = ox0, ny = oy0;
    const mv = ev => { nx = Math.round(Math.max(-mx, Math.min(mx, ox0 + (ev.clientX - x0) / ir.width * 100))); ny = Math.round(Math.max(-my, Math.min(my, oy0 + (ev.clientY - y0) / ir.height * 100))); fr.style.setProperty('--ox', nx); fr.style.setProperty('--oy', ny); };
    const up = () => { fr.removeEventListener('pointermove', mv); fr.removeEventListener('pointerup', up); fr.removeEventListener('pointercancel', up); fr.classList.remove('pan');
      if (nx !== ox0 || ny !== oy0) { const fd = genCtx.st.fd; fd.ox = nx || null; fd.oy = ny || null; genRender(); } };
    fr.addEventListener('pointermove', mv); fr.addEventListener('pointerup', up); fr.addEventListener('pointercancel', up); });
  d.addEventListener('click', e => {
    const v = e.target.closest('#genVs [data-v]'), rx = e.target.closest('[data-rx]'), ar = e.target.closest('#genAr [data-ar]');
    if (v) { genCtx.st.cur = +v.dataset.v; genRender(); }
    else if (rx) { genCtx.st.refs.splice(+rx.dataset.rx, 1); genRender(); }
    else if (ar) { genCtx.st.ar = ar.dataset.ar; genCtx.st.arTouched = true; genRender(); }
    else if (e.target.closest('#genAdd')) { $('genRefFile').value = ''; $('genRefFile').click(); }
  });
  $('genRefFile').addEventListener('change', async e => { const st = genCtx.st; const fs = [...e.target.files].slice(0, 4 - st.refs.length);
    for (const f of fs) { try { st.refs.push((await loadImg(f)).src); } catch (_) { st.msg = 'Không đọc được một ảnh tham chiếu.'; } } genRender(); });
  $('genUpload').onclick = () => { $('genUp').value = ''; $('genUp').click(); };
  $('genUp').addEventListener('change', async e => { const f = e.target.files[0]; if (!f) return; const c = genCtx, st = c.st;
    try { const src = (await loadImg(f)).src, ar = await new Promise(ok => { const im = new Image(); im.onload = () => ok(`${im.naturalWidth}/${im.naturalHeight}`); im.onerror = () => ok(null); im.src = src; });
      st.results.push(src); (st.resAr = st.resAr || [])[st.results.length - 1] = ar; (st.resWH = st.resWH || [])[st.results.length - 1] = await imgWH(src); st.cur = st.results.length - 1; st.rm = false;
      const t = ws.tasks.find(x => x.id === c.id); if (st.fd && !st.fd.fit && !srcOf(t, c.key)) st.fd.fit = 'width'; }
    catch (_) { st.msg = 'Không đọc được ảnh này.'; }
    if (genCtx === c) genRender(); });
  $('genRm').onclick = () => { const st = genCtx.st; st.rm = true; st.cur = -1; genRender(); };
  d.addEventListener('close', () => { genCtx = null; });
}
function tidyHints(root) {
  if (!root) return;
  root.querySelectorAll('.hint').forEach(h => {
    if (h.hasAttribute('data-na') || h.closest('.diag') || h.classList.contains('fold')) return;
    if ((h.textContent || '').trim().length > 64) { h.classList.add('fold'); h.setAttribute('role', 'button'); h.setAttribute('tabindex', '0'); h.title = 'Bấm để xem đầy đủ / thu gọn'; }
  });
}
{ const ri = renderInspector, rt = renderTree;
  renderInspector = function () { ri(); tidyHints(document.getElementById('insp')); };
  renderTree = function () { rt(); tidyHints(document.getElementById('tree')); }; }
document.addEventListener('click', e => { const h = e.target.closest('.hint.fold'); if (h) h.classList.toggle('x'); });
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.hint.fold')) { e.preventDefault(); e.target.classList.toggle('x'); } });
// Hộp "Thao tác nhanh" + ô Hiện mã kỹ thuật: React (src/ui/TopBar.tsx, HelpPop)
// Hộp hỏi xác nhận (thay confirm() của trình duyệt): trả về Promise<true|false>
// v85: bấm ra ngoài hộp hỏi (vùng nền mờ) = Hủy. Chỉ tính khi cả lúc nhấn và lúc thả đều ở ngoài, để kéo bôi chữ không làm đóng hộp
// Hộp hỏi xác nhận askConfirm(): React (src/ui/Dialogs.tsx)
const TN_HINT = { T1: 'Ảnh (nếu có) ở trên, rồi bài đọc, câu hỏi', T2: 'Ảnh một cột bên trái, chữ cột bên phải', T3: 'Ảnh một cột bên phải, chữ cột bên trái', T4: 'Bài đọc chạy bao quanh ảnh' };
const QHINT = {
  Q1: 'Gạch ___ trong câu, hoặc ô chữ cái', Q2: 'Câu hỏi + dòng kẻ để viết', Q3: 'Mỗi câu có lựa chọn A, B, C', Q4: 'Viết {a|b} trong câu; học sinh gạch / khoanh. Có nhãn A–D dưới đoạn gạch chân (tìm lỗi sai)',
  Q5: 'Khoanh Đúng / Sai (2–3 lựa chọn, nhãn tự đặt), hoặc ô tick', Q6: 'Mỗi câu một ảnh, viết từ / câu', Q7: 'Mỗi câu 2–4 ảnh, tick ảnh đúng', Q8: 'Vế trái nối với vế phải',
  Q9: 'Từ lặp lại để tô theo nét', Q10: 'Ô chữ / ô trống để viết / ô tick; cũng dùng cho phân loại, story map, KWL', Q11: 'Ô chữ giải đố, lưới chữ tìm từ', Q12: 'Không có câu: dòng kẻ (tới 20 dòng) hoặc khung trống để vẽ'
};
const hasAns = t => t.answer.kind !== 'none' || ['table'].includes(ck(t));
// Cách xếp câu (trong Q): đổi bố cục bên trong mà vẫn ở "Xếp dọc"
function qArr(t) {
  const q = qOf(t), L = layoutOf(t), out = [];
  if (tnOf(t) !== 'T1') return out;
  if (q === 'Q5' && (ck(t) === 'questions' || (ck(t) === 'passage' && !t.image))) out.push(['T4', 'Cột bên phải', L === 'T4'], [t.image ? 'T1' : 'T6', 'Ngay dưới câu', L !== 'T4']);
  if ((q === 'Q6' || q === 'Q7') && ck(t) === 'items' && !its(t).some(x => x.lines)) out.push(['T5', 'Lưới ô', L === 'T5'], ['T6', 'Danh sách', L === 'T6']);
  return out;
}
const labsKey = p => { const l = (p.labs || []).join('|'); return Object.keys(LABS).find(k => LABS[k].join('|') === l) || (l ? 'x' : 'tf'); };
// Hình xem trước của Q (rê chuột lên nút)
const QPV = {
  Q1: '<p><i>1</i>I like <u class="g"></u> .</p><p><i>2</i>She is my <u class="g"></u> .</p>',
  Q2: '<p><i>1</i>Where do you live?</p><p class="l"></p><p><i>2</i>What do you like?</p><p class="l"></p>',
  Q3: '<p><i>1</i>I ___ to school.</p><p class="o"><b>A</b>go <b>B</b>goes <b>C</b>going</p>',
  Q4: '<p><i>1</i>It is <b>big</b> / <b>small</b>.</p><p><i>2</i>They <b>was</b> / <b>were</b> late.</p>',
  Q5: '<p><i>1</i>The cat is black. <span class="tf"><b>T</b><b>F</b></span></p><p><i>2</i>There are two dogs. <span class="tf"><b>T</b><b>F</b></span></p>',
  Q6: '<div class="ig"><span><s></s><u class="g"></u></span><span><s></s><u class="g"></u></span><span><s></s><u class="g"></u></span></div>',
  Q7: '<p><i>1</i>What did Tom eat?</p><div class="ig"><span><s></s>☐</span><span><s></s>☐</span><span><s></s>☐</span></div>',
  Q8: '<p><i>1</i>apple <em>•</em> <em>•</em> a red</p><p><i>2</i>sky <em>•</em> <em>•</em> b blue</p>',
  Q9: '<p><i>1</i>cat <span class="tr">cat cat cat</span></p><p><i>2</i>dog <span class="tr">dog dog dog</span></p>',
  Q10: '<table><tr><td></td><td>Mon</td><td>Tue</td></tr><tr><td>Mia</td><td>swim</td><td></td></tr></table>',
  Q11: '<div class="cw"><b>1</b><b></b><b></b><b></b><b>2</b><b></b></div>',
  Q12: '<p class="l"></p><p class="l"></p><p class="l"></p><p class="l"></p>'
};
const qIcon = q => `<span class="qpv" aria-hidden="true">${QPV[q] || ''}</span>`;
// Bộ chọn T (4 kiểu + Tự động) và Q (12 kiểu); act = 'tn' / 'q' (Inspector) hoặc eact (cột trái)
function tPickerHtml(t, side) {
  const why = tnReasons(t), cur = t.layout.task === 'auto' ? 'auto' : tnOf(t), at = side === 'tree' ? 'data-eact' : 'data-act', IC = { T1: 'T1', T2: 'T2', T3: 'T3', T4: 'T8' };
  const btn = (v, n, ic, dis, hint) => `<button class="lay tnb ${cur === v ? 'on' : ''}" ${at}="tn" data-v="${v}" ${dis ? `disabled title="${esc(dis)}"` : `title="${esc(hint)}"`}>${layIcon(ic)}<span>${n}</span>${v !== 'auto' ? cd(v) : `<small class="cd">${TN[tnOf(t)]}</small>`}</button>`;
  const ok = Object.keys(TN).filter(v => !why[v]), locked = Object.keys(TN).filter(v => why[v]);
  return `<h3>Bố cục Task</h3><div class="lay-grid tn-grid">${btn('auto', 'Tự động', IC[tnOf(t)], '', 'Hệ thống tự chọn')}${ok.map(v => btn(v, TN[v], IC[v], '', TN_HINT[v])).join('')}</div>` +
    (locked.length ? `<details class="why"><summary>Bố cục chưa dùng được (${locked.length})</summary><ul>${locked.map(v => `<li><b>${TN[v]}</b>: ${esc(why[v])}</li>`).join('')}</ul></details>` : '');
}
function qPickerHtml(t, side) {
  const cur = qOf(t), why = qReasons(t), at = side === 'tree' ? 'data-eact' : 'data-act';
  return `<h3>Dạng câu hỏi</h3><div class="q-grid">${QORDER.map(q => `<button class="qbt ${cur === q ? 'on' : ''}" ${at}="q" data-v="${q}" ${why[q] ? `disabled title="${esc(why[q])}"` : `title="${esc(QN[q] + ': ' + QHINT[q])}"`}><b>${QN[q]}</b>${cd(q)}${qIcon(q)}</button>`).join('')}</div>`;
}
function qOptsHtml(t, side) {
  const at = side === 'tree' ? 'data-eact' : 'data-act', st = qStyles(t), ar = qArr(t), q = qOf(t), p = t.answer.params || {}, ha = t.answer.kind !== 'none', tbl = ck(t) === 'table';
  let h = '';
  if (!tbl && ck(t) !== 'empty') h += `<div class="field"><span>Có chỗ trả lời</span><div class="seg"><button ${at}="hasans" data-v="1" class="${ha ? 'on' : ''}">Có</button><button ${at}="hasans" data-v="0" class="${!ha ? 'on' : ''}">Không (chỉ hiển thị)</button></div></div>`;
  if (st.length > 1) h += `<div class="field"><span>Cách trả lời</span><div class="seg wrapseg">${st.map(x => `<button ${at}="qst" data-v="${x.id}" class="${x.on ? 'on' : ''}">${x.name}</button>`).join('')}</div></div>`;
  if (q === 'Q2' && ha && p.frame !== 'box') {   // v95
    const c = q2cfg(t), B = (v, lab, on) => `<button ${at}="q2" data-v="${v}" class="${on ? 'on' : ''}">${lab}</button>`;
    h += `<div class="field q2f"><span>Điểm bắt đầu</span><label class="q2ck"><input type="checkbox" ${at}="q2" data-v="start:${c.start === 'end' ? 'below' : 'end'}" ${c.start === 'end' ? 'checked' : ''}> Từ cuối câu hỏi</label></div>`;
    h += `<div class="field q2f"><span>Chiều dài</span><div class="seg">${B('len:fixed', 'Cố định', c.len === 'fixed')}${B('len:fill', 'Hết dòng', c.len === 'fill')}</div>${c.len === 'fixed' ? `<div class="seg q2n">${B('mm:-5', '−', false)}<b data-q2v="mm">${c.mm} mm</b>${B('mm:+5', '+', false)}</div>` : ''}</div>`;
    h += `<div class="field q2f"><span>Số hàng</span><div class="seg q2n">${B('ln:-1', '−', false)}<b data-q2v="ln">${c.lines}</b>${B('ln:+1', '+', false)}</div></div>`;
    h += `<p class="hint">${c.start === 'end' ? (c.lines > 1 ? `Gạch ngay sau câu hỏi, thêm ${c.lines - 1} hàng bên dưới.` : 'Gạch ngay sau câu hỏi, cùng hàng.') : `${c.lines} hàng bên dưới câu hỏi.`}</p>`;
  }
  if (q === 'Q5' && t.answer.layout === 'A6') { const k = labsKey(p); h += `<div class="field"><span>Nhãn lựa chọn</span><div class="seg wrapseg">${Object.keys(LABS).map(x => `<button ${at}="labs" data-v="${x}" class="${k === x ? 'on' : ''}">${LABS[x].join(' / ')}</button>`).join('')}</div></div>`; }
  if (q === 'Q5' && t.answer.layout === 'A6') h += `<div class="field"><span>Vị trí T / F</span><div class="seg"><button ${at}="tfrow" data-v="0" class="${p.row ? '' : 'on'}">Dưới câu</button><button ${at}="tfrow" data-v="1" class="${p.row ? 'on' : ''}">Cùng hàng với câu</button></div></div>`;
  if (['A1', 'A8'].includes(t.answer.layout) && p.frame !== 'box') h += `<div class="field"><span>Kiểu dòng</span><div class="seg"><button ${at}="ruling" data-v="" class="${p.ruling !== '4' ? 'on' : ''}">Dòng thường</button><button ${at}="ruling" data-v="4" class="${p.ruling === '4' ? 'on' : ''}">Bốn ô li (tập viết)</button></div></div>`;
  if (ar.length) h += `<div class="field"><span>Cách xếp câu</span><div class="seg">${ar.map(([v, n, on]) => `<button ${at}="qarr" data-v="${v}" class="${on ? 'on' : ''}">${n}</button>`).join('')}</div></div>`;
  if (tbl) h += `<p class="hint">Chỗ trả lời nằm trong ô: ô để trống = ô viết, ✓ = ô tick.</p>`;
  return h;
}
// v98: bảng chọn đáp án: ô chữ ↔ ô tích + chữ (giữ ô trống, ô điền, ảnh); "một ô đúng mỗi hàng" giữ ô đúng đầu tiên
const tkCells = t => (t.content.rows || []).flatMap(r => r.cells);
const tkHasText = t => tkCells(t).some(v => (typeof v === 'string' && v.trim()) || (v && v.tick && v.text));
const tkOn = t => tkCells(t).some(v => v && v.tick && v.text);
function tkAll(t, on) { (t.content.rows || []).forEach(r => { r.cells = r.cells.map(v => on ? (typeof v === 'string' && v.trim() ? { tick: 1, text: v } : v) : (v && v.tick && v.text ? v.text : v)); }); if (on && (t.layout.table || {}).one) tkOne(t); }
function tkOne(t) { (t.content.rows || []).forEach(r => { let f = false; r.cells.forEach(v => { if (v && v.tick && v.ok) { if (f) delete v.ok; f = true; } }); }); }
// v99: ảnh trong ô bảng: bật / gỡ từng ô (giữ chữ), hoặc cả bảng: Không / Cột đầu / Mọi ô có chữ
const cimOn = v => typeof v === 'string' ? (v.trim() ? { img: v.trim(), text: v } : { img: 'ảnh' }) : v;
const cimOff = v => v && typeof v === 'object' && v.img && !v.tick && v.ans == null ? (v.text || '') : v;
function cimToggle(t, i, j) { const r = t.content.rows[i]; if (!r) return; const g = j === 'h' ? r.head : r.cells[+j], nv = g && typeof g === 'object' && g.img ? cimOff(g) : cimOn(g); if (j === 'h') r.head = nv; else r.cells[+j] = nv; ensureRowIds(t); }
const cimMode = t => { const R = t.content.rows || []; return R.some(r => r.cells.some(v => v && typeof v === 'object' && v.img)) ? 'all' : R.some(r => r.head && typeof r.head === 'object' && r.head.img) ? 'first' : 'none'; };
function cimSet(t, m) { (t.content.rows || []).forEach(r => { r.head = m === 'none' ? cimOff(r.head) : cimOn(r.head); r.cells = r.cells.map(v => m === 'all' ? (typeof v === 'string' && v.trim() ? cimOn(v) : v) : cimOff(v)); }); if (m === 'first') t.layout.table = Object.assign({}, t.layout.table, { rowHead: true }); ensureRowIds(t); }
function tblo(t, v) { const [k, x] = v.split(':'), o = t.layout.table = Object.assign({}, t.layout.table || {});
  if (k === 'nm') { o.nm = x; delete o.num; } else if (k === 'tk') { tkAll(t, x === '1'); } else if (k === 'im') { cimSet(t, x); } else if (k === 'one') { if (x === '1') { o.one = true; tkOne(t); } else delete o.one; } else if (k === 'fr') { o.fr = x === '1' ? 'zebra' : 'none'; if (x === '1') o.fc = false; } else o[k] = x === '1';
  return { head: 'Hàng tiêu đề cột', fh: 'Tô nền hàng tiêu đề', fr: 'Tô hàng xen kẽ', rowHead: 'Cột tiêu đề hàng', nm: 'Số thứ tự', tk: 'Hiện ô tích trước chữ', one: 'Một ô đúng mỗi hàng', im: 'Ảnh trong bảng' }[k] + ': ' + (k === 'nm' ? { out: 'ngoài bảng', in: 'trong cột đầu', off: 'tắt' }[x] : k === 'im' ? { none: 'không', first: 'cột đầu', all: 'mọi ô có chữ' }[x] : x === '1' ? 'bật' : 'tắt'); }
const Q_ACTS = ['tn', 'q', 'hasans', 'qst', 'labs', 'tfrow', 'ruling', 'qarr', 'q2'];
Q_ACTS.forEach(a => { extraActs[a] = (b, v) => { let msg = null; commit(w => { msg = qCmd(curT(w), a, v); }, null, () => { if (msg) toast(msg); }); }; });

// ---- Khối (G): thêm / xóa thống nhất ----
const BLK_NAME = { G1: 'Ảnh chung', G1b: 'Ảnh thứ hai', G2: 'Bài đọc', intro: 'Lời dẫn', G3: 'Câu hỏi', G4: 'Khung từ chữ', G4i: 'Khung từ ảnh', GTt: 'Khối chữ', GTi: 'Khối ảnh' };
function blkAddable(t) {
  const k = ck(t), c = t.content, o = [];
  if (!t.image) o.push('G1'); else if (!t.image.two) o.push('G1b');
  if (c.form !== 'table' && !(c.lead && c.lead.kind === 'passage') && ['questions', 'empty'].includes(k)) o.push('G2');
  if (c.form !== 'table' && !c.lead && k === 'dialogue') o.push('intro');
  if (k === 'empty') o.push('G3');
  if (!t.wordBank && k !== 'empty') o.push('G4', 'G4i');
  o.push('GTt', 'GTi');
  return o;
}
function blkAdd(t, v) {
  const c = t.content;
  if (v === 'G1') { t.image = { label: 'ảnh', size: 'medium' }; return; }
  if (v === 'G1b') { t.image.two = true; t.image.label2 = 'ảnh 2'; return; }
  if (v === 'G2') { if (ck(t) === 'empty') { delete c.list; c.items = (c.items || []).length ? c.items : [{ text: '' }]; ensureIds(t); if (t.answer.kind === 'none') setKind(t, 'sentence'); } c.lead = { kind: 'passage', text: '' }; normAnswer(t); return; }
  if (v === 'intro') { c.lead = { kind: 'text', text: '' }; return; }
  if (v === 'G3') { toggleField(t, 'list', true); if (!(t.content.items || []).length) { t.content.items = [{ text: '' }, { text: '' }, { text: '' }]; ensureIds(t); } if (t.answer.kind === 'none') setKind(t, 'word'); normAnswer(t); return; }
  if (v === 'G4' || v === 'G4i') { t.wordBank = { words: v === 'G4i' ? ['', '', ''] : [], placement: 'top', style: 'chips', label: 'lower' }; if (v === 'G4i') { t.wordBank.kind = 'image'; t.wordBank.words = ['ảnh A', 'ảnh B', 'ảnh C']; } return; }
  if (v === 'GTt' || v === 'GTi') { t.extras = t.extras || []; const nid = newId(new Set(t.extras.map(y => y.id)), 'x'); t.extras.push(v === 'GTi' ? { id: nid, kind: 'image', pos: 'bottom', label: 'ảnh' } : { id: nid, kind: 'text', pos: 'bottom', text: '' }); return nid; }
}
function blkDel(t, g, item) {
  const c = t.content, U = k => { ['uploads', 'upMeta', 'imgAr'].forEach(f => { if (t[f]) delete t[f][k]; }); };
  if (g === 'G1') { delete t.image; U('G1'); U('G1b'); t.layout.frame = {}; return 'Đã xóa ảnh chung'; }
  if (g === 'G1b') { if (t.image) { delete t.image.two; delete t.image.label2; } U('G1b'); return 'Đã xóa ảnh thứ hai'; }
  if (g === 'G2') { if (c.lead) { delete c.lead; delete t.layout.order; normAnswer(t); return 'Đã xóa bài đọc'; } return null; }
  if (g === 'intro') { if (c.lead && c.lead.kind === 'text') delete c.lead; return 'Đã xóa lời dẫn'; }
  if (g === 'G4') { if (t.wordBank) { (t.wordBank.words || []).forEach((_, i) => U('B.' + i)); delete t.wordBank; } return 'Đã xóa khung từ'; }
  if (g === 'G3') { if (item) { const i = its(t).findIndex(x => x.id === item); if (i < 0) return null; dropOrphans(t, item); t.content.items.splice(i, 1); normAnswer(t); return `Đã xóa câu`; } toggleField(t, 'list', false); return 'Đã tắt danh sách câu (giữ câu để bật lại)'; }
  if (g === 'GT') { dropOrphans(t, item); t.extras = (t.extras || []).filter(y => y.id !== item); if (!t.extras.length) delete t.extras; return 'Đã xóa khối'; }
  return null;
}
// Khung từ: chữ hoặc ảnh (không trộn), vị trí trên / dưới / phải
extraActs['wbkind'] = (b, v) => commit(w => { const t = curT(w), wb = t.wordBank; if (!wb) return; if (v === 'image') { wb.kind = 'image'; if (!wb.words.length) wb.words = ['ảnh A', 'ảnh B', 'ảnh C']; wb.label = wb.label === 'lower' ? 'upper' : wb.label; } else { delete wb.kind; delete wb.ar; delete wb.cols; delete wb.cap; wb.words.forEach((_, i) => { ['uploads', 'upMeta', 'imgAr'].forEach(f => { if (t[f]) delete t[f]['B.' + i]; }); }); } }, v === 'image' ? 'Khung từ: ảnh' : 'Khung từ: chữ');
extraActs['wbcap'] = (b, v) => commit(w => { const wb = curT(w).wordBank; if (v === '0') wb.cap = false; else delete wb.cap; });
extraActs['wbar'] = (b, v) => commit(w => { const wb = curT(w).wordBank; if (v === '1/1') delete wb.ar; else wb.ar = v; });
extraActs['wbcols'] = (b, v) => commit(w => { const wb = curT(w).wordBank; if (!+v) delete wb.cols; else wb.cols = +v; });
extraActs['blkdel'] = (b, v) => { const t0 = curT(ws), g = v || sel.g, it = sel.item; let m = null; sel = { type: 'task', id: t0.id }; multi = []; commit(w => { m = blkDel(curT(w), g, g === 'G3' ? (b.dataset.item || it) : g === 'GT' ? it : null); }, null, () => { sel = { type: 'task', id: t0.id }; multi = []; refreshSel(); if (m) toast(m + ' · Ctrl+Z để hoàn tác'); }); };
extraActs['order'] = (b, v) => commit(w => { const t = curT(w); if (v === 'qfirst') t.layout.order = 'qfirst'; else delete t.layout.order; }, v === 'qfirst' ? 'Câu hỏi đặt trước bài đọc' : 'Bài đọc đặt trước câu hỏi');
// Câu (block câu) sửa / thêm / nhân đôi / xóa ngay từ trang: chọn đáp án của câu trên trang → panel
function itemAct(t, act, id) {
  const it = its(t), i = it.findIndex(x => x.id === id); if (i < 0) return null;
  if (act === 'iadd') { const x = blankItem(t); t.content.items.splice(i + 1, 0, x); ensureIds(t); normAnswer(t); return 'Đã thêm câu'; }
  if (act === 'idup') { const x = clone(it[i]); delete x.id; delete x.ex; t.content.items.splice(i + 1, 0, x); ensureIds(t); return 'Đã nhân đôi câu'; }
  if (act === 'idel') { dropOrphans(t, id); t.content.items.splice(i, 1); normAnswer(t); return 'Đã xóa câu'; }
  if (act === 'iex') { if (it[i].ex) { delete it[i].ex; return 'Bỏ câu ví dụ'; } const had = it.some(y => y.ex); it.forEach(y => { delete y.ex; }); it[i].ex = true; if (it[i].key == null) it[i].key = ''; return had ? 'Câu ví dụ chuyển sang câu này (mỗi bài chỉ một câu ví dụ)' : 'Câu ví dụ: số 0, hiện sẵn đáp án'; }   // v85: mỗi bài một câu ví dụ
  if (act === 'iup' || act === 'idown') { const j = act === 'iup' ? i - 1 : i + 1; if (j < 0 || j >= it.length) return null; [t.content.items[i], t.content.items[j]] = [t.content.items[j], t.content.items[i]]; return null; }
  return null;
}
['iadd', 'idup', 'idel', 'iex', 'iup', 'idown'].forEach(a => { extraActs[a] = (b, v) => { const t0 = curT(ws), id = b.dataset.item || sel.item; let m = null, nid = null; if (a === 'idel') { sel = { type: 'task', id: t0.id }; multi = []; }
  commit(w => { const t = curT(w), n0 = its(t).length; m = itemAct(t, a, id); if (a === 'iadd' || a === 'idup') { const k = its(t).findIndex(x => x.id === id); nid = its(t)[k + 1] && its(t)[k + 1].id; } }, null, () => {
    if (a === 'idel') { sel = { type: 'group', id: t0.id, g: 'G3' }; if (!groupsOf(curT(ws)).includes('G3')) sel = { type: 'task', id: t0.id }; }
    else if (nid && itemKeys(curT(ws)).includes(nid)) sel = { type: 'group', id: t0.id, g: 'G3', item: nid };
    multi = []; refreshSel(); if (m) toast(m); }); }; });
extraActs.change = (i => { const prev = extraActs.change; return el => { if (prev) prev(el); if (el.dataset.itx != null) { const t0 = curT(ws), id = el.dataset.itx, f = el.dataset.f || 'text', v = el.value; commit(w => { const x = its(curT(w)).find(y => y.id === id); if (!x) return; if (f === 'key') { if (v.trim()) x.key = v; else if (x.ex) x.key = ''; else delete x.key; } else if (f === 'who') { if (v.trim()) x.who = v; } else x[f] = v; }); } }; })();
blankItem = (f => t => withoutGt(t, () => f(t)))(blankItem);
itemKeys = (f => t => { const g = new Set(its(t).filter(x => x.gt).map(x => x.id)); return f(t).filter(id => !g.has(id)); })(itemKeys);
labelOf = (f => (t, k) => { const [a, b] = String(k).split('.'), i = its(t).findIndex(x => x.id === a); return i >= 0 && !its(t)[i].gt ? qnum(t, i) + (b != null ? '.' + (+b + 1) : '') : f(t, k); })(labelOf);
Object.assign(GNAME, { G2: 'Câu hỏi', G3: 'Câu hỏi' });
// ---- Inspector: bộ chọn T + Q thay cho bộ chọn bố cục cũ; panel Câu hỏi thay panel Đáp án ----
layoutPicker = t => tPickerHtml(t) + qPickerHtml(t) + qOptsHtml(t);
const _answerPanel81 = answerPanel;
answerPanel = (t, s, key) => {
  if (key) {
    const it = its(t), i = it.findIndex(x => x.id === key), x = it[i] || {};
    const acts = `<h3>Câu này</h3><div class="stack"><button class="btn" data-act="iadd" data-item="${key}">+ Thêm câu sau</button><button class="btn" data-act="idup" data-item="${key}">⧉ Nhân đôi</button><button class="btn" data-act="iex" data-item="${key}" aria-pressed="${!!x.ex}">${x.ex ? 'Bỏ câu ví dụ' : 'Đặt làm câu ví dụ (số 0)'}</button><button class="btn" data-act="idel" data-item="${key}">✕ Xóa câu</button></div>`
      + (x.ex ? `<div class="field"><span>Đáp án mẫu (hiện sẵn)</span><input data-itx="${key}" data-f="key" value="${esc(x.key || '')}" aria-label="Đáp án của câu ví dụ"></div>` : '') + `<p class="hint">Phím Delete cũng xóa câu đang chọn.</p>`;
    return _answerPanel81(t, s, key).replace(/<h2>Đáp án · câu ([^<]*)<\/h2>/, (m, n) => `<h2>Câu ${n}${x.ex ? ' (ví dụ)' : ''} · chỗ trả lời</h2>` + acts);
  }
  const q = qOf(t), h = _answerPanel81(t, s, null), top = qPickerHtml(t) + qOptsHtml(t);
  return h.replace(/<h2>Đáp án · [\s\S]*?<\/h2>[\s\S]*?(?=<section class="psec")/, `<h2>Câu hỏi · ${QN[q]} ${cd(q)}</h2>${top}`);
};
const _framePanel81 = framePanel;
framePanel = (t, s) => {
  const two = !!(t.image && t.image.two), ok = ['questions', 'passage', 'empty'].includes(ck(t));
  const f2 = two ? g1bFr(t) : {}, fit2 = two ? fSeg('@cells.G1b.frame.fit', 'Hiển thị ảnh thứ hai', f2.fit, [['', 'Như ảnh 1'], ['normal', 'Bình thường'], ['width', 'Fit ngang'], ['height', 'Fit dọc']], '', { hint: 'Kích thước và căn lề đi theo khung ảnh chung.' })
    + (f2.fit && f2.fit !== 'normal' ? fRange('@cells.G1b.frame.zoom', 'Zoom ảnh thứ hai', f2.zoom, { min: 50, max: 300, step: 5, def: 100, fmt: x => x + '%', fmtKey: 'zoom' }) : '') : '';   // v85
  const add = `<h3>Ảnh thứ hai</h3>${two ? fit2 + imgCtl(t, 'G1b').replace('<h3>Ảnh</h3>', '') + `<div class="stack"><button class="btn" data-act="blkdel" data-v="G1b">Xóa ảnh thứ hai</button></div>` : `<div class="stack"><button class="btn" data-act="blkadd" data-v="G1b" ${ok ? '' : 'disabled title="Hai ảnh dùng cho bài có câu hỏi / bài đọc"'}>+ Thêm ảnh thứ hai</button></div>`}<p class="hint">Hai ảnh đứng cạnh nhau, cùng cỡ.</p>`;
  return _framePanel81(t, s).replace(/(<section class="psec" data-sec="auto")/, `<section class="psec" data-sec="two">${add}</section>$1`);
};
bankPanel = (t, s) => {
  const b = t.wordBank, pl = b.placement || 'top', right = pl === 'right', img = b.kind === 'image';
  const size = (right ? fRange('@split', 'Tỉ lệ nội dung / khung từ', t.layout.split, { min: 40, max: 80, step: 5, def: 62, fmt: r => `${r} / ${100 - r}`, fmtKey: 'split' }) : fNum('w', 'Độ rộng khung từ', b.w, { min: 30, max: 100, step: 5, unit: '%', def: 100 }));
  const align = right ? fSeg('valign', 'Căn dọc', b.valign, Object.entries(VA), 'top') : fSeg('align', 'Căn ngang', b.align, Object.entries(HA), 'center', { hint: b.w ? '' : 'Có tác dụng khi độ rộng nhỏ hơn 100%.' });
  const sg = (act, cur, opts) => `<div class="seg wrapseg">${opts.map(([v, n]) => `<button data-act="${act}" data-v="${v}" class="${String(cur) === String(v) ? 'on' : ''}">${n}</button>`).join('')}</div>`;
  let content = `<div class="field"><span>Loại</span>${sg('wbkind', img ? 'image' : 'text', [['text', 'Chữ'], ['image', 'Ảnh']])}</div><div class="field"><span>Vị trí</span>${sg('wb', pl, [['top', 'Trên câu hỏi'], ['bottom', 'Dưới câu hỏi'], ['right', 'Bên phải']])}</div>`;
  if (!img) content += `<div class="field"><span>Kiểu hiển thị</span>${sg('wbstyle', b.style === 'list' ? 'list' : 'chips', [['chips', 'Từ rời'], ['list', 'Danh sách']])}</div>` + (b.style === 'list' ? `<div class="field"><span>Nhãn</span>${sg('wblab', b.label || 'lower', [['lower', 'a b c'], ['upper', 'A B C'], ['none', 'Không']])}</div>` : '');
  else content += `<div class="field"><span>Nhãn</span>${sg('wblab', b.label || 'lower', [['upper', 'A B C'], ['lower', 'a b c'], ['none', 'Không']])}</div><div class="field"><span>Chữ dưới ảnh</span>${sg('wbcap', b.cap === false ? '0' : '1', [['1', 'Hiện'], ['0', 'Ẩn']])}</div>${fSeg('frame.fit', 'Hiển thị ảnh trong khung', (b.frame || {}).fit, [['normal', 'Bình thường'], ['width', 'Fit ngang'], ['height', 'Fit dọc']], 'normal', { hint: 'Áp cho mọi ảnh trong khung từ.' })}${(b.frame || {}).fit ? fRange('frame.zoom', 'Zoom ảnh', b.frame.zoom, { min: 50, max: 300, step: 5, def: 100, fmt: x => x + '%', fmtKey: 'zoom' }) : ''}<div class="field"><span>Tỉ lệ ô ảnh</span>${sg('wbar', b.ar || '1/1', [['1/1', '1:1'], ['4/3', '4:3'], ['3/4', '3:4']])}</div><div class="field"><span>Số ảnh mỗi hàng</span>${sg('wbcols', b.cols || 0, [[0, 'Tự động'], [2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6']])}</div><p class="hint">Bấm vào từng ô ảnh trên trang để tải / tạo ảnh. Tên ảnh sửa ở cột trái (mục Nội dung).</p>`;
  content += `<div class="stack"><button class="btn" data-act="blkdel" data-v="G4">Xóa khung từ</button></div>`;
  return panel(t, s, `Khung từ ${img ? 'ảnh' : 'chữ'} ${cd('G4')}`, { size, align, content, cname: 'Kiểu hiển thị' });
};
// Bài đọc (G2 của Task có bài đọc): thứ tự so với câu hỏi, xóa bài đọc
function leadPanel(t, s) {
  const qf = t.layout.order === 'qfirst', w8 = !qf && t.layout.task !== 'auto' && ['T8', 'T4'].includes(layoutOf(t));
  const c = `<div class="field"><span>Thứ tự</span><div class="seg"><button data-act="order" data-v="pfirst" class="${!qf ? 'on' : ''}">Bài đọc trước</button><button data-act="order" data-v="qfirst" class="${qf ? 'on' : ''}" ${w8 ? 'disabled title="Bố cục đang chọn tay (Ảnh trong bài đọc / hai cột): bài đọc luôn đứng trước. Đổi Bố cục về Tự động / Xếp dọc / Ảnh trái / Ảnh phải để đặt câu hỏi trước."' : ''}>Câu hỏi trước</button></div><p class="hint" style="margin:4px 0 0">Câu hỏi trước: bài đọc in sau câu hỏi (bài đọc khi đó không cắt theo đoạn).</p></div><div class="stack"><button class="btn" data-act="blkdel" data-v="G2">Xóa bài đọc (giữ câu hỏi)</button></div><p class="hint">Sửa chữ bài đọc ở cột trái, mục Nội dung. Phím Delete cũng xóa bài đọc.</p>`;
  return crumb(t, s) + `<h2>Bài đọc ${cd('G2')}</h2>` + sec('content', 'Bài đọc', c) + taskPanel(t, { type: 'task', id: t.id }).replace(/^[\s\S]*?<\/h2>/, '<h3>Cả Task</h3>');
}
const _renderInspector81 = renderInspector;
renderInspector = function () {
  // v85: hoàn tác sau khi thêm khối có thể để lựa chọn trỏ vào khối không còn (vd khung từ) → về chọn cả Task
  if (sel.type === 'group') { const t0 = ws.tasks.find(x => x.id === sel.id); if (!t0) sel = { type: 'sheet' }; else if ((sel.g === 'G4' && !t0.wordBank) || (sel.g === 'G1' && !sel.item && !t0.image) || (sel.g === 'GT' && sel.item && !gtOf(t0, sel.item))) { sel = { type: 'task', id: t0.id }; multi = []; } }
  if (sel.type === 'group' && sel.g === 'G2' && !sel.item) { const t = curT(ws); if (t && ck(t) === 'passage') { document.getElementById('insp').innerHTML = leadPanel(t, sel); tidyHints(document.getElementById('insp')); return; } }
  _renderInspector81();
};
extraActs['blkadd'] = (b, v) => { let nid = null; commit(w => { nid = blkAdd(curT(w), v); }, BLK_NAME[v] ? 'Đã thêm: ' + BLK_NAME[v] : null); };
// Phím Delete trên trang: xóa khối đang chọn (ảnh chung, bài đọc, khung từ, khối tự do, câu)
keyExtra = (f => e => {
  const k = e.key;
  if ((k === 'Delete' || k === 'Backspace') && (e.target === document.body || e.target.closest('#stage')) && sel.type === 'group' && curT(ws)) {
    const t = curT(ws), g = sel.g;
    if (g === 'G4' && t.wordBank) { extraActs.blkdel({ dataset: {} }, 'G4'); return true; }
    if (g === 'GT' && sel.item) { extraActs.blkdel({ dataset: {} }, 'GT'); return true; }
    if (g === 'G2' && !sel.item && ck(t) === 'passage') { extraActs.blkdel({ dataset: {} }, 'G2'); return true; }
    if (g === 'G3' && sel.item && its(t).some(x => x.id === sel.item)) { extraActs.idel({ dataset: { item: sel.item } }); return true; }
  }
  return f(e);
})(keyExtra);

// ---- Cột trái: mục 1 "Bố cục & dạng câu hỏi", khối thêm / xóa, câu ví dụ, dòng chữ giữa các câu ----
applyField = (f => (t, k, v) => { if (k === 'image.label2') { if (t.image) t.image.label2 = v; return; } if (k === 'wb.imgs') { if (t.wordBank) t.wordBank.words = splitList(v, /\n|,/).filter(Boolean); return; } const m = /^it\.(\d+)\.key$/.exec(k); if (m) { const x = its(t)[+m[1]]; if (x) { if (v.trim() || x.ex) x.key = v; else delete x.key; } return; } return f(t, k, v); })(applyField);
const xb = (v, n) => ` <button type="button" class="eb xb" data-eact="blkdel" data-v="${v}" title="Xóa ${n}" aria-label="Xóa ${n}">✕</button>`;
const _edHtml81 = edHtml;
edHtml = t => {
  let h = _edHtml81(t); const c = t.content, k = ck(t);
  // Mục 1: bộ chọn T và Q (giữ "Áp mẫu" và "Đáp án" chi tiết bên dưới)
  h = h.replace('<span class="sect">Dạng bài &amp; đáp án</span>', '<span class="sect">Bố cục &amp; dạng câu hỏi</span>')
    .replace(/(<div class="tcwrap">[\s\S]*?<\/div>)(\s*<div class="ef"><span class="elb">Áp mẫu)/, (m, a, b2) => a + `<div class="qpick">${tPickerHtml(t, 'tree')}${qPickerHtml(t, 'tree')}${qOptsHtml(t, 'tree')}</div>` + b2);
  // Mục 3: nút xóa từng khối, ảnh thứ hai, khung từ ảnh, nút thêm khối
  h = h.replace('<span class="elb">Ảnh chung</span>', `<span class="elb">Ảnh chung${xb('G1', 'ảnh chung')}</span>`)
    .replace('<span class="elb">Bài đọc</span>', `<span class="elb">Bài đọc${xb('G2', 'bài đọc')}</span>`)
    .replace('<span class="elb">Lời dẫn</span>', `<span class="elb">Lời dẫn${xb('intro', 'lời dẫn')}</span>`)
    .replace('<span class="elb">Khung từ</span>', `<span class="elb">${t.wordBank && t.wordBank.kind === 'image' ? 'Khung từ ảnh' : 'Khung từ'}${xb('G4', 'khung từ')}</span>`);
  if (t.image && t.image.two) { const a = eIn('image.label', t.image.label || '', 'Tên ảnh', { label: 'Tên ảnh chung' }) + '</div>'; h = h.replace(a, a + `<div class="ef imgrow"><span class="elb">Ảnh thứ hai${xb('G1b', 'ảnh thứ hai')}</span>${thumbHtml(t, 'G1b')}${eIn('image.label2', t.image.label2 || '', 'Tên ảnh', { label: 'Tên ảnh thứ hai' })}</div>`); }
  if (t.wordBank && t.wordBank.kind === 'image') { const wb = t.wordBank, i0 = h.indexOf('<span class="elb">Khung từ ảnh'); if (i0 > 0) { const j = h.indexOf('</div>', h.indexOf('</textarea>', i0)); if (j > 0) h = h.slice(0, j + 6) + `<div class="ef wbth">${wb.words.map((w, i) => `<span class="wbt">${thumbHtml(t, 'B.' + i)}<small>${esc(w)}</small></span>`).join('')}</div>` + h.slice(j + 6); } }
  // Câu: số theo câu thật (ví dụ = 0, dòng chữ không số), nút "0" bật / tắt câu ví dụ
  const it = its(t), exOk = c.form !== 'table' && c.list !== false && !['pairs', 'empty', 'table'].includes(k);
  h = h.replace(/<div class="eit([^"]*)" data-i="(\d+)"><div class="eih"><span class="egrip" draggable="true" data-drag="\2" title="Kéo để đổi thứ tự">⋮⋮<\/span><span class="ino">\d+<\/span>/g, (m, cl, i) => { const x = it[+i] || {}; return `<div class="eit${cl}${x.gt ? ' egt' : ''}${x.ex ? ' eex' : ''}" data-i="${i}"><div class="eih"><span class="egrip" draggable="true" data-drag="${i}" title="Kéo để đổi thứ tự">⋮⋮</span><span class="ino${x.ex ? ' ex' : ''}">${x.gt ? 'Chữ' : qnum(t, +i)}</span>`; });
  if (exOk) h = h.replace(/<button class="eb" data-eact="dupi" data-i="(\d+)"/g, (m, i) => { const x = it[+i] || {}; return x.gt ? m : `<button class="eb exb${x.ex ? ' on' : ''}" data-eact="iexi" data-i="${i}" aria-pressed="${!!x.ex}" title="${x.ex ? 'Bỏ câu ví dụ' : 'Đặt làm câu ví dụ: số 0, hiện sẵn đáp án'}" aria-label="Câu ví dụ">Ví dụ</button>` + m; });
  // Dòng chữ (gt): chỉ ô chữ, không đáp án / lựa chọn / số ô
  if (it.some(x => x.gt)) h = h.replace(/<div class="eit[^"]*egt[^"]*" data-i="(\d+)">[\s\S]*?(?=<div class="eit|<\/div><div class="erow">)/g, m => m.replace(/<div class="er2"><span class="elb">(Đáp án|Số ô|Chọn)<\/span>[\s\S]*?<\/div>/g, '').replace(/<div class="eans"[^>]*>[^<]*<\/div>/, '').replace(/placeholder="[^"]*"/, 'placeholder="Dòng chữ giữa các câu (không số, không chỗ trả lời)"').replace(/<button class="eb" data-eact="dupi"[^>]*>⧉<\/button>/, ''));
  if (exOk && ['questions', 'dialogue'].includes(k)) h = h.replace(/(<button class="btn" data-eact="add">[^<]*<\/button>)/, `$1<button class="btn" data-eact="gtiadd" title="Dòng chữ giữa các câu: không số, không chỗ trả lời (tiêu đề nhóm, lời dẫn phần sau)">+ Dòng chữ</button>`);
  // Thêm khối
  const ad = blkAddable(t);
  if (ad.length) { const row = `<div class="ef blkadd"><span class="elb">Thêm khối</span><select data-eact="blkadd" aria-label="Thêm khối vào Task"><option value="">Chọn khối…</option>${ad.map(v => `<option value="${v}">${BLK_NAME[v]}</option>`).join('')}</select></div>`;
    const s0 = h.indexOf('data-sec="content"'); if (s0 > 0) { const e0 = h.indexOf('</div></section>', s0); if (e0 > 0) h = h.slice(0, e0) + row + h.slice(e0); } }
  return h;
};
treeEl.addEventListener('click', e => {
  const b = e.target.closest('[data-eact]'); if (!b || b.disabled || b.tagName === 'SELECT') return;
  const ed = b.closest('.ed'), id = ed ? ed.dataset.ed : null, act = b.dataset.eact, v = b.dataset.v; if (!id) return;
  const T = w => w.tasks.find(y => y.id === id);
  if (Q_ACTS.includes(act)) { let msg = null; return commit(w => { msg = qCmd(T(w), act, v); }, null, () => { if (msg) toast(msg); }); }
  if (act === 'blkdel') { let m = null; if (sel.type === 'group' && sel.id === id) { sel = { type: 'task', id }; multi = []; } return commit(w => { m = blkDel(T(w), v); }, null, () => { if (sel.type === 'group' && sel.id === id) { sel = { type: 'task', id }; refreshSel(); } if (m) toast(m + ' · Ctrl+Z để hoàn tác'); }); }
  if (act === 'tickopt') { const i = +b.dataset.i, j = +b.dataset.j; return commit(w => { const t = T(w), x = its(t)[i]; if (!x) return; const op = optsOfKey(t, x);   // v86 (F2): bật / tắt từng đáp án, được chọn nhiều
    if (t.answer.layout === 'A6') { x.key = exPicks(t, x, op).includes(j) ? '' : op[j]; return; }
    const cur = exPicks(t, x, op), nx = cur.includes(j) ? cur.filter(k => k !== j) : cur.concat(j).sort((a, c) => a - c); x.key = nx.map(k => 'abcdefgh'[k] || String(k + 1)).join(', '); }); }
  if (act === 'tbimg') return commit(w => cimToggle(T(w), +b.dataset.i, b.dataset.j));   // v99
  if (act === 'tbok') { const i = +b.dataset.i, j = +b.dataset.j; return commit(w => { const t = T(w), r = t.content.rows[i], x = r && r.cells[j]; if (!x || !x.tick) return; if (x.ok) delete x.ok; else { if ((t.layout.table || {}).one) r.cells.forEach(y => { if (y && y.tick) delete y.ok; }); x.ok = true; } }); }   // v98
  if (act === 'tblo') { let m = null; return commit(w => { m = tblo(T(w), v); }, null, () => toast(m)); }   // v96
  if (act === 'pshuf') return commit(w => { const c = T(w).content; if (v) c.shuffle = true; else delete c.shuffle; });
  if (act === 'preshuf') return commit(w => { const c = T(w).content; c.shufSeed = (c.shufSeed || 0) + 1; });
  if (act === 'pickopt') { const i = +b.dataset.i, g = +b.dataset.g, j = +b.dataset.j; return commit(w => { const x = its(T(w))[i]; if (x) pkToggle(x, g, j); }); }
  if (act === 'ulpick') { const i = +b.dataset.i, j = +b.dataset.j; return commit(w => { const t = T(w), x = its(t)[i]; if (!x) return; const up = (t.answer.params || {}).upper, c = (up ? 'ABCDEFGH' : 'abcdefgh')[j]; x.key = String(x.key ?? '').trim().toLowerCase() === c.toLowerCase() ? '' : c; }); }
  if (act === 'keyjump') { const t = T(ws), m = keyState(t).miss; if (!m.length) return; const e = document.querySelector(`#tree .ed .sec[data-sec=g3] .eit[data-i="${m[0]}"]`); if (!e) return; e.scrollIntoView({ block: 'center' }); e.classList.add('kflash'); setTimeout(() => e.classList.remove('kflash'), 1200); const f = e.querySelector(`[data-k="it.${m[0]}.key"], [data-eact=tickopt], [data-eact=pickopt], input`); if (f) f.focus(); return; }
  if (act === 'optadd' || act === 'optdel') { const i = +b.dataset.i, j = +b.dataset.j; return commit(w => { const t = T(w), x = its(t)[i]; if (!x || !x.opts) return; const pk = exPicks(t, x, x.opts);   // v87: thêm / xóa lựa chọn, đáp án đúng dời theo
    if (act === 'optadd') { x.opts.push(''); if (pk.length) x.key = pk.map(k => 'abcdefgh'[k] || String(k + 1)).join(', '); return; }
    if (x.opts.length <= 2) return; x.opts.splice(j, 1); const nk = pk.filter(k => k !== j).map(k => k > j ? k - 1 : k);
    if (nk.length) x.key = nk.map(k => 'abcdefgh'[k] || String(k + 1)).join(', '); else if (x.key != null) x.key = ''; }, null, act === 'optadd' ? () => focusK(`it.${i}.opts.${its(curT(ws))[i].opts.length - 1}`) : null); }
  if (act === 'iexi') { const i = +b.dataset.i; let m = null; return commit(w => { const t = T(w), x = its(t)[i]; if (x) m = itemAct(t, 'iex', x.id); }, null, () => { if (m) toast(m); }); }
  if (act === 'gtiadd') { return commit(w => { const t = T(w); t.content.items = t.content.items || []; t.content.items.push({ gt: true, text: '' }); ensureIds(t); }, null, () => focusK(`it.${its(curT(ws)).length - 1}.text`)); }
});
treeEl.addEventListener('change', e => {
  const x = e.target; if (x.dataset.eact !== 'blkadd' || !x.value) return;
  const id = x.closest('.ed').dataset.ed, v = x.value; let nid = null;
  commit(w => { nid = blkAdd(w.tasks.find(y => y.id === id), v); }, 'Đã thêm: ' + BLK_NAME[v], () => { if (nid) { SECT.gt = true; sectSave(); refreshSel(); } });
});
/* ================= hết v81 ================= */

/* ================= v82: cột trái theo khối (Cấu hình · G0 · G1 · G2 · G3 · G4 · G-Text) =================
   Dựng lại từ edHtml v81: tách mục "Nội dung" thành từng khối G, gộp "Thành phần" vào Cấu hình,
   bỏ "Áp mẫu" và chọn loại đáp án cũ (trùng bộ chọn Q). Không đổi dữ liệu. */
Object.keys(SECT_DEF).forEach(k => { delete SECT_DEF[k]; delete SECT[k]; });
Object.assign(SECT_DEF, { cfg: false, g0: false, g1: false, g2: false, g3: true, g4: false, gt: false });   // v83: một mục mở một lúc, mặc định G3
Object.assign(SECT, SECT_DEF);
const SEC_G = { g0: 'G0', g1: 'G1', g2: 'G2', g3: 'G3', g4: 'G4' };
const G_SEC = { G0: 'g0', G1: 'g1', G2: 'g2', G3: 'g3', G4: 'g4', GT: 'gt' };
// v84: khối trên trang → mục cột trái. Trên trang G1:<câu> là ảnh của câu, G2 là phần câu hỏi (trừ bài đọc), G3 là chỗ trả lời
function secOfSel(t, s) {
  if (s.g === 'G1') return t.image && !s.item ? 'g1' : 'g3';
  if (s.g === 'G2') return ck(t) === 'passage' ? 'g2' : 'g3';
  return G_SEC[s.g];
}
// Mục cột trái → khối chọn trên trang (sel + multi); null = chọn cả Task
function selOfSec(t, k) {
  const gs = groupsOf(t), G = g => gs.includes(g) ? { type: 'group', id: t.id, g } : null;
  if (k === 'g0' || k === 'g4') return [G(SEC_G[k])];
  if (k === 'g1') return [t.image ? G('G1') : null];
  if (k === 'g2') return [ck(t) === 'passage' ? G('G2') : null];
  if (k === 'g3') return ck(t) === 'passage' ? [G('G3')] : [G('G2'), G('G3')];
  if (k === 'gt') { const x = (t.extras || [])[0]; return [x ? { type: 'group', id: t.id, g: 'GT', item: x.id } : null]; }
  return [null];
}
function sectOne(k) { Object.keys(SECT).forEach(x => { SECT[x] = false; }); if (k) SECT[k] = true; sectSave(); }
function syncSec() { document.querySelectorAll('#tree .ed .sec[data-sec]').forEach(e => { const o = !!SECT[e.dataset.sec]; e.classList.toggle('open', o); const h = e.querySelector('.sech'); if (h) h.setAttribute('aria-expanded', o ? 'true' : 'false'); }); }
// Bấm tiêu đề mục = mở mục đó (đóng mục khác) và chọn khối G tương ứng trên trang; bấm mục đang mở = thu lại, về chọn cả Task. Không dựng lại cột trái (đang gõ không mất con trỏ).
function sectClick(k) {
  const t = ws.tasks.find(x => x.id === openTask); if (!t) return;
  const was = !!SECT[k]; sectOne(was ? null : k); syncSec();
  const ss = was ? [] : selOfSec(t, k).filter(Boolean);
  sel = ss[0] || { type: 'task', id: t.id }; multi = ss.slice(1);
  renderInspector(); markSelection(); refreshOverlay();
  const tk = stage.querySelector(`.task[data-task="${t.id}"]`), gn = sel.type === 'group' && stage.querySelector(`[data-node="${nodeKey(sel)}"]`), el = gn && sel.g !== 'G0' ? gn : tk;
  if (el && !was) el.scrollIntoView({ block: el === tk ? 'start' : 'center', behavior: 'smooth' });   // đưa khối đang làm việc vào tầm nhìn
}
try { const v = JSON.parse(localStorage.getItem(SECT_KEY) || 'null'); if (v) { Object.keys(SECT_DEF).forEach(k => { if (typeof v[k] === 'boolean') SECT[k] = v[k]; }); const ks = Object.keys(SECT_DEF).filter(k => SECT[k]); if (ks.length > 1) sectOne(ks.includes('g3') ? 'g3' : ks[0]); } } catch (_) {}
const TG_BLK = { image: 'Ảnh chung', passage: 'Bài đọc', intro: 'Lời dẫn', list: 'Câu hỏi', bank: 'Khung từ' };   // công tắc bật / tắt khối; còn lại là tùy chọn của câu
const BLK_SEC = { G1: 'g1', G1b: 'g1', G2: 'g2', intro: 'g2', G3: 'g3', G4: 'g4', G4i: 'g4', GTt: 'gt', GTi: 'gt' };
const _secSums82 = secSums;
secSums = t => {
  const s = _secSums82(t), c = t.content, ld = c.lead, wb = t.wordBank, n = wb ? wb.words.length : 0;
  return { cfg: s.kind, g0: s.info, g1: t.image ? (t.image.two ? '2 ảnh' : '1 ảnh') : 'chưa có', g2: ld ? (ld.text || '').replace(/\s+/g, ' ').trim() || (ld.kind === 'text' ? 'lời dẫn trống' : 'bài đọc trống') : 'chưa có',
    g3: c.form !== 'table' && c.list === false ? ((c.items || []).length ? `đang tắt · giữ ${c.items.length} câu` : 'chưa có') : s.content, g4: wb ? `${n} ${wb.kind === 'image' ? 'ảnh' : 'từ'}` : 'chưa có', gt: s.free };
};
const _edHtml82 = edHtml;
edHtml = t => {
  const tp = document.createElement('template'); tp.innerHTML = _edHtml82(t);
  const q = s => tp.content.querySelector(s), out = e => e ? e.outerHTML : '', inner = s => { const e = q(s); return e ? e.innerHTML : ''; };
  const c = t.content, k = ck(t), sums = secSums(t), tn = tnOf(t), qq = qOf(t), ad = blkAddable(t), tbl = c.form === 'table';
  // Mục "Nội dung" của v81 → từng khối
  const G = { g1: '', g2: '', g3: '', g4: '' };
  [...(q('[data-sec="content"] .secb') || { children: [] }).children].forEach(e => {
    if (e.classList.contains('blkadd') || (e.tagName === 'P' && /Danh sách câu đang tắt/.test(e.textContent))) return;
    const g = e.classList.contains('imgrow') ? 'g1' : e.querySelector('[data-k^="lead."]') ? 'g2' : (e.classList.contains('wbth') || e.querySelector('[data-k^="wb."]')) ? 'g4' : 'g3';
    G[g] += e.outerHTML;
  });
  if (t.image && ad.includes('G1b')) G.g1 += `<div class="stack"><button class="btn" data-eact="blkaddb" data-v="G1b">+ Ảnh thứ hai</button></div>`;
  // Cấu hình: thẻ mô tả, T, Q, tùy chọn của Q, tùy chọn câu, bật / tắt khối
  const tg = fieldToggles(t), tgH = l => l.map(x => `<label class="etg ${x.dis ? 'dis' : ''}" title="${esc(x.dis || '')}"><input type="checkbox" data-tg="${x.id}" ${x.on ? 'checked' : ''} ${x.dis && !x.on ? 'disabled' : ''}>${TG_BLK[x.id] || x.label}</label>`).join('');
  const tgI = tg.filter(x => !TG_BLK[x.id] && !(x.dis && !x.on)), tgB = tg.filter(x => TG_BLK[x.id]);
  const cfg = out(q('.tcwrap')) + out(q('.qpick')) + (tgI.length ? `<h3>Tùy chọn của câu</h3><div class="etgs">${tgH(tgI)}</div>` : '') +
    (tgB.length ? `<h3>Khối của bài</h3><p class="hint" style="margin:0 0 4px">Bật hoặc tắt từng khối. Tắt Câu hỏi vẫn giữ câu để bật lại.</p><div class="etgs">${tgH(tgB)}</div>` : '');
  const tag = (v, ti) => v ? `<span class="stag" title="${esc(ti)}">${v}</span>` : '';
  const sec = (key, code, title, html, tg0) => `<section class="sec ${SECT[key] ? 'open' : ''}" data-sec="${key}"><button class="sech" data-stg="${key}" aria-expanded="${SECT[key] ? 'true' : 'false'}"><span class="snum">${code}</span><span class="sect">${title}</span><span class="secs">${esc(sums[key] || '')}</span>${tg0 || ''}<span class="car">▶</span></button><div class="secb">${html}</div></section>`;
  // Khối chưa có: tiêu đề mờ, nút thêm ngay tại mục
  const off = (key, code, title, btns, why) => `<section class="sec off" data-sec="${key}"><div class="sech"><span class="snum">${code}</span><span class="sect">${title}</span><span class="secs">${esc(why || sums[key] || '')}</span>${btns.map(([v, n]) => `<button type="button" class="eb sadd" data-eact="blkaddb" data-v="${v}">${n}</button>`).join('')}</div></section>`;
  const NA = 'không dùng cho dạng này';
  const g1 = t.image ? sec('g1', 'G1', 'Ảnh chung', G.g1) : off('g1', 'G1', 'Ảnh chung', [['G1', '+ Thêm']]);
  const g2 = c.lead ? sec('g2', 'G2', c.lead.kind === 'text' ? 'Lời dẫn' : 'Bài đọc', G.g2, tag('theo ' + tn, 'Vị trí bài đọc theo Bố cục ' + TN[tn])) :
    off('g2', 'G2', 'Bài đọc', [...(ad.includes('G2') ? [['G2', '+ Bài đọc']] : []), ...(ad.includes('intro') ? [['intro', '+ Lời dẫn']] : [])], ad.includes('G2') || ad.includes('intro') ? '' : NA);
  const g3on = tbl || c.list !== false;
  const g3 = g3on ? sec('g3', 'G3', tbl ? 'Bảng' : 'Câu hỏi', G.g3, tag(qq && 'theo ' + qq, qq ? 'Dạng câu hỏi: ' + QN[qq] : '')) : off('g3', 'G3', 'Câu hỏi', [['G3', c.list === false && (c.items || []).length ? '+ Bật lại' : '+ Thêm']]);
  const g4 = t.wordBank ? sec('g4', 'G4', t.wordBank.kind === 'image' ? 'Khung từ ảnh' : 'Khung từ', G.g4) : ad.includes('G4') ? off('g4', 'G4', 'Khung từ', [['G4', '+ Chữ'], ['G4i', '+ Ảnh']]) : off('g4', 'G4', 'Khung từ', [], NA);
  return `<div class="ed" data-ed="${t.id}">${out(q('.tkt'))}${sec('cfg', '⚙', 'Cấu hình', cfg, tag(tn + (qq ? ' · ' + qq : ''), 'Bố cục ' + TN[tn] + (qq ? ' · Dạng câu hỏi ' + QN[qq] : '')))}${sec('g0', 'G0', 'Tiêu đề', inner('[data-sec="info"] .secb'))}${g1}${g2}${g3}${g4}${(t.extras || []).length ? sec('gt', 'GT', 'Khối tự do', inner('[data-sec="free"] .secb')) : off('gt', 'GT', 'Khối tự do', [['GTt', '+ Chữ'], ['GTi', '+ Ảnh']])}</div>`;
};
treeEl.addEventListener('click', e => {
  const b = e.target.closest('[data-eact="blkaddb"]'); if (!b || b.disabled) return;
  const id = b.closest('.ed').dataset.ed, v = b.dataset.v; let nid = null;
  commit(w => { nid = blkAdd(w.tasks.find(y => y.id === id), v); }, 'Đã thêm: ' + BLK_NAME[v], () => { sectOne(BLK_SEC[v]); const g = { G1: 'G1', G1b: 'G1', G2: 'G2', intro: 'G2', G3: 'G3', G4: 'G4', G4i: 'G4' }[v]; sel = g ? { type: 'group', id, g } : nid ? { type: 'group', id, g: 'GT', item: nid } : { type: 'task', id }; refreshSel(); });
});
// Ô cần gõ nằm trong mục đang thu lại: mở mục ra trước
focusK = (f => k => { const e = document.querySelector(`#tree .ed [data-k="${k}"]`), s = e && e.closest('.sec'); if (s && !s.classList.contains('open') && s.dataset.sec in SECT) { sectOne(s.dataset.sec); syncSec(); } return f(k); })(focusK);
/* ================= hết v82 ================= */

/* ================= v83: ô ảnh G1 lớn, ⓘ + thanh chèn ký hiệu cho ô chữ ================= */
const _edHtml83 = edHtml;
edHtml = t => {
  const tp = document.createElement('template'); tp.innerHTML = _edHtml83(t); const R = tp.content;
  R.querySelectorAll('.sec[data-sec=g1] .imgrow .ithumb').forEach(b => { b.classList.add('big'); if (!b.classList.contains('has')) b.innerHTML = '<span>＋ Tải ảnh lên · Tạo ảnh<small>hoặc kéo thả ảnh vào ô trên trang · Ctrl+V</small></span>'; });
  const info = (ctx, ti) => `<button type="button" class="tinfo" data-eact="tinfo" data-ctx="${ctx}" title="${ti}" aria-label="${ti}">i</button>`;
  const lb = R.querySelector('.sec[data-sec=g2] .elb'); if (lb) lb.insertAdjacentHTML('beforeend', info('passage', 'Cách viết bài đọc / lời dẫn'));
  const sh = R.querySelector('.sec[data-sec=g3] .subh'); if (sh) sh.insertAdjacentHTML('beforeend', info('items', 'Cách viết câu hỏi'));
  R.querySelectorAll('.sec[data-sec=gt] .gtcard').forEach(c => { if (/Khối chữ/.test(c.querySelector('.gthd b') ? c.querySelector('.gthd b').textContent : '')) c.querySelector('.gthd b').insertAdjacentHTML('afterend', info('free', 'Cách viết khối chữ')); });
  const d = document.createElement('div'); d.appendChild(R.cloneNode(true)); return d.innerHTML;
};
// Bảng ký hiệu theo ngữ cảnh; nút chèn tác động vào ô chữ đang gõ gần nhất
const TXH = {
  passage: ['Bài đọc / lời dẫn', [['**chữ**', 'đậm'], ['*chữ*', 'nghiêng'], ['<u>chữ</u>', 'gạch chân'], ['___', 'chỗ trống để học sinh điền'], ['{a|b}', 'chọn trong câu'], ['(dòng trống)', 'sang đoạn mới'], ['A. …', 'đầu đoạn (≥ 2 đoạn): nhãn đoạn đậm']], 'Đáp án chỗ trống ghi ở ô bên dưới, cách nhau dấu phẩy, theo thứ tự chỗ trống.'],
  items: ['Chữ của câu', [['**chữ**', 'đậm'], ['*chữ*', 'nghiêng'], ['<u>chữ</u>', 'gạch chân'], ['___', 'chỗ trống'], ['{a|b}', 'chọn trong câu'], ['(Enter)', 'xuống dòng trong câu (ô nhiều dòng)']], 'Lựa chọn A/B/C nhập ở ô "Chọn" của câu. Ví dụ / xóa / nhân đôi câu: các nút ở đầu câu.'],
  free: ['Khối chữ tự do', [['**chữ**', 'đậm'], ['*chữ*', 'nghiêng'], ['<u>chữ</u>', 'gạch chân'], ['- chữ', 'dòng danh sách chấm'], ['1. chữ', 'dòng danh sách số'], ['(dòng trống)', 'sang đoạn mới']], 'Khối chữ nằm ngang cả bề rộng Task, không đánh số, không có đáp án.']
};
const TXB = { passage: [['B', 'b'], ['I', 'i'], ['U', 'u'], ['___', 'gap'], ['{a|b}', 'pick'], ['¶', 'para']], items: [['B', 'b'], ['I', 'i'], ['U', 'u'], ['___', 'gap'], ['{a|b}', 'pick']], free: [['B', 'b'], ['I', 'i'], ['U', 'u'], ['•', 'ul'], ['¶', 'para']] };
let txField = null;
treeEl.addEventListener('focusin', e => { const x = e.target; if (x.matches && x.matches('input[data-k],textarea[data-k]')) txField = x; });
// v84: bấm / gõ trong thẻ khối tự do = chọn khối đó trên trang (viền xanh), không dựng lại cột trái
function gtPick(e) {
  const c = e.target.closest && e.target.closest('.sec[data-sec=gt] .gtcard[data-x]'); if (!c || e.target.closest('button')) return;
  const t = ws.tasks.find(x => x.id === openTask); if (!t || !gtOf(t, c.dataset.x)) return;
  if (sel.type === 'group' && sel.g === 'GT' && sel.item === c.dataset.x && sel.id === t.id) return;
  sel = { type: 'group', id: t.id, g: 'GT', item: c.dataset.x }; multi = [];
  renderInspector(); markSelection(); refreshOverlay();
  const el = stage.querySelector(`[data-node="${nodeKey(sel)}"]`); if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
}
treeEl.addEventListener('focusin', gtPick); treeEl.addEventListener('pointerdown', gtPick);
function txInsert(act) {
  const el = txField && document.body.contains(txField) ? txField : null; if (!el) { toast('Bấm vào ô chữ cần chèn trước'); return; }
  const a = el.selectionStart, b = el.selectionEnd, sel0 = el.value.slice(a, b), lead = () => (a > 0 && el.value[a - 1] !== '\n' ? '\n' : '');
  const W = (l, r, ph) => { const m = sel0 || ph; el.setRangeText(l + m + r, a, b, 'select'); if (!sel0) el.setSelectionRange(a + l.length, a + l.length + m.length); };
  if (act === 'b') W('**', '**', 'chữ'); else if (act === 'i') W('*', '*', 'chữ'); else if (act === 'u') W('<u>', '</u>', 'chữ');
  else if (act === 'gap') { el.setRangeText('___', a, b, 'end'); } else if (act === 'pick') { el.setRangeText('{a|b}', a, b, 'select'); el.setSelectionRange(a + 1, a + 4); }
  else if (act === 'para') { el.setRangeText('\n\n', a, b, 'end'); } else if (act === 'ul') { el.setRangeText(lead() + '- ', a, b, 'end'); }
  el.focus(); el.dispatchEvent(new Event('input', { bubbles: true }));
}
function txOpen(btn) {
  let pop = document.getElementById('txHelp'); if (!pop) { pop = document.createElement('div'); pop.id = 'txHelp'; pop.hidden = true; pop.setAttribute('role', 'dialog'); document.body.appendChild(pop); }
  const ctx = btn.dataset.ctx, [ti, rows, note] = TXH[ctx];
  if (!pop.hidden && pop.dataset.ctx === ctx && pop._btn === btn) { pop.hidden = true; return; }
  pop.dataset.ctx = ctx; pop._btn = btn;
  pop.innerHTML = `<h4>${ti}</h4><div class="txtb" role="toolbar" aria-label="Chèn ký hiệu">${TXB[ctx].map(([n, a]) => `<button type="button" data-tx="${a}" title="Chèn vào ô đang gõ">${esc(n)}</button>`).join('')}</div><table>${rows.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table><p class="txnote">${esc(note)} Bôi đen chữ rồi bấm B / I / U để định dạng.</p>`;
  const r = btn.getBoundingClientRect(); pop.hidden = false;
  const w = pop.offsetWidth, h = pop.offsetHeight; pop.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left)) + 'px'; pop.style.top = Math.max(8, Math.min(window.innerHeight - h - 8, r.bottom + 6)) + 'px';
}
treeEl.addEventListener('click', e => { const b = e.target.closest('[data-eact="tinfo"]'); if (b) { e.stopPropagation(); txOpen(b); } }, true);
document.addEventListener('mousedown', e => { const pop = document.getElementById('txHelp'); if (!pop || pop.hidden) return; if (e.target.closest('#txHelp')) { if (e.target.closest('[data-tx]')) e.preventDefault(); return; } if (!e.target.closest('[data-eact="tinfo"]')) pop.hidden = true; }, true);
document.addEventListener('click', e => { const b = e.target.closest('#txHelp [data-tx]'); if (b) txInsert(b.dataset.tx); });
document.addEventListener('keydown', e => { const pop = document.getElementById('txHelp'); if (e.key === 'Escape' && pop && !pop.hidden) { pop.hidden = true; e.stopPropagation(); } }, true);
treeEl.addEventListener('scroll', () => { const pop = document.getElementById('txHelp'); if (pop) pop.hidden = true; }, { passive: true });
/* ================= hết v83 ================= */

/* ================= v85: cột trái gọn hơn =================
   Bỏ "Khối của bài" trong Cấu hình (thêm / xóa khối đã có ngay ở từng mục G; G3 có nút ✕ = tắt câu hỏi, giữ câu để bật lại).
   Mục G3: "Danh sách câu" → "Câu hỏi", bỏ số câu, thanh B I U ___ {a|b} bên phải cùng hàng; ⓘ lên hàng "Tỉ lệ ô ảnh" nếu có. */
const _edHtml84 = edHtml;
edHtml = t => {
  const tp = document.createElement('template'); tp.innerHTML = _edHtml84(t); const R = tp.content;
  const h3 = [...R.querySelectorAll('.sec[data-sec=cfg] h3')].find(h => h.textContent.trim() === 'Khối của bài');
  if (h3) { [h3.nextElementSibling && h3.nextElementSibling.matches('p.hint') ? h3.nextElementSibling : null].forEach(e => e && e.remove()); const g = h3.nextElementSibling; if (g && g.matches('.etgs')) g.remove(); h3.remove(); }
  const sh = R.querySelector('.sec[data-sec=g3] .subh');
  if (sh) {
    const nm = (sh.firstChild && sh.firstChild.nodeType === 3 ? sh.firstChild.textContent : '').trim(), inf = sh.querySelector('.tinfo');
    const lt = R.querySelector('.sec[data-sec=g3] .ef .elb'), ar = lt && lt.textContent.trim() === 'Tỉ lệ ô ảnh' ? lt.closest('.ef') : null;
    const lst = fieldToggles(t).find(x => x.id === 'list'), canOff = lst && lst.on && !lst.dis;
    sh.innerHTML = `<span class="g3n">${esc(nm === 'Danh sách câu' ? 'Câu hỏi' : nm)}${canOff ? xb('G3', 'câu hỏi (giữ câu để bật lại)') : ''}</span>${t.content.form === 'table' ? '' : `<span class="g3tb" role="toolbar" aria-label="Chèn ký hiệu vào ô câu đang gõ">${TXB.items.map(([n, a]) => `<button type="button" data-tx="${a}" title="${{ b: 'Đậm', i: 'Nghiêng', u: 'Gạch chân', gap: 'Chỗ trống', pick: 'Chọn trong câu' }[a]}: chèn vào ô câu đang gõ">${esc(n)}</button>`).join('')}</span>`}`;
    if (inf) { if (ar) { ar.classList.add('g3ar'); ar.appendChild(inf); } else sh.appendChild(inf); }
    if (ck(t) === 'pairs') { const on = !!t.content.shuffle; sh.insertAdjacentHTML('afterend', `<div class="ef shrow"><span class="elb">Xáo vế phải khi in</span><span class="seg"><button type="button" data-eact="pshuf" data-v="1" class="${on ? 'on' : ''}">Bật</button><button type="button" data-eact="pshuf" data-v="" class="${on ? '' : 'on'}">Tắt</button></span>${on ? '<button type="button" class="btn" data-eact="preshuf" title="Đổi thứ tự xáo khác">Xáo lại</button>' : ''}</div><p class="hint">Bật: gõ cặp <b>đúng</b> cạnh nhau, phiếu in tự xáo vế phải (cố định, in lại không đổi). Tắt: in đúng thứ tự đang gõ.</p>`); }   // v90
    const ks = keyState(t); if (ks.need.length) sh.insertAdjacentHTML('beforeend', `<button type="button" class="kcnt${ks.miss.length ? ' w' : ''}" data-eact="keyjump" title="${ks.miss.length ? 'Bấm để tới câu còn thiếu đáp án đúng' : 'Mọi câu đã có đáp án đúng'}">${ks.need.length - ks.miss.length}/${ks.need.length} câu có đáp án</button>`);   // v88
    // v96: tùy chọn bảng ngay ở cột trái (ô tích): hàng tiêu đề, tô nền hàng tiêu đề, hàng xen kẽ, cột tiêu đề hàng, số thứ tự
    if (ck(t) === 'table' && !tblOpts(t).cross) { const o = tblOpts(t), C = (k, n, on, dis) => `<label class="tbck"><input type="checkbox" data-eact="tblo" data-v="${k}:${on ? 0 : 1}" ${on ? 'checked' : ''} ${dis ? `disabled title="${esc(dis)}"` : ''}> ${n}</label>`;
      sh.insertAdjacentHTML('afterend', `<div class="ef tbrow"><span class="elb">Kiểu bảng</span><span class="tbcks">${C('head', 'Hàng tiêu đề cột', o.head)}${C('fh', 'Tô nền hàng tiêu đề', o.fh && o.head, o.head ? '' : 'Bật Hàng tiêu đề cột trước')}${C('fr', 'Tô hàng xen kẽ', o.fr === 'zebra' && !o.fc, o.fc ? 'Đang tô cột đầu' : '')}${C('rowHead', 'Cột tiêu đề hàng', o.rowHead)}</span></div>${tkHasText(t) || tkCells(t).some(v => v && v.tick) ? `<div class="ef tbrow"><span class="elb">Chọn đáp án</span><span class="tbcks">${tkHasText(t) ? C('tk', 'Hiện ô tích trước chữ', tkOn(t)) : ''}${tkCells(t).some(v => v && v.tick) ? C('one', 'Một ô đúng mỗi hàng', !!(t.layout.table || {}).one) : ''}</span></div>` : ''}<div class="ef tbrow"><span class="elb">Số thứ tự</span><span class="seg">${[['out', 'Ngoài bảng'], ['in', 'Trong cột đầu'], ['off', 'Tắt']].map(([v, n]) => `<button type="button" data-eact="tblo" data-v="nm:${v}" class="${o.nm === v ? 'on' : ''}">${n}</button>`).join('')}</span></div><div class="ef tbrow"><span class="elb">Ảnh trong bảng</span><span class="seg">${[['none', 'Không'], ['first', 'Cột đầu'], ['all', 'Mọi ô có chữ']].map(([v, n]) => `<button type="button" data-eact="tblo" data-v="im:${v}" class="${cimMode(t) === v ? 'on' : ''}">${n}</button>`).join('')}</span></div>`); }
    // v86: chữ câu hỏi Bình thường / Đậm
    if (!['table', 'empty', 'trace', 'dialogue'].includes(ck(t))) { const qb = !!t.layout.qbold; sh.insertAdjacentHTML('afterend', `<div class="ef qbrow"><span class="elb">Chữ câu hỏi</span><span class="seg"><button type="button" data-eact="qbold" data-v="" class="${qb ? '' : 'on'}">Bình thường</button><button type="button" data-eact="qbold" data-v="1" class="${qb ? 'on' : ''}" style="font-weight:700">Đậm</button></span></div>`); }
  }
  // v86 (F2): ô tích đáp án đúng ngay dưới lựa chọn (Chọn A/B/C, Đúng/Sai); không in ra phiếu
  if (['A4', 'A6'].includes(t.answer.layout)) R.querySelectorAll('.sec[data-sec=g3] .eit[data-i]').forEach(e => {
    const i = +e.dataset.i, x = its(t)[i]; if (!x || x.gt || x.imgs || x.opts) return; const op = optsOfKey(t, x); if (op.length < 2) return; const on = exPicks(t, x, op);   // v87: câu có opts đã có ô tích ở từng dòng
    const row = `<div class="er2 ktk"><span class="elb">Đúng</span>${op.map((o, j) => `<span class="ko"><button type="button" class="tkq${on.includes(j) ? ' on' : ''}" data-eact="tickopt" data-i="${i}" data-j="${j}" aria-pressed="${on.includes(j)}" title="Đánh dấu đáp án đúng (chọn được nhiều)">✓</button>${t.answer.layout === 'A4' ? esc('abcdefgh'[j] + '. ') : ''}${esc(String(o).replace(/<[^>]+>|\*/g, ''))}</span>`).join('')}</div>`;
    const anchor = e.querySelector('[data-k="it.' + i + '.opts"]'), host = anchor ? anchor.closest('.er2') : e.querySelector('[data-k="it.' + i + '.text"]');
    if (host) host.insertAdjacentHTML('afterend', row);
  });
  // v86: G2 (bài đọc / lời dẫn) có thanh B I U ___ {a|b} ¶ ở hàng tiêu đề, dính khi cuộn
  const g2l = R.querySelector('.sec[data-sec=g2] .ef > .elb');
  if (g2l && R.querySelector('.sec[data-sec=g2] [data-k="lead.text"]')) { g2l.classList.add('g2bar'); g2l.insertAdjacentHTML('beforeend', `<span class="g3tb" role="toolbar" aria-label="Chèn ký hiệu vào bài đọc">${TXB.passage.map(([n, a]) => `<button type="button" data-tx="${a}" title="${{ b: 'Đậm', i: 'Nghiêng', u: 'Gạch chân', gap: 'Chỗ trống', pick: 'Chọn trong câu', para: 'Sang đoạn mới' }[a]}: chèn vào ô đang gõ">${esc(n)}</button>`).join('')}</span>`); }
  const d = document.createElement('div'); d.appendChild(R.cloneNode(true)); return d.innerHTML;
};
// chiều cao thanh tiêu đề Task (đang dính) → vị trí dính của thanh B I U
treeEl.addEventListener('scroll', () => { const h = treeEl.querySelector('.tk.open>.tkh'); if (h) treeEl.style.setProperty('--tkh', Math.round(h.getBoundingClientRect().height) + 'px'); }, { passive: true });
treeEl.addEventListener('mousedown', e => { if (e.target.closest('.g3tb [data-tx]')) e.preventDefault(); }, true);
treeEl.addEventListener('click', e => { const b = e.target.closest('[data-eact="qbold"]'); if (!b) return; e.stopPropagation(); const id = b.closest('.ed').dataset.ed, v = !!b.dataset.v;
  if (!!(ws.tasks.find(x => x.id === id) || { layout: {} }).layout.qbold === v) return; commit(w => { const t = w.tasks.find(x => x.id === id); if (v) t.layout.qbold = true; else delete t.layout.qbold; }, v ? 'Chữ câu hỏi: Đậm' : 'Chữ câu hỏi: Bình thường'); }, true);   // giữ con trỏ trong ô đang gõ
treeEl.addEventListener('click', e => { const b = e.target.closest('.g3tb [data-tx]'); if (b) { e.stopPropagation(); txInsert(b.dataset.tx); } }, true);
const qm3 = (th, ou, ba) => qmEq(ou, ba) ? qmC(th) : ou;
function qmObj3(th, ou, ba) { const o = {}; new Set([...Object.keys(th || {}), ...Object.keys(ou || {}), ...Object.keys(ba || {})]).forEach(k => { const v = qm3((th || {})[k], (ou || {})[k], (ba || {})[k]); if (v !== undefined) o[k] = v; }); return o; }
window.__ws = { pick: s => pick(s), get ws() { return ws; }, get res() { return lastRes; }, get renders() { return renderCount; }, get sel() { return sel; }, get multi() { return multi; }, render, setZoom(z) { zoom = z; draw(); } };
// Độ rộng cột trái (#lsplit): React (src/ui/LeftSplit.tsx)
// Chờ font của phiếu tải xong rồi mới đo; font đổi sau đó thì đo lại.
const fontsReady = document.fonts
  ? Promise.all(['14pt Andika', 'bold 14pt Andika'].flatMap(f => [document.fonts.load(f), document.fonts.load(f, 'ăâđêôơưáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụýỳỷỹỵ'), document.fonts.load(f, 'ÀÁẠĐÊÔƠƯ')])).catch(() => {}).then(() => document.fonts.ready)
  : Promise.resolve();
fontsReady.then(() => { ready = true; render(); });
// Font nạp thêm nhóm ký tự giữa chừng: chỉ dàn lại trang, không dựng lại cột trái (đang gõ dở thì không mất chữ)
if (document.fonts) document.fonts.addEventListener('loadingdone', e => { if (ready && e.fontfaces.some(f => /Andika|Be Vietnam|Lexend/.test(f.family))) { const res = paginate(); lastRes = res; draw(); publish({ pages: res.pages.length, diags: res.diags.length }); } });
render();
