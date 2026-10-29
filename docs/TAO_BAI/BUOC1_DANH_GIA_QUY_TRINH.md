# Bước 1: Đánh giá quy trình Tạo bài

29/10/2026. Căn cứ: quy trình người dùng nêu (Chuẩn bị, Duyệt tổng quan, Tạo bài), thử nghiệm Grammar Movers v1/v2, hai đánh giá của người dùng, lượt AI kiểm mù.
Lộ trình bốn bước của người dùng: (1) đánh giá quy trình, (2) tạo cấu trúc Bộ nạp chuẩn, (3) hoàn thiện bộ mẫu cho một unit chuẩn, (4) kế hoạch xây hệ thống.

## 1. Quy trình hiện tại (tóm tắt)
1. Chuẩn bị: Cách 1 chọn lesson từ thư viện admin nạp; Cách 2 bài tự do (level, chủ đề, mục tiêu, kỹ năng, nội dung, dạng Q, ghi chú).
2. Duyệt tổng quan: AI đưa danh sách Task (mục tiêu, vai trò, nội dung), giáo viên duyệt, sửa hoặc sinh lại.
3. Tạo bài: AI viết từng Task theo dàn ý đã duyệt, đưa vào WS Editor để tinh chỉnh.
Lưu ý: sinh lại từng Task luôn phải nhất quán.

## 2. Điểm mạnh (giữ nguyên)
- **Hai cổng duyệt** (dàn ý, rồi từng Task) đặt đúng chỗ: sửa hướng đi khi còn rẻ, sửa chi tiết sau.
- **Tách dàn ý và nội dung.** Thử nghiệm xác nhận: lỗi ở v1 chủ yếu nằm ở thiết kế Task (G4 chỉ hỏi dữ kiện, G2 dựa từ khóa), nên duyệt dàn ý sớm là đúng.
- **Dùng tri thức có cấu trúc** (Kiến thức, Trình tự) thay vì để AI tự nghĩ. Hai vòng đánh giá cho thấy file càng rõ thì lỗi càng ít.
- **Giáo viên là người quyết định cuối**, sửa tay và sinh lại đều có.

## 3. Khoảng trống và rủi ro (xếp theo mức quan trọng)
1. **Thiếu bước AI tự kiểm giữa "Tạo bài" và editor.** Thử nghiệm: một lượt kiểm theo rubric bắt 4/6 lỗi giáo viên nêu, thêm cả lỗi đáp án và mâu thuẫn tình huống. Nên thêm bước "Kiểm và sửa" trước khi giáo viên thấy bài.
2. **Hai cách vào không bình đẳng.** Cách 1 có Kiến thức và Trình tự; Cách 2 thì không, nên chất lượng sẽ thấp hơn. Đề xuất: cho Cách 2 cũng đi qua "hồ sơ lesson": AI dựng Kiến thức và Trình tự nháp từ ô nhập của giáo viên (dựa trên khuôn theo loại phiếu), giáo viên duyệt như bước Duyệt tổng quan. Khi đó hệ thống chỉ có một đường sinh.
3. **Trình tự nội dung có thể không phải của riêng từng lesson.** File mẫu "Trình tự nội dung" mô tả khung Grammar Worksheet v1.0, nói rõ dùng cho "chủ điểm ngữ pháp bất kỳ". Nếu đúng, nó thuộc về **loại phiếu** (Grammar, Vocabulary, Reading...), dùng chung; chỉ file Kiến thức là của riêng lesson. Điều này quyết định việc admin nạp gì và bảo trì thế nào (một khung, nhiều lesson). Cần người dùng xác nhận.
4. **Chưa có cách đo chất lượng khi file hoặc prompt thay đổi.** Cần một "bộ phiếu vàng" (vài lesson đã duyệt kỹ) để chạy lại sau mỗi lần sửa tài liệu, xem lỗi tăng hay giảm. Không có nó thì mỗi lần chỉnh tài liệu là đoán.
5. **Phân biệt lỗi do ai.** Lần thử cho thấy lỗi thuộc ba nhóm: do file thiếu quy tắc (sửa file), do AI làm ẩu (cần kiểm), do giáo viên chủ trương sư phạm (cần ghi thành quy tắc, vd nhãn Usually/Now). Nên gắn nhãn nhóm khi đánh giá để sửa đúng lớp, như quy ước đang dùng cho phiếu PDF.
6. **Quyết định sư phạm chưa được ghi lại.** Các chọn lựa như nhãn, định nghĩa, cách chỉ dẫn, mức hỗ trợ đang nằm trong đầu giáo viên. Phải thành mục "Thuật ngữ và mẫu chỉ dẫn chuẩn", nếu không mỗi lần sinh lại sẽ trôi.
7. **Phiên bản.** Tài liệu sẽ đổi theo thời gian. Phiếu sinh ra cần ghi bản tài liệu đã dùng; sinh lại một Task sau này dùng bản nào (cũ để khớp phiếu, hay mới)? Cần quy tắc.
8. **Ảnh.** Quy trình chưa nói gì. Nhiều bước G1, G2, G4 cần tranh. Cần quyết: khe ảnh kèm mô tả, hay chỉ dùng bài không cần ảnh ở giai đoạn đầu.
9. **Đáp án và chấm.** Phiếu sinh ra phải có đáp án chấm được (cho app và Lớp học thử); bài mở (G5) chấm tay hoặc gợi ý mẫu. Quy trình cần quy định mỗi dạng Q cần đáp án gì.
10. **An toàn nội dung.** Học sinh tiểu học: nội dung phù hợp độ tuổi, không sai sự thật, không vi phạm bản quyền giáo trình. Cần mục kiểm riêng.
11. **Chi phí, thời gian.** Một phiếu sinh nhiều lần gọi AI (dàn ý, từng Task, kiểm). Cần ước tính trước khi chốt.

## 4. Quy trình đề xuất (bản 2)
1. **Chuẩn bị.** Cách 1: chọn lesson. Cách 2: nhập tự do. Cả hai cho ra **hồ sơ lesson** (Kiến thức của lesson và khung Trình tự theo loại phiếu); Cách 2 do AI dựng nháp rồi giáo viên duyệt.
2. **Duyệt tổng quan.** AI đưa dàn ý dạng cấu trúc: Task, bước, mục tiêu, vai trò, nội dung, dạng Q, số câu, cần ảnh hay không. Giáo viên duyệt, sửa, sinh lại. Kết quả lưu cùng phiếu.
3. **Sinh.** Từng Task, kèm hồ sơ lesson, dàn ý, tóm tắt các Task kế bên.
4. **Kiểm và sửa tự động.** Kiểm máy rồi kiểm AI theo rubric; tự sinh lại vài lần; còn nghi ngờ thì gắn cờ.
5. **Duyệt của giáo viên.** Thấy cờ trước, sửa tay hoặc sinh lại kèm lời dặn, khóa Task đã duyệt.
6. **Đưa vào WS Editor** để tinh chỉnh bố cục và xuất bản.
Song song: **bộ phiếu vàng** để đo sau mỗi lần đổi tài liệu.

## 5. Điều cần người dùng xác nhận
1. Trình tự nội dung là của loại phiếu (dùng chung nhiều lesson) hay riêng từng lesson?
2. Cách 2 (bài tự do) có đồng ý đi qua "hồ sơ lesson" do AI dựng nháp không?
3. Giai đoạn đầu có chấp nhận chưa làm ảnh (bài ảnh để khe trống kèm mô tả) không?

## 6. Việc tiếp theo (Bước 2)
Tạo cấu trúc Bộ nạp chuẩn: danh mục thư mục, định dạng từng file, mục bắt buộc, quy ước phiên bản và trạng thái duyệt; áp thử cho Grammar Movers.
