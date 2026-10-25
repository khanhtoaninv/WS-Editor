# Đang dở: kéo đổi chỗ container, G-Text, thiết kế lại G0–G4

Ghi ngày 25/10/2026 (đêm). Bản app hiện tại: **v71**, chưa sửa dòng code nào trong phiên này. Phiên này chỉ thảo luận và vẽ minh họa. Đọc file này đầu phiên mới, cùng mục "BÀN GIAO" trong `WS_EDITOR_SPEC_v37_bo_sung.md`.

## 1. Ý tưởng của người dùng

Cho kéo đổi vị trí các container cùng cấp, để đổi thứ tự nhanh. Thêm một container tự do tên **G-Text**.

## 2. Đã thống nhất (người dùng đã nói rõ)

- Kéo đổi chỗ chỉ ở **cấp Task** và **cấp bên trong G2** (bài đọc ↔ câu hỏi). **Không kéo ở cấp câu**; thứ tự câu vẫn sửa bằng ↑ ↓ ở cột trái.
- G0 Tiêu đề luôn cố định ở trên cùng.
- Đổi chỗ G1 ↔ G2 là chấp nhận được.
- **G3 (đáp án) luôn đi cùng phần câu hỏi**, không bao giờ đứng một mình. "Khối riêng" chỉ là cách hiển thị (dòng kẻ dưới G2, hoặc cột T/F bên phải ở T4), không phải khối kéo độc lập. Khi kéo Bài đọc ↔ Câu hỏi, G3 đi theo câu hỏi.
- **G-Text**: container phát sinh, không có trong kế hoạch Task ban đầu. Thêm hoặc xóa tự do, một Task có thể có nhiều. Nội dung là **chữ hoặc ảnh người dùng tải lên** (một loại container hai dạng). Kéo đổi chỗ được ở cấp Task. Không đánh số, không đáp án, không chịu ảnh hưởng của Task layout. Ảnh dùng lại khung ảnh hiện có (bo góc, Fit, kéo chỉnh), không làm cơ chế ảnh thứ hai.

## 3. Người dùng vừa đề xuất thiết kế lại (CHƯA chốt, chờ trả lời)

```
Task
├─ G0  Tiêu đề         (cố định)
├─ G1  Ảnh
├─ G2  Nội dung
├─ G3  Câu hỏi (gồm cả câu hỏi và đáp án)
├─ G4  Khung từ
└─ G-Text (khối tự do)
```

Nhận xét của Claude (đã nói với người dùng): dễ vận hành hơn vì **bỏ cấp lồng nhau**; mọi khối ngang hàng ở cấp Task, chỉ cần một thao tác kéo; "bài đọc sau câu hỏi" thành đổi chỗ G2 ↔ G3; đáp án luôn thuộc G3 nên hết ngoại lệ. Dữ liệu hiện có đã chia sẵn theo hướng này: `content.lead` = G2, `items` + `answer` = G3.

Đề xuất của Claude khi làm: **chỉ đổi cách nhóm và tên ở giao diện, giữ nguyên schema**, thêm một thông số thứ tự khối trong `layout`. Bộ đáp án A1–A8 vẫn nằm trong G3.

Ba chỗ cần xem lại trước khi chốt:

1. Tên "Nội dung" cho G2 dễ hiểu nhầm: bảng, bài nối, hội thoại, tô chữ đều là phần học sinh làm nên thuộc G3, G2 thường rỗng. Claude đề xuất G2 = "Bài đọc / Lời dẫn", G3 = "Bài làm" (câu hỏi + đáp án); Task nào không có bài đọc thì G2 ẩn.
2. **T8** (ảnh nằm trong bài đọc, chữ bao quanh) gộp G1 với G2, nên ở layout này không đổi chỗ G1 ↔ G2 được.
3. Phải sửa **Instructions của Project** và spec (nguyên tắc "G2 nội dung, G3 đáp án" đang nằm trong đó), cây cột trái và các test đổi tên. Đây là đổi một nguyên tắc thiết kế đã chốt, cần người dùng duyệt rõ.

## 4. Câu hỏi chờ người dùng trả lời

1. Đặt tên: G2 = Bài đọc / Lời dẫn và G3 = Bài làm, hay giữ "Nội dung" và "Câu hỏi"?
2. Đồng ý cách làm "đổi nhóm và tên ở giao diện, giữ nguyên schema" không?
3. **G-Text** là băng ngang full chiều rộng, nằm trên hoặc dưới (hoặc giữa) khối layout (cách A, Claude đề xuất), hay có thể nằm trong cột (cách B, phải khai báo thêm chỗ cho G-Text ở từng layout nên phức tạp hơn nhiều)?
4. Thứ tự làm (Claude đề xuất): (a) Bài đọc ↔ Câu hỏi trong G2 / G2 ↔ G3, vì nhỏ nhất và sửa luôn lỗi bài 1 Sunny Farm; (b) G-Text; (c) kéo đổi chỗ đầy đủ ở cấp Task.

## 5. Phân loại theo quy trình 3 bước của Project

- **Có sẵn:** G4 trên hay phải (`wordBank.placement`); G1 trái hay phải (T2 ↔ T3).
- **Mở rộng tùy chọn có sẵn (bước 2, cần duyệt):** thứ tự Bài đọc / Câu hỏi; G4 đổi chỗ với G1 theo chiều dọc; G1 xuống dưới nội dung trong T1. Thêm thông số thứ tự khối trong `layout`, không thêm layout mới.
- **Container mới (bước 3):** G-Text. Lý do: không có container nào hiện nay là một khối chữ/ảnh tự do, không đánh số, không thuộc phần làm bài. Phải giữ tổng quát: một loại, hai dạng (chữ | ảnh).
- Việc cần nghĩ khi làm: cắt trang (G-Text coi như một đơn vị, không để mồ côi), nhập MD/JSON (cần cú pháp cho G-Text, chưa thiết kế), hoàn tác, "Áp cho…", khóa dữ liệu theo `id` để G-Text đi theo khi đổi chỗ.

## 6. Hình minh họa đã dùng trong phiên (vẽ lại nếu cần)

- Task "Read and answer" (Task 14 trong bộ demo, hiện tự chọn T8): G1 ảnh "Lucy and Max", G2 bài đọc + 4 câu, G3 dòng kẻ trả lời gắn theo từng câu. Hai cách trình bày khác: T1 (ảnh ngang ở trên, bài đọc rồi câu hỏi) và T2 (ảnh cột trái ~35%, chữ cột phải; cột chữ hẹp nên dòng kẻ ngắn lại).
- Một Task đủ G0–G4 (bài minh họa Claude tự dựng, không có trong bộ demo): sau hai lần đổi chỗ, (1) G4 Khung từ lên trước G1 Ảnh, (2) Câu hỏi lên trước Bài đọc trong G2, G3 vẫn dính với câu hỏi.

## 7. Các điểm dở dang khác (từ phiếu Sunny Farm, spec mục 16.9c)

1. Header phiếu (tên phiếu, Name/Class/Date, dòng cấp độ, khung "My goal") chưa có chỗ chứa; hiện AI nhét "My goal" vào hướng dẫn Task 1. G-Text có thể giải quyết phần "My goal", nhưng header cấp phiếu (tên phiếu, Name/Class) vẫn chưa có chỗ.
2. Bài 1 sai thứ tự: bài đọc luôn in trước câu hỏi. Mục 3 ở trên sẽ giải quyết.
3. Bài xếp thứ tự: số câu 1–4 ở lề trùng với số học sinh phải điền; chưa có tùy chọn bỏ số câu khi có nhiều câu.
4. Ô tick 4 lựa chọn một hàng bị gãy chữ; chế độ "Tự xuống dòng" tránh được nhưng "Tự động" chưa chọn nó.
5. Dòng "Self-check:" mất nhãn (tên phần không hiển thị).
6. Còn lại: P3 (thêm PDF thật vào `tests/real/`), P4 (mẫu Ô chữ), công tắc Name / Class (hoãn).

## 8. Gợi ý cho phiên mới

Mở đầu bằng: "Đọc docs/DANG_DO_KEO_DOI_CHO_VA_G_TEXT.md và trả lời bốn câu hỏi ở mục 4", hoặc tự trả lời rồi bảo Claude ghi quyết định vào spec và bắt đầu làm.
