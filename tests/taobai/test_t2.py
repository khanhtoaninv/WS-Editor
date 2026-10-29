# Tạo bài T2 (v126): máy kiểm theo từng Q + Cả phiếu, Hiện đáp án (cam) và tô vàng câu lỗi trên trang.
# Cách chạy: python3 tests/taobai/test_t2.py <ws-editor.html>
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from q12_mau import MAU, build
from playwright.sync_api import sync_playwright
F = 'file://' + os.path.abspath(sys.argv[1]); ok = True
def chk(n, c, x=''):
    global ok; print(('PASS ' if c else 'FAIL '), n, '' if c else x); ok &= bool(c)

MD = """# Thử máy kiểm
Tuổi: 7-9

## Task: Complete with was or were.
Dạng: điền từ
Khung từ: was, were
1. Tom ___ at the park.
2. They ___ happy.
3. We ___ at school.

## Task: Circle the correct word.
Dạng: chọn trong câu
1. There {*was|*were} a cat.
2. They {was|*were} tired.

## Task: Match.
Dạng: nối
Xáo vế phải: có
1. Was it hot? - Yes, it was.
2. Was it sunny? - Yes, it was.
3. Were they happy? - No, they weren't.

## Task: Read and circle T or F.
Dạng: đúng/sai
1. Mai was at the zoo.
2. It was hot.
3. Tom was happy.
4. They were tired.
5. We were at home.

## Task: Answer the questions.
Dạng: viết câu
1. Where were you yesterday?
2. Where were you yesterday?

## Task: Write about your weekend.
Dạng: viết tự do
Dòng viết: 4

## Task: Choose the correct answer.
Dạng: chọn A/B/C
1. She ___ happy. A. was B. were C. is
2. They ___ tired. A. was B. were C. is

## Đáp án
Task 1: was; were; are
Task 4: T; T; T; T; F
### Task 5
1. I was at home.
Task 7: A; B
"""
LOAD = "md=>{const J=readMd(md);return loadSheet(impSheetObj(J))}"
CK = "()=>{const e=document.getElementById('tbChecks');return e?{ok:+e.dataset.ok,n:+e.dataset.n,bad:[...e.querySelectorAll('.tbkl.bad li')].map(l=>l.dataset.ck),txt:e.innerText}:null}"
ST = "(()=>__ws.ws.tasks.map(t=>{const e=document.querySelector(`#tree [data-tk=\"${t.id}\"] .tbic`);return e?e.dataset.tbic:null}))()"
def open_task(pg, i):
    pg.evaluate("i=>document.querySelector(`#tree [data-tk=\"${__ws.ws.tasks[i].id}\"] .tbic`).click()", i); pg.wait_for_timeout(200)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 900}); errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_' not in m.text and 'font' not in m.text.lower() else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.goto(F); pg.wait_for_timeout(1500)
    chk('nạp phiếu thử', pg.evaluate(LOAD, MD)); pg.wait_for_timeout(600)
    pg.click('#helpBtn'); pg.click('#tbEnable'); pg.wait_for_timeout(300)
    st = pg.evaluate(ST)
    chk('cây: bài lỗi ⚠, bài tốt ○', st == ['warn', 'warn', 'warn', 'warn', 'warn', 'todo', 'todo'], st)
    exp = {0: ['duynhat'], 1: ['duynhat'], 2: ['duynhat'], 3: ['duynhat'], 4: ['dapan', 'trung']}
    for i, bad in exp.items():
        open_task(pg, i); c = pg.evaluate(CK)
        chk(f'bài {i+1}: tiêu chí chưa đạt {bad}', c and c['bad'] == bad and c['ok'] == c['n'] - len(bad), c)
    open_task(pg, 0); t = pg.inner_text('#tbChecks')
    chk('lý do có số câu (Q1: đáp án câu 3 không có trong khung từ)', 'câu 3 không có trong khung từ' in t, t)
    chk('tiêu chí đạt gập lại "▸ k tiêu chí đạt"', pg.locator('#tbChecks .tbkl.good').count() == 0 and 'tiêu chí đạt' in t)
    pg.click('#tbChecks .tbktt'); pg.wait_for_timeout(100)
    chk('bấm mở → danh sách tiêu chí đạt', pg.locator('#tbChecks .tbkl.good li').count() >= 2)
    open_task(pg, 3); chk('Q5: lý do tỉ lệ đúng/sai lệch (4/1)', '4/1' in pg.inner_text('#tbChecks'))
    open_task(pg, 5); c = pg.evaluate(CK)
    chk('Q12: không có tiêu chí đáp án / đáp án duy nhất / trùng câu', c and not ({'dapan', 'duynhat', 'trung'} & set(x for x in pg.evaluate("[...document.querySelectorAll('#tbChecks [data-ck]')].map(e=>e.dataset.ck)"))), c)
    chk('không hiện điểm số (chỉ đạt / chưa đạt)', 'điểm' not in pg.inner_text('#tbDrawer').lower())
    # đúng dạng / đủ số câu theo cấu trúc
    pg.evaluate("__ws.commit(w=>{w.tasks[6].gen.q='Q4';w.tasks[6].gen.n=5})"); pg.wait_for_timeout(200)
    open_task(pg, 6); c = pg.evaluate(CK)
    chk('cấu trúc Q4 · 5 câu mà bài là Q3 · 2 câu → 2 tiêu chí chưa đạt', c and c['bad'] == ['dang', 'socau'] and 'cấu trúc là Q4, bài đang là Q3' in c['txt'] and 'bài có 2' in c['txt'], c)
    # sửa → kiểm lại ngay
    pg.evaluate("__ws.commit(w=>{w.tasks[0].content.items[2].key='were'})"); pg.wait_for_timeout(200)
    open_task(pg, 0); c = pg.evaluate(CK)
    chk('sửa đáp án vào khung từ → bài 1 đạt hết, cây ○', c and not c['bad'] and pg.evaluate(ST)[0] == 'todo', [c, pg.evaluate(ST)[0]])
    # cả phiếu
    c = pg.evaluate("()=>{const e=document.getElementById('tbSheetChecks');return {bad:[...e.querySelectorAll('.tbkl.bad li')].map(l=>l.dataset.ck),txt:e.innerText}}")
    chk('Cả phiếu: lặp câu giữa bài 4 và 5? (không) — bài 5 lặp trong bài, không tính lặp giữa bài', 's_lap' not in c['bad'], c)
    pg.evaluate("__ws.commit(w=>{w.tasks[6].content.items[0].text='Where were you yesterday?';w.gen.maxPages=1})"); pg.wait_for_timeout(250)
    c = pg.evaluate("()=>{const e=document.getElementById('tbSheetChecks');return {bad:[...e.querySelectorAll('.tbkl.bad li')].map(l=>l.dataset.ck),txt:e.innerText}}")
    pages = pg.evaluate("__ws.res.pages.length")
    chk('Cả phiếu: câu lặp giữa bài 5 và 7 bị bắt; số trang > tối đa 1 bị bắt', 's_lap' in c['bad'] and ('s_trang' in c['bad']) == (pages > 1) and 'bài 5, 7' in c['txt'], [c, pages])
    pg.click('#tbPub'); pg.wait_for_timeout(200)
    chk('Xuất bản nhắc cả tiêu chí Cả phiếu chưa đạt', pg.is_visible('#tbPubDlg') and 'Các bài không lặp câu' in pg.inner_text('#tbPubSheet'))
    pg.click('#tbPubCancel'); pg.wait_for_timeout(100)
    # tô vàng câu lỗi khi ngăn mở
    open_task(pg, 1)
    chk('ngăn mở: câu lỗi tô vàng (bài 2 câu 1)', pg.evaluate("(()=>{const id=__ws.ws.tasks[1].id;return [...document.querySelectorAll('#stage .tbbad')].some(e=>e.closest(`section.task[data-task=\"${id}\"]`))})()"))
    pg.click('#tbClose'); pg.wait_for_timeout(150)
    chk('đóng ngăn: hết tô vàng', pg.locator('#stage .tbbad').count() == 0)
    # Hiện đáp án
    pg.click('#tbDuyet'); pg.wait_for_timeout(150)
    md0 = pg.evaluate("sheetToMd(__ws.ws)")
    pg.check('#tbAnsChk'); pg.wait_for_timeout(300)
    n = pg.evaluate("document.querySelectorAll('#stage .vans,#stage .vok,#stage svg.vline').length")
    chk('bật Hiện đáp án: có đáp án trên trang', n >= 8, n)
    col = pg.evaluate("(()=>{const e=document.querySelector('#stage .vans');return e?getComputedStyle(e).color:''})()")
    chk('màu cam', col == 'rgb(217, 87, 11)', col)
    chk('không đổi dữ liệu (MD giống hệt)', pg.evaluate("sheetToMd(__ws.ws)") == md0)
    chk('gói .wsp không mang lớp đáp án', 'vans' not in json.dumps(pg.evaluate("__ws.wspSource().pages")))
    pg.evaluate("__ws.setZoom(0.6)"); pg.wait_for_timeout(300)
    chk('dàn lại trang (zoom): đáp án vẽ lại', pg.evaluate("document.querySelectorAll('#stage .vans,#stage .vok,#stage svg.vline').length") == n)
    pg.click('#tbClose'); pg.wait_for_timeout(200)
    chk('đóng ngăn: đáp án vẫn hiện (công tắc giữ)', pg.evaluate("document.querySelectorAll('#stage .vans,#stage .vok,#stage svg.vline').length") == n)
    pg.click('#tbDuyet'); pg.wait_for_timeout(150); pg.uncheck('#tbAnsChk'); pg.wait_for_timeout(250)
    chk('tắt: hết đáp án trên trang', pg.evaluate("document.querySelectorAll('#stage .vans,#stage .vok,#stage svg.vline').length") == 0)
    # đủ 12 dạng Q (mẫu AI của T0): bài có đáp án thì hiện được đáp án
    chk('nạp 20 mẫu 12 dạng Q', pg.evaluate(LOAD, build(MAU))); pg.wait_for_timeout(800)
    pg.click('#helpBtn'); pg.click('#tbEnable'); pg.wait_for_timeout(200); pg.click('#tbDuyet'); pg.check('#tbAnsChk'); pg.wait_for_timeout(500)
    per = pg.evaluate("__ws.ws.tasks.map(t=>[qOf(t),document.querySelectorAll(`#stage section.task[data-task=\"${t.id}\"] :is(.vans,.vok,svg.vline)`).length])")
    noans = {'Q9', 'Q11', 'Q12'}
    miss = [(i + 1, q) for i, (q, k) in enumerate(per) if q not in noans and k == 0 and MAU[i][0] != 'Q4 tìm lỗi sai (nhãn A-D)']
    chk('mọi dạng có đáp án đều hiện đáp án trên trang (Q1–Q8, Q10)', not miss, [miss, per])
    chk('Q9 / Q12 không có gì để hiện', all(k == 0 for q, k in per if q in {'Q9', 'Q12'}), per)
    pg.screenshot(path='/tmp/claude-0/t2_ans.png')
    chk('0 lỗi console', not errs, errs)
    b.close()
print('ALL OK' if ok else 'SOME FAIL')
