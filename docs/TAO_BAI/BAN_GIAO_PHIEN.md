# Bàn giao phiên: module tạo bài (cập nhật cuối phiên 29/10/2026)

Nhánh làm việc: `claude/project-thread-34uc6q` (chưa có PR, chưa gộp vào `main`). App WS Editor không đổi trong phiên này (vẫn v123); toàn bộ việc là tài liệu và thử nghiệm.

## 1. Mục tiêu
Thêm module tạo bài: giáo viên đưa yêu cầu hoặc chọn lesson, AI tạo cả phiếu khớp bố cục của Editor; giáo viên sửa tay hoặc tạo lại từng Task, chất lượng và nhất quán không đổi. Quy trình: (1) Chuẩn bị (từ giáo trình/lesson hoặc bài tự do), (2) Duyệt tổng quan (dàn ý, hồ sơ lesson), (3) Tạo bài rồi vào Editor.

## 2. Thứ tự làm do người dùng quyết
Xây bộ file nạp chuẩn và tiêu chí đánh giá trước, đánh giá từng bước thành thư viện chuẩn, rồi mới xây hệ thống.
- Bước 1 đánh giá quy trình: xong (`BUOC1_DANH_GIA_QUY_TRINH.md`).
- Bước 2 cấu trúc bộ nạp chuẩn: bản nháp xong (`thu-vien/README.md`).
- **Bước 3 hoàn thiện bộ mẫu cho một unit chuẩn: đang làm** (xem mục 4).
- Bước 4 kế hoạch xây hệ thống: chưa bắt đầu, chờ người dùng cho phép.

## 3. Quyết định đã chốt
- Nhóm lesson có 3 file do người dùng soạn ngoài rồi nạp: Kiến thức, Trình tự Lesson, Task Format (TF). TF đi theo từng lesson; TF dùng chung chỉ cho bài tự do.
- Nhóm hệ thống (viết một lần, chưa làm hết): quy tắc viết MD cho AI, TF chung + đối chiếu dạng bài với Q1–Q12, quy tắc hình thức, rubric kiểm, phiếu mẫu đã duyệt.
- Trình tự chung (chuyên mục × cấp độ) chỉ là tham khảo của người soạn, không lưu trong hệ thống. Trình tự gốc: Recognition, Understanding, Application, Creation; mỗi loại phiếu được tách hoặc gộp các bước.
- Mỗi bước có 1–3 TF; máy chọn TF ít dùng gần đây; tạo lại thì giữ TF trừ khi giáo viên đổi.
- Mỗi lần gọi AI chỉ gửi phần file cần thiết; kiểm tra file khi nạp; dàn ý lưu cùng phiếu/gói `.wsp`.
- AI viết mô tả ảnh và kịch bản audio; ảnh và audio sinh ở Editor.
- Quy tắc cần ý đồ theo từng câu phải dựa tài liệu học thuật, mỗi quy tắc gắn nhãn căn cứ [HT]/[ND]/[TN]/[CL] ở `so-can-cu.md`, không để trong file AI đọc. Chưa tìm được nguồn cho "ý đồ câu đầu/giữa/cuối" của Reading/Listening.
- Danh sách từ vựng thử nghiệm: người dùng chấp nhận.

## 4. Thử nghiệm lesson Grammar Movers (mã GRAM-MOVERS-DAILY-01)
Bộ file nạp: `thu-vien/lesson/grammar-movers-daily-routines/` (kien-thuc, trinh-tu-lesson, task-format, so-can-cu) và `thu-vien/he-thong/anh-xa-tf-grammar-movers-sang-app.md`. Bản đóng gói để gửi AI ngoài: `goi-thu/v0.5/` (zip `goi-thu/goi-thu-v0.5.zip`): file 0 chỉ dẫn và định dạng đầu ra, 1 kiến thức, 2 trình tự, 3 task format.

Lịch sử thử:
1. Bản thử đầu (tôi tự sinh, v1, v2 trong `tests/md/sinh-thu-movers-grammar*.md`): lỗi đáp án, từ ngoài danh sách; người dùng chấm.
2. Lần 1 với AI ngoài (v0.4, một model): `thu-nghiem/DANH_GIA_AI_NGOAI_LAN_1.md` (hai file người dùng gửi trùng nhau).
3. Lần 2 (v0.4, ba model GPT 6.1 Sol 7,5, Claude 5.5 Haiku 6,5, Gemini 3.8 Flash 4,5): `thu-nghiem/DANH_GIA_AI_NGOAI_LAN_2.md`. Bộ file chấm 7/10. Lỗi chung: TF-G2-A lộ đáp án qua dạng động từ; câu mơ hồ có hai đáp án; phạm vi đếm động từ không rõ; thiếu nhân vật cho 3 hàng Task 1; AI tự đếm lệch.
4. **v0.5** đã sửa theo lần 2 (đã chạy thử lần 3 với Flash, Haiku, Sol, xem mục 4a): G2 mặc định TF-G2-B (TF-G2-A thành phương án phụ), liệt kê mẫu câu mơ hồ, Task 1 cố định ba hàng (Lucy mẫu, Ben, They), từ vựng mở theo Cambridge Starters/Movers, đếm động từ không tính chỉ dẫn và trợ động từ, NOTES và REPORT bằng tiếng Anh. (v0.5 đã chạy thử ở lần 3; từ v0.6 đến v0.9 xem mục 4a đến 4c.)

### 4a. Bảng tổng hợp phiên bản và điểm chấm (thang 10)
Cách chấm: rubric `RUBRIC_KIEM_v0.md` và bốn lớp lỗi (a: theo đúng ba tài liệu; b: lỗi nội dung; c: lỗi do tài liệu; d: lỗi do AI). Ba model luôn là Gemini 3.8 Flash, Claude 5.5 Haiku, Sol (GPT; ghi 6.1 ở lần 2, 5.6 ở lần 3, 6.0 từ lần 4).

| Lần | Bộ file | Flash | Haiku | Sol | Cả bộ | Đánh giá |
|---|---|---|---|---|---|---|
| 2 | v0.4 | 4,5 | 6,5 | 7,5 | 7,0 | `thu-nghiem/DANH_GIA_AI_NGOAI_LAN_2.md` |
| 3 | v0.5 | 6,5 | 6,0 | 6,5 | 7,3 | `DANH_GIA_AI_NGOAI_LAN_3.md`, phiếu `phieu-lan-3/` |
| 4 | v0.6 | 6,8 | 7,0 | 7,5 | 7,8 | `DANH_GIA_AI_NGOAI_LAN_4.md`, phiếu `phieu-lan-4/` |
| 5 | v0.7 | 6,5 (tạm) | 7,8 | 8,0 | 8,2 | `DANH_GIA_AI_NGOAI_LAN_5.md`, phiếu `phieu-lan-5/` |
| 6 | v0.8, v0.9 | 7,0 | 7,2 | 8,2 | 8,3 | `DANH_GIA_AI_NGOAI_LAN_6.md`, phiếu `phieu-lan-6/` |
| 7 | v1.0 | 6,8 | 6,0 (nội dung 6,8; không nạp được) | 8,3 | 8,1 | `DANH_GIA_AI_NGOAI_LAN_7.md`, phiếu `phieu-lan-7/` |
| 8 | v1.1 | chưa chạy | chưa chạy | chưa chạy | chưa chạy | chưa có đánh giá |

Ghi chú lần 5: file Flash bị cắt ở giữa Task 6, thiếu REPORT, dòng bị dồn (nguyên nhân chưa rõ, nghi do sao chép từ giao diện chat); điểm 6,5 là tạm, nếu đủ thì khoảng 7,3.

### 4b. Lịch sử từng bản: sửa gì và phát hiện gì
- **v0.5** (`goi-thu/v0.5/`, zip `goi-thu-v0.5.zip`): G2 mặc định TF-G2-B; mẫu câu mơ hồ ở S5 1b; Task 1 ba hàng; từ vựng theo Cambridge; NOTES/REPORT tiếng Anh. Kết quả lần 3: tệ nhất tăng, tốt nhất giảm. Lỗi mới: ô They/Now của TF-G1-B không điền được (K3.1 không có việc chung lúc 3 giờ chiều); quy tắc 30% "không có từ thời gian" bị lách (Sol chép lại dạng động từ câu trước, Haiku nộp dù không đạt); thiếu danh sách Cambridge; định dạng đầu ra drift.
- **v0.6** (`goi-thu/v0.6/`, zip): ô They/Now in sẵn "—", tiêu đề cột kèm định nghĩa; S5 mục 0 định nghĩa từ chỉ thời gian, mục 1 đo thêm "câu liền trước không chứa dạng đáp án", mục 1d cấm chép dạng; Tom/Mia cho G2 đến G3b; ít nhất 4 trong 9 động từ chính mỗi Task; AI chỉ liệt kê từ ngoài danh sách (không gán Starters/Movers); chỉ dẫn đầu ra cấm "see STIMULUS", link, tiêu đề thừa. Kết quả lần 4: hết lỗi lớn của v0.5. Lỗi còn lại: v0.6 tự mâu thuẫn (ví dụ "flour and eggs" ở S5 mục 1 và TF-G3b-A vs mục 1b cấm cảnh chỉ có đồ vật) làm Flash 5 và Haiku 6 câu mơ hồ; danh sách từ thời gian đóng nên bị lách; "What is X doing?" lộ hình thức ở G3; Task 5 lệch ngày (Flash).
- **v0.7** (`goi-thu/v0.7/`, zip): S5 mục 0 mở danh sách thời gian; mục 1e câu "đang làm" ở G3a/G3b cần "at the moment/right now" hoặc lượt thoại chỉ lúc này (không chỉ cảnh đồ vật, không "What is X doing?" ngay trước chỗ chọn); mục 1f quy cách hội thoại; mục 7 truy nguồn dữ kiện (quy tắc chung rút từ lỗi They/Now, cũng ghi ở `thu-vien/README.md` mục 6); mục 8 đa dạng; TF-G2-B vế chọn là câu đáp hoàn chỉnh; TF-G4-A cả hai câu cùng Chủ nhật 3 giờ chiều; đếm động từ tính cả hai vế. Kết quả lần 5: hết cảnh đồ vật gây mơ hồ (còn 1 câu), hết bịa dữ kiện. Lỗi còn lại: ví dụ trong 1e bị chép thành khuôn (câu "đang làm" đơn điệu); lối thoát (a) quá dễ; Flash viết sẵn câu hoàn chỉnh ở Task 5; Sol để trợ động từ trong ngoặc ("(do)", "(be)").
- **v0.8** (`goi-thu/v0.8/`, zip; **chưa chạy thử, đã được v0.9 thay vì định dạng đầu ra cũ**): 1e có 8 kiểu tín hiệu chỉ để minh họa, mỗi kiểu tối đa 1 lần, cả phiếu ít nhất 4 kiểu, ít nhất nửa số câu dùng (b); 1f lời kể đứng riêng; mục 8 tính cả ví dụ; TF-G3a-A khẳng định là câu đơn; TF-G3b-A cấm trợ động từ trong ngoặc; TF-G4-A cấm viết sẵn câu hoàn chỉnh; INSTRUCTION chép nguyên văn từ TF.
- **v0.9** (`goi-thu/v0.9/`, zip `goi-thu-v0.9.zip`; **bản mới nhất, chưa chạy thử với AI**): nội dung K, S, TF giống v0.8 (chỉ đổi số bản). Khác: file chỉ dẫn đầu ra đổi sang MD nạp thẳng được. Người dùng dán phiếu v0.7 (khung `=== TASK ===`) vào Editor thì lỗi vì không có dòng `## Task:` (bộ đọc báo "MD không có dòng ## Task"). Đầu ra mới: hai khối mã, khối `markdown` = phiếu nạp thẳng (cấu trúc theo `docs/QUY_UOC_MD.md`), khối `text` = NOTES + REPORT; mẫu MD cho từng TF; đáp án ở `## Đáp án` hoặc ngay tại chỗ (`{*đúng|sai}`, `=đáp án` trong ô bảng). Các file lesson không nhắc tên Editor (theo yêu cầu người dùng).
- Thư viện chuẩn `thu-vien/lesson/grammar-movers-daily-routines/` luôn bằng bản mới nhất (hiện v1.1). Lưu ý đã sửa: khi làm v0.6 mình ghi đè nhầm file chỉ dẫn trong `goi-thu/v0.5/`, đã khôi phục từ git và khớp với zip v0.5.
- Phát hiện khi thử bộ đọc MD của `ws-editor.html` (đã đưa vào spec v0.9): Task có bảng bỏ lặng lẽ `Bài đọc:` nên chữ nguồn phải để ở `Khối chữ trên:`; bảng tự đánh số hàng nên hàng mẫu mang số 1; `___` ở cuối câu viết bị bỏ gạch nên khung "Ben ____ / He ____" phải viết `Ben … He …` dưới dòng viết; dạng viết tắt tự tương đương, dạng khác nghĩa tương đương ghi sau ` / `.
- Mẫu đầu ra đã kiểm: `thu-nghiem/mau-dau-ra-v0.9.md` (7 Task, 0 ghi chú, 0 cảnh báo tràn trang, 0 lỗi console). Công cụ kiểm: `cong-cu/kiem-md.cjs` (chạy từ gốc repo: `node docs/TAO_BAI/cong-cu/kiem-md.cjs <file> [tiền_tố_ảnh]`; nhận cả bài AI trả về có hai khối mã).

- **Kết quả lần 6 (v0.9):** trung bình ba model 7,5 (v0.7: 7,4); cả bộ 8,3. Hết lỗi lần 5 đã nhắm: G4 viết sẵn câu, trợ động từ trong ngoặc, đổi chỉ dẫn Task 4, vế chọn G2 chỉ là đoạn câu; cả ba phiếu nạp được thẳng vào Editor. Còn lại: ví dụ 1e bị chép (Flash) hoặc lặp (Haiku); G2 mirror câu hỏi; Haiku có hai câu hai đáp án (Task 1 hàng They do K3.1 + TF-G1-B, Task 4 câu 5 câu trần); Sol Task 4 câu 2 chép dạng; TF-G4-A và file 0 mâu thuẫn khung viết.
- **v1.0** (`goi-thu/v1.0/`, zip `goi-thu-v1.0.zip`; **bản mới nhất, chưa chạy thử với AI**; thư viện `thu-vien/lesson/...` bằng v1.0): K3.1 chỉ một việc chung (ăn trưa), "Grandma" của Tom và Mia, K4 liệt kê stative verbs (has, have, like, love, know, want, need) kể cả câu tình huống; S5 mới 1c (câu trần cấm), 1d (không chép dạng, viết thành mục riêng vì trước đó chỉ được nhắc), 1e viết lại (tám kiểu chỉ mô tả, một câu minh họa không được dùng lại, "Sorry, I can't" tối đa 2 lần, mỗi Task tối đa một "Can I/you ...?"), 1f cấm lượt hai người, 1g (G2-B tối đa 2 câu "What does/is ... doing?", ít nhất 3 câu không lộ thì, dãy đáp án không ABABAB), mục 8 thêm câu hỏi mở đầu và tính chung G2/G3, S4 áp nhãn Usually/Now cho bảng G4; TF-G1-B, G2-B, G3a-A, G3b-A, G4-A sửa theo; file 0: `Dạng: chọn A/B/C` cố định, tiêu đề cột G4, REPORT thêm kiểu (a)/(b), "Sorry, I can't", dãy đáp án, loại câu Task 3, mục 6 tự kiểm câu trùng ví dụ; không tính Khung từ khi đếm động từ.

- **Kết quả lần 7 (v1.0):** trung bình ba model 7,0 (v0.9: 7,5); cả bộ 8,1 (v0.9: 8,3). Hết lỗi lần 6 đã nhắm: Task 1 hàng They hai đáp án, chép nguyên văn ví dụ 1e, "Sorry, I can't" lặp, chép dạng Task 4, đáp án xen kẽ. Còn lại và phát sinh: giới hạn số không tự đếm được (Sol Can ×2 ở hai Task, 4 hội thoại; Flash kiểu (3) ×3; Haiku play 5, read 6), S5 1d mâu thuẫn với câu yes/no của G2-B (lỗi do mình viết), câu hỏi không lộ thì sinh câu gượng, Flash Task 3 câu 2 hỏng và dùng "want", Haiku không đúng định dạng file 0 (không nạp được; chưa rõ có dán đủ file 0 không), REPORT của Flash và Haiku viết tiếng Việt.
- **v1.1** (`goi-thu/v1.1/`, zip `goi-thu-v1.1.zip`; **bản mới nhất, chưa chạy thử với AI**; thư viện đã đồng bộ): (1) sửa lỗi nạp: bộ đọc coi mọi thứ sau `## Đáp án` là đáp án, dòng `Task N:` trong NOTES/REPORT ghi đè khóa; nên khối markdown kết thúc bằng `### Task 0`, ghi chú dùng `T1:`, khối 2 không có dòng bắt đầu `#`; thêm mục C tự kiểm định dạng, NOTES/REPORT viết tiếng Anh; thiếu file thì dừng. Đã thử: dán nguyên phản hồi và chỉ khối markdown cho ra cùng kết quả (6 Task, 0 ghi chú, khóa đúng). (2) mỗi câu chọn có BA lựa chọn (hai đúng ngữ pháp khác thì + một lỗi dạng thường gặp; rule S5 1h; đáp án rải ba vị trí). Đã thử bộ đọc và hiển thị 3 lựa chọn (không lỗi console). (3) 7 đề xuất lần 7 trừ máy kiểm: 1d giới hạn ở G3a/G3b, 1g sửa, 1f cảnh không mâu thuẫn hội thoại, rule 7 thêm ví dụ, K4 thêm want/need/like.

### 4c. Câu hỏi còn mở với người dùng
1. Cách sao chép phiếu từ Gemini (phiếu Flash lần 5 bị cắt và dồn dòng); v0.9 dùng khối mã nên có thể hết, chờ kết quả.
2. Có muốn chuyển ba phiếu v0.7 đã nhận sang MD để xem trên Editor không (mình hỏi, chưa làm).
3. Có muốn AI tự gán nhãn Starters/Movers không (cần người dùng gửi danh sách Cambridge 2018; mạng chặn nên mình không tải được; hoặc để máy tra ở bước 4).
4. Mọi đề xuất sửa đã làm đến v1.0 (7 đề xuất của lần 6; đề xuất 7 là danh sách việc cho máy kiểm bước 4, ghi ở `DANH_GIA_AI_NGOAI_LAN_6.md` mục 5, chưa làm). Cách sao chép phiếu từ ba giao diện vẫn chưa rõ (file Flash lần 6 còn sót "```eof").

## 5. Việc tiếp theo
0. Chạy ba model với bộ v1.1 (dán đủ cả 4 file; nhắc Haiku dán đủ file 0) rồi đánh giá lần 8. Đã sẵn sàng.
1. (v1.1 đã áp dụng 7 đề xuất, trừ máy kiểm) Người dùng chọn làm máy kiểm (`kiem-phieu.cjs`) trước hay sửa v1.1 trước. Mình khuyên làm máy kiểm trước: ba lần chạy liên tiếp AI không tự đếm đúng các giới hạn số.
2. Khi bộ file đạt, làm hết nhóm hệ thống (5 mục trong `thu-vien/README.md`) và một lesson loại khác (Reading hoặc Vocabulary) để kiểm tra bộ file nạp có đủ trên loại phiếu thứ hai chưa.
3. Nghiên cứu còn thiếu: toàn văn Field 2018, Barrett 1968, Clymer 1968, Trüb 2022 (chỉ có bản tóm tắt); cơ sở học thuật cho Writing, Speaking, phát âm; ý đồ từng câu Reading/Listening.
4. Bước 4 (kế hoạch xây hệ thống) chỉ làm khi người dùng bảo. Yêu cầu đã biết: trường mô tả ảnh và kịch bản audio, kiểm file khi nạp, chọn TF, nhất quán khi tạo lại, bộ phiếu chuẩn để kiểm hồi quy, ước tính chi phí; máy kiểm đếm động từ (cả hai vế), từ ngoài danh sách, từ chỉ thời gian mở rộng, câu trùng ví dụ trong tài liệu, tỉ lệ tín hiệu (a)/(b), kiểm cú pháp MD (có sẵn `kiem-md.cjs`).

## 6. Cách làm việc (từ CLAUDE.md và người dùng)
Trả lời tiếng Việt, ngắn, thẳng; thảo luận trước, code khi được phép; ghi mọi thông tin mới lên git để phiên sau đủ ngữ cảnh. Người dùng là giáo viên, không phải lập trình viên.

## 7. Lệnh mở phiên mới
"Đọc CLAUDE.md và docs/TAO_BAI/BAN_GIAO_PHIEN.md (nhánh claude/project-thread-34uc6q; mục 4a có bảng phiên bản và điểm chấm, mục 5 là việc tiếp theo), tóm tắt trạng thái ngắn rồi hỏi tôi muốn làm gì. Chưa cần làm gì cả."

Trạng thái cuối phiên 29/10/2026: bộ file mới nhất là v1.0; lần chấm gần nhất là lần 7 (v1.0, bộ file 8,1/10); đề xuất v1.1 chờ duyệt. Nhánh chưa có PR, chưa gộp vào `main`.
