# Prompt đưa PDF phiếu bài tập vào WS Editor

Cập nhật: 2026-10-25 (tối), dùng với prototype **v67**. Bản này sửa theo lần thử thật đầu tiên (phiếu “A Surprise Birthday Party”): bỏ dòng mẫu “Nội dung:” làm AI chép theo, thêm quy tắc bỏ “giàn giáo” của bản gốc, ô tick ☐, lựa chọn xuống dòng, tách Task trộn loại, và một ví dụ đầy đủ.

Cách dùng: mở một AI đọc được PDF (Claude, ChatGPT, Gemini…), đính kèm PDF, dán MỘT trong hai prompt dưới đây. Lưu kết quả thành file `.md` (hoặc `.json`), rồi trong app bấm **+ Phiếu** (cả phiếu) hoặc **+ Task** (thêm vào phiếu đang mở) → Chọn file. Xem bảng nhận diện trước khi bấm tạo: dòng xanh là app đã tự xử lý, dòng đỏ là chỗ phải sửa.

Nên chọn cách nào:
- **Cách B (MD) — khuyến nghị.** Ngắn, dễ đọc, dễ sửa tay. Cấu trúc đầy đủ ở `docs/QUY_UOC_MD.md`.
- **Cách A (JSON).** Đủ mọi trường, nhưng AI dễ sai dấu ngoặc khi file dài. Dùng khi cần kiểm soát từng trường.

---

## CÁCH B. Prompt ra MD (khuyến nghị)

````
Bạn chuyển phiếu bài tập tiếng Anh (PDF đính kèm) sang Markdown theo QUY ƯỚC của app "WS Editor". App tự dàn trang và TỰ VẼ chỗ trả lời (dòng kẻ, ô T/F, ô tick, vòng khoanh). Việc của bạn chỉ là chép NỘI DUNG và chọn đúng loại chỗ trả lời.

Trả về DUY NHẤT một khối ```markdown, rồi mục "GHI CHÚ" ngắn.

NGUYÊN TẮC
1. Chép nguyên văn tiếng Anh (giữ dấu câu, chữ hoa, ’ …). Không sửa, không dịch, không bịa câu hay đáp án.
2. Không cần giống bố cục PDF. Người học chỉ cần hiểu phải làm gì.
3. Mỗi hoạt động = một Task, đúng thứ tự. MỖI TASK CHỈ CÓ MỘT LOẠI CHỖ TRẢ LỜI. Hoạt động gốc trộn nhiều loại (vd điền bảng + tick một ý + hoàn thành câu) thì tách thành nhiều Task liên tiếp.
4. KHÔNG CHÉP "GIÀN GIÁO" CỦA BẢN GỐC, vì app tự vẽ:
   - gạch ___ hay dòng kẻ ở cuối câu khi học sinh viết câu trả lời hoặc chọn Đúng/Sai (chỗ viết nằm SAU câu, không phải một phần của câu);
   - dòng "My answer: A / B / C", dòng chỉ có gạch "________";
   - đầu phiếu: Name / Class / Date, số trang, thời gian từng bài ("3 min"), nhãn phần ("Before you read").
   Giữ ___ khi chỗ trống là MỘT PHẦN CỦA CÂU, học sinh điền hoặc chọn từ vào đó (vd "She ___ a teacher.", "Place of the party: ___", "It is a ___. A. cat B. dog").
5. Không viết dòng tiêu đề phần như "Nội dung:", "Content:". Câu đi ngay dưới các dòng trường.
6. Ảnh: không tạo ảnh, chỉ ghi TÊN NGẮN dạng [ảnh: tên].
7. Mỗi file một phiếu. PDF có nhiều nhóm/phiên bản thì chỉ làm nhóm tôi chỉ định, hỏi nếu chưa rõ.
8. Không đọc rõ thì ghi vào GHI CHÚ, không đoán.

QUY ƯỚC
# Tên phiếu
Tuổi: 7-9                                  (5-6 | 7-9 | 10-12)

## Task: <tiêu đề bài>                     (mỗi Task bắt đầu bằng dòng này)
Hướng dẫn: <lệnh / hướng dẫn của bài>
Trả lời: <BẮT BUỘC, một trong: viết từ | điền chỗ trống | viết câu | khoanh A/B/C | chọn trong câu | tick | đúng/sai | nối | tô chữ | không>
Dòng viết: 1                               (chỉ với "viết câu": số dòng mỗi câu)
Khung từ: từ1, từ2, từ3                    (nếu có hộp từ)
Ảnh: <tên ảnh chung>                       (nếu bài có một tranh chung)
Track: Track 05                            (nếu là bài nghe)
Lời dẫn: <câu dẫn trước hội thoại>
Ghi chú: <lời nhắc nằm dưới bài trong bản gốc>
<rồi đến các câu, theo các cách viết dưới đây>

CÁCH VIẾT CÂU
- Câu đánh số: 1. She ___ a teacher.
- Lựa chọn A/B/C: cùng dòng "1. Where is it? A. here B. there C. home", hoặc mỗi lựa chọn một dòng thụt lề ngay dưới câu.
- Câu chỉ có lựa chọn (không có thân câu): "1. A. … B. … C. …".
- Tick vào lựa chọn bằng chữ: ☐ a cake ☐ a football ☐ balloons   (một dòng, hoặc mỗi dòng một ☐), kèm "Trả lời: tick".
- Nghe và tick ảnh: "1. What is Tom eating? A. [ảnh: pizza] B. [ảnh: rice] C. [ảnh: cake]", kèm "Trả lời: tick".
- Chọn trong câu: It’s {windy|rainy}.
- Ảnh của câu: 1. [ảnh: cat]
- Nối: 1. cat - meow   (vế trái là ảnh: 1. [ảnh: apple] - pear)
- Bài đọc: dòng "Bài đọc:" rồi các đoạn văn, MỖI ĐOẠN CÁCH NHAU MỘT DÒNG TRỐNG; sau đó đến câu hỏi đánh số.
- Hội thoại: dòng "Hội thoại:" rồi mỗi lượt một dòng "Tên: lời" (chỗ cần điền ghi ___). Chỉ dùng khối này cho hội thoại.
- Bảng: mỗi hàng một dòng, ô cách nhau " | "; dòng đầu là tiêu đề cột; ô để học sinh viết thì để trống; [ ] = ô tick; [ảnh: x] = ô ảnh.
- Ô chữ (word search): dòng "Ô chữ:" rồi mỗi dòng một hàng chữ cái; từ cần tìm đưa vào "Khung từ:".
- Bài chỉ có tranh (tô màu, vẽ): chỉ "Ảnh:" và "Trả lời: không".

CHỌN "Trả lời:"
- ___ trong câu → điền chỗ trống
- câu hỏi, học sinh viết câu trả lời → viết câu (+ Dòng viết)
- một từ dưới tranh → viết từ
- có A/B/C → khoanh A/B/C
- ☐ trước các lựa chọn, hoặc nghe và tick ảnh → tick
- True/False → đúng/sai
- {a|b} → chọn trong câu
- "chọn một trong các từ rồi viết câu" → Khung từ + điền chỗ trống
- bảng, ô chữ, hỏi đáp miệng, tô màu → không

ĐÁP ÁN (chỉ khi PDF có), đặt CUỐI file:
## Đáp án
### Task 1
1. cat
2. dog
Task 2: is; are; an

TỰ KIỂM TRA TRƯỚC KHI TRẢ LỜI
- Mỗi Task có "## Task:" và "Trả lời:"; không có dòng "Nội dung:".
- Số câu đúng bằng PDF; không còn ___ thừa ở cuối câu Đúng/Sai, viết câu.
- Không Task nào trộn hai loại chỗ trả lời.
- Bài đọc giữ đúng số đoạn.

ĐẦU RA: một khối ```markdown, rồi GHI CHÚ: (1) chỗ đọc không rõ, (2) Task đã tách hoặc chọn dạng chưa chắc và vì sao, (3) ảnh cần tải lên theo từng Task.

VÍ DỤ ĐẦY ĐỦ (một phiếu đọc thật; bài 6 gốc trộn 3 loại nên tách thành Task 6 và 7):
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
On Saturday morning, Lily was at home with her mum. (… đoạn 1 …)

At two o'clock, Lily's mum said, "Let's visit Ben." (… đoạn 2 …)

But then their dog Max jumped onto a chair and took a sandwich! (… đoạn 3 …)

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
````

---

## CÁCH A. Prompt ra JSON

````
Bạn chuyển phiếu bài tập tiếng Anh (PDF đính kèm) sang JSON cho app "WS Editor". App tự dàn trang và TỰ VẼ chỗ trả lời. Trả về DUY NHẤT một khối ```json hợp lệ, rồi mục "GHI CHÚ" ngắn.

NGUYÊN TẮC
1. Chép nguyên văn tiếng Anh. Không sửa, không dịch, không bịa câu hay đáp án. Không cần giống bố cục PDF.
2. Mỗi hoạt động = một Task, đúng thứ tự. MỖI TASK CHỈ MỘT LOẠI ĐÁP ÁN; hoạt động trộn nhiều loại thì tách thành nhiều Task.
3. KHÔNG CHÉP GIÀN GIÁO: không để ___ ở cuối câu khi đáp án là Đúng/Sai, viết câu, viết từ (chỗ viết nằm sau câu); không có câu "My answer: A / B / C"; không chép Name/Class, thời gian từng bài, nhãn phần. Chỉ giữ ___ khi chỗ trống nằm trong câu hoặc sau nhãn ("Place of the party: ___").
4. Ảnh chỉ ghi TÊN NGẮN. Đáp án đúng chỉ khi PDF có (trường "key"). Mọi "id" duy nhất.
5. Lời nhắc nằm dưới bài trong bản gốc: nối vào cuối "instruction".

KHUNG PHIẾU
{"schema":"ws-editor/0.3","id":"ws-001","title":"<tên phiếu>","age":"7-9","page":{"size":"A4","marginMm":{"top":14,"right":14,"bottom":14,"left":14}},"spacing":{"preset":"normal","overrides":{}},"flow":"cont","tasks":[ ... ]}
("age": "5-6" | "7-9" | "10-12")

KHUNG MỘT TASK
{"id":"t1","typeId":"custom","typeName":"<tên dạng ngắn>","title":"<tiêu đề bài>","instruction":"<hướng dẫn, '' nếu không có>","audio":null,"image":null,"wordBank":null,
 "content":{ ...DẠNG NỘI DUNG... },"answer":{ ...LOẠI ĐÁP ÁN... },
 "spacing":{"preset":null,"overrides":{}},
 "layout":{"task":"auto","split":null,"cols":null,"dir":null,"align":null,"valign":null,"width":null,"cw":null,"rowH":null,"whoW":null,"colGap":null,"break":null,"frame":{},"cells":null,"table":null}}
- "audio": "Track 05" nếu bài nghe. "image": {"label":"the park","size":"medium","ar":"4/3"} cho một tranh chung ("large" nếu tranh lớn để tô/nhìn). "wordBank": {"words":["a","b"],"placement":"top","style":"chips","label":"none"}.
- "spacing" và "layout" chép y nguyên như trên.

DẠNG NỘI DUNG ("content")
(a) Danh sách câu: {"form":"list","items":[{"id":"q1","text":"She ___ a teacher.","opts":["am","is","are"],"key":"is"}]}
    - "opts" chỉ khi có lựa chọn. Câu chỉ có lựa chọn: "text":"". Chọn trong câu: viết {từ1|từ2} trong "text".
(b) Ảnh mỗi câu: items [{"id":"i1","img":"cat","len":3}]
(c) Nghe và tick ảnh: {"form":"list","variant":"multi","items":[{"id":"i1","text":"What is Tom eating?","imgs":["pizza","rice","cake"]}]}
(d) Câu nhiều dòng có ảnh: items [{"id":"i1","img":"rainy","lines":["It’s {windy|rainy}.","{Take|Put} your raincoat {on|off}."]}]
(e) Nối: {"form":"list","items":[{"id":"p1","pair":{"l":{"text":"cat"},"r":{"text":"meow"}}}]}
(f) Hội thoại: {"form":"list","lead":{"kind":"text","text":"<lời dẫn>"},"items":[{"id":"l1","who":"Mai","text":"Hi, Ben."},{"id":"l2","who":"Ben","text":"___"}]}
(g) Bài đọc + câu hỏi: {"form":"list","lead":{"kind":"passage","text":"<đoạn 1>\n\n<đoạn 2>"},"items":[...]}   (các đoạn cách nhau "\n\n")
(h) Tô chữ: items [{"id":"w1","text":"cat"}]
(i) Bảng: {"form":"table","corner":"","cols":["Age","Hobby"],"rows":[{"id":"r1","head":"Tom","cells":["9","football"]},{"id":"r2","head":"Lily","cells":["",""]}]}
    - Ô trống để viết = "". Ô tick = {"tick":1}. Ô ảnh = {"img":"cat"}.
    - Ô chữ (word search): mỗi ô một chữ, "cols" toàn chuỗi rỗng, "head":"" mọi hàng, thêm "layout.table": {"head":false,"rowHead":false,"nm":"off","lines":"all","align":"center","minH":8}; từ cần tìm vào "wordBank".
(j) Chỉ có tranh: {"form":"list","list":false,"items":[]} và "image" (size "large").

LOẠI ĐÁP ÁN ("answer")
- Viết một từ:                 {"kind":"word","attach":"item","layout":"A2","params":{}}
- Điền chỗ trống ___ trong câu: {"kind":"word","attach":"inline","layout":"A2","params":{"lenMode":"fill","lines":1,"start":"inline"}}
- Viết câu (dòng kẻ):          {"kind":"sentence","attach":"item","layout":"A1","params":{"lines":1}}
- Khoanh A/B/C:                {"kind":"choice","attach":"item","layout":"A4","params":{}}
- Tick lựa chọn bằng chữ (☐):  {"kind":"choice","attach":"item","layout":"A4","params":{"lab":"box"}}
- Chọn trong câu {a|b}:        {"kind":"choice","attach":"inline","layout":"A4","params":{}}
- Nghe và tick ảnh:            {"kind":"tick","attach":"item","layout":"A5","params":{}}
- Đúng/Sai:                    {"kind":"tf","attach":"item","layout":"A6","params":{}}
- Nối:                         {"kind":"match","attach":"item","layout":"A7","params":{}}
- Tô chữ:                      {"kind":"trace","attach":"item","layout":"A8","params":{"repeat":3}}
- Không có chỗ trả lời:        {"kind":"none","attach":"item","layout":null,"params":{}}

TỰ KIỂM TRA: JSON hợp lệ (không có chú thích //); số câu đúng PDF; không còn ___ thừa; không Task nào trộn hai loại đáp án; id duy nhất.

ĐẦU RA: một khối ```json, rồi GHI CHÚ: (1) chỗ đọc không rõ, (2) Task đã tách hoặc chọn dạng chưa chắc, (3) ảnh cần tải lên theo từng Task.
````

---

## Sau khi AI trả kết quả
1. Lưu thành `ten-phieu.md` (hoặc `.json`). Nếu AI bọc trong ``` thì bỏ dòng ``` đầu và cuối.
2. App → **+ Phiếu** → Chọn file… Xem **bảng nhận diện**: số Task, mô tả từng Task, ghi chú (xanh: app đã tự xử lý), cảnh báo (đỏ: cần sửa), ước tính số trang.
3. Dòng đỏ: sửa trong cột trái, hoặc nhờ AI sửa lại đúng Task đó rồi nạp lại.
4. Tải ảnh thật vào các ô ảnh (nút + trên từng ô).
5. Gặp dạng bài mà prompt không diễn đạt được: báo lại để mở rộng app theo quy trình 3 bước.
