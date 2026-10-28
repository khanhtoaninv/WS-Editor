# Hàm dùng chung cho test sau kiểm thử: nạp phiếu kiểm thử tay 32 Task (tests/gd0/phieu-kiem-thu-tay.md), mở trình chiếu.
import sys, os
APP = os.path.abspath(sys.argv[1]); SHOT = os.path.abspath(sys.argv[2] if len(sys.argv) > 2 else '/tmp/sau_kiem_thu_shots')
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.makedirs(SHOT, exist_ok=True)
res = []; errs = []
def chk(name, ok, info=''):
    res.append(bool(ok)); print(('PASS ' if ok else 'FAIL ') + name + ('' if ok else '  ' + str(info)[:400]))
S = lambda i: f"#wsShow .vsurf [data-ans='{i}']"
def key(pg, k, n=1):
    for _ in range(n): pg.keyboard.press(k); pg.wait_for_timeout(50)
def st(pg, i):
    return pg.evaluate("""id => { const els = [...document.querySelectorAll(`#wsShow .vsurf [data-ans='${id}']`)];
      const all = els.flatMap(e => [e, ...e.querySelectorAll('*')]);
      for (const c of ['vw-ok', 'vw-no', 'vw-part', 'vw-man', 'vw-sel']) if (all.some(e => e.classList.contains(c))) return c.slice(3);
      const svg = els[0] && els[0].closest('section') && [...els[0].closest('section').querySelectorAll('svg.vwl')].find(s => s.dataset.vw === id);
      return svg ? [...svg.classList].find(c => c !== 'vwl') : ''; }""", i)
def typ(pg, i, text, enter=True):
    pg.click(S(i)); pg.wait_for_timeout(40); pg.keyboard.type(text)
    if enter: pg.keyboard.press('Enter')
    pg.wait_for_timeout(60)
def tb(pg, sel):
    pg.mouse.move(960, 520); pg.mouse.move(962, 522); pg.wait_for_timeout(40); pg.click(sel); pg.wait_for_timeout(60)
def reset_all(pg):
    if pg.is_enabled('#workReset'): tb(pg, '#workReset')
def task(pg, n):
    pg.select_option('#wsShow .vsel', str(n - 1)); pg.wait_for_timeout(120)
def dot(pg, t, opt):   # chấm phải của hàng vế phải có mã opt
    return pg.evaluate_handle(f"() => document.querySelector(\"#wsShow section[data-task='{t}'] .mr[data-opt='{opt}']\").previousElementSibling.querySelector('.a7:not([data-ans])')").as_element()
def opt(pg, i, j):
    n = pg.evaluate(f"() => document.querySelectorAll(\"{S(i)}\").length")
    h = pg.query_selector_all(S(i))[j - 1] if n > 1 else pg.evaluate_handle(f"""() => {{ const e = document.querySelector("{S(i)}"); const k = e.querySelectorAll(':scope > .opt').length ? e.querySelectorAll(':scope > .opt') : e.querySelectorAll(':scope > b').length ? e.querySelectorAll(':scope > b') : e.querySelectorAll(':scope > span'); return k[{j - 1}]; }}""").as_element()
    h.click(); pg.wait_for_timeout(60)
def mo(p, app, md='tests/gd0/phieu-kiem-thu-tay.md', w=1920, h=1080):
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': w, 'height': h})
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.goto('file://' + os.path.abspath(app)); pg.wait_for_function('() => typeof loadSheet === "function"'); pg.evaluate('() => document.fonts.ready')
    pg.evaluate("raw => { window.confirm = () => true; loadSheet(impSheetObj(readMd(raw))); }", open(os.path.join(ROOT, md), encoding='utf-8').read())
    pg.wait_for_timeout(300); pg.click('#showBtn'); pg.wait_for_selector('#wsShow'); pg.wait_for_timeout(200)
    return pg, b
def xong(b):
    b.close()
    chk('0 lỗi console', not errs, errs)
    print('ERRS', errs)
    print(f'{sum(res)}/{len(res)} PASS' if all(res) else f'SOME FAIL {res.count(False)}/{len(res)}')
