# v103: bài nối hiện số câu ở lề, viền hai vế (mặc định không viền, MD "Viền hai vế: có"), kéo cột T / F lại gần câu
import sys
from playwright.sync_api import sync_playwright
ok=True
def chk(n,c,i=''):
    global ok; print(('PASS ' if c else 'FAIL ')+n, i); ok = ok and bool(c)
MD=open('/home/claude/WS-Editor/tests/md/phieu9.md',encoding='utf8').read()
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':1000}); errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'fonts' not in m.text else None); pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+sys.argv[1]); pg.wait_for_timeout(1300)
    pg.evaluate("md=>{openImport('sheet',null,md)}",MD); pg.wait_for_timeout(600)
    pg.click('#pasteOk'); pg.wait_for_timeout(600)
    try: pg.get_by_role('button',name='Thay phiếu hiện tại').click(timeout=3000)
    except Exception: pass
    pg.wait_for_timeout(1500)
    ids=pg.evaluate("ws.tasks.map(t=>t.id)")
    mbd=pg.evaluate("ws.tasks.map(t=>t.layout.mbd||null)")
    chk('MD: Task 2 viền có, Task 3 không', mbd[1]=='on' and mbd[2] is None, mbd)
    nums=pg.evaluate("ids=>ids.slice(1,3).map(i=>[...document.querySelectorAll(`.task[data-task=${i}] .ml .ino`)].map(x=>x.textContent).join(','))",ids)
    chk('bài nối: số câu 1..5 và 1..8 ở vế trái', nums==['1,2,3,4,5','1,2,3,4,5,6,7,8'], nums)
    bd=pg.evaluate("ids=>ids.slice(1,3).map(i=>[document.querySelector(`.task[data-task=${i}] .mr span`),document.querySelector(`.task[data-task=${i}] .ml>span:not(.ino)`)].map(e=>parseFloat(getComputedStyle(e).borderTopWidth)>0))",ids)
    chk('Task 2: viền cả hai vế; Task 3: không viền cả hai', bd==[[True,True],[False,False]], bd)
    md2=pg.evaluate("sheetToMd(ws)")
    chk('xuất MD: "Viền hai vế: có" đúng một lần', md2.count('Viền hai vế: có')==1, md2.count('Viền hai vế: có'))
    pg.evaluate("v=>{commit(w=>{w.tasks[2].layout.mbd='on'}, 'x')}"); pg.wait_for_timeout(500)
    chk('bật viền Task 3 thì có viền', pg.evaluate(f"parseFloat(getComputedStyle(document.querySelector('.task[data-task={ids[2]}] .mr span')).borderTopWidth)>0"))
    # T/F: tay kéo
    pg.evaluate("ids=>{const e=document.querySelector(`.task[data-task=${ids[3]}]`); e.scrollIntoView({block:'start'})}",ids); pg.wait_for_timeout(400)
    pg.click(f'.task[data-task={ids[3]}] .a6 >> nth=0'); pg.wait_for_timeout(600)
    h=pg.query_selector(f'.task[data-task={ids[3]}] .splitter[data-param=tfx]')
    chk('có tay kéo T / F', h is not None)
    if h:
        bx=h.bounding_box(); pg.mouse.move(bx['x']+bx['width']/2, bx['y']+30); pg.mouse.down(); pg.mouse.move(bx['x']+bx['width']/2-120, bx['y']+30, steps=6); pg.mouse.up(); pg.wait_for_timeout(600)
        tfx=pg.evaluate("ws.tasks[3].answer.params.tfx"); chk('kéo sang trái: tfx > 0', tfx and tfx>10, tfx)
        pg.evaluate("document.querySelector('.splitter[data-param=tfx]')&&0")
        h=pg.query_selector(f'.task[data-task={ids[3]}] .splitter[data-param=tfx]')
        if h: h.dblclick(); pg.wait_for_timeout(600)
        chk('bấm đúp: về mặc định', not pg.evaluate("ws.tasks[3].answer.params.tfx"))
    chk('không lỗi console', not errs, errs)
print('ALL OK' if ok else 'SOME FAIL'); sys.exit(0 if ok else 1)
