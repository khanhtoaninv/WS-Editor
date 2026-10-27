// GĐ1a B7: đồng hồ đếm ngược và bảng trắng của trình chiếu.
import { useEffect, useRef, useState } from 'react';
import { HL, hit, lockLine, pathOf, type Pt, type Stroke } from './ink';

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

// chuông hết giờ: hai tiếng ngắn bằng Web Audio (không cần tệp âm thanh)
function ring() {
  try {
    const A = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext; if (!A) return;
    const ac = new A();
    [0, .45].forEach(t0 => [880, 1320].forEach((f, i) => {
      const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + t0 + i * .12;
      o.frequency.value = f; o.type = 'sine'; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.3, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + .35);
      o.connect(g).connect(ac.destination); o.start(t); o.stop(t + .4);
    }));
    setTimeout(() => ac.close().catch(() => {}), 1500);
  } catch (_) { /* không có âm thanh thì thôi */ }
}

export function Timer({ onClose }: { onClose: () => void }) {
  const [total, setTotal] = useState(180), [left, setLeft] = useState(180), [run, setRun] = useState(false);
  const [big, setBig] = useState(true), [mute, setMute] = useState(false), [done, setDone] = useState(false);
  const end = useRef(0);
  useEffect(() => {
    if (!run) return;
    end.current = Date.now() + left * 1000;
    const id = window.setInterval(() => {
      const l = Math.max(0, Math.ceil((end.current - Date.now()) / 1000)); setLeft(l);
      if (l === 0) { setRun(false); setDone(true); if (!mute) ring(); }
    }, 200);
    return () => clearInterval(id);
  }, [run]);   // eslint-disable-line react-hooks/exhaustive-deps
  const set = (s: number) => { const v = Math.max(10, Math.min(99 * 60, s)); setTotal(v); setLeft(v); setRun(false); setDone(false); };
  const add = (d: number) => { if (run) { end.current += d * 1000; setLeft(l => Math.max(0, l + d)); } else set(left + d); };
  return (
    <div className={'vtimer' + (big ? ' big' : '') + (done ? ' done' : '')} role="timer" aria-label="Đồng hồ đếm ngược">
      <div className="vtnum" id="timerNum" onClick={() => setBig(!big)} title={big ? 'Thu nhỏ vào góc' : 'Phóng to giữa màn hình'}>{fmt(left)}</div>
      <div className="vtrow">
        {[1, 3, 5, 10].map(m => <button key={m} className={'vb' + (total === m * 60 && !run ? ' on' : '')} onClick={() => set(m * 60)}>{m}′</button>)}
        <button className="vb" onClick={() => add(-60)} aria-label="Bớt 1 phút">−1′</button>
        <button className="vb" onClick={() => add(60)} aria-label="Thêm 1 phút">+1′</button>
      </div>
      <div className="vtrow">
        <button className={'vb' + (run ? '' : ' go')} id="timerGo" onClick={() => { if (left === 0) { setLeft(total); setDone(false); } setRun(!run); }}>{run ? '❚❚ Dừng' : '▶ Bắt đầu'}</button>
        <button className="vb" onClick={() => set(total)} title="Đặt lại">↺</button>
        <button className={'vb' + (mute ? ' on' : '')} onClick={() => setMute(!mute)} title="Tắt / bật chuông">{mute ? '🔕' : '🔔'}</button>
        <button className="vb" onClick={() => setBig(!big)} title={big ? 'Thu nhỏ vào góc' : 'Phóng to'}>{big ? '↘' : '↖'}</button>
        <button className="vb x" onClick={onClose} title="Đóng đồng hồ (G)" aria-label="Đóng đồng hồ">✕</button>
      </div>
    </div>
  );
}

export type BoardBg = 'plain' | 'lines' | 'grid';
export type BoardState = { strokes: Stroke[]; bg: BoardBg };

// bảng trắng: phủ cả màn hình, vẽ bằng màu và độ dày đang chọn; nội dung giữ trong buổi chiếu, không lưu
export function Board({ st, setSt, color, width, onClose }: { st: BoardState; setSt: (s: BoardState) => void; color: string; width: number; onClose: () => void }) {
  const [tool, setTool] = useState<'pen' | 'hl' | 'eraser'>('pen');
  const [live, setLive] = useState<Stroke | null>(null);
  const cur = useRef<{ s: Stroke | null; erased: boolean; shift: boolean } | null>(null), hist = useRef<Stroke[][]>([]);
  const pt = (e: React.PointerEvent): Pt => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const erase = (p: Pt) => {
    const keep = st.strokes.filter(s => !hit(s, p, 14)); if (keep.length === st.strokes.length) return;
    if (!cur.current!.erased) { cur.current!.erased = true; hist.current.push(st.strokes); }
    setSt({ ...st, strokes: keep });
  };
  const down = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); const p = pt(e);
    if (tool === 'eraser') { cur.current = { s: null, erased: false, shift: false }; erase(p); return; }
    const t = e.shiftKey ? 'line' : tool;
    const s: Stroke = { t, c: t === 'hl' ? HL : color, w: t === 'hl' ? width * 4 : width, pts: [p] }; cur.current = { s, erased: false, shift: e.shiftKey }; setLive(s);
  };
  const move = (e: React.PointerEvent) => {
    const c = cur.current; if (!c) return; const p = pt(e);
    if (!c.s) { erase(p); return; }
    const q = c.s.pts; c.s = c.s.t === 'line' ? { ...c.s, pts: [q[0], lockLine(q[0], p)] } : { ...c.s, pts: [...q, p] }; setLive(c.s);
  };
  const up = () => { const c = cur.current; cur.current = null; setLive(null); if (c && c.s) { hist.current.push(st.strokes); setSt({ ...st, strokes: [...st.strokes, c.s] }); } };
  const undo = () => { const p = hist.current.pop(); if (p) setSt({ ...st, strokes: p }); };
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); e.stopPropagation(); undo(); } };
    window.addEventListener('keydown', k, true); return () => window.removeEventListener('keydown', k, true);
  });
  return (
    <div className="vboard" role="dialog" aria-label="Bảng trắng">
      <div className={'vbsurf bg-' + st.bg} id="boardSurf" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <svg>{[...st.strokes, ...(live ? [live] : [])].map((s, i) => <path key={i} d={pathOf(s)} stroke={s.c} strokeWidth={s.w} />)}</svg>
      </div>
      <div className="vbtools">
        <button className={'vb' + (tool === 'pen' ? ' on' : '')} onClick={() => setTool('pen')} title="Bút (giữ Shift = đường thẳng)">✎</button>
        <button className={'vb' + (tool === 'hl' ? ' on' : '')} onClick={() => setTool('hl')} title="Bút tô"><i className="hlic" /></button>
        <button className={'vb' + (tool === 'eraser' ? ' on' : '')} onClick={() => setTool('eraser')} title="Tẩy">⌫</button>
        <select className="vsel" aria-label="Nền bảng" value={st.bg} onChange={e => setSt({ ...st, bg: e.target.value as BoardBg })}>
          <option value="plain">Nền trắng</option><option value="lines">Kẻ dòng</option><option value="grid">Kẻ ô</option>
        </select>
        <button className="vb" onClick={undo} title="Hoàn tác (Ctrl+Z)">↶</button>
        <button className="vb" id="boardClear" onClick={() => { if (st.strokes.length) { hist.current.push(st.strokes); setSt({ ...st, strokes: [] }); } }} title="Xóa bảng (hoàn tác được)">🗑 Xóa</button>
        <button className="vb x" id="boardClose" onClick={onClose} title="Về phiếu (Esc, B)">Về phiếu</button>
      </div>
    </div>
  );
}
