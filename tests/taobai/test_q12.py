# T0 module Tạo bài: rà bộ đọc MD với 12 dạng Q viết theo kiểu AI (docs/TAO_BAI/1_DANG_Q.md, CHUNG_1_QUY_TAC_MD.md).
# Cách chạy: python3 tests/taobai/test_q12.py <ws-editor.html>
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from q12_mau import MAU, build
from playwright.sync_api import sync_playwright
F = 'file://' + os.path.abspath(sys.argv[1]); ok = True
def chk(n, c, x=''):
    global ok; print(('PASS ' if c else 'FAIL '), n, x if not c else ''); ok &= bool(c)
JS = """md=>{const o=readMd(md);return {err:o.err,mdNotes:o.mdNotes,tasks:o.tasks.map(x=>{if(!x.t)return {err:x.err};const t=x.t;
  const real=its(t).filter(i=>!i.ex&&!i.gt&&!(isFreeW(t)));
  const keyed=real.filter(i=>(i.key!=null&&i.key!=='')||/\\{\\*|\\|\\*/.test(i.text||'')||(i.pair&&i.pair.l&&i.pair.r)).length;
  return {q:qOf(t),desc:descOf(t),n:ck(t)==='table'?null:real.length,keys:ck(t)==='table'?null:keyed,notes:x.notes,conf:x.conf,
    cellAns:ck(t)==='table'?(t.content.rows||[]).flatMap(r=>r.cells).filter(c=>c&&c.ans).length:0}})}}"""
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(); errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_' not in m.text and 'font' not in m.text.lower() else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.goto(F); pg.wait_for_timeout(1200)
    r = pg.evaluate(JS, build(MAU))
    chk('đọc được cả phiếu', not r['err'] and len(r['tasks']) == len(MAU), r['err'])
    for m, t in zip(MAU, r['tasks']):
        name, _, _, q, n, k = m
        chk(f'{name}: dạng {q}', t.get('q') == q, t)
        if n is not None: chk(f'{name}: {n} câu', t['n'] == n, t)
        if k is not None: chk(f'{name}: {k} câu có đáp án', t['keys'] == k, t)
        chk(f'{name}: không ghi chú lạ, độ chắc cao', not t['notes'] and t['conf'] == 'cao', t['notes'])
        if q == 'Q12': chk(f'{name}: nhãn không ghi "viết câu"', 'viết câu' not in t['desc'], t['desc'])
    t10 = r['tasks'][[m[0] for m in MAU].index('Q10 bảng có =đáp án')]
    chk('Q10: 4 ô có đáp án', t10['cellAns'] == 4, t10)
    # câu sắp xếp từ có " / " ngay sau câu hỏi: không bị gộp thành lựa chọn của câu trên
    s = pg.evaluate("md=>{const t=readMd(md).tasks[0].t;return its(t).map(i=>i.text)}", "## Task: Order.\nDạng: viết câu\n1. you / did / go / where / ?\n2. was / at / I / home")
    chk('sắp xếp từ sau câu có "?": giữ 2 câu', s == ['you / did / go / where / ?', 'was / at / I / home'], s)
    s = pg.evaluate("md=>{const t=readMd(md).tasks[0].t;return its(t).map(i=>[i.text,i.opts])}", "## Task: Look.\nWhat is it?\ncat / dog")
    chk('dán chữ thường: "What is it?" + "cat / dog" vẫn là lựa chọn', s == [['What is it?', ['cat', 'dog']]], s)
    # "Bài đọc: <chữ>" cùng dòng
    s = pg.evaluate("md=>{const x=readMd(md).tasks[0];return {lead:x.t.content.lead&&x.t.content.lead.text,n:its(x.t).length,k:its(x.t).map(i=>i.key),notes:x.notes}}",
        "## Task: Read.\nBài đọc: Last Sunday Mai was at the beach. It was hot.\nDạng: đúng/sai\n1. Mai was at the zoo.\n2. It was hot.\n\n## Đáp án\nTask 1: F; T")
    chk('"Bài đọc: <chữ>" thành bài đọc, đáp án không lệch', s['lead'] == 'Last Sunday Mai was at the beach. It was hot.' and s['n'] == 2 and s['k'] == ['F', 'T'] and len(s['notes']) == 1, s)
    s = pg.evaluate("md=>{const x=readMd(md).tasks[0];return {ck:ck(x.t),n:its(x.t).length,notes:x.notes}}", "## Task: Talk.\nHội thoại: Mai: Hi, Ben.\nBen: Hi, Mai. ___ you at home?")
    chk('"Hội thoại: Tên: lời" cùng dòng', s['ck'] == 'dialogue' and s['n'] == 2, s)
    # Ví dụ kết quả trong file chung 1 (docs/TAO_BAI/CHUNG_1_QUY_TAC_MD.md mục 4–5): tách meta (shared) rồi đọc bằng app phải đúng
    import re, subprocess
    root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    doc = open(os.path.join(root, 'docs/TAO_BAI/CHUNG_1_QUY_TAC_MD.md'), encoding='utf-8').read()
    ex = [blk for blk in re.findall(r'```\n(.*?)```', doc, re.S) if blk.startswith('## Task:') and 'Mục tiêu: <' not in blk]
    tm = json.loads(subprocess.run(['node', '--experimental-strip-types', '--disable-warning=ExperimentalWarning', os.path.join(root, 'tests/taobai/tach_meta.ts')],
        input=json.dumps(ex), capture_output=True, text=True, check=True).stdout)
    chk('file chung 1: có 2 ví dụ kết quả', len(ex) == 2, len(ex))
    for blk, m in zip(ex, tm):
        chk('ví dụ file chung 1: tách được Mục tiêu / Ngữ cảnh', m['goal'] and m['ctx'] and not m['notes'], m['notes'])
        q = pg.evaluate("md=>{const x=readMd(md).tasks[0];const t=x.t;return {q:qOf(t),n:its(t).filter(i=>!i.ex&&!i.gt&&!isFreeW(t)).length,k:its(t).filter(i=>i.key).length,notes:x.notes,conf:x.conf}}", m['md'])
        want = ('Q12', 0, 0) if 'viết tự do' in blk else ('Q1', 6, 6)
        chk(f'ví dụ file chung 1 ({want[0]}): đọc đúng dạng, số câu, đáp án, không ghi chú', (q['q'], q['n'], q['k']) == want and not q['notes'] and q['conf'] == 'cao', q)
    chk('0 lỗi console', not errs, errs)
    b.close()
print('ALL OK' if ok else 'SOME FAIL')
