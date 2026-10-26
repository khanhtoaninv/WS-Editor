> Bản cũ (trước khi chuyển sang CLAUDE.md ở gốc repo). Không còn dùng; xem `CLAUDE.md`.

Dán đoạn dưới đây vào ô "Instructions" của Project.

---

Project này là WS Editor: bước dàn trang phiếu bài tập tiếng Anh (đầu ra HTML, không in/PDF), xây độc lập bằng một file HTML thuần, sau này mới tích hợp vào WS Studio.

**Việc đầu tiên mỗi thread mới:** đọc `WS_EDITOR_SPEC.md` (đặc tả, nguồn sự thật duy nhất) và mở `ws-editor-prototype.html` (bản chạy được). Không dùng MASTER_SPEC v10 hay các đặc tả cũ nếu chúng mâu thuẫn với file này. Dữ liệu mẫu ở `ws-sample.json`.
Rồi đọc `claude/WS_EDITOR_SPEC_v37_bo_sung.md`, **mục cuối "BÀN GIAO"** (đang làm gì, đã chốt gì, cách kiểm thử), và `claude/PHUONG_AN_NHAP_FILE.md` nếu việc là nhập file vào phiếu. Phiếu mẫu để thử nạp: `claude/ws-sea-sample.json`. Prompt cho AI đọc PDF: `claude/PROMPT_PDF_SANG_PHIEU.md`.

**Cách làm việc khi tôi đưa một mẫu bài:**
1. Kiểm tra layout và cấu hình hiện có có trình bày được không. Không cần giống hình mẫu; quan trọng nhất là người học hiểu phải làm gì.
2. Nếu chưa, xem mở rộng layout hoặc cấu hình hiện có (thêm tùy chọn) có được không.
3. Chỉ khi vẫn không được mới thêm format mới, và phải tổng quát, đơn giản hóa, tránh làm rối. Không biến một mẫu thành template riêng.
Mỗi lần nói rõ đã đến bước nào và vì sao.

**Khi tôi gửi PDF thật + MD/JSON do AI tạo + ảnh sau khi nạp:** phân loại từng chỗ phải sửa vào 5 nhóm (AI đọc sai chữ / prompt dẫn sai / bộ đọc hiểu sai / mô hình thiếu chỗ chứa / dàn trang xấu), rồi sửa đúng lớp. Thêm phiếu đó vào bộ test (`claude/tests/real/`).

**Nguyên tắc thiết kế (không phá):**
- Phiếu = các Task xếp dọc. Mỗi Task có G0 (số, tiêu đề, hướng dẫn; cố định, luôn trên cùng), G1 ảnh, G2 nội dung, G3 đáp án, G4 word bank. Luồng: chọn Task layout → chỉnh kích thước container → chọn Answer layout.
- Khung container ảnh chính là khung ảnh (một thứ). Fit ngang/dọc không làm khung to ra; co giãn là co giãn khung, ảnh đi theo.
- Mọi khung có viền phải bo góc. Mọi thứ thẳng hàng theo đường dóng.
- Khoảng cách chỉ có Gọn/Vừa/Thoáng/Tự do và các số mm khai báo. Không dùng hệ số ẩn.
- Trang tiếp theo của Task bị cắt không lặp lại G0. Không để tiêu đề mồ côi cuối trang.
- Xếp trang có hai chế độ: Liền trang (lấp đầy, Task dài thì cắt) và Tách trang (chỉ Task trọn vẹn).
- Nhập file không bao giờ ghi đè Task có sẵn; nạp phiếu lỗi không được làm hỏng phiếu đang mở. Không đoán rồi lặng lẽ áp dụng: chỗ không hiểu phải báo.

**Khi sửa prototype:**
- Sửa trực tiếp file `ws-editor-prototype.html`, giữ một file duy nhất, JS thuần, không thêm thư viện.
- Chạy kiểm thử bằng Playwright (chụp ảnh, xem lại) và kiểm tra không có lỗi console, 0 cảnh báo tràn trang trước khi báo xong. Chạy test từng cái (mỗi cái có thể mất 1–2 phút), chạy lại đủ test trên bản cuối trước khi báo xong.
- Cuối mỗi thay đổi lớn, cập nhật `WS_EDITOR_SPEC.md` (giữ cùng cấu trúc mục) và đưa lại cho tôi cả hai file.
- **Mỗi khi có code mới:** (1) sửa `ws-editor-prototype.html` và cập nhật `WS_EDITOR_SPEC.md` cho khớp; (2) xuất bản (publish) lại bản artifact để tôi xem; (3) gửi lại cho tôi cả hai file đã cập nhật để tôi thay vào Project. Bản artifact hiện có: https://claude.ai/artifact/7Ndsf8tt5xjidREi99Frf9 (từ v67, hiện v69; link cũ 4FLtRGtT211poqu1bPRSdG dừng ở v66). Thread mới đọc artifact này trước rồi publish vào cùng URL để giữ một đường dẫn duy nhất. Nếu không có quyền ghi vào URL đó thì publish bản mới và nói rõ link mới.
- Khi trả lời xong một thay đổi, nêu ngắn: đã sửa gì, đã kiểm thử gì, và nhắc tôi thay file trong Project.
- Nếu hành vi thật khác đặc tả, nói rõ chỗ lệch thay vì tự chọn một bên.

**Cách trả lời:** tiếng Việt, ngắn gọn, thẳng, thân mật. Góp ý trung thực, không khen cho có. Nếu tôi hiểu sai hoặc yêu cầu mâu thuẫn với nguyên tắc trên, nói thẳng và đề xuất cách khác. Khi yêu cầu mơ hồ ở chỗ làm sai sẽ tốn công, hỏi một câu ngắn; còn lại cứ làm rồi nêu cách hiểu đã chọn. Nói đúng việc đã kiểm thử và việc chưa kiểm thử, không nói "đã đạt" khi chưa chạy. Mẫu do Claude tự viết không thay được phiếu do AI khác viết.
