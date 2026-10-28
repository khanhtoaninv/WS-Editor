// GĐ1b: lớp làm bài trên bản sao trang của trình chiếu (docs/TUONG_TAC/KE_HOACH_GD1B.md).
// Ô gõ, phương án đang chọn, đường nối, xanh / đỏ đều nằm trong chính phần tử data-ans nên phóng, đổi kiểu xem tự đi theo.
// Bài làm dạng Answers của shared/ (cùng khuôn bài nộp ở 1c), chấm bằng gradeSlot. Không lưu.
import type { Answers, AnswerValue, Key, Slot, SlotResult, SlotStatus } from '../../../shared/src/index.ts';
import { capsule, lineBetween, optEls, optOfRow, rcEnds, rightRow, rowLabel } from './answers';

export type Kind = 'type' | 'pick' | 'link' | 'find';
export type Pend = { id: string } | { task: string; row: string };   // nối dở: đã bấm chấm trái (id) hoặc chấm phải (row = mã phương án của hàng)

const SEL = (id: string) => `[data-ans="${CSS.escape(id)}"]`;
export const elsOf = (root: ParentNode, id: string) => [...root.querySelectorAll<HTMLElement>(SEL(id))];

// cách làm một chỗ: gõ (chữ, ô bảng, ô chữ, ô nối viết chữ), bấm chọn, nối chấm
export function kindOf(s: Slot, els: HTMLElement[]): Kind | null {
  if (!els.length) return null;
  switch (s.interaction) {
    case 'text': case 'text-long': case 'cell': return 'type';
    case 'choice-one': case 'choice-many': case 'tf': return 'pick';
    case 'match': return els[0].classList.contains('mbx') ? 'type' : 'link';
    case 'find': return 'find';
    default: return null;
  }
}
// chọn nhiều thì bấm Chấm; riêng hàng tick trong bảng chỉ có một ô đúng thì chấm ngay như chọn một
export const needsGo = (s: Slot, key: Key) => s.interaction === 'choice-many' && !(s.id.includes('.cell.') && [].concat((key[s.id]?.correct ?? []) as never).length <= 1);

// phương án thứ mấy được bấm (-1: không trúng phương án nào)
export function pickIndex(els: HTMLElement[], target: Element) { return optEls(els).findIndex(o => o.contains(target)); }
export const picked = (v: AnswerValue | null | undefined): string[] => v == null || v === '' ? [] : ([] as string[]).concat(v);

// chữ hiện trong ô gõ: ô nối viết chữ lưu mã phương án, hiện chữ cái của hàng
export function shown(s: Slot, els: HTMLElement[], v: AnswerValue | null | undefined) {
  if (v == null) return '';
  if (s.interaction === 'match') {
    const o = (s.options || []).find(x => x.id === v), sec = els[0]?.closest<HTMLElement>('section.task'), r = o && sec ? rightRow(sec, o.id) : null;
    return r ? (rowLetters(sec!).get(r.mr) || String(v)) : String(v);
  }
  return Array.isArray(v) ? v.join(', ') : String(v);
}
// chữ cái của từng hàng vế phải: chữ người soạn ghi đầu hàng ("A. cold"); hàng không ghi thì a, b, c… theo thứ tự hàng
function rowLetters(sec: HTMLElement) {
  const rows = [...sec.querySelectorAll<HTMLElement>('.mrows > .mr:not(.mh)')].filter(m => (m.textContent || '').trim()), lab = rows.map(rowLabel), m = new Map<HTMLElement, string>();
  rows.forEach((r, i) => m.set(r, (lab.some(Boolean) ? lab[i] : String.fromCharCode(97 + i)).toUpperCase()));
  return m;
}
// chữ cái gõ vào ô nối → mã phương án của hàng có chữ cái đó (không có thì giữ nguyên chữ, chấm là sai)
export function letterToOpt(s: Slot, el: HTMLElement, ch: string) {
  const sec = el.closest<HTMLElement>('section.task'); if (!sec || !ch) return ch;
  const mr = [...rowLetters(sec)].find(([, l]) => l === ch.toUpperCase())?.[0];
  return (mr && optOfRow(s, mr)?.id) || ch;
}

const ST: Partial<Record<SlotStatus, [string, string, string]>> = {   // lớp, dấu, chú thích
  correct: ['vw-ok', '✓', 'Đúng'], wrong: ['vw-no', '✗', 'Sai: bấm để xem đáp án'], partial: ['vw-part', '½', 'Đúng một phần: bấm để xem đáp án'], pending: ['vw-man', '✎', 'Chấm tay'],
};
const CLS = ['vw-ok', 'vw-no', 'vw-part', 'vw-man', 'vw-sel', 'vw-pend', 'vwf', 'vwt', 'vwr'];

// v117: dấu / nút giống hệt lần vẽ trước thì giữ phần tử cũ (vẽ lại giữa lúc nhấn và nhả chuột không làm mất cú bấm)
let pool: Set<Element> | null = null;
function place(parent: HTMLElement, el: HTMLElement) {
  const h = el.outerHTML, old = pool && [...parent.children].find(c => pool!.has(c) && c.outerHTML === h);
  if (old) pool!.delete(old); else parent.appendChild(el);
}
function badge(el: HTMLElement, id: string, st: SlotStatus, tap: boolean, mj = false) {
  const d = ST[st]; if (!d || el.classList.contains('xc')) return;
  const b = document.createElement('em'); b.className = 'vwm ' + d[0] + (mj ? ' tap mj' : tap ? ' tap' : ''); b.dataset.vw = id; b.textContent = d[1];
  b.title = mj ? `Chấm tay: ${d[2].split(':')[0].toLowerCase()}. Bấm để chấm lại` : st === 'pending' && tap ? 'Chấm tay: bấm để xem bài mẫu' : d[2];
  el.classList.add('vwr'); place(el, b);
  if (st === 'pending') manButtons(el, id);
}

export type Hooks = { input: (id: string, el: HTMLInputElement | HTMLTextAreaElement, e: Event) => void; key: (id: string, el: HTMLInputElement | HTMLTextAreaElement, e: KeyboardEvent) => void; blur: (id: string, el: HTMLInputElement | HTMLTextAreaElement) => void };

// ô gõ đặt trong chính chỗ trả lời; giữ nguyên ô cũ (và chữ đang gõ, con trỏ) khi vẽ lại
function makeInput(id: string, hooks: { current: Hooks }, tag: 'input' | 'textarea', cls: string) {
  const el = document.createElement(tag);
  el.className = 'vwi' + cls; el.dataset.for = id; el.spellcheck = false; el.autocomplete = 'off';
  if (tag === 'input') (el as HTMLInputElement).type = 'text';
  el.setAttribute('aria-label', 'Trả lời');
  el.addEventListener('input', e => hooks.current.input(id, el, e));
  el.addEventListener('keydown', e => hooks.current.key(id, el, e as KeyboardEvent));
  el.addEventListener('blur', () => hooks.current.blur(id, el));
  return el;
}
function ensureInput(host: HTMLElement, id: string, hooks: { current: Hooks }) {
  let el = host.querySelector<HTMLInputElement | HTMLTextAreaElement>(':scope > .vwi');
  if (el) return el;
  const multi = host.classList.contains('a1');
  el = makeInput(id, hooks, multi ? 'textarea' : 'input', host.classList.contains('xc') ? ' vwx' : '');
  if (multi) el.dataset.ml = String(Math.max(1, host.querySelectorAll(':scope > .ln').length));
  host.appendChild(el);
  return el;
}

// v113: chữ dài hơn gạch thì gạch dài ra, tới hết bề ngang khối chứa (không tràn khỏi Task) rồi xuống dòng
// (ô một dòng đổi sang ô nhiều dòng, giữ chữ và con trỏ). Đo bằng cỡ chữ thật, chưa nhân tỉ lệ chiếu.
let cv: CanvasRenderingContext2D | null = null;
const textW = (el: HTMLElement, t: string) => { cv = cv || document.createElement('canvas').getContext('2d'); if (!cv) return 0; cv.font = getComputedStyle(el).font; return Math.max(0, ...t.split('\n').map(l => cv!.measureText(l).width)); };
function blockOf(h: HTMLElement) {
  for (let e = h.parentElement; e; e = e.parentElement) { if (!getComputedStyle(e).display.startsWith('inline')) return e; if (e.matches('section.task')) return e; }
  return null;
}
export function fitInput(el: HTMLInputElement | HTMLTextAreaElement, id: string, hooks: { current: Hooks }) {
  const h = el.parentElement; if (!h || el.dataset.ml || el.classList.contains('vwx')) return el;
  h.style.minWidth = ''; h.style.minHeight = '';
  if (!el.value) return el;
  const b = blockOf(h), cs = b ? getComputedStyle(b) : null, avail = b && cs ? b.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 4 : Infinity;
  const need = textW(el, el.value) + 12;
  if (need <= el.clientWidth + 1) return el;
  if (need <= avail) { h.style.minWidth = need + 'px'; return el; }
  h.style.minWidth = avail + 'px';
  let t = el;
  if (el.tagName === 'INPUT') {   // đổi sang ô nhiều dòng
    const a = makeInput(id, hooks, 'textarea', ' vwwrap'), pos = el.selectionStart ?? el.value.length, foc = document.activeElement === el;
    a.value = el.value; el.replaceWith(a); if (foc) { a.focus(); a.setSelectionRange(pos, pos); }
    t = a;
  }
  t.style.height = 'auto'; h.style.minHeight = t.scrollHeight + 'px'; t.style.height = '';
  return t;
}

export type WorkState = { ans: Answers; res: Record<string, SlotResult>; pend: Pend | null; shownIds: Set<string>; key: Key; man?: Record<string, 'ok' | 'no'> };

// v114 chấm tay: chỗ chờ chấm có hai nút ✓ / ✗; đã chấm tay thì dấu ✓ / ✗ bấm được để chấm lại
function manButtons(el: HTMLElement, id: string) {
  const g = document.createElement('span'); g.className = 'vmkg';
  for (const [v, t, ti] of [['ok', '✓', 'Chấm tay: đúng'], ['no', '✗', 'Chấm tay: sai']]) {
    const b = document.createElement('button'); b.className = 'vmk ' + v; b.dataset.mk = id; b.dataset.v = v; b.tabIndex = -1; b.textContent = t; b.title = ti; g.appendChild(b);
  }
  el.classList.add('vwr'); place(el, g);
}

// vẽ lớp làm bài lên phần đang xem (gọi sau applyAnswers mỗi lần vẽ)
export function applyWork(root: HTMLElement, slots: Slot[], w: WorkState, hooks: { current: Hooks }) {
  root.querySelectorAll('svg.vwl, svg.vwfd').forEach(e => e.remove());
  pool = new Set(root.querySelectorAll('.vwm, .vwgo, .vmkg'));
  root.querySelectorAll('.' + CLS.join(', .')).forEach(e => e.classList.remove(...CLS));
  for (const s of slots) {
    const els = elsOf(root, s.id), kind = kindOf(s, els); if (!kind) continue;
    const v = w.ans[s.id], r = w.res[s.id], st = r ? ST[r.status] : undefined, k = w.key[s.id];
    const mj = !!w.man?.[s.id] && !!r, tap = !!r && !mj && (r.status === 'wrong' || r.status === 'partial' || (r.status === 'pending' && !!k?.sample));
    if (kind === 'type') {
      const host = els[0], inp = ensureInput(host, s.id, hooks), txt = shown(s, els, v);
      host.classList.add('vwh');
      if (document.activeElement !== inp && inp.value !== txt) { inp.value = txt; fitInput(inp, s.id, hooks); }
      if (inp.value) host.classList.add('vwf');
      if (st) { host.classList.add(st[0]); badge(host, s.id, r!.status, tap, mj); }
      continue;
    }
    if (kind === 'pick') {
      const opts = optEls(els), sel = picked(v).map(id => (s.options || []).findIndex(o => o.id === id)).filter(j => j >= 0 && opts[j]);
      sel.forEach(j => { opts[j].classList.add('vw-sel'); if (opts[j].classList.contains('a5')) opts[j].classList.add('vwt'); if (st) opts[j].classList.add(st[0]); });
      if (st && sel.length) badge(opts[sel[sel.length - 1]], s.id, r!.status, tap, mj);
      if (!r && sel.length && needsGo(s, w.key)) {
        const at = opts[sel[sel.length - 1]].closest<HTMLElement>(SEL(s.id)) || els[0], b = document.createElement('button');
        b.className = 'vwgo'; b.dataset.vg = s.id; b.tabIndex = -1; b.textContent = 'Chấm'; b.title = 'Chấm câu này (Enter)';
        at.classList.add('vwr'); place(at, b);
      }
      continue;
    }
    if (kind === 'find') {   // v116 tìm từ: khung quanh từ đã kéo (xanh đúng / đỏ sai), từ trong khung từ tô theo
      const sec = els[0].closest<HTMLElement>('section.task'); if (!sec || v == null || !st) continue;
      const [a, b] = rcEnds(sec, String(v)); if (a && b) { const g = capsule(sec, a, b, 'vwfd ' + st[0].slice(3)); g.dataset.vw = s.id; }
      els[0].classList.add(st[0]); badge(els[0], s.id, r!.status, tap, mj);
      continue;
    }
    // nối chấm: chấm trái đang chờ, đường nối tô theo đúng / sai, bấm đường để gỡ
    const left = els[0], sec = left.closest<HTMLElement>('section.task'); if (!sec) continue;
    if (w.pend && 'id' in w.pend && w.pend.id === s.id) left.classList.add('vw-pend');
    const o = v != null ? (s.options || []).find(x => x.id === v) : undefined, rr = o ? rightRow(sec, o.id) : null;
    if (rr && rr.dot) {
      const svg = lineBetween(sec, left, rr.dot, 'vwl ' + (st ? st[0].slice(3) : 'sel'));   // lớp riêng: lớp vw-* tô nền cả khung
      svg.dataset.vw = s.id;
      const hitL = svg.firstElementChild!.cloneNode() as SVGLineElement; hitL.setAttribute('class', 'hit'); svg.appendChild(hitL);
      [left, rr.dot].forEach(d => d.classList.add(st ? st[0] : 'vw-sel'));
      if (st) badge(left, s.id, r!.status, tap, mj);
    }
  }
  if (w.pend && 'row' in w.pend) {
    const p = w.pend, sec = root.querySelector<HTMLElement>(`section.task[data-task="${CSS.escape(p.task)}"]`), rr = sec ? rightRow(sec, p.row) : null;
    if (rr) (rr.dot || rr.mr).classList.add('vw-pend');
  }
  pool.forEach(e => e.remove()); pool = null;
}

// ô chữ: ô kế tiếp theo hàng ngang (d = 1) hoặc theo cột (d = 'down'), lùi (-1 / 'up')
export function nextCell(el: HTMLElement, d: 1 | -1 | 'down' | 'up') {
  const g = el.parentElement; if (!g) return null;
  const kids = [...g.children] as HTMLElement[], i = kids.indexOf(el), n = parseInt(getComputedStyle(g).getPropertyValue('--xn')) || 1;
  const j = d === 1 ? i + 1 : d === -1 ? i - 1 : d === 'down' ? i + n : i - n;
  if ((d === 1 || d === -1) && Math.floor(j / n) !== Math.floor(i / n)) return null;
  const c = kids[j]; return c && c.classList.contains('xc') ? c : null;
}
