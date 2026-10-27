# Kế hoạch v95+ (27/10/2026, chưa code; bản đầy đủ là Claude Doc "Kế hoạch v95+: căn lề, bảng, Q2, ô chữ")

Thứ tự đề xuất: v95 Q2 gạch cuối câu / dòng kẻ → v96 bảng 2a (số thứ tự ngoài bảng) + 2c (tô nền hàng tiêu đề) → v97 Căn lề Khối text → v98 bảng chọn đáp án (ô tích + chữ) → sau: ảnh trong bảng, ô chữ.

1. **Căn lề Khối text** (G0 hướng dẫn, G2 bài đọc / lời dẫn, G-Text chữ): thuộc tính cấp Task Trái / Giữa / Phải / Hai bên (mặc định Trái) ở mục CĂN LỀ cột phải; gộp công tắc căn chữ cũ của T4 (`layout.align:'justify'`); ghi đè từng khối G-Text; hướng dẫn có Track: lề phải = mép trái chip Track (cần xác nhận); MD `Căn lề chữ:`.
2. **Bảng:** 2a lỗi thật đã tái hiện: Task 10 có dữ liệu cũ `num:false` (hiệu lực Tắt) nhưng nút sáng "Ngoài bảng" nên bấm không đổi → chuẩn hóa dữ liệu, hiện đúng trạng thái. 2b ảnh trong bảng: thêm ảnh chung G1 vào Task bảng chạy được (đã thử Task 11); cần hỏi người dùng muốn ảnh chung hay ảnh trong ô / hàng. 2c công tắc "Tô nền hàng tiêu đề" đã có nhưng mẫu 10/11/12 để `fh:false`; làm công tắc rõ hơn, màu hàng tiêu đề luôn đậm hơn hàng xen kẽ. 2d ô tích + chữ, tích đáp án đúng ở cột trái (`ok:true` trên ô), công tắc "Hiện ô tích", bản giáo viên tô ô đúng, MD `[x]`.
3. **Q2:** hợp nhất thành ba tùy chọn trong panel Dạng câu hỏi: Điểm bắt đầu (từ cuối câu / dòng dưới), Chiều dài (cố định mm / hết dòng), Số hàng (mặc định 1). Dùng lại bộ tính A2 (`a2cfg`: lenMode, lenMm, lines, start) cho Q2; phiếu cũ (A1) hiển thị y như trước. Hiện chỉ có tùy chọn này khi gạch nằm trong câu (attach inline).
4. **Ô chữ:** chưa rõ yêu cầu; đề xuất tự trải nghiệm (tạo Task Q11, nhập lưới, chụp) rồi báo lỗi / thiếu sót.

Câu hỏi chờ người dùng: (1) Track; (2) ảnh chung hay ảnh trong ô bảng; (3) bảng chọn đáp án: mỗi hàng một hay nhiều ô đúng (đề xuất nhiều).
