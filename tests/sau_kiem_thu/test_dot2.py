# Đợt 2 sau kiểm thử (v114): chấm tay ✓ / ✗, đáp án theo phần đang xem, đáp án tự hiện gắn với lần làm sai, thử ngẫu nhiên.
# Cách dùng: python3 tests/sau_kiem_thu/test_dot2.py <app.html> [thư mục ảnh]
import sys, os, random
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from chung import *

VIS = """id => [...document.querySelectorAll(`#wsShow .vsurf [data-ans='${id}']`)].some(e => e.classList.contains('vok') || e.querySelector('.vans, .vok'))"""
def vis(pg, i): return pg.evaluate(VIS, i)
def nvis(pg): return pg.evaluate("() => document.querySelectorAll('#wsShow .vsurf .vans, #wsShow .vsurf .vok, #wsShow .vsurf svg.vline').length")
def score(pg): return pg.inner_text('#workScore')

with sync_playwright() as p:
    pg, b = mo(p, sys.argv[1])
    key(pg, 't')
    # 2.1 chấm tay
    task(pg, 30); s0 = score(pg)
    typ(pg, 't30.q1', 'pizza')
    chk('2.1 chỗ chưa có đáp án: gõ xong là chờ chấm tay, có nút ✓ / ✗', st(pg, 't30.q1') == 'man' and pg.query_selector("#wsShow [data-ans='t30.q1'] .vmk.ok") is not None, st(pg, 't30.q1'))
    pg.screenshot(path=f'{SHOT}/d2_cham_tay_cho.png')
    pg.click("#wsShow [data-ans='t30.q1'] .vmk.ok"); pg.wait_for_timeout(60)
    chk('2.1 bấm ✓ → đúng, nút ✓ / ✗ ẩn', st(pg, 't30.q1') == 'ok' and pg.query_selector("#wsShow [data-ans='t30.q1'] .vmk") is None, st(pg, 't30.q1'))
    n0, d0 = [int(x) for x in s0.split()[1].split('/')]; n1, d1 = [int(x) for x in score(pg).split()[1].split('/')]
    chk('2.1 bộ đếm cộng chỗ chấm tay (cả tử và mẫu)', (n1, d1) == (n0 + 1, d0 + 1), (s0, score(pg)))
    chk('2.1 chú thích bộ đếm ghi "kể cả chấm tay"', 'chấm tay' in pg.get_attribute('#workScore', 'title'))
    pg.click("#wsShow [data-ans='t30.q1'] .vwm.mj"); pg.wait_for_timeout(60)
    chk('2.1 bấm dấu ✓ đã chấm → chấm lại (về chờ)', st(pg, 't30.q1') == 'man', st(pg, 't30.q1'))
    pg.click("#wsShow [data-ans='t30.q1'] .vmk.no"); pg.wait_for_timeout(60)
    chk('2.1 bấm ✗ → sai', st(pg, 't30.q1') == 'no', st(pg, 't30.q1'))
    pg.click(S('t30.q1')); pg.keyboard.press('Control+A'); pg.keyboard.type('pasta'); pg.keyboard.press('Enter'); pg.wait_for_timeout(60)
    chk('2.1 sửa bài làm → chấm tay lại', st(pg, 't30.q1') == 'man', st(pg, 't30.q1'))
    pg.evaluate("() => document.activeElement && document.activeElement.blur()")
    task(pg, 20); pg.click(S('t20.q1')); pg.click("#wsShow section[data-task='t20'] .mr[data-opt='q2']"); pg.wait_for_timeout(60)
    chk('2.1 nối không xáo: nối xong chờ chấm tay', st(pg, 't20.q1') == 'man', st(pg, 't20.q1'))
    pg.click("#wsShow [data-ans='t20.q1'] .vmk.no"); pg.wait_for_timeout(60)
    chk('2.1 nối: bấm ✗ → đường đỏ', st(pg, 't20.q1') == 'no', st(pg, 't20.q1'))
    task(pg, 27); typ(pg, 't27.q1', 'I get up at seven.', enter=False); pg.evaluate("() => document.activeElement.blur()"); pg.wait_for_timeout(60)
    chk('2.1 viết tự do có bài mẫu: vẫn có ✓ / ✗, dấu ✎ vẫn mở bài mẫu', pg.query_selector("#wsShow [data-ans='t27.q1'] .vmk.ok") is not None and pg.query_selector("#wsShow [data-ans='t27.q1'] .vwm.tap") is not None)
    pg.click("#wsShow [data-ans='t27.q1'] .vwm.tap"); pg.wait_for_timeout(60)
    chk('2.1 bấm ✎ hiện bài mẫu', vis(pg, 't27.q1'))
    reset_all(pg)
    # 2.3 đáp án theo phần đang xem
    task(pg, 8); key(pg, 'a')
    chk('2.3 A ở Task 8: hiện đáp án Task 8', vis(pg, 't8.q1'))
    task(pg, 9); chk('2.3 sang Task 9: chưa bật thì trắng', nvis(pg) == 0, nvis(pg))
    task(pg, 8); chk('2.3 về Task 8: đáp án vẫn hiện', vis(pg, 't8.q1'))
    key(pg, 'a'); chk('2.3 A lần nữa: ẩn', nvis(pg) == 0)
    key(pg, 'Shift+A'); task(pg, 9); chk('2.3 Shift+A: hiện cả phiếu', nvis(pg) > 0)
    key(pg, 'Shift+A'); chk('2.3 Shift+A lần nữa: ẩn cả phiếu', nvis(pg) == 0)
    # 2.2 đáp án tự hiện gắn với lần làm sai
    task(pg, 1); tb(pg, '#workReveal')
    typ(pg, 't1.q3', 'likes')
    chk('2.2 bật "Sai thì hiện": sai → hiện đáp án', vis(pg, 't1.q3'))
    pg.click(S('t1.q3')); pg.keyboard.press('Control+A'); pg.keyboard.type("doesn't"); pg.keyboard.press('Enter'); pg.wait_for_timeout(60)
    chk('2.2 sửa thành đúng → đáp án tự ẩn', st(pg, 't1.q3') == 'ok' and not vis(pg, 't1.q3'), [st(pg, 't1.q3'), vis(pg, 't1.q3')])
    pg.evaluate("() => document.activeElement && document.activeElement.blur()"); tb(pg, '#workReveal')
    task(pg, 8); opt(pg, 't8.q1', 1)
    pg.click("#wsShow [data-ans='t8.q1'] .vwm.tap"); pg.wait_for_timeout(60)
    chk('2.2 tắt công tắc, bấm ✗ → hiện đáp án', vis(pg, 't8.q1'))
    opt(pg, 't8.q1', 2)
    chk('2.2 chọn lại đúng → đáp án (xanh biển) ẩn', st(pg, 't8.q1') == 'ok' and not vis(pg, 't8.q1'), [st(pg, 't8.q1'), vis(pg, 't8.q1')])
    key(pg, 'a'); opt(pg, 't8.q2', 1); opt(pg, 't8.q2', 2)
    chk('2.2 đáp án bật bằng A vẫn giữ khi làm lại', vis(pg, 't8.q2'))
    key(pg, 'a'); reset_all(pg)
    # thử ngẫu nhiên: so trạng thái hiện đáp án trên trang với mô hình
    random.seed(7)
    PICK = {8: ['t8.q1', 't8.q2', 't8.q3'], 13: ['t13.q1', 't13.q2', 't13.q3'], 10: ['t10.q1'], 15: ['t15.q1', 't15.q2']}
    TYPE = {1: [('t1.q2.1', 'went', 'go'), ('t1.q3', "doesn't", 'likes'), ('t1.q4', 'one', 'two')], 5: [('t5.q1', '?', '.'), ('t5.q2', ',', '!')]}
    tasks = sorted(set(PICK) | set(TYPE)); shown = set(); rev = set(); reveal = False; cur = None; bad_steps = []
    ok_opt = {}
    for step in range(70):
        a = random.choice(['task', 'A', 'pick', 'pick', 'type', 'type', 'reveal', 'x'])
        if a == 'task' or cur is None:
            cur = random.choice(tasks); task(pg, cur)
        view = PICK.get(cur, []) + [x[0] for x in TYPE.get(cur, [])]
        if a == 'A':
            key(pg, 'a'); on = any(i not in shown for i in view)
            for i in view: rev.discard(i); (shown.add if on else shown.discard)(i)
        elif a == 'reveal':
            tb(pg, '#workReveal'); reveal = not reveal
        elif a == 'pick' and cur in PICK:
            i = random.choice(PICK[cur]); j = random.randint(1, 2)
            before = st(pg, i); opt(pg, i, j); after = st(pg, i)
            if after in ('ok', 'no'):
                bad = after == 'no' and reveal
                if i in rev and not bad: rev.discard(i); shown.discard(i)
                if bad and i not in shown: rev.add(i); shown.add(i)
            elif after == '' and before in ('ok', 'no'):   # bấm lại phương án đang chọn: bỏ chọn
                if i in rev: rev.discard(i); shown.discard(i)
        elif a == 'type' and cur in TYPE:
            i, good, wrong = random.choice(TYPE[cur]); v = random.choice([good, wrong]); same = ok_opt.get(i) == v; ok_opt[i] = v
            pg.click(S(i)); pg.keyboard.press('Control+A'); pg.keyboard.type(v); pg.keyboard.press('Enter'); pg.wait_for_timeout(50)
            pg.evaluate("() => document.activeElement && document.activeElement.blur && document.activeElement.blur()"); pg.wait_for_timeout(40)
            bad = st(pg, i) == 'no' and reveal
            if not same:
                if i in rev and not bad: rev.discard(i); shown.discard(i)
                if bad and i not in shown: rev.add(i); shown.add(i)
        elif a == 'x':
            ws = [i for i in view if st(pg, i) == 'no']
            if ws:
                i = random.choice(ws); pg.click(f"#wsShow [data-ans='{i}'] .vwm.tap"); pg.wait_for_timeout(50)
                on = i not in shown; rev.discard(i); (shown.add if on else shown.discard)(i)
                if on: rev.add(i)
        got = {i for i in view if vis(pg, i)}; want = {i for i in view if i in shown}
        if got != want: bad_steps.append((step, a, cur, sorted(got), sorted(want)))
    chk('2.2 thử ngẫu nhiên 70 bước: đáp án hiện đúng như mô hình', not bad_steps, bad_steps[:3])
    xong(b)
