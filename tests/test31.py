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
    chk('badge v82', pg.inner_text('#verBadge').strip() == 'v82')
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
    chk('Cấu hình: Bố cục Task, Dạng câu hỏi, Tùy chọn của câu, Khối của bài', h3[:2] == ['Bố cục Task', 'Dạng câu hỏi'] and 'Tùy chọn của câu' in h3 and 'Khối của bài' in h3, h3)
    tg = E("""(()=>{const h=[...document.querySelectorAll('#tree .ed .sec[data-sec=cfg] h3')], i=h.findIndex(x=>x.textContent==='Khối của bài'), j=h.findIndex(x=>x.textContent==='Tùy chọn của câu');
      const after=(e)=>{let n=e.nextElementSibling;while(n&&!n.classList.contains('etgs'))n=n.nextElementSibling;return n?[...n.querySelectorAll('input')].map(x=>x.dataset.tg):[]};return [after(h[j]),after(h[i])]})()""")
    chk('tùy chọn câu không chứa công tắc khối; khối = Ảnh chung / Câu hỏi / Khung từ…', not set(tg[0]) & {'image', 'list', 'bank', 'passage', 'intro'} and set(tg[1]) <= {'image', 'list', 'bank', 'passage', 'intro'} and 'bank' in tg[1], tg)
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
    pg.click('#tree .ed .sec[data-sec=g2] [data-eact=blkdel][data-v=intro]'); pg.wait_for_timeout(200)
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
    opn('t4'); E("SECT.g0=false;refreshSel()"); pg.wait_for_timeout(100)
    E("focusK('title')"); pg.wait_for_timeout(100)
    chk('focusK mở mục G0 đang thu', E("document.querySelector('#tree .ed .sec[data-sec=g0]').classList.contains('open')") and E("document.activeElement.dataset.k") == 'title')
    pg.keyboard.type(' XYZ'); pg.wait_for_timeout(500)
    chk('tóm tắt G0 cập nhật khi gõ', 'XYZ' in pg.inner_text('#tree .ed .sec[data-sec=g0] .secs'))
    E('document.activeElement.blur()'); pg.click('#undo'); pg.wait_for_timeout(200)
    pg.locator('#tree').screenshot(path='/tmp/test31_tree.png')
    chk('cuối: 0 lỗi tràn', pg.inner_text('#diagBadge') == 'Không lỗi tràn')
    print('ERRS', errs); print('ALL OK' if ok and not errs else 'SOME FAIL')
    b.close()
