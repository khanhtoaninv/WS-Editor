# Vấn đề cần xử lý (người dùng tổng hợp) — cập nhật 26/10/2026

Trạng thái: **chỉ thảo luận, chưa code** cho đến khi người dùng ra lệnh. Hình minh họa: `docs/MINH_HOA_VAN_DE_2_3.html` (tĩnh, đỏ = hiện tại, xanh = đề xuất). App hiện tại: v82.

## Đã sửa
- Sau khi đổi Dạng câu hỏi, `{…|…}` sót lại trên phiếu (Task 1 demo): đã sửa trong v82 (spec 19.4).

## Đang chờ duyệt

### V1. G1 Ảnh chung: bấm "+ Thêm" không thấy chỗ nhập ảnh
- **Hiện trạng (đã thử):** "+ Thêm" có tạo ô ảnh, nhưng là nút "+" nhỏ 50×38 px không có chữ, nằm cạnh ô tên ảnh; bấm vào mới mở hộp Tạo / Tải ảnh. Thêm xong G1 chưa được chọn trên trang nên panel phải cũng chưa hiện nút Tải ảnh.
- **Đề xuất:** ô ảnh G1 lớn, rộng hết mục, ghi "Tải ảnh lên · Tạo ảnh · kéo thả hoặc Ctrl+V"; ô tên ảnh nằm dưới. Sau "+ Thêm" tự chọn G1. Áp tương tự cho ảnh thứ hai và ô ảnh của khung từ ảnh. Không tự mở hộp thoại.
- **Ảnh hưởng:** chỉ giao diện cột trái; sửa test31/test29 nếu đếm `.ithumb`.

### V2. Biểu tượng ⓘ ở ô nhập chữ: bảng thủ thuật + thao tác nhanh
- **Hiện trạng:** cách viết chỉ nằm trong dòng gợi ý mờ (placeholder), mất khi gõ. Ký hiệu đang có: `**đậm**`, `*nghiêng*`, `<u>gạch chân</u>`, `___` chỗ trống, `{a|b}` chọn trong câu, dòng trống = sang đoạn (bài đọc), `A.` đầu đoạn = nhãn đoạn, `A. B. C.` lựa chọn, `☐` ô tick, `[ảnh: x]` (chỉ MD), `- ` / `1.` trong khối chữ.
- **Đề xuất:** (a) ⓘ tròn ở góc ô nhiều dòng (bài đọc, lời dẫn, khối chữ) mở bảng ký hiệu riêng cho ô đó. (b) Thanh nút nhỏ: **B**, *I*, U, `___`, `{a|b}`, "¶ đoạn mới", chèn tại con trỏ hoặc bọc phần đang bôi đen. (c) Danh sách câu có nhiều ô (6 câu = 6 ô): đặt **một** ⓘ + thanh nút ở đầu mục G3, tác động vào ô đang focus, không lặp ⓘ ở từng câu.
- **Cần hỏi:** "khoảng cách" và "ký hiệu trên dòng trống" nghĩa là gì? Hiện app chưa có ký hiệu khoảng cách trong chữ (dòng trống = đoạn mới; độ dài ô trống `___` là thông số cả Task). Phương án: chỉ chèn ký hiệu có sẵn (làm được ngay), hoặc thêm ký hiệu mới (vd độ dài chỗ trống, khoảng trắng tự đặt), việc sau.
- **Rủi ro:** chèn bằng script phải bắn lại sự kiện nhập để trang cập nhật và ghi hoàn tác.

### V3. Câu có ô ảnh + chữ: chia hai cột cho gọn
- **Hiện trạng:** mỗi câu xếp dọc: ô ảnh, rồi ô tên ảnh, rồi ô chữ (cao ~160 px).
- **Đề xuất:** lưới hai cột: trái ô ảnh (~84×62), phải hai dòng: "Tên ảnh" (chữ dưới ảnh) và "Chữ (___ )". Còn ~90 px mỗi câu. Áp cho dạng có ảnh riêng từng câu (Nhìn ảnh viết, Chọn ảnh 1 ảnh / câu, ô nhiều dòng). Nút ↑ ↓ ⧉ ✕ giữ ở hàng đầu. Dạng Q7 nhiều ảnh lựa chọn (lưới ảnh) giữ nguyên.
- **Ảnh hưởng:** chỉ HTML / CSS của `edItems` (khối v81 `imgblk`); không đổi dữ liệu hay dàn trang.

### V4. Đổi Dạng câu hỏi đi một vòng rồi quay lại phải về đúng như lần trình bày gần nhất
- **Yêu cầu của người dùng:** khi các G (nhất là G3) đã có nội dung, đổi sang Dạng câu hỏi khác thì **nội dung đã nhập vẫn được lưu** (hiện hay không tùy dạng); đi một vòng quay về dạng cũ thì **như lần trình bày gần nhất của dạng đó**.
- **Đo hiện trạng (26/10, v82, 18 Task × mọi Q hợp lệ a → b → a):** gần như mọi cặp đều khác dữ liệu gốc. Số đo thô có lẫn nhiễu (thứ tự khóa, thông số tự chuẩn hóa), nhưng có mất thật, ví dụ đã kiểm:
  - Task 1 (Nhìn ảnh viết, Q6) → Điền từ (Q1) → Q6: tên ảnh `img:"cat"` bị chuyển thành chữ `text:"cat"`; về lại thì thành `img:"ảnh 1"` + `text:"cat"`, mất `len` (độ dài chỗ viết).
  - Task 4 (Chọn A/B/C, Q3) → Viết câu (Q2) → Q3: **mất các lựa chọn đã nhập** (`opts` thành `["","",""]`); thông số `dir:"h"` thành `auto`.
  - Task 6 (Đúng/Sai, Q5) → Q2 → Q5: về đúng (không mất).
  - Chuyển sang Bảng (Q10/Q11) và về lại: danh sách câu / vế nối / người nói bị đổi cấu trúc.
- **Nguyên nhân:** `setQ` đổi dữ liệu tại chỗ (xóa `opts`, đổi `img` ↔ `text`, `toTable`…), và Q được **suy ra từ dữ liệu** (`ck`/`qOf`) nên không thể chỉ để trường thừa ở lại (vd còn `pair` thì Task bị coi là Nối).
- **Đề xuất (cần duyệt):** bộ nhớ theo dạng. Khi rời dạng Q cũ, cất phần riêng của dạng đó vào `t.qmem[Qcũ]` (bản chụp: các trường riêng của câu như `opts` / `img` / `len` / `pair` / `who` / `lines` theo `id` câu, `answer`, các thông số bố cục liên quan, và với Bảng thì cả `content` dạng danh sách). Khi vào dạng Q mới: nếu có `qmem[Qmới]` thì khôi phục rồi gộp với thay đổi từ lúc rời: chữ câu nào người dùng sửa trong lúc ở dạng khác thì giữ chữ mới; câu thêm mới thì thêm vào; câu đã xóa thì bỏ. Không có bản cất thì chuyển như hiện nay.
- **Ảnh hưởng / rủi ro:** thêm trường tùy chọn `qmem` (JSON lưu theo, MD không mang theo; nên ghi rõ trong spec; schema thêm, không phá phiếu cũ); không ảnh hưởng dàn trang vì bộ vẽ bỏ qua `qmem`. Phần khó là gộp khi người dùng đã sửa giữa chừng và dạng Bảng. Đo nghiệm thu: với mọi Task, mọi cặp a → b → a và một vòng dài a → b → c → a: **HTML vẽ ra giống hệt ban đầu**, nội dung đã gõ ở dạng khác không mất.
- **Cần hỏi:** bản nhớ lưu **trong file phiếu** (mở lại hôm sau vẫn đi vòng được, đúng ý "update bài") hay chỉ trong phiên đang mở? Mình nghiêng về lưu trong file.

## Việc mở khác (từ trước)
- Chi tiết trang: tiêu đề phiếu / Họ tên Lớp Ngày / header footer (đã đặt câu hỏi, chưa chốt).
- P3 PDF thật + MD AI tạo theo prompt v81; G2 bố cục riêng; G3 chia nhóm.
