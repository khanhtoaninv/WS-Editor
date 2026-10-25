# WS Editor — Bàn giao v69 (25/10/2026 tối)

> File này **thay mục "AB. BÀN GIAO"** (ghi v67) ở cuối `WS_EDITOR_SPEC_v37_bo_sung.md` và bổ sung hai mục AG, AH. Thread mới: đọc file này trước, phần AB cũ chỉ còn giá trị lịch sử. Khi có dịp, gộp AG/AH vào bổ sung rồi xóa file này.

## AG. v68 — Nối Task, MD `### Phần`, nhãn, ẩn số
- **Nối vào Task trên:** `layout.break = 'join'` (cạnh auto/page/keep). Task nối không lặp G0 riêng, chạy tiếp liền Task trên (phương án B đã chốt).
- **MD:** `### Phần: <tên>` chia nhóm Task trong một file; nhãn lựa chọn viết HOA (A. B. C.).
- **Một câu duy nhất:** ẩn số thứ tự câu.
- **Prompt + quy ước MD** viết lại (`PROMPT_PDF_SANG_PHIEU.md`, `QUY_UOC_MD.md`) cho các thay đổi trên.
- Test: `test17.py`, dữ liệu `tests/md/birthday6.md`, `tests/real/birthday-user2.md`.

## AH. v69 — Font chữ phiếu
- Panel Phiếu có mục **Font chữ phiếu** với 3 lựa chọn: **Andika** (hiện tại, mặc định), **Be Vietnam Pro** (font như trong ảnh người dùng gửi), **Lexend** (thiết kế cho dễ đọc, gợi ý của Claude). Mỗi nút hiển thị bằng chính font của nó.
- Dữ liệu: `ws.font` = `'be'` | `'lexend'`; Andika không lưu (xóa trường). Font lạ khi nạp → về Andika + ghi chú "font không có trong danh sách".
- Code: bảng `FONTS`, `applyFont()` đặt biến `--f-sheet`, nạp trước chữ thường + đậm (có tiếng Việt) rồi **dàn lại trang**; `--f-ui` (giao diện) giữ Be Vietnam Pro, không đổi.
- Spec chính: mục 16.10. Test: `test18.py` (19 phép kiểm).
- **Chưa kiểm:** hình dạng chữ thật của Be Vietnam Pro / Lexend (sandbox không tải được font); chỉ kiểm cơ chế (biến CSS, dàn lại, lưu/nạp). Giả định "font trong ảnh" = Be Vietnam Pro.
- **Bản repo cần thêm:** woff2 Lexend (latin, latin-ext, vietnamese; 400 và 700) và Be Vietnam Pro 700 vào `fonts/` + khối `@font-face`; bản artifact đã dùng link Google Fonts (Andika, Be Vietnam Pro, Lexend).

## BÀN GIAO (bản v69)
- **Artifact:** https://claude.ai/artifact/7Ndsf8tt5xjidREi99Frf9 (v69, version 3).
- **Đã chạy trên bản cuối:** test1–14, 16, 17, 18 và audit đạt, 0 lỗi console, 0 tràn trang. `test15` có 3 FAIL do môi trường (bản artifact dùng link Google Fonts, sandbox không có mạng); cùng 3 FAIL trên v67 nên không phải lỗi mới. `run_all.sh` mặc định: `... test16 test17 test18 audit`.
- **Không chạy lại ở v69:** audit2, cmp_paste, ws_sea.
- **Việc tiếp theo:** P3 (thêm phiếu thật vào `tests/real/`), P4 (Ô chữ), nút "Xuất MD".
- **Còn hỏi người dùng:** cột Đúng/Sai 80/20; hướng A4 thống nhất theo Task; công tắc Họ tên/Lớp ở đầu phiếu.
- **Quy tắc đăng lại:** đọc trọn artifact (action read) trước khi publish cùng URL; nếu bị từ chối lần đầu, đọc xong thì publish lại nguyên bản.
