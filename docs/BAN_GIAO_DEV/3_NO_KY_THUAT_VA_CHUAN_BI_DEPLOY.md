# Bàn giao dev 3: Nợ kỹ thuật và chuẩn bị deploy

## 1. Nợ kỹ thuật đã biết
| # | Chỗ | Vấn đề | Gợi ý |
|---|---|---|---|
| N1 | `app/src/legacy/app.js` (~2.150 dòng) | Điều khiển cũ: chọn, kéo, lệnh, nhập file, phím tắt; ghi DOM trực tiếp, dùng biến toàn cục `ws`, `sel` | Chuyển dần sang `ui/` theo cách đã chốt (`KE_HOACH_REACT.md` 8.2) |
| N2 | `app/src/core/layout.js` | Dàn trang = nối chuỗi HTML, ~950 dòng, nhiều nhánh theo mã A1–A8 / T1–T9 | Giữ nguyên hành vi (bộ chuẩn 120); tách theo dạng Q khi viết lại |
| N3 | Biến toàn cục trên `window` (`cau-noi.ts`) | Cần cho bộ kiểm, không nên có ở bản deploy | Chỉ bật ở bản kiểm thử |
| N4 | Trình chiếu `Presenter.tsx` (~650 dòng) | Một component lớn; lớp đáp án / làm bài vẽ lên **bản sao HTML** trang bằng thao tác DOM sau mỗi lần vẽ (`applyAnswers`, `applyWork`) | Tách hook theo nhóm (bút, đáp án, làm bài, xem); giữ cách vẽ lên bản sao (không dàn lại) |
| N5 | Ảnh trong phiếu | Ảnh nhúng `data:` trong JSON phiếu; phiếu nhiều ảnh nặng | Lưu ảnh riêng khi có máy chủ |
| N6 | Lưu trên máy | Nét vẽ / ghi chú trình chiếu ở `localStorage` (`wsShow.ink:`, `wsShow.note:`) theo tên phiếu + dấu nội dung | Chuyển lên máy chủ khi có tài khoản |
| N7 | `vite.config.ts` | Cảnh báo `import "./scripts/cau-noi"` thiếu đuôi; font không giải được lúc build (để nguyên, đọc lúc chạy từ `fonts/`) | Sửa khi dựng lại cấu hình deploy |
| N8 | `ws-editor-prototype.html` | Bản v106 đóng băng chỉ để so `giaodien.py`; từ v113 cột trái / phải có ô mới nên so lệch có chủ đích | Bỏ khi bộ so giao diện có chuẩn mới |
| N9 | Lăn chuột trong trình chiếu | Chromium có lúc không cuộn vùng chiếu khi đầu chuột nằm trên chữ của trang đã phóng (chưa rõ nguyên nhân); v117 tự cuộn bằng `scrollBy` | Xem lại khi viết lại trình chiếu |
| N10 | Nhận giọng nói (ghi chú) | Dùng `SpeechRecognition` của trình duyệt (Chrome gửi âm thanh lên máy chủ Google); ngôn ngữ theo trình duyệt | Cân nhắc quyền riêng tư khi deploy cho trường |
| N11 | Chụm hai ngón trên màn cảm ứng | Chưa thử trên máy thật | Thử trên bảng tương tác của trường |
| N12 | App chạy chế độ quirks (không có `<!doctype>`) | Trang trong gói .wsp phải hiện cùng chế độ (`manifest.docMode = "quirks"`), nếu không dòng kẻ chỗ trống lệch 2 px; trình xem nơi nhập (TeacherResource, lớp thử) phải dựng trang không doctype | Thêm `<!doctype html>` cho app, dàn lại đường chuẩn 120, rồi xuất gói `docMode: "standards"` |
| N13 | Chữ ký gói .wsp | Chưa có dịch vụ ký của công ty: WS Editor ký bằng khóa thử trong trình duyệt (`dev-local-…`), máy chủ lớp thử ký bằng khóa riêng của nó | Dịch vụ ký phía công ty (khóa không nằm ở trình duyệt) trước khi phát hành |
| N14 | `server/` (lớp thử) | Chỉ là bản thử: không tài khoản, dữ liệu JSON trên máy giáo viên, một mật khẩu giáo viên, học sinh vào bằng mã phiên + chọn tên (không xác thực), SSE trong bộ nhớ, không kiểm kiểu bằng `tsc` (không có `@types/node`), chạy TS bằng `--experimental-strip-types` (Node ≥ 22.6) | Viết lại trên hạ tầng thật của TeacherResource; giữ hợp đồng API và `shared/` |
| N15 | Insight AI (`server/src/ai.ts`) | Gọi Messages API bằng HTTP thẳng, mẫu `claude-opus-5-5` mặc định; **chưa thử với AI thật**, chỉ thử bằng máy chủ giả | Dùng SDK chính thức khi vào TeacherResource; đo chi phí / chất lượng; giữ nguyên tắc chỉ gửi số liệu ẩn danh |

## 2. Chuẩn so sánh hiện hành
- Đường chuẩn dàn trang: `tests/chuan/v117/` (tạo lại ở v117 vì 3 thay đổi đã được người dùng duyệt: khoảng bài nối, T/F theo tỉ lệ, ảnh đồng đều). Trước đó `tests/chuan/v108/`. Chi tiết: báo cáo phiên 14 mục 3.
- Máy chấm: `shared/fixtures/` (sinh lại bằng `tests/gd0/slots_phieu.py` + `tests/gd0/tao_mau.mjs`).

## 3. Chuẩn bị deploy
- **Đầu ra hiện tại:** một file HTML tự chứa (React + CSS + JS nhúng) + thư mục `fonts/`. Chạy được bằng bấm đúp, không cần máy chủ.
- **Deploy web:** phục vụ tĩnh (HTML + `fonts/`). Không gọi mạng ngoài trừ: font (nếu không nhúng), nhận giọng nói của trình duyệt.
- **Trình duyệt:** đã kiểm trên Chromium (Playwright). Dùng `field-sizing: content` (Chrome 123+) cho hộp ghi chú / chữ bảng trắng, `:has()` cho CSS; Safari / Firefox cũ chưa kiểm.
- **Dữ liệu người dùng:** chỉ ở máy (file phiếu người dùng tự lưu, `localStorage`). Chưa có tài khoản, chưa đồng bộ.
- **Tích hợp WS Studio / TeacherResource:** dùng `shared/` làm gói chung (chuẩn hóa chữ, chấm, kiểu `wsp/0`); phiếu tương tác lấy chỗ trả lời từ `sheetSlots()` (`core/slots.js`).
- **Việc dev nên làm trước khi deploy:** bỏ cầu nối toàn cục ở bản deploy (N3), cấu hình build có hash + nén, kiểm Safari / Firefox, kiểm màn cảm ứng (N11), quyết định nhận giọng nói (N10).
