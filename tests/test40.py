# v97: Căn lề Khối text
import sys
from playwright.sync_api import sync_playwright
ok=True
def chk(n,c,i=''):
    global ok; print(('PASS ' if c else 'FAIL ')+n, i); ok = ok and bool(c)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'fonts' not in m.text else None); pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+sys.argv[1]); pg.wait_for_timeout(1300)
    ta = lambda sel: pg.evaluate(f"(()=>{{const e=document.querySelector({sel!r});return e?getComputedStyle(e).textAlign:'none'}})()")
    chk('mặc định: mọi Task không có data-ta', pg.evaluate("document.querySelectorAll('.page .task[data-ta]').length")==0)
    # Task 14 (t7) Ảnh trong bài đọc: chọn Hai bên ở cột phải
    pg.click('#tree .tnode[data-sel=task][data-id=t7]'); pg.wait_for_timeout(300)
    chk('cột phải có Căn lề Khối text 4 lựa chọn', pg.locator('#insp [data-param="@ta"] button[data-act=set]').count()==4)
    pg.click('#insp [data-param="@ta"] button[data-v=justify]'); pg.wait_for_timeout(300)
    chk('bài đọc (Ảnh trong bài đọc) Hai bên', ta('.task[data-task=t7] .passage')=='justify')
    chk('hướng dẫn cũng Hai bên', ta('.task[data-task=t7] .g0t .ins')=='justify')
    # Task chỉ có bài đọc, bố cục Xếp dọc
    pg.evaluate("commit(w=>{const t=w.tasks.find(t=>t.id==='t7');t.layout.task='T6';delete t.image})"); pg.wait_for_timeout(300)
    chk('bài đọc không ảnh (Xếp dọc) vẫn Hai bên', ta('.task[data-task=t7] .passage')=='justify', pg.evaluate("layoutOf(ws.tasks.find(t=>t.id==='t7'))"))
    pg.click('#undo'); pg.wait_for_timeout(300)
    for v in ['center','right','left']:
        pg.click('#tree .tnode[data-sel=task][data-id=t7]'); pg.wait_for_timeout(200)
        pg.click(f'#insp [data-param="@ta"] button[data-v={v}]'); pg.wait_for_timeout(300)
        chk(f'{v}: bài đọc + hướng dẫn', ta('.task[data-task=t7] .passage') in (v,'start' if v=='left' else v) and ta('.task[data-task=t7] .g0t .ins') in (v,'start' if v=='left' else v), [ta('.task[data-task=t7] .passage'),ta('.task[data-task=t7] .g0t .ins')])
    # phiếu cũ: layout.align justify ở T8 → Hai bên
    pg.evaluate("commit(w=>{const t=w.tasks.find(t=>t.id==='t7');delete t.layout.ta;t.layout.align='justify'})"); pg.wait_for_timeout(300)
    chk('phiếu cũ "Đều hai bên" (layout.align) vẫn Hai bên', ta('.task[data-task=t7] .passage')=='justify' and pg.evaluate("taOf(ws.tasks.find(t=>t.id==='t7'))")=='justify')
    # khối tự do chữ: theo Task, ghi đè được
    pg.evaluate("commit(w=>{const t=w.tasks.find(t=>t.id==='t8');t.layout.ta='center';t.extras=[{id:'x1',kind:'text',pos:'bottom',text:'Lorem ipsum dolor sit amet.'}]})"); pg.wait_for_timeout(300)
    chk('khối tự do chữ theo Task (Giữa)', ta('.task[data-task=t8] .gtb')=='center')
    pg.evaluate("commit(w=>{const t=w.tasks.find(t=>t.id==='t8');t.extras[0].align='left'})"); pg.wait_for_timeout(300)
    chk('khối tự do chỉnh riêng Trái thắng Task Giữa', ta('.task[data-task=t8] .gtb')=='left')
    pg.evaluate("commit(w=>{const t=w.tasks.find(t=>t.id==='t8');t.extras[0].align='justify'})"); pg.wait_for_timeout(300)
    chk('khối tự do Hai bên', ta('.task[data-task=t8] .gtb')=='justify')
    pg.click('.task[data-task=t8] .gtb'); pg.wait_for_timeout(300)
    btn = pg.locator('#insp [data-param="align"] button[data-v=""]')
    chk('cột phải khối tự do có "Theo Task (Giữa)"', btn.count()==1 and 'Theo Task (Giữa)' in btn.inner_text())
    btn.click(); pg.wait_for_timeout(300)
    chk('bấm Theo Task: bỏ chỉnh riêng, về Giữa', ta('.task[data-task=t8] .gtb')=='center' and pg.evaluate("ws.tasks.find(t=>t.id==='t8').extras[0].align")==None)
    chk('câu hỏi không bị căn theo Khối text', ta('.task[data-task=t8] .qt') in ('left','start'))
    # hướng dẫn có QR: lề phải = mép trái QR
    pg.evaluate("commit(w=>{const t=w.tasks.find(t=>t.id==='t14');t.layout.ta='right';t.qr={src:'link',link:'https://example.com/a.mp3'}})"); pg.wait_for_timeout(500)
    r = pg.evaluate("(()=>{const k=document.querySelector('.task[data-task=t14]'),i=k.querySelector('.g0t .ins'),q=k.querySelector('.qrb');if(!q)return null;const a=i.getBoundingClientRect(),c=q.getBoundingClientRect();const rg=document.createRange();rg.selectNodeContents(i);const tr=rg.getBoundingClientRect();return [a.right,c.left,tr.right]})()")
    chk('có mã QR: hướng dẫn căn Phải kết thúc trước mép trái mã QR', r and r[0] <= r[1] and r[2] <= r[1] and r[1]-r[2] < 40, r)
    # MD khứ hồi
    md = pg.evaluate("taskToMd(ws.tasks.find(t=>t.id==='t8'))")
    chk('MD ghi Căn lề chữ: giữa', 'Căn lề chữ: giữa' in md)
    back = pg.evaluate("(()=>{const r=readMd('# Phiếu\\n\\n'+taskToMd(ws.tasks.find(t=>t.id==='t8')));return r.tasks[0].t.layout.ta})()")
    chk('MD đọc lại được', back=='center', back)
    chk('0 lỗi console', not errs, errs[:3])
    chk('0 tràn', pg.evaluate("lastRes.diags.length")==0)
    pg.click('#tree .tnode[data-sel=task][data-id=t14]'); pg.wait_for_timeout(300)
    pg.screenshot(path='/home/claude/logs/v97_ta.png')
    b.close()
print('ALL OK' if ok else 'SOME FAIL')
