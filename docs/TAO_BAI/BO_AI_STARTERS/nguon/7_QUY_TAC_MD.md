# Quy tắc định dạng MD
Phiên bản: 2.0

## Khung kết quả
Trả về đúng ba phần theo thứ tự: các Task, rồi `## Đáp án`, rồi `## Báo cáo`. Không lời chào, không giải thích, không khối ``` bao ngoài.

    ## Task: <tiêu đề: câu lệnh tiếng Anh cho học sinh>
    Task số: <k>
    Mục tiêu: <các mã M mà Task phủ, ví dụ M1, M2>
    Hướng dẫn: <tùy chọn: thêm một câu lệnh tiếng Anh ngắn>
    Dạng: <tên dạng, theo phần Cú pháp theo dạng>
    <các trường riêng của dạng>
    <nội dung>

    ## Task: <Task tiếp theo, cùng khung>
    …

    ## Đáp án
    ### Task <k>
    1. <đáp án câu 1>
    2. <đáp án câu 2>

    ## Báo cáo
    ### Task <k>
    - <nhãn>: <nội dung>

## Quy tắc chung
1. `Task số:`, `Mục tiêu:`, `Hướng dẫn:`, `Dạng:` đặt ngay dưới dòng `## Task:`, theo đúng thứ tự trên.
2. `Task số: k` ghi đúng số Task trong Bố cục. Viết đủ mọi Task, đúng thứ tự Bố cục; không thêm, bỏ, tách hay gộp Task; không viết `### Phần:`.
3. Số câu đúng bằng số Bố cục giao. Câu đánh số `1.`, `2.`, …; không viết câu ví dụ `0.`.
4. Không bắt đầu dòng bằng `a.`, `b.`, `c.` (app hiểu là lựa chọn).
5. Chỗ trống viết `___` (ba gạch dưới). Câu có chỗ trống chỉ có một chỗ trống.
6. Kiểu chữ chỉ khi cần: `**đậm**`, `<u>gạch chân</u>`. Không viết `__từ__`.
7. Không viết dòng kẻ `______`, không viết `Answer:`, không viết nhãn trống. App tự vẽ chỗ trả lời.
8. `Bài đọc:` đứng riêng một dòng; đoạn văn ở các dòng bên dưới; dòng trống giữa hai đoạn. Riêng Task dạng bảng: bài đọc viết trong `Khối chữ trên:` (quy tắc 9 dưới đây), không dùng `Bài đọc:`.
9. `Khối chữ trên:` đứng riêng một dòng; mỗi dòng nội dung bên dưới thụt lề 2 dấu cách; app giữ nguyên xuống dòng.
10. `Hội thoại:` đứng riêng một dòng; mỗi lượt một dòng `Tên: lời`.
11. `## Đáp án` có một khối `### Task k` cho mỗi Task có đáp án ghi ở đây (theo phần Cú pháp theo dạng); mỗi câu một dòng `n. đáp án`.
12. `## Báo cáo` có một khối `### Task k` cho mọi Task; nhãn theo mục Lệnh; mỗi dòng một nhãn, viết ngắn.

## Cú pháp theo dạng
Mỗi dạng: dòng `Dạng:` ghi gì; viết nội dung thế nào; đáp án ghi ở đâu.

- **Q1** · `Dạng: điền từ` · câu có `___`; từ gốc trong ngoặc ngay sau chỗ trống: `___ (swim)` · đáp án ở `## Đáp án`.
- **Q2** · `Dạng: viết câu` · thêm dòng `Dòng viết: 1`; mỗi câu là một yêu cầu ngắn, không có `___` · đáp án ở `## Đáp án`, một câu mẫu.
- **Q3** · `Dạng: chọn A/B/C` · câu có `___`; ngay dưới câu, mỗi lựa chọn một dòng, thụt lề 2 dấu cách: `  A. …` / `  B. …` / `  C. …` · đáp án ở `## Đáp án`, chữ cái A, B hoặc C.
- **Q4** · `Dạng: chọn trong câu` · các vế trong ngoặc nhọn, ngăn bằng dấu gạch đứng, dấu `*` ngay trước vế đúng: `{can|*can't|cans}` · đáp án là dấu `*`; không ghi ở `## Đáp án`.
- **Q5** · `Dạng: đúng/sai` · mỗi câu một khẳng định · đáp án ở `## Đáp án`, `T` hoặc `F`.
- **Q6** · `Dạng: nhìn ảnh viết` · mỗi câu `1. [ảnh: mô tả tiếng Anh]` · đáp án ở `## Đáp án`.
- **Q7** · `Dạng: chọn ảnh` · câu, rồi một dòng thụt lề `A. [ảnh: …] B. [ảnh: …] C. [ảnh: …]` · đáp án ở `## Đáp án`, chữ cái.
- **Q8** · `Dạng: nối` · `1. vế trái - vế phải` (viết cặp đúng); thêm dòng `Xáo vế phải: có` · đáp án là chính các cặp; không ghi ở `## Đáp án`.
- **Q9** · `Dạng: tô chữ` · mỗi dòng một từ hoặc câu · không có đáp án.
- **Q10** · `Dạng: bảng` · dòng đầu là tiêu đề cột; các ô ngăn bằng dấu cách, gạch đứng, dấu cách; ô đầu tiên là góc bảng; mỗi hàng một dòng; hàng mẫu viết đủ chữ; ô học sinh điền viết `=đáp án`; bài đọc (nếu có) đặt trong `Khối chữ trên:` ngay dưới dòng `Dạng:`, mỗi đoạn một dòng thụt lề · đáp án nằm trong ô; không ghi ở `## Đáp án`.
- **Q12** · `Dạng: viết tự do` · không có câu đánh số; `Khối chữ trên:` chứa câu hỏi dẫn; thêm dòng `Dòng viết: N` · không có đáp án.

## Ví dụ khung (nội dung trung tính, không dùng lại)
    ## Task: Look and read. Choose the correct word.
    Task số: 7
    Mục tiêu: M1
    Dạng: chọn A/B/C
    1. May is at the beach. She ___ happy.
      A. is
      B. are
      C. am
    2. Her brothers ___ in the sea.
      A. is
      B. are
      C. am

    ## Task: Read and write.
    Task số: 8
    Mục tiêu: M2
    Dạng: bảng
    Khối chữ trên:
      May has got a red kite. Her brothers have got a blue ball.

    Who | Toy | Colour
    May | kite | red
    her brothers | =ball | =blue

    ## Đáp án
    ### Task 7
    1. A
    2. B

    ## Báo cáo
    ### Task 7
    - Mục tiêu: M1
    ### Task 8
    - Mục tiêu: M2
