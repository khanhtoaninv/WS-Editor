# P2 (v65): quy ước MD trung gian — nhận ra MD, đọc 3 ví dụ (có phiếu Sea), đáp án riêng, khứ hồi 18 Task mẫu, lỗi / ghi chú
import sys, json, os, tempfile
from playwright.sync_api import sync_playwright
ok=True
def chk(n,c,i=''):
    global ok; print(('PASS ' if c else 'FAIL ')+n, i); ok = ok and bool(c)
HERE=os.path.dirname(os.path.abspath(__file__)); MD=os.path.join(HERE,'md')
SEA=open(os.path.join(HERE,'ws-sea-sample.json'),encoding='utf-8').read()
rd=lambda f: open(os.path.join(MD,f),encoding='utf-8').read()
SEAMD, MIX, LIS = rd('sea.md'), rd('mau-tron.md'), rd('nghe-bang.md')
TMP=tempfile.mkdtemp()
ROW = """r=>r.t?{title:r.t.title, ins:r.t.instruction, audio:r.t.audio||'', desc:descOf(r.t), n:(ck(r.t)==='table'?r.t.content.rows.length:its(r.t).length), A:r.t.answer.layout, att:r.t.answer.attach, keys:its(r.t).map(x=>x.key==null?null:x.key), conf:r.conf, notes:r.notes, lines:r.t.answer.params.lines||null}:{err:r.err}"""
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'fonts' not in m.text else None); pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+sys.argv[1]); pg.wait_for_timeout(1300)
    R = lambda raw: pg.evaluate("raw=>{const J=readMd(raw); if(J.err) return J; return {meta:J.meta, kind:J.kind, tasks:J.tasks.map("+ROW+")}}", raw)
    # 1) nhận ra MD trong ô nhập
    pg.click('#tree [data-lib]'); pg.wait_for_timeout(300); pg.click('#libDlg [data-tab=src]'); pg.fill('#pasteTa', SEAMD); pg.wait_for_timeout(700)
    out = pg.inner_text('#pasteOut')
    chk('ô nhập: nhận ra MD theo quy ước, 3 Task', 'MD theo quy ước' in out and pg.locator('#pasteOut .imrow').count()==3, out[:100])
    chk('MD: không có nhãn "đoán", ẩn Một Task / Cả đề', 'độ chắc thấp' not in out and pg.locator('#pasteOut .conf').count()==0 and not pg.is_visible('#libDlg .pmode'))
    chk('MD có cài đặt cấp phiếu: + Task báo chỉ lấy Task', 'cài đặt cấp phiếu' in out)
    pg.click('#libClose')
    # 2) phiếu Sea: MD ra đúng 3 Task đầu của JSON mẫu
    cmp = pg.evaluate("""([md, js])=>{const J=readMd(md), S=JSON.parse(js).tasks.slice(0,3).map(t=>fillTask(t));
      const norm=t=>{const c=t.content; return JSON.stringify({title:t.title, ins:t.instruction, desc:descOf(t), kind:t.answer.kind, A:t.answer.layout, lines:t.answer.params.lines||null,
        bank:t.wordBank?t.wordBank.words:null, tbl:c.form==='table'?{cols:c.cols.length, rows:c.rows.map(r=>r.cells.join('')), opt:t.layout.table}:null,
        items:c.form==='table'?null:its(t).map(x=>[x.who||'',x.text||''])})};
      return J.tasks.map((r,i)=>[norm(r.t), norm(S[i])])}""", [SEAMD, SEA])
    for i,(a,c) in enumerate(cmp): chk(f'Sea MD Task {i+1} = JSON mẫu (tiêu đề, hướng dẫn, ô chữ, khung từ, câu, đáp án)', a==c, '' if a==c else (a[:300], c[:300]))
    h = pg.evaluate("""([md, js])=>{const J=readMd(md); const a=estPages({title:'a', tasks:J.tasks.map(r=>r.t), age:'7-9', spacing:{preset:'normal',overrides:{}}, flow:'cont'});
      const w=fillSheet(JSON.parse(js)); w.tasks=w.tasks.slice(0,3); const b=estPages(w); return [a,b]}""", [SEAMD, SEA])
    chk('Sea MD và JSON (3 Task): cùng số trang, 0 tràn', h[0]==h[1] and h[0]['over']==0, h)
    # 3) + Phiếu từ sea.md
    pg.click('#tree [data-newsheet]'); pg.wait_for_timeout(300); pg.fill('#pasteTa', SEAMD); pg.wait_for_timeout(700)
    pg.click('#pasteOk'); pg.wait_for_timeout(300); pg.click('#pasteOk'); pg.wait_for_timeout(800)
    chk('+ Phiếu từ MD: tên phiếu, tuổi, 3 Task, 0 tràn', pg.evaluate("ws.title").startswith('Wonders of the Sea') and pg.evaluate("ws.age")=='7-9' and pg.evaluate("ws.tasks.length")==3 and pg.inner_text('#diagBadge')=='Không lỗi tràn', (pg.evaluate("ws.title"), pg.inner_text('#pageBadge')))
    pg.locator('.page').first.screenshot(path=os.path.join(HERE,'..','shots','p2_sea_md.png'))
    # 4) ví dụ 2: trộn dạng + đáp án riêng
    r = R(MIX); T = r['tasks']
    want = ['Ảnh mỗi câu · viết từ','Câu hỏi · khoanh A/B/C','Câu hỏi · điền chỗ trống · khung từ','Câu hỏi · Đúng/Sai · ảnh chung','Bài đọc · viết câu · ảnh chung']
    chk('mau-tron.md: 5 Task đúng cấu hình', [t['desc'] for t in T]==want, [t.get('desc') for t in T])
    chk('mau-tron.md: số câu 4,3,3,3,3', [t['n'] for t in T]==[4,3,3,3,3], [t['n'] for t in T])
    chk('đáp án dạng khối (### Task 1) vào đúng câu', T[0]['keys']==['cat','dog','fish','bird'], T[0]['keys'])
    chk('đáp án dạng một dòng (Task 2: is; are; an)', T[1]['keys']==['is','are','an'] and T[3]['keys']==['T','F','T'], (T[1]['keys'], T[3]['keys']))
    chk('đáp án không lẫn vào đề (không Task nào có chữ "Đáp án" / "### Task")', not any('Đáp án' in json.dumps(t,ensure_ascii=False) or '### Task' in json.dumps(t,ensure_ascii=False) for t in T))
    chk('cấp phiếu: tuổi 7-9, khoảng cách Vừa', r['meta'].get('age')=='7-9' and r['meta'].get('spacing',{}).get('preset')=='normal', r['meta'])
    chk('bài đọc: đúng chữ, 3 câu hỏi', T[4]['n']==3 and pg.evaluate("raw=>leadText(readMd(raw).tasks[4].t).startsWith('My name is Lucy')", MIX))
    # 5) ví dụ 3: nghe, bảng, nối, hội thoại, chọn trong câu, tô màu
    r = R(LIS); T = r['tasks']
    want = ['Bảng · ô trống để viết','Nối cặp','Hội thoại · điền chỗ trống · lời dẫn · khung từ','Câu hỏi · chọn trong câu {a|b}','Chỉ có ảnh']
    chk('nghe-bang.md: 5 Task đúng cấu hình', [t['desc'] for t in T]==want, [t.get('desc') for t in T])
    chk('Track đọc đúng', T[0]['audio']=='Track 12' and T[4]['audio']=='Track 08')
    chk('cấp phiếu: tuổi 10-12, Liền trang', r['meta']=={'title':'Listening and reading – Unit 5','age':'10-12','flow':'cont'}, r['meta'])
    chk('hội thoại có lời dẫn + khung từ bên phải', pg.evaluate("raw=>{const t=readMd(raw).tasks[2].t;return leadText(t)+'|'+t.wordBank.placement+'|'+t.wordBank.words.length}", LIS)=='Mai is talking to Ben about his new school.|right|3')
    # 6) câu nhiều dòng (thụt lề), Mẫu:, Trả lời: lạ, file .md 1 Task
    ml = "## Task: Read and underline.\nTrả lời: chọn trong câu\n1. [ảnh: rainy] It’s {windy|rainy}.\n   {Take|Put} your raincoat {on|off}.\n2. [ảnh: sunny] It’s {cloudy|sunny}.\n   Put your {swimming costume|coat} on."
    t = R(ml)['tasks'][0]
    chk('câu nhiều dòng: dòng thụt lề là dòng tiếp', t['desc']=='Ảnh mỗi câu · chọn trong câu {a|b} · ô nhiều dòng' and t['n']==2, t['desc'])
    t = R("## Task: Answer the questions.\nMẫu: Đúng/Sai\n1. What is your name?\n2. How old are you?")['tasks'][0]
    chk('Mẫu: Đúng/Sai ép theo mẫu', t['A']=='A6' and t['title']=='Answer the questions.', t)
    t = R("## Task: Do it.\nTrả lời: bay lên\n1. One thing\n2. Two things")['tasks'][0]
    chk('Trả lời không hiểu: ghi chú, giữ cấu hình đoán', any('không hiểu' in x for x in t['notes']), t['notes'])
    t = R("## Task: Choose.\nTrả lời: nối\n1. cat\n2. dog")['tasks'][0]
    chk('Trả lời nối nhưng câu không có vế ghép: vẫn dựng được', t['desc'].startswith('Nối cặp') or t['desc'].startswith('Câu hỏi'), t['desc'])
    t = R("## Task: Answer.\n1. What is your name?")['tasks'][0]
    chk('không ghi Trả lời, câu hỏi rõ: độ chắc cao, không ghi chú', t['conf']=='cao' and not t['notes'], t)
    t = R("## Task: Something.\n1. Some text here\n2. Another line")['tasks'][0]
    chk('không ghi Trả lời, khó đoán: ghi chú "do hệ thống đoán"', any('đoán' in x for x in t['notes']), t['notes'])
    chk('chữ không có "## Task" không phải MD', pg.evaluate("raw=>MD_RE.test(raw)", "# Title\nLook and write.\n1. cat")==False)
    chk('MD không có Task: báo lỗi', 'không có dòng' in pg.evaluate("raw=>readMd(raw).err||''", "## Đáp án\nTask 1: a"))
    f1 = os.path.join(TMP,'mot.md'); open(f1,'w',encoding='utf-8').write("## Task: Trace the words.\nTrả lời: tô chữ\n1. cat\n2. hat")
    pg.reload(); pg.wait_for_timeout(1200)
    pg.click('#tree [data-lib]'); pg.wait_for_timeout(300); pg.click('#libDlg [data-tab=src]'); pg.set_input_files('#impFile', f1); pg.wait_for_timeout(800)
    chk('file .md 1 Task: chèn luôn vào cuối', pg.evaluate("ws.tasks.length")==19 and pg.evaluate("descOf(ws.tasks[18])")=='Tô chữ' and not pg.evaluate("document.getElementById('libDlg').open"))
    pg.click('#undo'); pg.wait_for_timeout(300)
    # 7) khứ hồi 18 Task mẫu: taskToMd → readMd giữ cấu hình
    rt = pg.evaluate("""()=>ws.tasks.map(t=>{const r=readMd(taskToMd(t)).tasks[0], u=r.t; const f=x=>[descOf(x), ck(x)==='table'?x.content.rows.length:its(x).length, x.answer.kind, x.answer.attach, x.answer.layout, layoutOf(x)].join('|'); return u&&f(u)===f(t)?'':t.id})""")
    chk('khứ hồi MD 18 Task mẫu: giữ mô tả, số câu, loại đáp án, cách gắn, bố cục', [x for x in rt if x]==[], [x for x in rt if x])
    md = pg.evaluate("sheetToMd(ws)")
    J = pg.evaluate("raw=>{const J=readMd(raw);return [J.tasks.length, J.tasks.filter(r=>r.err).length, J.meta.title]}", md)
    chk('sheetToMd → readMd: 18 Task, 0 lỗi, giữ tên phiếu', J==[18,0,'Unit 3 · My home'], J)
    open(os.path.join(HERE,'..','shots','sample18.md'),'w',encoding='utf-8').write(md)
    # 8) + Task từ ví dụ 2 vào phiếu mẫu: 5 Task vào cuối, một Hoàn tác
    ids0 = pg.evaluate("ws.tasks.map(t=>t.id)")
    pg.click('#tree [data-lib]'); pg.wait_for_timeout(300); pg.click('#libDlg [data-tab=src]'); pg.fill('#pasteTa', MIX); pg.wait_for_timeout(700)
    chk('+ Task từ MD: bảng 5 dòng có ô tick, ước tính trang', pg.locator('#pasteOut .imrow').count()==5 and pg.locator('#pasteOut input[data-jk]').count()==5 and 'trang' in pg.inner_text('#pasteOut .imest'))
    pg.click('#pasteOk'); pg.wait_for_timeout(700)
    ids1 = pg.evaluate("ws.tasks.map(t=>t.id)")
    chk('5 Task vào cuối, Task cũ giữ nguyên, 0 tràn', ids1[:18]==ids0 and len(ids1)==23 and pg.inner_text('#diagBadge')=='Không lỗi tràn', pg.inner_text('#diagBadge'))
    chk('đáp án đúng có trong Task (không hiện trên phiếu)', pg.evaluate("ws.tasks[18].content.items.map(x=>x.key).join()")=='cat,dog,fish,bird' and 'She is nine years old' not in pg.inner_text('#stage') and pg.evaluate("ws.tasks[22].content.items[0].key")=='She is nine years old.')
    pg.click('#undo'); pg.wait_for_timeout(300)
    chk('cuối: 18 Task, 11 trang, 0 tràn', pg.evaluate("ws.tasks.length")==18 and pg.inner_text('#pageBadge').startswith('11') and pg.inner_text('#diagBadge')=='Không lỗi tràn')
    print('ERRS',errs); print('ALL OK' if ok and not errs else 'SOME FAIL')
