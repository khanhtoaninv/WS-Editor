# v123 dữ liệu demo + avatar: máy chủ trống chạy lần đầu tự nạp demo; nút "Nạp dữ liệu demo" nạp lại không nhân đôi;
# 2 lớp học sinh có avatar khác nhau; phiên đã kết thúc có báo cáo + chấm chữa; phiên đang mở (mã LAMTHU) vào làm như học sinh.
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from chung import Server, gv_login, hs_vao, api
from playwright.sync_api import sync_playwright

OUT = '/tmp/claude-0/lop'; os.makedirs(OUT, exist_ok=True)
fails, n = [], 0
def ok(c, m):
    global n; n += 1
    if not c: fails.append(m); print('  FAIL', m)

S = Server(env={'LOP_KHONG_DEMO': '0'}); errs = []
try:
    with sync_playwright() as p:
        b = p.chromium.launch(); gctx = b.new_context(viewport={'width': 1366, 'height': 900}); g = gctx.new_page()
        g.on('pageerror', lambda e: errs.append('gv: ' + str(e))); g.on('console', lambda m: errs.append('gv: ' + m.text) if m.type == 'error' else None)
        gv_login(g, S.base)
        # 1) lần chạy đầu tự nạp
        ps = api(g, '/api/phien')['j']; ok(len(ps) == 2, f'tự nạp: 2 phiên ({len(ps)})')
        ok(len(api(g, '/api/goi')['j']) == 2 and len(api(g, '/api/lop')['j']) == 2, '2 phiếu, 2 lớp')
        g.click('#tab-lop'); g.wait_for_selector('.avs .av')
        ok(g.locator('.ltbl tr').first.locator('.av').count() == 8, 'danh sách lớp có avatar')
        lops = api(g, '/api/lop')['j']
        from_js = g.evaluate("""async () => { const { avatarOf } = await import('data:text/javascript,'); return 0 }""") if False else None
        # 2) avatar khác nhau trong lớp: mã học sinh → hình (cùng công thức shared/src/avatar.ts), kiểm bằng ô trên trang phiên
        g.click('#tab-phien'); g.wait_for_selector('.ltbl tr.click')
        cho = [r for r in g.locator('.ltbl tr.click').all() if 'Đang mở' in r.inner_text()]; ok(len(cho) == 1 and 'LAMTHU' in cho[0].inner_text(), 'phiên đang mở có mã LAMTHU')
        dong = [r for r in g.locator('.ltbl tr.click').all() if 'Đã kết thúc' in r.inner_text()]; ok(len(dong) == 1, 'phiên đã kết thúc')
        dong[0].click(); g.wait_for_selector('#phBang tbody tr')
        em = g.locator('#phBang tbody tr .av').all_inner_texts(); ok(len(em) == 12 and len(set(em)) == 12, f'4A: 12 em, 12 avatar khác nhau {em}')
        g.screenshot(path=f'{OUT}/demo_phien_4a.png')
        # 3) báo cáo của phiên đã kết thúc
        g.click('#phBaoCao'); g.wait_for_selector('.rpt')
        txt = g.inner_text('.rpt'); ok('Câu sai nhiều' in txt, 'báo cáo có Câu sai nhiều')
        bc = api(g, f"/api/phien/{ps[0]['id'] if ps[0]['trangThai']=='dong' else ps[1]['id']}/bao-cao")['j']
        nop = [s for s in bc['students'] if s['nop']]; ok(len(nop) == 11, f'11 em nộp (10 + 1 thu khi kết thúc): {len(nop)}')
        pcts = sorted(s['pct'] for s in nop); ok(pcts[0] < 55 and pcts[-1] > 85, f'điểm trải đều {pcts}')
        ok(sum(1 for s in bc['students'] if s['xong']) == 7, '7 em đã chấm chữa')
        ok(sum(1 for s in bc['students'] if not s['vao']) == 1, '1 em vắng')
        g.screenshot(path=f'{OUT}/demo_baocao.png')
        # 4) vào làm ở phiên đang mở
        ctx, pg, herrs = hs_vao(b, S.base, 'LAMTHU', 'Xuân'); ok(pg.query_selector('#wsShow') is not None, 'vào làm phiếu ôn tập')
        pg.screenshot(path=f'{OUT}/demo_hs.png')
        # thoát để vào bằng tên khác trên cùng máy
        pg.once('dialog', lambda d: d.accept()); pg.click('#hsOut'); pg.wait_for_selector('.hsnames')
        ok(pg.locator('.hsnames .lb.used').count() == 4, 'thoát: tên Xuân được nhả (4 em đã vào sẵn vẫn khóa)')
        pg.click('.hsnames >> text="Yến"'); pg.wait_for_selector('#wsShow'); ok('Yến' in pg.inner_text('.hsname'), 'vào lại bằng tên khác trên cùng máy')
        ctx.close()
        ok(not herrs, 'học sinh 0 lỗi console ' + str(herrs))
        # màn chọn tên có avatar
        pg2 = b.new_context(viewport={'width': 390, 'height': 844}).new_page(); pg2.goto(f'{S.base}/hs?ma=LAMTHU'); pg2.wait_for_selector('.hsnames')
        ok(pg2.locator('.hsnames .lb .av').count() == 9, 'màn chọn tên: 9 em, mỗi em một avatar'); pg2.screenshot(path=f'{OUT}/demo_chon_ten.png')
        # 5) nạp lại: không nhân đôi
        g.goto(S.base + '/gv'); g.wait_for_selector('#demoBtn'); g.once('dialog', lambda d: d.accept()); g.click('#demoBtn'); g.wait_for_selector('#demoMsg:has-text("Đã nạp")')
        ok(len(api(g, '/api/phien')['j']) == 2 and len(api(g, '/api/lop')['j']) == 2 and len(api(g, '/api/goi')['j']) == 2, 'nạp lại: vẫn 2 / 2 / 2')
        ok(not errs, 'giáo viên 0 lỗi console ' + str(errs)); b.close()
finally: S.stop()
print(f'{n} kiểm tra, ' + ('ALL OK' if not fails else f'SOME FAIL {len(fails)}')); sys.exit(1 if fails else 0)
