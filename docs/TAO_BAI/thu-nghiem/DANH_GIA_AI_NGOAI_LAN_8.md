# Đánh giá lần 8: ba phiếu sinh từ bộ file lesson v1.1, so với v1.0

Ngày 29/10/2026. Phiếu: Gemini 3.8 Flash, Claude 5.5 Haiku, Sol 6.0 (`phieu-lan-8/`). Chấm theo rubric, bốn lớp lỗi (a: theo đúng ba tài liệu; b: lỗi nội dung; c: lỗi do tài liệu; d: lỗi do AI), thang 10. Nạp bằng `impRead` của `ws-editor.html` hai cách: dán NGUYÊN phản hồi và chỉ khối markdown; render 3 phiếu bằng Playwright; đếm động từ và lượt "Can" bằng script; đáp án từng câu tự kiểm tay.

**Giới hạn:** một lần chạy mỗi model (chênh dưới 0,3 là nhiễu); mình không biết bạn đã dán đủ 4 file cho mỗi model chưa (cả ba đều có T-notation và `### Task 0` nên có vẻ đủ).

## 1. Kết quả
| | Flash 3.8 | Haiku 5.5 | Sol 6.0 |
|---|---|---|---|
| v1.0 (lần 7) | 6,8 | 6,0 (nội dung 6,8; không nạp được) | 8,3 |
| **v1.1 (lần 8)** | **6,5** | **6,2** | **8,5** |
| Nạp vào Editor, dán nguyên phản hồi | Được | **Được** (v1.0: không) | Được |
| Dán nguyên = chỉ khối markdown (đáp án, ghi chú) | Giống hệt | Giống hệt | Giống hệt |
| Lỗi console / tràn trang | 0 / 0 | 0 / 0 | 0 / 0 |
| Đáp án khóa sai | 0 | 0 | 0 |
| Câu hỏng hoặc hai đáp án | **2** (Task 3 câu 6 hỏng, câu 5 "Who plays/is playing") | 0 | 0 |
| Câu gượng | 4 | 5 | 3 |
| Mỗi câu 3 lựa chọn | Có; 1 câu sai thiết kế (Task 3 câu 1) | Có; Task 3 câu 0 thiếu thì thứ hai | Có, đúng thiết kế cả 12 câu chọn |
| Vi phạm giới hạn số | Task 4 hai lượt "Can you"; Task 2 ba câu hỏi "lộ thì" (tối đa 2) | Task 3 và Task 4 không đạt mục 1 (tự khai, không sửa) | Dãy Task 2 là B A C B A C (chu kỳ) |
| REPORT | Sai: "None" mục 4 và 5; động từ lệch script (ride 1, thực tế 4) | Động từ lệch (read 5, thực tế 7), tự khai vi phạm nhưng không sửa | Đếm động từ khớp script đến từng ô; khai đúng |

Trung bình ba model: v1.0 7,0 → **v1.1 7,1**. Cả bộ file: v1.0 8,1 → **8,2**.

## 2. Từng phiếu

### Sol 6.0 (8,5)
- **Đúng:** định dạng chuẩn (hai khối, T-notes, `### Task 0`); 12 câu chọn đều có 3 lựa chọn đúng thiết kế (hai khác thì, một lỗi dạng: He play, He drawing, She riding, Do your brother ride...); 0 câu hai đáp án; Task 4 đủ ngữ cảnh (câu 1, 4 nghĩa thuần); REPORT đếm động từ khớp script từng ô (tổng play 9, read 7, watch 3, eat 3, go 3, ride 2, swim 4, draw 5).
- **Còn lỗi (c/d, nhẹ):** (1) Task 2 dãy B A C B A C là chu kỳ lặp, học sinh đoán được; (2) Task 2 câu 0 và câu 4 cùng mẫu "What is X's favourite sport?"; câu 1 và 3 cùng mẫu "xin gặp người đang bận"; (3) Task 3 câu 3 viết hoa "Is/Do/Does" sau dấu phẩy ("On Saturdays, Is your brother riding"); (4) Task 3 câu 1 ("She is playing tennis" sau "favourite sport") hơi mơ hồ.
- Ước tính sửa tay: 3 câu.

### Flash 3.8 (6,5)
- **Hỏng (d, nặng):** Task 3 câu 6 chứa luôn suy nghĩ của AI: `___ you ___ (watch)…` rồi "Wait, in Task 3 this is choosing in the sentence:" và một câu `{Do you watch|Are you watching|Do you watching}` KHÔNG có dấu `*` (không có đáp án). Hiện nguyên chữ "Wait" lên phiếu.
- **Lỗi thiết kế 3 lựa chọn:** Task 3 câu 1 `{plays|*rides|ride}`: đổi động từ (plays her bike) và không có vế "is riding", nên không kiểm thì (1h, rule "cùng động từ"). Task 3 câu 5 "Who {is play|plays|*is playing} the guitar?" thì "Who plays the guitar?" cũng đúng (hai đáp án).
- **Gượng:** Task 2 câu 1 ("Can you ride your bike with me now?" đáp "I am riding my bike" không trả lời); câu 2 (cảnh Mum cầm bánh nhưng đáp "Dad is making a cake"); câu 0 (cảnh Tom ở công viên với guitar rồi hỏi sở thích, cảnh dẫn đến "I am playing"); Task 2 có ba câu hỏi lộ thì (câu 3, 4, 5; tối đa 2).
- **Giới hạn số:** Task 4 có "Can you play tennis…" và "can you feed the dog" (tối đa 1 mỗi Task).
- **Định dạng (d):** vẫn thiếu rào ```markdown mở đầu (lần 3 liên tiếp), khối hai mở bằng "```text: **BÁO CÁO**". Nạp vẫn được vì bộ đọc không cần rào.
- **REPORT:** "None" ở mục 4 (từ ngoài danh sách: guitar, zoo, elephant, pancake, bedroom, feed…) và mục 5 (bỏ sót câu hỏng, Can); động từ lệch script.
- **Khóa:** `does not swim / doesn't swim` trong `## Đáp án` thành một chuỗi nguyên (chưa kiểm editor có coi "/" là hai đáp án không).
- Ước tính sửa tay: 7 câu.

### Haiku 5.5 (6,2)
- **Tiến bộ:** nạp được ngay (T-notes, `### Task 0`, hai khối), đáp án đúng, NOTES và REPORT tiếng Anh.
- **Lỗi nội dung chính (d + c):** chuyển sang 3 lựa chọn bằng cách đặt từ chỉ thời gian vào TRONG lựa chọn ("right now" / "on Sundays" / "at the moment"). Cả 5 câu Task 2 chọn đúng chỉ nhờ từ khóa; REPORT vẫn tính 3/5 "nghĩa thuần". Task 3: câu 0 chỉ có lỗi dạng (swims / swim / swimming), không có vế "is swimming" nên không kiểm thì; Task 3 và Task 4 gần như mọi câu có từ chỉ thời gian; Haiku tự khai "needs rewriting" ở hai Task nhưng không viết lại, trái file 0 ("không nộp phiếu còn vi phạm").
- **Gượng:** Task 3 gắn nhãn người nói vào câu một dòng ("Mum: Tom rides his bike on Sundays", "Dad: Mia doesn't swim on Sundays") bốn câu; câu 6 "Listen! She is swimming"; Task 4 câu 3 Dad hỏi Mia "What does Mia do on Sundays?" (hỏi người về chính họ bằng ngôi thứ ba); Task 4 câu 3 lộ đáp án bằng "I read a story". NOTES T4 viết "Accept 'do not swim' only if the sheet is changed" (vô nghĩa).
- **Dãy vị trí đáp án Task 3:** 2 3 1 2 3 1 (chu kỳ).
- **REPORT:** động từ ước tính, lệch script (swim 6 thực tế 8, read 5 thực tế 7).
- Ước tính sửa tay: trên 12 câu (viết lại Task 3, Task 2, ba câu Task 4).

## 3. v1.0 đến v1.1
### Sửa có hiệu quả
1. **Lỗi nạp editor hết.** Cả ba dán nguyên phản hồi vẫn ra cùng đáp án với khối markdown; không ai dùng `Task N:` trong ghi chú; Haiku nạp được. Hết "Dạng: chọn A/B" sai.
2. **3 lựa chọn mỗi câu:** Sol làm đúng toàn bộ, Flash và Haiku đúng ở phần lớn câu. Editor hiển thị a/b/c tốt (mỗi lựa chọn một dòng, không tràn).
3. **Rule 1d (chỉ G3a/G3b), 1f, 1g:** Sol hết câu "hỏi người về chính họ" và "câu hỏi không được đáp"; Flash còn ba câu lộ thì ở Task 2.
4. **Rule 7 (không bịa chi tiết):** hầu như hết, trừ cảnh Mum cầm bánh / Dad làm bánh của Flash.

### Chưa hết hoặc phát sinh
1. **Từ chỉ thời gian chuyển vào lựa chọn** (Haiku): rule 0 chỉ nói về câu hỏi/câu dẫn, không cấm trong lựa chọn.
2. **Thiết kế 1h không được kiểm:** vế thứ hai phải khác thì và cùng động từ (Flash Task 3 câu 1, Haiku Task 3 câu 0).
3. **Dãy đáp án chu kỳ** (BACBAC, 231231) chưa bị cấm.
4. **Rò suy nghĩ vào phiếu / thiếu dấu `*`** (Flash): chưa có điều kiện kiểm.
5. **Rào ```markdown mở đầu** (Flash, 3 lần liên tiếp).
6. **Giới hạn số và REPORT khai sai** vẫn tồn tại (Can, loại câu hỏi lộ thì, đếm động từ): AI không tự đếm được, đúng như dự đoán; chỉ Sol đếm đúng.
7. **Trùng mẫu tình huống** trong cùng phiếu (Sol).

## 4. Đánh giá bộ file nạp (thang 10)
| | v0.9 | v1.0 | v1.1 |
|---|---|---|---|
| Định dạng nạp được | 8 | 6 (một model không nạp) | **9** |
| Nội dung (lỗi nghĩa, hai đáp án) | 8 | 8 | 8 |
| Thiết kế 3 lựa chọn | - | - | 7 (thiếu kiểm vế thứ hai và từ thời gian) |
| Giới hạn số (AI tự đếm) | 6 | 6 | 6 |
| **Tổng** | 8,3 | 8,1 | **8,2** |

## 5. Đề xuất cho v1.2 (chờ duyệt)
1. Rule 0 mở rộng: lựa chọn A/B/C và vế `{}` không chứa từ chỉ thời gian (now, right now, at the moment, on Sundays, every day…); từ này chỉ nằm ở câu hỏi hoặc câu dẫn.
2. Rule 1h thêm: mỗi câu phải có đúng một vế "thì kia" (ví dụ is riding khi đáp là rides), cùng động từ; ghi trong REPORT cho từng câu "đáp án / vế khác thì / vế lỗi dạng".
3. Cấm dãy đáp án và vị trí có chu kỳ (ABCABC, 231231); yêu cầu có ít nhất một lần lặp liền hai chữ.
4. Mục C (tự kiểm) thêm: không có chữ nào ngoài nội dung phiếu (không "Wait", không ghi chú trong câu); mỗi `{}` có đúng một `*`; dòng đầu tiên của phản hồi phải đúng là ```markdown.
5. Mở rộng cấm hỏi người về chính họ bằng ngôi thứ ba sang G3b; không gắn nhãn người nói vào câu một dòng; mỗi mẫu câu hỏi/tình huống chỉ một lần cả phiếu.
6. Khóa đáp án chỉ một dạng chuẩn; biến thể chấp nhận ghi ở NOTES (không dùng `a / b` trong `## Đáp án`), vì chưa rõ editor có tách "/".
7. **Làm máy kiểm `kiem-phieu.cjs`** (khuyên làm ngay): bắt dấu `*` thiếu, chuỗi lạ ("Wait"), từ thời gian trong lựa chọn, dãy chu kỳ, lượt "Can", đếm động từ thật, so khớp REPORT với thật, số lựa chọn mỗi câu. Lần 8 cho thấy 6 trong 7 lỗi còn lại đều máy bắt được; AI chỉ Sol tự đếm đúng.

## 6. Việc cần bạn quyết
1. Duyệt đề xuất 1–6 để làm v1.2; có làm máy kiểm (7) trước không.
2. Hỏi editor: khóa `a / b` trong đáp án có được coi là hai đáp án không? Nếu cần, mình kiểm và chốt cách ghi.
3. Ghi nhận: editor hiện 7 Task vì `### Phần: Write` thành Task riêng (giống v1.0; chưa xác định có phải thiết kế).
