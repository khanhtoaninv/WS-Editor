# Kế hoạch: xác định đáp án đúng cho mọi dạng Q (v87 → v92) — 2026-10-26

Dựa trên `docs/DE_XUAT_CHON_DAP_AN_Q.md` và hình `docs/MINH_HOA_DAP_AN_Q.png`. Trạng thái: **chờ người dùng duyệt, chưa code**.

Nguyên tắc chung cho mọi bước:
- Mỗi bước = một bản (tăng badge), làm xong, kiểm thử xong, commit + push rồi mới sang bước sau. Người dùng xem từng bản và có thể dừng hoặc đổi ý giữa chừng.
- **Không phá phiếu cũ**: dữ liệu cũ nạp vào vẫn hiện y như trước; chỗ chưa có đáp án thì báo, không đoán.
- Nhập MD / JSON và prompt AI (`QUY_UOC_MD.md`, `PROMPT_PDF_SANG_PHIEU.md`) cập nhật cùng bước nếu cú pháp đổi.
- Kiểm thử: test mới cho bước đó (`tests/test36.py`…) + chạy đủ bộ `tests/run_all.sh`, 0 lỗi console, 0 cảnh báo tràn trang, chụp ảnh khung soạn và phiếu in.
- Cuối mỗi bước: cập nhật `WS_EDITOR_SPEC.md` (mục mới), BÀN GIAO, báo cáo phiên.

## Bước 1 — v87: Q3 gõ thẳng từng đáp án (độ khó: thấp)
- Khung soạn: bỏ ô "Chọn" gộp và hàng "Đúng"; thay bằng mục **"Đáp án"**: mỗi dòng ô tích + nhãn a/b/c + ô gõ + ✕; nút **+** ở lề phải. Tối thiểu 2 dòng.
- Dữ liệu không đổi: `opts[]` + `key` ("a, c"). Đổi chữ một lựa chọn đã tích thì tích đi theo (lưu theo chữ cái, không theo chữ).
- Áp cho mọi câu dùng `opts` (Q3, cả câu trong bài đọc).
- Test: thêm / xóa / sửa lựa chọn, tích nhiều, hoàn tác; phiếu cũ có `opts` hiện đúng.

## Bước 2 — v88: ô đáp án luôn hiện + chip đếm (thấp)
- Bỏ công tắc "Ghi đáp án đúng"; dạng có đáp án (trừ Q9, Q12) luôn có chỗ nhập đáp án.
- Chip đầu phần Câu hỏi: "x/y câu có đáp án", bấm nhảy tới câu thiếu. Thay cảnh báo "Thiếu đáp án đúng ở…" hiện có.
- Làm sớm vì các bước sau dùng chung chip này.

## Bước 3 — v89: Q4 chip trên câu (trung bình)
- Khung soạn: mỗi nhóm `{…|…}` trong ô câu hiện thành chip; bấm chip = vế đúng. Vẫn gõ cú pháp được.
- Dữ liệu: dấu `*` trước vế đúng trong nhóm, `{*goes|go}`. Phiếu in bỏ `*`. Câu ví dụ khoanh sẵn theo `*`.
- Chuyển dữ liệu cũ: `key` cũ khớp đúng một vế → đổi thành `*`; không khớp → giữ `key`, báo.
- Bài tìm lỗi (gạch chân A–D): bấm phần gạch chân sai → `key` = chữ cái (A–D), viền đỏ trong khung soạn.
- MD: `{*a|b}` là cú pháp mới; cập nhật QUY_UOC_MD + prompt AI.
- **Rủi ro:** ô câu hiện là ô gõ chữ thường; chip cần một lớp hiển thị cạnh / dưới ô gõ (không thay ô gõ) để không làm hỏng việc gõ. Sẽ chụp ảnh cho người dùng xem trước khi chốt.

## Bước 4 — v90: Q8 cặp đúng + xáo vế phải (trung bình)
- Cặp gõ cạnh nhau = cặp đúng. Công tắc **"Xáo vế phải khi in"** ở Task; xáo cố định theo mã Task (in lại không đổi), có nút "Xáo lại".
- Mặc định: Task mới → Bật; phiếu cũ / nhập file → Tắt (giữ đúng thứ tự giáo viên đã gõ) và báo "chưa xác nhận cặp đúng".
- Vế thừa (gây nhiễu) xáo chung vào cột phải.
- Câu ví dụ (nếu có) không xáo, vẽ sẵn đường nối.
- Kiểm: ngắt trang giữa bài nối vẫn xáo đúng; ảnh vế trái đi đúng cặp.

## Bước 5 — v91: đáp án từng chỗ trống (trung bình–cao)
- Q1, hội thoại, Q6, bài đọc có `___`: mỗi chỗ trống một ô đáp án nhỏ trong khung soạn; có Khung từ → ô chọn từ trong khung.
- Dữ liệu: `key` = các đáp án theo thứ tự chỗ trống, cách nhau ` | ` (một chỗ trống: như cũ).
- Cần đọc kỹ chỗ trống trong **bài đọc** (G2) trước khi làm: chưa rà trong code.
- Kiểm: thêm / bớt `___` thì đáp án không lệch chỗ (báo nếu số lượng không khớp).

## Bước 6 — v92: Q10 ô đáp án trong bảng (trung bình)
- Bấm ô bảng → "Ô học sinh điền": chữ gõ trong ô thành đáp án, phiếu học sinh in ô trống. Dùng chung công tắc "Hiện đáp án (bản giáo viên)" đã có ở Ô chữ.

## Để sau (không trong đợt này)
- Bản đáp án giáo viên cho cả phiếu (in / xuất riêng) — khi các bước trên xong, dữ liệu đã đủ.
- Lưới tìm từ (Q11): đánh dấu vị trí từ.

## Ước lượng
Bước 1–2: mỗi bước khoảng một phiên ngắn. Bước 3–6: mỗi bước một phiên. Thứ tự có thể đổi theo người dùng; bước 1 làm được ngay khi được duyệt.
