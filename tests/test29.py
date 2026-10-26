# v81: kiến trúc trình bày mới — Bố cục Task (T, 4 kiểu), Dạng câu hỏi (Q, 12 kiểu), khối thêm / xóa, câu ví dụ, dòng chữ giữa câu
import sys, os, re, json
from playwright.sync_api import sync_playwright
F = 'file://' + sys.argv[1]; ok = True
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
def chk(n, c, x=''):
    global ok; print(('PASS ' if c else 'FAIL '), n, x if not c else ''); ok &= bool(c)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 1000}); errs = []
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_' not in m.text and 'font' not in m.text.lower() else None)
    pg.goto(F); pg.wait_for_timeout(1200)
    pg.evaluate("window.confirm = () => true")
    chk('badge v81', pg.inner_text('#verBadge').strip() == 'v81')
    E = pg.evaluate
    ids = E("ws.tasks.map(t=>t.id)")
    def pick(tid, g=None, item=None):
        s = {'type': 'task', 'id': tid} if not g else ({'type': 'group', 'id': tid, 'g': g, 'item': item} if item else {'type': 'group', 'id': tid, 'g': g})
        E("s=>window.__ws.pick(s)", s); pg.wait_for_timeout(30)
    T = lambda tid, js: E(f"(()=>{{const t=ws.tasks.find(x=>x.id==={json.dumps(tid)});return {js};}})()")
    # 1. Mỗi Task: Inspector có bộ chọn T (Tự động + 4) và Q (12), nút đang bật khớp dạng suy ra
    bad = []
    for tid in ids:
        pick(tid)
        r = E("""(()=>{const t=curT(ws),i=document.getElementById('insp');return [i.querySelectorAll('.tn-grid [data-act=tn]').length,i.querySelectorAll('.q-grid [data-act=q]').length,(i.querySelector('.q-grid .qbt.on')||{}).dataset?.v||null,qOf(t),i.querySelectorAll('.lay[data-act=layout]').length]})()""")
        if r[0] < 2 or r[1] != 12 or r[2] != r[3] or r[4]: bad.append((tid, r))
    chk('Inspector: bộ chọn T + 12 nút Q, nút bật = dạng suy ra, không còn bộ chọn 9 bố cục cũ', not bad, bad)
    # 2. Đổi mọi dạng Q hợp lệ trên mọi Task: đúng dạng, không lỗi, hoàn tác về đúng dữ liệu cũ
    bad = []; n = 0
    for tid in ids:
        pick(tid)
        qs = E("[...document.querySelectorAll('#insp .q-grid [data-act=q]:not(:disabled)')].map(b=>b.dataset.v)")
        for q in qs:
            before = E("JSON.stringify(ws)")
            pick(tid); pg.click(f'#insp .q-grid [data-act=q][data-v={q}]'); n += 1
            got = T(tid, "qOf(t)")
            rendered = E(f"!!document.querySelector('#stage .task[data-task=\"{tid}\"]')")
            if got != q or not rendered: bad.append((tid, q, got, rendered))
            pg.click('#undo'); pg.wait_for_timeout(20)
            if E("JSON.stringify(ws)") != before: bad.append((tid, q, 'undo khác'))
    chk(f'Đổi dạng câu hỏi ({n} lần trên {len(ids)} Task): đúng dạng, trang vẽ được, Ctrl+Z về y cũ', not bad and n > 150, (n, bad[:6]))
    chk('Đổi dạng: 0 lỗi console', not errs, errs[:3])
    # 3. Bố cục T trên Task bài đọc có ảnh (Task 14)
    t14 = ids[13]; pick(t14)
    tn = E("[...document.querySelectorAll('#insp .tn-grid [data-act=tn]:not(:disabled)')].map(b=>b.dataset.v)")
    chk('Task bài đọc có ảnh: dùng được Tự động, Xếp dọc, Ảnh trái, Ảnh phải, Ảnh trong bài đọc', tn == ['auto', 'T1', 'T2', 'T3', 'T4'], tn)
    res = []
    for v in ['T2', 'T3', 'T1', 'T4', 'auto']:
        pick(t14); pg.click(f'#insp .tn-grid [data-act=tn][data-v={v}]'); res.append(T(t14, "[layoutOf(t),tnOf(t)]"))
    chk('Bố cục: Ảnh trái = T2, Ảnh phải = T3, Xếp dọc = họ T1, Ảnh trong bài đọc = T8, Tự động về T8', res[0] == ['T2', 'T2'] and res[1] == ['T3', 'T3'] and res[2][1] == 'T1' and res[3] == ['T8', 'T4'] and res[4][1] == 'T4', res)
    t1 = ids[0]; pick(t1)
    dis = E("[...document.querySelectorAll('#insp .tn-grid [data-act=tn]')].map(b=>b.dataset.v)")
    why = E("[...document.querySelectorAll('#insp details.why li')].map(e=>e.textContent).join('|')")
    chk('Task không có ảnh chung: chỉ Tự động / Xếp dọc, ba bố cục ảnh nằm trong "chưa dùng được" có lý do', dis == ['auto', 'T1'] and all(n in why for n in ['Ảnh trái', 'Ảnh phải', 'Ảnh trong bài đọc']), (dis, why))
    # 4. Hình xem trước khi rê chuột lên nút Q
    pick(t1); pg.hover('#insp .q-grid [data-act=q][data-v=Q3]'); pg.wait_for_timeout(80)
    vis = E("getComputedStyle(document.querySelector('#insp .q-grid [data-v=Q3] .qpv')).display")
    pg.screenshot(path=os.path.join(ROOT, 'logs', 'test29_qhover.png'), clip={'x': 1000, 'y': 0, 'width': 440, 'height': 900})
    chk('Rê chuột lên Chọn A/B/C: hiện hình xem trước', vis == 'block', vis)
    # 5. Có chỗ trả lời: tắt = chỉ hiển thị câu, bật lại về như cũ
    pick(t1); a0 = T(t1, "JSON.stringify(t.answer)")
    pg.click('#insp [data-act=hasans][data-v="0"]'); r = T(t1, "[t.answer.kind,qOf(t)]")
    pick(t1); pg.click('#insp [data-act=hasans][data-v="1"]'); a1 = T(t1, "JSON.stringify(t.answer)")
    chk('Tắt chỗ trả lời: không còn đáp án, vẫn là Nhìn ảnh viết; bật lại về đúng kiểu cũ', r == ['none', 'Q6'] and a0 == a1, (r, a0, a1))
    # 6. Q5: nhãn tự đặt (Yes / No), Q2: bốn ô li, Q12: khung vẽ
    t13 = ids[12]; pick(t13); pg.click('#insp [data-act=labs][data-v=yn]')
    txt = E(f"[...document.querySelectorAll('#stage .task[data-task=\"{t13}\"] .a6')].map(e=>e.textContent).join('|')")
    chk('Đúng/Sai: nhãn Yes / No trên trang', 'Yes' in txt and 'No' in txt and 'T' not in txt.replace('Yes', '').replace('No', ''), txt[:60])
    t15 = ids[14]; pick(t15); pg.click('#insp [data-act=ruling][data-v="4"]')
    chk('Viết câu: dòng bốn ô li', E(f"document.querySelectorAll('#stage .task[data-task=\"{t15}\"] .a1.r4').length") > 0)
    pick(t15); pg.click('#insp .q-grid [data-act=q][data-v=Q12]'); pick(t15); pg.click('#insp [data-act=qst][data-v=box]')
    r = T(t15, "[qOf(t),its(t).length,t.answer.params.frame,t.layout.num]")
    chk('Viết tự do + Khung trống để vẽ: 1 chỗ, không số, khung vẽ trên trang', r == ['Q12', 1, 'box', 'off'] and E(f"!!document.querySelector('#stage .task[data-task=\"{t15}\"] .abox')"), r)
    pg.click('#undo'); pg.click('#undo'); pg.click('#undo')
    # 7. Khối: thêm ảnh chung, ảnh thứ hai, khung từ ảnh (cột trái), khung từ dưới câu hỏi
    pick(t15)
    def addblk(v):
        pg.select_option('#tree .tk.open select[data-eact=blkadd]', v); pg.wait_for_timeout(30)
    opts = E("[...document.querySelectorAll('#tree .tk.open select[data-eact=blkadd] option')].map(o=>o.value).filter(Boolean)")
    chk('Thêm khối: có Ảnh chung, Bài đọc, Khung từ chữ / ảnh, Khối chữ / ảnh', set(opts) >= {'G1', 'G2', 'G4', 'G4i', 'GTt', 'GTi'}, opts)
    addblk('G1'); addblk('G1b'); addblk('G4i')
    r = T(t15, "[!!t.image,!!(t.image&&t.image.two),t.wordBank&&t.wordBank.kind,(t.wordBank||{}).words?.length]")
    pics = E(f"[document.querySelectorAll('#stage .task[data-task=\"{t15}\"] .g1 .pic, #stage .task[data-task=\"{t15}\"] .g1 [data-slot]').length, document.querySelectorAll('#stage .task[data-task=\"{t15}\"] .g4.wimg .wim').length]")
    chk('Thêm ảnh chung + ảnh thứ hai + khung từ ảnh 3 ô', r == [True, True, 'image', 3] and pics[0] >= 2 and pics[1] == 3, (r, pics))
    pick(t15, 'G4'); pg.click('#insp [data-act=wb][data-v=bottom]')
    order = E(f"(()=>{{const el=document.querySelector('#stage .task[data-task=\"{t15}\"]'),g4=el.querySelector('.g4'),q=el.querySelector('.q');return !!(g4&&q&&(q.compareDocumentPosition(g4)&Node.DOCUMENT_POSITION_FOLLOWING))}})()")
    chk('Khung từ: vị trí Dưới câu hỏi', order and T(t15, "t.wordBank.placement") == 'bottom')
    pick(t15); pg.wait_for_timeout(30)
    chk('Cột trái: ô ảnh của khung từ ảnh (3 ô) và ảnh thứ hai', E("document.querySelectorAll('#tree .tk.open .wbth .ithumb').length") == 3 and E("!!document.querySelector('#tree .tk.open [data-k=\"image.label2\"]')"))
    # 8. Phím Delete xóa khối đang chọn trên trang
    pick(t15, 'G4'); pg.locator('#stage').focus() if False else None
    pg.evaluate("document.activeElement && document.activeElement.blur()"); pg.keyboard.press('Delete'); pg.wait_for_timeout(30)
    chk('Delete trên khung từ: xóa khung từ', T(t15, "!t.wordBank"))
    n0 = T(t15, "its(t).length"); k2 = T(t15, "its(t)[1].id"); pick(t15, 'G3', k2)
    chk('Chọn chỗ trả lời của câu: panel có Thêm / Nhân đôi / Ví dụ / Xóa', E("['iadd','idup','iex','idel'].every(a=>document.querySelector('#insp [data-act='+a+']'))"))
    pg.evaluate("document.activeElement && document.activeElement.blur()"); pg.keyboard.press('Delete'); pg.wait_for_timeout(30)
    chk('Delete trên câu 2: còn ít hơn 1 câu, câu 2 đã đi', T(t15, "its(t).length") == n0 - 1 and T(t15, f"!its(t).some(x=>x.id==='{k2}')"))
    pick(t15); pg.click('#tree .tk.open [data-eact=blkdel][data-v=G1b]'); pg.click('#tree .tk.open [data-eact=blkdel][data-v=G1]')
    chk('Nút ✕ ở cột trái: xóa ảnh thứ hai rồi ảnh chung', T(t15, "!t.image"))
    # 9. Câu ví dụ (số 0, hiện đáp án) và dòng chữ giữa các câu (không số)
    t7 = ids[6]; pick(t7)
    pg.click('#tree .tk.open [data-eact=iexi][data-i="0"]')
    pick(t7); pg.fill('#tree .tk.open [data-k="it.0.key"]', 'apple'); pg.locator('#tree .tk.open [data-k="it.0.key"]').blur(); pg.wait_for_timeout(200)
    nums = E(f"[...document.querySelectorAll('#stage .task[data-task=\"{t7}\"] .ino')].filter(e=>e.style.visibility!=='hidden').map(e=>e.textContent)")
    chk('Câu ví dụ: số 0 rồi 1, 2, …; đáp án mẫu hiện trên trang', nums[:3] == ['0', '1', '2'] and 'apple' in E(f"document.querySelector('#stage .task[data-task=\"{t7}\"]').textContent"), nums[:5])
    pick(t7); pg.click('#tree .tk.open [data-eact=gtiadd]'); pg.fill(f'#tree .tk.open [data-k="it.{T(t7, "its(t).length") - 1}.text"]', 'Part B: on holiday'); pg.locator("#tree .tk.open .eit.egt input").first.blur(); pg.wait_for_timeout(200)
    r = E(f"[document.querySelectorAll('#stage .task[data-task=\"{t7}\"] .q.g3t').length, document.querySelector('#stage .task[data-task=\"{t7}\"] .q.g3t')?.textContent]")
    chk('Dòng chữ giữa các câu: hiện trên trang, không số, không chỗ trả lời', r[0] == 1 and 'Part B' in (r[1] or ''), r)
    chk('Dòng chữ không tính vào danh sách chỗ trả lời', T(t7, "itemKeys(t).length") == T(t7, "its(t).filter(x=>!x.gt).length"))
    # 10. Bài đọc: chọn G2 → panel Bài đọc, đặt câu hỏi trước
    pick(t14); pg.click('#insp .tn-grid [data-act=tn][data-v=T4]'); pick(t14, 'G2')
    chk('Bố cục chọn tay Ảnh trong bài đọc: nút Câu hỏi trước bị khóa, có lý do', E("document.querySelector('#insp [data-act=order][data-v=qfirst]').disabled"))
    pick(t14); pg.click('#insp .tn-grid [data-act=tn][data-v=auto]'); pick(t14, 'G2')
    chk('Chọn bài đọc: panel Bài đọc', 'Bài đọc' in E("document.querySelector('#insp h2').textContent"))
    pg.click('#insp [data-act=order][data-v=qfirst]')
    chk('Tự động + câu hỏi trước: bố cục tự về Xếp dọc (ảnh trên), Ảnh trong bài đọc bị khóa', T(t14, "[layoutOf(t), !!layoutReasons(t).T8]") == ['T1', True], T(t14, "[layoutOf(t), layoutReasons(t).T8]"))
    o = E(f"(()=>{{const el=document.querySelector('#stage .task[data-task=\"{t14}\"]'),p=el.querySelector('.passage'),q=el.querySelector('.q');return !!(p&&q&&(q.compareDocumentPosition(p)&Node.DOCUMENT_POSITION_FOLLOWING))}})()")
    chk('Câu hỏi trước bài đọc', o and T(t14, "t.layout.order") == 'qfirst')
    # 11. Lưu JSON rồi nạp lại: giữ đủ trường mới, trang giống hệt
    E("window.__ws.pick({type:'sheet'})"); pg.wait_for_timeout(50)
    h0 = E("[...document.querySelectorAll('#stage .page')].map(p=>p.outerHTML).join('')")
    r = E("(()=>{const J=readJson(JSON.stringify(ws));if(J.err)return J.err;loadSheet(J.sheet);return 'ok'})()"); pg.wait_for_timeout(300); E("window.__ws.pick({type:'sheet'})"); pg.wait_for_timeout(50)
    h1 = E("[...document.querySelectorAll('#stage .page')].map(p=>p.outerHTML).join('')")
    h0 = re.sub(r' (cur|on|sel)(?=[" ])', '', h0); h1 = re.sub(r' (cur|on|sel)(?=[" ])', '', h1)
    if h0 != h1:
        i = next((k for k in range(min(len(h0), len(h1))) if h0[k] != h1[k]), 0); print('  khác:', h0[max(0, i - 150):i + 100], '\n  nạp lại:', h1[max(0, i - 150):i + 100])
    chk('JSON: lưu rồi nạp lại giữ nguyên trang (ví dụ, dòng chữ, câu hỏi trước, nhãn Yes/No)', r == 'ok' and h0 == h1 and T(t14, "t.layout.order") == 'qfirst', r)
    E("render()"); pg.wait_for_timeout(300)
    chk('Không cảnh báo tràn trang', pg.inner_text('#diagBadge') == 'Không lỗi tràn', pg.inner_text('#diagBadge'))
    pg.screenshot(path=os.path.join(ROOT, 'logs', 'test29.png'), full_page=False)
    chk('0 lỗi console', not errs, errs[:3])
    print('ERRS', errs)
    b.close()
print('ALL OK' if ok else 'SOME FAIL')
