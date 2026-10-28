// Trang giáo viên (/gv): đăng nhập, Phiên học (mở phiên, theo dõi trực tiếp, kết thúc), Lớp (danh sách học sinh), Gói phiếu.
// Chấm chữa (Cham.tsx) và Báo cáo (BaoCao.tsx) mở từ một phiên đã kết thúc.
import { useEffect, useState, type ReactNode } from 'react';
import { Presenter } from '../viewer/Presenter';
import { api, events, fmtDate, fmtTime } from './api';
import { loadPkg, loadKey } from './pkg';
import { Cham } from './Cham';
import { BaoCao } from './BaoCao';
import type { ShowData } from '../viewer/data';

export type HS = { id: string; ten: string; trangThai: 'chua-vao' | 'dang-lam' | 'da-nop'; daLam: number; tong: number; nopLuc?: string; tuNop: boolean; luuLuc?: string; xongCham: boolean };
export type PhienV = { id: string; ma: string; ten: string; lop: string; goi: string; trangThai: 'mo' | 'dong'; taoLuc: string; dongLuc?: string; lopTen: string; goiTen: string; hocSinh: HS[] };
type Lop = { id: string; ten: string; hocSinh: { id: string; ten: string }[] };
type Goi = { id: string; title: string; version: number; taoLuc: string; stats: Record<string, number>; warnings: string[] };

const MAU = ['An', 'Bình', 'Chi', 'Dũng', 'Giang', 'Hà', 'Khoa', 'Linh', 'Minh', 'Nam', 'Phúc', 'Quyên'];   // lớp mẫu: tên giả
const ST: Record<HS['trangThai'], string> = { 'chua-vao': 'Chưa vào', 'dang-lam': 'Đang làm', 'da-nop': 'Đã nộp' };

function qrSvg(u: string) {
  try { const g = (window as any).qrcode(0, 'M'); g.addData(u); g.make(); return g.createSvgTag({ cellSize: 1, margin: 2, scalable: true }); } catch { return ''; }
}

export function Teacher() {
  const [me, setMe] = useState<null | { gv: boolean; ai: boolean }>(null);
  useEffect(() => { api('/api/gv/toi').then(setMe, () => setMe({ gv: false, ai: false })); }, []);
  if (!me) return <div className="lopc"><p>Đang tải…</p></div>;
  if (!me.gv) return <Login onOk={() => api('/api/gv/toi').then(setMe)} />;
  return <Shell ai={me.ai} onOut={() => api('/api/gv/dang-xuat', { json: {} }).then(() => setMe({ gv: false, ai: me.ai }))} />;
}

function Login({ onOk }: { onOk: () => void }) {
  const [p, setP] = useState(''), [err, setErr] = useState('');
  return <div className="lopc hsbox"><h1>Lớp học thử · Giáo viên</h1>
    <form onSubmit={e => { e.preventDefault(); setErr(''); api('/api/gv/dang-nhap', { json: { matKhau: p } }).then(onOk, x => setErr(x.message)); }}>
      <label htmlFor="gvPass">Mật khẩu (in ở cửa sổ chạy máy chủ)</label>
      <input id="gvPass" type="password" value={p} onChange={e => setP(e.target.value)} autoFocus />
      <button className="lb pri" id="gvLogin">Đăng nhập</button>
    </form>{err ? <p className="err">{err}</p> : null}
    <p className="hint">Khu thử nghiệm trước khi có TeacherResource. Dữ liệu nằm trên máy này (thư mục server/du-lieu).</p></div>;
}

type View = { tab: 'phien' | 'lop' | 'goi' } | { phien: string; sub?: 'cham' | 'bao-cao'; hs?: string };
function Shell({ ai, onOut }: { ai: boolean; onOut: () => void }) {
  // v123: WS Editor nhúng trang này trong hộp Live bằng /gv#phien=<id>&nhung=1 (mở thẳng một phiên, bỏ thanh trên)
  const hp = new URLSearchParams(location.hash.slice(1)), nhung = hp.has('nhung');
  const [v, setV] = useState<View>(() => hp.get('phien') ? { phien: hp.get('phien')! } : { tab: 'phien' });
  const [show, setShow] = useState<ShowData | null>(null);
  const tab = 'tab' in v ? v.tab : 'phien';
  return <div className={'lopc gv' + (nhung ? ' nhung' : '')}>
    {nhung ? null : <header className="lophd">
      <b>Lớp học thử</b><span className="badge">thử nghiệm</span>
      <nav>{(['phien', 'lop', 'goi'] as const).map(t => <button key={t} className={'lt' + (tab === t ? ' on' : '')} id={'tab-' + t} onClick={() => setV({ tab: t })}>{{ phien: 'Phiên học', lop: 'Lớp', goi: 'Gói phiếu' }[t]}</button>)}</nav>
      <span className="sp" /><a className="lt" href="/editor" target="_blank" rel="noopener">WS Editor ↗</a><button className="lt" onClick={onOut}>Đăng xuất</button>
    </header>}
    <main>
      {'phien' in v ? (v.sub === 'cham' ? <Cham phien={v.phien} hs={v.hs} onBack={() => setV({ phien: v.phien })} onReport={() => setV({ phien: v.phien, sub: 'bao-cao' })} />
        : v.sub === 'bao-cao' ? <BaoCao phien={v.phien} ai={ai} onBack={() => setV({ phien: v.phien })} onCham={hs => setV({ phien: v.phien, sub: 'cham', hs })} />
        : <PhienView id={v.phien} onBack={() => setV({ tab: 'phien' })} onCham={() => setV({ phien: v.phien, sub: 'cham' })} onReport={() => setV({ phien: v.phien, sub: 'bao-cao' })} />)
        : tab === 'phien' ? <PhienTab open={id => setV({ phien: id })} />
        : tab === 'lop' ? <LopTab /> : <GoiTab preview={setShow} />}
    </main>
    {show ? <Presenter data={show} onClose={() => setShow(null)} /> : null}
  </div>;
}

function useLoad<T>(f: () => Promise<T>, deps: unknown[] = []): [T | null, () => void, string] {
  const [d, setD] = useState<T | null>(null), [err, setErr] = useState(''), [n, setN] = useState(0);
  useEffect(() => { f().then(x => { setD(x); setErr(''); }, e => setErr(e.message)); }, [n, ...deps]);   // eslint-disable-line react-hooks/exhaustive-deps
  return [d, () => setN(x => x + 1), err];
}
const Err = ({ m }: { m: string }) => m ? <p className="err">{m}</p> : null;
export const Card = ({ title, children, right }: { title: ReactNode; children: ReactNode; right?: ReactNode }) => <section className="lcard"><div className="lch"><h2>{title}</h2>{right}</div>{children}</section>;

// ---------- Lớp ----------
function LopTab() {
  const [list, reload, err] = useLoad(() => api<Lop[]>('/api/lop'));
  const [ed, setEd] = useState<{ id?: string; ten: string; ds: string } | null>(null), [e2, setE2] = useState('');
  const save = async () => {
    setE2('');
    const b = { ten: ed!.ten, hocSinh: ed!.ds.split('\n').map(x => x.trim()).filter(Boolean) };
    try { await api(ed!.id ? `/api/lop/${ed!.id}` : '/api/lop', { method: ed!.id ? 'PUT' : 'POST', json: b }); setEd(null); reload(); } catch (e) { setE2((e as Error).message); }
  };
  return <>
    <Card title="Lớp" right={<button className="lb pri" id="lopNew" onClick={() => setEd({ ten: '', ds: '' })}>+ Lớp mới</button>}>
      <Err m={err} />
      {list && !list.length ? <p className="hint">Chưa có lớp. Bấm "+ Lớp mới", dán danh sách tên (mỗi dòng một em) hoặc dùng lớp mẫu 12 em (tên giả).</p> : null}
      <table className="ltbl"><tbody>{(list || []).map(l => <tr key={l.id}><td><b>{l.ten}</b></td><td>{l.hocSinh.length} học sinh</td><td className="hint">{l.hocSinh.slice(0, 8).map(h => h.ten).join(', ')}{l.hocSinh.length > 8 ? '…' : ''}</td>
        <td className="r"><button className="lb" onClick={() => setEd({ id: l.id, ten: l.ten, ds: l.hocSinh.map(h => h.ten).join('\n') })}>Sửa</button>
          <button className="lb ghost" onClick={() => { if (confirm(`Xóa lớp ${l.ten}?`)) api(`/api/lop/${l.id}`, { method: 'DELETE' }).then(reload, e => alert(e.message)); }}>Xóa</button></td></tr>)}</tbody></table>
    </Card>
    {ed ? <Card title={ed.id ? 'Sửa lớp' : 'Lớp mới'}>
      <label>Tên lớp <input id="lopTen" value={ed.ten} onChange={e => setEd({ ...ed, ten: e.target.value })} placeholder="VD: 4A" /></label>
      <label>Học sinh (mỗi dòng một tên; nên dùng tên giả hoặc viết tắt khi thử) <textarea id="lopDs" rows={10} value={ed.ds} onChange={e => setEd({ ...ed, ds: e.target.value })} /></label>
      <div className="row"><button className="lb ghost" id="lopMau" onClick={() => setEd({ ...ed, ten: ed.ten || 'Lớp mẫu', ds: MAU.join('\n') })}>Dùng lớp mẫu 12 em</button><span className="sp" />
        <button className="lb" onClick={() => setEd(null)}>Hủy</button><button className="lb pri" id="lopLuu" onClick={save}>Lưu</button></div>
      <Err m={e2} /></Card> : null}
  </>;
}

// ---------- Gói phiếu ----------
function GoiTab({ preview }: { preview: (d: ShowData) => void }) {
  const [list, reload, err] = useLoad(() => api<Goi[]>('/api/goi'));
  const [msg, setMsg] = useState('');
  const up = async (f: File) => { setMsg('Đang kiểm gói…'); try { const g = await api<Goi>('/api/goi', { body: await f.arrayBuffer() }); setMsg(`Đã nhận gói “${g.title}” (phiên bản ${g.version})`); reload(); } catch (e) { setMsg((e as Error).message); } };
  const view = async (g: Goi) => {
    const m = await (await fetch(`/api/goi/${encodeURIComponent(g.id)}/f/manifest.json`)).json(), slots = await (await fetch(`/api/goi/${encodeURIComponent(g.id)}/f/slots.json`)).json();
    const p = await loadPkg(g.id, m.pages.map((x: { file: string }) => x.file), g.title, slots);
    preview({ title: p.title, pages: p.pages, slots, key: await loadKey(g.id) });
  };
  return <Card title="Gói phiếu" right={<label className="lb pri" htmlFor="goiFile">Tải gói .wsp lên<input type="file" id="goiFile" accept=".wsp" hidden onChange={e => { const f = e.target.files?.[0]; e.target.value = ''; if (f) up(f); }} /></label>}>
    <p className="hint">Mở <a href="/editor" target="_blank" rel="noopener">WS Editor từ máy chủ này</a>, bấm "Gói .wsp" → <b>Gửi lên lớp thử</b>. Hoặc tải file .wsp đã xuất (phải ký bằng khóa của máy chủ này).</p>
    {msg ? <p className="lmsg" id="goiMsg">{msg}</p> : null}<Err m={err} />
    <table className="ltbl"><tbody>{(list || []).map(g => <tr key={g.id}><td><b>{g.title}</b> <span className="hint">v{g.version}</span></td>
      <td>{g.stats.slots} chỗ trả lời ({g.stats.autoGraded} máy chấm, {g.stats.manualGraded} chấm tay)</td><td className="hint">{fmtDate(g.taoLuc)}</td>
      <td className="r"><button className="lb" onClick={() => view(g).catch(e => alert(e.message))}>Xem</button>
        <button className="lb ghost" onClick={() => { if (confirm(`Xóa gói ${g.title}?`)) api(`/api/goi/${encodeURIComponent(g.id)}`, { method: 'DELETE' }).then(reload, e => alert(e.message)); }}>Xóa</button></td></tr>)}</tbody></table>
  </Card>;
}

// ---------- Phiên ----------
function PhienTab({ open }: { open: (id: string) => void }) {
  const [list, reload, err] = useLoad(() => api<PhienV[]>('/api/phien'));
  const [lops] = useLoad(() => api<Lop[]>('/api/lop')), [gois] = useLoad(() => api<Goi[]>('/api/goi'));
  const [f, setF] = useState({ lop: '', goi: '', ten: '' }), [e2, setE2] = useState('');
  const mk = async () => { setE2(''); try { const p = await api<PhienV>('/api/phien', { json: f }); open(p.id); } catch (e) { setE2((e as Error).message); } };
  return <>
    <Card title="Mở phiên mới">
      {lops && !lops.length ? <p className="hint">Chưa có lớp: tạo ở thẻ Lớp.</p> : null}
      {gois && !gois.length ? <p className="hint">Chưa có gói phiếu: gửi từ WS Editor hoặc tải lên ở thẻ Gói phiếu.</p> : null}
      <div className="row wrap">
        <label>Lớp <select id="phLop" value={f.lop} onChange={e => setF({ ...f, lop: e.target.value })}><option value="">Chọn lớp…</option>{(lops || []).map(l => <option key={l.id} value={l.id}>{l.ten} ({l.hocSinh.length})</option>)}</select></label>
        <label>Phiếu <select id="phGoi" value={f.goi} onChange={e => setF({ ...f, goi: e.target.value })}><option value="">Chọn gói phiếu…</option>{(gois || []).map(g => <option key={g.id} value={g.id}>{g.title} · v{g.version}</option>)}</select></label>
        <label>Tên phiên (tùy chọn) <input id="phTen" value={f.ten} onChange={e => setF({ ...f, ten: e.target.value })} placeholder="VD: Tiết 3 · Unit 5" /></label>
        <button className="lb pri" id="phMo" disabled={!f.lop || !f.goi} onClick={mk}>Mở phiên</button>
      </div><Err m={e2} />
    </Card>
    <Card title="Các phiên" right={<button className="lb ghost" onClick={reload}>↻</button>}><Err m={err} />
      <table className="ltbl"><tbody>{(list || []).map(p => { const n = p.hocSinh.filter(h => h.trangThai === 'da-nop').length;
        return <tr key={p.id} className="click" onClick={() => open(p.id)}><td><b>{p.ten}</b><div className="hint">{p.lopTen} · {p.goiTen}</div></td><td><span className={'chip ' + p.trangThai}>{p.trangThai === 'mo' ? `Đang mở · mã ${p.ma}` : 'Đã kết thúc'}</span></td>
          <td>{n}/{p.hocSinh.length} đã nộp</td><td className="hint">{fmtDate(p.taoLuc)}</td></tr>; })}</tbody></table>
    </Card>
  </>;
}

function PhienView({ id, onBack, onCham, onReport }: { id: string; onBack: () => void; onCham: () => void; onReport: () => void }) {
  const [p, setP] = useState<PhienV | null>(null), [err, setErr] = useState(''), [addr, setAddr] = useState<{ lan: string[]; port: number } | null>(null);
  const load = () => api<PhienV>(`/api/phien/${id}`).then(setP, e => setErr(e.message));
  useEffect(() => { load(); api('/api/gv/dia-chi').then(setAddr, () => {}); }, [id]);   // eslint-disable-line react-hooks/exhaustive-deps
  // trực tiếp: mỗi em vào / gõ / nộp là cập nhật dòng của em
  useEffect(() => events(`/api/phien/${id}/su-kien`, {
    hs: (d: HS & { hs: string }) => setP(o => o ? { ...o, hocSinh: o.hocSinh.map(h => h.id === d.hs ? { ...h, ...d, id: h.id } : h) } : o),
    phien: (d: PhienV) => setP(d),
  }), [id]);
  if (!p) return <><button className="lb ghost" onClick={onBack}>← Các phiên</button><Err m={err} /></>;
  const host = addr && addr.lan[0] ? `${addr.lan[0]}:${addr.port}` : location.host, url = `http://${host}/hs?ma=${p.ma}`;
  const n = { vao: p.hocSinh.filter(h => h.trangThai !== 'chua-vao').length, nop: p.hocSinh.filter(h => h.trangThai === 'da-nop').length };
  const end = async () => { if (!confirm(`Kết thúc phiên? ${p.hocSinh.length - n.nop} em chưa nộp sẽ bị thu bài đang làm.`)) return; setP(await api(`/api/phien/${id}/ket-thuc`, { json: {} })); };
  return <>
    <div className="row"><button className="lb ghost" onClick={onBack}>← Các phiên</button><span className="sp" />
      {p.trangThai === 'mo' ? <button className="lb dng" id="phKetThuc" onClick={end}>Kết thúc phiên</button>
        : <><button className="lb pri" id="phCham" onClick={onCham}>Chấm chữa</button><button className="lb pri" id="phBaoCao" onClick={onReport}>Báo cáo</button></>}</div>
    <Card title={<>{p.ten} <span className={'chip ' + p.trangThai}>{p.trangThai === 'mo' ? 'Đang mở' : `Đã kết thúc ${fmtTime(p.dongLuc)}`}</span></>}>
      <p className="hint">{p.lopTen} · {p.goiTen} · mở lúc {fmtTime(p.taoLuc)}</p>
      {p.trangThai === 'mo' ? <div className="join">
        <div className="qr" dangerouslySetInnerHTML={{ __html: qrSvg(url) }} />
        <div><div className="hint">Học sinh vào (cùng wifi)</div><div className="url" id="phUrl">http://{host}/hs</div>
          <div className="hint">rồi nhập mã</div><div className="code" id="phMa">{p.ma}</div>
          {addr && !addr.lan.length ? <p className="err">Máy chưa nối mạng nội bộ: học sinh chỉ vào được trên chính máy này.</p> : null}</div>
      </div> : null}
      <div className="stats"><span><b>{n.vao}</b>/{p.hocSinh.length} đã vào</span><span><b>{n.nop}</b>/{p.hocSinh.length} đã nộp</span></div>
      <table className="ltbl" id="phBang"><thead><tr><th>Học sinh</th><th>Trạng thái</th><th>Đã làm</th><th></th></tr></thead>
        <tbody>{p.hocSinh.map(h => <tr key={h.id} data-hs={h.id}><td>{h.ten}</td>
          <td><span className={'chip ' + h.trangThai}>{ST[h.trangThai]}{h.trangThai === 'da-nop' ? ` ${fmtTime(h.nopLuc)}${h.tuNop ? ' (thu khi kết thúc)' : ''}` : ''}</span>{h.xongCham ? <span className="chip ok">Đã chấm</span> : null}</td>
          <td><span className="bar"><i style={{ width: `${h.tong ? h.daLam / h.tong * 100 : 0}%` }} /></span> {h.daLam}/{h.tong}</td>
          <td className="r">{p.trangThai === 'mo' && h.trangThai !== 'chua-vao' ? <button className="lb ghost" title="Em đổi máy hoặc lỡ đóng trình duyệt ở máy khác: cho vào lại bằng tên này (bài làm giữ nguyên)" onClick={() => api(`/api/phien/${id}/mo-khoa/${h.id}`, { json: {} })}>Mở khóa</button> : null}</td></tr>)}</tbody></table>
      {p.trangThai === 'mo' ? null : <button className="lb ghost" onClick={() => { if (confirm('Xóa phiên này cùng mọi bài làm?')) api(`/api/phien/${id}`, { method: 'DELETE' }).then(onBack); }}>Xóa phiên</button>}
    </Card>
  </>;
}
