# Báo cáo phiên 18 — 29/10/2026: module Tạo bài T4 (Thiết lập + Kho phiếu, Sinh bài)

## 0. BÀN GIAO (đọc mục này trước)

**App: v129.** Người dùng (đầu phiên): T1–T3 thử tay "mọi thứ chạy đúng quy trình" (chỉ ra chữ "xxx" vì chưa có AI, đúng như thiết kế). Yêu cầu thêm trước T4: **menu chung** của app gồm **Kho phiếu** và **Thiết lập** (Giáo trình: cây giáo trình → unit → lesson, mỗi lesson nạp Kiến thức; Dạng phiếu: Trình tự / TF theo chuyên đề + file dùng chung; AI: ô khóa API + model, Claude để sẵn Sonnet 5.5 / Haiku 5.5, tương tự cho API khác). "Cứ dựng lên đã, quy tắc sinh bài bạn tự đề ra, viết ra để sau còn thảo luận." Chốt: ô khóa chỉ dùng khi chạy qua máy chủ, mở file trơn thì AI ngoài. Người dùng cho **tự làm hết, tự kiểm thử từng bước, tự đẩy khi đủ bộ test đạt**.

| Bản | Việc | Spec | Thử tay |
|---|---|---|---|
| v128 | T4a · menu ☰ (Kho phiếu · ⚙ Thiết lập · Tạo bài), Thiết lập (Giáo trình / Dạng phiếu / AI), Kho phiếu, kho dữ liệu ghi được trên máy chủ | mục 59 | `docs/TAO_BAI/KIEM_TRA_T4.md` phần 1 |
| v129 | T4 · Sinh bài: đoạn nhắc, gọi AI qua máy chủ (song song 3, gửi lại lỗi ≤ 2 lần), điền bài ⏳ → ○ / ⚠, Sinh lại kèm góp ý, không ghi đè bài đang sửa, AI ngoài (chép / dán), tự lưu Kho phiếu, nhật ký | mục 60 | `KIEM_TRA_T4.md` phần 2–3 |

**Quy tắc sinh bài (bản 1, tự đề ra): `docs/TAO_BAI/QUY_TAC_SINH_BAI.md`**, mã S1–S25 + 7 câu hỏi để thảo luận ở cuối file. Góp ý theo mã.

Commit: v128 + v129 **chung một commit** (hai bản viết gối nhau, cùng sửa `RaDe.tsx`, `store.ts`), đẩy sau khi đủ bộ test đạt trên bản cuối. Mỗi bản đã tự kiểm thử riêng trước khi sang bản sau (mục 3).

**Việc tiếp:**
1. Người dùng thử tay `docs/TAO_BAI/KIEM_TRA_T4.md`: phần 1–2 không cần khóa; phần 3 cần khóa Claude (nhập ở ☰ › ⚙ Thiết lập › AI). Thử cả Sonnet 5.5 và Haiku 5.5 (ghi lại cho T6).
2. Góp ý quy tắc theo mã S… (`QUY_TAC_SINH_BAI.md`), trả lời 7 câu hỏi cuối file khi đã thử.
3. Thảo luận cấu trúc file (Kiến thức / Trình tự / TF / file chung) — định dạng vẫn là **tạm** (`docs/TAO_BAI/DINH_DANG_TAM.md`), giờ nạp được ngay trong app.
4. **T5 AI chấm theo rubric** (v130) khi có file chung 4 (rubric).
5. Quyết (không gấp): phiếu có tên dài làm thanh trên xuống hai dòng (có từ trước, mục 2.3).

**Lệnh mở phiên tiếp:**
> Đọc CLAUDE.md, docs/BAO_CAO_PHIEN_2026-10-29_phien18.md mục 0 và docs/TAO_BAI/QUY_TAC_SINH_BAI.md. Tóm tắt ngắn rồi hỏi tôi kết quả thử tay T4 và góp ý quy tắc sinh bài trước khi sửa hay làm T5.

## 1. Đã làm

### v128 · Thiết lập + Kho phiếu (spec mục 59)
- **Menu ☰** ở thanh trên (Kho phiếu · ⚙ Thiết lập · Tạo bài); màn Ra đề có nút Kho phiếu / ⚙ Thiết lập; lesson lỗi dữ liệu có **Mở Thiết lập để nạp file**.
- **Máy chủ**: kho dữ liệu ghi được `<dữ liệu>/tao-bai/du-lieu/` (lần đầu chép bộ mẫu), file chung riêng `tao-bai/chung/`, **bản cũ mỗi lần thay / bỏ giữ ở `tao-bai/_cu/`**; chỉ ghi đúng chỗ của định dạng tạm; thiết lập AI `tao-bai/thiet-lap.json` (khóa không về trình duyệt, chỉ 4 ký tự cuối); quyền sửa: chính máy chạy máy chủ hoặc đã đăng nhập `/gv`.
- **Thiết lập**: Giáo trình (cây, Kiến thức từng lesson: Xem / Nạp / Thay / Bỏ, ＋ Nạp giao-trinh.md, Nạp cả thư mục), Dạng phiếu (Trình tự / TF từng chuyên đề, file dùng chung 1–5, Về mặc định), AI (Claude: Sonnet 5.5 mặc định / Haiku 5.5 / Model khác; Tương thích OpenAI: địa chỉ + khóa + model; Lưu, Thử kết nối, Xóa khóa). Mở file trơn: chỉ xem.
- **Kho phiếu**: mọi phiếu đã tạo (lưu lúc, giáo trình › unit › lesson, số bài / đã duyệt / chờ sinh), tìm, Mở, Bỏ.

### v129 · Sinh bài (spec mục 60)
- Đoạn nhắc dùng chung `shared/src/taobai/nhac.ts`; điều phối `app/src/taobai/sinh.ts`; một lượt gọi AI `POST /api/taobai/ai` (máy chủ xếp hàng 3 lượt, ghi nhật ký model / token / thời gian).
- Đọc kết quả: làm sạch (bỏ ``` và lời dẫn), tách Mục tiêu / Ngữ cảnh, bộ đọc MD của app; lỗi phải gửi lại → gửi lại đúng chỗ lỗi ≤ 2 lần → quá thì ⚠; 429 / 529 chờ rồi thử lại một lần.
- Ngăn Duyệt: đang viết (lượt k), Viết bởi *model* · k lượt, Sinh lại kèm góp ý, Dùng bản AI vừa viết, hộp AI ngoài (chép đoạn nhắc / dán kết quả / chép đoạn nhắc sửa lỗi / vẫn dùng bản này). Dải trên: AI đang dùng, ⏳ k bài + Dừng, Sinh k bài đang chờ.
- Tự lưu Kho phiếu khi sinh xong; nhật ký sự kiện app (sinh xong, sinh lại kèm góp ý, AI ngoài, duyệt + có sửa tay).

## 2. Lệch so với kế hoạch / cần người dùng biết

1. **Kế hoạch T4 tách hai bản** (v128 Thiết lập theo yêu cầu mới, v129 Sinh bài); T5 thành v130 (đã sửa `KE_HOACH_TRIEN_KHAI.md`).
2. **Đoạn nhắc ở `shared/`, vòng gửi lại ở app** (kế hoạch: `server/src/taobai/nhac.ts`, `sinh.ts`): chế độ AI ngoài trong trình duyệt cũng cần dựng đoạn nhắc, và bộ đọc MD chỉ chạy trong trình duyệt. Máy chủ chỉ làm một lượt gọi AI + nhật ký. Gọi Claude bằng Messages API chuẩn (`anthropic-version: 2023-06-01`), không dùng lại `server/src/ai.ts` (của Insight AI, có tham số beta).
3. **Thanh trên**: hai nút chữ "Kho phiếu", "⚙ Thiết lập" (bản v128 đầu) làm thanh trên xuống hai dòng ở khổ 1440 px → cả trang dời 35,5 px, **đường chuẩn lệch 50/120**. Đổi thành **một nút ☰** và khoảng cách giữa các mục thanh trên 14 → 10 px: thanh một dòng như v127, chuẩn **120/120**. Có thử cắt tên phiếu dài cho thanh luôn một dòng, nhưng đường chuẩn ghi sẵn thanh hai dòng cho phiếu `birthday6-dang.md` (tên dài) nên bỏ. **Phiếu tạo bài có tên dài ("Unit 5 · My weekend · Lesson 2 · was / were") vẫn làm thanh trên hai dòng** — có từ v127; muốn sửa thì phải làm lại đường chuẩn (cần người dùng đồng ý).
4. **Test T3 sửa một chỗ**: v129 ở chế độ AI ngoài tự mở ngăn Duyệt ở bài ⏳ đầu (quy tắc S24), test cũ bấm "Duyệt bài" để mở nên lại đóng ngăn → test chỉ bấm khi ngăn đang đóng.
5. Khóa API lưu dạng chữ trong `tao-bai/thiet-lap.json` ở thư mục dữ liệu máy chủ (như `khoa.json`): giữ kín thư mục `server/du-lieu/`, không gửi kèm khi chia sẻ.

## 3. Kiểm thử

**Từng bước (trước khi sang bước sau):**
- v128: `server/test/taobai-t4.test.ts` (kho chép mẫu, nạp / thay / bỏ, giữ bản cũ, chặn đường dẫn lạ, file chung riêng, thiết lập AI không lộ khóa, thử kết nối Claude + tương thích OpenAI với AI giả, Kho phiếu, quyền máy khác chỉ xem); `tests/taobai/test_t4_thiet_lap.py` (mở file + qua máy chủ, AI giả). Rồi T1, T2, Q12, T3 `--may-chu` trên bản v128: đạt. Bộ chuẩn lần đầu 70/120 → tìm ra lỗi thanh trên (mục 2.3), sửa.
- v129: thêm vào `taobai-t4.test.ts` (đoạn nhắc đủ phần / chỉ mục Q / gửi lại / sinh lại; lượt AI song song ≤ 3, 409 khi chưa có khóa, 429 / 401 báo tiếng Việt, nhật ký không có khóa); `tests/taobai/test_t4_sinh.py` với máy chủ AI giả `tests/taobai/ai_gia.py` (đúng / sai cú pháp → gửi lại / sai số câu ×3 → ⚠ / chậm / 429 → thử lại; đoạn nhắc đủ phần; tránh lặp; tự lưu kho; sinh lại kèm góp ý; không ghi đè bài đang sửa + Dùng bản AI + Hoàn tác; Ra đề đổi một bài chỉ sinh bài đó; Duyệt → Xuất bản; nhật ký; AI ngoài: chép, dán sai → lỗi + đoạn nhắc sửa lỗi, dán có lời dẫn, vẫn dùng bản này, đoạn nhắc sinh lại).
- Lỗi tự tìm khi kiểm thử (đã sửa): thanh trên xuống dòng (mục 2.3); bài ⏳ bị tô vàng như câu lỗi → bỏ qua bài ⏳; dải trên dính chữ → khoảng cách; trình duyệt chặn chép tự động → thêm cách chép dự phòng + ô đoạn nhắc để chép tay.

**Chưa kiểm thử:** AI thật (không có khóa, máy không ra được mạng ngoài): chất lượng bài, thời gian thật, cách Claude / OpenAI thật trả lỗi; "Tương thích OpenAI" chỉ thử với máy chủ giả; chép tự động trên trình duyệt thật (headless chặn); Windows, điện thoại.

## 4. Kết quả hồi quy trên bản cuối (v129)
| Bộ | Kết quả |
|---|---|
| Chuẩn `chuan.py so` (chuẩn `v124`) | **120/120** (bản v128 đầu: 70/120 → sửa thanh trên, mục 2.3) |
| 49 test cũ + audit (`run_all.sh`, so với prototype) | đạt trừ test31 (4) / test35 (5) / test36 (5): **lỗi có sẵn, y hệt số lỗi phiên 17** (v123); audit 0 vấn đề |
| `tests/taobai/test_q12.py`, `test_t1.py`, `test_t2.py`, `test_t3.py --may-chu` | **ALL OK** cả bốn (T3 sửa một chỗ, mục 2.4) |
| `tests/taobai/test_t4_thiet_lap.py`, `test_t4_sinh.py` | **ALL OK** cả hai |
| `npm run test:lop` (lớp thử + Tạo bài T0–T4) | 21/21 |
| `shared` node test + kiểm kiểu | 35/35; kiểm kiểu app + shared sạch |
| Lớp thử trình duyệt (`tests/lop/run.sh`) | test_lop 18/18, test_cham 45/45, test_demo, test_live ALL OK |


## Bổ sung 30/10/2026 · v130 (sau thử tay đầu tiên)
Hai góp ý của người dùng: (1) trong Thiết lập / Kho phiếu không có nút quay lại soạn bài → thêm nút "← Quay lại soạn bài" (commit 582ec4b). (2) Số câu, số bài, số trang không nên cứng: hệ thống chỉ đề xuất lần đầu, sau đó người dùng tự quyết (kể cả Task tự do), AI sinh theo; số trang bỏ hẳn → làm v130, spec mục 61, quy tắc S26–S29 (`QUY_TAC_SINH_BAI.md` phần H). T5 (AI chấm) dời sang v131.
