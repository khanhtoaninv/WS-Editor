// Đáp án đúng của từng câu (v88–v91): câu nào cần đáp án, đã có chưa. Hàm thuần, không đụng DOM
// (GĐ0 phiếu tương tác: chuyển từ legacy/app.js sang lõi để bộ liệt kê chỗ trả lời và bộ chấm dùng chung).
import { ck, isFreeW, its, pkGroups, pkSrc } from './model.js';
import { ans0, exPicks, keyGaps } from './layout.js';

// Khóa từng đáp án (ghi đè theo câu)
function itemKeys0(t) { const k = ck(t); if (k === 'table' || k === 'empty') return []; if (k === 'dialogue') return its(t).filter(x => (x.text || '').includes('___')).map(x => x.id); if (k === 'pairs') return its(t).filter(x => x.pair && x.pair.l).map(x => x.id); return its(t).map(x => x.id); }
// v81: dòng chữ giữa các câu (gt) không phải chỗ trả lời
export function itemKeys(t) { const g = new Set(its(t).filter(x => x.gt).map(x => x.id)); return itemKeys0(t).filter(id => !g.has(id)); }
// v86 (F2): một câu có thể có nhiều đáp án đúng, ghi "a, c" (hoặc chữ của lựa chọn, cách nhau dấu phẩy)
export function optsOfKey(t, x) { if (x.imgs) return x.imgs; if (x.opts) return x.opts; if (t.answer.layout === 'A6') return [...ans0(t, x).matchAll(/<span>([^<]*)<\/span>/g)].map(m => m[1]); return []; }
// v91: câu nhiều chỗ trống: key = đáp án từng chỗ, cách nhau " | "
export const gapN = x => (pkSrc(x).match(/___/g) || []).length;
// v88: câu nào cần đáp án đúng (trừ tô theo nét, viết tự do, bảng, dòng chữ), câu nào đã có
export function needKey(t, x) { if (!x || x.gt) return false; const k = ck(t), a = t.answer; if (['table', 'empty', 'trace'].includes(k) || ['none', 'trace'].includes(a.kind) || isFreeW(t)) return false; if (k === 'pairs') return !!(x.pair && x.pair.l && x.pair.r); if (k === 'dialogue') return !!x.ex || /___|\{[^{}|]+\|/.test(x.text || ''); return true; }
export function hasKey(t, x) { if (ck(t) === 'pairs') return !!t.content.shuffle; if (!x.opts && !x.imgs && gapN(x) > 1) { const g = keyGaps(x); return Array.from({ length: gapN(x) }, (_, j) => g[j] || '').every(Boolean); } const gs = x.opts || x.imgs ? [] : pkGroups(x); if (gs.length) return gs.every(g => g.some(o => o.ok)) || String(x.key ?? '').trim() !== ''; const op = optsOfKey(t, x); if ((x.opts || x.imgs || t.answer.layout === 'A6') && op.length > 1) return exPicks(t, x, op).length > 0; return String(x.key ?? '').trim() !== ''; }
export function keyState(t) { const need = [], miss = []; its(t).forEach((x, i) => { if (needKey(t, x)) { need.push(i); if (!hasKey(t, x)) miss.push(i); } }); return { need, miss }; }
