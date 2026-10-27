# Kế hoạch GĐ1b: giáo viên tự tương tác trên phiếu

> 27/10/2026 · Theo cách chia của người dùng: 1a trình chiếu (xong, v111), **1b giáo viên mở phiếu, tự gõ / chọn một đáp án, máy báo đúng sai ngay để giảng cho học sinh**, 1c làm bài trên lớp (sau GĐ2). **Chưa code**, chờ người dùng nói "ok làm".
> Kết quả: trong trình chiếu có nút **✍ Làm thử**. Bật lên là phiếu thành phiếu làm được: gõ vào chỗ trống, bấm chọn A/B/C, T/F, ô tick, nối, điền bảng, ô chữ; máy tô **xanh (đúng) / đỏ (sai)** ngay tại chỗ. Không lưu, không gửi đi đâu ("tương tác một chiều").

## 0. Hiện trạng đã có (từ GĐ0, GĐ1a)

| Có sẵn | Dùng cho 1b |
|---|---|
| `data-ans` trên từng chỗ trả lời, `sheetSlots` cho cách làm từng chỗ (`text`, `choice-one`, `tf`, `match`, `cell`…) | Biết đặt ô gõ / nút chọn ở đâu, kiểu gì |
| Thư viện chung `shared/` `gradeSlot()` + chuẩn hóa chữ (hoa thường, nháy cong, gạch nối, dấu câu cuối) | Chấm **giống hệt** TeacherResource sau này |
| Trình chiếu 1a: Cả trang / Từng Task, phóng, bút, che / hé, hiện đáp án đúng chỗ | 1b là một chế độ trong trình chiếu, dùng lại hết |

## 1. Cách làm từng dạng

| Dạng | Giáo viên làm gì | Máy chấm khi nào |
|---|---|---|
| Điền từ, viết câu ngắn, bài đọc có chỗ trống, nhìn ảnh viết (`text`) | Bấm vào gạch → ô gõ hiện ngay trên gạch, cỡ chữ theo phiếu | Enter hoặc bấm ra ngoài |
| Ô bảng (`cell`) | Bấm ô → gõ | Enter / ra ngoài |
| Ô chữ (Q11) | Bấm ô → gõ một chữ, tự nhảy sang ô kế (theo hàng ngang; giữ Shift = theo cột) | Ngay khi gõ chữ |
| Chọn A/B/C, chọn trong câu `{a\|b}`, tìm lỗi sai A–D, chọn ảnh, T/F | Bấm phương án | Ngay khi bấm (bấm phương án khác = đổi) |
| Chọn nhiều | Bấm từng phương án, nút **Chấm** nhỏ cạnh câu (hoặc Enter) | Khi bấm Chấm |
| Hàng tick trong bảng | Bấm ô tick | Ngay khi bấm |
| Nối | Bấm chấm trái rồi chấm phải → vẽ đường; bấm lại đường để gỡ. Bài nối có ô viết chữ: gõ chữ cái | Ngay khi nối xong một cặp |
| Viết đoạn / chỗ chưa có đáp án | Gõ được (cho học sinh xem cách viết), máy ghi **"chấm tay"**; có bài mẫu thì có nút xem bài mẫu | Không chấm |
| Tô chữ, khung vẽ | Không có ô (dùng bút của 1a) | — |

## 2. Phản hồi đúng / sai (mặc định, đổi được trên thanh công cụ)
- Đúng: viền xanh + dấu ✓ nhỏ. Sai: viền đỏ + dấu ✗ nhỏ. **Không tự hiện đáp án đúng khi sai** (để giáo viên hỏi lại lớp); bấm ✗ hoặc dùng nút Đáp án của 1a để hiện.
- Công tắc **"Sai thì hiện đáp án"**: bật thì sai xong hiện luôn đáp án đúng bên cạnh.
- Bộ đếm **Đúng x / y** trên thanh công cụ (chỉ đếm chỗ chấm máy).
- **Làm lại**: nút ⟲ đầu mỗi Task (xóa bài làm của Task) và Làm lại cả phiếu.
- Hiệu ứng khen (hình sao, tiếng chuông) chưa làm ở 1b; ghi vào việc sau nếu bạn muốn.

## 3. Ghép với 1a
- Bật Làm thử thì bấm vào chỗ trả lời là **làm bài**, không phải hiện đáp án như 1a. Muốn hiện đáp án: phím A / nút ✓ đầu Task vẫn dùng được.
- Bút, che / hé, phóng, Từng Task, đồng hồ, bảng trắng dùng chung. Đang gõ trong ô thì phím tắt trình chiếu (T, A, H…) không chạy.
- Tab / Shift+Tab: sang chỗ trả lời kế / trước trong phần đang xem. Enter: chấm rồi sang chỗ kế.
- Màn cảm ứng: chạm ô thì bàn phím ảo hiện (ô gõ là ô nhập thật).
- Bài làm giữ trong lúc chiếu (lật trang, đổi kiểu xem vẫn còn); **đóng trình chiếu là xóa**. Không lưu, không gửi đi.

## 4. Các bước (mỗi bước tự kiểm thử rồi mới sang bước sau)

### C1. Nền làm thử + ô gõ
- Nút ✍ Làm thử (phím W), trạng thái bài làm dạng `Answers` của `shared/` (cùng khuôn với bài nộp ở 1c).
- Ô gõ cho `text`, `cell`, ô chữ: đặt ngay trên phần tử `data-ans` của bản sao trang, chữ cỡ phiếu, phóng to vẫn khớp.
- Test: gõ đáp án đúng / sai / khác hoa thường / thừa dấu chấm trên phiếu mẫu `tests/gd0/mau-du-dang.md`.

### C2. Bấm chọn
- `choice-one`, `choice-many` (+ nút Chấm), `tf`, ô tick, chọn ảnh, `{a|b}`, tìm lỗi sai A–D.
- Phương án đang chọn có viền xám; sau khi chấm thì xanh / đỏ.

### C3. Nối
- Bấm chấm trái → chấm phải (hoặc ngược lại) vẽ đường; một chấm trái chỉ một đường; bấm đường để gỡ. Ô nối viết chữ: gõ chữ cái.

### C4. Chấm và phản hồi
- Chấm bằng `gradeSlot()` của `shared/`. Tô xanh / đỏ, ✓ / ✗, bộ đếm Đúng x/y, công tắc "Sai thì hiện đáp án", Làm lại Task / cả phiếu, chỗ chấm tay ghi rõ.
- Test: so kết quả tô màu với `shared/fixtures/mau-du-dang` (bài làm mẫu đúng hết / trộn / bỏ trống phải ra đúng trạng thái đã ghi).

### C5. Ghép với 1a và bàn phím
- Tab / Enter, khóa phím tắt khi đang gõ, cùng chạy với bút, che / hé, Từng Task, phóng. Đổi kiểu xem / lật trang giữ bài làm.

### C6. Hoàn tất
- Chạy trình chiếu + làm thử trên 25 phiếu mẫu (không lỗi, mọi chỗ chấm máy làm được), đủ bộ test cũ (120/120, 2497, 49 test), test 1a.
- Spec mục mới, báo cáo phiên, badge v112, commit và push, danh sách thử tay `KIEM_TRA_GD1B.md`.

## 5. Không làm ở 1b
Lưu bài làm, nhiều người cùng làm, gửi kết quả (đó là 1c, cần TeacherResource); chế độ Quiz từng câu chữ lớn; hình / tiếng khen.

## 6. Rủi ro
| Rủi ro | Cách giữ |
|---|---|
| Ô gõ đè lệch chỗ trống ở dạng lạ (gạch cuối câu, ô nhiều dòng) | Ô gõ nằm trong chính phần tử `data-ans` của bản sao trang; chụp ảnh từng dạng |
| Máy chấm khác cách giáo viên nghĩ (`isn't` ≠ `is not`) | Đã thống nhất ở GĐ0: nhiều cách viết ghi cách nhau ` / `; không tự mở rộng viết tắt |
| Bấm nhầm giữa làm bài và hiện đáp án | Làm thử là công tắc rõ ràng trên thanh công cụ, đổi màu khi bật |

## 7. Cần bạn chốt
Mặc định "sai thì **không** tự hiện đáp án đúng" (giáo viên hỏi lại lớp trước), có công tắc để bật. Bạn muốn mặc định như vậy hay ngược lại?
