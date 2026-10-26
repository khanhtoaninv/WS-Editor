import sys
from playwright.sync_api import sync_playwright
ok=True
def chk(n,c,i=''):
    global ok; print(('PASS ' if c else 'FAIL ')+n, i); ok = ok and bool(c)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'ERR_TUNNEL' not in m.text else None); pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+sys.argv[1]); pg.wait_for_timeout(1200)
    base=pg.inner_text('#pageBadge')
    withTrack=pg.evaluate("ws.tasks.filter(t=>t.audio).map(t=>t.id)"); noTrack=pg.evaluate("ws.tasks.filter(t=>!t.audio).map(t=>t.id)")
    print('có Track',withTrack)
    tid=withTrack[0]
    pg.click(f'#tree .tnode[data-sel=task][data-id={tid}]'); pg.wait_for_timeout(300)
    pg.click('#tree .sech[data-stg=g0]'); pg.wait_for_timeout(200)
    chk('có mục Mã QR nghe', pg.locator('#tree .ed [data-eact=qrsrc]').count()==3)
    chk('chưa nhập: không có QR trên phiếu', pg.locator(f'.task[data-task={tid}] .qrb').count()==0)
    pg.fill('#tree .ed [data-k="qr.base"]','https://pinta.vn/audio/'); pg.fill('#tree .ed [data-k="qr.link"]','unit3/track05.mp3'); pg.wait_for_timeout(500)
    chk('nhập link: QR hiện trên phiếu', pg.locator(f'.task[data-task={tid}] .qrb svg').count()==1)
    chk('QR hợp lệ (nhiều module)', pg.evaluate(f"document.querySelector('.task[data-task={tid}] .qrb svg').innerHTML.length")>500)
    url=pg.evaluate(f"qrUrl(ws.tasks.find(t=>t.id==='{tid}'))"); chk('link ghép địa chỉ gốc', url=='https://pinta.vn/audio/unit3/track05.mp3', url)
    sz=pg.evaluate(f"(()=>{{const r=document.querySelector('.task[data-task={tid}] .qrb').getBoundingClientRect();return [r.width,r.height]}})()"); print('size px',sz)
    chk('phiếu vẫn 10 trang, không tràn', pg.inner_text('#pageBadge').startswith('10') and pg.inner_text('#diagBadge')=='Không lỗi tràn', pg.inner_text('#pageBadge'))
    # ảnh mã
    pg.click('#tree .ed [data-eact=qrsrc][data-v=img]'); pg.wait_for_timeout(300)
    with pg.expect_file_chooser() as fc: pg.click('#tree .ed [data-eact=qrimg]')
    fc.value.set_files('qr_up.png'); pg.wait_for_timeout(600)
    chk('ảnh mã: hiện <img> trên phiếu', pg.locator(f'.task[data-task={tid}] .qrb img').count()==1)
    # file nghe
    pg.click('#tree .ed [data-eact=qrsrc][data-v=file]'); pg.wait_for_timeout(300)
    with pg.expect_file_chooser() as fc: pg.click('#tree .ed [data-eact=qrfile]')
    fc.value.set_files('ref.png'); pg.wait_for_timeout(600)
    chk('file nghe: sinh link + QR', pg.locator(f'.task[data-task={tid}] .qrb svg').count()==1 and pg.evaluate(f"ws.tasks.find(t=>t.id==='{tid}').qr.url").startswith('https://example.invalid/audio/'))
    chk('ghi chú demo hiện', 'Bản demo' in pg.inner_text('#tree .ed'))
    # hook thật
    pg.evaluate("window.WSAudioUpload={upload:async f=>({url:'https://cdn.pinta.vn/a/'+f.name})}")
    with pg.expect_file_chooser() as fc: pg.click('#tree .ed [data-eact=qrfile]')
    fc.value.set_files('ref.png'); pg.wait_for_timeout(600)
    chk('hook WSAudioUpload được dùng', pg.evaluate(f"ws.tasks.find(t=>t.id==='{tid}').qr.url")=='https://cdn.pinta.vn/a/ref.png')
    # Task không có Track: không có mục
    nt=noTrack[0]; pg.click(f'#tree .tnode[data-sel=task][data-id={nt}]'); pg.wait_for_timeout(300); pg.click('#tree .sech[data-stg=g0]') if not pg.evaluate("document.querySelector('#tree .sec[data-sec=g0]').classList.contains('open')") else None
    chk('Task không Track: không có mục QR', pg.locator('#tree .ed [data-eact=qrsrc]').count()==0)
    # hoàn tác
    pg.click('#undo'); pg.wait_for_timeout(300)
    # nhân đôi giữ qr
    print('ERRS',errs); print('ALL OK' if ok and not errs else 'SOME FAIL')
