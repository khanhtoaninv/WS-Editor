# Thử tay T4 · Thiết lập + Kho phiếu (v128) · Sinh bài (v129)

Mở **qua máy chủ**: bấm đúp `chay-lop.bat` (hoặc `npm run lop`) → trình duyệt mở `http://localhost:1531/editor`. Dữ liệu giáo trình lần đầu được chép từ bộ mẫu vào `server/du-lieu/tao-bai/du-lieu/` (sửa / nạp ở màn Thiết lập). Quy tắc sinh bài đang dùng: `docs/TAO_BAI/QUY_TAC_SINH_BAI.md` (góp ý theo mã S…).

## Phần 1 · Thiết lập + Kho phiếu (không cần khóa AI)

| # | Làm | Mong đợi |
|---|---|---|
| 1 | Nút **☰** (thanh trên, cạnh "?") | Menu: Kho phiếu · ⚙ Thiết lập · Tạo bài |
| 2 | **⚙ Thiết lập** › Giáo trình | Pinta English 3 → Unit 5 → 4 lesson; mỗi lesson: nhãn chuyên đề, "tạo bài được", Kiến thức v1 · Xem · Thay… · Bỏ |
| 3 | **Thay…** Kiến thức Lesson 2 bằng một file `.md` của bạn | Hỏi thay (bản cũ giữ trên máy chủ, thư mục `tao-bai/_cu`); dòng đổi phiên bản theo dòng `Phiên bản:` trong file. Mở Ra đề › Lesson 2: mục tiêu theo file mới |
| 4 | Chọn file ảnh / `.docx` để nạp | Báo "chỉ nhận file chữ .md hoặc .txt", không nạp |
| 5 | **Bỏ** Kiến thức Lesson 1 | "chưa có", lesson "1 lỗi: chưa tạo bài được"; Ra đề › Lesson 1 báo lỗi + nút **Mở Thiết lập để nạp file** |
| 6 | **＋ Nạp giao-trinh.md** / **Nạp cả thư mục…** (thư mục theo `DINH_DANG_TAM.md`) | Giáo trình mới hiện trong cây; file sai chỗ bị bỏ qua và báo |
| 7 | Tab **Dạng phiếu** | Mỗi chuyên đề: Trình tự, TF (Xem / Thay / Bỏ); File dùng chung 1–5 (bản mặc định / bản đã nạp; **Về mặc định**) |
| 8 | Tab **AI** khi chưa có khóa | "Chưa có khóa… Sinh bài dùng chế độ AI ngoài"; Model Claude: Sonnet 5.5 / Haiku 5.5 / Model khác… |
| 9 | Mở bằng máy khác cùng wifi (`http://<ip>:1531/editor`) | Thiết lập chỉ xem ("Máy này chỉ xem được…"); đăng nhập `/gv` trên máy đó thì sửa được |
| 10 | Bấm đúp thẳng `ws-editor.html` (không máy chủ) → ⚙ Thiết lập | "chỉ xem"; tab AI hướng dẫn AI ngoài; Kho phiếu báo cần máy chủ |

## Phần 2 · Sinh bài bằng AI ngoài (không cần khóa)

| # | Làm | Mong đợi |
|---|---|---|
| 11 | Tạo bài › Lesson 2 › **Duyệt cấu trúc · Sinh bài** | Phiếu khung, dải trên "AI ngoài · 5 bài chờ dán kết quả AI", ngăn Duyệt mở ở bài 1, hộp **AI ngoài** mở sẵn |
| 12 | **1 · Chép đoạn nhắc** → dán sang Claude / ChatGPT / Gemini… | Đoạn nhắc ~10 nghìn ký tự: quy tắc MD, dạng Q, Kiến thức, Trình tự, TF, cấu trúc phiếu, "BÀI CẦN VIẾT: Bài 1 · …" |
| 13 | Dán câu trả lời của AI vào **2 · Dán kết quả** → **Nạp kết quả** | Bài 1 thành nội dung thật, cây ○ (hoặc ⚠ kèm lý do ở Kiểm tra); dải còn 4 bài chờ |
| 14 | Cố ý dán bản thiếu một câu | "App đọc thấy lỗi: sai số câu…"; **Chép đoạn nhắc sửa lỗi** (đoạn nhắc kèm bản vừa dán + lỗi) / **Vẫn dùng bản này** (bài ⚠) |
| 15 | Bài đã có: gõ góp ý → **1 · Chép đoạn nhắc sinh lại** | Đoạn nhắc có "Bản hiện tại của bài này" + "Góp ý của giáo viên" |

## Phần 3 · Sinh bài qua máy chủ (cần khóa Claude)

| # | Làm | Mong đợi |
|---|---|---|
| 16 | Thiết lập › AI: dán khóa, chọn **Claude Sonnet 5.5** (hoặc Haiku 5.5), **Lưu**, **Thử kết nối** | "Đang dùng: Claude Sonnet 5.5"; ô khóa trống, chỉ hiện `…4 số cuối`; Thử kết nối "✓ Nối được" |
| 17 | Tạo bài › Lesson 2 › ghi chú "chủ đề cắm trại" › Sinh bài | Dải trên "AI: Claude Sonnet 5.5 · ⏳ AI đang viết 5 bài…" + **Dừng**; bài xong hiện dần (⏳ → ○ / ⚠); cuối: "Sinh xong: …" |
| 18 | Xem từng bài trong ngăn Duyệt | Mục tiêu, Ngữ cảnh, "Viết bởi Claude Sonnet 5.5 · k lượt" (k > 1 = có gửi lại sửa lỗi); Kiểm tra (máy kiểm); đáp án; bật **Hiện đáp án trên trang** để soát |
| 19 | Góp ý (vd "mỗi câu trả lời chỉ ghép được một câu hỏi") → **Sinh lại** | Bài ⏳ rồi thay bằng bản mới theo góp ý; bản đã duyệt (nếu có) vẫn trong Lịch sử bài |
| 20 | Trong lúc một bài đang ⏳, sửa tay bài đó | Bài không bị thay; ngăn Duyệt: "AI đã viết xong khi bài đang được sửa tay…" + **Dùng bản AI vừa viết** |
| 21 | ① Ra đề → đổi số câu một bài → Sinh bài | Chỉ bài đổi được sinh lại |
| 22 | ☰ › Kho phiếu | Phiếu vừa sinh có trong kho (tự lưu khi sinh xong); **Mở** / **Bỏ** |
| 23 | Thử cả **Haiku 5.5** cho cùng lesson | So chất lượng (ghi lại cho T6) |

**Góp ý cho quy tắc sinh bài**: ghi theo mã ở `QUY_TAC_SINH_BAI.md` (vd "S9: 3 bài đầu trùng ngữ cảnh", "S17: thiếu Ngữ cảnh nên gửi lại"). Nếu được, gửi kèm phiếu (Xem JSON) và vài dòng nhật ký `server/du-lieu/tao-bai/nhat-ky.jsonl` (model, token, số lượt; không có khóa).
