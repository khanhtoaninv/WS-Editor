# Báo cáo phiên 13 (28/10/2026): kiểm thử chất lượng GĐ0, 1a, 1b

## 0. BÀN GIAO (đọc đầu tiên)
- **App vẫn là v112, phiên này không sửa code.** Chỉ kiểm thử, thử tay cùng người dùng, lập kế hoạch.
- **Việc của phiên sau (người dùng đã duyệt, chạy MỘT MẠCH không dừng hỏi):** làm hết `docs/KE_HOACH_SUA_SAU_KIEM_THU.md` đợt 1 → 5, rồi gói bàn giao dev. Mọi chỗ mơ hồ: theo mục "Quyết định mặc định" cuối file đó, ghi lại trong báo cáo phiên. Sau mỗi đợt: đủ bộ test, cập nhật spec (mục mới), tăng badge, commit + push `main`.
- Đổi chuẩn so sánh 120: người dùng đồng ý cho các thay đổi dàn trang 3.3 (khoảng bài nối), 3.4 (T/F theo tỉ lệ), 3.10 (ảnh đồng đều). Tạo lại chuẩn bằng `ws-editor.html` mới **sau khi** đã kiểm các phần khác vẫn khớp (so trước, chỉ các phiếu có bài nối / T/F / ảnh được lệch), ghi rõ trong báo cáo.

## 1. Đã kiểm (máy) trên v112
Đường chuẩn 120/120, giaodien 2497/2497, 49 test cũ + audit, gd1a 72/72, gd1b 82/82, shared 11/11. Chi tiết và lỗi tìm được: `docs/KIEM_THU_GD0_1A_1B.md`.

## 2. Thử tay của người dùng (2 vòng)
- Vòng 1 (kịch bản B/C): `docs/KET_QUA_KIEM_THU_TAY_2026-10-28.md`. Trang nhập: https://claude.ai/artifact/8mkMH7rtgCnrV37H9fGNw5
- Vòng 2 (phiếu 32 Task `tests/gd0/phieu-kiem-thu-tay.md`): `docs/KET_QUA_KIEM_THU_PHIEU_DU_DANG_2026-10-28.md`. Trang nhập: https://claude.ai/artifact/QLdVpVpf5BLBbeKxsfUJpq (đọc bằng công cụ ArtifactData, collection `tasks` và `general`).
- Lỗi đã xác nhận: nối vế phải trùng chữ; dấu câu chấm đúng hết; T/F đáp án `T` với nhãn True/False; gõ dài tràn trang; không báo chỗ chưa có đáp án; không chấm tay được; đáp án "lúc hiện lúc không" (chưa có quy luật, người dùng không tái hiện được).

## 3. Quyết định trong phiên
- Bảng viết tắt chuẩn cho máy chấm: `docs/TUONG_TAC/BANG_VIET_TAT_CHUAN.md` (đổi quyết định GĐ0 "không mở rộng viết tắt"). Không suy nghĩa theo bối cảnh bài đọc (máy chấm phải cho kết quả cố định).
- Gợi ý cách viết khác khi nhập đáp án: **cách A**, chip dưới ô (`docs/TUONG_TAC/MINH_HOA_GOI_Y_DAP_AN.png`).
- T/F: mọi kiểu căn **theo tỉ lệ**.
- Ảnh đồng đều theo số ảnh trên hàng + Fit ô + thanh kéo cả khối: `docs/TUONG_TAC/MINH_HOA_ANH_DONG_DEU.png` (duyệt).
- T02 (hội thoại) không có vấn đề; ngắt trang giữ nguyên.
- Prompt PDF → MD cần quy tắc 26 `[x]` cho ô đúng của bảng chọn (phát hiện khi người dùng làm phiếu thật, Task 9).
- Bàn giao dev: dev rà soát, tối ưu, build lại để deploy; bạn (người dùng) vẫn cập nhật bản mẫu. Quy trình: phát hành bản có số + ghi chú thay đổi; mỗi tính năng có mô tả hành vi + phiếu mẫu + kết quả mong đợi; dev chạy bài kiểm khớp chuẩn; dev góp ý bằng mô tả + phiếu tái hiện. Nội dung bàn giao 10 mục (xem kế hoạch, mục "Bàn giao dev").

## 4. Tệp mới trong phiên
`docs/KIEM_THU_GD0_1A_1B.md`, `docs/KICH_BAN_KIEM_THU_TAY.md`, `docs/KET_QUA_KIEM_THU_TAY_2026-10-28.md`, `docs/KET_QUA_KIEM_THU_PHIEU_DU_DANG_2026-10-28.md`, `docs/KE_HOACH_SUA_SAU_KIEM_THU.md`, `docs/TUONG_TAC/BANG_VIET_TAT_CHUAN.md`, `docs/TUONG_TAC/MINH_HOA_GOI_Y_DAP_AN.png`, `docs/TUONG_TAC/MINH_HOA_ANH_DONG_DEU.png`, `tests/gd0/phieu-kiem-thu-tay.md`.

## 5. Lưu ý kỹ thuật cho phiên sau
- `bash tests/run_all.sh` phải gọi bằng **đường dẫn tuyệt đối** (script tự `cd tests`); `tests/chuan/giaodien.py` cần 2 tham số (`ws-editor.html ws-editor-prototype.html`).
- Chỗ sửa lỗi nối: `rightRow` / `optOfRow` trong `app/src/viewer/answers.ts` và `workClick` trong `Presenter.tsx` tìm hàng theo chữ.
- Dấu câu: `EDGE_PUNCT` trong `shared/src/normalize.ts`. T/F: `TF_ALIAS` trong `app/src/core/slots.js`.
- Chụm hai ngón: `.vstage` không có `touch-action`, chưa thử trên máy thật.
