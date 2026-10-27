# v105: Phiếu 14 — Dạng: nối luôn tách cặp, vế thừa "- F. ...", Tiêu đề cột, Chỗ nối: ô viết chữ; bài đọc + T/F tự xếp dọc, Hai cột chọn được
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
    S=pg.evaluate("md=>{const J=readMd(md); if(J.err) return J; const t=J.tasks[0].t; return {n:J.tasks[0].notes, items:t.content.items.map(x=>x.pair), heads:t.content.heads, mid:t.answer.params.mid, sh:!!t.content.shuffle}}",MD)
    chk('Dạng: nối tách cặp dù hướng dẫn không có chữ match', S['items'][0]['l']['text']=='coach station' and S['items'][0]['r']['text']=='A. too small', S['items'][0])
    chk('vế thừa F G H: có vế phải, không vế trái', all('l' not in x or not x['l'] for x in S['items'][5:]) and [x['r']['text'] for x in S['items'][5:]]==['F. very cold','G. crowded','H. boring'], S['items'][5:])
    chk('tiêu đề cột và chỗ nối', S['heads']==['PLACES','PROBLEMS'] and S['mid']=='box' and not S['sh'], (S['heads'],S['mid']))
    chk('không ghi chú lạ', not S['n'], S['n'])
    pg.evaluate("md=>{openImport('sheet',null,md)}",MD); pg.wait_for_timeout(600)
    pg.click('#pasteOk'); pg.wait_for_timeout(600)
    try: pg.get_by_role('button',name='Thay phiếu hiện tại').click(timeout=3000)
    except Exception: pass
    pg.wait_for_timeout(1500)
    ids=pg.evaluate("ws.tasks.map(t=>t.id)")
    r=pg.evaluate("i=>{const q=s=>[...document.querySelectorAll('.task[data-task='+i+'] '+s)]; return {h:q('.mh').map(e=>e.textContent), box:q('.mbx').length, dots:q('.md .a7').length+q('.md .a').length-q('.mbx').length, ml:q('.ml .ino').map(e=>e.textContent).join(','), mr:q('.mr span').map(e=>e.textContent).length}}",ids[0])
    chk('trang: hai tiêu đề cột', r['h']==['PLACES','PROBLEMS'], r['h'])
    chk('trang: 5 ô viết chữ, không chấm, số 1..5 ở vế trái, 8 vế phải', r['box']==5 and r['dots']==0 and r['ml']=='1,2,3,4,5' and r['mr']==8, r)
    md2=pg.evaluate("sheetToMd(ws)")
    chk('xuất MD: tiêu đề cột, chỗ nối, vế thừa', 'Tiêu đề cột: PLACES | PROBLEMS' in md2 and 'Chỗ nối: ô viết chữ' in md2 and '6. - F. very cold' in md2, '')
    rt=pg.evaluate("md=>JSON.stringify(readMd(md).tasks[0].t.content)==JSON.stringify(ws.tasks[0].content)",md2)
    chk('xuất rồi nạp lại: cùng nội dung', rt)
    # Task bài đọc + T/F
    k=pg.evaluate("[layoutOf(ws.tasks[2]), layoutOf(ws.tasks[3]), ws.tasks.map(t=>ck(t)).join()]"); print(k)
    iT=[i for i,t in enumerate(pg.evaluate("ws.tasks.map(t=>[ck(t),t.answer.layout])")) if t==['passage','A6']][0]
    chk('bài đọc + T/F tự xếp dọc (T6)', pg.evaluate(f"layoutOf(ws.tasks[{iT}])")=='T6')
    g=pg.evaluate("i=>{const q=s=>[...document.querySelectorAll('.task[data-task='+i+'] '+s)], ps=q('.g2 p'), a=q('.a6'); return [Math.max(...ps.map(e=>e.getBoundingClientRect().bottom+scrollY)), Math.min(...a.map(e=>e.getBoundingClientRect().top+scrollY))]}",ids[iT])
    chk('G2 nằm trên câu hỏi (G3)', g[0] <= g[1]+1, g)
    pg.evaluate(f"commit(w=>{{w.tasks[{iT}].layout.task='T4'}},'x')"); pg.wait_for_timeout(700)
    chk('Hai cột chọn được cho bài đọc + T/F', pg.evaluate(f"layoutOf(ws.tasks[{iT}])")=='T4')
    g=pg.evaluate("i=>{const q=s=>[...document.querySelectorAll('.task[data-task='+i+'] '+s)], ps=q('.g2 p'), a=q('.a6'); return [Math.max(...ps.map(e=>e.getBoundingClientRect().right)), Math.min(...a.map(e=>e.getBoundingClientRect().left))]}",ids[iT])
    chk('Hai cột: câu hỏi bên phải bài đọc', g[1] >= g[0]-2, g)
    chk('Hai cột: tỉ lệ mặc định 60/40', pg.evaluate(f"ratioOf(ws.tasks[{iT}])")==60)
    chk('0 tràn', pg.evaluate("lastRes.diags.length")==0, pg.evaluate("lastRes.diags"))
    chk('không lỗi console', not errs, errs)
print('ALL OK' if ok else 'SOME FAIL'); sys.exit(0 if ok else 1)
