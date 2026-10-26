# Dựng phiếu demo đầy đủ tính năng trình bày (bản v78) → samples/ws-demo-day-du.json
# Chạy: python3 tests/demo_full.py <đường dẫn tuyệt đối ws-editor-prototype.html> [thư mục ảnh chụp]
# Task cổ điển lấy từ demo cài sẵn (SAMPLE2) rồi chỉnh thêm tùy chọn; Task mới viết thẳng schema 0.3 và đi qua fillTask.
import sys, json, os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'samples', 'ws-demo-day-du.json')
SHOTS = sys.argv[2] if len(sys.argv) > 2 else None

BUILD = r"""
() => {
  const S = id => clone(SAMPLE2.tasks.find(t => t.id === id));
  const L = o => Object.assign(LAYOUT_DEF(), o || {});
  const T = (o) => Object.assign({ typeId: 'custom', audio: null, image: null, wordBank: null, spacing: { preset: null, overrides: {} } }, o, { layout: L(o.layout) });
  const out = [];
  const add = (t, name) => { t.typeName = name; out.push(t); };

  /* ---------- 1. Ảnh từng câu (T5) ---------- */
  { const t = S('t1'); t.answer = { kind: 'word', attach: 'item', layout: 'A3', params: {} };
    add(t, 'Demo · Lưới ảnh T5 (Ảnh trên) + ô chữ cái A3'); }
  add(S('t18'), 'Demo · Lưới ảnh T5 (Ảnh trái) + chọn trong câu {a|b}');
  { const t = S('t3'); t.qr = { src: 'link', link: 'https://example.com/audio/track05.mp3' };
    add(t, 'Demo · Nhiều ảnh mỗi câu + tick A5 + Track + mã QR nghe'); }
  add(S('t2'), 'Demo · Nối cặp T7 + chấm nối A7');

  /* ---------- 2. Câu hỏi, lựa chọn ---------- */
  add(S('t4'), 'Demo · Khoanh A/B/C (Ⓐ, Tự động → Ngang)');
  add(S('t11'), 'Demo · Khoanh A/B/C (A., chữ hoa, Tự động → Dọc cả Task)');
  add(T({ id: 'n_box', title: 'What do you like doing at the weekend? Tick (✓) two.', instruction: 'Tick the boxes.',
    content: { form: 'list', items: [
      { id: 'q1', text: 'At the weekend I like…', opts: ['reading comics', 'swimming', 'visiting farm animals', 'a football match', 'riding my bike'] } ] },
    answer: { kind: 'choice', attach: 'item', layout: 'A4', params: { lab: 'box' } } }),
    'Demo · Ô tick ☐ (một câu → ẩn số; Tự động → Tự xuống dòng)');
  add(S('t5'), 'Demo · Điền chỗ trống + khung từ ở trên (chips)');
  add(S('t12'), 'Demo · Hội thoại + khung từ bên phải (danh sách a–f)');
  add(S('t6'), 'Demo · Đúng/Sai T4 (Hai cột 80/20) + ảnh chung');
  add(S('t8'), 'Demo · Dòng kẻ viết A1 (2 dòng)');
  add(S('t13'), 'Demo · Chỗ trống cuối câu kéo dài 2 dòng');

  /* ---------- 3. Ảnh chung ở các vị trí ---------- */
  add(T({ id: 'n_t2', title: 'Look at the picture. Write one word.', instruction: 'Write the missing word.',
    image: { label: 'a kitchen', size: 'medium' },
    content: { form: 'list', items: [
      { id: 'q1', text: 'The cat is on the ___.', key: 'chair' }, { id: 'q2', text: 'Mum is cooking ___.', key: 'soup' },
      { id: 'q3', text: 'There are three ___ on the table.', key: 'cups' }, { id: 'q4', text: 'The window is ___.', key: 'open' } ] },
    answer: { kind: 'word', attach: 'inline', layout: 'A2', params: { lenMode: 'fill', lines: 1, start: 'inline' } }, layout: { task: 'T2' } }),
    'Demo · Ảnh trái T2 (chỗ trống trong câu A2)');
  add(T({ id: 'n_t3', title: 'Look at the picture. Answer the questions.', instruction: 'Write short answers.',
    image: { label: 'a beach', size: 'medium' },
    content: { form: 'list', items: [ { id: 'q1', text: 'How many children are swimming?' }, { id: 'q2', text: 'What is the dog doing?' }, { id: 'q3', text: 'What colour is the boat?' } ] },
    answer: { kind: 'sentence', attach: 'item', layout: 'A1', params: { lines: 1 } }, layout: { task: 'T3' } }),
    'Demo · Ảnh phải T3 (dòng kẻ A1)');
  add(T({ id: 'n_mark', title: 'Look at the picture. Write the words.', instruction: 'Look at the numbers on the picture.',
    image: { label: 'a bedroom', size: 'medium', marks: [{ x: 18, y: 30 }, { x: 52, y: 22 }, { x: 78, y: 55 }, { x: 34, y: 72 }] },
    content: { form: 'list', items: [ { id: 'q1', text: 'Number 1 is a ___.', key: 'lamp' }, { id: 'q2', text: 'Number 2 is a ___.', key: 'clock' }, { id: 'q3', text: 'Number 3 is a ___.', key: 'bed' }, { id: 'q4', text: 'Number 4 is a ___.', key: 'rug' } ] },
    answer: { kind: 'word', attach: 'inline', layout: 'A2', params: { lenMode: 'fill', lines: 1, start: 'inline' } }, layout: { task: 'T1' } }),
    'Demo · Điểm trên ảnh chung (chấm tròn có số)');
  add(T({ id: 'n_mark2', title: 'Where are they? Listen and write the letter in the box.', instruction: 'There is one example.', audio: 'Track 14',
    image: { label: 'a town map', size: 'large', marks: [{ x: 22, y: 35 }, { x: 60, y: 28 }, { x: 45, y: 70 }], mk: { shape: 'square', label: 'none' } },
    extras: [ { id: 'x_places', kind: 'text', pos: 'top', frame: 'fill', align: 'center', text: '**A** the library  ·  **B** the park  ·  **C** the café' } ],
    content: { form: 'list', list: false, items: [] }, answer: { kind: 'none', attach: 'item', layout: null, params: {} } }),
    'Demo · Điểm trên ảnh (ô vuông trống) + chỉ có ảnh + khối chữ nền xám');
  add(S('t10'), 'Demo · Chỉ có ảnh (tô màu), ảnh lớn T1');

  /* ---------- 4. Bài đọc ---------- */
  add(S('t7'), 'Demo · Bài đọc T8 (ảnh trong bài, chữ bao quanh)');
  add(T({ id: 'n_cloze', title: 'Read the email. Fill the gaps.', instruction: 'Use the words in the box. There is one extra word.',
    wordBank: { words: ['am', 'go', 'play', 'like', 'swim'], placement: 'top', style: 'chips' },
    content: { form: 'list', lead: { kind: 'passage', keys: ['am', 'go', 'play', 'like'],
      text: 'Hi Sam,\n\nMy name is **Linh**. I ___ ten years old. I live in *Hoi An*, a small town near the sea.\n\nEvery Saturday I ___ to the beach with my family. My brother and I ___ football on the sand. Then we eat {noodles|pizza} at a little café.\n\nWhat do you ___ doing at the weekend? Please __write back__ soon!\n\nLove,\nLinh' },
      items: [ { id: 'q1', text: 'Where does Linh live?' }, { id: 'q2', text: 'Who does she play football with?' } ] },
    answer: { kind: 'sentence', attach: 'item', layout: 'A1', params: { lines: 1 } }, layout: { task: 'T1' } }),
    'Demo · Bài đọc nhiều đoạn: chỗ trống (1)(2)…, {a|b}, đậm/nghiêng/gạch chân, cắt theo đoạn');

  /* ---------- 5. Task nhiều phần (Nối vào Task trên) + số câu ---------- */
  add(T({ id: 'n_pa', title: 'The Lost Puppy', instruction: 'Look at the title. What happens in the story? Tick (✓) one.',
    content: { form: 'list', items: [ { id: 'q1', text: '', opts: ['The puppy finds a new home.', 'A girl loses her puppy.', 'The puppy goes to school.'] } ] },
    answer: { kind: 'choice', attach: 'item', layout: 'A4', params: { lab: 'box' } } }),
    'Demo · Task nhiều phần: phần a (một câu → ẩn số 1)');
  add(T({ id: 'n_pb', title: '', instruction: 'Now read the story. Put the sentences in order. Write 1–4 in the boxes.',
    content: { form: 'list', lead: { kind: 'passage', text: 'Mia has a small brown puppy called Biscuit. One morning, Biscuit runs out of the garden. Mia looks in the park and in the street. At last she finds him at the bakery. He is eating a biscuit!' },
      items: [ { id: 'q1', text: 'Mia looks in the park.', key: '2', len: 1 }, { id: 'q2', text: 'Biscuit runs out of the garden.', key: '1', len: 1 }, { id: 'q3', text: 'Biscuit eats a biscuit.', key: '4', len: 1 }, { id: 'q4', text: 'Mia finds Biscuit at the bakery.', key: '3', len: 1 } ] },
    answer: { kind: 'word', attach: 'item', layout: 'A3', params: {} }, layout: { break: 'join', num: 'off' } }),
    'Demo · Task nhiều phần: phần b (bài đọc + xếp thứ tự bằng ô chữ cái, ẩn số câu)');
  add(T({ id: 'n_pd', title: '', instruction: 'Self-check: Can you tell the story to a friend?',
    content: { form: 'list', items: [ { id: 'q1', text: '', opts: ['Yes, I can.', 'A little.', 'Not yet.'] } ] },
    answer: { kind: 'choice', attach: 'item', layout: 'A4', params: { lab: 'box' } }, layout: { break: 'join' } }),
    'Demo · Task nhiều phần: phần c (nhãn Self-check nằm trong hướng dẫn)');

  /* ---------- 6. Khối tự do (G-Text) ---------- */
  add(T({ id: 'n_gt', title: 'Write about your bedroom.', instruction: 'Write 3–4 sentences.',
    extras: [
      { id: 'x_rule', kind: 'text', pos: 'top', frame: 'both', text: '**Remember!**\n- *There is* + one thing: There is a bed.\n- *There are* + many things: There are two lamps.' },
      { id: 'x_img', kind: 'image', pos: 'top', label: 'my bedroom', w: 45, align: 'center' },
      { id: 'x_tip', kind: 'text', pos: 'bottom', frame: 'line', size: 's', align: 'right', text: 'Check: capital letters ✓ full stops ✓' } ],
    content: { form: 'list', items: [ { id: 'q1', text: 'In my bedroom, there is / there are …' } ] },
    answer: { kind: 'sentence', attach: 'item', layout: 'A1', params: { lines: 4 } } }),
    'Demo · Khối tự do: chữ có khung + ảnh + chữ nhỏ căn phải');
  add(S('t9'), 'Demo · Tô chữ A8');

  /* ---------- 7. Bảng ---------- */
  add(S('t14'), 'Demo · Bảng chọn A/B/C');
  add(S('t15'), 'Demo · Bảng điền (tô sọc, cột đầu rộng)');
  add(S('t16'), 'Demo · Bảng tick, ảnh ở tiêu đề hàng');
  add(S('t17'), 'Demo · Bảng dài (cắt trang, lặp tiêu đề)');

  /* ---------- 8. Ô chữ ---------- */
  const WS = ['PANDAXTIGER', 'OWLRZEBRAKS', 'HORSEQLIONM', 'MONKEYFROGB', 'DUCKSNAKEVW'];
  add(T({ id: 'n_wsearch', title: 'Find and circle the animals.', instruction: 'The words go across.',
    wordBank: { words: ['panda', 'tiger', 'owl', 'zebra', 'horse', 'lion', 'monkey', 'frog', 'duck', 'snake'], placement: 'top', style: 'chips', label: 'none' },
    content: { form: 'table', corner: '', cols: Array(11).fill(''), rows: WS.map(r => ({ head: '', cells: r.split('') })) },
    answer: { kind: 'none', attach: 'item', layout: null, params: {} },
    layout: { table: { head: false, rowHead: false, nm: 'off', lines: 'all', align: 'center', minH: 8, split: false } } }),
    'Demo · Ô chữ tìm từ (bảng chữ cái + khung từ)');
  const xw = T({ id: 'n_cross', title: 'Complete the crossword.', instruction: 'Read the clues. Write the animals.',
    content: { form: 'table', corner: '', cols: [''], rows: [{ head: '', cells: [''] }] },
    answer: { kind: 'none', attach: 'item', layout: null, params: {} },
    layout: { table: { head: false, rowHead: false, nm: 'off', lines: 'all', align: 'center', minH: 8, cross: true, xc: 11 } },
    extras: [ { id: 'x_clues', kind: 'text', pos: 'bottom', cols: 2,
      text: '**Across**\n1. A small pet. It says “meow”.\n\n3. It eats grass and gives us milk.\n4. A small grey animal with a long tail.\n\n**Down**\n1. A big farm animal. It says “moo”.\n2. A big orange cat with black stripes.' } ] });
  applyField(xw, 'cross.grid', 'CAT###\nO#I###\nW#(G)OAT\n##E###\n##RAT#');
  add(xw, 'Demo · Ô chữ giải đố + gợi ý 2 cột (khối chữ)');
  return out;
}
"""

with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 1600}); errs = []
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'ERR_' not in m.text and 'font' not in m.text.lower() else None)
    pg.goto('file://' + sys.argv[1]); pg.wait_for_timeout(1300)
    raw = pg.evaluate(BUILD)
    notes = pg.evaluate("""(ts)=>{const n=[];const tasks=ts.map(t=>{const k=n.length;const r=fillTask(t,n);for(let i=k;i<n.length;i++)n[i]=t.id+': '+n[i];return r});
      const ok=loadSheet({schema:'ws-editor/0.3',id:'ws-demo-full',title:'Demo đầy đủ tính năng · v78',age:'7-9',
        page:{size:'A4',marginMm:{top:14,right:14,bottom:14,left:14}},spacing:{preset:'normal',overrides:{}},flow:'cont',tasks},'demo');
      return {ok,n}}""", raw)
    pg.wait_for_timeout(1500)
    print('load', notes)
    print('tasks', pg.evaluate("ws.tasks.length"), '| pages', pg.inner_text('#pageBadge'), '|', pg.inner_text('#diagBadge'))
    print('nums', pg.evaluate("[...document.querySelectorAll('#tree .tnode')].map(e=>e.textContent.trim().slice(0,6)).join(' ')"))
    w = pg.evaluate("ws.tasks.map((t,i)=>{let w=[];try{w=(contentWarnings(t)||[]).map(x=>x.t||x.msg||x)}catch(e){w=['ERR '+e]};return [i+1,t.id,ck(t),w]}).filter(x=>x[3].length)")
    for x in w: print('WARN', x)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    open(OUT, 'w', encoding='utf-8').write(pg.evaluate('JSON.stringify(ws,null,1)'))
    if SHOTS:
        pg.add_style_tag(content='#toast,.toast,header,.top{display:none !important}'); pg.wait_for_timeout(300)
        os.makedirs(SHOTS, exist_ok=True)
        n = pg.locator('.page').count()
        for i in range(n): pg.locator('.page').nth(i).screenshot(path=os.path.join(SHOTS, f'demo_p{i+1}.png'))
        print('shots', n)
    print('ERRS', errs)
    b.close()
