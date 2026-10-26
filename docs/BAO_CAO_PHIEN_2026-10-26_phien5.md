# Báo cáo phiên 26/10/2026 (phiên 5) — v82: cột trái theo khối

## 1. Kết quả
- **v82 trên `main`**: cột trái của Task xếp theo khối, khớp các khối trên trang: **Cấu hình** (nhãn `T · Q`) · **G0** Tiêu đề · **G1** Ảnh chung · **G2** Bài đọc (`theo T`) · **G3** Câu hỏi (`theo Q`) · **G4** Khung từ · **GT** Khối tự do. Chi tiết: `docs/WS_EDITOR_SPEC.md` mục 19.
- Không đổi dữ liệu, không đổi dàn trang: phiếu cũ vẽ ra giống v80 (cmp_v80).

## 2. Quá trình thảo luận và quyết định của người dùng
Người dùng đề xuất (thread "Sắp cột Task theo khối G"): gộp "Bố cục & dạng câu hỏi" và "Thành phần của bài" thành **Cấu hình**; tách "Nội dung" thành G1–G4; mục đích là sau khi nhập file vẫn sửa được từng khối (một dạng "update bài"). Claude phân tích 4 điểm cần chốt, vẽ hình minh họa `docs/MINH_HOA_COT_TRAI.html`. Người dùng đồng ý cả 4:
1. "Thành phần" tách đôi: công tắc **bật / tắt khối** ở "Khối của bài" (trong Cấu hình); **tính năng của câu** (Ảnh mỗi câu, Người nói, Vế ghép, Ô nhiều dòng, Ghi đáp án…) ở "Tùy chọn của câu" dưới bộ chọn Q.
2. Khối chưa có: mục vẫn hiện, mờ, có nút thêm ngay tại mục (bỏ ô "Thêm khối").
3. G2 / G3 không có bố cục riêng: G3 luôn theo Q (Q suy ra từ nội dung G3), G2 theo vị trí trong T. Bố cục riêng cho bài đọc để sau.
4. Bỏ "Áp mẫu" và ô "Đáp án" cũ khỏi cột trái (Áp mẫu vẫn còn ở hộp + Task).

## 3. Kiểm thử trên bản cuối (đã chạy)
- `bash tests/run_all.sh` test1–31 + audit: **tất cả đạt**, 0 lỗi console, audit 0 vấn đề. test16 có một lần lỗi thời gian chờ ("element is not stable" khi bấm) trong lượt chạy đủ bộ; chạy lại riêng 2 lần đều đạt (coi là chập chờn, không liên quan cột trái).
- `tests/cmp_v80.py`: tất cả phiếu giống v80.
- Mới: `test31.py` (cấu trúc mục trên 18 Task, nhãn T · Q, khối có / chưa có, tách công tắc, nút thêm tại mục + hoàn tác, Bảng, mở mục thu khi cần gõ).
- Sửa test theo tên mục mới: test1, 2, 7, 8, 9, 10, 15, 21, 22, 23, 29 (test9 / test10 áp mẫu bằng `applyRecipe` vì ô chọn đã bỏ; test29 dùng nút thêm tại mục).

## 3b. Sửa lỗi sau v82 (người dùng hỏi về Task 1 demo)
Đổi Dạng câu hỏi ở Task 1 thấy `{…|…}` trên phiếu. Nguyên nhân: Q4 cố ý điền giữ chỗ `{…|…}` cho câu chưa có lựa chọn, nhưng đổi sang dạng khác thì nó không bị dọn nên hiện nguyên chữ. Đã sửa (spec mục 19.4), thêm kiểm tra vào test31; chạy lại đủ bộ + cmp_v80 đạt. Nên tách rõ: dấu này ở Q4 là chỗ để giáo viên điền, không phải lỗi; chỉ việc nó sót lại sau khi đổi dạng mới là lỗi.
- test16 lỗi chập chờn ("element is not stable" khi bấm) trong lượt chạy đủ bộ, hai lượt liền (cả lúc trước khi sửa), chạy riêng đều đạt. Chưa tìm ra nguyên nhân, nghi tương tranh chờ tải font / cuộn.

## 4. Chưa kiểm thử / giới hạn
- Chưa xem trên màn hình nhỏ. Inspector (cột phải) không đổi.
- Người dùng chưa thử bản v82 trên máy.

## 5. Việc tiếp theo
1. Người dùng thử cột trái mới, góp ý.
2. Chi tiết trang: tiêu đề phiếu / Họ tên Lớp Ngày / header footer (đã mở đầu thảo luận, chưa chốt).
3. P3: PDF thật + MD AI tạo theo prompt v81.
4. G2 bố cục riêng (khi cần); G3 chia nhóm (hoãn).

## 6. Ghi chú kỹ thuật
- Khối `v82` ở cuối file, ngay sau `hết v81`, trước `window.__ws`. Bọc `edHtml`: dựng HTML v81 vào `<template>`, phân con của mục "content" cũ theo `data-k` (`.imgrow` → G1, `lead.*` → G2, `wb.*` / `.wbth` → G4, còn lại → G3), dựng lại các mục. Muốn đổi bố cục cột trái thì sửa ở đây.
- Khóa mục mới: `cfg g0 g1 g2 g3 g4 gt` (`SECT_DEF` bị thay trong khối v82; khóa cũ `kind info content parts free` không còn). Test cũ dùng `SECT.free` / `data-stg=parts` phải đổi.
- `blkaddb` (nút) dùng `blkAdd` của v81 rồi mở mục tương ứng (`BLK_SEC`).
- Môi trường đám mây: cần `pip install playwright==1.63.0` để khớp Chromium cài sẵn; bản v80 để so lấy bằng `git fetch origin backup/v80`.

## Phần 2: v83 (V1–V10)
Làm hết danh sách vấn đề người dùng tổng hợp theo thứ tự V7+V9 → V5/V6 → V8 → V1–V3 → V4. Chi tiết: spec mục 20.
- Điểm khó nhất là V4 (nhớ dạng câu hỏi): ba lần viết lại. Bản cuối: cất bản chụp khi rời dạng, trả nguyên bản nếu chưa ai sửa, gộp ba bên nếu đã sửa, thêm `qmemLin` cho vòng a→b→c→a.
- Đã chạy: test32 (8/8) trên bản cuối; kết quả cả bộ xem cuối báo cáo chat.
- Chưa làm / hỏi lại: nghĩa "khoảng cách / ký hiệu trên dòng trống"; Q3 tick; MD không mang `qmem`.
