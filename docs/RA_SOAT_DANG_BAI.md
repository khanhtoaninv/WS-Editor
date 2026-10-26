# Rà soát dạng bài: kiến trúc cũ (v80) và kiến trúc mới (G0–G3 + Q + G-Text + G3-Text)

Ghi 26/10/2026. **Điểm là phán đoán của Claude, không phải số đo trên app.** Chưa sửa code.

## Cách chấm
- 100: trình bày tự nhiên, người học hiểu ngay. 70–89: được, có chỗ phải lách (Phần, nối Task, ghi vào hướng dẫn). 50–69: thiếu một phần ý. <50: không trình bày được.
- *Mới* = cùng các bộ vẽ hiện có của v80, chỉ đổi kiến trúc (G2 = bài đọc/lời dẫn, G3 = câu hỏi + đáp án theo Q, đổi thứ tự khối ở cấp Task, G-Text, G3-Text, G3 chia nhóm mỗi nhóm một Q). **Không tính dạng Q mới chưa có bộ vẽ.**
- Tần suất (cao/vừa/thấp = 3/2/1) là ước lượng theo các giáo trình anh/chị dạy; dùng làm trọng số.
- Nguồn dạng bài: `samples/` (18 + 30 + 6 Task), `tests/real/` (Birthday, Sunny Farm, điều chỉnh v80), cộng dạng thường gặp ở YLE, Family and Friends / Our World, Global Success, IELTS.

## Kết quả
- 63 dạng, 31 dạng đã có trong repo.
- Trung bình có trọng số: cũ **83%**, mới **87%**. Không trọng số: 81% → 85%.
- Chỉ các dạng có trong repo: 88% → 93%.
- Số dạng ≥90 / 70–89 / 50–69 / <50: cũ [19, 34, 8, 2], mới [31, 28, 2, 2].

| Nhóm | n | Cũ | Mới |
|---|---|---|---|
| YLE nghe | 5 | 85% | 86% |
| YLE đọc viết | 9 | 83% | 87% |
| Nền tảng | 13 | 84% | 85% |
| Ngữ pháp | 14 | 91% | 92% |
| Đọc hiểu | 6 | 77% | 90% |
| Viết nói | 4 | 81% | 90% |
| IELTS | 5 | 78% | 79% |
| Sư phạm | 7 | 66% | 82% |

## Bảng đầy đủ

| Nhóm | Dạng | Trong repo | Tần suất | Cũ | Mới | Ghi chú |
|---|---|---|---|---|---|---|
| YLE nghe | Nghe, nối tên vào người trong tranh |  | vừa | 60 | 60 | tên quanh tranh, dây nối: chưa có (lưới/sơ đồ) |
| YLE nghe | Nghe và viết (tên, số) | có | cao | 90 | 95 |  |
| YLE nghe | Nghe và tick tranh A/B/C | có | cao | 100 | 100 |  |
| YLE nghe | Nghe và tô màu (+ viết) | có | vừa | 85 | 85 | điểm trên ảnh v76 |
| YLE nghe | Nghe, viết chữ cái của tranh vào ô | có | vừa | 80 | 80 | demo Task 16 |
| YLE đọc viết | Nhìn tranh, tick/gạch câu đúng sai | có | cao | 85 | 90 |  |
| YLE đọc viết | Nhìn tranh, viết yes/no |  | vừa | 90 | 90 |  |
| YLE đọc viết | Nhìn tranh, xếp chữ cái thành từ |  | vừa | 85 | 85 | A3 ô chữ cái |
| YLE đọc viết | Bài đọc điền từ, khung từ bằng tranh |  | vừa | 70 | 70 | khung từ chưa chứa ảnh |
| YLE đọc viết | Đọc định nghĩa, viết từ |  | vừa | 85 | 85 |  |
| YLE đọc viết | Hội thoại chọn câu đáp A/B/C | có | cao | 90 | 90 |  |
| YLE đọc viết | Truyện + điền 1–3 từ / chọn tựa | có | cao | 85 | 95 | đổi thứ tự bài đọc ↔ câu hỏi |
| YLE đọc viết | Viết truyện theo 3 tranh |  | vừa | 60 | 80 | 3 tranh rồi khung viết = 2 nhóm Q (cần G3 chia nhóm) |
| YLE đọc viết | Tìm từ khác loại (odd one out) |  | vừa | 90 | 90 |  |
| Nền tảng | Tô chữ / tô từ | có | cao | 100 | 100 |  |
| Nền tảng | Điền chữ cái còn thiếu (c_t) |  | cao | 85 | 85 |  |
| Nền tảng | Khoanh tranh có âm đầu |  | vừa | 90 | 90 |  |
| Nền tảng | Đếm và viết số |  | vừa | 85 | 85 |  |
| Nền tảng | Tô màu theo số / theo lệnh | có | vừa | 80 | 80 |  |
| Nền tảng | Vẽ rồi ghi nhãn (draw your family) |  | vừa | 65 | 70 | chưa có khung vẽ trống đúng nghĩa |
| Nền tảng | Nối điểm / mê cung (chỉ là tranh) |  | thấp | 90 | 90 |  |
| Nền tảng | Tìm chữ (word search) | có | vừa | 85 | 85 | demo Task 29 |
| Nền tảng | Ô chữ (crossword) | có | vừa | 85 | 85 | v78, lưới phải đưa sẵn |
| Nền tảng | Sắp xếp từ thành câu |  | cao | 80 | 80 |  |
| Nền tảng | Phân loại từ vào cột |  | vừa | 80 | 85 |  |
| Nền tảng | Ghi nhãn tranh (số trên tranh) | có | vừa | 80 | 80 | điểm trên ảnh |
| Nền tảng | Từ điển tranh (từ + ảnh, không làm bài) |  | thấp | 80 | 80 |  |
| Ngữ pháp | Điền chỗ trống câu | có | cao | 100 | 100 |  |
| Ngữ pháp | Điền từ trong khung | có | cao | 100 | 100 |  |
| Ngữ pháp | Trắc nghiệm A/B/C/D | có | cao | 100 | 100 |  |
| Ngữ pháp | Khoanh/gạch từ đúng {a|b} | có | cao | 100 | 100 |  |
| Ngữ pháp | Dạng từ (WORD trong ngoặc) | có | cao | 95 | 95 | v80 |
| Ngữ pháp | Phát âm (gạch chân phần khác) |  | vừa | 85 | 85 |  |
| Ngữ pháp | Trọng âm |  | vừa | 90 | 90 |  |
| Ngữ pháp | Đồng nghĩa/trái nghĩa, 2 nhóm hướng dẫn | có | vừa | 85 | 100 | hiện tự tách phần (v80) (cần G3 chia nhóm) |
| Ngữ pháp | Tìm lỗi sai (A B C D dưới chữ gạch chân) |  | vừa | 50 | 50 | chưa có nhãn dưới đoạn gạch |
| Ngữ pháp | Viết lại câu (bắt đầu bằng từ cho sẵn) | có | cao | 85 | 85 | v79 |
| Ngữ pháp | Nối câu / ghép câu |  | vừa | 85 | 85 |  |
| Ngữ pháp | Nối nửa câu | có | cao | 95 | 95 | T7 |
| Ngữ pháp | Xếp câu hội thoại theo thứ tự | có | vừa | 75 | 85 | số ở lề trùng số phải điền |
| Ngữ pháp | Hoàn thành hội thoại | có | cao | 100 | 100 |  |
| Đọc hiểu | Bài đọc điền chỗ trống đánh số + lựa chọn | có | cao | 85 | 95 | G2 ↔ G3 rõ hơn |
| Đọc hiểu | Đọc và trả lời / trắc nghiệm | có | cao | 95 | 100 |  |
| Đọc hiểu | True / False / Not Given |  | vừa | 80 | 85 |  |
| Đọc hiểu | Nối tiêu đề với đoạn |  | vừa | 60 | 75 | đoạn có nhãn A–F + ô |
| Đọc hiểu | Xếp đoạn/câu thành bài |  | vừa | 75 | 80 |  |
| Đọc hiểu | Đoán trước khi đọc rồi đọc (Sunny Farm 1) | có | vừa | 55 | 95 | hiện phải lách ### Phần |
| Viết nói | Viết đoạn / email có gợi ý | có | cao | 80 | 90 | v80 + G-Text |
| Viết nói | Viết theo dàn ý gạch đầu dòng |  | vừa | 80 | 90 |  |
| Viết nói | Thẻ nói (cue card) |  | thấp | 85 | 90 |  |
| Viết nói | Mô tả biểu đồ / tranh (IELTS W1) |  | thấp | 85 | 90 |  |
| IELTS | Điền form / ghi chú (Name: ___) |  | thấp | 75 | 80 |  |
| IELTS | Điền bảng | có | vừa | 95 | 95 |  |
| IELTS | Điền sơ đồ luồng (flow-chart) |  | thấp | 30 | 30 | cần lưới/sơ đồ tự do |
| IELTS | Gắn nhãn bản đồ |  | thấp | 80 | 80 |  |
| IELTS | Tóm tắt điền từ |  | thấp | 90 | 95 |  |
| Sư phạm | Mục tiêu / can-do (My goal) | có | vừa | 85 | 90 | G-Text |
| Sư phạm | Tự đánh giá (Self-check) | có | vừa | 75 | 90 |  (cần G3 chia nhóm) |
| Sư phạm | Câu mẫu đã làm sẵn (0. Example) |  | cao | 50 | 85 | G3-Text |
| Sư phạm | Story map / sơ đồ đầu-giữa-cuối | có | vừa | 75 | 80 | bảng |
| Sư phạm | Bài trộn: tick + viết tiếp + tự đánh giá | có | vừa | 65 | 95 | hiện = 3 Task nối (cần G3 chia nhóm) |
| Sư phạm | Sơ đồ Venn / mind map |  | thấp | 20 | 20 | cần sơ đồ tự do |
| Sư phạm | KWL / bảng ghi chú |  | thấp | 85 | 85 |  |

## Nhận xét
- Kiến trúc mới tăng điểm chủ yếu ở **thứ tự khối, bài trộn nhiều phần, câu mẫu, tự đánh giá**, đúng loại lỗi gặp ở phiếu thật do AI tạo.
- Dạng cơ bản (điền, trắc nghiệm, nối, tô) cả hai đều ~100%: đổi kiến trúc không thêm gì.
- 4 dạng thấp ở cả hai (nối tên vào tranh, tìm lỗi sai A B C D, flow-chart, Venn / mind map) cần **bộ vẽ mới** (lưới/sơ đồ tự do, nhãn dưới đoạn gạch). Kiến trúc mới chỉ giúp chỗ gắn chúng vào (một Q mới) gọn hơn.
- Header phiếu (tên phiếu, Name/Class/Date) không tính: nằm ngoài Task, chưa có ở cả hai.
