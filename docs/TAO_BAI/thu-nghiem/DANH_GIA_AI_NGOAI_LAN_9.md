# Đánh giá lần 9: bốn phiếu Haiku 5.5 sinh từ bộ v1.2

Ngày 29/10/2026. Chấm theo `TIEU_CHI_DAT.md` (model đích Haiku 5.5, ngưỡng B 20%). Công cụ: `cong-cu/kiem-phieu.cjs` (nhóm A một phần, D), kiểm tay từng câu (nghĩa, hai đáp án, gượng). Phiếu thô: `phieu-lan-9/haiku1..4.md` (theo thứ tự bạn gửi: lần 1 hai phiếu, lần 2 hai phiếu).

**Giới hạn:** cả bốn file chỉ có khối 1 (không rào ```, không NOTES, không REPORT). Mình không biết Haiku có sinh khối 2 mà bạn cắt đi hay không. Nếu Haiku bỏ khối 2 thì trái file 0; nếu bạn cắt thì không sao, nhưng mình không kiểm được REPORT.

## 1. Kết quả theo tiêu chí
| | Haiku 1 | Haiku 2 | Haiku 3 | Haiku 4 |
|---|---|---|---|---|
| Nạp vào Editor (khối 1) | Được | Được | Được | Được |
| A. Đáp án sai / hỏng | 0 | 0 | 0 | 0 |
| A. Câu hai đáp án (kiểm tay) | 0 | 0 | 0 | **3** (T3 câu 5 "She is in the garden. She {sings / is singing}"; T4 câu 4 "not eat… at 8 a.m." và câu 5 "ride… at 7 a.m.") |
| B. Task 2 (A/B/C) không từ thời gian | 1/5 = 20% đạt | 1/5 = 20% đạt | 2/5 = 40% đạt | 2/5 = 40% đạt |
| B. Task 3 (chọn trong câu) | **0/6 trượt** | 2/6 = 33% đạt | **0/6 trượt** | 2/6 = 33% đạt (câu 5 mơ hồ, thực tế 1/6) |
| B. Task 4 (điền từ) | **0/5 trượt** | **0/5 trượt** | **0/5 trượt** | **0/5 trượt** |
| C. Số câu phải sửa tay | trên 7 | khoảng 3 | trên 7 | khoảng 6 |
| D. Vi phạm giới hạn số (máy kiểm) | 0 | 0 (play 12, đúng ngưỡng) | 0 | 0 |
| **Đạt?** | Không (B, C) | Không (B ở Task 4) | Không (B, C) | Không (A, B, C) |

Kết luận: **0/4 đạt**. Haiku 2 gần nhất: chỉ trượt Task 4 (0%), khoảng 3 câu sửa.

## 2. Lỗi chung
1. **Task 4 luôn 0% trong cả bốn phiếu.** Mọi câu điền từ là một câu đơn có từ thời gian ("on Saturdays", "every day", "right now", "at 8 a.m."). Spec TF-G3b-A chỉ nói "mỗi câu đủ dữ kiện", không buộc có câu ngữ cảnh. Haiku làm đúng chữ nhưng không đạt mục tiêu dạy. Lỗi c (tài liệu).
2. **Task 3 của Haiku 1 và 3: 0%.** Cùng nguyên nhân: không buộc vị trí câu nghĩa thuần.
3. **Giới hạn số hầu như hết** (Can, động từ, chu kỳ, câu lộ thì): máy kiểm không bắt lỗi nào ở D ngoài ngưỡng play. Quy tắc 20%, dãy chu kỳ và từ thời gian trong lựa chọn đã hiệu quả: không phiếu nào còn từ thời gian trong lựa chọn A/B/C hay vế `{}`.
4. **Vế khác thì còn thiếu** (1h): Task 3 câu 0 ở Haiku 1 và 3 (`{swim|*swims|is swim}`: không có "is swimming"), câu 4 chỉ đổi trợ động từ (`{*Does|Is|Do} Tom play…`).
5. **Câu lặp lại dạng động từ của câu hỏi** (đáp án chép): Haiku 1 (Are you playing… now? Yes, I am playing), Haiku 3 (Who usually makes… Mum makes; Are you riding… now? I am riding). Rule 1d chưa cấm cho câu hỏi G2-B.
6. **Lời của "bạn" ở Task 5 sai ngữ pháp** (Haiku 1, 3, 4: "Ben plays football in the park now") làm học sinh khó biết cần sửa gì.
7. **Câu ví dụ trùng ý** giữa Haiku (Task 3 câu 0 và 2 của Haiku 2 cùng mẫu).

## 3. v1.1 → v1.2 (Haiku)
Hết: từ thời gian trong lựa chọn, dãy chu kỳ, Task 3 câu 0 của v1.1 (chỉ lỗi dạng) giảm, nạp được, đáp án đúng cả 4 phiếu. Còn: B ở Task 4 và Task 3; công sửa tay vẫn 3 đến 7 câu.

## 4. Đề xuất v1.3 (chờ duyệt)
Nguyên tắc rút ra: **Haiku làm đúng quy tắc theo vị trí, không làm đúng quy tắc theo tỷ lệ.** Đổi tất cả ngưỡng thành vị trí cố định.
1. **TF-G3b-A:** câu 1 và câu 4 (và ví dụ 0 tùy) BẮT BUỘC là hội thoại hai lượt hoặc có câu cảnh trước, KHÔNG chứa từ chỉ thời gian ở cả câu cảnh, lượt thoại và câu có chỗ trống; ý nghĩa cho biết thì (kiểu 1e); câu 2, 3, 5 tự do. Không có "at 7 a.m." / "at 8 a.m." trong câu điền từ (dễ hai đáp án).
2. **TF-G3a-A:** câu 4 và câu 6 BẮT BUỘC cùng loại (hội thoại có lượt thoại làm cảnh, không từ thời gian); các câu còn lại tự do. Mỗi câu có đúng một vế "khác thì cùng động từ" (is swimming khi đáp là swims); bỏ kiểu `{Does|Is|Do}` chỉ đổi trợ động từ.
3. **TF-G2-B:** câu hỏi không được chứa dạng -ing hoặc -s giống đáp án đúng (cấm "Are you riding…? Yes, I am riding"); câu 2 và 4 là loại cảnh cho nghĩa (xin gặp bận, hỏi người vắng, nghe tiếng).
4. **TF-G4-A:** lời của bạn ở Task 5 phải đúng ngữ pháp và mô tả sai sự thật (ví dụ "Ben is playing football now." hoặc "Lucy swims at the sports centre on Saturdays."), không dùng "now" với thì hiện tại đơn.
5. **Máy kiểm:** thêm kiểm vị trí bắt buộc (câu 4, 6 Task 3; câu 1, 4 Task 4 không có từ thời gian), kiểm "at <giờ>" trong câu điền từ, kiểm vế khác thì (cùng động từ). Phần mơ hồ hai đáp án vẫn kiểm tay.

## 5. Việc cần bạn quyết
1. Duyệt đề xuất v1.3 (mình khuyên làm: chuyển ngưỡng sang vị trí cố định).
2. Cho mình biết Haiku có sinh NOTES và REPORT không (bạn cắt hay Haiku bỏ). Lần chạy tới nên gửi nguyên phản hồi.
