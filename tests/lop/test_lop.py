# v119 Lớp học thử: máy chủ thật + trình duyệt (giáo viên + 3 học sinh, một em trên điện thoại).
# Gửi gói từ WS Editor (/editor) → lập lớp mẫu → mở phiên (mã + QR) → học sinh vào, làm (tự lưu), nộp → bảng theo dõi cập nhật
# trực tiếp → kết thúc phiên (thu bài em chưa nộp) → học sinh thấy bài bị khóa. Không lộ đáp án, 0 lỗi console.
# Cách dùng: python3 tests/lop/test_lop.py   (ảnh chụp ở /tmp/claude-0/lop/)
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from chung import Server, gv_login, gui_goi, mo_phien, hs_vao, api, lam
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
        gctx = b.new_context(viewport={'width': 1366, 'height': 900}); g = gctx.new_page()
        g.on('pageerror', lambda e: errs.append('gv: ' + str(e))); g.on('console', lambda m: errs.append('gv: ' + m.text) if m.type == 'error' else None)
        # chưa đăng nhập: không gửi được gói
        gv_login(g, S.base)
        msg = gui_goi(gctx, S.base, 'tests/md/birthday.md', lan=2); ok('Đã gửi' in msg and 'phiên bản 1' in msg, 'gửi gói từ WS Editor, gửi lại không sửa: vẫn phiên bản 1 · ' + msg)
        g.click('#tab-goi'); g.wait_for_selector('text=A Surprise Birthday Party'); nr = g.locator('.lcard .ltbl tr').count(); ok(nr == 1, f'gửi lại cùng bản: vẫn một gói ({nr} dòng)')
        ma = mo_phien(g); ok(len(ma) == 6, 'mã phiên ' + ma)
        ok(g.query_selector('.join .qr svg') is not None, 'có mã QR')
        g.screenshot(path=f'{OUT}/gv_phien.png')
        pid = g.evaluate("() => fetch('/api/phien').then(r => r.json()).then(a => a[0].id)")
        goi = api(g, '/api/phien/' + pid)['j']['goi']
        key = api(g, f'/api/goi/{goi}/dap-an')['j']
        # học sinh
        an_ctx, an, an_err = hs_vao(b, S.base, ma, 'An')
        sl = an.evaluate("() => fetch('/api/hs/bai').then(r => r.json())")
        slots = sl['slots']; body = json.dumps(sl, ensure_ascii=False)
        leak = [a for k in key.values() for a in (k.get('accept') or []) if len(a) > 3 and f'"{a}"' in body]
        ok(not leak and '"correct"' not in body and '"accept"' not in body, f'học sinh không nhận đáp án {leak[:3]}')
        ok(an.query_selector('#showAns') is None and an.query_selector('#workReveal') is None and an.query_selector('.vpal') is None and an.query_selector('#showClose') is None, 'học sinh không có công cụ giáo viên')
        an.screenshot(path=f'{OUT}/hs_vao.png')
        done = lam(an, slots, key, lambda s: 'dung' if sum(map(ord, s['id'])) % 4 else 'sai')
        ok(len(done) >= len(slots) * .8, f'An làm {len(done)}/{len(slots)} chỗ')
        ok(an.query_selector('.vw-ok, .vw-no') is None, 'học sinh không thấy đúng / sai')
        an.wait_for_selector('#hsSave:has-text("Đã lưu")', timeout=5000)
        g.wait_for_function(f"() => {{ const r = document.querySelector('#phBang tr[data-hs] td:nth-child(3)'); return r && /^\\s*{len(done)}\\//.test(r.textContent.trim()); }}", timeout=5000)
        ok(True, 'bảng theo dõi cập nhật trực tiếp')
        # vào lại (tải lại trang) → làm tiếp, bài còn nguyên
        an.reload(); an.wait_for_selector('#wsShow'); an.wait_for_timeout(300)
        back = an.evaluate("() => fetch('/api/hs/bai').then(r => r.json()).then(j => Object.keys(j.answers).length)")
        ok(back == len(done), f'tải lại trang: bài còn {back}/{len(done)} chỗ')
        # nộp
        an.click('#hsNop'); an.wait_for_selector('.hsask'); an.click('#hsNopOk'); an.wait_for_selector('.vbanner')
        ok('đã nộp' in an.inner_text('.vbanner'), 'An thấy đã nộp')
        an.screenshot(path=f'{OUT}/hs_danop.png')
        # Bình trên điện thoại làm dở; Chi vào rồi không làm
        bi_ctx, bi, bi_err = hs_vao(b, S.base, ma, 'Bình', phone=True)
        done_b = lam(bi, slots, key, lambda s: 'dung' if sum(map(ord, s['id'])) % 2 else None)
        bi.wait_for_selector('#hsSave:has-text("Đã lưu")', timeout=5000)
        bi.screenshot(path=f'{OUT}/hs_dienthoai.png')
        chi_ctx, chi, chi_err = hs_vao(b, S.base, ma, 'Chi')
        # tên đã vào ở máy khác
        x_ctx = b.new_context(); x = x_ctx.new_page(); x.goto(f'{S.base}/hs?ma={ma}'); x.wait_for_selector('.hsnames'); x.click('.hsnames >> text="Chi"'); x.wait_for_selector('#hsErr')
        ok('máy khác' in x.inner_text('#hsErr'), 'tên đã vào ở máy khác: báo')
        g.wait_for_timeout(300); g.screenshot(path=f'{OUT}/gv_theodoi.png')
        st = g.evaluate("() => [...document.querySelectorAll('#phBang tr[data-hs]')].map(r => [r.cells[0].textContent.replace(r.cells[0].querySelector('.av')?.textContent || '', ''), r.cells[1].textContent])")
        d = dict(st); ok(d.get('An', '').startswith('Đã nộp') and d.get('Bình', '').startswith('Đang làm') and d.get('Chi', '').startswith('Đang làm') and d.get('Dũng', '').startswith('Chưa vào'), f'trạng thái: {st[:4]}')
        # kết thúc
        g.once('dialog', lambda dl: dl.accept()); g.click('#phKetThuc'); g.wait_for_selector('#phCham')
        bi.wait_for_selector('.vbanner', timeout=5000); ok('kết thúc' in bi.inner_text('.vbanner'), 'Bình thấy phiên kết thúc')
        ok(bi.query_selector('#hsNop') is None, 'Bình không nộp được nữa')
        r = api(bi, '/api/hs/bai', 'PUT', {'answers': {}}); ok(r['s'] == 409, 'phiên đóng: không lưu được')
        st = dict(g.evaluate("() => [...document.querySelectorAll('#phBang tr[data-hs]')].map(r => [r.cells[0].textContent.replace(r.cells[0].querySelector('.av')?.textContent || '', ''), r.cells[1].textContent])"))
        ok('thu khi kết thúc' in st.get('Bình', ''), 'Bình được thu bài: ' + st.get('Bình', ''))
        g.screenshot(path=f'{OUT}/gv_ketthuc.png')
        for e in (an_err, bi_err, chi_err): errs.extend(e)
        b.close()
finally:
    out = S.stop()
errs = [e for e in errs if '409 (Conflict)' not in e]   # 409: các lần thử cố ý (tên đã vào máy khác, lưu sau khi phiên đóng)
ok(not errs, f'lỗi console: {errs[:5]}')
print(f'{n - len(fails)}/{n} đạt')
print('ALL OK' if not fails else 'SOME FAIL')
