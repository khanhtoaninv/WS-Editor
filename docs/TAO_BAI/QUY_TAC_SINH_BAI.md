# Quy tắc sinh bài (bản 1 · đoạn nhắc `nhac-1`)

29/10/2026 · app v129 · **Bản do Claude tự đề ra để chạy thử** (người dùng: "thuật toán hoặc quy tắc sinh bài, bạn cứ tự đề ra, sau đó tôi thử và phản hồi lại, nhưng phải viết ra để sau này còn thảo luận"). Góp ý theo **mã S…**; đổi quy tắc nào thì sửa tài liệu này trước, rồi mới sửa code. Đổi đoạn nhắc thì tăng `NHAC_VER` (`shared/src/taobai/nhac.ts`); mỗi bài ghi phiên bản đoạn nhắc đã dùng (`task.gen.nhac`) để so các lần thử.

Mã: đoạn nhắc `shared/src/taobai/nhac.ts` (dùng chung cho máy chủ và AI ngoài) · điều phối `app/src/taobai/sinh.ts` · lượt gọi AI `server/src/taobai/api.ts` (`POST /api/taobai/ai`) + `thiet-lap.ts` (`goiAi`). Đặc tả gốc: `DAC_TA_TAO_BAI.md` mục 8.

---

## A. Gửi gì cho AI (đoạn nhắc)

| Mã | Quy tắc | Vì sao |
|---|---|---|
| **S1** | Mỗi lượt sinh **một bài** (một Task), không sinh cả phiếu một lần. | Đặc tả 8.1; sửa / sinh lại từng bài; lỗi một bài không kéo cả phiếu. |
| **S2** | **Phần hệ thống** (system): vai trò ("soạn bài cho học sinh *tuổi* ở Việt Nam, mỗi lần đúng một bài, chỉ trả MD"), rồi **file chung 1** (quy tắc MD) nguyên văn, **chỉ mục của dạng Q được giao** trong file chung 2 (vd chỉ "## Q1 Điền từ", không gửi 11 dạng kia), file chung 3 (hình thức) và 5 (phiếu mẫu) nếu đã có. | Phần cố định cho mọi bài; bớt chữ thừa để AI tập trung và đỡ tốn token. |
| **S3** | **Phần yêu cầu** theo thứ tự: ① thông tin phiếu (giáo trình · unit · lesson · chuyên đề · tuổi) ② **Kiến thức** nguyên văn ③ **Trình tự**: bước của bài (vai trò, dạng được phép, số câu, chi tiết, ghi chú riêng của bước) + "Nguyên tắc" chung ④ **TF**: các dạng có `Dạng app:` đúng Q của bài (nguyên văn) ⑤ **cấu trúc cả phiếu** (mỗi bài: bước, vai trò, Q, số câu; đánh dấu "← BÀI NÀY") ⑥ **các bài đã viết** (S9) ⑦ **ghi chú của giáo viên** (ô ở màn Ra đề) ⑧ (sinh lại) bản hiện tại + góp ý (S21) ⑨ dòng chốt **"BÀI CẦN VIẾT: Bài k · Qn tên · N câu"** kèm nhắc: đúng N câu đánh số (Q12: `Dòng viết: N`), tiêu đề theo "Hướng dẫn mẫu" của TF, ghi `Mục tiêu:` / `Ngữ cảnh:`. | AI thấy đủ bối cảnh (bài mình nằm đâu trong phiếu) nhưng yêu cầu cuối cùng rõ, một chỗ. |
| **S4** | Không gửi Kiến thức / Trình tự của lesson khác, không gửi bài của phiếu khác. | Tránh lẫn. |
| **S5** | Tuổi lấy từ giáo trình (`Tuổi:` trong `giao-trinh.md`); không có thì 7–9. | |
| **S6** | TF có **nhiều dạng cùng Q** → gửi hết, dặn "chọn MỘT dạng hợp với bước nhất". Có một dạng → gửi dạng đó. TF không có dạng nào cho Q → nói rõ, AI viết theo mô tả dạng Q (không xảy ra khi dữ liệu không lỗi: màn Ra đề đã chặn). | Người dùng định để mỗi bước 1–3 dạng, máy tự chọn; lúc thử nên để mỗi bước một dạng cho dễ so. |
| **S7** | Q11 Lưới không sinh tự động (file chung 1 mục 3; Trình tự có Q11 đã bị cảnh báo khi nạp). | AI dựng lưới ô chữ dễ sai. |

## B. Sinh cả phiếu

| Mã | Quy tắc | Vì sao |
|---|---|---|
| **S8** | Các bài ⏳ vào hàng chờ theo số thứ tự; **song song tối đa 3 bài** (máy chủ cũng giới hạn 3 lượt gọi AI cùng lúc, dư thì xếp hàng). | Nhanh hơn chạy lần lượt; không dồn quá nhiều lượt lên tài khoản AI. |
| **S9** | Bài **bắt đầu sau** nhận tóm tắt các bài **đã xong** lúc đó (tiêu đề, ngữ cảnh, 3 câu đầu) với lời dặn "không lặp câu, chọn ngữ cảnh khác". Bài chạy cùng lúc không thấy nhau → máy kiểm "Các bài không lặp câu" bắt phần còn sót. | Đổi lấy tốc độ; xem câu hỏi mở 1. |
| **S10** | Xong bài nào hiện bài đó ngay (⏳ → ○ hoặc ⚠); mỗi bài một bước Hoàn tác. | Đặc tả 8.1 bước 6. |
| **S11** | Cả phiếu sinh xong → tự lưu vào **Kho phiếu** (khi chạy qua máy chủ); báo "Sinh xong: k bài ○ · m bài ⚠ · …". | Không mất bài nếu đóng trình duyệt. |
| **S12** | Thanh **dải trên**: "AI: *model*" (hoặc "AI ngoài"), "⏳ AI đang viết k bài…" + **Dừng** (bỏ hàng chờ, bài chưa xong vẫn ⏳); còn bài ⏳ mà không chạy thì nút **Sinh k bài đang chờ**. | Mở lại phiếu còn bài ⏳ (vd tải lại trang giữa chừng) vẫn sinh tiếp được. |

## C. Đọc kết quả, gửi lại khi lỗi

| Mã | Quy tắc | Vì sao |
|---|---|---|
| **S13** | **Làm sạch** trước khi đọc: bỏ khối ``` bao ngoài, bỏ chữ đứng trước dòng `## Task:` đầu tiên (lời chào, giải thích). Tách `Mục tiêu:` / `Ngữ cảnh:` (`tachMeta`) rồi mới đưa bộ đọc MD của app. | AI hay "lịch sự" dù đã dặn. |
| **S14** | **Lỗi phải gửi lại** (cần sửa thì app không dùng ngay): (a) không có / nhiều hơn một `## Task:`, hoặc bài bị tách phần; (b) bộ đọc không đọc được; (c) **sai dạng Q**; (d) ~~sai số câu~~ **bỏ từ v130** (số câu chỉ là ý muốn của giáo viên, không phải tiêu chí: xem S26); (e) số dòng đáp án khác số câu; (f) câu **thiếu đáp án** (như máy kiểm "Mỗi câu có đáp án"). | Đặc tả 8.1 bước 4 + hai lỗi làm bài vô dụng (e, f). |
| **S15** | **Gửi lại** = đoạn nhắc cũ + "## SỬA LỖI": bản AI vừa viết + **danh sách lỗi đúng chỗ** ("sai số câu: cần đúng 6 câu đánh số, bài có 5 câu") + "viết lại toàn bộ, sửa đúng các lỗi, giữ phần đã đúng". **Tối đa 2 lần gửi lại** (3 lượt / bài). | Đặc tả 8.1. |
| **S16** | Quá 2 lần vẫn lỗi → dùng **bản cuối đọc được** (không đọc được thì giữ khung xxx), bài ⚠ với lý do "AI viết sai: …" ở máy kiểm "MD đọc được, không lỗi". | Giáo viên vẫn có cái để sửa tay. |
| **S17** | **Lỗi nhẹ không gửi lại**: thiếu `Mục tiêu` / `Ngữ cảnh`, các ghi chú của bộ đọc (bỏ dòng thừa, đưa lời nhắc vào hướng dẫn…) → vẫn dùng bài, hiện ở máy kiểm (⚠) để giáo viên xem. | Gửi lại vì lỗi vặt tốn lượt; có thể nâng thành lỗi phải gửi lại nếu thấy hay gặp. |
| **S18** | **Lỗi gọi AI**: quá tải (429 / 529) → chờ 4 giây, thử lại **một** lần; vẫn lỗi, hoặc lỗi khác (khóa sai, mạng, quá 3 phút) → bài ⚠ "Chưa sinh được: *lý do*. Bấm Sinh lại", giữ khung. | |

## D. Ghép vào phiếu

| Mã | Quy tắc | Vì sao |
|---|---|---|
| **S19** | Bài AI **thay khung**: giữ id, vị trí và phần `gen` (bước, vai trò, Q, số câu, lịch sử duyệt); tiêu đề, hướng dẫn, câu, đáp án, cách xếp theo bộ đọc (như nạp MD). `Mục tiêu` / `Ngữ cảnh` vào ngăn Duyệt. Ghi thêm: MD gốc, model, số lượt, phiên bản đoạn nhắc, giờ. | |
| **S20** | **Không ghi đè bài đang sửa**: giáo viên sửa bài trong lúc AI đang viết bài đó → không thay; giữ bản AI, ngăn Duyệt có nút **Dùng bản AI vừa viết**. | Đặc tả T4 "không ghi đè bài đang gõ". |
| **S21** | Chỉ bài ⏳ được sinh tự động. Bài đã duyệt chỉ đổi khi giáo viên bấm **Sinh lại**; bản đã duyệt vẫn trong Lịch sử bài. Bản AI viết ra trùng y bản đã duyệt thì vẫn tính là đã duyệt (so dấu nội dung). | Đặc tả 7. |

## E. Sinh lại một bài

| Mã | Quy tắc | Vì sao |
|---|---|---|
| **S22** | Gửi thêm **bản hiện tại** (MD xuất từ bài đang có, gồm cả sửa tay) và **góp ý** ("phải làm theo; giữ đúng dạng và số câu; phần góp ý không nhắc thì giữ nếu đã tốt"). Không góp ý → "viết bản MỚI khác bản hiện tại (câu, ngữ cảnh khác)". | |
| **S23** | Quay lại Ra đề rồi Sinh bài: bài cùng bước + Q + số câu giữ nguyên (cả đã sửa / đã duyệt), chỉ bài đổi / mới thành ⏳ và được sinh; **Sinh lại cả phiếu…** = mọi bài ⏳. | Đặc tả 5.6 (đã có từ v127). |

## F. Chế độ AI ngoài

| Mã | Quy tắc | Vì sao |
|---|---|---|
| **S24** | Tự dùng AI ngoài khi: mở thẳng file HTML, máy chủ chưa có khóa, hoặc máy không có quyền gọi AI. Ngăn Duyệt mở ở bài ⏳ đầu; dải trên "k bài chờ dán kết quả AI". | Đã chốt 29/10 (khóa chỉ ở máy chủ). |
| **S25** | Mỗi bài: **1 · Chép đoạn nhắc** (phần hệ thống + `==========` + phần yêu cầu, một khối; bài đã có thì là đoạn nhắc sinh lại kèm góp ý) → dán sang AI bất kỳ → **2 · Dán kết quả** → **Nạp kết quả**: cùng bước đọc / kiểm như S13–S17. Lỗi phải gửi lại → không ghép, hiện lỗi + **Chép đoạn nhắc sửa lỗi** (như S15) hoặc **Vẫn dùng bản này** (bài ⚠). Hộp AI ngoài cũng có khi chạy qua máy chủ (gập lại) để so model khác. | Cũng là cách thử prompt trước khi có khóa. |

## G. Nhật ký (đặc tả 6.3, cho admin)

`<dữ liệu máy chủ>/tao-bai/nhat-ky.jsonl`, một dòng một sự kiện: `ai` (mỗi lượt gọi: loại sinh / sửa, model, token vào / ra, thời gian, bài, lượt, phiên bản đoạn nhắc), `ai-loi`, `app-sinh-xong` (bài, Q, số câu, số lượt, lỗi còn lại), `app-sinh-lai` (góp ý), `app-ai-ngoai`, `app-duyet` (**có sửa tay hay không** so với bản AI), `nap-tep`, `thiet-lap-ai`. Không ghi khóa API, không ghi nội dung đoạn nhắc.

---

## H. Cấu trúc do giáo viên quyết (v130, theo ý kiến 30/10)

| Mã | Quy tắc | Lý do |
|---|---|---|
| **S26** | **Chỉ lần đề xuất đầu tiên** theo Trình tự; sau đó giáo viên tự quyết cấu trúc và AI viết **theo đúng cấu trúc đó**. Không còn giới hạn số bài mỗi bước, "bắt buộc", khoảng số câu (nhập 1–50 câu), dạng Q (đủ 12 dạng; dạng của Trình tự xếp trước), số trang. Khoảng số câu của Trình tự chỉ hiện là "gợi ý". Số câu AI viết khác số chọn **không** bị gửi lại, **không** bị máy kiểm chấm; số trang không còn là tiêu chí. | Số câu, số bài, số trang là quyết định của giáo viên, không phải tiêu chí chất lượng nội dung. |
| **S27** | Mỗi bài có ô **Yêu cầu riêng** (không bắt buộc), gửi cho AI ở đoạn "BÀI CẦN VIẾT" ("phải làm theo") và trong danh sách cấu trúc. Đổi yêu cầu riêng = bài đổi, được sinh lại (như đổi số câu). | Giáo viên chỉ đạo từng bài. |
| **S28** | Nhóm **Bài tự do** cuối cấu trúc (`step` = 0): bài không thuộc bước nào; dạng Q bất kỳ, số câu bất kỳ, yêu cầu riêng nói bài viết về gì. Đoạn nhắc ghi "Đây là BÀI TỰ DO… không thuộc bước nào"; Nguyên tắc chung của Trình tự vẫn gửi. | "Task tự do nếu người dùng muốn". |
| **S29** | Khi đoạn nhắc nêu "Dạng được phép" / "Số câu" của bước: ghi rõ đó **chỉ là gợi ý**, điều giáo viên đã chọn cho bài mới là yêu cầu. Đoạn nhắc từ `nhac-2`. | Tránh AI tự ý theo khoảng thay vì số đã chọn. |

Chưa làm (chờ góp ý): kéo đổi thứ tự bài / đưa bài tự do lên giữa phiếu (hiện bài tự do ở cuối; bài thêm trong một bước thì nằm ở bước đó).

## Câu hỏi để thảo luận sau khi thử (mặc định đang dùng)

1. **Tránh lặp giữa các bài** (S9): song song 3 bài thì 3 bài đầu không thấy nhau. Có nên chia ngữ cảnh trước (một lượt AI rẻ chọn 5 ngữ cảnh cho 5 bài) hay sinh lần lượt cho chắc? *Mặc định: song song, máy kiểm bắt câu lặp.*
2. **Lỗi nhẹ** (S17) có nên gửi lại không, và ⚠ cho lỗi nhẹ có làm ồn quá không? *Mặc định: không gửi lại, vẫn ⚠.*
3. **TF nhiều dạng cùng Q** (S6): AI tự chọn, hay app chọn trước (ngẫu nhiên / theo thứ tự) để dễ so? *Mặc định: AI chọn.*
4. **Gửi cả phần Kiến thức** dù dài (S3②): có mục nào nên bỏ cho từng bước (vd bước Khởi động không cần "Lỗi hay gặp")? *Mặc định: gửi hết.*
5. **Model**: Sonnet 5.5 hay Haiku 5.5 cho sinh bài (T6 so). *Mặc định trong Thiết lập: Sonnet 5.5.*
6. ~~Ô "Ghi chú cho AI" riêng từng bài~~ → **đã có từ v130** ("Yêu cầu riêng cho bài này", S27).
7. Số lần gửi lại (S15: 2) và thời gian chờ khi quá tải (S18: 4 giây, thử lại 1 lần) có hợp không?
