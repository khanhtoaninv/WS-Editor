# Kế hoạch v101 (27/10/2026): sau khi thử phiếu 7 với v100

Nguồn: phản hồi của người dùng sau khi nạp MD phiếu 7 (v100). Trạng thái: **đã làm xong (v101)**. Hai câu ở mục E lấy đề xuất (giữ phiếu cũ đọc được; ô nhiều dòng cho mọi dạng, trừ dòng chữ giữa câu và câu có ảnh).

## A. Phân loại: code hay prompt
| # | Vấn đề | Lớp lỗi | Việc |
|---|---|---|---|
| 1 | Task 3 không kéo lên trang 1 dù còn 41 mm | **Không lỗi.** Mảnh đầu (tiêu đề + câu 1) ≈ 41 mm + 6 mm giữa các Task > 41 mm | Không đổi luật cắt trang. Gợi ý người dùng: xếp lựa chọn A/B/C ngang |
| 2 | Bài đọc chứa `___` đóng vai câu hỏi, không xác định được đáp án khi làm phiếu tương tác | **Mô hình** (bài đọc kiêm chỗ trả lời) | Nguyên tắc mới: *mọi thứ cần đáp án đều là câu hỏi; bài đọc chỉ là chữ* (B1–B5) |
| 3 | Ô câu hỏi (cột trái) một dòng, không ngắt đoạn, khó đọc khi dán cả đoạn | **Code** | B2 |
| 4 | Dòng `____` thừa ở cuối Task điền từ | **Code**: dòng kẻ của "viết từ theo câu" thêm sau mọi câu, kể cả câu đã có `___` trong chữ | B3 |
| 5 | `(a) ___` trong câu bị cắt phần sau `(a)` | **Code**: bộ đọc hiểu nhãn `(a)` là lựa chọn | B1 |
| 6 | T/F cùng hàng: số câu căn trên, T/F căn giữa nên lệch | **Code** | C1 |
| 7 | Không kéo gần nhóm T/F lại với câu | **Code** (bản "cùng hàng" v100 đẩy T/F sát lề phải) | C2 |
| 8 | AI viết sai cấu trúc cho bài điền từ vào đoạn văn | **Prompt** | D1 |

## B. Điền từ vào đoạn văn: dùng Q1, không thêm dạng thứ 13
Cách trình bày Task 1: bài đọc (G2) chỉ có tiêu đề; mỗi đoạn là một câu Q1 chứa nhiều `___`; số câu ẩn; bố cục ảnh phải.
- **B1** Bộ đọc: `(a) ___` giữ nguyên trong câu; chỗ trống đứng sau nhãn có sẵn không thêm số (v100 đã làm cho bài đọc, mở rộng cho câu).
- **B2** Ô câu hỏi nhiều dòng như ô bài đọc: dòng trống ngắt đoạn, kéo giãn, thanh B I U. Căn lề chữ để sau.
- **B3** Câu có `___` trong chữ thì không thêm dòng kẻ sau câu (cả khi soạn tay, không chỉ khi nạp MD).
- **B4** Đáp án đúng riêng cho từng chỗ trống (khung soạn Q1 đã có ô này cho câu nhiều chỗ trống; kiểm lại với nhãn `(a)`).
- **B5** Phiếu cũ có `___` trong bài đọc: đề xuất giữ đọc được, app chỉ ghi chú "nên chuyển thành câu hỏi".

## C. Task Đúng/Sai cùng hàng
- **C1** Nút **Căn dọc: Trên / Giữa / Dưới** cho cả khối câu của Task (áp cho mọi câu, không theo từng câu): số câu, chữ câu, ô T/F cùng đường căn.
- **C2** Khoảng cách từ câu đến ô T/F: **Sát câu / Sát lề phải**, kèm số mm khi sát câu.

## D. Prompt PDF→MD (`docs/PROMPT_PDF_SANG_PHIEU.md`)
- **D1** Quy tắc mới: bài điền từ vào đoạn văn thì `Bài đọc:` chỉ ghi tiêu đề; mỗi đoạn là một câu `1.`, `2.`…; kèm `Số câu: ẩn`; nhãn `(a)` giữ nguyên. Cập nhật bản xuất ở `/mnt/project-files/prompt/`.
- **D2** Bản prompt JSON (cách A) cập nhật theo quy tắc 16–20 của v100 và D1.

## E. Câu hỏi chờ người dùng
- B5: phiếu cũ có `___` trong bài đọc: giữ đọc được (đề xuất) hay bỏ hẳn?
- B2: ô nhiều dòng làm cho mọi dạng câu hỏi (đề xuất, vì cùng một ô) hay chỉ Điền từ?

## F. Thứ tự làm, kiểm thử, bàn giao
1. B3 + B1 (sửa lỗi nhỏ) → test mới.
2. B2 (ô nhiều dòng) → test mới.
3. B4 kiểm đáp án từng chỗ trống → test.
4. C1, C2 → test.
5. D1, D2 prompt; nạp lại phiếu 7 từ MD mới; chụp hình so với PDF.
6. Chạy `tests/run_all.sh` đủ bộ, cập nhật spec (mục 33), BÀN GIAO, báo cáo phiên, badge v101, commit, PR.

Mỗi bước tự kiểm thử trước khi sang bước sau; báo rõ chỗ chưa kiểm thử.
