#!/bin/bash
# Chạy lần lượt từng test (mỗi test một tiến trình riêng, giới hạn 240 s), in tóm tắt.
# Cách dùng: bash run_all.sh <bản mới.html> <bản cũ để so test2.html> [danh sách test]
NEW=$1; OLD=$2; shift 2
LIST=${@:-"test1 test2 test3 test4 test5 test6 test7 test8 test9 test10 test11 test12 test13 test14 test15 test16 test17 test18 test19 test20 test21 test22 test23 test24 test25 test26 test27 test28 test29 test30 audit"}
cd "$(dirname "$0")"
mkdir -p ../logs
for T in $LIST; do
  [ -f "$T.py" ] || continue
  S=$(date +%s)
  if [ "$T" = "test2" ]; then timeout 240 python3 $T.py "$NEW" "$OLD" > ../logs/$T.log 2>&1
  else timeout 240 python3 $T.py "$NEW" > ../logs/$T.log 2>&1; fi
  RC=$?; E=$(( $(date +%s) - S ))
  NF=$(grep -c '^FAIL' ../logs/$T.log); NP=$(grep -c '^PASS' ../logs/$T.log)
  LAST=$(grep -E 'ALL OK|SOME FAIL|PROBLEMS' ../logs/$T.log | tail -1)
  ER=$(grep -E '^ERRS' ../logs/$T.log | tail -1 | cut -c1-120)
  echo "$T rc=$RC ${E}s pass=$NP fail=$NF | $LAST | $ER"
done
