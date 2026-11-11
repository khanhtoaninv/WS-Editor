# Cấu trúc file Kiến thức (mẫu)

Mỗi lesson có một file. AI đọc nguyên văn. File chỉ chứa nội dung của lesson này; cách làm bài nằm ở Trình tự.

Phiên bản 2 có các thay đổi sau (ví dụ dưới đây là một lesson cuối Starters) để phiếu nhất quán hơn:
- Có thêm dòng **Kiểu ngữ pháp** (nghĩa hoặc hình thức) ở đầu file.
- Mỗi cấu trúc có thêm ba dòng: **Dùng khi**, **Dấu hiệu bề mặt**, **Câu hỏi lộ đáp án**.
- Có thêm mục **Dạng câu cần phủ**.
- **Từ vựng** là danh sách từ cụ thể; từ vựng nền của cấp độ nằm ở file Cấp độ.
- **Lỗi thường gặp** tách làm hai nhóm.

Nhờ vậy, AI không phải đoán những điểm này, và app kiểm tra được.

---

```
# Kiến thức
Giáo trình: (ví dụ) Giáo trình mẫu
Unit: 3
Lesson: 2
Chuyên đề: Grammar
Cấp độ: Starters (cuối cấp)
Trình tự áp dụng: Grammar 2.2
Kiểu ngữ pháp: nghĩa

## Mục tiêu
- M1: Nói người hoặc con vật làm được gì bằng can (A fish can swim.).
- M2: Nói người hoặc con vật không làm được gì bằng can't (A fish can't walk.).
- M3: Hỏi và trả lời Can …? Yes, … can. / No, … can't.

## Kiến thức
### K1 can
- Cấu trúc: S + can + V (nguyên mẫu)
- Dùng khi: người hoặc con vật làm được việc đó.
- Ví dụ: Birds can fly.
- Quy tắc hình thức: can không đổi theo chủ ngữ; động từ sau can không thêm -s, không có to.
- Dấu hiệu bề mặt: không có
- Câu hỏi lộ đáp án: không có

### K2 can't
- Cấu trúc: S + can't + V (nguyên mẫu)
- Dùng khi: người hoặc con vật không làm được việc đó.
- Ví dụ: Elephants can't fly.
- Dấu hiệu bề mặt: … can …, but … (vế sau but khi vế trước là can)
- Câu hỏi lộ đáp án: không có

### K3 Câu hỏi Can …? và câu trả lời ngắn
- Cấu trúc: Can + S + V? — Yes, S can. / No, S can't.
- Dùng khi: hỏi ai làm được việc gì; câu trả lời theo dữ kiện.
- Ví dụ: Can you swim? Yes, I can.
- Dấu hiệu bề mặt: không có
- Câu hỏi lộ đáp án: Can + S + V? (câu hỏi cho biết câu trả lời dùng can / can't, chỉ chưa biết Yes hay No)

## Dạng câu cần phủ
- Loại câu: khẳng định; phủ định; câu hỏi Yes/No và câu trả lời ngắn.
- Chủ ngữ: I / you / he / she / it / we / they; tên riêng; danh từ con vật số ít và số nhiều.

## Từ vựng được dùng
- Từ trọng tâm: swim, run, jump, fly, sing, draw, ride, kick, catch, throw, read, write, play
- Danh từ gợi ý: fish, bird, frog, duck, monkey, horse, snake, elephant, crocodile, spider, cat, dog; bike, ball, kite, guitar, piano
- Tên nhân vật: Tom, Anna, Sam, Lucy, Ben
- Từ thêm ngoài nền: không có

## Ngoài phạm vi
- can để xin phép hoặc nhờ (Can I …? / Can you help me?).
- could, be able to.
- Câu hỏi Wh- với can (What can you do?).

## Lỗi thường gặp
### Lỗi hình thức
- *She can swims. (thêm -s sau can)
- *He can to swim. (thêm to)
- *She cans swim. (thêm -s cho can)
- *Yes, I can't. / *No, I can. (câu trả lời ngắn không khớp Yes/No)
- *Can you swim? Yes, I do. (dùng do thay can)
### Nhầm cách dùng
- Dùng can khi dữ kiện cho thấy không làm được (*Fish can walk.).
- Dùng can't khi dữ kiện cho thấy làm được.
- Trả lời Yes khi dữ kiện là không, hoặc ngược lại.

## Theo từng B
### B1
- Mẫu để quan sát: I can swim. I can't fly. Can you sing? Yes, I can.
### B5
- Dữ kiện gợi ý: bảng ba bạn, năm hoạt động, ✓ làm được / ✗ không làm được.
### B6
- Chủ đề viết: bạn làm được gì và không làm được gì.
```

---

## Quy ước

| Mục | Bắt buộc | Dùng để |
|---|---|---|
| Đầu file (Giáo trình, Unit, Lesson, Chuyên đề, Cấp độ, Trình tự áp dụng) | có | app xếp lesson vào cây, tìm đúng Trình tự và file Cấp độ, cảnh báo khi phiên bản Trình tự đã đổi |
| Kiểu ngữ pháp | có | `nghĩa`: các hình thức khác nhau về nghĩa (can / can't, has got / hasn't got). `hình thức`: đúng sai chỉ do quy tắc hình thức (a/an, is/are). App chọn tham số theo dòng này |
| Mục tiêu | có | AI biết phiếu dạy gì. Mã M1, M2… để Báo cáo ghi Task nào phủ mục tiêu nào |
| Học sinh | không | chỉ ghi khi lớp này khác mô tả Học sinh của file Cấp độ |
| Kiến thức (K1, K2…) | có | nguồn duy nhất về đúng/sai ngôn ngữ. Ví dụ trong mục này là ví dụ chuẩn |
| ↳ Dùng khi | có | nguồn cho lựa chọn "sai vì nghĩa" và cho câu xác định bằng nghĩa |
| ↳ Dấu hiệu bề mặt | có | danh sách đóng. AI chỉ tính các dấu hiệu ghi ở đây; app tìm chúng trong câu để kiểm tra câu xác định bằng nghĩa |
| ↳ Câu hỏi lộ đáp án | có, ghi "không có" nếu không có | AI nhận ra và đếm câu lộ; app kiểm tỷ lệ |
| Dạng câu cần phủ | có | B3, B4 phải phủ đủ các dạng này; AI báo cáo dạng đã phủ |
| Từ vựng được dùng | có | Từ trọng tâm: phiếu phải dùng. Danh từ gợi ý, Tên nhân vật: AI ưu tiên dùng. Từ thêm ngoài nền: từ của lesson không có trong Từ vựng nền của Cấp độ; app cho phép. Mọi từ khác phải có trong Từ vựng nền |
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
