# Tài liệu 3. Lộ trình: phiếu tương tác và TeacherResource

> Bản nháp **v0** · 27/10/2026 · Đọc kèm `1_TONG_QUAN_KIEN_TRUC.md`, `2_CHUAN_GOI_PHIEU.md`.

## 1. Nguyên tắc

1. **Mỗi giai đoạn chạy được và nghiệm thu được** trước khi sang giai đoạn sau. Người dùng thử trên thiết bị thật ở cuối mỗi giai đoạn.
2. **Không phá WS Editor hiện có.** Mọi thay đổi trong WS Editor vẫn qua đường chuẩn (`tests/chuan/chuan.py so`, `tests/chuan/giaodien.py`) và bộ test cũ; phiếu cũ mở ra như trước.
3. **Hợp đồng trước, giao diện sau.** Chuẩn gói và hàm chấm (có bộ mẫu kèm kết quả mong đợi) làm trước, để WS Editor và TeacherResource làm song song mà không lệch.
4. Thảo luận trước, code khi người dùng cho phép (quy tắc dự án). Mỗi giai đoạn mở đầu bằng một kế hoạch ngắn để duyệt.

## 2. Tổng quan giai đoạn

| GĐ | Tên | Làm ở | Ra được gì | Phụ thuộc |
|---|---|---|---|---|
| 0 | Chuẩn bị | WS Editor | Mã chỗ trả lời ổn định, lõi chấm tách riêng, `ws-shared` khởi tạo | — |
| 1 | Thử tương tác trong WS Editor | WS Editor + `ws-shared` | Người soạn làm thử, chấm thử; giáo viên chiếu, hiện đáp án (V1 cơ bản) | 0 |
| 2 | Xuất gói `.wsp` | WS Editor + `ws-shared` | File gói đã ký, mã hóa, có kiểm tra; công cụ đọc gói | 1 |
| 3 | TeacherResource lõi | TeacherResource | Đăng nhập, lớp, import, giao bài về nhà, làm, nộp, chấm, kết quả, chữa từng em, thống kê cơ bản | 2 |
| 4 | Buổi trực tiếp | TeacherResource | Quét mã vào làm, theo dõi tức thời, `live-board` chữa bài, thống kê đầy đủ | 3 |
| 5 | Mở rộng | cả hai | Bút vẽ, công cụ trình chiếu, xáo phương án, … (chọn theo nhu cầu) | 1 (bút), 3 |

GĐ1 và GĐ3 có thể chạy **song song** sau khi GĐ2 chốt định dạng (TeacherResource dùng gói mẫu trong `ws-shared/fixtures`).

## 3. GĐ0. Chuẩn bị trong WS Editor

- **Hết đóng băng tính năng** (đã chốt 27/10/2026). Phần chuyển React còn lại (`KE_HOACH_REACT.md` 8.3) làm song song khi đụng tới.
- **Kiểm id:** mọi Task và câu đều có `id` ổn định (đã có `t1`, `i1`…). Kiểm các thao tác: thêm, nhân đôi, xóa, đổi thứ tự, đổi dạng Q (`setQ`), nhập MD, dán nhiều dòng → id không đổi với câu cũ, câu mới có id mới không trùng.
- **Hàm liệt kê chỗ trả lời** `slotsOf(task)` theo bảng 6.1 của Tài liệu 2 (thuần, không đụng DOM), kèm `keyOf(task)` chuyển đáp án WS Editor (`key`, `*`, `=chữ`, `lead.keys`, cặp nối) sang khối đáp án chuẩn. Dùng lại `needKey`, `hasKey`, `itemKeys` sẵn có.
- **Gắn `data-slot`** vào HTML do `renderTask` sinh ra cho mọi chỗ trả lời (không đổi hình: đường chuẩn phải vẫn 120/120).
- **Khởi tạo `ws-shared`** (thư mục `shared/` trong repo hoặc gói riêng): lược đồ `wsp/0`, kiểu TypeScript, hàm chuẩn hóa chữ, `grade()`, bộ mẫu đầu tiên (3–5 phiếu thật từ `tests/real/`).
- **Quyết định tổ chức mã:** một repo chung (monorepo) hay tách repo cho TeacherResource. Đề xuất: monorepo, ít nhất cho tới GĐ3.

**Nghiệm thu GĐ0:** đường chuẩn 120/120, giaodien 2497/2497, bộ test cũ đạt; `slotsOf` + `keyOf` chạy trên 24 phiếu chuẩn không lỗi, mọi `data-slot` trên trang khớp `slotsOf`; test đơn vị `grade()` trên bộ mẫu đạt.

## 4. GĐ1. Thử tương tác trong WS Editor

- **Trình xem** (trong `ws-shared`, React): nhận trang + slots, phủ lớp tương tác theo `data-slot`, các chế độ `preview` và `teach`.
- **Nút "Thử làm"** trong WS Editor: mở trình xem trên phiếu đang soạn; làm như học sinh; **Chấm thử** tô đúng / sai, hiện điểm; chỗ chấm tay ghi rõ.
- **Chế độ chiếu** (`teach`): toàn màn hình, lật trang, thu phóng; hiện đáp án theo cả phiếu / từng Task / từng câu.
- Các tương tác theo bảng 5.3: `text`, `text-long`, `choice-one`, `choice-many`, `tf`, `match`, `cell`. `draw` để GĐ5.

**Nghiệm thu GĐ1:** mỗi dạng Q1–Q8, Q10, Q11 (ô chữ) làm thử và chấm thử đúng trên phiếu mẫu; Q9, Q12, lưới tìm từ hiện "không chấm / chấm tay"; tắt Thử làm thì phiếu nguyên vẹn; người dùng thử trên máy tính và máy chiếu.

## 5. GĐ2. Xuất gói `.wsp`

- Bộ xuất: trang HTML đã làm sạch, CSS trang, phông, ảnh, `slots.json`, `key.json`, `source.json`, `manifest.json`.
- Kiểm tra khi xuất (Tài liệu 2 mục 9) với thông báo dễ hiểu cho giáo viên.
- **Ký và mã hóa.** Cần chốt H1 (Tài liệu 1 mục 8.6): đề xuất một **dịch vụ ký nhỏ** của công ty (người soạn đăng nhập, gửi hash, nhận chữ ký); bản WS Editor không có khóa riêng.
- **Mở lại gói để sửa:** WS Editor đọc `source.json` trong gói của mình.
- Công cụ dòng lệnh `wsp inspect <file>` (trong `ws-shared`): kiểm chữ ký, liệt kê nội dung, chạy kiểm tra. Dùng cho dev TeacherResource.

**Nghiệm thu GĐ2:** xuất 24 phiếu chuẩn → `wsp inspect` đạt hết; gói bị sửa một byte → bị từ chối; gói học sinh nhìn thấy (qua API ở GĐ3) không có chuỗi đáp án nào; mở lại gói ra đúng phiếu gốc.

## 6. GĐ3. TeacherResource lõi (bài về nhà)

- Tài khoản, vai trò (quản trị nội dung, giáo viên, học sinh), lớp và danh sách học sinh.
- **Import gói:** kiểm, lưu phiên bản, tách đáp án vào kho riêng, báo cáo import.
- Thư viện phiếu (theo mã phiếu, các phiên bản).
- **Lần giao:** chọn phiên bản, lớp, hạn, số lần làm, có cho xem đáp án sau khi nộp không.
- Học sinh: danh sách bài được giao → làm (`answer`, tự lưu nháp) → nộp → kết quả (`result`).
- Giáo viên: danh sách bài nộp, **chữa từng em** (`review`, chấm tay, nhận xét), thống kê cơ bản (điểm từng em, % đúng từng chỗ / từng Task).
- Chấm lại khi import phiên bản chỉ đổi đáp án.
- Bảo mật theo Tài liệu 1 mục 8.3–8.5 (phục vụ trang có kiểm quyền, dấu mờ, nhật ký).

**Nghiệm thu GĐ3:** một lớp giả lập 30 học sinh làm một phiếu thật từ đầu tới cuối; điểm máy chủ trùng điểm Chấm thử ở WS Editor cho cùng bài làm; quét mọi phản hồi API gửi học sinh trước khi nộp không có đáp án; học sinh lớp khác không mở được bài.

## 7. GĐ4. Buổi trực tiếp trên lớp

- Mở buổi → mã QR + mã ngắn; học sinh quét, đăng nhập, vào thẳng phiếu.
- Kênh cập nhật tức thời; màn giáo viên: ai đã vào, tiến độ, đã nộp; khóa nộp.
- `live-board`: phiếu chiếu kèm % đúng từng chỗ, phương án sai phổ biến, ẩn tên mặc định.
- Thống kê đầy đủ: phân bố điểm, chỗ sai nhiều nhất, so sánh các lần giao cùng đề.

**Nghiệm thu GĐ4:** buổi thử với ≥ 30 thiết bị (điện thoại, máy tính bảng) trên Wi‑Fi trường; mất mạng giữa chừng rồi vào lại không mất bài; người dùng chữa bài bằng `live-board` trên máy chiếu thật.

## 8. GĐ5. Mở rộng (chọn theo nhu cầu, tham khảo đặc tả)

Bút vẽ chú thích và lưu nét theo tài khoản (M7, M12) · công cụ trình chiếu (M8) · phóng một bài, ghim, ghi chú (M9) · bảng nhanh / bảng trắng (M10) · Quiz một câu mỗi lần, phản hồi vui (M11) · xáo phương án theo học sinh, bảng xếp hạng (M15) · `draw` cho Q9 / Q12 · dùng không mạng.

## 9. Phân việc theo nơi làm

| Việc | WS Editor | `ws-shared` | TeacherResource |
|---|---|---|---|
| id ổn định, `slotsOf`, `keyOf`, `data-slot` | ✔ | | |
| Lược đồ `wsp`, chuẩn hóa, `grade()`, bộ mẫu | | ✔ | dùng |
| Trình xem (mọi chế độ) | dùng (`preview`, `teach`) | ✔ | dùng (mọi chế độ) |
| Xuất, ký, mã hóa gói | ✔ | đọc / ghi / kiểm | đọc / kiểm / giải mã |
| Tài khoản, lớp, giao bài, lưu, thống kê, buổi trực tiếp | | | ✔ |

## 10. Rủi ro chính

| Rủi ro | Giảm thiểu |
|---|---|
| `data-slot` làm lệch dàn trang | Chỉ thêm thuộc tính, không thêm phần tử; đường chuẩn 120/120 là cổng bắt buộc |
| Chấm lệch giữa editor và máy chủ | Một hàm `grade()` duy nhất + bộ mẫu có kết quả mong đợi |
| AI viết TeacherResource hiểu sai chuẩn | Lược đồ tự kiểm + `wsp inspect` + bộ mẫu; dev người duyệt từng giai đoạn |
| Lộ đáp án | Tách khối từ lúc xuất; test quét phản hồi API |
| Khóa ký bị lộ | Không đặt khóa riêng trong WS Editor; dịch vụ ký riêng |
| Trang HTML hiển thị khác nhau giữa trình duyệt | Phông nhúng trong gói; thử trên Chrome, Edge, Safari (iPad), Chrome Android |
| Phạm vi phình | GĐ5 chỉ làm khi người dùng chọn từng mục |

## 11. Bước tiếp theo ngay
1. Người dùng duyệt 3 tài liệu, chốt H1–H3 (Tài liệu 1 mục 11).
2. Lập kế hoạch chi tiết GĐ0 (một trang), chờ "ok làm".
