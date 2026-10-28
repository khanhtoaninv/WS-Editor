# Kết quả kiểm thử phiếu đủ dạng (28/10/2026, người dùng nhập) và phân loại

Nguồn: trang "Kiểm thử phiếu đủ dạng" (artifact), phiếu `tests/gd0/phieu-kiem-thu-tay.md` (32 Task). Chưa sửa gì; chờ người dùng bảo "sửa".
Đạt toàn bộ: G3–G6, T01, T02, T04, T06, T08, T09, T13, T14, T16, T17, T18, T22, T24, T25, T28, T29, T31, T32. Lỗi: T05 (câu 2, 3), T15, T19 (câu 2, 3), T20. Chưa chấm (có ghi chú): T07, T30.

## A. Lỗi (đã biết, nay có thêm bằng chứng)
| Mã | Hiện tượng người dùng thấy | Gốc | Mức |
|---|---|---|---|
| T05 | gõ `. ? , !` đều ra đúng | chuẩn hóa bỏ dấu câu hai đầu (`shared/normalize.ts`) | Cao |
| T15 | không ra đáp án, không chấm máy, cũng không chấm tay | đáp án ghi `T`/`F` nhưng nhãn `True/False` nên cả Task thành chấm tay, không có nút chấm tay (xem B2) | Cao |
| T19 | khi làm bài **không nối được** tới chữ yes thứ 2 | tìm hàng vế phải theo chữ (`rightRow`) | Cao |
| T20 | nối được nhưng không ra kết quả | bài nối không xáo = chưa biết đáp án → chấm tay; không có nút chấm tay, không báo rõ | Cao |

## B. Lỗi / thiếu kèm theo cần quyết cách làm
1. **T07, T30: không thao tác chấm tay được.** Hiện "chấm tay" chỉ là nhãn ✎ (và xem bài mẫu nếu có). Chỗ gõ xong ra "thanh xám" không đúng/sai; bút ✎ ở góc không bấm được khi không có bài mẫu. Giáo viên muốn **bấm ✓ / ✗ cho chỗ chấm tay** (và số Đúng x/y cộng theo). Đề xuất: ✎ thành hai nút nhỏ ✓ / ✗ để giáo viên quyết tại chỗ; chỉ trong lúc chiếu, không lưu.
2. **T23: "đáp án xanh biển vẫn hiện ra (chưa thành quy luật)".** Chưa tái hiện được: cần biết thao tác ngay trước (bấm ✗? bật A rồi tắt? đổi trang?). Hỏi lại người dùng.
3. **Từng Task: sang Task sau, đáp án tự bật.** Chưa tái hiện. Đề xuất theo ý người dùng: lưu trạng thái làm bài và đáp án **theo từng Task**; vào Task chưa có dữ liệu thì trắng. Cần thao tác tái hiện (có bật công tắc "Sai thì hiện đáp án" không?).
4. **T26 (ô chữ tìm từ): chỉ xem, không xác định đáp án.** Yêu cầu mới: máy tìm vị trí từng từ trong lưới (ngang, dọc, chéo) để hiện đáp án (tô quanh từ) và cho giáo viên bấm kéo chọn từ.

## C. Cải tiến giao diện (từ ghi chú từng Task)
| Mã | Đề nghị |
|---|---|
| T03 | khi gõ vào chỗ trống bài đọc, ẩn nhãn (1) (2) của ô đang gõ (nhiễu) |
| T10 | ô tick: đáp án nằm trong ô tick; đúng/sai đổi màu chữ / dấu tick, không dùng khung xanh đỏ bao quanh |
| T02 | ghi chú "thiếu đáp án đúng ở lượt 2, lượt 4": hai lượt này không có chỗ trống (theo phiếu) nên không có đáp án. **Hỏi lại** có phải ý bạn không |
| G2 | Font Andika, cỡ 12: phiếu ra 10 trang; Task 14 cắt giữa trang 3–4, Task 22 trang 5, Task 10 trang 9. **Hỏi lại** đây là thông tin hay muốn đổi cách ngắt trang |

## D. Ý kiến chung: soạn phiếu (phần 1)
1. **T16, T17 ảnh:** ảnh đang tỉ lệ 3:4 nhưng kích thước khác nhau giữa hai Task. Đề nghị kích thước mặc định theo số ảnh trên hàng (2 ảnh / 3 ảnh / …), nút **Fit ô** (ảnh và dòng viết tự khít ô chứa), và một thanh kéo kích thước ảnh trong panel cho cả khối.
2. **T18 nối:** cột trái đang quá sát chấm nối; đề nghị chừa khoảng như khoảng sau "a." ở lựa chọn.
3. **T13 và T14 (đúng/sai):** T13 chỉnh khoảng theo tỉ lệ 70/30, T14 theo khoảng cách lề. Chọn **một** cách cho nhất quán.

## E. Ý kiến chung: trình chiếu (phần 2), tính năng mới
| # | Đề nghị | Ghi chú |
|---|---|---|
| E1 | Chế độ chọn trang: 1 trang / 2 trang | tính năng mới (1a không làm "2 trang") |
| E2 | Ctrl + lăn chuột zoom **theo đầu chuột**; có nút về 100%; thả ra về con trỏ | hiện zoom theo giữa màn hình |
| E3 | Chế độ **Trang** (chỉ trang đang chọn) hoặc **Cuộn** (thấy cuối trang trên và đầu trang dưới) | tính năng mới ("Cuộn" đã ghi "không làm ở 1a") |
| E4 | Shift + chuột = đường thẳng (mặc định nét vừa, màu đỏ); thả ra về con trỏ | đã có Shift kéo = đường thẳng; cần đổi mặc định đỏ / vừa và tự về con trỏ |
| E5 | Nút zoom cạnh nút Đáp án ở tiêu đề mỗi Task, bấm mở riêng Task đó (hotspot) | mới |
| E6 | **Đèn pin:** màn đen gần hoàn toàn, soi sáng từng vùng, lăn chuột đổi cỡ vùng sáng | mới |
| E7 | Từng Task: mặc định 80%, bấm → Vừa, bấm nữa → Mặc định; nút + − giữ nguyên | đổi cách phóng |
| E8 | Enter / phím ↓ đi tới ô đáp án **kế**, phím ↑ đi lên ô **trước** | hiện Enter sang chỗ kế, chưa có ↑ |
| E9 | Từng Task: lưu dữ liệu tương tác theo Task (xem B3) | |
| E10 | **Bảng: chế độ Text.** Chọn Text, bấm đâu viết đó, nhưng thẳng hàng trong cùng hàng | mới |
| E11 | **Hộp Note:** bấm đúp một vị trí trên phiếu → hộp text, nhập bằng gõ hoặc giọng nói (TTS); kích thước mặc định rồi mở rộng theo nội dung; thu gọn hoặc xóa được | mới |

## F. Đề xuất thứ tự (chờ "sửa")
1. Lỗi: T05, T15, T19, T20, C5 (chữ tràn) và "không báo khi chưa chọn".
2. Chấm tay ✓ / ✗ (B1) và ghi rõ "chấm tay" trên Task.
3. Cải tiến nhỏ: T03, T10, T18, khoảng T/F T13–T14, ảnh T16–T17.
4. Trình chiếu E2, E4, E7, E8, E9 (nhỏ, sửa dựa trên cái đã có).
5. Mới, cần thiết kế riêng, thảo luận trước: E1, E3, E5, E6, E10, E11, ô chữ tìm từ (B4), bảng viết tắt + gợi ý (đã có đề xuất).

## G. Cần người dùng trả lời
1. T23 và "sang Task sau tự bật đáp án": thao tác tái hiện?
2. T02 "lượt 2, lượt 4": là thông tin hay muốn hiện gì?
3. G2 (ngắt trang): chỉ ghi nhận hay muốn sửa?
