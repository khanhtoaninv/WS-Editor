# Prompt đưa PDF phiếu bài tập vào WS Editor

Cách dùng: mở một AI đọc được PDF (Claude, ChatGPT, Gemini…), đính kèm PDF, dán MỘT trong hai prompt dưới đây. Lưu kết quả thành file `.json` (hoặc `.md`), rồi trong app bấm **+ Phiếu** (cả phiếu) hoặc **+ Task** (thêm vào phiếu đang mở) → Chọn file.

Nên chọn cách nào:
- **Cách A (JSON)**: đúng thứ bạn yêu cầu, đủ mọi trường. AI hay sai dấu ngoặc/trường khi file dài; app tự bù trường thiếu nhưng JSON hỏng thì báo lỗi.
- **Cách B (MD)**: ngắn gọn, dễ đọc, dễ sửa tay, app đọc chắc chắn. **Khuyến nghị thử B trước**, vì AI ít sai hơn. Cấu trúc đầy đủ của MD ở `docs/QUY_UOC_MD.md`.

Nguyên tắc chung (đã có trong hai prompt): chỉ cần ĐỦ NỘI DUNG, không cần giống bố cục PDF; mỗi file một phiếu; ảnh chỉ ghi tên, ảnh thật tải lên sau trong app.

---

## CÁCH A. Prompt ra JSON

````
Bạn là bộ chuyển đổi phiếu bài tập tiếng Anh (PDF) sang JSON cho app "WS Editor". Đọc kỹ PDF đính kèm, rồi trả về DUY NHẤT một khối JSON hợp lệ (không giải thích, không markdown ngoài khối ```json).

NGUYÊN TẮC
1. Chỉ lấy NỘI DUNG (chữ, câu, lựa chọn, khung từ, bảng). Không cần giống bố cục gốc. Người học phải hiểu được phải làm gì.
2. Chép đúng nguyên văn tiếng Anh, giữ dấu câu, chữ hoa, ký tự đặc biệt (’ …). Không sửa, không dịch, không tự bịa câu hay đáp án. Chỗ không đọc rõ thì ghi vào mục GHI CHÚ cuối câu trả lời, không đoán.
3. Mỗi "bài tập/hoạt động/activity" trong PDF = một Task. Giữ đúng thứ tự.
4. Mỗi file là một phiếu. Nếu PDF có nhiều nhóm/phiên bản (vd "Students 1 and 2" và "Students 3 and 4"), chỉ làm nhóm tôi nói; hỏi tôi nếu chưa rõ.
5. Ảnh: không tạo ảnh. Với mỗi ảnh cần dùng, ghi một TÊN NGẮN mô tả (vd "cat", "the park") vào trường tương ứng.
6. Đáp án đúng: chỉ điền khi PDF có đáp án. Có thì điền vào "key" của từng câu; không có thì bỏ qua.
7. Mọi "id" duy nhất trong phiếu: Task t1,t2…; câu q1,q2… (hoặc i1,i2… với câu có ảnh, l1,l2… với lượt hội thoại, w1.. với từ tô chữ, p1.. với cặp nối, r1.. với hàng bảng).

KHUNG PHIẾU
{
  "schema": "ws-editor/0.3",
  "id": "ws-001",
  "title": "<tên phiếu>",
  "age": "7-9",                 // "5-6" | "7-9" | "10-12" (đoán theo trình độ; ghi vào GHI CHÚ nếu không chắc)
  "page": {"size":"A4","marginMm":{"top":14,"right":14,"bottom":14,"left":14}},
  "spacing": {"preset":"normal","overrides":{}},
  "flow": "cont",
  "tasks": [ ...Task... ]
}

KHUNG MỘT TASK (điền đủ mọi trường này; những trường không dùng để null hoặc như mẫu)
{
  "id": "t1",
  "typeId": "custom",
  "typeName": "<tên dạng bài ngắn, vd Look and write>",
  "title": "<tiêu đề/ lệnh chính của bài, vd Look and write.>",
  "instruction": "<hướng dẫn phụ, ví dụ mẫu; '' nếu không có>",
  "audio": null,                 // hoặc "Track 05" nếu bài nghe
  "image": null,                 // hoặc {"label":"the park","size":"medium","ar":"4/3"} cho MỘT ảnh chung của bài (size "large" nếu là tranh lớn để tô/nhìn)
  "wordBank": null,              // hoặc {"words":["a","b"],"placement":"top","style":"chips","label":"none"}  (khung từ trong hộp)
  "content": { ... xem DẠNG NỘI DUNG ... },
  "answer": { "kind": "...", "attach": "item", "layout": "...", "params": {} },
  "spacing": {"preset":null,"overrides":{}},
  "layout": {"task":"auto","split":null,"cols":null,"dir":null,"align":null,"valign":null,"width":null,"cw":null,"rowH":null,"whoW":null,"colGap":null,"break":null,"frame":{},"cells":null,"table":null}
}
Phần "spacing" và "layout" của Task luôn chép y nguyên như trên (app tự dàn trang).

DẠNG NỘI DUNG ("content") — chọn đúng một
(a) Danh sách câu:
    {"form":"list","items":[{"id":"q1","text":"She ___ a teacher.","opts":["am","is","are"],"key":"is"}]}
    - "___" là chỗ trống. "opts" chỉ khi bài có lựa chọn a/b/c. "key" chỉ khi có đáp án.
    - Chọn ngay trong câu (gạch chân/khoanh từ): viết {từ1|từ2} thẳng trong text, vd "It’s {windy|rainy}.".
(b) Ảnh mỗi câu (nhìn tranh viết từ):  items: [{"id":"i1","img":"cat","len":3}]   ("len" = số chữ cái của từ, nếu biết)
(c) Nhiều ảnh lựa chọn mỗi câu (nghe và tick): {"form":"list","variant":"multi","items":[{"id":"i1","text":"What is Tom eating?","imgs":["pizza","rice","cake"]}]}
(d) Câu nhiều dòng có ảnh (đọc và gạch chân): items: [{"id":"i1","img":"rainy","lines":["It’s {windy|rainy}.","{Take|Put} your raincoat {on|off}."]}]
(e) Nối cặp: {"form":"list","items":[{"id":"p1","pair":{"l":{"img":"apple"},"r":{"text":"pear"}}}]}   (vế "l" là {"img":..} hoặc {"text":..}; vế "r" thường {"text":..}; số cặp bằng số hàng)
(f) Hội thoại: {"form":"list","lead":{"kind":"text","text":"<lời dẫn nếu có>"},"items":[{"id":"l1","who":"Mai","text":"Hi, Ben."},{"id":"l2","who":"Ben","text":"___"}]}
(g) Bài đọc + câu hỏi: {"form":"list","lead":{"kind":"passage","text":"<cả bài đọc, nguyên văn>"},"items":[{"id":"q1","text":"How old is Lucy?"}]}
(h) Tô chữ: {"form":"list","items":[{"id":"w1","text":"cat"},{"id":"w2","text":"hat"}]}
(i) Bảng (kể cả ô chữ word search):
    {"form":"table","corner":"<ô góc, hoặc ''>","cols":["Age","Hobby"],"rows":[{"id":"r1","head":"Tom","cells":["9","football"]},{"id":"r2","head":"Lily","cells":["",""]}]}
    - Ô trống để học sinh viết = "". Ô tick = {"tick":1}. Ô ảnh = {"img":"cat"}. Đầu hàng có ảnh: "head":{"img":"cow","text":"cow"}.
    - Ô chữ (word search): mỗi ô một chữ cái, "cols" là mảng chuỗi rỗng đủ số cột, "head":"" ở mọi hàng, và thêm vào Task "layout.table": {"head":false,"rowHead":false,"nm":"off","lines":"all","align":"center","minH":8}; danh sách từ cần tìm đưa vào "wordBank".
(j) Chỉ có ảnh (tô màu, vẽ): {"form":"list","list":false,"items":[]} và "image" ở Task (size "large").

LOẠI ĐÁP ÁN ("answer") — chọn theo cái học sinh phải làm
- Viết một từ dưới ảnh/câu:          {"kind":"word","attach":"item","layout":"A2","params":{}}
- Điền chỗ trống "___" trong câu:     {"kind":"word","attach":"inline","layout":"A2","params":{"lenMode":"fill","lines":1,"start":"inline"}}
- Viết câu trả lời (dòng kẻ):         {"kind":"sentence","attach":"item","layout":"A1","params":{"lines":2}}   ("lines" = số dòng viết)
- Khoanh a/b/c dưới câu:              {"kind":"choice","attach":"item","layout":"A4","params":{}}
- Chọn trong câu {a|b}:               {"kind":"choice","attach":"inline","layout":"A4","params":{}}
- Tick ô (nghe và tick):              {"kind":"tick","attach":"item","layout":"A5","params":{}}
- Đúng/Sai (T/F):                     {"kind":"tf","attach":"item","layout":"A6","params":{}}
- Nối:                                {"kind":"match","attach":"item","layout":"A7","params":{}}
- Tô chữ:                             {"kind":"trace","attach":"item","layout":"A8","params":{"repeat":3}}
- Không có chỗ trả lời (tô màu, hội thoại miệng, bảng tự có ô trống, ô chữ): {"kind":"none","attach":"item","layout":null,"params":{}}

CÁCH CHỌN NHANH
- Có "___" trong câu + khung từ → (a) + điền chỗ trống.
- Câu hỏi "Who/What/How…?" cần viết lại → (a) hoặc (g) + viết câu.
- Câu có A/B/C → (a) với "opts" + khoanh A/B/C.
- True/False → (a) + Đúng/Sai (nếu có tranh chung thì điền "image").
- Bài đọc dài → (g).
- Bảng → (i), answer "none".

SAU KHI ĐIỀN XONG, TỰ KIỂM TRA RỒI MỚI TRẢ LỜI
- JSON hợp lệ (đúng dấu phẩy, ngoặc, dấu nháy kép; không có chú thích // trong kết quả).
- Số câu đúng bằng PDF; số chỗ "___" khớp số từ trong khung từ nếu bài dùng khung từ.
- Mọi id duy nhất. Không còn trường bắt buộc nào thiếu.

ĐẦU RA
Một khối ```json duy nhất. Ngay sau khối đó, một mục ngắn "GHI CHÚ" liệt kê: (1) chỗ không đọc rõ / phải đoán, (2) Task nào chọn dạng nội dung/đáp án chưa chắc và vì sao, (3) ảnh nào cần tải lên (tên ảnh theo từng Task).
````

---

## CÁCH B. Prompt ra MD (khuyến nghị)

````
Bạn là bộ chuyển đổi phiếu bài tập tiếng Anh (PDF) sang Markdown theo QUY ƯỚC của app "WS Editor". Đọc kỹ PDF đính kèm, trả về DUY NHẤT một khối ```markdown theo đúng quy ước dưới đây, rồi một mục "GHI CHÚ" ngắn.

NGUYÊN TẮC
- Chỉ lấy NỘI DUNG; không cần giống bố cục gốc. Chép nguyên văn tiếng Anh, giữ dấu câu, không sửa/dịch/bịa.
- Mỗi hoạt động trong PDF = một Task, đúng thứ tự. Mỗi file một phiếu (nhiều nhóm thì làm nhóm tôi chỉ định).
- Ảnh chỉ ghi TÊN NGẮN dạng [ảnh: tên].
- Không đọc rõ thì ghi vào GHI CHÚ, không đoán.

QUY ƯỚC
# Tên phiếu                         (một dòng)
Tuổi: 7-9                           (5-6 | 7-9 | 10-12)

## Task: <tiêu đề/lệnh chính của bài>     (mỗi Task bắt đầu bằng dòng này)
Hướng dẫn: <hướng dẫn phụ / ví dụ mẫu>      (nếu có)
Track: Track 05                             (nếu là bài nghe)
Trả lời: <một trong: viết từ | điền chỗ trống | viết câu | khoanh A/B/C | chọn trong câu | tick | đúng/sai | nối | tô chữ | không>
Dòng viết: 2                                (số dòng viết mỗi câu, nếu viết câu)
Khung từ: từ1, từ2, từ3                     (nếu có hộp từ; từ có dấu phẩy thì ngăn bằng ;)
Ảnh: tên ảnh chung                          (nếu có một tranh chung của bài)
Lời dẫn: <câu dẫn>                          (trước hội thoại, nếu có)

Nội dung:
- Câu đánh số: `1. She ___ a teacher. A. am B. is C. are` (___ = chỗ trống; A. B. C. = lựa chọn; {a|b} = chọn trong câu; [ảnh: x] = ảnh của câu).
- Câu nhiều dòng: dòng thụt lề 2 dấu cách ngay dưới câu đánh số.
- Bài đọc: dòng `Bài đọc:` rồi các đoạn văn; sau đó mới đến câu hỏi đánh số.
- Hội thoại: dòng `Hội thoại:` rồi mỗi lượt một dòng `Tên: lời` (chỗ cần điền ghi ___).
- Nối: `1. cat - meow` (vế trái - vế phải; vế ảnh: `[ảnh: apple] - pear`), kèm `Trả lời: nối`.
- Bảng: mỗi hàng một dòng, các ô cách nhau ` | `; dòng đầu là tiêu đề cột; ô trống để học sinh viết thì để trống; `[ ]` = ô tick; `[ảnh: x]` = ô ảnh.
- Ô chữ (word search): dòng `Ô chữ:` rồi mỗi dòng một hàng chữ cái (viết liền, hoặc cách nhau dấu cách); từ cần tìm đưa vào `Khung từ:`.
- Bài chỉ có tranh (tô màu, vẽ): chỉ `Ảnh:` và `Trả lời: không`, không có câu.

ĐÁP ÁN (chỉ khi PDF có đáp án), đặt CUỐI file, tách khỏi đề:
## Đáp án
### Task 1
1. cat
2. dog
Task 2: is; are; an        (hoặc một dòng, các đáp án cách nhau dấu ;)
(Không ghi đáp án cho bảng và ô chữ.)

CHỌN "Trả lời:" NHANH
___ trong câu → điền chỗ trống · câu hỏi cần viết lại → viết câu · có A/B/C → khoanh A/B/C · True/False → đúng/sai · {a|b} trong câu → chọn trong câu · nghe & đánh dấu ảnh → tick · bảng, ô chữ, hội thoại miệng, tô màu → không · nhìn tranh viết từ → viết từ.

TỰ KIỂM TRA TRƯỚC KHI TRẢ LỜI: số câu đúng PDF; số ___ khớp số từ trong Khung từ (nếu dùng); mỗi Task đều có dòng `## Task:`; mọi Task nên có `Trả lời:`.

ĐẦU RA: một khối ```markdown duy nhất, rồi mục GHI CHÚ: (1) chỗ đọc không rõ, (2) Task chọn dạng chưa chắc, (3) danh sách ảnh cần tải lên theo từng Task.
````

---

## Sau khi AI trả kết quả
1. Lưu thành `ten-phieu.json` (hoặc `.md`). Nếu AI bọc trong ``` thì bỏ dòng ``` đầu và cuối.
2. App → **+ Phiếu** → Chọn file… Xem **bảng nhận diện**: số Task, mô tả từng Task, cảnh báo, ước tính số trang.
3. Chỗ nào bảng ghi "đã bù", "do hệ thống đoán" hay cảnh báo đỏ: sửa trong cột trái, hoặc nhờ AI sửa lại đúng Task đó.
4. Tải ảnh thật vào các ô ảnh (nút + trên từng ô).
5. Gặp dạng bài mà cả hai prompt không diễn đạt được: báo lại để mở rộng app theo quy trình 3 bước (dùng cái có sẵn → mở rộng → format mới).
