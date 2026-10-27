// Bước 2b (docs/KE_HOACH_REACT.md): chuyển phần không giao diện của src/legacy/app.js sang src/core/*.js,
// giữ nguyên chữ từng khai báo (kể cả chú thích ngay trên), chỉ thêm "export" và import ngược lại vào app.js.
// Mỗi tầng = bao đóng phụ thuộc của vài hàm gốc, trừ các tầng dưới → tầng dưới không bao giờ gọi tầng trên.
// Trạng thái phiếu `ws` chuyển sang src/core/state.js (live binding), mọi phép gán `ws = …` thành `setWs(…)`.
//   node scripts/tach-core.mjs          (chạy một lần trên app.js vừa tách từ v106)
import fs from 'node:fs';
import { analyze, closure } from './phu-thuoc.mjs';

const LAYERS = [
  ['model', ['fillSheet', 'fillTask']],
  ['layout', ['renderTask', 'paginate']],
  ['md', ['readMd', 'readJson', 'looksJson', 'sheetToMd', 'taskToMd', 'impSheetObj']],
];
const STATE = ['ws'];

const P = new URL('../src/legacy/app.js', import.meta.url);
let code = fs.readFileSync(P, 'utf8');
const A = analyze(code);
// Hàm bị "vá" ở cấp cao nhất (f = (g => …)(f)): câu vá đi cùng hàm, phụ thuộc của câu vá tính vào hàm
const patches = A.stmts.filter(x => x.writes.length);
for (const x of patches) for (const w of x.writes) if (A.R[w]) x.refs.forEach(r => A.R[w].add(r));
const nodeNames = n => n.type === 'VariableDeclaration' ? n.declarations.map(d => d.id.name) : [n.id.name];

// 1. chia tầng
const taken = new Set(STATE), layers = [];
for (const [name, seeds] of LAYERS) {
  const set = new Set([...closure(A, seeds)].filter(k => !taken.has(k)));
  // cả nút khai báo đi cùng nhau
  for (const k of [...set]) nodeNames(A.decl[k]).forEach(x => { if (!taken.has(x)) set.add(x); });
  set.forEach(k => taken.add(k)); layers.push([name, set]);
}
// 2. kiểm tra: tầng dưới không tham chiếu tầng trên; không có phép gán vào tên bị chuyển (trừ ws)
const layerOf = Object.create(null); layers.forEach(([n, s], i) => s.forEach(k => { layerOf[k] = i; }));
for (const [n, s] of layers) for (const k of s) for (const r of A.R[k]) {
  if (STATE.includes(r)) continue;
  if (!(r in layerOf)) throw new Error(`${n}.${k} dùng ${r} còn ở legacy`);
  if (layerOf[r] > layerOf[k]) throw new Error(`${n}.${k} dùng ${r} ở tầng trên`);
}
const assigns = [];
(function w(x) { if (!x || typeof x !== 'object') return; if (Array.isArray(x)) return x.forEach(w);
  if ((x.type === 'AssignmentExpression' || x.type === 'UpdateExpression') && (x.left || x.argument).type === 'Identifier') assigns.push(x);
  for (const k in x) if (k !== 'type') w(x[k]); })(A.body);
const movedPatch = new Map();   // nút câu lệnh → tầng
for (const x of patches) {
  const L = x.writes.filter(w => w in layerOf);
  if (!L.length) continue;
  if (L.length !== x.writes.length || new Set(L.map(w => layerOf[w])).size > 1) throw new Error('câu vá ghi cả tên ở legacy: ' + code.slice(x.n.start, x.n.start + 80));
  const lw = layerOf[L[0]];
  for (const r of x.refs) if (!(r in layerOf) || layerOf[r] > lw) throw new Error('câu vá dùng tên ở legacy / tầng trên: ' + r);
  movedPatch.set(x.n, lw);
}
// Gán bên trong hàm vào tên bị chuyển: import chỉ đọc được, nên phải xem tay
const wIn = Object.keys(A.W).filter(k => k in layerOf);
if (wIn.length) throw new Error('có hàm gán vào tên bị chuyển (cần xem tay): ' + wIn.join(' '));

// 3. cắt khai báo (kèm chú thích / khoảng trắng ngay trước) theo thứ tự gốc
// kết thúc nút + chú thích "// …" cùng dòng (để chú thích đi theo khai báo của nó)
const endX = n => { const m = /^[ \t]*\/\/[^\n]*/.exec(code.slice(n.end, n.end + 400)); return n.end + (m ? m[0].length : 0); };
const body = A.body, pieces = layers.map(() => []), cut = [];
body.forEach((n, i) => {
  if (movedPatch.has(n)) { const from = i ? endX(body[i - 1]) : 0; pieces[movedPatch.get(n)].push(code.slice(from, endX(n)).replace(/^[ \t]*\n/, '')); cut.push([from, endX(n)]); return; }
  const ids = n.type === 'VariableDeclaration' || n.type === 'FunctionDeclaration' || n.type === 'ClassDeclaration' ? nodeNames(n) : [];
  if (!ids.length) return;
  if (ids.some(x => STATE.includes(x))) return;
  const L = ids.map(x => layerOf[x]).filter(x => x != null); if (!L.length) return;
  if (new Set(L).size > 1 || L.length !== ids.length) throw new Error('khai báo nhiều tên bị chia tầng: ' + ids.join(','));
  const from = i ? endX(body[i - 1]) : 0, pre = code.slice(from, n.start);
  pieces[L[0]].push(pre.replace(/^[ \t]*\n/, '') + 'export ' + code.slice(n.start, endX(n)));
  cut.push([from, endX(n)]);
});
// 4. ws → state.js
const wsDecl = A.decl.ws;
const repl = [...cut.map(([a, b]) => [a, b, ''])];
repl.push([wsDecl.start, wsDecl.end, code.slice(wsDecl.start, wsDecl.end).replace(/^let ws = (.*);$/s, 'setWs($1);')]);
assigns.filter(a => a.type === 'AssignmentExpression' && a.left.name === 'ws' && a.operator === '=').forEach(a => {
  // chỉ những phép gán tới biến toàn cục ws (không có ws cục bộ nào trong app.js: kiểm tra bằng phân tích phạm vi)
  repl.push([a.start, a.end, 'setWs(' + code.slice(a.right.start, a.right.end) + ')']);
});
repl.sort((x, y) => y[0] - x[0]);
for (const [a, b, s] of repl) code = code.slice(0, a) + s + code.slice(b);

const hdr = (n, deps) => `// src/core/${n}.js — tách nguyên văn từ v106 (app/scripts/tach-core.mjs). Không dùng trạng thái giao diện (chọn, cột trái, hoàn tác).\n` + deps + '\n';
const imp = (names, from) => names.length ? `import { ${names.join(', ')} } from '${from}';\n` : '';
layers.forEach(([n, s], i) => {
  const below = layers.slice(0, i).map(([m, t]) => imp([...t].filter(k => [...s].some(x => A.R[x].has(k))).sort(), `./${m}.js`)).join('');
  const st = [...s].some(x => A.R[x].has('ws')) ? `import { ws } from './state.js';\n` : '';
  fs.writeFileSync(new URL(`../src/core/${n}.js`, import.meta.url), hdr(n, st + below) + pieces[i].join('\n\n') + '\n');
});
fs.writeFileSync(new URL('../src/core/state.js', import.meta.url),
  `// Trạng thái phiếu đang mở. Module khác đọc \`ws\` (live binding), chỉ đổi qua setWs().\nexport let ws = null;\nexport function setWs(v) { ws = v; }\n`);
const head = `import { ws, setWs } from '../core/state.js';\n` + layers.map(([n, s]) => imp([...s].sort(), `../core/${n}.js`)).join('');
// gán ws trong mẫu phân rã (loadSheet khôi phục phiếu cũ khi nạp lỗi): bộ đóng gói báo lỗi gán vào import
const DS = '({ ws, base, hist, fut, sel, multi, lastStart, openTask } = old);';
if (code.split(DS).length !== 2) throw new Error('không thấy đúng một chỗ khôi phục phiếu cũ trong loadSheet');
code = code.replace(DS, 'setWs(old.ws); ({ base, hist, fut, sel, multi, lastStart, openTask } = old);');
fs.writeFileSync(P, head + code);
layers.forEach(([n, s]) => console.log(n, s.size, 'tên'));
console.log('ws gán lại:', repl.length - cut.length - 1, 'chỗ');
