# Quy ước MD trung gian cho WS Editor (P2)

Cập nhật: 2026-10-25 (tối) · áp dụng từ bản prototype **v67** (v65 + sửa theo phiếu thật đầu tiên “A Surprise Birthday Party”, mục 4b và ví dụ 4).

MD (Markdown) là cách viết một phiếu bằng chữ thường mà app đọc **chắc chắn**, không phải đoán. Dùng khi:
- tự soạn phiếu trong Word / Notes rồi dán vào app;
- Claude (hoặc AI của WS Studio) đọc PDF sách và ra MD thay cho JSON khi muốn người dùng dễ đọc, dễ sửa tay.

Nạp MD: **+ Task → thẻ “Từ file / dán”** (thêm các Task vào cuối phiếu) hoặc **+ Phiếu** (tạo phiếu mới). Chọn file `.md` / `.txt` hoặc dán thẳng. App tự nhận ra MD khi có ít nhất một dòng bắt đầu bằng `## Task`.

JSON vẫn là nguồn chính (đủ mọi trường, kể cả bố cục đã chỉnh). MD chỉ chở **nội dung**: chữ, câu, ảnh (tên), khung từ, loại đáp án, đáp án đúng. Bố cục do app tự dàn.

---

## 1. Khung một file

```
# Tên phiếu                    ← tùy chọn (dùng khi tạo phiếu mới)
Tuổi: 7-9                      ← tùy chọn: 5-6 | 7-9 | 10-12
Xếp trang: liền                ← tùy chọn: liền | tách
Khoảng cách: vừa               ← tùy chọn: gọn | vừa | thoáng

## Task: <tiêu đề Task>        ← BẮT BUỘC, mỗi Task bắt đầu bằng dòng này
...các dòng của Task...

## Task: <tiêu đề Task tiếp>
...

## Đáp án                      ← tùy chọn, luôn đặt CUỐI file, tách khỏi đề
...
```
- Các dòng trước `## Task` đầu tiên chỉ dùng cho cấp phiếu. Khi dùng **+ Task**, chúng bị bỏ qua (app báo).
- **Mỗi file một phiếu.** Phiếu có nhiều nhóm (vd. “Students 1 and 2 / 3 and 4”) thì tách thành nhiều file.
- Số Task tối đa mỗi lần nhập: 40.

## 2. Trường của một Task (dòng `Tên: giá trị`)

| Trường | Ý nghĩa | Ví dụ |
|---|---|---|
| `Hướng dẫn:` | dòng hướng dẫn dưới tiêu đề | `Hướng dẫn: Circle a, b or c.` |
| `Track:` | số track nghe (tự có mục Mã QR) | `Track: Track 05` |
| `Trả lời:` | loại chỗ trả lời (bảng mục 3). **Nên ghi** để app khỏi đoán | `Trả lời: viết câu` |
| `Dòng viết:` | số dòng viết mỗi câu (viết câu / điền chỗ trống cuối câu) | `Dòng viết: 2` |
| `Khung từ:` | từ cách nhau bằng dấu phẩy (từ có dấu phẩy thì dùng `;`) | `Khung từ: kitchen, garden, bedroom` |
| `Ảnh:` | ảnh chung của Task (tên ảnh, ảnh thật tải sau) | `Ảnh: the park` |
| `Lời dẫn:` | câu dẫn trước hội thoại | `Lời dẫn: Mai is talking to Ben.` |
| `Mẫu:` | ép theo một mẫu có sẵn (tên hoặc mã), thay cho `Trả lời:` | `Mẫu: Đúng/Sai` |
| `Ghi chú:` | lời nhắc của bài (vd câu nằm dưới bài trong bản gốc); app nối vào cuối hướng dẫn | `Ghi chú: Check them after reading.` |

Tên trường viết hoa hay thường đều được; có bản tiếng Anh: `Instruction`, `Audio`, `Answer type`, `Words`, `Image`, `Intro`.

## 3. Giá trị của `Trả lời:`

| Viết | Chỗ trả lời trên phiếu |
|---|---|
| `viết từ` | ô trống viết một từ dưới mỗi câu / ảnh |
| `điền chỗ trống` | gạch `___` ngay trong câu |
| `viết câu` | dòng kẻ để viết câu |
| `khoanh A/B/C` (hoặc `khoanh`, `chọn A/B/C`) | lựa chọn A, B, C dưới câu |
| `chọn trong câu` (hoặc `gạch chân`) | lựa chọn `{a|b}` ngay trong câu |
| `tick` | lựa chọn bằng chữ có ô ☐ (`☐ a cake ☐ a football`) → các lựa chọn có ô tick; lựa chọn là ảnh (`A. [ảnh: x]` hoặc tên ảnh) → nhiều ảnh lựa chọn, tick ảnh |
| `đúng/sai` | ô T / F |
| `nối` | chấm nối hai vế |
| `tô chữ` | dòng tô chữ |
| `không` | không có chỗ trả lời (tô màu, vẽ, hỏi đáp miệng) |

Không ghi `Trả lời:` thì app đoán theo ký hiệu như khi dán chữ, và ghi “do hệ thống đoán” nếu độ chắc chưa cao.

## 4. Nội dung

- **Câu đánh số:** `1. …`, `2) …`, `(3) …`. Trong câu dùng các ký hiệu sẵn có:
  `___` chỗ trống · `{a|b}` chọn trong câu · `A. … B. … C. …` lựa chọn (cùng dòng, hoặc mỗi lựa chọn một dòng ngay dưới câu, thụt lề hay không đều được) · `☐ …` lựa chọn có ô tick (cũng nhận `[ ]`, `□`; cùng dòng hoặc mỗi dòng một lựa chọn) · `[ảnh: tên]` ảnh của câu · `trái - phải` một cặp nối (vế trái là ảnh: `[ảnh: apple] - pear`).
- **Câu chỉ có lựa chọn** (không có thân câu, vd chọn ý chính của bài đọc): `1. A. … B. … C. …` hoặc `☐ a cake ☐ a football ☐ balloons`.
- **Câu nhiều dòng:** dòng **thụt lề** (≥ 2 dấu cách) ngay dưới một câu đánh số là dòng tiếp của câu đó.
- **Bài đọc:** dòng `Bài đọc:` rồi các đoạn văn; **dòng trống giữa hai đoạn = sang đoạn mới** (giữ trên phiếu). Hết bài đọc khi gặp câu đánh số, lựa chọn, dòng bảng hoặc dòng trường.
- **Hội thoại:** dòng `Hội thoại:` rồi mỗi lượt một dòng `Tên: lời`. **Chỉ nhận hội thoại qua khối này** (từ v67): câu đánh số dạng `Place of the party: ___` là câu điền, không phải lời người nói. Tên được có số (“Students 1 and 2”). Có `___` thì thành điền chỗ trống, không có thì không có chỗ trả lời.
- **Bảng:** các dòng ô cách nhau bằng ` | ` (hoặc Tab). Dòng đầu là tiêu đề cột (ô đầu là góc bảng). Ô trống = để học sinh viết; `[ ]` = ô tick; `[ảnh: tên]` = ô ảnh.
- **Ô chữ (word search):** dòng `Ô chữ:` rồi mỗi dòng một hàng chữ cái (`SUNLIGHT…` hoặc `S U N L …`). Thành bảng chữ cái không tiêu đề, không số, căn giữa; dùng kèm `Khung từ:` cho danh sách từ cần tìm.
- **Chỉ có ảnh** (tô màu, vẽ): chỉ ghi `Ảnh:` và `Trả lời: không`, không có câu.
- Dòng trống giữa các phần không bắt buộc, chỉ để dễ đọc.
- **Mỗi Task chỉ có một loại chỗ trả lời.** Bài gốc trộn nhiều loại (vd điền bảng + tick một ý + hoàn thành câu) thì tách thành nhiều `## Task` liên tiếp. Một ý “chọn một trong các từ rồi viết” dùng `Khung từ:` + `điền chỗ trống`.

## 4b. Những dòng app tự bỏ hoặc chuyển chỗ (v67)
Phiếu gốc có “giàn giáo” cho học sinh viết; app tự vẽ chỗ trả lời theo `Trả lời:`, nên các dòng này **không cần chép**. Nếu có, app xử lý và ghi chú ở dòng Task trong bảng nhận diện:
| Dòng trong MD | App làm gì |
|---|---|
| `Nội dung:`, `Content:`, `Câu hỏi:` (dòng chỉ có nhãn) | bỏ, không thành câu |
| dòng chỉ có nhãn khác (`Xxx:` không có gì sau) | bỏ, **có ghi chú** |
| `My answer: A / B / C`, `Answer: A / B / C` | bỏ (đáp án khoanh đã có) |
| dòng chỉ có gạch / chấm (`_______`, `.......`) | bỏ (dòng viết do app vẽ) |
| `___` ở **cuối** câu khi `Trả lời:` là đúng/sai, viết câu, viết từ | bỏ gạch (tránh trùng chỗ trả lời); `Nhãn: ___` và câu khoanh A/B/C (“She is a ___. A. … B. …”) thì giữ |
| dòng chữ thường nằm **sau câu cuối** (không đánh số, không có chỗ trả lời) | nối vào hướng dẫn, như `Ghi chú:` |
Cảnh báo mới trong bảng nhận diện (cho cả JSON): câu lỗi chữ (`undefined`), câu trông giống tiêu đề (kết thúc bằng `:`), gạch `___` trùng với chỗ trả lời riêng, câu còn ký hiệu ô tick.

## 5. Phần đáp án (`## Đáp án`, cuối file)

Hai cách viết, dùng lẫn được:
```
## Đáp án
### Task 1          ← số Task theo thứ tự trong file
1. cat
2. dog
Task 2: is; are; an ← một dòng, các đáp án cách nhau bằng dấu ;
```
- Đáp án được ghi vào trường “đáp án đúng” của từng câu (`key`), **không** hiện trên phiếu học sinh. Câu thiếu đáp án thì thẻ dạng bài cảnh báo như khi soạn tay.
- Chưa nhận đáp án cho **bảng** và **ô chữ** (bỏ qua, có báo).

## 6. Khi app đọc MD
- Mỗi `## Task` thành một dòng trong **bảng nhận diện**: số theo file, tiêu đề, mô tả cấu hình, số câu/hàng, cảnh báo (thiếu ảnh, khung từ không khớp chỗ trống, thiếu đáp án…), cuối bảng có ước tính số trang.
- Trường không hiểu, `Trả lời:` không hợp nội dung, `Mẫu:` không có: app giữ cấu hình đoán và ghi chú ngay ở dòng Task đó.
- Task không dựng được thì dòng đỏ: + Task bỏ qua Task đó, + Phiếu không cho tạo (sửa file rồi nạp lại). Phiếu đang mở không bao giờ bị đổi khi có lỗi.
- Hàm `sheetToMd(ws)` / `taskToMd(t)` trong app xuất phiếu đang mở ra MD theo đúng quy ước này (chưa có nút; dùng cho kiểm thử và làm mẫu). Khứ hồi 18 Task mẫu: MD → app giữ đúng 18/18 cấu hình (mô tả, số câu, loại đáp án, bố cục).

---

## Ví dụ 1 — phiếu “Wonders of the Sea” (nhóm Students 1 and 2)
Ô chữ + khung từ, viết gợi ý 2 dòng, hội thoại. File: `claude/tests/md/sea.md`. Đọc ra đúng 3 Task đầu của `claude/ws-sea-sample.json`. Nhóm Students 3 and 4 là một file riêng (cùng cấu trúc).

```markdown
# Wonders of the Sea (Our World 4, WS 6.1) – Students 1 and 2
Tuổi: 7-9

## Task: Students 1 and 2: Work with a friend. Find and circle the words in the puzzle.
Khung từ: dolphin, sea sponges, squid, fish, creature, sunlight, disappear, layer
Ô chữ:
SUNLIGHTLODA
EORMIDOLPHIN
ASCECIGHTSSR
SENTURTLEIAE
PAOSOLEUAFPS
ONCQCPWARYPO
NSEUEYUHTTEU
GHFISHISHUAR
EMIDNIGHTLRC
SHARKSEZONEE

## Task: Work with your friend. Prepare clues for the words you found in Activity 1.
Hướng dẫn: Look at the pictures on pages 90 and 91 of your book if you need help. Example: It’s smaller than a whale. It lives in the sunlight zone. (dolphin)
Trả lời: viết câu
Dòng viết: 2
1. Clue 1:
2. Clue 2:
3. Clue 3:

## Task: Join students 3 and 4. Give the clues to your friends. Take turns.
Hướng dẫn: Listen to the clues and find the words in your puzzle.
Hội thoại:
Students 1 and 2: Here’s our first clue. It’s smaller than a whale. It lives in the sunlight zone.
Students 3 and 4: Is it a dolphin?
Students 1 and 2: Yes, it is. Where is it in the puzzle?
```

## Ví dụ 2 — phiếu ôn tập trộn dạng, có đáp án
Ảnh mỗi câu viết từ, khoanh A/B/C, điền chỗ trống + khung từ, Đúng/Sai + ảnh chung, bài đọc. File: `claude/tests/md/mau-tron.md`.

```markdown
# Unit 3 · My home – ôn tập
Tuổi: 7-9
Khoảng cách: vừa

## Task: Look and write.
Hướng dẫn: Look at the pictures. Write the words.
Trả lời: viết từ
1. [ảnh: cat]
2. [ảnh: dog]
3. [ảnh: fish]
4. [ảnh: bird]

## Task: Choose the correct answer.
Hướng dẫn: Circle a, b or c.
1. She ___ a teacher. A. am B. is C. are
2. They ___ playing football. A. is B. are C. be
3. I have ___ apple in my bag. A. a B. an C. the

## Task: Complete the sentences.
Hướng dẫn: Use the words in the box.
Khung từ: kitchen, garden, bedroom
1. We cook dinner in the ___.
2. I sleep in my ___.
3. Flowers grow in the ___.

## Task: Look at the picture. True or False?
Hướng dẫn: Circle T (true) or F (false).
Ảnh: the park
Trả lời: đúng/sai
1. There are three children in the park.
2. The dog is under the tree.
3. It is a sunny day.

## Task: Read and answer.
Hướng dẫn: Read the text. Answer the questions.
Ảnh: Lucy and Max
Bài đọc:
My name is Lucy. I am nine years old. I live in a small house with my mum, my dad and my brother Ben.
We have a dog. His name is Max. Max is brown and white. Every morning, Ben and I walk Max in the park.
1. How old is Lucy?
2. What is the dog's name?
3. Where do they walk Max?

## Đáp án
### Task 1
1. cat
2. dog
3. fish
4. bird
Task 2: is; are; an
Task 3: kitchen; bedroom; garden
Task 4: T; F; T
### Task 5
1. She is nine years old.
2. His name is Max.
3. In the park.
```

## Ví dụ 3 — nghe, bảng, nối, hội thoại, chọn trong câu, tô màu
File: `claude/tests/md/nghe-bang.md`.

```markdown
# Listening and reading – Unit 5
Tuổi: 10-12
Xếp trang: liền

## Task: Listen and complete the table.
Track: Track 12
Hướng dẫn: Write one or two words. There is one example.
Name | Age | Hobby
Tom | 9 | football
Lily |  |
Ben |  |

## Task: Match.
Hướng dẫn: Draw a line from the animal to its sound.
Trả lời: nối
1. cat - meow
2. dog - woof
3. cow - moo

## Task: Complete the conversation.
Hướng dẫn: Write one letter in each gap.
Khung từ: Le Loi School., I usually ride my bike., Yes. The teachers are friendly.
Lời dẫn: Mai is talking to Ben about his new school.
Hội thoại:
Mai: Hi, Ben. Do you like your new school?
Ben: ___
Mai: Which school do you go to?
Ben: ___
Mai: How do you get there?
Ben: ___

## Task: Read and underline.
Hướng dẫn: Underline the correct word.
Trả lời: chọn trong câu
1. It’s {windy|rainy}. Take your raincoat {on|off}.
2. It’s {cloudy|sunny}. Put your {swimming costume|coat} on.

## Task: Listen and colour.
Track: Track 08
Hướng dẫn: Listen to the teacher. Colour the picture.
Ảnh: the classroom
Trả lời: không

## Đáp án
Task 2: meow; woof; moo
Task 4: rainy, on; sunny, swimming costume
```

## Ví dụ 4 — phiếu đọc thật “A Surprise Birthday Party” (Cambridge A1 Movers)
Phiếu thật đầu tiên dùng để kiểm thử (PDF: `claude/tests/real/birthday.pdf`). File: `claude/tests/md/birthday.md`. Bài 6 gốc trộn 3 loại nên tách thành Task 6 (Story Map) và Task 7 (My Idea). Đầu phiếu (Name/Class, thời gian từng bài, “Before you read”) không chép.

```markdown
# A Surprise Birthday Party
Tuổi: 7-9

## Task: Look & Predict
Hướng dẫn: Look at the title. What do you think you will see in the story? Tick (✓) two.
Trả lời: tick
Ghi chú: Your ideas are predictions. Check them after reading.
☐ a cake ☐ a football ☐ balloons

## Task: Read & Choose the Main Idea
Hướng dẫn: Read the story. Then choose the best summary (A, B or C).
Trả lời: khoanh A/B/C
Bài đọc:
On Saturday morning, Lily was at home with her mum. … Lily's dad brought some presents.

At two o'clock, Lily's mum said, "Let's visit Ben." … Lily was very surprised.

But then their dog Max jumped onto a chair and took a sandwich! … her friends made her day special.

1. A. Lily and her friends made a cake at school.
   B. Lily’s friends planned a party, and something funny happened.
   C. Lily went to a party, but no one came.

## Task: True or False?
Hướng dẫn: Read again. Write T (True) or F (False).
Trả lời: đúng/sai
1. Lily thought everyone was busy on her birthday.
2. Ben and his friends prepared the party at Lily’s house.

## Task: Find the Details
Hướng dẫn: Answer with one word or a short phrase.
Trả lời: viết câu
Dòng viết: 1
1. Where did the friends prepare the party?
2. What time did Lily visit Ben?

## Task: Choose & Think
Hướng dẫn: Use clues in the story. Circle the best answer.
Trả lời: khoanh A/B/C
1. Why was the room dark when Lily opened the door?
   A. The friends wanted to surprise her.
   B. The friends were sleeping.
   C. Ben was not at home.

## Task: Story Map
Hướng dẫn: Complete the story map with words from the story.
Trả lời: điền chỗ trống
1. Place of the party: ___
2. Food at the party (two things): ___

## Task: My Idea
Hướng dẫn: Which party activity would you like best? Choose one and finish the sentence.
Trả lời: điền chỗ trống
Khung từ: eating cake, playing games, singing songs
1. I would like ___ because ___.
```
(Ví dụ rút gọn bằng “…”; file đầy đủ ở `claude/tests/md/birthday.md`.)
