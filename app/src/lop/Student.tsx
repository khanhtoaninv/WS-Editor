// Trang học sinh (/hs): nhập mã phiên → chọn tên → làm bài trên trình xem (vai student: không đáp án, không chấm) → Nộp.
// Bài làm tự lưu lên máy chủ (gõ xong 0,8 giây); vào lại trên cùng máy thì làm tiếp. Phiên kết thúc thì bài bị thu và khóa.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Presenter } from '../viewer/Presenter';
import { isBlank, type Answers, type Slot } from '../../../shared/src/index.ts';
import { api, events, fmtTime } from './api';
import { loadPkg, type Pkg } from './pkg';
import { Av } from './Av';

type Info = { id: string; ten: string; trangThai: string; lop?: string; hocSinh: { id: string; ten: string; daVao: boolean }[] };
type Bai = { phien: { id: string; ten: string; trangThai: 'mo' | 'dong' }; hs: { id: string; ten: string }; goi: { id: string; title: string; pages: string[] }; slots: Slot[]; answers: Answers; nopLuc: string | null };

export function Student() {
  const [step, setStep] = useState<'dang-tai' | 'ma' | 'ten' | 'lam'>('dang-tai');
  const [ma, setMa] = useState(() => new URLSearchParams(location.search).get('ma') || '');
  const [info, setInfo] = useState<Info | null>(null), [err, setErr] = useState('');
  const [bai, setBai] = useState<Bai | null>(null), [pkg, setPkg] = useState<Pkg | null>(null);
  const [saved, setSaved] = useState<'' | 'dang-luu' | 'da-luu' | 'loi'>(''), [ask, setAsk] = useState(false), [gone, setGone] = useState('');
  const cur = useRef<Answers>({}), timer = useRef(0), sending = useRef<Promise<unknown> | null>(null);

  const open = async () => {
    const b = await api<Bai>('/api/hs/bai');
    const p = await loadPkg(b.goi.id, b.goi.pages, b.goi.title, b.slots);
    cur.current = { ...b.answers }; setBai(b); setPkg(p); setStep('lam');
  };
  useEffect(() => { api<{ vao: boolean }>('/api/hs/toi').then(t => t.vao ? open() : Promise.reject()).catch(() => { setStep('ma'); if (ma) find(ma); }); }, []);   // eslint-disable-line react-hooks/exhaustive-deps
  // sự kiện: phiên kết thúc / bị mở khóa (tên vào ở máy khác) / phiên bị xóa
  useEffect(() => {
    if (!bai) return;
    return events('/api/hs/su-kien', {
      dong: () => { setBai(b => b ? { ...b, phien: { ...b.phien, trangThai: 'dong' }, nopLuc: b.nopLuc || new Date().toISOString() } : b); },
      'mo-khoa': (d: { hs: string }) => { if (d.hs === bai.hs.id) setGone('Tên em vừa được mở khóa để vào ở máy khác. Bài làm vẫn được giữ.'); },
      xoa: () => setGone('Cô / thầy đã xóa phiên này.'),
    });
  }, [bai?.phien.id]);   // eslint-disable-line react-hooks/exhaustive-deps

  const find = async (m: string) => {
    setErr('');
    try { const i = await api<Info>('/api/hs/phien?ma=' + encodeURIComponent(m.trim())); setInfo(i); setStep('ten'); }
    catch (e) { setErr((e as Error).message); }
  };
  const join = async (hs: string) => {
    setErr('');
    try { await api('/api/hs/vao', { json: { phien: info!.id, hs } }); await open(); }
    catch (e) { setErr((e as Error).message); }
  };
  const save = () => {
    clearTimeout(timer.current); setSaved('dang-luu');
    const p = api('/api/hs/bai', { method: 'PUT', json: { answers: cur.current } }).then(() => setSaved('da-luu'), e => { setSaved('loi'); if ((e as { status?: number }).status === 409) open().catch(() => {}); });
    sending.current = p; return p;
  };
  const onAnswers = (a: Answers) => { cur.current = a; setSaved('dang-luu'); clearTimeout(timer.current); timer.current = window.setTimeout(save, 800); };
  const submit = async () => {
    setAsk(false); clearTimeout(timer.current);
    try { const r = await api<{ nopLuc: string }>('/api/hs/nop', { json: { answers: cur.current } }); setBai(b => b ? { ...b, nopLuc: r.nopLuc } : b); }
    catch (e) { setErr((e as Error).message); }
  };
  const leave = async () => {
    if (!locked && !confirm('Thoát ra màn chọn tên? Bài em đã làm được lưu lại, em vào lại bằng tên này để làm tiếp.')) return;
    try { if (!locked) await save(); const r = await api<{ ma: string }>('/api/hs/thoat', { json: {} }); setBai(null); setPkg(null); setGone(''); setSaved(''); setMa(r.ma); await find(r.ma); }
    catch (e) { setErr((e as Error).message); }
  };
  useEffect(() => { const f = (e: BeforeUnloadEvent) => { if (saved === 'dang-luu') { save(); e.preventDefault(); } }; window.addEventListener('beforeunload', f); return () => window.removeEventListener('beforeunload', f); });

  const locked = !!bai && (!!bai.nopLuc || bai.phien.trangThai !== 'mo');
  const blank = bai ? bai.slots.filter(s => isBlank(cur.current[s.id])).length : 0;
  const banner = !bai ? null : bai.phien.trangThai !== 'mo' ? <>Phiên đã kết thúc. Bài của em đã được thu{bai.nopLuc ? ` lúc ${fmtTime(bai.nopLuc)}` : ''}.</>
    : bai.nopLuc ? <>Em đã nộp bài lúc {fmtTime(bai.nopLuc)}. Chờ cô / thầy chữa bài nhé.</> : null;
  const extra = !bai ? null : <>
    <span className="hsname" title={bai.phien.ten}><Av id={bai.hs.id} size={22} />{bai.hs.ten}</span>
    {locked ? null : <span className={'hssave ' + saved} id="hsSave">{saved === 'dang-luu' ? 'Đang lưu…' : saved === 'loi' ? 'Chưa lưu được' : saved === 'da-luu' ? '✓ Đã lưu' : ''}</span>}
    {locked ? null : <button className="vb hsnop" id="hsNop" onClick={() => setAsk(true)}>Nộp bài</button>}
    <button className="vb hsout" id="hsOut" title="Thoát để vào bằng tên khác (bài đã làm được giữ lại)" onClick={leave}>Thoát</button>
  </>;
  const data = useMemo(() => pkg && bai ? { title: pkg.title, pages: pkg.pages, slots: pkg.slots, key: {}, role: 'student' as const, init: bai.answers, onAnswers, store: 'hs:' + bai.phien.id } : null, [pkg, bai?.phien.id]);   // eslint-disable-line react-hooks/exhaustive-deps

  if (gone) return <div className="lopc hsbox"><h1>Lớp học thử</h1><p>{gone}</p><button className="lb pri" onClick={() => location.reload()}>Vào lại</button></div>;
  if (step === 'lam' && data && bai) return <>
    <Presenter data={{ ...data, lock: locked, extra, banner }} onClose={() => {}} />
    {ask ? <div className="hsask" role="dialog" aria-label="Nộp bài"><div className="hsaskb">
      <h2>Nộp bài?</h2>
      <p>{blank ? `Em còn ${blank} chỗ chưa làm. ` : 'Em đã làm hết. '}Nộp rồi thì không sửa được nữa.</p>
      <div className="row"><button className="lb" onClick={() => setAsk(false)}>Làm tiếp</button><button className="lb pri" id="hsNopOk" onClick={submit}>Nộp bài</button></div>
    </div></div> : null}
    {err ? <div className="hserr">{err}</div> : null}
  </>;
  return (
    <div className="lopc hsbox">
      <h1>Lớp học thử</h1>
      {step === 'dang-tai' ? <p>Đang tải…</p> : null}
      {step === 'ma' ? <form onSubmit={e => { e.preventDefault(); find(ma); }}>
        <label htmlFor="hsMa">Mã phiên (trên bảng)</label>
        <input id="hsMa" value={ma} onChange={e => setMa(e.target.value.toUpperCase())} autoComplete="off" autoCapitalize="characters" inputMode="text" maxLength={8} placeholder="VD: K7MPQ2" />
        <button className="lb pri" id="hsTiep" disabled={ma.trim().length < 4}>Tiếp</button>
      </form> : null}
      {step === 'ten' && info ? <>
        <p className="hint">{info.ten}{info.lop ? ` · Lớp ${info.lop}` : ''}{info.trangThai !== 'mo' ? ' · phiên đã kết thúc' : ''}</p>
        <h2>Em là ai?</h2>
        <div className="hsnames">{info.hocSinh.map(h => <button key={h.id} className={'lb' + (h.daVao ? ' used' : '')} onClick={() => join(h.id)} title={h.daVao ? 'Tên này đã vào ở một máy' : ''}><Av id={h.id} size={44} /><span className="hsn">{h.ten}</span></button>)}</div>
        <button className="lb ghost" onClick={() => { setStep('ma'); setInfo(null); }}>← Nhập mã khác</button>
      </> : null}
      {err ? <p className="err" id="hsErr">{err}</p> : null}
    </div>
  );
}
