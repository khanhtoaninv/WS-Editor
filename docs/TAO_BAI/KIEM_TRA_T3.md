# Thử tay T3 · Màn Ra đề (v127)

Hai cách mở:
- **Bấm đúp `ws-editor.html`**: dữ liệu là bộ mẫu nhúng sẵn (Pinta English 3 · Unit 5, 4 lesson). Nút **Chọn thư mục dữ liệu…** để thử thư mục của mình (định dạng tạm: `docs/TAO_BAI/DINH_DANG_TAM.md`). Chế độ này không lưu "Phiếu đã tạo".
- **Qua máy chủ lớp thử** (`chay-lop.bat` / `npm run lop` → `http://localhost:1531/editor`): dữ liệu đọc từ `server/demo/tao-bai/` (đổi bằng biến `TAOBAI_DATA`), phiếu Duyệt phiếu / Xuất bản được lưu và hiện ở "Phiếu đã tạo".

| # | Làm | Mong đợi |
|---|---|---|
| 1 | Nút **Tạo bài** (cạnh "+ Phiếu") | Màn Ra đề: hàng trên Giáo trình · Unit · Lesson (nhãn chuyên đề) · thông tin lesson |
| 2 | Chọn Lesson 2 · was / were | Mục tiêu (từ Kiến thức); Cấu trúc bài 5 bước theo Trình tự Ngữ pháp v7, mỗi bước 1 bài, dạng chọn ngẫu nhiên, số câu ngẫu nhiên trong khoảng; layout sơ bộ bên phải "5 bài · ước tính k trang / tối đa 2" |
| 3 | **⟳ Đề xuất lại** nhiều lần | Dạng đổi ngẫu nhiên, không hai bài liền nhau cùng dạng |
| 4 | **+** ở bước 2 | Thêm bài (tối đa 2 bài mỗi bước, + mờ khi đủ); số thứ tự chung đánh lại |
| 5 | **✕** | Bước bắt buộc không xóa được bài cuối (✕ mờ); bước 3 (không bắt buộc) xóa hết → "Bỏ qua bước này · bấm + để thêm bài" |
| 6 | Menu dạng, −/+ số câu, ⟳ trên một bài | Menu chỉ có dạng được phép; số câu dừng ở hai đầu khoảng; layout sơ bộ đổi ngay |
| 7 | Thêm bài / câu cho tới khi quá 2 trang | Trang thừa viền đỏ, "(vượt tối đa 2)" chữ đỏ |
| 8 | Đã chỉnh rồi bấm lesson khác | Hỏi "Cấu trúc đang chỉnh sẽ mất" |
| 9 | Bấm "Chọn bài" | Thu gọn thành một dòng `Giáo trình › Unit › Lesson [chuyên đề]` |
| 10 | Ghi chú cho AI rồi **Duyệt cấu trúc · Sinh bài →** | Hỏi thay phiếu đang mở; vào Biên tập: phiếu khung (mỗi bài tiêu đề mẫu theo TF, chữ giả "xxx"), cây ghi **⏳** đang viết; số trang = ước tính ở layout sơ bộ. Nội dung thật do AI viết ở T4 |
| 11 | Dải trên: **① Ra đề** | Màn Ra đề hiện lại cấu trúc đã duyệt và ghi chú |
| 12 | Đổi số câu của một bài rồi Sinh bài | Hỏi "k bài không đổi được giữ nguyên… 1 bài đổi hoặc mới sẽ được sinh"; bài không đổi giữ cả chỗ đã sửa tay / đã duyệt. **Sinh lại cả phiếu…** = mọi bài thành khung mới. Hoàn tác được |
| 13 | (máy chủ) Duyệt phiếu, rồi mở lại Ra đề cùng lesson | "Phiếu đã tạo" có một dòng (ngày, số bài), nút **Mở** mở lại phiếu |

Lưu ý: layout sơ bộ dàn bằng chính bộ dàn trang của app với chữ giả độ dài trung bình, nên là **ước tính** (thử trên phiếu was / were chữ thật: lệch không quá 1 trang).
