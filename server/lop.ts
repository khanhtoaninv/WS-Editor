// Chạy máy chủ Lớp học thử: npm run lop (ở thư mục gốc repo). Cần Node ≥ 22.6.
// Biến môi trường (tùy chọn): LOP_CONG (cổng, mặc định 1531), LOP_MAT_KHAU (mật khẩu giáo viên), LOP_DU_LIEU (thư mục dữ liệu),
// ANTHROPIC_API_KEY (bật Insight AI, v122), LOP_AI_MODEL.
import { networkInterfaces } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
import { createApp } from './src/app.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = resolve(process.env.LOP_DU_LIEU || join(ROOT, 'server', 'du-lieu'));
const PORT = +(process.env.LOP_CONG || 1531);
mkdirSync(DATA, { recursive: true });
// mật khẩu giáo viên: mặc định 123456 (bản thử trong mạng nội bộ); đổi bằng biến môi trường LOP_MAT_KHAU
const matKhau = process.env.LOP_MAT_KHAU || '123456';
const aiKey = process.env.ANTHROPIC_API_KEY;

const { server, close } = await createApp({ demo: process.env.LOP_KHONG_DEMO !== '1', root: ROOT, data: DATA, matKhau, ai: aiKey ? { key: aiKey, model: process.env.LOP_AI_MODEL } : null, log: m => console.log(new Date().toLocaleTimeString('vi-VN'), m) });
server.on('error', (e: NodeJS.ErrnoException) => {
  if (e.code === 'EADDRINUSE') console.error(`Cổng ${PORT} đang bận (máy chủ đã chạy ở cửa sổ khác?). Đóng cửa sổ đó, hoặc chạy với cổng khác: LOP_CONG=1532 npm run lop`);
  else console.error(e); process.exit(1);
});
server.listen(PORT, '0.0.0.0', () => {
  const lan = Object.values(networkInterfaces()).flat().filter(a => a && a.family === 'IPv4' && !a.internal).map(a => a!.address);
  console.log('\n  Lớp học thử đang chạy (Ctrl+C để dừng)\n');
  console.log(`  Giáo viên:  http://localhost:${PORT}/gv     mật khẩu: ${matKhau}`);
  console.log(`  WS Editor:  http://localhost:${PORT}/editor  (xuất gói .wsp gửi thẳng lên lớp)`);
  lan.forEach(ip => console.log(`  Học sinh (cùng wifi): http://${ip}:${PORT}/hs`));
  if (!lan.length) console.log('  (Máy chưa nối mạng nội bộ: học sinh chỉ vào được trên chính máy này)');
  console.log(`  Insight AI: ${aiKey ? 'bật' : 'tắt (đặt ANTHROPIC_API_KEY để bật)'} · dữ liệu: ${DATA}\n`);
});
const stop = () => { console.log('\nĐang dừng, lưu dữ liệu…'); close().then(() => process.exit(0)); };
process.on('SIGINT', stop); process.on('SIGTERM', stop);
