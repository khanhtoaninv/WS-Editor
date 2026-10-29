# Thư viện chuẩn cho module Tạo bài

Trạng thái: bản nháp cấu trúc (Bước 2), 29/10/2026. Chưa file nào "Đã duyệt".

## 1. Hai nhóm tài liệu

**Nhóm lesson** (mỗi lesson đúng 3 file, người dùng viết ở bên ngoài, admin nạp):
| File | Nội dung | Mẫu trống |
|---|---|---|
| `kien-thuc.md` | mục tiêu, cấp độ, nội dung, phạm vi, từ vựng cho phép, nhân vật và cảnh | `lesson-mau-trong/kien-thuc.md` |
| `trinh-tu-lesson.md` | các bước: vai trò, Task, TF dùng, nội dung cần có, tiêu chí kiểm định; nhãn chuẩn; quy tắc toàn phiếu | `lesson-mau-trong/trinh-tu-lesson.md` |
| `task-format.md` (TF) | CÁCH SOẠN từng Task: dạng Q, số câu, văn bản nguồn, kế hoạch câu hỏi có ý đồ, quy tắc, đáp án, ảnh/audio, thứ tự sinh | `lesson-mau-trong/task-format.md` |

Phân vai: Trình tự Lesson nói **cần đạt gì**, TF nói **soạn thế nào**. Với Reading và Listening, TF bắt buộc có kế hoạch câu hỏi có ý đồ (câu 1 làm gì, câu giữa làm gì, câu cuối làm gì), và sinh theo thứ tự: kế hoạch câu hỏi, văn bản/script, câu hỏi, kiểm.

Trình tự chung (theo chuyên mục × cấp độ) chỉ là tài liệu người dùng dùng khi soạn Trình tự Lesson, **không** thuộc thư viện, hệ thống không đọc nó.

**Nhóm hệ thống** (5 mục, viết một lần, dùng cho mọi lesson; xây ở Bước 3):
| # | Mục | Việc | Gốc có sẵn |
|---|---|---|---|
| 1 | `he-thong/01-quy-tac-md.md` | cách AI viết MD cho app, các bẫy đã gặp | `docs/QUY_UOC_MD.md`, `docs/PROMPT_PDF_SANG_PHIEU.md`, prompt v116 |
| 2 | `he-thong/02-task-format-chung/` | **TF chung**, mỗi dạng bài một mục (cùng khuôn với `task-format.md`), áp dụng cho **bài tự do** và làm mẫu; kèm bảng dạng bài ↔ 12 dạng Q | `QUY_UOC_MD.md` mục 2b |
| 3 | `he-thong/03-quy-tac-hinh-thuc.md` | đen trắng, Task trọn trang, mô tả ảnh, script audio | chưa có |
| 4 | `he-thong/04-rubric-kiem.md` | tiêu chí kiểm chất lượng | `RUBRIC_KIEM_v0.md`, hai bản đánh giá |
| 5 | `he-thong/05-phieu-mau.md` | phiếu mẫu đã duyệt (giọng, mức khó) | `tests/md/sinh-thu-movers-grammar-v2.md` |

**Chọn TF:** một bước có 1 đến 3 TF. Máy chọn một TF mỗi lần sinh, ưu tiên TF ít dùng gần đây cho lesson đó (luân phiên), và giáo viên đổi sang TF khác của cùng bước ở màn duyệt dàn ý. Sinh lại một Task giữ nguyên TF đã chọn, trừ khi giáo viên đổi, để nhất quán.

**Soạn ngoài, nạp vào:** người dùng soạn các file ở ngoài hệ thống. Khi nạp, hệ thống kiểm file (xem mục 5) và báo lỗi trước khi cho dùng.

## 2. Quy ước chung cho mọi file
- Đầu mỗi file có khối thông tin: `Mã`, `Phiên bản` (số, vd 1.0), `Trạng thái` (Nháp / Đang duyệt / Đã duyệt), `Người soạn`, `Ngày`.
- Chỉ file **Đã duyệt** mới được dùng để sinh bài thật. Sửa file thì tăng phiên bản; phiếu đã sinh ghi phiên bản các file đã dùng.
- Chỗ do Claude đề xuất chưa được người dùng duyệt gắn nhãn `[ĐỀ XUẤT]`. Duyệt xong thì gỡ nhãn.
- Viết tiếng Việt cho phần mô tả, tiếng Anh cho nội dung bài và chỉ dẫn in trên phiếu.

## 3. Mỗi lần gọi AI gửi gì (nhớ: không gửi cả 7 file mỗi lần)
| Việc | Gửi |
|---|---|
| Dựng dàn ý | Kiến thức, Trình tự Lesson, TF (lesson) hoặc 02 (bài tự do) |
| Sinh một Task | Kiến thức, đoạn Trình tự Lesson của Task, mục TF của Task (lesson) hoặc mục 02 tương ứng (bài tự do), 01 (phần dạng Q đó), 03, 05, dàn ý đã duyệt, tóm tắt Task kế bên |
| Kiểm một Task | 04, Kiến thức, Task cần kiểm |
Phần ổn định (01, 02, 03, 05, 04) đặt lên đầu để dùng được bộ nhớ đệm prompt.

## 5. Kiểm file khi nạp (yêu cầu cho hệ thống)
- Đủ mục bắt buộc của từng loại file, có khối thông tin (mã, phiên bản, trạng thái).
- Ba file của một lesson cùng mã lesson.
- Mỗi bước trong Trình tự Lesson có 1 đến 3 TF, và mã TF đó có trong file Task Format.
- Dạng Q trong TF là một trong 12 dạng hợp lệ của app.
- Cảnh báo (không chặn): TF thiếu kế hoạch câu hỏi cho Reading/Listening; từ vựng cho phép trống; nhân vật chưa khai báo.
Kèm một hướng dẫn soạn và checklist cho người soạn (làm ở Bước 3).

## 4. Lộ trình
- Bước 2 (đang làm): cấu trúc này, ba mẫu trống, bộ Grammar Movers tách thành ba file.
- Bước 3: xây 5 file hệ thống, thử trên Grammar Movers, thêm một lesson khác loại, duyệt từng file.
- Bước 4: kế hoạch xây hệ thống.
