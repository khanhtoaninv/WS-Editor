# Cấu trúc file Kiến thức (mẫu)

Một file cho một lesson. AI đọc nguyên văn. Chỉ viết nội dung của lesson này; cách làm bài nằm ở Trình tự, không viết ở đây.

---

```
# Kiến thức
Giáo trình: Our World 3
Unit: 5
Lesson: 2
Chuyên đề: Grammar
Trình tự áp dụng: Grammar 2.0

## 1. Mục tiêu
- M1: So sánh hai người/vật bằng tính từ ngắn (tall → taller than).
- M2: So sánh hai người/vật bằng tính từ dài (beautiful → more beautiful than).
- M3: Nói điều "nhất" trong nhóm bằng the + -est / the most.

## 2. Học sinh
Lớp 4, trình độ A1. Câu ngắn, từ quen thuộc.

## 3. Kiến thức
### 3.1 So sánh hơn: tính từ ngắn
- Cấu trúc: S + be + adj-er + than + O
- Ví dụ: Tom is taller than Ben.
- Quy tắc: thêm -er; đuôi e chỉ thêm r (nice → nicer); phụ âm đơn sau nguyên âm đơn gấp đôi (big → bigger); y → ier (happy → happier).

### 3.2 So sánh hơn: tính từ dài
- Cấu trúc: S + be + more + adj + than + O
- Ví dụ: This bag is more expensive than that bag.

### 3.3 So sánh nhất
- Cấu trúc: S + be + the + adj-est / the most + adj
- Ví dụ: Mai is the tallest girl in my class.

### 3.4 Bất quy tắc
good → better → the best; bad → worse → the worst.

## 4. Từ vựng được dùng
- Tính từ ngắn: tall, short, big, small, old, young, fast, slow, long
- Tính từ dài: beautiful, expensive, interesting, difficult
- Danh từ / bối cảnh quen: family members, animals, school things
- Chỉ dùng từ trong danh sách này và từ cơ bản đã học.

## 5. Ngoài phạm vi
- Không dùng as … as, less … than, so sánh kép.
- Không dùng tính từ ngoài danh sách mục 4.

## 6. Lỗi thường gặp
- Dùng more với tính từ ngắn: *more tall.
- Dùng -er với tính từ dài: *beautifuler.
- Quên than, hoặc quên the ở so sánh nhất.
- Viết sai chính tả khi biến đổi: *biger, *happyer.

## 7. Theo từng B (chỉ ghi B cần dữ liệu riêng của lesson này)
### B1
Mẫu để quan sát: tall → taller → the tallest; beautiful → more beautiful → the most beautiful.
### B5
Tình huống gợi ý: so sánh hai thành viên gia đình; so sánh ba con vật.
### B6
Câu mẫu cho học sinh viết: My bag is bigger than your bag.
```

---

## Quy ước

| Mục | Bắt buộc | Dùng để |
|---|---|---|
| Đầu file (Giáo trình, Unit, Lesson, Chuyên đề, Trình tự áp dụng) | có | app xếp lesson vào cây, tìm đúng Trình tự, cảnh báo nếu phiên bản Trình tự đã đổi |
| 1. Mục tiêu | có | AI biết phiếu phải dạy gì; mã M1, M2… để báo cáo "Task nào phủ mục tiêu nào" |
| 2. Học sinh | có | độ dài câu, độ khó từ |
| 3. Kiến thức | có | nguồn duy nhất cho đúng/sai ngôn ngữ; ví dụ trong này là ví dụ chuẩn |
| 4. Từ vựng được dùng | có | phạm vi từ; app kiểm từ ngoài danh sách |
| 5. Ngoài phạm vi | không | chặn AI "nâng khó" |
| 6. Lỗi thường gặp | nên có | nguồn cho lựa chọn nhiễu và lỗi cần sửa |
| 7. Theo từng B | không | chỉ khi lesson cần dữ liệu riêng cho một B; mã B theo Trình tự |

## Nguyên tắc viết
- Mỗi ý một dòng, câu ngắn, không giải thích dài.
- Ví dụ ghi ngay dưới cấu trúc; chỉ ghi ví dụ đúng. Câu sai ghi ở mục 6 và đánh dấu `*`.
- Không viết cách ra câu hỏi, số câu, mức độ: thuộc Trình tự và Bố cục.
- Không để phần "đề xuất" hoặc "chờ duyệt" trong file gửi đi. Chưa chắc thì chưa viết.
- Nội dung chỉ áp dụng cho lesson này; không chép lại Trình tự.
