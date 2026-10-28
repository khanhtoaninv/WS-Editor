// Trang Lớp học thử: /hs = học sinh, còn lại = giáo viên. Chỉ chạy khi máy chủ lớp thử phục vụ (server/).
import { createRoot } from 'react-dom/client';
import '../vendor/qrcode.js';
import '../viewer/viewer.css';
import './lop.css';
import { Student } from './Student';
import { Teacher } from './Teacher';

createRoot(document.getElementById('lop')!).render(location.pathname.startsWith('/hs') ? <Student /> : <Teacher />);
