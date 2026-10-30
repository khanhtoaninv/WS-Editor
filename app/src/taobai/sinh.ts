// Module Tạo bài v129: SINH BÀI (đặc tả mục 8, quy tắc docs/TAO_BAI/QUY_TAC_SINH_BAI.md, mã S…).
//   - chế độ máy chủ: mỗi bài một lượt POST /api/taobai/ai (song song tối đa 3, S8), đọc bằng bộ đọc của app, lỗi phải sửa
//     thì gửi lại đúng chỗ lỗi tối đa 2 lần (S13–S16), xong bài nào điền bài đó (⏳ → ○ / ⚠, S10), không ghi đè bài
//     giáo viên đang sửa (S20); sinh xong cả phiếu thì lưu vào Kho phiếu (S11).
//   - chế độ AI ngoài (S24–S25): cùng đoạn nhắc, giáo viên chép / dán; cùng bước đọc + kiểm.
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as St from '../core/state.js';
import { readMd, sheetToMd } from '../core/md.js';
import { its } from '../core/model.js';
import { qOf } from '../core/layout.js';
import { L } from '../ui/legacyApi';
import { useUi, publish } from '../ui/store';
import { toast } from '../ui/Toast';
import { dungNhac, nhacChep, tachMeta, Q_NAME, NHAC_VER, type NhacVao, type BaiDaCo, type QCode, type Nhac } from '../../../shared/src/taobai/index.ts';
import { moNguon, nguonHienTai, goi } from './nguon';
import { sigTask, genTasks, hasGen } from './gen';
import { countOf, checkTask } from './maykiem';

export const SONG_SONG = 3, GUI_LAI = 2;
const W = (): any => St.ws;
const find = (id: string) => (W()?.tasks || []).find((t: any) => t.id === id);
const tick = () => { const tb = useUi.getState().tb; publish({ tb: Object.assign({}, tb, { sv: tb.sv + 1 }) }); };
const nghi = (ms: number) => new Promise(ok => setTimeout(ok, ms));

// ---------- chế độ: máy chủ có khóa → gọi AI; còn lại → AI ngoài (S24) ----------
export type CheDo = { mode: 'may' | 'ngoai'; ten: string; ly?: string };
export const TEN: Record<string, string> = { 'claude-sonnet-5-5': 'Claude Sonnet 5.5', 'claude-haiku-5-5': 'Claude Haiku 5.5' };
let cd: { at: number; v: CheDo } | null = null;
export async function cheDo(force = false): Promise<CheDo> {
  if (!force && cd && Date.now() - cd.at < 15000) return cd.v;
  const n = nguonHienTai() || await moNguon(); let v: CheDo;
  if (n.mode !== 'may-chu') v = { mode: 'ngoai', ten: 'AI ngoài', ly: 'mở thẳng file HTML (không qua máy chủ)' };
  else {
    try { const r = await goi('/api/taobai/ai'); v = r.san && r.quyen ? { mode: 'may', ten: TEN[r.dangDung.model] || r.dangDung.model } : { mode: 'ngoai', ten: 'AI ngoài', ly: !r.san ? 'máy chủ chưa có khóa AI (Thiết lập › AI)' : 'máy này không có quyền gọi AI qua máy chủ' }; }
    catch (e) { v = { mode: 'ngoai', ten: 'AI ngoài', ly: (e as Error).message }; }
  }
  const doi = !cd || cd.v.mode !== v.mode || cd.v.ten !== v.ten; cd = { at: Date.now(), v }; if (doi) tick(); return v;
}
export const cheDoHienTai = () => cd?.v || null;

// ---------- đọc kết quả AI (S13, S14, S17) ----------
export type KetQua = { task: any | null; loi: string[]; nhe: string[]; goal: string; ctx: string; md: string };
/** Bỏ khối ``` bao ngoài và chữ đứng trước dòng "## Task:" đầu tiên (S13). */
export function lamSach(raw: string): string {
  let s = String(raw || '').replace(/\r/g, '').trim();
  const f = /^```[\w-]*[ \t]*\n([\s\S]*?)\n```\s*$/.exec(s); if (f) s = f[1].trim();
  const i = s.search(/^##(?!#)\s*task\b/im); if (i > 0) s = s.slice(i);
  return s.replace(/\n```\s*$/, '').trim();
}
export function docKetQua(raw: string, g: { q: QCode; n: number }): KetQua {
  const md = lamSach(raw), m = tachMeta(md), loi: string[] = [], nhe: string[] = [];
  const out = (task: any) => ({ task, loi, nhe, goal: m.goal, ctx: m.ctx, md });
  if (!m.tasks) { loi.push('không có dòng “## Task: …” (bài phải bắt đầu bằng dòng này)'); return out(null); }
  if (m.tasks > 1) loi.push(`có ${m.tasks} dòng “## Task:”: chỉ viết MỘT bài`);
  m.notes.filter(x => /^thiếu/.test(x)).forEach(x => nhe.push(x));
  const J: any = readMd(m.md);
  if (J.err) { loi.push('app không đọc được: ' + J.err); return out(null); }
  if (J.tasks.length > 1 && m.tasks === 1) loi.push('bài bị tách thành nhiều phần (dòng “### Phần:”, hoặc dòng chữ không số đứng trước câu 1): viết liền một bài');
  const r0 = J.tasks[0]; if (!r0 || !r0.t) { loi.push((r0 && r0.err) || 'app không đọc được bài'); return out(null); }
  const t = r0.t, q = qOf(t);
  if (q !== g.q) loi.push(`sai dạng: cần ${g.q} ${Q_NAME[g.q]} (dòng “Dạng:” đúng dạng này), app đọc ra ${q} ${(Q_NAME as any)[q] || ''}`.trim());
  (r0.notes || []).forEach((x: string) => (/^đáp án có \d+ dòng/.test(x) ? loi : nhe).push(x));
  (J.mdNotes || []).forEach((x: string) => nhe.push(x));
  if (q === g.q) { const d = checkTask(Object.assign({}, t, { gen: {} })).find(c => c.id === 'dapan' && !c.ok); if (d) loi.push(`thiếu đáp án: ${d.why} (ghi ở “## Đáp án” → “### Task 1”, hoặc đúng cách của dạng)`); }
  return out(t);
}

// ---------- dựng đoạn nhắc cho một bài ----------
const textOf = (x: any) => x.pair ? [x.pair.l?.text, x.pair.r?.text].filter(Boolean).join(' - ') : String(x.text || '').replace(/<[^>]+>|\*\*/g, '');
/** MD một bài (gồm sửa tay), để gửi kèm khi sinh lại (S22). */
export function mdCua(t: any): string {
  const w = W(), md = sheetToMd({ title: 'x', age: w?.age || '7-9', flow: 'cont', tasks: [JSON.parse(JSON.stringify(t))] });
  const i = md.search(/^## Task/m); return (i >= 0 ? md.slice(i) : md).trim();
}
async function lessonOf(w: any) {
  const s = w.gen?.src; if (!s || !s.course || !s.lesson) throw new Error('phiếu không ghi giáo trình / lesson (không tạo từ màn Ra đề)');
  const n = nguonHienTai() || await moNguon(), l = await n.lesson(s.course, s.lesson);
  if (!l) throw new Error(`không còn lesson ${s.lesson} trong dữ liệu (${n.ten})`);
  if (l.loi.length) throw new Error('dữ liệu lesson đang lỗi: ' + l.loi[0].msg);
  return l;
}
/** Đầu vào đoạn nhắc của bài id. Cấu trúc lấy từ các bài tạo bài hiện có (đúng thứ tự trên phiếu). */
export async function vaoNhac(id: string, o: { gopY?: string; sinhLai?: boolean } = {}): Promise<NhacVao> {
  const w = W(), a = genTasks(w), k = a.findIndex((x: any) => x.id === id); if (k < 0) throw new Error('bài này không thuộc phần tạo bài');
  const les = await lessonOf(w), t = a[k];
  const daCo: BaiDaCo[] = a.map((x: any, i: number) => ({ x, i })).filter(({ x }: any) => x.id !== id && x.gen.status !== 'wait' && x.gen.md)
    .map(({ x, i }: any) => ({ so: i + 1, q: qOf(x), title: x.title || '', ctx: x.gen.ctx, cau: its(x).filter((y: any) => !y.ex && !y.gt).slice(0, 3).map(textOf).filter(Boolean) }));
  return { les, cauTruc: a.map((x: any) => ({ step: x.gen.step, role: x.gen.role || '', q: x.gen.q || qOf(x), n: x.gen.n || countOf(x), ...(x.gen.yc ? { yc: x.gen.yc } : {}) })), k, ghiChu: w.gen.note || '', daCo,
    ...(o.sinhLai ? { banHienTai: mdCua(t), gopY: o.gopY || '' } : {}) };
}

// ---------- ghép kết quả vào phiếu (S19–S21) ----------
function ganKetQua(id: string, sig0: string, kq: KetQua, meta: { tries: number; model: string; ver: string }) {
  if (L.viewing) { setTimeout(() => ganKetQua(id, sig0, kq, meta), 700); return; }
  let sua = false; const at = new Date().toISOString();
  L.commit((w2: any) => {
    const i = w2.tasks.findIndex((x: any) => x.id === id); if (i < 0) return; const cur = w2.tasks[i], g = cur.gen; if (!g) return;
    const ghi = { goal: kq.goal, ctx: kq.ctx, md: kq.md, mdNotes: [...kq.loi.map(x => 'AI viết sai: ' + x), ...kq.nhe], tries: meta.tries, model: meta.model, nhac: meta.ver, at };
    if (sigTask(cur) !== sig0) { sua = true; g.spare = { md: kq.md, at, model: meta.model }; if (g.status === 'wait') g.status = 'todo'; return; }
    if (!kq.task) { Object.assign(g, ghi, { status: 'todo' }); delete g.spare; return; }
    const nt = JSON.parse(JSON.stringify(kq.task)); nt.id = id;
    nt.gen = Object.assign({}, g, ghi, { status: 'todo' }); delete nt.gen.spare; delete nt.gen.loiGoi;
    w2.tasks[i] = nt;
  });
  const t = find(id); if (t && t.gen && !sua && kq.task) t.gen.genSig = sigTask(t);   // dấu bản AI (sau tidy): Duyệt so để biết có sửa tay
  if (sua) toast(`Bài ${genTasks(W()).findIndex((x: any) => x.id === id) + 1}: AI viết xong nhưng bài đang được sửa tay, chưa thay (ngăn Duyệt: “Dùng bản AI vừa viết”)`);
}
function ganLoi(id: string, msg: string) {
  if (L.viewing) { setTimeout(() => ganLoi(id, msg), 700); return; }
  L.commit((w2: any) => { const t = w2.tasks.find((x: any) => x.id === id); if (t && t.gen) { if (t.gen.status === 'wait') t.gen.status = 'todo'; t.gen.loiGoi = msg; t.gen.mdNotes = [`Chưa sinh được: ${msg}. Bấm “Sinh lại”.`]; } });
}

// ---------- gọi AI qua máy chủ ----------
async function goiAi(n: Nhac, meta: Record<string, unknown>): Promise<{ text: string; model: string }> {
  const body = { system: n.system, prompt: n.prompt, loai: meta.lan && +meta.lan > 1 ? 'sua' : 'sinh', meta: { ...meta, nhac: n.ver } };
  try { return await goi('/api/taobai/ai', { method: 'POST', json: body }); }
  catch (e) {
    if (!/429|529|quá tải/i.test((e as Error).message)) throw e;
    await nghi((globalThis as any).__tbCho ?? 4000); return goi('/api/taobai/ai', { method: 'POST', json: body });   // S18: quá tải thì chờ rồi thử lại một lần
  }
}
export function ghiNhatKy(e: Record<string, unknown>) {
  const n = nguonHienTai(); if (!n || n.mode !== 'may-chu') return;
  const s = W()?.gen?.src || {}; goi('/api/taobai/nhat-ky', { method: 'POST', json: { gt: s.course, ls: s.lesson, phieu: W()?.id, ...e } }).catch(() => {});
}

// ---------- hàng chờ ----------
const chay = new Map<string, { tok: number; lan: number }>(), hang: { id: string; o: { gopY?: string; sinhLai?: boolean } }[] = [];
let seq = 0, dem = { ok: 0, warn: 0, loi: 0 };
export const dangChay = (id: string) => chay.get(id) || null;
export const soDangChay = () => chay.size + hang.length;

async function chayMot(id: string, o: { gopY?: string; sinhLai?: boolean }) {
  const tok = ++seq, st = { tok, lan: 1 }; chay.set(id, st); tick();
  const huy = () => chay.get(id)?.tok !== tok;
  let so = 0, base: NhacVao | null = null, nh: Nhac | null = null;
  try {
    if (!find(id)?.gen) return;
    if (find(id).gen.status !== 'wait') L.commit((w2: any) => { const x = w2.tasks.find((y: any) => y.id === id); if (x && x.gen) { x.gen.status = 'wait'; delete x.gen.spare; } });
    const sig0 = sigTask(find(id));
    base = await vaoNhac(id, o); so = base.k + 1; nh = dungNhac(base);
    let kq: KetQua | null = null, model = '';
    for (let lan = 1; ; lan++) {
      st.lan = lan; tick();
      const r = await goiAi(nh, { bai: so, q: nh.q, n: nh.n, lan });
      if (huy()) return;
      model = r.model; kq = docKetQua(r.text, { q: nh.q, n: nh.n });
      if (!kq.loi.length || lan > GUI_LAI) break;
      nh = dungNhac({ ...base, sua: { md: kq.md, loi: kq.loi } });     // S15: gửi lại đúng chỗ lỗi
    }
    ganKetQua(id, sig0, kq!, { tries: st.lan, model, ver: nh.ver });
    if (kq!.loi.length || kq!.nhe.length) dem.warn++; else dem.ok++;
    ghiNhatKy({ ev: o.sinhLai ? 'sinh-lai-xong' : 'sinh-xong', bai: so, q: nh.q, n: nh.n, lan: st.lan, loi: kq!.loi, nhe: kq!.nhe.length, model });
  } catch (e) {
    if (huy()) return;
    dem.loi++; ganLoi(id, (e as Error).message); ghiNhatKy({ ev: 'sinh-loi', bai: so, loi: (e as Error).message });
  } finally { if (!huy()) chay.delete(id); tick(); }
}
function bom() {
  while (chay.size < SONG_SONG && hang.length) { const x = hang.shift()!; chayMot(x.id, x.o).finally(() => { bom(); if (!chay.size && !hang.length) xongHet(); }); }
  tick();
}
function xongHet() {
  const d = dem; dem = { ok: 0, warn: 0, loi: 0 }; if (!d.ok && !d.warn && !d.loi) return;
  toast(`Sinh xong: ${d.ok} bài ○ chờ duyệt${d.warn ? ` · ${d.warn} bài ⚠ cần xem` : ''}${d.loi ? ` · ${d.loi} bài chưa sinh được` : ''}`);
  luuMayChu();   // S11
}
/** Đưa các bài vào hàng chờ sinh (chế độ máy chủ). Không đưa thì: mọi bài ⏳ của phiếu. */
export function sinh(ids?: string[], o: { gopY?: string; sinhLai?: boolean } = {}) {
  const w = W(); if (!w || !hasGen(w)) return 0;
  const list = ids || genTasks(w).filter((t: any) => t.gen.status === 'wait' && !chay.has(t.id)).map((t: any) => t.id);
  list.forEach((id: string) => { const k = hang.findIndex(x => x.id === id); if (k >= 0) hang.splice(k, 1); if (o.sinhLai && chay.has(id)) chay.delete(id); if (!chay.has(id)) hang.push({ id, o }); });
  bom(); return list.length;
}
/** Dừng: bỏ hàng chờ, bỏ kết quả các lượt đang chạy (bài vẫn ⏳, bấm "Sinh" để chạy lại). */
export function dung() { hang.length = 0; chay.clear(); dem = { ok: 0, warn: 0, loi: 0 }; tick(); }

/** Sau khi Sinh bài ở màn Ra đề (hoặc mở phiếu còn bài ⏳): máy chủ có khóa → chạy; không → AI ngoài, mở ngăn Duyệt ở bài đầu. */
export async function batDau(moNgan: (id: string) => void) {
  const v = await cheDo(true), w = W(); if (!w || !hasGen(w)) return;
  const cho = genTasks(w).filter((t: any) => t.gen.status === 'wait');
  if (!cho.length) return;
  if (v.mode === 'may') { sinh(); toast(`${v.ten} đang viết ${cho.length} bài (song song ${SONG_SONG} bài)…`); }
  else { moNgan(cho[0].id); toast(`Chế độ AI ngoài (${v.ly}): ở ngăn Duyệt, chép đoạn nhắc từng bài sang AI rồi dán kết quả về`); }
}

// ---------- AI ngoài (S25) ----------
export async function nhacNgoai(id: string, o: { gopY?: string; sinhLai?: boolean; sua?: { md: string; loi: string[] } } = {}) {
  const v = await vaoNhac(id, o); return nhacChep(dungNhac({ ...v, ...(o.sua ? { sua: o.sua } : {}) }));
}
/** Nạp kết quả dán từ AI ngoài. Có lỗi phải sửa và chưa "vẫn dùng" → không ghép, trả lỗi để giáo viên gửi lại. */
export function napNgoai(id: string, raw: string, vanDung = false): KetQua | null {
  const t = find(id); if (!t || !t.gen) return null;
  const kq = docKetQua(raw, { q: t.gen.q || qOf(t), n: t.gen.n || countOf(t) });
  if (kq.loi.length && !vanDung) return kq;
  ganKetQua(id, sigTask(t), kq, { tries: (t.gen.triesNgoai || 0) + 1, model: 'AI ngoài', ver: dungNhacVer() });
  ghiNhatKy({ ev: 'ai-ngoai', bai: genTasks(W()).findIndex((x: any) => x.id === id) + 1, loi: kq.loi, vanDung });
  const w = W(); if (!genTasks(w).some((x: any) => x.gen.status === 'wait')) luuMayChu();
  return kq;
}
const dungNhacVer = () => NHAC_VER;
/** Giáo viên sửa bài khi AI đang viết: dùng bản AI đã giữ (S20). */
export function dungBanDuPhong(id: string) {
  const t = find(id); if (!t || !t.gen || !t.gen.spare) return;
  const kq = docKetQua(t.gen.spare.md, { q: t.gen.q || qOf(t), n: t.gen.n || countOf(t) });
  ganKetQua(id, sigTask(t), kq, { tries: t.gen.tries || 1, model: t.gen.spare.model, ver: dungNhacVer() });
}

// ---------- lưu phiếu lên máy chủ (Kho phiếu) ----------
/** Phiếu tạo từ giáo trình: lưu lên máy chủ khi sinh xong / Duyệt phiếu / Xuất bản. Không có máy chủ thì thôi. */
export async function luuMayChu() {
  const w = W(), s = w && w.gen && w.gen.src; if (!s || !s.course || !s.lesson) return;
  const n = nguonHienTai() || await moNguon(); if (!n.luuPhieu) return;
  if (!(await n.luuPhieu(s.course, s.lesson, String(w.id || 'phieu').replace(/[^\w-]/g, '-').slice(0, 80), w))) toast('Chưa lưu được phiếu lên máy chủ');
}
