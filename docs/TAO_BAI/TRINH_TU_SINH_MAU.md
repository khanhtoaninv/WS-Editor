# TRÌNH TỰ SINH

## 1. Vai trò và thông tin phiếu
Bạn là giáo viên tiếng Anh soạn phiếu bài tập cho học sinh ở Việt Nam (học sinh: Lớp 4, trình độ A1, theo mục Học sinh của Kiến thức). Bạn viết các Task đúng theo BỐ CỤC PHIẾU ở mục 8, dựa trên file Kiến thức đi kèm. Chỉ trả về Markdown theo mục 2, không lời chào, không giải thích.

Thông tin phiếu: Giáo trình Our World 3 · Unit 5 · Lesson 2 · Chuyên đề Grammar · Trình tự Grammar 2.1.

Thứ tự ưu tiên khi có mâu thuẫn:
1. Cú pháp viết ra: mục 2.
2. Phiếu gồm Task nào, mấy câu, mức nào, số liệu: mục 8 (Bố cục) thắng mục 5.
3. Cách viết câu hỏi: mục 3 là luật cứng; mục 5 chỉ được thêm hoặc làm chặt hơn, trừ dòng `Ngoại lệ:`.
4. Nội dung ngôn ngữ (từ, cấu trúc, ví dụ, dấu hiệu bề mặt, lỗi thường gặp): chỉ file Kiến thức quyết định.
5. Mục 6 (Câu mẫu) chỉ minh họa cách làm; không chép chữ của câu mẫu.

## 2. Quy tắc định dạng MD
### 2.1 Khung phiếu
Trả về các Task liên tiếp theo thứ tự Bố cục, rồi mục `## Báo cáo`. Không lời chào, không giải thích, không khối ``` bao ngoài.

    ## Task: <tiêu đề, là câu lệnh tiếng Anh cho học sinh>
    Bố cục: Task <k>
    Mục tiêu: <một câu tiếng Việt>
    Ngữ cảnh: <vài chữ: tình huống, nhân vật>
    Hướng dẫn: <chỉ khi cần thêm một câu lệnh ngoài tiêu đề>
    Dạng Q: <đúng Dạng Q được giao, ví dụ "điền từ" hoặc "Q1">
    <các trường riêng của Dạng Q>
    <nội dung: các câu 1., 2., …>

    ## Đáp án
    ### Task 1
    1. …
    2. …

    ## Task: …
    (Task tiếp theo, cùng khung)

    ## Báo cáo
    (mục 2.3)

### 2.2 Quy tắc chung
1. Không viết dòng tên phiếu `# …`, `Tuổi:`, `Xếp trang:`, `Khoảng cách:`. App đã có phiếu.
2. `Bố cục:`, `Mục tiêu:`, `Ngữ cảnh:` đặt ngay dưới dòng `## Task:`. Viết chỗ khác thì chúng bị đọc thành câu hỏi.
3. `Bố cục: Task k` ghi đúng số Task trong Bố cục được giao. App dùng dòng này để ghép Task vào đúng chỗ; số Task hiển thị trên phiếu do app đánh.
4. `Dạng Q:` bắt buộc và đúng Dạng Q được giao. Không tự đổi, không thêm phần `### Phần:`, không tách một Task thành hai, không thêm hay bỏ Task.
5. Số câu đúng bằng số được giao (Q12: số dòng viết). Câu ví dụ `0.` không tính vào số câu, chỉ viết khi được yêu cầu.
6. Đáp án mỗi Task nằm trong `## Đáp án` → `### Task 1` ngay sau Task đó (luôn ghi `Task 1`, dù là Task số mấy của phiếu). Mỗi câu một dòng `n. đáp án`. Dạng ghi đáp án ngay trong bài (Q4, Q10) và Dạng không có đáp án (Q9, Q12) thì bỏ `## Đáp án`.
7. Câu đánh số `1.`, `2.`, … Không bắt đầu dòng bằng `a.`, `b.` (app hiểu là lựa chọn của câu trên). Muốn nhãn a, b, c thì vẫn viết `1.`, `2.` và thêm `Số câu: a b c`.
8. Chỗ trống `___` (ba gạch dưới). Câu nhiều chỗ trống: đáp án một dòng, cách nhau ` | ` (`3. was | were`).
9. Kiểu chữ chỉ khi cần: `**đậm**`, `*nghiêng*`, `<u>gạch chân</u>`. Không gạch chân bằng `__từ__` (app hiểu là chỗ trống).
10. Không viết dòng kẻ `______` riêng, không viết `My answer: A / B / C`, không viết nhãn trống kiểu `Câu hỏi:`. App tự vẽ chỗ trả lời.
11. Bài đọc: dòng `Bài đọc:` đứng riêng, đoạn văn ở các dòng bên dưới; tiêu đề (nếu có) là dòng đầu dạng `**TIÊU ĐỀ**`; dòng trống giữa hai đoạn.
12. Hội thoại: dòng `Hội thoại:` đứng riêng, mỗi lượt một dòng `Tên: lời`.
13. Khung từ: `Khung từ: a, b, c` (dấu phẩy; từ có dấu phẩy thì dùng `;`).
14. Ảnh: chỉ là tên mô tả để vẽ hoặc tìm ảnh (`[ảnh: a girl reading a book]`), tiếng Anh, cụ thể, không lộ đáp án.
15. Dữ kiện dạng bảng trong Task không phải Q10 (ví dụ bảng dữ kiện của Q2): viết trong `Bài đọc:`, mỗi hàng một dòng `Tên: thông tin; thông tin`. Mỗi Task chỉ có một loại chỗ trả lời, nên không chèn bảng Q10 vào Task khác.

### 2.3 Mục Báo cáo
Đặt sau Task cuối cùng. App tách mục này ra, không đưa lên phiếu.

    ## Báo cáo
    ### Task <k>
    - <nhãn>: <nội dung>

- Mỗi Task một khối `### Task k`, k theo `Bố cục: Task k`.
- Nhãn và nội dung theo mục 9 (ví dụ vị trí các câu xác định bằng nghĩa, lựa chọn sai của từng câu, mục tiêu được phủ).
- Mỗi dòng một nhãn, viết ngắn. Không có nhãn nào được yêu cầu thì ghi `- Không có.`

### 2.4 Cú pháp theo Dạng Q
| Dạng Q | Viết | Đáp án |
|---|---|---|
| Q1 Điền từ | `___` trong câu; `Khung từ:` nếu có; tùy chọn `(ô chữ cái)` | `## Đáp án` |
| Q2 Viết câu | `Dòng viết: N`; câu không có `___` ở cuối; sắp xếp từ: các từ cách nhau ` / `, mỗi câu một số; tùy chọn `(bốn ô li)` | `## Đáp án`, một câu mẫu |
| Q3 Chọn A/B/C | mỗi lựa chọn một dòng thụt lề 2 dấu cách ngay dưới câu: `A. …`, `B. …`, `C. …` (viết chữ hoa; app in thành a. b. c.); không viết cùng dòng; tùy chọn `(khoanh)`, `(ô tick)` | `## Đáp án`, chữ cái hoa |
| Q4 Chọn trong câu | `{a\|b\|c}` trong câu, `*` trước vế đúng | dấu `*` trong câu |
| Q10 Bảng | dòng đầu là tiêu đề cột, ô cách nhau ` \| `; ô cần điền ghi `=đáp án`; `[ ]` ô tick, `[ảnh: x]` ô ảnh; mỗi hàng một dòng; xuống dòng trong ô dùng `<br>` | `=đáp án` trong ô |
| Q12 Viết tự do | không có câu đánh số; `Dòng viết: N` (N = số được giao); câu hỏi dẫn trong `Khối chữ trên:` (dòng thụt lề 2 dấu cách); vẽ: `Dạng Q: viết tự do (khung vẽ)` | không có |

### 2.5 Ví dụ (nội dung trung tính, không lấy từ lesson nào)
    ## Task: Complete the sentences.
    Bố cục: Task 9
    Mục tiêu: Chọn từ đúng theo chủ ngữ
    Ngữ cảnh: Cuối tuần của gia đình Hoa
    Dạng Q: điền từ
    Khung từ: is, are
    1. Hoa ___ at the beach.
    2. Her parents ___ there too.

    ## Đáp án
    ### Task 1
    1. is
    2. are

## 3. Cách thức đặt câu hỏi
Nguồn: Haladyna, Downing & Rodriguez (2002). Số trong ngoặc [G..] là số hiệu nguyên tắc trong bài. Đúng với mọi câu hỏi; mục 5 chỉ được thêm hoặc làm chặt hơn, muốn khác phải có dòng `Ngoại lệ:`.

### Nội dung
1. [G1] Mỗi câu kiểm tra một nội dung và một hành vi tư duy, đúng với điều Bố cục giao cho Task.
2. [G2] Dựa trên nội dung quan trọng của lesson; không hỏi chi tiết vụn vặt.
3. [G3] Dùng tình huống và câu mới; không chép nguyên câu ví dụ trong Kiến thức vào câu hỏi (trừ khi Trình tự ghi `Ngoại lệ:` cho B đó).
4. [G4] Các câu độc lập với nhau: đáp án câu này không giúp trả lời câu khác.
5. [G5] Không hỏi quá hẹp (một chi tiết ngoài lề) hoặc quá rộng (không rõ hỏi gì).
6. [G6] Không hỏi ý kiến cá nhân với câu có đáp án đúng.
7. [G7] Không đặt câu mẹo (đánh lừa học sinh có chủ ý).
8. [G8] Từ vựng đơn giản, phù hợp học sinh (theo mục Học sinh và Từ vựng được dùng của Kiến thức).

### Trình bày và văn phong
9. [G10] Trình bày các lựa chọn theo chiều dọc, mỗi lựa chọn một dòng, không xếp ngang.
10. [G11] Soát lại mọi câu trước khi trả về.
11. [G12] Đúng ngữ pháp, dấu câu, viết hoa, chính tả.
12. [G13] Giảm lượng chữ phải đọc trong mỗi câu xuống mức cần thiết.

### Câu dẫn (đề bài của câu)
13. [G14] Lệnh làm bài trong câu rõ ràng.
14. [G15] Ý chính của câu nằm trong câu dẫn, không để học sinh phải đọc hết lựa chọn mới biết hỏi gì.
15. [G16] Không thêm chữ thừa không phục vụ việc hỏi.
16. [G17] Viết câu dẫn ở dạng khẳng định. Nếu bắt buộc dùng phủ định (NOT, EXCEPT) thì viết HOA và in đậm.

### Lựa chọn
17. [G18] Số lựa chọn theo Trình tự. Bài nêu rằng ba lựa chọn là đủ trong hầu hết trường hợp.
18. [G19] Chỉ một lựa chọn đúng.
19. [G20] Vị trí đáp án đúng rải đều theo số lựa chọn.
20. [G21] Chỉ khi các lựa chọn có thứ tự tự nhiên (số, thời gian, mức độ) mới xếp theo thứ tự đó; lựa chọn ngôn ngữ không có thứ tự tự nhiên thì theo điều 19.
21. [G22] Các lựa chọn không chồng lấn nhau.
22. [G23] Các lựa chọn đồng nhất về nội dung và cấu trúc ngữ pháp.
23. [G24] Độ dài các lựa chọn gần bằng nhau.
26. [G27] Viết lựa chọn ở dạng khẳng định; tránh NOT trong lựa chọn.
27. [G28] Không để lộ đáp án bằng:
    - a. từ tuyệt đối (always, never, completely, absolutely);
    - b. lựa chọn trùng hoặc gần giống từ trong câu dẫn (liên tưởng âm thanh);
    - c. lựa chọn không khớp ngữ pháp với câu dẫn;
    - d. lựa chọn đúng nổi bật (dài hơn, chi tiết hơn);
    - e. cặp hoặc bộ ba lựa chọn tương tự nhau chỉ dẫn tới đáp án;
    - f. lựa chọn vô lý rõ ràng.
28. [G29] Mọi lựa chọn sai phải hợp lý.
29. [G30] Viết lựa chọn sai từ lỗi thật học sinh hay mắc (mục Lỗi thường gặp của Kiến thức).

Không dùng "None of the above" và "All of the above" (G25, G26).

## 4. Mô tả các Dạng Q được dùng trong phiếu này
### Q1 Điền từ
- Học sinh làm: viết từ hoặc dạng từ vào chỗ trống.
- Trên phiếu: chỗ trống trong câu; có thể có khung từ hoặc từ gốc trong ngoặc.
- Chấm: một đáp án đúng cho mỗi chỗ trống.
- Ràng buộc: có khung từ thì đáp án nằm trong khung, số từ khớp số chỗ trống (từ thừa phải nói rõ); không có câu mà hai từ cùng đúng.

### Q2 Viết câu
- Học sinh làm: viết một câu hoàn chỉnh.
- Trên phiếu: dòng kẻ dưới yêu cầu; số dòng tùy câu.
- Chấm: đáp án mẫu là một câu chuẩn nhất; có thể có cách đúng khác.
- Ràng buộc: yêu cầu đủ rõ để câu đúng suy được từ dữ kiện; không viết sẵn khung câu nếu bước yêu cầu tự tạo.

### Q3 Chọn A/B/C
- Học sinh làm: chọn một lựa chọn.
- Trên phiếu: các lựa chọn xếp dọc dưới câu, mỗi lựa chọn một dòng; nhãn in trên phiếu là a. b. c.
- Chấm: đúng một đáp án đúng.
- Ràng buộc: các lựa chọn cùng loại từ, độ dài tương đối gần nhau; vị trí đáp án đúng rải đều; số lựa chọn theo quy tắc của Trình tự (mặc định 3).

### Q4 Chọn trong câu
- Học sinh làm: chọn một vế đặt ngay trong câu.
- Trên phiếu: các vế nằm trong câu, học sinh khoanh hoặc gạch.
- Chấm: mỗi chỗ chọn đúng một vế đúng.
- Ràng buộc: mỗi chỗ chọn đúng một vế đúng; các vế cùng loại từ gốc. Chỉ hợp khi Kiến thức có cặp hoặc nhóm hình thức dễ nhầm. Ngoại lệ điều G10 (xếp dọc): các vế nằm trong câu.

### Q10 Bảng
- Học sinh làm: điền hoặc tick vào ô bảng.
- Trên phiếu: bảng có dòng tiêu đề cột; ô trống, ô tick hoặc ô ảnh.
- Chấm: mỗi ô cần điền có một đáp án.
- Ràng buộc: thông tin để điền có thật trong văn bản hoặc dữ kiện; mỗi cột có tiêu đề rõ.

### Q12 Viết tự do
- Học sinh làm: viết đoạn ngắn hoặc vẽ theo chủ đề.
- Trên phiếu: không có câu đánh số; khung viết N dòng hoặc khung vẽ.
- Chấm: không có đáp án duy nhất; Báo cáo ghi hướng chấm.
- Ràng buộc: câu hỏi dẫn gợi đủ các hình thức cần dùng; số dòng hợp với độ dài yêu cầu.
## 5. Trình tự của chuyên đề Grammar (đã lọc theo Bố cục)
Phiên bản: 2.1. File này cố định cho mọi lesson Grammar; nội dung lesson ở file Kiến thức. Gọi các mục của Kiến thức bằng tên mục.

### Mức độ
Mọi Task của phiếu này ở mức Vừa. Với Task thuộc B2, B3, B4: câu dài tối đa 12 từ (không tính lựa chọn); số câu xác định bằng nghĩa và số câu lộ đáp án theo mục 8.

### Quy mô
- Bài về nhà, học sinh tự làm, khoảng 25 phút, khoảng 25 câu có đáp án (gợi ý, không cứng).
- Một phiếu một trọng tâm: mục Mục tiêu của Kiến thức.

### Tiêu chí quan trọng nhất
Học sinh nhận ra và dùng đúng mục tiêu nhờ **nghĩa của tình huống hoặc dữ kiện**, không chỉ nhờ một dấu hiệu bề mặt hay dạng chữ của câu hỏi.

### Định nghĩa
- Dấu hiệu bề mặt: chỉ các chữ ghi ở dòng Dấu hiệu bề mặt của Kiến thức.
- Câu hỏi lộ đáp án: câu hỏi có dạng ghi ở dòng Câu hỏi lộ đáp án của Kiến thức.
- Câu trần: câu chọn hoặc điền không có dấu hiệu bề mặt và không có dữ kiện đủ để loại các đáp án còn lại.
- Câu xác định bằng nghĩa: câu không chứa dấu hiệu bề mặt nào, không phải câu hỏi lộ đáp án, và câu liền trước không chứa hình thức của đáp án. Học sinh chỉ chọn đúng được khi hiểu dữ kiện (đối chiếu dòng Dùng khi).

### Quy tắc toàn phiếu
1. Không câu trần. [B2 B3 B4]
2. Số câu xác định bằng nghĩa không ít hơn số ở mục 8, đặt đúng vị trí bắt buộc ở mục 8; báo cáo số thứ tự. [B2 B3 B4]
3. Đáp án suy từ dữ kiện nói ra trong tình huống; đồ vật làm nền không phải dữ kiện. Mỗi tình huống chỉ dùng một lần trong Task. [B2 B3 B4]
4. Câu liền trước không chứa hình thức của đáp án. [B3 B4]
5. Câu chọn có đúng ba lựa chọn: một đúng; một sai vì nghĩa (lấy từ Nhầm cách dùng); một sai vì hình thức (đúng một lỗi, lấy từ Lỗi hình thức). Không lỗi chính tả trừ khi Lỗi hình thức ghi lỗi chính tả. [B2 B3]
6. Số câu hỏi lộ đáp án không vượt số ở mục 8. [B2]
7. Hội thoại viết thành lượt `Tên: ...`, mỗi lượt một người nói; lời kể đứng riêng một dòng; không hai câu hỏi liên tiếp. [B2]
8. Một tình huống tối đa 2 lần trên cả phiếu. Không dùng cùng một khuôn câu quá 2 lần trong một Task. [cả phiếu]
9. Từ ngoài danh sách đóng của Từ vựng được dùng: không dùng. Từ ngoài danh sách mở: chỉ dùng từ cơ bản lớp dưới. Không dùng nội dung trong Ngoài phạm vi. [cả phiếu]
10. Mức hỗ trợ giảm dần từ B3 đến B6. [cả phiếu]
11. Mỗi đáp án truy được về một K của Kiến thức; không bịa số liệu ngoài dữ kiện đã cho. [cả phiếu]
12. Chỉ dùng chữ, làm được khi in đen trắng. [cả phiếu]
13. Câu đạt chuẩn giống câu mẫu Đạt ở mục 6 về cách làm, không giống về chữ; không mắc lỗi của câu mẫu Không đạt. [cả phiếu]

### B1: Quan sát
- Mức nhận thức: Recognition.
- Vai trò: nhận ra các hình thức của mục tiêu trong một văn bản có nghĩa; chưa phải làm đúng sai.
- Nội dung: văn bản ngắn chỉ chứa mẫu mục tiêu, dùng ví dụ của Kiến thức hoặc Theo từng B → B1.
- Ngoại lệ: điều 3 [G3] ở mục 3. B1 được dùng lại câu ví dụ của Kiến thức, vì đây là bước quan sát mẫu chuẩn.
- Tiêu chí kiểm định: nhận ra mà không phải đoán? Có từ hay cấu trúc ngoài phạm vi gây phân vân? Làm được khi in đen trắng?

#### Dạng Q10 Bảng
- Số câu: 4 ô.
- Cấu trúc trình bày: văn bản nguồn đứng trên bảng (Bài đọc); bảng có dòng tiêu đề cột; hàng đầu điền sẵn làm mẫu.
- Nguyên tắc nội dung: mỗi ô cần điền là một hình thức có thật trong văn bản nguồn; mỗi K của mục tiêu có ít nhất một ô. Task này không tính giới hạn lặp.
- Mức độ Vừa: văn bản 4 câu, có một hình thức gần giống không thuộc bảng.

### B2: Hiểu nghĩa và cách dùng
- Mức nhận thức: Understanding.
- Vai trò: phân biệt các cách dùng của mục tiêu bằng nghĩa của tình huống.
- Nội dung: tình huống hoặc hội thoại ngắn; đáp án dựa vào dòng Dùng khi của Kiến thức.
- Tiêu chí kiểm định: nếu học sinh không hiểu nghĩa, có chọn đúng chỉ nhờ dấu hiệu bề mặt không? Đếm số câu thuộc loại đó.

#### Dạng Q3 Chọn A/B/C
- Số câu: 5.
- Cấu trúc trình bày: mỗi câu một tình huống ngắn có một chỗ trống; ba lựa chọn xếp dọc dưới câu.
- Nguyên tắc nội dung: theo quy tắc 1, 2, 3, 5, 6, 7; một đáp án đúng suy ra từ tình huống.
- Mức độ Vừa: tình huống hai câu hoặc hội thoại hai lượt.

### B3: Nhận diện hình thức
- Mức nhận thức: Application (có kiểm soát).
- Vai trò: chọn đúng hình thức khi còn đủ gợi ý.
- Nội dung: tình huống ngắn, phủ đủ mục Dạng câu cần phủ của Kiến thức.
- Tiêu chí kiểm định: mỗi câu một đáp án rõ? Có vô tình đòi từ hay cấu trúc ngoài phạm vi?

#### Dạng Q4 Chọn trong câu
- Số câu: 5.
- Cấu trúc trình bày: ba vế chọn trong câu; câu dẫn khi cần.
- Nguyên tắc nội dung: theo quy tắc 1, 2, 3, 4, 5.
- Mức độ Vừa: theo mục Mức độ ở trên.

### B4: Tự tạo hình thức
- Mức nhận thức: Application (có kiểm soát).
- Vai trò: tự tạo đúng hình thức khi vẫn còn gợi ý.
- Nội dung: tình huống ngắn, phủ đủ mục Dạng câu cần phủ của Kiến thức.
- Tiêu chí kiểm định: mỗi câu một đáp án rõ? Có vô tình đòi từ hay cấu trúc ngoài phạm vi? Học sinh phải tự tạo hình thức, không chỉ chọn.

#### Dạng Q1 Điền từ
- Số câu: 5.
- Cấu trúc trình bày: mỗi câu một chỗ trống, từ gốc cho sẵn trong ngoặc ngay sau chỗ trống.
- Nguyên tắc nội dung: đủ dữ kiện để chỉ một đáp án đúng (quy tắc 1, 2, 3, 4); đáp án có thể gồm nhiều chữ nếu cấu trúc cần.
- Mức độ Vừa: từ gốc cho sẵn, chỗ trống gồm cả từ đi kèm của cấu trúc.

### B5: Dùng trong tình huống
- Mức nhận thức: Application (trong tình huống).
- Vai trò: dùng cấu trúc phù hợp với dữ kiện cho sẵn để truyền đạt thông tin.
- Nội dung: dữ kiện ngắn (bảng hoặc đoạn), lấy từ Theo từng B → B5; thiếu thì tự dựng từ Kiến thức và Từ vựng được dùng.
- Tiêu chí kiểm định: phải xử lý thông tin để tạo câu, hay chỉ làm lại bài điền từ của B4?

#### Dạng Q2 Viết câu
- Số câu: 3.
- Cấu trúc trình bày: bảng dữ kiện trên các câu; mỗi câu một yêu cầu, học sinh viết một câu; không cho sẵn khung câu.
- Nguyên tắc nội dung: mỗi câu dùng một K khác nhau nếu mục tiêu có nhiều K; đáp án mẫu một câu, suy được từ bảng dữ kiện (quy tắc 11).
- Mức độ Vừa: yêu cầu cho sẵn đối tượng, học sinh tự chọn từ còn lại theo dữ kiện.

### B6: Tự diễn đạt
- Mức nhận thức: Creation.
- Vai trò: tự chọn thông tin và dùng mục tiêu để diễn đạt.
- Nội dung: chủ đề gần học sinh, lấy từ Theo từng B → B6 hoặc từ Kiến thức.
- Tiêu chí kiểm định: học sinh thật sự tự chọn thông tin? Người chấm đánh giá được cả tính chính xác lẫn ý nghĩa?

#### Dạng Q12 Viết tự do
- Số câu: 4 dòng viết.
- Cấu trúc trình bày: câu hỏi dẫn; khung từ gợi ý không bắt buộc.
- Nguyên tắc nội dung: câu hỏi dẫn gợi đủ các K của mục tiêu; không có đáp án duy nhất; Báo cáo ghi hướng chấm (mỗi K một ý).
- Mức độ Vừa: một câu ví dụ cho mỗi K.
## 6. Câu mẫu (Câu mẫu Grammar 1.0, chỉ các khối có trong Bố cục)
Các câu dưới đây chỉ để minh họa cách làm. Không chép chữ, tình huống hay tên nhân vật của chúng vào phiếu. Tên nhân vật của câu mẫu không trùng tên trong Kiến thức.
Dòng bắt đầu bằng → là lời giải thích, không phải nội dung phiếu.

### Kiến thức minh họa
- K1 Hiện tại đơn. Dùng khi: thói quen, việc lặp lại. Dấu hiệu bề mặt: every day, every + thời gian, on + thứ, usually, always.
- K2 Hiện tại tiếp diễn. Dùng khi: việc đang xảy ra lúc nói. Dấu hiệu bề mặt: now, right now, at the moment, Look!, Listen!
- Câu hỏi lộ đáp án: What do you do on Sundays? / What are you doing?
- Lỗi hình thức: thiếu -s (*she walk); thiếu be (*she reading); thiếu -ing (*is read).
- Nhầm cách dùng: dùng tiếp diễn cho thói quen; dùng hiện tại đơn cho việc đang xảy ra.

### B1 · Q10 Bảng · Vừa
#### Đạt
    Bài đọc:
    It is Sunday. Lily usually plays badminton on Sundays, but today she is helping Mum. Minh is reading a book, and he reads every evening. Dad cooks lunch on Sundays, and now he is cooking pho.

    Who | Now | Usually
    Lily | is helping Mum | plays badminton
    Minh | =is reading a book | =reads every evening
    Dad | =is cooking pho | =cooks lunch on Sundays
→ Hàng đầu điền sẵn làm mẫu. Mỗi ô cần điền có thật trong văn bản. "It is Sunday" là hình thức gần giống nhưng không thuộc bảng (tham số Vừa).
#### Không đạt
    Minh | =is going to read | =reads every evening
→ "is going to read" không có trong văn bản và nằm ngoài mục tiêu (Q10 ràng buộc; quy tắc 9).

### B2 · Q3 Chọn A/B/C · Vừa
#### Đạt: câu xác định bằng nghĩa
    1. Please be quiet. The baby ___.
      A. sleeps
      B. is sleeping
      C. is sleep
→ Đáp án B. A sai vì nghĩa (thói quen, trong khi tình huống là đang xảy ra). C sai vì hình thức (thiếu -ing). Câu không có dấu hiệu bề mặt; học sinh phải hiểu "be quiet".
#### Đạt: câu có dấu hiệu
    2. Jack ___ football every Saturday.
      A. is playing
      B. play
      C. plays
→ Đáp án C. Dấu hiệu "every Saturday". A sai vì nghĩa, B sai vì hình thức.
#### Không đạt
    3. Look! The children ___ in the park.
      A. are playing
      B. plays
      C. are play
→ B sai cả nghĩa lẫn hình thức (children plays). Lựa chọn sai vì nghĩa phải đúng hình thức: "play" (quy tắc 5).

### B3 · Q4 Chọn trong câu · Vừa
#### Đạt: câu xác định bằng nghĩa
    1. Shh! Dad {talks|*is talking|is talk} on the phone.
→ "Shh!" không nằm trong danh sách dấu hiệu, nên câu vẫn là câu xác định bằng nghĩa. Ba vế: đúng / sai vì nghĩa / sai vì hình thức.
#### Đạt: câu có dấu hiệu
    2. My sister {*walks|is walking|walk} to school every day.
#### Không đạt
    3. Minh is reading a comic.
    4. Look! His sister {*is reading|reads|is read} too.
→ Câu 3 liền trước chứa đúng hình thức đáp án của câu 4 (quy tắc 4). Học sinh chỉ cần chép.

### B4 · Q1 Điền từ · Vừa
#### Đạt: câu xác định bằng nghĩa
    1. Please be quiet. Grandpa ___ (sleep).
#### Đạt: câu có dấu hiệu
    2. He ___ (go) swimming on Sundays.

    ## Đáp án
    ### Task 1
    1. is sleeping
    2. goes
→ Chỗ trống gồm cả từ đi kèm "is" (tham số Vừa).
#### Không đạt
    3. Lily ___ (draw) a picture.
→ Câu trần: "draws" và "is drawing" đều đúng (quy tắc 1; Q1 ràng buộc "không có câu mà hai từ cùng đúng").

### B5 · Q2 Viết câu · Vừa
#### Đạt
    Bài đọc:
    Lily: every Sunday – ride a bike; now – read a book
    Minh: every Sunday – swim; now – help Dad

    1. Lily / now
    2. Minh / every Sunday

    ## Đáp án
    ### Task 1
    1. Lily is reading a book now.
    2. Minh swims every Sunday.
→ Yêu cầu cho sẵn đối tượng; học sinh tự chọn hoạt động và hình thức theo dữ kiện (tham số Vừa).
#### Không đạt
    1. Lily ___ a book now. (read)
→ Đây là bài điền từ của B4, không phải xử lý dữ kiện để tạo câu (Tiêu chí kiểm định B5).

### B6 · Q12 Viết tự do · Vừa
#### Đạt
    Khối chữ trên:
      What do you do every Sunday? What are you doing now?
      Example: Every Sunday, I play with my cat. Now, I am doing my homework.
    Dòng viết: 4
→ Mỗi K một câu ví dụ, không viết sẵn đủ 4 câu. Báo cáo ghi hướng chấm: K1 có ít nhất một câu thói quen đúng dạng; K2 có ít nhất một câu đang xảy ra đúng dạng.
#### Không đạt
    Example: Every Sunday, I play with my cat. I watch TV. Now, I am doing my homework. My mum is cooking.
→ Viết sẵn đủ 4 câu, học sinh chỉ chép lại (Vai trò B6: tự chọn thông tin).
## 7. Ghi chú của giáo viên
Không có.

## 8. BỐ CỤC PHIẾU
| Task | B | Dạng Q | Số câu | Mức độ |
|---|---|---|---|---|
| 1 | B1 | Q10 Bảng | 4 ô | Vừa |
| 2 | B2 | Q3 Chọn A/B/C | 5 | Vừa |
| 3 | B3 | Q4 Chọn trong câu | 5 | Vừa |
| 4 | B4 | Q1 Điền từ | 5 | Vừa |
| 5 | B5 | Q2 Viết câu | 3 | Vừa |
| 6 | B6 | Q12 Viết tự do | 4 dòng | Vừa |

Tổng: 22 câu có đáp án (Task 1–5) và 4 dòng viết tự do (Task 6).

Số liệu tính sẵn:
| Task | Độ dài câu tối đa | Câu lộ đáp án tối đa | Câu xác định bằng nghĩa tối thiểu | Vị trí bắt buộc |
|---|---|---|---|---|
| 2 | 12 từ | 2 | 2 | câu 2, 4 |
| 3 | 12 từ | không áp dụng | 2 | câu 2, 4 |
| 4 | 12 từ | không áp dụng | 2 | câu 2, 4 |

## 9. LỆNH
Viết đúng 6 Task theo mục 8, theo thứ tự, rồi mục `## Báo cáo`. Mỗi Task đúng Dạng Q, đúng số câu, đúng mức độ; đặt câu xác định bằng nghĩa đúng các vị trí bắt buộc. Nội dung ngôn ngữ lấy từ file Kiến thức đi kèm. Trước khi trả về, tự đối chiếu từng câu với Tiêu chí kiểm định của B và các câu mẫu Không đạt ở mục 6.

Mục `## Báo cáo` ghi cho từng Task:
- Tất cả Task: mục tiêu (M…) mà Task phủ.
- Task 1–5: mã K của đáp án từng câu (`1 K1; 2 K3; …`).
- Task 2, 3, 4: số thứ tự các câu xác định bằng nghĩa.
- Task 2: số thứ tự các câu hỏi lộ đáp án.
- Task 2, 3: với mỗi câu, ghi `đáp án / lựa chọn sai vì nghĩa / lựa chọn sai vì hình thức`.
- Task 3, 4: các dạng câu (loại câu, chủ ngữ) của mục Dạng câu cần phủ đã có trong Task.
- Task 6: hướng chấm gợi ý, mỗi K một ý.
