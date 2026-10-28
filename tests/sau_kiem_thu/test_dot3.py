# Đợt 3 sau kiểm thử (v115): chỉnh giao diện nhỏ 3.1–3.10 (trình chiếu + trang soạn).
# Cách dùng: python3 tests/sau_kiem_thu/test_dot3.py <app.html> [thư mục ảnh]
import sys, os
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from chung import *
MM = 96 / 25.4

def tid(pg, n): return pg.evaluate(f"() => ws.tasks[{n - 1}].id")
with sync_playwright() as p:
    pg, b = mo(p, sys.argv[1])
    # ---- trình chiếu
    key(pg, 't')
    task(pg, 3); pg.click(S('t3.lead.1')); pg.wait_for_timeout(50)
    chk('3.1 đang gõ chỗ trống bài đọc: nhãn (1) ẩn', pg.evaluate("() => getComputedStyle(document.querySelector(\"#wsShow [data-ans='t3.lead.1']\")).color") == 'rgba(0, 0, 0, 0)')
    pg.keyboard.press('ArrowDown'); pg.wait_for_timeout(50)
    chk('3.9 ↓ sang ô kế', pg.evaluate("() => document.activeElement && document.activeElement.dataset.for") == 't3.lead.2')
    pg.keyboard.press('ArrowUp'); pg.wait_for_timeout(50)
    chk('3.9 ↑ về ô trước', pg.evaluate("() => document.activeElement && document.activeElement.dataset.for") == 't3.lead.1')
    pg.evaluate("() => document.activeElement.blur()")
    task(pg, 10); opt(pg, 't10.q1', 2)
    r = pg.evaluate("""() => { const o = document.querySelector("#wsShow [data-ans='t10.q1'] .opt.vw-sel"), b = o.querySelector('b.bx');
      return [getComputedStyle(o).boxShadow, getComputedStyle(b, '::after').content, getComputedStyle(b, '::after').color, getComputedStyle(o.querySelector(':scope > span')).color]; }""")
    chk('3.2 ô tick đúng: không khung, dấu ✓ và chữ màu xanh lá', r[0] == 'none' and '✓' in r[1] and r[2] == 'rgb(46, 125, 50)' and r[3] == 'rgb(46, 125, 50)', r)
    pg.screenshot(path=f'{SHOT}/d3_o_tick.png'); reset_all(pg)
    task(pg, 18)
    gap = pg.evaluate("""() => { const sec = document.querySelector('#wsShow section[data-task=t18]'), ml = sec.querySelector('.mrows > .ml:not(.mh)'), md = ml.nextElementSibling;
      return [parseFloat(getComputedStyle(ml).paddingRight), parseFloat(getComputedStyle(md.nextElementSibling).paddingLeft)]; }""")
    chk('3.3 bài nối: chừa ≥ 2 mm hai bên chấm nối', gap[0] >= 2 * MM - .5 and gap[1] >= 2 * MM - .5, gap)
    task(pg, 14)
    rt = pg.evaluate("""() => { const qb = document.querySelector('#wsShow section[data-task=t14] .qb'), qt = qb.querySelector('.qt'); return qt.offsetWidth / (qb.clientWidth - 4 * 96 / 25.4); }""")
    chk('3.4 T/F cùng hàng: cột câu = 80% (theo tỉ lệ)', abs(rt - .8) < .02, rt)
    # 3.8 Từng Task: Mặc định 80% ↔ Vừa
    task(pg, 8)
    w = pg.evaluate("() => [document.querySelector('#wsShow .vbox').getBoundingClientRect().width, document.querySelector('#wsShow .vstage').clientWidth]")
    chk('3.8 Từng Task mặc định: Task rộng 80% màn hình, nút ghi "Mặc định"', abs(w[0] / (w[1] - 24) - .8) < .02 and pg.inner_text('#showZoom') == 'Mặc định', (w, pg.inner_text('#showZoom')))
    tb(pg, '#showZoom')
    h = pg.evaluate("() => [document.querySelector('#wsShow .vbox').getBoundingClientRect().height, document.querySelector('#wsShow .vstage').clientHeight]")
    chk('3.8 bấm → Vừa: thấy trọn Task', pg.inner_text('#showZoom') == 'Vừa' and h[0] <= h[1], (h, pg.inner_text('#showZoom')))
    tb(pg, '#showZoom'); chk('3.8 bấm nữa → Mặc định', pg.inner_text('#showZoom') == 'Mặc định')
    # 3.6 Ctrl + lăn theo đầu chuột
    task(pg, 32); key(pg, 't')   # Cả trang
    def under(x, y): return pg.evaluate(f"() => {{ const s = document.querySelector('#wsShow .vsurf'), r = s.getBoundingClientRect(), k = r.width / s.offsetWidth; return [({x} - r.left) / k, ({y} - r.top) / k]; }}")
    key(pg, '+', 5); pg.wait_for_timeout(100)   # phóng trước cho trang rộng hơn màn hình (hẹp hơn thì trang luôn nằm giữa, chiều ngang không giữ được)
    u0 = under(1200, 300); pg.mouse.move(1200, 300); pg.keyboard.down('Control')
    for _ in range(4): pg.mouse.wheel(0, -100); pg.wait_for_timeout(80)
    pg.keyboard.up('Control'); u1 = under(1200, 300)
    chk('3.6 Ctrl + lăn: phóng giữ nguyên điểm dưới đầu chuột', pg.inner_text('#showZoom').endswith('%') and abs(u0[0] - u1[0]) < 4 and abs(u0[1] - u1[1]) < 4, (u0, u1, pg.inner_text('#showZoom')))
    tb(pg, '#showZoom'); chk('3.6 nút về 100% (Vừa)', pg.inner_text('#showZoom') == 'Vừa')
    # 3.7 Shift + kéo: đường thẳng đỏ, nét vừa, vẫn ở con trỏ
    pg.keyboard.down('Shift'); pg.mouse.move(700, 500); pg.mouse.down(); pg.mouse.move(900, 520, steps=5); pg.mouse.up(); pg.keyboard.up('Shift'); pg.wait_for_timeout(80)
    st_ = pg.evaluate("() => { const ps = [...document.querySelectorAll('#wsShow .vink path')], p = ps[ps.length - 1], s = document.querySelector('#wsShow .vsurf'), k = s.getBoundingClientRect().width / s.offsetWidth; return p ? [p.getAttribute('stroke'), +p.getAttribute('stroke-width') * k] : null; }")
    chk('3.7 Shift + kéo: đường đỏ, nét vừa (4,5 px trên màn)', st_ and st_[0] == '#e53935' and abs(st_[1] - 4.5) < .3, st_)
    chk('3.7 vẫn ở con trỏ', pg.evaluate("() => document.querySelector('#wsShow .vstage').dataset.tool") == 'pointer')
    # 3.5 Xóa nét trang này / Xóa hết
    key(pg, 'ArrowRight'); pg.keyboard.down('Shift'); pg.mouse.move(700, 600); pg.mouse.down(); pg.mouse.move(900, 600, steps=5); pg.mouse.up(); pg.keyboard.up('Shift'); pg.wait_for_timeout(80)
    np = lambda: pg.evaluate("() => document.querySelectorAll('#wsShow .vink path').length")
    chk('3.5 nút Xóa có chữ', 'Xóa' in pg.inner_text('#inkClear'))
    pg.mouse.move(30, 540); pg.click('#inkClear'); pg.wait_for_timeout(60)
    chk('3.5 bấm Xóa: hiện hai lựa chọn', pg.query_selector('#inkClearView') is not None and pg.query_selector('#inkClearAll') is not None)
    pg.click('#inkClearView'); pg.wait_for_timeout(80)
    chk('3.5 Xóa nét trang này: trang này hết nét', np() == 0)
    key(pg, 'ArrowLeft'); chk('3.5 trang trước vẫn còn nét', np() >= 1, np())
    pg.click('#inkClear'); pg.click('#inkClearAll'); pg.wait_for_timeout(80)
    chk('3.5 Xóa hết nét vẽ', np() == 0)
    pg.keyboard.press('Escape'); pg.wait_for_timeout(100)
    if pg.query_selector('#wsShow'): pg.click('#showClose'); pg.wait_for_timeout(150)
    # ---- trang soạn: 3.10 ảnh đồng đều
    t16, t17 = tid(pg, 16), tid(pg, 17)
    W = lambda t: pg.evaluate(f"() => [...document.querySelectorAll(\".task[data-task='{t}'] .ci\")].map(e => Math.round(e.getBoundingClientRect().width / (parseFloat(getComputedStyle(document.querySelector('#stage') || document.body).getPropertyValue('--s')) || 1) / {MM}))")
    sc = pg.evaluate("() => { const e = document.querySelector('.page'); return e.getBoundingClientRect().width / e.offsetWidth; }")
    Wm = lambda t: pg.evaluate(f"() => [...document.querySelectorAll(\".task[data-task='{t}'] .ci\")].map(e => +(e.getBoundingClientRect().width / {sc} / {MM}).toFixed(1))")
    a, c = Wm(t16), Wm(t17)
    chk('3.10 3 ảnh trên hàng: rộng 45 mm ở cả T16 (nhìn ảnh viết) và T17 (chọn ảnh)', a and c and all(abs(x - 45) < .6 for x in a + c), (a, c))
    pg.evaluate("t => { commit(w => { w.tasks.find(x => x.id === t).layout.imgPct = 80; }, 'x'); }", t16); pg.wait_for_timeout(300)
    chk('3.10 thanh kích thước 80%: 36 mm', all(abs(x - 36) < .6 for x in Wm(t16)), Wm(t16))
    pg.evaluate("t => { commit(w => { const l = w.tasks.find(x => x.id === t).layout; l.imgPct = null; l.imgFit = true; }, 'x'); }", t16); pg.wait_for_timeout(300)
    cw = pg.evaluate(f"() => [...document.querySelectorAll(\".task[data-task='{t16}'] .cell\")].map(e => +(e.querySelector('.ci').getBoundingClientRect().width / e.getBoundingClientRect().width).toFixed(2))")
    chk('3.10 Fit ô: ảnh khít bề ngang ô', all(x > .97 for x in cw), cw)
    md = pg.evaluate("() => sheetToMd(ws)")
    chk('3.10 xuất MD có "Ảnh vừa ô: có"', 'Ảnh vừa ô: có' in md)
    r = pg.evaluate("raw => { const w = impSheetObj(readMd(raw)); return [w.tasks[15].layout.imgFit, w.tasks[16].layout.imgPct]; }", md.replace('Hướng dẫn: Tick the picture.', 'Hướng dẫn: Tick the picture.\nKích thước ảnh: 120%'))
    chk('3.10 đọc MD: "Ảnh vừa ô: có", "Kích thước ảnh: 120%"', r == [True, 120], r)
    pg.screenshot(path=f'{SHOT}/d3_soan.png')
    xong(b)
