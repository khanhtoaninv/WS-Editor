# v101: điền từ vào đoạn văn bằng câu hỏi Q1 (không dòng kẻ thừa, nhãn (a) giữ trong câu, đáp án từng chỗ trống), ô câu nhiều dòng, T/F căn dọc + cách lề phải
import sys, json
from playwright.sync_api import sync_playwright
ok=True
def chk(n,c,i=''):
    global ok; print(('PASS ' if c else 'FAIL ')+n, i); ok = ok and bool(c)
R='/home/claude/WS-Editor/tests/'
MD=open(R+'md/phieu7.md',encoding='utf8').read(); OLD=open(R+'md/phieu7-bai-doc-co-cho-trong.md',encoding='utf8').read(); AI=open(R+'real/phieu7-ai-v99.md',encoding='utf8').read()
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':1000}); errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'fonts' not in m.text else None); pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+sys.argv[1]); pg.wait_for_timeout(1300)
    J=pg.evaluate("md=>{const J=readMd(md); return J.err?J:{n:J.tasks.map(r=>r.notes),t:J.tasks.map(r=>({items:(r.t.content.items||[]).map(x=>x.text),att:r.t.answer.attach,num:r.t.layout.num,lead:(r.t.content.lead||{}).text,list:r.t.content.list}))}}",MD)
    chk('MD mới: 4 Task, không ghi chú', 't' in J and len(J['t'])==4 and all(not x for x in J['n']), J.get('n'))
    t0=J['t'][0]
    chk('Task 1: bài đọc chỉ có tiêu đề', t0['lead']=='**THE GOLDEN CHIEFS OF PANAMA**', t0['lead'])
    chk('Task 1: 3 câu, đủ nhãn (a)…(h), không bị cắt', len(t0['items'])==3 and all(('(a)' in t0['items'][0], '(e)' in t0['items'][0], '(f)' in t0['items'][1], '(h)' in t0['items'][2])), [x[:30] for x in t0['items']])
    chk('Task 1: chỗ trống là chỗ trả lời (inline), số câu ẩn', t0['att']=='inline' and t0['num']=='off', (t0['att'],t0['num']))
    # "(a) ___ (b) ___" không phải lựa chọn; "a. ___ nghĩa" không phải lựa chọn
    S=pg.evaluate("()=>[splitOptsLine('Many (a) ___ and (b) ___ were (c) ___.'), splitOptsLine('Why? a. He b. She')]")
    chk('splitOptsLine: nhãn chỗ trống không thành lựa chọn', S[0] is None and S[1] is not None, S)
    A=pg.evaluate("md=>{const J=readMd(md); return J.tasks[1].t.content.items.length}",AI)
    chk('MD AI cũ: "a. ___ nghĩa" thành 8 câu (không dồn vào câu 1)', A==8, A)
    O=pg.evaluate("md=>readMd(md).tasks[0].notes.join('|')",OLD)
    chk('Phiếu cũ (___ trong bài đọc) vẫn đọc được, ghi chú nên chuyển', 'nên chuyển thành câu hỏi' in O, O)
    pg.evaluate("md=>{openImport('sheet',null,md)}",MD); pg.wait_for_timeout(600)
    pg.click('#pasteOk'); pg.wait_for_timeout(600)
    try: pg.get_by_role('button',name='Thay phiếu hiện tại').click(timeout=3000)
    except Exception: pass
    pg.wait_for_timeout(1500)
    id1=pg.evaluate("ws.tasks[0].id")
    n_gap=pg.evaluate(f"document.querySelectorAll('.task[data-task={id1}] .q .qt .a2, .task[data-task={id1}] .q .qt .fl').length")
    n_tail=pg.evaluate(f"document.querySelectorAll('.task[data-task={id1}] .qb > .a2').length")
    chk('Trang: 8 chỗ trống trong chữ, không dòng kẻ sau câu', n_gap==8 and n_tail==0, (n_gap,n_tail))
    chk('Trang: không số câu ở lề', pg.evaluate(f"document.querySelectorAll('.task[data-task={id1}] .q .ino').length")==0 or pg.evaluate(f"[...document.querySelectorAll('.task[data-task={id1}] .q .ino')].every(x=>getComputedStyle(x).visibility==='hidden'||x.offsetWidth===0)"))
    chk('0 tràn', pg.evaluate("lastRes.diags.length")==0, pg.evaluate("lastRes.diags"))
    # cột trái: ô câu nhiều dòng + đáp án từng chỗ trống mang nhãn (a)
    pg.click('#tree .tnode[data-sel=task]'); pg.wait_for_timeout(600)
    tas=pg.evaluate("[...document.querySelectorAll('#tree .eit')].map(e=>e.querySelector('textarea')?1:0)")
    chk('cột trái: ô câu là ô nhiều dòng', tas==[1,1,1], tas)
    labs=pg.evaluate("[...document.querySelectorAll('#tree .eit')][0] && [...[...document.querySelectorAll('#tree .eit')][0].querySelectorAll('.kgap .kg i')].map(i=>i.textContent)")
    chk('đáp án từng chỗ trống mang nhãn (a)…(e)', labs==['(a)','(b)','(c)','(d)','(e)'], labs)
    pg.locator('#tree .eit').first.locator('textarea').first.fill('Para one (a) ___ end.\n\nPara two (b) ___ end.'); pg.locator('#tree .eit').first.locator('textarea').first.press('Tab'); pg.wait_for_timeout(500)
    chk('gõ dòng trống: câu giữ xuống dòng', pg.evaluate("ws.tasks[0].content.items[0].text")=='Para one (a) ___ end.\n\nPara two (b) ___ end.', pg.evaluate("ws.tasks[0].content.items[0].text"))
    pg.screenshot(path='/home/claude/logs/v101_task1.png')
    # T/F
    t4=pg.evaluate("ws.tasks[3].id")
    pg.evaluate("sel={type:'group',id:ws.tasks[3].id,g:'G3',item:null}; renderInspector()"); pg.wait_for_timeout(400)
    chk('Task 4: có nút Căn dọc và ô T/F cách lề phải', pg.locator('[data-p=rowv]').count()>=3 and pg.locator('[data-pv=tfx]').count()==1)
    cen=lambda: pg.evaluate("""(()=>{const t=document.querySelector('.task[data-tfr]'); const q=t.querySelector('.q'); const a=q.querySelector('.a6').getBoundingClientRect(), n=q.querySelector('.ino').getBoundingClientRect(), x=q.querySelector('.qt').getBoundingClientRect(); return [Math.round(n.top-a.top), Math.round(n.bottom-a.bottom), Math.round(x.top-a.top)]})()""")
    for v in ('top','bottom','center'):
        pg.locator(f'[data-p=rowv][data-v={v}]').first.click(); pg.wait_for_timeout(400)
        chk(f'Căn dọc {v}: dataset', pg.evaluate("document.querySelector('.task[data-tfr]').dataset.tfv")==v)
    x0=pg.evaluate("document.querySelector('.task[data-tfr] .a6').getBoundingClientRect().right")
    pg.locator('[data-pv=tfx]').first.fill('40'); pg.locator('[data-pv=tfx]').first.press('Tab'); pg.wait_for_timeout(400)
    x1=pg.evaluate("document.querySelector('.task[data-tfr] .a6').getBoundingClientRect().right")
    chk('T/F cách lề phải 40 mm: ô T/F dịch trái', x0-x1>100, (x0,x1))
    chk('0 lỗi console', not errs, errs)
    pg.evaluate("document.querySelector('.task[data-tfr]').scrollIntoView()"); pg.screenshot(path='/home/claude/logs/v101_tf.png')
print('ALL OK' if ok else 'SOME FAIL')
