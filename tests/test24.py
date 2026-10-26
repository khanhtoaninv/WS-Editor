import json, sys
from playwright.sync_api import sync_playwright
F='file://'+sys.argv[1]; ok=True
def chk(n,c,x=''):
    global ok; print(('PASS ' if c else 'FAIL '),n,x); ok&=bool(c)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':1000}); errs=[]
    pg.on('console',lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'font' not in m.text.lower() else None)
    pg.on('pageerror',lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto(F); pg.wait_for_timeout(1500)
    pg.evaluate("""()=>{const t=fillTask({id:'m1',title:'Look and write',instruction:'Write.',image:{label:'house',size:'medium',ar:'4/3'},content:{form:'list',items:[{text:'What is number 1?'},{text:'What is number 2?'},{text:'What is number 3?'}]},answer:{kind:'word',attach:'item',layout:'A1',params:{lines:1}}},[]);
      loadSheet({schema:'ws-editor/0.3',id:'s',title:'x',age:'7-9',tasks:[t]},'t')}"""); pg.wait_for_timeout(800)
    chk('chưa có điểm: không có .mk', pg.evaluate("document.querySelectorAll('.mk').length")==0)
    pg.evaluate("sel={type:'group',id:'m1',g:'G1'}; refreshSel()"); pg.wait_for_timeout(300)
    chk('panel có Đặt điểm', pg.evaluate("!!document.querySelector('#insp [data-act=mkmode]')"))
    pg.click('#insp [data-act=mkmode]'); pg.wait_for_timeout(400)
    chk('bật chế độ → marks=[]', pg.evaluate("Array.isArray(ws.tasks[0].image.marks)") and pg.evaluate("markMode"))
    box=pg.evaluate("(()=>{const r=document.querySelector('.g1 .pic').getBoundingClientRect();return [r.left,r.top,r.width,r.height]})()")
    for fx,fy in ((.25,.25),(.5,.5),(.75,.8)):
        pg.mouse.click(box[0]+box[2]*fx, box[1]+box[3]*fy); pg.wait_for_timeout(350)
    m=pg.evaluate("ws.tasks[0].image.marks")
    chk('3 điểm đặt theo chỗ bấm', len(m)==3 and abs(m[0]['x']-25)<2 and abs(m[1]['y']-50)<2 and abs(m[2]['x']-75)<2, m)
    nums=pg.evaluate("[...document.querySelectorAll('.mkd')].map(e=>e.textContent)")
    chk('số 1,2,3 trên ảnh', nums==['1','2','3'], nums)
    chk('khung bo góc + viền đỏ', pg.evaluate("getComputedStyle(document.querySelector('.mkd')).borderTopColor")=='rgb(192, 57, 43)' and pg.evaluate("getComputedStyle(document.querySelector('.mkd')).borderRadius")!='0px')
    # điểm ở vị trí đúng trong khung
    pos=pg.evaluate("(()=>{const p=document.querySelector('.g1 .pic').getBoundingClientRect(),d=document.querySelectorAll('.mkd')[1].getBoundingClientRect();return [(d.left+d.width/2-p.left)/p.width,(d.top+d.height/2-p.top)/p.height]})()")
    chk('điểm 2 ở giữa khung', abs(pos[0]-.5)<.03 and abs(pos[1]-.5)<.03, pos)
    # kéo
    d=pg.evaluate("(()=>{const r=document.querySelectorAll('.mkd')[0].getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]})()")
    pg.mouse.move(*d); pg.mouse.down(); pg.mouse.move(box[0]+box[2]*.6, box[1]+box[3]*.3, steps=5); pg.mouse.up(); pg.wait_for_timeout(400)
    m=pg.evaluate("ws.tasks[0].image.marks[0]")
    chk('kéo dời điểm 1', abs(m['x']-60)<3 and abs(m['y']-30)<3, m)
    chk('hoàn tác kéo', (pg.click('#undo'),pg.wait_for_timeout(300),abs(pg.evaluate("ws.tasks[0].image.marks[0].x")-25)<2)[2])
    # hình & nội dung
    pg.click('#insp [data-act=mkshape][data-v=square]'); pg.wait_for_timeout(300)
    chk('vuông', pg.evaluate("ws.tasks[0].image.mk.shape")=='square' and pg.evaluate("document.querySelectorAll('.mkd.mk-square').length")==3)
    pg.click('#insp [data-act=mklabel][data-v=none]'); pg.wait_for_timeout(300)
    chk('ô trống', pg.evaluate("document.querySelectorAll('.mkd.blank').length")==3 and pg.evaluate("document.querySelector('.mkd').textContent")=='')
    pg.click('#insp [data-act=mkshape][data-v=circle]'); pg.click('#insp [data-act=mklabel][data-v=num]'); pg.wait_for_timeout(300)
    chk('về mặc định xóa key mk', pg.evaluate("'mk' in ws.tasks[0].image")==False)
    # ảnh tải lên 3:1 trong khung 4:3: .mk phủ khung, đúng tỉ lệ ảnh, thẳng tâm
    pg.evaluate("""async ()=>{const c=document.createElement('canvas');c.width=300;c.height=100;const g=c.getContext('2d');g.fillStyle='#39c';g.fillRect(0,0,300,100);
      const bl=await new Promise(r=>c.toBlob(r,'image/png'));await dropImages('m1',[new File([bl],'w.png',{type:'image/png'})],'G1');}"""); pg.wait_for_timeout(900)
    g=pg.evaluate("(()=>{const p=document.querySelector('.g1 .pic').getBoundingClientRect(),k=document.querySelector('.g1 .mk').getBoundingClientRect();return {pw:p.width,ph:p.height,kw:k.width,kh:k.height,dx:(k.left+k.width/2)-(p.left+p.width/2),dy:(k.top+k.height/2)-(p.top+p.height/2)}})()")
    chk('.mk có tỉ lệ ảnh', abs(g['kw']/g['kh']-pg.evaluate("arNum(ws.tasks[0].imgAr.G1||ws.tasks[0].image.ar)"))<.05, g)
    chk('.mk phủ khung và cùng tâm', g['kw']>=g['pw']-3 and g['kh']>=g['ph']-3 and abs(g['dx'])<1 and abs(g['dy'])<1, g)
    # Fit ngang: .mk trùng img
    pg.evaluate("ws.tasks[0].layout.frame.fit='width'; render()"); pg.wait_for_timeout(500)
    r=pg.evaluate("(()=>{const i=document.querySelector('.g1 .pic img').getBoundingClientRect(),k=document.querySelector('.g1 .mk').getBoundingClientRect();return [i.left-k.left,i.top-k.top,i.width-k.width,i.height-k.height]})()")
    chk('Fit ngang: .mk trùng ảnh', all(abs(v)<1.5 for v in r), r)
    w=pg.evaluate("contentWarnings(ws.tasks[0]).map(x=>String(x.msg||x.m||x.t||JSON.stringify(x)))")
    chk('cảnh báo Fit', any('Fit' in x for x in w), w)
    pg.evaluate("delete ws.tasks[0].layout.frame.fit; render()"); pg.wait_for_timeout(300)
    # khứ hồi + nạp xấu
    js=pg.evaluate("JSON.stringify(ws)"); pg.evaluate("(js)=>loadSheet(JSON.parse(js),'t')",js); pg.wait_for_timeout(600)
    chk('JSON giữ 3 điểm', pg.evaluate("ws.tasks[0].image.marks.length")==3 and pg.evaluate("document.querySelectorAll('.mkd').length")==3)
    bad=pg.evaluate("""(()=>{const n=[];const t=fillTask({id:'q',title:'',instruction:'',image:{label:'a',marks:[{x:-5,y:150},{x:'a',y:1},7,{x:'30.26',y:40}],mk:{shape:'zzz',label:'none'}},content:{form:'list',items:[]},answer:{kind:'none'}},n);return {m:t.image.marks,mk:t.image.mk,n}})()""")
    chk('nạp xấu: kẹp 0–100, bỏ điểm hỏng, mk lọc', bad['m']==[{'x':0,'y':100},{'x':30.3,'y':40}] and bad['mk']=={'label':'none'}, bad)
    bad2=pg.evaluate("(()=>{const n=[];const t=fillTask({id:'q',title:'',instruction:'',image:{label:'a',marks:'x'},content:{form:'list',items:[]},answer:{kind:'none'}},n);return {has:'marks' in t.image,n}})()")
    chk('marks không phải mảng bị bỏ có báo', bad2['has']==False and bad2['n'], bad2)
    # xóa từng điểm, xóa hết
    pg.evaluate("sel={type:'group',id:'m1',g:'G1'}; refreshSel()"); pg.wait_for_timeout(300)
    pg.click('#insp [data-act=mkdel][data-v="1"]'); pg.wait_for_timeout(300)
    chk('xóa điểm 2', pg.evaluate("ws.tasks[0].image.marks.length")==2)
    pg.click('#insp [data-act=mkclear]'); pg.wait_for_timeout(300)
    chk('xóa hết', pg.evaluate("'marks' in ws.tasks[0].image")==False and pg.evaluate("document.querySelectorAll('.mk').length")==0)
    chk('0 cảnh báo tràn', pg.evaluate("lastRes.diags.length")==0)
    chk('0 lỗi console', not errs, errs)
    b.close()
print('ALL OK' if ok else 'FAILED'); sys.exit(0 if ok else 1)
