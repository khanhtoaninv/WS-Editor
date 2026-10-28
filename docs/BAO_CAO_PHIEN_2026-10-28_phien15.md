# Báo cáo phiên 15 (28/10/2026): GĐ2 gói .wsp (Mốc 1 xong) + Khu thử nghiệm Lớp học (Mốc 2)

## 0. BÀN GIAO (đọc đầu tiên)
- **v118 = GĐ2 xong → Mốc 1 "WS Editor hoàn chỉnh".** Xuất / mở gói phiếu tương tác `.wsp` (spec mục 49). Người dùng cho làm liền v118 → v122, kiểm từng bước trước khi sang bước sau.
- **Hai mốc** (`docs/TUONG_TAC/3_LO_TRINH.md` mục 2b): Mốc 1 = WS Editor (không phụ thuộc TeacherResource). Mốc 2 = Khu thử nghiệm Lớp học `server/` (v119 → v122), máy chủ nhỏ trên máy giáo viên để thử với học sinh thật trước khi TeacherResource có; kế hoạch `docs/KE_HOACH_LOP_HOC_THU.md`.
- **Nợ kỹ thuật mới:** N12 (chế độ quirks), N13 (khóa ký thử) trong `docs/BAN_GIAO_DEV/3_NO_KY_THUAT_VA_CHUAN_BI_DEPLOY.md`.

## 1. v118 GĐ2 gói .wsp
- Nút nổi **Gói .wsp** cạnh ▶ Chiếu; hộp gói tóm tắt, chặn (trang tràn, ảnh lỗi), cảnh báo phải tích. Ký Ed25519 + mã hóa AES-GCM, khóa bọc RSA-OAEP cho `ed` / `tr`. Mở lại gói để sửa. `shared/src/zip.ts`, `shared/src/wsp.ts`, CLI `shared/bin/wsp.ts`.
- Lỗi tìm ra khi làm: (1) trang trong gói lệch dòng kẻ 2 px vì app chạy **quirks** → gói ghi `docMode: "quirks"`; (2) trang cần `lang="vi"`; (3) luật CSS có `:not(...)` bị bỏ nhầm; (4) **lỗi có từ v111:** toast của WS Editor hiện thành khối tối cả màn hình (trùng tên lớp `.show`), đã sửa.
- Nút "Gói .wsp" ban đầu ở thanh trên làm thanh xuống 2 dòng ở 1440 px → chuyển thành nút nổi.
- **Đã kiểm thử v118** (bản cuối): `chuan.py so` 120/120; `giaodien.py --bo-moi` 2489/2497 (8 lệch đã biết từ v117); `run_all.sh` 49/49 + audit 0 lỗi; gd1a 73/73; gd1b 82/82; quét phiếu, quét làm bài 161/161; shared 26/26; test_dot1–5 đạt hết; kiem_slots đạt; `tests/gd2/test_goi.py` 402/402. Chưa kiểm: Safari / Firefox, mở gói trên máy khác (khóa `ed` nằm trong trình duyệt nên gói chỉ mở lại được trên chính máy đó).
