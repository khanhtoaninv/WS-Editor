# Dùng chung cho test Lớp học thử: chạy máy chủ (thư mục dữ liệu tạm, cổng ngẫu nhiên), tạo gói từ WS Editor, lớp, phiên,
# cho nhiều "học sinh" (mỗi em một ngữ cảnh trình duyệt riêng) vào làm bài.
import os, sys, json, socket, subprocess, tempfile, time, shutil, urllib.request
HERE = os.path.dirname(os.path.abspath(__file__)); TESTS = os.path.dirname(HERE); ROOT = os.path.dirname(TESTS)
sys.path.insert(0, HERE)
from lam import lam  # noqa: E402

MK = '123456'

def free_port():
    s = socket.socket(); s.bind(('127.0.0.1', 0)); p = s.getsockname()[1]; s.close(); return p

class Server:
    def __init__(self, data=None, env=None):
        self.port = free_port(); self.data = data or tempfile.mkdtemp(prefix='lop-'); self.own = data is None
        e0 = env; env = dict(os.environ, LOP_CONG=str(self.port), LOP_DU_LIEU=self.data, LOP_MAT_KHAU=MK)
        env.pop('ANTHROPIC_API_KEY', None); env.pop('LOP_AI_URL', None); env.update(e0 or {})
        self.p = subprocess.Popen(['node', '--experimental-strip-types', '--disable-warning=ExperimentalWarning', 'server/lop.ts'], cwd=ROOT, env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        self.base = f'http://127.0.0.1:{self.port}'
        for _ in range(100):
            try: urllib.request.urlopen(self.base + '/api/gv/toi', timeout=1); break
            except Exception: time.sleep(0.1)
        else: raise RuntimeError('máy chủ không chạy: ' + (self.p.stdout.read() if self.p.poll() is not None else ''))
    def stop(self, keep=False):
        self.p.terminate()
        try: out = self.p.communicate(timeout=5)[0]
        except Exception: self.p.kill(); out = ''
        if self.own and not keep: shutil.rmtree(self.data, ignore_errors=True)
        return out

LOAD = """raw => { window.confirm = () => true; const J = /^\\s*[\\[{]/.test(raw) ? readJson(raw) : readMd(raw); if (J.err) return 'ERR ' + J.err; return loadSheet(impSheetObj(J)) ? 'ok' : 'ERR nạp'; }"""

def gv_login(pg, base):
    pg.goto(base + '/gv'); pg.wait_for_selector('#gvPass'); pg.fill('#gvPass', MK); pg.click('#gvLogin'); pg.wait_for_selector('#tab-phien')

def gui_goi(ctx, base, sheet_file, lan=1):
    """Mở WS Editor từ máy chủ (cùng ngữ cảnh đã đăng nhập giáo viên), nạp phiếu, Gói .wsp → Gửi lên lớp thử (lan lần). Trả lời nhắn lần cuối."""
    ed = ctx.new_page(); ed.goto(base + '/editor'); ed.wait_for_function('() => typeof loadSheet === "function"')
    r = ed.evaluate(LOAD, open(os.path.join(ROOT, sheet_file), encoding='utf-8').read()); assert r == 'ok', r
    ed.wait_for_timeout(300)
    for _ in range(lan):
        ed.click('#wspBtn'); ed.wait_for_selector('#wspSum'); ed.wait_for_function("() => !document.getElementById('wspBusy')")
        if ed.query_selector('#wspSeen'): ed.check('#wspSeen')
        ed.click('#wspSend'); ed.wait_for_selector('#wspMsg'); msg = ed.inner_text('#wspMsg'); ed.click('#wspClose'); ed.wait_for_timeout(200)
    ed.close()
    return msg

def mo_phien(pg, lop_ten='4A thử', goi_index=1):
    pg.click('#tab-lop'); pg.click('#lopNew'); pg.fill('#lopTen', lop_ten); pg.click('#lopMau'); pg.click('#lopLuu'); pg.wait_for_selector(f'text={lop_ten}')
    pg.click('#tab-phien'); pg.wait_for_selector('#phLop option:nth-child(2)', state='attached'); pg.wait_for_selector('#phGoi option:nth-child(2)', state='attached')
    pg.select_option('#phLop', index=1); pg.select_option('#phGoi', index=goi_index); pg.click('#phMo'); pg.wait_for_selector('#phMa')
    return pg.inner_text('#phMa').strip()

def hs_vao(b, base, ma, ten, phone=False):
    ctx = b.new_context(viewport={'width': 390, 'height': 844} if phone else {'width': 1280, 'height': 860}, is_mobile=phone, has_touch=phone)
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.goto(f'{base}/hs?ma={ma}'); pg.wait_for_selector('.hsnames'); pg.click(f'.hsnames >> text="{ten}"'); pg.wait_for_selector('#wsShow')
    pg.wait_for_timeout(300)
    return ctx, pg, errs

def api(pg, path, method='GET', body=None):
    return pg.evaluate("""async ([p, m, b]) => { const r = await fetch(p, { method: m, headers: b ? { 'content-type': 'application/json' } : {}, body: b ? JSON.stringify(b) : undefined }); return { s: r.status, j: await r.json().catch(() => null) }; }""", [path, method, body])
