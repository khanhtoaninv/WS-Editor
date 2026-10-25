import sys
from playwright.sync_api import sync_playwright
ok=True
def chk(n,c,i=''):
    global ok; print(('PASS ' if c else 'FAIL ')+n, i); ok = ok and bool(c)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'ERR_TUNNEL' not in m.text else None); pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+sys.argv[1]); pg.wait_for_timeout(1200)
    pg.click('#tree .tnode[data-sel=task][data-id=t16]'); pg.wait_for_timeout(400)
    chk('có mục tỉ lệ ô ảnh', pg.locator('#tree [data-eact=tblar]').count()==4)
    chk('mặc định 4:3', pg.evaluate("document.querySelector('#tree [data-eact=tblar].on').dataset.v")=='4/3')
    sz=lambda: pg.evaluate("[...document.querySelectorAll('.task[data-task=t16] .pic')].map(e=>{const r=e.getBoundingClientRect();return +(r.width/r.height).toFixed(2)})")
    pg.evaluate("document.querySelector('#tree .ed .etr .ithumb').click()"); pg.wait_for_timeout(300)
    chk('popup: nút tỉ lệ bị khóa', pg.evaluate("[...document.querySelectorAll('#genAr button')].every(b=>b.disabled)"))
    chk('popup: panel khung hiện', pg.evaluate("!document.getElementById('genFrame').hidden"))
    # upload ảnh dọc qua file input của popup (Tải ảnh từ máy)
    with pg.expect_file_chooser() as fc: pg.click('#genUpload')
    fc.value.set_files('tall.png'); pg.wait_for_timeout(700)
    pg.click('#genUse'); pg.wait_for_timeout(700)
    if pg.evaluate("document.getElementById('genDlg').open"): pg.evaluate("document.getElementById('genDlg').close()")
    r=sz(); print(r)
    chk('mọi ô ảnh vẫn 4:3 sau khi up ảnh dọc', all(abs(x-1.33)<0.05 for x in r), r)
    th=pg.evaluate("[...document.querySelectorAll('#tree .ed .etr .ithumb')].map(e=>{const r=e.getBoundingClientRect();return +(r.width/r.height).toFixed(2)})")
    chk('thumb cột trái cùng tỉ lệ', max(th)-min(th)<0.05, th)
    # đổi sang 1:1
    pg.click('#tree [data-eact=tblar][data-v="1/1"]'); pg.wait_for_timeout(400)
    chk('đổi 1:1: mọi ô 1:1', all(abs(x-1)<0.05 for x in sz()), sz())
    # Fit dọc ở ô đầu
    pg.evaluate("document.querySelector('#tree .ed .etr .ithumb').click()"); pg.wait_for_timeout(300)
    pg.click('#genFit [data-fit=height]'); pg.click('#genUse'); pg.wait_for_timeout(400)
    chk('ghi layout.cells', pg.evaluate("JSON.stringify(ws.tasks.find(t=>t.id==='t16').layout.cells)").count('height')==1, pg.evaluate("JSON.stringify(ws.tasks.find(t=>t.id==='t16').layout.cells)"))
    chk('trên phiếu có data-tf', pg.locator('.task[data-task=t16] .pic[data-tf=height]').count()==1)
    pg.evaluate("document.querySelector('#tree .ed .etr .ithumb').click()"); pg.wait_for_timeout(300)
    chk('popup nhớ Fit dọc', pg.evaluate("document.querySelector('#genFit .on').dataset.fit")=='height')
    pg.evaluate("document.getElementById('genDlg').close()")
    chk('A4 vẫn 11 trang, không tràn', pg.evaluate("document.body.innerText.includes('11 trang A4') && document.body.innerText.includes('Không lỗi tràn')"))
    pg.screenshot(path='../shots/p5.png')
    print('ERRS',errs); print('ALL OK' if ok and not errs else 'SOME FAIL')
