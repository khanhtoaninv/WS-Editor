# Tiêu chí đạt cho bộ file tạo bài (bản đề xuất, chờ duyệt)

Mục đích: biết khi nào một version bộ file (K, S, TF, file 0) là ĐẠT, để dừng sửa. Không dùng điểm 8,x làm thước đo: điểm là cảm nhận, chênh dưới 0,3 là nhiễu. Dùng số đếm trên phiếu thật.

## 1. Cách chạy mỗi version
- Mỗi model chạy 2 lần, tức 6 phiếu, dùng đúng cùng bộ 4 file, dán đủ.
- Mọi số liệu do người chấm và máy kiểm đếm trên phiếu thật. Không lấy theo REPORT của AI.
- Model đích: cần chốt (Sol, hoặc cả ba). Model phụ: các model còn lại.

## 2. Tiêu chí đạt cho một phiếu
| Nhóm | Điều kiện | Đo bằng |
|---|---|---|
| A. Nạp và đáp án (bắt buộc) | Dán nguyên phản hồi vào Editor thì nạp được, đáp án khớp với khi chỉ dán khối markdown. 0 đáp án khóa sai. 0 câu hỏng (thiếu đáp án hoặc dấu `*`, chữ rác, lựa chọn sai ngữ pháp ngoài ý đồ). 0 câu có hai đáp án đúng. | Editor (`impRead`), kiểm tay từng câu |
| B. Mục tiêu dạy | Mỗi Task G2, G3a, G3b có ít nhất 30% số câu chỉ làm được khi hiểu nghĩa (không nhờ từ chỉ thời gian trong câu hoặc trong lựa chọn). | Đếm lại, không tin REPORT |
| C. Công sửa tay | Không quá 3 câu phải sửa trước khi phát cho học sinh (tính cả câu gượng, câu trùng mẫu). | Đếm tay |
| D. Giới hạn số | Không quá 1 vi phạm trong: số lần mỗi động từ, lượt "Can I/you" mỗi Task, số câu hỏi "lộ thì" ở G2-B, dãy đáp án (rải đủ vị trí, không lặp chu kỳ, không ba liền), số lựa chọn mỗi câu (đúng 3), số loại câu. | Máy kiểm `kiem-phieu.cjs` (khi chưa có: script đếm tạm + kiểm tay) |

## 3. Version đạt khi
1. Cả 2 phiếu của model đích đều qua A, B, C, D.
2. Model phụ: qua A cả 2 phiếu và không quá 6 câu sửa tay. Không qua thì ghi "không khuyên dùng", không sửa prompt chỉ vì model đó.
3. Thử thêm lesson thứ hai khác loại (Reading hoặc Vocabulary), chỉ thay 3 file lesson, giữ nguyên file hệ thống; đạt A, B, C, D thì đóng băng làm bộ chuẩn.

## 4. Khi không đạt
- Lỗi thuộc nhóm A, B: sửa prompt, nhưng mỗi version chỉ sửa các lỗi đã thấy, nêu rõ quy tắc mới thay cho quy tắc cũ nào (không chỉ thêm).
- Lỗi thuộc nhóm D: ưu tiên sửa máy kiểm hoặc bỏ giới hạn, không bắt AI tự đếm.
- Hai version liên tiếp không giảm số lỗi nhóm A, B: dừng sửa prompt, xem lại thiết kế (ví dụ rút quy tắc, đổi cách chia Task).

## 5. Áp thử vào v1.1 (một lần chạy, lần 8)
| Model | A | B | C | D | Kết luận |
|---|---|---|---|---|---|
| Sol | đạt | đạt (Task 3: 2/6 = 33%) | đạt (3 câu) | 1 vi phạm (dãy B A C B A C chu kỳ), đạt | có thể đạt, cần chạy lần hai để xác nhận |
| Flash | trượt (Task 3 câu 6 hỏng, câu 5 hai đáp án) | đạt | trượt (7 câu) | trượt (2 vi phạm: Can, câu lộ thì) | không đạt |
| Haiku | đạt | trượt (từ thời gian nằm trong lựa chọn) | trượt (trên 12 câu) | chưa có máy kiểm | không đạt |

## 6. Cần người dùng chốt
1. Model đích: chỉ Sol, hay cả ba?
2. Chấp nhận các ngưỡng: 30%, 3 câu sửa, 1 vi phạm, 2 phiếu mỗi model?
3. Làm máy kiểm `kiem-phieu.cjs` trước khi chạy lần 9?
