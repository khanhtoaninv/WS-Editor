// Kiểm, ký, mã hóa gói .wsp từ phiếu đã gom (dùng chung hộp "Gói .wsp" và nút Live). Lỗi kiểm thì trả `errors`, không ném.
import { buildFiles, checkFiles, sealWsp, type Signer } from '../../../../shared/src/index.ts';
import type { Collected } from './collect';
import { devSigner, edBox, serverSigner, trPub, nextVersion, saveVersion, type ServerKeys } from './keys';

export const VER = 'WS Editor v123';
export const fname = (t: string) => (t || 'phieu').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'phieu';

export type Sealed = { bytes: Uint8Array; name: string; manifest: unknown; v: number; signer: Signer; hasTr: boolean };
export async function sealCollected(c: Collected, srv: ServerKeys | null): Promise<Sealed | { errors: string[] }> {
  const b0 = await buildFiles(c.input), h = b0.manifest.contentHash + b0.manifest.keyHash;
  const v = nextVersion(c.input.sheetId, h), { files, manifest } = await buildFiles({ ...c.input, version: v });
  const chk = await checkFiles(files);
  if (chk.errors.length) return { errors: chk.errors };
  const rec: Record<string, JsonWebKey> = { ed: (await edBox()).publicKey };
  const t = srv ? srv.trPublic : trPub(); if (t) rec.tr = t;
  const signer: Signer = srv ? serverSigner(srv.keyId) : await devSigner();
  const bytes = await sealWsp(files, manifest, { signer, recipients: rec, producer: VER });
  saveVersion(c.input.sheetId, v, h);
  return { bytes, name: `${fname(c.input.title)}-v${v}.wsp`, manifest, v, signer, hasTr: !!rec.tr };
}
