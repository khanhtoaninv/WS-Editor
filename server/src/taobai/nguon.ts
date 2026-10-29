// Module Tạo bài: MÔ-ĐUN CHUYỂN ĐỔI DUY NHẤT giữa thư mục dữ liệu giáo trình trên máy chủ và kiểu dữ liệu của app
// (docs/TAO_BAI/DAC_TA_TAO_BAI.md mục 9.2, KE_HOACH_TRIEN_KHAI.md mục 0). Định dạng file hiện là ĐỊNH DẠNG TẠM
// (docs/TAO_BAI/DINH_DANG_TAM.md); chốt định dạng thật thì chỉ sửa file này + shared/src/taobai/doc.ts.
//   docNguon(dir)                 → danh sách giáo trình + lỗi đọc giao-trinh.md
//   chiTietLesson(dir, gt, lesson) → Kiến thức + Trình tự (đã tách bước) + TF + file chung + lỗi / cảnh báo
// Chạy thẳng để xem nhanh dữ liệu: node --experimental-strip-types server/src/taobai/nguon.ts [thư mục]
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseGiaoTrinh, ghepLesson, verOf, type GiaoTrinh, type DataNote, type ChiTietLesson, type FileChung } from '../../../shared/src/taobai/index.ts';

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
const rel = (dir: string, p: string) => relative(dir, p).replace(/\\/g, '/');

export function docChung(root = REPO): FileChung[] {
  return CHUNG.map(c => { const raw = c.file ? read(join(root, c.file)) : null; return { so: c.so, ten: c.ten, ver: raw == null ? '' : verOf(raw), raw }; });
}

/** Mọi giáo trình trong thư mục dữ liệu (mỗi thư mục con có giao-trinh.md là một giáo trình). */
export function docNguon(dir = DATA_DIR): { giaoTrinh: GiaoTrinh[]; loi: DataNote[]; canhBao: DataNote[] } {
  const out: GiaoTrinh[] = [], loi: DataNote[] = [], canhBao: DataNote[] = [];
  if (!existsSync(dir)) return { giaoTrinh: [], loi: [{ file: dir, msg: 'không có thư mục dữ liệu giáo trình' }], canhBao };
  for (const d of readdirSync(dir).sort()) {
    const p = join(dir, d); if (!statSync(p).isDirectory()) continue;
    const src = read(join(p, 'giao-trinh.md'));
    if (src == null) { canhBao.push({ file: rel(dir, p), msg: 'thư mục không có giao-trinh.md: bỏ qua' }); continue; }
    const r = parseGiaoTrinh(src, rel(dir, join(p, 'giao-trinh.md')), d);
    if (out.some(g => g.id === r.gt.id)) { loi.push({ file: rel(dir, p), msg: `mã giáo trình “${r.gt.id}” bị trùng: bỏ qua` }); continue; }
    (r.gt as GiaoTrinh & { _dir?: string })._dir = p;
    out.push(r.gt); loi.push(...r.loi); canhBao.push(...r.canhBao);
  }
  return { giaoTrinh: out, loi, canhBao };
}

/** Dữ liệu đủ để tạo bài cho một lesson. null = không có giáo trình / lesson đó. */
export function chiTietLesson(dir: string, gtId: string, lessonId: string, root = REPO): ChiTietLesson | null {
  const all = docNguon(dir), gt = all.giaoTrinh.find(g => g.id === gtId) as (GiaoTrinh & { _dir?: string }) | undefined;
  if (!gt || !gt._dir) return null;
  let cd = '';
  gt.units.forEach(u => u.lessons.forEach(l => { if (l.id === lessonId) cd = l.chuyenDe; }));
  const f = { kienThuc: join(gt._dir, 'kien-thuc', lessonId + '.md'), trinhTu: join(gt._dir, 'chuyen-de', cd || '_', 'trinh-tu.md'), tf: join(gt._dir, 'chuyen-de', cd || '_', 'tf.md') };
  const r = ghepLesson(gt, lessonId, { kienThuc: read(f.kienThuc), trinhTu: cd ? read(f.trinhTu) : null, tf: cd ? read(f.tf) : null,
    ten: { kienThuc: rel(dir, f.kienThuc), trinhTu: rel(dir, f.trinhTu), tf: rel(dir, f.tf) } }, docChung(root));
  if (r) { const gl = all.loi.filter(n => n.msg.includes(r.lesson.ten)); r.loi.unshift(...gl); }   // lỗi của chính lesson này trong giao-trinh.md (vd chưa gắn chuyên đề)
  return r;
}

/** Bỏ đường dẫn nội bộ trước khi gửi danh sách giáo trình ra ngoài. */
export const congKhai = (g: GiaoTrinh): GiaoTrinh => { const { _dir, ...x } = g as GiaoTrinh & { _dir?: string }; return x; };

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
