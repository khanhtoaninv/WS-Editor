# Kế hoạch: Lớp học thử có máy chủ (đề xuất 28/10/2026, chờ người dùng "làm đi")

> Mục đích: khu thử nghiệm sản phẩm trước khi giao cho TeacherResource. Trải nghiệm trọn vòng một buổi học: lập lớp → mở phiên → học sinh làm bài, nộp → giáo viên kết thúc, chấm chữa → báo cáo lớp / từng em + insight. Thay cho "1c" trong `docs/TUONG_TAC/3_LO_TRINH.md` ở giai đoạn thử.

## 1. Quyết định đã có (28/10)
- Chạy máy chủ **trên máy người dùng** (`http://localhost:<cổng>`); học sinh cùng wifi vào bằng địa chỉ mạng nội bộ (app hiện địa chỉ + mã QR). Người dùng đã có Node / npm.
- Tính năng thử trong app (1b) và Lớp học thử đều nằm sau một công tắc chế độ "Quản trị / thử nghiệm", để ẩn khi có TeacherResource.
- Insight: số liệu theo quy tắc cố định làm nền; AI thêm phần đoán nguyên nhân / gợi ý ôn. Khóa AI đặt qua biến môi trường trên máy người dùng; chỉ gửi **số liệu ẩn danh** (mã câu, tỷ lệ, đáp án sai phổ biến), không gửi tên hay bài viết của em.
- Dữ liệu thử dùng học sinh giả / tên viết tắt.

## 2. Kiến trúc
- `server/` (Node ≥ 22, SQLite sẵn của Node `node:sqlite`, không thư viện nặng nếu được). Phục vụ `ws-editor.html` + `fonts/`, API JSON, kênh sự kiện trực tiếp (SSE).
- Chạy: `npm run lop` (hoặc `chay-lop.bat` / `chay-lop.command` bấm đúp). In ra địa chỉ localhost và địa chỉ mạng nội bộ.
- Kiểu dữ liệu mới (lớp, học sinh, phiên, bài nộp, kết quả chấm, báo cáo) và hàm tổng hợp báo cáo + insight quy tắc: `shared/` (để TeacherResource dùng lại), có test `npm test`.
- Giao diện: màn mới trong app (React), chế độ Học sinh là trang riêng nhẹ `#/hs` (điện thoại dùng được). Lớp giao tiếp lưu trữ tách riêng (`api.ts`) để đổi nơi lưu không viết lại giao diện.

## 3. Luồng và màn
1. **Lập lớp:** tên lớp, danh sách học sinh (dán nhiều dòng hoặc lớp mẫu 12 em giả).
2. **Mở phiên:** chọn phiếu (gói `wsp/0` + khóa chấm từ `sheetSlots`), đặt thời gian (tùy chọn), mã 4–6 số + mã QR. Trạng thái: chờ → đang làm → đã kết thúc → đã chấm.
3. **Học sinh:** vào địa chỉ, nhập mã, chọn tên, làm bài (chế độ làm bài giống 1b nhưng **không đáp án, không công cụ giáo viên**), Nộp. Lưu nháp tự động; vào lại thì làm tiếp. Nộp rồi không sửa.
4. **Theo dõi trực tiếp:** bảng ai đã vào / đang làm (% chỗ đã điền) / đã nộp, cập nhật tức thì; nút **Kết thúc phiên** (chưa nộp thì thu bài đang làm).
5. **Chấm chữa:** máy chấm sẵn; giáo viên xem từng em (bài đúng / sai đặt cạnh đáp án), sửa điểm từng chỗ, chấm tay chỗ viết tự do, nhận xét; chuyển em trước / sau; "Chốt chấm".
6. **Báo cáo:**
   - Lớp: điểm TB, phân bố điểm, đúng / sai từng câu, **top câu sai nhiều** + đáp án sai phổ biến, theo Task / dạng bài, ai chưa nộp.
   - Từng em: điểm, câu đúng, câu sai, dạng mạnh / yếu so với lớp.
   - Insight quy tắc ("Câu 4 Task 2: 80% sai, thường chọn A"; "Em An yếu dạng nối"); nút **Insight AI** gọi máy chủ → AI (cần khóa); không có khóa thì xuất đoạn nhắc sẵn để dán vào AI.

## 4. Chia bước (mỗi bước là một bản thử tay được; test Playwright nhiều tab giả lập giáo viên + học sinh)
- (a) Server + lớp + phiên + học sinh nộp bài + theo dõi trực tiếp. Bản v118.
- (b) Chấm chữa. v119.
- (c) Báo cáo lớp. v120.
- (d) Báo cáo từng em + insight (quy tắc, rồi AI). v121.
Mỗi bước: cập nhật spec (mục mới), báo cáo phiên, tăng badge, commit + push `main`; đủ bộ test cũ (120/120, 1a, 1b…) vì không được làm hỏng phần soạn / chiếu.

## 5. Chưa làm / ngoài phạm vi
Tài khoản thật, email, phân quyền nhiều giáo viên, chạy công khai trên mạng, sao lưu, chống tấn công, đồng bộ nhiều lớp / nhiều trường. Dev làm khi tích hợp TeacherResource.

## 6. Rủi ro
- Học sinh ngoài wifi lớp không vào được (chấp nhận ở giai đoạn thử).
- Máy giáo viên ngủ / tắt thì máy chủ dừng (dữ liệu vẫn nằm trong file SQLite, mở lại là còn).
- Gửi dữ liệu sang AI ngoài: chỉ số liệu ẩn danh, và người dùng tự đặt khóa + hạn mức.
