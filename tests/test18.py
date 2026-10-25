import json, sys
from playwright.sync_api import sync_playwright
F='file://'+sys.argv[1]; ok=True
def chk(n,c,x=''):
    global ok; print(('OK  ' if c else 'FAIL'),n,x); ok&=bool(c)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('console',lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'font' not in m.text.lower() else None)
    pg.on('pageerror',lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto(F); pg.wait_for_timeout(1500)
    pg.evaluate("sel={}; render()") if False else None
    pg.click('#tree .crumb, #tree [data-sheet]') if False else None
    ff=lambda: pg.evaluate("getComputedStyle(document.querySelector('.paper')).fontFamily")
    chk('mặc định Andika', 'Andika' in ff(), ff())
    n0=pg.evaluate("document.querySelectorAll('.page').length")
    # panel phiếu: bấm nút font
    pg.evaluate("document.querySelector('[data-act=\"sheet-preset\"]') || 0")
    has=pg.evaluate("!!document.querySelector('[data-act=\"font\"]')")
    if not has:
        pg.keyboard.press('Escape'); pg.keyboard.press('Escape'); pg.keyboard.press('Escape'); pg.wait_for_timeout(300)
        has=pg.evaluate("!!document.querySelector('[data-act=\"font\"]')")
    chk('có 3 nút font', pg.evaluate("document.querySelectorAll('[data-act=\"font\"]').length")==3)
    for k,name in [('be','Be Vietnam'),('lexend','Lexend')]:
        pg.click(f'[data-act="font"][data-v="{k}"]'); pg.wait_for_timeout(1200)
        chk(f'{k}: font trang',name in ff(),ff())
        chk(f'{k}: ws.font',pg.evaluate("ws.font")==k)
        chk(f'{k}: nút sáng',pg.evaluate(f"document.querySelector('[data-act=font][data-v={k}]').classList.contains('on')"))
        chk(f'{k}: có trang',pg.evaluate("document.querySelectorAll('.page').length")>=1, pg.inner_text('#diagBadge'))
        chk(f'{k}: JSON giữ font', json.loads(pg.evaluate("JSON.stringify(ws)")).get('font')==k)
        chk(f'{k}: khứ hồi fillSheet', pg.evaluate("fillSheet(JSON.parse(JSON.stringify(ws))).font")==k)
        pg.screenshot(path=f'../shots/font_{k}.png')
    pg.click('#undo'); pg.wait_for_timeout(800)
    chk('hoàn tác về be', pg.evaluate("ws.font")=='be' and 'Be Vietnam' in ff())
    pg.click('[data-act="font"][data-v="andika"]'); pg.wait_for_timeout(1000)
    chk('về Andika, bỏ khóa font', pg.evaluate("ws.font")==None and 'Andika' in ff())
    chk('số trang như ban đầu', pg.evaluate("document.querySelectorAll('.page').length")==n0)
    r=pg.evaluate("(()=>{const n=[];const o=fillSheet({tasks:[],font:'comic'},n);return [o.font,n]})()")
    chk('font lạ bị bỏ + báo', r[0] is None and any('font' in x for x in r[1]), r)
    chk('0 lỗi console', not errs, errs)
    b.close()
print('ALL OK' if ok else 'CÓ LỖI')
