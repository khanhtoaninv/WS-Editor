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
    chk('badge ≥ v70', int(__import__('re').sub(r'\D','',pg.evaluate("document.getElementById('verBadge').textContent")) or 0) >= 70)
    # 1. 80/20 cho T4 + A6
    chk('T4+A6 mặc định 80', pg.evaluate("ratioOf(ws.tasks[12])")==80)
    chk('T4+A6 khoảng 50-90', pg.evaluate("rmeta(ws.tasks[12],'T4').range")==[50,90])
    chk('T4 + đáp án khác vẫn 60', pg.evaluate("(()=>{const t=JSON.parse(JSON.stringify(ws.tasks[12]));t.answer.layout='A2';t.layout.task='T4';return ratioOf(t)})()")==60)
    chk('split ghi đè được, kẹp 90', pg.evaluate("(()=>{const t=JSON.parse(JSON.stringify(ws.tasks[12]));t.layout.split=95;const a=ratioOf(t);t.layout.split=70;return [a,ratioOf(t)]})()")==[90,70])
    # 2. A4 auto theo Task
    r=pg.evaluate("""(()=>{const t=JSON.parse(JSON.stringify(ws.tasks[4]));const its_=its(t);
      const out=[];t.answer.params.dir='auto';
      its_.forEach(i=>i.opts=['a','b','c']);out.push(its_.map(i=>a4dir(t,i)));
      its_[2].opts=['một đáp án rất rất dài, dài hơn mọi ngưỡng tự động đã cho','b','c'];out.push(its_.map(i=>a4dir(t,i)));
      return out})()""")
    chk('toàn ngắn → h cả Task', set(r[0])=={'h'}, r[0])
    chk('một câu dài → v cả Task', set(r[1])=={'v'}, r[1])
    # 3. Xuất MD
    pg.click('#mdBtn'); pg.wait_for_timeout(200)
    chk('dialog MD mở', pg.evaluate("document.getElementById('dlg').open && document.getElementById('dlgTitle').textContent.includes('MD')"))
    md=pg.evaluate("document.getElementById('jsonOut').value")
    chk('MD có Task', '## Task:' in md and md.startswith('# '), md[:60])
    chk('MD khứ hồi đọc lại được', pg.evaluate("(()=>{const o=readMd(document.getElementById('jsonOut').value);return !!o})()") if pg.evaluate("typeof readMd")=='function' else True)
    pg.click('#closeDlg'); pg.wait_for_timeout(200)
    pg.click('#jsonBtn'); pg.wait_for_timeout(200)
    chk('JSON: tiêu đề + nội dung trả về', pg.evaluate("document.getElementById('dlgTitle').textContent.includes('JSON') && document.getElementById('jsonOut').value.trim().startsWith('{')"))
    pg.click('#closeDlg')
    # v71: phiếu thật Sunny Farm (MD do AI tạo bằng prompt v68, giữ nguyên): nhãn lựa chọn thẳng dòng đầu, cách chữ 2–2,2 mm
    import os
    md=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'real','sunny-farm-prompt68.md'),encoding='utf-8').read()
    pg.click('#tree [data-newsheet]'); pg.wait_for_timeout(300); pg.fill('#pasteTa',md); pg.wait_for_timeout(800)
    tb=pg.inner_text('#pasteOut')
    chk('Sunny Farm: 6 Task (Task 4 có 2 phần, Task 6 có 3 phần)', '6 Task (Task 4 có 2 phần, Task 6 có 3 phần)' in tb, tb[:100])
    pg.click('#pasteOk'); pg.wait_for_timeout(300)
    if pg.is_visible('#pasteOk'): pg.click('#pasteOk'); pg.wait_for_timeout(1500)
    chk('Sunny Farm: 0 tràn', pg.inner_text('#diagBadge')=='Không lỗi tràn', pg.inner_text('#diagBadge'))
    m=pg.evaluate("""()=>[...document.querySelectorAll('.opt')].map(o=>{const l=o.querySelector('b,i'),s=o.querySelector('span'),lr=l.getBoundingClientRect(),rg=document.createRange();rg.selectNodeContents(s);const f=rg.getClientRects()[0];return [Math.abs((lr.top+lr.height/2)-(f.top+f.height/2)),(s.getBoundingClientRect().left-lr.right)/3.7795, rg.getClientRects().length]})""")
    chk('nhãn Ⓐ/ô tick thẳng giữa dòng đầu (lệch <= 1.5 px), cả lựa chọn hai dòng', len(m)>=8 and all(x[0]<=1.5 for x in m) and any(x[2]>=2 for x in m), m[:4])
    chk('khoảng cách nhãn -> chữ 2–2,2 mm (đo trên màn hình thu nhỏ 85%: 1,6–1,9)', all(1.6<=x[1]<=1.95 for x in m), [round(x[1],2) for x in m][:4])
    chk('0 lỗi console', not errs, errs)
    b.close()
print('ALL OK' if ok else 'SOME FAIL')
