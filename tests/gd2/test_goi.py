# GĐ2 (v118): nghiệm thu gói .wsp trên 24 phiếu chuẩn (tests/chuan).
#   1. Xuất gói từ app (nút "Gói .wsp") cho từng phiếu: không bị chặn, tải về được.
#   2. Công cụ `node shared/bin/wsp.ts inspect` mở gói bằng khóa "ed": ĐẠT. Sửa 1 byte: TỪ CHỐI.
#   3. Trang trong gói hiển thị một mình (chỉ style.css + trang + media + phông của gói) giống hệt ảnh chuẩn v117.
#   4. Phần học sinh (studentView) không có key.json / source.json; chỗ trả lời trên trang không chứa sẵn đáp án.
#   5. Mở lại gói trong app (Mở gói .wsp…) ra đúng phiếu gốc (JSON như trước khi xuất).
# Cách dùng: python3 tests/gd2/test_goi.py [ws-editor.html]   (tự chạy máy chủ tĩnh để app tải được phông)
import sys, os, json, glob, subprocess, shutil, io, threading, functools, http.server, socketserver
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops

HERE = os.path.dirname(os.path.abspath(__file__)); TESTS = os.path.dirname(HERE); ROOT = os.path.dirname(TESTS)
APP = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'ws-editor.html'))
OUT = '/tmp/claude-0/gd2'; shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT)
CHUAN = os.path.join(TESTS, 'chuan', 'v117')
sys.path.insert(0, os.path.join(TESTS, 'chuan'))

srcs = [('demo', None)]
for f in sorted(glob.glob(os.path.join(ROOT, 'samples', '*.json')) + glob.glob(os.path.join(TESTS, '*.json'))
                + glob.glob(os.path.join(TESTS, 'md', '*.md')) + glob.glob(os.path.join(TESTS, 'real', '*.md'))):
    srcs.append((os.path.relpath(f, ROOT), open(f, encoding='utf-8').read()))
safe = lambda n: n.replace('/', '__')

LOAD = """raw => { window.confirm = () => true;
  if (raw == null) { loadSheet(clone(SAMPLE2)); }
  else { const J = looksJson(raw) ? readJson(raw) : readMd(raw); if (J.err) return 'ERR ' + J.err;
    if (!loadSheet(impSheetObj(J))) return 'ERR nạp không được'; }
  return JSON.stringify(ws); }"""

class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=os.path.dirname(APP)))
threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = f'http://127.0.0.1:{srv.server_address[1]}/{os.path.basename(APP)}'

fails = []; checks = 0
def ok(c, m):
    global checks; checks += 1
    if not c: fails.append(m); print('  FAIL', m)

def px_diff(a, b):
    A, B = Image.open(io.BytesIO(a)).convert('RGB'), Image.open(b).convert('RGB')
    if A.size != B.size: return 1.0, f'kích thước {A.size} ≠ {B.size}'
    d = ImageChops.difference(A, B).convert('L').point(lambda v: 255 if v > 48 else 0)
    n = sum(d.histogram()[255:]); return n / (A.size[0] * A.size[1]), f'{n} điểm ảnh lệch'

def node(*a):
    r = subprocess.run(['node', os.path.join(ROOT, 'shared', 'bin', 'wsp.ts'), *a], capture_output=True, text=True, cwd=ROOT)
    return r.returncode, r.stdout + r.stderr

errs = []
with sync_playwright() as p:
    b = p.chromium.launch(); ctx = b.new_context(viewport={'width': 1440, 'height': 1300}, accept_downloads=True); pg = ctx.new_page()
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append('console: ' + m.text) if m.type == 'error' else None)
    pg.on('response', lambda r: errs.append(f'HTTP {r.status} {r.url[:120]}') if r.status >= 400 else None)
    pg.goto(URL); pg.wait_for_timeout(1500); pg.evaluate("() => { zoom = 1; }")
    orig = {}
    # 1. xuất
    for name, raw in srcs:
        j = pg.evaluate(LOAD, raw); pg.evaluate("() => document.fonts.ready"); pg.wait_for_timeout(200)
        ok(not j.startswith('ERR'), f'{name}: nạp'); orig[name] = j
        pg.click('#wspBtn'); pg.wait_for_selector('#wspSum, #wspBlock'); pg.wait_for_function("() => !document.getElementById('wspBusy')")
        blk = pg.query_selector('#wspBlock')
        tran = pg.evaluate("() => /\\d+ lỗi tràn/.test(document.getElementById('diagBadge').textContent)")
        if tran:   # mục 9: trang tràn → chặn xuất
            ok(blk is not None and 'tràn trang' in blk.inner_text() and pg.is_disabled('#wspGo'), f'{name}: có trang tràn phải bị chặn')
            pg.click('#wspClose'); print('chặn', name, '(có trang tràn)'); continue
        ok(blk is None, f'{name}: bị chặn xuất: {blk.inner_text() if blk else ""}')
        if blk: pg.click('#wspClose'); continue
        if pg.query_selector('#wspSeen'): pg.check('#wspSeen')
        with pg.expect_download() as dl: pg.click('#wspGo')
        f = os.path.join(OUT, safe(name) + '.wsp'); dl.value.save_as(f)
        pg.wait_for_selector('#wspMsg'); msg = pg.inner_text('#wspMsg')
        ok('Đã xuất' in msg, f'{name}: {msg}')
        if name == 'demo': ok('dev-local-' in msg, f'demo: thông báo xuất {msg}')
        nfont = pg.evaluate("() => Object.keys(window.__wspLast.manifest.files).filter(f => f.startsWith('fonts/')).length")
        ok(nfont >= 6, f'{name}: gói có phông ({nfont} file)')
        pg.click('#wspClose')
        print('xuất', name, os.path.getsize(f) // 1024, 'KB')
    # xuất lại phiếu demo không sửa → cùng phiên bản; sửa → phiên bản 2
    pg.evaluate(LOAD, None); pg.click('#wspBtn'); pg.wait_for_selector('#wspSum'); pg.wait_for_function("() => !document.getElementById('wspBusy')")
    if pg.query_selector('#wspSeen'): pg.check('#wspSeen')
    with pg.expect_download(): pg.click('#wspGo')
    import re
    v0 = int(re.search(r'phiên bản (\d+)', pg.inner_text('#wspMsg')).group(1)); pg.click('#wspClose')
    pg.click('#wspBtn'); pg.wait_for_selector('#wspSum'); pg.wait_for_function("() => !document.getElementById('wspBusy')")
    if pg.query_selector('#wspSeen'): pg.check('#wspSeen')
    with pg.expect_download(): pg.click('#wspGo')
    ok(f'phiên bản {v0} ' in pg.inner_text('#wspMsg'), f'xuất lại không sửa: vẫn phiên bản {v0} · ' + pg.inner_text('#wspMsg')); pg.click('#wspClose')
    pg.evaluate("() => { commit(w => { w.title = w.title + ' (sửa)'; }, 'x'); }"); pg.wait_for_timeout(200)
    pg.click('#wspBtn'); pg.wait_for_selector('#wspSum'); pg.wait_for_function("() => !document.getElementById('wspBusy')")
    if pg.query_selector('#wspSeen'): pg.check('#wspSeen')
    with pg.expect_download(): pg.click('#wspGo')
    ok(f'phiên bản {v0 + 1} ' in pg.inner_text('#wspMsg'), f'sửa rồi xuất: phiên bản {v0 + 1} · ' + pg.inner_text('#wspMsg')); pg.click('#wspClose')
    # khóa thử trên máy → file cho công cụ dòng lệnh
    ks = pg.evaluate("() => ({ s: JSON.parse(localStorage.getItem('wsp.devSign.v1')), e: JSON.parse(localStorage.getItem('wsp.edBox.v1')) })")
    json.dump({ks['s']['kid']: ks['s']['publicKey']}, open(f'{OUT}/trust.json', 'w')); json.dump(ks['e']['privateKey'], open(f'{OUT}/ed.json', 'w'))

    # 2. inspect + sửa 1 byte + giải nén
    for name, _ in srcs:
        f = os.path.join(OUT, safe(name) + '.wsp')
        if not os.path.exists(f): continue
        c, o = node('inspect', f, '--trust', f'{OUT}/trust.json', '--key', f'{OUT}/ed.json', '--who', 'ed')
        ok(c == 0 and 'ĐẠT' in o, f'{name}: inspect {o[-400:]}')
        data = bytearray(open(f, 'rb').read())
        for at in (len(data) // 3, len(data) - 30):
            bad = bytearray(data); bad[at] ^= 1; bf = f + '.bad'; open(bf, 'wb').write(bad)
            c2, o2 = node('inspect', bf, '--trust', f'{OUT}/trust.json', '--key', f'{OUT}/ed.json', '--who', 'ed')
            ok(c2 != 0 and 'TỪ CHỐI' in o2, f'{name}: sửa byte {at} phải bị từ chối')
        c3, o3 = node('extract', f, os.path.join(OUT, safe(name)), '--trust', f'{OUT}/trust.json', '--key', f'{OUT}/ed.json', '--who', 'ed')
        ok(c3 == 0, f'{name}: giải nén {o3[-200:]}')
    c, o = node('inspect', os.path.join(OUT, 'demo.wsp'), '--trust', f'{OUT}/trust.json')
    ok(c == 0 and 'chỉ kiểm chữ ký' in o, 'inspect không khóa riêng: chỉ kiểm chữ ký')
    c, o = node('inspect', os.path.join(OUT, 'demo.wsp'), '--trust', os.path.join(OUT, 'ed.json'))
    ok(c != 0, 'khóa ký lạ → từ chối')

    # 3 + 4. hiển thị một mình, so ảnh chuẩn; không lộ đáp án
    sp = ctx.new_page(); sp.set_viewport_size({'width': 1440, 'height': 1300})
    sp.on('pageerror', lambda e: errs.append('gói: ' + str(e)))
    sp.on('console', lambda m: errs.append('gói console: ' + m.text) if m.type == 'error' else None)
    for name, _ in srcs:
        d = os.path.join(OUT, safe(name))
        if not os.path.isdir(d): continue
        m = json.load(open(os.path.join(d, 'manifest.json'), encoding='utf-8'))
        css = open(os.path.join(d, 'pages', 'style.css'), encoding='utf-8').read()
        body = ''.join(open(os.path.join(d, pp['file']), encoding='utf-8').read() for pp in m['pages'])
        open(os.path.join(d, 'xem.html'), 'w', encoding='utf-8').write(('' if m.get('docMode') == 'quirks' else '<!doctype html>') + f'<meta charset="utf-8"><style>body{{margin:0;background:#fff}}{css}</style><body>{body}</body>')
        sp.goto('file://' + os.path.join(d, 'xem.html')); sp.evaluate("() => document.fonts.ready"); sp.wait_for_timeout(250)
        net = sp.evaluate("() => performance.getEntriesByType('resource').map(r => r.name).filter(u => !u.startsWith('file:') && !u.startsWith('data:'))")
        ok(not net, f'{name}: trang gói tải ngoài {net[:3]}')
        n = sp.evaluate("() => document.querySelectorAll('.wsp-pg').length")
        olds = sorted(glob.glob(os.path.join(CHUAN, safe(name), 'trang*.png')), key=lambda x: int(x.rsplit('trang', 1)[1][:-4]))
        ok(n == len(olds), f'{name}: số trang {n} ≠ chuẩn {len(olds)}')
        ok(m.get('docMode') == 'quirks', f'{name}: docMode')
        for i in range(min(n, len(olds))):
            # mỗi lần hiện một trang ở đỉnh (như chuan.py), tránh lệch nửa điểm ảnh khi trang nằm dưới
            bb = sp.evaluate("i => { const a = [...document.querySelectorAll('.wsp-pg')]; a.forEach((e, k) => e.style.display = k === i ? '' : 'none'); const r = a[i].getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; }", i)
            png = sp.screenshot(clip=bb, animations='disabled')
            r, why = px_diff(png, olds[i])
            ok(r <= 0.0005, f'{name}: trang {i + 1} khác ảnh chuẩn {r * 100:.3f}% ({why})')
            if r > 0.0005: open(os.path.join(OUT, safe(name) + f'_t{i + 1}.png'), 'wb').write(png)
        slots = json.load(open(os.path.join(d, 'slots.json'), encoding='utf-8')); key = json.load(open(os.path.join(d, 'key.json'), encoding='utf-8'))
        leak = sp.evaluate("""([slots, key]) => { const out = [], N = s => String(s).toLowerCase().replace(/\\s+/g, ' ').trim();
          for (const s of slots) { const k = key[s.id]; if (!k || !k.accept || !['text', 'cell', 'text-long'].includes(s.interaction)) continue;
            document.querySelectorAll(`[data-ans="${CSS.escape(s.id)}"]`).forEach(e => { const t = N(e.textContent); if (t && k.accept.some(a => N(a) === t)) out.push(s.id + '=' + t); }); }
          return out; }""", [slots, key])
        ok(not leak, f'{name}: chỗ trả lời có sẵn đáp án {leak[:4]}')
    # studentView
    c = subprocess.run(['node', '-e', """
      import('./shared/src/index.ts').then(async W => { const fs = await import('node:fs');
        const { zip, unzip } = W; let bad = 0;
        for (const f of fs.readdirSync(process.argv[1]).filter(f => f.endsWith('.wsp'))) {
          const r = await W.inspectWsp(fs.readFileSync(process.argv[1] + '/' + f), { trust: JSON.parse(fs.readFileSync(process.argv[1] + '/trust.json')), who: 'ed', privateKey: JSON.parse(fs.readFileSync(process.argv[1] + '/ed.json')) });
          const v = W.studentView(r.files); if ('key.json' in v || 'source.json' in v || !('slots.json' in v)) bad++;
          const sl = new TextDecoder().decode(v['slots.json']); if (/"(accept|correct|sample|explain)"/.test(sl)) bad++; }
        console.log(bad ? 'BAD ' + bad : 'SV OK'); });""", OUT], capture_output=True, text=True, cwd=ROOT)
    ok('SV OK' in c.stdout, 'phần học sinh không có đáp án: ' + c.stdout + c.stderr[-300:])

    # 5. mở lại gói trong app
    for name, _ in srcs:
        f = os.path.join(OUT, safe(name) + '.wsp')
        if not os.path.exists(f): continue
        pg.evaluate("() => loadSheet(clone(SAMPLE))"); pg.wait_for_timeout(100)
        pg.click('#wspBtn'); pg.wait_for_selector('#wspSum'); pg.wait_for_function("() => !document.getElementById('wspBusy')")
        pg.set_input_files('#wspFile', f); pg.wait_for_selector('#cfmDlg[open]'); pg.click('#cfmYes')
        pg.wait_for_function("() => !document.getElementById('wspDlg').open"); pg.wait_for_timeout(150)
        ok(pg.evaluate("() => JSON.stringify(ws)") == orig[name], f'{name}: mở lại gói ra đúng phiếu gốc')
    # gói hỏng → báo lỗi, phiếu đang mở giữ nguyên
    before = pg.evaluate("() => JSON.stringify(ws)")
    pg.click('#wspBtn'); pg.wait_for_selector('#wspSum'); pg.wait_for_function("() => !document.getElementById('wspBusy')")
    pg.set_input_files('#wspFile', os.path.join(OUT, 'demo.wsp.bad')); pg.wait_for_selector('#wspMsg')
    ok('Không mở được' in pg.inner_text('#wspMsg'), 'gói hỏng: báo không mở được')
    pg.click('#wspClose')
    ok(pg.evaluate("() => JSON.stringify(ws)") == before, 'gói hỏng: phiếu đang mở giữ nguyên')
    pg.click('#wspBtn'); pg.wait_for_selector('#wspSum'); pg.wait_for_function("() => !document.getElementById('wspBusy')")
    pg.screenshot(path=os.path.join(OUT, 'hop_thoai.png')); pg.click('#wspClose')
    b.close()
srv.shutdown()
ok(not errs, f'lỗi console: {errs[:5]}')
print(f'{checks - len(fails)}/{checks} đạt')
print('ALL OK' if not fails else 'SOME FAIL')
