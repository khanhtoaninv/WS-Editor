# Máy chủ AI GIẢ cho test module Tạo bài (v128 Thiết lập, v129 Sinh bài). Nói giọng Claude Messages API (/v1/messages).
# Đọc đoạn nhắc (shared/src/taobai/nhac.ts) để biết bài cần viết: dòng "BÀI CẦN VIẾT: Bài k · Qn · N câu/dòng",
# rồi trả một khối MD đúng quy ước (file chung 1). Kịch bản lỗi theo số bài (KICH_BAN[k] = danh sách lượt):
#   'ok'        MD đúng                    'cu-phap'  không có dòng "## Task:" (app không đọc được)
#   'so-cau'    thiếu một câu              'dang'     sai dạng (Q khác)
#   'cham'      đúng nhưng trả lời chậm 2,5 giây          '429'     lỗi quá tải
# Lượt thứ i của bài k dùng KICH_BAN[k][i] (hết danh sách thì 'ok'). Ghi lại mọi đoạn nhắc nhận được (NHAN).
import json, re, threading, time
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler

KICH_BAN = {}; NHAN = []; _dem = {}; _lock = threading.Lock()

def _items(q, n, k):
    W = ['was', 'were']
    if q == 'Q1': return ['Dạng: điền từ', 'Khung từ: was, were'] + [f'{i}. Bài {k} câu {i}: Mai ___ at the park number {i}.' for i in range(1, n + 1)], [W[i % 2] for i in range(1, n + 1)]
    if q == 'Q2': return ['Dạng: viết câu', 'Dòng viết: 1'] + [f'{i}. at / the beach / we / were / {k}{i} / .' for i in range(1, n + 1)], [f'We were at the beach {k}{i}.' for i in range(1, n + 1)]
    if q == 'Q3': return ['Dạng: chọn A/B/C'] + [f'{i}. Bài {k}: They ___ happy on day {i}. A. was B. were C. is' for i in range(1, n + 1)], ['B'] * n
    if q == 'Q4': return ['Dạng: chọn trong câu'] + [f'{i}. Bài {k}: Tom {{*was|were}} at home on day {i}.' for i in range(1, n + 1)], None
    if q == 'Q5': return ['Dạng: đúng/sai', 'Bài đọc:', f'Mai was at the beach. Her parents were there too. Bài {k}.', ''] + [f'{i}. Statement {k}-{i} about the beach.' for i in range(1, n + 1)], ['T' if i % 2 else 'F' for i in range(1, n + 1)]
    if q == 'Q7': return ['Dạng: chọn ảnh'] + [f'{i}. Where was Tom on day {k}{i}?\n   A. [ảnh: a park {i}] B. [ảnh: a beach {i}] C. [ảnh: a house {i}]' for i in range(1, n + 1)], ['A'] * n
    if q == 'Q8': return ['Dạng: nối', 'Xáo vế phải: có'] + [f'{i}. Were you at home on day {k}{i}? - Yes, I was {k}{i}.' for i in range(1, n + 1)], None
    if q == 'Q12': return ['Dạng: viết tự do', f'Dòng viết: {n}', 'Khối chữ trên:', f'  Where were you? Bài {k}.'], None
    return ['Dạng: điền từ'] + [f'{i}. x ___ y {k}{i}.' for i in range(1, n + 1)], ['a'] * n

def viet(q, n, k, sai='', lan=0):
    if sai == 'so-cau' and q != 'Q12': n -= 1
    if sai == 'dang': q = 'Q3' if q != 'Q3' else 'Q1'
    body, keys = _items(q, n, k)
    L = [] if sai == 'cu-phap' else [f'## Task: Bài {k} do AI giả viết ({q}).' + (f' Lượt {lan + 1}.' if lan else '')]
    L += [f'Mục tiêu: Luyện was / were (bài {k})', f'Ngữ cảnh: Ngữ cảnh {k}'] + body
    if keys: L += ['', '## Đáp án', '### Task 1'] + [f'{i}. {x}' for i, x in enumerate(keys, 1)]
    return '\n'.join(L)

class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_POST(self):
        b = json.loads(self.rfile.read(int(self.headers.get('content-length', 0))) or b'{}')
        p = b.get('messages', [{}])[-1].get('content', ''); sysp = b.get('system', '')
        NHAN.append({'model': b.get('model'), 'system': sysp, 'prompt': p, 'key': self.headers.get('x-api-key')})
        m = re.search(r'BÀI CẦN VIẾT: Bài (\d+) · (Q\d+) [^·]*· (\d+) (câu|dòng)', p)
        if not m: return self._send(200, {'model': b.get('model'), 'content': [{'type': 'text', 'text': 'OK'}], 'usage': {'input_tokens': 5, 'output_tokens': 1}})
        k, q, n = int(m.group(1)), m.group(2), int(m.group(3))
        with _lock: i = _dem.get(k, 0); _dem[k] = i + 1
        kb = KICH_BAN.get(k, []); act = kb[i] if i < len(kb) else 'ok'
        if act == '429': return self._send(429, {'type': 'error', 'error': {'type': 'rate_limit_error', 'message': 'quá tải'}})
        if act == 'cham': time.sleep(2.5)
        return self._send(200, {'model': b.get('model'), 'content': [{'type': 'text', 'text': viet(q, n, k, act if act in ('cu-phap', 'so-cau', 'dang') else '', i)}], 'stop_reason': 'end_turn', 'usage': {'input_tokens': len(p) // 4, 'output_tokens': 200}})
    def _send(self, code, j):
        d = json.dumps(j).encode(); self.send_response(code); self.send_header('content-type', 'application/json'); self.send_header('content-length', str(len(d))); self.end_headers(); self.wfile.write(d)

def chay():
    """Bật máy chủ giả ở cổng ngẫu nhiên, trả (url, dừng)."""
    s = ThreadingHTTPServer(('127.0.0.1', 0), H); threading.Thread(target=s.serve_forever, daemon=True).start()
    return f'http://127.0.0.1:{s.server_address[1]}', s.shutdown

def dat_lai(kb=None):
    KICH_BAN.clear(); KICH_BAN.update(kb or {}); NHAN.clear(); _dem.clear()
