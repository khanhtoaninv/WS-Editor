# WS Editor — Đặc tả (bản v36 + kế hoạch mục 15, 24/10/2026; cập nhật mục 16 ngày 25/10/2026, v70)

> File này là nguồn sự thật duy nhất cho WS Editor. Nó thay thế bản MASTER_SPEC v10 (quá nặng) và Claude Doc "Đặc tả Layout Task & Answer" (cũ hơn bản này).
> Prototype chạy được: `ws-editor-prototype.html` (một file HTML, mở bằng trình duyệt). Dữ liệu mẫu: `ws-sample.json` (schema 0.2).
> Khi bản prototype và file này lệch nhau, prototype là bản đúng hơn về hành vi; hãy báo để cập nhật file này.
> **Cập nhật 26/10/2026:** prototype hiện là **v73** (v72 + G-Text kiểu Chữ, mục 17.4; v72 = cỡ chữ phiếu Nhỏ / Vừa / To, mục 16.12; kế hoạch ba năng lực còn thiếu ở mục 17). Trước đó (25/10/2026, lần 4): **v71** (v70 + nhãn lựa chọn thẳng dòng đầu và cách chữ 2 mm, mục 16.9c). v70 (v69 + Đúng/Sai mặc định 80/20, hướng A4 "Tự động" quyết theo cả Task, nút Xuất MD; mục 16.11). v69 = v68 + chọn font chữ phiếu (mục 16.10). v68 = (v67 + Task nhiều phần "Nối vào Task trên", MD `### Phần:`, nhãn A. B. C. giữ chữ hoa, câu duy nhất không đánh số; mục 16.9). v67 = v66 + sửa bộ đọc MD theo phiếu thật đầu tiên, A4 có nhãn ô tick (mục 16.8). v66 = v65 + font nhúng sẵn trong `fonts/` (mục 16.7). Thay đổi v37–v68 ghi chi tiết ở `claude/WS_EDITOR_SPEC_v37_bo_sung.md` (mục cuối "BÀN GIAO"). Nhập file (P0–P2) tóm tắt ở **mục 16**; quy ước MD ở `claude/QUY_UOC_MD.md`.

---

## 0. Mục đích và phạm vi

- WS Editor là **bước dàn trang phiếu bài tập**. Đầu vào là nội dung các Task (JSON), đầu ra là phiếu A4 dạng **HTML**. **Không làm in/PDF.**
- Giai đoạn này: xây độc lập (một file HTML, JS thuần, không thư viện). Sau đó mới tích hợp vào WS Studio (repo `khanhtoaninv/WS-Studio_MVP-2`), **không đổi kiến trúc hay code của Studio**.
- Người dùng: Pinta, giáo viên tiếng Anh ở Việt Nam, làm phiếu cho học sinh 5–12 tuổi (Starters/Movers/Flyers, Family and Friends, Global Success…).
- Mục tiêu sản phẩm: **dàn trang tự động ở mức cao, người dùng chỉ tinh chỉnh vi mô**, nhanh mà vẫn đạt chất lượng ưng ý (mục 14).

## 1. Nguyên tắc làm việc (đã thống nhất)

Khi người dùng đưa một **mẫu bài** mới:
1. **Dùng cái có sẵn trước.** Kiểm tra các layout và cấu hình hiện có có trình bày được không. Không cần giống hình mẫu; điều quan trọng nhất là **người học hiểu phải làm gì**.
2. **Mở rộng cái có sẵn.** Nếu chưa được, xem thêm một tính năng hoặc tùy chọn vào format hiện có có giải quyết được không.
3. **Format mới là phương án cuối.** Chỉ thêm khi hai bước trên không đủ, và phải **gộp được nhiều trường hợp** (như bảng T9 tổng quát), tránh thêm quá nhiều loại làm rối.
- Mỗi lần trả lời, nói rõ đã đến bước nào và vì sao các bước trước không đủ.
- Không biến một mẫu bài cụ thể thành template riêng. Mẫu chỉ là một trường hợp để suy ra tính năng tổng quát.

Quy ước chung:
- Spacing chỉ có Gọn / Vừa / Thoáng (+ nhập số, + Tự do). **Không có hệ số ẩn** (từng có `ig*0.7`, đã bỏ vì phá khai báo).
- **Mọi khung có viền phải bo góc.** Không dùng hình vuông sắc cạnh.
- **Đường dóng (đường thẳng ảo):** mọi thứ thẳng hàng theo các đường cố định. Đường B nằm ở mép trái của tiêu đề Task (số thứ tự nằm ở lề trái, đường B là nơi chữ bắt đầu). Nút "Đường dóng" hiện 3 đường để kiểm tra (không in).
- G0 luôn cố định ở đầu Task và là mốc: đổi khoảng cách thì G0 không bị dịch trong màn hình.

## 2. Mô hình dữ liệu và container

**Phiếu** (`ws`) = danh sách **Task** xếp dọc theo thứ tự mảng (số hiển thị = chỉ số + 1, **trừ phần nối vào Task trên**: dùng chung số của Task đó, mục 9.2 và 16.9).

Mỗi **Task** là một container có các nhóm (tên tiếng Việt trước, mã sau):

| Nhóm | Tên trên giao diện | Vai trò |
|---|---|---|
| G0 | Tiêu đề | Số, tên bài, hướng dẫn, track audio. Cố định, luôn trên cùng, không đổi theo layout. Phần nối vào Task trên: không số, không tên, chỉ còn hướng dẫn riêng (nếu có) |
| G1 | Ảnh | Khung ảnh của Task (mục 5). Ở Lưới item (T5): **mỗi ảnh là một container riêng** |
| G2 | Nội dung | Item, câu hỏi, bài đọc, cặp nối, hội thoại, bảng… Ở T5 Ảnh trái: **mỗi ô chữ là một container riêng** |
| G3 | Đáp án | Kiểu A1–A8. **Mỗi đáp án của một câu cũng chọn được để ghi đè riêng** |
| G4 | Khung từ | Trên nội dung hoặc bên phải |

**Loại container** (quyết định panel, tay kéo, thông số, cách "Áp cho…"): Task (= nhóm Nội dung), Ảnh (G1 của Task), Ô ảnh (T5, khóa item hoặc `item.lựa chọn` ở bài multi), Ô chữ (T5 Ảnh trái), Đáp án (cả Task), Đáp án một câu, Khung từ, Tiêu đề (chỉ xem). Chọn nhóm Ảnh của Lưới item = chỉnh cùng lúc mọi ô ảnh.

Quy trình chỉnh một Task: **chọn bố cục → chỉnh kích thước các container → chọn kiểu đáp án**. Layout chỉ áp ở hai cấp **Task** và **Đáp án**.

## 3. Task layout (T1–T9)

Có chế độ **Tự động** (`autoLayout`) hoặc chọn tay. **Bộ chọn chỉ hiện layout hợp lệ**, xếp theo điểm (mục 14.5); layout bị khóa gom vào "Vì sao không dùng được (n)" kèm lý do (`layoutReasons`). Mỗi nút ghi chiều cao ước tính (`~N mm`), nút tốt nhất có nhãn "Gợi ý".

| Mã | Tên | Dùng cho | Kích thước (kéo được + ô số) | Căn lề |
|---|---|---|---|---|
| T1 | Xếp dọc | Ảnh lớn trên, nội dung dưới; bài chỉ có tranh | khung ảnh; khoảng ảnh → nội dung | ảnh: trái/giữa/phải |
| T2 | Ảnh trái | Ảnh trái, nội dung phải | `split` 35 (25–50) | dọc các cột; ảnh: dọc |
| T3 | Ảnh phải | Ảnh phải, nội dung trái | `split` 65 (50–75) | như T2 |
| T4 | Nội dung \| Đáp án | Câu hỏi trái, đáp án (T/F…) phải | `split` 60 (40–70) | dọc các cột; ảnh: ngang |
| T5 | Lưới item | Item có ảnh, chia cột (mục 3.1) | số cột, khoảng cột `colGap`, khoảng item | nội dung trong ô (Ảnh trên); dọc các hàng (Ảnh trái) |
| T6 | Chỉ nội dung | Câu hỏi, hội thoại, khung từ bên phải | số cột 1–2, độ rộng khối `width` 40–100%, khoảng câu; `split` 62 (40–80) khi khung từ bên phải; cột tên người nói `whoW` | vị trí khối; dọc các cột (khung từ phải) |
| T7 | Matching | Bài nối cặp | 3 cột `cw` (mặc định 40/20/40, mỗi cột ≥ 10%), chiều cao hàng `rowH` | dọc các hàng |
| T8 | Ảnh trong bài đọc | Bài đọc có ảnh, chữ bao quanh | rộng ảnh 40 (25–60%); khoảng bài đọc → câu hỏi | ảnh trái/phải; chữ trái / đều hai bên |
| T9 | Bảng | Bài dạng bảng (mục 7) | độ rộng từng cột, chiều cao từng hàng | nội dung ô |

Luật auto: pairs→T7, items→T5, picture→T1, dialogue→T6, table→T9; có ảnh: ảnh `large`→T1, có A6→T4, bài đọc→T8, còn lại T2; không ảnh: A6→T4, còn lại T6.

### 3.1 T5 — Lưới các container độc lập
- Khác T9: ở T9 cả bảng là một container, các ô thuộc phạm vi chỉnh của bảng. Ở T5 **mỗi ảnh (và mỗi ô chữ ở Ảnh trái) là một container**, có thuộc tính khung riêng ở `layout.cells[khóa]`. Nội dung bên trong (đáp án A1, A2…) giữ thuộc tính riêng của loại A.
- **Hướng ô** `layout.dir` (bài đơn): `col` Ảnh trên (2–3 cột) / `row` Ảnh trái (1–2 cột). Mặc định: item có `lines[]` thì `row`, còn lại `col`. Đổi hướng thì số cột và tỉ lệ về mặc định. Bài `multi`: 1–2 cột, mỗi ảnh lựa chọn là một container (khóa `i1.0`, `i1.1`…).
- **Ô ảnh** (cả 3 kiểu): Fit ngang/dọc, chiều cao khung (15–150 mm), zoom, chấm tâm, căn ngang trong ô (Ảnh trên, multi) hoặc căn dọc trong hàng (Ảnh trái).
- **Ô chữ** (Ảnh trái): tỉ lệ hàng `split` (mặc định 25, 15–50), căn dọc `valign` (mặc định theo `layout.valign`, rồi giữa), chiều cao hàng tối thiểu `rowH`. Mỗi hàng có thanh dọc riêng.
- Item có `lines[]` chỉ dùng được ở T5 (T6 bị khóa, có lý do).
- Cắt trang: mỗi hàng ô là một đơn vị cắt.

## 4. Answer layout (A1–A8)

Chọn kiểu đáp án và chế độ gắn (Trong câu / Theo item / Khối riêng) ở panel Đáp án. Mỗi kiểu có **kích thước kéo được trên trang + ô số**, **căn ngang** (trừ đáp án nằm trong câu) và có thể **ghi đè riêng cho từng câu**: bấm vào đáp án của câu đó trên trang (`answer.params.perItem[khóa câu]`, chỉ lưu phần khác).

| Mã | Tên | Kích thước | Khác |
|---|---|---|---|
| A1 | Dòng kẻ viết | số dòng; chiều cao dòng `lineMm` (≥ tối thiểu theo tuổi); độ rộng `w` 40–100% | |
| A2 | Ô trống | trong câu: `lenMode` fill/fixed, `lenMm`, `lines`; theo item: `width` (ký tự) | `start` inline/below |
| A3 | Ô chữ cái | cỡ ô `boxW` 5–12 mm (cao = 1,15 × rộng) | |
| A4 | Lựa chọn | khoảng cách `gap` 2–20 mm | `dir` (Tự động/Ngang/2 cột/Dọc/Tự xuống dòng; **Tự động quyết một lần cho cả Task** từ v70: mọi câu đều ngắn thì Ngang, chỉ cần một câu dài thì cả Task Dọc), `autoMax`, `lab` (Ⓐ / A. / ☐ ô tick, từ v67), `upper` (chữ hoa A B C; ẩn khi ô tick; từ v68 MD viết `A. B. C.` chữ hoa thì tự đặt `upper: true`) |
| A5 | Tick | cỡ ô `size` 4–12 mm | |
| A6 | Cột T/F | cỡ ô `size` 5–12 mm | Trong Hai cột (T4) tỉ lệ nội dung / đáp án mặc định **80 / 20**, kéo được 50–90 (từ v70) |
| A7 | Chấm nối | cỡ chấm `size` 1,5–6 mm | |
| A8 | Dòng tô | số lần `repeat`; `lineMm`; `w` | |

Quy tắc theo độ tuổi (`ws.age`): `5-6`: chữ 16pt, dòng ≥12 mm, tối đa 3 cột; `7-9`: 14pt, ≥10 mm, 3 cột; `10-12`: 12pt, ≥8 mm, 4 cột.

- **A4 tự động:** đáp án ngắn (≤ `autoMax`, mặc định ≈ `22*14/cỡ chữ` ký tự) xếp ngang, dài thì xếp dọc.
- **A2:** chỉ chỗ trống cuối câu mới kéo dài hoặc nhiều dòng được; chỗ trống giữa câu luôn là gạch cố định. Nhập độ dài hoặc kéo gạch thì chuyển sang Cố định.
- **A4 trong câu** (`attach: inline`): viết `{từ 1|từ 2}` trong text; hiện `từ 1 / từ 2`, mỗi từ in đậm. Chỉ bật được khi nội dung có ít nhất một chỗ `{a|b}`. Không có kích thước và căn riêng (đi theo dòng chữ). Chưa có kiểu `(a / b)` hay ký tự thoát `{` `}`.
- Khóa câu: `questions[].id`, `items[].id`, `w{n}` (tô chữ), `p{n}` (nối), `l{n}` (dòng hội thoại có chỗ trống).

## 5. Container ảnh (G1) — mô hình "khung"

- **Khung container chính là khung ảnh. Chỉ là một thứ.** Cấu hình ở `layout.frame` (Task) hoặc `layout.cells[khóa].frame` (ô T5): `fit` (`width`|`height`), `h` (mm), `w` (% bài đọc, T8), `scale` (% khi Bình thường), `ox`, `oy`, `zoom`, `align`, `valign`.
- Chế độ: **Bình thường** (ảnh theo tỉ lệ, chỉnh `scale` 40–100%), **Fit ngang**, **Fit dọc**. Tâm ảnh trùng tâm khung, phần thừa bị cắt. Fit **không** làm khung to lên.
- **Tay kéo cạnh dưới khung luôn hiện.** Ở chế độ Bình thường, kéo (hoặc nhập chiều cao) sẽ tạo khung Fit ngang với chiều cao đó. T8 có thêm tay kéo chiều rộng. Bước 5 mm / 5%.
- Khi Fit: chấm tâm kéo dời góc nhìn, zoom 50–300% (gần 100% thì hít về 100%), nút "Đưa ảnh về giữa khung".
- Căn: T1 trái/giữa/phải (trái = thẳng đường dóng tiêu đề); T4 trái/giữa/phải; T8 trái/phải; T2/T3 căn dọc so với nội dung.
- **Upload ảnh** từng slot (`G1`, `i{n}`, `i{n}.{m}`, `p{n}`) ở cây bên trái. Ảnh thu nhỏ về tối đa 1600 px, **chỉ giữ trong bộ nhớ trình duyệt**.

## 6. Khung từ (G4)

`wordBank{words, placement: top|right, style: chips|list, label: lower|upper|none, w?, align?, valign?}`.
- Đặt trên: độ rộng `w` 30–100% (kéo được), căn ngang (mặc định giữa). Đặt bên phải: tỉ lệ nội dung / khung từ (`layout.split`, 40–80, mặc định 62), căn dọc.
- `chips`: từ rời. `list`: danh sách có nhãn (a. b. c.).

## 7. Bảng (T9) — layout tổng quát

Nội dung: `{kind:'table', corner, cols[], rows[{head | {img,text}, cells[ string | '' (ô trống) | {tick} | {img} ]}]}`. Cả bảng là **một container** (Nội dung).

Tùy chọn (`layout.table`), mỗi tùy chọn là một thông số chuẩn (chấm chỉnh tay + ↺):
- Kích thước: Độ rộng cột Đều / Cột đầu rộng (15–60%) / Theo nội dung; **ô số cho từng cột** (`cw[]`, %, sửa một cột thì các cột khác chia lại phần còn lại); chiều cao hàng Theo nội dung / Đều nhau; tối thiểu `minH`; **ô số cho từng hàng** (`rhs{h|chỉ số: mm}`, nằm trong mục thu gọn).
- Kéo trên trang: thanh cạnh phải mỗi cột (đổi hai cột kề nhau, tối thiểu 10 mm) và mỗi hàng. Bấm đúp để về tự động.
- Căn lề nội dung ô; hàng tiêu đề, cột tiêu đề hàng, số thứ tự `nm` (ngoài bảng / trong cột đầu / tắt), đường kẻ, tô nền tiêu đề `fh`, cột đầu `fc`, các hàng `fr` (tô cột đầu thì `fr` khóa ở Không), cắt bảng `split`, lặp tiêu đề `repeat`.
- Hàng có ô trống để viết tự cao ≥ một dòng viết của độ tuổi. Bo góc ngoài luôn bật. Dữ liệu cũ `fill` được quy đổi khi nạp.

## 8. Hội thoại

`{kind:'dialogue', intro, lines[{who,text}]}`; chỗ `___` tự đánh số (1), (2)… và gắn đáp án (A2 hoặc khung từ). Dùng T6. Mỗi dòng có chỗ trống là một đáp án riêng (khóa `l{n}`). Độ rộng cột tên người nói chỉnh được. Chưa cắt được giữa các dòng.

## 9. Khoảng cách, xếp trang

### 9.1 Khoảng cách
`Gọn / Vừa / Thoáng / Tự do` (mm: giữa các Task, padding trong Task, G0→nội dung, giữa các nhóm, giữa các item/câu): Gọn 6/2/2/3/3 · Vừa 8/3/3/4/4 · Thoáng 12/4/4/6/6.
- Phiếu: sửa tay một số thì tự chuyển sang **Tự do** (giữ cả 5 giá trị). Bấm Gọn/Vừa/Thoáng thì về bộ số chuẩn.
- **Task:** đủ 5 thông số ("Cách Task phía trên" là khoảng trước Task này) và có **Tự do** như phiếu. "Theo phiếu" xóa mọi chỉnh riêng.
- Khoảng giữa item/câu (T5, T6) và giữa các nhóm (T1, T8) **kéo được trên trang**.
- Padding-top G0 cố định 3 mm. Đổi khoảng cách thì G0 không dịch trong màn hình.
- **Phần nối vào Task trên:** khoảng cách phía trên lấy từ **"Giữa các nhóm"** (Vừa = 4 mm) thay vì "Giữa các Task" (8 mm); không có padding-top G0.

### 9.2 Xếp trang (`ws.flow`)
- **Liền trang** (`cont`, mặc định): Task tự nối tiếp, lấp đầy trang; Task dài cắt ở ranh giới đơn vị.
- **Tách trang** (`page`): mỗi trang chỉ chứa Task trọn vẹn.
- **Ngắt trang theo Task** (`layout.break`): `auto` / `page` (Sang trang mới) / `keep` (Giữ liền Task sau: nếu Task sau không bắt đầu được ở cùng trang thì Task này sang trang mới, khi cả hai vừa một trang) / **`join` (Nối vào Task trên, từ v68):** Task này là phần tiếp của Task ngay trên: **không số, không tiêu đề** (chỉ hiện `instruction` riêng nếu có, thẳng đường dóng với chữ tiêu đề), dùng chung số của Task trên (cột trái ghi 6a, 6b, 6c), cách trên bằng "Giữa các nhóm", **luôn đi liền Task trên** (Task trên coi như `keep` với nó; `join` bỏ qua `page`), mỗi phần giữ nguyên loại đáp án và bố cục riêng. Task đầu phiếu không nối được (nút khóa; nếu dữ liệu vẫn đặt `join` thì hiện như Task thường kèm ghi chú). Số Task tính lại khi bật / tắt `join` (hoàn tác được).
- **Lấp đầy trang** (`ws.fill`): chia phần trống cuối mỗi trang (trừ trang cuối) vào khoảng giữa các Task, tối đa 8 mm mỗi khoảng. Không đổi số trang; khoảng trước phần nối không nhận thêm.
- Hằng số: trang A4, lề 14 mm, chân trang 7 mm, vùng nội dung 262 mm.

### 9.3 Quy tắc cắt trang (Liền trang)
- Đơn vị cắt (`units`): item/hàng theo số cột (T5, T6), câu (T4, T6 khi không đáp án block), từ (trace), hàng bảng (nếu `split`), câu hỏi của bài đọc T8.
- Không cắt được: T7, bài chỉ có tranh, bài đọc ở layout khác T8.
- **Chỉ vừa tiêu đề thì chuyển cả Task sang trang sau** (không để tiêu đề mồ côi).
- **Container dẫn tách khỏi container câu hỏi (bài đọc T8):** khối ảnh + bài đọc có thể đứng một mình cuối trang. Ưu tiên: dẫn + nhiều câu nhất → dẫn một mình → cả Task sang trang sau.
- Trang sau của Task bị cắt **không lặp lại G0**.
- **Chẩn đoán tràn** kèm nút sửa nhanh (hiện ở panel Phiếu và panel Task đó): Khoảng cách Gọn · Chia thêm cột · Chuyển Liền trang · Bớt 1 dòng viết · Cho phép cắt bảng · Khung ảnh thấp hơn 10 mm / Thu nhỏ ảnh 20%. Chỉ hiện gợi ý áp dụng được.

## 10. Trình soạn (giao diện)

- Ba khung: **cây** bên trái (Task → nhóm → ô), **trang A4** ở giữa, **Inspector** bên phải. Tên tiếng Việt trước, mã (T1–T9, G0–G4, A1–A8) là chữ xám nhỏ. Chấm xanh trên cây = container có chỉnh tay.
- **Một cách thao tác chung cho mọi container:** chọn → kéo trên trang (hoặc nhập số) → bấm đúp tay kéo để về tự động → Esc để lên cấp (câu/ô → nhóm → Task → Phiếu). Dòng chú thích thao tác nằm trên trang.
- **Panel chuẩn** cho mọi container, cùng thứ tự: (bố cục / kiểu đáp án) → **Kích thước** → **Căn lề** → **Nội dung / Hiển thị** → **Ngắt trang** (Task) → **Về tự động** (nút "Về tự động" + "Áp thông số của container này cho": Ô cùng cột / Cả Task / Task cùng dạng / Cả phiếu, kèm số container đích; nút không áp dụng thì mờ). "Áp cho cả phiếu / cùng dạng" không chép trạng thái `join`.
- **Mỗi thông số** là một ô chuẩn: nhãn, điều khiển, chấm "đã chỉnh tay", nút ↺ về tự động. Bấm vào lựa chọn mặc định cũng là về tự động. **Mọi tay kéo trên trang có ô số tương ứng** (mỗi tay kéo mang `data-for` = container, `data-param` = thông số).
- **Áp cho… theo loại:** Task (cùng dạng: chép bố cục + khoảng cách + đáp án; cả phiếu: chép khoảng cách và ngắt trang), Ảnh (khung), Ô ảnh / Ô chữ (cùng cột, cả Task, cùng dạng, cả phiếu), Đáp án (cùng kiểu A), Đáp án một câu (cả Task), Khung từ.
- **Chọn nhiều:** Shift/Ctrl + bấm (trên trang hoặc cây) để chọn thêm container **cùng loại**; mọi thay đổi (ô số, nút, tay kéo) áp cho tất cả, tay kéo chỉ chép phần đã đổi.
- **Phím tắt** (khi đang thao tác trên trang): mũi tên ←/→ chỉnh thông số ngang chính, ↑/↓ thông số dọc chính của container (Shift = gấp đôi bước); Tab / Shift+Tab sang container kế / trước; Ctrl+C / Ctrl+V chép / dán kiểu giữa các container cùng loại; Ctrl+Z / Ctrl+Shift+Z hoàn tác / làm lại; Esc lên cấp.
- Bấm từ cây hoặc crumb thì trang cuộn tới container; bấm trên trang thì không cuộn. Bấm container khác khi đang nhập số vẫn chọn được ngay.
- Thanh trên: độ tuổi, hoàn tác/làm lại, thu phóng, **Đường dóng**, số trang, lỗi tràn, Xem JSON (sao chép; nạp phiếu khác qua panel Phiếu).
- **Cột trái, đầu danh sách Task (từ v64):** đúng hai nút nhập **+ Task** và **+ Phiếu** (mục 16). Không còn nút "Dán…".
- **Thanh công cụ trong Task đang mở (cột trái):** ↑ ↓ ⧉ Nhân đôi · **↳ Nối vào Task trên** (bật / tắt `layout.break = 'join'`, từ v68; khóa ở Task đầu) · ✕ Xóa Task. Số ở dòng Task: số Task (phần nối: 6a, 6b…).
- Chế độ tối được hỗ trợ.

## 11. Schema dữ liệu (ws-editor/0.2)

```
ws { schema:'ws-editor/0.2', id, title, age: '5-6'|'7-9'|'10-12', page{size,marginMm},
     spacing{preset: 'compact'|'normal'|'airy'|'free', overrides{}}, flow: 'cont'|'page', fill?: true, font?: 'be'|'lexend' (vắng = Andika), tasks[] }
task { id, typeId, typeName, title, instruction, audio?, number(tự tính, không lưu khi nạp), part(tự tính: a b c…, không lưu khi nạp),
       image?{label,size,ar}, wordBank?{words,placement,style,label,w?,align?,valign?},
       content{kind: items|questions|passage|pairs|trace|picture|dialogue|table, ...},
       answer{kind, attach: item|inline|block, layout: A1..A8, params{ ...tham số A, align?, perItem?{khóa câu:{...}} }},
       layout{ task:'auto'|T1..T9, split, cols, dir, align, valign, width, cw[3], rowH, whoW, colGap, break: null|'page'|'keep'|'join', 
               frame{fit,h,w,scale,ox,oy,zoom,align,valign},
               cells?{khóa:{split,valign,rowH,frame{fit,h,ox,oy,zoom,align}}},
               table?{head,rowHead,nm,lines,fh,fc,fr,cols,first,cw[],rows,minH,rhs{},align,split,repeat} },
       spacing{preset: null|'compact'|'normal'|'airy'|'free', overrides{5 khóa}}, uploads? }
items (kind 'items'): { id, img | imgs[], text?, len?, lines?[] }   lines[]: có thể chứa {a|b} khi đáp án = A4 trong câu
```
- Mọi khóa `layout` có mặt; `null` = tự động. `frame`, `cells`, `perItem` chỉ lưu phần đã chỉnh.
- **Đọc được dữ liệu 0.1** và tự chuyển: `ratio`→`split` (T7: →`cw`), `cellDir`→`dir`, `cellAlign`→`align`, `imageFit/H/W/Ox/Oy/Zoom/Align/Obj`→`frame.*`, `image.scale`→`frame.scale`, `cells[].ratio/image*`→`cells[].split/frame.*`, `answer.params.perQ`→`perItem[].dir`, `table.fill`→`fh/fc/fr`.
- Từ v57 dữ liệu lưu ở schema **0.3** (`content{form:'list'|'table', …}`, xem bổ sung mục V); 0.1/0.2 vẫn đọc được. v68 không đổi schema: `layout.break` có thêm giá trị `'join'`.
- **Nạp JSON thiếu trường (từ v63):** thiếu `schema`, `age`, `page`, `spacing`, `flow`, `id`, `answer`, `layout`… thì tự bù mặc định; file chỉ có `tasks` vẫn nạp được. Nạp lỗi không đổi phiếu đang mở (mục 16).
- Xem `ws-sample.json` cho đủ 18 Task mẫu (đã ở dạng 0.2).

## 12. Task mẫu trong prototype (18 Task, 11 trang)

1 Look and write (T5, A2) · 2 Match (T7) · 3 Listen and tick (T5 multi) · 4 Multiple choice (T6, A4) · 5 Reading A/B/C (A4 auto) · 6 Complete the conversation (hội thoại, T6 + khung từ list bên phải) · 7 Complete with word bank (A2 fill) · 8 Speaking plan (A2 nhiều dòng) · 9–12 Bảng (chọn A/B/C, điền thông tin, tick theo cột, bảng dài cắt trang) · 13 True/False (T4) · 14 Read and answer (T8) · 15 Answer the questions (A1) · 16 Trace the words · 17 Listen and colour (T1) · 18 Read and underline (T5 Ảnh trái, `lines[]`, A4 trong câu).

## 13. Chưa làm / ý tưởng

- Bảng: gộp ô, sửa nội dung ô trực tiếp.
- Áp quy tắc "container dẫn tách riêng" cho khung từ trên và hội thoại (cân nhắc). Hội thoại cắt được giữa các dòng.
- Lưu ảnh upload bền vững (hiện chỉ trong bộ nhớ trình duyệt). "Mặc định theo dạng bài" hiện lưu trong trình duyệt của người dùng (localStorage); khi tích hợp WS Studio nên chuyển về máy chủ.
- T2/T3 với Fit dọc crop nhiều (theo thiết kế).
- Tích hợp vào WS Studio (chưa bắt đầu; chờ người dùng yêu cầu).
- A4 trong câu: kiểu hiển thị khác (khung tròn, `(a / b)`), ký tự thoát `{` `}`.
- Item nhiều dòng (`lines[]`) ở T6.
- Gộp layout thành 6 họ trên giao diện (Hai cột gồm T2/T3/T4/T6 + nút Trái/Phải): chưa làm; hiện vẫn hiện từng layout hợp lệ.
- Nhập file: P3 (thử PDF thật; đã thử 1 phiếu PDF qua 2 vòng ở v67–v68, còn 4–9), P4 (mẫu Ô chữ, đáp án ô chữ, phiếu nhiều nhóm), bản in đáp án từ `key` (mục 16).
- Đã quyết, làm ở v70: cột T/F mặc định 80/20; hướng lựa chọn A/B/C thống nhất cả Task. Người dùng hoãn: công tắc "Name / Class" ở đầu phiếu (phiếu thật có dòng này ở chân trang, hiện không chép).

## 14. Chuẩn hóa (kế hoạch chốt 24/10/2026, **đã làm xong cả 3 giai đoạn**)

### 14.1 Mục tiêu
App dàn trang **tự động ở mức cao**; người dùng chỉ **tinh chỉnh vi mô**, học **một cách thao tác duy nhất** cho mọi Task và mọi container: **Chọn → Kéo trên trang (hoặc nhập số) → Bấm đúp để về tự động → Esc để lên cấp.**

### 14.2 Quy ước chung cho mọi container
- **Bộ thuộc tính chuẩn:** chọn được · kích thước · kéo trên trang · kéo ↔ ô số · căn lề · về tự động · dấu chỉnh tay · áp cho phạm vi.
- **Thứ tự panel:** Kích thước → Căn lề → Nội dung riêng → Ngắt trang → Về tự động.
- **Hai trạng thái mỗi thông số:** Tự động (không chấm, giá trị `null`) hoặc Chỉnh tay (chấm xanh, có ↺). Tự động không bao giờ ghi đè chỉnh tay.
- Không đổi các nguyên tắc ở mục 1, 2, 5 và 9.

### 14.3 Giai đoạn 1 — Sửa nhanh (xong)
1. Chỉ hiện layout hợp lệ, lý do khóa gom vào "Vì sao không dùng được". 2. Ngắt trang theo Task (`layout.break`). 3. Chẩn đoán có nút sửa nhanh. 4. Đáp án có chấm chỉnh tay và ↺. 5. Tay kéo khung ảnh luôn hiện. 6. Dòng chú thích thao tác. 7. Khoảng cách Task đủ 5 thông số + Tự do. 8. Nút Đường dóng. 9. Tên tiếng Việt trước, mã sau.

### 14.4 Giai đoạn 2 — Chuẩn hóa nền (xong)
1. T6 kéo độ rộng khối và khoảng câu. 2–3. Ảnh item T5 Ảnh trên và ảnh lựa chọn T5 multi thành container thật. 4. Đáp án A1–A8 kéo được + ô số. 5. Khung từ trên có độ rộng, kéo được. 6. T7 ba cột + chiều cao hàng; cột tên hội thoại; khoảng cột lưới T5. 7. Căn lề ở mọi container (trừ chỗ không áp dụng: đáp án trong câu, bài chỉ có tranh). 8. T9 ô số cho từng cột, từng hàng. 9. "Áp cho…" 4 phạm vi. 10. Ghi đè đáp án theo từng câu cho mọi kiểu A. 11. Schema 0.2 + tự chuyển 0.1.
- Thêm ngoài kế hoạch: khoảng item kéo được ở T5, khoảng nhóm kéo được ở T1/T8, căn chữ bài đọc T8 (trái / đều hai bên).

### 14.5 Giai đoạn 3 — Tự động hóa (xong)
1. **Điểm bố cục** = chiều cao ước tính (mm) + phạt chất lượng: khác luật mặc định +25 mm, mỗi cột thêm +12 mm; **cấm** (+1000) chia cột cho bài viết (A1/A8, nhiều dòng, hội thoại, item nhiều dòng), bỏ lưới ảnh T5, đưa dòng viết vào cột đáp án hẹp T4, tràn trang. Bộ chọn xếp theo điểm; **"Tối ưu bố cục cả phiếu"** chỉ đổi Task đang Tự động khi tốt hơn ≥ 10 mm (phiếu mẫu: đổi 2 Task, Listen and tick và Multiple choice sang 2 cột).
2. **"Vừa N trang"**: thử lần lượt Vừa → Gọn, tối ưu bố cục, Gọn từng Task, ảnh nhỏ hơn 20%, Liền trang; dừng ở bước đầu đạt, không đạt thì giữ kết quả ít trang nhất và báo. **"Lấp đầy trang"** (mục 9.2).
3. **Mặc định theo dạng bài:** "Lưu làm mặc định cho dạng X" ở panel Task; khi nạp phiếu (panel Phiếu → Nạp phiếu khác), Task chưa chỉnh tay cùng dạng được tự áp; có danh sách và nút Xóa.
4. **Phím tắt** (mục 10). 5. **Chọn nhiều** (mục 10).

### 14.6 Đo mức chuẩn hóa
**Thước đo 1 — Đo trên app** (18 Task mẫu, Playwright; bộ đo tự đi qua mọi container trên cây + đáp án câu đầu). Đạt = 1, một phần = tỉ lệ, chưa = 0; không áp dụng thì bỏ khỏi phép tính.
- *Nền* = 7 tiêu chí container: chọn được, có tham số kích thước, kéo trên trang, kéo ↔ ô số, căn lề, nút về tự động, dấu chỉnh tay (tỉ lệ điều khiển nằm trong ô chuẩn có ↺). Không tính G0.
- *Toàn đề xuất* = Nền + 10 tiêu chí: (1) chỉ hiện layout hợp lệ, (2) ngắt trang theo Task, (3) chẩn đoán có sửa nhanh, (4) áp cho theo phạm vi, (5) ghi đè đáp án theo câu (A4 trong câu: không áp dụng), (6) phím tắt, (7) xếp hạng + tối ưu bố cục, (8) Vừa N trang + Lấp đầy, (9) nhớ theo dạng bài, (10) schema 0.2. Mỗi tiêu chí (2)–(10) được kiểm bằng thao tác thật và kiểm kết quả, không chỉ kiểm có nút.
- **Thử thật:** bộ đo kéo mọi tay kéo, nhập mọi ô số, bấm mọi lựa chọn ở mọi container; kiểm dữ liệu đổi, có chấm chỉnh tay (hoặc về tự động khi bấm giá trị mặc định), hoàn tác sạch.

| Mốc | Nền | Toàn đề xuất |
|---|---|---|
| v34 (trước chuẩn hóa) | 64% | 30% |
| Sau giai đoạn 1 (lần đo đầu) | 97% | 74% |
| Sau giai đoạn 1+2 (đã sửa các chỗ thiếu) | 99% | 76% |
| Sau giai đoạn 3 (v36) | **100%** | **100%** |

Lần đo v36: 18/18 Task, mọi layout T1–T9 đạt 100/100; thử thật 431 thao tác (kéo, nhập số, bấm lựa chọn) không lỗi; 0 lỗi console. Lưu ý: bảng tiêu chí do chính kế hoạch đặt ra, nên 100% nghĩa là **làm đủ và chạy đúng những gì kế hoạch định nghĩa**, không có nghĩa trải nghiệm đã hoàn hảo. Cần người dùng thật dùng thử để tìm chỗ khó dùng mà bộ đo không thấy.

**Thước đo 2 — Độ phủ của kế hoạch:** mọi đối tượng × 8 thuộc tính chuẩn + 12 tiêu chí cấp Task/phiếu: ~100% sau khi bổ sung 8 lỗ hổng. Còn lại có chủ đích: gộp 6 họ layout (mục 13).

### 14.7 Điều kiện hoàn thành mỗi giai đoạn
- Test Playwright: 0 lỗi console (trừ lỗi tải font trong sandbox), 0 cảnh báo tràn, 17 Task cũ giữ nguyên trang ở cấu hình mặc định (v36: bố cục 18 Task giống hệt v34 từng mm).
- Chạy lại thước đo 1, ghi điểm vào bảng 14.6.
- Cập nhật spec, publish cùng artifact, gửi lại file để thay vào Project.

---

## 15. Kế hoạch: chuẩn hóa nội dung, nhập liệu, soạn nội dung (chốt 24/10/2026, **chưa làm**)

> Prototype hiện tại vẫn là **v36**. Mục này là kế hoạch cho các thread tiếp theo. Bắt đầu từ giai đoạn 0a (15.7).
> *(Ghi chú 25/10/2026: phần lớn mục này đã làm ở v37–v62, xem `claude/WS_EDITOR_SPEC_v37_bo_sung.md` mục A, V–Y; cách đưa bài vào đã thay bằng mục 16.)*

### 15.1 Mục tiêu và hai điều kiện của người dùng
App giúp dàn phiếu nhanh nhất mà vẫn đẹp. Sau khi chuẩn hóa **nội dung**, phải đạt:
1. **Đưa bài vào nhanh nhất**, không phải mò chức năng: từ trống đến một Task đã dàn xong **≤ 3 thao tác**; có thể đưa **cả đề** vào một lần.
2. **Nhập xong, hệ thống phải cho biết đây là dạng bài gì, cấu trúc thế nào**, nhìn là hiểu ("thẻ dạng bài", 15.4).

Ngoài ra (đã chốt trước đó): cho **sửa nội dung ngay trong cột trái** (cây Task), phần giữa là preview sống, để thử nhiều tình huống và biết bài mới có nằm trong các dạng sẵn có không (bước 1–2 của quy trình, mục 1). Ảnh: **tải ảnh thật lên**; ô chưa có ảnh hiện **ô giữ chỗ đúng tỉ lệ khung**.

### 15.2 Ba lớp, giữ nguyên
| Lớp | Câu hỏi | Ví dụ |
|---|---|---|
| **Nội dung** (form) | Bài có những gì? | 6 câu, mỗi câu 1 ảnh + 1 chữ, 3 lựa chọn |
| **Layout T1–T9** | Các phần của Task xếp thế nào? | Lưới ảnh 3 cột; ảnh trái chữ phải |
| **Đáp án A1–A8** | Chỗ làm bài của học sinh trông thế nào? | Dòng kẻ, ô tick, khoanh lựa chọn, nối |

Chuẩn hóa chỉ gom lớp **Nội dung**. T và A không đổi.

### 15.3 Hiện trạng đã rà (đo trên app, 24/10/2026)
**Lưu ý đánh số:** app hiển thị **số thứ tự trên phiếu**; mã nội bộ (`t11`, `t5`…) khác số hiển thị (thứ tự trong `ws-sample.json`: t1, t2, t3, t4, t11, t12, t5, t13, t14–t17, t6, t7, t8, t9, t10, t18). Khi nói chuyện luôn dùng **số hiển thị**; UI không lộ mã nội bộ.

**8 kiểu nội dung hiện có là cùng một thứ với tên khác:**
| Kiểu hiện tại | Thực chất |
|---|---|
| `questions` | danh sách câu: chữ, có thể kèm lựa chọn |
| `items` | danh sách câu: ảnh, có thể kèm chữ, lựa chọn |
| `dialogue` | danh sách câu, mỗi câu có người nói |
| `trace` | danh sách câu chỉ có chữ |
| `passage` | đoạn văn + danh sách câu |
| `picture` | chỉ có tranh |
| `pairs` | danh sách câu có vế trái + vế phải |
| `table` | bảng |

**A đổi được hiện nay:** chỉ những A hợp với **loại đáp án** (viết từ, viết câu, khoanh, tick, T/F, nối, tô), và loại đáp án đang khóa trong dữ liệu. Theo số hiển thị:
| Task | Gắn đáp án đang chọn | A hiện ra | Đổi gắn thì có thêm |
|---|---|---|---|
| 1 | Theo item | A2, A3 | không đổi được gắn |
| 6 | Trong câu | A2 | Theo item: A2, A3 |
| 7 | Trong câu | A2 | Theo item/Khối riêng: A2, A3 |
| 8 | Trong câu | A2 | Theo item/Khối riêng: A2, A3 |
| 14 | Theo item | A1, A2 | — |
| 15 | Theo item | A1, A2 | thêm Khối riêng: A1, A2 |
Các Task còn lại chỉ có 1 kiểu A (2: A7, 3: A5, 4/5/18: A4, 13: A6, 16: A8); 9–12 (bảng) và 17 (tranh) không có đáp án.
**Vấn đề UX:** A3 bị giấu sau nút "Gắn đáp án"; muốn thành loại đáp án khác (vd. viết câu → khoanh lựa chọn) thì không làm được.

### 15.4 Thiết kế đề xuất
**(a) Hai form nội dung.**
- **Danh sách** (14/18 Task): *phần dẫn* tùy chọn (đoạn văn, tranh lớn, lời giới thiệu) + *danh sách câu*. Mỗi câu có cùng bộ trường: người nói, chữ, ảnh (0 / 1 / nhiều), lựa chọn, vế ghép, đáp án. Công tắc bật/tắt trường ở **cấp Task**.
- **Bảng** (4/18 Task): giữ riêng (T9 = một container bảng). Ô dùng chung trường chữ / ảnh / tick.
- **Ký hiệu trong chữ (dùng sẵn có, không thêm):** `___` chỗ trống; `{a|b}` lựa chọn ngay trong câu; `Tên:` người nói.

**(b) Loại đáp án chọn ngay trong form, không khai hai nơi.** Chọn loại đáp án trước, form hiện đúng trường cần: A4 → ô nhập lựa chọn; A7 → vế ghép; A1 → số dòng. Form chỉ giữ các công tắc thuần nội dung (ảnh/câu, người nói, phần dẫn). Inspector chỉ còn chọn **cách trình bày A** trong các A hợp lệ, và **hiện đủ mọi A** (gồm A3); chọn A3 thì tự chuyển "Gắn đáp án" kèm thông báo ("đã chuyển sang Theo item vì A3 không đặt trong câu được").

**(c) Công thức dạng bài (recipe).** Một công thức = **gói thông số** (cấu hình form + loại đáp án + A + layout gợi ý + mặc định), **không phải mã**. Khoảng 10 công thức rút từ 18 Task: Look and write · Nối · Nghe và tick · Chọn A/B/C · Chọn trong câu `{a|b}` · Điền chỗ trống · Trả lời câu hỏi (dòng kẻ) · Đúng/Sai · Tô chữ · Tranh · Bảng (4 biến thể). **Quy tắc cứng: thêm công thức mới = thêm một dòng dữ liệu, 0 dòng mã.** Nếu dạng bài đòi sửa mã thì đó là bước 3 (format mới). Tên công thức do người dùng đặt (tên trong mục này là tạm). Thay thế một phần cơ chế "Mặc định theo dạng bài" ở 14.5.

**(d) Thẻ dạng bài** (đầu Task trong cây và đầu inspector), dãy chip, bấm chip nhảy tới chỗ sửa:
`Look and write` · `6 câu` · `ảnh 1/câu` · `đáp án: viết từ, gạch` · `layout: lưới ảnh 3 cột`.
- Cấu hình trùng công thức → hiện tên công thức. Không trùng → "Tùy biến, gốc: X" kèm các chỗ khác bản gốc.
- Dưới thẻ có **cảnh báo nhập liệu** (vd. "4 câu nhưng chỉ 3 chỗ trống", "thiếu đáp án đúng ở câu 5").
- Hai dạng khác nhau không được có thẻ giống nhau.

**(e) Cách đưa bài vào (làm cả ba, bổ trợ nhau):**
1. *Chọn công thức rồi nhập:* "+ Task" → chọn công thức (thư viện ~10 ô có hình nhỏ) → form chỉ hiện trường cần → gõ/dán.
2. *Dán Task, hệ thống đoán:* mỗi dòng một câu; nhận dạng bằng ký hiệu: có `___` → điền chỗ trống; có `{a|b}` hoặc `a / b / c` → lựa chọn; kết thúc `?` → trả lời câu hỏi; có `Tên:` → hội thoại. Hiện công thức đoán được để xác nhận/đổi.
3. *Dán cả đề (người dùng đã quyết định làm):* một khối chữ cho cả phiếu → app **cắt thành Task**, đoán công thức từng Task → **màn hình xem lại** liệt kê từng Task với thẻ dạng bài và mức chắc chắn → người dùng sửa từng Task rồi mới nhập vào phiếu. Gợi ý cắt: dòng tiêu đề kiểu "Task 1", "Exercise 1", "1.", dòng lệnh dạng "Look and write.", "Listen and tick.", hai dòng trống liên tiếp. **Cách cắt cụ thể sẽ chốt khi làm, dựa trên đề thật của người dùng.**
4. *Ảnh:* kéo nhiều file một lần → mỗi ảnh một câu theo thứ tự; câu chưa có chữ hiện ô giữ chỗ.
- **Không bao giờ đoán rồi lặng lẽ áp dụng:** kết quả đoán luôn hiện rõ và đổi được bằng 1 thao tác.

**(f) Soạn nội dung trong cột trái** (yêu cầu của người dùng). Sửa chữ: tiêu đề, hướng dẫn, từng câu, lựa chọn, đáp án, khung từ. Sửa cấu trúc: thêm / xóa / kéo đổi thứ tự câu; đổi số lựa chọn, số dòng trả lời, loại đáp án. Cấp Task: thêm, nhân đôi, xóa, đổi thứ tự, đổi công thức. Phần giữa dàn lại ngay khi gõ; có hoàn tác. Các chỉnh tay (`cells`, `perItem`…) khóa theo `id` câu nên đi theo đúng câu khi thêm/xóa/đổi thứ tự (cần dọn mồ côi khi xóa).

**(g) Ảnh thật + ô giữ chỗ.** Gắn ảnh: bấm chọn file, kéo thả (cột trái hoặc ngay trên trang), hoặc Ctrl+V; thay / gỡ (gỡ thì về ô giữ chỗ). Ô giữ chỗ ghi tỉ lệ (1:1, 4:3, 3:4, 16:9), đổi được. Gắn ảnh thật thì lấy tỉ lệ thật. Giữ nguyên quy tắc: khung là chuẩn, Fit không làm khung to ra. Thu nhỏ khi tải (cạnh dài ≈ 1600 px). Cảnh báo ảnh quá mờ so với kích thước trên A4. **Prototype để ảnh trong JSON (file nặng); khi tích hợp WS Studio phải lưu ảnh trên máy chủ, JSON chỉ giữ đường dẫn.**

### 15.5 Schema 0.3 (đề xuất, chốt khi làm)
`content{form:'list'|'table', lead?{kind, text|img}, items[{id, who?, text?, imgs?[], opts?[], pair?, ...}]}`; `answer.kind` đổi được trong form. **Migrate tự động 0.1/0.2 → 0.3.** Dữ liệu cũ phải mở được.

### 15.6 Rủi ro đã nhận diện
- Đoán sai dạng bài: luôn hiện và sửa được 1 thao tác (15.4e).
- Công thức thành "template cho từng mẫu": chặn bằng quy tắc 0 dòng mã (15.4c).
- Mã hiện rẽ nhánh theo `content.kind` ở khoảng 30 chỗ → phải gom về hai form; đây là việc lớn nhất.
- Ký hiệu nhập nhanh phải ít và đã có sẵn; không bắt học cú pháp mới.
- Dán cả đề khó hơn và dễ đoán sai hơn dán từng Task; vì vậy có màn hình xem lại bắt buộc.

### 15.7 Thứ tự làm (mỗi bước tự kiểm thử, ghi kết quả vào spec)
- **0a. Schema 0.3 + hai form.** Phiếu mẫu phải ra **giống hệt v36 trên cả 11 trang**, 0 tràn, 0 lỗi; bộ 431 thao tác vẫn 0 lỗi.
- **0b. Thẻ dạng bài** (chạy ngay trên 18 Task có sẵn) + hiện đủ A trong inspector + UI dùng số hiển thị.
- **0c. Công thức + thư viện chọn công thức.**
- **0d. Nhập từng Task** (dán, đoán, kéo nhiều ảnh) **và dán cả đề** (màn hình xem lại).
- **1. Soạn chữ và câu** trong cột trái. **2. Cấp Task** (thêm/nhân đôi/xóa/đổi thứ tự). **3. Ảnh thật + ô giữ chỗ.**

### 15.8 Phép kiểm khi xong
| Phép thử | Đạt khi |
|---|---|
| Dựng lại 18 Task từ trắng | mỗi Task ≤ 3 thao tác, ra kết quả giống phiếu hiện tại |
| Dán nội dung thô của 18 Task, và dán cả đề | ghi tỉ lệ đoán đúng công thức và đúng điểm cắt Task; chỗ sai sửa được bằng 1 thao tác |
| Đọc thẻ dạng bài | 18 Task → 18 thẻ đọc hiểu được; hai dạng khác nhau không trùng thẻ |
| Thử một dạng bài chưa có | dựng được bằng công thức sẵn có, hoặc app nói rõ thiếu gì |
| Thêm/xóa/đổi thứ tự câu | chỉnh tay đi theo đúng câu; không còn mồ côi |
| Regression | giống hệt v36 trên 11 trang, 0 tràn, 0 lỗi |

### 15.9 Việc còn mở (cần người dùng)
- **Đặt tên công thức** (tên trong mục này là tạm).
- **Đề thật để chốt cách cắt Task khi dán cả đề** (1–2 đề mẫu ở định dạng người dùng hay có: Word, PDF, hay chữ thô?).
- Gộp 6 họ layout (mục 13) vẫn để sau.

---

## 16. Nhập file vào phiếu (P0–P2 xong, v63–v65; v67–v68 sửa theo phiếu thật, 25/10/2026)

> Phương án và quyết định gốc: `claude/PHUONG_AN_NHAP_FILE.md` (mục 5 = quyết định đã chốt). Chi tiết từng bước: `claude/WS_EDITOR_SPEC_v37_bo_sung.md` mục AC (P0), AD (P1), AE (P2). Quy ước MD: `claude/QUY_UOC_MD.md`.

### 16.1 Hai lớp
- **Lớp A — Trích:** biến tài liệu thành Task. Hiện có: Claude đọc PDF trong chat ra **JSON** (đủ trường như `claude/ws-sea-sample.json`) hoặc **MD theo quy ước**; WS Studio sau này gắn AI của nó qua hook `window.WSImport.extract(file) → {tasks:[…]}`; chữ thô thì bộ đoán trong app (`parseTask` / `splitTest`, độ chắc thấp).
- **Lớp B — Nhập:** cửa duy nhất vào phiếu. Bù trường thiếu (`fillTask`, `fillSheet`), đọc JSON (`readJson`) / MD (`readMd`), dựng thử từng Task, hiện **bảng nhận diện**, rồi mới đưa vào phiếu. Editor không gọi AI trực tiếp.

### 16.2 Giao diện
- Cột trái có đúng hai nút: **+ Task** và **+ Phiếu**.
- **+ Task**: thẻ "Mẫu có sẵn" (13 mẫu) | "Từ file / dán" (chọn file `.json .md .txt` hoặc dán). Task mới **luôn vào cuối phiếu**, giữ thứ tự trong file, id mới. Nhiều Task: cảnh báo + tick chọn (mặc định tick hết). File (JSON/MD) có đúng 1 Task: chèn luôn. JSON/MD có cài đặt cấp phiếu: chỉ lấy Task, nói rõ, có nút chuyển sang + Phiếu. Một lần nhập = một bước hoàn tác. Phần nối đứng đầu lô được bỏ trạng thái nối (không dính vào Task cuối của phiếu đang mở).
- **+ Phiếu**: từ file / dán; ô trống = **phiếu trống**. Áp cài đặt cấp phiếu của file, thiếu thì bù mặc định. Trước khi thay phiếu đang mở (có Task): **xác nhận** trong hộp + nút **"Tải JSON phiếu cũ"**; nạp phiếu xóa lịch sử hoàn tác.
- **Bảng nhận diện**: dòng tóm tắt đếm **bài** ("6 Task (Task 6 có 3 phần)"); mỗi Task / phần một dòng — số theo file (phần nối: 6a, 6b, 6c), tiêu đề, mô tả cấu hình (`descOf`) + "giống mẫu / cấu hình riêng", số câu/hàng/lượt, cảnh báo (`contentWarnings`, ô ảnh chưa có ảnh, trường đã bù, lỗi đỏ); cuối bảng: **ước tính số trang** sau khi nhập. Chữ thô: ghi rõ "đoán, độ chắc thấp", mỗi Task có độ chắc + ô chọn mẫu khác; tự chọn "Một Task / Cả đề", cảnh báo khi dán > 40 dòng vào một Task.
- Ctrl+V chữ trên trang mở + Task ở thẻ "Từ file / dán". Panel Phiếu → Nâng cao → "Nạp phiếu khác (JSON / MD)…" mở + Phiếu.

### 16.3 Quy tắc
- **Nhập không bao giờ ghi đè Task có sẵn. Lỗi không đổi phiếu đang mở** (JSON hỏng, thiếu `tasks`, > 40 Task, > 8 MB, Task không dựng được). + Task bỏ qua Task hỏng; + Phiếu không cho tạo khi còn Task hỏng.
- JSON thiếu trường cấp phiếu / Task: tự bù, dữ liệu hợp lệ giữ nguyên (khứ hồi 18 Task mẫu giống hệt). Task không tên: hiển thị tiêu đề, rồi mô tả thành phần.
- **Mỗi file một phiếu**; phiếu nhiều nhóm tách thành nhiều file. Chưa nạp thẳng PDF trong app (không có hook thì báo gửi PDF cho Claude).

### 16.4 MD trung gian (tóm tắt, đủ ở `claude/QUY_UOC_MD.md`)
`## Task: <tiêu đề>` mở mỗi bài của PDF; `### Phần: <tên>` mở một phần tiếp của bài đó (v68); trường `Hướng dẫn:`, `Track:`, `Trả lời:`, `Dòng viết:`, `Khung từ:`, `Ảnh:`, `Lời dẫn:`, `Mẫu:`, `Ghi chú:`; khối `Bài đọc:`, `Hội thoại:`, `Ô chữ:`; câu đánh số và ký hiệu sẵn có; câu nhiều dòng bằng dòng thụt lề; `## Đáp án` riêng ở cuối → `key` từng câu (`### Task n` chạy liền qua các phần của bài n). Xuất: `taskToMd` / `sheetToMd` (nút **Xuất MD** ở thanh trên từ v70; phần nối xuất thành `### Phần:`).

### 16.5 Kiểm thử (v65)
test12 (P0), test13 (P1), test14 (P2) cùng test1–11, audit, audit2, `cmp_paste.py`, `ws_sea.py`: đạt; 0 lỗi console, 0 lỗi tràn. Phiếu Sea: JSON 6 Task 3 trang; `sea.md` ra đúng 3 Task đầu của JSON và cùng số trang.

### 16.6 Còn lại
P3 (thử 5–10 PDF thật qua đường chat, đo số Task đúng và chỗ phải sửa tay; đã thử 1 PDF qua 2 vòng); P4 (mẫu "Ô chữ" khi dán một khối chữ, đáp án ô chữ, phiếu nhiều nhóm); bản in đáp án từ `key`; "Mặc định theo dạng bài" cho Task `custom`.

### 16.7 Font nhúng sẵn (v66, 25/10/2026)
- Andika (phiếu) và Be Vietnam Pro (giao diện) nhúng bằng `@font-face` trỏ tới thư mục `fonts/` cạnh file HTML (woff2 các nhóm latin, latin-ext, vietnamese; giấy phép SIL OFL kèm theo). Không còn gọi Google Fonts: chạy offline vẫn dàn trang giống nhau.
- Nạp trước nhóm ký tự tiếng Việt cho Andika 400 và 700 trước khi đo trang. Khi font nạp thêm giữa chừng chỉ dàn lại trang, không dựng lại cột trái (tránh mất chữ đang gõ).
- Lưu ý kiểm thử: trước v66, môi trường test không tải được font nên đo bằng font thay thế. Từ v66 test đo bằng font thật; so sánh bố cục dùng `v62_font.html` (v62 + font nhúng) làm mốc, không dùng `v62_orig.html`.
- Bản artifact trên claude.ai vẫn dùng link Google Fonts (một file duy nhất, không có thư mục fonts).

### 16.8 Sửa theo phiếu thật đầu tiên (v67, 25/10/2026 tối)
- **Mẫu thử:** PDF "A Surprise Birthday Party" (Cambridge A1 Movers, 6 bài, 2 trang) → AI khác viết MD theo prompt cũ → nạp vào v66: chỉ ~1/6 Task dùng được. Nguyên nhân chính nằm ở **đường nhập**, không ở mô hình container: prompt có dòng mẫu "Nội dung:" làm AI chép theo; bộ đọc MD gặp dòng lạ thì lặng lẽ biến thành câu; lựa chọn A/B/C mỗi dòng một lựa chọn không được hiểu; ô tick ☐ trên lựa chọn chữ bị hiểu thành "tick ảnh"; gạch ___ của bản gốc nằm trùng với chỗ trả lời app vẽ; bài đọc mất đoạn; bảng nhận diện không báo các lỗi này.
- **Bộ đọc MD (`mdTask`):** bỏ dòng `Nội dung:` / `Content:`; dòng chỉ có nhãn `Xxx:` thì bỏ và ghi chú; bỏ `My answer: A / B / C` và dòng chỉ có gạch / chấm; lựa chọn `A. B. C.` mỗi dòng một lựa chọn (thụt lề hay không) gộp vào câu trên; câu chỉ có lựa chọn (không có thân câu) vẫn là một câu; `☐ / □ / [ ]` (cùng dòng hoặc mỗi dòng một ô, trừ dòng bảng) là lựa chọn của một câu → Lựa chọn A4 nhãn ô tick; dòng chữ thường sau câu cuối và trường mới `Ghi chú:` nối vào hướng dẫn (bước 1: dùng ô Hướng dẫn có sẵn, không thêm trường hiển thị mới); gạch `___` ở cuối câu bị bỏ khi đáp án là Đúng/Sai, viết câu, viết từ theo câu (giữ `Nhãn: ___`); bài đọc giữ đoạn (dòng trống); hội thoại chỉ nhận qua khối `Hội thoại:` (tránh nhầm `Place of the party: ___` là lời người nói); có ô tick mà đáp án không phải lựa chọn → ghi chú "tách thành nhiều Task" (**v68 đổi: ghi chú này nói tới `### Phần:`, mục 16.9**).
- **Mở rộng (bước 2 của quy trình):** A4 thêm giá trị `lab: 'box'` (☐ ô tick, bo góc) ở Inspector; mô tả "tick lựa chọn"; MD xuất `☐ …` và `Trả lời: tick`, nạp lại ra đúng. Không thêm format mới. Đã bỏ ý "số lựa chọn phải chọn" vì hướng dẫn của bài đã nói (vd "Tick two"), thêm thông số chỉ làm rối.
- **Bài đọc nhiều đoạn:** `lead.text` có `\n\n` thì mỗi đoạn một `<p>` (cách 2 mm); bài một đoạn hiển thị như cũ (18 Task mẫu giống hệt v66). Dùng được cả từ JSON.
- **Cảnh báo mới** (`contentWarnings`, mọi nguồn): câu lỗi chữ (`undefined`), câu trông giống tiêu đề (kết thúc bằng `:`), gạch ___ cuối câu trùng chỗ trả lời riêng, câu còn ký hiệu ô tick. Phiếu mẫu 18 Task: không có cảnh báo mới.
- **Prompt** `claude/PROMPT_PDF_SANG_PHIEU.md` và **quy ước** `claude/QUY_UOC_MD.md` (mục 4b, ví dụ 4) viết lại theo các quy tắc trên. *(Ở v67 prompt bảo AI tách bài trộn loại thành nhiều Task; sai, đã sửa ở v68, mục 16.9.)*
- **Kiểm thử v67:** test16 mới (32 phép kiểm, mẫu thật ở `claude/tests/real/` và `claude/tests/md/birthday.md`): MD gốc của người dùng ra đúng Task 1–5, Task 6 trộn loại có ghi chú + cảnh báo đỏ; MD mới ra đúng 7 Task, 3 trang, 0 tràn, không cảnh báo; Inspector ô tick; khứ hồi MD; JSON. test1–15, audit (0 vấn đề), audit2 (13/14/11 trang, 0 tràn), `cmp_paste.py` 20/20 giống v66, `ws_sea.py` giống hệt: đạt trên bản cuối; 0 lỗi console.

### 16.9 Task nhiều phần: "Nối vào Task trên" (v68, 25/10/2026 tối, lần 2)
- **Mẫu thử lần 2:** cùng phiếu "A Surprise Birthday Party", lần này người dùng chạy prompt v67 với AI của họ: PDF có **6** bài nhưng MD ra **8** Task. Phân loại lỗi:
  - *Prompt dẫn sai* (chính): v67 bảo "mỗi Task chỉ một loại đáp án, bài trộn thì tách thành nhiều Task" → bài 6 (Story Map + tick một ý + hoàn thành câu) thành Task 6, 7, 8; Task 8 lại chép nguyên hướng dẫn của Task 7 ("Tick one and finish the sentence").
  - *Mô hình thiếu chỗ chứa:* một bài của PDF có nhiều phần với chỗ trả lời khác nhau, mà phiếu chỉ có "một Task = một số + một kiểu đáp án". Cách thường: tách thành nhiều Task (đổi số Task so với PDF, sai).
  - *Bộ đọc / dàn trang:* các lỗi v67 đã sạch; hai chỗ nhỏ còn lại: nhãn lựa chọn `A. B. C.` của bản gốc bị hiển thị chữ thường (a b c); Task chỉ có một câu vẫn in số "1".
  - *AI đọc sai chữ:* không có. Dòng "Name / Class" cuối trang không chép (đúng).
- **Quy trình 3 bước:** (1) layout và cấu hình hiện có: mỗi phần dàn đúng (T6 + A2 / A4 ô tick) nhưng không có cách gộp chúng thành một Task có một số; (2) mở rộng: **thêm một giá trị cho tùy chọn có sẵn** `layout.break` (cùng chỗ với "Sang trang mới" và "Giữ liền Task sau") thay vì tạo trường hay Task kiểu mới; (3) không cần format mới. Người dùng chọn phương án này trong ba phương án đã nêu (B: nối Task; A: một Task nhiều khối đáp án; C: gộp bằng bảng) vì đổi ít nhất mô hình và giữ mỗi phần cấu hình độc lập.
- **`layout.break = 'join'`** ("Nối vào Task trên", mục 9.2): phần tiếp của Task phía trên. Hiển thị: không số, không tiêu đề; `instruction` riêng (nếu có) là một dòng thẳng đường dóng với chữ tiêu đề; cách trên bằng "Giữa các nhóm"; không padding-top G0. Số Task: `paginate()` tính `number` (phần nối dùng số Task trên) và `part` (a, b, c; chỉ khi Task có phần nối); cả hai không lưu khi nạp. Xếp trang: Task trên luôn xử lý như `keep` với phần nối (phần nối không bao giờ đứng đầu trang trừ khi cả cụm không vừa); `join` bỏ qua `page`; phần nối bị cắt trang vẫn không lặp G0.
- **Bật / tắt:** Inspector → Ngắt trang → "Nối vào Task trên"; cột trái → nút ↳ trong thanh công cụ Task. Task đầu phiếu không nối được (nút khóa; dữ liệu vẫn có `join` ở Task đầu thì hiện như Task thường + ghi chú "không nối được"). "Áp cho cả phiếu / cùng dạng" không chép `join`.
- **MD:** `### Phần: <tên>` trong một `## Task` (mục 1 và 4 của quy ước). Mỗi phần là một khối đọc như một Task (cùng trường `Hướng dẫn:`, `Trả lời:`…), khối đầu là Task, các khối sau có `layout.break = 'join'`. `## Đáp án`: `### Task n` đếm bài (không đếm phần), đáp án chạy liền qua các phần theo thứ tự câu. Xuất `sheetToMd`: phần nối thành `### Phần:`, đáp án gộp theo bài. Bảng nhận diện: "6 Task (Task 6 có 3 phần)", dòng 6a / 6b / 6c, thông báo sau khi tạo "6 Task, 8 khối".
- **Nhãn lựa chọn chữ hoa:** MD có lựa chọn viết `A. … B. …` (chữ hoa) → `answer.params.upper = true` (nhãn A B C); viết thường giữ a b c. Không áp cho ô tick. JSON: tự đặt `params.upper`.
- **Câu duy nhất không đánh số:** danh sách câu (câu hỏi, bài đọc + câu hỏi, T4) chỉ có đúng 1 câu thì ẩn số "1" nhưng **vẫn giữ lề số** (chữ thẳng đường dóng như các Task khác). Quy tắc tự động, không có công tắc (số "1" lẻ loi không có ý nghĩa; đổi lại nếu cần công tắc). Không áp cho T5 (lưới ảnh) và bảng.
- **Prompt / quy ước:** `claude/PROMPT_PDF_SANG_PHIEU.md` và `claude/QUY_UOC_MD.md` viết lại: một bài của PDF = một `## Task`, tự kiểm tra số Task bằng số bài của PDF, không chép lặp hướng dẫn, `### Phần:` cho các phần phụ; JSON dùng `layout.break: "join"`. Ví dụ đầy đủ = chính phiếu này (6 bài).
- **Ghi chú (đã làm ở v70, mục 16.11):** cột T/F mặc định 80/20; hướng lựa chọn khoanh thống nhất cả Task. Công tắc "Name / Class" ở cấp phiếu: người dùng hoãn.
- **Kiểm thử v68:** test17 mới (35 phép kiểm: MD cũ 8 khối vẫn đọc, MD mới 8 khối với 2 phần nối, nhãn 6a–6c, G0 không số / tiêu đề ở phần nối, hướng dẫn phần nối thẳng đường dóng, khoảng cách 6a→6b = 4 mm và Task→Task = 8 mm, số câu duy nhất ẩn mà chữ vẫn thẳng lề, nhãn A B C hoa, công tắc ↳ + Inspector + hoàn tác + Task đầu bị khóa, phân trang 0–8 Task đệm không bao giờ tách phần nối khỏi Task trên, khứ hồi MD, đáp án chạy liền, + Task bỏ nối ở đầu lô, Task đầu đánh dấu nối, phiếu mẫu 18 Task không đổi) đạt; các test còn lại: xem bàn giao.

### 16.9b Phiếu 1 chạy lại bằng prompt v68 (25/10/2026, lần 5)
- Người dùng gửi MD do AI tạo bằng prompt v68 (`tests/real/birthday-prompt68.md`, giữ nguyên) + ảnh Task 6 sau khi nạp. Kết quả: 6 Task, Task 6 có 2 phần nối (6a/6b/6c), không lặp hướng dẫn, không cảnh báo đỏ; app dựng đúng. test17 có thêm phép kiểm cho file này.
- **Hạn chế của phép thử:** file này trùng từng chữ với `tests/md/birthday6.md` và với ví dụ trong prompt (ví dụ trong prompt chính là phiếu này), nên chưa chứng minh prompt tổng quát hóa. Phép thử thật là phiếu không có trong ví dụ (đang chờ `tests/real/sunny-farm.pdf`).
- Chỗ lệch nhỏ còn lại (nhóm dàn trang, chưa sửa): mục "Nhãn: ___" các dòng kẻ bắt đầu ngay sau nhãn nên mép trái các dòng lệch nhau, mép phải thẳng; PDF gốc thẳng cả hai mép.

### 16.9c Phiếu 2 "A Visit to Sunny Farm" + prompt v68 (v71, 25/10/2026, lần 5)
- MD thật do AI tạo: `tests/real/sunny-farm-prompt68.md` (giữ nguyên); PDF gốc `tests/real/sunny-farm.pdf`. Phiếu không có trong ví dụ của prompt: AI ra đúng 6 Task (Task 4 có 2 phần, Task 6 có 3 phần), app dựng 3 trang, 0 tràn.
- **Sửa ở v71 (nhóm dàn trang):** nhãn lựa chọn Ⓐ / ô tick nằm ngang dòng đầu của lựa chọn (trước đây canh giữa nên lệch xuống khi lựa chọn dài hai dòng); khoảng cách nhãn → chữ 2 mm (ô tick 2,2 mm), trước 1,2 / 1,6 mm. test19 kiểm trên phiếu này.
- **Chưa sửa, chờ người dùng quyết:**
  1. *Header phiếu* (mô hình thiếu chỗ chứa): PDF có tên phiếu, Name/Class/Date, dòng "A1 Movers · 25 minutes", khung "My goal", đầu/chân trang; trang A4 hiện không in tên phiếu và không có chỗ cho các dòng này, nên AI nhét "My goal" vào `Ghi chú` của Task 1 (thành hướng dẫn của Task 1, sai chỗ).
  2. *Bài 1 sai thứ tự:* MD đặt `Bài đọc:` trong Task 1 sau ô tick; app luôn in bài đọc trước câu hỏi nên học sinh đọc truyện trước khi dự đoán, ngược PDF. Cách tạm bằng prompt: bài đọc đặt trong `### Phần:` sau phần tick.
  3. *Bài 5 (xếp thứ tự):* số câu 1–4 ở lề trùng với số học sinh phải điền, trông như đã điền sẵn; chưa có tùy chọn bỏ số câu khi có nhiều câu.
  4. *Ô tick 4 lựa chọn một hàng:* cột đều nên "farm animals" và "a football match" bị gãy dòng; chế độ "Tự xuống dòng" tránh được nhưng "Tự động" chưa chọn nó.
  5. Dòng "Self-check:" mất nhãn (tên phần không hiển thị).

### 16.10 Font chữ phiếu (v69, 25/10/2026 tối, lần 3)
- **Yêu cầu:** người dùng thích bộ font trong ảnh chụp, muốn chọn font ở thông số phiếu: font hiện tại / font trong ảnh / một font khác hợp.
- **Quy trình:** bước 1 chưa có chỗ chọn font; bước 2 thêm một thông số cấp phiếu `ws.font` (không thêm format). Panel Phiếu → mục **Font chữ phiếu**, đặt giữa "Xếp trang" và "Khoảng cách", 3 nút:
  - **Andika** (mặc định, font hiện tại; không lưu `font`);
  - **Be Vietnam Pro** (`be`): font trong ảnh, gọn, hiện đại. *Giả định:* chữ trong ảnh trông giống Be Vietnam Pro (font giao diện của app); nếu người dùng muốn font khác thì đổi bảng `FONTS`;
  - **Lexend** (`lexend`): font thiết kế cho dễ đọc, giãn chữ rộng, có tiếng Việt.
- Chỉ đổi font của **trang A4** (biến `--f-sheet`), giao diện giữ nguyên. Thêm font = thêm một dòng vào bảng `FONTS` (tên, danh sách font CSS, mô tả).
- Đổi font thì nạp trước các nhóm ký tự tiếng Việt, rồi **dàn lại trang** (số trang có thể đổi vì độ rộng chữ khác). Hoàn tác / làm lại và nạp phiếu đều áp đúng font.
- Lưu ở `ws.font`; JSON / khứ hồi giữ nguyên; `fillSheet` bỏ font lạ và báo "font không có trong danh sách". `font` không nằm trong khóa nhận diện "phiếu" khi nạp JSON.
- **Chưa kiểm:** hình dạng thật của Be Vietnam Pro và Lexend trong môi trường test (không tải được font, chỉ kiểm cơ chế: biến CSS đổi, dàn lại, 0 lỗi, khứ hồi). Bản repo đã nhúng sẵn font trong `fonts/` nên chạy offline vẫn đúng.
- Kiểm thử: `test18.py` (19 phép kiểm).

### 16.11 Đúng/Sai 80/20, hướng A4 theo Task, nút Xuất MD (v70, 25/10/2026, lần 4)
- **Quy trình:** cả ba là chỉnh mặc định / thêm lối ra cho cấu hình có sẵn, không thêm format.
- **Đúng/Sai 80/20:** Hai cột (T4) khi đáp án là A6 (cột T/F) có tỉ lệ nội dung / đáp án mặc định **80 / 20**, khoảng kéo 50–90 (hàm `rmeta`). T4 với đáp án khác giữ 60 / 40 (40–70). Giá trị người dùng đã kéo (`layout.split`) vẫn thắng. Phiếu mẫu: Task 13 đổi độ rộng cột.
- **Hướng A4 "Tự động" theo Task:** `a4dir` lấy đáp án dài nhất của **mọi câu trong Task** so với ngưỡng `autoMax`; ngắn hết thì Ngang, chỉ cần một câu dài thì cả Task Dọc. Hướng riêng theo câu (`perItem`) và các chế độ khác không đổi. Phiếu mẫu: Task 5 (câu A/B/C ngắn lẫn dài) nay xếp dọc cả Task.
- **Nút Xuất MD** cạnh "Xem JSON": mở cùng hộp thoại với `sheetToMd(ws)`, có nút Sao chép, ghi chú MD không giữ chỉnh layout, kích thước hay ảnh đã tải lên (muốn giữ đủ dùng JSON).
- **Hoãn theo người dùng:** công tắc Name / Class ở đầu phiếu.
- Kiểm thử: `test19.py` (badge v70; T4+A6 = 80 và khoảng 50–90; T4 khác vẫn 60; kẹp 90; A4 toàn ngắn → ngang cả Task, một câu dài → dọc cả Task; Xuất MD mở/đọc lại được; Xem JSON vẫn đúng tiêu đề; 0 lỗi console).

### 16.12 Cỡ chữ phiếu Nhỏ / Vừa / To (v72, 26/10/2026)
- **Yêu cầu:** chữ nội dung và câu hỏi hiện tương đối lớn; người dùng coi cỡ hiện tại là mức **To**, muốn thêm **Nhỏ** và **Vừa** để xem và đánh giá. Là thông số chuẩn hóa cho cả phiếu, không phải chỉnh từng Task.
- **Quy trình:** bước 2 (thêm một thông số cấp phiếu, cùng loại với `ws.font`), không thêm format.
- **Dữ liệu:** `ws.size` = `'s'` | `'m'`; mức To không lưu (như Andika với `font`). Giá trị lạ khi nạp bị bỏ và ghi chú "cỡ chữ không hợp lệ".
- **Bảng cỡ (pt), khai báo rõ, không dùng hệ số ẩn** (`FSZ`): 5–6 tuổi 12 / 14 / 16; 7–9 tuổi 10 / 12 / 14; 10–12 tuổi 9 / 10,5 / 12 (Nhỏ / Vừa / To). *Các số Nhỏ và Vừa là đề xuất để người dùng xem, chưa chốt.*
- **Áp cho:** cỡ chữ Task (`--fs`: tiêu đề, hướng dẫn, nội dung, câu hỏi), độ rộng lề số, đường dóng B, ngưỡng "đáp án ngắn" của A4 tự động. **Không đổi:** dòng viết tối thiểu theo độ tuổi (`AGE.line`), mọi khoảng cách và kích thước đã khai báo bằng mm, khung ảnh. Vì vậy chữ nhỏ lại không làm Task thấp tương ứng (ảnh và dòng viết giữ chiều cao).
- **Giao diện:** panel Phiếu → "Cỡ chữ phiếu" giữa "Font chữ phiếu" và "Khoảng cách", ba nút hiện sẵn số pt. Đổi cỡ thì dàn lại trang, hoàn tác được.
- **Chưa làm:** cỡ chữ của G-Text (Theo phiếu / Nhỏ / Vừa / To, mục 17).
- **Kiểm thử:** `test20.py` (25 phép kiểm: mặc định To không lưu, ba mức đúng pt trên trang, 0 tràn, tổng chiều cao To > Vừa > Nhỏ, hoàn tác, khứ hồi JSON, giá trị lạ, đổi độ tuổi). Bố cục mức To giống hệt v71 (`test2`).

---

## 17. G-Text và ba năng lực còn thiếu (chốt 26/10/2026; G-Text kiểu Chữ đã làm ở v73, mục 17.4)

> Thảo luận ngày 25–26/10/2026. Header / footer / tên phiếu làm riêng, không nằm trong mục này.

### 17.1 Đã quyết
- **Không làm kéo đổi chỗ tổng quát G1–G4** (cấp Task hay cấp G2). Lý do: bằng chứng cần còn ít (một trường hợp trong hai phiếu thật: bài đọc sau câu hỏi, đã có lối đi `### Phần:`); chi phí lớn (tách `body()` thành danh sách khối, tổng quát hóa phân trang vì G1 / G4 / bài đọc hiện chỉ ở mảnh đầu, hai nguồn sự thật `layout.task` và `layout.order`, đổi định danh `data-node`). Xem lại khi gặp 2–3 phiếu thật cần G1 / G4 ở vị trí lạ mà G-Text không thay được.
- **G-Text (khối tự do, cấp Task):** thêm / xóa tự do, một Task có thể có nhiều khối; không đánh số, không đáp án, không chịu ảnh hưởng của Task layout; là băng ngang full chiều rộng nằm **trên hoặc dưới** khối bài (cách A), đổi chỗ được với nhau và với khối bài. Ba dạng: **Chữ** (đoạn văn, gạch đầu dòng `- `, đánh số `1. `, in đậm / nghiêng, căn lề, kiểu khung không / viền / nền nhẹ, **cỡ chữ Theo phiếu / Nhỏ / Vừa / To**, cỡ theo cả khối chứ không theo đoạn bôi chọn, không có trình soạn WYSIWYG); **Ảnh** (dùng lại khung ảnh); **Thẻ** (một hàng 2–6 thẻ, mỗi thẻ ảnh + chữ như một ô T5 Ảnh trên, không có chỗ trả lời; dùng làm khung từ có ảnh). Cần thêm khái niệm "mảnh cuối" khi Task bị cắt trang; G-Text là khối không cắt được.
- **Ba năng lực còn thiếu**, làm lần lượt, mỗi bước chạy lại toàn bộ test: (1) G-Text; (2) chỗ trống và đánh dấu ngay trong bài đọc (cloze, khoanh, gạch chân; mở rộng bài đọc, dùng lại A2 và khung từ, kèm cắt bài đọc theo đoạn); (3) điểm neo trên ảnh (gắn nhãn, khoanh, tick, nối; điểm neo tính theo ảnh nên khi Fit cắt ảnh có thể rơi ra ngoài khung → cảnh báo; đặt tay bằng cách bấm lên ảnh, AI đọc PDF khó cho tọa độ đáng tin); (4) lưới tự do, bắt đầu từ crossword (ô đen và ô số, mở rộng T9). Bước 3 và 4 có giao diện mới nên **đưa hình minh họa cho người dùng duyệt trước khi viết code**.
- **Việc nhỏ cùng đợt đầu:** "Mặc định theo dạng bài" khóa theo cấu hình thay vì `typeId` (hiện mọi Task `custom` dùng chung một mặc định).

### 17.4 G-Text kiểu Chữ (v73, 26/10/2026) — đã làm; kiểu Ảnh và Thẻ chưa
- **Dữ liệu:** `t.extras = [{id, kind:'text', pos:'top'|'bottom', text, size?:'s'|'m'|'l', align?:'center'|'right', frame?:'line'|'fill'}]`. Không có `extras` thì Task giống hệt v72 (`test2` so với v72 đạt). Thứ tự gộp là `[khối top..., BÀI, khối bottom...]`; đổi chỗ là hoán vị trong danh sách này và tính lại `pos` (hàm `gtMove`).
- **Dàn trang:** băng ngang trong Task, thụt theo đường dóng B (như nội dung). Khối `top` nằm ngay dưới G0 và chỉ ở **mảnh đầu**; khối `bottom` chỉ ở **mảnh cuối** (`frag.last`, thêm vào `paginate`/`measure`). Vì khối đi theo mảnh đầu/cuối nên không bao giờ đứng một mình đầu hoặc cuối trang. Khối không cắt được qua trang.
- **Chữ:** đoạn cách nhau bằng dòng trống; `- ` hoặc `* ` đầu dòng là gạch đầu dòng; `1. ` hoặc `1) ` là danh sách số (tự đánh số); `**đậm**`, `*nghiêng*`; HTML bị escape; `___` giữ nguyên. Cỡ chữ cả khối: Theo phiếu / Nhỏ / Vừa / To (cùng bảng `FSZ` với cỡ chữ phiếu). Căn lề Trái/Giữa/Phải. Khung: Không / Viền / Nền nhẹ (bo góc 2 mm).
- **Giao diện:** cột trái, mục **5 · Khối tự do** (`+ Chữ`, ô gõ, ↑ ↓ đổi chỗ, ✕ xóa, ⚙ chọn để chỉnh định dạng). Chọn khối trên trang (`data-node="id:GT:xN"`) thì bảng phải hiện cỡ chữ, căn lề, khung, vị trí, xóa, về tự động.
- **Nạp file:** `fillTask` kiểm tra `extras`; loại khác `text` bị bỏ kèm thông báo; id trùng được cấp lại; giá trị sai bị bỏ kèm thông báo. **MD chưa có cú pháp cho khối tự do** (xuất MD không mang theo; dùng JSON).
- **Chưa làm:** kiểu Ảnh, kiểu Thẻ (1 hàng 2–6 thẻ ảnh + chữ), mang theo khi áp "Mặc định theo dạng bài", cú pháp MD.

### 17.2 Ước lượng độ phủ (26/10/2026, phán đoán của Claude, không phải số đo)
Trong danh sách 40 dạng bài tiếng Anh tự lập: 24 dạng (60%) đáp ứng trực tiếp, 9 (22%) làm được nhưng phải lách, 7 (18%) chưa hỗ trợ. Với bài cho học sinh 5–12 tuổi thực tế khoảng 90% trở lên. Phần thiếu dồn vào ba loại: điểm neo trên ảnh, tương tác trong văn bản liền mạch, lưới và sơ đồ tự do. Nên đối chiếu với các bộ sách đang dùng (Our World, Family and Friends, Global Success) để biết loại nào thực sự hay gặp.

### 17.3 Việc còn chờ từ phiếu Sunny Farm (mục 16.9c)
Header phiếu (làm riêng); bài 1 sai thứ tự (tạm dùng `### Phần:`); bài xếp thứ tự (số câu ở lề trùng số phải điền); ô tick 4 lựa chọn một hàng gãy chữ ("Tự động" chưa chọn "Tự xuống dòng"); nhãn "Self-check:" của phần không hiển thị.
