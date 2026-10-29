// Module Tạo bài: KHO dữ liệu giáo trình dựng từ một bảng { đường dẫn tương đối → chữ của file } (định dạng tạm,
// docs/TAO_BAI/DINH_DANG_TAM.md). Dùng chung cho:
//   - máy chủ (server/src/taobai/nguon.ts đọc thư mục rồi gọi khoTuFile)
//   - trình duyệt khi mở thẳng ws-editor.html: bộ mẫu nhúng sẵn, hoặc thư mục dữ liệu giáo viên tự chọn
// Chốt định dạng thật thì sửa file này + doc.ts.
import { parseGiaoTrinh, ghepLesson } from './doc.ts';
import type { GiaoTrinh, DataNote, ChiTietLesson, FileChung } from './types.ts';

export interface Kho {
  giaoTrinh: GiaoTrinh[];
  loi: DataNote[];
  canhBao: DataNote[];
  chiTiet(gtId: string, lessonId: string): ChiTietLesson | null;
}

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
  return { giaoTrinh, loi, canhBao, chiTiet };
}
