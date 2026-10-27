// Thanh kéo độ rộng cột trái (v106: #lsplit). Kéo = đổi độ rộng, bấm đúp = về mặc định, mũi tên = ±20 px (Shift ±60),
// nhớ trong localStorage (khóa cũ, giáo viên không mất cài đặt). Độ rộng đặt vào biến CSS --lw của .app.
// data-w (nhãn "480 px" khi kéo) giữ lại sau khi thả như v106; CSS chỉ hiện nó khi có class drag.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { actions } from './actions';

export const LW_KEY = 'wsEditor.leftW.v2', LW_DEF = 420;
export const lwMax = () => Math.max(320, Math.min(720, window.innerWidth - 312 - 32 - 40 - 420)); // chừa tối thiểu ~420px cho trang A4
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const saved = () => { try { const v = parseInt(localStorage.getItem(LW_KEY) || '', 10); if (v >= 240 && v <= 900) return v; } catch (_) {} return LW_DEF; };

export function LeftSplit() {
  const w = useRef(saved()), [, setTick] = useState(0), [drag, setDrag] = useState(false), [label, setLabel] = useState<string | null>(null), ref = useRef<HTMLDivElement>(null);
  const setLeftW = (px: number, save: boolean) => {
    w.current = clamp(Math.round(px), 240, lwMax());
    (document.querySelector('.app') as HTMLElement).style.setProperty('--lw', w.current + 'px');
    if (save) { try { localStorage.setItem(LW_KEY, String(w.current)); } catch (_) {} }
    setTick(n => n + 1);
  };
  useLayoutEffect(() => { setLeftW(w.current, false); }, []);
  useEffect(() => { const f = () => setLeftW(w.current, false); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
  const down = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault(); const el = ref.current!; el.setPointerCapture(e.pointerId);
    const x0 = e.clientX, w0 = w.current; let raf = 0;
    setDrag(true);
    const mv = (ev: PointerEvent) => { setLeftW(w0 + ev.clientX - x0, false); setLabel(w.current + ' px'); if (!raf) raf = requestAnimationFrame(() => { raf = 0; actions.liveScale(); }); };
    const up = () => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); setDrag(false); setLeftW(w.current, true); actions.draw(); };
    el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  };
  return (
    <div className={'lsplit' + (drag ? ' drag' : '')} id="lsplit" role="separator" aria-orientation="vertical" aria-label="Độ rộng khung nhập liệu" tabIndex={0}
      title="Kéo để đổi độ rộng khung nhập liệu. Bấm đúp để về mặc định." ref={ref}
      aria-valuenow={w.current} aria-valuemin={240} aria-valuemax={lwMax()} data-w={label ?? undefined}
      onPointerDown={down}
      onDoubleClick={() => { setLeftW(LW_DEF, true); actions.draw(); }}
      onKeyDown={e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); setLeftW(w.current + (e.key === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? 60 : 20), true); actions.draw(); } }} />
  );
}
