# WS Editor — Đặc tả (bản v36 + kế hoạch mục 15, 24/10/2026; cập nhật mục 16 ngày 25/10/2026; v78 ô chữ giải đố, mục 17.9; **v81 kiến trúc trình bày mới, mục 18**)

> File này là nguồn sự thật duy nhất cho WS Editor. Nó thay thế bản MASTER_SPEC v10 (quá nặng) và Claude Doc "Đặc tả Layout Task & Answer" (cũ hơn bản này).
> Prototype chạy được: `ws-editor-prototype.html` (một file HTML, mở bằng trình duyệt). Dữ liệu mẫu: `ws-sample.json` (schema 0.2).
> Khi bản prototype và file này lệch nhau, prototype là bản đúng hơn về hành vi; hãy báo để cập nhật file này.
> **Cập nhật 26/10/2026 (tối): prototype hiện là v81** — kiến trúc trình bày mới: Bố cục Task 4 kiểu (T), Dạng câu hỏi 12 kiểu (Q), khối G thêm / xóa thống nhất, cú pháp MD mới. Đọc **mục 18** trước; các mục 3–4 (T1–T9, A1–A8) giờ là tầng dữ liệu bên trong, giao diện không còn hiện.
> **Cập nhật 26/10/2026:** prototype hiện là **v77** (v76 + mặc định theo cấu hình, ẩn số câu ở lề, A4 Tự động chọn Tự xuống dòng, mục 17.8; v76 = v75 + điểm trên ảnh chung, mục 17.7; v75 = v74 + bài đọc có chỗ trống, chọn, đánh dấu chữ, cắt theo đoạn, mục 17.6; v74 = G-Text kiểu Ảnh và khung chữ 4 kiểu, mục 17.5; v73 = G-Text kiểu Chữ, mục 17.4; v72 = cỡ chữ phiếu Nhỏ / Vừa / To, mục 16.12; kế hoạch ba năng lực còn thiếu ở mục 17). Trước đó (25/10/2026, lần 4): **v71** (v70 + nhãn lựa chọn thẳng dòng đầu và cách chữ 2 mm, mục 16.9c). v70 (v69 + Đúng/Sai mặc định 80/20, hướng A4 "Tự động" quyết theo cả Task, nút Xuất MD; mục 16.11). v69 = v68 + chọn font chữ phiếu (mục 16.10). v68 = (v67 + Task nhiều phần "Nối vào Task trên", MD `### Phần:`, nhãn A. B. C. giữ chữ hoa, câu duy nhất không đánh số; mục 16.9). v67 = v66 + sửa bộ đọc MD theo phiếu thật đầu tiên, A4 có nhãn ô tick (mục 16.8). v66 = v65 + font nhúng sẵn trong `fonts/` (mục 16.7). Thay đổi v37–v68 ghi chi tiết ở `claude/WS_EDITOR_SPEC_v37_bo_sung.md` (mục cuối "BÀN GIAO"). Nhập file (P0–P2) tóm tắt ở **mục 16**; quy ước MD ở `claude/QUY_UOC_MD.md`.

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

**Phiếu demo đầy đủ (v78, 26/10/2026):** `samples/ws-demo-day-du.json`, nạp bằng **+ Phiếu** (chọn file hoặc dán). 30 Task, 17 trang, 0 tràn, không cảnh báo (chỉ 2 dòng thông tin "khung từ thừa 1 từ", cố ý làm từ gây nhiễu). Mỗi Task có `typeName` bắt đầu bằng "Demo ·" ghi tính năng đang trình bày (hiện ở cột trái). Gồm 14 Task của demo cài sẵn (một số chỉnh thêm: Task 1 dùng A3, Task 3 có mã QR) và các Task cho tính năng v67–v78: ô tick ☐ + Tự động → Tự xuống dòng, ảnh trái T2 / ảnh phải T3, điểm trên ảnh (chấm số; ô vuông trống), bài đọc nhiều đoạn có chỗ trống đánh số + `{a|b}` + đậm / nghiêng / gạch chân + đáp án chỗ trống, Task nhiều phần (Nối vào Task trên, một câu ẩn số, ẩn số câu ở lề, nhãn Self-check), khối tự do (chữ có khung, ảnh, chữ nhỏ căn phải, chữ nền xám), ô chữ tìm từ (không cắt bảng), ô chữ giải đố + gợi ý 2 cột. Không có ảnh tải lên (ô giữ chỗ). Dựng lại bằng `python3 tests/demo_full.py <prototype.html> [thư mục ảnh]`. Demo 18 Task cài sẵn trong app giữ nguyên vì các test đếm theo nó. Font và cỡ chữ phiếu để mặc định (Andika, To), đổi ở panel Phiếu để xem.

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

### 16.13 Câu nhiều dòng ở Task không ảnh (v79, 26/10/2026, sửa lỗi)
- **Lỗi:** người dùng nhập MD có câu viết hai dòng (dòng thụt lề dưới câu đánh số, vd câu gốc rồi `He used to ___ .`; câu hỏi rồi `‘ ___ ’` + lựa chọn A–D) → cả hai Task báo "Cannot read properties of undefined (reading 'includes')", không nhập được. Phân loại: **bộ đọc hiểu sai** (dòng thụt lề luôn bị đổi thành "ô nhiều dòng" `lines[]`, kiểu chỉ dành cho câu có ảnh ở T5; câu mất trường `text`) và code đọc `text` không kiểm tra (`attachOpts`). MD do AI viết đúng quy ước.
- **Sửa:** câu **có ảnh** (`img` / `imgs`) giữ như v65 (ô nhiều dòng). Câu **không ảnh**: giữ một câu, dòng tiếp nằm trong `text` sau ký tự `\n`. Trên phiếu `\n` là xuống dòng (`qtext`; chỗ trống cuối câu A2 vẫn kéo dài hết dòng cuối nhờ phần tử ngắt `.brk` trong hàng flex). Cột trái: câu có `\n` dùng ô nhập nhiều dòng. Xuất MD: dòng tiếp viết thụt lề 3 dấu cách; lựa chọn A–D của câu nhiều dòng ra một dòng thụt lề riêng. JSON: `text` có `\n` hiển thị như trên.
- Dữ liệu thật: `tests/real/nhieu-dong-user.md` (giữ nguyên). Test: `test27.py`.

### 16.14 Ký hiệu chữ, tách phần tự động, khung viết tự do, gạch trong câu, xóa khung ảnh (v80, 26/10/2026)
Người dùng nạp 5 chỗ chưa ổn; phân loại và cách sửa:
| # | Hiện tượng | Lớp lỗi | Sửa |
|---|---|---|---|
| 1, 2 | Không in đậm / gạch chân được một từ (`POLLUTE`, `originated`) | mô hình thiếu chỗ chứa (chữ câu không có kiểu chữ; chỉ bài đọc và G-Text có) | hàm `rich()` dùng chung: `**đậm**`, `*nghiêng*`, `<u>gạch chân</u>`, lồng nhau được. Áp ở câu, lựa chọn, hướng dẫn, bài đọc, hội thoại, ô bảng, ô nối, khung từ, G-Text |
| 3 | Bài có hai nhóm câu (hướng dẫn riêng, số lại từ 1) thành 1 Task 5 câu, dòng hướng dẫn thứ hai thành "câu" không có lựa chọn | prompt dẫn sai (AI không dùng `### Phần:`) + bộ đọc không phát hiện | prompt: quy tắc 10. Bộ đọc: dòng chữ không số, sau dòng trống, ngay trước `1.` → tách phần mới (7a / 7b), làm hướng dẫn, kế thừa `Trả lời:`, **có ghi chú** để người dùng kiểm tra |
| 4 | Dòng `‘ ___ ’` "mất" | dàn trang xấu (chỗ trống trong câu không có đáp án gắn trong câu chỉ là 6 dấu `_`, nhìn như không có) | `.gap` là một gạch thật rộng 22 mm, cao theo chữ |
| 5 | Bài viết 15 dòng bị hiểu là "một tranh", `Trả lời: viết câu` bị bỏ | bộ đọc hiểu sai + mô hình thiếu chỗ chứa | Task không có câu mà ghi `Trả lời: viết câu`: dựng một câu rỗng, `layout.num = 'off'`, A1 với `Dòng viết: N`, **không tự thêm ảnh**; "Dòng viết" tối đa 20 cho A1 (điền chỗ trống vẫn 8; ô nhập trong cột phải cũng tới 20). Không cảnh báo "chưa có chữ" cho khung viết đó. Xuất MD không in dòng `1.` rỗng |
- **Xóa khung ảnh:** chọn khung ảnh chung (G1) → cột phải có nút "Xóa khung ảnh"; phím Delete / Backspace khi G1 được chọn cũng được. Hoàn tác khôi phục. Bật lại ở Thành phần của bài → Ảnh (đã có từ trước). Chỉ áp cho ảnh chung G1; ảnh từng câu và khối ảnh G-Text vẫn xóa theo câu / khối.
- **Đặc tả ký hiệu `rich()`:** nhận chuỗi đã `esc`. `**` và `*` ghép từng cặp theo thứ tự; mở phải dính chữ phía sau, đóng phải dính chữ phía trước (nên `a * b * c` không thành nghiêng); dấu thiếu cặp hiện nguyên. Trong hàng flex của chỗ trống cuối câu (A2 `fill`), mỗi từ là một ô riêng nên đậm / gạch chân được bọc từng từ (gạch chân không liền qua dấu cách). Ký hiệu **không** áp trong tiêu đề Task, tên phiếu và nhãn.
- **Lệch cần biết:** `__x__` chỉ còn dùng được trong Bài đọc (v75). Trong MD, `normGap` đổi mọi `__` thành `___`, nên gạch chân ở nơi khác phải viết `<u>`. Đã ghi trong `QUY_UOC_MD.md` và prompt.
- Dữ liệu thật: `tests/real/dieu-chinh-v80.md` (MD người dùng gửi, thêm Task 6 để thử ký hiệu). Test: `test28.py`.

---

## 17. G-Text và ba năng lực còn thiếu (chốt 26/10/2026; G-Text kiểu Chữ đã làm ở v73, mục 17.4)

> Thảo luận ngày 25–26/10/2026. Header / footer / tên phiếu làm riêng, không nằm trong mục này.

### 17.1 Đã quyết
- **Không làm kéo đổi chỗ tổng quát G1–G4** (cấp Task hay cấp G2). Lý do: bằng chứng cần còn ít (một trường hợp trong hai phiếu thật: bài đọc sau câu hỏi, đã có lối đi `### Phần:`); chi phí lớn (tách `body()` thành danh sách khối, tổng quát hóa phân trang vì G1 / G4 / bài đọc hiện chỉ ở mảnh đầu, hai nguồn sự thật `layout.task` và `layout.order`, đổi định danh `data-node`). Xem lại khi gặp 2–3 phiếu thật cần G1 / G4 ở vị trí lạ mà G-Text không thay được.
- **G-Text (khối tự do, cấp Task):** thêm / xóa tự do, một Task có thể có nhiều khối; không đánh số, không đáp án, không chịu ảnh hưởng của Task layout; là băng ngang full chiều rộng nằm **trên hoặc dưới** khối bài (cách A), đổi chỗ được với nhau và với khối bài. Ba dạng: **Chữ** (đoạn văn, gạch đầu dòng `- `, đánh số `1. `, in đậm / nghiêng, căn lề, kiểu khung không / viền / nền nhẹ, **cỡ chữ Theo phiếu / Nhỏ / Vừa / To**, cỡ theo cả khối chứ không theo đoạn bôi chọn, không có trình soạn WYSIWYG); **Ảnh** (dùng lại khung ảnh); **Thẻ** (một hàng 2–6 thẻ, mỗi thẻ ảnh + chữ như một ô T5 Ảnh trên, không có chỗ trả lời; dùng làm khung từ có ảnh). Cần thêm khái niệm "mảnh cuối" khi Task bị cắt trang; G-Text là khối không cắt được.
- **Ba năng lực còn thiếu**, làm lần lượt, mỗi bước chạy lại toàn bộ test: (1) G-Text; (2) chỗ trống và đánh dấu ngay trong bài đọc (cloze, khoanh, gạch chân; mở rộng bài đọc, dùng lại A2 và khung từ, kèm cắt bài đọc theo đoạn); (3) điểm neo trên ảnh (gắn nhãn, khoanh, tick, nối; điểm neo tính theo ảnh nên khi Fit cắt ảnh có thể rơi ra ngoài khung → cảnh báo; đặt tay bằng cách bấm lên ảnh, AI đọc PDF khó cho tọa độ đáng tin); (4) lưới tự do, bắt đầu từ crossword (ô đen và ô số, mở rộng T9). Bước 3 và 4 có giao diện mới nên **đưa hình minh họa cho người dùng duyệt trước khi viết code**.
- **Việc nhỏ cùng đợt đầu:** "Mặc định theo dạng bài" khóa theo cấu hình thay vì `typeId` (hiện mọi Task `custom` dùng chung một mặc định).

### 17.4 G-Text kiểu Chữ (v73, 26/10/2026)
- **Dữ liệu:** `t.extras = [{id, kind:'text', pos:'top'|'bottom', text, size?:'s'|'m'|'l', align?:'center'|'right', frame?:'line'|'fill'}]`. Không có `extras` thì Task giống hệt v72 (`test2` so với v72 đạt). Thứ tự gộp là `[khối top..., BÀI, khối bottom...]`; đổi chỗ là hoán vị trong danh sách này và tính lại `pos` (hàm `gtMove`).
- **Dàn trang:** băng ngang trong Task, thụt theo đường dóng B (như nội dung). Khối `top` nằm ngay dưới G0 và chỉ ở **mảnh đầu**; khối `bottom` chỉ ở **mảnh cuối** (`frag.last`, thêm vào `paginate`/`measure`). Vì khối đi theo mảnh đầu/cuối nên không bao giờ đứng một mình đầu hoặc cuối trang. Khối không cắt được qua trang.
- **Chữ:** đoạn cách nhau bằng dòng trống; `- ` hoặc `* ` đầu dòng là gạch đầu dòng; `1. ` hoặc `1) ` là danh sách số (tự đánh số); `**đậm**`, `*nghiêng*`; HTML bị escape; `___` giữ nguyên. Cỡ chữ cả khối: Theo phiếu / Nhỏ / Vừa / To (cùng bảng `FSZ` với cỡ chữ phiếu). Căn lề Trái/Giữa/Phải. Khung: Không / Viền / Nền nhẹ (bo góc 2 mm).
- **Giao diện:** cột trái, mục **5 · Khối tự do** (`+ Chữ`, ô gõ, ↑ ↓ đổi chỗ, ✕ xóa, ⚙ chọn để chỉnh định dạng). Chọn khối trên trang (`data-node="id:GT:xN"`) thì bảng phải hiện cỡ chữ, căn lề, khung, vị trí, xóa, về tự động.
- **Nạp file:** `fillTask` kiểm tra `extras`; loại khác `text` bị bỏ kèm thông báo; id trùng được cấp lại; giá trị sai bị bỏ kèm thông báo. **MD chưa có cú pháp cho khối tự do** (xuất MD không mang theo; dùng JSON).
- **Chưa làm:** mang theo khi áp "Mặc định theo dạng bài", cú pháp MD.

### 17.5 G-Text kiểu Ảnh và khung chữ (v74, 26/10/2026)
- **Quyết định của người dùng:** chỉ làm kiểu Ảnh, **bỏ kiểu Thẻ** (tạm thời). Trang trí khối Chữ cho phép nhưng ít lựa chọn.
- **Khối Ảnh:** `{id, kind:'image', pos, label?, w?:20..100 (mặc định 50), align?:'center'|'right'}`. Khóa ô ảnh là `@<id>` (như ô ảnh của câu): dùng lại tải / tạo / gỡ ảnh, kéo thả, tỉ lệ ô giữ chỗ (`imgAr`), kiểm tra độ mờ. Khung theo tỉ lệ của ảnh đã tải (hoặc tỉ lệ ô giữ chỗ), rộng `w`% bề rộng Task, ảnh bo góc như mọi khung ảnh. Chưa có Fit / zoom / lệch tâm cho khối Ảnh. Xóa khối thì dọn `uploads`, `upMeta`, `imgAr` của khối.
- **Khung khối Chữ:** Không / Viền xám / Nền xám nhẹ / Viền + nền (`frame`: `line` | `fill` | `both`). Màu cố định (viền `#9aa6ad`, nền `#eef1f3`), không đổi theo chế độ tối của giao diện, bo góc 2 mm.
- Test mới: `test22.py`. `fillTask` nhận `kind:'image'`; `w` ngoài 20–100, `size`, `frame` trên khối ảnh bị bỏ và có thông báo (`w`).

### 17.6 Bài đọc có chỗ trống, chọn, đánh dấu và cắt theo đoạn (v75, 26/10/2026)
- **Cú pháp trong bài đọc** (`content.lead.text` của dạng passage): `___` (3 gạch trở lên) là chỗ trống, tự đánh số `(1)`, `(2)`… khi bài đọc có từ 2 chỗ trống (1 chỗ thì gạch trơn không số); số liên tục qua các đoạn và các trang. `{a|b}` hiện **a / b** (in đậm). `**đậm**`, `*nghiêng*`, `__gạch chân__`. Dòng trống là sang đoạn. Bài đọc một dòng, không có markup: hiển thị y như v74.
- **Đáp án chỗ trống:** `content.lead.keys = ['am','go','play']`, theo thứ tự chỗ trống; nhập ở ô "Đáp án chỗ trống" dưới ô Bài đọc ở cột trái. Có cảnh báo khi số đáp án khác số chỗ trống. MD: dòng `Đáp án chỗ trống: am, go, play` (xuất và nhập). Chưa đưa vào bảng "## Đáp án" cuối MD (bảng đó đang chỉ chứa đáp án theo câu).
- **Khung từ trong bài đọc:** trước v75 Task bài đọc bỏ qua khung từ (không vẽ); từ v75 khung từ hiện (ở trên bài đọc, hoặc bên phải nếu đặt "Bên phải"; ở layout bao chữ T8 và hai cột T4 luôn nằm trên). Cảnh báo "khung từ thừa/thiếu so với chỗ trống" tính cả chỗ trống trong bài đọc.
- **Cắt theo đoạn:** layout T1 / T6 (bài đọc không ảnh hoặc ảnh phía trên), chế độ Liền trang: các đơn vị cắt là từng đoạn rồi từng câu hỏi (không cắt giữa đoạn). Trang tiếp theo không lặp tiêu đề; khung từ và ảnh chung chỉ ở mảnh đầu. T8 vẫn: bài đọc + ảnh đi cùng, chỉ các câu sau cắt được; T2 / T3 / T4 chưa cắt.
- **Chưa làm:** gợi ý trong chỗ trống như `(1) (be)`; khoanh / gạch chân do học sinh làm trên bài đọc (không cần cú pháp, học sinh tự vẽ); cắt theo đoạn cho T2 / T3 / T4; đáp án chỗ trống trong bảng đáp án cuối MD.
- Test mới: `test23.py`.

### 17.7 Điểm trên ảnh chung (v76, 26/10/2026) — kiểu A và C của hình mẫu
- **Dữ liệu:** `image.marks = [{x, y}]` (% theo **tọa độ ảnh**, 0–100, tối đa 20 điểm) và `image.mk = {shape?:'square', label?:'none'}` (vắng = chấm tròn có số). Chỉ cho ảnh chung G1.
- **Hiển thị:** chấm cỡ cố định 5,5 mm (ô trống 7,5 × 6 mm), viền đỏ `#c0392b`, nền trắng; điểm thứ n mang số n, ứng với câu n. Lớp `.mk` mô phỏng đúng vùng của ảnh (kể cả khi khung cắt ảnh theo kiểu cover, và khi Fit ngang / dọc, zoom, lệch tâm), nên điểm bám theo ảnh.
- **Thao tác:** panel Ảnh → "Điểm trên ảnh" → **Đặt điểm** rồi bấm vào ảnh trên trang; kéo điểm để dời (mọi lúc, không cần bật chế độ đặt); chip "n ✕" xóa từng điểm; Xóa hết; chọn Hình (Tròn / Vuông) và Bên trong (Số / Ô trống).
- **Cảnh báo (nhẹ):** số điểm khác số câu; ảnh đang Fit nên điểm có thể rơi ngoài khung.
- **Chưa làm:** kiểu B (dây nối ra ô viết); điểm cho ảnh của từng câu / ô lưới; MD không mang điểm (dùng JSON).
- Test mới: `test24.py`.

### 17.8 Dọn việc nhỏ (v77, 26/10/2026)
- **Mặc định theo dạng bài khóa theo cấu hình:** `presetKey(t)` = `typeId` nếu là dạng có sẵn; với Task `custom` là `custom|<kiểu nội dung>|<loại đáp án>|<A?>|img|bank`. Hai Task tự chế khác cấu hình không còn dùng chung một mặc định. Mặc định cũ lưu theo `typeId` vẫn dùng được; mặc định `custom` cũ (chung cho mọi Task tự chế) không còn khớp Task nào nên có thể xóa ở Phiếu → Nâng cao. Mỗi mặc định lưu kèm tên để hiện trong danh sách. Phạm vi "Áp cho dạng này" cũng theo `presetKey`.
- **Số câu ở lề ẩn được:** `layout.num = 'off'` (vắng / null = hiện). Panel Task → "Số câu ở lề: Hiện / Ẩn", hiện khi Task có từ 2 câu (không áp cho bảng và Task chỉ ảnh). Ẩn là `visibility:hidden` nên chữ vẫn thẳng đường dóng. Dùng cho bài xếp thứ tự, khi học sinh tự điền số vào chỗ trống.
- **A4 "Tự động":** lựa chọn dài hơn ngưỡng (`autoMax`, mặc định 22 ký tự ở cỡ To) vẫn xếp **Dọc**; nếu vừa một hàng cột đều (ước lượng `n × (ký tự × cỡ chữ × 0,5 + 14 mm) ≤ 150 mm`) thì **Ngang**; còn lại **Tự xuống dòng** (trước đây vẫn Ngang rồi gãy chữ trong ô). Ước lượng này là xấp xỉ, không đo chữ thật; nếu thấy sai thì chỉnh thủ công Hướng xếp.
- **Nhãn "Self-check:" của phần:** không sửa app; đây là lỗi prompt. Tên `### Phần:` chỉ là tên nội bộ và không in; nhãn in sẵn trong PDF phải ghi vào `Hướng dẫn:` của phần (app in dòng này cho phần nối). Prompt (`PROMPT_PDF_SANG_PHIEU.md`) và `QUY_UOC_MD.md` đã thêm quy tắc.
- Test mới: `test25.py`.

### 17.9 Ô chữ giải đố (v78, 26/10/2026)
- **Là bảng (T9) có `layout.table.cross = true`.** Không thêm kiểu nội dung mới: `content.form='table'`, mỗi ô một ký tự trong `rows[].cells`, `cols` toàn chuỗi rỗng, `head=''`. Bật ở panel Task → "Kiểu bảng: Bảng thường / Ô chữ giải đố".
- **Quy ước ô** (`crossCell`): `''` hoặc `#` = không có ô (không vẽ gì); `.` = ô trống chưa biết đáp án; chữ cái = ô có đáp án; `(a)` = chữ cho sẵn (luôn in, nền xám nhạt).
- **Hiển thị:** không có ô đen. Mặc định mọi chỗ nền trắng không viền; chỉ ô có nội dung mới có viền xám, bo góc. Số 1, 2, 3 đánh tự động ở góc ô, đọc từ trái sang phải, trên xuống dưới, ô nào là đầu của từ ngang hoặc dọc thì nhận số (`crossHtml`). `layout.table.key = true` thì in chữ đáp án (bản giáo viên); mặc định ẩn.
- **Cỡ ô** `layout.table.xc` (mm, 6–16, mặc định 10); vị trí trái / giữa / phải = `layout.table.align`. Ô chữ không bị cắt giữa trang (`units` bỏ qua `split` khi `cross`).
- **Soạn:** cột trái mục 3 là một ô văn bản "Lưới ô chữ" (mỗi dòng một hàng, `applyField('cross.grid')`), có đếm ô / từ ngang / từ dọc. Cảnh báo khi chưa có từ nào.
- **MD:** `Crossword:` (hoặc `Ô chữ giải đố:`) rồi mỗi dòng một hàng, dùng `#`, `.`, chữ, `(a)`. `Ô chữ:` cũ vẫn là word search.
- **Lời gợi ý ngang / dọc:** dùng khối G-Text (mục 5). G-Text có thêm **2 cột chữ** (`extras[].cols = 2`) và danh sách số được bắt đầu từ số bất kỳ (`4. …` → `<ol start=4>`), để chia "Across" và "Down" mà không cần format mới.
- Không làm: tự tìm vị trí đặt từ (người soạn hoặc AI cho sẵn lưới); ô trống chỉ định từ nhiều chữ trong một ô.
- Test mới: `test26.py`.

### 17.2 Ước lượng độ phủ (26/10/2026, phán đoán của Claude, không phải số đo)
Trong danh sách 40 dạng bài tiếng Anh tự lập: 24 dạng (60%) đáp ứng trực tiếp, 9 (22%) làm được nhưng phải lách, 7 (18%) chưa hỗ trợ. Với bài cho học sinh 5–12 tuổi thực tế khoảng 90% trở lên. Phần thiếu dồn vào ba loại: điểm neo trên ảnh, tương tác trong văn bản liền mạch, lưới và sơ đồ tự do. Nên đối chiếu với các bộ sách đang dùng (Our World, Family and Friends, Global Success) để biết loại nào thực sự hay gặp.

### 17.3 Việc còn chờ từ phiếu Sunny Farm (mục 16.9c)
Còn: header phiếu (làm riêng); bài 1 sai thứ tự (tạm dùng `### Phần:`). Đã xử lý ở v77 (mục 17.8): số câu ở lề, ô tick 4 lựa chọn, nhãn "Self-check:".

## 18. Kiến trúc trình bày mới (v81, 26/10/2026)

Bản duyệt: `docs/KIEN_TRUC_TRINH_BAY_MOI.html`. Mục này ghi **hành vi thật** của v81. Nguyên tắc chính: **dữ liệu không đổi** (schema `ws-editor/0.3`, mã T1–T9 trong `layout.task`, A1–A8 trong `answer.layout`). T và Q **suy ra** từ dữ liệu đó, nên mọi phiếu cũ mở ra giống v80 từng điểm ảnh (công cụ `tests/cmp_v80.py`: 16 phiếu, so HTML các trang).

### 18.1 Bố cục Task (T, 4 kiểu)
| T | Tên | Mã bên trong |
|---|---|---|
| T1 | Xếp dọc | T1, T4 (hai cột câu / đáp án), T5 (lưới), T6, T7 (nối), T9 (bảng) |
| T2 | Ảnh trái | T2 |
| T3 | Ảnh phải | T3 |
| T4 | Ảnh trong bài đọc | T8 |
- Bộ chọn: **Tự động** + 4 nút; bố cục không dùng được nằm trong "Bố cục chưa dùng được" kèm lý do (lấy từ `layoutReasons`). Chọn Xếp dọc thì giữ cách xếp câu bên trong đang dùng (`t1Old`), Tự động thì `task:'auto'`.
- Hai ảnh chung (`image.two`) và "câu hỏi trước bài đọc" khóa Ảnh trái / phải / trong bài đọc (`layoutReasons`, `autoLayout` bọc lại).

### 18.2 Dạng câu hỏi (Q, 12 kiểu) = nội dung câu + cách trả lời + cách xếp câu
Q1 Điền từ · Q2 Viết câu · Q3 Chọn A/B/C · Q4 Chọn trong câu · Q5 Đúng / Sai · Q6 Nhìn ảnh viết · Q7 Chọn ảnh · Q8 Nối · Q9 Tô chữ · Q10 Bảng · Q11 Lưới · Q12 Viết tự do.
- `qDerived(t)`: bảng → Q10 (Q11 nếu ô chữ giải đố hoặc bảng không tiêu đề hàng / cột); vế ghép → Q8; ảnh từng câu → Q6 (Q7 nếu nhiều ảnh / câu); tô chữ → Q9; tf / tick → Q5; choice inline → Q4, khác → Q3; sentence → Q12 nếu một câu rỗng và ẩn số, khác → Q2; word → Q1.
- Task **không có chỗ trả lời** (kind none) thì Q không suy ra được: nhớ ở `t.q` (chỉ khi cần, `qTidy` xóa khi thừa). Công tắc "Có chỗ trả lời": tắt = `setKind none`, cất đáp án cũ ở `content.noAns`, bật lại khôi phục.
- `setQ(t,q)`: đổi cấu trúc câu, giữ chữ các câu, ảnh chung, bài đọc, khung từ, khối tự do, nối Task; bố cục về Tự động (trừ Ảnh trái / phải / trong bài đọc còn dùng được). Hoàn tác một bước. Câu có ảnh mà đổi sang Q1–Q5: tên ảnh thành chữ câu. Q4 trên câu có `<u>…</u>` và chưa có `{a|b}` = bài tìm lỗi sai (bật nhãn A–D); câu chưa có lựa chọn thì chèn `{…|…}` để sửa. Q12 = một câu rỗng, ẩn số, 8 dòng.
- `qReasons`: bài đọc chỉ đi với Q1, Q2, Q3, Q5; hội thoại (có người nói) chỉ Q1–Q5.
- **Cách trả lời** (`qStyles`, không hiện mã A): Q1 gạch / ô chữ cái; Q2 dòng kẻ / gạch cuối câu; Q3 khoanh Ⓐ / A. / ô tick; Q4 gạch-khoanh / nhãn A–D (chỉ hiện cách dùng được); Q5 khoanh nhãn / ô tick, **nhãn** T/F · True/False · Yes/No · T/F/NG · Right/Wrong (`params.labs`); Q6 gạch / ô chữ cái / dòng kẻ / chọn trong câu; Q12 dòng kẻ / khung trống để vẽ (`params.frame:'box'`). **Kiểu dòng** cho A1 / A8: thường / bốn ô li (`params.ruling:'4'`).
- **Cách xếp câu** (`qArr`, chỉ khi Xếp dọc): Q5 cột phải (T4) / ngay dưới câu; Q6 / Q7 lưới ô (T5) / danh sách (T6).
- Hình xem trước: rê chuột lên nút Q hiện một mẫu nhỏ (`QPV`).

### 18.3 Giao diện
- Inspector Task: Bố cục Task + Dạng câu hỏi + tùy chọn Q thay bộ chọn 9 bố cục cũ; các phần Kích thước / Căn lề / Khoảng cách giữ nguyên.
- Chọn G3 (chỗ trả lời) → panel **Câu hỏi · <Q>** (bỏ "Gắn đáp án" và lưới "Kiểu đáp án"; thông số cỡ / căn giữ nguyên). Chọn chỗ trả lời của một câu → "Câu n · chỗ trả lời" + Thêm câu sau / Nhân đôi / Đặt làm câu ví dụ / Xóa câu (`iadd/idup/iex/idel`); câu ví dụ có ô đáp án mẫu.
- Chọn bài đọc (G2 của Task có bài đọc) → panel **Bài đọc**: thứ tự Bài đọc trước / Câu hỏi trước (`layout.order:'qfirst'`; khóa khi Bố cục chọn tay là Ảnh trong bài đọc), xóa bài đọc; dưới là thông số cả Task.
- Ảnh chung: thêm / xóa ảnh thứ hai (`image.two`, `image.label2`, ô `G1b`), hai ảnh cạnh nhau cùng cỡ.
- Khung từ: Loại Chữ / Ảnh (`wordBank.kind:'image'`, ô `B.i`, nhãn A B C, chữ dưới ảnh hiện / ẩn `cap`, tỉ lệ `ar` 1:1 · 4:3 · 3:4, số ảnh mỗi hàng `cols`), Vị trí Trên / **Dưới** / Phải (`placement:'bottom'`, in sau câu hỏi ở mảnh cuối), nút Xóa.
- Cột trái mục 1 đổi tên **Bố cục & dạng câu hỏi**: cùng bộ chọn T / Q (giữ Áp mẫu và chọn loại đáp án cũ ở dưới). Mục 3: nút ✕ ở từng khối (ảnh chung, ảnh thứ hai, bài đọc, lời dẫn, khung từ), ô ảnh của khung từ ảnh, **Thêm khối** (ảnh chung, ảnh thứ hai, bài đọc, lời dẫn, câu hỏi, khung từ chữ / ảnh, khối chữ / ảnh), nút **Ví dụ** ở từng câu, **+ Dòng chữ**; câu đánh số theo câu thật (ví dụ = 0, dòng chữ ghi "Chữ").
- Phím **Delete** trên trang: xóa khối đang chọn (khung từ, khối tự do, bài đọc, câu; ảnh chung như v80). Hoàn tác được.

### 18.4 Lõi vẽ trang (dữ liệu mới, đều tùy chọn)
| Trường | Ý nghĩa |
|---|---|
| `items[].ex` | câu ví dụ: số 0, đáp án (`key`) in sẵn theo kiểu A (gạch có chữ, ô chữ cái, lựa chọn được khoanh…) |
| `items[].gt` | dòng chữ giữa các câu (G3-Text): không số, không chỗ trả lời, không tính vào số câu (`qnum`, `itemKeys`, `labelOf` bỏ qua) |
| `items[].who` + choice | người nói trước câu hỏi A/B/C (chỉ JSON) |
| `image.two`, `image.label2` | ảnh chung thứ hai |
| `wordBank.kind:'image'`, `ar`, `cols`, `cap`; `placement:'bottom'` | khung từ ảnh, vị trí dưới |
| `answer.params.labs` | nhãn Đúng / Sai tự đặt (2–3) |
| `answer.params.ulab` | nhãn A–D dưới đoạn `<u>…</u>` (tìm lỗi sai) |
| `answer.params.frame:'box'`, `boxH` | khung trống để vẽ (A1) |
| `answer.params.ruling:'4'` | dòng bốn ô li (A1, A8) |
| `layout.order:'qfirst'` | câu hỏi trước bài đọc (không cắt bài đọc theo đoạn) |
| `t.q`, `content.noAns` | dạng câu hỏi nhớ khi tắt chỗ trả lời |
- Bài đọc có ≥ 2 đoạn bắt đầu `A.`–`H.` thì in nhãn đậm đầu đoạn.
- `fillTask` nhận các trường mới (placement `bottom`, `kind`/`ar`/`cols`/`cap` của khung từ); `migTask` giữ `layout.order`; `ovOf` tính `order` là chỉnh tay.

### 18.5 MD (bậc 0 / 5)
Cú pháp đầy đủ ở `docs/QUY_UOC_MD.md` mục 2, 2b, 4c, 5. Trường mới: `Dạng:` (thắng `Trả lời:`, chi tiết trong ngoặc), `Bố cục:`, `Ảnh: A; B`, `Khung từ ảnh:`, `Vị trí khung từ:`, `Dòng kẻ: bốn ô li`, `Thứ tự: câu hỏi trước`, `Điểm trên ảnh:`, `Khối chữ[ trên]:` + dòng thụt lề, `Khối ảnh[ trên]:`; câu `0.` = ví dụ, dòng `> ` = dòng chữ; trong `## Đáp án`: `0.` = đáp án mẫu, `Chỗ trống:` = đáp án chỗ trống bài đọc; đoạn bài đọc `A. …` (≥ 8 từ) giữ là đoạn có nhãn. Câu có `[ảnh: …]` mà `Dạng:` là điền từ / viết câu / chọn: hiểu là cách trả lời của Nhìn ảnh viết / Chọn ảnh, không bỏ ảnh. Xuất MD luôn ghi `Dạng:` (kèm `Trả lời:`) và các trường v81 đang dùng; đọc lại ra đúng phiếu. Prompt cho AI (`PROMPT_PDF_SANG_PHIEU.md`) đã chuyển sang `Dạng:` (quy tắc 11–15).

### 18.6 Kiểm thử
`tests/test29.py` (giao diện T / Q: 18 Task × mọi Q hợp lệ ≈ 200 lần đổi dạng + hoàn tác, bố cục, xem trước, chỗ trả lời, nhãn, bốn ô li, khung vẽ, khối, Delete, câu ví dụ, dòng chữ, bài đọc, JSON khứ hồi), `tests/test30.py` (MD mới: đọc, vẽ, xuất rồi đọc lại; `birthday6-dang.md` = phiếu thật viết bằng `Dạng:` cho cùng cấu hình như `Trả lời:`), `tests/cmp_v80.py <mới> <v80>` (16 phiếu cũ / phiếu thật giống v80). `test2` đổi một kiểm tra chữ "Đáp án" → chấp nhận "Câu hỏi" (đổi tên có chủ đích).

### 18.7 Chưa làm / giới hạn
- G3 chia nhóm (hai nhóm câu với hai cách trả lời trong một Task) vẫn hoãn; dùng `### Phần:` / Nối vào Task trên.
- Chưa thử P3 với phiếu do AI khác tạo theo prompt v81 (cần người dùng gửi PDF + MD).
- ~~"Áp mẫu" và chọn loại đáp án cũ vẫn còn ở cột trái mục 1~~ → đã bỏ ở v82 (mục 19).
- Câu hỏi trước bài đọc không dùng với Ảnh trong bài đọc / bài đọc cạnh câu hỏi (khóa, có lý do).

## 19. Cột trái theo khối (v82, 26/10/2026)
Người dùng đề xuất, đã duyệt qua hình `docs/MINH_HOA_COT_TRAI.html`. Chỉ đổi giao diện cột trái; **không đổi dữ liệu, không đổi dàn trang** (cmp_v80 giữ nguyên). Mục đích: sau khi nhập file vẫn vào từng khối để thêm / sửa / xóa, khối trên trang và mục ở cột trái khớp nhau.

### 19.1 Các mục (thay 5 mục cũ: Dạng bài & đáp án · Tiêu đề & hướng dẫn · Nội dung · Thành phần · Khối tự do)
| Mục (`data-sec`) | Nội dung | Nhãn bên phải |
|---|---|---|
| ⚙ **Cấu hình** (`cfg`) | thẻ mô tả (chip), Bố cục Task (T), Dạng câu hỏi (Q), tùy chọn của Q, **Tùy chọn của câu**, **Khối của bài** | `T2 · Q5` (luôn hiện, không phụ thuộc nút hiện mã) |
| **G0** Tiêu đề (`g0`) | tiêu đề, hướng dẫn, track, mã QR | |
| **G1** Ảnh chung (`g1`) | ảnh 1, ảnh 2, nút + Ảnh thứ hai | |
| **G2** Bài đọc / Lời dẫn (`g2`) | bài đọc + đáp án chỗ trống, hoặc lời dẫn (hội thoại) | `theo T…` (vị trí bài đọc do Bố cục quyết) |
| **G3** Câu hỏi / Bảng (`g3`) | tỉ lệ ô ảnh, danh sách câu (cả dòng chữ G3-Text), hoặc bảng | `theo Q…` |
| **G4** Khung từ (`g4`) | ô từ, ô ảnh của khung từ ảnh | |
| **GT** Khối tự do (`gt`) | như cũ | |
- **Khối chưa có**: mục vẫn hiện nhưng mờ, không mở ra được, có nút thêm ngay tại mục (`data-eact="blkaddb"`, dùng `blkAdd`): G1 "+ Thêm", G2 "+ Bài đọc" / "+ Lời dẫn" (theo `blkAddable`), G3 "+ Thêm" hoặc "+ Bật lại" (khi danh sách tắt nhưng còn giữ câu), G4 "+ Chữ" / "+ Ảnh". Không thêm được thì ghi "không dùng cho dạng này". Bỏ ô chọn "Thêm khối" cũ.
- **Thành phần cũ tách đôi** (cùng `fieldToggles`, cùng `toggleField`): công tắc bật / tắt khối (Ảnh chung, Bài đọc, Lời dẫn, Câu hỏi = `list`, Khung từ) vào "Khối của bài"; tính năng của câu (Ảnh mỗi câu, Nhiều ảnh lựa chọn, Người nói, Vế ghép, Ô nhiều dòng, Ghi đáp án đúng) vào "Tùy chọn của câu", chỉ hiện công tắc dùng được.
- **Bỏ khỏi cột trái**: ô "Áp mẫu" và ô chọn loại "Đáp án" (trùng bộ chọn Q). Áp mẫu vẫn còn ở hộp **+ Task** (tạo Task mới); hàm `applyRecipe` / `setKind` giữ nguyên.
- G3 không có bố cục riêng: Q được suy ra từ nội dung G3, sửa G3 thì nhãn `theo Q…` tự đổi. G2 chưa có bố cục riêng ngoài vị trí trong T (người dùng đồng ý để sau).
- Mặc định khi mở Task: mở G1–G4, thu Cấu hình / G0 / GT (`SECT_DEF`, nhớ trong `localStorage` khóa cũ `wsEditor.sections.v2`, các khóa cũ bị bỏ qua). `focusK` tự mở mục đang thu nếu ô cần gõ nằm trong đó. Chip "đáp án" trên thẻ mở mục Cấu hình.

### 19.2 Mã
Khối `v82` cuối file, ngay sau `hết v81`: bọc `edHtml` (dựng HTML v81 rồi phân các phần của mục "Nội dung" cũ vào G1 / G2 / G3 / G4 theo `data-k`: `image.*`/`.imgrow` → G1, `lead.*` → G2, `wb.*`/`.wbth` → G4, còn lại → G3), bọc `secSums` (tóm tắt theo khóa mới), bọc `focusK`, thêm xử lý `blkaddb`. CSS `/* v82 */` sau `.qbt`.

### 19.3 Kiểm thử
`tests/test31.py` (18 Task: thứ tự mục, nhãn T · Q khớp `tnOf`/`qOf`, khối có / chưa có khớp dữ liệu, không còn ô cũ; Cấu hình tách công tắc; + Thêm ở G1 / G4 / G2 lời dẫn / G3 rồi hoàn tác; Bảng; `focusK` mở mục thu; tóm tắt cập nhật khi gõ). Sửa test1, 2, 7, 8, 9, 10, 15, 21, 22, 23, 29 theo tên mục mới; test9 / test10 áp mẫu bằng `applyRecipe` thay ô chọn đã bỏ.

### 19.4 Sửa lỗi sau v82: giữ chỗ `{…|…}` sót lại (26/10/2026)
Chọn Q4 (Chọn trong câu) cho câu chưa có lựa chọn thì `setQ` điền giữ chỗ `{…|…}` để giáo viên điền (cố ý). Lỗi: đổi tiếp sang dạng khác (Q1, Q2, Q3, Q5, Q9…) thì chuỗi này nằm lại trong chữ câu, hiện nguyên trên phiếu (Q3 còn sinh hai lựa chọn "…"). Sửa: rời Q4, `setQ` bỏ giữ chỗ chưa điền (cuối câu: bỏ; giữa câu: về `___`). Lựa chọn đã điền thật không bị đụng. Kiểm thử: `test31` mục 7.



## 20. Hoàn thiện cột trái và nhớ dạng câu hỏi (v83, 26/10/2026)
Làm theo danh sách V1–V10 (`docs/VAN_DE_CAN_XU_LY.md`). Dàn trang không đổi, trừ Q7 (dấu ✓ đáp án) và câu ví dụ.

- **Thu gọn theo thẻ (V7, V10).** Chỉ một mục mở tại một thời điểm (`sectOne`, `syncSec`, `sectClick`). Chọn khối trên trang hay trong cây thì mục tương ứng mở và khối đó được chọn (bản đồ `SEC_G` / `G_SEC`); mục đang làm việc nền đậm hơn. Câu có ảnh riêng mà Task không có G1 thì ánh xạ về G3.
- **Thanh Task (V5, V6).** Nút biểu tượng; "↳ Nối Task" / "↳ Đã nối" (`data-eact="tjoin"`); thùng rác đỏ xóa Task phải hỏi qua hộp `askConfirm` (`<dialog id="cfmDlg">`).
- **G1 (V1).** Ô ảnh lớn (`.ithumb.big`) có nút tải / tạo ảnh, dán, kéo thả.
- **ⓘ thủ thuật viết (V2).** Nút `.tinfo` ở ô nhiều dòng mở bảng `#txHelp` (bảng `TXH` / `TXB`, `txInsert`): chỉ chèn ký hiệu app đã có (đậm, nghiêng, gạch chân, ___ , {a|b}, …). Nghĩa "khoảng cách / ký hiệu trên dòng trống" người dùng chưa xác nhận.
- **Câu ảnh + chữ hai cột (V3).** `.imgrow2`: trái ô ảnh, phải `.imgcol` hai dòng.
- **Q7 (V8).** Không còn ô gõ đáp án: ô tick xanh cạnh ảnh (`.tkq`, `tickopt`), ghi vào `item.key` (chữ A/B/C). Dữ liệu `answer` không đổi.
- **Câu ví dụ (V9).** Nút xanh đậm; không bắt buộc đáp án (có cảnh báo nhẹ nếu ví dụ chưa chọn đáp án ở dạng cần); hiện trên trang dàn trang.
- **Nhớ dạng câu hỏi (V4).** `setQMem` (dùng ở cột trái / Inspector qua `qCmd 'q'`; nhập file vẫn dùng `setQ` trần). Khi rời dạng Q0 cất `t.qmem[Q0]` = bản chụp (câu / hàng, đáp án, bố cục `QM_L`) + trạng thái "after" ngay sau khi chuyển. Vào lại Q0 (`qmRestore`): nếu từ lúc rời chưa ai sửa → trả nguyên bản cất; nếu đã sửa → gộp ba bên theo từng trường (bản cất / trạng thái trước đổi / after): chỗ chưa đụng lấy bản cất, chỗ đã sửa giữ bản sửa, câu mới thêm giữ, câu người dùng xóa bỏ. Đi qua dạng trung gian (a→b→c→a): `t.qmemLin` = {q, origin, sig} nhớ dạng gốc và chữ ký trạng thái; nếu mọi bước chỉ là đổi dạng thì về gốc trả nguyên bản. Gộp ra trạng thái sai dạng thì hoàn về kết quả chuyển thường (rollback). `qmem` và `qmemLin` nằm trong JSON phiếu; **MD không mang theo**.
- **Kiểm thử.** `tests/test32.py` (a→b→a 172 cặp trên mọi Task, a→b→c→a 156 vòng, sửa chữ giữa chừng, thêm / xóa câu, qmem trong JSON, Bảng); test31 mở rộng; test1/2/3/4/7/8/9/10/15/17/21/22/23/29 sửa theo thẻ thu gọn, hộp xác nhận, imgrow2.
- **Giới hạn đã biết.** Q3 chưa có ô tick (chỉ Q7). test16 thỉnh thoảng báo "element is not stable" khi chạy cả bộ, chạy riêng thì đạt.

## 21. Sửa theo góp ý sau v83 (v84, 26/10/2026)
- **Ảnh chung ở mọi dạng.** Trước đây với lưới ảnh (Q6/Q7), Nối, Hội thoại, Tô chữ, Bảng, "+ Thêm" ở G1 chỉ ghi dữ liệu, trang bỏ qua ảnh nên không có ô up / tạo ảnh. Nay ảnh chung đặt **trên cùng thân Task** ở các dạng đó (`G1_TOP`, `body0` bọc `body0n`, `g1Of`); `slotsOf`, `blkAddable` (ảnh thứ hai), `genFrameCfg` không còn giới hạn theo dạng.
- **Chọn đúng khối.** `secOfSel`: trên trang `G1:<câu>` (ảnh của câu) và khung lưới / danh sách câu (`G2`, trừ bài đọc) mở mục G3; chỉ ảnh chung mở G1. `selOfSec`: bấm mục G3 chọn phần câu + chỗ trả lời (`sel` G2 + `multi` G3); G2 chỉ chọn khi là bài đọc; GT chọn khối tự do đầu. Bấm / gõ trong thẻ khối tự do (`gtPick`) chọn đúng khối đó trên trang (viền xanh), không dựng lại cột trái.
- **Căn lề.** Đổi "Căn nội dung trong ô" cả Task (lưới ô) thì bỏ căn riêng của khung ảnh từng ô (`commitSet` với `align`), khung ảnh đi theo Task.
- **Cỡ chữ mặc định Vừa** ở mọi độ tuổi (`sizeKey` mặc định `m`, không ghi vào phiếu; Nhỏ / To ghi `ws.size`; `size:"m"` trong file bị dọn, `size:"l"` được giữ). Phiếu cũ không ghi cỡ chữ (trước là To) giờ hiện Vừa.
- **Hàng bảng tối thiểu 12 mm** (`TBL_ROW_MM`, trước 14).
- **Nhãn a b c chữ thường mặc định:** phiếu mẫu, chữ dưới gạch chân kiểu nhãn (Q4), khung từ ảnh, tên ảnh lựa chọn Q7, xuất MD; nhập MD viết `A.` không còn bật chữ hoa (bỏ `upLab`). JSON có `upper:true` vẫn giữ. Nút Nhãn: ⓐ / a. / ô tick, Chữ nhãn a b c / A B C. Prompt và quy ước MD sửa theo.
- **Khối tự do:** chưa có khối thì mục mờ có "+ Chữ" "+ Ảnh" ở tiêu đề (như G1 / G4); thêm xong chọn khối đó. **Khối ảnh nhiều ảnh cạnh nhau:** `x.n` = 2..4 ("Số ảnh trên một hàng"), ảnh thứ j có khóa ô `@<id>~<j>` (`gtKeys`, `xOfKey` cắt `~`), lưới chia đều, `w` = độ rộng cả hàng (mặc định 100% khi n > 1, 50% khi 1 ảnh). Nạp file kiểm tra `n`. Breadcrumb ghi "Khối tự do".
- **Độ rộng ảnh ở lưới ô (Q6 …):** `frame.w` 20–100 (% ô) trong bảng ô ảnh, mặc định "tự động" = cỡ cũ (rộng hết ô, tối đa 34 mm). Dùng được với "Áp cho".
- **Hội thoại cắt trang:** Task hội thoại cao hơn một trang (vd thêm ảnh chung lớn) được cắt theo lượt ở Liền trang (`units`), số chỗ trống đếm tiếp; vừa một trang thì vẫn chuyển nguyên sang trang sau như cũ. Khung từ bên phải chỉ ở phần đầu.
- **Kiểm thử:** `tests/test33.py` (21 mục). test2 và cmp_v80 so với bản cũ ở thông số cũ (To, hàng 14 mm, nhãn chữ hoa); test17, test20, test21, test22, test31 sửa theo mặc định mới; test32 được 420 giây.
- **Chưa làm:** câu hỏi có ảnh chung ở bố cục Xếp dọc / Ảnh trái / phải vẫn không cắt trang được (như các bản trước); MD chưa mang `x.n`.

## 22. Sửa theo danh sách việc phiên 6 (v85, 26/10/2026)
Danh sách gốc và trạng thái từng việc: `docs/DANH_SACH_VIEC_v85.md`.
- **Q8 (nối), Q9 (tô chữ) hiện Khung từ G4** (trước chỉ ghi dữ liệu, trang bỏ qua). Trên / dưới / phải đều được; ở dạng nối, khung từ bên phải là cột riêng 72/28 (`.wbwrap.wbm`), không dùng `--tpl` 3 cột của bài nối. Ảnh chung G1 ở hai dạng này đã có từ v84.
- **Tỉ lệ thật của ảnh tách khỏi tỉ lệ khung** (`natAr`): khi Fit, ảnh dùng kích thước gốc đã lưu (`upMeta[key]` w×h) thay cho `imgAr[key]`. Trước đây ở ô ảnh lưới, `imgAr[key]` vừa là tỉ lệ khung vừa là tỉ lệ ảnh, nên đổi tỉ lệ ô làm ảnh bị méo khi Fit. Ca "Task 3 lúc đúng lúc sai" người dùng báo **chưa tái hiện được chắc chắn**; đây là nguyên nhân tìm được gần nhất.
- **Ảnh thứ hai (G1b) có Fit riêng:** panel ảnh chung → "Ảnh thứ hai" → "Hiển thị ảnh thứ hai": Như ảnh 1 (mặc định) / Bình thường / Fit ngang / Fit dọc, có Zoom. Lưu ở `layout.cells.G1b.frame` (`fit`, `zoom`); "Như ảnh 1" xóa hết chỉnh riêng. Kích thước, căn lề đi theo khung ảnh chung. Khi theo ảnh 1, ảnh 2 vẫn dùng tỉ lệ thật của chính nó (trước bị méo theo tỉ lệ ảnh 1).
- **Ảnh khung từ (G4 ảnh) có Fit + Zoom**, áp cho mọi ảnh trong khung từ: `wordBank.frame` (`fit`, `zoom`). Hàm chung `ownFit(t, key, html, fr)` gắn `data-tf` + `--iar/--ox/--oy/--z` vào ô ảnh; CSS `.task .g1/.g4 .pic[data-tf]` đặt sau CSS Fit của khung ảnh chung để thắng.
- **Bỏ "Khối của bài"** trong Cấu hình. Thêm khối: "+ Thêm" ở từng mục G; xóa: nút ✕. G3 có ✕ cạnh tiêu đề = tắt câu hỏi (giữ câu, mục mờ có "+ Bật lại"); Ctrl+Z hoàn tác.
- **Mục G3:** "Danh sách câu" → "Câu hỏi" (cặp / lượt / từ giữ tên cũ), bỏ số câu "N · N có chỗ trả lời", thanh **B I U ___ {a|b}** bên phải cùng hàng (chèn vào ô câu đang gõ, không làm mất con trỏ; không hiện ở Bảng). ⓘ lên hàng "Tỉ lệ ô ảnh" nếu Task có hàng đó, không thì ở cuối hàng "Câu hỏi".
- **Khoảng cách mặc định Gọn** (phiếu mẫu, phiếu từ MD / file không ghi khoảng cách, `sheetSpacing` dự phòng). Phiếu đã ghi Vừa / Thoáng / Tự do giữ nguyên. Phiếu mẫu còn 10 trang (trước 11).
- **Hộp hỏi xóa:** nền xám mờ `rgba(15,23,30,.45)` sau mọi hộp thoại (`dialog::backdrop`). Hộp hỏi xác nhận (`cfmDlg`): bấm ra ngoài (cả lúc nhấn và lúc thả) = Hủy; Hủy, Esc như cũ. Các hộp thoại khác (nhập file, tạo ảnh…) chưa đóng khi bấm ngoài để không mất chữ đang gõ.
- **Mỗi bài một câu ví dụ:** đặt "Ví dụ" ở câu khác thì câu ví dụ cũ tự bỏ, có thông báo. Nhập MD / JSON có nhiều câu ví dụ thì chưa chặn.
- **Sửa lỗi cũ:** hoàn tác sau khi thêm khối làm panel lỗi (vẫn chọn khối không còn); `renderInspector` về chọn cả Task.
- **Kiểm thử:** `tests/test34.py` (31 mục, ảnh mẫu `tests/ph_tall.jpg`, `ph_wide.jpg`, `ph_sq.jpg`). test2 và cmp_v80 đưa khoảng cách về Vừa trước khi so; test31 kiểm badge v85.
- **Chờ người dùng xác nhận (chưa làm):** A3 Task 5 không tách trang (cần phiếu thật); C3 cột trái 420 px (có phải "khung Thao tác Phiếu"); D2 chữ câu hỏi Bình thường / Đậm (chỉ chữ câu hỏi?); F1 màu xanh dấu đáp án (mã màu); F2 ô tích chọn đáp án đúng (ở cột trái, trên phiếu hay cả hai).

## 23. Lô sau v85 (v86, 26/10/2026)
- **Cột trái mặc định 420 px** (`LW_DEF`, `--lw`). Độ rộng đã kéo (lưu ở trình duyệt) vẫn giữ; bấm đúp thanh chia về 420; màn hẹp vẫn tự giới hạn (`lwMax`).
- **Chữ câu hỏi Bình thường / Đậm** theo Task: hàng "Chữ câu hỏi" dưới tiêu đề mục G3, lưu `layout.qbold`, trang có `data-qb` → đậm `.qt`, `.c2>span`, `.itx`, `.cl`, `.ml>span`; lựa chọn a b c không đậm. Không hiện ở Bảng, Hội thoại, Tô chữ. MD chưa mang.
- **Thanh B I U dính:** hàng "Câu hỏi" (G3) và hàng "Bài đọc / Lời dẫn" (G2, thêm ¶) có thanh chèn ký hiệu, dính ngay dưới thanh tiêu đề Task khi cuộn (`position:sticky; top:var(--tkh)`; `.sec` đổi `overflow:hidden` → `overflow:clip`).
- **Màu đáp án (F1):** đáp án sẵn của câu ví dụ trên phiếu (khoanh, ✓, viền Đúng/Sai, chữ đáp án) và ô tích ở cột trái dùng xanh lá đậm của app `#0a6b75` (trước: xám `#4a5560`, ô tích xanh lá `#1b8a3a`).
- **Ô tích đáp án đúng (F2):** dưới ô "Chọn" của câu Chọn A/B/C và ở câu Đúng/Sai có hàng "Đúng" với ô tích từng lựa chọn; ảnh Q7 vẫn tích dưới ảnh. Chọn được nhiều đáp án: `key` = "b, c" (`keyParts`, `exPicks`); Đúng/Sai chỉ một. Gõ ở ô "Đáp án" vẫn được. Ô tích không in ra phiếu; câu ví dụ khoanh / tích tất cả đáp án đúng.
- **Ảnh chung ở lưới ảnh (A2):** Task lưới ảnh (`cellImgMode`) có ảnh chung thì `G1` không có ô = ảnh chung (`kindOf` → `frame`), nên Fit trong hộp Tạo ảnh và panel Ảnh chung có tác dụng. Trước đó `G1` = "mọi ô ảnh", Fit bị ghi vào chỗ không dùng. Chỉnh mọi ô ảnh câu cùng lúc: chọn một ô rồi "Áp cho · Cả Task".
- **Câu hỏi có ảnh chung cắt được trang (A3):** bố cục Xếp dọc / Ảnh trái / Ảnh phải, Liền trang: cắt theo từng câu (`units`); ảnh và tiêu đề chỉ ở phần đầu, phần sau chạy hết bề ngang. Tách trang vẫn chuyển nguyên Task.
- **Kiểm thử:** `tests/test35.py` (16 mục); test31 kiểm badge v86.

## 24. Đáp án đúng ngay trong khung soạn (v87–v92, 26/10/2026)
Nguồn: góp ý người dùng sau v86; đề xuất `docs/DE_XUAT_CHON_DAP_AN_Q.md`, hình `docs/MINH_HOA_DAP_AN_Q.png`, kế hoạch `docs/KE_HOACH_DAP_AN_Q.md`. Mục tiêu: mọi dạng Q có đáp án đúng (trừ Q9 tô theo nét, Q12 viết tự do) đều xác định được đáp án ngay khi soạn.
- **v87 — Q3 (Chọn A/B/C):** bỏ ô "Chọn" gộp và hàng "Đúng". Mục **"Đáp án"** trong mỗi câu: mỗi lựa chọn một dòng = ô tích (đúng, tích được nhiều) + nhãn a. b. c. (tự đánh) + ô gõ (`it.N.opts.J`) + ✕ (còn tối thiểu 2); nút **+** ở lề phải thêm dòng (`optadd`, con trỏ vào ô mới). Dữ liệu giữ `opts[]` + `key` ("a, c"); thêm / xóa / sửa dòng thì tích dời theo vị trí (key về chữ cái). `exPick` nhận chữ cái a–h.
- **v88 — ô đáp án luôn hiện:** bỏ công tắc "Ghi đáp án đúng". `needKey(t,x)` (câu nào cần đáp án: không phải dòng chữ, tô theo nét, viết tự do, bảng; hội thoại chỉ lượt có `___` / `{}`), `hasKey(t,x)`, `keyState(t)`. Đầu mục Câu hỏi có chip **"x/y câu có đáp án"** (vàng khi thiếu; bấm = tới câu thiếu đầu tiên, viền cam). Chip cập nhật khi rời ô gõ (`kcntSync`).
- **v89 — Q4 (chọn trong câu):** vế đúng đánh dấu `*` ngay trong nhóm: `{*goes|go}`; mỗi nhóm có đáp án riêng (câu nhiều nhóm vẫn đúng). Khung soạn: hàng "Đáp án" với chip từng vế (`pickopt`, bấm lại để bỏ). Trước `rich()` đổi `*` thành `\u0003` (`pkPre`) để không thành chữ nghiêng; phiếu in bỏ dấu; câu ví dụ khoanh sẵn vế có `*`. Phiếu cũ: `pkMig` (trong `migTask`) đổi `key` khớp đúng một vế ở mỗi nhóm thành `*`, không khớp thì giữ `key`. **Tìm lỗi sai** (nhãn A–D dưới `<u>`): hàng "Phần sai" bấm chọn phần gạch chân (`ulpick`, `key` = chữ cái); câu ví dụ khoanh nhãn.
- **v90 — Q8 (nối):** công tắc **"Xáo vế phải khi in"** (`content.shuffle`) + "Xáo lại" (`content.shufSeed`). Bật: cặp gõ cạnh nhau = cặp đúng; vế trái giữ thứ tự, vế phải (cả vế thừa) in theo thứ tự xáo cố định (`pairPerm`: băm mã Task + số lần xáo, tránh vế đứng yên chỗ). Bài nối mới (`setKind` → match) mặc định Bật; phiếu cũ / nhập file mặc định Tắt và có thông tin "Bài nối chưa có cặp đúng".
- **v91 — đáp án từng chỗ trống:** câu có ≥ 2 `___` (Q1, hội thoại, Q6, câu nhiều dòng): hàng "Đáp án" có ô (1), (2)… (`it.N.keyg.J`); có Khung từ (chữ) thì là ô chọn từ trong khung (cả câu một chỗ trống). Dữ liệu `key` = "went | played" (một chỗ trống như cũ). Câu ví dụ hiện sẵn từng đáp án đúng chỗ (A2 theo câu và trong câu). Chỗ trống của bài đọc vẫn dùng `lead.keys` (đã có).
- **v92 — Q10 (bảng):** ô gõ `=chữ` = ô học sinh điền, chữ là đáp án (`{ans}` qua `parseCell` / `fmtCell`); phiếu in ô trống, khung soạn tô xanh nghiêng; có ô đáp án thì panel Bảng có "Hiện đáp án (bản giáo viên)" (`layout.table.key`). MD giữ `=chữ`.
- **Chưa làm:** bản đáp án giáo viên cho cả phiếu; ô tick trong bảng chưa ghi được ô đúng; lưới tìm từ chưa đánh dấu vị trí từ; MD chưa mang `content.shuffle`; nhập MD bài nối (phiếu PDF đã xáo) vẫn Tắt xáo.
- **Kiểm thử:** `tests/test36.py` (mọi bước, tham số thứ hai = bước tối đa); test35 nhận ô tích ở dòng đáp án mới.

## 25. MD mang thêm cấu hình (v93, 26/10/2026)
- `Chữ câu hỏi: đậm` (hoặc `thường`) ↔ `layout.qbold`.
- `Xáo vế phải: có` (hoặc `không`) ↔ `content.shuffle` của bài nối (Task không phải bài nối thì báo). Thiếu dòng này thì bài nối nhập vào để Tắt xáo như v90.
- `Khối ảnh: <tên> (3 ảnh)` ↔ khối ảnh tự do nhiều ảnh cạnh nhau `x.n` (2–4).
- `qmem` (nhớ dạng câu hỏi) vẫn chỉ lưu trong JSON, chờ người dùng trả lời câu hỏi 2 của bàn giao v84.
- Kiểm thử: `tests/test36.py` mục v93 (xuất MD rồi đọc lại).

## 26. Popup "+ Task": chọn Dạng câu hỏi rồi Bố cục, có xem trước (v94, 27/10/2026)
- Người dùng: tạo Task mới thì giáo viên nghĩ **dạng bài trước, bố cục sau**; một popup, nửa trên chọn Q, nửa dưới chọn T, bên phải xem trước kiểu lorem.
- Hộp `libDlg`, tab đầu đổi tên **"Chọn dạng bài"** (tab "Từ file / dán" không đổi). Trái: ① **Dạng câu hỏi** (13 thẻ: Q1, Q2, Q12, Q9 / Q3, Q4, Q5, Q7 / Q8, Q6, Q10, Q11 + "Chỉ có ảnh" = tô màu / vẽ, nhóm Viết / Chọn / Ghép · Ảnh · Bảng) → ② **Bố cục** (Tự động, Xếp dọc, Ảnh trái, Ảnh phải, Ảnh trong bài đọc; ô không hợp bị mờ, bấm ra toast kèm lý do từ `tnReasons`) → **Kèm theo** (chip Ảnh chung, Bài đọc, Khung từ; Bài đọc chỉ đi với Q1, Q2, Q3, Q5, theo `qReasons`) → **Vị trí** (mặc định **Cuối phiếu**, giữ quy tắc cũ; "Sau Task đang chọn" chọn được, dùng `insertTask`). Phải: xem trước một Task thật (`renderTask`) cùng cấu hình, chữ lorem (`lnLorem`, chỉ trên bản xem trước), kèm dòng "Tự động → <bố cục máy chọn>". Nút **Thêm Task** (`#libAdd`) ở chân hộp.
- Dữ liệu: mỗi Q ứng với một công thức `RECIPES` (bảng `LN_REC`; Q11 và Q12 qua `setQ`), rồi `blkAdd` cho khối kèm theo, rồi `tnTarget` cho bố cục. `lnBuild` dựng Task; chọn đổi làm bố cục không hợp thì tự về Tự động. **RECIPES giữ nguyên** (còn dùng cho `recipeMatch`, `applyRecipe`, mô tả Task); popup không còn lưới 13 công thức, `renderLibGrid` và `#libGrid` bỏ.
- Chưa làm: xem thử 2 cột / cả trang A4; nhớ lựa chọn lần trước; "Hội thoại" (Q1 có người nói) và "Đọc và trả lời" nay là Q1 / Q2 / Q3 / Q5 + chip Bài đọc, hội thoại bật ở khối Câu hỏi sau khi thêm.
- Kiểm thử: `tests/test37.py` (13 Q × khối × bố cục dựng được xem trước; mờ / khóa; thêm đúng Q, T, vị trí; hoàn tác; hai tab). Đổi test2, test9, test10, test13 theo giao diện mới. Đính chính: class `.lnT` trùng `.lnt` vì trang chạy chế độ quirks (CSS không phân biệt hoa thường); container đặt tên khác.


## 27. Q2: điểm bắt đầu, chiều dài, số hàng (v95, 27/10/2026)
- Câu Q2 (viết câu) có gạch trả lời ngay trong câu (`attach:'item'`, A2): ba tùy chọn trong panel Dạng câu hỏi: **Điểm bắt đầu** (từ cuối câu / dòng dưới), **Chiều dài** (cố định mm / hết dòng), **Số hàng** (mặc định 1). Dùng lại bộ tính A2 (`a2cfg`: `lenMode`, `lenMm`, `lines`, `start`) qua `q2end`, `q2cfg`, `q2set`; lệnh `qCmd` 'q2'.
- Phiếu cũ (A1 dòng kẻ) hiển thị như trước. Bỏ hai kiểu gạch / khoảng cũ của Q2 trong `qStyles`.
- Kiểm thử: `tests/test38.py`.

## 28. Bảng: số thứ tự, tùy chọn bảng ở cột trái (v96, 27/10/2026)
- Lỗi 2a: dữ liệu cũ `layout.table.num:false` làm Số thứ tự thực ra Tắt nhưng nút sáng "Ngoài bảng", bấm không đổi. Nay panel hiện đúng giá trị hiệu lực `nm`; chọn Số thứ tự thì bỏ `num` cũ.
- Cột trái, ngay dưới tiêu đề G3 của bảng thường: ô tích **Hàng tiêu đề cột · Tô nền hàng tiêu đề · Tô hàng xen kẽ · Cột tiêu đề hàng** và nút **Số thứ tự: Ngoài bảng / Trong cột đầu / Tắt** (`tblo`). Tô nền hàng tiêu đề bật mặc định, màu đậm hơn hàng xen kẽ.
- Kiểm thử: `tests/test39.py`.

## 29. Căn lề Khối text (v97, 27/10/2026)
- Thuộc tính Task `layout.ta` = left (mặc định) / center / right / justify, ở mục CĂN LỀ cột phải ("Căn lề Khối text"). Áp cho G0 hướng dẫn, G2 bài đọc / lời dẫn, khối tự do chữ; câu hỏi không bị ảnh hưởng.
- Gộp công tắc cũ "Căn chữ bài đọc" chỉ có ở T8 (`layout.align:'justify'`): phiếu cũ vẫn đọc là Hai bên (`taOf`); chọn mới thì xóa `align` cũ.
- Khối tự do chữ có lựa chọn "Theo Task (…)" (mặc định) hoặc chỉnh riêng Trái / Giữa / Phải / Hai bên.
- Có mã QR file nghe: lề phải của hướng dẫn là mép trái mã QR (đã đúng sẵn; test đo).
- MD: `Căn lề chữ: trái | giữa | phải | hai bên`.
- Kiểm thử: `tests/test40.py`.

## 30. Bảng chọn đáp án có ô tích (v98, 27/10/2026)
- Ô bảng: `{tick:1}` = chỉ ô tích; `{tick:1, text}` = ô tích trước chữ; `ok:true` = ô đúng. Gõ trong ô: `[ ]`, `[x]`, `[ ] chữ`, `[x] chữ` (`✓` cũ vẫn là ô tích).
- Cột trái mục "Chọn đáp án": **Hiện ô tích trước chữ** (đổi mọi ô chữ ↔ ô tích + chữ; ô trống, ô điền, ảnh giữ nguyên) và **Một ô đúng mỗi hàng** (tắt mặc định; bật thì giữ ô đúng đầu tiên, tích ô khác thì ô cũ tự bỏ). Mỗi ô tích có nút ✓ để đánh dấu ô đúng; mặc định nhiều ô đúng mỗi hàng.
- Bản giáo viên: "Hiện đáp án (bản giáo viên)" nay hiện cả khi bảng có ô đúng; ô đúng in ✓ và tô nền (`.tok`). Bản học sinh không lộ.
- MD: ô `[x] chữ` / `[ ] chữ`.
- Kiểm thử: `tests/test41.py`.

## 31. Ảnh trong ô bảng (v99, 27/10/2026)
- Dữ liệu có sẵn từ trước: đầu hàng `{img, text}`, ô `{img, text?}`, khóa ảnh `@<hàng>` / `@<hàng>.<cột>`. Ô thân bảng có ảnh nay in ảnh trên, chữ dưới (`.cix`).
- Cột trái: mỗi ô chữ có nút **+ảnh**; ô có ảnh hiện ảnh nhỏ (bấm để tải / tạo ảnh) và **×** trên ảnh nhỏ để gỡ (giữ chữ). Ô gõ của ô có ảnh chỉ sửa chữ, ảnh giữ nguyên. Ô tích, ô điền không có nút ảnh.
- Công tắc cả bảng **Ảnh trong bảng: Không / Cột đầu / Mọi ô có chữ** (`cimSet`; Cột đầu tự bật Cột tiêu đề hàng).
- MD: `[ảnh: tên] chữ` trong ô, đọc lại giữ cả ảnh và chữ.
- Ô chữ (Q11): dòng đếm ô / từ cập nhật khi gõ lưới; gợi ý trỏ đúng Khối tự do. Trải nghiệm và các vấn đề còn lại: `docs/TRAI_NGHIEM_O_CHU.md`.
- Kiểm thử: `tests/test42.py`.

## 32. Tái hiện phiếu 7: nhãn chỗ trống, nhãn câu a b c, T/F cùng hàng (v100, 27/10/2026)
Nguồn: phiếu thật "Unit 6 – Lesson 1" (`tests/real/phieu7.pdf`), MD do AI tạo theo prompt v99 (`tests/real/phieu7-ai-v99.md`), MD đã sửa (`tests/md/phieu7.md`).
- **Chỗ trống trong bài đọc có nhãn sẵn:** `___` đứng ngay sau `(a)`, `(1)`… không thêm số `(n)` (vẫn đếm thứ tự cho đáp án `Chỗ trống:`). Chỗ trống không có nhãn vẫn đánh `(1)(2)…` như trước.
- **Bài đọc có `___`, không có câu đánh số** (MD): Task không có dòng câu; `content.list = false`. Trước đó app tự thêm 3 dòng kẻ trống đánh số.
- **Kiểu số câu:** `layout.nlab = 'a'` hiện số câu thành a, b, c… (đến z; sau đó giữ số). Cột trái, mục Câu hỏi: nút **Kiểu số câu: 1 2 3 / a b c** (ẩn khi Số câu ở lề = Ẩn). MD `Số câu: a b c` / `Số câu: ẩn` / `Số câu: 1 2 3`; Xuất MD ghi lại (`Số câu: ẩn` chỉ khi Task nhiều hơn 1 câu). Số trong cột trái (soạn câu) vẫn là số.
- **Đúng/Sai cùng hàng:** `answer.params.row = true` (chỉ A6 khoanh T/F): hai ô T / F nằm cuối hàng bên phải chữ câu. Cột trái, mục Dạng câu hỏi Đúng / Sai: nút **Vị trí T / F: Dưới câu / Cùng hàng với câu**. MD `Dạng: đúng/sai (cùng hàng)`, kèm nhãn `(Yes/No, cùng hàng)`. Ô tick (A5) không dùng được.
- Prompt PDF→MD: thêm quy tắc 16–20 (tiêu đề bài đọc vào đầu `Bài đọc:`, bỏ `Hướng dẫn:` trùng tiêu đề, không bịa `Tuổi:`, nhãn `(a)` giữ nguyên trong bài đọc, nhãn a–h dùng `1.` + `Số câu: a b c`, T/F cùng hàng).
- **Chưa làm (ghi để biết):** tiêu đề bài đọc căn giữa như PDF (hiện in đậm, căn trái); thụt đầu đoạn / căn đều hai bên của bài đọc; hiện số Task theo PDF (PDF đánh 1, 2, 4, 5, app đánh lại 1–4); ảnh thật (app chỉ có khung giữ chỗ theo tên).
- Kiểm thử: `tests/test43.py`.

## 33. Điền từ vào đoạn văn bằng câu hỏi; ô câu nhiều dòng; T/F căn dọc (v101, 27/10/2026)
Nguyên tắc (người dùng): **mọi thứ cần đáp án đều là câu hỏi; bài đọc chỉ là chữ để đọc.**
- **Điền từ vào đoạn văn = Q1 (không thêm dạng thứ 13):** bài đọc (G2) chỉ giữ tiêu đề; mỗi đoạn là một câu Q1 chứa nhiều `___` (nhãn `(a)` giữ trong chữ). Chỗ trống nằm trong chữ là chỗ trả lời: khi mọi câu có `___` (kể cả Task có bài đọc) `answer.attach` là `inline` (`attachOpts`, `normAnswer`), không thêm dòng kẻ sau câu; câu Task có bài đọc vẽ bằng `qtext` (chỗ trống thành ô điền). Dòng cuối câu kết thúc bằng chỗ trống là ô `fl` kéo hết dòng.
- **Bộ đọc:** `(a) ___ … (b) ___` không bị hiểu là lựa chọn (`splitOptsLine`); dòng `a. ___ nghĩa` không bị hiểu là lựa chọn của câu trên (`OPT_LINE`): 8 dòng nối từ thành 8 câu. Nhãn chữ a–h vẫn cần `Số câu: a b c` (v100).
- **Phiếu cũ** có `___` trong bài đọc: vẫn đọc và dàn trang như v100; bảng nhận diện ghi chú "nên chuyển thành câu hỏi".
- **Cột trái, mục Câu hỏi:** ô chữ câu là ô nhiều dòng cho mọi dạng (kéo giãn được, dòng trống = sang đoạn, có thanh B I U ___ {a|b}); đáp án từng chỗ trống mang nhãn `(a)`… (`gapLabs`), không có nhãn thì `(1)(2)…`.
- **Đúng/Sai cùng hàng:** bảng Đáp án (bấm ô T/F) có **Căn dọc cả khối: Trên / Giữa / Dưới** (`params.rowv`, mặc định Giữa; áp cho số câu, chữ câu, ô T/F của mọi câu) và **T / F cách lề phải (mm)** (`params.tfx`, 0 = sát lề phải; tăng thì T/F dịch về phía câu).
- **Không đổi:** luật cắt trang. Task 3 phiếu 7 không lên trang 1 vì mảnh đầu ≈ 41 mm + 6 mm giữa các Task > chỗ trống 41 mm.
- Chưa làm: tiêu đề bài đọc căn giữa; căn lề chữ ô câu hỏi (người dùng nói để sau); thanh kéo (drag) nhóm T/F; ô nhập đáp án riêng theo từng chỗ trống trong file MD (`## Đáp án` của câu nhiều chỗ trống chưa kiểm).
- Kiểm thử: `tests/test44.py` (và test43 cập nhật theo MD phiếu cũ).

## 34. Nhãn lựa chọn mặc định a. b. c. (v102, 27/10/2026)
- Mọi câu Lựa chọn A/B/C (A4, theo câu) hiện nhãn **a. b. c.** mặc định (chữ thường, không vòng tròn; "Chữ nhãn: A B C" vẫn chọn được). Vòng tròn ⓐ và ô tick ☐ là lựa chọn riêng: `answer.params.lab` = `'circle'` / `'box'`; vắng = `a.`.
- Cột trái, Dạng Chọn A/B/C: nút **a. b. c. / Khoanh ⓐ / ☐ Ô tick** (mặc định a. b. c.); bảng Đáp án có mục Nhãn cùng ba lựa chọn.
- MD: `Dạng: chọn A/B/C (khoanh)` = vòng tròn; `(ô tick)` = ô tick; không ghi = a. b. c. Xuất MD ghi lại `(khoanh)` khi có.
- **Đổi hành vi với phiếu cũ:** phiếu đã lưu không có `lab` trước đây hiện vòng tròn ⓐ, nay hiện `a.`. Muốn giữ vòng tròn thì chọn lại Khoanh ⓐ.
- Kiểm thử: `tests/test45.py`.

## 35. Bài nối: số câu, viền hai vế; kéo cột T / F (v103, 27/10/2026)
Nguồn: phiếu 9 ("Unit 6 – Lesson 3"), `tests/md/phieu9.md`.
- **Số câu ở bài nối:** vế trái hiện số 1, 2, 3… (hoặc a b c theo "Kiểu số câu"); trước v103 hai ô này có trong cột trái nhưng bài nối không vẽ số. "Số câu ở lề: Ẩn" ẩn như mọi dạng khác. Mặc định hiện: **phiếu nối đã lưu từ trước nay có thêm số** (chọn Ẩn để bỏ).
- **Viền hai vế:** công tắc `layout.mbd` (`'on'` / không có), mặc định **không viền** cho cả vế trái và vế phải (trước v103 vế phải luôn có viền). Cột trái: Task nối → "Viền hai vế: Không / Có". MD: `Viền hai vế: có` (xuất MD ghi lại khi bật).
- **Tay kéo cột T / F:** Đúng/Sai cùng hàng có tay kéo dọc ở mép trái cột T / F (chọn cột Đáp án, một ô T / F hoặc cả Task); kéo sang trái để đưa T / F lại gần câu, đổi `params.tfx` (mm từ lề phải, bước 1); bấm đúp = về sát lề phải. Ô số "T / F cách lề phải" ở cột trái vẫn dùng được.
- **Prompt PDF→MD (quy tắc 21–22):** bài nối không có đáp án trong PDF thì không đoán cặp, ghi chú "chưa có đáp án", không `Xáo vế phải`; `Viền hai vế: có` chỉ khi bản gốc có khung.
- Chưa làm: bài nối kiểu "viết chữ cái vào ô" như PDF phiếu 9 (Task 2, 3 trong PDF học sinh viết a–h chứ không nối dây); Task 4 phiếu 9 cao 433 mm không cắt được nên tràn trang.
- Kiểm thử: `tests/test46.py`.

## 36. Xuống dòng trong ô bảng (v104, 27/10/2026)
Nguồn: phiếu 11 ("Unit 6 – Lesson 5"), `tests/md/phieu11.md`.
- Trước v104 chữ trong ô bảng có thể chứa `\n` nhưng trang gộp thành một câu liền, MD không có ký hiệu xuống dòng và xuất MD ghi xuống dòng thật vào giữa hàng bảng (nạp lại bị vỡ).
- Nay: `<br>` trong ô MD (tiêu đề cột, đầu hàng, ô) = `\n` trong dữ liệu; trang vẽ mỗi dòng một dòng riêng (`.tml`, cách nhau 1,2 mm); ô soạn bảng ở cột trái hiện và nhận `<br>`; xuất MD ghi lại `<br>` (mỗi hàng bảng vẫn một dòng).
- Ô không có xuống dòng giữ nguyên cách hiện cũ; MD cũ nối bằng `;` vẫn nạp như trước (một dòng).
- Prompt PDF→MD quy tắc 23. Kiểm thử: `tests/test47.py`.
- Chưa làm: khoảng cách dòng trong ô chỉnh được; số hàng 1, 2 ở lề bảng mặc định hiện (PDF phiếu 11 không có, tắt bằng "Số câu ở lề: Ẩn" hoặc tùy chọn bảng).

## 37. Phiếu 14: bài nối viết chữ cái, bài đọc + T/F xếp dọc (v105, 27/10/2026)
Nguồn: phiếu 14 ("Unit 6 – Lesson 9"), `tests/md/phieu14.md`.
- **Bộ đọc:** `Dạng: nối` luôn tách cặp "trái - phải" (trước đó chỉ tách khi tiêu đề / hướng dẫn có chữ match, join, nối vì cờ lấy từ trường `Trả lời:` cũ).
- **Bài nối mới:** `Tiêu đề cột: A | B` (`content.heads`), `Chỗ nối: ô viết chữ` (`answer.params.mid` = `box` / `none` / mặc định chấm), vế phải thừa `6. - F. very cold` (item có `pair.r` không có `pair.l`). Trang vẽ hàng tiêu đề đậm, ô viết chữ ở cột giữa cạnh vế trái, vế thừa không có số. Cột trái: ô Tiêu đề cột trong danh sách câu; Đáp án → Chỗ nối.
- **Bố cục bài đọc + T/F:** Tự động chọn xếp dọc (bài đọc trên, câu dưới), trước đó chọn Hai cột. Hai cột vẫn chọn được ở "Cách xếp câu: Cột bên phải" (tỉ lệ mặc định 60/40, kéo được).
- Chưa làm: tên bố cục T6 "Chỉ nội dung" vẫn khác tên T1 "Xếp dọc" trong bảng quy tắc nội bộ (người dùng thấy "Xếp dọc" ở popup T, bên trong là T1 hoặc T6).
- Kiểm thử: `tests/test48.py`. Prompt quy tắc 24–25.


## 38. Chỉnh sau phiếu 14 (v106, 27/10/2026)
- **Bài nối số câu ở lề:** `.mrows` thụt ra `--hang` như danh sách khác, nên số câu thẳng hàng với số của các Task khác; tiêu đề cột và chữ hai vế căn trái với dòng hướng dẫn (khi không viền, vế không còn đệm 3mm; có viền thì đệm nằm trong viền). Đã rà bằng đo tọa độ trên 3 JSON mẫu và 12 MD thử.
- **Căn dọc Chọn A/B/C:** `answer.params.qv` = `top` (mặc định) / `center` / `bottom`; áp cho số câu, chữ câu và lựa chọn cùng lúc (`data-qv` trên Task, chỉ khi A4 + nhãn theo câu). MD: `Dạng: chọn A/B/C (căn giữa)` / `(căn dưới)`. Câu không có chữ câu thì dòng chữ rỗng không còn chiếm chỗ.
- **a/b/c/d thẳng cột:** đo độ dài lựa chọn bỏ thẻ `<u>`, `**` nên không còn bị coi là dài rồi chuyển sang xuống dòng tự do.
- **Tay kéo T/F:** gắn vào mảnh Task có cột T/F (Task bị cắt qua trang vẫn có tay kéo); tip hiện "câu X / T-F Y · cách lề phải Z mm"; Hai cột: bài đọc + T/F mặc định 60/40, kéo 40–90; câu hỏi + T/F mặc định 80/20, kéo 50–90.
- Kiểm thử: `tests/test49.py`.

## 39. a/b/c thẳng cột giữa các câu (v108, 27/10/2026)
Người dùng thử bản React báo: Chọn A/B/C các đáp án không thẳng hàng. Lỗi có sẵn từ v106 (không do chuyển React); sửa ở cả `app/` và `ws-editor-prototype.html`.
- **Cách xếp Tự động** (`a4dir`): lựa chọn ngắn vừa cột đều → `h` (cột đều 1fr như cũ). Không vừa → `hc`: cột co theo chữ, **dùng chung cả Task** (độ rộng cột j = lựa chọn thứ j dài nhất trong mọi câu), xếp sát trái; ước lượng tổng ≤ 160 mm. Vẫn không vừa → `g2` (2 cột đều) nếu có hơn 2 lựa chọn, rồi `v` (dọc). **Tự xuống dòng (`fl`) chỉ còn khi người dùng chọn**, máy không tự chọn nữa. `hc` không có trong ô chọn Cách xếp (vẫn hiện là "Tự động").
- **Ngang có Căn lề** (`params.align` trái / giữa / phải, cột co theo chữ): trước đây mỗi câu tự tính độ rộng cột nên lệch nhau; giờ dùng chung độ rộng cột cả Task như `hc`.
- **Cách làm cột chung:** mỗi ô lựa chọn kèm `<span class="osz" aria-hidden>` chứa bản ẩn mọi lựa chọn cùng cột trong Task (`height:0; visibility:hidden`), nên ô rộng bằng lựa chọn dài nhất cột đó mà không thêm chiều cao. Ngang / `hc` lấy số cột theo câu nhiều lựa chọn nhất.
- Đổi bố cục trên mẫu: `phieu9`, `phieu14`, `dieu-chinh-v80` (từ xuống dòng tự do sang cột chung, cùng số dòng); `samples/ws-demo-day-du.json` Task tick 5 lựa chọn dài (sang 2 cột, thêm 1 dòng). Đường chuẩn lập lại: `tests/chuan/v108/` (thay `v106/`).

## 40. Ba cột là React (v109, 27/10/2026)
Không đổi tính năng. Cột phải (thông số), cột trái (danh sách Task + khung soạn) và khung các trang A4 giờ do React dựng (`app/src/ui/insp/`, `app/src/ui/tree/`, `app/src/ui/stage/`), giữ nguyên thẻ, class, data-*, chữ của v106. HTML bên trong mỗi Task trên trang vẫn do `core/layout` `renderTask` sinh (dùng chung với bộ đo / xếp trang).
Khác biệt nhỏ so với v106 (đều là sửa lỗi hiển thị):
- Nút chọn font trong panel Phiếu hiện đúng font của nút (v106: dấu `"` trong tên font làm hỏng thuộc tính style).
- Khi đang gõ, tên Task ở danh sách giữ đúng nhãn dạng bài như lúc vừa mở (v106 đổi sang tên kiểu cũ `typeName` cho tới lần dựng lại); số "x/y câu có đáp án" cập nhật ngay khi gõ, không đợi rời ô.


## 41. GĐ0 phiếu tương tác: máy hiểu chỗ trả lời (v110, 27/10/2026)
Không đổi hình phiếu, không đổi thao tác. Chuẩn bị cho phiếu tương tác / TeacherResource (`docs/TUONG_TAC/`, kế hoạch `KE_HOACH_GD0.md`).
- **Lõi đáp án** `app/src/core/answers.js`: `itemKeys`, `optsOfKey`, `gapN`, `needKey`, `hasKey`, `keyState` chuyển nguyên văn từ `legacy/app.js` (bộ lọc bỏ dòng chữ `gt` nay nằm sẵn trong `itemKeys`).
- **Liệt kê chỗ trả lời** `app/src/core/slots.js`: `sheetSlots(ws)` → `{slots, key, warn}`, `taskSlots(t)`. Mã chỗ: `<task>.<câu>`, `<task>.<câu>.<n>` (chỗ thứ n), `<task>.lead.<n>` / `.leadc.<n>` (bài đọc), `<task>.cell.<hàng>.<cột>` (bảng, ô chữ), `<task>.cell.<hàng>` (hàng tick), bài nối `<task>.<câu vế trái>`. Cách làm: `text`, `text-long`, `choice-one`, `choice-many`, `tf`, `match`, `cell`. Đáp án nhiều cách viết ghi cách nhau ` / ` (`isn't / is not`). Chỗ chưa có đáp án → chấm tay + cảnh báo. Tô chữ (Q9), khung vẽ, lưới tìm từ: không có chỗ trả lời, chỉ ghi chú "chỉ xem".
- **Đánh dấu trên trang**: `renderTask` gắn `data-ans="<mã chỗ>"` vào phần tử của từng chỗ trả lời (gạch điền, nhóm chọn, nhãn T/F, ô bảng, ô chữ, ô nối…). Chỉ thêm thuộc tính, không thêm phần tử. (`data-slot` đã có nghĩa là ô ảnh nên không dùng.)
- **Thư viện chung** `shared/` (TypeScript, không thư viện ngoài, dùng được cho TeacherResource): `normalize`, `grade`, `validate`, kiểu `Slot`/`Key`/`Result`. Bộ phiếu mẫu `shared/fixtures/` (6 phiếu, mỗi phiếu 3 bài làm mẫu kèm kết quả mong đợi). Chạy `cd shared && node --test test/*.test.ts`.
- **Bộ đọc MD sửa lỗi**: dòng đáp án của Task hội thoại chỉ gán cho lượt có chỗ trống (trước đây gán cả lượt không có `___`, làm lệch đáp án).
- Công cụ: `tests/gd0/slots_phieu.py` (liệt kê trên mọi phiếu mẫu), `kiem_slots.mjs --dom` (kiểm khuôn + khớp 1–1 trang), `tao_mau.mjs` (sinh `shared/fixtures`), `bang_duyet.mjs` (→ `docs/TUONG_TAC/DUYET_GD0.md`). Phiếu mẫu có đáp án đủ dạng: `tests/gd0/mau-du-dang.md`.

## 42. GĐ1a trình chiếu phiếu (v111, 27/10/2026)
Kế hoạch `docs/TUONG_TAC/KE_HOACH_GD1A.md`, đề xuất `DE_XUAT_1A_TRINH_CHIEU.md`. Phiếu soạn và bản in không đổi: trình chiếu là lớp phủ trên **bản sao** HTML các trang đã dàn (`store.pageView`), đóng là gỡ hết.
- **Mở:** nút nổi **▶ Chiếu** ở góc dưới khung trang (không đặt ở thanh trên để thanh trên không xuống dòng). Bắt đầu ở trang của Task đang chọn. Xin toàn màn hình; Esc của trình duyệt chỉ thoát toàn màn hình, Esc lần nữa đóng trình chiếu.
- **Mã:** `app/src/viewer/` (`data.ts` tách trang thành mảnh Task, `Presenter.tsx`, `answers.ts`, `ink.ts`, `Tools.tsx`, `viewer.css`). Trình xem chỉ nhận `ShowData {title, pages (HTML .flow), slots, key, start}`, không đọc trạng thái WS Editor, để chuyển nguyên sang TeacherResource.
- **Xem:** Cả trang (trang A4 vừa chiều cao) / Từng Task (T): ghép các mảnh cùng `data-task`; vừa cả Task nếu được, Task dài thì không nhỏ dưới 1,5 lần cỡ thật và cuộn. ← → lật; PageDown / PageUp (bút trình chiếu) ở Từng Task cuộn hết Task rồi mới sang Task sau. Home / End, hộp Đi tới Task.
- **Phóng:** + / − / 0, Ctrl + lăn chuột, chụm hai ngón, Phóng vùng (Z, kéo khung), bấm ảnh xem lớn.
- **Đáp án:** cả phiếu (A), nút ✓ đầu mỗi Task, ~~bấm từng chỗ~~ (từ v112 bấm chỗ trả lời là làm bài, xem mục 43), lần lượt (Space; Shift+Space ẩn lại). Chữ đáp án xanh trên gạch / dòng / ô; phương án đúng tô bằng lớp `pk` sẵn có (như câu ví dụ) thêm `vok`; bài nối vẽ đường nối; ô chữ hiện chữ. "Clicker: đáp án" bật thì PageDown hiện đáp án kế tiếp, hết mới lật. Đếm "n chỗ chưa có đáp án".
- **Bút** (thanh dọc bên trái): con trỏ, bút (P), tô vàng (hoặc giữ Ctrl kéo), đường thẳng (hoặc giữ Shift kéo; Shift khóa ngang / dọc), tẩy (E), 4 màu, 3 độ dày, hoàn tác / làm lại (Ctrl+Z / Ctrl+Shift+Z), xóa hết (hoàn tác được), ẩn nét. Nét neo vào mảnh Task (`<task>#<mảnh>`) theo tọa độ trong Task, nét ngoài Task neo vào trang. Lưu `localStorage` `wsShow.ink:<tiêu đề>` kèm dấu nội dung các trang: phiếu đã sửa thì bỏ nét cũ và báo.
- **Che / hé (H):** tấm sọc che phần chữ từng câu (chừa số câu), lượt thoại, bài đọc, hàng bảng 2 cột, vế nối, bảng; bấm để hé, bấm câu đã hé để che lại; Hé hết.
- **Đồng hồ (G):** 1 / 3 / 5 / 10 phút, ±1 phút (tối thiểu 10 giây), lớn giữa màn hình hoặc góc; hết giờ nhấp nháy đỏ + chuông hai tiếng (Web Audio, tắt được). **Bảng trắng (B):** nền trắng / kẻ dòng / kẻ ô, bút / tô / tẩy / hoàn tác / xóa; giữ trong buổi chiếu, không lưu.
- Thanh công cụ dưới đáy tự ẩn sau 3 giây; màn hẹp hơn 1700 px chỉ còn biểu tượng (chữ ở chú thích).
- Kiểm thử: `tests/gd1a/test_chieu.py` (73 mục B1–B7, chụp ảnh), `tests/gd1a/quet_phieu.py` (mở trình chiếu, bật đáp án, đi hết trang / Task trên 25 phiếu mẫu).

## 43. GĐ1b giáo viên tự làm thử trên phiếu (v112, 27/10/2026)
Kế hoạch `docs/TUONG_TAC/KE_HOACH_GD1B.md`. Trong trình chiếu, phiếu **lúc nào cũng làm được** (không có nút Làm thử): ở con trỏ, bấm chỗ trả lời là làm bài; đang cầm bút thì bấm kéo là vẽ. Không lưu, đóng trình chiếu là xóa bài làm.
- **Mã:** `app/src/viewer/work.ts` (lớp làm bài), phần GĐ1b trong `Presenter.tsx`, lớp `vw*` trong `viewer.css`. Bài làm dạng `Answers` của `shared/`, chấm bằng `gradeSlot()` (giống TeacherResource sau này).
- **Lớp:** ô gõ, phương án đang chọn, đường nối, xanh / đỏ nằm *trong* chính phần tử `data-ans` của bản sao trang (phóng, đổi kiểu xem tự đi theo); tấm che phủ lên trên; nét vẽ trên cùng, trong suốt với cú bấm khi không cầm bút.
- **Gõ** (`text`, `text-long`, `cell`, ô chữ, ô nối viết chữ): ô nhập thật trên gạch / dòng / ô, cỡ chữ theo phiếu; chữ dài hơn gạch thì gạch dài ra. Chấm khi Enter / Tab / Esc / bấm ra ngoài; đang sửa thì bỏ màu. Dòng viết nhiều dòng: Enter xuống dòng. Ô chữ: một chữ hoa, chấm ngay, tự sang ô kế theo hàng (giữ Shift = theo cột), mũi tên đi giữa các ô, Backspace ở ô trống lùi lại.
- **Bấm chọn:** A/B/C, `{a|b}`, tìm lỗi sai A–D, T/F, ô tick, chọn ảnh: chấm ngay; bấm phương án khác là đổi, bấm lại là bỏ. Chọn nhiều: viền xám, nút **Chấm** (hoặc Enter); hàng tick trong bảng chỉ một ô đúng thì chấm ngay.
- **Nối:** bấm chấm (hoặc chữ) vế trái rồi vế phải, hoặc ngược lại; chấm đang chờ nhấp nháy, Esc bỏ. Một vế phải chỉ một đường (nối lại thì đường cũ tự gỡ). Bấm đường để gỡ. Ô nối viết chữ: gõ chữ cái của hàng vế phải (người soạn ghi "A. cold" thì theo chữ đó; không ghi thì a, b, c theo thứ tự hàng).
- **Phản hồi:** đúng viền xanh lá + ✓, sai viền đỏ + ✗, đúng một phần cam + ½, chấm tay xám + ✎. Mặc định **sai không tự hiện đáp án**; bấm ✗ để hiện đáp án chỗ đó, công tắc **Sai thì hiện đáp án** để hiện luôn. Có bài mẫu thì bấm ✎ xem bài mẫu. Đáp án hiện cạnh bài làm (chữ nhỏ phía trên), chỗ làm đúng thì không hiện thêm.
- **Thanh công cụ:** "Đúng x/y" (chỉ đếm chỗ máy chấm), Sai thì hiện đáp án, ⟲ Làm lại cả phiếu; nút ⟲ đầu mỗi Task (khi Task có bài làm). A, ✓ đầu Task, Space vẫn hiện đáp án như 1a. Dưới 2100 px ẩn chữ của Phóng vùng / Clicker / Toàn màn hình (1920 vừa một hàng).
- **Bàn phím:** đang gõ thì phím tắt trình chiếu và WS Editor không chạy; Tab / Shift+Tab sang ô gõ kế / trước; Enter chấm rồi sang ô kế.
- Kiểm thử: `tests/gd1b/test_lambai.py` (82 mục C1–C5, so màu với 3 bài làm mẫu `shared/fixtures/mau-du-dang`), `tests/gd1b/quet_lambai.py` (25 phiếu + `tests/gd1b/mau-noi-o.md`: mọi chỗ máy chấm làm đúng bằng thao tác thật, mọi chỗ khác làm thử được). `tests/gd1a/test_chieu.py` còn 72 mục (bấm chỗ trả lời giờ là làm bài).


## 44. Sửa lỗi chấm và nối (v113, 28/10/2026)
Kế hoạch `docs/KE_HOACH_SUA_SAU_KIEM_THU.md` đợt 1 (kết quả thử tay phiên 13).
- **Nối theo mã, không theo chữ:** mỗi hàng vế phải trên trang mang `data-opt` = mã phương án (`.mr[data-opt]`, chỉ là thuộc tính, không đổi hình). Hiện đáp án và làm bài tìm hàng theo mã, nên hai vế phải trùng chữ (T19 "yes / yes") không lẫn. Ô nối viết chữ cũng theo mã.
- **Dấu câu:** đáp án (hoặc bài làm) chỉ gồm dấu câu thì so **cả dấu** (`?` ≠ `.`); câu chữ vẫn bỏ dấu thừa hai đầu như cũ (`shared/src/normalize.ts`, `punctOnly`).
- **Đúng/Sai:** đáp án `T/F`, `Đúng/Sai`, `Y/N`, `R/W`… khớp nhãn theo chữ cái đầu (True/False, Yes/No, Right/Wrong). Hàm chung `tfIndex()` trong `core/model.js` (slots.js và ô ví dụ A6 cùng dùng).
- **Gõ dài:** ô gõ dài ra tới hết bề ngang khung chứa, quá nữa thì xuống dòng (ô đổi sang textarea `vwwrap`), không tràn khỏi trang.
- **Chỗ chưa có đáp án:** nhãn cam **✎ Chấm tay** (hoặc "Chấm tay n chỗ", "Chỉ xem") ở góc Task khi chiếu; rê chuột / bấm xem lý do (danh sách `notes` của `taskSlots`). Chỉ có khi chiếu, không in.

## 45. Chấm tay và trạng thái đáp án (v114, 28/10/2026)
- **Chấm tay khi chiếu:** chỗ chấm tay đã có bài làm hiện hai nút nhỏ ✓ / ✗; bấm là chấm, dấu ✓ / ✗ đã chấm bấm lại để chấm lại; sửa bài làm thì chấm lại từ đầu. Không lưu. "Đúng x/y" cộng cả chỗ chấm tay đã chấm (chú thích ghi "kể cả n chỗ chấm tay"). Viết tự do có bài mẫu: vẫn có ✓ / ✗, dấu ✎ vẫn mở bài mẫu.
- **Đáp án theo phần đang xem:** nút Đáp án / phím A bật tắt đáp án **trang hoặc Task đang xem**; Shift+A cả phiếu; sang Task khác không tự hiện. ✓ đầu Task, Space như cũ.
- **Đáp án hiện vì làm sai** (công tắc "Sai thì hiện đáp án" hoặc bấm ✗) gắn với lần làm đó: sửa thành đúng hoặc xóa bài thì tự ẩn; đáp án bật bằng A thì giữ. Đây là nguyên nhân "lúc hiện lúc không" của phiên 13; test ngẫu nhiên 70 bước so với mô hình (`tests/sau_kiem_thu/test_dot2.py`).
- (v117) Dấu và nút làm bài giống hệt lần vẽ trước thì giữ phần tử cũ: trước đây vẽ lại giữa lúc nhấn và nhả chuột (ví dụ thanh công cụ hiện lại) làm cú bấm ✓ / ✗ rơi mất.

## 46. Chỉnh giao diện nhỏ (v115, 28/10/2026)
- Gõ vào chỗ trống bài đọc: ẩn nhãn (1) (2) của ô đang gõ. Ô tick: đúng / sai bằng màu dấu tick + chữ, bỏ khung xanh đỏ.
- **Bài nối:** khoảng 2 mm giữa chữ vế trái / vế phải và chấm nối (đổi hình trang soạn, đã đổi chuẩn 120).
- **Đúng/Sai theo tỉ lệ:** mọi kiểu T/F (dòng riêng và cùng hàng) chia cột câu / cột T/F theo tỉ lệ, mặc định 80/20; tay kéo đổi tỉ lệ bước 5% (50–90). Tham số mới `answer.params.tfp` thay `tfx` (cách lề phải). Đổi hình trang soạn, đã đổi chuẩn.
- **Ảnh đồng đều (Nhìn ảnh viết, Chọn ảnh):** mặc định theo số ảnh trên hàng: 2 ảnh 60 mm, 3 ảnh 45, 4 ảnh 36, 5 ảnh 30; thanh **Kích thước ảnh** 50–150% cho cả khối (`layout.imgPct`); **Ảnh vừa ô** khít bề ngang ô (`layout.imgFit`); ảnh đã chỉnh tay giữ nguyên. MD: `Kích thước ảnh: 80%`, `Ảnh vừa ô: có`. Đổi hình trang soạn, đã đổi chuẩn.
- **Trình chiếu:** nút Xóa nét có chữ, mở hai lựa chọn "Xóa nét trang / Task này" và "Xóa hết nét vẽ"; Ctrl + lăn chuột (và chụm hai ngón) phóng theo đầu chuột; nút Vừa về 100%; Shift + kéo = đường thẳng đỏ, nét vừa, vẫn ở con trỏ; Từng Task mặc định rộng 80% màn hình, nút **Mặc định ↔ Vừa** (thấy trọn Task); ↓ / ↑ sang ô gõ kế / trước.

## 47. Chấm thông minh hơn (v116, 28/10/2026)
- **Viết tắt chuẩn:** máy chấm đổi cả bài làm và đáp án về dạng đầy đủ theo `docs/TUONG_TAC/BANG_VIET_TAT_CHUAN.md` (`CONTRACTIONS` trong `shared/src/normalize.ts`) rồi mới so: `I'm` = `I am`. Không đoán `'s` sở hữu, `'s` = is, `'d` = would. Công tắc theo Task **Phân biệt viết tắt** (mặc định tắt) ở mục Câu hỏi; bật thì `isn't` ≠ `is not` (khóa chấm `strictContr`). MD `Phân biệt viết tắt: có`.
- **Chip gợi ý cách viết khác** (cách A): dưới ô đáp án ở cột trái hiện chip `+ color`, `+ He's gone`, `+ 10`…; bấm chip thêm ` / …` vào đáp án, bấm × bỏ gợi ý (không hỏi lại, lưu ở `sugNo`); Task có ≥ 3 gợi ý có nút "Nhận tất cả gợi ý (n)". Quy tắc cố định, không AI: Anh / Mỹ, số ↔ chữ, thứ tự, `'s`/`'d` = has / had, `name is`, gạch nối (`shared/src/suggest.ts`, `core/sug.js`).
- **Ô chữ tìm từ:** máy tìm vị trí từng từ của khung từ trong lưới (8 hướng); mỗi từ tìm được là một chỗ trả lời `find` (đáp án `"r,c-r,c"`). Hiện đáp án = khung bo góc quanh từ; làm bài = kéo từ chữ đầu tới chữ cuối (xuôi hay ngược đều được), đúng thì khung xanh, từ không có trong khung từ thì báo. Lưới bị cắt sang mảnh sau vẫn vẽ được (v117).
- **Prompt PDF → MD:** quy tắc 26 (bảng chọn ghi `[x]` cho ô đúng), 27 (Phân biệt viết tắt). Bản lưu `prompt/PROMPT_PDF_SANG_MD_v116.txt` (thư mục dự án).

## 48. Trình chiếu: 2 trang, Cuộn, đèn pin, ghi chú (v117, 28/10/2026)
- **1 trang / 2 trang** (Cả trang): nút ▯ / ▯▯; hai trang cạnh nhau vừa màn hình, lật 2 trang mỗi lần, thanh ghi "Trang 1–2/9". Đáp án A, nét vẽ, che, làm bài áp cho cả hai trang đang xem; nét ở lề trang gắn với đúng trang (`page#i`).
- **Trang / Cuộn** (Cả trang): Cuộn = mọi trang xếp dọc liền, cuộn tự do, thanh ghi trang đang chiếm phần trên màn hình; lật (←/→, PageUp/Down) = cuộn mượt tới đầu trang kế. Dùng chung với 2 trang (hai trang một hàng).
- **Nút 🔍 ở góc mỗi Task** (bên trái ✓ / ⟲, chỉ ở Cả trang): mở Từng Task đúng Task đó.
- **Đèn pin** (phím L / nút 🔦): màn tối 92%, vòng sáng theo chuột (cảm ứng: chạm kéo), lăn chuột đổi cỡ vòng sáng 60–600 px, bấm xuyên qua được, Esc tắt.
- **Bảng trắng chế độ Text** (nút T): bấm đâu gõ đó; nền kẻ dòng thì dòng chữ ngồi trên dòng kẻ gần nhất (dòng kẻ 57 px), nền kẻ ô thì vào góc ô (36 px); Ctrl+Z, Xóa bảng, tẩy áp cả chữ.
- **Hộp Note:** bấm đúp trên phiếu (ở con trỏ, không trúng chỗ trả lời / nút / ô chữ) mở hộp ghi chú vàng tại chỗ; gõ, hoặc 🎤 nói (nhận giọng nói của trình duyệt, ngôn ngữ theo trình duyệt; không có thì ẩn nút); tự giãn theo chữ; – thu gọn thành nhãn 📝, × xóa; hộp trống bỏ đi khi rời. Gắn với Task (hoặc trang) như nét vẽ, lưu trên máy theo phiếu + dấu nội dung (`wsShow.note:`), sửa phiếu thì bỏ.
- Lăn chuột không Ctrl: trình chiếu tự cuộn vùng chiếu (Chromium có lúc không cuộn khi đầu chuột nằm trên chữ của trang đã phóng).
- Mã: `Presenter.tsx`, `Note.tsx`, `Tools.tsx` (Board), `ink.ts` (`loadNotes` / `saveNotes`), `viewer.css`. Kiểm thử `tests/sau_kiem_thu/test_dot1.py` … `test_dot5.py`.

## 49. GĐ2 gói phiếu tương tác .wsp (v118, 28/10/2026)
- **Mốc 1 = WS Editor hoàn chỉnh** sau GĐ0, 1a, 1b và GĐ2 (bản này). Lớp học (học sinh vào làm, nộp, chấm chữa, báo cáo) là **Mốc 2 "Khu thử nghiệm Lớp học"** ở `server/`, không tính vào WS Editor (`docs/TUONG_TAC/3_LO_TRINH.md`).
- **Nút "Gói .wsp"** nổi cạnh ▶ Chiếu (không chen thanh trên). Hộp gói: tóm tắt (trang, chỗ trả lời máy chấm / chấm tay, câu chỉ xem, ảnh, phông), **chặn xuất** khi có trang tràn hoặc ảnh không lấy được, **cảnh báo** (chưa có đáp án → chấm tay, chỉ xem, thiếu phông) phải tích "Tôi đã xem" mới xuất. Trước khi ký chạy đủ kiểm tra mục 9 của `2_CHUAN_GOI_PHIEU.md`; lỗi thì không xuất và liệt kê.
- **Nội dung gói** (đúng tài liệu 2): trang `pages/pN.html` = khung A4 + nội dung + chân trang, ảnh tách ra `media/<băm>.<đuôi>`, `pages/style.css` gom từ CSS app (chỉ luật có mọi lớp đều dùng trên trang, `:root`, @font-face của font phiếu trỏ `fonts/`), phông `fonts/*.woff2` (chỉ kèm được khi app mở qua http; mở thẳng file thì cảnh báo thiếu phông), `slots.json`, `key.json`, `source.json` (phiếu gốc), `manifest.json`. `manifest.docMode = "quirks"`: app hiện chạy chế độ quirks (không có `<!doctype>`), trang phải hiển thị cùng chế độ mới giống hệt (nợ kỹ thuật, `BAN_GIAO_DEV/3`).
- **Ký và mã hóa:** lõi ZIP mã hóa AES-GCM-256 (AAD = `wsp/0|sheetId|version`), khóa nội dung bọc RSA-OAEP-2048 cho từng người nhận (`ed` = WS Editor trên máy này, `tr` = bên nhập), chữ ký Ed25519 trên phong bì chuẩn tắc (khóa sắp xếp, bỏ `signature`, có `payloadSha256`). Vỏ .wsp phải đúng dạng ZIP chuẩn tắc: sửa bất kỳ byte nào cũng bị từ chối (đã thử từng byte). Chưa có dịch vụ ký của công ty: dùng **khóa thử trên máy** (`dev-local-…`, lưu trong trình duyệt); mở từ máy chủ lớp thử thì máy chủ ký và là bên `tr`.
- **Phiên bản gói:** cùng mã phiếu, đề hoặc đáp án đổi so với lần xuất trước thì tăng (nhớ trên máy, `wsp.ver.v1`).
- **Mở gói .wsp…** (trong hộp gói): kiểm chữ ký + toàn bộ mục 9 bằng khóa `ed` rồi mở phiếu gốc (hỏi trước vì thay phiếu đang mở); gói hỏng / lạ thì báo lý do, phiếu đang mở giữ nguyên.
- **Dùng chung `shared/`:** `zip.ts` (ZIP không nén, đọc chặt), `wsp.ts` (`buildFiles`, `sealWsp`, `inspectWsp`, `openWsp`, `checkFiles`, `studentView`, khóa). Công cụ dòng lệnh `node shared/bin/wsp.ts keygen | inspect | extract`.
- **Sửa lỗi có sẵn từ v111:** thông báo nhỏ (toast) ở WS Editor hiện thành khối tối cao cả màn hình ở góc trái (lớp `.show` của trình chiếu trùng tên lớp `.toast.show`); nay luật trình chiếu chỉ áp cho `#wsShow`.
- Kiểm thử: `shared` 22 test (có thử sửa từng byte), `tests/gd2/test_goi.py` 402 kiểm tra trên 24 phiếu chuẩn (xuất; `inspect` đạt; sửa 1 byte bị từ chối; trang trong gói hiển thị một mình giống hệt ảnh chuẩn v117; phần học sinh không có đáp án; mở lại ra đúng phiếu gốc; phiếu có trang tràn bị chặn).

## 50. Khu thử nghiệm Lớp học: phiên học (v119, 28/10/2026)
- **Mốc 2, không thuộc WS Editor.** Máy chủ nhỏ `server/` (Node ≥ 22.6, không gói npm nào, dữ liệu JSON trong `server/du-lieu/`), chạy `npm run lop` hoặc bấm đúp `chay-lop.command` / `chay-lop.bat`. Làm độc lập với TeacherResource: chỉ dùng chung `shared/` (chấm điểm, gói .wsp, báo cáo) và trình xem `app/src/viewer/`. Hướng dẫn: `server/README.md`.
- **Công tắc thử nghiệm:** trang lớp chỉ có khi chạy máy chủ (`/gv`, `/hs`); WS Editor chỉ hiện "Gửi lên lớp thử" khi được máy chủ phục vụ (`/editor`, có `<meta name="ws-lop">`). Mở `ws-editor.html` thẳng từ file thì không có gì mới ngoài "Gói .wsp".
- **Chưa có ở v119:** Chấm chữa và Báo cáo (nút có, mở ra trang "bản sau"); làm ở v120–v122.
- **Giáo viên** (`/gv`, mật khẩu in ở cửa sổ máy chủ, tạo một lần 6 số): thẻ **Lớp** (dán danh sách tên, tối đa 80; nút lớp mẫu 12 tên giả), **Gói phiếu** (nhận gói từ WS Editor hoặc tải .wsp ký bằng khóa máy chủ; máy chủ kiểm lại mục 9, bỏ `source.json`; Xem trước có đáp án), **Phiên học** (chọn lớp + gói → mã 6 ký tự không có 0/O/1/I + QR + địa chỉ wifi; bảng theo dõi trực tiếp: Chưa vào / Đang làm / Đã nộp, đã làm x/y; **Mở khóa** tên để em vào lại ở máy khác; **Kết thúc phiên** thu bài em chưa nộp, ghi "(thu khi kết thúc)").
- **Học sinh** (`/hs`): nhập mã (hoặc quét QR) → bấm tên → làm trên trình xem vai `student` (không đáp án, không đúng / sai, không công cụ giáo viên, chỉ chuyển trang / phóng to). Tự lưu 0,8 giây sau mỗi thay đổi ("✓ Đã lưu"); tải lại trang / vào lại cùng máy thì làm tiếp; tên đã vào ở máy khác thì báo nhờ giáo viên Mở khóa. **Nộp bài** hỏi lại (nói số chỗ còn trống), nộp rồi khóa. Phiên kết thúc: bài khóa ngay, dải báo "Phiên đã kết thúc".
- **An toàn:** đáp án không bao giờ gửi cho học sinh (`key.json` chỉ giáo viên; test dò cả chữ đáp án trong dữ liệu học sinh); bài làm chỉ nhận đúng mã chỗ trả lời, giới hạn độ dài; cookie HttpOnly; chặn yêu cầu ghi từ trang lạ (Origin).
- **Trình xem 3 vai** (`ShowData.role`): `show` (như cũ), `student`, `review` (v120). Học sinh trên điện thoại (màn < 700 px): Từng Task rộng hết màn hình, thanh công cụ xuống dòng để nút Nộp luôn thấy. Thêm `init`, `onAnswers`, `lock`, `man0` / `onMan`, `extra` (nút thêm vào thanh), `banner`.

## 51. Chấm chữa (v120, 28/10/2026)
- Mở từ phiên đã kết thúc (**Chấm chữa**). Trái: trình xem vai `review` với bài làm của em (khóa, dấu đúng / sai của máy, bấm ✓ / ✗ cạnh chỗ chấm tay, nút Đáp án). Phải: **bảng chấm**: từng chỗ (câu, em trả lời → đáp án, trạng thái, ô điểm 0…tối đa bước 0,5, nút ✓ / ✗ cho chỗ chấm tay), lời nhắn từng câu (hiện cho câu sai / chấm tay), **Nhận xét chung**, **Chốt chấm xong**, "Chốt, em sau ▶", ◀ ▶ đổi em, nút Báo cáo (v121).
- Điểm ở bảng chấm là điểm chính thức; sửa được cả điểm máy chấm (chấp nhận cách viết khác). ✓ / ✗ trên phiếu ↔ điểm tối đa / 0 ở bảng (hai chiều). Tự lưu 0,6 giây sau mỗi thay đổi. Chỉ chấm khi phiên đã kết thúc. Bảng theo dõi phiên hiện chip "Đã chấm". Ô "Đúng x/y" của trình xem ẩn khi chấm chữa (điểm chính thức ở bảng chấm).
- Máy chủ: `GET /api/phien/:id/cham`, `PUT /api/phien/:id/cham/:hs {overrides, nhanXet, xong}` (điểm kẹp 0…tối đa).

## 52. Báo cáo lớp (v121, 28/10/2026)
- **Báo cáo** (từ phiên hoặc bảng chấm): ô số (đã nộp, trung bình, trung vị, thấp – cao nhất), phân bố điểm 5 mức, % đúng theo dạng bài (tên Q như WS Editor) và theo Task, **Câu sai nhiều** (dưới 70%: % đúng, đáp án, các câu trả lời sai hay gặp ×số em, bỏ trống), bảng học sinh (%, điểm, chờ chấm, thanh so với vạch trung bình lớp, nút Chấm chữa), bảng từng câu (thu gọn), **Tải bảng điểm (CSV)**.
- % chỉ tính phần đã chấm (chỗ chấm tay chưa chấm không tính, báo "còn n chỗ"). Chỉ tính bài đã nộp (cả bài thu khi kết thúc).
- Tính trong `shared/src/baocao.ts` (`classReport`, `taskInfo`, `answerText`, `keyText`), có test `shared/test/baocao.test.ts`.
- **Nhận xét nhanh theo quy tắc** (không cần mạng): câu dưới 70% kèm "n/m em cùng trả lời X (đáp án: Y) → chữa chung cả lớp"; dạng bài yếu nhất / mạnh nhất; câu nhiều em bỏ trống; em dưới 50%; em vào mà chưa tự nộp; em không vào; còn chỗ chấm tay. Phiên không ai làm: báo "Chưa có bài làm", các ô số để "–".

## 53. Báo cáo từng em và Insight (v122, 28/10/2026)
- **Báo cáo em:** %, điểm, trung bình lớp, thứ hạng, câu đúng; nhận xét của giáo viên; so với lớp theo dạng bài / Task (vạch = lớp); bảng câu sai / bỏ trống (em trả lời, đáp án, % lớp đúng, lời nhắn).
- **Nhận xét nhanh theo quy tắc cho từng em** (lớp: mục 52): so với lớp, dạng yếu / mạnh (≥ 2 câu), sai câu phần lớn lớp làm đúng (có thể đọc vội), bỏ trống nhiều.
- **✦ Insight AI:** máy chủ gửi **chỉ số liệu ẩn danh** (không tên, không bài viết tự do, không nhận xét của giáo viên) tới Claude Messages API (`server/src/ai.ts`, gọi HTTP thẳng vì máy chủ không có gói npm; mẫu `claude-opus-5-5`, effort thấp, `fallbacks: "default"`). Khóa chỉ ở máy chủ: biến môi trường `ANTHROPIC_API_KEY`. Không có khóa: nút thành "Lấy đoạn nhắc cho AI", hiện đoạn nhắc để chép dán vào AI khác. Đoạn nhắc đã gửi xem lại được.
- Nút "Báo cáo em" ở bảng học sinh của báo cáo lớp (chỉ em có vào phiên). Insight AI có ở cả báo cáo lớp và báo cáo em; phiên không ai làm thì không hiện.
