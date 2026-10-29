# Thử tay T1 · Duyệt bài + Lịch sử (v125)

Mở `ws-editor.html` (bấm đúp). Khi chưa có màn Ra đề / AI, bật chế độ tạo bài cho phiếu đang mở:
nút **?** trên thanh trên → **Thử chế độ tạo bài cho phiếu này**. (Từ T3: dùng nút **Tạo bài** cạnh "+ Phiếu".)

| # | Làm | Mong đợi |
|---|---|---|
| 1 | Bật chế độ tạo bài | Dải xanh đậm trên cùng: `① Ra đề › ② Biên tập` · tên phiếu · **Duyệt bài 0/N** · 🕘 Lịch sử phiếu · **Xuất bản**. Mỗi dòng Task ở cây có **○** cuối dòng. Ba cột editor giữ nguyên |
| 2 | Bấm **Duyệt bài** | Ngăn trượt đè lên cột phải (inspector), mở ở bài 1; bài 1 được chọn trên trang |
| 3 | **✓ Duyệt bài này** | Bài 1 thành ✓, ngăn tự sang bài chưa duyệt kế tiếp, số đếm 1/N |
| 4 | Đóng ngăn (✕), sửa chữ bài 1 trong cột trái | Bài 1 về ○; mở lại ngăn ở bài 1: dòng cam "Đã sửa sau lần duyệt hh:mm → chưa duyệt" |
| 5 | Sửa ngược lại y như cũ | Bài 1 lại ✓ |
| 6 | Duyệt bài 1 bốn lần (mỗi lần sửa chút ít) | "Lịch sử bài này" giữ 3 lần gần nhất, bản mới nhất ghi "đang dùng" |
| 7 | **Dùng bản này** ở bản cũ nhất | Bài 1 thành bản đó, ✓. **↶ Hoàn tác** đưa về như trước |
| 8 | **✓ Duyệt phiếu** vài lần (đổi độ tuổi giữa các lần) | 🕘 Lịch sử phiếu giữ 3 bản, dòng đầu "mới nhất" |
| 9 | Lịch sử phiếu → **Xem** một bản cũ | Dải chuyển màu nâu "Đang xem bản duyệt phiếu hh:mm · chỉ đọc"; cột trái / phải mờ, không sửa được; **Về bản hiện tại** đưa phiếu đang làm về nguyên vẹn |
| 10 | **Khôi phục** một bản | Hỏi xác nhận; phiếu về bản đó; lịch sử phiếu và lịch sử từng bài vẫn còn; Hoàn tác được |
| 11 | **Xuất bản** khi còn bài chưa duyệt | Hộp nhắc "Bài 2 chưa duyệt · …"; **Mở ngăn duyệt** đưa tới bài chưa duyệt; **Vẫn xuất bản** = Duyệt phiếu + mở hộp Gói .wsp |
| 12 | Xuất MD / Gói .wsp | Không có lịch sử, không có dấu duyệt (chỉ phiếu). Xem JSON thì vẫn thấy `gen` |

Ghi lại chỗ nào khó hiểu / không như mong đợi.
