# Tạo bài T3 (v127): màn Ra đề (chọn bài, cấu trúc, layout sơ bộ), Sinh bài = phiếu khung, quay lại Ra đề giữ cấu trúc.
# Cách chạy: python3 tests/taobai/test_t3.py <ws-editor.html>   (chế độ mở thẳng file: bộ dữ liệu mẫu nhúng)
#            python3 tests/taobai/test_t3.py <ws-editor.html> --may-chu   (thêm phần qua máy chủ lớp thử: dữ liệu + phiếu đã tạo)
import sys, os, json, subprocess, time, tempfile, shutil, urllib.request
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
F = 'file://' + os.path.abspath(sys.argv[1]); SRV = '--may-chu' in sys.argv; ok = True
def chk(n, c, x=''):
    global ok; print(('PASS ' if c else 'FAIL '), n, '' if c else x); ok &= bool(c)
ROWS = "[...document.querySelectorAll('#rdStruct .rdrow')].map(r=>({s:+r.closest('.rdstep').dataset.step,q:r.querySelector('select').value,n:parseInt(r.querySelector('.rdnv').textContent)}))"
STEPS = [(['Q4', 'Q7', 'Q3'], 5, 6), (['Q1', 'Q4'], 6, 8), (['Q3', 'Q8', 'Q2'], 5, 6), (['Q5', 'Q3'], 4, 5), (['Q12', 'Q2'], 3, 5)]
def rules(rows):
    bad = []
    for r in rows:
        a, lo, hi = STEPS[r['s']]
        if r['q'] not in a or not lo <= r['n'] <= hi: bad.append(r)
    for i in range(1, len(rows)):
        if rows[i]['q'] == rows[i - 1]['q']: bad.append(('liền nhau', i))
    return bad
def confirm(pg, yes=True):
    pg.wait_for_selector('#cfmDlg[open]', timeout=3000); pg.click('#cfmYes' if yes else '#cfmNo'); pg.wait_for_timeout(300)
def pick_lesson(pg, ls):
    pg.click(f'#rdLs [data-ls="{ls}"]'); pg.wait_for_selector('#rdStruct, #rdLoi', timeout=5000); pg.wait_for_timeout(300)
def run(pg, url, errs):
    pg.goto(url); pg.wait_for_timeout(1500)
    chk('nút Tạo bài cạnh + Phiếu', pg.is_visible('#tree #tbNew'))
    pg.click('#tbNew'); pg.wait_for_selector('#raDe'); pg.wait_for_timeout(400)
    chk('màn Ra đề: Giáo trình | Unit | Lesson | thông tin', pg.inner_text('#rdGt').count('Pinta English 3') == 1 and 'Unit 5 · My weekend' in pg.inner_text('#rdUnit') and pg.locator('#rdLs [data-ls]').count() == 4)
    chk('lesson có nhãn chuyên đề', [pg.inner_text(f'#rdLs [data-ls="u5-l{i}"] .tag') for i in (1, 2, 3, 4)] == ['Từ vựng', 'Ngữ pháp', 'Ngữ pháp', 'Nghe'])
    pick_lesson(pg, 'u5-l2')
    chk('thông tin lesson: mục tiêu từ Kiến thức', 'was / were ở câu khẳng định' in pg.inner_text('#rdInfo'))
    chk('cấu trúc: 5 bước, mỗi bước 1 bài', pg.locator('#rdStruct .rdstep').count() == 5 and len(pg.evaluate(ROWS)) == 5)
    chk('ghi Trình tự / TF và phiên bản', 'Ngữ pháp v7' in pg.inner_text('#rdStruct') and 'TF v3' in pg.inner_text('#rdStruct'))
    bad = []
    for k in range(25):
        rows = pg.evaluate(ROWS); bad += rules(rows)
        pg.click('#rdReroll'); pg.wait_for_timeout(60)
    chk('⟳ Đề xuất lại ×25: Q trong danh sách được phép, số câu trong khoảng, không hai bài liền cùng Q', not bad, bad[:3])
    seen = set()
    for k in range(25): seen.add(pg.evaluate(ROWS)[0]['q']); pg.click('#rdReroll'); pg.wait_for_timeout(40)
    chk('đề xuất thật sự ngẫu nhiên (bước 1 ra ≥ 2 dạng khác nhau)', len(seen) >= 2, seen)
    info = pg.inner_text('#rdPvInfo')
    chk('layout sơ bộ: "5 bài · ước tính k trang / tối đa 2"', info.startswith('5 bài · ước tính') and 'tối đa 2' in info, info)
    np0 = pg.locator('#rdPv .rdpg').count()
    chk('layout sơ bộ vẽ trang thu nhỏ có Task thật (bộ dàn của app)', np0 >= 1 and pg.locator('#rdPv .rdpg section.task').count() >= 5, np0)
    # +/✕/−/+, bước bắt buộc / không bắt buộc
    s1 = '#rdStruct .rdstep[data-step="1"]'
    pg.click(f'{s1} .rdplus'); pg.wait_for_timeout(150)
    chk('+ ở bước 2: 2 bài, + mờ (tối đa 2)', pg.locator(f'{s1} .rdrow').count() == 2 and pg.is_disabled(f'{s1} .rdplus'))
    chk('số thứ tự chung: bài mới là 3, bước 3 thành 4', pg.inner_text(f'{s1} .rdrow >> nth=1 >> .rdn') == '3' and pg.inner_text('#rdStruct .rdstep[data-step="2"] .rdn') == '4')
    chk('6 bài · layout cập nhật ngay', pg.inner_text('#rdPvInfo').startswith('6 bài'))
    s0 = '#rdStruct .rdstep[data-step="0"]'
    chk('bước bắt buộc còn 1 bài: ✕ mờ; tối đa 1: + mờ', pg.is_disabled(f'{s0} [data-del]') and pg.is_disabled(f'{s0} .rdplus'))
    s2 = '#rdStruct .rdstep[data-step="2"]'
    pg.click(f'{s2} [data-del]'); pg.wait_for_timeout(150)
    chk('bước không bắt buộc xóa hết = "Bỏ qua bước này"', 'Bỏ qua bước này' in pg.inner_text(s2) and pg.inner_text('#rdPvInfo').startswith('5 bài'))
    pg.click(f'{s2} .rdplus'); pg.wait_for_timeout(150)
    chk('+ thêm lại bài cho bước bỏ qua', pg.locator(f'{s2} .rdrow').count() == 1)
    r0 = f'{s0} .rdrow'
    for _ in range(4): pg.click(f'{r0} [data-dn="-1"]') if not pg.is_disabled(f'{r0} [data-dn="-1"]') else None
    chk('− dừng ở số câu tối thiểu (5), nút mờ', pg.evaluate(ROWS)[0]['n'] == 5 and pg.is_disabled(f'{r0} [data-dn="-1"]'))
    pg.click(f'{r0} [data-dn="1"]'); pg.click(f'{r0} [data-dn="1"]') if not pg.is_disabled(f'{r0} [data-dn="1"]') else None
    chk('+ dừng ở tối đa (6)', pg.evaluate(ROWS)[0]['n'] == 6 and pg.is_disabled(f'{r0} [data-dn="1"]'))
    pg.select_option(f'{r0} select', 'Q3'); pg.wait_for_timeout(100)
    chk('menu dạng chỉ có Q được phép, đổi được', pg.evaluate(f"[...document.querySelectorAll('{r0} select option')].map(o=>o.value)") == ['Q4', 'Q7', 'Q3'] and pg.evaluate(ROWS)[0]['q'] == 'Q3')
    q5 = pg.evaluate(ROWS)[-1]['q']; pg.click('#rdStruct .rdstep[data-step="4"] [data-rr]'); pg.wait_for_timeout(100)
    chk('⟳ trên một bài: đổi sang dạng khác', pg.evaluate(ROWS)[-1]['q'] != q5)
    # vượt số trang
    for si in range(5):
        st = f'#rdStruct .rdstep[data-step="{si}"]'
        if not pg.is_disabled(f'{st} .rdplus'): pg.click(f'{st} .rdplus'); pg.wait_for_timeout(80)
        for r in range(pg.locator(f'{st} .rdrow').count()):
            for _ in range(3):
                b = f'{st} .rdrow >> nth={r} >> [data-dn="1"]'
                if not pg.is_disabled(b): pg.click(b)
    pg.wait_for_timeout(200)
    nP = pg.locator('#rdPv .rdpg').count()
    chk('cấu trúc dài: vượt tối đa → trang thừa viền đỏ, chữ đỏ', nP > 2 and pg.locator('#rdPv .rdpg.over').count() == nP - 2 and 'vượt tối đa 2' in pg.inner_text('#rdPvInfo'), [nP, pg.inner_text('#rdPvInfo')])
    # đổi lesson khi đã chỉnh → hỏi
    pg.click('#rdLs [data-ls="u5-l3"]'); pg.wait_for_selector('#cfmDlg[open]', timeout=3000)
    chk('đổi lesson khi đã chỉnh cấu trúc → hỏi xác nhận', 'Cấu trúc đang chỉnh sẽ mất' in pg.inner_text('#cfmMsg'))
    pg.click('#cfmNo'); pg.wait_for_timeout(200)
    chk('Hủy: giữ lesson 2 và cấu trúc đang chỉnh', pg.locator('#rdLs [data-ls="u5-l2"].on').count() == 1 and len(pg.evaluate(ROWS)) > 5)
    # lesson Nghe (bước 1 không bắt buộc), lesson Từ vựng
    pick_lesson(pg, 'u5-l4'); confirm(pg)
    pick_lesson(pg, 'u5-l4')
    chk('lesson Nghe: 4 bước theo Trình tự Nghe', pg.locator('#rdStruct .rdstep').count() == 4 and 'Nghe v1' in pg.inner_text('#rdStruct'))
    pick_lesson(pg, 'u5-l2')
    # thu gọn khung chọn bài
    pg.click('#rdPickH'); pg.wait_for_timeout(100)
    chk('bấm "Chọn bài": thu gọn thành một dòng Giáo trình › Unit › Lesson [chuyên đề]', pg.locator('#rdLs').count() == 0 and pg.inner_text('#rdCrumb').replace('\n', ' ').strip() == 'Pinta English 3 › Unit 5 · My weekend › Lesson 2 · was / were Ngữ pháp', pg.inner_text('#rdCrumb') if pg.locator('#rdCrumb').count() else '')
    pg.click('#rdPickH'); pg.wait_for_timeout(100)
    chk('bấm lại: mở', pg.locator('#rdLs').count() == 1)
    # Sinh bài → phiếu khung
    rows = pg.evaluate(ROWS); est = pg.locator('#rdPv .rdpg').count()
    pg.fill('#rdNote', 'chủ đề cắm trại')
    pg.click('#rdGo'); confirm(pg); pg.wait_for_timeout(800)
    chk('Sinh bài: đóng Ra đề, vào Biên tập', pg.locator('#raDe').count() == 0 and pg.is_visible('#tbBar'))
    w = pg.evaluate("(()=>{const w=__ws.ws;return {n:w.tasks.length,title:w.title,src:w.gen.src,st:w.gen.structure,note:w.gen.note,max:w.gen.maxPages,tg:w.tasks.map(t=>[t.gen.q,t.gen.n,t.gen.status,qOf(t)]),pages:__ws.res.pages.length}})()")
    chk('phiếu khung: đúng số bài, cấu trúc, ghi chú, phiên bản file', w['n'] == len(rows) and [x['q'] for x in w['st']] == [r['q'] for r in rows] and w['note'] == 'chủ đề cắm trại' and w['src']['ver']['trinhTu'] == '7' and w['src']['lesson'] == 'u5-l2' and w['max'] == 2, w)
    chk('mỗi bài: dạng Q đúng cấu trúc, trạng thái ⏳ đang viết', all(t[0] == t[3] and t[2] == 'wait' for t in w['tg']) and pg.locator('#tree .tbic.wait').count() == len(rows), w['tg'])
    chk('số trang phiếu khung = ước tính của layout sơ bộ (cùng bộ dàn)', w['pages'] == est, [w['pages'], est])
    chk('dải trên: tên lesson', 'Unit 5 · My weekend · Lesson 2 · was / were' in pg.inner_text('#tbBar'))
    pg.click('#tbDuyet'); pg.wait_for_timeout(150)
    chk('bài đang viết: nút Duyệt mờ', pg.is_disabled('#tbApprove'))
    pg.click('#tbClose')
    # quay lại Ra đề giữ cấu trúc; đổi một bài rồi Sinh bài: bài không đổi giữ nguyên
    pg.evaluate("__ws.commit(w=>{w.tasks[0].title='Bài 1 đã sửa tay'})"); pg.wait_for_timeout(150)
    id0 = pg.evaluate("__ws.ws.tasks[0].id")
    pg.click('#tbRaDe'); pg.wait_for_selector('#raDe'); pg.wait_for_selector('#rdStruct'); pg.wait_for_timeout(300)
    chk('quay lại Ra đề: cấu trúc đã duyệt hiện lại, khung chọn thu gọn, ghi chú còn', pg.evaluate(ROWS) == rows and pg.locator('#rdCrumb').count() == 1 and pg.input_value('#rdNote') == 'chủ đề cắm trại', [pg.evaluate(ROWS), rows])
    chk('② Biên tập bấm được (về phiếu đang có)', not pg.is_disabled('#rdToEd'))
    last = f'#rdStruct .rdrow >> nth={len(rows) - 1}'
    dn = '-1' if not pg.is_disabled(f'{last} >> [data-dn="-1"]') else '1'
    pg.click(f'{last} >> [data-dn="{dn}"]'); pg.wait_for_timeout(150)
    pg.click('#rdGo'); pg.wait_for_selector('#cfmDlg[open]')
    chk('hỏi: giữ k bài không đổi, sinh 1 bài', f'{len(rows) - 1} bài không đổi được giữ nguyên' in pg.inner_text('#cfmMsg') and '1 bài đổi hoặc mới' in pg.inner_text('#cfmMsg'), pg.inner_text('#cfmMsg'))
    pg.click('#cfmYes'); pg.wait_for_timeout(600)
    w2 = pg.evaluate("(()=>{const w=__ws.ws;return {ids:w.tasks.map(t=>t.id),t0:w.tasks[0].title,st:w.tasks.map(t=>t.gen.status),n:w.tasks.length}})()")
    chk('bài không đổi giữ nguyên (kể cả sửa tay), bài đổi thành khung mới ⏳', w2['n'] == len(rows) and w2['ids'][0] == id0 and w2['t0'] == 'Bài 1 đã sửa tay' and w2['st'][-1] == 'wait', w2)
    pg.click('#undo'); pg.wait_for_timeout(300)
    chk('Hoàn tác được', pg.evaluate("__ws.ws.gen.structure.slice(-1)[0].n") == rows[-1]['n'])
    # độ chính xác layout sơ bộ: phiếu "thật" (chữ thật) cùng cấu trúc, sai số ±1 trang
    pg.evaluate("md=>loadSheet(impSheetObj(readMd(md)))", open(os.path.join(HERE, 'phieu_was_were.md'), encoding='utf-8').read()); pg.wait_for_timeout(800)
    real = pg.evaluate("__ws.res.pages.length")
    plan = [[{'q': 'Q4', 'n': 6}], [{'q': 'Q1', 'n': 6}], [{'q': 'Q8', 'n': 6}], [{'q': 'Q5', 'n': 5}], [{'q': 'Q12', 'n': 5}]]
    pv = pg.evaluate("p=>__tbTest.preview(p,'pinta-english-3','u5-l2').then(r=>r.pv.pages.length)", plan)
    chk(f'layout sơ bộ ({pv} trang) khớp phiếu chữ thật cùng cấu trúc ({real} trang) ±1', abs(pv - real) <= 1, [pv, real])
    pg.screenshot(path='/tmp/claude-0/t3_end.png')
    chk('0 lỗi console', not errs, errs)

with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 900}); errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_' not in m.text and 'font' not in m.text.lower() and 'favicon' not in m.text.lower() else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    run(pg, F, errs)
    pg.goto(F); pg.wait_for_timeout(1200); pg.click('#tbNew'); pg.wait_for_selector('#raDe')
    pg.screenshot(path='/tmp/claude-0/t3_rade.png'); pg.click('#rdLs [data-ls="u5-l2"]'); pg.wait_for_timeout(600); pg.screenshot(path='/tmp/claude-0/t3_rade2.png', full_page=True)
    chk('mở thẳng file: nguồn là bộ mẫu nhúng; "Phiếu đã tạo" nói cần máy chủ', 'Bộ dữ liệu mẫu' in pg.inner_text('#rdSrc') and 'máy chủ' in pg.inner_text('#rdInfo'))
    # thư mục dữ liệu giáo viên chọn: thiếu TF ở chuyên đề Nghe → lesson 4 báo lỗi, không có nút Sinh bài
    tmp = tempfile.mkdtemp(); shutil.copytree(os.path.join(ROOT, 'server/demo/tao-bai'), os.path.join(tmp, 'tao-bai'))
    os.remove(os.path.join(tmp, 'tao-bai/pinta-english-3/chuyen-de/nghe/tf.md'))
    try:
        pg.set_input_files('#raDe input[type=file]', os.path.join(tmp, 'tao-bai')); pg.wait_for_timeout(600)
        chk('chọn thư mục dữ liệu: nguồn đổi', 'Thư mục “tao-bai”' in pg.inner_text('#rdSrc'), pg.inner_text('#rdSrc'))
        pg.click('#rdLs [data-ls="u5-l4"]'); pg.wait_for_timeout(500)
        chk('lesson thiếu TF: báo lỗi, không tạo bài được', pg.is_visible('#rdLoi') and 'chưa có TF' in pg.inner_text('#rdLoi') and pg.locator('#rdGo').count() == 0)
    except Exception as e:
        chk('chọn thư mục dữ liệu (set_input_files thư mục)', False, str(e)[:200])
    shutil.rmtree(tmp)
    if SRV:
        d = tempfile.mkdtemp(); port = 1599
        env = dict(os.environ, LOP_CONG=str(port), LOP_DU_LIEU=d, LOP_KHONG_DEMO='1')
        sv = subprocess.Popen(['node', '--experimental-strip-types', '--disable-warning=ExperimentalWarning', 'server/lop.ts'], cwd=ROOT, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        try:
            for _ in range(50):
                try: urllib.request.urlopen(f'http://127.0.0.1:{port}/api/taobai/giao-trinh'); break
                except Exception: time.sleep(0.2)
            errs.clear(); pg.goto(f'http://127.0.0.1:{port}/editor'); pg.wait_for_timeout(1500)
            pg.click('#tbNew'); pg.wait_for_selector('#raDe'); pg.wait_for_timeout(500)
            chk('qua máy chủ: nguồn "Dữ liệu trên máy chủ"', 'máy chủ' in pg.inner_text('#rdSrc'))
            pick_lesson(pg, 'u5-l2')
            chk('qua máy chủ: chưa có phiếu đã tạo', 'Chưa có.' in pg.inner_text('#rdInfo'))
            pg.click('#rdGo'); confirm(pg); pg.wait_for_timeout(800)
            pg.click('#tbDuyet'); pg.click('#tbApproveSheet'); pg.wait_for_timeout(800)
            pg.click('#tbRaDe'); pg.wait_for_selector('#rdStruct'); pg.click('#rdPickH'); pg.wait_for_timeout(500)
            chk('Duyệt phiếu → lưu lên máy chủ, hiện ở "Phiếu đã tạo"', pg.locator('#rdInfo .rdph li').count() == 1 and 'bài' in pg.inner_text('#rdInfo .rdph'), pg.inner_text('#rdInfo'))
            pg.click('#rdInfo .rdph button'); confirm(pg); pg.wait_for_timeout(800)
            chk('Mở phiếu đã tạo', pg.locator('#raDe').count() == 0 and pg.evaluate("__ws.ws.gen.src.lesson") == 'u5-l2' and pg.evaluate("__ws.ws.gen.history.length") == 1)
            chk('0 lỗi console (máy chủ)', not errs, errs)
        finally:
            sv.terminate(); sv.wait(); shutil.rmtree(d, ignore_errors=True)
    b.close()
print('ALL OK' if ok else 'SOME FAIL')
