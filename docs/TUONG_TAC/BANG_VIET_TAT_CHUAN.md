# Bảng viết tắt chuẩn cho máy chấm (đề xuất, 28/10/2026)

> Trạng thái: **đã cài từ v116 (28/10/2026)**, `CONTRACTIONS` trong `shared/src/normalize.ts`; công tắc theo Task "Phân biệt viết tắt" (`strictContr`, MD `Phân biệt viết tắt: có`). Bản đề xuất ban đầu: Dùng để giải thích cho người dùng vì sao máy chấm `I'm` = `I am`, và là danh sách gốc khi cài (`shared/src/normalize.ts`). Đổi quyết định GĐ0 "không tự mở rộng viết tắt" theo yêu cầu người dùng 28/10 (kết quả thử tay B6).

## 1. Quy tắc
1. Trước khi so, cả **bài làm** và **từng đáp án chấp nhận** đều được đổi về dạng đầy đủ (mở rộng viết tắt trong bảng dưới), rồi so như hiện nay (không phân biệt hoa thường, bỏ khoảng trắng thừa, nháy cong ’ = ', bỏ dấu câu thừa ở hai đầu). Vì hai bên cùng đổi nên `I'm` và `I am` khớp nhau theo cả hai chiều.
2. Chỉ mở rộng các dạng **có trong bảng**. Không đoán `'s` sở hữu: `Tom's book` giữ nguyên.
3. `'s` sau đại từ / từ hỏi trong bảng đổi thành **is** (`he's` = `he is`). `he's` mang nghĩa *has* (he's gone) **không** được tự hiểu; người soạn ghi thêm ` / he has gone` nếu cần.
4. `'d` đổi thành **would** (`I'd` = `I would`). Nghĩa *had* ghi tay.
5. Dạng không chuẩn (`ain't`, `gonna`, `wanna`, `gotta`, `y'all`) **không** nằm trong bảng, không tự khớp với dạng đầy đủ.
6. **Bài dạy viết tắt** ("Write the short form", "Write the full form"): bắt buộc phân biệt. Cần công tắc theo Task / theo chỗ **"Phân biệt viết tắt"** (mặc định tắt = coi tương đương). Không có công tắc này thì bài `isn't` ← `is not` bị chấm đúng nhầm.
7. Mục tên riêng và chữ `I`: hiện máy bỏ phân biệt hoa thường hoàn toàn. Giữ nguyên (không thể phân biệt `I` với `i` mà không làm hỏng các câu khác); ghi chú để cân nhắc công tắc "Phân biệt hoa thường" cho bài chính tả (`caseSensitive` đã có trong kiểu dữ liệu).

## 2. Bảng
### Động từ "to be"
| Viết tắt | Đầy đủ |
|---|---|
| I'm | I am |
| you're / we're / they're | you are / we are / they are |
| he's / she's / it's | he is / she is / it is |
| that's / there's / here's | that is / there is / here is |
| what's / who's / where's / when's / how's / why's | what is / who is / where is / when is / how is / why is |
| isn't | is not |
| aren't | are not |
| wasn't | was not |
| weren't | were not |

### Trợ động từ và khuyết thiếu
| Viết tắt | Đầy đủ |
|---|---|
| don't | do not |
| doesn't | does not |
| didn't | did not |
| haven't | have not |
| hasn't | has not |
| hadn't | had not |
| can't | cannot (cũng nhận `can not`) |
| couldn't | could not |
| won't | will not |
| wouldn't | would not |
| shouldn't | should not |
| mustn't | must not |
| needn't | need not |
| shan't | shall not |

### Với will / have / would
| Viết tắt | Đầy đủ |
|---|---|
| I'll / you'll / he'll / she'll / it'll / we'll / they'll | I will / you will / he will / she will / it will / we will / they will |
| I've / you've / we've / they've | I have / you have / we have / they have |
| I'd / you'd / he'd / she'd / we'd / they'd | I would / you would / he would / she would / we would / they would |
| who'll / that'll / there'll | who will / that will / there will |

### Đặc biệt
| Viết tắt | Đầy đủ |
|---|---|
| let's | let us |
| o'clock | giữ nguyên (không mở rộng) |

## 3. Ví dụ
| Đáp án người soạn | Học sinh gõ | Kết quả | Vì sao |
|---|---|---|---|
| I am | I'm | Đúng | quy tắc 1 |
| He's | he is | Đúng | quy tắc 1, 3 |
| My name is | My name's | Đúng | `name's` không có trong bảng (sở hữu/is mơ hồ): **chỉ đúng nếu thêm `name` vào bảng**. Đề xuất: không thêm, người soạn ghi ` / My name's` |
| He has gone | He's gone | Sai | quy tắc 3 |
| isn't | is not | Đúng, **trừ khi bật Phân biệt viết tắt** | quy tắc 6 |
| Tom's book | Tom is book | Sai | quy tắc 2 |

## 4. Việc kèm theo khi cài (chờ "sửa")
- Thêm vào `normalize.ts` + test trong `shared/test` (mỗi hàng bảng một ca, hai chiều).
- Công tắc "Phân biệt viết tắt" ở cột trái (mục Câu hỏi) và trong MD; ghi vào `docs/TUONG_TAC/2_CHUAN_GOI_PHIEU.md` mục 6.2.
- Cập nhật `DUYET_GD0.md` (Task có đáp án `doesn't / does not` không cần ghi hai cách nữa).

## 5. Gợi ý cách viết khác khi nhập đáp án (đề xuất 28/10/2026; người dùng chọn **cách A**: chip ngay dưới ô đáp án, kèm nút “Nhận tất cả” khi Task nhiều gợi ý)
Thay vì máy đoán lúc chấm, máy **gợi ý lúc soạn** và người soạn quyết.
- **Khi nào:** ngay sau khi người soạn nhập / sửa đáp án chữ của một chỗ (ô đáp án trong khung soạn, hoặc khi nạp MD / JSON có đáp án).
- **Hiện thế nào:** dưới ô đáp án hiện vài **chip** nhỏ, ví dụ `+ He has gone`, `+ colour`. Bấm chip = thêm vào danh sách đáp án chấp nhận (ghi ` / `). Bấm × = bỏ gợi ý đó cho chỗ này (không hỏi lại). Chip đã chọn hiện như đáp án thường.
- **Gợi ý lấy từ đâu (quy tắc cố định, không AI, kết quả luôn như nhau):**
  1. Viết tắt ngoài bảng mặc định: `'s` có thể là *has*, `'d` có thể là *had*; ngược lại đáp án *has / had* gợi ý dạng rút gọn.
  2. Anh – Mỹ: colour / color, favourite / favorite, centre / center…
  3. Số: `ten` / `10`; `first` / `1st`.
  4. Dạng viết liền / gạch nối / cách: `ice cream`, `ice-cream`, `icecream`.
  5. Từ đồng nghĩa hay gặp trong lớp tiểu học: `OK` / `okay`, `TV` / `television`.
- **Không gợi ý** khi chỗ đó là bài chính tả / bài dạy viết tắt (công tắc "Phân biệt viết tắt").
- **Lưu:** chỉ lưu đáp án chấp nhận đã chọn (như ` / ` hiện nay); gói phiếu không cần biết gợi ý. Không đổi chuẩn `wsp/0`.
- **Sau này (tùy chọn):** AI đọc cả bài và đề xuất thêm chip; chip do AI đánh dấu riêng để người soạn biết đây là gợi ý, không phải quy tắc.
