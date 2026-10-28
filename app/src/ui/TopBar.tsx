// Thanh trên cùng (v106: <header class="top"> trong index.html). Giữ nguyên id / class / chữ để CSS và test cũ dùng được.
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useUi, publish } from './store';
import { actions } from './actions';

const CODES_KEY = 'wsEditor.codes.v1';
const HELP_ITEMS = ['Kéo thanh hoặc cạnh trên trang = đổi kích thước; bấm đúp = về tự động', 'Esc = lên cấp · Tab = container kế · Shift+bấm = chọn thêm',
  'Mũi tên = chỉnh nhanh (Shift = bước lớn)', 'Ctrl+C / Ctrl+V = chép kiểu giữa container cùng loại', 'Ctrl+Z / Ctrl+Shift+Z = hoàn tác / làm lại'].map(x => <li key={x}>{x}</li>);

export function TopBar() {
  const s = useUi(), ageRef = useRef<HTMLSelectElement>(null);
  // Ô Độ tuổi: nghe sự kiện "change" gốc ngay trên phần tử (như v106), vì React chỉ nhận sự kiện có nổi bọt;
  // giá trị hiển thị theo kho (đổi khi hoàn tác / nạp phiếu).
  useLayoutEffect(() => { ageRef.current!.value = s.age; }, [s.age]);
  useEffect(() => { const el = ageRef.current!, f = () => actions.setAge(el.value); el.addEventListener('change', f); return () => el.removeEventListener('change', f); }, []);
  return (
    <header className="top">
      <div className="brand">WS Editor <span className="badge" id="verBadge" title="Phiên bản bản dựng này (bản dựng Vite, đang chuyển sang React)" style={{ fontSize: 11, padding: '1px 7px', marginLeft: 4 }}>v118</span> <small id="wsTitle">{s.title}</small></div>
      <div className="tb">
        <label htmlFor="age" className="hint" style={{ margin: 0 }}>Độ tuổi</label>
        <select id="age" ref={ageRef}><option value="5-6">5–6</option><option value="7-9">7–9</option><option value="10-12">10–12</option></select>
      </div>
      <div className="tb">
        <button className="btn" id="undo" title="Hoàn tác (Ctrl+Z)" disabled={!s.canUndo} onClick={() => actions.undo()}>↶ Hoàn tác</button>
        <button className="btn" id="redo" title="Làm lại (Ctrl+Shift+Z)" disabled={!s.canRedo} onClick={() => actions.redo()}>↷ Làm lại</button>
      </div>
      <div className="tb">
        <button className="btn" id="zoomOut" aria-label="Thu nhỏ" onClick={() => actions.zoomOut()}>−</button>
        <button className="btn" id="zoomFit" style={{ minWidth: 64 }} onClick={() => actions.zoomFit()}>{s.zoomLabel}</button>
        <button className="btn" id="zoomIn" aria-label="Phóng to" onClick={() => actions.zoomIn()}>+</button>
      </div>
      <div className="tb"><button className={'btn ghost' + (s.guides ? ' pri' : '')} id="guidesBtn" title="Hiện các đường dóng (không in)" onClick={() => actions.toggleGuides()}>Đường dóng</button></div>
      <span className="sp"></span>
      <span className="badge" id="pageBadge">{s.pages == null ? '–' : `${s.pages} trang A4`}</span>
      <span className={'badge' + (s.diags ? ' bad' : '')} id="diagBadge">{s.diags == null ? '–' : s.diags ? `${s.diags} lỗi tràn trang` : 'Không lỗi tràn'}</span>
      <button className="btn ghost" id="jsonBtn" onClick={() => actions.showJson()}>Xem JSON</button>
      <button className="btn ghost" id="mdBtn" onClick={() => actions.showMd()}>Xuất MD</button>
      <button className="btn ghost" id="helpBtn" aria-haspopup="dialog" aria-expanded={s.helpOpen ? 'true' : 'false'} title="Thao tác nhanh"
        onClick={e => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); publish({ helpOpen: !s.helpOpen }); }}>?</button>
    </header>
  );
}

// Hộp "Thao tác nhanh" (v106: #helpPop). Bấm ngoài hoặc Esc thì đóng; ô "Hiện mã kỹ thuật" nhớ trong localStorage.
export function HelpPop() {
  const { helpOpen, codes } = useUi(), ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const shut = () => publish({ helpOpen: false });
    const onClick = (e: MouseEvent) => { if (useUi.getState().helpOpen && ref.current && !ref.current.contains(e.target as Node)) shut(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && useUi.getState().helpOpen) { shut(); e.stopPropagation(); e.preventDefault(); } };
    document.addEventListener('click', onClick); window.addEventListener('keydown', onKey, true);
    return () => { document.removeEventListener('click', onClick); window.removeEventListener('keydown', onKey, true); };
  }, []);
  useEffect(() => { document.documentElement.classList.toggle('codes', codes); }, [codes]);
  return (
    <div className="helppop" id="helpPop" hidden={!helpOpen} role="dialog" aria-label="Thao tác nhanh" ref={ref}>
      <b>Thao tác nhanh</b><ul>{HELP_ITEMS}</ul>
      <label><input type="checkbox" id="codesChk" checked={codes} onChange={e => { const on = e.target.checked; publish({ codes: on }); try { localStorage.setItem(CODES_KEY, on ? '1' : '0'); } catch (_) {} }} /> Hiện mã kỹ thuật (T1, G0, A1…)</label>
    </div>
  );
}
