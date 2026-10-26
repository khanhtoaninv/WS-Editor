# Đề xuất (chưa code): xác định đáp án đúng ngay trong giao diện mọi dạng Q — 2026-10-26

Nguồn: góp ý của người dùng sau v86. Trạng thái: **thảo luận, chưa làm**. Rà soát bằng **đọc code v86** (chưa chạy thử từng dạng trên app).

## 0. Hiện trạng chung (từ code)
- Đáp án đúng của mỗi câu là **một chuỗi** `item.key` (vd. `"goes"`, `"b, c"`). Nhiều đáp án tách bằng dấu phẩy (`keyParts`).
- Ô "Đáp án" trong khung soạn **chỉ hiện khi bật công tắc "Ghi đáp án đúng"** (`fieldToggles` → `key`). Mặc định tắt → nhiều dạng trông như chỉ nhập nội dung.
- Ô tích đáp án (v86 F2, hàng "Đúng") chỉ có ở **A4 khoanh có `opts` (Q3)**, **A6 Đúng/Sai (Q5)** và **ảnh A5 (Q7)**.
- `key` hiện chỉ dùng để: hiện sẵn đáp án ở câu ví dụ, cảnh báo "Thiếu đáp án đúng", xuất MD. Chưa có bản đáp án giáo viên.

## 1. Bảng rà soát 12 dạng
| Q | Đáp án đúng là gì | Hiện có | Thiếu | Đề xuất |
|---|---|---|---|---|
| Q1 Điền từ | từ ở mỗi `___` | ô "Đáp án" gõ tay (ẩn mặc định), **một chuỗi cho cả câu** | câu nhiều chỗ trống không gắn được đáp án từng chỗ; có Khung từ mà không chọn từ trong khung | Mỗi `___` có ô đáp án riêng ngay sau chỗ trống; có Khung từ thì chọn từ danh sách khung |
| Q2 Viết câu | câu mẫu | ô "Đáp án" gõ tay (ẩn mặc định) | ô ẩn | Hiện sẵn ô "Đáp án mẫu" |
| Q3 Chọn A/B/C | lựa chọn đúng | ô "Chọn" + hàng "Đúng" tích (nhập hai chỗ) | trùng lặp | Mục 2 |
| Q4 Chọn trong câu `{a\|b}` | vế đúng ở mỗi nhóm | chỉ ô "Đáp án" gõ tay; **không có ô tích**; một chuỗi so với mọi nhóm trong câu | nhiều nhóm `{}` trong một câu không phân biệt được; bài tìm lỗi (gạch chân A–D) không đánh dấu được phần sai | Bấm vế đúng ngay trên câu (chip); tìm lỗi: bấm phần gạch chân sai (mục 3) |
| Q5 Đúng/Sai | T/F/NG… | tích ở hàng "Đúng", chọn một | — | Giữ; hiện sẵn |
| Q6 Nhìn ảnh viết | từ / câu | ô "Đáp án" gõ tay (ẩn mặc định) | ô ẩn | Hiện sẵn; nếu chọn trong câu thì như Q4 |
| Q7 Chọn ảnh | ảnh đúng | tích dưới ảnh, chọn nhiều | — | Giữ |
| Q8 Nối | cặp đúng | **không có**: vế phải in đúng thứ tự gõ, nên hàng gõ = hàng in, không biết cặp nào đúng | **thiếu hoàn toàn** | Gõ cặp đúng cạnh nhau, thêm "Xáo vế phải khi in" (mục 4) |
| Q9 Tô chữ (tô theo nét) | không có đúng/sai: chữ mẫu chính là bài | — | — | **Loại trừ** như Q12 |
| Q10 Bảng | chữ ở ô học sinh điền | **không có**: ô trống là ô trống | thiếu | Ô trống có thể ghi "đáp án ô" (chỉ hiện ở bản giáo viên), giống Ô chữ |
| Q11 Lưới / Ô chữ | chữ trong ô | Ô chữ: chữ ô chính là đáp án, có "Hiện đáp án" | lưới tìm từ: chưa đánh dấu vị trí từ | Giữ Ô chữ; tìm từ để sau (ưu tiên thấp) |
| Q12 Viết tự do | không có | — | — | Loại trừ |

**Đính chính:** ở trao đổi trước, Claude hiểu nhầm Q9 là "tô màu / gạch chân chữ đúng". Trong code Q9 là **tô theo nét chữ mờ** (luyện viết), không có đáp án đúng/sai. Phần Q9 trong `MINH_HOA_Q4_Q9_BAM_TREN_CHU` vì vậy **không áp dụng**; nếu cần dạng "gạch chân / tô các từ đúng" thì đó là tùy chọn của Q4 (tìm lỗi) hoặc một dạng mới, cần bàn riêng.

## 2. Q3: bỏ ô "Chọn", sửa thẳng danh sách đáp án (đã thống nhất)
- Nhãn "Đúng" → **"Đáp án"**, lề phải icon **+** thêm dòng, mỗi dòng có nút xóa (tối thiểu 2).
- Mỗi dòng: **ô tích + nhãn a./b./c. (tự đánh) + ô gõ**. Tích nhiều ô được.
- Dữ liệu giữ `opts[]` + `key` ("b, c"); phiếu cũ không cần chuyển.

## 3. Q4: chip trên câu
- Mỗi nhóm `{goes|go}` hiện thành chip trong khung soạn; bấm chip = đúng (xanh ✓), bấm lại bỏ.
- Lưu đáp án **ngay trong nhóm**: `{*goes|go}` (dấu `*` trước vế đúng). Mỗi nhóm có đáp án riêng, câu nhiều nhóm vẫn đúng. Phiếu in bỏ dấu `*`.
- Tương thích: `key` cũ (một chuỗi) tự chuyển thành dấu `*` khi khớp đúng một vế; không khớp thì giữ và báo.
- Tìm lỗi (gạch chân A–D): bấm phần gạch chân sai → đánh dấu `<u>*…</u>` hoặc `key` = chữ cái.

## 4. Q8: cặp đúng = hàng gõ, in thì xáo
- Giáo viên gõ cặp **đúng** cạnh nhau (trái ↔ phải). Đáp án suy ra tự động, không cần ô riêng.
- Thêm tùy chọn **"Xáo vế phải khi in"** (mặc định bật cho phiếu mới; xáo cố định theo mã Task để in lại không đổi). Vế phải thừa (gây nhiễu) giữ như hiện nay.
- Phiếu cũ (đã gõ sẵn thứ tự xáo): mặc định **tắt** xáo để không đổi phiếu; báo "chưa có cặp đúng".

## 5. Q1 / hội thoại / Q6: đáp án từng chỗ trống
- Mỗi `___` trong khung soạn có ô nhỏ ngay sau để gõ đáp án; có Khung từ thì là ô chọn từ trong khung.
- Lưu: `key` = các đáp án theo thứ tự chỗ trống, cách nhau ` | ` (một chỗ trống thì như cũ).

## 6. Việc chung
- Bỏ công tắc "Ghi đáp án đúng": ô đáp án luôn hiện ở dạng có đáp án; chip đếm "x/y câu có đáp án".
- Có đáp án đầy đủ thì làm được **bản đáp án giáo viên** (việc tồn từ mục 16 spec).

## Thứ tự đề xuất khi làm
1) Q3 → 2) Q4 chip → 3) Q8 xáo → 4) đáp án từng chỗ trống (Q1/hội thoại/Q6) → 5) hiện ô đáp án mặc định → 6) Q10 ô đáp án. Mỗi bước chạy đủ bộ test.
