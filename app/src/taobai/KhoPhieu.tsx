// Module Tạo bài v128: KHO PHIẾU (menu chung của app): mọi phiếu đã tạo bằng module Tạo bài, lưu trên máy chủ
// (lưu khi Duyệt phiếu / Xuất bản; từ v129 cả khi sinh xong). Mở = thay phiếu đang mở trong editor (hỏi trước).
// Mở thẳng file HTML (không máy chủ): không có kho, chỉ báo cách mở qua máy chủ.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { useUi, publish, type TbUi } from '../ui/store';
import { L } from '../ui/legacyApi';
import { askConfirm } from '../ui/Dialogs';
import { toast } from '../ui/Toast';
import { moNguon, goi } from './nguon';

const tb = (): TbUi => useUi.getState().tb;
const setTb = (p: Partial<TbUi>) => publish({ tb: Object.assign({}, tb(), p) });
export const openKho = () => setTb({ kho: true, tl: null });
type P = { gt: string; ls: string; id: string; at: string; n: number; title: string; names: { course?: string; unit?: string; lesson?: string; topic?: string }; duyet: number; cho: number };
const fmt = (iso: string) => { if (!iso) return '?'; const d = new Date(iso), p = (n: number) => String(n).padStart(2, '0'); return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`; };

export function KhoPhieu() { const on = useUi(s => s.tb.kho); return on ? <Screen /> : null; }

function Screen() {
  const [may, setMay] = useState<boolean | null>(null), [ds, setDs] = useState<P[]>([]), [err, setErr] = useState(''), [q, setQ] = useState('');
  const tai = () => goi<{ phieu: P[] }>('/api/taobai/kho-phieu').then(r => { setDs(r.phieu); setErr(''); }).catch(e => setErr(e.message));
  useEffect(() => { moNguon().then(n => { const m = n.mode === 'may-chu'; setMay(m); if (m) tai(); }); }, []);
  const loc = useMemo(() => { const k = q.trim().toLowerCase(); return k ? ds.filter(p => [p.title, p.names.course, p.names.unit, p.names.lesson, p.names.topic].join(' ').toLowerCase().includes(k)) : ds; }, [ds, q]);
  const mo = async (p: P) => {
    const w = await goi(`/api/taobai/phieu/${encodeURIComponent(p.gt)}/${encodeURIComponent(p.ls)}/${encodeURIComponent(p.id)}`).catch(e => { toast(e.message); return null; }); if (!w) return;
    if (!(await askConfirm('Mở phiếu từ kho?', 'Phiếu đang mở trong editor sẽ được thay.', 'Mở phiếu'))) return;
    if (L.loadSheet(w, `Đã mở “${p.title}”`)) setTb({ kho: false, rade: false });
  };
  const bo = async (p: P) => {
    if (!(await askConfirm('Bỏ phiếu khỏi kho?', `“${p.title}” (${fmt(p.at)}) được chuyển vào thư mục tao-bai/_cu trên máy chủ (không mất hẳn).`, 'Bỏ phiếu'))) return;
    try { await goi(`/api/taobai/phieu/${encodeURIComponent(p.gt)}/${encodeURIComponent(p.ls)}/${encodeURIComponent(p.id)}`, { method: 'DELETE' }); toast('Đã bỏ phiếu khỏi kho'); tai(); } catch (e) { toast((e as Error).message); }
  };
  return <div className="rade tl" id="khoScr" role="dialog" aria-label="Kho phiếu">
    <div className="radeh"><b>WS Editor</b><small>Kho phiếu</small><span className="sp" />
      <button className="btn sm" id="khoTl" onClick={() => setTb({ kho: false, tl: 'gt' })}>⚙ Thiết lập</button>
      <button className="btn sm" id="khoClose" aria-label="Quay lại soạn bài" onClick={() => setTb({ kho: false })}>← Quay lại soạn bài</button></div>
    {may === false ? <p className="tbwarn" id="khoOff">Kho phiếu nằm trên máy chủ: mở app qua máy chủ (<code>chay-lop.bat</code> → <code>/editor</code>). Mở thẳng file HTML thì lưu phiếu bằng <b>Xem JSON</b> / <b>Xuất MD</b> như thường.</p> : null}
    {err ? <p className="tbwarn">{err}</p> : null}
    {may ? <section className="tlsec" id="khoList">
      <div className="tlh"><div><h3>Phiếu đã tạo <span className="tbmut">({ds.length})</span></h3><p className="tbmut">Phiếu tạo bằng nút <b>Tạo bài</b>, lưu khi sinh xong, khi Duyệt phiếu và khi Xuất bản. Mở lại để sửa tiếp, duyệt tiếp.</p></div>
        <input className="tlfind" id="khoFind" placeholder="Tìm theo tên, giáo trình, lesson…" value={q} onChange={e => setQ(e.target.value)} /></div>
      {!ds.length ? <p className="tbmut" id="khoEmpty">Chưa có phiếu nào. Bấm <b>Tạo bài</b> (cạnh + Phiếu) để tạo phiếu đầu tiên.</p> :
        <table className="tltab"><thead><tr><th>Lưu lúc</th><th>Giáo trình › Unit › Lesson</th><th>Tên phiếu</th><th>Bài</th><th /></tr></thead>
          <tbody>{loc.map(p => <tr key={p.gt + p.ls + p.id} data-kho={p.id}><td className="tbat">{fmt(p.at)}</td>
            <td>{[p.names.course || p.gt, p.names.unit, p.names.lesson || p.ls].filter(Boolean).join(' › ')}{p.names.topic ? <> <span className="tag">{p.names.topic}</span></> : null}</td>
            <td>{p.title}</td><td>{p.n} bài · {p.duyet} đã duyệt{p.cho ? ` · ${p.cho} chờ sinh` : ''}</td>
            <td className="tbrow end"><button className="btn sm pri" data-act="mo" onClick={() => mo(p)}>Mở</button><button className="btn sm ghost" data-act="bo" onClick={() => bo(p)}>Bỏ</button></td></tr>)}</tbody></table>}
    </section> : null}
  </div>;
}
