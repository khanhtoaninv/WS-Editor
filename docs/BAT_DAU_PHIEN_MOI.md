# Bắt đầu phiên mới — WS Editor

Cập nhật 26/10/2026 (trưa). App: **v80**. Nguồn sự thật là **git repo này**, không dùng Claude Project hay artifact nữa.

## Mở phiên mới (Claude Code, gắn repo `khanhtoaninv/WS-Editor`, nhánh `main`)
CLAUDE.md ở gốc repo tự được nạp. Dán câu này làm tin nhắn đầu:

> Đọc CLAUDE.md và docs/BAO_CAO_PHIEN_2026-10-26_phien3.md, rồi docs/KIEN_TRUC_TRINH_BAY_MOI.html. Tóm tắt trạng thái ngắn gọn và hỏi tôi muốn tiếp tục việc nào. Chưa cần làm gì cả.

## Thứ tự đọc
1. `docs/BAO_CAO_PHIEN_2026-10-26_phien3.md` — **đang ở giai đoạn thảo luận kiến trúc mới, chưa code**; quyết định đã chốt; việc tiếp theo.
2. `docs/KIEN_TRUC_TRINH_BAY_MOI.html` — bản kiến trúc để duyệt (T, Q, G); `docs/RA_SOAT_DANG_BAI.md` — rà soát 63 dạng bài.
3. `docs/BAO_CAO_PHIEN_2026-10-26.md` — v73 → v80 đã làm gì, giới hạn đã biết, việc treo.
4. `docs/WS_EDITOR_SPEC.md` + mục "BÀN GIAO" cuối `docs/WS_EDITOR_SPEC_v37_bo_sung.md` — đặc tả **của app hiện tại (v80)**.
5. Khi cần: `docs/PHUONG_AN_NHAP_FILE.md`, `docs/QUY_UOC_MD.md`, `docs/PROMPT_PDF_SANG_PHIEU.md`, `samples/`.

## Lệnh mẫu
- **Duyệt kiến trúc:** "Tôi đã xem KIEN_TRUC_TRINH_BAY_MOI.html, đây là chỗ cần sửa: …" hoặc "Lập kế hoạch làm theo bậc, chưa code."
- **Làm G4 kiểu Ảnh** (độc lập, làm được trên v80): "Ok làm G4 kiểu Ảnh."
- **Thử PDF thật (P3):** gửi PDF + MD AI tạo (theo `docs/PROMPT_PDF_SANG_PHIEU.md`) + ảnh sau khi nạp; Claude phân 5 nhóm lỗi (AI đọc sai chữ / prompt / bộ đọc / mô hình thiếu / dàn trang xấu), sửa đúng lớp, thêm vào `tests/real/`.
- **Kiểm tra hiện trạng:** "Chạy lại toàn bộ test trên bản hiện tại, chưa sửa gì."

## Cần nhớ khi sửa code
- Một file `ws-editor-prototype.html`, JS thuần, không thư viện; tăng badge `vNN`.
- Test: `bash tests/run_all.sh <mới.html> <cũ.html>`, **từng test một**, không chạy hai Chromium cùng lúc. Bản cũ để so (test2) phải có thư mục `fonts/` cạnh file. Chỉ báo "đạt" cho test đã chạy trên bản cuối.
- Cuối mỗi thay đổi lớn: cập nhật `docs/WS_EDITOR_SPEC.md`, mục bổ sung + BÀN GIAO, báo cáo phiên; commit và push lên `main`.
- Chạy app trên Windows: bấm đúp `chay.bat` (tự `git pull`).
