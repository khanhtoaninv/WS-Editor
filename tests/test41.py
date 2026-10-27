# v98: Bảng chọn đáp án (ô tích + chữ, tích ô đúng ở cột trái, bản giáo viên, MD [x])
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
    nT = pg.evaluate(f"ws.tasks.find(t=>t.id==='{tid}').content.rows.flatMap(r=>r.cells).filter(v=>typeof v==='string'&&v.trim()).length")
    pg.click(f'#tree .tnode[data-sel=task][data-id={tid}]'); pg.wait_for_timeout(300)
    # mở G3 bảng ở cột trái
    pg.evaluate(f"(()=>{{const e=document.querySelector('#tree .ed[data-ed={tid}]');}})()")
    cb = pg.locator('#tree [data-eact=tblo][data-v^="tk:"]')
    if cb.count()==0:
        g = pg.locator(f'#tree .tnode[data-id="{tid}:G3"], #tree [data-node="{tid}:G3"]')
        if g.count(): g.first.click(); pg.wait_for_timeout(300)
    chk('cột trái có "Hiện ô tích trước chữ"', cb.count()==1)
    cb.first.click(); pg.wait_for_timeout(400)
    n = pg.evaluate(f".task[data-task={tid}] .tkc".join(["document.querySelectorAll('","').length"]))
    chk('bật: mọi ô chữ có ô tích trước chữ', n==nT, [n,nT])
    chk('ô tích nằm trước chữ, cùng hàng', pg.evaluate(f"(()=>{{const k=document.querySelector('.task[data-task={tid}] .tkc');const a=k.children[0].getBoundingClientRect(),c=k.children[1].getBoundingClientRect();return a.right<=c.left && Math.abs((a.top+a.bottom)/2-(c.top+c.bottom)/2)<2}})()"))
    # tích ô đúng (nhiều ô một hàng)
    bt = pg.locator('#tree [data-eact=tbok][data-i="0"]')
    chk('cột trái có nút tích ô đúng cho mỗi ô', bt.count()>=2, bt.count())
    bt.nth(0).click(); pg.wait_for_timeout(300); pg.locator('#tree [data-eact=tbok][data-i="0"]').nth(1).click(); pg.wait_for_timeout(300)
    oks = pg.evaluate(f"ws.tasks.find(t=>t.id==='{tid}').content.rows[0].cells.filter(v=>v&&v.ok).length")
    chk('mặc định nhiều ô đúng mỗi hàng', oks==2, oks)
    chk('bản học sinh: không lộ ô đúng', pg.evaluate(f"document.querySelectorAll('.task[data-task={tid}] .a5.pk, .task[data-task={tid}] .tok').length")==0)
    # một đáp án
    pg.locator('#tree [data-eact=tblo][data-v^="one:"]').first.click(); pg.wait_for_timeout(300)
    chk('bật "Một ô đúng mỗi hàng": giữ ô đúng đầu', pg.evaluate(f"ws.tasks.find(t=>t.id==='{tid}').content.rows[0].cells.map(v=>!!(v&&v.ok)).join()").startswith('true,false'))
    pg.locator('#tree [data-eact=tbok][data-i="0"]').nth(2).click(); pg.wait_for_timeout(300)
    chk('tích ô khác: ô cũ tự bỏ', pg.evaluate(f"ws.tasks.find(t=>t.id==='{tid}').content.rows[0].cells.map(v=>!!(v&&v.ok)).join()")=='false,false,true')
    # bản giáo viên
    pg.click(f'#tree .tnode[data-sel=task][data-id={tid}]'); pg.wait_for_timeout(300)
    k = pg.locator('#insp [data-param="tbl.key"] button[data-v=true]')
    chk('cột phải có Hiện đáp án (bản giáo viên)', k.count()==1)
    k.click(); pg.wait_for_timeout(300)
    chk('bản giáo viên: ô đúng có ✓ và tô nền', pg.evaluate(f"document.querySelectorAll('.task[data-task={tid}] .tok .a5.pk').length")==1)
    bg = pg.evaluate(f"getComputedStyle(document.querySelector('.task[data-task={tid}] .tok')).backgroundColor")
    chk('ô đúng có màu nền', bg not in ('rgba(0, 0, 0, 0)','rgb(255, 255, 255)'), bg)
    pg.screenshot(path='/home/claude/logs/v98_key.png')
    # MD khứ hồi
    md = pg.evaluate(f"taskToMd(ws.tasks.find(t=>t.id==='{tid}'))")
    chk('MD có [x] và [ ] kèm chữ', '[x] ' in md and '[ ] ' in md, md[:300])
    back = pg.evaluate(f"JSON.stringify(readMd('# P\\n\\n'+taskToMd(ws.tasks.find(t=>t.id==='{tid}'))).tasks[0].t.content.rows[0].cells)")
    chk('MD đọc lại giữ ô tích, chữ, ô đúng', json.loads(back)==json.loads(pg.evaluate(f"JSON.stringify(ws.tasks.find(t=>t.id==='{tid}').content.rows[0].cells)")), back)
    # gõ trực tiếp trong ô
    chk('parseCell [x] chữ', pg.evaluate("JSON.stringify(parseCell('[x] Monday'))")=='{"tick":1,"ok":true,"text":"Monday"}')
    chk('parseCell [ ] / ✓ vẫn là ô tích', pg.evaluate("JSON.stringify([parseCell('[ ]'),parseCell('✓'),parseCell('[ảnh: cat] Cat')])")=='[{"tick":1},{"tick":1},{"img":"cat","text":"Cat"}]')
    # tắt Hiện ô tích → chữ thường
    if pg.locator('#tree [data-eact=tblo][data-v^="tk:"]').count()==0:
        pg.click(f'#tree .tnode[data-sel=task][data-id={tid}]'); pg.wait_for_timeout(400)
    pg.locator('#tree [data-eact=tblo][data-v^="tk:"]').first.click(); pg.wait_for_timeout(300)
    chk('tắt: về ô chữ thường', pg.evaluate(f"document.querySelectorAll('.task[data-task={tid}] .tkc').length")==0 and pg.evaluate(f"ws.tasks.find(t=>t.id==='{tid}').content.rows.flatMap(r=>r.cells).filter(v=>typeof v==='string'&&v.trim()).length")==nT)
    # bảng tích sẵn (chỉ ô tích): vẫn như cũ
    chk('bảng chỉ ô tích (Task mẫu) vẫn hiện ô tích', pg.evaluate("document.querySelectorAll('.task[data-task=t16] .tc .a5').length")==15)
    chk('0 lỗi console', not errs, errs[:3])
    chk('0 tràn', pg.evaluate("lastRes.diags.length")==0)
    b.close()
print('ALL OK' if ok else 'SOME FAIL')
