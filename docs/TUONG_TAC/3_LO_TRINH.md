# Tài liệu 3. Lộ trình: phiếu tương tác và TeacherResource

> Bản nháp **v0.1** (GĐ3 = phiên trên lớp, học sinh vào bằng mã; bài về nhà dời sang GĐ5) · 27/10/2026 · Đọc kèm `1_TONG_QUAN_KIEN_TRUC.md`, `2_CHUAN_GOI_PHIEU.md`.

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
| 3 | TeacherResource lõi: phiên trên lớp | TeacherResource | Tài khoản giáo viên, lớp + danh sách học sinh có key, import, mở phiên (mã + QR), học sinh vào bằng key, làm, nộp, chấm, điểm tổng thời gian thực, chốt phiên, kết quả từng câu | 2 |
| 4 | Chữa bài và thống kê | TeacherResource | `review` từng em, chấm tay, `live-board`, thống kê lớp / câu / Task, lịch sử từng em qua các phiên, nhật ký | 3 |
| 5 | Mở rộng | cả hai | Bài về nhà, bút vẽ, công cụ trình chiếu, xáo phương án, … (chọn theo nhu cầu) | 1 (bút), 3 |

### 2b. Hai mốc (chốt 28/10/2026)
- **Mốc 1: WS Editor hoàn chỉnh** = GĐ0 + GĐ1a (trình chiếu) + GĐ1b (giáo viên làm thử) + GĐ2 (xuất gói `.wsp`, v118). WS Editor build và hoàn thành độc lập, không chờ TeacherResource.
- **Mốc 2: Khu thử nghiệm Lớp học** (`server/`, `docs/KE_HOACH_LOP_HOC_THU.md`, v119–v122): máy chủ chạy trên máy giáo viên, nhận gói `wsp/0`; lớp, phiên, học sinh làm và nộp, chấm chữa, báo cáo, insight. Không tính vào WS Editor; dùng để thử sản phẩm và rút ra **yêu cầu cho TeacherResource** (GĐ3–GĐ4). Tên "1c" bỏ.

GĐ1 và GĐ3 có thể chạy **song song** sau khi GĐ2 chốt định dạng (TeacherResource dùng gói mẫu trong `ws-shared/fixtures`).

## 3. GĐ0. Chuẩn bị trong WS Editor

- **Hết đóng băng tính năng** (đã chốt 27/10/2026). Phần chuyển React còn lại (`KE_HOACH_REACT.md` 8.3) làm song song khi đụng tới.
- **Kiểm id:** mọi Task và câu đều có `id` ổn định (đã có `t1`, `i1`…). Kiểm các thao tác: thêm, nhân đôi, xóa, đổi thứ tự, đổi dạng Q (`setQ`), nhập MD, dán nhiều dòng → id không đổi với câu cũ, câu mới có id mới không trùng.
- **Hàm liệt kê chỗ trả lời** `slotsOf(task)` theo bảng 6.1 của Tài liệu 2 (thuần, không đụng DOM), kèm `keyOf(task)` chuyển đáp án WS Editor (`key`, `*`, `=chữ`, `lead.keys`, cặp nối) sang khối đáp án chuẩn. Dùng lại `needKey`, `hasKey`, `itemKeys` sẵn có.
- **Gắn `data-ans`** vào HTML do `renderTask` sinh ra cho mọi chỗ trả lời (không đổi hình: đường chuẩn phải vẫn 120/120).
- **Khởi tạo `ws-shared`** (thư mục `shared/` trong repo hoặc gói riêng): lược đồ `wsp/0`, kiểu TypeScript, hàm chuẩn hóa chữ, `grade()`, bộ mẫu đầu tiên (3–5 phiếu thật từ `tests/real/`).
- **Quyết định tổ chức mã:** một repo chung (monorepo) hay tách repo cho TeacherResource. Đề xuất: monorepo, ít nhất cho tới GĐ3.

**Nghiệm thu GĐ0:** đường chuẩn 120/120, giaodien 2497/2497, bộ test cũ đạt; `slotsOf` + `keyOf` chạy trên 24 phiếu chuẩn không lỗi, mọi `data-ans` trên trang khớp `slotsOf`; test đơn vị `grade()` trên bộ mẫu đạt.

## 4. GĐ1. Thử tương tác trong WS Editor

- **Trình xem** (trong `ws-shared`, React): nhận trang + slots, phủ lớp tương tác theo `data-ans`, các chế độ `preview` và `teach`.
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

## 6. GĐ3. TeacherResource lõi: phiên trên lớp

- **Tài khoản giáo viên**, vai trò quản trị nội dung.
- **Lớp và danh sách học sinh** (ảnh đại diện, thông tin, **key cá nhân**; in / phát key; đổi key khi lộ). Học sinh không có tài khoản.
- **Import gói:** kiểm, lưu phiên bản, tách đáp án vào kho riêng, báo cáo import. Thư viện phiếu theo mã phiếu và phiên bản.
- **Mở phiên** cho một lớp: chọn phiên bản, thời hạn, số lần làm (lấy lần cao nhất / lần cuối), sau khi chốt có hiện đáp án đúng không. Tạo mã phiên + QR + đường dẫn chung. **Mỗi lớp một phiên hoạt động**: mở mới thì hỏi xác nhận, đóng phiên cũ, nộp tự động bài dở.
- **Học sinh vào** bằng QR hoặc đường dẫn chung + mã phiên, rồi nhập key → xác nhận tên / ảnh → làm (`answer`), tự lưu nháp, chịu được mất mạng ngắn, chuyển máy.
- **Nộp** → chấm ngay → học sinh thấy điểm tổng của mình + bảng điểm lớp (thời gian thực), **chưa** thấy từng câu.
- **Màn giáo viên thời gian thực:** danh sách lớp, trạng thái, tiến độ, điểm, trung bình.
- **Chốt phiên** (hoặc hết hạn tự chốt) → học sinh xem kết quả từng câu (`result`). Mở lại phiên được.
- Chấm lại khi import phiên bản chỉ đổi đáp án.
- Bảo mật theo Tài liệu 1 mục 8.3–8.5 (vé truy cập theo phiên, dấu mờ, nhật ký theo tài khoản giáo viên).

**Nghiệm thu GĐ3:** phiên thử với ≥ 30 thiết bị thật (điện thoại, máy tính bảng) trên Wi‑Fi trường; điểm máy chủ trùng Chấm thử ở WS Editor cho cùng bài làm; quét mọi phản hồi gửi học sinh trước khi chốt phiên không có đáp án; key lớp khác không vào được; mở phiên mới đóng đúng phiên cũ của lớp đó (không đụng lớp khác); mất mạng rồi vào lại không mất bài.

## 7. GĐ4. Chữa bài và thống kê

- `review`: bài từng em (theo thứ tự gốc), đúng / sai, đáp án, chấm tay bài viết mở, sửa điểm, nhận xét, em trước / em sau.
- `live-board`: phiếu chiếu trước lớp kèm % đúng từng chỗ, phương án sai phổ biến, ẩn tên mặc định.
- Thống kê: điểm từng em, phân bố, trung bình, % đúng theo câu / Task, chỗ sai nhiều nhất; so sánh các phiên cùng đề; **lịch sử từng em qua các phiên** (dựa vào mã học sinh cố định).
- Nhật ký phiên tra cứu lại theo giáo viên, lớp, ngày.

**Nghiệm thu GĐ4:** người dùng chữa bài bằng `live-board` trên máy chiếu thật; số liệu thống kê khớp tính tay trên một phiên mẫu; tra lại được phiên cũ.

## 8. GĐ5. Mở rộng (chọn theo nhu cầu, tham khảo đặc tả)

**Bài về nhà** (Tài liệu 1 mục 6.3) · bút vẽ chú thích và lưu nét (M7, M12) · công cụ trình chiếu (M8) · phóng một bài, ghim, ghi chú (M9) · bảng nhanh / bảng trắng (M10) · Quiz một câu mỗi lần, phản hồi vui (M11) · xáo phương án theo học sinh, bảng xếp hạng (M15) · `draw` cho Q9 / Q12 · dùng không mạng.

## 9. Phân việc theo nơi làm

| Việc | WS Editor | `ws-shared` | TeacherResource |
|---|---|---|---|
| id ổn định, `slotsOf`, `keyOf`, `data-ans` | ✔ | | |
| Lược đồ `wsp`, chuẩn hóa, `grade()`, bộ mẫu | | ✔ | dùng |
| Trình xem (mọi chế độ) | dùng (`preview`, `teach`) | ✔ | dùng (mọi chế độ) |
| Xuất, ký, mã hóa gói | ✔ | đọc / ghi / kiểm | đọc / kiểm / giải mã |
| Tài khoản giáo viên, lớp + học sinh, phiên, lưu, thống kê, nhật ký | | | ✔ |

## 10. Rủi ro chính

| Rủi ro | Giảm thiểu |
|---|---|
| `data-ans` làm lệch dàn trang | Chỉ thêm thuộc tính, không thêm phần tử; đường chuẩn 120/120 là cổng bắt buộc |
| Chấm lệch giữa editor và máy chủ | Một hàm `grade()` duy nhất + bộ mẫu có kết quả mong đợi |
| AI viết TeacherResource hiểu sai chuẩn | Lược đồ tự kiểm + `wsp inspect` + bộ mẫu; dev người duyệt từng giai đoạn |
| Lộ đáp án | Tách khối từ lúc xuất; test quét phản hồi API |
| Khóa ký bị lộ | Không đặt khóa riêng trong WS Editor; dịch vụ ký riêng |
| Trang HTML hiển thị khác nhau giữa trình duyệt | Phông nhúng trong gói; thử trên Chrome, Edge, Safari (iPad), Chrome Android |
| Phạm vi phình | GĐ5 chỉ làm khi người dùng chọn từng mục |

## 11. Bước tiếp theo ngay
1. ~~Chốt G3–G5, H1–H3~~ (đã chốt 27/10). Người dùng duyệt bản v0.1.
2. Lập kế hoạch chi tiết GĐ0 (một trang), chờ "ok làm".
