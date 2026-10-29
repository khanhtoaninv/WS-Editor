# AI tự kiểm (mù) so với đánh giá của giáo viên

AI kiểm chưa thấy đánh giá của giáo viên; chỉ có rubric v0 (không nêu lỗi cụ thể), hai file mẫu và phiếu.

| Lỗi giáo viên nêu | AI bắt được? |
|---|---|
| 1. Task 1: chỉ dẫn "verbs" mơ hồ, are/is/love lẫn vào, phân biệt bằng màu | Có, đủ (L12, L13, L14), còn chỉ ra `love` là stative, ngoài phạm vi |
| 2. Task 4 câu 5: "in the garden" chưa loại trừ xem TV | Không. AI chỉ nói mâu thuẫn cảnh và "They" thiếu tiền ngữ |
| 3. Task 5 chưa đúng vai trò G4 | Có (L19): câu hỏi chứa sẵn cấu trúc, chép lại dữ kiện |
| 4. Phụ thuộc từ khóa thời gian (ý A) | Có, mạnh hơn: đếm 18/18 câu làm được bằng mẹo hình thức (L1) |
| 5. Task 6 thiếu mẫu, tiêu chí đầu ra | Có một phần (L20, L3) |
| 6. Bố cục: ảnh, chia trang, checklist | Chỉ phần màu/đen trắng. Phần còn lại ngoài tầm nhìn (AI chỉ đọc MD, không thấy trang) |

Kết quả: 4/6 đủ, 1/6 một phần, 1/6 không.

AI còn bắt thêm lỗi thật giáo viên chưa nêu:
- Đáp án sai (T4.3 `is/do` phải là `is/doing`; đáp án mẫu T5 sai chủ ngữ): lỗi do người viết phiếu.
- Mâu thuẫn tình huống giữa các Task (Lucy đang đọc nhưng T2 nói đang gọi điện, ăn kem...).
- Đáp án Task 2 xen kẽ đều, bẫy lựa chọn tự sai ngữ pháp ở Task 3.
- Một số mục nhỏ ít giá trị (nhãn Habit quá khó, từ ngoài danh sách động từ).

Giới hạn: AI chỉ thấy nội dung chữ; không kiểm được hình thức hiển thị.
