# v83 (V4): đổi Dạng câu hỏi đi một vòng quay lại phải về đúng như lần trình bày gần nhất (không mất nội dung đã nhập)
import sys, json
from playwright.sync_api import sync_playwright
F = 'file://' + sys.argv[1]; ok = True
def chk(n, c, x=''):
    global ok; print(('PASS ' if c else 'FAIL '), n, str(x)[:600] if not c else ''); ok &= bool(c)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 1000}); errs = []
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_' not in m.text and 'font' not in m.text.lower() else None)
    pg.goto(F); pg.wait_for_timeout(1200)
    E = pg.evaluate
    # chữ ký của một Task: dữ liệu (bỏ qmem) + HTML vẽ trên trang (bỏ dấu chọn)
    E("""(() => { const canon = o => Array.isArray(o) ? o.map(canon) : o && typeof o === 'object' ? Object.fromEntries(Object.keys(o).sort().map(k => [k, canon(o[k])])) : o; window.__sig = tid => { const t = ws.tasks.find(x => x.id === tid), c = canon(JSON.parse(JSON.stringify(t))); delete c.qmem; delete c.qmemLin;
      const h = (document.querySelector('.task[data-task="' + tid + '"]') || {}).outerHTML || ''; return JSON.stringify(c) + '\\n' + h.replace(/ (cur|sel)\\b/g, '').replace(/class="task[^"]*"/, 'class="task"'); }; return 1 })()""")
    E("(() => { window.__go = (tid, q) => { commit(w => qCmd(w.tasks.find(x => x.id === tid), 'q', q)); }; return 1 })()")
    ids = E("ws.tasks.map(t=>t.id)")
    bad = []; n = 0
    for tid in ids:
        q0 = E(f"qOf(ws.tasks.find(t=>t.id==='{tid}'))")
        if not q0: continue
        qs = [q for q in E(f"(()=>{{const t=ws.tasks.find(x=>x.id==='{tid}');const r=qReasons(t);return QORDER.filter(q=>!r[q])}})()") if q != q0]
        s0 = E(f"__sig('{tid}')")
        for q in qs:
            E(f"__go('{tid}','{q}')"); E(f"__go('{tid}','{q0}')"); n += 1
            if E(f"__sig('{tid}')") != s0: bad.append((tid, q0, q))
            for _ in range(2): pg.click('#undo')
            if E(f"__sig('{tid}')") != s0: bad.append((tid, q0, q, 'undo'))
    chk(f'a → b → a: {n} cặp đều về đúng dữ liệu + HTML vẽ ban đầu (mọi Task)', not bad, bad[:12])
    # đi vòng dài a → b → c → a (mỗi Task, vài cặp b, c)
    bad = []; m = 0
    for tid in ids:
        q0 = E(f"qOf(ws.tasks.find(t=>t.id==='{tid}'))")
        if not q0: continue
        qs = [q for q in E(f"(()=>{{const t=ws.tasks.find(x=>x.id==='{tid}');const r=qReasons(t);return QORDER.filter(q=>!r[q])}})()") if q != q0]
        s0 = E(f"__sig('{tid}')")
        for i, q1 in enumerate(qs):
            q2 = qs[(i * 5 + 3) % len(qs)]
            if q2 == q1: continue
            E(f"__go('{tid}','{q1}')")
            if E(f"qReasons(ws.tasks.find(t=>t.id==='{tid}'))['{q2}']"): E(f"__go('{tid}','{q0}')"); continue
            E(f"__go('{tid}','{q2}')"); E(f"__go('{tid}','{q0}')"); m += 1
            if E(f"__sig('{tid}')") != s0: bad.append((tid, q0, q1, q2))
            while not pg.eval_on_selector('#undo', 'e=>e.disabled'): pg.click('#undo')
    chk(f'a → b → c → a: {m} vòng đều về đúng ban đầu', not bad, bad[:12])
    # nội dung sửa ở dạng khác không mất
    t4 = 't4'
    E(f"__go('{t4}','Q2')"); E("commit(w => { w.tasks.find(x=>x.id==='t4').content.items[0].text = 'She ___ my teacher.' })")
    E(f"__go('{t4}','Q3')")
    r = E("(()=>{const x=ws.tasks.find(t=>t.id==='t4').content.items[0];return [x.text,x.opts]})()")
    chk('Q3 → Q2 (sửa chữ câu 1) → Q3: chữ mới giữ, lựa chọn đã nhập khôi phục', r[0] == 'She ___ my teacher.' and r[1] == ['am', 'is', 'are'], r)
    for _ in range(40):
        if pg.eval_on_selector('#undo', 'e=>e.disabled'): break
        pg.click('#undo')
    # thêm câu / xóa câu ở dạng khác
    E("__go('t4','Q2')"); E("commit(w => { const c = w.tasks.find(x=>x.id==='t4').content; c.items.push({ id: 'qnew', text: 'Extra ___.' }); c.items.splice(1, 1); })")
    E("__go('t4','Q3')")
    r = E("(()=>{const it=ws.tasks.find(t=>t.id==='t4').content.items;return [it.length, it.map(x=>x.id).join(), it[0].opts]})()")
    chk('thêm 1 câu + xóa câu 2 ở dạng khác: về Q3 còn 5 câu (có câu mới, mất câu 2), câu cũ giữ lựa chọn', r[0] == 5 and 'qnew' in r[1] and 'q2' not in r[1].split(',') and r[2] == ['am', 'is', 'are'], r)
    for _ in range(40):
        if pg.eval_on_selector('#undo', 'e=>e.disabled'): break
        pg.click('#undo')
    # qmem lưu trong JSON phiếu, nạp lại vẫn đi vòng được; nhập MD không thêm qmem
    E("__go('t1','Q1')")
    js = E("JSON.stringify(ws)")
    chk('JSON phiếu mang theo qmem', '"qmem"' in js)
    E("window.__ws.pick({type:'task',id:'t1'})")
    tot = E("ws.tasks.filter(t=>t.qmem).length")
    chk('chỉ Task đã đổi dạng mới có qmem', tot == 1, tot)
    # qua Bảng: danh sách ↔ bảng
    for _ in range(40):
        if pg.eval_on_selector('#undo', 'e=>e.disabled'): break
        pg.click('#undo')
    s0 = E("__sig('t8')"); E("__go('t8','Q10')"); E("__go('t8','Q2')")
    chk('Q2 → Bảng (Q10) → Q2 về đúng', E("__sig('t8')") == s0)
    chk('0 lỗi tràn cuối', pg.inner_text('#diagBadge') == 'Không lỗi tràn', pg.inner_text('#diagBadge'))
    print('ERRS', errs); print('ALL OK' if ok and not errs else 'SOME FAIL')
    b.close()
