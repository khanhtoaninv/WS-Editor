// Module Tạo bài: API máy chủ (đặc tả mục 9.2), tiền tố /api/taobai/. Đọc dữ liệu giáo trình qua mô-đun chuyển đổi nguon.ts.
//   GET  /api/taobai/giao-trinh                    danh sách giáo trình + lỗi / cảnh báo đọc giao-trinh.md
//   GET  /api/taobai/lesson/:gt/:lesson            chi tiết lesson (Kiến thức, Trình tự đã tách bước, TF, file chung, lỗi) + phiếu đã tạo
//   GET  /api/taobai/phieu/:gt/:lesson/:id         một phiếu đã tạo (JSON phiếu WS Editor)
//   PUT  /api/taobai/phieu/:gt/:lesson/:id         lưu phiếu (app gọi khi Duyệt phiếu / Xuất bản / sinh xong)
// v128 (màn Thiết lập, Kho phiếu):
//   GET  /api/taobai/tong-quan                     cây giáo trình + trạng thái từng file (Kiến thức, Trình tự, TF, file chung)
//   GET  /api/taobai/tep?path=…                    chữ một file dữ liệu
//   PUT  /api/taobai/tep {path, text}              nạp / thay một file (bản cũ giữ ở _cu/)          [cần quyền]
//   PUT  /api/taobai/tep-nhieu {files:{path:text}} nạp nhiều file (cả thư mục giáo trình)            [cần quyền]
//   DELETE /api/taobai/tep?path=…                  bỏ một file (chuyển vào _cu/)                     [cần quyền]
//   PUT/DELETE /api/taobai/chung/:so               nạp / bỏ file chung riêng (về bản mặc định)        [cần quyền]
//   GET  /api/taobai/thiet-lap                     thiết lập AI (không có khóa) + có quyền sửa không
//   PUT  /api/taobai/thiet-lap/ai                  sửa nhà cung cấp / khóa / model                    [cần quyền]
//   POST /api/taobai/thiet-lap/ai/thu              gọi thử AI một câu                                 [cần quyền]
//   GET  /api/taobai/kho-phieu                     mọi phiếu đã tạo (Kho phiếu)
//   DELETE /api/taobai/phieu/:gt/:lesson/:id       bỏ một phiếu khỏi kho (chuyển vào _cu/)            [cần quyền]
// v129 (Sinh bài):
//   POST /api/taobai/ai {system, prompt, loai, meta}  một lượt gọi AI (song song tối đa 3, hàng chờ)  [cần quyền]
//   POST /api/taobai/nhat-ky {…}                   ghi một sự kiện vào nhật ký (mục 6.3)
// "Cần quyền": gọi từ chính máy chạy máy chủ, hoặc đã đăng nhập giáo viên ở /gv (học sinh cùng wifi không đổi được dữ liệu,
// không tiêu hạn mức AI). Phiếu lưu ở <dữ liệu máy chủ>/tao-bai/phieu/<gt>/<lesson>/<id>.json.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, renameSync, appendFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { HttpError, json, type Req, type Res } from '../http.ts';
import { moKho } from './nguon.ts';
import { KhoGhi } from './luu.ts';
import { ThietLap, goiAi } from './thiet-lap.ts';

type On = (method: string, path: string, h: (r: Req, res: Res, m: RegExpMatchArray) => unknown) => void;
const ID = /^[\w-]{1,80}$/;
const id = (s: string) => { const v = decodeURIComponent(s); if (!ID.test(v)) throw new HttpError(400, 'mã không hợp lệ'); return v; };
export const SONG_SONG = 3;

export function taobaiRoutes(on: On, o: { data: string; taobaiData?: string; root?: string; quyen?: (r: Req) => boolean; log?: (m: string) => void }) {
  const base = join(o.data, 'tao-bai'), kg = new KhoGhi(o.data, o.taobaiData), tl = new ThietLap(o.data);
  const store = (gt: string, ls: string) => join(base, 'phieu', gt, ls);
  const kho = () => { const k = moKho(kg.dir, o.root, kg.chungDir); if (!k) throw new HttpError(404, 'không có thư mục dữ liệu giáo trình'); return k; };
  const can = (r: Req) => { if (o.quyen && !o.quyen(r)) throw new HttpError(403, 'Chỉ sửa được trên máy đang chạy máy chủ, hoặc đăng nhập giáo viên ở /gv trước.'); };
  const ghiNhatKy = (e: Record<string, unknown>) => { try { mkdirSync(base, { recursive: true }); appendFileSync(join(base, 'nhat-ky.jsonl'), JSON.stringify({ at: new Date().toISOString(), ...e }) + '\n'); } catch (err) { o.log?.('không ghi được nhật ký: ' + (err as Error).message); } };
  const tomTat = (w: any, f: string) => {
    const g = w.gen || {}, s = g.src || {}, ts = (w.tasks || []).filter((t: any) => t.gen);
    return { id: f.slice(0, -5), at: g.savedAt || '', n: (w.tasks || []).length, title: w.title || '',
      names: s.names || {}, duyet: ts.filter((t: any) => t.gen.status === 'ok').length, cho: ts.filter((t: any) => t.gen.status === 'wait').length };
  };
  const phieu = (gt: string, ls: string) => {
    const d = store(gt, ls); if (!existsSync(d)) return [];
    return readdirSync(d).filter(f => f.endsWith('.json')).map(f => { try { return tomTat(JSON.parse(readFileSync(join(d, f), 'utf8')), f); } catch { return null; } })
      .filter(Boolean).sort((a: any, b: any) => String(b.at).localeCompare(String(a.at)));
  };

  // ---------- đọc dữ liệu (T3) ----------
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

  // ---------- Thiết lập: dữ liệu giáo trình, file chung (v128) ----------
  on('GET', '/api/taobai/tong-quan', r => ({ ...kho().tongQuan(), quyen: !o.quyen || o.quyen(r) }));
  on('GET', '/api/taobai/tep', r => { const p = KhoGhi.hopLe(r.query.get('path') || ''), t = kg.doc(p); if (t == null) throw new HttpError(404, 'chưa có file này'); return { path: p, text: t }; });
  on('PUT', '/api/taobai/tep', async r => {
    can(r); const b = await json<{ path?: string; text?: string }>(r, 1048576);
    const x = kg.ghi(String(b.path || ''), String(b.text ?? '')); ghiNhatKy({ ev: 'nap-tep', path: x.path, doi: x.doi });
    return { ...x, ...kho().tongQuan() };
  });
  on('PUT', '/api/taobai/tep-nhieu', async r => {
    can(r); const b = await json<{ files?: Record<string, string> }>(r, 8 * 1048576), files = b.files || {};
    const ok: string[] = [], bo: { path: string; why: string }[] = [];
    for (const [p, t] of Object.entries(files)) { try { kg.ghi(p, t); ok.push(KhoGhi.hopLe(p)); } catch (e) { bo.push({ path: p, why: (e as Error).message }); } }
    if (!ok.length) throw new HttpError(400, 'không có file nào đúng chỗ (xem docs/TAO_BAI/DINH_DANG_TAM.md)' + (bo.length ? `: ${bo.slice(0, 3).map(x => x.path).join(', ')}…` : ''));
    ghiNhatKy({ ev: 'nap-thu-muc', n: ok.length, bo: bo.length }); return { ok, bo, ...kho().tongQuan() };
  });
  on('DELETE', '/api/taobai/tep', r => { can(r); const x = kg.xoa(r.query.get('path') || ''); ghiNhatKy({ ev: 'bo-tep', path: x.path }); return { ...x, ...kho().tongQuan() }; });
  on('PUT', '/api/taobai/chung/:so', async (r, _res, m) => { can(r); const b = await json<{ text?: string }>(r, 1048576); kg.ghiChung(+m[1], String(b.text ?? '')); ghiNhatKy({ ev: 'nap-chung', so: +m[1] }); return kho().tongQuan(); });
  on('DELETE', '/api/taobai/chung/:so', (r, _res, m) => { can(r); kg.ghiChung(+m[1], null); ghiNhatKy({ ev: 'bo-chung', so: +m[1] }); return kho().tongQuan(); });

  // ---------- Thiết lập: AI ----------
  on('GET', '/api/taobai/thiet-lap', r => ({ ai: tl.xem(), quyen: !o.quyen || o.quyen(r) }));
  on('PUT', '/api/taobai/thiet-lap/ai', async r => { can(r); const v = tl.sua(await json(r)); ghiNhatKy({ ev: 'thiet-lap-ai', nhaCC: v.nhaCC, model: v.dangDung?.model || '' }); return { ai: v, quyen: true }; });
  on('POST', '/api/taobai/thiet-lap/ai/thu', async r => {
    can(r); const c = tl.dung(); if (!c) throw new HttpError(400, 'chưa có khóa API (hoặc thiếu địa chỉ / model)');
    const t0 = Date.now(), x = await goiAi(c, { prompt: 'Reply with exactly: OK', maxTokens: 20 }, 60000);
    return { ok: true, model: x.model, text: x.text.slice(0, 80), ms: Date.now() - t0 };
  });

  // ---------- Kho phiếu ----------
  on('GET', '/api/taobai/kho-phieu', () => {
    const root = join(base, 'phieu'), out: any[] = []; if (!existsSync(root)) return { phieu: out };
    for (const gt of readdirSync(root)) { const gd = join(root, gt); if (!ID.test(gt) || !statSync(gd).isDirectory()) continue;
      for (const ls of readdirSync(gd)) { if (ID.test(ls)) phieu(gt, ls).forEach((p: any) => out.push({ gt, ls, ...p })); } }
    return { phieu: out.sort((a, b) => String(b.at).localeCompare(String(a.at))) };
  });
  on('DELETE', '/api/taobai/phieu/:gt/:ls/:id', (r, _res, m) => {
    can(r); const gt = id(m[1]), ls = id(m[2]), pid = id(m[3]), p = join(store(gt, ls), pid + '.json'); if (!existsSync(p)) throw new HttpError(404, 'không có phiếu này');
    const to = join(base, '_cu', 'phieu', gt, ls, `${pid}.${new Date().toISOString().replace(/[:.]/g, '-')}.json`); mkdirSync(dirname(to), { recursive: true }); renameSync(p, to);
    ghiNhatKy({ ev: 'bo-phieu', gt, ls, id: pid }); return { ok: true };
  });

  // ---------- Sinh bài (v129): một lượt gọi AI ----------
  let dangChay = 0; const cho: (() => void)[] = [];
  const vao = () => new Promise<void>(ok => { if (dangChay < SONG_SONG) { dangChay++; ok(); } else cho.push(() => { dangChay++; ok(); }); });
  const ra = () => { dangChay--; const f = cho.shift(); if (f) f(); };
  on('GET', '/api/taobai/ai', r => { const v = tl.xem(); return { san: v.san, dangDung: v.dangDung, quyen: !o.quyen || o.quyen(r) }; });
  on('POST', '/api/taobai/ai', async r => {
    can(r); const b = await json<{ system?: string; prompt?: string; loai?: string; meta?: Record<string, unknown> }>(r, 2 * 1048576);
    const c = tl.dung(); if (!c) throw new HttpError(409, 'Máy chủ chưa có khóa AI: mở Thiết lập › AI để nhập khóa, hoặc dùng chế độ AI ngoài (chép đoạn nhắc).');
    if (!b.prompt || typeof b.prompt !== 'string') throw new HttpError(400, 'thiếu đoạn nhắc');
    await vao(); const t0 = Date.now();
    try {
      const x = await goiAi(c, { system: b.system, prompt: b.prompt, maxTokens: 6000 });
      ghiNhatKy({ ev: 'ai', loai: b.loai || 'sinh', nhaCC: c.nhaCC, model: x.model, vao: x.vao, ra: x.ra, ms: Date.now() - t0, ...(b.meta || {}) });
      return { text: x.text, model: x.model, vao: x.vao, ra: x.ra, ms: Date.now() - t0 };
    } catch (e) { ghiNhatKy({ ev: 'ai-loi', loai: b.loai || 'sinh', nhaCC: c.nhaCC, model: c.model, loi: (e as Error).message, ms: Date.now() - t0, ...(b.meta || {}) }); throw e; }
    finally { ra(); }
  });
  on('POST', '/api/taobai/nhat-ky', async r => {
    const b = await json<Record<string, unknown>>(r, 256 * 1024); if (!b || typeof b.ev !== 'string') throw new HttpError(400, 'thiếu “ev”');
    ghiNhatKy({ ...b, ev: 'app-' + String(b.ev).slice(0, 40) }); return { ok: true };
  });
}
