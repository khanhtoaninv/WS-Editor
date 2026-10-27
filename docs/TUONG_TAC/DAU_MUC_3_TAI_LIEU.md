# Đầu mục 3 tài liệu: Tương tác phiếu và TeacherResource (nháp, chưa viết chi tiết)

## Tài liệu 1. Tổng quan kiến trúc
1. Mục tiêu và phạm vi: 3 việc (tương tác trên phiếu, tương tác lớp học, soạn và xuất bản)
2. Thuật ngữ: phiếu, phiên bản, gói, đầu mục bài (lần giao), buổi học trực tiếp, bài làm, chỗ trả lời
3. Ba phần hệ thống và ranh giới trách nhiệm: WS Editor, gói dùng chung (trình xem + chấm + chuẩn gói), TeacherResource
4. Vai trò: người soạn, giáo viên, học sinh (ai thấy gì, làm gì)
5. Các chế độ của trình xem: thử phiếu (editor), giáo viên dạy/chữa, học sinh làm, học sinh xem kết quả, giáo viên xem bài từng em
6. Luồng chính
   - 6.1 Soạn → thử → xuất gói → import
   - 6.2 Giao bài về nhà → làm → nộp → kết quả
   - 6.3 Buổi học trực tiếp: quét mã → làm → nộp → thống kê tức thời → chữa bài
   - 6.4 Giáo viên chữa bài từng em và cả lớp
7. Phiên bản: mỗi lần xuất là một bản độc lập; đầu mục bài trỏ một bản; chấm lại khi sửa đáp án
8. Bảo mật
   - 8.1 Giới hạn thực tế (không chống được chụp màn hình)
   - 8.2 Gói định dạng riêng, mã hóa, ký số; chỉ WS Editor và TeacherResource mở
   - 8.3 Người dùng không cầm file; xem sau đăng nhập, theo quyền, không tải về
   - 8.4 Đáp án chỉ ở máy chủ
   - 8.5 Dấu mờ tên tài khoản; nhật ký truy cập
   - 8.6 Quản lý khóa (ai giữ, đổi khóa thế nào)
9. Công nghệ đề xuất (TypeScript + React dùng chung; máy chủ để ngỏ cho dev chọn)
10. Ngoài phạm vi (làm sau): dùng không mạng, giao diện điện thoại riêng, AI chấm câu mở…
11. Giả định và câu hỏi còn mở

## Tài liệu 2. Chuẩn gói phiếu v0 (hợp đồng giữa WS Editor và TeacherResource)
1. Nguyên tắc: tự đủ, không đoán, ổn định, có phiên bản chuẩn
2. Cấu trúc gói (.wsp): danh sách thành phần, lớp mã hóa và chữ ký
3. Khối thông tin phiếu (meta): mã, phiên bản, tiêu đề, người soạn, phiên bản chuẩn gói
4. Khối đề: các trang đã dàn sẵn, ảnh, phông chữ
5. Chỗ trả lời: mã ổn định, vị trí trên trang, loại tương tác, thuộc Task/câu nào
6. Khối đáp án và cách chấm
   - 6.1 Bảng ánh xạ 12 dạng Q của WS Editor → loại tương tác và cách chấm
   - 6.2 Chuẩn hóa chữ khi so khớp
   - 6.3 Câu chấm tay / chấm một phần; điểm từng câu
7. Dạng chưa hỗ trợ tương tác: hiển thị tĩnh, đánh dấu, báo khi import
8. Định dạng bài làm và kết quả (dùng chung editor, file, máy chủ)
9. Kiểm tra khi xuất và khi import (danh sách lỗi, không nhận gói lỗi)
10. Lược đồ kiểm tra tự động (schema) và bộ phiếu mẫu kèm kết quả chấm mong đợi
11. Quy tắc nâng phiên bản chuẩn gói (tương thích ngược)

## Tài liệu 3. Lộ trình các việc
1. Nguyên tắc: từng giai đoạn chạy được và nghiệm thu được; không phá WS Editor hiện có (đang chuyển React)
2. GĐ0. Chuẩn bị trong WS Editor: xong chuyển React; mã ổn định cho mọi chỗ trả lời; tách lõi chấm thành gói dùng chung
3. GĐ1. Tương tác trên phiếu trong WS Editor (việc 1 + thử phiếu của việc 3)
4. GĐ2. Xuất gói .wsp (mã hóa, ký số, kiểm tra) (việc 3)
5. GĐ3. TeacherResource lõi: tài khoản, lớp, import gói, giao bài, làm, nộp, chấm, kết quả (việc 2, về nhà)
6. GĐ4. Buổi học trực tiếp: quét mã, cập nhật tức thời, thống kê lớp, chữa bài (việc 2, trên lớp)
7. GĐ5. Công cụ trình chiếu mở rộng (bút, che hé, đồng hồ… tham khảo đặc tả M7–M10)
8. Việc nào ở WS Editor, việc nào ở TeacherResource, việc nào ở gói dùng chung
9. Nghiệm thu từng giai đoạn; rủi ro chính
