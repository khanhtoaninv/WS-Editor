# Phiếu tương tác và TeacherResource: các quyết định đã chốt (thảo luận 27/10/2026)

Trạng thái: **đang thảo luận, chưa code.** Bước tiếp theo: viết chi tiết 3 tài liệu theo `DAU_MUC_3_TAI_LIEU.md` khi người dùng nói "ok viết".

## Người dùng cần
1. **Tương tác ngay trên phiếu**: giáo viên thao tác, chữa bài.
2. **Tương tác lớp học**: giáo viên, học sinh làm; hệ thống lưu kết quả. Dùng cả trên lớp (quét mã vào làm trực tiếp, giáo viên xem thống kê chung/riêng rồi chữa) và về nhà. **Mọi người chỉ thấy kết quả sau khi nộp.**
3. **Soạn trong WS Editor**: người soạn thử tương tác ngay trong editor, hoặc đóng gói xuất bản để **import vào TeacherResource chạy ngay, không chỉnh lại file**.

## Đã chốt
- Đặc tả `THAM_KHAO_DAC_TA_TRINH_XEM.md` chỉ là **gợi ý tham khảo**, không làm theo. Nhận xét: `NHAN_XET_DAC_TA_TRINH_XEM.md`.
- **Trang đã dàn sẵn**: đề trong gói là trang A4 do WS Editor dàn, tương tác phủ lên trên (phiếu in và phiếu làm bài giống nhau). Chưa bàn chi tiết M2/M3 (người dùng muốn bàn sau).
- **TeacherResource chưa có**, sẽ viết dựa theo WS Editor; AI viết, đội dev người giám sát. Backend sửa được: lưu bài làm, chấm, quản lý.
- Ba phần: WS Editor (soạn, xuất gói) / **gói dùng chung** TypeScript + React (trình xem, hàm chấm, định nghĩa chuẩn gói; chạy giống nhau ở editor và máy chủ) / TeacherResource (tài khoản, lớp, giao bài, lưu, chấm, thống kê).
- Giáo viên chữa bài **từng em**; thống kê **từng người và cả lớp** → mỗi chỗ trả lời có mã ổn định, bài làm lưu theo từng câu.
- **Phiên bản**: mỗi lần xuất là một bản độc lập, không sửa đè; lần giao bài trỏ đúng một bản; sửa đáp án thì "chấm lại" trên cùng bản.
- **Bảo mật**: chỉ chạy trên TeacherResource hoặc WS Editor của công ty. Bỏ ý "một file .html mở đâu cũng chạy"; gói định dạng riêng (`.wsp`), mã hóa + ký số; người dùng không cầm file (xem sau đăng nhập, theo quyền, không tải về); đáp án chỉ ở máy chủ; dấu mờ tên tài khoản. Giới hạn đã nói rõ với người dùng: không chống được chụp màn hình.
- **Hết đóng băng tính năng** (chọn phương án b): phần chuyển React còn lại (KE_HOACH_REACT 8.3) làm song song.
