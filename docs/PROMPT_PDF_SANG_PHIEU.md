# Prompt đưa PDF phiếu bài tập vào WS Editor

Cập nhật: 2026-10-27 (**v103**: quy tắc 21–22 sau phiếu 9: bài nối không tự đoán đáp án, `Viền hai vế: có`. **v100**: quy tắc 16–20 sau phiếu thật “Unit 6 – Lesson 1”: tiêu đề bài đọc, bỏ Hướng dẫn trùng tiêu đề, không bịa Tuổi, nhãn (a) trong bài đọc, `Số câu: a b c`, `Dạng: đúng/sai (cùng hàng)`). Trước đó 2026-10-26 (**v81**, kiến trúc trình bày mới): AI ghi **`Dạng:`** (12 dạng câu hỏi) thay cho `Trả lời:`; thêm câu ví dụ `0.`, dòng chữ `> `, khung từ ảnh, khối chữ / ảnh, hai ảnh chung, nhãn Đúng/Sai tự đặt, bài tìm lỗi sai (nhãn A–D), khung vẽ, bốn ô li, đoạn có nhãn A. B., `Bố cục:` và `Thứ tự:` khi cần (quy tắc 12–15). Các quy tắc v67–v80 giữ nguyên: một bài của PDF = một `## Task`, phần phụ dùng `### Phần:`, bỏ giàn giáo, kiểu chữ chỉ khi ý bài cần. File MD theo prompt cũ (`Trả lời:`) vẫn nạp được.

Cách dùng: mở một AI đọc được PDF (Claude, ChatGPT, Gemini…), đính kèm PDF, dán MỘT trong hai prompt dưới đây. Lưu kết quả thành file `.md` (hoặc `.json`), rồi trong app bấm **+ Phiếu** (cả phiếu) hoặc **+ Task** (thêm vào phiếu đang mở) → Chọn file. Xem bảng nhận diện trước khi bấm tạo: dòng xanh là app đã tự xử lý, dòng đỏ là chỗ phải sửa. Dòng đầu bảng nên khớp số bài của PDF (vd “6 Task (Task 6 có 3 phần)”).

Nên chọn cách nào:
- **Cách B (MD) — khuyến nghị.** Ngắn, dễ đọc, dễ sửa tay. Cấu trúc đầy đủ ở `docs/QUY_UOC_MD.md`.
- **Cách A (JSON).** Đủ mọi trường, nhưng AI dễ sai dấu ngoặc khi file dài. Dùng khi cần kiểm soát từng trường.

---

## CÁCH B. Prompt ra MD (khuyến nghị)

````
Bạn chuyển phiếu bài tập tiếng Anh (PDF đính kèm) sang Markdown theo QUY ƯỚC của app "WS Editor". App tự dàn trang và TỰ VẼ chỗ trả lời (dòng kẻ, ô T/F, ô tick, vòng khoanh). Việc của bạn chỉ là chép NỘI DUNG và chọn đúng loại chỗ trả lời.

Trả về DUY NHẤT một khối ```markdown, rồi mục "GHI CHÚ" ngắn.

NGUYÊN TẮC
1. Chép nguyên văn tiếng Anh (giữ dấu câu, chữ hoa, ’ …). Không sửa, không dịch, không bịa câu hay đáp án.
2. Không cần giống bố cục PDF. Người học chỉ cần hiểu phải làm gì.
3. MỘT BÀI CỦA PDF = MỘT "## Task", đúng thứ tự và ĐÚNG SỐ LƯỢNG (PDF có TASK 1…6 thì file có đúng 6 dòng "## Task"). KHÔNG tách một bài của PDF thành nhiều Task. Mỗi "## Task" hay "### Phần" chỉ có MỘT loại chỗ trả lời. Bài gốc có nhiều phần với chỗ trả lời khác nhau (vd điền bảng + tick một ý + hoàn thành câu) thì: phần đầu viết ngay dưới "## Task:"; mỗi phần sau mở bằng một dòng "### Phần: <tên phần>" với "Hướng dẫn:" và "Trả lời:" riêng của phần đó. Chỉ chép "Hướng dẫn:" của phần khi PDF có câu lệnh riêng cho phần đó; không có thì bỏ trống, KHÔNG chép lại hướng dẫn của phần trước.
4. KHÔNG CHÉP "GIÀN GIÁO" CỦA BẢN GỐC, vì app tự vẽ:
   - gạch ___ hay dòng kẻ ở cuối câu khi học sinh viết câu trả lời hoặc chọn Đúng/Sai (chỗ viết nằm SAU câu, không phải một phần của câu);
   - dòng "My answer: A / B / C", dòng chỉ có gạch "________";
   - đầu / cuối trang: Name / Class / Date, số trang, tên phiếu lặp lại ("READING WORKSHEET"), thời gian từng bài ("3 min"), nhãn phần ("Before you read").
   Giữ ___ khi chỗ trống là MỘT PHẦN CỦA CÂU, học sinh điền hoặc chọn từ vào đó (vd "She ___ a teacher.", "Place of the party: ___", "It is a ___. A. cat B. dog").
5. Không viết dòng tiêu đề phần như "Nội dung:", "Content:". Câu đi ngay dưới các dòng trường.
6. Ảnh: không tạo ảnh, chỉ ghi TÊN NGẮN dạng [ảnh: tên].
7. Mỗi file một phiếu. PDF có nhiều nhóm/phiên bản thì chỉ làm nhóm tôi chỉ định, hỏi nếu chưa rõ.
8. Không đọc rõ thì ghi vào GHI CHÚ, không đoán.
9. KIỂU CHỮ: chỉ giữ in đậm / nghiêng / gạch chân khi ý của bài cần chúng. Viết **đậm**, *nghiêng*, <u>gạch chân</u> (lồng nhau được: **<u>park</u>**). Ví dụ cần: từ bị gạch chân trong đề "closest in meaning to the underlined word(s)" → "Acupuncture <u>originated</u> in China…"; từ gốc in đậm trong ngoặc → "We are trying to have an ___ world. (**POLLUTE**)"; từ cần chú ý trong bài đọc. KHÔNG dùng cho tiêu đề, nhãn, số câu hay chữ chỉ trang trí. KHÔNG viết gạch chân bằng dấu gạch dưới (__từ__): app hiểu đó là chỗ trống.
10. NHÓM CÂU CÓ HƯỚNG DẪN RIÊNG TRONG CÙNG MỘT BÀI (số câu bắt đầu lại từ 1, vd một nhóm "CLOSEST in meaning", một nhóm "OPPOSITE in meaning"): nhóm sau mở bằng "### Phần: <tên>" kèm "Hướng dẫn:" là câu lệnh của nhóm đó và "Trả lời:" riêng. KHÔNG để câu lệnh của nhóm sau nằm trơ giữa các câu đánh số.
11. BÀI VIẾT ĐOẠN / VIẾT TỰ DO (không có câu hỏi, học sinh viết cả bài): chỉ ghi "Hướng dẫn:", "Dạng: viết tự do" và "Dòng viết: N" (N = số dòng kẻ trong PDF, tới 20; không rõ thì ước lượng và ghi vào GHI CHÚ). Bài vẽ vào khung trống: "Dạng: viết tự do (khung vẽ)". Không viết câu mẫu, không ghi "Ảnh:" nếu PDF không có tranh.
12. CÂU VÍ DỤ: câu mẫu đã làm sẵn trong PDF (thường có chữ "Example", số 0, hoặc đáp án in sẵn) viết là "0. <câu>" ngay trước câu 1, đáp án mẫu ghi "0. <đáp án>" trong "## Đáp án". KHÔNG đánh số lại các câu sau. Mỗi Task tối đa một câu ví dụ.
13. DÒNG CHỮ GIỮA CÁC CÂU (tiêu đề nhóm nhỏ, không có chỗ trả lời, số câu KHÔNG bắt đầu lại): viết "> <dòng chữ>". Nếu số câu bắt đầu lại từ 1 thì dùng "### Phần:" (quy tắc 10).
14. KHUNG TỪ BẰNG ẢNH (hộp tranh A, B, C… để chọn): "Khung từ ảnh: tên1, tên2, tên3". Hộp từ nằm dưới các câu: thêm "Vị trí khung từ: dưới" (bên phải: "phải"). Hai tranh chung cạnh nhau: "Ảnh: tên1; tên2". Chữ / tranh tự do ngang cả bài (ghi chú dài, luật chơi, sơ đồ) không thuộc câu nào: "Khối chữ:" + các dòng thụt lề 2 dấu cách bên dưới, hoặc "Khối ảnh: tên" (thêm "trên" nếu nằm trên bài: "Khối chữ trên:", "Khối ảnh trên:").
15. BỐ CỤC: thường KHÔNG ghi (app tự chọn). Chỉ ghi "Bố cục: ảnh trái" / "ảnh phải" / "ảnh trong bài đọc" khi PDF đặt tranh chung rõ ràng như vậy và điều đó giúp học sinh. Câu hỏi in TRƯỚC bài đọc trong PDF: "Thứ tự: câu hỏi trước". Điểm đánh số trên tranh chung: "Điểm trên ảnh: x y; x y" (x, y theo % chiều ngang / dọc của tranh, ước lượng; thêm "(ô trống)" nếu điểm không in số).
16. TIÊU ĐỀ BÀI ĐỌC: chữ in đậm đứng ngay trên bài đọc (tên truyện, tên đoạn văn) viết là dòng đầu của "Bài đọc:", dạng "**TIÊU ĐỀ**", rồi một dòng trống rồi mới tới đoạn văn. KHÔNG viết nó trước "Bài đọc:" như một dòng riêng (app sẽ hiểu nhầm thành một câu).
17. "Hướng dẫn:" CHỈ ghi khi PDF có câu lệnh riêng NGOÀI tiêu đề bài. Nếu tiêu đề bài chính là câu lệnh (vd "1 LISTEN AND FILL IN THE BLANK" và không có dòng nào dưới nó), KHÔNG chép lại vào "Hướng dẫn:". Dòng "Tuổi:" chỉ ghi khi PDF ghi rõ độ tuổi; không đoán (PDF chỉ có "Level 0" hay mã phiếu thì bỏ dòng Tuổi).
18. BÀI ĐIỀN TỪ VÀO ĐOẠN VĂN (đoạn văn có các chỗ trống "(a) ______", "(b) ______"…): KHÔNG để đoạn văn trong "Bài đọc:", vì chỗ trống cần đáp án nên đoạn văn là CÂU HỎI. "Bài đọc:" chỉ ghi tiêu đề của bài (vd "**THE GOLDEN CHIEFS OF PANAMA**"), nếu PDF không có tiêu đề thì bỏ "Bài đọc:". Mỗi đoạn văn là một câu đánh số "1.", "2.", "3." (một đoạn, giữ nguyên nhãn "(a) ___" trong đoạn, nhiều chỗ trống một câu cũng được), kèm "Dạng: điền từ" và "Số câu: ẩn" (PDF không đánh số đoạn). Không viết thêm dòng kẻ nào sau đoạn. Ví dụ:
   Dạng: điền từ
   Số câu: ẩn
   Bài đọc:
   **THE GOLDEN CHIEFS OF PANAMA**
   1. In 2005, Julia Mayo began to (a) ___ a cemetery. Many (b) ___ were found there.
   2. The (c) ___ people lived in simple houses.
19. NHÃN CÂU LÀ CHỮ a, b, c… (bài nối từ với nghĩa: "a. ______ nghĩa", "b. ______ nghĩa"): viết mỗi dòng là "1. ___ nghĩa" (đánh số, KHÔNG viết "a." ở đầu dòng vì app hiểu là lựa chọn của câu trên), và thêm dòng "Số câu: a b c" ngay dưới "Dạng:". Muốn bỏ hẳn số câu (không nhãn) thì ghi "Số câu: ẩn".
20. ĐÚNG/SAI MÀ T F NẰM CÙNG HÀNG VỚI CÂU (T F ở cuối dòng bên phải câu, không xuống dòng dưới): ghi "Dạng: đúng/sai (cùng hàng)". Có nhãn khác thì "Dạng: đúng/sai (Yes/No, cùng hàng)". Bài đọc có tranh cạnh bên rồi các câu ngay dưới: thêm "Ảnh:" và "Bố cục: ảnh phải" như thường.
21. BÀI NỐI (Dạng: nối): vế trái đánh số 1, 2, 3…, vế phải giữ nguyên chữ a., b., c… như bản gốc. Mỗi dòng "<vế trái> - <vế phải>" chỉ là CẶP NỐI. Nếu PDF không in đáp án (bài nghe, hoặc bài viết chữ cái vào ô), KHÔNG tự đoán: ghép theo đúng thứ tự in ra, KHÔNG ghi "Xáo vế phải", và ghi vào GHI CHÚ: "Bài nối Task N: chưa có đáp án đúng, giáo viên điền". Chỉ khi PDF có đáp án mới sắp cặp theo đáp án và ghi "Xáo vế phải: có".
22. VIỀN BÀI NỐI: mặc định app KHÔNG viền chữ hai vế. Chỉ khi bản gốc có khung viền quanh chữ (cả hai vế) mới ghi "Viền hai vế: có" ngay dưới "Dạng:".

QUY ƯỚC
# Tên phiếu
Tuổi: 7-9                                  (5-6 | 7-9 | 10-12; CHỈ khi PDF ghi độ tuổi, không đoán)

## Task: <tiêu đề bài>                     (mỗi bài của PDF bắt đầu bằng dòng này)
Hướng dẫn: <lệnh / hướng dẫn của bài>
Dạng: <BẮT BUỘC, một trong: điền từ | viết câu | chọn A/B/C | chọn trong câu | đúng/sai | nhìn ảnh viết | chọn ảnh | nối | tô chữ | bảng | lưới | viết tự do>  (chi tiết trong ngoặc, xem CHỌN "Dạng:")
Trả lời: không                             (CHỈ khi bài không có chỗ trả lời: tô màu, hỏi đáp miệng, từ điển tranh)
Dòng viết: 1                               (chỉ với "viết câu": số dòng mỗi câu; "viết tự do": tổng số dòng, tới 20)
Dòng kẻ: bốn ô li                          (chỉ khi PDF dùng dòng tập viết 4 ô li)
Số câu: a b c                             (chỉ khi nhãn câu trong PDF là chữ a, b, c…; "ẩn" = không số câu)
Viền hai vế: có                            (chỉ bài nối, khi bản gốc có khung viền quanh chữ hai vế; mặc định không viền)
Khung từ: từ1, từ2, từ3                    (nếu có hộp từ)
Khung từ ảnh: tên1, tên2                   (nếu hộp là tranh)
Vị trí khung từ: dưới                      (chỉ khi hộp từ nằm dưới / bên phải câu hỏi)
Ảnh: <tên ảnh chung>                       (nếu bài có một tranh chung; hai tranh cạnh nhau: "Ảnh: tên1; tên2")
Track: Track 05                            (nếu là bài nghe)
Lời dẫn: <câu dẫn trước hội thoại>
Ghi chú: <lời nhắc nằm dưới bài trong bản gốc>
<rồi đến các câu, theo các cách viết dưới đây>

### Phần: <tên phần>                       (CHỈ khi bài gốc có nhiều phần với chỗ trả lời khác nhau; cùng số Task)
Hướng dẫn: <câu lệnh riêng của phần, bỏ trống nếu PDF không có>
Dạng: <dạng câu hỏi của phần này>
<các câu của phần này>

CÁCH VIẾT CÂU
- Câu đánh số: 1. She ___ a teacher.
- Câu ví dụ: 0. He ___ a doctor.   (đáp án mẫu "0. is" ở ## Đáp án)
- Dòng chữ giữa các câu: > Part B: at school
- Bài tìm lỗi sai (gạch chân 4 chỗ, chọn A/B/C/D): 1. She <u>go</u> to <u>school</u> every <u>day</u> by <u>bus</u>.   kèm "Dạng: chọn trong câu (nhãn A-D)"
- Đoạn có nhãn trong bài đọc (nối tiêu đề với đoạn): mỗi đoạn một dòng "A. <đoạn>", "B. <đoạn>", cách nhau một dòng trống.
- Lựa chọn A/B/C: cùng dòng "1. Where is it? A. here B. there C. home", hoặc mỗi lựa chọn một dòng thụt lề ngay dưới câu.
- Câu chỉ có lựa chọn (không có thân câu): "1. A. … B. … C. …".
- Tick vào lựa chọn bằng chữ: ☐ a cake ☐ a football ☐ balloons   (một dòng, hoặc mỗi dòng một ☐), kèm "Trả lời: tick".
- Nghe và tick ảnh: "1. What is Tom eating? A. [ảnh: pizza] B. [ảnh: rice] C. [ảnh: cake]", kèm "Trả lời: tick".
- Chọn trong câu: It’s {windy|rainy}.
- Ảnh của câu: 1. [ảnh: cat]
- Nối: 1. cat - meow   (vế trái là ảnh: 1. [ảnh: apple] - pear)
- Bài đọc: dòng "Bài đọc:" rồi các đoạn văn, MỖI ĐOẠN CÁCH NHAU MỘT DÒNG TRỐNG; sau đó đến câu hỏi đánh số.
- Hội thoại: dòng "Hội thoại:" rồi mỗi lượt một dòng "Tên: lời" (chỗ cần điền ghi ___). Chỉ dùng khối này cho hội thoại.
- Bảng: mỗi hàng một dòng, ô cách nhau " | "; dòng đầu là tiêu đề cột; ô để học sinh viết thì để trống; [ ] = ô tick; [ảnh: x] = ô ảnh.
- Ô chữ giải đố (crossword, có ô trắng tự đánh số và gợi ý Across / Down): dòng "Crossword:" rồi mỗi dòng một hàng của lưới: # = không có ô, . = ô trống, chữ cái = đáp án (nếu suy ra được), (a) = chữ đã cho sẵn. Không đoán đáp án nếu PDF không có: dùng "." cho các ô.
- Ô chữ (word search): dòng "Ô chữ:" rồi mỗi dòng một hàng chữ cái; từ cần tìm đưa vào "Khung từ:".
- Bài chỉ có tranh (tô màu): chỉ "Ảnh:" và "Trả lời: không".
- Bài viết đoạn (không câu hỏi): "Dạng: viết tự do" + "Dòng viết: 15", không có dòng câu nào. Vẽ vào khung: "Dạng: viết tự do (khung vẽ)".
- Chữ cần nhấn: **đậm**, *nghiêng*, <u>gạch chân</u>.

CHỌN "Dạng:"
- ___ trong câu, hoặc viết một từ → điền từ   (mỗi chữ một ô: "điền từ (ô chữ cái)")
- câu hỏi, học sinh viết câu trả lời → viết câu (+ Dòng viết)
- mỗi câu là một tranh, viết từ / câu dưới tranh → nhìn ảnh viết
- có A/B/C bằng chữ → chọn A/B/C   (lựa chọn có ô ☐: "chọn A/B/C (ô tick)")
- mỗi câu có 2–4 tranh, tick tranh đúng → chọn ảnh
- {a|b} trong câu → chọn trong câu   (tìm lỗi sai gạch chân A–D: "chọn trong câu (nhãn A-D)")
- Nếu PDF có đáp án của câu chọn trong câu: đặt dấu * trước vế đúng, vd {*goes|go}. Câu nhiều chỗ trống: đáp án một dòng, cách nhau " | ". Bảng có đáp án ô: viết =đáp án trong ô.
- True/False, Yes/No, T/F/NG → đúng/sai (nhãn)   vd "đúng/sai (Yes/No)", "đúng/sai (T/F/NG)"; chỉ T/F thì "đúng/sai"
- hai cột nối → nối
- tô theo nét → tô chữ
- bảng điền / tick, story map, KWL, phân loại → bảng
- ô chữ giải đố, tìm từ → lưới
- viết đoạn, vẽ → viết tự do
- "chọn một trong các từ rồi viết câu" → Khung từ + điền từ
- tô màu, hỏi đáp miệng, chỉ nhìn → "Trả lời: không" (không ghi Dạng)

ĐÁP ÁN (chỉ khi PDF có), đặt CUỐI file. Số "Task n" là số của bài trong PDF; bài nhiều phần thì liệt kê đáp án liền nhau qua các phần, theo thứ tự câu:
## Đáp án
### Task 1
0. book          (đáp án của câu ví dụ, nếu có)
1. cat
2. dog
Task 2: is; are; an
### Task 3
Chỗ trống: am, go, play   (đáp án chỗ trống trong bài đọc, theo thứ tự)

TỰ KIỂM TRA TRƯỚC KHI TRẢ LỜI
- Nhãn in sẵn đầu một phần trong PDF (ví dụ "Self-check:") ghi vào dòng `Hướng dẫn:` của phần đó. Tên sau "### Phần:" chỉ là tên nội bộ, KHÔNG được in lên phiếu.
- Số dòng "## Task" bằng đúng số bài đánh số trong PDF. Chỉ dùng "### Phần:" cho các phần phụ của MỘT bài.
- Mỗi Task và mỗi Phần có "Dạng:" (hoặc "Trả lời: không"); không có dòng "Nội dung:".
- Câu ví dụ là "0." và không làm lệch số các câu sau; dòng chữ giữa câu là "> ".
- Số câu đúng bằng PDF; không còn ___ thừa ở cuối câu Đúng/Sai, viết câu.
- Không "Hướng dẫn:" nào bị chép lặp từ phần trước.
- Bài đọc giữ đúng số đoạn.
- Từ bị gạch chân / in đậm mà đề nhắc tới (underlined, bold) đã được đánh dấu bằng <u> hoặc **.
- Không có dòng hướng dẫn nào nằm trơ giữa các câu đánh số: nhóm câu có hướng dẫn riêng đã thành "### Phần:".

ĐẦU RA: một khối ```markdown, rồi GHI CHÚ: (1) chỗ đọc không rõ, (2) bài nào có nhiều phần (### Phần) và vì sao, (3) ảnh cần tải lên theo từng Task.

VÍ DỤ ĐẦY ĐỦ (một phiếu đọc thật, PDF có 6 bài; bài 6 gốc có 3 phần với chỗ trả lời khác nhau nên viết thành "## Task" + hai "### Phần"):
```markdown
# A Surprise Birthday Party
Tuổi: 7-9

## Task: Look & Predict
Hướng dẫn: Look at the title. What do you think you will see in the story? Tick (✓) two.
Dạng: chọn A/B/C (ô tick)
Ghi chú: Your ideas are predictions. Check them after reading.
☐ a cake ☐ a football ☐ balloons

## Task: Read & Choose the Main Idea
Hướng dẫn: Read the story. Then choose the best summary (A, B or C).
Dạng: chọn A/B/C
Bài đọc:
On Saturday morning, Lily was at home with her mum. (… đoạn 1 …)

At two o'clock, Lily's mum said, "Let's visit Ben." (… đoạn 2 …)

But then their dog Max jumped onto a chair and took a sandwich! (… đoạn 3 …)

1. A. Lily and her friends made a cake at school.
   B. Lily’s friends planned a party, and something funny happened.
   C. Lily went to a party, but no one came.

## Task: True or False?
Hướng dẫn: Read again. Write T (True) or F (False).
Dạng: đúng/sai
1. Lily thought everyone was busy on her birthday.
2. Ben and his friends prepared the party at Lily’s house.

## Task: Find the Details
Hướng dẫn: Answer with one word or a short phrase.
Dạng: viết câu
Dòng viết: 1
1. Where did the friends prepare the party?
2. What time did Lily visit Ben?

## Task: Choose & Think
Hướng dẫn: Use clues in the story. Circle the best answer.
Dạng: chọn A/B/C
1. Why was the room dark when Lily opened the door?
   A. The friends wanted to surprise her.
   B. The friends were sleeping.
   C. Ben was not at home.

## Task: Story Map & My Idea
Hướng dẫn: Complete the story map with words from the story.
Dạng: điền từ
1. Place of the party: ___
2. Food at the party (two things): ___

### Phần: My Idea – Tick One
Hướng dẫn: Which party activity would you like best? Tick one and finish the sentence.
Dạng: chọn A/B/C (ô tick)
☐ eating cake ☐ playing games ☐ singing songs

### Phần: My Idea – Finish the Sentence
Dạng: điền từ
1. I would like ___ because ___.
```
````

---

## CÁCH A. Prompt ra JSON

````
Bạn chuyển phiếu bài tập tiếng Anh (PDF đính kèm) sang JSON cho app "WS Editor". App tự dàn trang và TỰ VẼ chỗ trả lời. Trả về DUY NHẤT một khối ```json hợp lệ, rồi mục "GHI CHÚ" ngắn.

NGUYÊN TẮC
1. Chép nguyên văn tiếng Anh. Không sửa, không dịch, không bịa câu hay đáp án. Không cần giống bố cục PDF.
2. Mỗi bài của PDF = MỘT số thứ tự Task, đúng thứ tự và đúng số lượng. MỖI TASK CHỈ MỘT LOẠI ĐÁP ÁN. Bài gốc có nhiều phần với chỗ trả lời khác nhau: phần đầu là một Task; mỗi phần sau là một Task riêng ngay sau đó với "layout.break":"join" (app nối nó vào Task trên: không số, không tiêu đề, cùng số Task). Với phần nối: "title" = tên phần, "instruction" chỉ chép câu lệnh riêng của phần ('' nếu PDF không có; không chép lặp hướng dẫn phần trước).
3. KHÔNG CHÉP GIÀN GIÁO: không để ___ ở cuối câu khi đáp án là Đúng/Sai, viết câu, viết từ (chỗ viết nằm sau câu); không có câu "My answer: A / B / C"; không chép Name/Class, tên phiếu lặp lại ở đầu trang, thời gian từng bài, nhãn phần. Chỉ giữ ___ khi chỗ trống nằm trong câu hoặc sau nhãn ("Place of the party: ___").
4. Ảnh chỉ ghi TÊN NGẮN. Đáp án đúng chỉ khi PDF có (trường "key"). Mọi "id" duy nhất.
5. Lời nhắc nằm dưới bài trong bản gốc: nối vào cuối "instruction".
6. (v101) "instruction" chỉ ghi khi PDF có câu lệnh riêng NGOÀI tiêu đề bài; trùng tiêu đề thì để trống. "age" chỉ ghi khi PDF ghi độ tuổi, không đoán.
7. (v101) Đoạn văn có chỗ trống "(a) ___" cần đáp án: mỗi đoạn là MỘT CÂU của Task ("content.items"), nhãn "(a)" giữ trong chữ; "content.lead" (bài đọc) chỉ giữ tiêu đề. Bài đọc thật chỉ để đọc thì không chứa ___.

KHUNG PHIẾU
{"schema":"ws-editor/0.3","id":"ws-001","title":"<tên phiếu>","age":"7-9","page":{"size":"A4","marginMm":{"top":14,"right":14,"bottom":14,"left":14}},"spacing":{"preset":"normal","overrides":{}},"flow":"cont","tasks":[ ... ]}
("age": "5-6" | "7-9" | "10-12")

KHUNG MỘT TASK
{"id":"t1","typeId":"custom","typeName":"<tên dạng ngắn>","title":"<tiêu đề bài>","instruction":"<hướng dẫn, '' nếu không có>","audio":null,"image":null,"wordBank":null,
 "content":{ ...DẠNG NỘI DUNG... },"answer":{ ...LOẠI ĐÁP ÁN... },
 "spacing":{"preset":null,"overrides":{}},
 "layout":{"task":"auto","split":null,"cols":null,"dir":null,"align":null,"valign":null,"width":null,"cw":null,"rowH":null,"whoW":null,"colGap":null,"break":null,"frame":{},"cells":null,"table":null}}
- "audio": "Track 05" nếu bài nghe. "image": {"label":"the park","size":"medium","ar":"4/3"} cho một tranh chung ("large" nếu tranh lớn để tô/nhìn). "wordBank": {"words":["a","b"],"placement":"top","style":"chips","label":"none"}.
- "spacing" và "layout" chép y nguyên như trên; riêng phần nối vào Task trên đặt "break":"join".

DẠNG NỘI DUNG ("content")
(a) Danh sách câu: {"form":"list","items":[{"id":"q1","text":"She ___ a teacher.","opts":["am","is","are"],"key":"is"}]}
    - "opts" chỉ khi có lựa chọn. Câu chỉ có lựa chọn: "text":"". Chọn trong câu: viết {từ1|từ2} trong "text".
(b) Ảnh mỗi câu: items [{"id":"i1","img":"cat","len":3}]
(c) Nghe và tick ảnh: {"form":"list","variant":"multi","items":[{"id":"i1","text":"What is Tom eating?","imgs":["pizza","rice","cake"]}]}
(d) Câu nhiều dòng có ảnh: items [{"id":"i1","img":"rainy","lines":["It’s {windy|rainy}.","{Take|Put} your raincoat {on|off}."]}]
(e) Nối: {"form":"list","items":[{"id":"p1","pair":{"l":{"text":"cat"},"r":{"text":"meow"}}}]}
(f) Hội thoại: {"form":"list","lead":{"kind":"text","text":"<lời dẫn>"},"items":[{"id":"l1","who":"Mai","text":"Hi, Ben."},{"id":"l2","who":"Ben","text":"___"}]}
(g) Bài đọc + câu hỏi: {"form":"list","lead":{"kind":"passage","text":"<đoạn 1>\n\n<đoạn 2>"},"items":[...]}   (các đoạn cách nhau "\n\n")
(h) Tô chữ: items [{"id":"w1","text":"cat"}]
(i) Bảng: {"form":"table","corner":"","cols":["Age","Hobby"],"rows":[{"id":"r1","head":"Tom","cells":["9","football"]},{"id":"r2","head":"Lily","cells":["",""]}]}
    - Ô trống để viết = "". Ô tick = {"tick":1}. Ô ảnh = {"img":"cat"}.
    - Ô chữ (word search): mỗi ô một chữ, "cols" toàn chuỗi rỗng, "head":"" mọi hàng, thêm "layout.table": {"head":false,"rowHead":false,"nm":"off","lines":"all","align":"center","minH":8}; từ cần tìm vào "wordBank".
(j) Chỉ có tranh: {"form":"list","list":false,"items":[]} và "image" (size "large").

LOẠI ĐÁP ÁN ("answer")
- Viết một từ:                 {"kind":"word","attach":"item","layout":"A2","params":{}}
- Điền chỗ trống ___ trong câu: {"kind":"word","attach":"inline","layout":"A2","params":{"lenMode":"fill","lines":1,"start":"inline"}}
- Viết câu (dòng kẻ):          {"kind":"sentence","attach":"item","layout":"A1","params":{"lines":1}}
- Khoanh A/B/C:                {"kind":"choice","attach":"item","layout":"A4"}   (nhãn mặc định a b c chữ thường, kể cả khi bản gốc in A B C)
- Tick lựa chọn bằng chữ (☐):  {"kind":"choice","attach":"item","layout":"A4","params":{"lab":"box"}}
- Chọn trong câu {a|b}:        {"kind":"choice","attach":"inline","layout":"A4","params":{}}
- Nghe và tick ảnh:            {"kind":"tick","attach":"item","layout":"A5","params":{}}
- Đúng/Sai:                    {"kind":"tf","attach":"item","layout":"A6","params":{}}
- Nối:                         {"kind":"match","attach":"item","layout":"A7","params":{}}
- Tô chữ:                      {"kind":"trace","attach":"item","layout":"A8","params":{"repeat":3}}
- Không có chỗ trả lời:        {"kind":"none","attach":"item","layout":null,"params":{}}

TRƯỜNG MỚI (v81, chỉ dùng khi bài cần)
- Câu ví dụ: thêm "ex":true vào câu (đặt đầu danh sách, "key" = đáp án mẫu, in sẵn trên phiếu). Dòng chữ giữa các câu: {"id":"g1","gt":true,"text":"Part B"}.
- Hai tranh chung: "image":{"label":"A","size":"medium","two":true,"label2":"B"}. Khung từ ảnh: "wordBank":{"words":["apple","banana"],"kind":"image","placement":"top","style":"chips","label":"lower"}; "placement" thêm "bottom".
- Đúng/Sai nhãn khác: "params":{"labs":["Yes","No"]} (2–3 nhãn). Tìm lỗi sai: đáp án chọn trong câu + "params":{"ulab":true}, đoạn gạch chân viết <u>…</u>. Khung vẽ: viết câu, một câu "text":"", "layout.num":"off", "params":{"frame":"box"}. Bốn ô li: "params":{"ruling":"4"}.
- Câu hỏi trước bài đọc: "layout.order":"qfirst". Khối tự do: "extras":[{"id":"x1","kind":"text","pos":"bottom","text":"…"},{"id":"x2","kind":"image","pos":"top","label":"…"}].

TỰ KIỂM TRA: JSON hợp lệ (không có chú thích //); số Task đúng số bài PDF (phần nối "break":"join" không tính là bài mới); số câu đúng PDF; không còn ___ thừa; không Task nào trộn hai loại đáp án; không lặp hướng dẫn; id duy nhất.

ĐẦU RA: một khối ```json, rồi GHI CHÚ: (1) chỗ đọc không rõ, (2) bài nào có phần nối và vì sao, (3) ảnh cần tải lên theo từng Task.
````

---

## Sau khi AI trả kết quả
1. Lưu thành `ten-phieu.md` (hoặc `.json`). Nếu AI bọc trong ``` thì bỏ dòng ``` đầu và cuối.
2. App → **+ Phiếu** → Chọn file… Xem **bảng nhận diện**: số Task (bài nhiều phần hiện 6a, 6b, 6c), mô tả từng Task, ghi chú (xanh: app đã tự xử lý), cảnh báo (đỏ: cần sửa), ước tính số trang. Đối chiếu số Task với PDF.
3. Dòng đỏ: sửa trong cột trái, hoặc nhờ AI sửa lại đúng Task đó rồi nạp lại. Nếu một Task bị tách nhầm thành hai: chọn Task phía sau, mục Ngắt trang → **Nối vào Task trên** (hoặc nút ↳ ở cột trái).
4. Tải ảnh thật vào các ô ảnh (nút + trên từng ô).
5. Gặp dạng bài mà prompt không diễn đạt được: báo lại để mở rộng app theo quy trình 3 bước.
