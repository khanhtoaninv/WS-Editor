// Chấm chữa từng học sinh (v120). Bên trái: trình xem vai "review" (bài làm của em nạp sẵn, khóa, có dấu đúng / sai của máy,
// chỗ chấm tay bấm ✓ / ✗). Bên phải: bảng chấm (điểm từng chỗ, sửa điểm máy chấm, lời nhắn từng chỗ, nhận xét chung, Chốt chấm).
// Tự lưu lên máy chủ 0,6 giây sau mỗi thay đổi. Điểm ở bảng bên phải là điểm chính thức.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Presenter } from '../viewer/Presenter';
import { grade, type Answers, type Key, type Overrides, type Slot } from '../../../shared/src/index.ts';
import { answerText, keyText } from '../../../shared/src/baocao.ts';
import { api } from './api';
import { loadPkg, type Pkg } from './pkg';

type HsC = { hs: string; ten: string; nop: boolean; vao: boolean; xong: boolean; score: number; max: number; pending: number; answers: Answers; overrides: Overrides; nhanXet: string };
type D = { phien: { trangThai: 'mo' | 'dong'; ten: string; goi: string }; slots: Slot[]; key: Key; pages: string[]; title: string; tasks: { id: string; num: string; title: string }[]; hocSinh: HsC[] };
const ST: Record<string, string> = { correct: 'đúng', wrong: 'sai', partial: 'một phần', blank: 'bỏ trống', pending: 'chờ chấm', ungraded: 'không chấm' };

export function Cham({ phien, hs, onBack, onReport }: { phien: string; hs?: string; onBack: () => void; onReport: () => void }) {
  const [d, setD] = useState<D | null>(null), [pkg, setPkg] = useState<Pkg | null>(null), [err, setErr] = useState('');
  const [cur, setCur] = useState(''), [save, setSave] = useState<'' | 'dang-luu' | 'da-luu' | 'loi'>('');
  const timer = useRef(0), pendingPut = useRef<{ hs: string; body: object } | null>(null);
  useEffect(() => {
    api<D>(`/api/phien/${phien}/cham`).then(async x => {
      setPkg(await loadPkg(x.phien.goi, x.pages, x.title, x.slots)); setD(x);
      const first = x.hocSinh.find(h => h.hs === hs) || x.hocSinh.find(h => h.nop && !h.xong) || x.hocSinh.find(h => h.vao) || x.hocSinh[0];
      setCur(first ? first.hs : '');
    }, e => setErr(e.message));
  }, [phien]);   // eslint-disable-line react-hooks/exhaustive-deps

  const flush = () => {
    clearTimeout(timer.current); const p = pendingPut.current; if (!p) return Promise.resolve();
    pendingPut.current = null; setSave('dang-luu');
    return api<{ score: number; max: number; pending: number; xong: boolean }>(`/api/phien/${phien}/cham/${p.hs}`, { method: 'PUT', json: p.body })
      .then(r => { setSave('da-luu'); setD(o => o && { ...o, hocSinh: o.hocSinh.map(h => h.hs === p.hs ? { ...h, score: r.score, pending: r.pending, xong: r.xong } : h) }); },
        e => { setSave('loi'); setErr((e as Error).message); });
  };
  useEffect(() => () => { flush(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps
  const h = d?.hocSinh.find(x => x.hs === cur);
  const patch = (p: Partial<HsC>) => {
    if (!d || !h) return;
    const n = { ...h, ...p }, g = grade(d.slots, d.key, n.answers, n.overrides);
    setD({ ...d, hocSinh: d.hocSinh.map(x => x.hs === h.hs ? { ...n, score: g.score, max: g.max, pending: g.pendingManual } : x) });
    pendingPut.current = { hs: h.hs, body: { overrides: n.overrides, nhanXet: n.nhanXet, xong: n.xong } };
    setSave('dang-luu'); clearTimeout(timer.current); timer.current = window.setTimeout(flush, 600);
  };
  const go = (k: number) => { if (!d) return; flush(); const i = d.hocSinh.findIndex(x => x.hs === cur), n = d.hocSinh[(i + k + d.hocSinh.length) % d.hocSinh.length]; setCur(n.hs); };

  const manual = (s: Slot) => (d!.key[s.id]?.grading ?? s.grading) === 'manual';
  const maxOf = (s: Slot) => d!.key[s.id]?.score ?? 1;
  // chấm tay ✓ / ✗ trên trình xem ↔ điểm tối đa / 0 trong bảng
  const man0 = useMemo(() => {
    const m: Record<string, 'ok' | 'no'> = {}; if (!d || !h) return m;
    for (const s of d.slots) { const o = h.overrides[s.id]; if (!o || !manual(s)) continue; if (o.score >= maxOf(s)) m[s.id] = 'ok'; else if (o.score <= 0) m[s.id] = 'no'; }
    return m;
  }, [d, h?.overrides]);   // eslint-disable-line react-hooks/exhaustive-deps
  const onMan = (m: Record<string, 'ok' | 'no'>) => {
    if (!d || !h) return;
    const ov = { ...h.overrides }; let ch = false;
    for (const s of d.slots) { if (!manual(s)) continue; const o = ov[s.id], want = m[s.id] === 'ok' ? maxOf(s) : m[s.id] === 'no' ? 0 : null;
      if (want != null && (!o || o.score !== want)) { ov[s.id] = { ...(o || {}), score: want }; ch = true; }
      else if (want == null && o && (o.score >= maxOf(s) || o.score <= 0) && !o.comment) { delete ov[s.id]; ch = true; } }
    if (ch) patch({ overrides: ov });
  };
  const setScore = (s: Slot, v: string) => {
    const ov = { ...h!.overrides }, o = ov[s.id];
    if (v === '') { const a = grade(d!.slots, d!.key, h!.answers, {}).perSlot[s.id].score; if (o?.comment && a != null) ov[s.id] = { score: a, comment: o.comment }; else delete ov[s.id]; }   // xóa điểm: về điểm máy chấm
    else ov[s.id] = { ...(o || {}), score: Math.max(0, Math.min(maxOf(s), +v)) };
    patch({ overrides: ov });
  };
  const setNote = (s: Slot, c: string) => {
    const ov = { ...h!.overrides }, o = ov[s.id], g = grade(d!.slots, d!.key, h!.answers, {}).perSlot[s.id];
    if (c) ov[s.id] = { score: o ? o.score : g.score ?? 0, comment: c }; else if (o) { const { comment: _c, ...rest } = o; ov[s.id] = rest as { score: number }; }
    patch({ overrides: ov });
  };

  if (err && !d) return <><button className="lb ghost" onClick={onBack}>← Phiên</button><p className="err">{err}</p></>;
  if (!d || !pkg) return <p className="hint">Đang tải bài làm…</p>;
  if (!h) return <><button className="lb ghost" onClick={onBack}>← Phiên</button><p className="hint">Lớp không có học sinh.</p></>;
  const g = grade(d.slots, d.key, h.answers, h.overrides), g0 = grade(d.slots, d.key, h.answers, {});
  const open = d.phien.trangThai === 'mo', idx = d.hocSinh.findIndex(x => x.hs === cur);
  const tnum = Object.fromEntries(d.tasks.map(t => [t.id, t.num]));
  const rows = d.slots.filter(s => g.perSlot[s.id] && g.perSlot[s.id].max > 0);
  const first = (s: Slot) => s.task !== rows[rows.indexOf(s) - 1]?.task;

  return <>
    <Presenter key={h.hs} data={{ title: pkg.title, pages: pkg.pages, slots: d.slots, key: d.key, role: 'review', lock: true, init: h.answers, man0, onMan, store: 'cham:' + phien + ':' + h.hs,
      banner: !h.vao ? <>{h.ten} không vào phiên: không có bài làm.</> : null }} onClose={() => { flush(); onBack(); }} />
    <aside className="chpanel" id="chPanel" aria-label="Bảng chấm">
      <div className="chhd">
        <button className="lb ghost" onClick={() => go(-1)} aria-label="Em trước" title="Em trước">◀</button>
        <select id="chHs" value={cur} onChange={e => { flush(); setCur(e.target.value); }} aria-label="Chọn học sinh">
          {d.hocSinh.map(x => <option key={x.hs} value={x.hs}>{x.xong ? '✓ ' : ''}{x.ten}{x.vao ? '' : ' (không vào)'}</option>)}</select>
        <button className="lb ghost" id="chNext" onClick={() => go(1)} aria-label="Em sau" title="Em sau">▶</button>
        <span className="hint">{idx + 1}/{d.hocSinh.length}</span>
      </div>
      <div className="chsum"><span className="chsc" id="chScore">{g.score}<small>/{g.max}</small></span>
        <span>{g.pendingManual ? <span className="chip warn">{g.pendingManual} chỗ chờ chấm tay</span> : <span className="chip ok">Đã chấm đủ</span>}
          {h.nop ? null : <span className="chip">{h.vao ? 'chưa nộp' : 'không vào'}</span>}</span>
        <span className={'hssave ' + save} id="chSave">{save === 'dang-luu' ? 'Đang lưu…' : save === 'loi' ? 'Chưa lưu được' : save === 'da-luu' ? '✓ Đã lưu' : ''}</span></div>
      {open ? <p className="err">Phiên còn mở: kết thúc phiên rồi mới chấm được.</p> : null}
      {err ? <p className="err">{err}</p> : null}
      <div className="chlist">
        {rows.map(s => { const r = g.perSlot[s.id], r0 = g0.perSlot[s.id], o = h.overrides[s.id], m = manual(s), a = answerText(s, h.answers[s.id]);
          return <div key={s.id}>
            {first(s) ? <div className="chtask">Task {tnum[s.task] || '?'}</div> : null}
            <div className={'chrow ' + r.status} data-slot={s.id}>
              <span className="chl">{s.label}</span>
              <span className="cha" title={a}>{a || <i className="hint">(trống)</i>}{r.status !== 'correct' && keyText(s, d.key[s.id]) ? <span className="chk" title="Đáp án">→ {keyText(s, d.key[s.id])}</span> : null}</span>
              <span className={'chip ' + (r.status === 'correct' ? 'ok' : r.status === 'pending' ? 'warn' : '')}>{m && r.status !== 'pending' ? 'tay: ' : o && !m && o.score !== r0.score ? 'sửa: ' : ''}{ST[r.status]}</span>
              <input type="number" min={0} max={maxOf(s)} step={0.5} className="chin" aria-label={'Điểm câu ' + s.label} disabled={open} value={o ? o.score : r.score ?? ''} placeholder="?" onChange={e => setScore(s, e.target.value)} />
              <span className="hint">/{maxOf(s)}</span>
              {m ? <span className="chq"><button className="lb ghost" disabled={open} title="Đúng (điểm tối đa)" onClick={() => setScore(s, String(maxOf(s)))}>✓</button><button className="lb ghost" disabled={open} title="Sai (0 điểm)" onClick={() => setScore(s, '0')}>✗</button></span> : null}
            </div>
            {o || m || r.status === 'wrong' || r.status === 'partial' ? <input className="chnote" placeholder="Lời nhắn cho câu này (tùy chọn)" disabled={open} value={o?.comment || ''} onChange={e => setNote(s, e.target.value)} /> : null}
          </div>; })}
      </div>
      <label className="chnx">Nhận xét chung <textarea id="chNhanXet" rows={3} disabled={open} value={h.nhanXet} onChange={e => patch({ nhanXet: e.target.value })} placeholder="VD: Em làm tốt phần đọc, cần ôn thì quá khứ." /></label>
      <div className="row">
        <label className="chxong"><input type="checkbox" id="chXong" disabled={open} checked={h.xong} onChange={e => patch({ xong: e.target.checked })} /> Chốt chấm xong</label>
        <span className="sp" /><button className="lb" onClick={() => { flush(); onReport(); }} id="chBaoCao">Báo cáo</button>
        <button className="lb pri" disabled={open} onClick={() => { if (!h.xong) patch({ xong: true }); setTimeout(() => go(1), 0); }} title="Chốt chấm em này, sang em sau">Chốt, em sau ▶</button>
      </div>
      <p className="hint">Bấm ✓ / ✗ cạnh chỗ chấm tay trên phiếu, hoặc nhập điểm ở đây (sửa được cả điểm máy chấm). Điểm ở bảng này là điểm chính thức.</p>
    </aside>
  </>;
}
