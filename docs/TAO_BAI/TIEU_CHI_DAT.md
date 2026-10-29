# Tiêu chí đạt cho bộ file tạo bài (đã chốt ngưỡng B 29/10/2026; model đích cập nhật cho v2.0)

Mục đích: biết khi nào một version bộ file (K, S, TF, file 0) là ĐẠT, để dừng sửa. Không dùng điểm 8,x làm thước đo: điểm là cảm nhận, chênh dưới 0,3 là nhiễu. Dùng số đếm trên phiếu thật.

## 1. Cách chạy mỗi version
- Mỗi model chạy 2 lần, tức 6 phiếu, dùng đúng cùng bộ 4 file, dán đủ.
- Mọi số liệu do người chấm và máy kiểm đếm trên phiếu thật. Không lấy theo REPORT của AI.
- **Từ v2.0: hai model đích là Claude 5.5 Haiku và Claude 5.5 Sonnet** (người dùng chốt 29/10/2026: thử chung, kết luận chọn model sau). Mỗi model chạy riêng, báo kết quả riêng từng model, không gộp trung bình. Flash và Sol không còn trong vòng thử. Trước v2.0 (v1.1 đến v1.5) model đích là Haiku, các model khác chỉ theo dõi.
- Chỉ dùng kênh chatbot, dán đủ bốn file; không chia theo bước (ví dụ Sonnet dựng dàn ý, Haiku tạo Task), vì cách đó không thử được qua chatbot.

## 2. Tiêu chí đạt cho một phiếu
| Nhóm | Điều kiện | Đo bằng |
|---|---|---|
| A. Nạp và đáp án (bắt buộc) | Dán nguyên phản hồi vào Editor thì nạp được, đáp án khớp với khi chỉ dán khối markdown. 0 đáp án khóa sai. 0 câu hỏng (thiếu đáp án hoặc dấu `*`, chữ rác, lựa chọn sai ngữ pháp ngoài ý đồ). 0 câu có hai đáp án đúng. | Editor (`impRead`), kiểm tay từng câu |
| B. Mục tiêu dạy | Mỗi Task G2, G3a, G3b có ít nhất **20%** số câu (người dùng chốt, trước là 30%) chỉ làm được khi hiểu nghĩa (không nhờ từ chỉ thời gian trong câu hoặc trong lựa chọn). | Đếm lại, không tin REPORT |
| C. Công sửa tay | Không quá 3 câu phải sửa trước khi phát cho học sinh (tính cả câu gượng, câu trùng mẫu). | Đếm tay |
| D. Giới hạn số | Không quá 1 vi phạm trong: số lần mỗi động từ, lượt "Can I/you" mỗi Task, số câu hỏi "lộ thì" ở G2-B, dãy đáp án (rải đủ vị trí, không lặp chu kỳ, không ba liền), số lựa chọn mỗi câu (đúng 3), số loại câu. | Máy kiểm `cong-cu/kiem-phieu.cjs` (đã có từ 29/10: `node cong-cu/kiem-phieu.cjs <file phản hồi nguyên>`; thoát mã 1 nếu có LỖI) |

## 3. Version đạt khi
1. Mỗi model đích (Haiku, Sonnet) đạt ngưỡng đã chốt: 3 trên 4 lần chạy qua A, B, C, D.
2. **Từ v2.0, Trình tự và Task Format cố định cho cả chuyên đề Grammar; chỉ file Kiến thức đổi theo bài.** Phép thử bắt buộc: chạy ít nhất hai bài khác bản chất (hiện: Daily Routines, đối lập hai thì; Comparatives, so sánh hơn và so sánh nhất), giữ nguyên Trình tự và Task Format từng byte, chỉ thay file Kiến thức (và cấu hình máy kiểm `kiem-cau-hinh.json` của bài). Một version đạt khi cả hai bài đều đạt ngưỡng ở mỗi model đích.
3. Đạt rồi thì đóng băng làm bộ chuẩn của chuyên đề Grammar; chuyên đề khác (Reading, Listening, Vocabulary) làm riêng Trình tự và Task Format.

## 4. Khi không đạt
- **Phân loại mọi lỗi trước khi sửa (từ v2.0):** lỗi do Trình tự/Task Format chung (quy tắc thiếu, mơ hồ hoặc gắn với một bài) hay lỗi do Kiến thức của bài (thiếu dữ kiện, thiếu mục, mục viết mơ hồ). Chỉ sửa Trình tự/Task Format cho lỗi loại đầu. Lỗi chỉ xuất hiện ở một bài thường là Kiến thức thiếu thông tin. Lỗi chỉ xuất hiện ở một model: ghi nhận; ưu tiên không để Haiku tụt khi sửa cho Sonnet.
- Lỗi thuộc nhóm A, B: sửa prompt, nhưng mỗi version chỉ sửa các lỗi đã thấy, nêu rõ quy tắc mới thay cho quy tắc cũ nào (không chỉ thêm).
- Lỗi thuộc nhóm D: ưu tiên sửa máy kiểm hoặc bỏ giới hạn, không bắt AI tự đếm.
- Hai version liên tiếp không giảm số lỗi nhóm A, B: dừng sửa prompt, xem lại thiết kế (ví dụ rút quy tắc, đổi cách chia Task).

## 5. Áp thử vào v1.1 (một lần chạy, lần 8; ngưỡng B đã đổi sang 20%)
| Model | A | B | C | D | Kết luận |
|---|---|---|---|---|---|
| Sol | đạt | đạt (Task 3: 2/6 = 33%) | đạt (3 câu) | 1 vi phạm (dãy B A C B A C chu kỳ), đạt | có thể đạt, cần chạy lần hai để xác nhận |
| Flash | trượt (Task 3 câu 6 hỏng, câu 5 hai đáp án) | đạt | trượt (7 câu) | trượt (2 vi phạm: Can, câu lộ thì) | không đạt |
| **Haiku (đích)** | đạt | trượt (Task 2 và Task 3: 0%, từ thời gian nằm trong lựa chọn) | trượt (trên 12 câu) | chưa có máy kiểm | **không đạt**; cần v1.2 |

## 6. Đã chốt và còn mở
- Đã chốt: model đích Haiku 5.5; ngưỡng B là 20% (S5 mục 1 trong bộ file cũng đổi từ 30% sang 20% ở v1.2).
- Giả định cần xác nhận: các ngưỡng còn lại (3 câu sửa tay, 1 vi phạm, 2 phiếu mỗi model) giữ như đề xuất.
- Máy kiểm đã làm (29/10): chạy trên phiếu lần 8 cho đúng các lỗi chấm tay (Sol: dãy chu kỳ; Flash: chữ rác, thiếu `*`, Can, câu lộ thì, thiếu rào; Haiku: từ thời gian trong lựa chọn, 0% Task 3 và 4). Máy kiểm bắt nhóm A (một phần) và D; B chỉ tính xấp xỉ bằng danh sách từ thời gian; C (công sửa tay) và nghĩa câu vẫn phải kiểm tay.

## 7. Lịch sử áp dụng
- **v2.0 (29/10/2026): chưa chạy.** Tách nội dung riêng của bài ra khỏi Trình tự và Task Format (xem `BAN_GIAO_PHIEN.md` mục 4b). Bản đạt 3/4 của Haiku (v1.4) không tự chuyển sang v2.0 vì quy tắc đã khái quát; phải chạy lại. Máy kiểm đã đối chiếu: trên 4 phiếu Haiku lần 11, bản mới với cấu hình bài Daily Routines cho kết quả giống hệt bản cũ.
- v1.1 (lần 8): Haiku không đạt. v1.2 (lần 9): 0/4. v1.3 (lần 10): 2/4. **v1.4 (lần 11): 3/4 đạt** (`thu-nghiem/DANH_GIA_AI_NGOAI_LAN_11.md`).
- **Đã chốt (29/10/2026): ngưỡng "3 trên 4" lần chạy là đạt model đích** (thay cho "cả hai phiếu"). Theo đó v1.4 đạt cho Haiku (3/4).
- Bước 3: lesson thứ hai là Grammar khác (Comparatives, `thu-vien/lesson/grammar-movers-comparatives/`); mới có file Kiến thức bản nháp 0.1.
