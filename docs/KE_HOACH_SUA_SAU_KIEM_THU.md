# Kế hoạch xử lý sau kiểm thử GĐ0 / 1a / 1b (28/10/2026)

> Tổng hợp từ: `docs/KIEM_THU_GD0_1A_1B.md` (Claude kiểm), `docs/KET_QUA_KIEM_THU_TAY_2026-10-28.md` (thử tay vòng 1), `docs/KET_QUA_KIEM_THU_PHIEU_DU_DANG_2026-10-28.md` (thử tay vòng 2, phiếu 32 Task), `docs/TUONG_TAC/BANG_VIET_TAT_CHUAN.md`.
> **Chưa làm gì.** Mỗi đợt chỉ bắt đầu khi người dùng bảo "sửa" / "làm". Đợt 1–3 là sửa lỗi và chỉnh nhỏ; đợt 4–5 là tính năng mới, phải thảo luận + hình minh họa trước.
> Đã chốt với người dùng: T02 không có vấn đề; ngắt trang (G2) giữ nguyên; gợi ý cách viết khác dùng **cách A** (chip dưới ô).

## Mỗi bản sửa đều phải qua
Đường chuẩn 120/120 (trừ chỗ cố ý đổi hình, phải báo và xin đổi chuẩn), giaodien 2497, 49 test cũ + audit, test 1a / 1b, `shared` test, nạp lại `tests/gd0/phieu-kiem-thu-tay.md` + chụp ảnh. Mỗi lỗi có test mới tái hiện trước khi sửa. Cập nhật spec, báo cáo phiên, tăng số bản, cập nhật trang kiểm thử tay cho người dùng thử lại.

## Đợt 1. Sửa lỗi chấm và nối (v113) — ưu tiên cao
| # | Việc | Nguồn | Lớp sửa |
|---|---|---|---|
| 1.1 | Nối có vế phải trùng chữ: hiện đáp án và làm bài tìm hàng theo **mã / thứ tự**, không theo chữ | B1, B2, T19 | `viewer/answers.ts`, `viewer/work.ts`, có thể thêm mã vế phải trên trang (chỉ thuộc tính) |
| 1.2 | Dấu câu: đáp án chỉ gồm dấu câu (hoặc chỗ trống là dấu câu) thì **so cả dấu**; câu chữ vẫn bỏ dấu thừa hai đầu như cũ | B3, T05 | `shared/normalize.ts` + test |
| 1.3 | Đúng/Sai: đáp án `T`/`F`/`Đúng`/`Sai`/`Y`/`N` khớp theo **chữ cái đầu** của nhãn (True/False, Yes/No, Right/Wrong) | B5, T15 | `core/slots.js` |
| 1.4 | Gõ dài không tràn ra ngoài trang: ô gõ dài tới hết bề ngang khung Task rồi xuống dòng | C5 | `viewer/work.ts`, `viewer.css` |
| 1.5 | Báo rõ chỗ **chưa có đáp án**: dấu "chấm tay" ngay trên Task trong trình chiếu (T/F chưa chọn, nối không xáo, điền từ không đáp án), không chỉ một con số ở thanh công cụ | C2, T20, T30 | `Presenter.tsx` |

## Đợt 2. Chấm tay và trạng thái đáp án (v114)
| # | Việc | Nguồn |
|---|---|---|
| 2.1 | **Chấm tay trong lúc chiếu:** chỗ chấm tay có hai nút nhỏ ✓ / ✗ để giáo viên quyết; bộ đếm Đúng x/y cộng theo; ✎ vẫn mở bài mẫu nếu có. Không lưu | T07, T30, T20 |
| 2.2 | **Đáp án tự hiện "lúc thấy lúc không":** viết test ngẫu nhiên (làm bài, đổi Task, đổi trang, bật/tắt A, bấm ✗, bật "Sai thì hiện đáp án") để bắt quy luật, rồi sửa | T23, "sang Task sau tự bật đáp án" |
| 2.3 | Lưu bài làm và đáp án đang hiện **theo từng Task**: vào Task chưa làm thì trắng | E9 |

## Đợt 3. Chỉnh giao diện nhỏ (v115)
| # | Việc | Nguồn |
|---|---|---|
| 3.1 | Gõ vào chỗ trống bài đọc: ẩn nhãn (1)(2) của ô đang gõ | T03 |
| 3.2 | Ô tick: đúng/sai thể hiện bằng màu dấu tick + chữ, bỏ khung xanh đỏ bao quanh | T10 |
| 3.3 | Bài nối: chừa khoảng giữa chữ vế trái và chấm nối | T18 |
| 3.4 | Đúng/Sai: chọn **một** cách căn T/F (tỉ lệ 70/30 hoặc cách lề) cho mọi kiểu. Cần người dùng chọn | T13, T14 |
| 3.5 | Nút Xóa nét vẽ có chữ, thêm "Xóa nét trang này" | C4 |
| 3.6 | Trình chiếu: Ctrl + lăn chuột phóng **theo đầu chuột**; nút về 100% | E2 |
| 3.7 | Shift + kéo = đường thẳng màu đỏ, nét vừa; thả ra về con trỏ | E4 |
| 3.8 | Từng Task: mặc định 80% → Vừa → Mặc định | E7 |
| 3.9 | Enter / ↓ sang ô đáp án kế, ↑ về ô trước | E8 |
| 3.10 | Ảnh T16–T17: kích thước mặc định theo số ảnh trên hàng, nút **Fit ô**, thanh kéo kích thước cả khối (cần hình minh họa trước vì đụng dàn trang, đổi chuẩn 120) | Ý kiến chung phần 1 |

## Đợt 4. Chấm thông minh hơn (v116) — đã có đề xuất, chờ duyệt bảng
| # | Việc | Nguồn |
|---|---|---|
| 4.1 | Bảng viết tắt chuẩn trong máy chấm (`I'm` = `I am`…) + công tắc "Phân biệt viết tắt" | B6, `BANG_VIET_TAT_CHUAN.md` |
| 4.2 | Gợi ý cách viết khác bằng chip dưới ô đáp án (cách A) | `MINH_HOA_GOI_Y_DAP_AN.png` |
| 4.3 | Ô chữ tìm từ (Q11): máy tìm vị trí từ trong lưới, hiện đáp án, cho kéo chọn từ khi làm bài | T26 |
| 4.4 | Prompt PDF → MD: quy tắc 26 ghi `[x]` cho ô đúng của bảng chọn | Task 9 phiếu thật |

## Đợt 5. Tính năng trình chiếu mới — thảo luận + hình minh họa từng cái trước
E1 xem 1 trang / 2 trang · E3 chế độ Trang / Cuộn · E5 nút phóng riêng Task cạnh nút Đáp án · E6 đèn pin · E10 bảng trắng chế độ Text (thẳng hàng) · E11 hộp Note (bấm đúp, gõ hoặc nói, co giãn, thu gọn / xóa).

## Song song: bàn giao cho dev
Gói `docs/BAN_GIAO_DEV/` (mục tiêu, phạm vi, quy trình phát hành, nợ kỹ thuật + chuẩn bị deploy, bảng đối chiếu). Nên làm **sau đợt 1–2** để dev nhận bản đã sửa lỗi chấm; chờ người dùng bảo "làm".

## Rủi ro
- 1.1, 1.4, 3.x có thể đổi hình trang chiếu nhưng không đổi trang soạn: đường chuẩn phải vẫn 120/120; riêng 3.3, 3.4, 3.10 đổi trang soạn → xin người dùng đổi chuẩn.
- 1.2, 1.3, 4.1 đổi cách chấm: phải cập nhật `shared/fixtures` và báo trong ghi chú thay đổi (TeacherResource sau này dùng chung).
- 2.2 chưa có quy luật: có thể cần người dùng quay màn hình khi gặp lại.
