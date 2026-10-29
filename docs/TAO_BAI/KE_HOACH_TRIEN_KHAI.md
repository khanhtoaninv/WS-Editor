# Kế hoạch triển khai module Tạo bài vào WS Editor

Bản 1 · 29/10/2026 · theo `DAC_TA_TAO_BAI.md` bản 1. **Tiến độ (phiên 17, 29/10): T0 (v124), T1 (v125), T2 (v126), T3 (v127) xong**; số bản các giai đoạn sau dịch lên 1 vì T0 sửa bộ đọc thành một bản riêng. Báo cáo: `docs/BAO_CAO_PHIEN_2026-10-29_phien17.md`. Lệch kế hoạch: máy kiểm nằm ở `app/src/taobai/maykiem.ts` (cần mô hình phiếu của app), không ở `shared/`; T3 làm luôn phần "quay lại Ra đề rồi Sinh bài: giữ bài không đổi" (mục 5.6, kế hoạch để ở T4).

## 0. Cách làm

- **Gắn thêm, không viết lại editor.** Mã mới nằm trong thư mục riêng: `app/src/taobai/` (React + TS), `server/src/taobai/`, `shared/src/taobai/` (phần dùng chung: tách Trình tự, máy kiểm thuần, kiểu dữ liệu). Chỉ chạm vào editor ở vài điểm nối có tên (mục 2).
- **Mỗi giai đoạn là một bản thử tay được** (tăng badge `vNN`), giữ quy ước repo: cập nhật `WS_EDITOR_SPEC.md` (mục mới), báo cáo phiên, file `KIEM_TRA_*.md` cho người dùng thử tay, commit + push `main`.
- **Không phá cái đang chạy**: mỗi giai đoạn chạy lại `python3 tests/chuan/chuan.py so ws-editor.html` (120/120) và toàn bộ test (`bash tests/run_all.sh`, `npm run test:lop`), từng test một.
- **AI giả trước, AI thật sau**: mọi lời gọi AI qua máy chủ, test dùng máy chủ giả (như `LOP_AI_URL` của Insight AI). Chế độ AI ngoài (chép đoạn nhắc / dán kết quả) làm trước API, vì nó cũng là cách thử prompt.
- Phần phụ thuộc thảo luận cấu trúc file: dùng **bộ dữ liệu mẫu tạm** (1 giáo trình, 2 chuyên đề, 3 lesson) viết theo định dạng tạm, đọc qua **một mô-đun chuyển đổi duy nhất**; chốt định dạng thật thì chỉ sửa mô-đun này.

## 1. Thứ tự và phụ thuộc

```
T0 Chuẩn bị ──► T1 Duyệt + Lịch sử ──► T2 Kiểm tra máy + Hiện đáp án ──┐
       │                                                               ├──► T4 Sinh bài ──► T5 AI chấm ──► T6 Thử thật, chọn model
       └──────► T3 Ra đề (đọc dữ liệu, cấu trúc, layout sơ bộ) ────────┘
```
T1–T2 không cần AI và không cần dữ liệu giáo trình: thử được ngay trên phiếu nạp từ MD. T3 làm song song được với T1–T2.

## 2. Điểm nối với editor (chỉ những chỗ này bị chạm)

| Chỗ | File | Việc |
|---|---|---|
| Dải trên cùng | `ui/AppShell.tsx` | thêm `<TaoBaiBar/>` phía trên `.app` khi `ws.gen` có; CSS biến chiều cao để `.app` trừ đi |
| Nút Tạo bài | `ui/TopBar.tsx` | một nút cạnh "+ Phiếu" mở màn Ra đề |
| Biểu tượng trạng thái | `ui/tree/Tree.tsx` | một ô cuối dòng Task (đọc `task.gen.status`) |
| Ngăn trượt | `ui/AppShell.tsx` | `<TaoBaiDrawer/>` đặt tuyệt đối trên vùng `#insp` |
| Lớp đáp án / tô vàng | `ui/stage/Pages.tsx` | lớp phủ sau khi vẽ trang, dùng lại cách của `viewer/answers.ts` (vẽ lên trang, không dàn lại) |
| Dữ liệu | `core/model.js` | giữ nguyên `gen` khi sao chép / hoàn tác / lưu; bộ dàn bỏ qua `gen` |
| Xuất | `wsp/collect.ts`, `sheetToMd` | bỏ `gen` khỏi MD và gói |
| Trạng thái UI | `ui/store.ts` | thêm `taobai: {...}` (mở ngăn, bài đang xem, hiện đáp án, màn Ra đề) |

## 3. Các giai đoạn

### T0 · Chuẩn bị (v124: chỉ sửa bộ đọc MD) — XONG 29/10
- Bộ dữ liệu mẫu tạm `server/demo/tao-bai/` (Pinta English 3 · Unit 5: Lesson 1 Từ vựng, Lesson 2 Ngữ pháp was / were, Lesson 4 Nghe) + Trình tự / TF kiểu lai.
- `shared/src/taobai/types.ts` (kiểu `gen`, cấu trúc, tiêu chí) và mô-đun chuyển đổi `server/src/taobai/nguon.ts`.
- **Rà bộ đọc MD với 12 dạng Q do AI viết**: thử phiếu was / were ở hình mẫu cho thấy `Dạng: viết tự do` + `Khối chữ trên:` được nhận thành "Câu hỏi · viết câu" chứ không phải Q12. Kiểm tra lại từng Q, sửa bộ đọc hoặc quy tắc MD (file chung 1) trước khi cho AI viết.
- Bản nháp file chung 1 (quy tắc MD cho sinh bài, rút từ `QUY_UOC_MD.md`) để T4 dùng.
- **Xong khi:** đọc được dữ liệu mẫu bằng test; danh sách lỗi bộ đọc theo Q đã xử lý.

### T1 · Duyệt bài + Lịch sử (v125) — XONG 29/10
- `ws.gen` / `task.gen` trong mô hình; giữ qua lưu, mở, hoàn tác; bỏ khỏi MD / `.wsp`.
- Dải trên cùng (Duyệt bài n/N, Lịch sử phiếu, Xuất bản), biểu tượng trạng thái trong cây, **ngăn Duyệt bài** (chưa có phần Kiểm tra), **Lịch sử bài / phiếu** theo lần Duyệt (≤ 3), Dùng bản này / Xem / Khôi phục (có Hoàn tác), tự về "chưa duyệt" khi dấu nội dung khác bản duyệt.
- Xuất bản = Duyệt phiếu + mở hộp Gói .wsp, có hộp nhắc.
- Để thử khi chưa có AI: lệnh ẩn "Bật chế độ tạo bài cho phiếu này" (gắn `ws.gen` rỗng) cho phiếu nạp từ MD.
- **Test:** Playwright: duyệt / sửa → về chưa duyệt / sửa ngược → ✓ lại / lịch sử cắt ở 3 / Dùng bản này + Hoàn tác / Khôi phục phiếu / xuất MD và `.wsp` không có `gen`; chuẩn 120/120.
- **Thử tay:** `docs/TAO_BAI/KIEM_TRA_T1.md`.

### T2 · Máy kiểm + Hiện đáp án (v126) — XONG 29/10
- `shared/src/taobai/maykiem.ts`: các tiêu chí máy (mục 6.1 đặc tả) theo từng Q; tiêu chí Cả phiếu đo được bằng code (số trang, lặp câu).
- Phần **Kiểm tra a/b đạt** và khối **Cả phiếu** trong ngăn; chạy lại khi sửa (trễ ~0,5 s).
- Lớp **Hiện đáp án** (màu cam) và **tô vàng** câu lỗi trên trang.
- **Test:** đơn vị cho máy kiểm (mỗi Q một bộ đúng / sai); Playwright cho lớp đáp án trên đủ 12 Q; chuẩn 120/120 (lớp phủ tắt).
- **Thử tay:** `KIEM_TRA_T2.md`.

### T3 · Màn Ra đề (v127) — XONG 29/10
- API đọc: `/api/taobai/giao-trinh`, `/lesson/:id` (mục tiêu, chuyên đề, Trình tự đã tách bước, Q được phép, phiếu đã tạo).
- `app/src/taobai/RaDe.tsx`: khung chọn bài (thu gọn bằng tiêu đề), cấu trúc bài (mỗi bước một mục, +/✕, ⟳, menu Q, −/+ số câu, luật ngẫu nhiên), ghi chú cho AI.
- **Layout sơ bộ**: sinh Task giả theo Q + số câu, dàn bằng `core/layout` trong ô đo ẩn, vẽ trang thu nhỏ; báo vượt số trang.
- Nút Tạo bài trên thanh editor; quay lại Ra đề giữ cấu trúc.
- "Sinh bài" ở bản này: dựng phiếu khung (G0 + dạng Q, trạng thái ⏳) để T4 điền.
- **Test:** tách Trình tự (đơn vị); luật ngẫu nhiên (không hai bài liền cùng Q, giới hạn +/✕); layout sơ bộ khớp số trang của phiếu thật cùng cấu trúc trong sai số ±1 trang trên bộ mẫu.
- **Thử tay:** `KIEM_TRA_T3.md`.

### T4 · Sinh bài (v128)
- `server/src/taobai/nhac.ts`: dựng đoạn nhắc sinh một bài (mục 8.1); `server/src/taobai/sinh.ts`: gọi AI (dùng lại `ai.ts`, model theo biến `TAOBAI_MODEL`), song song tối đa 3, gửi lại đúng chỗ lỗi tối đa 2 lần.
- App: điền từng bài khi xong (cây ⏳ → ○ / ⚠), đọc bằng `core/md.js`, máy kiểm; **Sinh lại bài này** kèm góp ý; không ghi đè bài đang gõ.
- **Chế độ AI ngoài**: nút Chép đoạn nhắc / ô Dán kết quả cho từng bài; tự bật khi không có máy chủ hoặc khóa.
- Quay lại Ra đề rồi Sinh bài: chỉ sinh bài đổi / mới (mục 5.6), có "Sinh lại cả phiếu".
- Nhật ký `du-lieu/tao-bai/nhat-ky.jsonl` (sinh, sinh lại, duyệt, sửa tay, góp ý, token, model, phiên bản file).
- **Test:** máy chủ AI giả trả MD đúng / sai cú pháp / sai số câu / chậm / lỗi 429; Playwright luồng đầy đủ Ra đề → Sinh → Duyệt → Xuất bản; chế độ AI ngoài.
- **Thử tay:** `KIEM_TRA_T4.md` (có phần thử với AI thật nếu đã có khóa).

### T5 · AI chấm theo rubric (v129)
- `server/src/taobai/cham.ts`: lượt gọi riêng chấm một bài theo file chung 4 (trả JSON tiêu chí + lý do); chấm Cả phiếu (phủ kiến thức, độ khó tăng dần).
- Gộp vào phần Kiểm tra (nhóm "AI chấm theo rubric"), nút "Chấm lại"; lưu điểm vào nhật ký (không hiện cho giáo viên).
- Chế độ AI ngoài: đoạn nhắc chấm để chép.
- **Test:** máy chủ giả; tiêu chí hiện đúng nhóm, đúng ẩn / hiện theo Q.

### T6 · Thử thật và chọn model (không đổi giao diện)
- Bộ thử: ≥ 6 lesson thật thuộc ≥ 2 chuyên đề, dữ liệu theo định dạng file đã chốt.
- Chạy cùng bộ với **Haiku 5.5** và **Sonnet 5.5** (sinh và chấm có thể khác model); ghi: tỉ lệ bài đạt hết máy kiểm, tỉ lệ đạt rubric, tỉ lệ câu chỉ cần hiểu nghĩa (ngưỡng 20%), thời gian, chi phí mỗi phiếu.
- Giáo viên duyệt mù (không biết model): tỉ lệ duyệt không sửa / sửa nhẹ / sinh lại.
- **Tiêu chí đạt để dùng** (đề xuất, chốt khi bắt đầu T6): ≥ 90% bài đạt hết máy kiểm sau tối đa 2 lần gửi lại; ≥ 70% bài giáo viên duyệt không cần sinh lại; mọi bài ≤ 20% câu chỉ cần hiểu nghĩa.
- Kết quả: chọn model mặc định, sửa file chung / Trình tự / TF theo lỗi gặp, ghi `docs/TAO_BAI/KET_QUA_THU_T6.md`.

## 4. Việc để sau (không nằm trong kế hoạch này)
- Trang admin nạp / sửa giáo trình, Trình tự, TF, Kiến thức (bản này nạp bằng thư mục trên máy chủ).
- Trang thống kê cho admin (đọc nhật ký mục 6.3 đặc tả).
- Bài tự do (cách 2 của quy trình ban đầu).
- Chuyển máy chủ sang hạ tầng TeacherResource (nợ N14, N15).

## 5. Rủi ro

| Rủi ro | Cách đỡ |
|---|---|
| AI viết MD sai cú pháp / sai dạng | bộ đọc của app + gửi lại đúng chỗ lỗi; T0 rà bộ đọc theo 12 Q; file chung 1 riêng cho sinh bài |
| Layout sơ bộ lệch xa phiếu thật | dàn bằng chính `core/layout`; đo sai số ở T3, ghi rõ "ước tính" |
| Chạm editor làm hỏng chuẩn 120 | chỉ chạm các điểm nối mục 2; `gen` bị bộ dàn bỏ qua; chạy chuẩn mỗi giai đoạn |
| `legacy/app.js` (nợ N1) khó nối hoàn tác / chọn bài | đi qua cầu `L` sẵn có; không sửa logic legacy, chỉ thêm hàm gọi |
| Chi phí / thời gian AI | song song 3 bài, model rẻ cho chấm; đo ở T6 |
| Định dạng file dữ liệu chưa chốt | mô-đun chuyển đổi duy nhất + bộ mẫu tạm |
| AI chấm sai | chỉ cảnh báo, giáo viên quyết định; không hiện điểm |

## 6. Ước lượng
T0: 1 phiên · T1: 1–2 phiên · T2: 1 phiên · T3: 1–2 phiên · T4: 2 phiên · T5: 1 phiên · T6: tùy dữ liệu thật (thử tay của người dùng là phần chính). "Phiên" = một phiên làm việc với Claude như các phiên trước.
