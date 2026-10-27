// Cầu nối test (docs/KE_HOACH_REACT.md, bước 2): v106 là script thường, mọi biến / hàm cấp cao nhất đều là toàn cục,
// và 49 test Playwright gọi thẳng chúng (ws, readMd, loadSheet, render…). Khi chuyển thành module ES, plugin này
// gắn lại từng tên cấp cao nhất của các file "src/legacy/*.js", "src/core/*.js" và "src/vendor/*.js" lên window
// (tên import không gắn: module khai báo nó tự gắn):
// let / var có cả get và set (test gán ws = …, zoom = 1 vẫn được), const / function / class chỉ get.
import type { Plugin } from 'vite';
import { parseAst } from 'vite';

function names(p: any, out: string[]) {
  if (!p) return;
  if (p.type === 'Identifier') out.push(p.name);
  else if (p.type === 'ObjectPattern') p.properties.forEach((x: any) => names(x.type === 'RestElement' ? x.argument : x.value, out));
  else if (p.type === 'ArrayPattern') p.elements.forEach((x: any) => names(x, out));
  else if (p.type === 'RestElement') names(p.argument, out);
  else if (p.type === 'AssignmentPattern') names(p.left, out);
}

export function topLevel(code: string) {
  const rw: string[] = [], ro: string[] = [];
  for (let n of (parseAst(code) as any).body) {
    if (n.type === 'ExportNamedDeclaration' && n.declaration) n = n.declaration;
    if (n.type === 'VariableDeclaration') { const o: string[] = []; n.declarations.forEach((d: any) => names(d.id, o)); (n.kind === 'const' ? ro : rw).push(...o); }
    else if ((n.type === 'FunctionDeclaration' || n.type === 'ClassDeclaration') && n.id) ro.push(n.id.name);
  }
  return { rw, ro };
}

export default function cauNoi(): Plugin {
  return {
    name: 'ws-cau-noi',
    enforce: 'pre',
    transform(code, id) {
      if (!/[\\/]src[\\/](legacy|vendor|core)[\\/][^\\/]+\.js$/.test(id)) return null;
      const { rw, ro } = topLevel(code);
      const def = (n: string, set: boolean) =>
        `try { Object.defineProperty(window, ${JSON.stringify(n)}, { configurable: true, get: () => ${n}${set ? `, set: v => { ${n} = v; }` : ''} }); } catch (_) {}`;
      return { code: code + '\n// ---- cầu nối test (tự sinh) ----\n' + [...rw.map(n => def(n, true)), ...ro.map(n => def(n, false))].join('\n') + '\n', map: null };
    },
  };
}
