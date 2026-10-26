import json, sys
from playwright.sync_api import sync_playwright
F='file://'+sys.argv[1]; ok=True
def chk(n,c,x=''):
    global ok; print(('PASS ' if c else 'FAIL '),n,x); ok&=bool(c)
TXT="I ___ nine. Every day I ___ to school.\n\nAfter school we ___ football with {him|he}. Tom __runs__ and **jumps** and *hops*.\n\nThe end."
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('console',lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'font' not in m.text.lower() else None)
    pg.on('pageerror',lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto(F); pg.wait_for_timeout(1500)
    # Task bài đọc không ảnh, T1
    pg.evaluate("""(txt)=>{const t=fillTask({id:'p1',title:'Read and fill',instruction:'Fill the gaps.',content:{form:'list',lead:{kind:'passage',text:txt,keys:['am','go','play']},items:[{text:'Who runs?'},{text:'Where does he go?'}]},answer:{kind:'sentence',attach:'item',layout:'A1',params:{lines:1}},wordBank:{words:['am','go','play','are']},layout:{task:'T1'}},[]);
      loadSheet({schema:'ws-editor/0.3',id:'s',title:'x',age:'7-9',tasks:[t]},'t')}""",TXT); pg.wait_for_timeout(800)
    chk('layout T1 hoặc T6', pg.evaluate("layoutOf(ws.tasks[0])") in ('T1','T6'), pg.evaluate("layoutOf(ws.tasks[0])"))
    gaps=pg.evaluate("[...document.querySelectorAll('.passage .pgap')].map(e=>e.textContent)")
    chk('3 chỗ trống đánh số (1)(2)(3)', gaps==['(1)','(2)','(3)'], gaps)
    h=pg.evaluate("document.querySelector('.passage').innerHTML")
    chk('chọn {him|he} in đậm', '<span class="pch"><b>him</b>&nbsp;/ <b>he</b></span>' in h, h)
    chk('gạch chân, đậm, nghiêng', '<u>runs</u>' in h and '<b>jumps</b>' in h and '<i>hops</i>' in h)
    chk('3 đoạn <p>', pg.evaluate("document.querySelectorAll('.passage p').length")==3)
    chk('khung từ hiện cạnh bài đọc', pg.evaluate("document.querySelectorAll('.g4').length")==1)
    chk('không lỗi tràn', pg.evaluate("lastRes.diags.length")==0)
    # một chỗ trống: không đánh số
    r=pg.evaluate("(()=>{const t=ws.tasks[0];t.content.lead.text='I ___ nine.';render();return document.querySelector('.passage .pgap').textContent.trim()})()")
    chk('1 chỗ trống không số', r=='', repr(r))
    # cảnh báo số đáp án
    pg.evaluate("(txt)=>{ws.tasks[0].content.lead.text=txt;ws.tasks[0].content.lead.keys=['am'];render()}",TXT)
    w=pg.evaluate("contentWarnings(ws.tasks[0]).map(x=>x.msg||x.m||x.t||JSON.stringify(x))") if pg.evaluate("typeof contentWarnings")=='function' else []
    chk('cảnh báo lệch đáp án chỗ trống', any('đáp án chỗ trống' in str(x) for x in w), w)
    # ghi đáp án qua cột trái
    pg.evaluate("(txt)=>{ws.tasks[0].content.lead.text=txt;render()}",TXT)
    pg.evaluate("openTask='p1'; sel={type:'task',id:'p1'}; refreshSel()"); pg.evaluate("sectOne('g2'); renderTree()"); pg.wait_for_timeout(300)
    pg.fill('#tree [data-k="lead.keys"]','am, go, play'); pg.wait_for_timeout(500)
    chk('đáp án chỗ trống lưu thành mảng', pg.evaluate("ws.tasks[0].content.lead.keys")==['am','go','play'])
    md=pg.evaluate("taskToMd(ws.tasks[0])")
    chk('xuất MD có Đáp án chỗ trống', 'Đáp án chỗ trống: am, go, play' in md, md[:300])
    # khứ hồi JSON
    js=pg.evaluate("JSON.stringify(ws)"); pg.evaluate("(js)=>loadSheet(JSON.parse(js),'t')",js); pg.wait_for_timeout(500)
    chk('JSON giữ keys', pg.evaluate("ws.tasks[0].content.lead.keys")==['am','go','play'])
    bad=pg.evaluate("(()=>{const n=[];const t=fillTask({id:'q',title:'',instruction:'',content:{form:'list',lead:{kind:'passage',text:'a',keys:'x'},items:[]},answer:{kind:'none'}},n);return {n,k:t.content.lead.keys}})()")
    chk('keys sai bị bỏ có báo', bad['k'] is None and bad['n'], bad)
    # cắt theo đoạn: bài đọc dài
    pg.evaluate("""()=>{const paras=Array.from({length:14},(_,i)=>('Paragraph '+(i+1)+' '+'lorem ipsum dolor sit amet '.repeat(28)).trim()).join('\\n\\n');
      const t=fillTask({id:'p2',title:'Long',instruction:'Read.',content:{form:'list',lead:{kind:'passage',text:paras},items:[{text:'Q one?'},{text:'Q two?'}]},answer:{kind:'sentence',attach:'item',layout:'A1',params:{lines:1}},layout:{task:'T1'}},[]);
      loadSheet({schema:'ws-editor/0.3',id:'s',title:'x',age:'7-9',tasks:[t]},'t')}"""); pg.wait_for_timeout(1000)
    chk('Liền trang: bài dài cắt qua ≥2 trang', pg.evaluate("lastRes.pages.length")>=2, pg.evaluate("lastRes.pages.length"))
    chk('không lỗi tràn khi cắt', pg.evaluate("lastRes.diags.length")==0, pg.evaluate("lastRes.diags"))
    cnt=pg.evaluate("[document.querySelectorAll('.passage p').length, document.querySelectorAll('.task .g0').length, document.querySelectorAll('.g3 .q').length]")
    chk('đủ 14 đoạn, G0 một lần, đủ 2 câu', cnt==[14,1,2], cnt)
    chk('trang 2 không lặp G0', pg.evaluate("[...document.querySelectorAll('.page')].slice(1).every(p=>!p.querySelector('.g0'))"))
    # Tách trang: không cắt
    pg.evaluate("ws.flow='page'; render()"); pg.wait_for_timeout(500)
    chk('Tách trang: Task dài báo lỗi vì không cắt', pg.evaluate("lastRes.diags.length")>=1)
    chk('0 lỗi console', not errs, errs)
    b.close()
print('ALL OK' if ok else 'FAILED'); sys.exit(0 if ok else 1)
