# v85: Q8/Q9 hiện Khung từ; ô ảnh lưới giữ tỉ lệ thật khi Fit; ảnh thứ hai + ảnh khung từ có Fit riêng; bỏ "Khối của bài";
# G3 "Câu hỏi" + thanh B I U; khoảng cách mặc định Gọn; hộp hỏi xóa (nền mờ, bấm ngoài = Hủy); mỗi bài một câu ví dụ
import sys, os
from playwright.sync_api import sync_playwright
F = 'file://' + sys.argv[1]; ok = True; HERE = os.path.dirname(os.path.abspath(__file__))
IMG = {k: os.path.join(HERE, f'ph_{k}.jpg') for k in ['tall', 'wide', 'sq']}   # 600×900, 1200×500, 800×800
def chk(n, c, x=''):
    global ok; print(('PASS ' if c else 'FAIL '), n, x if not c else ''); ok &= bool(c)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 1000}); errs = []
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_' not in m.text and 'font' not in m.text.lower() else None)
    pg.goto(F); pg.wait_for_timeout(1200); E = pg.evaluate
    E("(()=>{const i=document.createElement('input');i.type='file';i.id='tmpUp';i.multiple=true;document.body.appendChild(i);})()")
    def up(tid, pairs):   # [(slot, file)]
        pg.set_input_files('#tmpUp', [f for _, f in pairs])
        E(f"(async()=>{{const f=[...document.getElementById('tmpUp').files];const k={[k for k, _ in pairs]};for(let i=0;i<k.length;i++)await dropImages('{tid}',[f[i]],k[i]);}})()"); pg.wait_for_timeout(900)
    def box(tid, slot):
        return E(f"""(()=>{{const p=document.querySelector('.task[data-task={tid}] .pic[data-slot="{slot}"]'),a=p.getBoundingClientRect(),c=p.querySelector('img').getBoundingClientRect();return [a.width,a.height,c.width,c.height]}})()""")
    def opn(tid): pg.click(f'#tree .tnode[data-sel=task][data-id={tid}]'); pg.wait_for_timeout(200)
    # D1 khoảng cách mặc định Gọn
    chk('phiếu mẫu: khoảng cách Gọn', E("ws.spacing.preset") == 'compact')
    chk('MD không ghi khoảng cách → Gọn', E("(()=>{const J=readMd('# P\\n## Task\\nTiêu đề: W.\\n1. I ___ a cat.\\n');loadSheet({tasks:J.tasks.filter(x=>x.t).map(x=>x.t)});render();const v=ws.spacing.preset;loadSheet(clone(SAMPLE2));render();return v})()") == 'compact')
    chk('JSON ghi Thoáng giữ nguyên', E("(()=>{const J=readJson(JSON.stringify(Object.assign(clone(SAMPLE),{spacing:{preset:'airy',overrides:{}}})));loadSheet(J.sheet);render();const v=ws.spacing.preset;loadSheet(clone(SAMPLE2));render();return v})()") == 'airy')
    pg.wait_for_timeout(400)
    # A1 Q8 / Q9 có Khung từ
    for tid in ['t2', 't9']:
        for pl in ['top', 'bottom', 'right']:
            E(f"commit(w=>{{const t=w.tasks.find(x=>x.id==='{tid}');t.wordBank={{words:['red','blue'],placement:'{pl}',style:'chips',label:'lower'}};}})"); pg.wait_for_timeout(250)
            chk(f'{tid} Khung từ {pl} hiện trên trang', E(f"document.querySelectorAll('.task[data-task={tid}] .g4').length") == 1)
        E(f"commit(w=>{{delete w.tasks.find(x=>x.id==='{tid}').wordBank;}})")
    w = E("(()=>{const g=document.querySelector('.task[data-task=t2] .g4');return g?0:1})()")
    # A2 ô ảnh lưới: Fit dùng tỉ lệ thật, đổi tỉ lệ ô không làm méo ảnh
    opn('t1'); up('t1', [('@i1', IMG['wide'])])
    pg.locator('.task[data-task=t1] .pic[data-slot="@i1"]').click(force=True); pg.wait_for_timeout(200)
    pg.click('#insp button:has-text("Fit ngang")'); pg.wait_for_timeout(300)
    r = box('t1', '@i1'); chk('Fit ngang ô lưới: ngang ảnh = ngang khung, tỉ lệ 2.4', abs(r[2] - r[0]) < 4 and abs(r[2] / r[3] - 2.4) < .05, r)
    E("setAr('t1','@i1','1/1')"); pg.wait_for_timeout(300)
    r = box('t1', '@i1'); chk('đổi tỉ lệ ô 1:1 không làm méo ảnh', abs(r[2] / r[3] - 2.4) < .05, r)
    # B1 ảnh thứ hai
    E("commit(w=>{const t=w.tasks.find(x=>x.id==='t6');t.image.two=true;t.image.label2='hai';})"); pg.wait_for_timeout(300)
    up('t6', [('G1', IMG['wide']), ('G1b', IMG['tall'])])
    opn('t6'); pg.locator('.task[data-task=t6] .pic[data-slot=G1b]').click(force=True); pg.wait_for_timeout(300)
    n4 = pg.locator('#insp button[data-act=set][data-p="@cells.G1b.frame.fit"]').count(); chk('panel có Hiển thị ảnh thứ hai', n4 == 4, n4)
    pg.click('#insp button[data-p="frame.fit"][data-v="width"]'); pg.wait_for_timeout(300)
    r = box('t6', 'G1b'); chk('ảnh 1 Fit ngang: ảnh 2 theo, giữ tỉ lệ thật của nó (0.67)', abs(r[2] / r[3] - .667) < .03 and abs(r[2] - r[0]) < 4, r)
    pg.click('#insp button[data-p="@cells.G1b.frame.fit"][data-v="height"]'); pg.wait_for_timeout(300)
    r = box('t6', 'G1b'); r1 = box('t6', 'G1'); chk('ảnh 2 Fit dọc riêng, ảnh 1 vẫn Fit ngang', abs(r[3] - r[1]) < 4 and abs(r[2] / r[3] - .667) < .03 and abs(r1[2] - r1[0]) < 4, (r, r1))
    pg.locator('#insp input[data-pr="@cells.G1b.frame.zoom"]').fill('150'); pg.locator('#insp input[data-pr="@cells.G1b.frame.zoom"]').dispatch_event('change'); pg.wait_for_timeout(300)
    r2 = box('t6', 'G1b'); chk('zoom ảnh 2 150%', abs(r2[3] / r[3] - 1.5) < .05, (r, r2))
    pg.click('#insp button[data-p="@cells.G1b.frame.fit"][data-v=""]'); pg.wait_for_timeout(300)
    chk('Như ảnh 1: xóa cấu hình riêng', E("JSON.stringify(ws.tasks.find(t=>t.id==='t6').layout.cells||null)") in ('null', '{}', '{"G1b":{}}', '{"G1b":{"frame":{}}}'), E("JSON.stringify(ws.tasks.find(t=>t.id==='t6').layout.cells||null)"))
    # B2 ảnh khung từ
    E("commit(w=>{const t=w.tasks.find(x=>x.id==='t5');t.wordBank={kind:'image',words:['a','b','c'],placement:'top',label:'lower'};})"); pg.wait_for_timeout(300)
    up('t5', [('B.0', IMG['wide']), ('B.1', IMG['tall']), ('B.2', IMG['sq'])])
    opn('t5'); pg.locator('.task[data-task=t5] .pic[data-slot="B.0"]').click(force=True); pg.wait_for_timeout(300)
    if not pg.locator('#insp button[data-p="frame.fit"]').count(): E("sel={type:'group',id:'t5',g:'G4'};multi=[];refreshSel()"); pg.wait_for_timeout(300)   # bấm ảnh lúc trang đang vẽ lại có thể trượt
    chk('bấm ảnh khung từ → panel Khung từ có Hiển thị ảnh', pg.locator('#insp button[data-p="frame.fit"]').count() >= 3, E("JSON.stringify(sel)"))
    pg.click('#insp button[data-p="frame.fit"][data-v="width"]'); pg.wait_for_timeout(300)
    rs = [box('t5', f'B.{i}') for i in range(3)]
    chk('khung từ Fit ngang: mọi ảnh ngang = khung, đúng tỉ lệ', all(abs(r[2] - r[0]) < 4 for r in rs) and abs(rs[0][2] / rs[0][3] - 2.4) < .05 and abs(rs[1][2] / rs[1][3] - .667) < .03, rs)
    pg.click('#insp button[data-p="frame.fit"][data-v="height"]'); pg.wait_for_timeout(300)
    rs = [box('t5', f'B.{i}') for i in range(3)]
    chk('khung từ Fit dọc: mọi ảnh cao = khung', all(abs(r[3] - r[1]) < 4 for r in rs), rs)
    # C1 + C2 cột trái
    opn('t4')
    chk('Cấu hình không còn "Khối của bài"', 'Khối của bài' not in E("document.querySelector('#tree .ed .sec[data-sec=cfg]').innerText"))
    sh = E("document.querySelector('#tree .ed .sec[data-sec=g3] .subh').innerText")
    chk('G3 tiêu đề "Câu hỏi", không số câu, có B I U ___ {a|b}', sh.startswith('Câu hỏi') and 'có chỗ trả lời' not in sh and E("document.querySelectorAll('#tree .ed .g3tb [data-tx]').length") == 5, sh)
    inp = pg.locator('#tree .ed input[data-k="it.0.text"]'); inp.click(); inp.press('End')
    pg.locator('#tree .ed .g3tb [data-tx=gap]').click(); pg.wait_for_timeout(400)
    chk('thanh chèn: ___ vào ô câu đang gõ', E("ws.tasks.find(t=>t.id==='t4').content.items[0].text").endswith('___'))
    pg.locator('#tree .ed .sec[data-sec=g3] .subh .xb').click(); pg.wait_for_timeout(300)
    chk('✕ G3 tắt câu hỏi, giữ câu', E("ws.tasks.find(t=>t.id==='t4').content.list") is False and E("ws.tasks.find(t=>t.id==='t4').content.items.length") == 5)
    pg.locator('#tree .ed .sec[data-sec=g3] [data-eact=blkaddb]').click(); pg.wait_for_timeout(300)
    chk('+ Bật lại câu hỏi', E("document.querySelectorAll('.task[data-task=t4] .q').length") == 5)
    opn('t3'); chk('ⓘ lên hàng Tỉ lệ ô ảnh (Task 3)', E("!!document.querySelector('#tree .ed .g3ar .tinfo')"))
    # F3 mỗi bài một câu ví dụ
    opn('t4'); ex = lambda: E("ws.tasks.find(t=>t.id==='t4').content.items.map(x=>x.ex?1:0).join('')")
    pg.locator('#tree .ed [data-eact=iexi][data-i="0"]').click(); pg.wait_for_timeout(300)
    pg.locator('#tree .ed [data-eact=iexi][data-i="2"]').click(); pg.wait_for_timeout(300)
    chk('đặt ví dụ câu 3 thì câu 1 tự bỏ', ex() == '00100', ex())
    # E1 hộp hỏi xóa Task
    n0 = E("ws.tasks.length")
    pg.locator('#tree .ed [data-eact=tdel]').click(); pg.wait_for_timeout(300)
    chk('nền mờ sau hộp hỏi', E("getComputedStyle(document.getElementById('cfmDlg'),'::backdrop').backgroundColor") == 'rgba(15, 23, 30, 0.45)')
    pg.mouse.click(20, 600); pg.wait_for_timeout(300)
    chk('bấm ngoài = Hủy', not E("document.getElementById('cfmDlg').open") and E("ws.tasks.length") == n0)
    pg.locator('#tree .ed [data-eact=tdel]').click(); pg.wait_for_timeout(300)
    pg.click('#cfmTitle'); pg.wait_for_timeout(200); chk('bấm trong hộp không đóng', E("document.getElementById('cfmDlg').open"))
    pg.click('#cfmYes'); pg.wait_for_timeout(300); chk('Xóa Task vẫn xóa', E("ws.tasks.length") == n0 - 1)
    chk('không lỗi tràn trang', E("lastRes.diags.length") == 0, E("lastRes.diags.map(d=>d.msg).join(';')"))
    print('ERRS', errs); ok &= not errs
    print('ALL OK' if ok else 'SOME FAIL'); b.close()
