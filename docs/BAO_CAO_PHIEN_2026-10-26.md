# Báo cáo phiên 26/10/2026 (v73 → v78) — đọc đầu tiên khi mở phiên mới

## Đã làm trong phiên (đều đã commit và đẩy lên main, trừ v78 ghi rõ ở dưới)
- v73 G-Text kiểu Chữ · v74 G-Text kiểu Ảnh + 4 khung chữ · v75 bài đọc có chỗ trống đánh số / {a|b} / đậm nghiêng gạch chân / đáp án chỗ trống / cắt theo đoạn · v76 điểm trên ảnh chung (số trong chấm / ô trống, tròn / vuông, bấm để thêm, kéo để dời) · v77 mặc định theo cấu hình, ẩn số câu ở lề, A4 Tự động chọn Tự xuống dòng, nhãn "Self-check:" vào `Hướng dẫn:`.
- v78 ô chữ giải đố: bảng có `layout.table.cross`; không có ô đen, chỉ ô có chữ mới có viền xám bo góc; tự đánh số; `key` hiện đáp án; cỡ ô; ô văn bản "Lưới ô chữ" ở cột trái; MD `Crossword:`; G-Text thêm 2 cột chữ và danh sách số bắt đầu từ N (để viết gợi ý Across / Down). Spec mục 17.9, bổ sung mục AP, `tests/test26.py` (đạt khi chạy riêng).

## Đã kiểm thử / chưa kiểm thử (nói thật)
- v73–v77: đủ test1–25 + audit trên bản cuối, 0 lỗi console, 0 tràn trang (test17 từng lỗi một lần do tôi chạy hai Chromium cùng lúc; chạy lại riêng thì đạt).
- v78: test1–26 + audit đạt trên bản cuối (chi tiết cuối file), có chụp ảnh ô chữ xem lại. Chưa so sánh bằng mắt với một PDF ô chữ thật.
- Chưa kiểm: ô chữ nhiều trang / ô chữ rất lớn (>20 cột); in lưới ở cỡ ô 16 mm; MD khứ hồi với ô `(a)` ngoài test đơn giản.

## Việc tiếp theo (thứ tự người dùng đã chốt: 1 → 2 → 3)
1. (Xong code) ô chữ giải đố. Người dùng sẽ tạo bài thử để kiểm; sửa theo phản hồi.
2. **Cú pháp MD cho khối G-Text** (chữ / ảnh, vị trí trên / dưới, cỡ, căn, khung, 1–2 cột), **điểm trên ảnh** (`image.marks`, `mk`) và **đáp án chỗ trống bài đọc**. Hiện chỉ JSON mang được extras / marks / keys, MD thì không. Cập nhật `QUY_UOC_MD.md` và `PROMPT_PDF_SANG_PHIEU.md` (cả lời gợi ý Across / Down của ô chữ).
3. **Tiêu đề phiếu / Họ tên Lớp Ngày / header footer** (trước đó người dùng nói làm riêng; xác nhận phạm vi khi tới).
- Sau đó: P3 (PDF thật + MD do AI tạo + ảnh sau khi nạp → phân 5 nhóm lỗi, thêm vào `tests/real/`).

## Cần người dùng làm
- Thay file trong Project bằng bản repo (Project còn ở v69): `ws-editor-prototype.html`, `docs/WS_EDITOR_SPEC.md`, `docs/WS_EDITOR_SPEC_v37_bo_sung.md`, `docs/QUY_UOC_MD.md`, `docs/PROMPT_PDF_SANG_PHIEU.md`, `tests/`.
- Sửa Project Instructions: bỏ "publish artifact"; thay bằng "commit và đẩy lên GitHub khanhtoaninv/WS-Editor, nhánh main".
- Xem lại cỡ chữ Nhỏ / Vừa / To (12/14/16, 10/12/14, 9/10.5/12 pt) — mới là đề xuất.
- Gửi PDF thật + MD AI tạo + ảnh sau khi nạp để làm P3.

## Giới hạn đã biết
- MD chưa mang extras / marks / gap keys (chỉ JSON). Điểm trên ảnh chỉ cho G1 ảnh chung. Khung từ của bài đọc bị cắt chỉ hiện ở đoạn đầu. Khối ảnh G-Text chưa có Fit / zoom. Bài 1 Sunny Farm vẫn dùng `### Phần:` để lách thứ tự. Đã bỏ: kiểu Thẻ và đường nối (kiểu B).
- Ô chữ: app không tự xếp từ vào lưới; người soạn hoặc AI phải đưa lưới sẵn.

## Cách chạy kiểm thử
`bash tests/run_all.sh <mới.html> <cũ.html>` (từng test một, mỗi cái riêng; không chạy hai Chromium cùng lúc).

## Kết quả suite v78 (bản cuối, chạy từng test một)
test1–26 đều đạt (test2 so với v77: 32/32, test26: 17/17), audit 0 vấn đề, 0 lỗi console. test17 lần này 36/36 (lỗi lần trước là do chạy hai Chromium cùng lúc). Chưa chạy: audit2, cmp_paste, ws_sea trên v78.
