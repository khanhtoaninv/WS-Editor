// Khóa của máy chủ lớp thử. Máy chủ đóng hai vai (chỉ để thử, thay cho hệ thống thật):
//   - dịch vụ ký của công ty (quyết định H1): ký gói cho WS Editor khi WS Editor mở từ máy chủ này (/editor)
//   - bên nhận "tr" (như TeacherResource): giải mã gói bằng khóa riêng RSA của mình
// Tạo một lần, lưu ở <dữ liệu>/khoa.json (giữ kín). Khóa công khai ký tin cậy thêm: <dữ liệu>/tin-cay.json { keyId: JWK }.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { genSignKey, genBoxKey, publicOf } from '../../shared/src/index.ts';

export type Khoa = { keyId: string; sign: { publicKey: JsonWebKey; privateKey: JsonWebKey }; box: { publicKey: JsonWebKey; privateKey: JsonWebKey } };

export async function loadKhoa(dir: string): Promise<Khoa> {
  const f = join(dir, 'khoa.json');
  if (existsSync(f)) return JSON.parse(readFileSync(f, 'utf8'));
  const k: Khoa = { keyId: 'lop-thu-' + randomBytes(3).toString('hex'), sign: await genSignKey(), box: await genBoxKey() };
  writeFileSync(f, JSON.stringify(k, null, 1));
  return k;
}
export function trustOf(dir: string, k: Khoa): Record<string, JsonWebKey> {
  let extra: Record<string, JsonWebKey> = {};
  try { extra = JSON.parse(readFileSync(join(dir, 'tin-cay.json'), 'utf8')); } catch { /* không có */ }
  return { ...extra, [k.keyId]: publicOf(k.sign.publicKey) };
}
