# WS Editor — hướng dẫn cho Claude (đọc đầu tiên mỗi phiên)

Dự án: bước dàn trang phiếu bài tập tiếng Anh (A4, đầu ra HTML, không in/PDF). Một file HTML thuần `ws-editor-prototype.html`, JS thuần, không thư viện; sau này mới tích hợp vào WS Studio. Nguồn sự thật là **git repo này** (không còn dùng file trong Claude Project).

## Đọc theo thứ tự
0. `docs/BAT_DAU_PHIEN_MOI.md`: lệnh mở phiên và thứ tự đọc.
0b. **Đang chuyển sang React (từ 27/10/2026):** `docs/BAO_CAO_PHIEN_2026-10-27_phien11.md` mục 0 (bàn giao) + **`docs/KE_HOACH_REACT.md` mục 8** (tiến độ, cách làm từng mảnh, bẫy đã gặp). Trong lúc chuyển: đóng băng tính năng.
1. `docs/BAO_CAO_PHIEN_2026-10-27_phien10.md` (**mới nhất**, mục 0 = bàn giao; mục 0c = v103, 0d = v104, 0e = v105, 0f = v106): **v106 = chỉnh sau phiếu 14: số câu bài nối thẳng lề, Căn dọc Chọn A/B/C, a/b/c/d thẳng cột, tay kéo T/F (spec mục 38).** Trước đó **v105 = phiếu 14: `Dạng: nối` luôn tách cặp, bài nối có Tiêu đề cột / Chỗ nối (ô viết chữ) / vế thừa, bài đọc + T/F tự xếp dọc (spec mục 37, prompt quy tắc 24–25).** Trước đó **v104 = xuống dòng trong ô bảng bằng `<br>` (spec mục 36, prompt quy tắc 23).** Trước đó **v103 = bài nối hiện số câu, công tắc Viền hai vế (mặc định không viền), tay kéo cột T/F; prompt quy tắc 21–22** (spec mục 35). Trước đó **v101 = điền từ vào đoạn văn bằng câu hỏi Q1 (bài đọc chỉ là chữ), ô câu nhiều dòng, T/F cùng hàng căn dọc / cách lề phải** (spec mục 33; v102 = nhãn A/B/C mặc định a. b. c., mục 34; kế hoạch `docs/KE_HOACH_v101.md`). Trước đó `docs/BAO_CAO_PHIEN_2026-10-27_phien9.md` (mục 0 = bàn giao): **v100 = thử phiếu thật 7 với prompt PDF→MD**: nhãn chỗ trống `(a)`, `Số câu: a b c`, `Dạng: đúng/sai (cùng hàng)` (spec mục 32). Trước đó `docs/BAO_CAO_PHIEN_2026-10-27_phien8.md` (mục 0 = bàn giao): **v99 = làm hết `docs/KE_HOACH_v95.md`** (v95 Q2 điểm bắt đầu / chiều dài / số hàng, v96 bảng số thứ tự + tùy chọn ở cột trái, v97 Căn lề Khối text, v98 bảng chọn đáp án có ô tích, v99 ảnh trong ô bảng; spec mục 27–31); Ô chữ đã trải nghiệm, vấn đề chờ quyết ở `docs/TRAI_NGHIEM_O_CHU.md`. Trước đó v94 = popup "+ Task" chọn Q rồi T (spec mục 26); G2 kiểu báo chí đang gác lại. Trước đó `docs/BAO_CAO_PHIEN_2026-10-26_phien7.md`: **v92 = đáp án đúng ngay trong khung soạn cho mọi dạng Q** (spec mục 24; đề xuất `docs/DE_XUAT_CHON_DAP_AN_Q.md`, kế hoạch `docs/KE_HOACH_DAP_AN_Q.md`). Trước đó `docs/BAO_CAO_PHIEN_2026-10-26_phien6.md`: **v86 = làm xong toàn bộ `docs/DANH_SACH_VIEC_v85.md`** (v85 spec mục 22, v86 spec mục 23). Trước đó `docs/BAO_CAO_PHIEN_2026-10-26_phien5.md`: **v84 = sửa 10 góp ý sau v83** (ảnh chung mọi dạng, chọn đúng khối, cỡ chữ Vừa, nhãn a b c, khối tự do nhiều ảnh; spec mục 21; v83 mục 20, v82 mục 19). Trước đó `docs/BAO_CAO_PHIEN_2026-10-26_phien4.md`: **v81 = kiến trúc trình bày mới đã triển khai** (Bố cục T 4 kiểu, Dạng câu hỏi Q 12 kiểu, khối G, cú pháp MD `Dạng:`…), đã kiểm thử gì, việc tiếp theo. Bản duyệt: `docs/KIEN_TRUC_TRINH_BAY_MOI.html`; rà soát dạng bài: `docs/RA_SOAT_DANG_BAI.md`. Lịch sử: `docs/BAO_CAO_PHIEN_2026-10-26_phien3.md` (quyết định kiến trúc), `docs/BAO_CAO_PHIEN_2026-10-26.md` (v73–v80).
2. `docs/WS_EDITOR_SPEC.md` (đặc tả app; **mục 18 = v81, mục 19 = v82, mục 20 = v83, mục 21 = v84, mục 22 = v85, mục 23 = v86, mục 24 = v87–v92, mục 25 = v93, mục 26 = v94, mục 27–31 = v95–v99, mục 32 = v100, mục 33 = v101, mục 34 = v102, mục 35 = v103, mục 36 = v104, mục 37 = v105, mục 38 = v106, mục 39 = v108 (a/b/c thẳng cột, sửa cả hai bản)**, các mục T1–T9 / A1–A8 cũ giờ là tầng dữ liệu bên trong) rồi mục "BÀN GIAO" cuối `docs/WS_EDITOR_SPEC_v37_bo_sung.md`.
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
- **Đang chuyển React:** mã nguồn ở `app/` (Vite + TypeScript + React + Zustand), `cd app && npm run build` → `ws-editor.html` (một file). `ws-editor-prototype.html` = v106 đóng băng (đã vá v108 a/b/c thẳng cột), chỉ sửa lỗi nặng (sửa ở cả hai bản). Mỗi mảnh chuyển xong phải qua `python3 tests/chuan/chuan.py so ws-editor.html` (120/120) và toàn bộ test. Trước khi chuyển: sửa trực tiếp `ws-editor-prototype.html` (một file, JS thuần, không thêm thư viện).
- Kiểm thử bằng Playwright (`tests/`): chụp ảnh xem lại, 0 lỗi console, 0 cảnh báo tràn trang. Chạy **từng test một** (`bash tests/run_all.sh <mới.html> <cũ.html>`), không chạy hai Chromium cùng lúc. Chạy đủ bộ trên bản cuối trước khi báo xong. Mẫu do Claude tự viết không thay được phiếu do AI khác viết.
- Cuối mỗi thay đổi lớn: cập nhật `docs/WS_EDITOR_SPEC.md` (giữ cấu trúc mục), mục bổ sung + BÀN GIAO, báo cáo phiên, tăng số bản (badge `vNN`).
- Xong việc thì **commit và push lên `main`** (repo `khanhtoaninv/WS-Editor`). Không dùng artifact.
- Báo kết quả ngắn: đã sửa gì, đã kiểm thử gì, chưa kiểm thử gì (đừng nói "đã đạt" khi chưa chạy).
