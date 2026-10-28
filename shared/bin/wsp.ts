// Công cụ dòng lệnh cho gói .wsp (GĐ2). Chạy bằng Node ≥ 22:
//   node shared/bin/wsp.ts keygen <thư mục>                       tạo cặp khóa ký (Ed25519) + cặp khóa nhận (RSA-OAEP)
//   node shared/bin/wsp.ts inspect <gói.wsp> --trust <khóa công khai ký.json> [--key <khóa riêng nhận.json> --who tr|ed]
//   node shared/bin/wsp.ts extract <gói.wsp> <thư mục> --trust … --key … --who …   (giải nén lõi để xem)
// Khóa ký tin cậy: file JSON { "<keyId>": <JWK công khai> } hoặc một JWK kèm trường "kid".
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { inspectWsp, genSignKey, genBoxKey, publicOf } from '../src/index.ts';

const a = process.argv.slice(2), cmd = a[0];
const opt = (n: string) => { const i = a.indexOf('--' + n); return i >= 0 ? a[i + 1] : undefined; };
const json = (p: string) => JSON.parse(new TextDecoder().decode(readFileSync(p)));
const die = (m: string) => { console.error(m); process.exitCode = 2; };

async function main() {
  if (cmd === 'keygen') {
    const dir = a[1] || '.', id = opt('id') || `wsp-${new Date().toISOString().slice(0, 10)}`;
    mkdirSync(dir, { recursive: true });
    const s = await genSignKey(), b = await genBoxKey();
    writeFileSync(`${dir}/ky-rieng.json`, JSON.stringify({ ...s.privateKey, kid: id }, null, 1));
    writeFileSync(`${dir}/ky-cong-khai.json`, JSON.stringify({ [id]: publicOf(s.publicKey) }, null, 1));
    writeFileSync(`${dir}/nhan-rieng.json`, JSON.stringify(b.privateKey, null, 1));
    writeFileSync(`${dir}/nhan-cong-khai.json`, JSON.stringify(publicOf(b.publicKey), null, 1));
    console.log(`Đã tạo khóa trong ${dir}: ky-rieng.json (giữ kín), ky-cong-khai.json, nhan-rieng.json (giữ kín), nhan-cong-khai.json · keyId = ${id}`);
    return;
  }
  if (cmd !== 'inspect' && cmd !== 'extract') return die('Cách dùng: wsp keygen <thư mục> | wsp inspect <gói.wsp> --trust <ky-cong-khai.json> [--key <nhan-rieng.json> --who tr]');
  const file = a[1]; if (!file) return die('thiếu đường dẫn gói');
  const tp = opt('trust'); if (!tp) return die('thiếu --trust <ky-cong-khai.json>');
  const t = json(tp), trust = t.kty ? { [t.kid]: t } : t;
  const kp = opt('key'), who = opt('who') || (kp ? 'tr' : undefined);
  const r = await inspectWsp(readFileSync(file), { trust, who, privateKey: kp ? json(kp) : undefined });
  const e = r.envelope, m = r.manifest;
  if (e) console.log(`Gói: ${e.title} · ${e.sheetId} v${e.version} · ${e.producer} · ký bằng ${e.keyId} · người nhận: ${Object.keys(e.wrappedKeys || {}).join(', ')}`);
  if (m) console.log(`Lõi: ${m.pages.length} trang · ${m.stats.tasks} Task · ${m.stats.slots} chỗ trả lời (${m.stats.autoGraded} máy chấm, ${m.stats.manualGraded} chấm tay) · ${Object.keys(m.files).length} file · contentHash ${m.contentHash.slice(0, 12)}…`);
  r.warnings.forEach(w => console.log('  cảnh báo: ' + w));
  r.errors.forEach(x => console.log('  LỖI: ' + x));
  console.log(r.ok ? 'ĐẠT' : 'TỪ CHỐI');
  if (!r.ok) { process.exitCode = 1; return; }
  if (cmd === 'extract' && r.files) {
    const out = a[2]; if (!out) return die('thiếu thư mục ra');
    for (const [p, b] of Object.entries(r.files)) { const d = `${out}/${p}`.split('/').slice(0, -1).join('/'); mkdirSync(d, { recursive: true }); writeFileSync(`${out}/${p}`, b); }
    console.log(`Đã giải nén ${Object.keys(r.files).length} file vào ${out}`);
  }
}
main().catch(e => die('LỖI: ' + (e as Error).message));
