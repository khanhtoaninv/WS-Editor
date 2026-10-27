# v99: Ảnh trong ô bảng (thêm / gỡ từng ô ở cột trái, công tắc cả bảng)
import sys, json
from playwright.sync_api import sync_playwright
ok=True
def chk(n,c,i=''):
    global ok; print(('PASS ' if c else 'FAIL ')+n, i); ok = ok and bool(c)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'fonts' not in m.text else None); pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+sys.argv[1]); pg.wait_for_timeout(1300)
    tid = pg.evaluate("ws.tasks.find(t=>t.content.form==='table'&&t.content.rows.some(r=>r.cells.some(v=>typeof v==='string'&&v.trim()))&&!(t.layout.table||{}).cross).id")
    W = lambda e: pg.evaluate(f"(()=>{{const t=ws.tasks.find(t=>t.id==='{tid}');return {e}}})()")
    def open_ed():
        if pg.locator('#tree [data-eact=tbimg]').count()==0:
            pg.click(f'#tree .tnode[data-sel=task][data-id={tid}]'); pg.wait_for_timeout(400)
    open_ed()
    chk('mỗi ô chữ có nút +ảnh', pg.locator('#tree [data-eact=tbimg][data-i="0"]').count()==4, pg.locator('#tree [data-eact=tbimg][data-i="0"]').count())
    chk('công tắc Ảnh trong bảng: Không', pg.locator('#tree [data-eact=tblo][data-v="im:none"].on').count()==1)
    # thêm ảnh vào một ô thân bảng
    pg.locator('#tree [data-eact=tbimg][data-i="0"][data-j="1"]').click(); pg.wait_for_timeout(400)
    chk('ô có ảnh, giữ chữ', W("JSON.stringify(t.content.rows[0].cells[1])")=='{"img":"Sunday","text":"Sunday"}', W("JSON.stringify(t.content.rows[0].cells[1])"))
    chk('trang: ô có khung ảnh + chữ', pg.evaluate(f"(()=>{{const c=document.querySelectorAll('.task[data-task={tid}] .cix');return c.length===1&&c[0].querySelector('.pic')&&c[0].innerText.includes('Sunday')}})()"))
    open_ed()
    chk('cột trái: ô có ảnh hiện ảnh nhỏ + nút −ảnh', pg.locator('#tree [data-eact=tbimg][data-i="0"][data-j="1"]').get_attribute('aria-label')=='Gỡ ảnh' and pg.locator('#tree .etbl .ithumb').count()>=1)
    pg.locator('#tree [data-eact=tbimg][data-i="0"][data-j="1"]').click(); pg.wait_for_timeout(400)
    chk('gỡ ảnh: về chữ', W("t.content.rows[0].cells[1]")=='Sunday')
    # cả bảng: cột đầu
    open_ed(); pg.locator('#tree [data-eact=tblo][data-v="im:first"]').click(); pg.wait_for_timeout(400)
    chk('Cột đầu: mọi đầu hàng có ảnh', W("t.content.rows.every(r=>r.head&&r.head.img&&r.head.text)"))
    n = pg.evaluate(f"document.querySelectorAll('.task[data-task={tid}] .tc.rh .pic').length")
    chk('trang: ảnh ở cột đầu mọi hàng', n==W("t.content.rows.length"), n)
    open_ed(); pg.locator('#tree [data-eact=tblo][data-v="im:all"]').click(); pg.wait_for_timeout(400)
    chk('Mọi ô có chữ: ô thân bảng có ảnh', W("t.content.rows.every(r=>r.cells.every(v=>typeof v!=='string'||!v.trim()))"))
    chk('0 tràn sau khi thêm ảnh', pg.evaluate("lastRes.diags.length")==0, pg.evaluate("lastRes.diags"))
    pg.evaluate(f"document.querySelector('.task[data-task={tid}]').scrollIntoView()"); pg.wait_for_timeout(300)
    open_ed(); pg.locator('#tree [data-k="tb.r.0.c.0"]').fill('Sat.'); pg.locator('#tree [data-k="tb.r.0.c.0"]').press('Tab'); pg.wait_for_timeout(500)
    chk('ô có ảnh: gõ chữ mới vẫn giữ ảnh', W("JSON.stringify(t.content.rows[0].cells[0])")=='{"img":"Saturday","text":"Sat."}', W("JSON.stringify(t.content.rows[0].cells[0])"))
    pg.locator('#tree [data-k="tb.r.0.c.0"]').fill('Saturday'); pg.locator('#tree [data-k="tb.r.0.c.0"]').press('Tab'); pg.wait_for_timeout(500)
    pg.screenshot(path='/home/claude/logs/v99_img.png')
    # MD khứ hồi
    back = pg.evaluate(f"JSON.stringify(readMd('# P\\n\\n'+taskToMd(ws.tasks.find(t=>t.id==='{tid}'))).tasks[0].t.content.rows[0])")
    r0 = json.loads(back); cur = json.loads(W("JSON.stringify(t.content.rows[0])"))
    chk('MD đọc lại giữ ảnh + chữ trong ô', r0['cells']==cur['cells'] and r0['head']==cur['head'], back[:300])
    open_ed(); pg.locator('#tree [data-eact=tblo][data-v="im:none"]').click(); pg.wait_for_timeout(400)
    chk('Không: gỡ hết ảnh, chữ còn nguyên', W("t.content.rows.every(r=>typeof r.head==='string'&&r.cells.every(v=>typeof v==='string'))") and W("t.content.rows[0].cells.join('|')")=='Saturday|Sunday|Monday')
    # ô tích / ô điền không có nút ảnh
    chk('Task bảng tích: ô tích không có nút +ảnh', pg.evaluate("(()=>{const t=ws.tasks.find(t=>t.id==='t16');return t.content.rows[0].cells.every(v=>v.tick)})()"))
    pg.click('#tree .tnode[data-sel=task][data-id=t16]'); pg.wait_for_timeout(400)
    chk('…và ô đầu hàng có ảnh sẵn hiện −ảnh', pg.locator('#tree [data-eact=tbimg][data-j=h]').count()==5 and pg.locator('#tree [data-eact=tbimg]').count()==5 and pg.locator('#tree [data-eact=tbimg]').first.get_attribute('aria-label')=='Gỡ ảnh')
    chk('0 lỗi console', not errs, errs[:3])
    b.close()
print('ALL OK' if ok else 'SOME FAIL')
