# v81 bậc 0 / 5: cú pháp MD mới (Dạng:, Bố cục:, câu ví dụ 0., dòng chữ "> ", Khung từ ảnh:, Vị trí khung từ:, Dòng kẻ:, Thứ tự:,
# Khối chữ: / Khối ảnh:, Điểm trên ảnh:, Ảnh: A; B, đáp án 0. và Chỗ trống:) — đọc, vẽ, xuất MD rồi đọc lại
# Mẫu do Claude viết: tests/md/v81-cu-phap.md (không thay được phiếu do AI khác viết từ PDF thật)
import sys, os, json
from playwright.sync_api import sync_playwright
F = 'file://' + sys.argv[1]; ok = True
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
MD = open(os.path.join(HERE, 'md', 'v81-cu-phap.md'), encoding='utf-8').read()
def chk(n, c, x=''):
    global ok; print(('PASS ' if c else 'FAIL '), n, x if not c else ''); ok &= bool(c)
SUM = """(m)=>{const r=readMd(m);if(r.err)return r.err;return r.tasks.map(x=>x.err||({q:qOf(x.t),tn:tnOf(x.t),A:x.t.answer.layout,att:x.t.answer.attach,p:x.t.answer.params,img:x.t.image||null,wb:x.t.wordBank||null,
  ex:(x.t.extras||[]).map(e=>[e.kind,e.pos,e.text||e.label]),ord:x.t.layout.order||null,lead:x.t.content.lead||null,
  items:its(x.t).map(i=>({text:i.text??null,ex:!!i.ex,gt:!!i.gt,key:i.key??null})),notes:x.notes}))}"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 1000}); errs = []
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_' not in m.text and 'font' not in m.text.lower() else None)
    pg.goto(F); pg.wait_for_timeout(1200)
    r = pg.evaluate(SUM, MD)
    chk('Đọc được 7 Task, không lỗi', isinstance(r, list) and len(r) == 7 and all(isinstance(x, dict) for x in r), r if not isinstance(r, list) else len(r))
    if isinstance(r, list) and len(r) == 7:
        t1, t2, t3, t4, t5, t6, t7 = r
        chk('Không có ghi chú "không hiểu" trên mẫu đúng cú pháp', not any('không hiểu' in n or 'không hợp' in n for x in r for n in x['notes']), [x['notes'] for x in r])
        chk('T1: Dạng: điền từ = Q1, gạch trong câu', t1['q'] == 'Q1' and t1['att'] == 'inline')
        chk('T1: Ảnh: A; B = hai ảnh, chỉ Xếp dọc', t1['img'] and t1['img'].get('two') and t1['img'].get('label2') == 'phòng khách' and t1['tn'] == 'T1', t1['img'])
        chk('T1: "0." = câu ví dụ có đáp án mẫu "book"; "> " = dòng chữ; đáp án 1, 2 vào đúng câu thật', [(i['ex'], i['gt'], i['key']) for i in t1['items']] == [(True, False, 'book'), (False, False, 'pen'), (False, True, None), (False, False, 'bag')], t1['items'])
        chk('T2: bài đọc 2 đoạn có nhãn A. B. (không thành lựa chọn)', t2['lead'] and t2['lead']['text'].count('\n\n') == 1 and t2['lead']['text'].startswith('A. ') and len(t2['items']) == 2, t2['lead'])
        chk('T2: Dạng: đúng/sai (Yes/No) = Q5 nhãn Yes / No', t2['q'] == 'Q5' and t2['p'].get('labs') == ['Yes', 'No'])
        chk('T2: Thứ tự: câu hỏi trước', t2['ord'] == 'qfirst')
        chk('T3: Dạng: chọn trong câu (nhãn A-D) = Q4, nhãn dưới <u>, không thêm lựa chọn giả', t3['q'] == 'Q4' and t3['p'].get('ulab') and t3['att'] == 'inline' and all('{' not in i['text'] for i in t3['items']), t3)
        chk('T4: Dạng: viết tự do (khung vẽ) = Q12 khung vẽ, không ảnh giả', t4['q'] == 'Q12' and t4['p'].get('frame') == 'box' and not t4['img'] and len(t4['items']) == 1)
        chk('T5: Dạng: viết câu + Dòng kẻ: bốn ô li', t5['q'] == 'Q2' and t5['p'].get('ruling') == '4' and [i['text'] for i in t5['items']] == ['cat', 'dog'], t5)
        chk('T6: Khung từ ảnh 3 ô, dưới câu hỏi', t6['wb'] and t6['wb'].get('kind') == 'image' and t6['wb']['words'] == ['apple', 'banana', 'cherry'] and t6['wb']['placement'] == 'bottom', t6['wb'])
        chk('T6: Khối chữ (2 dòng, dưới) + Khối ảnh trên', t6['ex'] == [['text', 'bottom', 'Remember: use capital letters.\nLook at the pictures first.'], ['image', 'top', 'bản đồ khu vườn']], t6['ex'])
        chk('T7: Bố cục: ảnh trái + Điểm trên ảnh (ô trống)', t7['tn'] == 'T2' and t7['img'].get('marks') == [{'x': 20, 'y': 30}, {'x': 50, 'y': 60}] and (t7['img'].get('mk') or {}).get('label') == 'none', t7['img'])
    # Nạp cả phiếu: vẽ được, 0 tràn, các phần tử mới có trên trang
    pg.evaluate("(m)=>{const J=readMd(m);loadSheet({tasks:J.tasks.map(x=>x.t)})}", MD); pg.wait_for_timeout(500)
    q = lambda sel: pg.evaluate(f"document.querySelectorAll({json.dumps(sel)}).length")
    chk('Trang: ảnh đôi, câu ví dụ số 0, dòng chữ, nhãn A–D, khung vẽ, bốn ô li, khung từ ảnh, khối chữ / ảnh, điểm trên ảnh',
        q('#stage .g1.g1two') >= 1 and q('#stage .ino.ex') >= 1 and q('#stage .q.g3t') >= 1 and q('#stage .ulb') >= 4 and q('#stage .abox') == 1 and q('#stage .a1.r4') >= 2 and q('#stage .g4.wimg .wim') == 3 and q('#stage .mkd') >= 2,
        [q(s) for s in ['#stage .g1.g1two', '#stage .ino.ex', '#stage .q.g3t', '#stage .ulb', '#stage .abox', '#stage .a1.r4', '#stage .g4.wimg .wim', '#stage .mkd']])
    chk('Không cảnh báo tràn trang', pg.inner_text('#diagBadge') == 'Không lỗi tràn', pg.inner_text('#diagBadge'))
    for i in range(int(pg.evaluate("document.querySelectorAll('#stage .page').length"))):
        pg.locator('#stage .page').nth(i).screenshot(path=os.path.join(ROOT, 'logs', f'test30_p{i + 1}.png'))
    # Xuất MD rồi đọc lại: giữ đủ
    md2 = pg.evaluate("sheetToMd(ws)")
    open(os.path.join(ROOT, 'logs', 'test30_xuat.md'), 'w', encoding='utf-8').write(md2)
    r2 = pg.evaluate(SUM, md2)
    strip = lambda L: [{k: v for k, v in x.items() if k != 'notes'} for x in L] if isinstance(L, list) else L
    a, c = strip(r), strip(r2)
    diff = [i + 1 for i in range(min(len(a), len(c))) if json.dumps(a[i], sort_keys=True) != json.dumps(c[i], sort_keys=True)] if isinstance(c, list) else c
    chk('Xuất MD → đọc lại: 7 Task giống hệt (dạng, bố cục, ví dụ, dòng chữ, khung từ ảnh, khối, điểm, thứ tự, đáp án)', isinstance(c, list) and len(c) == 7 and not diff, (diff, [(a[i - 1], c[i - 1]) for i in diff[:1]] if isinstance(diff, list) else diff))
    # Cùng một phiếu thật viết bằng Trả lời: (cũ) và Dạng: (mới) cho ra cùng cấu hình
    old = open(os.path.join(HERE, 'md', 'birthday6.md'), encoding='utf-8').read(); new = open(os.path.join(HERE, 'md', 'birthday6-dang.md'), encoding='utf-8').read()
    CFG = "(m)=>{const r=readMd(m);return r.tasks.map(x=>x.err||[qOf(x.t),x.t.answer.kind,x.t.answer.attach,x.t.answer.layout,JSON.stringify(x.t.answer.params),its(x.t).length,x.t.layout.break])}"
    ro, rn = pg.evaluate(CFG, old), pg.evaluate(CFG, new)
    chk('Phiếu birthday6: Dạng: cho cùng cấu hình như Trả lời: (8 khối)', ro == rn and len(ro) == 8, [(a_, b_) for a_, b_ in zip(ro, rn) if a_ != b_])
    chk('0 lỗi console', not errs, errs[:3])
    print('ERRS', errs)
    b.close()
print('ALL OK' if ok else 'SOME FAIL')
