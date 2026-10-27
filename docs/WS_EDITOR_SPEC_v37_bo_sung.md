# WS Editor — Bổ sung đặc tả v37 → v67 (25/10/2026)

> Bổ sung cho `WS_EDITOR_SPEC.md` (v36). Khi gộp vào spec chính: thay mục 10 "Trình soạn" bằng 10b dưới đây cho phần cột trái, và sửa trạng thái mục 15. Phần nhập file (v63–v65) ở các mục AC–AE; tóm tắt ở mục 16 của spec chính.

## A. Đính chính trạng thái mục 15
Mục 15 trong spec ghi "chưa làm", nhưng **prototype đã có sẵn từ trước v37**: thẻ dạng bài (chip bấm được), danh sách công thức (15 công thức), thư viện "+ Task", hộp "Dán bài…" / "Dán cả đề…", soạn chữ và câu trong cột trái, thêm/xóa/nhân đôi/đổi thứ tự Task, tải ảnh theo ô. **Chưa đối chiếu từng dòng của 15.8** (các phép kiểm), nên chưa đánh dấu hoàn tất; cần một lượt đo riêng.

## B. 10b. Cột trái v37 (thay đổi lần này)

### B1. Task mở một lúc (accordion)
- Cột trái là danh sách Task thu gọn (số, tên dạng bài, layout). **Chỉ một Task mở một lúc**; mở Task khác thì Task cũ tự thu gọn.
- Thu gọn: bấm mũi tên ▶, hoặc bấm lại đúng Task đang mở và đang chọn. Sau khi thu gọn, giữ nguyên cho đến khi chọn sang Task khác.
- Chọn Task bằng cách bấm trên trang A4 cũng mở Task đó trong cột trái. Shift/Ctrl+bấm (chọn nhiều) không đổi trạng thái mở.
- Dòng tiêu đề Task đang mở **dính ở đầu cột** khi cuộn; Task vừa mở được cuộn lên đầu cột.

### B2. Năm khu vực trong Task (thứ tự cố định)
Dưới thanh công cụ (↑ Lên · ↓ Xuống · ⧉ Nhân đôi · ✕ Xóa) là 5 khu vực, mỗi khu vực bấm tiêu đề để mở/đóng, và **tiêu đề hiện tóm tắt** khi đóng:
1. **Dạng bài & đáp án** (mở sẵn): thẻ dạng bài, Công thức, loại Đáp án.
2. **Tiêu đề & hướng dẫn** (mở sẵn): tiêu đề, hướng dẫn, track audio.
3. **Nội dung** (mở sẵn): ảnh chung, bài đọc / lời dẫn, khung từ, tải ảnh, rồi "Danh sách câu/lượt/cặp/từ" hoặc "Bảng".
4. **Thành phần của bài** (đóng sẵn): công tắc bật/tắt các trường. Không hiện ở Task dạng bảng.
5. **Khối trên trang** (đóng sẵn): G0–G4 và các ô con, bấm để chỉnh kích thước ở Inspector.
- Trạng thái mở/đóng của khu vực dùng chung mọi Task và **nhớ trong trình duyệt** (`localStorage` khóa `wsEditor.sections.v1`).
- Đóng/mở khu vực chỉ đổi CSS, **không dựng lại** cột trái, nên không mất con trỏ khi đang gõ.
- Bấm chip "đáp án" trên thẻ: mở Task, mở khu vực 1, nhảy tới ô Đáp án (nếu chỉ có một loại đáp án thì ô bị khóa, con trỏ nhảy tới tiêu đề khu vực).
- "+ Task" từ thư viện: mở Task mới, mở khu vực Nội dung, đặt con trỏ vào ô nhập đầu tiên.
- Hàng "Tải ảnh lên" chuyển vào khu vực Nội dung (không còn hàng rời dưới mỗi Task).

### B3. Độ rộng khung nhập liệu
- Thanh kéo dọc ở mép phải cột trái (`#lsplit`). Kéo để đổi; **bấm đúp** về 300 px; khi đang focus: ←/→ ±20 px (Shift ±60).
- Giới hạn: tối thiểu 240 px, tối đa `max(320, min(720, rộng cửa sổ − 312 − 32 − 24 − 420))` (luôn chừa ≥ ~420 px cho trang A4). Cửa sổ thu nhỏ thì tự kẹp lại.
- Khi kéo chỉ đổi tỉ lệ phóng trang A4 (không dàn lại); thả chuột mới vẽ lại. Nhớ trong trình duyệt (`wsEditor.leftW.v1`). Màn hình ≤ 900 px: ẩn thanh kéo.
- Không ảnh hưởng bố cục in/A4: đã so sánh với v36, số trang, chiều cao từng Task và lỗi tràn giống hệt.

## C. Kiểm thử v37 (Playwright, Chromium)
- So bố cục bản cũ và mới: giống hệt (11 trang, 0 lỗi tràn).
- Mở lần lượt cả 18 Task: luôn đúng một Task mở, đủ khu vực.
- Thu gọn bằng bấm lại hàng và bằng mũi tên; header dính khi cuộn; gõ không mất focus; hoàn tác ghi sau khi rời ô.
- Giữ nguyên chức năng cũ: + Thêm câu, nhân đôi câu, ↑↓ Task, nhân đôi/xóa Task, công tắc thành phần, bảng, bài đọc, chọn khối, + Task từ thư viện, hộp Dán bài, hoàn tác.
- Kéo độ rộng, nhớ sau khi tải lại, bấm đúp về mặc định, phím mũi tên, giới hạn tối đa.
- 0 lỗi console (trừ lỗi tải font trong sandbox).

## E. v38 — Dọn nhiễu giao diện (thay đổi so với B ở trên)
Mục B2 chỉ còn **4 khu vực** (khu vực "Khối trên trang" đã bỏ); chọn G0–G4 và ô con bằng cách bấm trên trang A4 (Esc lên cấp, breadcrumb ở Inspector để lên Task / Phiếu).
1. **Cột trái:** hàng Task không còn nhãn layout; còn hai nút "+ Task" và "Dán…" (một hộp, chọn "Một Task" hoặc "Cả đề" bên trong). Thanh công cụ Task: ↑ ↓ ⧉ ở trái, "✕ Xóa Task" màu đỏ tách riêng ở phải. *(v64: "Dán…" đã bỏ, thay bằng "+ Phiếu"; xem mục AD.)*
2. **Gợi ý dài** (> 64 ký tự) tự gấp thành một dòng có ⓘ ở cột phải và cột trái; bấm để mở/đóng (hàm `tidyHints`).
3. **Panel Phiếu** theo thứ tự: Xếp trang → Khoảng cách → Tự động hóa (Tối ưu bố cục; "Ép vừa [N] trang" + nút Thu; Lấp đầy trang) → mục "Nâng cao" (Mặc định theo dạng bài, Nạp JSON, Quy tắc in). Đã bỏ khối "Hiển thị" (nút Đường dóng ở thanh trên là nơi duy nhất).
4. **Dòng chú thích phím tắt** trên đỉnh trang A4 đã bỏ; thay bằng nút **?** ở thanh trên (bảng thao tác nhanh, Esc để đóng, có công tắc "Hiện mã kỹ thuật", nhớ ở `wsEditor.codes.v1`).
5. **Inspector:** bỏ chip dạng bài (chỉ còn ở khu vực "Dạng bài & đáp án" cột trái); breadcrumb chỉ liệt kê cấp cha, tên mục đang chọn ở tiêu đề.
6. **Mã kỹ thuật** (T1, G0, A1, mã dạng bài…) ẩn mặc định (`.cd`), nút/toast dùng tên dạng bài thay vì mã.
7. **Nút không dùng được thì ẩn** thay vì làm mờ: "Về tự động" (chỉ khi có chỉnh tay), "Áp thông số… cho" (chỉ các phạm vi có đích), "Gắn đáp án" (chỉ khi có ≥ 2 lựa chọn), kiểu đáp án không hợp (gom trong "Kiểu khác không hợp").
8. "Đường dóng", "Xem JSON", "?" ở thanh trên dùng kiểu nhẹ (ghost).
Kiểm thử v38: bố cục 18 Task giống hệt v37 (11 trang, 0 tràn); 2 bộ test Playwright đạt, 0 lỗi console.

## F + G. v41 — Phân cấp thị giác trong khung Task: chỉ trắng / xám (thay F, G cũ)
Nguyên tắc: **không dùng màu để phân cấp** trong khung soạn; chỉ dùng độ đậm nhạt của nền, viền, độ đậm chữ. Màu teal chỉ còn cho lựa chọn nút (nút đang chọn, ô nhập số, thanh trượt) và cảnh báo đỏ.
- 4 tầng nền: nền cột (xám) → **thẻ khu vực** (trắng, viền `--ln2`, bo 10 px) → **thẻ câu** (xám nhạt `--card-2`) → ô nhập (trắng trong thẻ câu, xám nhạt trong thẻ khu vực).
- **Tiêu đề khu vực** đậm 13 px, số 1–4 trong vòng tròn; khu vực **đang mở**: nền xám nhạt, số tròn đặc đen; khu vực đóng: nền trắng, số tròn rỗng; tóm tắt xám bên phải, mũi tên ở cuối.
- **Task đang chọn** ở cột trái: dải **đen/xám đậm** (không còn teal).
- **Câu có chỗ học sinh phải trả lời** (`___`, `{a|b}`, `opts`, `key`; hàm `ansLabel`): thẻ **trắng nổi** (viền đậm hơn, bóng nhẹ, vạch trái đen, số tròn đặc) và nhãn "✎ chỗ trống / chọn trong câu / có lựa chọn / có đáp án đúng"; các câu thường là thẻ xám nhạt phẳng. Tiêu đề danh sách ghi tóm tắt (vd "10 · 5 có chỗ trả lời").
- Hội thoại: tên người nói ở hàng đầu thẻ (đậm, 96 px), lời thoại hàng riêng, không còn màu theo người nói.
- Token: `--card`, `--card-2`, `--ln2` (light và dark).

## H. v41 — Phân cấp chỉ bằng trắng / xám (thay cho mục F–G về màu)
Trong khung Task **không dùng màu nhấn** (teal, cam, xanh, tím); mọi cấp bậc dựa vào nền (`--card` trắng, `--card-2` xám nhạt), độ đậm chữ, viền và độ dày viền:
- Khu vực: thẻ trắng viền `--ln2`; **khu vực mở** có tiêu đề nền xám nhạt, số tròn đặc đen (`--fg`); khu vực đóng có số tròn viền xám.
- Chip dạng bài: nền xám nhạt, chữ đậm; ô nhập focus bằng viền + vòng xám đậm.
- Câu / lượt thường: thẻ nền xám nhạt, viền trái xám. **Câu có chỗ trả lời:** thẻ nền trắng, viền trái đen 4 px, số tròn đặc đen, nhãn "✎ chỗ trống" in đậm. Bỏ màu theo người nói (tên người nói chỉ in đậm).
- Dòng Task đang mở ở đầu khung: nền `--fg` (đen / sáng ở dark mode).
- Phần còn lại của app (Inspector, thanh trên, trang A4) vẫn dùng màu accent như cũ.

## I. v42 — Tạo ảnh bằng popup (gen ảnh) + ô thu nhỏ trong thẻ câu
- **Điểm vào:** (1) ô thu nhỏ ✦ / ảnh nằm đầu hàng "Ảnh" của mỗi thẻ câu (mỗi lựa chọn ảnh của câu multi có một ô; vế trái của cặp nối có ô; "Ảnh chung" có ô); (2) nút "✦ Tạo ảnh…" trong panel Ảnh ở Inspector. Khóa ô giữ nguyên cơ chế cũ: `G1`, `@<id câu>`, `@<id câu>.<j>`.
- **Popup** (`#genDlg`): bên trái khung xem trước đúng **tỉ lệ khung** (1:1, 4:3, 3:4, 16:9, đổi được) và dải các phiên bản đã tạo; bên phải ô **prompt** (điền sẵn tên ảnh của ô), hàng **ảnh tham chiếu** với nút **+** (tối đa 4, bấm ✕ để bỏ), nút Tạo ảnh / Tạo lại (Ctrl+Enter). Chân popup: Tải ảnh từ máy… · Gỡ ảnh (khi đã có ảnh) · Đóng · **Dùng ảnh này** (chỉ bật khi đang xem một ảnh vừa tạo).
- "Dùng ảnh này" đi qua `dropImages` như upload thường: nằm trong lịch sử hoàn tác, có kiểm tra độ mờ khi in. Prompt, ảnh tham chiếu và các phiên bản được **nhớ trong phiên làm việc** theo từng ô (chưa lưu vào JSON; ảnh vẫn chỉ ở bộ nhớ trình duyệt).
- **Nối dịch vụ gen ảnh thật:** gán `window.WSImageGen = { generate: async ({ prompt, refs, ar }) => ({ src: 'data:image/…' }) }` (`refs` = mảng data URL, `ar` = '4/3'…). **Chưa gán thì dùng bản demo** tạo ảnh giả có đóng dấu "DEMO · chưa nối dịch vụ gen ảnh" và popup ghi chú rõ. Khi tích hợp WS Studio: gọi dịch vụ gen của Studio ở hook này và lưu ảnh lên máy chủ (JSON chỉ giữ đường dẫn).

## J. v43 — chỉnh ô ảnh (+, Fit trong popup, chữ dưới ảnh, ảnh trong bảng)
- Ô ảnh chưa có ảnh hiện dấu **+** (không còn ✦).
- Popup ảnh có mục **Hiển thị trong khung** (Bình thường / Fit ngang / Fit dọc, Zoom, Về giữa, kéo ảnh để lệch tâm) CHỈ với ô có khung: ảnh chung G1 và ô ảnh lưới T5. Ghi vào đúng `layout.frame` / `layout.cells[key].frame` qua `setPath`/`cfgOf`, cùng dữ liệu panel Ảnh ở Inspector, không có state thứ hai nên không xung đột. Preview dùng tỉ lệ khung đo từ `.pic[data-slot]` trên trang. Ô không có khung (bảng, cặp nối, `.irow`) không hiện mục này.
- Thẻ câu cột trái: ô chữ nằm ngay dưới ô ảnh (`.imgblk`); lựa chọn ảnh `imgs` mỗi ảnh một chữ riêng (`it.i.imgs.j`); cặp nối có ảnh: ảnh + tên ảnh + chữ dưới ảnh.
- Bảng: hàng có `id` (`ensureRowIds`, chạy trong `render`/`migTask`/thêm hàng); khóa ảnh `@rowId` (đầu hàng) và `@rowId.j` (ô cột j); `slotsOf` có nhánh table; xóa hàng/cột dọn ảnh mồ côi; ô có `[ảnh: tên]` trong `edTable` có thumb +.

## K. v44–v45 — bảng: khung ảnh cố định
- v44: bỏ dòng "Ảnh tải lên n/m" ở Nội dung (đã có ô + trên từng ô ảnh; Inspector vẫn có Tải ảnh lên…, kéo thả vẫn dùng được).
- v45: `content.imgAr` (mặc định 4/3, null = 4/3) là tỉ lệ khung cho MỌI ô ảnh trong bảng; chọn ở mục Nội dung (nút 1:1 / 4:3 / 3:4 / 16:9, act `tblar`). `imgArOf` của bảng trả về tỉ lệ này, nên ô trên phiếu và thumb cột trái không còn co giãn theo ảnh. Tỉ lệ thật của ảnh nằm ở `t.imgAr[key]` (dùng cho Fit).
- Mỗi ô có khung riêng ở `layout.cells['<rowId>' | '<rowId>.<j>'].frame` (fit/zoom/ox/oy); selector `{…, item, tc:1}` → `kindOf` = 'cimg'. Trên phiếu `tpic()` thêm `data-tf` + biến `--iar/--ox/--oy/--z` (CSS `.pic[data-tf]`).
- Popup: nút "Tỉ lệ" bị khóa theo khung bảng; có đủ Fit ngang/dọc, Zoom, Về giữa, kéo lệch tâm. Đổi tỉ lệ bảng không tạo lại ảnh, giữ nguyên Fit/lệch tâm.
- Test cũ "hàng Ảnh tải lên nằm trong Nội dung" (test2) và "ô bảng: không có panel khung" (test4) đã lỗi thời; thay bằng test5.py.

## L. v46 — popup ảnh: chỉnh nháp
- Mọi thao tác trong popup (tạo, tải từ máy, gỡ ảnh, Fit/Zoom/lệch tâm) chỉ là nháp (`genState[...].fd`, `rm`, `results`). Chỉ nút **Dùng ảnh này** mới ghi vào dữ liệu (`genApplyFrame` + `dropImages`/`removeImage`); nút ✕ đóng mà không lưu gì. Đã bỏ nút "Đóng" ở chân popup.
- Ô có khung mà chưa có ảnh: mặc định **Fit ngang**; ô đã có ảnh giữ đúng chế độ đã lưu.
- Bỏ các dòng ghi chú (Fit/kéo ảnh; "chưa nối dịch vụ tạo ảnh"). Nhãn: "Hiển thị", "Tỷ lệ" (khóa trong bảng). Test: test3/4/5 đã cập nhật theo hành vi mới.

## M. v47 — sửa lỗi Dùng ảnh này
- `genUse` không còn đi vòng `fetch(dataURL) → Blob → File → loadImg` (dễ lỗi im lặng với ảnh lớn / một số trình duyệt, khiến ảnh không được ghi). `dropImages(id, files, slotKey, pre)` nhận ảnh đã nạp sẵn (`pre = [{src,w,h,ar}]`); kích thước lấy bằng `imgWH`.

## N. v48 — khung ảnh cố định cho mọi ô ảnh từng câu
- `fixedImg(t,key)` = mọi ô ảnh trừ ảnh chung G1. `content.imgAr` (mặc định 4/3) là tỉ lệ khung chung của Task; bộ chọn "Tỉ lệ ô ảnh" nằm đầu mục Nội dung (`arSegHtml`) cho bảng, danh sách câu, cặp nối, lựa chọn ảnh và lưới T5. `imgArOf` trả về tỉ lệ này nên thumb cột trái, ô trên phiếu và khung popup đều cố định, không đổi theo ảnh.
- Trang: `tpic()` (irow, cặp nối, lựa chọn, bảng) và `ci()` (T5, thêm `--iar` cho tỉ lệ thật của ảnh; CSS `.ci[data-cf] .pic img` dùng `--iar`). Fit/zoom/lệch tâm lưu ở `layout.cells[...].frame` như trước. Chiều cao khung đặt tay (`frame.h`) ở T5 vẫn ghi đè tỉ lệ.
- Popup: khung preview và nút Tỷ lệ theo `content.imgAr` (khóa); G1 vẫn tự do.

## O. v49 — audit ảnh toàn phiếu
- Audit tự động (`audit.py`): với mọi ô ảnh của 18 Task, tải ảnh dọc và ngang qua popup, thử Fit ngang/dọc, kiểm tra tỉ lệ ô, ảnh hiện, số trang, lỗi tràn → 0 vấn đề (`audit2.py` thử thêm tỉ lệ 1:1, 3:4, 16:9: không lỗi tràn, số trang tăng vì khung cao hơn).
- Lỗi đã sửa: (1) T5 + Fit dọc tự đổi chiều cao khung (`data-cih` chỉ còn khi đặt tay `frame.h`); (2) ảnh chung tải lên ghi đè tỉ lệ khung bằng tỉ lệ ảnh → ảnh dọc làm phiếu tràn 12–13 trang. Nay `t.image.ar` là tỉ lệ KHUNG (chỉ đổi khi chọn "Tỷ lệ" trong popup rồi Dùng ảnh này), tỉ lệ thật của ảnh nằm ở `t.imgAr.G1` và biến `--iar`.
- Nút Dùng ảnh này luôn bấm được (trừ khi đang tạo) để lưu tỷ lệ / Fit khi chưa có ảnh.

## P. v50 — bảng: chiều cao hàng mặc định 14 mm
- `TBL_ROW_MM = 14`: mọi hàng của bảng, kể cả hàng tiêu đề, có chiều cao tối thiểu 14 mm khi `layout.table.minH` chưa đặt (trước đây: có ô trống → dòng viết + 4 mm, không thì 0). Ô "Chiều cao hàng tối thiểu (mm)" hiện số 14 mờ (placeholder) thay cho "tự động"; ô "Từng hàng" cũng hiện giá trị đang hiệu lực (`minH ?? 14`). Đặt số khác hoặc kéo tay từng hàng thì ghi đè như cũ. Chiều cao Task bảng thay đổi (t14, t16…); phiếu vẫn 11 trang, không tràn.

## Q. v51 — mặc định chỉ mở thẻ Nội dung
- `SECT_DEF = {kind:false, info:false, content:true, parts:false}`; khóa lưu `wsEditor.sections.v2` (đổi từ v1 để mọi người dùng cũ cũng về mặc định mới). Người dùng vẫn mở/thu từng thẻ và trạng thái được nhớ giữa các Task và lần tải lại.

## R. v52 — thẻ Task, đánh dấu Task, cột trái rộng hơn
- Task đang mở ở cột trái nằm trọn trong một thẻ có viền (`.tk.open`; viền đậm `.cur` khi Task đang được chọn). Cột trái mặc định 360 px (trước 300, ~+20%); khóa lưu `wsEditor.leftW.v2`.
- Trên trang: mọi thao tác bên trong một Task (chọn câu, ô ảnh, nhóm…) đều giữ viền mảnh quanh cả Task (`.task.cur`, `markSelection`), khác với viền đậm `.sel` của đối tượng đang chọn. Bấm vào vùng trống của Task thì chọn chính Task. Viền này không in (print).

## S. v53 — tinh chỉnh thẻ Task
- Viền thẻ Task màu xám (`--ln2`, đậm hơn `--ink-3` khi đang chọn), không đen. Cột trái có đệm ngang 12/14 px, thẻ Task đệm trong 12 px, khoảng cách cột trái – trang tăng 12 → 20 px.
- Thanh tên Task (`.tk.open>.tkh .tnode`) cao bằng thanh khu vực `.sech` (~38 px) và luôn nền xanh `--accent` (trước đó mình đổi sang đen ở v41, nay trả lại).

## T. v54 — thẻ câu
- Bỏ lề trái tô đậm của thẻ câu (`.eit`, kể cả thẻ có chỗ trả lời `.eit.ans` và thẻ lượt thoại): mọi thẻ viền 1 px xám `--ln2`; thẻ có chỗ trả lời vẫn phân biệt bằng nền trắng + bóng nhẹ. Mục S: đã hạ `lwMax` (trừ 40 thay 24) khi tăng khoảng cách cột lên 20 px.

## U. v55 — mã QR nghe
- Task có Track (`t.audio`) hiện mục **Mã QR nghe** ở thẻ 2, dưới ô Track. Dữ liệu `t.qr = {src:'link'|'img'|'file', link, img(dataURL), file, url, demo}`; `ws.audioBase` là địa chỉ gốc chung cả phiếu (link không có `http…:` thì ghép `audioBase/…`).
- 3 cách: **Link** (tự sinh QR), **Ảnh mã** (tải ảnh QR có sẵn), **File nghe** (tải file, hệ thống tạo link rồi sinh QR). File nghe cần dịch vụ lưu file: hook `window.WSAudioUpload.upload(file) → {url}`; chưa nối thì dùng link mẫu `https://example.invalid/audio/<tên>` và ghi chú "Bản demo" (QR không nghe được).
- Bộ sinh QR: qrcode-generator 1.4.4 (MIT) nhúng thẳng trong file (ECC M, SVG). Đã kiểm tra bằng cách quét lại ảnh QR (OpenCV) → ra đúng link.
- Trên phiếu: QR 15×15 mm ở góc phải hàng tiêu đề Task (`.g0 > .qrb`), nhãn Track giữ nguyên. Không có QR khi Task không có Track. Khung QR và ảnh mã bo góc 2 mm như các ảnh khác. Test: `test7.py`.

## V. v57 — Công thức, bước 1: bỏ dạng "Tranh" (theo `claude/PHUONG_AN_CONG_THUC.md`)
- **Không còn dạng nội dung "Tranh".** Task chỉ có ảnh = **Danh sách câu 0 câu + Ảnh chung**. Dữ liệu: `content = {form:'list', list:false, items:[]}`.
- **`content.list`** (chỉ lưu khi tắt): `false` = công tắc "Danh sách câu" đang tắt. Tắt thì danh sách câu ẩn khỏi phiếu và khỏi khung soạn, nhưng **câu vẫn giữ** trong `items`, đáp án đang dùng cất ở `content.listAns`; bật lại thì câu và đáp án quay về. `its(t)` trả về `[]` khi tắt.
- **Phân loại suy ra** (`ckOf`, không lưu): có bài đọc → `passage`; **0 câu (hoặc danh sách tắt) → `empty`** ("chỉ có ảnh"); còn lại như cũ (cặp nối, hội thoại, câu có ảnh, tô chữ, câu hỏi). `empty` thay mọi chỗ trước đây xử lý riêng `picture`: bố cục chỉ T1 (Xếp dọc), không có nhóm G2, đáp án chỉ "không có", ô khung ảnh G1 có trong popup.
- **Mục 4 · Thành phần của bài** luôn có công tắc **Danh sách câu** (đứng đầu) với mọi Task không phải bảng. Task `empty` chỉ hiện "Danh sách câu" + "Ảnh chung"; các công tắc khác hiện lại khi có câu.
- **Thêm câu vào Task chỉ có ảnh:** bật Danh sách câu → "+ Thêm câu" → Task tự thành Câu hỏi có ảnh (bố cục T1–T4 mở ra, chọn được loại đáp án). Không phải đổi công thức.
- Khi danh sách tắt, mục Nội dung ghi "Danh sách câu đang tắt (vẫn giữ n câu). Bật ở mục 4". Chip thẻ dạng bài: "chỉ có ảnh" (tắt) hoặc "0 câu" (bật, chưa có câu). Tóm tắt mục Nội dung: "chỉ có ảnh". Cảnh báo: "Chưa có ảnh…" khi không có ảnh.
- **Bài đọc** tắt danh sách: ẩn câu hỏi, giữ bài đọc (vẫn là dạng bài đọc). `units()` của bài đọc T8 trả `null` khi 0 câu.
- **Đọc dữ liệu cũ:** 0.1/0.2 `content.kind:'picture'` và 0.3 bản ≤ v56 `lead:{kind:'picture'}` đều tự chuyển sang `list:false` khi nạp (`toForm`, `migTask`). Dữ liệu từ hệ thống tạo WS vẫn đọc được.
- Công thức "Tranh (tô màu, vẽ)" vẫn còn (id `picture`, chữ ký `form:'empty'`, tạo `list:false`); bộ đoán khi dán vẫn trả về công thức này cho bài tô màu/vẽ (bước 2–4 mới đổi tên và đổi bộ đoán sang cấu hình).
- **Kiểm thử v57:** bố cục 18 Task giống hệt v56 (test2: cùng trang, cùng chiều cao từng Task, 11 trang, 0 tràn); test1, test3–7 đạt; audit ảnh 0 vấn đề (t10 = Task 17: `empty`, T1, 1 ô G1); test8 mới (bước 1) đạt; 0 lỗi console.

## W. v58 — Công thức, bước 2: "Công thức" → "Mẫu có sẵn"
- **Thẻ 1 · Dạng bài & đáp án:** ô "Công thức" đổi thành **"Áp mẫu"**: mặc định "Chọn mẫu để áp…", chọn một mẫu là áp **một lần** (`applyRecipe` như cũ: giữ chữ các câu, đổi cấu trúc + đáp án + bố cục), xong ô tự về "Chọn mẫu để áp…". Toast "Đã áp mẫu “X” (Ctrl+Z để hoàn tác)". Không còn chữ "(gốc, đang tùy biến)".
- **Tên trên thẻ / tóm tắt mục 1 = mô tả thành phần** (`descOf(t)`, suy ra từ dữ liệu, không lưu): khung · chỗ trả lời · phần đi kèm. Khung: Câu hỏi / Ảnh mỗi câu / Nhiều ảnh mỗi câu / Nối cặp / Hội thoại / Tô chữ / Bài đọc / Bảng / Chỉ có ảnh / Chưa có câu. Chỗ trả lời: viết từ, điền chỗ trống, viết câu, khoanh A/B/C, chọn trong câu {a|b}, tick, Đúng/Sai, ô chữ cái…; bảng: ô có chữ / ô trống để viết / ô tick. Đi kèm: ảnh chung, lời dẫn, ô nhiều dòng, khung từ. Ví dụ 18 Task mẫu: "Ảnh mỗi câu · viết từ", "Câu hỏi · khoanh A/B/C", "Hội thoại · điền chỗ trống · lời dẫn · khung từ", "Bài đọc · viết câu · ảnh chung", "Chỉ có ảnh".
- Chip tên không còn kiểu "Tùy biến · gốc: X" (viền gạch). Rê chuột: "Giống mẫu có sẵn “X”" hoặc "Cấu hình riêng (không trùng mẫu có sẵn nào)". `recipeMatch` chỉ còn dùng cho chú thích này.
- **Mẫu chia nhóm** (trường dữ liệu `group` trong `RECIPES`, thứ tự `LIB_GROUPS`): Danh sách câu · Ảnh mỗi câu · Riêng · Chỉ có ảnh · Bảng. Dùng ở ô Áp mẫu (`optgroup`), thư viện "+ Task" (tiêu đề nhóm, tiêu đề hộp "Thêm Task: chọn mẫu có sẵn") và ô đổi mẫu trong hộp Dán (`libOpts`). Thêm mẫu vẫn = thêm một dòng dữ liệu.
- Chưa đổi (bước 3): tên và số lượng mẫu (vẫn 15, "Tranh (tô màu, vẽ)", 3 mẫu bảng). Chip "đáp án: …" trên thẻ hơi lặp với mô tả; để xem lại khi bạn dùng thử.
- **Kiểm thử v58:** bố cục 18 Task giống hệt v57 (test2); test1, test3–8 đạt; audit ảnh 0 vấn đề; test9 mới (Áp mẫu, mô tả, nhóm mẫu, hộp dán) đạt; 0 lỗi console.

## X. v59 — Công thức, bước 3: gọn danh sách mẫu (15 → 13)
| Nhóm | Mẫu (id) |
|---|---|
| Danh sách câu | Trả lời câu hỏi (`answer-q`) · Chọn A/B/C (`choose-abc`) · Điền chỗ trống (`gap-fill`) · Chọn trong câu {a|b} (`choose-inline`) · Đúng/Sai (`true-false`) · Đọc và trả lời (`read-answer`) · Tô chữ (`trace`) |
| Ảnh mỗi câu | Nhìn tranh viết từ (`look-write`) · Nghe và tick ảnh (`listen-tick`) |
| Riêng | Nối (`match`) · Hội thoại (`dialogue`) |
| Chỉ có ảnh | Tô màu / vẽ (`colour-draw`; trước là `picture` "Tranh (tô màu, vẽ)") |
| Bảng | Bảng (`table`; gộp `table-choose`, `table-fill`, `table-tick`) |
- **13 mẫu, không phải 12** như phương án ghi: bảng của phương án liệt kê đúng 13 mẫu, con số 12 là đếm nhầm.
- **Mẫu Bảng** chữ ký chỉ còn `{form:'table'}`; kiểu ô (có chữ / trống để viết / ✓) do nội dung từng ô quyết định và hiện trong mô tả ("Bảng · ô tick"…). Mẫu tạo bảng 2 cột × 3 hàng ô trống.
- Đổi tên cho gọn: "Nhìn tranh, viết từ" → "Nhìn tranh viết từ", "Hội thoại điền chỗ trống" → "Hội thoại", "Đúng / Sai" → "Đúng/Sai". Thứ tự trong nhóm theo bảng trên.
- Bộ đoán khi dán: bảng → `table`; bài tô màu / vẽ (không có câu) → `colour-draw`.
- `typeId` của Task tạo trước v59 bằng mẫu cũ (vd `table-fill`) giữ nguyên; nó chỉ là nhãn cho "Mặc định theo dạng bài", không ảnh hưởng dàn trang.
- **Kiểm thử v59:** bố cục 18 Task giống hệt v58 (test2); test1, test3–9 đạt; audit ảnh 0 vấn đề; test10 mới (13 mẫu / 5 nhóm, 18 Task đều khớp một mẫu, áp mẫu Bảng cho Task câu hỏi, dán bảng / bài tô màu, + Task Tô màu / vẽ) đạt; 0 lỗi console.

## Y. v60 — Công thức, bước 4: dán bài trả về cấu hình
- `parseTask(raw, force)` **không chọn mẫu nữa**. Từ ký hiệu trong chữ, nó đoán **cấu hình** rồi dựng Task trực tiếp: khung (danh sách câu / bảng), thành phần (bài đọc, lời dẫn, người nói, vế ghép, ảnh mỗi câu `[ảnh: x]`, nhiều ảnh lựa chọn, ảnh chung, khung từ, danh sách tắt) và loại đáp án (`setKind`: none / match / word / tick / tf / choice / trace / sentence). Quy tắc đoán giữ như trước (bảng → không đáp án; không có câu → danh sách tắt + ảnh lớn; cặp nối; người nói; "tick" + lựa chọn → nhiều ảnh mỗi câu; Đúng/Sai; `{a|b}` hoặc A/B/C → chọn; "trace" → tô; `___` → điền; bài đọc → viết câu; "look and write" → ảnh mỗi câu + viết từ; câu kết thúc `?` / "answer" → viết câu; còn lại viết câu, độ chắc thấp).
- Kết quả trả về `{ t, rid, conf, notes }`; `rid` chỉ có khi người dùng chọn mẫu (`force`), khi đó `applyRecipe` áp mẫu lên Task đã dựng (giữ tiêu đề, hướng dẫn, chữ câu), độ chắc = "người dùng chọn".
- Task dán vào: `typeName` = mô tả thành phần (`descOf`), `typeId` = id mẫu nếu trùng một mẫu, không thì `custom`. Chưa có tiêu đề mà trùng mẫu thì lấy tiêu đề của mẫu.
- **Hộp Dán:** mỗi Task hiện dòng đậm là mô tả cấu hình + "giống mẫu “X”" hoặc "cấu hình riêng"; ô chọn mặc định **"Giữ cấu hình đoán"**, chọn một mẫu (theo nhóm) nếu đoán sai, chọn lại "Giữ cấu hình đoán" để bỏ.
- **Lợi ích:** bài dán có cấu hình không trùng mẫu nào (vd "Ảnh mỗi câu · khoanh A/B/C") vẫn nhập đúng mà không bị ép về mẫu gần nhất. So với v59 trên 20 bài dán thử (tô màu, A/B/C hai kiểu, {a|b}, điền chỗ trống + khung từ, Đúng/Sai hai kiểu, tô chữ, trả lời câu hỏi, hội thoại, nối, tick, look and write, bài đọc, bảng điền / bảng tick, ảnh từng câu, chữ thô): **cấu trúc, đáp án, bố cục giống hệt**; chỉ khác tên Task (mô tả thay tên mẫu).
- **Kiểm thử v60:** bố cục 18 Task giống hệt v59 (test2); test1, test3–10 đạt (test10 đổi phần dán theo hành vi mới); audit ảnh 0 vấn đề; test11 mới (cấu hình đoán, cấu hình riêng, áp mẫu khi chọn, hộp dán, nhập vào phiếu) đạt; script so sánh `cmp_paste.py <mới> <cũ>`; 0 lỗi console.

## Z. v61 — Khu vực Phiếu: mở Task chỉ mở thẻ 3
- Mở bất kỳ Task nào (bấm tên, thêm Task mới), các thẻ 1 Dạng bài, 2 Tiêu đề, 4 Thành phần thu lại; chỉ thẻ 3 Nội dung mở. Không còn nhớ trạng thái thẻ từ Task trước hay lần tải trước.
- Trong lúc đang sửa một Task, bấm mở/đóng thẻ vẫn giữ nguyên cho tới khi đổi Task. Nút "Đổi dạng" trên thẻ vẫn tự mở thẻ 1.
- Code: `sectReset(id)` (áp `SECT_DEF`), gọi trong `renderTree` khi `openTask` đổi, lúc thêm Task, lúc bấm "Đổi dạng". Test1 cập nhật; test8–11 mở thẻ 1/4 qua `SECT` trước khi thao tác.

## AA. v62 — Thử nhập từ file PDF: phiếu "Wonders of the Sea" (Our World 4, WS 6.1)
- Nguyên tắc người dùng chốt: không cần tái hiện đúng cách trình bày của tài liệu, chỉ cần thể hiện đủ nội dung.
- Ô chữ (word search) = Task bảng 12×10, mỗi ô một chữ; `layout.table = {head:false, rowHead:false, nm:'off', lines:'all', align:'center', minH:8}`; danh sách từ = khung từ (`wordBank`, đặt trên, kiểu chip, không nhãn). Không thêm dạng mới.
- Code: Task bảng giờ bọc `withBank(...)` như các dạng khác, nên khung từ hiện được với bảng. Khung từ đặt bên phải (`right`) chưa dùng được với bảng (rơi xuống dưới).
- Hoạt động 2 (viết gợi ý) = danh sách câu "Clue n:" + đáp án 2 dòng, câu mẫu đặt ở hướng dẫn. Hoạt động 3 (bong bóng thoại) = Hội thoại 3 lượt, người nói là "Students 1 and 2 / 3 and 4".
- Phiếu mẫu: `ws-sea-sample.json` (2 nhóm × 3 Task = 6 Task, 3 trang, 0 tràn); dựng bằng `tests/ws_sea.py`.
- Còn thiếu: vòng tròn đáp án quanh từ trong ô chữ; công tắc "Khung từ" chưa có trong UI cho Task bảng (hiện chỉ gán qua dữ liệu); số thứ tự Task chạy 1–6 (bản gốc đánh lại 1–3 cho mỗi nhóm).

## AC. v63 — Nhập file, bước P0: sửa lỗi nhỏ khi nhập (theo `claude/PHUONG_AN_NHAP_FILE.md`)
- **Lớp B (cửa duy nhất vào phiếu)**, các hàm mới: `fillTask(t, notes)` và `fillSheet(o, notes)` bù trường thiếu; `readJson(raw)` đọc JSON; `estPages(w)` ước tính số trang (dàn thử, không vẽ); `addTasks(list, note)` thêm Task vào cuối phiếu.
- `fillSheet` bù: `schema`, `id`, `title` ("Phiếu mới"), `age` ("7-9"), `page` (A4, lề 14), `spacing` (Vừa), `flow` (Liền trang); bỏ `fill` sai. Task: `id` (trùng thì cấp id mới), `title`/`instruction` thành chuỗi, `image` chuỗi → `{label}`, `wordBank` mảng → `{words}`, `content` thiếu → danh sách câu trống, câu là chuỗi → `{text}`, bảng hàng là mảng → `{head, cells}` và đệm ô cho đủ cột, `answer` thiếu → "không có" (suy `kind` từ `layout` nếu có), `layout`/`spacing` sai → mặc định; rồi `migTask`, `ensureIds`, `normAnswer`, `tidy`. Chỉ bù khi thiếu/sai: dữ liệu hợp lệ giữ nguyên từng byte (khứ hồi 18 Task mẫu: dữ liệu và bố cục giống hệt).
- **Nạp lỗi không đổi phiếu đang mở:** `loadSheet` trả `true/false`; lỗi khi bù trường (thiếu `tasks`, quá 40 Task, Task không phải đối tượng, `content.kind` lạ) hoặc lỗi khi dàn trang → khôi phục `ws`, `base`, lịch sử, lựa chọn; toast "… Phiếu đang mở giữ nguyên." `readJson` dựng thử từng Task (`renderTask`) để bắt Task làm hỏng màn hình trước khi nhập.
- **Task không tên:** cột trái và tiêu đề panel dùng `taskLabel(t)` = `typeName` → `title` → `descOf(t)`. *Quyết định (tài liệu chưa chốt):* `fillTask` **không ghi** `typeName` vào dữ liệu khi thiếu, chỉ hiển thị theo thứ tự trên; `typeId` thiếu → id mẫu nếu khớp đúng một mẫu, không thì `custom`.
- **Nhận ra JSON:** chữ bắt đầu bằng `{` hoặc `[` (`looksJson`) không bao giờ xử lý như chữ thô; JSON hỏng báo "JSON hỏng: …" kèm vị trí lỗi. Chấp nhận: phiếu `{tasks:[…]}`, mảng Task, hoặc một Task (`{title|content}`). *Quyết định:* `{tasks:[…]}` không có trường cấp phiếu nào (`schema, title, age, page, spacing, flow`) được coi là **danh sách Task**, không báo "cả phiếu".
- **Tự chọn "Cả đề":** `autoPasteMode` = Cả đề khi có ≥ 2 dòng đầu mục (`Task 1`, `Activity 2`…, hoặc **số trần "2 Work with…"** hay gặp khi copy từ PDF) hoặc `splitTest` cắt được ≥ 2 phần. Chọn tay thì giữ lựa chọn khi sửa chữ. *Quyết định:* thêm `BARE_RE` (số hoạt động không dấu chấm) vào `splitTest` và bỏ số này khỏi tiêu đề trong `parseTask`; 20 bài dán thử vẫn ra giống hệt v62 (`cmp_paste.py`).
- **Cảnh báo dán dài:** > 40 dòng (`PASTE_LONG`) ở chế độ Một Task → khung cảnh báo + nút "Chuyển sang Cả đề".
- **Báo vị trí:** toast ghi số Task mới ("Đã thêm N Task vào cuối phiếu (Task a–b) · Ctrl+Z để hoàn tác"), chọn + mở Task đầu, cuộn để Task đầu ở giữa màn hình (Task cũ thấy ngay phía trên). *(Ở v63 chữ dán vẫn chèn sau Task đang chọn; từ v64 mọi nguồn đều vào cuối phiếu theo quyết định mục 5.)*
- Giới hạn: tối đa 40 Task một lần nhập (`IMP_MAX`), 8 MB chữ (`IMP_MAX_CH`).
- **Kiểm thử v63:** test1–11 đạt; test12 mới (P0) đạt; 0 lỗi console.

## AD. v64 — Nhập file, bước P1: "+ Task" và "+ Phiếu" (theo quyết định mục 5 của phương án)
- **Cột trái chỉ còn 2 nút nhập:** **+ Task** và **+ Phiếu**. Bỏ nút "Dán…". Panel Phiếu → Nâng cao → "Nạp phiếu khác (JSON / MD)…" mở hộp + Phiếu. Ctrl+V chữ trên trang (không ở ô nhập) mở + Task ở thẻ "Từ file / dán", có sẵn chữ.
- **Một hộp chung** (`#libDlg`, biến `impMode = 'task' | 'sheet'`):
  - **+ Task**: hai thẻ **"Mẫu có sẵn"** (thư viện 13 mẫu như cũ) | **"Từ file / dán"**. Task mới **luôn vào CUỐI phiếu** (cả mẫu có sẵn), không chèn sau Task đang chọn.
  - **+ Phiếu**: không có thẻ, chỉ ô nhập. Ô trống → nút **"Tạo phiếu trống"**. Áp cả cài đặt cấp phiếu của file; trường thiếu bù mặc định (bảng ghi "Cấp phiếu thiếu, sẽ bù mặc định: …").
- **Thẻ "Từ file / dán"**: nút "Chọn file…" (`#impFile`, nhận `.json .md .txt` và `.pdf`) + ô dán. Hộp tự nhận nguồn: JSON (`readJson`), MD theo quy ước (`readMd`, P2), còn lại chữ thô (đoán bằng `parseTask` / `splitTest`, có "Một Task / Cả đề").
- **Bảng nhận diện sơ bộ** (`impRender`, `impRowHtml`), mỗi Task một dòng: **số theo file**, tiêu đề, **mô tả cấu hình** (`descOf`) + "giống mẫu “X”" / "cấu hình riêng", **số câu / hàng / lượt**, cảnh báo (`contentWarnings`: khung từ không khớp chỗ trống, thiếu lựa chọn, thiếu đáp án…; "N ô ảnh chưa có ảnh"; "Đã bù: …" với JSON; lỗi đỏ khi Task không dựng được). Cuối bảng: **ước tính số trang sau khi nhập** (và số lỗi tràn nếu có). Chữ thô: khung "hệ thống **đoán**, độ chắc thấp", mỗi dòng có nhãn "đoán · độ chắc: …", ô "Giữ cấu hình đoán / chọn mẫu", "Chữ gốc".
- **+ Task, nhiều Task:** khung vàng "File có N Task. Bỏ chọn Task không muốn nhập…", ô tick từng dòng (mặc định tick hết, giữ thứ tự trong file). JSON / MD có cài đặt cấp phiếu: khung xanh "+ Task chỉ lấy các Task, bỏ cài đặt cấp phiếu" + nút "Mở bằng “+ Phiếu” thay vì thêm"; toast cũng nói rõ.
- **+ Task, 1 Task:** *Quyết định:* **chọn file** JSON / MD có đúng 1 Task hợp lệ → **chèn luôn** (đóng hộp, toast "Đã thêm 1 Task vào cuối phiếu (Task n)"). Dán chữ (kể cả 1 Task) luôn hiện bảng để người dùng bấm nhập, vì chữ thô là đoán.
- **+ Phiếu:** bảng không có ô tick; nút "Tạo phiếu mới (N Task)" → bước **xác nhận** trong cùng hộp: "Thay phiếu hiện tại? … Nạp phiếu xóa lịch sử Hoàn tác, nên không quay lại được." + **"Tải JSON phiếu cũ"** (tải file `<tên phiếu>.json`) + "Quay lại"; nút chính "Thay phiếu hiện tại". *Quyết định:* phiếu hiện tại **trống** (0 Task) thì không hỏi lại.
- **Lỗi:** JSON hỏng, thiếu `tasks`, quá 40 Task, quá 8 MB → khung đỏ, nút nhập tắt, phiếu đang mở không đổi. Task hỏng trong file: + Task bỏ qua Task đó (ô tick tắt, nhập các Task còn lại); *quyết định:* **+ Phiếu không cho tạo** khi còn Task hỏng (sửa file rồi nạp lại).
- **File PDF:** chưa đọc trực tiếp trong app (quyết định 7). Không có hook → báo "Gửi file cho Claude trong chat để ra JSON…, rồi nạp JSON ở đây". Có `window.WSImport.extract(file) → {tasks:[…]}` (WS Studio gắn AI của Studio) → kết quả đi qua đúng bảng nhận diện như JSON. Editor không gọi AI trực tiếp.
- **ID và hoàn tác:** Task nhập luôn được cấp id mới (`newId`), giữ thứ tự trong file; nhập cùng file hai lần không trùng id. Một lần nhập vào phiếu hiện tại = **một bước hoàn tác**. + Phiếu không hoàn tác được (đã có xác nhận).
- **Hộp "Dán nhiều câu/hàng vào Task đang soạn"** (nút trong mục Nội dung của Task) tách thành hộp riêng `#pasteDlg` (`#itemsTa`, `#itemsOk`), hành vi như cũ.
- Sửa kèm: CSS `[hidden]{display:none !important}` (trước đây `.seg` đè thuộc tính `hidden` khi mở file trực tiếp; bản publish vốn đã có luật này).
- **Kiểm thử v64:** test1–11 (test2, 8–11 đổi lối vào "Dán…" → "+ Task › Từ file / dán"), test12 (P0, viết lại phần giao diện) và test13 mới (P1, 45 phép kiểm) đạt; `cmp_paste.py` 20/20 giống v62; 0 lỗi console.

## AE. v65 — Nhập file, bước P2: quy ước MD trung gian
- Quy ước đầy đủ + 3 ví dụ: **`claude/QUY_UOC_MD.md`**; file ví dụ: `claude/tests/md/sea.md` (phiếu Sea, nhóm Students 1 and 2), `mau-tron.md` (5 dạng + đáp án), `nghe-bang.md` (bảng, nối, hội thoại, chọn trong câu, tô màu).
- **Nhận ra MD:** có dòng `## Task` (`MD_RE`). Mỗi Task bắt đầu bằng `## Task: <tiêu đề>` → tách chắc chắn, tiêu đề không phải đoán. Trước Task đầu: `# Tên phiếu`, `Tuổi:`, `Xếp trang:`, `Khoảng cách:` (dùng khi + Phiếu).
- **Trường trong Task:** `Hướng dẫn:`, `Track:`, `Trả lời:` (viết từ · điền chỗ trống · viết câu · khoanh A/B/C · chọn trong câu · tick · đúng/sai · nối · tô chữ · không), `Dòng viết:`, `Khung từ:`, `Ảnh:`, `Lời dẫn:`, `Mẫu:` (ép theo mẫu có sẵn). **Khối:** `Bài đọc:`, `Hội thoại:` (`Tên: lời`, tên được có số), `Ô chữ:` (mỗi dòng một hàng chữ cái → bảng như phiếu Sea). Còn lại: câu đánh số / dòng bảng `|` / ký hiệu `___`, `{a|b}`, `A. B. C.`, `[ảnh: x]`, `trái - phải`. **Câu nhiều dòng:** dòng thụt lề ngay dưới câu đánh số.
- **Đáp án riêng** ở `## Đáp án` cuối file (`### Task n` + dòng đánh số, hoặc `Task n: a; b; c`) → ghi vào `key` của từng câu, không hiện trên phiếu học sinh. Chưa nhận đáp án cho bảng / ô chữ (bỏ qua, có ghi chú).
- **Code:** `readMd(raw)` → lô Task cùng dạng với `readJson` (đi qua cùng bảng nhận diện, cùng + Task / + Phiếu); `mdTask(block, keys)` dựng từng Task bằng `parseTask(body, mẫu, pre)` — tham số mới `pre = {title, instruction, audio, passage, match}` để bỏ qua phần đoán tiêu đề / hướng dẫn / bài đọc; sau đó áp các khối và trường nói rõ. Có `Trả lời:` / `Mẫu:` / khối → độ chắc "cao"; không có mà bộ đoán chưa chắc → ghi chú "loại đáp án do hệ thống đoán… thêm dòng “Trả lời: …”". Trường lạ, `Trả lời:` không hợp nội dung, `Mẫu:` không có → ghi chú ở dòng Task, giữ cấu hình đoán.
- **Xuất MD:** `taskToMd(t)` / `sheetToMd(w)` (nút Xuất MD từ v70). Khứ hồi 18 Task mẫu qua MD: **18/18** giữ mô tả, số câu, loại đáp án, cách gắn, bố cục.
- Sửa kèm trong bộ đoán chữ (không đổi 20 bài dán thử): cặp nối vế trái là ảnh `[ảnh: apple] - pear`; dòng bảng bắt đầu bằng `[ảnh: …]` không còn bị nhầm là khung từ.
- **Kiểm thử v65:** test1–13 đạt; test14 mới (P2, 34 phép kiểm: nhận ra MD, Sea MD = 3 Task đầu của `ws-sea-sample.json` và cùng số trang, + Phiếu từ MD, 2 ví dụ còn lại đúng cấu hình / số câu / đáp án / cấp phiếu, câu nhiều dòng, `Mẫu:`, `Trả lời:` lạ, chèn file .md 1 Task, khứ hồi 18 Task) đạt; audit ảnh 0 vấn đề; audit2 số trang giống v62 (1:1 13 trang, 3:4 14 trang, 16:9 11 trang, 0 tràn); `cmp_paste.py` 20/20 giống v62; `ws_sea.py` dựng lại `ws-sea-sample.json` giống hệt; màn hình 390 px không tràn ngang; 0 lỗi console.

## AF. v67 — Sửa đường nhập MD theo phiếu thật đầu tiên ("A Surprise Birthday Party")
Chi tiết ở spec chính mục 16.8. Tóm tắt:
- Phân loại lỗi của lần thử (MD do AI khác viết theo prompt cũ): AI đọc sai chữ 0; prompt dẫn sai ("Nội dung:", không dặn bỏ giàn giáo, không dặn tách Task trộn loại); bộ đọc hiểu sai (lựa chọn xuống dòng, ô ☐, dòng nhãn, gạch thừa, mất đoạn); mô hình thiếu (tick lựa chọn chữ, lời nhắc cuối bài, Task trộn loại); dàn trang xấu: gần như không. Mô hình container giữ nguyên.
- Code: `MD_SKIP`, `MD_LABEL`, `MD_SCAF`, `MD_RULE`, `BOX`, `OPT_LINE`, `boxSplit`, `optStr` (trước `mdTask`); `mdTask` viết lại phần đọc dòng (mỗi dòng thân Task là `{s, box}`); `parseTask(…, pre)` nhận `pre.box` (không đoán "tick ảnh" khi có ô ☐) và câu không thân câu khi đến từ MD; dò người nói chỉ chạy với chữ dán (không chạy với MD); `dupGapKind`, `endGap` + 4 cảnh báo mới trong `contentWarnings`; `paraHtml` cho bài đọc nhiều đoạn; A4 `lab: 'box'` (`.opt b.bx`), Inspector thêm "☐ ô tick" và ẩn "Chữ nhãn"; `descOf` / `MD_KNAME` / `taskToMd` cho ô tick; trường MD `Ghi chú:` / `Lưu ý:` / `Note:`.
- Quyết định đã tự chọn: lời nhắc cuối bài vào Hướng dẫn (không thêm trường Ghi chú hiển thị); không làm "số lựa chọn phải chọn"; khoanh A/B/C không bị bỏ gạch ___ (vd "She is a ___. A. … B. …" hợp lệ); dòng bảng không bao giờ đọc thành ô tick lựa chọn; Task trộn loại không tự tách, chỉ ghi chú + cảnh báo.
- Kiểm thử: test16 (mới) + test1–15, audit, audit2, cmp_paste, ws_sea: đạt trên bản cuối.

## AG. v68 — Nối Task, MD `### Phần`, nhãn, ẩn số
- **Nối vào Task trên:** `layout.break = 'join'` (cạnh auto/page/keep). Task nối không lặp G0 riêng, chạy tiếp liền Task trên (phương án B đã chốt).
- **MD:** `### Phần: <tên>` chia nhóm Task trong một file; nhãn lựa chọn viết HOA (A. B. C.).
- **Một câu duy nhất:** ẩn số thứ tự câu.
- **Prompt + quy ước MD** viết lại (`PROMPT_PDF_SANG_PHIEU.md`, `QUY_UOC_MD.md`) cho các thay đổi trên.
- Test: `test17.py`, dữ liệu `tests/md/birthday6.md`, `tests/real/birthday-user2.md`.

## AH. v69 — Font chữ phiếu
- Panel Phiếu có mục **Font chữ phiếu** với 3 lựa chọn: **Andika** (hiện tại, mặc định), **Be Vietnam Pro** (font như trong ảnh người dùng gửi), **Lexend** (thiết kế cho dễ đọc, gợi ý của Claude). Mỗi nút hiển thị bằng chính font của nó.
- Dữ liệu: `ws.font` = `'be'` | `'lexend'`; Andika không lưu (xóa trường). Font lạ khi nạp → về Andika + ghi chú "font không có trong danh sách".
- Code: bảng `FONTS`, `applyFont()` đặt biến `--f-sheet`, nạp trước chữ thường + đậm (có tiếng Việt) rồi **dàn lại trang**; `--f-ui` (giao diện) giữ Be Vietnam Pro, không đổi.
- Spec chính: mục 16.10. Test: `test18.py` (19 phép kiểm).
- **Chưa kiểm:** hình dạng chữ thật của Be Vietnam Pro / Lexend (sandbox không tải được font); chỉ kiểm cơ chế (biến CSS, dàn lại, lưu/nạp). Giả định "font trong ảnh" = Be Vietnam Pro.
- **Bản repo:** đã nhúng đủ font trong `fonts/`.

## AI. v70 — Đúng/Sai 80/20, hướng A4 theo Task, nút Xuất MD
- Chi tiết ở spec chính mục 16.11. Test mới: `test19.py` (12 phép kiểm). Phiếu mẫu đổi: Task 13 (T/F) cột đáp án hẹp hơn; Task 5 (A/B/C) xếp dọc cả Task, cao 764→924 mm, số trang không đổi.
- `test2` so với v69 sẽ FAIL đúng một chỗ này (t11); các Task khác y hệt. Từ v70 dùng bản v70 làm bản so sánh.
- Hoãn theo người dùng: công tắc Họ tên / Lớp.

## D. Còn mở (cập nhật 25/10/2026, bản v70)
- **Nhập file:** P0, P1, P2 xong; v67 sửa theo phiếu thật thứ nhất (mục AF). Còn **P3** (đã thử 1 PDF qua 2 vòng / 5–10) (thử 5–10 PDF thật qua đường chat: Claude đọc PDF → JSON/MD → nạp; đo số Task đúng, số chỗ phải sửa tay) và **P4** (mẫu có sẵn "Ô chữ" khi dán một khối chữ; đáp án ô chữ; phiếu nhiều nhóm).
- Bộ đoán chữ thô vẫn yếu với chữ copy từ PDF 2 cột / lưới (chỉ mới nhận thêm số hoạt động trần). Đường chính là JSON hoặc MD.
- "Mặc định theo dạng bài" khóa theo `typeId`: mọi Task nhập/dán có `typeId = custom` dùng chung một mặc định. Cần xem lại khi dùng nhiều Task tùy biến.
- Nút "Xuất MD" đã có từ v70. Đáp án (`key`) chưa có bản in đáp án cho giáo viên.
- Tải "JSON phiếu cũ" chỉ đã thử trên Chromium chạy file trực tiếp; trong khung artifact của claude.ai trình duyệt có thể chặn tải xuống (chưa thử).
- **Tối ưu công thức** theo `claude/PHUONG_AN_CONG_THUC.md`: xong cả 4 bước (v57–v60). Đo lại các phép kiểm 15.8 vẫn chưa làm.
- Gen ảnh chưa nối dịch vụ thật: hook `window.WSImageGen.generate({prompt, refs, ar}) → {src}` (mục I). Chưa lưu prompt vào dữ liệu phiếu.
- File nghe cho mã QR chưa nối kho lưu file: hook `window.WSAudioUpload.upload(file) → {url}` (mục U). Cần hỏi WS Studio lưu ảnh / audio ở đâu.
- Chưa thử trên màn hình cảm ứng.

## E0. Kiểm thử để chạy lại ở phiên sau
Các script nằm trong Project ở `claude/tests/` (Python + Playwright, Chromium có sẵn). Tải về một thư mục, tạo ảnh mẫu trong đó, rồi: `python3 testN.py <đường dẫn tuyệt đối tới ws-editor-prototype.html>`; `test2.py <mới> <bản cũ>` so bố cục; hoặc chạy cả loạt bằng `bash run_all.sh <mới> <cũ>` (mỗi test một tiến trình riêng, giới hạn 240 s, log ở `../logs/`). Thực tế mỗi test 5–35 s, `audit.py` ~2 phút. Tạo ảnh mẫu:
```
python3 -c "from PIL import Image; Image.new('RGB',(64,48),(200,200,200)).save('ref.png'); Image.new('RGB',(300,900),(200,80,80)).save('tall.png'); Image.new('RGB',(900,200),(60,120,200)).save('wide.png'); Image.new('RGB',(200,200),(0,0,0)).save('qr_up.png'); Image.effect_noise((3000,2000),80).convert('RGB').save('big.jpg',quality=92)"
```
- test16 (v67) đọc `real/birthday-user.md` (MD người dùng nhận từ AI, prompt cũ, giữ nguyên không sửa) và `md/birthday.md` (theo prompt mới); PDF gốc ở `real/birthday.pdf`.
- test12–14 đọc `ws-sea-sample.json` và thư mục `md/` nằm **cạnh file test** (`claude/tests/ws-sea-sample.json`, `claude/tests/md/*.md`).
- test1: cột trái, khu vực, độ rộng · test2: bố cục 18 Task, thao tác soạn, cột trái chỉ có + Task / + Phiếu · test3: popup ảnh · test4: ô ảnh, khung trong popup · test5: bảng khung cố định · test6: khung cố định mọi bài ảnh · test7: mã QR · test8: Danh sách câu tắt/bật · test9: Áp mẫu, mô tả thành phần · test10: 13 mẫu · test11: dán bài → cấu hình · **test12: P0 (bù trường, nạp lỗi không đổi phiếu, Task không tên, nhận JSON, tự chọn Cả đề, cảnh báo dán dài, vị trí chèn)** · **test13: P1 (+ Task / + Phiếu, chèn cuối, chọn file, bảng nhận diện, ước tính trang, xác nhận + tải JSON cũ, lỗi, ID, Ctrl+V, PDF + hook)** · **test14: P2 (MD)** · cmp_paste.py: so kết quả đoán của 20 bài dán giữa hai bản · audit.py / audit2.py: tải ảnh dọc/ngang vào mọi ô, mọi tỉ lệ · ws_sea.py: dựng phiếu Sea, xuất `ws-sea-sample.json` · shot.py: chụp màn hình.
- Bản cũ để so sánh: lấy từ artifact (đọc `index.html`, bỏ dòng khung `<!doctype…><body>` đầu và `</body></html>` cuối), hoặc giữ bản `ws-editor-prototype.html` cũ trước khi sửa.

## AJ. v72 — Cỡ chữ phiếu Nhỏ / Vừa / To
- Chi tiết ở spec chính mục 16.12. `ws.size` = `s` | `m` (To không lưu); bảng `FSZ` theo độ tuổi; panel Phiếu → "Cỡ chữ phiếu". Test mới: `test20.py` (25 phép kiểm). `test19` đổi phép kiểm tên phiên bản thành `v7x`.
- Số Nhỏ / Vừa là đề xuất để người dùng xem, chưa chốt.
- Kế hoạch G-Text và ba năng lực còn thiếu: spec chính mục 17.

## AK. v73 — G-Text kiểu Chữ
- Chi tiết ở spec chính mục 17.4. `t.extras`, `gtHtml/gtBody/gtMove`, `frag.last`, `gtPanel`, mục 5 ở cột trái. Test mới: `test21.py` (~40 phép kiểm). Chưa có kiểu Ảnh / Thẻ, chưa có cú pháp MD.

## AL. v74 — G-Text kiểu Ảnh, khung chữ 4 kiểu
- Spec chính mục 17.5. `test22.py`. Thẻ bị bỏ tạm theo yêu cầu người dùng.

## AM. v75 — Bài đọc có chỗ trống, chọn, đánh dấu, cắt theo đoạn
- Spec chính mục 17.6. `passageHtml`, `passInline`, `passCut`, `units` (đoạn rồi câu), `lead.keys`, `test23.py`. Sửa kèm: khung từ trước đây không hiện ở Task bài đọc.

## AN. v76 — Điểm trên ảnh chung
- Spec chính mục 17.7. `withMarks`, `marksCtl`, `image.marks/mk`, kéo / đặt điểm ở bắt sự kiện `pointerdown` pha capture trên stage, `test24.py`.

## AO. v77 — Dọn việc nhỏ
- Spec chính mục 17.8. `presetKey`, `layout.num`, `a4dir` tự động ra `fl`, `test25.py`. Prompt và quy ước MD: nhãn in sẵn của phần ghi vào `Hướng dẫn:`.

## AP. v78 — Ô chữ giải đố
- Spec chính mục 17.9. `crossCell`, `crossParse`, `crossLines`, `crossCount`, `crossHtml`, `layout.table.cross/key/xc`, `Crossword:` trong MD, G-Text `cols:2` và `<ol start>`, `test26.py`.

## AQ. v79 — Sửa lỗi câu nhiều dòng ở Task không ảnh
- MD có dòng thụt lề dưới câu đánh số (Task không ảnh) làm hỏng nhập ("Cannot read properties of undefined (reading 'includes')"). Nay câu không ảnh giữ `text` có `\n` và in xuống dòng; câu có ảnh vẫn là ô nhiều dòng. Chi tiết spec mục 16.13. Test mới `test27.py`, dữ liệu `tests/real/nhieu-dong-user.md`.

## AR. v80 — Ký hiệu chữ, tách phần tự động, khung viết tự do, gạch trong câu, xóa khung ảnh
- 5 điều chỉnh của người dùng, phân loại và sửa ở spec mục 16.14: `rich()` (`**đậm**`, `*nghiêng*`, `<u>gạch chân</u>`) dùng khắp phiếu; dòng hướng dẫn nhóm sau trong cùng bài tự thành phần mới (có ghi chú); Task viết đoạn không câu = khung viết tới 20 dòng, không ảnh; `___` trong câu thành gạch thật; nút "Xóa khung ảnh" + phím Delete. Test `test28.py`, dữ liệu `tests/real/dieu-chinh-v80.md`. `QUY_UOC_MD.md` và `PROMPT_PDF_SANG_PHIEU.md` đã thêm kiểu chữ (quy tắc 9), nhóm câu có hướng dẫn riêng (10), bài viết đoạn (11).

## AS. v81 — Kiến trúc trình bày mới (T / Q / G), bậc 0–5
- Spec chính mục 18. Bố cục Task 4 kiểu, Dạng câu hỏi 12 kiểu (suy ra từ dữ liệu cũ, không đổi schema), khối thêm / xóa thống nhất, câu ví dụ, dòng chữ, hai ảnh, khung từ ảnh, bốn ô li, khung vẽ, nhãn A–D, nhãn Đúng/Sai tự đặt, câu hỏi trước bài đọc, cú pháp MD mới, quy ước MD + prompt viết lại. Test mới `test29.py`, `test30.py`, `cmp_v80.py`; mẫu `tests/md/v81-cu-phap.md`, `tests/md/birthday6-dang.md`. Bản v80 lưu ở nhánh `backup/v80`.

## AT. v82 — Cột trái theo khối (Cấu hình · G0 · G1 · G2 · G3 · G4 · G-Text)
- Spec chính mục 19. Gộp "Bố cục & dạng câu hỏi" + "Thành phần" thành **Cấu hình** (nhãn `T · Q`); tách "Nội dung" thành G1 Ảnh chung, G2 Bài đọc (`theo T`), G3 Câu hỏi (`theo Q`), G4 Khung từ; khối chưa có hiện mờ với nút thêm tại chỗ; công tắc tính năng câu chuyển vào "Tùy chọn của câu" dưới Q; bỏ "Áp mẫu" và ô "Đáp án" cũ ở cột trái. Không đổi dữ liệu / dàn trang. Test mới `test31.py`. Hình duyệt: `docs/MINH_HOA_COT_TRAI.html`.

## AC. v83 (2026-10-26) — xem WS_EDITOR_SPEC.md mục 20
Thu gọn theo thẻ + liên kết chọn khối, Nối Task / xóa có hỏi, G1 ô ảnh lớn, ⓘ thủ thuật viết, câu ảnh + chữ hai cột, Q7 tick đáp án, câu ví dụ hiện trên trang, nhớ dạng câu hỏi (`qmem`, `qmemLin`).

## AD. v84 (2026-10-26) — xem WS_EDITOR_SPEC.md mục 21
Ảnh chung ở mọi dạng, chọn đúng khối G3 / GT, căn lề Task kéo theo ảnh, cỡ chữ mặc định Vừa, hàng bảng 12 mm, nhãn a b c, khối tự do + Thêm / nhiều ảnh, độ rộng ảnh %, hội thoại cắt trang.

## AB. BÀN GIAO (2026-10-27, bản v99) — đọc mục này đầu tiên khi mở thread mới
- **v95–v99** làm hết `docs/KE_HOACH_v95.md` (spec mục 27–31): Q2 điểm bắt đầu / chiều dài / số hàng; bảng số thứ tự + tùy chọn ở cột trái; Căn lề Khối text; bảng chọn đáp án có ô tích; ảnh trong ô bảng. Báo cáo `docs/BAO_CAO_PHIEN_2026-10-27_phien8.md` mục 2.
- **Ô chữ:** đã tự trải nghiệm, 4 vấn đề chờ người dùng quyết (`docs/TRAI_NGHIEM_O_CHU.md`): tên / câu mẫu sai dạng, chưa có danh sách gợi ý Across / Down gắn số, tìm từ chưa dùng được, gợi ý cú pháp lưới ở cột phải.
- Vẫn gác: G1 + G2 kiểu báo chí (mục dưới).

## AB-cũ. BÀN GIAO (2026-10-27, bản v94) — đọc mục này đầu tiên khi mở thread mới
- **Bản v94** (spec mục 26): popup "+ Task" làm lại: chọn Dạng câu hỏi (Q) rồi Bố cục (T), có xem trước lorem, chọn vị trí chèn. Báo cáo `docs/BAO_CAO_PHIEN_2026-10-27_phien8.md`.
- **Gác lại (người dùng): G1 + G2 kiểu báo chí** (chữ bao quanh ảnh có sẵn ở Bố cục "Ảnh trong bài đọc"; kiểu mỗi hàng một ảnh + một ô chữ cần G2 thành danh sách đoạn có ảnh riêng, câu hỏi mở: xen kẽ trái / phải tự động hay chọn từng hàng). Hình ở nhánh `claude/project-thread-171y6n`.
## AB-cũ. BÀN GIAO (2026-10-26, bản v93)
- **Bản v93** (spec mục 25): MD mang `Chữ câu hỏi: đậm`, `Xáo vế phải: có`, `Khối ảnh: tên (n ảnh)`. Nền là v92 (mục dưới).
- **Đang chờ người dùng chọn việc lớn tiếp theo** (đã hỏi, Claude đề xuất chi tiết trang): chi tiết trang (tiêu đề phiếu, Họ tên / Lớp / Ngày, header / footer) · bản đáp án giáo viên · G2 bố cục riêng. Cả ba là tính năng mới: vẽ phương án, chờ duyệt rồi mới code.
- **Chờ người dùng:** PDF thật để làm P3; câu hỏi 1, 2, 4 của bàn giao v84 (câu 3 "Q3 có cần ô tick" đã giải quyết ở v87).

## AB-cũ. BÀN GIAO (2026-10-26, bản v92)
- **Bản v92** (spec mục 24, báo cáo `docs/BAO_CAO_PHIEN_2026-10-26_phien7.md`): xác định đáp án đúng ngay trong khung soạn cho mọi dạng Q (trừ Q9 tô theo nét, Q12 viết tự do): Q3 dòng đáp án có ô tích + "+"; ô đáp án luôn hiện + chip "x/y câu có đáp án"; Q4 chip `{*đúng|sai}` và tìm lỗi sai; Q8 "Xáo vế phải khi in"; đáp án từng chỗ trống (chọn từ Khung từ); Q10 ô `=đáp án`.
- **Việc tiếp theo:** người dùng thử v92 và góp ý; bản đáp án giáo viên; MD mang `shuffle`; việc tồn ở bàn giao v86.

## AB-cũ. BÀN GIAO (2026-10-26, bản v86)
- **Bản v86** (spec mục 23, báo cáo `docs/BAO_CAO_PHIEN_2026-10-26_phien6.md` mục 3): cột trái 420 px; chữ câu hỏi Đậm; thanh B I U dính ở G2, G3; đáp án + ô tích màu #0a6b75, ô tích nhiều đáp án đúng; ảnh chung ở lưới ảnh có panel riêng (Fit đúng); câu hỏi có ảnh chung cắt được trang. Mọi mục của `docs/DANH_SACH_VIEC_v85.md` đã làm.
- **Việc tiếp theo:** chi tiết trang (tiêu đề phiếu, Họ tên/Lớp/Ngày, header/footer); P3 với PDF thật; G2 bố cục riêng; MD chưa mang `qbold`, `x.n`, `qmem`; 4 câu hỏi chờ từ v84.
- Cách chạy test như bàn giao v85.

## AB-cũ. BÀN GIAO (2026-10-26, bản v85)
- **Bản v85** (spec mục 22, báo cáo `docs/BAO_CAO_PHIEN_2026-10-26_phien6.md`, danh sách việc `docs/DANH_SACH_VIEC_v85.md`): Q8/Q9 hiện Khung từ; Fit dùng tỉ lệ thật của ảnh; ảnh thứ hai và ảnh khung từ có Fit + Zoom riêng; bỏ "Khối của bài"; G3 "Câu hỏi" + thanh B I U ___ {a|b}; khoảng cách mặc định Gọn; hộp hỏi xóa nền mờ, bấm ngoài = Hủy; mỗi bài một câu ví dụ.
- **Mặc định mới cần nhớ:** khoảng cách Gọn (phiếu mẫu 10 trang). test2 / cmp_v80 đưa về Vừa trước khi so.
- **Chờ người dùng xác nhận (chưa làm):** A3 Task 5 không tách trang (gửi phiếu); C3 cột trái 420 px; D2 chữ câu hỏi Đậm (phạm vi); F1 màu xanh dấu đáp án; F2 ô tích chọn đáp án đúng (ở đâu). A2 "ô ảnh Task 3 lúc đúng lúc sai": đã sửa nguyên nhân tìm được, chưa có ca tái hiện của người dùng.
- **Việc tiếp theo cũ vẫn còn:** chi tiết trang (tiêu đề phiếu, Họ tên/Lớp/Ngày, header/footer); P3 với PDF thật; G2 có bố cục riêng; 4 câu hỏi chờ từ v84.
- Cách chạy test: cần `pip install playwright==1.63.0` (Chromium có sẵn ở /opt/pw-browsers khi chạy trên cloud). Quy tắc như bàn giao v82.

## AB-cũ. BÀN GIAO (2026-10-26, bản v84)
- **Bản v84** (spec mục 21) sửa 10 góp ý sau v83. v83 (mục 20) = hoàn thiện cột trái + nhớ dạng câu hỏi; v82 (mục 19) = cột trái theo khối.
- **Mặc định mới cần nhớ:** cỡ chữ Vừa (không ghi vào phiếu), hàng bảng 12 mm, nhãn chữ thường. test2 so với bản cũ phải đặt lại To + 14 mm trước khi so.
- **Chờ người dùng:** nghĩa "khoảng cách / ký hiệu trên dòng trống" ở ⓘ; xác nhận nhớ dạng câu hỏi chỉ ở JSON; Q3 có cần tick như Q7; xác nhận cách hiểu "khối tự do nhiều ảnh" = nhiều ảnh cạnh nhau. Bàn giao đầy đủ: mục 0 của `docs/BAO_CAO_PHIEN_2026-10-26_phien5.md`.
- **Việc tiếp theo:** chi tiết trang (tiêu đề phiếu, Họ tên/Lớp/Ngày, header/footer); P3 với PDF thật; G2 có bố cục riêng.
- Cách chạy và quy tắc như bàn giao v82. test16 đôi khi báo không ổn định khi chạy cả bộ.

## AB-cũ. BÀN GIAO (2026-10-26, bản v83) — đọc mục này đầu tiên khi mở thread mới
- **Bản v83** (spec mục 20, báo cáo `docs/BAO_CAO_PHIEN_2026-10-26_phien5.md`) hoàn thành V1–V10. Bản v82 là cột trái theo khối (mục 19).
- **Chờ người dùng:** (1) "khoảng cách / ký hiệu trên dòng trống" ở ⓘ nghĩa là gì; (2) xác nhận nhớ dạng câu hỏi lưu trong file JSON phiếu (MD không mang); (3) Q3 có cần tick như Q7; (4) cách hiểu câu ví dụ.
- **Việc tiếp theo:** chi tiết trang (tiêu đề phiếu, Họ tên/Lớp/Ngày, header/footer); P3 với PDF thật; G2 có bố cục riêng.
- Cách chạy và quy tắc như bàn giao v82 bên dưới. test16 có thể báo không ổn định khi chạy cả bộ.

## AB-cũ. BÀN GIAO (2026-10-26, bản v82) — đọc mục này đầu tiên khi mở thread mới
- **Bản v82** (mục AT, spec mục 19): cột trái theo khối. Báo cáo: `docs/BAO_CAO_PHIEN_2026-10-26_phien5.md`.
- **Việc tiếp theo:** người dùng thử cột trái mới; P3 (PDF thật + MD AI tạo theo prompt v81); tiêu đề phiếu / Họ tên Lớp Ngày / header footer (thread "chi tiết trang" mới mở đầu, chưa bàn); G2 bố cục riêng (để sau); G3 chia nhóm (hoãn).
- **Chờ duyệt (chưa code):** `docs/VAN_DE_CAN_XU_LY.md` (V1 ô ảnh G1, V2 ⓘ thủ thuật viết + thanh chèn ký hiệu, V3 câu có ảnh chia 2 cột).
- Cách chạy test, nhập file, nguyên tắc: như mục AB-cũ (v81) dưới đây. Test2 so với bản v81 (`git show <commit v81>:ws-editor-prototype.html`, có `fonts/` cạnh file).

## AB-cũ. BÀN GIAO (2026-10-26 tối, bản v81)
- **Bản v81** (mục AS, spec mục 18): kiến trúc trình bày mới đã vào `main`. Phiếu cũ mở ra giống v80 (cmp_v80 16/16). Khôi phục v80: nhánh `backup/v80`.
- **Đã chạy trên bản cuối v81:** xem báo cáo `docs/BAO_CAO_PHIEN_2026-10-26_phien4.md` (test1–30, audit, cmp_v80).
- **Việc tiếp theo:** P3 với PDF thật + MD do AI tạo theo prompt v81 (người dùng gửi); sau đó tiêu đề phiếu / Họ tên Lớp Ngày / header footer; G3 chia nhóm (hoãn); cân nhắc bỏ "Áp mẫu" / chọn loại đáp án cũ ở cột trái khi người dùng quen bộ chọn Q.
- **Không còn dùng artifact.** Xong việc thì commit và đẩy lên GitHub `khanhtoaninv/WS-Editor`, nhánh main. Repo: file chính `ws-editor-prototype.html`, `docs/`, `tests/`, `fonts/`, `samples/`.
- **Cách chạy:** `bash tests/run_all.sh <mới.html> <cũ.html>` (bản cũ cần thư mục `fonts/` cạnh file); `python3 tests/cmp_v80.py <mới.html> <v80.html>` (lấy v80 từ nhánh `backup/v80`).
- **Cách nhập:** + Task / + Phiếu; JSON chính, MD theo `QUY_UOC_MD.md` (v81: `Dạng:` …), chữ thô là đoán. Prompt cho AI: `PROMPT_PDF_SANG_PHIEU.md` (v81).
- Chỉ báo "đạt" cho test đã chạy trên bản cuối; mẫu do Claude tự viết không thay được phiếu do AI khác viết.

## AB-cũ. BÀN GIAO (2026-10-26, bản v80)
- **Bản v80** (mục AR) ký hiệu chữ + 4 sửa khác. **Bản v79** sửa lỗi câu nhiều dòng (mục AQ). **Bản v78** ô chữ giải đố (mục AP; v77 dọn việc nhỏ, mục AO; v76 điểm trên ảnh chung, mục AN; v75 bài đọc có chỗ trống / chọn / đánh dấu / cắt theo đoạn, mục AM; v74 G-Text kiểu Ảnh, mục AL; v73 kiểu Chữ, mục AK; v72 cỡ chữ phiếu, mục AJ). **Việc tiếp theo:** xem `docs/BAO_CAO_PHIEN_2026-10-26_phien3.md` (kiến trúc trình bày mới T / Q / G, đang chờ người dùng duyệt, chưa code). Đã chạy trên bản cuối v79: test1–27 và audit; test28 theo báo cáo v80.
- **Không còn dùng artifact.** Xong việc thì commit và đẩy lên GitHub `khanhtoaninv/WS-Editor`, nhánh main (người dùng yêu cầu). Repo: file chính `ws-editor-prototype.html`, `docs/`, `tests/`, `fonts/`, `samples/`.
- **Đã chạy trên bản cuối v70:** test1, 3–19, audit (0 vấn đề), audit2 (không tràn), cmp_paste (20 bài dán giống v69), ws_sea (3 trang, 0 lỗi) đạt, 0 lỗi console. `test2` so với v69: 31/32, chỗ lệch duy nhất là Task 5 phiếu mẫu (đã định, xem mục AI).
- **Cách chạy:** `bash tests/run_all.sh <mới.html> <cũ.html>`; `cmp_paste.py <mới> <cũ>`; `ws_sea.py` ghi ra `/home/claude/ws/ws-sea-sample.json` (cần tạo thư mục), bản đó khác `ws-sea-sample.json` trong repo ở trường `part:""` từ v68 (không phải lỗi v70, chưa tái xuất mẫu).
- **Đang dở, đọc trước:** `docs/KIEN_TRUC_TRINH_BAY_MOI.html` (thay `DANG_DO_KEO_DOI_CHO_VA_G_TEXT.md`): kiến trúc mới, quyết định đã chốt ở báo cáo phiên 3; chưa sửa code.
- **Việc tiếp theo (thứ tự người dùng chốt): (2) cú pháp MD cho khối G-Text, điểm trên ảnh, đáp án chỗ trống; (3) tiêu đề phiếu / Họ tên Lớp Ngày / header footer.** Sau đó P3 (người dùng gửi PDF thật + MD do AI tạo + ảnh sau khi nạp, thêm vào `tests/real/`), P4 (Ô chữ), công tắc Họ tên / Lớp (hoãn)..
- **Cách nhập:** như v65 (+ Task / + Phiếu; JSON chính, MD theo `QUY_UOC_MD.md`, chữ thô là đoán). Prompt cho AI: `PROMPT_PDF_SANG_PHIEU.md`.
- Chỉ báo "đạt" cho test đã chạy trên bản cuối; mẫu do Claude tự viết không thay được phiếu do AI khác viết.
