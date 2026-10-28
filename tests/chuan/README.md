# Đường chuẩn (bước 1 của docs/KE_HOACH_REACT.md)

`v108/` = kết quả của `ws-editor-prototype.html` (v106 + bản sửa a/b/c thẳng cột v108, spec mục 39; thay `v106/` cũ) trên 24 phiếu (demo, `samples/`, `tests/*.json`, `tests/md/`, `tests/real/`) × 5 biến thể (gốc, đổi kiểu xếp trang, khoảng cách Thoáng, cỡ chữ Nhỏ, font Lexend) = 120 lần dàn trang.

Mỗi phiếu: `data.json` (dữ liệu sau nạp, id tự sinh thay bằng `(id)`), `xuat.md` (MD xuất ra), `hinh_<biến thể>.json` (mỗi trang, mỗi phần tử có class / ảnh: vị trí, kích thước ở 100 %, chữ trực tiếp), `trangN.png` (ảnh từng trang, biến thể gốc).

- Tạo lại (chỉ khi người dùng đồng ý đổi chuẩn): `python3 tests/chuan/chuan.py tao ws-editor-prototype.html tests/chuan/v117`
- So một bản mới: `python3 tests/chuan/chuan.py so <bản mới.html>` → `ALL OK` khi khớp 120/120.

Ảnh cho phép lệch ≤ 0,05 % điểm ảnh (khử răng cưa); hình học, dữ liệu, MD phải khớp tuyệt đối.
Kiểm tra độ nhạy (27/10): đổi cỡ chữ hướng dẫn `.92em → .93em` làm 110/120 lần lệch.

Ghi chú: `tests/cmp_v80.py` cũ nạp MD có dòng tên / tuổi bằng `J.sheet` (luôn `null` với MD) nên các phiếu MD đó thực ra không được nạp, phiếu cũ trên trang được so lại. `chuan.py` nạp như nút "+ Phiếu" (`impSheetObj`).
