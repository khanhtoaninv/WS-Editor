# v82: cột trái theo khối — Cấu hình (T, Q, tùy chọn câu, bật / tắt khối) · G0 · G1 · G2 · G3 · G4 · G-Text
import sys, json
from playwright.sync_api import sync_playwright
F = 'file://' + sys.argv[1]; ok = True
def chk(n, c, x=''):
    global ok; print(('PASS ' if c else 'FAIL '), n, x if not c else ''); ok &= bool(c)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 1000}); errs = []
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_' not in m.text and 'font' not in m.text.lower() else None)
    pg.goto(F); pg.wait_for_timeout(1200)
    E = pg.evaluate
    chk('badge v101', pg.inner_text('#verBadge').strip() == 'v101')
    ids = E("ws.tasks.map(t=>t.id)")
    def opn(tid): pg.click(f'#tree .tnode[data-sel=task][data-id={tid}]'); pg.wait_for_timeout(120)
    S = "[...document.querySelectorAll('#tree .ed .sec')]"
    # 1. Mọi Task: đúng thứ tự mục, nhãn T/Q khớp dạng suy ra, không còn Áp mẫu / ô Đáp án / Thêm khối
    bad = []
    for tid in ids:
        opn(tid)
        r = E(f"""(()=>{{const t=curT(ws),s={S};return [s.map(x=>x.dataset.sec).join(),
          (s[0].querySelector('.stag')||{{}}).textContent||'', tnOf(t)+(qOf(t)?' · '+qOf(t):''),
          (document.querySelector('#tree .ed .sec[data-sec=g3]:not(.off) .stag')||{{}}).textContent||null, qOf(t),
          document.querySelectorAll('#tree .ed select[data-eact=recipe],#tree .ed select[data-eact=kind],#tree .ed select[data-eact=blkadd],#tree .ed .sec[data-sec=content],#tree .ed .sec[data-sec=parts]').length,
          s.filter(x=>x.classList.contains('off')).every(x=>!x.querySelector('.secb')),
          !!t.image===!document.querySelector('#tree .ed .sec[data-sec=g1]').classList.contains('off'),
          !!t.wordBank===!document.querySelector('#tree .ed .sec[data-sec=g4]').classList.contains('off'),
          !!t.content.lead===!document.querySelector('#tree .ed .sec[data-sec=g2]').classList.contains('off')]}})()""")
        g3ok = r[3] is None or r[3] == 'theo ' + str(r[4])
        if r[0] != 'cfg,g0,g1,g2,g3,g4,gt' or r[1] != r[2] or not g3ok or r[5] or not all(r[6:]): bad.append((tid, r))
    chk('18 Task: Cấu hình, G0, G1, G2, G3, G4, G-Text; nhãn T · Q đúng; khối có / chưa có khớp dữ liệu; không còn ô cũ', not bad, bad)
    # 2. Cấu hình: tùy chọn câu tách khỏi bật / tắt khối
    opn('t1'); E("SECT.cfg=true;refreshSel()"); pg.wait_for_timeout(100)
    h3 = E("[...document.querySelectorAll('#tree .ed .sec[data-sec=cfg] h3')].map(x=>x.textContent)")
    chk('Cấu hình: Bố cục Task, Dạng câu hỏi, Tùy chọn của câu; v85 không còn Khối của bài', h3[:2] == ['Bố cục Task', 'Dạng câu hỏi'] and 'Tùy chọn của câu' in h3 and 'Khối của bài' not in h3, h3)
    tg = E("""(()=>{const h=[...document.querySelectorAll('#tree .ed .sec[data-sec=cfg] h3')], i=h.findIndex(x=>x.textContent==='Khối của bài'), j=h.findIndex(x=>x.textContent==='Tùy chọn của câu');
      const after=(e)=>{if(!e)return [];let n=e.nextElementSibling;while(n&&!n.classList.contains('etgs'))n=n.nextElementSibling;return n?[...n.querySelectorAll('input')].map(x=>x.dataset.tg):[]};return [after(h[j]),after(h[i])]})()""")
    chk('tùy chọn câu không chứa công tắc khối; khối = Ảnh chung / Câu hỏi / Khung từ…', not set(tg[0]) & {'image', 'list', 'bank', 'passage', 'intro'} and tg[1] == [], tg)
    # 3. Nút thêm ngay tại mục mờ: thêm, mở mục, hoàn tác
    n0 = E("JSON.stringify(curT(ws))")
    pg.click('#tree .ed .sec.off[data-sec=g4] [data-eact=blkaddb][data-v=G4]'); pg.wait_for_timeout(200)
    chk('+ Chữ ở G4: có khung từ, G4 mở, có ô nhập', E("!!curT(ws).wordBank") and E("document.querySelector('#tree .ed .sec[data-sec=g4]').classList.contains('open')") and pg.locator('#tree .ed .sec[data-sec=g4] [data-k="wb.words"]').count() == 1)
    pg.click('#tree .ed .sec.off[data-sec=g1] [data-eact=blkaddb][data-v=G1]'); pg.wait_for_timeout(200)
    chk('+ Thêm ở G1: có ảnh chung, ô tên ảnh nằm trong G1', E("!!curT(ws).image") and pg.locator('#tree .ed .sec[data-sec=g1] [data-k="image.label"]').count() == 1)
    pg.click('#undo'); pg.wait_for_timeout(150); pg.click('#undo'); pg.wait_for_timeout(150)
    chk('hoàn tác 2 bước về đúng dữ liệu cũ', E("JSON.stringify(curT(ws))") == n0)
    # 4. Bài đọc: nhãn theo T; Lời dẫn của hội thoại
    opn('t7'); chk('Task bài đọc: G2 có ô bài đọc và nhãn "theo T…"', pg.locator('#tree .ed .sec[data-sec=g2] [data-k="lead.text"]').count() == 1 and pg.inner_text('#tree .ed .sec[data-sec=g2] .stag') == 'theo ' + E("tnOf(curT(ws))"))
    opn('t12'); chk('Task hội thoại: G2 là "Lời dẫn", có ô nhập', 'Lời dẫn' in pg.inner_text('#tree .ed .sec[data-sec=g2] .sech') and pg.locator('#tree .ed .sec[data-sec=g2] [data-k="lead.text"]').count() == 1)
    E("sectOne('g2');syncSec()"); pg.click('#tree .ed .sec[data-sec=g2] [data-eact=blkdel][data-v=intro]'); pg.wait_for_timeout(200)
    chk('xóa lời dẫn: G2 mờ có + Lời dẫn', pg.locator('#tree .ed .sec.off[data-sec=g2] [data-eact=blkaddb][data-v=intro]').count() == 1)
    pg.click('#tree .ed [data-eact=blkaddb][data-v=intro]'); pg.wait_for_timeout(200)
    chk('+ Lời dẫn: có lại ô lời dẫn trong G2', pg.locator('#tree .ed .sec[data-sec=g2] [data-k="lead.text"]').count() == 1)
    pg.click('#undo'); pg.wait_for_timeout(150); pg.click('#undo'); pg.wait_for_timeout(150)
    chk('hoàn tác: lời dẫn cũ quay lại', E("curT(ws).content.lead.text").startswith('Mai is talking'))
    # 5. Bảng: G3 = Bảng; Chỉ có ảnh: G3 mờ, + Thêm bật danh sách
    opn('t14'); chk('Task bảng: G3 là "Bảng" có bảng nhập liệu', 'Bảng' in pg.inner_text('#tree .ed .sec[data-sec=g3] .sech') and pg.locator('#tree .ed .sec[data-sec=g3] .etbl').count() == 1)
    opn('t10'); pg.click('#tree .ed .sec.off[data-sec=g3] [data-eact=blkaddb][data-v=G3]'); pg.wait_for_timeout(200)
    chk('Chỉ có ảnh + Thêm câu hỏi: 3 câu, G3 mở', E("its(curT(ws)).length") == 3 and pg.locator('#tree .ed .sec[data-sec=g3]:not(.off) [data-eact=add]').count() == 1)
    pg.click('#undo'); pg.wait_for_timeout(150)
    # 6. Gõ vào ô của mục đang thu: focusK mở mục; tóm tắt cập nhật khi gõ
    opn('t4'); E("sectOne(null);refreshSel()"); pg.wait_for_timeout(100)
    E("focusK('title')"); pg.wait_for_timeout(100)
    chk('focusK mở mục G0 đang thu', E("document.querySelector('#tree .ed .sec[data-sec=g0]').classList.contains('open')") and E("document.activeElement.dataset.k") == 'title')
    pg.keyboard.type(' XYZ'); pg.wait_for_timeout(500)
    chk('tóm tắt G0 cập nhật khi gõ', 'XYZ' in pg.inner_text('#tree .ed .sec[data-sec=g0] .secs'))
    E('document.activeElement.blur()'); pg.click('#undo'); pg.wait_for_timeout(200)
    # 6b. v83: một mục mở một lúc; mở mục = chọn khối G trên trang; chọn trên trang = mở mục
    opn('t7'); pg.wait_for_timeout(100)
    chk('mặc định chỉ G3 mở', E("[...document.querySelectorAll('#tree .ed .sec.open')].map(e=>e.dataset.sec)") == ['g3'])
    pg.click('#tree .ed .sec[data-sec=g2] .sech'); pg.wait_for_timeout(200)
    chk('bấm G2: chỉ G2 mở, sel = nhóm G2', E("[...document.querySelectorAll('#tree .ed .sec.open')].map(e=>e.dataset.sec)") == ['g2'] and E("window.__ws.sel.type+':'+window.__ws.sel.g") == 'group:G2')
    chk('trang: khối G2 có dấu chọn', E("!!document.querySelector('.task[data-task=t7] .selg, .task[data-task=t7] [data-node$=\":G2\"].sel, .task[data-task=t7] [data-node$=\":G2\"][class*=sel]')") or E("document.querySelectorAll('#stage [class*=sel]').length") > 1)
    pg.click('#tree .ed .sec[data-sec=g1] .sech'); pg.wait_for_timeout(200)
    chk('bấm G1: chỉ G1 mở, sel = nhóm G1', E("[...document.querySelectorAll('#tree .ed .sec.open')].map(e=>e.dataset.sec)") == ['g1'] and E("window.__ws.sel.g") == 'G1')
    pg.click('.task[data-task=t7] [data-node$=":G3"]', position={'x': 6, 'y': 6}); pg.wait_for_timeout(300)
    chk('chọn G3 trên trang: cột trái mở đúng G3, thu mục khác', E("[...document.querySelectorAll('#tree .ed .sec.open')].map(e=>e.dataset.sec)") == ['g3'])
    pg.click('#tree .ed .sec[data-sec=g3] .sech'); pg.wait_for_timeout(200)
    chk('bấm mục đang mở: thu lại, về chọn cả Task', E("document.querySelectorAll('#tree .ed .sec.open').length") == 0 and E("window.__ws.sel.type") == 'task')
    pg.click('#tree .ed .sec[data-sec=cfg] .sech'); pg.wait_for_timeout(100); pg.click('#tree .ed .sec[data-sec=g3] .sech'); pg.wait_for_timeout(100)
    opn('t4'); pg.click('#tree .ed .sec[data-sec=g0] .sech'); pg.wait_for_timeout(100)
    pg.focus('#tree .ed [data-k=title]'); pg.keyboard.type('Q'); pg.wait_for_timeout(300)
    chk('đang gõ ở G0: con trỏ không mất, mục G0 vẫn mở', E("document.activeElement.dataset.k") == 'title' and E("window.__ws.sel.g") == 'G0')
    pg.evaluate('document.activeElement.blur()'); pg.click('#undo'); pg.wait_for_timeout(100)
    # 6c. v83: Q7 tick đúng cạnh ảnh, câu ví dụ hiện đáp án mẫu trên trang
    opn('t3'); pg.click('#tree .ed .sec[data-sec=g3] .eit[data-i="0"] [data-eact=iexi]'); pg.wait_for_timeout(150)
    chk('Q7: không còn ô gõ Đáp án, có 3 ô tick mỗi câu', pg.locator('#tree .ed .sec[data-sec=g3] [data-k="it.0.key"]').count() == 0 and pg.locator('#tree .ed .sec[data-sec=g3] .eit[data-i="0"] [data-eact=tickopt]').count() == 3)
    chk('Ví dụ chưa có đáp án mẫu: phiếu chưa tick, có cảnh báo nhẹ', E("document.querySelectorAll('.task[data-task=t3] .a5.pk').length") == 0 and 'chưa có đáp án mẫu' in pg.inner_text('#tree .tcwrap'))
    pg.click('#tree .ed .sec[data-sec=g3] .eit[data-i="0"] [data-eact=tickopt][data-j="1"]'); pg.wait_for_timeout(200)
    chk('tick ảnh 2: key = "B", đúng ô thứ 2 của câu ví dụ được ✓ trên trang', E("its(curT(ws))[0].key").lower() == 'b' and E("[...document.querySelectorAll('.task[data-task=t3] .choices')][0] && [...document.querySelectorAll('.task[data-task=t3] .choices')[0].querySelectorAll('.a5')].map(e=>e.classList.contains('pk')).join()") == 'false,true,false')
    pg.click('#tree .ed .sec[data-sec=g3] .eit[data-i="0"] [data-eact=tickopt][data-j="2"]'); pg.wait_for_timeout(200)
    chk('v86 tick ảnh 3: thêm đáp án thứ hai (nhiều đáp án), key "B, C"', E("its(curT(ws))[0].key").lower().replace(' ','') == 'b,c' and E("document.querySelectorAll('.task[data-task=t3] .a5.pk').length") == 2)
    pg.click('#tree .ed .sec[data-sec=g3] .eit[data-i="0"] [data-eact=tickopt][data-j="2"]'); pg.wait_for_timeout(200)
    chk('bấm lại ô đang tick: bỏ tick ô đó, còn B', E("its(curT(ws))[0].key").lower() == 'b' and E("document.querySelectorAll('.task[data-task=t3] .a5.pk').length") == 1)
    for _ in range(60):
        if pg.eval_on_selector('#undo', 'e=>e.disabled'): break
        pg.click('#undo')
    # 6d. v83: ô ảnh G1 lớn + tự chọn G1; ⓘ + thanh chèn ký hiệu; câu có ảnh chia hai cột
    opn('t4'); pg.click('#tree .ed .sec.off[data-sec=g1] [data-eact=blkaddb][data-v=G1]'); pg.wait_for_timeout(250)
    chk('V1: "+ Thêm" G1 → ô ảnh lớn có chữ hướng dẫn, G1 mở và được chọn, panel phải có nút tải ảnh', pg.locator('#tree .ed .sec[data-sec=g1] .ithumb.big').count() == 1 and 'Tải ảnh lên' in pg.inner_text('#tree .ed .sec[data-sec=g1] .ithumb.big') and E("window.__ws.sel.g") == 'G1' and 'Tải ảnh' in pg.inner_text('#insp'))
    pg.click('#undo'); pg.wait_for_timeout(150)
    opn('t1'); chk('V3: câu có ảnh = 2 cột (ô ảnh trái, 2 dòng chữ phải), 6 câu', pg.locator('#tree .ed .sec[data-sec=g3] .imgrow2').count() == 6 and pg.locator('#tree .ed .sec[data-sec=g3] .imgrow2 .imgcol input').count() >= 12)
    opn('t7'); pg.click('#tree .ed .sec[data-sec=g2] .sech'); pg.wait_for_timeout(100)
    pg.click('#tree .ed .sec[data-sec=g2] [data-k="lead.text"]'); E("(()=>{const e=document.querySelector('#tree [data-k=\"lead.text\"]');e.setSelectionRange(11,15)})()")
    pg.click('#tree .ed .sec[data-sec=g2] .tinfo'); pg.wait_for_timeout(150)
    chk('V2: ⓘ ở bài đọc mở bảng ký hiệu có thanh nút', pg.is_visible('#txHelp') and pg.locator('#txHelp [data-tx]').count() >= 5 and 'chỗ trống' in pg.inner_text('#txHelp'))
    pg.click('#txHelp [data-tx=b]'); pg.wait_for_timeout(300)
    chk('V2: bôi đen rồi bấm B → bọc **…**, dữ liệu và trang cập nhật', '**Lucy**' in E("curT(ws).content.lead.text") and E("document.activeElement.dataset.k") == 'lead.text')
    pg.click('#txHelp [data-tx=gap]'); pg.wait_for_timeout(200)
    chk('V2: nút ___ chèn chỗ trống tại con trỏ', E("curT(ws).content.lead.text").count('___') >= 1)
    pg.keyboard.press('Escape'); pg.wait_for_timeout(100)
    chk('Esc đóng bảng ký hiệu', not pg.is_visible('#txHelp'))
    pg.evaluate('document.activeElement.blur()')
    for _ in range(60):
        if pg.eval_on_selector('#undo', 'e=>e.disabled'): break
        pg.click('#undo')
    # 7. Chọn Q4 rồi rời sang dạng khác: không còn chỗ giữ chỗ {…|…} trong câu (lỗi thấy ở Task 1)
    E("window.__ws.pick({type:'task',id:'t1'})"); pg.wait_for_timeout(50)
    E("commit(w=>setQ(w.tasks[0],'Q4'))"); pg.wait_for_timeout(80)
    chk('Q4 điền giữ chỗ {…|…} cho câu chưa có lựa chọn', E("its(ws.tasks[0]).every(x=>/\\{…\\|…\\}/.test(x.text))"))
    bad = []
    for q in ['Q1', 'Q2', 'Q3', 'Q5', 'Q9', 'Q6', 'Q7', 'Q8']:
        E(f"commit(w=>setQ(w.tasks[0],'{q}'))"); pg.wait_for_timeout(50)
        if E("its(ws.tasks[0]).some(x=>/…\\|…/.test(x.text||'')||(x.opts||[]).some(o=>o==='…'))") or '{…|…}' in pg.inner_text('.task[data-task=t1]'): bad.append(q)
        E("commit(w=>setQ(w.tasks[0],'Q4'))"); pg.wait_for_timeout(50)
    chk('rời Q4 sang Q1 / Q2 / Q3 / Q5 / Q9 / Q6 / Q7 / Q8: hết giữ chỗ {…|…}', not bad, bad)
    for _ in range(60):
        if pg.eval_on_selector('#undo', 'e=>e.disabled'): break
        pg.click('#undo')
    pg.locator('#tree').screenshot(path='/tmp/test31_tree.png')
    chk('cuối: 0 lỗi tràn', pg.inner_text('#diagBadge') == 'Không lỗi tràn')
    print('ERRS', errs); print('ALL OK' if ok and not errs else 'SOME FAIL')
    b.close()
