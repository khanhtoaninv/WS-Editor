// GĐ1a B4: hiện đáp án ngay tại chỗ trả lời trên bản sao trang của trình chiếu (không đụng phiếu soạn).
// Vị trí lấy từ data-ans (GĐ0), đáp án từ key của sheetSlots. Phương án đúng tô bằng lớp `pk` sẵn có của phiếu
// (giống câu ví dụ đã in), thêm `vok` để biết chỗ nào do trình chiếu tô mà gỡ ra được.
import type { Key, Slot } from '../../../shared/src/index.ts';

const SEL = (id: string) => `[data-ans="${CSS.escape(id)}"]`;
const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();

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
function optEl(els: HTMLElement[], j: number) {
  if (els.length > 1) return els[j];
  const el = els[0]; if (!el) return null;
  const kids = el.querySelectorAll(':scope > .opt').length ? el.querySelectorAll(':scope > .opt') : el.querySelectorAll(':scope > b').length ? el.querySelectorAll(':scope > b') : el.querySelectorAll(':scope > span');
  return kids[j] || null;
}

function lineBetween(sec: HTMLElement, a: Element, b: Element) {
  const r = sec.getBoundingClientRect(), k = r.width / sec.offsetWidth || 1;
  const c = (e: Element) => { const q = e.getBoundingClientRect(); return [(q.left + q.width / 2 - r.left) / k, (q.top + q.height / 2 - r.top) / k]; };
  const [x1, y1] = c(a), [x2, y2] = c(b);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'vline');
  svg.innerHTML = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
  sec.appendChild(svg);
}

// bài nối: tìm vế phải có chữ của phương án đúng, nối chấm trái với chấm phải cùng hàng
function showMatch(root: HTMLElement, s: Slot, els: HTMLElement[], cid: string) {
  const o = (s.options || []).find(x => x.id === cid); if (!o) return;
  const left = els[0], sec = left.closest<HTMLElement>('section.task') || root;
  const mr = [...sec.querySelectorAll<HTMLElement>('.mr')].find(m => norm(m.textContent || '').endsWith(norm(String(o.text ?? ''))));
  if (left.classList.contains('mbx')) { putText(left, mr?.querySelector('i')?.textContent?.replace(/\W+$/, '') || String(o.text ?? '')); return; }
  const md = mr && mr.previousElementSibling, dots = md ? md.querySelectorAll('.a7') : null, right = dots && dots[dots.length - 1];
  if (right) lineBetween(sec, left, right); else putText(left, String(o.text ?? ''));
}

export function showSlot(root: HTMLElement, s: Slot, key: Key) {
  const els = [...root.querySelectorAll<HTMLElement>(SEL(s.id))]; if (!els.length) return;
  const k = key[s.id]; if (!k) return;
  if (s.interaction === 'match') { if (typeof k.correct === 'string') showMatch(root, s, els, k.correct); return; }
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
