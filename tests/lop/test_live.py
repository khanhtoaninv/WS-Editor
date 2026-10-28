# v123 nút Live trong WS Editor: mở /editor từ máy chủ lớp thử → ● Live → đăng nhập → lập lớp mẫu → Bắt đầu phiên →
# hộp hiện mã + QR + bảng theo dõi (nhúng /gv) → học sinh vào thì bảng nhảy → kết thúc phiên → có Chấm chữa / Báo cáo.
# Mở editor như file thường (không qua máy chủ) thì không có nút Live. Cách dùng: python3 tests/lop/test_live.py
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from chung import Server, ROOT, LOAD, hs_vao
from playwright.sync_api import sync_playwright

OUT = '/tmp/claude-0/lop'; os.makedirs(OUT, exist_ok=True)
fails, n = [], 0
def ok(c, m):
    global n; n += 1
    if not c: fails.append(m); print('  FAIL', m)

S = Server(); errs = []
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        # 0) editor mở như file thường: không có nút Live
        fx = b.new_context(viewport={'width': 1366, 'height': 900}); f = fx.new_page()
        f.goto('file://' + os.path.join(ROOT, 'ws-editor.html')); f.wait_for_function('() => typeof loadSheet === "function"')
        ok(f.query_selector('#liveBtn') is None, 'mở như file thường: không có nút Live')
        ok(f.query_selector('#wspBtn') is not None, 'file thường vẫn có nút Gói .wsp')
        fx.close()
        # 1) qua máy chủ
        ctx = b.new_context(viewport={'width': 1366, 'height': 900}); ed = ctx.new_page()
        ed.on('pageerror', lambda e: errs.append('ed: ' + str(e))); ed.on('console', lambda m: errs.append('ed: ' + m.text) if m.type == 'error' else None)
        ed.on('dialog', lambda d: d.accept())
        ed.goto(S.base + '/editor'); ed.wait_for_function('() => typeof loadSheet === "function"')
        r = ed.evaluate(LOAD, open(os.path.join(ROOT, 'tests/md/birthday.md'), encoding='utf-8').read()); ok(r == 'ok', 'nạp phiếu ' + r)
        ed.wait_for_timeout(400)
        ok(ed.query_selector('#liveBtn') is not None, 'qua máy chủ: có nút Live')
        ed.screenshot(path=f'{OUT}/live_nut.png')
        ed.click('#liveBtn'); ed.wait_for_selector('#liveSum'); ed.wait_for_function("() => !document.getElementById('liveBusy')")
        ok(ed.query_selector('#livePass') is not None, 'chưa đăng nhập: hiện ô mật khẩu')
        ok(ed.is_disabled('#liveGo'), 'chưa đăng nhập: Bắt đầu bị khóa')
        ed.fill('#livePass', 'sai-mat-khau'); ed.click('#liveLogin'); ed.wait_for_selector('#liveErr'); ok('mật khẩu' in ed.inner_text('#liveErr').lower(), 'sai mật khẩu báo lỗi: ' + ed.inner_text('#liveErr'))
        ed.fill('#livePass', '123456'); ed.click('#liveLogin'); ed.wait_for_selector('#liveLop')
        ok(ed.is_disabled('#liveGo'), 'chưa có lớp: Bắt đầu bị khóa')
        ed.click('#liveNewLop'); ed.fill('#liveNlTen', '5B thử'); ed.click('#liveNlMau'); ed.click('#liveNlLuu'); ed.wait_for_function("() => document.querySelector('#liveLop').selectedOptions[0].textContent.includes('5B')")
        if ed.query_selector('#liveSeen'): ed.check('#liveSeen')
        ed.wait_for_function("() => !document.getElementById('liveGo').disabled")
        ed.screenshot(path=f'{OUT}/live_chuan_bi.png')
        ed.click('#liveGo'); ed.wait_for_selector('#liveFrame')
        fr = ed.frame_locator('#liveFrame'); fr.locator('#phMa').wait_for(timeout=15000)
        ma = fr.locator('#phMa').inner_text().strip(); ok(len(ma) == 6, 'hiện mã phiên trong hộp: ' + ma)
        ok(fr.locator('.join .qr svg').count() == 1, 'hiện mã QR trong hộp')
        ok(fr.locator('#phBang tbody tr').count() == 12, 'bảng theo dõi 12 em')
        ed.screenshot(path=f'{OUT}/live_chay.png')
        # 2) học sinh vào → bảng trong hộp nhảy
        hctx, hp, herrs = hs_vao(b, S.base, ma, 'An')
        fr.locator('#phBang tr[data-hs] >> text=Đang làm').first.wait_for(timeout=10000); ok(True, 'em vào → bảng trong hộp nhảy "Đang làm"')
        ok(not herrs, 'học sinh 0 lỗi console ' + str(herrs))
        # 3) đóng hộp, mở lại → thấy phiên đang mở, bấm quay lại
        ed.click('#liveClose'); ed.wait_for_function("() => !document.getElementById('liveDlg').open")
        ed.click('#liveBtn'); ed.wait_for_selector('[data-phien]'); ok(ma in ed.inner_text('#liveOpen'), 'mở lại Live: liệt kê phiên đang mở, kèm mã')
        ed.click('[data-phien]'); fr = ed.frame_locator('#liveFrame'); fr.locator('#phMa').wait_for(); ok(fr.locator('#phMa').inner_text().strip() == ma, 'quay lại đúng phiên')
        # 4) kết thúc phiên trong hộp → Chấm chữa + Báo cáo
        fr.locator('#phKetThuc').click(); fr.locator('#phCham').wait_for(timeout=10000); ok(fr.locator('#phBaoCao').count() == 1, 'kết thúc phiên: có Chấm chữa và Báo cáo')
        ed.screenshot(path=f'{OUT}/live_ketthuc.png')
        # 5) chỉ trang nhúng: không có thanh trên
        ok(fr.locator('.lophd').count() == 0, 'trang nhúng không có thanh trên')
        ed.click('#liveBack'); ed.wait_for_selector('#liveGo')
        e403 = [e for e in errs if '403' in e]; ok(len(e403) == 1 and len(errs) == 1, 'editor 0 lỗi console (chỉ 1 lỗi 403 do cố ý gõ sai mật khẩu) ' + str(errs))
        hctx.close(); b.close()
finally:
    out = S.stop()
print(f'{n} kiểm tra, ' + ('ALL OK' if not fails else f'SOME FAIL {len(fails)}'))
sys.exit(1 if fails else 0)
