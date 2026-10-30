# Tạo bài v130: giáo viên tự quyết cấu trúc (bài tự do, số câu bất kỳ, yêu cầu riêng, không giới hạn số bài / số trang).
# Cách chạy: python3 tests/taobai/test_tu_quyet.py <ws-editor.html>
import sys, os
from playwright.sync_api import sync_playwright
F = 'file://' + os.path.abspath(sys.argv[1]); ok = True
def chk(n, c, x=''):
    global ok; print(('PASS ' if c else 'FAIL '), n, '' if c else x); ok &= bool(c)
ROWS = "[...document.querySelectorAll('#rdStruct .rdrow')].map(r=>({s:+r.closest('.rdstep').dataset.step,q:r.querySelector('select').value,n:+r.querySelector('.rdnum').value,yc:r.querySelector('.rdyc').value}))"
def confirm(pg):
    pg.wait_for_selector('#cfmDlg[open]', timeout=3000); pg.click('#cfmYes'); pg.wait_for_timeout(400)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 900}); errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_' not in m.text and 'font' not in m.text.lower() and 'favicon' not in m.text.lower() else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.goto(F); pg.wait_for_timeout(1500); pg.click('#tbNew'); pg.wait_for_selector('#raDe')
    pg.click('#rdLs [data-ls="u5-l2"]'); pg.wait_for_selector('#rdStruct'); pg.wait_for_timeout(300)
    fr = '#rdStruct .rdstep[data-step="5"]'
    chk('nhóm "Bài tự do" ở cuối, trống', 'Chưa có bài tự do' in pg.inner_text(fr))
    pg.click(f'{fr} .rdplus'); pg.wait_for_timeout(150)
    pg.select_option(f'{fr} select', 'Q8'); pg.fill(f'{fr} .rdnum', '9'); pg.fill(f'{fr} .rdyc', 'nối đồ vật trong nhà bếp'); pg.wait_for_timeout(150)
    rows = pg.evaluate(ROWS)
    chk('thêm bài tự do: Q8 · 9 câu · yêu cầu riêng, đứng cuối (bài 6)', len(rows) == 6 and rows[5] == {'s': 5, 'q': 'Q8', 'n': 9, 'yc': 'nối đồ vật trong nhà bếp'} and pg.inner_text(f'{fr} .rdn') == '6', rows)
    pg.fill('#rdStruct .rdstep[data-step="0"] .rdyc', 'chỉ dùng tên động vật'); pg.wait_for_timeout(100)
    for _ in range(3): pg.click('#rdStruct .rdstep[data-step="3"] .rdplus'); pg.wait_for_timeout(60)
    chk('không giới hạn số bài mỗi bước (bước 4 có 4 bài), không giới hạn trang', pg.locator('#rdStruct .rdstep[data-step="3"] .rdrow').count() == 4 and 'tối đa' not in pg.inner_text('#rdPvInfo'))
    for _ in range(3): pg.click('#rdStruct .rdstep[data-step="3"] [data-del] >> nth=0'); pg.wait_for_timeout(60)
    pg.fill('#rdNote', 'x'); pg.click('#rdGo'); confirm(pg); pg.wait_for_timeout(800)
    w = pg.evaluate("(()=>{const w=__ws.ws;return {st:w.gen.structure,tg:w.tasks.map(t=>({step:t.gen.step,q:t.gen.q,n:t.gen.n,yc:t.gen.yc||''}))}})()")
    last = w['st'][-1]
    chk('phiếu khung: bài tự do là step 0, Q8, 9 câu, giữ yêu cầu riêng', last['step'] == 0 and last['q'] == 'Q8' and last['n'] == 9 and last['yc'] == 'nối đồ vật trong nhà bếp' and w['tg'][-1]['yc'] == 'nối đồ vật trong nhà bếp', w)
    chk('yêu cầu riêng của bài thuộc bước cũng được giữ', w['st'][0]['yc'] == 'chỉ dùng tên động vật' and w['tg'][0]['yc'] == 'chỉ dùng tên động vật', w['st'][0])
    pg.click('#tbRaDe'); pg.wait_for_selector('#rdStruct'); pg.wait_for_timeout(300)
    chk('quay lại Ra đề: bài tự do và yêu cầu riêng hiện lại đúng chỗ', pg.evaluate(ROWS)[-1] == {'s': 5, 'q': 'Q8', 'n': 9, 'yc': 'nối đồ vật trong nhà bếp'} and len(pg.evaluate(ROWS)) == 6)
    pg.fill(f'{fr} .rdyc', 'nối đồ vật trong phòng khách'); pg.wait_for_timeout(100); pg.click('#rdGo'); pg.wait_for_selector('#cfmDlg[open]')
    chk('đổi yêu cầu riêng một bài → chỉ bài đó sinh lại (5 bài giữ nguyên)', '5 bài không đổi được giữ nguyên' in pg.inner_text('#cfmMsg') and '1 bài đổi hoặc mới' in pg.inner_text('#cfmMsg'), pg.inner_text('#cfmMsg'))
    pg.click('#cfmNo'); pg.wait_for_timeout(200)
    chk('0 lỗi console', not errs, errs)
    b.close()
print('ALL OK' if ok else 'SOME FAIL'); sys.exit(0 if ok else 1)
