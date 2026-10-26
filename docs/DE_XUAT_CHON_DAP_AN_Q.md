# Đề xuất (chưa code): chọn đáp án đúng ngay trong giao diện mọi dạng Q — 2026-10-26

Nguồn: góp ý của người dùng sau v86. Trạng thái: **thảo luận, chưa làm**.

## 1. Q3 (Chọn A/B/C): bỏ ô "Chọn", sửa thẳng danh sách đáp án
Hiện tại: ô "Chọn" chứa các lựa chọn gộp một dòng, bên dưới lặp lại a/b/c kèm hàng "Đúng" có ô tích → nhập hai lần.
Đề nghị:
- Đổi nhãn "Đúng" thành **"Đáp án"**; lề phải có icon **+** thêm đáp án (và nút xóa từng dòng, tối thiểu 2).
- Mỗi dòng: **ô tích (đúng) + nhãn a./b./c. (tự đánh) + ô gõ nội dung**. Bỏ ô "Chọn" gộp.
- Tích nhiều ô được (câu nhiều đáp án đúng); `key` = "b, c" như F2 (`keyParts`).
- Dữ liệu: vẫn là `choices[]` + `key`, chỉ đổi giao diện nhập; dữ liệu cũ đọc được không cần chuyển.

## 2. Rà soát các dạng Q: dạng nào có đáp án đúng nhưng chưa có thao tác xác định
(Trừ Q12 viết mở.) Bảng dưới là **nhận định từ spec, chưa kiểm trên app**; cần chạy thử từng dạng trước khi sửa.
| Q | Đáp án đúng là gì | Hiện có chọn/nhập đáp án? | Đề xuất |
|---|---|---|---|
| Q1 Điền từ | từ điền | có ô gõ (`key`); khung từ: chưa chắc có chọn từ đúng cho từng chỗ trống | Với khung từ: mỗi chỗ trống chọn từ trong khung |
| Q2 Viết câu | câu mẫu | ô gõ | giữ |
| Q3 Chọn A/B/C | lựa chọn đúng | tích (F2) nhưng nhập hai chỗ | làm lại như mục 1 |
| Q4 Chọn trong câu `{a\|b}` | vế đúng | chưa rõ có đánh dấu | đánh dấu vế đúng ngay trên câu (bấm vào vế) |
| Q5 Đúng/Sai | T/F/NG… | có tích | giữ, kiểm đủ các bộ nhãn |
| Q6 Nhìn ảnh viết | từ | ô gõ | giữ |
| Q7 Chọn ảnh | ảnh đúng | tích dưới ảnh | giữ, cho nhiều ảnh đúng |
| Q8 Nối | cặp đúng | chưa rõ (vế ghép cùng hàng?) | cần xác định cặp rõ ràng |
| Q9 Tô chữ | chữ cần tô | chưa rõ | chọn chữ cần tô |
| Q10 Bảng / Q11 Lưới | chữ trong ô | `table.key` | kiểm |
| Q12 Viết tự do | không có | — | loại trừ |

## Câu hỏi mở
Q4 và Q9 đánh dấu đáp án ngay trên chữ của câu hay trong panel? Khuyến nghị: ngay trên chữ (bấm vào), vì khớp với cách giáo viên nhìn phiếu.
