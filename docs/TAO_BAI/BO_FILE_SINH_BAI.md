# Bộ file sinh bài (bản 2, 11/11/2026)

Chuẩn: phiếu Grammar cuối cấp độ Starters. 5 Task, khoảng 25 phút, 4–6 câu mỗi Task, bài đọc 60–80 từ.

Mỗi thông tin chỉ nằm ở một file. Muốn sửa điều gì thì sửa đúng file chứa điều đó.

| File | Một file cho | Chứa | Ai viết |
|---|---|---|---|
| `CAU_TRUC_CAP_DO.md` | một cấp độ | học sinh, quy mô phiếu, độ dài bài đọc và phần đề, quy tắc từ vựng | giáo viên |
| `TU_VUNG_NEN_STARTERS.md` | cấp độ Starters | danh sách từ A–Z của Cambridge Pre A1 Starters (2018) | nguồn Cambridge, giáo viên tải lên |
| `CAU_TRUC_KIEN_THUC.md` | một lesson | kiểu ngữ pháp (nghĩa / hình thức), mục tiêu, cấu trúc (Dùng khi, Dấu hiệu bề mặt, Câu hỏi lộ đáp án), dạng câu cần phủ, từ vựng, lỗi thường gặp | giáo viên |
| `CAU_TRUC_TRINH_TU.md` | một chuyên đề | các bước B, Dạng Q cho phép, bảng Mức độ, quy tắc toàn phiếu, tiêu chí kiểm định | giáo viên |
| `CAU_TRUC_CAU_MAU.md` | một Trình tự | câu Đạt và Không đạt cho từng cặp B + Dạng Q | Claude viết bản đầu, giáo viên duyệt |
| `CAU_TRUC_MO_TA_DANG_Q.md` | dùng chung | Q1–Q12 là gì, ràng buộc cứng | cố định |
| `CAU_TRUC_QUY_TAC_MD.md` | dùng chung | cú pháp app đọc được | cố định, đổi theo app |
| `CAU_TRUC_CACH_THUC_DAT_CAU_HOI.md` | dùng chung | nguyên tắc viết câu hỏi (Haladyna và cộng sự, 2002) | cố định |
| `CAU_TRUC_BO_CUC.md` | một phiếu | Task nào, Dạng Q nào, mấy câu, mức nào, số liệu tính sẵn | app sinh, giáo viên chỉnh |
| `CAU_TRUC_RA_SOAT.md` | dùng chung | lượt AI thứ hai: tự làm bài, tìm lỗi; danh sách app tự kiểm | cố định |
| `TRINH_TU_SINH_MAU.md` | ví dụ | Trình tự sinh đã ghép cho một phiếu 6 Task | app ghép |

## Luồng sinh một phiếu
1. **App lập Bố cục.** App lập Bố cục từ Trình tự, giáo viên chỉnh. App tính số liệu theo bảng Mức độ.
2. **App ghép Trình tự sinh.** Trình tự sinh có 9 mục: Vai trò và Cấp độ, Quy tắc MD, Cách thức, Mô tả Dạng Q, Trình tự đã lọc, Câu mẫu đã lọc, Ghi chú giáo viên, Bố cục, Lệnh. App gửi Trình tự sinh kèm Kiến thức cho AI.
3. **AI sinh phiếu.** AI viết cả phiếu trong một lượt và kèm `## Báo cáo`.
4. **App tự kiểm.** App kiểm theo bảng trong file Rà soát. Task sai thì sinh lại.
5. **AI rà soát.** Lượt Rà soát dùng phiếu đã bỏ đáp án. AI tự làm bài và tìm lỗi. Task lỗi được sinh lại, tối đa 2 lần.
6. **Giáo viên duyệt.** Giáo viên đọc phiếu và Báo cáo.

## Chưa làm
- **Chưa thử với AI thật.** Các số 8/12/16 từ phần đề và 20/40/60% chỉ là điểm khởi đầu.
- **Chưa có danh sách ngữ pháp Starters.** Đó là Grammar and structures list trong handbook của Cambridge. Khi có, thêm mục Ngữ pháp nền vào file Cấp độ.
- **File từ vựng thiếu số đếm.** File đã tải lên không có danh sách số; file Cấp độ tạm cho phép số 1–20.
- **App chưa đọc được dạng mới.** Bộ đọc của app chưa nhận `Dạng Q:`, `Bố cục: Task k`, `## Báo cáo`, mã K và các dòng mới của Kiến thức.
- **Sơ đồ HTML đã cũ.** `SO_DO_TRINH_TU_SINH.html` còn ghi 8 mục và chưa có Câu mẫu, Rà soát.
- **Các file cũ chưa xử lý.** `TRINH_TU_SINH_CHINH_THUC.md`, `MAU_TRINH_TU_SINH.md`, `1_DANG_Q.md`, `CHUNG_1_QUY_TAC_MD.md` thuộc thiết kế cũ, chờ quyết định bỏ.

## Bộ chạy thử với AI (11/11/2026)
Thư mục `BO_AI_STARTERS/`: các file chỉ có nội dung gửi AI (`nguon/`), 3 lệnh đã ghép sẵn (`11_LENH_SINH_PHIEU.md`, `12_LENH_RA_SOAT.md`, `13_LENH_SUA_PHIEU.md`), trang máy kiểm `KIEM_TRA_PHIEU.html`, hướng dẫn `HUONG_DAN_THU.md` và phiếu chấm `PHIEU_CHAM_THU.md`. Lesson mẫu: can / can't. Sửa file trong `nguon/` rồi chạy `python3 ghep_lenh.py` để ghép lại.
