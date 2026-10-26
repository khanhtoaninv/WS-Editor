# P0 (v63): nạp JSON thiếu trường, nạp lỗi không đổi phiếu, Task không tên, hộp Dán nhận JSON, tự chọn Cả đề, cảnh báo dán dài, báo vị trí chèn
import sys, json, os
from playwright.sync_api import sync_playwright
ok=True
def chk(n,c,i=''):
    global ok; print(('PASS ' if c else 'FAIL ')+n, i); ok = ok and bool(c)
HERE=os.path.dirname(os.path.abspath(__file__))
SEA=open(os.path.join(HERE,'ws-sea-sample.json'),encoding='utf-8').read()
LAY = "(()=>{const r=window.__ws.res; return JSON.stringify(r.pages.map(p=>p.items.map(x=>[x.t.id, x.frag?x.frag.a+'-'+x.frag.b:'', Math.round(x.h)])))+'|'+r.diags.length})()"
SNAP = "JSON.stringify(ws)"
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'fonts' not in m.text else None); pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+sys.argv[1]); pg.wait_for_timeout(1300)
    lay0 = pg.evaluate(LAY); snap0 = pg.evaluate(SNAP)
    # 1) khứ hồi 18 Task mẫu: xuất JSON rồi nạp lại -> bố cục giống hệt
    pg.evaluate("loadSheet(JSON.parse(JSON.stringify(ws)), 'x')"); pg.wait_for_timeout(500)
    chk('18 Task mẫu: xuất JSON rồi nạp lại, bố cục giống hệt', pg.evaluate(LAY)==lay0)
    d0 = pg.evaluate("""(s=>{const a=JSON.parse(s).tasks, b=ws.tasks; const bad=[]; a.forEach((t,i)=>{const x=JSON.parse(JSON.stringify(t)), y=JSON.parse(JSON.stringify(b[i])); delete x.number; delete y.number; if(JSON.stringify(x)!==JSON.stringify(y)) bad.push(t.id)}); return bad})""" + "(" + json.dumps(snap0) + ")")
    chk('khứ hồi: dữ liệu từng Task giữ nguyên', d0==[], d0)
    # 2) phiếu Sea đủ trường
    pg.evaluate("s=>loadSheet(JSON.parse(s),'Sea')", SEA); pg.wait_for_timeout(500)
    chk('phiếu Sea: 6 Task, 3 trang, 0 tràn', pg.evaluate("ws.tasks.length")==6 and pg.inner_text('#pageBadge').startswith('3') and pg.inner_text('#diagBadge')=='Không lỗi tràn', pg.inner_text('#pageBadge'))
    # 3) JSON chỉ có tasks (thiếu schema, age, page, spacing, flow)
    only = json.loads(SEA); only = {'tasks': only['tasks']}
    r = pg.evaluate("o=>loadSheet(o,'thiếu')", only); pg.wait_for_timeout(400)
    chk('JSON chỉ có tasks: nạp được', r is True and pg.evaluate("ws.tasks.length")==6)
    chk('bù đủ trường cấp phiếu', pg.evaluate("[ws.schema, ws.age, ws.page.size, ws.spacing.preset, ws.flow].join()")=='ws-editor/0.3,7-9,A4,compact,cont', pg.evaluate("[ws.schema, ws.age, ws.page&&ws.page.size, ws.spacing&&ws.spacing.preset, ws.flow].join()"))
    chk('bố cục giống phiếu Sea đủ trường (3 trang, 0 tràn)', pg.inner_text('#pageBadge').startswith('3') and pg.inner_text('#diagBadge')=='Không lỗi tràn')
    # 4) Task tối thiểu: chỉ có title + items là chuỗi; thiếu id, answer, layout, spacing, typeName
    mini = {'tasks':[{'title':'Answer the questions.','content':{'items':['What is your name?','How old are you?']}},{'title':'','content':{'form':'table','rows':[['cat','',''],['dog','','']]}},{'content':{}}]}
    r = pg.evaluate("o=>loadSheet(o,'mini')", mini); pg.wait_for_timeout(400)
    chk('Task thiếu id/answer/layout/spacing: nạp được', r is True and pg.evaluate("ws.tasks.length")==3, pg.evaluate("ws.tasks.map(t=>t.id)"))
    ids = pg.evaluate("ws.tasks.map(t=>t.id)"); chk('id Task không trùng', len(set(ids))==3, ids)
    names = pg.eval_on_selector_all('#tree .tnode[data-sel=task] .tnm','e=>e.map(x=>x.innerText)')
    chk('cột trái: Task không tên vẫn có tên (tiêu đề / mô tả)', all(n.strip() for n in names), names)
    pg.evaluate("commit(w=>{w.tasks[0].typeName='';w.tasks[1].typeName='';w.tasks[1].title=''})"); pg.wait_for_timeout(300)
    names = pg.eval_on_selector_all('#tree .tnode[data-sel=task] .tnm','e=>e.map(x=>x.innerText)')
    chk('typeName rỗng: lấy tiêu đề, không có tiêu đề thì lấy mô tả', names[0]=='Answer the questions.' and names[1]==pg.evaluate("descOf(ws.tasks[1])"), names)
    chk('Task tối thiểu: 0 lỗi tràn', pg.inner_text('#diagBadge')=='Không lỗi tràn')
    # 5) nạp lỗi: phiếu đang mở giữ nguyên
    pg.evaluate("s=>loadSheet(JSON.parse(s),'Sea')", SEA); pg.wait_for_timeout(400)
    s1 = pg.evaluate(SNAP)
    for bad,name in [({'title':'x'},'thiếu tasks'),({'tasks':[{'content':{'kind':'weird'}}]},'nội dung lạ'),({'tasks':[1,2]},'Task không phải đối tượng'),({'tasks':[{'title':'a'}]*41},'quá 40 Task')]:
        r = pg.evaluate("o=>loadSheet(o,'bad')", bad); pg.wait_for_timeout(200)
        chk('nạp lỗi ('+name+'): trả false, phiếu giữ nguyên', r is False and pg.evaluate(SNAP)==s1)
    # 6) về 18 Task mẫu, dán JSON phiếu Sea vào ô nhập của "+ Task"
    pg.reload(); pg.wait_for_timeout(1300)
    OPEN = lambda: (pg.click('#tree [data-lib]'), pg.wait_for_timeout(300), pg.click('#libDlg [data-tab=src]'), pg.wait_for_timeout(200))
    n0 = pg.evaluate("ws.tasks.length"); ids0 = pg.evaluate("ws.tasks.map(t=>t.id)")
    pg.click('#tree .tnode[data-sel=task][data-id=t2]'); pg.wait_for_timeout(200)
    OPEN(); pg.fill('#pasteTa', SEA); pg.wait_for_timeout(800)
    out = pg.inner_text('#pasteOut')
    chk('ô nhập: nhận ra JSON (không thành bài đọc)', 'JSON' in out and 'Bài đọc' not in out and pg.locator('#pasteOut .imrow').count()==6, out[:160])
    chk('ô nhập: ẩn chọn Một Task / Cả đề khi là JSON', not pg.is_visible('#libDlg .pmode'))
    chk('ô nhập: nút Thêm 6 Task', 'Thêm 6 Task' in pg.inner_text('#pasteOk'))
    chk('ước tính số trang hiện ra', 'trang' in pg.inner_text('#pasteOut .imest'))
    pg.click('#pasteOut input[data-jk="5"]'); pg.wait_for_timeout(300)
    chk('bỏ chọn 1 Task: còn 5', 'Thêm 5 Task' in pg.inner_text('#pasteOk'))
    pg.click('#pasteOk'); pg.wait_for_timeout(700)
    ids1 = pg.evaluate("ws.tasks.map(t=>t.id)")
    chk('JSON vào phiếu: thêm 5 Task vào cuối, Task cũ giữ nguyên', len(ids1)==n0+5 and ids1[:n0]==ids0, (len(ids1)))
    chk('Task mới có id mới, không trùng', len(set(ids1))==len(ids1))
    chk('báo đã thêm vào cuối, bỏ cài đặt cấp phiếu', 'cuối phiếu' in pg.inner_text('#toast') and 'cấp phiếu' in pg.inner_text('#toast'), pg.inner_text('#toast'))
    chk('Task mới được chọn và mở', pg.evaluate("window.__ws.sel.id")==ids1[n0] and pg.evaluate("[...document.querySelectorAll('#tree .tk.open')].map(e=>e.dataset.tk).join()")==ids1[n0])
    pg.click('#undo'); pg.wait_for_timeout(400)
    chk('một lần Hoàn tác gỡ cả lần nhập', pg.evaluate("ws.tasks.map(t=>t.id)")==ids0)
    # 7) JSON cả phiếu -> chuyển sang "+ Phiếu"
    OPEN(); pg.fill('#pasteTa', SEA); pg.wait_for_timeout(700)
    pg.click('#pasteOut [data-imp=tosheet]'); pg.wait_for_timeout(500)
    chk('chuyển sang + Phiếu giữ nội dung', pg.evaluate("document.getElementById('libDlg').dataset.mode")=='sheet' and 'Tạo phiếu mới (6 Task)' in pg.inner_text('#pasteOk'))
    pg.click('#pasteOk'); pg.wait_for_timeout(300); pg.click('#pasteOk'); pg.wait_for_timeout(700)
    chk('Nạp thành phiếu mới: 6 Task, 3 trang', pg.evaluate("ws.tasks.length")==6 and pg.inner_text('#pageBadge').startswith('3'))
    pg.reload(); pg.wait_for_timeout(1300)
    # 8) JSON hỏng
    s2 = pg.evaluate(SNAP)
    OPEN(); pg.fill('#pasteTa', '{"tasks":[{"title":"a",}]}'); pg.wait_for_timeout(500)
    chk('JSON hỏng: báo lỗi, nút nhập tắt', 'JSON hỏng' in pg.inner_text('#pasteOut') and pg.is_disabled('#pasteOk'))
    pg.fill('#pasteTa', '{"title":"no tasks here"}'); pg.wait_for_timeout(500)
    chk('JSON một Task (không có tasks): đọc như 1 Task', pg.locator('#pasteOut .imrow').count()==1 and not pg.is_disabled('#pasteOk'))
    pg.fill('#pasteTa', '{"foo":1}'); pg.wait_for_timeout(500)
    chk('JSON thiếu tasks: báo thiếu, nút tắt', 'thiếu danh sách' in pg.inner_text('#pasteOut') and pg.is_disabled('#pasteOk'))
    pg.click('#libClose'); pg.wait_for_timeout(200)
    chk('sau các lỗi: phiếu giữ nguyên', pg.evaluate(SNAP)==s2)
    # 9) tự chọn Cả đề
    EXAM = "1 Students 1 and 2: Work with a friend. Find and circle the words in the puzzle.\nS U N L I G H T\nE O R M I D O L\n\n2 Work with your friend. Prepare clues for the words you found in Activity 1.\nClue 1: ______\nClue 2: ______\n\n3 Join students 3 and 4. Give the clues to your friends. Take turns.\nHere's our first clue. It's smaller than a whale.\nIs it a dolphin?"
    OPEN(); pg.fill('#pasteTa', 'Answer the questions.\n1. What is your name?'); pg.wait_for_timeout(500)
    chk('chữ thô một bài: Một Task', pg.evaluate("document.querySelector('#libDlg .pmode .on').dataset.pm")=='task')
    chk('chữ thô: ghi rõ là đoán, độ chắc thấp', 'đoán' in pg.inner_text('#pasteOut') and 'độ chắc thấp' in pg.inner_text('#pasteOut'))
    pg.fill('#pasteTa', EXAM); pg.wait_for_timeout(500)
    chk('chữ có nhiều hoạt động: tự chuyển sang Cả đề, cắt 3 Task', pg.evaluate("document.querySelector('#libDlg .pmode .on').dataset.pm")=='test' and pg.locator('#pasteOut .imrow').count()==3, pg.locator('#pasteOut .imrow').count())
    pg.click('#libDlg [data-pm=task]'); pg.fill('#pasteTa', EXAM+'\n'); pg.wait_for_timeout(500)
    chk('chọn tay Một Task: giữ lựa chọn khi sửa chữ', pg.evaluate("document.querySelector('#libDlg .pmode .on').dataset.pm")=='task')
    # 10) cảnh báo dán dài
    LONG = "Answer the questions.\n" + "\n".join(f"{i}. Question number {i}?" for i in range(1,46))
    pg.fill('#pasteTa', LONG); pg.wait_for_timeout(500)
    chk('dán > 40 dòng vào một Task: có cảnh báo + nút chuyển', 'vào một Task' in pg.inner_text('#pasteOut') and pg.locator('#pasteOut [data-pm2=test]').count()==1, pg.inner_text('#pasteOut')[:120])
    pg.click('#pasteOut [data-pm2=test]'); pg.wait_for_timeout(400)
    chk('bấm chuyển: sang Cả đề', pg.evaluate("document.querySelector('#libDlg .pmode .on').dataset.pm")=='test')
    pg.click('#libClose')
    # 11) chữ thô: thêm vào cuối, báo vị trí, không ghi đè
    pg.click('#tree .tnode[data-sel=task][data-id=t3]'); pg.wait_for_timeout(200)
    ids0 = pg.evaluate("ws.tasks.map(t=>t.id)")
    OPEN(); pg.fill('#pasteTa','Answer the questions.\n1. What is your name?\n2. How old are you?'); pg.wait_for_timeout(500)
    pg.click('#pasteOk'); pg.wait_for_timeout(500)
    ids1 = pg.evaluate("ws.tasks.map(t=>t.id)")
    chk('chữ thô: báo "Đã thêm 1 Task vào cuối phiếu (Task 19)"', 'vào cuối phiếu (Task 19)' in pg.inner_text('#toast'), pg.inner_text('#toast'))
    chk('chữ thô: Task mới ở cuối, không ghi đè', ids1[:-1]==ids0 and len(ids1)==len(ids0)+1)
    pg.click('#undo'); pg.wait_for_timeout(300)
    chk('cuối: 18 Task, 10 trang, 0 tràn', pg.evaluate("ws.tasks.length")==18 and pg.inner_text('#pageBadge').startswith('10') and pg.inner_text('#diagBadge')=='Không lỗi tràn')
    print('ERRS',errs); print('ALL OK' if ok and not errs else 'SOME FAIL')
