// GĐ1a B5 bút vẽ: nét gắn với Task (mảnh Task trên trang) theo tọa độ trong Task, nên đổi Cả trang / Từng Task
// hay phóng to vẫn đúng chỗ. Nét ngoài mọi Task (lề trang) gắn với trang, chỉ hiện ở Cả trang.
export type Pt = [number, number];
export type Stroke = { t: 'pen' | 'hl' | 'line'; c: string; w: number; pts: Pt[] };
export type Ink = Record<string, Stroke[]>;     // khóa: "<task>#<mảnh>" hoặc "page#<chỉ số trang>"
export type Anchor = { key: string; x: number; y: number; w: number; h: number };   // vị trí trong vùng chiếu (chưa nhân tỉ lệ)

export const COLORS = [['#e53935', 'Đỏ'], ['#1e63d6', 'Xanh dương'], ['#2e9d4b', 'Xanh lá'], ['#222222', 'Đen']] as const;
export const WIDTHS = [[2.5, 'Mảnh'], [4.5, 'Vừa'], [8, 'Dày']] as const;
export const HL = 'rgba(255,213,0,.42)';

export function pathOf(s: Stroke) {
  const p = s.pts; if (!p.length) return '';
  if (p.length === 1) return `M${p[0][0]} ${p[0][1]}l.01 0`;
  return 'M' + p.map(q => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('L');
}

const segD = (p: Pt, a: Pt, b: Pt) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy, t = l ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l)) : 0;
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
};
// nét bị tẩy chạm vào (bán kính r, cùng hệ tọa độ)
export function hit(s: Stroke, p: Pt, r: number) {
  const q = s.pts, rr = r + s.w / 2;
  if (q.length === 1) return Math.hypot(p[0] - q[0][0], p[1] - q[0][1]) <= rr;
  for (let i = 1; i < q.length; i++) if (segD(p, q[i - 1], q[i]) <= rr) return true;
  return false;
}

// đường thẳng giữ Shift: khóa ngang hoặc dọc theo hướng kéo lệch nhiều hơn
export function lockLine(a: Pt, b: Pt): Pt { return Math.abs(b[0] - a[0]) >= Math.abs(b[1] - a[1]) ? [b[0], a[1]] : [a[0], b[1]]; }

// lưu trên máy theo phiếu; phiếu đã sửa (nội dung khác) thì bỏ nét cũ
const LS = (name: string) => 'wsShow.ink:' + name;
export function loadInk(name: string, hash: string): { ink: Ink; dropped: boolean } {
  try {
    const raw = localStorage.getItem(LS(name)); if (!raw) return { ink: {}, dropped: false };
    const o = JSON.parse(raw);
    if (o && o.hash === hash && o.ink && typeof o.ink === 'object') return { ink: o.ink, dropped: false };
    return { ink: {}, dropped: !!(o && o.ink && Object.values(o.ink).some((a: unknown) => Array.isArray(a) && a.length)) };
  } catch (_) { return { ink: {}, dropped: false }; }
}
export function saveInk(name: string, hash: string, ink: Ink) {
  try {
    const empty = !Object.values(ink).some(a => a.length);
    if (empty) localStorage.removeItem(LS(name)); else localStorage.setItem(LS(name), JSON.stringify({ hash, ink }));
    return true;
  } catch (_) { return false; }
}
