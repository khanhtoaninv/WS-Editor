// Chấm chữa (v120); báo cáo lớp / từng em và insight thêm ở v121–v122. Gắn thêm đường dẫn vào máy chủ (app.ts).
// Mọi phép tính báo cáo nằm ở shared/src/baocao.ts (TeacherResource dùng lại được); ở đây chỉ gom dữ liệu và kiểm quyền.
import type { Ctx } from './app.ts';
import { HttpError, bad, json } from './http.ts';
import type { Overrides, Slot, Key } from '../../shared/src/index.ts';
import { taskInfo, type Sub } from '../../shared/src/baocao.ts';

type On = (m: string, p: string, h: (r: any, res: any, m: RegExpMatchArray) => unknown) => void;
const now = () => new Date().toISOString();

export function extraRoutes(on: On, ctx: Ctx, u: { needGv: (r: any) => void; phienOf: (id: string) => any; grade: Function }) {
  const { st, goiData } = ctx;
  const subsOf = (p: any): Sub[] => {
    const lop = st.lop.find(l => l.id === p.lop);
    return (lop?.hocSinh || []).map(h => { const b = p.bai[h.id]; return { hs: h.id, ten: h.ten, nop: !!b?.nopLuc, vao: !!b?.vaoLuc, answers: b?.answers || {}, overrides: b?.cham?.overrides || {}, xong: !!b?.cham?.xongLuc, nhanXet: b?.cham?.nhanXet || '' }; });
  };
  const tasksOf = (goi: string) => {
    const d = goiData(goi), html = d.manifest.pages.map(pg => { const f = st.goiFile(goi, pg.file); return f ? new TextDecoder().decode(f) : ''; });
    return taskInfo(html);
  };
  const cleanOv = (slots: Slot[], key: Key, o: unknown): Overrides => {
    if (!o || typeof o !== 'object') throw bad('điểm không hợp lệ');
    const by = new Map(slots.map(s => [s.id, s])), out: Overrides = {};
    for (const [id, v] of Object.entries(o as Record<string, any>)) {
      const s = by.get(id); if (!s || !v || typeof v !== 'object') continue;
      const max = key[id]?.score ?? 1, sc = Number(v.score);
      if (!Number.isFinite(sc)) continue;
      out[id] = { score: Math.max(0, Math.min(max, Math.round(sc * 100) / 100)), ...(v.comment ? { comment: String(v.comment).slice(0, 500) } : {}) };
    }
    return out;
  };

  // danh sách chấm: mọi em + điểm tạm (máy chấm + phần đã chấm tay)
  on('GET', '/api/phien/:id/cham', (r, _res, m) => {
    u.needGv(r); const p = u.phienOf(m[1]), d = goiData(p.goi);
    return { phien: ctx.phienView(p), slots: d.slots, key: d.key, pages: d.manifest.pages.map(x => x.file), title: d.manifest.title, tasks: tasksOf(p.goi),
      hocSinh: subsOf(p).map(s => { const g = u.grade(d.slots, d.key, s.answers, s.overrides); return { hs: s.hs, ten: s.ten, nop: s.nop, vao: s.vao, xong: s.xong, score: g.score, max: g.max, pending: g.pendingManual, answers: s.answers, overrides: s.overrides, nhanXet: s.nhanXet }; }) };
  });
  on('PUT', '/api/phien/:id/cham/:hs', async (r, _res, m) => {
    u.needGv(r); const p = u.phienOf(m[1]);
    if (p.trangThai !== 'dong') throw new HttpError(409, 'Kết thúc phiên rồi mới chấm chữa');
    const lop = st.lop.find(l => l.id === p.lop); if (!lop?.hocSinh.some(h => h.id === m[2])) throw new HttpError(404, 'không có học sinh này');
    const b = await json<{ overrides?: unknown; nhanXet?: string; xong?: boolean }>(r), d = goiData(p.goi);
    const bai = p.bai[m[2]] || (p.bai[m[2]] = { answers: {} });
    const c = bai.cham || (bai.cham = { overrides: {} });
    if (b.overrides !== undefined) c.overrides = cleanOv(d.slots, d.key, b.overrides);
    if (b.nhanXet !== undefined) c.nhanXet = String(b.nhanXet).slice(0, 2000);
    if (b.xong !== undefined) { if (b.xong) c.xongLuc = now(); else delete c.xongLuc; }
    c.suaLuc = now(); st.touch(`phien:${p.id}`);
    const g = u.grade(d.slots, d.key, bai.answers, c.overrides);
    ctx.emit(p.id, 'hs', ctx.progress(p, m[2]));
    return { score: g.score, max: g.max, pending: g.pendingManual, xong: !!c.xongLuc };
  });
}
