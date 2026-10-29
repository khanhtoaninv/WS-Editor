# Module tạo bài — các quyết định đã chốt

Cập nhật 29/10/2026. Giai đoạn: thảo luận, chưa viết code. Làm trước: **tạo bài theo giáo trình**; bài tự do để sau.

## Quy trình (giao diện, cập nhật 29/10 tối)
Hai giai đoạn: **① Ra đề → ② Biên tập**. Hình mẫu: `docs/MINH_HOA_TAO_BAI.html` (màn Ra đề) và `docs/MINH_HOA_TAO_BAI_B.html` (Biên tập, vẽ trên editor v123 thật).
1. **Ra đề.** Khung chọn Giáo trình / Unit / Lesson luôn mở (bấm tiêu đề để thu gọn). Dưới trái: **cấu trúc bài** do code dựng từ Trình tự, một khối, mỗi bước một mục, mặc định 1 bài, **+** thêm (tối đa 2 bài / bước), **✕** xóa (bước bắt buộc giữ ít nhất 1; bước không bắt buộc xóa hết = bỏ qua), đổi dạng Q trong danh sách được phép, chỉnh số câu trong giới hạn. Dưới phải: **layout sơ bộ** cập nhật ngay, báo vượt số trang (ước tính). Bấm "Duyệt cấu trúc · Sinh bài".
2. **Biên tập.** **Editor giữ nguyên bố cục** (không sửa ba cột / inspector). Chỉ thêm:
   - dải trên cùng: giai đoạn, **Duyệt bài n/5**, **Lịch sử phiếu**, **Xuất bản**;
   - biểu tượng trạng thái cuối dòng Task ở cây (✓ / ⚠ / ○);
   - **ngăn trượt** đè tạm lên inspector: khối Cả phiếu (kiểm tra + Duyệt phiếu), từng bài (Kiểm tra, mục tiêu, ngữ cảnh, đáp án, Duyệt, Lịch sử bài, Sinh lại kèm góp ý), công tắc Hiện đáp án trên trang.
3. **Kiểm tra chất lượng:** giáo viên thấy danh sách tiêu chí đạt / chưa đạt kèm lý do (máy kiểm + AI chấm theo rubric), **không thấy điểm số**. Cả phiếu có tiêu chí riêng (phủ kiến thức, không lặp, độ khó tăng dần, số trang). Điểm số + hành vi giáo viên (duyệt ngay / sửa / sinh lại) lưu cho trang admin.
4. **Lịch sử chỉ tạo khi bấm Duyệt.** Duyệt Task chỉ lưu Task đó; Duyệt Phiếu lưu cả phiếu. Mỗi Task và phiếu giữ **tối đa 3 lần duyệt gần nhất** để chọn lại. Sửa / sinh lại bài đã duyệt thì bài về "chưa duyệt".

Trình tự nên viết theo kiểu "lai": mỗi bước có vai trò, danh sách Q được phép, khoảng số câu, số bài tối đa, có bắt buộc không; cộng vài nguyên tắc chữ. (Chi tiết cấu trúc file: thảo luận riêng.)

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
