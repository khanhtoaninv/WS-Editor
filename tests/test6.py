import sys
from playwright.sync_api import sync_playwright
ok=True
def chk(n,c,i=''):
    global ok; print(('PASS ' if c else 'FAIL ')+n, i); ok = ok and bool(c)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'ERR_TUNNEL' not in m.text else None); pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+sys.argv[1]); pg.wait_for_timeout(1200)
    for tid in ['t1','t2','t3','t18']:
        pg.click(f'#tree .tnode[data-sel=task][data-id={tid}]'); pg.wait_for_timeout(400)
        chk(tid+' có mục tỉ lệ', pg.locator('#tree [data-eact=tblar]').count()==4)
        ratios=lambda: pg.evaluate(f"[...document.querySelectorAll('.task[data-task={tid}] .pic[data-slot]')].map(e=>{{const r=e.getBoundingClientRect();return +(r.width/r.height).toFixed(2)}})")
        pg.evaluate(f"openGen('{tid}', slotsOf(ws.tasks.find(t=>t.id==='{tid}'))[0].key)"); pg.wait_for_timeout(200)
        chk(tid+' popup khóa tỉ lệ', pg.evaluate("[...document.querySelectorAll('#genAr button')].every(b=>b.disabled)"))
        chk(tid+' popup có Hiển thị', pg.evaluate("!document.getElementById('genFrame').hidden"))
        pg.evaluate("document.getElementById('genUp').value=''"); pg.set_input_files('#genUp','tall.png'); pg.wait_for_timeout(700); pg.click('#genUse'); pg.wait_for_timeout(700)
        r=ratios(); chk(tid+' mọi ô cùng 4:3 sau up ảnh dọc', r and max(r)-min(r)<0.05 and abs(r[0]-1.33)<0.05, r)
        pg.click('#tree [data-eact=tblar][data-v="1/1"]'); pg.wait_for_timeout(400)
        r=ratios(); chk(tid+' đổi 1:1', all(abs(x-1)<0.05 for x in r), r)
        pg.click('#tree [data-eact=tblar][data-v="4/3"]'); pg.wait_for_timeout(300)
    pg.evaluate("openGen('t1', slotsOf(ws.tasks.find(t=>t.id==='t1'))[0].key)"); pg.wait_for_timeout(300)
    ar=pg.evaluate("(()=>{const r=document.getElementById('genFr').getBoundingClientRect();return +(r.width/r.height).toFixed(2)})()")
    chk('khung popup đúng tỉ lệ đã chọn', abs(ar-1.33)<0.05, ar)
    pg.evaluate("document.getElementById('genDlg').close()")
    chk('A4 vẫn 11 trang', pg.inner_text('#pageBadge').startswith('11') and pg.inner_text('#diagBadge')=='Không lỗi tràn', pg.inner_text('#pageBadge'))
    print('ERRS',errs); print('ALL OK' if ok and not errs else 'SOME FAIL')
