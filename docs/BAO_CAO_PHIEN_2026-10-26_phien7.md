# Báo cáo phiên 26/10/2026 (phiên 7): v87–v92, đáp án đúng ngay trong khung soạn

## 0. BÀN GIAO CHO PHIÊN SAU (đọc mục này trước)
**Trạng thái:** `main` = **v92**. Đặc tả: `docs/WS_EDITOR_SPEC.md` mục 24. Đề xuất + bảng rà soát 12 dạng Q: `docs/DE_XUAT_CHON_DAP_AN_Q.md`; hình minh họa `docs/MINH_HOA_DAP_AN_Q.png`; kế hoạch 6 bước `docs/KE_HOACH_DAP_AN_Q.md`.

**Người dùng yêu cầu:** (1) Q3 bỏ ô "Chọn", gõ thẳng a/b/c có ô tích, "+" thêm đáp án, chọn được nhiều đáp án đúng; (2) rà soát mọi dạng Q để dạng nào có đáp án đúng (trừ viết mở) cũng xác định được đáp án ngay trong giao diện. Duyệt kế hoạch rồi nói "thực hiện tất cả các bước, xong mỗi bước tự kiểm thử".

| Bản | Nội dung |
|---|---|
| v87 | Q3: mỗi lựa chọn một dòng (ô tích + a. + ô gõ + ✕), "+" thêm dòng; tích dời theo khi thêm / xóa / sửa |
| v88 | Bỏ công tắc "Ghi đáp án đúng", ô đáp án luôn hiện; chip "x/y câu có đáp án" (bấm tới câu thiếu) |
| v89 | Q4: chip từng vế, lưu `{*đúng|sai}`; phiếu cũ tự chuyển `key`; tìm lỗi sai: bấm phần gạch chân sai |
| v90 | Q8: "Xáo vế phải khi in" + "Xáo lại"; bài nối mới mặc định Bật, phiếu cũ Tắt + thông tin |
| v91 | Đáp án từng chỗ trống `key` = "a \| b"; có Khung từ thì chọn từ trong khung |
| v92 | Q10: ô `=chữ` = ô học sinh điền (in trống), "Hiện đáp án (bản giáo viên)" |

**Đính chính trong thảo luận:** Q9 là tô theo nét (luyện viết), không có đúng/sai, nên loại trừ như Q12. Hình Q9 trong `MINH_HOA_Q4_Q9_BAM_TREN_CHU.png` không áp dụng.

**Chưa làm / để sau:** bản đáp án giáo viên cho cả phiếu; ô tick trong bảng chưa ghi ô đúng; lưới tìm từ; MD chưa mang `content.shuffle` (nhập MD bài nối luôn Tắt xáo); prompt AI chưa hướng dẫn `{*a|b}` (đọc được nếu AI viết).

**Kiểm thử:** xem mục 2.

**Lưu ý môi trường:** trên cloud cần `pip install playwright==1.63.0`; bản cũ để so (test2, cmp_v80) phải có thư mục `fonts/` cạnh file, nếu không test2 lệch chiều cao vì khác phông.

## 0b. Sau v92: v93 (người dùng: "thực hiện các công việc bàn giao")
- Làm phần rõ ràng: MD mang `Chữ câu hỏi: đậm`, `Xáo vế phải: có`, `Khối ảnh: tên (n ảnh)` (spec mục 25).
- Ba việc lớn (chi tiết trang, bản đáp án giáo viên, G2 bố cục riêng) là tính năng mới: đã hỏi người dùng chọn việc nào, sẽ vẽ phương án trước khi code. P3 cần PDF thật; câu hỏi 1, 2, 4 của v84 vẫn chờ.

## 1. Lỗi tìm được khi tự kiểm thử (đã sửa trước khi đẩy)
- Chú thích `//` chèn giữa dòng một-dòng làm mất code phía sau (parseCell; ô tích Đúng/Sai). Đã tách chú thích ra dòng riêng.
- Chip đếm không cập nhật khi gõ đáp án (khung soạn không vẽ lại khi rời ô) → `kcntSync`.
- Bài nối hiện thừa ô "Đáp án" gõ tay → bỏ (cặp đúng = hàng gõ).
- Chip đếm bị cắt ở hàng tiêu đề Câu hỏi → hàng xuống dòng.

## 2. Kết quả kiểm thử trên bản cuối v92
- `bash tests/run_all.sh` (test1–36 + audit) trên bản cuối: **tất cả đạt**, 0 lỗi console, audit 0 vấn đề, 0 lỗi tràn trang. test2 (so với v86, có `fonts/`) đạt: phiếu mẫu giống hệt v86.
- `tests/cmp_v80.py` (phiếu thật trong `tests/real/`, so với v80): đạt.
- `tests/test36.py` 42 mục: Q3 thêm / xóa / sửa / tích nhiều / hoàn tác; chip đếm + bấm tới câu thiếu; Q4 chip, `*`, phiếu in không nghiêng sai, câu ví dụ khoanh sẵn, chuyển phiếu cũ, tìm lỗi; Q8 xáo cố định, không vế đứng yên, Xáo lại, bài mới mặc định Bật; chỗ trống chọn từ Khung từ, hai chỗ trống, câu ví dụ hiện đúng chỗ; bảng `=chữ` in trống / Hiện đáp án / MD.
- Đọc MD có `{*a|b}`, đáp án `went | played`, ô bảng `=swimming`: đúng (thử bằng `readMd`).
- Test sửa theo giao diện mới: test29 (Task có Khung từ: chọn đáp án trong khung thay vì gõ), test31 (badge v92), test35 (ô tích ở dòng đáp án Q3).
- Ảnh chụp sau khi làm: `docs/V92_DAP_AN_DUNG.png`.
- **Chưa kiểm thử:** phiếu PDF thật mới của người dùng; trình duyệt khác Chromium.
