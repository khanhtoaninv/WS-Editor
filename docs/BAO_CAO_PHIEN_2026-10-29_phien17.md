# Báo cáo phiên 17 — 29/10/2026: module Tạo bài T0 → T3

## 0. BÀN GIAO (đọc mục này trước)

**App: v127.** Đã làm T0, T1, T2, T3 của `docs/TAO_BAI/KE_HOACH_TRIEN_KHAI.md` (người dùng yêu cầu giữa phiên: "hoàn thành T0, kiểm thử và làm luôn cho xong T3, mỗi bước tự kiểm thử trước khi làm tiếp").

| Bản | Giai đoạn | Spec | Thử tay |
|---|---|---|---|
| v124 | T0 · rà bộ đọc MD theo 12 dạng Q (3 lỗi đã sửa), dữ liệu mẫu tạm, mô-đun chuyển đổi, file chung 1 nháp | mục 55 | — |
| v125 | T1 · Duyệt bài + Lịch sử theo lần Duyệt | mục 56 | `docs/TAO_BAI/KIEM_TRA_T1.md` |
| v126 | T2 · Máy kiểm + Hiện đáp án (cam) / tô vàng câu lỗi | mục 57 | `docs/TAO_BAI/KIEM_TRA_T2.md` |
| v127 | T3 · Màn Ra đề, layout sơ bộ, Sinh bài = phiếu khung, API máy chủ | mục 58 | `docs/TAO_BAI/KIEM_TRA_T3.md` |

Commit: T0 riêng (`v124`, đã đẩy sau khi đủ bộ test đạt). T1–T3 chung một commit `v127`: ba giai đoạn viết gối nhau trong lúc bộ test T0 chạy (~25 phút, không được chạy hai Chromium cùng lúc), rồi **kiểm thử lần lượt T1 → T2 → T3** trên bản dựng, sửa lỗi tìm được ở từng bước trước khi sang bước sau (mục 3).

**Việc tiếp:**
1. Người dùng thử tay `KIEM_TRA_T1.md` → `T3.md` (mở thẳng `ws-editor.html`, hoặc qua `chay-lop.bat` → `/editor` để thử "Phiếu đã tạo").
2. Duyệt **chuẩn mới `tests/chuan/v124/`** (= `v117/` chỉ đổi nhãn Q12 ở 2 phiếu, mục 2.1). Không đồng ý thì đổi lại mặc định trong `tests/chuan/chuan.py` về `v117`.
3. Thảo luận cấu trúc file (Kiến thức / Trình tự / TF / file chung) — định dạng hiện là **tạm** (`docs/TAO_BAI/DINH_DANG_TAM.md`); chốt rồi chỉ sửa `shared/src/taobai/doc.ts`, `kho.ts`.
4. **T4 Sinh bài** (v128): đoạn nhắc, gọi AI qua máy chủ, chế độ AI ngoài, điền bài vào phiếu khung (⏳ → ○ / ⚠), Sinh lại bài này. Dùng `tachMeta()` (shared) trước bộ đọc; máy kiểm đọc `task.gen.md` / `gen.mdNotes`.

**Lệnh mở phiên tiếp:**
> Đọc CLAUDE.md, docs/BAO_CAO_PHIEN_2026-10-29_phien17.md mục 0 và docs/TAO_BAI/KE_HOACH_TRIEN_KHAI.md mục T4. Tóm tắt ngắn rồi hỏi tôi kết quả thử tay T1–T3 trước khi làm T4.

## 1. Đã làm

### T0 (v124)
- 20 mẫu MD viết đúng như AI sẽ viết cho 12 dạng Q (`tests/taobai/q12_mau.py`) nạp qua `readMd`: mọi dạng nhận đúng Q. Tìm và sửa 3 lỗi:
  1. **Câu "sắp xếp từ" bị mất không báo**: `2. was / at / I / home` ngay sau câu kết thúc bằng `?` bị gộp thành lựa chọn của câu trên; `Dạng: viết câu` bỏ lựa chọn → mất câu, đáp án lệch. Sửa ở `md.js` và cả `ws-editor-prototype.html` (lỗi nặng: mất nội dung).
  2. **`Bài đọc: <chữ>` cùng dòng** thành câu hỏi (không báo, đáp án lệch một câu) → nay là dòng đầu bài đọc + ghi chú. Tương tự `Hội thoại: Tên: lời`.
  3. **Nhãn Q12**: phiên 16 thấy "Câu hỏi · viết câu" — thực ra Q đã đúng là Q12, chỉ nhãn mô tả sai; nay "Viết tự do" / "Khung vẽ tự do".
- Phát hiện cho T4: bộ đọc không biết `Mục tiêu:` / `Ngữ cảnh:` (thành 2 câu hỏi) → `tachMeta()` tách trước.
- Kiểu dữ liệu `shared/src/taobai/types.ts`; bộ tách định dạng tạm `doc.ts`; bộ mẫu `server/demo/tao-bai/` (Pinta English 3 · Unit 5: Lesson 1 Từ vựng, Lesson 2 was/were, Lesson 3 Past simple — cùng chuyên đề Ngữ pháp với Lesson 2 để thử "dùng chung Trình tự", Lesson 4 Nghe; kế hoạch ghi "2 chuyên đề, 3 lesson" nhưng liệt kê 3 lesson thuộc 3 chuyên đề, tôi làm 4 lesson / 3 chuyên đề); file chung 1 nháp `docs/TAO_BAI/CHUNG_1_QUY_TAC_MD.md` (2 ví dụ trong file được test nạp thật).

### T1 (v125), T2 (v126), T3 (v127)
Xem spec mục 56–58. Điểm chính:
- **Không đổi bố cục editor**: thêm dải trên (44 px), biểu tượng cuối dòng Task, ngăn trượt cùng ô lưới với inspector, màn Ra đề đè cả editor.
- ✓ / ○ theo **dấu nội dung** (băm Task trừ `gen`): sửa → ○, sửa ngược → ✓. Lịch sử chỉ khi bấm Duyệt, ≤ 3; Dùng bản này / Xem (chỉ đọc thật: phiếu đang làm và hoàn tác được cất riêng) / Khôi phục; mọi thao tác có Hoàn tác. MD và gói .wsp không mang `gen`.
- Máy kiểm chạy lại mỗi lần vẽ, không lưu vào phiếu. Hiện đáp án dùng lại cách vẽ của trình chiếu, màu cam, không vào gói.
- Ra đề: nguồn dữ liệu qua máy chủ (`/api/taobai/…`) hoặc bộ mẫu nhúng / thư mục tự chọn khi mở thẳng file; máy chủ và trình duyệt dùng chung `shared/src/taobai/kho.ts`. Layout sơ bộ dàn **bằng chính bộ dàn trang** (phiếu giả chữ "xxx"); trên phiếu was/were chữ thật lệch ≤ 1 trang. Sinh bài (T3) = phiếu khung ⏳; quay lại Ra đề rồi Sinh bài giữ bài không đổi (đặc tả 5.6, làm sớm).

## 2. Lệch so với kế hoạch / cần người dùng biết
1. **Chuẩn 120**: nhãn Q12 đổi `typeName` của 2 Task ở 2 phiếu → `tests/chuan/v124/` (chỉ 2 dòng `data.json` khác `v117/`; hình học, MD, ảnh y nguyên). `chuan.py` mặc định `v124`. Cần người dùng đồng ý (README chuẩn yêu cầu).
2. Số bản dịch lên 1: T0 thành v124 vì có sửa bộ đọc; T1 = v125 … T5 = v129 (đã sửa kế hoạch).
3. Máy kiểm ở `app/src/taobai/maykiem.ts` thay vì `shared/` (cần mô hình phiếu của app).
4. "Lệnh ẩn" T1 nằm trong hộp **?** (nút "Thử chế độ tạo bài cho phiếu này"). Nút **Tạo bài** đặt cạnh "+ Phiếu" ở cột trái (đặc tả mục 10; bảng điểm nối của kế hoạch ghi TopBar).
5. Mở thẳng file: không lưu "Phiếu đã tạo" (cần máy chủ); có nút "Chọn thư mục dữ liệu…".
6. API Tạo bài không đòi đăng nhập giáo viên (máy chủ lớp thử chạy trong máy / mạng nội bộ). Khi chuyển sang TeacherResource cần thêm.

## 3. Kiểm thử
**Đã chạy (trên bản cuối v127, kết quả ở mục 4 khi xong):** chuẩn 120/120; 49 test cũ + audit (`run_all.sh`, so với `ws-editor-prototype.html`); `npm run test:lop` (gồm API Tạo bài); `shared` node test; `tests/taobai/test_q12.py`, `test_t1.py`, `test_t2.py`, `test_t3.py --may-chu`; Playwright các test lớp thử `tests/lop/`.

**Lỗi tìm được khi tự kiểm thử từng bước (đã sửa):**
- T1: bấm biểu tượng trong cây không mở ngăn (bộ xử lý cũ dựng lại cả cột ngay trong cú bấm, React không nhận sự kiện) → bắt ở pha capture. Chữ trong ngăn căn giữa do **trùng tên lớp CSS `.tbck`** với editor → đổi tên, rà mọi lớp mới. Dải trên không tràn hết chiều ngang → full-bleed.
- T2: "câu lặp giữa các bài" báo nhầm (chuẩn hóa bỏ `{was|were}` / `___` làm hai câu khác thành giống) → giữ chữ các vế và chỗ trống; lý do in câu gốc. Mở phiếu khác thì ngăn duyệt cũ vẫn mở → đóng khi nạp phiếu.
- T3: khung "Chọn bài" bị co mất khi nội dung dài (flex co), nút nổi Gói .wsp / Chiếu đè màn Ra đề → CSS.

**Lỗi có sẵn từ trước (không do phiên này):** `test31` (4), `test35` (5), `test36` (5) lỗi y hệt trên bản v123 gốc (đã chạy cả hai để so) — các phép thử tích đáp án trên phiếu demo, nhiều khả năng do v123d cho phiếu demo có đáp án sẵn. Chưa sửa (ngoài phạm vi), cần một phiên xem lại.

**Ghi chú môi trường:** test 43–49 mở file theo đường dẫn cứng `/home/claude/WS-Editor/…` (chữ hoa); repo ở `/home/claude/ws-editor` thì phải tạo liên kết `ln -s /home/claude/ws-editor /home/claude/WS-Editor`.

**Chưa kiểm thử:** Windows, điện thoại; dữ liệu giáo trình thật (chưa có); AI (chưa có ở T0–T3). Mẫu MD trong test do Claude viết theo `1_DANG_Q.md`, không thay được MD do AI khác viết (T4/T6).

## 4. Kết quả hồi quy trên bản cuối (v127)
| Bộ | Kết quả |
|---|---|
| Chuẩn `chuan.py so` (chuẩn `v124`) | **120/120** |
| 49 test cũ + audit (`run_all.sh`, so với prototype) | đạt trừ: test31 / 35 / 36 (lỗi có sẵn, y hệt v123); test13 (sửa test: có thêm nút Tạo bài theo thiết kế → đạt); test34 chập chờn (lỗi rồi đạt khi chạy lại, cũng lỗi một lần trên bản T0) · audit 0 vấn đề |
| `tests/taobai/test_q12.py`, `test_t1.py`, `test_t2.py`, `test_t3.py --may-chu` | **ALL OK** cả bốn |
| `npm run test:lop` (API lớp thử + API Tạo bài) | 11/11 |
| `shared` node test | 35/35; kiểm kiểu app + shared sạch |
| Lớp thử trình duyệt (`tests/lop/run.sh`) | test_lop 18/18, test_cham 45/45, test_demo, test_live ALL OK |
| Bản T0 (v124, trước khi đẩy) | chuẩn 120/120, test_q12 OK, run_all như trên (test2 đạt khi so đúng với prototype) |
