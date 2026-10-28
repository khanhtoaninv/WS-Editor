# Bàn giao dev 2: Quy trình phát hành và đồng bộ

## 1. Bản mẫu phát hành thế nào
- Mỗi bản có **số** (badge `vNN` góc trái app, `#verBadge`) và một **mục spec** trong `docs/WS_EDITOR_SPEC.md` mô tả hành vi mới, cộng **báo cáo phiên** `docs/BAO_CAO_PHIEN_*.md` (mục 0 = bàn giao: đã làm gì, đã kiểm gì, chưa kiểm gì).
- Mỗi tính năng có: mô tả hành vi (spec), phiếu mẫu (`tests/gd0/phieu-kiem-thu-tay.md`, `tests/real/`, `samples/`), kết quả mong đợi (test Playwright tương ứng, ảnh chụp).
- Mọi thay đổi đẩy lên nhánh `main` của repo này. Ghi chú thay đổi = các mục spec mới kể từ bản dev đã đồng bộ lần trước.

## 2. Dev đồng bộ một bản mới
1. `git log` từ bản đã đồng bộ; đọc các mục spec mới + mục 0 báo cáo phiên.
2. Chạy bộ kiểm trên **bản mẫu** để có kết quả gốc, rồi trên **bản dev** (cùng phiếu, cùng cỡ cửa sổ):
   - `python3 tests/chuan/chuan.py so <app.html>`: 24 phiếu × 5 biến thể = 120 lần dàn trang; so dữ liệu sau nạp, MD xuất ra, hình học từng phần tử, ảnh từng trang với chuẩn `tests/chuan/v117/` (xem file 3 mục 2 về chuẩn hiện hành).
   - `python3 tests/chuan/giaodien.py <app.html> ws-editor-prototype.html`: so DOM cột trái / phải ở 2.497 trạng thái (lệch có chủ đích từ v113: xem báo cáo phiên 14).
   - `cd shared && npm test`: máy chấm (TeacherResource phải cho cùng kết quả). Mẫu bài làm + kết quả: `shared/fixtures/`.
   - `bash /đường/dẫn/tuyệt/đối/tests/run_all.sh <mới.html> <cũ.html>` (49 test + audit), `tests/gd1a/test_chieu.py`, `tests/gd1b/test_lambai.py`, `tests/gd1a/quet_phieu.py`, `tests/gd1b/quet_lambai.py`, `tests/sau_kiem_thu/test_dot1.py` … `test_dot5.py`, `python3 tests/gd2/test_goi.py <app.html>` (xuất gói `.wsp` cho 24 phiếu, 402 kiểm tra; cần `shared/`). Khu thử nghiệm Lớp học (chỉ khi dev cần xem lại luồng): `bash tests/lop/run.sh` (API 5 test + `test_lop.py` 18 + `test_cham.py` 45, cần bản dựng `npm run build` có `server/public/lop.html`).
3. Lệch chuẩn mà **không** có trong ghi chú thay đổi = lỗi của bản dev (hoặc báo lại cho bản mẫu nếu nghi bản mẫu sai).
4. Bộ kiểm cần các test gọi được hàm toàn cục (`loadSheet`, `impSheetObj`, `readMd`, `sheetSlots`, `commit`, `ws`…): bản mẫu gắn mọi tên cấp cao lên `window` (`app/scripts/cau-noi.ts`). Bản dev nên giữ một **cầu nối kiểm thử** tương đương (chỉ bật ở bản kiểm thử), nếu không bộ kiểm không chạy được.

## 3. Dev góp ý / báo lỗi
- Mỗi góp ý = mô tả ngắn + **phiếu tái hiện** (MD hoặc JSON) + kết quả thấy / kết quả mong đợi (+ ảnh nếu là hình).
- Đề xuất đổi hành vi: gửi người dùng duyệt trước (người dùng quyết định hành vi). Bản mẫu cập nhật spec + test, phát hành số mới; dev đồng bộ theo mục 2.
- Tối ưu không đổi hành vi (hiệu năng, tách mã, đổi thư viện nội bộ): dev tự làm, chỉ cần qua bộ kiểm.

## 4. Lưu ý khi chạy bộ kiểm
- Playwright Python phải đúng bản với Chromium đã cài (máy làm bản mẫu: `playwright==1.63.0`).
- Chạy **từng test một**, không chạy hai Chromium cùng lúc (ảnh chụp và đo hình lệch).
- `run_all.sh` cần đường dẫn tuyệt đối (script tự `cd tests`).
- Cửa sổ 1920×1080; font lấy từ `fonts/` cạnh file HTML.
