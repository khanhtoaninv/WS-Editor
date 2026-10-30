// Module Tạo bài T2: MÁY KIỂM (đặc tả mục 6.1 phần "Máy kiểm", 6.2 phần đo được bằng code). Chạy trên phiếu đang mở,
// mỗi lần vẽ lại (rẻ, không lưu vào phiếu nên không làm bẩn Hoàn tác). Kết quả AI chấm (T5) nằm trong task.gen.checks,
// nhóm 'ai', được ghép vào cùng danh sách.
// Đặt ở app (không ở shared như kế hoạch): cần mô hình phiếu của app (its, qOf, taskSlots), vốn chỉ chạy trong trình duyệt.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { its, ck, isFreeW } from '../core/model.js';
import { qOf } from '../core/layout.js';
import { taskSlots } from '../core/slots.js';
import { L } from '../ui/legacyApi';

export type Check = { id: string; group: 'may' | 'ai'; name: string; ok: boolean; why?: string; items?: number[]; ids?: string[] };
export const NAME: Record<string, string> = {
  doc: 'MD đọc được, không lỗi', dang: 'Đúng dạng câu hỏi', dapan: 'Mỗi câu có đáp án',
  duynhat: 'Đáp án duy nhất', trung: 'Không trùng câu trong bài', tran: 'Không tràn trang',
  s_lap: 'Các bài không lặp câu', s_tran: 'Không Task nào tràn trang',
};
// chuẩn hóa để so câu: giữ chữ các vế {a|b} và chỗ trống (hai câu khác nhau chỉ ở chỗ cần làm không được coi là trùng)
const norm = (s: any) => String(s || '').replace(/<[^>]+>|\*\*/g, ' ').replace(/\{([^}]*)\}/g, (_m, g) => ' ' + g.replace(/\*/g, '').replace(/\|/g, ' ') + ' ').replace(/_{2,}/g, ' qgap ').replace(/\*/g, ' ').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const realItems = (t: any) => its(t).filter((x: any) => !x.ex && !x.gt);
const textOf = (x: any) => x.pair ? [x.pair.l?.text, x.pair.r?.text].filter(Boolean).join(' - ') : [x.text, ...(x.lines || [])].filter(Boolean).join(' ');
const mk = (id: string, ok: boolean, why?: string, items?: number[], ids?: string[]): Check => ({ id, group: 'may', name: NAME[id], ok, ...(ok ? {} : { why }), ...(items && items.length ? { items } : {}), ...(ids && ids.length ? { ids } : {}) });
const list = (n: number[]) => n.length > 4 ? `${n.slice(0, 4).join(', ')}…` : n.join(', ');

/** Số câu thật của bài (Q12: số dòng viết). */
export function countOf(t: any): number {
  if (qOf(t) === 'Q12' || isFreeW(t)) return Math.max(1, (t.answer?.params?.lines) || 1);
  if (ck(t) === 'table') return (t.content.rows || []).length;
  return realItems(t).length;
}

/** Tiêu chí máy cho một bài. Tiêu chí không áp dụng cho dạng bài thì không có trong danh sách. */
export function checkTask(t: any): Check[] {
  const out: Check[] = [], g = t.gen || {}, q = qOf(t), it = realItems(t), num = (x: any) => it.indexOf(x) + 1;
  if (g.mdNotes && g.mdNotes.length) out.push(mk('doc', false, g.mdNotes.slice(0, 3).join(' · ')));
  else if (g.md) out.push(mk('doc', true));
  if (g.q) out.push(mk('dang', g.q === q, `cấu trúc là ${g.q}, bài đang là ${q}`));
  // đáp án: chỗ trả lời không có đáp án (bài viết tự do, tô chữ: không áp dụng)
  const free = q === 'Q12' || q === 'Q9' || isFreeW(t) || t.answer?.kind === 'none';
  let r: any = null; try { r = taskSlots(t); } catch (_) { r = null; }
  if (!free && r && r.slots.length) {
    const miss = r.slots.filter((s: any) => (r.key[s.id] || {}).grading === 'manual');
    const ids = [...new Set(miss.map((s: any) => s.item).filter(Boolean))] as string[], ns = ids.map(id => num(it.find((x: any) => x.id === id))).filter(n => n > 0);
    out.push(mk('dapan', !miss.length, `${miss.length} chỗ chưa có đáp án${ns.length ? ` (câu ${list(ns)})` : ''}`, ns, ids));
  }
  // đáp án duy nhất: phần kiểm được bằng code, theo dạng
  if (q === 'Q4') {
    const bad = it.filter((x: any) => (String(x.text || '').match(/\{[^{}]*\}/g) || []).some(m => (m.match(/(^\{|\|)\s*\*/g) || []).length > 1));
    out.push(mk('duynhat', !bad.length, `câu ${list(bad.map(num))}: một ngoặc {…} có hơn một vế đánh dấu *`, bad.map(num), bad.map((x: any) => x.id)));
  } else if (q === 'Q8') {
    const seen: Record<string, any[]> = {}; it.forEach((x: any) => { const k = norm(x.pair?.r?.text); if (k) (seen[k] = seen[k] || []).push(x); });
    const bad = Object.values(seen).filter(a => a.length > 1).flat();
    out.push(mk('duynhat', !bad.length, `vế phải trùng nhau ở câu ${list(bad.map(num))}: học sinh không biết ghép vế nào`, bad.map(num), bad.map((x: any) => x.id)));
  } else if (q === 'Q1' && t.wordBank && t.wordBank.kind !== 'image' && (t.wordBank.words || []).length) {
    const bank = new Set(t.wordBank.words.map(norm));
    const bad = it.filter((x: any) => x.key != null && String(x.key).split('|').some(p => norm(p) && !bank.has(norm(p))));
    out.push(mk('duynhat', !bad.length, `đáp án câu ${list(bad.map(num))} không có trong khung từ`, bad.map(num), bad.map((x: any) => x.id)));
  } else if (q === 'Q5' && r && r.slots.length >= 4) {
    const c: Record<string, number> = {}; r.slots.forEach((s: any) => { const k = r.key[s.id]; if (k && k.correct != null) c[String(k.correct)] = (c[String(k.correct)] || 0) + 1; });
    const v = Object.values(c), n = r.slots.length, lo = v.length < 2 ? 0 : Math.min(...v), need = Math.round(n * 0.3);
    out.push(mk('duynhat', lo >= need, `tỉ lệ đúng / sai lệch quá (${v.length < 2 ? `${n}/0` : `${Math.max(...v)}/${lo}`}): nên ít nhất ${need} câu mỗi loại`));
  }
  // trùng câu trong bài
  const seen: Record<string, any[]> = {}; it.forEach((x: any) => { const k = norm(textOf(x)); if (k.length > 3) (seen[k] = seen[k] || []).push(x); });
  const dup = Object.values(seen).filter(a => a.length > 1).flat();
  if (it.length > 1) out.push(mk('trung', !dup.length, `câu ${list(dup.map(num))} trùng nhau`, dup.map(num), dup.map((x: any) => x.id)));
  const res = L.lastRes, over = !!(res && (res.diags || []).some((d: any) => d.id === t.id));
  if (res) out.push(mk('tran', !over, 'bài tràn trang (cao hơn một trang và không cắt được)'));
  return out;
}

/** Tiêu chí cả phiếu đo được bằng code. */
export function checkSheet(w: any): Check[] {
  const out: Check[] = [], res = L.lastRes;
  const where: Record<string, Set<number>> = {}, txt: Record<string, string> = {}, gt = (w.tasks || []).filter((t: any) => t.gen);
  gt.forEach((t: any, i: number) => realItems(t).forEach((x: any) => { const k = norm(textOf(x)); if (k.length > 8) { (where[k] = where[k] || new Set()).add(i + 1); txt[k] = txt[k] || String(textOf(x)).replace(/<[^>]+>|\*\*/g, ''); } }));
  const lap = Object.entries(where).filter(([, s]) => s.size > 1);
  out.push(mk('s_lap', !lap.length, lap.slice(0, 2).map(([k, s]) => { const t0 = txt[k]; return `“${t0.slice(0, 40)}${t0.length > 40 ? '…' : ''}” ở bài ${[...s].join(', ')}`; }).join(' · ')));
  if (res) { const d = (res.diags || []).length; out.push(mk('s_tran', !d, `${d} chỗ tràn trang`)); }
  return out;
}

/** Máy kiểm + kết quả AI chấm đã lưu (T5). */
export function allChecks(t: any): Check[] {
  const ai = ((t.gen && t.gen.checks) || []).filter((c: any) => c.group === 'ai').map((c: any) => ({ name: NAME[c.id] || c.name || c.id, ...c }));
  return [...checkTask(t), ...ai];
}
export function allSheetChecks(w: any): Check[] {
  const ai = ((w.gen && w.gen.sheetChecks) || []).filter((c: any) => c.group === 'ai').map((c: any) => ({ name: NAME[c.id] || c.name || c.id, ...c }));
  return [...checkSheet(w), ...ai];
}
