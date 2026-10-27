# v102: nhãn lựa chọn A/B/C mặc định a. b. c. (không vòng tròn); vòng tròn chọn riêng
import sys
from playwright.sync_api import sync_playwright
ok=True
def chk(n,c,i=''):
    global ok; print(('PASS ' if c else 'FAIL ')+n, i); ok = ok and bool(c)
MD="# T\n\n## Task: CHOOSE\nDạng: chọn A/B/C\n\n1. Why? a. He b. She c. It\n2. Who? a. Tom b. Ann c. Bo\n\n## Task: CIRCLE\nDạng: chọn A/B/C (khoanh)\n\n1. Why? a. He b. She c. It\n2. Who? a. Tom b. Ann c. Bo\n"
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':1000}); errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'fonts' not in m.text else None); pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+sys.argv[1]); pg.wait_for_timeout(1300)
    pg.evaluate("md=>{openImport('sheet',null,md)}",MD); pg.wait_for_timeout(600)
    pg.click('#pasteOk'); pg.wait_for_timeout(600)
    try: pg.get_by_role('button',name='Thay phiếu hiện tại').click(timeout=3000)
    except Exception: pass
    pg.wait_for_timeout(1500)
    lab=lambda i: pg.evaluate(f"(()=>{{const t=document.querySelector('.task[data-task='+ws.tasks[{i}].id+']'); return [t.querySelectorAll('.opt > i').length, t.querySelectorAll('.opt > b:not(.bx)').length]}})()")
    chk('mặc định: nhãn a. b. c. (không vòng tròn)', lab(0)==[6,0], lab(0))
    chk('(khoanh): nhãn vòng tròn', lab(1)==[0,6], lab(1))
    chk('dữ liệu: mặc định không có lab, khoanh = circle', pg.evaluate("[ws.tasks[0].answer.params.lab||null, ws.tasks[1].answer.params.lab||null]")==[None,'circle'])
    pg.evaluate("sel={type:'task',id:ws.tasks[0].id}; renderInspector()"); pg.wait_for_timeout(300)
    chk('nút Nhãn: a. đang chọn', pg.evaluate("[...document.querySelectorAll('#insp .seg button.on, #tree .seg button.on')].some(b=>b.textContent.trim()==='a.' || b.textContent.trim()==='a. b. c.')"))
    md2=pg.evaluate("sheetToMd(ws)")
    chk('Xuất MD: khoanh ghi lại, mặc định không ghi', 'Dạng: chọn A/B/C (khoanh)' in md2 and 'Dạng: chọn A/B/C (khoanh)' not in md2.split('## Task: CHOOSE')[1].split('## Task')[0])
    J=pg.evaluate("md=>readMd(md).tasks.map(r=>r.t.answer.params.lab||null)",md2)
    chk('khứ hồi giữ nhãn', J==[None,'circle'], J)
    chk('0 tràn', pg.evaluate("lastRes.diags.length")==0)
    chk('0 lỗi console', not errs, errs)
print('ALL OK' if ok else 'SOME FAIL')
