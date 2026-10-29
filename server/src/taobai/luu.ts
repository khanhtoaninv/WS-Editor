// Module Tạo bài v128: KHO DỮ LIỆU GHI ĐƯỢC trên máy chủ (màn Thiết lập nạp file vào đây).
//   <dữ liệu máy chủ>/tao-bai/du-lieu/      giáo trình (định dạng tạm, docs/TAO_BAI/DINH_DANG_TAM.md)
//   <dữ liệu máy chủ>/tao-bai/chung/<so>.md file chung giáo viên nạp (thay bản mặc định trong docs/TAO_BAI/)
//   <dữ liệu máy chủ>/tao-bai/_cu/…         bản cũ của mỗi file trước khi bị thay / xóa (giữ hết, không tự xóa)
// Lần chạy đầu (chưa có du-lieu/): chép bộ mẫu server/demo/tao-bai vào để có sẵn dữ liệu thử.
// Biến môi trường TAOBAI_DATA: dùng thẳng thư mục đó làm kho (không chép mẫu).
import { existsSync, mkdirSync, cpSync, readFileSync, writeFileSync, renameSync, rmSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { HttpError } from '../http.ts';
import { TEP_HOP_LE } from '../../../shared/src/taobai/index.ts';
import { DEMO_DIR } from './nguon.ts';

export const MAX_TEP = 512 * 1024;
const stamp = () => new Date().toISOString().replace(/[:.]/g, '-');
/** Chữ nạp lên: bỏ BOM, đổi xuống dòng Windows. */
export const chuanChu = (s: string) => String(s ?? '').replace(/^﻿/, '').replace(/\r\n?/g, '\n');

export class KhoGhi {
  readonly dir: string; readonly chungDir: string; readonly cuDir: string;
  constructor(data: string, taobaiData?: string) {
    const base = join(data, 'tao-bai');
    this.dir = taobaiData ? resolve(taobaiData) : join(base, 'du-lieu');
    this.chungDir = join(base, 'chung'); this.cuDir = join(base, '_cu');
    if (!taobaiData && !existsSync(this.dir) && existsSync(DEMO_DIR)) { mkdirSync(dirname(this.dir), { recursive: true }); cpSync(DEMO_DIR, this.dir, { recursive: true, filter: s => !/README\.md$/i.test(s) }); }
    mkdirSync(this.dir, { recursive: true });
  }
  /** Kiểm đường dẫn file giáo trình (chỉ các vị trí của định dạng tạm). */
  static hopLe(path: string): string {
    const p = String(path || '').replace(/\\/g, '/').replace(/^\.?\//, '');
    if (!TEP_HOP_LE.test(p)) throw new HttpError(400, `đường dẫn file không hợp lệ: “${p}”`);
    return p;
  }
  private giuBanCu(abs: string, rel: string) {
    if (!existsSync(abs)) return;
    const to = join(this.cuDir, `${rel}.${stamp()}.md`); mkdirSync(dirname(to), { recursive: true }); renameSync(abs, to);
  }
  doc(rel: string): string | null { const a = join(this.dir, KhoGhi.hopLe(rel)); return existsSync(a) && statSync(a).isFile() ? readFileSync(a, 'utf8') : null; }
  ghi(rel: string, text: string) {
    const p = KhoGhi.hopLe(rel), t = chuanChu(text);
    if (Buffer.byteLength(t) > MAX_TEP) throw new HttpError(413, `file quá lớn (tối đa ${MAX_TEP / 1024} KB)`);
    if (!t.trim()) throw new HttpError(400, 'file trống');
    const abs = join(this.dir, p);
    if (existsSync(abs) && readFileSync(abs, 'utf8') === t) return { path: p, doi: false };
    this.giuBanCu(abs, p); mkdirSync(dirname(abs), { recursive: true }); writeFileSync(abs, t);
    return { path: p, doi: true };
  }
  xoa(rel: string) { const p = KhoGhi.hopLe(rel), abs = join(this.dir, p); if (!existsSync(abs)) throw new HttpError(404, 'không có file này'); this.giuBanCu(abs, p); return { path: p }; }
  ghiChung(so: number, text: string | null) {
    if (![1, 2, 3, 4, 5].includes(so)) throw new HttpError(400, 'file chung chỉ có số 1–5');
    const rel = `chung-${so}`, abs = join(this.chungDir, `${so}.md`);
    if (text == null) { if (existsSync(abs)) this.giuBanCu(abs, rel); return { so, rieng: false }; }
    const t = chuanChu(text); if (!t.trim()) throw new HttpError(400, 'file trống');
    if (Buffer.byteLength(t) > MAX_TEP) throw new HttpError(413, `file quá lớn (tối đa ${MAX_TEP / 1024} KB)`);
    this.giuBanCu(abs, rel); mkdirSync(this.chungDir, { recursive: true }); writeFileSync(abs, t);
    return { so, rieng: true };
  }
  /** Chỉ dùng trong test: bỏ cả kho. */
  _xoaHet() { rmSync(this.dir, { recursive: true, force: true }); }
}
