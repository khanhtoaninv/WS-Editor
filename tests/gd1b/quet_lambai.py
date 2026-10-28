# GĐ1b: làm thử trên mọi phiếu mẫu (cùng danh sách với tests/gd1a/quet_phieu.py). Ở Từng Task, mỗi chỗ trả lời:
# chỗ có đáp án máy chấm → làm đúng bằng thao tác thật (gõ / bấm / nối) và phải hiện xanh; chỗ chưa có đáp án → làm thử được, không báo đúng sai.
# Không lỗi console. Cách dùng: python3 tests/gd1b/quet_lambai.py <app.html>
import sys, os, glob, re
from playwright.sync_api import sync_playwright
APP = os.path.abspath(sys.argv[1]); ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
T = os.path.join(ROOT, 'tests')
files = sorted(glob.glob(os.path.join(ROOT, 'samples', '*.json')) + glob.glob(os.path.join(T, '*.json')) + glob.glob(os.path.join(T, 'md', '*.md'))
               + glob.glob(os.path.join(T, 'real', '*.md')) + glob.glob(os.path.join(T, 'gd0', '*.md')) + glob.glob(os.path.join(T, 'gd1b', '*.md')))
LOAD = """raw => { window.confirm = () => true; const J = looksJson(raw) ? readJson(raw) : readMd(raw); if (J.err) return 'ERR ' + J.err; return loadSheet(impSheetObj(J)) ? 'ok' : 'ERR nạp'; }"""
ACT = 'text text-long cell choice-one choice-many tf match'.split()
# cách làm một chỗ trên trang đang xem: loại ô + các phần tử cần bấm (theo đúng quy tắc của work.ts / answers.ts)
PLAN = """([s, k]) => {
  const els = [...document.querySelectorAll(`#wsShow .vsurf [data-ans="${CSS.escape(s.id)}"]`)]; if (!els.length) return null;
  const norm = x => (x || '').replace(/\\s+/g, ' ').trim().toLowerCase();
  const inp = els[0].querySelector(':scope > .vwi');
  if (inp) {
    let v = k && k.accept && k.accept.length ? k.accept[0] : null;
    if (s.interaction === 'match') {   // ô nối viết chữ: chữ cái của hàng có phương án đúng
      const sec = els[0].closest('section'), rows = [...sec.querySelectorAll('.mrows > .mr:not(.mh)')].filter(m => m.textContent.trim());
      const lab = rows.map(m => ((m.textContent.match(/^\\s*([A-Za-z0-9]{1,2})[.)]\\s/) || [])[1] || '')), o = k && (s.options || []).find(x => x.id === k.correct);
      const i = o ? rows.findIndex(m => norm(m.textContent) === norm(o.text) || norm(m.textContent).endsWith(norm(o.text))) : -1;
      v = i < 0 ? null : (lab.some(Boolean) ? lab[i] : String.fromCharCode(97 + i));
    }
    return { kind: els[0].classList.contains('xc') || s.interaction === 'match' ? 'one' : 'type', v, multi: inp.tagName === 'TEXTAREA' && +(inp.dataset.ml || 1) > 1 };
  }
  if (['choice-one', 'choice-many', 'tf'].includes(s.interaction)) {
    let opts = els; if (els.length === 1) for (const q of [':scope > .opt', ':scope > b', ':scope > span:not(.vans)']) { const kk = els[0].querySelectorAll(q); if (kk.length) { opts = [...kk]; break; } }
    const want = k && k.correct != null ? [].concat(k.correct).map(id => (s.options || []).findIndex(o => o.id === id)) : [0];
    return { kind: 'pick', n: want.length, ok: want.every(j => j >= 0 && opts[j]) };
  }
  if (s.interaction === 'match') return { kind: 'link', v: k ? (s.options || []).find(x => x.id === k.correct)?.text ?? null : (s.options || [])[0]?.text ?? null };
  return null;
}"""
OPT = """([id, j, s]) => { const els = [...document.querySelectorAll(`#wsShow .vsurf [data-ans="${CSS.escape(id)}"]`)];
  let opts = els; if (els.length === 1) for (const q of [':scope > .opt', ':scope > b', ':scope > span:not(.vans)']) { const kk = els[0].querySelectorAll(q); if (kk.length) { opts = [...kk]; break; } }
  return opts[j]; }"""
ROW = """([id, txt, opt]) => { const norm = x => (x || '').replace(/\\s+/g, ' ').trim().toLowerCase(), sec = document.querySelector(`#wsShow .vsurf [data-ans="${CSS.escape(id)}"]`).closest('section');
  const rows = [...sec.querySelectorAll('.mrows > .mr:not(.mh)')]; if (opt) { const r = rows.find(m => m.dataset.opt === opt); if (r) return r; }   // v113: hàng vế phải mang mã phương án (vế phải có thể trùng chữ)
  return rows.find(m => norm(m.textContent) === norm(txt)) || rows.find(m => norm(m.textContent).endsWith(norm(txt))); }"""
ST = """id => { const els = [...document.querySelectorAll(`#wsShow .vsurf [data-ans="${CSS.escape(id)}"]`)], all = els.flatMap(e => [e, ...e.querySelectorAll('*')]);
  for (const c of ['vw-ok', 'vw-no', 'vw-part', 'vw-man', 'vw-sel']) if (all.some(e => e.classList.contains(c))) return c.slice(3);
  const svg = els[0] && [...els[0].closest('section').querySelectorAll('svg.vwl')].find(x => x.dataset.vw === id); return svg ? [...svg.classList].find(c => c !== 'vwl') : ''; }"""
bad = 0; errs = []; tot = {'auto': 0, 'ok': 0, 'free': 0}
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1600, 'height': 900})
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.goto('file://' + APP); pg.wait_for_function('() => typeof loadSheet === "function"')
    for f in files:
        name = os.path.relpath(f, ROOT); e0 = len(errs); probs = []
        r = pg.evaluate(LOAD, open(f, encoding='utf-8').read())
        if r != 'ok': print('FAIL', name, r); bad += 1; continue
        pg.wait_for_timeout(200)
        sk = pg.evaluate("() => { const r = sheetSlots(ws); return { slots: r.slots, key: r.key }; }")
        slots = [x for x in sk['slots'] if x['interaction'] in ACT]; key = sk['key']
        auto = lambda x: (x['id'] in key and (key[x['id']].get('grading') or x['grading']) == 'auto' and (key[x['id']].get('correct') is not None or key[x['id']].get('accept')))
        pg.click('#showBtn'); pg.wait_for_selector('#wsShow'); pg.keyboard.press('t'); pg.wait_for_timeout(100)
        nT = pg.evaluate("() => document.querySelectorAll('#wsShow .vsel option').length - 1"); seen = set(); n_ok = n_auto = n_free = 0
        for ti in range(nT):
            pg.select_option('#wsShow .vsel', str(ti)); pg.wait_for_timeout(60)
            here = set(pg.evaluate("() => [...document.querySelectorAll('#wsShow .vsurf [data-ans]')].map(e => e.dataset.ans)"))
            for s in slots:
                if s['id'] not in here or s['id'] in seen: continue
                seen.add(s['id']); k = key.get(s['id']) if auto(s) else None
                pl = pg.evaluate(PLAN, [s, k])
                if not pl: probs.append((s['id'], 'không làm được')); continue
                sel = f"#wsShow .vsurf [data-ans='{s['id']}']"
                if pl['kind'] in ('type', 'one'):
                    v = pl['v'] if k else 'x'
                    if v is None: probs.append((s['id'], 'không tìm được chữ cái nối')); continue
                    pg.click(sel); pg.keyboard.press('Control+A')
                    pg.keyboard.type(re.sub(r'\W', '', v)[:1] if pl['kind'] == 'one' else v); pg.keyboard.press('Escape')
                elif pl['kind'] == 'pick':
                    if not pl['ok']: probs.append((s['id'], 'không thấy phương án đúng trên trang')); continue
                    want = [ (s['options'] or []).index(next(o for o in s['options'] if o['id'] == c)) for c in ([k['correct']] if isinstance(k['correct'], str) else k['correct']) ] if k else [0]
                    for j in want: pg.evaluate_handle(OPT, [s['id'], j, s]).as_element().click()
                    if pg.query_selector(f"{sel} .vwgo"): pg.click(f"{sel} .vwgo")
                else:
                    if pl['v'] is None: probs.append((s['id'], 'bài nối không có vế phải')); continue
                    pg.click(sel); row = pg.evaluate_handle(ROW, [s['id'], pl['v'], k['correct'] if k and isinstance(k.get('correct'), str) else None]).as_element()
                    if not row: probs.append((s['id'], 'không thấy vế phải')); pg.keyboard.press('Escape'); continue
                    row.click()
                pg.wait_for_timeout(30); got = pg.evaluate(ST, s['id'])
                if k:
                    n_auto += 1
                    if got == 'ok': n_ok += 1
                    else: probs.append((s['id'], f'làm đúng mà hiện "{got}"'))
                else:
                    n_free += 1
                    if got in ('ok', 'no', 'part'): probs.append((s['id'], f'chưa có đáp án mà báo "{got}"'))
        miss = [x['id'] for x in slots if x['id'] not in seen]
        if miss: probs.append(('không thấy trên trang', miss[:6]))
        pg.keyboard.press('Escape'); pg.keyboard.press('Escape'); pg.keyboard.press('Escape'); pg.wait_for_timeout(50)
        ok = not probs and len(errs) == e0 and pg.query_selector('#wsShow') is None
        if not ok: bad += 1
        tot['auto'] += n_auto; tot['ok'] += n_ok; tot['free'] += n_free
        print('PASS' if ok else 'FAIL', name, f'máy chấm {n_ok}/{n_auto} đúng, làm thử {n_free} chỗ chưa có đáp án', '' if ok else (probs[:6], errs[e0:][:3]))
    b.close()
print(f"Tổng: máy chấm {tot['ok']}/{tot['auto']}, chỗ chưa có đáp án làm thử {tot['free']}")
print('ALL OK' if not bad else f'FAILED {bad}')
