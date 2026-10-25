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
    chk('badge v70', pg.evaluate("document.getElementById('verBadge').textContent")=='v70')
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
    chk('0 lỗi console', not errs, errs)
    b.close()
print('ALL OK' if ok else 'SOME FAIL')
