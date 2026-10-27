# Báo cáo phiên 27/10/2026 (phiên 10): v101, điền từ vào đoạn văn bằng câu hỏi

## 0. BÀN GIAO CHO PHIÊN SAU
**Trạng thái:** nhánh `claude/project-thread-0077zc` = **v101** (PR chờ người dùng duyệt; `main` = v100). Kế hoạch: `docs/KE_HOACH_v101.md`; spec mục 33; test `tests/test44.py`.

**Diễn biến (sau khi người dùng thử phiếu 7 với v100, "đạt trên 90%"):**
1. Task 3 không kéo lên trang 1 dù còn 41 mm: **không phải lỗi.** Mảnh đầu (tiêu đề + câu 1) ≈ 41 mm + 6 mm giữa các Task. Không đổi luật cắt trang.
2. Nguyên tắc người dùng chốt: **mọi thứ cần đáp án đều là câu hỏi; bài đọc chỉ là chữ.** Điền từ vào đoạn văn = Q1 (không thêm dạng thứ 13): bài đọc chỉ có tiêu đề, mỗi đoạn là một câu nhiều chỗ trống.
3. Người dùng thử dán cả bài vào ô câu hỏi (G3): ô một dòng không ngắt đoạn, và có dòng `____` thừa cuối ảnh (dòng kẻ trả lời của "viết từ theo câu"). Đã sửa.
4. T/F cùng hàng: số câu căn trên, ô T/F căn giữa nên lệch; không kéo gần T/F lại với câu. Đã thêm Căn dọc cả khối và "T/F cách lề phải".

**Đã làm (v101):** xem spec mục 33. Gồm: `(a) ___` và `a. ___` không bị hiểu là lựa chọn (lỗi code làm cắt mất chữ sau `(a)`); câu có chỗ trống trong chữ không thêm dòng kẻ; ô câu nhiều dòng (mọi dạng trừ dòng chữ giữa câu và câu có ảnh); nhãn `(a)` ở đáp án từng chỗ trống; Căn dọc / cách lề phải cho T/F cùng hàng; phiếu cũ (___ trong bài đọc) vẫn đọc được và có ghi chú; prompt PDF→MD (quy tắc 18 viết lại, JSON thêm 6–7).

**Lỗi tìm được khi kiểm thử và đã sửa:** (a) đổi sang "chỗ trống trong câu" làm mất `___` cuối câu hỏi dạng "Where…? ___" (test16): chỉ đổi khi có chỗ trống thật trong chữ; (b) ô nhiều dòng cho cả dòng chữ giữa câu và câu có ảnh làm vỡ test29/test31: giữ ô một dòng cho hai loại đó; test34 đổi selector `input` thành `[data-k]`.

**Chưa làm / chờ người dùng:** căn lề chữ ô câu hỏi (người dùng nói để sau); tiêu đề bài đọc căn giữa; thanh kéo nhóm T/F; số Task theo PDF (PDF 1, 2, 4, 5); bài 3 của PDF; kiểm `## Đáp án` MD cho câu nhiều chỗ trống; bản prompt trong thư mục project (`prompt/PROMPT_PDF_SANG_MD_v100.txt` đã tạo trước đó, chưa có quy tắc 18 mới, cần xuất lại bản v101); AI tạo lại MD từ prompt mới chưa thử.

## 0e. v105 (phiếu 14)
Phiếu 14: `Dạng: nối` không tách cặp (lỗi bộ đọc), bài nối kiểu viết chữ cái thiếu tiêu đề cột / vế thừa / ô viết chữ (mô hình), bài đọc + T/F tự chọn Hai cột nên không xếp dọc được (code). Sửa cả ba; prompt quy tắc 24–25; spec mục 37; `tests/test48.py`, `tests/md/phieu14.md`.

## 0d. v104 (phiếu 11)
Phiếu 11: ô bảng nhiều dòng bị gộp thành một câu. Sửa: `<br>` xuống dòng trong ô (MD, ô soạn, xuất MD), trang vẽ mỗi dòng riêng; prompt quy tắc 23; spec mục 36; `tests/test47.py`, `tests/md/phieu11.md`.

## 0c. v103 (sau khi gộp v102): phiếu 9
Phiếu 9 ("Unit 6 – Lesson 3"): AI ghép cặp nối theo vị trí dù PDF không in đáp án (lỗi prompt → quy tắc 21); bài nối không vẽ số câu (lỗi code, đã sửa); vế phải luôn có viền (nay công tắc Viền hai vế, mặc định không); T/F cùng hàng chưa kéo được (nay có tay kéo). Spec mục 35, `tests/test46.py`, `tests/md/phieu9.md`, prompt `PROMPT_PDF_SANG_MD_v103.txt`. Còn mở: PDF Task 2 / 3 là bài "viết chữ cái vào ô", app chỉ có dạng nối dây; Task 4 cao hơn một trang.

## 0b. v102 (sau khi gộp v101)
Người dùng: tất cả câu có đáp án a, b, c để mặc định `a. b. c.` (không vòng tròn). Đã đổi: nhãn A4 mặc định `a.`, vòng tròn `Khoanh ⓐ` là lựa chọn riêng (`params.lab = 'circle'`; MD `(khoanh)`), spec mục 34, `tests/test45.py`. **Đổi hành vi phiếu cũ:** phiếu đã lưu chưa chọn nhãn trước đây hiện vòng tròn, nay hiện `a.`.

## 1. Kiểm thử
`bash tests/run_all.sh` (test1–44 + audit) trên bản cuối v101 (badge v101): **tất cả đạt**, audit 0 vấn đề, test2 (so với backup/v80) đạt, 0 lỗi console. test44 (mới): MD phiếu 7 dạng mới (3 đoạn là 3 câu), `(a) ___` không bị cắt, `a. ___` thành 8 câu, phiếu cũ ghi chú, 8 chỗ trống trong chữ không dòng kẻ thừa, ô câu nhiều dòng, nhãn đáp án (a)–(e), căn dọc T/F, cách lề phải 40 mm. Đã nạp phiếu 7 và xem hình: Task 1 và 2 khớp PDF (nhãn a–h, tiêu đề đầu bài, ảnh phải).
**Còn lệch so với PDF:** chỗ trống cuối đoạn (vd `(e) ___.`) kéo dài hết dòng (kiểu `fl` có sẵn của chỗ trống cuối câu), PDF dùng chỗ trống ngắn; tiêu đề bài đọc căn trái, in đậm.
**Chưa kiểm thử:** `tests/cmp_v80.py`; AI tạo lại MD từ prompt mới; trình duyệt khác Chromium.
