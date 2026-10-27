# Kế hoạch chuyển WS Editor sang React + Cloudflare

Ngày 27/10/2026. **Bản để người dùng duyệt, chưa code.** Thread thảo luận: "Thảo luận chuyển app sang React".

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
Công cụ: `tests/chuan/tao_chuan.py` (tạo) và `tests/chuan/so_chuan.py` (so), lưu kết quả vào `tests/chuan/v106/`.
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
Mục 4 đã chốt hết. Người dùng nói "làm đi" → bắt đầu bước 1.
