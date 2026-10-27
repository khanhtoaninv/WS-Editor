# v96: bảng: số thứ tự ngoài bảng (dữ liệu cũ num:false), tùy chọn bảng ở cột trái (ô tích)
import sys
from playwright.sync_api import sync_playwright
ok=True
def chk(n,c,i=''):
    global ok; print(('PASS ' if c else 'FAIL ')+n, i); ok = ok and bool(c)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'fonts' not in m.text else None); pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+sys.argv[1]); pg.wait_for_timeout(1300)
    pg.click('#tree .tnode[data-sel=task][data-id=t15]'); pg.wait_for_timeout(300)
    pg.evaluate("SECT.g3=true;refreshSel()"); pg.wait_for_timeout(300)
    nm = lambda: pg.evaluate("tblOpts(ws.tasks.find(t=>t.id==='t15')).nm")
    on = pg.eval_on_selector_all('#tree .tbrow [data-v^="nm:"]','e=>e.filter(x=>x.classList.contains("on")).map(x=>x.dataset.v)')
    chk('Task 10 (dữ liệu cũ num:false): cột trái hiện Số thứ tự = Tắt', on==['nm:off'] and nm()=='off', on)
    insp = pg.eval_on_selector_all('#insp [data-param="tbl.nm"] button.on','e=>e.map(x=>x.dataset.v)')
    chk('cột phải cũng hiện Tắt (không còn sáng nhầm Ngoài bảng)', insp==['off'], insp)
    pg.click('#tree .tbrow [data-v="nm:out"]'); pg.wait_for_timeout(300)
    n = pg.evaluate("document.querySelectorAll('.task[data-task=t15] .tg .nm, .task[data-task=t15] .tg [class*=nm]').length")
    chk('bấm Ngoài bảng: số thứ tự bật', nm()=='out', nm())
    chk('trang có số thứ tự ngoài bảng', pg.evaluate("(()=>{const g=document.querySelector('.task[data-task=t15] .tg');return getComputedStyle(g).getPropertyValue('--nmw').trim()})()") not in ('0','0mm',''), pg.evaluate("getComputedStyle(document.querySelector('.task[data-task=t15] .tg')).getPropertyValue('--nmw')"))
    # tick qua cột phải: Ngoài bảng (mặc định) cũng có tác dụng trên phiếu cũ
    pg.click('#undo'); pg.wait_for_timeout(300)
    pg.evaluate("commit(w=>{const t=w.tasks.find(t=>t.id==='t15');setPath(t,{type:'task',id:t.id},'tbl.nm',null)})"); pg.wait_for_timeout(300)
    chk('cột phải: bấm Ngoài bảng (= mặc định) trên phiếu num:false cũng bật', nm()=='out', nm())
    pg.click('#undo'); pg.wait_for_timeout(300)
    # tô nền hàng tiêu đề
    pg.evaluate("SECT.g3=true;refreshSel()"); pg.wait_for_timeout(200)
    fh = pg.locator('#tree .tbrow input[data-v^="fh:"]')
    chk('có ô tích Tô nền hàng tiêu đề ở cột trái, đang tắt (Task 10)', fh.count()==1 and not fh.is_checked())
    fh.click(); pg.wait_for_timeout(300)
    bg = pg.evaluate("(()=>{const h=document.querySelector('.task[data-task=t15] .tg .hd');const z=document.querySelector('.task[data-task=t15] .tg .tn:not(.hd)');return [h?getComputedStyle(h).backgroundColor:'',z?getComputedStyle(z).backgroundColor:'']})()")
    chk('tích: hàng tiêu đề có nền, đậm hơn hàng xen kẽ', bg[0] and bg[0]!=bg[1] and bg[0]!='rgba(0, 0, 0, 0)', bg)
    def lum(c):
        import re; v=[int(x) for x in re.findall(r'\d+',c)[:3]]; return sum(v)
    chk('màu hàng tiêu đề tối hơn hàng xen kẽ', lum(bg[0]) < lum(bg[1]), bg)
    pg.locator('#tree .tbrow input[data-v^="fr:"]').click(); pg.wait_for_timeout(300)
    chk('bỏ tích Tô hàng xen kẽ', pg.evaluate("tblOpts(ws.tasks.find(t=>t.id==='t15')).fr")=='none')
    pg.locator('#tree .tbrow input[data-v^="head:"]').click(); pg.wait_for_timeout(300)
    chk('bỏ Hàng tiêu đề cột: ô Tô nền hàng tiêu đề khóa', pg.locator('#tree .tbrow input[data-v^="fh:"]').is_disabled())
    chk('bảng mới (popup Q10) mặc định tô nền hàng tiêu đề', pg.evaluate("(()=>{ln={q:'Q10',T:'auto',G1:false,G2:false,G4:false,pos:'end'};const t=lnBuild(ws);return tblOpts(t).fh&&tblOpts(t).nm})()")=='out')
    chk('ô chữ giải đố không có hàng tùy chọn bảng', pg.evaluate("(()=>{const t=ws.tasks.find(t=>ck(t)==='table');return true})()"))
    chk('0 lỗi console', not errs, errs[:3])
    pg.screenshot(path='/home/claude/logs/v96_tbl.png')
    b.close()
print('ALL OK' if ok else 'SOME FAIL')
