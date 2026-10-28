# Thử tay Lớp học thử (v119)

Chuẩn bị: máy tính có Node.js 22.6+ (nodejs.org, LTS). Trong thư mục repo: `git pull`, rồi `npm run lop` (hoặc bấm đúp `chay-lop.command` / `chay-lop.bat`). Cửa sổ in ra mật khẩu giáo viên và địa chỉ cho học sinh. Điện thoại / máy học sinh phải cùng wifi với máy này.

| # | Làm | Mong đợi | Kết quả |
|---|---|---|---|
| 1 | Mở `http://localhost:1531/gv`, nhập mật khẩu | Vào trang giáo viên, 3 thẻ Phiên học / Lớp / Gói phiếu | |
| 2 | Thẻ Lớp → + Lớp mới → Dùng lớp mẫu 12 em → Lưu | Có lớp 12 tên giả | |
| 3 | Bấm "WS Editor ↗", mở một phiếu có đáp án, bấm "Gói .wsp" → Gửi lên lớp thử | Báo "Đã gửi …"; thẻ Gói phiếu có phiếu đó | |
| 4 | Gói phiếu → Xem | Trình chiếu phiếu, có đáp án | |
| 5 | Phiên học → chọn lớp + phiếu → Mở phiên | Mã 6 chữ to, QR, địa chỉ `http://<máy>:1531/hs` | |
| 6 | Điện thoại quét QR (hoặc gõ địa chỉ + mã) → bấm tên | Phiếu hiện, không có đáp án, không có nút giáo viên; nút Nộp bài thấy được | |
| 7 | Làm vài câu trên điện thoại | "✓ Đã lưu"; bảng giáo viên đổi "Đã làm x/y" ngay | |
| 8 | Tải lại trang trên điện thoại | Vào thẳng bài, câu đã làm còn nguyên | |
| 9 | Máy khác bấm cùng tên đó | Báo tên đã vào ở máy khác; giáo viên bấm Mở khóa thì vào được, bài còn nguyên | |
| 10 | Nộp bài | Hỏi lại (số chỗ còn trống), nộp xong khóa bài, bảng giáo viên "Đã nộp" | |
| 11 | Một em làm dở, giáo viên bấm Kết thúc phiên | Em đó thấy "Phiên đã kết thúc", bài khóa; bảng ghi "(thu khi kết thúc)" | |
| 12 | Ctrl+C dừng máy chủ, chạy lại, vào `/gv` | Lớp, gói, phiên cũ còn đủ | |
| 13 | Mở `ws-editor.html` thẳng từ file | Không có nút "Gửi lên lớp thử" (chỉ khi mở qua máy chủ) | |

Chưa có ở v119: Chấm chữa, Báo cáo (nút có nhưng mở ra trang "bản sau").
