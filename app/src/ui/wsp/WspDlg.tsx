// GĐ2: hộp "Gói phiếu .wsp" — xuất gói (kiểm mục 9 trước khi ký) và mở lại gói để sửa (khóa "ed" trên máy này).
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useUi, publish } from '../store';
import { actions } from '../actions';
import { askConfirm } from '../Dialogs';
import { buildFiles, checkFiles, sealWsp, inspectWsp, type Signer } from '../../../../shared/src/index.ts';
import { collect, type Collected } from './collect';
import { devSigner, edBox, serverKeys, serverSigner, trPub, setTrPub, trusted, nextVersion, saveVersion, type ServerKeys } from './keys';

const VER = 'WS Editor v122';
const kb = (n: number) => n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`;
const fname = (t: string) => (t || 'phieu').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'phieu';

export function WspDlg() {
  const open = useUi(s => s.wspOpen), ref = useRef<HTMLDialogElement>(null);
  const [c, setC] = useState<Collected | null>(null), [srv, setSrv] = useState<ServerKeys | null>(null);
  const [busy, setBusy] = useState(''), [msg, setMsg] = useState<{ ok: boolean; text: string; list?: string[] } | null>(null);
  const [seen, setSeen] = useState(false), [tr, setTr] = useState(''), [trErr, setTrErr] = useState('');
  useLayoutEffect(() => { const el = ref.current!; if (open && !el.open) el.showModal(); else if (!open && el.open) el.close(); }, [open]);
  useEffect(() => {
    if (!open) return;
    setC(null); setMsg(null); setSeen(false); setTrErr(''); const p = trPub(); setTr(p ? JSON.stringify(p) : '');
    setBusy('Đang gom trang, ảnh, phông…');
    Promise.all([collect(), serverKeys()]).then(([x, s]) => { setC(x); setSrv(s); setBusy(''); }, e => { setBusy(''); setMsg({ ok: false, text: 'Không gom được phiếu: ' + e.message }); });
  }, [open]);

  const exportIt = async (send = false) => {
    if (!c) return;
    const e0 = setTrPub(srv ? '' : tr); if (e0) { setTrErr(e0); return; }
    setBusy('Đang kiểm, ký và mã hóa…'); setMsg(null);
    try {
      const b0 = await buildFiles(c.input), h = b0.manifest.contentHash + b0.manifest.keyHash;
      const v = nextVersion(c.input.sheetId, h), { files, manifest } = await buildFiles({ ...c.input, version: v });
      const chk = await checkFiles(files);
      if (chk.errors.length) { setMsg({ ok: false, text: 'Gói chưa đạt kiểm tra, chưa xuất:', list: chk.errors }); setBusy(''); return; }
      const rec: Record<string, JsonWebKey> = { ed: (await edBox()).publicKey };
      const t = srv ? srv.trPublic : trPub(); if (t) rec.tr = t;
      const signer: Signer = srv ? serverSigner(srv.keyId) : await devSigner();
      const bytes = await sealWsp(files, manifest, { signer, recipients: rec, producer: VER });
      saveVersion(c.input.sheetId, v, h);
      const name = `${fname(c.input.title)}-v${v}.wsp`;
      if (send) {   // v119: máy chủ lớp thử nhận gói (kiểm lại mục 9 ở phía nhận)
        const r = await fetch('/api/goi', { method: 'POST', headers: { 'content-type': 'application/octet-stream' }, body: bytes as Uint8Array<ArrayBuffer> }), j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(r.status === 401 ? 'chưa đăng nhập trang giáo viên của lớp thử (mở /gv ở thẻ khác, đăng nhập rồi gửi lại)' : j.loi || 'máy chủ từ chối gói');
        (window as any).__wspLast = { bytes, name, manifest };
        setMsg({ ok: true, text: `Đã gửi “${c.input.title}” (phiên bản ${v}) lên lớp thử. Mở trang giáo viên → Phiên học để giao bài.` }); setBusy(''); return;
      }
      const url = URL.createObjectURL(new Blob([bytes as Uint8Array<ArrayBuffer>], { type: 'application/octet-stream' }));
      const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
      (window as any).__wspLast = { bytes, name, manifest };
      setMsg({ ok: true, text: `Đã xuất ${name} (${kb(bytes.length)}) · phiên bản ${v} · ký bằng ${signer.keyId}${rec.tr ? '' : ' · chưa có khóa bên nhập: gói chỉ mở lại được trong WS Editor trên máy này'}` });
    } catch (e) { setMsg({ ok: false, text: 'Không xuất được: ' + (e as Error).message }); }
    setBusy('');
  };

  const openIt = async (f: File) => {
    setBusy('Đang kiểm gói…'); setMsg(null);
    try {
      const r = await inspectWsp(new Uint8Array(await f.arrayBuffer()), { trust: await trusted(), who: 'ed', privateKey: (await edBox()).privateKey });
      setBusy('');
      if (!r.ok || !r.files) { setMsg({ ok: false, text: `Không mở được ${f.name}:`, list: r.errors }); return; }
      const src = r.files['source.json']; if (!src) { setMsg({ ok: false, text: 'Gói không kèm phiếu gốc (source.json): không mở lại để sửa được' }); return; }
      if (!await askConfirm('Mở phiếu trong gói?', `“${r.envelope!.title}” (phiên bản ${r.envelope!.version}) sẽ thay phiếu đang mở. Phiếu đang mở chưa lưu sẽ mất.`, 'Mở phiếu')) return;
      if (actions.openSheet(JSON.parse(new TextDecoder().decode(src)), `Đã mở gói ${f.name}`)) publish({ wspOpen: false });
    } catch (e) { setBusy(''); setMsg({ ok: false, text: 'Không mở được: ' + (e as Error).message }); }
  };

  const st = c && c.input.slots, auto = st ? st.filter(s => s.grading === 'auto').length : 0;
  const can = !!c && !c.blockers.length && (!c.warnings.length || seen) && !busy;
  return (
    <dialog id="wspDlg" ref={ref} aria-labelledby="wspTitle" onClose={() => { if (useUi.getState().wspOpen) publish({ wspOpen: false }); }}>
      <h2 id="wspTitle" style={{ margin: '0 0 6px', fontSize: 15 }}>Gói phiếu tương tác (.wsp)</h2>
      <p className="hint" style={{ margin: '0 0 8px' }}>Gói chứa trang đã dàn, chỗ trả lời, đáp án (mã hóa) và phiếu gốc để mở lại. Học sinh chỉ thấy phần đề; đáp án nằm ở máy chủ.</p>
      {c ? <div className="wspsum" id="wspSum">
        <b>{c.input.title}</b> · {c.input.pages.length} trang · {st!.length} chỗ trả lời ({auto} máy chấm, {st!.length - auto} chấm tay){c.input.staticOnly ? ` · ${c.input.staticOnly} câu chỉ xem` : ''} · {Object.keys(c.input.media || {}).length} ảnh · {Object.keys(c.input.fonts || {}).length} file phông
      </div> : null}
      {c && c.blockers.length ? <div className="wspbad" id="wspBlock"><b>Chưa xuất được:</b><ul>{c.blockers.map(x => <li key={x}>{x}</li>)}</ul></div> : null}
      {c && c.warnings.length ? <div className="wspwarn" id="wspWarn"><b>Cảnh báo ({c.warnings.length}):</b><ul>{c.warnings.slice(0, 12).map(x => <li key={x}>{x}</li>)}{c.warnings.length > 12 ? <li>… và {c.warnings.length - 12} cảnh báo khác</li> : null}</ul>
        <label><input type="checkbox" id="wspSeen" checked={seen} onChange={e => setSeen(e.target.checked)} /> Tôi đã xem các cảnh báo, vẫn xuất</label></div> : null}
      <div className="wsprow">
        <span className="hint">Ký và người nhận:</span>
        {srv ? <span id="wspSigner">máy chủ lớp thử (khóa {srv.keyId}) · gói mở được trên máy chủ này và trong WS Editor</span>
          : <span id="wspSigner">khóa thử trên máy này (chưa có dịch vụ ký của công ty)</span>}
      </div>
      {srv ? null : <details className="wsptr"><summary>Khóa công khai bên nhập (TeacherResource), nếu có</summary>
        <textarea id="wspTr" value={tr} onChange={e => { setTr(e.target.value); setTrErr(''); }} placeholder='{"kty":"RSA","n":"…","e":"AQAB"}' style={{ height: 70 }} />
        {trErr ? <div className="wspbad">{trErr}</div> : null}</details>}
      {busy ? <p className="hint" id="wspBusy">{busy}</p> : null}
      {msg ? <div className={msg.ok ? 'wspok' : 'wspbad'} id="wspMsg">{msg.text}{msg.list ? <ul>{msg.list.slice(0, 15).map(x => <li key={x}>{x}</li>)}</ul> : null}</div> : null}
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <label className="btn" htmlFor="wspFile" title="Mở lại gói đã xuất từ WS Editor trên máy này để sửa">Mở gói .wsp…<input type="file" id="wspFile" accept=".wsp" hidden onChange={e => { const f = e.target.files && e.target.files[0]; e.target.value = ''; if (f) openIt(f); }} /></label>
        <span style={{ display: 'flex', gap: 8 }}><button className="btn" id="wspClose" onClick={() => publish({ wspOpen: false })}>Đóng</button>
          {srv ? <button className="btn pri" id="wspSend" disabled={!can} onClick={() => exportIt(true)} title="Gửi gói lên máy chủ lớp thử đang chạy app này">Gửi lên lớp thử</button> : null}
          <button className={'btn' + (srv ? '' : ' pri')} id="wspGo" disabled={!can} onClick={() => exportIt()}>Xuất gói .wsp</button></span>
      </div>
    </dialog>
  );
}
