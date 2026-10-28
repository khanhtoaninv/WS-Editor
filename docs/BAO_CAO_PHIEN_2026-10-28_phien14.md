# Báo cáo phiên 14 (28/10/2026): sửa sau kiểm thử, đợt 1 → 5, bàn giao dev

## 0. BÀN GIAO (đọc đầu tiên)
- **App v117.** Đã làm hết `docs/KE_HOACH_SUA_SAU_KIEM_THU.md` đợt 1 → 5 trong một mạch (người dùng cho phép), theo "Quyết định mặc định" ở cuối file đó. Spec mục 44 (v113) … 48 (v117).
- **Commit:** cả 5 đợt nằm trong **một** commit lên `main` (mã đợt 1–4 được viết liền rồi mới kiểm, nên không tách được từng đợt một cách trung thực). Mỗi đợt có test riêng `tests/sau_kiem_thu/test_dot1.py` … `test_dot5.py` và mục spec riêng.
- **Gói bàn giao dev:** `docs/BAN_GIAO_DEV/` (4 file: tổng quan + phạm vi; quy trình phát hành và đồng bộ; nợ kỹ thuật + chuẩn bị deploy; bảng đối chiếu để trống cột dev).
- **Đường chuẩn mới:** `tests/chuan/v117/` (mục 3). `chuan.py` giờ mặc định so với v117.
- **Việc tiếp:** người dùng thử tay `docs/TUONG_TAC/KIEM_TRA_GD1A.md` mục 27–35, `KIEM_TRA_GD1B.md` mục 20–27 (phiếu `tests/gd0/phieu-kiem-thu-tay.md`); rồi GĐ2 đóng gói.

## 1. Đã làm (tóm tắt, chi tiết ở spec)
| Đợt | Bản | Nội dung |
|---|---|---|
| 1 | v113 | Nối theo mã (vế phải trùng chữ), dấu câu so cả dấu, T/F theo chữ cái đầu, gõ dài xuống dòng, nhãn "✎ Chấm tay" ở góc Task |
| 2 | v114 | Chấm tay ✓ / ✗ khi chiếu (Đúng x/y cộng theo), A / nút Đáp án theo phần đang xem + Shift+A cả phiếu, đáp án hiện vì làm sai tự ẩn khi sửa đúng (nguyên nhân "lúc hiện lúc không") |
| 3 | v115 | Ẩn nhãn (1)(2) khi gõ, ô tick tô màu dấu, khoảng 2 mm bài nối, T/F theo tỉ lệ (`tfp`), Xóa nét trang này, Ctrl+lăn phóng theo chuột, Shift+kéo đường đỏ, Từng Task Mặc định ↔ Vừa, ↓/↑ giữa các ô, ảnh đồng đều + Kích thước ảnh + Ảnh vừa ô |
| 4 | v116 | Bảng viết tắt chuẩn + công tắc "Phân biệt viết tắt", chip gợi ý cách viết khác (cách A), ô chữ tìm từ (máy tìm, hiện khung, kéo chọn), prompt quy tắc 26–27 |
| 5 | v117 | 1 / 2 trang, Trang / Cuộn, nút 🔍 mở Task, đèn pin, bảng trắng chế độ chữ, hộp ghi chú (gõ / nói) |

## 2. Quyết định đã tự chọn (theo "Quyết định mặc định", và chỗ kế hoạch không nói)
- Ghi chú (E11): ngôn ngữ nhận giọng nói = ngôn ngữ trình duyệt; hộp trống tự bỏ khi rời; ghi chú hiện ở cả Cả trang và Từng Task (gắn với Task như nét vẽ); ghi chú ở lề trang chỉ hiện ở Cả trang.
- Cuộn (E3) dùng được cùng 2 trang (hai trang một hàng). Phím A / nút Đáp án ở chế độ Cuộn = trang đang chiếm phần trên màn hình.
- Nút 🔍 chỉ có ở Cả trang (ở Từng Task đã là Task đó).
- Bảng trắng chữ: dòng kẻ cách 57 px, chữ ngồi trên dòng kẻ gần chỗ bấm nhất; nền kẻ ô vào góc ô 36 px; nền trắng không dóng.
- Đèn pin: bán kính mặc định 150 px, 60–600 px.
- Ô chữ tìm từ: từ chỉ có một phần trong lưới (BIR thiếu D) thì không thành chỗ trả lời; lưới bị cắt sang mảnh sau vẫn vẽ khung.

## 3. Đổi đường chuẩn 120
- So v117 với chuẩn cũ `tests/chuan/v108/` trước: **80/120 khớp**. 40 lần lệch đúng 8 phiếu × 5 biến thể, phiếu nào cũng có bài nối, T/F hoặc ảnh theo câu (3.3, 3.4, 3.10 người dùng đã duyệt): demo, `samples/ws-demo-day-du.json`, `samples/ws-sample.json` (ảnh theo câu + nối), `tests/md/mau-tron.md` (Task ảnh đầu phiếu đẩy các Task sau xuống), `phieu14.md`, `phieu7.md`, `phieu7-bai-doc-co-cho-trong.md` (T/F), `phieu9.md` (nối). 16 phiếu còn lại khớp hết.
- Tạo chuẩn mới `tests/chuan/v117/` bằng bản v117; so lại 120/120. `chuan.py` mặc định so với v117; giữ `v108/` để tra.
- `giaodien.py` (so cột trái / phải với v106): thêm tùy chọn `--bo-moi` bỏ qua các ô mới có chủ ý (Phân biệt viết tắt, Kích thước ảnh / Vừa ô, tỉ lệ T/F, chip gợi ý). Không có tùy chọn: 1392/2497 (lệch toàn do các ô mới); có tùy chọn: 2489/2497, 8 trạng thái còn lại chỉ là số trang / chiều cao Task trong dòng tóm tắt (ws-demo-day-du 17 → 18 trang, phieu9 Task 4 366 → 373 mm), do 3.3 / 3.10.
- `test2.py` so bố cục với v106: giờ so trên bản sao bỏ 2 Task có ảnh theo câu (khớp hết); số trang cuối 11 → 12 (ảnh đồng đều).
- `shared/fixtures/ws-demo-day-du` sinh lại: thêm 10 chỗ tìm từ (`find`). 5 bộ mẫu khác không đổi. `tao_mau.mjs` biết dạng `find`.

## 4. Đã kiểm thử (trên bản cuối v117)
| Bộ | Kết quả |
|---|---|
| Đường chuẩn `chuan.py so` (chuẩn v117) | 120/120 |
| `giaodien.py --bo-moi` | 2489/2497 (8 lệch giải thích ở mục 3) |
| 49 test cũ + audit (`run_all.sh`) | 49/49, audit 0 lỗi (test2, test44, test46 sửa theo hành vi mới) |
| `gd1a/test_chieu.py` | 73/73 (B4 dùng Shift+A) |
| `gd1b/test_lambai.py` | 82/82 |
| `gd1a/quet_phieu.py` | 25 phiếu đạt (dùng Shift+A) |
| `gd1b/quet_lambai.py` | máy chấm 161/161, 561 chỗ chưa có đáp án làm thử được (tìm hàng nối theo mã) |
| `shared` npm test | 15/15 |
| `kiem_slots.mjs --dom` | 879 chỗ trả lời, khớp trang |
| `sau_kiem_thu/test_dot1…5` | 21/21, 24/24, 24/24, 16/16, 39/39 |
Mọi bộ 0 lỗi console. Ảnh chụp các test đợt mới: chạy lại với thư mục ảnh (tham số thứ hai).

## 5. Lỗi tìm thêm khi kiểm, đã sửa
- Nút ✓ / ✗ chấm tay (và mọi dấu bấm được) có lúc bấm hụt: trang vẽ lại giữa lúc nhấn và nhả chuột (ví dụ thanh công cụ hiện lại) làm mất phần tử. Giờ dấu giống hệt thì giữ phần tử cũ (`work.ts`, `place`).
- Lăn chuột không cuộn trang đã phóng khi đầu chuột nằm trên chữ (Chromium, chưa rõ nguyên nhân gốc); trình chiếu tự cuộn.
- Ô chữ tìm từ bị cắt sang mảnh sau: từ ở phần sau không hiện khung đáp án.
- Thanh công cụ trình chiếu ở 1920 px tràn sau khi thêm nút mới: dưới 2100 px ẩn nhãn "n chỗ chưa có đáp án" (đã có nhãn ✎ Chấm tay ở từng Task).
- MD `Phân biệt viết tắt:`, `Kích thước ảnh:`, `Ảnh vừa ô:` bị đọc thành câu hỏi (thiếu trong danh sách trường).

## 6. Chưa kiểm / cần người dùng thử
- Màn cảm ứng thật (chạm kéo đèn pin, chụm hai ngón, vẽ tay).
- Nhận giọng nói thật (máy kiểm không có micro).
- Safari / Firefox.
- Cảm nhận: cỡ vòng đèn pin, cỡ hộp ghi chú, độ dày đường Shift + kéo.
