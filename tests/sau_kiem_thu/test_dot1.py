# Đợt 1 sau kiểm thử (docs/KE_HOACH_SUA_SAU_KIEM_THU.md, v113): nối trùng chữ, dấu câu, T/F khác nhãn, gõ dài, nhãn Chấm tay.
# Cách dùng: python3 tests/sau_kiem_thu/test_dot1.py <app.html> [thư mục ảnh]
import sys, os
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from chung import *

with sync_playwright() as p:
    pg, b = mo(p, sys.argv[1])
    key(pg, 't')   # Từng Task: cả Task một khối
    # 1.1 nối hai vế phải trùng chữ "yes"
    task(pg, 19)
    mr = pg.evaluate("() => [...document.querySelectorAll('#wsShow section[data-task=t19] .mr')].map(m => m.dataset.opt + '=' + m.textContent.trim())")
    chk('1.1 vế phải mang mã phương án (data-opt)', len(mr) == 3 and all('=' in x and not x.startswith('undefined') for x in mr), mr)
    pg.click(S('t19.q2')); dot(pg, 't19', 'q2').click(); pg.wait_for_timeout(60)
    chk('1.1 nối b vào "yes" thứ hai → đúng', st(pg, 't19.q2') == 'ok', st(pg, 't19.q2'))
    pg.click(S('t19.q1')); dot(pg, 't19', 'q1').click(); pg.wait_for_timeout(60)
    chk('1.1 nối a vào "yes" thứ nhất → đúng, hai đường cùng còn', st(pg, 't19.q1') == 'ok' and st(pg, 't19.q2') == 'ok', [st(pg, 't19.q1'), st(pg, 't19.q2')])
    pg.click(S('t19.q3')); pg.click("#wsShow section[data-task='t19'] .mr[data-opt='q2']"); pg.wait_for_timeout(60)
    chk('1.1 nối c vào "yes" thứ hai → sai, b tự gỡ', st(pg, 't19.q3') == 'no' and st(pg, 't19.q2') == '', [st(pg, 't19.q3'), st(pg, 't19.q2')])
    reset_all(pg); key(pg, 'a')
    ends = pg.evaluate("""() => { const sec = document.querySelector('#wsShow section[data-task=t19]');
      return [...sec.querySelectorAll('svg.vline line')].map(l => Math.round(+l.getAttribute('y2'))); }""")
    chk('1.1 hiện đáp án: 3 đường tới 3 hàng khác nhau', len(ends) == 3 and len(set(ends)) == 3, ends)
    pg.screenshot(path=f'{SHOT}/d1_noi_trung_chu.png'); key(pg, 'a')
    # vế phải bấm trước, rồi chấm trái
    pg.click(f"#wsShow section[data-task='t19'] .mr[data-opt='q2']"); pg.click(S('t19.q2')); pg.wait_for_timeout(60)
    chk('1.1 bấm vế phải "yes" thứ hai trước rồi chấm trái b → đúng', st(pg, 't19.q2') == 'ok', st(pg, 't19.q2'))
    reset_all(pg)
    # 1.2 dấu câu
    task(pg, 5)
    typ(pg, 't5.q1', '.'); typ(pg, 't5.q2', ',')
    chk('1.2 đáp án "?" gõ "." → sai; đáp án "," gõ "," → đúng', [st(pg, 't5.q1'), st(pg, 't5.q2')] == ['no', 'ok'], [st(pg, 't5.q1'), st(pg, 't5.q2')])
    pg.click(S('t5.q1')); pg.keyboard.press('Control+A'); pg.keyboard.type('?'); pg.keyboard.press('Enter'); pg.wait_for_timeout(60)
    chk('1.2 sửa thành "?" → đúng', st(pg, 't5.q1') == 'ok', st(pg, 't5.q1'))
    typ(pg, 't5.q3', '?')
    chk('1.2 đáp án "!" gõ "?" → sai', st(pg, 't5.q3') == 'no', st(pg, 't5.q3'))
    reset_all(pg)
    # 1.3 T/F: đáp án T F, nhãn True False
    task(pg, 15)
    chk('1.3 T15 không còn nhãn Chấm tay', pg.query_selector("#wsShow section[data-task='t15'] .vmn") is None)
    opt(pg, 't15.q1', 2); opt(pg, 't15.q2', 2)
    chk('1.3 câu 1 (T) chọn False → sai; câu 2 (F) chọn False → đúng', [st(pg, 't15.q1'), st(pg, 't15.q2')] == ['no', 'ok'], [st(pg, 't15.q1'), st(pg, 't15.q2')])
    reset_all(pg)
    # 1.4 gõ dài không tràn
    task(pg, 1)
    first = pg.evaluate("() => [...document.querySelectorAll('#wsShow section[data-task=t1] [data-ans]')].map(e => e.dataset.ans)[0]")
    pg.click(S(first)); pg.keyboard.type('x' * 40 + ' ' + 'abcdefghij ' * 9); pg.wait_for_timeout(80)
    r = pg.evaluate("""id => { const sec = document.querySelector('#wsShow section[data-task=t1]'), h = document.querySelector(`#wsShow [data-ans='${id}']`), i = h.querySelector('.vwi');
      const a = sec.getBoundingClientRect(), c = h.getBoundingClientRect(); return [Math.round(c.right - a.right), i.tagName, Math.round(c.height), i.value.length]; }""", first)
    chk('1.4 gõ 140 ký tự: ô không vượt mép phải Task, đổi sang nhiều dòng', r[0] <= 1 and r[1] == 'TEXTAREA' and r[2] > 40 and r[3] == 140, r)
    chk('1.4 vẫn đang gõ (con trỏ trong ô)', pg.evaluate("() => document.activeElement && document.activeElement.dataset.for") == first)
    pg.screenshot(path=f'{SHOT}/d1_go_dai.png')
    pg.keyboard.press('Enter'); pg.wait_for_timeout(60)
    chk('1.4 Enter vẫn chấm (sai) và sang chỗ kế', st(pg, first) == 'no' and pg.evaluate("() => document.activeElement && document.activeElement.dataset.for") != first, st(pg, first))
    pg.evaluate("() => document.activeElement.blur()"); reset_all(pg)
    r2 = pg.evaluate("id => { const h = document.querySelector(`#wsShow [data-ans='${id}']`); return [h.style.minWidth, h.style.minHeight]; }", first)
    chk('1.4 làm lại: ô về kích thước gạch', r2 == ['', ''], r2)
    # 1.5 nhãn Chấm tay
    task(pg, 20); chip = pg.evaluate("() => { const c = document.querySelector('#wsShow section[data-task=t20] .vmn'); return c ? [c.textContent, c.title] : null; }")
    chk('1.5 nối không xáo: nhãn "Chấm tay" có lý do', chip is not None and 'Chấm tay' in chip[0] and 'Xáo' in chip[1], chip)
    pg.screenshot(path=f'{SHOT}/d1_cham_tay.png')
    task(pg, 30); chip = pg.evaluate("() => { const c = document.querySelector('#wsShow section[data-task=t30] .vmn'); return c ? [c.textContent, c.title] : null; }")
    chk('1.5 điền từ không đáp án: nhãn "Chấm tay"', chip is not None and 'Chấm tay' in chip[0] and 'chưa có đáp án' in chip[1], chip)
    task(pg, 29); chip = pg.evaluate("() => { const c = document.querySelector('#wsShow section[data-task=t29] .vmn'); return c ? c.textContent : null; }")
    chk('1.5 Task không có chỗ trả lời: không gắn nhãn chấm tay', chip in (None, 'Chỉ xem'), chip)
    task(pg, 8); chk('1.5 Task có đủ đáp án: không có nhãn', pg.query_selector("#wsShow section[data-task='t8'] .vmn") is None)
    task(pg, 27); chip = pg.evaluate("() => { const c = document.querySelector('#wsShow section[data-task=t27] .vmn'); return c ? c.textContent : null; }")
    chk('1.5 viết tự do: nhãn Chấm tay', chip is not None and 'Chấm tay' in chip, chip)
    xong(b)
