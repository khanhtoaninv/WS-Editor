# Báo cáo phiên 12 — 27/10/2026: phiếu tương tác, GĐ0

## 0. BÀN GIAO (đọc trước)

**Hướng mới:** phiếu tương tác + hệ thống TeacherResource. Mọi quyết định đã thống nhất với người dùng ở `docs/TUONG_TAC/THAO_LUAN.md`; ba tài liệu nền `1_TONG_QUAN_KIEN_TRUC.md`, `2_CHUAN_GOI_PHIEU.md`, `3_LO_TRINH.md` (GĐ0…GĐ5).

Trạng thái cuối phiên:
- **GĐ0 xong (v110, spec mục 41)**, theo `docs/TUONG_TAC/KE_HOACH_GD0.md` B1–B7. Không đổi hình phiếu, không đổi thao tác.
- **Chờ người dùng:** duyệt `docs/TUONG_TAC/DUYET_GD0.md` (máy đọc đáp án từng chỗ thế nào), và xác nhận hai quy ước: (1) nhiều đáp án đúng cho một chỗ viết ghi cách nhau ` / `; (2) câu chưa có đáp án thì chấm tay.
- Việc tiếp theo: GĐ1 (`3_LO_TRINH.md` mục 4: trình xem chế độ preview/teach trong WS Editor), sau khi người dùng duyệt.
- Hết đóng băng tính năng (người dùng chọn b). Phần chuyển React còn lại làm song song (`docs/KE_HOACH_REACT.md` mục 8).

## 1. Đã làm
- **B1** `app/src/core/answers.js`: các hàm đáp án chuyển từ legacy sang lõi (nguyên văn).
- **B2** `shared/`: `normalize`, `grade`, `validate`, kiểu dữ liệu chung. TypeScript chỉ cú pháp xóa được, chạy thẳng bằng Node 22 (`node --test test/*.test.ts`), không thêm thư viện (`test/node-shim.d.ts` thay `@types/node`).
- **B3** `app/src/core/slots.js`: `sheetSlots(ws)` liệt kê chỗ trả lời + đáp án + cảnh báo.
- **B4** `core/layout.js`: gắn `data-ans` lên trang. Kế hoạch ghi `data-slot` nhưng tên này đã dùng cho ô ảnh `.pic`, nên đổi. `tests/test23.py` sửa cho chấp nhận thuộc tính mới (test so chuỗi HTML cứng).
- **B5** phiếu mẫu đủ 12 dạng có đáp án `tests/gd0/mau-du-dang.md`; `shared/fixtures/` 6 phiếu (mau-du-dang, mau-tron, nghe-bang, v81-cu-phap, ws-demo-day-du, phieu7-ai-v99) × 3 bài làm mẫu (đúng hết / trộn / bỏ trống) kèm kết quả mong đợi dựng theo ý định.
- **B6** `docs/TUONG_TAC/DUYET_GD0.md`.
- **Sửa lỗi bộ đọc MD** (lộ ra khi viết phiếu mẫu): đáp án Task hội thoại bị gán cả vào lượt không có chỗ trống → lệch. Nay chỉ gán lượt có `___` / `{a|b}`.
- Bài tìm lỗi sai (Q4 nhãn A-D): phương án là đoạn gạch chân (`a. go`), không chỉ chữ cái.

## 2. Kiểm thử
- Đường chuẩn 120/120, giaodien 2497/2497, 49 test + audit (chạy trên bản B4 và trên bản cuối, xem mục 4).
- `sheetSlots` trên 25 phiếu: 739 chỗ trả lời, kiểm khuôn sạch, `data-ans` khớp 1–1 với trang.
- `shared`: 11 test đạt, typecheck `shared` và `app` đạt.
- **Chưa kiểm:** chưa có trình xem nên chưa thử phủ ô nhập lên `data-ans` thật; tọa độ `boxMm` chưa sinh (để GĐ2 khi đóng gói).

## 3. Lưu ý cho phiên sau
- Phần lớn phiếu mẫu cũ không có đáp án (653/739 chỗ chấm tay) — không phải lỗi.
- Mã câu cấp lại sau khi xóa (`newId` lấy số trống nhỏ nhất): không sao vì mỗi lần xuất là một phiên bản độc lập.
- Ô chữ trong MD viết liền (`CAT`, `##O`), không cách chữ.
- Công cụ: `python3 tests/gd0/slots_phieu.py <app.html> <ra>`, `node tests/gd0/kiem_slots.mjs <ra> --dom`, `node tests/gd0/tao_mau.mjs <ra> shared/fixtures <tệp>...`, `node tests/gd0/bang_duyet.mjs <ra> docs/TUONG_TAC/DUYET_GD0.md <tệp>...`.

## 4. Kết quả chạy trên bản cuối
Bản `ws-editor.html` v110: đường chuẩn 120/120, giaodien 2497/2497, 49/49 test đạt (0 lỗi console), audit PROBLEMS 0; `sheetSlots` 739 chỗ, khớp 1–1 với trang; `shared` 11/11 test.

## 5. GĐ1a trình chiếu (v111, cùng phiên)
- Người dùng chia GĐ1 thành **1a trình chiếu**, **1b giáo viên tự tương tác** (mở phiếu, gõ / chọn thử, máy báo đúng sai để giảng), **1c làm bài trên lớp** (tạo phiên, học sinh vào làm; cần TeacherResource nên đi sau GĐ2). Đã chốt 8 công cụ 1a (`docs/TUONG_TAC/DE_XUAT_1A_TRINH_CHIEU.md`), "hiện đáp án" thuộc 1a.
- Làm xong B1–B8 theo `KE_HOACH_GD1A.md`: spec mục 42. Mã ở `app/src/viewer/`.
- Kiểm thử: `tests/gd1a/test_chieu.py` 73/73, `tests/gd1a/quet_phieu.py` 25 phiếu; bộ test cũ trên bản cuối: đường chuẩn 120/120, giaodien 2497/2497, 49/49 test + audit PROBLEMS 0, `sheetSlots` 739 chỗ khớp 1–1.
- Chưa kiểm: máy chiếu / TV / bảng tương tác thật, bút trình chiếu thật (chỉ giả lập phím PageDown / PageUp), chạm thật (chỉ thử chuột). Chuông hết giờ chưa nghe thử (headless). Người dùng cần thử tay: `docs/TUONG_TAC/KIEM_TRA_GD1A.md`.
- Việc tiếp theo: người dùng thử tay 1a, rồi kế hoạch 1b.

## 6. GĐ1b giáo viên tự làm thử (v112, cùng phiên)
- Người dùng chốt: bỏ nút Làm thử (phiếu trong trình chiếu lúc nào cũng làm được), con trỏ = làm bài, cầm bút = vẽ; sai mặc định không tự hiện đáp án (có công tắc); thứ tự lớp `KE_HOACH_GD1B.md` mục 8.
- Làm xong C1–C6: spec mục 43. Mã `app/src/viewer/work.ts` + phần GĐ1b trong `Presenter.tsx`. `answers.ts` tách `optEls`, `rightRow`, `optOfRow`, `rowLabel` để lớp làm bài dùng chung; chấm phải của bài nối giờ chỉ lấy chấm không có `data-ans` (trước có thể lấy nhầm chấm trái ở hàng không có vế phải).
- Bấm chỗ trả lời ở con trỏ giờ là làm bài (thay "bấm để hiện từng chỗ" của 1a); `tests/gd1a/test_chieu.py` sửa mục đó, còn 72 mục.
- Ô nối viết chữ: layout không in chữ cái vế phải, nên quy ước a, b, c theo thứ tự hàng khi người soạn không tự ghi "A. …" (`tests/gd1b/mau-noi-o.md`).
- Kiểm thử: xem mục 7.
- Chưa kiểm: màn cảm ứng thật (bàn phím ảo), máy chiếu thật. Người dùng thử tay: `docs/TUONG_TAC/KIEM_TRA_GD1B.md`.
- Việc tiếp theo: người dùng thử tay 1a + 1b; GĐ2 đóng gói (rồi 1c làm bài trên lớp).

## 7. Kết quả chạy trên bản cuối (v112) và chốt về chuyển React
- Bản `ws-editor.html` v112: đường chuẩn 120/120, giaodien 2497/2497, 49/49 test cũ + audit PROBLEMS 0, `tests/gd1a/test_chieu.py` 72/72, `tests/gd1a/quet_phieu.py` ALL OK, `tests/gd1b/test_lambai.py` 82/82, `tests/gd1b/quet_lambai.py` ALL OK (89/89 chỗ máy chấm làm đúng, 544 chỗ chưa có đáp án làm thử được), `shared` 11/11.
- Đã đẩy lên `main` (commit 6aa862b).
- **Chốt với người dùng (28/10):** chưa chuyển nốt JS thuần (`legacy/app.js`, `core/*.js`) sang React / TypeScript; làm một phiên riêng sau GĐ2, trước 1c. Chi tiết, thứ tự và lý do: `docs/KE_HOACH_REACT.md` mục 8.5. Claude nhắc người dùng khi GĐ2 xong.

