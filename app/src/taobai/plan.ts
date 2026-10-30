// Module Tạo bài T3: cấu trúc bài ở màn Ra đề (đặc tả 4.2) — hàm thuần, không giao diện.
//   - mặc định mỗi bước 1 bài, dạng Q chọn ngẫu nhiên trong danh sách được phép, số câu ngẫu nhiên trong khoảng
//   - không hai bài liền nhau cùng Q (khi còn dạng khác để chọn); ưu tiên khác dạng của phiếu gần nhất cùng lesson
//   - v130: CHỈ phần đề xuất đầu tiên theo Trình tự; sau đó giáo viên tự quyết: không giới hạn số bài mỗi bước, xóa được mọi bài,
//     dạng Q bất kỳ (12 dạng), số câu bất kỳ 1–MAX_N, thêm "yêu cầu riêng" cho từng bài, và nhóm cuối "Bài tự do" (không thuộc bước nào)
// Và dựng MD "bài giả" (chữ xxx) theo dạng Q + số câu: dùng cho layout sơ bộ và phiếu khung khi bấm Sinh bài.
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Buoc, QCode, TrinhTu, Tf, GenStructItem } from '../../../shared/src/taobai/types.ts';

export type PTask = { q: QCode; n: number; yc?: string };     // yc: yêu cầu riêng của giáo viên cho bài này
export const ALL_Q: QCode[] = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12'];
export const MAX_N = 50;
/** Nhóm cuối của cấu trúc: bài tự do, không thuộc bước nào của Trình tự (step = 0). */
export const TU_DO: Buoc = { so: 0, ten: 'Bài tự do', vaiTro: '', q: ALL_Q, min: 1, max: 10, batBuoc: false, toiDa: 99, chiTiet: '', them: '' };
/** Danh sách bước + nhóm bài tự do ở cuối (idempotent). */
export const ext = (steps: Buoc[]): Buoc[] => steps.length && steps[steps.length - 1].so === 0 ? steps : [...steps, TU_DO];
export type Plan = PTask[][];                     // mỗi bước một mảng bài
export type Rnd = () => number;
export const rnd: Rnd = () => { const f = (globalThis as any).__tbRand; return typeof f === 'function' ? f() : Math.random(); };   // test gắn __tbRand để cố định

const pickFrom = <X,>(a: X[], r: Rnd) => a[Math.min(a.length - 1, Math.floor(r() * a.length))];
const randN = (b: Buoc, r: Rnd) => b.min + Math.floor(r() * (b.max - b.min + 1));
/** Chọn Q trong danh sách được phép: tránh `not` (bài liền kề), ưu tiên tránh `soft` (phiếu gần nhất); hết lựa chọn thì nới. */
export function pickQ(allow: QCode[], not: (QCode | undefined)[], soft: QCode[] = [], r: Rnd = rnd): QCode {
  const hard = allow.filter(q => !not.includes(q)), pool = hard.length ? hard : allow;
  const pref = pool.filter(q => !soft.includes(q));
  return pickFrom(pref.length ? pref : pool, r);
}

/** Danh sách phẳng (số thứ tự chung) ↔ vị trí (bước, bài). */
export const flat = (p: Plan) => p.flatMap((ts, si) => ts.map((t, ti) => ({ si, ti, q: t.q, n: t.n })));
const neighbors = (p: Plan, si: number, ti: number) => { const f = flat(p), k = f.findIndex(x => x.si === si && x.ti === ti); return [f[k - 1]?.q, f[k + 1]?.q]; };

/** Đề xuất cấu trúc. last: dạng Q của phiếu gần nhất cùng lesson, theo bước (để ưu tiên khác đi). */
export function propose(steps: Buoc[], last: QCode[][] = [], r: Rnd = rnd): Plan {
  let prev: QCode | undefined;
  return [...steps.map((b, i) => { const q = pickQ(b.q, [prev], last[i] || [], r); prev = q; return [{ q, n: randN(b, r) }]; }), []];
}
export function reroll(p: Plan, steps: Buoc[], si: number, ti: number, r: Rnd = rnd): Plan {
  const n = p.map(x => x.map(y => ({ ...y }))), cur = n[si][ti];
  const nb = neighbors(n, si, ti), others = ext(steps)[si].q.filter(q => q !== cur.q);
  cur.q = others.length ? pickQ(others, nb, [], r) : cur.q; return n;
}
// v130: không còn giới hạn cứng (toiDa, bắt buộc, min–max chỉ là gợi ý của Trình tự): giáo viên tự quyết
export const canAdd = (_p?: Plan, _steps?: Buoc[], _si?: number) => true;
export const canDel = (_p?: Plan, _steps?: Buoc[], _si?: number) => true;
export function add(p: Plan, steps: Buoc[], si: number, r: Rnd = rnd): Plan {
  const n = p.map(x => x.map(y => ({ ...y }))), b = ext(steps)[si], f = flat(n);
  const before = [...f].reverse().find(x => x.si <= si)?.q, after = f.find(x => x.si > si)?.q;
  n[si].push({ q: pickQ(b.q, [before, after], [], r), n: b.so === 0 ? 5 : randN(b, r) }); return n;
}
export function del(p: Plan, _steps: Buoc[], si: number, ti: number): Plan {
  const n = p.map(x => x.map(y => ({ ...y }))); n[si].splice(ti, 1); return n;
}
export function setQ(p: Plan, si: number, ti: number, q: QCode): Plan { const n = p.map(x => x.map(y => ({ ...y }))); n[si][ti].q = q; return n; }
const clampN = (v: number) => Math.max(1, Math.min(MAX_N, Math.round(v) || 1));
/** Đổi số câu: d = +1 / −1 (nút), hoặc đặt thẳng giá trị (ô gõ số). */
export function setN(p: Plan, _steps: Buoc[], si: number, ti: number, d: number): Plan {
  const n = p.map(x => x.map(y => ({ ...y }))), t = n[si][ti]; t.n = clampN(t.n + d); return n;
}
export function setNTo(p: Plan, si: number, ti: number, v: number): Plan { const n = p.map(x => x.map(y => ({ ...y }))); n[si][ti].n = clampN(v); return n; }
export function setYc(p: Plan, si: number, ti: number, yc: string): Plan { const n = p.map(x => x.map(y => ({ ...y }))); if (yc.trim()) n[si][ti].yc = yc; else delete n[si][ti].yc; return n; }
/** Cấu trúc đã duyệt (ws.gen.structure). */
export const toStructure = (p: Plan, steps: Buoc[]): GenStructItem[] => { const S = ext(steps);
  return flat(p).map(x => { const yc = p[x.si][x.ti].yc; return { step: S[x.si].so, role: S[x.si].so === 0 ? 'Bài tự do' : S[x.si].vaiTro, q: x.q, n: x.n, ...(S[x.si].chiTiet ? { extra: S[x.si].chiTiet } : {}), ...(yc ? { yc } : {}) }; }); };
/** Cấu trúc đã lưu → Plan (khi quay lại Ra đề). Giữ nguyên quyết định của giáo viên; bài thuộc bước không còn trong Trình tự rơi vào "Bài tự do". */
export function fromStructure(st: GenStructItem[], steps: Buoc[]): Plan {
  const S = ext(steps), at = (x: GenStructItem) => { const i = S.findIndex(b => b.so === x.step); return i < 0 ? S.length - 1 : i; };
  return S.map((_b, si) => st.filter(x => at(x) === si).map(x => ({ q: x.q, n: x.n, ...(x.yc ? { yc: x.yc } : {}) })));
}
/** Hai bài liền nhau cùng Q (giáo viên tự chọn thì cho phép, chỉ để nhắc). */
export const sameAdj = (p: Plan) => { const f = flat(p); return f.map((x, k) => k > 0 && f[k - 1].q === x.q).map((v, k) => v ? k + 1 : 0).filter(Boolean); };

// ---------- bài giả (chữ xxx) ----------
const LEN = [3, 5, 2, 4, 6, 3, 4, 2, 5, 3, 7, 4];
const word = (k: number) => 'x'.repeat(LEN[k % LEN.length]);
const words = (k: number, m: number) => Array.from({ length: m }, (_, j) => word(k + j)).join(' ');
const sent = (k: number, m = 7, end = '.') => { const s = words(k, m); return s[0].toUpperCase() + s.slice(1) + end; };
const passWords = (extra: string) => { const m = /bài đọc\s*(\d+)\s*(?:[–\-]\s*(\d+))?\s*từ/i.exec(extra || ''); return m ? Math.round((+m[1] + +(m[2] || m[1])) / 2) : 0; };
/** Câu lệnh tiếng Anh mẫu cho bài: "Hướng dẫn mẫu:" của dạng TF đầu tiên có Q này. */
export function titleOf(q: QCode, tf: Tf | null, fallback: string) {
  const d = tf && tf.dang.find(x => x.q === q), m = d && /^\s*hướng dẫn mẫu\s*:\s*(.+)$/im.exec(d.raw);
  return (m && m[1].trim()) || fallback;
}
/** MD của một bài giả (cùng cú pháp AI sẽ viết, đọc bằng bộ đọc của app). */
export function fakeTaskMd(q: QCode, n: number, title: string, extra = '', seed = 0): string {
  const L: string[] = [`## Task: ${title}`], pw = passWords(extra), k0 = seed * 7;
  const body = (f: (i: number) => string) => { for (let i = 1; i <= n; i++) L.push(f(i)); };
  const passage = () => { if (!pw) return; L.push('Bài đọc:'); let left = pw, k = k0; while (left > 0) { const m = Math.min(left, 9); L.push(sent(k, m)); left -= m; k += 3; } L.push(''); };
  switch (q) {
    case 'Q1': L.push('Dạng: điền từ'); if (/khung từ/i.test(extra)) L.push('Khung từ: ' + [0, 1, 2, 3].map(word).join(', ')); passage(); body(i => `${i}. ${words(k0 + i, 3)} ___ ${words(k0 + i + 4, 3)}.`); break;
    case 'Q2': L.push('Dạng: viết câu', 'Dòng viết: 1'); passage(); body(i => `${i}. ${sent(k0 + i, 6, '?')}`); break;
    case 'Q3': L.push('Dạng: chọn A/B/C'); passage(); body(i => `${i}. ${words(k0 + i, 4)} ___ ${words(k0 + i + 2, 2)}. A. ${word(i)} B. ${word(i + 1)} C. ${word(i + 2)}`); break;
    case 'Q4': L.push('Dạng: chọn trong câu'); passage(); body(i => `${i}. ${sent(k0 + i, 3, '')} {*${word(i)}|${word(i + 1)}} ${words(k0 + i + 3, 3)}.`); break;
    case 'Q5': L.push('Dạng: đúng/sai (cùng hàng)'); passage(); body(i => `${i}. ${sent(k0 + i, 7)}`); break;
    case 'Q6': L.push('Dạng: nhìn ảnh viết'); body(i => `${i}. [ảnh: ${words(i, 2)}]`); break;
    case 'Q7': L.push('Dạng: chọn ảnh'); passage(); body(i => `${i}. ${sent(k0 + i, 5, '?')}\n   A. [ảnh: ${word(i)}] B. [ảnh: ${word(i + 1)}] C. [ảnh: ${word(i + 2)}]`); break;
    case 'Q8': L.push('Dạng: nối', 'Xáo vế phải: có'); body(i => `${i}. ${sent(k0 + i, 4, '?')} - ${sent(k0 + i + 5, 4)}`); break;
    case 'Q9': L.push('Dạng: tô chữ'); body(i => `${i}. ${words(k0 + i, 2)}`); break;
    case 'Q10': L.push('Dạng: bảng'); passage(); L.push(`${word(1)} | ${word(2)} | ${word(3)}`); for (let i = 1; i <= n; i++) L.push(`${word(i)} | =${word(i + 1)} | =${word(i + 2)}`); break;
    case 'Q11': L.push('Dạng: lưới', 'Khung từ: ' + [0, 1, 2, 3].map(word).join(', '), 'Ô chữ:'); for (let i = 0; i < Math.max(6, n); i++) L.push('X'.repeat(Math.max(6, n))); break;
    case 'Q12': L.push('Dạng: viết tự do', `Dòng viết: ${n}`, 'Khối chữ trên:', `  ${sent(k0, 5, '?')} ${sent(k0 + 3, 5, '?')}`); break;
  }
  return L.join('\n');
}
/** MD cả phiếu giả theo cấu trúc. */
export function fakeSheetMd(p: Plan, tt: TrinhTu, tf: Tf | null, title = 'Layout sơ bộ', age = '7-9'): string {
  const steps = ext(tt.buoc);
  return [`# ${title}`, `Tuổi: ${age}`, '', ...flat(p).map((x, k) => fakeTaskMd(x.q, x.n, titleOf(x.q, tf, steps[x.si].so === 0 ? 'Bài tự do' : `Bước ${steps[x.si].so} · ${steps[x.si].ten}`), steps[x.si].chiTiet, k + 1) + '\n')].join('\n');
}
