#!/bin/bash
# Bộ test Lớp học thử: API (node) + trình duyệt (chạy lần lượt, một Chromium mỗi lúc)
cd "$(dirname "$0")/../.."
echo "-- api"; npm run -s test:lop 2>&1 | grep -E "^# (pass|fail)"
for t in tests/lop/test_lop.py tests/lop/test_cham.py tests/lop/test_demo.py tests/lop/test_live.py; do [ -f $t ] && { echo "-- $t"; python3 $t 2>&1 | grep -E "FAIL|đạt|ALL OK|SOME FAIL|Error|Traceback"; }; done
