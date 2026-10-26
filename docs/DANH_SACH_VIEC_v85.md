# Danh sách việc cho v85 (lập 26/10/2026, phiên 6)

Trạng thái (cập nhật cuối phiên 6): **v85 đã làm A1, A2, B1, B2, C1, C2, D1, E1, F3** (spec mục 22). **Để sau, chờ người dùng xác nhận:** A3, C3, D2, F1, F2. Mỗi việc đã tự kiểm thử trước khi sang việc sau.

## A. Lỗi dàn trang / hiển thị
- ✅ A1. Q8 (nối) và Q9 (tô chữ): vẽ trang bỏ qua Khung từ G4 và Ảnh chung G1 (nhánh `pairs`, `trace` không gọi `withBank` / `g1`). Sửa: chèn G1, G4 như các dạng khác. Test: Task 2 thêm G4 chữ + ảnh, G1 thì hiện.
- ✅ A2. Task 3: ô ảnh chung lúc đúng lúc sai khi dùng ảnh thật (Fit ngang). Chưa tái hiện bằng ảnh tổng hợp. Nghi: tỉ lệ ảnh lưu (`imgAr`, biến `--iar`) lệch với ảnh thật, hoặc Fit chỉ áp cho ô đang chọn. Cách làm: nạp ảnh thật nhiều tỉ lệ (dọc, ngang, vuông) vào ô Task 3, đo ngang ảnh so với ngang khung ở Bình thường / Fit ngang / Fit dọc, tìm ca sai rồi sửa; kiểm tra luôn các Task lưới ảnh khác (1, 18).
- ⏸ A3. Task 5 không tách sang trang sau. Chưa tái hiện: Task 5 mẫu cắt trang đúng. Nghi giới hạn đã biết: Task có ảnh chung ở bố cục Xếp dọc / Ảnh trái / Ảnh phải không cắt được. **Chờ người dùng gửi phiếu.** Nếu đúng giới hạn đó thì cho các bố cục này cắt theo câu, ảnh ở trang đầu.

## B. Ảnh có khung riêng
- ✅ B1. Ảnh thứ hai (G1b): có bộ chỉnh đầy đủ như Ảnh 1 (kích thước, căn lề, Bình thường / Fit ngang / Fit dọc, vị trí, zoom).
- ✅ B2. Ảnh trong Khung từ (G4 ảnh): mỗi ảnh có khung riêng với bộ chỉnh tương tự (Fit, chiều cao, vị trí).

## C. Cột trái
- ✅ C1. Bỏ mục "Khối của bài" khỏi Cấu hình. Nút ✕ ở G3 xóa câu hỏi (Ctrl+Z hoàn tác). Bỏ phần "đang tắt · giữ N câu" nếu không còn dùng.
- ✅ C2. Mục G3: đổi "Danh sách câu" thành "Câu hỏi"; bỏ số câu "5 · 5 có chỗ trả lời"; thanh B I U `___` `{a|n}` ra bên phải cùng hàng tiêu đề, chèn vào ô câu đang gõ; nút ⓘ chuyển sang hàng "Tỉ lệ ô ảnh" (chỉ hiện thông tin), Task không có hàng đó thì ⓘ ở hàng "Câu hỏi".
- ⏸ C3. Cột trái mặc định rộng 420 px (hiện 360). Máy đã kéo thanh chia thì giữ độ rộng đã lưu. **Chờ xác nhận "Khung Thao tác Phiếu" là cột trái.**

## D. Mặc định và kiểu chữ
- ✅ D1. Khoảng cách mặc định của phiếu mới và phiếu mẫu: Gọn (hiện Vừa). Phiếu đã lưu giữ nguyên mức đã ghi. Cập nhật test so sánh (`test2`, `cmp_v80.py`) đặt hai bản về cùng mức.
- ⏸ D2. Chữ câu hỏi G3: Bình thường (mặc định) / Đậm, cấu hình theo Task. Chỉ đậm chữ câu hỏi, không đậm các lựa chọn. **Chờ xác nhận phạm vi.**

## E. Hộp thoại
- ✅ E1. Hộp hỏi xóa Task (và mọi hộp thoại): nền xám đen trong suốt phía sau, bấm ra ngoài hoặc Hủy hoặc Esc thì thoát.

## F. Đáp án đúng và câu ví dụ
- ⏸ F1. Dấu đáp án đúng của câu ví dụ trên phiếu: đổi từ xám `#4a5560` sang xanh. **Chờ xác nhận mã màu.**
- ⏸ F2. Ô tích chọn đáp án đúng ngay cạnh từng lựa chọn ở cột trái, chọn một hoặc nhiều; gõ vào ô "Đáp án đúng" vẫn dùng được.
- ✅ F3. Mỗi bài chỉ một câu ví dụ: bấm "Ví dụ" ở câu khác thì câu cũ tự bỏ.

## G. Hoàn tất mỗi lô
- G1. Tăng badge lên v85; cập nhật `docs/WS_EDITOR_SPEC.md` (mục 22), mục BÀN GIAO, báo cáo phiên 6, `docs/BAT_DAU_PHIEN_MOI.md`.
- G2. Test mới `test34.py` cho A1, B1, B2, C1–C3, D, E1, F; chạy từng test một trên bản cuối (test1–34, audit, `cmp_v80.py`), 0 lỗi console.
- G3. Commit và push; báo ngắn: đã sửa gì, đã test gì, chưa làm gì.

## Câu hỏi còn chờ người dùng
1. Task 5: phiếu nào (gửi JSON / MD).
2. "Khung Thao tác Phiếu" = cột trái?
3. "Đậm" chỉ cho chữ câu hỏi?
4. Màu xanh của dấu đáp án (mã màu); ô tích muốn ở cột trái, trên phiếu hay cả hai.
5. A2: gửi ảnh chụp màn hình ca sai nếu còn.

## Cập nhật sau v85 (người dùng trả lời, 26/10 tối) — chưa code, chờ "ok làm"
- A2: người dùng gửi ảnh. **Tái hiện được:** ở dạng có ô ảnh riêng (lưới ảnh Task 1/3/18, bài nối có ảnh), ảnh chung G1 đặt trên cùng bị lẫn với "tất cả ô ảnh" (`kindOf` G1 không item → `cimgs` khi `cellImgMode`), nên Fit lưu vào ô ảnh câu (`cfgOf` cimgs trả `{}`), ảnh chung không có `data-fit`, panel mở sai. Sửa: ảnh chung có lựa chọn riêng + panel Ảnh chung.
- A3: người dùng gửi ảnh Task 5 + ảnh chung → tràn trang. **Đúng giới hạn cũ** (`units` = null khi câu hỏi có ảnh chung ở T1/T2/T3). Đề xuất: cắt theo câu, ảnh ở trang đầu; T2/T3 phần sau chạy hết bề ngang.
- C3: xác nhận "khung Thao tác phiếu" = cột trái → mặc định 420 px.
- D2: xác nhận: nút Bình thường (mặc định) / Đậm cho chữ câu hỏi, theo Task, không đậm lựa chọn.
- F1, F2: người dùng chưa hiểu → hình minh họa `docs/MINH_HOA_F1_F2.png` (F1 màu dấu đáp án câu ví dụ: xanh app #0a6b75 hoặc xanh dương #1e6fd9; F2 ô tích đáp án đúng ở cột trái, không in). Chờ chọn.
