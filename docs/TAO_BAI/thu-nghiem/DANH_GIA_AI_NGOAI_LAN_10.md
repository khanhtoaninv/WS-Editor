# Đánh giá lần 10: bốn phiếu Haiku 5.5 sinh từ bộ v1.3

Ngày 29/10/2026. Chấm theo `TIEU_CHI_DAT.md` (model đích Haiku 5.5, ngưỡng B 20%). Máy kiểm `cong-cu/kiem-phieu.cjs` (đã sửa hai chỗ báo nhầm: "Wait!" trong hội thoại và "Not yet") rồi kiểm tay từng câu. Phiếu thô: `phieu-lan-10/haiku1..4.md` (theo thứ tự bạn gửi).

## 1. Kết quả
| | Haiku 1 | Haiku 2 | Haiku 3 | Haiku 4 |
|---|---|---|---|---|
| Có khối 2 (NOTES, REPORT) | Có | **Không** (chỉ khối 1) | Có | **Không** (chỉ khối 1) |
| Nạp vào Editor | Được | Được | Được | Được |
| A. Đáp án sai / hỏng / hai đáp án | 0 | 0 | 1 câu mơ hồ (T3 câu 5 "He is in the park. He {rides / is riding}") | 0 |
| B. Task 2 / Task 3 / Task 4 (câu không từ thời gian) | 20% / 33% / **0%** | 40% / 33% / 40% | 20% / 40% (chỉ 5 câu) / 60% | 40% / 33% / 40% |
| C. Câu phải sửa tay | trên 7 | khoảng 3 | khoảng 6 | khoảng 3 |
| D. Vi phạm (máy kiểm) | 7: 5 vị trí bắt buộc, Task 4 0%, dãy Task 3 chu kỳ 1 2 3 1 2 3 1 | **1**: Task 2 câu 4 có "Listen!" | 4: Task 2 câu 2 và 4, Task 3 câu 4, thiếu câu 6 | **1**: Task 2 câu 4 có "Listen!" |
| **Đạt?** | Không | **Đạt** (nếu có khối 2) | Không | **Đạt** (nếu có khối 2) |

So với lần 9 (0/4 đạt, Task 4 luôn 0%): **hai phiếu (2 và 4) đạt**, Task 4 đạt 40% ở cả hai.

## 2. Nhận xét
- **Haiku 2 và 4 (đạt):** làm đúng vị trí bắt buộc ở Task 3 (câu 4, 6) và Task 4 (câu 1, 4): hội thoại "Wait!", "Are you ready?", "Can you help me? I'm busy" không có từ thời gian; lời của bạn ở Task 5 đúng ngữ pháp và sai sự thật; đáp án không chép câu hỏi; hết lặp chu kỳ. Một vi phạm chung: Task 2 câu 4 mở bằng "Listen!" (nằm trong danh sách từ thời gian ở S5 mục 0). Khuyết điểm nhỏ: Haiku 2 Task 3 câu 3 `{*swim|swims|swimming}` không có vế khác thì; Haiku 4 lặp mẫu "Are you ready" ở Task 3 và Task 4 và ba câu "X plays/swims on Saturdays" gần nhau.
- **Haiku 1 và 3 (không đạt):** không theo vị trí bắt buộc (Task 4 câu 1, 4 vẫn có "on Mondays", "now"), Haiku 1 dãy chu kỳ, Haiku 3 chỉ có 5 câu ở Task 3 và đổi hàng mẫu Task 1 sang Ben. **REPORT của hai phiếu này ghi "Quota of 30 percent" trong khi v1.3 ghi 20%**, và các lỗi nhắc đến (thiếu câu phủ định/câu hỏi ở Task 3...) khớp bản cũ hơn. Nghi hai lần này không dùng đúng bộ v1.3 (lẫn file cũ), hoặc Haiku nhớ nhầm.
- **Khuyết điểm chung của cả bốn:** khóa Task 4 có thể ghi "a / b" (Haiku 2, 4: `doesn't swim / does not swim`), vẫn chưa rõ editor có tách; Haiku 3 NOTES có câu vô nghĩa ("Accept 'Do | ride' only if the subject is 'Mia'").
- **REPORT** (Haiku 1, 3): đều khai "NOT verified… Needs a human check", tức bỏ qua yêu cầu "không nộp phiếu còn vi phạm"; dù vậy khai đúng các vi phạm chính.

## 3. Kết luận theo `TIEU_CHI_DAT.md`
Điều kiện đạt: cả 2 phiếu của model đích qua A, B, C, D. Trong 4 phiếu, 2 phiếu qua, 2 phiếu trượt: **chưa đạt hẳn**, nhưng tiến bộ rõ: tỷ lệ phiếu đạt 0/4 (v1.2) lên 2/4 (v1.3), và hai phiếu trượt có nghi vấn dùng sai bộ file. Hai điều kiện để chốt:
1. Hai phiếu 2 và 4 có sinh khối 2 (NOTES, REPORT) không? Nếu Haiku bỏ khối 2 thì chưa đạt phần định dạng của file 0.
2. Hai phiếu 1 và 3 có dùng đúng 4 file v1.3 không? (REPORT nhắc 30%.)

## 4. Đề xuất v1.4 (chỉnh nhỏ)
1. Vị trí bắt buộc ghi thêm "kể cả Listen!, Look!, Not now" (mục C 10 và TF-G2-B, G3a-A, G3b-A).
2. Mục C: "Task 3 đúng 6 câu đánh số 1 đến 6 (không tính câu ví dụ 0)"; "hàng mẫu Task 1 luôn là Lucy".
3. Máy kiểm thêm: đếm số câu mỗi Task, hàng mẫu Task 1 là Lucy, khóa có " / " báo lỗi thay vì cảnh báo.
4. Chưa cần đổi gì khác; đừng thêm quy tắc mới.

## 5. Việc cần bạn quyết
1. Trả lời hai câu hỏi ở mục 3.
2. Duyệt v1.4 nhỏ (đề xuất mục 4), rồi chạy Haiku 2 lần, gửi nguyên phản hồi.
3. Khóa "a / b": mình kiểm editor để chốt cách ghi nhé?
