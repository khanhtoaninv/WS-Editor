# Tài liệu 2. Chuẩn gói phiếu v0 (`.wsp`)

> Bản nháp **v0** · 27/10/2026 · Hợp đồng giữa WS Editor (bên xuất) và TeacherResource (bên nhập). Kiến trúc chung: `1_TONG_QUAN_KIEN_TRUC.md`.
> Khi chuẩn này và mã nguồn lệch nhau, **lược đồ trong gói dùng chung `ws-shared`** là nguồn sự thật; tài liệu này phải được sửa theo.

## 1. Nguyên tắc

1. **Tự đủ.** Gói chứa mọi thứ để hiển thị, tương tác và chấm: trang đã dàn, phông chữ, ảnh, chỗ trả lời, đáp án, cách chấm. Bên nhập không cần WS Editor, không cần dàn lại trang.
2. **Không đoán.** Mọi trường có nghĩa rõ ràng; giá trị lạ thì bên nhập **từ chối** và báo lỗi, không tự sửa.
3. **Ổn định.** Mã Task, mã câu, mã chỗ trả lời không đổi khi người soạn chỉ sửa chữ, cỡ, khoảng cách.
4. **Tách đề và đáp án.** Hai khối riêng để bên nhập giữ đáp án ở máy chủ.
5. **Có phiên bản chuẩn.** Mỗi gói ghi `format: "wsp/0"`; bên nhập biết mình đọc được phiên bản nào.

## 2. Cấu trúc file

Một file `.wsp` = **phong bì** (đọc được, không mã hóa) + **lõi** (mã hóa).

```
.wsp
├── envelope.json          ← đọc được: định dạng, mã phiếu, phiên bản, keyId, chữ ký
└── payload.bin            ← lõi mã hóa (AES-GCM), giải mã ra một ZIP:
    ├── manifest.json      ← meta + danh sách file + hash từng file
    ├── pages/
    │   ├── style.css      ← CSS trang (đã gom từ WS Editor, chỉ phần trang A4)
    │   ├── p1.html        ← nội dung trang 1 (đoạn HTML, không script)
    │   └── p2.html …
    ├── fonts/*.woff2      ← chỉ các phông phiếu dùng
    ├── media/*            ← ảnh (png / jpg / webp / svg đã làm sạch)
    ├── slots.json         ← khối ĐỀ: chỗ trả lời, vị trí, loại tương tác, phương án
    ├── key.json           ← khối ĐÁP ÁN: đáp án, giải thích, cách chấm, điểm
    └── source.json        ← phiếu gốc WS Editor (JSON ws-editor/0.x) để mở lại mà sửa
```

**`envelope.json`**
```json
{
  "format": "wsp/0",
  "sheetId": "ws-abc123",
  "version": 3,
  "title": "Unit 5 · Daily routines",
  "createdAt": "2026-10-27T15:00:00Z",
  "producer": "WS Editor v115",
  "keyId": "ws-sign-2026-01",
  "wrappedKeys": { "tr": "<khóa nội dung bọc bằng khóa công khai TeacherResource>", "ed": "<bọc bằng khóa WS Editor>" },
  "payloadSha256": "…",
  "signature": "<Ed25519 trên (envelope không có signature) + payloadSha256>"
}
```

- Bên nhập PHẢI kiểm chữ ký **trước** khi giải mã. Sai chữ ký → từ chối.
- `title` nằm ở phong bì để danh sách gói hiện được tên mà không giải mã; không chứa đáp án.

## 3. `manifest.json` (meta)

| Trường | Kiểu | Ý nghĩa |
|---|---|---|
| `format` | `"wsp/0"` | Trùng phong bì |
| `sheetId`, `version` | string, int | Trùng phong bì |
| `title`, `age`, `level?`, `tags?` | | Thông tin phiếu (lấy từ phiếu WS Editor) |
| `pageSize` | `{wMm:210,hMm:297}` | Khổ trang |
| `pages` | `[{file:"pages/p1.html", heightMm:297}]` | Thứ tự trang |
| `contentHash` | string | Hash của **đề** (pages + slots không tính đáp án). Cùng `contentHash` = cùng đề → cho phép "chấm lại" (Tài liệu 1 mục 7) |
| `keyHash` | string | Hash của `key.json` |
| `files` | `{path: sha256}` | Mọi file trong lõi; bên nhập kiểm từng file |
| `stats` | `{tasks, slots, autoGraded, manualGraded, staticOnly}` | Để báo cáo khi import |

## 4. Trang (đề đã dàn sẵn)

- Mỗi trang là **một đoạn HTML tĩnh** do WS Editor dàn: đúng như bản in. Không `<script>`, không thuộc tính sự kiện (`on*`), không đường dẫn ngoài; ảnh trỏ `media/…`; phông trỏ `fonts/…`. WS Editor làm sạch khi xuất, bên nhập kiểm lại (PHẢI).
- Trang dùng đơn vị mm (như WS Editor). Trình xem đặt trang vào khung kích thước cố định rồi thu phóng bằng `transform: scale`.
- **Chỗ trả lời trong HTML:** mỗi phần tử là chỗ trả lời mang `data-ans="<slotId>"` (GĐ0 đổi tên từ `data-slot` vì `data-slot` đã dùng cho ô ảnh `.pic`). Trình xem tìm theo thuộc tính này để phủ ô nhập / nút chọn đúng chỗ. Không dùng tọa độ tuyệt đối làm nguồn chính (tọa độ trong `slots.json` chỉ để kiểm tra và cho máy chủ vẽ báo cáo).
- Bản đáp án in sẵn (câu ví dụ `ex`, số 0) giữ nguyên trên trang, không phải chỗ trả lời.
- Đáp án **không bao giờ** có trong HTML trang (kể cả ẩn bằng CSS). Phần hiển thị đáp án do trình xem vẽ từ `key.json` khi được phép.

## 5. Chỗ trả lời (`slots.json`, khối đề)

### 5.1 Mã ổn định
```
slotId = "<taskId>.<itemId>"            # câu có một chỗ trả lời
       | "<taskId>.<itemId>.<n>"        # chỗ thứ n trong câu (n từ 1)
       | "<taskId>.lead.<n>"            # chỗ trống trong bài đọc
       | "<taskId>.leadc.<n>"           # nhóm chọn {a|b} trong bài đọc
       | "<taskId>.cell.<rowId>.<c>"    # ô bảng / ô chữ (Q10, Q11), c = chỉ số cột từ 0
       | "<taskId>.cell.<rowId>"        # hàng tick của bảng (chọn một / nhiều ô trong hàng)
       | "<taskId>.<leftItemId>"        # vế trái bài nối (Q8); phương án = id các câu (vế phải)
```
(GĐ0 đã làm, 27/10: bài nối không dùng tiền tố `pair.`; câu hội thoại đánh nhãn `(1)`, `(2)`… theo chỗ trống, bỏ lượt không có chỗ trống.)
- **Nhiều đáp án đúng cho một chỗ viết:** trong WS Editor ghi cách nhau ` / ` (có dấu cách hai bên): `isn't / is not` → `accept: ["isn't","is not"]`. Dấu `/` không có cách (`and/or`) giữ nguyên là chữ.
- **Câu chưa có đáp án** → chỗ đó `grading: "manual"`, kèm cảnh báo; không đoán.
`taskId`, `itemId` là `id` sẵn có trong JSON WS Editor (`t1`, `i3`…). WS Editor PHẢI giữ các id này khi người soạn sửa chữ, đổi thứ tự (đổi thứ tự không đổi id).

### 5.2 Một chỗ trả lời
```json
{
  "id": "t2.i3.1",
  "task": "t2", "item": "i3", "label": "3",
  "page": 1, "boxMm": [24.0, 118.5, 30.0, 6.0],
  "interaction": "text",
  "options": null,
  "maxLength": 60,
  "grading": "auto"
}
```

| Trường | Ý nghĩa |
|---|---|
| `label` | Số câu như in trên phiếu (để báo cáo "Bài 2 câu 3") |
| `page`, `boxMm` | Vị trí trên trang (x, y, rộng, cao, mm) |
| `interaction` | Một trong bảng 5.3 |
| `options` | Với dạng chọn: `[{id:"a", text:"go"}, …]` hoặc `[{id:"a", img:"media/cat.webp"}]`. **Không** đánh dấu đúng |
| `grading` | `auto` / `manual` / `none` (để bên nhập biết trước khi đọc khóa; khối khóa vẫn là nguồn chấm) |

### 5.3 Loại tương tác

| `interaction` | Học sinh làm | Giá trị bài làm |
|---|---|---|
| `text` | Gõ chữ vào chỗ trống / dòng | chuỗi |
| `text-long` | Gõ nhiều dòng (viết câu, đoạn) | chuỗi |
| `choice-one` | Bấm một phương án | `optionId` |
| `choice-many` | Bấm nhiều phương án | `optionId[]` (sắp xếp) |
| `tf` | Bấm một nhãn (T/F, True/False, Yes/No, T/F/NG, Right/Wrong) | nhãn |
| `match` | Chọn vế phải cho vế trái (hộp chọn hoặc kéo nối) | `optionId` của vế phải |
| `cell` | Gõ vào ô bảng / ô chữ | chuỗi |
| `draw` | Vẽ / tô (Q9, Q12 khung vẽ) | nét vẽ (JSON) |
| `static` | Không tương tác (hiển thị như bản in) | — |

## 6. Khối đáp án (`key.json`)

```json
{
  "t2.i3.1": { "type": "text", "accept": ["goes"], "score": 1, "explain": "He/She + goes" },
  "t3.i1":   { "type": "choice-one", "correct": "b", "score": 1 },
  "t3.i4":   { "type": "choice-many", "correct": ["a","c"], "scoring": "all-or-nothing", "score": 1 },
  "t4.i2":   { "type": "tf", "correct": "F", "score": 1 },
  "t5.pair.i1": { "type": "match", "correct": "r3", "score": 1 },
  "t6.i1":   { "type": "text-long", "grading": "manual", "sample": "She usually walks to school.", "score": 2 }
}
```

### 6.1 Ánh xạ 12 dạng Q của WS Editor

| Q | Dạng | Chỗ trả lời | `interaction` | Đáp án lấy từ (WS Editor) | Chấm |
|---|---|---|---|---|---|
| Q1 | Điền từ | mỗi `___` một chỗ; chỗ trống bài đọc `lead.n` | `text` (có khung từ: `choice-one` với phương án = khung từ, NÊN) | `key` ("went \| played" tách theo `\|`), `lead.keys` | tự động, danh sách chấp nhận |
| Q2 | Viết câu | một chỗ / câu | `text-long` | `key` | tự động nếu người soạn đánh dấu "đáp án duy nhất", ngược lại **chấm tay** |
| Q3 | Chọn A/B/C | một / câu | `choice-one` hoặc `choice-many` (key nhiều chữ) | `opts[]` + `key` ("a, c") | tự động |
| Q4 | Chọn trong câu | mỗi nhóm `{…}` một chỗ; tìm lỗi sai: một / câu | `choice-one` | vế có `*`; tìm lỗi sai: `key` chữ cái | tự động |
| Q5 | Đúng / Sai | một / câu | `tf` (ô tick: `choice-one`) | `key` + `params.labs` | tự động |
| Q6 | Nhìn ảnh viết | một / câu (hoặc từng `___`) | `text` | `key` | tự động |
| Q7 | Chọn ảnh | một / câu | `choice-one` (phương án là ảnh) | `key` | tự động |
| Q8 | Nối | một / vế trái | `match` | cặp gõ cạnh nhau + `content.shuffle` | tự động; vế thừa là phương án nhiễu |
| Q9 | Tô chữ | — | `draw` hoặc `static` | không có | **không chấm** |
| Q10 | Bảng | mỗi ô `=chữ` | `cell` | chữ sau `=` | tự động |
| Q11 | Lưới (ô chữ, tìm từ) | ô chữ: mỗi ô hoặc mỗi từ | `cell` / `static` | ô chữ: đáp án ô; tìm từ: **chưa có vị trí** | ô chữ tự động; tìm từ `static` (v0) |
| Q12 | Viết tự do | một / Task | `text-long` hoặc `draw` (khung vẽ) | không có (hoặc bài mẫu) | **chấm tay** |

Chưa hỗ trợ ở v0 (xuất ra `static`, có cảnh báo khi xuất và khi import): ô tick trong bảng, lưới tìm từ, câu hội thoại có cấu trúc lạ mà bộ xuất không xác định được chỗ trả lời. Không bỏ qua im lặng.

### 6.2 Chuẩn hóa khi so khớp chữ
Áp cho cả bài làm và từng mục `accept`, theo thứ tự:
1. Unicode NFC; chữ thường.
2. Nháy cong `’ ‘` → `'`; nháy kép cong → `"`.
3. **Gạch nối, gạch ngang → dấu cách** (để `twenty-one` = `twenty one`).
4. Bỏ dấu câu ở **hai đầu** (`.`, `,`, `!`, `?`, `;`, `:`); giữ dấu câu ở giữa chuỗi trừ khi `"ignorePunct": true`.
5. Gộp khoảng trắng; cắt hai đầu.

Không tự mở rộng viết tắt (`don't` ≠ `do not`): người soạn thêm vào `accept` nếu muốn. Mỗi mục `key` CÓ THỂ có `"caseSensitive": true` (tên riêng) hoặc `"ignorePunct"`.

Không dùng so khớp "chứa" (đặc tả tham khảo đề xuất cho câu ngắn) vì cho đúng cả câu sai.

### 6.3 Điểm
- Mặc định mỗi chỗ trả lời `score: 1`. Người soạn CÓ THỂ đặt điểm theo Task (chia đều cho các chỗ).
- `choice-many`: `scoring` = `all-or-nothing` (mặc định) hoặc `partial` (đúng thêm, sai trừ, tối thiểu 0).
- Chấm tay: giáo viên nhập điểm 0..`score`, có nhận xét.
- Bỏ trống = 0 điểm, ghi riêng trạng thái "bỏ trống" để thống kê.

## 7. Dạng chưa hỗ trợ
- Bộ xuất PHẢI liệt kê trong `manifest.stats.staticOnly` và in cảnh báo cho người soạn: "Task 4 (Lưới tìm từ): học sinh chỉ xem, không làm được trên máy."
- Bên nhập hiển thị lại cảnh báo này khi import.

## 8. Bài làm và kết quả (dùng chung editor, trình xem, máy chủ)

```json
// Bài làm
{ "sheetId": "ws-abc123", "version": 3, "contentHash": "…",
  "answers": { "t2.i3.1": "goes", "t3.i1": "b", "t3.i4": ["a","c"] },
  "drawings": { "t9.i1": [ … ] },
  "updatedAt": "…", "submittedAt": null }

// Kết quả (do hàm chấm trả về)
{ "score": 14, "max": 18, "autoScore": 12, "pendingManual": 1,
  "perSlot": { "t2.i3.1": { "status": "correct", "score": 1 },
               "t3.i1":   { "status": "wrong",   "score": 0 },
               "t6.i1":   { "status": "pending", "score": null },
               "t4.i2":   { "status": "blank",   "score": 0 } } }
```

- `status`: `correct` / `wrong` / `partial` / `blank` / `pending` (chờ chấm tay) / `ungraded` (không chấm).
- Hàm chấm: `grade(slots, key, answers) → result`, thuần, dùng ở WS Editor (Chấm thử) và máy chủ.
- Giao diện trình xem (gợi ý tên): `mount(el, {pages, slots, mode, answers?, result?, key?, classStats?, labels?, onEvent})`. Sự kiện ra: `answerChanged`, `submitRequested`, `gradeOverride`, `annotationChanged`.

## 9. Kiểm tra khi xuất và khi nhập

| Kiểm tra | Khi xuất (WS Editor) | Khi nhập (TeacherResource) |
|---|---|---|
| Chữ ký, hash từng file | (ký) | PHẢI đúng, sai → từ chối |
| `format` đọc được | | không đọc được → từ chối, báo cần nâng cấp |
| Lược đồ `manifest`, `slots`, `key` | PHẢI qua | PHẢI qua |
| Mỗi `data-ans` trong trang ↔ một mục `slots.json`, và ngược lại | PHẢI khớp | PHẢI khớp |
| Mỗi chỗ `auto` có mục trong `key.json` | thiếu → **chặn xuất**, chỉ ra câu thiếu (dùng lại chip "x/y câu có đáp án" v88) | thiếu → từ chối |
| HTML trang sạch (không script, không `on*`, không URL ngoài) | làm sạch | kiểm lại, vi phạm → từ chối |
| Ảnh, phông được tham chiếu đều có | PHẢI | PHẢI |
| Dạng `static` | cảnh báo, người soạn xác nhận | hiển thị cảnh báo |
| Trang không tràn | dùng kiểm tràn sẵn có | — |

## 10. Lược đồ và bộ mẫu
- Lược đồ viết một lần trong `ws-shared` (Zod hoặc JSON Schema), sinh kiểu TypeScript và hàm kiểm tra.
- Bộ mẫu `ws-shared/fixtures/`: mỗi dạng Q ít nhất một phiếu, kèm **bài làm mẫu** và **kết quả chấm mong đợi**. Hàm chấm ở mọi nơi PHẢI cho ra đúng kết quả mong đợi. Đây là cách AI viết TeacherResource tự kiểm và dev người kiểm nhanh.
- Lấy phiếu thật trong `tests/real/` làm nguồn bộ mẫu.

## 11. Nâng phiên bản chuẩn
- `wsp/0` là bản nháp, được phá vỡ tương thích cho tới khi chốt `wsp/1`.
- Từ `wsp/1`: thêm trường mới (bên nhập bỏ qua trường lạ trong vùng `ext`) là bản phụ; đổi nghĩa / bỏ trường là bản chính mới. Bên nhập PHẢI đọc được mọi bản chính đã phát hành.
- Bài làm lưu kèm `format` của gói để chấm lại về sau dùng đúng quy tắc.
