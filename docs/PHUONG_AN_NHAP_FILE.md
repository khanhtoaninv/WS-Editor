# Phương án: nhập bài từ file (PDF / MD / chữ dán) vào WS Editor

Ngày: 2026-10-25. Trạng thái: **P0, P1, P2 ĐÃ LÀM (v63–v65, 25/10/2026)**; còn P3, P4. Dựa trên lần thử với phiếu "Wonders of the Sea" (Our World 4, WS 6.1). Kết quả từng bước: `claude/WS_EDITOR_SPEC_v37_bo_sung.md` mục AC, AD, AE và mục 7 dưới đây.

## 1. Hiện trạng trước khi làm (đã kiểm chứng ở v62; đã sửa ở v63–v65)
1. Không có nút tạo phiếu mới. Phiếu luôn mở sẵn 18 Task mẫu; chỉ có "+ Task" và "Dán…". → *v64: có "+ Phiếu".*
2. Hộp Dán mặc định "Một Task": dán cả đề thì ra 1 Task nhiều trăm "câu". Ctrl+V chỉ tự sang "Cả đề" khi chưa chọn Task nào. → *v63: tự chọn Cả đề, cảnh báo dán dài.*
3. Chế độ "Cả đề" tách sai với chữ copy từ PDF: 7–9 Task thay vì 6, tiêu đề lẫn, ô chữ thành Task 129–133 "câu", hai nhóm "Students 1 and 2 / 3 and 4" trộn. → *v63: nhận số hoạt động trần; đường chính là JSON / MD.*
4. Dán nội dung JSON vào Dán: bị hiểu là bài đọc, 754 câu, phiếu 13 trang, tràn. Không báo gì. → *v63: nhận ra JSON.*
5. Nạp JSON thiếu trường cấp phiếu (schema, age, page, spacing, flow): app lỗi giữa chừng, màn hình hỏng. → *v63: tự bù; lỗi không đổi phiếu.*
6. Dán luôn CHÈN Task mới sau Task đang chọn, không ghi đè (đã tái hiện); nhưng Task mới tự mở nên trông như ghi đè, và không có thông báo vị trí chèn. → *v64: luôn vào cuối phiếu, báo số Task.*
7. Task không có tên (typeName rỗng) hiện trống trong cột trái. → *v63: lấy tiêu đề, rồi mô tả.*

## 2. Nguyên tắc
- Bộ tách bằng luật không đủ cho PDF sách (bố cục 2 cột, lưới, bong bóng). Đừng cố vá luật mãi.
- Tách việc làm 2 lớp, nối nhau bằng một định dạng chung đã có: JSON Task (schema 0.3).
  - Lớp A, TRÍCH: biến file thành JSON Task (có thể là luật, AI trong Studio, hoặc Claude trong chat).
  - Lớp B, NHẬP: app nhận JSON Task, kiểm tra, cho người dùng xem lại, rồi đưa vào phiếu.
- Lớp B luôn là cửa duy nhất vào phiếu. Mọi nguồn (PDF, MD, dán chữ) đều qua đó.
- Nhập không bao giờ ghi đè Task có sẵn. Người dùng chọn rõ: "Phiếu mới" hay "Thêm vào phiếu này".
- Không cần giống bố cục tài liệu gốc; chỉ cần đủ nội dung (người dùng đã xác nhận).
- Không đổi code của Studio: tích hợp qua hook `window.WSImport` (cùng kiểu `window.WSAudioUpload` đã có).

## 3. Các bước

### P0 — Sửa lỗi nhỏ, làm ngay (nhỏ, ít rủi ro) — **XONG (v63)**
- Nạp JSON chịu thiếu trường: tự bù schema, age, page, spacing, flow, id/tên Task. File chỉ có `tasks` vẫn nạp được.
- Task không tên: cột trái lấy tên từ tiêu đề, nếu không có thì từ mô tả thành phần.
- Hộp Dán nhận ra JSON phiếu/Task: không xử lý như chữ; hỏi "Nạp thành phiếu mới" hoặc "Thêm các Task này vào phiếu hiện tại".
- Hộp Dán tự chọn chế độ: nhiều hoạt động ("1 …", "2 …", "Activity …") thì "Cả đề", không phải "Một Task". Có chọn tay.
- Cảnh báo dán quá dài: hơn khoảng 40 dòng vào một Task thì hiện cảnh báo trước khi nhập.
- Sau khi nhập: thông báo "Đã chèn N Task sau Task k", cuộn tới Task đầu, Task cũ vẫn thấy ngay phía trên.

### P1 — Cửa vào "Phiếu mới / Nhập file" — **XONG (v64), theo quyết định mục 5**
- Thêm nút "Phiếu mới" (trống) và "Nhập file…" cạnh "+ Task", "Dán…". *(Thay bằng quyết định mục 5: chỉ "+ Task" và "+ Phiếu".)*
- "Nhập file" nhận: JSON (phiếu hoặc Task), MD theo quy ước (P2), TXT. Chọn đích: "Phiếu mới" (mặc định) hoặc "Thêm vào phiếu này".
- Màn hình xem lại (mở rộng hộp Dán hiện có): mỗi Task một dòng có mô tả cấu hình, độ chắc, bỏ chọn, đổi thứ tự, sửa tiêu đề; cảnh báo nếu phiếu sau nhập quá N trang hoặc có tràn. *(Đã làm: mô tả, độ chắc, bỏ chọn, ước tính trang + lỗi tràn. Chưa làm: đổi thứ tự, sửa tiêu đề trong bảng — sửa sau khi nhập trong cột trái.)*
- Hoàn tác một lần cho cả lần nhập.

### P2 — Quy ước MD trung gian (cho tài liệu tự soạn, và làm đầu ra khi đọc PDF) — **XONG (v65)**
- Mỗi Task bắt đầu bằng một tiêu đề cố định (ví dụ `## Task: …`), nên tách chắc chắn, không đoán.
- Có chỗ cho: hướng dẫn, track nghe, khung từ, ảnh `[ảnh: …]`, danh sách câu, bảng (dòng `|`), hội thoại (`Tên: …`), khối lưới chữ cái cho ô chữ.
- Phần đáp án nằm riêng, không lẫn vào đề.
- Soạn một trang quy ước + 2–3 ví dụ (trong đó có phiếu Sea) và lưu vào Project. → `claude/QUY_UOC_MD.md`, `claude/tests/md/*.md`.

### P3 — Đọc PDF — **CHƯA LÀM**
- Con đường dùng ngay, trong chat: gửi PDF, Claude đọc và ra JSON Task đủ trường (như phiếu Sea). Người dùng nạp qua P1. Phù hợp khi làm vài phiếu.
- Con đường trong Studio: hook `window.WSImport.extract(file) → {tasks:[…]}`; Studio gắn dịch vụ AI của nó vào. Editor chỉ kiểm tra kết quả rồi cho xem lại (P1). Editor không gọi AI trực tiếp. *(Hook đã có ở v64: chọn file không phải JSON/MD/TXT thì gọi hook nếu có.)*
- Với cả hai: dùng đúng một JSON Task, nên chuyển qua lại không đổi code Editor.
- Chạy thử trên 5–10 PDF thật để đo: số Task đúng, số chỗ phải sửa tay, trước khi hứa tự động hoàn toàn.

### P4 — Dạng ô chữ và nhóm — **CHƯA LÀM** (MD đã có khối `Ô chữ:`)
- Ô chữ làm thành mẫu có sẵn "Ô chữ" (dùng lại bảng + khung từ, không thêm dạng mới): dán một khối chữ, mỗi dòng là một hàng; ẩn cột/hàng đầu thừa và bộ chỉnh từng cột.
- Đáp án ô chữ: bản đáp án tô sáng ô; nếu quá rườm thì bỏ.
- Phiếu con/nhóm ("Students 1 and 2"): quyết định thiết kế sau. Tạm thời mỗi nhóm là một phiếu riêng khi nhập.

## 4. Thứ tự và kiểm thử
- Làm P0, rồi P1, rồi P2, P3 song song với việc thử PDF thật, cuối cùng P4.
- Mỗi bước: cập nhật spec, chạy lại toàn bộ test hiện có, thêm test mới (nạp JSON thiếu trường, dán JSON, dán cả đề chọn đúng chế độ, nhập vào phiếu mới, nhập không ghi đè), đăng lại cùng link.
- Dùng phiếu Sea làm kiểm thử chuẩn; đo thêm với phiếu "Get Well Soon!" và các PDF bạn gửi.

## 5. Quyết định đã chốt (người dùng, 2026-10-25)
1. Giao diện chính có đúng 2 nút nhập: **+ Task** và **+ Phiếu**. Bỏ nút "Dán…" riêng; hộp nhập gom vào hai nút này.
2. **+ Task**: thêm Task vào phiếu đang mở, LUÔN đặt ở cuối phiếu (không chèn sau Task đang chọn).
   - Nguồn có 1 Task: chèn luôn, báo "Đã thêm 1 Task vào cuối phiếu".
   - Nguồn có nhiều Task: cảnh báo và hiện bảng nhận diện sơ bộ "file có các Task sau"; liệt kê theo thứ tự trong JSON; người dùng tick Task nào muốn nhập (mặc định tick hết).
   - JSON cả phiếu đưa vào + Task: chỉ lấy các Task, bỏ cài đặt cấp phiếu, và nói rõ trong thông báo.
   - Hộp có hai thẻ: "Mẫu có sẵn" (thư viện hiện có) và "Từ file / dán".
3. **+ Phiếu**: tạo phiếu mới từ file. Cùng bảng nhận diện sơ bộ nhưng KHÔNG chọn; chỉ hỏi "Làm tiếp không?". Áp cả cài đặt cấp phiếu; trường thiếu thì bù mặc định.
   - Có thể bấm khi ô nhập để trống: tạo phiếu rỗng.
   - Phiếu hiện tại sẽ bị thay (nạp phiếu xóa lịch sử Hoàn tác): xác nhận trước, kèm nút tải JSON phiếu cũ.
4. Bảng nhận diện sơ bộ mỗi dòng: số thứ tự theo file, tiêu đề, mô tả cấu hình (descOf), số câu/hàng, cảnh báo (thiếu ảnh, khung từ không khớp chỗ trống, JSON sai); cuối bảng: ước tính số trang sau khi nhập.
5. Nguồn nhập chính là JSON (do Claude đọc PDF ra, hoặc AI của Studio qua hook `window.WSImport`). Chữ thô (không phải JSON) là đường phụ trong cùng hộp, ghi rõ "đoán, độ chắc thấp". Hộp tự nhận ra JSON hay chữ thô.
6. Mỗi file một phiếu. File có nhiều nhóm (như "Students 1 and 2 / 3 and 4") thì tách thành nhiều file. Chưa làm danh sách phiếu trong một file.
7. PDF làm bằng đường chat trước (Claude ra JSON đủ trường → nạp); nối AI trong Studio sau. Chưa cần nạp thẳng file PDF trong app.
8. Lỗi (JSON hỏng, thiếu `tasks`, quá lớn, ví dụ hơn 40 Task) phải báo rõ và KHÔNG đổi phiếu đang mở.
9. Task nhập vào luôn được cấp ID mới; giữ thứ tự trong file.
10. Nhập không bao giờ ghi đè Task có sẵn.

## 6. Việc cụ thể cho P0 và P1 (theo quyết định ở mục 5) — đã làm hết
P0 (làm trước, sửa lỗi nhỏ):
- `loadSheet`/`migrate`: bù trường thiếu (schema, id, age, page, spacing, flow, answer, spacing Task, tên Task); nạp lỗi không được làm hỏng phiếu đang mở.
- Cột trái: Task không tên thì lấy tiêu đề, rồi mô tả thành phần.
- Nhận ra JSON trong ô nhập; hộp tự chọn "Cả đề" khi chữ có nhiều hoạt động; cảnh báo khi dán quá dài.
- Thông báo vị trí chèn; cuộn tới Task mới.
P1:
- Gộp "+ Task" (hai thẻ Mẫu có sẵn / Từ file hoặc dán) và thêm "+ Phiếu"; bỏ "Dán…" ngoài cột trái.
- Bảng nhận diện sơ bộ dùng lại phần xem lại của hộp Dán hiện có (đã có tick từng Task, độ chắc, chọn mẫu khác).
- Hoàn tác một lần cho cả lần nhập vào phiếu hiện tại (+ Phiếu thì không hoàn tác được, nên có xác nhận).
Kiểm thử mới: nạp JSON thiếu trường; dán JSON; dán cả đề chọn đúng chế độ; + Task thêm vào cuối; nhiều Task có bảng chọn; + Phiếu có xác nhận; lỗi không đổi phiếu; ID không trùng. → test12, test13 (và test14 cho P2).

## 7. Kết quả và quyết định tự chọn khi làm (25/10/2026)
- **v63 (P0), v64 (P1), v65 (P2)**; trên v65 đạt: test1–14, audit, audit2, `cmp_paste.py` (20/20 giống v62), `ws_sea.py`.
- Quyết định tài liệu chưa chốt, đã chọn theo đề xuất:
  - `typeName` thiếu: không ghi vào dữ liệu, chỉ hiển thị tiêu đề → mô tả (`taskLabel`).
  - `{tasks:[…]}` không có trường cấp phiếu = danh sách Task (không báo "cả phiếu").
  - "Chèn luôn" áp cho **chọn file** JSON/MD có đúng 1 Task; dán chữ (kể cả 1 Task) luôn qua bảng vì là đoán.
  - Mẫu có sẵn (thẻ 1 của + Task) cũng vào cuối phiếu.
  - + Phiếu không hỏi xác nhận khi phiếu hiện tại không có Task; + Phiếu chặn khi còn Task hỏng, + Task bỏ qua Task hỏng.
  - Chọn file không phải JSON/MD/TXT (vd PDF): gọi `window.WSImport.extract` nếu có, không thì báo gửi PDF cho Claude trong chat.
  - Số hoạt động trần ("2 Work with…") là đầu Task khi cắt cả đề và được bỏ khỏi tiêu đề.
  - Giới hạn 40 Task / 8 MB một lần nhập. Hộp "Dán nhiều câu vào Task đang soạn" giữ riêng.
- Chưa làm trong P1: đổi thứ tự và sửa tiêu đề ngay trong bảng nhận diện (sửa sau khi nhập ở cột trái).
