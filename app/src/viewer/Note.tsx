// v117 E11 hộp Note trên phiếu khi chiếu: gõ hoặc nói (nhận giọng nói của trình duyệt nếu có), tự giãn theo chữ, thu gọn / xóa.
import { useEffect, useRef, useState } from 'react';
import type { Note } from './ink';

type Rec = { lang: string; continuous: boolean; interimResults: boolean; start: () => void; stop: () => void; onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null };

export function NoteBox({ n, x, y, focus, sr, onFocused, onChange, onDelete }: { n: Note; x: number; y: number; focus: boolean; sr: boolean; onFocused: () => void; onChange: (v: Partial<Note>) => void; onDelete: () => void }) {
  const ta = useRef<HTMLTextAreaElement>(null), rec = useRef<Rec | null>(null);
  const [mic, setMic] = useState(false);
  useEffect(() => { if (focus && ta.current) { ta.current.focus(); onFocused(); } }, [focus]);   // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => rec.current?.stop(), []);
  const listen = () => {
    if (mic) { rec.current?.stop(); return; }
    const W = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec }, C = W.SpeechRecognition || W.webkitSpeechRecognition; if (!C) return;
    const r = new C(); r.lang = navigator.language || 'vi-VN'; r.continuous = true; r.interimResults = false;
    let base = ta.current ? ta.current.value : n.t;
    r.onresult = e => { for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) { base = (base ? base.replace(/\s*$/, ' ') : '') + e.results[i][0].transcript.trim(); onChange({ t: base }); } };
    r.onend = () => { setMic(false); rec.current = null; }; r.onerror = () => { setMic(false); rec.current = null; };
    try { r.start(); rec.current = r; setMic(true); } catch (_) { /* trình duyệt từ chối */ }
  };
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();
  if (n.c) return <button className="vnt vntc" style={{ left: x, top: y }} title={n.t || 'Ghi chú'} onClick={e => { stop(e); onChange({ c: false }); }} onDoubleClick={stop}>📝 {n.t ? n.t.slice(0, 18) + (n.t.length > 18 ? '…' : '') : ''}</button>;
  return (
    <div className="vnt" style={{ left: x, top: y }} onClick={stop} onDoubleClick={stop} onPointerDown={stop}>
      <div className="vnth">
        <span>📝 Ghi chú</span>
        {sr ? <button className={'vntb' + (mic ? ' on' : '')} onClick={listen} title={mic ? 'Dừng nghe' : 'Nói để ghi (nhận giọng nói của trình duyệt)'} aria-label="Nói">🎤</button> : null}
        <button className="vntb" onClick={() => onChange({ c: true })} title="Thu gọn" aria-label="Thu gọn">–</button>
        <button className="vntb" onClick={onDelete} title="Xóa ghi chú" aria-label="Xóa ghi chú">×</button>
      </div>
      <textarea ref={ta} className="vntt" value={n.t} placeholder="Gõ ghi chú…" rows={1} onChange={e => onChange({ t: e.target.value })}
        onKeyDown={e => { e.stopPropagation(); if (e.key === 'Escape') (e.target as HTMLElement).blur(); }}
        onBlur={e => { if (!n.t.trim() && !mic && !(e.relatedTarget && e.currentTarget.parentElement!.contains(e.relatedTarget as Node))) onDelete(); }} />
    </div>
  );
}
