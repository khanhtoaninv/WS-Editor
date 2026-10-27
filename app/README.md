# app/ — WS Editor bản dựng Vite (đang chuyển sang React)

Kế hoạch và tiến độ: `docs/KE_HOACH_REACT.md`.

- `npm install` (một lần), `npm run build` → `../ws-editor.html` (một file, mở bằng bấm đúp; font lấy từ `../fonts/`).
- `npm run dev` → chạy thử có tải lại nóng (`public/fonts` là liên kết tới `../fonts`).
- `npm run typecheck` → kiểm tra TypeScript.

Cấu trúc:
- `index.html`, `src/styles.css` — khung trang và CSS tách nguyên văn từ v106.
- `src/vendor/qrcode.js` — thư viện QR (MIT) như v106.
- `src/core/` — phần không giao diện, tách tự động bằng `scripts/tach-core.mjs`: `model` (bù trường, mặc định), `layout` (dựng HTML trang, đo, chia trang), `md` (đọc / xuất MD, JSON), `state` (phiếu đang mở `ws`; chỉ đổi qua `setWs`).
- `src/legacy/app.js` — phần giao diện cũ còn lại, chuyển dần sang `src/ui/` (React).
- `src/ui/` — giao diện React: `store.ts` (Zustand), `actions.ts`, `mount.tsx`, các mảnh đã chuyển.
- `scripts/cau-noi.ts` — gắn mọi tên cấp cao nhất của legacy / core lên `window` để test cũ (`tests/*.py`) gọi được.
