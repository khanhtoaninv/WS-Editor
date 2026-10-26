# Bước 1 (v57): bỏ dạng "Tranh" — Task chỉ có ảnh = Danh sách câu 0 câu + Ảnh chung; công tắc "Danh sách câu"
import sys, json
from playwright.sync_api import sync_playwright
ok=True
def chk(n,c,i=''):
    global ok; print(('PASS ' if c else 'FAIL ')+n, i); ok = ok and bool(c)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'fonts' not in m.text else None); pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+sys.argv[1]); pg.evaluate("localStorage.setItem('wsEditor.sections.v2', JSON.stringify({kind:true,info:true,content:true,parts:true}))"); pg.reload(); pg.wait_for_timeout(1300)
    T = lambda e: pg.evaluate(f"(()=>{{const t=ws.tasks.find(t=>t.id==='t10'); return {e} }})()")
    chk('dữ liệu: không còn lead picture, list=false, 0 câu', T("JSON.stringify(t.content)")=='{"form":"list","list":false,"items":[]}', T("JSON.stringify(t.content)"))
    chk('không Task nào còn chữ picture trong content', pg.evaluate("ws.tasks.every(t=>!JSON.stringify(t.content).includes('picture'))"))
    chk('ck = empty, bố cục T1', T("ck(t)+','+layoutOf(t)")=='empty,T1')
    h0 = pg.evaluate("Math.round(window.__ws.res.pages.flatMap(p=>p.items).find(x=>x.t.id==='t10').h)")
    pg.click('#tree .tnode[data-sel=task][data-id=t10]'); pg.wait_for_timeout(300)
    pg.evaluate("SECT.cfg=true;refreshSel()"); pg.wait_for_timeout(200)
    tg = pg.evaluate("fieldToggles(curT(ws)).filter(x=>['list','image'].includes(x.id)).map(x=>x.id+':'+x.on)")   # v85: bỏ công tắc khối ở cột trái, kiểm dữ liệu
    chk('khối Câu hỏi (tắt) + Ảnh chung', sorted(tg)==['image:true','list:false'], tg)
    chk('chip "chỉ có ảnh"', 'chỉ có ảnh' in pg.inner_text('#tree .tcwrap'))
    chk('G3 mờ (chưa có), có nút + Thêm, không có nút thêm câu', pg.locator('#tree .ed .sec.off[data-sec=g3] [data-eact=blkaddb][data-v=G3]').count()==1 and pg.locator('#tree .ed [data-eact=add]').count()==0)
    # bật danh sách câu
    pg.evaluate("(()=>{const id=document.querySelector('#tree .ed').dataset.ed,t=ws.tasks.find(y=>y.id===id),f=fieldToggles(t).find(x=>x.id==='list');commit(w=>toggleField(w.tasks.find(y=>y.id===id),'list',!f.on));})()"); pg.wait_for_timeout(300)
    chk('bật: hiện + Thêm câu', pg.locator('#tree .ed [data-eact=add]').count()==1)
    chk('bật với 0 câu: phiếu y hệt', pg.evaluate("Math.round(window.__ws.res.pages.flatMap(p=>p.items).find(x=>x.t.id==='t10').h)")==h0)
    pg.click('#tree .ed [data-eact=add]'); pg.wait_for_timeout(300)
    pg.fill('#tree .ed [data-k="it.0.text"]','What colour is the door?'); pg.evaluate('document.activeElement.blur()'); pg.wait_for_timeout(400)
    chk('thêm 1 câu: thành Câu hỏi có ảnh', T("ck(t)")=='questions', T("ck(t)"))
    lay = pg.evaluate("(()=>{const t=ws.tasks.find(t=>t.id==='t10'); const w=layoutReasons(t); return Object.keys(w).filter(k=>!w[k])})()")
    chk('mở các bố cục của Câu hỏi có ảnh (T1–T4)', lay==['T1','T2','T3','T4'], lay)
    qs = pg.eval_on_selector_all('#tree .ed .sec[data-sec=cfg] [data-eact=q]:not([disabled])','e=>e.map(x=>x.dataset.v)')
    chk('mở các dạng câu hỏi', 'Q2' in qs and 'Q3' in qs, qs)
    pg.click('#tree .ed .sec[data-sec=cfg] [data-eact=q][data-v=Q2]'); pg.wait_for_timeout(300)
    chk('đáp án viết câu', T("t.answer.kind+','+t.answer.layout")=='sentence,A1')
    chk('câu hiện trên phiếu', 'What colour is the door?' in pg.inner_text('.task[data-task=t10]'))
    # tắt danh sách: giữ câu + đáp án
    pg.evaluate("(()=>{const id=document.querySelector('#tree .ed').dataset.ed,t=ws.tasks.find(y=>y.id===id),f=fieldToggles(t).find(x=>x.id==='list');commit(w=>toggleField(w.tasks.find(y=>y.id===id),'list',!f.on));})()"); pg.wait_for_timeout(300)
    chk('tắt: câu biến khỏi phiếu, dữ liệu vẫn giữ', 'What colour' not in pg.inner_text('.task[data-task=t10]') and T("t.content.items.length")==1)
    chk('tắt: G3 báo đang giữ 1 câu', 'giữ 1 câu' in pg.inner_text('#tree .ed .sec[data-sec=g3] .secs'))
    chk('tắt: phiếu về như cũ', pg.evaluate("Math.round(window.__ws.res.pages.flatMap(p=>p.items).find(x=>x.t.id==='t10').h)")==h0)
    pg.evaluate("(()=>{const id=document.querySelector('#tree .ed').dataset.ed,t=ws.tasks.find(y=>y.id===id),f=fieldToggles(t).find(x=>x.id==='list');commit(w=>toggleField(w.tasks.find(y=>y.id===id),'list',!f.on));})()"); pg.wait_for_timeout(300)
    chk('bật lại: câu + đáp án quay lại', T("t.answer.kind")=='sentence' and 'What colour' in pg.inner_text('.task[data-task=t10]'))
    for _ in range(6): pg.click('#undo'); pg.wait_for_timeout(120)
    chk('hoàn tác về như ban đầu', T("JSON.stringify(t.content)")=='{"form":"list","list":false,"items":[]}', T("JSON.stringify(t.content)"))
    # tắt danh sách ở Task khác (bài đọc t7): câu hỏi ẩn, bài đọc còn
    pg.click('#tree .tnode[data-sel=task][data-id=t7]'); pg.wait_for_timeout(300)
    pg.evaluate("SECT.cfg=true;refreshSel()"); pg.wait_for_timeout(200)
    pg.evaluate("(()=>{const id=document.querySelector('#tree .ed').dataset.ed,t=ws.tasks.find(y=>y.id===id),f=fieldToggles(t).find(x=>x.id==='list');commit(w=>toggleField(w.tasks.find(y=>y.id===id),'list',!f.on));})()"); pg.wait_for_timeout(300)
    txt = pg.inner_text('.task[data-task=t7]')
    chk('bài đọc: tắt danh sách thì ẩn câu hỏi, giữ bài đọc', 'How old is Lucy' not in txt and 'My name is Lucy' in txt)
    pg.click('#undo'); pg.wait_for_timeout(300)
    # dữ liệu cũ dạng 0.3 có lead picture (bản v56) và 0.2 content.kind picture
    r = pg.evaluate("""(()=>{const a=migTask({id:'x',answer:{kind:'none',attach:'item',layout:null},image:{label:'a',size:'large'},content:{form:'list',lead:{kind:'picture'},items:[]},layout:{}});
      const b=migTask({id:'y',answer:{kind:'none',attach:'item',layout:null},image:{label:'a',size:'large'},content:{kind:'picture'},layout:{}});
      return [a.content,b.content,ck(a),ck(b)]})()""")
    chk('đọc dữ liệu cũ (0.3 lead picture, 0.2 kind picture)', r==[{'form':'list','list':False,'items':[]}]*2+['empty','empty'], r)
    # áp công thức Tranh + dán bài Listen and colour
    pg.evaluate("openPaste && 0") if False else None
    n0 = pg.evaluate("ws.tasks.length")
    pg.click('#tree [data-lib]'); pg.wait_for_timeout(300); pg.click('#libDlg [data-tab=src]'); pg.wait_for_timeout(200)
    pg.fill('#pasteTa','Listen and colour.\nListen to the teacher. Colour the picture.'); pg.wait_for_timeout(500)
    pg.click('#pasteOk'); pg.wait_for_timeout(500)
    nt = pg.evaluate("ws.tasks.find(t=>t.id===window.__ws.sel.id)") if pg.evaluate("ws.tasks.length")>n0 else None
    chk('dán "Listen and colour": thêm Task danh sách tắt, 0 câu', nt and nt['content'].get('list') is False and nt['content']['items']==[] and 'lead' not in nt['content'], nt and nt['content'])
    chk('cuối: 0 lỗi tràn', pg.inner_text('#diagBadge')=='Không lỗi tràn')
    print('ERRS',errs); print('ALL OK' if ok and not errs else 'SOME FAIL')
