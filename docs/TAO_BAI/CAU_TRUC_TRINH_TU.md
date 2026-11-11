# Cấu trúc file Trình tự chuyên đề (mẫu)

Mỗi chuyên đề trong một giáo trình có một file (ví dụ Grammar). File dùng chung cho mọi lesson của chuyên đề và **không chứa nội dung của lesson nào**. Mọi từ, cấu trúc, ví dụ và lỗi thường gặp đều lấy từ file Kiến thức, gọi theo tên mục.

So với bản 2.0, bản 2.1 có các thay đổi sau:
- Mức độ có tham số đo được.
- Định nghĩa dựa vào các dòng mới của Kiến thức.
- Có hai kiểu ngữ pháp: kiểu nghĩa và kiểu hình thức, mỗi kiểu một bộ tham số.
- Độ dài tính trên cả phần đề, không tính từng câu.
- Quy tắc 4 và 5 được sửa.
- B1 ghi rõ ngoại lệ với điều G3.
- Có thêm dòng Câu mẫu.

---

```
# Trình tự
Chuyên đề: Grammar
Phiên bản: 2.1
Câu mẫu: Câu mẫu Grammar 1.0

## Kiến thức cần có
Bắt buộc: dòng Kiểu ngữ pháp ở đầu file; Mục tiêu; Học sinh; Kiến thức (mỗi K có Dùng khi, Dấu hiệu bề mặt, Câu hỏi lộ đáp án); Dạng câu cần phủ; Từ vựng được dùng; Lỗi thường gặp (Lỗi hình thức, Nhầm cách dùng).
Tùy chọn: Ngoài phạm vi, Theo từng B. Thiếu mục tùy chọn thì AI tự lấy từ mục Kiến thức và Từ vựng được dùng.

## Mức độ
Ba mức: Dễ, Vừa, Khó. Mặc định của mọi B là Vừa; giáo viên đổi từng Task trong Bố cục.
Tham số chung, áp cho Task thuộc B2, B3, B4 (app tính số cụ thể và ghi vào Bố cục):
| Tham số | Dễ | Vừa | Khó |
|---|---|---|---|
| Độ dài phần đề, tối đa | 10 từ | 16 từ | 22 từ |
| Câu xác định bằng nghĩa, tối thiểu (chỉ Kiểu nghĩa) | 20% | 40% | 60% |
| Câu hỏi lộ đáp án, tối đa (chỉ Kiểu nghĩa, chỉ B2) | 60% | 40% | 20% |
| Câu không có mẫu gần đó, tối thiểu (chỉ Kiểu hình thức) | 20% | 40% | 60% |

- **Phần đề** của một câu hỏi gồm tình huống, các lượt hội thoại và câu có chỗ trống. Không tính lựa chọn, tên người nói, số câu và từ gốc trong ngoặc. Đếm theo khoảng trắng.
- **Câu không có mẫu gần đó**: trong câu đó và câu liền trước không có hình thức nào của mục tiêu ngoài chỗ trống. Học sinh phải tự áp dụng quy tắc.

Tham số riêng của từng Dạng Q ghi ở dòng Mức độ của Dạng Q đó.

## Kiểu ngữ pháp
Kiến thức ghi một trong hai kiểu ở dòng `Kiểu ngữ pháp:`.

**Kiểu nghĩa.** Các hình thức khác nhau về nghĩa hoặc cách dùng, ví dụ hai thì hiện tại, so sánh hơn và so sánh nhất, can và can't. Áp dụng đủ mọi quy tắc dưới đây.

**Kiểu hình thức.** Đúng sai chỉ do quy tắc hình thức, không do nghĩa, ví dụ a và an, is và are, số nhiều -s. Kiến thức ghi `Nhầm cách dùng: không có`; dòng Dùng khi ghi điều kiện hình thức (an: trước từ bắt đầu bằng âm nguyên âm). Khi đó:
- Quy tắc 2, 6 không áp dụng. Quy tắc 2b thay vào.
- Quy tắc 5 dùng phương án b.
- Tiêu chí quan trọng nhất đọc là: học sinh dùng đúng nhờ **áp dụng quy tắc**, không nhờ chép một mẫu đứng gần.
- B2 đổi Vai trò: hiểu điều kiện chọn hình thức (dòng Dùng khi). Mỗi điều kiện có ít nhất một câu.

## Quy mô
- Bài về nhà, học sinh tự làm, khoảng 25 phút, khoảng 25 câu có đáp án (gợi ý, không cứng).
- Một phiếu một trọng tâm: mục Mục tiêu của Kiến thức.

## Tiêu chí quan trọng nhất
Học sinh nhận ra và dùng đúng mục tiêu nhờ **nghĩa của tình huống hoặc dữ kiện**, không chỉ nhờ một dấu hiệu bề mặt hay dạng chữ của câu hỏi. (Kiểu hình thức: xem mục Kiểu ngữ pháp.)

## Định nghĩa
- Dấu hiệu bề mặt: chỉ các chữ ghi ở dòng Dấu hiệu bề mặt của Kiến thức.
- Câu hỏi lộ đáp án: câu hỏi có dạng ghi ở dòng Câu hỏi lộ đáp án của Kiến thức.
- Câu trần: câu chọn hoặc điền không có dấu hiệu bề mặt và không có dữ kiện đủ để loại các đáp án còn lại.
- Câu xác định bằng nghĩa: câu không chứa dấu hiệu bề mặt nào, không phải câu hỏi lộ đáp án, và câu liền trước không chứa hình thức của đáp án. Học sinh chỉ chọn đúng được khi hiểu dữ kiện (đối chiếu dòng Dùng khi).

## Quy tắc toàn phiếu
1. Không câu trần. [B2 B3 B4]
2. Số câu xác định bằng nghĩa không ít hơn số ở Bố cục, đặt đúng vị trí bắt buộc ở Bố cục; AI báo cáo số thứ tự. [B2 B3 B4] (Kiểu nghĩa)
2b. Số câu không có mẫu gần đó không ít hơn số ở Bố cục, đặt đúng vị trí bắt buộc; AI báo cáo số thứ tự. [B2 B3 B4] (Kiểu hình thức)
3. Đáp án suy từ dữ kiện nói ra trong tình huống; đồ vật làm nền không phải dữ kiện. Mỗi tình huống chỉ dùng một lần trong Task. [B2 B3 B4]
4. Câu liền trước không chứa hình thức của đáp án. [B3 B4]
5. Câu chọn có đúng ba lựa chọn, mỗi lựa chọn sai đúng một lỗi. Không lỗi chính tả trừ khi Lỗi hình thức ghi lỗi chính tả. [B2 B3]
   - a. Một đúng; một sai vì nghĩa (lấy từ Nhầm cách dùng); một sai vì hình thức (lấy từ Lỗi hình thức). Lựa chọn sai vì nghĩa phải **đúng ngữ pháp khi đặt vào câu** và bị loại **bằng dữ kiện có trong câu**. Không có dữ kiện như vậy thì dùng phương án b. Ở B2, mọi câu dùng phương án a.
   - b. Một đúng; hai sai vì hình thức, là hai lỗi khác nhau của Lỗi hình thức. Mục tiêu chỉ có hai hình thức thật (a/an, is/are) thì được dùng hai lựa chọn.
6. Số câu hỏi lộ đáp án không vượt số ở Bố cục. [B2]
7. Hội thoại viết thành lượt `Tên: ...`, mỗi lượt một người nói; lời kể đứng riêng một dòng; không hai câu hỏi liên tiếp. [B2]
8. Một tình huống tối đa 2 lần trên cả phiếu. Không dùng cùng một khuôn câu quá 2 lần trong một Task. [cả phiếu]
9. Từ ngoài danh sách đóng của Từ vựng được dùng: không dùng. Từ ngoài danh sách mở: chỉ dùng từ cơ bản lớp dưới. Không dùng nội dung trong Ngoài phạm vi. [cả phiếu]
10. Mức hỗ trợ giảm dần từ B3 đến B6. [cả phiếu]
11. Mỗi đáp án truy được về một K của Kiến thức; không bịa số liệu ngoài dữ kiện đã cho. [cả phiếu]
12. Chỉ dùng chữ, làm được khi in đen trắng, trừ Dạng Q có ghi cần ảnh. [cả phiếu]
13. Câu đạt chuẩn giống câu mẫu Đạt về cách làm, không giống về chữ; không mắc lỗi của câu mẫu Không đạt. Không lặp khuôn tình huống của câu mẫu (cách mở câu, loại tình huống, tên nhân vật); trong một Task, không quá 2 câu mở đầu giống nhau. [cả phiếu]

## B1: Quan sát
- Mức nhận thức: Recognition. Bắt buộc: có. Mức độ mặc định: Vừa.
- Vai trò: nhận ra các hình thức của mục tiêu trong một văn bản có nghĩa; chưa phải làm đúng sai.
- Nội dung: văn bản ngắn (3–5 câu) chỉ chứa mẫu mục tiêu, dùng ví dụ của Kiến thức hoặc Theo từng B → B1.
- Ngoại lệ: điều 3 [G3] của Cách thức. B1 được dùng lại câu ví dụ của Kiến thức, vì đây là bước quan sát mẫu chuẩn.
- Tiêu chí kiểm định: nhận ra mà không phải đoán? Có từ hay cấu trúc ngoài phạm vi gây phân vân? Làm được khi in đen trắng?

### Dạng Q10 Bảng
- Số câu: 4 ô (3–6).
- Cấu trúc trình bày: văn bản nguồn đứng trên bảng (Bài đọc); bảng có dòng tiêu đề cột; hàng đầu điền sẵn làm mẫu.
- Nguyên tắc nội dung: mỗi ô cần điền là một hình thức có thật trong văn bản nguồn; mỗi K của mục tiêu có ít nhất một ô. Task này không tính giới hạn lặp.
- Mức độ: Dễ: văn bản 3 câu, tiêu đề cột ghi rõ hình thức cần tìm. Vừa: văn bản 4 câu, có một hình thức gần giống không thuộc bảng. Khó: văn bản 5 câu, tiêu đề cột chỉ ghi nghĩa.

### Dạng Q7 Chọn ảnh
- Điều kiện dùng: chỉ khi phiếu cho phép ảnh.
- Số câu: 4 (3–5).
- Cấu trúc trình bày: mỗi câu một câu chữ, chọn ảnh khớp.
- Nguyên tắc nội dung: ảnh phân biệt được bằng đúng hình thức của mục tiêu.
- Mức độ: Dễ: 2 ảnh khác nhau rõ. Vừa: 3 ảnh, hai ảnh gần giống. Khó: 3 ảnh, khác nhau một chi tiết.

## B2: Hiểu nghĩa và cách dùng
- Mức nhận thức: Understanding. Bắt buộc: có. Mức độ mặc định: Vừa.
- Vai trò: phân biệt các cách dùng của mục tiêu bằng nghĩa của tình huống.
- Nội dung: tình huống hoặc hội thoại ngắn; đáp án dựa vào dòng Dùng khi của Kiến thức.
- Tiêu chí kiểm định: nếu học sinh không hiểu nghĩa, có chọn đúng chỉ nhờ dấu hiệu bề mặt không? Đếm số câu thuộc loại đó.

### Dạng Q3 Chọn A/B/C
- Số câu: 5 (4–6).
- Cấu trúc trình bày: mỗi câu một tình huống ngắn có một chỗ trống; ba lựa chọn xếp dọc dưới câu.
- Nguyên tắc nội dung: theo quy tắc 1, 2 (hoặc 2b), 3, 5, 6, 7; một đáp án đúng suy ra từ tình huống.
- Mức độ: Dễ: tình huống một câu. Vừa: tình huống hai câu hoặc hội thoại hai lượt. Khó: hội thoại ba lượt, thông tin quyết định nằm ở lượt đầu.

### Dạng Q4 Chọn trong câu
- Số câu: 5 (5–8).
- Cấu trúc trình bày: ba vế chọn nằm ngay trong câu; có câu dẫn ngắn đứng trước.
- Nguyên tắc nội dung: theo quy tắc 1, 2, 3, 5.
- Mức độ: Dễ: câu dẫn một câu. Vừa: câu dẫn hai câu. Khó: câu dẫn hai câu, thông tin quyết định ở câu đầu.

## B3: Nhận diện hình thức
- Mức nhận thức: Application (có kiểm soát). Bắt buộc: có. Mức độ mặc định: Vừa.
- Vai trò: chọn đúng hình thức khi còn đủ gợi ý.
- Nội dung: tình huống ngắn, phủ đủ mục Dạng câu cần phủ của Kiến thức.
- Tiêu chí kiểm định: mỗi câu một đáp án rõ? Có vô tình đòi từ hay cấu trúc ngoài phạm vi?

### Dạng Q4 Chọn trong câu
- Số câu: 5 (5–8).
- Cấu trúc trình bày: ba vế chọn trong câu; câu dẫn khi cần.
- Nguyên tắc nội dung: theo quy tắc 1, 2, 3, 4, 5.
- Mức độ: theo bảng Mức độ chung; không thêm tham số riêng.

### Dạng Q3 Chọn A/B/C
- Số câu: 5 (4–6).
- Cấu trúc trình bày: như B2 Q3.
- Nguyên tắc nội dung: theo quy tắc 1, 2, 3, 4, 5.
- Mức độ: theo bảng Mức độ chung; không thêm tham số riêng.

## B4: Tự tạo hình thức
- Mức nhận thức: Application (có kiểm soát). Bắt buộc: có. Mức độ mặc định: Vừa.
- Vai trò: tự tạo đúng hình thức khi vẫn còn gợi ý.
- Nội dung: như B3.
- Tiêu chí kiểm định: như B3; học sinh phải tự tạo hình thức, không chỉ chọn.

### Dạng Q1 Điền từ
- Số câu: 5 (5–8).
- Cấu trúc trình bày: mỗi câu một chỗ trống, từ gốc cho sẵn trong ngoặc ngay sau chỗ trống.
- Nguyên tắc nội dung: đủ dữ kiện để chỉ một đáp án đúng (quy tắc 1, 2, 3, 4); đáp án có thể gồm nhiều chữ nếu cấu trúc cần.
- Mức độ: Dễ: từ gốc cho sẵn, chỗ trống chỉ là phần biến đổi của từ gốc, phần còn lại của cấu trúc viết sẵn. Vừa: từ gốc cho sẵn, chỗ trống gồm cả từ đi kèm của cấu trúc. Khó: từ gốc không cho sẵn, học sinh tự chọn từ theo dữ kiện.

## B5: Dùng trong tình huống
- Mức nhận thức: Application (trong tình huống). Bắt buộc: có. Mức độ mặc định: Vừa.
- Vai trò: dùng cấu trúc phù hợp với dữ kiện cho sẵn để truyền đạt thông tin.
- Nội dung: dữ kiện ngắn (bảng hoặc đoạn), lấy từ Theo từng B → B5; thiếu thì tự dựng từ Kiến thức và Từ vựng được dùng.
- Tiêu chí kiểm định: phải xử lý thông tin để tạo câu, hay chỉ làm lại bài điền từ của B4?

### Dạng Q2 Viết câu
- Số câu: 3 (3–4).
- Cấu trúc trình bày: bảng dữ kiện trên các câu; mỗi câu một yêu cầu, học sinh viết một câu; không cho sẵn khung câu.
- Nguyên tắc nội dung: mỗi câu dùng một K khác nhau nếu mục tiêu có nhiều K; đáp án mẫu một câu, suy được từ bảng dữ kiện (quy tắc 11).
- Mức độ: Dễ: yêu cầu cho sẵn đủ các từ chính cần dùng, cách nhau ` / `. Vừa: yêu cầu cho sẵn đối tượng, học sinh tự chọn từ còn lại theo dữ kiện. Khó: yêu cầu chỉ là câu hỏi, học sinh tự chọn thông tin và từ.

### Dạng Q10 Bảng
- Số câu: 4 ô (3–6).
- Cấu trúc trình bày: bảng dữ kiện, học sinh điền cột còn thiếu bằng câu hoặc cụm.
- Nguyên tắc nội dung: mỗi ô suy từ dữ kiện cùng hàng; không có dữ kiện ngoài bảng.
- Mức độ: Dễ: điền cụm. Vừa: điền câu ngắn. Khó: điền câu đủ, tự chọn từ theo dữ kiện.

## B6: Tự diễn đạt
- Mức nhận thức: Creation. Bắt buộc: không. Mức độ mặc định: Vừa.
- Vai trò: tự chọn thông tin và dùng mục tiêu để diễn đạt.
- Nội dung: chủ đề gần học sinh, lấy từ Theo từng B → B6 hoặc từ Kiến thức.
- Tiêu chí kiểm định: học sinh thật sự tự chọn thông tin? Người chấm đánh giá được cả tính chính xác lẫn ý nghĩa?

### Dạng Q12 Viết tự do
- Số câu: 4 dòng viết (3–5).
- Cấu trúc trình bày: câu hỏi dẫn; khung từ gợi ý không bắt buộc.
- Nguyên tắc nội dung: câu hỏi dẫn gợi đủ các K của mục tiêu; không có đáp án duy nhất; Báo cáo ghi hướng chấm (mỗi K một ý).
- Mức độ: Dễ: câu mẫu có chỗ trống cho từng dòng. Vừa: một câu ví dụ cho mỗi K. Khó: chỉ có câu hỏi dẫn.
```

---

## Quy ước

| Phần | Vai trò | Ai dùng |
|---|---|---|
| Đầu file: Chuyên đề, Phiên bản, Câu mẫu | app tìm đúng Trình tự và bộ Câu mẫu đi kèm, so với dòng "Trình tự áp dụng" của Kiến thức | app |
| Kiến thức cần có | app kiểm file Kiến thức đủ mục trước khi sinh | app |
| Kiểu ngữ pháp | app chọn dòng tham số và quy tắc theo kiểu của Kiến thức, chỉ gửi phần đúng kiểu | app |
| Mức độ (bảng tham số chung) | app tính số câu xác định bằng nghĩa và số câu lộ cho từng Task; app kiểm độ dài câu | app, AI |
| Quy mô, Tiêu chí quan trọng nhất, Định nghĩa | đưa nguyên văn cho AI | AI |
| Quy tắc toàn phiếu | mỗi quy tắc một lần, ghi phạm vi `[B…]`; B chỉ tham chiếu số quy tắc | AI, app (lọc theo B có trong Bố cục), Rà soát |
| Mỗi B | Mức nhận thức, Bắt buộc, Mức độ mặc định, Vai trò, Nội dung, Ngoại lệ (nếu có), Tiêu chí kiểm định | app (sinh Bố cục mặc định), AI, Rà soát (Tiêu chí kiểm định) |
| Mỗi Dạng Q trong B | Số câu (mặc định và khoảng), Cấu trúc trình bày, Nguyên tắc nội dung, Mức độ Dễ/Vừa/Khó, Điều kiện dùng (nếu có) | app (danh sách Dạng Q cho phép của B, số câu mặc định), AI |

Dạng Q đầu tiên trong mỗi B là mặc định khi app sinh Bố cục.

## Nguyên tắc viết
- Không có nội dung lesson. Không nêu cấu trúc, từ hay tình huống cụ thể. Ví dụ đặt ở file Câu mẫu, không đặt ở đây.
- Quy tắc định lượng viết thành tỷ lệ. App tính số cụ thể cho từng Task rồi ghi vào Bố cục.
- Mức độ khác nhau ở tham số đếm được (số câu, số từ, tỷ lệ, có hay không gợi ý), không chỉ đổi tên.
- Trình tự được làm khác Cách thức đặt câu hỏi ở một điều nào đó thì ghi dòng `Ngoại lệ:` kèm số điều và lý do.
- Cú pháp MD của từng Dạng Q không viết ở đây. Cú pháp thuộc Quy tắc định dạng MD.
- Đổi thứ tự hoặc số B thì tăng Phiên bản. Kiến thức tham chiếu mã B, nên app phải cảnh báo khi phiên bản đổi.
- Các tham số Mức độ (10/16/22 từ, 20/40/60%) là **điểm khởi đầu, chưa thử thật**. Chỉnh sau khi sinh thử.
