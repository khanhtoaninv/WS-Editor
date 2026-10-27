# GĐ0 phiếu tương tác (docs/TUONG_TAC/KE_HOACH_GD0.md): chạy bộ liệt kê chỗ trả lời trên 24 phiếu của đường chuẩn
# và các phiếu mẫu có đáp án ở tests/gd0/*.md.
# Mỗi phiếu: sheetSlots(ws) → <thư mục ra>/<tên>.json { title, tasks:[{id, number, q, title}], slots, key, warn, dom }
#   dom = các data-ans thấy trên trang (B4): { id: số phần tử } — để kiểm khớp 1–1 với slots.
# Cách dùng: python3 tests/gd0/slots_phieu.py <app.html> <thư mục ra>
# Chạy một Chromium, không chạy song song với test khác. Kiểm bằng: node tests/gd0/kiem_slots.mjs <thư mục ra>
import sys, os, glob, json
from playwright.sync_api import sync_playwright

APP, OUT = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2])
HERE = os.path.dirname(os.path.abspath(__file__)); TESTS = os.path.dirname(HERE); ROOT = os.path.dirname(TESTS)
srcs = [('demo', None)]
files = sorted(glob.glob(os.path.join(ROOT, 'samples', '*.json')) + glob.glob(os.path.join(TESTS, '*.json'))
               + glob.glob(os.path.join(TESTS, 'md', '*.md')) + glob.glob(os.path.join(TESTS, 'real', '*.md'))
               + glob.glob(os.path.join(HERE, '*.md')))
for f in files: srcs.append((os.path.relpath(f, ROOT), open(f, encoding='utf-8').read()))

LOAD = """raw => { window.confirm = () => true;
  if (raw == null) loadSheet(clone(SAMPLE2));
  else { const J = looksJson(raw) ? readJson(raw) : readMd(raw); if (J.err) return 'ERR ' + J.err; if (!loadSheet(impSheetObj(J))) return 'ERR nạp'; }
  return 'ok'; }"""
GRAB = """() => { const r = sheetSlots(ws), dom = {};
  document.querySelectorAll('#stage [data-ans]').forEach(e => { const k = e.dataset.ans; dom[k] = (dom[k] || 0) + 1; });
  return { title: ws.title, tasks: ws.tasks.map(t => ({ id: t.id, number: t.number, q: qDerived(t) || t.q || null, title: t.title })),
    slots: r.slots, key: r.key, warn: r.warn, dom }; }"""

os.makedirs(OUT, exist_ok=True)
errs = []
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1500, 'height': 1000})
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.goto('file://' + APP); pg.wait_for_function('() => typeof sheetSlots === "function" && typeof loadSheet === "function"')
    pg.evaluate("() => document.fonts.ready"); pg.wait_for_timeout(300)
    for name, raw in srcs:
        r = pg.evaluate(LOAD, raw)
        if r != 'ok': print('FAIL', name, r); continue
        pg.wait_for_timeout(150)
        d = pg.evaluate(GRAB); d['src'] = name
        fn = name.replace('/', '__').replace('.', '_') + '.json'
        json.dump(d, open(os.path.join(OUT, fn), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        print('PASS', name, len(d['slots']), 'chỗ,', len(d['warn']), 'cảnh báo')
    b.close()
print('ERRS', errs[:5])
print('ALL OK' if not errs else 'SOME FAIL')
