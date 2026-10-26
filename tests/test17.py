# v68: Task nhiều phần ("Nối vào Task trên") + phiếu thật thứ hai "A Surprise Birthday Party" (PDF 6 Task, MD người dùng nhận từ AI có 8 Task)
# Cách chạy: python3 test17.py <đường dẫn tuyệt đối tới ws-editor-prototype.html>
import sys, os
from playwright.sync_api import sync_playwright
ok = True
def chk(n, c, i=''):
    global ok; print(('PASS ' if c else 'FAIL ') + n, i if not c else ''); ok = ok and bool(c)
HERE = os.path.dirname(os.path.abspath(__file__))
USER8 = open(os.path.join(HERE, 'real', 'birthday-user2.md'), encoding='utf-8').read()   # MD người dùng nhận từ AI (prompt v67, tách Task 6 làm 3), không sửa tay
NEW6 = open(os.path.join(HERE, 'md', 'birthday6.md'), encoding='utf-8').read()           # MD theo prompt / quy ước v68: 6 Task, Task 6 có 2 phần nối
SHOTS = os.path.join(HERE, '..', 'shots'); os.makedirs(SHOTS, exist_ok=True)
ROWS = """raw=>{const J=readMd(raw); if(J.err) return J; return J.tasks.map(r=>r.t?{no:r.no, j:!!r.joined, brk:r.t.layout.break||null, title:r.t.title, ins:r.t.instruction, desc:descOf(r.t), A:r.t.answer.layout, up:!!r.t.answer.params.upper, lab:r.t.answer.params.lab||'', n:its(r.t).length, keys:its(r.t).map(x=>x.key==null?null:x.key), notes:r.notes, warn:contentWarnings(r.t).filter(w=>w.lv!=='info').map(w=>w.m)}:{err:r.err})}"""
def load(pg, md):
    pg.click('#tree [data-newsheet]'); pg.wait_for_timeout(300); pg.fill('#pasteTa', md); pg.wait_for_timeout(800)
    pg.click('#pasteOk'); pg.wait_for_timeout(300)
    if pg.is_visible('#pasteOk'): pg.click('#pasteOk'); pg.wait_for_timeout(1200)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 900}); errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_' not in m.text and 'fonts' not in m.text else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.goto('file://' + sys.argv[1]); pg.wait_for_timeout(1300)

    # ---- 1) MD người dùng nhận (8 khối, Task 6 bị tách): vẫn đọc, ghi chú đúng, không còn lỗi lặp hướng dẫn
    U = pg.evaluate(ROWS, USER8)
    chk('MD cũ: 8 khối, không khối nào nối (đúng như file)', isinstance(U, list) and len(U) == 8 and not any(t['j'] for t in U), U if not isinstance(U, list) else len(U))
    chk('v84: MD viết A. B. C. → nhãn mặc định chữ thường (Task 2, 5)', not U[1]['up'] and not U[4]['up'] and U[1]['lab'] == '', (U[1], U[4]))
    chk('MD cũ: Task 1 và Task 7 là ô tick', U[0]['A'] == 'A4' and U[0]['lab'] == 'box' and U[6]['A'] == 'A4' and U[6]['lab'] == 'box', (U[0], U[6]))

    # ---- 2) MD mới: 6 Task, Task 6 có 3 phần
    N = pg.evaluate(ROWS, NEW6)
    chk('MD mới: 8 khối (6 Task + 2 phần nối)', isinstance(N, list) and len(N) == 8, N if not isinstance(N, list) else len(N))
    chk('MD mới: khối 7, 8 là phần nối (layout.break = join)', [t['j'] for t in N] == [False] * 6 + [True, True] and [t['brk'] for t in N][6:] == ['join', 'join'], [(t['j'], t['brk']) for t in N])
    chk('MD mới: nhãn 6a/6b/6c', [t['no'] for t in N][5:] == ['6a', '6b', '6c'], [t['no'] for t in N])
    chk('MD mới: mỗi phần giữ loại đáp án riêng', [t['desc'] for t in N][5:] == ['Câu hỏi · điền chỗ trống', 'Câu hỏi · tick lựa chọn', 'Câu hỏi · điền chỗ trống'], [t['desc'] for t in N][5:])
    chk('MD mới: phần 6c không chép hướng dẫn trước', N[7]['ins'] == '' and N[6]['ins'].startswith('Which party activity'), (N[6]['ins'], N[7]['ins']))
    chk('MD mới: không cảnh báo đỏ', all(not t['warn'] for t in N), [t['warn'] for t in N])
    # MD thật do AI tạo bằng prompt v68 (người dùng gửi 25/10 lần 5): giữ nguyên không sửa tay; hiện trùng từng chữ với md/birthday6.md
    R68 = pg.evaluate(ROWS, open(os.path.join(HERE, 'real', 'birthday-prompt68.md'), encoding='utf-8').read())
    chk('MD thật prompt v68: 6 Task + 2 phần nối, 6a/6b/6c, cùng kết quả đọc như MD mẫu', isinstance(R68, list) and R68 == N and [t['no'] for t in R68][5:] == ['6a', '6b', '6c'], R68 if not isinstance(R68, list) else len(R68))

    # ---- 3) + Phiếu từ MD mới
    pg.click('#tree [data-newsheet]'); pg.wait_for_timeout(300); pg.fill('#pasteTa', NEW6); pg.wait_for_timeout(800)
    tbl = pg.inner_text('#pasteOut')
    chk('bảng nhận diện: “6 Task (Task 6 có 3 phần)”', '6 Task (Task 6 có 3 phần)' in tbl, tbl[:120])
    chk('bảng nhận diện: dòng 6a 6b 6c, không dòng đỏ', all(x in tbl for x in ['6a.', '6b.', '6c.']) and pg.locator('#pasteOut .imrow.bad').count() == 0, tbl[:300])
    pg.click('#pasteOk'); pg.wait_for_timeout(300)
    if pg.is_visible('#pasteOk'): pg.click('#pasteOk'); pg.wait_for_timeout(1200)
    pages = pg.evaluate("document.querySelectorAll('.page').length")
    chk('+ Phiếu: 8 khối, ≤ 3 trang, 0 tràn', pg.evaluate('ws.tasks.length') == 8 and pages <= 3 and pg.inner_text('#diagBadge') == 'Không lỗi tràn', (pages, pg.inner_text('#diagBadge')))
    chk('số Task 1,2,3,4,5,6,6,6 và phần a b c', pg.evaluate("ws.tasks.map(t=>t.number+(t.part||'')).join(' ')") == '1 2 3 4 5 6a 6b 6c' or pg.evaluate("ws.tasks.map(t=>t.number+(t.part||'')).join(' ')") == '1 2 3 4 5 6a 6b 6c', pg.evaluate("ws.tasks.map(t=>t.number+(t.part||'')).join(' ')"))
    chk('trang: 6 vòng số Task, phần nối không có vòng số', pg.locator('.page .g0 .num').count() == 6, pg.locator('.page .g0 .num').count())
    ids = pg.evaluate('ws.tasks.map(t=>t.id)')
    chk('trang: Task 6b có hướng dẫn riêng, không số, không tiêu đề', pg.locator(f'.task[data-task="{ids[6]}"] .g0.jn .ins').count() == 1 and pg.locator(f'.task[data-task="{ids[6]}"] .num').count() == 0 and pg.locator(f'.task[data-task="{ids[6]}"] .ttl').count() == 0)
    chk('trang: Task 6c không có G0', pg.locator(f'.task[data-task="{ids[7]}"] .g0').count() == 0)
    # căn lề: hướng dẫn của phần nối thẳng cột chữ với tiêu đề Task 6
    xs = pg.evaluate(f"""()=>{{const a=document.querySelector('.task[data-task="{ids[5]}"] .ttl').getBoundingClientRect().left, b=document.querySelector('.task[data-task="{ids[6]}"] .g0.jn .ins').getBoundingClientRect().left; return [a,b]}}""")
    chk('hướng dẫn phần nối thẳng đường dóng với tiêu đề Task', abs(xs[0] - xs[1]) < 1.5, xs)
    # khoảng cách giữa các phần = khoảng cách giữa các nhóm (Vừa = 4 mm), không phải khoảng cách giữa Task (8 mm)
    gaps = pg.evaluate(f"""()=>{{const f=id=>document.querySelector('.task[data-task="'+id+'"]'); const r=[];
      for(const [a,b] of [['{ids[5]}','{ids[6]}'],['{ids[6]}','{ids[7]}'],['{ids[3]}','{ids[4]}']]) {{ const A=f(a),B=f(b); r.push(Math.round((B.offsetTop-(A.offsetTop+A.offsetHeight))/3.7795*10)/10) }} return r}}""")
    chk('khoảng cách 6a→6b và 6b→6c = 4 mm (Giữa các nhóm); 4→5 = 8 mm (Giữa các Task)', abs(gaps[0] - 4) < .6 and abs(gaps[1] - 4) < .6 and abs(gaps[2] - 8) < .6, gaps)
    # số câu: Task chỉ 1 câu không đánh số nhưng vẫn chừa lề
    vis = pg.evaluate(f"""()=>{{const v=id=>[...document.querySelectorAll('.task[data-task="'+id+'"] .ino')].map(e=>getComputedStyle(e).visibility); return {{t1:v('{ids[0]}'),t2:v('{ids[1]}'),t3:v('{ids[2]}'),t6b:v('{ids[6]}'),t6c:v('{ids[7]}')}}}}""")
    chk('1 câu: số ẩn (Task 1, 2, 6b, 6c); nhiều câu: số hiện (Task 3)', all(x == 'hidden' for x in vis['t1'] + vis['t2'] + vis['t6b'] + vis['t6c']) and all(x == 'visible' for x in vis['t3']) and len(vis['t3']) == 4, vis)
    lefts = pg.evaluate(f"""()=>{{const L=id=>document.querySelector('.task[data-task="'+id+'"] .qb, .task[data-task="'+id+'"] .c2 > span:not(.ino)').getBoundingClientRect().left; return [L('{ids[1]}'),L('{ids[2]}')]}}""")
    chk('1 câu: chữ vẫn thẳng lề với Task nhiều câu', abs(lefts[0] - lefts[1]) < 1.5, lefts)
    chk('v84: chữ thường a b c ở Task 2 và 5', pg.evaluate(f"""()=>['{ids[1]}','{ids[4]}'].every(id=>[...document.querySelectorAll('.task[data-task="'+id+'"] .opt b')].every(e=>/^[abc]$/.test(e.textContent.trim())))"""))
    for i in range(pages): pg.locator('.page').nth(i).screenshot(path=os.path.join(SHOTS, f'p17_birthday6_{i+1}.png'))

    # ---- 4) Công tắc nối: cột trái + Inspector, hoàn tác, Task đầu không nối được
    pg.evaluate(f"sel={{type:'task', id:'{ids[2]}'}}; openTask='{ids[2]}'; refreshSel()"); pg.wait_for_timeout(300)
    btn = pg.locator(f'#tree .tk.open [data-eact="tjoin"]')
    chk('cột trái: nút “Nối Task”', btn.count() == 1 and 'Nối Task' in btn.inner_text())
    btn.click(); pg.wait_for_timeout(500)
    chk('bấm nối: Task 3 thành phần b của Task 2, các số dịch', pg.evaluate("ws.tasks[2].layout.break") == 'join' and pg.evaluate("ws.tasks.map(t=>t.number+(t.part||'')).join(' ')") == '1 2a 2b 3 4 5a 5b 5c', pg.evaluate("ws.tasks.map(t=>t.number+(t.part||'')).join(' ')"))
    chk('nối xong vẫn 0 tràn', pg.inner_text('#diagBadge') == 'Không lỗi tràn', pg.inner_text('#diagBadge'))
    pg.evaluate(f"sel={{type:'task', id:'{ids[2]}'}}; refreshSel()"); pg.wait_for_timeout(300)
    segs = pg.evaluate("[...document.querySelectorAll('#insp [data-p=\"break\"]')].map(b=>b.textContent.trim()+(b.classList.contains('on')?'*':''))")
    chk('Inspector: mục Ngắt trang có “Nối vào Task trên” đang chọn', any(s.startswith('Nối vào Task trên') and s.endswith('*') for s in segs), segs)
    pg.keyboard.press('Control+z'); pg.wait_for_timeout(400)
    chk('hoàn tác bỏ nối', not pg.evaluate("ws.tasks[2].layout.break") and pg.evaluate("ws.tasks.map(t=>t.number+(t.part||'')).join(' ')") == '1 2 3 4 5 6a 6b 6c')
    pg.evaluate(f"sel={{type:'task', id:'{ids[0]}'}}; openTask='{ids[0]}'; refreshSel()"); pg.wait_for_timeout(300)
    chk('Task đầu phiếu: nút nối bị khóa', pg.locator('#tree .tk.open [data-eact="tjoin"]').is_disabled())

    # ---- 5) Phân trang: phần nối không bao giờ đứng đầu trang / lạc khỏi Task trên
    bad = pg.evaluate("""()=>{ const out=[], orig=ws.tasks;
      const mk=(id,src)=>{const c=clone(src); c.id=id; delete c.number; delete c.part; return c};
      try { for (let n=0;n<=8;n++){
        const pad=[]; for(let i=0;i<n;i++) pad.push(mk('pad'+i, orig[3]));
        const grp=[orig[5],orig[6],orig[7]].map((t,i)=>mk('g'+i,t));
        ws.tasks=[mk('h0',orig[0]), ...pad, ...grp];
        const r=paginate(), where={};
        r.pages.forEach((pgi,pi)=>pgi.items.forEach((x,k)=>{ if(!(x.frag&&x.frag.cont)&&!(x.t.id in where)) where[x.t.id]=pi;
          if(k===0 && x.t.layout.break==='join' && !(x.frag&&x.frag.cont)) out.push('n='+n+': trang '+(pi+1)+' bắt đầu bằng phần nối') }));
        if(!(where.g0===where.g1 && where.g1===where.g2)) out.push('n='+n+': các phần tách trang '+[where.g0,where.g1,where.g2].join(','));
      } } finally { ws.tasks=orig; }
      return out }""")
    chk('0..8 Task đệm: phần nối luôn cùng trang với Task trên (không đứng đầu trang)', not bad, bad[:4])

    # ---- 6) Khứ hồi MD + đáp án chạy liền qua các phần
    rt = pg.evaluate("""()=>{ const md=sheetToMd(ws), J=readMd(md); const f=t=>JSON.stringify([descOf(t), its(t).map(x=>[x.text||'', x.opts||null]), t.answer.params.lab||'', !!t.answer.params.upper, t.layout.break||null, t.instruction]);
      return [md.split('\\n').filter(l=>/^### Phần:/.test(l)).length, ws.tasks.map(f), J.tasks.map(r=>f(r.t))] }""")
    chk('khứ hồi MD: 2 dòng “### Phần:”, 8 khối giữ mô tả, câu, nhãn, nối, hướng dẫn', rt[0] == 2 and rt[1] == rt[2], [(a, b) for a, b in zip(rt[1], rt[2]) if a != b][:2])
    K = pg.evaluate(ROWS, NEW6 + "\n## Đáp án\n### Task 6\n1. cake\n2. party\n3. dog\n4. happy\n5. eating cake\n6. cake; it is sweet\n")
    keys = [t['keys'] for t in K[5:]]
    chk('đáp án “### Task 6” chạy liền qua 3 phần (4 + 1 + 1)', keys == [['cake', 'party', 'dog', 'happy'], ['eating cake'], ['cake; it is sweet']], keys)
    K2 = pg.evaluate(ROWS, NEW6 + "\n## Đáp án\nTask 2: B\n### Task 3\n1. T\n2. F\n3. T\n4. T\n")
    chk('đáp án Task thường vẫn đúng chỗ', K2[1]['keys'] == ['B'] and K2[2]['keys'] == ['T', 'F', 'T', 'T'], (K2[1]['keys'], K2[2]['keys']))

    # ---- 7) Nhập không phá phiếu: phần nối ở đầu lô không dính vào Task cuối của phiếu đang mở
    r7 = pg.evaluate("""()=>{ const t=clone(ws.tasks[6]); const n0=ws.tasks.length; addTasks([t]); const last=ws.tasks[ws.tasks.length-1]; return [ws.tasks.length-n0, last.layout.break||null] }""")
    chk('+ Task: phần nối đứng đầu lô được bỏ nối (không dính vào Task cuối phiếu cũ)', r7[0] == 1 and r7[1] is None, r7)
    pg.keyboard.press('Control+z'); pg.wait_for_timeout(300)
    j = pg.evaluate("""()=>{ const w=clone(ws); w.tasks[0].layout.break='join'; const keep=ws; ws=fillSheet(w); const warn=contentWarnings(ws.tasks[0]).map(x=>x.lv+':'+x.m); paginate(); const num=ws.tasks.map(t=>t.number).join(); ws=keep; return [warn, num] }""")
    chk('Task đầu đánh dấu nối: hiện như Task thường + ghi chú, không lỗi', len(j[0]) >= 1 and 'không nối được' in j[0][0] and j[1].startswith('1,2'), j)

    # ---- 8) Phiếu mẫu 18 Task không bị ảnh hưởng
    pg.evaluate("loadSheet(clone(SAMPLE2))"); pg.wait_for_timeout(800)
    chk('phiếu mẫu 18 Task: không phần nối, số 1..18 liền', pg.evaluate("ws.tasks.map(t=>t.number).join()") == ','.join(str(i) for i in range(1, 19)) and pg.evaluate("ws.tasks.every(t=>!t.part)"), pg.evaluate("ws.tasks.map(t=>t.number).join()"))
    chk('0 lỗi console', not errs, errs)
    b.close()
print('ALL OK' if ok else 'SOME FAIL')
