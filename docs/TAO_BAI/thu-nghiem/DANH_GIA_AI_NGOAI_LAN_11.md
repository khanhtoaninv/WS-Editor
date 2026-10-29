# Đánh giá lần 11: bốn phiếu Haiku 5.5 sinh từ bộ v1.4

Ngày 29/10/2026. Chấm theo `TIEU_CHI_DAT.md` (model đích Haiku 5.5, ngưỡng B 20%). Máy kiểm `cong-cu/kiem-phieu.cjs` (đã mở rộng danh sách từ thời gian: "Sunday afternoons", "in the winter"...) rồi kiểm tay từng câu. Phiếu thô: `phieu-lan-11/haiku1..4.md`, báo cáo `bao-cao-3.md`, `bao-cao-4.md` (phiếu 3 và 4 được gửi tách khối 2). Dán nguyên phản hồi và chỉ khối markdown ra cùng đáp án ở cả bốn phiếu.

## 1. Kết quả
| | Haiku 1 | Haiku 2 | Haiku 3 | Haiku 4 |
|---|---|---|---|---|
| Nạp (dán nguyên = chỉ khối 1) | Được, giống hệt | Được, giống hệt | Được, giống hệt | Được, giống hệt |
| A. Đáp án sai / hỏng | 0 | 0 | 0 | 0 |
| A. Câu hai đáp án (kiểm tay) | 0 | **2** (T2 câu 2 "It sleeps / is sleeping under the tree" sau "Do you see the dog?"; T3 câu 3 "Dad {doesn't ride / isn't riding} his bike to work" không có tín hiệu) | 0 | 0 |
| B. Task 2 / 3 / 4 (câu không từ thời gian) | 60% / 33% / 40% | 60% / 50% / 40% | 60% / 33% / 40% | 60% / 33% / 40% |
| C. Câu cần sửa tay | khoảng 2 | khoảng 4 | khoảng 2 | khoảng 3 |
| D. Vi phạm (máy kiểm) | 0 | 0 | 0 | 0 |
| **Đạt?** | **Đạt** | Không (A) | **Đạt** | **Đạt** (sát ngưỡng) |

Kết quả: **3/4 phiếu đạt**. Lần 10 (v1.3) là 2/4; lần 9 (v1.2) là 0/4.

## 2. Nhận xét
- **Máy kiểm 0 lỗi ở cả bốn phiếu:** vị trí bắt buộc (Task 2 câu 2 và 4, Task 3 câu 4 và 6, Task 4 câu 1 và 4) đều được theo; hết "Listen!" ở Task 2 câu 4; hết dãy chu kỳ; hết đáp án chép lại câu hỏi; lời của bạn ở Task 5 đều đúng ngữ pháp và sai sự thật; Task 3 đủ 6 câu; hàng mẫu Task 1 luôn là Lucy; khóa dùng ` / ` hợp lệ.
- **Lỗi còn lại là loại máy khó bắt (nghĩa):**
  - Hai đáp án (Haiku 2, 2 câu): thiếu tín hiệu làm vế sai thật sự sai.
  - Task 3 câu 5 ở Haiku 1 và 2: `Is Tom {swims|*swimming|swim}`, chỉ có lỗi dạng, không có vế khác thì (cả hai tự khai trong REPORT).
  - Haiku 4: Task 2 câu 4 ("I can hear a noise… Who is that? / She is drawing a picture": "She" không rõ là ai); Task 4 câu 1 là một lượt thoại đơn có nhãn "Tom:" (trái S5 1f); ba câu Task 3 cùng khuôn "X plays/rides/swims on Saturdays".
  - Đa dạng: Haiku 3 và 4 lặp "Wait!" và khuôn "Tom/Mia + at the moment".
- **REPORT của Haiku:** số liệu tỷ lệ của Haiku 1, 2 khớp máy kiểm (60%, 33%, 40%); khai trung thực các vi phạm; nhưng vẫn ghi "NOT verified" ở phiếu 3, 4 và báo **S5 mục 1 còn hai con số (20% và 30%)**. Đúng: dòng "Nếu không đạt 30%, viết lại câu…" ở S5 mục 1 còn sót, **lỗi của mình** (lần trước chỉ sửa file 0). Đã sửa ở v1.5.

## 3. Kết luận theo `TIEU_CHI_DAT.md`
- Tiêu chí viết: "cả 2 phiếu của model đích qua". Bốn lần chạy này: 3 đạt, 1 không đạt. Nếu coi 4 lần là 4 mẫu độc lập và ngưỡng "3 trên 4" (mình đề xuất, chờ bạn chốt) thì **v1.4 đạt cho Haiku**. Nếu bắt buộc cả bốn đều đạt thì chưa.
- Chưa làm bước 3 của tiêu chí: thử lesson thứ hai khác loại (Reading hoặc Vocabulary).
- Điểm tham khảo (không dùng làm thước đo): Haiku v1.1 6,2; v1.4 khoảng 8 (phiếu đạt).

## 4. Đề xuất
1. Chốt tiêu chí: 3 trên 4 (hoặc 5 trên 6) là đạt. Mình khuyên chọn 3 trên 4, vì chênh giữa các lần chạy vẫn rõ.
2. v1.5 (đã làm, chưa chạy): chỉ sửa số 30% còn sót ở S5 mục 1. Không thêm quy tắc.
3. Không sửa thêm prompt cho lỗi nghĩa còn lại (hai đáp án, vế khác thì, đa dạng): chúng cần người duyệt, đúng như thiết kế "giáo viên sửa tay hoặc tạo lại từng Task".
4. Chuyển sang bước 3 của tiêu chí: lesson thứ hai khác loại, giữ nguyên file hệ thống (file 0, S5 và máy kiểm), chỉ thay ba file lesson.
