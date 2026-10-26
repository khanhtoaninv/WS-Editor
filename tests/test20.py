import json, sys
from playwright.sync_api import sync_playwright
F='file://'+sys.argv[1]; ok=True
def chk(n,c,x=''):
    global ok; print(('PASS ' if c else 'FAIL '),n,x); ok&=bool(c)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('console',lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'font' not in m.text.lower() else None)
    pg.on('pageerror',lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto(F); pg.wait_for_timeout(1500)
    chk('badge ≥ v72', int(__import__('re').sub(r'\D','',pg.evaluate("document.getElementById('verBadge').textContent")) or 0) >= 72)
    chk('v84: mặc định Vừa, không lưu size', pg.evaluate("sizeKey()")=='m' and pg.evaluate("ws.size")==None)
    chk('Vừa = 12 pt cho 7-9', pg.evaluate("fontPt()")==12)
    def info():
        return pg.evaluate("({fs:getComputedStyle(document.querySelector('.task')).fontSize, pages:lastRes.pages.length, diags:lastRes.diags.length, pt:fontPt()})")
    base=info(); chk('Vừa: chữ 12pt trên trang', abs(float(base['fs'][:-2])-12*96/72)<0.1, base)
    pg.click('#tree [data-sel=sheet], .crumb [data-sel=sheet]') if pg.locator('#tree [data-sel=sheet]').count() else None
    pg.evaluate("sel={type:'sheet'}; renderInspector()") 
    res={}
    for k,pt in (('l',14),('s',10),('m',12)):
        pg.click(f'[data-act=size][data-v={k}]'); pg.wait_for_timeout(500)
        i=info(); res[k]=i
        chk(f'mức {k}: {pt} pt trên trang', abs(float(i['fs'][:-2])-pt*96/72)<0.1 and i['pt']==pt, i)
        chk(f'mức {k}: nút đang chọn', pg.evaluate(f"document.querySelector('[data-act=size][data-v={k}]').classList.contains('on')"))
        chk(f'mức {k}: 0 cảnh báo tràn', i['diags']==0, i)
    chk('Nhỏ ít trang hơn hoặc bằng To', res['s']['pages']<=res['l']['pages'], (res['s']['pages'],res['l']['pages']))
    chk('về Vừa thì xóa size khỏi dữ liệu', pg.evaluate("ws.size")==None)
    pg.click('[data-act=size][data-v=l]'); pg.wait_for_timeout(300)
    chk('To lưu ws.size=l', pg.evaluate("ws.size")=='l')
    pg.click('#undo'); pg.wait_for_timeout(300)
    chk('hoàn tác về Vừa', pg.evaluate("sizeKey()")=='m')
    # khứ hồi JSON, qua đường nạp thật
    pg.click('[data-act=size][data-v=s]'); pg.wait_for_timeout(300)
    js=pg.evaluate("JSON.stringify(ws)")
    chk('JSON có size s', json.loads(js).get('size')=='s')
    pg.click('[data-act=size][data-v=m]'); pg.wait_for_timeout(300)
    chk('đang Vừa trước khi nạp lại', pg.evaluate("sizeKey()")=='m')
    okload=pg.evaluate("loadSheet(JSON.parse(arguments[0]||'{}'),'t')", None) if False else pg.evaluate("(js)=>loadSheet(JSON.parse(js),'test')", js)
    pg.wait_for_timeout(500)
    chk('nạp lại phiếu: giữ Nhỏ', okload and pg.evaluate("ws.size")=='s' and pg.evaluate("fontPt()")==10, pg.evaluate("ws.size"))
    notes=pg.evaluate("(js)=>{const o=JSON.parse(js); o.size='xxl'; const n=[]; const w=fillSheet(o,n); return [w.size===undefined, n.join('|')]}", js)
    chk('size lạ bị bỏ và có ghi chú', notes[0] and 'cỡ chữ' in notes[1], notes)
    n2=pg.evaluate("(js)=>{const o=JSON.parse(js); o.size='m'; const n=[]; const w=fillSheet(o,n); return [w.size===undefined, n.join('|')]}", js)
    chk('size=m được dọn, không báo lỗi', n2[0] and n2[1]=='', n2)
    n3=pg.evaluate("(js)=>{const o=JSON.parse(js); o.size='l'; const n=[]; const w=fillSheet(o,n); return [w.size, n.join('|')]}", js)
    chk('size=l (To) được giữ', n3[0]=='l' and n3[1]=='', n3)
    # chiều cao thật đổi theo cỡ chữ
    H={}
    for k in 'lms':
        pg.evaluate(f"ws.size={'null' if k=='m' else repr(k)}; if(ws.size===null) delete ws.size; render()"); pg.wait_for_timeout(400)
        H[k]=pg.evaluate("Math.round(lastRes.pages.reduce((a,p)=>a+p.used,0))")
    chk('tổng chiều cao: To > Vừa > Nhỏ', H['l']>H['m']>H['s'], H)
    # đổi tuổi
    pg.evaluate("document.getElementById('age').value='5-6'; document.getElementById('age').dispatchEvent(new Event('change'))"); pg.wait_for_timeout(400)
    chk('5-6 + Nhỏ = 12 pt', pg.evaluate("fontPt()")==12)
    chk('0 lỗi console', not errs, errs)
    b.close()
print('ALL OK' if ok else 'SOME FAIL')
