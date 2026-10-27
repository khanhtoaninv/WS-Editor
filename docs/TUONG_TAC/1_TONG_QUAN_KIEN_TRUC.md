# Tài liệu 1. Tổng quan kiến trúc: phiếu tương tác, WS Editor và TeacherResource

> Bản nháp **v0** · 27/10/2026 · Viết từ thảo luận trong `THAO_LUAN.md`. Đặc tả `THAM_KHAO_DAC_TA_TRINH_XEM.md` chỉ là gợi ý tham khảo.
> Đọc kèm: `2_CHUAN_GOI_PHIEU.md` (hợp đồng dữ liệu), `3_LO_TRINH.md` (thứ tự làm).
> Quy ước: **PHẢI** = bắt buộc; **NÊN** = mặc định có, bỏ thì ghi lý do; **CÓ THỂ** = tùy chọn.

## 1. Mục tiêu và phạm vi

Phiếu bài tập soạn trong WS Editor (khổ A4, đã dàn trang) được dùng theo ba cách:

| Việc | Ai | Mô tả | Cần máy chủ |
|---|---|---|---|
| **V1. Tương tác trên phiếu** | Giáo viên | Chiếu phiếu, hiện đáp án, viết vẽ, chữa bài ngay trên phiếu | Không (trừ khi chữa bài của học sinh) |
| **V2. Tương tác lớp học** | Giáo viên + học sinh | Học sinh làm bài (trên lớp hoặc về nhà), nộp; hệ thống chấm, lưu; giáo viên xem thống kê và chữa bài | Có |
| **V3. Soạn và xuất bản** | Người soạn | Soạn, **thử tương tác ngay trong WS Editor**, đóng gói xuất bản; TeacherResource import và **chạy ngay, không chỉnh lại** | Không |

Ngoài phạm vi bản này: dùng không mạng, ứng dụng điện thoại riêng, AI chấm câu mở, quản lý năm học / chương trình (xem mục 10).

## 2. Thuật ngữ

| Từ | Nghĩa |
|---|---|
| **Phiếu** | Một phiếu bài tập trong WS Editor (JSON `ws-editor/0.x`): các Task xếp dọc |
| **Task** | Một bài trong phiếu, có dạng câu hỏi Q1–Q12 và bố cục T1–T4 |
| **Câu** | Một mục trong Task (`content.items[]`), có `id` |
| **Chỗ trả lời** (slot) | Đơn vị nhỏ nhất học sinh trả lời và được chấm: một chỗ trống, một nhóm chọn, một ô bảng, một cặp nối… Một câu có thể có nhiều chỗ trả lời |
| **Gói phiếu** (`.wsp`) | File xuất bản từ WS Editor theo chuẩn ở Tài liệu 2. Đơn vị duy nhất TeacherResource nhận |
| **Phiên bản** | Mỗi lần xuất bản tạo một phiên bản bất biến của phiếu |
| **Lần giao** (đầu mục bài) | Giáo viên giao một phiên bản cho một lớp / nhóm, kèm chế độ (về nhà / trực tiếp), hạn nộp |
| **Buổi trực tiếp** | Lần giao chế độ trực tiếp: học sinh quét mã vào làm cùng lúc, giáo viên theo dõi tức thời |
| **Bài làm** | Câu trả lời của một học sinh cho một lần giao, lưu theo từng chỗ trả lời |
| **Trình xem** | Thành phần giao diện hiển thị phiếu và cho tương tác; dùng chung ở mọi nơi |

## 3. Ba phần hệ thống và ranh giới

```
┌───────────────┐   xuất gói .wsp    ┌──────────────────────┐
│   WS Editor   │ ─────────────────▶ │    TeacherResource   │
│ soạn, dàn trang│                    │ tài khoản, lớp, giao │
│ thử tương tác │                    │ bài, lưu, chấm, thống│
└──────┬────────┘                    │ kê, chữa bài         │
       │ dùng                         └─────────┬────────────┘
       ▼                                        │ dùng
┌──────────────────────────────────────────────┴──┐
│ GÓI DÙNG CHUNG (thư viện TypeScript)             │
│ • định nghĩa chuẩn gói + kiểm tra (schema)        │
│ • trình xem phiếu (React)                         │
│ • hàm chấm thuần (chạy ở trình duyệt và máy chủ)  │
│ • đọc / ghi / mã hóa / ký gói                     │
└──────────────────────────────────────────────────┘
```

| Phần | Làm | Không làm |
|---|---|---|
| **WS Editor** | Soạn, dàn trang A4, khai báo đáp án và cách chấm, thử tương tác, kiểm tra và xuất gói | Không lưu bài làm, không biết tài khoản học sinh |
| **Gói dùng chung** | Hiển thị trang, lớp tương tác, chấm, đọc / ghi gói | Không gọi mạng, không biết tài khoản; nhận dữ liệu vào, báo sự kiện ra |
| **TeacherResource** | Đăng nhập, phân quyền, lớp, import gói, giữ đáp án, giao bài, lưu bài làm, chấm chính thức, thống kê, buổi trực tiếp | Không dàn trang lại, không sửa nội dung phiếu |

**Nguyên tắc PHẢI:**
1. Mã chấm chỉ có **một bản** (trong gói dùng chung). WS Editor thử chấm và máy chủ TeacherResource chấm thật cho ra cùng kết quả.
2. TeacherResource **không đoán**: mọi thứ cần để hiển thị và chấm nằm trong gói. Gói thiếu hoặc lỗi thì từ chối import và nói rõ lỗi.
3. Trình xem **không sửa** nội dung phiếu. Mọi thao tác (bài làm, nét vẽ, đáp án đang hiện) là lớp phủ.

## 4. Vai trò

| Vai trò | Thấy | Làm |
|---|---|---|
| **Người soạn** (trong WS Editor) | Mọi thứ | Soạn, thử làm như học sinh, xem chấm thử, xuất gói |
| **Giáo viên** | Đề + đáp án + bài làm của học sinh lớp mình | Dạy / chiếu (V1), giao bài, mở buổi trực tiếp, xem thống kê, chữa bài, chấm tay, chấm lại |
| **Học sinh** | Đề (không có đáp án). Sau khi nộp: kết quả của mình (đúng / sai từng chỗ, điểm) | Làm bài, nộp, xem kết quả của mình |

Học sinh **không bao giờ nhận đáp án qua mạng trước khi nộp**. Sau khi nộp, có hiện đáp án đúng cho học sinh hay không là **tùy chọn của lần giao** (mặc định: chỉ hiện đúng / sai, chưa hiện đáp án; giáo viên bật khi chữa bài xong).

## 5. Các chế độ của trình xem

Một trình xem, nhận cờ `mode`:

| Chế độ | Dùng ở | Hành vi |
|---|---|---|
| `preview` | WS Editor | Người soạn làm thử, bấm "Chấm thử" thấy đúng / sai ngay (đáp án có sẵn ở máy) |
| `teach` | TeacherResource (giáo viên), WS Editor | V1: chiếu, hiện đáp án theo phiếu / bài / câu, bút vẽ, công cụ trình chiếu |
| `answer` | TeacherResource (học sinh) | Làm bài; không có dữ liệu đáp án; tự lưu nháp lên máy chủ; Nộp |
| `result` | TeacherResource (học sinh) | Sau khi nộp: bài làm khóa, tô đúng / sai, điểm; đáp án đúng chỉ khi lần giao cho phép |
| `review` | TeacherResource (giáo viên) | Bài làm của một học sinh + đáp án; chấm tay câu mở; ghi nhận xét; chuyển em trước / sau |
| `live-board` | TeacherResource (giáo viên, buổi trực tiếp) | Phiếu kèm số liệu từng chỗ trả lời (bao nhiêu % đúng, ai sai), dùng để chữa bài trước lớp |

Giao diện nối trình xem với nơi chứa nó (gợi ý, đặt tên chi tiết trong Tài liệu 2 mục 8):
- **Vào:** trang đã dàn, danh sách chỗ trả lời, `mode`, bài làm hiện có, kết quả (nếu có), đáp án (chỉ `preview` / `teach` / `review`), số liệu lớp (chỉ `live-board`), nhãn giao diện.
- **Ra:** sự kiện `answerChanged {slotId, value}`, `submitRequested`, `gradeOverride {slotId, score, comment}` (giáo viên), `annotationChanged`.

## 6. Luồng chính

### 6.1 Soạn → thử → xuất → import (V3)
1. Người soạn làm phiếu như hiện nay, khai báo đáp án ở khung soạn (đã có từ v87–v92).
2. Bật **Thử làm** (`preview`): làm như học sinh, bấm Chấm thử. Chỗ nào không chấm được tự động thì trình xem ghi rõ "chấm tay".
3. **Xuất bản**: WS Editor chạy kiểm tra (Tài liệu 2 mục 9): thiếu đáp án, dạng chưa hỗ trợ, ảnh thiếu… Có lỗi chặn thì không xuất; có cảnh báo thì hiện để người soạn chấp nhận.
4. Ra file `.wsp` (đã ký, đã mã hóa).
5. TeacherResource import: kiểm chữ ký → giải mã → kiểm schema → lưu **phiên bản mới**, tách đáp án vào kho riêng phía máy chủ. Báo kết quả import (số Task, số chỗ trả lời, số câu chấm tay).

### 6.2 Về nhà (V2)
1. Giáo viên tạo **lần giao**: chọn phiên bản, lớp, hạn nộp, số lần làm (mặc định 1), có cho xem đáp án sau khi nộp không.
2. Học sinh đăng nhập, mở bài: trình xem `answer`. Mỗi thay đổi tự lưu nháp lên máy chủ (thoát ra vào lại vẫn còn).
3. Nộp → máy chủ chấm bằng hàm chấm dùng chung → học sinh thấy `result`.
4. Hết hạn mà chưa nộp: hệ thống tự nộp bản nháp (NÊN, có tùy chọn tắt).

### 6.3 Buổi trực tiếp trên lớp (V2)
1. Giáo viên mở buổi từ một lần giao chế độ trực tiếp → màn hình hiện **mã QR + mã ngắn**.
2. Học sinh quét mã, đăng nhập (hoặc đã đăng nhập sẵn) → vào thẳng phiếu `answer`. Chỉ học sinh thuộc lớp được giao mới vào được.
3. Màn giáo viên cập nhật tức thời: ai đã vào, tiến độ từng em, ai đã nộp.
4. Giáo viên có thể **khóa nộp** (kết thúc) bất kỳ lúc; bài chưa nộp được nộp tự động.
5. Sau khi kết thúc: thống kê lớp hiện ngay, giáo viên chuyển sang `live-board` để chữa bài.

Về kỹ thuật, buổi trực tiếp chỉ là một lần giao có thêm: mã vào, thời điểm mở / đóng, và kênh cập nhật tức thời (WebSocket hoặc tương đương). Dữ liệu bài làm dùng chung cấu trúc với bài về nhà.

### 6.4 Chữa bài và thống kê
- **Từng em** (`review`): phiếu với bài làm của em, tô đúng / sai, đáp án; giáo viên chấm tay câu mở, sửa điểm một chỗ, ghi nhận xét; nút em trước / em sau.
- **Cả lớp**:
  - Điểm từng em, trung bình, phân bố điểm, ai chưa nộp.
  - Theo **từng chỗ trả lời**: % đúng / sai / bỏ trống; với dạng chọn: bao nhiêu em chọn mỗi phương án (thấy ngay lỗi sai phổ biến).
  - Theo **từng Task**: % đúng.
  - Danh sách chỗ sai nhiều nhất.
- **Từng em theo thời gian** (NÊN, sau): lịch sử điểm các lần giao.
- `live-board`: phiếu chiếu trước lớp, mỗi chỗ trả lời có nhãn % đúng; bấm vào xem các câu trả lời sai phổ biến (ẩn tên học sinh theo mặc định).

## 7. Phiên bản

- **Mỗi lần xuất là một phiên bản bất biến.** Không sửa đè phiên bản đã import.
- Phiếu có **mã phiếu** cố định (`sheet.id` của WS Editor) và **số phiên bản** tăng dần. TeacherResource nhóm các phiên bản theo mã phiếu.
- **Lần giao trỏ đúng một phiên bản.** Bài làm luôn khớp với đề học sinh đã thấy.
- **Sửa đáp án sau khi đã giao** (đề không đổi): import phiên bản mới; nếu hệ thống xác định chỉ phần đáp án thay đổi (cùng `contentHash` của đề, Tài liệu 2 mục 3), giáo viên được chọn **"Chấm lại lần giao cũ theo đáp án mới"**. Đề đổi thì không chấm lại, chỉ giao lại.
- Thống kê nhiều lần giao của cùng một phiếu chỉ gộp được giữa các phiên bản có cùng đề (cùng `contentHash`).

Lý do: đơn giản, không có logic chuyển bài làm giữa hai đề khác nhau (dễ sai lặng lẽ), và chữa bài luôn đúng với cái học sinh đã thấy.

## 8. Bảo mật

### 8.1 Giới hạn thực tế
Không thể chống chụp màn hình, quay phim màn hình hay chép tay. Mã hóa phía trình duyệt chỉ làm khó, vì để hiển thị thì khóa phải có ở máy người xem. Mục tiêu: **(1)** người dùng bình thường không lấy được file để dùng ở nơi khác; **(2)** không lộ đáp án cho học sinh; **(3)** nếu rò rỉ thì truy được từ tài khoản nào.

### 8.2 Gói định dạng riêng, ký số và mã hóa
- Gói `.wsp` không phải HTML, không tự chạy. Chỉ WS Editor và TeacherResource mở được.
- **Ký số** (chữ ký bất đối xứng, ví dụ Ed25519): WS Editor ký bằng khóa riêng của công ty; TeacherResource chỉ nhận gói có chữ ký hợp lệ → không ai tự tạo hoặc sửa gói rồi đưa vào hệ thống.
- **Mã hóa** (ví dụ AES-GCM): nội dung gói mã hóa; mở bằng công cụ giải nén thông thường chỉ thấy dữ liệu rác.
- Chi tiết định dạng: Tài liệu 2 mục 2.

### 8.3 Người dùng không cầm file
- Trên TeacherResource, trang phiếu được tải từ máy chủ **sau khi đăng nhập và đúng quyền**, không có nút tải về, không có đường dẫn tĩnh công khai (dùng đường dẫn có hạn hoặc qua API có kiểm tra quyền).
- Ảnh trong phiếu phục vụ qua cùng cơ chế.
- Chỉ người có quyền quản lý nội dung mới tải lên / tải xuống gói `.wsp`.

### 8.4 Đáp án chỉ ở máy chủ
- Khi import, TeacherResource tách khối đáp án vào kho riêng.
- Dữ liệu gửi cho học sinh ở chế độ `answer` **không chứa** đáp án, giải thích, cách chấm. Kiểm thử tự động PHẢI quét phản hồi API gửi học sinh để bảo đảm điều này.
- Dạng chọn có xáo phương án theo từng học sinh (NÊN, giai đoạn sau): máy chủ đổi về thứ tự gốc trước khi chấm.

### 8.5 Dấu mờ và nhật ký
- Trình xem ở TeacherResource vẽ **dấu mờ** mảnh: tên tài khoản + thời gian, lặp chéo trang (NÊN tắt được ở chế độ `teach` khi chiếu).
- Nhật ký: ai mở phiếu nào, lúc nào; ai tải gói.

### 8.6 Quản lý khóa
- Khóa ký riêng chỉ nằm ở nơi xuất bản chính thức (bản WS Editor nội bộ hoặc dịch vụ ký); khóa công khai gắn trong TeacherResource.
- Khóa mã hóa: mỗi gói một khóa ngẫu nhiên, bọc bằng khóa công khai của TeacherResource (chỉ máy chủ TeacherResource mở được) và bằng khóa của WS Editor (để mở lại để sửa).
- Có quy trình đổi khóa (ghi `keyId` trong gói).
- **Câu hỏi mở:** WS Editor hiện là một file HTML chạy trên máy người soạn, nên khóa riêng đặt trong đó thì người có file cũng lấy được. Cần chọn: (a) ký qua một dịch vụ nhỏ của công ty (người soạn đăng nhập), hoặc (b) chỉ cho xuất gói ở bản WS Editor nằm trong TeacherResource. Đề xuất **(a)**, xem Tài liệu 3.

## 9. Công nghệ đề xuất

- **Gói dùng chung:** TypeScript + React (cùng công nghệ WS Editor đang chuyển sang). Lõi chấm và kiểm tra gói là **hàm thuần**, không đụng DOM, chạy được ở Node.
- **Định nghĩa chuẩn gói:** một lược đồ duy nhất (ví dụ Zod hoặc JSON Schema) sinh cả kiểu TypeScript và bộ kiểm tra.
- **TeacherResource:** để đội dev chọn; đề xuất Node + TypeScript để dùng thẳng gói dùng chung cho chấm phía máy chủ. Nếu chọn ngôn ngữ khác thì phải chạy hàm chấm qua một dịch vụ Node nhỏ, không viết lại.
- **Tổ chức mã:** một kho chứa (monorepo) nhiều gói: `ws-editor`, `ws-shared` (chuẩn gói, trình xem, chấm), `teacher-resource`. Hoặc tách repo nhưng `ws-shared` phát hành có số phiên bản.

## 10. Để sau (đã ghi nhận, chưa làm)
- Dùng không mạng (bản lưu tạm có hạn dùng).
- Xáo thứ tự phương án theo học sinh.
- Bảng xếp hạng, hiệu ứng phản hồi vui (tham khảo đặc tả M11, M15).
- Công cụ trình chiếu mở rộng: rèm, đèn rọi, đồng hồ, bảng trắng (tham khảo M8, M10).
- AI hỗ trợ chấm câu viết mở.
- Audio / video trong phiếu.

## 11. Giả định và câu hỏi còn mở

| # | Nội dung | Trạng thái |
|---|---|---|
| G1 | TeacherResource là web app, viết mới, dựa theo WS Editor; AI viết, dev người giám sát | Đã xác nhận |
| G2 | Học sinh chỉ thấy kết quả sau khi nộp | Đã xác nhận |
| G3 | Học sinh có tài khoản trong TeacherResource (kể cả khi quét mã ở buổi trực tiếp) | Giả định |
| G4 | Điểm mặc định: mỗi chỗ trả lời 1 điểm; người soạn đổi được trọng số theo Task | Giả định |
| G5 | Câu viết mở (Q2 nhiều đáp án, Q12) mặc định chấm tay | Giả định |
| H1 | Ký gói: dịch vụ ký của công ty hay chỉ xuất trong TeacherResource (mục 8.6) | Chờ chốt |
| H2 | Sau khi nộp có hiện đáp án đúng cho học sinh không, mặc định thế nào | Chờ chốt (đề xuất: tùy lần giao, mặc định không) |
| H3 | Một học sinh được làm lại bao nhiêu lần, lấy điểm lần nào | Chờ chốt (đề xuất: mặc định 1 lần) |
