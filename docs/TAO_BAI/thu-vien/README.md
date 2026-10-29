# Thư viện chuẩn cho module Tạo bài

Trạng thái: bản nháp cấu trúc (Bước 2), 29/10/2026. Chưa file nào "Đã duyệt".

## 1. Hai nhóm tài liệu

**Nhóm lesson** (mỗi lesson đúng 2 file, người dùng viết ở bên ngoài, admin nạp):
| File | Nội dung | Mẫu trống |
|---|---|---|
| `kien-thuc.md` | mục tiêu, cấp độ, nội dung, phạm vi, từ vựng cho phép, nhân vật và cảnh | `lesson-mau-trong/kien-thuc.md` |
| `trinh-tu-lesson.md` | các bước, vai trò, Task, dạng Q, số câu, quy tắc ra đề, nhãn và chỉ dẫn mẫu, ảnh/audio, tiêu chí kiểm định, đáp án | `lesson-mau-trong/trinh-tu-lesson.md` |

Trình tự chung (theo chuyên mục × cấp độ) chỉ là tài liệu người dùng dùng khi soạn Trình tự Lesson, **không** thuộc thư viện và hệ thống không đọc nó. Vì vậy Trình tự Lesson phải tự đủ.

**Nhóm hệ thống** (5 file, viết một lần, dùng cho mọi lesson; xây ở Bước 3):
| # | File | Việc | Gốc có sẵn |
|---|---|---|---|
| 1 | `he-thong/01-quy-tac-md.md` | cách AI viết MD cho app, các bẫy đã gặp | `docs/QUY_UOC_MD.md`, `docs/PROMPT_PDF_SANG_PHIEU.md`, prompt v116 |
| 2 | `he-thong/02-doi-chieu-dang-q.md` | tên dạng bài ↔ 12 dạng Q, dạng nào cần ảnh/audio | `QUY_UOC_MD.md` mục 2b |
| 3 | `he-thong/03-quy-tac-hinh-thuc.md` | đen trắng, Task trọn trang, mô tả ảnh, script audio | chưa có |
| 4 | `he-thong/04-rubric-kiem.md` | tiêu chí kiểm chất lượng | `RUBRIC_KIEM_v0.md`, hai bản đánh giá |
| 5 | `he-thong/05-phieu-mau.md` | phiếu mẫu đã duyệt (giọng, mức khó) | `tests/md/sinh-thu-movers-grammar-v2.md` |

## 2. Quy ước chung cho mọi file
- Đầu mỗi file có khối thông tin: `Mã`, `Phiên bản` (số, vd 1.0), `Trạng thái` (Nháp / Đang duyệt / Đã duyệt), `Người soạn`, `Ngày`.
- Chỉ file **Đã duyệt** mới được dùng để sinh bài thật. Sửa file thì tăng phiên bản; phiếu đã sinh ghi phiên bản các file đã dùng.
- Chỗ do Claude đề xuất chưa được người dùng duyệt gắn nhãn `[ĐỀ XUẤT]`. Duyệt xong thì gỡ nhãn.
- Viết tiếng Việt cho phần mô tả, tiếng Anh cho nội dung bài và chỉ dẫn in trên phiếu.

## 3. Mỗi lần gọi AI gửi gì (nhớ: không gửi cả 7 file mỗi lần)
| Việc | Gửi |
|---|---|
| Dựng dàn ý | Kiến thức, Trình tự Lesson, 02 |
| Sinh một Task | Kiến thức, đoạn Trình tự Lesson của Task, 01 (phần dạng Q đó), 02, 03, 05, dàn ý đã duyệt, tóm tắt Task kế bên |
| Kiểm một Task | 04, Kiến thức, Task cần kiểm |
Phần ổn định (01, 02, 03, 05, 04) đặt lên đầu để dùng được bộ nhớ đệm prompt.

## 4. Lộ trình
- Bước 2 (đang làm): cấu trúc này, hai mẫu trống, bộ Grammar Movers tách thành hai file.
- Bước 3: xây 5 file hệ thống, thử trên Grammar Movers, thêm một lesson khác loại, duyệt từng file.
- Bước 4: kế hoạch xây hệ thống.
