# Tạo samples/lop/ws-demo-lop.json: phiếu demo "Unit 3 · My home" (samples/ws-sample.json) kèm đáp án để thử Live ngay.
# Viết bài tự do (t8, t13) để trống đáp án có chủ ý: để thử chấm tay. Chạy: python3 tests/lop/tao_demo.py
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from chung import ROOT, LOAD
from playwright.sync_api import sync_playwright

KEYS = {   # id Task → {id câu: đáp án}; bảng có xử lý riêng bên dưới
 't1': dict(i1='cat', i2='dog', i3='fish', i4='bird', i5='frog', i6='duck'),
 't3': dict(i1='a', i2='b', i3='b'),
 't4': dict(q1='b', q2='b', q3='b', q4='b', q5='a'),
 't11': dict(q1='b', q2='a', q3='c', q4='b', q5='c', q6='a'),
 't12': dict(l1='c', l3='a', l5='d', l7='e', l9='b'),
 't5': dict(q1='kitchen', q2='bedroom', q3='garden', q4='bathroom', q5='living room'),
 't6': dict(q1='f', q2='t', q3='t', q4='f', q5='t'),
 't7': dict(q1='nine / She is nine / She is nine years old', q2='Max / His name is Max / The dog\'s name is Max', q3='brown and white / Max is brown and white', q4='in the park / They walk Max in the park'),
}
PAST = {'see': 'saw / seen', 'eat': 'ate / eaten', 'take': 'took / taken', 'write': 'wrote / written', 'buy': 'bought / bought', 'make': 'made / made', 'come': 'came / come',
        'give': 'gave / given', 'know': 'knew / known', 'drink': 'drank / drunk', 'sing': 'sang / sung', 'run': 'ran / run', 'swim': 'swam / swum', 'sleep': 'slept / slept', 'drive': 'drove / driven', 'read': 'read / read', 'speak': 'spoke / spoken'}
JS = """([KEYS, PAST]) => {
  for (const t of ws.tasks) {
    const k = KEYS[t.id];
    if (k) (t.content.items || []).forEach(x => { if (k[x.id] != null) x.key = k[x.id]; });
    if (t.id === 't2') t.content.shuffle = true;   // bài nối: bật "Xáo vế phải" thì cặp đúng xác định được
    if (t.id === 't15') { const v = { r2: ['8', 'dancing', 'noodles'], r3: ['10', 'swimming', 'chicken'], r4: ['9', 'reading', 'ice cream'] };
      t.content.rows.forEach(r => { if (v[r.id]) r.cells = v[r.id].map(a => ({ ans: a })); }); }
    if (t.id === 't17') t.content.rows.forEach(r => { const p = PAST[r.head]; if (p) r.cells = p.split(' / ').map(a => ({ ans: a })); });
    if (t.id === 't16') { const ok = { cow: [1, 0, 0], tiger: [0, 1, 0], rabbit: [1, 0, 1], monkey: [0, 1, 1], chicken: [1, 0, 0] };
      t.content.rows.forEach(r => { const o = ok[r.head.text]; if (o) r.cells = o.map(f => f ? { tick: 1, ok: 1 } : { tick: 1 }); }); }
  }
  return JSON.stringify(ws);
}"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(); pg.goto('file://' + os.path.join(ROOT, 'ws-editor.html')); pg.wait_for_function('() => typeof loadSheet === "function"')
    assert pg.evaluate(LOAD, open(os.path.join(ROOT, 'samples/ws-sample.json'), encoding='utf-8').read()) != None
    # t18: dấu * đứng trước vế đúng trong {a|b}: viết lại từng dòng
    FIX = {'i1': ['It’s {windy|*rainy}.', '{*Take|Put} your raincoat {*on|off}.', 'Don’t forget your {shorts|*umbrella}.'],
           'i2': ['It’s {cloudy|*sunny}.', '{*Take|Put} your jumper {*off|on}.', 'Put your {*swimming costume|coat} on.']}
    pg.evaluate("F => { const t = ws.tasks.find(x => x.id === 't18'); t.content.items.forEach(x => { x.lines = F[x.id]; }); }", FIX)
    out = pg.evaluate(JS, [KEYS, PAST])
    open(os.path.join(ROOT, 'samples/lop/ws-demo-lop.json'), 'w', encoding='utf-8').write(json.dumps(json.loads(out), ensure_ascii=False, indent=1))
    print('ghi xong', len(out))
    b.close()

# ---- đóng gói sẵn cho nút "Nạp dữ liệu demo": gửi 2 phiếu lên một máy chủ tạm rồi chép thư mục gói vào server/demo/goi/
import shutil, json as _j
from chung import Server, gv_login, gui_goi
DEMO = [('demo-unit3', 'samples/lop/ws-demo-lop.json'), ('demo-ontap', 'tests/md/mau-tron.md')]
dest = os.path.join(ROOT, 'server', 'demo', 'goi'); shutil.rmtree(dest, ignore_errors=True)
S = Server()
try:
    with sync_playwright() as p:
        b = p.chromium.launch(); ctx = b.new_context(viewport={'width': 1366, 'height': 900}); g = ctx.new_page(); gv_login(g, S.base)
        for did, f in DEMO:
            before = set(os.listdir(os.path.join(S.data, 'goi')))
            print(did, gui_goi(ctx, S.base, f))
            new = set(os.listdir(os.path.join(S.data, 'goi'))) - before; assert len(new) == 1, new
            src = os.path.join(S.data, 'goi', new.pop()); shutil.copytree(src, os.path.join(dest, did))
        b.close()
finally: S.stop()
print('đã chép vào', dest, os.listdir(dest))
