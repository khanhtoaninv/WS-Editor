# Báo cáo phiên 11 — 27/10/2026: bắt đầu chuyển sang React + Cloudflare

## 0. BÀN GIAO (đọc trước)

**Việc của phiên này: chuyển app sang React.** Kế hoạch đầy đủ + tiến độ: `docs/KE_HOACH_REACT.md` (mục 8 là phần quan trọng nhất: đã làm gì, cách làm từng mảnh, còn gì).

Trạng thái cuối phiên:
- Bản đang dùng: **`ws-editor.html`** (badge **v107**) — dựng từ `app/` bằng Vite, **một file**, mở bằng bấm đúp, font lấy từ `fonts/`. Tính năng y hệt v106.
- Bản cũ: `ws-editor-prototype.html` (v106) vẫn giữ nguyên để so sánh; nhánh `backup/v106`. `chay.bat` giờ mở bản React, `chay-v106.bat` mở bản cũ.
- Đã xong: bước 1 (đường chuẩn), bước 2 (Vite + tách lõi), bước 3 mảnh 1–6 (toàn bộ khung app và mọi hộp thoại là React).
- Còn lại: nội dung ba cột (inspector, cột trái soạn bài, trang xem trước) vẫn do bộ dựng HTML cũ sinh ra; xem `docs/KE_HOACH_REACT.md` mục 8.3.
- **Đóng băng tính năng** cho tới khi chuyển xong. Lỗi nặng thì sửa ở cả hai bản.

Kiểm thử sau mỗi mảnh (bắt buộc, chạy từng cái một):
```
cd app && npm install && npm run build        # → ../ws-editor.html
python3 tests/chuan/chuan.py so ws-editor.html        # phải 120/120, ALL OK
bash tests/run_all.sh ws-editor.html ws-editor-prototype.html
```
File đem test **phải nằm cạnh thư mục `fonts/`** (để ở chỗ khác thì font không tải được, dàn trang lệch và đường chuẩn fail hàng loạt — đã mất một lần chạy vì việc này).
Đang chạy test trên `ws-editor.html` thì đừng build đè lên nó: dùng `WS_OUT=/đường/dẫn/khác.html npm run build`.

## 1. Đã làm

### Bước 1 — đường chuẩn (`tests/chuan/`)
`cmp_v80.py` cũ so chuỗi HTML nên không dùng được cho React. Công cụ mới `tests/chuan/chuan.py` so 4 lớp trên 24 phiếu × 5 biến thể = 120 lần dàn trang: dữ liệu sau khi nạp, MD xuất ra, hình học từng phần tử (vị trí + kích thước + chữ), ảnh từng trang.
Kiểm chứng độ nhạy: đổi cỡ chữ hướng dẫn từ `.92em` thành `.93em` → 110/120 lần phát hiện lệch.

### Bước 2 — dự án Vite và tách phần lõi
- `app/`: Vite 8 + TypeScript + `vite-plugin-singlefile` → `ws-editor.html` một file.
- `app/scripts/cau-noi.ts`: gắn mọi tên cấp cao nhất của `legacy` / `core` lên `window`, nhờ vậy **49 test cũ chạy nguyên không phải sửa**.
- `app/src/core/`: `model` (bù trường, mặc định), `layout` (dựng HTML Task, đo, chia trang), `md` (đọc/xuất MD + JSON), `state` (phiếu `ws`, đổi qua `setWs`). Tách **tự động, nguyên văn** bằng `app/scripts/tach-core.mjs` + phân tích phụ thuộc có xét phạm vi `app/scripts/phu-thuoc.mjs`.

### Bước 3 — giao diện React (`app/src/ui/`, React 19 + Zustand)
Thanh trên cùng, hộp Thao tác nhanh, hộp Xem JSON / Xuất MD, hộp hỏi xác nhận, thông báo, thanh kéo cột trái, popup "+ Task" / "+ Phiếu", hộp Dán nhiều dòng, hộp ảnh, khung app ba cột.
`index.html` giờ chỉ còn `<head>`, các ô gắn React và vài `<input type=file>` ẩn.

## 2. Bẫy đã gặp (ghi lại để khỏi vấp lại)
1. Test cũ đổi ô nhập bằng `el.value = …; dispatchEvent(new Event('change'))` — sự kiện **không nổi bọt**, React không nhận. Phải gắn listener gốc ngay trên phần tử (ô Độ tuổi). `test20` bắt được.
2. Hàm cũ chuyển sang `src/ui` mà test gọi trên `window` (`askConfirm`, `toast`, `LW_DEF`…) phải gắn lại trong `src/ui/mount.tsx`. `test35` bắt được.
3. `publish()` dùng `flushSync` vì code cũ và test đọc DOM ngay sau `render()`.
4. `<dialog>` mở / đóng trong `useLayoutEffect` để kịp trong `flushSync`.
5. Gán vào biến đã chuyển thành `import` thì bộ dựng báo lỗi (`ws` trong `loadSheet` phải đổi sang `setWs`).
6. `test34`, `test45` chập chờn theo thời gian chờ ở **cả** v106 lẫn bản mới; hỏng thì chạy lại riêng.
7. Không đẩy được tag lên repo (máy chủ chặn) → mốc v106 lưu bằng **nhánh** `backup/v106`.

## 3. Việc tiếp theo
Theo `docs/KE_HOACH_REACT.md` mục 8.3: chuyển nội dung inspector → cột trái soạn bài → trang xem trước sang JSX, mỗi khối một lần, chạy lại đường chuẩn + test sau mỗi khối. Xong bước 3 thì tới bước 4 (người dùng trải nghiệm local), rồi mới tới Cloudflare (mục 5 của kế hoạch).
