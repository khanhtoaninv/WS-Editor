# v81: phiếu cũ phải mở ra giống v80. So HTML các trang (và số trang) giữa bản mới và bản v80
# trên mọi phiếu có trong repo: demo cài sẵn, samples/*.json, tests/*.json, tests/md/*.md, tests/real/*.md.
# Cách dùng: python3 cmp_v80.py <bản mới.html> <bản v80.html>
import sys, os, glob, re
from playwright.sync_api import sync_playwright
NEW, OLD = sys.argv[1], sys.argv[2]
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
srcs = [('demo', None)]
for f in sorted(glob.glob(os.path.join(ROOT, 'samples', '*.json')) + glob.glob(os.path.join(HERE, '*.json'))): srcs.append((os.path.relpath(f, ROOT), open(f, encoding='utf-8').read()))
for f in sorted(glob.glob(os.path.join(HERE, 'md', '*.md')) + glob.glob(os.path.join(HERE, 'real', '*.md'))): srcs.append((os.path.relpath(f, ROOT), open(f, encoding='utf-8').read()))
LOAD = """raw => { if (raw == null) { loadSheet(clone(SAMPLE2)); } else { const J = looksJson(raw) ? readJson(raw) : readMd(raw); if (J.err) return 'ERR ' + J.err;
  const obj = J.kind === 'sheet' ? J.sheet : { tasks: J.tasks.filter(x => x.t).map(x => x.t) }; loadSheet(obj); }
  // v84 đổi mặc định (cỡ chữ Vừa, hàng bảng 12 mm, nhãn chữ thường): đặt cả hai bản về thông số cũ rồi mới so
  if (!ws.size) ws.size = 'l';
  ws.tasks.forEach(t => { if (t.content.form === 'table') { t.layout.table = Object.assign({}, t.layout.table); if (t.layout.table.minH == null) t.layout.table.minH = 14; }
    if (t.answer && t.answer.layout === 'A4') { t.answer.params = t.answer.params || {}; t.answer.params.upper = true; } });
  render();
  return [document.getElementById('pageBadge').textContent, [...document.querySelectorAll('#stage .page')].map(p => p.outerHTML).join('\\n')]; }"""
ok = True
def grab(path):
    out = {}
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 900}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto('file://' + path); pg.wait_for_timeout(1500)
        pg.evaluate("window.confirm = () => true")
        for name, raw in srcs:
            r = pg.evaluate(LOAD, raw); pg.wait_for_timeout(250)
            r = pg.evaluate(LOAD, raw) if not isinstance(r, str) else r
            out[name] = r
        b.close()
    return out, errs
a, ea = grab(NEW); b, eb = grab(OLD)
norm = lambda h: re.sub(r'\s+', ' ', h).replace(';--gn:1"', '"')
for name, _ in srcs:
    x, y = a[name], b[name]
    if isinstance(x, str) or isinstance(y, str):
        same = x == y; print(('PASS ' if same else 'FAIL ') + name, 'lỗi nạp', x if isinstance(x, str) else '', y if isinstance(y, str) else ''); ok = ok and same; continue
    same = x[0] == y[0] and norm(x[1]) == norm(y[1])
    if not same:
        h1, h2 = norm(x[1]), norm(y[1]); i = next((k for k in range(min(len(h1), len(h2))) if h1[k] != h2[k]), min(len(h1), len(h2)))
        print('FAIL', name, x[0], '/', y[0], '| mới:', h1[max(0, i - 80):i + 120], '\n      v80:', h2[max(0, i - 80):i + 120])
    else: print('PASS', name, x[0])
    ok = ok and same
print('ERRS', ea, eb)
print('ALL OK' if ok and not ea else 'SOME FAIL')
