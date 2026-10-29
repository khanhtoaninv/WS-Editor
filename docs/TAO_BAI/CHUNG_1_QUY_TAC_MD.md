# File chung số 1 — Quy tắc viết MD khi sinh một bài

Phiên bản: nháp-1 (29/10/2026, theo app v124)

Gửi cho AI ở **lượt sinh bài** (đặc tả `DAC_TA_TAO_BAI.md` mục 8.1), cùng file chung 2 (`1_DANG_Q.md`, mô tả 12 dạng Q). Rút từ `docs/QUY_UOC_MD.md` (quy ước đầy đủ cho mọi phiếu) và các bẫy tìm thấy ở T0 (`tests/taobai/test_q12.py`). Khác prompt đọc PDF (`docs/PROMPT_PDF_SANG_PHIEU.md`): ở đây AI **viết mới một bài** theo cấu trúc đã duyệt, không chép phiếu có sẵn.

---

## 1. Khung kết quả

Trả về **đúng một bài**, không gì khác (không lời chào, không giải thích, không khối ``` bao ngoài):

```
## Task: <tiêu đề bài, là câu lệnh tiếng Anh cho học sinh>
Mục tiêu: <một câu tiếng Việt: bài này luyện gì>
Ngữ cảnh: <vài chữ: tình huống / nhân vật của bài>
Hướng dẫn: <chỉ khi cần thêm một câu lệnh ngoài tiêu đề>
Dạng: <đúng dạng được giao, vd "điền từ" hoặc "Q1">
<các trường riêng của dạng: Khung từ:, Dòng viết:, Xáo vế phải:, …>
<nội dung: Bài đọc: / các câu 1., 2., …>

## Đáp án
### Task 1
1. …
2. …
```

1. **Không** viết dòng tên phiếu `# …`, `Tuổi:`, `Xếp trang:`, `Khoảng cách:` (app đã có phiếu).
2. `Mục tiêu:` và `Ngữ cảnh:` đặt **ngay dưới** dòng `## Task:`. App tách hai dòng này ra trước khi đọc bài; viết chỗ khác thì chúng thành câu hỏi.
3. `Dạng:` **bắt buộc**, đúng dạng được giao. Không tự đổi dạng, không thêm phần (`### Phần:`), không tách thành hai bài.
4. **Số câu đúng bằng số được giao** (Q12: số dòng viết, xem mục 3). Câu ví dụ `0.` không tính vào số câu và chỉ viết khi được yêu cầu.
5. Đáp án luôn ở `## Đáp án` → `### Task 1` (luôn là `Task 1`), mỗi câu một dòng `n. đáp án`, trừ các dạng ghi đáp án ngay trong bài (mục 3).

## 2. Viết nội dung

- **Câu đánh số** `1.`, `2.`, … Không bắt đầu dòng bằng `a.`, `b.` (app hiểu là lựa chọn của câu trên). Muốn nhãn a, b, c thì vẫn viết `1.`, `2.` và thêm `Số câu: a b c`.
- **Chỗ trống** `___` (ba gạch dưới). Câu nhiều chỗ trống: đáp án một dòng, cách nhau ` | ` (`3. was | were`).
- **Bài đọc:** dòng `Bài đọc:` đứng riêng, đoạn văn ở các dòng **bên dưới**; tiêu đề bài đọc (nếu có) là dòng đầu, dạng `**TIÊU ĐỀ**`, rồi một dòng trống. Không viết chữ ngay sau `Bài đọc:` trên cùng dòng (app vẫn nhận nhưng ghi chú). Dòng trống giữa hai đoạn = sang đoạn mới.
- **Hội thoại:** dòng `Hội thoại:` đứng riêng, mỗi lượt một dòng `Tên: lời`.
- **Khung từ:** `Khung từ: was, were, wasn't, weren't` (dấu phẩy; từ có dấu phẩy thì dùng `;`).
- **Ảnh:** chỉ là **tên mô tả để vẽ / tìm ảnh** (`[ảnh: a girl reading a book]`, `Ảnh: a family at the beach`), tiếng Anh, cụ thể, không lộ đáp án.
- **Kiểu chữ** chỉ khi ý bài cần: `**đậm**`, `*nghiêng*`, `<u>gạch chân</u>`. **Không** gạch chân bằng `__từ__` (app hiểu là chỗ trống).
- Không viết dòng kẻ `______` riêng, không viết `My answer: A / B / C`, không viết nhãn trống kiểu `Câu hỏi:` (app tự vẽ chỗ trả lời).

## 3. Theo dạng

| Dạng | Viết | Đáp án | Bẫy |
|---|---|---|---|
| Q1 Điền từ | `___` trong câu; `Khung từ:` nếu có | `## Đáp án` | có khung từ: đáp án phải nằm trong khung; không câu nào hai từ trong khung cùng đúng |
| Q2 Viết câu | `Dòng viết: N`; câu không có `___` ở cuối | `## Đáp án`, một câu mẫu | **sắp xếp từ**: các từ cách nhau ` / `, **mỗi câu một số** (`1. you / did / go / where / ?`) |
| Q3 Chọn A/B/C | lựa chọn `A. … B. … C. …` cùng dòng với câu, hoặc dòng thụt lề ngay dưới câu | `## Đáp án` (chữ cái) | đúng một phương án đúng; rải đều vị trí A/B/C |
| Q4 Chọn trong câu | `{a\|b}` trong câu, `*` trước vế đúng | dấu `*` (không cần `## Đáp án`) | mỗi `{…}` đúng một `*` |
| Q5 Đúng / Sai | `Dạng: đúng/sai` (+ `(Yes/No)`, `(cùng hàng)` nếu được giao) | `## Đáp án`: `T`/`F` (hoặc đúng nhãn đã chọn: `Yes`/`No`) | câu khẳng định rõ, kiểm được bằng bài đọc / tranh |
| Q6 Nhìn ảnh viết | mỗi câu `1. [ảnh: …]` | `## Đáp án` | mỗi ảnh chỉ một cách gọi tên; đánh vần theo ô: `Dạng: nhìn ảnh viết (ô chữ cái)` |
| Q7 Chọn ảnh | câu hỏi rồi dòng thụt lề `A. [ảnh: …] B. [ảnh: …] C. [ảnh: …]` | `## Đáp án` (chữ cái) | các ảnh cùng loại, khác nhau nhìn thấy được khi in đen trắng |
| Q8 Nối | `1. vế trái - vế phải` (cặp **đúng** viết cạnh nhau) + `Xáo vế phải: có`; vế thừa `n. - vế phải` | chính các cặp (app xáo khi in) | mỗi vế trái ghép được đúng một vế phải |
| Q9 Tô chữ | mỗi dòng một từ / câu để tô | không có | |
| Q10 Bảng | dòng đầu là tiêu đề cột, ô cách nhau ` \| `; ô học sinh điền ghi `=đáp án` | `=đáp án` trong ô (không ghi ở `## Đáp án`) | một hàng bảng luôn trên một dòng; xuống dòng trong ô dùng `<br>` |
| Q11 Lưới | **không sinh tự động** (AI dựng lưới dễ sai) | | |
| Q12 Viết tự do | **không có câu đánh số**; `Dòng viết: N` (N = số được giao); câu hỏi dẫn trong `Khối chữ trên:` (các dòng thụt lề 2 dấu cách); vẽ: `Dạng: viết tự do (khung vẽ)` | không có (bỏ `## Đáp án`) | yêu cầu số từ ghi trong tiêu đề hoặc `Hướng dẫn:` |

## 4. Ví dụ kết quả (Q1, 6 câu)

```
## Task: Complete with was or were.
Mục tiêu: Chọn was / were theo chủ ngữ số ít / số nhiều
Ngữ cảnh: Cuối tuần của gia đình Mai ở bãi biển
Dạng: điền từ
Khung từ: was, were
1. Mai ___ at the beach last Sunday.
2. Her parents ___ there too.
3. The weather ___ hot and sunny.
4. The children ___ very happy.
5. Her brother ___ in the water all morning.
6. We ___ tired in the evening.

## Đáp án
### Task 1
1. was
2. were
3. was
4. were
5. was
6. were
```

## 5. Ví dụ kết quả (Q12, 5 dòng)

```
## Task: Write about your last weekend (30–40 words).
Mục tiêu: Tự viết đoạn ngắn dùng was / were
Ngữ cảnh: Cuối tuần của em
Dạng: viết tự do
Dòng viết: 5
Khối chữ trên:
  Where were you? Who were you with? How was the weather?
```
