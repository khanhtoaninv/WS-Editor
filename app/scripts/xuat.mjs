// Chép bản dựng một file ra gốc repo (cạnh thư mục fonts/) thành ws-editor.html
import { copyFileSync } from 'node:fs';
copyFileSync(new URL('../dist/index.html', import.meta.url), new URL('../../ws-editor.html', import.meta.url));
console.log('→ ws-editor.html');
