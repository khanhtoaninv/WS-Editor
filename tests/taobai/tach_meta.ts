// Dùng trong test_q12.py: đọc JSON danh sách MD từ stdin, trả JSON kết quả tachMeta (shared/src/taobai/meta.ts).
import { tachMeta } from '../../shared/src/taobai/meta.ts';
let s = ''; process.stdin.on('data', d => s += d); process.stdin.on('end', () => process.stdout.write(JSON.stringify((JSON.parse(s) as string[]).map(tachMeta))));
