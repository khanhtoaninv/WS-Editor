# Báo cáo phiên 27/10/2026 (phiên 9): thử prompt PDF→MD với phiếu 7, v100

## 0. BÀN GIAO CHO PHIÊN SAU
**Trạng thái:** nhánh `claude/project-thread-0077zc` = **v100** (PR chờ người dùng duyệt; `main` = v99). v100 = spec mục 32; test `tests/test43.py`. Phiếu thật mới: `tests/real/phieu7.pdf`, MD AI tạo `tests/real/phieu7-ai-v99.md`, MD đã sửa `tests/md/phieu7.md`.

**Diễn biến:** người dùng thử prompt PDF→MD mới nhất với phiếu "Unit 6 – Lesson 1" và nhờ phân tích sai khác giữa phiếu tạo ra và PDF gốc. Phân theo 5 nhóm lỗi:
- **AI / prompt dẫn sai:** `Hướng dẫn:` chép lại đúng tiêu đề bài (app in hai dòng giống nhau); `Tuổi: 10-12` tự bịa (PDF chỉ có Level 0); tiêu đề bài đọc viết trước `Bài đọc:` nên thành một câu (hiện dòng kẻ dưới bài); nhãn nối từ viết `a.` ở đầu dòng nên bộ đọc hiểu thành lựa chọn câu 1 (8 dòng thành 5 câu).
- **Mô hình thiếu chỗ chứa:** nhãn chỗ trống `(a)` bị gắn số thêm `(1)`; không có kiểu số câu a, b, c; T/F không có chế độ cùng hàng với câu; Task có bài đọc chứa `___` bị tạo 3 dòng câu trống.
- Chữ trong bài, đáp án A/B/C, câu T/F, khung từ: AI chép đúng; câu 3b "They want their homes will fall…" là lỗi của đề gốc và AI giữ nguyên.
- Bài 3 của PDF không có (PDF đánh 1, 2, 4, 5) nên app đánh số 1–4; chưa hỏi người dùng đó là bài nghe bị bỏ chủ ý hay không.

**Đã làm (v100, người dùng duyệt):** (1) nhãn `(a)` không thêm số, bài đọc có `___` không có dòng câu; (2) `Số câu: a b c / ẩn` + nút ở cột trái; (3) Đúng/Sai cùng hàng (`Dạng: đúng/sai (cùng hàng)` + nút); (4) prompt `docs/PROMPT_PDF_SANG_PHIEU.md` quy tắc 16–20; `docs/QUY_UOC_MD.md`.

**Chưa làm / chờ người dùng:** tiêu đề bài đọc căn giữa; thụt đầu đoạn / căn đều hai bên; số Task theo PDF; bài 3 của PDF; cập nhật bản prompt trong thư mục project (`prompt/PROMPT_PDF_SANG_MD.txt`, ngoài git) và prompt JSON (cách A) theo quy tắc 16–20; nạp lại phiếu 7 bằng MD mới do AI tạo từ prompt v100 để thử xem AI có làm đúng quy tắc mới không (chưa thử).

## 1. Kiểm thử
`bash tests/run_all.sh` (test1–43 + audit) trên bản v100 (nền v99): **tất cả đạt**, audit 0 vấn đề, test2 (so với backup/v80) đạt. Sau khi tăng badge v100 chạy lại test31, test37, test43: đạt. test43 (mới): nạp MD phiếu 7, kiểm nhãn `(a)` không thêm số, không có dòng câu, nhãn a–h, T/F cùng hàng, khứ hồi Xuất MD, nút ở cột trái, phiếu cũ vẫn đánh `(1)(2)`.
**Chưa kiểm thử:** `tests/cmp_v80.py`; AI tạo lại MD từ prompt mới (chưa thử); trình duyệt khác Chromium.
