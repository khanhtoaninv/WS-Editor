# Quy ước MD trung gian cho WS Editor

Cập nhật: 2026-10-27 · thêm **v101** (đoạn văn có chỗ trống là câu hỏi) và **v100**: `Số câu:`, `Dạng: đúng/sai (cùng hàng)`, bài đọc có `___` nhãn `(a)` không tạo dòng câu (mục bảng trường và mục 2b). Trước đó áp dụng từ bản **v81** (kiến trúc trình bày mới: trường `Dạng:` cho 12 dạng câu hỏi, `Bố cục:`, câu ví dụ `0.`, dòng chữ `> `, khung từ ảnh, khối chữ / ảnh, điểm trên ảnh, hai ảnh chung, bốn ô li, đáp án `0.` và `Chỗ trống:`; mục **2b**, **4c**, **5**, **Ví dụ 5**). Mọi cú pháp cũ (v65–v80) vẫn đọc được như trước; `Trả lời:` vẫn dùng được, có `Dạng:` thì `Dạng:` thắng.

MD (Markdown) là cách viết một phiếu bằng chữ thường mà app đọc **chắc chắn**, không phải đoán. Dùng khi:
- tự soạn phiếu trong Word / Notes rồi dán vào app;
- Claude (hoặc AI của WS Studio) đọc PDF sách và ra MD thay cho JSON khi muốn người dùng dễ đọc, dễ sửa tay.

Nạp MD: **+ Task → thẻ “Từ file / dán”** (thêm các Task vào cuối phiếu) hoặc **+ Phiếu** (tạo phiếu mới). Chọn file `.md` / `.txt` hoặc dán thẳng. App tự nhận ra MD khi có ít nhất một dòng bắt đầu bằng `## Task`.

JSON vẫn là nguồn chính (đủ mọi trường, kể cả bố cục đã chỉnh tay). MD chở **nội dung** (chữ, câu, ảnh theo tên, khung từ, đáp án đúng) và **cách trình bày ở mức người dùng chọn**: dạng câu hỏi (`Dạng:`), bố cục Task (`Bố cục:`), vị trí khung từ, thứ tự bài đọc / câu hỏi. Kích thước, khoảng cách, căn lề vẫn do app tự dàn.

---

## 1. Khung một file

```
# Tên phiếu                    ← tùy chọn (dùng khi tạo phiếu mới)
Tuổi: 7-9                      ← tùy chọn: 5-6 | 7-9 | 10-12
Xếp trang: liền                ← tùy chọn: liền | tách
Khoảng cách: vừa               ← tùy chọn: gọn | vừa | thoáng

## Task: <tiêu đề Task>        ← BẮT BUỘC, mỗi bài của PDF bắt đầu bằng dòng này
...các dòng của Task...

### Phần: <tên phần>           ← tùy chọn: phần tiếp của Task ngay trên (xem mục 4)
...các dòng của phần...

## Task: <tiêu đề Task tiếp>
...

## Đáp án                      ← tùy chọn, luôn đặt CUỐI file, tách khỏi đề
...
```
- Các dòng trước `## Task` đầu tiên chỉ dùng cho cấp phiếu. Khi dùng **+ Task**, chúng bị bỏ qua (app báo).
- **Mỗi file một phiếu.** Phiếu có nhiều nhóm (vd. “Students 1 and 2 / 3 and 4”) thì tách thành nhiều file.
- **Nhãn của phần:** tên sau `### Phần:` không in lên phiếu. Muốn in một nhãn có sẵn trong PDF (vd `Self-check:`), ghi nó vào dòng `Hướng dẫn:` của phần.
- **Một bài của PDF = một `## Task`.** Không tách một bài thành nhiều `## Task`; bài có nhiều phần dùng `### Phần:`.
- Số Task tối đa mỗi lần nhập: 40 (tính cả phần).

## 2. Trường của một Task (dòng `Tên: giá trị`)

| Trường | Ý nghĩa | Ví dụ |
|---|---|---|
| `Hướng dẫn:` | dòng hướng dẫn dưới tiêu đề | `Hướng dẫn: Circle a, b or c.` |
| `Track:` | số track nghe (tự có mục Mã QR) | `Track: Track 05` |
| `Trả lời:` | loại chỗ trả lời (bảng mục 3). **Nên ghi** để app khỏi đoán | `Trả lời: viết câu` |
| `Dòng viết:` | số dòng viết mỗi câu (viết câu: tới 20; điền chỗ trống cuối câu: tới 8) | `Dòng viết: 2` |
| `Khung từ:` | từ cách nhau bằng dấu phẩy (từ có dấu phẩy thì dùng `;`) | `Khung từ: kitchen, garden, bedroom` |
| `Ảnh:` | ảnh chung của Task (tên ảnh, ảnh thật tải sau) | `Ảnh: the park` |
| `Lời dẫn:` | câu dẫn trước hội thoại | `Lời dẫn: Mai is talking to Ben.` |
| `Mẫu:` | ép theo một mẫu có sẵn (tên hoặc mã), thay cho `Trả lời:` | `Mẫu: Đúng/Sai` |
| `Ghi chú:` | lời nhắc của bài (vd câu nằm dưới bài trong bản gốc); app nối vào cuối hướng dẫn | `Ghi chú: Check them after reading.` |
| `Dạng:` (v81) | dạng câu hỏi, một trong 12 dạng ở mục 2b; chi tiết trong ngoặc. **Nên ghi** (thay cho `Trả lời:`) | `Dạng: đúng/sai (Yes/No)` |
| `Số câu:` (v100) | nhãn số câu: `a b c` (chữ a, b, c…), `ẩn` (không số câu), `1 2 3` (mặc định). Dùng khi PDF đánh a–h; viết các dòng là `1.`, `2.`… (không viết `a.` đầu dòng, vì app hiểu là lựa chọn) | `Số câu: a b c` |
| `Viền hai vế:` | `có` / `không` | chỉ bài nối: khung viền quanh chữ hai vế (v103, mặc định không viền) |
| `Phân biệt viết tắt:` | `có` / `không` | (v116) bài dạy viết tắt: máy chấm KHÔNG coi `I'm` = `I am`. Mặc định không ghi = coi tương đương theo bảng `docs/TUONG_TAC/BANG_VIET_TAT_CHUAN.md` |
| `Kích thước ảnh:` | `50%` … `150%` | (v116, cài ở v115) ảnh theo câu (nhìn ảnh viết, chọn ảnh): nhân cỡ mặc định theo số ảnh trên hàng (2 = 60, 3 = 45, 4 = 36, 5 = 30 mm) |
| `Ảnh vừa ô:` | `có` / `không` | (v115) ảnh và dòng viết khít bề ngang ô |
| `Tiêu đề cột:` | `PLACES \| PROBLEMS` | chỉ bài nối (v105): tiêu đề hai cột (trái \| phải) |
| `Chỗ nối:` | `chấm` / `ô viết chữ` / `không` | chỉ bài nối (v105): giữa hai cột là chấm nối, ô viết chữ cái hoặc không có |
| Vế phải thừa (bài nối, v105) | `6. - F. very cold` | dòng bài nối có vế trái trống: vế gây nhiễu / vế dư ở cột phải |
| Đoạn văn có chỗ trống (v101) | đoạn văn có `(a) ___` cần đáp án là **câu hỏi**, không phải bài đọc: `Bài đọc:` chỉ tiêu đề, mỗi đoạn là một câu `1.`, `2.`…, kèm `Dạng: điền từ` và `Số câu: ẩn`. Bài đọc có `___` (cách cũ) vẫn nạp được, app ghi chú nên chuyển | `1. In 2005 she began to (a) ___ a cemetery. Many (b) ___ were found.` |
| `Bố cục:` (v81) | bố cục Task: `xếp dọc` / `ảnh trái` / `ảnh phải` / `ảnh trong bài đọc`. Chỉ ghi khi muốn khác Tự động | `Bố cục: ảnh trái` |
| `Ảnh: A; B` (v81) | hai ảnh chung đứng cạnh nhau, cùng cỡ (chỉ dùng với Xếp dọc) | `Ảnh: phòng ngủ; phòng khách` |
| `Khung từ ảnh:` (v81) | khung từ bằng ảnh (ô ảnh cùng cỡ, nhãn A B C, tên ảnh in dưới); không trộn chữ và ảnh | `Khung từ ảnh: apple, banana, cherry` |
| `Vị trí khung từ:` (v81) | `trên` (mặc định) / `dưới` / `phải` | `Vị trí khung từ: dưới` |
| `Dòng kẻ:` (v81) | `bốn ô li` = dòng tập viết 4 ô li (viết câu / tô chữ) | `Dòng kẻ: bốn ô li` |
| `Thứ tự:` (v81) | `câu hỏi trước` = câu hỏi in trước bài đọc (Task có bài đọc, không dùng với Ảnh trong bài đọc) | `Thứ tự: câu hỏi trước` |
| `Điểm trên ảnh:` (v81) | các điểm đánh số trên ảnh chung, `x y` theo % (trái → phải, trên → dưới), cách nhau `;`; thêm `(ô trống)` nếu điểm không in số | `Điểm trên ảnh: 20 30; 50 60` |
| `Khối chữ:` / `Khối chữ trên:` (v81) | khối chữ tự do ngang cả Task (ghi chú, luật chơi, ví dụ dài): các dòng **thụt lề** ngay dưới là nội dung; không có `trên` thì nằm dưới bài | xem mục 4c |
| `Khối ảnh:` / `Khối ảnh trên:` (v81) | khối ảnh tự do ngang cả Task (sơ đồ, ảnh minh họa) | `Khối ảnh trên: bản đồ khu vườn` |

Tên trường viết hoa hay thường đều được; có bản tiếng Anh: `Instruction`, `Audio`, `Answer type`, `Words`, `Image`, `Intro`. Mọi trường dùng được ở `## Task` lẫn `### Phần`.

## 2b. Giá trị của `Dạng:` (v81)

| Viết | Mã | Trên phiếu | Chi tiết trong ngoặc |
|---|---|---|---|
| `điền từ` (`điền chỗ trống`) | Q1 | gạch `___` trong câu, hoặc dưới câu | `(ô chữ cái)` = mỗi chữ một ô |
| `viết câu` | Q2 | dòng kẻ để viết câu (`Dòng viết: N`) | `(bốn ô li)` |
| `chọn A/B/C` (`khoanh A/B/C`) | Q3 | lựa chọn A, B, C dưới câu | (v102) nhãn mặc định là `a. b. c.` (không vòng tròn); `(khoanh)` = vòng tròn ⓐ; `(ô tick)` = ☐; (v106) `(căn giữa)` / `(căn dưới)` = căn dọc số câu, chữ câu, lựa chọn |
| `chọn trong câu` (`gạch chân`) | Q4 | `{a\|b}` trong câu, học sinh gạch / khoanh | `(nhãn A-D)` = bài tìm lỗi sai: viết các đoạn gạch chân `<u>…</u>`, app in A B C D dưới từng đoạn |
| `đúng/sai` | Q5 | khoanh T / F | nhãn tự đặt 2–3 cái: `(Yes/No)`, `(True/False)`, `(T/F/NG)`, `(Right/Wrong)`; `(ô tick)` = ô tick; `(cùng hàng)` (v100) = T F nằm cuối hàng, bên phải câu (kết hợp: `(Yes/No, cùng hàng)`) |
| `nhìn ảnh viết` | Q6 | mỗi câu một ảnh `[ảnh: x]`, viết từ / câu | |
| `chọn ảnh` (`tick ảnh`) | Q7 | mỗi câu 2–4 ảnh, tick ảnh đúng | |
| `nối` | Q8 | chấm nối hai vế `trái - phải` | |
| `tô chữ` | Q9 | dòng tô chữ | `(bốn ô li)` |
| `bảng` | Q10 | bảng ` \| ` (ô trống viết, `[ ]` tick, `[ảnh: x]`) | |
| `lưới` (`ô chữ`) | Q11 | `Crossword:` / `Ô chữ:` | |
| `viết tự do` (`viết đoạn`) | Q12 | không có câu: dòng kẻ (`Dòng viết: N`, tới 20) | `(khung vẽ)` = khung trống để vẽ |

- Viết mã cũng được: `Dạng: Q5 (Yes/No)`.
- Bài **chỉ hiển thị, không có chỗ trả lời** (từ điển tranh, tô màu, hỏi đáp miệng): vẫn ghi `Trả lời: không`.
- Câu có ảnh riêng (`1. [ảnh: cat]`) mà ghi `Dạng: điền từ` / `viết câu` / `chọn…`: app hiểu là cách trả lời của dạng Nhìn ảnh viết / Chọn ảnh, **không bỏ ảnh**.
- `Dạng:` không hợp nội dung (vd `nối` với bài đọc) thì app giữ dạng đoán và ghi chú. Có cả `Trả lời:` và `Dạng:` khác nhau thì dùng `Dạng:` và ghi chú.

## 3. Giá trị của `Trả lời:` (cũ, vẫn dùng được)

| Viết | Chỗ trả lời trên phiếu |
|---|---|
| `viết từ` | ô trống viết một từ dưới mỗi câu / ảnh |
| `điền chỗ trống` | gạch `___` ngay trong câu |
| `viết câu` | dòng kẻ để viết câu |
| `khoanh A/B/C` (hoặc `khoanh`, `chọn A/B/C`) | lựa chọn A, B, C dưới câu (viết `A.` hay `a.` đều được; v84: nhãn trên phiếu mặc định chữ thường a b c, đổi chữ hoa ở nút Nhãn) |
| `chọn trong câu` (hoặc `gạch chân`) | lựa chọn `{a|b}` ngay trong câu |
| `tick` | lựa chọn bằng chữ có ô ☐ (`☐ a cake ☐ a football`) → các lựa chọn có ô tick; lựa chọn là ảnh (`A. [ảnh: x]` hoặc tên ảnh) → nhiều ảnh lựa chọn, tick ảnh |
| `đúng/sai` | ô T / F |
| `nối` | chấm nối hai vế |
| `tô chữ` | dòng tô chữ |
| `không` | không có chỗ trả lời (tô màu, vẽ, hỏi đáp miệng) |

Không ghi `Trả lời:` thì app đoán theo ký hiệu như khi dán chữ, và ghi “do hệ thống đoán” nếu độ chắc chưa cao.

## 4. Nội dung

- **Câu đánh số:** `1. …`, `2) …`, `(3) …`. Trong câu dùng các ký hiệu sẵn có:
  `___` chỗ trống · `{a|b}` chọn trong câu · `A. … B. … C. …` lựa chọn (cùng dòng, hoặc mỗi lựa chọn một dòng ngay dưới câu, thụt lề hay không đều được) · `☐ …` lựa chọn có ô tick (cũng nhận `[ ]`, `□`; cùng dòng hoặc mỗi dòng một lựa chọn) · `[ảnh: tên]` ảnh của câu · `trái - phải` một cặp nối (vế trái là ảnh: `[ảnh: apple] - pear`).
- **Câu chỉ có lựa chọn** (không có thân câu, vd chọn ý chính của bài đọc): `1. A. … B. … C. …` hoặc `☐ a cake ☐ a football ☐ balloons`.
- **Task chỉ có một câu** thì trên phiếu không đánh số câu (vẫn chừa lề cho chữ thẳng hàng với các Task khác).
- **Câu nhiều dòng:** dòng **thụt lề** (≥ 2 dấu cách) ngay dưới một câu đánh số là dòng tiếp của câu đó. Câu không ảnh: in xuống dòng trong cùng một câu (vd câu gốc rồi `He used to ___ .` ở bài viết lại câu). Câu có `[ảnh: …]`: mỗi dòng là một dòng của ô nhiều dòng (như bài Read and underline).
- **Kiểu chữ (v80):** `**đậm**`, `*nghiêng*`, `<u>gạch chân</u>`. Dùng được trong câu, lựa chọn, `Hướng dẫn:`, bài đọc, lời hội thoại, ô bảng, khung từ; lồng nhau được (`**<u>park</u>**` = vừa đậm vừa gạch chân). Chỉ dùng khi **ý nghĩa của bài cần** (từ bị gạch chân trong đề "closest in meaning to the underlined word", từ gốc in đậm trong ngoặc `(**POLLUTE**)`), không dùng để trang trí. Dấu thiếu cặp thì hiện nguyên là chữ (`**a`), và `*` có dấu cách hai bên (`a * b`) không phải nghiêng. **Không viết gạch chân bằng `__x__`** (app đổi mọi `__` thành chỗ trống `___`); riêng trong `Bài đọc:` thì `__x__` vẫn nhận (từ v75). Chỗ trống `___` không bao giờ nằm trong cặp dấu.
- **Task viết đoạn / viết tự do (v80):** không có câu nào, chỉ `Hướng dẫn:` + `Trả lời: viết câu` + `Dòng viết: N` (N tới 20). App dựng một khung viết N dòng, **không số câu, không tự thêm ảnh** (muốn có ảnh thì ghi `Ảnh:`). Trước v80 Task như vậy bị hiểu nhầm thành Task “chỉ có ảnh”.
- **Bài bên trong có hai nhóm câu, mỗi nhóm một hướng dẫn riêng (v80):** ví dụ nhóm 1 “… CLOSEST in meaning …” rồi nhóm 2 “… OPPOSITE in meaning …”, số câu bắt đầu lại từ 1. Viết nhóm sau bằng `### Phần:` (xem dưới). Nếu quên, app tự nhận ra khi thấy **một dòng chữ không đánh số, đứng sau dòng trống, ngay trước câu `1.`**: tách nó thành phần mới, dùng dòng đó làm `Hướng dẫn:`, kế thừa `Trả lời:` của phần trên, và **ghi chú ở bảng nhận diện** để người dùng kiểm tra. Cách này chỉ là lưới an toàn, nên viết `### Phần:` rõ ràng.
- **Bài đọc:** dòng `Bài đọc:` rồi các đoạn văn; **dòng trống giữa hai đoạn = sang đoạn mới** (giữ trên phiếu). Hết bài đọc khi gặp câu đánh số, lựa chọn, dòng bảng hoặc dòng trường.
- **Hội thoại:** dòng `Hội thoại:` rồi mỗi lượt một dòng `Tên: lời`. **Chỉ nhận hội thoại qua khối này** (từ v67): câu đánh số dạng `Place of the party: ___` là câu điền, không phải lời người nói. Tên được có số (“Students 1 and 2”). Có `___` thì thành điền chỗ trống, không có thì không có chỗ trả lời.
- **Bảng:** các dòng ô cách nhau bằng ` | ` (hoặc Tab). Dòng đầu là tiêu đề cột (ô đầu là góc bảng). Ô trống = để học sinh viết; `[ ]` = ô tick; `[ảnh: tên]` = ô ảnh.
- **(v104) Xuống dòng trong ô bảng:** viết `<br>` (vd `- A big (1) ___ on the beach<br>- Facilities:<br>+ No toilets`). Trên trang mỗi dòng là một dòng riêng; ô soạn bảng ở cột trái dùng cùng ký hiệu; xuất MD ghi lại `<br>`.
- **Ô chữ giải đố (crossword):** dòng `Crossword:` rồi mỗi dòng một hàng; `#` = không có ô, `.` = ô trống chưa có đáp án, chữ cái = ô có đáp án, `(a)` = chữ cho sẵn. Số 1, 2, 3 app tự đánh. Lời gợi ý ngang / dọc đưa vào `Hướng dẫn:` hoặc văn bản kèm (chưa có cú pháp riêng; sẽ làm ở bước MD cho G-Text).
- **Ô chữ (word search):** dòng `Ô chữ:` rồi mỗi dòng một hàng chữ cái (`SUNLIGHT…` hoặc `S U N L …`). Thành bảng chữ cái không tiêu đề, không số, căn giữa; dùng kèm `Khung từ:` cho danh sách từ cần tìm.
- **Chỉ có ảnh** (tô màu, vẽ): chỉ ghi `Ảnh:` và `Trả lời: không`, không có câu. (Task không có câu mà ghi `Trả lời: viết câu` là Task viết đoạn, xem trên.)
- Dòng trống giữa các phần không bắt buộc, chỉ để dễ đọc.
- **Mỗi `## Task` và mỗi `### Phần` chỉ có một loại chỗ trả lời.** Bài gốc có nhiều phần với chỗ trả lời khác nhau (vd điền bảng + tick một ý + hoàn thành câu) vẫn là **một** bài: phần đầu nằm ngay dưới `## Task:`, các phần sau mở bằng `### Phần: <tên phần>`.
  - Mỗi phần có `Hướng dẫn:` và `Trả lời:` riêng. `Hướng dẫn:` chỉ ghi khi PDF có câu lệnh riêng cho phần đó; **không chép lại hướng dẫn của phần trước**; bỏ trống thì phần đó không có dòng hướng dẫn.
  - Trên phiếu: phần nối không có số và tiêu đề (chỉ hiện hướng dẫn riêng nếu có), luôn đi liền phần trên, cách trên bằng khoảng cách “Giữa các nhóm” (không phải “Giữa các Task”). Bảng nhận diện và cột trái ghi 6a, 6b, 6c.
  - Dữ liệu: mỗi phần là một Task có `layout.break = "join"` (lựa chọn thứ 4 của mục Ngắt trang; người dùng có thể bật / tắt bằng nút ↳ “Nối vào Task trên” ở cột trái). Task đầu phiếu không nối được.
  - Một ý “chọn một trong các từ rồi viết” dùng `Khung từ:` + `điền chỗ trống`, không cần chia phần.

## 4c. Câu ví dụ, dòng chữ giữa các câu, khối tự do, đoạn có nhãn (v81)

```
Dạng: điền từ
0. This is a ___ .                 ← câu ví dụ: số 0, đáp án in sẵn (đáp án ở "0." trong ## Đáp án)
1. I have a ___ .
> Part B: in the living room       ← dòng chữ giữa các câu: không số, không chỗ trả lời, không làm đổi số câu
2. She has a ___ .
Khối chữ:
  Remember: use capital letters.   ← các dòng thụt lề = nội dung khối chữ (giữ xuống dòng)
  Look at the pictures first.
Khối ảnh trên: bản đồ khu vườn
```
- **Câu ví dụ** chỉ một câu mỗi Task, viết đúng cách như các câu khác (lựa chọn, ảnh, `___`…). Số câu thật vẫn bắt đầu từ 1.
- **Dòng chữ `> `** dùng cho tiêu đề nhóm câu nhỏ ngay trong một Task. Nhóm có hướng dẫn riêng và số câu bắt đầu lại từ 1 thì vẫn dùng `### Phần:`.
- **Đoạn có nhãn trong bài đọc** (bài nối tiêu đề với đoạn): viết `A. <đoạn>` mỗi đoạn một dòng (đoạn từ 8 từ trở lên). App giữ là đoạn văn và in chữ A, B, C đậm ở đầu đoạn; không hiểu nhầm thành lựa chọn.
- **Khối chữ / khối ảnh** nằm ngang cả Task, không số, không đáp án; nhiều khối thì theo thứ tự viết.

## 4b. Những dòng app tự bỏ hoặc chuyển chỗ (v67)
Phiếu gốc có “giàn giáo” cho học sinh viết; app tự vẽ chỗ trả lời theo `Trả lời:`, nên các dòng này **không cần chép**. Nếu có, app xử lý và ghi chú ở dòng Task trong bảng nhận diện:
| Dòng trong MD | App làm gì |
|---|---|
| `Nội dung:`, `Content:`, `Câu hỏi:` (dòng chỉ có nhãn) | bỏ, không thành câu |
| dòng chỉ có nhãn khác (`Xxx:` không có gì sau) | bỏ, **có ghi chú** |
| `My answer: A / B / C`, `Answer: A / B / C` | bỏ (đáp án khoanh đã có) |
| dòng chỉ có gạch / chấm (`_______`, `.......`) | bỏ (dòng viết do app vẽ) |
| `___` ở **cuối** câu khi `Trả lời:` là đúng/sai, viết câu, viết từ | bỏ gạch (tránh trùng chỗ trả lời); `Nhãn: ___` và câu khoanh A/B/C (“She is a ___. A. … B. …”) thì giữ |
| dòng chữ thường nằm **sau câu cuối** (không đánh số, không có chỗ trả lời) | nối vào hướng dẫn, như `Ghi chú:` |
Cảnh báo mới trong bảng nhận diện (cho cả JSON): câu lỗi chữ (`undefined`), câu trông giống tiêu đề (kết thúc bằng `:`), gạch `___` trùng với chỗ trả lời riêng, câu còn ký hiệu ô tick.

## 5. Phần đáp án (`## Đáp án`, cuối file)

Hai cách viết, dùng lẫn được:
```
## Đáp án
### Task 1          ← số của bài trong file (bài nhiều phần chỉ đếm một lần)
1. cat
2. dog
Task 2: is; are; an ← một dòng, các đáp án cách nhau bằng dấu ;
```
- **Câu ví dụ (v81):** dòng `0. …` là đáp án mẫu, **in sẵn trên phiếu**. Các dòng `1.`, `2.` … chỉ đếm câu thật (bỏ câu ví dụ và dòng chữ `> `). Cách một dòng: `Task 1: 0. book; pen; bag`.
- **Chỗ trống của bài đọc (v81):** trong `### Task n` viết `Chỗ trống: am, go, play` (giống trường `Đáp án chỗ trống:` ở đề).
- Đáp án được ghi vào trường “đáp án đúng” của từng câu (`key`), **không** hiện trên phiếu học sinh (trừ câu ví dụ). Câu thiếu đáp án thì thẻ dạng bài cảnh báo như khi soạn tay.
- **Bài nhiều phần:** `### Task 6` liệt kê đáp án **liền nhau qua các phần, theo thứ tự câu** (vd phần đầu 4 câu, phần sau 1 câu, phần cuối 1 câu → 6 dòng); thừa dòng thì app ghi chú.
- Chưa nhận đáp án cho **bảng** và **ô chữ** (bỏ qua, có báo).
- **(v89) Chọn trong câu:** đáp án ghi luôn trong câu bằng dấu `*` trước vế đúng: `She {*goes|go} to school and {play|*plays} football.` Mỗi nhóm `{…}` một đáp án; không cần dòng ở `## Đáp án`. Ghi đáp án ở `## Đáp án` như cũ vẫn được (app tự đổi sang `*` khi khớp đúng một vế).
- **(v91) Câu nhiều chỗ trống:** một dòng đáp án, các chỗ trống cách nhau ` | `: `3. went | played`.
- **(v92) Bảng:** ô học sinh điền có đáp án viết `=đáp án` ngay trong ô (`| Tom | 9 | =swimming |`); phiếu in ô trống.
- **(v90, v93) Bài nối:** cặp viết cạnh nhau là cặp đúng chỉ khi Task có dòng `Xáo vế phải: có` (app xáo vế phải khi in). Không có dòng này thì giữ thứ tự như PDF (Tắt xáo).
- **(v93)** `Chữ câu hỏi: đậm` = chữ câu hỏi in đậm; `Khối ảnh: tên (3 ảnh)` = khối ảnh tự do có 3 ảnh cạnh nhau.

## 6. Khi app đọc MD
- Mỗi `## Task` thành một dòng trong **bảng nhận diện**: số theo file, tiêu đề, mô tả cấu hình, số câu/hàng, cảnh báo (thiếu ảnh, khung từ không khớp chỗ trống, thiếu đáp án…), cuối bảng có ước tính số trang. Dòng tóm tắt đầu bảng đếm **bài** (không đếm phần): “6 Task (Task 6 có 3 phần)”; mỗi phần là một dòng ghi 6a, 6b, 6c. Nếu số này khác số bài trong PDF thì AI đã tách / gộp nhầm.
- Trường không hiểu, `Trả lời:` không hợp nội dung, `Mẫu:` không có: app giữ cấu hình đoán và ghi chú ngay ở dòng Task đó.
- Task không dựng được thì dòng đỏ: + Task bỏ qua Task đó, + Phiếu không cho tạo (sửa file rồi nạp lại). Phiếu đang mở không bao giờ bị đổi khi có lỗi.
- **+ Task** nhập một lô mà phần nối đứng đầu lô: app bỏ trạng thái nối của nó (không dính vào Task cuối của phiếu đang mở).
- Hàm `sheetToMd(ws)` / `taskToMd(t)` trong app xuất phiếu đang mở ra MD theo đúng quy ước này, phần nối xuất thành `### Phần:` (nút **Xuất MD** ở thanh trên từ v70; dùng làm mẫu). Khứ hồi 18 Task mẫu: MD → app giữ đúng 18/18 cấu hình (mô tả, số câu, loại đáp án, bố cục).

---

## Ví dụ 1 — phiếu “Wonders of the Sea” (nhóm Students 1 and 2)
Ô chữ + khung từ, viết gợi ý 2 dòng, hội thoại. File: `tests/md/sea.md`. Đọc ra đúng 3 Task đầu của `tests/ws-sea-sample.json`. Nhóm Students 3 and 4 là một file riêng (cùng cấu trúc).

```markdown
# Wonders of the Sea (Our World 4, WS 6.1) – Students 1 and 2
Tuổi: 7-9

## Task: Students 1 and 2: Work with a friend. Find and circle the words in the puzzle.
Khung từ: dolphin, sea sponges, squid, fish, creature, sunlight, disappear, layer
Ô chữ:
SUNLIGHTLODA
EORMIDOLPHIN
ASCECIGHTSSR
SENTURTLEIAE
PAOSOLEUAFPS
ONCQCPWARYPO
NSEUEYUHTTEU
GHFISHISHUAR
EMIDNIGHTLRC
SHARKSEZONEE

## Task: Work with your friend. Prepare clues for the words you found in Activity 1.
Hướng dẫn: Look at the pictures on pages 90 and 91 of your book if you need help. Example: It’s smaller than a whale. It lives in the sunlight zone. (dolphin)
Trả lời: viết câu
Dòng viết: 2
1. Clue 1:
2. Clue 2:
3. Clue 3:

## Task: Join students 3 and 4. Give the clues to your friends. Take turns.
Hướng dẫn: Listen to the clues and find the words in your puzzle.
Hội thoại:
Students 1 and 2: Here’s our first clue. It’s smaller than a whale. It lives in the sunlight zone.
Students 3 and 4: Is it a dolphin?
Students 1 and 2: Yes, it is. Where is it in the puzzle?
```

## Ví dụ 2 — phiếu ôn tập trộn dạng, có đáp án
Ảnh mỗi câu viết từ, khoanh A/B/C, điền chỗ trống + khung từ, Đúng/Sai + ảnh chung, bài đọc. File: `tests/md/mau-tron.md`.

```markdown
# Unit 3 · My home – ôn tập
Tuổi: 7-9
Khoảng cách: vừa

## Task: Look and write.
Hướng dẫn: Look at the pictures. Write the words.
Trả lời: viết từ
1. [ảnh: cat]
2. [ảnh: dog]
3. [ảnh: fish]
4. [ảnh: bird]

## Task: Choose the correct answer.
Hướng dẫn: Circle a, b or c.
1. She ___ a teacher. A. am B. is C. are
2. They ___ playing football. A. is B. are C. be
3. I have ___ apple in my bag. A. a B. an C. the

## Task: Complete the sentences.
Hướng dẫn: Use the words in the box.
Khung từ: kitchen, garden, bedroom
1. We cook dinner in the ___.
2. I sleep in my ___.
3. Flowers grow in the ___.

## Task: Look at the picture. True or False?
Hướng dẫn: Circle T (true) or F (false).
Ảnh: the park
Trả lời: đúng/sai
1. There are three children in the park.
2. The dog is under the tree.
3. It is a sunny day.

## Task: Read and answer.
Hướng dẫn: Read the text. Answer the questions.
Ảnh: Lucy and Max
Bài đọc:
My name is Lucy. I am nine years old. I live in a small house with my mum, my dad and my brother Ben.
We have a dog. His name is Max. Max is brown and white. Every morning, Ben and I walk Max in the park.
1. How old is Lucy?
2. What is the dog's name?
3. Where do they walk Max?

## Đáp án
### Task 1
1. cat
2. dog
3. fish
4. bird
Task 2: is; are; an
Task 3: kitchen; bedroom; garden
Task 4: T; F; T
### Task 5
1. She is nine years old.
2. His name is Max.
3. In the park.
```

## Ví dụ 3 — nghe, bảng, nối, hội thoại, chọn trong câu, tô màu
File: `tests/md/nghe-bang.md`.

```markdown
# Listening and reading – Unit 5
Tuổi: 10-12
Xếp trang: liền

## Task: Listen and complete the table.
Track: Track 12
Hướng dẫn: Write one or two words. There is one example.
Name | Age | Hobby
Tom | 9 | football
Lily |  |
Ben |  |

## Task: Match.
Hướng dẫn: Draw a line from the animal to its sound.
Trả lời: nối
1. cat - meow
2. dog - woof
3. cow - moo

## Task: Complete the conversation.
Hướng dẫn: Write one letter in each gap.
Khung từ: Le Loi School., I usually ride my bike., Yes. The teachers are friendly.
Lời dẫn: Mai is talking to Ben about his new school.
Hội thoại:
Mai: Hi, Ben. Do you like your new school?
Ben: ___
Mai: Which school do you go to?
Ben: ___
Mai: How do you get there?
Ben: ___

## Task: Read and underline.
Hướng dẫn: Underline the correct word.
Trả lời: chọn trong câu
1. It’s {windy|rainy}. Take your raincoat {on|off}.
2. It’s {cloudy|sunny}. Put your {swimming costume|coat} on.

## Task: Listen and colour.
Track: Track 08
Hướng dẫn: Listen to the teacher. Colour the picture.
Ảnh: the classroom
Trả lời: không

## Đáp án
Task 2: meow; woof; moo
Task 4: rainy, on; sunny, swimming costume
```

## Ví dụ 4 — phiếu đọc thật “A Surprise Birthday Party” (Cambridge A1 Movers), 6 bài, bài 6 có 3 phần
Phiếu thật dùng để kiểm thử. PDF gốc ở `tests/real/` (cùng chỗ với `birthday.pdf`). File: `tests/md/birthday6.md` (đúng 6 `## Task`; bài 6 = `## Task` + 2 `### Phần`). Đầu / cuối trang (Name/Class, tên phiếu lặp lại, thời gian từng bài, “Before you read”) không chép. Bản MD người dùng nhận từ AI theo prompt v67 (tách bài 6 thành 3 Task, thành 8 Task, lặp hướng dẫn) ở `tests/real/birthday-user2.md`, giữ nguyên làm mẫu lỗi.

```markdown
# A Surprise Birthday Party
Tuổi: 7-9

## Task: Look & Predict
Hướng dẫn: Look at the title. What do you think you will see in the story? Tick (✓) two.
Trả lời: tick
Ghi chú: Your ideas are predictions. Check them after reading.
☐ a cake ☐ a football ☐ balloons

## Task: Read & Choose the Main Idea
Hướng dẫn: Read the story. Then choose the best summary (A, B or C).
Trả lời: khoanh A/B/C
Bài đọc:
On Saturday morning, Lily was at home with her mum. … Lily's dad brought some presents.

At two o'clock, Lily's mum said, "Let's visit Ben." … Lily was very surprised.

But then their dog Max jumped onto a chair and took a sandwich! … her friends made her day special.

1. A. Lily and her friends made a cake at school.
   B. Lily’s friends planned a party, and something funny happened.
   C. Lily went to a party, but no one came.

## Task: True or False?
Hướng dẫn: Read again. Write T (True) or F (False).
Trả lời: đúng/sai
1. Lily thought everyone was busy on her birthday.
2. Ben and his friends prepared the party at Lily’s house.

## Task: Find the Details
Hướng dẫn: Answer with one word or a short phrase.
Trả lời: viết câu
Dòng viết: 1
1. Where did the friends prepare the party?
2. What time did Lily visit Ben?

## Task: Choose & Think
Hướng dẫn: Use clues in the story. Circle the best answer.
Trả lời: khoanh A/B/C
1. Why was the room dark when Lily opened the door?
   A. The friends wanted to surprise her.
   B. The friends were sleeping.
   C. Ben was not at home.

## Task: Story Map & My Idea
Hướng dẫn: Complete the story map with words from the story.
Trả lời: điền chỗ trống
1. Place of the party: ___
2. Food at the party (two things): ___

### Phần: My Idea – Tick One
Hướng dẫn: Which party activity would you like best? Tick one and finish the sentence.
Trả lời: tick
☐ eating cake ☐ playing games ☐ singing songs

### Phần: My Idea – Finish the Sentence
Trả lời: điền chỗ trống
1. I would like ___ because ___.
```
(Ví dụ rút gọn bằng “…”; file đầy đủ ở `tests/md/birthday6.md`. `tests/md/birthday.md` là bản v67 tách bài 6 thành Task 6 và 7, vẫn đọc được.)

## Ví dụ 5 — cú pháp v81 (mẫu do Claude viết để kiểm thử, `tests/md/v81-cu-phap.md`)

```markdown
# Phiếu thử cú pháp v81
Tuổi: 7-9

## Task: Look and write
Hướng dẫn: Look at the pictures. Write the words.
Ảnh: phòng ngủ; phòng khách
Dạng: điền từ
0. This is a ___ .
1. I have a ___ .
> Part B: in the living room
2. She has a ___ .

## Task: Read and answer
Bài đọc:
A. Tom lives in a small house near the park.
B. He has a dog called Max. Max is brown.

Dạng: đúng/sai (Yes/No)
Thứ tự: câu hỏi trước
1. Tom lives in a big house.
2. Max is a dog.

## Task: Find the mistake
Dạng: chọn trong câu (nhãn A-D)
1. She <u>go</u> to <u>school</u> every <u>day</u> by <u>bus</u>.

## Task: Draw your room
Hướng dẫn: Draw your bedroom.
Dạng: viết tự do (khung vẽ)

## Task: Write the words
Dạng: viết câu
Dòng kẻ: bốn ô li
1. cat
2. dog

## Task: Choose the fruit
Khung từ ảnh: apple, banana, cherry
Vị trí khung từ: dưới
Khối chữ:
  Remember: use capital letters.
Khối ảnh trên: bản đồ khu vườn
Dạng: điền từ
1. I like ___ .

## Task: Look at the town
Ảnh: thành phố
Bố cục: ảnh trái
Điểm trên ảnh: 20 30; 50 60 (ô trống)
Dạng: viết câu
1. What is number 1?

## Đáp án
### Task 1
0. book
1. pen
2. bag
Task 2: No; Yes
```
Xuất MD (nút **Xuất MD**) ghi đủ các trường v81 khi phiếu dùng chúng; đọc lại ra đúng phiếu (test30).

**Lưu ý đáp án (v1.1 gói tạo bài):** bộ đọc coi mọi thứ sau `## Đáp án` là đáp án cho tới `## Task` kế tiếp; một dòng dạng `Task N: a; b` ghi đè khóa của Task N. Vì vậy nếu dán cả phản hồi của AI (có NOTES/REPORT) thì các dòng bắt đầu bằng `Task <số>:` sẽ làm hỏng đáp án. Gói v1.1 tránh bằng dòng `### Task 0` cuối khối và ghi chú `T1:`.
