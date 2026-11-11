# Cấu trúc file Quy tắc định dạng MD (mẫu)

Một file dùng chung cho mọi chuyên đề. Nói **viết ra thế nào để app đọc được**: khung của phiếu, khung của một Task, mục Báo cáo, cú pháp từng Dạng Q. Không nói nên dùng Dạng Q nào (Trình tự), không mô tả Dạng Q là gì (Mô tả Dạng Q), không có nội dung lesson.

---

```
# Quy tắc định dạng MD
Phiên bản: 1.1

## 1. Khung phiếu
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
    (mục 3)

## 2. Quy tắc chung
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

## 3. Mục Báo cáo
Đặt sau Task cuối cùng. App tách mục này ra, không đưa lên phiếu.

    ## Báo cáo
    ### Task <k>
    - <nhãn>: <nội dung>

- Mỗi Task một khối `### Task k`, k theo `Bố cục: Task k`.
- Nhãn và nội dung do mục Lệnh của Trình tự sinh yêu cầu (ví dụ vị trí các câu xác định bằng nghĩa, lựa chọn sai của từng câu, mục tiêu được phủ).
- Mỗi dòng một nhãn, viết ngắn. Không có nhãn nào được yêu cầu thì ghi `- Không có.`

## 4. Cú pháp theo Dạng Q
| Dạng Q | Viết | Đáp án |
|---|---|---|
| Q1 Điền từ | `___` trong câu; `Khung từ:` nếu có; tùy chọn `(ô chữ cái)` | `## Đáp án` |
| Q2 Viết câu | `Dòng viết: N`; câu không có `___` ở cuối; sắp xếp từ: các từ cách nhau ` / `, mỗi câu một số; tùy chọn `(bốn ô li)` | `## Đáp án`, một câu mẫu |
| Q3 Chọn A/B/C | mỗi lựa chọn một dòng thụt lề 2 dấu cách ngay dưới câu: `A. …`, `B. …`, `C. …` (viết chữ hoa; app in thành a. b. c.); không viết cùng dòng; tùy chọn `(khoanh)`, `(ô tick)` | `## Đáp án`, chữ cái hoa |
| Q4 Chọn trong câu | `{a\|b\|c}` trong câu, `*` trước vế đúng | dấu `*` trong câu |
| Q5 Đúng / Sai | `Dạng Q: đúng/sai`, tùy chọn `(Yes/No)`, `(T/F/NG)`, `(cùng hàng)` | `## Đáp án`: `T`/`F` hoặc đúng nhãn đã chọn |
| Q6 Nhìn ảnh viết | mỗi câu `1. [ảnh: …]`; tùy chọn `(ô chữ cái)` | `## Đáp án` |
| Q7 Chọn ảnh | câu hỏi rồi dòng thụt lề `A. [ảnh: …] B. [ảnh: …] C. [ảnh: …]` | `## Đáp án`, chữ cái |
| Q8 Nối | `1. vế trái - vế phải` (cặp đúng cạnh nhau) và `Xáo vế phải: có`; vế thừa `n. - vế phải`; tùy chọn `Tiêu đề cột: A \| B` | chính các cặp |
| Q9 Tô chữ | mỗi dòng một từ hoặc câu để tô | không có |
| Q10 Bảng | dòng đầu là tiêu đề cột, ô cách nhau ` \| `; ô cần điền ghi `=đáp án`; `[ ]` ô tick, `[ảnh: x]` ô ảnh; mỗi hàng một dòng; xuống dòng trong ô dùng `<br>` | `=đáp án` trong ô |
| Q11 Lưới | không sinh tự động | không áp dụng |
| Q12 Viết tự do | không có câu đánh số; `Dòng viết: N` (N = số được giao); câu hỏi dẫn trong `Khối chữ trên:` (dòng thụt lề 2 dấu cách); vẽ: `Dạng Q: viết tự do (khung vẽ)` | không có |

## 5. Ví dụ (nội dung trung tính, không lấy từ lesson nào)
    ## Task: Complete the sentences.
    Bố cục: Task 4
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
```

---

## Quy ước

| Phần | Vai trò | Ai dùng |
|---|---|---|
| 1. Khung phiếu | hình dạng đầu ra | AI viết, app tách theo `## Task:` |
| 2. Quy tắc chung | luật cú pháp áp mọi Task | AI; app kiểm sau khi sinh |
| 3. Mục Báo cáo | AI ghi chú cho giáo viên, app tách ra | AI, app |
| 4. Cú pháp theo Dạng Q | một dòng cho mỗi Dạng Q | AI (app chỉ gửi dòng của Dạng Q có trong Bố cục) |
| 5. Ví dụ | một ví dụ, trung tính | AI |

## Nguyên tắc viết
- Chỉ nói cú pháp. Ràng buộc nội dung của Dạng Q ở Mô tả Dạng Q; ràng buộc theo chuyên đề ở Trình tự.
- Mỗi quy tắc một lần, ngắn, kiểm được bằng máy.
- Ví dụ dùng chủ đề trung tính, không lấy từ lesson hay chuyên đề nào, để AI không chép vào phiếu.
- Đổi cú pháp mà app đọc được (dòng `Dạng Q:`, `Bố cục:`, `## Báo cáo`) thì tăng Phiên bản và phải sửa bộ đọc của app.
