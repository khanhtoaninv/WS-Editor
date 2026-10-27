# GĐ1a trình chiếu (docs/TUONG_TAC/KE_HOACH_GD1A.md): kiểm từng bước B1–B7.
# Cách dùng: python3 tests/gd1a/test_chieu.py <app.html> [thư mục ảnh]   (một Chromium, không chạy song song)
import sys, os
from playwright.sync_api import sync_playwright

APP = os.path.abspath(sys.argv[1]); SHOT = os.path.abspath(sys.argv[2] if len(sys.argv) > 2 else '/tmp/gd1a_shots')
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.makedirs(SHOT, exist_ok=True)
res = []; errs = []
def chk(name, ok, info=''):
    res.append(ok); print(('PASS ' if ok else 'FAIL ') + name + ('' if ok else '  ' + str(info)[:400]))
def cur(pg): return pg.inner_text('#showCur')
def load(pg, md=None):
    if md is None: pg.evaluate("() => { window.confirm = () => true; loadSheet(clone(SAMPLE2)); }")
    else: pg.evaluate("raw => { window.confirm = () => true; loadSheet(impSheetObj(readMd(raw))); }", open(os.path.join(ROOT, md), encoding='utf-8').read())
    pg.wait_for_timeout(300)
def key(pg, k, n=1):
    for _ in range(n): pg.keyboard.press(k); pg.wait_for_timeout(60)

with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1920, 'height': 1080})
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.goto('file://' + APP); pg.wait_for_function('() => typeof loadSheet === "function"'); pg.evaluate('() => document.fonts.ready')
    load(pg)
    nP = pg.evaluate("() => document.querySelectorAll('#stage .page').length")
    before = pg.evaluate("() => document.getElementById('stage').innerHTML.length")

    # ---- B1 khung chiếu
    pg.click('#showBtn'); pg.wait_for_selector('#wsShow'); pg.wait_for_timeout(200)
    chk('B1 mở trình chiếu, trang 1', cur(pg) == f'Trang 1/{nP}', cur(pg))
    chk('B1 có HTML trang và chân trang', pg.evaluate("() => document.querySelectorAll('#wsShow .vpage .flow section.task').length > 0 && !!document.querySelector('#wsShow .vpage .pfoot')"))
    w = pg.evaluate("() => { const r = document.querySelector('#wsShow .vbox').getBoundingClientRect(); return [r.width, r.height]; }")
    chk('B1 trang vừa chiều cao màn hình', 1000 <= w[1] <= 1080 and abs(w[0] / w[1] - 210 / 297) < .01, w)
    pg.screenshot(path=f'{SHOT}/b1_trang1_1920.png')
    key(pg, 'PageDown'); chk('B1 PageDown sang trang 2', cur(pg) == f'Trang 2/{nP}', cur(pg))
    key(pg, 'ArrowLeft'); chk('B1 ← về trang 1', cur(pg) == f'Trang 1/{nP}', cur(pg))
    key(pg, 'End'); chk('B1 End trang cuối', cur(pg) == f'Trang {nP}/{nP}', cur(pg))
    key(pg, 'ArrowRight'); chk('B1 không qua trang cuối', cur(pg) == f'Trang {nP}/{nP}', cur(pg))
    key(pg, 'Home')
    pg.mouse.move(400, 400); pg.wait_for_timeout(3400)
    chk('B1 thanh công cụ tự ẩn', pg.evaluate("() => document.querySelector('#wsShow').classList.contains('nobar')"))
    pg.mouse.move(420, 420); pg.wait_for_timeout(100)
    chk('B1 rê chuột thì thanh hiện lại', not pg.evaluate("() => document.querySelector('#wsShow').classList.contains('nobar')"))
    key(pg, 'z'); key(pg, 'Escape'); chk('B1 Esc khi đang dùng công cụ chỉ tắt công cụ', pg.query_selector('#wsShow') is not None)
    key(pg, 'Escape'); pg.wait_for_timeout(100)
    chk('B1 Esc thoát trình chiếu', pg.query_selector('#wsShow') is None)
    chk('B1 phiếu soạn không đổi', pg.evaluate("() => document.getElementById('stage').innerHTML.length") == before)

    # ---- B2 từng Task
    pg.click('#showBtn'); pg.wait_for_selector('#wsShow'); key(pg, 't'); pg.wait_for_timeout(150)
    chk('B2 T sang Từng Task', cur(pg).startswith('Task '), cur(pg))
    info = pg.evaluate("() => [...document.querySelectorAll('#stage section.task')].reduce((m, s) => (m[s.dataset.task] = (m[s.dataset.task] || 0) + 1, m), {})")
    nT = len(info); multi = [k for k, v in info.items() if v > 1]
    seen = []; scrolled = False
    for _ in range(200):
        ids = pg.evaluate("() => [...new Set([...document.querySelectorAll('#wsShow .vflow section.task')].map(s => s.dataset.task))]")
        if len(ids) != 1: chk('B2 mỗi lần chỉ một Task', False, ids); break
        if not seen or seen[-1] != ids[0]: seen.append(ids[0])
        if ids[0] in multi and pg.evaluate("() => document.querySelectorAll('#wsShow .vflow section.task').length") == info[ids[0]]: multi.remove(ids[0]); chk(f'B2 Task {ids[0]} cắt trang được ghép đủ {info[ids[0]]} mảnh', True)
        st = pg.evaluate("() => document.querySelector('#wsShow .vstage').scrollTop"); c0 = cur(pg)
        key(pg, 'PageDown')
        if pg.evaluate("() => document.querySelector('#wsShow .vstage').scrollTop") > st: scrolled = True
        if cur(pg) == c0 and pg.evaluate("() => document.querySelector('#wsShow .vstage').scrollTop") == st: break
    chk('B2 PageDown đi qua đủ mọi Task theo thứ tự', seen == list(info.keys()), (seen, list(info.keys())))
    chk('B2 Task dài thì cuộn trước khi sang Task sau', scrolled)
    w, h = pg.evaluate("() => { const r = document.querySelector('#wsShow .vbox').getBoundingClientRect(); return [r.width, r.height]; }")
    sc = w / (198 * 96 / 25.4)
    chk('B2 Task: vừa cả Task trong màn hình, hoặc Task dài thì ≥ 1,5 lần cỡ thật và cuộn', (h <= 1080 and w <= 1920) or sc >= 1.49, (w, h, sc))
    pg.select_option('#wsShow .vsel', '1'); pg.wait_for_timeout(100)
    chk('B2 Đi tới Task 2', cur(pg).endswith(f'2/{nT}'), cur(pg))
    pg.screenshot(path=f'{SHOT}/b2_task2_1920.png')
    key(pg, 't'); chk('B2 về Cả trang đúng trang của Task', cur(pg).startswith('Trang '), cur(pg))

    # ---- B3 phóng
    key(pg, '+'); chk('B3 + phóng 125%', pg.inner_text('#showZoom') == '125%', pg.inner_text('#showZoom'))
    key(pg, '0'); chk('B3 0 về vừa', pg.inner_text('#showZoom') == 'Vừa')
    key(pg, 'z'); pg.mouse.move(800, 300); pg.mouse.down(); pg.mouse.move(1000, 400, steps=5); pg.mouse.up(); pg.wait_for_timeout(250)
    z = pg.inner_text('#showZoom'); chk('B3 phóng vùng', z.endswith('%') and int(z[:-1]) > 300, z)
    pg.screenshot(path=f'{SHOT}/b3_phongvung.png')
    key(pg, 'Escape'); chk('B3 Esc khi đang phóng về vừa', pg.inner_text('#showZoom') == 'Vừa' and pg.query_selector('#wsShow') is not None)
    key(pg, 'Escape')
    # ảnh lớn: phiếu có ảnh thật
    has = pg.evaluate("() => !!document.querySelector('#stage .pic img[src]')")
    if has:
        pg.click('#showBtn'); pg.wait_for_selector('#wsShow')
        for _ in range(nP):
            el = pg.query_selector('#wsShow .vpage .pic img[src]')
            if el: break
            key(pg, 'PageDown')
        el.click(); pg.wait_for_timeout(100); chk('B3 bấm ảnh mở ảnh lớn', pg.query_selector('#wsShow .vpic img') is not None)
        key(pg, 'Escape'); chk('B3 Esc đóng ảnh lớn', pg.query_selector('#wsShow .vpic') is None)
        key(pg, 'Escape')
    else: print('SKIP B3 ảnh lớn (phiếu không có ảnh thật)')

    # màn máy chiếu nhỏ
    pg.set_viewport_size({'width': 1366, 'height': 768}); pg.click('#showBtn'); pg.wait_for_selector('#wsShow'); pg.wait_for_timeout(150)
    pg.screenshot(path=f'{SHOT}/b1_trang1_1366.png'); key(pg, 't'); pg.screenshot(path=f'{SHOT}/b2_task_1366.png'); key(pg, 'Escape')
    pg.set_viewport_size({'width': 1920, 'height': 1080})

    # ---- B4 đáp án (phiếu mẫu đủ dạng có đáp án)
    load(pg, 'tests/gd0/mau-du-dang.md')
    nP = pg.evaluate("() => document.querySelectorAll('#stage .page').length")
    sk = pg.evaluate("() => { const r = sheetSlots(ws); return { slots: r.slots, key: r.key }; }")
    keyed = [x for x in sk['slots'] if x['id'] in sk['key'] and any(sk['key'][x['id']].get(f) for f in ('correct', 'accept', 'sample'))]
    CHECK = """([slots, key]) => { const out = {};
      for (const s of slots) { const els = [...document.querySelectorAll(`#wsShow .vsurf [data-ans="${s.id}"]`)]; if (!els.length) continue;
        const k = key[s.id]; let ok;
        if (s.interaction === 'match') ok = !!els[0].closest('section').querySelector('svg.vline') || !!els[0].querySelector('.vans');
        else if (k.correct != null) { const want = [].concat(k.correct).length; ok = els.reduce((n, e) => n + (e.classList.contains('vok') ? 1 : 0) + e.querySelectorAll('.vok').length, 0) === want; }
        else { const v = els[0].querySelector('.vans'); ok = !!v && v.textContent === (k.accept ? k.accept[0] : k.sample); }
        out[s.id] = ok; }
      return out; }"""
    pg.click('#showBtn'); pg.wait_for_selector('#wsShow'); key(pg, 'a'); pg.wait_for_timeout(150)
    got = {}
    for i in range(nP):
        got.update(pg.evaluate(CHECK, [keyed, sk['key']])); pg.screenshot(path=f'{SHOT}/b4_dapan_trang{i+1}.png'); key(pg, 'PageDown')
    bad = [k for k, v in got.items() if not v]; miss = [x['id'] for x in keyed if x['id'] not in got]
    chk(f'B4 A: hiện đúng đáp án mọi chỗ có đáp án ({len(got)} chỗ)', not bad and not miss, (bad, miss))
    key(pg, 't')
    for i in range(30):
        pg.screenshot(path=f'{SHOT}/b4_task{i+1}.png'); c0 = cur(pg); key(pg, 'PageDown')
        if cur(pg) == c0 and i: 
            key(pg, 'PageDown')
            if cur(pg) == c0: break
    key(pg, 't'); key(pg, 'Home'); key(pg, 'a'); pg.wait_for_timeout(100)
    chk('B4 A lần nữa: ẩn hết', pg.evaluate("() => !document.querySelector('#wsShow .vans, #wsShow .vok, #wsShow svg.vline')"))
    first = pg.evaluate("() => document.querySelector('#wsShow .vsurf [data-ans]').dataset.ans")
    key(pg, ' '); chk('B4 Space hiện chỗ đầu tiên', pg.evaluate("id => !!document.querySelector(`#wsShow [data-ans='${id}'] .vans, #wsShow [data-ans='${id}'].vok, #wsShow [data-ans='${id}'] .vok`)", first), first)
    key(pg, ' '); n2 = pg.evaluate("() => document.querySelectorAll('#wsShow .vans, #wsShow .vok').length")
    key(pg, 'Shift+ ' if False else 'Shift+Space'); n1 = pg.evaluate("() => document.querySelectorAll('#wsShow .vans, #wsShow .vok').length")
    chk('B4 Shift+Space ẩn chỗ vừa hiện', n2 > n1 >= 1, (n2, n1))
    key(pg, 'a'); key(pg, 'a')
    pg.click("#wsShow .vsurf [data-ans='t1.q2']"); pg.wait_for_timeout(80)   # 1b: bấm chỗ trả lời là làm bài, không hiện đáp án
    chk('B4 (1b) bấm một chỗ: vào ô gõ, không hiện đáp án', pg.evaluate("() => document.activeElement && document.activeElement.dataset.for") == 't1.q2' and not pg.query_selector('#wsShow .vans, #wsShow .vok'))
    pg.keyboard.press('Escape')
    pg.click("#wsShow .vsurf section[data-task='t4'] .vtk"); pg.wait_for_timeout(80)
    chk('B4 nút ✓ đầu Task hiện cả Task', pg.evaluate("() => document.querySelectorAll(\"#wsShow section[data-task='t4'] .vok\").length") == 3)
    pg.click("#wsShow .vsurf section[data-task='t4'] .vtk"); pg.wait_for_timeout(80)
    chk('B4 bấm lại thì ẩn Task', pg.evaluate("() => document.querySelectorAll(\"#wsShow section[data-task='t4'] .vok\").length") == 0)
    key(pg, 'a'); key(pg, 'a')
    pg.click('#showClick'); c0 = cur(pg); n = 0
    for _ in range(60):
        key(pg, 'PageDown'); n += 1
        if cur(pg) != c0: break
    shownP1 = len(set(pg.evaluate("() => 1") for _ in [0]))
    chk('B4 Clicker: hiện hết đáp án trang rồi mới lật', cur(pg) != c0 and n > 3, (n, cur(pg)))
    key(pg, 'Escape'); key(pg, 'Escape')
    chk('B4 phiếu soạn không bị thêm đáp án', pg.evaluate("() => !document.querySelector('#stage .vans, #stage .vok, #stage .vtk')"))

    # ---- B5 bút
    pg.evaluate("() => { for (const k of Object.keys(localStorage)) if (k.startsWith('wsShow.ink:')) localStorage.removeItem(k); }")
    pg.click('#showBtn'); pg.wait_for_selector('#wsShow'); key(pg, 'Home'); pg.wait_for_timeout(100)
    NP = "() => document.querySelectorAll('#wsShow .vink path').length"
    def drag(x0, y0, x1, y1, mods=None):
        if mods: pg.keyboard.down(mods)
        pg.mouse.move(x0, y0); pg.mouse.down(); pg.mouse.move((x0 + x1) / 2, (y0 + y1) / 2, steps=4); pg.mouse.move(x1, y1, steps=4); pg.mouse.up()
        if mods: pg.keyboard.up(mods)
        pg.wait_for_timeout(80)
    q = pg.evaluate("() => { const r = document.querySelector('#wsShow section[data-task=t1] .qt').getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; }")
    key(pg, 'p'); drag(q[0] + 10, q[1] + q[3] + 4, q[0] + 300, q[1] + q[3] + 4)
    chk('B5 bút: vẽ được một nét', pg.evaluate(NP) == 1, pg.evaluate(NP))
    chk('B5 nét gắn vào Task 1', pg.evaluate("() => !!document.querySelector('#wsShow .vink svg path') && document.querySelectorAll('#wsShow .vink svg').length == 1"))
    def pathbox(): return pg.evaluate("() => { const r = document.querySelector('#wsShow .vink path').getBoundingClientRect(); return [r.left, r.top, r.width]; }")
    def qtbox(): return pg.evaluate("() => { const r = document.querySelector('#wsShow section[data-task=t1] .qt').getBoundingClientRect(); return [r.left, r.top, r.width]; }")
    def rel():
        pb, qb = pathbox(), qtbox(); return [(pb[0] - qb[0]) / qb[2], (pb[1] - qb[1]) / qb[2], pb[2] / qb[2]]
    r0 = rel(); key(pg, 'Escape'); key(pg, 't'); pg.wait_for_timeout(150); r1 = rel()
    chk('B5 sang Từng Task nét vẫn đúng chỗ', all(abs(a - b) < .01 for a, b in zip(r0, r1)), (r0, r1))
    key(pg, '+'); key(pg, '+'); pg.wait_for_timeout(100); r2 = rel()
    chk('B5 phóng to nét vẫn đúng chỗ', all(abs(a - b) < .01 for a, b in zip(r0, r2)), (r0, r2))
    key(pg, '0'); key(pg, 't'); pg.wait_for_timeout(100)
    pg.screenshot(path=f'{SHOT}/b5_but.png')
    drag(q[0] + 10, q[1] + 40, q[0] + 200, q[1] + 40, 'Control')
    chk('B5 giữ Ctrl kéo = bút tô vàng', pg.evaluate("() => [...document.querySelectorAll('#wsShow .vink path')].some(p => p.getAttribute('stroke').startsWith('rgba(255,213'))"))
    drag(q[0] + 10, q[1] + 70, q[0] + 200, q[1] + 90, 'Shift')
    chk('B5 giữ Shift kéo = đường thẳng ngang', pg.evaluate("() => { const ps = [...document.querySelectorAll('#wsShow .vink path')]; const d = ps[ps.length - 1].getAttribute('d'); const m = d.match(/[-\\d.]+/g).map(Number); return m.length == 4 && m[1] == m[3]; }"))
    chk('B5 vẽ bằng Ctrl/Shift không bấm nhầm đáp án', pg.evaluate("() => !document.querySelector('#wsShow .vans, #wsShow .vok')"))
    n = pg.evaluate(NP); key(pg, 'e'); drag(q[0] + 260, q[1] + q[3] - 10, q[0] + 260, q[1] + q[3] + 20)
    chk('B5 tẩy xóa nét bị kéo qua', pg.evaluate(NP) == n - 1, (n, pg.evaluate(NP)))
    pg.keyboard.press('Control+z'); pg.wait_for_timeout(80); chk('B5 Ctrl+Z hoàn tác tẩy', pg.evaluate(NP) == n)
    key(pg, 'Escape'); pg.click('#inkClear'); pg.wait_for_timeout(80); chk('B5 Xóa hết', pg.evaluate(NP) == 0)
    pg.click('#inkUndo'); pg.wait_for_timeout(80); chk('B5 hoàn tác Xóa hết', pg.evaluate(NP) == n)
    key(pg, 'Escape'); key(pg, 'Escape'); pg.wait_for_timeout(100)
    pg.click('#showBtn'); pg.wait_for_selector('#wsShow'); key(pg, 'Home'); pg.wait_for_timeout(150)
    chk('B5 mở lại trình chiếu nét vẫn còn', pg.evaluate(NP) == n, pg.evaluate(NP))
    chk('B5 phiếu soạn không có nét vẽ', pg.evaluate("() => !document.querySelector('#stage .vink')"))
    key(pg, 'Escape')
    pg.evaluate("() => { const t = ws.tasks[0]; t.title = 'Complete the sentences!'; render(); }"); pg.wait_for_timeout(300)
    pg.click('#showBtn'); pg.wait_for_selector('#wsShow'); pg.wait_for_timeout(150)
    chk('B5 phiếu đã sửa: bỏ nét cũ và báo', pg.evaluate(NP) == 0 and 'bỏ nét vẽ cũ' in (pg.evaluate("() => document.querySelector('#wsShow .vmsg')?.textContent") or ''))
    key(pg, 'Escape')

    # ---- B6 che / hé
    pg.click('#showBtn'); pg.wait_for_selector('#wsShow'); key(pg, 'Home'); key(pg, 'h'); pg.wait_for_timeout(100)
    NC = "() => document.querySelectorAll('#wsShow .vcv').length"
    secs = pg.evaluate("() => [...document.querySelectorAll('#wsShow section.task')].map(s => s.querySelectorAll('.vcv').length)")
    chk('B6 H: Task nào cũng có tấm che', all(n > 0 for n in secs), secs)
    chk('B6 Task 1 che từng câu (3 câu, chừa số câu)', pg.evaluate("() => document.querySelectorAll('#wsShow section[data-task=t1] .vcv').length") == 3)
    pg.screenshot(path=f'{SHOT}/b6_che.png')
    n0 = pg.evaluate(NC); pg.click('#wsShow section[data-task=t1] .vcv >> nth=0'); pg.wait_for_timeout(80)
    chk('B6 bấm tấm che: hé câu đó', pg.evaluate(NC) == n0 - 1)
    pg.click('#wsShow section[data-task=t1] .q >> nth=0 >> .qt', position={'x': 3, 'y': 6}); pg.wait_for_timeout(80)
    chk('B6 bấm câu đã hé: che lại', pg.evaluate(NC) == n0)
    pg.click('#wsShow section[data-task=t1] .vcv >> nth=1'); key(pg, 't'); pg.wait_for_timeout(120)
    chk('B6 đổi Từng Task vẫn giữ câu đã hé', pg.evaluate("() => document.querySelectorAll('#wsShow section[data-task=t1] .vcv').length") == 2)
    key(pg, 't'); pg.click('#showOpenAll'); pg.wait_for_timeout(80); chk('B6 Hé hết', pg.evaluate(NC) == 0)
    key(pg, 'h'); key(pg, 'h'); chk('B6 tắt rồi bật lại: che lại từ đầu', pg.evaluate(NC) == n0)
    key(pg, 'h'); chk('B6 tắt che: không còn tấm nào', pg.evaluate(NC) == 0 and not pg.evaluate("() => !!document.querySelector('#wsShow .vcov')"))
    key(pg, 'Escape')

    # ---- B7 đồng hồ, bảng trắng
    pg.click('#showBtn'); pg.wait_for_selector('#wsShow'); key(pg, 'Home')
    key(pg, 'g'); chk('B7 G mở đồng hồ 3:00', pg.inner_text('#timerNum') == '3:00')
    pg.screenshot(path=f'{SHOT}/b7_dongho.png')
    pg.click(".vtimer button:has-text(\"1′\") >> nth=0"); chk('B7 chọn 1 phút', pg.inner_text('#timerNum') == '1:00', pg.inner_text('#timerNum'))
    pg.click(".vtimer button[aria-label='Bớt 1 phút']"); chk('B7 −1′ không xuống dưới 0:10', pg.inner_text('#timerNum') == '0:10', pg.inner_text('#timerNum'))
    pg.click('#timerGo'); pg.wait_for_timeout(1600); t = pg.inner_text('#timerNum')
    chk('B7 Bắt đầu: đếm ngược', t in ('0:08', '0:09'), t)
    pg.wait_for_timeout(9500)
    chk('B7 hết giờ: 0:00 và nhấp nháy', pg.inner_text('#timerNum') == '0:00' and pg.evaluate("() => document.querySelector('.vtimer').classList.contains('done')"))
    key(pg, 'g'); chk('B7 G đóng đồng hồ', pg.query_selector('.vtimer') is None)
    c0 = cur(pg); key(pg, 'b'); chk('B7 B mở bảng trắng', pg.query_selector('.vboard') is not None)
    bx = pg.evaluate("() => { const r = document.getElementById('boardSurf').getBoundingClientRect(); return [r.left, r.top]; }")
    pg.mouse.move(bx[0] + 100, bx[1] + 100); pg.mouse.down(); pg.mouse.move(bx[0] + 300, bx[1] + 160, steps=6); pg.mouse.up()
    NB = "() => document.querySelectorAll('#boardSurf path').length"
    chk('B7 vẽ trên bảng', pg.evaluate(NB) == 1)
    pg.keyboard.press('Control+z'); pg.wait_for_timeout(60); chk('B7 Ctrl+Z trên bảng', pg.evaluate(NB) == 0)
    pg.mouse.move(bx[0] + 100, bx[1] + 200); pg.mouse.down(); pg.mouse.move(bx[0] + 400, bx[1] + 260, steps=6); pg.mouse.up()
    key(pg, 'PageDown'); chk('B7 đang ở bảng: phím lật trang không lật', cur(pg) == c0)
    pg.select_option('.vboard .vsel', 'grid'); pg.screenshot(path=f'{SHOT}/b7_bang.png')
    key(pg, 'Escape'); chk('B7 Esc về phiếu', pg.query_selector('.vboard') is None and pg.query_selector('#wsShow') is not None)
    key(pg, 'b'); chk('B7 mở lại bảng: nội dung còn', pg.evaluate(NB) == 1); key(pg, 'b')
    key(pg, 'Escape')
    pg.set_viewport_size({'width': 1366, 'height': 768}); pg.click('#showBtn'); pg.wait_for_selector('#wsShow'); pg.wait_for_timeout(150)
    bw = pg.evaluate("() => document.querySelector('#wsShow .vbar').getBoundingClientRect().width")
    chk('B7 màn 1366: thanh công cụ vừa một hàng trong màn hình', bw <= 1366 - 20 and pg.evaluate("() => document.querySelector('#wsShow .vbar').getBoundingClientRect().height") < 60, bw)
    pg.screenshot(path=f'{SHOT}/b7_1366.png'); key(pg, 'Escape'); pg.set_viewport_size({'width': 1920, 'height': 1080})

    STEP = os.environ.get('STEP', 'B7')
    b.close()

chk('0 lỗi console', not errs, errs)
print('ALL OK' if all(res) else 'FAILED', f'{sum(res)}/{len(res)}')
