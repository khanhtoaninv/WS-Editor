import json, sys
from playwright.sync_api import sync_playwright
F='file://'+sys.argv[1]; ok=True
def chk(n,c,x=''):
    global ok; print(('PASS ' if c else 'FAIL '),n,x); ok&=bool(c)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('console',lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'font' not in m.text.lower() else None)
    pg.on('pageerror',lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto(F); pg.wait_for_timeout(1500)
    tid=pg.evaluate("ws.tasks[0].id"); H0=pg.evaluate("lastRes.pages.length")
    pg.evaluate(f"sel={{type:'task',id:'{tid}'}}; openTask='{tid}'; refreshSel()"); pg.evaluate("SECT.free=true; renderTree()"); pg.wait_for_timeout(300)
    pg.click(f'.ed[data-ed="{tid}"] [data-eact=gtadd][data-kind=image]'); pg.wait_for_timeout(400)
    ex=pg.evaluate("ws.tasks[0].extras")
    chk('thêm khối ảnh', len(ex)==1 and ex[0]['kind']=='image' and ex[0]['pos']=='bottom', ex)
    xid=ex[0]['id']
    chk('hiện ô giữ chỗ có data-slot', pg.evaluate(f"document.querySelectorAll('.gt .pic.ph[data-slot=\"@{xid}\"]').length")==1)
    chk('Inspector khối ảnh', 'Khối ảnh' in pg.evaluate("document.getElementById('insp').textContent"))
    chk('slotsOf có khối ảnh', pg.evaluate(f"slotsOf(ws.tasks[0]).some(s=>s.key==='@{xid}')"))
    chk('không bị coi là ô bảng cố định', pg.evaluate(f"fixedImg(ws.tasks[0],'@{xid}')")==False)
    w0=pg.evaluate("document.querySelector('.gt .pic').getBoundingClientRect().width/document.querySelector('.task').getBoundingClientRect().width")
    chk('rộng mặc định ~50% (trừ lề)', 0.3<w0<0.55, w0)
    pg.fill('#insp [data-pv=w]','80'); pg.keyboard.press('Enter'); pg.wait_for_timeout(400)
    chk('đổi rộng 80', pg.evaluate("ws.tasks[0].extras[0].w")==80)
    w1=pg.evaluate("document.querySelector('.gt .pic').getBoundingClientRect().width")
    chk('ảnh rộng ra', w1>pg.evaluate("document.querySelector('.task').getBoundingClientRect().width")*0.4)
    pg.click('#insp [data-act=set][data-p=align][data-v=center]'); pg.wait_for_timeout(300)
    chk('căn giữa → margin auto', pg.evaluate("getComputedStyle(document.querySelector('.gt .gti')).marginLeft")!='0px')
    # tải ảnh thật
    pg.evaluate("""async (id)=>{const c=document.createElement('canvas');c.width=300;c.height=100;const g=c.getContext('2d');g.fillStyle='#c33';g.fillRect(0,0,300,100);
      const bl=await new Promise(r=>c.toBlob(r,'image/png'));const f=new File([bl],'wide.png',{type:'image/png'});await dropImages(ws.tasks[0].id,[f],'@'+id);}""", xid)
    pg.wait_for_timeout(800)
    chk('ảnh đã lưu vào uploads', pg.evaluate(f"!!ws.tasks[0].uploads['@{xid}']"))
    chk('khung theo tỉ lệ ảnh 3:1', abs(pg.evaluate("(()=>{const r=document.querySelector('.gt .pic').getBoundingClientRect();return r.width/r.height})()")-3)<.15)
    chk('không còn placeholder', pg.evaluate("document.querySelectorAll('.gt .pic.ph').length")==0)
    # khứ hồi
    js=pg.evaluate("JSON.stringify(ws)"); pg.evaluate("(js)=>loadSheet(JSON.parse(js),'t')",js); pg.wait_for_timeout(600)
    chk('nạp lại giữ ảnh khối', pg.evaluate(f"!!ws.tasks[0].uploads['@{xid}'] && ws.tasks[0].extras[0].kind==='image' && ws.tasks[0].extras[0].w===80"))
    # nạp xấu
    r=pg.evaluate("""(()=>{const n=[];const t=fillTask({id:'z',title:'',instruction:'',content:{form:'list',items:[]},answer:{kind:'none'},extras:[{kind:'image',w:500,label:5,frame:'line',size:'s'}]},n);return {n,e:t.extras}})()""")
    chk('nạp xấu: w sai bị bỏ, frame/size bỏ', r['e'][0].get('w') is None and 'frame' not in r['e'][0] and 'size' not in r['e'][0] and r['e'][0]['label']=='5', r)
    # trang trí chữ
    pg.evaluate(f"sel={{type:'task',id:'{tid}'}}; openTask='{tid}'; refreshSel()"); pg.evaluate("SECT.free=true; renderTree()"); pg.wait_for_timeout(300)
    pg.click(f'.ed[data-ed="{tid}"] [data-eact=gtadd]:not([data-kind])'); pg.wait_for_timeout(400)
    tx=pg.evaluate("ws.tasks[0].extras[1].id"); pg.fill(f'#tree [data-k="x.{tx}.text"]','Hello'); pg.wait_for_timeout(400)
    pg.click('.gt:not(:has(.pic)) .gtb'); pg.wait_for_timeout(300)
    opts=pg.evaluate("[...document.querySelectorAll('#insp [data-act=set][data-p=frame]')].map(b=>b.textContent)")
    chk('khung: 4 lựa chọn', opts==['Không','Viền xám','Nền xám nhẹ','Viền + nền'], opts)
    pg.click('#insp [data-p=frame][data-v=both]'); pg.wait_for_timeout(300)
    cs=pg.evaluate("(()=>{const e=getComputedStyle(document.querySelector('.gt-both .gtb'));return [e.borderTopWidth,e.backgroundColor,e.borderRadius]})()")
    chk('viền + nền xám, bo góc', cs[0]!='0px' and cs[1]=='rgb(238, 241, 243)' and cs[2]!='0px', cs)
    # xóa khối ảnh dọn uploads
    pg.click(f'.ed[data-ed="{tid}"] [data-eact=gtrm] >> nth=0'); pg.wait_for_timeout(400)
    chk('xóa khối ảnh dọn uploads/imgAr', pg.evaluate(f"!(ws.tasks[0].uploads||{{}})['@{xid}'] && !(ws.tasks[0].imgAr||{{}})['@{xid}']"))
    pg.click(f'.ed[data-ed="{tid}"] [data-eact=gtrm] >> nth=0'); pg.wait_for_timeout(300)
    chk('trang như ban đầu', pg.evaluate("lastRes.pages.length")==H0 and pg.evaluate("lastRes.diags.length")==0)
    chk('0 lỗi console', not errs, errs)
    b.close()
print('ALL OK' if ok else 'FAILED'); sys.exit(0 if ok else 1)
