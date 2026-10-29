# Module tạo bài — các quyết định đã chốt

Cập nhật 29/10/2026. Giai đoạn: thảo luận, chưa viết code. Làm trước: **tạo bài theo giáo trình**; bài tự do để sau.

## Quy trình
1. **Chuẩn bị.** Giáo viên chọn giáo trình → unit → lesson. Việc chọn chỉ để xác định lesson.
2. **Duyệt tổng quan.** AI đọc dữ liệu, đề xuất danh sách Task (mục tiêu, vai trò, nội dung từng Task). Giáo viên duyệt / sửa / gen lại.
3. **Tạo bài.** AI viết từng Task theo danh sách đã duyệt, ra MD đúng quy ước, app nạp vào WS Editor để tinh chỉnh trước khi xuất bản.

## Dữ liệu
```
Giáo trình
 ├─ Chuyên đề (vd Ngữ pháp, Nghe)
 │    ├─ Trình tự  (có phiên bản)
 │    └─ TF        (có phiên bản)
 └─ Unit
      └─ Lesson → thuộc đúng 1 chuyên đề, có file Kiến thức riêng

Bộ file chung của hệ thống (mọi giáo trình)
```
- Mỗi lesson thuộc **đúng một** chuyên đề, bắt buộc khi admin tạo lesson.
- Trình tự và TF dùng chung cho mọi lesson cùng chuyên đề trong một giáo trình; sửa một lần là mọi lesson nhận.
- Khi tạo bài: Kiến thức (lesson) + Trình tự + TF (chuyên đề) = bộ 3 file, cộng bộ file chung.
- Chuyên đề thiếu Trình tự hoặc TF → báo lỗi, không cho tạo.
- Phiếu tạo ra lưu phiên bản Trình tự / TF đã dùng.
- Kiến thức: chỉ chuẩn hóa cấu trúc thành phần, không chuẩn hóa nội dung.

## Bộ file chung của hệ thống
1. Quy tắc viết MD cho sinh bài (rút từ `docs/QUY_UOC_MD.md` + bẫy đã gặp). Đi theo phiên bản app.
2. Mô tả 12 dạng Q: `1_DANG_Q.md` (bản nháp). **TF ghi thẳng mã Q** (`Dạng app: Q4 Chọn trong câu`), nên không cần bảng dạng bài → Q riêng.
3. Quy tắc hình thức: đen trắng, mô tả ảnh, script audio; giới hạn đo được (số câu, số từ bài đọc) thay cho "trọn trang".
4. Rubric chất lượng (dùng cho lượt chấm riêng, không tự chấm trong lượt sinh).
5. Phiếu mẫu đã duyệt, xếp theo chuyên đề và level; mỗi lần gửi 1–2 mẫu khớp nhất.

## File dùng ở bước nào
| Bước | Dùng |
|---|---|
| 2. Đề xuất danh sách Task | Kiến thức, Trình tự, TF, file 2 |
| 3. Sinh bài | thêm file 1, 3, 5 |
| Kiểm tra | code kiểm (bộ đọc MD, số câu, đáp án, tràn trang) rồi file 4 cho lượt AI chấm riêng |

## Kiểm tra sau khi sinh (đề xuất, chưa chốt)
- Máy kiểm bằng code: MD qua bộ đọc của app không lỗi; đủ số câu; có đáp án; đáp án có trong bài đọc / khung từ; không trùng câu; đúng dạng Q; dàn thử không tràn trang. Lỗi → gửi lại AI sửa đúng chỗ.
- Lượt AI chấm riêng theo rubric: đúng mục tiêu, mức khó, câu không mơ hồ, tỉ lệ câu chỉ cần hiểu nghĩa ≤ 20%. Task nghi ngờ được đánh dấu cho giáo viên xem trước.
