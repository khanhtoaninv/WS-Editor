// Báo cáo lớp sau một phiên (v121; báo cáo từng em + Insight AI ở v122). Số liệu tính ở máy chủ bằng shared/src/baocao.ts.
// Nhận xét theo quy tắc luôn có, không cần mạng.
import { useEffect, useState } from 'react';
import type { ClassReport, Insight } from '../../../shared/src/baocao.ts';
import { api } from './api';
import { Card } from './Teacher';

type CR = ClassReport & { phien: { ten: string; lopTen: string; goiTen: string; trangThai: string } };
const DIST = ['0–19%', '20–39%', '40–59%', '60–79%', '80–100%'];

const Bar = ({ label, pct, cls, title }: { label: string; pct: number; cls?: number; title?: string }) =>
  <div className="rbar" title={title || `${label}: ${pct}%${cls != null ? ` (lớp ${cls}%)` : ''}`}>
    <span className="rbl">{label}</span>
    <span className="rbt"><i style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />{cls != null ? <b style={{ left: `${cls}%` }} /> : null}</span>
    <span className="rbv">{pct}%{cls != null ? <small> · lớp {cls}%</small> : null}</span>
  </div>;
const Ins = ({ list }: { list: Insight[] }) => <ul className="rins">{list.map((x, i) => <li key={i} className={x.muc}><span className="rdot" aria-hidden="true">{x.muc === 'cao' ? '!' : x.muc === 'tot' ? '★' : '•'}</span>{x.text}</li>)}</ul>;

export function BaoCao({ phien, onBack, onCham }: { phien: string; ai: boolean; onBack: () => void; onCham: (hs: string) => void }) {
  const [c, setC] = useState<CR | null>(null), [err, setErr] = useState('');
  useEffect(() => { api<CR>(`/api/phien/${phien}/bao-cao`).then(setC, e => setErr(e.message)); }, [phien]);
  if (err) return <><button className="lb ghost" onClick={onBack}>← Phiên</button><p className="err">{err}</p></>;
  if (!c) return <p className="hint">Đang tính báo cáo…</p>;
  const dmax = Math.max(1, ...c.dist), none = !c.nVao, pc = (x: number) => none ? '–' : `${x}%`;
  const csv = () => {
    const q = (s: string | number) => `"${String(s).replace(/"/g, '""')}"`;
    const rows = [['Học sinh', 'Trạng thái', 'Điểm', 'Tối đa', '%', 'Chờ chấm tay', 'Bỏ trống'], ...c.students.map(s => [s.ten, s.nop ? 'đã nộp' : s.vao ? 'chưa nộp' : 'không vào', s.score, s.max, s.pct, s.pending, s.blank])];
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + rows.map(r => r.map(q).join(',')).join('\n')], { type: 'text/csv' }));
    a.download = `bao-cao-${c.phien.ten.replace(/[^\w-]+/g, '-')}.csv`; a.click();
  };
  return <div className="rpt" id="rLop">
    <div className="row"><button className="lb ghost" onClick={onBack}>← Phiên</button><span className="sp" /><button className="lb" onClick={csv} id="rCsv">Tải bảng điểm (CSV)</button></div>
    <Card title={<>Báo cáo lớp · {c.phien.ten}</>}>
      <p className="hint">{c.phien.lopTen} · {c.phien.goiTen}{c.pending ? ` · còn ${c.pending} chỗ chấm tay chưa chấm (chưa tính vào %)` : ''}</p>
      <div className="rtiles">
        <div><b id="rNop">{c.nNop}/{c.nLop}</b><span>đã nộp</span></div>
        <div><b id="rAvg">{pc(c.avg)}</b><span>trung bình</span></div>
        <div><b>{pc(c.median)}</b><span>trung vị</span></div>
        <div><b>{none ? '–' : `${c.lo}–${c.hi}%`}</b><span>thấp – cao nhất</span></div>
      </div>
    </Card>
    <div className="rgrid">
      <Card title="Nhận xét nhanh"><Ins list={c.insights} /></Card>
      {none ? <Card title="Phân bố điểm"><p className="hint">Chưa có bài làm.</p></Card> : <Card title="Phân bố điểm">
        <div className="rdist" role="img" aria-label={'Số em theo mức điểm: ' + c.dist.map((n, i) => `${DIST[i]} ${n} em`).join(', ')}>
          {c.dist.map((n, i) => <div key={i} className="rdc" title={`${DIST[i]}: ${n} em`}><span className="rdn">{n}</span><i style={{ height: `${n / dmax * 100}%` }} /><span className="rdl">{DIST[i]}</span></div>)}
        </div>
        <h3>Theo dạng bài</h3>{c.qs.map(q => <Bar key={q.id} label={q.name} pct={q.pct} />)}
        <h3>Theo Task</h3>{c.tasks.map(t => <Bar key={t.id} label={t.name} pct={t.pct} />)}
      </Card>}
    </div>
    <Card title="Câu sai nhiều">
      {c.top.length ? <table className="ltbl" id="rTop"><thead><tr><th>Câu</th><th>Đúng</th><th>Đáp án</th><th>Trả lời sai hay gặp</th></tr></thead><tbody>
        {c.top.map(s => <tr key={s.id}><td>Task {s.taskNum} · câu {s.label}</td><td><b>{s.pct}%</b> <span className="hint">({s.correct}/{s.n - s.pending})</span></td><td>{s.key}</td>
          <td>{s.wrongs.map(w => <span key={w.text} className="chip">{w.text || '(?)'} ×{w.n}</span>)}{s.blank ? <span className="chip">bỏ trống ×{s.blank}</span> : null}</td></tr>)}</tbody></table>
        : <p className="hint">{none ? 'Chưa có bài làm.' : 'Không câu nào dưới 70% đúng.'}</p>}
    </Card>
    <Card title="Học sinh">
      <table className="ltbl" id="rHs"><thead><tr><th>Học sinh</th><th>Điểm</th><th></th><th></th></tr></thead><tbody>
        {c.students.map(s => <tr key={s.hs} data-hs={s.hs}><td>{s.ten}{s.nop ? null : <span className="chip">{s.vao ? 'chưa nộp' : 'không vào'}</span>}</td>
          <td>{s.vao ? <><b>{s.pct}%</b> <span className="hint">{s.score}/{s.max}</span>{s.pending ? <span className="chip warn">{s.pending} chờ chấm</span> : null}</> : '–'}</td>
          <td style={{ width: '30%' }}>{s.vao ? <span className="rbt sm"><i style={{ width: `${s.pct}%` }} /><b style={{ left: `${c.avg}%` }} /></span> : null}</td>
          <td className="r">{s.vao ? <button className="lb" onClick={() => onCham(s.hs)}>Chấm chữa</button> : null}</td></tr>)}</tbody></table>
      <p className="hint">Vạch đứng trên thanh = trung bình lớp.</p>
    </Card>
    <details className="lcard"><summary><b>Từng câu ({c.slots.length})</b></summary>
      <table className="ltbl" id="rSlots"><thead><tr><th>Câu</th><th>Dạng</th><th>Đúng</th><th>Sai</th><th>Trống</th><th>Đáp án</th></tr></thead><tbody>
        {c.slots.map(s => <tr key={s.id}><td>T{s.taskNum} · {s.label}</td><td className="hint">{s.manual ? 'chấm tay' : ''}</td><td>{s.n - s.pending ? `${s.pct}%` : '–'}</td><td>{s.wrong + s.partial}</td><td>{s.blank}</td><td className="hint">{s.key}</td></tr>)}</tbody></table>
    </details>
  </div>;
}
