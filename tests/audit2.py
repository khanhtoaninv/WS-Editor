import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://'+sys.argv[1]); pg.wait_for_timeout(1200)
    ids=pg.evaluate("ws.tasks.filter(t=>slotsOf(t).length).map(t=>t.id)")
    for ar in ['1/1','3/4','16/9']:
        for tid in ids:
            pg.click(f'#tree .tnode[data-sel=task][data-id={tid}]'); pg.wait_for_timeout(80)
            if tid in ('t6','t7','t10'):
                pg.evaluate(f"openGen('{tid}','G1')"); pg.click(f'#genAr [data-ar="{ar}"]'); pg.click('#genUse'); pg.wait_for_timeout(300)
            else:
                pg.click(f'#tree [data-eact=tblar][data-v="{ar}"]'); pg.wait_for_timeout(150)
        # tải ảnh dọc vào mọi ô
        for tid in ids:
            for key in pg.evaluate(f"slotsOf(ws.tasks.find(t=>t.id==='{tid}')).map(s=>s.key)"):
                pg.evaluate(f"openGen('{tid}','{key}')"); pg.evaluate("document.getElementById('genUp').value=''"); pg.set_input_files('#genUp','tall.png')
                pg.wait_for_function("!document.getElementById('genUse').disabled"); pg.click('#genUse'); pg.wait_for_timeout(250)
        print(ar, pg.inner_text('#pageBadge'), pg.inner_text('#diagBadge'))
    print(errs)
