# v79: câu nhiều dòng (dòng thụt lề trong MD) ở Task không ảnh — trước đây lỗi "Cannot read properties of undefined (reading 'includes')"
# Dữ liệu thật: tests/real/nhieu-dong-user.md (MD người dùng nhập, giữ nguyên)
import json, sys, os
from playwright.sync_api import sync_playwright
F = 'file://' + sys.argv[1]; ok = True
HERE = os.path.dirname(os.path.abspath(__file__))
MD = open(os.path.join(HERE, 'real', 'nhieu-dong-user.md'), encoding='utf-8').read()
def chk(n, c, x=''):
    global ok; print(('PASS ' if c else 'FAIL '), n, x); ok &= bool(c)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 1000}); errs = []
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_' not in m.text and 'font' not in m.text.lower() else None)
    pg.goto(F); pg.wait_for_timeout(1200)
    chk('badge ≥ v79', int(__import__('re').sub(r'\D','',pg.evaluate("document.getElementById('verBadge').textContent")) or 0) >= 79)
    r = pg.evaluate("(m)=>{const o=readMd(m);return o.tasks.map(x=>x.err?{err:x.err}:{items:its(x.t).map(i=>({text:i.text,lines:i.lines||null,opts:i.opts||null})),kind:x.t.answer.kind,A:x.t.answer.layout,att:x.t.answer.attach})}", MD)
    chk('2 Task, không lỗi', len(r) == 2 and all('err' not in x for x in r), r)
    if len(r) == 2 and 'err' not in r[0] and 'err' not in r[1]:
        t8, t9 = r
        chk('Task 8: 2 câu, 4 lựa chọn mỗi câu', len(t8['items']) == 2 and all(len(i['opts'] or []) == 4 for i in t8['items']), t8['items'])
        chk('Task 8: dòng thụt lề là xuống dòng trong câu (không thành ô nhiều dòng)', all('\n' in (i['text'] or '') and i['lines'] is None for i in t8['items']))
        chk('Task 8: khoanh A4 theo câu', t8['kind'] == 'choice' and t8['A'] == 'A4' and t8['att'] == 'item', t8)
        chk('Task 9: 5 câu, chỗ trống ở dòng thứ hai', len(t9['items']) == 5 and all(i['text'].split('\n')[1].count('___') == 1 for i in t9['items']), t9['items'])
        chk('Task 9: điền chỗ trống trong câu', t9['kind'] == 'word' and t9['A'] == 'A2' and t9['att'] == 'inline', t9)
    # nhập qua hộp + Task
    pg.evaluate("commit(w=>{w.tasks=[]})"); pg.wait_for_timeout(300)
    pg.click('#tree [data-lib]'); pg.click('#libDlg [data-tab=src]'); pg.wait_for_timeout(300)
    pg.fill('#libDlg textarea', MD); pg.wait_for_timeout(1200)
    chk('bảng nhận diện không báo lỗi', 'Cannot read' not in pg.inner_text('#libDlg') and 'Task 8:' not in pg.inner_text('#libDlg'))
    pg.locator('#libDlg button', has_text='Thêm').last.click(); pg.wait_for_timeout(1000)
    chk('nhập được 2 Task', pg.evaluate("ws.tasks.length") == 2)
    chk('0 tràn', 'Không lỗi tràn' in pg.inner_text('#diagBadge'), pg.inner_text('#diagBadge'))
    chk('không cảnh báo nội dung', pg.evaluate("ws.tasks.every(t=>!contentWarnings(t).length)"))
    br = pg.evaluate("[...document.querySelectorAll('.page .task')].map(e=>e.querySelectorAll('.qt br, .qt .brk').length)")
    chk('trang có xuống dòng: Task 8 ≥ 2, Task 9 = 5', len(br) >= 2 and br[0] >= 2 and br[1] == 5, br)
    # chỗ trống cuối câu (Task 9) vẫn kéo dài: dòng thứ hai nằm dưới dòng thứ nhất
    pos = pg.evaluate("""(()=>{const q=document.querySelectorAll('.page .task')[1].querySelector('.qt');const w=[...q.querySelectorAll('.w')];
      const f=w.find(x=>x.textContent==='used'), a=w[0];return f&&a?[a.getBoundingClientRect().top,f.getBoundingClientRect().top,!!q.querySelector('.fl')]:null})()""")
    chk('Task 9: "He used to" xuống dòng mới, gạch kéo dài', pos and pos[1] > pos[0] + 5 and pos[2], pos)
    # cột trái: ô nhập nhiều dòng giữ xuống dòng
    pg.evaluate("openTask=ws.tasks[1].id; sel={type:'task',id:ws.tasks[1].id}; refreshSel()"); pg.wait_for_timeout(500)
    ta = pg.evaluate("(()=>{const e=document.querySelector('#tree [data-k=\"it.0.text\"]');return e?[e.tagName,e.value]:null})()")
    chk('cột trái: câu nhiều dòng là ô nhiều dòng', ta and ta[0] == 'TEXTAREA' and '\n' in ta[1], ta)
    if ta and ta[0] == 'TEXTAREA':
        pg.fill('#tree [data-k="it.0.text"]', 'Line one.\nLine two ___ .'); pg.locator('#tree [data-k="it.0.text"]').blur(); pg.wait_for_timeout(500)
        chk('sửa ở cột trái giữ xuống dòng', pg.evaluate("ws.tasks[1].content.items[0].text") == 'Line one.\nLine two ___ .', pg.evaluate("ws.tasks[1].content.items[0].text"))
        pg.click('#undo'); pg.wait_for_timeout(300)
    # khứ hồi MD và JSON
    md = pg.evaluate("sheetToMd(ws)")
    rt = pg.evaluate("(m)=>readMd(m).tasks.map(x=>x.err||its(x.t).map(i=>i.text))", md)
    chk('khứ hồi MD giữ câu nhiều dòng', rt == [[i['text'] for i in r[0]['items']], [i['text'] for i in r[1]['items']]], rt)
    js = pg.evaluate("JSON.stringify(ws)"); pg.evaluate("(js)=>loadSheet(JSON.parse(js),'t')", js); pg.wait_for_timeout(500)
    chk('khứ hồi JSON', pg.evaluate("ws.tasks[1].content.items[1].text") == 'She hasn’t been to Paris before.\nThis is the ___ ?')
    # câu có ảnh: dòng thụt lề vẫn là ô nhiều dòng (như v65)
    r2 = pg.evaluate("""()=>{const o=readMd('## Task: Read\\n1. [ảnh: rainy] It’s {windy|rainy}.\\n   {Take|Put} your raincoat {on|off}.');return o.tasks[0].err||its(o.tasks[0].t)[0]}""")
    chk('câu có ảnh: vẫn là ô nhiều dòng', isinstance(r2, dict) and r2.get('lines') and len(r2['lines']) == 2 and 'text' not in r2, r2)
    # Task trống chữ câu không làm hỏng (chỗ chọn cách gắn đáp án)
    e = pg.evaluate("(()=>{try{const t=fillTask({id:'z',title:'x',instruction:'',content:{form:'list',items:[{id:'a',lines:['x ___']},{id:'b',text:'y ___'}]},answer:{kind:'word',attach:'inline',layout:'A2'}},[]);attachOpts(t);return 'ok'}catch(e){return String(e)}})()")
    chk('câu không có chữ: không lỗi', e == 'ok', e)
    pg.screenshot(path='/tmp/test27.png')
    print('ERRS', errs); chk('0 lỗi console', not errs, errs)
    b.close()
print('ALL OK' if ok else 'SOME FAIL')
