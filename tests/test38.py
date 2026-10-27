# v95: Q2 điểm bắt đầu / chiều dài / số hàng
import sys
from playwright.sync_api import sync_playwright
ok=True
def chk(n,c,i=''):
    global ok; print(('PASS ' if c else 'FAIL ')+n, i); ok = ok and bool(c)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'fonts' not in m.text else None); pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    HT = "(()=>{const e=document.querySelector('.task[data-task=t8]').cloneNode(true);e.querySelectorAll('.rsz,.splitter').forEach(x=>x.remove());return e.outerHTML})()"   # bỏ tay kéo (vị trí px làm tròn khác nhau)
    pg.goto('file://'+sys.argv[1]); pg.wait_for_timeout(1300)
    pg.click('#tree .tnode[data-sel=task][data-id=t8]'); pg.wait_for_timeout(300)
    pg.evaluate("SECT.cfg=true;refreshSel()"); pg.wait_for_timeout(200)
    H0 = pg.evaluate(HT)
    T = lambda: pg.evaluate("(()=>{const t=ws.tasks.find(t=>t.id==='t8');return [t.answer.layout,t.answer.attach,JSON.stringify(q2cfg(t)),q2end(t)]})()")
    chk('phiếu cũ Q2 (A1, 2 dòng): cấu hình đọc là dòng dưới / hết dòng / 2 hàng', T()[0]=='A1' and '"start":"below"' in T()[2] and '"len":"fill"' in T()[2] and '"lines":2' in T()[2], T())
    sc = '#insp' if pg.locator('#insp [data-act=q2]').count() else '#tree'
    at = 'data-act' if sc=='#insp' else 'data-eact'
    chk('có 3 điều khiển Q2', pg.locator(f'{sc} .q2f').count()==3, pg.locator(f'{sc} .q2f').count())
    chk('không còn nút Dòng kẻ / Gạch cuối câu', pg.locator(f'{sc} [{at}=qst]').count()==0)
    def click(v): pg.click(f'{sc} [{at}=q2][data-v="{v}"]'); pg.wait_for_timeout(250)
    click('start:end'); click('ln:-1')
    r = T(); chk('tích Từ cuối câu hỏi: chuyển sang A2 theo câu, q2end', r[0]=='A2' and r[3] and '"start":"end"' in r[2], r)
    n = pg.evaluate("(()=>{const e=document.querySelector('.task[data-task=t8] .q');return [e.querySelectorAll('.a2box .fr .fl').length, e.querySelectorAll('.xl').length, e.querySelectorAll('.qb>.a').length]})()")
    chk('từ cuối câu + hết dòng + 1 hàng: một gạch hết dòng cùng hàng, không thêm hàng, không còn ô đáp án riêng', n==[1,0,0], n)
    click('ln:+1')
    n = pg.evaluate("(()=>{const e=document.querySelector('.task[data-task=t8] .q');return [e.querySelectorAll('.fr .fl').length, e.querySelectorAll('.xl').length]})()")
    chk('2 hàng: gạch cùng hàng + 1 hàng dưới', n==[1,1], n)
    click('start:below')
    n = pg.evaluate("(()=>{const e=document.querySelector('.task[data-task=t8] .q');return [e.querySelectorAll('.fr .fl').length, e.querySelectorAll('.xl').length]})()")
    chk('bỏ tích + 2 hàng: 2 hàng dưới, không gạch cạnh câu', n==[0,2], n)
    click('ln:-1')
    n = pg.evaluate("(()=>{const e=document.querySelector('.task[data-task=t8] .q');return [e.querySelectorAll('.fr .fl').length, e.querySelectorAll('.xl').length]})()")
    chk('bỏ tích + 1 hàng: 1 hàng dưới', n==[0,1], n)
    click('ln:-1'); click('ln:-1')
    chk('số hàng không xuống dưới 1', pg.evaluate("q2cfg(ws.tasks.find(t=>t.id==='t8')).lines")==1)
    click('start:end'); click('len:fixed')
    w = pg.evaluate("(()=>{const e=document.querySelector('.task[data-task=t8] .q .a.a2');return e?e.style.width:''})()")
    chk('cố định: gạch có độ rộng mm theo tuổi', w.endswith('mm'), w)
    click('mm:+5')
    w2 = pg.evaluate("(()=>{const e=document.querySelector('.task[data-task=t8] .q .a.a2');return e?e.style.width:''})()")
    chk('+5 mm', float(w2[:-2])==float(w[:-2])+5, [w,w2])
    click('len:fill'); click('ln:+1'); click('ln:+1')
    n = pg.evaluate("(()=>{const e=document.querySelector('.task[data-task=t8] .q');return [e.querySelectorAll('.fr .fl').length, e.querySelectorAll('.xl').length]})()")
    chk('từ cuối câu + hết dòng + 3 hàng: 1 + 2', n==[1,2], n)
    # câu ví dụ
    pg.evaluate("commit(w=>{const t=w.tasks.find(t=>t.id==='t8');t.content.items[0].ex=true;t.content.items[0].key='My name is Lan.'})"); pg.wait_for_timeout(300)
    chk('câu ví dụ hiện đáp án mẫu trên gạch', 'My name is Lan.' in pg.inner_text('.task[data-task=t8]'))
    pg.click('#undo'); pg.wait_for_timeout(300)
    # hoàn tác về A1 cũ
    for _ in range(20):
        if pg.evaluate("ws.tasks.find(t=>t.id==='t8').answer.layout")=='A1': break
        pg.click('#undo'); pg.wait_for_timeout(150)
    chk('hoàn tác về phiếu cũ, trang giống hệt', pg.evaluate(HT)==H0)
    # JSON khứ hồi + MD
    pg.evaluate("commit(w=>{const t=w.tasks.find(t=>t.id==='t8');q2set(t,{start:'end',len:'fixed',lines:2})})"); pg.wait_for_timeout(300)
    rt = pg.evaluate("(()=>{const j=JSON.parse(JSON.stringify(ws));const t=j.tasks.find(t=>t.id==='t8');return JSON.stringify(t.answer)})()")
    chk('dữ liệu lưu được (lenMode, lines, start)', '"lenMode":"fixed"' in rt and '"lines":2' in rt and '"start":"inline"' in rt, rt)
    # Q12 và Q1 không bị ảnh hưởng
    chk('Q1 / Q12 / Q6 không dùng q2end', pg.evaluate("ws.tasks.filter(t=>t.id!=='t8').every(t=>!q2end(t))"))
    chk('0 lỗi console', not errs, errs[:3])
    chk('0 tràn', pg.evaluate("lastRes.diags.length")==0)
    pg.screenshot(path='/home/claude/logs/v95_q2.png')
    b.close()
print('ALL OK' if ok else 'SOME FAIL')
