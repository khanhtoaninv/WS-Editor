// Module Tạo bài: API máy chủ (đặc tả mục 9.2), tiền tố /api/taobai/. Đọc dữ liệu giáo trình qua mô-đun chuyển đổi nguon.ts.
//   GET  /api/taobai/giao-trinh                    danh sách giáo trình + lỗi / cảnh báo đọc giao-trinh.md
//   GET  /api/taobai/lesson/:gt/:lesson            chi tiết lesson (Kiến thức, Trình tự đã tách bước, TF, file chung, lỗi) + phiếu đã tạo
//   GET  /api/taobai/phieu/:gt/:lesson/:id         một phiếu đã tạo (JSON phiếu WS Editor)
//   PUT  /api/taobai/phieu/:gt/:lesson/:id         lưu phiếu (app gọi khi Duyệt phiếu / Xuất bản)
// Phiếu lưu ở <thư mục dữ liệu máy chủ>/tao-bai/phieu/<gt>/<lesson>/<id>.json. Sinh / chấm bằng AI: giai đoạn T4, T5.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { HttpError, json, type Req, type Res } from '../http.ts';
import { moKho, DATA_DIR } from './nguon.ts';

type On = (method: string, path: string, h: (r: Req, res: Res, m: RegExpMatchArray) => unknown) => void;
const ID = /^[\w-]{1,80}$/;
const id = (s: string) => { const v = decodeURIComponent(s); if (!ID.test(v)) throw new HttpError(400, 'mã không hợp lệ'); return v; };

export function taobaiRoutes(on: On, o: { data: string; taobaiData?: string }) {
  const dir = o.taobaiData || DATA_DIR, store = (gt: string, ls: string) => join(o.data, 'tao-bai', 'phieu', gt, ls);
  const kho = () => { const k = moKho(dir); if (!k) throw new HttpError(404, 'không có thư mục dữ liệu giáo trình'); return k; };
  const phieu = (gt: string, ls: string) => {
    const d = store(gt, ls); if (!existsSync(d)) return [];
    return readdirSync(d).filter(f => f.endsWith('.json')).map(f => { try { const w = JSON.parse(readFileSync(join(d, f), 'utf8')); return { id: f.slice(0, -5), at: w.gen?.savedAt || '', n: (w.tasks || []).length, title: w.title || '' }; } catch { return null; } })
      .filter(Boolean).sort((a: any, b: any) => String(b.at).localeCompare(String(a.at)));
  };
  on('GET', '/api/taobai/giao-trinh', () => { const k = kho(); return { giaoTrinh: k.giaoTrinh, loi: k.loi, canhBao: k.canhBao }; });
  on('GET', '/api/taobai/lesson/:gt/:ls', (_r, _res, m) => {
    const gt = id(m[1]), ls = id(m[2]), c = kho().chiTiet(gt, ls); if (!c) throw new HttpError(404, 'không có lesson này');
    return Object.assign(c, { phieu: phieu(gt, ls) });
  });
  on('GET', '/api/taobai/phieu/:gt/:ls/:id', (_r, _res, m) => {
    const p = join(store(id(m[1]), id(m[2])), id(m[3]) + '.json'); if (!existsSync(p)) throw new HttpError(404, 'không có phiếu này');
    return JSON.parse(readFileSync(p, 'utf8'));
  });
  on('PUT', '/api/taobai/phieu/:gt/:ls/:id', async (r, _res, m) => {
    const w = await json(r, 8 * 1048576); if (!w || !Array.isArray(w.tasks) || !w.gen) throw new HttpError(400, 'không phải phiếu tạo từ module Tạo bài');
    const d = store(id(m[1]), id(m[2])); mkdirSync(d, { recursive: true });
    w.gen.savedAt = new Date().toISOString(); writeFileSync(join(d, id(m[3]) + '.json'), JSON.stringify(w));
    return { ok: true, at: w.gen.savedAt };
  });
}
