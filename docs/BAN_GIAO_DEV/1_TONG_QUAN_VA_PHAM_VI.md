# Bàn giao dev 1: Tổng quan và phạm vi (v117, 28/10/2026)

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

**Chưa có / ngoài phạm vi:** tài khoản, lưu trên máy chủ, chia sẻ, học sinh làm bài (GĐ1c, cần TeacherResource), điểm danh / báo cáo lớp, in PDF trong app, đa ngôn ngữ giao diện (giao diện tiếng Việt).

## 4. Cấu trúc mã
| Thư mục | Nội dung |
|---|---|
| `app/` | Vite 8 + TypeScript 7 + React 19 + Zustand. `npm run build` → `ws-editor.html` (một file, ở gốc repo, font ở `fonts/`) |
| `app/src/core/` | Mô hình phiếu (`model.js`), dàn trang ra HTML (`layout.js`), đọc / ghi MD (`md.js`), chỗ trả lời + khóa chấm (`slots.js`), gợi ý đáp án (`sug.js`). JS thuần, tách nguyên văn từ bản v106 |
| `app/src/legacy/app.js` | ~2.150 dòng điều khiển cũ (chọn, kéo, lệnh, nhập file) chưa chuyển hết sang React |
| `app/src/ui/` | Ba cột (cột trái `tree/`, trang `stage/`, cột phải `insp/`), hộp thoại, kho `store.ts` |
| `app/src/viewer/` | Trình chiếu + làm bài (`Presenter.tsx`, `work.ts`, `answers.ts`, `ink.ts`, `Tools.tsx`, `Note.tsx`) |
| `shared/` | Kiểu gói `wsp/0`, chuẩn hóa chữ, chấm, gợi ý, kiểm khuôn; `npm test` (node --test). Dùng chung với TeacherResource |
| `ws-editor-prototype.html` | Bản v106 đóng băng (một file JS thuần), chỉ để so sánh |
| `tests/` | Playwright (Python) + bộ chuẩn, xem file 2 |
| `docs/` | Đặc tả, báo cáo từng phiên, kế hoạch |

## 5. Đọc gì trước
1. `docs/WS_EDITOR_SPEC.md` (mục 18 trở đi là kiến trúc hiện tại; mục 44–48 = v113–v117).
2. `docs/TUONG_TAC/1_TONG_QUAN_KIEN_TRUC.md`, `2_CHUAN_GOI_PHIEU.md`.
3. `docs/KE_HOACH_REACT.md` mục 8 (tiến độ chuyển React, bẫy đã gặp).
4. File 2–4 trong thư mục này.
