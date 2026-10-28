#!/bin/bash
# Bấm đúp để dạy có học sinh (Mac): cập nhật bản mới, bật máy chủ Lớp học thử, mở WS Editor. Cần Node.js 22.6+.
# Trong WS Editor bấm nút Live để giao phiếu cho lớp. Mật khẩu giáo viên in ngay trong cửa sổ này.
cd "$(dirname "$0")"
if command -v git >/dev/null && [ -d .git ]; then echo "Đang cập nhật bản mới nhất …"; git pull --ff-only || echo "Không cập nhật được, vẫn chạy bản đang có."; fi
(sleep 3; open "http://localhost:1531/editor") &
npm run lop
read -p "Bấm Enter để đóng cửa sổ…"
