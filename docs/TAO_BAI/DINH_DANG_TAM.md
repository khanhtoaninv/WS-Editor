# Định dạng TẠM của file dữ liệu Tạo bài (T0)

29/10/2026 · v124 · **Tạm thời**, chỉ để T1–T5 có dữ liệu chạy thử. Định dạng thật chốt ở thảo luận cấu trúc file (Kiến thức / Trình tự / TF / file chung); khi đó chỉ sửa `shared/src/taobai/doc.ts` (tách chữ → dữ liệu) và `server/src/taobai/nguon.ts` (đọc thư mục), giao diện không đổi.

Bộ mẫu: `server/demo/tao-bai/` (Pinta English 3 · Unit 5 · 4 lesson / 3 chuyên đề). Xem nhanh: `node --experimental-strip-types server/src/taobai/nguon.ts`.

## Thư mục

```
<thư mục dữ liệu>/                 (biến môi trường TAOBAI_DATA; mặc định server/demo/tao-bai)
  <mã giáo trình>/
    giao-trinh.md
    chuyen-de/<mã chuyên đề>/trinh-tu.md
    chuyen-de/<mã chuyên đề>/tf.md
    kien-thuc/u<số unit>-l<số lesson>.md
```
File chung (mọi giáo trình): `docs/TAO_BAI/CHUNG_1_QUY_TAC_MD.md` (số 1), `docs/TAO_BAI/1_DANG_Q.md` (số 2); số 3–5 chưa có (app báo "chưa có", không chặn).

## giao-trinh.md
```
# Pinta English 3
Mã: pinta-english-3          ← không ghi thì lấy tên thư mục
Tuổi: 7-9                    ← 5-6 / 7-9 / 10-12

## Chuyên đề
- ngu-phap: Ngữ pháp         ← "- mã: Tên"

## Unit 5: My weekend
- Lesson 2: was / were | ngu-phap     ← "- Lesson n: tên | mã chuyên đề" (đúng MỘT chuyên đề)
```
Mã lesson tự sinh: `u5-l2` (file Kiến thức `kien-thuc/u5-l2.md`).
**Lỗi** (không cho tạo bài): lesson không gắn / gắn nhiều chuyên đề, chuyên đề không có trong danh sách, trùng unit / lesson.

## trinh-tu.md (kiểu "lai")
```
# Trình tự · Ngữ pháp
Phiên bản: 7
Số trang tối đa: 2           ← không ghi: 2

## Bước 1: Khởi động
Vai trò: nhận diện cấu trúc mới
Dạng: Q4, Q7, Q3             ← mã Q được phép (nên 1–3)
Số câu: 5-6                  ← khoảng; Q12 hiểu là số dòng
Bắt buộc: có                 ← có / không
Tối đa: 1 bài                ← 1 hoặc 2 (không ghi: 2)
Chi tiết: câu ngắn           ← hiện ở màn Ra đề, gửi AI
Các dòng khác: ghi chú riêng của bước, chỉ gửi AI.

## Nguyên tắc
- … (chỉ gửi AI)
```
**Lỗi:** bước thiếu `Dạng:` / `Số câu:`, mã Q lạ, số câu ngoài 1–30, file không có bước nào, **bước cho phép Qn mà TF không có dạng nào ghi Qn**.
**Cảnh báo:** thiếu `Phiên bản:` / `Vai trò:` / `Bắt buộc:` (coi là bắt buộc), quá 3 Q, có Q11, `Tối đa` > 2 (dùng 2).

## tf.md
```
# TF · Ngữ pháp
Phiên bản: 3

## Dạng 1: Chọn từ đúng trong ngoặc
Dạng app: Q4 Chọn trong câu   ← đúng MỘT mã Q
Hướng dẫn mẫu, mô tả, ví dụ: chữ tự do, gửi AI.
```

## kien-thuc/<lesson>.md
Chỉ chuẩn hóa **thành phần**, không chuẩn hóa nội dung. App đọc `## Mục tiêu` (hiện ở màn Ra đề; thiếu thì cảnh báo) và `## Từ vựng` (nếu có); mọi mục khác (`## Điểm kiến thức`, `## Lỗi hay gặp`, `## Track`, `## Script`…) giữ nguyên để gửi AI.
```
# Kiến thức · Unit 5 · Lesson 2: was / were
Phiên bản: 1
## Mục tiêu
Dùng đúng was / were …
## Từ vựng
yesterday, last Sunday, …
## Điểm kiến thức
…
```

## Dữ liệu app nhận (kiểu ở `shared/src/taobai/types.ts`)
`chiTietLesson()` trả `ChiTietLesson`: giáo trình, unit, lesson, chuyên đề, `kienThuc`, `trinhTu` (đã tách bước: `{so, ten, vaiTro, q[], min, max, batBuoc, toiDa, chiTiet, them}`), `tf` (`{so, ten, q}`), `chung` (5 file, có / chưa có + phiên bản), `loi[]`, `canhBao[]` (mỗi dòng: file, số dòng nếu biết, lý do).
