# Nhận xét đặc tả "Trình xem và làm việc với phiếu" (v1.0, 27/10/2026)

Đã đọc hết 984 dòng. Đặc tả viết chắc tay, có thứ tự, có nghiệm thu. Các điểm dưới đây là chỗ nên chốt **trước khi giao cho AI viết mã**.

## A. Lệch với WS Editor (quan trọng nhất)

1. **Mô hình dữ liệu khác nhau.** Đặc tả có 9 dạng câu và 6 bố cục L1–L6, theo "sản phẩm gốc". WS Editor có Task, 4 kiểu bố cục T, 12 dạng Q, khối G (ảnh chung, bài đọc, khung từ, khối tự do), bảng, ô chữ, nối có tiêu đề cột/vế thừa, điền từ vào đoạn văn, ảnh trong ô bảng. Chuyển sang ViewerData sẽ **mất những gì 9 dạng không chứa** (ô chữ, bảng chọn đáp án, khối tự do, ảnh trong bảng…).
2. **Dàn trang bị làm hai lần.** M2 và M3 bắt trình xem dàn trang lại từ dữ liệu. WS Editor đã dàn và đã đo trang A4 (đó là cả mục đích của app). Dàn lại ở trình xem sẽ ra phiếu **khác** bản đã duyệt trong editor.
   → Đề xuất: xuất **trang đã dàn sẵn** (HTML từ editor), gắn thêm `data-qid` / `data-slot` cho từng chỗ trả lời; trình xem chỉ thêm lớp tương tác lên trên. Bỏ M2, M3 khỏi phần phải viết.
3. Đặc tả tự nói M1–M6 là "tiền đề đã có" (22.0). Với WS Editor thì đúng một nửa: có hiển thị và dàn trang, **chưa có** chuẩn hóa/so khớp đáp án, id câu ổn định cho mọi dạng, cờ vai trò. Cần kiểm các điểm này trước.

## B. Lệch với TeacherResource (có tài khoản)

4. **M15 tự tạo hệ tài khoản riêng**: tên + mã cá nhân 4 ký tự, mã phiên, máy chủ trong bộ nhớ, mất khi tắt. TeacherResource đã có tài khoản giáo viên/học sinh và lớp. Mục 21.8 có nói "lớp dịch vụ thay được", nhưng phần còn lại của M15 (join bằng mã, token giáo viên, tên tự nhập) vẫn viết như tự chủ. Cần viết lại: danh tính, danh sách lớp, lưu lâu dài **đến từ TeacherResource**; trình xem chỉ là giao diện.
5. **Giao diện nhúng thiếu hai chỗ**: (a) nhận trạng thái vào (`initialAnswers`, `result`, `mode: làm | xem | chấm`), (b) báo ra từng thay đổi và khi nộp (`onEvent` có nhưng chưa nêu danh sách sự kiện và nội dung). Không có hai chỗ này thì TeacherResource không lưu được bài làm của học sinh.
6. **M12 lưu bằng localStorage** sẽ mất khi đổi máy hoặc xóa cache. Với tài khoản thật, nét vẽ của giáo viên, ghi chú, ghim nên lưu qua TeacherResource (vẫn cho phép localStorage làm mặc định khi chạy độc lập).
7. **Thiếu kịch bản chính của bạn: học sinh làm bài về nhà/tại lớp rồi giáo viên xem và chấm.** Đặc tả chỉ có (i) tự kiểm không lưu (M11, cần đáp án ở máy giáo viên) và (ii) làm bài theo phiên cả lớp (M15). "Học sinh làm 1 phiếu bất kỳ lúc nào, nộp, giáo viên xem" không có chỗ riêng. Với TeacherResource, đáng làm hơn cả M15.
8. **Chấm ở đâu?** Mục 18.1 cấm đáp án trong tải về của học sinh, nên học sinh không tự kiểm được ngay. Hoặc chấm phía TeacherResource (cần API chấm), hoặc chấp nhận học sinh chỉ thấy kết quả sau khi nộp. Đây là quyết định sản phẩm, không phải kỹ thuật.

## C. Lỗi/rủi ro trong chi tiết

9. **Chuẩn hóa 14.1 làm hỏng dấu gạch nối**: bỏ ký tự ngoài `a-z 0-9 '` và dấu cách nên `twenty-one` thành `twentyone`, khác `twenty one`. Nên đổi gạch nối thành dấu cách trước khi bỏ ký tự. Số, `%`, `$` cũng bị mất.
10. **Chấm `short_answer` bằng "chứa"** (21.5): câu "I do not like cats" chứa "like" nên đúng dù đáp án mẫu là "I like cats". Nên bỏ hoặc để giáo viên chấm tay.
11. `rewrite` bị chấm tự động theo `accepted` ở M15, trong khi M11 nói không tự chấm. Câu viết lại thường có nhiều đáp án đúng; nên gắn cờ "cần giáo viên xác nhận" thay vì chấm sai thẳng.
12. Bản giáo viên/học sinh tách thành **hai tệp** (M13) là hợp khi offline, nhưng với TeacherResource nên là **một mã trình xem + dữ liệu cấp theo vai trò**, tránh hai bản dễ lệch nhau.
13. Bản "độc lập" `file://` (M13) và M15 (cần máy chủ) loại trừ nhau; cần chốt TeacherResource dùng cái nào, nếu không phần nào cũng làm dở.

## D. Phạm vi

14. 15 module, phần lớn là **công cụ trình chiếu** (rèm, đèn rọi, đồng hồ, bảng trắng, bảng nhanh…). Đó là việc giáo viên dạy trên lớp, không phải "tôi và học sinh cùng tương tác trong hệ thống". Nên tách thành: **Lõi** (xuất phiếu có tương tác + làm bài + nộp + giáo viên xem/chấm, nhúng vào TeacherResource) và **Mở rộng** (trình chiếu, bút, công cụ trình bày). Thứ tự GĐ1→GĐ2→GĐ3 trong đặc tả theo lịch sử sản phẩm gốc, không nhất thiết là thứ tự giá trị với bạn.
15. Nên có **một bảng ánh xạ** từ 12 dạng Q của WS Editor sang dạng tương tác, kèm quy tắc dạng chưa hỗ trợ: hiển thị tĩnh, đánh dấu "giáo viên chấm tay", và báo rõ (không im lặng bỏ qua, đúng nguyên tắc của WS Editor).

## E. Điểm tốt nên giữ

Tách đề/khóa ở phía tạo dữ liệu (18.1), hàm thuần dùng chung (18.3), nghiệm thu từng giai đoạn, xáo đáp án cố định theo học sinh (21.4), mã không dễ nhầm, hàng rào "AI không tự quyết" (0.3), JSON trong thẻ script có escape `<`.

## Câu cần bạn chốt (theo thứ tự ảnh hưởng)
1. TeacherResource có API/backend sửa được để lưu bài làm, chấm, trả kết quả không? Hay trình xem phải tự đủ?
2. Kịch bản chính: bài về nhà (làm lúc nào cũng được) hay làm cùng lúc trên lớp (M15)? Hay cả hai?
3. Cho phép học sinh thấy đúng/sai ngay khi làm, hay chỉ sau khi nộp?
4. Nhúng bằng iframe hay component trong cùng trang?
5. Giữ dàn trang của WS Editor (đề xuất) hay để trình xem dàn lại?
