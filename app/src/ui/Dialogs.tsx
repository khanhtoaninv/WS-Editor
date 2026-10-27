// Hộp thoại dùng chung (v106: #dlg "Xem JSON / Xuất MD" và #cfmDlg hộp hỏi xác nhận). Giữ id / class như cũ.
// <dialog> mở bằng showModal() trong useLayoutEffect: chạy ngay trong publish() (flushSync), nên mở xong trước khi hàm gọi trả về.
import { useLayoutEffect, useRef } from 'react';
import { useUi, publish } from './store';
import { actions } from './actions';

const JSON_HINT = 'Nội dung gốc, cấu hình layout và các override. Sao chép để lưu hoặc gửi cho hệ thống khác.';
const MD_HINT = 'Chỉ giữ nội dung và loại bài, không giữ chỉnh layout, kích thước hay ảnh đã tải lên. Muốn giữ đủ thì dùng Xem JSON.';

export function DataDlg() {
  const d = useUi(s => s.dataDlg), ref = useRef<HTMLDialogElement>(null), ta = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => { const el = ref.current!; if (d && !el.open) el.showModal(); else if (!d && el.open) el.close(); }, [d]);
  const isMd = !!d && d.kind === 'md';
  const copy = () => {
    const t = ta.current!, fall = () => { t.focus(); t.select(); actions.toast('Đã chọn toàn bộ, bấm Ctrl+C để sao chép'); };
    try { navigator.clipboard.writeText(t.value).then(() => actions.toast(isMd ? 'Đã sao chép MD' : 'Đã sao chép JSON'), fall); } catch (_) { fall(); }
  };
  return (
    <dialog id="dlg" ref={ref} onClose={() => { if (useUi.getState().dataDlg) publish({ dataDlg: null }); }}>
      <h2 id="dlgTitle" style={{ margin: '0 0 8px', fontSize: 15 }}>{isMd ? 'Phiếu dạng Markdown (MD)' : 'Dữ liệu phiếu (JSON)'}</h2>
      <p className="hint" id="dlgHint">{isMd ? MD_HINT : JSON_HINT}</p>
      <textarea id="jsonOut" readOnly ref={ta} value={d ? d.text : ''} />
      <div className="row"><button className="btn" id="copyJson" onClick={copy}>Sao chép</button><button className="btn pri" id="closeDlg" onClick={() => publish({ dataDlg: null })}>Đóng</button></div>
    </dialog>
  );
}

// Hộp hỏi xác nhận (thay confirm() của trình duyệt). Esc hoặc bấm ra ngoài hộp (cả lúc nhấn và lúc thả) = Hủy.
let resolver: ((v: boolean) => void) | null = null;
export function askConfirm(title: string, msg?: string, yes?: string): Promise<boolean> {
  if (resolver) resolver(false);
  return new Promise(res => { resolver = res; publish({ cfm: { title, msg: msg || '', yes: yes || 'Đồng ý' } }); });
}
function done(v: boolean) { const r = resolver; resolver = null; publish({ cfm: null }); if (r) r(v); }

export function ConfirmDlg() {
  const c = useUi(s => s.cfm), ref = useRef<HTMLDialogElement>(null), no = useRef<HTMLButtonElement>(null), downOut = useRef(false);
  useLayoutEffect(() => { const el = ref.current!; if (c && !el.open) { el.showModal(); no.current!.focus(); } else if (!c && el.open) el.close(); }, [c]);
  const out = (e: React.MouseEvent) => { const el = ref.current!, r = el.getBoundingClientRect(); return e.target === el && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom); };
  return (
    <dialog id="cfmDlg" aria-labelledby="cfmTitle" ref={ref}
      onMouseDown={e => { downOut.current = out(e); }}
      onClick={e => { if (downOut.current && out(e) && ref.current!.open) done(false); downOut.current = false; }}
      onClose={() => { if (resolver) done(false); }}>
      <h3 id="cfmTitle" style={{ margin: '4px 0' }}>{c ? c.title : ''}</h3><p className="hint" id="cfmMsg" style={{ margin: '6px 0 0' }}>{c ? c.msg : ''}</p>
      <div className="row"><button className="btn" id="cfmNo" ref={no} onClick={() => done(false)}>Hủy</button><button className="btn dngb" id="cfmYes" onClick={() => done(true)}>{c ? c.yes : 'Xóa'}</button></div>
    </dialog>
  );
}
