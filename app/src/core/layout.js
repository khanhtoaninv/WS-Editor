// src/core/layout.js — tách nguyên văn từ v106 (app/scripts/tach-core.mjs). Không dùng trạng thái giao diện (chọn, cột trái, hoàn tác).
import { ws } from './state.js';
import { AGE, GAPLAB, GAPP, PK_STAR, PRESETS, QN, SCHEMA, SIZES, ck, clone, gapCount, isGridTbl, its, keyParts, migTask, pkGroups, pkSrc, qDerived } from './model.js';

/* ================= Hằng số & chính sách ================= */
export const MM = 96 / 25.4;                 // px trên mỗi mm (CSS)

export const CONTENT_H = 297 - 14 - 14 - 7;  // mm: A4 − lề trên/dưới − chân trang

export const FSZ = { '5-6': { s: 12, m: 14, l: 16 }, '7-9': { s: 10, m: 12, l: 14 }, '10-12': { s: 9, m: 10.5, l: 12 } };

export const sizeKey = () => SIZES[ws.size] ? ws.size : 'm';   // v84: mặc định Vừa ở mọi độ tuổi (không ghi vào phiếu); Nhỏ / To ghi ws.size

export const fontPt = () => FSZ[ws.age][sizeKey()];

export const TL = {
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


/* ================= Dữ liệu mẫu (viết theo schema 0.1, tự chuyển sang 0.2 khi nạp) ================= */
export const T = o => { const r = Object.assign({ audio: null, image: null, wordBank: null,
  layout: { task: 'auto', ratio: null, cols: null, imageFit: null, imageH: null, imageW: null, imageObj: null, imageAlign: null, imageOx: null, imageOy: null, imageZoom: null, cellAlign: null, table: null }, spacing: { preset: null, overrides: {} } }, o,
  { answer: Object.assign({ params: {} }, o.answer) });
  if (o.layout) r.layout = Object.assign({ task: 'auto', ratio: null, cols: null, imageFit: null, imageH: null, imageW: null, imageObj: null, imageAlign: null, imageOx: null, imageOy: null, imageZoom: null, cellAlign: null, table: null }, o.layout);
  return r; };

export const SAMPLE = {
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

export const leadText = t => (t.content.lead && t.content.lead.text) || '';

/* Bài đọc (v75): ___ chỗ trống tự đánh số khi có từ 2 chỗ; {a|b} chọn; **đậm**, *nghiêng*, __gạch chân__ */
export const passageParas = t => { const x = leadText(t); return /\n/.test(x) ? x.split(/\n\s*\n/).map(p => p.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean) : [x]; };

export function passInline(raw, n0, total, tid, c0) {
  let k = n0, c = c0 || 0;
  return rich(esc(pkPre(raw)).replace(GAPP, (m, at, str) => { k++; return `<span class="pgap"${tid ? slotAt(`${tid}.lead.${k}`) : ''}>${total > 1 && !GAPLAB.test(str.slice(0, at)) ? `(${k})` : '&nbsp;'}</span>`; })
    .replace(/\{([^{}|]+(?:\|[^{}|]+)+)\}/g, (m, g) => `<span class="pch"${tid ? slotAt(`${tid}.leadc.${++c}`) : ''}>${g.split('|').map(o => `<b>${o.replace(/\u0003/g, '').trim()}</b>`).join('&nbsp;/ ')}</span>`)
    .replace(/(?<!_)__(?!_)(.+?)(?<!_)__(?!_)/g, '<u>$1</u>'));   // __gạch chân__ (cũ, v75) và <u>…</u>, **đậm**, *nghiêng* đều dùng được
}

export function passageHtml(t, idx) {
  const ps = passageParas(t), total = gapCount(leadText(t)), nCh = p => (p.match(/\{[^{}|]+(?:\|[^{}|]+)+\}/g) || []).length; let n = 0, nc = 0; const off = ps.map(p => { const o = n; n += gapCount(p); return o; }), offc = ps.map(p => { const o = nc; nc += nCh(p); return o; });
  if (!/\n/.test(leadText(t))) return passInline(ps[0], 0, total, t.id, 0);
  const lab = ps.filter(p => /^[A-H][.)]\s+\S/.test(p)).length >= 2;   // v81: đoạn có nhãn A–F (bài nối tiêu đề với đoạn)
  return ps.map((p, i) => { if (idx && !idx.includes(i)) return ''; const m = lab && /^([A-H])[.)]\s+([\s\S]*)$/.exec(p); return m ? `<p class="plb"><b class="plt">${m[1]}</b><span>${passInline(m[2], off[i], total, t.id, offc[i])}</span></p>` : `<p>${passInline(p, off[i], total, t.id, offc[i])}</p>`; }).join('');
}

export const passCut = (t, L) => ck(t) === 'passage' && (L === 'T1' || L === 'T6') && t.layout.order !== 'qfirst';   // v81: câu hỏi trước bài đọc thì không cắt theo đoạn

export function migrate(w) { w.tasks.forEach(migTask); w.schema = SCHEMA; return w; }

export const SAMPLE2 = migrate(clone(SAMPLE));


/* ================= Quy tắc layout ================= */
export function autoLayout(t) {
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

export function layoutReasons(t) { // '' = hợp lệ, chuỗi = lý do bị khóa
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

export function layoutOf(t) { const L = t.layout.task; if (L !== 'auto' && !layoutReasons(t)[L]) return L; return autoLayout(t); }

export function colsDefault(t, L) { if (L === 'T5') return (t.content.variant === 'multi' || cellDirOf(t) === 'row') ? 1 : 3; return 1; }

export function colsRange(t, L) { const max = AGE[ws.age].maxCols; if (L === 'T5') return t.content.variant === 'multi' ? [1, 2] : cellDirOf(t) === 'row' ? [1, Math.min(2, max)] : [2, max]; if (L === 'T6') return [1, 2]; return null; }

export function colsOf(t) { const L = layoutOf(t), rg = colsRange(t, L); if (!rg) return 1; const c = t.layout.cols ?? colsDefault(t, L); return Math.min(rg[1], Math.max(rg[0], c)); }

export const T7CW = [40, 20, 40];

export function rmeta(t, L) { if (L === 'T4' && t.answer && t.answer.layout === 'A6') return ck(t) === 'passage' ? { ratio: 60, range: [40, 90] } : { ratio: 80, range: [50, 90] }; return (L === 'T6' && t.wordBank && t.wordBank.placement === 'right') ? { ratio: 62, range: [40, 80] } : TL[L]; }

export function ratioOf(t) { const L = layoutOf(t); if (L === 'T7') return null; const m = rmeta(t, L); if (!m.ratio) return null; const r = t.layout.split ?? m.ratio; return Math.min(m.range[1], Math.max(m.range[0], r)); }

export function t7cw(t) { const c = t.layout.cw; return Array.isArray(c) && c.length === 3 && c.every(x => x != null) ? c : T7CW; }

// Hướng ô của T5 (bài item đơn): 'col' ảnh trên chữ, 'row' ảnh trái chữ phải. Mặc định: item có lines[] thì 'row', còn lại 'col'.
export function cellDirOf(t) {
  if (ck(t) !== 'items' || t.content.variant === 'multi' || layoutOf(t) !== 'T5') return null;
  const d = t.layout.dir; if (d === 'col' || d === 'row') return d;
  return its(t).some(it => it.lines) ? 'row' : 'col';
}

export const isColI = t => ['T2', 'T3'].includes(layoutOf(t));

export const frOf = t => t.layout.frame || {};

export function fitOf(t) { return t.image ? (frOf(t).fit || null) : null; }

export const IW8 = [25, 60, 40];

// T5: mỗi ảnh (và mỗi ô chữ ở Ảnh trái) là một container, cấu hình riêng ở layout.cells[khóa]
export const cellCfg = (t, k) => (t.layout.cells && t.layout.cells[k]) || {};

export const cellFr = (t, k) => cellCfg(t, k).frame || {};

export const cellSplit = cc => Math.min(50, Math.max(15, cc.split ?? 25));

export function alignOf(t) { const L = layoutOf(t), a = frOf(t).align; if (!t.image) return null; if (L === 'T1') return a || 'center'; if (L === 'T8') return a === 'left' ? 'left' : 'right'; if (L === 'T4') return a || null; return null; }

export const arNum = a => { if (!a) return 4 / 3; if (typeof a === 'number') return a; const [x, y] = String(a).split('/').map(Number); return y ? x / y : x || 4 / 3; };

// Container G1 = khung ảnh. Chiều cao mặc định ở chế độ Fit = chiều cao ảnh lúc Bình thường.
export function frameH(t) {
  const f = fitOf(t); if (!f || (f === 'height' && isColI(t))) return null;
  const fr = frOf(t); if (fr.h) return fr.h;
  const L = layoutOf(t); if (!['T1', 'T4'].includes(L)) return null;
  const sc = fr.scale || 100, w = ((t.image.size === 'large' && L === 'T1') ? 150 : 80) * sc / 100;
  return +(w / arNum(t.image.ar)).toFixed(1);
}

export function imgStyle(t) {
  const f = fitOf(t), fr = frOf(t); let o = '';
  if (layoutOf(t) === 'T8' && t.image) o += `;--iw:${fr.w ?? IW8[2]}`;
  if (t.image) o += `;--iar:${natAr(t, 'G1') || t.image.ar}`;
  if (!f) return o;
  if (frameH(t)) o += `;--ih:${frameH(t)}`;
  else if (layoutOf(t) !== 'T8') o += `;--car:${(arNum(t.image.ar) * 100 / (fr.scale || 100)).toFixed(3)}`;
  o += `;--ox:${fr.ox || 0};--oy:${fr.oy || 0};--z:${(fr.zoom || 100) / 100}`;
  return o;
}

export function tplOf(t) { const L = layoutOf(t); if (L === 'T7') { const c = t7cw(t); return `${c[0]}fr ${c[1]}fr ${c[2]}fr`; } const r = ratioOf(t); if (r == null) return '1fr'; return `${r}fr ${100 - r}fr`; }

// Phiếu: preset gọn/vừa/thoáng, hoặc 'free' (Tự do) khi người dùng nhập tay: overrides giữ đủ 5 giá trị. Task cũng vậy.
export function sheetSpacing() { return Object.assign({}, PRESETS[ws.spacing.preset] || PRESETS.compact, ws.spacing.overrides); }

export function inheritedSpacing(t) { return Object.assign(sheetSpacing(), PRESETS[t.spacing.preset] || {}); }

export function spacingOf(t) { return Object.assign(inheritedSpacing(t), t.spacing.overrides); }

// Nối vào Task trên (layout.break = 'join'): phần tiếp của Task phía trên, không số / tiêu đề. Task đầu phiếu không nối được.
export const isJoined = t => !!t && t.layout && t.layout.break === 'join' && ws.tasks.indexOf(t) > 0;

export const gapOf = t => isJoined(t) ? spacingOf(t).groupGap : spacingOf(t).gapTask;

// Tham số đáp án của một câu = tham số chung + phần ghi đè của câu đó
export function pOf(t, item) { const p = t.answer.params || {}, k = item && typeof item === 'object' ? item.id : null, o = k && p.perItem && p.perItem[k]; return o ? Object.assign({}, p, o) : p; }


/* ================= Render HTML phiếu ================= */
export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* Ký hiệu chữ (v80): **đậm**, *nghiêng*, <u>gạch chân</u> (lồng nhau được). Nhận chuỗi ĐÃ esc. Dấu không đủ cặp thì giữ nguyên là chữ.
   pw = bọc từng từ (dùng trong hàng flex của a2inline, nơi mỗi từ là một ô riêng). */
export function rich(h, pw) {
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

export const er = s => rich(esc(pkPre(s)));

// Ô giữ chỗ: khung đúng tỉ lệ, ghi tỉ lệ (ảnh thật thay vào thì lấy tỉ lệ thật)
export const PHC = {};

export function PH(ar) { const a = String(ar || '4/3'); if (PHC[a]) return PHC[a]; const v = arNum(a) || 4 / 3, W = 48, H = +(W / v).toFixed(2), m = Math.min(W, H);
  return PHC[a] = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}'><rect width='${W}' height='${H}' fill='#eef2f5'/><g transform='translate(${W / 2 - m * .14} ${H / 2 - m * .12}) scale(${m * .28 / 24})' fill='none' stroke='#9fb1bf' stroke-width='1.6' stroke-linejoin='round'><rect x='1' y='2' width='22' height='16' rx='2.5'/><circle cx='16.5' cy='7' r='2'/><path d='M2 16 L9 9 L14 14 L17 11 L22 16'/></g></svg>`); }

export const pic = (label, cls = '', src, o = {}) => `<div class="pic ${cls}${src ? ' up' : ' ph'}"${o.slot ? ` data-slot="${o.slot}"` : ''}${o.ar ? ` style="--par:${o.ar};--ar:${o.ar}"` : ''}><img src="${src || PH(o.ar || o.gar)}" alt="${esc(label)}">${src ? '' : `<span class="pic-ar">${arLabel(o.ar || o.gar || '4/3')}</span><span class="pic-cap">${esc(label)}</span>`}</div>`;

// Container ảnh của một ô T5 (khung riêng: Fit, chiều cao, zoom, tâm, căn ngang)
export function ci(t, key, label, src) {
  const f = cellFr(t, key);
  return `<div class="ci" data-node="${t.id}:G1:${key}" data-ck="${key}"${f.fit ? ` data-cf="${f.fit}"` : ''}${f.h ? ' data-cih="1"' : ''}${f.align ? ` data-fa="${f.align}"` : ''}${f.w ? ` data-cw="1"` : ''} style="${f.w ? `--cw:${f.w}%;` : ''}--iar:${natAr(t, '@' + key) || tblAr(t)};--ih:${f.h || 35};--ox:${f.ox || 0};--oy:${f.oy || 0};--z:${(f.zoom || 100) / 100}">${pic(label, '', src, { slot: '@' + key, ar: imgArOf(t, '@' + key) })}</div>`;
}

export const srcOf = (t, key) => (t.uploads || {})[key];

export const xOfKey = (t, key) => key[0] === '@' ? (t.extras || []).find(x => x.kind === 'image' && x.id === key.slice(1).split('~')[0]) : null;

// v84: khối ảnh tự do có thể nhiều ảnh cạnh nhau (x.n = 2..4); ảnh thứ j (j ≥ 1) có khóa '@<id>~<j>'
export const gtN = x => Math.min(4, Math.max(1, x.n || 1));

export const gtKeys = x => Array.from({ length: gtN(x) }, (_, j) => '@' + x.id + (j ? '~' + j : ''));

export const a4autoDef = () => Math.round(22 * 14 / fontPt());

export function a4autoMax(t) { const p = t.answer.params || {}; return p.autoMax || a4autoDef(); }

export function a4dir(t, item) {
  const p = pOf(t, item); let d = p.dir || 'auto';
  if (d === 'auto') {
    // Tự động (v77): quá dài thì xếp dọc; vừa một hàng cột đều thì Ngang; còn lại Tự xuống dòng (không gãy chữ trong ô).
    const ml = Math.max(0, ...its(t).flatMap(i => (i.opts || []).map(o => String(o).replace(/<[^>]*>|\*+/g, '').length))), n = Math.max(0, ...its(t).map(i => (i.opts || []).length));   // v106: đo chữ thật, không tính thẻ <u> / ** (đáp án gạch chân bị coi là dài nên xuống dòng lệch cột)
    // v108: luôn thẳng cột giữa các câu: cột đều không vừa thì cột co theo chữ (dùng chung cả Task, 'hc'), rồi 2 cột, rồi dọc; Tự xuống dòng chỉ khi người dùng chọn
    const mm = k => k * fontPt() * 0.3528 * 0.5, cw = mm(ml) + 14;
    const tight = [...Array(n).keys()].reduce((s, j) => s + mm(Math.max(0, ...its(t).map(i => String((i.opts || [])[j] ?? '').replace(/<[^>]*>|\*+/g, '').length))) + 7, 0) + (n - 1) * 7;
    d = ml > a4autoMax(t) ? 'v' : n * cw <= 150 ? 'h' : tight <= 160 ? 'hc' : n > 2 && 2 * cw <= 150 ? 'g2' : 'v';
  }
  return d === 'h' ? 'h' : d;
}

// v81: câu ví dụ hiện sẵn đáp án (key) trong chỗ trả lời
// v95: Q2 viết câu với gạch tính từ câu hỏi (điểm bắt đầu cuối câu / dòng dưới, chiều dài cố định / hết dòng, số hàng): dùng bộ dựng a2inline trên "câu + ___"
export const q2end = t => t.answer.kind === 'sentence' && t.answer.layout === 'A2' && t.answer.attach === 'item' && !!(t.answer.params || {}).lenMode && qOf(t) === 'Q2';

// GĐ0 phiếu tương tác: data-ans = mã chỗ trả lời (core/slots.js; data-slot đã dùng cho ô ảnh). Chỉ thêm thuộc tính, không đổi hình.
// sk = { base, ofs, multi }: chỗ thứ j (từ 1) trong một đoạn chữ → base hoặc base.(ofs + j)
export const slotAt = id => id ? ` data-ans="${id}"` : '';
export const skId = (sk, j) => !sk ? '' : sk.multi ? `${sk.base}.${sk.ofs + j}` : sk.base;
export const skOf = (t, q, n) => q && q.id && !q.ex && !q.gt ? { base: `${t.id}.${q.id}`, ofs: 0, multi: n > 1 } : null;
const nGaps = x => (pkSrc(x).match(/___/g) || []).length;
// Câu nhiều dòng (ô lưới T5): mã chỗ của từng dòng, đánh số liên tục qua các dòng
export function linesSk(t, it) {
  const inl = t.answer.attach === 'inline' && t.answer.layout === 'A4', cnt = l => inl ? (String(l).match(/\{[^{}|]+(?:\|[^{}|]+)+\}/g) || []).length : (String(l).match(/___/g) || []).length;
  const tot = inl ? pkGroups(it).length : nGaps(it); let o = 0;
  return it.lines.map(l => { const sk = it.id && !it.ex ? { base: `${t.id}.${it.id}`, ofs: o, multi: tot > 1 } : null; o += cnt(typeof l === 'string' ? l : (l && l.text) || ''); return sk; });
}

export function ans(t, item, sk) { if (item && typeof item === 'object' && !item.gt && q2end(t)) return ''; const h = ans0(t, item, sk); return item && typeof item === 'object' && item.ex && String(item.key ?? '').trim() ? exFill(t, item, h) : h; }

// v90: thứ tự xáo vế phải bài nối: cố định theo mã Task + số lần "Xáo lại", tránh để vế nào đứng yên chỗ
export function pairPerm(t, n) {
  const idx = [...Array(n).keys()]; if (n < 2) return idx;
  let h = 2166136261; String(t.id + ':' + (t.content.shufSeed || 0)).split('').forEach(ch => { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }); h = h || 1;
  const rnd = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296; };
  for (let k = 0; k < 30; k++) { for (let i = n - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; } if (idx.every((v, i) => v !== i)) break; }
  return idx;
}

export const keyGaps = x => String(x.key ?? '').split(/\s*\|\s*/).map(v => v.trim());

export function exPicks(t, item, opts) { const r = []; keyParts(item).forEach(k => { const i = exPick(t, { key: k }, opts); if (i >= 0 && !r.includes(i)) r.push(i); }); if (!r.length) { const i = exPick(t, item, opts); if (i >= 0) r.push(i); } return r; }

export function exPick(t, item, opts) { const k = String(item.key).trim(), L = k.toLowerCase(); if (/^[a-h]$/i.test(k) && opts.length > 1 && !opts.some(o => String(o).trim().toLowerCase() === L)) return 'abcdefgh'.indexOf(L); return opts.findIndex(o => String(o).replace(/<[^>]+>|\*/g, '').trim().toLowerCase() === L); }

export function exFill(t, item, h) {
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
export function ansI(t, item, j) { const h = ans0(t, item); return item.ex && String(item.key ?? '').trim() && t.answer.layout === 'A5' ? (exPicks(t, item, item.imgs || []).includes(j) ? h.replace('class="a a5"', 'class="a a5 pk"') : h) : h; }

export function ans0(t, item, sk) {
  const a = t.answer, p = pOf(t, item), age = AGE[ws.age], key = item && typeof item === 'object' ? item.id : null;
  const sid = sk === false ? '' : typeof sk === 'string' ? sk : key && !item.ex && !item.gt && a.layout !== 'A8' && !(a.layout === 'A1' && p.frame === 'box') && !(a.attach === 'inline' && a.layout === 'A4') ? `${t.id}.${key}` : '';
  const nd = `data-node="${t.id}:G3${key ? ':' + key : ''}"${p.align ? ` data-aa="${p.align}"` : ''}${slotAt(sid)}`;
  const lh = Math.max(p.lineMm || age.line, age.line), aw = p.w ? `;--aw:${p.w}` : '', as = p.size ? ` style="--as:${p.size}mm"` : '';
  switch (a.layout) {
    case 'A1': if (p.frame === 'box') return `<div class="a a1 abox" ${nd} style="--bh:${p.boxH || 80}mm${aw}"></div>`;
      return `<div class="a a1${p.ruling === '4' ? ' r4' : ''}" ${nd} style="--lh:${lh}mm${aw}">${'<div class="ln"></div>'.repeat(p.lines || 1)}</div>`;
    case 'A2': { const w = p.lenMode ? (a2cfg(t, item).mm + 'mm') : ((p.width || (item && item.len ? item.len + 4 : 10)) + 'ch');
      return `<span class="a a2" ${nd} style="width:${w}${p.width && !p.lenMode ? ' !important' : ''}"></span>`; }
    case 'A3': return `<span class="a a3" ${nd}${p.boxW ? ` style="--bw:${p.boxW}mm"` : ''}>${'<i></i>'.repeat((item && item.len) || p.boxes || 6)}</span>`;
    case 'A4': { const d = a4dir(t, item), os = item.opts || [], up = p.upper ? 'ABCD' : 'abcd';
      // v108: a/b/c thẳng cột giữa các câu: Ngang lấy số cột theo câu nhiều lựa chọn nhất; có Căn lề (cột co theo chữ) thì mỗi ô kèm bản ẩn mọi lựa chọn cùng cột trong Task, cột rộng theo lựa chọn dài nhất
      const oc = d === 'g2' ? 2 : d === 'h' || d === 'hc' ? Math.max(os.length, ...its(t).filter(i => i && i.opts && a4dir(t, i) === d).map(i => i.opts.length)) : os.length;
      const col = i => d === 'g2' ? i % 2 : i, sz = i => d === 'hc' || p.align && (d === 'h' || d === 'g2') ? `<span class="osz" aria-hidden="true">${its(t).flatMap(x => (x && x.opts && a4dir(t, x) === d ? x.opts : []).filter((_, k) => col(k) === col(i))).map(x => `<span>${er(x)}</span>`).join('')}</span>` : '';
      return `<div class="a a4 ${d}" ${nd} style="--oc:${oc}${p.gap != null ? `;--og:${p.gap}mm` : ''}">${os.map((o, i) => `<span class="opt">${p.lab === 'circle' ? `<b>${up[i]}</b>` : p.lab === 'box' ? '<b class="bx"></b>' : `<i>${up[i]}.</i>`}<span>${er(o)}${sz(i)}</span></span>`).join('')}</div>`; }
    case 'A5': return `<span class="a a5" ${nd}${as}></span>`;
    case 'A6': { const lb = Array.isArray(p.labs) && p.labs.length >= 2 ? p.labs.slice(0, 3) : null; return `<span class="a a6${lb ? ' lb' : ''}" ${nd}${as}>${(lb || ['T', 'F']).map(x => `<span>${esc(x)}</span>`).join('')}</span>`; }
    case 'A7': return `<span class="a a7" ${nd}${as}></span>`;
    case 'A8': return `<div class="a a8${p.ruling === '4' ? ' r4' : ''}" ${nd} style="--lh:${lh}mm${aw}">${`<span>${esc(item && typeof item === 'object' ? item.text : item)}</span>`.repeat(p.repeat || 3)}</div>`;
  }
  return '';
}

// A2 (ô trống): độ dài hết lề phải / cố định (mm), số dòng, vị trí dòng đầu (cạnh chữ / hàng dưới).
export const A2MM = { '5-6': 40, '7-9': 35, '10-12': 30 };

export function a2cfg(t, item) {
  const p = pOf(t, item), mode = p.lenMode || 'legacy';
  return { mode, mm: p.lenMm || A2MM[ws.age] || 35, lines: Math.max(1, p.lines || 1), start: p.start === 'below' ? 'below' : 'inline', ch: p.width };
}

// Chỗ trống cuối câu (sau nó chỉ còn dấu câu) mới kéo dài / nhiều dòng được; chỗ trống giữa câu luôn là gạch cố định.
export function a2end(raw) { const i = raw.lastIndexOf('___'); return i >= 0 && /^\s*[.?!…:,;]*\s*$/.test(raw.slice(i + 3)); }

export function a2inline(t, raw, num, item, sk) {
  const c = a2cfg(t, item), key = item && item.id, nd0 = `data-node="${t.id}:G3${key ? ':' + key : ''}"`, parts = raw.split('___'), last = parts.length - 2;
  if (sk === undefined) sk = skOf(t, item, parts.length - 1);
  const nd = j => nd0 + slotAt(skId(sk, j));
  const fixedW = c.mode === 'legacy' ? `${(c.ch || 10)}ch` : `${c.mm}mm`;
  const fixedBlank = j => `<span class="a a2" ${nd(j)} style="width:${fixedW}"></span>`;
  const lab = () => num ? `(${num()}) ` : '';
  const eligible = a2end(raw) && (c.mode === 'fill' || c.lines > 1 || c.start === 'below');
  if (!eligible) return parts.reduce((a, part, i) => a + (i ? lab() + fixedBlank(i) : '') + er(part).replace(/\n/g, '<br>'), '');
  // chỗ trống cuối câu: dựng hàng flex để gạch kéo dài hết phần còn lại của dòng cuối
  const tok = '\u0001', head = parts.slice(0, -1).map((x, i) => rich(esc(x), true).replace(/\s*\n\s*/g, ' \u0002 ') + (i < last ? lab() + tok : '')).join('');
  let gi = 0;
  const words = head.split(/\s+/).filter(Boolean).map(w => w === '\u0002' ? '<span class="brk"></span>' : `<span class="w">${w.split(tok).map((x, ix) => ix ? fixedBlank(++gi) + x : x).join('')}</span>`);
  const tail = parts[parts.length - 1].trim(), keepTail = /[?!:…]/.test(tail) ? tail.replace(/[.,;]/g, '') : '';
  const label = lab();
  let row = words.join(''), extra = c.lines - 1;
  if (c.start === 'inline') {
    row += label ? `<span class="w">${label.trim()}</span>` : '';
    row += c.mode === 'fill' ? `<span class="a fl" ${nd(last + 1)}></span>` : `<span class="a a2 nofl" ${nd(last + 1)} style="width:${fixedW}"></span>`;
    row += tail ? `<span class="w tl">${esc(tail)}</span>` : '';
  } else { extra = c.lines; if (label) row += `<span class="w">${label.trim()}</span>`; if (keepTail) row += `<span class="w tl">${esc(keepTail)}</span>`; }
  const xl = Array.from({ length: Math.max(0, extra) }, () => `<span class="a xl" ${nd(last + 1)} style="${c.mode === 'fill' ? '' : `width:${c.mm}mm;`}--lh2:${AGE[ws.age].line}mm"></span>`).join('');
  return `<span class="a2box"><span class="fr">${row}</span>${xl}</span>`;
}

// A4 trong câu: {a|b|c} trong text hiện thành "a / b / c", mỗi lựa chọn in đậm. Chỉ áp khi answer.attach = inline và layout A4.
export const CHOICE_RE = /\{([^{}|]+(?:\|[^{}|]+)+)\}/g;

export const pkPre = s => String(s).replace(/\{([^{}|]+(?:\|[^{}|]+)+)\}/g, (m, g) => '{' + g.split('|').map(o => o.replace(PK_STAR, '$1\u0003')).join('|') + '}');

export const pkB = o => { const ok = o.includes('\u0003'); return `<b${ok ? ' class="ok"' : ''}>${o.replace(/\u0003/g, '').trim()}</b>`; };

export function inlChoice(t, escaped, sk) {
  let j = 0;
  return escaped.replace(CHOICE_RE, (m, g) => `<span class="a a4i" data-node="${t.id}:G3"${slotAt(skId(sk, ++j))}>${g.split('|').map(pkB).join('&nbsp;/ ')}</span>`);
}

export function qtext(t, q, sk) {
  let h = qtext0(t, q, sk); const p = t.answer.params || {};
  if (p.ulab && t.answer.kind === 'choice') { let n = 0; h = h.replace(/<u>([\s\S]*?)<\/u>/g, (m, x) => `<span class="ulb"><u>${x}</u><i>${(p.upper ? 'ABCDEFGH' : 'abcdefgh')[n++] || ''}</i></span>`); }
  if (q && q.ex && t.answer.attach === 'inline' && t.answer.layout === 'A4') h = h.replace(/<b class="ok">/g, '<b class="pk">');   // v89: câu ví dụ khoanh sẵn vế có *
  h = h.replace(/<b class="ok">/g, '<b>').replace(/\u0003/g, '');
  if (q && q.ex && p.ulab && String(q.key ?? '').trim()) { const L = String(q.key).trim().toUpperCase(); h = h.replace(/<span class="ulb">([\s\S]*?)<i>([A-Ha-h])<\/i><\/span>/g, (m, u, c) => c.toUpperCase() === L ? `<span class="ulb pk">${u}<i>${c}</i></span>` : m); }
  if (q && q.ex && String(q.key ?? '').trim() && (t.answer.attach === 'inline' || q2end(t))) {
    const k = esc(String(q.key).trim());
    if (t.answer.layout === 'A4') { const L = k.toLowerCase(); h = h.replace(/<b>([^<]*)<\/b>/g, (m, x) => x.trim().toLowerCase() === L ? `<b class="pk">${x}</b>` : m); }
    else { const g = keyGaps(q); let j = 0; h = g.length > 1 ? h.replace(/(<span class="(?:a (?:a2|fl)[^"]*|gap)"[^>]*>)(<\/span>)/g, (m, a, b) => `${a}<span class="exk">${esc(g[j++] || '')}</span>${b}`) : h.replace(/(<span class="(?:a (?:a2|fl)[^"]*|gap)"[^>]*>)(<\/span>)/, `$1<span class="exk">${k}</span>$2`); }   // v91: nhiều chỗ trống
  }
  if (p.ulab && t.answer.kind === 'choice' && q && q.id && !q.ex) h = h.replace(/<span class="ulb( pk)?">/g, m => m.slice(0, -1) + slotAt(`${t.id}.${q.id}`) + '>');   // tìm lỗi sai: mỗi phần gạch chân là một lựa chọn của câu
  return h;
}

export function qtext0(t, q, sk) {
  const s = er(q.text || ''), br = h => h.replace(/\n/g, '<br>');   // câu nhiều dòng (dòng thụt lề trong MD): \n trong chữ câu là xuống dòng
  if (q && !q.gt && q2end(t)) return a2inline(t, String(q.text || '').replace(/\s+$/, '') + ' ___', null, q, sk !== undefined ? sk : skOf(t, q, 1));
  if (t.answer.attach === 'inline' && t.answer.layout === 'A4') return br(inlChoice(t, s, sk !== undefined ? sk : skOf(t, q, pkGroups(q).length)));
  if (t.answer.attach === 'inline' && (q.text || '').includes('___')) { if (t.answer.layout === 'A2') return a2inline(t, q.text, null, q, sk); const ps = s.split('___'), k0 = sk !== undefined ? sk : skOf(t, q, ps.length - 1); return br(ps.reduce((a, x, i) => a + (i ? ans(t, q, skId(k0, i)) : '') + x, '')); }
  return br(s.replace(/___/g, '<span class="gap"></span>'));
}

/* ---- Ô chữ giải đố (v78): bảng có layout.table.cross = true. Ô: '' hoặc '#' = không có ô; '.' = ô trống chưa biết đáp án; 'A' = ô có đáp án A; '(A)' = chữ cho sẵn ---- */
export function crossCell(v) { if (typeof v !== 'string') return { k: 'none' }; const x = v.trim(); if (!x || x === '#') return { k: 'none' }; if (x === '.') return { k: 'empty' }; const m = /^\((.)\)$/.exec(x); return m ? { k: 'given', ch: m[1] } : { k: 'ans', ch: x[0] }; }

export function crossHtml(t) {
  const c = t.content, o = tblOpts(t), mat = c.rows.map(r => r.cells.map(crossCell)), n = c.cols.length, a = (r, k) => !!(mat[r] && mat[r][k] && mat[r][k].k !== 'none');
  let num = 0; const cells = [];
  mat.forEach((row, r) => row.forEach((x, k) => {
    if (x.k === 'none') { cells.push('<span class="xs"></span>'); return; }
    const st = (!a(r, k - 1) && a(r, k + 1)) || (!a(r - 1, k) && a(r + 1, k)), nn = st ? ++num : 0, show = x.k === 'given' || (o.key && x.k === 'ans');
    cells.push(`<span class="xc${x.k === 'given' ? ' gv' : ''}"${x.k === 'ans' || x.k === 'empty' ? slotAt(`${t.id}.cell.${c.rows[r].id}.${k}`) : ''}>${nn ? `<i class="xn">${nn}</i>` : ''}${show ? esc(x.ch.toUpperCase()) : ''}</span>`);
  }));
  const al = (t.layout.table || {}).align || 'center';
  return `<div class="g2 xg ${al === 'left' ? 'xl' : al === 'right' ? 'xr' : 'xm'}" data-node="${t.id}:G2" style="--xn:${n};--xc:${o.xc || 10}mm">${cells.join('')}</div>`;
}

export const TBL_ROW_MM = 12;   // chiều cao hàng tối thiểu mặc định (mm), áp dụng cho mọi hàng kể cả hàng tiêu đề

export const TBL_DEF = { head: true, rowHead: true, num: true, lines: 'all', fh: true, fc: false, fr: 'none', cols: 'first', first: 34, align: 'left', minH: null, repeat: true, split: true, rows: 'auto', cw: null, rhs: null };

export const tblOpts = t => {
  const o = Object.assign({}, TBL_DEF, t.layout.table || {}), u = t.layout.table || {};
  o.nm = u.nm !== undefined ? u.nm : (u.num === false ? 'off' : 'out'); o.num = o.nm === 'out';
  if (o.fc) o.fr = 'none'; // đã tô cột đầu thì các hàng không tô
  return o;
};

export function range(arr, frag) { const out = arr.map((x, i) => [x, i]); return frag ? out.slice(frag.a, frag.b + 1) : out; }

export const JS = { left: 'start', center: 'center', right: 'end' };

export const AI = { top: 'start', center: 'center', bottom: 'end' };

export function withMarks(t, h) {
  const im = t.image; if (!im || !Array.isArray(im.marks)) return h;
  const mk = im.mk || {}, sh = mk.shape === 'square' ? 'square' : 'circle', bl = mk.label === 'none';
  const dots = im.marks.map((m, i) => `<span class="mkd mk-${sh}${bl ? ' blank' : ''}" data-i="${i}" style="left:${m.x}%;top:${m.y}%">${bl ? '' : i + 1}</span>`).join('');
  return h.replace(/<\/div>$/, `<div class="mk">${dots}</div></div>`);
}

export const gtInline = x => er(x);

export function gtBody(text) {
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

export function gtHtml(t, x, where) {
  if (x.kind === 'image') { const n = gtN(x); return `<div class="gt gt-${where}" data-node="${t.id}:GT:${x.id}"${x.align ? ` data-ga="${x.align}"` : ''}><div class="gti${n > 1 ? ' gtm' : ''}" style="--gw:${x.w || (n > 1 ? 100 : 50)}%;--gn:${n}">${gtKeys(x).map(key => pic(x.label || 'ảnh', '', srcOf(t, key), { slot: key, ar: imgArOf(t, key) || '4/3' })).join('')}</div></div>`; }
  const empty = !String(x.text || '').trim(), sz = x.size && FSZ[ws.age][x.size] ? `font-size:${FSZ[ws.age][x.size]}pt` : '';
  return `<div class="gt gt-${where} gt-${x.frame || 'none'}${empty ? ' gt-empty' : ''}" data-node="${t.id}:GT:${x.id}"${x.align ? ` data-ga="${x.align}"` : ''}${x.cols === 2 ? ' data-gc="2"' : ''}${sz ? ` style="${sz}"` : ''}><div class="gtb">${empty ? 'Khối chữ trống (nhập ở cột trái)' : gtBody(x.text)}</div></div>`;
}

// v97: Căn lề Khối text (hướng dẫn G0, bài đọc / lời dẫn G2, khối tự do chữ). Phiếu cũ: "Căn chữ bài đọc: Đều hai bên" của Ảnh trong bài đọc (layout.align) vẫn là Hai bên.
// Lề phải của hướng dẫn: hướng dẫn nằm trong cột chữ của G0, bên trái mã QR file nghe, nên căn Phải / Giữa / Hai bên tính tới mép trái mã QR.
export const TA = [['left', 'Trái'], ['center', 'Giữa'], ['right', 'Phải'], ['justify', 'Hai bên']];

export function taOf(t) { const L = t.layout || {}; if (L.ta && TA.some(x => x[0] === L.ta)) return L.ta; return L.align === 'justify' && layoutOf(t) === 'T8' ? 'justify' : 'left'; }

export function renderTask(t, frag, mt) {
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
export const nlab = (t, n) => t && t.layout && t.layout.nlab === 'a' && n >= 1 && n <= 26 ? String.fromCharCode(96 + n) : n;

export const ino = (n, i, t) => n === 1 ? '<span class="ino" style="visibility:hidden" aria-hidden="true">1</span>' : `<span class="ino">${nlab(t, i + 1)}</span>`;

// v81: câu ví dụ (ex) mang số 0 và hiện sẵn đáp án; dòng chữ giữa các câu (G3-Text, gt) không có số, không tính vào số câu
export const qReal = t => its(t).filter(x => !x.ex && !x.gt);

export function qnum(t, i) { const it = its(t), x = it[i]; if (!x) return i + 1; if (x.ex) return 0; let n = 0; for (let j = 0; j <= i; j++) if (!it[j].ex && !it[j].gt) n++; return n; }

export const inoT = (t, i) => { const x = its(t)[i]; if (x && x.ex) return '<span class="ino ex">0</span>'; return ino(its(t).some(y => y.ex) ? 2 : qReal(t).length, qnum(t, i) - 1, t); };

export const inoN = (t, i) => { const x = its(t)[i]; return `<span class="ino${x && x.ex ? ' ex' : ''}">${x && x.ex ? 0 : nlab(t, qnum(t, i))}</span>`; };

export const qwho = q => q && q.who != null ? `<b class="qwho">${esc(q.who)}:</b>` : '';

export const g3row = (t, q) => `<div class="q g3t"><span class="ino" style="visibility:hidden" aria-hidden="true">0</span><div class="qb"><div class="qt">${er(q.text || '')}</div></div></div>`;

export const leadIntro = t => t.content.lead && t.content.lead.kind === 'text' && leadText(t) ? `<div class="dl intro">${er(leadText(t))}</div>` : '';

// Khung từ (G4): chữ rời / danh sách, hoặc ảnh (v81: lưới ô cùng cỡ, nhãn A B C, chú thích dưới ảnh). Không trộn chữ và ảnh.
export function g4Html(t) {
  const wb = t.wordBank, id = t.id, lab = i => !wb || wb.label === 'none' ? '' : (wb.label === 'upper' ? 'ABCDEFGHIJ' : 'abcdefghij')[i] + '.';
  const wbst = wb.placement !== 'right' && wb.w ? ` style="width:${wb.w}%;justify-self:${JS[wb.align || 'center']}"` : '';
  if (wb.kind === 'image') { const n = wb.words.length, lb = wb.label === 'none' ? '' : wb.label === 'upper' ? 'ABCDEFGHIJ' : 'abcdefghij', wc = wb.cols || Math.max(1, Math.min(n, wb.placement === 'right' ? 1 : 5));
    return `<div class="g4 wimg" data-node="${id}:G4" style="--wc:${wc}${wb.placement !== 'right' && wb.w ? `;width:${wb.w}%;justify-self:${JS[wb.align || 'center']}` : ''}">${wb.words.map((w, i) => `<div class="wim">${lb ? `<b>${lb[i] || ''}</b>` : ''}${ownFit(t, 'B.' + i, pic(w || 'ảnh', '', srcOf(t, 'B.' + i), { slot: 'B.' + i, ar: wb.ar || '1/1' }), wb.frame)}${w && wb.cap !== false ? `<span>${er(w)}</span>` : ''}</div>`).join('')}</div>`; }
  return wb.style === 'list'
    ? `<div class="g4 wlist" data-node="${id}:G4"${wbst}>${wb.words.map((w, i) => `<div class="wi">${lab(i) ? `<i>${lab(i)}</i>` : ''}<span>${er(w)}</span></div>`).join('')}</div>`
    : `<div class="g4" data-node="${id}:G4"${wbst}>${wb.words.map(w => `<span>${er(w)}</span>`).join('')}</div>`;
}

// Khung từ đặt dưới (v81): nằm cuối Task, chỉ ở mảnh cuối khi Task bị cắt trang
export function body(t, L, frag, first, last) {
  const h = body0(t, L, frag, first), wb = t.wordBank;
  if (!wb || wb.placement !== 'bottom' || !(last ?? (!frag || frag.last)) || ck(t) === 'empty') return h;
  return h.replace(/<\/div>$/, g4Html(t) + '</div>');
}

// v84: ảnh chung ở các dạng không có chỗ riêng cho ảnh (lưới ảnh, nối, hội thoại, tô chữ, bảng): đặt trên cùng thân Task
export const G1_TOP = ['items', 'pairs', 'dialogue', 'trace', 'table'];

export function body0(t, L, frag, first) {
  const h = body0n(t, L, frag, first);
  if (!t.image || !first || !G1_TOP.includes(ck(t))) return h;
  return h.replace(/^<div class="body b1">/, m => m + g1Of(t, L));
}

export function g1Of(t, L) { const id = t.id; return `<div class="g1${t.image.two ? ' g1two' : ''}" data-node="${id}:G1">${withMarks(t, pic(t.image.label, t.image.size === 'large' && L === 'T1' ? 'big' : '', srcOf(t, 'G1'), { slot: 'G1', gar: t.image.ar }))}${t.image.two ? ownFit(t, 'G1b', pic(t.image.label2 || 'ảnh 2', '', srcOf(t, 'G1b'), { slot: 'G1b', gar: t.image.ar }), g1bFit(t)) : ''}</div>`; }

export function body0n(t, L, frag, first) {
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
        const tsl = !r.head && rid && !isRH ? (v && typeof v === 'object' && v.ans != null) || (v === '' && !isGridTbl(t)) ? `${id}.cell.${rid}.${ci2 - (rh ? 1 : 0)}` : v && typeof v === 'object' && v.tick ? `${id}.cell.${rid}` : '' : '';
        let bd = isRH && v && typeof v === 'object' ? `<span class="rhx">${sk ? tpic(t, sk, v.img, 'sm') : pic(v.img, 'sm')}<span>${esc(v.text || '')}</span></span>` : cellHtml(v, sk);
        if (tsl && v && v.tick) bd = bd.replace(/(<span class="a a5[^"]*")/, `$1${slotAt(tsl)}`);
        if (o.nm === 'in' && ci2 === 0 && !r.head) bd = `<span class="nin"><span class="ino">${r.i + 1}</span><span class="nib">${bd}</span></span>`;
        return `<div class="${r.head ? 'th' : 'tc'}${isRH ? ' rh' : ''}${cc}" data-rk="${rk}"${rst} ${r.head ? '' : `data-node="${id}:G2"`}${tsl && !(v && v.tick) ? slotAt(tsl) : ''}>${bd}</div>`;
      }).join('');
    }).join('');
    return `<div class="body b1">${withBank(`<div class="g2 tg" data-node="${id}:G2" data-ln="${o.lines}" data-al="${o.align}" style="--tcols:${tpl};--nmw:${o.num ? 'var(--gut)' : '0px'};--rh:${rhmm}mm;--ta:${ta}${o.rows === 'equal' && nBody ? `;grid-template-rows:${showHead ? 'auto ' : ''}repeat(${nBody},1fr)` : ''}">${out}</div>`)}</div>`;
  }

  if (k === 'dialogue') {
    // v84: hội thoại cắt được theo lượt (Liền trang); số chỗ trống (1) (2)… đếm tiếp từ các lượt ở trang trước
    let n = frag ? c.items.slice(0, frag.a).reduce((a, l) => a + ((l.text || '').match(/___/g) || []).length, 0) : 0;
    const fill = (tx, li) => { const lid = c.items[li].id, g = (tx.match(/___/g) || []).length, sid = i => `${id}.${lid}${g > 1 ? '.' + i : ''}`; return t.answer.layout === 'A2' && t.answer.attach === 'inline' ? a2inline(t, tx, () => ++n, { id: lid }) : er(tx).split('___').reduce((a, part, i) => a + (i ? `(${++n}) ${ans(t, { id: lid }, sid(i))}` : '') + part, ''); };
    const intro = first ? leadText(t) : '', rows = (intro ? `<div class="dl intro">${er(intro)}</div>` : '') + range(c.items, frag).map(([l, li]) => `<div class="dl"><span class="who">${esc(l.who || '')}:</span><span>${fill(l.text || '', li)}</span></div>`).join('');
    return `<div class="body b1">${withBank(`<div class="g2 dialogue" data-node="${id}:G2">${rows}</div>`)}</div>`;
  }

  if (k === 'pairs' && c.shuffle) {   // v90: cặp gõ cạnh nhau = cặp đúng; vế trái giữ thứ tự, vế phải (cả vế thừa) in theo thứ tự xáo cố định
    const Ls = c.items.filter(x => x.pair && x.pair.l), Rs = c.items.filter(x => x.pair && x.pair.r), pm = pairPerm(t, Rs.length), n = Math.max(Ls.length, Rs.length);
    const hd = c.heads && c.heads.some(Boolean) ? `<div class="ml mh" data-node="${id}:G2">${esc(c.heads[0] || '')}</div><div class="md"></div><div class="mr mh" data-node="${id}:G2">${esc(c.heads[1] || '')}</div>` : '', mid = (t.answer.params || {}).mid, mdH = (l, r, it) => mid === 'box' ? `<div class="md mbox" data-node="${id}:G3">${l ? `<span class="a mbx" data-node="${id}:G3"${slotAt(`${id}.${it.id}`)}></span>` : ''}</div>` : mid === 'none' ? `<div class="md"></div>` : `<div class="md" data-node="${id}:G3">${l ? ans(t, it) : '<span></span>'}${r ? ans(t, it, false) : '<span></span>'}</div>`;   // v105: tiêu đề hai cột; giữa = chấm nối / ô viết chữ / không có
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
    const hd = c.heads && c.heads.some(Boolean) ? `<div class="ml mh" data-node="${id}:G2">${esc(c.heads[0] || '')}</div><div class="md"></div><div class="mr mh" data-node="${id}:G2">${esc(c.heads[1] || '')}</div>` : '', mid = (t.answer.params || {}).mid, mdH = (l, r, it) => mid === 'box' ? `<div class="md mbox" data-node="${id}:G3">${l ? `<span class="a mbx" data-node="${id}:G3"${slotAt(`${id}.${it.id}`)}></span>` : ''}</div>` : mid === 'none' ? `<div class="md"></div>` : `<div class="md" data-node="${id}:G3">${l ? ans(t, it) : '<span></span>'}${r ? ans(t, it, false) : '<span></span>'}</div>`;   // v105: tiêu đề hai cột; giữa = chấm nối / ô viết chữ / không có
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
          ? ((sks) => it.lines.map((l, li) => `<div class="cl">${qtext(t, { text: l }, sks[li])}</div>`).join(''))(linesSk(t, it))
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

export function place(L, g1, main) {
  if (!g1 || L === 'T1' || L === 'T6') return `<div class="body b1">${g1}${main}</div>`;
  if (L === 'T2') return `<div class="body b2"><div class="col colL colI">${g1}</div><div class="col">${main}</div></div>`;
  if (L === 'T3') return `<div class="body b3"><div class="col colL">${main}</div><div class="col colI">${g1}</div></div>`;
  return `<div class="body b1">${g1}${main}</div>`;
}


/* ================= Đo & phân trang ================= */
// ô đo ẩn #measure (React dựng): tìm khi cần, không lấy lúc nạp module (lúc đó React chưa gắn)
export const measEl = () => document.getElementById('measure');

export function measure(t, frag) { const meas = measEl(); meas.innerHTML = renderTask(t, frag); return meas.firstElementChild.getBoundingClientRect().height; }

export function units(t) {
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
export const leadOf = t => ck(t) === 'passage' && layoutOf(t) === 'T8';

// Gợi ý sửa nhanh cho một Task bị tràn
export function fixesFor(t) {
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

export function paginate() {
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
  measEl().innerHTML = '';
  return { pages, diags, H };
}

// ---- Mã QR nghe: link (tự sinh mã) hoặc ảnh mã tải sẵn hoặc file nghe (hệ thống tự tạo link rồi sinh mã) ----
export function qrUrl(t) {
  const q = t.qr; if (!q) return ''; const v = String((q.src === 'file' ? q.url : q.link) || '').trim(); if (!v) return '';
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return v;
  const b = String(ws.audioBase || '').trim().replace(/\/+$/, ''); return b ? b + '/' + v.replace(/^\/+/, '') : v;
}

export function qrInner(t) {
  const q = t.qr; if (!q) return '';
  if (q.src === 'img') return q.img ? `<img src="${q.img}" alt="Mã QR nghe">` : '';
  const u = qrUrl(t); if (!u) return '';
  try { const g = qrcode(0, 'M'); g.addData(encodeURI(u)); g.make(); return g.createSvgTag({ cellSize: 1, margin: 0, scalable: true }); } catch (_) { return ''; }
}

export const qrHtml = t => { if (!t.audio) return ''; const h = qrInner(t); return h ? `<div class="qrb" title="Quét để nghe">${h}</div>` : ''; };

/* ================= Bước 3: ảnh thật + ô giữ chỗ ================= */
// Ô ảnh của một Task (theo thứ tự): khóa 'G1' hoặc '@<id câu>' / '@<id câu>.<j>' (đi theo câu khi đổi thứ tự)
export const AR_OPTS = [['1/1', '1:1'], ['4/3', '4:3'], ['3/4', '3:4'], ['16/9', '16:9']];

export const arLabel = a => { const o = AR_OPTS.find(x => x[0] === String(a)); if (o) return o[1]; const v = arNum(a); return v ? `${Math.round(v * 100) / 100}:1` : '4:3'; };

export const tblAr = t => (t.content && t.content.imgAr) || '4/3';

// v85: tỉ lệ THẬT của ảnh đã tải (để Fit tính đúng). imgAr[key] của ô còn là tỉ lệ khung (đổi bằng nút Tỉ lệ), nên ưu tiên kích thước gốc upMeta
// v85: ảnh có Fit riêng (ảnh thứ hai G1b, ảnh khung từ): gắn data-tf + tỉ lệ thật + zoom / lệch tâm vào ô ảnh. fr = { fit, zoom, ox, oy }
export function ownFit(t, key, h, fr) {
  if (!fr || !fr.fit || !srcOf(t, key)) return h;
  const st = `--iar:${natAr(t, key) || '4/3'};--ox:${fr.ox || 0};--oy:${fr.oy || 0};--z:${(fr.zoom || 100) / 100};`;
  h = h.replace('<div class="pic ', `<div data-tf="${fr.fit}" class="pic `);
  return /^<div [^>]*style="/.test(h) ? h.replace(/^(<div [^>]*?)style="/, `$1style="${st}`) : h.replace(/^<div /, `<div style="${st}" `);
}

export const g1bFr = t => cellFr(t, 'G1b');

// Ảnh thứ hai chưa chỉnh riêng thì theo Fit của ảnh 1, nhưng vẫn dùng tỉ lệ thật của chính nó (trước v85 bị méo theo tỉ lệ ảnh 1)
export const g1bFit = t => g1bFr(t).fit ? g1bFr(t) : fitOf(t) ? { fit: fitOf(t) } : null;

export const natAr = (t, key) => { const m = (t.upMeta || {})[key]; return m && m.w && m.h ? `${m.w}/${m.h}` : (t.imgAr || {})[key] || null; };

export const fixedImg = (t, key) => key !== 'G1' && !xOfKey(t, key);

export const imgArOf = (t, key) => key === 'G1' || key === 'G1b' ? (t.image && t.image.ar) || null : /^B\.\d+$/.test(key) ? (t.wordBank && t.wordBank.ar) || '1/1' : fixedImg(t, key) ? tblAr(t) : ((t.imgAr || {})[key] || null);

// Ảnh trong bảng: khung cố định theo tỉ lệ của bảng; ảnh nằm trong khung theo Fit / zoom / lệch tâm của từng ô
export function tpic(t, key, label, cls) {
  const src = srcOf(t, key), f = cellFr(t, key.slice(1)); let h = pic(label, cls, src, { slot: key, ar: tblAr(t) });
  if (!src || !f.fit) return h;
  return h.replace('<div class="pic ', `<div data-tf="${f.fit}" class="pic `).replace('style="', `style="--iar:${natAr(t, key) || tblAr(t)};--ox:${f.ox || 0};--oy:${f.oy || 0};--z:${(f.zoom || 100) / 100};`);
}

export function qOf(t) { const d = qDerived(t); if (d) return d; if (ck(t) === 'empty') return QN[t.q] ? t.q : null; return QN[t.q] ? t.q : (ck(t) === 'dialogue' ? 'Q1' : 'Q2'); }

// Hai ảnh chung: chỉ Xếp dọc. Câu hỏi trước bài đọc: không đặt bài đọc cạnh câu hỏi / bao quanh ảnh
export const qFirst = t => t.layout.order === 'qfirst' && ck(t) === 'passage';

layoutReasons = (f => t => { const r = f(t); if (t.image && t.image.two) ['T2', 'T3', 'T8'].forEach(k => { if (k in r && !r[k]) r[k] = 'Hai ảnh chung đứng cạnh nhau phía trên: chỉ dùng Xếp dọc'; });
  if (qFirst(t)) ['T4', 'T8'].forEach(k => { if (k in r && !r[k]) r[k] = 'Câu hỏi đặt trước bài đọc: bài đọc không nằm cạnh câu hỏi / bao quanh ảnh'; }); return r; })(layoutReasons);

autoLayout = (f => t => { const L = f(t); if (t.image && t.image.two && ['T2', 'T3', 'T8'].includes(L)) return 'T1'; if (qFirst(t) && ['T4', 'T8'].includes(L)) return t.image ? 'T1' : 'T6'; return L; })(autoLayout);
