# Bảng duyệt GĐ0: máy đọc đáp án của bạn thế nào

> Sinh tự động bởi `tests/gd0/bang_duyet.mjs` (2026-10-27). Bạn chỉ cần dò cột **Đáp án máy đọc được**: có đúng đáp án bạn đã nhập trong WS Editor không, và cột **Chấm** (máy / tay) có hợp lý không.
> "Chấm tay" ở đây phần lớn là do **phiếu chưa nhập đáp án**, không phải lỗi. Nhập đáp án trong WS Editor là chỗ đó tự thành chấm máy.
> Nhiều đáp án đúng cho một chỗ viết: ghi cách nhau ` / ` (có dấu cách hai bên), ví dụ `isn't / is not`.

## 1. Tổng hợp 25 phiếu (24 phiếu đường chuẩn + phiếu mẫu GĐ0)

| Phiếu | Số chỗ trả lời | Chấm máy | Chấm tay | Cảnh báo |
|---|---:|---:|---:|---:|
| demo | 110 | 0 | 110 | 17 |
| samples/ws-demo-day-du.json | 149 | 29 | 120 | 24 |
| samples/ws-sample.json | 110 | 0 | 110 | 17 |
| samples/ws-sea-sample.json | 6 | 0 | 6 | 4 |
| tests/gd0/mau-du-dang.md | 34 | 33 | 1 | 0 |
| tests/md/birthday6-dang.md | 20 | 0 | 20 | 8 |
| tests/md/birthday6.md | 20 | 0 | 20 | 8 |
| tests/md/birthday.md | 19 | 0 | 19 | 7 |
| tests/md/mau-tron.md | 16 | 16 | 0 | 0 |
| tests/md/nghe-bang.md | 14 | 4 | 10 | 4 |
| tests/md/phieu11.md | 8 | 0 | 8 | 1 |
| tests/md/phieu14.md | 20 | 0 | 20 | 6 |
| tests/md/phieu7-bai-doc-co-cho-trong.md | 24 | 0 | 24 | 4 |
| tests/md/phieu7.md | 24 | 0 | 24 | 4 |
| tests/md/phieu9.md | 28 | 0 | 28 | 6 |
| tests/md/sea.md | 3 | 0 | 3 | 2 |
| tests/md/v81-cu-phap.md | 12 | 4 | 8 | 5 |
| tests/real/birthday-prompt68.md | 20 | 0 | 20 | 8 |
| tests/real/birthday-user2.md | 20 | 0 | 20 | 8 |
| tests/real/birthday-user.md | 19 | 0 | 19 | 6 |
| tests/real/dieu-chinh-v80.md | 8 | 0 | 8 | 4 |
| tests/real/nhieu-dong-user.md | 7 | 0 | 7 | 2 |
| tests/real/phieu7-ai-v99.md | 25 | 0 | 25 | 4 |
| tests/real/sunny-farm-prompt68.md | 17 | 0 | 17 | 9 |
| tests/ws-sea-sample.json | 6 | 0 | 6 | 4 |
| **Tổng** | **739** | **86** | **653** | |

## 2. Chi tiết các phiếu mẫu

### GĐ0 · Phiếu mẫu đủ dạng có đáp án (`tests/gd0/mau-du-dang.md`)

| Task | Câu | Dạng | Cách làm | Phương án (đề) | Đáp án máy đọc được | Chấm |
|---|---|---|---|---|---|---|
| 1 | 1.1 | Q1 | gõ chữ |  | went | máy |
| 1 | 1.2 | Q1 | gõ chữ |  | played | máy |
| 1 | 2 | Q1 | gõ chữ |  | doesn't / does not | máy |
| 1 | 3 | Q1 | gõ chữ |  | one | máy |
| 2 | (1) | Q1 | gõ chữ |  | were | máy |
| 2 | (2) | Q1 | gõ chữ |  | do | máy |
| 3 | (1) | Q2 | gõ chữ |  | has | máy |
| 3 | (2) | Q2 | gõ chữ |  | drinks | máy |
| 3 | 1 | Q2 | gõ câu / đoạn |  | Tom | máy |
| 4 | 1 | Q3 | chọn một | a. am · b. is · c. are | b. is | máy |
| 4 | 2 | Q3 | chọn nhiều | a. apple · b. chair · c. banana | a. apple + c. banana | máy |
| 5 | 1.1 | Q4 | chọn một | a. goes · b. go | a. goes | máy |
| 5 | 1.2 | Q4 | chọn một | a. play · b. plays | b. plays | máy |
| 5 | 2 | Q4 | chọn một | a. am · b. is · c. are | a. am | máy |
| 6 | 1 | Q4 | chọn một | a. go · b. school · c. day · d. bus | a. go | máy |
| 7 | 1 | Q5 | chọn Đúng/Sai | True · False | True | máy |
| 7 | 2 | Q5 | chọn Đúng/Sai | True · False | False | máy |
| 8 | 1 | Q6 | gõ chữ |  | cat | máy |
| 8 | 2 | Q6 | gõ chữ |  | ice cream / ice-cream | máy |
| 9 | 1 | Q7 | chọn một | a. [ảnh: pizza] · b. [ảnh: rice] · c. [ảnh: cake] | a. [ảnh: pizza] | máy |
| 10 | 1 | Q8 | nối | q1. cold · q2. small · q3. slow · q4. happy | q1. cold | máy |
| 10 | 2 | Q8 | nối | q1. cold · q2. small · q3. slow · q4. happy | q2. small | máy |
| 10 | 3 | Q8 | nối | q1. cold · q2. small · q3. slow · q4. happy | q3. slow | máy |
| 11 | hàng 1 cột 2 | Q10 | gõ vào ô |  | swimming | máy |
| 11 | hàng 2 cột 1 | Q10 | gõ vào ô |  | 10 | máy |
| 11 | hàng 2 cột 2 | Q10 | gõ vào ô |  | reading / books | máy |
| 12 | hàng 1 | Q10 | chọn nhiều | 0. Farm · 1. Zoo | 0. Farm | máy |
| 12 | hàng 2 | Q10 | chọn nhiều | 0. Farm · 1. Zoo | 1. Zoo | máy |
| 13 | ô 1-1 | Q11 | gõ vào ô |  | C | máy |
| 13 | ô 1-2 | Q11 | gõ vào ô |  | A | máy |
| 13 | ô 1-3 | Q11 | gõ vào ô |  | T | máy |
| 13 | ô 2-3 | Q11 | gõ vào ô |  | O | máy |
| 13 | ô 3-3 | Q11 | gõ vào ô |  | P | máy |
| 14 | 1 | Q12 | gõ câu / đoạn |  | — | **tay** |

### Unit 3 · My home – ôn tập (`tests/md/mau-tron.md`)

| Task | Câu | Dạng | Cách làm | Phương án (đề) | Đáp án máy đọc được | Chấm |
|---|---|---|---|---|---|---|
| 1 | 1 | Q6 | gõ chữ |  | cat | máy |
| 1 | 2 | Q6 | gõ chữ |  | dog | máy |
| 1 | 3 | Q6 | gõ chữ |  | fish | máy |
| 1 | 4 | Q6 | gõ chữ |  | bird | máy |
| 2 | 1 | Q3 | chọn một | a. am · b. is · c. are | b. is | máy |
| 2 | 2 | Q3 | chọn một | a. is · b. are · c. be | b. are | máy |
| 2 | 3 | Q3 | chọn một | a · b. an · c. the | b. an | máy |
| 3 | 1 | Q1 | gõ chữ |  | kitchen | máy |
| 3 | 2 | Q1 | gõ chữ |  | bedroom | máy |
| 3 | 3 | Q1 | gõ chữ |  | garden | máy |
| 4 | 1 | Q5 | chọn Đúng/Sai | T · F | T | máy |
| 4 | 2 | Q5 | chọn Đúng/Sai | T · F | F | máy |
| 4 | 3 | Q5 | chọn Đúng/Sai | T · F | T | máy |
| 5 | 1 | Q2 | gõ câu / đoạn |  | She is nine years old. | máy |
| 5 | 2 | Q2 | gõ câu / đoạn |  | His name is Max. | máy |
| 5 | 3 | Q2 | gõ câu / đoạn |  | In the park. | máy |
