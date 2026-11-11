# Hướng dẫn tạo thử phiếu bên ngoài app

Dùng bộ file này để sinh thử một phiếu Grammar cuối Starters bằng AI chat (Claude hoặc ChatGPT), kiểm tra và chấm, khi app chưa có chức năng sinh theo bộ file mới.

Lesson mẫu: **can / can't** (Kiến thức ở `nguon/1_KIEN_THUC_can.md`). Phiếu 5 Task: Bảng → Chọn A/B/C → Chọn trong câu → Điền từ → Viết câu, mức Vừa.

## Cần mở sẵn
| File | Dùng ở bước |
|---|---|
| `11_LENH_SINH_PHIEU.md` | 1. Sinh phiếu |
| `KIEM_TRA_PHIEU.html` (mở bằng trình duyệt) | 2. Máy kiểm, 3. Tạo bản cho rà soát, 5. Xem trên WS Editor |
| `12_LENH_RA_SOAT.md` | 3. Rà soát |
| `13_LENH_SUA_PHIEU.md` | 4. Sửa |
| `PHIEU_CHAM_THU.md` | 6. Chấm |

Mỗi lệnh là một file chữ: mở bằng Notepad / TextEdit / VS Code, chọn hết (Ctrl+A), sao chép (Ctrl+C), dán vào ô chat.

## Bước 1: Sinh phiếu
1. Mở **một cuộc trò chuyện mới** (gọi là **chat A**). Nên dùng mô hình mạnh nhất bạn có.
2. Dán toàn bộ `11_LENH_SINH_PHIEU.md`, gửi.
3. AI trả về phiếu: 5 Task, `## Đáp án`, `## Báo cáo`. Sao chép toàn bộ câu trả lời.
   - Nếu AI hỏi lại hoặc chào hỏi: nhắn "Viết phiếu theo đúng mục 9, chỉ trả về Markdown."
   - Nếu câu trả lời bị cắt giữa chừng: nhắn "Viết tiếp từ chỗ dừng."

## Bước 2: Máy kiểm
1. Mở `KIEM_TRA_PHIEU.html` bằng trình duyệt.
2. Dán câu trả lời vào ô **Kết quả AI**, bấm **Kiểm tra**.
3. Đọc kết quả: đỏ là lỗi, vàng là cảnh báo. Ghi số lỗi vào phiếu chấm (lượt 1).
   - Máy kiểm: số Task, số câu, dạng, ba lựa chọn, vị trí đáp án, độ dài bài đọc và phần đề, từ ngoài danh sách Starters, dấu hiệu bề mặt ở câu bắt buộc, câu liền trước lộ đáp án, Báo cáo.
   - Máy **không** kiểm được nghĩa, độ hay, đúng sai ngữ pháp. Việc đó là của bước 3 và của bạn.

## Bước 3: Rà soát (AI thứ hai)
1. Trong trang kiểm tra, bấm **Bản bỏ đáp án**, sao chép nội dung ô bên dưới.
2. Mở `12_LENH_RA_SOAT.md`, thay dòng `<<DÁN PHIẾU ĐÃ BỎ ĐÁP ÁN VÀO ĐÂY>>` bằng nội dung vừa sao chép.
3. Mở **một cuộc trò chuyện mới khác** (gọi là **chat B**), dán toàn bộ, gửi.
4. AI trả về `## Rà soát` cho từng Task.
5. So **Đáp án tự làm** của chat B với `## Đáp án` của chat A. Câu nào khác, hoặc có "hoặc", là câu có vấn đề.

## Bước 4: Sửa (nếu có lỗi)
1. Trong trang kiểm tra, bấm **Danh sách lỗi**, sao chép.
2. Mở `13_LENH_SUA_PHIEU.md`, thay dòng `<<DÁN DANH SÁCH LỖI …>>` bằng:
   - danh sách lỗi của máy;
   - các dòng **Lỗi** trong phần Rà soát của chat B (chỉ dán lỗi bạn đồng ý);
   - câu có đáp án lệch ở bước 3.5, ví dụ "Task 2 câu 3: có hai đáp án hợp lý (A hoặc B)".
3. Dán vào **chat A** (cùng cuộc trò chuyện lúc sinh), gửi. AI trả lại toàn bộ phiếu đã sửa.
4. Quay lại bước 2 với phiếu mới. Tối đa 2 lần sửa; sau đó dừng và chấm.

## Bước 5: Xem trên WS Editor
1. Trong trang kiểm tra, bấm **Bản dán vào WS Editor**, sao chép.
2. Mở WS Editor, bấm **+ Phiếu**, chọn cách dán, dán vào, bấm nạp.
3. Xem phiếu như học sinh nhìn thấy, rồi chụp màn hình để lưu.

## Bước 6: Chấm
Điền `PHIEU_CHAM_THU.md` cho mỗi lần sinh. Nên làm **3 lần sinh** với cùng lệnh, mỗi lần là một chat A mới, để xem kết quả có ổn định không.

## Ghi lại để cải tiến bộ file
Mỗi lỗi bạn thấy, ghi một dòng: Task, câu, lỗi gì, lỗi thuộc chỗ nào:
- **Kiến thức**: thiếu dấu hiệu, thiếu lỗi thường gặp…
- **Trình tự**: quy tắc chưa rõ hoặc mâu thuẫn.
- **Câu mẫu**: AI chép, hoặc mẫu sai.
- **Quy tắc MD**: sai cú pháp, app đọc sai.
- **AI không tuân thủ**: quy tắc rõ mà vẫn sai.

Gửi lại cho Claude để sửa đúng file.

## Đã biết
- App hiện bỏ mất bài đọc nếu viết `Bài đọc:` trong Task dạng bảng. Bộ lệnh đã đổi sang `Khối chữ trên:` để tránh lỗi này. Lỗi của app cần sửa sau.
- App xếp ba lựa chọn A/B/C theo hàng ngang. Đổi trong phần chỉnh dạng câu hỏi nếu muốn xếp dọc.
- Danh sách ngữ pháp Starters (Grammar and structures list) chưa có, nên mục Ngoài phạm vi của Kiến thức mẫu do Claude ghi.
