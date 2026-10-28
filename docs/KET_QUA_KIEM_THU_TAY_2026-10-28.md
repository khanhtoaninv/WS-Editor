# Kết quả kiểm thử tay GĐ0/1a/1b do người dùng nhập (28/10/2026) và phân loại

Nguồn: trang kiểm thử tay (artifact), 21 mục. Chưa sửa gì; chờ người dùng bảo "sửa".
Đạt: B4, B6, B7, C1, C6, C7, C9, C10. Bỏ qua: B8, C3, C8, C11, C12. Chưa thử: C13. Lỗi: B1, B2, B3, B5, C2, C5.

| Mục | Người dùng ghi | Phân loại | Việc đề xuất |
|---|---|---|---|
| B1, B2 | Bài nối: a và b cùng nối vào "yes" hàng 1, c nối "no". Chỉ hiện khi bật Xáo đáp án; tắt thì không ra | **Lỗi** (đã biết, báo cáo mục 2.1): tìm hàng vế phải theo chữ. Phần "tắt Xáo thì không ra" là **theo thiết kế** (không có đáp án đúng thì chấm tay) | Sửa tìm hàng theo mã/thứ tự. Xem lại tên công tắc "Xáo vế phải" cho dễ hiểu |
| B3 | Gõ `. , ? !` đều ra xanh | **Lỗi** (báo cáo mục 2.2): dấu câu ở đầu/cuối bị bỏ qua nên mọi dấu bằng nhau | Chấm dấu câu khi đáp án chỉ là dấu câu; thêm tùy chọn cho từng chỗ |
| B5 | T/F: "Không cho ra kết quả" | **Lỗi** (báo cáo mục 2.3): đáp án `T`/`F` không khớp nhãn True/False nên cả Task chấm tay, chỉ có cảnh báo nhỏ | Cho `T`/`F`/`Đúng`/`Sai` khớp theo chữ cái đầu nhãn; hiện rõ "chấm tay" ngay trên Task |
| B6 | (Đạt) Muốn chấm nội dung hơn chính tả: bỏ qua hoa/thường chữ đầu (trừ tên riêng, I), thừa khoảng trắng, **I am = I'm, He is = he's, My name is = my name's**, bỏ ký tự thừa vô nghĩa cuối câu | **Ý mới / đổi quyết định**. Đã có: hoa-thường, khoảng trắng, nháy cong, thừa dấu cuối. Chưa có: viết tắt. GĐ0 từng quyết "không tự mở rộng viết tắt" | Thảo luận trước: thêm bảng viết tắt chuẩn (I'm, he's, don't…) hay để người soạn ghi ` / `. Lưu ý `he's` = he is hoặc he has; tên riêng phân biệt hoa thường |
| C2 | Task không có đáp án, hệ thống không báo | **Cần tái hiện**: kế hoạch có "n chỗ chưa có đáp án" trên thanh công cụ (chỉ là số tổng, thanh có thể đang ẩn) | Hỏi lại phiếu và Task nào; cân nhắc báo theo từng Task |
| C3 | Chỉ chiếu được một phiếu mỗi lúc | Theo thiết kế (app mở một phiếu), không phải lỗi. Rủi ro hai phiếu trùng tiêu đề dùng chung nét vẫn còn | Giữ; chưa cần sửa |
| C4 | "Bổ sung nút Xóa" nét vẽ | **Cải tiến giao diện**: đã có nút 🗑 "Xóa hết nét vẽ" nhưng chỉ là biểu tượng, và bị mờ khi chưa có nét. Chỉ xóa cả nét vẽ, chưa xóa trong một trang/Task riêng | Thêm chữ cho nút; tùy chọn "Xóa nét trang này" |
| C5 | Gõ nhanh 100 ký tự: tràn hàng ra ngoài trang | **Lỗi**: gạch dài ra theo chữ nhưng không giới hạn bề ngang trang | Cho xuống dòng/giới hạn bề rộng ô gõ trong khung Task |
| C6 | Ô gõ dở hiện đỏ, đáp án xanh nhỏ ở góc trên trái | Theo thiết kế (đáp án hiện nhỏ phía trên ô đã có chữ), người dùng chấm Đạt | Có thể bàn lại độ nổi bật |
| C13 | Chưa thử phiếu thật | Còn mở | Chờ người dùng |

## Câu hỏi cần người dùng
1. B6: có muốn máy tự coi `I am` = `I'm`, `He is` = `He's`… là đúng không, hay người soạn tự ghi ` / `?
2. C2: Task nào không có đáp án mà không thấy báo (để tái hiện)?
