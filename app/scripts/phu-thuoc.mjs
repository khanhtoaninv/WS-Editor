// Phân tích phụ thuộc giữa các tên cấp cao nhất của một file legacy (dùng khi tách module ở bước 2).
// Có xét phạm vi: tham số, biến cục bộ, khóa thuộc tính không bị tính là tham chiếu.
//   node scripts/phu-thuoc.mjs <file.js> <tên1,tên2,…> [why | path <tên> | list]
import { parseAst } from 'vite'; import fs from 'node:fs';

export function analyze(code) {
  const body = parseAst(code).body, decl = Object.create(null), kind = Object.create(null);
  for (const n of body) {
    const ids = n.type === 'VariableDeclaration' ? n.declarations.flatMap(d => patNames(d.id)) : (n.id ? [n.id.name] : []);
    ids.forEach(i => { decl[i] = n; kind[i] = n.type === 'VariableDeclaration' ? n.kind : n.type; });
  }
  const R = Object.create(null), W = Object.create(null);
  for (const n of new Set(Object.values(decl))) {
    const s = freeRefs(n, decl, W);
    const ids = n.type === 'VariableDeclaration' ? n.declarations.flatMap(d => patNames(d.id)) : [n.id.name];
    ids.forEach(i => { R[i] = s; });
  }
  // Câu lệnh cấp cao nhất không phải khai báo (vá hàm "f = (g => …)(f)", gán thuộc tính…): ghi lại tham chiếu và phép gán
  const stmts = body.filter(n => !/Declaration$/.test(n.type)).map(n => { const w = Object.create(null); return { n, refs: freeRefs(n, decl, w), writes: Object.keys(w) }; });
  return { body, decl, kind, R, W, stmts };
}

function patNames(p, out = []) {
  if (!p) return out;
  if (p.type === 'Identifier') out.push(p.name);
  else if (p.type === 'ObjectPattern') p.properties.forEach(x => patNames(x.type === 'RestElement' ? x.argument : x.value, out));
  else if (p.type === 'ArrayPattern') p.elements.forEach(x => patNames(x, out));
  else if (p.type === 'RestElement') patNames(p.argument, out);
  else if (p.type === 'AssignmentPattern') patNames(p.left, out);
  return out;
}

// Tên cấp cao nhất được tham chiếu tự do trong nút n
function freeRefs(top, decl, W) {
  const out = new Set();
  const hoist = (stmts, sc) => { for (const s of stmts || []) {
    if (s.type === 'FunctionDeclaration' && s.id) sc.add(s.id.name);
    else if (s.type === 'ClassDeclaration' && s.id) sc.add(s.id.name);
    else if (s.type === 'VariableDeclaration') s.declarations.forEach(d => patNames(d.id).forEach(x => sc.add(x)));
  } };
  const varHoist = (node, sc) => { (function w(x) { if (!x || typeof x !== 'object') return; if (Array.isArray(x)) return x.forEach(w);
    if (x !== node && /Function/.test(x.type)) return;
    if (x.type === 'VariableDeclaration' && x.kind === 'var') x.declarations.forEach(d => patNames(d.id).forEach(n => sc.add(n)));
    for (const k in x) if (k !== 'type') w(x[k]); })(node.body); };
  const has = (scopes, n) => scopes.some(s => s.has(n));
  function walk(x, scopes, parent, key) {
    if (!x || typeof x !== 'object') return;
    if (Array.isArray(x)) return x.forEach(y => walk(y, scopes, parent, key));
    if ((x.type === 'AssignmentExpression' || x.type === 'UpdateExpression') && W) {
      const t = x.left || x.argument; if (t.type === 'Identifier' && !has(scopes, t.name) && decl[t.name]) W[t.name] = true;
    }
    switch (x.type) {
      case 'Identifier':
        if (parent && ((parent.type === 'MemberExpression' && key === 'property' && !parent.computed)
          || ((parent.type === 'Property' || parent.type === 'MethodDefinition' || parent.type === 'PropertyDefinition') && key === 'key' && !parent.computed)
          || parent.type === 'LabeledStatement' || parent.type === 'BreakStatement' || parent.type === 'ContinueStatement')) return;
        if (!has(scopes, x.name) && decl[x.name]) out.add(x.name);
        return;
      case 'FunctionDeclaration': case 'FunctionExpression': case 'ArrowFunctionExpression': {
        const sc = new Set(); x.params.forEach(p => patNames(p).forEach(n => sc.add(n)));
        if (x.type === 'FunctionExpression' && x.id) sc.add(x.id.name);
        if (x.body && x.body.type === 'BlockStatement') { hoist(x.body.body, sc); varHoist(x, sc); }
        const S = [...scopes, sc];
        x.params.forEach(p => walk(p, S, x, 'params'));   // giá trị mặc định
        walk(x.body, S, x, 'body'); return; }
      case 'BlockStatement': case 'StaticBlock': { const sc = new Set(); hoist(x.body, sc); walk(x.body, [...scopes, sc], x, 'body'); return; }
      case 'ForStatement': case 'ForInStatement': case 'ForOfStatement': {
        const sc = new Set(); const init = x.init || x.left; if (init && init.type === 'VariableDeclaration') init.declarations.forEach(d => patNames(d.id).forEach(n => sc.add(n)));
        const S = [...scopes, sc]; for (const k of ['init', 'left', 'right', 'test', 'update', 'body']) walk(x[k], S, x, k); return; }
      case 'CatchClause': { const sc = new Set(patNames(x.param)); walk(x.body, [...scopes, sc], x, 'body'); return; }
      case 'ClassDeclaration': case 'ClassExpression': { walk(x.superClass, scopes, x, 'superClass'); walk(x.body, scopes, x, 'body'); return; }
      case 'VariableDeclarator': walk(x.id, scopes, x, 'id-skip'); walk(x.init, scopes, x, 'init'); return;
    }
    if (key === 'id-skip') { // mẫu khai báo: chỉ đi vào giá trị mặc định / khóa tính toán
      if (x.type === 'AssignmentPattern') { walk(x.left, scopes, x, 'id-skip'); walk(x.right, scopes, x, 'right'); return; }
      if (x.type === 'ObjectPattern') { x.properties.forEach(p => { if (p.computed) walk(p.key, scopes, p, 'kc'); walk(p.type === 'RestElement' ? p.argument : p.value, scopes, p, 'id-skip'); }); return; }
      if (x.type === 'ArrayPattern') { x.elements.forEach(e => walk(e, scopes, x, 'id-skip')); return; }
      if (x.type === 'RestElement') { walk(x.argument, scopes, x, 'id-skip'); return; }
      return;
    }
    for (const k in x) if (k !== 'type' && k !== 'start' && k !== 'end' && k !== 'range' && k !== 'loc') walk(x[k], scopes, x, k);
  }
  if (top.type === 'VariableDeclaration') top.declarations.forEach(d => walk(d, [], top, 'decl'));
  else if (top.type === 'FunctionDeclaration') walk(Object.assign({}, top, { type: 'FunctionExpression', id: null }), [], null, null);
  else walk(top, [], null, null);
  return out;
}

export function closure(A, seeds) {
  const seen = new Set(), q = [...seeds];
  while (q.length) { const k = q.pop(); if (seen.has(k) || !A.decl[k]) continue; seen.add(k); A.R[k].forEach(x => q.push(x)); }
  return seen;
}

if (import.meta.url === 'file://' + process.argv[1]) {
  const code = fs.readFileSync(process.argv[2], 'utf8'), A = analyze(code);
  const seeds = (process.argv[3] || '').split(',').filter(Boolean), seen = closure(A, seeds), mode = process.argv[4];
  const isState = k => A.kind[k] === 'let' || A.kind[k] === 'var';
  const lines = [...new Set([...seen].map(k => A.decl[k]))].reduce((a, n) => a + code.slice(n.start, n.end).split('\n').length, 0);
  console.log(`${seen.size} tên, ${lines} dòng; trạng thái (let/var): ${[...seen].filter(isState).join(' ')}`);
  if (mode === 'why') for (const m of [...seen].filter(isState)) console.log(' ', m, '← dùng bởi', [...seen].filter(k => k !== m && A.R[k].has(m)).join(' '));
  if (mode === 'path') { const tgt = process.argv[5], prev = {}, qq = [...seeds], vis = new Set(seeds);
    while (qq.length) { const k = qq.shift(); if (k === tgt) break; (A.R[k] || []).forEach(x => { if (!vis.has(x)) { vis.add(x); prev[x] = k; qq.push(x); } }); }
    const p = [tgt]; while (prev[p[0]]) p.unshift(prev[p[0]]); console.log(p.join(' → ')); }
  if (mode === 'list') console.log([...seen].join(' '));
}
