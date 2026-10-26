# v66: font nhúng sẵn — không gọi mạng, nạp đủ nhóm ký tự tiếng Việt, gõ tiếng Việt lần đầu không mất chữ, 0 lỗi console
import sys, os
from playwright.sync_api import sync_playwright
ok=True
def chk(n,c,i=''):
    global ok; print(('PASS ' if c else 'FAIL ')+n, i); ok = ok and bool(c)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]; reqs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None); pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('request', lambda r: reqs.append(r.url))
    pg.goto('file://'+sys.argv[1]); pg.wait_for_function('window.__ws && window.__ws.renders>1'); pg.wait_for_timeout(1200)
    ext=[u for u in reqs if not u.startswith(('file:','data:','blob:'))]
    chk('không gọi mạng nào khi mở', not ext, ext[:3])
    ff=pg.evaluate("[...document.fonts].map(f=>f.family.replace(/\"/g,'')+' '+f.weight+' '+f.status)")
    chk('Andika 400 và 700 đã nạp', sum(1 for x in ff if x.startswith('Andika') and 'loaded' in x)>=4, ff)
    chk('Andika dùng được cho chữ Việt', pg.evaluate("document.fonts.check('14pt Andika','ă')") and pg.evaluate("document.fonts.check('bold 14pt Andika','Đ')"))
    n0=pg.evaluate('window.__ws.renders'); res0=pg.evaluate('window.__ws.res.pages.length')
    pg.click('#tree .tnode[data-id=t3]'); pg.wait_for_timeout(300)
    pg.evaluate("(()=>{const e=document.querySelector('#tree .sec[data-sec=g0]'); if(!e.classList.contains('open')) e.querySelector('.sech').click()})()")
    pg.focus('#tree .ed [data-k=title]'); pg.keyboard.press('Control+A'); pg.keyboard.type('Nghe và đánh dấu ✓ ở ô đúng ABC', delay=40); pg.wait_for_timeout(600)
    chk('gõ chữ Việt: ô giữ nguyên chữ và focus', pg.input_value('#tree .ed [data-k=title]')=='Nghe và đánh dấu ✓ ở ô đúng ABC' and pg.evaluate("document.activeElement.dataset.k")=='title')
    chk('trang cập nhật tiêu đề', 'Nghe và đánh dấu' in pg.inner_text('#stage'))
    chk('số trang không đổi sau khi gõ', pg.evaluate('window.__ws.res.pages.length')==res0)
    # mô phỏng font nạp thêm giữa chừng khi đang gõ: cột trái không bị dựng lại
    pg.evaluate("document.querySelector('#tree .ed [data-k=title]').dataset.mark='1'")
    pg.evaluate("document.fonts.dispatchEvent(Object.assign(new Event('loadingdone'),{fontfaces:[[...document.fonts].find(f=>f.family.includes('Andika'))]}))"); pg.wait_for_timeout(400)
    chk('font nạp thêm: cột trái giữ nguyên, không mất chữ', pg.evaluate("(document.querySelector('#tree .ed [data-k=title]')||{}).dataset && document.querySelector('#tree .ed [data-k=title]').dataset.mark")=='1')
    chk('0 lỗi console', not errs, errs[:3])
    b.close()
print('ALL OK' if ok else 'SOME FAIL')
