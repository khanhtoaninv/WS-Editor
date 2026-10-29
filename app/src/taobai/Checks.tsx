// Module Tạo bài T2: phần Kiểm tra trong ngăn Duyệt bài (đặc tả 5.3, 6) + lớp Hiện đáp án / tô vàng trên trang (5.4).
// Giáo viên thấy tiêu chí đạt / chưa đạt kèm lý do, không thấy điểm số. Tiêu chí chưa đạt mở sẵn, tiêu chí đạt gập lại.
// Lớp phủ chỉ là hiển thị: vẽ lên DOM trang đã dàn (cách của trình chiếu, viewer/answers.ts), không đổi dữ liệu,
// không vào bản in / gói (gói lấy HTML trang từ kho, không từ DOM).
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLayoutEffect, useState } from 'react';
import * as St from '../core/state.js';
import { sheetSlots, taskSlots } from '../core/slots.js';
import { useUi, publish, type TbUi } from '../ui/store';
import { applyAnswers, clearAnswers } from '../viewer/answers';
import { allChecks, allSheetChecks, type Check } from './maykiem';
import { hasGen } from './gen';

const tb = (): TbUi => useUi.getState().tb;
const setTb = (p: Partial<TbUi>) => publish({ tb: Object.assign({}, tb(), p) });

function List({ cs, id, title }: { cs: Check[]; id: string; title: string }) {
  const [open, setOpen] = useState(false);
  const bad = cs.filter(c => !c.ok), good = cs.filter(c => c.ok), grp = (g: string) => g === 'ai' ? 'AI chấm' : 'Máy kiểm';
  return <div className="tbkt" id={id} data-ok={cs.length - bad.length} data-n={cs.length}>
    <div className="tbkth"><b>{title}</b> · <span className={bad.length ? 'bad' : 'good'}>{cs.length - bad.length}/{cs.length} đạt</span></div>
    {bad.length ? <ul className="tbkl bad">{bad.map(c => <li key={c.group + c.id} data-ck={c.id}><span className="tbx">✕</span><span><b>{c.name}</b><small> · {grp(c.group)}</small>{c.why ? <span className="tbwhy">{c.why}</span> : null}</span></li>)}</ul> : null}
    {good.length ? <><button type="button" className="tbktt" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '▾' : '▸'} {good.length} tiêu chí đạt</button>
      {open ? <ul className="tbkl good">{good.map(c => <li key={c.group + c.id} data-ck={c.id}><span className="tbv">✓</span><span>{c.name}<small> · {grp(c.group)}</small></span></li>)}</ul> : null}</> : null}
  </div>;
}
export function TbChecks({ t }: { t: any }) { useUi(s => s.pageView); return <List cs={allChecks(t)} id="tbChecks" title="Kiểm tra" />; }
export function TbSheetChecks() { useUi(s => s.pageView); const w = St.ws as any; return hasGen(w) ? <List cs={allSheetChecks(w)} id="tbSheetChecks" title="Cả phiếu" /> : null; }

export function AnsToggle() {
  const on = useUi(s => s.tb.ans);
  return <label className="tbsw"><input type="checkbox" id="tbAnsChk" checked={on} onChange={e => setTb({ ans: e.target.checked })} /> Hiện đáp án trên trang <small>(màu cam, không in)</small></label>;
}

/** Vẽ lớp phủ lên #stage sau mỗi lần dàn trang: đáp án (khi bật) và tô vàng câu bị máy kiểm bắt lỗi (khi ngăn đang mở). */
export function TbOverlay() {
  const pv = useUi(s => s.pageView), t = useUi(s => s.tb); useUi(s => s.treeRev);
  useLayoutEffect(() => {
    const root = document.getElementById('stage'); if (!root) return;
    clearAnswers(root); root.querySelectorAll('.tbbad').forEach(e => e.classList.remove('tbbad'));
    const w = St.ws as any;
    document.documentElement.classList.toggle('tbans', !!(t.ans && w && hasGen(w) && !t.viewAt));
    if (!w || !hasGen(w) || t.viewAt) return;
    if (t.ans) { try { const r = sheetSlots(w); applyAnswers(root, r.slots, r.key, new Set(r.slots.map((s: any) => s.id))); } catch (_) { /* phiếu đang đổi */ } }
    if (t.panel === 'duyet') {
      for (const tk of w.tasks) {
        if (!tk.gen || tk.gen.status === 'wait') continue;   // bài đang chờ sinh (chữ xxx): không tô
        const ids = new Set(allChecks(tk).filter(c => !c.ok).flatMap(c => c.ids || [])); if (!ids.size) continue;
        let slots: any[] = []; try { slots = taskSlots(tk).slots; } catch (_) { /* */ }
        slots.filter(s => ids.has(s.item)).forEach(s => root.querySelectorAll<HTMLElement>(`[data-ans="${CSS.escape(s.id)}"]`).forEach(el => { const host = el.parentElement && !el.parentElement.matches('section.task,.flow') ? el.parentElement : el; host.classList.add('tbbad'); }));
        ids.forEach(id => root.querySelectorAll(`[data-node="${CSS.escape(tk.id + ':G3:' + id)}"]`).forEach(e => e.classList.add('tbbad')));
      }
    }
  });
  void pv; return null;
}
