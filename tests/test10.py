# Bước 3 (v59): gọn mẫu 15 -> 13, gộp 3 mẫu bảng, "Tranh" -> "Tô màu / vẽ"
import sys
from playwright.sync_api import sync_playwright
ok=True
def chk(n,c,i=''):
    global ok; print(('PASS ' if c else 'FAIL ')+n, i); ok = ok and bool(c)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'fonts' not in m.text else None); pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+sys.argv[1]); pg.evaluate("localStorage.setItem('wsEditor.sections.v2', JSON.stringify({kind:true,info:false,content:true,parts:true}))"); pg.reload(); pg.wait_for_timeout(1300)
    g = pg.evaluate("libGroups().map(([g,rs])=>[g,rs.map(r=>r.name)])")
    want = [['Danh sách câu',['Trả lời câu hỏi','Chọn A/B/C','Điền chỗ trống','Chọn trong câu {a|b}','Đúng/Sai','Đọc và trả lời','Tô chữ']],
            ['Ảnh mỗi câu',['Nhìn tranh viết từ','Nghe và tick ảnh']],['Riêng',['Nối','Hội thoại']],['Chỉ có ảnh',['Tô màu / vẽ']],['Bảng',['Bảng']]]
    chk('13 mẫu, 5 nhóm, đúng tên và thứ tự', g==want, g)
    m = pg.evaluate("ws.tasks.map(t=>{const x=recipeMatch(t);return x.exact?x.r.id:'—'})")
    chk('18 Task mẫu đều khớp một mẫu', '—' not in m, m)
    chk('4 Task bảng khớp mẫu Bảng', [m[i] for i in (8,9,10,11)]==['table']*4, m)
    chk('Task 17 khớp Tô màu / vẽ', m[16]=='colour-draw', m[16])
    # áp mẫu Bảng cho Task câu hỏi: thành bảng, mỗi câu một hàng
    pg.click('#tree .tnode[data-sel=task][data-id=t8]'); pg.wait_for_timeout(300)
    pg.evaluate("SECT.cfg=true;refreshSel()"); pg.wait_for_timeout(200)
    pg.evaluate("commit(w=>applyRecipe(w.tasks.find(t=>t.id==='t8'),recipeById('table')))"); pg.wait_for_timeout(400)
    r = pg.evaluate("(()=>{const t=ws.tasks.find(t=>t.id==='t8');return [t.content.form,t.content.rows.length,t.content.rows[0].head]})()")
    chk('áp mẫu Bảng: 6 câu thành 6 hàng', r[0]=='table' and r[1]==6 and r[2]=='What is your name?', r)
    # sửa ô thành ✓ -> mô tả đổi sang ô tick, vẫn khớp mẫu Bảng
    pg.evaluate("commit(w=>{const t=w.tasks.find(t=>t.id==='t8');t.content.rows.forEach(r=>r.cells=r.cells.map(()=>({tick:1})))})"); pg.wait_for_timeout(300)
    chk('ô ✓: mô tả "Bảng · ô tick", vẫn là mẫu Bảng', pg.evaluate("(()=>{const t=ws.tasks.find(t=>t.id==='t8');return descOf(t)+'|'+recipeMatch(t).r.id})()")=='Bảng · ô tick|table')
    pg.click('#undo'); pg.wait_for_timeout(200); pg.click('#undo'); pg.wait_for_timeout(300)
    chk('hoàn tác về danh sách câu', pg.evaluate("ws.tasks.find(t=>t.id==='t8').content.form")=='list')
    # dán bảng: đoán mẫu Bảng
    pg.click('#tree [data-lib]'); pg.wait_for_timeout(300); pg.click('#libDlg [data-tab=src]'); pg.wait_for_timeout(200)
    pg.fill('#pasteTa','Listen and complete the table.\nName | Age | Food\nTom | 9 | pizza\nLily |  | '); pg.wait_for_timeout(500)
    chk('dán bảng: giống mẫu Bảng', 'giống mẫu “Bảng”' in pg.inner_text('#pasteOut'), pg.inner_text('#pasteOut')[:200])
    pg.fill('#pasteTa','Listen and colour.\nColour the picture.'); pg.wait_for_timeout(500)
    chk('dán bài tô màu: giống mẫu Tô màu / vẽ', 'giống mẫu “Tô màu / vẽ”' in pg.inner_text('#pasteOut'))
    pg.click('#libClose')
    # + Task Tô màu / vẽ
    pg.click('#tree [data-lib]'); pg.wait_for_timeout(300)
    chk('thư viện: 13 ô mẫu', pg.locator('#libGrid [data-r]').count()==13)
    pg.click('#libGrid [data-r=colour-draw]'); pg.wait_for_timeout(400)
    nt = pg.evaluate("ws.tasks.find(t=>t.id===window.__ws.sel.id)")
    chk('+ Task Tô màu / vẽ: danh sách tắt, ảnh lớn', nt['content'].get('list') is False and nt['image']['size']=='large', nt)
    pg.click('#undo'); pg.wait_for_timeout(300)
    chk('10 trang, 0 tràn', pg.inner_text('#pageBadge').startswith('10') and pg.inner_text('#diagBadge')=='Không lỗi tràn')
    print('ERRS',errs); print('ALL OK' if ok and not errs else 'SOME FAIL')
