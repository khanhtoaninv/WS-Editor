# Đánh giá lần 2: ba phiếu từ ba model, sinh từ bộ file lesson v0.4

Ngày 29/10/2026. Phiếu: Claude 5.5 Haiku, Gemini 3.8 Flash, GPT 6.1 Sol. Chưa nạp vào app (mới đánh giá nội dung và hình thức văn bản).

## 1. Điểm từng phiếu (thang 10, theo bốn lớp lỗi)
| | GPT 6.1 Sol | Claude 5.5 Haiku | Gemini 3.8 Flash |
|---|---|---|---|
| Theo đúng định dạng đầu ra | Đúng hoàn toàn | Lệch: dùng tiêu đề markdown, ghi chú và báo cáo bằng tiếng Việt, thêm cột Who ở Task 1 | Gần đúng, bỏ dòng "# PHIẾU", Task 1 chỉ 1 hàng điền |
| Đáp án sai hoặc không xác định | Không sai; còn 3 câu mơ hồ, tự khai | Không sai rõ; còn ~3 câu mơ hồ, chỉ khai 2 | **Có**: Task 4 câu 5 đáp án "is not eating" không có căn cứ trong tình huống; Task 3 câu 3 mơ hồ |
| Ngữ pháp dạy đúng hay sai | Đúng | Đúng | **Sai**: Task 2 câu 1, 3, 7 dùng hiện tại đơn ("Mia sits...", "Mia opens the window...", "Tom holds... He runs...") để chỉ việc đang diễn ra, đáp án Now. Dạy ngược nội dung bài |
| Từ vựng | Khai 25 từ ngoài danh sách, trung thực | Khai ít, lý giải gượng ("friend", "family" bị thay vì không có trong K5) | Báo "None" nhưng dùng milk, cat, sofa, television, cake, dinner, fruit, chair, bark, run, hold, wave, open... Báo cáo sai |
| Trung thực của REPORT | Cao: tự nhận read 14 lần, mơ hồ ở G3a/G3b | Trung bình: tự nhận vài điểm yếu | **Thấp**: "None, none", xác nhận "đã thử mọi phương án" trong khi còn câu mơ hồ |
| Giàn giáo Task 5 | Tốt: bảng ghi động từ, khung "Ben ____ / He ____" | Tốt, nhưng câu hỏi trùng lặp giữa stimulus và items | Có khung "No. Ben ____. He ____." nhưng bảng không dùng cách viết động từ |
| **Điểm** | **7,5** | **6,5** | **4,5** |

## 2. Lỗi cụ thể đáng ghi nhận
GPT: Task 1 lặp câu "Lucy is reading" hai lần và hàng 2 (Lucy) lặp lại ví dụ; Task 2 câu 2, 6 ghi thẳng "do the same thing again and again", học sinh chỉ cần khớp nhãn; Task 3 câu 4 "Does he swim / Is he swimming?" và Task 4 câu 1, 4 mơ hồ; Task 3 câu 5 nhắc lại điều vừa nói ở câu trước; Task 6 ví dụ trùng ở stimulus và item 0.
Haiku: Task 1 tự thêm sự kiện "Grandma makes a pancake"; Task 3 câu 2 "You swim very fast" mơ hồ; Task 4 câu 3 chỉ điền "reading" (đã cho "Is she"), câu 5 "ride / are riding" không đủ căn cứ.
Gemini: ngoài các lỗi ở bảng: Task 3 câu 0 và 5 dựa vào từ "Look!"; Task 1 chỉ 2 ô thay vì 4.

## 3. Lỗi chung của cả ba (đáng chú ý nhất: lỗi của tài liệu, không phải của model)
1. **Task 2 (TF-G2-A) rò rỉ dạng động từ.** Cả ba phiếu đều có 4–5 câu "Now" dùng is + V-ing và các câu "Usually" dùng V-s, nên học sinh chọn đúng chỉ nhờ dạng động từ. Tiêu chí "≥3 câu không có trạng từ thời gian" không chặn được điều này, vì đuôi -ing vẫn lộ đáp án. Ba model đều tự nhận (Haiku nói rõ). Lỗi nằm ở thiết kế TF: câu cho sẵn dạng động từ thì không thể kiểm "hiểu nghĩa".
2. **Câu mơ hồ vẫn còn** dù đã có quy tắc 1b. Hai trong ba model tự khai còn câu mơ hồ, một model báo đã kiểm hết. Mẫu mơ hồ lặp lại: "Is he swimming? / Does he swim?" sau một câu tả cảnh; "She feeds / is feeding it" không có dấu hiệu; "You swim very fast" (khả năng hay đang bơi?). Quy tắc chung chung không đủ; cần chỉ ra mẫu cụ thể.
3. **Đếm động từ.** Phạm vi đếm không rõ: Haiku đếm cả do/doing, GPT đếm cả "Read about..." trong chỉ dẫn. Số tự báo của AI lệch 1–2 so với đếm tay (tôi đếm thô bằng script: Gemini báo read 6, đếm được 8 không tính chỉ dẫn; Haiku báo play 9, đếm được 10). Việc đếm không nên để AI tự làm, nên để máy.
4. **Từ vựng: danh sách đóng hay mở chưa rõ.** Gemini dùng từ tự do và báo "None"; Haiku thay "friend", "family" (cần cho TF-G4/G5) vì không có trong K5. Kiến thức mâu thuẫn với TF.
5. **Task 1 (TF-G1-B) thiếu nhân vật cho 3 hàng.** K3.1 chỉ có Ben, Lucy (và Grandma ít thông tin). Mỗi model xoay một kiểu: thêm Grandma bịa thói quen (Haiku), chỉ 1 hàng (Gemini), lặp Lucy (GPT). TF nên chỉ rõ: hàng mẫu Lucy, hàng 1 Ben, hàng 2 "They" (ăn trưa cùng nhau lúc 12).
6. **Chưa quy định ngôn ngữ của NOTES và REPORT** (Haiku viết tiếng Việt).

## 4. Đánh giá bộ file nạp (thang 10)
| File | Điểm | Lý do |
|---|---|---|
| Kiến thức (v0.4) | 7 | Phạm vi, cảnh, từ cấm rõ và đã tác dụng (không model nào dùng từ cấm). Trừ điểm: danh sách từ mở/đóng chưa rõ, thiếu từ cho lời dẫn TF (friend, family, brother...), giới hạn lặp động từ chưa nói phạm vi đếm |
| Trình tự lesson (v0.4) | 8 | Cấu trúc bước, vai trò, tiêu chí kiểm đều được cả ba model theo đúng. Trừ điểm: quy tắc 1b quá chung; chưa chặn "rò rỉ dạng động từ" ở G2 |
| Task Format (v0.4) | 6,5 | Mã TF được hiểu đúng, số câu và kế hoạch câu được theo đúng. Điểm yếu thật: TF-G2-A rò rỉ dạng động từ; TF-G1-B thiếu nhân vật; TF-G3a/b chưa liệt kê mẫu mơ hồ cần tránh |
| Chỉ dẫn và định dạng đầu ra | 7,5 | Hai trong ba model theo đúng khung; một model lệch nhẹ. Thiếu quy định ngôn ngữ NOTES/REPORT |
| **Cả bộ** | **7** | Đủ để sinh phiếu đúng cấu trúc từ ba model khác nhau. Chưa đủ để sinh phiếu **không cần người sửa**: vẫn còn 2–4 câu mơ hồ mỗi phiếu và lỗi thiết kế G2. So với lần đầu (v0.3, 5 lỗi nội dung mà một model mắc): giảm lỗi về lời dẫn khó và độ dài đáp án, chưa giảm lỗi mơ hồ |

## 5. Đề xuất sửa lên v0.5 (chờ duyệt)
1. TF-G2-A: sửa thiết kế để không rò dạng động từ. Cách 1: câu chỉ tả tình huống, học sinh chọn ngoài câu; cách 2: dùng TF-G2-B/C làm mặc định, G2-A chỉ là phương án phụ. Cần bạn chọn hướng.
2. Thêm danh sách mẫu mơ hồ cần tránh vào Trình tự (S5, 1b) với ví dụ cụ thể.
3. TF-G1-B: chỉ rõ ba hàng (Lucy mẫu, Ben, They).
4. K5: nói rõ "ngoài các từ liệt kê, được dùng từ trong Cambridge Starters/Movers; không dùng từ ngoài hai danh sách"; thêm từ cho lời dẫn; phạm vi đếm động từ loại trừ chỉ dẫn và trợ động từ; việc đếm do máy kiểm.
5. Chỉ dẫn: quy định NOTES và REPORT bằng tiếng Anh.
6. Máy kiểm khi xây hệ thống: đếm động từ, đếm từ ngoài danh sách, tách câu có từ thời gian, vì AI tự đếm lệch.
