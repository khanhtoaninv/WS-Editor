# Đánh giá lần 5: ba phiếu sinh từ bộ file lesson v0.7, so với v0.6

Ngày 29/10/2026. Phiếu: Gemini 3.8 Flash, Claude 5.5 Haiku, Sol 6.0. Phiếu gốc ở `phieu-lan-5/`. Chấm theo rubric `RUBRIC_KIEM_v0.md` và bốn lớp lỗi (a: theo đúng ba tài liệu; b: lỗi nội dung; c: lỗi do tài liệu; d: lỗi do AI). Chưa nạp vào app. Đếm động từ chạy bằng script, tính cả hai vế của lựa chọn.

**Lưu ý về phiếu Flash:** file nhận được bị cắt ở giữa Task 6 (kết thúc bằng "STIMUL"), không có REPORT, và các dòng bị dồn lại (đáp án đánh số tiếp 6, 7, 8... theo danh sách markdown). Nhiều khả năng đây là lỗi hiển thị hoặc sao chép từ giao diện chat, không chắc là lỗi của model. Mình chấm phần có trong file và ghi rõ điểm tạm.

## 1. Điểm từng phiếu (thang 10)
| | Flash 3.8 | Haiku 5.5 | Sol 6.0 |
|---|---|---|---|
| v0.5 (lần 3) | 6,5 | 6,0 | 6,5 |
| v0.6 (lần 4) | 6,8 | 7,0 | 7,5 |
| **v0.7 (lần 5)** | **6,5 (tạm)** | **7,8** | **8,0** |
| Định dạng đầu ra | Dồn dòng, cắt ở Task 6, thiếu REPORT (xem lưu ý) | Đúng, sạch | Đúng, sạch |
| Đáp án sai | 0 | 0 | 0 |
| Câu mơ hồ / hỏng | 1 (Task 2 câu 3) | 1 nhẹ (Task 3 câu 2) | 0 mơ hồ; 1 câu hội thoại gượng (Task 4 câu 4) |
| Vi phạm quy tắc v0.7 | Task 2 câu 3 chỉ dựa cảnh đồ vật (1e); Task 5 viết sẵn câu hoàn chỉnh (TF-G4-A) | Đổi chỉ dẫn Task 4 so với TF | Không |
| REPORT | Không có | Trung thực; đếm đúng | Chính xác; danh sách từ ngoài gọn đúng |

Điểm trung bình: v0.5 6,3; v0.6 7,1; v0.7 7,4 (nếu phiếu Flash đủ và đúng như phần đã có, điểm của nó khoảng 7,3 và trung bình khoảng 7,7).

## 2. Từng phiếu
### Flash 3.8 (6,5 tạm)
- **Tốt hơn v0.6:** hết đáp án sai, hết mơ hồ do cảnh đồ vật ở G3a và G3b (Task 3 và 4 làm đúng 1e: "Sorry, I can't talk", "Can you hear that music?", "Can you see Grandma?", "right now", "at the moment"); Task 5 dùng đúng một thời điểm và không bịa thói quen; tiêu đề cột, ô They/Now đúng.
- **Task 2 câu 3 hỏng (d):** "Tom: Mia is at her desk with some paper. Mum: [She draws a picture. / She is drawing a picture.]" Chỉ có cảnh đồ vật (đúng mẫu 1e cấm), lượt Tom là lời kể bỏ vào miệng nhân vật, Mum đáp mà không có câu hỏi nào.
- **Task 5 vi phạm giàn giáo (d):** bảng dữ kiện viết sẵn câu hoàn chỉnh ("Ben ... is drawing a picture for Grandma", "Lucy swims at the sports centre"), nên học sinh chỉ chép câu. TF-G4-A yêu cầu ghi động từ nguyên mẫu, không viết sẵn câu.
- **Task 3:** ba trong sáu câu (1, 3, 5) là các hội thoại mẫu trong S5 mục 1e chép nguyên văn; thiếu câu khẳng định đơn (kế hoạch có 2 câu khẳng định).
- **Chưa kiểm được:** Task 6, REPORT (đếm động từ, từ ngoài danh sách).

### Haiku 5.5 (7,8)
- **Đúng:** định dạng sạch, `REPORT` đúng tiêu đề; Task 1, 5, 6 đúng (Task 5 chỉ dùng dữ kiện trong bảng, động từ nguyên mẫu); Task 3 và 4 dùng cả (a) "at the moment/right now" và (b) "Sorry, I can't" đúng 1e; đếm động từ khớp script (play T3 = 4, đúng giới hạn); danh sách từ ngoài có thật và dùng được (ready, sorry, help, teacher...).
- **Task 2:** ba câu thói quen (2, 3, 4) cùng khuôn "...on Sundays?", đáp án đều ở vế trái; vế chọn còn là một đoạn câu ("I [eat my lunch. / am eating my lunch.]"), chưa phải câu đáp hoàn chỉnh như TF-G2-B yêu cầu.
- **Task 3 câu 2 (nhẹ):** "Mia's mum is a teacher. Tom: What does your mum do?" Lời kể đã nói nghề, câu hỏi lặp lại; "is teaching" vẫn có thể hiểu được.
- **Task 3:** bốn trong sáu câu dựa "at the moment/right now"; hợp quy tắc (a) nhưng dễ đoán nhờ từ khóa.
- **Đổi chỉ dẫn Task 4** thành "Use the word in ( ) and change it if needed." (khai trong REPORT). Hành động không đúng với TF, nhưng có lý do (tránh từ "verb").
- **Lặp:** "swim at the sports centre" xuất hiện ba lần (Task 2 câu 0, Task 3 câu 1, Task 4 câu 0), vượt giới hạn 2 của S5 mục 8.

### Sol 6.0 (8,0)
- **Đúng:** định dạng sạch, không câu sai hay mơ hồ thật; G2 mọi câu là câu đáp hoàn chỉnh; tín hiệu "đang làm" ở G3 đúng 1e; Task 5 chỉ dùng dữ kiện trong bảng, nêu "It is Sunday, 3 p.m." một lần ở đầu; REPORT chính xác (đếm khớp script, danh sách từ ngoài theo từng Task: house, hear, music).
- **Task 4 câu 4 gượng:** "Mia: Can you hear the music? Tom: Yes, we ____ (sing) in the garden." Người hỏi và người đáp ở hai nơi nhưng "we = Tom and Mia"; Mia đang hát cùng Tom thì không cần hỏi.
- **Task 4 câu 3 và 5:** "____ (do) you play tennis" và "____ (be) your dad ____ (read)" gợi trợ động từ ngay trong ngoặc, chỗ trống trở thành điền "Do"/"Is".
- **Task 3 và 4:** hai trong sáu câu (Task 3) dựa tín hiệu hội thoại, bốn câu còn lại là "every Saturday / on Sundays"; hợp quy tắc nhưng nhiều từ khóa. Hội thoại lặp khuôn "Can I talk to X? Sorry..." ba lần (Task 2 câu 3, Task 3 câu 1, Task 4 câu 1) và "Can you hear...?" hai lần.
- **Task 2:** câu 2 và 4 cùng khuôn "What does X do with his Y?".

## 3. v0.6 → v0.7: sửa được gì, phát sinh gì
### 3.1 Sửa có hiệu quả
| Lỗi v0.6 | v0.7 |
|---|---|
| Cảnh đồ vật gây mơ hồ (Flash 5 câu, Haiku 6 câu) | Còn 1 câu ở Flash (Task 2), Haiku/Sol 0 |
| "What is X doing?" lộ hình thức ở G3 (Sol) | Hết (ba phiếu) |
| Hội thoại hỏng logic (Sol 3 câu) | Còn 1 gượng ở Sol, 1 lời kể bỏ vào lượt thoại ở Flash |
| Task 5 bịa thói quen, lệch ngày (Flash) | Hết; cả ba dùng một thời điểm, chỉ dùng dữ kiện |
| Danh sách từ ngoài sai ("None") hoặc toàn từ chức năng | Haiku, Sol dùng được; Flash không có (cắt) |
| Đếm động từ khai thiếu (Haiku play T3 6 khai 3) | Đếm đúng cả hai phiếu có REPORT |
| Tiêu đề "=== REPORT ===" | Sửa |

### 3.2 Còn lại, hoặc do v0.7 gây ra
1. **Ví dụ trong 1e thành khuôn mẫu.** Các hội thoại mình đưa làm ví dụ ("Can you hear that music?", "Can I talk to Grandma? Sorry...", "Where are you? Sorry, I can't talk") được chép nguyên: Flash 3 trong 6 câu Task 3; Sol dùng ba lần "Can I talk to X? Sorry". Mọi câu "đang làm" đều chung một vài khuôn nên phiếu đơn điệu, và học sinh học mẹo "gặp Sorry/Can you hear thì chọn -ing". Lỗi tài liệu: ví dụ chỉ có 3 mẫu.
2. **Lối thoát (a) "at the moment/right now"** cho phép phần lớn câu "đang làm" dựa vào từ khóa (Haiku Task 3: 4/6). Quy tắc 30% chỉ đòi 30% câu không từ khóa.
3. **TF-G4-A** chưa cấm rõ viết sẵn câu hoàn chỉnh trong bảng (Flash).
4. **Chỗ trống có sẵn trợ động từ trong ngoặc** ("(do)", "(be)") chưa bị cấm (Sol). Không phải lỗi đáp án, nhưng bài chỉ còn kiểm Do/Does.
5. **Lời kể trong lượt thoại** ("Tom: Mia is at her desk...") chưa bị cấm ở 1f.
6. **Chỉ dẫn Task 4 bị Haiku đổi.** TF hiện có từ "verb" trong chỉ dẫn mẫu, K6 chỉ cấm "verb phrase". Cần chốt: giữ nguyên chỉ dẫn TF, hoặc đổi TF.
7. **Đầu ra Flash bị cắt và dồn dòng.** Có thể do "không dùng khối mã" khiến giao diện chat render lại danh sách. Cần hỏi người dùng đã sao chép thế nào trước khi đổi chỉ dẫn.

## 4. Đánh giá bộ file nạp (thang 10)
| File | v0.6 | v0.7 | Lý do |
|---|---|---|---|
| Kiến thức | 8 | 8 | Ổn định; từ vựng, giới hạn lặp, nhân vật được tuân thủ |
| Trình tự lesson | 7,5 | 8 | 1e, 1f, mục 7, mục 8 có tác dụng (hết cảnh đồ vật, hết "What is X doing", hết bịa dữ kiện). Trừ điểm: ví dụ 1e thành khuôn mẫu; (a) quá dễ |
| Task Format | 7,5 | 8 | G2-B, G3b, G4 chạy đúng ở hai phiếu đủ; G4-A cần cấm viết sẵn câu |
| Chỉ dẫn và định dạng đầu ra | 8,5 | 8,5 | Hai phiếu sạch; Flash chưa rõ nguyên nhân |
| **Cả bộ** | **7,8** | **8,2** | Phiếu tốt nhất (Sol) gần dùng được: sửa 1 câu hội thoại và đa dạng hóa. Hai lần liền, lỗi còn lại không còn là sai nội dung mà là đơn điệu và thừa từ khóa |

Ước tính sửa tay: Sol 3 đến 4 câu; Haiku 4 đến 5 câu (đa dạng hóa Task 2, câu 2 Task 3, lặp "swim"); Flash chưa ước tính được (thiếu Task 6, báo cáo).

## 5. Đề xuất sửa lên v0.8 (chờ duyệt)
1. **Đa dạng tín hiệu "đang làm" (1e):** thêm ít nhất 8 mẫu khác nhau (không chỉ 3), ghi rõ "ví dụ minh họa, phiếu viết tình huống khác"; mỗi mẫu tối đa 1 lần trên phiếu; nêu cấm chép nguyên ví dụ.
2. **Giới hạn (a):** trong G3a và G3b, ít nhất 50% câu "đang làm" dùng (b), tối đa 50% dùng "at the moment/right now".
3. **TF-G4-A:** bảng ghi động từ nguyên mẫu; cấm viết sẵn câu hoàn chỉnh.
4. **TF-G3b-A:** chỗ trống chỉ ở động từ chính hoặc cụm; không ghi trợ động từ trong ngoặc ("(do)", "(be)").
5. **1f:** lời kể (cảnh) đứng riêng một dòng, không đặt trong lượt `Tên:`; mỗi lượt thoại phải là lời nói thật.
6. **TF-G3b-A:** chốt chỉ dẫn in trên phiếu (giữ "Write the verb in the right way. Use the word in ( )." hoặc sửa TF); chỉ dẫn đầu ra yêu cầu giữ nguyên văn.
7. **Chỉ dẫn đầu ra:** hỏi người dùng cách sao chép từ Gemini; nếu do giao diện, cho phép đặt đầu ra trong một khối mã duy nhất.
8. **Hệ thống (bước 4):** máy kiểm ngoài định dạng và đếm: số lần một mẫu hội thoại, tỉ lệ (a)/(b), câu trùng ví dụ trong tài liệu.
