# Đánh giá lần 3: ba phiếu sinh từ bộ file lesson v0.5

Ngày 29/10/2026. Phiếu: Gemini 3.8 Flash, Claude 5.5 Haiku, Sol 5.6 (lần 2 ghi là GPT 6.1 Sol; giữ tên "Sol"). Phiếu gốc ở `phieu-lan-3/`. Chấm theo rubric `RUBRIC_KIEM_v0.md` và bốn lớp lỗi (a: theo đúng ba tài liệu không; b: lỗi nội dung; c: lỗi do tài liệu thiếu hoặc mơ hồ; d: lỗi do AI). Chưa nạp vào app. Đếm động từ chạy bằng script (bỏ do/does vì là trợ động từ ở phần lớn chỗ).

## 1. Điểm từng phiếu (thang 10) và so với v0.4
| | Flash 3.8 | Haiku 5.5 | Sol 5.6 |
|---|---|---|---|
| Điểm v0.4 (lần 2) | 4,5 | 6,5 | 7,5 |
| **Điểm v0.5 (lần 3)** | **6,5** | **6,0** | **6,5** |
| Định dạng đầu ra | Gần đúng; thừa dòng "```eof" và một câu kết | Lệch: thêm tiêu đề đầu phiếu, "=== REPORT ===", 4/6 Task ghi "ITEMS: see STIMULUS" (câu nằm trong STIMULUS) | Lệch nhẹ: thêm "WORKSHEET", mã trích dẫn rác, đường link tải cuối; Task 1 không có dòng tiêu đề cột |
| Đáp án sai / mơ hồ | 1 đáp án sai, 3 câu mơ hồ | Không câu mơ hồ (câu nào cũng có từ thời gian), 1 ghi chú chấm vô nghĩa | Không sai; 2–3 câu hơi mơ hồ |
| Đo đúng nghĩa (S2) | Khá: G2 hết rò đuôi -ing, nhưng còn 1 câu dựa "Look!" | Yếu: câu nào cũng có từ khóa; G2 thành bài chọn từ trong câu | **Yếu nhất**: phần lớn câu chép lại dạng động từ của câu liền trước |
| Trung thực của REPORT | Thấp: báo "None", đếm sai, lỗi tự khai | Cao: khai thẳng ba Task không đạt quy tắc 30%, nhưng không sửa | Cao: khai xung đột G1, từ chối đoán nhãn Starters/Movers; đếm lệch 1 |

Điểm trung bình ba phiếu: v0.4 6,2; v0.5 6,3. Phiếu tệ nhất tăng (4,5 lên 6,5), phiếu tốt nhất giảm (7,5 xuống 6,5). Bộ v0.5 làm kết quả đều hơn, chưa làm tốt hơn.

## 2. Từng phiếu: lỗi cụ thể
### Flash 3.8
- **Đáp án sai (b, d):** Task 1 hàng They, cột Now ghi "go" (là thói quen, không phải việc đang làm); NOTES nói chấp nhận "eat" hoặc "go" cho Usually, tự mâu thuẫn.
- **Câu mơ hồ (d, có mẫu đã cấm ở 1b):** Task 3 câu 3 "They [don't play / aren't playing] football" (tình huống chỉ nói họ ở dưới nước); Task 3 câu 1 "He [draws / is drawing] a monkey" (chỉ có cảnh "at the desk with his pencils"); Task 4 câu 3 "Tom is at his desk with a book. He (read)" (đúng mẫu "ngữ cảnh chỉ gợi ý, không khẳng định"). Task 3 câu 5 dựa vào "Look at Dad!".
- **Nhân vật (d):** Task 3 ví dụ dùng Lucy; Task 4 câu 5 "Ben and Lucy are at the sports centre... swim now?" mâu thuẫn cảnh chính (K3.1 dành Tom/Mia cho bài luyện).
- **Task 6 (d):** Cho sẵn khung "My ____ is ____", trái S5 mục 6 (G5 có ví dụ nhưng không viết sẵn câu).
- **REPORT:** Task 4 khai "câu 3 và 4 không có từ thời gian" nhưng câu 4 có "on Sundays", nên thực tế 1/5 (20%, dưới 30%), phiếu vi phạm mà báo cáo nói đạt. Ghi "Conflicts: None" (G1 hàng They không điền được). Bảng đếm động từ có ô tự sửa lẫn lộn. Phân loại từ Starters/Movers không kiểm chứng được. Đếm thật bằng script: mọi động từ trong giới hạn.
- **Tốt:** G1 dán định nghĩa Usually/Now vào tiêu đề cột (đúng S4); G2-B đúng thiết kế, đã có câu tình huống; G4 có bảng dữ kiện dạng động từ và khung "Ben ____ / He ____"; ANSWER KEY và NOTES tiếng Anh.

### Haiku 5.5
- **Định dạng (d, một phần c):** ITEMS để "see STIMULUS" ở Task 2–5; máy nạp sẽ phải tự tách câu. Đáp án Task 1 có ghi chú không hiểu được: "play / plays for Ben Usually only if the verb form is singular".
- **G2 lệch thiết kế (d):** Task 2 làm kiểu "I [cook / am cooking]", tức bài chọn từ trong câu của G3a, không phải chọn câu đáp. Mọi câu đều có "now", "on Sundays", "every morning" hoặc "how often"; chỉ câu 3 (20%) thoát. Báo cáo tự khai không đạt 30% ở Task 2, 3, 4 nhưng không viết lại, nghĩa là biết vi phạm quy tắc mà vẫn nộp.
- **Tránh động từ mục tiêu (d, nhẹ):** Task 2–4 hầu như không dùng 9 động từ chính (dùng cook, sing, get up, feed...), với lý do ghi trong báo cáo là "giữ số đếm thấp". K5 cho phép dùng thêm động từ, nhưng bài luyện thành ra không luyện trọng tâm lesson. Lặp "dog/feed" 4 lần.
- **Task 1:** hàng They ô Now ghi "—"; thiếu định nghĩa nhãn Usually/Now trên phiếu (vi phạm S4).
- **Task 5 (nhẹ):** đáp án mẫu "Now he is drawing..." không khớp khung "He ____".
- **Từ ngoài danh sách:** pan, pen, room, house; từ chối phân loại vì không có danh sách trong môi trường.
- **Tốt:** không câu nào mơ hồ thật; Task 6 chuẩn nhất trong ba phiếu (ví dụ, không viết sẵn khung); báo cáo trung thực.

### Sol 5.6
- **Rò rỉ dạng động từ qua câu liền trước (c, d):** Task 3 câu 0–3 chép nguyên câu rồi bắt chọn lại ("Mia is reading a story in the garden. She [reads / is reading] a story in the garden."); Task 4 câu 0–4 như vậy ("I am playing football now. I ____ football now. (play)"); Task 2 câu 1–4 chứa câu tình huống ở đúng dạng của đáp án ("Mia is drawing a picture in the garden... [She draws / She is drawing]"). Về chữ, phiếu thỏa mọi quy tắc "xác định được từ tình huống" và báo cáo đạt 4/5, 3/6, 3/5 câu không có từ thời gian. Về nghĩa, học sinh chỉ chép. Đây là chính lỗi G2-A của v0.4 chuyển sang chỗ khác. Mã S5 mục 1 bị "chơi chữ".
- **Mơ hồ nhẹ:** Task 2 câu 2, 3 ("Tom plays football in the park. Dad talks about Tom... Tell me about Tom") vì "He is playing" vẫn hợp lý; Task 3 câu 6 "Tom: I draw pictures. Mia: I do this too. I [draw / am drawing] pictures"; Task 5 câu hỏi không nói thời điểm "bây giờ".
- **Task 1 (c):** thiếu dòng tiêu đề cột và định nghĩa Usually/Now, nhãn chỉ có trong NOTES; ANSWER KEY đánh số theo ô (0 đến 3), không theo hàng, khó khớp với ITEMS.
- **Tốt:** theo đúng chi tiết TF mà hai phiếu kia bỏ qua (ghi độ dài đáp án "two-word phrase", nêu rõ "They = Tom and Mia"); Task 5 và 6 đạt; báo cáo trung thực, từ chối đoán nhãn từ vựng.
- **REPORT:** đếm động từ lệch 1 (khai read 12, draw 12; script đếm 11 và 11). Vẫn trong giới hạn nhưng sát trần.

## 3. Lỗi chung của cả ba (đáng chú ý nhất: lỗi của tài liệu)
1. **TF-G1-B hàng "They" không điền được cột Now.** K3.1 không có việc Ben và Lucy cùng làm lúc 3 giờ chiều Chủ nhật (Ben vẽ, Lucy đọc). Mỗi model xử lý khác: Flash điền sai "go", Haiku và Sol để "—" (Sol đúng hơn vì giải thích). Đây là lỗi mới do v0.5 gây ra (sửa "ba hàng" chưa nghĩ tới ô Now).
2. **Quy tắc 30% bị lách hoặc bị bỏ.** Haiku không đạt và nộp luôn. Sol đạt về chữ bằng cách chép dạng động từ của câu trước. Flash báo đạt nhưng sai số liệu. Cách đo "không có từ thời gian" không đo được điều ta muốn (hiểu nghĩa); v0.5 vá G2-A nhưng không chặn kiểu rò qua "câu trước giống hệt".
3. **Danh sách Cambridge Starters/Movers không có trong gói.** K5 yêu cầu ghi mỗi từ ngoài danh sách là Starters hay Movers. Haiku và Sol từ chối vì không tra được; Flash phân loại nhưng không kiểm chứng được. Phải đưa danh sách vào gói, hoặc để máy kiểm.
4. **Định dạng đầu ra vẫn drift** (header thừa, ITEMS rỗng, link, ghi chú). Máy nạp cần bộ kiểm cứng, không nên tin AI theo khung.
5. **Phạm vi đếm động từ đã rõ hơn** (cả ba bỏ chỉ dẫn và trợ động từ), nhưng AI vẫn tự đếm lệch (Sol lệch 1 ở mấy động từ, Flash lẫn trong bảng). Vẫn nên để máy đếm.
6. **NOTES/REPORT tiếng Anh:** cả ba làm đúng. Sửa này của v0.5 có hiệu quả.
7. **Còn mơ hồ ở câu phủ định và câu hỏi điền từ** (Flash). Danh sách mẫu ở 1b chưa chặn được 3 trường hợp: "[don't play / aren't playing]" sau một câu tả cảnh, "He (read)" sau "at his desk with a book", "He [draws / is drawing] a monkey".

## 4. Đánh giá bộ file nạp v0.5 (thang 10) và so với v0.4
| File | v0.4 | v0.5 | Lý do |
|---|---|---|---|
| Kiến thức | 7 | 7,5 | Phạm vi đếm động từ, danh sách từ mở rõ hơn, thêm từ cho khung Task. Trừ điểm: tham chiếu danh sách Cambridge mà không có danh sách; K3.1 thiếu việc chung lúc 3 giờ cho "They" |
| Trình tự lesson | 8 | 7,5 | Mặc định G2-B, mẫu mơ hồ ở 1b đã có tác dụng ở Haiku và Sol. Trừ điểm: quy tắc 30% đo sai thứ cần đo và bị lách; chưa cấm "chép lại dạng động từ của câu trước" |
| Task Format | 6,5 | 7 | G2-B tốt (Flash đúng thiết kế); G1-B có ba hàng nhưng ô They/Now không điền được; G3a/G3b chưa cấm lặp nguyên câu |
| Chỉ dẫn và định dạng đầu ra | 7,5 | 7 | NOTES/REPORT tiếng Anh đã tốt; nhưng drift định dạng vẫn có ở 3/3 phiếu, nhiều hơn lần 2 (ITEMS rỗng, link, mã trích dẫn) |
| **Cả bộ** | **7** | **7,3** | Nâng nhẹ: phiếu tệ nhất tăng 2 điểm, hết dạy sai ngữ pháp, hết ghi chú tiếng Việt, hết dùng từ cấm. Chưa nâng ở chỗ quan trọng nhất (S2): đo nghĩa. Còn lỗi mới (They/Now, kẽ hở chép dạng) |

Kết luận: v0.5 đủ để sinh phiếu đúng cấu trúc từ ba model, chưa đủ để sinh phiếu không cần người sửa. Thời gian sửa tay ước tính: Flash ít nhất (5 câu), Sol nặng nhất (viết lại hai Task, vì lỗi nằm ở thiết kế câu, không ở từng câu), Haiku trung bình (viết lại Task 2–4 cho đủ tình huống).

## 5. Đề xuất sửa lên v0.6 (chờ duyệt)
1. K3.1: thêm một câu cho cột Now của "They", hoặc quy định TF-G1-B hàng They có ô Now in sẵn "—", không chấm, và đáp án Task 1 chỉ có 3 ô (Ben x 2, They Usually).
2. S5 mục 1: đổi đo "không có từ thời gian" thành "đáp án phải suy được từ nghĩa tình huống, câu trước không chứa dạng động từ của đáp án". Thêm vào 1b: cấm lặp nguyên câu rồi chọn/điền lại; thêm 3 mẫu mơ hồ của Flash.
3. S4: bắt buộc dòng tiêu đề cột với định nghĩa Usually/Now trên phiếu (Haiku, Sol thiếu).
4. Đưa danh sách Cambridge Starters và Movers (2018) vào gói, hoặc đổi quy định: AI chỉ liệt kê từ ngoài K4/K5, máy tự tra và gán nhãn.
5. Chỉ dẫn: "ITEMS phải chứa từng câu; không để 'see STIMULUS'"; "không viết gì ngoài hai phần (không link, không lời kết)".
6. Việc hệ thống (bước 4): máy kiểm định dạng, đếm động từ, từ ngoài danh sách, tách câu có từ thời gian, và phát hiện câu trước/sau trùng dạng động từ.
