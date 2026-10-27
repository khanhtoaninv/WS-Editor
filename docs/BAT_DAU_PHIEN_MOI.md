# Bắt đầu phiên mới — WS Editor

Cập nhật 27/10/2026 (phiên 8). App: **v101** (điền từ vào đoạn văn bằng câu hỏi, ô câu nhiều dòng, T/F căn dọc; spec mục 33; báo cáo `docs/BAO_CAO_PHIEN_2026-10-27_phien10.md`). Trước đó **v100** (thử phiếu thật 7: nhãn `(a)`, `Số câu: a b c`, T/F cùng hàng, spec mục 32; báo cáo `docs/BAO_CAO_PHIEN_2026-10-27_phien9.md`). Trước đó **v99** (v95–v99 làm hết Kế hoạch v95+, spec mục 27–31; Ô chữ: `docs/TRAI_NGHIEM_O_CHU.md`). Trước đó v94 (popup "+ Task" chọn Q rồi T, spec mục 26; báo cáo `docs/BAO_CAO_PHIEN_2026-10-27_phien8.md`). Trước đó v93 (đáp án đúng ngay trong khung soạn cho mọi dạng Q, spec mục 24). Trước đó v86 (sửa theo `docs/DANH_SACH_VIEC_v85.md`: Fit ảnh thứ hai / ảnh khung từ, bỏ "Khối của bài", G3 có thanh B I U, khoảng cách mặc định Gọn…; trên nền v84 và kiến trúc trình bày v81). Bản v80 lưu ở nhánh `backup/v80`. Nguồn sự thật là **git repo này**, không dùng Claude Project hay artifact nữa.

## Mở phiên mới (Claude Code, gắn repo `khanhtoaninv/WS-Editor`, nhánh `main`)
CLAUDE.md ở gốc repo tự được nạp. Dán câu này làm tin nhắn đầu:

> Đọc CLAUDE.md và mục 0 "BÀN GIAO" của docs/BAO_CAO_PHIEN_2026-10-27_phien10.md, rồi mục 18–33 của docs/WS_EDITOR_SPEC.md. Tóm tắt trạng thái ngắn gọn và hỏi tôi muốn tiếp tục việc nào. Chưa cần làm gì cả.

## Thứ tự đọc
0. `docs/BAO_CAO_PHIEN_2026-10-26_phien7.md` mục 0 — bàn giao (trạng thái v92). `docs/BAO_CAO_PHIEN_2026-10-26_phien6.md` mục 0 — v86 + `docs/DANH_SACH_VIEC_v85.md`. Trước đó `docs/BAO_CAO_PHIEN_2026-10-26_phien5.md` (v82–v84, 4 câu hỏi còn chờ). `docs/VAN_DE_CAN_XU_LY.md` — lịch sử vấn đề V1–V10 (đã làm trong v83).
1. `docs/BAO_CAO_PHIEN_2026-10-26_phien5.md` — v82–v84; `docs/BAO_CAO_PHIEN_2026-10-26_phien4.md` — v81.
2. `docs/WS_EDITOR_SPEC.md` mục 18 (v81), mục 19 (v82), mục 20 (v83), mục 21 (v84), mục 22 (v85), mục 23 (v86), mục 24 (v87–v92), mục 25 (v93) + mục "BÀN GIAO" cuối `docs/WS_EDITOR_SPEC_v37_bo_sung.md`.
3. `docs/KIEN_TRUC_TRINH_BAY_MOI.html` (bản duyệt kiến trúc), `docs/RA_SOAT_DANG_BAI.md`.
4. Khi cần: `docs/QUY_UOC_MD.md` (v81: `Dạng:` …), `docs/PROMPT_PDF_SANG_PHIEU.md` (v81), `docs/PHUONG_AN_NHAP_FILE.md`, `samples/`.

## Lệnh mẫu
- **Góp ý v92:** "Tôi đã thử v92, đây là chỗ cần sửa: …" (Claude tái hiện, phân tích, chờ "ok làm")
- **Thử PDF thật (P3):** gửi PDF + MD AI tạo (theo `docs/PROMPT_PDF_SANG_PHIEU.md` bản v81, có `Dạng:`) + ảnh sau khi nạp; Claude phân 5 nhóm lỗi (AI đọc sai chữ / prompt / bộ đọc / mô hình thiếu / dàn trang xấu), sửa đúng lớp, thêm vào `tests/real/`.
- **Kiểm tra hiện trạng:** "Chạy lại toàn bộ test trên bản hiện tại, chưa sửa gì."

## Cần nhớ khi sửa code
- Trên cloud: `pip install playwright==1.63.0` trước khi chạy test (Chromium có sẵn).
- Một file `ws-editor-prototype.html`, JS thuần, không thư viện; tăng badge `vNN`.
- Test: `bash tests/run_all.sh <mới.html> <cũ.html>` và `python3 tests/cmp_v80.py <mới.html> <v80.html>` (phiếu cũ phải giống v80), **từng test một**, không chạy hai Chromium cùng lúc. Bản cũ để so (test2) phải có thư mục `fonts/` cạnh file. Chỉ báo "đạt" cho test đã chạy trên bản cuối.
- Cuối mỗi thay đổi lớn: cập nhật `docs/WS_EDITOR_SPEC.md`, mục bổ sung + BÀN GIAO, báo cáo phiên; commit và push lên `main`.
- Chạy app trên Windows: bấm đúp `chay.bat` (tự `git pull`).
