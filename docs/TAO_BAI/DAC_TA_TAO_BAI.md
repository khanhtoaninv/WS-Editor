# Đặc tả module Tạo bài (theo giáo trình)

Bản 1 · 29/10/2026 · trạng thái: **T0–T3 đã code (v124–v127, phiên 17; WS_EDITOR_SPEC mục 55–58)**, T4–T6 chưa. Thay cho phần quy trình trong `0_THIET_KE.md` (file đó giữ làm nhật ký quyết định).
Hình mẫu: `docs/MINH_HOA_TAO_BAI.html` (màn Ra đề), `docs/MINH_HOA_TAO_BAI_B.html` (Biên tập, vẽ trên editor v123 thật).
Kế hoạch làm: `KE_HOACH_TRIEN_KHAI.md`. Cấu trúc các file dữ liệu (Kiến thức, Trình tự, TF, file chung): **thảo luận riêng**; đặc tả này chỉ nêu app cần đọc được gì.

---

## 1. Mục tiêu và phạm vi

Giáo viên chọn một lesson, duyệt cấu trúc phiếu, app sinh toàn bộ bài theo đúng bố cục và dạng câu hỏi của WS Editor; giáo viên duyệt, sửa, sinh lại từng bài rồi xuất bản. Mục tiêu chất lượng: bài đúng ngay, giáo viên sửa ít nhất.

Trong phạm vi bản này:
- Tạo bài **theo giáo trình** (giáo trình → unit → lesson). Bài tự do: để sau.
- Hai giai đoạn: **① Ra đề → ② Biên tập**.
- Kiểm tra chất lượng (máy kiểm + AI chấm), lịch sử theo lần Duyệt.

Ngoài phạm vi: trang admin nạp dữ liệu đầy đủ, trang thống kê cho admin, bài tự do, tài khoản / nhiều giáo viên.

## 2. Nguyên tắc (không phá)

1. **Editor giữ nguyên bố cục.** Không sửa ba cột, inspector, thanh công cụ hiện có. Module chỉ gắn thêm: một dải trên cùng, biểu tượng trạng thái trong cây, một ngăn trượt.
2. **Cấu trúc do code, nội dung do AI.** Số bài, thứ tự, vai trò, dạng Q, số câu lấy từ Trình tự / TF và do giáo viên duyệt; AI không được đổi.
3. **AI không ghi thẳng vào phiếu.** Kết quả AI là MD, phải qua đúng bộ đọc MD của app (`core/md.js`) và máy kiểm trước khi hiện.
4. **Không đoán rồi lặng lẽ áp dụng** (nguyên tắc chung của app): chỗ lỗi phải hiện ra cho giáo viên.
5. **Giáo viên quyết định cuối cùng.** Kiểm tra chỉ cảnh báo, không chặn Duyệt / Xuất bản.
6. Phiếu tạo từ module vẫn là phiếu WS Editor bình thường: dàn trang, Xuất MD, gói `.wsp`, trình chiếu, Live dùng như cũ.

## 3. Dữ liệu đầu vào

```
Giáo trình
 ├─ Chuyên đề (vd Ngữ pháp, Nghe)
 │    ├─ Trình tự  (có phiên bản)
 │    └─ TF        (có phiên bản)
 └─ Unit
      └─ Lesson → thuộc đúng 1 chuyên đề, có file Kiến thức riêng
Bộ file chung của hệ thống (mọi giáo trình): 1 quy tắc MD, 2 mô tả dạng Q, 3 quy tắc hình thức, 4 rubric, 5 phiếu mẫu
```
- Mỗi lesson thuộc **đúng một** chuyên đề. Khi tạo bài: Kiến thức (lesson) + Trình tự + TF (chuyên đề) + file chung.
- Chuyên đề thiếu Trình tự hoặc TF → báo lỗi, không cho tạo.
- **Trình tự viết kiểu "lai"**, mỗi bước app đọc được: tên bước, vai trò, danh sách mã Q được phép, khoảng số câu (hoặc số dòng), có bắt buộc không, chi tiết thêm (khung từ, bài đọc 60–80 từ…); cộng vài nguyên tắc chữ cho AI. Số bài tối đa mỗi bước: **2**.
- **TF ghi thẳng mã Q** (`Dạng app: Q4 Chọn trong câu`). Mô tả 12 dạng Q: `1_DANG_Q.md`.
- Mục tiêu và từ vựng của lesson (hiện ở màn Ra đề) lấy từ Kiến thức.

Dạng dữ liệu cụ thể chốt ở thảo luận cấu trúc file. App đọc qua một lớp chuyển đổi (mục 9.2), nên đổi định dạng file không đổi giao diện.

## 4. Giai đoạn ① Ra đề

Màn riêng, mở bằng nút **Tạo bài** (thanh trên editor) hoặc khi mở app ở chế độ tạo bài.

### 4.1 Khung chọn bài (hàng trên)
- Bốn cột: **Giáo trình | Unit | Lesson | thông tin lesson**. Lesson có nhãn chuyên đề. Cột 4: mục tiêu lesson, danh sách **Phiếu đã tạo của lesson** (ngày, số bài, nút Mở).
- Luôn mở; bấm tiêu đề "Chọn bài" (hoặc ▴) để thu gọn thành một dòng `Giáo trình › Unit › Lesson [chuyên đề]`.
- Đổi lesson khi đã chỉnh cấu trúc → hỏi xác nhận (cấu trúc đang chỉnh sẽ mất).

### 4.2 Cấu trúc bài (dưới trái)
- Một khối; **mỗi bước Trình tự là một mục**, tiêu đề: `Bước n · tên` + chi tiết + "bắt buộc / không bắt buộc · tối đa 2 bài" + nút **+**.
- Mặc định mỗi bước 1 bài, dạng Q **chọn ngẫu nhiên** trong danh sách được phép, theo luật: không hai bài liền nhau cùng Q; ưu tiên khác dạng của phiếu gần nhất cùng lesson. Số câu mặc định ngẫu nhiên trong khoảng.
- Mỗi bài một dòng: số thứ tự chung, menu dạng Q (chỉ các Q được phép), số câu −/+ (trong khoảng), **⟳** đổi dạng ngẫu nhiên, **✕** xóa.
  - Bước bắt buộc: không xóa được bài cuối (✕ mờ).
  - Bước không bắt buộc xóa hết bài = bỏ qua bước (mục ghi "Bỏ qua bước này · bấm + để thêm bài").
  - **+** mờ khi bước đã đủ 2 bài.
- **⟳ Đề xuất lại**: chọn lại toàn bộ.
- Ô **Ghi chú cho AI** (không bắt buộc).
- Nút **Duyệt cấu trúc · Sinh bài →**.

### 4.3 Layout sơ bộ (dưới phải)
- Trang A4 thu nhỏ, mỗi bài là Task giả theo dạng Q và số câu (dòng kẻ, ô T/F, hai cột nối, khối bài đọc xám…), **dàn bằng chính bộ dàn trang của app** với nội dung giả, nên ngắt trang thật.
- Cập nhật ngay khi đổi cấu trúc. Dòng trên: "n bài · ước tính k trang / tối đa m". Vượt tối đa → trang thừa viền đỏ, chữ đỏ.
- Ghi rõ: ước tính, chữ thật dài ngắn khác nhau.

## 5. Giai đoạn ② Biên tập

Là editor hiện tại. Bấm "Sinh bài" → vào thẳng Biên tập; phiếu có sẵn **G0 (số, tiêu đề, hướng dẫn) và khung** từng bài, bài nào AI viết xong thì hiện nội dung (bài đang viết: khung chờ, cây ghi "đang viết…").

### 5.1 Dải trên cùng (thêm, nằm trên thanh công cụ editor)
`① Ra đề › ② Biên tập` · tên lesson · **Duyệt bài n/N** · **🕘 Lịch sử phiếu** · **Xuất bản**.
Chỉ hiện với phiếu tạo từ module. Bấm ① quay lại Ra đề (cấu trúc đang có hiện lại; xem 5.6).

### 5.2 Trạng thái bài trong cây
Biểu tượng cuối dòng Task: **⏳** đang viết · **⚠** có tiêu chí chưa đạt · **○** chưa duyệt · **✓** đã duyệt. Bấm biểu tượng → mở ngăn Duyệt bài đúng bài đó.

### 5.3 Ngăn Duyệt bài
Trượt ra **đè tạm lên inspector** (rộng bằng inspector), ✕ đóng → inspector hiện lại. Ngăn Lịch sử phiếu dùng chung chỗ này (mở cái này thì đóng cái kia).
Từ trên xuống:
1. Đầu ngăn: `Duyệt bài`, ‹ n / N ›, ✕; thanh tiến độ "k/N đã duyệt".
2. **Khối Cả phiếu**: "Cả phiếu · a/b đạt"; tiêu chí chưa đạt mở sẵn kèm lý do, tiêu chí đạt gập ("▸ k tiêu chí đạt"); nút **✓ Duyệt phiếu**, **🕘 Lịch sử phiếu (x/3)**.
3. Bài đang xem: nhãn vai trò, dạng Q, số câu; tên bài.
4. **Kiểm tra · a/b đạt** (mục 6), cùng kiểu hiện.
5. Mục tiêu, Ngữ cảnh (AI viết kèm bài).
6. Đáp án (một dòng gọn).
7. Nếu bài bị sửa / sinh lại sau lần duyệt: dòng nhắc "Đã … sau lần duyệt hh:mm → chưa duyệt".
8. Nút **✓ Duyệt bài này** (bài đã duyệt: nút mờ "✓ Đã duyệt"). Duyệt xong tự chuyển sang bài chưa duyệt kế tiếp.
9. **Lịch sử bài này** (x/3 lần duyệt), mỗi dòng: giờ, ghi chú, nút **Dùng bản này** (bản đang dùng ghi "đang dùng").
10. **⟳ Sinh lại bài này**: ô góp ý + nút Sinh lại. Ghi chú: "Bản chưa duyệt sẽ bị thay hẳn; các bản đã duyệt vẫn còn trong Lịch sử bài này."
11. Cuối ngăn (cố định): công tắc **Hiện đáp án trên trang**.

Sửa chữ, dàn trang: giáo viên đóng ngăn và dùng editor như bình thường.

### 5.4 Hiện đáp án trên trang
Bật → đáp án in **màu cam** ngay trên trang: chữ trong chỗ trống, khoanh lựa chọn đúng, chữ cái ở bài nối, tô ô T/F, ô bảng. Tắt → phiếu học sinh. Chỉ là lớp hiển thị, không đổi dữ liệu, không vào bản in / gói. Câu bị kiểm tra bắt lỗi được **tô vàng** trên trang khi ngăn đang mở.

### 5.5 Xuất bản
Bấm **Xuất bản** → hộp nhắc nếu còn: bài chưa duyệt / ⚠ (liệt kê "Bài 3 ⚠ cần xem · Bài 5 chưa duyệt"), tiêu chí Cả phiếu chưa đạt. Nút **Mở ngăn duyệt** / **Vẫn xuất bản**. "Xuất bản" bản này = Duyệt phiếu + mở hộp Gói .wsp sẵn có (đích xuất bản thật: chốt khi có TeacherResource).

### 5.6 Quay lại Ra đề
Cấu trúc đã duyệt hiện lại. Nếu đổi cấu trúc rồi bấm "Sinh bài":
- bài **không đổi** (cùng bước, cùng Q, cùng số câu) **giữ nguyên** (kể cả đã sửa tay, đã duyệt);
- bài đổi / mới thì sinh; bài bị xóa thì bỏ khỏi phiếu (bản đã duyệt vẫn trong Lịch sử phiếu).
- Có lựa chọn rõ "Sinh lại cả phiếu" (hỏi xác nhận).

## 6. Kiểm tra chất lượng

Giáo viên thấy **danh sách tiêu chí đạt / chưa đạt kèm lý do**, **không thấy điểm số**. Kiểm tra chạy tự động sau khi sinh / sinh lại / sửa (máy kiểm chạy lại ngay khi sửa; AI chấm chạy lại khi sinh, và khi giáo viên bấm "Chấm lại").

### 6.1 Từng bài
**Máy kiểm (code, trong app):**
- MD đọc được không lỗi (bộ đọc không báo dòng đỏ / cảnh báo).
- Đủ số câu theo cấu trúc; đúng dạng Q.
- Mỗi câu có đáp án; đáp án duy nhất kiểm được bằng code (Q4 đúng một `*`; Q8 vế phải không trùng; Q1 có khung từ thì đáp án nằm trong khung; Q5 tỉ lệ T/F không lệch quá).
- Không trùng câu trong bài.
- Không tràn trang / số trang trong giới hạn.

**AI chấm theo rubric (file chung 4, lượt gọi riêng, không cùng lượt sinh):**
- Đúng mục tiêu bài; mức khó hợp độ tuổi; câu và hướng dẫn rõ ràng; đáp án duy nhất về nghĩa (vd nối: hai câu hỏi cùng ghép được một trả lời); câu chỉ cần hiểu nghĩa ≤ 20%.

Tiêu chí không áp dụng cho dạng bài thì không hiện (vd Q12 không có "đáp án duy nhất").

### 6.2 Cả phiếu
Phủ đủ điểm kiến thức của lesson; các bài không lặp câu / ngữ cảnh; độ khó tăng dần theo Trình tự; số trang ≤ tối đa.

### 6.3 Lưu cho admin (không hiện cho giáo viên)
Mỗi lần sinh / chấm lưu: điểm từng tiêu chí, phiên bản Trình tự / TF / Kiến thức / file chung, model, thời gian, token. Hành vi giáo viên: duyệt ngay, số lần sinh lại, sửa tay (số thay đổi), góp ý. Dùng cho trang thống kê (sau) và để so phiên bản prompt.

## 7. Lịch sử theo lần Duyệt

- Lịch sử **chỉ tạo khi bấm Duyệt**. Không tự lưu khi sinh / sửa.
- **Duyệt bài** lưu bản của **bài đó** (nội dung + cài đặt dàn trang của Task + thông tin tạo bài). **Duyệt phiếu** lưu **cả phiếu** (mọi bài + cài đặt phiếu).
- Mỗi bài và phiếu giữ **tối đa 3 lần duyệt gần nhất**; duyệt lần thứ 4 thì bản cũ nhất bị bỏ.
- **Dùng bản này** (bài): thay bài hiện tại bằng bản đã duyệt đó; trạng thái thành ✓ (đúng bản đã duyệt). Có Hoàn tác như mọi thao tác editor.
- **Lịch sử phiếu**: mỗi bản có **Xem** (chỉ đọc, dải "Đang xem bản cũ · Về bản hiện tại") và **Khôi phục** (thay cả phiếu, hỏi xác nhận; có Hoàn tác).
- Bài đã duyệt mà nội dung / dàn trang khác bản duyệt gần nhất → tự về **○ chưa duyệt** (so dấu nội dung, không cần bắt từng thao tác sửa). Sửa ngược về y như bản duyệt → lại ✓.
- Bài chưa duyệt **không có bản lưu**: sinh lại thì mất bản chưa duyệt (chỉ còn Hoàn tác). *(Câu hỏi mở 12.1.)*

## 8. Sinh bài

*Quy tắc chi tiết khi làm (v129): `QUY_TAC_SINH_BAI.md` (mã S1–S25). Nơi đặt khóa / model: màn Thiết lập › AI (v128, spec mục 59).*

### 8.1 Luồng
1. "Sinh bài": app tạo phiếu mới, mỗi bài một Task có G0 (tiêu đề tạm theo bước) và dạng Q đã chọn, trạng thái ⏳.
2. Gửi yêu cầu sinh **từng bài** (song song tối đa 3), mỗi yêu cầu gồm: file chung 1, 2, 3, 5 (mẫu khớp chuyên đề + độ tuổi), Kiến thức, Trình tự, TF, **toàn bộ cấu trúc** (để AI biết bài mình nằm đâu, tránh lặp), vị trí bài, ghi chú giáo viên, góp ý (khi sinh lại), tóm tắt các bài đã có (tránh lặp câu).
3. AI trả: một khối MD của **một Task** đúng quy ước + `Mục tiêu:`, `Ngữ cảnh:` (trường meta, app tách ra).
4. App đọc MD bằng bộ đọc của app. Lỗi đọc / sai dạng Q / sai số câu → gửi lại AI **đúng chỗ lỗi** (tối đa 2 lần), quá thì bài ⚠ với lý do "AI viết sai cú pháp", giữ nội dung đọc được.
5. Ghép vào Task (giữ G0 / dạng Q / cài đặt bố cục do cấu trúc định), máy kiểm, rồi gọi AI chấm (lượt riêng).
6. Xong bài nào hiện bài đó; cây đổi ⏳ → ○ hoặc ⚠.

**Sinh lại một bài**: như bước 2–6 cho bài đó, kèm góp ý và bản hiện tại (để AI biết cần đổi gì).

### 8.2 Nơi gọi AI
- Khóa API **không bao giờ nằm trong trình duyệt**. App gọi AI qua **máy chủ của app** (`server/`, hiện là máy chủ lớp thử chạy `npm run lop`, mở editor ở `/editor`), máy chủ đọc `ANTHROPIC_API_KEY`.
- Model cấu hình được (biến môi trường; mặc định chốt sau khi thử Haiku 5.5 và Sonnet 5.5, xem kế hoạch giai đoạn T6). Sinh và chấm có thể dùng model khác nhau.
- **Chế độ AI ngoài** (không có máy chủ / không có khóa): app dựng **gói đoạn nhắc** cho từng bài (nút Chép), giáo viên dán sang AI khác rồi dán MD trả về vào ô; phần sau giống hệt (bộ đọc, máy kiểm). AI chấm khi đó cũng ra đoạn nhắc để chép. Chế độ này cũng là cách thử prompt trước khi nối API.
- Mở `ws-editor.html` trực tiếp (không máy chủ): module chỉ có chế độ AI ngoài; danh sách giáo trình đọc từ gói dữ liệu giáo viên tự nạp (`.zip` / thư mục). *(Câu hỏi mở 12.5.)*

## 9. Dữ liệu trong phiếu và máy chủ

### 9.1 Thêm vào JSON phiếu (không đổi trường cũ)
```
ws.gen = {
  v: 1,
  src: { course, unit, lesson, topic,                  // mã + tên
         ver: { kienThuc, trinhTu, tf, chung } },       // phiên bản file đã dùng
  structure: [ { step, role, q, n, extra } ... ],       // cấu trúc đã duyệt
  note: "ghi chú cho AI",
  sheetChecks: [ { id, ok, why } ],
  history: [ { at, note, snap } ]                       // ≤ 3, snap = phiếu không kèm history
}
task.gen = {
  step, role, goal, ctx,
  status: 'wait' | 'todo' | 'ok',                       // ⚠ = todo có tiêu chí chưa đạt
  checks: [ { id, group: 'may'|'ai', ok, why, items } ],
  approvedHash, history: [ { at, note, snap } ]         // ≤ 3, snap = Task không kèm history
}
```
- Bộ dàn trang **bỏ qua** `gen` → đường chuẩn 120/120 không đổi.
- Xuất MD: không ghi `gen`. Gói `.wsp`: **không mang** `gen.history` và kết quả chấm (chỉ mang phiếu).
- Phiếu không có `ws.gen` = phiếu thường: không dải trên, không ngăn duyệt.

### 9.2 Máy chủ
- Dữ liệu giáo trình: thư mục trên máy chủ (cấu trúc chốt ở thảo luận file), đọc qua **một mô-đun chuyển đổi** trả về `{ course, units, lessons, topics, trinhTu (đã tách bước), tf, kienThuc, chung }`.
- API mới (tiền tố `/api/taobai/`): danh sách giáo trình / unit / lesson; chi tiết lesson (mục tiêu, chuyên đề, Trình tự đã tách bước, danh sách Q được phép); sinh một bài; chấm một bài; chấm cả phiếu; ghi nhật ký (mục 6.3).
- Nhật ký: `du-lieu/tao-bai/nhat-ky.jsonl` (một dòng một sự kiện).

## 10. Điểm vào và tương thích

- Thanh trên editor có nút **Tạo bài** (cạnh "+ Phiếu") → màn Ra đề. Đang có phiếu chưa lưu → hỏi như khi tạo phiếu mới.
- "Phiếu đã tạo của lesson" mở phiếu đã lưu (lưu ở máy chủ, theo lesson).
- Undo / Redo của editor bao gồm các thao tác mới (Dùng bản này, Khôi phục, nhận bài sinh lại).
- Nhận bài AI viết **không ghi đè** bài giáo viên đang sửa: bài đang chọn và đang gõ mà kết quả sinh lại về → hỏi "Thay bằng bài mới?".

## 11. Tiêu chí xong (cho cả module)

- Chọn lesson → duyệt cấu trúc → sinh 5 bài → duyệt / sinh lại / dùng lại bản cũ → xuất bản, chạy được với AI thật và với chế độ AI ngoài.
- Đường chuẩn `tests/chuan/` 120/120 và toàn bộ test hiện có vẫn đạt.
- Trên bộ lesson thử: tỉ lệ bài giáo viên duyệt không cần sửa / sinh lại đạt ngưỡng chốt ở kế hoạch (giai đoạn T6).

## 12. Câu hỏi còn mở (mặc định đang dùng)

1. Bài chưa duyệt có ô nhớ tạm "bản trước khi sinh lại" không? *Mặc định: không (đúng quy tắc "lịch sử chỉ tạo khi Duyệt").*
2. Tiêu chí chưa đạt có chặn nút Duyệt không? *Mặc định: không, chỉ cảnh báo.*
3. Duyệt phiếu có cần mọi bài đã duyệt? *Mặc định: không, nhắc số bài chưa duyệt.*
4. Đích "Xuất bản" thật là gì (gói .wsp, TeacherResource, kho phiếu)? *Mặc định: Duyệt phiếu + mở hộp Gói .wsp.*
5. Có cần chạy module khi mở file HTML không máy chủ? *Đã chốt 29/10: chỉ chế độ AI ngoài; ô khóa API (Thiết lập › AI) chỉ dùng khi chạy qua máy chủ.*
6. Cấu trúc file Kiến thức / Trình tự / TF / file chung: *thảo luận riêng.*
7. Các câu hỏi về quy tắc sinh bài (tránh lặp, lỗi nhẹ, TF nhiều dạng cùng Q, model…): `QUY_TAC_SINH_BAI.md` cuối file.
