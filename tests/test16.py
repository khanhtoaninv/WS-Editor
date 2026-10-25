# v67: phiếu thật đầu tiên "A Surprise Birthday Party" (PDF → MD do AI khác viết theo prompt cũ, và MD theo prompt mới)
# Cách chạy: python3 test16.py <đường dẫn tuyệt đối tới ws-editor-prototype.html>
import sys, json, os
from playwright.sync_api import sync_playwright
ok = True
def chk(n, c, i=''):
    global ok; print(('PASS ' if c else 'FAIL ') + n, i if not c else ''); ok = ok and bool(c)
HERE = os.path.dirname(os.path.abspath(__file__))
USER = open(os.path.join(HERE, 'real', 'birthday-user.md'), encoding='utf-8').read()   # MD người dùng nhận từ AI (prompt cũ), không sửa tay
NEW = open(os.path.join(HERE, 'md', 'birthday.md'), encoding='utf-8').read()           # MD theo prompt / quy ước v67
SHOTS = os.path.join(HERE, '..', 'shots'); os.makedirs(SHOTS, exist_ok=True)
ROWS = """raw=>{const J=readMd(raw); if(J.err) return J; return J.tasks.map(r=>r.t?{title:r.t.title, ins:r.t.instruction, desc:descOf(r.t), A:r.t.answer.layout, att:r.t.answer.attach, lab:r.t.answer.params.lab||'',
  lead:leadText(r.t), items:its(r.t).map(x=>({text:x.text==null?null:x.text, opts:x.opts||null, imgs:x.imgs||null, lines:x.lines||null, who:x.who==null?null:x.who})), notes:r.notes, warn:contentWarnings(r.t).filter(w=>w.lv!=='info').map(w=>w.m)}:{err:r.err})}"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 900}); errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_' not in m.text and 'fonts' not in m.text else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.goto('file://' + sys.argv[1]); pg.wait_for_timeout(1300)

    # ---- 1) MD gốc của người dùng (không sửa tay)
    U = pg.evaluate(ROWS, USER)
    chk('MD gốc: 6 Task', isinstance(U, list) and len(U) == 6, U if not isinstance(U, list) else len(U))
    alltext = [x['text'] or '' for t in U for x in t['items']]
    chk('MD gốc: không còn câu “Nội dung:”', not any(s.strip().lower().startswith('nội dung') for s in alltext), alltext)
    chk('MD gốc: không còn câu “undefined”', 'undefined' not in alltext)
    chk('MD gốc: không còn “My answer: A / B / C”', not any('my answer' in s.lower() for s in alltext))
    t1 = U[0]
    chk('Task 1: tick lựa chọn chữ = A4 ô tick, 1 câu 3 lựa chọn, không ảnh', t1['A'] == 'A4' and t1['lab'] == 'box' and len(t1['items']) == 1 and t1['items'][0]['opts'] == ['a cake', 'a football', 'balloons'] and not t1['items'][0]['imgs'], t1)
    chk('Task 1: lời nhắc cuối bài vào hướng dẫn', t1['ins'].endswith('Check them after reading.'), t1['ins'])
    t2 = U[1]
    chk('Task 2: bài đọc 3 đoạn', t2['lead'].count('\n\n') == 2, t2['lead'][:80])
    chk('Task 2: 1 câu, 3 lựa chọn A/B/C', len(t2['items']) == 1 and len(t2['items'][0]['opts'] or []) == 3 and t2['A'] == 'A4' and t2['lab'] == '', t2['items'])
    t3, t4, t5 = U[2], U[3], U[4]
    chk('Task 3: Đúng/Sai 4 câu, không còn ___', t3['A'] == 'A6' and len(t3['items']) == 4 and not any('___' in x['text'] for x in t3['items']), t3['items'])
    chk('Task 4: 4 câu, không còn ___ thừa', len(t4['items']) == 4 and not any('___' in x['text'] for x in t4['items']), t4['items'])
    chk('Task 5: 3 câu, mỗi câu 3 lựa chọn', len(t5['items']) == 3 and all(len(x['opts'] or []) == 3 for x in t5['items']) and t5['A'] == 'A4', t5['items'])
    chk('Task 1–5: không có cảnh báo đỏ', all(not t['warn'] for t in U[:5]), [t['warn'] for t in U[:5]])
    t6 = U[5]
    chk('Task 6 (trộn loại): có ghi chú “tách thành nhiều Task”', any('tách thành nhiều Task' in n for n in t6['notes']), t6['notes'])
    chk('Task 6 (trộn loại): có cảnh báo đỏ, không sai im lặng', len(t6['warn']) >= 1, t6['warn'])

    # ---- 2) MD theo prompt / quy ước mới
    N = pg.evaluate(ROWS, NEW)
    exp = ['Câu hỏi · tick lựa chọn', 'Bài đọc · khoanh A/B/C', 'Câu hỏi · Đúng/Sai', 'Câu hỏi · viết câu', 'Câu hỏi · khoanh A/B/C', 'Câu hỏi · điền chỗ trống', 'Câu hỏi · điền chỗ trống · khung từ']
    chk('MD mới: 7 Task đúng mô tả', [t['desc'] for t in N] == exp, [t['desc'] for t in N])
    chk('MD mới: số câu 1/1/4/4/3/4/1', [len(t['items']) for t in N] == [1, 1, 4, 4, 3, 4, 1], [len(t['items']) for t in N])
    chk('MD mới: không cảnh báo đỏ, không ghi chú sửa', all(not t['warn'] for t in N), [t['warn'] for t in N])
    chk('MD mới: Story Map là câu điền (không bị hiểu thành hội thoại)', all(x['who'] is None for x in N[5]['items']) and N[5]['items'][0]['text'] == 'Place of the party: ___', N[5]['items'])
    chk('MD mới: Ghi chú: vào cuối hướng dẫn', N[0]['ins'].endswith('Check them after reading.'), N[0]['ins'])

    # ---- 3) + Phiếu từ MD mới: trang, tràn, hiển thị
    pg.click('#tree [data-newsheet]'); pg.wait_for_timeout(300); pg.fill('#pasteTa', NEW); pg.wait_for_timeout(800)
    tbl = pg.inner_text('#pasteOut')
    chk('bảng nhận diện: 7 dòng, không dòng đỏ', pg.locator('#pasteOut .imrow').count() == 7 and pg.locator('#pasteOut .imrow.bad').count() == 0, tbl[:200])
    pg.click('#pasteOk'); pg.wait_for_timeout(300)
    if pg.is_visible('#pasteOk'): pg.click('#pasteOk'); pg.wait_for_timeout(1000)
    pages = pg.evaluate("document.querySelectorAll('.page').length")
    chk('+ Phiếu: 7 Task, ≤ 3 trang, 0 tràn', pg.evaluate('ws.tasks.length') == 7 and pages <= 3 and pg.inner_text('#diagBadge') == 'Không lỗi tràn', (pages, pg.inner_text('#diagBadge')))
    t1id = pg.evaluate('ws.tasks[0].id'); t2id = pg.evaluate('ws.tasks[1].id')
    chk('trang: Task 1 có 3 ô tick vuông', pg.locator(f'.task[data-task="{t1id}"] .opt b.bx').count() == 3 or pg.locator('.page .opt b.bx').count() == 3, pg.locator('.page .opt b.bx').count())
    chk('trang: ô tick bo góc', pg.evaluate("parseFloat(getComputedStyle(document.querySelector('.page .opt b.bx')).borderTopLeftRadius)") > 0)
    chk('trang: bài đọc 3 đoạn <p>', pg.locator('.page .passage p').count() == 3, pg.locator('.page .passage p').count())
    for i in range(pages): pg.locator('.page').nth(i).screenshot(path=os.path.join(SHOTS, f'p16_birthday_{i+1}.png'))

    # ---- 4) Inspector: Nhãn có ☐ ô tick, bấm đổi được, ẩn “Chữ nhãn”
    pg.evaluate(f"sel={{type:'group', id:'{t2id}', g:'G3'}}; refreshSel()"); pg.wait_for_timeout(300)
    labs = pg.evaluate("[...document.querySelectorAll('#insp button')].map(b=>b.textContent.trim()).filter(x=>/ô tick|Ⓐ|^A\\.$/.test(x))")
    chk('Inspector A4: nhãn Ⓐ / A. / ☐ ô tick', '☐ ô tick' in labs, labs)
    if '☐ ô tick' in labs:
        pg.locator('#insp button', has_text='☐ ô tick').first.click(); pg.wait_for_timeout(400)
        chk('bấm ☐ ô tick: params.lab = box, trang có ô vuông', pg.evaluate('ws.tasks[1].answer.params.lab') == 'box' and pg.locator(f'.page .opt b.bx').count() >= 6)
        chk('ô tick: ẩn “Chữ nhãn”', 'Chữ nhãn' not in pg.inner_text('#insp'))
        pg.keyboard.press('Control+z'); pg.wait_for_timeout(300)
        chk('hoàn tác về khoanh', not pg.evaluate('ws.tasks[1].answer.params.lab'))

    # ---- 5) Khứ hồi MD: sheetToMd → readMd giữ cấu hình
    rt = pg.evaluate("""()=>{const md=sheetToMd(ws), J=readMd(md); const f=t=>JSON.stringify([descOf(t), its(t).map(x=>[x.text||'', x.opts||null]), t.answer.params.lab||'', leadText(t)]);
      return [ws.tasks.map(f), J.tasks.map(r=>f(r.t))]}""")
    chk('khứ hồi MD 7 Task: giữ mô tả, câu, lựa chọn, ô tick, đoạn bài đọc', rt[0] == rt[1], [ (a,b) for a,b in zip(*rt) if a!=b ][:2])

    # ---- 6) JSON: ô tick + bài đọc nhiều đoạn qua fillTask
    j = pg.evaluate("""()=>{const t=fillTask({title:'J', content:{form:'list', lead:{kind:'passage', text:'P1.\\n\\nP2.'}, items:[{text:'', opts:['a','b']}]}, answer:{kind:'choice', attach:'item', layout:'A4', params:{lab:'box'}}}, []);
      const h=renderTask(t, null); const d=document.createElement('div'); d.innerHTML=h; return [d.querySelectorAll('.passage p').length, d.querySelectorAll('.opt b.bx').length, descOf(t)]}""")
    chk('JSON: bài đọc 2 đoạn + ô tick render đúng', j[0] == 2 and j[1] == 2 and 'tick lựa chọn' in j[2], j)

    # ---- 7) Cảnh báo mới không làm phiền phiếu mẫu (18 Task)
    pg.evaluate("loadSheet(clone(SAMPLE2))")
    pg.wait_for_timeout(600)
    sw = pg.evaluate("""()=>ws.tasks.flatMap((t,i)=>contentWarnings(t).filter(w=>/lỗi chữ|giống tiêu đề|bị trùng|ô tick ☐/.test(w.m)).map(w=>(i+1)+': '+w.m))""")
    chk('phiếu mẫu: không có cảnh báo mới nào', pg.evaluate('ws.tasks.length') >= 18 and not sw, (pg.evaluate('ws.tasks.length'), sw))

    chk('0 lỗi console', not errs, errs)
    b.close()
print('ALL OK' if ok else 'SOME FAIL')
