// Module Tạo bài, giai đoạn ② Biên tập (đặc tả mục 5): chỉ GẮN THÊM vào editor, không sửa bố cục ba cột.
//   TaoBaiBar     dải trên cùng (phía trên thanh công cụ editor): ① Ra đề › ② Biên tập · lesson · Duyệt bài k/N · Lịch sử phiếu · Xuất bản
//   TbIcon        biểu tượng trạng thái cuối dòng Task trong cây (⏳ ⚠ ○ ✓); bấm = mở ngăn Duyệt đúng bài
//   TaoBaiDrawer  ngăn trượt ĐÈ TẠM lên inspector (cùng ô lưới), ✕ đóng thì inspector hiện lại
//   TbPubDlg      hộp nhắc khi Xuất bản còn bài chưa duyệt
// Mọi thay đổi phiếu đi qua commit() của editor (có Hoàn tác). Chỉ hiện khi phiếu có ws.gen.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLayoutEffect, type ReactNode } from 'react';
import * as St from '../core/state.js';
import { QN, its } from '../core/model.js';
import { qOf } from '../core/layout.js';
import { taskSlots } from '../core/slots.js';
import { useUi, publish, type TbUi } from '../ui/store';
import { L } from '../ui/legacyApi';
import { askConfirm } from '../ui/Dialogs';
import { toast } from '../ui/Toast';
import { hasGen, statusOf, progress, nextTodo, changedSince, hhmm, approveTask, approveSheet, useTaskVer, usedVer, restoreSheet, viewCopy, genTasks, sheetVer, enableGen, type Stat } from './gen';
import { TbChecks, TbSheetChecks, AnsToggle } from './Checks';
import { openRaDe } from './RaDe';
import { nguonHienTai, moNguon } from './nguon';
import { allChecks, allSheetChecks } from './maykiem';
const stOf = (t: any) => statusOf(t, allChecks(t));

const W = (): any => St.ws;
const tb = (): TbUi => useUi.getState().tb;
export const setTb = (p: Partial<TbUi>) => publish({ tb: Object.assign({}, tb(), p) });
const ICO: Record<Stat, [string, string]> = { wait: ['⏳', 'Đang viết…'], warn: ['⚠', 'Có tiêu chí chưa đạt'], todo: ['○', 'Chưa duyệt'], ok: ['✓', 'Đã duyệt'] };
const nOf = (t: any) => t.number || W().tasks.indexOf(t) + 1;

/** Mở ngăn Duyệt ở một bài (mặc định: bài chưa duyệt đầu tiên) và chọn bài đó trên trang. */
export function openReview(id?: string | null) {
  const w = W(), a = genTasks(w); if (!a.length) return;
  const cur = id && a.some((t: any) => t.id === id) ? id : nextTodo(w, null) || a[0].id;
  setTb({ panel: 'duyet', cur }); goTask(cur);
}
function goTask(id: string) {
  if (L.viewing) return;
  try { L.pick({ type: 'task', id }); } catch (_) { /* phiếu đang đổi */ }
  const el = document.querySelector(`#stage .task[data-task="${id}"]`); if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

// ---------- dải trên cùng ----------
export function TaoBaiBar() {
  useUi(s => s.treeRev); const t = useUi(s => s.tb), w = W();
  const on = !!w && (hasGen(w) || !!t.viewAt);
  useLayoutEffect(() => { document.documentElement.style.setProperty('--tbh', on ? '44px' : '0px'); }, [on]);
  if (!on) return null;
  if (t.viewAt) {
    return <div className="tbbar view" id="tbBar" role="region" aria-label="Đang xem bản cũ">
      <b>Đang xem bản duyệt phiếu {hhmm(t.viewAt)}</b><span className="tbmut">chỉ đọc: không sửa được</span><span className="sp" />
      <button className="btn" id="tbViewEnd" onClick={endView}>Về bản hiện tại</button>
      <button className="btn pri" id="tbViewRestore" onClick={() => restore(t.viewAt!)}>Khôi phục bản này</button>
    </div>;
  }
  const g = w.gen, p = progress(w), name = [g.src?.names?.course, g.src?.names?.unit, g.src?.names?.lesson].filter(Boolean).join(' · ') || w.title;
  return <div className="tbbar" id="tbBar" role="region" aria-label="Tạo bài">
    <span className="tbst"><button className="tbstep" id="tbRaDe" title="Quay lại màn Ra đề (cấu trúc đã duyệt hiện lại)" onClick={openRaDe}><i>1</i>Ra đề</button><span className="sep">›</span><span className="tbstep on"><i>2</i>Biên tập</span></span>
    <span className="tbname" title={name}>{name}</span><span className="sp" />
    <button className={'btn' + (t.panel === 'duyet' ? ' on' : '')} id="tbDuyet" onClick={() => t.panel === 'duyet' ? setTb({ panel: null }) : openReview(t.cur)}>Duyệt bài <b className="tbcnt">{p.done}/{p.total}</b></button>
    <button className={'btn' + (t.panel === 'lichsu' ? ' on' : '')} id="tbLs" onClick={() => setTb({ panel: t.panel === 'lichsu' ? null : 'lichsu' })}>🕘 Lịch sử phiếu</button>
    <button className="btn pri" id="tbPub" onClick={publishSheet}>Xuất bản</button>
  </div>;
}

// ---------- biểu tượng trong cây ----------
export function TbIcon({ t }: { t: any }) {
  const st = stOf(t); if (!st || !hasGen(W())) return null;
  return <span className={`tbic ${st}`} role="button" tabIndex={-1} data-tbic={st} title={ICO[st][1] + ' · bấm để mở ngăn Duyệt bài'}>{ICO[st][0]}</span>;
}
// Bấm biểu tượng: bắt ở pha capture, trước bộ xử lý chọn Task của cây (bộ đó dựng lại cả cột ngay trong cú bấm)
if (typeof document !== 'undefined') document.addEventListener('click', e => {
  const el = (e.target as Element | null)?.closest?.('#tree .tbic'); if (!el) return;
  const id = (el.closest('[data-tk]') as HTMLElement | null)?.dataset.tk; if (!id) return;
  e.stopPropagation(); e.preventDefault(); openReview(id);
}, true);

// ---------- hành động ----------
function approve(id: string) {
  const w = W(), t = w.tasks.find((x: any) => x.id === id); if (!t) return;
  L.commit((w2: any) => approveTask(w2, id), `Đã duyệt bài ${nOf(t)}`);
  const nx = nextTodo(W(), id);
  if (nx) { setTb({ cur: nx }); goTask(nx); } else toast('Mọi bài đã duyệt');
}
function useVer(id: string, at: string) { L.commit((w2: any) => useTaskVer(w2, id, at), `Đã dùng bản duyệt ${hhmm(at)}`); }
function approveAll() { L.commit((w2: any) => approveSheet(w2), 'Đã duyệt phiếu'); luuMayChu(); }
/** Phiếu tạo từ giáo trình: lưu lên máy chủ (mục "Phiếu đã tạo" của lesson) khi Duyệt phiếu / Xuất bản. Không có máy chủ thì thôi. */
async function luuMayChu() {
  const w = W(), s = w && w.gen && w.gen.src; if (!s || !s.course || !s.lesson) return;
  const n = nguonHienTai() || await moNguon(); if (!n.luuPhieu) return;
  if (!(await n.luuPhieu(s.course, s.lesson, String(w.id || 'phieu').replace(/[^\w-]/g, '-').slice(0, 80), w))) toast('Chưa lưu được phiếu lên máy chủ');
}
function startView(at: string) {
  const c = viewCopy(W(), at); if (!c) return;
  setTb({ viewAt: at, panel: null }); L.tbView(c);
}
function endView() { setTb({ viewAt: null }); L.tbViewEnd(); }
async function restore(at: string) {
  if (!(await askConfirm('Khôi phục cả phiếu?', `Phiếu sẽ thay bằng bản duyệt phiếu ${hhmm(at)} (mọi bài và cài đặt phiếu). Bấm Hoàn tác để quay lại.`, 'Khôi phục'))) return;
  if (tb().viewAt) endView();
  L.commit((w2: any) => restoreSheet(w2, at), `Đã khôi phục bản ${hhmm(at)}`);
  setTb({ panel: null });
}
export function pubIssues(w: any): { n: number; id: string; why: string }[] {
  return genTasks(w).map((t: any) => { const s = stOf(t); return s === 'ok' ? null : { n: nOf(t), id: t.id, why: s === 'warn' ? '⚠ cần xem' : s === 'wait' ? 'đang viết' : 'chưa duyệt' }; }).filter(Boolean) as any;
}
function publishSheet() {
  const w = W(), iss = pubIssues(w), bad = allSheetChecks(w).filter((c: any) => !c.ok);
  if (iss.length || bad.length) { setTb({ pub: true }); return; }
  doPublish();
}
function doPublish() { setTb({ pub: false }); approveAll(); publish({ wspOpen: true }); }

// ---------- đáp án một dòng ----------
function keyText(s: any, k: any): string {
  if (!k || k.grading === 'manual') return '…';
  if (k.accept) return k.accept[0];
  const op = (id: string) => { const o = (s.options || []).find((x: any) => x.id === id); return o ? (o.text || o.label || o.img || id) : id; };
  if (Array.isArray(k.correct)) return k.correct.map(op).join(' + ');
  if (k.correct != null) return s.interaction === 'match' ? String(k.correct) : op(String(k.correct));
  return '…';
}
export function ansLine(t: any): string {
  try {
    const r = taskSlots(t); if (!r.slots.length) return 'không có đáp án (bài viết tự do / tô chữ)';
    if (r.slots.every((s: any) => s.interaction === 'match')) return `nối: ${r.slots.length} cặp, cặp đúng là cặp viết cạnh nhau (app xáo khi in)`;
    return r.slots.map((s: any) => `${s.label}. ${keyText(s, (r.key as any)[s.id])}`).join(' · ');
  } catch (_) { return '…'; }
}

// ---------- ngăn trượt ----------
const Sec = ({ title, children, id }: { title?: ReactNode; children: ReactNode; id?: string }) => <section className="tbsec" id={id}>{title ? <h4>{title}</h4> : null}{children}</section>;

function Review() {
  const w = W(), t = useUi(s => s.tb), a = genTasks(w);
  const k = Math.max(0, a.findIndex((x: any) => x.id === t.cur)), cur = a[k]; if (!cur) return <p className="tbmut">Phiếu chưa có bài.</p>;
  const st = stOf(cur)!, p = progress(w), g = cur.gen, q = qOf(cur), n = its(cur).filter((x: any) => !x.ex && !x.gt).length;
  const hist = (g.history || []).slice().reverse(), sh = w.gen.history || [], used = usedVer(cur), lastAt = (g.history || []).slice(-1)[0]?.at;
  const step = (w.gen.structure || [])[k], role = g.role || step?.role || '';
  const go = (d: number) => { const nx = a[(k + d + a.length) % a.length]; setTb({ cur: nx.id }); goTask(nx.id); };
  return <>
    <div className="tbhead"><b>Duyệt bài</b><span className="tbnav"><button className="btn sm" aria-label="Bài trước" id="tbPrev" onClick={() => go(-1)}>‹</button><span id="tbPos">{k + 1} / {a.length}</span><button className="btn sm" aria-label="Bài sau" id="tbNext" onClick={() => go(1)}>›</button></span><span className="sp" /><button className="btn sm ghost" aria-label="Đóng ngăn" id="tbClose" onClick={() => setTb({ panel: null })}>✕</button></div>
    <div className="tbprog" title={`${p.done}/${p.total} đã duyệt`}><i style={{ width: `${p.total ? 100 * p.done / p.total : 0}%` }} /><span>{p.done}/{p.total} đã duyệt</span></div>
    <Sec id="tbSheet">
      <TbSheetChecks />
      <div className="tbrow"><button className="btn" id="tbApproveSheet" onClick={approveAll}>✓ Duyệt phiếu</button><button className="btn ghost" id="tbSheetHist" onClick={() => setTb({ panel: 'lichsu' })}>🕘 Lịch sử phiếu ({sh.length}/3)</button></div>
    </Sec>
    <div className="tbtask" id="tbTask" data-st={st}>
      <div className="tbtags">{role ? <span className="tag">{role}</span> : null}{q ? <span className="tag q">{q} {(QN as any)[q]}</span> : null}<span className="tag">{q === 'Q12' ? `${(cur.answer?.params?.lines) || 1} dòng` : `${n} câu`}</span><span className={`tbic ${st}`} title={ICO[st][1]}>{ICO[st][0]}</span></div>
      <div className="tbtitle"><b>Bài {nOf(cur)}</b> · {cur.title || '(chưa có tiêu đề)'}</div>
    </div>
    <TbChecks t={cur} />
    {g.goal || g.ctx ? <dl className="tbmeta">{g.goal ? <><dt>Mục tiêu</dt><dd>{g.goal}</dd></> : null}{g.ctx ? <><dt>Ngữ cảnh</dt><dd>{g.ctx}</dd></> : null}</dl> : null}
    <div className="tbans" id="tbAns"><b>Đáp án:</b> {ansLine(cur)}</div>
    {changedSince(cur) ? <p className="tbwarn" id="tbChanged">Đã sửa sau lần duyệt {hhmm(lastAt)} → chưa duyệt</p> : null}
    {st === 'ok' ? <button className="btn tbok" id="tbApprove" disabled>✓ Đã duyệt</button> : <button className="btn pri tbok" id="tbApprove" disabled={st === 'wait'} onClick={() => approve(cur.id)}>✓ Duyệt bài này</button>}
    <Sec title={<>Lịch sử bài này ({(g.history || []).length}/3 lần duyệt)</>} id="tbTaskHist">
      {hist.length ? <ul className="tbhist">{hist.map((h: any) => <li key={h.at}><span className="tbat">{hhmm(h.at)}</span><span className="tbnote">{h.note}</span>{used === h.at ? <span className="tag ok">đang dùng</span> : <button className="btn sm" data-tbuse={h.at} onClick={() => useVer(cur.id, h.at)}>Dùng bản này</button>}</li>)}</ul> : <p className="tbmut">Chưa có. Lịch sử chỉ tạo khi bấm Duyệt.</p>}
    </Sec>
    <Sec title="⟳ Sinh lại bài này" id="tbRegen">
      <textarea className="tbta" rows={2} placeholder="Góp ý cho AI, vd: mỗi câu trả lời chỉ ghép được một câu hỏi" disabled />
      <div className="tbrow"><button className="btn" disabled title="Có ở bản Sinh bài (T4)">Sinh lại</button></div>
      <p className="tbmut">Bản chưa duyệt sẽ bị thay hẳn; các bản đã duyệt vẫn còn trong Lịch sử bài này. (Sinh bài bằng AI: giai đoạn T4.)</p>
    </Sec>
    <p className="tbmut">Sửa chữ, dàn trang: đóng ngăn (✕) và dùng editor như bình thường.</p>
  </>;
}

function SheetHistory() {
  const w = W(), h = (w.gen.history || []).slice().reverse();
  return <>
    <div className="tbhead"><b>Lịch sử phiếu</b><span className="tbmut">{h.length}/3 lần duyệt gần nhất</span><span className="sp" /><button className="btn sm ghost" aria-label="Đóng ngăn" id="tbClose" onClick={() => setTb({ panel: null })}>✕</button></div>
    {h.length ? <ul className="tbhist sheet">{h.map((x: any, i: number) => <li key={x.at}><span className="tbat">{hhmm(x.at)}</span>{i === 0 ? <span className="tag ok">mới nhất</span> : null}<span className="tbnote">{x.note}</span>
      <span className="tbrow"><button className="btn sm" data-tbview={x.at} onClick={() => startView(x.at)}>Xem</button><button className="btn sm" data-tbrestore={x.at} onClick={() => restore(x.at)}>Khôi phục</button></span></li>)}</ul>
      : <p className="tbmut">Chưa có lần duyệt phiếu nào.</p>}
    <p className="tbmut">Mỗi lần bấm <b>Duyệt phiếu</b> (hoặc Xuất bản) lưu một bản của cả phiếu (mọi bài + cài đặt dàn trang). Giữ tối đa 3 bản; duyệt lần thứ 4 thì bản cũ nhất bị bỏ. Lịch sử từng bài nằm trong ngăn Duyệt bài.</p>
    <div className="tbrow"><button className="btn" onClick={() => openReview(tb().cur)}>← Duyệt bài</button></div>
  </>;
}

export function TaoBaiDrawer() {
  useUi(s => s.treeRev); const t = useUi(s => s.tb), w = W();
  if (!w || !hasGen(w) || !t.panel || t.viewAt) return null;
  return <aside className="tbdrawer" id="tbDrawer" aria-label={t.panel === 'duyet' ? 'Duyệt bài' : 'Lịch sử phiếu'}>
    <div className="tbbody">{t.panel === 'duyet' ? <Review /> : <SheetHistory />}</div>
    {t.panel === 'duyet' ? <div className="tbfoot"><AnsToggle /></div> : null}
  </aside>;
}

// ---------- hộp Xuất bản ----------
export function TbPubDlg() {
  const t = useUi(s => s.tb); useUi(s => s.treeRev); const w = W();
  if (!t.pub || !w || !hasGen(w)) return null;
  const iss = pubIssues(w), bad = allSheetChecks(w).filter((c: any) => !c.ok);
  return <div className="tbmodal" role="dialog" aria-modal="true" aria-labelledby="tbPubT" id="tbPubDlg">
    <div className="tbmbox"><h3 id="tbPubT">Xuất bản khi còn việc chưa xong?</h3>
      {iss.length ? <p id="tbPubList">{iss.map(x => `Bài ${x.n} ${x.why}`).join(' · ')}</p> : null}
      {bad.length ? <p id="tbPubSheet">Cả phiếu: {bad.map((c: any) => `${c.name}: ${c.why || 'chưa đạt'}`).join(' · ')}</p> : null}
      <p className="tbmut">Xuất bản = Duyệt phiếu (lưu một bản vào Lịch sử phiếu) rồi mở hộp Gói .wsp.</p>
      <div className="tbrow end"><button className="btn ghost" id="tbPubCancel" onClick={() => setTb({ pub: false })}>Hủy</button><button className="btn" id="tbPubOpen" onClick={() => { setTb({ pub: false }); openReview(iss[0]?.id); }}>Mở ngăn duyệt</button><button className="btn pri" id="tbPubGo" onClick={doPublish}>Vẫn xuất bản</button></div>
    </div>
  </div>;
}

/** Lệnh ẩn T1: gắn ws.gen rỗng cho phiếu đang mở (thử Duyệt / Lịch sử khi chưa có AI). */
export function enableForSheet() {
  const w = W(); if (!w || hasGen(w)) { toast('Phiếu đã ở chế độ tạo bài'); return; }
  L.commit((w2: any) => enableGen(w2), 'Đã bật chế độ tạo bài cho phiếu này');
}
export { sheetVer };
