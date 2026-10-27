# Tài liệu 1. Tổng quan kiến trúc: phiếu tương tác, WS Editor và TeacherResource

> Bản nháp **v0.1** · 27/10/2026 (v0.1: học sinh không đăng nhập, vào bằng mã phiên + key; phiên theo lớp; bài về nhà để sau) · Viết từ thảo luận trong `THAO_LUAN.md`. Đặc tả `THAM_KHAO_DAC_TA_TRINH_XEM.md` chỉ là gợi ý tham khảo.
> Đọc kèm: `2_CHUAN_GOI_PHIEU.md` (hợp đồng dữ liệu), `3_LO_TRINH.md` (thứ tự làm).
> Quy ước: **PHẢI** = bắt buộc; **NÊN** = mặc định có, bỏ thì ghi lý do; **CÓ THỂ** = tùy chọn.

## 1. Mục tiêu và phạm vi

Phiếu bài tập soạn trong WS Editor (khổ A4, đã dàn trang) được dùng theo ba cách:

| Việc | Ai | Mô tả | Cần máy chủ |
|---|---|---|---|
| **V1. Tương tác trên phiếu** | Giáo viên | Chiếu phiếu, hiện đáp án, viết vẽ, chữa bài ngay trên phiếu | Không (trừ khi chữa bài của học sinh) |
| **V2. Tương tác lớp học** | Giáo viên + học sinh | Trên lớp: giáo viên mở phiên, học sinh vào bằng mã, làm, nộp; hệ thống chấm, lưu; giáo viên xem thống kê và chữa bài. (Bài về nhà: để sau) | Có |
| **V3. Soạn và xuất bản** | Người soạn | Soạn, **thử tương tác ngay trong WS Editor**, đóng gói xuất bản; TeacherResource import và **chạy ngay, không chỉnh lại** | Không |

Ngoài phạm vi bản này: bài về nhà (mục 6.3), dùng không mạng, ứng dụng điện thoại riêng, AI chấm câu mở, quản lý năm học / chương trình (xem mục 10).

## 2. Thuật ngữ

| Từ | Nghĩa |
|---|---|
| **Phiếu** | Một phiếu bài tập trong WS Editor (JSON `ws-editor/0.x`): các Task xếp dọc |
| **Task** | Một bài trong phiếu, có dạng câu hỏi Q1–Q12 và bố cục T1–T4 |
| **Câu** | Một mục trong Task (`content.items[]`), có `id` |
| **Chỗ trả lời** (slot) | Đơn vị nhỏ nhất học sinh trả lời và được chấm: một chỗ trống, một nhóm chọn, một ô bảng, một cặp nối… Một câu có thể có nhiều chỗ trả lời |
| **Gói phiếu** (`.wsp`) | File xuất bản từ WS Editor theo chuẩn ở Tài liệu 2. Đơn vị duy nhất TeacherResource nhận |
| **Phiên bản** | Mỗi lần xuất bản tạo một phiên bản bất biến của phiếu |
| **Lớp** | Lớp học trong TeacherResource, có **danh sách học sinh** cập nhật theo thời gian thực |
| **Học sinh** | Một bản ghi trong danh sách lớp (tên, ảnh đại diện, thông tin, **key cá nhân**). **Không có tài khoản đăng nhập** |
| **Phiên** (đầu mục bài) | Giáo viên mở cho một lớp, gắn một phiên bản phiếu, có **mã phiên**, thời hạn, cài đặt. **Mỗi lớp chỉ một phiên hoạt động** |
| **Bài làm** | Câu trả lời của một học sinh trong một phiên, lưu theo từng chỗ trả lời |
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
| **TeacherResource** | Tài khoản giáo viên, lớp + danh sách học sinh, import gói, giữ đáp án, phiên, lưu bài làm, chấm chính thức, thống kê, nhật ký | Không dàn trang lại, không sửa nội dung phiếu |

**Nguyên tắc PHẢI:**
1. Mã chấm chỉ có **một bản** (trong gói dùng chung). WS Editor thử chấm và máy chủ TeacherResource chấm thật cho ra cùng kết quả.
2. TeacherResource **không đoán**: mọi thứ cần để hiển thị và chấm nằm trong gói. Gói thiếu hoặc lỗi thì từ chối import và nói rõ lỗi.
3. Trình xem **không sửa** nội dung phiếu. Mọi thao tác (bài làm, nét vẽ, đáp án đang hiện) là lớp phủ.

## 4. Vai trò

| Vai trò | Danh tính | Thấy | Làm |
|---|---|---|---|
| **Người soạn** (WS Editor) | Tài khoản công ty (để ký gói) | Mọi thứ | Soạn, thử làm, chấm thử, xuất gói |
| **Giáo viên** | **Tài khoản** TeacherResource | Đề + đáp án + bài làm học sinh trong phiên mình mở | Mở và điều hành phiên, theo dõi, chốt phiên, chữa bài, chấm tay, chấm lại |
| **Học sinh** | **Không đăng nhập.** Bản ghi trong danh sách lớp, có **key cá nhân**. Vào phiên bằng mã phiên + key | Đề (không đáp án). Sau khi nộp: điểm tổng của mình và của lớp. Sau khi giáo viên chốt phiên: kết quả từng câu | Làm bài, nộp |

- Học sinh **không bao giờ nhận đáp án qua mạng trước khi giáo viên chốt phiên**.
- Sau khi chốt phiên, có hiện **đáp án đúng** cho học sinh hay chỉ hiện đúng / sai là cài đặt của phiên (mặc định: hiện đúng / sai và đáp án đúng, vì lúc này giáo viên đã chữa bài).
- Nhật ký tham gia (ai vào, lúc nào, nộp lúc nào, điểm) lưu theo **tài khoản giáo viên** và **lớp**, để truy xuất lại.

## 5. Các chế độ của trình xem

Một trình xem, nhận cờ `mode`:

| Chế độ | Dùng ở | Hành vi |
|---|---|---|
| `preview` | WS Editor | Người soạn làm thử, bấm "Chấm thử" thấy đúng / sai ngay (đáp án có sẵn ở máy) |
| `teach` | TeacherResource (giáo viên), WS Editor | V1: chiếu, hiện đáp án theo phiếu / bài / câu, bút vẽ, công cụ trình chiếu |
| `answer` | TeacherResource (học sinh) | Làm bài; không có dữ liệu đáp án; tự lưu nháp lên máy chủ; Nộp |
| `result` | TeacherResource (học sinh) | Sau khi nộp: điểm tổng của mình + bảng điểm lớp (thời gian thực). Sau khi giáo viên chốt phiên: tô đúng / sai từng câu; đáp án đúng nếu phiên cho phép |
| `review` | TeacherResource (giáo viên) | Bài làm của một học sinh + đáp án; chấm tay câu mở; ghi nhận xét; chuyển em trước / sau |
| `live-board` | TeacherResource (giáo viên, trong và sau phiên) | Phiếu kèm số liệu từng chỗ trả lời (bao nhiêu % đúng, ai sai), dùng để chữa bài trước lớp |

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

### 6.2 Phiên trên lớp (V2)
1. **Mở phiên:** giáo viên chọn lớp + phiên bản phiếu, đặt cài đặt (thời hạn, số lần làm, sau khi chốt có hiện đáp án đúng không). Hệ thống tạo **mã phiên** + **mã QR** + đường dẫn chung.
   - Lớp đã có phiên đang hoạt động → hỏi xác nhận: "Lớp 6A đang có phiên *Unit 5* (12 em đang làm). Mở phiên mới sẽ đóng phiên đó." Đồng ý → phiên cũ **đóng**, bài nháp dở được **nộp tự động**, nhật ký giữ nguyên.
   - Danh sách học sinh của lớp đi kèm phiên (chụp lại tại lúc mở; học sinh mới thêm vào lớp trong lúc phiên chạy cũng vào được).
2. **Học sinh vào:** quét QR (vào thẳng phiên) **hoặc** mở đường dẫn chung rồi nhập mã phiên → nhập **key cá nhân** → hệ thống nhận ra em (hiện ảnh đại diện, tên để em xác nhận) → vào phiếu `answer`.
   - Key sai hoặc không thuộc lớp → báo lỗi, không vào được.
   - Một key đang dùng ở thiết bị khác → hỏi "Tiếp tục trên máy này?" (máy cũ bị ngắt). Bài nháp lưu ở máy chủ nên không mất.
3. **Làm bài:** mỗi thay đổi tự lưu nháp lên máy chủ. Mất mạng → giữ tạm trên máy, có mạng lại thì gửi.
4. **Nộp:** máy chủ chấm ngay. Học sinh thấy **điểm tổng của mình** và **bảng điểm tổng của lớp, cập nhật thời gian thực**. Chưa thấy đúng / sai từng câu. Nếu phiên cho làm nhiều lần thì có nút Làm lại (giáo viên đặt số lần, lấy lần cao nhất hoặc lần cuối: cài đặt).
5. **Màn giáo viên (thời gian thực):** danh sách lớp với ảnh đại diện; trạng thái từng em (chưa vào / đang làm, tiến độ x/y / đã nộp, điểm); điểm trung bình; % đúng từng câu khi bài nộp dần về.
6. **Chốt phiên:** giáo viên bấm "Chốt phiên" → không nhận bài nữa, bài dở nộp tự động → học sinh xem được **kết quả từng câu** (`result`). Giáo viên chuyển sang chữa bài (6.4). Có thể **mở lại** phiên (ví dụ cho em vào muộn làm tiếp): khi mở lại, kết quả từng câu **bị ẩn lại** với mọi học sinh cho tới khi chốt lần nữa (giảm việc mách đáp án; em đã xem rồi thì vẫn có thể nhớ, giáo viên cân nhắc).
7. **Hết thời hạn** mà giáo viên chưa chốt → tự chốt.

Kỹ thuật: kênh cập nhật tức thời (WebSocket hoặc tương đương) cho màn giáo viên và bảng điểm lớp của học sinh.

### 6.3 Bài về nhà (để sau)
Tính sau khi phiên trên lớp chạy ổn. Ghi nhận trước: dùng chung cấu trúc phiên và bài làm; khác ở thời hạn dài, không cần màn theo dõi tức thời, và cần quyết luật "một phiên mỗi lớp" có áp cho bài về nhà không.

### 6.4 Chữa bài và thống kê
- **Từng em** (`review`): phiếu với bài làm của em, tô đúng / sai, đáp án; giáo viên chấm tay câu mở, sửa điểm một chỗ, ghi nhận xét; nút em trước / em sau.
- **Cả lớp**:
  - Điểm từng em, trung bình, phân bố điểm, ai chưa nộp.
  - Theo **từng chỗ trả lời**: % đúng / sai / bỏ trống; với dạng chọn: bao nhiêu em chọn mỗi phương án (thấy ngay lỗi sai phổ biến).
  - Theo **từng Task**: % đúng.
  - Danh sách chỗ sai nhiều nhất.
- **Từng em theo thời gian** (NÊN, sau): lịch sử điểm qua các phiên (được vì học sinh có mã cố định trong danh sách lớp).
- `live-board`: phiếu chiếu trước lớp, mỗi chỗ trả lời có nhãn % đúng; bấm vào xem các câu trả lời sai phổ biến (ẩn tên học sinh theo mặc định).

## 7. Phiên bản

- **Mỗi lần xuất là một phiên bản bất biến.** Không sửa đè phiên bản đã import.
- Phiếu có **mã phiếu** cố định (`sheet.id` của WS Editor) và **số phiên bản** tăng dần. TeacherResource nhóm các phiên bản theo mã phiếu.
- **Phiên trỏ đúng một phiên bản.** Bài làm luôn khớp với đề học sinh đã thấy.
- **Sửa đáp án sau khi đã giao** (đề không đổi): import phiên bản mới; nếu hệ thống xác định chỉ phần đáp án thay đổi (cùng `contentHash` của đề, Tài liệu 2 mục 3), giáo viên được chọn **"Chấm lại phiên cũ theo đáp án mới"**. Đề đổi thì không chấm lại, chỉ giao lại.
- Thống kê nhiều phiên của cùng một phiếu chỉ gộp được giữa các phiên bản có cùng đề (cùng `contentHash`).

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
- Trên TeacherResource, trang phiếu chỉ được tải từ máy chủ khi **giáo viên đã đăng nhập**, hoặc **học sinh đã vào phiên đang mở bằng mã phiên + key** (vé truy cập hết hạn khi phiên đóng), không có nút tải về, không có đường dẫn tĩnh công khai (dùng đường dẫn có hạn hoặc qua API có kiểm tra quyền).
- Ảnh trong phiếu phục vụ qua cùng cơ chế.
- Chỉ người có quyền quản lý nội dung mới tải lên / tải xuống gói `.wsp`.

### 8.4 Đáp án chỉ ở máy chủ
- Khi import, TeacherResource tách khối đáp án vào kho riêng.
- Dữ liệu gửi cho học sinh ở chế độ `answer` **không chứa** đáp án, giải thích, cách chấm. Kiểm thử tự động PHẢI quét phản hồi API gửi học sinh để bảo đảm điều này.
- Dạng chọn có xáo phương án theo từng học sinh (NÊN, giai đoạn sau): máy chủ đổi về thứ tự gốc trước khi chấm.

### 8.5 Dấu mờ và nhật ký
- Trình xem ở TeacherResource vẽ **dấu mờ** mảnh: tên giáo viên / tên học sinh + lớp + thời gian, lặp chéo trang (NÊN tắt được ở chế độ `teach` khi chiếu).
- Nhật ký: ai mở phiếu nào, lúc nào (học sinh ghi theo phiên, lớp, tài khoản giáo viên); ai tải gói.
- Key cá nhân của học sinh: giáo viên in / phát cho em; đổi được khi lộ. Không hiện key của em khác ở bất kỳ màn nào học sinh thấy.

### 8.6 Quản lý khóa
- Khóa ký riêng chỉ nằm ở nơi xuất bản chính thức (bản WS Editor nội bộ hoặc dịch vụ ký); khóa công khai gắn trong TeacherResource.
- Khóa mã hóa: mỗi gói một khóa ngẫu nhiên, bọc bằng khóa công khai của TeacherResource (chỉ máy chủ TeacherResource mở được) và bằng khóa của WS Editor (để mở lại để sửa).
- Có quy trình đổi khóa (ghi `keyId` trong gói).
- **Đã chốt (H1):** WS Editor là file chạy trên máy người soạn, nên không đặt khóa riêng trong đó. Dùng **dịch vụ ký nhỏ của công ty**: người soạn đăng nhập một lần trong WS Editor (nhớ phiên đăng nhập), sau đó bấm Xuất bản là gói tự gửi hash đi ký và nhận chữ ký, không thêm bước. Mất mạng thì báo "Chưa ký được, thử lại khi có mạng".

## 9. Công nghệ đề xuất

- **Gói dùng chung:** TypeScript + React (cùng công nghệ WS Editor đang chuyển sang). Lõi chấm và kiểm tra gói là **hàm thuần**, không đụng DOM, chạy được ở Node.
- **Định nghĩa chuẩn gói:** một lược đồ duy nhất (ví dụ Zod hoặc JSON Schema) sinh cả kiểu TypeScript và bộ kiểm tra.
- **TeacherResource:** để đội dev chọn; đề xuất Node + TypeScript để dùng thẳng gói dùng chung cho chấm phía máy chủ. Nếu chọn ngôn ngữ khác thì phải chạy hàm chấm qua một dịch vụ Node nhỏ, không viết lại.
- **Tổ chức mã:** một kho chứa (monorepo) nhiều gói: `ws-editor`, `ws-shared` (chuẩn gói, trình xem, chấm), `teacher-resource`. Hoặc tách repo nhưng `ws-shared` phát hành có số phiên bản.

## 10. Để sau (đã ghi nhận, chưa làm)
- Bài về nhà (mục 6.3).
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
| G3 | Học sinh **không có tài khoản**; có bản ghi trong danh sách lớp (ảnh, thông tin, key). Vào bằng mã phiên (QR hoặc đường dẫn chung) + key. Nhật ký theo tài khoản giáo viên. Phiên có thời hạn; **mỗi lớp chỉ một phiên hoạt động** (giáo viên chỉ mở và điều hành). Bài về nhà tính sau | Đã xác nhận |
| G4 | Điểm mặc định: mỗi chỗ trả lời 1 điểm; người soạn đổi được trọng số theo Task | Đã xác nhận |
| G5 | **Chỉ bài viết mở chấm tay.** Câu viết ngắn, câu có nhiều đáp án đúng đều chấm máy (danh sách đáp án chấp nhận) | Đã xác nhận |
| H1 | Ký gói: Claude chọn, miễn bảo mật mà không cản thao tác. Chọn: dịch vụ ký của công ty, người soạn đăng nhập một lần trong WS Editor, sau đó Xuất bản tự ký, không thêm bước | Đã chốt |
| H2 | Sau khi nộp: học sinh thấy **điểm tổng của mình và của lớp, theo thời gian thực**. Kết quả từng câu chỉ xem được **sau khi giáo viên "chốt phiên"** | Đã xác nhận |
| H3 | Số lần làm: giáo viên cài đặt cho từng phiên | Đã xác nhận |
