// Điểm vào của bản dựng Vite. Thứ tự import = thứ tự chạy: thư viện QR, giao diện React (vẽ đồng bộ), rồi phần legacy.
import './styles.css';
import './vendor/qrcode.js';
import './ui/mount';
import './legacy/app.js';
