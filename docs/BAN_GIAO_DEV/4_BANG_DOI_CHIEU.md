# Bàn giao dev 4: Bảng đối chiếu bản mẫu ↔ bản dev

Dev điền cột "Bản dev" khi đồng bộ. "Khớp" = qua bộ kiểm ở file 2 mục 2, hoặc lệch đã ghi lý do.

| # | Phần | Bản mẫu (v117) | Spec | Kiểm thử | Bản dev (số bản / trạng thái / ghi chú) |
|---|---|---|---|---|---|
| 1 | Mô hình phiếu, Task, G0–G4, G-Text | có | mục 18–23 | `tests/chuan/`, test1–49 | |
| 2 | Bố cục T (4 kiểu) + dạng Q (12 kiểu) | có | 18, 26 | chuan, test29–49 | |
| 3 | Khung ảnh, fit, co giãn | có | 19–21 | test, chuan | |
| 4 | Khoảng cách Gọn / Vừa / Thoáng / Tự do | có | T-mục cũ, 22 | chuan | |
| 5 | Xếp trang Liền / Tách, cắt Task dài | có | spec cũ | chuan | |
| 6 | Nhập MD / JSON / dán, không ghi đè | có | `QUY_UOC_MD.md`, `PHUONG_AN_NHAP_FILE.md` | `tests/md/`, `tests/real/` | |
| 7 | Xuất JSON / MD / HTML | có | | chuan (MD xuất) | |
| 8 | Đáp án trong khung soạn | có | 24 | test, giaodien | |
| 9 | Chip gợi ý cách viết khác | có | 47 | `test_dot4.py` | |
| 10 | Chỗ trả lời + khóa chấm `wsp/0` | có | 41 | `tests/gd0/`, `shared/fixtures/` | |
| 11 | Máy chấm (chuẩn hóa, viết tắt, dấu câu, T/F, tìm từ) | có | 44, 47, `2_CHUAN_GOI_PHIEU.md` 6 | `shared` npm test, `test_dot1/4.py` | |
| 12 | Trình chiếu: lật, Từng Task, phóng | có | 42, 46 | `gd1a/test_chieu.py`, `test_dot3.py` | |
| 13 | Trình chiếu: 1–2 trang, Cuộn, 🔍 | có | 48 | `test_dot5.py` | |
| 14 | Đáp án A / Space / ✓ Task | có | 42, 45 | `test_chieu.py`, `quet_phieu.py`, `test_dot2.py` | |
| 15 | Bút, xóa nét, ẩn nét | có | 42, 46 | `test_chieu.py`, `test_dot3.py` | |
| 16 | Che / hé, đồng hồ, bảng trắng (+ chữ) | có | 42, 48 | `test_chieu.py`, `test_dot5.py` | |
| 17 | Đèn pin, hộp ghi chú | có | 48 | `test_dot5.py` | |
| 18 | Làm thử + chấm (gõ, chọn, nối, tìm từ) | có | 43, 47 | `gd1b/test_lambai.py`, `quet_lambai.py` | |
| 19 | Chấm tay ✓ / ✗ khi chiếu | có | 45 | `test_dot2.py` | |
| 20 | Học sinh làm bài (GĐ1c) | **chưa** | `3_LO_TRINH.md` | | |
