# Bắt đầu phiên mới — WS Editor

Cập nhật: 2026-10-25 (tối). Bản prototype hiện tại: **v70** (v68: Nối Task, MD `### Phần`; v69: font phiếu; v70: Đúng/Sai 80/20, A4 tự động theo Task, nút Xuất MD). Không dùng artifact nữa: xong việc đẩy lên GitHub khanhtoaninv/WS-Editor, nhánh main.

## Cách dùng
**Quan trọng:** ô Instructions của Project hiện vẫn là câu ngắn cũ (chưa trỏ tới mục BÀN GIAO). Hoặc dán nội dung `PROJECT_INSTRUCTIONS.md` vào ô đó (một lần), hoặc mở đầu mỗi thread mới bằng câu: **"Đọc claude/BAT_DAU_PHIEN_MOI.md trước, rồi:"** + lệnh ở mục 2.

Mở thread mới trong Project "WS Editor", dán MỘT trong các lệnh ở mục 2. Thread mới tự đọc tài liệu theo Instructions (đọc spec, mở prototype, đọc mục "BÀN GIAO"), không cần giải thích lại.

## 1. Việc Claude phải làm đầu thread (đã có trong Instructions, ghi lại để chắc)
1. Đọc `WS_EDITOR_SPEC.md` (mục 16 = nhập file) và mở `ws-editor-prototype.html`.
2. Đọc `claude/WS_EDITOR_SPEC_v37_bo_sung.md`, mục cuối "BÀN GIAO".
3. Nếu việc là nhập file / đọc PDF: đọc `claude/PHUONG_AN_NHAP_FILE.md` (P0–P2 đã xong, còn P3–P4) và `claude/QUY_UOC_MD.md`.
4. Tải artifact hiện tại (action read, KHÔNG kèm path) để được phép publish vào cùng URL. Muốn có bản đầy đủ trên đĩa: read lại với path `index.html`, bỏ dòng khung `<!doctype…><body>` đầu và `</body></html>` cuối (ra đúng file trong Project).
5. Dựng lại thư mục làm việc: prototype + spec, và `claude/tests/*` (gồm `ws-sea-sample.json`, thư mục `md/`, `run_all.sh`) vào `/home/claude/ws/tests`. Fixture ảnh (ref.png, tall.png, wide.png, qr_up.png, big.jpg) không nằm trong Project; tạo lại bằng Pillow (lệnh ở mục E0 của bổ sung).

## 2. Lệnh mẫu (dán nguyên văn)
**Thử một PDF mới (P3):** người dùng chạy prompt `claude/PROMPT_PDF_SANG_PHIEU.md` (cách B) với AI của họ, gửi PDF + MD + ảnh sau khi nạp; Claude phân loại chỗ sai theo 5 nhóm (đọc sai chữ / prompt / bộ đọc / mô hình thiếu / dàn trang) rồi sửa đúng lớp. Hoặc đường chat:
> Đọc file PDF đính kèm, ra JSON phiếu đủ trường theo mẫu `claude/ws-sea-sample.json` (hoặc MD theo `claude/QUY_UOC_MD.md`), nạp thử bằng + Phiếu trong app, báo phần nào đúng và phần nào còn thiếu. Không cần giống bố cục gốc, chỉ cần đủ nội dung.

**Làm mẫu Ô chữ (P4):**
> Làm bước P4: mẫu có sẵn "Ô chữ" (bảng chữ cái + khung từ), ẩn cột/hàng đầu thừa, nhập bằng cách dán một khối chữ.

**Chỉ kiểm tra hiện trạng:**
> Chạy lại toàn bộ test trên bản hiện tại và báo kết quả, chưa sửa gì.

## 3. Những điều cần nhớ (tránh lặp lại lỗi)
- Nạp JSON thiếu trường giờ đã tự bù (v63), nhưng JSON xuất cho người dùng vẫn nên đủ trường: schema, id, title, age, page, spacing, flow, tasks. Mẫu chuẩn: `claude/ws-sea-sample.json`.
- Từ v61 mỗi Task mở ra chỉ mở thẻ 3 Nội dung. Test phải tự mở thẻ 1/2/4 qua `SECT.kind=true;SECT.info=true;SECT.parts=true;refreshSel()` sau khi chọn Task.
- Từ v67 MD chỉ nhận hội thoại qua khối `Hội thoại:`; `☐` là lựa chọn có ô tick (A4 `lab:'box'`). Mỗi phiếu thật mới: thêm vào `tests/real/` + test.
- Từ v64 không còn nút "Dán…": test vào hộp nhập bằng `#tree [data-lib]` → `#libDlg [data-tab=src]`; + Phiếu là `#tree [data-newsheet]`.
- Chạy test từng cái (hoặc `bash run_all.sh <mới> <cũ>`, mỗi test một tiến trình); thực tế 5–35 s mỗi test, audit ~2 phút. Không dùng `pkill -f tests/test`.
- Khi báo kết quả: chỉ nói "đạt" cho những test đã chạy trên BẢN CUỐI.
- Đăng lại: đọc artifact (action read) trước, rồi publish cùng `file_path` vào cùng URL; sau đó project_write file, gửi file cho người dùng, nhắc thay vào Project.
- Người dùng không cần tái hiện đúng bố cục tài liệu gốc, chỉ cần đủ nội dung. Mỗi file một phiếu.

## 4. Quyết định đã chốt về nhập file (tóm tắt, chi tiết ở PHUONG_AN_NHAP_FILE.md mục 5 và 7)
- Hai nút: **+ Task** (thẻ Mẫu có sẵn | Từ file / dán; luôn thêm vào cuối; nhiều Task thì bảng chọn; file 1 Task chèn luôn) và **+ Phiếu** (bảng nhận diện, xác nhận + tải JSON cũ rồi thay phiếu; trống = phiếu rỗng). Không còn "Dán…".
- Nguồn chính: JSON. MD theo quy ước cũng chính xác. Chữ thô là đường phụ, ghi "đoán, độ chắc thấp".
- Mỗi file một phiếu. Nhập không bao giờ ghi đè Task có sẵn. Lỗi không đổi phiếu đang mở.

## 5. Danh sách file trong Project (cập nhật 2026-10-25 tối)
- `PROJECT_INSTRUCTIONS.md` (dán nội dung vào ô Instructions của Project nếu chưa)
- `WS_EDITOR_SPEC.md` (có mục 16), `ws-sample.json`, `ws-editor-prototype.html` (v70; chạy local cần thư mục `fonts/` cạnh file)
- `claude/WS_EDITOR_SPEC_v37_bo_sung.md` (mục AC–AH; mục cuối: BÀN GIAO v70)
- `claude/PHUONG_AN_NHAP_FILE.md`, `claude/QUY_UOC_MD.md`, `claude/PHUONG_AN_CONG_THUC.md`
- `claude/ws-sea-sample.json` (phiếu Wonders of the Sea, đủ trường; bản sao ở `claude/tests/ws-sea-sample.json` cho test)
- `claude/tests/`: test1–19, audit, audit2, shot, cmp_paste, ws_sea, run_all.sh, `md/sea.md`, `md/mau-tron.md`, `md/nghe-bang.md`, `md/birthday.md`, `real/birthday-user.md` (MD gốc người dùng nhận từ AI, giữ nguyên), `real/birthday.pdf`
- `claude/PROMPT_PDF_SANG_PHIEU.md` (prompt cho AI đọc PDF; v68)
