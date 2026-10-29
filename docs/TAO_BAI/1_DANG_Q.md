# File chung số 2 — 12 dạng câu hỏi (Q) của WS Editor

Bản nháp 29/10/2026, theo app v123 (`docs/QUY_UOC_MD.md` mục 2, 2b, 4, 5). **Rà lại ở T0 (v124)**: mọi ví dụ dưới đây nạp đúng dạng Q (`tests/taobai/test_q12.py`); quy tắc viết khi sinh bài ở file chung 1 `CHUNG_1_QUY_TAC_MD.md`.
Dùng cho hai việc: (1) người viết **TF** tra để chọn `Dạng app:` cho mỗi dạng bài; (2) AI đọc ở bước đề xuất danh sách Task và bước sinh bài.

Cách ghi trong TF:
```
## Dạng 3: Sắp xếp từ thành câu
Dạng app: Q2 Viết câu
```
Trong MD do AI viết: `Dạng: viết câu` hoặc `Dạng: Q2`. Chi tiết trong ngoặc: `Dạng: Q5 (Yes/No, cùng hàng)`.

---

## Bảng tóm tắt

| Mã | Tên | Học sinh làm gì | Cần ảnh | Đáp án ghi ở đâu |
|---|---|---|---|---|
| Q1 | Điền từ | viết từ vào `___` trong câu | không | `## Đáp án` |
| Q2 | Viết câu | viết câu trên dòng kẻ | không | `## Đáp án` |
| Q3 | Chọn A/B/C | khoanh / tick một lựa chọn dưới câu | không | `## Đáp án` (chữ cái) |
| Q4 | Chọn trong câu | gạch / khoanh `{a\|b}` ngay trong câu | không | dấu `*` trong câu |
| Q5 | Đúng / Sai | khoanh T/F (Yes/No…) | không | `## Đáp án` |
| Q6 | Nhìn ảnh viết | nhìn ảnh của câu, viết từ / câu | **có**, mỗi câu 1 ảnh | `## Đáp án` |
| Q7 | Chọn ảnh | tick ảnh đúng trong 2–4 ảnh | **có**, mỗi câu 2–4 ảnh | `## Đáp án` |
| Q8 | Nối | nối vế trái với vế phải | tùy (vế trái có thể là ảnh) | cặp viết cạnh nhau + `Xáo vế phải: có` |
| Q9 | Tô chữ | tô theo chữ mờ | không | không cần |
| Q10 | Bảng | điền / tick vào ô bảng | tùy (ô ảnh) | `=đáp án` trong ô |
| Q11 | Lưới | ô chữ giải đố / tìm từ | không | chữ cái trong lưới |
| Q12 | Viết tự do | viết đoạn / vẽ, không có câu | tùy | không có |

Thành phần dùng chung cho mọi Q (không phải dạng riêng): `Khung từ:` (hoặc `Khung từ ảnh:`), `Bài đọc:`, `Hội thoại:`, `Ảnh:` chung của Task, câu ví dụ `0.`, `Khối chữ:`, `Track:` (bài nghe), `### Phần:` (bài nhiều phần).

---

## Q1 Điền từ
- **Trên phiếu:** gạch `___` trong câu (hoặc dưới câu).
- **Hợp với:** điền từ có khung từ, chia động từ trong ngoặc, điền giới từ / mạo từ, đoạn văn có chỗ trống, hoàn thành hội thoại.
- **Tùy chọn:** `(ô chữ cái)` = mỗi chữ một ô (bài đánh vần). `Khung từ:` nếu cho sẵn từ.
- **Đoạn văn có chỗ trống:** không viết vào `Bài đọc:`; mỗi đoạn là một câu `1.`, chỗ trống `(a) ___`, kèm `Số câu: ẩn`.
- **Câu nhiều chỗ trống:** đáp án một dòng, cách nhau ` | `: `3. went | played`.
- **Ví dụ:**
  ```
  ## Task: Complete the sentences.
  Dạng: điền từ
  Khung từ: was, were
  0. She ___ at home yesterday.
  1. They ___ happy.
  ```
- **Lưu ý khi sinh:** có khung từ thì số từ trong khung khớp số chỗ trống (hoặc ghi rõ có từ thừa). Đáp án duy nhất; tránh câu mà hai từ trong khung đều đúng.

## Q2 Viết câu
- **Trên phiếu:** dòng kẻ dưới câu, `Dòng viết: N` (tới 20).
- **Hợp với:** sắp xếp từ thành câu, viết lại câu, trả lời câu hỏi, đặt câu hỏi cho phần gạch chân, dịch câu.
- **Tùy chọn:** `(bốn ô li)` = dòng tập viết 4 ô li (lớp nhỏ).
- **Câu nhiều dòng:** dòng thụt lề ≥ 2 dấu cách ngay dưới câu (vd câu gốc rồi `He used to ___ .`).
- **Ví dụ:**
  ```
  Dạng: viết câu
  Dòng viết: 1
  1. you / did / go / where / yesterday / ?
  ```
- **Lưu ý khi sinh:** đáp án mẫu là một câu; nếu có nhiều cách đúng thì ghi cách chuẩn nhất. Không viết `___` cuối câu (app tự vẽ dòng).
- **Sắp xếp từ:** các từ cách nhau ` / `, mỗi câu một số. (Trước v124, câu `2. was / at / I / home` đứng ngay sau một câu kết thúc bằng `?` bị app gộp thành lựa chọn của câu trên rồi mất hẳn; đã sửa.)

## Q3 Chọn A/B/C
- **Trên phiếu:** lựa chọn dưới câu, nhãn mặc định `a. b. c.`.
- **Hợp với:** trắc nghiệm ngữ pháp / từ vựng, câu hỏi đọc hiểu, câu hỏi nghe.
- **Tùy chọn:** `(khoanh)` vòng tròn ⓐ; `(ô tick)` ☐; `(căn giữa)` / `(căn dưới)`.
- **Ví dụ:**
  ```
  Dạng: chọn A/B/C
  1. I ___ to the zoo last Sunday.
     A. go  B. went  C. goes
  ```
- **Lưu ý khi sinh:** đúng một đáp án đúng; phương án nhiễu cùng loại từ, cùng độ dài tương đối; vị trí đáp án đúng rải đều A/B/C.

## Q4 Chọn trong câu
- **Trên phiếu:** `{a|b}` trong câu, học sinh gạch / khoanh.
- **Hợp với:** chọn từ đúng trong ngoặc, phân biệt cặp dễ nhầm (was/were, a/an, much/many).
- **Tùy chọn:** `(nhãn A-D)` = bài tìm lỗi sai: viết các đoạn gạch chân `<u>…</u>`, app in A B C D dưới từng đoạn.
- **Đáp án:** dấu `*` trước vế đúng, không cần `## Đáp án`.
- **Ví dụ:**
  ```
  Dạng: chọn trong câu
  1. There {*was|were} a cat in the garden.
  ```
- **Lưu ý khi sinh:** mỗi `{…}` đúng một vế có `*`. Hợp nhất với Kiến thức dạng cặp đối lập; lesson không có cặp đối lập thì nên chọn Q khác.

## Q5 Đúng / Sai
- **Trên phiếu:** khoanh T / F.
- **Hợp với:** đọc / nghe rồi chọn đúng sai, Yes/No theo tranh.
- **Tùy chọn:** nhãn `(Yes/No)`, `(True/False)`, `(T/F/NG)`, `(Right/Wrong)`; `(ô tick)`; `(cùng hàng)` = T F cuối hàng bên phải câu.
- **Ví dụ:**
  ```
  Dạng: đúng/sai (cùng hàng)
  1. Tom went to the beach.
  ```
- **Lưu ý khi sinh:** câu khẳng định rõ, kiểm được bằng bài đọc / tranh; tỉ lệ đúng / sai không lệch quá (vd 3/2 với 5 câu); tránh câu phủ định kép.

## Q6 Nhìn ảnh viết
- **Trên phiếu:** mỗi câu một ảnh `[ảnh: tên]`, chỗ viết dưới ảnh.
- **Hợp với:** viết từ vựng theo tranh, mô tả tranh bằng một câu.
- **Tùy chọn:** `Kích thước ảnh: 50%–150%`, `Ảnh vừa ô: có`; `(ô chữ cái)` = viết từ theo ô (đánh vần theo tranh). Câu có `[ảnh: …]` mà ghi `Dạng: điền từ (ô chữ cái)` thì app vẫn hiểu là Q6.
- **Ví dụ:**
  ```
  Dạng: nhìn ảnh viết
  1. [ảnh: a girl reading a book]
  ```
- **Lưu ý khi sinh:** tên ảnh là **mô tả để vẽ / tìm ảnh**, không lộ đáp án quá rõ nếu đáp án là chính từ đó (ghi chú cho người vẽ riêng nếu cần). Mỗi ảnh chỉ có một cách gọi tên hợp lý.

## Q7 Chọn ảnh
- **Trên phiếu:** mỗi câu 2–4 ảnh, tick ảnh đúng.
- **Hợp với:** nghe / đọc rồi chọn tranh, lớp nhỏ chưa viết được.
- **Ví dụ:**
  ```
  Dạng: chọn ảnh
  1. What did Tom eat?
     A. [ảnh: pizza] B. [ảnh: noodles] C. [ảnh: rice]
  ```
- **Lưu ý khi sinh:** các ảnh cùng loại (cùng là món ăn); khác biệt nhìn thấy được khi in đen trắng.

## Q8 Nối
- **Trên phiếu:** hai cột, chấm nối `trái - phải`.
- **Hợp với:** nối câu hỏi với câu trả lời, nối nửa câu, nối từ với tranh / nghĩa.
- **Tùy chọn:** `Tiêu đề cột: A | B`; `Chỗ nối: chấm / ô viết chữ / không`; `Viền hai vế: có`; vế phải thừa `6. - F. ...`.
- **Đáp án:** viết cặp đúng cạnh nhau và thêm `Xáo vế phải: có` (app xáo khi in).
- **Ví dụ:**
  ```
  Dạng: nối
  Xáo vế phải: có
  1. Where did you go? - I went to the park.
  2. Who did you go with? - My sister.
  ```
- **Lưu ý khi sinh:** mỗi vế trái chỉ ghép được đúng một vế phải; thêm 1 vế thừa nếu muốn chống đoán.

## Q9 Tô chữ
- **Trên phiếu:** dòng chữ mờ để tô.
- **Hợp với:** lớp nhỏ, tập viết chữ / từ.
- **Tùy chọn:** `(bốn ô li)`.
- **Lưu ý khi sinh:** chỉ chép từ / câu mẫu, không có đáp án.

## Q10 Bảng
- **Trên phiếu:** bảng, dòng đầu là tiêu đề cột; ô trống để viết, `[ ]` ô tick, `[ảnh: x]` ô ảnh; `<br>` xuống dòng trong ô.
- **Hợp với:** điền thông tin khi nghe / đọc, phân loại từ vào cột, khảo sát.
- **Đáp án:** `=đáp án` trong ô (`| Tom | 9 | =swimming |`).
- **Ví dụ:**
  ```
  Dạng: bảng
  Name | Place | Activity
  Tom | =the zoo | =saw lions
  ```
- **Lưu ý khi sinh:** mỗi ô cần điền có đúng một đáp án; thông tin để điền có thật trong bài đọc / script.

## Q11 Lưới
- **Trên phiếu:** ô chữ giải đố (`Crossword:`) hoặc tìm từ (`Ô chữ:` + `Khung từ:`).
- **Hợp với:** ôn từ vựng.
- **Lưu ý khi sinh:** AI dựng lưới (chữ giao nhau, đúng hàng cột) **rất dễ sai**. Đề xuất: AI chỉ đưa danh sách từ + gợi ý, lưới do code dựng. Chưa có cú pháp riêng cho gợi ý ngang / dọc. Tạm thời TF nên tránh Q11 cho sinh tự động.

## Q12 Viết tự do
- **Trên phiếu:** không có câu; khung viết N dòng (`Dòng viết: N`, tới 20) hoặc `(khung vẽ)`.
- **Hợp với:** viết đoạn ngắn, viết thư / nhật ký, vẽ.
- **Ví dụ:**
  ```
  ## Task: Write about your last weekend (30–40 words).
  Dạng: viết tự do
  Dòng viết: 6
  Khối chữ trên:
    Where did you go? Who did you go with? What did you do?
  ```
- **Lưu ý khi sinh:** gợi ý bằng câu hỏi dẫn trong `Khối chữ trên:`; số dòng hợp với số từ yêu cầu. Không có câu đánh số, không có `## Đáp án`.
- App nhận đúng Q12 từ v123; v124 sửa nhãn trong cây (trước ghi nhầm "Câu hỏi · viết câu", nay "Viết tự do" / "Khung vẽ tự do").

---

## Bài nghe
App **không chứa file audio**. Bài nghe ghi `Track: Track 05`, app in mã QR theo số track. Script nghe là việc của khâu khác (file chung số 3 quy định cách viết script); Task nghe dùng Q bình thường (Q3, Q5, Q7, Q10…).
Cần chốt: khi sinh bài nghe, AI viết luôn script đi kèm (ngoài phiếu) hay script đã có sẵn trong Kiến thức?

## Bài chỉ hiển thị
Không có chỗ trả lời (từ điển tranh, hỏi đáp miệng): `Trả lời: không`.
