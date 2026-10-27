# v94: popup + Task: chọn Dạng câu hỏi (Q) rồi Bố cục (T), có xem trước; thêm Task đúng Q / T / vị trí
import sys
from playwright.sync_api import sync_playwright
ok=True
def chk(n,c,i=''):
    global ok; print(('PASS ' if c else 'FAIL ')+n, i); ok = ok and bool(c)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'fonts' not in m.text else None); pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+sys.argv[1]); pg.wait_for_timeout(1300)
    n0 = pg.evaluate("ws.tasks.length")
    chk('badge v106', pg.inner_text('#verBadge')=='v106')
    pg.click('#tree [data-lib]'); pg.wait_for_timeout(400)
    chk('tab đầu "Chọn dạng bài", hiện lưới Q + Bố cục + xem trước', pg.is_visible('#lnQ') and pg.is_visible('#lnT') and pg.is_visible('#lnPv') and pg.locator('#lnQ [data-lq]').count()==13, pg.locator('#lnQ [data-lq]').count())
    chk('5 ô bố cục', pg.locator('#lnT [data-lt]').count()==5)
    chk('mặc định Q3 + Tự động, xem trước có chữ lorem', pg.evaluate("ln.q")=='Q3' and 'Lorem' in pg.inner_text('#lnPv'))
    pg.screenshot(path='../logs/v94_popup.png') if False else None
    # mọi Q × mọi T hợp lệ: xem trước dựng được, không lỗi
    bad=[]
    for q in ['Q1','Q2','Q3','Q4','Q5','Q6','Q7','Q8','Q9','Q10','Q11','Q12','IMG']:
        pg.click(f'#lnQ [data-lq={q}]'); pg.wait_for_timeout(120)
        for g in ['G1','G2','G4']:
            if pg.locator(f'#lnB [data-lb={g}]').is_disabled(): continue
            pg.click(f'#lnB [data-lb={g}]'); pg.wait_for_timeout(80)
            for tv in ['auto','T1','T2','T3','T4']:
                if 'off' in (pg.get_attribute(f'#lnT [data-lt={tv}]','class') or ''): continue
                pg.click(f'#lnT [data-lt={tv}]'); pg.wait_for_timeout(60)
                if not pg.evaluate("document.querySelector('#lnPv .task')!==null") or 'Không dựng được' in pg.inner_text('#lnPv'): bad.append((q,g,tv))
            pg.click(f'#lnB [data-lb={g}]'); pg.wait_for_timeout(60)
    chk('13 dạng × khối × bố cục: xem trước luôn dựng được', not bad, bad[:5])
    # Q3 + ảnh chung + Ảnh trái
    pg.click('#lnQ [data-lq=Q3]'); pg.click('#lnB [data-lb=G1]'); pg.wait_for_timeout(100)
    chk('có ảnh chung thì Ảnh trái sáng lên', 'off' not in pg.get_attribute('#lnT [data-lt=T2]','class'))
    pg.click('#lnT [data-lt=T2]'); pg.wait_for_timeout(100)
    chk('xem trước Ảnh trái: data-ia / layout T2', pg.evaluate("tnOf(lnBuild(ws))")=='T2')
    pg.click('#lnB [data-lb=G1]'); pg.wait_for_timeout(100)
    chk('bỏ ảnh chung: Ảnh trái mờ và về Tự động', pg.evaluate("ln.T")=='auto' and 'off' in pg.get_attribute('#lnT [data-lt=T2]','class'))
    pg.dispatch_event('#lnT [data-lt=T3]','click'); pg.wait_for_timeout(100)
    chk('bấm ô mờ không đổi bố cục', pg.evaluate("ln.T")=='auto')
    # Q4 không có bài đọc
    pg.click('#lnQ [data-lq=Q4]'); pg.wait_for_timeout(100)
    chk('Q4: Bài đọc bị khóa', pg.locator('#lnB [data-lb=G2]').is_disabled())
    pg.click('#libClose'); pg.wait_for_timeout(200)
    # Thêm Q5 + bài đọc + ảnh chung + Ảnh trong bài đọc, sau Task đang chọn
    pg.click('#tree .tnode[data-sel=task][data-id=t3]'); pg.wait_for_timeout(200)
    pg.click('#tree [data-lib]'); pg.wait_for_timeout(300)
    chk('mở lại: mặc định Cuối phiếu, Q3, Tự động', pg.evaluate("ln.pos")=='end' and pg.evaluate("ln.q")=='Q3' and pg.evaluate("ln.T")=='auto')
    pg.click('#lnPos [data-lp=after]')
    pg.click('#lnQ [data-lq=Q5]'); pg.click('#lnB [data-lb=G2]'); pg.click('#lnB [data-lb=G1]'); pg.wait_for_timeout(100)
    pg.click('#lnT [data-lt=T4]'); pg.wait_for_timeout(150)
    pg.screenshot(path='../logs/v94_popup.png')
    pg.click('#libAdd'); pg.wait_for_timeout(600)
    r = pg.evaluate("(()=>{const i=ws.tasks.findIndex(t=>t.id===sel.id),t=ws.tasks[i];return [ws.tasks.length,i,ws.tasks[i-1].id,qOf(t),tnOf(t),ck(t),!!t.image]})()")
    chk('thêm Task Q5 + bài đọc + ảnh, Ảnh trong bài đọc, ngay sau Task 3', r[0]==n0+1 and r[1]==3 and r[2]=='t3' and r[3]=='Q5' and r[4]=='T4' and r[5]=='passage' and r[6], r)
    chk('Task mới được chọn và hiện trên trang', pg.locator(f'.task[data-task="{pg.evaluate("sel.id")}"]').count()>=1)
    pg.click('#undo'); pg.wait_for_timeout(300)
    chk('hoàn tác bỏ Task mới', pg.evaluate("ws.tasks.length")==n0)
    # Thêm cuối phiếu: Q12 và Chỉ có ảnh, Q10, Q11
    for q,want in [('Q12','Q12'),('Q10','Q10'),('Q11','Q11'),('Q8','Q8'),('Q9','Q9'),('Q7','Q7'),('Q6','Q6'),('Q1','Q1'),('Q2','Q2'),('Q4','Q4')]:
        pg.click('#tree [data-lib]'); pg.wait_for_timeout(250)
        pg.click('#lnPos [data-lp=end]'); pg.click(f'#lnQ [data-lq={q}]'); pg.click('#libAdd'); pg.wait_for_timeout(350)
        got = pg.evaluate("(()=>{const t=ws.tasks[ws.tasks.length-1];return qOf(t)})()")
        chk(f'thêm cuối phiếu {q} → Task có dạng {want}', got==want, got)
    pg.click('#tree [data-lib]'); pg.wait_for_timeout(250); pg.click('#lnPos [data-lp=end]'); pg.click('#lnQ [data-lq=IMG]'); pg.click('#libAdd'); pg.wait_for_timeout(350)
    chk('Chỉ có ảnh: Task có ảnh lớn, không có câu', pg.evaluate("(()=>{const t=ws.tasks[ws.tasks.length-1];return !!t.image && ck(t)==='empty'})()"))
    # tab Từ file / dán vẫn dùng được
    pg.click('#tree [data-lib]'); pg.wait_for_timeout(250); pg.click('#libDlg [data-tab=src]'); pg.wait_for_timeout(200)
    chk('tab Từ file / dán: ẩn nút Thêm Task, hiện ô dán', not pg.is_visible('#libAdd') and pg.is_visible('#pasteTa'))
    pg.click('#libDlg [data-tab=lib]'); pg.wait_for_timeout(200)
    chk('quay lại tab dạng bài: hiện nút Thêm Task', pg.is_visible('#libAdd') and pg.is_visible('#lnPv'))
    pg.click('#libClose'); pg.wait_for_timeout(200)
    r2 = pg.evaluate("renderCount") 
    chk('0 lỗi console', not errs, errs[:3])
    chk('0 cảnh báo tràn trang', pg.evaluate("lastRes.diags.length")==0, pg.evaluate("lastRes.diags.map(d=>d.msg)"))
    b.close()
print('ALL OK' if ok else 'SOME FAIL')
