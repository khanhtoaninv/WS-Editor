# Cấu trúc file Câu mẫu (mẫu)

Mỗi Trình tự có một file Câu mẫu, dùng chung cho mọi lesson của chuyên đề. Với mỗi cặp B + Dạng Q, file chỉ cho AI thấy hai thứ:
- một câu **đạt** chuẩn trông ra sao;
- một câu **không đạt** sai ở đâu.

Câu mẫu là cách mạnh nhất để các lần sinh ra kết quả giống nhau. Lời mô tả chỉ nói câu phải thế nào, còn câu mẫu cho AI thấy thật.

App chỉ gửi những khối B + Dạng Q có trong Bố cục.

Ngữ pháp minh họa phải **khác** lesson đang sinh. File mẫu dưới đây dùng thì hiện tại đơn và hiện tại tiếp diễn. Khi sinh lesson về đúng hai thì này, app dùng bộ câu mẫu thứ hai (ghi ở Quy ước).

---

```
# Câu mẫu
Trình tự: Grammar 2.1
Phiên bản: 1.0

Các câu dưới đây chỉ để minh họa cách làm. Không chép chữ, tình huống hay tên nhân vật của chúng vào phiếu. Tên nhân vật của câu mẫu không trùng tên trong Kiến thức.
Dòng bắt đầu bằng → là lời giải thích, không phải nội dung phiếu.

## Kiến thức minh họa
- K1 Hiện tại đơn. Dùng khi: thói quen, việc lặp lại. Dấu hiệu bề mặt: every day, every + thời gian, on + thứ, usually, always.
- K2 Hiện tại tiếp diễn. Dùng khi: việc đang xảy ra lúc nói. Dấu hiệu bề mặt: now, right now, at the moment, Look!, Listen!
- Câu hỏi lộ đáp án: What do you do on Sundays? / What are you doing?
- Lỗi hình thức: thiếu -s (*she walk); thiếu be (*she reading); thiếu -ing (*is read).
- Nhầm cách dùng: dùng tiếp diễn cho thói quen; dùng hiện tại đơn cho việc đang xảy ra.

## B1 · Q10 Bảng · Vừa
### Đạt
    Bài đọc:
    It is Sunday. Lily usually plays badminton on Sundays, but today she is helping Mum. Minh is reading a book, and he reads every evening. Dad cooks lunch on Sundays, and now he is cooking pho.

    Who | Now | Usually
    Lily | is helping Mum | plays badminton
    Minh | =is reading a book | =reads every evening
    Dad | =is cooking pho | =cooks lunch on Sundays
→ Hàng đầu điền sẵn làm mẫu. Mỗi ô cần điền có thật trong văn bản. "It is Sunday" là hình thức gần giống nhưng không thuộc bảng (tham số Vừa).
### Không đạt
    Minh | =is going to read | =reads every evening
→ "is going to read" không có trong văn bản và nằm ngoài mục tiêu (Q10 ràng buộc; quy tắc 9).

## B2 · Q3 Chọn A/B/C · Vừa
### Đạt: câu xác định bằng nghĩa
    1. Please be quiet. The baby ___.
      A. sleeps
      B. is sleeping
      C. is sleep
→ Đáp án B. A sai vì nghĩa (thói quen, trong khi tình huống là đang xảy ra). C sai vì hình thức (thiếu -ing). Câu không có dấu hiệu bề mặt; học sinh phải hiểu "be quiet".
### Đạt: câu có dấu hiệu
    2. Jack ___ football every Saturday.
      A. is playing
      B. play
      C. plays
→ Đáp án C. Dấu hiệu "every Saturday". A sai vì nghĩa, B sai vì hình thức.
### Không đạt
    3. Look! The children ___ in the park.
      A. are playing
      B. plays
      C. are play
→ B sai cả nghĩa lẫn hình thức (children plays). Lựa chọn sai vì nghĩa phải đúng hình thức: "play" (quy tắc 5).

## B3 · Q4 Chọn trong câu · Vừa
### Đạt: câu xác định bằng nghĩa
    1. Shh! Dad {talks|*is talking|is talk} on the phone.
→ "Shh!" không nằm trong danh sách dấu hiệu, nên câu vẫn là câu xác định bằng nghĩa. Ba vế: đúng / sai vì nghĩa / sai vì hình thức.
### Đạt: câu có dấu hiệu
    2. My sister {*walks|is walking|walk} to school every day.
### Không đạt
    3. Minh is reading a comic.
    4. Look! His sister {*is reading|reads|is read} too.
→ Câu 3 liền trước chứa đúng hình thức đáp án của câu 4 (quy tắc 4). Học sinh chỉ cần chép.

## B4 · Q1 Điền từ · Vừa
### Đạt: câu xác định bằng nghĩa
    1. Please be quiet. Grandpa ___ (sleep).
### Đạt: câu có dấu hiệu
    2. He ___ (go) swimming on Sundays.

    ## Đáp án
    ### Task 1
    1. is sleeping
    2. goes
→ Chỗ trống gồm cả từ đi kèm "is" (tham số Vừa).
### Không đạt
    3. Lily ___ (draw) a picture.
→ Câu trần: "draws" và "is drawing" đều đúng (quy tắc 1; Q1 ràng buộc "không có câu mà hai từ cùng đúng").

## B5 · Q2 Viết câu · Vừa
### Đạt
    Bài đọc:
    Lily: every Sunday – ride a bike; now – read a book
    Minh: every Sunday – swim; now – help Dad

    1. Lily / now
    2. Minh / every Sunday

    ## Đáp án
    ### Task 1
    1. Lily is reading a book now.
    2. Minh swims every Sunday.
→ Yêu cầu cho sẵn đối tượng; học sinh tự chọn hoạt động và hình thức theo dữ kiện (tham số Vừa).
### Không đạt
    1. Lily ___ a book now. (read)
→ Đây là bài điền từ của B4, không phải xử lý dữ kiện để tạo câu (Tiêu chí kiểm định B5).

## B6 · Q12 Viết tự do · Vừa
### Đạt
    Khối chữ trên:
      What do you do every Sunday? What are you doing now?
      Example: Every Sunday, I play with my cat. Now, I am doing my homework.
    Dòng viết: 4
→ Mỗi K một câu ví dụ, không viết sẵn đủ 4 câu. Báo cáo ghi hướng chấm: K1 có ít nhất một câu thói quen đúng dạng; K2 có ít nhất một câu đang xảy ra đúng dạng.
### Không đạt
    Example: Every Sunday, I play with my cat. I watch TV. Now, I am doing my homework. My mum is cooking.
→ Viết sẵn đủ 4 câu, học sinh chỉ chép lại (Vai trò B6: tự chọn thông tin).
```

---

## Quy ước

| Phần | Vai trò | Ai dùng |
|---|---|---|
| Đầu file: Trình tự, Phiên bản | app ghép đúng bộ câu mẫu với Trình tự | app |
| Kiến thức minh họa | để AI hiểu vì sao câu mẫu đạt hoặc không đạt; không phải Kiến thức của lesson | AI |
| Khối `## B · Dạng Q · mức` | ví dụ cụ thể cho từng cặp B + Dạng Q | app chỉ gửi khối có trong Bố cục |
| Đạt / Không đạt | mỗi khối ít nhất một câu Đạt và một câu Không đạt. Ở B2, B3, B4 có cả câu xác định bằng nghĩa lẫn câu có dấu hiệu | AI, Rà soát |
| Dòng → | giải thích, dẫn số quy tắc hoặc tên ràng buộc | AI, Rà soát |

Bộ câu mẫu thứ hai: mỗi Trình tự nên có hai bộ dùng hai điểm ngữ pháp khác nhau. Lesson trùng điểm ngữ pháp với bộ thứ nhất thì app gửi bộ thứ hai. Giáo viên ghi tên điểm ngữ pháp ở dòng Kiến thức minh họa để app so sánh.

## Nguyên tắc viết
- Câu mẫu viết đúng cú pháp của Quy tắc định dạng MD, thụt lề 4 dấu cách. AI vừa thấy nội dung vừa thấy cách viết.
- Mỗi câu Không đạt **chỉ sai một lỗi**, và dòng → gọi đúng tên lỗi.
- Ưu tiên lỗi AI hay mắc thật. Sau mỗi lần thử thật, gặp lỗi mới thì thêm vào đây.
- Hiện chỉ có mẫu mức Vừa và Dạng Q mặc định. Mẫu cho Dễ, Khó và Dạng Q phụ (Q7, B2 Q4, B3 Q3, B5 Q10) thêm sau khi thử thật.
- Câu mẫu do giáo viên duyệt. Tôi (Claude) viết bản đầu; giáo viên kiểm từng câu trước khi dùng.
