# Đánh giá lần 7: ba phiếu sinh từ bộ file lesson v1.0, so với v0.9

Ngày 29/10/2026. Phiếu: Gemini 3.8 Flash, Claude 5.5 Haiku, Sol 6.0. Chấm theo `RUBRIC_KIEM_v0.md`, bốn lớp lỗi (a: theo đúng ba tài liệu; b: lỗi nội dung; c: lỗi do tài liệu; d: lỗi do AI) và các quy tắc mới của v1.0 (S5 mục 1c, 1d, 1e, 1g, 8). Nạp bằng `kiem-md.cjs`; đếm động từ, số lượt "Can I/you", dãy đáp án bằng script; đáp án từng câu kiểm tay. Phiếu gốc ở `phieu-lan-7/`.

**Giới hạn:** (1) Một lần chạy mỗi model; chênh dưới 0,3 điểm là nhiễu. (2) Flash còn mất rào ```markdown (file bắt đầu thẳng bằng `# PHIẾU`), Sol có đủ hai khối mã. (3) File Haiku không theo định dạng file 0; mình không biết bạn đã dán đủ file 0 cho Haiku chưa. Nếu thiếu thì điểm định dạng của Haiku không tính và nên chạy lại.

## 1. Kết quả
| | Flash 3.8 | Haiku 5.5 | Sol 6.0 |
|---|---|---|---|
| v0.9 (lần 6) | 7,0 | 7,2 | 8,2 |
| **v1.0 (lần 7)** | **6,8** | **6,0** (chỉ nội dung: 6,8) | **8,3** |
| Nạp vào Editor | Được; 0 ghi chú, 0 tràn, 0 lỗi | **Không nạp được**: "MD không có dòng ## Task" | Được; 0 ghi chú, 0 tràn, 0 lỗi |
| Đáp án sai | 0 | 0 | 0 |
| Câu hai đáp án hoặc hỏng | **2** (Task 3 câu 2 hỏng; Task 2 câu 5 vế A sai ngữ pháp) | **1** (Task 4 câu 5) | 0 |
| Câu gượng | 2 | 3 | 4 |
| Vi phạm giới hạn số (đếm bằng script) | kiểu (3) "Where is..." 3 lần | play 5 và read 6 trong một Task (tối đa 4); Task 2 hai lượt "Can" | Task 2 và Task 4 mỗi Task hai lượt "Can"; Task 3 có 4 câu hội thoại (tối đa 3) |
| Ước tính sửa tay | 6 đến 7 câu | trên 10 (cả định dạng) | 5 câu |
| REPORT | Sai: "None" ở mục 4, 5; tiếng Việt | Ước tính, tự khai vi phạm nhưng không sửa; tiếng Việt | Đếm động từ khớp script từng ô; khai đúng chỗ lệch; có một từ không có trong phiếu ("weekend") |

Trung bình ba model: v0.9 7,5; v1.0 7,0. Phiếu tốt nhất giữ nguyên (8,2 đến 8,3); phiếu thấp nhất giảm.

## 2. Từng phiếu

### Sol 6.0 (8,3)
- **Đúng:** định dạng hoàn hảo (hai khối mã; NOTES, REPORT tiếng Anh). Task 1: mỗi dòng nguồn tự nêu ngày và giờ, hàng They chỉ có ăn trưa. Task 4 không còn chép dạng (lỗi v0.9 đã hết), không câu trần. Hết "Sorry, I can't" lặp (0 lần). Sáu kiểu (b) khác nhau, không chép câu quen thuộc. Dãy đáp án Task 2 B A B B A A, hai câu "What does X do?" (đúng giới hạn). Đếm động từ khớp script từng ô (11, 10, 3, 3, 1, 7, 6, 8). Task 5 sạch. Không đáp án sai, không câu mơ hồ.
- **Vi phạm giới hạn số (d, vừa):** Task 2 có hai lượt "Can I speak..." và "Can you come..." (tối đa 1); Task 4 có "can you help me" và "Can you see" (tối đa 1); Task 3 có 4 hội thoại (câu 1, 3, 5, 6; tối đa 3). Sol tự khai chỗ hội thoại ở mục 5 nhưng không sửa. "Nhìn thấy" (kiểu 5) dùng ở Task 3 câu 5 và Task 4 câu 3, nhưng Sol phân câu 5 là (a).
- **Gượng:** Task 2 câu 3 ("What's your sister's favourite book?" — "She reads a story." không trả lời câu hỏi); Task 2 câu 4 (cảnh Tom đang ở trong vườn cùng Mia nhưng hỏi "Can you come and play with me?"); Task 3 câu 6 ("What do you and Tom do after school?" hỏi Dad); Task 3 câu 1 ("Who is making that music?" lộ "is making").
- **REPORT:** từ ngoài danh sách có "weekend" (không có trong phiếu); thiếu "speak".

### Flash 3.8 (6,8)
- **Tiến bộ:** Task 1 đúng (mỗi dòng Thứ Bảy tự nêu ngày; hàng They chỉ ăn trưa; không việc chung khác). Không chép câu mẫu của 1e (lỗi lớn lần 6 đã hết). Task 4 là bản tốt nhất của ba phiếu (không chép dạng, không câu trần, kiểu (6), (3) đúng). Dãy đáp án B A A B A B. G4 đúng. Không dùng "pancakes", "Mia and Tom:".
- **Task 3 câu 2 hỏng (b, bắt buộc):** "Mum: Where is Dad? Mia: He is in the garden. He {is washing|*is painting} the wall." Hai vế cùng thì, khác động từ; không có dữ kiện nào chọn "painting" hơn "washing". Vi phạm TF-G3a-A (hai vế chỉ khác thì). REPORT còn viết "is washing sai ngữ cảnh".
- **Task 2 câu 5 (b):** "do you want to draw with me?" dùng "want" (K4 cấm) và vế A "I watch television right now" sai ngữ pháp, chỉ loại được nhờ "right now". Task 2 câu 0, 2, 4 vẫn phản chiếu câu hỏi và có từ thời gian ("every week", "on Sunday mornings", "after school"); chỉ câu 3 và 5 không lộ thì (1g cần ít nhất 3).
- **Kiểu (3) "hỏi vị trí" ba lần (d):** Task 2 câu 1, Task 3 câu 2, Task 4 câu 4 (mỗi kiểu tối đa 1). REPORT khai "5 kiểu" và liệt kê sáu số.
- **Task 3 câu 6:** "Mia: Listen! Who is in the music room? Tom: Mia's brother plays / is playing" Tom gọi Mia bằng tên của chính Mia. Flash còn tính câu 6 và câu 1 Task 2 vào nhóm 30% dù có "Listen!" và "Look outside!" (từ chỉ thời gian theo S5 mục 0); số thật của Task 3 là 1/6 (câu 4), hoặc 2/6 nếu tính cả câu 2 đã hỏng.
- **Task 5:** thêm "in the living room" cho Ben (K3.1 không có; vi phạm S5 mục 7) và nhận nó là đáp án chấp nhận.
- **REPORT (d):** NOTES và REPORT viết tiếng Việt (file 0 yêu cầu tiếng Anh); mục 4 và 5 ghi "None" nhưng có "want", kiểu (3) ba lần, apple, wall, paint, wash, walk, test, upstairs, bedroom, pool chưa liệt kê; đếm động từ lệch (khai swim 9, draw 7, thực 8 và 5); còn đưa "do" vào bảng động từ.

### Haiku 5.5 (6,0; chỉ nội dung 6,8)
- **Định dạng (d hoặc thiếu file):** phiếu là bản "PHẦN 1 / 2 / 3" với `**Instruction:**`, `[A / B]`, đáp án gộp ở Phần 2; không có `## Task:`, không có khối mã. Không nạp được.
- **Nội dung tốt:** Task 1 đúng; Task 5 giàn giáo đúng; Task 6 ví dụ đúng; không đáp án sai. Task 2 phần lớn là câu đáp hoàn chỉnh.
- **Task 4 câu 5 hai đáp án (b):** "Who is that in the kitchen? It is Dad. He ___ (play) the guitar." "plays" (nói về thói quen của Dad) và "is playing" đều tự nhiên. Task 4 chỉ 1/5 câu đạt 30%; Haiku khai "không đạt" rồi vẫn nộp, trong khi hai model kia đạt. Lệnh trong file 0 là sửa trước khi nộp.
- **Task 3 thiếu một câu hỏi** (khai trong REPORT). "Not now, Mum" chứa "now", nên câu 2 không phải câu xác định bằng nghĩa; số thật của Task 3 là 1/6, không phải 2/6 như khai.
- **Vi phạm giới hạn số:** Task 2 "play" 5 lần, Task 3 "read" 6 lần (tối đa 4); cả phiếu play 12, read 12 (đúng trần), watch 0. REPORT ghi "ước tính, chưa đếm máy": play ~5, read ~5. Task 2 có hai lượt "Can". Haiku khai kiểu (1) dùng hai lần và không sửa.
- **Lặp:** câu ví dụ Task 4 câu 0 trùng nguyên văn câu 0 của Task 3 ("Mia ___ (read) books on Sundays" / "Mia [reads / is reading] books on Sundays"); "play football after school" xuất hiện ở Task 2 câu 2, Task 3 câu 1, Task 4 câu 1.
- **Nhân vật:** Task 2 thêm "Leo" và "Anna" (G2 chỉ dùng Tom, Mia và người thân).
- **Task 1 ghi chú:** "chấp nhận plays football" (ngược TF-G1-B: không tân ngữ).
- **REPORT:** tiếng Việt; mục 4 chứa ghi chú nháp ("đã thay bằng 'draw'"); mục 5 tự liệt kê vi phạm chưa sửa.

## 3. v0.9 đến v1.0: sửa được gì, còn gì, phát sinh gì

### 3.1 Sửa có hiệu quả
| Lỗi lần 6 | v1.0 |
|---|---|
| Task 1: hàng They có hai đáp án (Haiku, do K3.1) | Hết cả ba |
| Chép nguyên văn ví dụ 1e (Flash 6/6) | Hết (không phiếu nào chép) |
| "Sorry, I can't" lặp ba lần (Haiku) | Hết (Flash 0, Haiku 1, Sol 0) |
| Chép dạng ở Task 4 (Sol) | Hết ở cả ba |
| Câu trần (Haiku Task 4 câu 5) | Hết ở Flash và Sol; Haiku còn một câu gần tương tự |
| Đáp án Task 2 xen kẽ (Flash) | Hết |
| "has" (stative), "pancakes", "Mia and Tom:" | "has", "pancakes", "Mia and Tom:" hết; còn "want" (Flash) |
| G4 nhãn cột, khung `…` | Đúng ở cả ba |
| Câu trùng câu minh họa trong tài liệu (REPORT mục 6) | Không phiếu nào trùng; cả ba khai "None" đúng |

### 3.2 Chưa hết hoặc phát sinh
1. **Giới hạn số AI không tự đếm được.** Hai lượt "Can" mỗi Task, kiểu (b) tối đa một lần, tối đa 3 hội thoại, giới hạn động từ mỗi Task: lần 7 cả ba phiếu đều vi phạm ít nhất một điều (Sol: Can ×2 ở hai Task, 4 hội thoại; Flash: kiểu (3) ×3; Haiku: play 5, read 6, Can ×2), dù REPORT bắt tự đếm. Sol đếm động từ chính xác từng ô nhưng vẫn không sửa câu vi phạm; Flash và Haiku đếm sai hoặc ước tính. Thêm quy tắc số vào tài liệu không làm AI tuân thủ.
2. **Mâu thuẫn do mình viết ở S5 mục 1d:** v1.0 cấm lượt liền trước chứa động từ ở bất kỳ dạng nào, nhưng câu hỏi yes/no của G2-B ("Do you play tennis here every week?") buộc phải chứa động từ. Kết quả: Flash Task 2 câu 0 và 4, Haiku Task 2 câu 4 đều phản chiếu câu hỏi. Quy tắc 1g chỉ giới hạn "What does/is... doing?", nên mirror chuyển sang câu yes/no (c).
3. **Câu hỏi không lộ thì ở G2 sinh ra câu gượng:** Sol "favourite book"; Flash "do you want to draw" và Tom "I do my homework" không từ chối rõ. Các câu không lộ thì phải có đáp án khẳng định đúng nghĩa, nhưng tài liệu không nói rõ.
4. **Tài liệu mâu thuẫn:** TF-G3a-A đòi 2 câu đơn nhưng S5 1e đòi ít nhất nửa câu "đang làm" là hội thoại (b). Sol nêu đúng chỗ này ở REPORT mục 5 (c).
5. **Cảnh mâu thuẫn lời thoại** (Sol Task 2 câu 4) và **bịa dữ kiện** (Flash "living room") chưa có quy tắc kiểm.
6. **REPORT:** Flash và Haiku viết tiếng Việt dù file 0 yêu cầu tiếng Anh; Flash khai "None" sai ở ba mục; Haiku nộp phiếu kèm vi phạm đã biết.
7. **Định dạng đầu ra:** một trong ba phiếu (Haiku) không nạp được. Lần 6 ba phiếu đều nạp được.

## 4. Đánh giá bộ file nạp (thang 10)
| File | v0.9 | v1.0 | Lý do |
|---|---|---|---|
| Kiến thức | 8 | 8,3 | K3.1 sửa có hiệu quả (hết lỗi Task 1); Flash vẫn dùng "want" dù K4 liệt kê rõ |
| Trình tự lesson | 8 | 7,8 | Viết lại 1e hết chép mẫu và lặp "Sorry"; nhưng 1d mâu thuẫn với G2-B, các giới hạn số không được tuân thủ, và tài liệu mâu thuẫn ở thành phần Task 3 |
| Task Format | 8,3 | 8,3 | G3b-A, G4-A đúng ở cả ba; G3a-A chưa ép "hai vế cùng một động từ" |
| Chỉ dẫn và định dạng đầu ra | 8,5 | 8 | Sol hoàn hảo; Flash lệch ngôn ngữ REPORT; Haiku không nạp được |
| **Cả bộ** | **8,3** | **8,1** | Hai lỗi lớn của lần 6 (Task 1, chép mẫu) hết; thêm giới hạn số và mâu thuẫn 1d làm phiếu trung bình không tốt hơn. Nhiễu một lần chạy lớn |

## 5. Đề xuất cho v1.1 (chờ duyệt)
1. **Làm máy kiểm ngay (phần việc của bước 4):** `kiem-phieu.cjs` đọc MD đã nạp và in: số lần động từ chính theo Task và cả phiếu; số lượt mở đầu "Can I/you" mỗi Task; số "Sorry, I can't"; số câu hội thoại; dãy đáp án Task 2 và vị trí đúng Task 3; từ stative và từ cấm (has, have, like, love, know, want, need, pancakes); lượt thoại hai người; Ben và Lucy ở G2 đến G3b; câu hỏi mở đầu trùng; câu ví dụ trùng giữa các Task; số câu "đạt 30%" theo từ chỉ thời gian ở mục 0. Gỡ các mục đếm này khỏi REPORT của AI (mục 3 và một phần mục 2), để AI chỉ khai điều máy không đo được (kiểu (b), mâu thuẫn quy tắc). Đây là sửa lớn nhất vì ba lần chạy liên tiếp AI không tự đếm đúng.
2. **S5 mục 1d:** chỉ áp dụng cho G3a và G3b; với G2-B, câu hỏi yes/no được chứa động từ nhưng tính vào nhóm "câu lộ thì" (tối đa 2 cùng với "What does/is... doing?").
3. **TF-G3a-A:** hai vế dùng cùng một động từ và cùng tân ngữ, chỉ khác thì (Flash "is washing / is painting").
4. **S5 mục 1g:** câu hỏi không lộ thì phải có đáp án khẳng định đúng nghĩa với câu hỏi (cấm "favourite book" rồi đáp "reads a story"); lời mời "come" thì người mời ở nơi khác người được mời (1f).
5. **TF-G3a-A và S5 1e:** thành phần Task 3 tính theo chức năng (khẳng định, phủ định, câu hỏi), không giới hạn số hội thoại; hoặc nâng lên tối đa 4 hội thoại. Chốt một trong hai.
6. **File 0:** thêm dòng đầu "Nếu thiếu một trong bốn file, nói rõ thay vì tự soạn"; nhắc "NOTES và REPORT tiếng Anh" một lần nữa trong mục B; "nếu không đạt 30% thì viết lại; không nộp phiếu còn vi phạm đã biết".
7. **Không thêm quy tắc số nào vào tài liệu cho đến khi có máy kiểm** (quy tắc số nào AI cũng không tự giữ được).

## 6. Việc cần người dùng quyết
1. Duyệt đề xuất mục 5 (đặc biệt mục 1 và 5).
2. Cho mình biết lần chạy Haiku đã dán đủ file 0 chưa; nếu chưa, chạy lại Haiku.
3. Bạn có ưu tiên làm máy kiểm trước, rồi sửa v1.1, hay sửa v1.1 trước?
