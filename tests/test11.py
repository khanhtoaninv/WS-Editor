# Bước 4 (v60): dán bài -> bộ đoán trả về cấu hình (khung + thành phần + loại đáp án), mẫu chỉ áp khi người dùng chọn
import sys
from playwright.sync_api import sync_playwright
ok=True
def chk(n,c,i=''):
    global ok; print(('PASS ' if c else 'FAIL ')+n, i); ok = ok and bool(c)
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1440,'height':900}); errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'ERR_' not in m.text and 'fonts' not in m.text else None); pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+sys.argv[1]); pg.wait_for_timeout(1300)
    P = lambda s, f=None: pg.evaluate("([s,f])=>{const r=parseTask(s,f);const t=r.t;return {rid:r.rid,desc:descOf(t),A:t.answer.layout,att:t.answer.attach,typeId:t.typeId,typeName:t.typeName,n:its(t).length,img:t.image?t.image.size:null,title:t.title}}", [s,f])
    r = P('Choose the correct answer.\n1. She ___ a teacher. A. am B. is C. are')
    chk('không chọn mẫu: rid rỗng', r['rid']=='', r)
    chk('cấu hình đoán: khoanh A/B/C', r['desc']=='Câu hỏi · khoanh A/B/C' and r['A']=='A4', r)
    chk('typeId = mẫu khớp, typeName = mô tả', r['typeId']=='choose-abc' and r['typeName']==r['desc'], r)
    # cấu hình không trùng mẫu nào: câu hỏi có ảnh từng câu + khoanh A/B/C
    r = P('Look and choose.\n1. [ảnh: cat] What is it? A. cat B. dog C. pig\n2. [ảnh: dog] What is it? A. cow B. dog C. hen')
    chk('cấu hình riêng vẫn nhập đúng (ảnh mỗi câu + khoanh A/B/C)', r['desc']=='Ảnh mỗi câu · khoanh A/B/C' and r['typeId']=='custom' and r['n']==2, r)
    # Đúng/Sai có ảnh chung
    r = P('Look at the picture. True or False?\n[ảnh: the park]\n1. There are three children.\n2. It is sunny.')
    chk('Đúng/Sai + ảnh chung', r['desc']=='Câu hỏi · Đúng/Sai · ảnh chung' and r['A']=='A6' and r['img']=='medium', r)
    # chỉ có ảnh
    r = P('Listen and colour.\nColour the picture.')
    chk('tô màu: chỉ có ảnh, ảnh lớn', r['desc']=='Chỉ có ảnh' and r['img']=='large', r)
    r = P('Hello there.')
    chk('một dòng chữ không ký hiệu: 1 câu, độ chắc thấp -> viết câu', r['desc']=='Câu hỏi · viết câu' and r['n']==1, r)
    # áp mẫu khi người dùng chọn
    r = P('Answer the questions.\n1. What is your name?\n2. How old are you?', 'true-false')
    chk('chọn mẫu Đúng/Sai: áp mẫu, giữ tiêu đề + chữ', r['rid']=='true-false' and r['A']=='A6' and r['title']=='Answer the questions.' and r['n']==2, r)
    # UI hộp dán
    pg.click('#tree [data-lib]'); pg.wait_for_timeout(300); pg.click('#libDlg [data-tab=src]'); pg.wait_for_timeout(200)
    pg.fill('#pasteTa','Look and choose.\n1. [ảnh: cat] What is it? A. cat B. dog C. pig\n2. [ảnh: dog] What is it? A. cow B. dog C. hen'); pg.wait_for_timeout(500)
    txt = pg.inner_text('#pasteOut')
    chk('hộp dán: hiện mô tả cấu hình + "cấu hình riêng"', 'Ảnh mỗi câu · khoanh A/B/C' in txt and 'cấu hình riêng' in txt)
    chk('hộp dán: ô chọn mặc định "Giữ cấu hình đoán"', pg.eval_on_selector('#pasteOut select[data-pr]','e=>e.value')=='' and 'Giữ cấu hình đoán' in pg.inner_text('#pasteOut select[data-pr]'))
    pg.select_option('#pasteOut select[data-pr]','answer-q'); pg.wait_for_timeout(400)
    chk('chọn mẫu khác: độ chắc "người dùng chọn"', 'người dùng chọn' in pg.inner_text('#pasteOut'))
    pg.select_option('#pasteOut select[data-pr]',''); pg.wait_for_timeout(400)
    chk('chọn lại "Giữ cấu hình đoán": về cấu hình đoán', 'cấu hình riêng' in pg.inner_text('#pasteOut') and 'người dùng chọn' not in pg.inner_text('#pasteOut'))
    n0 = pg.evaluate("ws.tasks.length"); pg.click('#pasteOk'); pg.wait_for_timeout(500)
    t = pg.evaluate("ws.tasks.find(t=>t.id===window.__ws.sel.id)")
    chk('nhập vào phiếu: Task mới, tên trên cây = mô tả', pg.evaluate("ws.tasks.length")==n0+1 and t['typeName']=='Ảnh mỗi câu · khoanh A/B/C', t['typeName'])
    pg.click('#undo'); pg.wait_for_timeout(300)
    chk('10 trang, 0 tràn', pg.inner_text('#pageBadge').startswith('10') and pg.inner_text('#diagBadge')=='Không lỗi tràn')
    print('ERRS',errs); print('ALL OK' if ok and not errs else 'SOME FAIL')
