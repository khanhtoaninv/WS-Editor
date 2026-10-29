// Module Tạo bài T3: nguồn dữ liệu giáo trình phía app (đặc tả 8.2, 9.2, câu hỏi mở 12.5).
//   - app mở qua máy chủ (npm run lop → /editor): đọc /api/taobai/… (dữ liệu trên máy chủ, phiếu đã tạo lưu ở máy chủ)
//   - mở thẳng ws-editor.html: bộ dữ liệu mẫu nhúng sẵn (server/demo/tao-bai), hoặc thư mục dữ liệu giáo viên tự chọn;
//     cùng logic đọc với máy chủ (shared/src/taobai/kho.ts). Chế độ này không lưu "phiếu đã tạo" (cần máy chủ).
/* eslint-disable @typescript-eslint/no-explicit-any */
import { khoTuFile, verOf, type Kho, type TongQuan } from '../../../shared/src/taobai/index.ts';
import type { GiaoTrinh, DataNote, ChiTietLesson, FileChung } from '../../../shared/src/taobai/types.ts';
import chung1 from '../../../docs/TAO_BAI/CHUNG_1_QUY_TAC_MD.md?raw';
import chung2 from '../../../docs/TAO_BAI/1_DANG_Q.md?raw';

const DEMO = import.meta.glob('../../../server/demo/tao-bai/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export type PhieuDaTao = { id: string; at: string; n: number; title: string };
export type Lesson = ChiTietLesson & { phieu: PhieuDaTao[] };
export interface Nguon {
  mode: 'may-chu' | 'mau' | 'thu-muc';
  ten: string;                                   // mô tả nguồn (hiện ở màn Ra đề)
  giaoTrinh: GiaoTrinh[]; loi: DataNote[]; canhBao: DataNote[];
  lesson(gt: string, ls: string): Promise<Lesson | null>;
  moPhieu?(gt: string, ls: string, id: string): Promise<any>;
  luuPhieu?(gt: string, ls: string, id: string, w: any): Promise<boolean>;
  /** v128 màn Thiết lập: cây giáo trình + trạng thái file; chữ một file */
  tongQuan(): Promise<TongQuan & { quyen?: boolean }>;
  tep(path: string): Promise<string | null>;
}

export const CHUNG_NHUNG = (): FileChung[] => [
  { so: 1, ten: 'Quy tắc MD cho sinh bài', ver: verOf(chung1), raw: chung1 },
  { so: 2, ten: 'Mô tả 12 dạng Q', ver: verOf(chung2), raw: chung2 },
  { so: 3, ten: 'Quy tắc hình thức', ver: '', raw: null }, { so: 4, ten: 'Rubric chất lượng', ver: '', raw: null }, { so: 5, ten: 'Phiếu mẫu đã duyệt', ver: '', raw: null },
];
function tuKho(k: Kho, mode: Nguon['mode'], ten: string): Nguon {
  return { mode, ten, giaoTrinh: k.giaoTrinh, loi: k.loi, canhBao: k.canhBao, lesson: async (gt, ls) => { const c = k.chiTiet(gt, ls); return c ? Object.assign(c, { phieu: [] }) : null; },
    tongQuan: async () => Object.assign(k.tongQuan(), { quyen: false }), tep: async p => k.tep(p) };
}
/** Bộ mẫu nhúng sẵn trong app. */
export function nguonMau(): Nguon {
  const files: Record<string, string> = {};
  Object.keys(DEMO).forEach(p => { files[p.replace(/^.*\/server\/demo\/tao-bai\//, '')] = DEMO[p]; });
  return tuKho(khoTuFile(files, CHUNG_NHUNG()), 'mau', 'Bộ dữ liệu mẫu có sẵn trong app (Pinta English 3 · Unit 5)');
}
/** Thư mục dữ liệu giáo viên chọn (input webkitdirectory): chọn thư mục "tao-bai" hoặc một thư mục giáo trình. */
export async function nguonThuMuc(list: FileList | File[]): Promise<Nguon> {
  const files: Record<string, string> = {};
  for (const f of Array.from(list)) { const p = ((f as any).webkitRelativePath || f.name).replace(/\\/g, '/'); if (/\.md$/i.test(p) && f.size < 512 * 1024) files[p] = await f.text(); }
  const paths = Object.keys(files), courseLevel = paths.some(p => /^[^/]+\/giao-trinh\.md$/i.test(p));
  const out: Record<string, string> = {};
  paths.forEach(p => { out[courseLevel ? p : p.split('/').slice(1).join('/')] = files[p]; });
  const root = paths[0] ? paths[0].split('/')[0] : '';
  return tuKho(khoTuFile(out, CHUNG_NHUNG()), 'thu-muc', `Thư mục “${root}” (${paths.length} file)`);
}
/** Qua máy chủ; null nếu app không chạy qua máy chủ có API tạo bài. */
export async function nguonMayChu(): Promise<Nguon | null> {
  if (!/^https?:$/.test(location.protocol)) return null;
  try {
    const r = await fetch('/api/taobai/giao-trinh'); if (!r.ok) return null;
    const j = await r.json(), E = encodeURIComponent;
    return { mode: 'may-chu', ten: 'Dữ liệu trên máy chủ', giaoTrinh: j.giaoTrinh, loi: j.loi, canhBao: j.canhBao,
      lesson: async (gt, ls) => { const x = await fetch(`/api/taobai/lesson/${E(gt)}/${E(ls)}`); return x.ok ? x.json() : null; },
      moPhieu: async (gt, ls, id) => { const x = await fetch(`/api/taobai/phieu/${E(gt)}/${E(ls)}/${E(id)}`); return x.ok ? x.json() : null; },
      luuPhieu: async (gt, ls, id, w) => { try { const x = await fetch(`/api/taobai/phieu/${E(gt)}/${E(ls)}/${E(id)}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(w) }); return x.ok; } catch { return false; } },
      tongQuan: () => goi('/api/taobai/tong-quan'),
      tep: async p => { const x = await fetch('/api/taobai/tep?path=' + E(p)); return x.ok ? (await x.json()).text : null; } };
  } catch { return null; }
}
let cache: Nguon | null = null;
export async function moNguon(force?: Nguon): Promise<Nguon> { if (force) cache = force; if (!cache) cache = (await nguonMayChu()) || nguonMau(); return cache; }
export const nguonHienTai = () => cache;
/** Dữ liệu trên máy chủ vừa đổi (màn Thiết lập nạp file): lần sau đọc lại. Nguồn thư mục / bộ mẫu giữ nguyên. */
export function datLaiNguon() { if (!cache || cache.mode === 'may-chu') cache = null; }

/** Gọi API máy chủ (JSON); lỗi → Error với câu báo của máy chủ. */
export async function goi<T = any>(path: string, o: { method?: string; json?: unknown } = {}): Promise<T> {
  let r: Response;
  try { r = await fetch(path, { method: o.method || (o.json !== undefined ? 'POST' : 'GET'), headers: o.json !== undefined ? { 'content-type': 'application/json' } : {}, body: o.json !== undefined ? JSON.stringify(o.json) : undefined }); }
  catch { throw new Error('không nối được máy chủ (máy chủ đã tắt?)'); }
  const j: any = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.loi || `máy chủ báo lỗi ${r.status}`);
  return j as T;
}
