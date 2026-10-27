# shared/ (ws-shared)

Phần dùng chung giữa WS Editor, file xuất và máy chủ TeacherResource (GĐ0, `docs/TUONG_TAC/KE_HOACH_GD0.md`).
Hợp đồng dữ liệu: `docs/TUONG_TAC/2_CHUAN_GOI_PHIEU.md`. Khi tài liệu và mã lệch nhau, mã ở đây là nguồn sự thật, sửa tài liệu theo.

- `src/types.ts`: kiểu Slot, KeyEntry, Answers, Result (chuẩn `wsp/0`).
- `src/normalize.ts`: chuẩn hóa chữ khi so khớp (tài liệu 2 mục 6.2).
- `src/grade.ts`: `grade(slots, key, answers, overrides?)` → kết quả. Hàm thuần, chạy ở trình duyệt và Node.
- `src/validate.ts`: kiểm khuôn slots + key (trả danh sách lỗi, không ném).
- `fixtures/`: phiếu mẫu + bài làm mẫu + kết quả mong đợi (B5).

TypeScript chỉ dùng cú pháp xóa được (`erasableSyntaxOnly`): Node ≥ 22.18 chạy thẳng file `.ts`, không cần biên dịch, không thêm thư viện.

Chạy test: `cd shared && node --test test/*.test.ts` · Kiểm kiểu: `npm run typecheck` (dùng tsc của `app/`).
