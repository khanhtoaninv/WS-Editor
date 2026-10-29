# Báo cáo phiên 16 — 29/10/2026: thiết kế module Tạo bài

## 0. BÀN GIAO (đọc mục này trước)

**App vẫn là v123, phiên này không sửa code.** Phiên chỉ thảo luận và chốt thiết kế module **Tạo bài theo giáo trình**.

Tài liệu (đều trong repo):
| File | Nội dung |
|---|---|
| `docs/TAO_BAI/DAC_TA_TAO_BAI.md` | **Đặc tả chính thức** (bản 1) |
| `docs/TAO_BAI/KE_HOACH_TRIEN_KHAI.md` | **Kế hoạch T0–T6**, điểm nối với editor, test, rủi ro |
| `docs/MINH_HOA_TAO_BAI.html` | Hình mẫu màn ① Ra đề (bấm thử được); màn ② trong file này là bản cũ, đã bỏ |
| `docs/MINH_HOA_TAO_BAI_B.html` | Hình mẫu màn ② Biên tập **(hướng đã chọn)**, vẽ trên ảnh chụp editor v123 thật |
| `docs/TAO_BAI/1_DANG_Q.md` | Bản nháp file chung số 2: mô tả 12 dạng Q |
| `docs/TAO_BAI/0_THIET_KE.md` | Nhật ký quyết định trong thảo luận |

**Việc tiếp:** làm theo `KE_HOACH_TRIEN_KHAI.md`, bắt đầu **T0** rồi **T1** (T1–T2 không cần AI, không cần chờ thảo luận cấu trúc file). Theo `CLAUDE.md`: làm từng giai đoạn, mỗi giai đoạn một bản `vNN`, chạy chuẩn 120/120 + toàn bộ test, cập nhật spec / báo cáo / `KIEM_TRA_T*.md`, commit + push `main`.

**Lệnh mở phiên:**
> Đọc CLAUDE.md, docs/BAO_CAO_PHIEN_2026-10-29_phien16.md mục 0, docs/TAO_BAI/DAC_TA_TAO_BAI.md và docs/TAO_BAI/KE_HOACH_TRIEN_KHAI.md. Xem hai hình mẫu docs/MINH_HOA_TAO_BAI.html (màn Ra đề) và docs/MINH_HOA_TAO_BAI_B.html (màn Biên tập). Tóm tắt ngắn rồi làm T0. Xong T0 thì báo, chờ tôi duyệt rồi mới sang T1.

**Đang chờ người dùng (không chặn T0–T3):**
- Thảo luận riêng về cấu trúc file Kiến thức / Trình tự / TF / bộ file chung.
- Các câu hỏi mở ở mục 12 đặc tả (đang dùng mặc định ghi tại đó).

## 1. Các quyết định chính (tóm tắt; chi tiết ở đặc tả)

1. Làm trước **tạo bài theo giáo trình**, bài tự do để sau.
2. Dữ liệu: mỗi lesson thuộc **đúng một chuyên đề**, có file **Kiến thức** riêng; **Trình tự + TF** dùng chung theo chuyên đề trong giáo trình, có phiên bản; cộng **bộ file chung** (quy tắc MD, dạng Q, quy tắc hình thức, rubric, phiếu mẫu).
3. **TF ghi thẳng mã Q** của app. Trình tự viết kiểu **lai**: bước có vai trò, Q được phép, khoảng số câu, bắt buộc / không; cộng nguyên tắc chữ.
4. **Cấu trúc do code, nội dung do AI.** Hai giai đoạn: **① Ra đề → ② Biên tập**.
5. **Ra đề:** khung chọn giáo trình / unit / lesson luôn mở (bấm tiêu đề để thu gọn); cấu trúc là một khối, mỗi bước một mục, mặc định 1 bài, **+** / **✕**, tối đa **2 bài mỗi bước**, dạng Q chọn ngẫu nhiên trong danh sách được phép; layout sơ bộ cập nhật ngay.
6. **Biên tập = editor hiện tại, giữ nguyên bố cục** (người dùng phản đối bản mẫu thay inspector bằng thẻ). Hướng **B**: dải trên cùng + biểu tượng trạng thái trong cây + **ngăn trượt** đè tạm lên inspector để duyệt.
7. Kiểm tra chất lượng: giáo viên thấy **đạt / chưa đạt kèm lý do**, không thấy điểm số; điểm và hành vi giáo viên lưu cho admin.
8. **Lịch sử chỉ tạo khi bấm Duyệt**: Duyệt bài chỉ lưu bài đó, Duyệt phiếu lưu cả phiếu, mỗi loại giữ **tối đa 3** lần duyệt gần nhất.

## 2. Phát hiện kỹ thuật
- Khi dựng hình mẫu B, phiếu thử nạp vào v123: bài `Dạng: viết tự do` + `Khối chữ trên:` bị nhận thành "Câu hỏi · viết câu" thay vì Q12. Đã đưa vào T0 (rà bộ đọc theo 12 Q).
- Gọi AI phải qua máy chủ (`server/`), khóa không nằm trong trình duyệt; mở thẳng file HTML thì chỉ có chế độ AI ngoài.

## 3. Đã kiểm thử gì
Chỉ các hình mẫu HTML: chụp Playwright, 0 lỗi console, các nút bấm thử chạy. Không có thay đổi code app, nên không chạy bộ test app.
