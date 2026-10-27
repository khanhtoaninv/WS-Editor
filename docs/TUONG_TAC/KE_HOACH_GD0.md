# Kế hoạch GĐ0: chuẩn bị trong WS Editor

> 27/10/2026 · Thuộc `3_LO_TRINH.md` mục 3. **Chưa code**, chờ người dùng nói "ok làm".
> Kết quả: không đổi gì người dùng nhìn thấy; có mã chỗ trả lời, bộ liệt kê đáp án, bộ chấm dùng chung, bộ phiếu mẫu.

## 0. Hiện trạng đã kiểm (đọc mã 27/10)

| Điểm | Hiện trạng | Hệ quả |
|---|---|---|
| Mã Task | `t1`, `t2`… duy nhất trong phiếu (`fillSheet`, `newId`) | Dùng được |
| Mã câu | `q1`/`i1`… duy nhất trong Task (`ensureIds`); nhân đôi câu xóa id cũ rồi cấp mới | Dùng được |
| Mã hàng bảng | `r1`… (`ensureRowIds`); **cột không có mã** (theo vị trí) | Ô bảng dùng `r<id>.c<chỉ số cột>` |
| Cấp lại mã sau khi xóa | `newId` lấy số nhỏ nhất còn trống → xóa `q2` rồi thêm câu mới thì câu mới lại là `q2` | **Không ảnh hưởng** vì mỗi lần xuất là một phiên bản bất biến; chỉ ảnh hưởng gộp thống kê giữa hai phiên bản khác đề (đã quyết không gộp). Ghi lại, chưa sửa |
| Chỗ trống trong câu | Đếm `___` theo thứ tự (`gapN`, `keyGaps`), đáp án `key` "went \| played" | Chỗ thứ n = `.<n>` |
| Chọn trong câu (Q4) | Nhóm `{*goes\|go}` (`pkGroups`) | Mỗi nhóm một chỗ |
| Bài đọc có chỗ trống | `lead.keys` | `lead.<n>` |
| Nối (Q8) | Cặp gõ cạnh nhau = đúng, `content.shuffle` + `pairPerm` xáo vế phải | Đáp án = vế phải cùng hàng |
| Hàm biết câu nào cần đáp án | `needKey`, `hasKey`, `keyState`, `itemKeys` **nằm trong `legacy/app.js`** | Phải chuyển sang `core` (thuần) mới dùng chung được |
| Vẽ trang | `renderTask` trong `core/layout.js` | Gắn `data-slot` ở đây |
| Kiểm thử | Đường chuẩn `tests/chuan` (120 dàn trang), `giaodien.py` (2497 trạng thái), 49 test Playwright | Cổng bắt buộc mỗi bước |

## 1. Các bước

### B1. Chuyển hàm đáp án sang lõi
- Chuyển `needKey`, `hasKey`, `keyState`, `itemKeys` và các hàm phụ (`gapN`, `keyGaps`, `optsOfKey`, `exPicks`…) từ `legacy/app.js` sang `core/answers.js` (thuần, không đụng DOM). Legacy import lại, hành vi giữ nguyên.
- Kiểm: typecheck, build, đường chuẩn 120/120, giaodien 2497/2497, 49 test.

### B2. Khởi tạo thư mục dùng chung `shared/`
- `shared/` ở gốc repo, TypeScript, **không thêm thư viện** (lược đồ viết tay bằng hàm kiểm tra; chạy test bằng `node --test`, Node tự bỏ kiểu TS).
- Nội dung đầu tiên: `types.ts` (Slot, Key, Answers, Result theo Tài liệu 2 mục 5, 6, 8), `normalize.ts` (chuẩn hóa chữ, Tài liệu 2 mục 6.2), `grade.ts` (`grade(slots, key, answers) → result`), `validate.ts` (kiểm slots / key đúng khuôn).
- WS Editor import `shared/` qua Vite (đường dẫn tương đối); file xuất `ws-editor.html` vẫn là một file.

### B3. Bộ liệt kê chỗ trả lời và đáp án
- `core/slots.js`: `slotsOf(task)` và `keyOf(task)` cho 12 dạng Q theo bảng 6.1 Tài liệu 2. Mỗi chỗ có `id`, `label` (số câu như in), `interaction`, `options` (không đánh dấu đúng), `grading`.
- `sheetSlots(ws)` gộp cả phiếu, kèm danh sách cảnh báo: câu thiếu đáp án (dùng `keyState`), dạng chỉ xem (Q9, lưới tìm từ, ô tick trong bảng).
- Không ghi gì vào dữ liệu phiếu (chỉ đọc).

### B4. Gắn `data-slot` lên trang
- `renderTask` thêm thuộc tính `data-slot="<id>"` vào phần tử của từng chỗ trả lời (gạch điền, nhóm lựa chọn, nhãn T/F, ô bảng, vế nối…). **Chỉ thêm thuộc tính, không thêm phần tử, không đổi CSS.**
- Đường chuẩn so hình học và ảnh từng trang: phải vẫn 120/120. Nếu `chuan.py` so cả chuỗi HTML thì bỏ qua thuộc tính `data-slot` khi so (ghi rõ trong `tests/chuan/README.md`).
- Kiểm thêm: mọi `data-slot` trên trang ↔ đúng một chỗ trong `sheetSlots`, và ngược lại, trên 24 phiếu chuẩn.

### B5. Bộ phiếu mẫu có kết quả mong đợi
- `shared/fixtures/`: 5–6 phiếu phủ đủ dạng có chấm (lấy từ `samples/` và `tests/real/`: phiếu 7, birthday, sunny-farm…), mỗi phiếu:
  - `sheet.json` (phiếu WS Editor),
  - `slots.json` + `key.json` (do B3 sinh, **người dùng duyệt**),
  - 2–3 bài làm mẫu (`answers-*.json`: đúng hết, sai vài chỗ, bỏ trống, viết khác chữ hoa / gạch nối / nháy cong),
  - kết quả mong đợi (`result-*.json`).
- `node --test` chạy `grade()` trên mọi cặp, phải khớp kết quả mong đợi.

### B6. Bảng duyệt cho người dùng
- Sinh `docs/TUONG_TAC/DUYET_GD0.md` (hoặc trang HTML trong `tests/`): với từng phiếu mẫu, bảng "Bài · Câu · Chỗ · Cách làm · Đáp án máy đọc được · Chấm máy / tay / chỉ xem". Người dùng dò xem máy hiểu đúng đáp án chưa.

### B7. Cập nhật tài liệu
- Spec mục mới (GĐ0), `KE_HOACH_REACT.md` nếu đụng mảnh nào, báo cáo phiên, badge `vNN` (tăng một bản vì `renderTask` đổi HTML), commit và push.

## 2. Nghiệm thu GĐ0
- [ ] Typecheck, build ra `ws-editor.html` một file.
- [ ] Đường chuẩn 120/120; giaodien 2497/2497; 49 test cũ đạt; 0 lỗi console.
- [ ] 24 phiếu chuẩn: `sheetSlots` chạy không lỗi; `data-slot` khớp 1–1.
- [ ] `node --test` trong `shared/`: chuẩn hóa, chấm, kiểm khuôn đều đạt trên bộ mẫu.
- [ ] Người dùng duyệt bảng B6, xác nhận máy đọc đúng đáp án.

## 3. Rủi ro
| Rủi ro | Cách giữ |
|---|---|
| Chuyển hàm ở B1 làm lệch "x/y câu có đáp án" | giaodien 2497 + test36 bắt; chuyển nguyên văn |
| `data-slot` làm đổi dàn trang | Chỉ thêm thuộc tính; đường chuẩn là cổng |
| Một dạng Q có cấu trúc lạ (hội thoại, câu nhiều dòng, câu ví dụ) bị liệt kê sai | Bảng duyệt B6 trên phiếu thật; dạng không chắc thì ghi "chỉ xem" và báo, không đoán |
| Q8 khi `content.shuffle` tắt (phiếu cũ, nhập MD): chưa có cặp đúng | Ghi "thiếu đáp án" như chip v90 hiện có, không đoán cặp |

## 4. Thứ tự và điểm dừng
B1 → B2 → B3 → B4 → B5 → B6 → B7. Dừng báo người dùng sau **B6** (bảng duyệt) trước khi chốt GĐ0.
