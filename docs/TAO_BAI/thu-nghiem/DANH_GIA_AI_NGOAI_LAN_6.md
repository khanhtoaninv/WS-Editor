# Đánh giá lần 6: ba phiếu sinh từ bộ file lesson v0.9, so với v0.7

Ngày 29/10/2026. Phiếu: Gemini 3.8 Flash, Claude 5.5 Haiku, Sol 6.0. Chấm theo rubric `RUBRIC_KIEM_v0.md` và bốn lớp lỗi (a: theo đúng ba tài liệu; b: lỗi nội dung; c: lỗi do tài liệu; d: lỗi do AI). Phiếu nạp bằng `kiem-md.cjs` (bản `ws-editor.html` trong nhánh), đếm động từ bằng script (tính cả hai vế lựa chọn; không tính Hướng dẫn, Khung từ, Đáp án). Kiểm đáp án từng câu bằng tay.

**Giới hạn:** (1) v0.8 chưa chạy riêng, nên v0.9 so với v0.7 gộp cả hai thay đổi. (2) Ba file người dùng gửi đã mất rào khối mã (Flash còn sót dòng "```text:" và "```eof", Sol và Haiku không còn rào), nên mình không chấm điều "đúng hai khối mã"; chỉ chấm nội dung MD sau khi tách tay. (3) Đây là một lần chạy mỗi model, chênh 0,2 điểm giữa hai lần chạy là nhiễu.

## 1. Kết quả
| | Flash 3.8 | Haiku 5.5 | Sol 6.0 |
|---|---|---|---|
| v0.7 (lần 5) | 6,5 (tạm, file cắt) | 7,8 | 8,0 |
| **v0.9 (lần 6)** | **7,0** | **7,2** | **8,2** |
| Nạp vào Editor | Được; 0 ghi chú, 0 tràn trang, 0 lỗi console | Được; 1 ghi chú ("không hiểu Dạng: chọn A/B"); 0 tràn, 0 lỗi | Được; 0 ghi chú, 0 lỗi (4 trang) |
| Đáp án sai | 0 | 0 | 0 |
| Câu có hai đáp án | 0 chắc chắn (1 nhẹ: Task 3 câu 3) | **2** (Task 1 hàng They; Task 4 câu 5) | 0 |
| Câu gượng | 2 | 1 | 3 |
| Ước tính sửa tay | 7 đến 8 câu | 6 đến 7 câu | 4 câu |
| REPORT | Sai và thiếu: báo "None" dù vi phạm; đếm lệch đến 3; danh sách từ ngoài thiếu | Trung thực, đếm lệch 0 đến 1, tự khai chỗ lệch | Đầy đủ nhất; danh sách từ khớp; đếm lệch đều +1 (tính cả Khung từ) |

Trung bình ba model: v0.7 7,4 (tạm); v0.9 7,5. Phiếu tốt nhất tăng 0,2; hai phiếu còn lại đi ngang hoặc giảm.

## 2. Từng phiếu

### Sol 6.0 (8,2)
- **Đúng:** Task 1 là bản tốt nhất ba phiếu (mỗi dòng có "on Saturdays" hoặc "Sunday, 3 p.m."; không có việc chung thứ hai ở hàng They). Task 3 dùng 4 kiểu tín hiệu khác nhau trên cả phiếu (âm thanh, lời mời, lời gọi, mượn điện thoại), mỗi kiểu một lần, viết tình huống mới (S5 mục 1e đúng chữ và đúng tinh thần). Không lặp mẫu hội thoại nào. Trợ động từ không còn trong ngoặc. G4 chỉ dùng động từ nguyên mẫu. Danh sách từ ngoài (house, there, never, work, song, hear, come, television, use) khớp phiếu; đếm động từ lệch đều +1 so với script vì tính cả Khung từ.
- **Task 2: đáp án chạy theo câu hỏi.** Bốn trong năm câu hỏi dạng "What does X do?" / "What is X doing?", đáp án chỉ phản chiếu thì của câu hỏi. Câu 1 và 2 có câu tình huống nhắc lại điều câu hỏi sắp hỏi ("Tom goes to the park with his football on Saturdays. Dad: What does Tom do there?"), vi phạm S5 mục 1b (không hỏi lại điều vừa nói). Câu 1: Tom đang ở trung tâm thể thao nhưng Mum hỏi Mia "Tom làm gì ở đó mỗi thứ Bảy". Đây là điều S5 mục 1e cho phép ("G2-B thì được hỏi What is X doing?"), nên là lỗi tài liệu (c).
- **Task 4 câu 2 (d):** "Dad: Does Tom swim on Sundays? Mia: No, he ___ (not swim) on Sundays." Lượt liền trước chứa chính "swim" và "on Sundays"; học sinh chép lại. Vi phạm S5 mục 1d. Câu 4 gượng: Mia hỏi "What do you and Tom do on Sundays?" Dad đáp "We go to Grandma's house" (Dad và Tom, không có Mia; Grandma lại là bà của Ben, Lucy).
- **Task 3:** hai trong sáu câu dựa từ khóa mạnh ("never", "on Sundays", "every day"); "Mum's song" hơi gượng.
- **Task 5:** đổi nhãn cột thành "Usually on Saturdays | Now, Sunday at 3 p.m." thay vì Usually/Now có định nghĩa (S4). Nhẹ.

### Haiku 5.5 (7,2)
- **Đúng:** G2 lần này vế chọn là câu đáp hoàn chỉnh (lỗi lần 5 đã hết); 4 trong 5 câu G2 không có từ thời gian (80%, khớp báo cáo); đáp án G2 không xen kẽ (A B A A B B); G4 là bản giàn giáo chuẩn nhất (động từ nguyên mẫu, có "on Saturday" trong ô); chỉ dẫn Task 4 chép nguyên văn; đếm động từ lệch script 0 đến 1 (khai ride 8, thực 7; swim 6, thực 5), mọi động từ trong giới hạn 12; REPORT tự khai đúng chỗ lệch (thành phần Task 3, "(not go)", từ nghi ngờ).
- **Task 1 hàng They có hai đáp án (b, nặng):** văn bản nguồn có cả "Ben and Lucy eat lunch together" và "On Sundays, they usually go to Grandma's house". Học sinh viết "go" cũng đúng; đáp án chỉ ghi "eat". Nguyên nhân tài liệu: K3.1 có câu "Chủ nhật: thường đến nhà bà" và TF-G1-B không cấm đưa nó vào nguồn (c); Flash và Sol né được.
- **Task 4 câu 5 có hai đáp án (b):** "___ Tom ___ (eat) breakfast at home?" không có từ thời gian, không có cảnh; "Does Tom eat" hay "Is Tom eating" đều tự nhiên. Haiku lại tính câu này là câu đạt 30%.
- **Lặp mẫu (d):** "Sorry, I can't" 3 lần (Task 2 câu 1, Task 3 câu 3, Task 4 câu 1; riêng Task 2 câu 1 và Task 4 câu 1 gần như cùng câu "I am reading a book"); "Can I talk to X? Sorry, she/he is cooking" 2 lần; "Grandma cooks lunch" 3 lần (Task 2 câu 3 và 5, Task 3 câu 5), vượt tối đa 2 của S5 mục 8; "What is your favourite sport, Mia?" nguyên văn ở Task 2 câu 4 và Task 4 câu 2. Cả phiếu chỉ dùng 2 kiểu tín hiệu (1) và (6), trong khi S5 mục 1e yêu cầu ít nhất 4. REPORT không kiểm điều này nên không tự phát hiện.
- **Dạng:** viết `Dạng: chọn A/B`; bộ đọc không hiểu và tự đổi về Chọn A/B/C (không hại, chỉ báo ghi chú).
- **Task 5:** viết `Ben ___. He ___.` đúng theo TF-G4-A nhưng khác mẫu file 0 (`Ben … He …`). Hiển thị ra ô gạch ngắn trong khung hai dòng; dùng được.

### Flash 3.8 (7,0)
- **Đúng:** phiếu đủ (7 Task, có NOTES và REPORT; lần 5 bị cắt giữa Task 6 thì lần này hết), nạp được. G4 không còn viết sẵn câu (lỗi lần 5 đã hết). Task 2 câu cảnh đứng riêng một dòng. Mỗi kiểu 1e đúng một lần, sáu kiểu.
- **Chép nguyên mẫu (d):** cả 6 hội thoại "đang làm" ở Task 3 và 4 là bản gần như nguyên văn của 6 ví dụ trong S5 mục 1e: "Where is Mia? She is in the garden. She reads / is reading a book", "Can you hear that music? ... plays / is playing the guitar", "Can you play tennis... Sorry, I can't. I do / am doing", "Tom, come and eat your lunch! Sorry, I can't", "Is Mia at home? ... she can't talk on the phone", "Can you see Grandma? Yes, she ...". Từ ví dụ 3 thành 8 mẫu không làm phiếu đa dạng hơn, chỉ làm phiếu đúng từng mẫu. S5 mục 1e nói rõ "không chép nguyên văn ví dụ".
- **Task 2 đáp án xen kẽ đều:** B A B A B A (kể cả câu 0). TF-G2-B cấm. Câu 2 có "Tom has some bread" (has chỉ sở hữu, ngoài phạm vi K4). Câu 1, 3, 5 có từ khóa ở cả hai vế và ở câu hỏi ("on Sundays", "every evening", "right now", "at the moment").
- **Task 3 sai thành phần:** TF yêu cầu 2 khẳng định đơn, 1 phủ định, 2 câu hỏi, 1 hội thoại; Flash có 1 khẳng định đơn, 1 phủ định, 1 câu hỏi, 3 hội thoại. Không khai.
- **Task 4:** "Mia and Tom: Can you see Grandma in the kitchen?" hai người trong một lượt (S5 mục 1f); "pancakes" số nhiều (K5 cấm).
- **Task 1:** dòng "At twelve o'clock, they eat lunch together." không có dấu thứ Bảy riêng.
- **REPORT (d):** mục 5 ghi "None" nhưng có thành phần Task 3, "pancakes", đáp án xen kẽ; đếm động từ lệch (khai read 10, go 3, draw 8, play 11; thực 7, 2, 6, 9; vẫn trong giới hạn); danh sách từ ngoài chỉ có apple, bread, parent, pen, thiếu dinner, television, evening, homework, music, room, father.
- **Task 5:** cột "Saturdays | Sunday, 3 p.m." thay cho nhãn Usually/Now.

## 3. v0.7 đến v0.9: sửa được gì, còn gì, phát sinh gì

### 3.1 Sửa có hiệu quả (cả ba phiếu, trừ khi ghi)
| Lỗi lần 5 | v0.9 |
|---|---|
| G4 viết sẵn câu hoàn chỉnh (Flash) | Hết (ba phiếu) |
| Trợ động từ "(do)", "(be)" trong ngoặc (Sol) | Hết (ba phiếu); còn "(not V)" ở cả ba, chấp nhận được |
| Haiku đổi chỉ dẫn Task 4 | Hết |
| Vế chọn G2 chỉ là đoạn câu (Haiku) | Hết, cả ba là câu đáp hoàn chỉnh |
| Lời kể đặt trong lượt `Tên:` (Flash) | Hết ở Task 2; còn "Mia and Tom:" một chỗ |
| Cảnh đồ vật gây mơ hồ | Không còn câu nào mơ hồ vì cảnh đồ vật |
| Đầu ra phải sửa tay để nạp (v0.7) | Cả ba nạp thẳng, không lỗi; Flash đủ phiếu |
| Tỉ lệ (b) trong câu "đang làm" | Đạt ở cả ba (Flash 3/4, Haiku 2/4 ở Task 3 và 1/1 ở Task 4, Sol 2/3) |

### 3.2 Chưa hết hoặc nặng thêm
1. **Ví dụ 1e: tăng số mẫu không giải quyết khuôn.** Lần 5 lỗi là chép 3 mẫu; lần 6 Flash chép đủ 6/8 mẫu, Haiku chép 2 mẫu và lặp, chỉ Sol viết tình huống mới. Quy tắc "mỗi kiểu một lần, ít nhất 4 kiểu" được viết trong tài liệu nhưng không có trong REPORT, nên AI không tự kiểm (Haiku vi phạm mà không biết).
2. **Task 2 (G2-B) vẫn mirror câu hỏi.** Hết đáp án dựa vào đuôi -ing, nhưng còn dựa vào dạng câu hỏi ("What does" / "What is ... doing"); câu tình huống thêm vào không mang thông tin mới. Lỗi tài liệu (S5 mục 1e cho phép, S2 đòi ngược lại).
3. **Từ khóa:** Task 3 vẫn có 2 đến 4 trong 6 câu dựa "every day / on Sundays / never / right now". Quy tắc 30% không đòi nhiều hơn.
4. **Hội thoại gượng:** Sol 3, Flash 2, Haiku 1. Mỗi lần có một số, loại khác nhau.
5. **REPORT không đáng tin tuyệt đối:** Flash khai "None" và đếm sai; cần máy kiểm (bước 4).

### 3.3 Do v0.9 gây ra hoặc lộ ra
- **K3.1 + TF-G1-B:** "Chủ nhật thường đến nhà bà" khiến Haiku tạo việc chung thứ hai cho hàng They (c).
- **TF-G4-A và file 0 mâu thuẫn:** TF viết khung `<Tên> ____.`; file 0 viết `<Tên> … <He/She> …`. Flash, Sol theo file 0; Haiku theo TF (c).
- **Tên dạng G2:** file 0 chỉ có `Dạng: chọn A/B/C`; Haiku viết `chọn A/B` (d, nhẹ; bộ đọc chịu được).

## 4. Đánh giá bộ file nạp (thang 10)
| File | v0.7 | v0.9 | Lý do |
|---|---|---|---|
| Kiến thức | 8 | 8 | "pancakes" bị Flash vi phạm; K3.1 có câu gây lỗi Task 1 ở Haiku. Từ vựng và nhân vật được tuân thủ |
| Trình tự lesson | 8 | 8 | 1e có hiệu quả với Sol, phản tác dụng với Flash (chép) và Haiku (lặp, hai kiểu). Mục 1e còn cho G2-B hỏi "What is X doing?" nên G2 vẫn mirror |
| Task Format | 8 | 8,3 | G3b, G4 chạy đúng ở cả ba (hết lỗi lần 5); TF-G1-B thiếu cấm việc chung thứ hai; TF-G4-A khác file 0 |
| Chỉ dẫn và định dạng đầu ra | 8,5 | 8,5 | Cả ba nạp được thẳng (tốt hơn v0.7 phải sửa tay); chưa kiểm được điều "hai khối mã" |
| **Cả bộ** | **8,2** | **8,3** | Phiếu tốt nhất gần dùng được (4 câu). Lỗi còn lại không còn là sai đáp án mà là mirror, lặp và chép mẫu |

## 5. Đề xuất sửa lên v1.0 (chờ duyệt)
1. **TF-G1-B:** hàng They chỉ có đúng một việc thường làm chung (ăn trưa); không đưa "đến nhà bà" thành việc chung trong văn bản nguồn.
2. **TF-G2-B và S5 mục 1e:** tối đa 2 câu dùng "What does X do?" / "What is X doing?"; còn lại hỏi kiểu không lộ thì (sở thích, lời mời, "Can I...?", "Why...?"). Câu tình huống phải bổ sung thông tin, không lặp điều câu hỏi sắp hỏi (S5 mục 1b). Cấm đáp án xen kẽ đều, kiểm bằng máy.
3. **S5 mục 1e:** bỏ câu hội thoại hoàn chỉnh khỏi ví dụ, thay bằng mô tả tình huống (ai nói gì với mục đích gì); chỉ giữ một ví dụ ngắn. Đưa vào REPORT mục 2 dòng bắt buộc: kiểu (b) của từng câu "đang làm".
4. **S5 mục 8:** thêm tối đa 2 lần cho cụm "Sorry, I can't" và cho cùng một câu hỏi mở đầu trên cả phiếu; mỗi Task chỉ một lượt "Can I/you ...?".
5. **TF-G3b-A:** mở rộng cấm chép dạng: lượt liền trước không chứa động từ trong ngoặc ở bất kỳ dạng (Sol Task 4 câu 2); câu hỏi không có từ thời gian và không có cảnh bị cấm (Haiku Task 4 câu 5).
6. **File 0 và TF-G4-A:** thống nhất khung `<Tên> … <He/She> …`; ghi rõ `Dạng` của G2-B là `chọn A/B/C`.
7. **Cho bước 4 (máy kiểm):** đáp án xen kẽ, động từ stative (has, have, like), từ cấm (pancakes), lặp cụm hội thoại, lượt thoại hai người ("Mia and Tom:"), đếm động từ và danh sách từ ngoài (thay REPORT tự khai), tỉ lệ (a)/(b). Việc cần người: câu hai đáp án.

## 6. Việc cần người dùng quyết
1. Duyệt đề xuất mục 5 để mình làm v1.0 (chưa sửa gì trong bộ file).
2. Cách sao chép phiếu từ ba giao diện: file Flash còn sót "```text:" và "```eof", Haiku gửi tách hai file. Nếu muốn mình chấm điều "đúng hai khối mã", cần bản chép nguyên từ khối mã.
3. Có muốn lưu ba phiếu vào `thu-nghiem/phieu-lan-6/` và file này vào nhánh không (mình chưa có quyền push; cần kết nối repo có quyền push).
