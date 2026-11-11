# Cấu trúc file Trình tự chuyên đề (mẫu)

Một file cho một chuyên đề trong một giáo trình (ví dụ Grammar). Dùng chung cho mọi lesson của chuyên đề. **Không chứa nội dung của lesson nào**: mọi từ, cấu trúc, ví dụ, lỗi thường gặp lấy từ file Kiến thức. Gọi các mục của Kiến thức bằng tên mục.

---

```
# Trình tự
Chuyên đề: Grammar
Phiên bản: 2.0

## Kiến thức cần có
Bắt buộc: Mục tiêu, Học sinh, Kiến thức, Từ vựng được dùng, Lỗi thường gặp.
Tùy chọn: Ngoài phạm vi, Theo từng B. Thiếu mục tùy chọn thì AI tự lấy từ mục Kiến thức và Từ vựng được dùng.

## Quy mô
- Bài về nhà, học sinh tự làm, khoảng 25 phút, khoảng 25 câu có đáp án (gợi ý, không cứng).
- Một phiếu một trọng tâm: mục Mục tiêu của Kiến thức.

## Tiêu chí quan trọng nhất
Học sinh nhận ra và dùng đúng mục tiêu nhờ **nghĩa của tình huống hoặc dữ kiện**, không chỉ nhờ một dấu hiệu bề mặt hay dạng chữ của câu hỏi.

## Định nghĩa
- Dấu hiệu bề mặt: từ hoặc cụm trong câu cho biết ngay hình thức đáp án mà không cần hiểu nghĩa.
- Câu hỏi lộ đáp án: hình thức câu hỏi cho biết hình thức đáp án.
- Câu trần: câu chọn hoặc điền không có dấu hiệu bề mặt và không có dữ kiện đủ để loại các đáp án còn lại.
- Câu xác định bằng nghĩa: câu không có dấu hiệu bề mặt, và câu liền trước không chứa hình thức của đáp án.

## Quy tắc toàn phiếu
1. Không câu trần. [B2 B3 B4]
2. Ít nhất 20% số câu có đáp án của mỗi Task thuộc B2, B3, B4 là câu xác định bằng nghĩa. App chỉ định vị trí; AI báo cáo số thứ tự. [B2 B3 B4]
3. Đáp án suy từ dữ kiện nói ra trong tình huống; đồ vật làm nền không phải dữ kiện. Mỗi tình huống chỉ dùng một lần. [B2 B3 B4]
4. Câu liền trước không chứa hình thức của đáp án (trừ câu hỏi lộ đáp án ở B2). [B3 B4]
5. Câu chọn có đúng ba lựa chọn: một đúng; một sai vì nghĩa trong tình huống; một sai vì hình thức (đúng một lỗi, lấy từ Lỗi thường gặp). Không lỗi chính tả. [B2 B3]
6. Câu hỏi lộ đáp án tối đa 40% số câu của Task; phần còn lại không lộ. [B2]
7. Hội thoại viết thành lượt `Tên: ...`, mỗi lượt một người nói; lời kể đứng riêng một dòng; không hai câu hỏi liên tiếp. [B2]
8. Một tình huống tối đa 2 lần trên cả phiếu. Không dùng cùng một khuôn câu quá 2 lần trong một Task. [cả phiếu]
9. Chỉ dùng từ trong Từ vựng được dùng và từ cơ bản đã học; không dùng nội dung trong Ngoài phạm vi. [cả phiếu]
10. Mức hỗ trợ giảm dần từ B3 đến B6. [cả phiếu]
11. Mỗi đáp án truy được về một mục của Kiến thức; không bịa số liệu ngoài dữ kiện đã cho. [cả phiếu]
12. Chỉ dùng chữ, làm được khi in đen trắng, trừ Dạng Q có ghi cần ảnh. [cả phiếu]

## B1: Quan sát
- Mức nhận thức: Recognition. Bắt buộc: có. Mức độ mặc định: Dễ.
- Vai trò: nhận ra các hình thức của mục tiêu trong một văn bản có nghĩa; chưa phải làm đúng sai.
- Nội dung: văn bản ngắn chỉ chứa mẫu mục tiêu, lấy ví dụ trong Kiến thức (hoặc mục Theo từng B → B1).
- Tiêu chí kiểm định: nhận ra mà không phải đoán? Có từ hay cấu trúc ngoài phạm vi gây phân vân? Làm được khi in đen trắng?

### Dạng Q10 Bảng
- Số câu: 4 ô (3–6).
- Cấu trúc trình bày: văn bản nguồn ngắn đứng trên bảng; bảng có dòng tiêu đề cột; hàng đầu điền sẵn làm mẫu.
- Nguyên tắc nội dung: mỗi hàng là một hình thức cần nhận ra, lấy từ văn bản nguồn; không dùng hình thức ngoài mục tiêu. Task này không tính giới hạn lặp.
- Mức độ: Dễ: câu đơn, ngữ cảnh rõ. Vừa: thêm một hình thức dễ nhầm. Khó: văn bản dài hơn, ít gợi ý ở tiêu đề.

### Dạng Q7 Chọn ảnh
- Điều kiện dùng: chỉ khi phiếu cho phép ảnh.
- Số câu: 4 (3–5).
- Cấu trúc trình bày: mỗi câu một câu chữ, chọn ảnh khớp.
- Nguyên tắc nội dung: ảnh phân biệt được bằng đúng hình thức của mục tiêu.
- Mức độ: Dễ: ảnh khác nhau rõ. Vừa: ảnh gần giống. Khó: khác biệt nhỏ.

## B2: Hiểu nghĩa và cách dùng
- Mức nhận thức: Understanding. Bắt buộc: có. Mức độ mặc định: Vừa.
- Vai trò: phân biệt các cách dùng của mục tiêu bằng nghĩa của tình huống.
- Nội dung: tình huống hoặc hội thoại ngắn.
- Tiêu chí kiểm định: nếu học sinh không hiểu nghĩa, có chọn đúng chỉ nhờ dấu hiệu bề mặt không? Đếm số câu thuộc loại đó.

### Dạng Q3 Chọn A/B/C
- Số câu: 5 (4–6).
- Cấu trúc trình bày: mỗi câu một tình huống ngắn, một chỗ trống, ba lựa chọn nhãn a. b. c.
- Nguyên tắc nội dung: theo quy tắc 1, 2, 3, 5, 6, 7; một đáp án đúng suy ra từ tình huống.
- Mức độ: Dễ: tình huống một câu, nghĩa rõ. Vừa: tình huống hai câu hoặc hội thoại ngắn, thêm thông tin mới. Khó: lựa chọn sai gần nghĩa, thông tin quyết định nằm ở câu dẫn.

### Dạng Q4 Chọn trong câu
- Số câu: 5 (5–8).
- Cấu trúc trình bày: ba vế chọn nằm ngay trong câu; có câu dẫn ngắn đứng trước.
- Nguyên tắc nội dung: theo quy tắc 1, 2, 3, 5.
- Mức độ: Dễ: câu ngắn, một chỗ chọn. Vừa: có câu dẫn. Khó: câu dẫn không chứa gợi ý bề mặt.

## B3: Nhận diện hình thức
- Mức nhận thức: Application (có kiểm soát). Bắt buộc: có. Mức độ mặc định: Vừa.
- Vai trò: chọn đúng hình thức khi còn đủ gợi ý.
- Nội dung: tình huống ngắn, phủ đủ các loại câu và chủ ngữ trong Kiến thức.
- Tiêu chí kiểm định: mỗi câu một đáp án rõ? Có vô tình đòi từ hay cấu trúc ngoài phạm vi?

### Dạng Q4 Chọn trong câu
- Số câu: 5 (5–8).
- Cấu trúc trình bày: ba vế chọn trong câu; câu dẫn khi cần.
- Nguyên tắc nội dung: theo quy tắc 1, 2, 3, 4, 5.
- Mức độ: Dễ: có dấu hiệu bề mặt ở phần lớn câu. Vừa: dấu hiệu bề mặt ở khoảng nửa số câu. Khó: phần lớn câu cần hiểu nghĩa.

### Dạng Q3 Chọn A/B/C
- Số câu: 5 (4–6).
- Cấu trúc trình bày: như B2 Q3.
- Nguyên tắc nội dung: theo quy tắc 1, 2, 3, 4, 5.
- Mức độ: Dễ, Vừa, Khó như B3 Q4.

## B4: Tự tạo hình thức
- Mức nhận thức: Application (có kiểm soát). Bắt buộc: có. Mức độ mặc định: Vừa.
- Vai trò: tự tạo đúng hình thức khi vẫn còn gợi ý.
- Nội dung: như B3.
- Tiêu chí kiểm định: như B3; học sinh phải tự tạo hình thức, không chỉ chọn.

### Dạng Q1 Điền từ
- Số câu: 5 (5–8).
- Cấu trúc trình bày: mỗi câu một chỗ trống, từ gốc cho sẵn trong ngoặc hoặc trong khung từ.
- Nguyên tắc nội dung: đủ gợi ý để chỉ một đáp án đúng (quy tắc 1, 2, 3); không chép hình thức đáp án (quy tắc 4); có khung từ thì đáp án nằm trong khung.
- Mức độ: Dễ: một chỗ trống, từ gốc cho sẵn, có dấu hiệu bề mặt. Vừa: từ gốc cho sẵn, ít dấu hiệu. Khó: từ gốc không cho sẵn hoặc hai chỗ trống mỗi câu.

## B5: Dùng trong tình huống
- Mức nhận thức: Application (trong tình huống). Bắt buộc: có. Mức độ mặc định: Vừa.
- Vai trò: dùng cấu trúc phù hợp với dữ kiện cho sẵn để truyền đạt thông tin.
- Nội dung: dữ kiện ngắn (bảng hoặc đoạn), lấy từ mục Theo từng B → B5; thiếu thì tự dựng từ Kiến thức và Từ vựng được dùng.
- Tiêu chí kiểm định: phải xử lý thông tin để tạo câu, hay chỉ làm lại bài điền từ của B4?

### Dạng Q2 Viết câu
- Số câu: 3 (3–4).
- Cấu trúc trình bày: bảng dữ kiện trên các câu; mỗi câu một yêu cầu, học sinh viết một câu; không cho sẵn khung câu.
- Nguyên tắc nội dung: mỗi câu một mục đích khác nhau; đáp án mẫu một câu, suy được từ bảng dữ kiện (quy tắc 11).
- Mức độ: Dễ: yêu cầu nêu rõ cần dùng hình thức nào. Vừa: yêu cầu nêu tình huống, tự chọn hình thức. Khó: học sinh tự chọn thông tin từ bảng.

### Dạng Q10 Bảng
- Số câu: 4 ô (3–6).
- Cấu trúc trình bày: bảng dữ kiện, học sinh điền cột còn thiếu bằng câu hoặc cụm.
- Nguyên tắc nội dung: mỗi ô suy từ dữ kiện cùng hàng; không có dữ kiện ngoài bảng.
- Mức độ: Dễ: điền cụm. Vừa: điền câu ngắn. Khó: điền câu đủ.

## B6: Tự diễn đạt
- Mức nhận thức: Creation. Bắt buộc: không. Mức độ mặc định: Vừa.
- Vai trò: tự chọn thông tin và dùng mục tiêu để diễn đạt.
- Nội dung: chủ đề gần học sinh, lấy từ Theo từng B → B6 hoặc từ Kiến thức.
- Tiêu chí kiểm định: học sinh thật sự tự chọn thông tin? Người chấm đánh giá được cả tính chính xác lẫn ý nghĩa?

### Dạng Q12 Viết tự do
- Số câu: 4 dòng viết (3–5).
- Cấu trúc trình bày: câu hỏi dẫn; mỗi kiểu câu một ví dụ, không viết sẵn đủ số câu; khung từ gợi ý không bắt buộc.
- Nguyên tắc nội dung: câu hỏi dẫn gợi đủ các hình thức của mục tiêu; không có đáp án duy nhất; Báo cáo ghi hướng chấm.
- Mức độ: Dễ: có câu mẫu cho từng dòng. Vừa: một ví dụ mỗi kiểu. Khó: chỉ có câu hỏi dẫn.
```

---

## Quy ước

| Phần | Vai trò | Ai dùng |
|---|---|---|
| Đầu file: Chuyên đề, Phiên bản | app tìm đúng Trình tự, so với "Trình tự áp dụng" của Kiến thức | app |
| Kiến thức cần có | app kiểm file Kiến thức có đủ mục trước khi sinh | app |
| Quy mô, Tiêu chí quan trọng nhất, Định nghĩa | đưa nguyên văn cho AI | AI |
| Quy tắc toàn phiếu | mỗi quy tắc một lần, ghi phạm vi `[B…]`; B chỉ tham chiếu số quy tắc | AI, app (lọc theo B có trong Bố cục) |
| Mỗi B | Mức nhận thức, Bắt buộc, Mức độ mặc định, Vai trò, Nội dung, Tiêu chí kiểm định | app (sinh Bố cục mặc định), AI |
| Mỗi Dạng Q trong B | Số câu (mặc định và khoảng), Cấu trúc trình bày, Nguyên tắc nội dung, Mức độ Dễ/Vừa/Khó, Điều kiện dùng (nếu có) | app (danh sách Dạng Q cho phép của B, số câu mặc định), AI (phần còn lại) |

Dạng Q đầu tiên trong mỗi B là mặc định khi app sinh Bố cục.

## Nguyên tắc viết
- Không có nội dung lesson: không nêu cấu trúc, từ, tình huống cụ thể. Cần ví dụ thì dùng chủ đề khác và ghi rõ chỉ để minh họa.
- Quy tắc định lượng viết thành tỷ lệ; app tính số cụ thể cho từng Task rồi ghi vào Bố cục.
- Mức độ Dễ/Vừa/Khó khác nhau ở tham số kiểm soát được (độ dài, số gợi ý, số chỗ trống), không chỉ đổi tên.
- Cú pháp MD của từng Dạng Q không viết ở đây: thuộc Quy tắc định dạng MD.
- Đổi thứ tự hoặc số B thì tăng Phiên bản; Kiến thức tham chiếu mã B nên phải cảnh báo.
