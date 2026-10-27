# Đối chiếu giao diện hai bản dựng (dùng khi chuyển cột trái / cột phải sang React, docs/KE_HOACH_REACT.md mục 8).
# Với mỗi phiếu (giống chuan.py) và mỗi lựa chọn (Phiếu, từng Task, từng khối có data-node trên trang, chọn nhiều,
# đặt điểm trên ảnh), so DOM của #insp (cột phải) và #tree (cột trái) giữa hai bản:
#   thẻ, thuộc tính (style chuẩn hóa), value / checked / disabled / open, chữ (gộp khoảng trắng).
# Cách dùng: python3 tests/chuan/giaodien.py <bản mới.html> <bản đối chiếu.html> [số phiếu tối đa]
# Mỗi lần chỉ một Chromium chạy (hai bản lần lượt).
import sys, os, glob, json
from playwright.sync_api import sync_playwright

NEW, OLD = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2])
LIM = int(sys.argv[3]) if len(sys.argv) > 3 else 999
HERE = os.path.dirname(os.path.abspath(__file__)); TESTS = os.path.dirname(HERE); ROOT = os.path.dirname(TESTS)
srcs = [('demo', None)]
files = sorted(glob.glob(os.path.join(ROOT, 'samples', '*.json')) + glob.glob(os.path.join(TESTS, '*.json'))
               + glob.glob(os.path.join(TESTS, 'md', '*.md')) + glob.glob(os.path.join(TESTS, 'real', '*.md')))
for f in files: srcs.append((os.path.relpath(f, ROOT), open(f, encoding='utf-8').read()))
srcs = srcs[:LIM]

LOAD = """raw => { window.confirm = () => true;
  if (raw == null) loadSheet(clone(SAMPLE2));
  else { const J = looksJson(raw) ? readJson(raw) : readMd(raw); if (J.err) return 'ERR ' + J.err; if (!loadSheet(impSheetObj(J))) return 'ERR'; }
  return 'ok'; }"""

# Các lựa chọn cần thử trên phiếu đang mở
STATES = """() => { const out = [{ type: 'sheet' }]; const seen = new Set();
  ws.tasks.forEach(t => { out.push({ type: 'task', id: t.id }); });
  document.querySelectorAll('#stage [data-node]').forEach(e => { const k = e.dataset.node; if (seen.has(k)) return; seen.add(k);
    const p = k.split(':'); if (p.length < 2) return; const s = { type: 'group', id: p[0], g: p[1] }; if (p.length > 2) s.item = p.slice(2).join(':'); out.push(s); });
  return out; }"""

SER = """(st) => {
  // chữ: gộp các nút chữ liền nhau (React có thể tách "a" + "b"), gộp khoảng trắng; class: bỏ khoảng trắng thừa, class rỗng = không có
  const kidsOf = n => { const out = []; let buf = null;
    const flush = () => { if (buf != null) { const t = buf.replace(/\\s+/g, ' ').trim(); if (t) out.push('"' + t + '"'); buf = null; } };
    n.childNodes.forEach(c => { if (c.nodeType === 3) buf = (buf || '') + c.textContent; else if (c.nodeType === 1) { flush(); out.push(ser(c)); } });
    flush(); return out; };
  const ser = n => {
    // Khác biệt có chủ ý: nút chọn font của v106 có style hỏng (dấu " trong tên font cắt mất thuộc tính), bản React hiện đúng font → không so style của nút này
    // <option selected>: React ghi thuộc tính, bản cũ chỉ có thuộc tính DOM .selected (đã so ở dưới) → bỏ thuộc tính
    const fontBtn = n.dataset && n.dataset.act === 'font';
    const a = [...n.attributes].filter(x => x.name !== 'style' && !(x.name === 'selected' && n.tagName === 'OPTION') && !(x.name === 'class' && !x.value.trim()) && !(fontBtn && !/^(class|data-)/.test(x.name))).map(x => x.name + '=' + (x.name === 'class' ? x.value.trim().split(/\\s+/).sort().join(' ') : x.value));
    if (n.getAttribute('style') != null && !fontBtn) a.push('style=' + n.style.cssText);
    a.sort();
    const pr = [];
    if ('value' in n && ['INPUT', 'TEXTAREA', 'SELECT'].includes(n.tagName)) pr.push('.value=' + n.value);
    if (n.tagName === 'INPUT' && (n.type === 'checkbox' || n.type === 'radio')) pr.push('.checked=' + n.checked);
    if (n.tagName === 'OPTION') pr.push('.selected=' + n.selected);
    if (n.tagName === 'DETAILS') pr.push('.open=' + n.open);
    const kids = kidsOf(n);
    return '<' + n.tagName.toLowerCase() + (a.length ? ' ' + a.join(' ') : '') + (pr.length ? ' ' + pr.join(' ') : '') + '>' + (kids.length ? '\\n' + kids.join('\\n').replace(/^/gm, ' ') : '');
  };
  if (st.mk) { markMode = true; } else markMode = false;
  let err = '';   // lỗi khi chọn (vd tay kéo trên trang) ghi lại để so, không dừng cả lượt
  try { if (st.multi) { pick(st.s); pick(st.multi, true); } else pick(st.s); } catch (e) { err = 'LỖI ' + e.message; }
  return [ser(document.getElementById('insp')), ser(document.getElementById('tree')), JSON.stringify(sel) + err]; }"""

def grab(app):
    out, errs = {}, []
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 950})
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        pg.goto('file://' + app); pg.wait_for_timeout(1200); pg.evaluate("() => document.fonts.ready")
        pg.evaluate("() => { try { localStorage.clear(); } catch (_) {} }")
        for name, raw in srcs:
            r = pg.evaluate(LOAD, raw)
            if r != 'ok': out[name] = {'ERR': r}; continue
            pg.wait_for_timeout(100)
            sts = pg.evaluate(STATES); res = {}
            # Mọi mục ở cột trái mở hết (thử cả trạng thái gốc lẫn mở hết)
            for sect in ('goc', 'mo'):
                if sect == 'mo': pg.evaluate("() => { Object.keys(SECT).forEach(k => SECT[k] = true); }")
                for s in sts:
                    k = sect + ' ' + json.dumps(s, ensure_ascii=False)
                    res[k] = pg.evaluate(SER, {'s': s})
                    if sect == 'goc' and s['type'] == 'group' and s['g'] == 'G1' and 'item' not in s:
                        res[k + ' +mk'] = pg.evaluate(SER, {'s': s, 'mk': True}); pg.evaluate("() => { markMode = false; }")
                # chọn nhiều: hai khối cùng loại đầu tiên khác Task
                grp = [s for s in sts if s['type'] == 'group']
                for i, s1 in enumerate(grp):
                    s2 = next((x for x in grp[i + 1:] if x['g'] == s1['g'] and x['id'] != s1['id'] and ('item' in x) == ('item' in s1)), None)
                    if s2: res[sect + ' multi ' + json.dumps([s1, s2], ensure_ascii=False)] = pg.evaluate(SER, {'s': s1, 'multi': s2}); break
                pg.evaluate("() => { sectReset('(x)'); }")
            out[name] = res
        b.close()
    return out, errs

def first_diff(a, b):
    la, lb = a.split('\n'), b.split('\n')
    for i in range(max(len(la), len(lb))):
        x = la[i] if i < len(la) else '(hết)'; y = lb[i] if i < len(lb) else '(hết)'
        if x != y: return f'dòng {i}: mới «{x.strip()[:220]}» | cũ «{y.strip()[:220]}»'
    return ''

A, ea = grab(NEW); B, eb = grab(OLD)
n = bad = 0; shown = 0
for name in B:
    for k, v in B[name].items():
        n += 1; w = A.get(name, {}).get(k)
        if w == v: continue
        bad += 1
        if shown < 25:
            shown += 1; part = 'insp' if (w and w[0] != v[0]) else 'tree' if (w and w[1] != v[1]) else 'sel'
            idx = {'insp': 0, 'tree': 1, 'sel': 2}[part]
            print(f'KHÁC {name} | {k[:160]} | {part} | ' + (first_diff(w[idx], v[idx]) if w else 'thiếu'))
print('ERRS mới', ea[:5], '| cũ', eb[:5])
print(f'{n - bad}/{n} trạng thái khớp')
print('ALL OK' if not bad and not ea else 'SOME FAIL')
