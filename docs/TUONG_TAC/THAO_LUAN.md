# Phiếu tương tác và TeacherResource: các quyết định đã chốt (thảo luận 27/10/2026)

Trạng thái: **đang thảo luận, chưa code.** Đã viết nháp v0 ba tài liệu: `1_TONG_QUAN_KIEN_TRUC.md`, `2_CHUAN_GOI_PHIEU.md`, `3_LO_TRINH.md` (đầu mục gốc: `DAU_MUC_3_TAI_LIEU.md`). Bước tiếp theo: người dùng duyệt, chốt H1–H3 (tài liệu 1 mục 11), rồi lập kế hoạch GĐ0.

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

## Trả lời giả định (27/10/2026, sau nháp v0)
- G3: đang cân nhắc **không tạo tài khoản học sinh**. Học sinh vào bằng mã phiên giáo viên cấp; nhật ký tham gia lưu theo tài khoản giáo viên. Phiên có thời hạn; mỗi buổi chỉ một phiên hoạt động (tạo phiên mới thì phiên cũ tự tắt). **Mâu thuẫn với nháp v0** (vai trò học sinh có tài khoản, bài về nhà theo tài khoản, thống kê từng em theo thời gian) → cần sửa tài liệu 1 mục 4, 6.2, 6.3, 8.5 và tài liệu 3 GĐ3 sau khi chốt hai câu hỏi đang hỏi người dùng: (1) danh sách lớp không tài khoản (học sinh chọn tên + mã ngắn) hay tự gõ tên; (2) luật "một phiên" áp theo giáo viên hay theo lớp, bài về nhà có tính là phiên không.
- G4 ok. G5: chỉ bài viết mở chấm tay; viết ngắn / nhiều đáp án chấm máy.
- H1: Claude chọn dịch vụ ký, đăng nhập một lần, Xuất bản tự ký.
- H2: sau khi nộp thấy điểm tổng mình + lớp (thời gian thực); kết quả từng câu sau khi giáo viên chốt phiên.
- H3: giáo viên cài số lần làm.

## Chốt G3 (27/10/2026)
- Học sinh nằm trong **danh sách lớp** (cập nhật thời gian thực, có ảnh đại diện, thông tin, mỗi em một mã / key). Không tài khoản.
- Mở phiên thì danh sách lớp đi kèm. Học sinh quét QR vào link bài (hoặc vào link chung + nhập mã phiên), rồi nhập key của mình.
- "Mỗi buổi một phiên" áp **theo lớp**; giáo viên chỉ mở và điều hành phiên.
- **Bài về nhà tính sau**, làm trên lớp trước.
- Đã sửa tài liệu 1 và 3 thành v0.1 theo các điểm này.

## Đồng ý thêm (27/10/2026)
- Key đang dùng ở máy khác → hỏi "Tiếp tục trên máy này?", máy cũ bị ngắt, bài nháp không mất (lưu ở máy chủ).
- Hết thời hạn mà giáo viên chưa chốt → hệ thống tự chốt, bài dở nộp tự động.
- Giáo viên mở lại được phiên đã chốt; khi mở lại thì ẩn lại kết quả từng câu tới khi chốt lần nữa.
- Bước tiếp theo: lập kế hoạch chi tiết GĐ0 (tài liệu 3 mục 3), chờ người dùng cho phép.
