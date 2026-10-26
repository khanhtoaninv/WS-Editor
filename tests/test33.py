# v84: ảnh chung ở mọi dạng, chọn đúng khối, căn lề Task kéo theo khung ảnh, cỡ chữ mặc định Vừa, hàng bảng 12 mm,
# nhãn a b c chữ thường, khối tự do (+ Thêm, nhiều ảnh, chọn từ cột trái), độ rộng ảnh %, hội thoại cắt trang khi quá một trang
import sys
from playwright.sync_api import sync_playwright
F = 'file://' + sys.argv[1]; ok = True
def chk(n, c, x=''):
    global ok; print(('PASS ' if c else 'FAIL '), n, x if not c else ''); ok &= bool(c)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 1000}); errs = []
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_' not in m.text and 'font' not in m.text.lower() else None)
    pg.goto(F); pg.wait_for_timeout(1200); E = pg.evaluate
    OPEN = "[...document.querySelectorAll('#tree .ed .sec.open')].map(s=>s.dataset.sec).join()"
    def opn(tid): pg.click(f'#tree .tnode[data-sel=task][data-id={tid}]'); pg.wait_for_timeout(150)
    # cỡ chữ, hàng bảng, nhãn
    chk('cỡ chữ mặc định Vừa', E("sizeKey()") == 'm' and E("fontPt()") == E("FSZ[ws.age].m"))
    chk('hàng bảng mặc định 12 mm', E("TBL_ROW_MM") == 12)
    chk('nhãn lựa chọn chữ thường (Task 4)', E("[...document.querySelectorAll('.task[data-task=t4] .opt i, .task[data-task=t4] .opt b')].slice(0,3).map(e=>e.textContent).join('')").startswith('a'))
    md = E("(()=>{const r=readMd('# Phiếu\\n## Task\\nTiêu đề: Choose.\\nDạng: chọn A/B/C\\n1. I ___ a cat. A. have B. has C. having\\n');const t0=r.tasks[0]; const t=t0.answer?t0:(t0.t||t0.task||t0.data); return JSON.stringify([Object.keys(t0), t && t.answer && t.answer.params])})()")
    chk('nhập MD viết A. B. C. vẫn để chữ thường', '"upper":true' not in md and '"dir"' in md, md)
    # G1 ở dạng lưới ảnh (Task 1) và hội thoại (Task 6)
    opn('t1'); pg.click('#tree .ed .sec[data-sec=g1] [data-eact=blkaddb]'); pg.wait_for_timeout(400)
    chk('G1 thêm ở Q6: có ô up ảnh lớn + hiện trên trang', E("document.querySelectorAll('#tree .ed .sec[data-sec=g1] .ithumb.big').length") == 1 and E("document.querySelectorAll('[data-node=\"t1:G1\"]').length") == 1)
    pg.click('[data-node="t1:G1:i2"]'); pg.wait_for_timeout(250); chk('bấm ảnh của câu → mở G3', E(OPEN) == 'g3', E(OPEN))
    pg.click('[data-node="t1:G1"]'); pg.wait_for_timeout(250); chk('bấm ảnh chung → mở G1', E(OPEN) == 'g1', E(OPEN))
    pg.click('[data-node="t1:G2"]', position={'x': 5, 'y': 5}); pg.wait_for_timeout(250); chk('bấm khung lưới → mở G3', E(OPEN) == 'g3', E(OPEN))
    pg.click('#tree .ed .sec[data-sec=g0] .sech'); pg.wait_for_timeout(150); pg.click('#tree .ed .sec[data-sec=g3] .sech'); pg.wait_for_timeout(250)
    chk('bấm mục G3 → câu hỏi + chỗ trả lời có viền chọn', E("sel.g") == 'G2' and E("multi.map(x=>x.g).join()") == 'G3' and E("document.querySelectorAll('#stage .sel').length") > 3)
    # căn lề Task kéo theo khung ảnh
    E("(()=>{commit(w=>{const t=w.tasks.find(x=>x.id==='t1');t.layout.cells={i1:{frame:{align:'left'}}};});})()"); pg.wait_for_timeout(300)
    opn('t1'); pg.click('#tree .tnode[data-sel=task][data-id=t1]'); pg.wait_for_timeout(200)
    E("(()=>{sel={type:'task',id:'t1'};multi=[];commitSet('align','center');})()"); pg.wait_for_timeout(400)
    r = E("(()=>{const c=document.querySelector('.task[data-task=t1] [data-node=\"t1:G1:i1\"]'),p=c.parentElement.getBoundingClientRect(),q=c.getBoundingClientRect();return [Math.abs((q.left+q.right)/2-(p.left+p.right)/2), JSON.stringify(ws.tasks[0].layout.cells)]})()")
    chk('căn giữa cả Task: khung ảnh ô 1 cũng vào giữa (bỏ căn riêng)', r[0] < 2, r)
    # độ rộng ảnh %
    pg.click('[data-node="t1:G1:i1"]'); pg.wait_for_timeout(250)
    w0 = E("document.querySelector('[data-node=\"t1:G1:i1\"]').parentElement.getBoundingClientRect().width")
    pg.fill('#insp input[data-pv="frame.w"]', '50'); pg.keyboard.press('Enter'); pg.wait_for_timeout(400)
    w1 = E("document.querySelector('[data-node=\"t1:G1:i1\"]').getBoundingClientRect().width")
    chk('độ rộng ảnh 50% ô', abs(w1 - w0 * .5) < 3, (w0, w1))
    # khối tự do
    opn('t5')
    chk('GT chưa có: mục mờ có + Chữ / + Ảnh', E("[...document.querySelectorAll('#tree .ed .sec[data-sec=gt].off [data-eact=blkaddb]')].map(b=>b.textContent).join()") == '+ Chữ,+ Ảnh')
    pg.click('#tree .ed .sec[data-sec=gt] [data-v=GTi]'); pg.wait_for_timeout(400)
    chk('thêm khối ảnh → chọn khối đó trên trang', E("sel.g") == 'GT' and E("document.querySelectorAll('#stage [data-node^=\"t5:GT:\"].sel').length") == 1)
    pg.click('#insp button[data-p=n][data-v="3"]'); pg.wait_for_timeout(400)
    chk('khối ảnh 3 ảnh một hàng: 3 ô ở cột trái, 3 ảnh cạnh nhau trên trang', E("document.querySelectorAll('#tree .ed .sec[data-sec=gt] .ithumb').length") == 3 and E("(()=>{const p=[...document.querySelectorAll('[data-node^=\"t5:GT:\"] .pic')];return p.length===3&&Math.abs(p[0].getBoundingClientRect().top-p[2].getBoundingClientRect().top)<1})()"))
    E("(()=>{sel={type:'task',id:'t5'};multi=[];refreshSel();})()"); pg.wait_for_timeout(200)
    pg.click('#tree .ed .sec[data-sec=gt] .gtcard input'); pg.wait_for_timeout(300)
    chk('gõ trong thẻ khối tự do → chọn khối đó', E("sel.g") == 'GT')
    pg.click('#tree .ed .sec[data-sec=g3] .sech'); pg.wait_for_timeout(150); pg.click('#tree .ed .sec[data-sec=gt] .sech'); pg.wait_for_timeout(250)
    chk('bấm mục GT → chọn khối tự do đầu', E("sel.g") == 'GT' and E("document.querySelectorAll('#stage .sel').length") >= 1)

    # hội thoại: ảnh chung + cao hơn một trang thì cắt, vừa một trang thì chuyển nguyên
    opn('t12'); pg.click('#tree .ed .sec[data-sec=g1] [data-eact=blkaddb]'); pg.wait_for_timeout(400)
    chk('G1 ở hội thoại hiện trên trang', E("document.querySelectorAll('[data-node=\"t12:G1\"]').length") == 1)
    chk('hội thoại vừa một trang: không cắt', E("document.querySelectorAll('.task[data-task=t12]').length") == 1)
    pg.click('[data-node="t12:G1"]'); pg.wait_for_timeout(200)
    pg.fill('#insp input[data-pv="frame.h"]', '140'); pg.keyboard.press('Enter'); pg.wait_for_timeout(600)
    n12 = E("document.querySelectorAll('.task[data-task=t12]').length"); dg = E("JSON.stringify(window.__ws.res.diags)")
    chk('hội thoại quá một trang: cắt sang trang sau, không báo tràn', n12 == 2 and 't12' not in dg, (n12, dg[:200]))
    chk('số chỗ trống đếm tiếp ở trang sau', E("(()=>{const f=[...document.querySelectorAll('.task[data-task=t12] .dialogue')];const tx=f.map(x=>x.textContent).join(' ');return [1,2,3,4,5].every(i=>tx.includes('('+i+')'))&&!tx.includes('(6)')})()"))
    chk('0 lỗi console', not errs, errs)
    b.close()
print('ALL OK' if ok else 'SOME FAIL')
