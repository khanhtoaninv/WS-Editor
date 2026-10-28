// Kho dữ liệu của máy chủ lớp thử: file JSON trong thư mục dữ liệu (mặc định server/du-lieu/, không đưa lên git).
// Đủ cho một giáo viên thử vài lớp; không phải cơ sở dữ liệu thật (TeacherResource sẽ dùng CSDL riêng).
//   lop.json            các lớp và danh sách học sinh
//   goi/<id>/…          lõi gói đã giải mã (trang, css, phông, ảnh, slots.json, key.json) + thong-tin.json
//   phien/<id>.json     một phiên: trạng thái, bài làm từng học sinh, chấm chữa
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { randomBytes } from 'node:crypto';
import type { Answers, Overrides } from '../../shared/src/index.ts';

export type HocSinh = { id: string; ten: string };
export type Lop = { id: string; ten: string; hocSinh: HocSinh[]; taoLuc: string };
export type Goi = { id: string; sheetId: string; version: number; title: string; taoLuc: string; contentHash: string; stats: Record<string, number>; warnings: string[]; keyId: string };
export type Cham = { overrides: Overrides; nhanXet?: string; xongLuc?: string; suaLuc?: string };
export type Bai = { token?: string; vaoLuc?: string; answers: Answers; luuLuc?: string; nopLuc?: string; tuNop?: boolean; cham?: Cham };
export type Phien = { id: string; ma: string; ten: string; lop: string; goi: string; trangThai: 'mo' | 'dong'; taoLuc: string; dongLuc?: string; bai: Record<string, Bai> };

export const newId = (p: string) => p + '-' + randomBytes(5).toString('hex');
const MA_CHU = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   // không có 0 O 1 I để học sinh gõ không nhầm
export const newMa = () => Array.from(randomBytes(6), b => MA_CHU[b % MA_CHU.length]).join('');

function readJson<T>(f: string, d: T): T { try { return JSON.parse(readFileSync(f, 'utf8')); } catch { return d; } }
function writeJson(f: string, v: unknown) { mkdirSync(dirname(f), { recursive: true }); const t = f + '.tmp'; writeFileSync(t, JSON.stringify(v, null, 1)); renameSync(t, f); }

export class Store {
  dir: string;
  lop: Lop[] = [];
  goi: Goi[] = [];
  phien: Phien[] = [];
  private dirty = new Set<string>();
  private timer: ReturnType<typeof setTimeout> | null = null;
  constructor(dir: string) {
    this.dir = dir; mkdirSync(join(dir, 'goi'), { recursive: true }); mkdirSync(join(dir, 'phien'), { recursive: true });
    this.lop = readJson(join(dir, 'lop.json'), [] as Lop[]);
    this.goi = readdirSync(join(dir, 'goi')).map(d => readJson<Goi | null>(join(dir, 'goi', d, 'thong-tin.json'), null)).filter((g): g is Goi => !!g).sort((a, b) => a.taoLuc.localeCompare(b.taoLuc));
    this.phien = readdirSync(join(dir, 'phien')).filter(f => f.endsWith('.json')).map(f => readJson<Phien | null>(join(dir, 'phien', f), null)).filter((p): p is Phien => !!p).sort((a, b) => a.taoLuc.localeCompare(b.taoLuc));
  }
  // ghi gộp sau 200 ms (gõ bài liên tục không ghi đĩa mỗi phím); flush() khi tắt máy chủ
  touch(what: 'lop' | `phien:${string}`) { this.dirty.add(what); if (!this.timer) this.timer = setTimeout(() => this.flush(), 200); }
  flush() {
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    for (const w of this.dirty) {
      if (w === 'lop') writeJson(join(this.dir, 'lop.json'), this.lop);
      else { const p = this.phien.find(x => x.id === w.slice(6)); if (p) writeJson(join(this.dir, 'phien', p.id + '.json'), p); }
    }
    this.dirty.clear();
  }
  goiDir(id: string) { return join(this.dir, 'goi', id); }
  saveGoi(g: Goi, files: Record<string, Uint8Array>) {
    const d = this.goiDir(g.id); rmSync(d, { recursive: true, force: true });
    for (const [p, b] of Object.entries(files)) { const f = join(d, p); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, b); }
    writeJson(join(d, 'thong-tin.json'), g);
    this.goi = this.goi.filter(x => x.id !== g.id).concat(g);
  }
  goiFile(id: string, p: string): Uint8Array | null { const f = join(this.goiDir(id), p); return existsSync(f) ? readFileSync(f) : null; }
  goiJson<T>(id: string, p: string): T { return JSON.parse(readFileSync(join(this.goiDir(id), p), 'utf8')); }
  delGoi(id: string) { rmSync(this.goiDir(id), { recursive: true, force: true }); this.goi = this.goi.filter(x => x.id !== id); }
  delPhien(id: string) { rmSync(join(this.dir, 'phien', id + '.json'), { force: true }); this.phien = this.phien.filter(x => x.id !== id); }
}
