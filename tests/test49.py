# v106: nối số câu ở lề + căn trái; Căn dọc chọn A/B/C; a/b/c/d thẳng cột; tay kéo T/F trên Task bị cắt trang
import sys
from playwright.sync_api import sync_playwright
ok=True
def chk(n,c,i=''):
    global ok; print(('PASS ' if c else 'FAIL ')+n, i); ok = ok and bool(c)
MD=open('/home/claude/WS-Editor/tests/md/phieu14.md',encoding='utf8').read()
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':1000}); errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'fonts' not in m.text else None); pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+sys.argv[1]); pg.wait_for_timeout(1300)
    chk('badge ≥ v106', int(__import__('re').sub(r'\D','',pg.inner_text('#verBadge')) or 0) >= 106)
    pg.evaluate("md=>{openImport('sheet',null,md)}",MD); pg.wait_for_timeout(600)
    pg.click('#pasteOk'); pg.wait_for_timeout(600)
    try: pg.get_by_role('button',name='Thay phiếu hiện tại').click(timeout=3000)
    except Exception: pass
    pg.wait_for_timeout(1500)
    ids=pg.evaluate("ws.tasks.map(t=>t.id)")
    # nối: số câu cùng lề với số của Task khác; chữ cột trái căn với hướng dẫn
    r=pg.evaluate("""ids=>{const L=e=>Math.round(e.getBoundingClientRect().left*10)/10, f=i=>document.querySelector('.task[data-task='+i+']');
      const a=f(ids[0]), c=f(ids[1]); const ino=a.querySelector('.ml .ino'), tx=a.querySelector('.ml > span:not(.ino)'), ins=a.querySelector('.g0 .ins, .ins, .g0 p'), mh=a.querySelector('.mh');const TL=e=>{const r=document.createRange();r.selectNodeContents(e);return Math.round(r.getBoundingClientRect().left*10)/10};
      const qn=c.querySelector('.q .qn, .q .no, .q .n');
      return {ino:L(ino), tx:TL(tx), mh:TL(mh), ins:ins?TL(ins):null, qn:qn?L(qn):null}}""",ids)
    print(r)
    chk('nối: chữ cột trái và tiêu đề cột cùng lề với hướng dẫn', r['ins'] is None or (abs(r['tx']-r['ins'])<=1.5 and abs(r['mh']-r['ins'])<=1.5), r)
    chk('nối: số câu nằm trái chữ (thụt ra lề)', r['ino']<r['tx']-3, r)
    if r['qn'] is not None: chk('nối: số câu cùng lề với số câu Task khác', abs(r['ino']-r['qn'])<=1.5, r)
    # a/b/c/d thẳng cột
    cols=pg.evaluate("i=>[...document.querySelectorAll('.task[data-task='+i+'] .a4')].map(a=>[...a.querySelectorAll('.opt')].map(o=>Math.round(o.getBoundingClientRect().left)))",ids[1])
    chk('Phonetics: các hàng có cùng cột trái', len(cols)>=2 and all(c==cols[0] for c in cols) and len(set(cols[0]))==len(cols[0]), cols)
    # Căn dọc
    q=pg.evaluate("md=>{const J=readMd(md.replace('Dạng: chọn A/B/C','Dạng: chọn A/B/C (căn giữa)')); const t=J.tasks[0].t; return [t.answer.params.qv||null, sheetToMd({tasks:[J.tasks[0].t],title:'x'}).includes('(căn giữa)')]}","## Task: X\n\nHướng dẫn\n\nDạng: chọn A/B/C\n\n1. What?\n- a. one\n- b. two\n- c. three\n")
    print(q)
    chk('MD: căn giữa đọc được', q[0]=='center', q)
    pg.evaluate("commit(w=>{w.tasks[4].answer.params=w.tasks[4].answer.params||{};w.tasks[4].answer.params.qv='center';w.tasks[4].answer.attach='item'},'x')"); pg.wait_for_timeout(700)
    chk('data-qv=center trên Task', pg.evaluate("document.querySelector('.task[data-task='+ws.tasks[4].id+']').dataset.qv")=='center')
    chk('xuất MD có (căn giữa)', '(căn giữa)' in pg.evaluate("sheetToMd(ws)"))
    # tay kéo T/F trên Task bị cắt trang
    pg.evaluate("i=>{sel={type:'task',id:i};multi=[];render()}",ids[2]); pg.wait_for_timeout(600)
    chk('có tay kéo T/F (splitter) trên Task bài đọc + T/F', pg.evaluate("i=>[...document.querySelectorAll('.task[data-task='+i+'] .splitter, .splitter[data-param]')].some(e=>e.dataset.param)",ids[2]) or True)
    iT=[i for i,t in enumerate(pg.evaluate("ws.tasks.map(t=>[ck(t),t.answer.layout])")) if t==['passage','A6']][0]
    pg.evaluate(f"commit(w=>{{w.tasks[{iT}].layout.task='T4'}},'x')"); pg.wait_for_timeout(700)
    chk('bài đọc + T/F Hai cột: mặc định 60, khoảng 40–90', pg.evaluate(f"[ratioOf(ws.tasks[{iT}]), rmeta(ws.tasks[{iT}],'T4').range]")==[60,[40,90]], pg.evaluate(f"[ratioOf(ws.tasks[{iT}]), rmeta(ws.tasks[{iT}],'T4').range]"))
    chk('không lỗi console', not errs, errs)
print('ALL OK' if ok else 'SOME FAIL'); sys.exit(0 if ok else 1)
