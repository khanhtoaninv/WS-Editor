# Kế hoạch module Tạo bài (AI sinh phiếu cho WS Editor)

Bản nháp 1, 29/10/2026. Chưa có code. Căn cứ: thảo luận với người dùng và thử nghiệm Grammar Movers (`tests/md/sinh-thu-movers-grammar*.md`, `docs/TAO_BAI/DANH_GIA_2_FILE_MAU.md`).

## 1. Mục tiêu
Giáo viên nêu yêu cầu, AI tạo cả phiếu khớp bố cục và cấu trúc của WS Editor. Giáo viên duyệt, sửa tay hoặc sinh lại từng Task. Sinh lại phải luôn đạt chất lượng và nhất quán với phần còn lại của phiếu.

## 2. Quy trình ba bước
1. **Chuẩn bị.** Cách 1: chọn giáo trình, unit, lesson (admin đã nạp sẵn). Cách 2: bài tự do (level, chủ đề, mục tiêu, kỹ năng, nội dung, các bài và dạng Q, ghi chú).
2. **Duyệt tổng quan.** AI đọc dữ liệu, đưa dàn ý: danh sách Task, mỗi Task có bước (G1–G5 hoặc tương đương), mục tiêu, vai trò, nội dung, dạng Q, số câu. Giáo viên duyệt, sửa hoặc sinh lại.
3. **Tạo bài.** AI viết từng Task theo dàn ý đã duyệt, xuất MD theo `docs/QUY_UOC_MD.md`, nạp vào WS Editor để tinh chỉnh và xuất bản.

## 3. Tài liệu chuẩn cho hệ thống (cái AI "đọc")
Đơn vị nạp là **lesson**. Mỗi lesson có hai file do admin nạp:
- **Kiến thức:** mục tiêu, cấp độ, nội dung, phạm vi trong/ngoài, yêu cầu phiếu.
- **Trình tự nội dung:** các bước (vd G1–G5), mỗi bước có mục tiêu, nội dung cần có, quy tắc ra đề, dạng bài, tiêu chí kiểm định.

Thử nghiệm cho thấy hai file chưa đủ. Cần bổ sung (đánh dấu K = vào file Kiến thức, T = vào Trình tự, H = bộ tài liệu chung của hệ thống):
| # | Bổ sung | Vào đâu |
|---|---|---|
| 1 | Hồ sơ nhân vật và tình huống cố định (tên, tuổi, thói quen, cảnh chính) | K |
| 2 | Danh sách từ vựng và động từ cho phép, mức lặp được phép | K |
| 3 | Thuật ngữ và nhãn chuẩn kèm định nghĩa (vd Usually / Now), câu chỉ dẫn mẫu cho từng dạng | K |
| 4 | Số câu, độ dài bài đọc, số Task mục tiêu, thời lượng | T |
| 5 | Quy tắc riêng từng bước đã rút ra: G1 bài đọc chỉ chứa mẫu mục tiêu; G2 tối thiểu 30% câu suy từ tình huống, không dựa từ khóa; G4 phải có tình huống buộc chọn giữa các cấu trúc; G5 đầu ra rõ, không gượng ép | T |
| 6 | Bảng đối chiếu dạng bài (tên trong khung) với dạng Q của app, dạng nào cần ảnh | H |
| 7 | Quy tắc viết MD cho AI (từ `QUY_UOC_MD.md`, `PROMPT_PDF_SANG_MD_v116.txt`) kèm các bẫy đã gặp (vd khối dữ kiện phải `Khối chữ trên:`) | H |
| 8 | Quy tắc hình thức: in đen trắng được, không phụ thuộc ảnh chưa có, mỗi Task trọn trang | H |
| 9 | Một phiếu mẫu đã duyệt cho mỗi loại lesson (giọng, mức khó) | H |
| 10 | Rubric kiểm chất lượng (bản v0 ở `RUBRIC_KIEM_v0.md`, mở rộng từ hai lần đánh giá) | H |

## 4. Dữ liệu lưu cùng phiếu (để sinh lại nhất quán)
Phiếu (và gói `.wsp`) mang theo "hồ sơ tạo bài", là dữ liệu có cấu trúc, không phải chữ tự do:
- **Hồ sơ lesson:** tham chiếu hai file nguồn và phiên bản, hoặc bản chụp nếu là bài tự do.
- **Dàn ý đã duyệt:** từng Task có mã, bước, mục tiêu, vai trò, nội dung, dạng Q, số câu.
- **Ngữ cảnh chung:** nhân vật, cảnh, từ vựng đã dùng.
- **Trạng thái từng Task:** do AI sinh, đã sửa tay, đã khóa; phiên bản quy tắc đã dùng.

## 5. Quy trình sinh và kiểm mỗi Task
1. **Sinh** từ: dàn ý Task đó, hồ sơ lesson, ngữ cảnh chung, tóm tắt các Task kế bên, quy tắc dạng Q và quy tắc bước.
2. **Kiểm** bằng một lượt AI riêng theo rubric (một đáp án duy nhất, đủ dữ kiện, chọn theo nghĩa chứ không theo từ khóa, đúng phạm vi, chỉ dẫn rõ, nhất quán nhân vật, đáp án đúng).
3. **Kiểm máy** (không cần AI): MD đọc được, đủ số câu, có đáp án đúng cho mọi câu, từ nằm trong danh sách cho phép.
4. Không qua thì tự sinh lại tối đa N lần kèm lỗi cần sửa, vẫn không qua thì gắn cờ cho giáo viên.
5. **Sinh lại do giáo viên:** kèm lời dặn ("dễ hơn", "đổi tình huống"); bản đã sửa tay làm tham chiếu; Task đã khóa không bị đụng; hoàn tác về bản trước.

## 6. Giai đoạn
- **A. Dán qua lại, không cần máy chủ.** App tạo "đoạn nhắc" từ hồ sơ lesson, giáo viên dán vào Claude rồi dán MD ngược lại. Thử chất lượng và rubric trên nhiều lesson. Chưa tốn công ráp API.
- **B. Gọi AI thẳng từ `server/`** (khóa API ở máy chủ, như Insight AI): form chuẩn bị, màn duyệt dàn ý, sinh từng Task, bước kiểm, nạp vào editor.
- **C. Sinh lại nhất quán:** lưu hồ sơ tạo bài trong phiếu và `.wsp`, khóa Task, hoàn tác, tóm tắt Task kế bên.
- **D. Kho lesson và cách 1:** giao diện admin nạp hai file, chọn giáo trình, unit, lesson.
Mỗi giai đoạn dùng được ngay, không phải đợi giai đoạn sau.

## 7. Đã kiểm chứng (29/10)
- Thử sinh một phiếu 7 Task từ hai file mẫu: nạp được vào editor, 0 lỗi tràn trang, 0 lỗi console.
- AI kiểm (chưa thấy đánh giá của người dùng) bắt đúng 4/6 lỗi người dùng nêu, 1/6 một phần, 1/6 không; bắt thêm lỗi đáp án và mâu thuẫn tình huống. Chi tiết: `SO_SANH_KIEM_AI_VOI_DANH_GIA_GV.md`.
- Hai vòng đánh giá của người dùng cho thấy lỗi còn lại chuyển từ làm sai sang chuẩn hóa thuật ngữ và tinh chỉnh.

## 8. Chưa kiểm chứng và rủi ro
- Mới thử một lesson ngữ pháp. Chưa biết bộ tài liệu có dùng chung cho lesson từ vựng, đọc hiểu, nghe, viết.
- Chưa gọi API thật, chưa đo chi phí và thời gian một phiếu.
- Ảnh: AI chữ không tạo ảnh. Cần khe ảnh kèm mô tả hoặc nguồn ảnh riêng.
- Độ khó thực tế với học sinh chỉ biết khi thử với học sinh.
- Bố cục và chia trang do app xử lý, không phải AI; cần quy tắc "giữ trọn Task" trong editor.
- Bản quyền nội dung giáo trình khi nạp lên máy chủ: cần người dùng quyết.

## 9. Việc tiếp theo đề xuất
1. Người dùng chốt hướng giai đoạn A trước, và đưa một lesson thứ hai khác loại (từ vựng hoặc đọc hiểu) để thử.
2. Viết bản đầu bộ tài liệu H và bổ sung K, T cho lesson Grammar Movers.
3. Thử lại sinh, kiểm, sinh lại trên hai lesson, đo số lỗi mỗi vòng.
