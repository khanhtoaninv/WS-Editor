# Kịch bản kiểm thử tay GĐ0, 1a, 1b (bổ sung cho KIEM_TRA_GD1A.md / KIEM_TRA_GD1B.md)

Mở `ws-editor.html`, nạp phiếu bằng + Phiếu → Nhập file, bấm **▶ Chiếu**. Ghi mỗi mục: Đạt / Lỗi (+ mô tả, ảnh nếu được). Tôi sẽ gom lại, bạn bảo sửa thì mới sửa.
Các mục đánh dấu ⚠ là chỗ tôi đã nghi có lỗi, cần bạn xác nhận bằng mắt.

## A. Phiếu thử: tạo file `thu-bien.md` (dán nội dung này)

```
# Thử biên
Tuổi: 10-12

## Task: Nối trùng chữ
Dạng: nối
Xáo vế phải: có
1. a - yes
2. b - yes
3. c - no

## Task: Đúng sai nhãn dài
Dạng: đúng/sai (True/False)
1. The sun is hot.
2. Fish can fly.

## Task: Dấu câu
Dạng: điền từ
1. How are you___
2. Hello___ my name is Tom.

## Task: Ký tự đặc biệt
Dạng: điền từ
1. We love ___ and Jerry.
2. Add ___ and ___.

## Đáp án
Task 2: T; F
Task 3: ?; ,
Task 4: Tom & Jerry; one | two
```
(Task 1 chưa có đáp án nối: vào WS Editor đặt đáp án nối a→yes thứ nhất, b→yes thứ hai, c→no.)

## B. Kịch bản lỗi nghi ngờ
| # | Làm | Kỳ vọng | Nghi ngờ |
|---|---|---|---|
| B1 ⚠ | Task 1: bấm A để hiện đáp án | a nối "yes" hàng 1, b nối "yes" hàng 2, c nối "no" | b bị nối vào hàng 1 |
| B2 ⚠ | Task 1: làm bài, nối b với "yes" hàng 2 | Đường vào đúng hàng 2 | Vào nhầm hàng 1 |
| B3 ⚠ | Task 3 câu 1: gõ `.` (đáp án `?`), Enter | ✗ đỏ | ra ✓ xanh |
| B4 | Task 3 câu 2: gõ `Hello` thay vì `,` | ✗ | — |
| B5 ⚠ | Task 2: đã nhập `T`/`F` | Chấm máy | Cả Task thành "chấm tay", có cảnh báo |
| B6 | Task 4: gõ `tom & jerry` | ✓ | ký tự & hiển thị đúng |
| B7 | Task 4 câu 2: gõ `one` và `two` | Hai ô ✓ | — |
| B8 ⚠ | Màn cảm ứng: chụm hai ngón trên trang | Phóng to / thu nhỏ trang trình chiếu | Trình duyệt phóng cả màn, hoặc không phóng |

## C. Ca biên chưa có test
| # | Làm | Kỳ vọng |
|---|---|---|
| C1 | Phiếu rỗng (không Task), bấm Chiếu | Không treo, thoát được bằng Esc |
| C2 | Phiếu không đáp án nào, bấm A | Báo "n chỗ chưa có đáp án", không lỗi |
| C3 | Hai phiếu **cùng tiêu đề**: vẽ nét ở phiếu 1, đóng, mở phiếu 2 chiếu | Phiếu 2 không có nét của phiếu 1 (nghi: bị nhận nhầm hoặc xóa nét nhau) |
| C4 | Phiếu có Task dài cắt qua ≥ 3 trang: chế độ Từng Task, vẽ bút ở mảnh giữa, đổi Cả trang | Nét đúng chỗ |
| C5 | Gõ thật nhanh 100 ký tự vào một ô, chữ dài hơn gạch | Gạch dài ra, không giật, không che chữ bên cạnh |
| C6 | Đang gõ dở trong ô rồi bấm A (hiện đáp án) bằng chuột nút | Chữ đang gõ không mất |
| C7 | Chọn nhiều (A. apple C. banana): chọn a rồi bấm Chấm; đổi sang a+b rồi Chấm | Lần 1 sai, lần 2 sai, chọn a+c thì đúng |
| C8 | Bấm bút (P), vẽ qua chỗ trống, Esc, gõ vào chỗ đó | Vẽ không đụng bài làm; gõ được |
| C9 | Che (H) rồi hé một câu, làm bài trong câu, phóng to, Từng Task | Bài làm còn, tấm che vẫn đúng |
| C10 | Làm 10 chỗ, bấm ⟲ Task rồi Làm lại cả phiếu | Số Đúng x/y đúng, không còn xanh đỏ |
| C11 | Cùng phiếu, trình duyệt khác (Edge / Firefox / Safari nếu có) | Chạy như Chrome; lưu nét báo được nếu chặn |
| C12 | Máy chiếu 1366×768 và TV 4K | Thanh công cụ vừa màn, chữ đọc được từ cuối lớp |
| C13 | Phiếu thật của bạn (3 phiếu khác dạng): làm hết từng chỗ | Chỗ nào bấm / gõ không được, ghi mã Task và câu |

## D. Cách báo lỗi cho tôi
Mỗi lỗi: số mục (ví dụ B3), phiếu nào, bạn làm gì, thấy gì, mong muốn gì, ảnh chụp. Gửi gộp, tôi phân loại (đúng/ sai kế hoạch / ý mới) và đề xuất trước khi sửa.
