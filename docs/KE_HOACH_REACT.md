# Kế hoạch chuyển WS Editor sang React + Cloudflare

Ngày 27/10/2026. Đã duyệt; **đang thực hiện** (tiến độ ở mục 8). Thread thảo luận: "Thảo luận chuyển app sang React".

## 0. Hiện trạng (đã kiểm tra trong code)
- v106, một file `ws-editor-prototype.html`: 7.905 dòng, ~329 hàm, CSS ~850 dòng, 2 khối `<script>`.
- 49 test Playwright (`tests/test1–49.py`, `audit.py`) + `tests/cmp_v80.py` (so HTML từng trang với bản cũ trên mọi phiếu trong repo).
- Dàn trang đo DOM thật (62 chỗ đo chiều cao/kích thước) rồi mới cắt trang.
- Ảnh nhúng thẳng vào JSON (data URL). Không có tự lưu phiếu; `localStorage` chỉ giữ cài đặt (preset, mục đóng/mở, độ rộng cột trái, bật mã).
- Chạy local: `chay.bat` → `git pull` → mở file HTML bằng trình duyệt (`file://`), không cần cài gì ngoài Git.

## 1. Mục tiêu và nguyên tắc
- Chuyển xong rồi mới làm tính năng mới. Phiếu cũ phải dàn trang **giống hệt** v106.
- **Đóng băng tính năng** trong lúc chuyển: v106 chỉ sửa lỗi nặng; lỗi nào sửa thì sửa ở cả hai bản và thêm phiếu tái hiện vào đường chuẩn.
- Mỗi bước có điều kiện "xong" đo được. Chưa đạt thì không sang bước sau.
- Giữ nguyên hình dạng JSON phiếu trong suốt quá trình chuyển (file cũ mở được, đường chuẩn so được).
- Trước khi bắt đầu: gắn tag `v106` và tạo nhánh `backup/v106`.

## 2. Các bước

### Bước 1. Chốt đường chuẩn (không đụng code app)
Lý do: `cmp_v80.py` so **chuỗi HTML**, mà React sinh HTML khác (thứ tự thuộc tính, class, thẻ bọc) dù hiển thị giống hệt. Cần chuẩn không phụ thuộc cách viết HTML.
Với mỗi phiếu (demo, `samples/`, `tests/*.json`, `tests/md/`, `tests/real/`), lưu từ v106:
1. **Dữ liệu sau khi nạp**: JSON của `ws` (bắt lỗi bộ đọc MD/JSON).
2. **Hình học dàn trang**: số trang; mỗi trang mỗi khối (G0–G4, G-Text, từng câu, ô bảng) có vị trí, kích thước (mm, làm tròn 0,1) và chữ bên trong.
3. **Ảnh chụp từng trang** (so pixel, cho phép lệch rất nhỏ do khử răng cưa).
4. **MD/JSON xuất ra** từ phiếu đó (bắt lỗi bộ xuất).
Công cụ (đã làm): `tests/chuan/chuan.py tao|so`, kết quả ở `tests/chuan/v106/` (xem `tests/chuan/README.md`).
**Xong khi:** chạy `so_chuan.py` v106 với chính nó đạt 100%, hai lần chạy liên tiếp cho cùng kết quả.

### Bước 2. Tách phần không giao diện thành module (vẫn là HTML chạy được)
Tách ra các phần thuần dữ liệu, không đụng DOM:
- `model`: cấu trúc phiếu, Task, giá trị mặc định, chuyển đổi bản cũ (T1–T9/A1–A8).
- `md`: đọc MD (`readMd`), đọc JSON, xuất MD/JSON.
- `layout`: thuật toán xếp trang, nhận "số đo" từ ngoài vào (để chạy được ở cả bản cũ và React).
App vẫn là một file HTML khi chạy (gộp module lại khi build), `chay.bat` vẫn dùng được.
**Cầu nối test:** 55 file test gọi thẳng `ws`, `readMd`, `loadSheet`, `render`, `clone`, `SAMPLE2`… Giữ đúng các tên này trên `window` để **49 test chạy nguyên không sửa** ở mọi bước.
**Xong khi:** 49 test + `so_chuan.py` đạt 100%, 0 lỗi console.

### Bước 3. Dựng React + Vite + TypeScript, chuyển giao diện từng mảnh
Thứ tự (từ ít rủi ro đến nhiều): khung app và thanh trên → cột trái (cài đặt phiếu) → popup "+ Task" → khung soạn từng dạng Q (12 kiểu) → trang xem trước A4 và cắt trang → nhập/xuất file, kéo tay (T/F, Q2…).
- Dàn trang đo DOM nên chạy **sau khi React vẽ xong và font tải xong** (`document.fonts.ready`), gọi module `layout` của bước 2.
- Giữ nguyên khóa `localStorage` để giáo viên không mất cài đặt.
- Hoàn tác (undo) giữ hành vi như cũ.
**Xong mỗi mảnh khi:** 49 test + `so_chuan.py` đạt trên bản React; ảnh chụp mảnh đó được người dùng xem.

### Bước 4. Thay bản cũ
- Người dùng trải nghiệm bản React ở local (mục 3) với phiếu thật của mình ít nhất vài ngày.
- Khi khớp hết: bản React thành bản chính, `ws-editor-prototype.html` cũ chuyển vào `legacy/` (vẫn mở được), `backup/v106` giữ nguyên.
**Xong khi:** người dùng xác nhận, toàn bộ test đạt trên bản cuối.

## 3. Chạy local trước khi lên Cloudflare
Lưu ý kỹ thuật: bản Vite thông thường **không mở được bằng bấm đúp** (`file://` chặn module JS). Hai cách:
- **(Đề xuất) Build ra một file HTML duy nhất** (plugin gộp file), commit file đã build vào repo. `chay.bat` giữ gần như cũ: `git pull` rồi mở file. Người dùng không cần cài Node.
- Hoặc cài Node.js một lần, `chay.bat` chạy server nhỏ và mở `localhost`.
Bản local và bản Cloudflare là **cùng một bản build**, nên thử ở local là thử đúng thứ sẽ lên mạng.

## 4. Quyết định
| Việc | Đề xuất | Trạng thái |
|---|---|---|
| Ngôn ngữ | TypeScript (12 kiểu Q, 4 kiểu T, TS bắt lỗi sai kiểu khi chuyển) | **đã chốt** (27/10) |
| Store | Zustand, giữ nguyên hình dạng JSON | **đã chốt** (27/10) |
| Chạy local | build một file, không cần Node | **đã chốt** (27/10) |
| Tài khoản | trước mắt không đăng nhập, một tài khoản admin dùng chung | **đã chốt** |

## 5. Sau khi chuyển xong: Cloudflare
- **Giai đoạn A** — đưa app lên mạng cho team: Cloudflare Pages (tự build khi push `main`). Không đăng nhập nên **đặt sau Cloudflare Access hoặc mật khẩu chung**, không thì ai có link cũng dùng được.
- **Giai đoạn B** — lưu phiếu trên mạng: Workers + D1 (phiếu) + R2 (ảnh). Ảnh tách khỏi JSON, JSON giữ đường dẫn; vẫn nhập/xuất được file JSON có ảnh nhúng. Thêm trường `ownerId` (mặc định `"admin"`) **ở giai đoạn này, không thêm trong lúc chuyển** để không làm lệch đường chuẩn. Thử local bằng Wrangler (giả lập D1, R2) trước khi lên mạng.
- **Giai đoạn C** — đăng nhập từng giáo viên (Cloudflare Access hoặc tự làm), phân quyền phiếu.

## 6. Rủi ro chính
1. Dàn trang lệch vài phần mm do thứ tự vẽ khác → cắt trang khác. Chặn bằng đường chuẩn hình học + ảnh (bước 1).
2. Test phụ thuộc biến toàn cục → cầu nối test (bước 2).
3. Kéo tay và ô nhập nhiều dòng hành xử khác trong React → chuyển sau cùng, test riêng.
4. Thời gian (ước lượng thô, chưa đo): bước 1 ~1 phiên, bước 2 ~2–3 phiên, bước 3 ~4–6 phiên, bước 4 ~1 phiên + thời gian người dùng trải nghiệm.

## 7. Việc tiếp theo
Tiếp bước 3 theo mục 8.3.

## 8. Tiến độ (cập nhật mỗi phiên)

### 8.1 Đã xong (27/10/2026)
| Bước | Kết quả | Kiểm thử |
|---|---|---|
| Mốc | nhánh `backup/v106` (= commit 3d9470a). Tag `v106` **không đẩy được** (máy chủ chặn đẩy tag), dùng nhánh thay. | |
| 1 | `tests/chuan/` — 24 phiếu × 5 biến thể = 120 lần dàn trang; so dữ liệu sau nạp, MD xuất ra, hình học từng phần tử, ảnh từng trang | v106 tự khớp 120/120 hai lần; đổi cỡ chữ hướng dẫn 1 % → 110/120 lệch (đủ nhạy). 49 test cũ đạt trên v106, audit 0 lỗi |
| 2a | `app/` (Vite 8 + TypeScript 7 + vite-plugin-singlefile): `npm run build` → `ws-editor.html` một file ở gốc repo (mở bằng bấm đúp, font từ `fonts/`). Tách nguyên văn bằng `app/scripts/tach_v106.py`. Cầu nối test `app/scripts/cau-noi.ts`: gắn mọi tên cấp cao nhất lên `window` | 120/120; 49/49 (test31/37/49 đổi kiểm tra badge `== v106` thành `≥ v106`) |
| 2b | `app/src/core/`: `model` (60 tên), `layout` (129), `md` (82), `state` (`ws`, chỉ đổi qua `setWs`). Tách tự động, nguyên văn: `app/scripts/tach-core.mjs` + phân tích phụ thuộc có xét phạm vi `app/scripts/phu-thuoc.mjs` | 120/120; 49/49 |
| 3 mảnh 1 | Thanh trên cùng + hộp "Thao tác nhanh" → React (`app/src/ui/TopBar.tsx`), kho Zustand `app/src/ui/store.ts`, hành động `app/src/ui/actions.ts` | ảnh thanh trên giống v106; thao tác tay giống hệt |
| 3 mảnh 2 | Hộp "Xem JSON / Xuất MD" + hộp hỏi xác nhận `askConfirm` → React (`app/src/ui/Dialogs.tsx`). Nút "Nạp phiếu này" trong hộp JSON của v106 không bao giờ hiện → bỏ | mở / đóng / Esc / bấm ngoài / sao chép / hỏi xác nhận giống hệt v106. Mảnh 1+2 trên bản cuối: 120/120; 49/49; audit 0 lỗi |

Badge bản dựng Vite: **v107** (cùng tính năng v106, khác cách dựng).

### 8.2 Cách làm đã chốt khi chuyển một mảnh giao diện sang React
1. Thay khối HTML trong `app/index.html` bằng chỗ gắn `<div id="r-…" style="display:contents">` (không thêm hộp bọc, CSS grid / flex giữ nguyên).
2. Component giữ **nguyên id, class, chữ** như v106 (CSS và test cũ dùng được).
3. Mọi chỗ legacy ghi vào DOM của mảnh đó → `publish({...})` (kho Zustand). `publish` dùng `flushSync`: React vẽ xong trước khi hàm trả về, vì code cũ và test đọc DOM ngay sau `render()`.
4. Nút bấm → `actions.x()`; legacy đăng ký `actions.x = …` thay cho `getElementById(...).onclick`.
5. `<dialog>` mở / đóng trong `useLayoutEffect` (chạy ngay trong `flushSync`).
6. Ô nhập mà test cũ đổi bằng `el.value = …; dispatchEvent(new Event('change'))` (sự kiện **không nổi bọt**): React không nhận, nên gắn listener gốc ngay trên phần tử (xem ô Độ tuổi trong `TopBar.tsx`). Test20 đã bắt được lỗi này.
7. Hàm cũ chuyển sang `src/ui` mà test gọi trên `window` (vd. `askConfirm`) → gắn lại trong `src/ui/mount.tsx`.
8. Mỗi mảnh: `npm run typecheck`, `npm run build`, `python3 tests/chuan/chuan.py so ws-editor.html`, `bash tests/run_all.sh ws-editor.html ws-editor-prototype.html`, so ảnh mảnh đó với v106. **Không build ra `ws-editor.html` khi test đang chạy trên nó** (dùng `WS_OUT=…`).

### 8.3 Còn lại của bước 3 (theo thứ tự đề xuất)
- Thông báo (toast), độ rộng cột trái (`#lsplit`).
- Popup "+ Task" (`#libDlg`), hộp dán nhiều dòng (`#pasteDlg`), hộp ảnh (`#genDlg`).
- Inspector (cột phải, `renderInspector`).
- Cột trái soạn bài (`renderTree`, các khung soạn `edHtml` của 12 dạng Q) — phần lớn nhất (~1.500 dòng, nhiều hàm bị "vá" chồng qua các bản v81–v85).
- Trang xem trước A4 (`drawPages`), tay kéo, đường dóng. Ghi chú: HTML các trang do `core/layout` dựng; có thể giữ nguyên chuỗi HTML này trong React (an toàn nhất cho đường chuẩn) và chỉ chuyển phần tay kéo / chọn.
- Khi hết legacy: chuyển dần `core/*.js` sang `.ts` có kiểu.

### 8.4 Lưu ý về test
- `test34` và `test45` **chập chờn** (phụ thuộc thời gian chờ): hỏng khi máy bận, chạy lại đạt — ở cả v106 lẫn bản Vite. Khi hỏng, chạy riêng lại trước khi kết luận.
- `tests/cmp_v80.py` cũ nạp MD có dòng tên / tuổi bằng `J.sheet` (luôn `null` với MD) nên thực ra không nạp các phiếu MD đó. `tests/chuan/chuan.py` nạp như nút "+ Phiếu".
