# Cấu trúc file Rà soát (mẫu)

Rà soát là **lượt AI thứ hai**, chạy sau khi phiếu được sinh. Một file dùng chung cho mọi chuyên đề. App ghép các phần sau rồi gửi cho AI:
- lệnh trong file này;
- các tiêu chí lấy từ Trình tự và Cách thức;
- Kiến thức, Bố cục;
- phiếu vừa sinh, **đã bỏ đáp án**.

AI trả về danh sách lỗi theo từng câu. App gửi lại đúng các Task có lỗi kèm danh sách đó, tối đa 2 lần.

Lượt này khác việc "AI tự soát" (điều G11). Ở lượt này AI không biết đáp án và phải **tự làm bài như học sinh**. Câu mà AI giải ra hai đáp án, hoặc giải ra khác đáp án của phiếu, chính là câu có vấn đề.

---

```
# Rà soát
Phiên bản: 1.0

## Vai trò
Bạn là người duyệt phiếu, không phải người viết. Không viết lại phiếu. Chỉ chỉ ra lỗi, mỗi lỗi một dòng, gọi đúng mã quy tắc.

## Bước 1: Làm bài như học sinh
Với mỗi câu có đáp án, ghi đáp án bạn chọn. Câu có hai đáp án hợp lý thì ghi cả hai.

## Bước 2: Làm bài như học sinh không hiểu nghĩa
Với mỗi câu thuộc B2, B3, B4 (chỉ Kiểu nghĩa): chỉ nhìn dấu hiệu bề mặt (danh sách ở Kiến thức) và dạng câu hỏi, không đọc nghĩa tình huống. Câu nào vẫn chọn đúng thì ghi "đoán được".

## Bước 3: Đối chiếu tiêu chí
Với mỗi Task, xét lần lượt:
- Tiêu chí kiểm định của B (app chèn).
- Quy tắc toàn phiếu áp cho B (app chèn số và lời).
- Các điều của Cách thức đặt câu hỏi áp cho Dạng Q (app chèn số và lời).
- Câu mẫu Không đạt của B + Dạng Q (app chèn): câu nào mắc cùng lỗi?

## Trả về
Chỉ trả về đúng khung sau, không lời chào:

    ## Rà soát
    ### Task <k>
    - Đáp án tự làm: 1 B; 2 C; 3 A hoặc B; …
    - Đoán được không cần hiểu nghĩa: 2, 4
    - Lỗi:
      - Câu <n>: [<mã>] <một câu nêu lỗi>
    - Kết luận: Đạt | Sửa

Mã lỗi: `QT<số>` (quy tắc toàn phiếu của Trình tự; không nhầm với Dạng Q), `G<số>` (Cách thức, số hiệu gốc), `R` (ràng buộc của Dạng Q), `M` (giống câu mẫu Không đạt), `K` (sai so với Kiến thức).
Task không có lỗi thì ghi `- Lỗi: không có.`
Không bịa lỗi để có cái mà báo. Không chắc thì không ghi.
```

---

## App làm gì với kết quả

**App so đáp án và kết luận**
- App so "Đáp án tự làm" với `## Đáp án` của phiếu.
- Một câu có hai đáp án, hoặc đáp án lệch với phiếu, thì app tự thêm lỗi `[QT1]` (câu trần) hoặc `[K]`.
- Task có kết luận "Sửa", hoặc app thêm lỗi cho Task đó, thì Task đó phải sinh lại.

**App kiểm câu xác định bằng nghĩa**
- App lấy danh sách "Đoán được" và so với các câu mà Báo cáo ghi là xác định bằng nghĩa.
- Câu Báo cáo nói là xác định bằng nghĩa mà lại đoán được thì là lỗi `[QT2]`.

**App sinh lại Task lỗi**
- App gửi lại cho AI viết: Trình tự sinh của Task đó, Task cũ và danh sách lỗi. Lệnh kèm theo: "Sửa đúng các lỗi này, giữ nguyên câu không có lỗi."
- Tối đa 2 lần. Sau 2 lần vẫn lỗi thì app giữ bản cuối và hiện lỗi cho giáo viên.

## Việc app tự kiểm (không cần AI)

Chạy trước lượt Rà soát. Task sai ở bước này thì sinh lại ngay, không cần qua Rà soát.

| Kiểm | Theo |
|---|---|
| đủ Task, đúng `Bố cục: Task k`, đúng Dạng Q, đúng số câu | Bố cục |
| câu chọn đúng ba lựa chọn; mỗi lựa chọn đứng ở một dòng riêng | Trình tự quy tắc 5; Cách thức điều 9 |
| vị trí đáp án đúng rải đều (không quá 2 câu liền cùng chữ cái; mỗi chữ cái có ít nhất một lần khi Task có từ 3 câu) | Cách thức điều 19 |
| độ dài lựa chọn: dài nhất không quá 2 lần ngắn nhất | Cách thức điều 23 |
| không có từ tuyệt đối trong lựa chọn (always, never, completely, absolutely); không có None/All of the above | Cách thức điều 24, 25, 27a |
| độ dài phần đề không vượt mức của Mức độ (đếm như định nghĩa ở Trình tự) | Trình tự, mục Mức độ |
| câu ở vị trí bắt buộc không chứa dấu hiệu bề mặt nào; **chỉ dò phần đề**, không dò lựa chọn và đáp án; `…` trong dấu hiệu khớp tối đa 4 từ | Trình tự quy tắc 2; Kiến thức, dòng Dấu hiệu bề mặt |
| Kiểu hình thức: câu ở vị trí bắt buộc và câu liền trước không chứa hình thức nào của mục tiêu ngoài chỗ trống | Trình tự quy tắc 2b |
| không quá 2 câu trong một Task mở đầu bằng cùng 2 từ | Trình tự quy tắc 13 |
| không có từ ngoài danh sách đóng (chặn); ngoài danh sách mở (cảnh báo) | Trình tự quy tắc 9; Kiến thức |
| Báo cáo có đủ các nhãn mà Lệnh yêu cầu | Trình tự sinh, mục Lệnh |

## Nguyên tắc viết
- File này không chứa tiêu chí riêng của chuyên đề. Tiêu chí riêng lấy từ Trình tự, app chèn khi ghép.
- Rà soát dùng **phiếu đã bỏ đáp án** và **không dùng Báo cáo** của lượt sinh, để AI không bị dẫn theo.
- Việc máy kiểm được thì để app kiểm, không giao cho AI.
- Chạy thử thật sẽ cho biết Rà soát có báo lỗi khống quá nhiều không. Nếu có, siết dòng "Không chắc thì không ghi" hoặc chỉ giữ Bước 1 và Bước 2.
