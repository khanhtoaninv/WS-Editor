# v100: phiếu 7 (Unit 6 – Lesson 1): nhãn (a) không thêm số, bài đọc có chỗ trống không tạo dòng câu, Số câu: a b c, Đúng/Sai cùng hàng
import sys, json
from playwright.sync_api import sync_playwright
ok=True
def chk(n,c,i=''):
    global ok; print(('PASS ' if c else 'FAIL ')+n, i); ok = ok and bool(c)
MD=open('/home/claude/WS-Editor/tests/md/phieu7.md',encoding='utf8').read()
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':1000}); errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'fonts' not in m.text else None); pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+sys.argv[1]); pg.wait_for_timeout(1300)
    J=pg.evaluate("md=>{const J=readMd(md); return J.err?J:{n:J.tasks.map(r=>r.notes),t:J.tasks.map(r=>({list:r.t.content.list,items:(r.t.content.items||[]).length,nlab:r.t.layout.nlab,row:(r.t.answer.params||{}).row}))}}",MD)
    chk('MD đọc được, 4 Task, không ghi chú', 't' in J and len(J['t'])==4 and all(not x for x in J['n']), J)
    chk('Task 1: bài đọc có ___, không có dòng câu', J['t'][0]['list']==False and J['t'][0]['items']==0)
    chk('Task 2: Số câu a b c', J['t'][1]['nlab']=='a' and J['t'][1]['items']==8)
    chk('Task 4: T/F cùng hàng', J['t'][3]['row']==True)
    pg.evaluate("md=>{openImport('sheet',null,md)}",MD); pg.wait_for_timeout(600)
    pg.click('#pasteOk'); pg.wait_for_timeout(600)
    try: pg.get_by_role('button',name='Thay phiếu hiện tại').click(timeout=3000)
    except Exception: pass
    pg.wait_for_timeout(1500)
    chk('đã nạp 4 Task', pg.evaluate("ws.tasks.length")==4)
    g=pg.evaluate("[...document.querySelectorAll('.task[data-task=\"'+ws.tasks[0].id+'\"] .pgap')].map(x=>x.textContent)")
    chk('Task 1: 8 chỗ trống, không số (n) vì có nhãn (a)', len(g)==8 and all(x.strip()=='' for x in g), g)
    chk('Task 1: không có số câu ở lề', pg.evaluate("document.querySelectorAll('.task[data-task=\"'+ws.tasks[0].id+'\"] .ino').length")==0)
    n2=pg.evaluate("[...document.querySelectorAll('.task[data-task=\"'+ws.tasks[1].id+'\"] .ino')].map(x=>x.textContent).join('')")
    chk('Task 2: nhãn a–h', n2=='abcdefgh', n2)
    chk('Task 4: T/F cùng hàng (CSS)', pg.evaluate("""(()=>{const t=document.querySelector('.task[data-task="'+ws.tasks[3].id+'"]'); const q=t.querySelector('.qb'); const a=q.querySelector('.a6'), x=q.querySelector('.qt'); const ra=a.getBoundingClientRect(), rx=x.getBoundingClientRect(); return t.dataset.tfr==='1' && Math.abs((ra.top+ra.bottom)/2-(rx.top+rx.bottom)/2)<12 && ra.left>rx.left})()"""))
    chk('0 tràn', pg.evaluate("lastRes.diags.length")==0, pg.evaluate("lastRes.diags"))
    # xuất MD rồi nạp lại giữ đủ
    md2=pg.evaluate("sheetToMd(ws)")
    chk('Xuất MD có Số câu: a b c và (cùng hàng)', 'Số câu: a b c' in md2 and 'cùng hàng' in md2)
    J2=pg.evaluate("md=>{const J=readMd(md); return J.tasks.map(r=>[r.t.layout.nlab,(r.t.answer.params||{}).row,r.t.content.list])}",md2)
    chk('khứ hồi giữ nhãn, cùng hàng, danh sách tắt', J2[1][0]=='a' and J2[3][1]==True and J2[0][2]==False, J2)
    # giao diện
    pg.click('#tree .tnode[data-sel=task]:nth-of-type(4)') if False else None
    pg.evaluate("sel={type:'task',id:ws.tasks[3].id}; renderInspector()"); pg.wait_for_timeout(300)
    chk('Có nút Cùng hàng với câu', pg.locator('[data-act=tfrow][data-v="1"].on').count()+pg.locator('[data-eact=tfrow][data-v="1"].on').count()>=1)
    pg.locator('[data-act=tfrow][data-v="0"], [data-eact=tfrow][data-v="0"]').first.click(); pg.wait_for_timeout(400)
    chk('Bấm Dưới câu: bỏ cùng hàng', pg.evaluate("!ws.tasks[3].answer.params.row"))
    # phiếu cũ không đổi: nhãn có (n) khi không có nhãn trước
    k=pg.evaluate("passageHtml({content:{lead:{kind:'passage',text:'A ___ b ___ c.'}},layout:{}})")
    chk('chỗ trống không nhãn vẫn đánh (1) (2)', '(1)' in k and '(2)' in k, k)
    chk('0 lỗi console', not errs, errs)
    pg.screenshot(path='/home/claude/logs/v100_phieu7.png')
print('ALL OK' if ok else 'SOME FAIL')
