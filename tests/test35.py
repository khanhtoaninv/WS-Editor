# v86: cột trái 420 px; chữ câu hỏi Đậm; thanh B I U dính (G2, G3); đáp án màu #0a6b75 + ô tích nhiều đáp án;
# ảnh chung ở lưới ảnh có panel riêng + Fit đúng; câu hỏi có ảnh chung cắt được trang
import sys, os
from playwright.sync_api import sync_playwright
F = 'file://' + sys.argv[1]; ok = True; HERE = os.path.dirname(os.path.abspath(__file__))
def chk(n, c, x=''):
    global ok; print(('PASS ' if c else 'FAIL '), n, x if not c else ''); ok &= bool(c)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 900}); errs = []
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_' not in m.text and 'font' not in m.text.lower() else None)
    pg.goto(F); pg.wait_for_timeout(1200); E = pg.evaluate
    def opn(tid): pg.click(f'#tree .tnode[data-sel=task][data-id={tid}]'); pg.wait_for_timeout(250)
    # C3
    chk('cột trái mặc định 420 px', abs(E("document.querySelector('.app').firstElementChild.getBoundingClientRect().width") - 420) < 2 or E("LW_DEF") == 420, E("LW_DEF"))
    # D2
    opn('t4'); pg.locator('#tree .ed [data-eact=qbold][data-v="1"]').click(); pg.wait_for_timeout(300)
    fw = E("[getComputedStyle(document.querySelector('.task[data-task=t4] .qt')).fontWeight, getComputedStyle(document.querySelector('.task[data-task=t4] .opt')).fontWeight]")
    chk('Đậm: chữ câu hỏi đậm, lựa chọn không đậm', fw == ['700', '400'], fw)
    pg.locator('#tree .ed [data-eact=qbold][data-v=""]').click(); pg.wait_for_timeout(300)
    chk('Bình thường: về như cũ', E("getComputedStyle(document.querySelector('.task[data-task=t4] .qt')).fontWeight") == '400' and not E("ws.tasks.find(t=>t.id==='t4').layout.qbold"))
    # F2 + F1
    tk = lambda i, j: pg.locator(f'#tree .ed :is(.ktk,.eo) [data-eact=tickopt][data-i="{i}"][data-j="{j}"]').click() or pg.wait_for_timeout(250)
    tk(0, 1); tk(0, 2)
    chk('ô tích: chọn nhiều đáp án → "b, c"', E("ws.tasks.find(t=>t.id==='t4').content.items[0].key") == 'b, c')
    pg.locator('#tree .ed [data-eact=iexi][data-i="0"]').click(); pg.wait_for_timeout(300)
    chk('câu ví dụ: khoanh cả 2 đáp án, màu #0a6b75', E("document.querySelectorAll('.task[data-task=t4] .opt.pk').length") == 2 and E("getComputedStyle(document.querySelector('.task[data-task=t4] .opt.pk>b, .task[data-task=t4] .opt.pk>i')).outlineColor") == 'rgb(10, 107, 117)')
    tk(0, 1); chk('bỏ tích b → "c"', E("ws.tasks.find(t=>t.id==='t4').content.items[0].key") == 'c')
    opn('t6'); tk(0, 1); chk('Đúng / Sai: tích F → key F', E("ws.tasks.find(t=>t.id==='t6').content.items[0].key") == 'F')
    opn('t3'); pg.locator('#tree .ed [data-eact=tickopt][data-i="1"][data-j="0"]').click(); pg.wait_for_timeout(250); pg.locator('#tree .ed [data-eact=tickopt][data-i="1"][data-j="2"]').click(); pg.wait_for_timeout(250)
    chk('Q7 ảnh: tích nhiều ảnh', E("ws.tasks.find(t=>t.id==='t3').content.items[1].key") == 'a, c' and E("getComputedStyle(document.querySelector('#tree .ed .tkq.on')).backgroundColor") == 'rgb(10, 107, 117)')
    # H1 thanh dính
    opn('t11'); E("document.getElementById('tree').scrollTop=900"); pg.wait_for_timeout(250)
    r = E("(()=>{const h=document.querySelector('#tree .tk.open>.tkh').getBoundingClientRect(),b=document.querySelector('#tree .ed .sec[data-sec=g3] .subh').getBoundingClientRect();return [h.bottom,b.top]})()")
    chk('G3: thanh B I U dính ngay dưới tiêu đề Task khi cuộn', abs(r[0] - r[1]) < 3, r)
    opn('t7'); pg.click('#tree .ed .sec[data-sec=g2] .sech'); pg.wait_for_timeout(250)
    chk('G2: có thanh B I U ___ {a|b} ¶', pg.locator('#tree .ed .sec[data-sec=g2] .g3tb [data-tx]').count() == 6)
    # A2 ảnh chung ở lưới ảnh
    opn('t3'); pg.click('#tree .ed .sec[data-sec=g1] [data-eact=blkaddb]'); pg.wait_for_timeout(400)
    E("openGen('t3','G1')"); E("document.getElementById('genUp').value=''"); pg.set_input_files('#genUp', os.path.join(HERE, 'ph_wide.jpg'))
    pg.wait_for_function("!document.getElementById('genUse').disabled"); pg.click('#genUse'); pg.wait_for_timeout(700)
    m = lambda: E("(()=>{const g=document.querySelector('.task[data-task=t3] .g1'),p=g.querySelector('.pic'),i=p.querySelector('img');return [g.getBoundingClientRect().width,p.getBoundingClientRect().width,i.getBoundingClientRect().width]})()")
    r = m(); chk('lưới ảnh + ảnh chung: Fit ngang trong hộp Tạo ảnh có tác dụng (ảnh rộng hết khung)', E("ws.tasks.find(t=>t.id==='t3').layout.frame.fit") == 'width' and abs(r[1] - r[0]) < 3 and abs(r[2] - r[1]) < 4, r)
    pg.locator('.task[data-task=t3] .g1 .pic').click(force=True); pg.wait_for_timeout(250)
    chk('bấm ảnh chung → panel Ảnh chung (có Fit)', E("kindOf(curT(ws),sel)") == 'frame' and pg.locator('#insp button[data-p="frame.fit"]').count() >= 3)
    pg.locator('.task[data-task=t3] .ci').first.click(force=True); pg.wait_for_timeout(250)
    chk('bấm ô ảnh câu → panel ô ảnh', E("kindOf(curT(ws),sel)") == 'cimg')
    # A3 cắt trang
    E("commit(w=>{const t=w.tasks.find(x=>x.id==='t11');t.image={label:'school',size:'large'};t.layout.task='T1';const a=clone(t.content.items);a.forEach(x=>delete x.id);t.content.items=t.content.items.concat(a);ensureIds(t);})"); pg.wait_for_timeout(600)
    for T in ['T1', 'T2', 'T3']:
        E(f"commit(w=>{{w.tasks.find(x=>x.id==='t11').layout.task='{T}';}})"); pg.wait_for_timeout(500)
        fr = E("lastRes.pages.flatMap(p=>p.items).filter(x=>x.t.id==='t11').length"); dg = E("lastRes.diags.length")
        chk(f'câu hỏi + ảnh chung ({T}) dài hơn một trang: cắt sang trang sau, không tràn, ảnh + tiêu đề chỉ ở phần đầu', fr >= 2 and dg == 0 and E("document.querySelectorAll('.task[data-task=t11] .g1').length") == 1 and E("document.querySelectorAll('.task[data-task=t11] .g0').length") == 1, (fr, dg))
    # thanh dính không được làm cột trái phình ngang (overflow:clip cần min-width:0)
    wide = []
    for tid in E("ws.tasks.map(t=>t.id)"):
        opn(tid)
        if E("document.querySelector('#tree').scrollWidth > document.querySelector('#tree').clientWidth + 1"): wide.append(tid)
    chk('mọi Task: cột trái không bị đẩy rộng ra (không cuộn ngang)', not wide, wide)
    print('ERRS', errs); ok &= not errs
    print('ALL OK' if ok else 'SOME FAIL'); b.close()
