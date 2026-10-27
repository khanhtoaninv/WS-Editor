# Tự trải nghiệm Ô chữ (Q11 Lưới), bản v99

Cách làm: + Task → Q11 Ô chữ / lưới → Thêm Task; gõ lưới 6×8 (CAT, PIZZA ngang; BIRD, APPLE dọc); bật bản giáo viên; xuất MD rồi đọc lại; thử thêm một lưới tìm từ (mọi chữ cho sẵn). Ảnh: `O_CHU_GIAI_DO_v99.png`, `O_CHU_TIM_TU_v99.png`.

## Chạy đúng
- Lưới vẽ đúng: chỉ ô có chữ mới có viền, số 1 2 3 4 tự đánh đúng thứ tự (trái → phải, trên → dưới), không có ô đen.
- Bản giáo viên (Hiện đáp án) in chữ vào ô; chỉnh Cỡ ô (mm), Vị trí ô chữ Trái / Giữa / Phải được.
- MD xuất `Crossword:` + lưới, đọc lại giữ nguyên lưới. 0 lỗi console, 0 tràn.

## Đã sửa ngay (lỗi rõ ràng)
- Dòng đếm "7 ô · 3 từ" không cập nhật khi gõ lưới (lưới mới phải là 15 ô · 4 từ). Đã sửa, có test (test42).
- Gợi ý "Lời gợi ý: thêm khối chữ ở mục 5" chỉ chỗ cũ, đã đổi thành "thêm ở Khối tự do (+ Chữ)".

## Vấn đề, chưa sửa (cần bạn quyết)
1. **Tên và câu mẫu sai dạng.** Task Ô chữ mới có tiêu đề "Complete the table." / "Write one or two words."; cây Task, cột phải, mục G3 và nút "Lưu làm mặc định cho dạng Bảng" đều gọi là "Bảng". Đề xuất: tiêu đề mẫu "Do the crossword." / "Read the clues. Write the words.", tên hiện là "Ô chữ".
2. **Không có chỗ cho lời gợi ý (Across / Down).** Phải gõ tay vào Khối tự do, số gợi ý không gắn với số trong lưới: sửa lưới làm số đổi thì gợi ý lệch mà không ai báo. Đề xuất: danh sách gợi ý theo từ (app tự liệt kê 1 ngang, 2 dọc… lấy từ lưới, giáo viên chỉ gõ câu gợi ý; có thể thay câu bằng ảnh), in thành hai cột Across / Down dưới lưới.
3. **Tìm từ (word search) chưa dùng được dù popup ghi "giải đố, tìm từ".** Muốn chữ in sẵn phải gõ `(C)(A)(T)` từng chữ; lưới vẫn tự đánh số 1–7 ở đầu hàng / cột (sai với tìm từ); không có danh sách từ cần tìm, không có cách khoanh đáp án ở bản giáo viên. Đề xuất: Q11 có hai kiểu "Giải đố" / "Tìm từ"; kiểu Tìm từ: gõ lưới chữ thường (mỗi dòng một hàng), không đánh số, danh sách từ cần tìm dùng Khung từ G4.
4. Gợi ý dưới Dạng câu hỏi ở cột phải vẫn là câu của Bảng ("ô để trống = ô viết, ✓ = ô tick"), không nói gì về cú pháp lưới (`#`, `.`, `(a)`).
5. Nhỏ: xuất MD ghi khóa tiếng Anh `Crossword:` (QUY_UOC_MD có ghi; đọc lại vẫn đúng), có thể đổi sang "Ô chữ giải đố:" cho đồng bộ.

Ưu tiên đề xuất: 1 (nhỏ, sửa nhanh) → 2 (đáng giá nhất cho giáo viên) → 3 (dạng mới, cần thảo luận) → 4.
