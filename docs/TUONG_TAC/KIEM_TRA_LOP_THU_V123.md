# Thử tay nút Live (v123)

Chuẩn bị: bấm đúp `chay-lop.bat` (Windows) hoặc `chay-lop.command` (Mac). Cửa sổ máy chủ in mật khẩu giáo viên; trình duyệt tự mở WS Editor (nếu không, vào `http://localhost:1531/editor`).

**Dữ liệu demo:** lần chạy đầu (dữ liệu trống) máy chủ tự nạp: 2 phiếu có đáp án, lớp 4A (12 em) và 5B (9 em) có avatar, 1 phiên đã kết thúc có bài làm và chấm chữa (xem Chấm chữa, Báo cáo, Insight), 1 phiên đang mở mã **LAMTHU** (vào `/hs`, chọn Xuân, Yến, Bảo, Cường hoặc Diệp để làm thử). Máy đã có dữ liệu cũ thì bấm **Nạp dữ liệu demo** ở góc trên trang giáo viên.

Muốn thử nhanh có chấm tự động: ở WS Editor bấm **+ Phiếu** → chọn file `samples/lop/ws-demo-lop.json` (phiếu Unit 3 đã có đáp án: 100 chỗ máy chấm, 10 chỗ chấm tay để thử Chấm chữa).

| # | Làm | Mong đợi | Kết quả |
|---|---|---|---|
| 1 | Mở WS Editor, nạp một phiếu có câu hỏi | Góc dưới có nút **● Live** cạnh Gói .wsp và ▶ Chiếu | |
| 2 | Mở `ws-editor.html` bằng cách bấm đúp file (không qua máy chủ) | Không có nút Live | |
| 3 | Bấm **● Live** lần đầu | Hiện tóm tắt phiếu, hỏi mật khẩu; gõ sai thì báo lỗi, gõ đúng thì vào | |
| 4 | Chưa có lớp: **+ Lớp mới** → Dùng lớp mẫu 12 em → Lưu lớp | Lớp mới được chọn sẵn | |
| 5 | Có cảnh báo: tích "Tôi đã xem…", bấm **Bắt đầu phiên** | Hộp lớn hiện mã phiên, mã QR, bảng 12 em "Chưa vào" | |
| 6 | Học sinh (điện thoại cùng wifi) quét QR, chọn tên, làm | Bảng trong hộp nhảy: Đang làm, số câu đã làm | |
| 7 | Bấm **Thu nhỏ**, làm việc khác, bấm lại **● Live** | Thấy "Phiên đang mở" kèm mã, bấm vào quay lại đúng phiên | |
| 8 | **Kết thúc phiên** | Hiện **Chấm chữa** và **Báo cáo**, dùng như v120–v122 | |
| 9 | Sửa phiếu trong editor rồi Live lần nữa | Gói mới (phiên bản tăng), phiên mới | |
