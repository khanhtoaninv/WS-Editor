# Bàn giao dev 1: Tổng quan và phạm vi (v122, 28/10/2026)

## 1. Sản phẩm là gì
**WS Editor**: công cụ để giáo viên tiếng Anh dàn trang phiếu bài tập A4 (đầu ra HTML, không in PDF trong app), rồi **chiếu phiếu** lên lớp và **làm thử** ngay trên phiếu (máy chấm đúng / sai). Sau này tích hợp vào **WS Studio**; phần phiếu tương tác sẽ dùng chung với **TeacherResource** (học sinh làm bài).

Người làm bản mẫu (product owner) là giáo viên, không lập trình. Bản mẫu là nguồn sự thật về **hành vi**; dev là nguồn sự thật về **chất lượng mã và vận hành**.

## 2. Vai trò hai bên
| Việc | Người dùng (bản mẫu) | Dev |
|---|---|---|
| Quyết định tính năng, hành vi, giao diện | ✔ | góp ý |
| Viết / sửa bản mẫu (`app/`, cùng Claude) | ✔ | |
| Mô tả hành vi + phiếu mẫu + kết quả mong đợi cho mỗi tính năng | ✔ (spec `docs/WS_EDITOR_SPEC.md`) | |
| Rà soát, tối ưu, viết lại phần cần thiết, build để deploy | | ✔ |
| Giữ bản deploy **khớp chuẩn** bản mẫu (bộ kiểm `tests/chuan/`) | | ✔ |
| Báo chỗ lệch / lỗi bằng mô tả + phiếu tái hiện | | ✔ |

## 3. Phạm vi bàn giao (v117)
**Có trong bản mẫu, dev nhận:**
- Soạn phiếu: Task xếp dọc; bố cục Task (4 kiểu T) + dạng câu hỏi (12 kiểu Q); khung ảnh; khoảng cách Gọn / Vừa / Thoáng / Tự do; xếp trang Liền trang / Tách trang; cắt Task dài sang trang sau không lặp tiêu đề.
- Nhập: Markdown theo `docs/QUY_UOC_MD.md` (thường do AI đọc PDF theo `docs/PROMPT_PDF_SANG_PHIEU.md` tạo ra), JSON, dán nhiều dòng. Nhập không ghi đè Task có sẵn; chỗ không hiểu phải báo.
- Xuất: JSON phiếu, MD, HTML trang.
- Đáp án trong khung soạn cho mọi dạng Q; chip gợi ý cách viết khác.
- Phiếu tương tác: chỗ trả lời và khóa chấm (`app/src/core/slots.js`) theo chuẩn gói `wsp/0` (`docs/TUONG_TAC/2_CHUAN_GOI_PHIEU.md`), máy chấm dùng chung `shared/`.
- Trình chiếu (`app/src/viewer/`): lật trang / Task, 1–2 trang, Cuộn, phóng, đáp án, bút, che / hé, đồng hồ, bảng trắng, đèn pin, ghi chú, làm thử + chấm tay.

**Thêm từ v118 (Mốc 1 xong):** xuất / mở gói phiếu tương tác `.wsp` (`shared/src/wsp.ts`, `zip.ts`, CLI `shared/bin/wsp.ts`; spec mục 49): ký Ed25519, mã hóa AES-GCM, khóa bọc RSA-OAEP, kiểm đủ mục 9 của `2_CHUAN_GOI_PHIEU.md` trước khi ký.

**Khu thử nghiệm Lớp học (Mốc 2, v119–v122, spec mục 50–53, `server/README.md`):** máy chủ Node nhỏ (không gói npm, JSON) chạy trên máy giáo viên để thử với học sinh thật. **Không phải TeacherResource và không thay nó**; dùng để rút ra yêu cầu cho TeacherResource. Có: lớp, nhận gói `.wsp`, phiên (mã + QR), học sinh làm / tự lưu / nộp trên trình xem vai `student`, theo dõi trực tiếp, kết thúc phiên, chấm chữa (trình xem vai `review` + bảng chấm), báo cáo lớp và từng em, nhận xét theo quy tắc, Insight AI (số liệu ẩn danh, khóa ở biến môi trường). Dev TeacherResource **dùng lại** `shared/` (chấm điểm `grade.ts`, gói `wsp.ts`, báo cáo `baocao.ts`) và trình xem `app/src/viewer/`; giao diện `app/src/lop/` chỉ là bản thử để tham khảo luồng.

**Chưa có / ngoài phạm vi:** tài khoản thật, lưu bền trên máy chủ công ty, nhiều giáo viên / lớp, đăng nhập học sinh, chia sẻ, in PDF trong app, đa ngôn ngữ giao diện (giao diện tiếng Việt).

## 4. Cấu trúc mã
| Thư mục | Nội dung |
|---|---|
| `app/` | Vite 8 + TypeScript 7 + React 19 + Zustand. `npm run build` → `ws-editor.html` (một file, ở gốc repo, font ở `fonts/`) |
| `app/src/core/` | Mô hình phiếu (`model.js`), dàn trang ra HTML (`layout.js`), đọc / ghi MD (`md.js`), chỗ trả lời + khóa chấm (`slots.js`), gợi ý đáp án (`sug.js`). JS thuần, tách nguyên văn từ bản v106 |
| `app/src/legacy/app.js` | ~2.150 dòng điều khiển cũ (chọn, kéo, lệnh, nhập file) chưa chuyển hết sang React |
| `app/src/ui/` | Ba cột (cột trái `tree/`, trang `stage/`, cột phải `insp/`), hộp thoại, kho `store.ts` |
| `app/src/viewer/` | Trình chiếu + làm bài (`Presenter.tsx`, `work.ts`, `answers.ts`, `ink.ts`, `Tools.tsx`, `Note.tsx`) |
| `shared/` | Kiểu gói `wsp/0`, chuẩn hóa chữ, chấm, gợi ý, kiểm khuôn, gói `.wsp` (ZIP, ký, mã hóa), báo cáo (`baocao.ts`); `npm test` (node --test). Dùng chung với TeacherResource |
| `server/` | Khu thử nghiệm Lớp học (Node, không gói npm), `npm run lop`; giao diện ở `app/src/lop/` build ra `server/public/lop.html` |
| `ws-editor-prototype.html` | Bản v106 đóng băng (một file JS thuần), chỉ để so sánh |
| `tests/` | Playwright (Python) + bộ chuẩn, xem file 2 |
| `docs/` | Đặc tả, báo cáo từng phiên, kế hoạch |

## 5. Đọc gì trước
1. `docs/WS_EDITOR_SPEC.md` (mục 18 trở đi là kiến trúc hiện tại; mục 44–48 = v113–v117, 49 = v118 gói .wsp, 50–53 = v119–v122 lớp thử).
2. `docs/TUONG_TAC/1_TONG_QUAN_KIEN_TRUC.md`, `2_CHUAN_GOI_PHIEU.md`.
3. `docs/KE_HOACH_REACT.md` mục 8 (tiến độ chuyển React, bẫy đã gặp).
4. File 2–4 trong thư mục này.
