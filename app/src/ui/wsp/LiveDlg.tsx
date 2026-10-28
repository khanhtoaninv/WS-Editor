// v123: nút "Live" — mở phiên lớp học thử ngay trong WS Editor (chỉ khi editor được máy chủ lớp thử phục vụ).
// Một bấm: gom phiếu → ký → gửi gói → mở phiên cho lớp đã chọn → hiện mã + QR + bảng theo dõi (nhúng trang giáo viên /gv).
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useUi, publish } from '../store';
import { api } from '../../lop/api';
import { collect, type Collected } from './collect';
import { serverKeys, type ServerKeys } from './keys';
import { sealCollected } from './seal';

type Lop = { id: string; ten: string; hocSinh: { id: string; ten: string }[] };
type Mo = { id: string; ma: string; ten: string; lopTen: string; goiTen: string; trangThai: string };
const MAU = ['An', 'Bình', 'Chi', 'Dũng', 'Giang', 'Hà', 'Khoa', 'Linh', 'Minh', 'Nam', 'Phúc', 'Quyên'];

export function LiveDlg() {
  const open = useUi(s => s.liveOpen), ref = useRef<HTMLDialogElement>(null);
  const [c, setC] = useState<Collected | null>(null), [srv, setSrv] = useState<ServerKeys | null>(null);
  const [gv, setGv] = useState<boolean | null>(null), [pw, setPw] = useState('');
  const [lops, setLops] = useState<Lop[]>([]), [lop, setLop] = useState(''), [ten, setTen] = useState('');
  const [nl, setNl] = useState<{ ten: string; ds: string } | null>(null);
  const [mo, setMo] = useState<Mo[]>([]), [run, setRun] = useState(''), [seen, setSeen] = useState(false);
  const [busy, setBusy] = useState(''), [err, setErr] = useState('');
  useLayoutEffect(() => { const el = ref.current!; if (open && !el.open) el.showModal(); else if (!open && el.open) el.close(); }, [open]);

  const loadSrv = async () => {
    const g = await api<{ gv: boolean }>('/api/gv/toi').catch(() => ({ gv: false })); setGv(g.gv);
    if (!g.gv) return;
    const l = await api<Lop[]>('/api/lop').catch(() => []); setLops(l); setLop(x => x && l.some(y => y.id === x) ? x : l[0]?.id || '');
    const p = await api<Mo[]>('/api/phien').catch(() => []); setMo(p.filter(x => x.trangThai === 'mo'));
  };
  useEffect(() => {
    if (!open) return;
    setC(null); setRun(''); setErr(''); setSeen(false); setNl(null); setBusy('Đang gom trang, ảnh, phông…');
    Promise.all([collect(), serverKeys(), loadSrv()]).then(([x, s]) => { setC(x); setSrv(s); setBusy(''); setTen(t => t || (x ? x.input.title : '')); }, e => { setBusy(''); setErr('Không gom được phiếu: ' + e.message); });
  }, [open]);   // eslint-disable-line react-hooks/exhaustive-deps

  const login = async () => { setErr(''); try { await api('/api/gv/dang-nhap', { json: { matKhau: pw } }); setPw(''); await loadSrv(); } catch (e) { setErr((e as Error).message); } };
  const saveLop = async () => {
    setErr(''); try {
      const l = await api<Lop>('/api/lop', { json: { ten: nl!.ten, hocSinh: nl!.ds.split('\n').map(x => x.trim()).filter(Boolean) } });
      setNl(null); await loadSrv(); setLop(l.id);
    } catch (e) { setErr((e as Error).message); }
  };
  const go = async () => {
    if (!c || !srv) return;
    setErr('');
    try {
      setBusy('Đang kiểm, ký và gửi phiếu…');
      const sl = await sealCollected(c, srv);
      if ('errors' in sl) { setErr('Phiếu chưa đạt kiểm tra: ' + sl.errors.slice(0, 5).join('; ')); setBusy(''); return; }
      const g = await api<{ id: string }>('/api/goi', { body: sl.bytes as Uint8Array<ArrayBuffer> });
      setBusy('Đang mở phiên…');
      const p = await api<{ id: string }>('/api/phien', { json: { lop, goi: g.id, ten } });
      setRun(p.id);
    } catch (e) { setErr((e as Error).message); }
    setBusy('');
  };

  const st = c && c.input.slots, auto = st ? st.filter(s => s.grading === 'auto').length : 0;
  const can = !!c && !!srv && gv === true && !!lop && !c.blockers.length && (!c.warnings.length || seen) && !busy;
  const close = () => publish({ liveOpen: false });
  return (
    <dialog id="liveDlg" ref={ref} aria-labelledby="liveTitle" className={run ? 'liverun' : ''} onClose={() => { if (useUi.getState().liveOpen) close(); }}>
      {run ? <>
        <div className="liverow"><b id="liveTitle">Phiên đang chạy</b><span className="sp" style={{ flex: 1 }} />
          <button className="btn" id="liveBack" onClick={() => { setRun(''); loadSrv(); }}>← Phiên khác</button><button className="btn" id="liveClose" onClick={close}>Thu nhỏ</button></div>
        <iframe id="liveFrame" title="Phiên học" src={`/gv#phien=${run}&nhung=1`} />
      </> : <>
        <h2 id="liveTitle" style={{ margin: '0 0 6px', fontSize: 15 }}>Live · giao phiếu cho lớp</h2>
        {!srv && !busy ? <div className="wspbad" id="liveNo">Nút này chỉ chạy khi mở WS Editor từ máy chủ lớp thử (chạy chay-lop.bat rồi vào địa chỉ /editor).</div> : null}
        {c ? <div className="wspsum" id="liveSum"><b>{c.input.title}</b> · {c.input.pages.length} trang · {st!.length} chỗ trả lời ({auto} máy chấm, {st!.length - auto} chấm tay)</div> : null}
        {c && c.blockers.length ? <div className="wspbad" id="liveBlock"><b>Chưa giao được:</b><ul>{c.blockers.map(x => <li key={x}>{x}</li>)}</ul></div> : null}
        {c && c.warnings.length ? <div className="wspwarn" id="liveWarn"><b>Cảnh báo ({c.warnings.length}):</b><ul>{c.warnings.slice(0, 8).map(x => <li key={x}>{x}</li>)}{c.warnings.length > 8 ? <li>… và {c.warnings.length - 8} cảnh báo khác</li> : null}</ul>
          <label><input type="checkbox" id="liveSeen" checked={seen} onChange={e => setSeen(e.target.checked)} /> Tôi đã xem các cảnh báo, vẫn giao</label></div> : null}
        {srv && gv === false ? <form className="liveform" onSubmit={e => { e.preventDefault(); login(); }}>
          <label htmlFor="livePass">Mật khẩu giáo viên (in ở cửa sổ máy chủ)</label>
          <span className="liverow"><input id="livePass" type="password" value={pw} onChange={e => setPw(e.target.value)} autoFocus /><button className="btn pri" id="liveLogin">Đăng nhập</button></span></form> : null}
        {srv && gv ? <>
          {mo.length ? <div className="liveopen" id="liveOpen"><span className="hint">Phiên đang mở:</span> {mo.map(p => <button key={p.id} className="btn" data-phien={p.id} onClick={() => setRun(p.id)}>{p.ten} · mã {p.ma}</button>)}</div> : null}
          <div className="liverow wrap">
            <label>Lớp <select id="liveLop" value={lop} onChange={e => setLop(e.target.value)}>{!lops.length ? <option value="">Chưa có lớp</option> : null}{lops.map(l => <option key={l.id} value={l.id}>{l.ten} ({l.hocSinh.length})</option>)}</select></label>
            <button className="btn" id="liveNewLop" onClick={() => setNl(nl ? null : { ten: '', ds: '' })}>+ Lớp mới</button>
            <label style={{ flex: 1 }}>Tên phiên <input id="liveTen" value={ten} onChange={e => setTen(e.target.value)} style={{ width: '100%' }} /></label>
          </div>
          {nl ? <div className="liveform">
            <label>Tên lớp <input id="liveNlTen" value={nl.ten} onChange={e => setNl({ ...nl, ten: e.target.value })} placeholder="VD: 4A" /></label>
            <label>Học sinh (mỗi dòng một tên; nên dùng tên giả hoặc viết tắt khi thử) <textarea id="liveNlDs" rows={6} value={nl.ds} onChange={e => setNl({ ...nl, ds: e.target.value })} /></label>
            <span className="liverow"><button className="btn" id="liveNlMau" onClick={() => setNl({ ten: nl.ten || 'Lớp mẫu', ds: MAU.join('\n') })}>Dùng lớp mẫu 12 em</button><span style={{ flex: 1 }} /><button className="btn pri" id="liveNlLuu" onClick={saveLop}>Lưu lớp</button></span></div> : null}
        </> : null}
        {busy ? <p className="hint" id="liveBusy">{busy}</p> : null}
        {err ? <div className="wspbad" id="liveErr">{err}</div> : null}
        <div className="liverow" style={{ justifyContent: 'flex-end' }}>
          <button className="btn" id="liveCancel" onClick={close}>Đóng</button>
          <button className="btn pri" id="liveGo" disabled={!can} onClick={go}>Bắt đầu phiên</button></div>
      </>}
    </dialog>
  );
}
