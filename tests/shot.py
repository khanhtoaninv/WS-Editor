import sys, json
from playwright.sync_api import sync_playwright
path, out = sys.argv[1], sys.argv[2]
steps = sys.argv[3] if len(sys.argv)>3 else ''
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width':1440,'height':900})
    errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    pg.goto('file://'+path); pg.wait_for_timeout(1500)
    if steps: exec(steps)
    pg.screenshot(path=out)
    print('ERRS', [e for e in errs if 'fonts' not in e and 'ERR_' not in e and 'Failed to load resource' not in e])
    b.close()
