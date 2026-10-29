# CHỈ DẪN TẠO PHIẾU (gửi kèm ba tài liệu lesson)

Cách dùng: dán tin nhắn đầu gồm mục A (chỉ dẫn) và mục B (định dạng đầu ra) dưới đây, sau đó dán lần lượt ba tài liệu: KIẾN THỨC, TRÌNH TỰ LESSON, TASK FORMAT. Không thêm lời nào khác.

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

Nội dung viết trên phiếu (chỉ dẫn, bài đọc, câu hỏi, đáp án), ghi chú chấm (NOTES) và toàn bộ REPORT bằng tiếng Anh. Làm đúng mọi quy tắc trong ba tài liệu. Nếu có hai quy tắc mâu thuẫn hoặc có điều không làm được, ghi vào mục báo cáo ở cuối, không im lặng bỏ qua.

## B. ĐỊNH DẠNG ĐẦU RA

Trả về đúng hai khối mã, theo thứ tự, không viết gì ngoài hai khối (không lời mở hay kết, không link tải):
1. Khối 1, mở bằng ```markdown: **PHIẾU**, viết đúng định dạng MD ở mục B1. Người dùng sao chép nguyên khối này để nạp, nên trong khối chỉ có phiếu, không có lời giải thích, không có NOTES hay REPORT.
2. Khối 2, mở bằng ```text: **BÁO CÁO**, gồm `NOTES` (ghi chú chấm từng Task) rồi `REPORT` (mục B2). Dòng tiêu đề viết đúng `NOTES` và `REPORT`.

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
- Chọn hai vế ngay trong câu: `{vế sai|*vế đúng}`, dấu `*` đặt trước vế đúng, vế đúng khi thì ở trái, khi ở phải. Không dùng `[A / B]`.
- Lựa chọn A, B: mỗi lựa chọn một dòng, bắt đầu `A.` rồi `B.`, thụt lề 3 dấu cách dưới câu.
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
1. <Tên>: <lượt hỏi>
   <Tên>: ___
   A. ...
   B. ...
```
Đáp án ở cuối file: `### Task <số>` rồi `0. B`, `1. A`... (chữ của lựa chọn đúng; kể cả câu ví dụ). Lời kể (cảnh) đứng riêng một dòng ở đầu câu, không đặt trong lượt `Tên:`.

TF-G3a-A (chọn trong câu):
```
Dạng: chọn trong câu
0. <câu có {*vế đúng|vế sai}>
1. <Tên>: <lượt 1>
   <Tên>: <lượt 2 có {vế sai|*vế đúng}>
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
<Name> | <cột 1> | <cột 2>
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
```
Số `### Task n` là số thứ tự của Task trong file (Task có `### Phần:` chỉ đếm một lần). Task chọn trong câu, bảng, viết câu, viết tự do không có dòng trong `## Đáp án` (chọn trong câu và bảng ghi đáp án ngay tại chỗ; viết câu và viết tự do dùng NOTES).

### B1b. NOTES (đầu khối 2)
```
NOTES
Task 1: <ghi chú cho người chấm, đáp án chấp nhận thêm>
Task 5: <câu mẫu đúng, các biến thể chấp nhận>
Task 6: <các câu mẫu, tiêu chí chấm>
```
Mỗi Task một dòng bắt đầu `Task <số>:`. Ô "—" in sẵn, ô không chấm hay lý do thiết kế đặc biệt cũng ghi ở đây. Task không cần ghi chú thì bỏ.

### B2. BÁO CÁO (sau NOTES trong khối 2)
Mục có tiêu đề `REPORT`, gồm:
1. Bảng: số Task | mã TF | số câu có đáp án (không tính câu ví dụ) | kiểu trả lời.
2. Với mỗi Task thuộc G2, G3a, G3b: số câu thỏa quy tắc S5 mục 1 (không có từ chỉ thời gian theo S5 mục 0 mở rộng, và câu liền trước không chứa dạng động từ của đáp án; câu "đang làm" ở G3a, G3b phải theo S5 mục 1e) và số thứ tự các câu đó. Nếu dưới 30%, đã viết lại chưa? Chỉ để trống khi không làm được.
   Với mỗi câu chọn hoặc điền: xác nhận đã thử đáp án còn lại và nó sai.
3. Số lần mỗi động từ chính (play, read, watch, eat, go, ride, swim, draw) xuất hiện trong phần học sinh đọc và làm (không tính chỉ dẫn, đáp án, ghi chú; trợ động từ do không tính; câu chọn `[A / B]` tính cả hai vế), theo từng Task và tổng cả phiếu.
4. Danh sách từ trong phiếu không nằm trong danh sách liệt kê ở K4 và K5 (chỉ liệt kê từ; không cần ghi Starters hay Movers). Chỉ liệt kê từ nội dung (danh từ, động từ, tính từ, trạng từ); không liệt kê từ chức năng (the, in, to, my, his...), chỉ dẫn, tên riêng, từ chỉ ngày giờ. Phải rà từng Task, từng câu; chỉ viết "None" khi thật sự không còn từ nào.
5. Mọi quy tắc trong ba tài liệu mà bạn không làm theo được hoặc thấy mâu thuẫn, kèm lý do. Nếu không có, viết "None".
