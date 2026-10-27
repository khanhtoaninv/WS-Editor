// Popup "+ Task" / "+ Phiếu" (v106: #libDlg) và hộp "Dán nhiều dòng" (#pasteDlg).
// React giữ khung hộp và các cờ (thẻ đang chọn, nút nào hiện / tắt); phần nội dung sinh ra theo dữ liệu
// (thư viện dạng bài, bản xem trước, bảng nhận diện) vẫn do legacy dựng HTML rồi đặt vào các ô rỗng ở đây,
// nên HTML giống hệt v106. React không đụng vào con của các ô đó (JSX để trống).
import { useLayoutEffect, useRef } from 'react';
import { useUi, publish } from './store';
import { actions } from './actions';

export type ImpUi = {
  mode: 'task' | 'sheet';
  tab: 'lib' | 'src';
  okHidden: boolean; okDisabled: boolean; okText: string;
  addHidden: boolean; pmHidden: boolean; pmMode: 'task' | 'test';
  srcInHidden: boolean; fileName: string;
};
export const IMP_DEF: ImpUi = { mode: 'task', tab: 'lib', okHidden: true, okDisabled: true, okText: 'Thêm vào cuối phiếu', addHidden: false, pmHidden: true, pmMode: 'task', srcInHidden: false, fileName: '' };

export function ImportDlg() {
  const u = useUi(s => s.imp), ref = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => { const el = ref.current!; if (u && !el.open) el.showModal(); else if (!u && el.open) el.close(); }, [!!u]);
  const s = u || IMP_DEF, sheet = s.mode === 'sheet', src = s.tab === 'src';
  const tab = (v: 'lib' | 'src', n: string) => (
    <button key={v} data-tab={v} role="tab" className={s.tab === v ? 'on' : ''} aria-selected={s.tab === v ? 'true' : 'false'}>{n}</button>
  );
  return (
    <dialog id="libDlg" aria-labelledby="libTitle" ref={ref} data-mode={s.mode} data-tab={s.tab}
      onClose={() => { if (useUi.getState().imp) publish({ imp: null }); actions.impClosed(); }}>
      <h3 id="libTitle" style={{ margin: '4px 0' }}>{sheet ? 'Phiếu mới: từ file hoặc dán' : 'Thêm Task: chọn dạng bài hoặc từ file / dán'}</h3>
      <div className="seg imtabs" id="imTabs" role="tablist" hidden={sheet}>{tab('lib', 'Chọn dạng bài')}{tab('src', 'Từ file / dán')}</div>
      <div id="libPane" hidden={src}><div className="lnw"><div className="lnl">
        <div className="lnsec"><span className="lnn">1</span> Dạng câu hỏi</div><div id="lnQ" />
        <div className="lnsec"><span className="lnn">2</span> Bố cục <span className="hint" id="lnTh" /></div><div id="lnT" className="lntrow" /><div id="lnB" className="lnbrow" /></div>
        <div className="lnr"><div className="lnpvh">Xem trước · chữ mẫu lorem</div><div id="lnPv" className="lnpv" /><p className="hint" id="lnCap" /></div></div>
        <div className="lnf"><span className="hint">Vị trí:</span><span className="seg" id="lnPos" /></div></div>
      <div id="srcPane" hidden={!src}>
        <div id="srcIn" hidden={s.srcInHidden}>
          <div className="imsrc"><button className="btn" id="impPick">Chọn file…</button><span className="hint" id="impName">{s.fileName}</span><span className="hint">JSON (nguồn chính) · MD theo quy ước · TXT</span></div>
          <input type="file" id="impFile" accept=".json,.md,.markdown,.txt,.pdf,application/json,text/markdown,text/plain" hidden />
          <textarea id="pasteTa" placeholder="…hoặc dán JSON, MD theo quy ước, hay chữ của bài vào đây" aria-label="Nội dung cần nhập" defaultValue="" />
          <div className="pmode seg" hidden={s.pmHidden}>
            <button data-pm="task" className={s.pmMode === 'task' ? 'on' : ''}>Một Task</button>
            <button data-pm="test" className={s.pmMode === 'test' ? 'on' : ''}>Cả đề</button>
          </div>
        </div>
        <div id="pasteOut" className="pout" />
      </div>
      <div className="row">
        <button className="btn" id="libClose" onClick={() => publish({ imp: null })}>Đóng</button>
        <button className="btn pri" id="libAdd" hidden={src} onClick={() => actions.lnAdd()}>Thêm Task</button>
        <button className="btn pri" id="pasteOk" hidden={s.okHidden} disabled={s.okDisabled} onClick={() => actions.impOk()}>{s.okText}</button>
      </div>
    </dialog>
  );
}

// Hộp "Dán nhiều dòng vào Task đang soạn" (#pasteDlg): riêng, không phải nhập file.
export function PasteDlg() {
  const p = useUi(s => s.paste), ref = useRef<HTMLDialogElement>(null), ta = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => { const el = ref.current!; if (p && !el.open) { el.showModal(); ta.current!.value = ''; ta.current!.focus(); } else if (!p && el.open) el.close(); }, [!!p]);
  const n = p ? p.lines : 0;
  return (
    <dialog id="pasteDlg" aria-labelledby="pasteTitle" ref={ref} onClose={() => { if (useUi.getState().paste) publish({ paste: null }); }}>
      <h3 id="pasteTitle" style={{ margin: '4px 0' }}>Dán nhiều dòng vào Task đang soạn</h3>
      <textarea id="itemsTa" placeholder="Mỗi dòng một câu" aria-label="Các dòng cần thêm" ref={ta}
        onInput={() => publish({ paste: { ...useUi.getState().paste!, lines: ta.current!.value.split('\n').filter(x => x.trim()).length } })} />
      <div id="itemsOut" className="pout">{p && n ? <p className="hint">{n} dòng → {n} {p.unit} mới.</p>
        : <p className="hint">Mỗi dòng một câu (bảng: mỗi dòng một hàng, ô cách nhau bằng Tab hoặc |). Số thứ tự ở đầu dòng sẽ được bỏ.</p>}</div>
      <div className="row">
        <button className="btn" id="itemsCancel" onClick={() => publish({ paste: null })}>Hủy</button>
        <button className="btn pri" id="itemsOk" disabled={!n} onClick={() => { const raw = ta.current!.value, id = p!.id; publish({ paste: null }); actions.pasteItems(raw, id); }}>{n ? `Thêm ${n} dòng` : 'Thêm'}</button>
      </div>
    </dialog>
  );
}
