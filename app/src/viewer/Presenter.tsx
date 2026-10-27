// GĐ1a trình chiếu (docs/TUONG_TAC/KE_HOACH_GD1A.md). Một lớp phủ toàn màn hình trên WS Editor:
// B1 khung chiếu + lật trang, B2 xem từng Task, B3 phóng, B4 hiện đáp án, B5 bút, B6 che / hé, B7 đồng hồ + bảng trắng (Tools.tsx). Trang là bản sao HTML đã dàn, không dàn lại.
// GĐ1b (KE_HOACH_GD1B.md): phiếu lúc nào cũng làm được (work.ts): ở con trỏ bấm chỗ trả lời là làm bài, máy chấm xanh / đỏ.
import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { gradeSlot, isBlank, type AnswerValue, type Answers, type SlotResult } from '../../../shared/src/index.ts';
import { prep, type ShowData } from './data';
import { applyAnswers, hasAns, optOfRow, slotsInView } from './answers';
import { Board, Timer, type BoardState } from './Tools';
import { applyWork, elsOf, kindOf, letterToOpt, needsGo, nextCell, pickIndex, picked, type Hooks, type Pend } from './work';
import { COLORS, HL, WIDTHS, hit, loadInk, lockLine, pathOf, saveInk, type Anchor, type Ink, type Pt, type Stroke } from './ink';

const PX = 96 / 25.4;                       // px mỗi mm (CSS)
const PAGE_W = 210 * PX, PAGE_H = 297 * PX;
const TASK_PAD = 8, TASK_W = (182 + 2 * TASK_PAD) * PX;   // khung Từng Task: bề rộng vùng chữ của trang + lề 8 mm
const GAP = 24;                              // khoảng chừa quanh trang khi vừa màn hình (px)
const READ = 1.5;                            // Từng Task: Task dài thì không thu nhỏ dưới 1,5 lần cỡ thật (cuộn thay vì chữ nhỏ)
const Z_MIN = .5, Z_MAX = 6;

type Mode = 'page' | 'task';
type Tool = 'pointer' | 'zoomrect' | 'pen' | 'hl' | 'line' | 'eraser';
const INK_TOOLS: Tool[] = ['pen', 'hl', 'line', 'eraser'];
// B6 che / hé: đơn vị che là từng câu, lượt thoại, bài đọc, hàng bảng 2 cột, vế nối; Task không có thì che cả thân Task
const UNITS = '.q, .dl, .g2.passage, .tbl > .c2, .tbl > .c3, .mrows > .ml, .mrows > .mr, .tg';
function units(sec: HTMLElement) {
  const all = [...sec.querySelectorAll<HTMLElement>(UNITS)].filter((u, _i, a) => !a.some(o => o !== u && o.contains(u)));
  if (all.length) return all.map(u => u.querySelector<HTMLElement>(':scope > .qb') || u);   // câu: che phần chữ, chừa số câu
  const b = sec.querySelector<HTMLElement>(':scope > .body'); return b ? [b] : [];
}

export function Presenter({ data, onClose }: { data: ShowData; onClose: () => void }) {
  const P = useMemo(() => prep(data), [data]);
  const nP = P.pages.length, nT = P.tasks.length;
  const startT = Math.max(0, P.tasks.findIndex(t => t.id === data.start));
  const [mode, setMode] = useState<Mode>('page');
  const [pi, setPi] = useState(() => (data.start && P.pageOf[data.start] != null ? P.pageOf[data.start] : 0));
  const [ti, setTi] = useState(startT);
  const [z, setZ] = useState(1);
  const [tool, setTool] = useState<Tool>('pointer');
  const [bar, setBar] = useState(true);
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [taskH, setTaskH] = useState(PAGE_H);
  const [pic, setPic] = useState<string | null>(null);
  const [rect, setRect] = useState<null | { x0: number; y0: number; x1: number; y1: number }>(null);
  const stageRef = useRef<HTMLDivElement>(null), surfRef = useRef<HTMLDivElement>(null), barRef = useRef<HTMLDivElement>(null);
  // B4 đáp án: các chỗ đang hiện; `order` để Shift+Space ẩn lại chỗ vừa hiện
  const ansIds = useMemo(() => new Set(data.slots.filter(x => hasAns(x, data.key)).map(x => x.id)), [data]);
  const noKey = data.slots.length - ansIds.size;
  const [shown, setShown] = useState<Set<string>>(() => new Set());
  const order = useRef<string[]>([]);
  const [clickAns, setClickAns] = useState(false);
  const toggle = (ids: string[]) => setShown(old => { const n = new Set(old), on = ids.some(i => !n.has(i)); ids.forEach(i => on ? n.add(i) : n.delete(i)); if (on) order.current.push(...ids.filter(i => !old.has(i))); return n; });
  const allOn = shown.size > 0 && shown.size >= ansIds.size;
  const toggleAll = () => { order.current = []; setShown(allOn ? new Set() : new Set(ansIds)); };
  const nextAns = () => {   // hiện chỗ kế tiếp trong phần đang xem; hết thì báo, trả false
    const id = surfRef.current ? slotsInView(surfRef.current).find(i => ansIds.has(i) && !shown.has(i)) : undefined;
    if (!id) { flash('Đã hiện hết đáp án trong phần đang xem'); return false; }
    order.current.push(id); setShown(old => new Set(old).add(id)); return true;
  };
  const prevAns = () => { const id = order.current.pop(); if (id) setShown(old => { const n = new Set(old); n.delete(id); return n; }); };
  // GĐ1b bài làm: giá trị trong ref (gõ không vẽ lại), `done` = các chỗ đã chốt để chấm
  const slotBy = useMemo(() => Object.fromEntries(data.slots.map(x => [x.id, x])), [data]);
  const ans = useRef<Answers>({});
  const [done, setDone] = useState<Set<string>>(() => new Set());
  const [pend, setPend] = useState<Pend | null>(null);
  const [reveal, setReveal] = useState(false);
  const [, bump] = useReducer((x: number) => x + 1, 0);
  const res: Record<string, SlotResult> = {};
  done.forEach(id => { if (slotBy[id]) res[id] = gradeSlot(slotBy[id], data.key[id], ans.current[id]); });
  const autoIds = useMemo(() => data.slots.filter(x => { const k = data.key[x.id]; return k && (k.grading ?? x.grading) === 'auto' && (k.correct != null || (k.accept && k.accept.length)); }).map(x => x.id), [data]);
  const nOk = autoIds.filter(i => res[i] && res[i].status === 'correct').length;
  const anyWork = Object.values(ans.current).some(v => !isBlank(v));
  const commit = (id: string, v: AnswerValue | null) => {
    ans.current[id] = v; const blank = isBlank(v);
    setDone(o => { const n = new Set(o); if (blank) n.delete(id); else n.add(id); return n; });
    if (!blank && reveal && slotBy[id] && ['wrong', 'partial'].includes(gradeSlot(slotBy[id], data.key[id], v).status) && ansIds.has(id)) setShown(o => new Set(o).add(id));
  };
  const draft = (id: string, v: AnswerValue | null) => { ans.current[id] = v; setDone(o => { if (!o.has(id)) return o; const n = new Set(o); n.delete(id); return n; }); };
  const resetWork = (ids: string[]) => {
    (document.activeElement as HTMLElement | null)?.blur?.();
    ids.forEach(i => { delete ans.current[i]; });
    setDone(o => { const n = new Set(o); ids.forEach(i => n.delete(i)); return n; });
    setShown(o => { const n = new Set(o); ids.forEach(i => n.delete(i)); return n; });
    setPend(null); bump();
  };
  const lastMany = useRef<string | null>(null);   // chọn nhiều đang chờ Chấm (Enter)
  const inputs = () => surfRef.current ? [...surfRef.current.querySelectorAll<HTMLElement>('.vwi')] : [];
  const focusNext = (el: HTMLElement, d: 1 | -1) => { const a = inputs(), i = a.indexOf(el), n = a[i + d]; if (n) { n.focus(); return true; } el.blur(); return false; };
  const shiftDown = useRef(false);
  const hooks = useRef<Hooks>(null as unknown as Hooks);
  hooks.current = {
    input: (id, el) => {
      const s = slotBy[id]; if (!s) return;
      if (el.classList.contains('vwx') || (s.interaction === 'match')) {   // ô chữ, ô nối viết chữ: một chữ, chấm ngay
        const ch = el.value.replace(/\s+/g, '').slice(-1).toUpperCase(); el.value = ch;
        commit(id, ch ? (s.interaction === 'match' ? letterToOpt(s, el, ch) : ch) : null);
        if (ch && el.classList.contains('vwx')) { const c = nextCell(el.parentElement!, shiftDown.current ? 'down' : 1); const ni = c?.querySelector<HTMLElement>(':scope > .vwi'); if (ni) ni.focus(); }
        return;
      }
      draft(id, el.value);
      if (el.tagName === 'INPUT') { const h = el.parentElement!; h.style.minWidth = ''; if (el.scrollWidth > el.clientWidth + 1) h.style.minWidth = el.scrollWidth + 6 + 'px'; }   // chữ dài hơn gạch: gạch dài ra
    },
    key: (id, el, e) => {
      e.stopPropagation();   // phím khi đang gõ không tới phím tắt của WS Editor
      shiftDown.current = e.shiftKey;
      const s = slotBy[id], xw = el.classList.contains('vwx');
      if (e.key === 'Escape') { el.blur(); e.preventDefault(); return; }
      if (e.key === 'Tab') { e.preventDefault(); hooks.current.blur(id, el); focusNext(el, e.shiftKey ? -1 : 1); return; }
      if (e.key === 'Enter' && !(el.tagName === 'TEXTAREA' && +(el.dataset.ml || 1) > 1 && !e.ctrlKey && !e.metaKey)) { e.preventDefault(); hooks.current.blur(id, el); focusNext(el, 1); return; }
      if (xw && s) {
        const mv = (d: 1 | -1 | 'down' | 'up') => { const c = nextCell(el.parentElement!, d)?.querySelector<HTMLElement>(':scope > .vwi'); if (c) { e.preventDefault(); c.focus(); } };
        if (e.key === 'ArrowRight') mv(1); else if (e.key === 'ArrowLeft') mv(-1); else if (e.key === 'ArrowDown') mv('down'); else if (e.key === 'ArrowUp') mv('up');
        else if (e.key === 'Backspace' && !el.value) mv(shiftDown.current ? 'up' : -1);
      }
    },
    blur: (id, el) => {
      if (el.classList.contains('vwx') || slotBy[id]?.interaction === 'match') return;
      const v = el.value; if (!done.has(id) || ans.current[id] !== v) commit(id, v.trim() ? v : null);
    },
  };
  const [msg, setMsg] = useState(''); const msgT = useRef(0);
  const flash = (m: string) => { setMsg(m); clearTimeout(msgT.current); msgT.current = window.setTimeout(() => setMsg(''), 2200); };
  // B5 bút: nét theo Task / trang (ink.ts), hoàn tác bằng ảnh chụp trạng thái
  const store = data.store || data.title || 'phieu';
  const [ink, setInkRaw] = useState<Ink>(() => loadInk(store, P.hash).ink);
  const undoS = useRef<Ink[]>([]), redoS = useRef<Ink[]>([]);
  const setInk = (n: Ink) => { undoS.current.push(ink); if (undoS.current.length > 100) undoS.current.shift(); redoS.current = []; setInkRaw(n); };
  const undo = () => { const p = undoS.current.pop(); if (p) { redoS.current.push(ink); setInkRaw(p); } };
  const redo = () => { const n = redoS.current.pop(); if (n) { undoS.current.push(ink); setInkRaw(n); } };
  const [color, setColor] = useState<string>(COLORS[0][0]);
  const [width, setWidth] = useState<number>(WIDTHS[1][0]);
  const [inkHidden, setInkHidden] = useState(false);
  const [live, setLive] = useState<null | { key: string; s: Stroke }>(null);
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const drawing = useRef<null | { key: string; s: Stroke; erase: boolean; shift: boolean; cut: boolean }>(null);
  const hasInk = Object.values(ink).some(a => a.length);
  useEffect(() => { if (loadInk(store, P.hash).dropped) flash('Phiếu đã sửa sau lần chiếu trước: bỏ nét vẽ cũ'); }, []);   // eslint-disable-line react-hooks/exhaustive-deps
  const saveWarned = useRef(false);
  useEffect(() => { if (!saveInk(store, P.hash, ink) && !saveWarned.current) { saveWarned.current = true; flash('Trình duyệt không cho lưu: nét vẽ sẽ mất khi đóng trình chiếu'); } }, [ink]);   // eslint-disable-line react-hooks/exhaustive-deps
  const [timer, setTimer] = useState(false), [board, setBoard] = useState(false);
  const [boardSt, setBoardSt] = useState<BoardState>({ strokes: [], bg: 'lines' });
  const [cover, setCover] = useState(false);
  const [open, setOpen] = useState<Set<string>>(() => new Set());   // các tấm đã hé: "<task>#<mảnh>:<thứ tự>"
  const toggleCover = () => { setOpen(new Set()); setCover(!cover); };
  const pendScroll = useRef<null | { x: number; y: number } | 'top' | 'keep'>('top');
  const keep = useRef<{ fx: number; fy: number } | null>(null);

  // kích thước vùng chiếu
  useLayoutEffect(() => {
    const el = stageRef.current!, ro = new ResizeObserver(() => setVp({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el); setVp({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const W0 = mode === 'page' ? PAGE_W : TASK_W, H0 = mode === 'page' ? PAGE_H : taskH;
  const fit = mode === 'page' ? Math.min((vp.w - GAP) / PAGE_W, (vp.h - GAP) / PAGE_H) : Math.min((vp.w - GAP) / TASK_W, Math.max((vp.h - GAP) / taskH, READ));   // vừa cả Task nếu được, không thì vừa ngang
  const s = Math.max(.05, fit * z);

  // Từng Task: đo chiều cao thật của Task (chưa nhân tỉ lệ)
  const taskHtml = mode === 'task' && P.tasks[ti] ? P.tasks[ti].frags.map(f => f.html).join('') : '';
  useLayoutEffect(() => {
    if (mode !== 'task' || !surfRef.current) return;
    const h = surfRef.current.offsetHeight; if (h && Math.abs(h - taskH) > .5) setTaskH(h);
  });

  // vẽ đáp án đang bật lên bản sao trang (và nút ✓ đầu mỗi Task)
  useLayoutEffect(() => {
    const root = surfRef.current; if (!root) return;
    applyAnswers(root, data.slots, data.key, shown);
    applyWork(root, data.slots, { ans: ans.current, res, pend, shownIds: shown, key: data.key }, hooks);
    root.querySelectorAll<HTMLElement>('section.task[data-frag="0"]').forEach(sec => {
      const id = sec.dataset.task!, ids = data.slots.filter(x => x.task === id && ansIds.has(x.id)).map(x => x.id);
      let b = sec.querySelector<HTMLButtonElement>(':scope > .vtk');
      if (!ids.length) { b?.remove(); return; }
      if (!b) { b = document.createElement('button'); b.className = 'vtk'; b.dataset.vt = id; b.title = 'Hiện / ẩn đáp án Task này'; b.textContent = '✓'; sec.appendChild(b); }
      b.classList.toggle('on', ids.every(i => shown.has(i)));
    });
    // nút ⟲ làm lại Task (khi Task đã có bài làm)
    root.querySelectorAll<HTMLElement>('section.task[data-frag="0"]').forEach(sec => {
      const id = sec.dataset.task!, on = data.slots.some(x => x.task === id && !isBlank(ans.current[x.id]));
      let b = sec.querySelector<HTMLButtonElement>(':scope > .vrs');
      if (!on) { b?.remove(); return; }
      if (!b) { b = document.createElement('button'); b.className = 'vrs'; b.dataset.vr = id; b.tabIndex = -1; b.title = 'Làm lại Task này (xóa bài làm)'; b.textContent = '⟲'; sec.appendChild(b); }
    });
    // che / hé
    root.querySelectorAll('.vcv').forEach(e => e.remove());
    root.querySelectorAll('[data-vu]').forEach(e => { e.removeAttribute('data-vu'); e.classList.remove('vcov'); });
    if (cover) root.querySelectorAll<HTMLElement>('section.task[data-frag]').forEach(sec => units(sec).forEach((u, i) => {
      const id = `${sec.dataset.task}#${sec.dataset.frag}:${i}`; u.dataset.vu = id;
      if (open.has(id)) return;
      u.classList.add('vcov'); const c = document.createElement('div'); c.className = 'vcv'; c.textContent = 'Bấm để hé'; u.appendChild(c);
    }));
    // chỗ neo nét vẽ: từng mảnh Task (và cả trang ở Cả trang), tọa độ chưa nhân tỉ lệ
    const sr = root.getBoundingClientRect(), k = sr.width / root.offsetWidth || 1;
    const an: Anchor[] = [...root.querySelectorAll<HTMLElement>('section.task[data-frag]')].map(sec => { const r = sec.getBoundingClientRect(); return { key: `${sec.dataset.task}#${sec.dataset.frag}`, x: (r.left - sr.left) / k, y: (r.top - sr.top) / k, w: r.width / k, h: r.height / k }; });
    if (mode === 'page') an.push({ key: `page#${pi}`, x: 0, y: 0, w: PAGE_W, h: PAGE_H });
    const j = JSON.stringify(an.map(a => [a.key, Math.round(a.x), Math.round(a.y), Math.round(a.w), Math.round(a.h)]));
    if (j !== JSON.stringify(anchors.map(a => [a.key, Math.round(a.x), Math.round(a.y), Math.round(a.w), Math.round(a.h)]))) setAnchors(an);
  });

  // cuộn sau khi đổi trang / Task / tỉ lệ
  useLayoutEffect(() => {
    const st = stageRef.current!, p = pendScroll.current;
    if (keep.current) { const k = keep.current; keep.current = null; st.scrollLeft = k.fx * st.scrollWidth - st.clientWidth / 2; st.scrollTop = k.fy * st.scrollHeight - st.clientHeight / 2; return; }
    if (p === 'top') { st.scrollTop = 0; st.scrollLeft = (st.scrollWidth - st.clientWidth) / 2; }
    else if (p && p !== 'keep') { st.scrollLeft = p.x; st.scrollTop = p.y; }
    pendScroll.current = null;
  }, [mode, pi, ti, s, taskH]);

  const zoomTo = useCallback((nz: number) => {
    const st = stageRef.current!;
    keep.current = { fx: (st.scrollLeft + st.clientWidth / 2) / st.scrollWidth, fy: (st.scrollTop + st.clientHeight / 2) / st.scrollHeight };
    setZ(Math.min(Z_MAX, Math.max(Z_MIN, Math.round(nz * 100) / 100)));
  }, []);
  const zoomFit = useCallback(() => { pendScroll.current = 'top'; setZ(1); }, []);

  // lật: Từng Task thì cuộn hết Task rồi mới sang Task sau (một phím clicker làm được hết)
  const go = useCallback((d: 1 | -1, clicker = false) => {
    const st = stageRef.current!;
    if (clicker && clickAns) { if (d > 0 && surfRef.current && slotsInView(surfRef.current).some(i => ansIds.has(i) && !shown.has(i))) { nextAns(); return; } }
    if (mode === 'page') {
      if (z > 1) { const max = st.scrollHeight - st.clientHeight; if (d > 0 && st.scrollTop < max - 4) { st.scrollTop += st.clientHeight * .85; return; } if (d < 0 && st.scrollTop > 4) { st.scrollTop -= st.clientHeight * .85; return; } }
      const np = Math.min(nP - 1, Math.max(0, pi + d)); if (np !== pi) { pendScroll.current = 'top'; setPi(np); }
      return;
    }
    const max = st.scrollHeight - st.clientHeight;
    if (d > 0 && st.scrollTop < max - 4) { st.scrollTop = Math.min(max, st.scrollTop + st.clientHeight * .85); return; }
    if (d < 0 && st.scrollTop > 4) { st.scrollTop = Math.max(0, st.scrollTop - st.clientHeight * .85); return; }
    const nt = Math.min(nT - 1, Math.max(0, ti + d)); if (nt !== ti) { pendScroll.current = 'top'; setTi(nt); }
  }, [mode, pi, ti, nP, nT, z, clickAns, shown, ansIds]);

  const toMode = useCallback((m: Mode) => {
    if (m === mode) return;
    if (m === 'task') { const i = P.tasks.findIndex(t => t.frags.some(f => f.page === pi)); setTi(i >= 0 ? (P.tasks[ti] && P.tasks[ti].frags.some(f => f.page === pi) ? ti : i) : ti); }
    else if (P.tasks[ti]) setPi(P.tasks[ti].frags[0].page);
    pendScroll.current = 'top'; setZ(1); setMode(m);
  }, [mode, pi, ti, P]);
  const goTask = (i: number) => { pendScroll.current = 'top'; setZ(1); if (mode === 'task') setTi(i); else { setTi(i); setPi(P.tasks[i].frags[0].page); } };

  // toàn màn hình: mở là xin, Esc của trình duyệt thoát toàn màn hình thì vẫn ở trình chiếu (Esc lần nữa mới đóng)
  const [fs, setFs] = useState(false);
  useEffect(() => {
    const on = () => setFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', on);
    try { document.documentElement.requestFullscreen?.().catch(() => {}); } catch (_) { /* không hỗ trợ */ }
    return () => { document.removeEventListener('fullscreenchange', on); if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {}); };
  }, []);
  const toggleFs = () => { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); } catch (_) { /* bỏ qua */ } };

  // thanh công cụ tự ẩn sau 3 giây không rê chuột (rê lên thanh thì giữ)
  const hideT = useRef(0);
  const poke = useCallback(() => {
    setBar(true); clearTimeout(hideT.current);
    hideT.current = window.setTimeout(() => { if (!barRef.current?.matches(':hover')) setBar(false); }, 3000);
  }, []);
  useEffect(() => { poke(); return () => clearTimeout(hideT.current); }, [poke]);

  // phím: bắt ở pha capture để phím tắt của WS Editor không chạy khi đang chiếu
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement; if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) return;
      let used = true;
      if (board) {   // đang ở bảng trắng: chỉ nhận Esc / B / G
        const kk = e.key.toLowerCase();
        if (kk === 'escape' || kk === 'b') setBoard(false); else if (kk === 'g') setTimer(!timer); else { if (!e.ctrlKey && !e.metaKey) e.stopPropagation(); return; }
        e.preventDefault(); e.stopPropagation(); return;
      }
      if ((e.ctrlKey || e.metaKey) && !e.altKey) {
        const kk = e.key.toLowerCase();
        if (kk === 'z' && !e.shiftKey) undo(); else if ((kk === 'z' && e.shiftKey) || kk === 'y') redo(); else { e.stopPropagation(); return; }
        e.preventDefault(); e.stopPropagation(); return;
      }
      switch (e.key) {
        case 'p': case 'P': setTool(tool === 'pen' ? 'pointer' : 'pen'); break;
        case 'e': case 'E': setTool(tool === 'eraser' ? 'pointer' : 'eraser'); break;
        case 'ArrowRight': case 'ArrowDown': go(1); break;
        case 'ArrowLeft': case 'ArrowUp': go(-1); break;
        case 'PageDown': go(1, true); break;    // bút trình chiếu (clicker) gửi PageDown / PageUp
        case 'PageUp': go(-1, true); break;
        case ' ': if (e.shiftKey) prevAns(); else nextAns(); break;
        case 'a': case 'A': if (!e.ctrlKey && !e.metaKey) toggleAll(); else used = false; break;
        case 'Home': if (mode === 'page') { pendScroll.current = 'top'; setPi(0); } else goTask(0); break;
        case 'End': if (mode === 'page') { pendScroll.current = 'top'; setPi(nP - 1); } else goTask(nT - 1); break;
        case 't': case 'T': toMode(mode === 'page' ? 'task' : 'page'); break;
        case '+': case '=': zoomTo(z * 1.25); break;
        case '-': case '_': zoomTo(z / 1.25); break;
        case '0': zoomFit(); break;
        case 'z': case 'Z': setTool(tool === 'zoomrect' ? 'pointer' : 'zoomrect'); break;
        case 'f': case 'F': toggleFs(); break;
        case 'h': case 'H': toggleCover(); break;
        case 'g': case 'G': setTimer(!timer); break;
        case 'b': case 'B': setBoard(true); break;
        case 'Enter': if (lastMany.current) { commit(lastMany.current, ans.current[lastMany.current] ?? null); lastMany.current = null; } else used = false; break;
        case 'Escape': if (pend) setPend(null); else if (pic) setPic(null); else if (tool !== 'pointer') setTool('pointer'); else if (z !== 1) zoomFit(); else onClose(); break;
        default: used = false;
      }
      if (used) { e.preventDefault(); e.stopPropagation(); poke(); } else e.stopPropagation();
    };
    window.addEventListener('keydown', k, true);
    return () => window.removeEventListener('keydown', k, true);
  });

  // Ctrl + lăn chuột (và chụm hai ngón trên bàn di chuột) = phóng
  useEffect(() => {
    const st = stageRef.current!, w = (e: WheelEvent) => { if (!e.ctrlKey) return; e.preventDefault(); zoomTo(z * (e.deltaY < 0 ? 1.12 : 1 / 1.12)); };
    st.addEventListener('wheel', w, { passive: false });
    return () => st.removeEventListener('wheel', w);
  }, [z, zoomTo]);

  // chụm hai ngón trên màn cảm ứng
  const touches = useRef(new Map<number, { x: number; y: number }>()), pinch0 = useRef<{ d: number; z: number } | null>(null);
  const dist = () => { const [a, b] = [...touches.current.values()]; return Math.hypot(a.x - b.x, a.y - b.y); };

  // phóng vùng: kéo khung trên lớp bắt chuột, thả thì phóng vùng đó vừa màn hình
  const onRectDown = (e: React.PointerEvent) => { (e.target as HTMLElement).setPointerCapture(e.pointerId); setRect({ x0: e.clientX, y0: e.clientY, x1: e.clientX, y1: e.clientY }); };
  const onRectMove = (e: React.PointerEvent) => { if (rect) setRect({ ...rect, x1: e.clientX, y1: e.clientY }); };
  const onRectUp = () => {
    if (!rect) return; const r = rect; setRect(null); setTool('pointer');
    const w = Math.abs(r.x1 - r.x0), h = Math.abs(r.y1 - r.y0); if (w < 20 || h < 10) return;
    const b = surfRef.current!.getBoundingClientRect();
    const ux = (Math.min(r.x0, r.x1) - b.left) / s, uy = (Math.min(r.y0, r.y1) - b.top) / s, uw = w / s, uh = h / s;   // tọa độ chưa nhân tỉ lệ
    const nz = Math.min(Z_MAX, Math.max(Z_MIN, Math.min((vp.w - GAP) / uw, (vp.h - GAP) / uh) / fit)), ns = fit * nz;
    pendScroll.current = 'keep'; setZ(nz);
    requestAnimationFrame(() => { const st = stageRef.current!, bx = st.querySelector('.vbox') as HTMLElement; st.scrollLeft = bx.offsetLeft + ux * ns - (vp.w - uw * ns) / 2; st.scrollTop = bx.offsetTop + uy * ns - (vp.h - uh * ns) / 2; });
  };

  // vẽ: điểm trên vùng chiếu (chưa nhân tỉ lệ) → chỗ neo chứa điểm (mảnh Task trước, rồi trang, rồi Task gần nhất)
  const surfPt = (e: React.PointerEvent): Pt => { const b = surfRef.current!.getBoundingClientRect(); return [(e.clientX - b.left) / s, (e.clientY - b.top) / s]; };
  const anchorAt = (p: Pt) => {
    const ins = (a: Anchor) => p[0] >= a.x && p[0] <= a.x + a.w && p[1] >= a.y && p[1] <= a.y + a.h;
    const secs = anchors.filter(a => !a.key.startsWith('page#'));
    return secs.find(ins) || anchors.find(a => a.key.startsWith('page#')) || secs.reduce<Anchor | null>((m, a) => { const d = Math.abs(p[1] - Math.min(Math.max(p[1], a.y), a.y + a.h)); return !m || d < Math.abs(p[1] - Math.min(Math.max(p[1], m.y), m.y + m.h)) ? a : m; }, null);
  };
  const local = (a: Anchor, p: Pt): Pt => [Math.round((p[0] - a.x) * 10) / 10, Math.round((p[1] - a.y) * 10) / 10];
  const eraseAt = (p: Pt) => {
    const r = 12 / s; let changed = false; const n: Ink = {};
    for (const a of anchors) { const L = local(a, p), arr = ink[a.key] || [], keep = arr.filter(st => !hit(st, L, r)); if (keep.length !== arr.length) changed = true; n[a.key] = keep; }
    if (!changed) return;
    const merged = { ...ink, ...n };
    if (!drawing.current!.cut) { drawing.current!.cut = true; setInk(merged); } else setInkRaw(merged);
  };
  const inkDown = (e: React.PointerEvent) => {
    const quick = tool === 'pointer' && e.pointerType === 'mouse' ? (e.ctrlKey || e.metaKey ? 'hl' : e.shiftKey ? 'line' : null) : null;
    const t = INK_TOOLS.includes(tool) ? tool : quick;
    if (!t || (e.pointerType === 'mouse' && e.button !== 0)) return false;
    const p = surfPt(e), a = anchorAt(p); if (!a) return false;
    e.preventDefault(); stageRef.current!.setPointerCapture(e.pointerId);
    if (t === 'eraser') { drawing.current = { key: a.key, s: { t: 'pen', c: '', w: 0, pts: [] }, erase: true, shift: false, cut: false }; eraseAt(p); return true; }
    const st: Stroke = { t: t as Stroke['t'], c: t === 'hl' ? HL : color, w: Math.round((t === 'hl' ? width * 4 : width) / s * 10) / 10, pts: [local(a, p)] };
    drawing.current = { key: a.key, s: st, erase: false, shift: !!quick && t === 'line', cut: false }; setLive({ key: a.key, s: st });
    return true;
  };
  const inkMove = (e: React.PointerEvent) => {
    const d = drawing.current; if (!d) return false;
    const p = surfPt(e);
    if (d.erase) { eraseAt(p); return true; }
    const a = anchors.find(x => x.key === d.key); if (!a) return true;
    const q = local(a, p), pts = d.s.pts;
    if (d.s.t === 'line') d.s = { ...d.s, pts: [pts[0], e.shiftKey || d.shift ? lockLine(pts[0], q) : q] };
    else { const l = pts[pts.length - 1]; if (Math.hypot(q[0] - l[0], q[1] - l[1]) * s < 1.5) return true; d.s = { ...d.s, pts: [...pts, q] }; }
    setLive({ key: d.key, s: d.s }); return true;
  };
  const inkUp = () => {
    const d = drawing.current; if (!d) return false; drawing.current = null; setLive(null); drew.current = Date.now();
    if (!d.erase) setInk({ ...ink, [d.key]: [...(ink[d.key] || []), d.s] });
    return true;
  };
  const clearInk = () => { if (!hasInk) return; setInk({}); flash('Đã xóa nét vẽ. Bấm ↶ để hoàn tác.'); };
  const inkTool = INK_TOOLS.includes(tool);
  const drew = useRef(0);   // vừa vẽ xong (Ctrl / Shift kéo ở con trỏ) thì cú bấm theo sau không tính là bấm đáp án

  // bấm ảnh trên phiếu: xem ảnh lớn
  const onSurfClick = (e: React.MouseEvent) => {
    if (tool !== 'pointer' || Date.now() - drew.current < 300) return;
    const tg = e.target as HTMLElement, tb = tg.closest<HTMLElement>('.vtk');
    if (tg.closest('.vwi')) return;
    if (cover) {   // bấm tấm che: hé; bấm vào câu đã hé (không phải chỗ trả lời): che lại
      const u = tg.closest<HTMLElement>('[data-vu]');
      if (u && (tg.closest('.vcv') || !tg.closest('[data-ans]'))) { const id = u.dataset.vu!; setOpen(o => { const n = new Set(o); if (n.has(id)) n.delete(id); else n.add(id); return n; }); e.stopPropagation(); return; }
    }
    if (tb) { toggle(data.slots.filter(x => x.task === tb.dataset.vt && ansIds.has(x.id)).map(x => x.id)); e.stopPropagation(); return; }
    if (workClick(tg)) { e.stopPropagation(); return; }
    const p = (e.target as HTMLElement).closest('.pic'); const img = p && p.querySelector('img');
    if (img && img.getAttribute('src')) { setPic(img.getAttribute('src')); e.stopPropagation(); }
  };

  // GĐ1b bấm để làm: chọn phương án, nối, bấm vào chỗ gõ; dấu ✗ = xem đáp án chỗ đó; ⟲ = làm lại Task
  const workClick = (tg: HTMLElement) => {
    const m = tg.closest<HTMLElement>('.vwm.tap'); if (m) { toggle([m.dataset.vw!]); return true; }
    const g = tg.closest<HTMLElement>('.vwgo'); if (g) { commit(g.dataset.vg!, ans.current[g.dataset.vg!] ?? null); lastMany.current = null; return true; }
    const rs = tg.closest<HTMLElement>('.vrs'); if (rs) { resetWork(data.slots.filter(x => x.task === rs.dataset.vr).map(x => x.id)); flash('Đã xóa bài làm của Task này'); return true; }
    const ln = tg.closest<SVGElement>('svg.vwl'); if (ln) { commit(ln.dataset.vw!, null); return true; }
    const root = surfRef.current!;
    let el = tg.closest<HTMLElement>('[data-ans]');
    const ml = !el && tg.closest<HTMLElement>('.mrows > .ml:not(.mh)'), mr = !el && (tg.closest<HTMLElement>('.mrows > .mr:not(.mh)') || (tg.closest('.md .a7') ? (tg.closest('.md')!.nextElementSibling as HTMLElement | null) : null));
    if (ml) el = (ml.nextElementSibling as HTMLElement | null)?.querySelector<HTMLElement>('[data-ans]') || null;   // bấm chữ vế trái = bấm chấm trái
    if (el) {
      const id = el.dataset.ans!, s = slotBy[id]; if (!s) return false;
      const els = elsOf(root, id), kind = kindOf(s, els);
      if (kind === 'type') { (els[0].querySelector<HTMLElement>(':scope > .vwi'))?.focus(); return true; }
      if (kind === 'pick') {
        const j = pickIndex(els, tg), o = j >= 0 ? (s.options || [])[j] : undefined; if (!o) return true;
        const cur = picked(ans.current[id]);
        if (s.interaction === 'choice-many') {
          const nv = cur.includes(o.id) ? cur.filter(x => x !== o.id) : [...cur, o.id].sort((a, b) => (s.options || []).findIndex(x => x.id === a) - (s.options || []).findIndex(x => x.id === b));
          if (needsGo(s, data.key)) { draft(id, nv.length ? nv : null); lastMany.current = nv.length ? id : null; bump(); } else commit(id, nv.length ? nv : null);
        } else commit(id, cur[0] === o.id ? null : o.id);
        return true;
      }
      if (kind === 'link') {
        if (pend && 'row' in pend) {   // đã bấm vế phải trước
          const sec = el.closest<HTMLElement>('section.task'), mrow = sec && [...sec.querySelectorAll<HTMLElement>('.mr:not(.mh)')].find(x => x.textContent === pend.row);
          const o = mrow ? optOfRow(s, mrow) : null; setPend(null); if (o) link(id, o.id); return true;
        }
        setPend(pend && 'id' in pend && pend.id === id ? null : { id }); return true;
      }
      return false;
    }
    if (mr) {
      const sec = mr.closest<HTMLElement>('section.task')!;
      if (pend && 'id' in pend) { const s = slotBy[pend.id], o = s ? optOfRow(s, mr) : null; setPend(null); if (o) link(pend.id, o.id); return true; }
      const row = mr.textContent || ''; setPend(pend && 'row' in pend && pend.row === row ? null : { task: sec.dataset.task!, row }); return true;
    }
    return false;
  };
  // nối một cặp: một vế phải chỉ một đường (vế trái khác đang nối vào đó thì gỡ)
  const link = (id: string, opt: string) => {
    const s = slotBy[id]; if (!s) return;
    data.slots.filter(x => x.task === s.task && x.id !== id && x.interaction === 'match' && ans.current[x.id] === opt).forEach(x => { ans.current[x.id] = null; setDone(o => { const n = new Set(o); n.delete(x.id); return n; }); });
    commit(id, opt);
  };

  const cur = mode === 'page' ? `Trang ${pi + 1}/${nP}` : P.tasks[ti] ? `Task ${P.tasks[ti].num} · ${ti + 1}/${nT}` : '';
  const html = mode === 'page' ? P.pages[pi] || '' : taskHtml;
  const surf = useMemo(() => ({ __html: html }), [html]);

  return (
    <div id="wsShow" className={'show' + (bar ? '' : ' nobar') + (board ? ' boarding' : '')} role="dialog" aria-label="Trình chiếu phiếu" onPointerMove={poke}>
      <div className={'vstage' + (inkTool ? ' inking' : '')} ref={stageRef} data-mode={mode} data-tool={tool}
        onPointerDown={e => { if (inkDown(e)) return; if (e.pointerType === 'touch') { touches.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (touches.current.size === 2) pinch0.current = { d: dist(), z }; } }}
        onPointerMove={e => { if (inkMove(e)) return; if (touches.current.has(e.pointerId)) { touches.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (pinch0.current && touches.current.size === 2) zoomTo(pinch0.current.z * dist() / pinch0.current.d); } }}
        onPointerUp={e => { if (inkUp()) return; touches.current.delete(e.pointerId); if (touches.current.size < 2) pinch0.current = null; }}
        onPointerCancel={e => { inkUp(); touches.current.delete(e.pointerId); pinch0.current = null; }}>
        <div className="vwrap">
          <div className="vbox" style={{ width: W0 * s, height: H0 * s }}>
            <div className={'vsurf paper ' + (mode === 'page' ? 'vpage' : 'vtask')} ref={surfRef} style={{ transform: `scale(${s})` }} onClick={onSurfClick}>
              {mode === 'page'
                ? <><div className="flow" dangerouslySetInnerHTML={surf} /><div className="pfoot"><span>{data.title}</span><span>{`Trang ${pi + 1}/${nP}`}</span></div></>
                : <div className="vflow" style={{ padding: `${TASK_PAD}mm` }} dangerouslySetInnerHTML={surf} />}
              {inkHidden ? null : <div className="vink" aria-hidden="true">{anchors.map(a => {
                const arr = ink[a.key] || [], lv = live && live.key === a.key ? [live.s] : [];
                return arr.length || lv.length ? <svg key={a.key} style={{ left: a.x, top: a.y, width: a.w, height: a.h }}>
                  {[...arr, ...lv].map((st, i) => <path key={i} d={pathOf(st)} stroke={st.c} strokeWidth={st.w} />)}</svg> : null;
              })}</div>}
            </div>
          </div>
        </div>
      </div>
      {tool === 'zoomrect' ? <div className="vcap zoomrect" onPointerDown={onRectDown} onPointerMove={onRectMove} onPointerUp={onRectUp}>
        {rect ? <i className="vrect" style={{ left: Math.min(rect.x0, rect.x1), top: Math.min(rect.y0, rect.y1), width: Math.abs(rect.x1 - rect.x0), height: Math.abs(rect.y1 - rect.y0) }} /> : <span className="vhint">Kéo khung quanh vùng cần phóng · Esc để thôi</span>}
      </div> : null}
      <div className={'vpal' + (bar || inkTool ? '' : ' off')} role="toolbar" aria-label="Bút vẽ" onPointerEnter={() => setBar(true)}>
        <button className={'vb' + (tool === 'pointer' ? ' on' : '')} onClick={() => setTool('pointer')} title="Con trỏ (Esc)" aria-label="Con trỏ">↖</button>
        <button className={'vb' + (tool === 'pen' ? ' on' : '')} id="inkPen" onClick={() => setTool(tool === 'pen' ? 'pointer' : 'pen')} title="Bút (P)" aria-label="Bút">✎</button>
        <button className={'vb' + (tool === 'hl' ? ' on' : '')} id="inkHl" onClick={() => setTool(tool === 'hl' ? 'pointer' : 'hl')} title="Bút tô vàng (giữ Ctrl kéo cũng được)" aria-label="Bút tô"><i className="hlic" /></button>
        <button className={'vb' + (tool === 'line' ? ' on' : '')} id="inkLine" onClick={() => setTool(tool === 'line' ? 'pointer' : 'line')} title="Đường thẳng (giữ Shift = ngang / dọc; giữ Shift kéo cũng được)" aria-label="Đường thẳng">╱</button>
        <button className={'vb' + (tool === 'eraser' ? ' on' : '')} id="inkEraser" onClick={() => setTool(tool === 'eraser' ? 'pointer' : 'eraser')} title="Tẩy: kéo qua nét để xóa (E)" aria-label="Tẩy">⌫</button>
        <span className="vpsep" />
        {COLORS.map(([c, n]) => <button key={c} className={'vdot' + (color === c ? ' on' : '')} style={{ background: c }} title={n} aria-label={'Màu ' + n} onClick={() => { setColor(c); if (tool !== 'pen' && tool !== 'line') setTool('pen'); }} />)}
        <span className="vpsep" />
        {WIDTHS.map(([w, n]) => <button key={w} className={'vb vw' + (width === w ? ' on' : '')} title={'Nét ' + n} aria-label={'Nét ' + n} onClick={() => setWidth(w)}><i style={{ height: w }} /></button>)}
        <span className="vpsep" />
        <button className="vb" id="inkUndo" onClick={undo} disabled={!undoS.current.length} title="Hoàn tác (Ctrl+Z)" aria-label="Hoàn tác">↶</button>
        <button className="vb" onClick={redo} disabled={!redoS.current.length} title="Làm lại (Ctrl+Shift+Z)" aria-label="Làm lại">↷</button>
        <button className="vb" id="inkClear" onClick={clearInk} disabled={!hasInk} title="Xóa hết nét vẽ (hoàn tác được)" aria-label="Xóa hết">🗑</button>
        <button className={'vb' + (inkHidden ? ' on' : '')} onClick={() => setInkHidden(!inkHidden)} disabled={!hasInk && !inkHidden} title="Ẩn / hiện nét vẽ" aria-label="Ẩn nét vẽ">{inkHidden ? '◌' : '◉'}</button>
      </div>
      {board ? <Board st={boardSt} setSt={setBoardSt} color={color} width={width} onClose={() => setBoard(false)} /> : null}
      {timer ? <Timer onClose={() => setTimer(false)} /> : null}
      {msg ? <div className="vmsg" role="status">{msg}</div> : null}
      {pic ? <div className="vpic" onClick={() => setPic(null)} role="dialog" aria-label="Ảnh phóng to"><img src={pic} alt="" /></div> : null}
      <div className="vbar" ref={barRef} onPointerEnter={() => setBar(true)}>
        <div className="vgrp">
          <button className="vb" onClick={() => go(-1)} aria-label="Trước" title="Trước (←, PageUp)">◀</button>
          <span className="vcur" id="showCur">{cur}</span>
          <button className="vb" onClick={() => go(1)} aria-label="Sau" title="Sau (→, PageDown)">▶</button>
        </div>
        <div className="vgrp">
          <button className={'vb' + (mode === 'page' ? ' on' : '')} onClick={() => toMode('page')} title="Cả trang (T)">▭<span className="vt"> Cả trang</span></button>
          <button className={'vb' + (mode === 'task' ? ' on' : '')} onClick={() => toMode('task')} title="Từng Task (T)">☰<span className="vt"> Từng Task</span></button>
          <select className="vsel" aria-label="Đi tới Task" value="" onChange={e => { const i = +e.target.value; if (i >= 0) goTask(i); e.target.blur(); }}>
            <option value="">Đi tới…</option>
            {P.tasks.map((t, i) => <option key={t.id} value={i}>{`Task ${t.num}: ${t.title}`.slice(0, 60)}</option>)}
          </select>
        </div>
        <div className="vgrp">
          <button className="vb" onClick={() => zoomTo(z / 1.25)} aria-label="Thu nhỏ" title="Thu nhỏ (−)">−</button>
          <button className="vb" onClick={zoomFit} title="Vừa màn hình (0)" id="showZoom">{z === 1 ? 'Vừa' : `${Math.round(z * 100)}%`}</button>
          <button className="vb" onClick={() => zoomTo(z * 1.25)} aria-label="Phóng to" title="Phóng to (+)">+</button>
          <button className={'vb' + (tool === 'zoomrect' ? ' on' : '')} onClick={() => setTool(tool === 'zoomrect' ? 'pointer' : 'zoomrect')} title="Phóng vùng: kéo khung (Z)">⬚<span className="vt vt2"> Phóng vùng</span></button>
        </div>
        <div className="vgrp">
          <button className={'vb' + (timer ? ' on' : '')} id="showTimer" onClick={() => setTimer(!timer)} title="Đồng hồ đếm ngược (G)">⏱<span className="vt"> Đồng hồ</span></button>
          <button className={'vb' + (board ? ' on' : '')} id="showBoard" onClick={() => setBoard(!board)} title="Bảng trắng (B)">▢<span className="vt"> Bảng</span></button>
          <button className={'vb' + (cover ? ' on' : '')} id="showCover" onClick={toggleCover} title="Che từng câu, bấm để hé dần (H). Bấm lại để bỏ che">▤<span className="vt"> Che</span></button>
          {cover ? <button className="vb" id="showOpenAll" onClick={() => { const r = surfRef.current; if (r) setOpen(o => { const n = new Set(o); r.querySelectorAll<HTMLElement>('[data-vu]').forEach(u => n.add(u.dataset.vu!)); return n; }); }} title="Hé hết phần đang xem">Hé hết</button> : null}
          <button className={'vb' + (allOn ? ' on' : '')} id="showAns" onClick={toggleAll} title={`Hiện / ẩn đáp án cả phiếu (A) · Space: hiện lần lượt, Shift+Space: ẩn lại · nút ✓ đầu Task: hiện Task đó${noKey ? ` · ${noKey} chỗ chưa có đáp án` : ''}`}>✓<span className="vt"> Đáp án</span></button>
          <button className={'vb' + (clickAns ? ' on' : '')} id="showClick" onClick={() => setClickAns(!clickAns)} title="Bật: nút Sau của bút trình chiếu hiện đáp án kế tiếp, hết đáp án mới lật">⏭<span className="vt vt2"> Clicker: đáp án</span></button>
          {noKey ? <span className="vnote" title="Các chỗ này chưa nhập đáp án trong WS Editor">{noKey} chỗ chưa có đáp án</span> : null}
        </div>
        <div className="vgrp">
          {autoIds.length ? <span className="vscore" id="workScore" title="Số chỗ làm đúng / số chỗ máy chấm được. Bấm vào chỗ trả lời để làm thử">{`Đúng ${nOk}/${autoIds.length}`}</span> : null}
          <button className={'vb' + (reveal ? ' on' : '')} id="workReveal" onClick={() => setReveal(!reveal)} title="Bật: làm sai thì hiện luôn đáp án đúng. Tắt: bấm dấu ✗ để xem">✗→✓<span className="vt"> Sai thì hiện đáp án</span></button>
          <button className="vb" id="workReset" disabled={!anyWork} onClick={() => { resetWork(data.slots.map(x => x.id)); flash('Đã xóa bài làm cả phiếu'); }} title="Làm lại cả phiếu (xóa bài làm)">⟲<span className="vt"> Làm lại</span></button>
        </div>
        <div className="vgrp">
          <button className="vb" onClick={toggleFs} title={fs ? 'Thu cửa sổ (F)' : 'Toàn màn hình (F)'}>⛶<span className="vt vt2">{fs ? ' Thu cửa sổ' : ' Toàn màn hình'}</span></button>
          <button className="vb x" onClick={onClose} title="Thoát trình chiếu (Esc)" id="showClose">✕<span className="vt"> Thoát</span></button>
        </div>
      </div>
    </div>
  );
}
