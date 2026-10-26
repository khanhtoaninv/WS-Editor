import json, sys
from playwright.sync_api import sync_playwright
F='file://'+sys.argv[1]; ok=True
def chk(n,c,x=''):
    global ok; print(('PASS ' if c else 'FAIL '),n,x); ok&=bool(c)
def task(id,title,opts_list,lab='box'):
    return {'id':id,'title':title,'instruction':'Tick one.','content':{'form':'list','items':[{'text':'Q%d'%i,'opts':o} for i,o in enumerate(opts_list)]},'answer':{'kind':'choice','attach':'item','layout':'A4','params':{'lab':lab}}}
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':1000}); errs=[]
    pg.on('console',lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'font' not in m.text.lower() else None)
    pg.on('pageerror',lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto(F); pg.wait_for_timeout(1500)
    # --- mặc định theo cấu hình ---
    r=pg.evaluate("""()=>{const A=fillTask({id:'a',typeId:'custom',title:'A',instruction:'',content:{form:'list',items:[{text:'x ___'}]},answer:{kind:'word',attach:'inline',layout:'A2',params:{}}},[]);
      const B=fillTask({id:'b',typeId:'custom',title:'B',instruction:'',content:{form:'list',items:[{text:'q',opts:['a','b']}]},answer:{kind:'choice',attach:'item',layout:'A4',params:{}}},[]);
      const C=fillTask({id:'c',typeId:'custom',title:'C',instruction:'',content:{form:'list',items:[{text:'y ___'}]},answer:{kind:'word',attach:'inline',layout:'A2',params:{}}},[]);
      return [presetKey(A),presetKey(B),presetKey(C)]}""")
    chk('Task custom khác cấu hình: khóa khác nhau', r[0]!=r[1] and r[0]==r[2], r)
    chk('dạng có sẵn vẫn theo typeId', pg.evaluate("presetKey(ws.tasks[0])")==pg.evaluate("ws.tasks[0].typeId"))
    pg.evaluate("localStorage.removeItem(PKEY); presetMem={}")
    pg.evaluate("""()=>{const mk3=id=>fillTask({id,typeId:'custom',title:id,instruction:'',content:{form:'list',items:[{text:'q'}]},answer:{kind:'sentence',attach:'item',layout:'A1',params:{lines:1}}},[]);const mk=(id,lay)=>fillTask({id,typeId:'custom',title:id,instruction:'',content:{form:'list',items:[{text:'q',opts:['a','b']}]},answer:{kind:'choice',attach:'item',layout:lay,params:{}}},[]);
      loadSheet({schema:'ws-editor/0.3',id:'s',title:'x',age:'7-9',tasks:[mk('t1','A4'),mk('t2','A4'),mk3('t3')]},'t')}"""); pg.wait_for_timeout(700)
    pg.evaluate("sel={type:'task',id:'t1'}; refreshSel()"); pg.wait_for_timeout(200)
    pg.evaluate("ws.tasks[0].layout.cols=1; extraActs['preset-save']()")
    k=pg.evaluate("Object.keys(presetsGet())")
    chk('lưu mặc định: khóa theo cấu hình', len(k)==1 and k[0].startswith('custom|'), k)
    chk('mặc định lưu kèm tên', pg.evaluate("Object.values(presetsGet())[0].name")!='' )
    n=pg.evaluate("(()=>{const w=clone(ws);w.tasks[0].layout.cols=null;w.tasks.forEach(t=>t.layout.cols=null);return applyPresets(w)})()")
    chk('chỉ áp cho Task cùng cấu hình (2 trên 3)', n==2, n)
    pg.evaluate("localStorage.removeItem(PKEY); presetMem={}")
    # --- A4 tự động ---
    pg.evaluate("""(T)=>{loadSheet({schema:'ws-editor/0.3',id:'s',title:'x',age:'7-9',tasks:T},'t')}""",[
        task('a1','short3',[['red','blue','green'],['cat','dog','pig']]),
        task('a2','four16',[['farm animals','a football match','a long walk','the school'],['farm animals','a football match','a long walk','the school']]),
        task('a3','long',[['She was happy that Max helped her.','She did not like cheese.','She wanted to go home.']]*2)]); pg.wait_for_timeout(800)
    cls=pg.evaluate("[...document.querySelectorAll('.task')].map(t=>t.querySelector('.a4').className.replace('a a4 ',''))")
    chk('3 từ ngắn → Ngang; 4 cụm vừa → Tự xuống dòng; câu dài → Dọc', cls[0].strip()=='h' and cls[1].strip()=='fl' and cls[2].strip()=='v', cls)
    # không gãy chữ trong ô ở Tự xuống dòng
    br=pg.evaluate("""(()=>{const t=document.querySelectorAll('.task')[1];return [...t.querySelectorAll('.opt > span')].every(s=>s.getBoundingClientRect().height<28)})()""")
    chk('ô tick 4 lựa chọn: mỗi lựa chọn một dòng chữ', br)
    pg.locator('.task').nth(1).screenshot(path='/tmp/claude-0/-home-claude/73331d6b-745e-5c34-86b9-740fbb545e58/scratchpad/fl.png')
    # --- ẩn số câu ---
    pg.evaluate("""()=>{const t=fillTask({id:'o1',title:'Put in order',instruction:'Write 1-4.',content:{form:'list',items:[{text:'___ The kids went home.'},{text:'___ The class fed the goats.'},{text:'___ Max shared.'},{text:'___ They drew pictures.'}]},answer:{kind:'word',attach:'inline',layout:'A2',params:{}}},[]);
      loadSheet({schema:'ws-editor/0.3',id:'s',title:'x',age:'7-9',tasks:[t]},'t')}"""); pg.wait_for_timeout(600)
    pg.evaluate("sel={type:'task',id:'o1'}; refreshSel()"); pg.wait_for_timeout(300)
    chk('có nút Số câu ở lề', pg.evaluate("!!document.querySelector('#insp [data-p=\"@num\"]')"))
    vis0=pg.evaluate("getComputedStyle(document.querySelector('.page .ino')).visibility")
    pg.click('#insp [data-p="@num"][data-v=off]'); pg.wait_for_timeout(400)
    vis1=pg.evaluate("getComputedStyle(document.querySelector('.page .ino')).visibility")
    chk('trước: hiện, sau: ẩn', vis0=='visible' and vis1=='hidden', (vis0,vis1))
    chk('lưu layout.num=off', pg.evaluate("ws.tasks[0].layout.num")=='off')
    x0=pg.evaluate("document.querySelector('.page .q > :last-child').getBoundingClientRect().left")
    pg.click('#insp [data-p="@num"][data-v=on]'); pg.wait_for_timeout(400)
    x1=pg.evaluate("document.querySelector('.page .q > :last-child').getBoundingClientRect().left")
    chk('ẩn số không đổi lề chữ', abs(x0-x1)<0.5, (x0,x1))
    chk('về Hiện: num=null, hiện lại', pg.evaluate("ws.tasks[0].layout.num")==None and pg.evaluate("getComputedStyle(document.querySelector('.page .ino')).visibility")=='visible')
    pg.click('#insp [data-p="@num"][data-v=off]'); pg.wait_for_timeout(300)
    js=pg.evaluate("JSON.stringify(ws)"); pg.evaluate("(js)=>loadSheet(JSON.parse(js),'t')",js); pg.wait_for_timeout(500)
    chk('JSON giữ num=off', pg.evaluate("ws.tasks[0].layout.num")=='off' and pg.evaluate("document.querySelectorAll('.task[data-nonum]').length")==1)
    # --- nhãn phần (Self-check) qua Hướng dẫn của phần ---
    pg.evaluate("""()=>{const a=fillTask({id:'s1',title:'Your response',instruction:'Tick one.',content:{form:'list',items:[{text:'Feed goats',opts:['Feed goats','Watch rabbits','Draw animals']}]},answer:{kind:'choice',attach:'item',layout:'A4',params:{lab:'box'}}},[]);
      const b=fillTask({id:'s2',title:'Self-check',instruction:'Self-check:',layout:{break:'join'},content:{form:'list',items:[{text:'I used the story.',opts:['I used the story to answer Tasks 2–5.','I checked my answers.']}]},answer:{kind:'choice',attach:'item',layout:'A4',params:{lab:'box'}}},[]);
      loadSheet({schema:'ws-editor/0.3',id:'s',title:'x',age:'7-9',tasks:[a,b]},'t')}"""); pg.wait_for_timeout(700)
    chk('phần nối hiện nhãn "Self-check:" (qua Hướng dẫn)', pg.evaluate("[...document.querySelectorAll('.g0.jn .ins')].map(e=>e.textContent)")==['Self-check:'])
    chk('0 cảnh báo tràn', pg.evaluate("lastRes.diags.length")==0)
    chk('0 lỗi console', not errs, errs)
    b.close()
print('ALL OK' if ok else 'FAILED'); sys.exit(0 if ok else 1)
