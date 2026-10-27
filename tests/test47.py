# v104: xuống dòng trong ô bảng (<br> trong MD và ô soạn, mỗi dòng một dòng trên trang, xuất MD giữ <br>)
import sys
from playwright.sync_api import sync_playwright
ok=True
def chk(n,c,i=''):
    global ok; print(('PASS ' if c else 'FAIL ')+n, i); ok = ok and bool(c)
MD=open('/home/claude/WS-Editor/tests/md/phieu11.md',encoding='utf8').read()
OLD=open('/tmp/claude-0/p11/p11.md',encoding='utf8').read() if False else MD.replace('<br>','; ')
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':1000}); errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'fonts' not in m.text else None); pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+sys.argv[1]); pg.wait_for_timeout(1300)
    J=pg.evaluate("md=>{const J=readMd(md); return J.err?J:J.tasks[0].t.content.rows[0].cells[0]}",MD)
    chk('MD: ô có 6 dòng thật (\\n)', isinstance(J,str) and J.count('\n')==5, J)
    J2=pg.evaluate("md=>{const J=readMd(md); return J.tasks[0].t.content.rows[0].cells[0]}",OLD)
    chk('MD cũ (; -) giữ một dòng như trước', '\n' not in J2)
    pg.evaluate("md=>{openImport('sheet',null,md)}",MD); pg.wait_for_timeout(600)
    pg.click('#pasteOk'); pg.wait_for_timeout(600)
    try: pg.get_by_role('button',name='Thay phiếu hiện tại').click(timeout=3000)
    except Exception: pass
    pg.wait_for_timeout(1500)
    n=pg.evaluate("[...document.querySelectorAll('.tg .tml')].map(e=>e.children.length)")
    chk('trang: ô Features dòng mỗi ô: 6, 2, 8, 3', n==[6,2,8,3], n)
    plain=pg.evaluate("[...document.querySelectorAll('.tg .tc')].filter(e=>!e.querySelector('.tml')).length>0")
    chk('ô không xuống dòng không đổi', plain)
    md2=pg.evaluate("sheetToMd(ws)")
    chk('xuất MD: <br> trong ô, mỗi hàng bảng một dòng', md2.count('<br>')>=10 and len([l for l in md2.split('\n') if l.startswith('The Sand Hotel')])==1, md2.count('<br>'))
    rt=pg.evaluate("md=>JSON.stringify(readMd(md).tasks[0].t.content.rows)==JSON.stringify(readMd(md.replace(/^[\\s\\S]*?## Task/,'# x\\n\\n## Task')).tasks[0].t.content.rows)",md2)
    chk('xuất rồi nạp lại: cùng nội dung', rt)
    # ô soạn cột trái
    pg.click('#tree .tnode[data-sel=task]'); pg.wait_for_timeout(600)
    v=pg.evaluate("document.querySelector('#tree .etbl [data-k=\"tb.r.0.c.0\"]').value")
    chk('ô soạn hiện <br>', v.count('<br>')==5, v[:80])
    pg.fill('#tree .etbl [data-k="tb.r.0.c.0"]','- A<br>- B'); pg.keyboard.press('Tab'); pg.wait_for_timeout(600)
    c0=pg.evaluate("ws.tasks[0].content.rows[0].cells[0]")
    chk('gõ <br> trong ô soạn thành xuống dòng', c0=='- A\n- B', c0)
    chk('0 tràn', pg.evaluate("lastRes.diags.length")==0, pg.evaluate("lastRes.diags"))
    chk('không lỗi console', not errs, errs)
print('ALL OK' if ok else 'SOME FAIL'); sys.exit(0 if ok else 1)
