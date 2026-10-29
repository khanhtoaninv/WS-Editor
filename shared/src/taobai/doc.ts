// Module Tạo bài: tách các file dữ liệu ĐỊNH DẠNG TẠM (giáo trình, Trình tự, TF, Kiến thức) từ chữ → kiểu ở types.ts.
// Hàm thuần (không đọc đĩa), chạy được ở máy chủ và trình duyệt (chế độ AI ngoài nạp gói dữ liệu).
// Định dạng tạm: docs/TAO_BAI/DINH_DANG_TAM.md. Khi chốt định dạng thật (thảo luận cấu trúc file) chỉ sửa file này
// và server/src/taobai/nguon.ts; giao diện chỉ dùng kiểu ở types.ts.
import { Q_CODES, MAX_TASKS_PER_STEP, type QCode, type DataNote, type GiaoTrinh, type Buoc, type TrinhTu, type Tf, type TfDang, type KienThuc, type ChiTietLesson, type FileChung, type LessonRef, type UnitRef } from './types.ts';

const lines = (s: string) => String(s || '').replace(/\r/g, '').split('\n');
const field = (t: string) => /^\s*([\p{L}][\p{L} ]{0,30}?)\s*:\s*(.*)$/u.exec(t);
const low = (s: string) => s.toLowerCase().trim();
const yes = (s: string): boolean | null => /^(có|bắt buộc|yes|x)$/i.test(s.trim()) ? true : /^(không|không bắt buộc|no)$/i.test(s.trim()) ? false : null;

/** "Phiên bản: 7" ở đầu file (trước mục "##" đầu tiên). */
function header(L: string[], file: string, warn: DataNote[]) {
  const h: Record<string, { v: string; line: number }> = {}; let title = '';
  for (let i = 0; i < L.length; i++) {
    const t = L[i].trim(); if (/^##(?!#)/.test(t)) break;
    const m = /^#(?!#)\s*(.+)$/.exec(t); if (m) { title = m[1].trim(); continue; }
    const f = field(t); if (f) h[low(f[1])] = { v: f[2].trim(), line: i + 1 };
  }
  const ver = h['phiên bản'] ? h['phiên bản'].v : '';
  if (!ver) warn.push({ file, msg: 'thiếu dòng “Phiên bản:” ở đầu file (phiếu tạo ra sẽ không ghi được phiên bản đã dùng)' });
  return { title, h, ver: ver || '?' };
}

/** Các mục "## tên" → [tên, dòng bắt đầu (1-based), các dòng]. */
function sections(L: string[]) {
  const out: { name: string; line: number; body: string[] }[] = []; let cur: (typeof out)[number] | null = null;
  L.forEach((l, i) => { const m = /^##(?!#)\s*(.+)$/.exec(l.trim()); if (m) { cur = { name: m[1].trim(), line: i + 1, body: [] }; out.push(cur); } else if (cur) cur.body.push(l); });
  return out;
}
const trimBody = (b: string[]) => b.join('\n').replace(/^\s*\n+|\n+\s*$/g, '').trim();

/** "Q4, Q7 Chọn ảnh; q3" → ['Q4','Q7','Q3']; mã lạ trả về trong bad. */
export function parseQList(s: string): { q: QCode[]; bad: string[] } {
  const q: QCode[] = [], bad: string[] = [];
  String(s || '').split(/[,;/]+/).map(x => x.trim()).filter(Boolean).forEach(x => {
    const m = /^q\s*(\d{1,2})\b/i.exec(x); const c = m ? ('Q' + +m[1]) as QCode : null;
    if (c && Q_CODES.includes(c)) { if (!q.includes(c)) q.push(c); } else bad.push(x);
  });
  return { q, bad };
}
/** "5-6", "5–6", "5 – 6 câu", "4" → {min,max}. */
export function parseRange(s: string): { min: number; max: number } | null {
  const m = /^\s*(\d{1,2})\s*(?:[-–—]|đến|tới)?\s*(\d{1,2})?/.exec(String(s || '')); if (!m) return null;
  const a = +m[1], b = m[2] ? +m[2] : a; return { min: Math.min(a, b), max: Math.max(a, b) };
}

// ---------- giao-trinh.md ----------
/**
 * # Pinta English 3
 * Mã: pinta-english-3        (không ghi: dùng tên thư mục)
 * Tuổi: 7-9
 * ## Chuyên đề
 * - ngu-phap: Ngữ pháp
 * ## Unit 5: My weekend
 * - Lesson 2: was / were | ngu-phap
 */
export function parseGiaoTrinh(src: string, file: string, idMacDinh: string): { gt: GiaoTrinh; loi: DataNote[]; canhBao: DataNote[] } {
  const L = lines(src), loi: DataNote[] = [], canhBao: DataNote[] = [];
  const hd = header(L, file, []);
  const gt: GiaoTrinh = { id: (hd.h['mã'] && hd.h['mã'].v) || idMacDinh, ten: hd.title || idMacDinh, chuyenDe: [], units: [] };
  if (hd.h['tuổi']) { const a = hd.h['tuổi'].v.replace(/[–—]/g, '-').replace(/\s/g, ''); if (['5-6', '7-9', '10-12'].includes(a)) gt.tuoi = a; else canhBao.push({ file, line: hd.h['tuổi'].line, msg: `không hiểu “Tuổi: ${hd.h['tuổi'].v}” (5-6 / 7-9 / 10-12)` }); }
  if (!hd.title) loi.push({ file, msg: 'thiếu tên giáo trình (dòng “# Tên giáo trình”)' });
  const ids = new Set<string>();
  sections(L).forEach(sec => {
    const items = sec.body.map((l, k) => ({ t: l.trim(), line: sec.line + 1 + k })).filter(x => /^[-*]\s+/.test(x.t)).map(x => ({ t: x.t.replace(/^[-*]\s+/, ''), line: x.line }));
    if (/^chuyên đề$/i.test(sec.name)) {
      items.forEach(x => { const m = /^([a-z0-9][a-z0-9-]*)\s*:\s*(.+)$/i.exec(x.t); if (!m) { loi.push({ file, line: x.line, msg: `dòng chuyên đề phải là “- mã: Tên”, gặp “${x.t}”` }); return; } if (gt.chuyenDe.some(c => c.id === m[1])) loi.push({ file, line: x.line, msg: `mã chuyên đề “${m[1]}” bị trùng` }); else gt.chuyenDe.push({ id: m[1], ten: m[2].trim() }); });
      return;
    }
    const um = /^unit\s+(\d{1,2})\s*[:.\-–]?\s*(.*)$/i.exec(sec.name);
    if (!um) { canhBao.push({ file, line: sec.line, msg: `bỏ qua mục “## ${sec.name}” (chỉ đọc “## Chuyên đề” và “## Unit n: tên”)` }); return; }
    const u: UnitRef = { id: 'u' + +um[1], ten: (`Unit ${+um[1]}` + (um[2] ? ' · ' + um[2].trim() : '')), lessons: [] };
    if (gt.units.some(x => x.id === u.id)) { loi.push({ file, line: sec.line, msg: `Unit ${+um[1]} bị trùng` }); return; }
    items.forEach(x => {
      const m = /^lesson\s+(\d{1,2})\s*[:.\-–]?\s*([^|]*?)\s*(?:\|\s*(.*))?$/i.exec(x.t);
      if (!m) { loi.push({ file, line: x.line, msg: `dòng lesson phải là “- Lesson n: tên | mã chuyên đề”, gặp “${x.t}”` }); return; }
      const id = `${u.id}-l${+m[1]}`, cd = (m[3] || '').trim(), ten = `Lesson ${+m[1]}` + (m[2] ? ' · ' + m[2].trim() : '');
      if (ids.has(id)) { loi.push({ file, line: x.line, msg: `Lesson ${+m[1]} của ${u.ten} bị trùng` }); return; }
      ids.add(id);
      if (!cd) loi.push({ file, line: x.line, msg: `${ten} (${u.ten}) chưa gắn chuyên đề (mỗi lesson thuộc đúng một chuyên đề)` });
      else if (/[,;|]/.test(cd)) loi.push({ file, line: x.line, msg: `${ten} (${u.ten}) gắn nhiều chuyên đề “${cd}” (mỗi lesson thuộc đúng một chuyên đề)` });
      u.lessons.push({ id, ten, chuyenDe: cd, unit: u.id } as LessonRef);
    });
    gt.units.push(u);
  });
  gt.units.forEach(u => u.lessons.forEach(l => { if (l.chuyenDe && !/[,;|]/.test(l.chuyenDe) && !gt.chuyenDe.some(c => c.id === l.chuyenDe)) loi.push({ file, msg: `${l.ten} (${u.ten}) gắn chuyên đề “${l.chuyenDe}” không có trong mục “## Chuyên đề”` }); }));
  if (!gt.chuyenDe.length) loi.push({ file, msg: 'chưa có mục “## Chuyên đề” (mỗi dòng “- mã: Tên”)' });
  return { gt, loi, canhBao };
}

// ---------- Trình tự ----------
/**
 * # Trình tự · Ngữ pháp
 * Phiên bản: 7
 * Số trang tối đa: 2
 * ## Bước 1: Khởi động
 * Vai trò: nhận diện cấu trúc
 * Dạng: Q4, Q7, Q3
 * Số câu: 5-6            (Q12: số dòng)
 * Bắt buộc: có
 * Tối đa: 1 bài
 * Chi tiết: khung từ
 * (dòng khác: ghi chú cho AI)
 * ## Nguyên tắc
 * - …
 */
export function parseTrinhTu(src: string, file: string, chuyenDe: string): { tt: TrinhTu; loi: DataNote[]; canhBao: DataNote[] } {
  const L = lines(src), loi: DataNote[] = [], canhBao: DataNote[] = [];
  const hd = header(L, file, canhBao);
  let soTrang = 2;
  if (hd.h['số trang tối đa']) { const n = parseInt(hd.h['số trang tối đa'].v, 10); if (n >= 1 && n <= 10) soTrang = n; else canhBao.push({ file, line: hd.h['số trang tối đa'].line, msg: `“Số trang tối đa: ${hd.h['số trang tối đa'].v}” không hợp lệ (1–10); dùng 2` }); }
  const tt: TrinhTu = { chuyenDe, ver: hd.ver, soTrangToiDa: soTrang, buoc: [], nguyenTac: '', raw: String(src || '') };
  sections(L).forEach(sec => {
    if (/^nguyên tắc/i.test(sec.name)) { tt.nguyenTac = trimBody(sec.body); return; }
    const bm = /^bước\s*(\d{1,2})\s*[:.\-–·]?\s*(.*)$/i.exec(sec.name);
    if (!bm) { canhBao.push({ file, line: sec.line, msg: `mục “## ${sec.name}” không phải bước hay nguyên tắc: chỉ gửi AI, app không đọc` }); tt.nguyenTac = [tt.nguyenTac, `## ${sec.name}\n${trimBody(sec.body)}`].filter(Boolean).join('\n\n'); return; }
    const so = tt.buoc.length + 1, nm = bm[2].trim() || `Bước ${so}`, at = `Bước ${so} (${nm})`;
    if (+bm[1] !== so) canhBao.push({ file, line: sec.line, msg: `${at} ghi số ${+bm[1]}; app đánh số theo thứ tự trong file` });
    const F: Record<string, { v: string; line: number }> = {}, them: string[] = [];
    sec.body.forEach((l, k) => { const t = l.trim(), f = field(t), key = f ? low(f[1]) : '';
      if (f && ['vai trò', 'dạng', 'số câu', 'số dòng', 'bắt buộc', 'tối đa', 'chi tiết'].includes(key)) F[key] = { v: f[2].trim(), line: sec.line + 1 + k }; else them.push(l); });
    const b: Buoc = { so, ten: nm, vaiTro: F['vai trò'] ? F['vai trò'].v : '', q: [], min: 0, max: 0, batBuoc: true, toiDa: MAX_TASKS_PER_STEP, chiTiet: F['chi tiết'] ? F['chi tiết'].v : '', them: trimBody(them) };
    if (!b.vaiTro) canhBao.push({ file, line: sec.line, msg: `${at}: thiếu “Vai trò:”` });
    if (!F['dạng']) loi.push({ file, line: sec.line, msg: `${at}: thiếu “Dạng:” (các mã Q được phép, vd “Dạng: Q4, Q7”)` });
    else { const p = parseQList(F['dạng'].v); b.q = p.q;
      if (p.bad.length) loi.push({ file, line: F['dạng'].line, msg: `${at}: không hiểu dạng “${p.bad.join(', ')}” (ghi mã Q1–Q12)` });
      if (!p.q.length && !p.bad.length) loi.push({ file, line: F['dạng'].line, msg: `${at}: “Dạng:” chưa có mã Q nào` });
      if (p.q.length > 3) canhBao.push({ file, line: F['dạng'].line, msg: `${at}: ${p.q.length} dạng Q (nên 1–3)` });
      if (p.q.includes('Q11')) canhBao.push({ file, line: F['dạng'].line, msg: `${at}: Q11 Lưới chưa sinh tự động được (AI dựng lưới dễ sai)` }); }
    const rs = F['số câu'] || F['số dòng'];
    if (!rs) loi.push({ file, line: sec.line, msg: `${at}: thiếu “Số câu:” (vd “Số câu: 5-6”)` });
    else { const r = parseRange(rs.v); if (!r || r.min < 1 || r.max > 30) loi.push({ file, line: rs.line, msg: `${at}: “Số câu: ${rs.v}” không hợp lệ (vd 5-6, từ 1 đến 30)` }); else { b.min = r.min; b.max = r.max; } }
    if (F['bắt buộc']) { const y = yes(F['bắt buộc'].v); if (y === null) canhBao.push({ file, line: F['bắt buộc'].line, msg: `${at}: không hiểu “Bắt buộc: ${F['bắt buộc'].v}” (có / không); coi là bắt buộc` }); else b.batBuoc = y; }
    else canhBao.push({ file, line: sec.line, msg: `${at}: thiếu “Bắt buộc:”; coi là bắt buộc` });
    if (F['tối đa']) { const n = parseInt(F['tối đa'].v, 10); if (!(n >= 1)) canhBao.push({ file, line: F['tối đa'].line, msg: `${at}: không hiểu “Tối đa: ${F['tối đa'].v}”; dùng ${MAX_TASKS_PER_STEP} bài` }); else if (n > MAX_TASKS_PER_STEP) canhBao.push({ file, line: F['tối đa'].line, msg: `${at}: tối đa ${n} bài, app chỉ cho ${MAX_TASKS_PER_STEP} bài mỗi bước` }); else b.toiDa = n; }
    tt.buoc.push(b);
  });
  if (!tt.buoc.length) loi.push({ file, msg: 'Trình tự chưa có bước nào (mục “## Bước 1: tên”)' });
  if (tt.buoc.length && !tt.buoc.some(b => b.batBuoc)) canhBao.push({ file, msg: 'không có bước bắt buộc nào: giáo viên có thể xóa hết bài' });
  return { tt, loi, canhBao };
}

// ---------- TF ----------
/**
 * # TF · Ngữ pháp
 * Phiên bản: 3
 * ## Dạng 1: Chọn từ đúng trong ngoặc
 * Dạng app: Q4 Chọn trong câu
 * (mô tả, hướng dẫn mẫu, ví dụ: gửi AI)
 */
export function parseTf(src: string, file: string, chuyenDe: string): { tf: Tf; loi: DataNote[]; canhBao: DataNote[] } {
  const L = lines(src), loi: DataNote[] = [], canhBao: DataNote[] = [];
  const hd = header(L, file, canhBao), tf: Tf = { chuyenDe, ver: hd.ver, dang: [], raw: String(src || '') };
  sections(L).forEach(sec => {
    const dm = /^dạng\s*(\d{1,2})\s*[:.\-–·]?\s*(.*)$/i.exec(sec.name);
    if (!dm) { canhBao.push({ file, line: sec.line, msg: `mục “## ${sec.name}” không phải “## Dạng n: tên”: chỉ gửi AI` }); return; }
    const k = sec.body.findIndex(l => /^\s*dạng app\s*:/i.test(l)), at = `Dạng ${+dm[1]} (${dm[2].trim() || '?'})`;
    if (k < 0) { loi.push({ file, line: sec.line, msg: `${at}: thiếu “Dạng app: Qn …”` }); return; }
    const mq = /^\s*dạng app\s*:\s*(q\s*\d{1,2})(?!\d)(?:\s*[,;/]\s*q\s*\d)?/i.exec(sec.body[k]), p = parseQList(mq ? mq[0].replace(/^\s*dạng app\s*:/i, '') : '');
    if (p.q.length !== 1) { loi.push({ file, line: sec.line + 1 + k, msg: `${at}: “Dạng app:” phải ghi đúng một mã Q (vd “Dạng app: Q4 Chọn trong câu”)` }); return; }
    tf.dang.push({ so: +dm[1], ten: dm[2].trim(), q: p.q[0], raw: `## ${sec.name}\n${trimBody(sec.body)}` } as TfDang);
  });
  if (!tf.dang.length) loi.push({ file, msg: 'TF chưa có dạng nào (mục “## Dạng 1: tên” + “Dạng app: Qn”)' });
  return { tf, loi, canhBao };
}

// ---------- Kiến thức (chỉ chuẩn hóa thành phần, không chuẩn hóa nội dung) ----------
export function parseKienThuc(src: string, file: string, lesson: string): { kt: KienThuc; loi: DataNote[]; canhBao: DataNote[] } {
  const L = lines(src), loi: DataNote[] = [], canhBao: DataNote[] = [];
  const hd = header(L, file, canhBao), muc: Record<string, string> = {};
  sections(L).forEach(sec => { muc[sec.name] = trimBody(sec.body); });
  const pick = (re: RegExp) => { const k = Object.keys(muc).find(n => re.test(n)); return k ? muc[k] : ''; };
  const kt: KienThuc = { lesson, ver: hd.ver, mucTieu: pick(/^mục tiêu/i), tuVung: pick(/^từ vựng/i), muc, raw: String(src || '') };
  if (!kt.mucTieu) canhBao.push({ file, msg: 'thiếu mục “## Mục tiêu” (màn Ra đề hiện mục tiêu từ đây)' });
  if (!Object.keys(muc).length) loi.push({ file, msg: 'file Kiến thức trống (chưa có mục “## …” nào)' });
  return { kt, loi, canhBao };
}

/** Ghép dữ liệu một lesson và kiểm chéo (bước dùng Q mà TF không có…). */
export function ghepLesson(gt: GiaoTrinh, lessonId: string, files: { kienThuc: string | null; trinhTu: string | null; tf: string | null; ten: { kienThuc: string; trinhTu: string; tf: string } }, chung: FileChung[]): ChiTietLesson | null {
  let unit: UnitRef | undefined, lesson: LessonRef | undefined;
  gt.units.forEach(u => u.lessons.forEach(l => { if (l.id === lessonId) { unit = u; lesson = l; } }));
  if (!unit || !lesson) return null;
  const cd = gt.chuyenDe.find(c => c.id === lesson!.chuyenDe) || { id: lesson.chuyenDe, ten: lesson.chuyenDe || '?' };
  const loi: DataNote[] = [], canhBao: DataNote[] = [];
  const add = (r: { loi: DataNote[]; canhBao: DataNote[] }) => { loi.push(...r.loi); canhBao.push(...r.canhBao); };
  let kt: KienThuc | null = null, tt: TrinhTu | null = null, tf: Tf | null = null;
  if (files.kienThuc == null) loi.push({ file: files.ten.kienThuc, msg: `${lesson.ten} chưa có file Kiến thức` }); else { const r = parseKienThuc(files.kienThuc, files.ten.kienThuc, lesson.id); kt = r.kt; add(r); }
  if (files.trinhTu == null) loi.push({ file: files.ten.trinhTu, msg: `chuyên đề ${cd.ten} chưa có Trình tự: không tạo bài được` }); else { const r = parseTrinhTu(files.trinhTu, files.ten.trinhTu, cd.id); tt = r.tt; add(r); }
  if (files.tf == null) loi.push({ file: files.ten.tf, msg: `chuyên đề ${cd.ten} chưa có TF: không tạo bài được` }); else { const r = parseTf(files.tf, files.ten.tf, cd.id); tf = r.tf; add(r); }
  if (tt && tf) tt.buoc.forEach(b => b.q.forEach(q => { if (!tf!.dang.some(d => d.q === q)) loi.push({ file: files.ten.tf, msg: `Bước ${b.so} (${b.ten}) cho phép ${q} nhưng TF chưa có dạng nào ghi “Dạng app: ${q}”` }); }));
  return { giaoTrinh: { id: gt.id, ten: gt.ten, tuoi: gt.tuoi }, unit: { id: unit.id, ten: unit.ten }, lesson, chuyenDe: cd, kienThuc: kt, trinhTu: tt, tf, chung, loi, canhBao };
}

/** Phiên bản của một file chung: dòng “Phiên bản:” hoặc “Bản nháp …” ở đầu file; không có thì “?”. */
export function verOf(src: string | null): string {
  if (src == null) return '';
  for (const l of lines(src).slice(0, 12)) { const m = /^\s*phiên bản\s*:\s*(.+)$/i.exec(l); if (m) return m[1].trim(); const d = /^\s*bản nháp\s+(\S+)/i.exec(l); if (d) return 'nháp ' + d[1].replace(/[,.]$/, ''); }
  return '?';
}
