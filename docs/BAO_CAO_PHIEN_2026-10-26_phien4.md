# Báo cáo phiên 26/10/2026 (phiên 4) — v81: triển khai kiến trúc trình bày mới

## 1. Kết quả
- **v81 đã lên `main`**: kiến trúc T / Q / G theo `docs/KIEN_TRUC_TRINH_BAY_MOI.html`, bậc 0–5. Bản v80 lưu ở nhánh `backup/v80`.
- Dữ liệu không đổi schema: T (4 bố cục) và Q (12 dạng câu hỏi) **suy ra** từ mã T1–T9 / A1–A8 cũ. Phiếu cũ mở ra giống v80 (cmp_v80: 16/16 phiếu, so HTML từng trang).
- Chi tiết hành vi: `docs/WS_EDITOR_SPEC.md` mục 18.

## 2. Đã làm theo bậc
| Bậc | Nội dung |
|---|---|
| Lõi vẽ | câu ví dụ số 0 (đáp án in sẵn), dòng chữ giữa các câu, bốn ô li, khung vẽ, nhãn A–D dưới `<u>`, nhãn Đúng/Sai tự đặt, hai ảnh chung, khung từ ảnh, khung từ dưới câu hỏi, câu hỏi trước bài đọc, đoạn bài đọc có nhãn A. B., người nói trong câu A/B/C |
| 1 | panel Bài đọc / Câu hỏi, thứ tự bài đọc ↔ câu hỏi, thêm / xóa khối thống nhất (✕, "Thêm khối", phím Delete), ảnh thứ hai |
| 2 | bộ chọn 12 dạng Q có hình xem trước khi rê chuột; cách trả lời nằm trong Q (bỏ "Gắn đáp án" / "Kiểu đáp án" khỏi giao diện); bốn ô li |
| 3 | bộ chọn Bố cục Task 4 kiểu thay bộ chọn 9 bố cục cũ; cách xếp câu (lưới / danh sách, cột phải / dưới câu) là tùy chọn của Q |
| 4 | dòng chữ (G3-Text) trong danh sách câu, câu ví dụ, thao tác từng câu (thêm sau, nhân đôi, ví dụ, xóa) |
| 0 + 5 | cú pháp MD: `Dạng:`, `Bố cục:`, `0.`, `> `, `Ảnh: A; B`, `Khung từ ảnh:`, `Vị trí khung từ:`, `Dòng kẻ:`, `Thứ tự:`, `Điểm trên ảnh:`, `Khối chữ:` / `Khối ảnh:`, đáp án `0.` và `Chỗ trống:`; xuất MD ghi đủ; viết lại `QUY_UOC_MD.md` và `PROMPT_PDF_SANG_PHIEU.md` (AI ghi `Dạng:`) |

## 3. Kiểm thử trên bản cuối (đã chạy)
- `bash tests/run_all.sh` test1–30 + audit: **tất cả đạt**, 0 lỗi console, audit 0 vấn đề.
- `tests/cmp_v80.py`: 16/16 phiếu (demo, samples, tests/md, tests/real) giống v80.
- Mới: `test29` (giao diện T/Q, ~200 lần đổi dạng + hoàn tác trên 18 Task mẫu, khối, Delete, ví dụ, dòng chữ, JSON khứ hồi), `test30` (MD mới: đọc, vẽ, xuất rồi đọc lại; phiếu thật birthday6 viết bằng `Dạng:` cho cùng cấu hình như `Trả lời:`).
- `test2`: sửa một kiểm tra chữ "Đáp án" → chấp nhận "Câu hỏi" (đổi tên có chủ đích).

## 4. Chưa kiểm thử / giới hạn
- **Chưa thử MD do AI khác tạo theo prompt v81 từ PDF thật** (P3). Mẫu `tests/md/v81-cu-phap.md` do Claude viết, không thay được.
- G3 chia nhóm vẫn hoãn (dùng `### Phần:`).
- Cột trái mục 1 vẫn còn "Áp mẫu" và chọn loại đáp án cũ (trùng một phần với bộ chọn Q).
- Câu hỏi trước bài đọc không dùng với Ảnh trong bài đọc / bài đọc cạnh câu hỏi chọn tay (khóa, có lý do).
- Chưa xem kỹ giao diện trên màn hình nhỏ; hình xem trước Q là mẫu tĩnh.

## 5. Việc tiếp theo
1. Người dùng thử v81, góp ý bộ chọn Bố cục / Dạng câu hỏi.
2. P3: PDF thật + MD AI tạo theo prompt v81 + ảnh sau khi nạp.
3. Tiêu đề phiếu / Họ tên Lớp Ngày / header footer.

## 6. Ghi chú kỹ thuật cho phiên mới (đọc trước khi sửa code)
- **Khối v81 trong `ws-editor-prototype.html`** nằm cuối file, ngay trước `window.__ws = {`, giữa hai dòng chú thích `v81: Kiến trúc trình bày mới` và `hết v81`. Nó **ghi đè** hàm cũ theo kiểu bọc (`layoutPicker`, `answerPanel`, `framePanel`, `bankPanel`, `renderInspector`, `edHtml`, `setKind`, `toggleField`, `blankItem`, `itemKeys`, `labelOf`, `tidy`, `applyField`, `keyExtra`, `layoutReasons`, `autoLayout`). Muốn sửa giao diện T/Q thì sửa ở khối này; hàm gốc vẫn còn phía trên.
- **Hàm chính:** `tnOf` / `setTN` qua `qCmd(t,'tn',v)` (Bố cục), `qDerived` / `qOf` / `setQ` / `qStyles` / `qArr` / `qReasons` (Dạng câu hỏi), `blkAdd` / `blkDel` / `blkAddable` (khối), `itemAct` (thao tác câu), `mdForm` (đọc `Dạng:` trong MD). Lõi vẽ: `qnum`, `inoT`, `inoN`, `g3row`, `leadIntro`, `g4Html`, `ans` (bọc `ans0` để in đáp án câu ví dụ), `qtext` (bọc `qtext0`).
- **Quy tắc đã chốt khi làm:** không đổi schema; T/Q chỉ suy ra; `t.q` chỉ lưu khi Task không có chỗ trả lời; câu ví dụ `ex` và dòng chữ `gt` không được đếm vào số câu hay đáp án; mọi lệnh đổi dạng là một bước hoàn tác; Task bài đọc chỉ đi với Q1, Q2, Q3, Q5.
- **Cạm bẫy đã gặp:** (1) test so HTML phải bỏ dấu chọn (`cur`) vì chọn Task đổi class; (2) xóa khối đang được chọn phải đưa lựa chọn về Task **trước** khi vẽ lại, nếu không panel cũ đọc dữ liệu đã mất; (3) câu có ảnh (`[ảnh: x]`) mà `Dạng:` là điền từ / viết câu / chọn thì phải giữ ảnh, chỉ đổi cách trả lời; (4) hai ảnh chung và "câu hỏi trước bài đọc" khóa bố cục Ảnh trái / phải / trong bài đọc.
- **Kiểm thử so với v80:** `git show backup/v80:ws-editor-prototype.html` lưu ra một thư mục có `fonts/` cạnh nó, rồi `python3 tests/cmp_v80.py <mới.html> <v80.html>`. Chạy test từng cái một: `bash tests/run_all.sh <mới.html> <v80.html>` (test2 cần bản cũ). Toàn bộ mất khoảng 8 phút (audit ~106 s).
- **Phiếu mẫu mới:** `tests/md/v81-cu-phap.md` (mọi cú pháp mới, do Claude viết), `tests/md/birthday6-dang.md` (phiếu thật birthday6 viết bằng `Dạng:`).
- **Việc mở, theo thứ tự gợi ý:** (1) người dùng thử v81 và góp ý; (2) P3: PDF thật + MD AI tạo theo prompt v81, phân lỗi vào 5 nhóm rồi thêm vào `tests/real/`; (3) tiêu đề phiếu / Họ tên Lớp Ngày / header footer; (4) G3 chia nhóm (hoãn); (5) cân nhắc bỏ "Áp mẫu" và chọn loại đáp án cũ ở cột trái mục 1.
