// Chép bản dựng một file ra gốc repo (cạnh thư mục fonts/) thành ws-editor.html.
// WS_OUT=<đường dẫn> để chép ra chỗ khác (vd. khi đang chạy test trên ws-editor.html).
import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
const out = process.env.WS_OUT ? resolve(process.env.WS_OUT) : new URL('../../ws-editor.html', import.meta.url);
copyFileSync(new URL('../dist/index.html', import.meta.url), out);
console.log('→', String(out));
