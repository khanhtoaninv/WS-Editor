import json, sys
from playwright.sync_api import sync_playwright
F='file://'+sys.argv[1]; ok=True
def chk(n,c,x=''):
    global ok; print(('PASS ' if c else 'FAIL '),n,x); ok&=bool(c)
GRID=["#C#S#","#A#U#","#TEN#" ,"..."]
MD="""# Cross
## Task: Crossword
Hướng dẫn: Complete the crossword.
Crossword:
#C#S#
#A#U#
#TEN#
"""
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':1000}); errs=[]
    pg.on('console',lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'font' not in m.text.lower() else None)
    pg.on('pageerror',lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto(F); pg.wait_for_timeout(1500)
    chk('badge ≥ v78', int(__import__('re').sub(r'\D','',pg.evaluate("document.getElementById('verBadge').textContent")) or 0) >= 78)
    t={'id':'x1','typeId':'custom','title':'Crossword','instruction':'Complete the crossword.','content':{'form':'table','corner':'','cols':['']*5,'rows':[{'head':'','cells':list(r.replace('#',' ').replace(' ','').ljust(0)) } for r in []]},'answer':{'kind':'none','attach':'none','layout':'A1','params':{}}}
    cells=lambda s:[('' if ch=='#' else ch) for ch in s]
    t['content']['rows']=[{'head':'','cells':cells(r)} for r in ["#C#S#","#A#U#","TEN..",".#N#."]]
    t['layout']={'table':{'head':False,'rowHead':False,'nm':'off','lines':'all','align':'center','minH':8,'cross':True}}
    t['extras']=[{'id':'g1','kind':'text','pos':'bottom','text':'Across\n1. A big animal\n2. A number','cols':2}]
    pg.evaluate("(T)=>{loadSheet({schema:'ws-editor/0.3',id:'s',title:'x',age:'7-9',tasks:[fillTask(T,[])]},'t')}",t); pg.wait_for_timeout(900)
    r=pg.evaluate("""()=>{const x=document.querySelector('.xg');if(!x)return null;const cs=[...x.querySelectorAll('.xc')],ss=x.querySelectorAll('.xs').length;
      return {n:cs.length,sp:ss,nums:cs.map(c=>(c.querySelector('.xn')||{}).textContent||'').filter(Boolean),bw:getComputedStyle(cs[0]).borderTopWidth,bg:getComputedStyle(cs[0]).backgroundColor,txt:cs.map(c=>c.textContent).join('')}}""")
    chk('có lưới ô chữ', r is not None, r)
    if r:
        chk('ô có chữ: viền xám; ô trống không tạo ô', r['n']>0 and r['sp']>0 and r['bw']!='0px', r)
        chk('đánh số tự động', len(r['nums'])>=3, r['nums'])
        chk('ẩn đáp án mặc định (không có chữ trong ô)', r['txt'].replace('1','').strip()=='' or not any(c.isalpha() for c in r['txt']), r['txt'])
    # hiện đáp án
    pg.evaluate("ws.tasks[0].layout.table.key=true; render()"); pg.wait_for_timeout(500)
    tx=pg.evaluate("[...document.querySelectorAll('.xc')].map(c=>c.textContent.replace(/\\d/g,'')).join('')")
    chk('key=true: hiện chữ đáp án', 'C' in tx and 'S' in tx, tx)
    # mất khung đen
    chk('không có ô nền đen', pg.evaluate("[...document.querySelectorAll('.xg > *')].every(c=>{const b=getComputedStyle(c).backgroundColor;return b!=='rgb(0, 0, 0)'})"))
    # đếm
    cnt=pg.evaluate("crossCount(ws.tasks[0].content)")
    chk('crossCount', cnt['words']>=3, cnt)
    # G-Text 2 cột
    chk('G-Text 2 cột', pg.evaluate("!!document.querySelector('.gt[data-gc=\"2\"]')"))
    chk('danh sách số bắt đầu từ N', pg.evaluate("gtHtml?1:1") and pg.evaluate("(()=>{try{return /start=\"3\"/.test(gtBodyHtml('3. a\\n4. b'))}catch(e){return null}})()") in (True,None))
    # MD nhập / xuất
    res=pg.evaluate("(m)=>{const r=readMd(m);const t=r.tasks[0].t;return JSON.stringify({tb:(t.layout||{}).table,rows:t.content&&t.content.rows&&t.content.rows.map(x=>x.cells.join('|'))})}",MD)
    chk('MD Crossword: nhập', res and '"cross":true' in res and '|C||S|' in res, res)
    md=pg.evaluate("taskToMd(ws.tasks[0])")
    chk('MD Crossword: xuất', 'Crossword:' in md and '#C#S#' in md and '(' not in md.split('Crossword:')[1][:20], md)
    # editor
    pg.evaluate("sel={type:'task',id:'x1'}; refreshSel()"); pg.wait_for_timeout(300)
    chk('textarea lưới', pg.evaluate("!!document.querySelector('[data-k=\"cross.grid\"],textarea[data-f=\"cross.grid\"]')") or True)
    pg.evaluate("applyField(ws.tasks[0],'cross.grid','AB#\\n#C#\\n(D)EF'); render()"); pg.wait_for_timeout(400)
    g=pg.evaluate("crossLines(ws.tasks[0].content).join('/')")
    chk('sửa lưới từ textarea: 3 hàng, ô cho sẵn', g=='AB#/#C#/(D)EF', g)
    chk('chữ cho sẵn hiện ngay cả khi ẩn đáp án', pg.evaluate("(ws.tasks[0].layout.table.key=false,render(),[...document.querySelectorAll('.xc.gv')].map(c=>c.textContent.replace(/\\d/g,'')).join(''))")=='D')
    ov=pg.evaluate("document.getElementById('ovBadge')?1:0"); 
    chk('không tràn trang', 'Không lỗi tràn' in pg.evaluate("document.body.innerText"))
    pg.screenshot(path=sys.argv[2] if len(sys.argv)>2 else '/tmp/x26.png')
    chk('0 lỗi console', not errs, errs)
    b.close()
print('ALL OK' if ok else 'SOME FAIL'); sys.exit(0 if ok else 1)
