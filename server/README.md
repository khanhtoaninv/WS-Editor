# Khu thử nghiệm Lớp học (Mốc 2)

Máy chủ nhỏ chạy trên máy giáo viên để thử phiếu tương tác với học sinh thật **trước khi có TeacherResource**.
Không thay TeacherResource; không cần cài thêm gói npm. Dữ liệu nằm trong `server/du-lieu/` trên máy này (không đưa lên git).

## Chạy
1. Cài **Node.js 22.6 trở lên** (nodejs.org, bản LTS).
2. Lấy bản mới: `git pull`.
3. Chạy: `npm run lop` ở thư mục gốc repo. Hoặc bấm đúp `chay-lop.command` (Mac) / `chay-lop.bat` (Windows).
4. Cửa sổ in ra địa chỉ và **mật khẩu giáo viên** (6 số, tạo một lần, lưu trong `server/du-lieu/cau-hinh.json`).
   - Giáo viên: `http://localhost:1531/gv`
   - WS Editor qua máy chủ: `http://localhost:1531/editor` (có nút **Gửi lên lớp thử** trong hộp "Gói .wsp")
   - Học sinh (cùng wifi): `http://<địa chỉ máy>:1531/hs`, hoặc quét mã QR trên trang phiên.
5. Ctrl+C để dừng (dữ liệu được lưu).

Biến môi trường (tùy chọn): `LOP_CONG` (cổng), `LOP_MAT_KHAU`, `LOP_DU_LIEU` (thư mục dữ liệu),
`ANTHROPIC_API_KEY` (bật **Insight AI**), `LOP_AI_MODEL` (mặc định `claude-opus-5-5`).
Ví dụ Mac: `ANTHROPIC_API_KEY=sk-ant-... npm run lop`. Windows (PowerShell): `$env:ANTHROPIC_API_KEY="sk-ant-..."; npm run lop`.
Không có khóa vẫn dùng được: nút AI trả đoạn nhắc (chỉ số liệu ẩn danh) để chép sang AI khác.

## Luồng
Lớp (danh sách tên, nên dùng tên giả) → Gói phiếu (gửi từ WS Editor) → Mở phiên (mã 6 ký tự + QR) → học sinh vào, chọn tên, làm (tự lưu), nộp →
giáo viên theo dõi trực tiếp → Kết thúc phiên (thu bài em chưa nộp) → **Chấm chữa** (v120) → **Báo cáo** lớp (v121) / từng em + nhận xét theo quy tắc + Insight AI (v122).

## Mã
- `lop.ts` chạy máy chủ; `src/app.ts` đường dẫn API; `src/cham.ts` chấm chữa + báo cáo + AI; `src/ai.ts` gọi Claude; `src/store.ts` lưu JSON; `src/khoa.ts` khóa ký / mở gói.
- Giao diện: `app/src/lop/` (React, dùng lại trình xem `app/src/viewer/` với vai `student` / `review`), build ra `server/public/lop.html` (`cd app && npm run build`).
- Tính điểm, báo cáo, nhận xét: `shared/src/grade.ts`, `shared/src/baocao.ts` (TeacherResource dùng lại được).
- Test: `npm run test:lop` (API), `python3 tests/lop/test_lop.py` (trình duyệt), hoặc `bash tests/lop/run.sh`.
