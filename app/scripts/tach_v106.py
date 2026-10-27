# Bước 2a (docs/KE_HOACH_REACT.md): tách ws-editor-prototype.html (v106) thành dự án Vite, KHÔNG đổi logic.
# Chạy một lần; giữ lại để đối chiếu. python3 app/scripts/tach_v106.py
import os, re
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
L = open(os.path.join(ROOT, 'ws-editor-prototype.html'), encoding='utf-8').read().split('\n')
idx = [i for i, l in enumerate(L) if l.strip() in ('<script>', '</script>')]
s1, e1, s2, e2 = idx
st = [i for i, l in enumerate(L) if l.strip() in ('<style>', '</style>')]
head = L[:st[0]]; css = []
for a, b in zip(st[0::2], st[1::2]): css += L[a + 1:b]
body = L[st[-1] + 1:s1]
A = os.path.join(ROOT, 'app')
# Không có <!doctype>: v106 chạy ở chế độ quirks, giữ nguyên để dàn trang không đổi
# head/body viết rõ để Vite chèn CSS / JS vào cuối <head>, sau <meta charset> (trình duyệt chỉ dò bảng mã ở 1024 byte đầu)
open(os.path.join(A, 'index.html'), 'w', encoding='utf-8').write('\n'.join(['<html lang="vi">', '<head>'] + head + ['</head>', '<body>'] + body + ['<script type="module" src="/src/main.ts"></script>', '</body>', '</html>', '']))
open(os.path.join(A, 'src', 'styles.css'), 'w', encoding='utf-8').write('\n'.join(css) + '\n')
open(os.path.join(A, 'src', 'vendor', 'qrcode.js'), 'w', encoding='utf-8').write('\n'.join(L[s1 + 1:e1]) + '\n')
open(os.path.join(A, 'src', 'legacy', 'app.js'), 'w', encoding='utf-8').write('\n'.join(L[s2 + 1:e2]) + '\n')
print('head', len(head), 'css', len(css), 'body', len(body), 'qr', e1 - s1 - 1, 'app', e2 - s2 - 1, 'sau', len(L) - e2 - 1)
