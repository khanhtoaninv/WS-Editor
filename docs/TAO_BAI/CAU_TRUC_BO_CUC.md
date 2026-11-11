# Cấu trúc file Bố cục (mẫu)

Bố cục **không phải file bạn viết**. App sinh ra từ Trình tự, giáo viên chỉnh, lưu cùng phiếu. Dạng dưới đây là cách Bố cục hiển thị cho giáo viên duyệt và cách app đưa vào Trình tự sinh (mục Bố cục phiếu). Nội dung lesson không nằm ở đây.

---

```
# Bố cục
Phiếu: Our World 3 · Unit 5 · Lesson 2
Chuyên đề: Grammar
Trình tự: Grammar 2.0
Cho phép ảnh: không

## Danh sách Task
| Task | B | Dạng Q | Số câu | Mức độ |
|---|---|---|---|---|
| 1 | B1 Quan sát | Q10 Bảng | 4 ô | Vừa |
| 2 | B2 Hiểu nghĩa và cách dùng | Q3 Chọn A/B/C | 5 | Vừa |
| 3 | B3 Nhận diện hình thức | Q4 Chọn trong câu | 5 | Vừa |
| 4 | B4 Tự tạo hình thức | Q1 Điền từ | 5 | Vừa |
| 5 | B5 Dùng trong tình huống | Q2 Viết câu | 3 | Vừa |
| 6 | B6 Tự diễn đạt | Q12 Viết tự do | 4 dòng | Vừa |
Tổng: 22 câu có đáp án hoặc dòng viết.

## Số liệu tính sẵn
| Task | Câu lộ đáp án tối đa | Câu xác định bằng nghĩa tối thiểu | Vị trí bắt buộc |
|---|---|---|---|
| 2 | 2 | 1 | câu 3 |
| 3 | không áp dụng | 1 | câu 4 |
| 4 | không áp dụng | 1 | câu 2 |

## Ghi chú của giáo viên
Không có.
```

---

## Các trường

| Trường | Nguồn | Giáo viên sửa được |
|---|---|---|
| Phiếu (giáo trình, unit, lesson), Chuyên đề, Trình tự (phiên bản) | cây giáo trình, file Trình tự | không |
| Cho phép ảnh | thiết lập phiếu, mặc định không | có |
| Task (số thứ tự) | app đánh theo thứ tự B | tự đổi khi thêm hoặc bỏ Task |
| B | Trình tự; mã B cố định | thêm Task cùng B; bỏ B không bắt buộc |
| Dạng Q | Dạng Q đầu tiên trong danh sách của B | đổi sang Dạng Q khác trong danh sách của B đó |
| Số câu | mặc định của Dạng Q trong Trình tự | trong khoảng ghi ở Trình tự; ngoài khoảng thì app cảnh báo |
| Mức độ | mặc định Vừa | Dễ / Vừa / Khó |
| Số liệu tính sẵn | app tính từ Quy tắc toàn phiếu của Trình tự và Số câu | không (tự cập nhật khi Số câu đổi) |
| Ghi chú của giáo viên | giáo viên gõ | có |

## Cách sinh mặc định
1. Mỗi B trong Trình tự thành một Task, Dạng Q đầu tiên của B, số câu mặc định, mức Vừa.
2. B có `Bắt buộc: không` vẫn có mặt; giáo viên bỏ nếu không cần.
3. Dạng Q có `Điều kiện dùng` không thỏa (ví dụ cần ảnh mà phiếu không cho phép) thì không được chọn; Dạng Q đầu tiên thỏa điều kiện thay vào.

## Quy tắc chỉnh
- Không bỏ B bắt buộc. Không thêm Task ngoài các B của Trình tự.
- Một B có thể có nhiều Task; các Task cùng B đứng liền nhau, theo thứ tự B.
- Mỗi Task đúng một Dạng Q.
- Dạng Q chỉ chọn trong danh sách của B đó. Q11 không chọn được.
- Đổi Dạng Q thì Số câu về mặc định của Dạng Q mới.
- Số câu ngoài khoảng của Trình tự không bị chặn, chỉ cảnh báo.

## Số liệu tính sẵn
Mỗi Quy tắc toàn phiếu có tỷ lệ trong Trình tự (ví dụ ≥ 20%, ≤ 40%) và phạm vi `[B…]`. App chỉ tính cho Task thuộc phạm vi:
- **Câu xác định bằng nghĩa tối thiểu** = làm tròn lên (20% × số câu của Task).
- **Câu lộ đáp án tối đa** = làm tròn xuống (40% × số câu của Task).
- **Vị trí bắt buộc**: app chọn đúng số vị trí tối thiểu, rải đều trong Task, và gửi cho AI. AI phải đặt câu xác định bằng nghĩa đúng các vị trí đó.

Tính lại mỗi khi giáo viên đổi Số câu hoặc Dạng Q.

## Cách Bố cục đi vào Trình tự sinh
- Danh sách Task, Số liệu tính sẵn và Ghi chú của giáo viên được ghép thành mục Bố cục phiếu trong Trình tự sinh.
- Bố cục thắng Trình tự khi mâu thuẫn về phiếu gồm Task nào, mấy câu, mức nào.
- App lọc Trình tự theo Bố cục: chỉ giữ B có Task, chỉ giữ Dạng Q được chọn, chỉ giữ dòng của mức độ được chọn, chỉ giữ Quy tắc toàn phiếu có phạm vi chứa B còn lại.
- Sau khi AI trả về, app kiểm từng Task so với Bố cục: đúng `Bố cục: Task k`, đúng Dạng Q, đúng Số câu, đúng Số liệu tính sẵn.

## Ví dụ chỉnh
Giáo viên thêm một Task Q4 vào B2 và bỏ B6:

| Task | B | Dạng Q | Số câu | Mức độ |
|---|---|---|---|---|
| 1 | B1 | Q10 | 4 ô | Vừa |
| 2 | B2 | Q3 | 5 | Vừa |
| 3 | B2 | Q4 | 5 | Vừa |
| 4 | B3 | Q4 | 5 | Vừa |
| 5 | B4 | Q1 | 5 | Vừa |
| 6 | B5 | Q2 | 3 | Vừa |

Số B không đổi (B1…B5 vẫn là B1…B5), chỉ số Task đổi. Số liệu tính sẵn được tính lại cho cả Task 2 và Task 3.
