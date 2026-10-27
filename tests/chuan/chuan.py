# Đường chuẩn cho việc chuyển sang React (docs/KE_HOACH_REACT.md, bước 1).
# Không so chuỗi HTML (React sinh HTML khác dù nhìn giống hệt) mà so 4 lớp:
#   1. dữ liệu sau khi nạp (JSON của ws)      2. MD xuất ra (sheetToMd)
#   3. hình học dàn trang: mỗi trang, mỗi phần tử có class/ảnh: vị trí + kích thước (px ở 100%, làm tròn 0,5) + chữ trực tiếp
#   4. ảnh chụp từng trang (biến thể gốc), cho phép lệch rất ít điểm ảnh do khử răng cưa
# Mỗi phiếu chạy thêm 4 biến thể: đổi kiểu xếp trang, khoảng cách Thoáng, cỡ chữ Nhỏ, font Lexend.
# Cách dùng:
#   python3 tests/chuan/chuan.py tao <app.html> [thư mục, mặc định tests/chuan/v108]
#   python3 tests/chuan/chuan.py so  <app.html> [thư mục]
# Chạy một Chromium, không chạy song song với test khác.
import sys, os, glob, json, io
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops

MODE, APP = sys.argv[1], os.path.abspath(sys.argv[2])
HERE = os.path.dirname(os.path.abspath(__file__)); TESTS = os.path.dirname(HERE); ROOT = os.path.dirname(TESTS)
OUT = os.path.abspath(sys.argv[3]) if len(sys.argv) > 3 else os.path.join(HERE, 'v108')
URL = APP if APP.startswith('http') else 'file://' + APP

srcs = [('demo', None)]
files = sorted(glob.glob(os.path.join(ROOT, 'samples', '*.json')) + glob.glob(os.path.join(TESTS, '*.json'))
               + glob.glob(os.path.join(TESTS, 'md', '*.md')) + glob.glob(os.path.join(TESTS, 'real', '*.md')))
for f in files: srcs.append((os.path.relpath(f, ROOT), open(f, encoding='utf-8').read()))

VARIANTS = {
    'goc': '',
    'xep': "ws.flow = ws.flow === 'page' ? 'cont' : 'page';",
    'thoang': "ws.spacing = { preset: 'airy', overrides: {} };",
    'nho': "ws.size = 's';",
    'lexend': "ws.font = 'lexend';",
}

LOAD = """raw => { window.confirm = () => true;
  if (raw == null) { loadSheet(clone(SAMPLE2)); }
  else { const J = looksJson(raw) ? readJson(raw) : readMd(raw); if (J.err) return 'ERR ' + J.err;
    // như nút "+ Phiếu" (impSheetObj): MD có dòng tên/tuổi… cho kind 'sheet' nhưng sheet = null
    if (!loadSheet(impSheetObj(J))) return 'ERR nạp không được'; }
  const d = clone(ws); d.id = '(id)';   // id tự sinh theo giờ khi phiếu không có id
  return [JSON.stringify(d, null, 1), sheetToMd(ws)]; }"""

GRAB = """() => {
  const r2 = v => Math.round(v * 2) / 2;
  const pages = [...document.querySelectorAll('#stage .page')];
  const out = { badge: document.getElementById('pageBadge').textContent, diag: document.getElementById('diagBadge').textContent, pages: [] };
  pages.forEach(pg => {
    const pr = pg.getBoundingClientRect(); const k = pg.offsetWidth / pr.width;
    const items = [];
    pg.querySelectorAll('*').forEach(e => {
      const cls = typeof e.className === 'string' ? e.className.trim().split(/\\s+/).filter(Boolean).sort().join('.') : '';
      if (!cls && e.tagName !== 'IMG' && e.tagName !== 'svg') return;
      const r = e.getBoundingClientRect();
      const txt = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').replace(/\\s+/g, ' ').trim();
      items.push([e.tagName.toLowerCase() + (cls ? '.' + cls : ''), r2((r.left - pr.left) * k), r2((r.top - pr.top) * k), r2(r.width * k), r2(r.height * k), txt]);
    });
    out.pages.push(items);
  });
  return out; }"""

def settle(pg):
    pg.evaluate("() => document.fonts.ready"); pg.wait_for_timeout(250)
    pg.evaluate("() => { render(); return document.fonts.ready; }"); pg.wait_for_timeout(150)

# Chụp từng trang: chép trang ra một hộp cố định trên cùng (không bị thanh công cụ / thông báo che, không phụ thuộc cuộn)
def shots(pg):
    n = pg.evaluate("""() => { document.getElementById('toast').style.display = 'none';
      let b = document.getElementById('shotbox'); if (!b) { b = document.createElement('div'); b.id = 'shotbox'; b.className = 'paper';
        b.style.cssText = 'position:fixed;left:0;top:0;z-index:2147483647;background:#fff;padding:0;margin:0'; document.body.appendChild(b); }
      b.style.display = 'block'; return document.querySelectorAll('#stage .page').length; }""")
    out = []
    for i in range(n):
        pg.evaluate("i => { const b = document.getElementById('shotbox'); b.innerHTML = ''; const c = document.querySelectorAll('#stage .page')[i].cloneNode(true); c.style.transform = 'none'; c.style.margin = '0'; b.appendChild(c); }", i)
        bb = pg.evaluate("() => { const r = document.querySelector('#shotbox .page').getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; }")
        out.append(pg.screenshot(clip=bb, animations='disabled'))
    pg.evaluate("() => { const b = document.getElementById('shotbox'); b.innerHTML = ''; b.style.display = 'none'; }")
    return out

def safe(name): return name.replace('/', '__')

def run():
    res, errs = {}, []
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 1300})
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' else None)
        pg.goto(URL); pg.wait_for_timeout(1500)
        pg.evaluate("() => { zoom = 1; }")
        for name, raw in srcs:
            for vk, vjs in VARIANTS.items():
                r = pg.evaluate(LOAD, raw)
                if isinstance(r, str): res[(name, vk)] = {'err': r}; continue
                if vjs: pg.evaluate("() => { " + vjs + " render(); }")
                settle(pg)
                g = pg.evaluate(GRAB)
                item = {'data': r[0], 'md': r[1], 'geo': g}
                if vk == 'goc': item['png'] = shots(pg)
                res[(name, vk)] = item
        b.close()
    return res, errs

def save(res, errs):
    os.makedirs(OUT, exist_ok=True)
    for (name, vk), it in res.items():
        d = os.path.join(OUT, safe(name)); os.makedirs(d, exist_ok=True)
        if 'err' in it: open(os.path.join(d, vk + '.err'), 'w').write(it['err']); continue
        if vk == 'goc':
            open(os.path.join(d, 'data.json'), 'w', encoding='utf-8').write(it['data'])
            open(os.path.join(d, 'xuat.md'), 'w', encoding='utf-8').write(it['md'])
            for i, png in enumerate(it['png']): open(os.path.join(d, f'trang{i + 1}.png'), 'wb').write(png)
        json.dump(it['geo'], open(os.path.join(d, f'hinh_{vk}.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    print('Đã lưu', len(res), 'lần dàn trang vào', os.path.relpath(OUT, ROOT), '| lỗi console:', errs)

def px_diff(a, b):
    A, B = Image.open(io.BytesIO(a)).convert('RGB'), Image.open(b).convert('RGB')
    if A.size != B.size: return 1.0, f'kích thước {A.size} ≠ {B.size}'
    d = ImageChops.difference(A, B).convert('L').point(lambda v: 255 if v > 48 else 0)
    n = sum(d.histogram()[255:]); return n / (A.size[0] * A.size[1]), f'{n} điểm ảnh lệch'

def geo_diff(x, y):
    if x['badge'] != y['badge'] or x['diag'] != y['diag']: return f"{x['badge']} / {x['diag']}  ≠ chuẩn {y['badge']} / {y['diag']}"
    for i, (px, py) in enumerate(zip(x['pages'], y['pages'])):
        sx, sy = sorted(map(tuple, px)), sorted(map(tuple, py))
        if sx != sy:
            only_new = [e for e in sx if e not in sy][:3]; only_old = [e for e in sy if e not in sx][:3]
            return f'trang {i + 1}: mới có {only_new} | chuẩn có {only_old}'
    return None

def compare(res, errs):
    ok = True; nfail = 0
    for (name, vk), it in res.items():
        d = os.path.join(OUT, safe(name)); msgs = []
        ef = os.path.join(d, vk + '.err')
        if 'err' in it or os.path.exists(ef):
            same = os.path.exists(ef) and it.get('err') == open(ef).read()
            if not same: msgs.append(f"lỗi nạp khác chuẩn: {it.get('err')}")
        else:
            if vk == 'goc':
                if it['data'] != open(os.path.join(d, 'data.json'), encoding='utf-8').read(): msgs.append('dữ liệu sau nạp khác')
                if it['md'] != open(os.path.join(d, 'xuat.md'), encoding='utf-8').read(): msgs.append('MD xuất ra khác')
                olds = sorted(glob.glob(os.path.join(d, 'trang*.png')))
                if len(olds) != len(it['png']): msgs.append(f"số ảnh trang {len(it['png'])} ≠ {len(olds)}")
                for i, png in enumerate(it['png'][:len(olds)]):
                    r, why = px_diff(png, os.path.join(d, f'trang{i + 1}.png'))
                    if r > 0.0005: msgs.append(f'ảnh trang {i + 1} lệch {r * 100:.3f}% ({why})')
            g = geo_diff(it['geo'], json.load(open(os.path.join(d, f'hinh_{vk}.json'), encoding='utf-8')))
            if g: msgs.append('hình học: ' + g)
        if msgs: ok = False; nfail += 1; print('FAIL', name, vk, '|', ' ; '.join(msgs)[:600])
        else: print('PASS', name, vk)
    print('ERRS', errs)
    print(f'{len(res) - nfail}/{len(res)} khớp chuẩn')
    print('ALL OK' if ok and not errs else 'SOME FAIL')

res, errs = run()
(save if MODE == 'tao' else compare)(res, errs)
