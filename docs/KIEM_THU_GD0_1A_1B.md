# Kiểm thử chất lượng GĐ0, GĐ1a, GĐ1b (bản v112, 28/10/2026)

Chỉ kiểm thử và đề xuất, **chưa sửa code**. Chờ người dùng quyết mục "Đề xuất".

## 1. Đã chạy trên `ws-editor.html` v112
| Bộ kiểm | Kết quả |
|---|---|
| Đường chuẩn `chuan.py so` | 120/120 khớp |
| `giaodien.py` (so với prototype v106) | 2497/2497 khớp |
| 49 test cũ + audit (`run_all.sh`) | 49/49 ALL OK, audit 0 vấn đề |
| `tests/gd1a/test_chieu.py` | 72/72, 0 lỗi console |
| `tests/gd1b/test_lambai.py` | 82/82, 0 lỗi console |
| `shared` (`npm test`) | 11/11 (gồm 6 phiếu mẫu × 3 bài làm) |
Chưa chạy lại: `quet_phieu.py`, `quet_lambai.py` (quét 25 phiếu); cảm ứng thật, máy chiếu thật.

## 2. Lỗi / lệch tìm được (đã tái hiện)
1. **Nối có hai vế phải trùng chữ (vd. hai chữ "yes")**: đường nối của vế trái thứ hai vẽ vào cùng hàng với vế thứ nhất, vì trình chiếu tìm hàng vế phải theo *chữ* (`rightRow` trong `viewer/answers.ts`) chứ không theo mã. Chấm điểm vẫn đúng (theo mã), chỉ hiển thị đáp án và đường làm bài sai. Bấm vế phải khi làm bài (`workClick`, so `textContent`) cũng nhầm hàng.
2. **Máy chấm coi dấu câu hai đầu là không có nghĩa** (`shared/normalize.ts`, `EDGE_PUNCT`): `.` = `?` = `!` đúng; `Hello.` = `Hello?`; `-5` = `5`. Bài điền dấu câu (đáp án `?`) học sinh gõ `.` vẫn ra ✓ (đã thử trên giao diện). Đúng với kế hoạch "thừa dấu chấm cuối", nhưng chưa có cách tắt cho từng chỗ (`ignorePunct` / `caseSensitive` có trong kiểu dữ liệu nhưng WS Editor không bao giờ đặt).
3. **Đáp án T/F ghi `T`/`F` nhưng nhãn là True/False** (hoặc ngược lại ghi `Đúng` với nhãn T/F ổn, `T` với True/False không): cả Task chuyển chấm tay, có cảnh báo nhưng người soạn phải sửa tay. Đề xuất cho `T`/`F` khớp chữ cái đầu của nhãn.
4. **Chụm hai ngón (B3)**: `.vstage` không có `touch-action`, trình duyệt cảm ứng có thể tự phóng cả trang và gửi `pointercancel`, nên chụm có thể không chạy. Playwright không kiểm được, cần thử trên màn cảm ứng (mục 17–22 `KIEM_TRA_GD1A.md`).
5. Nhỏ: nét vẽ lưu theo *tiêu đề phiếu* (`store`), hai phiếu cùng tiêu đề dùng chung ô lưu và xóa nét của nhau; ghi chú đã biết ở GĐ0 là mã `q2` được cấp lại sau khi xóa, chỉ ảnh hưởng khi gộp thống kê (1c).
6. Nhỏ: `taskSlots0` gọi `lab()` trong `notes.push` ở hội thoại, làm tăng đếm số (1)(2) nếu vào nhánh cảnh báo (chưa thấy phiếu nào gặp).

## 3. Chỗ lệch kế hoạch
- GĐ1b C4 yêu cầu "so kết quả tô màu với `shared/fixtures/mau-du-dang`". Test giao diện chỉ thử từng chỗ có chọn lọc (82 kiểm), **không có kiểm từng chỗ của phiếu mẫu giao diện = `grade()`**. Chấm điểm đúng (đã có test Node), còn tô màu giao diện chưa kiểm tổng thể.
- `DUYET_GD0.md`: bảng ghi Task 12 (bảng tick, mỗi hàng một ô đúng) là "chọn nhiều"; theo chú thích mã nguồn (v98) "một ô đúng mỗi hàng thì chọn một". Cần xác nhận với người soạn (UI hiện vẫn chấm ngay nên không ảnh hưởng người dùng, chỉ kiểu `choice-many` trong gói).
- Các lệch đã tự ghi trong KE_HOACH_GD1A (nút Chiếu nổi, bút ở thanh dọc) là có chủ ý.

## 4. Ca biên chưa kiểm
Phiếu rỗng / không có chỗ trả lời bấm Chiếu; phiếu có chỗ trống trong ô bảng chứa HTML; đáp án chứa `&` `<`; chấm 3 nhãn T/F/NG; chọn nhiều có `scoring: partial` (chỉ có ở kiểu dữ liệu, WS Editor không sinh); Task cắt nhiều trang (≥3 mảnh) với bút; màn dọc / điện thoại; số chỗ lớn (hiệu năng gõ khi vẽ lại mỗi lần).

## 5. Đề xuất (chờ quyết)
A. Sửa lỗi 1 (tìm hàng vế phải theo mã/thứ tự, không theo chữ) trước 1c vì 1c dùng lại mã này. Làm ngay.
B. Lỗi 2: thêm công tắc "Chấm cả dấu câu" theo Task hoặc theo chỗ (dùng `ignorePunct`/mới `strictPunct`); mặc định giữ như hiện nay.
C. Lỗi 3: cho `T`/`F`/`Đúng`/`Sai` khớp theo chữ cái đầu nhãn.
D. Thêm test giao diện = `grade()` cho cả 3 bài làm mẫu (đúng hết / trộn / bỏ trống).
E. Thử tay cảm ứng (lỗi 4) trước khi sửa.
