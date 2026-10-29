# Tạo bài v129: Sinh bài. Máy chủ AI giả (tests/taobai/ai_gia.py) trả MD đúng / sai cú pháp / sai số câu / chậm / lỗi 429.
# Cách chạy: python3 tests/taobai/test_t4_sinh.py <ws-editor.html>
#   phần 1 (qua máy chủ): Ra đề → Sinh (song song, gửi lại đúng chỗ lỗi, ⚠) → Kho phiếu tự lưu → Sinh lại kèm góp ý →
#          không ghi đè bài đang sửa → Ra đề đổi một bài → chỉ sinh bài đó → Duyệt → Xuất bản; nhật ký
#   phần 2 (mở thẳng file): chế độ AI ngoài: chép đoạn nhắc, dán kết quả sai → lỗi + chép đoạn nhắc sửa lỗi, dán đúng → ○
import sys, os, json, subprocess, time, tempfile, shutil, urllib.request
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE)); sys.path.insert(0, HERE)
import ai_gia
F = 'file://' + os.path.abspath(sys.argv[1]); ok = True; OUT = '/tmp/claude-0'; os.makedirs(OUT, exist_ok=True)
def chk(n, c, x=''):
    global ok; print(('PASS ' if c else 'FAIL '), n, '' if c else x); ok &= bool(c)
def confirm(pg, yes=True):
    pg.wait_for_selector('#cfmDlg[open]', timeout=4000); pg.click('#cfmYes' if yes else '#cfmNo'); pg.wait_for_timeout(400)
def cho_xong(pg, s=40):
    pg.wait_for_timeout(600)
    for _ in range(s * 5):
        if pg.locator('#tbSinhSt').count() == 0: return True
        pg.wait_for_timeout(200)
    return False
GEN = "__ws.ws.tasks.map(t=>({id:t.id,title:t.title,st:t.gen&&t.gen.status,q:qOf(t),gq:t.gen&&t.gen.q,n:t.gen&&t.gen.n,tries:t.gen&&t.gen.tries,notes:(t.gen&&t.gen.mdNotes)||[],goal:t.gen&&t.gen.goal,ctx:t.gen&&t.gen.ctx,model:t.gen&&t.gen.model,spare:!!(t.gen&&t.gen.spare),h:(t.gen&&t.gen.history||[]).length}))"
ICONS = "[...document.querySelectorAll('#tree .tbic')].map(e=>e.dataset.tbic)"
def prompts(k): return [x for x in ai_gia.NHAN if f'BÀI CẦN VIẾT: Bài {k} ·' in x['prompt']]

def server_mode(pg, errs, B, d):
    ai_gia.dat_lai({2: ['cu-phap'], 3: ['so-cau', 'so-cau', 'so-cau'], 4: ['cham'], 5: ['429']})
    pg.goto(B + '/editor'); pg.wait_for_timeout(1500)
    pg.evaluate("window.__tbRand=()=>0; window.__tbCho=300")
    pg.click('#tbNew'); pg.wait_for_selector('#raDe'); pg.click('#rdLs [data-ls="u5-l2"]'); pg.wait_for_selector('#rdStruct'); pg.wait_for_timeout(300)
    rows = pg.evaluate("[...document.querySelectorAll('#rdStruct .rdrow')].map(r=>r.querySelector('select').value+' '+parseInt(r.querySelector('.rdnv').textContent))")
    chk('cấu trúc cố định (__tbRand=0): Q4 5 · Q1 6 · Q3 5 · Q5 4 · Q12 3', rows == ['Q4 5', 'Q1 6', 'Q3 5', 'Q5 4', 'Q12 3'], rows)
    pg.fill('#rdNote', 'chủ đề cắm trại'); pg.click('#rdGo')
    if pg.locator('#cfmDlg[open]').count() or pg.wait_for_timeout(300) or pg.locator('#cfmDlg[open]').count(): confirm(pg)
    pg.wait_for_timeout(300)
    chk('Sinh bài: dải trên báo AI + đang viết', 'Claude Haiku 5.5' in pg.inner_text('#tbAiTen') and pg.locator('#tbSinhSt').count() == 1, pg.inner_text('#tbSinhBar'))
    pg.wait_for_timeout(400)
    ic0 = pg.evaluate(ICONS)
    chk('đang viết: bài ⏳, bài xong hiện ngay', 'wait' in ic0, ic0)
    pg.screenshot(path=f'{OUT}/t4b_dang_sinh.png')
    chk('sinh xong trong thời gian hợp lý', cho_xong(pg))
    pg.wait_for_timeout(600)
    g = pg.evaluate(GEN)
    chk('5 bài, đúng dạng theo cấu trúc', len(g) == 5 and [x['q'] for x in g] == ['Q4', 'Q1', 'Q3', 'Q5', 'Q12'], [x['q'] for x in g])
    chk('bài 1: nội dung AI, Mục tiêu / Ngữ cảnh tách ra, ○', g[0]['title'].startswith('Bài 1 do AI giả viết') and g[0]['goal'] == 'Luyện was / were (bài 1)' and g[0]['ctx'] == 'Ngữ cảnh 1' and g[0]['st'] == 'todo' and not g[0]['notes'] and g[0]['tries'] == 1, g[0])
    p2 = prompts(2)
    chk('bài 2 sai cú pháp → gửi lại đúng chỗ lỗi (lượt 2 có "SỬA LỖI" + lỗi), rồi đạt', len(p2) == 2 and '## SỬA LỖI' in p2[1]['prompt'] and 'không có dòng “## Task' in p2[1]['prompt'] and g[1]['tries'] == 2 and not g[1]['notes'], [len(p2), g[1]])
    p3 = prompts(3)
    chk('bài 3 sai số câu 3 lần → dừng sau 2 lần gửi lại, ⚠ "sai số câu", giữ nội dung đọc được', len(p3) == 3 and g[2]['tries'] == 3 and any('sai số câu' in x for x in g[2]['notes']) and g[2]['title'].startswith('Bài 3 do AI'), [len(p3), g[2]])
    chk('bài 4 (AI chậm) và bài 5 (lỗi 429 → chờ rồi thử lại) đạt', g[3]['st'] == 'todo' and not g[3]['notes'] and g[4]['st'] == 'todo' and not g[4]['notes'] and g[4]['title'].startswith('Bài 5'), [g[3], g[4]])
    ic = pg.evaluate(ICONS)
    chk('cây: ○ ○ ⚠ ○ ○', ic == ['todo', 'todo', 'warn', 'todo', 'todo'], ic)
    p1 = prompts(1)[0]
    chk('đoạn nhắc: file chung 1 + mục Q4 ở phần hệ thống, Kiến thức + Trình tự + TF + cấu trúc + ghi chú ở phần yêu cầu', 'Khung kết quả' in p1['system'] and '## Q4 Chọn trong câu' in p1['system'] and 'Dùng đúng was / were' in p1['prompt'] and 'Bước 1: Khởi động' in p1['prompt'] and 'Dạng 1: Chọn từ đúng trong ngoặc' in p1['prompt'] and '← BÀI NÀY' in p1['prompt'] and 'chủ đề cắm trại' in p1['prompt'], p1['prompt'][:300])
    chk('model theo Thiết lập (Haiku 5.5)', all(x['model'] == 'claude-haiku-5-5' for x in ai_gia.NHAN))
    p4 = prompts(4)[0]['prompt']
    chk('bài bắt đầu sau nhận tóm tắt bài đã xong (tránh lặp)', '## Các bài đã viết trong phiếu' in p4 and 'Bài 1 (Q4)' in p4, p4[-900:])
    kho = json.loads(urllib.request.urlopen(B + '/api/taobai/kho-phieu').read())['phieu']
    chk('sinh xong cả phiếu → tự lưu vào Kho phiếu', len(kho) == 1 and kho[0]['n'] == 5 and kho[0]['cho'] == 0, kho)
    # ngăn Duyệt: bài 3 ⚠ có lỗi
    pg.click('#tbDuyet'); pg.wait_for_timeout(200); pg.click('#tbNext'); pg.click('#tbNext'); pg.wait_for_timeout(200)
    chk('ngăn Duyệt bài 3: Kiểm tra ✕ "MD đọc được" + "Đủ số câu", ghi model + số lượt', 'sai số câu' in pg.inner_text('#tbChecks') and '3 lượt' in pg.inner_text('#tbGenInfo'), pg.inner_text('#tbChecks'))
    pg.screenshot(path=f'{OUT}/t4b_duyet_canh_bao.png')
    # Sinh lại bài 1 kèm góp ý (đã duyệt → lịch sử giữ)
    pg.click('#tbPrev'); pg.click('#tbPrev'); pg.wait_for_timeout(200)
    pg.click('#tbApprove'); pg.wait_for_timeout(300); pg.click('#tbPrev'); pg.wait_for_timeout(200)
    chk('bài 1 đã duyệt', pg.evaluate("__ws.ws.tasks[0].gen.status") == 'ok' and pg.inner_text('#tbPos').startswith('1 /'))
    ai_gia.KICH_BAN[1] = ['ok', 'cham']   # lượt sinh lại bài 1 trả chậm để thấy ⏳
    pg.fill('#tbGopY', 'dùng tên Nam thay cho Tom'); pg.click('#tbRegenGo'); pg.wait_for_timeout(400)
    chk('Sinh lại: bài ⏳, ngăn báo đang viết', pg.evaluate("__ws.ws.tasks[0].gen.status") == 'wait' and pg.locator('#tbRun').count() == 1 and pg.evaluate(ICONS)[0] == 'wait')
    cho_xong(pg); pg.wait_for_timeout(300)
    pr = prompts(1)[-1]['prompt']
    chk('đoạn nhắc sinh lại: bản hiện tại + góp ý', '## Bản hiện tại của bài này' in pr and 'dùng tên Nam thay cho Tom' in pr and 'Bài 1 do AI giả viết' in pr)
    g1 = pg.evaluate(GEN)[0]
    chk('sau sinh lại: chưa duyệt, bản duyệt cũ vẫn trong Lịch sử bài', g1['st'] == 'todo' and g1['h'] == 1 and pg.evaluate("__ws.ws.tasks[0].gen.approvedHash!=null"), g1)
    # không ghi đè bài đang sửa
    ai_gia.KICH_BAN[2] = ['cu-phap', 'ok', 'cham']   # lượt thứ 3 của bài 2 (sinh lại) trả chậm
    pg.click('#tbNext'); pg.wait_for_timeout(200); pg.click('#tbRegenGo'); pg.wait_for_timeout(500)
    pg.evaluate("__ws.commit(w=>{w.tasks[1].title='Giáo viên đang sửa'})"); cho_xong(pg); pg.wait_for_timeout(400)
    g2 = pg.evaluate(GEN)[1]
    chk('giáo viên sửa khi AI đang viết: không thay, giữ bản AI', g2['title'] == 'Giáo viên đang sửa' and g2['spare'] and pg.is_visible('#tbSpare'), g2)
    pg.click('#tbSpareUse'); pg.wait_for_timeout(400)
    g2 = pg.evaluate(GEN)[1]
    chk('"Dùng bản AI vừa viết": thay bằng bản AI', g2['title'].startswith('Bài 2 do AI') and not g2['spare'], g2)
    pg.click('#undo'); pg.wait_for_timeout(300)
    chk('Hoàn tác được', pg.evaluate("__ws.ws.tasks[1].title") == 'Giáo viên đang sửa')
    pg.click('#redo'); pg.wait_for_timeout(300)
    # Ra đề: đổi số câu bài 5 → chỉ sinh bài đó
    n0 = len(ai_gia.NHAN)
    pg.click('#tbRaDe'); pg.wait_for_selector('#rdStruct'); pg.wait_for_timeout(300)
    last = '#rdStruct .rdrow >> nth=4'; pg.click(f'{last} >> [data-dn="1"]'); pg.wait_for_timeout(150)
    pg.click('#rdGo'); confirm(pg); cho_xong(pg); pg.wait_for_timeout(400)
    new = [x for x in ai_gia.NHAN[n0:]]
    chk('quay lại Ra đề đổi 1 bài → chỉ sinh bài đó', len(new) == 1 and 'BÀI CẦN VIẾT: Bài 5 · Q12 Viết tự do · 4 dòng' in new[0]['prompt'] and pg.evaluate(GEN)[4]['st'] == 'todo', [x['prompt'][-120:] for x in new])
    # Duyệt hết → Xuất bản
    pg.click('#tbDuyet') if pg.locator('#tbDrawer').count() == 0 else None
    for _ in range(8):
        if not pg.is_disabled('#tbApprove'): pg.click('#tbApprove'); pg.wait_for_timeout(250)
        else: pg.click('#tbNext'); pg.wait_for_timeout(150)
    pg.wait_for_timeout(300)
    chk('Duyệt đủ 5 bài', pg.evaluate(ICONS) == ['ok'] * 5 and pg.evaluate("__ws.ws.tasks.filter(t=>t.gen.status==='ok').length") == 5, [pg.evaluate(ICONS), pg.evaluate(GEN)])
    pg.click('#tbPub'); pg.wait_for_timeout(500)
    if pg.locator('#tbPubGo').count(): pg.click('#tbPubGo'); pg.wait_for_timeout(500)
    chk('Xuất bản → hộp Gói .wsp', pg.locator('#wspDlg[open]').count() == 1)
    pg.screenshot(path=f'{OUT}/t4b_xuat_ban.png')
    pg.keyboard.press('Escape'); pg.wait_for_timeout(300)
    nk = [json.loads(l) for l in open(os.path.join(d, 'tao-bai', 'nhat-ky.jsonl'), encoding='utf-8')]
    ev = [e['ev'] for e in nk]
    chk('nhật ký: lượt AI (model, token), sinh xong, sinh lại kèm góp ý, duyệt (có sửa tay)', ev.count('ai') >= 9 and 'app-sinh-xong' in ev and any(e['ev'] == 'app-sinh-lai' and 'Nam' in e.get('gopY', '') for e in nk) and any(e['ev'] == 'app-duyet' for e in nk) and all(e.get('model') == 'claude-haiku-5-5' for e in nk if e['ev'] == 'ai'), sorted(set(ev)))
    chk('0 lỗi console (máy chủ)', not errs, errs)

def file_mode(pg, errs):
    errs.clear(); pg.goto(F); pg.wait_for_timeout(1200); pg.evaluate("window.__tbRand=()=>0")
    pg.click('#tbNew'); pg.wait_for_selector('#raDe'); pg.click('#rdLs [data-ls="u5-l2"]'); pg.wait_for_selector('#rdStruct'); pg.click('#rdGo')
    if pg.locator('#cfmDlg[open]').count(): confirm(pg)
    pg.wait_for_timeout(1000)
    chk('mở file: AI ngoài, ngăn Duyệt mở ở bài 1, hộp AI ngoài mở sẵn', 'AI ngoài' in pg.inner_text('#tbAiTen') and pg.is_visible('#tbDrawer') and pg.evaluate("document.querySelector('#tbNgoaiBox').open") and pg.inner_text('#tbPos').startswith('1 /'))
    chk('dải trên: "5 bài chờ dán kết quả AI"', '5 bài chờ dán kết quả AI' in pg.inner_text('#tbNgoai'))
    pg.click('#tbChep'); pg.wait_for_selector('#tbNhac'); nh = pg.input_value('#tbNhac')
    chk('Chép đoạn nhắc: một khối (hệ thống ===== yêu cầu), đúng bài 1', '==========' in nh and 'BÀI CẦN VIẾT: Bài 1 · Q4 Chọn trong câu · 5 câu' in nh and 'Khung kết quả' in nh, nh[-200:])
    pg.fill('#tbDan', '```\n' + ai_gia.viet('Q4', 5, 1, 'so-cau') + '\n```'); pg.click('#tbDanGo'); pg.wait_for_timeout(300)
    chk('dán bản sai số câu: báo lỗi, chưa ghép', pg.is_visible('#tbDanLoi') and 'sai số câu' in pg.inner_text('#tbDanLoi') and pg.evaluate("__ws.ws.tasks[0].gen.status") == 'wait')
    pg.click('#tbChepSua'); pg.wait_for_timeout(300)
    chk('Chép đoạn nhắc sửa lỗi: kèm bản vừa dán + lỗi', '## SỬA LỖI' in pg.input_value('#tbNhac') and 'sai số câu' in pg.input_value('#tbNhac'))
    pg.fill('#tbDan', 'Đây là bài của bạn:\n\n' + ai_gia.viet('Q4', 5, 1)); pg.click('#tbDanGo'); pg.wait_for_timeout(400)
    g = pg.evaluate(GEN)[0]
    chk('dán bản đúng (có lời dẫn trước ## Task): ghép vào bài 1, ○, model "AI ngoài"', g['st'] == 'todo' and g['title'].startswith('Bài 1 do AI giả') and g['model'] == 'AI ngoài' and not g['notes'], g)
    chk('dải trên: còn 4 bài chờ', '4 bài chờ' in pg.inner_text('#tbNgoai'))
    pg.click('#tbNext'); pg.wait_for_timeout(200)
    pg.fill('#tbDan', ai_gia.viet('Q1', 6, 2, 'so-cau')); pg.click('#tbDanGo'); pg.wait_for_timeout(200); pg.click('#tbDanVan'); pg.wait_for_timeout(300)
    g = pg.evaluate(GEN)[1]
    chk('"Vẫn dùng bản này": ghép, bài ⚠ ghi lỗi', g['st'] == 'todo' and any('sai số câu' in x for x in g['notes']) and pg.evaluate(ICONS)[1] == 'warn', g)
    pg.click('#tbPrev'); pg.wait_for_timeout(200); pg.click('#tbChep'); pg.wait_for_timeout(300)
    chk('bài đã có: Chép đoạn nhắc sinh lại (kèm bản hiện tại)', '## Bản hiện tại của bài này' in pg.input_value('#tbNhac'))
    pg.screenshot(path=f'{OUT}/t4b_ai_ngoai.png')
    chk('0 lỗi console (mở file)', not errs, errs)

with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 900}); errs = []
    # "status of 502": dòng Chrome tự ghi khi máy chủ báo lỗi AI, đúng kịch bản bài 5 (AI giả trả 429) — không phải lỗi app
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_' not in m.text and 'font' not in m.text.lower() and 'favicon' not in m.text.lower() and 'status of 502' not in m.text else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    ai_url, stop_ai = ai_gia.chay()
    d = tempfile.mkdtemp(); port = 1596; B = f'http://127.0.0.1:{port}'
    env = dict(os.environ, LOP_CONG=str(port), LOP_DU_LIEU=d, LOP_KHONG_DEMO='1', LOP_AI_URL=ai_url); env.pop('ANTHROPIC_API_KEY', None)
    sv = subprocess.Popen(['node', '--experimental-strip-types', '--disable-warning=ExperimentalWarning', 'server/lop.ts'], cwd=ROOT, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(50):
            try: urllib.request.urlopen(B + '/api/taobai/giao-trinh'); break
            except Exception: time.sleep(0.2)
        rq = urllib.request.Request(B + '/api/taobai/thiet-lap/ai', data=json.dumps({'nhaCC': 'claude', 'claude': {'key': 'sk-ant-gia-1234', 'model': 'claude-haiku-5-5'}}).encode(), method='PUT', headers={'content-type': 'application/json'})
        urllib.request.urlopen(rq).read()
        server_mode(pg, errs, B, d)
    finally:
        sv.terminate(); sv.wait(); shutil.rmtree(d, ignore_errors=True); stop_ai()
    file_mode(pg, errs)
    b.close()
print('ALL OK' if ok else 'SOME FAIL')
