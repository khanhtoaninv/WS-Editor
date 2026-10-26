# WS Editor — hướng dẫn cho Claude (đọc đầu tiên mỗi phiên)

Dự án: bước dàn trang phiếu bài tập tiếng Anh (A4, đầu ra HTML, không in/PDF). Một file HTML thuần `ws-editor-prototype.html`, JS thuần, không thư viện; sau này mới tích hợp vào WS Studio. Nguồn sự thật là **git repo này** (không còn dùng file trong Claude Project).

## Đọc theo thứ tự
0. `docs/BAT_DAU_PHIEN_MOI.md`: lệnh mở phiên và thứ tự đọc.
1. `docs/BAO_CAO_PHIEN_2026-10-26_phien5.md` (**mới nhất**): **v83 = hoàn thiện cột trái + nhớ dạng câu hỏi** (spec mục 20; trước đó v82 mục 19). Trước đó `docs/BAO_CAO_PHIEN_2026-10-26_phien4.md`: **v81 = kiến trúc trình bày mới đã triển khai** (Bố cục T 4 kiểu, Dạng câu hỏi Q 12 kiểu, khối G, cú pháp MD `Dạng:`…), đã kiểm thử gì, việc tiếp theo. Bản duyệt: `docs/KIEN_TRUC_TRINH_BAY_MOI.html`; rà soát dạng bài: `docs/RA_SOAT_DANG_BAI.md`. Lịch sử: `docs/BAO_CAO_PHIEN_2026-10-26_phien3.md` (quyết định kiến trúc), `docs/BAO_CAO_PHIEN_2026-10-26.md` (v73–v80).
2. `docs/WS_EDITOR_SPEC.md` (đặc tả app; **mục 18 = v81, mục 19 = v82, mục 20 = v83**, các mục T1–T9 / A1–A8 cũ giờ là tầng dữ liệu bên trong) rồi mục "BÀN GIAO" cuối `docs/WS_EDITOR_SPEC_v37_bo_sung.md`.
3. Khi cần: `docs/PHUONG_AN_NHAP_FILE.md` (nhập file), `docs/QUY_UOC_MD.md` (cú pháp MD), `docs/PROMPT_PDF_SANG_PHIEU.md` (prompt cho AI đọc PDF), `ws-sample.json` / `samples/`.
Không dùng MASTER_SPEC v10 hay đặc tả cũ nếu mâu thuẫn. Nếu hành vi thật khác đặc tả, nói rõ chỗ lệch, đừng tự chọn một bên.

## Cách trao đổi (quan trọng)
- Người dùng là giáo viên tiếng Anh, không phải lập trình viên. Trả lời tiếng Việt, ngắn, thẳng, thân mật. Góp ý trung thực, không khen cho có; nếu yêu cầu mâu thuẫn nguyên tắc thiết kế thì nói thẳng và đề xuất cách khác.
- **Ý tưởng, tính năng mới, thay đổi thiết kế → thảo luận trước, chưa viết code.** Nêu 1–3 hướng ngắn gọn (kèm hình mẫu nếu cần), nói nên chọn hướng nào và vì sao, hỏi tối đa một câu rồi chờ. Chỉ code ngay khi: sửa lỗi rõ ràng, hoặc người dùng nói "làm đi / ok làm".
- Người dùng nói "chỉ thảo luận" / "chưa code" thì tuyệt đối không sửa file.
- Yêu cầu mơ hồ ở chỗ làm sai sẽ tốn công thì hỏi một câu; còn lại làm rồi nêu cách hiểu đã chọn.

## Khi người dùng đưa một mẫu bài
1) Layout / cấu hình hiện có trình bày được không (không cần giống hình; quan trọng là người học hiểu phải làm gì). 2) Không được thì mở rộng cấu hình (thêm tùy chọn). 3) Chỉ khi vẫn không được mới thêm format mới, phải tổng quát, đơn giản; không biến một mẫu thành template riêng. Mỗi lần nói đã tới bước nào và vì sao.
Khi người dùng gửi PDF thật + MD/JSON do AI tạo + ảnh sau khi nạp: phân từng chỗ sửa vào 5 nhóm (AI đọc sai chữ / prompt dẫn sai / bộ đọc hiểu sai / mô hình thiếu chỗ chứa / dàn trang xấu), sửa đúng lớp, thêm phiếu vào `tests/real/`.

## Nguyên tắc thiết kế (không phá)
- Phiếu = các Task xếp dọc. Mỗi Task: G0 (số, tiêu đề, hướng dẫn; cố định, luôn trên cùng), G1 ảnh chung (1–2 ảnh), G2 bài đọc / lời dẫn, G3 câu hỏi, G4 khung từ (chữ hoặc ảnh), G-Text khối tự do. Luồng (v81): chọn Bố cục Task (4 kiểu T) → chọn Dạng câu hỏi (12 kiểu Q, gồm cách trả lời và cách xếp câu) → chỉnh kích thước container. Mã T1–T9 / A1–A8 chỉ còn là dữ liệu bên trong.
- Khung container ảnh chính là khung ảnh. Fit ngang/dọc không làm khung to ra; co giãn là co giãn khung, ảnh đi theo.
- Mọi khung có viền phải bo góc. Mọi thứ thẳng hàng theo đường dóng.
- Khoảng cách chỉ có Gọn/Vừa/Thoáng/Tự do và các số mm khai báo; không hệ số ẩn.
- Trang tiếp theo của Task bị cắt không lặp lại G0. Không để tiêu đề mồ côi cuối trang.
- Xếp trang hai chế độ: Liền trang (lấp đầy, Task dài thì cắt) và Tách trang (chỉ Task trọn vẹn).
- Nhập file không bao giờ ghi đè Task có sẵn; nạp phiếu lỗi không làm hỏng phiếu đang mở. Không đoán rồi lặng lẽ áp dụng: chỗ không hiểu phải báo.

## Khi sửa code
- Sửa trực tiếp `ws-editor-prototype.html` (một file, JS thuần, không thêm thư viện).
- Kiểm thử bằng Playwright (`tests/`): chụp ảnh xem lại, 0 lỗi console, 0 cảnh báo tràn trang. Chạy **từng test một** (`bash tests/run_all.sh <mới.html> <cũ.html>`), không chạy hai Chromium cùng lúc. Chạy đủ bộ trên bản cuối trước khi báo xong. Mẫu do Claude tự viết không thay được phiếu do AI khác viết.
- Cuối mỗi thay đổi lớn: cập nhật `docs/WS_EDITOR_SPEC.md` (giữ cấu trúc mục), mục bổ sung + BÀN GIAO, báo cáo phiên, tăng số bản (badge `vNN`).
- Xong việc thì **commit và push lên `main`** (repo `khanhtoaninv/WS-Editor`). Không dùng artifact.
- Báo kết quả ngắn: đã sửa gì, đã kiểm thử gì, chưa kiểm thử gì (đừng nói "đã đạt" khi chưa chạy).
