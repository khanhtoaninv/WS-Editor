# Ánh xạ TF của Grammar Movers sang dạng câu hỏi và MD của WS Editor

Thuộc nhóm hệ thống. Ba tài liệu lesson không nhắc tới app; file này nối chúng với app. Dạng Q và cú pháp MD xem `docs/QUY_UOC_MD.md`.

| TF | Dạng Q của app | Ghi chú |
|---|---|---|
| TF-G1-A | Q: không chỗ trả lời (`Trả lời: không`) | học sinh tự gạch trên giấy; app chưa có gạch hai kiểu nét trên màn hình |
| TF-G1-B | Q10 bảng, ô gõ | bài đọc đặt trước bảng (`Bài đọc:`); bộ đọc MD nhận; ô Now của hàng They in sẵn `—` (v0.6), không phải ô gõ |
| TF-G2-A | Q5 đúng/sai, nhãn tự đặt, `cùng hàng` | |
| TF-G2-B | Q3 chọn A/B (hai phương án) | |
| TF-G2-C | Q7 chọn ảnh hoặc Q5 yes/no cho câu về ảnh | cần ảnh |
| TF-G3a-A | Q4 chọn trong câu `{*đúng\|sai}` | |
| TF-G3a-B | Q3 chọn A/B | |
| TF-G3b-A | Q1 điền từ, động từ trong ngoặc | |
| TF-G3b-B | Q2 viết câu | |
| TF-G4-A | Q2 viết câu, `Dòng viết: 2`, dữ kiện bằng `Khối chữ trên:` | |
| TF-G4-B | Q1 điền từ trong `Hội thoại:` kèm bảng dữ kiện | |
| TF-G5-A | Q12 viết tự do, `Dòng viết: 4`, `Khung từ:`, ví dụ bằng `Khối chữ trên:` | |
| TF-G5-B | Q10 bảng rồi Q12 viết 2 câu | chưa thử trên app |
| TF-G5c | `Trả lời: không`, khối chữ có ô tick | |

Từ v0.9, định dạng đầu ra của AI đã là MD theo bảng này (xem `goi-thu/v1.0/0_CHI_DAN_VA_DINH_DANG_DAU_RA.md` mục B1.2; từ v1.0 `Dạng: chọn A/B/C` luôn viết đúng chữ này và khung viết câu G4 là `Tên … He …`), không cần chuyển tay. Lưu ý khi viết: Task có bảng dùng `Khối chữ trên:` cho chữ nguồn (không dùng `Bài đọc:`).

**v1.1:** mỗi câu chọn có ba lựa chọn (`{a|*b|c}` hoặc A/B/C; TF-G2-B và TF-G3a hiểu là Q3 chọn A/B/C ba phương án); khối `markdown` kết thúc bằng `### Task 0` để bộ đọc không nuốt NOTES/REPORT vào đáp án; ghi chú dùng `T1:`, `T2:` thay `Task 1:`.
