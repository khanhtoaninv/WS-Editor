# Dữ liệu mẫu tạm cho module Tạo bài (T0)

Một giáo trình (Pinta English 3), một unit (Unit 5 · My weekend), 4 lesson thuộc 3 chuyên đề:

| Lesson | Chuyên đề | Ghi chú |
|---|---|---|
| Lesson 1 · Weekend activities | Từ vựng | |
| Lesson 2 · was / were | Ngữ pháp | lesson của hai hình mẫu |
| Lesson 3 · Past simple | Ngữ pháp | dùng chung Trình tự + TF với Lesson 2 |
| Lesson 4 · Tom's Saturday | Nghe | Kiến thức có Track + Script |

**Định dạng tạm**, mô tả ở `docs/TAO_BAI/DINH_DANG_TAM.md`. Chốt định dạng thật ở thảo luận cấu trúc file; khi đó chỉ sửa
`shared/src/taobai/doc.ts` và `server/src/taobai/nguon.ts`.

```
tao-bai/
  <mã giáo trình>/
    giao-trinh.md                    tên, tuổi, chuyên đề, unit, lesson (+ chuyên đề của lesson)
    chuyen-de/<mã chuyên đề>/trinh-tu.md
    chuyen-de/<mã chuyên đề>/tf.md
    kien-thuc/<u5-l2>.md             một file mỗi lesson (u<số unit>-l<số lesson>)
```
Bộ file chung (mọi giáo trình) không nằm ở đây: lấy từ `docs/TAO_BAI/` (xem `server/src/taobai/nguon.ts`, hằng `CHUNG`).

Kiểm tra nhanh: `node --experimental-strip-types server/src/taobai/nguon.ts` in danh sách giáo trình và lỗi / cảnh báo từng lesson.
