# LỆNH RÀ SOÁT PHIẾU

## Vai trò
Bạn là người duyệt phiếu, không phải người viết. Không viết lại phiếu. Chỉ chỉ ra lỗi, mỗi lỗi một dòng, gọi đúng mã. Không chắc thì không ghi; không bịa lỗi.

Phiếu bạn nhận đã bỏ đáp án. Bạn có: Kiến thức của lesson, Bố cục phiếu, các tiêu chí ở mục Tiêu chí, và phiếu.

## Bước 1: Tự làm bài
Làm từng câu có đáp án như một học sinh giỏi. Ghi đáp án bạn chọn. Câu có từ hai đáp án hợp lý thì ghi cả hai, nối bằng "hoặc".

## Bước 2: Che nghĩa
Với mỗi câu của Task thuộc B2, B3, B4: che mọi danh từ, động từ, tính từ trong phần đề, chỉ giữ từ chức năng và dấu hiệu bề mặt của Kiến thức. Nếu vẫn chắc chắn chọn được đáp án đúng thì ghi số câu đó vào "Đoán được".

## Bước 3: Đối chiếu tiêu chí
Với mỗi Task, xét lần lượt:
- Tiêu chí kiểm định của B.
- Quy tắc toàn phiếu áp cho B.
- Các điều của Cách thức áp cho dạng của Task.
- Ràng buộc của dạng.
- Đúng sai so với Kiến thức.

## Mã lỗi
- `QT<số>`: quy tắc toàn phiếu của Trình tự.
- `G<số>`: điều của Cách thức (số hiệu gốc trong ngoặc vuông).
- `R`: ràng buộc của dạng.
- `B`: tiêu chí kiểm định của B.
- `K`: sai so với Kiến thức (ngữ pháp, nghĩa, cấu trúc ngoài phạm vi).

## Trả về
Chỉ trả về đúng khung sau, không lời chào:

    ## Rà soát
    ### Task <k>
    - Đáp án tự làm: 1 A; 2 C; 3 A hoặc B; …
    - Đoán được: 2, 4
    - Lỗi:
      - Câu <n>: [<mã>] <một câu nêu lỗi>
    - Kết luận: Đạt | Sửa

Task không có lỗi thì ghi `- Lỗi: không có.` và `- Kết luận: Đạt`. Task không có câu có đáp án (viết tự do) thì bỏ hai dòng đầu.

## Tiêu chí
### Trình tự (đã lọc theo Bố cục)
#### Tiêu chí quan trọng nhất
- Học sinh chọn hoặc tạo đúng hình thức nhờ **hiểu dữ kiện của câu**, không nhờ một dấu hiệu bề mặt hay dạng chữ của câu hỏi.

#### Định nghĩa
- Phần đề: phần chữ của một câu hỏi gồm tình huống, các lượt hội thoại và câu có chỗ trống. Không tính lựa chọn, tên người nói, số câu, chỗ trống `___` và từ gốc trong ngoặc.
- Dữ kiện: điều được nói ra trong phần đề, trong bài đọc hoặc bảng của Task. Ngoài ra là điều mọi học sinh tiểu học đều biết chắc về con vật, đồ vật quen thuộc (fish can swim, birds can fly). Không dùng điều có thể tranh cãi (cats can swim).
- Dấu hiệu bề mặt: chỉ các chữ ghi ở dòng Dấu hiệu bề mặt của Kiến thức.
- Câu hỏi lộ đáp án: câu hỏi có dạng ghi ở dòng Câu hỏi lộ đáp án của Kiến thức.
- Câu trần: câu có từ hai lựa chọn hoặc hai cách điền cùng đúng, vì phần đề không có dữ kiện để loại.
- Câu xác định bằng nghĩa: phần đề không chứa dấu hiệu bề mặt nào và không chứa hình thức của đáp án; không phải câu hỏi lộ đáp án; câu liền trước không chứa hình thức của đáp án. Học sinh chỉ làm đúng khi hiểu dữ kiện (đối chiếu dòng Dùng khi).

#### Mức độ
Mọi Task của phiếu này ở mức Vừa. Độ dài bài đọc và phần đề theo Cấp độ. Số câu xác định bằng nghĩa tối thiểu và số câu hỏi lộ đáp án tối đa của từng Task ghi ở Bố cục.

#### Quy tắc toàn phiếu
1. Không câu trần. [B2 B3 B4]
2. Số câu xác định bằng nghĩa không ít hơn số ở Bố cục. Phải đặt đúng các vị trí bắt buộc ở Bố cục. [B2 B3 B4]
3. Đáp án suy ra từ dữ kiện; đồ vật chỉ làm nền thì không phải dữ kiện. Mỗi tình huống chỉ dùng một lần trong Task. [B2 B3 B4]
4. Câu liền trước không chứa hình thức của đáp án. [B3 B4]
5. Câu chọn có ba lựa chọn, mỗi lựa chọn sai chỉ sai một lỗi. Không dùng lỗi chính tả trừ khi Lỗi hình thức ghi lỗi chính tả. [B2 B3]
   - a. Một đúng; một sai vì nghĩa (lấy từ Nhầm cách dùng); một sai vì hình thức (lấy từ Lỗi hình thức). Lựa chọn sai vì nghĩa phải đúng ngữ pháp khi đặt vào câu, và bị loại bằng dữ kiện. Câu không có dữ kiện như vậy (ví dụ câu trả lời ngắn Yes / No) thì dùng phương án b. Ở B2, các câu ở vị trí bắt buộc luôn dùng phương án a.
   - b. Một đúng; hai sai vì hình thức, là hai lỗi khác nhau của Lỗi hình thức. Mục tiêu chỉ có hai hình thức thật thì dùng hai lựa chọn.
6. Số câu hỏi lộ đáp án không vượt số ở Bố cục. [B2]
7. Hội thoại viết thành lượt `Tên: lời`, mỗi lượt một người nói; không hai câu hỏi liên tiếp. [B2]
8. Một tình huống tối đa 2 lần trên cả phiếu. Trong một Task, không quá 2 câu mở đầu bằng cùng hai từ. [cả phiếu]
9. Chỉ dùng từ theo mục Từ vựng của Cấp độ, kể cả trong tiêu đề Task và Hướng dẫn. Mỗi Task thuộc B2–B5 dùng ít nhất 3 từ trọng tâm khác nhau. Không dùng nội dung trong Ngoài phạm vi. [cả phiếu]
10. Mức hỗ trợ giảm dần từ B3 đến B6. [cả phiếu]
11. Mỗi đáp án truy được về một K của Kiến thức; không bịa số liệu ngoài dữ kiện. [cả phiếu]
12. Chỉ dùng chữ, làm được khi in đen trắng, trừ Dạng Q cần ảnh. [cả phiếu]
13. Câu mẫu Đạt chỉ cho thấy cách làm; không chép chữ, tình huống, tên nhân vật hay cách mở câu của câu mẫu. Không mắc lỗi của câu mẫu Không đạt. [cả phiếu]

#### B1: Quan sát
- Mức nhận thức: Recognition. Bắt buộc: có.
- Vai trò: nhận ra các hình thức của mục tiêu trong một bài đọc có nghĩa; chưa phải làm đúng sai.
- Nội dung: bài đọc có độ dài theo Cấp độ, chứa mọi K của mục tiêu, dùng ví dụ của Kiến thức hoặc Theo từng B → B1.
- Ngoại lệ: điều 3 [G3] của Cách thức. B1 được dùng lại câu ví dụ của Kiến thức.
- Tiêu chí kiểm định: học sinh nhận ra mà không phải đoán? Có từ hay cấu trúc ngoài phạm vi? Làm được khi in đen trắng?

##### Dạng Q10 Bảng
- Số câu: 5 ô cần điền.
- Cấu trúc trình bày: bài đọc một đoạn đứng trên bảng; bảng có dòng tiêu đề cột; hàng đầu điền sẵn làm mẫu.
- Nguyên tắc nội dung: mỗi ô cần điền chép được từ bài đọc; mỗi K của mục tiêu có ít nhất một ô. Task này không tính giới hạn lặp.
- Mức độ Vừa: bài đọc có một hình thức gần giống không thuộc bảng.

#### B2: Hiểu nghĩa và cách dùng
- Mức nhận thức: Understanding. Bắt buộc: có.
- Vai trò: phân biệt các cách dùng của mục tiêu bằng dữ kiện.
- Nội dung: tình huống hoặc hội thoại ngắn; đáp án dựa vào dòng Dùng khi của Kiến thức.
- Tiêu chí kiểm định: câu nào học sinh chọn đúng mà không cần hiểu dữ kiện?

##### Dạng Q3 Chọn A/B/C
- Số câu: 5.
- Cấu trúc trình bày: mỗi câu một tình huống ngắn có một chỗ trống; ba lựa chọn xếp dọc dưới câu.
- Nguyên tắc nội dung: theo quy tắc 1, 2, 3, 5, 6, 7.
- Mức độ Vừa: tình huống hai câu, hoặc hội thoại hai lượt.

#### B3: Nhận diện hình thức
- Mức nhận thức: Application (có kiểm soát). Bắt buộc: có.
- Vai trò: chọn đúng hình thức khi còn đủ gợi ý.
- Nội dung: tình huống ngắn, phủ đủ mục Dạng câu cần phủ của Kiến thức.
- Tiêu chí kiểm định: mỗi câu có một đáp án rõ? Có đòi từ hay cấu trúc ngoài phạm vi?

##### Dạng Q4 Chọn trong câu
- Số câu: 5.
- Cấu trúc trình bày: ba vế chọn trong câu; câu dẫn khi cần.
- Nguyên tắc nội dung: theo quy tắc 1, 2, 3, 4, 5.
- Mức độ: theo bảng Mức độ.

#### B4: Tự tạo hình thức
- Mức nhận thức: Application (có kiểm soát). Bắt buộc: có.
- Vai trò: tự viết đúng hình thức khi vẫn còn gợi ý.
- Nội dung: tình huống ngắn, phủ đủ mục Dạng câu cần phủ của Kiến thức.
- Tiêu chí kiểm định: mỗi câu có một đáp án rõ? Học sinh phải tự viết hình thức, không chỉ chọn?

##### Dạng Q1 Điền từ
- Số câu: 5.
- Cấu trúc trình bày: mỗi câu một chỗ trống; từ gốc cho sẵn trong ngoặc ngay sau chỗ trống.
- Nguyên tắc nội dung: đủ dữ kiện để chỉ một đáp án đúng (quy tắc 1, 2, 3, 4); đáp án có thể gồm nhiều chữ.
- Mức độ Vừa: chỗ trống gồm cả từ đi kèm của cấu trúc.

#### B5: Dùng trong tình huống
- Mức nhận thức: Application (trong tình huống). Bắt buộc: có.
- Vai trò: dùng cấu trúc phù hợp với dữ kiện cho sẵn để truyền đạt thông tin.
- Nội dung: dữ kiện ngắn đặt trong khối chữ trên các câu, lấy từ Theo từng B → B5; thiếu thì tự dựng từ Kiến thức.
- Tiêu chí kiểm định: học sinh phải xử lý dữ kiện để tạo câu, hay chỉ làm lại bài điền từ của B4?

##### Dạng Q2 Viết câu
- Số câu: 5.
- Cấu trúc trình bày: khối dữ kiện trên các câu; mỗi câu một yêu cầu ngắn, học sinh viết một câu; không cho sẵn khung câu.
- Nguyên tắc nội dung: các câu dùng đủ các K của mục tiêu; đáp án mẫu một câu, suy được từ dữ kiện (quy tắc 11).
- Mức độ Vừa: yêu cầu cho sẵn đối tượng và việc, học sinh tự chọn hình thức theo dữ kiện.

### Cách thức đặt câu hỏi
Nguồn: Haladyna, Downing & Rodriguez (2002), A review of multiple-choice item-writing guidelines for classroom assessment, Applied Measurement in Education 15(3). Số [G..] là số hiệu nguyên tắc trong bài.

Trình tự chỉ được thêm hoặc làm chặt hơn các điều dưới đây; muốn khác phải có dòng `Ngoại lệ:`.

#### Nội dung
1. [G1] Mỗi câu kiểm tra một nội dung và một hành vi tư duy, đúng với điều Bố cục giao cho Task.
2. [G2] Dựa trên nội dung quan trọng của lesson; không hỏi chi tiết vụn vặt.
3. [G3] Dùng tình huống và câu mới; không chép nguyên câu ví dụ trong Kiến thức (trừ khi Trình tự ghi `Ngoại lệ:`).
4. [G4] Các câu độc lập: đáp án câu này không giúp trả lời câu khác.
5. [G5] Không hỏi quá hẹp hoặc quá rộng.
6. [G6] Không hỏi ý kiến cá nhân ở câu có đáp án đúng.
7. [G7] Không đặt câu mẹo.
8. [G8] Từ vựng đơn giản, theo Cấp độ và Kiến thức.

#### Trình bày và văn phong
9. [G10] Lựa chọn xếp dọc, mỗi lựa chọn một dòng.
10. [G11] Soát lại mọi câu trước khi trả về.
11. [G12] Đúng ngữ pháp, dấu câu, viết hoa, chính tả.
12. [G13] Giảm lượng chữ phải đọc xuống mức cần thiết.

#### Câu dẫn
13. [G14] Lệnh làm bài rõ ràng.
14. [G15] Ý chính nằm trong câu dẫn; học sinh không phải đọc hết lựa chọn mới biết hỏi gì.
15. [G16] Không thêm chữ thừa.
16. [G17] Câu dẫn ở dạng khẳng định. Bắt buộc dùng phủ định (NOT) thì viết HOA và in đậm.

#### Lựa chọn
17. [G18] Số lựa chọn theo Trình tự.
18. [G19] Chỉ một lựa chọn đúng.
19. [G20] Vị trí đáp án đúng rải đều; không quá 2 câu liền nhau cùng một chữ cái.
20. [G21] Lựa chọn có thứ tự tự nhiên (số, thời gian) thì xếp theo thứ tự đó; còn lại theo điều 19.
21. [G22] Các lựa chọn không chồng lấn nhau.
22. [G23] Các lựa chọn đồng nhất về nội dung và cấu trúc.
23. [G24] Độ dài các lựa chọn gần bằng nhau.
24. [G27] Viết lựa chọn ở dạng khẳng định, trừ khi chính hình thức phủ định là mục tiêu của lesson.
25. [G28] Không để lộ đáp án bằng:
    - a. từ tuyệt đối (always, never);
    - b. lựa chọn lặp lại chữ của câu dẫn;
    - c. lựa chọn không khớp ngữ pháp với câu dẫn, trừ lựa chọn sai vì hình thức theo Trình tự;
    - d. lựa chọn đúng dài hơn hoặc chi tiết hơn;
    - e. hai lựa chọn giống nhau chỉ ra lựa chọn còn lại;
    - f. lựa chọn vô lý rõ ràng.
26. [G29] Mọi lựa chọn sai phải hợp lý với học sinh chưa nắm bài.
27. [G30] Lựa chọn sai lấy từ lỗi thật của học sinh (Lỗi thường gặp của Kiến thức).
28. [G25, G26] Không dùng "None of the above", "All of the above".
29. [G9] Không dùng lựa chọn tổ hợp ("1 và 2", "2 và 3").

#### Áp dụng theo dạng
- Q3, Q4, Q7: điều 1–29.
- Q5: điều 1–8, 10–16, 18, 25a–d.
- Q8: điều 1–8, 10–12, 18, 20.
- Q1, Q6, Q10: điều 1–8, 10–13, 18.
- Q2, Q12: điều 1–8, 10–13.

### Ràng buộc của các dạng
#### Q1 Điền từ
- Học sinh làm: viết từ hoặc cụm từ vào chỗ trống.
- Trên phiếu: chỗ trống trong câu; có thể có khung từ hoặc từ gốc trong ngoặc.
- Chấm: một đáp án đúng cho mỗi chỗ trống.
- Ràng buộc: có khung từ thì đáp án nằm trong khung; không có câu mà hai cách điền cùng đúng.

#### Q2 Viết câu
- Học sinh làm: viết một câu hoàn chỉnh.
- Trên phiếu: dòng kẻ dưới yêu cầu.
- Chấm: một đáp án mẫu; chấp nhận cách viết đúng khác cùng nghĩa.
- Ràng buộc: yêu cầu đủ rõ để suy được câu đúng từ dữ kiện; không viết sẵn khung câu.

#### Q3 Chọn A/B/C
- Học sinh làm: chọn một lựa chọn.
- Trên phiếu: lựa chọn xếp dọc dưới câu, mỗi lựa chọn một dòng.
- Chấm: đúng một lựa chọn đúng.
- Ràng buộc: các lựa chọn cùng loại từ, độ dài gần nhau; vị trí đáp án đúng rải đều A, B, C.

#### Q4 Chọn trong câu
- Học sinh làm: khoanh một vế đặt ngay trong câu.
- Trên phiếu: các vế nằm trong câu.
- Chấm: mỗi chỗ chọn đúng một vế đúng.
- Ràng buộc: các vế cùng gốc hoặc cùng loại từ. Vì các vế nằm trong câu, không áp dụng điều xếp dọc.

#### Q10 Bảng
- Học sinh làm: điền vào ô bảng.
- Trên phiếu: bảng có dòng tiêu đề cột; hàng mẫu điền sẵn; ô trống để điền.
- Chấm: mỗi ô cần điền có một đáp án.
- Ràng buộc: thông tin để điền có thật trong bài đọc hoặc dữ kiện; mỗi cột có tiêu đề rõ.

## Kiến thức
Giáo trình: Giáo trình mẫu
Unit: 3
Lesson: 2
Chuyên đề: Grammar
Cấp độ: Starters (cuối cấp)
Trình tự áp dụng: Grammar 2.3
Kiểu ngữ pháp: nghĩa

### Mục tiêu
- M1: Nói người hoặc con vật làm được việc gì bằng can.
- M2: Nói người hoặc con vật không làm được việc gì bằng can't.
- M3: Hỏi Can …? và trả lời Yes, … can. / No, … can't.

### Kiến thức
#### K1 can
- Cấu trúc: S + can + V (nguyên mẫu)
- Dùng khi: người hoặc con vật làm được việc đó.
- Ví dụ: Birds can fly. / I can ride a bike.
- Quy tắc hình thức: can không đổi theo chủ ngữ; động từ sau can giữ nguyên mẫu, không thêm -s, không có to.
- Dấu hiệu bề mặt: không có
- Câu hỏi lộ đáp án: không có

#### K2 can't
- Cấu trúc: S + can't + V (nguyên mẫu)
- Dùng khi: người hoặc con vật không làm được việc đó.
- Ví dụ: Elephants can't fly. / My brother can't swim.
- Quy tắc hình thức: như K1.
- Dấu hiệu bề mặt: … can …, but … (vế sau but, khi vế trước có can)
- Câu hỏi lộ đáp án: không có

#### K3 Câu hỏi Can …? và câu trả lời ngắn
- Cấu trúc: Can + S + V? — Yes, S can. / No, S can't.
- Dùng khi: hỏi ai đó làm được việc gì; câu trả lời theo dữ kiện.
- Ví dụ: Can you swim? Yes, I can. / Can a fish walk? No, it can't.
- Quy tắc hình thức: câu trả lời ngắn dùng can / can't, không lặp động từ; chủ ngữ của câu trả lời là đại từ.
- Dấu hiệu bề mặt: Yes, … / No, … (trong câu trả lời ngắn)
- Câu hỏi lộ đáp án: Can + S + V? (cho biết câu trả lời dùng can hoặc can't; chưa cho biết Yes hay No)

### Dạng câu cần phủ
- Loại câu: khẳng định; phủ định; câu hỏi Can …? và câu trả lời ngắn.
- Chủ ngữ: I; you; he / she; it; we; they; tên riêng; danh từ con vật số ít; danh từ con vật số nhiều.

### Từ vựng được dùng
- Từ trọng tâm: swim, run, jump, fly, sing, draw, ride, kick, catch, throw, read, write, play
- Danh từ gợi ý: fish, bird, frog, duck, monkey, horse, snake, elephant, crocodile, spider, cat, dog, bike, ball, kite, guitar, piano
- Tên nhân vật: Tom, Anna, Sam, Lucy, Ben
- Từ thêm ngoài nền: không có

### Ngoài phạm vi
- can để xin phép hoặc nhờ (Can I …? / Can you …? với nghĩa nhờ).
- could; be able to.
- Câu hỏi Wh- với can (What can you do?).

### Lỗi thường gặp
#### Lỗi hình thức
- *She can swims. (thêm -s cho động từ sau can)
- *He can to swim. (thêm to)
- *She cans swim. (thêm -s cho can)
- *Yes, I can't. / *No, I can. (Yes / No không khớp can / can't)
- *Can you swim? Yes, I do. (dùng do thay cho can)
#### Nhầm cách dùng
- Dùng can khi dữ kiện cho thấy không làm được (*Fish can walk.).
- Dùng can't khi dữ kiện cho thấy làm được (*Birds can't fly.).
- Trả lời Yes khi dữ kiện là không làm được, hoặc ngược lại.

### Theo từng B
#### B1
- Mẫu để quan sát: I can swim. I can't fly. Can you sing? Yes, I can. / No, I can't.
#### B5
- Dữ kiện gợi ý: ba bạn và năm việc (swim, ride a bike, sing, draw, play the piano), mỗi việc ghi yes hoặc no.

## Bố cục
### Danh sách Task
| Task | B | Dạng | Số câu | Mức độ |
|---|---|---|---|---|
| 1 | B1 Quan sát | Q10 bảng | 5 ô cần điền | Vừa |
| 2 | B2 Hiểu nghĩa và cách dùng | Q3 chọn A/B/C | 5 | Vừa |
| 3 | B3 Nhận diện hình thức | Q4 chọn trong câu | 5 | Vừa |
| 4 | B4 Tự tạo hình thức | Q1 điền từ | 5 | Vừa |
| 5 | B5 Dùng trong tình huống | Q2 viết câu | 5 | Vừa |

### Số liệu tính sẵn
| Task | Bài đọc | Phần đề tối đa | Câu hỏi lộ đáp án tối đa | Câu xác định bằng nghĩa tối thiểu | Vị trí bắt buộc |
|---|---|---|---|---|---|
| 1 | 65–75 từ | không áp dụng | không áp dụng | không áp dụng | không áp dụng |
| 2 | không có | 12 từ | 2 | 2 | câu 2, câu 4 |
| 3 | không có | 12 từ | không áp dụng | 2 | câu 2, câu 4 |
| 4 | không có | 12 từ | không áp dụng | 2 | câu 2, câu 4 |
| 5 | không có | 12 từ | không áp dụng | không áp dụng | không áp dụng |

### Ghi chú của giáo viên
Không có.

## Phiếu cần rà soát
<<DÁN PHIẾU ĐÃ BỎ ĐÁP ÁN VÀO ĐÂY>>
