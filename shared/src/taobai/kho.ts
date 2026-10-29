// Module Tạo bài: KHO dữ liệu giáo trình dựng từ một bảng { đường dẫn tương đối → chữ của file } (định dạng tạm,
// docs/TAO_BAI/DINH_DANG_TAM.md). Dùng chung cho:
//   - máy chủ (server/src/taobai/nguon.ts đọc thư mục rồi gọi khoTuFile)
//   - trình duyệt khi mở thẳng ws-editor.html: bộ mẫu nhúng sẵn, hoặc thư mục dữ liệu giáo viên tự chọn
// Chốt định dạng thật thì sửa file này + doc.ts.
import { parseGiaoTrinh, ghepLesson } from './doc.ts';
import { verOf } from './doc.ts';
import type { GiaoTrinh, DataNote, ChiTietLesson, FileChung } from './types.ts';

/** Một file dữ liệu trong màn Thiết lập: đường dẫn tương đối trong kho + phiên bản (null = chưa có file). */
export interface TepTT { path: string; ver: string | null }
export interface TongQuanGt {
  id: string; ten: string; tuoi?: string; file: string;          // file = đường dẫn giao-trinh.md
  chuyenDe: { id: string; ten: string; trinhTu: TepTT; tf: TepTT; soLesson: number }[];
  units: { id: string; ten: string; lessons: { id: string; ten: string; chuyenDe: string; kienThuc: TepTT; loi: number; loiMsg: string[] }[] }[];
}
/** Toàn cảnh kho cho màn Thiết lập (v128): giáo trình → chuyên đề (Trình tự, TF) / unit → lesson (Kiến thức). */
export interface TongQuan { giaoTrinh: TongQuanGt[]; chung: (FileChung & { rieng?: boolean })[]; loi: DataNote[]; canhBao: DataNote[] }

export interface Kho {
  giaoTrinh: GiaoTrinh[];
  loi: DataNote[];
  canhBao: DataNote[];
  chiTiet(gtId: string, lessonId: string): ChiTietLesson | null;
  /** chữ của một file trong kho (đường dẫn tương đối), null = không có */
  tep(path: string): string | null;
  tongQuan(): TongQuan;
}
/** Đường dẫn chuẩn của các file một giáo trình (định dạng tạm). */
export const duongDan = {
  giaoTrinh: (d: string) => `${d}/giao-trinh.md`,
  trinhTu: (d: string, cd: string) => `${d}/chuyen-de/${cd}/trinh-tu.md`,
  tf: (d: string, cd: string) => `${d}/chuyen-de/${cd}/tf.md`,
  kienThuc: (d: string, ls: string) => `${d}/kien-thuc/${ls}.md`,
};
/** Đường dẫn được phép ghi qua màn Thiết lập (chống ghi lung tung trên máy chủ). */
export const TEP_HOP_LE = /^[a-z0-9][a-z0-9-]{0,60}\/(giao-trinh\.md|chuyen-de\/[a-z0-9][a-z0-9-]{0,40}\/(trinh-tu|tf)\.md|kien-thuc\/u\d{1,2}-l\d{1,2}\.md)$/;

/** files: đường dẫn dạng "pinta-english-3/giao-trinh.md" (thư mục con đầu tiên = một giáo trình). */
export function khoTuFile(files: Record<string, string>, chung: FileChung[] = []): Kho {
  const F: Record<string, string> = {};
  Object.keys(files).forEach(k => { F[k.replace(/\\/g, '/').replace(/^\.?\//, '')] = files[k]; });
  const dirs = [...new Set(Object.keys(F).map(k => k.split('/')[0]).filter((d, _, a) => d && a.length))].sort();
  const giaoTrinh: GiaoTrinh[] = [], loi: DataNote[] = [], canhBao: DataNote[] = [], dirOf: Record<string, string> = {};
  for (const d of dirs) {
    const src = F[`${d}/giao-trinh.md`];
    if (src == null) { if (Object.keys(F).some(k => k.startsWith(d + '/'))) canhBao.push({ file: d, msg: 'thư mục không có giao-trinh.md: bỏ qua' }); continue; }
    const r = parseGiaoTrinh(src, `${d}/giao-trinh.md`, d);
    if (giaoTrinh.some(g => g.id === r.gt.id)) { loi.push({ file: d, msg: `mã giáo trình “${r.gt.id}” bị trùng: bỏ qua` }); continue; }
    giaoTrinh.push(r.gt); dirOf[r.gt.id] = d; loi.push(...r.loi); canhBao.push(...r.canhBao);
  }
  const chiTiet = (gtId: string, lessonId: string): ChiTietLesson | null => {
    const gt = giaoTrinh.find(g => g.id === gtId); if (!gt) return null;
    const d = dirOf[gt.id]; let cd = '';
    gt.units.forEach(u => u.lessons.forEach(l => { if (l.id === lessonId) cd = l.chuyenDe; }));
    const p = { kienThuc: `${d}/kien-thuc/${lessonId}.md`, trinhTu: `${d}/chuyen-de/${cd || '_'}/trinh-tu.md`, tf: `${d}/chuyen-de/${cd || '_'}/tf.md` };
    const get = (k: string) => (k in F ? F[k] : null);
    const r = ghepLesson(gt, lessonId, { kienThuc: get(p.kienThuc), trinhTu: cd ? get(p.trinhTu) : null, tf: cd ? get(p.tf) : null, ten: p }, chung);
    if (r) r.loi.unshift(...loi.filter(n => n.file === `${d}/giao-trinh.md` && n.msg.includes(r.lesson.ten)));   // lỗi của chính lesson này trong giao-trinh.md
    return r;
  };
  const tep = (k: string) => (k in F ? F[k] : null);
  const tt = (k: string) => ({ path: k, ver: k in F ? verOf(F[k]) : null });
  const tongQuan = (): TongQuan => ({
    loi, canhBao, chung,
    giaoTrinh: giaoTrinh.map(g => { const d = dirOf[g.id], all = g.units.flatMap(u => u.lessons);
      return { id: g.id, ten: g.ten, tuoi: g.tuoi, file: duongDan.giaoTrinh(d),
        chuyenDe: g.chuyenDe.map(c => ({ id: c.id, ten: c.ten, trinhTu: tt(duongDan.trinhTu(d, c.id)), tf: tt(duongDan.tf(d, c.id)), soLesson: all.filter(l => l.chuyenDe === c.id).length })),
        units: g.units.map(u => ({ id: u.id, ten: u.ten, lessons: u.lessons.map(l => ({ id: l.id, ten: l.ten, chuyenDe: l.chuyenDe, kienThuc: tt(duongDan.kienThuc(d, l.id)), ...(() => { const e = chiTiet(g.id, l.id)?.loi || []; return { loi: e.length, loiMsg: e.slice(0, 6).map(n => `${n.file.split('/').slice(-2).join('/')}${n.line ? ':' + n.line : ''} · ${n.msg}`) }; })() })) })) }; }),
  });
  return { giaoTrinh, loi, canhBao, chiTiet, tep, tongQuan };
}
