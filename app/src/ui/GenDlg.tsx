// Hộp ảnh (v106: #genDlg) — tạo ảnh bằng mô tả, tải ảnh từ máy, chỉnh khung (Fit / zoom / kéo lệch tâm).
// React giữ khung hộp và việc mở / đóng; nội dung thay đổi theo thao tác (khung xem trước, danh sách ảnh,
// ảnh tham chiếu, tỷ lệ) vẫn do legacy dựng rồi đặt vào các ô rỗng ở đây, nên HTML giống hệt v106.
import { useLayoutEffect, useRef } from 'react';
import { useUi, publish } from './store';

export function GenDlg() {
  const open = useUi(s => s.genOpen), ref = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => { const el = ref.current!; if (open && !el.open) el.showModal(); else if (!open && el.open) el.close(); }, [open]);
  return (
    <dialog id="genDlg" aria-labelledby="genTitle" ref={ref} onClose={() => { if (useUi.getState().genOpen) publish({ genOpen: false }); }}><div className="gen">
      <div className="genh"><h3 id="genTitle">Ảnh</h3><button className="btn ghost" id="genClose" aria-label="Đóng" onClick={() => publish({ genOpen: false })}>✕</button></div>
      <div className="genbody">
        <div><div className="genfr" id="genFr" /><div className="genvs" id="genVs" aria-label="Các ảnh đã tạo" />
          <div className="genframe" id="genFrame" hidden>
            <div className="genrow"><b>Hiển thị</b><span className="seg" id="genFit" /></div>
            <div className="genrow" id="genZoomRow"><span>Zoom</span><input type="range" id="genZoom" min="50" max="300" step="5" aria-label="Zoom ảnh" /><output id="genZoomOut" /><button className="btn" id="genCenter">Về giữa</button></div>
          </div></div>
        <div className="gencol">
          <label htmlFor="genPrompt">Mô tả ảnh (prompt)</label>
          <textarea id="genPrompt" placeholder="Ví dụ: a cute cat sitting on a sofa, flat illustration for kids, white background" defaultValue="" />
          <label>Ảnh tham chiếu <span className="hint" style={{ fontWeight: 400 }}>(không bắt buộc, tối đa 4)</span></label>
          <div className="genrefs" id="genRefs" />
          <div className="genrow"><span>Tỷ lệ</span><span className="seg" id="genAr" /></div>
          <p className="hint" id="genNote" style={{ margin: 0 }} />
          <div><button className="btn pri" id="genGo">Tạo ảnh</button> <span className="hint">Ctrl+Enter</span></div>
        </div>
      </div>
      <div className="genfoot"><button className="btn" id="genUpload">Tải ảnh từ máy…</button><button className="btn" id="genRm">Gỡ ảnh</button><span className="sp" /><button className="btn pri" id="genUse" disabled>Dùng ảnh này</button></div>
    </div></dialog>
  );
}
