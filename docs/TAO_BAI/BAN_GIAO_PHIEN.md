# Bàn giao phiên: module tạo bài (29/10/2026)

Nhánh làm việc: `claude/project-thread-34uc6q` (chưa có PR, chưa gộp vào `main`). App WS Editor không đổi trong phiên này (vẫn v123); toàn bộ việc là tài liệu và thử nghiệm.

## 1. Mục tiêu
Thêm module tạo bài: giáo viên đưa yêu cầu hoặc chọn lesson, AI tạo cả phiếu khớp bố cục của Editor; giáo viên sửa tay hoặc tạo lại từng Task, chất lượng và nhất quán không đổi. Quy trình: (1) Chuẩn bị (từ giáo trình/lesson hoặc bài tự do), (2) Duyệt tổng quan (dàn ý, hồ sơ lesson), (3) Tạo bài rồi vào Editor.

## 2. Thứ tự làm do người dùng quyết
Xây bộ file nạp chuẩn và tiêu chí đánh giá trước, đánh giá từng bước thành thư viện chuẩn, rồi mới xây hệ thống.
- Bước 1 đánh giá quy trình: xong (`BUOC1_DANH_GIA_QUY_TRINH.md`).
- Bước 2 cấu trúc bộ nạp chuẩn: bản nháp xong (`thu-vien/README.md`).
- **Bước 3 hoàn thiện bộ mẫu cho một unit chuẩn: đang làm** (xem mục 4).
- Bước 4 kế hoạch xây hệ thống: chưa bắt đầu, chờ người dùng cho phép.

## 3. Quyết định đã chốt
- Nhóm lesson có 3 file do người dùng soạn ngoài rồi nạp: Kiến thức, Trình tự Lesson, Task Format (TF). TF đi theo từng lesson; TF dùng chung chỉ cho bài tự do.
- Nhóm hệ thống (viết một lần, chưa làm hết): quy tắc viết MD cho AI, TF chung + đối chiếu dạng bài với Q1–Q12, quy tắc hình thức, rubric kiểm, phiếu mẫu đã duyệt.
- Trình tự chung (chuyên mục × cấp độ) chỉ là tham khảo của người soạn, không lưu trong hệ thống. Trình tự gốc: Recognition, Understanding, Application, Creation; mỗi loại phiếu được tách hoặc gộp các bước.
- Mỗi bước có 1–3 TF; máy chọn TF ít dùng gần đây; tạo lại thì giữ TF trừ khi giáo viên đổi.
- Mỗi lần gọi AI chỉ gửi phần file cần thiết; kiểm tra file khi nạp; dàn ý lưu cùng phiếu/gói `.wsp`.
- AI viết mô tả ảnh và kịch bản audio; ảnh và audio sinh ở Editor.
- Quy tắc cần ý đồ theo từng câu phải dựa tài liệu học thuật, mỗi quy tắc gắn nhãn căn cứ [HT]/[ND]/[TN]/[CL] ở `so-can-cu.md`, không để trong file AI đọc. Chưa tìm được nguồn cho "ý đồ câu đầu/giữa/cuối" của Reading/Listening.
- Danh sách từ vựng thử nghiệm: người dùng chấp nhận.

## 4. Thử nghiệm lesson Grammar Movers (mã GRAM-MOVERS-DAILY-01)
Bộ file nạp: `thu-vien/lesson/grammar-movers-daily-routines/` (kien-thuc, trinh-tu-lesson, task-format, so-can-cu) và `thu-vien/he-thong/anh-xa-tf-grammar-movers-sang-app.md`. Bản đóng gói để gửi AI ngoài: `goi-thu/v0.5/` (zip `goi-thu/goi-thu-v0.5.zip`): file 0 chỉ dẫn và định dạng đầu ra, 1 kiến thức, 2 trình tự, 3 task format.

Lịch sử thử:
1. Bản thử đầu (tôi tự sinh, v1, v2 trong `tests/md/sinh-thu-movers-grammar*.md`): lỗi đáp án, từ ngoài danh sách; người dùng chấm.
2. Lần 1 với AI ngoài (v0.4, một model): `thu-nghiem/DANH_GIA_AI_NGOAI_LAN_1.md` (hai file người dùng gửi trùng nhau).
3. Lần 2 (v0.4, ba model GPT 6.1 Sol 7,5, Claude 5.5 Haiku 6,5, Gemini 3.8 Flash 4,5): `thu-nghiem/DANH_GIA_AI_NGOAI_LAN_2.md`. Bộ file chấm 7/10. Lỗi chung: TF-G2-A lộ đáp án qua dạng động từ; câu mơ hồ có hai đáp án; phạm vi đếm động từ không rõ; thiếu nhân vật cho 3 hàng Task 1; AI tự đếm lệch.
4. **v0.5** đã sửa theo lần 2 (đã chạy thử lần 3 với Flash, Haiku, Sol, xem mục 4a): G2 mặc định TF-G2-B (TF-G2-A thành phương án phụ), liệt kê mẫu câu mơ hồ, Task 1 cố định ba hàng (Lucy mẫu, Ben, They), từ vựng mở theo Cambridge Starters/Movers, đếm động từ không tính chỉ dẫn và trợ động từ, NOTES và REPORT bằng tiếng Anh. **Chưa chạy thử v0.5 với AI nào.**

### 4a. Lần 3 (29/10/2026): chạy v0.5 với ba model
Đánh giá: `thu-nghiem/DANH_GIA_AI_NGOAI_LAN_3.md`; phiếu gốc: `thu-nghiem/phieu-lan-3/`. Điểm phiếu: Flash 6,5 (v0.4: 4,5), Haiku 6,0 (6,5), Sol 6,5 (7,5). Bộ file: 7,3 (v0.4: 7). Phiếu tệ nhất tăng, tốt nhất giảm. Lỗi mới của tài liệu: ô They/Now của TF-G1-B không điền được; quy tắc 30% "không có từ thời gian" bị lách (Sol chép lại dạng động từ của câu trước, Haiku nộp dù không đạt); thiếu danh sách Cambridge trong gói; định dạng đầu ra vẫn drift. Đề xuất v0.6 ở mục 5 của file đánh giá, chờ người dùng duyệt.

### 4b. Bộ file v0.6 (29/10/2026, chưa chạy thử)
Gói: `goi-thu/v0.6/` (zip `goi-thu/goi-thu-v0.6.zip`); bản thư viện cùng nội dung ở `thu-vien/lesson/grammar-movers-daily-routines/`. Sửa theo 6 đề xuất của lần 3: ô They/Now in sẵn "—" (3 ô điền ở Task 1, tiêu đề cột kèm định nghĩa bắt buộc); S5 mục 0 định nghĩa từ chỉ thời gian, mục 1 đo thêm "câu liền trước không chứa dạng động từ của đáp án", mục 1d cấm chép dạng, thêm 3 mẫu mơ hồ vào 1b; Tom/Mia cho G2–G3b; mỗi Task G2/G3a/G3b dùng ít nhất 4 trong 9 động từ chính; thêm lunch, together; AI chỉ liệt kê từ ngoài danh sách (không gán Starters/Movers); chỉ dẫn đầu ra cấm "see STIMULUS", link, tiêu đề thừa; G4 nêu rõ thời điểm "now"; G5 không cho khung câu; S1 sửa còn khoảng 25 câu. Việc kế: gửi v0.6 cho ba model, chấm lần 4.

1. (Đã làm lần 3, xem 4a; chờ duyệt đề xuất v0.6.) Quy trình đánh giá theo bốn lớp: (a) theo đúng ba tài liệu không, (b) lỗi nội dung (đáp án sai, mâu thuẫn tình huống, dựa từ khóa, từ ngoài phạm vi, câu mơ hồ), (c) lỗi do tài liệu thiếu hoặc mơ hồ, (d) lỗi do AI. Nạp phiếu vào `ws-editor.html` bằng Playwright để xem dàn trang (cách: chuyển định dạng trung tính sang MD theo `anh-xa-tf-grammar-movers-sang-app.md` và `docs/QUY_UOC_MD.md`).
2. Người dùng chưa trả lời có đồng ý đổi G2 mặc định sang TF-G2-B không; tôi đã chọn làm theo đề xuất.
3. Khi bộ file đạt, làm hết nhóm hệ thống (5 mục) và một lesson loại khác (ví dụ Reading hoặc Vocabulary) để kiểm tra bộ file nạp có đủ trên loại phiếu thứ hai chưa.
4. Nghiên cứu còn thiếu: toàn văn Field 2018, Barrett 1968, Clymer 1968, Trüb 2022 (chỉ có bản tóm tắt); cơ sở học thuật cho Writing, Speaking, phát âm; ý đồ từng câu Reading/Listening.
5. Bước 4 (kế hoạch xây hệ thống) chỉ làm khi người dùng bảo. Yêu cầu đã biết: trường mô tả ảnh và kịch bản audio, kiểm file khi nạp, chọn TF, nhất quán khi tạo lại, bộ phiếu chuẩn để kiểm hồi quy, ước tính chi phí; máy kiểm đếm động từ, từ ngoài danh sách, câu có từ thời gian (vì AI tự đếm lệch).

## 6. Cách làm việc (từ CLAUDE.md và người dùng)
Trả lời tiếng Việt, ngắn, thẳng; thảo luận trước, code khi được phép; ghi mọi thông tin mới lên git để phiên sau đủ ngữ cảnh. Người dùng là giáo viên, không phải lập trình viên.

## 7. Lệnh mở phiên mới
"Đọc CLAUDE.md và docs/TAO_BAI/BAN_GIAO_PHIEN.md (nhánh claude/project-thread-34uc6q), tóm tắt trạng thái ngắn rồi hỏi tôi muốn làm gì. Chưa cần làm gì cả."
