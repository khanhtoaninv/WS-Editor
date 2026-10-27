// GĐ1b: lớp làm bài trên bản sao trang của trình chiếu (docs/TUONG_TAC/KE_HOACH_GD1B.md).
// Ô gõ, phương án đang chọn, đường nối, xanh / đỏ đều nằm trong chính phần tử data-ans nên phóng, đổi kiểu xem tự đi theo.
// Bài làm dạng Answers của shared/ (cùng khuôn bài nộp ở 1c), chấm bằng gradeSlot. Không lưu.
import type { Answers, AnswerValue, Key, Slot, SlotResult, SlotStatus } from '../../../shared/src/index.ts';
import { lineBetween, optEls, optOfRow, rightRow, rowLabel } from './answers';

export type Kind = 'type' | 'pick' | 'link';
export type Pend = { id: string } | { task: string; row: string };   // nối dở: đã bấm chấm trái (id) hoặc chấm phải (chữ của hàng)

const SEL = (id: string) => `[data-ans="${CSS.escape(id)}"]`;
export const elsOf = (root: ParentNode, id: string) => [...root.querySelectorAll<HTMLElement>(SEL(id))];

// cách làm một chỗ: gõ (chữ, ô bảng, ô chữ, ô nối viết chữ), bấm chọn, nối chấm
export function kindOf(s: Slot, els: HTMLElement[]): Kind | null {
  if (!els.length) return null;
  switch (s.interaction) {
    case 'text': case 'text-long': case 'cell': return 'type';
    case 'choice-one': case 'choice-many': case 'tf': return 'pick';
    case 'match': return els[0].classList.contains('mbx') ? 'type' : 'link';
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
    const o = (s.options || []).find(x => x.id === v), sec = els[0]?.closest<HTMLElement>('section.task'), r = o && sec ? rightRow(sec, String(o.text ?? '')) : null;
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

function badge(el: HTMLElement, id: string, st: SlotStatus, tap: boolean) {
  const d = ST[st]; if (!d || el.classList.contains('xc')) return;
  const b = document.createElement('em'); b.className = 'vwm ' + d[0] + (tap ? ' tap' : ''); b.dataset.vw = id; b.textContent = d[1];
  b.title = st === 'pending' && tap ? 'Chấm tay: bấm để xem bài mẫu' : d[2];
  el.classList.add('vwr'); el.appendChild(b);
}

export type Hooks = { input: (id: string, el: HTMLInputElement | HTMLTextAreaElement, e: Event) => void; key: (id: string, el: HTMLInputElement | HTMLTextAreaElement, e: KeyboardEvent) => void; blur: (id: string, el: HTMLInputElement | HTMLTextAreaElement) => void };

// ô gõ đặt trong chính chỗ trả lời; giữ nguyên ô cũ (và chữ đang gõ, con trỏ) khi vẽ lại
function ensureInput(host: HTMLElement, id: string, hooks: { current: Hooks }) {
  let el = host.querySelector<HTMLInputElement | HTMLTextAreaElement>(':scope > .vwi');
  if (el) return el;
  const multi = host.classList.contains('a1');
  el = document.createElement(multi ? 'textarea' : 'input');
  el.className = 'vwi' + (host.classList.contains('xc') ? ' vwx' : '');
  el.dataset.for = id; el.spellcheck = false; el.autocomplete = 'off';
  if (!multi) (el as HTMLInputElement).type = 'text';
  if (multi) el.dataset.ml = String(Math.max(1, host.querySelectorAll(':scope > .ln').length));
  el.setAttribute('aria-label', 'Trả lời');
  el.addEventListener('input', e => hooks.current.input(id, el!, e));
  el.addEventListener('keydown', e => hooks.current.key(id, el!, e as KeyboardEvent));
  el.addEventListener('blur', () => hooks.current.blur(id, el!));
  host.appendChild(el);
  return el;
}

export type WorkState = { ans: Answers; res: Record<string, SlotResult>; pend: Pend | null; shownIds: Set<string>; key: Key };

// vẽ lớp làm bài lên phần đang xem (gọi sau applyAnswers mỗi lần vẽ)
export function applyWork(root: HTMLElement, slots: Slot[], w: WorkState, hooks: { current: Hooks }) {
  root.querySelectorAll('.vwm, .vwgo, svg.vwl').forEach(e => e.remove());
  root.querySelectorAll('.' + CLS.join(', .')).forEach(e => e.classList.remove(...CLS));
  for (const s of slots) {
    const els = elsOf(root, s.id), kind = kindOf(s, els); if (!kind) continue;
    const v = w.ans[s.id], r = w.res[s.id], st = r ? ST[r.status] : undefined, k = w.key[s.id];
    const tap = !!r && (r.status === 'wrong' || r.status === 'partial' || (r.status === 'pending' && !!k?.sample));
    if (kind === 'type') {
      const host = els[0], inp = ensureInput(host, s.id, hooks), txt = shown(s, els, v);
      host.classList.add('vwh');
      if (document.activeElement !== inp && inp.value !== txt) inp.value = txt;
      if (inp.value) host.classList.add('vwf');
      if (st) { host.classList.add(st[0]); badge(host, s.id, r!.status, tap); }
      continue;
    }
    if (kind === 'pick') {
      const opts = optEls(els), sel = picked(v).map(id => (s.options || []).findIndex(o => o.id === id)).filter(j => j >= 0 && opts[j]);
      sel.forEach(j => { opts[j].classList.add('vw-sel'); if (opts[j].classList.contains('a5')) opts[j].classList.add('vwt'); if (st) opts[j].classList.add(st[0]); });
      if (st && sel.length) badge(opts[sel[sel.length - 1]], s.id, r!.status, tap);
      if (!r && sel.length && needsGo(s, w.key)) {
        const at = opts[sel[sel.length - 1]].closest<HTMLElement>(SEL(s.id)) || els[0], b = document.createElement('button');
        b.className = 'vwgo'; b.dataset.vg = s.id; b.tabIndex = -1; b.textContent = 'Chấm'; b.title = 'Chấm câu này (Enter)';
        at.classList.add('vwr'); at.appendChild(b);
      }
      continue;
    }
    // nối chấm: chấm trái đang chờ, đường nối tô theo đúng / sai, bấm đường để gỡ
    const left = els[0], sec = left.closest<HTMLElement>('section.task'); if (!sec) continue;
    if (w.pend && 'id' in w.pend && w.pend.id === s.id) left.classList.add('vw-pend');
    const o = v != null ? (s.options || []).find(x => x.id === v) : undefined, rr = o ? rightRow(sec, String(o.text ?? '')) : null;
    if (rr && rr.dot) {
      const svg = lineBetween(sec, left, rr.dot, 'vwl ' + (st ? st[0].slice(3) : 'sel'));   // lớp riêng: lớp vw-* tô nền cả khung
      svg.dataset.vw = s.id;
      const hitL = svg.firstElementChild!.cloneNode() as SVGLineElement; hitL.setAttribute('class', 'hit'); svg.appendChild(hitL);
      [left, rr.dot].forEach(d => d.classList.add(st ? st[0] : 'vw-sel'));
      if (st) badge(left, s.id, r!.status, tap);
    }
  }
  if (w.pend && 'row' in w.pend) {
    const p = w.pend, sec = root.querySelector<HTMLElement>(`section.task[data-task="${CSS.escape(p.task)}"]`), rr = sec ? rightRow(sec, p.row) : null;
    if (rr) (rr.dot || rr.mr).classList.add('vw-pend');
  }
}

// ô chữ: ô kế tiếp theo hàng ngang (d = 1) hoặc theo cột (d = 'down'), lùi (-1 / 'up')
export function nextCell(el: HTMLElement, d: 1 | -1 | 'down' | 'up') {
  const g = el.parentElement; if (!g) return null;
  const kids = [...g.children] as HTMLElement[], i = kids.indexOf(el), n = parseInt(getComputedStyle(g).getPropertyValue('--xn')) || 1;
  const j = d === 1 ? i + 1 : d === -1 ? i - 1 : d === 'down' ? i + n : i - n;
  if ((d === 1 || d === -1) && Math.floor(j / n) !== Math.floor(i / n)) return null;
  const c = kids[j]; return c && c.classList.contains('xc') ? c : null;
}
