# Bàn giao phiên Tạo bài (bộ file sinh bài, 11/11/2026)

Nhánh: `claude/trusting-fermi-15qavp`. Đọc file này trước khi làm bất cứ việc gì.

## 1. Đã có
- **Bộ file bản 2** (`docs/TAO_BAI/CAU_TRUC_*.md`, `TRINH_TU_SINH_MAU.md`, `SO_DO_LUONG_SINH_PHIEU.html`): khung thiết kế, dùng chung mọi chuyên đề và cấp độ.
- **Bộ chạy thử** (`docs/TAO_BAI/BO_AI_STARTERS/`): lesson mẫu can / can't, cấp Starters cuối.
  - `nguon/` gồm 10 file gốc, chỉ có nội dung gửi AI. Đây là nơi sửa.
  - `ghep_lenh.py` ghép `nguon/` thành 3 lệnh dán vào AI (`11_LENH_SINH_PHIEU.md`, `12_LENH_RA_SOAT.md`, `13_LENH_SUA_PHIEU.md`) và `KIEM_TRA_PHIEU.html`. Chạy lại mỗi khi sửa `nguon/`.
  - `cong_cu/kiem_tra_khung.html` là nguồn của trang máy kiểm. Các số liệu Starters được ghép vào đó.
  - `HUONG_DAN_THU.md` và `PHIEU_CHAM_THU.md`: các bước thử bên ngoài app và phiếu chấm.
  - `SO_DO_LUONG_SINH_PHIEU.html`: sơ đồ luồng, đánh số 1–15 cho từng file.
  - `BO_AI_STARTERS_IN.pdf`: bản in tổng hợp, 53 trang.
- **Gói** `docs/TAO_BAI/BO_AI_STARTERS.zip`. Có thể đã cũ so với `nguon/`, nên đóng lại sau khi sửa.
- **Đã thử**: một phiếu tự viết qua máy kiểm, 0 lỗi. Hai phiếu cài lỗi, máy bắt đủ. Bản dán nạp vào WS Editor v130: đúng 5 Task, đúng đáp án, không lỗi tràn.

## 2. Quyết định đã chốt
- Lesson mẫu: can / can't, cuối Starters. Phiếu 5 Task (Q10 → Q3 → Q4 → Q1 → Q2), mức Vừa.
- Cấp độ Starters: 5 Task, 4–6 câu mỗi Task, thường 5. Bài đọc 60–80 từ, mức Vừa 65–75. Phần đề tối đa 12 từ ở Vừa. Từ vựng là danh sách Starters, kèm số 1–20 và tên riêng.
- Dạng bảng: bài đọc viết trong `Khối chữ trên:` vì app hiện bỏ mất `Bài đọc:` trong Task bảng.
- Đổi dòng `Bố cục: Task k` thành `Task số: k`, vì app đã dùng `Bố cục:` cho việc khác.
- Chọn phương án mục tiêu: có dữ kiện mới làm đáp án. Kiến thức đời thường về con vật quen thuộc được tính là dữ kiện (cá biết bơi). Không dùng điều có thể tranh cãi.
- File Cấp độ được giữ, vì tương lai sẽ làm mọi chuyên đề ở mọi cấp độ.

## 3. Lỗi và vấn đề đã biết
- **App bỏ mất `Bài đọc:` trong Task dạng bảng.** Chưa sửa app. Bộ lệnh đang né bằng `Khối chữ trên:`.
- **App xếp A/B/C hàng ngang.** Chưa sửa. Cần xếp dọc theo G10.
- **App chưa đọc được dạng mới**: `Task số:`, `Dạng:` cho các dạng mới, `## Báo cáo`, mã K trong Kiến thức.
- **Chưa có danh sách ngữ pháp Starters** (Grammar and structures list). Mục "Ngoài phạm vi" của Kiến thức mẫu do Claude tự ghi, chưa đối chiếu được.
- **Chưa có AI thật chạy bộ này.** Mọi phiếu mẫu do Claude tự viết.
- **Các số tham số chưa thử thật**: 12 từ phần đề, 20 / 40 / 60 %.
- **Câu mẫu chưa được giáo viên duyệt.** Claude viết bản đầu.
- **Gói zip và PDF có thể đã cũ** so với `nguon/`. Cần dựng lại sau mỗi lần sửa.
- **Các file thiết kế cũ** (`TRINH_TU_SINH_CHINH_THUC.md`, `MAU_TRINH_TU_SINH.md`, `1_DANG_Q.md`, `CHUNG_1_QUY_TAC_MD.md`, `SO_DO_TRINH_TU_SINH.html`) vẫn còn. Chờ giáo viên đồng ý xoá.

## 4. Việc tiếp theo (theo thứ tự)
1. **Chạy thử với AI thật**, 1 lesson, 3 lần sinh, mỗi lần một chat A mới. Ghi vào `PHIEU_CHAM_THU.md`.
2. Chạy rà soát ở chat B. So đáp án tự làm với phiếu. Ghi lỗi theo nhóm: Kiến thức / Trình tự / Câu mẫu / Quy tắc MD / AI không tuân thủ.
3. Sửa đúng file gây lỗi trong `nguon/`, chạy `python3 ghep_lenh.py`, rồi thử lại. Tối đa 2 vòng.
4. Giáo viên duyệt bộ Câu mẫu (`nguon/5_CAU_MAU_GRAMMAR.md`).
5. Quyết định về danh sách ngữ pháp Starters: giáo viên tải lên, hoặc bỏ qua.
6. Sau khi chốt bộ file, dựng lại zip và PDF.
7. Sau đó mới làm code: sửa bộ đọc của app (dòng `Bài đọc:` trong Task bảng, xếp dọc A/B/C), rồi đọc `Task số:` và mã K.

Chưa làm: xoá các file cũ, chuyên đề khác, cấp độ khác.

## 5. Cách làm việc với giáo viên
- Trả lời tiếng Việt, ngắn, thẳng. Góp ý trung thực, không khen cho có.
- Ý tưởng mới: thảo luận trước, chưa sửa file. Chỉ sửa khi giáo viên nói rõ.
- Không bịa nguồn. Danh sách ngữ pháp Starters chưa có thì nói chưa có.
- Chấm điểm bộ file thì nói rõ là chấm trên giấy hay từ kết quả thử thật.

## 6. Lệnh mở phiên sau
```bash
cd /home/user/WS-Editor && git checkout claude/trusting-fermi-15qavp && git pull && cat docs/TAO_BAI/BAN_GIAO_PHIEN_TAO_BAI.md
```
Sau đó nhắn: "Đọc bàn giao và tiếp tục mục 4, bước 1."
