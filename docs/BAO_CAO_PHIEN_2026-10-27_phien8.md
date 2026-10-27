# Báo cáo phiên 27/10/2026 (phiên 8): v94 popup "+ Task"; v95–v99 Kế hoạch v95+

## 0. BÀN GIAO CHO PHIÊN SAU
**Trạng thái:** nhánh `claude/project-thread-mrntca` = **v99** (PR chờ người dùng duyệt; `main` = v94). v95–v99: mục 2 dưới, spec mục 27–31. Đặc tả: `docs/WS_EDITOR_SPEC.md` mục 26. Hình duyệt: `docs/MINH_HOA_TAO_TASK.*`, `MINH_HOA_TAO_TASK_2BUOC.*`, `MINH_HOA_TAO_TASK_1POPUP.*`.

**Diễn biến:**
1. Người dùng hỏi G1+G2 kiểu báo chí (1: chữ bao quanh ảnh; 2: 3 hàng, mỗi hàng một ô ảnh và một ô chữ). Trả lời: 1 đã có (Bố cục "Ảnh trong bài đọc", mã trong là T8); 2 cần G2 thành danh sách đoạn có ảnh riêng. Người dùng **gác lại**. Nhắc: T5 / T8 là mã trong của dữ liệu, giao diện chỉ có 4 T + 12 Q.
2. Popup "+ Task" cũ (13 công thức, nhóm "Danh sách câu", icon mã T cũ, chú thích "mục 4") không khớp kiến trúc mới. Đã vẽ 3 phương án; người dùng chọn **một popup**: trái chọn Q (trên) và T (dưới), phải xem trước lorem. Rồi bảo "làm đi".
3. Đã làm v94 (spec mục 26).

**Quyết định cần biết:** vị trí chèn mặc định vẫn **Cuối phiếu** (quy tắc cũ, test13); "Sau Task đang chọn" là lựa chọn trong popup. Nếu người dùng muốn mặc định "sau Task đang chọn" thì đổi `lnReset`.

**Chưa làm / chờ người dùng:** G2 danh sách đoạn có ảnh riêng; chi tiết trang (đầu phiếu, Họ tên / Lớp / Ngày, chân trang); bản đáp án giáo viên; P3 (PDF thật); câu hỏi 1, 2, 4 của bàn giao v84.

## 1. Kiểm thử
- `bash tests/run_all.sh` (test1–37 + audit) trên bản cuối v94: **tất cả đạt**, audit 0 vấn đề, 0 lỗi console. test2 (so với v93, có `fonts/`) đạt.
- Lỗi tìm được khi kiểm thử và đã sửa: bản xem trước dùng class `page` nên test28 (và mọi mã tìm `.page .task`) lấy nhầm Task xem trước → đổi class `lnpg`, xóa nội dung khi đóng hộp. Class `.lnT` trùng `.lnt` (chế độ quirks không phân biệt hoa thường) → đặt lại tên.
- test34 lỗi một lần rồi đạt lại khi chạy lại (không lặp lại; chưa rõ nguyên nhân, nghi do thời gian chờ).
- **Chưa kiểm thử:** `tests/cmp_v80.py` (không chạm phần dựng trang nên chưa chạy lại), trình duyệt khác Chromium, thao tác bằng bàn phím trong popup.

## 2. v95–v99: làm hết Kế hoạch v95+ (`docs/KE_HOACH_v95.md`)
Người dùng: "thực hiện tất cả các bước, xong mỗi bước phải tự kiểm thử trước khi sang bước tiếp theo". Mỗi bước một commit, một test mới.
- **v95** Q2 điểm bắt đầu / chiều dài / số hàng (spec 27, test38).
- **v96** bảng: sửa lỗi số thứ tự với dữ liệu cũ `num:false`; ô tích tùy chọn bảng + Số thứ tự ở cột trái (spec 28, test39).
- **v97** Căn lề Khối text Trái / Giữa / Phải / Hai bên cho hướng dẫn, bài đọc, khối tự do chữ; MD `Căn lề chữ:` (spec 29, test40). Đính chính với người dùng: "mã code" hiểu là **mã QR file nghe**, không phải chip Track như đã nói trước; lề phải hướng dẫn = mép trái mã QR (đã đúng sẵn, test đo).
- **v98** bảng chọn đáp án: ô tích trước chữ, tích ô đúng ở cột trái, một ô đúng mỗi hàng, bản giáo viên tô ô đúng, MD `[x]` (spec 30, test41).
- **v99** ảnh trong ô bảng: +ảnh / × từng ô, công tắc Không / Cột đầu / Mọi ô có chữ (spec 31, test42).
- **Ô chữ:** tự trải nghiệm (tạo Q11 từ popup, gõ lưới, bản giáo viên, MD, thử tìm từ). Sửa 2 lỗi rõ ràng (đếm ô / từ không cập nhật; gợi ý "mục 5" cũ). 4 vấn đề chờ quyết: `docs/TRAI_NGHIEM_O_CHU.md`.

**Kiểm thử bản cuối v99:** `bash tests/run_all.sh` (test1–42 + audit, từng test một, test2 so với v94): tất cả đạt, audit 0 vấn đề, 0 lỗi console, 0 tràn. test31, test37 chỉ đổi số badge.

**Chưa kiểm thử:** trình duyệt khác Chromium; `tests/cmp_v80.py`; bảng rất rộng (≥ 6 cột) có ảnh ở mọi ô (khung soạn cột trái cuộn ngang).
