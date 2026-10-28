# Làm bài trên trình xem (dùng chung cho test Lớp học thử): mỗi chỗ làm đúng / làm sai / bỏ trống theo kế hoạch.
# Thao tác thật (gõ, bấm, nối) như tests/gd1b/quet_lambai.py (các đoạn JS PLAN / OPT / ROW chép từ đó).
import re
PLAN = """([s, k]) => {
  const els = [...document.querySelectorAll(`#wsShow .vsurf [data-ans="${CSS.escape(s.id)}"]`)]; if (!els.length) return null;
  const norm = x => (x || '').replace(/\\s+/g, ' ').trim().toLowerCase();
  const inp = els[0].querySelector(':scope > .vwi');
  if (inp) {
    let v = k && k.accept && k.accept.length ? k.accept[0] : null;
    if (s.interaction === 'match') {   // ô nối viết chữ: chữ cái của hàng có phương án đúng
      const sec = els[0].closest('section'), rows = [...sec.querySelectorAll('.mrows > .mr:not(.mh)')].filter(m => m.textContent.trim());
      const lab = rows.map(m => ((m.textContent.match(/^\\s*([A-Za-z0-9]{1,2})[.)]\\s/) || [])[1] || '')), o = k && (s.options || []).find(x => x.id === k.correct);
      const i = o ? rows.findIndex(m => norm(m.textContent) === norm(o.text) || norm(m.textContent).endsWith(norm(o.text))) : -1;
      v = i < 0 ? null : (lab.some(Boolean) ? lab[i] : String.fromCharCode(97 + i));
    }
    return { kind: els[0].classList.contains('xc') || s.interaction === 'match' ? 'one' : 'type', v, multi: inp.tagName === 'TEXTAREA' && +(inp.dataset.ml || 1) > 1 };
  }
  if (['choice-one', 'choice-many', 'tf'].includes(s.interaction)) {
    let opts = els; if (els.length === 1) for (const q of [':scope > .opt', ':scope > b', ':scope > span:not(.vans)']) { const kk = els[0].querySelectorAll(q); if (kk.length) { opts = [...kk]; break; } }
    const want = k && k.correct != null ? [].concat(k.correct).map(id => (s.options || []).findIndex(o => o.id === id)) : [0];
    return { kind: 'pick', n: want.length, ok: want.every(j => j >= 0 && opts[j]) };
  }
  if (s.interaction === 'match') return { kind: 'link', v: k ? (s.options || []).find(x => x.id === k.correct)?.text ?? null : (s.options || [])[0]?.text ?? null };
  return null;
}"""
OPT = """([id, j, s]) => { const els = [...document.querySelectorAll(`#wsShow .vsurf [data-ans="${CSS.escape(id)}"]`)];
  let opts = els; if (els.length === 1) for (const q of [':scope > .opt', ':scope > b', ':scope > span:not(.vans)']) { const kk = els[0].querySelectorAll(q); if (kk.length) { opts = [...kk]; break; } }
  return opts[j]; }"""
ROW = """([id, txt, opt]) => { const norm = x => (x || '').replace(/\\s+/g, ' ').trim().toLowerCase(), sec = document.querySelector(`#wsShow .vsurf [data-ans="${CSS.escape(id)}"]`).closest('section');
  const rows = [...sec.querySelectorAll('.mrows > .mr:not(.mh)')]; if (opt) { const r = rows.find(m => m.dataset.opt === opt); if (r) return r; }   // v113: hàng vế phải mang mã phương án (vế phải có thể trùng chữ)
  return rows.find(m => norm(m.textContent) === norm(txt)) || rows.find(m => norm(m.textContent).endsWith(norm(txt))); }"""

def lam(pg, slots, key, chon):
    """chon(slot) -> 'dung' | 'sai' | None (bỏ trống). Trả {id: 'dung'|'sai'} những chỗ đã làm."""
    done = {}
    pg.keyboard.press('t'); pg.wait_for_timeout(100)
    nT = pg.evaluate("() => document.querySelectorAll('#wsShow .vsel option').length - 1"); seen = set()
    for ti in range(nT):
        pg.select_option('#wsShow .vsel', str(ti)); pg.wait_for_timeout(80)
        here = set(pg.evaluate("() => [...document.querySelectorAll('#wsShow .vsurf [data-ans]')].map(e => e.dataset.ans)"))
        for s in slots:
            if s['id'] not in here or s['id'] in seen: continue
            seen.add(s['id']); c = chon(s)
            if not c: continue
            k = key.get(s['id']); auto = k is not None and (k.get('grading') or s['grading']) == 'auto' and (k.get('correct') is not None or k.get('accept'))
            if not auto and c == 'dung': c = 'tay'   # chấm tay: làm "bài viết"
            pl = pg.evaluate(PLAN, [s, k if auto else None])
            if not pl: continue
            sel = f"#wsShow .vsurf [data-ans='{s['id']}']"
            if pl['kind'] in ('type', 'one'):
                v = pl['v'] if auto and c == 'dung' else ('I like it because it is fun' if c == 'tay' else 'q')
                if v is None: continue
                pg.click(sel); pg.keyboard.press('Control+A')
                pg.keyboard.type(re.sub(r'\W', '', v)[:1] if pl['kind'] == 'one' else v); pg.keyboard.press('Escape')
            elif pl['kind'] == 'pick':
                n = len(s.get('options') or []) or 2
                if auto:
                    cor = [k['correct']] if isinstance(k['correct'], str) else list(k['correct'])
                    idx = [i for i, o in enumerate(s['options'] or []) if o['id'] in cor] if s.get('options') else []
                    if s['interaction'] == 'tf' and not idx: idx = [0 if str(k['correct']).upper().startswith('T') else 1]
                    if c == 'sai': idx = [next(i for i in range(max(n, 2)) if i not in idx)]
                else: idx = [0]
                for j in idx:
                    h = pg.evaluate_handle(OPT, [s['id'], j, s]).as_element()
                    if h: h.click()
                if pg.query_selector(f"{sel} .vwgo"): pg.click(f"{sel} .vwgo")
            else:
                opts = s.get('options') or []
                want = next((o for o in opts if auto and o['id'] == k['correct']), None)
                o = want if c == 'dung' and want else next((x for x in opts if not want or x['id'] != want['id']), None)
                if not o: continue
                pg.click(sel); row = pg.evaluate_handle(ROW, [s['id'], o['text'], o['id']]).as_element()
                if not row: pg.keyboard.press('Escape'); continue
                row.click()
            pg.wait_for_timeout(30); done[s['id']] = c
    return done
