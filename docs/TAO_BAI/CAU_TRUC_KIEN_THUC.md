# Cấu trúc file Kiến thức (mẫu)

Mỗi lesson có một file. AI đọc nguyên văn. File chỉ chứa nội dung của lesson này; cách làm bài nằm ở Trình tự.

Phiên bản 2 có các thay đổi sau để phiếu nhất quán hơn:
- Có thêm dòng **Kiểu ngữ pháp** (nghĩa hoặc hình thức) ở đầu file.
- Mỗi cấu trúc có thêm ba dòng: **Dùng khi**, **Dấu hiệu bề mặt**, **Câu hỏi lộ đáp án**.
- Có thêm mục **Dạng câu cần phủ**.
- **Từ vựng** là danh sách từ cụ thể.
- **Lỗi thường gặp** tách làm hai nhóm.

Nhờ vậy, AI không phải đoán những điểm này, và app kiểm tra được.

---

```
# Kiến thức
Giáo trình: Our World 3
Unit: 5
Lesson: 2
Chuyên đề: Grammar
Trình tự áp dụng: Grammar 2.1
Kiểu ngữ pháp: nghĩa

## Mục tiêu
- M1: So sánh hai người/vật bằng tính từ ngắn (tall → taller than).
- M2: So sánh hai người/vật bằng tính từ dài (beautiful → more beautiful than).
- M3: Nói người/vật "nhất" trong một nhóm từ ba trở lên (the tallest, the most beautiful).

## Học sinh
Lớp 4, trình độ A1. Câu ngắn, từ quen thuộc.

## Kiến thức
### K1 So sánh hơn: tính từ ngắn
- Cấu trúc: S + be + adj-er + than + O
- Dùng khi: so sánh đúng hai người hoặc hai vật.
- Ví dụ: Tom is taller than Ben.
- Quy tắc hình thức: thêm -er; đuôi e chỉ thêm r (nice → nicer); phụ âm đơn sau nguyên âm đơn thì gấp đôi (big → bigger); y → ier (happy → happier).
- Dấu hiệu bề mặt: than
- Câu hỏi lộ đáp án: Who is taller, Tom or Ben? / Which is bigger, A or B?

### K2 So sánh hơn: tính từ dài
- Cấu trúc: S + be + more + adj + than + O
- Dùng khi: như K1, với tính từ dài.
- Ví dụ: This bag is more expensive than that bag.
- Dấu hiệu bề mặt: than
- Câu hỏi lộ đáp án: Which is more expensive, A or B?

### K3 So sánh nhất
- Cấu trúc: S + be + the + adj-est / the most + adj (+ in/of + nhóm)
- Dùng khi: so một người hoặc vật với cả nhóm từ ba trở lên.
- Ví dụ: Mai is the tallest girl in my class.
- Dấu hiệu bề mặt: the … in my class / of the three / in the family
- Câu hỏi lộ đáp án: Who is the tallest in your family?

### K4 Bất quy tắc
- good → better → the best; bad → worse → the worst.

## Dạng câu cần phủ
- Loại câu: khẳng định; câu hỏi Who/Which (chỉ ở dạng nhận biết, không bắt học sinh tự đặt câu hỏi).
- Chủ ngữ: tên riêng; he / she / it; danh từ số ít (my cat); danh từ số nhiều (elephants).

## Từ vựng được dùng
- Tính từ (danh sách đóng): tall, short, big, small, old, young, fast, slow, long, good, bad, beautiful, expensive, interesting, difficult
- Danh từ (danh sách mở): mother, father, brother, sister, grandma, grandpa, cat, dog, mouse, horse, elephant, giraffe, bag, book, pencil, ruler, box, house
- Tên nhân vật: Tom, Ben, Mai, Lan, Nam
- Từ chức năng (is, are, the, my, and…) và từ cơ bản lớp dưới dùng tự do.

## Ngoài phạm vi
- as … as, less … than, so sánh kép (bigger and bigger).
- Học sinh tự đặt câu hỏi so sánh.

## Lỗi thường gặp
### Lỗi hình thức
- *more tall (more với tính từ ngắn)
- *beautifuler (-er với tính từ dài)
- *taller as / *taller that (sai từ thay cho than)
- *biger, *happyer (chính tả khi biến đổi)
- *the most tallest (dùng hai lần)
### Nhầm cách dùng
- Dùng so sánh nhất khi chỉ có hai người/vật (*Tom is the tallest of the two).
- Dùng so sánh hơn khi so với cả nhóm (*Mai is taller in my class).
- Chọn sai tính từ trái nghĩa so với dữ kiện (dữ kiện: Tom 1m40, Ben 1m30 → *Tom is shorter than Ben).

## Theo từng B
### B1
- Mẫu để quan sát: tall → taller → the tallest; beautiful → more beautiful → the most beautiful.
### B5
- Dữ kiện gợi ý: chiều cao ba thành viên gia đình; tốc độ ba con vật.
### B6
- Chủ đề viết: so sánh mình với một người trong gia đình.
```

---

## Quy ước

| Mục | Bắt buộc | Dùng để |
|---|---|---|
| Đầu file (Giáo trình, Unit, Lesson, Chuyên đề, Trình tự áp dụng) | có | app xếp lesson vào cây, tìm đúng Trình tự, cảnh báo khi phiên bản Trình tự đã đổi |
| Kiểu ngữ pháp | có | `nghĩa`: các hình thức khác nhau về nghĩa (so sánh hơn / nhất, hai thì). `hình thức`: đúng sai chỉ do quy tắc hình thức (a/an, is/are). App chọn tham số theo dòng này |
| Mục tiêu | có | AI biết phiếu dạy gì. Mã M1, M2… để Báo cáo ghi Task nào phủ mục tiêu nào |
| Học sinh | có | độ dài câu, độ khó từ |
| Kiến thức (K1, K2…) | có | nguồn duy nhất về đúng/sai ngôn ngữ. Ví dụ trong mục này là ví dụ chuẩn |
| ↳ Dùng khi | có | nguồn cho lựa chọn "sai vì nghĩa" và cho câu xác định bằng nghĩa |
| ↳ Dấu hiệu bề mặt | có | danh sách đóng. AI chỉ tính các dấu hiệu ghi ở đây; app tìm chúng trong câu để kiểm tra câu xác định bằng nghĩa |
| ↳ Câu hỏi lộ đáp án | có, ghi "không có" nếu không có | AI nhận ra và đếm câu lộ; app kiểm tỷ lệ |
| Dạng câu cần phủ | có | B3, B4 phải phủ đủ các dạng này; AI báo cáo dạng đã phủ |
| Từ vựng được dùng | có | danh sách **đóng** thì app chặn từ ngoài danh sách; danh sách **mở** thì app chỉ cảnh báo |
| Ngoài phạm vi | không | chặn AI "nâng khó" |
| Lỗi thường gặp: Lỗi hình thức | có | nguồn cho lựa chọn "sai vì hình thức" |
| Lỗi thường gặp: Nhầm cách dùng | có | nguồn cho lựa chọn "sai vì nghĩa". Kiểu hình thức thì ghi "không có" |
| Theo từng B | không | chỉ ghi khi lesson cần dữ liệu riêng cho một B; dùng mã B theo Trình tự |

## Nguyên tắc viết
- **Tiêu đề mục không đánh số** (`## Mục tiêu`), vì bộ đọc của app tìm tiêu đề theo tên.
- Cấu trúc đánh mã K1, K2… để Báo cáo và Rà soát truy đáp án về đúng cấu trúc.
- Mỗi ý một dòng, câu ngắn, không giải thích dài.
- Ví dụ chỉ ghi câu đúng. Câu sai ghi ở Lỗi thường gặp, đánh dấu `*`.
- **Dấu hiệu bề mặt** ghi đúng chữ xuất hiện trong câu, dùng `…` cho chỗ thay đổi. Không có thì ghi "không có".
- **Kiểu hình thức**: dòng Dùng khi ghi điều kiện hình thức (an: trước từ bắt đầu bằng âm nguyên âm); Dấu hiệu bề mặt và Câu hỏi lộ đáp án ghi "không có"; Lỗi hình thức ghi ít nhất hai lỗi khác nhau.
- Không chắc là kiểu nào thì hỏi: đổi hình thức có làm đổi nghĩa câu không? Có thì là kiểu nghĩa.
- Không viết cách ra câu hỏi, số câu hay mức độ. Những thứ đó thuộc Trình tự và Bố cục.
- Không để phần "đề xuất" hoặc "chờ duyệt" trong file gửi đi. Chưa chắc thì chưa viết.
