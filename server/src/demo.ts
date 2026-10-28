// Dữ liệu demo cho Khu thử nghiệm Lớp học: 2 phiếu có đáp án (đóng gói sẵn ở server/demo/goi/), 2 lớp tên giả (học sinh có avatar),
// một phiên đã kết thúc (bài làm khác nhau, một nửa đã chấm chữa) để xem ngay Chấm chữa / Báo cáo, một phiên đang mở (mã LAMTHU)
// để thử làm bài như học sinh. Nạp lại nhiều lần được: xóa dữ liệu demo cũ (mã bắt đầu bằng "demo") rồi tạo lại.
// Tạo lại bộ phiếu đóng gói: python3 tests/lop/tao_demo.py
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { randomBytes } from 'node:crypto';
import { avatarIndex, AVATARS, type Slot, type Key } from '../../shared/src/index.ts';
import type { Store, Goi, Lop, Phien, Bai } from './store.ts';

const L4A = ['An', 'Bình', 'Chi', 'Dũng', 'Giang', 'Hà', 'Khoa', 'Linh', 'Minh', 'Nam', 'Phúc', 'Quyên'];
const L5B = ['Sơn', 'Thảo', 'Uyên', 'Việt', 'Xuân', 'Yến', 'Bảo', 'Cường', 'Diệp'];
export const DEMO_MA = 'LAMTHU';

const rng = (seed: number) => () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const lopOf = (key: string, ten: string, names: string[]): Lop => {
  const used = new Set<number>(), hs = names.map((n, i) => {
    let id = '', t = 0; do { id = `hs-demo-${key}-${i + 1}${t ? '-' + t : ''}`; t++; } while (used.has(avatarIndex(id)) && used.size < AVATARS.length && t < 500);
    used.add(avatarIndex(id)); return { id, ten: n };
  });
  return { id: 'lop-demo-' + key, ten, hocSinh: hs, taoLuc: new Date().toISOString() };
};
const walk = (d: string, base = d): Record<string, Uint8Array> => {
  const out: Record<string, Uint8Array> = {};
  for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) Object.assign(out, walk(p, base)); else out[relative(base, p).replace(/\\/g, '/')] = readFileSync(p); }
  return out;
};

// đáp án của một chỗ: đúng / sai (common: nhiều em cùng sai một kiểu)
function ans(s: Slot, k: Key[string] | undefined, good: boolean, common: boolean): unknown {
  if (!k) return undefined;
  if ((k.grading || s.grading) === 'manual') return good ? 'I like it because it is fun and my family is there.' : 'no';
  const acc = (k as any).accept as string[] | undefined;
  if (acc && acc.length) return good ? acc[0] : common ? 'zzz' : acc[0].slice(0, Math.max(1, acc[0].length - 1)) + 'x';
  const c = (k as any).correct, opts = (s.options || []) as { id: string }[];
  if (c == null) return undefined;
  if (good) return c;
  if (s.interaction === 'choice-many') return opts.map(o => o.id).filter(i => !(c as string[]).includes(i)).slice(0, 1);
  if (s.interaction === 'find') return '0,0-0,1';
  const other = opts.map(o => o.id).filter(i => i !== c);
  return other.length ? other[common ? 0 : (opts.length + 1) % other.length] : (String(c).toUpperCase().startsWith('T') ? 'F' : 'T');
}
const tok = () => randomBytes(12).toString('hex');
const ago = (min: number) => new Date(Date.now() - min * 60000).toISOString();

export function seedDemo(st: Store, demoDir: string): { goi: number; lop: number; phien: number } {
  const gdir = join(demoDir, 'goi');
  if (!existsSync(gdir)) throw new Error('thiếu thư mục server/demo/goi (chạy python3 tests/lop/tao_demo.py)');
  // xóa demo cũ
  st.phien.filter(p => p.id.startsWith('ph-demo')).forEach(p => st.delPhien(p.id));
  st.goi.filter(g => g.id.startsWith('demo')).forEach(g => st.delGoi(g.id));
  st.lop = st.lop.filter(l => !l.id.startsWith('lop-demo'));
  const gois: Goi[] = [];
  for (const d of readdirSync(gdir)) {
    const files = walk(join(gdir, d)), info = JSON.parse(new TextDecoder().decode(files['thong-tin.json'])) as Goi; delete files['thong-tin.json'];
    info.id = d; info.taoLuc = ago(180); st.saveGoi(info, files); gois.push(info);
  }
  const full = gois.find(g => g.id === 'demo-unit3')!, quick = gois.find(g => g.id === 'demo-ontap')!;
  const l4 = lopOf('4a', '4A (demo)', L4A), l5 = lopOf('5b', '5B (demo)', L5B);
  st.lop.push(l4, l5); st.touch('lop');
  const data = (g: Goi) => ({ slots: st.goiJson<Slot[]>(g.id, 'slots.json'), key: st.goiJson<Key>(g.id, 'key.json') });

  // phiên 1 (đã kết thúc): 4A làm phiếu đầy đủ; 10 em nộp mức khác nhau, 1 em vào chưa nộp (thu khi kết thúc), 1 em vắng; 7 em đã chấm chữa
  { const { slots, key } = data(full), skill = [0.97, 0.92, 0.88, 0.82, 0.78, 0.72, 0.66, 0.6, 0.5, 0.38], bai: Record<string, Bai> = {};
    const manual = slots.filter(s => (key[s.id]?.grading || s.grading) === 'manual');
    const hard = new Set(slots.filter((_, i) => i % 11 === 4).map(s => s.id));   // vài câu cả lớp hay sai
    l4.hocSinh.forEach((h, i) => {
      if (i === 11) return;
      const r = rng(1000 + i), p = i < 10 ? skill[i] : 0.7, answers: Record<string, unknown> = {};
      slots.forEach(s => { if (i === 10 && r() < 0.5) return; if (r() < 0.04) return; const g = hard.has(s.id) ? r() < 0.3 : r() < p; const v = ans(s, key[s.id], g, hard.has(s.id)); if (v !== undefined) answers[s.id] = v; });
      const b: Bai = { token: tok(), vaoLuc: ago(150 - i), answers: answers as Bai['answers'], luuLuc: ago(100 - i), nopLuc: ago(100 - i * 2), tuNop: i === 10 };
      if (i === 10) b.nopLuc = ago(85);
      if (i < 7) {
        const ov: Record<string, { score: number; comment?: string }> = {};
        manual.forEach((s, j) => { const mx = key[s.id]?.score ?? 1, sc = Math.round(mx * Math.min(1, Math.max(0, p + (j % 3 - 1) * 0.15)) * 2) / 2; ov[s.id] = { score: sc, ...(sc < mx && j % 4 === 0 ? { comment: 'Viết thêm một chi tiết nữa nhé.' } : {}) }; });
        b.cham = { overrides: ov, nhanXet: i < 3 ? 'Làm bài tốt, chữ viết cẩn thận. Cố gắng phát huy!' : 'Cần ôn lại các câu viết về bản thân và kiểm tra chính tả.', xongLuc: ago(70), suaLuc: ago(70) };
      }
      bai[h.id] = b;
    });
    const p: Phien = { id: 'ph-demo-1', ma: 'KETQUA', ten: 'Tiết 3 · Unit 3 · My home', lop: l4.id, goi: full.id, trangThai: 'dong', taoLuc: ago(160), dongLuc: ago(80), bai };
    st.phien.push(p); st.touch('phien:' + p.id); }

  // phiên 2 (đang mở): 5B làm phiếu ôn tập 16 câu. 3 em đang làm dở, 1 em đã nộp, 5 em chưa vào: mã LAMTHU để thử vào làm như học sinh
  { const { slots, key } = data(quick), bai: Record<string, Bai> = {};
    l5.hocSinh.slice(0, 4).forEach((h, i) => {
      const r = rng(2000 + i), answers: Record<string, unknown> = {};
      slots.forEach((s, j) => { if (i < 3 && j >= (i + 1) * 4) return; const v = ans(s, key[s.id], r() < 0.75, false); if (v !== undefined) answers[s.id] = v; });
      bai[h.id] = { token: tok(), vaoLuc: ago(12 - i), answers: answers as Bai['answers'], luuLuc: ago(2), ...(i === 3 ? { nopLuc: ago(3) } : {}) };
    });
    const p: Phien = { id: 'ph-demo-2', ma: DEMO_MA, ten: 'Ôn tập nhanh · Unit 3', lop: l5.id, goi: quick.id, trangThai: 'mo', taoLuc: ago(15), bai };
    st.phien.push(p); st.touch('phien:' + p.id); }
  st.flush();
  return { goi: gois.length, lop: 2, phien: 2 };
}
