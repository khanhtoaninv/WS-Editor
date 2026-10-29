# Đánh giá lần 4: ba phiếu sinh từ bộ file lesson v0.6, so với v0.5

Ngày 29/10/2026. Phiếu: Gemini 3.8 Flash, Claude 5.5 Haiku, Sol 6.0 (lần 3 là Sol 5.6). Phiếu gốc ở `phieu-lan-4/`. Chấm theo rubric `RUBRIC_KIEM_v0.md` và bốn lớp lỗi (a: theo đúng ba tài liệu không; b: lỗi nội dung; c: lỗi do tài liệu; d: lỗi do AI). Chưa nạp vào app. Đếm động từ chạy bằng script, tính cả hai vế của mỗi lựa chọn.

## 1. Điểm từng phiếu (thang 10)
| | Flash 3.8 | Haiku 5.5 | Sol 6.0 |
|---|---|---|---|
| v0.4 (lần 2) | 4,5 | 6,5 | 7,5 |
| v0.5 (lần 3) | 6,5 | 6,0 | 6,5 |
| **v0.6 (lần 4)** | **6,8** | **7,0** | **7,5** |
| Định dạng đầu ra | Đúng, sạch | Đúng; chỉ "=== REPORT ===" thay vì "REPORT" | Đúng, sạch |
| Đáp án sai | 1 (Task 5 câu 2 bịa thói quen) | 0 | 0 |
| Câu mơ hồ / hỏng | 5 câu mơ hồ (cảnh chỉ có đồ vật), Task 5 câu 2 rối | 6 câu mơ hồ (cùng kiểu) | 0 mơ hồ; 3 câu hội thoại hỏng logic |
| Chép dạng (1d) | Không | Không | Không |
| REPORT | Sai: "Words not listed: None", "Conflicts: None" | Trung thực, danh sách từ ngoài đầy đủ; đếm một lựa chọn thành một lần | Đủ, nhưng danh sách từ lẫn từ chức năng (the, in, to...) |
| Giới hạn lặp động từ | Đạt | **Vi phạm**: "play" 6 lần trong Task 3 (giới hạn 4), khai 3 | Đạt |

Trung bình ba phiếu: v0.5 6,3; v0.6 7,1.

## 2. Từng phiếu
### Flash 3.8 (6,8)
- **Đúng:** Task 1 đủ (tiêu đề cột có định nghĩa, ô They/Now là "—", đáp án theo hàng). Task 6 không có khung câu. Dùng Tom/Mia ở G2–G3b. Mỗi Task G2/G3a/G3b có ≥5 động từ chính. Không còn lỗi đáp án Task 1 như v0.5.
- **Câu mơ hồ do cảnh chỉ có đồ vật (đúng mẫu 1b đã cấm, d):** Task 3 câu 1 "Tom is in the pool with his friends. He [swims / is swimming] with them."; câu 4 "Mia is at the desk with some paper. What [does she draw / is she drawing]?" (hỏi sở thích cũng tự nhiên); câu 5 "Dad is in the living room with an apple. He [eats / is eating] it."; Task 4 câu 1 "Mia is in the kitchen with flour and eggs. She ____ (make) a pancake."; câu 4 "Dad is at the table with some bread. He ____ (eat) it."
- **Task 5 câu 2 hỏng (d):** bạn nói "It is Saturday, 9 a.m. Is Lucy reading a story in the garden?" nhưng bảng ghi "NOW" cho Chủ nhật; đáp án "Lucy reads a story on Sundays" bịa một thói quen không có trong K3.1 (đọc truyện chỉ là việc đang làm lúc 3 giờ chiều Chủ nhật).
- **Task 2 và 3:** câu 5 (Task 2) "Does Dad watch tennis every day? Yes, he [watches / is watching] tennis every day" lặp trạng từ hai lần, đáp án chỉ cần khớp; Task 3 câu 6 có "What do you do" + "usually" nên dễ.
- **REPORT (d):** "Words not listed: None" nhưng có radio, pool, apple, living room, flour, paper, evening. Lỗi này đã gặp ở lần 3. Bảng đếm động từ đếm một lần cho mỗi lựa chọn (Task 3 "eat" 2, thực tế 4), vẫn trong giới hạn.

### Haiku 5.5 (7,0)
- **Đúng:** Task 1 đủ; ITEMS có đủ câu; Task 5 tốt nhất ba phiếu (nêu "It is Sunday, 3 p.m." rõ, bảng không dán nhãn thì, khung "Ben ____ / He ____"); Task 6 tốt; REPORT trung thực nhất, liệt kê từ ngoài danh sách đúng yêu cầu (house, pan, pencil, raining, dinner, free, bed...).
- **Câu mơ hồ do cảnh chỉ có đồ vật (d, và do tài liệu, xem 3.1):** Task 3 câu 1 "I am in the park with my bike. I [am riding / ride] my bike."; câu 2 "...with a pan. She [cooks / is cooking] lunch."; câu 4 "Tom is at the park with his football. [Is Tom playing / Does Tom play] football?"; câu 5 "...at her desk with a pencil. [Does ... draw / Is ... drawing] a picture?"; Task 4 câu 1, câu 3 ("Grandma is in the garden with a book. She ____ (read) a story.", đúng mẫu đã cấm ở 1b).
- **Lách quy tắc 30%:** báo Task 2 là 5/5 (100%), nhưng câu 2, 3, 5 dựa vào "in your free time", "after dinner", "before bed", là cụm chỉ thời gian không nằm trong danh sách S5 mục 0. Thật sự không có cụm thời gian: câu 1, 4 (40%).
- **Vi phạm giới hạn lặp (d):** Task 3 "play" 6 lần (giới hạn 4 ở G3), khai 3. Do chỉ đếm một lần cho mỗi lựa chọn.
- **Lặp nội dung:** cảnh "kitchen with a pan" ở Task 2 câu 4, Task 3 câu 2, Task 4 câu 1; "sports centre/swim" ba Task.
- **G2 vẫn là chọn từ trong câu** ("I [read / am reading]"), không phải chọn câu đáp như TF-G2-B.

### Sol 6.0 (7,5)
- **Đúng:** hết "chép dạng" (không còn "Mia is reading... She [reads / is reading]"); G2 đúng thiết kế chọn câu đáp, thứ tự lựa chọn xen đều; đáp án đều xác định; Task 1, 5, 6 đủ và đúng; không có mơ hồ thật; giới hạn động từ đạt (Task 3 swim 4, play 4, sát trần nhưng đúng); phạm vi đếm đúng.
- **Hội thoại hỏng logic (d):** Task 3 câu 1 "Dad is in the park with Tom and a football. Dad asks Mum, 'What is Tom doing?'" (Bố ở cùng Tom mà hỏi mẹ); câu 4 "Mum asks, 'What is Tom doing?' [Does he draw / Is he drawing] a picture?" (một câu hỏi trả lời cho một câu hỏi); Task 2 câu 3 "What is Dad doing with his lunch?" (ép nghĩa).
- **Rò hình thức qua câu hỏi:** Task 3 câu 0, 1, 4 và Task 4 câu 0, 1, 5 đều có "What are/is X doing?" ngay trước chỗ chọn/điền. Không mơ hồ, nhưng đáp án suy ra được từ chữ "are doing". Ba câu Task 4 (0, 1, 5) cùng một khuôn "scene + 'What are you doing?' + I ____", chủ ngữ gần như chỉ có "I".
- **Thời gian:** Task 2 câu 2 "after school", câu 4 "when he comes home from school" không nằm trong danh sách S5 mục 0, nên số "3/5 câu không có từ thời gian" thực tế chỉ còn 2/5.
- **REPORT:** danh sách "từ ngoài" lẫn từ chức năng (the, in, to, for, my, his), vô dụng để tra; báo "Rules not satisfied: None" (đúng với bản tự khai, nhưng bỏ qua mâu thuẫn giữa khung "Ben ____ / He ____" và quy tắc "không cho sẵn cấu trúc").

## 3. Phân tích: v0.6 sửa được gì, còn lỗi gì
### 3.1 Đã sửa có hiệu quả (3/3 phiếu)
| Lỗi v0.5 | v0.6 |
|---|---|
| Ô They/Now không điền được; Flash điền sai "go" | Cả ba để "—" in sẵn, đáp án theo hàng, chấm 3 ô |
| Task 1 thiếu tiêu đề và định nghĩa nhãn (Sol, Haiku) | Cả ba có đủ |
| Chép dạng động từ của câu liền trước (Sol) | Hết |
| Định dạng drift: ITEMS "see STIMULUS", link, mã trích dẫn, tiêu đề thừa | Hết (còn "=== REPORT ===" của Haiku) |
| Task 6 có khung câu (Flash) | Hết |
| Né 9 động từ chính ở G2–G3b (Haiku) | Mỗi Task có ≥4 động từ chính |
| Nhân vật Ben/Lucy ở bài luyện (Flash) | Hết |
| Đáp án sai (Flash Task 1) | Hết ở Task 1; còn Task 5 câu 2 |

### 3.2 Còn lỗi, phần lớn do tài liệu (c) và do chính bản v0.6
1. **v0.6 tự mâu thuẫn về "cảnh chỉ có đồ vật".** S5 mục 1b cấm "Điền một động từ sau cảnh chỉ có đồ vật" (ví dụ "Tom is at his desk with a book. He (read)"), nhưng S5 mục 1 và TF-G3b-A lại lấy "Mia is in the kitchen with flour and eggs." làm câu tình huống mẫu, và bullet đầu của 1b cho phép "một chi tiết như He is in the water". Hai phiếu (Flash, Haiku) làm theo ví dụ nên ra 5 và 6 câu mơ hồ. Sol tránh được vì tình huống luôn kèm câu hỏi "What is X doing?". Đây là lỗi của mình khi soạn v0.6.
2. **Danh sách "từ chỉ thời gian" đóng** nên bị lách: "after school", "after dinner", "before bed", "in your free time", "when he comes home" không nằm trong danh sách nhưng là dấu hiệu thói quen. Số "câu không có từ thời gian" của Haiku và Sol bị thổi phồng.
3. **Quy tắc 30% vẫn đo sai thứ cần đo.** Khi bỏ từ thời gian, các mô hình thay bằng "What are you doing?" hoặc cảnh đồ vật. Cách đúng cần thiết kế lại: câu "đang làm" luôn kèm một câu hỏi/lượt thoại tự nhiên chỉ lúc này ("Where are you?", "Sorry, I can't talk"), như Haiku Task 3 câu 6, không lặp "is doing".
4. **Task 5 chưa chỉ rõ cả hai câu cùng thời điểm Chủ nhật 3 giờ chiều** và dữ kiện bạn nói sai phải là việc của thì kia. Flash lệch ngày.
5. **Báo cáo từ vựng:** Flash khai "None" sai lần thứ hai; Sol liệt kê từ chức năng; chỉ Haiku làm đúng. Nên để máy tra (không tin tự khai).
6. **Đếm giới hạn lặp:** hai phiếu đếm một lần cho mỗi lựa chọn (cả hai vế đều phải tính); Haiku vi phạm vì thế. Cần ghi rõ "tính cả hai vế của [A / B]".
7. **Hội thoại mô tả bằng "X asks Y" lủng củng** (Sol): TF cần mẫu cho dạng cảnh + câu hỏi (ai hỏi ai, ở đâu).

## 4. Đánh giá bộ file nạp (thang 10)
| File | v0.5 | v0.6 | Lý do |
|---|---|---|---|
| Kiến thức | 7,5 | 8 | Quy tắc nhân vật, danh sách từ, giới hạn động từ được tuân thủ; bỏ gán nhãn Starters/Movers làm 3/3 phiếu hết từ chối hoặc khai sai về chuyện này (còn Flash khai "None") |
| Trình tự lesson | 7,5 | 7,5 | 1d loại hết chép dạng; trừ điểm vì S5 mục 1 và 1b mâu thuẫn, danh sách thời gian đóng |
| Task Format | 7 | 7,5 | G1-B hết lỗi; G2-B tốt (Sol, Flash); G3a/G3b ví dụ cảnh đồ vật gây mơ hồ; G4-A thiếu ràng buộc thời điểm |
| Chỉ dẫn và định dạng đầu ra | 7 | 8,5 | Hết drift 3/3 (còn một tiêu đề lệch) |
| **Cả bộ** | **7,3** | **7,8** | Từ "sinh đúng cấu trúc" tiến sang "gần dùng được": phiếu tốt nhất (Sol) chỉ cần sửa 3 câu hội thoại và đa dạng hóa Task 4; Flash và Haiku cần sửa 5 đến 6 câu mơ hồ |

Ước tính sửa tay: Sol thấp nhất (3 câu Task 3 và vài chỗ nhàm), Flash vừa (6 câu và Task 5 câu 2), Haiku vừa (6 câu mơ hồ, đếm lại, đa dạng hóa).

## 5. Đề xuất sửa lên v0.7 (chờ duyệt)
1. Gỡ mâu thuẫn S5: bỏ ví dụ "flour and eggs" ở S5 mục 1 và TF-G3b-A; cấm hẳn câu "đang làm" chỉ dựa vào cảnh đồ vật; mọi câu "đang làm" phải có một lượt thoại tự nhiên chỉ lúc này (ví dụ "Where are you?" rồi đáp nơi chốn, "Sorry, I can't talk", "Look at the window" không dùng vì Look! là dấu hiệu thời gian) hoặc "at the moment".
2. Mở danh sách thời gian (S5 mục 0) thành "mọi cụm chỉ thời gian hay tần suất" kèm ví dụ: after school, after dinner, before bed, in your free time, when he comes home, in the evening.
3. Cấm câu hỏi "What is/are X doing?" ngay trước chỗ chọn ở G3a/G3b (dạng "is doing" lộ hình thức); G2-B được dùng.
4. TF-G4-A: nêu "cả hai câu cùng là Chủ nhật 3 giờ chiều"; dữ kiện bạn nói sai là việc của thì còn lại; không bịa thói quen ngoài K3.1.
5. Đếm lặp: ghi rõ "tính cả hai vế của [A / B]"; giới hạn đếm do máy kiểm.
6. Hội thoại có dẫn "X asks": thêm mẫu một lượt (ai hỏi ai, ai ở đâu) và cấm hai câu hỏi liên tiếp.
7. Bước 4 (hệ thống): máy kiểm gồm định dạng, đếm động từ (cả hai vế), từ ngoài danh sách, từ chỉ thời gian mở rộng, phát hiện "What is X doing" trước chỗ chọn.
