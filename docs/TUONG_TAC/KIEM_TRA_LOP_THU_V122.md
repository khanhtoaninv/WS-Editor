# Thử tay Báo cáo từng em + Insight AI (v122)

Chuẩn bị như v121. Muốn thử AI thật: chạy máy chủ có khóa, ví dụ Mac `ANTHROPIC_API_KEY=sk-ant-... npm run lop`, Windows PowerShell `$env:ANTHROPIC_API_KEY="sk-ant-..."; npm run lop` (cửa sổ máy chủ in "Insight AI: bật"). Khóa chỉ nằm ở máy chủ, không gửi cho trình duyệt.

| # | Làm | Mong đợi | Kết quả |
|---|---|---|---|
| 1 | Báo cáo lớp → bảng Học sinh → **Báo cáo em** | %, điểm, trung bình lớp, thứ hạng, câu đúng; nhận xét của cô / thầy (nếu đã viết khi chấm) | |
| 2 | Xem So với lớp | Thanh của em, vạch đứng = trung bình lớp, theo dạng bài và Task | |
| 3 | Xem Nhận xét nhanh của em | So với lớp, dạng mạnh / yếu, câu sai mà phần lớn lớp làm đúng, bỏ trống nhiều | |
| 4 | Xem Câu sai | Em trả lời, đáp án, % lớp đúng, lời nhắn khi chấm | |
| 5 | Không có khóa: bấm **✦ Lấy đoạn nhắc cho AI** | Hiện đoạn nhắc; **Chép đoạn nhắc**, dán vào ChatGPT / Claude tùy ý | |
| 6 | Đọc đoạn nhắc | Không có tên học sinh, không có bài viết, không có nhận xét của cô / thầy; chỉ số liệu | |
| 7 | Có khóa: bấm **✦ Insight AI** (ở báo cáo lớp và báo cáo em) | Sau vài giây hiện nhận định + gợi ý ôn tập bằng tiếng Việt; "Đoạn nhắc đã gửi" xem lại được | |
| 8 | Khóa sai | Báo "khóa API không đúng", vẫn hiện đoạn nhắc để chép | |
