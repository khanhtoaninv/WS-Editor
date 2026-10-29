# CHỈ DẪN TẠO PHIẾU (gửi kèm ba tài liệu lesson)

Cách dùng: dán tin nhắn đầu gồm mục A (chỉ dẫn), mục B (định dạng đầu ra) và mục C (tự kiểm) dưới đây, sau đó dán lần lượt ba tài liệu: KIẾN THỨC, TRÌNH TỰ LESSON, TASK FORMAT. Không thêm lời nào khác. Có thể dán nguyên cả phản hồi của AI (hai khối) vào Editor, không cần tách; mục B quy định định dạng để việc đó không làm hỏng đáp án.

---

## A. CHỈ DẪN

Bạn là người soạn phiếu bài tập tiếng Anh cho trẻ tiểu học. Bạn nhận ba tài liệu của một lesson: KIẾN THỨC, TRÌNH TỰ LESSON, TASK FORMAT. Chỉ dùng thông tin trong ba tài liệu. Không tự thêm yêu cầu ngoài tài liệu.

Hãy tạo MỘT phiếu hoàn chỉnh gồm 6 Task, theo thứ tự và phương án sau:
1. Task 1: TF-G1-B
2. Task 2: TF-G2-B
3. Task 3: TF-G3a-A
4. Task 4: TF-G3b-A
5. Task 5: TF-G4-A
6. Task 6: TF-G5-A
Mức hỗ trợ: Chuẩn.

Nếu thiếu một trong bốn phần (chỉ dẫn này, KIẾN THỨC, TRÌNH TỰ LESSON, TASK FORMAT), nói rõ thiếu phần nào rồi dừng; không tự soạn thay. Nội dung viết trên phiếu (chỉ dẫn, bài đọc, câu hỏi, đáp án), ghi chú chấm (NOTES) và toàn bộ REPORT bằng tiếng Anh, không viết tiếng Việt. Làm đúng mọi quy tắc trong ba tài liệu. Trước khi trả lời, đọc lại phiếu và sửa mọi chỗ vi phạm mà bạn biết; không nộp phiếu còn vi phạm rồi khai ở REPORT (chỉ ghi vào REPORT điều thật sự không làm được hoặc hai quy tắc mâu thuẫn nhau). Nếu có hai quy tắc mâu thuẫn hoặc có điều không làm được, ghi vào mục báo cáo ở cuối, không im lặng bỏ qua.

## B. ĐỊNH DẠNG ĐẦU RA

Trả về đúng hai khối mã, theo thứ tự, không viết gì ngoài hai khối (không lời mở hay kết, không link tải):
1. Khối 1, mở bằng ```markdown: **PHIẾU**, viết đúng định dạng MD ở mục B1. Người dùng sao chép nguyên khối này để nạp, nên trong khối chỉ có phiếu, không có lời giải thích, không có NOTES hay REPORT.
2. Khối 2, mở bằng ```text: **BÁO CÁO**, gồm `NOTES` (ghi chú chấm từng Task) rồi `REPORT` (mục B2). Dòng tiêu đề viết đúng `NOTES` và `REPORT`.

**Ba điều bắt buộc để phiếu nạp được vào Editor** (Editor coi mọi dòng sau `## Đáp án` là đáp án, nên chữ ở khối 2 sẽ làm hỏng đáp án nếu viết sai):
- Dòng cuối cùng của khối 1 luôn là `### Task 0` (dòng kết thúc, không có gì sau nó). Dòng này báo cho Editor hết phần đáp án.
- Trong khối 2, không dòng nào bắt đầu bằng chữ `Task` kèm số. Viết `T1:`, `T2:`... (ví dụ `T4: Accept "don't eat" ...`).
- Trong khối 2, không dòng nào bắt đầu bằng `#`.

### B1. PHIẾU (định dạng MD)

Cấu trúc khối 1:

```
# <Tên phiếu>
Tuổi: 7-9
Xếp trang: tách

## Task: <tiêu đề Task>
Hướng dẫn: <chỉ dẫn, chép nguyên văn từ dòng Chỉ dẫn của TF>
Dạng: <dạng câu hỏi, xem bảng B1.2>
...nội dung Task theo mẫu B1.2...

## Task: <Task tiếp theo>
...

## Đáp án
### Task <số>
...
```

**B1.1 Quy ước chung**
- Một TF = một `## Task:`. Tiêu đề lấy từ TITLE của TF, chỉ dẫn lấy từ dòng Chỉ dẫn của TF (nguyên văn). Mỗi Task chỉ có một loại chỗ trả lời; Task có hai loại thì phần sau mở bằng `### Phần:` (mẫu TF-G4-A).
- Câu đánh số `1.`, `2.`...; câu ví dụ đánh số `0.`, đặt trước câu 1. Dòng tiếp của một câu (lượt thoại thứ hai, các lựa chọn) thụt lề đúng 3 dấu cách.
- Chỗ trống: `___` (đúng ba dấu gạch dưới). Không dùng `____` hay `__chữ__`.
- Chọn trong câu: đúng BA vế, `{vế|*vế đúng|vế}`, dấu `*` đặt trước vế đúng; vế đúng lần lượt ở vị trí 1, 2, 3 (không cố định một vị trí). Không dùng `[A / B]`, không dùng hai vế.
- Lựa chọn A, B, C: mỗi câu đúng ba lựa chọn, mỗi lựa chọn một dòng, bắt đầu `A.` rồi `B.` rồi `C.`, thụt lề 3 dấu cách dưới câu.
- Bảng: dòng đầu là tiêu đề cột; các ô cách nhau bằng ` | `. Ô học sinh điền để trống hoặc viết `=đáp án` (đáp án không in trên phiếu). Ô có chữ in sẵn viết chữ.
- Chữ nằm trên bảng hoặc bên dưới Task (bài đọc ngắn, ví dụ, câu dẫn thời điểm): `Khối chữ trên:` rồi các dòng thụt lề 2 dấu cách. Không dùng `Bài đọc:` cho Task có bảng.
- Khung từ: `Khung từ: từ 1, từ 2, từ 3`.
- Chỉ dùng các tên trường trong khung và trong B1.2. Không tự thêm trường, không tự thêm tiêu đề `STIMULUS`, `ITEMS`, `ANSWER KEY`, `NOTES` vào phiếu.
- Ngoài phiếu: không có dòng chữ tự do nằm ngoài trường (dòng không thuộc trường, không đánh số, không thuộc bảng sẽ bị hiểu nhầm).

**B1.2 Mẫu cho từng TF** (`<...>` là chỗ bạn viết nội dung; phần chữ in nghiêng không chép)

TF-G1-B (bảng, ô gõ):
```
## Task: <TITLE>
Hướng dẫn: <Chỉ dẫn>
Dạng: bảng
Khối chữ trên:
  <câu 1 của văn bản nguồn>
  <câu 2 của văn bản nguồn>
<Name> | <Usually và định nghĩa> | <Now và định nghĩa>
<Tên hàng mẫu> | <ô mẫu đã điền> | <ô mẫu đã điền>
<Tên hàng 1> | =<đáp án> | =<đáp án>
<Tên hàng 2> | =<đáp án> | —
```

TF-G2-B (chọn câu đáp):
```
Dạng: chọn A/B/C
0. <Tên>: <lượt hỏi>
   <Tên>: ___
   A. <câu đáp A>
   B. <câu đáp B>
   C. <câu đáp C>
1. <Tên>: <lượt hỏi>
   <Tên>: ___
   A. ...
   B. ...
   C. ...
```
Đáp án ở cuối file: `### Task <số>` rồi `0. B`, `1. A`... (chữ của lựa chọn đúng; kể cả câu ví dụ). Lời kể (cảnh) đứng riêng một dòng ở đầu câu, không đặt trong lượt `Tên:`. Luôn viết đúng `Dạng: chọn A/B/C`, mỗi câu có đủ ba lựa chọn A, B, C; không viết `chọn A/B`.

TF-G3a-A (chọn trong câu):
```
Dạng: chọn trong câu
0. <câu có {*vế đúng|vế sai|vế sai}>
1. <Tên>: <lượt 1>
   <Tên>: <lượt 2 có {vế sai|vế sai|*vế đúng}>
```
Đáp án nằm ngay trong câu bằng dấu `*`; không ghi ở `## Đáp án`.

TF-G3b-A (điền từ):
```
Dạng: điền từ
0. <câu có ___ (<động từ>)>
1. <Tên>: <lượt 1>
   <Tên>: <lượt 2 có ___ (<động từ>)>
2. ___ <chủ ngữ> ___ (<động từ>) <phần còn lại>?
```
Đáp án ở cuối file: `### Task <số>`, mỗi câu một dòng `0. <đáp án>`. Câu có hai chỗ trống: các đáp án cách nhau ` | ` (ví dụ `2. Do | watch`). Chỉ viết một dạng của đáp án (don't và do not tự được coi là một); dạng khác nghĩa tương đương mới viết thêm sau ` / `.

TF-G4-A (dữ kiện dạng bảng rồi viết câu):
```
## Task: <TITLE>
Hướng dẫn: <Chỉ dẫn>
Dạng: bảng
Khối chữ trên:
  <câu dẫn thời điểm>
Name | Usually (what someone does again and again) | Now (what someone is doing at this moment)
<hàng 1> | <động từ nguyên mẫu, nơi chốn, giờ> | <...>
<hàng 2> | <...> | <...>

### Phần: Write
Dạng: viết câu
Dòng viết: 2
1. <Tên bạn>: "<câu bạn nói>"
   <Tên> … <He hoặc She> …
2. <Tên bạn>: "<câu bạn nói>"
   <Tên> … <He hoặc She> …
```
Mọi ô của bảng đều có chữ (không để trống, không dùng `=`). Câu mẫu để chấm đưa vào NOTES, không đưa vào khối 1.

TF-G5-A (viết tự do):
```
## Task: <TITLE>
Hướng dẫn: <Chỉ dẫn>
Khung từ: <từ 1>, <từ 2>, ...
Khối chữ trên:
  <ví dụ 1>
  <ví dụ 2>
Dạng: viết tự do
Dòng viết: 4
```

Các TF khác của lesson (nếu được chọn): chỗ chọn đúng/sai nhãn Usually/Now → `Dạng: đúng/sai (Usually/Now, cùng hàng)`; chọn câu hoàn chỉnh → `Dạng: chọn A/B/C`; viết câu biến đổi → `Dạng: viết câu` với `Dòng viết: 2`; hội thoại điền → `Hội thoại:` rồi mỗi lượt một dòng `Tên: lời`, chỗ trống `___`; ô tự rà soát → `Trả lời: không` và `Khối chữ trên:` với các dòng `☐ ...`.

**B1.3 Đáp án (cuối khối 1)**
```
## Đáp án
### Task 2
0. B
1. A
### Task 4
0. <đáp án>
1. <đáp án>
### Task 0
```
`### Task 0` là dòng cuối cùng của khối 1; luôn có `## Đáp án` và dòng này, kể cả khi không Task nào cần đáp án ở đó. Số `### Task n` là số thứ tự của Task trong file (Task có `### Phần:` chỉ đếm một lần). Task chọn trong câu, bảng, viết câu, viết tự do không có dòng trong `## Đáp án` (chọn trong câu và bảng ghi đáp án ngay tại chỗ; viết câu và viết tự do dùng NOTES).

### B1b. NOTES (đầu khối 2)
```
NOTES
T1: <ghi chú cho người chấm, đáp án chấp nhận thêm>
T5: <câu mẫu đúng, các biến thể chấp nhận>
T6: <các câu mẫu, tiêu chí chấm>
```
Mỗi Task một dòng bắt đầu `T<số>:` (không viết `Task <số>:`). Ô "—" in sẵn, ô không chấm hay lý do thiết kế đặc biệt cũng ghi ở đây. Task không cần ghi chú thì bỏ.

### B2. BÁO CÁO (sau NOTES trong khối 2)
Mục có tiêu đề `REPORT`, gồm các mục dưới đây (viết bằng tiếng Anh; dòng nào nói về một Task cũng bắt đầu bằng `T<số>:`, không bắt đầu bằng `Task <số>`). Trước khi viết REPORT, đọc lại phiếu và tự sửa mọi chỗ vi phạm; chỉ ghi vào mục 5 điều thật sự không làm được.
1. Bảng: số Task | mã TF | số câu có đáp án (không tính câu ví dụ) | kiểu trả lời.
2. Với mỗi Task thuộc G2, G3a, G3b: số câu thỏa quy tắc S5 mục 1 (không có từ chỉ thời gian theo S5 mục 0 mở rộng, và câu liền trước không chứa dạng động từ của đáp án; câu "đang làm" ở G3a, G3b phải theo S5 mục 1e) và số thứ tự các câu đó. Nếu dưới 30%, đã viết lại chưa? Chỉ để trống khi không làm được.
   Với mỗi câu chọn hoặc điền: xác nhận đã thử cả hai đáp án còn lại và cả hai sai.
   Với mỗi câu "đang làm" ở G2, G3a, G3b: ghi (a) hoặc (b); nếu (b) thì ghi kiểu (1) đến (8) của S5 mục 1e. Ghi số lần "Sorry, I can't" trên cả phiếu, và số kiểu (b) khác nhau.
   Ghi dãy đáp án của Task 2 (ví dụ B C A A C B) và vị trí đáp án đúng (1, 2 hoặc 3) của từng câu Task 3; cả hai dãy phải dùng đủ ba vị trí, không có chữ nào ba câu liền.
   Task 3: ghi số câu theo loại (câu đơn một dòng, phủ định, câu hỏi, hội thoại có từ hai lượt trở lên).
3. Số lần mỗi động từ chính (play, read, watch, eat, go, ride, swim, draw) xuất hiện trong phần học sinh đọc và làm (không tính chỉ dẫn, dòng Khung từ, đáp án, ghi chú; trợ động từ do không tính; mỗi câu chọn tính một lần, không đếm vế sai), theo từng Task và tổng cả phiếu.
4. Danh sách từ trong phiếu không nằm trong danh sách liệt kê ở K4 và K5 (chỉ liệt kê từ; không cần ghi Starters hay Movers). Chỉ liệt kê từ nội dung (danh từ, động từ, tính từ, trạng từ); không liệt kê từ chức năng (the, in, to, my, his...), chỉ dẫn, tên riêng, từ chỉ ngày giờ. Phải rà từng Task, từng câu; chỉ viết "None" khi thật sự không còn từ nào.
5. Mọi quy tắc trong ba tài liệu mà bạn không làm theo được hoặc thấy mâu thuẫn, kèm lý do. Nếu không có, viết "None".
6. Câu nào trên phiếu trùng hoặc rất giống một câu có sẵn trong ba tài liệu (kể cả câu minh họa ở S5 mục 1e), hoặc lặp một câu hỏi mở đầu hay một tình huống hơn mức cho phép ở S5 mục 8? Liệt kê hoặc viết "None".

## C. TỰ KIỂM ĐỊNH DẠNG (làm trước khi trả lời)
1. DÒNG ĐẦU TIÊN của cả phản hồi là ```markdown (không chữ nào đứng trước). Dòng đầu trong khối là `# <Tên phiếu>`, rồi `Tuổi:` và `Xếp trang:`.
2. Có đúng 6 dòng `## Task:`; không có tiêu đề kiểu `### Task 1:` hay `**Instruction:**`.
3. Mỗi `Dạng:` là một giá trị trong mục B1.2 (`bảng`, `chọn A/B/C`, `chọn trong câu`, `điền từ`, `viết câu`, `viết tự do`). Không dùng bảng có dòng `|---|`, không dùng `[A / B]`, không dùng `____` (chỉ `___`).
4. Có `## Đáp án` và dòng cuối của khối 1 là `### Task 0`. Mỗi đáp án trong `## Đáp án` chỉ một dạng duy nhất (không viết `a / b`); dạng khác chấp nhận được thì ghi ở NOTES.
5. Khối 2 mở bằng ```text, dòng đầu là `NOTES`, sau đó `REPORT`; tiếng Anh; không dòng nào bắt đầu bằng `Task <số>` hoặc `#`.
6. Ngoài hai khối không có chữ nào. Trong phiếu không có chữ nào của quá trình nghĩ (không "Wait", "Hmm", "Actually", "Let me"): nếu một câu sai thì sửa luôn, chỉ giữ bản cuối.
7. Mỗi câu `chọn A/B/C` có đúng ba dòng A, B, C. Mỗi `{…}` có đúng ba vế và đúng MỘT dấu `*`.
8. Không lựa chọn hoặc vế nào chứa từ chỉ thời gian (S5 mục 0); từ đó chỉ nằm ở câu hỏi hoặc câu dẫn.
9. Dãy đáp án Task 2 (A/B/C) và dãy vị trí đáp án đúng Task 3 (1/2/3), kể cả câu ví dụ: dùng đủ ba giá trị, không giá trị nào ba câu liền, và KHÔNG lặp chu kỳ (không ABCABC, không 231231; phải có ít nhất một chỗ hai câu liền cùng giá trị).
