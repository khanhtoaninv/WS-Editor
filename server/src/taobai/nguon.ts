// Module Tạo bài: MÔ-ĐUN CHUYỂN ĐỔI DUY NHẤT giữa thư mục dữ liệu giáo trình trên máy chủ và kiểu dữ liệu của app
// (docs/TAO_BAI/DAC_TA_TAO_BAI.md mục 9.2, KE_HOACH_TRIEN_KHAI.md mục 0). Định dạng file hiện là ĐỊNH DẠNG TẠM
// (docs/TAO_BAI/DINH_DANG_TAM.md); chốt định dạng thật thì chỉ sửa file này + shared/src/taobai/doc.ts, kho.ts.
//   docNguon(dir)                  → danh sách giáo trình + lỗi đọc giao-trinh.md
//   chiTietLesson(dir, gt, lesson) → Kiến thức + Trình tự (đã tách bước) + TF + file chung + lỗi / cảnh báo
// Đọc thư mục thành bảng { đường dẫn → chữ } rồi dùng chung logic với trình duyệt (shared/src/taobai/kho.ts).
// Chạy thẳng để xem nhanh dữ liệu: node --experimental-strip-types server/src/taobai/nguon.ts [thư mục]
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { khoTuFile, verOf, type Kho, type GiaoTrinh, type DataNote, type ChiTietLesson, type FileChung } from '../../../shared/src/taobai/index.ts';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
/** Thư mục dữ liệu mặc định: biến môi trường TAOBAI_DATA, không có thì bộ mẫu tạm. */
export const DATA_DIR = process.env.TAOBAI_DATA ? resolve(process.env.TAOBAI_DATA) : join(REPO, 'server/demo/tao-bai');

/** Bộ file chung của hệ thống (đặc tả mục 3). File chưa viết: null (app báo "chưa có", không chặn T0–T3). */
export const CHUNG: { so: FileChung['so']; ten: string; file: string | null }[] = [
  { so: 1, ten: 'Quy tắc MD cho sinh bài', file: 'docs/TAO_BAI/CHUNG_1_QUY_TAC_MD.md' },
  { so: 2, ten: 'Mô tả 12 dạng Q', file: 'docs/TAO_BAI/1_DANG_Q.md' },
  { so: 3, ten: 'Quy tắc hình thức', file: null },
  { so: 4, ten: 'Rubric chất lượng', file: null },
  { so: 5, ten: 'Phiếu mẫu đã duyệt', file: null },
];

const read = (p: string): string | null => existsSync(p) && statSync(p).isFile() ? readFileSync(p, 'utf8') : null;

export function docChung(root = REPO): FileChung[] {
  return CHUNG.map(c => { const raw = c.file ? read(join(root, c.file)) : null; return { so: c.so, ten: c.ten, ver: raw == null ? '' : verOf(raw), raw }; });
}

/** Mọi file .md trong thư mục dữ liệu (tối đa 4 cấp, bỏ file / thư mục ẩn). */
function docThuMuc(dir: string): Record<string, string> {
  const out: Record<string, string> = {};
  const walk = (d: string, depth: number) => { for (const f of readdirSync(d)) { if (f.startsWith('.')) continue; const p = join(d, f), s = statSync(p);
    if (s.isDirectory()) { if (depth < 4) walk(p, depth + 1); } else if (/\.md$/i.test(f) && s.size < 512 * 1024) out[relative(dir, p).replace(/\\/g, '/')] = readFileSync(p, 'utf8'); } };
  walk(dir, 0); return out;
}

export function moKho(dir = DATA_DIR, root = REPO): Kho | null { return existsSync(dir) ? khoTuFile(docThuMuc(dir), docChung(root)) : null; }

/** Mọi giáo trình trong thư mục dữ liệu (mỗi thư mục con có giao-trinh.md là một giáo trình). */
export function docNguon(dir = DATA_DIR): { giaoTrinh: GiaoTrinh[]; loi: DataNote[]; canhBao: DataNote[] } {
  const k = moKho(dir); if (!k) return { giaoTrinh: [], loi: [{ file: dir, msg: 'không có thư mục dữ liệu giáo trình' }], canhBao: [] };
  return { giaoTrinh: k.giaoTrinh, loi: k.loi, canhBao: k.canhBao };
}

/** Dữ liệu đủ để tạo bài cho một lesson. null = không có giáo trình / lesson đó. */
export function chiTietLesson(dir: string, gtId: string, lessonId: string, root = REPO): ChiTietLesson | null {
  const k = moKho(dir, root); return k ? k.chiTiet(gtId, lessonId) : null;
}

/** Danh sách giáo trình để gửi ra ngoài (không có đường dẫn máy chủ). */
export const congKhai = (g: GiaoTrinh): GiaoTrinh => g;

// ---------- chạy thẳng: in tóm tắt ----------
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2] ? resolve(process.argv[2]) : DATA_DIR, all = docNguon(dir);
  const note = (n: DataNote) => `${n.file}${n.line ? ':' + n.line : ''} · ${n.msg}`;
  console.log(`Thư mục: ${dir}`);
  all.loi.forEach(n => console.log('  LỖI   ' + note(n))); all.canhBao.forEach(n => console.log('  ⚠     ' + note(n)));
  for (const g of all.giaoTrinh) {
    console.log(`\n${g.ten} [${g.id}] · tuổi ${g.tuoi || '?'} · chuyên đề: ${g.chuyenDe.map(c => c.ten).join(', ')}`);
    for (const u of g.units) for (const l of u.lessons) {
      const c = chiTietLesson(dir, g.id, l.id)!;
      console.log(`  ${u.ten} › ${l.ten} [${l.id}] · ${c.chuyenDe.ten} · ${c.loi.length ? c.loi.length + ' lỗi' : 'tạo bài được'}${c.canhBao.length ? ' · ' + c.canhBao.length + ' cảnh báo' : ''}`);
      if (c.trinhTu) console.log(`    Trình tự v${c.trinhTu.ver} (${c.trinhTu.buoc.length} bước, tối đa ${c.trinhTu.soTrangToiDa} trang): ` + c.trinhTu.buoc.map(b => `${b.so}.${b.ten} [${b.q.join('/')} · ${b.min}–${b.max} · ${b.batBuoc ? 'bắt buộc' : 'không bắt buộc'} · ≤${b.toiDa}]`).join(' '));
      if (c.tf) console.log(`    TF v${c.tf.ver}: ${c.tf.dang.map(d => d.q).join(', ')}`);
      c.loi.forEach(n => console.log('    LỖI ' + note(n))); c.canhBao.forEach(n => console.log('    ⚠   ' + note(n)));
    }
  }
  console.log('\nFile chung: ' + docChung().map(c => `${c.so} ${c.ten}: ${c.raw == null ? 'chưa có' : 'có (' + c.ver + ')'}`).join(' · '));
}
