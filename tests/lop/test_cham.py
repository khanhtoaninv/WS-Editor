# v120 Lớp học thử: chấm chữa từng học sinh.
# 12 em (tên giả): 8 em vào làm qua API (đúng / sai có chủ đích), 7 em nộp, 1 em bị thu khi kết thúc, 4 em không vào.
# Cách dùng: python3 tests/lop/test_cham.py   (ảnh chụp ở /tmp/claude-0/lop/)
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from chung import Server, gv_login, gui_goi, mo_phien, api
from playwright.sync_api import sync_playwright

OUT = '/tmp/claude-0/lop'; os.makedirs(OUT, exist_ok=True)
SHEET = 'tests/gd0/mau-du-dang.md'
fails, n = [], 0
def ok(c, m):
    global n; n += 1
    if not c: fails.append(m); print('  FAIL', m)

def answer(s, k, good, common=False):
    """giá trị đúng / sai cho một chỗ (theo đáp án)"""
    it = s['interaction']; opts = s.get('options') or []
    if k is None: return None
    if (k.get('grading') or s['grading']) == 'manual': return 'I like it because it is fun.' if good else 'no'
    if k.get('accept'): return k['accept'][0] if good else ('zzz' if common else 'qq' + s['id'][-2:])
    c = k.get('correct')
    if c is None: return None
    if good: return c
    if it == 'choice-many': return [o['id'] for o in opts if o['id'] not in c][:1] or None
    if it == 'find': return '0,0-0,1'
    other = [o['id'] for o in opts if o['id'] != c]
    if other: return other[0]
    if it == 'tf': return 'F' if str(c).upper().startswith('T') else 'T'
    return None

S = Server(); errs = []
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        gctx = b.new_context(viewport={'width': 1440, 'height': 900}); g = gctx.new_page()
        g.on('pageerror', lambda e: errs.append('gv: ' + str(e))); g.on('console', lambda m: errs.append('gv: ' + m.text) if m.type == 'error' else None)
        gv_login(g, S.base)
        msg = gui_goi(gctx, S.base, SHEET); ok('Đã gửi' in msg, 'gửi gói: ' + msg)
        ma = mo_phien(g)
        pid = g.evaluate("() => fetch('/api/phien').then(r => r.json()).then(a => a[0].id)")
        goi = api(g, '/api/phien/' + pid)['j']['goi']; key = api(g, f'/api/goi/{goi}/dap-an')['j']
        info = json.loads(p.request.new_context(base_url=S.base).get('/api/hs/phien?ma=' + ma).text())
        hs = info['hocSinh']; ok(len(hs) == 12, 'lớp mẫu 12 em')
        # 8 em vào làm qua API
        slots = None; target = None; plan = {}
        for i, h in enumerate(hs[:8]):
            rq = p.request.new_context(base_url=S.base)
            r = rq.post('/api/hs/vao', data={'phien': info['id'], 'hs': h['id']}); assert r.ok, r.text()
            bai = json.loads(rq.get('/api/hs/bai').text()); slots = bai['slots']
            if target is None: target = next(s for s in slots if key.get(s['id'], {}).get('accept') and (key[s['id']].get('grading') or s['grading']) == 'auto')
            a = {}
            for j, s in enumerate(slots):
                good = (i * 7 + j * 3) % 10 < 7 - (i % 4)       # em sau làm kém dần một chút
                if s['id'] == target['id']: good = i >= 5          # 5 em đầu cùng sai câu này
                if i == 7 and j % 3 == 0: continue               # em cuối bỏ trống một số chỗ
                v = answer(s, key.get(s['id']), good, common=s['id'] == target['id'])
                if v is not None: a[s['id']] = v
            plan[h['id']] = a
            if i < 7: r = rq.post('/api/hs/nop', data={'answers': a})
            else: r = rq.put('/api/hs/bai', data={'answers': a})
            ok(r.ok, f'em {h["ten"]} nộp / lưu: {r.status}')
        man = [s for s in slots if (key.get(s['id'], {}).get('grading') or s['grading']) == 'manual']
        ok(len(man) >= 1, f'phiếu có chỗ chấm tay ({len(man)})')
        # chưa kết thúc: không chấm được
        r = api(g, f'/api/phien/{pid}/cham/{hs[0]["id"]}', 'PUT', {'overrides': {}}); ok(r['s'] == 409, 'phiên còn mở: không chấm')
        g.click('#tab-phien'); g.click('.ltbl tr.click'); g.wait_for_selector('#phKetThuc')
        g.once('dialog', lambda dl: dl.accept()); g.click('#phKetThuc'); g.wait_for_selector('#phCham')
        # ---------- chấm chữa ----------
        g.click('#phCham'); g.wait_for_selector('#chPanel'); g.wait_for_selector('#wsShow.role-review .vsurf')
        ok(g.inner_text('#chHs option:checked').strip().endswith(hs[0]['ten']), 'mở em đầu chưa chấm: ' + g.inner_text('#chHs option:checked'))
        d0 = api(g, f'/api/phien/{pid}/cham')['j']; h0 = next(x for x in d0['hocSinh'] if x['hs'] == hs[0]['id'])
        ok(g.inner_text('#chScore').replace('\n', '').startswith(f"{h0['score']:g}/{h0['max']:g}"), f"điểm hiện {g.inner_text('#chScore')} = máy chủ {h0['score']}/{h0['max']}")
        ok(g.query_selector('#wsShow .vw-ok, #wsShow .vw-no, #wsShow .vwm') is not None, 'trình xem hiện dấu đúng / sai')
        ok(g.query_selector('#wsShow #workScore') is None and g.query_selector('#wsShow #workReset') is None and g.query_selector('#wsShow .vpal') is None, 'chấm chữa: không có công cụ chiếu / làm lại')
        g.screenshot(path=f'{OUT}/cham_1.png')
        # chấm tay: bấm ✓ trong bảng chấm
        mrow = g.locator(f"#chPanel .chrow[data-slot='{man[0]['id']}']"); mrow.locator('.chq button').first.click()
        g.wait_for_selector('#chSave:has-text("Đã lưu")', timeout=5000)
        # sửa điểm câu máy chấm (chấp nhận đáp án khác): câu target của em 0 đang sai
        trow = g.locator(f"#chPanel .chrow[data-slot='{target['id']}']"); trow.locator('.chin').fill('1')
        g.locator(f"#chPanel .chrow[data-slot='{target['id']}'] + .chnote").fill('Chấp nhận, nhưng chú ý chính tả')
        g.fill('#chNhanXet', 'Em làm khá, cần ôn thì quá khứ.'); g.check('#chXong')
        g.wait_for_selector('#chSave:has-text("Đã lưu")', timeout=5000); g.wait_for_timeout(700)
        d1 = api(g, f'/api/phien/{pid}/cham')['j']; h1 = next(x for x in d1['hocSinh'] if x['hs'] == hs[0]['id'])
        mx = key[man[0]['id']]['score']
        ok(h1['overrides'].get(man[0]['id'], {}).get('score') == mx, f'chấm tay ✓ lưu điểm tối đa: {h1["overrides"].get(man[0]["id"])}')
        ok(h1['overrides'].get(target['id'], {}).get('comment') == 'Chấp nhận, nhưng chú ý chính tả', 'lời nhắn từng câu lưu')
        ok(h1['xong'] and h1['nhanXet'].startswith('Em làm khá'), 'chốt chấm + nhận xét lưu')
        ok(h1['score'] > h0['score'], f'điểm tăng sau khi chấm {h0["score"]} → {h1["score"]}')
        # trên phiếu: chỗ chấm tay hiện ✓ (đồng bộ từ bảng)
        g.click('#showScroll'); g.wait_for_timeout(300)   # Cuộn: mọi trang cùng hiện
        ok(g.evaluate(f"() => !!document.querySelector(`#wsShow .vwm.mj[data-vw='{man[0]['id']}']`)"), 'phiếu đồng bộ ✓ chấm tay (dấu chấm tay hiện trên phiếu)')
        g.screenshot(path=f'{OUT}/cham_2.png')
        # em sau
        g.click('#chNext'); g.wait_for_timeout(300); ok(g.inner_text('#chHs option:checked').strip().endswith(hs[1]['ten']), 'sang em sau')
        # quyền: học sinh không gọi được chấm / báo cáo
        rq = p.request.new_context(base_url=S.base)
        ok(rq.get(f'/api/phien/{pid}/cham').status == 401, 'chưa đăng nhập: không xem được bài chấm')
        b.close()
finally:
    S.stop()
errs = [e for e in errs if '409 (Conflict)' not in e]   # 409: thử chấm khi phiên còn mở (cố ý)
ok(not errs, f'lỗi console: {errs[:5]}')
print(f'{n - len(fails)}/{n} đạt')
print('ALL OK' if not fails else 'SOME FAIL')
