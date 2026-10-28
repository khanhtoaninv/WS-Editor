// GĐ1a B4: hiện đáp án ngay tại chỗ trả lời trên bản sao trang của trình chiếu (không đụng phiếu soạn).
// Vị trí lấy từ data-ans (GĐ0), đáp án từ key của sheetSlots. Phương án đúng tô bằng lớp `pk` sẵn có của phiếu
// (giống câu ví dụ đã in), thêm `vok` để biết chỗ nào do trình chiếu tô mà gỡ ra được.
import type { Key, Slot } from '../../../shared/src/index.ts';

const SEL = (id: string) => `[data-ans="${CSS.escape(id)}"]`;

// chữ đáp án hiện trên phiếu: cách viết đầu tiên, hoặc bài mẫu
export function ansText(k: Key[string] | undefined) {
  if (!k) return null;
  if (k.accept && k.accept.length) return k.accept[0];
  if (k.sample) return k.sample;
  return null;
}
export const hasAns = (s: Slot, key: Key) => { const k = key[s.id]; return !!k && (k.correct != null || !!ansText(k)); };

// gỡ mọi thứ trình chiếu đã thêm
export function clearAnswers(root: HTMLElement) {
  root.querySelectorAll('.vans').forEach(e => e.remove());
  root.querySelectorAll('svg.vline').forEach(e => e.remove());
  root.querySelectorAll('.vok').forEach(e => e.classList.remove('vok', 'pk'));
  root.querySelectorAll('.vrel').forEach(e => e.classList.remove('vrel'));
}

function putText(el: HTMLElement, text: string) {
  const sp = document.createElement('span'); sp.className = 'vans'; sp.textContent = text;
  if (el.classList.contains('pgap')) { sp.classList.add('vin'); el.appendChild(sp); return; }   // chỗ trống bài đọc: viết tiếp sau (1)
  const ln = el.querySelector<HTMLElement>('.ln');                                             // dòng kẻ viết câu: viết trên dòng đầu
  const host = ln || el;
  if (getComputedStyle(host).position === 'static') host.classList.add('vrel');
  host.appendChild(sp);
}
function mark(el: Element | null | undefined) { if (el && !el.classList.contains('pk')) el.classList.add('pk', 'vok'); }

// phương án thứ j của một chỗ chọn: nhiều phần tử cùng mã (ô tick ảnh, gạch chân A–D, hàng tick bảng) = phần tử thứ j;
// một phần tử = con thứ j (.opt của A/B/C, <b> của {a|b}, nhãn T/F)
export function optEls(els: HTMLElement[]): HTMLElement[] {
  if (els.length !== 1) return els;
  for (const q of [':scope > .opt', ':scope > b', ':scope > span:not(.vans)']) { const k = els[0].querySelectorAll<HTMLElement>(q); if (k.length) return [...k]; }
  return els;
}
const optEl = (els: HTMLElement[], j: number) => optEls(els)[j] || null;

export function lineBetween(sec: HTMLElement, a: Element, b: Element, cls = 'vline') {
  const r = sec.getBoundingClientRect(), k = r.width / sec.offsetWidth || 1;
  const c = (e: Element) => { const q = e.getBoundingClientRect(); return [(q.left + q.width / 2 - r.left) / k, (q.top + q.height / 2 - r.top) / k]; };
  const [x1, y1] = c(a), [x2, y2] = c(b);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', cls);
  svg.innerHTML = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
  sec.appendChild(svg); return svg;
}

// v116 tìm từ: khung bo góc (viên thuốc) quanh từ, từ ô a tới ô b của lưới; cls: vline (đáp án) / vwf (bài làm)
export function capsule(sec: HTMLElement, a: Element, b: Element, cls: string) {
  sec = a.closest<HTMLElement>('section.task') || sec;   // lưới bị cắt sang mảnh sau: vẽ trong mảnh chứa chữ đầu
  const r = sec.getBoundingClientRect(), k = r.width / sec.offsetWidth || 1;
  const c = (e: Element) => { const q = e.getBoundingClientRect(); return [(q.left + q.width / 2 - r.left) / k, (q.top + q.height / 2 - r.top) / k]; };
  const [x1, y1] = c(a), [x2, y2] = c(b), h = Math.min((a as HTMLElement).offsetHeight, (a as HTMLElement).offsetWidth) * .82, len = Math.hypot(x2 - x1, y2 - y1), ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', cls);
  svg.innerHTML = `<rect x="${x1 - h / 2}" y="${y1 - h / 2}" width="${len + h}" height="${h}" rx="${h / 2}" transform="rotate(${ang} ${x1} ${y1})" />`;
  sec.appendChild(svg); return svg;
}
// ô (r, c) của lưới tìm từ, tìm trong mọi mảnh của Task (lưới dài có thể bị cắt sang trang / mảnh sau)
export const rcCell = (sec: HTMLElement, x: string) => { if (!x) return null; const root = sec.closest('.vsurf') || sec.parentElement || sec;
  return root.querySelector(`section.task[data-task="${CSS.escape(sec.dataset.task || '')}"] [data-rc="${CSS.escape(x)}"]`); };
export const rcEnds = (sec: HTMLElement, v: string) => { const [a, b] = String(v).split('-'); return [rcCell(sec, a), rcCell(sec, b)] as const; };

// vế phải của một phương án nối: hàng .mr mang mã phương án (data-opt, v113: theo mã, không theo chữ, vì hai vế phải có thể trùng chữ),
// chấm phải của hàng đó, chữ cái nhãn
export function rightRow(sec: HTMLElement, opt: string) {
  if (!opt) return null;
  const mr = sec.querySelector<HTMLElement>(`.mr[data-opt="${CSS.escape(opt)}"]`); if (!mr) return null;
  const md = mr.previousElementSibling, dots = md ? md.querySelectorAll<HTMLElement>(':scope > .a7:not([data-ans])') : null;
  return { mr, dot: dots && dots.length ? dots[dots.length - 1] : null, letter: rowLabel(mr) };
}
// chữ cái đầu hàng vế phải do người soạn ghi ("A. cold", "b) small"); không có thì ''
export const rowLabel = (mr: HTMLElement) => ((mr.textContent || '').match(/^\s*([A-Za-z0-9]{1,2})[.)]\s/) || [])[1] || '';
// phương án của một hàng vế phải (ngược với rightRow)
export function optOfRow(s: Slot, mr: HTMLElement) {
  const id = mr.dataset.opt; return (id && (s.options || []).find(o => o.id === id)) || null;
}

// bài nối: nối chấm trái với chấm phải của hàng có phương án đúng (ô nối viết chữ: chữ cái của hàng đó)
function showMatch(root: HTMLElement, s: Slot, els: HTMLElement[], cid: string) {
  const o = (s.options || []).find(x => x.id === cid); if (!o) return;
  const left = els[0], sec = left.closest<HTMLElement>('section.task') || root, r = rightRow(sec, o.id);
  if (left.classList.contains('mbx')) { putText(left, r?.letter || String(o.text ?? '')); return; }
  if (r && r.dot) lineBetween(sec, left, r.dot); else putText(left, String(o.text ?? ''));
}

export function showSlot(root: HTMLElement, s: Slot, key: Key) {
  const els = [...root.querySelectorAll<HTMLElement>(SEL(s.id))]; if (!els.length) return;
  const k = key[s.id]; if (!k) return;
  if (s.interaction === 'match') { if (typeof k.correct === 'string') showMatch(root, s, els, k.correct); return; }
  if (s.interaction === 'find') { const sec = els[0].closest<HTMLElement>('section.task'), [a, b] = sec ? rcEnds(sec, String(k.correct)) : [null, null]; if (sec && a && b) capsule(sec, a, b, 'vline vcap'); mark(els[0]); return; }
  if (k.correct != null) {
    const ids = ([] as string[]).concat(k.correct as string | string[]);
    ids.forEach(id => mark(optEl(els, (s.options || []).findIndex(o => o.id === id))));
    return;
  }
  const t = ansText(k); if (t) putText(els[0], t);
}

export function applyAnswers(root: HTMLElement, slots: Slot[], key: Key, shown: Set<string>) {
  clearAnswers(root);
  for (const s of slots) if (shown.has(s.id)) showSlot(root, s, key);
}

// các chỗ có trên phần đang xem, theo thứ tự trên trang (để hiện lần lượt)
export function slotsInView(root: HTMLElement) {
  const seen = new Set<string>(), out: string[] = [];
  root.querySelectorAll<HTMLElement>('[data-ans]').forEach(e => { const id = e.dataset.ans!; if (!seen.has(id)) { seen.add(id); out.push(id); } });
  return out;
}
