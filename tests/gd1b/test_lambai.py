# GĐ1b giáo viên tự làm thử trên phiếu (docs/TUONG_TAC/KE_HOACH_GD1B.md): kiểm từng bước C1–C5.
# Cách dùng: python3 tests/gd1b/test_lambai.py <app.html> [thư mục ảnh]   (một Chromium, không chạy song song)
import sys, os, json
from playwright.sync_api import sync_playwright

APP = os.path.abspath(sys.argv[1]); SHOT = os.path.abspath(sys.argv[2] if len(sys.argv) > 2 else '/tmp/gd1b_shots')
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.makedirs(SHOT, exist_ok=True)
res = []; errs = []
def chk(name, ok, info=''):
    res.append(ok); print(('PASS ' if ok else 'FAIL ') + name + ('' if ok else '  ' + str(info)[:400]))
def cur(pg): return pg.inner_text('#showCur')
def key(pg, k, n=1):
    for _ in range(n): pg.keyboard.press(k); pg.wait_for_timeout(50)
S = lambda i: f"#wsShow .vsurf [data-ans='{i}']"
def st(pg, i):   # trạng thái hiện trên trang của một chỗ: ok / no / part / man / sel / '' (lấy phần tử đầu có lớp)
    return pg.evaluate("""id => { const els = [...document.querySelectorAll(`#wsShow .vsurf [data-ans='${id}']`)];
      const all = els.flatMap(e => [e, ...e.querySelectorAll('*')]);
      for (const c of ['vw-ok', 'vw-no', 'vw-part', 'vw-man', 'vw-sel']) if (all.some(e => e.classList.contains(c))) return c.slice(3);
      const svg = els[0] && els[0].closest('section') && [...els[0].closest('section').querySelectorAll('svg.vwl')].find(s => s.dataset.vw === id);
      return svg ? [...svg.classList].find(c => c !== 'vwl') : ''; }""", i)
def typ(pg, i, text, enter=True):
    pg.click(S(i)); pg.wait_for_timeout(40); pg.keyboard.type(text)
    if enter: pg.keyboard.press('Enter')
    pg.wait_for_timeout(60)
def score(pg): return pg.inner_text('#workScore')
def tb(pg, sel):   # nút trên thanh công cụ (thanh tự ẩn: rê chuột cho hiện)
    pg.mouse.move(960, 520); pg.mouse.move(962, 522); pg.wait_for_timeout(40); pg.click(sel); pg.wait_for_timeout(60)
def reset_all(pg):
    if pg.is_enabled('#workReset'): tb(pg, '#workReset')
def goto_task(pg, n):   # Cả trang, sang trang chứa Task n
    pg.select_option('#wsShow .vsel', str(n - 1)); pg.wait_for_timeout(120)

with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1920, 'height': 1080})
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.goto('file://' + APP); pg.wait_for_function('() => typeof loadSheet === "function"'); pg.evaluate('() => document.fonts.ready')
    pg.evaluate("raw => { window.confirm = () => true; loadSheet(impSheetObj(readMd(raw))); }", open(os.path.join(ROOT, 'tests/gd0/mau-du-dang.md'), encoding='utf-8').read())
    pg.wait_for_timeout(300)
    pg.click('#showBtn'); pg.wait_for_selector('#wsShow'); pg.wait_for_timeout(200)

    # ---- C1 ô gõ
    n_in = pg.evaluate("() => document.querySelectorAll('#wsShow .vsurf .vwi').length")
    chk('C1 trang 1 có ô gõ', n_in >= 8, n_in)
    chk('C1 chưa làm gì: Đúng 0/…', score(pg).startswith('Đúng 0/'), score(pg))
    pg.click(S('t1.q1.1')); pg.wait_for_timeout(40)
    chk('C1 bấm vào gạch: con trỏ vào ô gõ', pg.evaluate("() => document.activeElement && document.activeElement.dataset.for") == 't1.q1.1')
    r = pg.evaluate("""() => { const h = document.querySelector("#wsShow [data-ans='t1.q1.1']"), i = h.querySelector('.vwi'), a = h.getBoundingClientRect(), c = i.getBoundingClientRect();
      return [Math.abs(a.left - c.left) < 1 && Math.abs(a.width - c.width) < 1 && Math.abs(a.top - c.top) < 1, getComputedStyle(i).fontSize === getComputedStyle(h).fontSize]; }""")
    chk('C1 ô gõ nằm đúng trên gạch, cỡ chữ theo phiếu', r == [True, True], r)
    pg.keyboard.type('WENT'); pg.keyboard.press('Enter'); pg.wait_for_timeout(60)
    chk('C1 gõ hoa "WENT" → đúng', st(pg, 't1.q1.1') == 'ok', st(pg, 't1.q1.1'))
    chk('C1 Enter sang chỗ kế tiếp', pg.evaluate("() => document.activeElement && document.activeElement.dataset.for") == 't1.q1.2')
    pg.keyboard.type('plays'); pg.keyboard.press('Enter'); pg.wait_for_timeout(60)
    chk('C1 gõ sai → sai', st(pg, 't1.q1.2') == 'no', st(pg, 't1.q1.2'))
    chk('C1 sai: mặc định không tự hiện đáp án', not pg.evaluate("() => !!document.querySelector(\"#wsShow [data-ans='t1.q1.2'] .vans\")"))
    pg.keyboard.type('doesn’t'); pg.keyboard.press('Tab'); pg.wait_for_timeout(60)
    chk('C1 nháy cong "doesn’t" → đúng, Tab cũng chấm', st(pg, 't1.q2') == 'ok', st(pg, 't1.q2'))
    pg.keyboard.type('  one  '); pg.keyboard.press('Escape'); pg.wait_for_timeout(60)
    chk('C1 thừa dấu cách, Esc (rời ô) cũng chấm', st(pg, 't1.q3') == 'ok', st(pg, 't1.q3'))
    chk('C1 Esc trong ô gõ không đóng trình chiếu', pg.query_selector('#wsShow') is not None)
    typ(pg, 't2.q1', 'were.')
    chk('C1 thừa dấu chấm cuối "were." → đúng', st(pg, 't2.q1') == 'ok', st(pg, 't2.q1'))
    typ(pg, 't2.q3', 'Do')
    chk('C1 gạch tới cuối dòng: gõ được, đúng', st(pg, 't2.q3') == 'ok', st(pg, 't2.q3'))
    typ(pg, 't3.lead.1', 'has'); typ(pg, 't3.lead.2', 'drink')
    chk('C1 chỗ trống bài đọc (1)(2): đúng / sai', [st(pg, 't3.lead.1'), st(pg, 't3.lead.2')] == ['ok', 'no'], [st(pg, 't3.lead.1'), st(pg, 't3.lead.2')])
    typ(pg, 't3.q1', 'Tom.')
    chk('C1 dòng viết câu: đúng', st(pg, 't3.q1') == 'ok', st(pg, 't3.q1'))
    chk('C1 bộ đếm Đúng 7/…', score(pg).startswith('Đúng 7/'), score(pg))
    pg.click(S('t1.q1.2')); pg.keyboard.press('Control+A'); pg.keyboard.type('played'); pg.wait_for_timeout(40)
    chk('C1 sửa lại: đang gõ thì bỏ màu', st(pg, 't1.q1.2') == '', st(pg, 't1.q1.2'))
    pg.keyboard.press('Enter'); pg.wait_for_timeout(50)
    chk('C1 sửa thành đúng', st(pg, 't1.q1.2') == 'ok')
    pg.keyboard.press('Escape')
    pg.screenshot(path=f'{SHOT}/c1_trang1.png')
    # phím tắt trình chiếu không chạy khi đang gõ
    c0 = cur(pg); pg.click(S('t1.q3')); pg.keyboard.press('Control+A'); pg.keyboard.type('tha'); pg.wait_for_timeout(60)
    chk('C1 gõ chữ t, h, a trong ô: không đổi kiểu xem / không che / không hiện đáp án', cur(pg) == c0 and not pg.query_selector('#wsShow .vcv') and not pg.query_selector('#wsShow .vok, #wsShow .vans'))
    pg.keyboard.press('Control+A'); pg.keyboard.type('one'); pg.keyboard.press('Escape')
    # ô bảng, ô nhìn ảnh viết, ô chữ
    goto_task(pg, 8); typ(pg, 't8.q1', 'Cat'); typ(pg, 't8.q2', 'ice-cream')
    chk('C1 nhìn ảnh viết: "Cat", cách viết thứ hai "ice-cream" đều đúng', [st(pg, 't8.q1'), st(pg, 't8.q2')] == ['ok', 'ok'], [st(pg, 't8.q1'), st(pg, 't8.q2')])
    goto_task(pg, 11); typ(pg, 't11.cell.r1.1', 'Swimming'); typ(pg, 't11.cell.r2.0', '10.'); typ(pg, 't11.cell.r2.1', 'books')
    chk('C1 ô bảng: đúng cả 3 (kể cả cách viết thứ hai)', [st(pg, x) for x in ('t11.cell.r1.1', 't11.cell.r2.0', 't11.cell.r2.1')] == ['ok'] * 3, [st(pg, x) for x in ('t11.cell.r1.1', 't11.cell.r2.0', 't11.cell.r2.1')])
    goto_task(pg, 13); pg.click(S('t13.cell.r1.0')); pg.keyboard.type('cat'); pg.wait_for_timeout(80)
    chk('C1 ô chữ: gõ "cat" tự nhảy sang ô kế, đúng cả 3 ô', [st(pg, f't13.cell.r1.{i}') for i in range(3)] == ['ok'] * 3, [st(pg, f't13.cell.r1.{i}') for i in range(3)])
    chk('C1 ô chữ: chữ hoa trong ô', pg.evaluate("() => document.querySelector(\"#wsShow [data-ans='t13.cell.r1.0'] .vwi\").value") == 'C')
    pg.click(S('t13.cell.r1.2')); pg.keyboard.press('Shift+T'); pg.keyboard.press('Shift+O'); pg.keyboard.press('Shift+X'); pg.wait_for_timeout(80)
    chk('C1 ô chữ: giữ Shift thì nhảy theo cột (T→O→X)', [st(pg, x) for x in ('t13.cell.r1.2', 't13.cell.r2.2', 't13.cell.r3.2')] == ['ok', 'ok', 'no'], [st(pg, x) for x in ('t13.cell.r1.2', 't13.cell.r2.2', 't13.cell.r3.2')])
    pg.keyboard.press('Escape')
    pg.screenshot(path=f'{SHOT}/c1_bang_ochu.png')
    goto_task(pg, 14); typ(pg, 't14.q1', 'I get up at six.', enter=False); pg.keyboard.press('Enter'); pg.keyboard.type('I go to school.'); pg.keyboard.press('Escape'); pg.wait_for_timeout(60)
    chk('C1 viết đoạn: Enter xuống dòng, ghi chấm tay', st(pg, 't14.q1') == 'man' and '\n' in pg.evaluate("() => document.querySelector(\"#wsShow [data-ans='t14.q1'] .vwi\").value"), st(pg, 't14.q1'))
    pg.screenshot(path=f'{SHOT}/c1_vietdoan.png')

    # ---- C2 bấm chọn
    OPT = lambda i, j: f"#wsShow .vsurf [data-ans='{i}'] > :is(.opt, b, span:not(.vans)):nth-of-type({j})"
    def opt(pg, i, j):   # bấm phương án thứ j (từ 1): con thứ j, hoặc phần tử thứ j cùng mã
        n = pg.evaluate(f"() => document.querySelectorAll(\"{S(i)}\").length")
        h = pg.query_selector_all(S(i))[j - 1] if n > 1 else pg.evaluate_handle(f"""() => {{ const e = document.querySelector("{S(i)}"); const k = e.querySelectorAll(':scope > .opt').length ? e.querySelectorAll(':scope > .opt') : e.querySelectorAll(':scope > b').length ? e.querySelectorAll(':scope > b') : e.querySelectorAll(':scope > span'); return k[{j - 1}]; }}""").as_element()
        h.click(); pg.wait_for_timeout(60)
    key(pg, 't'); goto_task(pg, 4)   # Từng Task: Task bị cắt trang vẫn liền một khối
    opt(pg, 't4.q1', 2); chk('C2 A/B/C: bấm "is" → đúng ngay', st(pg, 't4.q1') == 'ok', st(pg, 't4.q1'))
    opt(pg, 't4.q1', 1); chk('C2 A/B/C: bấm phương án khác = đổi, "am" → sai', st(pg, 't4.q1') == 'no' and pg.evaluate("() => document.querySelectorAll(\"#wsShow [data-ans='t4.q1'] .opt.vw-no\").length") == 1, st(pg, 't4.q1'))
    opt(pg, 't4.q1', 1); chk('C2 bấm lại phương án đang chọn: bỏ chọn', st(pg, 't4.q1') == '', st(pg, 't4.q1'))
    opt(pg, 't4.q2', 1); opt(pg, 't4.q2', 3)
    chk('C2 chọn nhiều: đang chọn viền xám, chưa chấm, có nút Chấm', st(pg, 't4.q2') == 'sel' and pg.query_selector("#wsShow [data-ans='t4.q2'] .vwgo") is not None, st(pg, 't4.q2'))
    pg.screenshot(path=f'{SHOT}/c2_chonnhieu.png')
    pg.click("#wsShow [data-ans='t4.q2'] .vwgo"); pg.wait_for_timeout(60)
    chk('C2 chọn nhiều: bấm Chấm → đúng', st(pg, 't4.q2') == 'ok', st(pg, 't4.q2'))
    opt(pg, 't4.q2', 2); chk('C2 chọn nhiều: đổi lựa chọn thì chờ chấm lại', st(pg, 't4.q2') == 'sel', st(pg, 't4.q2'))
    key(pg, 'Enter'); chk('C2 chọn nhiều: Enter cũng chấm → sai', st(pg, 't4.q2') == 'no', st(pg, 't4.q2'))
    goto_task(pg, 5); opt(pg, 't5.q1.1', 1); opt(pg, 't5.q1.2', 1); opt(pg, 't5.q2', 1)
    chk('C2 chọn trong câu {a|b}: goes đúng, play sai, am đúng', [st(pg, x) for x in ('t5.q1.1', 't5.q1.2', 't5.q2')] == ['ok', 'no', 'ok'], [st(pg, x) for x in ('t5.q1.1', 't5.q1.2', 't5.q2')])
    goto_task(pg, 6); opt(pg, 't6.q1', 2); chk('C2 tìm lỗi sai A–D: "school" → sai', st(pg, 't6.q1') == 'no')
    opt(pg, 't6.q1', 1); chk('C2 tìm lỗi sai: "go" → đúng', st(pg, 't6.q1') == 'ok')
    goto_task(pg, 7); opt(pg, 't7.q1', 1); opt(pg, 't7.q2', 1)
    chk('C2 T/F: True đúng, True sai', [st(pg, 't7.q1'), st(pg, 't7.q2')] == ['ok', 'no'])
    goto_task(pg, 9); opt(pg, 't9.q1', 1); chk('C2 chọn ảnh (ô tick): ô 1 → đúng', st(pg, 't9.q1') == 'ok', st(pg, 't9.q1'))
    goto_task(pg, 12); opt(pg, 't12.cell.r1', 1); opt(pg, 't12.cell.r2', 1)
    chk('C2 hàng tick trong bảng: chấm ngay, Farm đúng / Farm sai', [st(pg, 't12.cell.r1'), st(pg, 't12.cell.r2')] == ['ok', 'no'], [st(pg, 't12.cell.r1'), st(pg, 't12.cell.r2')])
    pg.screenshot(path=f'{SHOT}/c2_chon.png')
    goto_task(pg, 4); pg.screenshot(path=f'{SHOT}/c2_chon_t4.png')

    # ---- C3 nối
    goto_task(pg, 10)
    R = lambda t: f"#wsShow .vsurf section[data-task='t10'] .mrows > .mr:has-text('{t}')"
    RD = lambda t: pg.evaluate_handle(f"() => [...document.querySelectorAll('#wsShow .vsurf section[data-task=t10] .mrows > .mr')].find(m => m.textContent.trim() === '{t}').previousElementSibling.querySelector('.a7:not([data-ans])')").as_element()
    pg.click(S('t10.q1')); pg.wait_for_timeout(50)
    chk('C3 bấm chấm trái: chấm chờ nối nhấp nháy', pg.evaluate("() => document.querySelector(\"#wsShow [data-ans='t10.q1']\").classList.contains('vw-pend')"))
    RD('cold').click(); pg.wait_for_timeout(60)
    chk('C3 bấm chấm phải: vẽ đường, hot–cold đúng', st(pg, 't10.q1') == 'ok' and pg.query_selector("#wsShow svg.vwl[data-vw='t10.q1']") is not None, st(pg, 't10.q1'))
    pg.click(f"#wsShow .vsurf section[data-task='t10'] .mrows > .ml:has-text('big')"); pg.click(R('slow')); pg.wait_for_timeout(60)
    chk('C3 bấm chữ vế trái rồi chữ vế phải cũng nối: big–slow sai', st(pg, 't10.q2') == 'no', st(pg, 't10.q2'))
    pg.click(R('slow')); pg.wait_for_timeout(40)
    chk('C3 bấm vế phải trước: vế phải chờ nối', pg.evaluate("() => !!document.querySelector('#wsShow section[data-task=t10] .vw-pend')"))
    pg.click(S('t10.q3')); pg.wait_for_timeout(60)
    chk('C3 rồi bấm chấm trái: fast–slow đúng', st(pg, 't10.q3') == 'ok', st(pg, 't10.q3'))
    chk('C3 một vế phải chỉ một đường: big–slow tự gỡ', st(pg, 't10.q2') == '' and pg.query_selector("#wsShow svg.vwl[data-vw='t10.q2']") is None, st(pg, 't10.q2'))
    pg.screenshot(path=f'{SHOT}/c3_noi.png')
    bx = pg.evaluate("() => { const r = document.querySelector(\"#wsShow svg.vwl[data-vw='t10.q1'] line.hit\").getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }")
    pg.mouse.click(bx[0], bx[1]); pg.wait_for_timeout(60)
    chk('C3 bấm vào đường: gỡ đường', pg.query_selector("#wsShow svg.vwl[data-vw='t10.q1']") is None and st(pg, 't10.q1') == '', st(pg, 't10.q1'))
    pg.click(S('t10.q2')); key(pg, 'Escape')
    chk('C3 Esc bỏ chấm đang chờ, không thoát', pg.query_selector('#wsShow .vw-pend') is None and pg.query_selector('#wsShow') is not None)

    pg.screenshot(path=f'{SHOT}/c3_noi2.png')
    # bài nối có ô viết chữ: hàng vế phải không ghi chữ cái thì a, b, c theo thứ tự hàng (small, slow, cold)
    key(pg, 'Escape'); key(pg, 'Escape'); key(pg, 'Escape')
    pg.evaluate("raw => { window.confirm = () => true; loadSheet(impSheetObj(readMd(raw))); }", open(os.path.join(ROOT, 'tests/gd1b/mau-noi-o.md'), encoding='utf-8').read()); pg.wait_for_timeout(300)
    pg.click('#showBtn'); pg.wait_for_selector('#wsShow'); pg.wait_for_timeout(150)
    typ(pg, 't1.q1', 'c', enter=False); typ(pg, 't1.q2', 'A', enter=False); typ(pg, 't1.q3', 'a', enter=False); pg.keyboard.press('Escape')
    chk('C3 ô nối viết chữ: gõ c (cold) đúng, A (small) đúng, a cho fast sai', [st(pg, 't1.q1'), st(pg, 't1.q2'), st(pg, 't1.q3')] == ['ok', 'ok', 'no'], [st(pg, 't1.q1'), st(pg, 't1.q2'), st(pg, 't1.q3')])
    chk('C3 ô nối viết chữ: hiện chữ hoa', pg.evaluate("() => document.querySelector(\"#wsShow [data-ans='t1.q1'] .vwi\").value") == 'C')
    pg.screenshot(path=f'{SHOT}/c3_noi_o.png')
    typ(pg, 't2.q1', 'I wake up at 7.', enter=False); pg.keyboard.press('Escape'); pg.wait_for_timeout(60)
    chk('C4 viết tự do có bài mẫu: ghi chấm tay, dấu ✎ bấm được', st(pg, 't2.q1') == 'man' and pg.query_selector("#wsShow .vwm.vw-man.tap") is not None)
    pg.click('#wsShow .vwm.vw-man.tap'); pg.wait_for_timeout(60)
    chk('C4 bấm ✎: hiện bài mẫu', 'I get up at six' in (pg.evaluate("() => document.querySelector(\"#wsShow [data-ans='t2.q1'] .vans\")?.textContent") or ''))
    pg.screenshot(path=f'{SHOT}/c4_baimau.png')
    key(pg, 'Escape'); key(pg, 'Escape'); key(pg, 'Escape')
    pg.evaluate("raw => { window.confirm = () => true; loadSheet(impSheetObj(readMd(raw))); }", open(os.path.join(ROOT, 'tests/gd0/mau-du-dang.md'), encoding='utf-8').read()); pg.wait_for_timeout(300)
    pg.click('#showBtn'); pg.wait_for_selector('#wsShow'); pg.wait_for_timeout(150)
    key(pg, 't')

    # ---- C4 chấm và phản hồi: so với bài làm mẫu của shared/fixtures/mau-du-dang (đúng hết / trộn / bỏ trống)
    FX = os.path.join(ROOT, 'shared/fixtures/mau-du-dang')
    slots = {x['id']: x for x in json.load(open(f'{FX}/slots.json'))['slots']}
    MAP = {'correct': 'ok', 'wrong': 'no', 'partial': 'part', 'pending': 'man', 'blank': '', 'ungraded': ''}
    def do_answer(pg, sid, v):
        sl = slots[sid]; goto_task(pg, int(sid.split('.')[0][1:]))
        kind = pg.evaluate("id => { const e = document.querySelector(`#wsShow .vsurf [data-ans='${id}']`); return e.querySelector('.vwi') ? (e.classList.contains('xc') || e.classList.contains('mbx') ? 'one' : 'type') : 'other'; }", sid)
        if kind == 'one':
            import re; ch = re.sub(r'\W', '', str(v))[:1]; pg.click(S(sid)); pg.keyboard.type(ch); pg.keyboard.press('Escape')
        elif kind == 'type':
            pg.click(S(sid)); pg.keyboard.press('Control+A'); pg.keyboard.type(str(v)); pg.keyboard.press('Escape')
        elif sl['interaction'] == 'match':
            o = next(x for x in sl['options'] if x['id'] == v)
            pg.click(S(sid)); pg.evaluate_handle("([t, txt]) => [...document.querySelectorAll(`#wsShow section[data-task='${t}'] .mrows > .mr`)].find(m => m.textContent.trim() === txt)", [sl['task'], o['text']]).as_element().click()
        else:
            for oid in ([v] if isinstance(v, str) else v):
                opt(pg, sid, [x['id'] for x in sl['options']].index(oid) + 1)
            if pg.query_selector(f"#wsShow [data-ans='{sid}'] .vwgo"): pg.click(f"#wsShow [data-ans='{sid}'] .vwgo")
        pg.wait_for_timeout(40)
    def status_all(pg):
        out = {}
        for sid in slots:
            goto_task(pg, int(sid.split('.')[0][1:])); out[sid] = st(pg, sid)
        return out
    reset_all(pg)
    for name in ('dung-het', 'tron', 'bo-trong'):
        bai = json.load(open(f'{FX}/bai-{name}.json')); want = json.load(open(f'{FX}/mong-doi-{name}.json'))
        for sid, v in bai.items(): do_answer(pg, sid, v)
        got = status_all(pg)
        diff = {k: (got[k], MAP[want[k]]) for k in want if got.get(k) not in (MAP[want[k]],) and not (want[k] == 'ungraded' and got.get(k) == 'sel')}
        chk(f'C4 bài làm mẫu "{name}": màu từng chỗ khớp kết quả mong đợi ({len(want)} chỗ)', not diff, diff)
        nok = sum(1 for k in want if want[k] == 'correct' and slots[k].get('grading') == 'auto')
        chk(f'C4 bài "{name}": bộ đếm Đúng {nok}/…', score(pg).startswith(f'Đúng {nok}/'), score(pg))
        if name == 'tron':
            goto_task(pg, 1)
            chk('C4 sai: chưa hiện đáp án', pg.query_selector("#wsShow [data-ans='t1.q1.2'] .vans") is None)
            pg.click("#wsShow [data-ans='t1.q1.2'] .vwm.tap"); pg.wait_for_timeout(60)
            chk('C4 bấm dấu ✗: hiện đáp án chỗ đó', pg.evaluate("() => document.querySelector(\"#wsShow [data-ans='t1.q1.2'] .vans\")?.textContent") == 'played')
            pg.screenshot(path=f'{SHOT}/c4_tron_t1.png')
            goto_task(pg, 4); pg.screenshot(path=f'{SHOT}/c4_tron_t4.png')
            goto_task(pg, 13); pg.screenshot(path=f'{SHOT}/c4_tron_t13.png')
            n_t1 = lambda: pg.evaluate("() => [...document.querySelectorAll('#wsShow section[data-task=t1] .vwi')].filter(i => i.value).length")
            goto_task(pg, 1); pg.click("#wsShow section[data-task='t1'] .vrs"); pg.wait_for_timeout(60)
            chk('C4 ⟲ đầu Task: xóa bài làm Task đó', n_t1() == 0 and not pg.query_selector('#wsShow section[data-task=t1] .vwm') and pg.query_selector("#wsShow section[data-task='t1'] .vrs") is None)
            goto_task(pg, 2); chk('C4 ⟲ Task không đụng Task khác', st(pg, 't2.q1') == 'no')
        reset_all(pg)
        chk(f'C4 Làm lại cả phiếu sau bài "{name}": sạch, Đúng 0', score(pg).startswith('Đúng 0/') and not pg.query_selector('#wsShow .vwm, #wsShow .vw-sel, #wsShow svg.vwl') and pg.evaluate("() => [...document.querySelectorAll('#wsShow .vwi')].every(i => !i.value)"), score(pg))
    # công tắc Sai thì hiện đáp án
    tb(pg, '#workReveal'); goto_task(pg, 1); typ(pg, 't1.q2', 'dont', enter=False); pg.keyboard.press('Escape'); pg.wait_for_timeout(60)
    chk('C4 bật "Sai thì hiện đáp án": sai xong hiện luôn', pg.evaluate("() => document.querySelector(\"#wsShow [data-ans='t1.q2'] .vans\")?.textContent") == "doesn't")
    typ(pg, 't1.q3', 'one', enter=False); pg.keyboard.press('Escape')
    chk('C4 đúng thì không hiện thêm', pg.query_selector("#wsShow [data-ans='t1.q3'] .vans") is None)
    pg.screenshot(path=f'{SHOT}/c4_hiendapan.png')
    tb(pg, '#workReveal'); reset_all(pg)

    # ---- C5 ghép với 1a và bàn phím
    goto_task(pg, 1); pg.click(S('t1.q2')); pg.keyboard.press('Shift+Tab'); pg.wait_for_timeout(40)
    chk('C5 Shift+Tab: về chỗ trước', pg.evaluate("() => document.activeElement && document.activeElement.dataset.for") == 't1.q1.2')
    pg.keyboard.press('Escape')
    # bút: cầm bút kéo qua chỗ trống là vẽ, không làm bài
    key(pg, 'p'); h = pg.query_selector(S('t1.q1.1')).bounding_box()
    pg.mouse.move(h['x'] + 5, h['y'] + 5); pg.mouse.down(); pg.mouse.move(h['x'] + 60, h['y'] + 12, steps=6); pg.mouse.up(); pg.wait_for_timeout(60)
    chk('C5 cầm bút: kéo qua chỗ trống là vẽ, không vào ô gõ', pg.evaluate("() => document.querySelectorAll('#wsShow .vink path').length") >= 1 and pg.evaluate("() => !document.activeElement || !document.activeElement.classList.contains('vwi')"))
    pg.mouse.click(h['x'] + 10, h['y'] + 6); pg.wait_for_timeout(60)
    chk('C5 cầm bút: bấm vào chỗ trống cũng không làm bài', pg.evaluate("() => !document.activeElement || !document.activeElement.classList.contains('vwi')"))
    key(pg, 'Escape'); pg.mouse.click(h['x'] + 10, h['y'] + 6); pg.wait_for_timeout(60)
    chk('C5 Esc về con trỏ: bấm là làm bài', pg.evaluate("() => document.activeElement && document.activeElement.dataset.for") == 't1.q1.1')
    pg.keyboard.press('Escape')
    n0 = pg.evaluate("() => document.querySelectorAll('#wsShow .vink path').length")
    goto_task(pg, 4); o = pg.evaluate_handle(f"() => document.querySelector(\"{S('t4.q1')}\").querySelectorAll('.opt')[2]").as_element().bounding_box()
    pg.keyboard.down('Control'); pg.mouse.move(o['x'] + 2, o['y'] + 4); pg.mouse.down(); pg.mouse.move(o['x'] + 80, o['y'] + 6, steps=6); pg.mouse.up(); pg.keyboard.up('Control'); pg.wait_for_timeout(80)
    chk('C5 con trỏ + giữ Ctrl kéo qua phương án: tô vàng, không chọn', st(pg, 't4.q1') == '' and pg.evaluate("() => document.querySelectorAll('#wsShow .vink path').length") >= 1, st(pg, 't4.q1'))
    # che / hé (chờ qua 0,3 s sau nét vẽ: cú bấm ngay sau khi vẽ bị bỏ qua)
    pg.wait_for_timeout(300); key(pg, 'h'); pg.wait_for_timeout(60)
    pg.click(f"#wsShow section[data-task='t4'] .vcv >> nth=0"); pg.wait_for_timeout(60)
    chk('C5 bấm tấm che: chỉ hé, không chọn', st(pg, 't4.q1') == '' and pg.evaluate("() => document.querySelectorAll('#wsShow section[data-task=t4] .vcv').length") == 1)
    opt(pg, 't4.q1', 2); chk('C5 câu đã hé: bấm phương án là làm bài', st(pg, 't4.q1') == 'ok', st(pg, 't4.q1'))
    key(pg, 'h')
    # phóng: ô gõ vẫn khớp chỗ trống
    goto_task(pg, 1); key(pg, '+'); key(pg, '+')
    ok = pg.evaluate("""() => [...document.querySelectorAll('#wsShow .vwi')].every(i => { const a = i.parentElement.getBoundingClientRect(), c = i.getBoundingClientRect(); return Math.abs(a.left - c.left) < 1.5 && Math.abs(a.top - c.top) < 1.5 && Math.abs(a.width - c.width) < 1.5; })""")
    chk('C5 phóng to: ô gõ vẫn khớp từng chỗ', ok)
    pg.click(S('t1.q1.1')); pg.keyboard.type('went'); pg.keyboard.press('Escape'); chk('C5 đang phóng vẫn gõ được', st(pg, 't1.q1.1') == 'ok')
    key(pg, '0')
    # đổi kiểu xem, lật trang: giữ bài làm
    key(pg, 't'); pg.wait_for_timeout(100)
    chk('C5 sang Cả trang: bài làm còn nguyên', st(pg, 't1.q1.1') == 'ok' and pg.evaluate(f"() => document.querySelector(\"{S('t1.q1.1')} .vwi\").value") == 'went')
    key(pg, 'End'); key(pg, 'Home'); chk('C5 lật trang rồi về: vẫn còn', st(pg, 't1.q1.1') == 'ok')
    key(pg, 'a'); pg.wait_for_timeout(60)
    chk('C5 A: hiện đáp án cả phiếu, bài làm vẫn còn', pg.query_selector('#wsShow .vans') is not None and st(pg, 't1.q1.1') == 'ok')
    pg.screenshot(path=f'{SHOT}/c5_dapan_va_bailam.png')
    key(pg, 'a')
    sc = score(pg); key(pg, 'Escape'); key(pg, 'Escape'); key(pg, 'Escape'); pg.wait_for_timeout(80)
    chk('C5 đóng trình chiếu', pg.query_selector('#wsShow') is None)
    chk('C5 phiếu soạn không bị thêm gì', pg.evaluate("() => !document.querySelector('#stage .vwi, #stage .vwm, #stage .vw-ok, #stage .vw-sel, #stage svg.vwl')"))
    pg.click('#showBtn'); pg.wait_for_selector('#wsShow'); pg.wait_for_timeout(150)
    chk('C5 mở lại: bài làm đã xóa (không lưu)', score(pg).startswith('Đúng 0/') and pg.evaluate("() => [...document.querySelectorAll('#wsShow .vwi')].every(i => !i.value)"), (sc, score(pg)))
    # màn hình nhỏ (máy chiếu 1366×768): thanh công cụ không tràn
    pg.evaluate('() => document.fullscreenElement && document.exitFullscreen()'); pg.wait_for_timeout(200)
    pg.set_viewport_size({'width': 1366, 'height': 768}); pg.wait_for_timeout(150); pg.mouse.move(600, 400)
    chk('C5 1366×768: thanh công cụ vừa màn hình', pg.evaluate("() => { const b = document.querySelector('#wsShow .vbar'); return b.scrollWidth <= b.clientWidth + 1 && b.getBoundingClientRect().left >= 0; }"))
    pg.set_viewport_size({'width': 1920, 'height': 1080}); pg.wait_for_timeout(100); pg.mouse.move(600, 400)
    chk('C5 1920×1080: thanh công cụ vừa màn hình', pg.evaluate("() => { const b = document.querySelector('#wsShow .vbar'); return b.scrollWidth <= b.clientWidth + 1 && b.getBoundingClientRect().left >= 0; }"))

    print('ERRS', errs[:5])
    print(f'{sum(res)}/{len(res)} PASS')
    b.close()
