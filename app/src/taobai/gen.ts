// Module Tạo bài T1: dữ liệu ws.gen / task.gen (đặc tả mục 7, 9.1). Hàm thuần trên phiếu (JS object), gọi bên trong
// commit() của editor để có Hoàn tác. Bộ dàn trang không đọc "gen" (đường chuẩn không đổi); xuất MD / gói .wsp bỏ "gen".
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GEN_HISTORY_MAX } from '../../../shared/src/taobai/types.ts';

type W = any; type T = any;
const clone = <X,>(o: X): X => JSON.parse(JSON.stringify(o));

// ---------- dấu nội dung ----------
const SKIP = new Set(['gen', 'number', 'part']);          // number / part: số thứ tự app tự đánh khi dàn
function stable(v: any, top: boolean): string {
  if (v === null || typeof v !== 'object') return JSON.stringify(v === undefined ? null : v);
  if (Array.isArray(v)) return '[' + v.map(x => stable(x, false)).join(',') + ']';
  return '{' + Object.keys(v).filter(k => v[k] !== undefined && !(top && SKIP.has(k))).sort().map(k => JSON.stringify(k) + ':' + stable(v[k], false)).join(',') + '}';
}
/** Dấu nội dung + dàn trang của một Task (không tính gen). FNV-1a 32 bit ×2 cho đủ chắc. */
export function sigTask(t: T): string {
  const s = stable(t, true); let a = 0x811c9dc5, b = 0x01000193 ^ s.length;
  for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); a = Math.imul(a ^ c, 0x01000193); b = Math.imul(b ^ c, 0x5bd1e995) ^ (b >>> 13); }
  return (a >>> 0).toString(36) + '-' + (b >>> 0).toString(36);
}

// ---------- trạng thái ----------
export type Stat = 'wait' | 'warn' | 'todo' | 'ok';
export const hasGen = (w: W) => !!(w && w.gen && w.gen.v);
/** checks: danh sách tiêu chí hiện tại (máy kiểm + AI chấm); không đưa thì dùng task.gen.checks đã lưu. */
export function statusOf(t: T, checks?: { ok: boolean }[]): Stat | null {
  const g = t && t.gen; if (!g) return null;
  if (g.status === 'wait') return 'wait';
  if (g.approvedHash && g.approvedHash === sigTask(t)) return 'ok';
  return (checks || g.checks || []).some((c: any) => !c.ok) ? 'warn' : 'todo';
}
/** Đã duyệt rồi bị sửa / sinh lại (khác bản duyệt gần nhất). */
export const changedSince = (t: T) => !!(t.gen && t.gen.approvedHash && t.gen.approvedHash !== sigTask(t));
export const genTasks = (w: W) => (w.tasks || []).filter((t: T) => t.gen);
export function progress(w: W) { const a = genTasks(w); return { done: a.filter((t: T) => statusOf(t) === 'ok').length, total: a.length }; }
/** Bài chưa duyệt kế tiếp sau bài `fromId` (vòng lại từ đầu); null = mọi bài đã duyệt. */
export function nextTodo(w: W, fromId?: string | null): string | null {
  const a = genTasks(w), i = Math.max(-1, a.findIndex((t: T) => t.id === fromId));
  for (let k = 1; k <= a.length; k++) { const t = a[(i + k) % a.length]; if (statusOf(t) !== 'ok' && statusOf(t) !== 'wait') return t.id; }
  return null;
}

// ---------- giờ ----------
export function hhmm(iso: string, now = new Date()): string {
  const d = new Date(iso), p = (n: number) => String(n).padStart(2, '0'), t = `${p(d.getHours())}:${p(d.getMinutes())}`;
  return d.toDateString() === now.toDateString() ? t : `${t} ${p(d.getDate())}/${p(d.getMonth() + 1)}`;
}
const stamp = (w: W, hist: any[]) => { let at = new Date().toISOString(); while (hist.some(h => h.at === at)) at = new Date(Date.parse(at) + 1).toISOString(); return at; };   // giờ duyệt là khóa: không trùng

// ---------- bật chế độ tạo bài (lệnh ẩn T1: thử khi chưa có AI) ----------
export function enableGen(w: W) {
  if (hasGen(w)) return false;
  w.gen = { v: 1, src: { course: '', unit: '', lesson: '', topic: '', names: { lesson: w.title || 'Phiếu' }, ver: { kienThuc: '', trinhTu: '', tf: '', chung: {} } },
    structure: [], note: '', sheetChecks: [], history: [] };
  w.tasks.forEach((t: T, i: number) => { if (!t.gen) t.gen = { step: i + 1, role: '', status: 'todo', checks: [], history: [] }; });
  return true;
}
export function disableGen(w: W) { delete w.gen; (w.tasks || []).forEach((t: T) => delete t.gen); }

// ---------- duyệt + lịch sử (≤ 3 lần duyệt gần nhất) ----------
const snapTask = (t: T) => { const s = clone(t); if (s.gen) delete s.gen.history; return s; };
const snapSheet = (w: W) => { const s = clone(w); if (s.gen) delete s.gen.history; (s.tasks || []).forEach((t: T) => { if (t.gen) delete t.gen.history; }); return s; };
const push = (h: any[], x: any) => { h.push(x); while (h.length > GEN_HISTORY_MAX) h.shift(); };

export function approveTask(w: W, id: string, note?: string): boolean {
  const t = w.tasks.find((x: T) => x.id === id); if (!t || !t.gen) return false;
  const g = t.gen; g.history = g.history || [];
  const last = g.history[g.history.length - 1];
  const nt = note || (!g.history.length ? 'Duyệt lần đầu' : changedSince(t) ? `Đã sửa sau lần duyệt ${hhmm(last.at)}` : 'Duyệt lại');
  g.status = 'ok'; g.approvedHash = sigTask(t);
  push(g.history, { at: stamp(w, g.history), note: nt, snap: snapTask(t) });
  return true;
}
/** "Dùng bản này": thay bài bằng bản đã duyệt (giữ lịch sử hiện tại), trạng thái ✓. */
export function useTaskVer(w: W, id: string, at: string): boolean {
  const k = w.tasks.findIndex((x: T) => x.id === id); if (k < 0 || !w.tasks[k].gen) return false;
  const cur = w.tasks[k], h = (cur.gen.history || []).find((x: any) => x.at === at); if (!h) return false;
  const nt = clone(h.snap); nt.id = cur.id; nt.gen = Object.assign({}, nt.gen || {}, { history: cur.gen.history, status: 'ok' });
  nt.gen.approvedHash = sigTask(nt);
  w.tasks[k] = nt; return true;
}
/** Bản đang dùng của bài = bản duyệt có dấu nội dung trùng bài hiện tại. */
export const usedVer = (t: T): string | null => { if (!t.gen) return null; const s = sigTask(t), h = (t.gen.history || []).slice().reverse().find((x: any) => sigTask(x.snap) === s); return h ? h.at : null; };

export function approveSheet(w: W, note?: string): boolean {
  if (!hasGen(w)) return false;
  const p = progress(w), h = w.gen.history = w.gen.history || [];
  push(h, { at: stamp(w, h), note: note || `Duyệt phiếu · ${p.done}/${p.total} bài đã duyệt`, snap: snapSheet(w) });
  return true;
}
export const sheetVer = (w: W, at: string) => hasGen(w) ? (w.gen.history || []).find((x: any) => x.at === at) || null : null;
/** Khôi phục cả phiếu về một lần Duyệt phiếu (mọi bài + cài đặt phiếu); lịch sử phiếu / bài hiện có giữ nguyên. */
export function restoreSheet(w: W, at: string): boolean {
  const h = sheetVer(w, at); if (!h) return false;
  const n = clone(h.snap), byId: Record<string, any> = {};
  w.tasks.forEach((t: T) => { if (t.gen) byId[t.id] = t.gen.history || []; });
  n.gen = Object.assign({}, n.gen, { history: w.gen.history });
  n.tasks.forEach((t: T) => { if (t.gen) t.gen.history = byId[t.id] || []; });
  Object.keys(w).forEach(k => delete w[k]); Object.assign(w, n);
  return true;
}
/** Bản sao để xem (chỉ đọc) một lần Duyệt phiếu. */
export function viewCopy(w: W, at: string) { const h = sheetVer(w, at); return h ? clone(h.snap) : null; }

/** Gói .wsp / tệp gửi đi: không mang gen (lịch sử, kết quả chấm). */
export function stripGen(w: W) { const c = clone(w); delete c.gen; (c.tasks || []).forEach((t: T) => delete t.gen); return c; }
