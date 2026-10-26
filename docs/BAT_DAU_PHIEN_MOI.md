# Bắt đầu phiên mới — WS Editor

Cập nhật 26/10/2026. App: **v82** (cột trái theo khối Cấu hình · G0–G4 · G-Text, trên nền kiến trúc trình bày v81). Bản v80 lưu ở nhánh `backup/v80`. Nguồn sự thật là **git repo này**, không dùng Claude Project hay artifact nữa.

## Mở phiên mới (Claude Code, gắn repo `khanhtoaninv/WS-Editor`, nhánh `main`)
CLAUDE.md ở gốc repo tự được nạp. Dán câu này làm tin nhắn đầu:

> Đọc CLAUDE.md và docs/BAO_CAO_PHIEN_2026-10-26_phien5.md, rồi mục 18–19 của docs/WS_EDITOR_SPEC.md. Tóm tắt trạng thái ngắn gọn và hỏi tôi muốn tiếp tục việc nào. Chưa cần làm gì cả.

## Thứ tự đọc
1. `docs/BAO_CAO_PHIEN_2026-10-26_phien5.md` — v82 (cột trái theo khối); `docs/BAO_CAO_PHIEN_2026-10-26_phien4.md` — v81.
2. `docs/WS_EDITOR_SPEC.md` mục 18 (v81), mục 19 (v82) + mục "BÀN GIAO" cuối `docs/WS_EDITOR_SPEC_v37_bo_sung.md`.
3. `docs/KIEN_TRUC_TRINH_BAY_MOI.html` (bản duyệt kiến trúc), `docs/RA_SOAT_DANG_BAI.md`.
4. Khi cần: `docs/QUY_UOC_MD.md` (v81: `Dạng:` …), `docs/PROMPT_PDF_SANG_PHIEU.md` (v81), `docs/PHUONG_AN_NHAP_FILE.md`, `samples/`.

## Lệnh mẫu
- **Góp ý v81:** "Tôi đã thử bộ chọn Bố cục / Dạng câu hỏi, đây là chỗ cần sửa: …"
- **Thử PDF thật (P3):** gửi PDF + MD AI tạo (theo `docs/PROMPT_PDF_SANG_PHIEU.md` bản v81, có `Dạng:`) + ảnh sau khi nạp; Claude phân 5 nhóm lỗi (AI đọc sai chữ / prompt / bộ đọc / mô hình thiếu / dàn trang xấu), sửa đúng lớp, thêm vào `tests/real/`.
- **Kiểm tra hiện trạng:** "Chạy lại toàn bộ test trên bản hiện tại, chưa sửa gì."

## Cần nhớ khi sửa code
- Một file `ws-editor-prototype.html`, JS thuần, không thư viện; tăng badge `vNN`.
- Test: `bash tests/run_all.sh <mới.html> <cũ.html>` và `python3 tests/cmp_v80.py <mới.html> <v80.html>` (phiếu cũ phải giống v80), **từng test một**, không chạy hai Chromium cùng lúc. Bản cũ để so (test2) phải có thư mục `fonts/` cạnh file. Chỉ báo "đạt" cho test đã chạy trên bản cuối.
- Cuối mỗi thay đổi lớn: cập nhật `docs/WS_EDITOR_SPEC.md`, mục bổ sung + BÀN GIAO, báo cáo phiên; commit và push lên `main`.
- Chạy app trên Windows: bấm đúp `chay.bat` (tự `git pull`).
