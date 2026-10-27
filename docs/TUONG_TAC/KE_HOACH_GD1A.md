# Kế hoạch GĐ1a: trình chiếu phiếu

> 27/10/2026 · Theo `DE_XUAT_1A_TRINH_CHIEU.md` (người dùng đã chốt 8 công cụ; "hiện đáp án" thuộc 1a, 1b chỉ còn giáo viên gõ / chọn thử). **Chưa code**, chờ người dùng nói "ok làm".
> Kết quả: trong WS Editor có nút **Chiếu**; mở ra là màn hình trình chiếu đủ 8 công cụ. Phiếu soạn và bản in không đổi.

## 0. Hiện trạng đã kiểm (đọc mã 27/10)

| Điểm | Hiện trạng | Hệ quả |
|---|---|---|
| Trang đã dàn | `store.pageView.pages[i].html` (HTML từng trang A4), `Pages.tsx` vẽ | Trình chiếu dùng lại đúng HTML này, không dàn lại |
| Task trên trang | `<section class="task" data-task="t3">`; Task bị cắt thì các mảnh ở nhiều trang cùng `data-task` | Kiểu xem Từng Task = ghép các mảnh cùng `data-task` |
| Chỗ trả lời | `data-ans="<mã>"` (GĐ0), đáp án từ `sheetSlots(ws).key` | Hiện đáp án đúng chỗ, không đoán vị trí |
| Lựa chọn A/B/C | `<span class="opt">` bên trong chỗ `data-ans`; câu ví dụ đã có kiểu tô `pk` cho phương án đúng | Đáp án lựa chọn tô giống câu ví dụ đã in, giáo viên và học sinh quen |
| Ô tick, T/F, nối | `a5`, nhãn T/F, chấm / ô nối, đều có `data-ans` | Mỗi dạng một cách hiện (mục B4) |
| Ảnh | `.pic` | Bấm để xem lớn |

## 1. Cách làm chung
- Mã ở `app/src/viewer/` (React), **chỉ nhận đầu vào**: HTML các trang + `slots` + `key`. Không đọc thẳng trạng thái WS Editor, để sau này chuyển nguyên sang TeacherResource (GĐ2–3).
- Mọi thứ của trình chiếu (đáp án, nét vẽ, tấm che) là **lớp phủ** trên trang, không sửa HTML trang. Riêng B4 có thể thêm thuộc tính đánh dấu (như GĐ0), không thêm phần tử, đường chuẩn phải vẫn 120/120.
- Mỗi bước có test Playwright riêng `tests/gd1a/` (chụp ảnh xem lại, 0 lỗi console) và chạy lại đường chuẩn + bộ test cũ trước khi sang bước sau.

## 2. Các bước

### B1. Khung chiếu
- Nút **Chiếu** trên thanh trên (cạnh Đường dóng). Mở toàn màn hình, bắt đầu ở trang chứa Task đang chọn.
- Kiểu xem **Cả trang**: một trang A4 vừa chiều cao màn hình, nền tối quanh trang.
- Lật: ← → / PageUp PageDown (clicker) / nút / vuốt trên cảm ứng. Số trang góc dưới.
- Thanh công cụ dưới đáy, **tự ẩn** sau 3 giây không rê chuột; nút to cho cảm ứng. Esc: thoát (khi không có công cụ nào đang bật).
- Test: mở, lật hết các trang của phiếu mẫu, Esc, phiếu soạn không đổi.

### B2. Kiểu xem Từng Task
- Phím T / nút đổi Cả trang ↔ Từng Task, giữ đúng chỗ đang xem.
- Một Task phóng vừa chiều ngang màn hình; Task cắt qua trang được ghép liền (không lặp tiêu đề, đúng như phiếu).
- Task dài hơn màn hình: clicker **cuộn xuống trước**, hết Task mới sang Task sau (một phím làm được hết).
- Thanh đi tới: danh sách Task (số + tiêu đề) để nhảy nhanh.
- Test: phiếu có Task bị cắt trang, Task rất dài, Task rất ngắn.

### B3. Phóng
- +/−, nút Vừa màn hình; lăn chuột + Ctrl; chụm hai ngón trên cảm ứng.
- **Phóng vùng**: bấm nút rồi kéo khung, phóng vùng đó vừa màn hình; Esc / nút Vừa để về.
- Bấm ảnh (khi đang ở con trỏ): mở ảnh lớn trên nền tối; Esc / bấm nền để đóng.

### B4. Hiện đáp án
- Bốn cách: **cả phiếu** (A), **cả Task** (nút nhỏ ở đầu Task), **từng chỗ** (bấm vào chỗ trả lời), **lần lượt** (Space: hiện chỗ kế tiếp trong phần đang xem; Shift+Space ẩn lại; clicker xem dòng cuối mục này).
- Cách hiện theo dạng: chỗ viết → chữ đáp án màu xanh nằm trên gạch / ô; nhiều cách viết thì hiện cách đầu; lựa chọn / T/F / ô tick / ảnh → **tô giống phương án đúng của câu ví dụ** (`pk`); nối → vẽ đường nối (hoặc chữ cái ở ô nối); ô chữ → hiện chữ từng ô; chỗ chấm tay có bài mẫu → nút "Xem bài mẫu"; chỗ chưa có đáp án → không hiện gì, đếm ở thanh công cụ ("12 chỗ chưa có đáp án").
- Có thể phải thêm `data-opt` cho từng phương án (chỉ thuộc tính). Chạy lại đường chuẩn.
- Clicker chỉ có hai phím: đặt một công tắc "Clicker hiện đáp án" (bật thì phím sau = hiện đáp án kế tiếp, hết đáp án trong phần đang xem mới lật). Mặc định tắt.
- Test: phiếu mẫu đủ dạng `tests/gd0/mau-du-dang.md`, chụp ảnh từng dạng khi hiện đáp án, so với đáp án trong `DUYET_GD0.md`.

### B5. Bút
- Con trỏ (mặc định) · Bút · Bút tô vàng · Đường thẳng · Tẩy (xóa cả nét) · Hoàn tác / Làm lại · Xóa hết (hoàn tác được) · Ẩn nét.
- 4 màu (đỏ, xanh dương, xanh lá, đen), 3 độ dày. Giữ Ctrl kéo = tô vàng nhanh, giữ Shift = đường thẳng, không cần bật bút.
- Nét **gắn với Task** (tọa độ trong Task) nên đổi Cả trang / Từng Task, phóng to vẫn đúng chỗ; nét ngoài Task gắn với trang.
- Lưu trên máy theo phiếu (mã phiếu + dấu nội dung): mở lại còn nét; sửa phiếu làm đổi nội dung thì nét cũ bỏ, có báo.
- Bút cảm ứng / ngón tay vẽ được, không làm cuộn trang.

### B6. Che / hé
- Nút Che (phím H): phủ sọc xám lên **từng câu** (và bài đọc) của phần đang xem, chữ "Bấm để hé". Bấm từng tấm để hé / che lại; nút Hé hết.
- Che theo câu dựa vào phần tử câu sẵn có trên trang; Task không có câu (bảng, ô chữ, viết tự do) thì che cả Task.

### B7. Đồng hồ và Bảng trắng
- Đồng hồ (phím G): 1 / 3 / 5 / 10 phút, ±1 phút, Bắt đầu / Tạm dừng / Đặt lại; hiện **lớn giữa màn hình** hoặc **thu nhỏ góc**; hết giờ nhấp nháy đỏ + chuông hai tiếng (tắt tiếng được).
- Bảng trắng (B): trang trắng phủ màn hình, nền trắng / kẻ dòng / kẻ ô, dùng bút của B5; Esc về phiếu; nội dung còn trong buổi, không lưu.

### B8. Hoàn tất
- Chạy đủ: đường chuẩn 120/120, giaodien 2497, 49 test cũ, test `tests/gd1a/`, 0 lỗi console.
- Thử tay trên khổ màn hình 1920×1080 và 1366×768 (máy chiếu thường gặp), cảm ứng giả lập.
- Spec mục mới, báo cáo phiên, badge v111, commit và push.
- Danh sách cho người dùng thử tay `docs/TUONG_TAC/KIEM_TRA_GD1A.md` (mở bằng máy chiếu / TV thật nếu được).

## 3. Không làm ở 1a
Giáo viên gõ / chọn thử để máy báo đúng sai (1b); audio; đèn rọi, rèm, tối màn; chọn tên; ghi chú, ghim; Quiz; chế độ Cuộn, 2 trang.

## 4. Rủi ro
| Rủi ro | Cách giữ |
|---|---|
| Ghép mảnh Task cắt trang bị lệch | Dùng chính HTML từng mảnh, xếp liền theo chiều dọc; test phiếu có Task cắt trang |
| Hiện đáp án đè lên chữ / lệch chỗ ở dạng lạ | Lấy vị trí từ `data-ans` thật trên trang; chụp ảnh từng dạng; dạng không chắc thì hiện đáp án ở lề cạnh câu thay vì đè |
| Nét vẽ lệch khi đổi kiểu xem | Tọa độ theo Task tính bằng mm, không theo pixel màn hình |
| Trình chiếu làm chậm / hỏng phần soạn | Trình chiếu là lớp riêng, đóng là gỡ hết; test phiếu soạn không đổi sau khi chiếu |

## 5. Thứ tự và điểm dừng
B1 → B8, mỗi bước tự kiểm thử rồi mới sang bước sau. Sau **B4** (khung + phóng + đáp án) gửi người dùng bản build để thử sớm, vì đây là phần dùng nhiều nhất; B5–B7 làm tiếp trong lúc chờ góp ý.
