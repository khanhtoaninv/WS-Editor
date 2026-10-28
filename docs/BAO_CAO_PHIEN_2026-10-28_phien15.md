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

## 2. v119 Khu thử nghiệm Lớp học: phiên học (spec mục 50)
- `server/` (Node ≥ 22.6, không gói npm, JSON), `npm run lop` hoặc bấm đúp `chay-lop.command` / `chay-lop.bat`; hướng dẫn `server/README.md`. Giao diện React `app/src/lop/` → `server/public/lop.html` (build riêng `vite.lop.config.ts`, chạy cùng `npm run build`).
- Giáo viên: Lớp / Gói phiếu / Phiên học (mã + QR, theo dõi trực tiếp, Mở khóa, Kết thúc phiên thu bài). Học sinh: mã → tên → làm (tự lưu) → Nộp. WS Editor mở qua `/editor` có "Gửi lên lớp thử".
- Lỗi tìm ra khi test: (1) gửi lại cùng phiếu tạo 2 gói: do test nạp phiếu 2 lần (mỗi lần mã phiếu mới), sửa test cho gửi 2 lần trong cùng một lần mở; (2) trang học sinh báo lỗi 401 ở console khi chưa vào phiên → thêm `/api/hs/toi`; (3) **điện thoại: thanh công cụ tràn, nút Nộp bị đẩy ra ngoài màn hình** → thanh xuống dòng, Task rộng hết màn hình.
- **Người dùng dừng ở v119 để tự thử** ("Lúc nào xong bản 19 thì ngừng, để tôi test"). Phần v120–v122 (chấm chữa, báo cáo, insight AI) đã viết và một phần đã test riêng (`shared/test/baocao.test.ts` 4/4, test API chấm chữa đạt) nhưng **chưa đưa vào repo**; bản nháp nằm ngoài repo, phiên sau viết lại / đưa vào theo `docs/KE_HOACH_LOP_HOC_THU.md`. Trong repo đã có `shared/src/baocao.ts` + test (dùng ở v121).
- Thử tay: `docs/TUONG_TAC/KIEM_TRA_LOP_THU_V119.md`.
- **Đã kiểm thử v119** (bản cuối): `chuan.py so` 120/120; `giaodien.py --bo-moi` 2489/2497 (8 lệch đã biết); `run_all.sh` 49/49 + audit 0; gd1a 73/73; gd1b 82/82; quét phiếu / làm bài 161/161; shared 26/26; test_dot1–5 đạt; kiem_slots đạt; gd2 402/402; `npm run test:lop` 2/2; `tests/lop/test_lop.py` 18/18 (giáo viên + 3 học sinh, một em trên điện thoại 390 px, 0 lỗi console). Chưa kiểm: điện thoại / máy tính bảng thật qua wifi, Windows (`chay-lop.bat`), nhiều hơn 3 học sinh cùng lúc trên trình duyệt thật.
