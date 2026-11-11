# Cấu trúc file Cấp độ (mẫu: cuối Starters)

Mỗi cấp độ học sinh có một file Cấp độ, dùng chung cho mọi chuyên đề và mọi lesson ở cấp độ đó. File này quy định những gì **phụ thuộc trình độ học sinh**:
- quy mô phiếu;
- độ dài bài đọc và câu hỏi;
- từ vựng nền.

Trình tự (cách làm theo chuyên đề) và Kiến thức (nội dung lesson) không ghi lại các thông số này.

Chuẩn hiện tại: phiếu Grammar **cuối cấp độ Starters** (Cambridge Pre A1 Starters).

---

```
# Cấp độ
Tên: Starters (cuối cấp)
Phiên bản: 1.0
Từ vựng nền: TU_VUNG_NEN_STARTERS.md (Cambridge Pre A1 Starters, A–Z, cho kỳ thi từ 2018)

## Học sinh
Cuối cấp độ Pre A1 Starters. Câu ngắn, một mệnh đề hoặc hai mệnh đề nối bằng and / but. Chủ đề quen thuộc: gia đình, trường lớp, con vật, đồ chơi, nhà, đồ ăn, quần áo, sở thích.

## Quy mô phiếu
- Số Task: 5. Thông thường mỗi B một Task; được thêm hoặc bớt, miễn tổng thời gian khoảng 25 phút.
- Thời gian: khoảng 25 phút, học sinh tự làm.
- Số câu mỗi Task: 4–6, thông thường 5. Q12 tính theo dòng viết: 3–5.
- Bài đọc (khi Task có bài đọc): 60–80 từ, thông thường 70.

## Độ dài theo mức độ
| Tham số | Dễ | Vừa | Khó |
|---|---|---|---|
| Bài đọc | 60 từ | 70 từ | 80 từ |
| Phần đề của một câu hỏi, tối đa | 8 từ | 12 từ | 16 từ |
Bài đọc được lệch 5 từ so với số trong bảng, nhưng luôn nằm trong khoảng 60–80. Cách đếm phần đề theo định nghĩa ở Trình tự.

## Từ vựng
- Chỉ dùng từ trong Từ vựng nền và các dạng biến đổi của chúng (số nhiều, -s, -ing, viết tắt 's 've n't 'm).
- Được dùng thêm:
  - số đếm 1–20;
  - tên riêng có trong Từ vựng nền;
  - từ ghi ở mục "Từ thêm ngoài nền" của Kiến thức.
- Từ nằm ngoài các nguồn trên: app chặn.
```

---

## Quy ước

| Phần | Vai trò | Ai dùng |
|---|---|---|
| Đầu file: Tên, Phiên bản, Từ vựng nền | Kiến thức ghi `Cấp độ:` để app tìm đúng file | app |
| Học sinh | thay cho mục Học sinh của Kiến thức | AI |
| Quy mô phiếu | app dựng Bố cục mặc định (số Task, số câu); Trình tự đặt số câu mặc định trong khoảng này; số câu ngoài khoảng thì app cảnh báo | app, AI |
| Độ dài theo mức độ | app ghi vào Số liệu tính sẵn của Bố cục và kiểm sau khi sinh | app, AI |
| Từ vựng | app kiểm từng từ của phiếu | app |

## Nguyên tắc viết
- Chỉ ghi điều phụ thuộc trình độ. Điều phụ thuộc chuyên đề thuộc Trình tự; điều phụ thuộc lesson thuộc Kiến thức.
- Thông số do giáo viên chốt. Các số 60–80 từ, 5 Task, 4–6 câu là của giáo viên. Các số 8/12/16 từ là Claude đề xuất, chưa thử thật.
- **Còn thiếu:**
  - Danh sách ngữ pháp Starters (Grammar and structures list trong handbook của Cambridge) chưa có trong tay. Khi có, thêm mục "Ngữ pháp nền" để Trình tự và Kiến thức đối chiếu: điểm ngữ pháp nào thuộc Starters, cấu trúc nào ngoài phạm vi.
  - File từ vựng đã tải lên chỉ có phần A–Z, không có danh sách số đếm. Mục Từ vựng ở trên đã cho phép số 1–20 để bù.
