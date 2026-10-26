# Prompt đưa PDF phiếu bài tập vào WS Editor

Cập nhật: 2026-10-26 (v80: thêm quy tắc 9–11 về kiểu chữ, nhóm câu có hướng dẫn riêng, bài viết đoạn; trước đó 2026-10-25 lần 2, prototype **v68**). Bản v67 bảo AI "tách Task trộn loại" nên phiếu “A Surprise Birthday Party” ra 8 Task trong khi PDF có 6. Bản này sửa: **một bài của PDF = một `## Task`**; bài gốc có nhiều phần với chỗ trả lời khác nhau thì các phần sau là `### Phần:` (app nối vào Task trên, cùng số Task, mỗi phần giữ đáp án riêng). Vẫn giữ các quy tắc v67: không chép “Nội dung:”, bỏ “giàn giáo” của bản gốc, ô tick ☐, lựa chọn xuống dòng.

Cách dùng: mở một AI đọc được PDF (Claude, ChatGPT, Gemini…), đính kèm PDF, dán MỘT trong hai prompt dưới đây. Lưu kết quả thành file `.md` (hoặc `.json`), rồi trong app bấm **+ Phiếu** (cả phiếu) hoặc **+ Task** (thêm vào phiếu đang mở) → Chọn file. Xem bảng nhận diện trước khi bấm tạo: dòng xanh là app đã tự xử lý, dòng đỏ là chỗ phải sửa. Dòng đầu bảng nên khớp số bài của PDF (vd “6 Task (Task 6 có 3 phần)”).

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
3. MỘT BÀI CỦA PDF = MỘT "## Task", đúng thứ tự và ĐÚNG SỐ LƯỢNG (PDF có TASK 1…6 thì file có đúng 6 dòng "## Task"). KHÔNG tách một bài của PDF thành nhiều Task. Mỗi "## Task" hay "### Phần" chỉ có MỘT loại chỗ trả lời. Bài gốc có nhiều phần với chỗ trả lời khác nhau (vd điền bảng + tick một ý + hoàn thành câu) thì: phần đầu viết ngay dưới "## Task:"; mỗi phần sau mở bằng một dòng "### Phần: <tên phần>" với "Hướng dẫn:" và "Trả lời:" riêng của phần đó. Chỉ chép "Hướng dẫn:" của phần khi PDF có câu lệnh riêng cho phần đó; không có thì bỏ trống, KHÔNG chép lại hướng dẫn của phần trước.
4. KHÔNG CHÉP "GIÀN GIÁO" CỦA BẢN GỐC, vì app tự vẽ:
   - gạch ___ hay dòng kẻ ở cuối câu khi học sinh viết câu trả lời hoặc chọn Đúng/Sai (chỗ viết nằm SAU câu, không phải một phần của câu);
   - dòng "My answer: A / B / C", dòng chỉ có gạch "________";
   - đầu / cuối trang: Name / Class / Date, số trang, tên phiếu lặp lại ("READING WORKSHEET"), thời gian từng bài ("3 min"), nhãn phần ("Before you read").
   Giữ ___ khi chỗ trống là MỘT PHẦN CỦA CÂU, học sinh điền hoặc chọn từ vào đó (vd "She ___ a teacher.", "Place of the party: ___", "It is a ___. A. cat B. dog").
5. Không viết dòng tiêu đề phần như "Nội dung:", "Content:". Câu đi ngay dưới các dòng trường.
6. Ảnh: không tạo ảnh, chỉ ghi TÊN NGẮN dạng [ảnh: tên].
7. Mỗi file một phiếu. PDF có nhiều nhóm/phiên bản thì chỉ làm nhóm tôi chỉ định, hỏi nếu chưa rõ.
8. Không đọc rõ thì ghi vào GHI CHÚ, không đoán.
9. KIỂU CHỮ: chỉ giữ in đậm / nghiêng / gạch chân khi ý của bài cần chúng. Viết **đậm**, *nghiêng*, <u>gạch chân</u> (lồng nhau được: **<u>park</u>**). Ví dụ cần: từ bị gạch chân trong đề "closest in meaning to the underlined word(s)" → "Acupuncture <u>originated</u> in China…"; từ gốc in đậm trong ngoặc → "We are trying to have an ___ world. (**POLLUTE**)"; từ cần chú ý trong bài đọc. KHÔNG dùng cho tiêu đề, nhãn, số câu hay chữ chỉ trang trí. KHÔNG viết gạch chân bằng dấu gạch dưới (__từ__): app hiểu đó là chỗ trống.
10. NHÓM CÂU CÓ HƯỚNG DẪN RIÊNG TRONG CÙNG MỘT BÀI (số câu bắt đầu lại từ 1, vd một nhóm "CLOSEST in meaning", một nhóm "OPPOSITE in meaning"): nhóm sau mở bằng "### Phần: <tên>" kèm "Hướng dẫn:" là câu lệnh của nhóm đó và "Trả lời:" riêng. KHÔNG để câu lệnh của nhóm sau nằm trơ giữa các câu đánh số.
11. BÀI VIẾT ĐOẠN / VIẾT TỰ DO (không có câu hỏi, học sinh viết cả bài): chỉ ghi "Hướng dẫn:", "Trả lời: viết câu" và "Dòng viết: N" (N = số dòng kẻ trong PDF, tới 20; không rõ thì ước lượng và ghi vào GHI CHÚ). Không viết câu mẫu, không ghi "Ảnh:" nếu PDF không có tranh.

QUY ƯỚC
# Tên phiếu
Tuổi: 7-9                                  (5-6 | 7-9 | 10-12)

## Task: <tiêu đề bài>                     (mỗi bài của PDF bắt đầu bằng dòng này)
Hướng dẫn: <lệnh / hướng dẫn của bài>
Trả lời: <BẮT BUỘC, một trong: viết từ | điền chỗ trống | viết câu | khoanh A/B/C | chọn trong câu | tick | đúng/sai | nối | tô chữ | không>
Dòng viết: 1                               (chỉ với "viết câu": số dòng mỗi câu; bài viết đoạn: tổng số dòng, tới 20)
Khung từ: từ1, từ2, từ3                    (nếu có hộp từ)
Ảnh: <tên ảnh chung>                       (nếu bài có một tranh chung)
Track: Track 05                            (nếu là bài nghe)
Lời dẫn: <câu dẫn trước hội thoại>
Ghi chú: <lời nhắc nằm dưới bài trong bản gốc>
<rồi đến các câu, theo các cách viết dưới đây>

### Phần: <tên phần>                       (CHỈ khi bài gốc có nhiều phần với chỗ trả lời khác nhau; cùng số Task)
Hướng dẫn: <câu lệnh riêng của phần, bỏ trống nếu PDF không có>
Trả lời: <loại chỗ trả lời của phần này>
<các câu của phần này>

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
- Ô chữ giải đố (crossword, có ô trắng tự đánh số và gợi ý Across / Down): dòng "Crossword:" rồi mỗi dòng một hàng của lưới: # = không có ô, . = ô trống, chữ cái = đáp án (nếu suy ra được), (a) = chữ đã cho sẵn. Không đoán đáp án nếu PDF không có: dùng "." cho các ô.
- Ô chữ (word search): dòng "Ô chữ:" rồi mỗi dòng một hàng chữ cái; từ cần tìm đưa vào "Khung từ:".
- Bài chỉ có tranh (tô màu, vẽ): chỉ "Ảnh:" và "Trả lời: không".
- Bài viết đoạn (không câu hỏi): "Trả lời: viết câu" + "Dòng viết: 15", không có dòng câu nào.
- Chữ cần nhấn: **đậm**, *nghiêng*, <u>gạch chân</u>.

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

ĐÁP ÁN (chỉ khi PDF có), đặt CUỐI file. Số "Task n" là số của bài trong PDF; bài nhiều phần thì liệt kê đáp án liền nhau qua các phần, theo thứ tự câu:
## Đáp án
### Task 1
1. cat
2. dog
Task 2: is; are; an

TỰ KIỂM TRA TRƯỚC KHI TRẢ LỜI
- Nhãn in sẵn đầu một phần trong PDF (ví dụ "Self-check:") ghi vào dòng `Hướng dẫn:` của phần đó. Tên sau "### Phần:" chỉ là tên nội bộ, KHÔNG được in lên phiếu.
- Số dòng "## Task" bằng đúng số bài đánh số trong PDF. Chỉ dùng "### Phần:" cho các phần phụ của MỘT bài.
- Mỗi Task và mỗi Phần có "Trả lời:"; không có dòng "Nội dung:".
- Số câu đúng bằng PDF; không còn ___ thừa ở cuối câu Đúng/Sai, viết câu.
- Không "Hướng dẫn:" nào bị chép lặp từ phần trước.
- Bài đọc giữ đúng số đoạn.
- Từ bị gạch chân / in đậm mà đề nhắc tới (underlined, bold) đã được đánh dấu bằng <u> hoặc **.
- Không có dòng hướng dẫn nào nằm trơ giữa các câu đánh số: nhóm câu có hướng dẫn riêng đã thành "### Phần:".

ĐẦU RA: một khối ```markdown, rồi GHI CHÚ: (1) chỗ đọc không rõ, (2) bài nào có nhiều phần (### Phần) và vì sao, (3) ảnh cần tải lên theo từng Task.

VÍ DỤ ĐẦY ĐỦ (một phiếu đọc thật, PDF có 6 bài; bài 6 gốc có 3 phần với chỗ trả lời khác nhau nên viết thành "## Task" + hai "### Phần"):
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

## Task: Story Map & My Idea
Hướng dẫn: Complete the story map with words from the story.
Trả lời: điền chỗ trống
1. Place of the party: ___
2. Food at the party (two things): ___

### Phần: My Idea – Tick One
Hướng dẫn: Which party activity would you like best? Tick one and finish the sentence.
Trả lời: tick
☐ eating cake ☐ playing games ☐ singing songs

### Phần: My Idea – Finish the Sentence
Trả lời: điền chỗ trống
1. I would like ___ because ___.
```
````

---

## CÁCH A. Prompt ra JSON

````
Bạn chuyển phiếu bài tập tiếng Anh (PDF đính kèm) sang JSON cho app "WS Editor". App tự dàn trang và TỰ VẼ chỗ trả lời. Trả về DUY NHẤT một khối ```json hợp lệ, rồi mục "GHI CHÚ" ngắn.

NGUYÊN TẮC
1. Chép nguyên văn tiếng Anh. Không sửa, không dịch, không bịa câu hay đáp án. Không cần giống bố cục PDF.
2. Mỗi bài của PDF = MỘT số thứ tự Task, đúng thứ tự và đúng số lượng. MỖI TASK CHỈ MỘT LOẠI ĐÁP ÁN. Bài gốc có nhiều phần với chỗ trả lời khác nhau: phần đầu là một Task; mỗi phần sau là một Task riêng ngay sau đó với "layout.break":"join" (app nối nó vào Task trên: không số, không tiêu đề, cùng số Task). Với phần nối: "title" = tên phần, "instruction" chỉ chép câu lệnh riêng của phần ('' nếu PDF không có; không chép lặp hướng dẫn phần trước).
3. KHÔNG CHÉP GIÀN GIÁO: không để ___ ở cuối câu khi đáp án là Đúng/Sai, viết câu, viết từ (chỗ viết nằm sau câu); không có câu "My answer: A / B / C"; không chép Name/Class, tên phiếu lặp lại ở đầu trang, thời gian từng bài, nhãn phần. Chỉ giữ ___ khi chỗ trống nằm trong câu hoặc sau nhãn ("Place of the party: ___").
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
- "spacing" và "layout" chép y nguyên như trên; riêng phần nối vào Task trên đặt "break":"join".

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
- Khoanh A/B/C:                {"kind":"choice","attach":"item","layout":"A4","params":{"upper":true}}   (chữ hoa A B C; bỏ "upper" nếu bản gốc dùng a b c)
- Tick lựa chọn bằng chữ (☐):  {"kind":"choice","attach":"item","layout":"A4","params":{"lab":"box"}}
- Chọn trong câu {a|b}:        {"kind":"choice","attach":"inline","layout":"A4","params":{}}
- Nghe và tick ảnh:            {"kind":"tick","attach":"item","layout":"A5","params":{}}
- Đúng/Sai:                    {"kind":"tf","attach":"item","layout":"A6","params":{}}
- Nối:                         {"kind":"match","attach":"item","layout":"A7","params":{}}
- Tô chữ:                      {"kind":"trace","attach":"item","layout":"A8","params":{"repeat":3}}
- Không có chỗ trả lời:        {"kind":"none","attach":"item","layout":null,"params":{}}

TỰ KIỂM TRA: JSON hợp lệ (không có chú thích //); số Task đúng số bài PDF (phần nối "break":"join" không tính là bài mới); số câu đúng PDF; không còn ___ thừa; không Task nào trộn hai loại đáp án; không lặp hướng dẫn; id duy nhất.

ĐẦU RA: một khối ```json, rồi GHI CHÚ: (1) chỗ đọc không rõ, (2) bài nào có phần nối và vì sao, (3) ảnh cần tải lên theo từng Task.
````

---

## Sau khi AI trả kết quả
1. Lưu thành `ten-phieu.md` (hoặc `.json`). Nếu AI bọc trong ``` thì bỏ dòng ``` đầu và cuối.
2. App → **+ Phiếu** → Chọn file… Xem **bảng nhận diện**: số Task (bài nhiều phần hiện 6a, 6b, 6c), mô tả từng Task, ghi chú (xanh: app đã tự xử lý), cảnh báo (đỏ: cần sửa), ước tính số trang. Đối chiếu số Task với PDF.
3. Dòng đỏ: sửa trong cột trái, hoặc nhờ AI sửa lại đúng Task đó rồi nạp lại. Nếu một Task bị tách nhầm thành hai: chọn Task phía sau, mục Ngắt trang → **Nối vào Task trên** (hoặc nút ↳ ở cột trái).
4. Tải ảnh thật vào các ô ảnh (nút + trên từng ô).
5. Gặp dạng bài mà prompt không diễn đạt được: báo lại để mở rộng app theo quy trình 3 bước.
