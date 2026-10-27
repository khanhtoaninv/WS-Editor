# GĐ1a: mở trình chiếu trên mọi phiếu mẫu (24 phiếu đường chuẩn + phiếu GĐ0), bật đáp án, đi hết trang và hết Task:
# không lỗi console, mọi chỗ có đáp án đều hiện được ở Cả trang. Cách dùng: python3 tests/gd1a/quet_phieu.py <app.html>
import sys, os, glob
from playwright.sync_api import sync_playwright
APP = os.path.abspath(sys.argv[1]); ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
T = os.path.join(ROOT, 'tests')
files = sorted(glob.glob(os.path.join(ROOT, 'samples', '*.json')) + glob.glob(os.path.join(T, '*.json')) + glob.glob(os.path.join(T, 'md', '*.md'))
               + glob.glob(os.path.join(T, 'real', '*.md')) + glob.glob(os.path.join(T, 'gd0', '*.md')))
LOAD = """raw => { window.confirm = () => true; const J = looksJson(raw) ? readJson(raw) : readMd(raw); if (J.err) return 'ERR ' + J.err; return loadSheet(impSheetObj(J)) ? 'ok' : 'ERR nạp'; }"""
SHOWN = """() => { const ids = new Set(); document.querySelectorAll('#wsShow .vsurf [data-ans]').forEach(e => { if (e.querySelector('.vans') || e.classList.contains('vok') || e.querySelector('.vok') || e.closest('section').querySelector('svg.vline')) ids.add(e.dataset.ans); }); return [...ids]; }"""
bad = 0; errs = []
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1600, 'height': 900})
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.goto('file://' + APP); pg.wait_for_function('() => typeof loadSheet === "function"')
    for f in files:
        name = os.path.relpath(f, ROOT); e0 = len(errs)
        r = pg.evaluate(LOAD, open(f, encoding='utf-8').read())
        if r != 'ok': print('FAIL', name, r); bad += 1; continue
        pg.wait_for_timeout(200)
        want = set(pg.evaluate("() => { const r = sheetSlots(ws); return r.slots.filter(s => { const k = r.key[s.id]; return k && (k.correct != null || (k.accept && k.accept.length) || k.sample); }).map(s => s.id); }"))
        pg.click('#showBtn'); pg.wait_for_selector('#wsShow'); pg.keyboard.press('a')
        nP = pg.evaluate("() => document.querySelectorAll('#stage .page').length"); got = set()
        for i in range(nP):
            got |= set(pg.evaluate(SHOWN)); pg.keyboard.press('PageDown'); pg.wait_for_timeout(40)
        pg.keyboard.press('t'); nT = pg.evaluate("() => new Set([...document.querySelectorAll('#stage section.task')].map(s => s.dataset.task)).size")
        for i in range(nT * 6):
            pg.keyboard.press('PageDown')
        pg.keyboard.press('Escape'); pg.keyboard.press('Escape'); pg.wait_for_timeout(50)
        miss = want - got; ok = not miss and len(errs) == e0 and pg.query_selector('#wsShow') is None
        if not ok: bad += 1
        print('PASS' if ok else 'FAIL', name, f'{len(got & want)}/{len(want)} đáp án hiện', '' if ok else (sorted(miss)[:8], errs[e0:][:3]))
    b.close()
print('ALL OK' if not bad else f'FAILED {bad}')
