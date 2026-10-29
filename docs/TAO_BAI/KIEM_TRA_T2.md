# Thử tay T2 · Máy kiểm + Hiện đáp án (v126)

Cần một phiếu có chế độ tạo bài: nút **Tạo bài** (T3) → Sinh bài, hoặc nạp một phiếu MD rồi **?** → **Thử chế độ tạo bài cho phiếu này**.
Phiếu thử có sẵn lỗi: dán đoạn MD trong `tests/taobai/test_t2.py` (biến `MD`) vào **+ Phiếu → Từ file / dán**.

| # | Làm | Mong đợi |
|---|---|---|
| 1 | Nhìn cây | Bài có tiêu chí chưa đạt ghi **⚠**, bài ổn ghi **○** |
| 2 | Bấm ⚠ của một bài | Ngăn Duyệt bài mở đúng bài; phần **Kiểm tra · a/b đạt**: tiêu chí chưa đạt mở sẵn kèm lý do (vd "đáp án câu 3 không có trong khung từ"); tiêu chí đạt gập lại "▸ k tiêu chí đạt". Không có điểm số |
| 3 | Đóng ngăn, sửa đúng chỗ lỗi | Ngay sau khi sửa, ⚠ thành ○ (máy kiểm chạy lại mỗi lần sửa) |
| 4 | Khối **Cả phiếu** đầu ngăn | Số trang so với tối đa của Trình tự; câu lặp giữa các bài ("… ở bài 5, 7"); tràn trang |
| 5 | Ngăn đang mở | Câu bị bắt lỗi được **tô vàng** trên trang; đóng ngăn thì hết tô |
| 6 | Cuối ngăn: **Hiện đáp án trên trang** | Đáp án in **màu cam** ngay trên trang: chữ trong chỗ trống / dòng viết, khoanh lựa chọn đúng, đường nối ở bài nối, tô ô T/F, chữ trong ô bảng. Tắt thì về phiếu học sinh. Xuất MD / Gói .wsp không có đáp án cam |
| 7 | Bài viết tự do (Q12), tô chữ (Q9) | Không có tiêu chí "Mỗi câu có đáp án", "Đáp án duy nhất" |

Tiêu chí máy kiểm (đặc tả 6.1): MD đọc được (khi bài do AI viết, T4), đúng dạng Q, đủ số câu theo cấu trúc, mỗi câu có đáp án, đáp án duy nhất kiểm được bằng code (Q4 đúng một `*` mỗi ngoặc; Q8 vế phải không trùng; Q1 có khung từ thì đáp án nằm trong khung; Q5 tỉ lệ đúng / sai không lệch quá: ít nhất 30% mỗi loại), không trùng câu trong bài, không tràn trang. Tiêu chí AI chấm theo rubric: T5.
