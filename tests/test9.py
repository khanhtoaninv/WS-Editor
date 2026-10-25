# Bước 2 (v58): "Công thức" -> "Áp mẫu…"; thẻ / tóm tắt hiện mô tả thành phần; thư viện + Task nhóm mẫu
import sys
from playwright.sync_api import sync_playwright
ok=True
def chk(n,c,i=''):
    global ok; print(('PASS ' if c else 'FAIL ')+n, i); ok = ok and bool(c)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'fonts' not in m.text else None); pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+sys.argv[1]); pg.evaluate("localStorage.setItem('wsEditor.sections.v2', JSON.stringify({kind:true,info:false,content:true,parts:true}))"); pg.reload(); pg.wait_for_timeout(1300)
    pg.click('#tree .tnode[data-sel=task][data-id=t4]'); pg.wait_for_timeout(300)
    pg.evaluate("SECT.kind=true;SECT.parts=true;refreshSel()"); pg.wait_for_timeout(200)
    chk('nhãn "Áp mẫu", không còn "Công thức"', 'Áp mẫu' in pg.inner_text('#tree .ed .sec[data-sec=kind]') and 'Công thức' not in pg.inner_text('#tree .ed'))
    chk('ô Áp mẫu mặc định là "Chọn mẫu để áp…"', pg.eval_on_selector('#tree .ed select[data-eact=recipe]','e=>e.value')=='')
    groups = pg.eval_on_selector_all('#tree .ed select[data-eact=recipe] optgroup','e=>e.map(x=>x.label)')
    chk('mẫu chia nhóm', groups==['Danh sách câu','Ảnh mỗi câu','Riêng','Chỉ có ảnh','Bảng'], groups)
    chk('không còn "(gốc, đang tùy biến)" / "Tùy biến · gốc"', '(gốc' not in pg.content() or 'đang tùy biến' not in pg.inner_text('#tree') and 'Tùy biến · gốc' not in pg.inner_text('#tree'))
    chip = pg.inner_text('#tree .tcwrap .chip.nm')
    chk('chip đầu = mô tả thành phần', chip=='Câu hỏi · khoanh A/B/C', chip)
    chk('tóm tắt mục 1 = mô tả', pg.inner_text('#tree .sec[data-sec=kind] .secs')=='Câu hỏi · khoanh A/B/C')
    # tùy biến: bật ảnh chung -> mô tả đổi theo, không còn chữ "tùy biến"
    pg.click('#tree .ed .etg input[data-tg=image]'); pg.wait_for_timeout(300)
    chip = pg.inner_text('#tree .tcwrap .chip.nm')
    chk('bật Ảnh chung: mô tả thêm "ảnh chung"', chip=='Câu hỏi · khoanh A/B/C · ảnh chung', chip)
    pg.click('#undo'); pg.wait_for_timeout(300)
    # áp mẫu
    pg.select_option('#tree .ed select[data-eact=recipe]','true-false'); pg.wait_for_timeout(400)
    t = pg.evaluate("(()=>{const t=ws.tasks.find(t=>t.id==='t4');return [t.answer.layout, descOf(t), t.content.items[0].text]})()")
    chk('áp mẫu Đúng/Sai: đổi đáp án, giữ chữ câu', t[0]=='A6' and t[2]=='She ___ a teacher.', t)
    chk('sau khi áp: ô quay về "Chọn mẫu để áp…"', pg.eval_on_selector('#tree .ed select[data-eact=recipe]','e=>e.value')=='')
    pg.click('#undo'); pg.wait_for_timeout(300)
    chk('hoàn tác áp mẫu', pg.evaluate("ws.tasks.find(t=>t.id==='t4').answer.layout")=='A4')
    # Task chỉ có ảnh
    pg.click('#tree .tnode[data-sel=task][data-id=t10]'); pg.wait_for_timeout(300)
    pg.evaluate("SECT.kind=true;SECT.parts=true;refreshSel()"); pg.wait_for_timeout(200)
    chk('Task 17: chip "Chỉ có ảnh"', pg.inner_text('#tree .tcwrap .chip.nm')=='Chỉ có ảnh')
    # mô tả 18 Task: không rỗng, khác nhau khi cấu hình khác
    d = pg.evaluate("ws.tasks.map(t=>descOf(t))")
    chk('18 mô tả đều có chữ', all(d) and len(d)==18, d)
    # + Task: nhóm
    pg.click('#tree [data-lib]'); pg.wait_for_timeout(300)
    hs = pg.eval_on_selector_all('#libGrid .libgrp h4','e=>e.map(x=>x.innerText)')
    chk('thư viện + Task chia 5 nhóm', len(hs)==5, hs)
    chk('tiêu đề thư viện: mẫu có sẵn', 'mẫu có sẵn' in pg.inner_text('#libTitle'))
    pg.click('#libGrid .libgrp:nth-child(4) [data-r]'); pg.wait_for_timeout(400)
    nt = pg.evaluate("ws.tasks.find(t=>t.id===window.__ws.sel.id)")
    chk('thêm mẫu "Chỉ có ảnh" từ thư viện', nt['content'].get('list') is False, nt['content'])
    pg.click('#undo'); pg.wait_for_timeout(300)
    # hộp dán: select cũng nhóm
    pg.click('#tree [data-lib]'); pg.wait_for_timeout(300); pg.click('#libDlg [data-tab=src]'); pg.wait_for_timeout(200)
    pg.fill('#pasteTa','Choose the correct answer.\n1. She ___ a teacher. A. am B. is C. are'); pg.wait_for_timeout(500)
    chk('hộp dán: chọn mẫu có nhóm', pg.locator('#pasteOut select[data-pr] optgroup').count()==5)
    pg.click('#libClose')
    chk('11 trang, 0 tràn', pg.inner_text('#pageBadge').startswith('11') and pg.inner_text('#diagBadge')=='Không lỗi tràn')
    print('ERRS',errs); print('ALL OK' if ok and not errs else 'SOME FAIL')
