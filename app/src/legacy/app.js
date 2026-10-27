/* ================= Hằng số & chính sách ================= */
const MM = 96 / 25.4;                 // px trên mỗi mm (CSS)
const CONTENT_H = 297 - 14 - 14 - 7;  // mm: A4 − lề trên/dưới − chân trang
const SPLIT_MIN = 80;                 // mm trống tối thiểu để cắt bài thay vì đẩy sang trang mới
const AGE = {
  '5-6':  { font: 16, line: 12, maxCols: 3 },
  '7-9':  { font: 14, line: 10, maxCols: 3 },
  '10-12':{ font: 12, line: 8,  maxCols: 4 }
};
// Cỡ chữ phiếu (v72): ba mức Nhỏ / Vừa / To theo độ tuổi, ghi rõ từng số pt. Mức To = cỡ chữ cũ của độ tuổi (không lưu vào phiếu).
const SIZES = { s: 'Nhỏ', m: 'Vừa', l: 'To' };
const FSZ = { '5-6': { s: 12, m: 14, l: 16 }, '7-9': { s: 10, m: 12, l: 14 }, '10-12': { s: 9, m: 10.5, l: 12 } };
const sizeKey = () => SIZES[ws.size] ? ws.size : 'm';   // v84: mặc định Vừa ở mọi độ tuổi (không ghi vào phiếu); Nhỏ / To ghi ws.size
const fontPt = () => FSZ[ws.age][sizeKey()];
const PRESETS = {
  compact: { gapTask: 6,  padTask: 2, headGap: 2, groupGap: 3, itemGap: 3 },
  normal:  { gapTask: 8,  padTask: 3, headGap: 3, groupGap: 4, itemGap: 4 },
  airy:    { gapTask: 12, padTask: 4, headGap: 4, groupGap: 6, itemGap: 6 }
};
const PRESET_NAME = { compact: 'Gọn', normal: 'Vừa', airy: 'Thoáng' };
const MINS = { gapTask: 4, padTask: 0, headGap: 1.5, groupGap: 2, itemGap: 2 };
const SP_LABEL = { gapTask: 'Giữa các Task', padTask: 'Padding trong Task', headGap: 'G0 → nội dung', groupGap: 'Giữa các nhóm', itemGap: 'Giữa các item / câu' };
const TL = {
  T1: { name: 'Xếp dọc' },
  T2: { name: 'Ảnh trái', ratio: 35, range: [25, 50] },
  T3: { name: 'Ảnh phải', ratio: 65, range: [50, 75] },
  T4: { name: 'Nội dung | Đáp án', ratio: 60, range: [40, 70] },
  T5: { name: 'Lưới item' },
  T6: { name: 'Chỉ nội dung' },
  T7: { name: 'Matching', ratio: 20, range: [15, 30] },
  T8: { name: 'Ảnh trong bài đọc' },
  T9: { name: 'Bảng' }
};
const AL = { A1: 'Dòng kẻ viết', A2: 'Ô trống', A3: 'Ô chữ cái', A4: 'Lựa chọn A/B/C', A5: 'Tick / số', A6: 'Cột T/F', A7: 'Chấm nối', A8: 'Dòng tô' };
const ATTACH = { inline: 'Trong câu', item: 'Theo item', block: 'Khối riêng' };

/* ================= Dữ liệu mẫu (viết theo schema 0.1, tự chuyển sang 0.2 khi nạp) ================= */
const T = o => { const r = Object.assign({ audio: null, image: null, wordBank: null,
  layout: { task: 'auto', ratio: null, cols: null, imageFit: null, imageH: null, imageW: null, imageObj: null, imageAlign: null, imageOx: null, imageOy: null, imageZoom: null, cellAlign: null, table: null }, spacing: { preset: null, overrides: {} } }, o,
  { answer: Object.assign({ params: {} }, o.answer) });
  if (o.layout) r.layout = Object.assign({ task: 'auto', ratio: null, cols: null, imageFit: null, imageH: null, imageW: null, imageObj: null, imageAlign: null, imageOx: null, imageOy: null, imageZoom: null, cellAlign: null, table: null }, o.layout);
  return r; };
const SAMPLE = {
  schema: 'ws-editor/0.1', id: 'ws-demo-001', title: 'Unit 3 · My home', age: '7-9',
  page: { size: 'A4', marginMm: { top: 14, right: 14, bottom: 14, left: 14 } },
  spacing: { preset: 'compact', overrides: {} }, flow: 'cont',   // v85: mặc định Gọn
  tasks: [
    T({ id: 't1', typeId: 'V01', typeName: 'Look and write', title: 'Look and write.', instruction: 'Look at the pictures. Write the words.',
      content: { kind: 'items', variant: 'single', items: ['cat','dog','fish','bird','frog','duck'].map((w,i) => ({ id: 'i'+(i+1), img: w, len: w.length })) },
      answer: { kind: 'word', attach: 'item', layout: 'A2' } }),
    T({ id: 't2', typeId: 'V02', typeName: 'Match pictures with words', title: 'Look and match.', instruction: 'Draw a line from the picture to the word.',
      content: { kind: 'pairs', left: ['apple','banana','pear','orange','lemon'].map((w,i)=>({ id:'l'+(i+1), img:w })), right: ['pear','lemon','apple','orange','banana'].map((w,i)=>({ id:'r'+(i+1), text:w })) },
      answer: { kind: 'match', attach: 'item', layout: 'A7' } }),
    T({ id: 't3', typeId: 'LS03', typeName: 'Listen and tick', title: 'Listen and tick (✓) the box.', instruction: 'There is one example.', audio: 'Track 05',
      content: { kind: 'items', variant: 'multi', items: [
        { id: 'i1', text: 'What is Tom eating?', imgs: ['pizza','rice','cake'] },
        { id: 'i2', text: 'Where is the cat?', imgs: ['on the bed','under the table','in the box'] },
        { id: 'i3', text: "What colour is Ann's bag?", imgs: ['red bag','blue bag','green bag'] } ] },
      answer: { kind: 'tick', attach: 'item', layout: 'A5' } }),
    T({ id: 't4', typeId: 'G01', typeName: 'Multiple choice', title: 'Choose the correct answer.', instruction: 'Circle a, b or c.',
      content: { kind: 'questions', questions: [
        { id: 'q1', text: 'She ___ a teacher.', opts: ['am','is','are'] },
        { id: 'q2', text: 'They ___ playing football in the garden.', opts: ['is','are','be'] },
        { id: 'q3', text: 'I have ___ apple in my bag.', opts: ['a','an','the'] },
        { id: 'q4', text: 'There ___ two cats on the sofa.', opts: ['is','are','am'] },
        { id: 'q5', text: 'My brother can ___ very fast.', opts: ['run','runs','running'] } ] },
      answer: { kind: 'choice', attach: 'item', layout: 'A4', params: { dir: 'h' } } }),
    T({ id: 't11', typeId: 'R05', typeName: 'Reading · choose A, B or C', title: 'Questions 1–6: Choose the best answer A, B, or C.', instruction: 'Look at the three school notices. Circle one answer.',
      content: { kind: 'questions', questions: [
        { id: 'q1', text: 'How many classes does Pine Hill School have?', opts: ['Ten', 'Twelve', 'Fourteen'] },
        { id: 'q2', text: 'What do Pine Hill students do in the afternoon?', opts: ['They use the computer room or join the music club.', 'They work in the school garden or play basketball.', 'They have art lessons or go swimming.'] },
        { id: 'q3', text: 'About how many students study at Kim Dong Secondary School?', opts: ['270', '620', '720'] },
        { id: 'q4', text: 'Lan wants to use a computer for her schoolwork at Kim Dong. Where should she go?', opts: ['The science room', 'The computer room', 'The playground'] },
        { id: 'q5', text: 'Which sentence is correct about Green World School?', opts: ['Teachers teach all subjects in English.', 'Teachers teach all subjects in Vietnamese.', 'Teachers teach subjects in English and Vietnamese.'] },
        { id: 'q6', text: 'Mai wants to study with international students. Which school is suitable for her?', opts: ['Green World School', 'Pine Hill School', 'Kim Dong Secondary School'] } ] },
      answer: { kind: 'choice', attach: 'item', layout: 'A4', params: { dir: 'auto', lab: 'dot', perQ: {} } } }),
    T({ id: 't12', typeId: 'D02', typeName: 'Complete the conversation', title: 'Complete the conversation with the responses a–f. There is one extra response.', instruction: 'Write one letter in each gap.',
      wordBank: { words: ['Le Loi Secondary School.', 'Great! Let’s sing together one day.', 'Yes. The teachers and students are very friendly.', 'Really? Is she in Grade 6?', 'I go to the music club on Thursdays.', 'I usually ride my bike.'], placement: 'right', style: 'list', label: 'lower' },
      content: { kind: 'dialogue', intro: 'Mai is talking to Ben about his new school.', lines: [
        { who: 'Mai', text: 'Hi, Ben. Do you like your new school?' }, { who: 'Ben', text: '___' },
        { who: 'Mai', text: 'Great! Which school do you go to?' }, { who: 'Ben', text: '___' },
        { who: 'Mai', text: 'Oh, my cousin studies there, too.' }, { who: 'Ben', text: '___' },
        { who: 'Mai', text: 'Yes, she is. She is in Class 6B. What do you do after lessons?' }, { who: 'Ben', text: '___' },
        { who: 'Mai', text: 'That sounds fun! I love music, too.' }, { who: 'Ben', text: '___' } ] },
      answer: { kind: 'word', attach: 'inline', layout: 'A2', params: { lenMode: 'fill', lines: 1, start: 'inline' } } }),
    T({ id: 't5', typeId: 'V10', typeName: 'Complete with word bank', title: 'Complete the sentences.', instruction: 'Use the words in the box.',
      wordBank: { words: ['kitchen','garden','bedroom','bathroom','living room'], placement: 'top' },
      content: { kind: 'questions', questions: [
        { id: 'q1', text: 'We cook dinner in the ___.' }, { id: 'q2', text: 'I sleep in my ___.' },
        { id: 'q3', text: 'Flowers grow in the ___.' }, { id: 'q4', text: 'I wash my hands in the ___.' },
        { id: 'q5', text: 'We watch TV in the ___.' } ] },
      answer: { kind: 'word', attach: 'inline', layout: 'A2', params: { lenMode: 'fill', lines: 1, start: 'inline' } } }),
    T({ id: 't13', typeId: 'W07', typeName: 'Speaking plan', title: 'Choose one school. Complete the speaking plan with short notes.', instruction: 'Write short notes.',
      content: { kind: 'questions', questions: [
        { id: 'q1', text: 'The school I choose: ___' }, { id: 'q2', text: 'Reason 1: one fact from the text: ___' },
        { id: 'q3', text: 'Reason 2: why it is good for me: ___' }, { id: 'q4', text: 'One activity I would like to do: ___' } ] },
      answer: { kind: 'word', attach: 'inline', layout: 'A2', params: { lenMode: 'fill', lines: 2, start: 'inline' } } }),
    T({ id: 't14', typeId: 'TB1', typeName: 'Bảng · chọn A/B/C', title: 'Listen to Mia talk about her weekend. Choose A, B or C.', instruction: 'Circle one answer in each row.', audio: 'Track 11',
      content: { kind: 'table', corner: '', cols: ['A', 'B', 'C'], rows: [
        { head: 'Day she goes swimming', cells: ['Saturday', 'Sunday', 'Monday'] }, { head: 'Time she leaves home', cells: ['8:00', '8:30', '9:00'] },
        { head: 'Who goes with her', cells: ['her sister', 'her cousin', 'her friend'] }, { head: 'Lunch after swimming', cells: ['a sandwich', 'rice and fish', 'noodles'] },
        { head: 'What she does at home', cells: ['reads a book', 'watches TV', 'helps her mum cook dinner'] } ] },
      answer: { kind: 'none', attach: 'item', layout: null } }),
    T({ id: 't15', typeId: 'TB2', typeName: 'Bảng · điền thông tin', title: 'Listen and complete the table.', instruction: 'Write one or two words. There is one example.', audio: 'Track 12',
      layout: { table: { num: false, fill: 'zebra', align: 'center', lines: 'all', cols: 'first', first: 22 } },
      content: { kind: 'table', corner: 'Name', cols: ['Age', 'Hobby', 'Favourite food'], rows: [
        { head: 'Tom', cells: ['9', 'football', 'pizza'] }, { head: 'Lily', cells: ['', '', ''] }, { head: 'Ben', cells: ['', '', ''] }, { head: 'Mai', cells: ['', '', ''] } ] },
      answer: { kind: 'none', attach: 'item', layout: null } }),
    T({ id: 't16', typeId: 'TB3', typeName: 'Bảng · tick theo cột', title: 'Where do these animals live? Tick (✓) the box.', instruction: 'Tick one or more boxes in each row.',
      layout: { table: { lines: 'h', fill: 'none', align: 'center', cols: 'first', first: 40, rowHead: true } },
      content: { kind: 'table', corner: '', cols: ['Farm', 'Zoo', 'Forest'], rows: ['cow', 'tiger', 'rabbit', 'monkey', 'chicken'].map(w => ({ head: { img: w, text: w }, cells: [{ tick: 1 }, { tick: 1 }, { tick: 1 }] })) },
      answer: { kind: 'none', attach: 'item', layout: null } }),
    T({ id: 't17', typeId: 'TB4', typeName: 'Bảng · bảng dài (cắt trang)', title: 'Complete the table with the past forms of the verbs.', instruction: 'Use the example to help you.',
      layout: { table: { fill: 'zebra', lines: 'all', cols: 'equal' } },
      content: { kind: 'table', corner: 'Verb', cols: ['Past simple', 'Past participle'], rows: [['go', 'went', 'gone'], ['see', '', ''], ['eat', '', ''], ['take', '', ''], ['write', '', ''], ['buy', '', ''], ['make', '', ''], ['come', '', ''], ['give', '', ''], ['know', '', ''], ['drink', '', ''], ['sing', '', ''], ['run', '', ''], ['swim', '', ''], ['sleep', '', ''], ['drive', '', ''], ['read', '', ''], ['speak', '', '']].map(r => ({ head: r[0], cells: [r[1], r[2]] })) },
      answer: { kind: 'none', attach: 'item', layout: null } }),
    T({ id: 't6', typeId: 'R03', typeName: 'True or False', title: 'Look at the picture. True or False?', instruction: 'Circle T (true) or F (false).',
      image: { label: 'the park', size: 'medium', scale: 100 },
      content: { kind: 'questions', questions: [
        { id: 'q1', text: 'There are three children in the park.' }, { id: 'q2', text: 'The dog is under the tree.' },
        { id: 'q3', text: 'A girl is riding a bike.' }, { id: 'q4', text: 'The boy is eating an ice cream.' },
        { id: 'q5', text: 'It is a sunny day.' } ] },
      answer: { kind: 'tf', attach: 'item', layout: 'A6' } }),
    T({ id: 't7', typeId: 'R01', typeName: 'Read and answer', title: 'Read and answer.', instruction: 'Read the text. Answer the questions.',
      image: { label: 'Lucy and Max', size: 'medium', scale: 100 },
      content: { kind: 'passage', text: 'My name is Lucy. I am nine years old. I live in a small house with my mum, my dad and my brother Ben. We have a dog. His name is Max. Max is brown and white. Every morning, Ben and I walk Max in the park. Max likes running after balls.',
        questions: [ { id: 'q1', text: 'How old is Lucy?' }, { id: 'q2', text: "What is the dog's name?" }, { id: 'q3', text: 'What colour is Max?' }, { id: 'q4', text: 'Where do they walk Max?' } ] },
      answer: { kind: 'sentence', attach: 'item', layout: 'A1', params: { lines: 1 } } }),
    T({ id: 't8', typeId: 'W03', typeName: 'Answer the questions', title: 'Answer the questions about you.', instruction: 'Write full sentences.',
      content: { kind: 'questions', questions: [
        { id: 'q1', text: 'What is your name?' }, { id: 'q2', text: 'How old are you?' }, { id: 'q3', text: 'What is your favourite food?' },
        { id: 'q4', text: 'What can you do?' }, { id: 'q5', text: 'Who is in your family?' }, { id: 'q6', text: 'What do you do after school?' } ] },
      answer: { kind: 'sentence', attach: 'item', layout: 'A1', params: { lines: 2 } } }),
    T({ id: 't9', typeId: 'P01', typeName: 'Trace the words', title: 'Trace the words.', instruction: 'Say the word. Then trace it.',
      content: { kind: 'trace', words: ['cat','hat','map','bag','van'] },
      answer: { kind: 'trace', attach: 'item', layout: 'A8', params: { repeat: 3 } } }),
    T({ id: 't10', typeId: 'LS04', typeName: 'Listen and colour', title: 'Listen and colour.', instruction: 'Listen to the teacher. Colour the picture.', audio: 'Track 08',
      image: { label: 'the classroom', size: 'large', scale: 100 },
      content: { kind: 'picture' }, answer: { kind: 'none', attach: 'item', layout: null } }),
    T({ id: 't18', typeId: 'R06', typeName: 'Read and underline', title: 'Read.', instruction: 'What’s the weather like? Underline the correct answer.',
      content: { kind: 'items', variant: 'single', items: [
        { id: 'i1', img: 'rainy', lines: ['It’s {windy|rainy}.', '{Take|Put} your raincoat {on|off}.', 'Don’t forget your {shorts|umbrella}.'] },
        { id: 'i2', img: 'sunny', lines: ['It’s {cloudy|sunny}.', '{Take|Put} your jumper {off|on}.', 'Put your {swimming costume|coat} on.'] } ] },
      answer: { kind: 'choice', attach: 'inline', layout: 'A4' } })
  ]
};

/* ================= Trạng thái ================= */
/* ---- Schema 0.3: nội dung gom về hai form. content{form:'list'|'table', lead?, variant?, items[]} ----
   Mã dàn trang đọc thẳng hai form. "Kiểu" (questions, items, pairs…) chỉ là phân loại suy ra, không lưu. */
// 0.1/0.2 (content.kind) → 0.3
function toForm(c) {
  if (c.kind === 'table') return { form: 'table', corner: c.corner, cols: c.cols, rows: c.rows };
  if (c.kind === 'picture') return { form: 'list', list: false, items: [] };   // bài chỉ có tranh = danh sách câu đang tắt, 0 câu
  if (c.kind === 'passage') return { form: 'list', lead: { kind: 'passage', text: c.text }, items: c.questions };
  if (c.kind === 'dialogue') return { form: 'list', lead: c.intro ? { kind: 'text', text: c.intro } : null, items: c.lines.map((l, i) => ({ id: 'l' + i, who: l.who, text: l.text })) };
  if (c.kind === 'trace') return { form: 'list', items: c.words.map((w, i) => ({ id: 'w' + i, text: w })) };
  if (c.kind === 'pairs') { const n = Math.max(c.left.length, c.right.length); return { form: 'list', items: Array.from({ length: n }, (_, i) => ({ id: 'p' + i, pair: { l: c.left[i] || null, r: c.right[i] || null } })) }; }
  if (c.kind === 'items') return { form: 'list', variant: c.variant, items: c.items };
  return { form: 'list', items: c.questions }; // questions
}
// Phân loại nội dung (suy ra, không lưu). A8 + danh sách chữ = tô chữ.
function ckOf(c, A) {
  if (!c || c.form === 'table') return 'table';
  const it = c.list === false ? [] : (c.items || []), ld = c.lead;   // list:false = tắt danh sách câu (dữ liệu câu vẫn giữ)
  if (ld && ld.kind === 'passage') return 'passage';
  if (!it.length) return 'empty';                                      // 0 câu: chỉ có ảnh chung (không còn dạng "Tranh" riêng)
  if (it.some(x => x.pair)) return 'pairs';
  if (it.some(x => x.who != null) && !['A1', 'A4', 'A5', 'A6'].includes(A)) return 'dialogue';   // v81: người nói là thuộc tính câu; chỉ điền từ / không đáp án mới là hội thoại
  if (it.some(x => x.img || x.imgs)) return 'items';
  if (A === 'A8') return 'trace';
  return 'questions';
}
const ck = t => ckOf(t.content, t.answer && t.answer.layout);
const its = t => (t.content && t.content.list !== false && t.content.items) || [];
const leadText = t => (t.content.lead && t.content.lead.text) || '';
// Bài đọc nhiều đoạn (dòng trống giữa các đoạn) → mỗi đoạn một <p>; bài một đoạn giữ nguyên như cũ
const paraHtml = s => /\n/.test(s) ? s.split(/\n\s*\n/).map(x => x.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean).map(x => `<p>${esc(x)}</p>`).join('') : esc(s);
/* Bài đọc (v75): ___ chỗ trống tự đánh số khi có từ 2 chỗ; {a|b} chọn; **đậm**, *nghiêng*, __gạch chân__ */
const passageParas = t => { const x = leadText(t); return /\n/.test(x) ? x.split(/\n\s*\n/).map(p => p.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean) : [x]; };
// v100: chỗ trống đứng sau nhãn có sẵn "(a)" thì không thêm số (n)
// v101: nhãn in sẵn trước từng chỗ trống của một câu: "(a)" → "(a)", chỗ trống không có nhãn → ''
const gapLabs = tx => { const o = [], str = String(tx || ''); str.replace(/_{3,}/g, (m, at) => { const m2 = /\(\s*([A-Za-z0-9]{1,2})\s*\)\s*$/.exec(str.slice(0, at)); o.push(m2 ? `(${m2[1]})` : ''); return m; }); return o; };
const GAPP = /_{3,}/g, GAPLAB = /\(\s*[A-Za-z0-9]{1,2}\s*\)\s*$/, gapCount = x => (String(x).match(GAPP) || []).length;
function passInline(raw, n0, total) {
  let k = n0;
  return rich(esc(pkPre(raw)).replace(GAPP, (m, at, str) => { k++; return `<span class="pgap">${total > 1 && !GAPLAB.test(str.slice(0, at)) ? `(${k})` : '&nbsp;'}</span>`; })
    .replace(/\{([^{}|]+(?:\|[^{}|]+)+)\}/g, (m, g) => `<span class="pch">${g.split('|').map(o => `<b>${o.replace(/\u0003/g, '').trim()}</b>`).join('&nbsp;/ ')}</span>`)
    .replace(/(?<!_)__(?!_)(.+?)(?<!_)__(?!_)/g, '<u>$1</u>'));   // __gạch chân__ (cũ, v75) và <u>…</u>, **đậm**, *nghiêng* đều dùng được
}
function passageHtml(t, idx) {
  const ps = passageParas(t), total = gapCount(leadText(t)); let n = 0; const off = ps.map(p => { const o = n; n += gapCount(p); return o; });
  if (!/\n/.test(leadText(t))) return passInline(ps[0], 0, total);
  const lab = ps.filter(p => /^[A-H][.)]\s+\S/.test(p)).length >= 2;   // v81: đoạn có nhãn A–F (bài nối tiêu đề với đoạn)
  return ps.map((p, i) => { if (idx && !idx.includes(i)) return ''; const m = lab && /^([A-H])[.)]\s+([\s\S]*)$/.exec(p); return m ? `<p class="plb"><b class="plt">${m[1]}</b><span>${passInline(m[2], off[i], total)}</span></p>` : `<p>${passInline(p, off[i], total)}</p>`; }).join('');
}
const passCut = (t, L) => ck(t) === 'passage' && (L === 'T1' || L === 'T6') && t.layout.order !== 'qfirst';   // v81: câu hỏi trước bài đọc thì không cắt theo đoạn
const clone = o => JSON.parse(JSON.stringify(o));
const SCHEMA = 'ws-editor/0.3';
// Bố cục Task (schema 0.2). Khóa null hoặc vắng mặt = Tự động.
const LAYOUT_DEF = () => ({ num: null, nlab: null, mbd: null, task: 'auto', split: null, cols: null, dir: null, align: null, valign: null, width: null, cw: null, rowH: null, whoW: null, colGap: null, break: null, frame: {}, cells: null, table: null });
const F01 = { imageFit: 'fit', imageH: 'h', imageW: 'w', imageOx: 'ox', imageOy: 'oy', imageZoom: 'zoom', imageAlign: 'align', imageObj: 'obj' };
// Chuyển dữ liệu 0.1 sang 0.2 (đọc được cả hai)
function migTask(t) {
  if (t.content && Array.isArray(t.content.rows)) ensureRowIds(t);
  if (t.content && t.content.kind) t.content = toForm(t.content);   // 0.1/0.2 → 0.3
  if (t.content && t.content.lead && t.content.lead.kind === 'picture') { delete t.content.lead; if (!(t.content.items || []).length) t.content.list = false; } // dạng "Tranh" cũ → danh sách câu tắt
  if (t.uploads) { const it = t.content.items || [], u = {}; Object.keys(t.uploads).forEach(k => { const m = /^([ip])(\d+)(?:\.(\d+))?$/.exec(k); if (m && it[+m[2]]) u['@' + it[+m[2]].id + (m[3] != null ? '.' + m[3] : '')] = t.uploads[k]; else u[k] = t.uploads[k]; }); t.uploads = u; } // ảnh tải lên: khóa theo id câu
  const l = t.layout || {}, n = LAYOUT_DEF();
  Object.keys(n).forEach(k => { if (l[k] != null && k !== 'frame' && k !== 'cells') n[k] = clone(l[k]); });
  if (l.frame) Object.assign(n.frame, clone(l.frame));
  if (l.cells) n.cells = clone(l.cells);
  if (l.ratio != null) n.split = l.ratio;
  if (l.cellDir) n.dir = l.cellDir;
  if (l.cellAlign) n.align = l.cellAlign;
  if (l.order) n.order = l.order;   // v81: câu hỏi trước bài đọc
  Object.keys(F01).forEach(k => { if (l[k] != null) n.frame[F01[k]] = l[k]; });
  if (t.image && t.image.scale != null) { if (t.image.scale !== 100 && n.frame.scale == null) n.frame.scale = t.image.scale; delete t.image.scale; }
  if (n.cells) Object.values(n.cells).forEach(c => { const f = c.frame || {}; Object.keys(F01).forEach(k => { if (c[k] != null) f[F01[k]] = c[k]; delete c[k]; }); if (c.ratio != null) c.split = c.ratio; delete c.ratio; if (Object.keys(f).length) c.frame = f; });
  if (ck(t) === 'pairs' && n.split != null) { const s = n.split; n.cw = [(100 - s) / 2, s, (100 - s) / 2]; n.split = null; }
  const tb = n.table;
  if (tb && tb.fill !== undefined) { if (tb.fh === undefined) tb.fh = tb.fill === 'head'; if (tb.fc === undefined) tb.fc = tb.fill === 'col'; if (tb.fr === undefined) tb.fr = tb.fill === 'zebra' ? 'zebra' : 'none'; delete tb.fill; }
  t.layout = n;
  t.spacing = t.spacing || { preset: null, overrides: {} };
  const p = t.answer.params = t.answer.params || {};
  if (p.perQ) { p.perItem = p.perItem || {}; Object.keys(p.perQ).forEach(q => { (p.perItem[q] = p.perItem[q] || {}).dir = p.perQ[q]; }); delete p.perQ; }
  pkMig(t);
  return t;
}
function migrate(w) { w.tasks.forEach(migTask); w.schema = SCHEMA; return w; }
const SAMPLE2 = migrate(clone(SAMPLE)); SAMPLE2.tasks.forEach(t => tidy(t));
let ws = clone(SAMPLE2);
let base = clone(SAMPLE2);       // bản gốc của phiếu đang mở (để "Về kiểu đáp án ban đầu", khung từ)
let sel = { type: 'sheet' }, multi = [];
let hist = [], fut = [];
let zoom = null;                 // null = vừa khung
let lastStart = null, lastCount = 0;
let lastRes = null;
let guides = false;

/* ================= Quy tắc layout ================= */
function autoLayout(t) {
  const k = ck(t);
  if (k === 'pairs') return 'T7';
  if (k === 'items') return 'T5';
  if (k === 'empty') return 'T1';
  if (k === 'dialogue') return 'T6';
  if (k === 'table') return 'T9';
  if (t.image) { if (t.image.size === 'large') return 'T1'; if (t.answer.layout === 'A6') return 'T4'; if (k === 'passage') return 'T8'; return 'T2'; }
  if (t.answer.layout === 'A6') return k === 'questions' ? 'T4' : 'T6';   // v105: bài đọc + T/F xếp dọc (bài đọc trên, câu dưới)
  return 'T6';
}
function layoutReasons(t) { // '' = hợp lệ, chuỗi = lý do bị khóa
  const k = ck(t), r = {};
  for (const L of Object.keys(TL)) {
    let why = '';
    if (L === 'T8') why = (k === 'passage' && t.image) ? '' : 'Chỉ dùng cho bài đọc có ảnh';
    else if (L === 'T9') why = k === 'table' ? '' : 'Chỉ dùng cho bài dạng bảng';
    else if (k === 'table') why = 'Bài bảng chỉ dùng Bảng';
    else if (k === 'dialogue') why = L === 'T6' ? '' : 'Bài hội thoại dùng Chỉ nội dung';
    else if (k === 'pairs') why = L === 'T7' ? '' : 'Bài nối chỉ dùng Matching';
    else if (L === 'T7') why = 'Chỉ dùng cho bài nối cặp';
    else if (k === 'empty') why = L === 'T1' ? '' : 'Chưa có câu nào: chỉ dùng Xếp dọc';
    else if (k === 'items') why = L === 'T5' ? '' : L === 'T6' ? (its(t).some(it => it.lines) ? 'Item nhiều dòng chỉ dùng Lưới item' : '') : 'Bài dạng item dùng Lưới item hoặc Chỉ nội dung';
    else if (L === 'T5') why = 'Cần danh sách item có ảnh';
    else if (t.image) why = L === 'T6' ? 'Không có chỗ cho ảnh, sẽ mất ảnh' : '';
    else why = (L === 'T6' || (L === 'T4' && (k === 'questions' || k === 'passage'))) ? '' : 'Cần có ảnh';
    if ((k === 'questions' || k === 'passage') && L === 'T4' && t.answer.attach !== 'item') why = 'Cần đáp án theo từng câu';
    r[L] = why;
  }
  return r;
}
function layoutOf(t) { const L = t.layout.task; if (L !== 'auto' && !layoutReasons(t)[L]) return L; return autoLayout(t); }
function colsDefault(t, L) { if (L === 'T5') return (t.content.variant === 'multi' || cellDirOf(t) === 'row') ? 1 : 3; return 1; }
function colsRange(t, L) { const max = AGE[ws.age].maxCols; if (L === 'T5') return t.content.variant === 'multi' ? [1, 2] : cellDirOf(t) === 'row' ? [1, Math.min(2, max)] : [2, max]; if (L === 'T6') return [1, 2]; return null; }
function colsOf(t) { const L = layoutOf(t), rg = colsRange(t, L); if (!rg) return 1; const c = t.layout.cols ?? colsDefault(t, L); return Math.min(rg[1], Math.max(rg[0], c)); }
const T7CW = [40, 20, 40];
function rmeta(t, L) { if (L === 'T4' && t.answer && t.answer.layout === 'A6') return ck(t) === 'passage' ? { ratio: 60, range: [40, 90] } : { ratio: 80, range: [50, 90] }; return (L === 'T6' && t.wordBank && t.wordBank.placement === 'right') ? { ratio: 62, range: [40, 80] } : TL[L]; }
function ratioOf(t) { const L = layoutOf(t); if (L === 'T7') return null; const m = rmeta(t, L); if (!m.ratio) return null; const r = t.layout.split ?? m.ratio; return Math.min(m.range[1], Math.max(m.range[0], r)); }
function t7cw(t) { const c = t.layout.cw; return Array.isArray(c) && c.length === 3 && c.every(x => x != null) ? c : T7CW; }
// Hướng ô của T5 (bài item đơn): 'col' ảnh trên chữ, 'row' ảnh trái chữ phải. Mặc định: item có lines[] thì 'row', còn lại 'col'.
function cellDirOf(t) {
  if (ck(t) !== 'items' || t.content.variant === 'multi' || layoutOf(t) !== 'T5') return null;
  const d = t.layout.dir; if (d === 'col' || d === 'row') return d;
  return its(t).some(it => it.lines) ? 'row' : 'col';
}
const dirDefault = t => its(t) && its(t).some(it => it.lines) ? 'row' : 'col';
const cellImgMode = t => ck(t) === 'items' && layoutOf(t) === 'T5';
const hasFitImages = t => !!t.image;
const isColI = t => ['T2', 'T3'].includes(layoutOf(t));
const frOf = t => t.layout.frame || {};
function fitOf(t) { return t.image ? (frOf(t).fit || null) : null; }
const IW8 = [25, 60, 40];
// T5: mỗi ảnh (và mỗi ô chữ ở Ảnh trái) là một container, cấu hình riêng ở layout.cells[khóa]
const cellCfg = (t, k) => (t.layout.cells && t.layout.cells[k]) || {};
const cellFr = (t, k) => cellCfg(t, k).frame || {};
const cellSplit = cc => Math.min(50, Math.max(15, cc.split ?? 25));
function cellKeys(t, kind) {
  if (!cellImgMode(t)) return [];
  const L = its(t);
  if (kind === 'crow') return cellDirOf(t) === 'row' ? L.map(it => it.id) : [];
  return t.content.variant === 'multi' ? L.flatMap(it => it.imgs.map((_, j) => `${it.id}.${j}`)) : L.map(it => it.id);
}
// Khóa từng đáp án (ghi đè theo câu)
function itemKeys(t) { const k = ck(t); if (k === 'table' || k === 'empty') return []; if (k === 'dialogue') return its(t).filter(x => (x.text || '').includes('___')).map(x => x.id); if (k === 'pairs') return its(t).filter(x => x.pair && x.pair.l).map(x => x.id); return its(t).map(x => x.id); }
function labelOf(t, k) {
  const [a, b] = String(k).split('.'), ks = itemKeys(t), i = ks.indexOf(a);
  return (i >= 0 ? i + 1 : a) + (b != null ? '.' + (+b + 1) : '');
}
const VA = { top: 'Trên', center: 'Giữa', bottom: 'Dưới' };
const HA = { left: 'Trái', center: 'Giữa', right: 'Phải' };
function prune(o) { if (!o || typeof o !== 'object' || Array.isArray(o)) return o; Object.keys(o).forEach(k => { const v = o[k]; if (v == null) delete o[k]; else if (typeof v === 'object' && !Array.isArray(v)) { prune(v); if (!Object.keys(v).length) delete o[k]; } }); return o; }
function tidy(t) {
  const L = t.layout; L.frame = prune(L.frame || {});
  if (L.cells) { prune(L.cells); if (!Object.keys(L.cells).length) L.cells = null; }
  if (Array.isArray(L.cw) && L.cw.every(x => x == null)) L.cw = null;
  if (L.table) { if (L.table.rhs) { prune(L.table.rhs); if (!Object.keys(L.table.rhs).length) L.table.rhs = null; } }
  prune(t.answer.params = t.answer.params || {});
  if (t.wordBank) ['w', 'align', 'valign'].forEach(k => { if (t.wordBank[k] == null) delete t.wordBank[k]; });
}
function alignOf(t) { const L = layoutOf(t), a = frOf(t).align; if (!t.image) return null; if (L === 'T1') return a || 'center'; if (L === 'T8') return a === 'left' ? 'left' : 'right'; if (L === 'T4') return a || null; return null; }
const arNum = a => { if (!a) return 4 / 3; if (typeof a === 'number') return a; const [x, y] = String(a).split('/').map(Number); return y ? x / y : x || 4 / 3; };
// Container G1 = khung ảnh. Chiều cao mặc định ở chế độ Fit = chiều cao ảnh lúc Bình thường.
function frameH(t) {
  const f = fitOf(t); if (!f || (f === 'height' && isColI(t))) return null;
  const fr = frOf(t); if (fr.h) return fr.h;
  const L = layoutOf(t); if (!['T1', 'T4'].includes(L)) return null;
  const sc = fr.scale || 100, w = ((t.image.size === 'large' && L === 'T1') ? 150 : 80) * sc / 100;
  return +(w / arNum(t.image.ar)).toFixed(1);
}
function imgStyle(t) {
  const f = fitOf(t), fr = frOf(t); let o = '';
  if (layoutOf(t) === 'T8' && t.image) o += `;--iw:${fr.w ?? IW8[2]}`;
  if (t.image) o += `;--iar:${natAr(t, 'G1') || t.image.ar}`;
  if (!f) return o;
  if (frameH(t)) o += `;--ih:${frameH(t)}`;
  else if (layoutOf(t) !== 'T8') o += `;--car:${(arNum(t.image.ar) * 100 / (fr.scale || 100)).toFixed(3)}`;
  o += `;--ox:${fr.ox || 0};--oy:${fr.oy || 0};--z:${(fr.zoom || 100) / 100}`;
  return o;
}
function tplOf(t) { const L = layoutOf(t); if (L === 'T7') { const c = t7cw(t); return `${c[0]}fr ${c[1]}fr ${c[2]}fr`; } const r = ratioOf(t); if (r == null) return '1fr'; return `${r}fr ${100 - r}fr`; }
// Phiếu: preset gọn/vừa/thoáng, hoặc 'free' (Tự do) khi người dùng nhập tay: overrides giữ đủ 5 giá trị. Task cũng vậy.
function sheetSpacing() { return Object.assign({}, PRESETS[ws.spacing.preset] || PRESETS.compact, ws.spacing.overrides); }
function inheritedSpacing(t) { return Object.assign(sheetSpacing(), PRESETS[t.spacing.preset] || {}); }
function spacingOf(t) { return Object.assign(inheritedSpacing(t), t.spacing.overrides); }
// Nối vào Task trên (layout.break = 'join'): phần tiếp của Task phía trên, không số / tiêu đề. Task đầu phiếu không nối được.
const isJoined = t => !!t && t.layout && t.layout.break === 'join' && ws.tasks.indexOf(t) > 0;
const gapOf = t => isJoined(t) ? spacingOf(t).groupGap : spacingOf(t).gapTask;
function attachOpts(t) {
  const a = t.answer, q = ck(t) === 'questions';
  const gap = ck(t) === 'dialogue' || ((q || ck(t) === 'passage') && its(t).some(x => (x.text || '').includes('___')));   // v101: câu của Task có bài đọc cũng có chỗ trống ngay trong câu
  if (a.kind === 'word') return [...(gap ? ['inline'] : []), 'item', ...(q ? ['block'] : [])];
  if (a.kind === 'sentence') return ['item', ...(q ? ['block'] : [])];
  if (a.kind === 'choice') { const o = []; if (q && its(t).some(x => x.opts)) o.push('item'); if (hasMarkup(t)) o.push('inline'); return o.length ? o : [a.attach]; }
  return [a.attach];
}
const KIND_A = { word: ['A2', 'A3'], sentence: ['A1', 'A2'], choice: ['A4'], tick: ['A5'], tf: ['A6'], match: ['A7'], trace: ['A8'], none: [] };
// Mọi kiểu A của loại đáp án; att = chế độ gắn dùng được (giữ chế độ hiện tại nếu được), null = không dùng được
function aChoices(t) {
  const a = t.answer, att = attachOpts(t);
  return (KIND_A[a.kind] || []).map(A => {
    const fits = x => alOpts({ answer: Object.assign({}, a, { attach: x }) }).includes(A);
    return { A, att: att.includes(a.attach) && fits(a.attach) ? a.attach : (att.find(fits) || null) };
  });
}
function alOpts(t) {
  const a = t.answer; if (a.attach === 'inline') return a.kind === 'choice' ? ['A4'] : ['A2'];
  return ({ word: ['A2', 'A3'], sentence: ['A1', 'A2'], choice: ['A4'], tick: ['A5'], tf: ['A6'], match: ['A7'], trace: ['A8'], none: [] })[a.kind] || [];
}
// Tham số đáp án của một câu = tham số chung + phần ghi đè của câu đó
function pOf(t, item) { const p = t.answer.params || {}, k = item && typeof item === 'object' ? item.id : null, o = k && p.perItem && p.perItem[k]; return o ? Object.assign({}, p, o) : p; }

/* ================= Render HTML phiếu ================= */
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
/* Ký hiệu chữ (v80): **đậm**, *nghiêng*, <u>gạch chân</u> (lồng nhau được). Nhận chuỗi ĐÃ esc. Dấu không đủ cặp thì giữ nguyên là chữ.
   pw = bọc từng từ (dùng trong hàng flex của a2inline, nơi mỗi từ là một ô riêng). */
function rich(h, pw) {
  const re = /\*\*|\*|&lt;u&gt;|&lt;\/u&gt;/g, tk = []; let m, p = 0;
  while ((m = re.exec(h))) { if (m.index > p) tk.push({ s: h.slice(p, m.index) }); const r = m[0]; tk.push({ r, m: r === '**' ? 'b' : r === '*' ? 'i' : 'u', open: r === '&lt;u&gt;' ? true : r === '&lt;/u&gt;' ? false : null }); p = re.lastIndex; }
  if (!tk.some(x => x.m)) return h;
  if (p < h.length) tk.push({ s: h.slice(p) });
  const txt = (i, end) => !tk[i] ? false : tk[i].s == null ? true : (end ? /\S$/.test(tk[i].s) : /^\S/.test(tk[i].s));   // kề dấu khác thì coi như dính chữ
  ['b', 'i'].forEach(k => {      // ghép từng cặp mở / đóng; mở phải dính chữ phía sau, đóng phải dính chữ phía trước
    const ix = tk.map((x, i) => x.m === k ? i : -1).filter(i => i >= 0);
    for (let j = 0; j + 1 < ix.length; j += 2) if (txt(ix[j] + 1) && txt(ix[j + 1] - 1, true)) { tk[ix[j]].ok = true; tk[ix[j]].open = true; tk[ix[j + 1]].ok = true; tk[ix[j + 1]].open = false; }
  });
  let depth = 0; tk.forEach(x => { if (x.m !== 'u') return; if (x.open) depth++; else if (depth) { depth--; x.ok = true; } else x.ok = false; });
  let need = 0; for (let i = tk.length - 1; i >= 0; i--) { const x = tk[i]; if (x.m !== 'u') continue; if (!x.open) { if (x.ok) need++; } else if (need) { need--; x.ok = true; } }
  tk.forEach(x => { if (x.m === 'u' && x.open && x.ok == null) x.ok = false; if (x.m === 'u' && !x.open && x.ok == null) x.ok = false; });
  const st = { b: 0, i: 0, u: 0 }; let out = '';
  const wrap = x => { if (!x || x === '\u0002') return x; let o = x; if (st.u) o = `<u>${o}</u>`; if (st.i) o = `<i>${o}</i>`; if (st.b) o = `<b>${o}</b>`; return o; };
  tk.forEach(x => {
    if (x.m && x.ok) { st[x.m] = x.open ? 1 : 0; return; }
    const t = x.m ? x.r : x.s;
    out += pw ? t.split(/(\s+)/).map(y => /^\s*$/.test(y) ? y : wrap(y)).join('') : wrap(t);
  });
  return out;
}
const er = s => rich(esc(pkPre(s)));
const SCENE = 'data:image/svg+xml,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 36'><rect width='48' height='36' fill='#cfe3ee'/><circle cx='37' cy='9' r='5' fill='#f1c35a'/><path d='M0 36 L14 15 L25 28 L32 21 L48 36Z' fill='#a3c9ac'/><path d='M0 36 L9 25 L18 36Z' fill='#86b592'/><rect x='.4' y='.4' width='47.2' height='35.2' fill='none' stroke='#8fb0c2' stroke-width='.8'/></svg>");
// Ô giữ chỗ: khung đúng tỉ lệ, ghi tỉ lệ (ảnh thật thay vào thì lấy tỉ lệ thật)
const PHC = {};
function PH(ar) { const a = String(ar || '4/3'); if (PHC[a]) return PHC[a]; const v = arNum(a) || 4 / 3, W = 48, H = +(W / v).toFixed(2), m = Math.min(W, H);
  return PHC[a] = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}'><rect width='${W}' height='${H}' fill='#eef2f5'/><g transform='translate(${W / 2 - m * .14} ${H / 2 - m * .12}) scale(${m * .28 / 24})' fill='none' stroke='#9fb1bf' stroke-width='1.6' stroke-linejoin='round'><rect x='1' y='2' width='22' height='16' rx='2.5'/><circle cx='16.5' cy='7' r='2'/><path d='M2 16 L9 9 L14 14 L17 11 L22 16'/></g></svg>`); }
const pic = (label, cls = '', src, o = {}) => `<div class="pic ${cls}${src ? ' up' : ' ph'}"${o.slot ? ` data-slot="${o.slot}"` : ''}${o.ar ? ` style="--par:${o.ar};--ar:${o.ar}"` : ''}><img src="${src || PH(o.ar || o.gar)}" alt="${esc(label)}">${src ? '' : `<span class="pic-ar">${arLabel(o.ar || o.gar || '4/3')}</span><span class="pic-cap">${esc(label)}</span>`}</div>`;
// Container ảnh của một ô T5 (khung riêng: Fit, chiều cao, zoom, tâm, căn ngang)
function ci(t, key, label, src) {
  const f = cellFr(t, key);
  return `<div class="ci" data-node="${t.id}:G1:${key}" data-ck="${key}"${f.fit ? ` data-cf="${f.fit}"` : ''}${f.h ? ' data-cih="1"' : ''}${f.align ? ` data-fa="${f.align}"` : ''}${f.w ? ` data-cw="1"` : ''} style="${f.w ? `--cw:${f.w}%;` : ''}--iar:${natAr(t, '@' + key) || tblAr(t)};--ih:${f.h || 35};--ox:${f.ox || 0};--oy:${f.oy || 0};--z:${(f.zoom || 100) / 100}">${pic(label, '', src, { slot: '@' + key, ar: imgArOf(t, '@' + key) })}</div>`;
}
// Các ô ảnh của một Task, theo thứ tự: G1 rồi ảnh item / ảnh cột trái bài nối
function slotsOf(t) {
  const k = ck(t), out = [];
  if (t.image) { out.push({ key: 'G1', label: t.image.label }); if (t.image.two) out.push({ key: 'G1b', label: t.image.label2 || 'ảnh 2' }); }
  if (t.wordBank && t.wordBank.kind === 'image' && k !== 'empty') t.wordBank.words.forEach((w, i) => out.push({ key: 'B.' + i, label: w || 'ảnh ' + (i + 1) }));
  if (k === 'items') its(t).forEach(it => { if (it.imgs) it.imgs.forEach((im, j) => out.push({ key: `@${it.id}.${j}`, label: im })); else if (it.img) out.push({ key: '@' + it.id, label: it.img }); });
  if (k === 'pairs') its(t).forEach(x => { const l = x.pair && x.pair.l; if (l && l.img) out.push({ key: '@' + x.id, label: l.img }); });
  if (k === 'table') (t.content.rows || []).forEach(r => { if (!r.id) return;
    if (r.head && typeof r.head === 'object' && r.head.img) out.push({ key: '@' + r.id, label: r.head.img });
    (r.cells || []).forEach((v, j) => { if (v && typeof v === 'object' && v.img) out.push({ key: `@${r.id}.${j}`, label: v.img }); }); });
  (t.extras || []).forEach(x => { if (x.kind === 'image') gtKeys(x).forEach((key, j) => out.push({ key, label: (x.label || 'ảnh') + (gtN(x) > 1 ? ' ' + (j + 1) : '') })); });
  return out;
}
const srcOf = (t, key) => (t.uploads || {})[key];
const xOfKey = (t, key) => key[0] === '@' ? (t.extras || []).find(x => x.kind === 'image' && x.id === key.slice(1).split('~')[0]) : null;
// v84: khối ảnh tự do có thể nhiều ảnh cạnh nhau (x.n = 2..4); ảnh thứ j (j ≥ 1) có khóa '@<id>~<j>'
const gtN = x => Math.min(4, Math.max(1, x.n || 1));
const gtKeys = x => Array.from({ length: gtN(x) }, (_, j) => '@' + x.id + (j ? '~' + j : ''));

// Hướng xếp đáp án A4: theo từng câu (perItem) > chung (dir). 'auto' = ngắn thì một hàng cột đều, dài thì mỗi đáp án một dòng.
const A4DIRS = { auto: 'Tự động', h: 'Ngang', g2: '2 cột', v: 'Dọc', fl: 'Tự xuống dòng' };
const a4autoDef = () => Math.round(22 * 14 / fontPt());
function a4autoMax(t) { const p = t.answer.params || {}; return p.autoMax || a4autoDef(); }
function a4dir(t, item) {
  const p = pOf(t, item); let d = p.dir || 'auto';
  if (d === 'auto') {
    // Tự động (v77): quá dài thì xếp dọc; vừa một hàng cột đều thì Ngang; còn lại Tự xuống dòng (không gãy chữ trong ô).
    const ml = Math.max(0, ...its(t).flatMap(i => (i.opts || []).map(o => String(o).replace(/<[^>]*>|\*+/g, '').length))), n = Math.max(0, ...its(t).map(i => (i.opts || []).length));   // v106: đo chữ thật, không tính thẻ <u> / ** (đáp án gạch chân bị coi là dài nên xuống dòng lệch cột)
    d = ml > a4autoMax(t) ? 'v' : n * (ml * fontPt() * 0.3528 * 0.5 + 14) <= 150 ? 'h' : 'fl';
  }
  return d === 'h' ? 'h' : d;
}
// Mặc định căn ngang của đáp án theo chỗ đặt
function ansAlignDef(t) { const L = layoutOf(t); if (L === 'T4' || L === 'T7' || t.content.variant === 'multi') return 'center'; if (L === 'T5' && t.layout.align) return t.layout.align; return 'left'; }
// v81: câu ví dụ hiện sẵn đáp án (key) trong chỗ trả lời
// v95: Q2 viết câu với gạch tính từ câu hỏi (điểm bắt đầu cuối câu / dòng dưới, chiều dài cố định / hết dòng, số hàng): dùng bộ dựng a2inline trên "câu + ___"
const q2end = t => t.answer.kind === 'sentence' && t.answer.layout === 'A2' && t.answer.attach === 'item' && !!(t.answer.params || {}).lenMode && qOf(t) === 'Q2';
function q2cfg(t) {
  const p = t.answer.params || {};
  if (t.answer.layout === 'A1') return { start: 'below', len: 'fill', mm: p.lenMm || A2MM[ws.age] || 35, lines: Math.max(1, p.lines || 1) };
  const c = a2cfg(t, null); return { start: c.start === 'below' ? 'below' : 'end', len: c.mode === 'fill' ? 'fill' : 'fixed', mm: c.mm, lines: c.lines };
}
function q2set(t, patch) {
  const c = Object.assign(q2cfg(t), patch), p = t.answer.params = Object.assign({}, t.answer.params || {});
  t.answer.layout = 'A2'; t.answer.attach = 'item';
  p.lenMode = c.len === 'fill' ? 'fill' : 'fixed'; p.lenMm = Math.min(150, Math.max(15, c.mm)); p.lines = Math.min(20, Math.max(1, c.lines)); p.start = c.start === 'below' ? 'below' : 'inline';
  delete p.width; delete p.frame; delete p.boxH;
}
function ans(t, item) { if (item && typeof item === 'object' && !item.gt && q2end(t)) return ''; const h = ans0(t, item); return item && typeof item === 'object' && item.ex && String(item.key ?? '').trim() ? exFill(t, item, h) : h; }
// v86 (F2): một câu có thể có nhiều đáp án đúng, ghi "a, c" (hoặc chữ của lựa chọn, cách nhau dấu phẩy)
function optsOfKey(t, x) { if (x.imgs) return x.imgs; if (x.opts) return x.opts; if (t.answer.layout === 'A6') return [...ans0(t, x).matchAll(/<span>([^<]*)<\/span>/g)].map(m => m[1]); return []; }
const keyParts = item => String(item.key ?? '').split(/\s*[,;]\s*/).map(x => x.trim()).filter(Boolean);
// v90: thứ tự xáo vế phải bài nối: cố định theo mã Task + số lần "Xáo lại", tránh để vế nào đứng yên chỗ
function pairPerm(t, n) {
  const idx = [...Array(n).keys()]; if (n < 2) return idx;
  let h = 2166136261; String(t.id + ':' + (t.content.shufSeed || 0)).split('').forEach(ch => { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }); h = h || 1;
  const rnd = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296; };
  for (let k = 0; k < 30; k++) { for (let i = n - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; } if (idx.every((v, i) => v !== i)) break; }
  return idx;
}
// v91: câu nhiều chỗ trống: key = đáp án từng chỗ, cách nhau " | "
const gapN = x => (pkSrc(x).match(/___/g) || []).length;
const keyGaps = x => String(x.key ?? '').split(/\s*\|\s*/).map(v => v.trim());
// v88: câu nào cần đáp án đúng (trừ tô theo nét, viết tự do, bảng, dòng chữ), câu nào đã có
function needKey(t, x) { if (!x || x.gt) return false; const k = ck(t), a = t.answer; if (['table', 'empty', 'trace'].includes(k) || ['none', 'trace'].includes(a.kind) || isFreeW(t)) return false; if (k === 'pairs') return !!(x.pair && x.pair.l && x.pair.r); if (k === 'dialogue') return !!x.ex || /___|\{[^{}|]+\|/.test(x.text || ''); return true; }
function hasKey(t, x) { if (ck(t) === 'pairs') return !!t.content.shuffle; if (!x.opts && !x.imgs && gapN(x) > 1) { const g = keyGaps(x); return Array.from({ length: gapN(x) }, (_, j) => g[j] || '').every(Boolean); } const gs = x.opts || x.imgs ? [] : pkGroups(x); if (gs.length) return gs.every(g => g.some(o => o.ok)) || String(x.key ?? '').trim() !== ''; const op = optsOfKey(t, x); if ((x.opts || x.imgs || t.answer.layout === 'A6') && op.length > 1) return exPicks(t, x, op).length > 0; return String(x.key ?? '').trim() !== ''; }
function keyState(t) { const need = [], miss = []; its(t).forEach((x, i) => { if (needKey(t, x)) { need.push(i); if (!hasKey(t, x)) miss.push(i); } }); return { need, miss }; }
function exPicks(t, item, opts) { const r = []; keyParts(item).forEach(k => { const i = exPick(t, { key: k }, opts); if (i >= 0 && !r.includes(i)) r.push(i); }); if (!r.length) { const i = exPick(t, item, opts); if (i >= 0) r.push(i); } return r; }
function exPick(t, item, opts) { const k = String(item.key).trim(), L = k.toLowerCase(); if (/^[a-h]$/i.test(k) && opts.length > 1 && !opts.some(o => String(o).trim().toLowerCase() === L)) return 'abcdefgh'.indexOf(L); return opts.findIndex(o => String(o).replace(/<[^>]+>|\*/g, '').trim().toLowerCase() === L); }
function exFill(t, item, h) {
  const k = esc(String(item.key).trim()), A = t.answer.layout, ek = `<span class="exk">${k}</span>`;
  if (A === 'A1') return h.replace('<div class="ln"></div>', `<div class="ln">${ek}</div>`);
  if (A === 'A2') { const g = keyGaps(item); let j = 0; return g.length > 1 ? h.replace(/(<span class="a a2"[^>]*>)(<\/span>)/g, (m, a, b) => `${a}<span class="exk">${esc(g[j++] || '')}</span>${b}`) : h.replace(/(<span class="a a2"[^>]*>)(<\/span>)/, `$1${ek}$2`); }
  if (A === 'A3') { const ch = [...String(item.key).trim().replace(/\s+/g, '')]; let j = 0; return h.replace(/<i><\/i>/g, () => `<i>${ch[j] ? `<span class="exk">${esc(ch[j++])}</span>` : (j++, '')}</i>`); }
  if (A === 'A4') { const ix = exPicks(t, item, item.opts || []); let n = -1; return !ix.length ? h : h.replace(/<span class="opt">/g, m => (ix.includes(++n) ? '<span class="opt pk">' : m)); }
  if (A === 'A5') return h.replace('class="a a5"', 'class="a a5 pk"');
  if (A === 'A6') { const L = String(item.key).trim().toLowerCase(), al = { true: 't', false: 'f', 'đúng': 't', 'sai': 'f', yes: 'yes', no: 'no' }[L] || L; return h.replace(/<span>([^<]*)<\/span>/g, (m, x) => (x.toLowerCase() === al || x.toLowerCase() === L) ? `<span class="pk">${x}</span>` : m); }
  return h;
}
// Câu nhiều ảnh lựa chọn (Q7): chỉ ô của ảnh đúng trong câu ví dụ được tích sẵn (✓)
function ansI(t, item, j) { const h = ans0(t, item); return item.ex && String(item.key ?? '').trim() && t.answer.layout === 'A5' ? (exPicks(t, item, item.imgs || []).includes(j) ? h.replace('class="a a5"', 'class="a a5 pk"') : h) : h; }
function ans0(t, item) {
  const a = t.answer, p = pOf(t, item), age = AGE[ws.age], key = item && typeof item === 'object' ? item.id : null;
  const nd = `data-node="${t.id}:G3${key ? ':' + key : ''}"${p.align ? ` data-aa="${p.align}"` : ''}`;
  const lh = Math.max(p.lineMm || age.line, age.line), aw = p.w ? `;--aw:${p.w}` : '', as = p.size ? ` style="--as:${p.size}mm"` : '';
  switch (a.layout) {
    case 'A1': if (p.frame === 'box') return `<div class="a a1 abox" ${nd} style="--bh:${p.boxH || 80}mm${aw}"></div>`;
      return `<div class="a a1${p.ruling === '4' ? ' r4' : ''}" ${nd} style="--lh:${lh}mm${aw}">${'<div class="ln"></div>'.repeat(p.lines || 1)}</div>`;
    case 'A2': { const w = p.lenMode ? (a2cfg(t, item).mm + 'mm') : ((p.width || (item && item.len ? item.len + 4 : 10)) + 'ch');
      return `<span class="a a2" ${nd} style="width:${w}${p.width && !p.lenMode ? ' !important' : ''}"></span>`; }
    case 'A3': return `<span class="a a3" ${nd}${p.boxW ? ` style="--bw:${p.boxW}mm"` : ''}>${'<i></i>'.repeat((item && item.len) || p.boxes || 6)}</span>`;
    case 'A4': { const d = a4dir(t, item), os = item.opts || [], up = p.upper ? 'ABCD' : 'abcd';
      return `<div class="a a4 ${d}" ${nd} style="--oc:${d === 'g2' ? 2 : os.length}${p.gap != null ? `;--og:${p.gap}mm` : ''}">${os.map((o, i) => `<span class="opt">${p.lab === 'circle' ? `<b>${up[i]}</b>` : p.lab === 'box' ? '<b class="bx"></b>' : `<i>${up[i]}.</i>`}<span>${er(o)}</span></span>`).join('')}</div>`; }
    case 'A5': return `<span class="a a5" ${nd}${as}></span>`;
    case 'A6': { const lb = Array.isArray(p.labs) && p.labs.length >= 2 ? p.labs.slice(0, 3) : null; return `<span class="a a6${lb ? ' lb' : ''}" ${nd}${as}>${(lb || ['T', 'F']).map(x => `<span>${esc(x)}</span>`).join('')}</span>`; }
    case 'A7': return `<span class="a a7" ${nd}${as}></span>`;
    case 'A8': return `<div class="a a8${p.ruling === '4' ? ' r4' : ''}" ${nd} style="--lh:${lh}mm${aw}">${`<span>${esc(item && typeof item === 'object' ? item.text : item)}</span>`.repeat(p.repeat || 3)}</div>`;
  }
  return '';
}
// A2 (ô trống): độ dài hết lề phải / cố định (mm), số dòng, vị trí dòng đầu (cạnh chữ / hàng dưới).
const A2MM = { '5-6': 40, '7-9': 35, '10-12': 30 };
function a2cfg(t, item) {
  const p = pOf(t, item), mode = p.lenMode || 'legacy';
  return { mode, mm: p.lenMm || A2MM[ws.age] || 35, lines: Math.max(1, p.lines || 1), start: p.start === 'below' ? 'below' : 'inline', ch: p.width };
}
// Chỗ trống cuối câu (sau nó chỉ còn dấu câu) mới kéo dài / nhiều dòng được; chỗ trống giữa câu luôn là gạch cố định.
function a2end(raw) { const i = raw.lastIndexOf('___'); return i >= 0 && /^\s*[.?!…:,;]*\s*$/.test(raw.slice(i + 3)); }
function a2inline(t, raw, num, item) {
  const c = a2cfg(t, item), key = item && item.id, nd = `data-node="${t.id}:G3${key ? ':' + key : ''}"`, parts = raw.split('___'), last = parts.length - 2;
  const fixedW = c.mode === 'legacy' ? `${(c.ch || 10)}ch` : `${c.mm}mm`;
  const fixedBlank = () => `<span class="a a2" ${nd} style="width:${fixedW}"></span>`;
  const lab = () => num ? `(${num()}) ` : '';
  const eligible = a2end(raw) && (c.mode === 'fill' || c.lines > 1 || c.start === 'below');
  if (!eligible) return parts.reduce((a, part, i) => a + (i ? lab() + fixedBlank() : '') + er(part).replace(/\n/g, '<br>'), '');
  // chỗ trống cuối câu: dựng hàng flex để gạch kéo dài hết phần còn lại của dòng cuối
  const tok = '\u0001', head = parts.slice(0, -1).map((x, i) => rich(esc(x), true).replace(/\s*\n\s*/g, ' \u0002 ') + (i < last ? lab() + tok : '')).join('');
  const words = head.split(/\s+/).filter(Boolean).map(w => w === '\u0002' ? '<span class="brk"></span>' : `<span class="w">${w.split(tok).join(fixedBlank())}</span>`);
  const tail = parts[parts.length - 1].trim(), keepTail = /[?!:…]/.test(tail) ? tail.replace(/[.,;]/g, '') : '';
  const label = lab();
  let row = words.join(''), extra = c.lines - 1;
  if (c.start === 'inline') {
    row += label ? `<span class="w">${label.trim()}</span>` : '';
    row += c.mode === 'fill' ? `<span class="a fl" ${nd}></span>` : `<span class="a a2 nofl" ${nd} style="width:${fixedW}"></span>`;
    row += tail ? `<span class="w tl">${esc(tail)}</span>` : '';
  } else { extra = c.lines; if (label) row += `<span class="w">${label.trim()}</span>`; if (keepTail) row += `<span class="w tl">${esc(keepTail)}</span>`; }
  const xl = Array.from({ length: Math.max(0, extra) }, () => `<span class="a xl" ${nd} style="${c.mode === 'fill' ? '' : `width:${c.mm}mm;`}--lh2:${AGE[ws.age].line}mm"></span>`).join('');
  return `<span class="a2box"><span class="fr">${row}</span>${xl}</span>`;
}
// A4 trong câu: {a|b|c} trong text hiện thành "a / b / c", mỗi lựa chọn in đậm. Chỉ áp khi answer.attach = inline và layout A4.
const CHOICE_RE = /\{([^{}|]+(?:\|[^{}|]+)+)\}/g;
const hasChoiceMarkup = s => /\{[^{}|]+(?:\|[^{}|]+)+\}/.test(s);
function choiceTexts(t) { const k = ck(t); if (k === 'items') return its(t).flatMap(it => [...(it.lines || []), it.text || '']); if (k === 'questions') return its(t).map(x => x.text || ''); return []; }
const hasMarkup = t => choiceTexts(t).some(hasChoiceMarkup) || !!((t.answer.params || {}).ulab && choiceTexts(t).some(x => /<u>/.test(x)));
// v89: vế đúng của chọn trong câu đánh dấu * ngay trong nhóm: {*goes|go}. Trước khi qua rich() đổi * thành \u0003 để không thành chữ nghiêng
const PK_STAR = /^(\s*)\*(?!\*)/;
const pkPre = s => String(s).replace(/\{([^{}|]+(?:\|[^{}|]+)+)\}/g, (m, g) => '{' + g.split('|').map(o => o.replace(PK_STAR, '$1\u0003')).join('|') + '}');
const pkB = o => { const ok = o.includes('\u0003'); return `<b${ok ? ' class="ok"' : ''}>${o.replace(/\u0003/g, '').trim()}</b>`; };
const pkSrc = x => [x.text || '', ...(Array.isArray(x.lines) ? x.lines.map(l => typeof l === 'string' ? l : (l && l.text) || '') : [])].join('\n');
function pkGroups(x) { return [...pkSrc(x).matchAll(/\{([^{}|]+(?:\|[^{}|]+)+)\}/g)].map(m => m[1].split('|').map(o => ({ t: o.replace(PK_STAR, '$1').trim(), ok: PK_STAR.test(o) }))); }
function pkToggle(x, g, j) {
  let n = -1; const f = s => String(s).replace(/\{([^{}|]+(?:\|[^{}|]+)+)\}/g, (m, grp) => ++n !== g ? m : '{' + grp.split('|').map((o, k) => k !== j ? o : PK_STAR.test(o) ? o.replace(PK_STAR, '$1') : o.replace(/^(\s*)/, '$1*')).join('|') + '}');
  if (x.text != null) x.text = f(x.text);
  if (Array.isArray(x.lines)) x.lines = x.lines.map(l => typeof l === 'string' ? f(l) : l && l.text != null ? Object.assign(l, { text: f(l.text) }) : l);
}
// Phiếu cũ: key là chữ của vế đúng → đổi sang dấu * khi khớp đúng một vế ở mỗi nhóm; còn nhóm không khớp thì giữ key
function pkMig(t) {
  (t.content && t.content.items || []).forEach(x => {
    const k = String(x.key ?? '').trim(); if (!k || x.opts || x.imgs) return; const gs = pkGroups(x); if (!gs.length || gs.some(g => g.some(o => o.ok))) return;
    const parts = keyParts(x).map(v => v.toLowerCase()); let all = true;
    gs.forEach((g, gi) => { const hit = g.map((o, j) => parts.includes(o.t.toLowerCase()) ? j : -1).filter(j => j >= 0); if (hit.length === 1) pkToggle(x, gi, hit[0]); else all = false; });
    if (all) { if (x.ex) x.key = ''; else delete x.key; }
  });
}
function inlChoice(t, escaped) {
  return escaped.replace(CHOICE_RE, (m, g) => `<span class="a a4i" data-node="${t.id}:G3">${g.split('|').map(pkB).join('&nbsp;/ ')}</span>`);
}
function qtext(t, q) {
  let h = qtext0(t, q); const p = t.answer.params || {};
  if (p.ulab && t.answer.kind === 'choice') { let n = 0; h = h.replace(/<u>([\s\S]*?)<\/u>/g, (m, x) => `<span class="ulb"><u>${x}</u><i>${(p.upper ? 'ABCDEFGH' : 'abcdefgh')[n++] || ''}</i></span>`); }
  if (q && q.ex && t.answer.attach === 'inline' && t.answer.layout === 'A4') h = h.replace(/<b class="ok">/g, '<b class="pk">');   // v89: câu ví dụ khoanh sẵn vế có *
  h = h.replace(/<b class="ok">/g, '<b>').replace(/\u0003/g, '');
  if (q && q.ex && p.ulab && String(q.key ?? '').trim()) { const L = String(q.key).trim().toUpperCase(); h = h.replace(/<span class="ulb">([\s\S]*?)<i>([A-Ha-h])<\/i><\/span>/g, (m, u, c) => c.toUpperCase() === L ? `<span class="ulb pk">${u}<i>${c}</i></span>` : m); }
  if (q && q.ex && String(q.key ?? '').trim() && (t.answer.attach === 'inline' || q2end(t))) {
    const k = esc(String(q.key).trim());
    if (t.answer.layout === 'A4') { const L = k.toLowerCase(); h = h.replace(/<b>([^<]*)<\/b>/g, (m, x) => x.trim().toLowerCase() === L ? `<b class="pk">${x}</b>` : m); }
    else { const g = keyGaps(q); let j = 0; h = g.length > 1 ? h.replace(/(<span class="(?:a (?:a2|fl)[^"]*|gap)"[^>]*>)(<\/span>)/g, (m, a, b) => `${a}<span class="exk">${esc(g[j++] || '')}</span>${b}`) : h.replace(/(<span class="(?:a (?:a2|fl)[^"]*|gap)"[^>]*>)(<\/span>)/, `$1<span class="exk">${k}</span>$2`); }   // v91: nhiều chỗ trống
  }
  return h;
}
function qtext0(t, q) {
  const s = er(q.text || ''), br = h => h.replace(/\n/g, '<br>');   // câu nhiều dòng (dòng thụt lề trong MD): \n trong chữ câu là xuống dòng
  if (q && !q.gt && q2end(t)) return a2inline(t, String(q.text || '').replace(/\s+$/, '') + ' ___', null, q);
  if (t.answer.attach === 'inline' && t.answer.layout === 'A4') return br(inlChoice(t, s));
  if (t.answer.attach === 'inline' && (q.text || '').includes('___')) return t.answer.layout === 'A2' ? a2inline(t, q.text, null, q) : br(s.split('___').join(ans(t, q)));
  return br(s.replace(/___/g, '<span class="gap"></span>'));
}
/* ---- Ô chữ giải đố (v78): bảng có layout.table.cross = true. Ô: '' hoặc '#' = không có ô; '.' = ô trống chưa biết đáp án; 'A' = ô có đáp án A; '(A)' = chữ cho sẵn ---- */
function crossCell(v) { if (typeof v !== 'string') return { k: 'none' }; const x = v.trim(); if (!x || x === '#') return { k: 'none' }; if (x === '.') return { k: 'empty' }; const m = /^\((.)\)$/.exec(x); return m ? { k: 'given', ch: m[1] } : { k: 'ans', ch: x[0] }; }
function crossParse(lines) {
  const rows = lines.map(l => { const o = []; for (let i = 0; i < l.length; i++) { const ch = l[i]; if (ch === '(' && l[i + 2] === ')') { o.push('(' + l[i + 1] + ')'); i += 2; } else if (ch === '#' || /\s/.test(ch)) o.push(''); else o.push(ch); } return o; }), n = Math.max(1, ...rows.map(r => r.length));
  return rows.map(r => r.concat(Array(n - r.length).fill('')));
}
const crossLines = c => c.rows.map(r => r.cells.map(v => { const x = crossCell(v); return x.k === 'none' ? '#' : x.k === 'empty' ? '.' : x.k === 'given' ? '(' + x.ch + ')' : x.ch; }).join(''));
function crossCount(c) {
  const mat = c.rows.map(r => r.cells.map(crossCell)), a = (r, k) => !!(mat[r] && mat[r][k] && mat[r][k].k !== 'none'); let n = 0, ac = 0, dn = 0, cells = 0;
  mat.forEach((row, r) => row.forEach((x, k) => { if (x.k === 'none') return; cells++; const A = !a(r, k - 1) && a(r, k + 1), D = !a(r - 1, k) && a(r + 1, k); if (A) ac++; if (D) dn++; if (A || D) n++; }));
  return { cells, words: n, across: ac, down: dn };
}
function crossHtml(t) {
  const c = t.content, o = tblOpts(t), mat = c.rows.map(r => r.cells.map(crossCell)), n = c.cols.length, a = (r, k) => !!(mat[r] && mat[r][k] && mat[r][k].k !== 'none');
  let num = 0; const cells = [];
  mat.forEach((row, r) => row.forEach((x, k) => {
    if (x.k === 'none') { cells.push('<span class="xs"></span>'); return; }
    const st = (!a(r, k - 1) && a(r, k + 1)) || (!a(r - 1, k) && a(r + 1, k)), nn = st ? ++num : 0, show = x.k === 'given' || (o.key && x.k === 'ans');
    cells.push(`<span class="xc${x.k === 'given' ? ' gv' : ''}">${nn ? `<i class="xn">${nn}</i>` : ''}${show ? esc(x.ch.toUpperCase()) : ''}</span>`);
  }));
  const al = (t.layout.table || {}).align || 'center';
  return `<div class="g2 xg ${al === 'left' ? 'xl' : al === 'right' ? 'xr' : 'xm'}" data-node="${t.id}:G2" style="--xn:${n};--xc:${o.xc || 10}mm">${cells.join('')}</div>`;
}
const TBL_ROW_MM = 12;   // chiều cao hàng tối thiểu mặc định (mm), áp dụng cho mọi hàng kể cả hàng tiêu đề
const TBL_DEF = { head: true, rowHead: true, num: true, lines: 'all', fh: true, fc: false, fr: 'none', cols: 'first', first: 34, align: 'left', minH: null, repeat: true, split: true, rows: 'auto', cw: null, rhs: null };
const tblOpts = t => {
  const o = Object.assign({}, TBL_DEF, t.layout.table || {}), u = t.layout.table || {};
  o.nm = u.nm !== undefined ? u.nm : (u.num === false ? 'off' : 'out'); o.num = o.nm === 'out';
  if (o.fc) o.fr = 'none'; // đã tô cột đầu thì các hàng không tô
  return o;
};
function range(arr, frag) { const out = arr.map((x, i) => [x, i]); return frag ? out.slice(frag.a, frag.b + 1) : out; }
const JS = { left: 'start', center: 'center', right: 'end' };
const AI = { top: 'start', center: 'center', bottom: 'end' };

/* ---- Điểm trên ảnh chung (v76): image.marks = [{x,y}] theo % tọa độ ẢNH; image.mk = {shape:'circle'|'square', label:'num'|'none'} ---- */
let markMode = false;
function withMarks(t, h) {
  const im = t.image; if (!im || !Array.isArray(im.marks)) return h;
  const mk = im.mk || {}, sh = mk.shape === 'square' ? 'square' : 'circle', bl = mk.label === 'none';
  const dots = im.marks.map((m, i) => `<span class="mkd mk-${sh}${bl ? ' blank' : ''}" data-i="${i}" style="left:${m.x}%;top:${m.y}%">${bl ? '' : i + 1}</span>`).join('');
  return h.replace(/<\/div>$/, `<div class="mk">${dots}</div></div>`);
}
/* ---- G-Text: khối tự do của Task (v73). Chữ: đoạn, gạch đầu dòng (- ), số (1. ), **đậm**, *nghiêng* ---- */
const GT_SIZE = { s: 'Nhỏ', m: 'Vừa', l: 'To' };
const gtInline = x => er(x);
function gtBody(text) {
  let out = '', mode = null, para = [];
  const close = () => { if (para.length) { out += '<p>' + para.join('<br>') + '</p>'; para = []; } if (mode) { out += `</${mode}>`; mode = null; } };
  String(text || '').split('\n').forEach(raw => {
    const ln = raw.replace(/\s+$/, ''), ul = /^\s*[-*]\s+(.*)$/.exec(ln), ol = /^\s*(\d+)[.)]\s+(.*)$/.exec(ln);
    if (!ln.trim()) { close(); return; }
    if (ul || ol) { const m = ul ? 'ul' : 'ol'; if (para.length) close(); if (mode !== m) { close(); out += m === 'ol' && +ol[1] !== 1 ? `<ol start="${+ol[1]}">` : `<${m}>`; mode = m; } out += `<li>${gtInline(ul ? ul[1] : ol[2])}</li>`; return; }
    if (mode) close();
    para.push(gtInline(ln.trim()));
  });
  close(); return out;
}
const gtOf = (t, id) => (t.extras || []).find(x => x.id === id);
function gtHtml(t, x, where) {
  if (x.kind === 'image') { const n = gtN(x); return `<div class="gt gt-${where}" data-node="${t.id}:GT:${x.id}"${x.align ? ` data-ga="${x.align}"` : ''}><div class="gti${n > 1 ? ' gtm' : ''}" style="--gw:${x.w || (n > 1 ? 100 : 50)}%;--gn:${n}">${gtKeys(x).map(key => pic(x.label || 'ảnh', '', srcOf(t, key), { slot: key, ar: imgArOf(t, key) || '4/3' })).join('')}</div></div>`; }
  const empty = !String(x.text || '').trim(), sz = x.size && FSZ[ws.age][x.size] ? `font-size:${FSZ[ws.age][x.size]}pt` : '';
  return `<div class="gt gt-${where} gt-${x.frame || 'none'}${empty ? ' gt-empty' : ''}" data-node="${t.id}:GT:${x.id}"${x.align ? ` data-ga="${x.align}"` : ''}${x.cols === 2 ? ' data-gc="2"' : ''}${sz ? ` style="${sz}"` : ''}><div class="gtb">${empty ? 'Khối chữ trống (nhập ở cột trái)' : gtBody(x.text)}</div></div>`;
}
// Thứ tự gộp: [khối phía trên..., BÀI, khối phía dưới...]. Đổi chỗ = hoán vị trong danh sách này.
function gtOrder(t) { const ex = t.extras || []; return [...ex.filter(x => x.pos === 'top'), { body: 1 }, ...ex.filter(x => x.pos !== 'top')]; }
function gtMove(t, id, d) {
  const L = gtOrder(t), i = L.findIndex(x => x.id === id), j = i + d; if (i < 0 || j < 0 || j >= L.length) return false;
  [L[i], L[j]] = [L[j], L[i]]; const bi = L.findIndex(x => x.body); t.extras = [];
  L.forEach((x, k) => { if (x.body) return; x.pos = k < bi ? 'top' : 'bottom'; t.extras.push(x); }); return true;
}
// v97: Căn lề Khối text (hướng dẫn G0, bài đọc / lời dẫn G2, khối tự do chữ). Phiếu cũ: "Căn chữ bài đọc: Đều hai bên" của Ảnh trong bài đọc (layout.align) vẫn là Hai bên.
// Lề phải của hướng dẫn: hướng dẫn nằm trong cột chữ của G0, bên trái mã QR file nghe, nên căn Phải / Giữa / Hai bên tính tới mép trái mã QR.
const TA = [['left', 'Trái'], ['center', 'Giữa'], ['right', 'Phải'], ['justify', 'Hai bên']];
function taOf(t) { const L = t.layout || {}; if (L.ta && TA.some(x => x[0] === L.ta)) return L.ta; return L.align === 'justify' && layoutOf(t) === 'T8' ? 'justify' : 'left'; }
function renderTask(t, frag, mt) {
  const L = layoutOf(t), sp = spacingOf(t), age = AGE[ws.age], cont = !!(frag && frag.cont), lay = t.layout, fr = frOf(t);
  const first = !frag || (frag.a === 0 && !frag.cont);
  let style = `--pad:${sp.padTask}mm;--hg:${sp.headGap}mm;--gg:${sp.groupGap}mm;--ig:${sp.itemGap}mm;--fs:${fontPt()}pt;--nd:${(fontPt() * 0.3528 * 1.35).toFixed(2)}mm;--ng:2.5mm;--gut:calc(var(--nd) + var(--ng));--padx:${sheetSpacing().padTask}mm;--padt:${isJoined(t) ? 0 : 3}mm;--cols:${colsOf(t)};--tpl:${tplOf(t)};--img:${fr.scale || 100};--ar:${t.image && t.image.ar ? t.image.ar : '4/3'}${imgStyle(t)}`;
  const t6w = L === 'T6' && !(t.wordBank && t.wordBank.placement === 'right');
  if (lay.width && t6w) style += `;--cw:${lay.width}`;
  if (lay.rowH && L === 'T7') style += `;--mrh:${lay.rowH}mm`;
  if (lay.whoW) style += `;--who:${lay.whoW}mm`;
  if (t.answer.layout === 'A6' && (t.answer.params || {}).row && (t.answer.params || {}).tfx) style += `;--tfx:${t.answer.params.tfx}mm`;   // v101: T / F cách lề phải
  if (lay.colGap != null && L === 'T5') style += `;--cg:${lay.colGap}mm`;
  if (mt) style += `;margin-top:${mt}mm`;
  const at = [fitOf(t) ? `data-fit="${fitOf(t)}"` : '', alignOf(t) ? `data-ia="${alignOf(t)}"` : '',
    L === 'T5' && lay.align && cellDirOf(t) !== 'row' ? `data-ca="${lay.align}"` : '', frameH(t) ? 'data-ih="1"' : '', lay.num === 'off' ? 'data-nonum="1"' : '',
    lay.valign && cellDirOf(t) !== 'row' ? `data-va="${lay.valign}"` : '', fr.valign && isColI(t) ? `data-iv="${fr.valign}"` : '',
    lay.width && t6w ? 'data-w2="1"' : '', lay.align && (t6w || L === 'T8') ? `data-al2="${lay.align}"` : '', lay.qbold ? 'data-qb="1"' : '', lay.mbd === 'on' && ck(t) === 'pairs' ? 'data-mbd="1"' : '', t.answer.layout === 'A4' && t.answer.attach === 'item' && ['center', 'bottom'].includes((t.answer.params || {}).qv) ? `data-qv="${t.answer.params.qv}"` : '', t.answer.layout === 'A6' && (t.answer.params || {}).row ? `data-tfr="1" data-tfv="${(t.answer.params || {}).rowv || 'center'}"` : '', taOf(t) !== 'left' ? `data-ta="${taOf(t)}"` : ''].filter(Boolean).join(' ');   // v86: data-qb = chữ câu hỏi đậm
  const g0 = cont ? '' : isJoined(t) ? (t.instruction ? `<div class="g0 jn" data-node="${t.id}:G0"><div class="g0t"><span class="ins">${er(t.instruction)}</span></div></div>` : '') : `<div class="g0" data-node="${t.id}:G0"><span class="num">${t.number}</span><div class="g0t"><span class="ttl">${esc(t.title)}</span>${t.audio ? `<span class="trk">${esc(t.audio)}</span>` : ''}<span class="ins">${er(t.instruction)}</span></div>${qrHtml(t)}</div>`;
  const ex = Array.isArray(t.extras) ? t.extras : [], lastF = !frag || !!frag.last;
  const gtTop = first ? ex.filter(x => x.pos === 'top').map(x => gtHtml(t, x, 'top')).join('') : '', gtBot = lastF ? ex.filter(x => x.pos !== 'top').map(x => gtHtml(t, x, 'bot')).join('') : '';
  return `<section class="task L-${L}" data-node="${t.id}" data-task="${t.id}" ${at} style="${style}">${g0}${gtTop}${body(t, L, frag, first, lastF)}${gtBot}</section>`;
}

// Số câu ở lề số. Task chỉ có một câu thì không đánh số, vẫn giữ chỗ lề để chữ thẳng đường dóng.
// v100: layout.nlab = 'a' → số câu hiện thành chữ a, b, c… (mặc định số 1, 2, 3)
const nlab = (t, n) => t && t.layout && t.layout.nlab === 'a' && n >= 1 && n <= 26 ? String.fromCharCode(96 + n) : n;
const ino = (n, i, t) => n === 1 ? '<span class="ino" style="visibility:hidden" aria-hidden="true">1</span>' : `<span class="ino">${nlab(t, i + 1)}</span>`;
// v81: câu ví dụ (ex) mang số 0 và hiện sẵn đáp án; dòng chữ giữa các câu (G3-Text, gt) không có số, không tính vào số câu
const qReal = t => its(t).filter(x => !x.ex && !x.gt);
function qnum(t, i) { const it = its(t), x = it[i]; if (!x) return i + 1; if (x.ex) return 0; let n = 0; for (let j = 0; j <= i; j++) if (!it[j].ex && !it[j].gt) n++; return n; }
const inoT = (t, i) => { const x = its(t)[i]; if (x && x.ex) return '<span class="ino ex">0</span>'; return ino(its(t).some(y => y.ex) ? 2 : qReal(t).length, qnum(t, i) - 1, t); };
const inoN = (t, i) => { const x = its(t)[i]; return `<span class="ino${x && x.ex ? ' ex' : ''}">${x && x.ex ? 0 : nlab(t, qnum(t, i))}</span>`; };
const qwho = q => q && q.who != null ? `<b class="qwho">${esc(q.who)}:</b>` : '';
const g3row = (t, q) => `<div class="q g3t"><span class="ino" style="visibility:hidden" aria-hidden="true">0</span><div class="qb"><div class="qt">${er(q.text || '')}</div></div></div>`;
const leadIntro = t => t.content.lead && t.content.lead.kind === 'text' && leadText(t) ? `<div class="dl intro">${er(leadText(t))}</div>` : '';
// Khung từ (G4): chữ rời / danh sách, hoặc ảnh (v81: lưới ô cùng cỡ, nhãn A B C, chú thích dưới ảnh). Không trộn chữ và ảnh.
function g4Html(t) {
  const wb = t.wordBank, id = t.id, lab = i => !wb || wb.label === 'none' ? '' : (wb.label === 'upper' ? 'ABCDEFGHIJ' : 'abcdefghij')[i] + '.';
  const wbst = wb.placement !== 'right' && wb.w ? ` style="width:${wb.w}%;justify-self:${JS[wb.align || 'center']}"` : '';
  if (wb.kind === 'image') { const n = wb.words.length, lb = wb.label === 'none' ? '' : wb.label === 'upper' ? 'ABCDEFGHIJ' : 'abcdefghij', wc = wb.cols || Math.max(1, Math.min(n, wb.placement === 'right' ? 1 : 5));
    return `<div class="g4 wimg" data-node="${id}:G4" style="--wc:${wc}${wb.placement !== 'right' && wb.w ? `;width:${wb.w}%;justify-self:${JS[wb.align || 'center']}` : ''}">${wb.words.map((w, i) => `<div class="wim">${lb ? `<b>${lb[i] || ''}</b>` : ''}${ownFit(t, 'B.' + i, pic(w || 'ảnh', '', srcOf(t, 'B.' + i), { slot: 'B.' + i, ar: wb.ar || '1/1' }), wb.frame)}${w && wb.cap !== false ? `<span>${er(w)}</span>` : ''}</div>`).join('')}</div>`; }
  return wb.style === 'list'
    ? `<div class="g4 wlist" data-node="${id}:G4"${wbst}>${wb.words.map((w, i) => `<div class="wi">${lab(i) ? `<i>${lab(i)}</i>` : ''}<span>${er(w)}</span></div>`).join('')}</div>`
    : `<div class="g4" data-node="${id}:G4"${wbst}>${wb.words.map(w => `<span>${er(w)}</span>`).join('')}</div>`;
}
// Khung từ đặt dưới (v81): nằm cuối Task, chỉ ở mảnh cuối khi Task bị cắt trang
function body(t, L, frag, first, last) {
  const h = body0(t, L, frag, first), wb = t.wordBank;
  if (!wb || wb.placement !== 'bottom' || !(last ?? (!frag || frag.last)) || ck(t) === 'empty') return h;
  return h.replace(/<\/div>$/, g4Html(t) + '</div>');
}
// v84: ảnh chung ở các dạng không có chỗ riêng cho ảnh (lưới ảnh, nối, hội thoại, tô chữ, bảng): đặt trên cùng thân Task
const G1_TOP = ['items', 'pairs', 'dialogue', 'trace', 'table'];
function body0(t, L, frag, first) {
  const h = body0n(t, L, frag, first);
  if (!t.image || !first || !G1_TOP.includes(ck(t))) return h;
  return h.replace(/^<div class="body b1">/, m => m + g1Of(t, L));
}
function g1Of(t, L) { const id = t.id; return `<div class="g1${t.image.two ? ' g1two' : ''}" data-node="${id}:G1">${withMarks(t, pic(t.image.label, t.image.size === 'large' && L === 'T1' ? 'big' : '', srcOf(t, 'G1'), { slot: 'G1', gar: t.image.ar }))}${t.image.two ? ownFit(t, 'G1b', pic(t.image.label2 || 'ảnh 2', '', srcOf(t, 'G1b'), { slot: 'G1b', gar: t.image.ar }), g1bFit(t)) : ''}</div>`; }
function body0n(t, L, frag, first) {
  const k = ck(t), c = t.content, id = t.id;
  const g1 = t.image && first ? `<div class="g1${t.image.two ? ' g1two' : ''}" data-node="${id}:G1">${withMarks(t, pic(t.image.label, t.image.size === 'large' && L === 'T1' ? 'big' : '', srcOf(t, 'G1'), { slot: 'G1', gar: t.image.ar }))}${t.image.two ? ownFit(t, 'G1b', pic(t.image.label2 || 'ảnh 2', '', srcOf(t, 'G1b'), { slot: 'G1b', gar: t.image.ar }), g1bFit(t)) : ''}</div>` : '';
  const wb = t.wordBank;
  const g4 = wb && first && wb.placement !== 'bottom' ? g4Html(t) : '';
  const withBank = g2 => !g4 ? g2 : (wb.placement === 'right' ? `<div class="wbwrap"${wb.valign ? ` style="align-items:${AI[wb.valign]}"` : ''}>${g2}${g4}</div>` : g4 + g2);

  if (k === 'empty') return `<div class="body b1">${g1}</div>`;

  if (k === 'table' && tblOpts(t).cross) return `<div class="body b1">${withBank(crossHtml(t))}</div>`;
  if (k === 'table') {
    const o = tblOpts(t), nC = c.cols.length, rh = o.rowHead, tot = nC + (rh ? 1 : 0), age = AGE[ws.age];
    const fr = range(c.rows, frag), showHead = o.head && (first || o.repeat);
    const cwOk = Array.isArray(o.cw) && o.cw.length === tot;
    const tpl = cwOk ? o.cw.map(x => `minmax(0,${x}fr)`).join(' ') : !rh ? `repeat(${nC},minmax(0,1fr))` : o.cols === 'equal' ? `repeat(${tot},minmax(0,1fr))` : o.cols === 'auto' ? `fit-content(45%) repeat(${nC},minmax(0,1fr))` : `${o.first}fr repeat(${nC},${((100 - o.first) / nC).toFixed(3)}fr)`;
    const hasBlank = c.rows.some(r => r.cells.some(x => x === ''));
    const rhmm = o.minH ?? TBL_ROW_MM;
    const tkey = !!(t.layout.table || {}).key;   // v98: bản giáo viên: ô tích đúng có ✓ và tô nền
    const cellHtml = (v, sk) => typeof v === 'string' ? (v.includes('\n') ? `<span class="tml">${v.split('\n').filter(l => l.trim()).map(l => `<span>${er(l)}</span>`).join('')}</span>` : er(v)) : v && v.ans != null ? ((t.layout.table || {}).key ? `<span class="tka">${er(v.ans)}</span>` : '') : v && v.tick ? (v.text ? `<span class="tkc"><span class="a a5${tkey && v.ok ? ' pk' : ''}"></span><span>${er(v.text)}</span></span>` : `<span class="a a5${tkey && v.ok ? ' pk' : ''}"></span>`) : v && v.img ? (v.text ? `<span class="cix">${sk ? tpic(t, sk, v.img, 'sm') : pic(v.img, 'sm')}<span>${er(v.text)}</span></span>` : (sk ? tpic(t, sk, v.img, 'sm') : pic(v.img, 'sm'))) : '';
    const rowsOut = [];
    if (showHead) rowsOut.push({ head: true, cells: (rh ? [c.corner || ''] : []).concat(c.cols) });
    fr.forEach(([r, i]) => rowsOut.push({ i, cells: (rh ? [r.head] : []).concat(r.cells) }));
    const ta = { left: 'flex-start', center: 'center', right: 'flex-end' }[o.align] || 'flex-start';
    const rhs = o.rhs || {}, nBody = rowsOut.filter(r => !r.head).length;
    const out = rowsOut.map((r, ri) => {
      const rk = r.head ? 'h' : r.i, rst = rhs[rk] ? ` style="min-height:${rhs[rk]}mm"` : '';
      const cl = `${ri === 0 ? ' r0' : ''}${ri === rowsOut.length - 1 ? ' rl' : ''}`;
      const nm = `<div class="nm" data-rk="${rk}"${rst}>${o.num && !r.head ? `<span class="ino">${r.i + 1}</span>` : ''}</div>`;
      return nm + r.cells.map((v, ci2) => {
        const isRH = rh && ci2 === 0, tint = (o.fh && r.head) || (o.fr === 'zebra' && !r.head && (r.i % 2 === 1)) || (o.fc && isRH && !r.head);
        const cc = `${cl}${ci2 === 0 ? ' c0' : ''}${ci2 === r.cells.length - 1 ? ' cl' : ''}${tint ? ' tn' : ''}${o.fh && r.head ? ' hd' : ''}${tkey && !r.head && v && v.tick && v.ok ? ' tok' : ''}`;
        const rid = !r.head && c.rows[r.i] ? c.rows[r.i].id : null, sk = rid ? (isRH ? '@' + rid : `@${rid}.${ci2 - (rh ? 1 : 0)}`) : null;
        let bd = isRH && v && typeof v === 'object' ? `<span class="rhx">${sk ? tpic(t, sk, v.img, 'sm') : pic(v.img, 'sm')}<span>${esc(v.text || '')}</span></span>` : cellHtml(v, sk);
        if (o.nm === 'in' && ci2 === 0 && !r.head) bd = `<span class="nin"><span class="ino">${r.i + 1}</span><span class="nib">${bd}</span></span>`;
        return `<div class="${r.head ? 'th' : 'tc'}${isRH ? ' rh' : ''}${cc}" data-rk="${rk}"${rst} ${r.head ? '' : `data-node="${id}:G2"`}>${bd}</div>`;
      }).join('');
    }).join('');
    return `<div class="body b1">${withBank(`<div class="g2 tg" data-node="${id}:G2" data-ln="${o.lines}" data-al="${o.align}" style="--tcols:${tpl};--nmw:${o.num ? 'var(--gut)' : '0px'};--rh:${rhmm}mm;--ta:${ta}${o.rows === 'equal' && nBody ? `;grid-template-rows:${showHead ? 'auto ' : ''}repeat(${nBody},1fr)` : ''}">${out}</div>`)}</div>`;
  }

  if (k === 'dialogue') {
    // v84: hội thoại cắt được theo lượt (Liền trang); số chỗ trống (1) (2)… đếm tiếp từ các lượt ở trang trước
    let n = frag ? c.items.slice(0, frag.a).reduce((a, l) => a + ((l.text || '').match(/___/g) || []).length, 0) : 0;
    const fill = (tx, li) => t.answer.layout === 'A2' && t.answer.attach === 'inline' ? a2inline(t, tx, () => ++n, { id: c.items[li].id }) : er(tx).split('___').reduce((a, part, i) => a + (i ? `(${++n}) ${ans(t, { id: c.items[li].id })}` : '') + part, '');
    const intro = first ? leadText(t) : '', rows = (intro ? `<div class="dl intro">${er(intro)}</div>` : '') + range(c.items, frag).map(([l, li]) => `<div class="dl"><span class="who">${esc(l.who || '')}:</span><span>${fill(l.text || '', li)}</span></div>`).join('');
    return `<div class="body b1">${withBank(`<div class="g2 dialogue" data-node="${id}:G2">${rows}</div>`)}</div>`;
  }

  if (k === 'pairs' && c.shuffle) {   // v90: cặp gõ cạnh nhau = cặp đúng; vế trái giữ thứ tự, vế phải (cả vế thừa) in theo thứ tự xáo cố định
    const Ls = c.items.filter(x => x.pair && x.pair.l), Rs = c.items.filter(x => x.pair && x.pair.r), pm = pairPerm(t, Rs.length), n = Math.max(Ls.length, Rs.length);
    const hd = c.heads && c.heads.some(Boolean) ? `<div class="ml mh" data-node="${id}:G2">${esc(c.heads[0] || '')}</div><div class="md"></div><div class="mr mh" data-node="${id}:G2">${esc(c.heads[1] || '')}</div>` : '', mid = (t.answer.params || {}).mid, mdH = (l, r, it) => mid === 'box' ? `<div class="md mbox" data-node="${id}:G3">${l ? `<span class="a mbx" data-node="${id}:G3"></span>` : ''}</div>` : mid === 'none' ? `<div class="md"></div>` : `<div class="md" data-node="${id}:G3">${l ? ans(t, it) : '<span></span>'}${r ? ans(t, it) : '<span></span>'}</div>`;   // v105: tiêu đề hai cột; giữa = chấm nối / ô viết chữ / không có
  let rows = hd;
    for (let i = 0; i < n; i++) {
      const lx = Ls[i], l = lx && lx.pair.l, rx = Rs[pm[i]], r = rx && rx.pair.r, it = { id: (lx || rx).id };
      rows += `<div class="ml" data-node="${id}:G2">${l ? inoN(t, c.items.indexOf(lx)) : ''}${l ? (l.img ? tpic(t, '@' + lx.id, l.img, 'sm') : `<span>${er(l.text)}</span>`) : ''}</div>` +
        mdH(l, r, it) +
        `<div class="mr" data-node="${id}:G2">${r ? `<span>${er(r.text)}</span>` : ''}</div>`;
    }
    return `<div class="body b1">${withBank(`<div class="mrows">${rows}</div>`).replace('<div class="wbwrap"', '<div class="wbwrap wbm"')}</div>`;
  }
  if (k === 'pairs') {
    const n = c.items.length;
    const hd = c.heads && c.heads.some(Boolean) ? `<div class="ml mh" data-node="${id}:G2">${esc(c.heads[0] || '')}</div><div class="md"></div><div class="mr mh" data-node="${id}:G2">${esc(c.heads[1] || '')}</div>` : '', mid = (t.answer.params || {}).mid, mdH = (l, r, it) => mid === 'box' ? `<div class="md mbox" data-node="${id}:G3">${l ? `<span class="a mbx" data-node="${id}:G3"></span>` : ''}</div>` : mid === 'none' ? `<div class="md"></div>` : `<div class="md" data-node="${id}:G3">${l ? ans(t, it) : '<span></span>'}${r ? ans(t, it) : '<span></span>'}</div>`;   // v105: tiêu đề hai cột; giữa = chấm nối / ô viết chữ / không có
  let rows = hd;
    for (let i = 0; i < n; i++) {
      const pr = c.items[i].pair || {}, l = pr.l, r = pr.r, it = { id: c.items[i].id };
      rows += `<div class="ml" data-node="${id}:G2">${l ? inoN(t, i) : ''}${l ? (l.img ? tpic(t, '@' + c.items[i].id, l.img, 'sm') : `<span>${er(l.text)}</span>`) : ''}</div>` +
        mdH(l, r, it) +
        `<div class="mr" data-node="${id}:G2">${r ? `<span>${er(r.text)}</span>` : ''}</div>`;
    }
    return `<div class="body b1">${withBank(`<div class="mrows">${rows}</div>`).replace('<div class="wbwrap"', '<div class="wbwrap wbm"')}</div>`;   // v85: Khung từ (G4) cũng hiện ở dạng nối (đặt bên phải: cột riêng, không dùng --tpl của 3 cột nối)
  }

  if (k === 'items') {
    const rs = range(c.items, frag);
    if (L === 'T5') {
      const dir = cellDirOf(t);
      const cellS = (it, i) => {
        const inner = it.lines
          ? it.lines.map(l => `<div class="cl">${qtext(t, { text: l })}</div>`).join('')
          : (it.text ? `<div class="itx">${qtext(t, it)}</div>` : '') + ans(t, it);
        const img = ci(t, it.id, it.img, srcOf(t, '@' + it.id));
        // Ảnh trái: hàng gồm 2 container: ô ảnh | ô chữ, mỗi ô có cấu hình riêng
        if (dir === 'row') {
          const cc = cellCfg(t, it.id), r = cellSplit(cc), va = AI[cc.valign || t.layout.valign || 'center'];
          return `<div class="cell row" data-cell="${it.id}" style="--va:${va};--rowh:${cc.rowH || 0}">${inoN(t, i)}<div class="rowbody" style="--tpl:${r}fr ${100 - r}fr"><div class="col colI">${img}</div><div class="col cb" data-node="${id}:G2:${it.id}">${inner}</div></div></div>`;
        }
        return `<div class="cell">${inoN(t, i)}${img}${it.lines ? `<div class="cb">${inner}</div>` : inner}</div>`;
      };
      const cells = rs.map(([it, i]) => c.variant === 'multi'
        ? `<div class="cell multi"><div class="itx">${inoN(t, i)}<span>${er(it.text)}</span></div><div class="choices">${it.imgs.map((im, j) => `<div class="ch">${ci(t, `${it.id}.${j}`, im, srcOf(t, `@${it.id}.${j}`))}${ansI(t, it, j)}</div>`).join('')}</div></div>`
        : cellS(it, i)).join('');
      return `<div class="body b1">${withBank(`<div class="g2 grid ${c.variant === 'multi' ? 'multi' : dir === 'row' ? 'rowc' : ''}" data-node="${id}:G2">${cells}</div>`)}</div>`;
    }
    const rows = rs.map(([it, i]) => c.variant === 'multi'
      ? `<div class="cell multi"><div class="itx">${inoN(t, i)}<span>${er(it.text)}</span></div><div class="choices">${it.imgs.map((im, j) => `<div class="ch">${tpic(t, `@${it.id}.${j}`, im, '')}${ansI(t, it, j)}</div>`).join('')}</div></div>`
      : `<div class="irow">${inoN(t, i)}${tpic(t, '@' + it.id, it.img, 'sm')}${ans(t, it)}</div>`).join('');
    return `<div class="body b1">${withBank(`<div class="g2 list" data-node="${id}:G2">${rows}</div>`)}</div>`;
  }

  if (k === 'trace') {
    const rows = range(c.items, frag).map(([w, i]) => `<div class="q tr">${inoN(t, i)}<div class="qb">${ans(t, { id: w.id, text: w.text || '' })}</div></div>`).join('');
    return `<div class="body b1">${withBank(`<div class="g2 list" data-node="${id}:G2">${rows}</div>`)}</div>`;   // v85: Khung từ (G4) cũng hiện ở dạng tô chữ
  }

  if (k === 'questions') {
    const qs = range(c.items, frag);
    if (L === 'T4') {
      const rows = qs.map(([q, i]) => q.gt ? `<div class="c2 g3tw" data-node="${id}:G2">${g3row(t, q)}</div>` : `<div class="c2" data-node="${id}:G2">${inoT(t, i)}<span>${qwho(q)}${qtext(t, q)}</span></div><div class="c3" data-node="${id}:G3">${ans(t, q)}</div>`).join('');
      return `<div class="body b1">${g4}${leadIntro(t)}<div class="tbl">${g1}${rows}</div></div>`;
    }
    const block = t.answer.attach === 'block';
    const g2 = `${leadIntro(t)}<div class="g2 list" data-node="${id}:G2">${qs.map(([q, i]) => q.gt ? g3row(t, q) : `<div class="q">${inoT(t, i)}<div class="qb"><div class="qt">${qwho(q)}${qtext(t, q)}</div>${t.answer.attach === 'item' ? ans(t, q) : ''}</div></div>`).join('')}</div>`;
    const g3 = block ? `<div class="g3 list" data-node="${id}:G3" style="--cols:1">${qs.map(([q, i]) => q.gt ? '' : `<div class="q">${inoT(t, i)}<div class="qb">${ans(t, q)}</div></div>`).join('')}</div>` : '';
    return place(L, g1, withBank(g2) + g3);
  }

  if (k === 'passage') {
    const cut = passCut(t, L), PP = cut ? passageParas(t).length : 0;
    const pIdx = cut && frag ? range(passageParas(t), { a: frag.a, b: Math.min(frag.b, PP - 1) }).map(x => x[1]) : null;
    const g2 = pIdx && !pIdx.length ? '' : `<div class="g2 passage" data-node="${id}:G2">${passageHtml(t, pIdx)}</div>`;
    const qs = cut && frag ? (frag.b >= PP ? range(its(t), { a: Math.max(0, frag.a - PP), b: frag.b - PP }) : []) : range(its(t), L === 'T8' ? frag : null);
    const inlGap = t.answer.attach === 'inline' && t.answer.layout === 'A2';   // v101: chỗ trống ngay trong câu (cả đoạn văn) là chỗ trả lời
    const g3 = qs.length ? `<div class="g3 list" data-node="${id}:G3" style="--cols:1">${qs.map(([q, i]) => q.gt ? g3row(t, q) : `<div class="q">${inoT(t, i)}<div class="qb"><div class="qt">${qwho(q)}${q.ex || (t.answer.params || {}).ulab || inlGap ? qtext(t, q) : er(q.text)}</div>${inlGap ? '' : ans(t, q)}</div></div>`).join('')}</div>` : '';
    if (L === 'T8' && !first) return `<div class="body b1">${g3}</div>`;
    if (L === 'T8' && g1) return `<div class="body b1">${g4}<div class="wrapbox">${g1}${g2}</div>${g3}</div>`;
    if (L === 'T4') return `<div class="body b1">${g1}${g4}<div class="tbl tbl2" style="align-items:start"><div class="c2">${g2}</div><div>${g3}</div></div></div>`;
    return place(L, g1, t.layout.order === 'qfirst' ? g3 + withBank(g2) : withBank(g2) + g3);
  }
  return '';
}
function place(L, g1, main) {
  if (!g1 || L === 'T1' || L === 'T6') return `<div class="body b1">${g1}${main}</div>`;
  if (L === 'T2') return `<div class="body b2"><div class="col colL colI">${g1}</div><div class="col">${main}</div></div>`;
  if (L === 'T3') return `<div class="body b3"><div class="col colL">${main}</div><div class="col colI">${g1}</div></div>`;
  return `<div class="body b1">${g1}${main}</div>`;
}

/* ================= Đo & phân trang ================= */
const meas = document.getElementById('measure');
function measure(t, frag) { meas.innerHTML = renderTask(t, frag); return meas.firstElementChild.getBoundingClientRect().height; }
function units(t) {
  const L = layoutOf(t), c = t.content, k0 = ck(t), chunk = (n, k) => { const u = []; for (let i = 0; i < n; i += k) u.push([i, Math.min(n, i + k) - 1]); return u; };
  if (k0 === 'items' && (L === 'T5' || L === 'T6')) return chunk(c.items.length, colsOf(t));
  if (k0 === 'questions' && t.answer.attach !== 'block' && (L === 'T6' || L === 'T4')) return chunk(c.items.length, L === 'T6' ? colsOf(t) : 1);
  if (k0 === 'questions' && t.answer.attach !== 'block' && t.image && ['T1', 'T2', 'T3'].includes(L)) return c.items.length > 1 ? chunk(c.items.length, 1) : null;   // v86: câu hỏi có ảnh chung cắt theo câu; ảnh ở phần đầu, phần sau chạy hết bề ngang
  if (k0 === 'trace') return chunk(c.items.length, 1);
  if (k0 === 'dialogue') return c.items.length > 1 ? chunk(c.items.length, 1) : null;
  if (k0 === 'passage' && L === 'T8') return its(t).length ? chunk(its(t).length, 1) : null; // bài đọc (ảnh + văn bản) đi cùng câu đầu, các câu sau có thể sang trang
  if (passCut(t, L)) { const P = passageParas(t).length, u = []; for (let i = 0; i < P; i++) u.push([i, i]); its(t).forEach((_, j) => u.push([P + j, P + j])); return u.length > 1 ? u : null; }   // bài đọc cắt theo đoạn, rồi tới từng câu
  if (k0 === 'table' && tblOpts(t).split && !tblOpts(t).cross) return chunk(c.rows.length, 1);
  return null; // không cắt được: T7, tranh, bài đọc ở layout khác
}
// Task có container dẫn riêng (ảnh + bài đọc) và container câu hỏi: hai container này tách được ở trang.
const leadOf = t => ck(t) === 'passage' && layoutOf(t) === 'T8';
// Gợi ý sửa nhanh cho một Task bị tràn
function fixesFor(t) {
  const f = [], L = layoutOf(t), rg = colsRange(t, L), p = t.answer.params || {}, fr = frOf(t);
  if (t.spacing.preset !== 'compact') f.push({ v: 'compact', label: 'Khoảng cách Gọn' });
  if (rg && colsOf(t) < rg[1]) f.push({ v: 'cols', label: `Chia ${colsOf(t) + 1} cột` });
  if (ws.flow === 'page' && units(t)) f.push({ v: 'cont', label: 'Chuyển sang Liền trang' });
  if (['A1', 'A2'].includes(t.answer.layout) && (p.lines || 1) > 1) f.push({ v: 'lines', label: 'Bớt 1 dòng viết' });
  if (ck(t) === 'table' && !tblOpts(t).split) f.push({ v: 'split', label: 'Cho phép cắt bảng' });
  if (t.image && fitOf(t) && frameH(t) > 30) f.push({ v: 'imgh', label: 'Khung ảnh thấp hơn 10 mm' });
  else if (t.image && !fitOf(t) && layoutOf(t) !== 'T8' && (fr.scale || 100) > 50) f.push({ v: 'scale', label: 'Thu nhỏ ảnh 20%' });
  return f;
}
function paginate() {
  let nn = 0; ws.tasks.forEach((t, i) => { t.part = ''; if (isJoined(t)) t.number = nn; else t.number = ++nn; });
  ws.tasks.forEach((t, i) => { if (isJoined(t)) { let k = i; while (k > 0 && isJoined(ws.tasks[k])) k--; t.part = String.fromCharCode(97 + (i - k)); ws.tasks[k].part = 'a'; } });
  const H = CONTENT_H * MM, diags = [];
  const pages = [{ items: [], used: 0 }]; let cur = pages[0];
  const add = t => cur.items.length ? gapOf(t) * MM : 0;
  const newPage = () => { cur = { items: [], used: 0 }; pages.push(cur); };
  const put = (t, frag, h, over) => { cur.used += add(t) + h; cur.items.push({ t, frag, h, over: !!over }); };
  const firstPart = t => { const U = ws.flow === 'page' || (ck(t) === 'dialogue' && measure(t, null) <= H) ? null : units(t); return U ? measure(t, { a: U[0][0], b: U[0][1], cont: false, last: U.length === 1 }) : measure(t, null); };
  ws.tasks.forEach((t, ti) => {
    const brk = t.layout.break;
    if (brk === 'page' && cur.items.length) newPage();                 // Sang trang mới
    const full = measure(t, null);
    if ((brk === 'keep' || (ti + 1 < ws.tasks.length && isJoined(ws.tasks[ti + 1]))) && cur.items.length && ti + 1 < ws.tasks.length) { // Giữ liền Task sau: Task sau phải bắt đầu được ở cùng trang
      const nx = ws.tasks[ti + 1], need = full + gapOf(nx) * MM + firstPart(nx);
      if (cur.used + add(t) + need > H + .5 && need <= H) newPage();
    }
    if (cur.used + add(t) + full <= H + .5) { put(t, null, full); return; }
    const U = ws.flow === 'page' || (ck(t) === 'dialogue' && full <= H) ? null : units(t);   // v84: hội thoại chỉ cắt khi cao hơn một trang (vừa một trang thì chuyển nguyên sang trang sau như cũ)
    // Liền trang: bài cắt được thì luôn tràn nối tiếp sang trang sau (không bỏ trống cuối trang). Tách trang: U = null nên chuyển nguyên Task.
    if (full <= H && !U) { newPage(); put(t, null, full); return; }
    if (!U) {
      if (cur.items.length) newPage();
      put(t, null, full, true);
      diags.push({ id: t.id, msg: `Task ${t.number} cao ${Math.round(full / MM)} mm, hơn một trang và không cắt được${ws.flow === 'page' ? ' (đang ở chế độ Tách trang)' : ''}.`, fixes: fixesFor(t) });
      return;
    }
    let s = 0, nl = false; const lead = leadOf(t); // nl: phần dẫn (ảnh, bài đọc) đã đặt ở trang trước, các câu sau là phần tiếp
    while (s < U.length) {
      const rem = H - cur.used - add(t);
      let best = -1, bh = 0;
      for (let e = s; e < U.length; e++) { const h = measure(t, { a: U[s][0], b: U[e][1], cont: s > 0 || nl, last: e === U.length - 1 }); if (h <= rem + .5) { best = e; bh = h; } else break; }
      if (best < 0) {
        // Container dẫn (ảnh + bài đọc) tách độc lập khỏi container câu hỏi: được đứng một mình cuối trang.
        if (s === 0 && lead && !nl) { const fr0 = { a: 0, b: -1, cont: false }, h0 = measure(t, fr0); if (h0 <= rem + .5) { put(t, fr0, h0); nl = true; newPage(); continue; } }
        if (cur.items.length) { newPage(); continue; }
        const fr = { a: U[s][0], b: U[s][1], cont: s > 0 || nl, last: s === U.length - 1 };
        put(t, fr, measure(t, fr), true);
        diags.push({ id: t.id, msg: `Một phần của Task ${t.number} không vừa một trang trống.`, fixes: fixesFor(t) });
        s++; if (s < U.length) newPage(); continue;
      }
      put(t, { a: U[s][0], b: U[best][1], cont: s > 0 || nl, last: best === U.length - 1 }, bh); s = best + 1;
      if (s < U.length) newPage();
    }
  });
  meas.innerHTML = '';
  return { pages, diags, H };
}

/* ================= Vẽ trang ================= */
const stage = document.getElementById('stage');
function scaleNow() {
  const fit = Math.min(1, (stage.clientWidth - 8) / (210 * MM));
  return zoom == null ? Math.max(.3, fit) : zoom;
}
const FILL_MAX = 8; // mm thêm tối đa vào mỗi khoảng giữa hai Task khi "Lấp đầy trang"
function drawPages(res) {
  const n = res.pages.length, s = scaleNow(), sh = sheetSpacing(), age = AGE[ws.age];
  stage.style.setProperty('--s', s);
  const A = 14 + sh.padTask, B = A + fontPt() * 0.3528 * 1.35 + 2.5, C = 210 - 14 - sh.padTask;
  const gd = guides ? `<div class="guides" aria-hidden="true"><i style="left:${A}mm"></i><i class="b" style="left:${B.toFixed(2)}mm"></i><i style="left:${C}mm"></i></div>` : '';
  stage.innerHTML = res.pages.map((p, i) => {
    const free = Math.max(0, (res.H - p.used) / MM), over = p.items.some(x => x.over), k = p.items.length;
    const extra = ws.fill && i < n - 1 && k > 1 ? Math.min(FILL_MAX, free / (k - 1)) : 0;
    const fill = Math.min(100, (p.used + extra * (k - 1) * MM) / res.H * 100);
    const tasks = p.items.map((x, j) => { const h = renderTask(x.t, x.frag, j ? gapOf(x.t) + (isJoined(x.t) ? 0 : extra) : 0); return x.over ? h.replace('class="task ', 'class="task over ') : h; }).join('');
    return `<div class="pg-wrap"><div class="pg-scale"><div class="page" data-page="${i}"><div class="flow">${tasks}</div>${gd}<div class="pfoot"><span>${esc(ws.title)}</span><span>Trang ${i + 1}/${n}</span></div></div></div>` +
      `<div class="pstat ${over ? 'bad' : ''}">Trang ${i + 1} · ${over ? 'có Task tràn trang' : `còn trống ${Math.round(Math.max(0, free - extra * (k - 1)))} mm`}<span class="bar"><i style="width:${fill}%"></i></span></div></div>`;
  }).join('');
  markSelection(); addHandles(); resChanged = checkRes() || resChanged;
}
let resChanged = false;
let LEGEND = 'Kéo thanh hoặc cạnh = đổi kích thước · Bấm đúp = về tự động · Esc = lên cấp';
const nodeKey = s => !s || s.type === 'sheet' ? null : s.type === 'task' ? s.id : `${s.id}:${s.g}${s.item ? ':' + s.item : ''}`;
function markSelection() {
  stage.querySelectorAll('.sel').forEach(e => e.classList.remove('sel'));
  stage.querySelectorAll('.task.cur').forEach(e => e.classList.remove('cur'));
  if (sel.type !== 'sheet') stage.querySelectorAll(`.task[data-task="${sel.id}"]`).forEach(e => e.classList.add('cur'));
  [sel, ...multi].forEach(s => {
    const nid = nodeKey(s); if (!nid) return;
    stage.querySelectorAll(`[data-node="${nid}"]`).forEach(e => e.classList.add('sel'));
    if (s.type === 'group' && !s.item) stage.querySelectorAll(`[data-node^="${nid}:"]`).forEach(e => e.classList.add('sel'));
  });
}
function splitTarget(taskEl, L) {
  if (L === 'T2' || L === 'T3') { const c = taskEl.querySelector('.b2,.b3'); return c && { box: c, edge: c.querySelector('.colL') }; }
  if (L === 'T4') { const c = taskEl.querySelector('.tbl'); return c && { box: c, edge: c.querySelector('.c2') }; }
  if (L === 'T6') { const c = taskEl.querySelector('.wbwrap'); return c && { box: c, edge: c.firstElementChild }; }
  return null;
}
function refreshOverlay() { stage.querySelectorAll('.splitter,.rsz').forEach(x => x.remove()); addHandles(); }
const clampN = (v, a, b) => Math.min(b, Math.max(a, v));
const curTask = t => ws.tasks.find(x => x.id === t.id);
function relR(r, tr, s) { return { left: (r.left - tr.left) / s, top: (r.top - tr.top) / s, right: (r.right - tr.left) / s, bottom: (r.bottom - tr.top) / s, width: r.width / s, height: r.height / s }; }
const ratioLabel = t => { const r = ratioOf(t); return `${r} / ${100 - r}`; };

/* --- Tay kéo chuẩn: mọi tay kéo đều có data-for (container) và data-param (thông số), bấm đúp để về tự động --- */
function mkH(el, cls, o) {
  const d = document.createElement('div'); d.className = cls; d.dataset.for = o.for; d.dataset.param = o.param;
  d.title = (o.title || '') + ' Bấm đúp để về tự động.'; d.innerHTML = '<span class="tip"></span>'; d.__o = o; el.appendChild(d);
  d.addEventListener('dblclick', e => { e.stopPropagation(); commit(w => { const t = w.tasks.find(x => x.id === el.dataset.task); o.reset(t, w); }); });
  d.addEventListener('pointerdown', e => {
    e.preventDefault(); e.stopPropagation(); d.setPointerCapture(e.pointerId); d.classList.add('drag');
    const before = clone(ws), ctx = (o.start && o.start(e)) || {};
    ctx.x0 = e.clientX; ctx.y0 = e.clientY; ctx.s = scaleNow();
    const move = ev => { const tip = o.move(ev, ctx); if (tip != null) d.querySelector('.tip').textContent = tip; placeAll(el); };
    const up = () => {
      d.removeEventListener('pointermove', move); d.removeEventListener('pointerup', up); d.removeEventListener('pointercancel', up); d.classList.remove('drag');
      if (JSON.stringify(before) !== JSON.stringify(ws)) { propagate(before, o.sel || sel); ws.tasks.forEach(tidy); hist.push(before); fut = []; render(); return; }
      if (o.sel && nodeKey(o.sel) !== nodeKey(sel)) { sel = o.sel; multi = []; refreshSel(); }
    };
    d.addEventListener('pointermove', move); d.addEventListener('pointerup', up); d.addEventListener('pointercancel', up);
  });
  return d;
}
function placeAll(el) {
  const s = scaleNow(), tr = el.getBoundingClientRect();
  el.querySelectorAll('.rsz,.splitter').forEach(d => {
    const o = d.__o; if (!o || !o.place) return;
    const r = o.place(tr, s); if (!r) { d.hidden = true; return; } d.hidden = false;
    ['left', 'top', 'width', 'height'].forEach(k => { if (r[k] != null) d.style[k] = r[k] + 'px'; });
    if (r.tip != null && !d.classList.contains('drag')) d.querySelector('.tip').textContent = r.tip;
  });
}
// Kéo phần trăm theo cách căn: căn giữa thì mỗi bên đổi một nửa, căn phải thì kéo ngược
const dragPct = (c, ev, w0, full, align) => w0 + (align === 'center' ? 2 : 1) * (align === 'right' ? -1 : 1) * (ev.clientX - c.x0) / full * 100;

function hSplit(t, el, fk, param = 'split') {
  const L = layoutOf(t); if (ratioOf(t) == null || cellDirOf(t) === 'row') return;
  const tg = splitTarget(el, L); if (!tg || !tg.edge) return;
  const m = rmeta(t, L);
  mkH(el, 'splitter', { for: fk, param, title: 'Kéo để đổi tỉ lệ ngang (bước 5%).',
    place: (tr, s) => { const b = relR(tg.box.getBoundingClientRect(), tr, s), e = relR(tg.edge.getBoundingClientRect(), tr, s), gap = parseFloat(getComputedStyle(tg.box).columnGap) || 0; return { left: e.right + gap / 2, top: e.top, height: b.bottom - e.top, tip: ratioLabel(curTask(t)) }; },
    move: ev => { const b = tg.box.getBoundingClientRect(), r = clampN(Math.round((ev.clientX - b.left) / b.width * 20) * 5, m.range[0], m.range[1]), tt = curTask(t); if (ratioOf(tt) === r) return null; tt.layout.split = r === m.ratio ? null : r; el.style.setProperty('--tpl', tplOf(tt)); return ratioLabel(tt); },
    reset: tt => { tt.layout.split = null; } });
}
function hT7(t, el, fk) {
  if (layoutOf(t) !== 'T7') return; const box = el.querySelector('.mrows'); if (!box) return;
  const kid = i => box.children[i];
  [0, 1].forEach(k => mkH(el, 'splitter', { for: fk, param: 'cw', title: k ? 'Kéo để đổi độ rộng cột nối và cột phải (bước 5%).' : 'Kéo để đổi độ rộng cột trái và cột nối (bước 5%).',
    place: (tr, s) => { const b = relR(box.getBoundingClientRect(), tr, s), c = relR(kid(k).getBoundingClientRect(), tr, s), gap = parseFloat(getComputedStyle(box).columnGap) || 0; return { left: c.right + gap / 2, top: b.top, height: b.height, tip: t7cw(curTask(t)).map(Math.round).join(' / ') }; },
    move: ev => { const b = box.getBoundingClientRect(), x = Math.round((ev.clientX - b.left) / b.width * 20) * 5, tt = curTask(t), c = t7cw(tt).slice(); let b0 = c[0], b1 = c[0] + c[1]; if (k === 0) b0 = clampN(x, 10, b1 - 10); else b1 = clampN(x, b0 + 10, 90); const nw = [b0, b1 - b0, 100 - b1]; if (nw.join() === c.join()) return null; tt.layout.cw = nw.join() === T7CW.join() ? null : nw; el.style.setProperty('--tpl', tplOf(tt)); return nw.join(' / '); },
    reset: tt => { tt.layout.cw = null; } }));
  mkH(el, 'rsz rsz-h', { for: fk, param: 'rowH', title: 'Kéo để đổi chiều cao hàng nối (bước 1 mm).',
    place: (tr, s) => { const b = relR(box.getBoundingClientRect(), tr, s), r = relR(kid(0).getBoundingClientRect(), tr, s); return { left: b.left, width: b.width, top: r.bottom, tip: `hàng ${Math.round(r.height / MM)} mm` }; },
    start: () => ({ top: kid(0).getBoundingClientRect().top }),
    move: (ev, c) => { const mm = clampN(Math.round((ev.clientY - c.top) / c.s / MM), 8, 40), tt = curTask(t); if (tt.layout.rowH === mm) return null; tt.layout.rowH = mm; el.style.setProperty('--mrh', mm + 'mm'); return `hàng ${mm} mm`; },
    reset: tt => { tt.layout.rowH = null; } });
}
// v103: kéo cột T / F (Đúng/Sai cùng hàng) lại gần câu: đổi params.tfx (mm từ lề phải)
function hTF(t, el, fk) {
  if (t.answer.layout !== 'A6' || !(t.answer.params || {}).row) return;
  const bs = [...el.querySelectorAll('.qb > .a6')]; if (!bs.length) return;
  const a = bs[0], last = bs[bs.length - 1], qb = a.parentElement, tfx = tt => (tt.answer.params || {}).tfx || 0;
  const pct = () => { const q = qb.getBoundingClientRect(), r = a.getBoundingClientRect(); return q.width ? Math.round((r.left - q.left) / q.width * 100) : 0; }, lbl = mm => `câu ${pct()} / T-F ${100 - pct()} · cách lề phải ${mm} mm`;   // v106: hiện tỉ lệ câu / T-F
  mkH(el, 'splitter', { for: fk, param: 'tfx', title: 'Kéo để đưa cột T / F lại gần câu (bước 1 mm).',
    place: (tr, s) => { const r = relR(a.getBoundingClientRect(), tr, s), l = relR(last.getBoundingClientRect(), tr, s); return { left: r.left - 2 * MM, top: r.top - 1 * MM, height: l.bottom - r.top + 2 * MM, tip: lbl(tfx(curTask(t))) }; },
    move: (ev, c) => { const q = qb.getBoundingClientRect(), aw = a.getBoundingClientRect().width, mm = clampN(Math.round((q.right - ev.clientX - 2 * MM * c.s - aw) / c.s / MM), 0, 140), tt = curTask(t); if (tfx(tt) === mm) return null; tt.answer.params = tt.answer.params || {}; tt.answer.params.tfx = mm || null; el.style.setProperty('--tfx', mm + 'mm'); return lbl(mm); },
    reset: tt => { if (tt.answer.params) delete tt.answer.params.tfx; } });
}
function hT6(t, el, fk) {
  if (layoutOf(t) !== 'T6' || (t.wordBank && t.wordBank.placement === 'right')) return;
  const g2 = el.querySelector('.body>.g2'); if (!g2) return;
  const body = g2.parentElement;
  mkH(el, 'rsz rsz-w', { for: fk, param: 'width', title: 'Kéo để đổi độ rộng khối nội dung (bước 5%).',
    place: (tr, s) => { const r = relR(g2.getBoundingClientRect(), tr, s), al = curTask(t).layout.align; return { left: al === 'right' ? r.left : r.right, top: r.top, height: Math.min(r.height, 40 * MM), tip: `rộng ${curTask(t).layout.width || 100}%` }; },
    start: () => { const r = body.getBoundingClientRect(), s = scaleNow(), pl = parseFloat(getComputedStyle(body).paddingLeft) * s, hang = g2.classList.contains('list') ? -parseFloat(getComputedStyle(g2).marginLeft) * s : 0; return { full: r.width - pl + hang, w0: curTask(t).layout.width || 100 }; },
    move: (ev, c) => { const tt = curTask(t), pct = clampN(Math.round(dragPct(c, ev, c.w0, c.full, tt.layout.align) / 5) * 5, 40, 100), v = pct === 100 ? null : pct; if (tt.layout.width === v) return null; tt.layout.width = v; el.style.setProperty('--cw', pct); el.setAttribute('data-w2', '1'); return `rộng ${pct}%`; },
    reset: tt => { tt.layout.width = null; } });
}
// Khoảng cách giữa các item / câu (Lưới, Chỉ nội dung): kéo khe giữa hàng 1 và hàng 2
function hItemGap(t, el, fk) {
  const L = layoutOf(t); if (!['T5', 'T6'].includes(L)) return;
  const g2 = el.querySelector('.g2.grid, .g2.list, .g2.dialogue'); if (!g2) return;
  const kids = [...g2.children], n = L === 'T5' ? colsOf(t) : (g2.classList.contains('list') ? colsOf(t) : 1);
  if (kids.length <= n) return;
  const r0 = kids[0], r1 = kids[n];
  mkH(el, 'rsz rsz-g', { for: fk, param: 'sp.itemGap', title: 'Kéo để đổi khoảng cách giữa các item / câu (bước 0,5 mm).',
    place: (tr, s) => { const a = relR(r0.getBoundingClientRect(), tr, s), b = relR(r1.getBoundingClientRect(), tr, s); return { left: a.left, width: Math.min(a.width, 30 * MM), top: (a.bottom + b.top) / 2, tip: `cách ${fmtN(spacingOf(curTask(t)).itemGap)} mm` }; },
    start: () => ({ g0: spacingOf(curTask(t)).itemGap }),
    move: (ev, c) => { const mm = clampN(Math.round((c.g0 + (ev.clientY - c.y0) / c.s / MM) * 2) / 2, MINS.itemGap, 20), tt = curTask(t); if (spacingOf(tt).itemGap === mm) return null; tt.spacing.overrides.itemGap = mm; el.style.setProperty('--ig', mm + 'mm'); return `cách ${fmtN(mm)} mm`; },
    reset: tt => { delete tt.spacing.overrides.itemGap; } });
}
// Khoảng cách giữa các nhóm (bài đọc → câu hỏi ở T8; ảnh → nội dung ở T1)
function hGroupGap(t, el, fk) {
  const L = layoutOf(t); let a, b;
  if (L === 'T8') { a = el.querySelector('.wrapbox'); b = el.querySelector('.body>.g3'); }
  else if (L === 'T1') { a = el.querySelector('.body>.g1'); b = a && a.nextElementSibling; }
  if (!a || !b) return;
  mkH(el, 'rsz rsz-g', { for: fk, param: 'sp.groupGap', title: 'Kéo để đổi khoảng cách giữa các nhóm (bước 0,5 mm).',
    place: (tr, s) => { const x = relR(a.getBoundingClientRect(), tr, s), y = relR(b.getBoundingClientRect(), tr, s); return { left: x.left, width: Math.min(x.width, 30 * MM), top: (x.bottom + y.top) / 2, tip: `cách ${fmtN(spacingOf(curTask(t)).groupGap)} mm` }; },
    start: () => ({ g0: spacingOf(curTask(t)).groupGap }),
    move: (ev, c) => { const mm = clampN(Math.round((c.g0 + (ev.clientY - c.y0) / c.s / MM) * 2) / 2, MINS.groupGap, 20), tt = curTask(t); if (spacingOf(tt).groupGap === mm) return null; tt.spacing.overrides.groupGap = mm; el.style.setProperty('--gg', mm + 'mm'); return `cách ${fmtN(mm)} mm`; },
    reset: tt => { delete tt.spacing.overrides.groupGap; } });
}
function hWho(t, el, fk) {
  if (ck(t) !== 'dialogue') return; const who = el.querySelector('.dl:not(.intro) .who'); if (!who) return;
  mkH(el, 'rsz rsz-w', { for: fk, param: 'whoW', title: 'Kéo để đổi độ rộng cột tên người nói (bước 1 mm).',
    place: (tr, s) => { const r = relR(who.getBoundingClientRect(), tr, s); return { left: r.right, top: r.top, height: r.height, tip: `tên ${Math.round(r.width / MM)} mm` }; },
    start: () => ({ l: who.getBoundingClientRect().left }),
    move: (ev, c) => { const mm = clampN(Math.round((ev.clientX - c.l) / c.s / MM), 6, 40), tt = curTask(t); if (tt.layout.whoW === mm) return null; tt.layout.whoW = mm; el.style.setProperty('--who', mm + 'mm'); return `tên ${mm} mm`; },
    reset: tt => { tt.layout.whoW = null; } });
}
function hColGap(t, el, fk) {
  if (layoutOf(t) !== 'T5' || cellDirOf(t) === 'row' || colsOf(t) < 2) return;
  const grid = el.querySelector('.grid'); if (!grid || grid.children.length < 2) return;
  const a = grid.children[0], b = grid.children[1];
  mkH(el, 'rsz rsz-cg', { for: fk, param: 'colGap', title: 'Kéo để đổi khoảng cách giữa các cột (bước 1 mm).',
    place: (tr, s) => { const ra = relR(a.getBoundingClientRect(), tr, s), rb = relR(b.getBoundingClientRect(), tr, s); return { left: (ra.right + rb.left) / 2, top: ra.top, height: Math.min(ra.height, 30 * MM), tip: `cách ${Math.round((rb.left - ra.right) / MM)} mm` }; },
    start: () => ({ g0: (b.getBoundingClientRect().left - a.getBoundingClientRect().right) / scaleNow() / MM }),
    move: (ev, c) => { const mm = clampN(Math.round(c.g0 + (ev.clientX - c.x0) / c.s / MM), 2, 20), tt = curTask(t); if (tt.layout.colGap === mm) return null; tt.layout.colGap = mm; el.style.setProperty('--cg', mm + 'mm'); return `cách ${mm} mm`; },
    reset: tt => { tt.layout.colGap = null; } });
}
function hRowCell(t, el, key, withRowH) {
  const cell = el.querySelector(`.cell.row[data-cell="${key}"]`); if (!cell) return;
  const box = cell.querySelector('.rowbody'), edge = box.firstElementChild, fk = `${t.id}:G2:${key}`, sl = { type: 'group', id: t.id, g: 'G2', item: key };
  const mut = fn => { const tt = curTask(t); tt.layout.cells = tt.layout.cells || {}; fn(tt.layout.cells[key] = tt.layout.cells[key] || {}); };
  mkH(el, 'splitter rowsp', { for: fk, param: 'split', title: 'Kéo để đổi tỉ lệ ngang của hàng này (bước 5%).',
    place: (tr, s) => { const b = relR(box.getBoundingClientRect(), tr, s), e = relR(edge.getBoundingClientRect(), tr, s), gap = parseFloat(getComputedStyle(box).columnGap) || 0; const r = cellSplit(cellCfg(curTask(t), key)); return { left: e.right + gap / 2, top: b.top, height: b.height, tip: `${r} / ${100 - r}` }; },
    move: ev => { const b = box.getBoundingClientRect(), r = clampN(Math.round((ev.clientX - b.left) / b.width * 20) * 5, 15, 50); if (cellSplit(cellCfg(curTask(t), key)) === r) return null; mut(c => { c.split = r === 25 ? null : r; }); box.style.setProperty('--tpl', `${r}fr ${100 - r}fr`); return `${r} / ${100 - r}`; },
    reset: tt => { const c = tt.layout.cells && tt.layout.cells[key]; if (c) c.split = null; } });
  if (withRowH) mkH(el, 'rsz rsz-h', { for: fk, param: 'rowH', sel: sl, title: 'Kéo để đổi chiều cao hàng (bước 5 mm).',
    place: (tr, s) => { const r = relR(box.getBoundingClientRect(), tr, s); return { left: r.left, width: r.width, top: r.bottom, tip: `hàng ${Math.round(r.height / MM)} mm` }; },
    start: () => ({ top: box.getBoundingClientRect().top }),
    move: (ev, c) => { const mm = clampN(Math.round((ev.clientY - c.top) / c.s / MM / 5) * 5, 10, 120); if (cellCfg(curTask(t), key).rowH === mm) return null; mut(x => { x.rowH = mm; }); cell.style.setProperty('--rowh', mm); return `hàng ${mm} mm`; },
    reset: tt => { const c = tt.layout.cells && tt.layout.cells[key]; if (c) c.rowH = null; } });
}
// Tay kéo khung ảnh dùng chung cho ảnh G1 và ô ảnh T5: chiều cao luôn có; chấm tâm khi đã Fit
function frameHandles(el, o) { // o: {pic, fk, sl, get(), mut(fn), boxEl, attrFit, attrIh, min}
  if (o.hOk !== false) mkH(el, 'rsz rsz-h', { for: o.fk, param: 'frame.h', sel: o.sl, title: 'Kéo để đổi chiều cao khung ảnh (bước 5 mm). Ở chế độ Bình thường, kéo sẽ tạo khung Fit ngang.',
    place: (tr, s) => { const r = relR(o.pic.getBoundingClientRect(), tr, s); return { left: r.left, width: r.width, top: r.bottom, tip: `cao ${Math.round(r.height / MM)} mm` }; },
    move: (ev, c) => { const r = o.pic.getBoundingClientRect(), mm = clampN(Math.round((ev.clientY - r.top) / c.s / MM / 5) * 5, o.min || 25, 150), f = o.get(); if (f.h === mm && f.fit) return null; o.mut(fr => { if (!fr.fit) { fr.fit = 'width'; o.boxEl.setAttribute(o.attrFit, 'width'); } fr.h = mm; }); o.boxEl.style.setProperty('--ih', mm); o.boxEl.setAttribute(o.attrIh, '1'); return `cao ${mm} mm`; },
    reset: tt => o.mut(fr => { fr.h = null; }, tt) });
  if (o.get().fit) mkH(el, 'rsz rsz-c', { for: o.fk, param: 'frame.ox', sel: o.sl, title: 'Kéo để dời ảnh lệch tâm khung.',
    place: (tr, s) => { const r = relR(o.pic.getBoundingClientRect(), tr, s); return { left: (r.left + r.right) / 2, top: (r.top + r.bottom) / 2 }; },
    start: () => { const f = o.get(); return { ox0: f.ox || 0, oy0: f.oy || 0 }; },
    move: (ev, c) => { const pr = o.pic.getBoundingClientRect(), ir = o.pic.querySelector('img').getBoundingClientRect(), mx = Math.abs(ir.width - pr.width) / 2 / ir.width * 100, my = Math.abs(ir.height - pr.height) / 2 / ir.height * 100, nx = Math.round(clampN(c.ox0 + (ev.clientX - c.x0) / ir.width * 100, -mx, mx)), ny = Math.round(clampN(c.oy0 + (ev.clientY - c.y0) / ir.height * 100, -my, my)); o.mut(fr => { fr.ox = nx || null; fr.oy = ny || null; }); o.boxEl.style.setProperty('--ox', nx); o.boxEl.style.setProperty('--oy', ny); return null; },
    reset: tt => o.mut(fr => { fr.ox = fr.oy = fr.zoom = null; }, tt) });
}
function hFrame(t, el) {
  if (!t.image) return; const pic = el.querySelector('.g1 .pic'); if (!pic) return;
  const L = layoutOf(t), f = fitOf(t), fk = `${t.id}:G1`, sl = { type: 'group', id: t.id, g: 'G1' };
  frameHandles(el, { pic, fk, sl, boxEl: el, attrFit: 'data-fit', attrIh: 'data-ih', hOk: !(f === 'height' && isColI(t)),
    get: () => curTask(t).layout.frame, mut: (fn, tt) => fn((tt || curTask(t)).layout.frame) });
  if (L === 'T8') mkH(el, 'rsz rsz-w', { for: fk, param: 'frame.w', sel: sl, title: 'Kéo để đổi chiều rộng khung ảnh (bước 5%).',
    place: (tr, s) => { const r = relR(pic.getBoundingClientRect(), tr, s), g = relR(el.querySelector('.wrapbox').getBoundingClientRect(), tr, s), ia = el.getAttribute('data-ia'); return { left: ia === 'right' ? r.left : r.right, top: r.top, height: r.height, tip: `rộng ${Math.round(r.width / g.width * 100)}%` }; },
    move: ev => { const g = el.querySelector('.wrapbox').getBoundingClientRect(), ia = el.getAttribute('data-ia'), raw = ia === 'right' ? g.right - ev.clientX : ev.clientX - g.left, pct = clampN(Math.round(raw / g.width * 20) * 5, IW8[0], IW8[1]), fr = curTask(t).layout.frame, v = pct === IW8[2] ? null : pct; if ((fr.w ?? null) === v) return null; fr.w = v; el.style.setProperty('--iw', pct); return `rộng ${pct}%`; },
    reset: tt => { tt.layout.frame.w = null; } });
}
function hCellImg(t, el, key) {
  const box = el.querySelector(`.ci[data-ck="${key}"]`); if (!box) return;
  const cf = (tt, mk) => { tt.layout.cells = tt.layout.cells || {}; const c = tt.layout.cells[key] = tt.layout.cells[key] || {}; return (c.frame = c.frame || {}); };
  frameHandles(el, { pic: box.querySelector('.pic'), fk: `${t.id}:G1:${key}`, sl: { type: 'group', id: t.id, g: 'G1', item: key }, boxEl: box, attrFit: 'data-cf', attrIh: 'data-cih', min: 15,
    get: () => cellFr(curTask(t), key), mut: (fn, tt) => fn(cf(tt || curTask(t))) });
}
// Đáp án: tay kéo kích thước theo kiểu A (dòng, độ dài gạch, cỡ ô, khoảng cách lựa chọn…)
function hAnswer(t, el, key) {
  const a = t.answer, L = a.layout; if (!L) return;
  const q = key ? `[data-node="${t.id}:G3:${key}"]` : `[data-node^="${t.id}:G3:"], .a[data-node="${t.id}:G3"]`;
  const nodes = [...el.querySelectorAll(q)].filter(x => x.classList.contains('a') && !x.classList.contains('a4i') && !x.classList.contains('xl'));
  const n = nodes[0]; if (!n) return;
  const fk = key ? `${t.id}:G3:${key}` : `${t.id}:G3`, sl = key ? { type: 'group', id: t.id, g: 'G3', item: key } : { type: 'group', id: t.id, g: 'G3' };
  const setP = (tt, k, v) => { const p = tt.answer.params; if (key) { p.perItem = p.perItem || {}; (p.perItem[key] = p.perItem[key] || {})[k] = v; } else p[k] = v; };
  const eff = tt => pOf(tt, key ? { id: key } : null);
  const live = (prop, val, imp) => (key ? nodes : [...el.querySelectorAll(`[data-node^="${t.id}:G3"].a`)]).forEach(x => x.style.setProperty(prop, val, imp ? 'important' : ''));
  const sizeH = (target, param, mn, mx, def, step, title, unit, cssVar) => mkH(el, 'rsz rsz-w', { for: fk, param, sel: sl, title,
    place: (tr, s) => { const r = relR(target().getBoundingClientRect(), tr, s); return { left: r.right + 3 * MM, top: r.top - MM, height: Math.max(r.height + 2 * MM, 6 * MM), tip: `${String(eff(curTask(t))[param] ?? def).replace('.', ',')} ${unit}` }; },
    start: () => ({ l: target().getBoundingClientRect().left }),
    move: (ev, c) => { const mm = clampN(Math.round((ev.clientX - c.l) / c.s / MM / step) * step, mn, mx), tt = curTask(t); if (eff(tt)[param] === mm) return null; setP(tt, param, mm); live(cssVar, mm + 'mm'); return `${String(mm).replace('.', ',')} ${unit}`; },
    reset: tt => setP(tt, param, null) });
  if (L === 'A1' || L === 'A8') {
    const ln = L === 'A1' ? n.querySelector('.ln') : n;
    mkH(el, 'rsz rsz-h', { for: fk, param: 'lineMm', sel: sl, title: 'Kéo để đổi chiều cao dòng viết (bước 0,5 mm).',
      place: (tr, s) => { const r = relR(ln.getBoundingClientRect(), tr, s); return { left: r.left, width: Math.min(r.width, 40 * MM), top: r.bottom, tip: `dòng ${String(Math.round(r.height / MM * 2) / 2).replace('.', ',')} mm` }; },
      start: () => ({ top: ln.getBoundingClientRect().top }),
      move: (ev, c) => { const mm = clampN(Math.round((ev.clientY - c.top) / c.s / MM * 2) / 2, AGE[ws.age].line, 25), tt = curTask(t); if (Math.max(eff(tt).lineMm || 0, AGE[ws.age].line) === mm && eff(tt).lineMm) return null; setP(tt, 'lineMm', mm); live('--lh', mm + 'mm'); return `dòng ${String(mm).replace('.', ',')} mm`; },
      reset: tt => setP(tt, 'lineMm', null) });
    mkH(el, 'rsz rsz-w', { for: fk, param: 'w', sel: sl, title: 'Kéo để đổi độ rộng dòng (bước 5%).',
      place: (tr, s) => { const r = relR(n.getBoundingClientRect(), tr, s), al = eff(curTask(t)).align; return { left: al === 'right' ? r.left : r.right, top: r.top, height: Math.min(r.height, 20 * MM), tip: `rộng ${eff(curTask(t)).w || 100}%` }; },
      start: () => { const w0 = eff(curTask(t)).w || 100; return { w0, full: n.getBoundingClientRect().width / (w0 / 100) }; },
      move: (ev, c) => { const tt = curTask(t), pct = clampN(Math.round(dragPct(c, ev, c.w0, c.full, eff(tt).align) / 5) * 5, 40, 100), v = pct === 100 ? null : pct; if ((eff(tt).w ?? null) === v) return null; setP(tt, 'w', v); live('--aw', pct); return `rộng ${pct}%`; },
      reset: tt => setP(tt, 'w', null) });
  } else if (L === 'A2') {
    const inl = a.attach === 'inline';
    mkH(el, 'rsz rsz-w', { for: fk, param: inl ? 'lenMm' : 'width', sel: sl, title: inl ? 'Kéo để đổi độ dài gạch (bước 5 mm).' : 'Kéo để đổi độ rộng ô trống (bước 1 ký tự).',
      place: (tr, s) => { const r = relR(n.getBoundingClientRect(), tr, s); return { left: r.right, top: r.top - 2 * MM, height: Math.max(r.height, 6 * MM), tip: inl ? `dài ${Math.round(r.width / MM)} mm` : `${eff(curTask(t)).width || Math.round(parseFloat(n.style.width)) || ''} ký tự` }; },
      start: () => { const r = n.getBoundingClientRect(), chs = parseFloat(n.style.width) || 10; return { l: r.left, pxCh: /ch/.test(n.style.width) ? r.width / chs : MM * scaleNow() * 2.2 }; },
      move: (ev, c) => { const tt = curTask(t);
        if (inl) { const mm = clampN(Math.round((ev.clientX - c.l) / c.s / MM / 5) * 5, 15, 150); if (eff(tt).lenMm === mm && eff(tt).lenMode === 'fixed') return null; setP(tt, 'lenMm', mm); setP(tt, 'lenMode', 'fixed'); live('width', mm + 'mm'); return `dài ${mm} mm`; }
        const ch = clampN(Math.round((ev.clientX - c.l) / c.pxCh), 4, 30); if (eff(tt).width === ch) return null; setP(tt, 'width', ch); live('width', ch + 'ch', true); return `${ch} ký tự`; },
      reset: tt => { setP(tt, inl ? 'lenMm' : 'width', null); } });
  } else if (L === 'A3') sizeH(() => n.querySelector('i'), 'boxW', 5, 12, 6.5, .5, 'Kéo để đổi cỡ ô chữ (bước 0,5 mm).', 'mm', '--bw');
  else if (L === 'A4' && a.attach !== 'inline') {
    const o1 = n.querySelector('.opt');
    mkH(el, 'rsz rsz-w', { for: fk, param: 'gap', sel: sl, title: 'Kéo để đổi khoảng cách giữa các lựa chọn (bước 1 mm).',
      place: (tr, s) => { const r = relR(o1.getBoundingClientRect(), tr, s); return { left: r.right, top: r.top, height: r.height, tip: `cách ${eff(curTask(t)).gap ?? 7} mm` }; },
      start: () => ({ g0: eff(curTask(t)).gap ?? 7 }),
      move: (ev, c) => { const mm = clampN(Math.round(c.g0 + (ev.clientX - c.x0) / c.s / MM), 2, 20), tt = curTask(t); if ((eff(tt).gap ?? 7) === mm) return null; setP(tt, 'gap', mm); live('--og', mm + 'mm'); return `cách ${mm} mm`; },
      reset: tt => setP(tt, 'gap', null) });
  } else if (L === 'A5') sizeH(() => n, 'size', 4, 12, 6.5, .5, 'Kéo để đổi cỡ ô tick (bước 0,5 mm).', 'mm', '--as');
  else if (L === 'A6') sizeH(() => n.firstElementChild, 'size', 5, 12, 7.5, .5, 'Kéo để đổi cỡ ô T/F (bước 0,5 mm).', 'mm', '--as');
  else if (L === 'A7') sizeH(() => n, 'size', 1.5, 6, 2.8, .5, 'Kéo để đổi cỡ chấm nối (bước 0,5 mm).', 'mm', '--as');
}
function hBank(t, el) {
  const wb = t.wordBank; if (!wb) return; const fk = `${t.id}:G4`;
  if (wb.placement === 'right') { hSplit(t, el, fk, '@split'); return; }
  const g4 = el.querySelector('.g4'); if (!g4) return;
  mkH(el, 'rsz rsz-w', { for: fk, param: 'w', title: 'Kéo để đổi độ rộng khung từ (bước 5%).',
    place: (tr, s) => { const r = relR(g4.getBoundingClientRect(), tr, s); return { left: curTask(t).wordBank.align === 'right' ? r.left : r.right, top: r.top, height: r.height, tip: `rộng ${curTask(t).wordBank.w || 100}%` }; },
    start: () => { const w0 = curTask(t).wordBank.w || 100; return { w0, full: g4.getBoundingClientRect().width / (w0 / 100) }; },
    move: (ev, c) => { const tt = curTask(t), al = tt.wordBank.align || 'center', pct = clampN(Math.round(dragPct(c, ev, c.w0, c.full, al) / 5) * 5, 30, 100), v = pct === 100 ? null : pct; if ((tt.wordBank.w ?? null) === v) return null; tt.wordBank.w = v; g4.style.width = pct + '%'; g4.style.justifySelf = JS[al]; return `rộng ${pct}%`; },
    reset: tt => { tt.wordBank.w = null; } });
}
function placeTblHandles(el) {
  const s = scaleNow(), tr = el.getBoundingClientRect();
  el.querySelectorAll('.rsz-tc,.rsz-tr').forEach(h => {
    const g = h.__g; if (!g) return; const kids = [...g.children];
    if (h.classList.contains('rsz-tc')) {
      const k = +h.dataset.k, c = kids[1 + k], c0 = kids[1], r = c.getBoundingClientRect(), r0 = c0.getBoundingClientRect();
      h.style.left = (r.right - tr.left) / s + 'px'; h.style.top = (r0.top - tr.top) / s + 'px'; h.style.height = r0.height / s + 'px';
      h.querySelector('.tip').textContent = `${Math.round(r.width / (g.getBoundingClientRect().width - kids[0].getBoundingClientRect().width) * 100)}%`;
    } else {
      const c = kids.find(x => x.dataset.rk === h.dataset.rk), r = c.getBoundingClientRect(), gr = g.getBoundingClientRect();
      h.style.left = (gr.right - tr.left) / s + 'px'; h.style.top = (r.bottom - tr.top) / s + 'px';
      h.querySelector('.tip').textContent = `${Math.round(r.height / s / MM)} mm`;
    }
  });
}
function hTable(t, el, fk) {
  if (layoutOf(t) !== 'T9') return;
  const nC = t.content.cols.length, tot = nC + (tblOpts(t).rowHead ? 1 : 0);
  el.querySelectorAll('.tg').forEach(g => {
    g.dataset.tot = tot;
    const mk = (cls, title, param) => { const d = document.createElement('div'); d.className = 'rsz ' + cls; d.title = title; d.dataset.for = fk; d.dataset.param = param; d.innerHTML = '<span class="tip"></span>'; d.__g = g; el.appendChild(d); return d; };
    for (let k = 0; k < tot - 1; k++) { const h = mk('rsz-tc', 'Kéo để đổi độ rộng cột. Bấm đúp để về tự động.', 'tbl.cw'); h.dataset.k = k; bindTc(h, g, k); }
    const seen = new Set();
    [...g.children].forEach(c => { const rk = c.dataset.rk; if (rk == null || seen.has(rk)) return; seen.add(rk); const h = mk('rsz-tr', 'Kéo để đổi chiều cao hàng. Bấm đúp để về tự động.', 'tbl.rhs'); h.dataset.rk = rk; bindTr(h, g, rk); });
  });
  placeTblHandles(el);
  function bindTc(h, g, k) {
    h.addEventListener('dblclick', e => { e.stopPropagation(); commit(w => { const o = w.tasks.find(x => x.id === t.id).layout.table; if (o) o.cw = null; }); });
    h.addEventListener('pointerdown', e => {
      e.preventDefault(); e.stopPropagation(); h.setPointerCapture(e.pointerId);
      const before = clone(ws), kids = [...g.children], ws0 = kids.slice(1, 1 + tot).map(c => c.getBoundingClientRect().width), sx = e.clientX, s = scaleNow();
      const total = ws0.reduce((a, b) => a + b, 0), pair = ws0[k] + ws0[k + 1], minW = 10 * MM * s;
      let last = null;
      const move = ev => {
        const a = clampN(ws0[k] + (ev.clientX - sx), minW, pair - minW), w2 = ws0.slice(); w2[k] = a; w2[k + 1] = pair - a;
        const pc = w2.map(x => Math.round(x / total * 1000) / 10);
        pc[k + 1] = Math.round(((ws0[k] + ws0[k + 1]) / total * 100 - pc[k]) * 10) / 10;
        last = pc; el.querySelectorAll('.tg').forEach(n => n.style.setProperty('--tcols', pc.map(x => `minmax(0,${x}fr)`).join(' ')));
        placeTblHandles(el);
      };
      const up = () => {
        h.removeEventListener('pointermove', move); h.removeEventListener('pointerup', up); h.removeEventListener('pointercancel', up);
        if (last) { const tt = ws.tasks.find(x => x.id === t.id); tt.layout.table = Object.assign(tt.layout.table || {}, { cw: last }); hist.push(before); fut = []; }
        render();
      };
      h.addEventListener('pointermove', move); h.addEventListener('pointerup', up); h.addEventListener('pointercancel', up);
    });
  }
  function bindTr(h, g, rk) {
    h.addEventListener('dblclick', e => { e.stopPropagation(); commit(w => { const o = w.tasks.find(x => x.id === t.id).layout.table; if (o && o.rhs) { delete o.rhs[rk]; if (!Object.keys(o.rhs).length) o.rhs = null; } }); });
    h.addEventListener('pointerdown', e => {
      e.preventDefault(); e.stopPropagation(); h.setPointerCapture(e.pointerId);
      const before = clone(ws), s = scaleNow(), cells = el.querySelectorAll(`.tg > [data-rk="${rk}"]`), h0 = cells[0].getBoundingClientRect().height, sy = e.clientY;
      let last = null; el.querySelectorAll('.tg').forEach(n => { n.style.gridTemplateRows = 'none'; });
      const move = ev => { const mm = Math.max(6, Math.round((h0 + ev.clientY - sy) / s / MM)); last = mm; cells.forEach(c => { c.style.minHeight = mm + 'mm'; }); placeTblHandles(el); };
      const up = () => {
        h.removeEventListener('pointermove', move); h.removeEventListener('pointerup', up); h.removeEventListener('pointercancel', up);
        if (last != null) { const tt = ws.tasks.find(x => x.id === t.id), o = tt.layout.table = tt.layout.table || {}; o.rhs = Object.assign({}, o.rhs, { [rk]: last }); o.rows = 'auto'; hist.push(before); fut = []; }
        render();
      };
      h.addEventListener('pointermove', move); h.addEventListener('pointerup', up); h.addEventListener('pointercancel', up);
    });
  }
}
// Tay kéo theo container đang chọn
function addHandles() {
  if (sel.type === 'sheet') return;
  const t = ws.tasks.find(x => x.id === sel.id); if (!t) return;
  const el = stage.querySelector(`.task[data-task="${t.id}"]`); if (!el) return;
  const k = kindOf(t, sel), g2 = `${t.id}:G2`, elTF = [...stage.querySelectorAll(`.task[data-task="${t.id}"]`)].find(e => e.querySelector('.qb > .a6')) || el;   // v106: Task bị cắt trang: tay kéo T / F nằm ở mảnh có cột T / F
  if (k === 'task') { hSplit(t, el, g2); hT7(t, el, g2); hT6(t, el, g2); hTF(t, elTF, g2); hItemGap(t, el, g2); hGroupGap(t, el, g2); hWho(t, el, g2); hColGap(t, el, g2); hTable(t, el, g2); cellKeys(t, 'crow').forEach(key => hRowCell(t, el, key, false)); hFrame(t, el); }
  else if (k === 'frame') hFrame(t, el);
  else if (k === 'cimgs') cellKeys(t, 'cimg').forEach(key => hCellImg(t, el, key));
  else if (k === 'cimg') { hCellImg(t, el, sel.item); if (cellDirOf(t) === 'row') hRowCell(t, el, sel.item, false); }
  else if (k === 'crow') hRowCell(t, el, sel.item, true);
  else if (k === 'answer') { hAnswer(t, el, null); hTF(t, elTF, `${t.id}:G3`); }
  else if (k === 'aitem') { hAnswer(t, el, sel.item); hTF(t, elTF, `${t.id}:G3`); }
  else if (k === 'bank') hBank(t, el);
  placeAll(el); if (elTF !== el) placeAll(elTF);
}

/* ================= Mô hình container ================= */
// Mỗi thứ chọn được là một container. Loại container quyết định panel, tay kéo, thông số và cách "Áp cho…".
const GNAME = { GT: 'Khối tự do', G0: 'Tiêu đề', G1: 'Ảnh', G2: 'Nội dung', G3: 'Đáp án', G4: 'Khung từ' };
const TLS = { T1: 'Xếp dọc', T2: 'Ảnh trái', T3: 'Ảnh phải', T4: 'Hai cột', T5: 'Lưới', T6: 'Nội dung', T7: 'Nối', T8: 'Bao chữ', T9: 'Bảng' };
const cd = c => `<small class="cd">${c}</small>`;
function kindOf(t, s) {
  if (!s || s.type === 'sheet') return 'sheet';
  if (s.type === 'task') return 'task';
  if (s.tc) return 'cimg';
  const g = s.g, it = s.item;
  if (g === 'GT') return it && gtOf(t, it) ? 'gt' : 'task';
  if (g === 'G0') return 'head';
  if (g === 'G1') return it ? 'cimg' : (cellImgMode(t) && !t.image ? 'cimgs' : 'frame');   // v86: lưới ảnh có ảnh chung → G1 = ảnh chung (panel Ảnh chung); chỉnh mọi ô cùng lúc bằng "Áp cho · Cả Task"
  if (g === 'G2') return it ? 'crow' : 'task';
  if (g === 'G3') return it ? 'aitem' : 'answer';
  if (g === 'G4') return 'bank';
  return 'task';
}
// Đối tượng cấu hình của container (tham chiếu thật). mk = tạo nếu chưa có.
function cfgOf(t, s, mk) {
  const k = kindOf(t, s), L = t.layout;
  if (k === 'task' || k === 'frame') return L;
  if (k === 'cimg' || k === 'crow') { if (!L.cells) { if (!mk) return {}; L.cells = {}; } return L.cells[s.item] || (mk ? (L.cells[s.item] = {}) : {}); }
  if (k === 'answer') return t.answer.params;
  if (k === 'aitem') { const p = t.answer.params; if (!p.perItem) { if (!mk) return {}; p.perItem = {}; } return p.perItem[s.item] || (mk ? (p.perItem[s.item] = {}) : {}); }
  if (k === 'bank') return t.wordBank;
  if (k === 'gt') return gtOf(t, s.item) || {};
  return {};
}
function payloadOf(t, s) {
  const k = kindOf(t, s), L = t.layout;
  if (k === 'task') return { split: L.split, cols: L.cols, align: L.align, valign: L.valign, width: L.width, cw: L.cw, rowH: L.rowH, whoW: L.whoW, colGap: L.colGap, break: L.break, _sp: clone(t.spacing) };
  if (k === 'frame') return { frame: clone(L.frame || {}) };
  if (k === 'cimg') return { frame: clone(cellFr(t, s.item)) };
  if (k === 'crow') { const c = cellCfg(t, s.item); return { split: c.split ?? null, valign: c.valign ?? null, rowH: c.rowH ?? null }; }
  if (k === 'answer') { const o = clone(t.answer.params || {}); delete o.perItem; return o; }
  if (k === 'aitem') return clone(((t.answer.params || {}).perItem || {})[s.item] || {});
  if (k === 'bank') { const b = t.wordBank || {}; return { w: b.w ?? null, align: b.align ?? null, valign: b.valign ?? null, style: b.style, label: b.label, placement: b.placement }; }
  return {};
}
function pasteInto(t, s, pl) {
  const k = kindOf(t, s), L = t.layout;
  if (k === 'task') Object.keys(pl).forEach(x => { if (x === '_sp') t.spacing = clone(pl._sp); else L[x] = clone(pl[x] ?? null); });
  else if (k === 'frame') L.frame = clone(pl.frame || {});
  else if (k === 'cimg') cfgOf(t, s, true).frame = clone(pl.frame || {});
  else if (k === 'crow') Object.assign(cfgOf(t, s, true), clone(pl));
  else if (k === 'answer') { const pi = t.answer.params.perItem; t.answer.params = clone(pl); if (pi) t.answer.params.perItem = pi; }
  else if (k === 'aitem') { const p = t.answer.params; p.perItem = p.perItem || {}; p.perItem[s.item] = clone(pl); }
  else if (k === 'bank' && t.wordBank) Object.assign(t.wordBank, clone(pl));
  tidy(t);
}
const flat = (o, pre = '', out = {}) => { Object.keys(o || {}).forEach(k => { const v = o[k], p = pre + k; if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, p + '.', out); else out[p] = v; }); return out; };
function setRaw(obj, path, v) {
  const ks = path.split('.'); let o = obj;
  for (let i = 0; i < ks.length - 1; i++) { if (o[ks[i]] == null) o[ks[i]] = {}; o = o[ks[i]]; }
  o[ks[ks.length - 1]] = v;
}
// Kéo một container khi đang chọn nhiều: các container cùng loại nhận đúng phần đã đổi
function propagate(before, src) {
  const tg = selTargets(ws).filter(([t, s]) => nodeKey(s) !== nodeKey(src)); if (!tg.length) return;
  const t1 = ws.tasks.find(x => x.id === src.id), t0 = before.tasks.find(x => x.id === src.id); if (!t1 || !t0) return;
  const a = flat(payloadOf(t1, src)), b = flat(payloadOf(t0, src));
  const ch = Object.keys(Object.assign({}, a, b)).filter(p => JSON.stringify(a[p] ?? null) !== JSON.stringify(b[p] ?? null));
  tg.forEach(([t, s]) => { if (kindOf(t, s) !== kindOf(t1, src)) return; const c = cfgOf(t, s, true); ch.forEach(p => { if (p.startsWith('_sp.')) setRaw(t.spacing, p.slice(4), a[p] ?? undefined); else if (kindOf(t, s) === 'cimg') setRaw(c, p, a[p] ?? null); else setRaw(c, p, a[p] ?? null); }); tidy(t); });
}
// Các container đang được chỉnh: container chính + các container chọn thêm (cùng loại). Chọn nhóm Ảnh của Lưới = mọi ô ảnh.
function selTargets(w) {
  if (sel.type === 'sheet') return [];
  const t0 = w.tasks.find(x => x.id === sel.id); if (!t0) return [];
  const k0 = kindOf(t0, sel);
  if (k0 === 'cimgs') return cellKeys(t0, 'cimg').map(k => [t0, { type: 'group', id: t0.id, g: 'G1', item: k }]);
  return [sel, ...multi].map(s => [w.tasks.find(x => x.id === s.id), s]).filter(([t, s]) => t && kindOf(t, s) === k0);
}
function setPath(t, s, p, v) {
  if (p.startsWith('sp.')) { const k = p.slice(3); if (v == null) delete t.spacing.overrides[k]; else t.spacing.overrides[k] = v; return; }
  let baseObj, path = p;
  if (p[0] === '@') { baseObj = t.layout; path = p.slice(1); }
  else if (p.startsWith('tbl.')) { t.layout.table = t.layout.table || {}; baseObj = t.layout.table; path = p.slice(4); }
  else baseObj = cfgOf(t, s, true);
  const ks = path.split('.'); let o = baseObj;
  for (let i = 0; i < ks.length - 1; i++) { if (o[ks[i]] == null) o[ks[i]] = /^\d+$/.test(ks[i + 1]) ? [] : {}; o = o[ks[i]]; }
  const last = ks[ks.length - 1];
  if (Array.isArray(o)) o[+last] = v; else if (v == null && !(baseObj === t.layout && ks.length === 1)) delete o[last]; else o[last] = v;
  postSet(t, s, p, v);
}
// Hệ quả của một thay đổi (giữ dữ liệu nhất quán)
function postSet(t, s, p, v) {
  const L = t.layout, c = cfgOf(t, s, true);
  if (p === 'frame.fit' && c.frame) { c.frame.ox = c.frame.oy = c.frame.zoom = null; }
  if (p === 'frame.h' && v != null) { c.frame = c.frame || {}; if (!c.frame.fit) c.frame.fit = 'width'; }
  if (p === 'dir') { L.cols = null; L.split = null; }
  if (p.startsWith('cw.')) {
    if (v == null) L.cw = null;
    else { const cw = t7cw(t).slice(), i = +p.slice(3); cw[i] = clampN(v, 10, 80); const rest = 100 - cw[i], oth = [0, 1, 2].filter(j => j !== i), sum = oth.reduce((a, j) => a + (L.cw && L.cw[j] != null ? L.cw[j] : T7CW[j]), 0); oth.forEach(j => { cw[j] = Math.round((L.cw && L.cw[j] != null && j !== i ? L.cw[j] : T7CW[j]) / sum * rest * 10) / 10; }); L.cw = cw; }
  }
  if (p === 'lenMm' && v != null) c.lenMode = 'fixed';
  if (p === '@ta' && L.align === 'justify') L.align = null;   // v97: bỏ cách ghi cũ của Ảnh trong bài đọc
  if (p.startsWith('tbl.')) {
    const o = L.table;
    if (p === 'tbl.cols') o.cw = null;
    if (p === 'tbl.fc' && v) o.fr = 'none';
    if (p === 'tbl.nm') { delete o.num; if (v == null) o.nm = 'out'; }   // v96: dữ liệu cũ num:false không còn che lựa chọn mới
    if (p.startsWith('tbl.cw.')) { const i = +p.split('.')[2], cur = tblColPct(t); if (v == null) o.cw = null; else { const pct = clampN(v, 5, 90), rest = 100 - pct, oth = cur.map((x, j) => j).filter(j => j !== i), sum = oth.reduce((a, j) => a + cur[j], 0) || 1; const n = cur.slice(); n[i] = pct; oth.forEach(j => { n[j] = Math.round(cur[j] / sum * rest * 10) / 10; }); o.cw = n; } }
    if (p.startsWith('tbl.rhs.') && v != null) o.rows = 'auto';
  }
}
// Độ rộng hiện tại các cột bảng (%), đo trên trang nếu cần
function tblColPct(t) {
  const o = tblOpts(t), nC = t.content.cols.length, tot = nC + (o.rowHead ? 1 : 0);
  if (Array.isArray(o.cw) && o.cw.length === tot) return o.cw.slice();
  const g = stage.querySelector(`.task[data-task="${t.id}"] .tg`);
  if (g) { const kids = [...g.children].slice(1, 1 + tot).map(c => c.getBoundingClientRect().width), sum = kids.reduce((a, b) => a + b, 0); if (sum) return kids.map(x => Math.round(x / sum * 1000) / 10); }
  return Array(tot).fill(Math.round(1000 / tot) / 10);
}
const SCOPES = [['col', 'Ô cùng cột'], ['task', 'Cả Task'], ['type', 'Task cùng dạng'], ['sheet', 'Cả phiếu']];
function targetsOf(t, s, scope) {
  const k = kindOf(t, s), out = [], same = x => presetKey(x) === presetKey(t), me = nodeKey(s);
  const push = s2 => { if (nodeKey(s2) !== me) out.push(s2); };
  if (k === 'cimg' || k === 'crow' || k === 'cimgs') {
    const kk = k === 'crow' ? 'crow' : 'cimg', ks = cellKeys(t, kk), g = s.g;
    if (scope === 'col' && k !== 'cimgs') { const n = colsOf(t), ids = its(t).map(i => i.id), base0 = String(s.item).split('.'), i0 = ids.indexOf(base0[0]); ks.forEach(x => { const b = String(x).split('.'), i = ids.indexOf(b[0]); if (i % n === i0 % n && (b[1] == null || b[1] === base0[1])) push({ type: 'group', id: t.id, g, item: x }); }); }
    if (scope === 'task' && k !== 'cimgs') ks.forEach(x => push({ type: 'group', id: t.id, g, item: x }));
    if (scope === 'type' || scope === 'sheet') ws.tasks.forEach(t2 => { if (scope === 'type' && !same(t2)) return; if (k !== 'cimgs' || t2 !== t) cellKeys(t2, kk).forEach(x => push({ type: 'group', id: t2.id, g, item: x })); });
  } else if (k === 'aitem') { if (scope === 'task') itemKeys(t).forEach(x => push({ type: 'group', id: t.id, g: 'G3', item: x })); }
  else if (k === 'frame') { if (scope === 'type' || scope === 'sheet') ws.tasks.forEach(t2 => { if (t2.image && !cellImgMode(t2) && (scope === 'sheet' || same(t2))) push({ type: 'group', id: t2.id, g: 'G1' }); }); }
  else if (k === 'answer') { if (scope === 'type' || scope === 'sheet') ws.tasks.forEach(t2 => { if (t2.answer.layout === t.answer.layout && (scope === 'sheet' || same(t2))) push({ type: 'group', id: t2.id, g: 'G3' }); }); }
  else if (k === 'bank') { if (scope === 'type' || scope === 'sheet') ws.tasks.forEach(t2 => { if (t2.wordBank && (scope === 'sheet' || same(t2))) push({ type: 'group', id: t2.id, g: 'G4' }); }); }
  else if (k === 'task') { if (scope === 'type' || scope === 'sheet') ws.tasks.forEach(t2 => { if (scope === 'sheet' || same(t2)) push({ type: 'task', id: t2.id }); }); }
  return out;
}
function applyScope(scope) {
  const t = curT(ws), k = kindOf(t, sel), tg = targetsOf(t, sel, scope); if (!tg.length) return;
  const src = k === 'cimgs' ? { type: 'group', id: t.id, g: 'G1', item: cellKeys(t, 'cimg')[0] } : sel;
  commit(w => {
    const ts = w.tasks.find(x => x.id === t.id);
    if (k === 'task' && scope === 'type') { tg.forEach(s => { const x = w.tasks.find(y => y.id === s.id); const b0 = x.layout.break; x.layout = clone(ts.layout); x.layout.break = b0; x.spacing = clone(ts.spacing); x.answer.attach = ts.answer.attach; x.answer.layout = ts.answer.layout; x.answer.params = clone(ts.answer.params); tidy(x); }); return; }
    const pl = payloadOf(ts, src);
    if (k === 'task' && scope === 'sheet') { tg.forEach(s => { const x = w.tasks.find(y => y.id === s.id); x.spacing = clone(ts.spacing); if (x.layout.break !== 'join' && ts.layout.break !== 'join') x.layout.break = ts.layout.break; }); return; }
    tg.forEach(s => pasteInto(w.tasks.find(y => y.id === s.id), s, pl));
  }, `Đã áp cho ${tg.length} container`);
}
// Container có chỉnh tay không (chấm xanh trên cây)
function ovOf(t, s) {
  const k = kindOf(t, s), L = t.layout;
  if (k === 'task') return L.task !== 'auto' || ['split', 'cols', 'dir', 'align', 'valign', 'width', 'cw', 'rowH', 'whoW', 'colGap', 'break', 'table', 'num', 'order'].some(x => L[x] != null) || !!t.spacing.preset || Object.keys(t.spacing.overrides).length > 0;
  if (k === 'frame') return Object.keys(L.frame || {}).length > 0;
  if (k === 'gt') { const x = gtOf(t, s.item) || {}; return x.size != null || x.align != null || x.frame != null || x.w != null || x.cols != null; }
  if (k === 'cimgs') return cellKeys(t, 'cimg').some(x => Object.keys(cellFr(t, x)).length);
  if (k === 'cimg') return Object.keys(cellFr(t, s.item)).length > 0;
  if (k === 'crow') { const c = cellCfg(t, s.item); return c.split != null || c.valign != null || c.rowH != null; }
  if (k === 'answer') return Object.keys(payloadOf(t, s)).length > 0;
  if (k === 'aitem') return Object.keys(payloadOf(t, s)).length > 0;
  if (k === 'bank') { const b = t.wordBank, o = (baseTask(t) || {}).wordBank || {}; return b.w != null || b.align != null || b.valign != null || (o.placement && (b.placement !== o.placement || b.style !== o.style || (b.label || 'lower') !== (o.label || 'lower'))); }
  return false;
}
const baseTask = t => base.tasks.find(x => x.id === t.id);
function autoReset(t, s) {
  const k = kindOf(t, s), L = t.layout;
  if (k === 'task') { t.layout = LAYOUT_DEF(); t.spacing = { preset: null, overrides: {} }; }
  else if (k === 'frame') L.frame = {};
  else if (k === 'gt') { const x = gtOf(t, s.item); if (x) { delete x.size; delete x.align; delete x.frame; delete x.w; delete x.cols; } }
  else if (k === 'cimg') { const c = cfgOf(t, s, true); c.frame = null; }
  else if (k === 'crow') Object.assign(cfgOf(t, s, true), { split: null, valign: null, rowH: null });
  else if (k === 'answer') t.answer.params = {};
  else if (k === 'aitem') { const p = t.answer.params; if (p.perItem) delete p.perItem[s.item]; }
  else if (k === 'bank') { const o = (baseTask(t) || {}).wordBank || {}; Object.assign(t.wordBank, { w: null, align: null, valign: null }); if (o.placement) Object.assign(t.wordBank, { placement: o.placement, style: o.style, label: o.label }); }
  tidy(t);
}

/* ================= Cây container ================= */
function groupsOf(t) {
  const g = ['G0']; if (t.image || cellImgMode(t)) g.push('G1'); if (t.wordBank) g.push('G4'); if (ck(t) !== 'empty') g.push('G2');
  if (t.answer.layout) g.push('G3'); return g;
}
function hasOverride(t) { return ovOf(t, { type: 'task', id: t.id }) || Object.keys(frOf(t)).length > 0 || !!t.layout.cells; }
const isOnSel = s2 => [sel, ...multi].some(x => nodeKey(x) === nodeKey(s2));
// Task đang mở trong cột trái: chỉ một Task mở một lúc (accordion). Chuyển sang Task khác thì Task cũ tự thu gọn.
let openTask = null, lastSelTask = null, openedRendered = null;
function renderTree() {
  const tree = document.getElementById('tree');
  if (sel.type !== 'sheet') { if (sel.id !== lastSelTask) openTask = sel.id; lastSelTask = sel.id; }
  if (openTask && openTask !== sectFor) sectReset(openTask);
  if (sel.type === 'group' && sel.id === openTask && G_SEC[sel.g]) { const tt = ws.tasks.find(x => x.id === openTask), kk = tt && secOfSel(tt, sel); if (kk && !SECT[kk]) sectOne(kk); }   // ảnh của từng câu (group G1 nhưng không có ảnh chung) thuộc mục G3   // v83: chọn khối trên trang thì cột trái mở đúng mục
  let h = `<div class="ttools"><button class="btn pri" data-lib="1" title="Thêm Task vào cuối phiếu: từ mẫu có sẵn, hoặc từ file / dán (JSON, MD, chữ)">+ Task</button><button class="btn" data-newsheet="1" title="Tạo phiếu mới: từ file JSON / MD / chữ, hoặc phiếu trống. Thay phiếu đang mở sau khi xác nhận.">+ Phiếu</button></div><button class="tnode ${sel.type === 'sheet' ? 'on' : ''}" data-sel="sheet"><b>Phiếu</b><span class="tag">${ws.tasks.length} Task</span></button><ul class="tks">`;
  for (const t of ws.tasks) {
    const open = openTask === t.id, on = isOnSel({ type: 'task', id: t.id });
    h += `<li class="tk ${open ? 'open' : ''}${open && sel.type !== 'sheet' && sel.id === t.id ? ' cur' : ''}" data-tk="${t.id}"><div class="tkh"><button class="tnode ${on ? 'on' : open ? 'opn' : ''}" data-sel="task" data-id="${t.id}" aria-expanded="${open}"><span class="chev" title="${open ? 'Thu gọn Task' : 'Mở Task để soạn'}">▶</span><span class="n${t.part ? ' pt' : ''}">${t.number}${t.part || ''}</span><span class="tnm">${esc(taskLabel(t))}</span>${hasOverride(t) ? '<span class="ovmark" title="Có chỉnh tay"></span>' : ''}</button></div>`;
    if (open) h += `<div class="tkb">${edHtml(t)}</div>`;
    h += '</li>';
  }
  tree.innerHTML = h + '</ul>';
  if (openTask !== openedRendered) { openedRendered = openTask; const el = tree.querySelector('.tk.open'); if (el) el.scrollIntoView({ block: 'start' }); }
}

/* ================= Inspector ================= */
const ICON = {
  T1: '<rect x="2" y="2" width="32" height="4"/><rect class="i1" x="2" y="8" width="32" height="8"/><rect x="2" y="18" width="32" height="4"/><rect class="i3" x="2" y="24" width="32" height="3"/>',
  T2: '<rect x="2" y="2" width="32" height="4"/><rect class="i1" x="2" y="8" width="11" height="19"/><rect x="15" y="8" width="19" height="9"/><rect class="i3" x="15" y="19" width="19" height="8"/>',
  T3: '<rect x="2" y="2" width="32" height="4"/><rect x="2" y="8" width="19" height="9"/><rect class="i3" x="2" y="19" width="19" height="8"/><rect class="i1" x="23" y="8" width="11" height="19"/>',
  T4: '<rect x="2" y="2" width="32" height="4"/><rect class="i1" x="2" y="8" width="32" height="6"/><rect x="2" y="16" width="20" height="11"/><rect class="i3" x="24" y="16" width="10" height="11"/>',
  T5: '<rect x="2" y="2" width="32" height="4"/><rect class="i1" x="2" y="8" width="10" height="9"/><rect class="i1" x="13" y="8" width="10" height="9"/><rect class="i1" x="24" y="8" width="10" height="9"/><rect class="i1" x="2" y="18" width="10" height="9"/><rect class="i1" x="13" y="18" width="10" height="9"/><rect class="i1" x="24" y="18" width="10" height="9"/>',
  T6: '<rect x="2" y="2" width="32" height="4"/><rect x="2" y="8" width="32" height="12"/><rect class="i3" x="2" y="22" width="32" height="5"/>',
  T7: '<rect x="2" y="2" width="32" height="4"/><rect x="2" y="9" width="11" height="4"/><rect x="2" y="15" width="11" height="4"/><rect x="2" y="21" width="11" height="4"/><rect x="23" y="9" width="11" height="4"/><rect x="23" y="15" width="11" height="4"/><rect x="23" y="21" width="11" height="4"/><path class="i3" d="M14 11 L22 23 M14 17 L22 11" fill="none"/>',
  T8: '<rect x="2" y="2" width="32" height="4"/><rect x="2" y="8" width="32" height="3"/><rect x="2" y="13" width="20" height="3"/><rect x="2" y="18" width="20" height="3"/><rect class="i1" x="24" y="13" width="10" height="8"/><rect class="i3" x="2" y="23" width="32" height="4"/>',
  T9: '<rect x="2" y="2" width="32" height="4"/><rect class="i1" x="2" y="8" width="32" height="4"/><rect x="2" y="12" width="10" height="15"/><rect x="12" y="12" width="22" height="5"/><rect x="12" y="17" width="22" height="5"/><rect x="12" y="22" width="22" height="5"/>'
};
const layIcon = L => `<svg viewBox="0 0 36 29" fill="none" stroke="currentColor" stroke-width="1">${ICON[L]}</svg>`;
const isSet = v => v !== undefined && v !== null && v !== '';
const fmtN = v => String(v).replace('.', ',');
// Ô thông số chuẩn: nhãn, điều khiển, chấm "đã chỉnh tay", nút ↺ về tự động
function fld(p, label, ctrl, man, def, cls = '') {
  return `<div class="fld ${cls} ${man ? 'ov' : ''}" data-param="${p}"><span class="fl">${label}</span><span class="fc">${ctrl}</span><button class="rst" data-act="rst" data-p="${p}" ${man ? '' : 'hidden'} title="Về tự động${isSet(def) ? ` (${fmtN(def)})` : ''}" aria-label="Về tự động">↺</button></div>`;
}
function fNum(p, label, val, o) {
  return fld(p, label + (o.unit ? ` (${o.unit})` : ''), `<input type="number" data-pv="${p}" min="${o.min}" max="${o.max}" step="${o.step || 1}" placeholder="${isSet(o.def) ? fmtN(o.def) : 'tự động'}" value="${isSet(val) ? val : ''}" aria-label="${esc(label)}">`, isSet(val), o.def, 'n');
}
function fSeg(p, label, val, opts, def, o = {}) {
  const cur = isSet(val) ? val : def, dn = (opts.find(x => String(x[0]) === String(def)) || [])[1];
  return fld(p, label, `<span class="seg wrapseg">${opts.map(([v, n, dis]) => `<button data-act="set" data-p="${p}" data-v="${v}" data-def="${def}" class="${String(cur) === String(v) ? 'on' : ''}" ${dis ? `disabled title="${esc(dis)}"` : ''}>${n}</button>`).join('')}</span>${o.hint ? `<span class="hint fh">${o.hint}</span>` : ''}`, isSet(val), dn, 's');
}
function fRange(p, label, val, o) {
  const v = isSet(val) ? val : o.def, f = o.fmt || (x => x);
  return fld(p, label, `<span class="rng"><input type="range" data-pr="${p}" data-def="${o.def}" data-fmt="${o.fmtKey || ''}" min="${o.min}" max="${o.max}" step="${o.step || 5}" value="${v}" aria-label="${esc(label)}"><output>${f(v)}</output></span>`, isSet(val), f(o.def), 's');
}
const sec = (key, name, html) => html ? `<section class="psec" data-sec="${key}"><h3>${name}</h3>${html}</section>` : '';
function crumb(t, s) {
  // Chỉ liệt kê cấp cha (bấm để lên); tên mục đang chọn nằm ở tiêu đề bên dưới
  let h = `<div class="crumb"><button data-sel="sheet">Phiếu</button>`;
  if (s.type === 'task') return h + '</div>';
  h += ` › <button data-sel="task" data-id="${t.id}">Task ${t.number}</button>`;
  if (s.item) h += ` › <button data-sel="group" data-id="${t.id}" data-g="${s.g}">${GNAME[s.g]}</button>`;
  return h + '</div>';
}
function autoSec(t, s, extra = '') {
  const man = ovOf(t, s);
  const sc = SCOPES.map(([v, n]) => [v, n, targetsOf(t, s, v).length]).filter(x => x[2]).map(([v, n, c]) => `<button data-act="scope" data-v="${v}" title="Áp cho ${c} container">${n} · ${c}</button>`).join('');
  const st = (man ? '<button class="btn" data-act="auto">Về tự động</button>' : '') + extra;
  return (st ? `<div class="stack">${st}</div>` : '') + (sc ? `<div class="field" style="margin-top:10px"><span>Áp thông số của container này cho</span><div class="seg wrapseg scopes">${sc}</div></div>` : '') + `${multi.length ? `<p class="hint">Đang chọn ${multi.length + 1} container cùng loại: mọi thay đổi áp cho tất cả.</p>` : ''}`;
}
function panel(t, s, title, o) {
  return crumb(t, s) + `<h2>${title}</h2>` + (o.diag || '') + (o.top || '') + sec('size', 'Kích thước', o.size) + sec('align', 'Căn lề', o.align) + sec('content', o.cname || 'Nội dung', o.content) + sec('break', 'Ngắt trang', o.brk) + sec('auto', 'Về tự động', autoSec(t, s, o.autoExtra));
}
function diagBox(d) {
  return `<div class="diag"><div>${esc(d.msg)}</div><div class="fixes">${(d.fixes || []).map(f => `<button class="btn" data-act="fix" data-id="${d.id}" data-v="${f.v}">${esc(f.label)}</button>`).join('')}${sel.type === 'sheet' ? `<button class="lnk" data-sel="task" data-id="${d.id}">Mở Task</button>` : ''}</div></div>`;
}
const diagFor = t => (lastRes ? lastRes.diags.filter(d => d.id === t.id) : []).map(diagBox).join('');
function presetSeg(cur, act, withInherit) {
  const opts = (withInherit ? [['', 'Theo phiếu']] : []).concat(Object.keys(PRESETS).map(k => [k, PRESET_NAME[k]]), [['free', 'Tự do']]);
  return `<div class="seg wrapseg">${opts.map(([k, n]) => `<button data-act="${act}" data-v="${k}" class="${(cur || '') === k ? 'on' : ''}">${n}</button>`).join('')}</div>`;
}
function numRow(scope, key, val, inh, ov) {
  const label = scope === 'task' && key === 'gapTask' ? 'Cách Task phía trên' : SP_LABEL[key];
  return `<div class="fld n ${ov ? 'ov' : ''}" data-param="sp.${key}"><label class="fl" for="sp-${scope}-${key}">${label} (mm)</label><span class="fc"><input id="sp-${scope}-${key}" type="number" step="0.5" min="${MINS[key]}" value="${val}" data-sp="${scope}" data-key="${key}"></span><button class="rst" data-act="rst-sp" data-sp="${scope}" data-key="${key}" ${ov ? '' : 'hidden'} title="Về mặc định (${fmtN(inh)} mm)" aria-label="Về mặc định">↺</button></div>`;
}
// Thứ tự gợi ý các layout hợp lệ (Tự động đứng đầu); giai đoạn 3 thay bằng điểm số
function rankLayouts(t) { const why = layoutReasons(t); return Object.keys(TL).filter(k => !why[k]); }
function layoutPicker(t) {
  const lay = t.layout, why = layoutReasons(t), locked = Object.keys(TL).filter(k => why[k]), auto = autoLayout(t), rk = rankLayouts(t);
  const btn = (k, label, extra = '') => `<button class="lay ${lay.task === k ? 'on' : ''}" data-act="layout" data-v="${k}" title="${k === 'auto' ? 'Hệ thống tự chọn' : `${TL[k].name} (${k})`}">${layIcon(k === 'auto' ? auto : k)}<span>${label}</span>${extra}</button>`;
  return `<h3>Bố cục bài</h3><div class="lay-grid">${btn('auto', 'Tự động', `<small class="cd">${TLS[auto]}</small>`)}${rk.map(k => btn(k, TL[k].name, cd(k) + (rkNote(t, k)))).join('')}</div>` +
    (locked.length ? `<details class="why"><summary>Vì sao không dùng được (${locked.length})</summary><ul>${locked.map(k => `<li><b>${TL[k].name}</b> ${cd(k)}: ${esc(why[k])}</li>`).join('')}</ul></details>` : '');
}
let rkNote = () => '';
function taskPanel(t, s) {
  const L = layoutOf(t), lay = t.layout, m = rmeta(t, L), cr = colsRange(t, L), sp = spacingOf(t), inh = inheritedSpacing(t), wbR = t.wordBank && t.wordBank.placement === 'right', row = cellDirOf(t) === 'row';
  let size = '', align = '', content = '';
  if (ratioOf(t) != null && !row) size += fRange('split', L === 'T6' ? 'Tỉ lệ nội dung / khung từ' : L === 'T4' ? 'Tỉ lệ câu hỏi / đáp án' : 'Tỉ lệ ảnh / nội dung', lay.split, { min: m.range[0], max: m.range[1], step: 5, def: m.ratio, fmt: r => `${r} / ${100 - r}`, fmtKey: 'split' });
  if (L === 'T7') { ['Cột trái', 'Cột nối', 'Cột phải'].forEach((n, i) => { size += fNum('cw.' + i, n, lay.cw ? lay.cw[i] : null, { min: 10, max: 80, step: 5, unit: '%', def: T7CW[i] }); }); size += fNum('rowH', 'Chiều cao hàng', lay.rowH, { min: 8, max: 40, unit: 'mm', def: 'tự động' }); }
  if (cr) { const opts = []; for (let c = cr[0]; c <= cr[1]; c++) opts.push([c, c]); size += fSeg('cols', 'Số cột', lay.cols, opts, Math.min(cr[1], Math.max(cr[0], colsDefault(t, L)))); }
  if (L === 'T5' && !row && colsOf(t) > 1) size += fNum('colGap', 'Khoảng cách giữa các cột', lay.colGap, { min: 2, max: 20, unit: 'mm', def: sp.itemGap });
  if (L === 'T6' && !wbR) size += fNum('width', 'Độ rộng khối nội dung', lay.width, { min: 40, max: 100, step: 5, unit: '%', def: 100 });
  if (ck(t) === 'dialogue') size += fNum('whoW', 'Cột tên người nói', lay.whoW, { min: 6, max: 40, unit: 'mm', def: 'tự động' });
  if (L === 'T9') size += tblOpts(t).cross ? fNum('tbl.xc', 'Cỡ ô', (t.layout.table || {}).xc, { min: 6, max: 16, step: 1, unit: 'mm', def: 10 }) : tblSize(t);
  size += `<h4>Khoảng cách</h4><div class="fld s ${t.spacing.preset ? 'ov' : ''}" data-param="sp.preset"><span class="fl">Mức khoảng cách</span><span class="fc">${presetSeg(t.spacing.preset, 'task-preset', true)}</span><button class="rst" data-act="task-preset" data-v="" ${t.spacing.preset ? '' : 'hidden'} title="Về theo phiếu" aria-label="Về tự động">↺</button></div>` + Object.keys(SP_LABEL).map(k => numRow('task', k, sp[k], inh[k], k in t.spacing.overrides)).join('');
  if (L === 'T5' && !row) align += fSeg('align', 'Căn nội dung trong ô', lay.align, Object.entries(HA), 'left');
  if (L === 'T6' && !wbR) align += fSeg('align', 'Vị trí khối nội dung', lay.align, Object.entries(HA), 'left', { hint: lay.width ? '' : 'Có tác dụng khi độ rộng nhỏ hơn 100%.' });
  if (['T2', 'T3', 'T4', 'T7'].includes(L) || (L === 'T6' && wbR) || row) align += fSeg('valign', row ? 'Căn dọc các hàng (mặc định cho mọi ô)' : 'Căn dọc các cột', lay.valign, Object.entries(VA), ['T4', 'T7'].includes(L) || row ? 'center' : 'top');
  align += fSeg('@ta', 'Căn lề Khối text', taOf(t), TA, 'left', { hint: 'Áp cho hướng dẫn, bài đọc / lời dẫn và khối tự do chữ (khối nào chỉnh riêng thì theo khối đó). Có mã QR file nghe thì lề phải của hướng dẫn là mép trái mã QR.' });   // v97
  if (L === 'T9') align += tblOpts(t).cross ? fSeg('tbl.align', 'Vị trí ô chữ', (lay.table || {}).align, Object.entries(HA), 'center') : fSeg('tbl.align', 'Căn lề nội dung ô', (lay.table || {}).align, Object.entries(HA), 'left');
  if (L === 'T1' && ck(t) === 'empty') align += `<p class="hint" data-na="align">Bài chỉ có ảnh: căn lề nằm ở ảnh.</p>`;
  if (L === 'T5' && t.content.variant !== 'multi') content += fSeg('dir', 'Hướng ô (ảnh so với chữ)', lay.dir, [['col', 'Ảnh trên'], ['row', 'Ảnh trái']], dirDefault(t));
  if (L === 'T9') content += tblKind(t) + (!tblOpts(t).cross && (t.content.rows || []).some(r => r.cells.some(v => v && (v.ans != null || v.ok))) ? fSeg('tbl.key', 'Hiện đáp án (bản giáo viên)', (t.layout.table || {}).key, [[true, 'Hiện'], [false, 'Ẩn']], false, { hint: 'Ẩn: ô "=…" in trống, ô tích để trống cho học sinh. Hiện: in chữ đáp án vào ô, ô tích đúng có ✓ và tô nền.' }) : '') + (tblOpts(t).cross ? fSeg('tbl.key', 'Hiện đáp án (bản giáo viên)', (t.layout.table || {}).key, [[true, 'Hiện'], [false, 'Ẩn']], false, { hint: 'Ẩn: học sinh thấy ô trống. Hiện: in chữ đáp án vào ô để làm bản đáp án.' }) : tblStyle(t));
  if (cellImgMode(t)) content += `<p class="hint">Mỗi ảnh là một container: bấm vào ảnh trên trang để chỉnh riêng.</p>`;
  if (its(t).length > 1 && !['table', 'empty'].includes(ck(t))) content += fSeg('@num', 'Số câu ở lề', lay.num, [['on', 'Hiện'], ['off', 'Ẩn']], 'on', { hint: 'Ẩn khi học sinh phải tự điền số vào chỗ trống (bài xếp thứ tự), để số ở lề khỏi lẫn với số phải điền.' });
  if (its(t).length > 1 && lay.num !== 'off' && !['table', 'empty'].includes(ck(t))) content += fSeg('@nlab', 'Kiểu số câu', lay.nlab, [['n', '1 2 3'], ['a', 'a b c']], 'n', { hint: 'Chữ a, b, c khi phiếu gốc đánh a–h (vd bài nối từ với nghĩa).' });
  if (ck(t) === 'pairs') content += fSeg('@mbd', 'Viền hai vế', lay.mbd, [['off', 'Không'], ['on', 'Có']], 'off', { hint: 'Khung viền quanh chữ của vế trái và vế phải (bật / tắt cùng lúc).' });   // v103
  const brk = fSeg('break', 'Trước và sau Task này', lay.break, [['auto', 'Tự động'], ['page', 'Sang trang mới'], ['keep', 'Giữ liền Task sau'], ['join', 'Nối vào Task trên', ws.tasks[0] === t ? 'Task đầu phiếu không nối được' : '']], 'auto', { hint: lay.break === 'join' ? 'Phần tiếp của Task trên: không số, không tiêu đề (chỉ giữ hướng dẫn riêng nếu có), luôn đi liền Task trên, cách trên bằng khoảng cách giữa các nhóm. Mỗi phần giữ đáp án riêng.' : '' });
  return panel(t, s, `Task ${t.number} · ${esc(taskLabel(t))} ${cd(t.typeId)}`, { diag: diagFor(t), top: layoutPicker(t), size, align, content, cname: 'Kiểu trình bày', brk });
}
function tblSize(t) {
  const o = tblOpts(t), u = t.layout.table || {}, nC = t.content.cols.length, tot = nC + (o.rowHead ? 1 : 0), cur = tblColPct(t), cwOn = Array.isArray(u.cw) && u.cw.length === tot;
  let h = fSeg('tbl.cols', 'Độ rộng cột', cwOn ? null : u.cols, [['equal', 'Đều'], ['first', 'Cột đầu rộng'], ['auto', 'Theo nội dung']], 'first', { hint: cwOn ? 'Đang chỉnh tay từng cột (bên dưới). Bấm một mức để về tự động.' : '' });
  if (o.rowHead && !cwOn && o.cols === 'first') h += fRange('tbl.first', 'Độ rộng cột đầu', u.first, { min: 15, max: 60, step: 1, def: TBL_DEF.first, fmt: x => x + '%' });
  h += '<h4>Từng cột (%)</h4>' + cur.map((x, i) => fNum('tbl.cw.' + i, i === 0 && o.rowHead ? 'Cột đầu' : `Cột ${o.rowHead ? i : i + 1}`, cwOn ? u.cw[i] : null, { min: 5, max: 90, step: 1, unit: '%', def: Math.round(x) })).join('');
  h += fSeg('tbl.rows', 'Chiều cao hàng', u.rows, [['auto', 'Theo nội dung'], ['equal', 'Đều nhau']], 'auto') + fNum('tbl.minH', 'Chiều cao hàng tối thiểu', u.minH, { min: 0, max: 60, unit: 'mm', def: TBL_ROW_MM });
  const keys = [...(o.head ? ['h'] : []), ...t.content.rows.map((_, i) => String(i))], rhs = u.rhs || {};
  h += `<details ${Object.keys(rhs).length ? 'open' : ''}><summary>Từng hàng (mm) · ${keys.length} hàng</summary>${keys.map(k => fNum('tbl.rhs.' + k, k === 'h' ? 'Hàng tiêu đề' : `Hàng ${+k + 1}`, rhs[k], { min: 6, max: 80, unit: 'mm', def: u.minH ?? TBL_ROW_MM })).join('')}</details>`;
  return h;
}
function tblKind(t) { return fSeg('tbl.cross', 'Kiểu bảng', (t.layout.table || {}).cross, [[false, 'Bảng thường'], [true, 'Ô chữ giải đố']], false, { hint: 'Ô chữ giải đố: chỉ ô có chữ mới có viền xám, không có ô đen; số 1, 2, 3 tự đánh.' }); }
function tblStyle(t) {
  const u = t.layout.table || {}, o = tblOpts(t), B = [[true, 'Bật'], [false, 'Tắt']];
  return fSeg('tbl.head', 'Hàng tiêu đề cột', u.head, B, true) + fSeg('tbl.rowHead', 'Cột tiêu đề hàng (cột đầu)', u.rowHead, B, true)
    + fSeg('tbl.nm', 'Số thứ tự', o.nm, [['out', 'Ngoài bảng'], ['in', 'Trong cột đầu'], ['off', 'Tắt']], 'out')
    + fSeg('tbl.lines', 'Đường kẻ', u.lines, [['all', 'Đầy đủ'], ['h', 'Chỉ ngang'], ['none', 'Không']], 'all')
    + fSeg('tbl.fh', 'Tô nền hàng tiêu đề', u.fh, B, true) + fSeg('tbl.fc', 'Tô nền cột đầu', u.fc, B, false)
    + fSeg('tbl.fr', 'Tô nền các hàng nội dung', o.fc ? 'none' : u.fr, [['none', 'Không'], ['zebra', 'Xen kẽ', o.fc ? 'Đã tô cột đầu nên không tô các hàng' : '']], 'none')
    + fSeg('tbl.split', 'Cho phép cắt bảng giữa các hàng', u.split, B, true) + (o.split ? fSeg('tbl.repeat', 'Lặp hàng tiêu đề ở trang sau', u.repeat, B, true) : '');
}
function marksCtl(t) {
  if (!t.image) return '';
  const im = t.image, ms = im.marks || [], mk = im.mk || {}, on = markMode;
  const seg = (act, cur, opts) => `<span class="seg">${opts.map(([v, n]) => `<button data-act="${act}" data-v="${v}" class="${cur === v ? 'on' : ''}">${n}</button>`).join('')}</span>`;
  return `<h3>Điểm trên ảnh</h3><div class="stack"><button class="btn ${on ? 'pri' : ''}" data-act="mkmode">${on ? 'Đang đặt điểm: bấm vào ảnh' : 'Đặt điểm'}</button>${ms.length ? '<button class="btn" data-act="mkclear">Xóa hết</button>' : ''}</div>
    <div class="field"><span>Hình</span>${seg('mkshape', mk.shape === 'square' ? 'square' : 'circle', [['circle', 'Tròn'], ['square', 'Vuông']])}</div>
    <div class="field"><span>Bên trong</span>${seg('mklabel', mk.label === 'none' ? 'none' : 'num', [['num', 'Số 1, 2, 3'], ['none', 'Ô trống']])}</div>
    <p class="hint">${ms.length ? `${ms.length} điểm. Số điểm n ứng với câu n. Kéo điểm trên ảnh để dời, hoặc bấm số bên dưới để xóa.` : 'Bấm "Đặt điểm" rồi bấm vào ảnh trên trang. Vị trí tính theo ảnh; nếu đổi sang Fit, kiểm tra điểm còn nằm trong khung.'}</p>
    ${ms.length ? `<div class="mkchips">${ms.map((m, i) => `<button class="btn" data-act="mkdel" data-v="${i}" title="Xóa điểm ${i + 1}">${i + 1} ✕</button>`).join('')}</div>` : ''}`;
}
function framePanel(t, s) {
  const L = layoutOf(t), fr = frOf(t), f = fitOf(t);
  let size = '', align = '', content = '';
  if (!f && L !== 'T8') size += fRange('frame.scale', 'Kích thước ảnh (khóa tỉ lệ)', fr.scale, { min: 40, max: 100, step: 5, def: 100, fmt: x => x + '%' });
  if (!(f === 'height' && isColI(t))) size += fNum('frame.h', 'Chiều cao khung', fr.h, { min: 25, max: 150, step: 5, unit: 'mm', def: f ? (frameH(t) || 'theo ảnh') : 'theo ảnh' });
  else size += `<p class="hint">Fit dọc: khung cao theo cột nội dung bên cạnh.</p>`;
  if (L === 'T8') size += fNum('frame.w', 'Chiều rộng khung', fr.w, { min: IW8[0], max: IW8[1], step: 5, unit: '% bài đọc', def: IW8[2] });
  if (L === 'T1' || L === 'T4') align += fSeg('frame.align', 'Căn ngang', fr.align, Object.entries(HA), L === 'T1' ? 'center' : 'left', { hint: L === 'T1' ? 'Trái: ảnh thẳng đường dóng của tiêu đề.' : '' });
  if (L === 'T8') align += fSeg('frame.align', 'Căn ngang (chữ bao phía còn lại)', fr.align, [['left', 'Trái'], ['right', 'Phải']], 'right');
  if (isColI(t)) align += fSeg('frame.valign', 'Căn dọc so với nội dung', fr.valign, Object.entries(VA), 'top');
  content += fSeg('frame.fit', 'Hiển thị ảnh trong khung', fr.fit, [['normal', 'Bình thường'], ['width', 'Fit ngang'], ['height', 'Fit dọc']], 'normal', { hint: 'Fit ngang: ngang ảnh bằng ngang khung. Fit dọc: cao ảnh bằng cao khung. Tâm ảnh trùng tâm khung, phần thừa bị cắt. Fit không phóng to khung.' });
  if (f) content += fRange('frame.zoom', 'Zoom ảnh', fr.zoom, { min: 50, max: 300, step: 5, def: 100, fmt: x => x + '%', fmtKey: 'zoom' }) + `<button class="btn" data-act="center" ${fr.ox || fr.oy || fr.zoom ? '' : 'disabled'}>Đưa ảnh về giữa khung</button>`;
  content += imgCtl(t, 'G1') + marksCtl(t) + `<p class="hint">Khung chính là ảnh: kéo cạnh dưới khung trên trang để đổi chiều cao, ảnh đi theo khung.${f ? ' Kéo chấm tâm để dời góc nhìn.' : ''}</p>`;
  return panel(t, s, `Ảnh ${cd('G1')}`, { size, align, content, cname: 'Hiển thị ảnh' });
}
function cimgPanel(t, s, all) {
  const keys = cellKeys(t, 'cimg'), key = all ? keys[0] : s.item, cc = cellCfg(t, key), fr = cc.frame || {}, row = cellDirOf(t) === 'row', f = fr.fit;
  let size = fNum('frame.h', 'Chiều cao khung', fr.h, { min: 15, max: 150, step: 5, unit: 'mm', def: f === 'height' ? 35 : 'theo ảnh' }), align = '', content = '';
  if (!row) size += fNum('frame.w', 'Độ rộng ảnh', fr.w, { min: 20, max: 100, step: 5, unit: '% ô', def: 'tự động' });   // v84: mặc định = cỡ hiện tại (rộng hết ô, tối đa 34 mm)
  if (row) size += fRange('split', 'Tỉ lệ hàng (ảnh / chữ)', cc.split, { min: 15, max: 50, step: 5, def: 25, fmt: r => `${r} / ${100 - r}`, fmtKey: 'split' });
  align = row ? fSeg('valign', 'Căn dọc trong hàng', cc.valign, Object.entries(VA), t.layout.valign || 'center') : fSeg('frame.align', 'Căn ngang trong ô', fr.align, Object.entries(HA), t.content.variant === 'multi' ? 'center' : (t.layout.align || 'left'));
  content += fSeg('frame.fit', 'Hiển thị ảnh trong khung', fr.fit, [['normal', 'Bình thường'], ['width', 'Fit ngang'], ['height', 'Fit dọc']], 'normal');
  if (f) content += fRange('frame.zoom', 'Zoom ảnh', fr.zoom, { min: 50, max: 300, step: 5, def: 100, fmt: x => x + '%', fmtKey: 'zoom' }) + `<button class="btn" data-act="center" ${fr.ox || fr.oy || fr.zoom ? '' : 'disabled'}>Đưa ảnh về giữa khung</button>`;
  content += (all ? '' : imgCtl(t, '@' + key)) + (all ? `<p class="hint">Đang chỉnh cùng lúc ${keys.length} ô ảnh. Chọn một ô (trên trang) để chỉnh riêng ô đó.</p>` : `<p class="hint">Kéo cạnh dưới ảnh trên trang để đổi chiều cao khung.</p>`);
  return panel(t, s, all ? `Ảnh · tất cả ${keys.length} ô` : `Ô ${labelOf(t, key)} · Ảnh`, { size, align, content, cname: 'Hiển thị ảnh' });
}
function crowPanel(t, s) {
  const cc = cellCfg(t, s.item);
  const size = fRange('split', 'Tỉ lệ hàng (ảnh / chữ)', cc.split, { min: 15, max: 50, step: 5, def: 25, fmt: r => `${r} / ${100 - r}`, fmtKey: 'split' }) + fNum('rowH', 'Chiều cao hàng tối thiểu', cc.rowH, { min: 10, max: 120, step: 5, unit: 'mm', def: 'tự động' });
  const align = fSeg('valign', 'Căn dọc nội dung trong ô', cc.valign, Object.entries(VA), t.layout.valign || 'center');
  const content = `<p class="hint">Kéo thanh ngang dưới ô chữ để đổi chiều cao hàng. Đáp án trong ô (lựa chọn in đậm) có thông số riêng: bấm vào đáp án để chỉnh.</p>`;
  return panel(t, s, `Ô ${labelOf(t, s.item)} · Chữ`, { size, align, content });
}
function answerPanel(t, s, key) {
  const a = t.answer, p = a.params || {}, o = key ? ((p.perItem || {})[key] || {}) : p, L = a.layout, age = AGE[ws.age], inl = a.attach === 'inline';
  const D = (k, d) => key && isSet(p[k]) ? p[k] : d;
  let top = '', size = '', align = '', content = '';
  if (!key) {
    const att = attachOpts(t), chs = aChoices(t), lockedA = Object.keys(AL).filter(k => !chs.some(c => c.A === k && c.att));
    top = (att.length > 1 ? `<h3>Gắn đáp án</h3><div class="seg wrapseg">${['inline', 'item', 'block'].filter(k => att.includes(k)).map(k => `<button data-act="attach" data-v="${k}" class="${a.attach === k ? 'on' : ''}">${ATTACH[k]}</button>`).join('')}</div>` : '') + `
      <h3>Kiểu đáp án</h3><div class="lay-grid">${chs.filter(c => c.att).map(c => `<button class="lay ${L === c.A ? 'on' : ''}" data-act="al" data-v="${c.A}" title="${c.att ? (c.att === a.attach ? AL[c.A] : `Chọn sẽ chuyển Gắn đáp án sang ${ATTACH[c.att]}`) : 'Không dùng được với nội dung hiện tại'}"><b style="font-size:13px">${AL[c.A]}</b>${cd(c.A)}${c.att && c.att !== a.attach ? `<small class="sc">→ ${ATTACH[c.att]}</small>` : ''}</button>`).join('')}</div>` +
      (lockedA.length ? `<details class="why"><summary>Kiểu khác không hợp dạng bài này (${lockedA.length})</summary><p class="hint">${lockedA.map(k => `${AL[k]} ${cd(k)}`).join(' · ')}</p></details>` : '');
  }
  if (L === 'A1' || L === 'A8') {
    size = (L === 'A1' ? fNum('lines', 'Số dòng mỗi câu', o.lines, { min: 1, max: 20, def: D('lines', 1) }) : fNum('repeat', 'Số lần tô', o.repeat, { min: 1, max: 5, def: D('repeat', 3) }))
      + fNum('lineMm', `Chiều cao dòng (tối thiểu ${age.line})`, o.lineMm, { min: age.line, max: 25, step: .5, unit: 'mm', def: D('lineMm', age.line) })
      + fNum('w', 'Độ rộng dòng', o.w, { min: 40, max: 100, step: 5, unit: '%', def: D('w', 100) });
  } else if (L === 'A2' && inl) {
    const c = a2cfg(t, key ? { id: key } : null);
    size = fSeg('lenMode', 'Độ dài gạch', o.lenMode, [['fill', 'Hết lề phải'], ['fixed', 'Cố định']], D('lenMode', 'fixed')) + fNum('lenMm', c.mode === 'fill' ? 'Độ dài khi Cố định' : 'Độ dài', o.lenMm, { min: 15, max: 150, step: 5, unit: 'mm', def: D('lenMm', A2MM[ws.age]) }) + fNum('lines', 'Số dòng', o.lines, { min: 1, max: 8, def: D('lines', 1) });
    content = fSeg('start', 'Dòng đầu bắt đầu', o.start, [['inline', 'Cạnh chữ'], ['below', 'Hàng dưới']], D('start', 'inline')) + `<p class="hint">Hết lề phải và nhiều dòng chỉ dùng cho chỗ trống ở cuối câu; chỗ trống giữa câu luôn là gạch cố định.</p>`;
  } else if (L === 'A2') size = fNum('width', 'Độ rộng ô', o.width, { min: 4, max: 30, unit: 'ký tự', def: D('width', 'theo từ') });
  else if (L === 'A3') size = fNum('boxW', 'Cỡ ô chữ', o.boxW, { min: 5, max: 12, step: .5, unit: 'mm', def: D('boxW', 6.5) });
  else if (L === 'A4' && inl) { size = `<p class="hint" data-na="size">Lựa chọn nằm trong câu nên cỡ theo chữ.</p>`; content = `<p class="hint">Viết lựa chọn dạng {từ 1|từ 2} trong nội dung; hiện thành từ 1 / từ 2, mỗi từ in đậm. Học sinh gạch chân hoặc khoanh từ đúng.</p>`; }
  else if (L === 'A4') {
    size = fNum('gap', 'Khoảng cách các lựa chọn', o.gap, { min: 2, max: 20, unit: 'mm', def: D('gap', 7) });
    content = fSeg('dir', 'Cách xếp', o.dir, Object.entries(A4DIRS), D('dir', 'auto'), { hint: key ? '' : 'Tự động: nếu mọi câu trong Task đều ngắn thì xếp một hàng, chỉ cần một câu dài thì cả Task xếp mỗi đáp án một dòng.' })
      + (key ? '' : fNum('autoMax', 'Đáp án “ngắn” khi dài tối đa', o.autoMax, { min: 6, max: 60, unit: 'ký tự', def: a4autoDef() }) + fSeg('qv', 'Căn dọc (số câu, chữ câu, lựa chọn)', o.qv, [['top', 'Trên'], ['center', 'Giữa'], ['bottom', 'Dưới']], 'top', { hint: 'Áp cho mọi câu của Task: số câu, chữ câu và dòng lựa chọn cùng đường căn.' }) + fSeg('lab', 'Nhãn', o.lab, [['circle', 'ⓐ'], ['dot', 'a.'], ['box', '☐ ô tick']], 'dot') + (o.lab === 'box' ? '' : fSeg('upper', 'Chữ nhãn', o.upper, [[false, 'a b c'], [true, 'A B C']], false)));
  } else if (L === 'A5') size = fNum('size', 'Cỡ ô tick', o.size, { min: 4, max: 12, step: .5, unit: 'mm', def: D('size', 6.5) });
  else if (L === 'A6') size = fNum('size', 'Cỡ ô T/F', o.size, { min: 5, max: 12, step: .5, unit: 'mm', def: D('size', 7.5) });
  else if (L === 'A7') size = fNum('size', 'Cỡ chấm nối', o.size, { min: 1.5, max: 6, step: .5, unit: 'mm', def: D('size', 2.8) });
  if (L === 'A7' && ck(t) === 'pairs') content += fSeg('mid', 'Chỗ nối (giữa hai cột)', o.mid, [['dot', 'Chấm nối'], ['box', 'Ô viết chữ'], ['none', 'Không có']], 'dot', { hint: 'Ô viết chữ: học sinh viết chữ cái của vế phải vào ô bên cạnh vế trái (không nối dây).' });   // v105
  if (inl && (L === 'A2' || L === 'A4')) align = `<p class="hint" data-na="align">Đáp án nằm trong câu nên đi theo dòng chữ, không căn riêng.</p>`;
  else align = fSeg('align', 'Căn ngang', o.align, Object.entries(HA), D('align', ansAlignDef(t)));
  if (L === 'A6' && !key && p.row) content += fSeg('rowv', 'Căn dọc cả khối', p.rowv, [['top', 'Trên'], ['center', 'Giữa'], ['bottom', 'Dưới']], 'center', { hint: 'Áp cho mọi câu của Task: số câu, chữ câu và ô T / F.' }) + fNum('tfx', 'T / F cách lề phải', p.tfx, { min: 0, max: 140, step: 1, unit: 'mm', def: 0 });   // v101
  if (!key) content += `<p class="hint">Bấm vào đáp án của một câu trên trang để chỉnh riêng câu đó.</p>`;
  return panel(t, s, key ? `Đáp án · câu ${labelOf(t, key)}` : `Đáp án · ${AL[L]} ${cd(L)}`, { top, size, align, content, cname: 'Kiểu hiển thị', autoExtra: key ? '' : '<button class="btn" data-act="reset-answer">Về kiểu đáp án ban đầu</button>' });
}
function bankPanel(t, s) {
  const b = t.wordBank, right = b.placement === 'right';
  const size = right ? fRange('@split', 'Tỉ lệ nội dung / khung từ', t.layout.split, { min: 40, max: 80, step: 5, def: 62, fmt: r => `${r} / ${100 - r}`, fmtKey: 'split' }) : fNum('w', 'Độ rộng khung từ', b.w, { min: 30, max: 100, step: 5, unit: '%', def: 100 });
  const align = right ? fSeg('valign', 'Căn dọc', b.valign, Object.entries(VA), 'top') : fSeg('align', 'Căn ngang', b.align, Object.entries(HA), 'center', { hint: b.w ? '' : 'Có tác dụng khi độ rộng nhỏ hơn 100%.' });
  const content = `<div class="field"><span>Vị trí</span><div class="seg"><button data-act="wb" data-v="top" class="${!right ? 'on' : ''}">Trên nội dung</button><button data-act="wb" data-v="right" class="${right ? 'on' : ''}">Bên phải</button></div></div><div class="field"><span>Kiểu hiển thị</span><div class="seg"><button data-act="wbstyle" data-v="chips" class="${b.style !== 'list' ? 'on' : ''}">Từ rời</button><button data-act="wbstyle" data-v="list" class="${b.style === 'list' ? 'on' : ''}">Danh sách</button></div></div>`
    + (b.style === 'list' ? `<div class="field"><span>Nhãn</span><div class="seg">${[['lower', 'a b c'], ['upper', 'A B C'], ['none', 'Không']].map(([k, n]) => `<button data-act="wblab" data-v="${k}" class="${(b.label || 'lower') === k ? 'on' : ''}">${n}</button>`).join('')}</div></div>` : '');
  return panel(t, s, `Khung từ ${cd('G4')}`, { size, align, content, cname: 'Kiểu hiển thị' });
}
function gtPanel(t, s) {
  const x = gtOf(t, s.item), L = gtOrder(t), i = L.findIndex(y => y.id === x.id), n = (t.extras || []).findIndex(y => y.id === x.id) + 1, img = x.kind === 'image';
  const size = fSeg('size', 'Cỡ chữ', x.size, [[null, `Theo phiếu · ${FSZ[ws.age][sizeKey()]} pt`], ...Object.entries(GT_SIZE).map(([k, v]) => [k, `${v} · ${FSZ[ws.age][k]} pt`])], null);
  const align = img ? fSeg('align', 'Căn lề', x.align, [['left', 'Trái'], ['center', 'Giữa'], ['right', 'Phải']], 'left') : fSeg('align', 'Căn lề', x.align, [['', `Theo Task (${TA.find(y => y[0] === taOf(t))[1]})`], ...TA], '');   // v97
  const frame = img ? '' : fSeg('frame', 'Khung', x.frame, [['none', 'Không'], ['line', 'Viền xám'], ['fill', 'Nền xám nhẹ'], ['both', 'Viền + nền']], 'none');
  const cols2 = img ? '' : fSeg('cols', 'Số cột chữ', x.cols, [[1, '1 cột'], [2, '2 cột']], 1);
  const wd = img ? fSeg('n', 'Số ảnh trên một hàng', x.n, [[1, '1'], [2, '2'], [3, '3'], [4, '4']], 1) + fNum('w', gtN(x) > 1 ? 'Độ rộng cả hàng ảnh' : 'Độ rộng ảnh', x.w, { min: 20, max: 100, step: 5, unit: '%', def: gtN(x) > 1 ? 100 : 50 }) : '';
  const pos = `<div class="field"><span>Vị trí trong Task</span><div class="seg"><button data-act="gtmove" data-v="-1" ${i <= 0 ? 'disabled' : ''}>↑ Đưa lên</button><button data-act="gtmove" data-v="1" ${i >= L.length - 1 ? 'disabled' : ''}>↓ Đưa xuống</button></div><p class="hint" style="margin:4px 0 0">Đang ở ${x.pos === 'top' ? 'phía trên' : 'phía dưới'} phần bài của Task. Không đánh số, không có đáp án, không phụ thuộc bố cục Task.</p></div><div class="stack"><button class="btn" data-act="gtdel">Xóa khối này</button></div>`;
  return crumb(t, s) + `<h2>Khối ${img ? 'ảnh' : 'chữ'} ${n} ${cd('G-Text')}</h2>` + (img ? sec('size', 'Kích thước', wd) + sec('content', 'Ảnh', gtKeys(x).map((k, j) => (gtN(x) > 1 ? `<h4>Ảnh ${j + 1}</h4>` : '') + imgCtl(t, k)).join('')) : sec('size', 'Cỡ chữ', size + cols2)) + sec('align', img ? 'Căn lề' : 'Căn lề &amp; khung', align + frame) + sec('pos', 'Vị trí', pos) + sec('auto', 'Về tự động', autoSec(t, s));
}
function headPanel(t, s) {
  return crumb(t, s) + `<h2>Tiêu đề ${cd('G0')}</h2><p class="hint">Tiêu đề (số, tên bài, hướng dẫn${t.audio ? ', số track' : ''}) luôn nằm đầu Task, cố định và là mốc của đường dóng. Khi Task bị cắt sang trang mới, trang sau không lặp lại tiêu đề.</p>`;
}
function sheetPanel() {
  const sp = sheetSpacing(), sh = ws.spacing.preset, d = lastRes ? lastRes.diags : [], P = presetsGet(), keys = Object.keys(P);
  return `<h2>Phiếu · ${esc(ws.title)}</h2><p class="hint" style="margin:0">${ws.tasks.length} Task · ${lastRes ? lastRes.pages.length : '–'} trang A4</p>
    ${d.map(diagBox).join('')}
    <h3>Xếp trang</h3><div class="field"><div class="seg">${[['cont', 'Liền trang'], ['page', 'Tách trang']].map(([k, n]) => `<button data-act="flow" data-v="${k}" class="${(ws.flow || 'cont') === k ? 'on' : ''}">${n}</button>`).join('')}</div><p class="hint" style="margin:0">${(ws.flow || 'cont') === 'page' ? 'Tách trang: mỗi trang chỉ chứa các Task trọn vẹn. Task không vừa chỗ còn lại sẽ sang trang mới.' : 'Liền trang: các Task nối tiếp nhau, lấp đầy trang; Task dài được cắt giữa 2 trang ở ranh giới item, hàng hoặc câu.'} Muốn một Task luôn sang trang mới hoặc giữ liền Task sau: chọn Task đó, mục Ngắt trang.</p></div>
    <h3>Font chữ phiếu</h3><div class="field"><div class="seg">${Object.keys(FONTS).map(k => `<button data-act="font" data-v="${k}" class="${fontKey() === k ? 'on' : ''}" style="font-family:${FONTS[k].css}">${FONTS[k].name}</button>`).join('')}</div><p class="hint" style="margin:0">${FONTS[fontKey()].hint} Đổi font có thể đổi số trang; phiếu được dàn lại ngay.</p></div>
    <h3>Cỡ chữ phiếu</h3><div class="field"><div class="seg">${Object.keys(SIZES).map(k => `<button data-act="size" data-v="${k}" class="${sizeKey() === k ? 'on' : ''}" title="${FSZ[ws.age][k]} pt">${SIZES[k]} · ${FSZ[ws.age][k]} pt</button>`).join('')}</div><p class="hint" style="margin:0">Áp cho chữ nội dung và câu hỏi của mọi Task. Mặc định là Vừa. Dòng viết của học sinh vẫn theo độ tuổi (tối thiểu ${AGE[ws.age].line} mm). Đổi cỡ chữ có thể đổi số trang.</p></div>
    <h3>Khoảng cách</h3><div class="field"><div class="seg">${[...Object.keys(PRESETS).map(k => [k, PRESET_NAME[k]]), ['free', 'Tự do']].map(([k, n]) => `<button data-act="sheet-preset" data-v="${k}" class="${sh === k ? 'on' : ''}">${n}</button>`).join('')}</div></div>
    <p class="hint" style="margin:0 0 4px">${sh === 'free' ? 'Tự do: các số do bạn nhập. Bấm Gọn, Vừa hoặc Thoáng để về bộ số chuẩn.' : 'Các số đi theo mức đã chọn. Sửa tay một số bất kỳ thì chuyển sang Tự do.'}</p>
    ${Object.keys(SP_LABEL).map(k => numRow('sheet', k, sp[k], sp[k], sh === 'free')).join('')}
    ${sheetExtra()}
    <details class="adv"><summary>Nâng cao</summary>
      <h4>Mặc định theo dạng bài${keys.length ? ` (${keys.length})` : ''}</h4>
      ${keys.length ? `<ul class="plist">${keys.map(k => `<li><b>${esc((P[k] && P[k].name) || k)}</b><button class="lnk2" data-act="preset-del" data-v="${esc(k)}">Xóa</button></li>`).join('')}</ul>` : '<p class="hint" style="margin:0">Chưa lưu. Chọn một Task đã chỉnh vừa ý, bấm "Lưu làm mặc định cho dạng này"; các phiếu sau mở ra sẽ tự áp.</p>'}
      <div class="stack" style="margin-top:6px"><button class="btn" data-act="import">Nạp phiếu khác (JSON / MD)…</button></div>
      <h4>Quy tắc in</h4><p class="hint" style="margin:0">Dòng viết tối thiểu ${AGE[ws.age].line} mm, cỡ chữ ${fontPt()} pt (${SIZES[sizeKey()]}; mức To của độ tuổi này là ${FSZ[ws.age].l} pt), tối đa ${AGE[ws.age].maxCols} cột (độ tuổi ${ws.age}).</p>
    </details>`;
}
let sheetExtra = () => '';
function renderInspector() {
  const el = document.getElementById('insp'); stage.classList.toggle('mkmode', markMode && sel.type === 'group' && sel.g === 'G1' && !sel.item);
  if (sel.type === 'sheet') { el.innerHTML = sheetPanel(); return; }
  const t = ws.tasks.find(x => x.id === sel.id); if (!t) { sel = { type: 'sheet' }; multi = []; return renderInspector(); }
  const k = kindOf(t, sel);
  el.innerHTML = k === 'task' ? taskPanel(t, sel) : k === 'frame' ? framePanel(t, sel) : k === 'cimg' ? cimgPanel(t, sel, false) : k === 'cimgs' ? cimgPanel(t, sel, true)
    : k === 'crow' ? crowPanel(t, sel) : k === 'answer' ? answerPanel(t, sel, null) : k === 'aitem' ? answerPanel(t, sel, sel.item) : k === 'bank' ? bankPanel(t, sel) : k === 'gt' ? gtPanel(t, sel) : headPanel(t, sel);
}

/* ================= Lệnh & lịch sử ================= */
// Giữ G0 của Task đang chọn (hoặc Task đầu tiên đang thấy) đứng yên trên màn hình khi đổi khoảng cách
function keepG0(fn) {
  const sr = stage.getBoundingClientRect();
  let id = sel.type !== 'sheet' ? sel.id : null;
  if (!id) { const top = Math.max(sr.top, 0), vis = [...stage.querySelectorAll('.task')].find(e => e.querySelector('.g0') && e.querySelector('.g0').getBoundingClientRect().top >= top); id = vis && vis.dataset.task; }
  const g = () => id && stage.querySelector(`.task[data-task="${id}"] .g0`);
  const b = g(), y0 = b && b.getBoundingClientRect().top;
  fn();
  const a = g(); if (!b || !a) return;
  let sc = stage; while (sc && sc !== document.body && !(/(auto|scroll)/.test(getComputedStyle(sc).overflowY) && sc.scrollHeight > sc.clientHeight)) sc = sc.parentElement;
  const d = a.getBoundingClientRect().top - y0; if (!d) return;
  if (!sc || sc === document.body) window.scrollBy(0, d); else sc.scrollTop += d;
}
function commit(fn, msg, after) { edFlush(); hist.push(clone(ws)); fut = []; fn(ws); ws.tasks.forEach(tidy); render(); if (msg) toast(msg); if (after) after(); }
function undo() { if (!hist.length) return; fut.push(clone(ws)); ws = hist.pop(); fixSel(); render(); toast('Đã hoàn tác'); }
function redo() { if (!fut.length) return; hist.push(clone(ws)); ws = fut.pop(); fixSel(); render(); toast('Đã làm lại'); }
function fixSel() { if (sel.type !== 'sheet' && !ws.tasks.find(t => t.id === sel.id)) sel = { type: 'sheet' }; multi = multi.filter(s => ws.tasks.find(t => t.id === s.id)); }
const curT = w => w.tasks.find(x => x.id === sel.id);
// v84: đổi căn lề nội dung cả Task (lưới ô) thì khung ảnh các ô đi theo: bỏ căn riêng từng ô
const commitSet = (p, v) => commit(w => selTargets(w).forEach(([t, s]) => { setPath(t, s, p, v); if (p === 'align' && s.type === 'task' && t.layout.cells) Object.values(t.layout.cells).forEach(c => { if (c && c.frame) delete c.frame.align; }); }));
const parseV = v => v === 'true' ? true : v === 'false' ? false : /^-?\d+(\.\d+)?$/.test(v) ? +v : v;
let toastTimer;
function toast(m) { const e = document.getElementById('toast'); e.textContent = m; e.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => e.classList.remove('show'), 2600); }
function applyFix(id, v) {
  commit(w => {
    const t = w.tasks.find(x => x.id === id); if (!t) return; const p = t.answer.params, fr = t.layout.frame;
    if (v === 'compact') { t.spacing.preset = 'compact'; t.spacing.overrides = {}; }
    else if (v === 'cols') t.layout.cols = colsOf(t) + 1;
    else if (v === 'cont') w.flow = 'cont';
    else if (v === 'lines') p.lines = Math.max(1, (p.lines || 1) - 1);
    else if (v === 'split') { t.layout.table = t.layout.table || {}; t.layout.table.split = true; }
    else if (v === 'imgh') { const h = frameH(t) || 60; fr.h = Math.max(25, Math.round((h - 10) / 5) * 5); }
    else if (v === 'scale') fr.scale = Math.max(40, (fr.scale || 100) - 20);
    else if (v === 'page') t.layout.break = 'page';
  }, 'Đã áp dụng gợi ý sửa');
}
const refreshSel = () => { renderTree(); renderInspector(); markSelection(); refreshOverlay(); };
const extraActs = {}; // lệnh bổ sung của các giai đoạn sau

['insp', 'tree'].forEach(id => document.getElementById(id).addEventListener('click', e => { const c = e.target.closest('[data-go]'); if (c) { e.stopPropagation(); goChip(c); } }, true));
document.getElementById('insp').addEventListener('click', e => {
  const b = e.target.closest('[data-act],[data-sel]'); if (!b || b.disabled) return;
  if (b.dataset.sel) return selectFrom(b, e);
  const v = b.dataset.v, act = b.dataset.act;
  if (act === 'mkmode') { markMode = !markMode; return commit(w => { const t = curT(w); if (markMode && t.image && !t.image.marks) t.image.marks = []; }); }
  if (act === 'mkclear') { markMode = false; return commit(w => { const t = curT(w); if (t.image) { delete t.image.marks; delete t.image.mk; } }, 'Đã xóa các điểm'); }
  if (act === 'mkdel') { const i = +v; return commit(w => { const t = curT(w); if (t.image && t.image.marks) t.image.marks.splice(i, 1); }); }
  if (act === 'mkshape' || act === 'mklabel') return commit(w => { const t = curT(w); if (!t.image) return; const mk = t.image.mk = t.image.mk || {}; if (act === 'mkshape') mk.shape = v; else mk.label = v; if (mk.shape !== 'square') delete mk.shape; if (mk.label !== 'none') delete mk.label; if (!Object.keys(mk).length) delete t.image.mk; });
  if (act === 'gtmove') { const id = sel.item, d = +v; return commit(w => gtMove(curT(w), id, d)); }
  if (act === 'gtdel') { const id = sel.item, tid = sel.id; return commit(w => { const t = w.tasks.find(y => y.id === tid); dropOrphans(t, id); t.extras = (t.extras || []).filter(y => y.id !== id); if (!t.extras.length) delete t.extras; }, 'Đã xóa khối', () => { sel = { type: 'task', id: tid }; refreshSel(); }); }
  if (act === 'set') { let val = parseV(v); if (b.dataset.def !== undefined && String(val) === b.dataset.def) val = null; return keepG0(() => commitSet(b.dataset.p, val)); }
  if (act === 'rst') return keepG0(() => commitSet(b.dataset.p, null));
  if (act === 'auto') return commit(w => selTargets(w).forEach(([t, s]) => autoReset(t, s)), 'Đã về tự động');
  if (act === 'scope') return applyScope(v);
  if (act === 'center') return commit(w => selTargets(w).forEach(([t, s]) => { const c = cfgOf(t, s, true); c.frame = c.frame || {}; c.frame.ox = c.frame.oy = c.frame.zoom = null; }));
  if (act === 'fix') return applyFix(b.dataset.id, v);
  if (act === 'guides') { guides = v === '1'; document.getElementById('guidesBtn').classList.toggle('pri', guides); draw(); renderInspector(); return; }
  if (extraActs[act]) return extraActs[act](b, v);
  if (act === 'layout') commit(w => { const t = curT(w), fit = t.layout.frame.fit; Object.assign(t.layout, { task: v, split: null, cols: null, cw: null, width: null, align: null, valign: null }); t.layout.frame = fit ? { fit } : {}; });
  else if (act === 'font') commit(w => { if (v === 'andika') delete w.font; else w.font = v; }, 'Font phiếu: ' + FONTS[v].name);
  else if (act === 'size') commit(w => { if (v === 'm') delete w.size; else w.size = v; }, 'Cỡ chữ phiếu: ' + SIZES[v]);
  else if (act === 'flow') commit(w => { w.flow = v; }, v === 'page' ? 'Tách trang' : 'Liền trang');
  else if (act === 'sheet-preset') keepG0(() => commit(w => { if (v === 'free') { if (w.spacing.preset !== 'free') { w.spacing.overrides = sheetSpacing(); w.spacing.preset = 'free'; } } else { w.spacing.preset = v; w.spacing.overrides = {}; } }));
  else if (act === 'task-preset') keepG0(() => commit(w => { const t = curT(w); if (v === 'free') { if (t.spacing.preset !== 'free') { t.spacing.overrides = spacingOf(t); t.spacing.preset = 'free'; } } else { t.spacing.preset = v || null; t.spacing.overrides = {}; } }));
  else if (act === 'rst-sp') keepG0(() => commit(w => { const o = b.dataset.sp === 'sheet' ? w.spacing.overrides : curT(w).spacing.overrides; delete o[b.dataset.key]; }));
  else if (act === 'attach') commit(w => { const a = curT(w).answer; a.attach = v; if (v === 'inline') a.layout = a.kind === 'choice' ? 'A4' : 'A2'; else if (a.kind === 'sentence' && a.layout === 'A2') a.layout = 'A1'; });
  else if (act === 'al') { const t0 = curT(ws), ch = aChoices(t0).find(x => x.A === v); if (!ch || !ch.att) { toast('Kiểu này không dùng được cho nội dung hiện tại'); return; } const sw = ch.att !== t0.answer.attach;
    commit(w => { const a = curT(w).answer; a.attach = ch.att; a.layout = v; }, sw ? `Đã chuyển Gắn đáp án sang “${ATTACH[ch.att]}” vì ${AL[v]} không đặt “${ATTACH[t0.answer.attach]}” được` : null); }
  else if (act === 'wbstyle') commit(w => { curT(w).wordBank.style = v; });
  else if (act === 'wblab') commit(w => { curT(w).wordBank.label = v; });
  else if (act === 'wb') commit(w => { curT(w).wordBank.placement = v; });
  else if (act === 'reset-answer') { const orig = baseTask(curT(ws)); if (orig) commit(w => { const a = curT(w).answer; a.attach = orig.answer.attach; a.layout = orig.answer.layout; a.params = clone(orig.answer.params); }, 'Đáp án đã về kiểu ban đầu'); }
});
document.getElementById('insp').addEventListener('change', e => {
  const i = e.target;
  if (i.dataset.pv) {
    const raw = i.value.trim(); if (raw === '') return keepG0(() => commitSet(i.dataset.pv, null));
    let v = parseFloat(raw.replace(',', '.')); if (isNaN(v)) return render();
    const mn = parseFloat(i.min), mx = parseFloat(i.max);
    if (!isNaN(mn) && v < mn) { v = mn; toast(`Giá trị tối thiểu là ${fmtN(mn)}`); } if (!isNaN(mx) && v > mx) { v = mx; toast(`Giá trị tối đa là ${fmtN(mx)}`); }
    return keepG0(() => commitSet(i.dataset.pv, v));
  }
  if (i.dataset.pr) { const v = +i.value; return commitSet(i.dataset.pr, String(v) === i.dataset.def ? null : v); }
  if (i.dataset.sp) {
    const key = i.dataset.key, min = MINS[key]; let v = parseFloat(i.value);
    if (isNaN(v)) return render();
    if (v < min) { v = min; toast(`${SP_LABEL[key]} không nhỏ hơn ${min} mm`); }
    if (i.dataset.sp === 'sheet') keepG0(() => commit(w => { if (w.spacing.preset !== 'free') { w.spacing.overrides = sheetSpacing(); w.spacing.preset = 'free'; } w.spacing.overrides[key] = v; }, 'Đã chuyển sang Tự do'));
    else keepG0(() => commit(w => { const t = curT(w); if (t.spacing.preset !== 'free') { t.spacing.overrides = spacingOf(t); t.spacing.preset = 'free'; } t.spacing.overrides[key] = v; }));
  }
  if (extraActs.change) extraActs.change(i);
});
document.getElementById('insp').addEventListener('input', e => {
  const i = e.target; if (!i.dataset.pr) return;
  const v = +i.value, fk = i.dataset.fmt, out = i.nextElementSibling;
  if (fk === 'zoom' && Math.abs(v - 100) <= 7) i.value = 100;
  const x = +i.value;
  out.textContent = fk === 'split' ? `${x} / ${100 - x}` : /scale|zoom|first/.test(i.dataset.pr) ? x + '%' : x;
  const t = curT(ws), el = stage.querySelector(`.task[data-task="${sel.id}"]`); if (!el || !t) return;
  if (i.dataset.pr === 'split' && kindOf(t, sel) === 'task') { const tt = clone(t); tt.layout.split = x; el.style.setProperty('--tpl', tplOf(tt)); }
  else if (i.dataset.pr === 'split' && sel.item) { const r = el.querySelector(`.cell.row[data-cell="${sel.item}"] .rowbody`); if (r) r.style.setProperty('--tpl', `${x}fr ${100 - x}fr`); }
  else if (i.dataset.pr === 'frame.zoom') { const box = sel.item ? el.querySelector(`.ci[data-ck="${sel.item}"]`) : el; if (box) box.style.setProperty('--z', x / 100); }
});
function selectFrom(b, e) {
  const s = b.dataset.sel, fromNav = !!(b.closest('#tree') || b.closest('.crumb'));
  const s2 = s === 'sheet' ? { type: 'sheet' } : s === 'task' ? { type: 'task', id: b.dataset.id } : (b.dataset.item ? { type: 'group', id: b.dataset.id, g: b.dataset.g, item: b.dataset.item } : { type: 'group', id: b.dataset.id, g: b.dataset.g });
  pick(s2, e && (e.shiftKey || e.ctrlKey || e.metaKey));
  if (s !== 'sheet' && fromNav) {
    const tk = stage.querySelector(`.task[data-task="${s2.id}"]`), gn = s === 'group' && stage.querySelector(`[data-node="${nodeKey(s2)}"]`);
    const el = gn && s2.g !== 'G0' ? gn : tk; if (el) el.scrollIntoView({ block: el === tk ? 'start' : 'center', behavior: 'smooth' });
  }
}
// Chọn container (add = giữ Shift/Ctrl để chọn thêm, giai đoạn 3)
let pick = (s2) => { sel = s2; multi = []; refreshSel(); };
document.getElementById('tree').addEventListener('click', e => {
  const u = e.target.closest('[data-up]'), x = e.target.closest('[data-upx]');
  if (u) { const t = ws.tasks.find(y => y.id === u.dataset.up), inp = document.getElementById('upfile'); inp.dataset.task = t.id; inp.dataset.slot = ''; inp.multiple = true; inp.value = ''; inp.click(); return; }
  if (x) { commit(w => { delete w.tasks.find(y => y.id === x.dataset.upx).uploads; const t = w.tasks.find(y => y.id === x.dataset.upx); const o = baseTask(t); if (t.image && o && o.image) t.image.ar = o.image.ar; }, 'Đã xóa ảnh tải lên'); return; }
  const sg = e.target.closest('[data-stg]');
  if (sg) { sectClick(sg.dataset.stg); return; }
  const b = e.target.closest('[data-sel]');
  if (b && b.dataset.sel === 'task') {
    // Bấm mũi tên, hoặc bấm lại Task đang mở và đang chọn: thu gọn. Bấm Task khác: mở Task đó, Task cũ tự thu gọn.
    const id = b.dataset.id, add = e.shiftKey || e.ctrlKey || e.metaKey, isOpen = openTask === id;
    if (isOpen && !add && (e.target.closest('.chev') || (sel.type === 'task' && sel.id === id && !multi.length))) { openTask = null; renderTree(); return; }
    if (!isOpen && !add) openTask = id;
  }
  if (b) selectFrom(b, e);
});
// Đọc ảnh, thu nhỏ cạnh dài về tối đa 1600 px để nhẹ, trả về {src, ar}
function loadImg(file) {
  return new Promise((ok, no) => {
    const r = new FileReader();
    r.onerror = () => no(new Error('read'));
    r.onload = () => { const im = new Image(); im.onerror = () => no(new Error('decode')); im.onload = () => {
      const k = Math.min(1, 1600 / Math.max(im.naturalWidth, im.naturalHeight)), w = Math.round(im.naturalWidth * k), h = Math.round(im.naturalHeight * k);
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const g = cv.getContext('2d');
      const png = /png|gif|webp|svg/.test(file.type); if (!png) { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); }
      g.drawImage(im, 0, 0, w, h);
      ok({ src: cv.toDataURL(png ? 'image/png' : 'image/jpeg', .86), ar: +(w / h).toFixed(4), w, h }); }; im.src = r.result; };
    r.readAsDataURL(file);
  });
}
document.getElementById('upfile').addEventListener('change', e => { const inp = e.target, files = [...inp.files]; if (files.length) dropImages(inp.dataset.task, files, inp.dataset.slot || null); inp.dataset.slot = ''; });
// Chọn ngay khi nhấn chuột (không đợi click): nếu ô nhập ở Inspector đang mở thì chốt giá trị trước,
// nhờ vậy việc vẽ lại trang không làm mất cú bấm chọn container khác.
const clampMk = v => Math.max(2, Math.min(98, Math.round(v * 10) / 10));
stage.addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  const d = e.target.closest('.mkd'), task = e.target.closest('.task');
  if (d && task) {
    e.stopPropagation(); e.preventDefault(); const tid = task.dataset.task, i = +d.dataset.i, mk = d.parentElement; let moved = false, nx, ny;
    pick({ type: 'group', id: tid, g: 'G1' });
    const mv = ev => { const r = mk.getBoundingClientRect(); nx = clampMk((ev.clientX - r.left) / r.width * 100); ny = clampMk((ev.clientY - r.top) / r.height * 100); moved = true; const live = stage.querySelector(`.task[data-task="${tid}"] .mkd[data-i="${i}"]`); if (live) { live.style.left = nx + '%'; live.style.top = ny + '%'; } };
    const up = () => { document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up); if (moved) commit(w => { const t = w.tasks.find(x => x.id === tid); if (t && t.image && t.image.marks && t.image.marks[i]) { t.image.marks[i].x = nx; t.image.marks[i].y = ny; } }); };
    document.addEventListener('pointermove', mv); document.addEventListener('pointerup', up); return;
  }
  if (markMode && task && sel.type === 'group' && sel.g === 'G1' && !sel.item && task.dataset.task === sel.id) {
    const pic = e.target.closest('.g1 .pic'), mk = pic && pic.querySelector('.mk');
    if (pic && mk) { e.stopPropagation(); e.preventDefault(); const r = mk.getBoundingClientRect(), x = clampMk((e.clientX - r.left) / r.width * 100), y = clampMk((e.clientY - r.top) / r.height * 100), tid = sel.id;
      commit(w => { const t = w.tasks.find(z => z.id === tid); if (t && t.image) { t.image.marks = t.image.marks || []; if (t.image.marks.length < 20) t.image.marks.push({ x, y }); } }); return; }
  }
}, true);
stage.addEventListener('pointerdown', e => {
  if (e.button !== 0 || e.target.closest('.splitter,.rsz')) return;
  const ae = document.activeElement; if (ae && ae.closest && ae.closest('#insp')) ae.blur();
  const n = e.target.closest('[data-node]');
  if (!n) { if (e.target.closest('.page')) pick({ type: 'sheet' }); return; }
  const [id, g, item] = n.dataset.node.split(':');
  pick(g ? (item ? { type: 'group', id, g, item } : { type: 'group', id, g }) : { type: 'task', id }, e.shiftKey || e.ctrlKey || e.metaKey);
});
document.getElementById('undo').onclick = undo;
document.getElementById('redo').onclick = redo;
document.getElementById('age').onchange = e => commit(w => { w.age = e.target.value; }, `Đã đổi độ tuổi: ${e.target.value}`);
document.getElementById('zoomIn').onclick = () => { zoom = Math.min(1.5, Math.round((scaleNow() + .1) * 10) / 10); draw(); };
document.getElementById('zoomOut').onclick = () => { zoom = Math.max(.3, Math.round((scaleNow() - .1) * 10) / 10); draw(); };
document.getElementById('zoomFit').onclick = () => { zoom = null; draw(); };
document.getElementById('guidesBtn').onclick = () => { guides = !guides; document.getElementById('guidesBtn').classList.toggle('pri', guides); draw(); if (sel.type === 'sheet') renderInspector(); };
const JSON_HINT = document.getElementById('dlgHint').textContent;
document.getElementById('mdBtn').onclick = () => {
  document.getElementById('dlgTitle').textContent = 'Phiếu dạng Markdown (MD)';
  document.getElementById('dlgHint').textContent = 'Chỉ giữ nội dung và loại bài, không giữ chỉnh layout, kích thước hay ảnh đã tải lên. Muốn giữ đủ thì dùng Xem JSON.';
  document.getElementById('jsonOut').value = sheetToMd(ws);
  document.getElementById('dlg').showModal();
};
document.getElementById('jsonBtn').onclick = () => { document.getElementById('dlgTitle').textContent = 'Dữ liệu phiếu (JSON)'; document.getElementById('dlgHint').textContent = JSON_HINT; document.getElementById('jsonOut').value = JSON.stringify(ws, null, 2); document.getElementById('dlg').showModal(); };
document.getElementById('closeDlg').onclick = () => document.getElementById('dlg').close();
document.getElementById('copyJson').onclick = () => {
  const isMd = document.getElementById('dlgTitle').textContent.includes('MD');
  const ta = document.getElementById('jsonOut');
  const fall = () => { ta.focus(); ta.select(); toast('Đã chọn toàn bộ, bấm Ctrl+C để sao chép'); };
  try { navigator.clipboard.writeText(ta.value).then(() => toast(isMd ? 'Đã sao chép MD' : 'Đã sao chép JSON'), fall); } catch (_) { fall(); }
};
// Esc: lên một cấp (câu/ô → nhóm → Task → Phiếu)
function upLevel() {
  if (sel.type === 'group' && sel.item) sel = { type: 'group', id: sel.id, g: sel.g };
  else if (sel.type === 'group') sel = { type: 'task', id: sel.id };
  else sel = { type: 'sheet' };
  multi = []; refreshSel();
}
let keyExtra = () => false; // phím tắt bổ sung (giai đoạn 3)
document.addEventListener('keydown', e => {
  if (e.target.matches('input,textarea,select')) return;
  const k = e.key.toLowerCase();
  if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
  else if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); redo(); }
  else if (k === 'escape') upLevel();
  else if (keyExtra(e)) e.preventDefault();
});
let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (zoom == null) draw(); }, 150); });

/* ================= Giai đoạn 3: tự động hóa ================= */
// --- (1) Điểm bố cục: chiều cao ước tính (mm) + phạt nhẹ khi khác luật mặc định hoặc nhiều cột hơn mặc định ---
function scoreLayout(t, L, cols) {
  const c = clone(t); c.layout.task = L; c.layout.cols = cols ?? null; c.layout.split = null; c.layout.width = null; c.number = t.number;
  if (layoutReasons(c)[L]) return null;
  const h = measure(c, null) / MM, rg = colsRange(c, L), cd0 = colsDefault(c, L), A = t.answer.layout, p = t.answer.params || {};
  // Chất lượng trước tiết kiệm chỗ: đổi khác luật mặc định phạt 25 mm, mỗi cột thêm phạt 12 mm
  let pen = (L !== autoLayout(t) ? 25 : 0) + (cols && cols > cd0 ? (cols - cd0) * 12 : 0);
  // Không chia cột cho bài viết (dòng viết, nhiều dòng), không bỏ lưới ảnh, không ép item nhiều dòng vào 2 cột
  if (cols && cols > cd0 && (['A1', 'A8'].includes(A) || (p.lines || 1) > 1 || ck(t) === 'dialogue' || (its(t) || []).some(it => it.lines))) pen += 1000;
  if (autoLayout(t) === 'T5' && L !== 'T5') pen += 1000;
  if (L === 'T4' && ['A1', 'A8'].includes(A)) pen += 1000; // dòng viết không ép vào cột đáp án hẹp
  if (h > CONTENT_H) pen += 1000;
  meas.innerHTML = '';
  return { L, cols: cols ?? null, h: Math.round(h), score: h + pen, rg };
}
function candidates(t) {
  const why = layoutReasons(t), out = [];
  Object.keys(TL).filter(L => !why[L]).forEach(L => {
    const c = clone(t); c.layout.task = L; const rg = colsRange(c, L);
    if (rg) for (let n = rg[0]; n <= rg[1]; n++) { const r = scoreLayout(t, L, n === colsDefault(c, L) ? null : n); if (r) out.push(r); }
    else { const r = scoreLayout(t, L, null); if (r) out.push(r); }
  });
  return out.sort((a, b) => a.score - b.score);
}
let rankCache = { key: '', list: [] };
function rankedFor(t) {
  const key = JSON.stringify([t.id, t.layout, t.spacing, t.answer, ws.age, ws.spacing]);
  if (rankCache.key !== key) rankCache = { key, list: candidates(t) };
  return rankCache.list;
}
rankLayouts = t => { const seen = [], why = layoutReasons(t); rankedFor(t).forEach(r => { if (!seen.includes(r.L)) seen.push(r.L); }); Object.keys(TL).filter(k => !why[k] && !seen.includes(k)).forEach(k => seen.push(k)); return seen; };
rkNote = (t, k) => { const l = rankedFor(t), best = l[0], r = l.find(x => x.L === k); if (!r) return ''; return `<small class="sc">${best && best.L === k ? 'Gợi ý · ' : ''}~${r.h} mm</small>`; };
// Tối ưu bố cục cả phiếu: chỉ đổi các Task đang ở Tự động; chọn ứng viên điểm tốt hơn rõ (≥ 5 mm)
function optimizeAll(w) {
  let n = 0;
  w.tasks.forEach(t => {
    if (t.layout.task !== 'auto' || t.layout.cols != null) return;
    const cur = scoreLayout(t, layoutOf(t), null), best = candidates(t)[0];
    if (best && cur && best.score < cur.score - 10 && (best.L !== layoutOf(t) || best.cols != null)) { t.layout.task = best.L; t.layout.cols = best.cols; n++; }
  });
  return n;
}
// --- (2) Vừa N trang / Lấp đầy trang ---
function pagesOf(w) { const keep = ws; ws = w; let r; try { r = paginate(); } finally { ws = keep; } return r.pages.length; }
function fitPages(N) {
  const steps = [
    w => { if (w.spacing.preset === 'airy' || w.spacing.preset === 'free') { w.spacing.preset = 'normal'; w.spacing.overrides = {}; } },
    w => { w.spacing.preset = 'compact'; w.spacing.overrides = {}; },
    w => { optimizeAll(w); },
    w => { w.tasks.forEach(t => { if (!t.spacing.preset) t.spacing.preset = 'compact'; }); },
    w => { w.tasks.forEach(t => { const fr = t.layout.frame; if (t.image && !fr.fit && layoutOf(t) !== 'T8') fr.scale = Math.min(fr.scale || 100, 80); }); },
    w => { if (w.flow === 'page') w.flow = 'cont'; }
  ];
  let c = clone(ws), best = { n: pagesOf(c), w: clone(c) };
  for (const st of steps) { st(c); const n = pagesOf(c); if (n < best.n) best = { n, w: clone(c) }; if (n <= N) break; }
  return best;
}
// --- (3) Nhớ cấu hình theo dạng bài (lưu trong trình duyệt của người dùng) ---
const PKEY = 'wsEditor.typePresets.v1';
// Khóa mặc định (v77): dạng bài có sẵn thì theo typeId; Task tự chế (custom) thì theo cấu hình, để hai dạng khác nhau không dùng chung một mặc định.
const presetKey = t => t.typeId && t.typeId !== 'custom' ? t.typeId : `custom|${ck(t)}|${t.answer.kind}|${t.answer.layout || '-'}|${t.image ? 'img' : ''}|${t.wordBank ? 'bank' : ''}`;
let presetMem = {};
function presetsGet() { try { const v = JSON.parse(localStorage.getItem(PKEY) || 'null'); if (v) presetMem = v; } catch (_) {} return presetMem; }
function presetsSet(v) { presetMem = v; try { localStorage.setItem(PKEY, JSON.stringify(v)); } catch (_) {} }
function presetFrom(t) {
  const L = clone(t.layout); L.cells = null; if (L.table) { L.table.rhs = null; }
  const pa = clone(t.answer.params || {}); delete pa.perItem;
  return { name: taskLabel(t), layout: L, spacing: clone(t.spacing), answer: { attach: t.answer.attach, layout: t.answer.layout, params: pa }, bank: t.wordBank ? { placement: t.wordBank.placement, style: t.wordBank.style, label: t.wordBank.label, w: t.wordBank.w ?? null, align: t.wordBank.align ?? null, valign: t.wordBank.valign ?? null } : null };
}
function presetApply(t, pr) {
  t.layout = Object.assign(LAYOUT_DEF(), clone(pr.layout)); t.spacing = clone(pr.spacing);
  if (pr.answer && alOptsFor(t, pr.answer)) { t.answer.attach = pr.answer.attach; t.answer.layout = pr.answer.layout; t.answer.params = clone(pr.answer.params); }
  if (pr.bank && t.wordBank) Object.assign(t.wordBank, clone(pr.bank));
  tidy(t);
}
function alOptsFor(t, a) { const c = clone(t); c.answer.attach = a.attach; return attachOpts(t).includes(a.attach) && alOpts(c).includes(a.layout); }
// Áp mặc định đã lưu cho các Task chưa chỉnh tay (khi nạp phiếu)
function applyPresets(w) { const P = presetsGet(); let n = 0; w.tasks.forEach(t => { const pk = presetKey(t); if (P[pk] && !hasOverride(t)) { presetApply(t, P[pk]); n++; } }); return n; }
function loadSheet(obj, msg) {
  // Nạp phiếu an toàn: bù trường thiếu; lỗi ở bất kỳ bước nào thì giữ nguyên phiếu đang mở.
  let w; const notes = [];
  try { w = fillSheet(obj, notes); } catch (e) { toast(`Không nạp được: ${e.message}. Phiếu đang mở giữ nguyên.`); return false; }
  const old = { ws, base, hist, fut, sel, multi, lastStart, openTask };
  try {
    base = clone(w); const n = applyPresets(w); ws = w; hist = []; fut = []; sel = { type: 'sheet' }; multi = []; lastStart = null; openTask = null; render();
    toast(msg + (n ? ` · đã áp mặc định cho ${n} Task` : '') + (notes.length ? ` · đã bù: ${notes.slice(0, 3).join(', ')}${notes.length > 3 ? '…' : ''}` : ''));
    return true;
  } catch (e) {
    ({ ws, base, hist, fut, sel, multi, lastStart, openTask } = old); try { render(); } catch (_) {}
    toast(`Không nạp được (lỗi khi dàn trang: ${e.message}). Phiếu đang mở giữ nguyên.`); return false;
  }
}
// --- (4) Chọn nhiều container (Shift/Ctrl + bấm) ---
pick = (s2, add) => {
  if (add && sel.type !== 'sheet' && s2.type !== 'sheet') {
    const t1 = ws.tasks.find(x => x.id === sel.id), t2 = ws.tasks.find(x => x.id === s2.id), k1 = t1 && kindOf(t1, sel);
    if (t1 && t2 && k1 === kindOf(t2, s2) && !['cimgs', 'head'].includes(k1)) {
      const k = nodeKey(s2);
      if (k !== nodeKey(sel)) { if (multi.some(x => nodeKey(x) === k)) multi = multi.filter(x => nodeKey(x) !== k); else multi.push(s2); }
      return refreshSel();
    }
    toast('Chỉ chọn thêm được các container cùng loại');
  }
  sel = s2; multi = []; refreshSel();
};
// --- (5) Phím tắt ---
let clip = null;
function domMm(sel2) { const e = stage.querySelector(sel2); return e ? e.getBoundingClientRect().height / scaleNow() / MM : null; }
// Thông số chính theo hướng phím cho từng loại container: [đường dẫn, bước, min, max, giá trị hiện tại]
function nudgeSpec(t, s, axis) {
  const k = kindOf(t, s), L = layoutOf(t), lay = t.layout, a = t.answer, key = s.item;
  if (k === 'task') {
    if (axis === 'x') {
      if (ratioOf(t) != null && cellDirOf(t) !== 'row') { const m = rmeta(t, L); return ['split', 5, m.range[0], m.range[1], ratioOf(t)]; }
      if (L === 'T6' && !(t.wordBank && t.wordBank.placement === 'right')) return ['width', 5, 40, 100, lay.width || 100];
      if (L === 'T5' && colsOf(t) > 1) return ['colGap', 1, 2, 20, lay.colGap ?? spacingOf(t).itemGap];
      return null;
    }
    return ['sp.itemGap', .5, MINS.itemGap, 20, spacingOf(t).itemGap];
  }
  if (k === 'frame') {
    if (axis === 'y') return isColI(t) && fitOf(t) === 'height' ? null : ['frame.h', 5, 25, 150, frOf(t).h || Math.round(domMm(`.task[data-task="${t.id}"] .g1 .pic`) / 5) * 5];
    if (L === 'T8') return ['frame.w', 5, IW8[0], IW8[1], frOf(t).w ?? IW8[2]];
    return fitOf(t) ? null : ['frame.scale', 5, 40, 100, frOf(t).scale || 100];
  }
  if (k === 'cimg' || k === 'cimgs') {
    const kk = key || cellKeys(t, 'cimg')[0];
    if (axis === 'y') return ['frame.h', 5, 15, 150, cellFr(t, kk).h || Math.round(domMm(`.task[data-task="${t.id}"] .ci[data-ck="${kk}"] .pic`) / 5) * 5];
    return cellDirOf(t) === 'row' ? ['split', 5, 15, 50, cellSplit(cellCfg(t, kk))] : null;
  }
  if (k === 'crow') return axis === 'x' ? ['split', 5, 15, 50, cellSplit(cellCfg(t, key))] : ['rowH', 5, 10, 120, cellCfg(t, key).rowH || Math.round(domMm(`.task[data-task="${t.id}"] .cell.row[data-cell="${key}"] .rowbody`) / 5) * 5];
  if (k === 'answer' || k === 'aitem') {
    const p = pOf(t, key ? { id: key } : null), A = a.layout, inl = a.attach === 'inline', age = AGE[ws.age];
    if (axis === 'y') return (A === 'A1' || A === 'A8') ? ['lineMm', .5, age.line, 25, Math.max(p.lineMm || 0, age.line)] : (A === 'A2' && inl) ? ['lines', 1, 1, 8, p.lines || 1] : null;
    if (A === 'A1' || A === 'A8') return ['w', 5, 40, 100, p.w || 100];
    if (A === 'A2') return inl ? ['lenMm', 5, 15, 150, p.lenMm || A2MM[ws.age]] : ['width', 1, 4, 30, p.width || 10];
    if (A === 'A3') return ['boxW', .5, 5, 12, p.boxW || 6.5];
    if (A === 'A4' && !inl) return ['gap', 1, 2, 20, p.gap ?? 7];
    if (A === 'A5') return ['size', .5, 4, 12, p.size || 6.5];
    if (A === 'A6') return ['size', .5, 5, 12, p.size || 7.5];
    if (A === 'A7') return ['size', .5, 1.5, 6, p.size || 2.8];
    return null;
  }
  if (k === 'bank') return axis === 'x' ? (t.wordBank.placement === 'right' ? ['@split', 5, 40, 80, ratioOf(t)] : ['w', 5, 30, 100, t.wordBank.w || 100]) : null;
  return null;
}
function nudge(axis, dir, big) {
  const t = curT(ws); if (!t) return false;
  const sp = nudgeSpec(t, sel, axis); if (!sp) { toast('Container này không có thông số chỉnh theo hướng đó'); return true; }
  const [p, step, mn, mx, cur] = sp, v = Math.round(clampN((cur || 0) + dir * step * (big ? 2 : 1), mn, mx) * 10) / 10;
  if (v === cur) return true;
  keepG0(() => commitSet(p, v)); toast(`${p.replace(/^@|^sp\./, '')}: ${fmtN(v)}`);
  return true;
}
// Thứ tự container để Tab: Task → các nhóm → các ô, lần lượt từng Task
function tabOrder() {
  const out = [];
  ws.tasks.forEach(t => { out.push({ type: 'task', id: t.id }); groupsOf(t).forEach(g => { out.push({ type: 'group', id: t.id, g }); if (g === 'G1' && cellImgMode(t)) cellKeys(t, 'cimg').forEach(k => out.push({ type: 'group', id: t.id, g, item: k })); if (g === 'G2' && cellDirOf(t) === 'row') cellKeys(t, 'crow').forEach(k => out.push({ type: 'group', id: t.id, g, item: k })); }); });
  return out;
}
keyExtra = e => {
  const k = e.key;
  if (!(e.target === document.body || e.target.closest('#stage'))) return false; // chỉ khi đang thao tác trên trang
  if ((k === 'Delete' || k === 'Backspace') && sel.type !== 'sheet' && sel.g === 'G1' && !sel.item && curT(ws) && curT(ws).image) { delFrame(curT(ws).id); return true; }
  if ((e.ctrlKey || e.metaKey) && (k === 'c' || k === 'C') && sel.type !== 'sheet') { const t = curT(ws), kk = kindOf(t, sel); if (kk === 'head') return false; const s0 = kk === 'cimgs' ? { type: 'group', id: t.id, g: 'G1', item: cellKeys(t, 'cimg')[0] } : sel; clip = { kind: kindOf(t, s0), pl: payloadOf(t, s0) }; toast('Đã sao chép kiểu của container'); return true; }
  if ((e.ctrlKey || e.metaKey) && (k === 'v' || k === 'V') && clip && sel.type !== 'sheet') {
    const t = curT(ws), kk = kindOf(t, sel), kind = kk === 'cimgs' ? 'cimg' : kk;
    if (kind !== clip.kind) { toast('Chỉ dán được kiểu cho container cùng loại'); return true; }
    commit(w => selTargets(w).forEach(([t2, s2]) => pasteInto(t2, s2, clip.pl)), 'Đã dán kiểu'); return true;
  }
  if (k === 'Tab' && !e.ctrlKey && !e.metaKey) {
    const o = tabOrder(), i = o.findIndex(x => nodeKey(x) === nodeKey(sel)), j = i < 0 ? 0 : (i + (e.shiftKey ? -1 : 1) + o.length) % o.length;
    sel = o[j]; multi = []; refreshSel();
    const el = stage.querySelector(`[data-node="${nodeKey(sel)}"]`) || stage.querySelector(`.task[data-task="${sel.id}"]`); if (el) el.scrollIntoView({ block: 'nearest' });
    return true;
  }
  if (sel.type === 'sheet' || e.ctrlKey || e.metaKey || e.altKey) return false;
  if (k === 'ArrowLeft') return nudge('x', -1, e.shiftKey);
  if (k === 'ArrowRight') return nudge('x', 1, e.shiftKey);
  if (k === 'ArrowUp') return nudge('y', -1, e.shiftKey);
  if (k === 'ArrowDown') return nudge('y', 1, e.shiftKey);
  return false;
};
LEGEND = 'Kéo thanh hoặc cạnh = đổi kích thước · Bấm đúp = về tự động · Esc = lên cấp · Mũi tên = chỉnh nhanh · Tab = container kế · Shift+bấm = chọn thêm · Ctrl+C / Ctrl+V = chép kiểu';
// --- Panel phiếu: tự động hóa ---
sheetExtra = () => {
  const n = lastRes ? lastRes.pages.length : 1;
  return `<h3>Tự động hóa</h3>
    <div class="stack"><button class="btn" data-act="optimize" title="Chỉ đổi các Task đang ở Tự động">Tối ưu bố cục cả phiếu</button></div>
    <div class="fitrow" data-param="fitN"><label for="fitN">Ép vừa</label><input id="fitN" type="number" min="1" max="${n}" step="1" value="${Math.max(1, n - 1)}"><span>trang</span><button class="btn" data-act="fitN" title="Thử lần lượt: khoảng cách Vừa → Gọn, tối ưu bố cục, Gọn từng Task, ảnh nhỏ hơn 20%, Liền trang. Dừng ở bước đầu tiên đạt số trang.">Thu</button></div>
    <div class="fld s ${ws.fill ? 'ov' : ''}" data-param="fill"><span class="fl">Lấp đầy trang</span><span class="fc"><span class="seg"><button data-act="fill" data-v="0" class="${ws.fill ? '' : 'on'}">Tắt</button><button data-act="fill" data-v="1" class="${ws.fill ? 'on' : ''}">Bật</button></span><span class="hint fh">Chia phần trống cuối mỗi trang (trừ trang cuối) vào khoảng giữa các Task, tối đa ${FILL_MAX} mm mỗi khoảng.</span></span><button class="rst" data-act="fill" data-v="0" ${ws.fill ? '' : 'hidden'} aria-label="Về tự động">↺</button></div>`;
};
extraActs.optimize = () => { const before = lastRes.pages.length; let n = 0; commit(w => { n = optimizeAll(w); }); toast(n ? `Đã tối ưu ${n} Task · ${before} → ${lastRes.pages.length} trang` : 'Bố cục hiện tại đã tốt nhất theo điểm'); };
extraActs.fitN = () => { const i = document.getElementById('fitN'), N = Math.max(1, parseInt(i.value, 10) || 1), before = lastRes.pages.length, r = fitPages(N); if (r.n >= before) { toast(`Không thu được dưới ${before} trang bằng các bước tự động`); return; } commit(w => { Object.assign(w, clone(r.w)); }); toast(r.n <= N ? `Đã thu phiếu về ${r.n} trang` : `Tốt nhất là ${r.n} trang (chưa đạt ${N})`); };
extraActs.fill = (b, v) => commit(w => { if (v === '1') w.fill = true; else delete w.fill; }, v === '1' ? 'Đã bật Lấp đầy trang' : 'Đã tắt Lấp đầy trang');
extraActs['preset-save'] = () => { const t = curT(ws), P = Object.assign({}, presetsGet()); P[presetKey(t)] = presetFrom(t); presetsSet(P); toast(`Đã lưu mặc định cho dạng ${taskLabel(t)}`); renderInspector(); };
extraActs['preset-apply'] = () => { const t = curT(ws), pr = presetsGet()[presetKey(t)]; if (pr) commit(w => presetApply(curT(w), pr), `Đã áp mặc định của dạng ${taskLabel(t)}`); };
extraActs['preset-del'] = (b, v) => { const P = Object.assign({}, presetsGet()); delete P[v]; presetsSet(P); toast(`Đã xóa mặc định của dạng ${v}`); renderInspector(); };
extraActs.import = () => openImport('sheet');
extraActs.change = i => { if (i.id === 'fitN') { /* chờ bấm nút */ } };
// Nút lưu / áp mặc định trong panel Task (mục Về tự động)
const _taskPanel = taskPanel;
taskPanel = (t, s) => {
  const has = !!presetsGet()[presetKey(t)];
  const extra = `<button class="btn" data-act="preset-save">Lưu làm mặc định cho dạng ${esc(taskLabel(t))}</button>${has ? `<button class="btn" data-act="preset-apply">Áp mặc định đã lưu của dạng ${esc(taskLabel(t))}</button>` : ''}`;
  return _taskPanel(t, s).replace('<div class="stack"><button class="btn" data-act="auto"', `<div class="stack">${extra}<button class="btn" data-act="auto"`);
};
document.getElementById('loadJson').onclick = () => { const ta = document.getElementById('jsonOut'); const r = readJson(ta.value); if (r.err) { toast(r.err + ' Phiếu đang mở giữ nguyên.'); return; } const bad = r.tasks.find(x => x.err); if (bad) { toast(bad.err + ' Phiếu đang mở giữ nguyên.'); return; } const obj = r.kind === 'sheet' ? r.sheet : { tasks: r.tasks.map(x => x.t) }; if (loadSheet(obj, 'Đã nạp phiếu')) document.getElementById('dlg').close(); };
document.getElementById('dlg').addEventListener('close', () => { const ta = document.getElementById('jsonOut'); ta.readOnly = true; document.getElementById('loadJson').hidden = true; document.getElementById('dlgTitle').textContent = 'Dữ liệu phiếu (JSON)'; document.getElementById('dlgHint').textContent = JSON_HINT; });

/* ================= 0b–0c: đặc điểm nội dung, công thức dạng bài, thẻ dạng bài ================= */
// Đặc điểm của một Task, suy ra từ dữ liệu (không lưu). Công thức và thẻ dạng bài chỉ đọc các đặc điểm này.
function featOf(t) {
  const k = ck(t), c = t.content, it = its(t), a = t.answer;
  const f = { form: k, ans: a.kind, A: a.layout || null, img: !!t.image, bank: !!t.wordBank };
  if (k === 'items') f.variant = c.variant || 'single';
  if (c.form === 'table') { const cells = (c.rows || []).flatMap(r => r.cells || []); f.cells = cells.some(x => x && x.tick) ? 'tick' : cells.some(x => x === '' || (x && x.ans != null)) ? 'blank' : 'text'; }
  else {
    const tx = x => [x.text || '', ...(x.lines || [])].join('\n');
    f.opts = it.some(x => x.opts && x.opts.length);
    f.gap = it.some(x => tx(x).includes('___'));
    f.mark = it.some(x => hasChoiceMarkup(tx(x)));
    f.lines = it.some(x => x.lines);
  }
  return f;
}
const FEAT_NAME = { form: 'kiểu nội dung', variant: 'ảnh lựa chọn', ans: 'loại đáp án', A: 'kiểu đáp án', img: 'ảnh chung', bank: 'khung từ', opts: 'lựa chọn A/B/C', gap: 'chỗ trống ___', mark: 'chọn trong câu {a|b}', lines: 'ô nhiều dòng', cells: 'kiểu ô bảng' };
const FORM_NAME = { questions: 'danh sách câu', items: 'câu có ảnh', pairs: 'cặp nối', dialogue: 'hội thoại', trace: 'từ để tô', passage: 'bài đọc + câu hỏi', empty: 'chỉ có ảnh', table: 'bảng' };
const KIND_NAME = { word: 'viết từ', sentence: 'viết câu', choice: 'chọn đáp án', tick: 'tick', tf: 'Đúng/Sai', match: 'nối', trace: 'tô chữ', none: 'không có' };
const A_SHORT = { A1: 'dòng kẻ', A2: 'gạch trống', A3: 'ô chữ cái', A4: 'khoanh lựa chọn', A5: 'ô tick', A6: 'khoanh T/F', A7: 'chấm nối', A8: 'dòng tô' };
const CELL_NAME = { text: 'chữ', blank: 'ô trống để viết', tick: 'ô tick' };
function featVal(k, v) {
  if (Array.isArray(v)) return v.map(x => featVal(k, x)).join(' hoặc ');
  if (k === 'form') return FORM_NAME[v] || v; if (k === 'ans') return KIND_NAME[v] || v; if (k === 'A') return v ? AL[v] : 'không có';
  if (k === 'cells') return CELL_NAME[v] || v; if (k === 'variant') return v === 'multi' ? 'nhiều ảnh/câu' : '1 ảnh/câu';
  return v ? 'có' : 'không';
}
/* Công thức dạng bài: CHỈ LÀ DỮ LIỆU. Thêm công thức = thêm một dòng ở đây, không sửa mã.
   sig: đặc điểm bắt buộc (giá trị mảng = một trong các giá trị). make: Task mẫu khi tạo mới.
   13 mẫu, chia 5 nhóm (group). Bảng chỉ có 1 mẫu: kiểu ô do nội dung ô quyết định. */
const RECIPES = [
  { id: 'answer-q', group: 'Danh sách câu', name: 'Trả lời câu hỏi', desc: 'Câu hỏi + dòng kẻ để viết câu trả lời.', icon: 'T6',
    sig: { form: 'questions', ans: 'sentence' },
    make: { title: 'Answer the questions.', instruction: 'Write full sentences.', content: { form: 'list', items: [{ text: '?' }, { text: '?' }, { text: '?' }] }, answer: { kind: 'sentence', attach: 'item', layout: 'A1', params: { lines: 1 } } } },
  { id: 'choose-abc', group: 'Danh sách câu', name: 'Chọn A/B/C', desc: 'Mỗi câu có các lựa chọn A, B, C.', icon: 'T6',
    sig: { form: ['questions', 'passage'], ans: 'choice', opts: true, mark: false },
    make: { title: 'Choose the correct answer.', instruction: 'Circle A, B or C.', content: { form: 'list', items: [{ text: '', opts: ['', '', ''] }, { text: '', opts: ['', '', ''] }, { text: '', opts: ['', '', ''] }] }, answer: { kind: 'choice', attach: 'item', layout: 'A4', params: { dir: 'auto' } } } },
  { id: 'gap-fill', group: 'Danh sách câu', name: 'Điền chỗ trống', desc: 'Câu có chỗ trống ___; có thể kèm khung từ.', icon: 'T6',
    sig: { form: 'questions', ans: 'word', gap: true },
    make: { title: 'Complete the sentences.', instruction: 'Write one word in each gap.', content: { form: 'list', items: [{ text: 'I like ___.' }, { text: 'She is ___.' }, { text: 'We go to ___.' }] }, answer: { kind: 'word', attach: 'inline', layout: 'A2', params: { lenMode: 'fill', lines: 1, start: 'inline' } } } },
  { id: 'choose-inline', group: 'Danh sách câu', name: 'Chọn trong câu {a|b}', desc: 'Lựa chọn nằm ngay trong câu; gạch chân hoặc khoanh từ đúng.', icon: 'T6',
    sig: { form: ['questions', 'items'], ans: 'choice', mark: true },
    make: { title: 'Read and underline.', instruction: 'Underline the correct word.', content: { form: 'list', items: [{ text: 'It is {big|small}.' }, { text: 'I {am|is} happy.' }] }, answer: { kind: 'choice', attach: 'inline', layout: 'A4' } } },
  { id: 'true-false', group: 'Danh sách câu', name: 'Đúng/Sai', desc: 'Mỗi câu khoanh T hoặc F; có thể kèm tranh hoặc bài đọc.', icon: 'T4',
    sig: { form: ['questions', 'passage'], ans: 'tf' },
    make: { title: 'True or False?', instruction: 'Circle T (true) or F (false).', content: { form: 'list', items: [{ text: '' }, { text: '' }, { text: '' }] }, answer: { kind: 'tf', attach: 'item', layout: 'A6' } } },
  { id: 'read-answer', group: 'Danh sách câu', name: 'Đọc và trả lời', desc: 'Bài đọc (có thể kèm ảnh) + câu hỏi.', icon: 'T8',
    sig: { form: 'passage', ans: ['sentence', 'word'] },
    make: { title: 'Read and answer.', instruction: 'Read the text. Answer the questions.', content: { form: 'list', lead: { kind: 'passage', text: '' }, items: [{ text: '?' }, { text: '?' }] }, answer: { kind: 'sentence', attach: 'item', layout: 'A1', params: { lines: 1 } } } },
  { id: 'trace', group: 'Danh sách câu', name: 'Tô chữ', desc: 'Mỗi từ lặp lại vài lần để tô.', icon: 'T6',
    sig: { form: 'trace', ans: 'trace' },
    make: { title: 'Trace the words.', instruction: 'Say the word. Then trace it.', content: { form: 'list', items: [{ text: '' }, { text: '' }, { text: '' }] }, answer: { kind: 'trace', attach: 'item', layout: 'A8', params: { repeat: 3 } } } },
  { id: 'look-write', group: 'Ảnh mỗi câu', name: 'Nhìn tranh viết từ', desc: 'Mỗi câu một ảnh; học sinh viết từ.', icon: 'T5',
    sig: { form: 'items', variant: 'single', ans: 'word', mark: false },
    make: { title: 'Look and write.', instruction: 'Write the word.', content: { form: 'list', variant: 'single', items: [{ img: 'ảnh 1', len: 4 }, { img: 'ảnh 2', len: 4 }, { img: 'ảnh 3', len: 4 }] }, answer: { kind: 'word', attach: 'item', layout: 'A2' } } },
  { id: 'listen-tick', group: 'Ảnh mỗi câu', name: 'Nghe và tick ảnh', desc: 'Mỗi câu có vài ảnh lựa chọn; tick ảnh đúng.', icon: 'T5',
    sig: { form: 'items', variant: 'multi', ans: 'tick' },
    make: { title: 'Listen and tick.', instruction: 'Tick the correct picture.', audio: 'Track', content: { form: 'list', variant: 'multi', items: [{ text: '', imgs: ['a', 'b', 'C'] }, { text: '', imgs: ['A', 'B', 'C'] }] }, answer: { kind: 'tick', attach: 'item', layout: 'A5' } } },
  { id: 'match', group: 'Riêng', name: 'Nối', desc: 'Vế trái (chữ hoặc ảnh) nối với vế phải.', icon: 'T7',
    sig: { form: 'pairs', ans: 'match' },
    make: { title: 'Match.', instruction: 'Draw lines.', content: { form: 'list', items: [{ pair: { l: { text: '' }, r: { text: '' } } }, { pair: { l: { text: '' }, r: { text: '' } } }, { pair: { l: { text: '' }, r: { text: '' } } }] }, answer: { kind: 'match', attach: 'item', layout: 'A7' } } },
  { id: 'dialogue', group: 'Riêng', name: 'Hội thoại', desc: 'Các lượt thoại có người nói; chỗ trống ___ tự đánh số.', icon: 'T6',
    sig: { form: 'dialogue', ans: 'word' },
    make: { title: 'Complete the conversation.', instruction: 'Write one word in each gap.', content: { form: 'list', items: [{ who: 'A', text: 'Hello!' }, { who: 'B', text: '___' }, { who: 'A', text: '' }, { who: 'B', text: '___' }] }, answer: { kind: 'word', attach: 'inline', layout: 'A2', params: { lenMode: 'fill', lines: 1, start: 'inline' } } } },
  { id: 'colour-draw', group: 'Chỉ có ảnh', name: 'Tô màu / vẽ', desc: 'Một ảnh lớn, không có câu (danh sách câu tắt). Bật lại danh sách để thêm câu.', icon: 'T1',
    sig: { form: 'empty' },
    make: { title: 'Listen and colour.', instruction: 'Colour the picture.', image: { label: 'tranh', size: 'large' }, content: { form: 'list', list: false, items: [] }, answer: { kind: 'none', attach: 'item', layout: null } } },
  { id: 'table', group: 'Bảng', name: 'Bảng', desc: 'Ô có chữ, ô trống để viết (để trống) hoặc ô tick (✓): do nội dung từng ô quyết định. Bảng dài tự cắt trang.', icon: 'T9',
    sig: { form: 'table' },
    make: { title: 'Complete the table.', instruction: 'Write one or two words.', content: { form: 'table', corner: '', cols: ['', ''], rows: [{ head: '', cells: ['', ''] }, { head: '', cells: ['', ''] }, { head: '', cells: ['', ''] }] }, answer: { kind: 'none', attach: 'item', layout: null } } }
];
const recipeById = id => RECIPES.find(r => r.id === id);
// Danh sách mẫu theo nhóm (thứ tự LIB_GROUPS)
const libGroups = () => LIB_GROUPS.map(g => [g, RECIPES.filter(r => (r.group || 'Danh sách câu') === g)]).filter(x => x[1].length);
const libOpts = (selId, mark) => libGroups().map(([g, rs]) => `<optgroup label="${esc(g)}">${rs.map(r => `<option value="${r.id}" ${selId === r.id ? 'selected' : ''}>${esc(r.name)}${mark && mark(r) ? mark(r) : ''}</option>`).join('')}</optgroup>`).join('');
const sigOk = (want, have) => Array.isArray(want) ? want.includes(have) : want === have;
// Công thức của Task: khớp đủ = tên công thức; không khớp = gần nhất ("Tùy biến, gốc: X") + các chỗ khác
function recipeMatch(t) {
  const f = featOf(t);
  const sc = RECIPES.map(r => { const ks = Object.keys(r.sig), miss = ks.filter(k => !sigOk(r.sig[k], f[k])); return { r, miss, n: ks.length }; });
  const ex = sc.filter(x => !x.miss.length).sort((a, b) => b.n - a.n)[0];
  if (ex) return { r: ex.r, exact: true, diffs: [] };
  // gần nhất: ưu tiên cùng kiểu nội dung, rồi ít chỗ khác nhất
  const near = sc.sort((a, b) => (a.miss.includes('form') - b.miss.includes('form')) || (a.miss.length - b.miss.length) || (b.n - a.n))[0];
  return { r: near.r, exact: false, diffs: near.miss.map(k => `${FEAT_NAME[k]}: ${featVal(k, f[k])} (gốc: ${featVal(k, near.r.sig[k])})`) };
}
// Cảnh báo nhập liệu: lv 'warn' = có thể sai, 'info' = chỉ để biết
// Đáp án có chỗ trả lời riêng (không dùng ___ trong câu): Đúng/Sai, viết câu, khoanh dưới câu, viết từ theo câu
// (khoanh A/B/C không tính: "She ___ a teacher. A. am B. is" là chỗ trống hợp lệ của lựa chọn)
const dupGapKind = t => { const a = t.answer; return a.attach === 'item' && (a.kind === 'tf' || a.kind === 'sentence' || (a.kind === 'word' && ck(t) !== 'dialogue')); };
const endGap = s => /\s_{3,}\s*[.?!]?\s*$/.test(s) && !/:\s*_{3,}\s*$/.test(s);   // gạch ___ ở cuối câu (không phải sau nhãn "Xxx:")
function contentWarnings(t) {
  const w = [], k = ck(t), it = its(t), a = t.answer, c = t.content;
  const W = (m, lv = 'warn') => w.push({ lv, m });
  if (t.layout.break === 'join' && ws.tasks[0] === t) W('Task đầu phiếu không nối được vào Task nào, nên hiện như Task thường.', 'info');
  const tx = x => [x.text || '', ...(x.lines || [])].join('\n');
  const blanks = it.reduce((n, x) => n + (tx(x).split('___').length - 1), 0) + (k === 'passage' ? gapCount(leadText(t)) : 0);
  if (c.form === 'table') {
    if (!(c.cols || []).length) W('Bảng chưa có cột.');
    (c.rows || []).forEach((r, i) => { if ((r.cells || []).length !== c.cols.length) W(`Hàng ${i + 1} có ${(r.cells || []).length} ô, bảng có ${c.cols.length} cột.`); });
    if (!(c.rows || []).length) W('Bảng chưa có hàng.');
    if (tblOpts(t).cross && !crossCount(c).words) W('Ô chữ chưa có từ nào (cần ít nhất hai ô liền nhau).');
    return w;
  }
  if (k === 'empty') { if (!t.image) W(c.list === false ? 'Chưa có ảnh, danh sách câu đang tắt.' : 'Chưa có ảnh và chưa có câu nào.'); (lowRes[t.id] || []).forEach(x => W(`Ảnh hơi mờ khi in (~${x.dpi} dpi, nên ≥ 150).`)); return w; }
  if (!it.length) W('Chưa có câu nào.');
  if (t.image && t.image.marks && t.image.marks.length) { if (it.length && t.image.marks.length !== it.length) W(`Ảnh có ${t.image.marks.length} điểm nhưng bài có ${it.length} câu.`, 'info'); if (fitOf(t)) W('Ảnh đang Fit (cắt khung): kiểm tra các điểm còn nằm trong khung.', 'info'); }
  if (k === 'passage' && !leadText(t).trim()) W('Bài đọc chưa có chữ.');
  const noun = k === 'dialogue' ? 'Lượt' : k === 'pairs' ? 'Cặp' : 'Câu';
  it.forEach((x, i) => {
    const n = `${noun} ${i + 1}`;
    if (['questions', 'passage', 'trace', 'dialogue'].includes(k) && !tx(x).trim() && !(x.opts && x.opts.length) && !(it.length === 1 && t.layout.num === 'off' && a.layout === 'A1')) W(`${n} chưa có chữ.`);
    if (k === 'dialogue' && !(x.who || '').trim()) W(`${n} chưa có tên người nói.`);
    if (k === 'pairs' && (!x.pair || !x.pair.l || !x.pair.r)) W(`${n} chỉ có một vế${x.pair && x.pair.r && !x.pair.l ? ' (vế phải thừa, có thể là vế gây nhiễu)' : ''}.`, x.pair && x.pair.r && !x.pair.l ? 'info' : 'warn');
    if (k === 'pairs' && x.pair && x.pair.l && !x.pair.l.img && !(x.pair.l.text || '').trim()) W(`${n}: vế trái trống.`);
    if (k === 'pairs' && x.pair && x.pair.r && !(x.pair.r.text || '').trim()) W(`${n}: vế phải trống.`);
    if (a.kind === 'choice' && a.attach === 'item' && k !== 'items' && !((x.opts || []).filter(o => String(o).trim()).length >= 2)) W(`${n} chưa có đủ lựa chọn (cần ít nhất 2).`);
    if (a.kind === 'choice' && a.attach === 'inline' && !hasChoiceMarkup(tx(x))) W(`${n} không có chỗ chọn {a|b}.`);
    if (a.kind === 'word' && a.attach === 'inline' && k !== 'dialogue' && !tx(x).includes('___')) W(`${n} không có chỗ trống ___.`);
    if (k === 'items' && c.variant === 'multi' && !(x.imgs && x.imgs.length >= 2)) W(`${n} cần ít nhất 2 ảnh lựa chọn.`);
    const s1 = tx(x).trim();
    if (/^(undefined|null|\[object object\])$/i.test(s1)) W(`${n} bị lỗi chữ (“${s1}”).`);
    else if (s1 && /:$/.test(s1) && s1.length <= 40 && !s1.includes('___') && !(x.opts && x.opts.length) && !x.img && !x.imgs) W(`${n} trông giống tiêu đề (“${s1}”), không phải câu.`);
    if (dupGapKind(t) && endGap(s1) && k !== 'items') W(`${n} có gạch ___ nhưng đáp án đã có chỗ trả lời riêng: chỗ trả lời bị trùng.`);
    if (/\[\s*\]|☐|□/.test(s1)) W(`${n} còn ký hiệu ô tick ☐ trong chữ.`);
  });
  if (k === 'dialogue' && a.attach === 'inline' && !blanks) W('Hội thoại chưa có chỗ trống ___.');
  if (t.wordBank && blanks) {
    const nw = t.wordBank.words.length;
    if (nw < blanks) W(`Khung từ có ${nw} từ nhưng có ${blanks} chỗ trống.`);
    else if (nw > blanks) W(`Khung từ thừa ${nw - blanks} từ so với ${blanks} chỗ trống (có thể là từ gây nhiễu).`, 'info');
  }
  if (k === 'passage' && c.lead && c.lead.keys) { const g = gapCount(leadText(t)); if (c.lead.keys.length !== g) W(`Bài đọc có ${g} chỗ trống nhưng ghi ${c.lead.keys.length} đáp án chỗ trống.`); }
  if (t.wordBank && !t.wordBank.words.length) W('Khung từ đang trống.');
  if (k === 'pairs' && !c.shuffle && it.some(x => x.pair && x.pair.l && x.pair.r)) W('Bài nối chưa có cặp đúng: gõ cặp đúng cạnh nhau rồi bật "Xáo vế phải khi in".', 'info');   // v90
  (lowRes[t.id] || []).forEach(x => W(`${slotName(t, x.key)[0].toUpperCase() + slotName(t, x.key).slice(1)} hơi mờ khi in (~${x.dpi} dpi, nên ≥ 150).`));
  const keyed = it.filter(x => x.key != null && String(x.key).trim() !== '').length;
  if (it.some(x => x.ex && !x.gt && !String(x.key ?? '').trim())) W('Câu ví dụ (số 0) chưa có đáp án mẫu nên phiếu chưa hiện đáp án cho câu này' + (t.answer.layout === 'A5' && it.some(x => x.imgs) ? ': tick ✓ ở ảnh đúng.' : ': gõ đáp án mẫu ở ô Đáp án của câu.'), 'info');
  if (keyed && keyed < it.length) W(`Thiếu đáp án đúng ở ${it.map((x, i) => (x.key == null || String(x.key).trim() === '') ? `${noun.toLowerCase()} ${i + 1}` : null).filter(Boolean).join(', ')}.`);
  return w;
}
// Mô tả Task bằng thành phần (khung · chỗ trả lời · phần đi kèm), suy ra từ dữ liệu. Thay cho tên công thức trên thẻ / tóm tắt.
const LIB_GROUPS = ['Danh sách câu', 'Ảnh mỗi câu', 'Riêng', 'Chỉ có ảnh', 'Bảng'];
function descOf(t) {
  const f = featOf(t), k = f.form, a = t.answer, c = t.content, p = [];
  const base = { questions: 'Câu hỏi', items: f.variant === 'multi' ? 'Nhiều ảnh mỗi câu' : 'Ảnh mỗi câu', pairs: 'Nối cặp', dialogue: 'Hội thoại', trace: 'Tô chữ', passage: 'Bài đọc', table: 'Bảng' }[k];
  if (k === 'empty') p.push(c.list === false ? 'Chỉ có ảnh' : 'Chưa có câu');
  else p.push(base || 'Câu hỏi');
  if (k === 'table') p.push({ text: 'ô có chữ', blank: 'ô trống để viết', tick: 'ô tick' }[f.cells]);
  else if (k !== 'empty') {
    const L = a.layout, inl = a.attach === 'inline';
    const an = !L ? 'không có chỗ trả lời' : L === 'A2' ? (inl ? 'điền chỗ trống' : 'viết từ') : L === 'A4' ? (inl ? 'chọn trong câu {a|b}' : (t.answer.params || {}).lab === 'box' ? 'tick lựa chọn' : 'khoanh A/B/C') : L === 'A1' ? 'viết câu' : L === 'A6' ? 'Đúng/Sai' : L === 'A5' ? 'tick' : L === 'A8' ? (k === 'trace' ? '' : 'dòng tô') : L === 'A7' ? (k === 'pairs' ? '' : 'chấm nối') : A_SHORT[L];
    if (an) p.push(an);
  }
  if (t.image && k !== 'empty') p.push('ảnh chung');
  if (k === 'dialogue' && leadText(t)) p.push('lời dẫn');
  if (f.lines) p.push('ô nhiều dòng');
  if (t.wordBank) p.push('khung từ');
  return p.join(' · ');
}
// Thẻ dạng bài: dãy chip; go = container bấm vào để nhảy tới
function cardOf(t) {
  const f = featOf(t), m = recipeMatch(t), k = f.form, it = its(t), a = t.answer, L = layoutOf(t), chips = [];
  chips.push({ t: descOf(t), go: 'edit', cls: 'nm', title: m.exact ? `Giống mẫu có sẵn “${m.r.name}”` : 'Cấu hình riêng (không trùng mẫu có sẵn nào)' });
  if (k === 'table') chips.push({ t: `${t.content.rows.length} hàng × ${t.content.cols.length} cột`, go: 'G2' }, { t: `ô: ${CELL_NAME[f.cells]}`, go: 'G2' });
  else if (k === 'empty') chips.push(t.content.list === false ? { t: 'chỉ có ảnh', go: t.image ? 'G1' : 'task' } : { t: '0 câu', go: 'task' });
  else chips.push({ t: `${it.length} ${k === 'dialogue' ? 'lượt thoại' : k === 'pairs' ? 'cặp' : k === 'trace' ? 'từ' : 'câu'}`, go: 'G2' });
  if (k === 'passage') chips.push({ t: 'có bài đọc', go: 'G2' });
  if (k === 'dialogue' && leadText(t)) chips.push({ t: 'có lời dẫn', go: 'G2' });
  if (t.image && k !== 'empty') chips.push({ t: 'ảnh chung', go: 'G1' });
  if (k === 'items') chips.push({ t: f.variant === 'multi' ? `${Math.max(...it.map(x => (x.imgs || []).length))} ảnh lựa chọn/câu` : 'ảnh 1/câu', go: 'G1' });
  if (k === 'pairs') chips.push({ t: it.some(x => x.pair && x.pair.l && x.pair.l.img) ? 'vế trái là ảnh' : 'vế trái là chữ', go: 'G2' });
  if (f.opts) chips.push({ t: `${Math.max(...it.map(x => (x.opts || []).length))} lựa chọn/câu`, go: 'G3' });
  if (f.mark) chips.push({ t: 'chọn trong câu {a|b}', go: 'G3' });
  if (f.lines) chips.push({ t: 'ô nhiều dòng', go: 'G2' });
  if (t.wordBank) chips.push({ t: `khung từ ${t.wordBank.words.length} từ`, go: 'G4' });
  chips.push({ t: `đáp án: ${KIND_NAME[a.kind]}${a.layout ? ', ' + A_SHORT[a.layout] : ''}`, go: a.layout ? 'G3' : 'edit' });
  const cols = colsOf(t);
  chips.push({ t: `bố cục: ${TL[L].name.toLowerCase()}${cols > 1 ? `, ${cols} cột` : ''}`, go: 'task' });
  return { chips, warns: contentWarnings(t), match: m };
}
function cardHtml(t, where) {
  const c = cardOf(t);
  return `<div class="tcard" data-card="${t.id}">${c.chips.map(x => `<button class="chip ${x.cls || ''}" data-go="${x.go}" data-id="${t.id}" title="${esc(x.title || 'Bấm để tới chỗ chỉnh')}">${esc(x.t)}</button>`).join('')}</div>` +
    (c.warns.length ? `<ul class="twarn">${c.warns.map(x => `<li class="${x.lv}">${esc(x.m)}</li>`).join('')}</ul>` : '');
}
// Bấm chip: nhảy tới container tương ứng (hoặc khung soạn nội dung ở cột trái)
function goChip(b) {
  const id = b.dataset.id, g = b.dataset.go, t = ws.tasks.find(x => x.id === id); if (!t) return;
  if (g === 'edit') { sel = { type: 'task', id }; multi = []; openTask = id; sectReset(id); sectOne('cfg'); refreshSel(); const f = document.querySelector('#tree .ed .sech[data-stg="cfg"]'); if (f) { f.scrollIntoView({ block: 'nearest' }); f.focus(); } return; }
  const s2 = g === 'task' ? { type: 'task', id } : { type: 'group', id, g };
  if (s2.g && !groupsOf(t).includes(s2.g)) { sel = { type: 'task', id }; } else sel = s2;
  multi = []; refreshSel();
  const el = stage.querySelector(`[data-node="${nodeKey(sel)}"]`) || stage.querySelector(`.task[data-task="${id}"]`); if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
}
// Khu vực (section) trong Task đang mở: trạng thái mở/đóng nhớ trong trình duyệt
const SECT_KEY = 'wsEditor.sections.v2', SECT_DEF = { kind: false, info: false, content: true, parts: false, free: false };   // mặc định chỉ mở Nội dung
const SECT = Object.assign({}, SECT_DEF);
try { const v = JSON.parse(localStorage.getItem(SECT_KEY) || 'null'); if (v) Object.keys(SECT_DEF).forEach(k => { if (typeof v[k] === 'boolean') SECT[k] = v[k]; }); } catch (_) {}
const sectSave = () => { try { localStorage.setItem(SECT_KEY, JSON.stringify(SECT)); } catch (_) {} };
var sectFor = null;   // Task đã áp mặc định thu/mở các khu vực
function sectReset(id) { sectFor = id; Object.assign(SECT, SECT_DEF); sectSave(); }   // mở Task khác: chỉ mở khu vực 3 Nội dung
function sectOpen(k) { if (!SECT[k]) { SECT[k] = true; sectSave(); } }

/* ================= Bước 1–2: soạn nội dung trong cột trái, thao tác cấp Task ================= */
// Loại đáp án dùng được theo nội dung, và mặc định khi chọn
const ANS_DEF = {
  word: { attach: 'item', layout: 'A2', params: { lenMode: 'fill', lines: 1, start: 'inline' } },
  sentence: { attach: 'item', layout: 'A1', params: { lines: 1 } },
  choice: { attach: 'item', layout: 'A4', params: { dir: 'auto' } },
  tick: { attach: 'item', layout: 'A5', params: {} }, tf: { attach: 'item', layout: 'A6', params: {} },
  match: { attach: 'item', layout: 'A7', params: {} }, trace: { attach: 'item', layout: 'A8', params: { repeat: 3 } },
  none: { attach: 'item', layout: null, params: {} }
};
function kindsOk(t) {
  const c = t.content; if (c.form === 'table') return ['none'];
  const k = ck(t);
  if (k === 'empty') return ['none'];
  if (k === 'dialogue') return ['word', 'none'];
  if (k === 'items') return c.variant === 'multi' ? ['tick', 'none'] : ['word', 'sentence', 'choice', 'tick', 'none'];
  if (k === 'passage') return ['sentence', 'word', 'choice', 'tf', 'none'];
  return ['word', 'sentence', 'choice', 'tick', 'tf', 'match', 'trace', 'none']; // danh sách câu (match = bật vế ghép)
}
// Giữ đáp án hợp lệ sau khi nội dung đổi (gắn, kiểu A)
function normAnswer(t) {
  const a = t.answer, ok = kindsOk(t);
  if (!ok.includes(a.kind)) { const k = ok[0]; Object.assign(a, clone(ANS_DEF[k]), { kind: k }); }
  if (a.kind === 'none') { a.layout = null; return; }
  const att = attachOpts(t); if (!att.includes(a.attach)) a.attach = att[0];
  const al = alOpts(t); if (!al.includes(a.layout)) a.layout = al[0];
  if (a.kind === 'word' && a.attach === 'inline' && ck(t) !== 'dialogue' && !its(t).some(x => (x.text || '').includes('___'))) a.attach = 'item';
  // v101: mọi câu đều có chỗ trống ___ ngay trong chữ (kể cả đoạn văn nhiều chỗ trống): chỗ trống là chỗ trả lời, không thêm dòng kẻ sau câu
  if (a.kind === 'word' && a.attach === 'item' && ['questions', 'passage'].includes(ck(t)) && a.layout === 'A2' && its(t).filter(x => !x.ex && !x.gt).length && its(t).filter(x => !x.ex && !x.gt).every(x => gapCount(x.text || '') >= 2 || /_{3,}\s*[^\s_.?!]/.test(x.text || ''))) a.attach = 'inline';   // chỗ trống thật trong chữ (không phải một gạch ở cuối câu hỏi)
}
// Đổi loại đáp án: kèm các trường nội dung cần cho loại đó (A4 → lựa chọn, A7 → vế ghép…)
function setKind(t, k) {
  const it = its(t), c = t.content;
  if (k === 'match' && !it.some(x => x.pair)) t.content.shuffle = true;   // v90: bài nối mới: cặp gõ = cặp đúng, in thì xáo
  if (k === 'match' && !it.some(x => x.pair)) it.forEach(x => { x.pair = { l: x.img ? { img: x.img, text: x.text || '' } : { text: x.text || '' }, r: { text: '' } }; delete x.text; delete x.img; delete x.opts; delete x.who; });
  if (k !== 'match' && it.some(x => x.pair)) it.forEach(x => { if (x.pair) { const l = x.pair.l || {}; x.text = l.text || ''; if (l.img) x.img = l.img; delete x.pair; } });
  if (k === 'trace') it.forEach(x => { delete x.opts; delete x.who; });
  const hasMark = it.some(x => hasChoiceMarkup([x.text || '', ...(x.lines || [])].join(' ')));
  if (k === 'choice' && !hasMark && ck(t) !== 'items' && !it.some(x => x.opts)) it.forEach(x => { x.opts = ['', '', '']; });
  if (k !== 'choice') it.forEach(x => { delete x.opts; });
  const d = clone(ANS_DEF[k]);
  t.answer = { kind: k, attach: d.attach, layout: d.layout, params: d.params };
  if (k === 'word' && (ck(t) === 'dialogue' || it.some(x => (x.text || '').includes('___')))) t.answer.attach = 'inline';
  if (k === 'choice' && hasMark) t.answer.attach = 'inline';
  if (c.form !== 'table' && !it.length && k !== 'none') c.items = [];
  normAnswer(t);
}
// id mới không trùng trong Task / phiếu
function newId(used, pre) { let n = 1; while (used.has(pre + n)) n++; used.add(pre + n); return pre + n; }
// Hàng bảng có id để khóa ảnh tải lên đi theo hàng khi thêm / xóa hàng
function ensureRowIds(t) { const c = t.content; if (!c || !Array.isArray(c.rows)) return; const used = new Set(c.rows.map(r => r.id).filter(Boolean)); c.rows.forEach(r => { if (!r.id) r.id = newId(used, 'r'); }); }
function ensureIds(t) { const used = new Set(its(t).map(x => x.id).filter(Boolean)); its(t).forEach(x => { if (!x.id) x.id = newId(used, 'q'); }); }
// Câu mới: cùng bộ trường với câu cuối (trường rỗng)
function blankItem(t) {
  const it = its(t), last = it[it.length - 1] || {}, x = {};
  if (last.who != null) { const ws2 = [...new Set(it.map(y => y.who).filter(Boolean))]; const prev = it[it.length - 2]; x.who = prev && prev.who != null ? prev.who : (ws2[0] || 'A'); x.text = ''; }
  else if (last.pair) x.pair = { l: last.pair.l && last.pair.l.img ? { img: 'ảnh ' + (it.length + 1), text: '' } : { text: '' }, r: { text: '' } };
  else x.text = '';
  if (last.img) x.img = 'ảnh ' + (it.length + 1);
  if (last.imgs) x.imgs = last.imgs.map((_, j) => 'abcdef'[j]);
  if (last.opts) x.opts = last.opts.map(() => '');
  if (last.lines) { x.lines = ['']; delete x.text; }
  if (last.len) x.len = last.len;
  if (last.key != null) x.key = '';
  return x;
}
// Xóa câu: dọn chỉnh tay mồ côi (ô, đáp án từng câu, ảnh tải lên)
function dropOrphans(t, id) {
  const L = t.layout, p = t.answer.params || {};
  if (L.cells) Object.keys(L.cells).forEach(k => { if (k === id || k.startsWith(id + '.')) delete L.cells[k]; });
  if (p.perItem) delete p.perItem[id];
  if (t.uploads) Object.keys(t.uploads).forEach(k => { if (k === '@' + id || k.startsWith('@' + id + '.') || k.startsWith('@' + id + '~')) delete t.uploads[k]; });
  if (t.upMeta) Object.keys(t.upMeta).forEach(k => { if (k === '@' + id || k.startsWith('@' + id + '.')) delete t.upMeta[k]; });
  if (t.imgAr) Object.keys(t.imgAr).forEach(k => { if (k === '@' + id || k.startsWith('@' + id + '.')) delete t.imgAr[k]; });
}
// Ô bảng: '' = ô trống viết, ✓ = ô tick, [ảnh: x] = ảnh; còn lại là chữ
const fmtCell = v => typeof v === 'string' ? v : v && v.ans != null ? '=' + v.ans : v && v.tick ? (v.ok ? '[x]' : '[ ]') + (v.text ? ' ' + v.text : '') : v && v.img ? `[ảnh: ${v.img}]${v.text ? ' ' + v.text : ''}` : '';
// v92: "=chữ" = ô học sinh điền, chữ là đáp án (in trống)
// v98: [ ] / [x] = ô tích (x = ô đúng), có thể kèm chữ phía sau
const BRX = /\s*<br\s*\/?>\s*/gi, brIn = s => String(s).replace(BRX, '\n'), brOut = s => String(s).replace(/\n/g, '<br>');   // v104: <br> = xuống dòng trong ô bảng (MD và ô soạn)
function parseCell(s) { s = String(s); const ma = /^\s*=\s*(\S.*?)\s*$/.exec(s); if (ma) return { ans: ma[1] }; if (/^\s*(✓|v)\s*$/i.test(s)) return { tick: 1 }; const mk = /^\s*\[\s*([xX✓]?)\s*\]\s*(.*?)\s*$/.exec(s); if (mk) { const o = { tick: 1 }; if (mk[1]) o.ok = true; if (mk[2]) o.text = mk[2]; return o; } const m = s.match(/^\s*\[ảnh:\s*([^\]]*)\]\s*(.*)$/i); if (m) return m[2] ? { img: m[1].trim(), text: brIn(m[2]) } : { img: m[1].trim() }; return brIn(s); }
const splitList = (s, re) => String(s).split(re).map(x => x.trim()).filter((x, i, a) => x || a.length > 1);
// Ghi một trường từ ô soạn vào dữ liệu
function applyField(t, k, v) {
  const p = k.split('.'), it = its(t), c = t.content;
  if (k === 'title' || k === 'instruction') { t[k] = v; return; }
  if (k === 'audio') { if (v.trim()) t.audio = v; else delete t.audio; return; }
  if (k === 'qr.link') { t.qr = t.qr || { src: 'link' }; t.qr.link = v; return; }
  if (k === 'qr.base') { ws.audioBase = v; return; }
  if (k === 'cross.grid') { const old = c.rows.slice(), L = crossParse(v.split('\n').map(x => x.replace(/\s+$/, '')).filter(x => x.length)); if (!L.length) L.push(['']); c.cols = Array(L[0].length).fill(''); c.rows = L.map((cells, i) => ({ id: old[i] && old[i].id, head: '', cells })); ensureRowIds(t); return; }
  if (k === 'lead.keys') { c.lead = c.lead || { kind: 'passage' }; const a = splitList(v, /,|\n/).map(x => x.trim()).filter(Boolean); if (a.length) c.lead.keys = a; else delete c.lead.keys; return; }
  if (k === 'lead.text') { c.lead = c.lead || { kind: 'text' }; c.lead.text = v; return; }
  if (k === 'image.label') { if (t.image) t.image.label = v; return; }
  if (k === 'wb.words') { if (t.wordBank) t.wordBank.words = splitList(v, /\n|,/).filter(Boolean); return; }
  if (p[0] === 'it') {
    const x = it[+p[1]]; if (!x) return; const f = p[2];
    if (f === 'text' || f === 'who' || f === 'img' || f === 'key') x[f] = v;
    else if (f === 'keyg') { const n = Math.max(gapN(x), +p[3] + 1), g = keyGaps(x); const a = Array.from({ length: n }, (_, j) => g[j] || ''); a[+p[3]] = String(v).replace(/\|/g, '/').trim(); if (a.some(Boolean)) x.key = n > 1 ? a.join(' | ') : a[0]; else if (x.ex) x.key = ''; else delete x.key; }
    else if (f === 'len') { const n = parseInt(v, 10); if (n > 0) x.len = n; else delete x.len; }
    else if (f === 'imgs' && p[3] != null) { x.imgs = x.imgs || []; x.imgs[+p[3]] = v; }
    else if (f === 'imgs') x.imgs = splitList(v, /,/).filter(Boolean);
    else if (f === 'opts' && p[3] != null) { x.opts = x.opts || []; const pk = exPicks(t, x, x.opts); x.opts[+p[3]] = v; if (pk.length) x.key = pk.map(j => 'abcdefgh'[j] || String(j + 1)).join(', '); }   // v87: sửa một lựa chọn, tích giữ theo vị trí
    else if (f === 'opts') x.opts = splitList(v, /\s\/\s|\n|\|/);
    else if (f === 'lines') x.lines = String(v).split('\n');
    else if (f === 'pl') { x.pair = x.pair || {}; x.pair.l = Object.assign(x.pair.l || {}, { text: v }); }
    else if (f === 'pli') { x.pair = x.pair || {}; x.pair.l = Object.assign(x.pair.l || {}, { img: v }); if (!v) delete x.pair.l.img; }
    else if (f === 'pr') { x.pair = x.pair || {}; if (v.trim() || x.pair.r) x.pair.r = { text: v }; }
    return;
  }
  if (p[0] === 'x') { const x = gtOf(t, p[1]); if (x && p[2] === 'text' && x.kind !== 'image') x.text = v; else if (x && p[2] === 'label' && x.kind === 'image') x.label = v; return; }
  if (p[0] === 'heads') { c.heads = c.heads || ['', '']; c.heads[+p[1]] = v; if (!c.heads.some(Boolean)) delete c.heads; return; }   // v105
  if (p[0] === 'tb') {
    if (p[1] === 'corner') c.corner = brIn(v);
    else if (p[1] === 'col') c.cols[+p[2]] = brIn(v);
    else if (p[1] === 'r') { const r = c.rows[+p[2]]; if (!r) return; const old = p[3] === 'head' ? r.head : r.cells[+p[4]]; let nv = parseCell(v); if (old && typeof old === 'object' && old.img && !old.tick && typeof nv === 'string') nv = nv ? { img: old.img, text: nv } : { img: old.img };   // v99: ô có ảnh: ô gõ chỉ sửa chữ, giữ ảnh
      if (p[3] === 'head') r.head = nv; else r.cells[+p[4]] = nv; }
  }
}
const fieldVal = (x, f) => f === 'imgs' ? (x.imgs || []).join(', ') : f === 'opts' ? (x.opts || []).join(' / ') : f === 'lines' ? (x.lines || []).join('\n') : f === 'pl' ? ((x.pair && x.pair.l && x.pair.l.text) || '') : f === 'pli' ? ((x.pair && x.pair.l && x.pair.l.img) || '') : f === 'pr' ? ((x.pair && x.pair.r && x.pair.r.text) || '') : (x[f] == null ? '' : String(x[f]));
// Công tắc trường nội dung (cấp Task)
function fieldToggles(t) {
  const k = ck(t), c = t.content, it = its(t), o = [];
  if (c.form === 'table') return o;
  const add = (id, label, on, dis) => o.push({ id, label, on, dis });
  add('list', 'Danh sách câu', c.list !== false);
  add('image', 'Ảnh chung', !!t.image);
  if (k !== 'empty') {
    add('img', 'Ảnh mỗi câu', it.some(x => x.img || x.imgs), ['pairs', 'dialogue', 'passage'].includes(k) ? 'Không dùng cho dạng này' : '');
    if (k === 'items') add('multi', 'Nhiều ảnh lựa chọn', c.variant === 'multi');
    add('who', 'Người nói', k === 'dialogue', ['pairs', 'items', 'passage'].includes(k) ? 'Không dùng cho dạng này' : '');
    add('pair', 'Vế ghép (nối)', k === 'pairs', ['dialogue', 'items', 'passage'].includes(k) ? 'Không dùng cho dạng này' : '');
    add('passage', 'Bài đọc', k === 'passage', ['pairs', 'dialogue', 'items'].includes(k) ? 'Không dùng cho dạng này' : '');
    if (k === 'dialogue') add('intro', 'Lời dẫn', !!(c.lead && c.lead.kind === 'text'));
    add('lines', 'Ô nhiều dòng', it.some(x => x.lines), k !== 'items' ? 'Chỉ dùng cho câu có ảnh' : '');
    add('bank', 'Khung từ', !!t.wordBank);
  }
  return o;
}
function toggleField(t, f, on) {
  const it = its(t), c = t.content;
  if (f === 'list') { if (on) { delete c.list; if (c.listAns) { t.answer = c.listAns; delete c.listAns; } } else { if (it.length) c.listAns = clone(t.answer); c.list = false; } }   // tắt: ẩn danh sách, giữ câu + đáp án để bật lại
  else if (f === 'image') { if (on) t.image = { label: 'ảnh', size: 'medium' }; else { delete t.image; if (t.uploads) delete t.uploads.G1; t.layout.frame = {}; } }
  else if (f === 'img') { if (on) { it.forEach((x, i) => { x.img = x.img || 'ảnh ' + (i + 1); }); c.variant = 'single'; } else { it.forEach(x => { delete x.img; delete x.imgs; delete x.lines; }); delete c.variant; t.layout.cells = null; } }
  else if (f === 'multi') { if (on) { it.forEach(x => { x.imgs = x.imgs || [x.img || 'A', 'B', 'C']; delete x.img; delete x.lines; if (x.text == null) x.text = ''; }); c.variant = 'multi'; } else { it.forEach(x => { x.img = (x.imgs || [])[0] || 'ảnh'; delete x.imgs; }); c.variant = 'single'; } t.layout.cells = null; t.layout.dir = null; t.layout.cols = null; }
  else if (f === 'who') { if (on) it.forEach((x, i) => { x.who = x.who || (i % 2 ? 'B' : 'A'); delete x.opts; }); else it.forEach(x => { delete x.who; }); if (!on && c.lead && c.lead.kind === 'text') delete c.lead; }
  else if (f === 'pair') { setKind(t, on ? 'match' : 'word'); return; }
  else if (f === 'passage') { if (on) c.lead = { kind: 'passage', text: (c.lead && c.lead.text) || '' }; else delete c.lead; }
  else if (f === 'intro') { if (on) c.lead = { kind: 'text', text: '' }; else delete c.lead; }
  else if (f === 'lines') { if (on) it.forEach(x => { x.lines = x.lines || [x.text || '']; delete x.text; }); else it.forEach(x => { if (x.lines) { x.text = x.lines.join(' '); delete x.lines; } }); }
  else if (f === 'bank') { if (on) t.wordBank = { words: [], placement: 'top', style: 'chips', label: 'lower' }; else delete t.wordBank; }
  else if (f === 'key') { it.forEach(x => { if (on) { if (x.key == null) x.key = ''; } else delete x.key; }); }
  normAnswer(t);
}
// ---- HTML khung soạn ----
const eIn = (k, v, ph, o = {}) => o.area
  ? `<textarea data-k="${k}" rows="${o.rows || 2}" placeholder="${esc(ph || '')}" aria-label="${esc(o.label || ph || k)}">${esc(v)}</textarea>`
  : `<input data-k="${k}" value="${esc(v)}" placeholder="${esc(ph || '')}" aria-label="${esc(o.label || ph || k)}"${o.w ? ` style="width:${o.w}"` : ''}>`;
// Câu / lượt nào có chỗ học sinh phải trả lời: dùng để đánh dấu trong danh sách
const GAP_RE = /___/, PICK_RE = /\{[^}]*\|[^}]*\}/;
function ansLabel(x) {
  if (x.key) return 'có đáp án đúng';
  if (x.opts) return 'có lựa chọn';
  const tx = [x.text || '', ...(Array.isArray(x.lines) ? x.lines.map(l => typeof l === 'string' ? l : (l && l.text) || '') : [])].join(' ');
  return GAP_RE.test(tx) ? 'chỗ trống' : PICK_RE.test(tx) ? 'chọn trong câu' : null;
}
function edItems(t) {
  const k = ck(t), it = its(t), c = t.content, keys = it.some(x => x.key != null);
  const noun = k === 'dialogue' ? 'lượt' : k === 'pairs' ? 'cặp' : k === 'trace' ? 'từ' : 'câu';
  const spk = []; it.forEach(x => { if (x.who != null && !spk.includes(x.who)) spk.push(x.who); });
  const rows = it.map((x, i) => {
    let f = '', whoIn = '';
    if (x.who != null) { whoIn = eIn(`it.${i}.who`, x.who, 'Tên', { w: '92px', label: `Người nói ${i + 1}` }); f += `<div class="er2">${eIn(`it.${i}.text`, x.text || '', 'Lời thoại (___ = chỗ trống)', { label: `Lời ${i + 1}` })}</div>`; }
    else if (x.pair) f += x.pair.l && x.pair.l.img != null
      ? `<div class="er2 pairimg"><div class="imgblk">${thumbHtml(t, '@' + x.id)}${eIn(`it.${i}.pli`, x.pair.l.img, 'Tên ảnh', { label: `Ảnh vế trái ${i + 1}` })}${eIn(`it.${i}.pl`, fieldVal(x, 'pl'), 'Chữ dưới ảnh', { label: `Chữ dưới ảnh vế trái ${i + 1}` })}</div><span class="eto">↔</span>${eIn(`it.${i}.pr`, fieldVal(x, 'pr'), 'Vế phải', { label: `Vế phải ${i + 1}` })}</div>`
      : `<div class="er2">${eIn(`it.${i}.pl`, fieldVal(x, 'pl'), 'Vế trái', { label: `Vế trái ${i + 1}` })}<span class="eto">↔</span>${eIn(`it.${i}.pr`, fieldVal(x, 'pr'), 'Vế phải', { label: `Vế phải ${i + 1}` })}</div>`;
    else if (x.lines) f += eIn(`it.${i}.lines`, fieldVal(x, 'lines'), 'Mỗi dòng một dòng chữ; {a|b} = chọn', { area: 1, rows: Math.max(2, x.lines.length), label: `Các dòng câu ${i + 1}` });
    else f += eIn(`it.${i}.text`, x.text || '', k === 'trace' ? 'Từ để tô' : 'Chữ (___ chỗ trống, {a|b} chọn; dòng trống = sang đoạn)', { label: `Chữ câu ${i + 1}`, area: !x.gt && !x.img && !x.imgs, rows: Math.max(1, Math.min(14, ((x.text || '').match(/\n/g) || []).length + Math.ceil((x.text || '').length / 44))) });   // v101: ô câu nhiều dòng, kéo giãn được như ô bài đọc
    if (x.img != null) f = (!x.pair && !x.who && !x.lines && !x.imgs) ? `<div class="imgrow2">${thumbHtml(t, '@' + x.id)}<div class="imgcol">${eIn(`it.${i}.img`, x.img, 'Chữ dưới ảnh / tên ảnh', { label: `Chữ dưới ảnh câu ${i + 1}` })}${f}</div></div>`
      : `<div class="imgblk">${thumbHtml(t, '@' + x.id)}${eIn(`it.${i}.img`, x.img, 'Chữ dưới ảnh / tên ảnh', { label: `Chữ dưới ảnh câu ${i + 1}` })}</div>` + f;
    if (x.imgs) f += `<div class="imgsgrid" style="--n:${x.imgs.length}">${x.imgs.map((im, j) => `<div class="imgblk">${thumbHtml(t, `@${x.id}.${j}`)}${eIn(`it.${i}.imgs.${j}`, im, 'Chữ dưới ảnh', { label: `Chữ dưới ảnh ${j + 1} của câu ${i + 1}` })}${t.answer.layout === 'A5' ? `<button type="button" class="tkq${exPicks(t, x, x.imgs).includes(j) ? ' on' : ''}" data-eact="tickopt" data-i="${i}" data-j="${j}" aria-pressed="${!!(String(x.key ?? '').trim() && exPick(t, x, x.imgs) === j)}" title="Tick ✓ = ảnh này là đáp án đúng" aria-label="Đáp án đúng: ảnh ${j + 1} của câu ${i + 1}">✓</button>` : ''}</div>`).join('')}</div>`;
    if (x.opts) { const pk = exPicks(t, x, x.opts);   // v87: mỗi lựa chọn một dòng: ô tích (đúng, chọn được nhiều) + a. b. c. + ô gõ + ✕
      f += `<div class="eopts"><div class="eoh"><span class="elb">Đáp án</span><span class="sp"></span><button type="button" class="eb eoadd" data-eact="optadd" data-i="${i}" title="Thêm đáp án" aria-label="Thêm đáp án câu ${i + 1}">+</button></div>${x.opts.map((o, j) => `<div class="eo"><button type="button" class="tkq${pk.includes(j) ? ' on' : ''}" data-eact="tickopt" data-i="${i}" data-j="${j}" aria-pressed="${pk.includes(j)}" title="Tích = đáp án đúng (chọn được nhiều)" aria-label="Đáp án đúng: ${'abcdefgh'[j] || j + 1} câu ${i + 1}">✓</button><span class="eol">${'abcdefgh'[j] || j + 1}.</span>${eIn(`it.${i}.opts.${j}`, o, 'Đáp án ' + ('abcdefgh'[j] || j + 1), { label: `Lựa chọn ${'abcdefgh'[j] || j + 1} câu ${i + 1}` })}<button type="button" class="eb" data-eact="optdel" data-i="${i}" data-j="${j}" ${x.opts.length > 2 ? '' : 'disabled'} title="Xóa đáp án này" aria-label="Xóa lựa chọn ${'abcdefgh'[j] || j + 1} câu ${i + 1}">✕</button></div>`).join('')}</div>`; }
    if (t.answer.layout === 'A3' && !x.who && !x.pair) f += `<div class="er2"><span class="elb">Số ô</span>${eIn(`it.${i}.len`, x.len || '', 'tự động', { w: '60px', label: `Số ô chữ câu ${i + 1}` })}</div>`;
    const pg = x.opts || x.imgs ? [] : pkGroups(x), ul = !pg.length && (t.answer.params || {}).ulab && t.answer.kind === 'choice' ? [...pkSrc(x).matchAll(/<u>([\s\S]*?)<\/u>/g)].map(m => m[1]) : [];
    if (pg.length && needKey(t, x)) f += `<div class="er2 kpk"><span class="elb">Đáp án</span><span class="pkr">${pg.map((g, gi) => g.map((o, j) => `<button type="button" class="pko${o.ok ? ' on' : ''}" data-eact="pickopt" data-i="${i}" data-g="${gi}" data-j="${j}" aria-pressed="${o.ok}" title="Bấm = vế đúng (bấm lại để bỏ)">${esc(o.t || '…')}</button>`).join('')).join('<span class="pks">·</span>')}</span></div>`;   // v89: bấm vế đúng ngay trên câu
    else if (ul.length && needKey(t, x)) { const up = (t.answer.params || {}).upper, L = up ? 'ABCDEFGH' : 'abcdefgh', kk = String(x.key ?? '').trim().toLowerCase(); f += `<div class="er2 kpk"><span class="elb">Phần sai</span><span class="pkr">${ul.map((u, j) => `<button type="button" class="pko ule${kk === 'abcdefgh'[j] ? ' on' : ''}" data-eact="ulpick" data-i="${i}" data-j="${j}" aria-pressed="${kk === 'abcdefgh'[j]}" title="Bấm phần gạch chân bị sai = đáp án">${L[j]}. ${esc(u.replace(/<[^>]+>|\*/g, ''))}</button>`).join('')}</span></div>`; }
    else if (needKey(t, x) && !x.opts && !x.imgs && (gapN(x) > 1 || (gapN(x) === 1 && t.wordBank && t.wordBank.kind !== 'image' && t.wordBank.words.length))) { const ks = keyGaps(x), wb = t.wordBank && t.wordBank.kind !== 'image' ? t.wordBank.words : null;   // v91: mỗi chỗ trống một ô đáp án; có Khung từ thì chọn từ trong khung
      f += `<div class="er2 kgap"><span class="elb">Đáp án</span><span class="pkr">${Array.from({ length: gapN(x) }, (_, j) => { const v = ks[j] || '', gl = gapLabs(x.text)[j], lb = gl ? `<i>${esc(gl)}</i>` : gapN(x) > 1 ? `<i>(${j + 1})</i>` : ''; return wb && wb.length ? `<label class="kg">${lb}<select data-k="it.${i}.keyg.${j}" aria-label="Đáp án chỗ trống ${j + 1} câu ${i + 1}"><option value="">—</option>${wb.concat(v && !wb.includes(v) ? [v] : []).map(w => `<option${w === v ? ' selected' : ''}>${esc(w)}</option>`).join('')}</select></label>` : `<label class="kg">${lb}${eIn(`it.${i}.keyg.${j}`, v, 'đáp án', { label: `Đáp án chỗ trống ${j + 1} câu ${i + 1}` })}</label>`; }).join('')}</span></div>`; }
    else if (needKey(t, x) && !x.pair && !(x.imgs && t.answer.layout === 'A5') && !x.opts && !(t.answer.layout === 'A6' && optsOfKey(t, x).length > 1)) f += `<div class="er2"><span class="elb">Đáp án</span>${eIn(`it.${i}.key`, x.key || '', 'đáp án đúng', { label: `Đáp án đúng câu ${i + 1}` })}</div>`;
    const al = ansLabel(x), sc = '';
    return `<div class="eit${al ? ' ans' : ''}${sc}" data-i="${i}"><div class="eih"><span class="egrip" draggable="true" data-drag="${i}" title="Kéo để đổi thứ tự">⋮⋮</span><span class="ino">${i + 1}</span>${whoIn}
      <span class="sp"></span><button class="eb" data-eact="up" data-i="${i}" ${i ? '' : 'disabled'} aria-label="Lên">↑</button><button class="eb" data-eact="down" data-i="${i}" ${i < it.length - 1 ? '' : 'disabled'} aria-label="Xuống">↓</button><button class="eb" data-eact="dupi" data-i="${i}" aria-label="Nhân đôi câu">⧉</button><button class="eb" data-eact="del" data-i="${i}" aria-label="Xóa ${noun} ${i + 1}">✕</button></div>${f}${al ? `<div class="eans" title="Câu này có chỗ học sinh phải trả lời">✎ ${al}</div>` : ''}</div>`;
  }).join('');
  const heads = k === 'pairs' ? `<div class="er2"><span class="elb">Tiêu đề cột</span>${eIn('heads.0', (t.content.heads || [])[0] || '', 'Cột trái', { label: 'Tiêu đề cột trái' })}${eIn('heads.1', (t.content.heads || [])[1] || '', 'Cột phải', { label: 'Tiêu đề cột phải' })}</div>` : '';   // v105
  return `${heads}<div class="eitems">${rows}</div><div class="erow"><button class="btn" data-eact="add">+ Thêm ${noun}</button><button class="btn" data-eact="paste-items" title="Dán nhiều dòng, mỗi dòng một ${noun}">Dán nhiều ${noun}…</button></div>` +
    (it.some(x => x.img || x.imgs) || (k === 'pairs' && it.some(x => x.pair && x.pair.l && x.pair.l.img != null)) ? `<div class="edrop" data-drop="${t.id}">Kéo nhiều ảnh vào đây: mỗi ảnh vào một ô theo thứ tự, thừa ảnh thì thêm ${noun}.</div>` : '');
}
function arSegHtml(t) {
  if (!slotsOf(t).some(x => fixedImg(t, x.key))) return '';
  return `<div class="ef"><span class="elb">Tỉ lệ ô ảnh</span><span class="seg">${AR_OPTS.map(([v, n]) => `<button type="button" data-eact="tblar" data-v="${v}" class="${tblAr(t) === v ? 'on' : ''}">${n}</button>`).join('')}</span></div>`;
}
function edTable(t) {
  const c = t.content;
  if (tblOpts(t).cross) { const n = crossCount(c); return `<p class="hint">Mỗi dòng một hàng. <b>#</b> không có ô · <b>.</b> ô trống chưa có đáp án · chữ cái = ô có đáp án · <b>(a)</b> chữ cho sẵn. Số 1, 2, 3 tự đánh.</p><div class="ef col xgin"><span class="elb">Lưới ô chữ</span>${eIn('cross.grid', crossLines(c).join('\n'), '#C#S#\n#A#U#\n#TEN#', { area: 1, rows: Math.min(14, Math.max(4, c.rows.length + 1)), label: 'Lưới ô chữ' })}</div><p class="hint"><span id="xcount">${n.cells} ô · ${n.words} từ (${n.across} ngang, ${n.down} dọc).</span> Lời gợi ý: thêm ở Khối tự do (+ Chữ).</p>`; }
  const head = `<div class="etr"><span class="ino">·</span>${eIn('tb.corner', brOut(c.corner || ''), 'Góc', { label: 'Ô góc' })}${c.cols.map((x, j) => eIn(`tb.col.${j}`, brOut(x), `Cột ${j + 1}`, { label: `Tên cột ${j + 1}` })).join('')}<span class="eb0"></span></div>`;
  const cTxt = v => brOut(v && typeof v === 'object' && v.img && !v.tick ? (v.text || '') : fmtCell(v));   // v99: ô có ảnh: ảnh nhỏ bên trái, ô gõ chỉ chữ
  const imB = (v, i, j) => v && typeof v === 'object' && (v.tick || v.ans != null) ? '' : `<button type="button" class="eimb${v && v.img ? ' x' : ''}" data-eact="tbimg" data-i="${i}" data-j="${j}" title="${v && v.img ? 'Gỡ ảnh khỏi ô (giữ chữ)' : 'Thêm ảnh vào ô'}" aria-label="${v && v.img ? 'Gỡ ảnh' : 'Thêm ảnh'}">${v && v.img ? '×' : '+ảnh'}</button>`;   // v99
  const imWrap = (v, i, j, inner) => { const bt = imB(v, i, j); return !bt ? inner : inner.startsWith('<span class="etc">') ? inner.replace(/<\/span>$/, bt + '</span>') : `<span class="etc">${inner}${bt}</span>`; };
  const tkWrap = (v, i, j, inner) => v && v.tick ? `<span class="etc"><button type="button" class="tkq${v.ok ? ' on' : ''}" data-eact="tbok" data-i="${i}" data-j="${j}" aria-pressed="${!!v.ok}" title="Đánh dấu ô đúng (bản giáo viên)">✓</button>${inner}</span>` : inner;   // v98
  const withThumb = (v, key, inner) => v && typeof v === 'object' && v.img && key ? `<span class="etc">${thumbHtml(t, key)}${inner}</span>` : inner;
  const rows = c.rows.map((r, i) => `<div class="etr"><span class="ino">${i + 1}</span>${imWrap(r.head, i, 'h', withThumb(r.head, r.id && '@' + r.id, eIn(`tb.r.${i}.head`, cTxt(r.head), 'Đầu hàng', { label: `Đầu hàng ${i + 1}` })))}${r.cells.map((v, j) => imWrap(v, i, j, tkWrap(v, i, j, withThumb(v, r.id && `@${r.id}.${j}`, eIn(`tb.r.${i}.c.${j}`, cTxt(v), '(trống)', { label: `Hàng ${i + 1} cột ${j + 1}` }).replace('<input ', v && v.ans != null ? '<input class="etka" title="Ô học sinh điền: đáp án (in trống)" ' : '<input '))))).join('')}<button class="eb" data-eact="delrow" data-i="${i}" aria-label="Xóa hàng ${i + 1}">✕</button></div>`).join('');
  return `<p class="hint">Ô để trống = chỗ viết · <b>=chữ</b> = ô học sinh điền, chữ là đáp án (in trống) · <b>[ ]</b> = ô tích, <b>[ ] chữ</b> = ô tích kèm chữ, <b>[x]</b> = ô tích đúng · <b>+ảnh</b> thêm ảnh vào ô, <b>×</b> trên ảnh nhỏ để gỡ</p><div class="etbl" style="--nc:${c.cols.length + 1}">${head}${rows}</div>
    <div class="erow"><button class="btn" data-eact="addrow">+ Hàng</button><button class="btn" data-eact="addcol">+ Cột</button><button class="btn" data-eact="delcol" ${c.cols.length > 1 ? '' : 'disabled'}>− Cột cuối</button><button class="btn" data-eact="paste-items" title="Dán bảng: mỗi dòng một hàng, ô cách nhau bằng Tab hoặc |">Dán bảng…</button></div>`;
}
const nounOf = k => k === 'dialogue' ? 'lượt' : k === 'pairs' ? 'cặp' : k === 'trace' ? 'từ' : 'câu';
// Tóm tắt hiện ở đầu mỗi khu vực (gọn mắt khi khu vực đang thu lại)
function secSums(t) {
  const k = ck(t), c = t.content, it = its(t);
  const on = fieldToggles(t).filter(x => x.on).length;
  return { kind: descOf(t), info: t.title || '', content: c.form === 'table' ? `${c.rows.length} hàng` : k === 'empty' && c.list === false ? 'chỉ có ảnh' : `${it.length} ${nounOf(k)}`, parts: on ? `${on} đang bật` : 'chưa bật', free: (t.extras || []).length ? `${t.extras.length} khối` : 'chưa có' };
}
function gtEd(t) {
  const L = gtOrder(t), ex = t.extras || [];
  const cards = ex.map(x => {
    const i = L.findIndex(y => y.id === x.id), img = x.kind === 'image', n = ex.filter(y => y.kind === x.kind).indexOf(x) + 1, nm = img ? 'ảnh' : 'chữ';
    return `<div class="gtcard" data-x="${x.id}"><div class="gthd"><b>Khối ${nm} ${n}</b><small>${x.pos === 'top' ? 'phía trên bài' : 'phía dưới bài'}</small><span class="gtbt"><button class="eb" data-eact="gtsel" data-x="${x.id}" title="Chọn trên trang để chỉnh cỡ chữ, căn lề, khung" aria-label="Chọn khối ${nm} ${n} để chỉnh định dạng">⚙</button><button class="eb" data-eact="gtup" data-x="${x.id}" ${i <= 0 ? 'disabled' : ''} aria-label="Đưa khối chữ lên">↑</button><button class="eb" data-eact="gtdown" data-x="${x.id}" ${i >= L.length - 1 ? 'disabled' : ''} aria-label="Đưa khối chữ xuống">↓</button><button class="eb" data-eact="gtrm" data-x="${x.id}" aria-label="Xóa khối ${nm} ${n}">✕</button></span></div>${img ? `<div class="ef imgrow">${gtKeys(x).map(k => thumbHtml(t, k)).join('')}${eIn(`x.${x.id}.label`, x.label || '', 'Tên ảnh', { label: 'Tên ảnh' })}</div>` : eIn(`x.${x.id}.text`, x.text || '', 'Gõ chữ. Đầu dòng "- " là gạch đầu dòng, "1. " là danh sách số, **đậm**, *nghiêng*.', { area: 1, rows: 4, label: `Khối chữ ${n}` })}</div>`;
  }).join('');
  return `<p class="hint" style="margin:0 0 6px">Khối tự do nằm ngang cả bề rộng Task, không đánh số, không có đáp án. Chữ: ghi chú, ví dụ, luật chơi, danh sách. Ảnh: ảnh minh họa, sơ đồ.</p>${cards}<div class="stack"><button class="btn" data-eact="gtadd">+ Chữ</button><button class="btn" data-eact="gtadd" data-kind="image">+ Ảnh</button></div>`;
}
function edHtml(t) {
  const m = recipeMatch(t), c = t.content, k = ck(t), a = t.answer, i = ws.tasks.indexOf(t), n = ws.tasks.length, sums = secSums(t);
  const kinds = kindsOk(t), tgl = fieldToggles(t), sl = slotsOf(t);
  const sec = (key, title, inner) => `<section class="sec ${SECT[key] ? 'open' : ''}" data-sec="${key}"><button class="sech" data-stg="${key}" aria-expanded="${SECT[key] ? 'true' : 'false'}"><span class="snum">${({ kind: 1, info: 2, content: 3, parts: 4, free: 5 })[key]}</span><span class="sect">${title}</span><span class="secs">${esc(sums[key] || '')}</span><span class="car">▶</span></button><div class="secb">${inner}</div></section>`;
  const tools = `<div class="tkt" role="toolbar" aria-label="Thao tác với Task ${i + 1}"><button class="eb" data-eact="tup" ${i ? '' : 'disabled'} title="Đưa Task lên" aria-label="Đưa Task lên">↑</button><button class="eb" data-eact="tdown" ${i < n - 1 ? '' : 'disabled'} title="Đưa Task xuống" aria-label="Đưa Task xuống">↓</button><button class="eb" data-eact="tdup" title="Nhân đôi Task" aria-label="Nhân đôi Task">⧉</button><button class="eb tjn" data-eact="tjoin" ${i ? '' : 'disabled'} aria-pressed="${t.layout.break === 'join'}" title="${i ? (t.layout.break === 'join' ? 'Đã nối vào Task phía trên (phần tiếp, không số / tiêu đề). Bấm để bỏ nối' : 'Nối vào Task phía trên: thành phần tiếp, không số / tiêu đề') : 'Task đầu phiếu không nối được'}">${t.layout.break === 'join' ? '↳ Đã nối' : '↳ Nối Task'}</button><span class="sp"></span><button class="eb dng" data-eact="tdel" title="Xóa Task (có hỏi trước, hoàn tác được)" aria-label="Xóa Task"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5M6.8 7v4M9.2 7v4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>`;
  // 1. Dạng bài và đáp án
  const kind = `<div class="tcwrap">${cardHtml(t)}</div>
    <div class="ef"><span class="elb">Áp mẫu</span><select data-eact="recipe" aria-label="Áp một mẫu có sẵn cho Task này" title="Áp một lần: giữ chữ các câu, đổi cấu trúc, đáp án và bố cục theo mẫu. Hoàn tác được."><option value="" selected>Chọn mẫu để áp…</option>${libOpts()}</select></div>
    <div class="ef"><span class="elb">Đáp án</span><select data-eact="kind" aria-label="Loại đáp án" ${kinds.length < 2 ? 'disabled' : ''}>${kinds.map(x => `<option value="${x}" ${a.kind === x ? 'selected' : ''}>${KIND_NAME[x]}</option>`).join('')}</select></div>`;
  // 2. Tiêu đề và hướng dẫn (nhóm G0)
  const info = `<div class="ef"><span class="elb">Tiêu đề</span>${eIn('title', t.title || '', 'Tên bài / lệnh', { label: 'Tiêu đề' })}</div>
    <div class="ef"><span class="elb">Hướng dẫn</span>${eIn('instruction', t.instruction || '', 'Hướng dẫn', { label: 'Hướng dẫn' })}</div>
    <div class="ef"><span class="elb">Track</span>${eIn('audio', t.audio || '', 'không có', { label: 'Track audio' })}</div>${qrEd(t)}`;
  // 3. Nội dung: phần dùng chung (ảnh, bài đọc, khung từ) rồi danh sách câu
  let cont = '';
  if (t.image) cont += `<div class="ef imgrow"><span class="elb">Ảnh chung</span>${slotsOf(t).some(x => x.key === 'G1') ? thumbHtml(t, 'G1') : ''}${eIn('image.label', t.image.label || '', 'Tên ảnh', { label: 'Tên ảnh chung' })}</div>`;
  if (c.lead && c.lead.kind === 'passage') cont += `<div class="ef col"><span class="elb">Bài đọc</span>${eIn('lead.text', c.lead.text || '', 'Dán bài đọc vào đây (___ chỗ trống, {a|b} chọn, **đậm**, *nghiêng*, __gạch chân__; dòng trống = sang đoạn)', { area: 1, rows: 5, label: 'Bài đọc' })}</div>` + ((gapCount(c.lead.text || '') || c.lead.keys) ? `<div class="ef col"><span class="elb">Đáp án chỗ trống</span>${eIn('lead.keys', (c.lead.keys || []).join(', '), 'Theo thứ tự chỗ trống: am, go, play', { label: 'Đáp án chỗ trống trong bài đọc' })}</div>` : '');
  if (c.lead && c.lead.kind === 'text') cont += `<div class="ef"><span class="elb">Lời dẫn</span>${eIn('lead.text', c.lead.text || '', 'Lời giới thiệu', { label: 'Lời dẫn' })}</div>`;
  if (t.wordBank) cont += `<div class="ef col"><span class="elb">Khung từ</span>${eIn('wb.words', t.wordBank.words.join('\n'), 'Mỗi dòng một từ (hoặc cách nhau bằng dấu phẩy)', { area: 1, rows: Math.min(6, Math.max(2, t.wordBank.words.length)), label: 'Khung từ' })}</div>`;
  cont += arSegHtml(t);
  if (c.form === 'table') cont += `<div class="subh">Bảng</div>` + edTable(t);
  else if (c.list !== false) cont += (() => { const n = its(t).length, na = its(t).filter(ansLabel).length; return `<div class="subh">Danh sách ${nounOf(k)}<small>${n}${na ? ` · ${na} có chỗ trả lời` : ''}</small></div>`; })() + edItems(t);
  else cont += `<p class="hint" style="margin:${cont ? '8px' : 0} 0 0">Danh sách câu đang tắt${(c.items || []).length ? ` (vẫn giữ ${c.items.length} câu)` : ''}. Bật ở mục 4 · Thành phần của bài.</p>`;
  // 4. Thành phần của bài (công tắc bật / tắt các trường)
  const parts = tgl.length ? `<p class="hint" style="margin:0 0 4px">Bật hoặc tắt các thành phần của bài. Mục nào mờ là không dùng cho dạng này.</p><div class="etgs">${tgl.map(x => `<label class="etg ${x.dis ? 'dis' : ''}" title="${esc(x.dis || '')}"><input type="checkbox" data-tg="${x.id}" ${x.on ? 'checked' : ''} ${x.dis && !x.on ? 'disabled' : ''}>${x.label}</label>`).join('')}</div>` : '';
  return `<div class="ed" data-ed="${t.id}">${tools}${sec('kind', 'Dạng bài &amp; đáp án', kind)}${sec('info', 'Tiêu đề &amp; hướng dẫn', info)}${sec('content', 'Nội dung', cont)}${parts ? sec('parts', 'Thành phần của bài', parts) : ''}${sec('free', 'Khối tự do', gtEd(t))}</div>`;
}
// ---- Mã QR nghe: link (tự sinh mã) hoặc ảnh mã tải sẵn hoặc file nghe (hệ thống tự tạo link rồi sinh mã) ----
function qrUrl(t) {
  const q = t.qr; if (!q) return ''; const v = String((q.src === 'file' ? q.url : q.link) || '').trim(); if (!v) return '';
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return v;
  const b = String(ws.audioBase || '').trim().replace(/\/+$/, ''); return b ? b + '/' + v.replace(/^\/+/, '') : v;
}
function qrInner(t) {
  const q = t.qr; if (!q) return '';
  if (q.src === 'img') return q.img ? `<img src="${q.img}" alt="Mã QR nghe">` : '';
  const u = qrUrl(t); if (!u) return '';
  try { const g = qrcode(0, 'M'); g.addData(encodeURI(u)); g.make(); return g.createSvgTag({ cellSize: 1, margin: 0, scalable: true }); } catch (_) { return ''; }
}
const qrHtml = t => { if (!t.audio) return ''; const h = qrInner(t); return h ? `<div class="qrb" title="Quét để nghe">${h}</div>` : ''; };
function qrEd(t) {
  if (!t.audio) return '';
  const q = t.qr || { src: 'link' }, src = q.src || 'link', inner = qrInner(t);
  const seg = `<span class="seg">${[['link', 'Link'], ['img', 'Ảnh mã'], ['file', 'File nghe']].map(([v, n]) => `<button type="button" data-eact="qrsrc" data-v="${v}" class="${src === v ? 'on' : ''}">${n}</button>`).join('')}</span>`;
  let body = '';
  if (src === 'link') body = eIn('qr.link', q.link || '', 'Link nghe, hoặc phần cuối sau địa chỉ gốc', { label: 'Link nghe' });
  else if (src === 'img') body = `<button type="button" class="btn" data-eact="qrimg">${q.img ? 'Thay ảnh mã…' : 'Tải ảnh mã…'}</button>${q.img ? '<button type="button" class="btn" data-eact="qrrm">Gỡ</button>' : ''}`;
  else body = `<button type="button" class="btn" data-eact="qrfile">${q.url ? 'Thay file nghe…' : 'Tải file nghe…'}</button>${q.file ? `<span class="qrnote">${esc(q.file)}</span>` : ''}${q.url ? '<button type="button" class="btn" data-eact="qrrm">Gỡ</button>' : ''}`;
  const base = src === 'img' ? '' : `<div class="ef col"><span class="elb">Địa chỉ gốc (cả phiếu)</span>${eIn('qr.base', ws.audioBase || '', 'Ví dụ: https://pinta.vn/audio', { label: 'Địa chỉ gốc audio' })}</div>`;
  const note = src === 'file' ? `<p class="qrnote">${q.demo ? 'Bản demo: chưa nối kho lưu file nghe, link chỉ là mẫu (không nghe được). Hệ thống thật sẽ trả về link thật.' : 'Link được hệ thống tạo khi tải file lên.'}${q.url ? ' ' + esc(qrUrl(t)) : ''}</p>` : '';
  return `<div class="ef col"><span class="elb">Mã QR nghe</span><div class="qrrow"><span class="qrp">${inner || 'Chưa có mã'}</span><div class="stack" style="flex:1;min-width:0;display:grid;gap:6px">${seg}<div class="qrrow">${body}</div></div></div></div>${note}${base}`;
}
// ---- Sửa trực tiếp: gõ = cập nhật trang ngay (không dựng lại cột trái), rời ô = ghi vào lịch sử hoàn tác ----
let edSnap = null, edTimer = null, edDirty = false;
function liveRender() {
  const res = paginate(); lastRes = res; draw(); renderInspector();
  const edE = document.querySelector('#tree .ed'), eid = edE ? edE.dataset.ed : sel.id, t0 = ws.tasks.find(x => x.id === eid);
  if (t0) { document.querySelectorAll('#tree .tcwrap').forEach(e => { e.innerHTML = cardHtml(t0); });
    document.querySelectorAll('#tree .qrp').forEach(e => { e.innerHTML = qrInner(t0) || 'Chưa có mã'; });
    const sm = secSums(t0); document.querySelectorAll('#tree .sec').forEach(e => { const o = e.querySelector('.secs'); if (o && sm[e.dataset.sec] != null) o.textContent = sm[e.dataset.sec]; }); }
  const tn = document.querySelector(`#tree .tnode[data-sel="task"][data-id="${eid}"] .tnm`); if (tn && t0) tn.textContent = t0.typeName;
  document.getElementById('pageBadge').textContent = `${res.pages.length} trang A4`;
  const db = document.getElementById('diagBadge'); db.textContent = res.diags.length ? `${res.diags.length} lỗi tràn trang` : 'Không lỗi tràn'; db.classList.toggle('bad', !!res.diags.length);
}
function edFlush() { if (edSnap && edDirty) { hist.push(edSnap); fut = []; document.getElementById('undo').disabled = false; } edSnap = null; edDirty = false; }
const treeEl = document.getElementById('tree');
treeEl.addEventListener('focusin', e => { if (e.target.closest('.ed [data-k]')) { edFlush(); edSnap = clone(ws); } });
treeEl.addEventListener('input', e => {
  const i = e.target.closest('[data-k]'); if (!i || !i.closest('.ed')) return;
  const t = ws.tasks.find(x => x.id === i.closest('.ed').dataset.ed); if (!t) return;
  if (!edSnap) edSnap = clone(ws);
  applyField(t, i.dataset.k, i.value); edDirty = true;
  if (/^tb\.r\.\d+\.c\./.test(i.dataset.k)) i.classList.toggle('etka', /^\s*=\s*\S/.test(i.value));   // v92: ô "=…" tô xanh ngay khi gõ
  if (i.dataset.k === 'cross.grid') { const x = document.getElementById('xcount'), n = crossCount(t.content); if (x) x.textContent = `${n.cells} ô · ${n.words} từ (${n.across} ngang, ${n.down} dọc).`; }   // v99: số ô / số từ cập nhật khi gõ lưới
  clearTimeout(edTimer); edTimer = setTimeout(liveRender, 140);
});
treeEl.addEventListener('focusout', e => { if (e.target.closest('.ed [data-k]')) { clearTimeout(edTimer); if (edDirty) { ws.tasks.forEach(tidy); liveRender(); kcntSync(); } edFlush(); } });
// v88: gõ đáp án xong (rời ô) thì chip "x/y câu có đáp án" cập nhật ngay, không cần vẽ lại khung soạn
function kcntSync() { document.querySelectorAll('#tree .ed[data-ed]').forEach(ed => { const t = ws.tasks.find(x => x.id === ed.dataset.ed), b = ed.querySelector('.kcnt'); if (!t || !b) return; const ks = keyState(t); b.textContent = `${ks.need.length - ks.miss.length}/${ks.need.length} câu có đáp án`; b.classList.toggle('w', !!ks.miss.length); }); }
treeEl.addEventListener('change', e => {
  const x = e.target;
  if (x.dataset.tg) { const id = x.closest('.ed').dataset.ed, on = x.checked; return commit(w => toggleField(w.tasks.find(y => y.id === id), x.dataset.tg, on)); }
  if (x.dataset.eact === 'kind') { const id = x.closest('.ed').dataset.ed, v = x.value; return commit(w => setKind(w.tasks.find(y => y.id === id), v), `Loại đáp án: ${KIND_NAME[v]}`); }
  if (x.dataset.eact === 'recipe') { const id = x.closest('.ed').dataset.ed, v = x.value; if (!v || !recipeById(v)) return; return commit(w => applyRecipe(w.tasks.find(y => y.id === id), recipeById(v)), `Đã áp mẫu “${recipeById(v).name}” (Ctrl+Z để hoàn tác)`); }
});
let qrTask = null;
document.getElementById('qrImgFile').addEventListener('change', async e => { const f = e.target.files[0], id = qrTask; if (!f || !id) return;
  try { const im = await loadImg(f); commit(w => { const t = w.tasks.find(x => x.id === id); t.qr = Object.assign({}, t.qr, { src: 'img', img: im.src }); }, 'Đã gắn ảnh mã QR'); } catch (_) { toast('Không đọc được ảnh này'); } });
// File nghe: nối dịch vụ lưu file bằng window.WSAudioUpload.upload(file) → { url }. Chưa nối thì dùng link mẫu để thử luồng thao tác.
document.getElementById('qrAudFile').addEventListener('change', async e => { const f = e.target.files[0], id = qrTask; if (!f || !id) return;
  let r, demo = false;
  try { if (window.WSAudioUpload && typeof window.WSAudioUpload.upload === 'function') r = await window.WSAudioUpload.upload(f); else { demo = true; r = { url: 'https://example.invalid/audio/' + encodeURIComponent(f.name.replace(/\s+/g, '-')) }; } } catch (_) { toast('Không tải được file nghe'); return; }
  const url = typeof r === 'string' ? r : r && r.url; if (!url) { toast('Dịch vụ không trả link'); return; }
  commit(w => { const t = w.tasks.find(x => x.id === id); t.qr = Object.assign({}, t.qr, { src: 'file', file: f.name, url, demo: demo || undefined }); }, demo ? 'Đã tạo mã QR (link mẫu)' : 'Đã tải file và tạo mã QR'); });
treeEl.addEventListener('click', e => {
  const b = e.target.closest('[data-eact]'); if (!b || b.disabled || b.tagName === 'SELECT') return;
  const ed = b.closest('.ed'), id = ed ? ed.dataset.ed : null, act = b.dataset.eact, i = +b.dataset.i;
  const T = w => w.tasks.find(y => y.id === id);
  if (act === 'gtadd') { let nid; return commit(w => { const t = T(w); t.extras = t.extras || []; nid = newId(new Set(t.extras.map(y => y.id)), 'x'); t.extras.push(b.dataset.kind === 'image' ? { id: nid, kind: 'image', pos: 'bottom', label: 'ảnh' } : { id: nid, kind: 'text', pos: 'bottom', text: '' }); }, null, () => { SECT.gt = true; sectSave(); sel = { type: 'group', id, g: 'GT', item: nid }; refreshSel(); focusK(`x.${nid}.${b.dataset.kind === 'image' ? 'label' : 'text'}`); }); }
  if (act === 'gtsel') { sel = { type: 'group', id, g: 'GT', item: b.dataset.x }; multi = []; refreshSel(); const el = stage.querySelector(`[data-node="${nodeKey(sel)}"]`); if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
  if (act === 'gtup' || act === 'gtdown') return commit(w => gtMove(T(w), b.dataset.x, act === 'gtup' ? -1 : 1));
  if (act === 'gtrm') return commit(w => { const t = T(w); dropOrphans(t, b.dataset.x); t.extras = (t.extras || []).filter(y => y.id !== b.dataset.x); if (!t.extras.length) delete t.extras; }, 'Đã xóa khối', () => { if (sel.g === 'GT') { sel = { type: 'task', id }; refreshSel(); } });
  if (act === 'add') return commit(w => { const t = T(w); const x = blankItem(t); t.content.items = t.content.items || []; t.content.items.push(x); ensureIds(t); normAnswer(t); }, null, () => focusK(`it.${its(curT(ws)).length - 1}.` + (its(curT(ws)).slice(-1)[0].pair ? 'pl' : its(curT(ws)).slice(-1)[0].lines ? 'lines' : 'text')));
  if (act === 'del') return commit(w => { const t = T(w), x = its(t)[i]; dropOrphans(t, x.id); t.content.items.splice(i, 1); normAnswer(t); }, `Đã xóa câu ${i + 1}`);
  if (act === 'dupi') return commit(w => { const t = T(w), x = clone(its(t)[i]); delete x.id; t.content.items.splice(i + 1, 0, x); ensureIds(t); });
  if (act === 'up' || act === 'down') return commit(w => { const a = T(w).content.items, j = act === 'up' ? i - 1 : i + 1; [a[i], a[j]] = [a[j], a[i]]; });
  if (act === 'qrsrc') return commit(w => { const t = T(w); t.qr = Object.assign({}, t.qr, { src: b.dataset.v }); });
  if (act === 'qrrm') return commit(w => { const t = T(w); if (t.qr) { if (t.qr.src === 'img') delete t.qr.img; else { delete t.qr.url; delete t.qr.file; delete t.qr.demo; } } });
  if (act === 'qrimg') { qrTask = id; const f = document.getElementById('qrImgFile'); f.value = ''; return f.click(); }
  if (act === 'qrfile') { qrTask = id; const f = document.getElementById('qrAudFile'); f.value = ''; return f.click(); }
  if (act === 'tblar') return commit(w => { const t = T(w); t.content.imgAr = b.dataset.v === '4/3' ? null : b.dataset.v; }, `Tỉ lệ ô ảnh bảng: ${b.dataset.v.replace('/', ':')}`);
  if (act === 'addrow') return commit(w => { const t = T(w), c = t.content; c.rows.push({ head: '', cells: c.cols.map(() => '') }); ensureRowIds(t); });
  if (act === 'delrow') return commit(w => { const t = T(w), c = t.content; if (c.rows[i] && c.rows[i].id) dropOrphans(t, c.rows[i].id); c.rows.splice(i, 1); const o = t.layout.table; if (o && o.rhs) o.rhs = null; });
  if (act === 'addcol') return commit(w => { const t = T(w), c = t.content; c.cols.push(''); c.rows.forEach(r => r.cells.push('')); if (t.layout.table) t.layout.table.cw = null; });
  if (act === 'delcol') return commit(w => { const t = T(w), c = t.content; const jn = c.cols.length - 1; c.rows.forEach(r => { if (r.id) { if (t.uploads) delete t.uploads[`@${r.id}.${jn}`]; if (t.upMeta) delete t.upMeta[`@${r.id}.${jn}`]; if (t.imgAr) delete t.imgAr[`@${r.id}.${jn}`]; } }); c.cols.pop(); c.rows.forEach(r => r.cells.pop()); if (t.layout.table) t.layout.table.cw = null; });
  if (act === 'paste-items') return openPaste('items', id);
  if (act === 'tup' || act === 'tdown') return commit(w => { const a = w.tasks, k = a.findIndex(y => y.id === id), j = act === 'tup' ? k - 1 : k + 1; [a[k], a[j]] = [a[j], a[k]]; }, act === 'tup' ? 'Đã đưa Task lên' : 'Đã đưa Task xuống');
  if (act === 'tjoin') return commit(w => { const t = w.tasks.find(y => y.id === id); t.layout.break = t.layout.break === 'join' ? null : 'join'; }, 'Đã đổi: nối vào Task trên');
  if (act === 'tdup') { let nid; commit(w => { const k = w.tasks.findIndex(y => y.id === id), c = clone(w.tasks[k]); nid = c.id = newId(new Set(w.tasks.map(y => y.id)), 't'); w.tasks.splice(k + 1, 0, c); }); sel = { type: 'task', id: nid }; refreshSel(); toast('Đã nhân đôi Task'); return; }
  if (act === 'tdel') { const k = ws.tasks.findIndex(y => y.id === id), num = k + 1, nm = ws.tasks[k] && (ws.tasks[k].title || ws.tasks[k].typeName) || '';
    return askConfirm(`Xóa Task ${num}${nm ? ' «' + nm.slice(0, 50) + '»' : ''}?`, 'Task và mọi nội dung trong đó sẽ bị xóa khỏi phiếu. Bấm Ctrl+Z để hoàn tác.', 'Xóa Task').then(yes => { if (!yes) return; const k2 = ws.tasks.findIndex(y => y.id === id); if (k2 < 0) return; commit(w => { w.tasks.splice(k2, 1); }); sel = ws.tasks[k2] ? { type: 'task', id: ws.tasks[k2].id } : (ws.tasks[k2 - 1] ? { type: 'task', id: ws.tasks[k2 - 1].id } : { type: 'sheet' }); multi = []; refreshSel(); toast(`Đã xóa Task ${num} · Ctrl+Z để hoàn tác`); }); }
});
function focusK(k) { const e = document.querySelector(`#tree .ed [data-k="${k}"]`); if (e) { e.focus(); e.scrollIntoView({ block: 'nearest' }); } }
// Kéo đổi thứ tự câu
let dragI = null;
treeEl.addEventListener('dragstart', e => { const g = e.target.closest('[data-drag]'); if (!g) return; dragI = +g.dataset.drag; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', 'it' + dragI); });
treeEl.addEventListener('dragover', e => { const r = e.target.closest('.eit'), d = e.target.closest('.edrop'); if ((r && dragI != null) || (d && e.dataTransfer.types.includes('Files'))) { e.preventDefault(); (r || d).classList.add('dov'); } });
treeEl.addEventListener('dragleave', e => { const r = e.target.closest('.eit,.edrop'); if (r) r.classList.remove('dov'); });
treeEl.addEventListener('drop', e => {
  const r = e.target.closest('.eit'), d = e.target.closest('.edrop');
  if (d && e.dataTransfer.files.length) { e.preventDefault(); d.classList.remove('dov'); dropImages(d.dataset.drop, [...e.dataTransfer.files], null); return; }
  if (!r || dragI == null) return; e.preventDefault();
  const to = +r.dataset.i, from = dragI, id = r.closest('.ed').dataset.ed; dragI = null; if (to === from) return;
  commit(w => { const a = w.tasks.find(y => y.id === id).content.items, [x] = a.splice(from, 1); a.splice(to, 0, x); }, `Đã chuyển câu ${from + 1} tới vị trí ${to + 1}`);
});
treeEl.addEventListener('dragend', () => { dragI = null; });
// Áp công thức cho Task có sẵn: giữ chữ các câu, đổi cấu trúc + đáp án + bố cục về mặc định của công thức
function applyRecipe(t, r) {
  const mk = clone(r.make), old = its(t).map(x => ({ text: x.text != null ? x.text : x.pair ? ((x.pair.l || {}).text || '') : (x.lines || []).join(' '), r: x.pair && x.pair.r ? x.pair.r.text : '', opts: x.opts, who: x.who }));
  const oldTable = t.content.form === 'table' ? t.content : null, oldLead = t.content.lead || null;
  const c = mk.content;
  if (c.form === 'table') {
    if (oldTable) t.content = oldTable;
    else { t.content = { form: 'table', corner: c.corner || '', cols: c.cols.slice(), rows: old.length ? old.map(o => ({ head: o.text, cells: c.rows[0].cells.map(v => clone(v)) })) : clone(c.rows) }; }
  } else {
    const tpl = c.items[0] || {}, src = oldTable ? oldTable.rows.map(rw => ({ text: typeof rw.head === 'string' ? rw.head : (rw.head && rw.head.text) || '' })) : old;
    const items = (src.length ? src : c.items).map((o, i) => {
      const x = clone(tpl);
      if (x.pair) { x.pair.l = Object.assign(x.pair.l || {}, { text: o.text || '' }); x.pair.r = { text: o.r || '' }; }
      else if (x.lines) x.lines = [o.text || ''];
      else x.text = src.length ? (o.text || '') : x.text;
      if (x.img) x.img = 'ảnh ' + (i + 1);
      if (x.who != null) x.who = o.who || (i % 2 ? 'B' : 'A');
      if (x.opts && o.opts) x.opts = o.opts.slice();
      return x;
    });
    t.content = c.list === false ? { form: 'list', list: false, items: [] } : { form: 'list', items };
    if (c.variant) t.content.variant = c.variant;
    if (c.lead) t.content.lead = Object.assign(clone(c.lead), oldLead && oldLead.kind === c.lead.kind && oldLead.text ? { text: oldLead.text } : {});
    ensureIds(t);
  }
  t.answer = Object.assign({ params: {} }, clone(mk.answer));
  if (mk.image && !t.image) t.image = clone(mk.image);
  t.layout = LAYOUT_DEF(); t.typeId = r.id; t.typeName = r.name;
  normAnswer(t); tidy(t);
}
// Tạo Task mới từ công thức
function newTaskFrom(r, w) {
  const m = clone(r.make), used = new Set(w.tasks.map(x => x.id));
  const t = { id: newId(used, 't'), typeId: r.id, typeName: r.name, title: m.title || '', instruction: m.instruction || '', content: m.content, answer: Object.assign({ params: {} }, m.answer), layout: LAYOUT_DEF(), spacing: { preset: null, overrides: {} } };
  if (m.audio) t.audio = m.audio; if (m.image) t.image = m.image; if (m.wordBank) t.wordBank = m.wordBank;
  ensureIds(t); tidy(t); return t;
}
function insertTask(t, w) { const k = sel.type !== 'sheet' ? w.tasks.findIndex(x => x.id === sel.id) : -1; w.tasks.splice(k >= 0 ? k + 1 : w.tasks.length, 0, t); return t.id; }

/* ================= 0d: đưa bài vào bằng dán chữ (một Task hoặc cả đề) ================= */
// Nhận dạng chỉ dùng các ký hiệu có sẵn: ___ chỗ trống, {a|b} chọn trong câu, "Tên:" người nói, A. B. C. lựa chọn, ? câu hỏi.
const VERB_RE = /^(look|listen|read|write|match|choose|circle|tick|complete|answer|trace|colou?r|fill|underline|draw|number|put|order|find|say|copy|unscramble|label|correct|join|cross|sort|ask|talk|tell|use|make|check|spell|point|sing|play|work)\b/i;
const HEAD_RE = /^\s*(task|exercise|part|section|activity|bài|phần)\s*[\dIVX]+\s*[.:)\-–]?\s*/i;
const NUM_RE = /^\s*(\(?\d{1,2}[.)]|\(\d{1,2}\)|[a-h][.)](?=\s))\s*/i;
const BARE_RE = /^\s*\d{1,2}\s+(?=\S)/;   // số hoạt động không có dấu chấm ("2 Work with…", hay gặp khi copy từ PDF)
const stripNum = s => s.replace(NUM_RE, '');
const normGap = s => s.replace(/_{2,}|\.{4,}|…{2,}|(?:_\s){2,}_/g, '___');
// Dòng đầu mục / dòng lệnh: một câu trong dòng bắt đầu bằng động từ lệnh (Look, Listen, Read…), hoặc "True or False"
const HEADX = /^(true or false|yes or no|odd one out)\b/i;
const isHead = s => { const x = s.replace(HEAD_RE, '').trim(); if (!x || NUM_RE.test(s) || x.includes('___') || /\{[^}]*\|/.test(x) || x.includes('\t') || x.length > 160) return false; return x.split(/(?<=[.?!:])\s+/).some(p => VERB_RE.test(p) || HEADX.test(p)); };
const isInstr = s => { const x = s.replace(HEAD_RE, '').replace(NUM_RE, '').trim(); return !!x && VERB_RE.test(x) && !x.includes('___') && !/\{[^}]*\|/.test(x) && !/\?\s*$/.test(x) && x.length <= 140; };
// "(on / off)" hoặc "on / off" trong câu → {on|off}
const inlineOpts = s => s.replace(/\(([^()]{1,40}?(?:\s\/\s[^()]{1,40}?)+)\)/g, (m, g) => `{${g.split(/\s\/\s/).map(x => x.trim()).join('|')}}`);
function splitOptsLine(s) { // "What is it? A. cat B. dog C. pig" → [câu, [cat, dog, pig]]
  const m = [...s.matchAll(/(?:^|\s)\(?([A-Da-d])[.)]\s+(?!_{3,})/g)];   // v101: "(a) ___" là nhãn chỗ trống, không phải lựa chọn
  if (m.length >= 2 && m.map(x => x[1].toUpperCase()).join('').startsWith('AB')) {
    const head = s.slice(0, m[0].index).trim(), opts = m.map((x, i) => s.slice(x.index + x[0].length, i + 1 < m.length ? m[i + 1].index : undefined).trim());
    return [head, opts];
  }
  return null;
}
function parseTask(raw, force, pre) {
  const notes = [];
  let L = String(raw).replace(/\r/g, '').split('\n').map(x => x.replace(/[ \u00a0]+$/, ''));
  while (L.length && !L[0].trim()) L.shift(); while (L.length && !L[L.length - 1].trim()) L.pop();
  let title = '', instruction = '', audio = '', bank = null, passage = '', table = null;
  // tiêu đề, hướng dẫn, track
  const takeHead = () => { while (L.length && !L[0].trim()) L.shift(); };
  takeHead();
  if (pre) { title = pre.title || ''; instruction = pre.instruction || ''; audio = pre.audio || ''; }
  else {
  if (L.length && BARE_RE.test(L[0]) && isHead(L[0].replace(BARE_RE, ''))) L[0] = L[0].replace(BARE_RE, '');
  if (L.length && HEAD_RE.test(L[0])) { const rest = L[0].replace(HEAD_RE, '').trim(); if (rest) L[0] = rest; else L.shift(); takeHead(); }
  // Có dòng đánh số: các dòng không đánh số ở đầu (ngắn, không phải bảng/khung từ/bài đọc) là tiêu đề + hướng dẫn
  const firstNum = L.findIndex(x => NUM_RE.test(x));
  const headOk = x => x.trim() && !NUM_RE.test(x) && x.trim().length <= 160 && !x.includes('___') && !x.includes('\t') && !/\s\|\s/.test(x) && !/^\s*(words?|word bank|box)\s*:/i.test(x) && !/^\s*[\[(].*[\])]\s*$/.test(x) && !/^([A-Z][\p{L}.' -]{0,18}):\s+/u.test(x);
  let hl = [];
  if (firstNum > 0) { for (let i = 0; i < firstNum && hl.length < 3; i++) { if (!L[i].trim()) continue; if (!headOk(L[i])) break; hl.push(i); } }
  if (hl.length) { const hs = hl.map(i => L[i].trim()); L = L.filter((_, i) => !hl.includes(i)); title = hs[0]; if (hs.length > 1) instruction = hs.slice(1).join(' '); takeHead(); }
  else if (L.length && (isHead(L[0]) || (L.length > 1 && /[.!:?]$/.test(L[0].trim()) && headOk(L[0]) && L[0].length < 100))) { title = stripNum(L.shift().trim()); takeHead(); }
  const tr = t => { const m = t.match(/\(?\s*(track\s*\d+[a-z]?|cd\s*\d+[.:]\d+)\s*\)?/i); return m ? m[1] : ''; };
  if (title && tr(title)) { audio = tr(title); title = title.replace(/\(?\s*(track\s*\d+[a-z]?|cd\s*\d+[.:]\d+)\s*\)?/i, '').trim(); }
  if (L.length && tr(L[0]) && L[0].replace(/\(?\s*(track\s*\d+[a-z]?|cd\s*\d+[.:]\d+)\s*\)?/i, '').trim().length < 3) { audio = tr(L.shift()); takeHead(); }
  if (!instruction && L.length && isInstr(L[0]) && !NUM_RE.test(L[0])) { instruction = L.shift().trim(); takeHead(); }
  }
  let body = L.filter(x => x.trim()), image = null;
  const imI = body.findIndex(x => /^\s*\[ảnh:\s*[^\]]+\]\s*$/i.test(x)); if (imI >= 0) { image = body.splice(imI, 1)[0].replace(/^\s*\[ảnh:\s*|\]\s*$/gi, '').trim(); }
  // khung từ
  const bi = body.findIndex(x => /^\s*(words?|word bank|box|từ)\s*:/i.test(x) || (/^\s*[\[(].*[\])]\s*$/.test(x) && /,|\s\/\s|\|/.test(x) && !x.includes('___') && !/^\s*\[ảnh:/i.test(x)));
  if (bi >= 0) { const s = body[bi].replace(/^\s*(words?|word bank|box|từ)\s*:/i, '').replace(/^\s*[\[(]|[\])]\s*$/g, ''); bank = s.split(/,|\s\/\s|\||\s{2,}/).map(x => x.trim()).filter(Boolean); body.splice(bi, 1); }
  // bảng: các dòng có Tab hoặc " | " cùng số cột
  const cellsOf = x => x.includes('\t') ? x.split('\t') : x.split(/\s\|\s|\|/);
  const tl = body.filter(x => x.includes('\t') || /\s\|\s/.test(x));
  if (tl.length >= 2 && tl.length >= body.length * .6) {
    const rows = tl.map(x => cellsOf(x).map(y => y.trim())), n = Math.max(...rows.map(r => r.length));
    const hd = rows.shift(); while (hd.length < n) hd.push('');
    table = { form: 'table', corner: brIn(hd[0] || ''), cols: hd.slice(1).map(brIn), rows: rows.map(r => { while (r.length < n) r.push(''); return { head: /^\s*\[ảnh:/i.test(r[0]) ? parseCell(r[0]) : brIn(r[0]), cells: r.slice(1).map(v => parseCell(/^\s*(\[\s*\]|☐|□)\s*$/.test(v) ? '✓' : v)) }; }) };
  }
  // bài đọc: đoạn dài không đánh số, đứng trước các câu hỏi
  if (pre && pre.passage) passage = pre.passage;
  else if (!table) { const pi = body.findIndex(x => x.trim().length > 150 && !NUM_RE.test(x) && !x.includes('___')); if (pi >= 0 && pi < body.length - 1) { const ps = []; while (body.length > pi && body[pi].trim().length > 60 && !NUM_RE.test(body[pi])) ps.push(body.splice(pi, 1)[0].trim()); passage = ps.join(' '); } }
  // câu
  const items = []; const instr = (title + ' ' + instruction).toLowerCase();
  if (!table) body.forEach(x0 => {
    let x = normGap(inlineOpts(x0.trim()));
    const opt = /^\s*\(?([A-Da-d])[.)]\s+/.exec(x);
    if (opt && items.length && !NUM_RE.test(x0.replace(/^\s*\(?[A-Da-d][.)]/, '')) && (items[items.length - 1].opts || opt[1].toUpperCase() === 'A')) {
      const so = splitOptsLine(x); const last = items[items.length - 1]; last.opts = (last.opts || []).concat(so ? so[1] : [x.replace(/^\s*\(?[A-Da-d][.)]\s+/, '')]); return;
    }
    x = stripNum(x);
    let im = null; const mi = /^\[ảnh:\s*([^\]]+)\]\s*/i.exec(x); if (mi) { im = mi[1].trim(); x = x.slice(mi[0].length); }
    const push = o => { if (im) o.img = im; items.push(o); };
    const so = splitOptsLine(x); if (so && (so[0] || (pre && so[1].length >= 2))) { push({ text: so[0], opts: so[1] }); return; }   // MD: câu chỉ có lựa chọn (không có thân câu) vẫn là một câu
    if (items.length && /^[^/]{1,25}(\s\/\s[^/]{1,25}){1,4}$/.test(x) && !x.includes('___') && !items[items.length - 1].opts && /\?$|___/.test(items[items.length - 1].text || '')) { items[items.length - 1].opts = x.split(/\s\/\s/).map(y => y.trim()); return; }
    push({ text: x });
  });
  // người nói
  const whoRe = /^([A-Z][\p{L}.' -]{0,18}):\s+(.*)$/u;
  let intro = '';
  const whoLike = items.length >= 2 && items.filter(x => whoRe.test(x.text)).length >= Math.max(2, (items.length - 1) * .6);
  // MD: hội thoại chỉ nhận qua khối "Hội thoại:" (tránh nhầm ô điền "Place of the party: ___" là lời người nói)
  if (whoLike && !pre) { while (items.length && !whoRe.test(items[0].text)) intro += (intro ? ' ' : '') + items.shift().text; items.forEach(x => { const m = whoRe.exec(x.text); if (m) { x.who = m[1]; x.text = m[2]; } else x.who = ''; }); }
  // cặp nối: "trái - phải" / Tab / 2+ dấu cách
  const pairRe = /^(.+?)\s+(?:[-–—→]|\.{3,}|\s{2,})\s*(.+)$/;
  const wantMatch = (pre && pre.match) || /\bmatch|\bjoin|\bnối/.test(instr), imgPair = x => x.img && /^[-–—→]\s*\S/.test(x.text || '');   // "[ảnh: apple] - pear": vế trái là ảnh
  const sideR = x => !x.img && /^[-–—→]\s+\S/.test(x.text || '');   // v105: "6. - F. very cold" = vế phải thừa (không có vế trái)
  if (wantMatch && items.length >= 2 && items.filter(x => pairRe.test(x.text) || imgPair(x) || sideR(x)).length >= items.length * .6) items.forEach(x => {
    if (sideR(x)) { x.pair = { r: { text: x.text.replace(/^[-–—→]\s*/, '').trim() } }; delete x.text; return; }
    if (imgPair(x)) { x.pair = { l: { img: x.img }, r: { text: x.text.replace(/^[-–—→]\s*/, '').trim() } }; delete x.img; delete x.text; return; } const m = pairRe.exec(x.text); x.pair = m ? { l: { text: m[1].trim() }, r: { text: m[2].trim() } } : { l: { text: x.text }, r: null }; delete x.text; });
  // Đúng/Sai: "... T / F", "(T/F)", "True False"
  const tfRe = /\s*(\(?\s*T\s*\/\s*F\s*\)?|\(?\s*true\s*\/?\s*false\s*\)?|\(?\s*yes\s*\/\s*no\s*\)?)\s*$/i;
  const isTF = /true or false|\bt or f\b|\btrue\b.*\bfalse\b|yes or no|đúng.*sai/.test(instr) || (items.length && items.filter(x => tfRe.test(x.text || '')).length >= items.length * .6);
  if (isTF) items.forEach(x => { if (x.text) x.text = x.text.replace(tfRe, ''); });
  // đoán CẤU HÌNH (khung + thành phần + loại đáp án) từ ký hiệu trong chữ; không chọn mẫu. Mẫu chỉ áp khi người dùng chọn (force).
  const has = re => items.some(x => re.test(x.text || ''));
  const gap = has(/___/), mark = has(/\{[^{}|]+(\|[^{}|]+)+\}/), opts = items.some(x => x.opts && x.opts.length >= 2);
  let conf = 'cao', kind, multi = false, perImg = false, listOff = false;
  if (table) kind = 'none';
  else if (!items.length && !passage) { kind = 'none'; listOff = true; if (!image && !/colou?r|draw|tô màu|vẽ/.test(instr)) { conf = 'thấp'; notes.push('Không thấy câu nào: tạo Task chỉ có ảnh (danh sách câu tắt).'); } }
  else if (items.some(x => x.pair)) kind = 'match';
  else if (items.some(x => x.who != null)) kind = 'word';
  else if (/\btick\b/.test(instr) && opts && !(pre && pre.box)) { kind = 'tick'; multi = true; }
  else if (isTF) kind = 'tf';
  else if (mark || opts) kind = 'choice';
  else if (/\btrace\b|\btô\b/.test(instr)) kind = 'trace';
  else if (gap) kind = 'word';
  else if (passage) kind = 'sentence';
  else if (/look and write|look,? read and write|write the word/.test(instr)) { kind = 'word'; perImg = true; conf = 'vừa'; }
  else if (items.length && items.filter(x => /\?\s*$/.test(x.text || '')).length >= items.length * .5) kind = 'sentence';
  else if (/answer/.test(instr)) { kind = 'sentence'; conf = 'vừa'; }
  else if (/\btick\b|listen and tick/.test(instr)) { kind = 'tick'; multi = true; conf = 'thấp'; notes.push('Cần ảnh lựa chọn: dán chữ không đủ để biết ảnh.'); }
  else { kind = 'sentence'; conf = 'thấp'; notes.push('Không thấy ký hiệu rõ ràng; đang đoán là câu hỏi, học sinh viết câu trả lời.'); }
  // dựng Task theo cấu hình đoán, chữ lấy từ bài dán
  const t = { id: 't1', typeId: 'custom', typeName: '', title, instruction, content: null, answer: { kind: 'none', attach: 'item', layout: null, params: {} }, layout: LAYOUT_DEF(), spacing: { preset: null, overrides: {} } };
  if (audio) t.audio = audio;
  if (table) t.content = table;
  else {
    t.content = { form: 'list', items: items.map((x, i) => {
      const y = {};
      if (x.pair) y.pair = x.pair; else y.text = x.text || '';
      if (x.who != null) y.who = x.who;
      if (multi) y.imgs = x.opts && x.opts.length ? x.opts.slice() : ['a', 'b', 'c'];
      else if (x.opts && kind === 'choice') y.opts = x.opts.slice();
      if (x.img) y.img = x.img;
      else if (perImg && !multi) { y.img = x.text || 'ảnh ' + (i + 1); y.len = Math.max(3, (x.text || '').length) || 4; delete y.text; }
      return y; }) };
    if (multi) t.content.variant = 'multi'; else if (t.content.items.some(y => y.img)) t.content.variant = 'single';
    if (listOff) t.content.list = false;
    if (passage) t.content.lead = { kind: 'passage', text: passage };
    else if (intro && t.content.items.some(y => y.who != null)) t.content.lead = { kind: 'text', text: intro };
    ensureIds(t);
  }
  if (image) t.image = { label: image, size: listOff ? 'large' : 'medium' };
  else if (listOff) t.image = { label: 'tranh', size: 'large' };
  if (bank) { const dl = ck(t) === 'dialogue'; t.wordBank = { words: bank, placement: dl ? 'right' : 'top', style: dl ? 'list' : 'chips', label: 'lower' }; }
  setKind(t, kind);
  const r = force ? recipeById(force) : null;
  if (r) { applyRecipe(t, r); conf = 'người dùng chọn'; if (title) t.title = title; if (instruction) t.instruction = instruction; }
  normAnswer(t); tidy(t);
  const m = recipeMatch(t);
  if (!r) { t.typeId = m.exact ? m.r.id : 'custom'; t.typeName = descOf(t); if (!t.title && m.exact) t.title = m.r.make.title || ''; }
  return { t, rid: r ? r.id : '', conf, notes };
}
// Cắt cả đề thành từng Task: dòng "Task 1 / Exercise 2 / Part 3…", dòng lệnh (Look and…, Listen and…), hoặc 2 dòng trống liên tiếp
function splitTest(raw) {
  const L = String(raw).replace(/\r/g, '').split('\n'), parts = []; let cur = [], blank = 0, seenBody = false;
  const push = () => { const s = cur.join('\n').trim(); if (s) parts.push(s); cur = []; seenBody = false; };
  L.forEach((x, i) => {
    const t = x.trim();
    if (!t) { blank++; if (blank >= 2 && cur.length) push(); return; }
    const prevBlank = blank > 0 || i === 0; blank = 0;
    const bare = BARE_RE.test(t) && isHead(t.replace(BARE_RE, ''));
    const startHead = HEAD_RE.test(t) || (prevBlank && (isHead(t) || bare) && (seenBody || cur.filter(y => y.trim()).length >= 2));
    if (startHead && cur.length) push();
    cur.push(x); if (!HEAD_RE.test(t) && !isHead(t) && !bare) seenBody = true;
  });
  push();
  return parts;
}
// Chữ thô của một Task (để thử bộ đoán và để người dùng xem lại)
function taskToText(t) {
  const c = t.content, out = [t.title + (t.audio ? ` (${t.audio})` : '')];
  if (t.instruction) out.push(t.instruction);
  if (t.wordBank) out.push('Words: ' + t.wordBank.words.join(', '));
  if (t.image) out.push(`[ảnh: ${t.image.label}]`);
  if (c.form === 'table') { out.push([c.corner || '', ...c.cols].join('\t')); c.rows.forEach(r => out.push([fmtCell(r.head), ...r.cells.map(v => v && v.tick ? '[ ]' + (v.text ? ' ' + v.text : '') : fmtCell(v))].join('\t'))); return out.join('\n'); }
  if (c.lead && c.lead.kind === 'passage') out.push(c.lead.text);
  if (c.lead && c.lead.kind === 'text') out.push(c.lead.text);
  its(t).forEach((x, i) => {
    const n = `${i + 1}. `;
    if (x.pair) out.push(n + ((x.pair.l && (x.pair.l.text || x.pair.l.img)) || '') + ' - ' + ((x.pair.r && x.pair.r.text) || ''));
    else if (x.who != null) out.push(`${x.who}: ${x.text || ''}`);
    else if (x.lines) out.push(n + (x.img ? `[ảnh: ${x.img}] ` : '') + x.lines.join(' '));
    else if (x.imgs) out.push(n + (x.text || '') + ' ' + x.imgs.map((m, j) => `${'abc'[j]}. ${m}`).join(' '));
    else if (x.img && t.answer.kind === 'word') out.push(n + x.img);
    else out.push(n + (x.text || '') + (x.opts ? ' ' + x.opts.map((o, j) => `${'ABCD'[j]}. ${o}`).join(' ') : '') + (t.answer.kind === 'tf' ? ' T / F' : ''));
  });
  return out.join('\n');
}
// ---- Hộp nhập (P1). "+ Task": hai thẻ Mẫu có sẵn | Từ file / dán; Task luôn vào CUỐI phiếu. "+ Phiếu": từ file / dán, để trống = phiếu rỗng; thay phiếu hiện tại sau khi xác nhận.
// Nguồn: JSON (chính) → readJson; MD theo quy ước (P2) → readMd; chữ thô → đoán (parseTask), ghi rõ độ chắc thấp. Mọi kết quả qua bảng nhận diện trước khi vào phiếu.
let impMode = 'task', impTab = 'lib', impJ = null, impConfirm = false, impFile = '', pasteMode = 'task', pasteTimer = null, pasteManual = false;
const PASTE_LONG = 40;   // dán quá số dòng này vào một Task thì cảnh báo
const impDlg = () => document.getElementById('libDlg');
// Chữ có nhiều hoạt động (dòng "Task 1", "Activity 2", "1 Look and…", hoặc cắt được ≥ 2 phần) → Cả đề
function autoPasteMode(raw) { const L = String(raw).split('\n'); const heads = L.filter(x => HEAD_RE.test(x.trim()) || (BARE_RE.test(x) && isHead(x.replace(BARE_RE, '')))).length; return heads >= 2 || splitTest(raw).length > 1 ? 'test' : 'task'; }
function openImport(mode, tab, text) {
  const d = impDlg();
  impMode = mode === 'sheet' ? 'sheet' : 'task'; impTab = impMode === 'sheet' ? 'src' : (tab || 'lib');
  impJ = null; impConfirm = false; impFile = ''; pasteMode = 'task'; pasteManual = false;
  d.dataset.mode = impMode;
  d.querySelector('#libTitle').textContent = impMode === 'sheet' ? 'Phiếu mới: từ file hoặc dán' : 'Thêm Task: chọn dạng bài hoặc từ file / dán';
  d.querySelector('#imTabs').hidden = impMode === 'sheet';
  d.querySelector('#pasteTa').value = text || ''; d.querySelector('#impName').textContent = ''; d.querySelector('#impFile').value = '';
  lnReset(); impShowTab();
  if (!d.open) d.showModal();
  if (impTab === 'src') { impAnalyze(); d.querySelector('#pasteTa').focus(); } else { const b = d.querySelector('#lnQ .lnq.on'); if (b) b.focus(); }
}
function impShowTab() {
  const d = impDlg(), src = impTab === 'src';
  d.querySelectorAll('#imTabs [data-tab]').forEach(b => { const on = b.dataset.tab === impTab; b.classList.toggle('on', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
  d.dataset.tab = impTab; d.querySelector('#libPane').hidden = src; d.querySelector('#srcPane').hidden = !src; d.querySelector('#pasteOk').hidden = !src; d.querySelector('#libAdd').hidden = src;
  if (!src) lnRender();
  if (src) impAnalyze();
}
// Đọc ô nhập thành một lô Task: { src, kind, sheet, sheetNotes, tasks:[{t, notes, err, conf, raw, force, rid, skip}], err }
function impRead(raw) {
  if (looksJson(raw)) return readJson(raw);
  if (MD_RE.test(raw)) return readMd(raw);
  if (!pasteManual) pasteMode = autoPasteMode(raw);
  const chunks = pasteMode === 'test' ? splitTest(raw) : [raw], old = impJ && impJ.src === 'text' ? impJ.tasks : [];
  const tasks = chunks.map((c, i) => { const o = old[i] && old[i].raw === c ? old[i] : null, f = o ? o.force : null; const r = parseTask(c, f); return { t: r.t, notes: r.notes, conf: r.conf, rid: r.rid, raw: c, force: f, skip: o ? !!o.skip : false, err: '' }; });
  if (tasks.length > IMP_MAX) return { src: 'text', err: `Cắt được ${tasks.length} Task, nhiều hơn giới hạn ${IMP_MAX}.` };
  return { src: 'text', kind: 'tasks', tasks, lines: raw.split('\n').filter(x => x.trim()).length };
}
function impAnalyze() {
  const d = impDlg(), raw = d.querySelector('#pasteTa').value;
  impConfirm = false; d.querySelector('#srcIn').hidden = false;
  const keep = impJ; impJ = raw.trim() ? impRead(raw) : null;
  if (impJ && keep && impJ.src !== 'text' && keep.src === impJ.src && keep.raw === raw) impJ = keep;   // giữ các ô đã bỏ chọn
  if (impJ) impJ.raw = raw;
  impRender();
}
const impOk = J => J && !J.err ? J.tasks.filter(r => r.t && !r.err && !r.skip) : [];
const SRC_NAME = { json: 'JSON', md: 'MD theo quy ước', text: 'chữ thô' };
function impRender() {
  const d = impDlg(), out = d.querySelector('#pasteOut'), ok = d.querySelector('#pasteOk'), pm = d.querySelector('.pmode'), J = impJ, sheet = impMode === 'sheet';
  pm.hidden = !(J && J.src === 'text');
  d.querySelectorAll('.pmode [data-pm]').forEach(x => x.classList.toggle('on', x.dataset.pm === pasteMode));
  if (!J) {
    out.innerHTML = sheet ? '<p class="hint">Ô đang trống: bấm “Tạo phiếu trống” để bắt đầu một phiếu rỗng. Hoặc chọn file / dán JSON (nguồn chính), MD theo quy ước, chữ thô.</p>'
      : '<p class="hint">Chọn file hoặc dán vào ô trên. Nguồn chính là JSON (vd. Claude đọc PDF ra JSON). MD theo quy ước cũng nhập chính xác. Chữ thô thì hệ thống đoán. Task mới luôn thêm vào cuối phiếu.</p>';
    ok.disabled = !sheet; ok.textContent = sheet ? 'Tạo phiếu trống' : 'Thêm vào cuối phiếu'; return;
  }
  if (J.err) { out.innerHTML = `<div class="diag">${esc(J.err)} Phiếu đang mở không đổi.</div>`; ok.disabled = true; ok.textContent = sheet ? 'Tạo phiếu mới' : 'Thêm vào cuối phiếu'; return; }
  const n = J.tasks.length, bad = J.tasks.filter(r => r.err).length, list = impOk(J);
  const nParts = J.tasks.filter(r => r.joined).length, nTop = n - nParts, multi = {}; J.tasks.forEach(r => { if (r.joined) multi[r.grp] = (multi[r.grp] || 1) + 1; });
  const partTxt = nParts ? ` (${Object.keys(multi).map(g => `Task ${g} có ${multi[g]} phần`).join(', ')})` : '';
  let h = `<p class="hint">Nhận ra <b>${SRC_NAME[J.src]}</b>${J.src === 'json' ? (J.kind === 'sheet' ? ' (cả phiếu)' : ' (Task)') : ''}${impFile ? ` · file “${esc(impFile)}”` : ''}: <b>${nTop}</b> Task${partTxt}${J.src === 'text' && pasteMode === 'test' ? ' (cắt theo dòng đầu mục)' : ''}.</p>`;
  if (J.src === 'text') h += `<div class="diag info">Chữ thô: hệ thống <b>đoán</b>, độ chắc thấp. Xem lại từng Task, chọn mẫu khác nếu đoán sai. Muốn chính xác thì dùng JSON hoặc MD theo quy ước.</div>`;
  if (J.src === 'text' && pasteMode === 'task' && J.lines > PASTE_LONG) h += `<div class="diag">Đang dán ${J.lines} dòng vào <b>một</b> Task. Nếu đây là cả đề, chuyển sang “Cả đề” để cắt thành nhiều Task. <button class="btn" data-pm2="test">Chuyển sang Cả đề</button></div>`;
  if (!sheet && J.kind === 'sheet') h += `<div class="diag info">File có <b>cài đặt cấp phiếu</b>: “+ Task” chỉ lấy các Task, bỏ cài đặt cấp phiếu (tên, tuổi, khoảng cách, xếp trang). <button class="btn" data-imp="tosheet">Mở bằng “+ Phiếu” thay vì thêm</button></div>`;
  if (!sheet && n > 1) h += `<div class="diag warn">File có <b>${nTop}</b> Task${partTxt}. Bỏ chọn Task không muốn nhập; các Task được thêm vào cuối phiếu theo thứ tự trong file.</div>`;
  if (sheet && J.sheetNotes && J.sheetNotes.length) h += `<p class="hint">Cấp phiếu thiếu, sẽ bù mặc định: ${esc(J.sheetNotes.join(', '))}.</p>`;
  if (bad) h += `<div class="diag">${bad} Task không dựng được (xem dòng đỏ).${sheet ? ' Sửa file rồi nạp lại; phiếu đang mở không đổi.' : ' Các Task này sẽ bị bỏ qua.'}</div>`;
  if (J.mdNotes && J.mdNotes.length) h += `<p class="hint">${esc(J.mdNotes.join('; '))}.</p>`;
  h += J.tasks.map((r, i) => impRowHtml(r, i, { check: !sheet && n > 1, text: J.src === 'text', src: J.src })).join('');
  const w2 = sheet ? impSheetObj(J) : Object.assign(clone(ws), { tasks: ws.tasks.concat(list.map(r => clone(r.t))) });
  const est = w2 && (sheet ? (() => { try { return estPages(fillSheet(w2)); } catch (_) { return null; } })() : estPages(w2));
  if (est) h += `<p class="hint imest">Sau khi nhập: khoảng <b>${est.n}</b> trang${est.over ? `, <b style="color:var(--danger)">${est.over} lỗi tràn</b>` : ', không tràn'}.</p>`;
  out.innerHTML = h;
  ok.disabled = sheet ? !!bad || !n : !list.length;
  ok.textContent = sheet ? `Tạo phiếu mới (${n} Task)` : `Thêm ${list.length} Task vào cuối phiếu`;
}
// Bảng nhận diện: mỗi dòng = số theo file, tiêu đề, mô tả cấu hình, số câu/hàng, cảnh báo; chữ thô có thêm độ chắc + chọn mẫu
function impRowHtml(r, i, o) {
  const t = r.t, n = t ? (ck(t) === 'table' ? `${t.content.rows.length} hàng` : ck(t) === 'empty' ? 'chỉ có ảnh' : `${its(t).length} ${ck(t) === 'dialogue' ? 'lượt' : 'câu'}`) : '';
  const warns = t ? contentWarnings(t) : [], noImg = t ? slotsOf(t).filter(s => !srcOf(t, s.key)).length : 0;
  const cb = o.check ? `<input type="checkbox" data-jk="${i}" ${r.skip || !t || r.err ? '' : 'checked'} ${t && !r.err ? '' : 'disabled'} aria-label="Nhập Task ${i + 1}"> ` : '';
  const conf = o.text ? ` <span class="conf c-${r.conf === 'cao' ? 'hi' : r.conf === 'vừa' ? 'mid' : 'lo'}">đoán · độ chắc: ${esc(r.conf)}</span>` : '';
  const pick = o.text ? `<select data-pr="${i}" aria-label="Áp mẫu khác cho Task ${i + 1}" title="Mặc định giữ cấu hình hệ thống đoán; chọn một mẫu nếu đoán sai"><option value="" ${r.rid ? '' : 'selected'}>Giữ cấu hình đoán</option>${libOpts(r.rid)}</select>` : '';
  const m = t ? recipeMatch(t) : null;
  return `<div class="prv imrow${r.err ? ' bad' : ''}" data-ji="${i}"><div class="prh"><label>${cb}<b>${r.no || i + 1}.</b></label> <span class="imt">${t ? esc(t.title || '(chưa có tiêu đề)') : ''}</span>${conf}${pick}</div>
    ${t ? `<div class="prt"><b>${esc(descOf(t))}</b> <span class="hint">· ${n}${m ? (m.exact ? ` · giống mẫu “${esc(m.r.name)}”` : ' · cấu hình riêng') : ''}</span></div>` : ''}
    ${r.err || warns.length || (r.notes || []).length || noImg ? `<ul class="twarn">${r.err ? `<li>${esc(r.err)}</li>` : ''}${(r.notes || []).map(x => `<li class="info">${esc(o.src === 'json' ? 'Đã bù: ' + x : x)}</li>`).join('')}${warns.map(x => `<li class="${x.lv}">${esc(x.m)}</li>`).join('')}${noImg ? `<li class="info">${noImg} ô ảnh chưa có ảnh (ô giữ chỗ).</li>` : ''}</ul>` : ''}
    ${o.text ? `<details><summary>Chữ gốc</summary><pre>${esc(r.raw)}</pre></details>` : ''}</div>`;
}
// Phiếu mới từ lô đã đọc: JSON cả phiếu giữ cài đặt cấp phiếu; còn lại dùng mặc định (MD có thể ghi tên, tuổi…)
function impSheetObj(J) {
  if (!J) return { title: 'Phiếu mới', tasks: [] };
  const base0 = J.kind === 'sheet' && J.sheet ? Object.assign({}, J.sheet) : Object.assign({ title: 'Phiếu mới' }, clone(J.meta || {}));
  base0.tasks = J.tasks.filter(r => r.t).map(r => clone(r.t)); return base0;
}
function impDownloadOld() {
  try { const blob = new Blob([JSON.stringify(ws, null, 1)], { type: 'application/json' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = (String(ws.title || 'phieu').replace(/[\\/:*?"<>|]+/g, '').trim() || 'phieu') + '.json'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); toast('Đã tải JSON phiếu cũ'); }
  catch (e) { toast('Không tải được: ' + e.message); }
}
function impCommit() {
  const d = impDlg(), J = impJ;
  if (impMode === 'task') {
    const list = impOk(J).map(r => r.t); if (!list.length) return;
    d.close(); addTasks(list, J.kind === 'sheet' ? ' · chỉ lấy các Task, bỏ cài đặt cấp phiếu' : ''); return;
  }
  if (J && (J.err || J.tasks.some(r => r.err))) return;
  if (!impConfirm && ws.tasks.length) {     // thay phiếu hiện tại: xác nhận, kèm tải JSON phiếu cũ
    impConfirm = true; d.querySelector('#srcIn').hidden = true; d.querySelector('.pmode').hidden = true;
    d.querySelector('#pasteOut').innerHTML = `<div class="diag imconf"><b>Thay phiếu hiện tại?</b><div>Phiếu “${esc(ws.title)}” (${ws.tasks.length} Task) sẽ được thay bằng phiếu mới${J ? ` (${J.tasks.length} Task)` : ' trống'}. Nạp phiếu xóa lịch sử Hoàn tác, nên không quay lại được.</div><div class="fixes"><button class="btn" data-imp="dl">Tải JSON phiếu cũ</button><button class="btn" data-imp="back">Quay lại</button></div></div>`;
    const ok = d.querySelector('#pasteOk'); ok.disabled = false; ok.textContent = 'Thay phiếu hiện tại'; return;
  }
  const obj = impSheetObj(J);
  if (loadSheet(obj, J ? `Đã tạo phiếu mới (${obj.tasks.filter(t => !(t.layout && t.layout.break === 'join')).length} Task${obj.tasks.some(t => t.layout && t.layout.break === 'join') ? `, ${obj.tasks.length} khối` : ''})` : 'Đã tạo phiếu trống')) d.close();
}
// Chọn file: JSON / MD / TXT đọc như chữ; file khác (PDF…) chỉ đọc được khi WS Studio gắn window.WSImport.extract(file) → {tasks:[…]}
async function impPickFile(f) {
  if (!f) return; const d = impDlg(), ta = d.querySelector('#pasteTa'); impFile = f.name; d.querySelector('#impName').textContent = f.name;
  const ext = (f.name.split('.').pop() || '').toLowerCase();
  if (['json', 'md', 'markdown', 'txt', 'text'].includes(ext) || /^text\/|json/.test(f.type || '')) {
    if (f.size > IMP_MAX_CH) { impJ = { src: 'json', err: `File quá lớn (${(f.size / 1e6).toFixed(1)} MB).` }; impRender(); return; }
    ta.value = await f.text();
  } else if (window.WSImport && typeof window.WSImport.extract === 'function') {
    d.querySelector('#pasteOut').innerHTML = '<p class="hint">Đang đọc file…</p>';
    try { const r = await window.WSImport.extract(f); ta.value = typeof r === 'string' ? r : JSON.stringify(r, null, 1); }
    catch (e) { impJ = { src: 'json', err: `Không đọc được file: ${e && e.message ? e.message : 'lỗi không rõ'}.` }; impRender(); return; }
  } else { impJ = { src: 'json', err: `Chưa đọc trực tiếp được file .${ext} trong app. Gửi file cho Claude trong chat để ra JSON (đủ trường như phiếu mẫu), rồi nạp JSON ở đây.` }; impRender(); return; }
  impJ = null; impAnalyze();
  // + Task: file có đúng 1 Task (JSON/MD, không lỗi) thì chèn luôn
  if (impMode === 'task' && impJ && !impJ.err && impJ.src !== 'text' && impJ.tasks.length === 1 && impOk(impJ).length === 1) impCommit();
}
// ---- Hộp "Dán nhiều dòng vào Task đang soạn" (riêng, không phải nhập file) ----
let itemsTarget = null;
function openPaste(mode, target) {
  itemsTarget = target || null; const d = document.getElementById('pasteDlg');
  d.querySelector('#itemsTa').value = ''; d.querySelector('#itemsOut').innerHTML = '<p class="hint">Mỗi dòng một câu (bảng: mỗi dòng một hàng, ô cách nhau bằng Tab hoặc |). Số thứ tự ở đầu dòng sẽ được bỏ.</p>';
  d.querySelector('#itemsOk').disabled = true; d.querySelector('#itemsOk').textContent = 'Thêm';
  d.showModal(); d.querySelector('#itemsTa').focus();
}
{ const d = document.getElementById('pasteDlg'), ta = d.querySelector('#itemsTa');
  ta.addEventListener('input', () => { const n = ta.value.split('\n').filter(x => x.trim()).length, t = ws.tasks.find(x => x.id === itemsTarget);
    d.querySelector('#itemsOut').innerHTML = `<p class="hint">${n} dòng → ${n} ${t && ck(t) === 'table' ? 'hàng' : 'câu'} mới.</p>`; d.querySelector('#itemsOk').disabled = !n; d.querySelector('#itemsOk').textContent = `Thêm ${n} dòng`; });
  d.querySelector('#itemsCancel').onclick = () => d.close();
  d.querySelector('#itemsOk').onclick = () => { const raw = ta.value; d.close(); pasteItems(raw, itemsTarget); }; }
function pasteItems(raw, id) {
  commit(w => {
    const t = w.tasks.find(x => x.id === id), c = t.content, lines = raw.split('\n').map(x => x.replace(/\s+$/, '')).filter(x => x.trim());
    if (c.form === 'table') { lines.forEach(x => { const cs = (x.includes('\t') ? x.split('\t') : x.split('|')).map(y => y.trim()); c.rows.push({ head: brIn(cs[0] || ''), cells: c.cols.map((_, j) => parseCell(cs[j + 1] || '')) }); }); return; }
    const k = ck(t);
    lines.forEach(x0 => {
      const x = blankItem(t), s = normGap(inlineOpts(stripNum(x0.trim())));
      if (x.pair) { const m = /^(.+?)\s+(?:[-–—→]|\s{2,}|\t)\s*(.+)$/.exec(s); x.pair.l.text = m ? m[1] : s; x.pair.r = { text: m ? m[2] : '' }; }
      else if (x.who != null) { const m = /^([^:]{1,20}):\s*(.*)$/.exec(s); if (m) { x.who = m[1].trim(); x.text = m[2]; } else x.text = s; }
      else if (x.lines) x.lines = [s];
      else { const so = splitOptsLine(s); if (so && so[0] && x.opts) { x.text = so[0]; x.opts = so[1]; } else x.text = s; }
      if (x.img && k === 'items' && !x.text) x.img = s;
      c.items = c.items || []; c.items.push(x); ensureIds(t);
    });
    normAnswer(t);
  }, 'Đã thêm các dòng đã dán');
}
/* ================= Nhập file, lớp B (P0): bù trường thiếu, đọc JSON, kiểm tra trước khi đưa vào phiếu =================
   Mọi nguồn (JSON, MD, chữ thô) đều qua đây. Không bao giờ ghi đè Task có sẵn; lỗi không đổi phiếu đang mở. */
const IMP_MAX = 40, IMP_MAX_CH = 8e6;
const isObj = o => !!o && typeof o === 'object' && !Array.isArray(o);
const sv = v => v == null ? '' : typeof v === 'string' ? v : String(v);
const L2KIND = { A1: 'sentence', A2: 'word', A3: 'word', A4: 'choice', A5: 'tick', A6: 'tf', A7: 'match', A8: 'trace' };
// Tên Task trên cột trái: tên dạng → tiêu đề → mô tả thành phần
const taskLabel = t => (t.typeName || '').trim() || (t.title || '').trim() || descOf(t);
// Bù trường cho một Task lấy từ JSON ngoài. notes: danh sách việc đã bù (để báo). Ném lỗi khi Task không dùng được.
function fillTask(t0, notes) {
  if (!isObj(t0)) throw new Error('không phải đối tượng Task');
  const t = clone(t0), add = m => { if (notes && !notes.includes(m)) notes.push(m); };
  t.id = sv(t.id).trim() || 't'; t.title = sv(t.title); t.instruction = sv(t.instruction);
  t.audio = t.audio == null || t.audio === '' ? null : sv(t.audio);
  if (typeof t.image === 'string') t.image = t.image ? { label: t.image, size: 'medium' } : null;
  if (t.image != null && !isObj(t.image)) { t.image = null; add('bỏ ảnh chung không hợp lệ'); }
  if (t.image) { t.image.label = sv(t.image.label) || 'ảnh'; if (!['small', 'medium', 'large'].includes(t.image.size)) t.image.size = 'medium';
    if (t.image.marks != null) { if (Array.isArray(t.image.marks)) t.image.marks = t.image.marks.filter(m => isObj(m) && isFinite(parseFloat(m.x)) && isFinite(parseFloat(m.y))).slice(0, 20).map(m => ({ x: Math.max(0, Math.min(100, Math.round(parseFloat(m.x) * 10) / 10)), y: Math.max(0, Math.min(100, Math.round(parseFloat(m.y) * 10) / 10)) })); else { delete t.image.marks; add('điểm trên ảnh không hợp lệ'); } }
    if (t.image.mk != null) { const k = t.image.mk, o = {}; if (isObj(k)) { if (k.shape === 'square') o.shape = 'square'; if (k.label === 'none') o.label = 'none'; } if (Object.keys(o).length) t.image.mk = o; else delete t.image.mk; } }
  if (Array.isArray(t.wordBank)) t.wordBank = { words: t.wordBank };
  if (t.wordBank != null && !(isObj(t.wordBank) && Array.isArray(t.wordBank.words))) { t.wordBank = null; add('bỏ khung từ không hợp lệ'); }
  if (t.wordBank) { const b = t.wordBank; b.words = b.words.map(sv).filter(x => x.trim()); if (b.placement != null && !['top', 'right', 'bottom'].includes(b.placement)) b.placement = 'top'; if (b.kind != null && b.kind !== 'image') { delete b.kind; add('khung từ: loại lạ → chữ'); } if (b.kind === 'image') { if (b.ar != null && !/^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(String(b.ar))) delete b.ar; if (b.cols != null && !(Number.isInteger(b.cols) && b.cols >= 1 && b.cols <= 8)) delete b.cols; if (b.cap !== false) delete b.cap; } else ['ar', 'cols', 'cap'].forEach(k => delete b[k]); if (b.style != null && !['chips', 'list'].includes(b.style)) b.style = 'chips'; if (b.label != null && !['lower', 'upper', 'none'].includes(b.label)) b.label = 'lower'; }
  let c = t.content;
  if (!isObj(c)) { c = t.content = { form: 'list', items: [] }; add('thiếu nội dung'); }
  const arr = k => { if (!Array.isArray(c[k])) c[k] = []; return c[k]; };
  if (c.kind) {          // dữ liệu 0.1/0.2: chỉ bù mảng thiếu, migTask chuyển sang 0.3
    const K = { questions: ['questions'], items: ['items'], pairs: ['left', 'right'], trace: ['words'], dialogue: ['lines'], passage: ['questions'], table: ['cols', 'rows'], picture: [] }[c.kind];
    if (!K) throw new Error(`nội dung kiểu "${c.kind}" không đọc được`);
    K.forEach(arr); if (c.kind === 'passage') c.text = sv(c.text);
  }
  if (c.kind === 'table' || (!c.kind && c.form === 'table')) {
    c.cols = arr('cols').map(sv); c.rows = arr('rows').map(r => Array.isArray(r) ? { head: sv(r[0]), cells: r.slice(1) } : isObj(r) ? r : { head: sv(r), cells: [] });
    const n = Math.max(1, c.cols.length, ...c.rows.map(r => Array.isArray(r.cells) ? r.cells.length : 0));
    while (c.cols.length < n) c.cols.push('');
    c.rows.forEach(r => { r.cells = Array.isArray(r.cells) ? r.cells : []; while (r.cells.length < n) r.cells.push(''); r.cells = r.cells.map(v => v == null ? '' : isObj(v) ? v : sv(v)); r.head = r.head == null ? '' : isObj(r.head) ? r.head : sv(r.head); });
    c.corner = sv(c.corner);
  } else if (!c.kind) {
    if (c.form !== 'list') { if (c.form != null) add(`nội dung "${sv(c.form)}" → danh sách câu`); c.form = 'list'; }
    if (!Array.isArray(c.items)) { if (c.items != null) add('danh sách câu không hợp lệ'); c.items = []; }
    c.items = c.items.map(x => typeof x === 'string' ? { text: x } : isObj(x) ? x : { text: sv(x) });
    c.items.forEach(x => {
      if (x.text != null && typeof x.text !== 'string') x.text = sv(x.text);
      if (x.who != null) x.who = sv(x.who);
      ['opts', 'imgs', 'lines'].forEach(k => { if (x[k] != null) { if (Array.isArray(x[k])) x[k] = x[k].map(sv); else delete x[k]; } });
      if (x.img != null && typeof x.img !== 'string') x.img = sv(x.img);
      if (x.pair != null && !isObj(x.pair)) delete x.pair;
    });
    if (c.lead != null && !(isObj(c.lead) && ['passage', 'text', 'picture'].includes(c.lead.kind))) { delete c.lead; add('bỏ phần dẫn không hợp lệ'); }
    if (c.lead && c.lead.keys != null) { if (Array.isArray(c.lead.keys)) { c.lead.keys = c.lead.keys.map(sv).filter(x => x.trim()); if (!c.lead.keys.length) delete c.lead.keys; } else { delete c.lead.keys; add('đáp án chỗ trống không hợp lệ'); } }
    if (c.lead && c.lead.kind !== 'picture') c.lead.text = sv(c.lead.text);
  }
  if (!isObj(t.answer)) { t.answer = { kind: 'none' }; add('thiếu đáp án'); }
  const a = t.answer;
  if (a.layout != null && !AL[a.layout]) a.layout = null;
  if (!KIND_A[a.kind]) a.kind = L2KIND[a.layout] || 'none';
  if (!['item', 'inline', 'block'].includes(a.attach)) a.attach = 'item';
  if (!isObj(a.params)) a.params = {};
  if (a.layout === undefined) a.layout = null;
  if (!isObj(t.layout)) t.layout = {};
  if (!isObj(t.spacing) || !(t.spacing.preset == null || PRESETS[t.spacing.preset] || t.spacing.preset === 'free')) t.spacing = { preset: null, overrides: {} };
  if (!isObj(t.spacing.overrides)) t.spacing.overrides = {};
  Object.keys(t.spacing.overrides).forEach(k => { if (!(k in MINS) || typeof t.spacing.overrides[k] !== 'number') delete t.spacing.overrides[k]; });
  ['uploads', 'upMeta', 'imgAr', 'qr'].forEach(k => { if (t[k] != null && !isObj(t[k])) delete t[k]; });
  delete t.number; delete t.part;
  if (t.extras != null) {
    if (!Array.isArray(t.extras)) { delete t.extras; add('bỏ khối tự do không hợp lệ'); }
    else {
      const used = new Set(); t.extras = t.extras.filter(x => { if (!isObj(x)) { add('bỏ khối tự do không hợp lệ'); return false; } if (!['text', 'image'].includes(x.kind)) { add(`khối tự do loại "${sv(x.kind)}" chưa hỗ trợ, đã bỏ`); return false; } return true; }).map(x => {
        const img = x.kind === 'image', o = { id: sv(x.id).trim(), kind: x.kind, pos: x.pos === 'top' ? 'top' : 'bottom' };
        if (img) { o.label = sv(x.label) || 'ảnh'; if (typeof x.w === 'number' && x.w >= 20 && x.w <= 100) o.w = x.w; else if (x.w != null) add('độ rộng ảnh khối tự do không hợp lệ'); if (Number.isInteger(x.n) && x.n >= 2 && x.n <= 4) o.n = x.n; else if (x.n != null && x.n !== 1) add('số ảnh khối tự do không hợp lệ'); } else o.text = sv(x.text);
        if (!o.id || used.has(o.id)) o.id = newId(used, 'x'); else used.add(o.id);
        if (!img && GT_SIZE[x.size]) o.size = x.size; else if (!img && x.size != null) add('cỡ chữ khối tự do không hợp lệ');
        if (['center', 'right'].includes(x.align)) o.align = x.align;
        if (!img && x.cols === 2) o.cols = 2;
        if (!img && ['line', 'fill', 'both'].includes(x.frame)) o.frame = x.frame;
        return o;
      });
      if (!t.extras.length) delete t.extras;
    }
  }
  migTask(t); ensureIds(t); ensureRowIds(t);
  const a0 = JSON.stringify(t.answer); normAnswer(t); if (JSON.stringify(t.answer) !== a0) add('đáp án chỉnh cho hợp nội dung');
  tidy(t);
  if (!sv(t.typeId).trim()) { const m = recipeMatch(t); t.typeId = m.exact ? m.r.id : 'custom'; }
  t.typeName = sv(t.typeName);
  return t;
}
// Bù trường cấp phiếu (schema, id, tên, tuổi, trang, khoảng cách, xếp trang) + từng Task; id Task không trùng.
function fillSheet(o0, notes) {
  if (!isObj(o0)) throw new Error('không phải phiếu');
  if (!Array.isArray(o0.tasks)) throw new Error('thiếu danh sách tasks');
  if (o0.tasks.length > IMP_MAX) throw new Error(`phiếu có ${o0.tasks.length} Task, nhiều hơn giới hạn ${IMP_MAX}`);
  const o = clone(o0), add = m => { if (notes && !notes.includes(m)) notes.push(m); };
  o.id = sv(o.id).trim() || ('ws-' + Date.now().toString(36)); o.title = sv(o.title).trim() || 'Phiếu mới';
  if (!AGE[o.age]) { add('độ tuổi'); o.age = '7-9'; }
  if (!isObj(o.page)) { add('khổ trang'); o.page = { size: 'A4', marginMm: { top: 14, right: 14, bottom: 14, left: 14 } }; }
  if (!isObj(o.spacing) || !(PRESETS[o.spacing.preset] || o.spacing.preset === 'free')) { add('khoảng cách'); o.spacing = { preset: 'compact', overrides: {} }; }   // v85: phiếu không ghi khoảng cách → Gọn
  if (!isObj(o.spacing.overrides)) o.spacing.overrides = {};
  if (!['cont', 'page'].includes(o.flow)) { add('xếp trang'); o.flow = 'cont'; }
  if (o.fill !== true) delete o.fill;
  if (o.font != null && (!FONTS[o.font] || o.font === 'andika')) { if (o.font !== 'andika') add('font không có trong danh sách'); delete o.font; }
  if (o.size != null && (!SIZES[o.size] || o.size === 'm')) { if (o.size !== 'm') add('cỡ chữ không hợp lệ'); delete o.size; }
  const used = new Set();
  o.tasks = o.tasks.map((t, i) => { let x; try { x = fillTask(t, notes); } catch (e) { throw new Error(`Task ${i + 1}: ${e.message}`); } if (used.has(x.id)) x.id = newId(used, 't'); else used.add(x.id); return x; });
  o.schema = SCHEMA;
  return o;
}
// Chữ trông như JSON (bắt đầu bằng { hoặc [): không bao giờ xử lý như chữ thô
const looksJson = s => /^\s*[\[{]/.test(String(s || ''));
// Đọc JSON: phiếu {tasks:[…]}, mảng Task, hoặc một Task. Trả { src:'json', kind:'sheet'|'tasks', sheet, sheetNotes, tasks:[{t, notes, err}] } hoặc { err }.
function readJson(raw) {
  const s = String(raw || '').trim();
  if (s.length > IMP_MAX_CH) return { src: 'json', err: `Dữ liệu quá lớn (${(s.length / 1e6).toFixed(1)} MB).` };
  let o; try { o = JSON.parse(s); } catch (e) { return { src: 'json', err: `JSON hỏng: ${e.message}.` }; }
  let kind, list, sheet = null;
  if (Array.isArray(o)) { kind = 'tasks'; list = o; }
  else if (isObj(o) && Array.isArray(o.tasks)) { kind = ['schema', 'title', 'age', 'page', 'spacing', 'flow'].some(k => k in o) ? 'sheet' : 'tasks'; list = o.tasks; sheet = o; }   // chỉ có tasks = danh sách Task, không phải cả phiếu
  else if (isObj(o) && (o.content != null || o.title != null)) { kind = 'tasks'; list = [o]; }
  else return { src: 'json', err: isObj(o) ? 'JSON thiếu danh sách "tasks".' : 'JSON không phải phiếu hay Task.' };
  if (list.length > IMP_MAX) return { src: 'json', err: `Có ${list.length} Task, nhiều hơn giới hạn ${IMP_MAX}. Hãy tách thành nhiều file.` };
  if (!list.length && kind !== 'sheet') return { src: 'json', err: 'JSON không có Task nào.' };
  const sheetNotes = [];
  if (sheet) { const probe = Object.assign({}, sheet, { tasks: [] }); try { fillSheet(probe, sheetNotes); } catch (_) {} }
  const tasks = list.map((t0, i) => {
    const notes = []; let t = null, err = '';
    try { t = fillTask(t0, notes); renderTask(t, null); } catch (e) { t = null; err = `Task ${i + 1}: ${e.message}`; }
    return { t, notes, err, conf: 'json' };
  });
  return { src: 'json', kind, sheet, sheetNotes, tasks };
}
// Số trang ước tính của một phiếu (dàn thử, không vẽ)
function estPages(w2) { const keep = ws; try { ws = w2; const r = paginate(); return { n: r.pages.length, over: r.diags.length }; } catch (e) { return null; } finally { ws = keep; } }
// Thêm các Task vào phiếu đang mở (bản sao, id mới, giữ thứ tự). Một lần nhập = một bước hoàn tác. Trả về id Task đầu.
function addTasks(list, note) {
  let first = null, n0 = ws.tasks.length;
  const before = { ws: clone(ws), h: hist.length };
  try {
    commit(w => { const used = new Set(w.tasks.map(x => x.id)); list.forEach(t0 => { const t = clone(t0); t.id = newId(used, 't'); delete t.number; delete t.part; if (!first) { first = t.id; if (t.layout && t.layout.break === 'join') t.layout.break = null; }  w.tasks.push(t); }); });
  } catch (e) { ws = before.ws; hist.length = before.h; fut = []; try { render(); } catch (_) {} toast(`Không nhập được: ${e.message}. Phiếu đang mở giữ nguyên.`); return null; }
  toast(`Đã thêm ${list.length} Task vào cuối phiếu (Task ${n0 + 1}${list.length > 1 ? '–' + (n0 + list.length) : ''})${note || ''} · Ctrl+Z để hoàn tác`);
  sel = { type: 'task', id: first }; multi = []; openTask = first; sectReset(first); refreshSel();
  const tk = stage.querySelector(`.task[data-task="${first}"]`); if (tk) tk.scrollIntoView({ block: 'center' });
  return first;
}
/* ================= Nhập file (P2): MD trung gian theo quy ước (claude/QUY_UOC_MD.md) =================
   Mỗi Task bắt đầu bằng "## Task: <tiêu đề>" nên tách chắc chắn, không đoán. Trong Task: dòng trường "Tên: giá trị"
   (Hướng dẫn, Track, Mẫu, Trả lời, Dòng viết, Khung từ, Ảnh, Lời dẫn); khối "Bài đọc:", "Hội thoại:", "Ô chữ:";
   còn lại là câu đánh số / dòng bảng "|" như khi dán chữ. Đáp án nằm riêng ở "## Đáp án" cuối file. */
const MD_RE = /^\s*##\s*task\b/im;
const MD_FIELD = /^\s*(hướng dẫn|instruction|track|audio|mẫu|trả lời|answer type|dòng viết|khung từ ảnh|khung từ|đáp án chỗ trống|gap answers|words?|word bank|ảnh chung|ảnh|image|lời dẫn|intro|ghi chú|lưu ý|note|dạng|bố cục|vị trí khung từ|dòng kẻ|thứ tự|khối chữ trên|khối chữ dưới|khối chữ|khối ảnh trên|khối ảnh dưới|khối ảnh|điểm trên ảnh|chữ câu hỏi|số câu|căn lề chữ|xáo vế phải|viền hai vế|tiêu đề cột|chỗ nối)\s*:\s*(.*)$/i;
const MD_FKEY = { 'hướng dẫn': 'instruction', instruction: 'instruction', track: 'audio', audio: 'audio', 'mẫu': 'recipe', 'trả lời': 'kind', 'answer type': 'kind', 'dòng viết': 'lines', 'khung từ': 'bank', 'đáp án chỗ trống': 'gapkeys', 'gap answers': 'gapkeys', word: 'bank', words: 'bank', 'word bank': 'bank', 'ảnh chung': 'image', 'ảnh': 'image', image: 'image', 'lời dẫn': 'intro', intro: 'intro', 'ghi chú': 'note', 'lưu ý': 'note', note: 'note',
  'dạng': 'form', 'bố cục': 'tlay', 'khung từ ảnh': 'ibank', 'vị trí khung từ': 'bankpos', 'dòng kẻ': 'ruling', 'thứ tự': 'order', 'điểm trên ảnh': 'marks',
  'khối chữ': 'gtT', 'khối chữ dưới': 'gtT', 'khối chữ trên': 'gtTtop', 'khối ảnh': 'gtI', 'khối ảnh dưới': 'gtI', 'khối ảnh trên': 'gtItop', 'chữ câu hỏi': 'qbold', 'số câu': 'nlab', 'căn lề chữ': 'ta', 'xáo vế phải': 'shuf', 'viền hai vế': 'mbd', 'tiêu đề cột': 'heads', 'chỗ nối': 'mid' };   // v93: MD mang chữ câu hỏi đậm, xáo vế phải bài nối
// v81: "Dạng:" = dạng câu hỏi (Q1–Q12), ghi chi tiết trong ngoặc; "Bố cục:" = bố cục Task (4 kiểu)
const MD_FORM = { 'điền từ': 'Q1', 'điền chỗ trống': 'Q1', 'viết từ': 'Q1', 'viết câu': 'Q2', 'trả lời câu hỏi': 'Q2', 'chọn a/b/c': 'Q3', 'khoanh a/b/c': 'Q3', 'chọn đáp án': 'Q3', 'chọn trong câu': 'Q4', 'gạch chân': 'Q4', 'khoanh trong câu': 'Q4', 'tìm lỗi sai': 'Q4', 'đúng/sai': 'Q5', 'đúng sai': 'Q5', 'nhìn ảnh viết': 'Q6', 'chọn ảnh': 'Q7', 'tick ảnh': 'Q7', 'nối': 'Q8', 'tô chữ': 'Q9', 'bảng': 'Q10', 'lưới': 'Q11', 'ô chữ': 'Q11', 'viết tự do': 'Q12', 'viết đoạn': 'Q12' };
const MD_TLAY = { 'xếp dọc': 'T1', 'ảnh trái': 'T2', 'ảnh phải': 'T3', 'ảnh trong bài đọc': 'T4', 'bao chữ': 'T4' };
const MD_EX = '\u2063', MD_GT = '\u2064';   // dấu ẩn đánh dấu câu ví dụ "0." và dòng chữ "> " khi qua bộ đoán
function mdForm(t, val, notes, imgMark) {
  const m = /^\s*([^()]+?)\s*(?:\(([^)]*)\))?\s*$/.exec(val || ''); if (!m) { notes.push(`không hiểu "Dạng: ${val}"`); return false; }
  const nm = m[1].toLowerCase().replace(/\s*\/\s*/g, '/').replace(/\s+/g, ' ').trim();
  let opt = (m[2] || '').trim();
  const qc = /^q\s*(\d{1,2})$/i.exec(nm);
  const q = qc ? (QN['Q' + +qc[1]] ? 'Q' + +qc[1] : null) : MD_FORM[nm];
  if (!q) { notes.push(`không hiểu "Dạng: ${val}"; giữ dạng ${QN[qOf(t)] || 'đoán'}`); return false; }
  const why = qReasons(t)[q]; if (why) { notes.push(`"Dạng: ${val}" không hợp với nội dung (${why}); giữ dạng ${QN[qOf(t)] || 'đoán'}`); return false; }
  // câu có ảnh riêng (nhìn ảnh viết / chọn ảnh): "điền từ", "viết câu", "chọn…" là cách trả lời của dạng đó, không bỏ ảnh
  if (ck(t) === 'items' && imgMark && ['Q1', 'Q2', 'Q3', 'Q4'].includes(q)) { const k = q === 'Q1' ? 'word' : q === 'Q2' ? 'sentence' : t.content.variant === 'multi' ? 'tick' : 'choice'; if (kindsOk(t).includes(k) && t.answer.kind !== k) setKind(t, k); if (k === 'choice' && hasMarkup(t)) t.answer.attach = 'inline'; normAnswer(t); return true; }
  if (qOf(t) !== q || (q === 'Q4' && t.answer.attach !== 'inline')) setQ(t, q);
  const rowRe = /(?:^|[,;]\s*)(?:cùng hàng|cùng dòng)\s*(?=$|[,;])/i, tfRow = q === 'Q5' && rowRe.test(opt);   // v100: "Dạng: đúng/sai (cùng hàng)" = T F cuối hàng, bên phải câu
  opt = tfRow ? opt.replace(rowRe, '').replace(/^[,;\s]+|[,;\s]+$/g, '') : opt;
  const o = opt.toLowerCase(), p = () => t.answer.params;
  if (q === 'Q5' && /tick/.test(o)) { if (t.answer.kind !== 'tick') setKind(t, 'tick'); }
  else if (q === 'Q5' && opt) { const L = opt.split('/').map(x => x.trim()).filter(Boolean); if (L.length >= 2 && L.length <= 3) { if (t.answer.kind !== 'tf') setKind(t, 'tf'); if (L.join('|') !== 'T|F') p().labs = L; } else notes.push(`nhãn Đúng/Sai "${opt}" cần 2–3 nhãn cách nhau bằng /`); }
  if (q === 'Q5' && tfRow) { if (t.answer.kind === 'tf') p().row = true; else notes.push('“cùng hàng” chỉ dùng cho khoanh Đúng/Sai (không dùng với ô tick)'); }
  if (q === 'Q4' && /nhãn|a\s*-\s*d|lỗi/.test(o + ' ' + nm)) p().ulab = true;
  if (q === 'Q12' && /khung|vẽ/.test(o)) p().frame = 'box';
  if (['Q1', 'Q6'].includes(q) && /ô chữ cái/.test(o)) { if (t.answer.kind !== 'word') setKind(t, 'word'); t.answer.layout = 'A3'; t.answer.attach = 'item'; }
  if (['Q2', 'Q6'].includes(q) && /dòng kẻ|viết câu/.test(o) && t.answer.kind !== 'sentence') setKind(t, 'sentence');
  if (q === 'Q3' && /ô tick|☐/.test(o)) p().lab = 'box'; else if (q === 'Q3' && /khoanh|vòng|ⓐ/.test(o)) p().lab = 'circle';
  if (q === 'Q3') { const mv = /căn\s*(giữa|dưới|trên)/i.exec(o); if (mv) { const v = { 'giữa': 'center', 'dưới': 'bottom', 'trên': 'top' }[mv[1].toLowerCase()]; if (v !== 'top') p().qv = v; } }   // v106
  if (/bốn ô li|4 ô li/.test(o) && ['A1', 'A8'].includes(t.answer.layout)) p().ruling = '4';
  normAnswer(t); return true;
}
const MD_SECT = /^\s*(bài đọc|passage|hội thoại|dialogue|ô chữ giải đố|crossword|ô chữ|word ?search)\s*:\s*$/i;
// Loại đáp án viết bằng chữ → [loại, cách gắn ưu tiên]
const MD_KIND = { 'viết từ': ['word', 'item'], 'điền chỗ trống': ['word', 'inline'], 'điền từ': ['word', 'inline'], 'viết câu': ['sentence'], 'khoanh': ['choice'], 'khoanh a/b/c': ['choice', 'item'], 'chọn a/b/c': ['choice', 'item'], 'chọn trong câu': ['choice', 'inline'], 'gạch chân': ['choice', 'inline'], 'tick': ['tick'], 'đúng/sai': ['tf'], 'đúng sai': ['tf'], 'nối': ['match'], 'tô chữ': ['trace'], 'không': ['none'], 'không có': ['none'] };
function readMd(raw) {
  const L = String(raw || '').replace(/\r/g, '').split('\n'), meta = {}, blocks = [], keys = {}, notes = [];
  let cur = null, inAns = false, ansFor = null, grp = 0;
  L.forEach(line => {
    const t = line.trim(), h = /^##(?!#)\s*(.*)$/.exec(t);
    // "### Phần: …" trong một Task: phần tiếp của Task đó (nối vào Task trên), có hướng dẫn / kiểu đáp án riêng
    const pm = cur && !inAns ? /^###\s*(?:phần|part)\b\s*\d*\s*[:.)\-–]?\s*(.*)$/i.exec(t) : null;
    if (pm) { cur = { title: pm[1].trim(), lines: [], part: true, grp }; blocks.push(cur); return; }
    if (h) {
      const x = h[1].trim();
      if (/^task\b/i.test(x)) { cur = { title: x.replace(/^task\s*\d*\s*[:.)\-–]?\s*/i, '').trim(), lines: [], grp: ++grp }; blocks.push(cur); inAns = false; return; }
      if (/^(đáp án|answers?|answer key)\b/i.test(x)) { cur = null; inAns = true; ansFor = null; return; }
    }
    if (inAns) {
      let m;
      if ((m = /^###\s*task\s*(\d+)/i.exec(t))) { ansFor = +m[1]; keys[ansFor] = keys[ansFor] || []; return; }
      if ((m = /^task\s*(\d+)\s*[:.]\s*(.+)$/i.exec(t))) { const a = m[2].split(/\s*;\s*/), k = keys[+m[1]] = []; a.forEach(x => { if (/^\(?0[.)]\s*/.test(x)) k.ex = x.replace(/^\(?0[.)]\s*/, '').trim(); else k.push(stripNum(x).trim()); }); ansFor = null; return; }
      if (ansFor && (m = /^(chỗ trống|gaps?)\s*:\s*(.*)$/i.exec(t))) { keys[ansFor].gap = m[2].split(/\s*[,;|]\s*/).map(x => x.trim()).filter(Boolean); return; }
      if (ansFor && t) { const n = /^\s*\(?(\d{1,2})[.)]\s*/.exec(t); const v = t.replace(/^\s*\(?\d{1,2}[.)]\s*/, '').trim(); if (n && +n[1] === 0) keys[ansFor].ex = v; else if (n) keys[ansFor][+n[1] - 1] = v; else keys[ansFor].push(v); }
      return;
    }
    if (!cur) {     // trước Task đầu: tên phiếu và vài cài đặt cấp phiếu
      let m;
      if ((m = /^#(?!#)\s*(.+)$/.exec(t))) meta.title = m[1].trim();
      else if ((m = /^(tuổi|độ tuổi|age)\s*:\s*(.+)$/i.exec(t))) { const a = m[2].replace(/[–—]/g, '-').replace(/\s/g, ''); if (AGE[a]) meta.age = a; else notes.push(`độ tuổi "${m[2]}" không hiểu`); }
      else if ((m = /^(xếp trang|flow)\s*:\s*(.+)$/i.exec(t))) meta.flow = /tách|page/i.test(m[2]) ? 'page' : 'cont';
      else if ((m = /^(khoảng cách|spacing)\s*:\s*(.+)$/i.exec(t))) { const k = { 'gọn': 'compact', 'vừa': 'normal', 'thoáng': 'airy' }[m[2].trim().toLowerCase()]; if (k) meta.spacing = { preset: k, overrides: {} }; }
      return;
    }
    cur.lines.push(line);
  });
  // v80: dòng chữ không đánh số, đứng sau một dòng trống, ngay trước câu "1." (số câu bắt đầu lại) = hướng dẫn của một PHẦN mới (như "### Phần:")
  for (let bi = 0; bi < blocks.length; bi++) {
    const b = blocks[bi]; if (b.lines.some(l => MD_SECT.test(l.trim()))) continue;
    const nz = b.lines.map((l, i) => [l, i]).filter(x => x[0].trim());
    for (let k = 1; k < nz.length - 1; k++) {
      const [l, i] = nz[k], t = l.trim();
      if (/^\s/.test(l) || /^>/.test(t) || NUM_RE.test(t) || MD_FIELD.test(t) || OPT_LINE.test(t) || BOX.test(t) || /\|/.test(t) || t.includes('___')) continue;
      if (b.lines[i - 1] === undefined || b.lines[i - 1].trim()) continue;                // phải có dòng trống phía trên
      if (!/^\(?1[.)]\s/.test(nz[k + 1][0].trim()) || !nz.slice(0, k).some(x => NUM_RE.test(x[0].trim()))) continue;
      const kind = b.lines.find(x => /^\s*(trả lời|answer type|dòng viết)\s*:/i.test(x));
      const nb = { title: '', part: true, grp: b.grp, auto: true, notes: [`dòng “${t.length > 50 ? t.slice(0, 50) + '…' : t}” không có số, đứng trước câu 1 mới: tách thành phần riêng của Task và dùng làm hướng dẫn (nếu không phải, sửa lại trong MD)`], lines: ['Hướng dẫn: ' + t, ...(kind ? [kind] : []), ...b.lines.slice(nz[k + 1][1])] };
      b.lines = b.lines.slice(0, i); blocks.splice(bi + 1, 0, nb); break;
    }
  }
  if (!blocks.length) return { src: 'md', err: 'MD không có dòng "## Task: …" nào.' };
  if (blocks.length > IMP_MAX) return { src: 'md', err: `Có ${blocks.length} Task, nhiều hơn giới hạn ${IMP_MAX}. Hãy tách thành nhiều file.` };
  const size = {}; blocks.forEach(b => size[b.grp] = (size[b.grp] || 0) + 1);
  const seen = {};
  const tasks = blocks.map((b, i) => {
    const k = seen[b.grp] = (seen[b.grp] || 0) + 1, no = b.part ? `${b.grp}${String.fromCharCode(96 + k)}` : size[b.grp] > 1 ? `${b.grp}a` : String(b.grp);
    try {
      const r = mdTask(b, size[b.grp] === 1 ? keys[b.grp] : undefined); if (b.part) r.t.layout.break = 'join';
      renderTask(r.t, null); return { t: r.t, notes: r.notes, conf: r.conf, err: '', joined: !!b.part, no, grp: b.grp };
    } catch (e) { return { t: null, notes: [], err: `Task ${no}: ${e.message}`, joined: !!b.part, no, grp: b.grp }; }
  });
  // Task nhiều phần: đáp án "### Task n" chạy liền qua các phần, theo thứ tự câu
  Object.keys(keys).forEach(n => {
    const g = tasks.filter(r => r.grp === +n);
    if (!g.length) { notes.push(`đáp án của Task ${n} không có Task tương ứng`); return; }
    if (g.length === 1) return;
    const all = g.filter(r => r.t).flatMap(r => its(r.t).filter(x => !x.ex && !x.gt)); all.forEach((x, i) => { if (keys[n][i] != null && keys[n][i] !== '') x.key = keys[n][i]; });
    if (keys[n].length > all.length) g[0].notes.push(`đáp án có ${keys[n].length} dòng, Task ${n} (cả các phần) có ${all.length} câu`);
  });
  const sheetNotes = [];
  if (!meta.age) sheetNotes.push('độ tuổi'); if (!meta.flow) sheetNotes.push('xếp trang'); if (!meta.spacing) sheetNotes.push('khoảng cách');
  return { src: 'md', kind: Object.keys(meta).length ? 'sheet' : 'tasks', sheet: null, meta, sheetNotes, mdNotes: notes, tasks };
}
// v67: dòng trong MD mà app bỏ qua hoặc chuyển chỗ (giàn giáo của bản gốc: app tự vẽ chỗ trả lời)
const MD_SKIP = /^\s*(nội dung|content|câu hỏi|questions?|bài tập|exercise)\s*:\s*$/i;            // tiêu đề phần, không phải câu
const MD_LABEL = /^\s*[\p{L}][\p{L}\d ()/'’-]{1,30}:\s*$/u;                                       // dòng chỉ có nhãn "Xxx:"
const MD_SCAF = /^\s*(my answer|your answer|answer|đáp án( của em)?)\s*:?\s*[A-Da-d](\s*[\/,]\s*[A-Da-d])+\s*\.?\s*$/i;   // "My answer: A / B / C"
const MD_RULE = /^\s*[_.…\-–—\s]{6,}\s*$/;                                                         // dòng chỉ có gạch / chấm (dòng kẻ viết)
const BOX = /\[\s*\]|☐|□/;
const OPT_LINE = /^\(?[A-Da-d][.)]\s+(?!_{3,})\S/;   // v101: "a. ___ nghĩa" (nhãn chữ + chỗ trống) không phải lựa chọn
const optStr = os => os.map((o, i) => `${'ABCDEFGH'[i]}. ${o}`).join(' ');
// Dòng có ô tick: "☐ a cake ☐ a football" hoặc "1. [ ] a cake" → [thân câu, [lựa chọn]]
function boxSplit(line) {
  const s = stripNum(line.trim()); if (!BOX.test(s)) return null;
  const parts = s.split(/\s*(?:\[\s*\]|☐|□)\s*/), stem = parts.shift().trim(), opts = parts.map(x => x.trim()).filter(Boolean);
  return opts.length ? [stem, opts] : null;
}
function mdTask(b, keys) {
  const notes = (b.notes || []).slice(), F = {}, body = [], sec = { passage: [], dialogue: [], grid: [], cross: [] }, gts = []; let mode = null, scaf = 0, box = false, gx = null;
  const B = (s, o) => ({ s, box: o || null });          // một dòng thân Task; box = các lựa chọn ô tick của câu này
  const last = () => body[body.length - 1];
  b.lines.forEach(line => {
    const t = line.trim();
    if (gx) { if (!t) { gx.lines.push(''); return; } if (/^(\s{2,}|\t)/.test(line)) { gx.lines.push(t); return; } gx = null; }      // khối chữ: các dòng thụt lề bên dưới
    if (!t) { if (mode === 'passage') { if (sec.passage.length && sec.passage[sec.passage.length - 1] !== '') sec.passage.push(''); } else mode = null; return; }
    const s = MD_SECT.exec(t); if (s) { mode = /bài đọc|passage/i.test(s[1]) ? 'passage' : /hội thoại|dialogue/i.test(s[1]) ? 'dialogue' : /giải đố|crossword/i.test(s[1]) ? 'cross' : 'grid'; return; }
    const f = MD_FIELD.exec(t);
    if (f) { const k = MD_FKEY[f[1].toLowerCase()]; mode = null;
      if (/^gt/.test(k)) { const g = { kind: /^gtI/.test(k) ? 'image' : 'text', pos: /top$/.test(k) ? 'top' : 'bottom', lines: f[2].trim() ? [f[2].trim()] : [] }; gts.push(g); if (g.kind === 'text') gx = g; return; }
      F[k] = k === 'note' && F.note ? F.note + ' ' + f[2].trim() : f[2].trim(); return; }
    if (/^\(?0[.)]\s+\S/.test(t)) { mode = null; body.push(B('1. ' + t.replace(/^\(?0[.)]\s*/, '') + ' ' + MD_EX)); return; }     // v81: câu ví dụ
    if (/^>\s*\S/.test(t)) { mode = null; body.push(B('1. ' + MD_GT + t.replace(/^>\s*/, ''))); return; }                       // v81: dòng chữ giữa các câu
    if (MD_SKIP.test(t)) return;
    const parLab = mode === 'passage' && /^[A-H][.)]\s/.test(t) && t.replace(/^[A-H][.)]\s*/, '').split(/\s+/).length >= 8 && !/\s[B-H][.)]\s/.test(t);   // v81: đoạn có nhãn A. B. (bài nối tiêu đề với đoạn)
    if (parLab) { if (sec.passage.length && sec.passage[sec.passage.length - 1] !== '') sec.passage.push(''); sec.passage.push(t); return; }
    if (mode === 'passage' && (NUM_RE.test(t) || /\s\|\s|\t/.test(t) || OPT_LINE.test(t) || BOX.test(t))) mode = null;      // câu đánh số / lựa chọn / bảng: hết bài đọc
    if (mode === 'dialogue' && !/^[^:]{1,40}:\s*\S/.test(t)) mode = null;
    if (mode) { sec[mode].push(t); return; }
    if (MD_SCAF.test(t)) { scaf++; return; }
    if (MD_RULE.test(t)) return;
    if (MD_LABEL.test(t)) { notes.push(`bỏ dòng “${t}” (chỉ có nhãn, không phải câu)`); return; }
    // lựa chọn A. B. C. mỗi cái một dòng (thụt lề hoặc không) ngay dưới câu: gộp vào câu đó
    if (OPT_LINE.test(t) && body.length && !last().box && NUM_RE.test(last().s)) { last().s += ' ' + t; return; }
    // ô tick ☐ / □ / [ ]: các dòng liền nhau là lựa chọn của một câu
    const bx = /\s\|\s|\t|\|/.test(t) ? null : boxSplit(line);      // dòng bảng: "[ ]" là ô tick của bảng, không phải lựa chọn
    if (bx) {
      box = true; const p = body.length ? last() : null;
      if (bx[0] || bx[1].length >= 2) { body.push(B(`1. ${bx[0]} ${optStr(bx[1])}`, bx[1].slice())); return; }
      if (p && p.box) { p.box = p.box.concat(bx[1]); p.s = p.s.replace(/(^|\s)\(?A[.)]\s.*$/, '') + ' ' + optStr(p.box); return; }
      if (p && !NUM_RE.test(p.s) && !OPT_LINE.test(p.s.trim())) { p.box = bx[1].slice(); p.s = `1. ${p.s.trim()} ${optStr(p.box)}`; return; }   // dòng hỏi ngay trên là thân câu
      body.push(B(`1. ${optStr(bx[1])}`, bx[1].slice())); return;
    }
    if (/^(\s{2,}|\t)\S/.test(line) && body.length && NUM_RE.test(last().s)) { last().s += ' ' + t; return; }   // dòng thụt lề: dòng tiếp của câu trên
    body.push(B(line));
  });
  if (scaf) notes.push(`bỏ ${scaf} dòng kiểu “My answer: A / B / C” (app tự vẽ chỗ trả lời)`);
  // dòng chữ thường nằm SAU câu cuối (không đánh số, không có chỗ trả lời): lời nhắc của bài → đưa vào hướng dẫn
  const isItem = x => NUM_RE.test(x.s) || x.box || OPT_LINE.test(x.s.trim());
  const lastI = body.reduce((k, x, i) => isItem(x) ? i : k, -1), tail = [];
  if (lastI >= 0) for (let i = body.length - 1; i > lastI; i--) { const x = body[i].s.trim(); if (!x.includes('___') && !/\{[^}]*\|/.test(x) && !/\s\|\s|\t|\[ảnh:/i.test(x) && !/^([A-Z][\p{L}.' -]{0,18}):\s+/u.test(x)) tail.unshift(body.splice(i, 1)[0].s.trim()); else break; }
  if (F.note) tail.push(F.note);
  if (tail.length) { F.instruction = [F.instruction || '', ...tail].filter(Boolean).join(' '); const s = tail.join(' '); notes.push(`đưa lời nhắc vào hướng dẫn: “${s.slice(0, 60)}${s.length > 60 ? '…' : ''}”`); }
  // v84: nhãn lựa chọn mặc định chữ thường kể cả khi file viết A. B. C. (đổi chữ hoa ở nút Nhãn của Task)
  let force = null;
  if (F.recipe) { const q = F.recipe.toLowerCase(), r = RECIPES.find(x => x.id === q || x.name.toLowerCase() === q); if (r) force = r.id; else notes.push(`không có mẫu "${F.recipe}", giữ cấu hình đoán`); }
  const img2 = F.image && F.image.includes(';') ? F.image.split(/\s*;\s*/).filter(Boolean) : null; if (img2) F.image = img2[0];
  if (F.image) body.unshift(B(`[ảnh: ${F.image}]`));
  while (sec.passage.length && sec.passage[sec.passage.length - 1] === '') sec.passage.pop();
  const passage = sec.passage.reduce((s, x) => x === '' ? s + '\n\n' : s + (s && !s.endsWith('\n') ? ' ' : '') + x, '');   // giữ đoạn văn (dòng trống = sang đoạn mới)
  const r = parseTask(body.map(x => x.s).join('\n'), force, { title: b.title, instruction: F.instruction || '', audio: F.audio || '', passage, match: (!!F.kind && /^nối/i.test(F.kind.trim())) || (!!F.form && /^nối/i.test(F.form.trim())), box });
  const t = r.t; let conf = r.conf, explicit = !!force;
  // v81: câu ví dụ / dòng chữ đã qua bộ đoán: gỡ dấu ẩn, gắn cờ
  const deep = (o, f) => { if (typeof o === 'string') return f(o); if (Array.isArray(o)) return o.map(v => deep(v, f)); if (o && typeof o === 'object') { Object.keys(o).forEach(k => { o[k] = deep(o[k], f); }); return o; } return o; };
  const hasMk = (o, ch) => JSON.stringify(o).includes(ch);
  if (t.content.items) t.content.items = t.content.items.map(x => {
    if (hasMk(x, MD_GT)) { const tx = [x.text, ...(x.lines || [])].filter(v => typeof v === 'string').join(' ').replace(new RegExp(MD_GT, 'g'), '').replace(new RegExp(MD_EX, 'g'), '').trim(); return { id: x.id, gt: true, text: tx }; }
    if (hasMk(x, MD_EX)) { deep(x, v => v.replace(new RegExp('\\s*' + MD_EX, 'g'), '')); x.ex = true; }
    return x; });
  its(t).forEach(x => { if (!(x.text || '').includes('\u2028')) return; if (x.img || x.imgs) { x.lines = x.text.split('\u2028').map(y => y.trim()); delete x.text; delete x.len; } else x.text = x.text.split('\u2028').map(y => y.trim()).filter(Boolean).join('\n'); });   // câu có ảnh: ô nhiều dòng (T5); câu không ảnh: giữ một câu, xuống dòng trong chữ (v79)
  const wk = F.kind && MD_KIND[F.kind.toLowerCase().replace(/[.!]+$/, '').trim()];
  if (!its(t).length && !passage && !sec.grid.length && !sec.cross.length && !sec.dialogue.length && wk && wk[0] === 'sentence') {   // v80: Task không có câu mà ghi "viết câu" = khung viết tự do (bài viết đoạn)
    t.content = { form: 'list', items: [{ id: 'q1', text: '' }] }; if (!F.image) delete t.image; t.layout.num = 'off'; setKind(t, 'sentence'); explicit = true;
    notes.push('Task không có câu: tạo một khung viết tự do (không số, không ảnh tự thêm). Thêm “Ảnh: …” nếu bài có ảnh');
  }
  if (sec.grid.length || sec.cross.length) {         // ô chữ: bảng chữ cái, mỗi dòng một hàng (có dấu cách thì tách theo dấu cách); crossword: # ô trống '.' ô chưa đáp án
    const cr = sec.cross.length > 0, rows = cr ? crossParse(sec.cross) : sec.grid.map(x => /\s/.test(x) ? x.split(/\s+/) : [...x]), n = Math.max(...rows.map(x => x.length));
    t.content = { form: 'table', corner: '', cols: Array(n).fill(''), rows: rows.map(x => ({ head: '', cells: x.concat(Array(n - x.length).fill('')) })) };
    t.layout.table = { head: false, rowHead: false, nm: 'off', lines: 'all', align: 'center', minH: 8 }; if (cr) t.layout.table.cross = true; delete t.image;
    ensureRowIds(t); setKind(t, 'none'); explicit = true;
    if (r.t && body.some(x => NUM_RE.test(x))) notes.push('bỏ các câu đánh số nằm cùng ô chữ (ô chữ là bảng)');
  } else if (sec.dialogue.length) {
    const other = its(t).length;
    t.content = { form: 'list', items: sec.dialogue.map(x => { const m = /^([^:]{1,40}):\s*(.*)$/.exec(x); return { who: m[1].trim(), text: normGap(m[2]) }; }) };
    if (F.intro) t.content.lead = { kind: 'text', text: F.intro };
    if (!F.image) delete t.image;      // thân Task không có câu nên bộ đoán đã thêm ảnh tô màu giả: bỏ
    ensureIds(t); setKind(t, its(t).some(x => (x.text || '').includes('___')) ? 'word' : 'none'); explicit = true;
    if (other) notes.push(`bỏ ${other} dòng ngoài khối hội thoại`);
  }
  if (F.bank) { const w = F.bank.split(/\s*[,;|]\s*|\s\/\s/).map(x => x.trim()).filter(Boolean), dl = ck(t) === 'dialogue'; t.wordBank = { words: w, placement: dl ? 'right' : 'top', style: dl ? 'list' : 'chips', label: 'lower' }; }
  if (F.gapkeys && t.content.lead && t.content.lead.kind === 'passage') { const g = F.gapkeys.split(/\s*[,;|]\s*/).map(x => x.trim()).filter(Boolean); if (g.length) t.content.lead.keys = g; }
  if (F.kind && !force) {
    let k = MD_KIND[F.kind.toLowerCase().replace(/[.!]+$/, '').trim()];
    if (k && k[0] === 'tick' && its(t).some(x => x.opts && x.opts.length >= 2 && !x.imgs)) k = ['choice', 'item'];   // tick vào lựa chọn bằng chữ = Lựa chọn (A4) kiểu ô tick
    if (!k) notes.push(`không hiểu "Trả lời: ${F.kind}"; giữ loại đáp án đoán`);
    else if (!kindsOk(t).includes(k[0])) notes.push(`"Trả lời: ${F.kind}" không hợp với nội dung; giữ loại đáp án đoán`);
    else { setKind(t, k[0]); if (k[1] && attachOpts(t).includes(k[1])) { t.answer.attach = k[1]; normAnswer(t); } explicit = true; }
  }
  if (F.form) { const q0 = qOf(t), n0 = its(t).filter(x => !x.gt).length; if (mdForm(t, F.form, notes, body.some(x => NUM_RE.test(x.s) && /\[ảnh:/i.test(x.s)))) { explicit = true; if (F.kind && q0 !== qOf(t)) notes.push(`có cả “Trả lời: ${F.kind}” và “Dạng: ${F.form}”: dùng “Dạng:”`); if (qOf(t) === 'Q12' && !n0 && !F.image && !img2) delete t.image; } }
  if (img2 && t.image) { t.image.two = true; t.image.label2 = img2[1]; if (img2.length > 2) notes.push('“Ảnh:” chỉ nhận 2 ảnh cạnh nhau; bỏ ảnh thứ 3 trở đi'); }
  if (F.ibank) { const w = F.ibank.split(/\s*[,;|]\s*/).map(x => x.trim()).filter(Boolean); t.wordBank = { words: w, placement: 'top', style: 'chips', label: 'lower', kind: 'image' }; }
  if (F.bankpos) { const v = { 'trên': 'top', 'dưới': 'bottom', 'phải': 'right', 'bên phải': 'right', top: 'top', bottom: 'bottom', right: 'right' }[F.bankpos.toLowerCase().trim()]; if (!t.wordBank) notes.push('“Vị trí khung từ” nhưng Task không có khung từ'); else if (!v) notes.push(`không hiểu "Vị trí khung từ: ${F.bankpos}" (trên / dưới / phải)`); else t.wordBank.placement = v; }
  if (F.ruling) { if (/bốn ô li|4 ô li/i.test(F.ruling)) { if (['A1', 'A8'].includes(t.answer.layout)) t.answer.params.ruling = '4'; else notes.push('“Dòng kẻ: bốn ô li” chỉ dùng cho dòng viết / tô chữ'); } else if (!/thường/i.test(F.ruling)) notes.push(`không hiểu "Dòng kẻ: ${F.ruling}"`); }
  if (gts.length) { t.extras = t.extras || []; const used = new Set(t.extras.map(y => y.id)); gts.forEach(g => { while (g.lines.length && g.lines[g.lines.length - 1] === '') g.lines.pop(); const id = newId(used, 'x'); const lb = g.lines.join(' '), mn = /\s*\((\d)\s*ảnh\)\s*$/i.exec(lb), n = mn ? Math.min(4, Math.max(1, +mn[1])) : 1; t.extras.push(g.kind === 'image' ? Object.assign({ id, kind: 'image', pos: g.pos, label: (mn ? lb.slice(0, mn.index) : lb).trim() || 'ảnh' }, n > 1 ? { n } : {}) : { id, kind: 'text', pos: g.pos, text: g.lines.join('\n') }); }); }
  if (F.marks) { if (!t.image) notes.push('“Điểm trên ảnh” nhưng Task không có ảnh chung'); else { const pts = F.marks.replace(/\(([^)]*)\)/g, '').split(/\s*;\s*/).map(x => x.trim().split(/[\s,]+/).map(parseFloat)).filter(a => a.length >= 2 && isFinite(a[0]) && isFinite(a[1])).slice(0, 20).map(([x, y]) => ({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })); if (pts.length) t.image.marks = pts; else notes.push(`không đọc được "Điểm trên ảnh: ${F.marks}" (viết x y theo %, cách nhau bằng ;)`); if (/ô trống/i.test(F.marks)) t.image.mk = { label: 'none' }; } }
  // ô tick ☐ trong MD: lựa chọn hiện bằng ô vuông (A4, nhãn ☐)
  
  if (box && t.answer.layout === 'A4' && t.answer.attach === 'item') { t.answer.params.lab = 'box'; explicit = explicit || !!F.kind; }
  else if (box && !force) notes.push(`có ô tick ☐ nhưng đáp án là “${MD_KNAME(t)}”. Nếu bài trộn nhiều loại đáp án, tách thành nhiều Task (vd 6a, 6b)`);
  // gạch ___ ở cuối câu khi đáp án đã có chỗ trả lời riêng (Đúng/Sai, viết câu, viết từ theo câu): bỏ để không trùng
  if (dupGapKind(t)) { let n = 0; its(t).forEach(x => { if (x.text && /\s*_{3,}\s*[.?!]?\s*$/.test(x.text) && x.text.split('___').length === 2 && !/:\s*_{3,}\s*$/.test(x.text)) { x.text = x.text.replace(/\s*_{3,}(\s*[.?!]?)\s*$/, '$1').replace(/\s+([.?!])$/, '$1'); n++; } }); if (n) notes.push(`bỏ gạch ___ ở cuối ${n} câu (app tự vẽ chỗ trả lời)`); }
  if (F.lines) { const n = Math.max(1, Math.min(t.answer.layout === 'A1' ? 20 : 8, parseInt(F.lines, 10) || 1)); if (['A1', 'A2'].includes(t.answer.layout)) t.answer.params.lines = n; else notes.push('“Dòng viết” chỉ dùng cho đáp án viết câu / điền chỗ trống'); }
  if (keys && keys.length) { const it = its(t).filter(x => !x.ex && !x.gt); if (it.length) { it.forEach((x, i) => { if (keys[i] != null && keys[i] !== '') x.key = keys[i]; }); if (keys.length > it.length) notes.push(`đáp án có ${keys.length} dòng, Task có ${it.length} câu`); } else notes.push('Task không có câu: bỏ phần đáp án'); }
  if (keys && keys.ex != null) { const x = its(t).find(y => y.ex); if (x) x.key = keys.ex; else notes.push('đáp án có dòng “0.” nhưng Task không có câu ví dụ'); }
  its(t).forEach(x => { if (x.ex && x.key == null) x.key = ''; });
  if (keys && keys.gap) { if (t.content.lead && t.content.lead.kind === 'passage') t.content.lead.keys = keys.gap; else notes.push('“Chỗ trống:” trong đáp án nhưng Task không có bài đọc'); }
  if (F.tlay) { const v = MD_TLAY[F.tlay.toLowerCase().trim()]; if (!v) notes.push(`không hiểu "Bố cục: ${F.tlay}" (xếp dọc / ảnh trái / ảnh phải / ảnh trong bài đọc)`); else if (tnReasons(t)[v]) notes.push(`"Bố cục: ${F.tlay}" không dùng được (${tnReasons(t)[v]}); để Tự động`); else qCmd(t, 'tn', v); }
  if (F.order) { if (!/câu hỏi trước|questions? first/i.test(F.order)) { if (!/bài đọc trước/i.test(F.order)) notes.push(`không hiểu "Thứ tự: ${F.order}"`); } else if (ck(t) !== 'passage') notes.push('“Thứ tự: câu hỏi trước” chỉ dùng cho Task có bài đọc'); else if (t.layout.task !== 'auto' && ['T8', 'T4'].includes(layoutOf(t))) notes.push('“Bố cục:” đã chọn đặt bài đọc cạnh câu hỏi / bao quanh ảnh: bài đọc luôn đứng trước, bỏ “Thứ tự”'); else t.layout.order = 'qfirst'; }
  if (F.ta) { const m = { 'trái': 'left', 'giữa': 'center', 'phải': 'right', 'hai bên': 'justify', 'đều hai bên': 'justify' }[F.ta.trim().toLowerCase()]; if (m) { if (m !== 'left') t.layout.ta = m; } else notes.push(`không hiểu "Căn lề chữ: ${F.ta}" (trái / giữa / phải / hai bên)`); }   // v97
  if (F.nlab) { const v = F.nlab.toLowerCase().replace(/[\s,.-]+/g, '');   // v100: "Số câu: a b c" / "ẩn" / "1 2 3"
    if (/^(abc|a[-–]?[a-z]|chữ|chữcái)$/.test(v)) t.layout.nlab = 'a'; else if (/^(ẩn|an|off|không|bỏ)$/.test(v)) { t.layout.num = 'off'; } else if (!/^(123|số|hiện|on)$/.test(v)) notes.push(`không hiểu "Số câu: ${F.nlab}" (a b c / ẩn / 1 2 3)`); }
  if (F.qbold) { if (/^(đậm|bold|có)$/i.test(F.qbold)) t.layout.qbold = true; else if (!/^(thường|bình thường|normal|không)$/i.test(F.qbold)) notes.push(`không hiểu "Chữ câu hỏi: ${F.qbold}" (đậm / thường)`); }
  if (F.heads) { if (ck(t) !== 'pairs') notes.push('“Tiêu đề cột” chỉ dùng cho bài nối'); else { const h = F.heads.split('|').map(x => x.trim()); if (h.some(Boolean)) t.content.heads = [h[0] || '', h[1] || '']; } }   // v105
  if (F.mid) { if (ck(t) !== 'pairs') notes.push('“Chỗ nối” chỉ dùng cho bài nối'); else if (/^(ô|box)/i.test(F.mid.trim())) t.answer.params.mid = 'box'; else if (/^(không|none)/i.test(F.mid.trim())) t.answer.params.mid = 'none'; else if (!/^(chấm|dot)/i.test(F.mid.trim())) notes.push(`không hiểu "Chỗ nối: ${F.mid}" (chấm / ô viết chữ / không)`); }   // v105
  if (F.mbd) { if (ck(t) !== 'pairs') notes.push('“Viền hai vế” chỉ dùng cho bài nối'); else if (/^(có|bật|yes|on)$/i.test(F.mbd)) t.layout.mbd = 'on'; else if (!/^(không|tắt|no|off)$/i.test(F.mbd)) notes.push(`không hiểu "Viền hai vế: ${F.mbd}" (có / không)`); }   // v103
  if (F.shuf) { if (ck(t) !== 'pairs') notes.push('“Xáo vế phải” chỉ dùng cho bài nối'); else if (/^(có|bật|yes|on)$/i.test(F.shuf)) t.content.shuffle = true; else if (/^(không|tắt|no|off)$/i.test(F.shuf)) delete t.content.shuffle; else notes.push(`không hiểu "Xáo vế phải: ${F.shuf}" (có / không)`); }
  if (/\s\|\s|\t/.test(body.join('\n')) && ck(t) === 'table') explicit = true;
  // v100: bài đọc có chỗ trống ___ và không có câu đánh số: chỗ trống là chỗ trả lời, không tạo dòng câu trống
  if (t.content.lead && t.content.lead.kind === 'passage' && gapCount(t.content.lead.text) > 0 && its(t).every(x => !x.text && !x.opts && !x.imgs && !x.img && !x.lines && !x.ex && !x.gt)) { t.content.items = []; t.content.list = false; notes.push('bài đọc có chỗ trống ___: vẫn dùng được, nhưng nên chuyển thành câu hỏi (mỗi đoạn một câu “1.”, bài đọc chỉ giữ tiêu đề) để có đáp án riêng cho từng chỗ trống'); }
  normAnswer(t); tidy(t);
  if (!force) { const m = recipeMatch(t); t.typeId = m.exact ? m.r.id : 'custom'; t.typeName = descOf(t); }
  if (!explicit && conf !== 'cao') notes.push(`loại đáp án do hệ thống đoán (độ chắc: ${conf}); thêm dòng “Trả lời: …” để chắc`);
  else conf = 'cao';
  return { t, notes, conf };
}
// Xuất MD theo quy ước (dùng để kiểm thử khứ hồi và làm mẫu cho người soạn; nút Xuất MD ở thanh trên)
const MD_KNAME = t => { const a = t.answer, k = a.kind; return k === 'word' ? (a.attach === 'inline' ? 'điền chỗ trống' : 'viết từ') : k === 'choice' ? (a.attach === 'inline' ? 'chọn trong câu' : (a.params || {}).lab === 'box' ? 'tick' : 'khoanh A/B/C') : { sentence: 'viết câu', tick: 'tick', tf: 'đúng/sai', match: 'nối', trace: 'tô chữ', none: 'không' }[k] || 'không'; };
function taskToMd(t, asPart) {
  const c = t.content, o = [(asPart ? '### Phần: ' : '## Task: ') + (t.title || '')], k = ck(t), a = t.answer, cell = v => v && v.ans != null ? '=' + v.ans : v && v.tick ? fmtCell(v) : v && v.img ? fmtCell(v) : (typeof v === 'string' ? brOut(v) : '');
  if (t.audio) o.push('Track: ' + t.audio);
  if (t.instruction) o.push('Hướng dẫn: ' + t.instruction);
  if (t.image && k !== 'table') o.push('Ảnh: ' + t.image.label + (t.image.two ? '; ' + (t.image.label2 || 'ảnh 2') : ''));
  if (t.layout.task !== 'auto' && tnOf(t) !== 'T1') o.push('Bố cục: ' + TN[tnOf(t)].toLowerCase());
  if (k !== 'table') o.push('Trả lời: ' + MD_KNAME(t));
  { const p = a.params || {}, q = qOf(t);   // v81: luôn ghi Dạng: (kèm Trả lời: để bản cũ vẫn đọc được)
    if (k !== 'table' && a.kind !== 'none' && q) { const nm = { Q1: 'điền từ', Q2: 'viết câu', Q3: 'chọn A/B/C', Q4: 'chọn trong câu', Q5: 'đúng/sai', Q6: 'nhìn ảnh viết', Q7: 'chọn ảnh', Q8: 'nối', Q9: 'tô chữ', Q12: 'viết tự do' }[q];
      const op = q === 'Q5' && a.kind === 'tf' && p.row ? [...(p.labs ? [p.labs.join('/')] : []), 'cùng hàng'].join(', ') : q === 'Q5' && p.labs ? p.labs.join('/') : q === 'Q5' && a.kind === 'tick' ? 'ô tick' : q === 'Q4' && p.ulab ? 'nhãn A-D' : q === 'Q12' && p.frame === 'box' ? 'khung vẽ' : ['Q1', 'Q6'].includes(q) && a.layout === 'A3' ? 'ô chữ cái' : q === 'Q3' ? [p.lab === 'box' ? 'ô tick' : p.lab === 'circle' ? 'khoanh' : '', p.qv === 'center' ? 'căn giữa' : p.qv === 'bottom' ? 'căn dưới' : ''].filter(Boolean).join(', ') : '';
      if (nm) o.push(`Dạng: ${nm}${op ? ` (${op})` : ''}`); }
    if (p.ruling === '4') o.push('Dòng kẻ: bốn ô li'); }
  if (t.layout.order === 'qfirst') o.push('Thứ tự: câu hỏi trước');
  if (t.layout.qbold) o.push('Chữ câu hỏi: đậm');
  if (t.layout.nlab === 'a') o.push('Số câu: a b c'); else if (t.layout.num === 'off' && its(t).length > 1) o.push('Số câu: ẩn');
  if (taOf(t) !== 'left') o.push('Căn lề chữ: ' + TA.find(y => y[0] === taOf(t))[1].toLowerCase());   // v97
  if (k === 'pairs' && c.shuffle) o.push('Xáo vế phải: có');
  if (k === 'pairs' && t.layout.mbd === 'on') o.push('Viền hai vế: có');
  if (k === 'pairs' && c.heads && c.heads.some(Boolean)) o.push('Tiêu đề cột: ' + c.heads.join(' | '));
  if (k === 'pairs' && (a.params || {}).mid === 'box') o.push('Chỗ nối: ô viết chữ'); else if (k === 'pairs' && (a.params || {}).mid === 'none') o.push('Chỗ nối: không');
  if (t.image && t.image.marks && t.image.marks.length) o.push('Điểm trên ảnh: ' + t.image.marks.map(m => `${m.x} ${m.y}`).join('; ') + (t.image.mk && t.image.mk.label === 'none' ? ' (ô trống)' : ''));
  (t.extras || []).forEach(x => { if (x.kind === 'image') o.push(`Khối ảnh${x.pos === 'top' ? ' trên' : ''}: ${x.label || 'ảnh'}${gtN(x) > 1 ? ` (${gtN(x)} ảnh)` : ''}`); else { o.push(`Khối chữ${x.pos === 'top' ? ' trên' : ''}:`); String(x.text || '').split('\n').forEach(l => o.push(l.trim() ? '  ' + l : '')); } });
  if (['A1', 'A2'].includes(a.layout) && (a.params.lines || 1) > 1) o.push('Dòng viết: ' + a.params.lines);
  if (k === 'passage' && c.lead && c.lead.keys && c.lead.keys.length) o.push('Đáp án chỗ trống: ' + c.lead.keys.join(', '));
  if (t.wordBank) { const wb = t.wordBank; o.push((wb.kind === 'image' ? 'Khung từ ảnh: ' : 'Khung từ: ') + wb.words.join(wb.words.some(w => w.includes(',')) ? '; ' : ', ')); const dp = k === 'dialogue' ? 'right' : 'top'; if ((wb.placement || 'top') !== dp) o.push('Vị trí khung từ: ' + { top: 'trên', bottom: 'dưới', right: 'phải' }[wb.placement || 'top']); }
  if (k === 'table') {
    const tb = t.layout.table || {};
    if (tb.cross) { o.push('Crossword:'); crossLines(c).forEach(l => o.push(l)); return o.join('\n'); }
    if (tb.head === false && tb.rowHead === false) { o.push('Ô chữ:'); c.rows.forEach(r => o.push(r.cells.map(cell).join(r.cells.every(x => String(cell(x)).length <= 1) ? '' : ' '))); }
    else { o.push([cell(c.corner || ''), ...c.cols.map(cell)].join(' | ')); c.rows.forEach(r => o.push([r.head && r.head.img ? `[ảnh: ${r.head.img}] ${r.head.text || ''}`.trim() : cell(r.head), ...r.cells.map(cell)].join(' | '))); }
    return o.join('\n');
  }
  if (k === 'passage') o.push('Bài đọc:', leadText(t), '');
  if (k === 'dialogue') { if (leadText(t)) o.push('Lời dẫn: ' + leadText(t)); o.push('Hội thoại:'); its(t).forEach(x => o.push(`${x.who || '?'}: ${x.text || ''}`)); return o.join('\n'); }
  (c.list === false || (its(t).length === 1 && !its(t)[0].text && !its(t)[0].lines && t.layout.num === 'off' && a.layout === 'A1') ? [] : its(t)).forEach((x, i) => {
    if (x.gt) { o.push('> ' + (x.text || '').replace(/\n/g, ' ')); return; }
    const n = `${qnum(t, i)}. `, im = x.img ? `[ảnh: ${x.img}] ` : '';
    if (x.pair) o.push(n + ((x.pair.l && (x.pair.l.img ? `[ảnh: ${x.pair.l.img}]` : x.pair.l.text)) || '') + (x.pair.l ? ' - ' : '- ') + ((x.pair.r && x.pair.r.text) || ''));
    else if (x.lines) { o.push(n + im + (x.lines[0] || '')); x.lines.slice(1).forEach(l => o.push('   ' + l)); }
    else if (x.imgs) o.push(n + (x.text || '') + ' ' + x.imgs.map((m, j) => `${'abcd'[j]}. ${m}`).join(' '));
    else { const ml = /\n/.test(x.text || ''), op = x.opts && a.kind === 'choice' && a.attach === 'item' ? x.opts.map((p, j) => (a.params || {}).lab === 'box' ? `☐ ${p}` : `${'ABCD'[j]}. ${p}`).join(' ') : '';
      o.push(n + im + (x.text || '').replace(/\n/g, '\n   ') + (op ? (ml ? '\n   ' : ' ') + op : '')); }
  });
  return o.join('\n');
}
function sheetToMd(w) {
  const o = ['# ' + (w.title || ''), 'Tuổi: ' + w.age, 'Xếp trang: ' + (w.flow === 'page' ? 'tách' : 'liền')];
  if (PRESET_NAME[w.spacing && w.spacing.preset]) o.push('Khoảng cách: ' + PRESET_NAME[w.spacing.preset].toLowerCase());
  const jn = (t, i) => i > 0 && t.layout && t.layout.break === 'join';
  w.tasks.forEach((t, i) => o.push('', taskToMd(t, jn(t, i))));
  const grpKeys = []; w.tasks.forEach((t, i) => { if (!jn(t, i)) grpKeys.push([grpKeys.length + 1, [], null]); const g = grpKeys[grpKeys.length - 1]; g[1].push(...its(t).filter(x => !x.ex && !x.gt).map(x => x.key)); const e = its(t).find(x => x.ex); if (e && g[2] == null) g[2] = e.key || ''; });
  const keys = grpKeys.filter(([, k, e]) => k.some(x => x != null && x !== '') || (e != null && e !== ''));
  if (keys.length) { o.push('', '## Đáp án'); keys.forEach(([n, k, e]) => { o.push(`### Task ${n}`); if (e != null && e !== '') o.push(`0. ${e}`); k.forEach((x, i) => o.push(`${i + 1}. ${x == null ? '' : x}`)); }); }
  return o.join('\n') + '\n';
}
/* ================= Bước 3: ảnh thật + ô giữ chỗ ================= */
// Ô ảnh của một Task (theo thứ tự): khóa 'G1' hoặc '@<id câu>' / '@<id câu>.<j>' (đi theo câu khi đổi thứ tự)
const AR_OPTS = [['1/1', '1:1'], ['4/3', '4:3'], ['3/4', '3:4'], ['16/9', '16:9']];
const arLabel = a => { const o = AR_OPTS.find(x => x[0] === String(a)); if (o) return o[1]; const v = arNum(a); return v ? `${Math.round(v * 100) / 100}:1` : '4:3'; };
const tblAr = t => (t.content && t.content.imgAr) || '4/3';
// v85: tỉ lệ THẬT của ảnh đã tải (để Fit tính đúng). imgAr[key] của ô còn là tỉ lệ khung (đổi bằng nút Tỉ lệ), nên ưu tiên kích thước gốc upMeta
// v85: ảnh có Fit riêng (ảnh thứ hai G1b, ảnh khung từ): gắn data-tf + tỉ lệ thật + zoom / lệch tâm vào ô ảnh. fr = { fit, zoom, ox, oy }
function ownFit(t, key, h, fr) {
  if (!fr || !fr.fit || !srcOf(t, key)) return h;
  const st = `--iar:${natAr(t, key) || '4/3'};--ox:${fr.ox || 0};--oy:${fr.oy || 0};--z:${(fr.zoom || 100) / 100};`;
  h = h.replace('<div class="pic ', `<div data-tf="${fr.fit}" class="pic `);
  return /^<div [^>]*style="/.test(h) ? h.replace(/^(<div [^>]*?)style="/, `$1style="${st}`) : h.replace(/^<div /, `<div style="${st}" `);
}
const g1bFr = t => cellFr(t, 'G1b');
// "Như ảnh 1" = bỏ hết chỉnh riêng của ảnh thứ hai (cả zoom, lệch tâm)
postSet = (f => (t, s, p, v) => { f(t, s, p, v); if (p === '@cells.G1b.frame.fit' && v == null && t.layout.cells) { delete t.layout.cells.G1b; if (!Object.keys(t.layout.cells).length) t.layout.cells = null; } })(postSet);
// Ảnh thứ hai chưa chỉnh riêng thì theo Fit của ảnh 1, nhưng vẫn dùng tỉ lệ thật của chính nó (trước v85 bị méo theo tỉ lệ ảnh 1)
const g1bFit = t => g1bFr(t).fit ? g1bFr(t) : fitOf(t) ? { fit: fitOf(t) } : null;
const natAr = (t, key) => { const m = (t.upMeta || {})[key]; return m && m.w && m.h ? `${m.w}/${m.h}` : (t.imgAr || {})[key] || null; };
const fixedImg = (t, key) => key !== 'G1' && !xOfKey(t, key);
const imgArOf = (t, key) => key === 'G1' || key === 'G1b' ? (t.image && t.image.ar) || null : /^B\.\d+$/.test(key) ? (t.wordBank && t.wordBank.ar) || '1/1' : fixedImg(t, key) ? tblAr(t) : ((t.imgAr || {})[key] || null);
// Ảnh trong bảng: khung cố định theo tỉ lệ của bảng; ảnh nằm trong khung theo Fit / zoom / lệch tâm của từng ô
function tpic(t, key, label, cls) {
  const src = srcOf(t, key), f = cellFr(t, key.slice(1)); let h = pic(label, cls, src, { slot: key, ar: tblAr(t) });
  if (!src || !f.fit) return h;
  return h.replace('<div class="pic ', `<div data-tf="${f.fit}" class="pic `).replace('style="', `style="--iar:${natAr(t, key) || tblAr(t)};--ox:${f.ox || 0};--oy:${f.oy || 0};--z:${(f.zoom || 100) / 100};`);
}
async function dropImages(id, files, slotKey, pre) {
  files = files.filter(f => f.type && f.type.startsWith('image/')); if (!files.length) { toast('Không có tệp ảnh'); return; }
  const t0 = ws.tasks.find(x => x.id === id); if (!t0) return;
  let imgs; try { imgs = pre || await Promise.all(files.map(loadImg)); } catch (e) { toast('Không đọc được ảnh này'); return; }
  let added = 0, dropped = 0;
  commit(w => {
    const t = w.tasks.find(x => x.id === id); t.uploads = t.uploads || {}; t.upMeta = t.upMeta || {};
    let sl = slotsOf(t).map(x => x.key);
    let order = slotKey && sl.includes(slotKey) ? [slotKey, ...sl.filter(k => k !== slotKey && !t.uploads[k])] : [...sl.filter(k => !t.uploads[k]), ...sl.filter(k => t.uploads[k])];
    // thừa ảnh: thêm câu (bài có ảnh mỗi câu)
    const canAdd = ['items', 'pairs'].includes(ck(t)) && t.content.variant !== 'multi';
    while (canAdd && order.length < imgs.length) {
      const x = blankItem(t); const nm = files[order.length] && files[order.length].name ? files[order.length].name.replace(/\.[^.]+$/, '') : '';
      if (x.pair) x.pair.l = { img: nm || 'ảnh', text: '' }; else x.img = nm || 'ảnh';
      t.content.items.push(x); ensureIds(t); added++;
      sl = slotsOf(t).map(y => y.key); order = order.concat(sl.filter(k => !order.includes(k) && !t.uploads[k]));
    }
    imgs.forEach((im, i) => { const k = order[i]; if (!k) { dropped++; return; } t.uploads[k] = im.src; t.upMeta[k] = { w: im.w, h: im.h };
      t.imgAr = t.imgAr || {}; t.imgAr[k] = im.ar; });
    normAnswer(t);
  }, `Đã gắn ${imgs.length - dropped} ảnh${added ? ` · thêm ${added} câu` : ''}${dropped ? ` · bỏ ${dropped} ảnh thừa` : ''}`);
}
function delFrame(id) { if (sel.type !== 'sheet' && sel.g === 'G1') sel = { type: 'task', id }; commit(w => { const t = w.tasks.find(x => x.id === id); if (!t || !t.image) return; delete t.image; if (t.uploads) delete t.uploads.G1; if (t.upMeta) delete t.upMeta.G1; t.layout.frame = {}; }, 'Đã xóa khung ảnh (thêm lại ở mục G1 · Ảnh chung)'); }
function removeImage(id, key) { commit(w => { const t = w.tasks.find(x => x.id === id); if (t.uploads) delete t.uploads[key]; if (t.upMeta) delete t.upMeta[key]; }, 'Đã gỡ ảnh, về ô giữ chỗ'); }
function setAr(id, key, ar) { commit(w => { const t = w.tasks.find(x => x.id === id); if (key === 'G1') { if (t.image) t.image.ar = ar; } else { t.imgAr = t.imgAr || {}; t.imgAr[key] = ar; } }, `Tỉ lệ khung: ${arLabel(ar)}`); }
// Khóa ô ảnh ứng với container đang chọn
function slotOfSel(t, s) { if (!s || s.type === 'sheet') return null; if (s.g === 'G1' && s.item) return '@' + s.item; if (s.g === 'G1' && t.image) return 'G1'; return null; }
// Ảnh quá mờ: số điểm ảnh / bề rộng in thật (mm) < 150 dpi
let lowRes = {};
function checkRes() {
  const s = scaleNow(), out = {};
  stage.querySelectorAll('.pic.up[data-slot]').forEach(e => {
    const task = e.closest('.task'); if (!task) return; const t = ws.tasks.find(x => x.id === task.dataset.task); if (!t || !t.upMeta) return;
    const m = t.upMeta[e.dataset.slot]; if (!m) return;
    const mm = e.getBoundingClientRect().width / s / MM, dpi = Math.round(m.w / (mm / 25.4));
    if (dpi < 150) { (out[t.id] = out[t.id] || []).push({ key: e.dataset.slot, dpi }); e.classList.add('lowres'); e.title = `Ảnh hơi mờ khi in: ~${dpi} dpi (nên ≥ 150)`; }
  });
  const ch = JSON.stringify(out) !== JSON.stringify(lowRes); lowRes = out; return ch;
}
function slotName(t, key) { if (key === 'G1') return 'ảnh chung'; if (key === 'G1b') return 'ảnh chung thứ hai'; if (/^B\.\d+$/.test(key)) return `ảnh khung từ ${'ABCDEFGHIJ'[+key.slice(2)] || ''}`; if (xOfKey(t, key)) return 'ảnh khối tự do';
  if (ck(t) === 'table') { const [id, j] = key.slice(1).split('.'), i = (t.content.rows || []).findIndex(r => r.id === id); return `ảnh hàng ${i + 1}${j != null ? ', cột ' + (+j + 1) : ' (cột đầu)'}`; } const [id, j] = key.slice(1).split('.'), i = its(t).findIndex(x => x.id === id); return `ảnh câu ${i + 1}${j != null ? '.' + (+j + 1) : ''}`; }
// Panel ảnh: tải / thay / gỡ + tỉ lệ ô giữ chỗ
function imgCtl(t, key) {
  if (!key) return '';
  const up = srcOf(t, key), ar = imgArOf(t, key) || '4/3', m = (t.upMeta || {})[key], lr = (lowRes[t.id] || []).find(x => x.key === key);
  return `<h3>Ảnh</h3><div class="stack"><div class="erow"><button class="btn" data-act="img-gen" data-v="${key}">Tạo ảnh…</button><button class="btn" data-act="img-up" data-v="${key}">${up ? 'Thay ảnh…' : 'Tải ảnh lên…'}</button>${up ? `<button class="btn" data-act="img-rm" data-v="${key}">Gỡ ảnh</button>` : ''}</div>
    ${up ? `<p class="hint">Ảnh thật${m ? ` ${m.w}×${m.h} px` : ''}, tỉ lệ ${arLabel(ar)}.${lr ? ` <b style="color:var(--danger)">Hơi mờ khi in (~${lr.dpi} dpi, nên ≥ 150).</b>` : ''}</p>`
      : fld('ar', 'Tỉ lệ ô giữ chỗ', `<span class="seg wrapseg">${AR_OPTS.map(([v, n]) => `<button data-act="img-ar" data-v="${key}|${v}" class="${String(ar) === v ? 'on' : ''}">${n}</button>`).join('')}</span>`, false, '', 's')}
    <p class="hint">Cũng có thể kéo thả ảnh vào ô trên trang, hoặc chọn ô rồi bấm Ctrl+V.</p>${key === 'G1' ? `<div class="erow"><button class="btn" data-act="img-del">Xóa khung ảnh</button></div><p class="hint">Bài không cần ảnh chung thì xóa cả khung. Phím Delete cũng được. Thêm lại bằng nút + Thêm ở mục G1 · Ảnh chung (cột trái).</p>` : ''}</div>`;
}

/* ---- Thư viện mẫu có sẵn (thẻ 1 của "+ Task") ---- */
/* v94: chọn Dạng câu hỏi (Q) rồi Bố cục (T), xem trước bằng chữ lorem. Mỗi Q dựa trên một công thức (RECIPES) rồi setQ / blkAdd / tn. */
const LN_REC = { Q1: 'gap-fill', Q2: 'answer-q', Q3: 'choose-abc', Q4: 'choose-inline', Q5: 'true-false', Q6: 'look-write', Q7: 'listen-tick', Q8: 'match', Q9: 'trace', Q10: 'table', Q11: 'table', Q12: 'answer-q', IMG: 'colour-draw' };
const LN_GROUPS = [['Viết', ['Q1', 'Q2', 'Q12', 'Q9']], ['Chọn', ['Q3', 'Q4', 'Q5', 'Q7']], ['Ghép · Ảnh · Bảng', ['Q8', 'Q6', 'Q10', 'Q11', 'IMG']]];
const lnName = q => q === 'IMG' ? 'Chỉ có ảnh' : q === 'Q11' ? 'Ô chữ / lưới' : QN[q];
const LN_HINT = { Q1: 'chỗ trống ___, hội thoại', Q2: 'trả lời câu hỏi', Q3: 'vài lựa chọn A B C', Q4: 'khoanh, gạch chân, tìm lỗi', Q5: 'cột T/F hoặc ô tick', Q6: 'một ảnh mỗi câu', Q7: 'tick ảnh đúng', Q8: 'nối vế trái, vế phải', Q9: 'luyện viết', Q10: 'ô chữ, ô trống', Q11: 'giải đố, tìm từ', Q12: 'dòng kẻ hoặc khung vẽ', IMG: 'tô màu / vẽ' };
const LN_TS = [['auto', 'Tự động'], ['T1', 'Xếp dọc'], ['T2', 'Ảnh trái'], ['T3', 'Ảnh phải'], ['T4', 'Ảnh trong bài đọc']];
const LN_BLK = [['G1', 'Ảnh chung'], ['G2', 'Bài đọc'], ['G4', 'Khung từ']];
const LN_LOREM = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Sed do eiusmod tempor incididunt ut labore et dolore.', 'Ut enim ad minim veniam, quis nostrud exercitation.', 'Duis aute irure dolor in reprehenderit in voluptate.', 'Excepteur sint occaecat cupidatat non proident.'];
let ln = { q: 'Q3', T: 'auto', G1: false, G2: false, G4: false, pos: 'end' };
function lnReset() { ln = { q: 'Q3', T: 'auto', G1: false, G2: false, G4: false, pos: 'end' }; }   // mặc định cuối phiếu (giữ quy tắc cũ: nhập / thêm Task không chen vào giữa); "Sau Task đang chọn" là lựa chọn
// Khối không dùng được với dạng này: trả lý do ('' = được)
function lnBlkWhy(g) {
  if (ln.q === 'IMG') return g === 'G1' ? 'Dạng này luôn có ảnh' : 'Dạng này chỉ có ảnh';
  if (g === 'G2' && !['Q1', 'Q2', 'Q3', 'Q5'].includes(ln.q)) return 'Bài đọc đi với Điền từ, Viết câu, Chọn A/B/C, Đúng / Sai';
  return '';
}
// Dựng Task theo lựa chọn hiện tại (w = bản phiếu để lấy mã số; Task chưa được thêm vào đâu)
function lnBuild(w) {
  const t = newTaskFrom(recipeById(LN_REC[ln.q]), w);
  if (ln.q === 'Q11' || ln.q === 'Q12') setQ(t, ln.q);
  ['G1', 'G2', 'G4'].forEach(g => { if (ln[g] && !lnBlkWhy(g) && blkAddable(t).includes(g)) blkAdd(t, g); });
  const rs = tnReasons(t); if (ln.T !== 'auto' && rs[ln.T]) ln.T = 'auto';
  if (ln.T !== 'auto') { const L = tnTarget(t, ln.T); t.layout.task = L; if (layoutReasons(t)[L]) t.layout.task = 'auto'; }
  tidy(t); return t;
}
// Chữ mẫu cho xem trước (chỉ chạy trên bản xem trước, không đụng Task thật)
function lnLorem(t) {
  let n = 0; const L = () => LN_LOREM[n++ % LN_LOREM.length], c = t.content, blank = x => !String(x || '').replace(/[?\s]/g, '');
  if (c.lead && c.lead.kind === 'passage' && blank(c.lead.text)) c.lead.text = LN_LOREM.slice(0, 3).join(' ') + '\n\n' + LN_LOREM.slice(3).join(' ');
  if (c.form === 'table') { if (blank(c.cols[0]) && blank(c.cols[1]) && !(t.layout.table && t.layout.table.cross)) { c.cols = ['Lorem', 'Ipsum']; c.rows.forEach((r, i) => { r.head = ['dolor', 'sit', 'amet'][i % 3]; }); } }
  its(t).forEach(x => {
    if (x.pair) { if (x.pair.l && !x.pair.l.img && blank(x.pair.l.text)) x.pair.l.text = 'lorem'; if (x.pair.r && blank(x.pair.r.text)) x.pair.r.text = 'ipsum'; return; }
    if (c.form === 'table' || x.img || x.imgs) { if (x.opts) x.opts = x.opts.map((o, i) => o || ['lorem', 'ipsum', 'dolor'][i]); return; }
    if (blank(x.text) && t.answer.layout !== 'A8') x.text = L(); if (x.opts) x.opts = x.opts.map((o, i) => o || ['lorem', 'ipsum', 'dolor'][i]);
  });
  if (ck(t) === 'trace') its(t).forEach((x, i) => { if (blank(x.text)) x.text = ['lorem', 'ipsum', 'dolor'][i % 3]; });
  if (t.wordBank && t.wordBank.kind !== 'image' && !t.wordBank.words.length) t.wordBank.words = ['lorem', 'ipsum', 'dolor', 'amet'];
}
function lnRender() {
  const d = impDlg(); if (!d.querySelector('#lnQ')) return;
  d.querySelector('#lnQ').innerHTML = LN_GROUPS.map(([g, qs]) => `<div class="lnqg">${g}</div><div class="lnqc">${qs.map(q => `<button type="button" class="lnq ${ln.q === q ? 'on' : ''}" data-lq="${q}" title="${esc(q === 'IMG' ? 'Một ảnh lớn, không có câu hỏi; thêm câu sau nếu cần' : QHINT[q])}"><b>${q === 'IMG' ? '' : q + ' '}${esc(lnName(q))}</b><span>${esc(LN_HINT[q])}</span></button>`).join('')}</div>`).join('');
  // khối đi kèm trước, vì Bố cục phụ thuộc vào ảnh / bài đọc
  const forceImg = ln.q === 'IMG';
  d.querySelector('#lnB').innerHTML = '<span class="hint">Kèm theo:</span>' + LN_BLK.map(([g, n]) => { const why = lnBlkWhy(g), on = forceImg && g === 'G1' ? true : ln[g] && !why; return `<button type="button" class="chip ${on ? 'on' : ''}" data-lb="${g}" ${why ? `disabled title="${esc(why)}"` : ''}>${on ? '✓ ' : '+ '}${n}</button>`; }).join('');
  const t = lnBuild(ws), rs = tnReasons(t);
  d.querySelector('#lnT').innerHTML = LN_TS.map(([v, n]) => { const why = v === 'auto' ? '' : rs[v]; return `<button type="button" class="lnt ${ln.T === v ? 'on' : ''} ${why ? 'off' : ''}" data-lt="${v}" ${why ? `data-why="${esc(why)}"` : ''} title="${esc(why || (v === 'auto' ? 'Máy chọn kiểu hợp nhất' : TN_HINT[v]))}" aria-disabled="${why ? 'true' : 'false'}">${v === 'auto' ? '<span class="au">✦</span>' : layIcon(v === 'T4' ? 'T8' : v)}<b>${n}</b></button>`; }).join('');
  d.querySelector('#lnTh').textContent = `· hợp với ${q0name()}`;
  d.querySelector('#lnPos').innerHTML = [['end', 'Cuối phiếu'], ['after', 'Sau Task đang chọn']].map(([v, n]) => { const off = v === 'after' && !(sel.type !== 'sheet' && ws.tasks.some(x => x.id === sel.id)); return `<button type="button" data-lp="${v}" class="${ln.pos === v ? 'on' : ''}" ${off ? 'disabled' : ''}>${n}</button>`; }).join('');
  // xem trước: Task cùng cấu hình, chữ lorem, số thứ tự như khi thêm
  const p = lnBuild(ws); lnLorem(p); p.id = 'tpv'; p.number = ws.tasks.length + 1; tidy(p);
  const pv = d.querySelector('#lnPv'); let html = '';
  try { html = renderTask(p, null, 0); } catch (e) { html = `<p class="hint">Không dựng được bản xem trước: ${esc(e.message)}</p>`; }
  pv.innerHTML = `<div class="lnpg"><div class="flow">${html}</div></div>`;   // không dùng class "page": mã khác tìm .page .task trong cả tài liệu
  d.querySelector('#lnCap').textContent = `${q0name()} · ${ln.T === 'auto' ? 'Tự động → ' + TN[tnOf(p)] : TN[ln.T]}. Chữ mẫu chỉ để xem, Task thật dùng câu mẫu để bạn sửa.`;
}
const q0name = () => ln.q === 'IMG' ? 'Chỉ có ảnh' : `${ln.q} ${lnName(ln.q)}`;
function lnAdd() {
  let nid, nm = q0name();
  impDlg().close();
  commit(w => { const t = lnBuild(w); nid = t.id; if (ln.pos === 'after') insertTask(t, w); else w.tasks.push(t); }, `Đã thêm Task “${nm}” ${ln.pos === 'after' ? 'sau Task đang chọn' : 'vào cuối phiếu'}`);
  sel = { type: 'task', id: nid }; multi = []; sectReset(nid); refreshSel();
  const tk = stage.querySelector(`.task[data-task="${nid}"]`); if (tk) tk.scrollIntoView({ block: 'center' });
  const first = document.querySelector('#tree .ed .eitems [data-k], #tree .ed .etbl [data-k]'); if (first) first.focus();
}
function openLib() { openImport('task', 'lib'); }
document.getElementById('libPane').addEventListener('click', e => {
  const q = e.target.closest('[data-lq]'), tb = e.target.closest('[data-lt]'), b = e.target.closest('[data-lb]'), p = e.target.closest('[data-lp]');
  if (q) { const was = ln.q; ln.q = q.dataset.lq; if (was === 'IMG' && ln.q !== 'IMG') ln.G1 = false; if (ln.q === 'IMG') { ln.G1 = true; ln.G2 = false; ln.G4 = false; } else if (lnBlkWhy('G2')) ln.G2 = false; }
  else if (tb) { if (tb.dataset.why) { toast(tb.dataset.why); return; } ln.T = tb.dataset.lt; }
  else if (b && !b.disabled) ln[b.dataset.lb] = !ln[b.dataset.lb];
  else if (p && !p.disabled) ln.pos = p.dataset.lp; else return;
  lnRender();
});
document.getElementById('libAdd').onclick = lnAdd;
impDlg().addEventListener('close', () => { const pv = document.getElementById('lnPv'); if (pv) pv.innerHTML = ''; });   // bỏ bản xem trước khi đóng hộp (tránh lẫn với Task thật)
document.getElementById('libClose').onclick = () => impDlg().close();
treeEl.addEventListener('click', e => { const b = e.target.closest('[data-lib],[data-newsheet]'); if (!b) return; if (b.dataset.lib) openImport('task', 'lib'); else openImport('sheet'); });
/* ---- Hộp nhập: sự kiện ---- */
(() => {
  const d = impDlg(), ta = d.querySelector('#pasteTa');
  d.querySelector('#imTabs').addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (!b) return; impTab = b.dataset.tab; impShowTab(); if (impTab === 'src') ta.focus(); });
  ta.addEventListener('input', () => { clearTimeout(pasteTimer); pasteTimer = setTimeout(impAnalyze, 200); });
  d.querySelector('.pmode').addEventListener('click', e => { const b = e.target.closest('[data-pm]'); if (!b) return; pasteMode = b.dataset.pm; pasteManual = true; impJ = null; impAnalyze(); });
  d.querySelector('#impPick').onclick = () => { const f = d.querySelector('#impFile'); f.value = ''; f.click(); };
  d.querySelector('#impFile').addEventListener('change', e => impPickFile(e.target.files[0]));
  d.querySelector('#pasteOut').addEventListener('click', e => {
    const b = e.target.closest('[data-pm2],[data-imp]'); if (!b) return;
    if (b.dataset.pm2) { pasteMode = b.dataset.pm2; pasteManual = true; impJ = null; impAnalyze(); }
    else if (b.dataset.imp === 'tosheet') { const raw = ta.value, fn = impFile; openImport('sheet', null, raw); impFile = fn; impRender(); }
    else if (b.dataset.imp === 'dl') impDownloadOld();
    else if (b.dataset.imp === 'back') { impConfirm = false; d.querySelector('#srcIn').hidden = false; impRender(); }
  });
  d.querySelector('#pasteOut').addEventListener('change', e => {
    const x = e.target, J = impJ; if (!J) return;
    if (x.dataset.pr != null && J.src === 'text') { const r = J.tasks[+x.dataset.pr], n = parseTask(r.raw, x.value || null); Object.assign(r, { t: n.t, notes: n.notes, conf: n.conf, rid: n.rid, force: x.value || null }); impRender(); }
    if (x.dataset.jk != null) { J.tasks[+x.dataset.jk].skip = !x.checked; impRender(); }
  });
  d.querySelector('#pasteOk').onclick = () => { clearTimeout(pasteTimer); if (!impConfirm && impJ == null && ta.value.trim()) impAnalyze(); impCommit(); };
})();
/* ---- Ảnh: kéo thả lên trang, Ctrl+V, nút trong panel ---- */
stage.addEventListener('dragover', e => { if (!e.dataTransfer || ![...e.dataTransfer.types].includes('Files')) return; const tk = e.target.closest('.task'); if (!tk) return; e.preventDefault(); stage.querySelectorAll('.dov').forEach(x => x.classList.remove('dov')); (e.target.closest('[data-slot]') || tk).classList.add('dov'); });
stage.addEventListener('dragleave', e => { const x = e.target.closest('.dov'); if (x && !x.contains(e.relatedTarget)) x.classList.remove('dov'); });
stage.addEventListener('drop', e => { const tk = e.target.closest('.task'); stage.querySelectorAll('.dov').forEach(x => x.classList.remove('dov')); if (!tk || !e.dataTransfer.files.length) return; e.preventDefault(); const sl = e.target.closest('[data-slot]'); dropImages(tk.dataset.task, [...e.dataTransfer.files], sl ? sl.dataset.slot : null); });
document.addEventListener('paste', e => {
  if (e.target.matches && e.target.matches('input,textarea,select')) return; if (document.querySelector('dialog[open]')) return;
  const cd2 = e.clipboardData; if (!cd2) return;
  const fs = [...cd2.files].filter(f => f.type.startsWith('image/'));
  if (fs.length) { e.preventDefault(); if (sel.type === 'sheet') { toast('Chọn một Task hoặc ô ảnh rồi dán ảnh'); return; } const t = curT(ws); dropImages(t.id, fs, slotOfSel(t, sel)); return; }
  const tx = cd2.getData('text/plain'); if (tx && tx.trim()) { e.preventDefault(); openImport('task', 'src', tx); }
});
extraActs['img-up'] = (b, v) => { const inp = document.getElementById('upfile'); inp.dataset.task = curT(ws).id; inp.dataset.slot = v; inp.multiple = false; inp.value = ''; inp.click(); };
extraActs['img-rm'] = (b, v) => removeImage(curT(ws).id, v);
extraActs['img-del'] = () => delFrame(curT(ws).id);
extraActs['img-ar'] = (b, v) => { const [k, a] = v.split('|'); setAr(curT(ws).id, k, a); };

/* ================= Vòng render ================= */
function draw() { if (lastRes) { drawPages(lastRes); document.getElementById('zoomFit').textContent = zoom == null ? 'Vừa khung' : Math.round(scaleNow() * 100) + '%'; } }
let ready = false;
// Font chữ của phiếu (v69): chỉ đổi font của trang A4, giao diện giữ nguyên
const FONTS = {
  andika: { name: 'Andika', css: '"Andika", "Comic Sans MS", "Trebuchet MS", sans-serif', hint: 'Font hiện tại: chữ a, g đơn giản như sách tập đọc, dễ phân biệt cho trẻ mới học.' },
  be: { name: 'Be Vietnam Pro', css: '"Be Vietnam Pro", "Segoe UI", system-ui, sans-serif', hint: 'Font trong ảnh bạn gửi: gọn, hiện đại, dấu tiếng Việt rõ.' },
  lexend: { name: 'Lexend', css: '"Lexend", "Be Vietnam Pro", system-ui, sans-serif', hint: 'Font thiết kế cho dễ đọc, giãn chữ rộng hơn; hợp học sinh đọc còn chậm.' }
};
const fontKey = () => FONTS[ws.font] ? ws.font : 'andika';
let fontApplied = '';
function applyFont() {
  const k = fontKey(); if (k === fontApplied) return false;
  fontApplied = k; document.documentElement.style.setProperty('--f-sheet', FONTS[k].css);
  if (document.fonts && k !== 'andika') {
    const n = FONTS[k].name, vi = 'ăâđêôơưáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụýỳỷỹỵ';
    Promise.all(['14pt ', 'bold 14pt '].flatMap(f => [document.fonts.load(f + '"' + n + '"'), document.fonts.load(f + '"' + n + '"', vi)])).catch(() => {}).then(() => document.fonts.ready).then(() => { if (ready && fontApplied === k) { const res = paginate(); lastRes = res; draw(); document.getElementById('pageBadge').textContent = `${res.pages.length} trang A4`; const db = document.getElementById('diagBadge'); db.textContent = res.diags.length ? `${res.diags.length} lỗi tràn trang` : 'Không lỗi tràn'; db.classList.toggle('bad', !!res.diags.length); } });
  }
  return true;
}
let renderCount = 0;
function render() {
  renderCount++;
  applyFont();
  ws.tasks.forEach(ensureRowIds);
  document.getElementById('wsTitle').textContent = ws.title;
  document.getElementById('age').value = ws.age;
  document.getElementById('undo').disabled = !hist.length;
  document.getElementById('redo').disabled = !fut.length;
  if (!ready) return;
  const res = paginate(); lastRes = res;
  resChanged = false; renderTree(); draw(); renderInspector();
  if (resChanged) { resChanged = false; renderTree(); renderInspector(); }
  document.getElementById('pageBadge').textContent = `${res.pages.length} trang A4`;
  const db = document.getElementById('diagBadge');
  db.textContent = res.diags.length ? `${res.diags.length} lỗi tràn trang` : 'Không lỗi tràn';
  db.classList.toggle('bad', !!res.diags.length);
  // Báo Task đổi trang
  const start = {}; res.pages.forEach((p, i) => p.items.forEach(x => { if (!(x.t.id in start)) start[x.t.id] = i + 1; }));
  if (lastStart) {
    const moved = ws.tasks.filter(t => lastStart[t.id] && start[t.id] !== lastStart[t.id]);
    if (res.pages.length !== lastCount) toast(`Phiếu giờ có ${res.pages.length} trang${moved.length ? ` · Task ${moved[0].number} chuyển sang trang ${start[moved[0].id]}` : ''}`);
    else if (moved.length) toast(`Task ${moved.map(t => t.number).slice(0, 3).join(', ')} chuyển sang trang ${start[moved[0].id]}`);
  }
  lastStart = start; lastCount = res.pages.length;
}
/* ================= Tạo ảnh (popup) =================
   Nối dịch vụ gen ảnh thật: gán window.WSImageGen = { generate: async ({ prompt, refs, ar }) => ({ src: 'data:image/png;base64,…' }) }
   (refs = mảng data URL của ảnh tham chiếu; ar = '4/3' | '1/1' | '3/4' | '16/9'). Chưa gán thì dùng bản demo có đóng dấu DEMO. */
function thumbHtml(t, key) {
  const src = srcOf(t, key), ar = imgArOf(t, key) || '4/3';
  return `<button type="button" class="ithumb ${src ? 'has' : ''}" data-gen="${esc(key)}" style="--tar:${ar}" title="${src ? 'Mở để thay hoặc tạo lại ảnh' : 'Tạo hoặc tải ảnh'}" aria-label="Ảnh: ${esc(slotName(t, key))}">${src ? `<img src="${src}" alt="">` : '<span>+</span>'}</button>`;
}
const genState = {}; let genCtx = null;
const GEN_DEMO = { demo: true, generate: ({ prompt, ar }) => new Promise(ok => setTimeout(() => {
  const r = arNum(ar) || 4 / 3, W = r >= 1 ? 768 : Math.round(768 * r), H = r >= 1 ? Math.round(768 / r) : 768, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const g = cv.getContext('2d'); let h = 0; for (const c of prompt) h = (h * 31 + c.charCodeAt(0)) % 360;
  const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, `hsl(${h},35%,88%)`); gr.addColorStop(1, `hsl(${(h + 50) % 360},35%,76%)`); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.fillStyle = '#1b252c'; g.font = `600 ${Math.round(W / 22)}px sans-serif`; g.textAlign = 'center';
  const words = prompt.split(/\s+/), lines = []; let cur = ''; words.forEach(w => { if ((cur + ' ' + w).length > 26) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }); lines.push(cur);
  lines.slice(0, 6).forEach((l, i) => g.fillText(l, W / 2, H / 2 - 20 + i * Math.round(W / 18)));
  g.save(); g.translate(W / 2, H - 26); g.fillStyle = 'rgba(194,65,12,.9)'; g.font = `700 ${Math.round(W / 30)}px sans-serif`; g.fillText('DEMO · chưa nối dịch vụ gen ảnh', 0, 0); g.restore();
  ok({ src: cv.toDataURL('image/png') }); }, 700)) };
function genRender() {
  const c = genCtx, st = c.st, t = ws.tasks.find(x => x.id === c.id); if (!t) return;
  const isTb = fixedImg(t, c.key); if (isTb) st.ar = tblAr(t);
  const has = st.rm ? null : srcOf(t, c.key), shown = st.cur >= 0 ? st.results[st.cur] : has;
  document.getElementById('genTitle').textContent = `Tạo ảnh · ${slotName(t, c.key)}`;
  const fr = document.getElementById('genFr'), fc = genFrameCfg(t, c.key), pg = genPageBox(c.id, c.key);
  const boxAr = fc && pg && fc.frame.h ? pg : null;                       // ô có khung (Fit): xem trước đúng tỉ lệ khung trên phiếu
  fr.style.aspectRatio = boxAr ? String(boxAr) : st.ar; fr.classList.toggle('busy', !!st.busy);
  const iar = st.cur >= 0 ? ((st.resAr || [])[st.cur] || st.ar) : shown ? ((t.imgAr || {})[c.key] || imgArOf(t, c.key) || '4/3') : st.ar, f = fc && st.fd && st.fd.fit ? st.fd : null;
  fr.classList.toggle('fit', !!(f && shown)); if (f && shown) { fr.dataset.f = f.fit; fr.style.setProperty('--z', (f.zoom || 100) / 100); fr.style.setProperty('--ox', f.ox || 0); fr.style.setProperty('--oy', f.oy || 0); fr.style.setProperty('--iar', iar); } else { delete fr.dataset.f; }
  fr.innerHTML = shown ? `<img src="${shown}" alt="Ảnh xem trước" draggable="false">` : `<div class="ph">Chưa có ảnh.<br>Nhập mô tả rồi bấm “Tạo ảnh”, hoặc tải ảnh từ máy.</div>`;
  const gf = document.getElementById('genFrame'); gf.hidden = !fc;
  if (fc) { const fit = st.fd.fit || 'normal', fd = st.fd;
    document.getElementById('genFit').innerHTML = [['normal', 'Bình thường'], ['width', 'Fit ngang'], ['height', 'Fit dọc']].map(([v, n]) => `<button type="button" data-fit="${v}" class="${fit === v ? 'on' : ''}">${n}</button>`).join('');
    document.getElementById('genZoomRow').hidden = fit === 'normal'; const z = fd.zoom || 100; document.getElementById('genZoom').value = z; document.getElementById('genZoomOut').textContent = z + '%';
    document.getElementById('genCenter').disabled = !(fd.ox || fd.oy || fd.zoom); }
  const vs = document.getElementById('genVs'); vs.style.setProperty('--tar', st.ar);
  vs.innerHTML = st.results.map((r, i) => `<button type="button" data-v="${i}" class="${i === st.cur ? 'on' : ''}" aria-label="Ảnh đã tạo ${i + 1}"><img src="${r}" alt=""></button>`).join('');
  document.getElementById('genRefs').innerHTML = st.refs.map((r, i) => `<span class="genref"><img src="${r}" alt="Ảnh tham chiếu ${i + 1}"><button type="button" data-rx="${i}" aria-label="Bỏ ảnh tham chiếu ${i + 1}">✕</button></span>`).join('') + `<button type="button" class="genadd" id="genAdd" ${st.refs.length >= 4 ? 'disabled' : ''} title="Thêm ảnh tham chiếu" aria-label="Thêm ảnh tham chiếu">+</button>`;
  document.getElementById('genAr').innerHTML = AR_OPTS.map(([v, n]) => `<button type="button" data-ar="${v}" class="${String(st.ar) === v ? 'on' : ''}"${isTb ? ' disabled' : ''}>${n}</button>`).join('');
  document.getElementById('genAr').parentNode.firstElementChild.textContent = 'Tỷ lệ';
  const prov = window.WSImageGen && typeof window.WSImageGen.generate === 'function' ? window.WSImageGen : GEN_DEMO;
  document.getElementById('genNote').textContent = st.msg || '';
  document.getElementById('genGo').disabled = !!st.busy; document.getElementById('genGo').textContent = st.busy ? 'Đang tạo…' : (st.results.length ? 'Tạo lại' : 'Tạo ảnh');
  document.getElementById('genUse').disabled = !!st.busy; document.getElementById('genRm').hidden = !has;
}
// Khung (frame) của ô ảnh: chỉ ảnh chung (G1) và ô ảnh của lưới T5 có khung chỉnh Fit / tâm / zoom. Dùng đúng dữ liệu của panel Ảnh.
function genSel(t, key) { if (xOfKey(t, key)) return { type: 'group', id: t.id, g: 'GT', item: xOfKey(t, key).id }; return key === 'G1' ? { type: 'group', id: t.id, g: 'G1' } : { type: 'group', id: t.id, g: 'G1', item: key.slice(1), tc: fixedImg(t, key) ? 1 : undefined }; }
function genFrameCfg(t, key) {
  if (xOfKey(t, key)) return null;
  if (key === 'G1') return t.image ? { frame: t.layout.frame || {} } : null;
  if (key[0] === '@' && fixedImg(t, key)) return { frame: cellFr(t, key.slice(1)) };
  if (cellImgMode(t) && cellKeys(t, 'cimg').includes(key.slice(1))) return { frame: (cellCfg(t, key.slice(1)).frame) || {} };
  return null;
}
function genPageBox(id, key) { const e = stage.querySelector(`.task[data-task="${id}"] .pic[data-slot="${key}"]`); if (!e) return null; const r = e.getBoundingClientRect(); return r.width && r.height ? +(r.width / r.height).toFixed(3) : null; }
function genSetFrame(p, v) { const fd = genCtx.st.fd; if (!fd) return; const k = p.slice(6); fd[k] = v; if (k === 'fit') fd.ox = fd.oy = fd.zoom = null; genRender(); }
// Lưu nháp khung vào layout (cùng chỗ với panel Ảnh)
function genApplyFrame(c) { const fd = c.st.fd; if (c.key === 'G1' && c.st.arTouched) { commit(w => { const t = w.tasks.find(x => x.id === c.id); if (t.image) t.image.ar = c.st.ar; }); c.st.arTouched = false; } if (!fd) return; commit(w => { const t = w.tasks.find(x => x.id === c.id), cf = cfgOf(t, genSel(t, c.key), true); cf.frame = cf.frame || {}; ['fit', 'zoom', 'ox', 'oy'].forEach(k => { cf.frame[k] = fd[k] || null; }); }); }
function openGen(id, key) {
  const t = ws.tasks.find(x => x.id === id); if (!t) return;
  const k = id + '|' + key, lab = (slotsOf(t).find(x => x.key === key) || {}).label || '';
  const st = genState[k] = genState[k] || { prompt: lab ? String(lab) : '', refs: [], results: [], cur: -1, ar: String(imgArOf(t, key) || '4/3'), busy: false, msg: '' };
  st.ar = String(imgArOf(t, key) || '4/3'); st.msg = ''; st.rm = false; st.arTouched = false; genCtx = { id, key, st };
  const fc0 = genFrameCfg(t, key); st.fd = fc0 ? { fit: fc0.frame.fit || null, zoom: fc0.frame.zoom || null, ox: fc0.frame.ox || null, oy: fc0.frame.oy || null } : null;
  if (st.fd && !st.fd.fit && !srcOf(t, key)) st.fd.fit = 'width';      // ô chưa có ảnh: mặc định Fit ngang
  const d = document.getElementById('genDlg'); document.getElementById('genPrompt').value = st.prompt; genRender();
  if (!d.open) d.showModal(); document.getElementById('genPrompt').focus();
}
async function genRun() {
  const c = genCtx, st = c.st; st.prompt = document.getElementById('genPrompt').value.trim();
  if (!st.prompt) { st.msg = 'Nhập mô tả ảnh trước.'; genRender(); return; }
  st.busy = true; st.msg = ''; genRender();
  const prov = window.WSImageGen && typeof window.WSImageGen.generate === 'function' ? window.WSImageGen : GEN_DEMO;
  try { const r = await prov.generate({ prompt: st.prompt, refs: st.refs.slice(), ar: st.ar }); const src = typeof r === 'string' ? r : r && r.src; if (!src) throw new Error('Dịch vụ không trả ảnh'); st.results.push(src); (st.resAr = st.resAr || [])[st.results.length - 1] = st.ar; (st.resWH = st.resWH || [])[st.results.length - 1] = await imgWH(src); st.cur = st.results.length - 1; }
  catch (e) { st.msg = 'Không tạo được ảnh: ' + (e && e.message ? e.message : 'lỗi không rõ'); }
  st.busy = false; if (genCtx === c) genRender();
}
function imgWH(src) { return new Promise(ok => { const im = new Image(); im.onload = () => ok({ w: im.naturalWidth, h: im.naturalHeight }); im.onerror = () => ok(null); im.src = src; }); }
async function genUse() {
  const c = genCtx, st = c.st; if (st.busy) return;
  document.getElementById('genDlg').close();
  genApplyFrame(c);
  if (st.cur >= 0) { const src = st.results[st.cur], wh = (st.resWH || [])[st.cur] || (await imgWH(src)) || { w: 1, h: 1 };
    await dropImages(c.id, [{ type: 'image/png', name: 'gen.png' }], c.key, [{ src, w: wh.w, h: wh.h, ar: +(wh.w / wh.h).toFixed(4) }]); }
  else if (st.rm) removeImage(c.id, c.key);
}
{ const d = document.getElementById('genDlg'), $ = id => document.getElementById(id);
  document.getElementById('tree').addEventListener('click', e => { const b = e.target.closest('[data-gen]'); if (!b) return; const ed = b.closest('.ed'); if (ed) { e.stopPropagation(); openGen(ed.dataset.ed, b.dataset.gen); } }, true);
  extraActs['img-gen'] = (b, v) => openGen(curT(ws).id, v);
  $('genClose').onclick = () => d.close();
  $('genGo').onclick = genRun; $('genUse').onclick = genUse;
  $('genPrompt').addEventListener('input', e => { genCtx.st.prompt = e.target.value; });
  $('genPrompt').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); genRun(); } });
  d.addEventListener('keydown', e => e.stopPropagation());
  d.addEventListener('click', e => { const b = e.target.closest('#genFit [data-fit]'); if (b) genSetFrame('frame.fit', b.dataset.fit === 'normal' ? null : b.dataset.fit); });
  $('genZoom').addEventListener('input', e => { $('genZoomOut').textContent = e.target.value + '%'; $('genFr').style.setProperty('--z', e.target.value / 100); });
  $('genZoom').addEventListener('change', e => genSetFrame('frame.zoom', +e.target.value === 100 ? null : +e.target.value));
  $('genCenter').onclick = () => { const fd = genCtx.st.fd; if (fd) { fd.ox = fd.oy = fd.zoom = null; genRender(); } };
  // kéo ảnh trong khung để lệch tâm
  $('genFr').addEventListener('pointerdown', e => {
    const fr = $('genFr'); if (!fr.classList.contains('fit') || !genCtx) return; const fc = genCtx.st.fd && { frame: genCtx.st.fd }; if (!fc) return;
    e.preventDefault(); fr.setPointerCapture(e.pointerId); fr.classList.add('pan');
    const img = fr.querySelector('img'), pr = fr.getBoundingClientRect(), ir = img.getBoundingClientRect(), ox0 = fc.frame.ox || 0, oy0 = fc.frame.oy || 0, x0 = e.clientX, y0 = e.clientY;
    const mx = Math.abs(ir.width - pr.width) / 2 / ir.width * 100, my = Math.abs(ir.height - pr.height) / 2 / ir.height * 100; let nx = ox0, ny = oy0;
    const mv = ev => { nx = Math.round(Math.max(-mx, Math.min(mx, ox0 + (ev.clientX - x0) / ir.width * 100))); ny = Math.round(Math.max(-my, Math.min(my, oy0 + (ev.clientY - y0) / ir.height * 100))); fr.style.setProperty('--ox', nx); fr.style.setProperty('--oy', ny); };
    const up = () => { fr.removeEventListener('pointermove', mv); fr.removeEventListener('pointerup', up); fr.removeEventListener('pointercancel', up); fr.classList.remove('pan');
      if (nx !== ox0 || ny !== oy0) { const fd = genCtx.st.fd; fd.ox = nx || null; fd.oy = ny || null; genRender(); } };
    fr.addEventListener('pointermove', mv); fr.addEventListener('pointerup', up); fr.addEventListener('pointercancel', up); });
  d.addEventListener('click', e => {
    const v = e.target.closest('#genVs [data-v]'), rx = e.target.closest('[data-rx]'), ar = e.target.closest('#genAr [data-ar]');
    if (v) { genCtx.st.cur = +v.dataset.v; genRender(); }
    else if (rx) { genCtx.st.refs.splice(+rx.dataset.rx, 1); genRender(); }
    else if (ar) { genCtx.st.ar = ar.dataset.ar; genCtx.st.arTouched = true; genRender(); }
    else if (e.target.closest('#genAdd')) { $('genRefFile').value = ''; $('genRefFile').click(); }
  });
  $('genRefFile').addEventListener('change', async e => { const st = genCtx.st; const fs = [...e.target.files].slice(0, 4 - st.refs.length);
    for (const f of fs) { try { st.refs.push((await loadImg(f)).src); } catch (_) { st.msg = 'Không đọc được một ảnh tham chiếu.'; } } genRender(); });
  $('genUpload').onclick = () => { $('genUp').value = ''; $('genUp').click(); };
  $('genUp').addEventListener('change', async e => { const f = e.target.files[0]; if (!f) return; const c = genCtx, st = c.st;
    try { const src = (await loadImg(f)).src, ar = await new Promise(ok => { const im = new Image(); im.onload = () => ok(`${im.naturalWidth}/${im.naturalHeight}`); im.onerror = () => ok(null); im.src = src; });
      st.results.push(src); (st.resAr = st.resAr || [])[st.results.length - 1] = ar; (st.resWH = st.resWH || [])[st.results.length - 1] = await imgWH(src); st.cur = st.results.length - 1; st.rm = false;
      const t = ws.tasks.find(x => x.id === c.id); if (st.fd && !st.fd.fit && !srcOf(t, c.key)) st.fd.fit = 'width'; }
    catch (_) { st.msg = 'Không đọc được ảnh này.'; }
    if (genCtx === c) genRender(); });
  $('genRm').onclick = () => { const st = genCtx.st; st.rm = true; st.cur = -1; genRender(); };
  d.addEventListener('close', () => { genCtx = null; });
}
function tidyHints(root) {
  if (!root) return;
  root.querySelectorAll('.hint').forEach(h => {
    if (h.hasAttribute('data-na') || h.closest('.diag') || h.classList.contains('fold')) return;
    if ((h.textContent || '').trim().length > 64) { h.classList.add('fold'); h.setAttribute('role', 'button'); h.setAttribute('tabindex', '0'); h.title = 'Bấm để xem đầy đủ / thu gọn'; }
  });
}
{ const ri = renderInspector, rt = renderTree;
  renderInspector = function () { ri(); tidyHints(document.getElementById('insp')); };
  renderTree = function () { rt(); tidyHints(document.getElementById('tree')); }; }
document.addEventListener('click', e => { const h = e.target.closest('.hint.fold'); if (h) h.classList.toggle('x'); });
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.hint.fold')) { e.preventDefault(); e.target.classList.toggle('x'); } });
{ const hb = document.getElementById('helpBtn'), hp = document.getElementById('helpPop'), cc = document.getElementById('codesChk'), CK = 'wsEditor.codes.v1';
  const setCodes = on => { document.documentElement.classList.toggle('codes', on); cc.checked = on; };
  try { setCodes(localStorage.getItem(CK) === '1'); } catch (_) {}
  cc.addEventListener('change', () => { setCodes(cc.checked); try { localStorage.setItem(CK, cc.checked ? '1' : '0'); } catch (_) {} });
  const shut = () => { hp.hidden = true; hb.setAttribute('aria-expanded', 'false'); };
  hb.addEventListener('click', e => { e.stopPropagation(); hp.hidden = !hp.hidden; hb.setAttribute('aria-expanded', hp.hidden ? 'false' : 'true'); });
  document.addEventListener('click', e => { if (!hp.hidden && !hp.contains(e.target)) shut(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && !hp.hidden) { shut(); e.stopPropagation(); e.preventDefault(); } }, true); }
// Hộp hỏi xác nhận (thay confirm() của trình duyệt): trả về Promise<true|false>
// v85: bấm ra ngoài hộp hỏi (vùng nền mờ) = Hủy. Chỉ tính khi cả lúc nhấn và lúc thả đều ở ngoài, để kéo bôi chữ không làm đóng hộp
{ const d = document.getElementById('cfmDlg'); let downOut = false;
  const out = e => { const r = d.getBoundingClientRect(); return e.target === d && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom); };
  d.addEventListener('mousedown', e => { downOut = out(e); });
  d.addEventListener('click', e => { if (downOut && out(e) && d.open) d.close(); downOut = false; }); }
function askConfirm(title, msg, yes) {
  const d = document.getElementById('cfmDlg'); document.getElementById('cfmTitle').textContent = title; document.getElementById('cfmMsg').textContent = msg || ''; document.getElementById('cfmYes').textContent = yes || 'Đồng ý';
  return new Promise(res => { const done = v => { d.removeEventListener('close', onc); document.getElementById('cfmYes').onclick = document.getElementById('cfmNo').onclick = null; if (d.open) d.close(); res(v); }, onc = () => done(false);
    document.getElementById('cfmYes').onclick = () => done(true); document.getElementById('cfmNo').onclick = () => done(false); d.addEventListener('close', onc); d.showModal(); document.getElementById('cfmNo').focus(); });
}
/* ================= v81: Kiến trúc trình bày mới (T bố cục · Q dạng câu hỏi · khối G) =================
   T = vị trí ảnh chung (G1) so với bài đọc (G2) / câu hỏi (G3): 4 kiểu. Q = dạng câu hỏi, gồm cách trả lời và cách xếp câu: 12 kiểu.
   Dữ liệu không đổi: T và Q SUY RA từ layout.task, content và answer (mã T1–T9, A1–A8 vẫn là dữ liệu bên trong), nên phiếu cũ mở ra giống v80.
   Chỉ khi Task không có chỗ trả lời thì dạng câu hỏi được nhớ ở t.q (không suy ra được). */
const TN = { T1: 'Xếp dọc', T2: 'Ảnh trái', T3: 'Ảnh phải', T4: 'Ảnh trong bài đọc' };
const TN_HINT = { T1: 'Ảnh (nếu có) ở trên, rồi bài đọc, câu hỏi', T2: 'Ảnh một cột bên trái, chữ cột bên phải', T3: 'Ảnh một cột bên phải, chữ cột bên trái', T4: 'Bài đọc chạy bao quanh ảnh' };
const TN_OLD = { T2: 'T2', T3: 'T3', T4: 'T8' };
const T1FAM = ['T1', 'T4', 'T5', 'T6', 'T7', 'T9'];
const tnOf = t => ({ T2: 'T2', T3: 'T3', T8: 'T4' })[layoutOf(t)] || 'T1';
function tnReasons(t) { const w = layoutReasons(t); return { T1: '', T2: w.T2 || '', T3: w.T3 || '', T4: w.T8 ? 'Chỉ dùng cho bài đọc có ảnh chung' : '' }; }
// Bố cục bên trong ứng với "Xếp dọc": giữ cách xếp câu đang dùng nếu được
function t1Old(t) {
  const L = layoutOf(t); if (T1FAM.includes(L)) return L;
  const k = ck(t); if (k === 'items') return 'T5'; if (k === 'pairs') return 'T7'; if (k === 'table') return 'T9'; if (k === 'empty') return 'T1';
  if (t.answer.layout === 'A6' && k === 'questions') return 'T4'; return t.image ? 'T1' : 'T6';
}
function tnTarget(t, v) { if (v === 'auto') return 'auto'; if (TN_OLD[v]) return TN_OLD[v]; return T1FAM.includes(autoLayout(t)) && t.layout.task === 'auto' ? 'auto' : t1Old(t); }
const QN = { Q1: 'Điền từ', Q2: 'Viết câu', Q3: 'Chọn A/B/C', Q4: 'Chọn trong câu', Q5: 'Đúng / Sai', Q6: 'Nhìn ảnh viết', Q7: 'Chọn ảnh', Q8: 'Nối', Q9: 'Tô chữ', Q10: 'Bảng', Q11: 'Lưới', Q12: 'Viết tự do' };
const QHINT = {
  Q1: 'Gạch ___ trong câu, hoặc ô chữ cái', Q2: 'Câu hỏi + dòng kẻ để viết', Q3: 'Mỗi câu có lựa chọn A, B, C', Q4: 'Viết {a|b} trong câu; học sinh gạch / khoanh. Có nhãn A–D dưới đoạn gạch chân (tìm lỗi sai)',
  Q5: 'Khoanh Đúng / Sai (2–3 lựa chọn, nhãn tự đặt), hoặc ô tick', Q6: 'Mỗi câu một ảnh, viết từ / câu', Q7: 'Mỗi câu 2–4 ảnh, tick ảnh đúng', Q8: 'Vế trái nối với vế phải',
  Q9: 'Từ lặp lại để tô theo nét', Q10: 'Ô chữ / ô trống để viết / ô tick; cũng dùng cho phân loại, story map, KWL', Q11: 'Ô chữ giải đố, lưới chữ tìm từ', Q12: 'Không có câu: dòng kẻ (tới 20 dòng) hoặc khung trống để vẽ'
};
const QORDER = Object.keys(QN);
const isFreeW = t => { const it = its(t); return it.length === 1 && !String(it[0].text || '').trim() && !it[0].opts && !it[0].img && t.layout.num === 'off'; };
const isGridTbl = t => { const o = t.layout.table || {}; return !!o.cross || (o.head === false && o.rowHead === false); };
function qDerived(t) {
  const k = ck(t), a = t.answer;
  if (k === 'table') return isGridTbl(t) ? 'Q11' : 'Q10';
  if (k === 'empty') return null;
  if (k === 'pairs') return 'Q8';
  if (k === 'items') return t.content.variant === 'multi' ? 'Q7' : 'Q6';
  if (k === 'trace' || a.kind === 'trace') return 'Q9';
  if (a.kind === 'tf' || a.kind === 'tick') return 'Q5';
  if (a.kind === 'choice') return a.attach === 'inline' ? 'Q4' : 'Q3';
  if (a.kind === 'match') return 'Q8';
  if (a.kind === 'sentence') return isFreeW(t) ? 'Q12' : 'Q2';
  if (a.kind === 'word') return 'Q1';
  return null;
}
function qOf(t) { const d = qDerived(t); if (d) return d; if (ck(t) === 'empty') return QN[t.q] ? t.q : null; return QN[t.q] ? t.q : (ck(t) === 'dialogue' ? 'Q1' : 'Q2'); }
const hasAns = t => t.answer.kind !== 'none' || ['table'].includes(ck(t));
function qReasons(t) {
  const k = ck(t), r = {};
  QORDER.forEach(q => {
    let why = '';
    if (k === 'passage' && !['Q1', 'Q2', 'Q3', 'Q5'].includes(q)) why = 'Bài đọc đi với Điền từ, Viết câu, Chọn A/B/C hoặc Đúng / Sai';
    else if (k === 'dialogue' && ['Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12'].includes(q)) why = 'Hội thoại (có người nói) đi với Q1–Q5; tắt Người nói trước';
    r[q] = why;
  });
  return r;
}
// Đổi dạng câu hỏi: giữ chữ các câu, ảnh chung, bài đọc, khung từ, khối tự do, nối Task; đổi cấu trúc câu và chỗ trả lời
function setQ(t, q) {
  const k0 = ck(t);
  if (!QN[q] || qReasons(t)[q]) return false;
  const brk = t.layout.break, num = t.layout.num, keepT = TN_OLD[tnOf(t)] && !layoutReasons(t)[layoutOf(t)] ? layoutOf(t) : null;
  const toList = () => {
    const c = t.content;
    if (c.form === 'table') { t.content = { form: 'list', items: (c.rows || []).map(r => ({ text: typeof r.head === 'string' ? r.head : (r.head && r.head.text) || '' })) }; t.layout.table = null; }
    const c2 = t.content; if (c2.list === false) { delete c2.list; if (c2.listAns) delete c2.listAns; }
    c2.items = c2.items || []; if (!c2.items.filter(x => !x.gt).length) c2.items.push({ text: '' }, { text: '' }, { text: '' });
    ensureIds(t);
  };
  const noImgs = () => { its(t).forEach(x => { if (x.img && !String(x.text || '').trim() && !x.lines) { x.text = x.img; delete x.len; } }); if (its(t).some(x => x.img || x.imgs || x.lines)) toggleField(t, 'img', false); };
  const toTable = () => {
    const c = t.content; if (c.form === 'table') return;
    const rows = its(t).filter(x => !x.gt).map(x => ({ head: x.text != null ? x.text : x.pair && x.pair.l ? (x.pair.l.text || '') : (x.lines || []).join(' '), cells: ['', ''] }));
    t.content = { form: 'table', corner: '', cols: ['', ''], rows: rows.length ? rows : [{ head: '', cells: ['', ''] }, { head: '', cells: ['', ''] }] };
    if (c.lead) t.content.lead = c.lead; ensureRowIds(t); t.answer = { kind: 'none', attach: 'item', layout: null, params: {} };
  };
  if (['Q10', 'Q11'].includes(q)) {
    toTable(); t.layout.table = Object.assign({}, t.layout.table || {});
    if (q === 'Q11') { const c = t.content; if (!isGridTbl(t)) { t.layout.table.cross = true; if (!c.rows.some(r => r.cells.some(v => typeof v === 'string' && v.trim().length === 1))) { c.cols = ['', '', '', '', '']; c.rows = ['#C#S#', '#A#U#', '#TEN#'].map(l => ({ head: '', cells: crossParse([l])[0] })); ensureRowIds(t); } } }
    else { delete t.layout.table.cross; if (t.layout.table.head === false && t.layout.table.rowHead === false) { delete t.layout.table.head; delete t.layout.table.rowHead; } }
    if (!Object.keys(t.layout.table).length) t.layout.table = null;
  } else {
    toList();
    if (q !== 'Q4') its(t).forEach(x => { if (!x.gt && /\{…\|…\}/.test(x.text || '')) x.text = x.text.replace(/\s*\{…\|…\}\s*$/, '').replace(/\{…\|…\}/g, '___'); });   // rời Q4: bỏ chỗ giữ chỗ {…|…} chưa điền (cuối câu: bỏ; giữa câu: về ___)
    if (q === 'Q6') { if (ck(t) !== 'items' || t.content.variant === 'multi') { if (t.content.variant === 'multi') toggleField(t, 'multi', false); else toggleField(t, 'img', true); } if (!['word', 'sentence', 'choice'].includes(t.answer.kind)) setKind(t, 'word'); }
    else if (q === 'Q7') { if (ck(t) !== 'items') toggleField(t, 'img', true); if (t.content.variant !== 'multi') toggleField(t, 'multi', true); setKind(t, 'tick'); }
    else {
      if (q !== 'Q8' && its(t).some(x => x.pair)) setKind(t, 'word');
      if (ck(t) === 'items') noImgs();
      if (q === 'Q8') setKind(t, 'match');
      else if (q === 'Q9') setKind(t, 'trace');
      else if (q === 'Q5') { if (t.answer.kind !== 'tf' && t.answer.kind !== 'tick') setKind(t, 'tf'); }
      else if (q === 'Q2') setKind(t, 'sentence');
      else if (q === 'Q1') setKind(t, 'word');
      else if (q === 'Q3') { its(t).forEach(x => { if (!x.gt && !x.opts) { const m = /\{([^{}|]+(?:\|[^{}|]+)+)\}/.exec(x.text || ''); x.opts = m ? m[1].split('|').map(s => s.trim()) : ['', '', '']; if (m) x.text = (x.text || '').replace(m[0], '___'); } }); setKind(t, 'choice'); t.answer.attach = 'item'; t.answer.layout = 'A4'; }
      else if (q === 'Q4') { const real = its(t).filter(x => !x.gt), ul = real.some(x => /<u>/.test(x.text || '')) && !real.some(x => hasChoiceMarkup(x.text || '') || (x.opts && x.opts.some(o => String(o).trim())));   // câu có <u>…</u>, chưa có {a|b}: tìm lỗi sai, nhãn A–D dưới đoạn gạch chân
        if (!ul) its(t).forEach(x => { if (!x.gt && x.opts && x.opts.some(o => String(o).trim()) && !hasChoiceMarkup(x.text || '')) { const g = `{${x.opts.filter(o => String(o).trim()).join('|')}}`; x.text = /___/.test(x.text || '') ? x.text.replace('___', g) : ((x.text || '').trim() + ' ' + g).trim(); } else if (!x.gt && !hasChoiceMarkup(x.text || '')) { x.text = /___/.test(x.text || '') ? x.text.replace('___', '{…|…}') : ((x.text || '').trim() + ' {…|…}').trim(); } delete x.opts; });
        setKind(t, 'choice'); if (ul) { its(t).forEach(x => { delete x.opts; }); t.answer.params.ulab = true; } t.answer.attach = 'inline'; t.answer.layout = 'A4'; }
      else if (q === 'Q12') { const ex = its(t).find(x => !x.gt); t.content.items = [{ id: (ex && ex.id) || 'q1', text: '' }]; setKind(t, 'sentence'); t.layout.num = 'off'; t.answer.params = Object.assign({}, t.answer.params, { lines: Math.max(8, t.answer.params.lines || 1) }); }
    }
  }
  if (q !== 'Q12' && k0 !== 'table' && t.layout.num === 'off' && isFreeW(t)) t.layout.num = null; else if (q !== 'Q12') t.layout.num = num ?? null;
  // Bố cục: về Tự động (trừ Ảnh trái / phải / trong bài đọc còn dùng được), giữ trạng thái nối Task
  const fit = t.layout.frame && t.layout.frame.fit;
  Object.assign(t.layout, { task: 'auto', split: null, cols: null, cw: null, width: null, align: null, valign: null, dir: null, cells: null, break: brk });
  if (keepT && !layoutReasons(t)[keepT]) t.layout.task = keepT;
  t.layout.frame = fit ? { fit } : (t.layout.frame || {});
  t.q = q; normAnswer(t); qTidy(t); return true;
}
// t.q chỉ giữ khi không suy ra được (Task không có chỗ trả lời)
function qTidy(t) { if (t.q && (!QN[t.q] || qDerived(t) === t.q || (qDerived(t) && t.answer.kind !== 'none'))) delete t.q; }
// Công tắc "Có chỗ trả lời": tắt = chỉ hiển thị câu (từ điển tranh, nội dung đọc); bật lại về dạng đã nhớ
function setHasAns(t, on) {
  if (!on) { const q = qOf(t); if (t.answer.kind === 'none') return; t.q = q; t.content.noAns = clone(t.answer); setKind(t, 'none'); return; }
  const prev = t.content.noAns; delete t.content.noAns;
  if (prev && kindsOk(t).includes(prev.kind)) { t.answer = prev; normAnswer(t); }
  else setQ(t, t.q || 'Q2');
  qTidy(t);
}
// Cách trả lời (trong Q): mỗi lựa chọn là một thay đổi trên answer, không có mã A trên giao diện
function qStyles(t) {
  const q = qOf(t), a = t.answer, p = a.params || {}, A = a.layout, out = [], S = (id, name, on, fn, dis) => out.push({ id, name, on, fn, dis: dis || '' });
  if (a.kind === 'none') return out;
  const gapIn = attachOpts(t).includes('inline') && a.kind === 'word';
  if (q === 'Q1') { S('gap', gapIn ? 'Gạch trong câu' : 'Gạch dưới câu', A === 'A2', x => { x.answer.layout = 'A2'; x.answer.attach = gapIn ? 'inline' : 'item'; }); S('box', 'Ô chữ cái', A === 'A3', x => { x.answer.layout = 'A3'; x.answer.attach = 'item'; }); }
  // v95: Q2 không còn hai nút Dòng kẻ / Gạch cuối câu; thay bằng Điểm bắt đầu · Chiều dài · Số hàng (qOptsHtml, lệnh q2)
  if (q === 'Q3') { [['dot', 'a. b. c.'], ['circle', 'Khoanh ⓐ'], ['box', '☐ Ô tick']].forEach(([v, n]) => S(v, n, (p.lab || 'dot') === v, x => { x.answer.params.lab = v === 'dot' ? null : v; })); }
  if (q === 'Q4') { const tx = choiceTexts(t); if (tx.some(hasChoiceMarkup)) S('pick', 'Gạch / khoanh từ', !p.ulab, x => { delete x.answer.params.ulab; }); if (tx.some(v => /<u>/.test(v))) S('ulab', 'Nhãn A–D dưới đoạn gạch chân', !!p.ulab, x => { x.answer.params.ulab = true; }); }
  if (q === 'Q5') { S('tf', 'Khoanh Đúng / Sai', A === 'A6', x => { if (x.answer.kind !== 'tf') setKind(x, 'tf'); }); S('tick', 'Ô tick', A === 'A5', x => { if (x.answer.kind !== 'tick') setKind(x, 'tick'); }); }
  if (q === 'Q6') { S('gap', 'Gạch', a.kind === 'word' && A === 'A2', x => { if (x.answer.kind !== 'word') setKind(x, 'word'); x.answer.layout = 'A2'; }); S('box', 'Ô chữ cái', A === 'A3', x => { if (x.answer.kind !== 'word') setKind(x, 'word'); x.answer.layout = 'A3'; }); S('line', 'Dòng kẻ', a.kind === 'sentence', x => { if (x.answer.kind !== 'sentence') setKind(x, 'sentence'); x.answer.layout = 'A1'; });
    if (hasMarkup(t)) S('pick', 'Chọn trong câu', a.kind === 'choice', x => { setKind(x, 'choice'); }); }
  if (q === 'Q7') S('tick', 'Tick ảnh', true, () => {});
  if (q === 'Q8') S('dot', 'Chấm nối', true, () => {});
  if (q === 'Q9') S('trace', 'Dòng tô', true, () => {});
  if (q === 'Q12') { S('line', 'Dòng kẻ', p.frame !== 'box', x => { delete x.answer.params.frame; delete x.answer.params.boxH; }); S('box', 'Khung trống để vẽ', p.frame === 'box', x => { x.answer.params.frame = 'box'; }); }
  return out;
}
// Cách xếp câu (trong Q): đổi bố cục bên trong mà vẫn ở "Xếp dọc"
function qArr(t) {
  const q = qOf(t), L = layoutOf(t), out = [];
  if (tnOf(t) !== 'T1') return out;
  if (q === 'Q5' && (ck(t) === 'questions' || (ck(t) === 'passage' && !t.image))) out.push(['T4', 'Cột bên phải', L === 'T4'], [t.image ? 'T1' : 'T6', 'Ngay dưới câu', L !== 'T4']);
  if ((q === 'Q6' || q === 'Q7') && ck(t) === 'items' && !its(t).some(x => x.lines)) out.push(['T5', 'Lưới ô', L === 'T5'], ['T6', 'Danh sách', L === 'T6']);
  return out;
}
const LABS = { tf: ['T', 'F'], tfw: ['True', 'False'], yn: ['Yes', 'No'], ng: ['T', 'F', 'NG'], rw: ['Right', 'Wrong'] };
const labsKey = p => { const l = (p.labs || []).join('|'); return Object.keys(LABS).find(k => LABS[k].join('|') === l) || (l ? 'x' : 'tf'); };
// Hình xem trước của Q (rê chuột lên nút)
const QPV = {
  Q1: '<p><i>1</i>I like <u class="g"></u> .</p><p><i>2</i>She is my <u class="g"></u> .</p>',
  Q2: '<p><i>1</i>Where do you live?</p><p class="l"></p><p><i>2</i>What do you like?</p><p class="l"></p>',
  Q3: '<p><i>1</i>I ___ to school.</p><p class="o"><b>A</b>go <b>B</b>goes <b>C</b>going</p>',
  Q4: '<p><i>1</i>It is <b>big</b> / <b>small</b>.</p><p><i>2</i>They <b>was</b> / <b>were</b> late.</p>',
  Q5: '<p><i>1</i>The cat is black. <span class="tf"><b>T</b><b>F</b></span></p><p><i>2</i>There are two dogs. <span class="tf"><b>T</b><b>F</b></span></p>',
  Q6: '<div class="ig"><span><s></s><u class="g"></u></span><span><s></s><u class="g"></u></span><span><s></s><u class="g"></u></span></div>',
  Q7: '<p><i>1</i>What did Tom eat?</p><div class="ig"><span><s></s>☐</span><span><s></s>☐</span><span><s></s>☐</span></div>',
  Q8: '<p><i>1</i>apple <em>•</em> <em>•</em> a red</p><p><i>2</i>sky <em>•</em> <em>•</em> b blue</p>',
  Q9: '<p><i>1</i>cat <span class="tr">cat cat cat</span></p><p><i>2</i>dog <span class="tr">dog dog dog</span></p>',
  Q10: '<table><tr><td></td><td>Mon</td><td>Tue</td></tr><tr><td>Mia</td><td>swim</td><td></td></tr></table>',
  Q11: '<div class="cw"><b>1</b><b></b><b></b><b></b><b>2</b><b></b></div>',
  Q12: '<p class="l"></p><p class="l"></p><p class="l"></p><p class="l"></p>'
};
const qIcon = q => `<span class="qpv" aria-hidden="true">${QPV[q] || ''}</span>`;
// Bộ chọn T (4 kiểu + Tự động) và Q (12 kiểu); act = 'tn' / 'q' (Inspector) hoặc eact (cột trái)
function tPickerHtml(t, side) {
  const why = tnReasons(t), cur = t.layout.task === 'auto' ? 'auto' : tnOf(t), at = side === 'tree' ? 'data-eact' : 'data-act', IC = { T1: 'T1', T2: 'T2', T3: 'T3', T4: 'T8' };
  const btn = (v, n, ic, dis, hint) => `<button class="lay tnb ${cur === v ? 'on' : ''}" ${at}="tn" data-v="${v}" ${dis ? `disabled title="${esc(dis)}"` : `title="${esc(hint)}"`}>${layIcon(ic)}<span>${n}</span>${v !== 'auto' ? cd(v) : `<small class="cd">${TN[tnOf(t)]}</small>`}</button>`;
  const ok = Object.keys(TN).filter(v => !why[v]), locked = Object.keys(TN).filter(v => why[v]);
  return `<h3>Bố cục Task</h3><div class="lay-grid tn-grid">${btn('auto', 'Tự động', IC[tnOf(t)], '', 'Hệ thống tự chọn')}${ok.map(v => btn(v, TN[v], IC[v], '', TN_HINT[v])).join('')}</div>` +
    (locked.length ? `<details class="why"><summary>Bố cục chưa dùng được (${locked.length})</summary><ul>${locked.map(v => `<li><b>${TN[v]}</b>: ${esc(why[v])}</li>`).join('')}</ul></details>` : '');
}
function qPickerHtml(t, side) {
  const cur = qOf(t), why = qReasons(t), at = side === 'tree' ? 'data-eact' : 'data-act';
  return `<h3>Dạng câu hỏi</h3><div class="q-grid">${QORDER.map(q => `<button class="qbt ${cur === q ? 'on' : ''}" ${at}="q" data-v="${q}" ${why[q] ? `disabled title="${esc(why[q])}"` : `title="${esc(QN[q] + ': ' + QHINT[q])}"`}><b>${QN[q]}</b>${cd(q)}${qIcon(q)}</button>`).join('')}</div>`;
}
function qOptsHtml(t, side) {
  const at = side === 'tree' ? 'data-eact' : 'data-act', st = qStyles(t), ar = qArr(t), q = qOf(t), p = t.answer.params || {}, ha = t.answer.kind !== 'none', tbl = ck(t) === 'table';
  let h = '';
  if (!tbl && ck(t) !== 'empty') h += `<div class="field"><span>Có chỗ trả lời</span><div class="seg"><button ${at}="hasans" data-v="1" class="${ha ? 'on' : ''}">Có</button><button ${at}="hasans" data-v="0" class="${!ha ? 'on' : ''}">Không (chỉ hiển thị)</button></div></div>`;
  if (st.length > 1) h += `<div class="field"><span>Cách trả lời</span><div class="seg wrapseg">${st.map(x => `<button ${at}="qst" data-v="${x.id}" class="${x.on ? 'on' : ''}">${x.name}</button>`).join('')}</div></div>`;
  if (q === 'Q2' && ha && p.frame !== 'box') {   // v95
    const c = q2cfg(t), B = (v, lab, on) => `<button ${at}="q2" data-v="${v}" class="${on ? 'on' : ''}">${lab}</button>`;
    h += `<div class="field q2f"><span>Điểm bắt đầu</span><label class="q2ck"><input type="checkbox" ${at}="q2" data-v="start:${c.start === 'end' ? 'below' : 'end'}" ${c.start === 'end' ? 'checked' : ''}> Từ cuối câu hỏi</label></div>`;
    h += `<div class="field q2f"><span>Chiều dài</span><div class="seg">${B('len:fixed', 'Cố định', c.len === 'fixed')}${B('len:fill', 'Hết dòng', c.len === 'fill')}</div>${c.len === 'fixed' ? `<div class="seg q2n">${B('mm:-5', '−', false)}<b data-q2v="mm">${c.mm} mm</b>${B('mm:+5', '+', false)}</div>` : ''}</div>`;
    h += `<div class="field q2f"><span>Số hàng</span><div class="seg q2n">${B('ln:-1', '−', false)}<b data-q2v="ln">${c.lines}</b>${B('ln:+1', '+', false)}</div></div>`;
    h += `<p class="hint">${c.start === 'end' ? (c.lines > 1 ? `Gạch ngay sau câu hỏi, thêm ${c.lines - 1} hàng bên dưới.` : 'Gạch ngay sau câu hỏi, cùng hàng.') : `${c.lines} hàng bên dưới câu hỏi.`}</p>`;
  }
  if (q === 'Q5' && t.answer.layout === 'A6') { const k = labsKey(p); h += `<div class="field"><span>Nhãn lựa chọn</span><div class="seg wrapseg">${Object.keys(LABS).map(x => `<button ${at}="labs" data-v="${x}" class="${k === x ? 'on' : ''}">${LABS[x].join(' / ')}</button>`).join('')}</div></div>`; }
  if (q === 'Q5' && t.answer.layout === 'A6') h += `<div class="field"><span>Vị trí T / F</span><div class="seg"><button ${at}="tfrow" data-v="0" class="${p.row ? '' : 'on'}">Dưới câu</button><button ${at}="tfrow" data-v="1" class="${p.row ? 'on' : ''}">Cùng hàng với câu</button></div></div>`;
  if (['A1', 'A8'].includes(t.answer.layout) && p.frame !== 'box') h += `<div class="field"><span>Kiểu dòng</span><div class="seg"><button ${at}="ruling" data-v="" class="${p.ruling !== '4' ? 'on' : ''}">Dòng thường</button><button ${at}="ruling" data-v="4" class="${p.ruling === '4' ? 'on' : ''}">Bốn ô li (tập viết)</button></div></div>`;
  if (ar.length) h += `<div class="field"><span>Cách xếp câu</span><div class="seg">${ar.map(([v, n, on]) => `<button ${at}="qarr" data-v="${v}" class="${on ? 'on' : ''}">${n}</button>`).join('')}</div></div>`;
  if (tbl) h += `<p class="hint">Chỗ trả lời nằm trong ô: ô để trống = ô viết, ✓ = ô tick.</p>`;
  return h;
}
// Lệnh dùng chung cho Inspector (data-act) và cột trái (data-eact)
function qCmd(t, act, v) {
  if (act === 'tn') { const L = tnTarget(t, v), fit = t.layout.frame.fit; Object.assign(t.layout, { task: L, split: null, cols: null, cw: null, width: null, align: null, valign: null }); t.layout.frame = fit ? { fit } : {}; return v === 'auto' ? 'Bố cục: Tự động' : 'Bố cục: ' + TN[v]; }
  if (act === 'q') { return setQMem(t, v) ? 'Dạng câu hỏi: ' + QN[v] : null; }
  if (act === 'hasans') { setHasAns(t, v === '1'); return v === '1' ? 'Có chỗ trả lời' : 'Không có chỗ trả lời (chỉ hiển thị câu)'; }
  if (act === 'qst') { const s = qStyles(t).find(x => x.id === v); if (s) { s.fn(t); normAnswer(t); } return s ? 'Cách trả lời: ' + s.name : null; }
  if (act === 'q2') { const [k, x] = v.split(':'), c = q2cfg(t);
    if (k === 'start') q2set(t, { start: x }); else if (k === 'len') q2set(t, { len: x }); else if (k === 'mm') q2set(t, { mm: c.mm + (+x), len: 'fixed' }); else if (k === 'ln') q2set(t, { lines: c.lines + (+x) });
    const n = q2cfg(t); return `Q2: ${n.start === 'end' ? 'từ cuối câu' : 'dòng dưới'} · ${n.len === 'fill' ? 'hết dòng' : n.mm + ' mm'} · ${n.lines} hàng`; }
  if (act === 'tfrow') { if (v === '1') t.answer.params.row = true; else delete t.answer.params.row; return v === '1' ? 'T / F cùng hàng với câu' : 'T / F dưới câu'; }
  if (act === 'labs') { if (v === 'tf') delete t.answer.params.labs; else t.answer.params.labs = LABS[v].slice(); return 'Nhãn: ' + LABS[v].join(' / '); }
  if (act === 'ruling') { if (v === '4') t.answer.params.ruling = '4'; else delete t.answer.params.ruling; return v === '4' ? 'Dòng kẻ bốn ô li' : 'Dòng kẻ thường'; }
  if (act === 'qarr') { const fit = t.layout.frame.fit; Object.assign(t.layout, { task: v, split: null, cols: null, cw: null, width: null, align: null, valign: null }); t.layout.frame = fit ? { fit } : {}; return 'Đã đổi cách xếp câu'; }
  return null;
}
// v98: bảng chọn đáp án: ô chữ ↔ ô tích + chữ (giữ ô trống, ô điền, ảnh); "một ô đúng mỗi hàng" giữ ô đúng đầu tiên
const tkCells = t => (t.content.rows || []).flatMap(r => r.cells);
const tkHasText = t => tkCells(t).some(v => (typeof v === 'string' && v.trim()) || (v && v.tick && v.text));
const tkOn = t => tkCells(t).some(v => v && v.tick && v.text);
function tkAll(t, on) { (t.content.rows || []).forEach(r => { r.cells = r.cells.map(v => on ? (typeof v === 'string' && v.trim() ? { tick: 1, text: v } : v) : (v && v.tick && v.text ? v.text : v)); }); if (on && (t.layout.table || {}).one) tkOne(t); }
function tkOne(t) { (t.content.rows || []).forEach(r => { let f = false; r.cells.forEach(v => { if (v && v.tick && v.ok) { if (f) delete v.ok; f = true; } }); }); }
// v99: ảnh trong ô bảng: bật / gỡ từng ô (giữ chữ), hoặc cả bảng: Không / Cột đầu / Mọi ô có chữ
const cimOn = v => typeof v === 'string' ? (v.trim() ? { img: v.trim(), text: v } : { img: 'ảnh' }) : v;
const cimOff = v => v && typeof v === 'object' && v.img && !v.tick && v.ans == null ? (v.text || '') : v;
function cimToggle(t, i, j) { const r = t.content.rows[i]; if (!r) return; const g = j === 'h' ? r.head : r.cells[+j], nv = g && typeof g === 'object' && g.img ? cimOff(g) : cimOn(g); if (j === 'h') r.head = nv; else r.cells[+j] = nv; ensureRowIds(t); }
const cimMode = t => { const R = t.content.rows || []; return R.some(r => r.cells.some(v => v && typeof v === 'object' && v.img)) ? 'all' : R.some(r => r.head && typeof r.head === 'object' && r.head.img) ? 'first' : 'none'; };
function cimSet(t, m) { (t.content.rows || []).forEach(r => { r.head = m === 'none' ? cimOff(r.head) : cimOn(r.head); r.cells = r.cells.map(v => m === 'all' ? (typeof v === 'string' && v.trim() ? cimOn(v) : v) : cimOff(v)); }); if (m === 'first') t.layout.table = Object.assign({}, t.layout.table, { rowHead: true }); ensureRowIds(t); }
function tblo(t, v) { const [k, x] = v.split(':'), o = t.layout.table = Object.assign({}, t.layout.table || {});
  if (k === 'nm') { o.nm = x; delete o.num; } else if (k === 'tk') { tkAll(t, x === '1'); } else if (k === 'im') { cimSet(t, x); } else if (k === 'one') { if (x === '1') { o.one = true; tkOne(t); } else delete o.one; } else if (k === 'fr') { o.fr = x === '1' ? 'zebra' : 'none'; if (x === '1') o.fc = false; } else o[k] = x === '1';
  return { head: 'Hàng tiêu đề cột', fh: 'Tô nền hàng tiêu đề', fr: 'Tô hàng xen kẽ', rowHead: 'Cột tiêu đề hàng', nm: 'Số thứ tự', tk: 'Hiện ô tích trước chữ', one: 'Một ô đúng mỗi hàng', im: 'Ảnh trong bảng' }[k] + ': ' + (k === 'nm' ? { out: 'ngoài bảng', in: 'trong cột đầu', off: 'tắt' }[x] : k === 'im' ? { none: 'không', first: 'cột đầu', all: 'mọi ô có chữ' }[x] : x === '1' ? 'bật' : 'tắt'); }
const Q_ACTS = ['tn', 'q', 'hasans', 'qst', 'labs', 'tfrow', 'ruling', 'qarr', 'q2'];
Q_ACTS.forEach(a => { extraActs[a] = (b, v) => { let msg = null; commit(w => { msg = qCmd(curT(w), a, v); }, null, () => { if (msg) toast(msg); }); }; });

// ---- Khối (G): thêm / xóa thống nhất ----
const BLK_NAME = { G1: 'Ảnh chung', G1b: 'Ảnh thứ hai', G2: 'Bài đọc', intro: 'Lời dẫn', G3: 'Câu hỏi', G4: 'Khung từ chữ', G4i: 'Khung từ ảnh', GTt: 'Khối chữ', GTi: 'Khối ảnh' };
function blkAddable(t) {
  const k = ck(t), c = t.content, o = [];
  if (!t.image) o.push('G1'); else if (!t.image.two) o.push('G1b');
  if (c.form !== 'table' && !(c.lead && c.lead.kind === 'passage') && ['questions', 'empty'].includes(k)) o.push('G2');
  if (c.form !== 'table' && !c.lead && k === 'dialogue') o.push('intro');
  if (k === 'empty') o.push('G3');
  if (!t.wordBank && k !== 'empty') o.push('G4', 'G4i');
  o.push('GTt', 'GTi');
  return o;
}
function blkAdd(t, v) {
  const c = t.content;
  if (v === 'G1') { t.image = { label: 'ảnh', size: 'medium' }; return; }
  if (v === 'G1b') { t.image.two = true; t.image.label2 = 'ảnh 2'; return; }
  if (v === 'G2') { if (ck(t) === 'empty') { delete c.list; c.items = (c.items || []).length ? c.items : [{ text: '' }]; ensureIds(t); if (t.answer.kind === 'none') setKind(t, 'sentence'); } c.lead = { kind: 'passage', text: '' }; normAnswer(t); return; }
  if (v === 'intro') { c.lead = { kind: 'text', text: '' }; return; }
  if (v === 'G3') { toggleField(t, 'list', true); if (!(t.content.items || []).length) { t.content.items = [{ text: '' }, { text: '' }, { text: '' }]; ensureIds(t); } if (t.answer.kind === 'none') setKind(t, 'word'); normAnswer(t); return; }
  if (v === 'G4' || v === 'G4i') { t.wordBank = { words: v === 'G4i' ? ['', '', ''] : [], placement: 'top', style: 'chips', label: 'lower' }; if (v === 'G4i') { t.wordBank.kind = 'image'; t.wordBank.words = ['ảnh A', 'ảnh B', 'ảnh C']; } return; }
  if (v === 'GTt' || v === 'GTi') { t.extras = t.extras || []; const nid = newId(new Set(t.extras.map(y => y.id)), 'x'); t.extras.push(v === 'GTi' ? { id: nid, kind: 'image', pos: 'bottom', label: 'ảnh' } : { id: nid, kind: 'text', pos: 'bottom', text: '' }); return nid; }
}
function blkDel(t, g, item) {
  const c = t.content, U = k => { ['uploads', 'upMeta', 'imgAr'].forEach(f => { if (t[f]) delete t[f][k]; }); };
  if (g === 'G1') { delete t.image; U('G1'); U('G1b'); t.layout.frame = {}; return 'Đã xóa ảnh chung'; }
  if (g === 'G1b') { if (t.image) { delete t.image.two; delete t.image.label2; } U('G1b'); return 'Đã xóa ảnh thứ hai'; }
  if (g === 'G2') { if (c.lead) { delete c.lead; delete t.layout.order; normAnswer(t); return 'Đã xóa bài đọc'; } return null; }
  if (g === 'intro') { if (c.lead && c.lead.kind === 'text') delete c.lead; return 'Đã xóa lời dẫn'; }
  if (g === 'G4') { if (t.wordBank) { (t.wordBank.words || []).forEach((_, i) => U('B.' + i)); delete t.wordBank; } return 'Đã xóa khung từ'; }
  if (g === 'G3') { if (item) { const i = its(t).findIndex(x => x.id === item); if (i < 0) return null; dropOrphans(t, item); t.content.items.splice(i, 1); normAnswer(t); return `Đã xóa câu`; } toggleField(t, 'list', false); return 'Đã tắt danh sách câu (giữ câu để bật lại)'; }
  if (g === 'GT') { dropOrphans(t, item); t.extras = (t.extras || []).filter(y => y.id !== item); if (!t.extras.length) delete t.extras; return 'Đã xóa khối'; }
  return null;
}
// Khung từ: chữ hoặc ảnh (không trộn), vị trí trên / dưới / phải
extraActs['wbkind'] = (b, v) => commit(w => { const t = curT(w), wb = t.wordBank; if (!wb) return; if (v === 'image') { wb.kind = 'image'; if (!wb.words.length) wb.words = ['ảnh A', 'ảnh B', 'ảnh C']; wb.label = wb.label === 'lower' ? 'upper' : wb.label; } else { delete wb.kind; delete wb.ar; delete wb.cols; delete wb.cap; wb.words.forEach((_, i) => { ['uploads', 'upMeta', 'imgAr'].forEach(f => { if (t[f]) delete t[f]['B.' + i]; }); }); } }, v === 'image' ? 'Khung từ: ảnh' : 'Khung từ: chữ');
extraActs['wbcap'] = (b, v) => commit(w => { const wb = curT(w).wordBank; if (v === '0') wb.cap = false; else delete wb.cap; });
extraActs['wbar'] = (b, v) => commit(w => { const wb = curT(w).wordBank; if (v === '1/1') delete wb.ar; else wb.ar = v; });
extraActs['wbcols'] = (b, v) => commit(w => { const wb = curT(w).wordBank; if (!+v) delete wb.cols; else wb.cols = +v; });
extraActs['blkdel'] = (b, v) => { const t0 = curT(ws), g = v || sel.g, it = sel.item; let m = null; sel = { type: 'task', id: t0.id }; multi = []; commit(w => { m = blkDel(curT(w), g, g === 'G3' ? (b.dataset.item || it) : g === 'GT' ? it : null); }, null, () => { sel = { type: 'task', id: t0.id }; multi = []; refreshSel(); if (m) toast(m + ' · Ctrl+Z để hoàn tác'); }); };
extraActs['order'] = (b, v) => commit(w => { const t = curT(w); if (v === 'qfirst') t.layout.order = 'qfirst'; else delete t.layout.order; }, v === 'qfirst' ? 'Câu hỏi đặt trước bài đọc' : 'Bài đọc đặt trước câu hỏi');
// Câu (block câu) sửa / thêm / nhân đôi / xóa ngay từ trang: chọn đáp án của câu trên trang → panel
function itemAct(t, act, id) {
  const it = its(t), i = it.findIndex(x => x.id === id); if (i < 0) return null;
  if (act === 'iadd') { const x = blankItem(t); t.content.items.splice(i + 1, 0, x); ensureIds(t); normAnswer(t); return 'Đã thêm câu'; }
  if (act === 'idup') { const x = clone(it[i]); delete x.id; delete x.ex; t.content.items.splice(i + 1, 0, x); ensureIds(t); return 'Đã nhân đôi câu'; }
  if (act === 'idel') { dropOrphans(t, id); t.content.items.splice(i, 1); normAnswer(t); return 'Đã xóa câu'; }
  if (act === 'iex') { if (it[i].ex) { delete it[i].ex; return 'Bỏ câu ví dụ'; } const had = it.some(y => y.ex); it.forEach(y => { delete y.ex; }); it[i].ex = true; if (it[i].key == null) it[i].key = ''; return had ? 'Câu ví dụ chuyển sang câu này (mỗi bài chỉ một câu ví dụ)' : 'Câu ví dụ: số 0, hiện sẵn đáp án'; }   // v85: mỗi bài một câu ví dụ
  if (act === 'iup' || act === 'idown') { const j = act === 'iup' ? i - 1 : i + 1; if (j < 0 || j >= it.length) return null; [t.content.items[i], t.content.items[j]] = [t.content.items[j], t.content.items[i]]; return null; }
  return null;
}
['iadd', 'idup', 'idel', 'iex', 'iup', 'idown'].forEach(a => { extraActs[a] = (b, v) => { const t0 = curT(ws), id = b.dataset.item || sel.item; let m = null, nid = null; if (a === 'idel') { sel = { type: 'task', id: t0.id }; multi = []; }
  commit(w => { const t = curT(w), n0 = its(t).length; m = itemAct(t, a, id); if (a === 'iadd' || a === 'idup') { const k = its(t).findIndex(x => x.id === id); nid = its(t)[k + 1] && its(t)[k + 1].id; } }, null, () => {
    if (a === 'idel') { sel = { type: 'group', id: t0.id, g: 'G3' }; if (!groupsOf(curT(ws)).includes('G3')) sel = { type: 'task', id: t0.id }; }
    else if (nid && itemKeys(curT(ws)).includes(nid)) sel = { type: 'group', id: t0.id, g: 'G3', item: nid };
    multi = []; refreshSel(); if (m) toast(m); }); }; });
extraActs.change = (i => { const prev = extraActs.change; return el => { if (prev) prev(el); if (el.dataset.itx != null) { const t0 = curT(ws), id = el.dataset.itx, f = el.dataset.f || 'text', v = el.value; commit(w => { const x = its(curT(w)).find(y => y.id === id); if (!x) return; if (f === 'key') { if (v.trim()) x.key = v; else if (x.ex) x.key = ''; else delete x.key; } else if (f === 'who') { if (v.trim()) x.who = v; } else x[f] = v; }); } }; })();

// ---- Không để câu ví dụ / dòng chữ (G3-Text) lẫn vào các phép đổi cấu trúc câu ----
function withoutGt(t, fn) {
  const c = t.content; if (!c || !Array.isArray(c.items) || !c.items.some(x => x.gt)) return fn();
  const pos = c.items.map((x, i) => x.gt ? [i, x] : null).filter(Boolean); c.items = c.items.filter(x => !x.gt);
  const r = fn(); const c2 = t.content; if (c2 && Array.isArray(c2.items) && c2.form !== 'table') pos.forEach(([i, x]) => c2.items.splice(Math.min(i, c2.items.length), 0, x)); return r;
}
setKind = (f => (t, k) => withoutGt(t, () => f(t, k)))(setKind);
toggleField = (f => (t, fl, on) => withoutGt(t, () => f(t, fl, on)))(toggleField);
blankItem = (f => t => withoutGt(t, () => f(t)))(blankItem);
itemKeys = (f => t => { const g = new Set(its(t).filter(x => x.gt).map(x => x.id)); return f(t).filter(id => !g.has(id)); })(itemKeys);
labelOf = (f => (t, k) => { const [a, b] = String(k).split('.'), i = its(t).findIndex(x => x.id === a); return i >= 0 && !its(t)[i].gt ? qnum(t, i) + (b != null ? '.' + (+b + 1) : '') : f(t, k); })(labelOf);
tidy = (f => t => { f(t); qTidy(t); })(tidy);
Object.assign(GNAME, { G2: 'Câu hỏi', G3: 'Câu hỏi' });
// ---- Inspector: bộ chọn T + Q thay cho bộ chọn bố cục cũ; panel Câu hỏi thay panel Đáp án ----
layoutPicker = t => tPickerHtml(t) + qPickerHtml(t) + qOptsHtml(t);
const _answerPanel81 = answerPanel;
answerPanel = (t, s, key) => {
  if (key) {
    const it = its(t), i = it.findIndex(x => x.id === key), x = it[i] || {};
    const acts = `<h3>Câu này</h3><div class="stack"><button class="btn" data-act="iadd" data-item="${key}">+ Thêm câu sau</button><button class="btn" data-act="idup" data-item="${key}">⧉ Nhân đôi</button><button class="btn" data-act="iex" data-item="${key}" aria-pressed="${!!x.ex}">${x.ex ? 'Bỏ câu ví dụ' : 'Đặt làm câu ví dụ (số 0)'}</button><button class="btn" data-act="idel" data-item="${key}">✕ Xóa câu</button></div>`
      + (x.ex ? `<div class="field"><span>Đáp án mẫu (hiện sẵn)</span><input data-itx="${key}" data-f="key" value="${esc(x.key || '')}" aria-label="Đáp án của câu ví dụ"></div>` : '') + `<p class="hint">Phím Delete cũng xóa câu đang chọn.</p>`;
    return _answerPanel81(t, s, key).replace(/<h2>Đáp án · câu ([^<]*)<\/h2>/, (m, n) => `<h2>Câu ${n}${x.ex ? ' (ví dụ)' : ''} · chỗ trả lời</h2>` + acts);
  }
  const q = qOf(t), h = _answerPanel81(t, s, null), top = qPickerHtml(t) + qOptsHtml(t);
  return h.replace(/<h2>Đáp án · [\s\S]*?<\/h2>[\s\S]*?(?=<section class="psec")/, `<h2>Câu hỏi · ${QN[q]} ${cd(q)}</h2>${top}`);
};
const _framePanel81 = framePanel;
framePanel = (t, s) => {
  const two = !!(t.image && t.image.two), ok = ['questions', 'passage', 'empty'].includes(ck(t));
  const f2 = two ? g1bFr(t) : {}, fit2 = two ? fSeg('@cells.G1b.frame.fit', 'Hiển thị ảnh thứ hai', f2.fit, [['', 'Như ảnh 1'], ['normal', 'Bình thường'], ['width', 'Fit ngang'], ['height', 'Fit dọc']], '', { hint: 'Kích thước và căn lề đi theo khung ảnh chung.' })
    + (f2.fit && f2.fit !== 'normal' ? fRange('@cells.G1b.frame.zoom', 'Zoom ảnh thứ hai', f2.zoom, { min: 50, max: 300, step: 5, def: 100, fmt: x => x + '%', fmtKey: 'zoom' }) : '') : '';   // v85
  const add = `<h3>Ảnh thứ hai</h3>${two ? fit2 + imgCtl(t, 'G1b').replace('<h3>Ảnh</h3>', '') + `<div class="stack"><button class="btn" data-act="blkdel" data-v="G1b">Xóa ảnh thứ hai</button></div>` : `<div class="stack"><button class="btn" data-act="blkadd" data-v="G1b" ${ok ? '' : 'disabled title="Hai ảnh dùng cho bài có câu hỏi / bài đọc"'}>+ Thêm ảnh thứ hai</button></div>`}<p class="hint">Hai ảnh đứng cạnh nhau, cùng cỡ.</p>`;
  return _framePanel81(t, s).replace(/(<section class="psec" data-sec="auto")/, `<section class="psec" data-sec="two">${add}</section>$1`);
};
bankPanel = (t, s) => {
  const b = t.wordBank, pl = b.placement || 'top', right = pl === 'right', img = b.kind === 'image';
  const size = (right ? fRange('@split', 'Tỉ lệ nội dung / khung từ', t.layout.split, { min: 40, max: 80, step: 5, def: 62, fmt: r => `${r} / ${100 - r}`, fmtKey: 'split' }) : fNum('w', 'Độ rộng khung từ', b.w, { min: 30, max: 100, step: 5, unit: '%', def: 100 }));
  const align = right ? fSeg('valign', 'Căn dọc', b.valign, Object.entries(VA), 'top') : fSeg('align', 'Căn ngang', b.align, Object.entries(HA), 'center', { hint: b.w ? '' : 'Có tác dụng khi độ rộng nhỏ hơn 100%.' });
  const sg = (act, cur, opts) => `<div class="seg wrapseg">${opts.map(([v, n]) => `<button data-act="${act}" data-v="${v}" class="${String(cur) === String(v) ? 'on' : ''}">${n}</button>`).join('')}</div>`;
  let content = `<div class="field"><span>Loại</span>${sg('wbkind', img ? 'image' : 'text', [['text', 'Chữ'], ['image', 'Ảnh']])}</div><div class="field"><span>Vị trí</span>${sg('wb', pl, [['top', 'Trên câu hỏi'], ['bottom', 'Dưới câu hỏi'], ['right', 'Bên phải']])}</div>`;
  if (!img) content += `<div class="field"><span>Kiểu hiển thị</span>${sg('wbstyle', b.style === 'list' ? 'list' : 'chips', [['chips', 'Từ rời'], ['list', 'Danh sách']])}</div>` + (b.style === 'list' ? `<div class="field"><span>Nhãn</span>${sg('wblab', b.label || 'lower', [['lower', 'a b c'], ['upper', 'A B C'], ['none', 'Không']])}</div>` : '');
  else content += `<div class="field"><span>Nhãn</span>${sg('wblab', b.label || 'lower', [['upper', 'A B C'], ['lower', 'a b c'], ['none', 'Không']])}</div><div class="field"><span>Chữ dưới ảnh</span>${sg('wbcap', b.cap === false ? '0' : '1', [['1', 'Hiện'], ['0', 'Ẩn']])}</div>${fSeg('frame.fit', 'Hiển thị ảnh trong khung', (b.frame || {}).fit, [['normal', 'Bình thường'], ['width', 'Fit ngang'], ['height', 'Fit dọc']], 'normal', { hint: 'Áp cho mọi ảnh trong khung từ.' })}${(b.frame || {}).fit ? fRange('frame.zoom', 'Zoom ảnh', b.frame.zoom, { min: 50, max: 300, step: 5, def: 100, fmt: x => x + '%', fmtKey: 'zoom' }) : ''}<div class="field"><span>Tỉ lệ ô ảnh</span>${sg('wbar', b.ar || '1/1', [['1/1', '1:1'], ['4/3', '4:3'], ['3/4', '3:4']])}</div><div class="field"><span>Số ảnh mỗi hàng</span>${sg('wbcols', b.cols || 0, [[0, 'Tự động'], [2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6']])}</div><p class="hint">Bấm vào từng ô ảnh trên trang để tải / tạo ảnh. Tên ảnh sửa ở cột trái (mục Nội dung).</p>`;
  content += `<div class="stack"><button class="btn" data-act="blkdel" data-v="G4">Xóa khung từ</button></div>`;
  return panel(t, s, `Khung từ ${img ? 'ảnh' : 'chữ'} ${cd('G4')}`, { size, align, content, cname: 'Kiểu hiển thị' });
};
// Bài đọc (G2 của Task có bài đọc): thứ tự so với câu hỏi, xóa bài đọc
function leadPanel(t, s) {
  const qf = t.layout.order === 'qfirst', w8 = !qf && t.layout.task !== 'auto' && ['T8', 'T4'].includes(layoutOf(t));
  const c = `<div class="field"><span>Thứ tự</span><div class="seg"><button data-act="order" data-v="pfirst" class="${!qf ? 'on' : ''}">Bài đọc trước</button><button data-act="order" data-v="qfirst" class="${qf ? 'on' : ''}" ${w8 ? 'disabled title="Bố cục đang chọn tay (Ảnh trong bài đọc / hai cột): bài đọc luôn đứng trước. Đổi Bố cục về Tự động / Xếp dọc / Ảnh trái / Ảnh phải để đặt câu hỏi trước."' : ''}>Câu hỏi trước</button></div><p class="hint" style="margin:4px 0 0">Câu hỏi trước: bài đọc in sau câu hỏi (bài đọc khi đó không cắt theo đoạn).</p></div><div class="stack"><button class="btn" data-act="blkdel" data-v="G2">Xóa bài đọc (giữ câu hỏi)</button></div><p class="hint">Sửa chữ bài đọc ở cột trái, mục Nội dung. Phím Delete cũng xóa bài đọc.</p>`;
  return crumb(t, s) + `<h2>Bài đọc ${cd('G2')}</h2>` + sec('content', 'Bài đọc', c) + taskPanel(t, { type: 'task', id: t.id }).replace(/^[\s\S]*?<\/h2>/, '<h3>Cả Task</h3>');
}
const _renderInspector81 = renderInspector;
renderInspector = function () {
  // v85: hoàn tác sau khi thêm khối có thể để lựa chọn trỏ vào khối không còn (vd khung từ) → về chọn cả Task
  if (sel.type === 'group') { const t0 = ws.tasks.find(x => x.id === sel.id); if (!t0) sel = { type: 'sheet' }; else if ((sel.g === 'G4' && !t0.wordBank) || (sel.g === 'G1' && !sel.item && !t0.image) || (sel.g === 'GT' && sel.item && !gtOf(t0, sel.item))) { sel = { type: 'task', id: t0.id }; multi = []; } }
  if (sel.type === 'group' && sel.g === 'G2' && !sel.item) { const t = curT(ws); if (t && ck(t) === 'passage') { document.getElementById('insp').innerHTML = leadPanel(t, sel); tidyHints(document.getElementById('insp')); return; } }
  _renderInspector81();
};
extraActs['blkadd'] = (b, v) => { let nid = null; commit(w => { nid = blkAdd(curT(w), v); }, BLK_NAME[v] ? 'Đã thêm: ' + BLK_NAME[v] : null); };
// Phím Delete trên trang: xóa khối đang chọn (ảnh chung, bài đọc, khung từ, khối tự do, câu)
keyExtra = (f => e => {
  const k = e.key;
  if ((k === 'Delete' || k === 'Backspace') && (e.target === document.body || e.target.closest('#stage')) && sel.type === 'group' && curT(ws)) {
    const t = curT(ws), g = sel.g;
    if (g === 'G4' && t.wordBank) { extraActs.blkdel({ dataset: {} }, 'G4'); return true; }
    if (g === 'GT' && sel.item) { extraActs.blkdel({ dataset: {} }, 'GT'); return true; }
    if (g === 'G2' && !sel.item && ck(t) === 'passage') { extraActs.blkdel({ dataset: {} }, 'G2'); return true; }
    if (g === 'G3' && sel.item && its(t).some(x => x.id === sel.item)) { extraActs.idel({ dataset: { item: sel.item } }); return true; }
  }
  return f(e);
})(keyExtra);

// ---- Cột trái: mục 1 "Bố cục & dạng câu hỏi", khối thêm / xóa, câu ví dụ, dòng chữ giữa các câu ----
applyField = (f => (t, k, v) => { if (k === 'image.label2') { if (t.image) t.image.label2 = v; return; } if (k === 'wb.imgs') { if (t.wordBank) t.wordBank.words = splitList(v, /\n|,/).filter(Boolean); return; } const m = /^it\.(\d+)\.key$/.exec(k); if (m) { const x = its(t)[+m[1]]; if (x) { if (v.trim() || x.ex) x.key = v; else delete x.key; } return; } return f(t, k, v); })(applyField);
const xb = (v, n) => ` <button type="button" class="eb xb" data-eact="blkdel" data-v="${v}" title="Xóa ${n}" aria-label="Xóa ${n}">✕</button>`;
const _edHtml81 = edHtml;
edHtml = t => {
  let h = _edHtml81(t); const c = t.content, k = ck(t);
  // Mục 1: bộ chọn T và Q (giữ "Áp mẫu" và "Đáp án" chi tiết bên dưới)
  h = h.replace('<span class="sect">Dạng bài &amp; đáp án</span>', '<span class="sect">Bố cục &amp; dạng câu hỏi</span>')
    .replace(/(<div class="tcwrap">[\s\S]*?<\/div>)(\s*<div class="ef"><span class="elb">Áp mẫu)/, (m, a, b2) => a + `<div class="qpick">${tPickerHtml(t, 'tree')}${qPickerHtml(t, 'tree')}${qOptsHtml(t, 'tree')}</div>` + b2);
  // Mục 3: nút xóa từng khối, ảnh thứ hai, khung từ ảnh, nút thêm khối
  h = h.replace('<span class="elb">Ảnh chung</span>', `<span class="elb">Ảnh chung${xb('G1', 'ảnh chung')}</span>`)
    .replace('<span class="elb">Bài đọc</span>', `<span class="elb">Bài đọc${xb('G2', 'bài đọc')}</span>`)
    .replace('<span class="elb">Lời dẫn</span>', `<span class="elb">Lời dẫn${xb('intro', 'lời dẫn')}</span>`)
    .replace('<span class="elb">Khung từ</span>', `<span class="elb">${t.wordBank && t.wordBank.kind === 'image' ? 'Khung từ ảnh' : 'Khung từ'}${xb('G4', 'khung từ')}</span>`);
  if (t.image && t.image.two) { const a = eIn('image.label', t.image.label || '', 'Tên ảnh', { label: 'Tên ảnh chung' }) + '</div>'; h = h.replace(a, a + `<div class="ef imgrow"><span class="elb">Ảnh thứ hai${xb('G1b', 'ảnh thứ hai')}</span>${thumbHtml(t, 'G1b')}${eIn('image.label2', t.image.label2 || '', 'Tên ảnh', { label: 'Tên ảnh thứ hai' })}</div>`); }
  if (t.wordBank && t.wordBank.kind === 'image') { const wb = t.wordBank, i0 = h.indexOf('<span class="elb">Khung từ ảnh'); if (i0 > 0) { const j = h.indexOf('</div>', h.indexOf('</textarea>', i0)); if (j > 0) h = h.slice(0, j + 6) + `<div class="ef wbth">${wb.words.map((w, i) => `<span class="wbt">${thumbHtml(t, 'B.' + i)}<small>${esc(w)}</small></span>`).join('')}</div>` + h.slice(j + 6); } }
  // Câu: số theo câu thật (ví dụ = 0, dòng chữ không số), nút "0" bật / tắt câu ví dụ
  const it = its(t), exOk = c.form !== 'table' && c.list !== false && !['pairs', 'empty', 'table'].includes(k);
  h = h.replace(/<div class="eit([^"]*)" data-i="(\d+)"><div class="eih"><span class="egrip" draggable="true" data-drag="\2" title="Kéo để đổi thứ tự">⋮⋮<\/span><span class="ino">\d+<\/span>/g, (m, cl, i) => { const x = it[+i] || {}; return `<div class="eit${cl}${x.gt ? ' egt' : ''}${x.ex ? ' eex' : ''}" data-i="${i}"><div class="eih"><span class="egrip" draggable="true" data-drag="${i}" title="Kéo để đổi thứ tự">⋮⋮</span><span class="ino${x.ex ? ' ex' : ''}">${x.gt ? 'Chữ' : qnum(t, +i)}</span>`; });
  if (exOk) h = h.replace(/<button class="eb" data-eact="dupi" data-i="(\d+)"/g, (m, i) => { const x = it[+i] || {}; return x.gt ? m : `<button class="eb exb${x.ex ? ' on' : ''}" data-eact="iexi" data-i="${i}" aria-pressed="${!!x.ex}" title="${x.ex ? 'Bỏ câu ví dụ' : 'Đặt làm câu ví dụ: số 0, hiện sẵn đáp án'}" aria-label="Câu ví dụ">Ví dụ</button>` + m; });
  // Dòng chữ (gt): chỉ ô chữ, không đáp án / lựa chọn / số ô
  if (it.some(x => x.gt)) h = h.replace(/<div class="eit[^"]*egt[^"]*" data-i="(\d+)">[\s\S]*?(?=<div class="eit|<\/div><div class="erow">)/g, m => m.replace(/<div class="er2"><span class="elb">(Đáp án|Số ô|Chọn)<\/span>[\s\S]*?<\/div>/g, '').replace(/<div class="eans"[^>]*>[^<]*<\/div>/, '').replace(/placeholder="[^"]*"/, 'placeholder="Dòng chữ giữa các câu (không số, không chỗ trả lời)"').replace(/<button class="eb" data-eact="dupi"[^>]*>⧉<\/button>/, ''));
  if (exOk && ['questions', 'dialogue'].includes(k)) h = h.replace(/(<button class="btn" data-eact="add">[^<]*<\/button>)/, `$1<button class="btn" data-eact="gtiadd" title="Dòng chữ giữa các câu: không số, không chỗ trả lời (tiêu đề nhóm, lời dẫn phần sau)">+ Dòng chữ</button>`);
  // Thêm khối
  const ad = blkAddable(t);
  if (ad.length) { const row = `<div class="ef blkadd"><span class="elb">Thêm khối</span><select data-eact="blkadd" aria-label="Thêm khối vào Task"><option value="">Chọn khối…</option>${ad.map(v => `<option value="${v}">${BLK_NAME[v]}</option>`).join('')}</select></div>`;
    const s0 = h.indexOf('data-sec="content"'); if (s0 > 0) { const e0 = h.indexOf('</div></section>', s0); if (e0 > 0) h = h.slice(0, e0) + row + h.slice(e0); } }
  return h;
};
treeEl.addEventListener('click', e => {
  const b = e.target.closest('[data-eact]'); if (!b || b.disabled || b.tagName === 'SELECT') return;
  const ed = b.closest('.ed'), id = ed ? ed.dataset.ed : null, act = b.dataset.eact, v = b.dataset.v; if (!id) return;
  const T = w => w.tasks.find(y => y.id === id);
  if (Q_ACTS.includes(act)) { let msg = null; return commit(w => { msg = qCmd(T(w), act, v); }, null, () => { if (msg) toast(msg); }); }
  if (act === 'blkdel') { let m = null; if (sel.type === 'group' && sel.id === id) { sel = { type: 'task', id }; multi = []; } return commit(w => { m = blkDel(T(w), v); }, null, () => { if (sel.type === 'group' && sel.id === id) { sel = { type: 'task', id }; refreshSel(); } if (m) toast(m + ' · Ctrl+Z để hoàn tác'); }); }
  if (act === 'tickopt') { const i = +b.dataset.i, j = +b.dataset.j; return commit(w => { const t = T(w), x = its(t)[i]; if (!x) return; const op = optsOfKey(t, x);   // v86 (F2): bật / tắt từng đáp án, được chọn nhiều
    if (t.answer.layout === 'A6') { x.key = exPicks(t, x, op).includes(j) ? '' : op[j]; return; }
    const cur = exPicks(t, x, op), nx = cur.includes(j) ? cur.filter(k => k !== j) : cur.concat(j).sort((a, c) => a - c); x.key = nx.map(k => 'abcdefgh'[k] || String(k + 1)).join(', '); }); }
  if (act === 'tbimg') return commit(w => cimToggle(T(w), +b.dataset.i, b.dataset.j));   // v99
  if (act === 'tbok') { const i = +b.dataset.i, j = +b.dataset.j; return commit(w => { const t = T(w), r = t.content.rows[i], x = r && r.cells[j]; if (!x || !x.tick) return; if (x.ok) delete x.ok; else { if ((t.layout.table || {}).one) r.cells.forEach(y => { if (y && y.tick) delete y.ok; }); x.ok = true; } }); }   // v98
  if (act === 'tblo') { let m = null; return commit(w => { m = tblo(T(w), v); }, null, () => toast(m)); }   // v96
  if (act === 'pshuf') return commit(w => { const c = T(w).content; if (v) c.shuffle = true; else delete c.shuffle; });
  if (act === 'preshuf') return commit(w => { const c = T(w).content; c.shufSeed = (c.shufSeed || 0) + 1; });
  if (act === 'pickopt') { const i = +b.dataset.i, g = +b.dataset.g, j = +b.dataset.j; return commit(w => { const x = its(T(w))[i]; if (x) pkToggle(x, g, j); }); }
  if (act === 'ulpick') { const i = +b.dataset.i, j = +b.dataset.j; return commit(w => { const t = T(w), x = its(t)[i]; if (!x) return; const up = (t.answer.params || {}).upper, c = (up ? 'ABCDEFGH' : 'abcdefgh')[j]; x.key = String(x.key ?? '').trim().toLowerCase() === c.toLowerCase() ? '' : c; }); }
  if (act === 'keyjump') { const t = T(ws), m = keyState(t).miss; if (!m.length) return; const e = document.querySelector(`#tree .ed .sec[data-sec=g3] .eit[data-i="${m[0]}"]`); if (!e) return; e.scrollIntoView({ block: 'center' }); e.classList.add('kflash'); setTimeout(() => e.classList.remove('kflash'), 1200); const f = e.querySelector(`[data-k="it.${m[0]}.key"], [data-eact=tickopt], [data-eact=pickopt], input`); if (f) f.focus(); return; }
  if (act === 'optadd' || act === 'optdel') { const i = +b.dataset.i, j = +b.dataset.j; return commit(w => { const t = T(w), x = its(t)[i]; if (!x || !x.opts) return; const pk = exPicks(t, x, x.opts);   // v87: thêm / xóa lựa chọn, đáp án đúng dời theo
    if (act === 'optadd') { x.opts.push(''); if (pk.length) x.key = pk.map(k => 'abcdefgh'[k] || String(k + 1)).join(', '); return; }
    if (x.opts.length <= 2) return; x.opts.splice(j, 1); const nk = pk.filter(k => k !== j).map(k => k > j ? k - 1 : k);
    if (nk.length) x.key = nk.map(k => 'abcdefgh'[k] || String(k + 1)).join(', '); else if (x.key != null) x.key = ''; }, null, act === 'optadd' ? () => focusK(`it.${i}.opts.${its(curT(ws))[i].opts.length - 1}`) : null); }
  if (act === 'iexi') { const i = +b.dataset.i; let m = null; return commit(w => { const t = T(w), x = its(t)[i]; if (x) m = itemAct(t, 'iex', x.id); }, null, () => { if (m) toast(m); }); }
  if (act === 'gtiadd') { return commit(w => { const t = T(w); t.content.items = t.content.items || []; t.content.items.push({ gt: true, text: '' }); ensureIds(t); }, null, () => focusK(`it.${its(curT(ws)).length - 1}.text`)); }
});
treeEl.addEventListener('change', e => {
  const x = e.target; if (x.dataset.eact !== 'blkadd' || !x.value) return;
  const id = x.closest('.ed').dataset.ed, v = x.value; let nid = null;
  commit(w => { nid = blkAdd(w.tasks.find(y => y.id === id), v); }, 'Đã thêm: ' + BLK_NAME[v], () => { if (nid) { SECT.gt = true; sectSave(); refreshSel(); } });
});
// Hai ảnh chung: chỉ Xếp dọc. Câu hỏi trước bài đọc: không đặt bài đọc cạnh câu hỏi / bao quanh ảnh
const qFirst = t => t.layout.order === 'qfirst' && ck(t) === 'passage';
layoutReasons = (f => t => { const r = f(t); if (t.image && t.image.two) ['T2', 'T3', 'T8'].forEach(k => { if (k in r && !r[k]) r[k] = 'Hai ảnh chung đứng cạnh nhau phía trên: chỉ dùng Xếp dọc'; });
  if (qFirst(t)) ['T4', 'T8'].forEach(k => { if (k in r && !r[k]) r[k] = 'Câu hỏi đặt trước bài đọc: bài đọc không nằm cạnh câu hỏi / bao quanh ảnh'; }); return r; })(layoutReasons);
autoLayout = (f => t => { const L = f(t); if (t.image && t.image.two && ['T2', 'T3', 'T8'].includes(L)) return 'T1'; if (qFirst(t) && ['T4', 'T8'].includes(L)) return t.image ? 'T1' : 'T6'; return L; })(autoLayout);
/* ================= hết v81 ================= */

/* ================= v82: cột trái theo khối (Cấu hình · G0 · G1 · G2 · G3 · G4 · G-Text) =================
   Dựng lại từ edHtml v81: tách mục "Nội dung" thành từng khối G, gộp "Thành phần" vào Cấu hình,
   bỏ "Áp mẫu" và chọn loại đáp án cũ (trùng bộ chọn Q). Không đổi dữ liệu. */
Object.keys(SECT_DEF).forEach(k => { delete SECT_DEF[k]; delete SECT[k]; });
Object.assign(SECT_DEF, { cfg: false, g0: false, g1: false, g2: false, g3: true, g4: false, gt: false });   // v83: một mục mở một lúc, mặc định G3
Object.assign(SECT, SECT_DEF);
const SEC_G = { g0: 'G0', g1: 'G1', g2: 'G2', g3: 'G3', g4: 'G4' };
const G_SEC = { G0: 'g0', G1: 'g1', G2: 'g2', G3: 'g3', G4: 'g4', GT: 'gt' };
// v84: khối trên trang → mục cột trái. Trên trang G1:<câu> là ảnh của câu, G2 là phần câu hỏi (trừ bài đọc), G3 là chỗ trả lời
function secOfSel(t, s) {
  if (s.g === 'G1') return t.image && !s.item ? 'g1' : 'g3';
  if (s.g === 'G2') return ck(t) === 'passage' ? 'g2' : 'g3';
  return G_SEC[s.g];
}
// Mục cột trái → khối chọn trên trang (sel + multi); null = chọn cả Task
function selOfSec(t, k) {
  const gs = groupsOf(t), G = g => gs.includes(g) ? { type: 'group', id: t.id, g } : null;
  if (k === 'g0' || k === 'g4') return [G(SEC_G[k])];
  if (k === 'g1') return [t.image ? G('G1') : null];
  if (k === 'g2') return [ck(t) === 'passage' ? G('G2') : null];
  if (k === 'g3') return ck(t) === 'passage' ? [G('G3')] : [G('G2'), G('G3')];
  if (k === 'gt') { const x = (t.extras || [])[0]; return [x ? { type: 'group', id: t.id, g: 'GT', item: x.id } : null]; }
  return [null];
}
function sectOne(k) { Object.keys(SECT).forEach(x => { SECT[x] = false; }); if (k) SECT[k] = true; sectSave(); }
function syncSec() { document.querySelectorAll('#tree .ed .sec[data-sec]').forEach(e => { const o = !!SECT[e.dataset.sec]; e.classList.toggle('open', o); const h = e.querySelector('.sech'); if (h) h.setAttribute('aria-expanded', o ? 'true' : 'false'); }); }
// Bấm tiêu đề mục = mở mục đó (đóng mục khác) và chọn khối G tương ứng trên trang; bấm mục đang mở = thu lại, về chọn cả Task. Không dựng lại cột trái (đang gõ không mất con trỏ).
function sectClick(k) {
  const t = ws.tasks.find(x => x.id === openTask); if (!t) return;
  const was = !!SECT[k]; sectOne(was ? null : k); syncSec();
  const ss = was ? [] : selOfSec(t, k).filter(Boolean);
  sel = ss[0] || { type: 'task', id: t.id }; multi = ss.slice(1);
  renderInspector(); markSelection(); refreshOverlay();
  const tk = stage.querySelector(`.task[data-task="${t.id}"]`), gn = sel.type === 'group' && stage.querySelector(`[data-node="${nodeKey(sel)}"]`), el = gn && sel.g !== 'G0' ? gn : tk;
  if (el && !was) el.scrollIntoView({ block: el === tk ? 'start' : 'center', behavior: 'smooth' });   // đưa khối đang làm việc vào tầm nhìn
}
try { const v = JSON.parse(localStorage.getItem(SECT_KEY) || 'null'); if (v) { Object.keys(SECT_DEF).forEach(k => { if (typeof v[k] === 'boolean') SECT[k] = v[k]; }); const ks = Object.keys(SECT_DEF).filter(k => SECT[k]); if (ks.length > 1) sectOne(ks.includes('g3') ? 'g3' : ks[0]); } } catch (_) {}
const TG_BLK = { image: 'Ảnh chung', passage: 'Bài đọc', intro: 'Lời dẫn', list: 'Câu hỏi', bank: 'Khung từ' };   // công tắc bật / tắt khối; còn lại là tùy chọn của câu
const BLK_SEC = { G1: 'g1', G1b: 'g1', G2: 'g2', intro: 'g2', G3: 'g3', G4: 'g4', G4i: 'g4', GTt: 'gt', GTi: 'gt' };
const _secSums82 = secSums;
secSums = t => {
  const s = _secSums82(t), c = t.content, ld = c.lead, wb = t.wordBank, n = wb ? wb.words.length : 0;
  return { cfg: s.kind, g0: s.info, g1: t.image ? (t.image.two ? '2 ảnh' : '1 ảnh') : 'chưa có', g2: ld ? (ld.text || '').replace(/\s+/g, ' ').trim() || (ld.kind === 'text' ? 'lời dẫn trống' : 'bài đọc trống') : 'chưa có',
    g3: c.form !== 'table' && c.list === false ? ((c.items || []).length ? `đang tắt · giữ ${c.items.length} câu` : 'chưa có') : s.content, g4: wb ? `${n} ${wb.kind === 'image' ? 'ảnh' : 'từ'}` : 'chưa có', gt: s.free };
};
const _edHtml82 = edHtml;
edHtml = t => {
  const tp = document.createElement('template'); tp.innerHTML = _edHtml82(t);
  const q = s => tp.content.querySelector(s), out = e => e ? e.outerHTML : '', inner = s => { const e = q(s); return e ? e.innerHTML : ''; };
  const c = t.content, k = ck(t), sums = secSums(t), tn = tnOf(t), qq = qOf(t), ad = blkAddable(t), tbl = c.form === 'table';
  // Mục "Nội dung" của v81 → từng khối
  const G = { g1: '', g2: '', g3: '', g4: '' };
  [...(q('[data-sec="content"] .secb') || { children: [] }).children].forEach(e => {
    if (e.classList.contains('blkadd') || (e.tagName === 'P' && /Danh sách câu đang tắt/.test(e.textContent))) return;
    const g = e.classList.contains('imgrow') ? 'g1' : e.querySelector('[data-k^="lead."]') ? 'g2' : (e.classList.contains('wbth') || e.querySelector('[data-k^="wb."]')) ? 'g4' : 'g3';
    G[g] += e.outerHTML;
  });
  if (t.image && ad.includes('G1b')) G.g1 += `<div class="stack"><button class="btn" data-eact="blkaddb" data-v="G1b">+ Ảnh thứ hai</button></div>`;
  // Cấu hình: thẻ mô tả, T, Q, tùy chọn của Q, tùy chọn câu, bật / tắt khối
  const tg = fieldToggles(t), tgH = l => l.map(x => `<label class="etg ${x.dis ? 'dis' : ''}" title="${esc(x.dis || '')}"><input type="checkbox" data-tg="${x.id}" ${x.on ? 'checked' : ''} ${x.dis && !x.on ? 'disabled' : ''}>${TG_BLK[x.id] || x.label}</label>`).join('');
  const tgI = tg.filter(x => !TG_BLK[x.id] && !(x.dis && !x.on)), tgB = tg.filter(x => TG_BLK[x.id]);
  const cfg = out(q('.tcwrap')) + out(q('.qpick')) + (tgI.length ? `<h3>Tùy chọn của câu</h3><div class="etgs">${tgH(tgI)}</div>` : '') +
    (tgB.length ? `<h3>Khối của bài</h3><p class="hint" style="margin:0 0 4px">Bật hoặc tắt từng khối. Tắt Câu hỏi vẫn giữ câu để bật lại.</p><div class="etgs">${tgH(tgB)}</div>` : '');
  const tag = (v, ti) => v ? `<span class="stag" title="${esc(ti)}">${v}</span>` : '';
  const sec = (key, code, title, html, tg0) => `<section class="sec ${SECT[key] ? 'open' : ''}" data-sec="${key}"><button class="sech" data-stg="${key}" aria-expanded="${SECT[key] ? 'true' : 'false'}"><span class="snum">${code}</span><span class="sect">${title}</span><span class="secs">${esc(sums[key] || '')}</span>${tg0 || ''}<span class="car">▶</span></button><div class="secb">${html}</div></section>`;
  // Khối chưa có: tiêu đề mờ, nút thêm ngay tại mục
  const off = (key, code, title, btns, why) => `<section class="sec off" data-sec="${key}"><div class="sech"><span class="snum">${code}</span><span class="sect">${title}</span><span class="secs">${esc(why || sums[key] || '')}</span>${btns.map(([v, n]) => `<button type="button" class="eb sadd" data-eact="blkaddb" data-v="${v}">${n}</button>`).join('')}</div></section>`;
  const NA = 'không dùng cho dạng này';
  const g1 = t.image ? sec('g1', 'G1', 'Ảnh chung', G.g1) : off('g1', 'G1', 'Ảnh chung', [['G1', '+ Thêm']]);
  const g2 = c.lead ? sec('g2', 'G2', c.lead.kind === 'text' ? 'Lời dẫn' : 'Bài đọc', G.g2, tag('theo ' + tn, 'Vị trí bài đọc theo Bố cục ' + TN[tn])) :
    off('g2', 'G2', 'Bài đọc', [...(ad.includes('G2') ? [['G2', '+ Bài đọc']] : []), ...(ad.includes('intro') ? [['intro', '+ Lời dẫn']] : [])], ad.includes('G2') || ad.includes('intro') ? '' : NA);
  const g3on = tbl || c.list !== false;
  const g3 = g3on ? sec('g3', 'G3', tbl ? 'Bảng' : 'Câu hỏi', G.g3, tag(qq && 'theo ' + qq, qq ? 'Dạng câu hỏi: ' + QN[qq] : '')) : off('g3', 'G3', 'Câu hỏi', [['G3', c.list === false && (c.items || []).length ? '+ Bật lại' : '+ Thêm']]);
  const g4 = t.wordBank ? sec('g4', 'G4', t.wordBank.kind === 'image' ? 'Khung từ ảnh' : 'Khung từ', G.g4) : ad.includes('G4') ? off('g4', 'G4', 'Khung từ', [['G4', '+ Chữ'], ['G4i', '+ Ảnh']]) : off('g4', 'G4', 'Khung từ', [], NA);
  return `<div class="ed" data-ed="${t.id}">${out(q('.tkt'))}${sec('cfg', '⚙', 'Cấu hình', cfg, tag(tn + (qq ? ' · ' + qq : ''), 'Bố cục ' + TN[tn] + (qq ? ' · Dạng câu hỏi ' + QN[qq] : '')))}${sec('g0', 'G0', 'Tiêu đề', inner('[data-sec="info"] .secb'))}${g1}${g2}${g3}${g4}${(t.extras || []).length ? sec('gt', 'GT', 'Khối tự do', inner('[data-sec="free"] .secb')) : off('gt', 'GT', 'Khối tự do', [['GTt', '+ Chữ'], ['GTi', '+ Ảnh']])}</div>`;
};
treeEl.addEventListener('click', e => {
  const b = e.target.closest('[data-eact="blkaddb"]'); if (!b || b.disabled) return;
  const id = b.closest('.ed').dataset.ed, v = b.dataset.v; let nid = null;
  commit(w => { nid = blkAdd(w.tasks.find(y => y.id === id), v); }, 'Đã thêm: ' + BLK_NAME[v], () => { sectOne(BLK_SEC[v]); const g = { G1: 'G1', G1b: 'G1', G2: 'G2', intro: 'G2', G3: 'G3', G4: 'G4', G4i: 'G4' }[v]; sel = g ? { type: 'group', id, g } : nid ? { type: 'group', id, g: 'GT', item: nid } : { type: 'task', id }; refreshSel(); });
});
// Ô cần gõ nằm trong mục đang thu lại: mở mục ra trước
focusK = (f => k => { const e = document.querySelector(`#tree .ed [data-k="${k}"]`), s = e && e.closest('.sec'); if (s && !s.classList.contains('open') && s.dataset.sec in SECT) { sectOne(s.dataset.sec); syncSec(); } return f(k); })(focusK);
/* ================= hết v82 ================= */

/* ================= v83: ô ảnh G1 lớn, ⓘ + thanh chèn ký hiệu cho ô chữ ================= */
const _edHtml83 = edHtml;
edHtml = t => {
  const tp = document.createElement('template'); tp.innerHTML = _edHtml83(t); const R = tp.content;
  R.querySelectorAll('.sec[data-sec=g1] .imgrow .ithumb').forEach(b => { b.classList.add('big'); if (!b.classList.contains('has')) b.innerHTML = '<span>＋ Tải ảnh lên · Tạo ảnh<small>hoặc kéo thả ảnh vào ô trên trang · Ctrl+V</small></span>'; });
  const info = (ctx, ti) => `<button type="button" class="tinfo" data-eact="tinfo" data-ctx="${ctx}" title="${ti}" aria-label="${ti}">i</button>`;
  const lb = R.querySelector('.sec[data-sec=g2] .elb'); if (lb) lb.insertAdjacentHTML('beforeend', info('passage', 'Cách viết bài đọc / lời dẫn'));
  const sh = R.querySelector('.sec[data-sec=g3] .subh'); if (sh) sh.insertAdjacentHTML('beforeend', info('items', 'Cách viết câu hỏi'));
  R.querySelectorAll('.sec[data-sec=gt] .gtcard').forEach(c => { if (/Khối chữ/.test(c.querySelector('.gthd b') ? c.querySelector('.gthd b').textContent : '')) c.querySelector('.gthd b').insertAdjacentHTML('afterend', info('free', 'Cách viết khối chữ')); });
  const d = document.createElement('div'); d.appendChild(R.cloneNode(true)); return d.innerHTML;
};
// Bảng ký hiệu theo ngữ cảnh; nút chèn tác động vào ô chữ đang gõ gần nhất
const TXH = {
  passage: ['Bài đọc / lời dẫn', [['**chữ**', 'đậm'], ['*chữ*', 'nghiêng'], ['<u>chữ</u>', 'gạch chân'], ['___', 'chỗ trống để học sinh điền'], ['{a|b}', 'chọn trong câu'], ['(dòng trống)', 'sang đoạn mới'], ['A. …', 'đầu đoạn (≥ 2 đoạn): nhãn đoạn đậm']], 'Đáp án chỗ trống ghi ở ô bên dưới, cách nhau dấu phẩy, theo thứ tự chỗ trống.'],
  items: ['Chữ của câu', [['**chữ**', 'đậm'], ['*chữ*', 'nghiêng'], ['<u>chữ</u>', 'gạch chân'], ['___', 'chỗ trống'], ['{a|b}', 'chọn trong câu'], ['(Enter)', 'xuống dòng trong câu (ô nhiều dòng)']], 'Lựa chọn A/B/C nhập ở ô "Chọn" của câu. Ví dụ / xóa / nhân đôi câu: các nút ở đầu câu.'],
  free: ['Khối chữ tự do', [['**chữ**', 'đậm'], ['*chữ*', 'nghiêng'], ['<u>chữ</u>', 'gạch chân'], ['- chữ', 'dòng danh sách chấm'], ['1. chữ', 'dòng danh sách số'], ['(dòng trống)', 'sang đoạn mới']], 'Khối chữ nằm ngang cả bề rộng Task, không đánh số, không có đáp án.']
};
const TXB = { passage: [['B', 'b'], ['I', 'i'], ['U', 'u'], ['___', 'gap'], ['{a|b}', 'pick'], ['¶', 'para']], items: [['B', 'b'], ['I', 'i'], ['U', 'u'], ['___', 'gap'], ['{a|b}', 'pick']], free: [['B', 'b'], ['I', 'i'], ['U', 'u'], ['•', 'ul'], ['¶', 'para']] };
let txField = null;
treeEl.addEventListener('focusin', e => { const x = e.target; if (x.matches && x.matches('input[data-k],textarea[data-k]')) txField = x; });
// v84: bấm / gõ trong thẻ khối tự do = chọn khối đó trên trang (viền xanh), không dựng lại cột trái
function gtPick(e) {
  const c = e.target.closest && e.target.closest('.sec[data-sec=gt] .gtcard[data-x]'); if (!c || e.target.closest('button')) return;
  const t = ws.tasks.find(x => x.id === openTask); if (!t || !gtOf(t, c.dataset.x)) return;
  if (sel.type === 'group' && sel.g === 'GT' && sel.item === c.dataset.x && sel.id === t.id) return;
  sel = { type: 'group', id: t.id, g: 'GT', item: c.dataset.x }; multi = [];
  renderInspector(); markSelection(); refreshOverlay();
  const el = stage.querySelector(`[data-node="${nodeKey(sel)}"]`); if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
}
treeEl.addEventListener('focusin', gtPick); treeEl.addEventListener('pointerdown', gtPick);
function txInsert(act) {
  const el = txField && document.body.contains(txField) ? txField : null; if (!el) { toast('Bấm vào ô chữ cần chèn trước'); return; }
  const a = el.selectionStart, b = el.selectionEnd, sel0 = el.value.slice(a, b), lead = () => (a > 0 && el.value[a - 1] !== '\n' ? '\n' : '');
  const W = (l, r, ph) => { const m = sel0 || ph; el.setRangeText(l + m + r, a, b, 'select'); if (!sel0) el.setSelectionRange(a + l.length, a + l.length + m.length); };
  if (act === 'b') W('**', '**', 'chữ'); else if (act === 'i') W('*', '*', 'chữ'); else if (act === 'u') W('<u>', '</u>', 'chữ');
  else if (act === 'gap') { el.setRangeText('___', a, b, 'end'); } else if (act === 'pick') { el.setRangeText('{a|b}', a, b, 'select'); el.setSelectionRange(a + 1, a + 4); }
  else if (act === 'para') { el.setRangeText('\n\n', a, b, 'end'); } else if (act === 'ul') { el.setRangeText(lead() + '- ', a, b, 'end'); }
  el.focus(); el.dispatchEvent(new Event('input', { bubbles: true }));
}
function txOpen(btn) {
  let pop = document.getElementById('txHelp'); if (!pop) { pop = document.createElement('div'); pop.id = 'txHelp'; pop.hidden = true; pop.setAttribute('role', 'dialog'); document.body.appendChild(pop); }
  const ctx = btn.dataset.ctx, [ti, rows, note] = TXH[ctx];
  if (!pop.hidden && pop.dataset.ctx === ctx && pop._btn === btn) { pop.hidden = true; return; }
  pop.dataset.ctx = ctx; pop._btn = btn;
  pop.innerHTML = `<h4>${ti}</h4><div class="txtb" role="toolbar" aria-label="Chèn ký hiệu">${TXB[ctx].map(([n, a]) => `<button type="button" data-tx="${a}" title="Chèn vào ô đang gõ">${esc(n)}</button>`).join('')}</div><table>${rows.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table><p class="txnote">${esc(note)} Bôi đen chữ rồi bấm B / I / U để định dạng.</p>`;
  const r = btn.getBoundingClientRect(); pop.hidden = false;
  const w = pop.offsetWidth, h = pop.offsetHeight; pop.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left)) + 'px'; pop.style.top = Math.max(8, Math.min(window.innerHeight - h - 8, r.bottom + 6)) + 'px';
}
treeEl.addEventListener('click', e => { const b = e.target.closest('[data-eact="tinfo"]'); if (b) { e.stopPropagation(); txOpen(b); } }, true);
document.addEventListener('mousedown', e => { const pop = document.getElementById('txHelp'); if (!pop || pop.hidden) return; if (e.target.closest('#txHelp')) { if (e.target.closest('[data-tx]')) e.preventDefault(); return; } if (!e.target.closest('[data-eact="tinfo"]')) pop.hidden = true; }, true);
document.addEventListener('click', e => { const b = e.target.closest('#txHelp [data-tx]'); if (b) txInsert(b.dataset.tx); });
document.addEventListener('keydown', e => { const pop = document.getElementById('txHelp'); if (e.key === 'Escape' && pop && !pop.hidden) { pop.hidden = true; e.stopPropagation(); } }, true);
treeEl.addEventListener('scroll', () => { const pop = document.getElementById('txHelp'); if (pop) pop.hidden = true; }, { passive: true });
/* ================= hết v83 ================= */

/* ================= v85: cột trái gọn hơn =================
   Bỏ "Khối của bài" trong Cấu hình (thêm / xóa khối đã có ngay ở từng mục G; G3 có nút ✕ = tắt câu hỏi, giữ câu để bật lại).
   Mục G3: "Danh sách câu" → "Câu hỏi", bỏ số câu, thanh B I U ___ {a|b} bên phải cùng hàng; ⓘ lên hàng "Tỉ lệ ô ảnh" nếu có. */
const _edHtml84 = edHtml;
edHtml = t => {
  const tp = document.createElement('template'); tp.innerHTML = _edHtml84(t); const R = tp.content;
  const h3 = [...R.querySelectorAll('.sec[data-sec=cfg] h3')].find(h => h.textContent.trim() === 'Khối của bài');
  if (h3) { [h3.nextElementSibling && h3.nextElementSibling.matches('p.hint') ? h3.nextElementSibling : null].forEach(e => e && e.remove()); const g = h3.nextElementSibling; if (g && g.matches('.etgs')) g.remove(); h3.remove(); }
  const sh = R.querySelector('.sec[data-sec=g3] .subh');
  if (sh) {
    const nm = (sh.firstChild && sh.firstChild.nodeType === 3 ? sh.firstChild.textContent : '').trim(), inf = sh.querySelector('.tinfo');
    const lt = R.querySelector('.sec[data-sec=g3] .ef .elb'), ar = lt && lt.textContent.trim() === 'Tỉ lệ ô ảnh' ? lt.closest('.ef') : null;
    const lst = fieldToggles(t).find(x => x.id === 'list'), canOff = lst && lst.on && !lst.dis;
    sh.innerHTML = `<span class="g3n">${esc(nm === 'Danh sách câu' ? 'Câu hỏi' : nm)}${canOff ? xb('G3', 'câu hỏi (giữ câu để bật lại)') : ''}</span>${t.content.form === 'table' ? '' : `<span class="g3tb" role="toolbar" aria-label="Chèn ký hiệu vào ô câu đang gõ">${TXB.items.map(([n, a]) => `<button type="button" data-tx="${a}" title="${{ b: 'Đậm', i: 'Nghiêng', u: 'Gạch chân', gap: 'Chỗ trống', pick: 'Chọn trong câu' }[a]}: chèn vào ô câu đang gõ">${esc(n)}</button>`).join('')}</span>`}`;
    if (inf) { if (ar) { ar.classList.add('g3ar'); ar.appendChild(inf); } else sh.appendChild(inf); }
    if (ck(t) === 'pairs') { const on = !!t.content.shuffle; sh.insertAdjacentHTML('afterend', `<div class="ef shrow"><span class="elb">Xáo vế phải khi in</span><span class="seg"><button type="button" data-eact="pshuf" data-v="1" class="${on ? 'on' : ''}">Bật</button><button type="button" data-eact="pshuf" data-v="" class="${on ? '' : 'on'}">Tắt</button></span>${on ? '<button type="button" class="btn" data-eact="preshuf" title="Đổi thứ tự xáo khác">Xáo lại</button>' : ''}</div><p class="hint">Bật: gõ cặp <b>đúng</b> cạnh nhau, phiếu in tự xáo vế phải (cố định, in lại không đổi). Tắt: in đúng thứ tự đang gõ.</p>`); }   // v90
    const ks = keyState(t); if (ks.need.length) sh.insertAdjacentHTML('beforeend', `<button type="button" class="kcnt${ks.miss.length ? ' w' : ''}" data-eact="keyjump" title="${ks.miss.length ? 'Bấm để tới câu còn thiếu đáp án đúng' : 'Mọi câu đã có đáp án đúng'}">${ks.need.length - ks.miss.length}/${ks.need.length} câu có đáp án</button>`);   // v88
    // v96: tùy chọn bảng ngay ở cột trái (ô tích): hàng tiêu đề, tô nền hàng tiêu đề, hàng xen kẽ, cột tiêu đề hàng, số thứ tự
    if (ck(t) === 'table' && !tblOpts(t).cross) { const o = tblOpts(t), C = (k, n, on, dis) => `<label class="tbck"><input type="checkbox" data-eact="tblo" data-v="${k}:${on ? 0 : 1}" ${on ? 'checked' : ''} ${dis ? `disabled title="${esc(dis)}"` : ''}> ${n}</label>`;
      sh.insertAdjacentHTML('afterend', `<div class="ef tbrow"><span class="elb">Kiểu bảng</span><span class="tbcks">${C('head', 'Hàng tiêu đề cột', o.head)}${C('fh', 'Tô nền hàng tiêu đề', o.fh && o.head, o.head ? '' : 'Bật Hàng tiêu đề cột trước')}${C('fr', 'Tô hàng xen kẽ', o.fr === 'zebra' && !o.fc, o.fc ? 'Đang tô cột đầu' : '')}${C('rowHead', 'Cột tiêu đề hàng', o.rowHead)}</span></div>${tkHasText(t) || tkCells(t).some(v => v && v.tick) ? `<div class="ef tbrow"><span class="elb">Chọn đáp án</span><span class="tbcks">${tkHasText(t) ? C('tk', 'Hiện ô tích trước chữ', tkOn(t)) : ''}${tkCells(t).some(v => v && v.tick) ? C('one', 'Một ô đúng mỗi hàng', !!(t.layout.table || {}).one) : ''}</span></div>` : ''}<div class="ef tbrow"><span class="elb">Số thứ tự</span><span class="seg">${[['out', 'Ngoài bảng'], ['in', 'Trong cột đầu'], ['off', 'Tắt']].map(([v, n]) => `<button type="button" data-eact="tblo" data-v="nm:${v}" class="${o.nm === v ? 'on' : ''}">${n}</button>`).join('')}</span></div><div class="ef tbrow"><span class="elb">Ảnh trong bảng</span><span class="seg">${[['none', 'Không'], ['first', 'Cột đầu'], ['all', 'Mọi ô có chữ']].map(([v, n]) => `<button type="button" data-eact="tblo" data-v="im:${v}" class="${cimMode(t) === v ? 'on' : ''}">${n}</button>`).join('')}</span></div>`); }
    // v86: chữ câu hỏi Bình thường / Đậm
    if (!['table', 'empty', 'trace', 'dialogue'].includes(ck(t))) { const qb = !!t.layout.qbold; sh.insertAdjacentHTML('afterend', `<div class="ef qbrow"><span class="elb">Chữ câu hỏi</span><span class="seg"><button type="button" data-eact="qbold" data-v="" class="${qb ? '' : 'on'}">Bình thường</button><button type="button" data-eact="qbold" data-v="1" class="${qb ? 'on' : ''}" style="font-weight:700">Đậm</button></span></div>`); }
  }
  // v86 (F2): ô tích đáp án đúng ngay dưới lựa chọn (Chọn A/B/C, Đúng/Sai); không in ra phiếu
  if (['A4', 'A6'].includes(t.answer.layout)) R.querySelectorAll('.sec[data-sec=g3] .eit[data-i]').forEach(e => {
    const i = +e.dataset.i, x = its(t)[i]; if (!x || x.gt || x.imgs || x.opts) return; const op = optsOfKey(t, x); if (op.length < 2) return; const on = exPicks(t, x, op);   // v87: câu có opts đã có ô tích ở từng dòng
    const row = `<div class="er2 ktk"><span class="elb">Đúng</span>${op.map((o, j) => `<span class="ko"><button type="button" class="tkq${on.includes(j) ? ' on' : ''}" data-eact="tickopt" data-i="${i}" data-j="${j}" aria-pressed="${on.includes(j)}" title="Đánh dấu đáp án đúng (chọn được nhiều)">✓</button>${t.answer.layout === 'A4' ? esc('abcdefgh'[j] + '. ') : ''}${esc(String(o).replace(/<[^>]+>|\*/g, ''))}</span>`).join('')}</div>`;
    const anchor = e.querySelector('[data-k="it.' + i + '.opts"]'), host = anchor ? anchor.closest('.er2') : e.querySelector('[data-k="it.' + i + '.text"]');
    if (host) host.insertAdjacentHTML('afterend', row);
  });
  // v86: G2 (bài đọc / lời dẫn) có thanh B I U ___ {a|b} ¶ ở hàng tiêu đề, dính khi cuộn
  const g2l = R.querySelector('.sec[data-sec=g2] .ef > .elb');
  if (g2l && R.querySelector('.sec[data-sec=g2] [data-k="lead.text"]')) { g2l.classList.add('g2bar'); g2l.insertAdjacentHTML('beforeend', `<span class="g3tb" role="toolbar" aria-label="Chèn ký hiệu vào bài đọc">${TXB.passage.map(([n, a]) => `<button type="button" data-tx="${a}" title="${{ b: 'Đậm', i: 'Nghiêng', u: 'Gạch chân', gap: 'Chỗ trống', pick: 'Chọn trong câu', para: 'Sang đoạn mới' }[a]}: chèn vào ô đang gõ">${esc(n)}</button>`).join('')}</span>`); }
  const d = document.createElement('div'); d.appendChild(R.cloneNode(true)); return d.innerHTML;
};
// chiều cao thanh tiêu đề Task (đang dính) → vị trí dính của thanh B I U
treeEl.addEventListener('scroll', () => { const h = treeEl.querySelector('.tk.open>.tkh'); if (h) treeEl.style.setProperty('--tkh', Math.round(h.getBoundingClientRect().height) + 'px'); }, { passive: true });
treeEl.addEventListener('mousedown', e => { if (e.target.closest('.g3tb [data-tx]')) e.preventDefault(); }, true);
treeEl.addEventListener('click', e => { const b = e.target.closest('[data-eact="qbold"]'); if (!b) return; e.stopPropagation(); const id = b.closest('.ed').dataset.ed, v = !!b.dataset.v;
  if (!!(ws.tasks.find(x => x.id === id) || { layout: {} }).layout.qbold === v) return; commit(w => { const t = w.tasks.find(x => x.id === id); if (v) t.layout.qbold = true; else delete t.layout.qbold; }, v ? 'Chữ câu hỏi: Đậm' : 'Chữ câu hỏi: Bình thường'); }, true);   // giữ con trỏ trong ô đang gõ
treeEl.addEventListener('click', e => { const b = e.target.closest('.g3tb [data-tx]'); if (b) { e.stopPropagation(); txInsert(b.dataset.tx); } }, true);
/* ================= hết v85 cột trái ================= */

/* ================= v83 (V4): bộ nhớ theo dạng câu hỏi =================
   Đổi Dạng câu hỏi (Q) rồi đi một vòng quay lại thì về đúng như lần trình bày gần nhất của dạng đó, không mất nội dung đã nhập.
   Khi rời dạng Q0: cất bản chụp phần gắn với Q (câu / hàng bảng, đáp án, bố cục liên quan) vào t.qmem[Q0], kèm trạng thái ngay sau khi chuyển ("after").
   Khi vào dạng Q có bản cất: gộp 3 bên theo từng trường: trường còn y như "after" (chưa ai sửa) thì lấy bản cất; đã sửa thì giữ bản đã sửa.
   Câu mới thêm giữ nguyên, câu người dùng đã xóa thì bỏ, câu bị bộ chuyển đổi bỏ đi (vd Viết tự do chỉ giữ 1 chỗ) thì trả lại. */
const QM_L = ['task', 'split', 'cols', 'cw', 'width', 'align', 'valign', 'num', 'table'];   // phần bố cục gắn với dạng câu hỏi
const QM_C = ['items', 'rows', 'cols', 'corner', 'lead', 'form'];                            // khóa nội dung xử lý riêng (lead thuộc G2, không đụng)
const qmC = v => v === undefined ? undefined : clone(v);
const qmEq = (a, b) => JSON.stringify(a === undefined ? null : a) === JSON.stringify(b === undefined ? null : b);
const qmForm = t => t.content.form === 'table' ? 'table' : 'list';
const qmRows = t => qmForm(t) === 'table' ? (t.content.rows || []) : (t.content.items || []);
const qmHead = r => typeof r.head === 'string' ? r.head : (r.head && r.head.text) || '';
const qmRest = t => { const c = {}; Object.keys(t.content).forEach(k => { if (!QM_C.includes(k)) c[k] = qmC(t.content[k]); }); return c; };
const qmUnits = t => { const m = {}; qmRows(t).forEach(x => { if (x.id != null) m[x.id] = qmForm(t) === 'table' ? { text: qmHead(x) } : qmC(x); }); return m; };   // trạng thái từng câu / hàng theo id
const qmPick = t => { const o = {}; QM_L.forEach(k => { if (t.layout[k] !== undefined) o[k] = qmC(t.layout[k]); }); return o; };
const qm3 = (th, ou, ba) => qmEq(ou, ba) ? qmC(th) : ou;
function qmObj3(th, ou, ba) { const o = {}; new Set([...Object.keys(th || {}), ...Object.keys(ou || {}), ...Object.keys(ba || {})]).forEach(k => { const v = qm3((th || {})[k], (ou || {})[k], (ba || {})[k]); if (v !== undefined) o[k] = v; }); return o; }
// Gộp danh sách theo thứ tự hiện tại; phần tử của bản cất bị bộ chuyển đổi bỏ đi (không có trong "after") được chèn lại
function qmList(saved, units, cur, mk) {
  const out = cur.map(x => { const th = saved.find(y => y.id === x.id); return th ? mk(th, x, units[x.id]) : x; });
  saved.forEach((th, i) => {
    if (units[th.id] !== undefined || out.some(x => x.id === th.id)) return;   // người dùng đã xóa, hoặc còn nguyên
    const prev = saved.slice(0, i).reverse().find(y => out.some(x => x.id === y.id));
    out.splice(prev ? out.findIndex(x => x.id === prev.id) + 1 : 0, 0, qmC(th));
  });
  return out;
}
function qmRestore(t, q, P, whole) {
  const S = t.qmem && t.qmem[q]; if (!S || !S.after) return;
  const A = S.after, pre = qmC({ content: t.content, answer: t.answer, layout: t.layout });
  // 3 bên: theirs = bản cất của dạng q, base = trạng thái ngay sau khi rời q, ours = trạng thái trước lúc đổi về q (P);
  // trường người dùng chưa đụng từ lúc rời q (ours = base) thì lấy bản cất; đã sửa thì giữ kết quả chuyển đổi hiện tại (đã mang chỗ sửa theo)
  const pick3 = (th, ou, ba, cur) => qmEq(ou, ba) ? qmC(th) : cur;
  const obj3 = (th, ou, ba, cur) => { const o = {}; new Set([...Object.keys(th || {}), ...Object.keys(cur || {})]).forEach(k => { const v = pick3((th || {})[k], (ou || {})[k], (ba || {})[k], (cur || {})[k]); if (v !== undefined) o[k] = v; }); return o; };
  try {
    if (qmForm(t) !== S.form) return;
    // Chưa ai sửa gì từ lúc rời dạng này: trả lại nguyên bản cất (chính xác tuyệt đối, kể cả khi bộ chuyển đổi làm mất / tạo lại câu)
    if (whole || (qmEq(P.units, A.units) && qmEq(P.answer, A.answer) && qmEq(P.layout, A.layout) && qmEq(P.rest, A.rest))) {
      const keep = {}; ['lead'].forEach(k => { if (t.content[k] !== undefined) keep[k] = t.content[k]; });
      t.content = Object.assign(qmC(S.rest), S.form === 'list' ? { items: qmC(S.rows) } : { rows: qmC(S.rows), cols: qmC(S.cols), corner: S.corner }, S.formRaw !== undefined ? { form: S.formRaw } : {}, keep);
      t.answer = qmC(S.answer); QM_L.forEach(k => { if (S.layout[k] === undefined) delete t.layout[k]; else t.layout[k] = qmC(S.layout[k]); });
      if (qOf(t) !== q) throw new Error('qm');
      return;
    }
    if (S.form === 'list') t.content.items = qmList(S.rows, A.units, t.content.items || [], (th, x, ba) => { const pu = P.units[x.id]; return pu === undefined ? x : obj3(th, pu, ba, x); });
    else { t.content.cols = qmC(S.cols); t.content.corner = S.corner; t.content.rows = qmList(S.rows, A.units, t.content.rows || [], (th, x, ba) => { const r = qmC(th), pu = P.units[x.id]; if (ba && (!pu || qmHead(x) !== ba.text || (pu.text !== ba.text))) r.head = x.head; return r; }); }
    new Set([...Object.keys(S.rest), ...Object.keys(t.content)]).forEach(k => { if (QM_C.includes(k)) return; const v = pick3(S.rest[k], P.rest[k], A.rest[k], t.content[k]); if (v === undefined) delete t.content[k]; else t.content[k] = v; });
    const ans = obj3(S.answer, P.answer, A.answer, t.answer); ans.params = obj3((S.answer || {}).params, (P.answer || {}).params, (A.answer || {}).params, (t.answer || {}).params); t.answer = ans;
    QM_L.forEach(k => { const v = pick3(S.layout[k], P.layout[k], A.layout[k], t.layout[k]); if (v === undefined) delete t.layout[k]; else t.layout[k] = v; });
    if (qmForm(t) === 'table') ensureRowIds(t); else ensureIds(t);
    normAnswer(t);
    if (qOf(t) !== q) throw new Error('qm');   // gộp ra trạng thái không đúng dạng: bỏ, giữ kết quả chuyển đổi thường
  } catch (e) { t.content = pre.content; t.answer = pre.answer; t.layout = pre.layout; }
}
// Đổi dạng có nhớ: dùng ở cột trái / Inspector (qCmd 'q'); nhập file vẫn dùng setQ trần để không thêm dữ liệu nhớ
function setQMem(t, q) {
  const q0 = qOf(t); if (!q0 || q0 === q || !QN[q] || qReasons(t)[q]) return setQ(t, q);
  const pre = qmRows(t).map(x => x.id), form0 = qmForm(t);
  // Dòng gốc: từ lúc rời dạng gốc tới giờ chỉ toàn đổi dạng, chưa ai sửa tay → quay về gốc thì trả nguyên bản cất của gốc
  const sigOf = () => JSON.stringify(qmC({ content: t.content, answer: t.answer, layout: t.layout })), lin = t.qmemLin, untouched = !!lin && lin.q === q0 && lin.sig === sigOf();
  const origin = untouched ? lin.origin : q0;
  const P = { units: qmUnits(t), answer: qmC(t.answer), layout: qmPick(t), rest: qmRest(t) };
  const S = { form: form0, formRaw: t.content.form, rows: qmC(qmRows(t)), cols: qmC(t.content.cols), corner: t.content.corner, rest: P.rest, answer: P.answer, layout: P.layout };
  if (!setQ(t, q)) return false;
  if (qmForm(t) !== form0) { const r = qmRows(t); if (r.length === pre.length && pre.every(x => x != null)) r.forEach((x, i) => { x.id = pre[i]; }); }   // giữ id câu khi đi qua Bảng
  S.after = { rest: qmRest(t), answer: qmC(t.answer), layout: qmPick(t), units: qmUnits(t) };
  t.qmem = t.qmem || {}; t.qmem[q0] = S;
  qmRestore(t, q, P, untouched && lin.origin === q);
  t.qmemLin = { q, origin, sig: sigOf() };
  return true;
}
window.__ws = { pick: s => pick(s), get ws() { return ws; }, get res() { return lastRes; }, get renders() { return renderCount; }, get sel() { return sel; }, get multi() { return multi; }, render, setZoom(z) { zoom = z; draw(); } };
// Độ rộng cột trái (khung nhập liệu): kéo thanh ở mép phải, bấm đúp về mặc định, nhớ trong trình duyệt
const LW_KEY = 'wsEditor.leftW.v2', LW_DEF = 420, appEl = document.querySelector('.app'), lsEl = document.getElementById('lsplit');
let leftW = LW_DEF; try { const v = parseInt(localStorage.getItem(LW_KEY), 10); if (v >= 240 && v <= 900) leftW = v; } catch (_) {}
const lwMax = () => Math.max(320, Math.min(720, window.innerWidth - 312 - 32 - 40 - 420)); // chừa tối thiểu ~420px cho trang A4
function setLeftW(px, save) {
  leftW = clampN(Math.round(px), 240, lwMax()); appEl.style.setProperty('--lw', leftW + 'px');
  lsEl.setAttribute('aria-valuenow', leftW); lsEl.setAttribute('aria-valuemin', 240); lsEl.setAttribute('aria-valuemax', lwMax());
  if (save) { try { localStorage.setItem(LW_KEY, String(leftW)); } catch (_) {} }
}
setLeftW(leftW, false);
lsEl.addEventListener('pointerdown', e => {
  e.preventDefault(); lsEl.setPointerCapture(e.pointerId); lsEl.classList.add('drag');
  const x0 = e.clientX, w0 = leftW; let raf = 0;
  const mv = ev => { setLeftW(w0 + ev.clientX - x0, false); lsEl.dataset.w = leftW + ' px'; if (!raf) raf = requestAnimationFrame(() => { raf = 0; if (zoom == null) stage.style.setProperty('--s', scaleNow()); }); };
  const up = () => { lsEl.removeEventListener('pointermove', mv); lsEl.removeEventListener('pointerup', up); lsEl.removeEventListener('pointercancel', up); lsEl.classList.remove('drag'); setLeftW(leftW, true); draw(); };
  lsEl.addEventListener('pointermove', mv); lsEl.addEventListener('pointerup', up); lsEl.addEventListener('pointercancel', up);
});
lsEl.addEventListener('dblclick', () => { setLeftW(LW_DEF, true); draw(); });
lsEl.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); setLeftW(leftW + (e.key === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? 60 : 20), true); draw(); } });
window.addEventListener('resize', () => setLeftW(leftW, false));
// Chờ font của phiếu tải xong rồi mới đo; font đổi sau đó thì đo lại.
const fontsReady = document.fonts
  ? Promise.all(['14pt Andika', 'bold 14pt Andika'].flatMap(f => [document.fonts.load(f), document.fonts.load(f, 'ăâđêôơưáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụýỳỷỹỵ'), document.fonts.load(f, 'ÀÁẠĐÊÔƠƯ')])).catch(() => {}).then(() => document.fonts.ready)
  : Promise.resolve();
fontsReady.then(() => { ready = true; render(); });
// Font nạp thêm nhóm ký tự giữa chừng: chỉ dàn lại trang, không dựng lại cột trái (đang gõ dở thì không mất chữ)
if (document.fonts) document.fonts.addEventListener('loadingdone', e => { if (ready && e.fontfaces.some(f => /Andika|Be Vietnam|Lexend/.test(f.family))) { const res = paginate(); lastRes = res; draw(); document.getElementById('pageBadge').textContent = `${res.pages.length} trang A4`; const db = document.getElementById('diagBadge'); db.textContent = res.diags.length ? `${res.diags.length} lỗi tràn trang` : 'Không lỗi tràn'; db.classList.toggle('bad', !!res.diags.length); } });
render();
