# Đợt 4 sau kiểm thử (v116): viết tắt chuẩn + công tắc, chip gợi ý cách viết khác, ô chữ tìm từ, prompt quy tắc 26.
# Cách dùng: python3 tests/sau_kiem_thu/test_dot4.py <app.html> [thư mục ảnh]
import sys, os
from playwright.sync_api import sync_playwright
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from chung import *

with sync_playwright() as p:
    pg, b = mo(p, sys.argv[1])
    key(pg, 't')
    # 4.1 viết tắt
    task(pg, 6)
    ids = pg.evaluate("() => [...document.querySelectorAll('#wsShow section[data-task=t6] [data-ans]')].map(e => e.dataset.ans)")
    typ(pg, ids[0], 'I am')
    chk('4.1 đáp án "I\'m / I am": gõ "I am" đúng', st(pg, ids[0]) == 'ok', st(pg, ids[0]))
    pg.click(S(ids[0])); pg.keyboard.press('Control+A'); pg.keyboard.type('Im'); pg.keyboard.press('Enter'); pg.wait_for_timeout(60)
    chk('4.1 "Im" (thiếu nháy) vẫn sai', st(pg, ids[0]) == 'no', st(pg, ids[0]))
    pg.evaluate("() => document.activeElement && document.activeElement.blur()")
    pg.keyboard.press('Escape'); pg.wait_for_timeout(100)
    if pg.query_selector('#wsShow'): pg.click('#showClose'); pg.wait_for_timeout(150)
    # công tắc theo Task: dữ liệu → khóa chấm
    r = pg.evaluate("""() => { commit(w => { w.tasks[0].answer.params.strictContr = true; }, 'x'); const k = sheetSlots(ws).key; const s = Object.keys(k).find(x => x.startsWith(ws.tasks[0].id + '.') && k[x].accept);
      return [k[s].strictContr === true, sheetToMd(ws).includes('Phân biệt viết tắt: có')]; }""")
    chk('4.1 bật "Phân biệt viết tắt": khóa chấm mang strictContr, MD ghi "Phân biệt viết tắt: có"', r == [True, True], r)
    r = pg.evaluate("raw => { const w = impSheetObj(readMd(raw)); return !!w.tasks[0].answer.params.strictContr; }", "# P\n\n## Task: A\nDạng: điền từ\nPhân biệt viết tắt: có\n1. He ___ here.\n\n## Đáp án\nTask 1: isn't\n")
    chk('4.1 đọc MD "Phân biệt viết tắt: có"', r is True, r)
    pg.evaluate("() => commit(w => { delete w.tasks[0].answer.params.strictContr; }, 'x')")
    # công tắc trên cột trái
    pg.evaluate("() => { sel = { type: 'task', id: ws.tasks[0].id }; window.__ws.pick && window.__ws.pick(sel); }"); pg.wait_for_timeout(300)
    n = pg.evaluate("() => document.querySelectorAll('[data-eact=strictc], [data-act=strictc]').length")
    chk('4.1 có công tắc "Phân biệt viết tắt" ở mục Câu hỏi', n >= 2, n)
    # 4.2 chip gợi ý
    pg.evaluate("() => commit(w => { const t = w.tasks[15]; t.content.items[0].key = 'colour'; t.content.items[1].key = 'He has gone'; t.content.items[2].key = 'ten'; }, 'x')"); pg.wait_for_timeout(200)
    pg.evaluate("() => window.__ws.pick({ type: 'task', id: ws.tasks[15].id })"); pg.wait_for_timeout(400)
    chips = pg.evaluate("() => [...document.querySelectorAll('#tree .esug [data-eact=sugadd]')].map(b => b.dataset.v)")
    chk('4.2 chip gợi ý dưới ô đáp án: color, He\'s gone, 10', set(chips) >= {'color', "He's gone", '10'}, chips)
    chk('4.2 Task có ≥ 3 gợi ý: nút "Nhận tất cả"', pg.query_selector('#tree [data-eact=sugall]') is not None)
    pg.screenshot(path=f'{SHOT}/d4_chip.png')
    pg.click("#tree .esug [data-eact=sugadd][data-v='color']"); pg.wait_for_timeout(300)
    chk('4.2 bấm chip: thêm " / color"', pg.evaluate("() => ws.tasks[15].content.items[0].key") == 'colour / color', pg.evaluate("() => ws.tasks[15].content.items[0].key"))
    pg.click("#tree .esug [data-eact=sugno][data-v='10']"); pg.wait_for_timeout(300)
    chk('4.2 bấm ×: bỏ gợi ý, không hỏi lại', '10' not in pg.evaluate("() => [...document.querySelectorAll('#tree .esug [data-eact=sugadd]')].map(b => b.dataset.v)") and pg.evaluate("() => ws.tasks[15].content.items[2].key") == 'ten')
    # 4.3 ô chữ tìm từ
    r = pg.evaluate("() => { const k = sheetSlots(ws); return k.slots.filter(s => s.interaction === 'find').map(s => [s.label, k.key[s.id].correct]); }")
    chk('4.3 tìm từ: máy tìm vị trí 4 từ (cat, dog, fish, bird)', len(r) >= 3 and all(x[1] for x in r), r)
    pg.click('#showBtn'); pg.wait_for_selector('#wsShow'); pg.wait_for_timeout(200); key(pg, 't'); task(pg, 26)
    key(pg, 'a'); pg.wait_for_timeout(80)
    nc = pg.evaluate("() => document.querySelectorAll('#wsShow section[data-task=t26] svg.vcap').length")
    chk('4.3 hiện đáp án: khung bo góc quanh từng từ', nc == len(r), (nc, len(r)))
    pg.screenshot(path=f'{SHOT}/d4_timtu_dapan.png'); key(pg, 'a')
    def drag(a, z):
        A = pg.query_selector(f"#wsShow section[data-task='t26'] [data-rc='{a}']").bounding_box(); Z = pg.query_selector(f"#wsShow section[data-task='t26'] [data-rc='{z}']").bounding_box()
        pg.mouse.move(A['x'] + A['width'] / 2, A['y'] + A['height'] / 2); pg.mouse.down(); pg.mouse.move(Z['x'] + Z['width'] / 2, Z['y'] + Z['height'] / 2, steps=6); pg.mouse.up(); pg.wait_for_timeout(100)
    cat = [x for x in r if x[0].lower() == 'cat'][0][1]; a, z = cat.split('-')
    drag(z, a)
    sid = pg.evaluate("() => sheetSlots(ws).slots.find(s => s.interaction === 'find' && s.label.toLowerCase() === 'cat').id")
    chk('4.3 kéo ngược từ T về C: "cat" đúng, khung xanh', st(pg, sid) == 'ok' and pg.query_selector("#wsShow svg.vwfd.ok") is not None, st(pg, sid))
    drag('3,0', '3,2')
    chk('4.3 kéo "ABC" (không có trong khung từ): báo, không chấm', 'không có' in (pg.inner_text('#wsShow .vmsg') if pg.query_selector('#wsShow .vmsg') else ''))
    chk('4.3 bộ đếm cộng chỗ tìm từ', pg.inner_text('#workScore').startswith('Đúng 1/'), pg.inner_text('#workScore'))
    pg.screenshot(path=f'{SHOT}/d4_timtu_lambai.png')
    # 4.4 prompt
    pr = open(os.path.join(ROOT, 'docs/PROMPT_PDF_SANG_PHIEU.md'), encoding='utf-8').read()
    chk('4.4 prompt có quy tắc 26 [x] cho ô đúng của bảng chọn', '\n26. BẢNG CHỌN CÓ Ô TICK' in pr and '[x]' in pr)
    xong(b)
