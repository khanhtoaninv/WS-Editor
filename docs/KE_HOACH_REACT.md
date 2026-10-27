# Kế hoạch chuyển WS Editor sang React + Cloudflare

Ngày 27/10/2026. Bản nháp thảo luận, **chưa code**. Hiện trạng: v106, một file `ws-editor-prototype.html` (~7.900 dòng, ~329 hàm, 2 khối script), 49 test Playwright.

## Mục tiêu
Chuyển xong sang React rồi mới build tính năng mới. Không được sai sót: phiếu cũ phải dàn trang giống hệt bản hiện tại.

## Hướng: "bóc dần", không viết lại
1. **Chốt đường chuẩn.** Từ v106 xuất ảnh chụp + JSON dàn trang cho mọi phiếu mẫu (`samples/`, `tests/real/`), mở rộng `tests/cmp_v80.py`. Bản React phải khớp.
2. **Tách phần không giao diện** thành module (vẫn trong HTML): mô hình dữ liệu, đọc/xuất MD, thuật toán dàn trang. Đo lại so với đường chuẩn.
3. **React + Vite (TypeScript)**, chuyển giao diện từng mảnh (cột trái, popup "+ Task", khung soạn, trang xem trước), so ảnh sau mỗi mảnh.
4. **Tắt bản cũ chỉ khi khớp hết.** Giữ nhánh `backup/v106`.
5. Xong mới làm tính năng mới.

Lưu ý: dàn trang đo DOM thật, nên giữ thành module riêng, React gọi sau khi render và sau khi font tải xong.

## Quyết định (chờ người dùng xác nhận)
- TypeScript (đề xuất; 12 kiểu Q, 4 kiểu T nhiều dạng dữ liệu, TS bắt lỗi khi chuyển).
- Store: Zustand, giữ nguyên hình dạng JSON hiện tại để file cũ vẫn mở được.

## Triển khai Cloudflare
- Giai đoạn A: Vite build ra file tĩnh → Cloudflare Pages (tự build khi push main). Cho team giáo viên dùng. Font `fonts/` phục vụ từ Pages.
- Giai đoạn B (sau): lưu phiếu trên mạng. Workers + D1 (phiếu) + R2 (ảnh; JSON chỉ giữ đường dẫn ảnh thay vì nhúng).
- Tài khoản: **trước mắt không đăng nhập, một tài khoản admin dùng chung** cho nhanh. Thiết kế dữ liệu có sẵn trường `ownerId` (mặc định "admin") để sau thêm đăng nhập (Cloudflare Access hoặc tự làm) không phải đổi mô hình. Vì không đăng nhập, bản đưa lên mạng nên chặn bằng Cloudflare Access hoặc mật khẩu chung nếu không muốn công khai.

## Việc tiếp theo (khi được phép)
Bước 1 (đường chuẩn) — không đụng code app.
