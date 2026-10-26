# Báo cáo phiên 3 (26/10/2026, trưa) — thiết kế lại kiến trúc trình bày. ĐỌC ĐẦU TIÊN

**Không sửa dòng code nào. App vẫn là v80.** Phiên này chỉ thảo luận và viết tài liệu. Theo CLAUDE.md: ý tưởng / thay đổi thiết kế thì thảo luận trước, chỉ code khi người dùng nói "làm đi".

## 1. Tài liệu mới (đều trong `docs/`)
- **`KIEN_TRUC_TRINH_BAY_MOI.html`**: bản mô tả kiến trúc mới, có hình minh họa 4 T và 12 Q. **Đây là bản để người dùng duyệt**; mở bằng trình duyệt.
- **`RA_SOAT_DANG_BAI.md`**: rà soát 63 dạng bài (31 có trong repo, 32 dự kiến), chấm % trình bày được của kiến trúc cũ (v80) và mới. Cũ 83%, mới 87% (có trọng số tần suất). **Điểm là phán đoán của Claude, không phải số đo trên app.** Sau khi thêm các thuộc tính ở mục 3 dưới đây ước tính phủ ~61/63 dạng.
- `DANG_DO_KEO_DOI_CHO_VA_G_TEXT.md` (25/10) **đã lỗi thời**, thay bằng file kiến trúc ở trên.

## 2. Kiến trúc mới (tóm tắt, chi tiết ở file HTML)
```
Task ── T (bố cục: 4 kiểu T1 Xếp dọc, T2 Ảnh trái, T3 Ảnh phải, T4 Ảnh trong bài đọc)
├─ G0  Tiêu đề (cố định, không xóa)
├─ G1  Ảnh chung (có điểm trên ảnh)
├─ G2  Bài đọc / lời dẫn (chỉ chữ, KHÔNG có ảnh riêng)
├─ G3  Câu hỏi ── Q (một Q cho cả G3)
│    ├─ block câu: Câu hỏi | Trả lời
│    └─ G3-Text (tiêu đề nhóm, nhãn, dòng hướng dẫn nhóm sau)
├─ G4  Khung từ: chữ HOẶC ảnh (không trộn), vị trí trên / dưới / phải
└─ G-Text (tự do, nhiều cái; đã có từ v73–v74)
Bài nhiều dạng = nhiều Task nối nhau (cơ chế "Nối vào Task trên" có sẵn)
```
- **T** = các khối G xếp thế nào. **Q** = dạng câu hỏi + cách trả lời + cách xếp câu. Luồng: chọn T → chọn Q → chỉnh kích thước.
- **12 Q:** Điền từ · Viết câu · Chọn A/B/C · Chọn trong câu · Đúng/Sai · Nhìn ảnh viết · Chọn ảnh · Nối · Tô chữ · Bảng · Lưới (ô chữ + word search) · Viết tự do.
- **Bỏ tầng A (A1–A8) khỏi giao diện:** cách trả lời nằm trong Q (mặc định theo Q, đổi được trong tùy chọn). Code vẽ A1–A8 và dữ liệu `answer` giữ để mở phiếu cũ.
- Thao tác chung cho mọi khối và block câu: chọn (trang hoặc cây cột trái) · sửa · **xóa** (nút + phím Delete, Ctrl+Z; bỏ kiểu "tắt mà giữ dữ liệu") · tạo · nhân đôi · đổi chỗ. G0 là khối duy nhất không xóa. Block câu cũng xóa / sửa / tạo được **ngay trên trang**, không chỉ ở cột trái.
- Dữ liệu cũ ánh xạ: `content.lead` → G2, `items` + `answer` → G3, `extras` → G-Text. **Phiếu cũ phải mở ra giống v80.**

## 3. Quyết định người dùng đã chốt (phiên này)
1. **Một G3 dùng một Q chung** cho mọi block câu trong đó.
2. **G2 không có ảnh riêng.** "Mỗi ảnh một nhà": ảnh cả Task → G1; ảnh một câu → block câu trong G3; ảnh lựa chọn dùng chung → G4 kiểu Ảnh; ảnh phụ → G-Text.
3. **G4 có kiểu Ảnh**, chữ hoặc ảnh, **không trộn** (ảnh được kèm chú thích dưới ảnh). Làm được ngay trên v80, không phải chờ kiến trúc mới.
4. **Bỏ tầng A riêng**, cách trả lời nằm trong Q.
5. Các thuộc tính thêm (đã đồng ý "Ok"): Q5 2–3 lựa chọn + nhãn tự đặt (Yes/No, T/F/NG) · Q4 nhãn A–D gắn trên đoạn gạch chân (tìm lỗi sai) · Q12 có khung trống để vẽ · mọi Q có công tắc "Có chỗ trả lời" · block câu có **người nói** và cờ **Ví dụ** (hiện sẵn đáp án, vd. "0. Example") · G2 có đoạn có nhãn A–F · Q Lưới gộp ô chữ và word search (bật / tắt số, viền).
6. Hai điểm **"tạm thời cứ để, xem xét sau"**: bài trộn nhiều dạng dùng Task nối (chưa cho G3 chia nhóm); đáp án chỗ trống của bài đọc là câu ở G3 còn chữ ở G2.

## 4. Chưa chốt / chưa làm
- **Người dùng chưa duyệt cuối cả bản kiến trúc** (mới đồng ý từng điểm ở mục 3). Việc đầu phiên sau: hỏi người dùng đã xem `KIEN_TRUC_TRINH_BAY_MOI.html` chưa và có chỗ nào muốn sửa.
- **Chưa có kế hoạch làm theo bậc.** Đề xuất của Claude (chờ duyệt, mỗi bậc phiếu cũ vẫn mở như v80, chạy đủ test từng bậc):
  1. Đổi nhóm giao diện: G2 = Bài đọc / Lời dẫn, G3 = Câu hỏi; thêm thứ tự khối ở cấp Task (sửa luôn lỗi Sunny Farm bài 1 phải dùng `### Phần:` để lách); xóa / tạo khối thống nhất.
  2. Q đặt ở G3, có hình xem trước khi rê chuột; A thu vào trong Q.
  3. Tách T / Q (bậc lớn nhất: code đang rẽ nhánh theo loại nội dung ở ~30 chỗ, có 28 test hồi quy): T chỉ còn bố cục Task, lưới / cột / nối / bảng / T-F chuyển thành cách xếp của Q.
  4. G3-Text (thay `### Phần:` khi cùng dạng).
  - Độc lập, làm lúc nào cũng được: **G4 kiểu Ảnh**.
- Đang treo từ báo cáo trước (`BAO_CAO_PHIEN_2026-10-26.md`): cú pháp MD cho G-Text / điểm trên ảnh / đáp án chỗ trống · tiêu đề phiếu / Họ tên Lớp Ngày / header footer · P3 (PDF thật + MD AI tạo + ảnh sau nạp) · 3 chỗ phát hiện khi dựng demo (danh sách số, khung từ ở Task chỉ ảnh, bài đọc tắt danh sách vẫn báo vàng) · cỡ chữ Nhỏ / Vừa / To mới là đề xuất.
- Chưa phủ dạng bài: flow-chart, Venn / mind map (cần sơ đồ tự do, làm sau). Header phiếu cũng nằm ngoài Task.

## 5. Cách làm việc người dùng muốn (đã có trong CLAUDE.md, nhắc lại)
Tiếng Việt, ngắn, thẳng, thân mật; góp ý trung thực, không khen cho có. **Ý tưởng / tính năng mới / đổi thiết kế → thảo luận trước, chưa code** (1–3 hướng, nói nên chọn gì và vì sao, hỏi tối đa một câu). Chỉ code khi sửa lỗi rõ ràng hoặc người dùng nói "làm đi / ok làm". Nói "chỉ thảo luận" thì không sửa file. Không dùng artifact; xong việc commit và push lên `main`.

## 6. Trạng thái repo cuối phiên
Tất cả đã commit và push lên `main` (`khanhtoaninv/WS-Editor`). Không có thay đổi chưa đẩy. Không chạy test (app không đổi); bộ test lần cuối đạt trên v79 (test1–27 + audit) và test28 trên v80 theo báo cáo trước.
