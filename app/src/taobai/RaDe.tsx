// Module Tạo bài T3: màn ① Ra đề (đặc tả mục 4; hình mẫu docs/MINH_HOA_TAO_BAI.html, nút "Ra đề").
//   hàng trên: chọn Giáo trình | Unit | Lesson | thông tin lesson (mục tiêu, phiếu đã tạo); bấm "Chọn bài" để thu gọn
//   dưới trái: cấu trúc bài (mỗi bước Trình tự một mục, +/✕, menu Q, −/+ số câu, ⟳), ghi chú cho AI, "Duyệt cấu trúc · Sinh bài"
//   dưới phải: layout sơ bộ = phiếu giả dàn bằng CHÍNH bộ dàn trang của app (core/layout), báo vượt số trang
// "Sinh bài" (T3): dựng phiếu khung (mỗi bài: G0 + dạng Q + khung chữ xxx, trạng thái ⏳ đang viết) để T4 điền.
// Quay lại Ra đề rồi Sinh bài: bài không đổi (cùng bước, Q, số câu) giữ nguyên, bài đổi / mới thì dựng khung, bài bỏ thì bỏ (5.6).
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react';
import * as St from '../core/state.js';
import { readMd, impSheetObj } from '../core/md.js';
import { useUi, publish, type TbUi } from '../ui/store';
import { L } from '../ui/legacyApi';
import { askConfirm } from '../ui/Dialogs';
import { toast } from '../ui/Toast';
import { Q_NAME, qUnit, type QCode, type GiaoTrinh, type DataNote } from '../../../shared/src/taobai/types.ts';
import { moNguon, nguonThuMuc, nguonMau, type Nguon, type Lesson } from './nguon';
import * as P from './plan';
import { hasGen } from './gen';
import { openThietLap } from './ThietLap';
import { openKho } from './KhoPhieu';
import { batDau } from './sinh';
import { openReview } from './TaoBai';

const tb = (): TbUi => useUi.getState().tb;
const setTb = (p: Partial<TbUi>) => publish({ tb: Object.assign({}, tb(), p) });
export const openRaDe = () => setTb({ rade: true, panel: null });
const note = (n: DataNote) => `${n.file.split('/').slice(-2).join('/')}${n.line ? ':' + n.line : ''} · ${n.msg}`;

type Sel = { gt: string; unit: string; ls: string };

export function RaDe() {
  const open = useUi(s => s.tb.rade), rev = useUi(s => s.tb.rev);
  return open ? <RaDeScreen key={rev} /> : null;
}

function RaDeScreen() {
  const [src, setSrc] = useState<Nguon | null>(null), [err, setErr] = useState('');
  const [sel, setSel] = useState<Sel>({ gt: '', unit: '', ls: '' }), [les, setLes] = useState<Lesson | null>(null);
  const [plan, setPlan] = useState<P.Plan>([]), [dirty, setDirty] = useState(false), [ghiChu, setGhiChu] = useState('');
  const [min, setMin] = useState(false), dirRef = useRef<HTMLInputElement>(null);
  const w0 = St.ws as any, back = !!(w0 && hasGen(w0) && w0.gen.src && w0.gen.src.lesson);   // quay lại từ Biên tập

  // nguồn dữ liệu
  useEffect(() => { moNguon().then(n => { setSrc(n); }).catch(e => setErr(String(e))); }, []);
  // chọn mặc định: lesson của phiếu đang mở (quay lại), không thì giáo trình / unit đầu tiên
  useEffect(() => {
    if (!src) return;
    if (back) { const s = w0.gen.src, g = src.giaoTrinh.find(x => x.id === s.course), u = g && g.units.find(x => x.lessons.some(l => l.id === s.lesson));
      if (g && u) { setSel({ gt: g.id, unit: u.id, ls: s.lesson }); setGhiChu(w0.gen.note || ''); setMin(true); return; } }
    const g = src.giaoTrinh[0]; if (g) setSel({ gt: g.id, unit: g.units[0]?.id || '', ls: '' });
  }, [src]);
  // chi tiết lesson + cấu trúc đề xuất
  useEffect(() => {
    if (!src || !sel.ls) { setLes(null); return; }
    let live = true;
    src.lesson(sel.gt, sel.ls).then(l => {
      if (!live) return; setLes(l); setDirty(false);
      if (!l || !l.trinhTu || l.loi.length) { setPlan([]); return; }
      const steps = l.trinhTu.buoc;
      if (back && w0.gen.src.lesson === sel.ls && w0.gen.src.course === sel.gt) setPlan(P.fromStructure(w0.gen.structure || [], steps));
      else setPlan(P.propose(steps, lastQs(l)));
    });
    return () => { live = false; };
  }, [src, sel.gt, sel.ls]);

  const gt: GiaoTrinh | undefined = src?.giaoTrinh.find(g => g.id === sel.gt), unit = gt?.units.find(u => u.id === sel.unit);
  const steps = les?.trinhTu?.buoc || [], stepsX = P.ext(steps);
  const edit = (p: P.Plan) => { setPlan(p); setDirty(true); };
  const pick = async (s: Partial<Sel>) => {
    if (dirty && s.ls !== undefined && s.ls !== sel.ls && !(await askConfirm('Đổi lesson?', 'Cấu trúc đang chỉnh sẽ mất.', 'Đổi lesson'))) return;
    setSel(Object.assign({}, sel, s));
  };
  const chooseDir = async (fl: FileList | null) => { if (!fl || !fl.length) return; const n = await nguonThuMuc(fl); await moNguon(n); setSrc(n); setSel({ gt: '', unit: '', ls: '' }); };

  // layout sơ bộ (dàn thật bằng core/layout, nội dung giả)
  const pv = useMemo(() => {
    if (!les || !les.trinhTu || !plan.length) return null;
    const md = P.fakeSheetMd(plan, les.trinhTu, les.tf, 'Layout sơ bộ', les.giaoTrinh.tuoi || '7-9');
    return L.previewPages ? L.previewPages(impSheetObj(readMd(md))) : null;
  }, [plan, les]);
  const nb = P.flat(plan).length, nP = pv ? pv.pages.length : 0;

  const sinh = async () => {
    if (!les || !les.trinhTu || !nb) return;
    await sinhBai(les, plan, ghiChu);
  };

  return <div className="rade" id="raDe" role="dialog" aria-label="Tạo bài · Ra đề">
    <div className="radeh"><b>WS Editor</b><small>Tạo bài</small>
      <span className="tbst"><span className="tbstep on"><i>1</i>Ra đề</span><span className="sep">›</span><button className="tbstep" id="rdToEd" disabled={!back} title={back ? 'Về Biên tập (giữ phiếu đang có)' : 'Chưa có phiếu: bấm Duyệt cấu trúc · Sinh bài'} onClick={() => setTb({ rade: false })}><i>2</i>Biên tập</button></span>
      <span className="sp" /><span className="tbmut" id="rdSrc">{src ? src.ten : 'Đang đọc dữ liệu…'}</span>
      {src && src.mode !== 'may-chu' ? <><button className="btn sm" onClick={() => dirRef.current?.click()} title="Chọn thư mục dữ liệu giáo trình (định dạng tạm, docs/TAO_BAI/DINH_DANG_TAM.md)">Chọn thư mục dữ liệu…</button>
        {src.mode === 'thu-muc' ? <button className="btn sm ghost" onClick={async () => { const n = nguonMau(); await moNguon(n); setSrc(n); }}>Dùng bộ mẫu</button> : null}
        <input type="file" ref={dirRef} hidden multiple {...({ webkitdirectory: '' } as any)} onChange={e => chooseDir(e.target.files)} /></> : null}
      <button className="btn sm" id="rdKho" onClick={() => openKho()}>Kho phiếu</button>
      <button className="btn sm" id="rdTl" title="Nạp Kiến thức, Trình tự / TF, khóa AI" onClick={() => openThietLap('gt')}>⚙ Thiết lập</button>
      <button className="btn sm ghost" id="rdClose" aria-label="Đóng màn Ra đề" onClick={() => setTb({ rade: false })}>✕</button>
    </div>
    {err ? <p className="tbwarn">{err}</p> : null}
    {src && (src.loi.length || src.canhBao.length) ? <details className="rdnotes"><summary>{src.loi.length ? `${src.loi.length} lỗi` : ''}{src.loi.length && src.canhBao.length ? ' · ' : ''}{src.canhBao.length ? `${src.canhBao.length} cảnh báo` : ''} khi đọc dữ liệu giáo trình</summary><ul>{[...src.loi, ...src.canhBao].map((n, i) => <li key={i}>{note(n)}</li>)}</ul></details> : null}

    <section className={'rdpick' + (min ? ' min' : '')} id="rdPick">
      <button className="rdpickh" id="rdPickH" aria-expanded={!min} onClick={() => setMin(!min)}><b>Chọn bài</b>
        {min && les ? <span className="rdcrumb" id="rdCrumb">{les.giaoTrinh.ten} › {les.unit.ten} › {les.lesson.ten} <span className="tag">{les.chuyenDe.ten}</span></span> : null}
        <span className="sp" /><span className="tbmut">{min ? '▾ Mở' : '▴ Thu gọn'}</span></button>
      {min ? null : <div className="rdcols">
        <div className="rdcol" id="rdGt"><h5>Giáo trình</h5>{src?.giaoTrinh.map(g => <button key={g.id} className={g.id === sel.gt ? 'on' : ''} onClick={() => pick({ gt: g.id, unit: g.units[0]?.id || '', ls: '' })}>{g.ten}</button>)}</div>
        <div className="rdcol" id="rdUnit"><h5>Unit</h5>{gt?.units.map(u => <button key={u.id} className={u.id === sel.unit ? 'on' : ''} onClick={() => pick({ unit: u.id, ls: '' })}>{u.ten}</button>)}</div>
        <div className="rdcol" id="rdLs"><h5>Lesson</h5>{unit?.lessons.map(l => <button key={l.id} data-ls={l.id} className={l.id === sel.ls ? 'on' : ''} onClick={() => pick({ ls: l.id })}><span>{l.ten}</span><span className="tag">{gt?.chuyenDe.find(c => c.id === l.chuyenDe)?.ten || l.chuyenDe || '?'}</span></button>)}</div>
        <div className="rdcol info" id="rdInfo"><h5>{les ? les.lesson.ten : 'Lesson'}</h5>
          {les ? <>{les.kienThuc?.mucTieu ? <p className="rdgoal"><b>Mục tiêu:</b> {les.kienThuc.mucTieu}</p> : <p className="tbmut">Kiến thức chưa có mục tiêu.</p>}
            <h5>Phiếu đã tạo</h5>{les.phieu.length ? <ul className="rdph">{les.phieu.map(p => <li key={p.id}><span>{fmtDay(p.at)} · {p.n} bài</span><button className="btn sm" onClick={() => moPhieu(src!, les, p.id)}>Mở</button></li>)}</ul>
              : <p className="tbmut">{src?.mode === 'may-chu' ? 'Chưa có.' : 'Chỉ lưu khi mở app qua máy chủ (npm run lop → /editor).'}</p>}</> : <p className="tbmut">Chọn một lesson.</p>}
        </div>
      </div>}
    </section>

    {les && les.loi.length ? <div className="tbwarn rdloi" id="rdLoi"><b>Chưa tạo bài được cho lesson này:</b><ul>{les.loi.map((n, i) => <li key={i}>{note(n)}</li>)}</ul>
      <button className="btn sm" id="rdLoiTl" onClick={() => openThietLap(les.loi.some(n => /kien-thuc\//.test(n.file)) ? 'gt' : 'dang')}>Mở Thiết lập để nạp file</button></div> : null}
    {les && !les.loi.length && les.trinhTu ? <div className="rdmain">
      <section className="rdst" id="rdStruct">
        <div className="rdsth"><div><h3>Cấu trúc bài</h3><p className="tbmut">Đề xuất ban đầu theo Trình tự <b>{les.chuyenDe.ten} v{les.trinhTu.ver}</b> · TF v{les.tf?.ver}. Sau đó bạn tự quyết: đổi dạng, đổi số câu, thêm / xóa bài, thêm bài tự do; AI viết theo đúng cấu trúc bạn chọn.</p></div>
          <button className="btn" id="rdReroll" title="Chọn lại toàn bộ dạng bài và số câu" onClick={() => edit(P.propose(steps, lastQs(les)))}>⟳ Đề xuất lại</button></div>
        <div className="rdsteps">{stepsX.map((b, si) => { const ts = plan[si] || [], k0 = P.flat(plan).findIndex(x => x.si === si), tuDo = b.so === 0;
          return <div className={'rdstep' + (ts.length ? '' : ' empty') + (tuDo ? ' free' : '')} key={b.so} data-step={si}>
            <div className="rdsh"><b>{tuDo ? 'Bài tự do' : `Bước ${b.so} · ${b.ten}`}</b>{tuDo ? <span className="tbmut">· không thuộc bước nào của Trình tự, nằm cuối phiếu</span> : b.chiTiet ? <span className="tbmut">· {b.chiTiet}</span> : null}<span className="sp" />
              <button className="btn sm rdplus" data-add={si} title={tuDo ? 'Thêm bài tự do' : 'Thêm bài vào bước này'} onClick={() => edit(P.add(plan, steps, si))}>+</button></div>
            {!ts.length ? <div className="rdskip">{tuDo ? 'Chưa có bài tự do · bấm + để thêm' : 'Bỏ qua bước này · bấm + để thêm bài'}</div> : null}
            {ts.map((t, ti) => <div className="rdrow" key={ti} data-row={`${si}.${ti}`}><span className="rdn">{k0 + ti + 1}</span>
              <select value={t.q} aria-label="Dạng câu hỏi" onChange={e => edit(P.setQ(plan, si, ti, e.target.value as QCode))}>
                {tuDo ? P.ALL_Q.map(q => <option key={q} value={q}>{q} {Q_NAME[q]}</option>) : <>
                  <optgroup label="Theo Trình tự">{b.q.map(q => <option key={q} value={q}>{q} {Q_NAME[q]}</option>)}</optgroup>
                  <optgroup label="Dạng khác">{P.ALL_Q.filter(q => !b.q.includes(q)).map(q => <option key={q} value={q}>{q} {Q_NAME[q]}</option>)}</optgroup></>}
              </select>
              <span className="rdcnt"><button className="btn sm" data-dn="-1" aria-label="Bớt" disabled={t.n <= 1} onClick={() => edit(P.setN(plan, steps, si, ti, -1))}>−</button>
                <input className="rdnum" type="number" min={1} max={P.MAX_N} aria-label={`Số ${qUnit(t.q)}`} value={t.n} onChange={e => { const v = parseInt(e.target.value, 10); if (v >= 1) edit(P.setNTo(plan, si, ti, v)); }} /><span className="rdnv">{qUnit(t.q)}</span>
                <button className="btn sm" data-dn="1" aria-label="Thêm" disabled={t.n >= P.MAX_N} onClick={() => edit(P.setN(plan, steps, si, ti, 1))}>+</button></span>
              {!tuDo && b.min > 0 ? <span className="tbmut" title="Gợi ý của Trình tự, không bắt buộc">gợi ý {b.min === b.max ? b.min : `${b.min}–${b.max}`}</span> : null}<span className="sp" />
              <button className="btn sm ghost" data-rr="1" title="Đổi dạng ngẫu nhiên" onClick={() => edit(P.reroll(plan, steps, si, ti))}>⟳</button>
              <button className="btn sm ghost" data-del="1" title="Xóa bài" onClick={() => edit(P.del(plan, steps, si, ti))}>✕</button>
              <input className="rdyc" type="text" aria-label="Yêu cầu riêng cho bài này" placeholder={tuDo ? 'Bạn muốn bài này viết về gì? (vd: đọc đoạn văn về gia đình, 60 từ)' : 'Yêu cầu riêng cho bài này (không bắt buộc)'} value={t.yc || ''} onChange={e => edit(P.setYc(plan, si, ti, e.target.value))} /></div>)}
          </div>; })}</div>
        {P.sameAdj(plan).length ? <p className="tbmut" id="rdAdj">Bài {P.sameAdj(plan).join(', ')} cùng dạng với bài liền trước (vẫn sinh được).</p> : null}
        <textarea className="tbta" id="rdNote" rows={2} placeholder="Ghi chú cho AI (không bắt buộc): vd chủ đề cắm trại, lớp yếu" value={ghiChu} onChange={e => setGhiChu(e.target.value)} />
        <button className="btn pri rdgo" id="rdGo" disabled={!nb} onClick={sinh}>Duyệt cấu trúc · Sinh bài →</button>
        {back && w0.gen.src.lesson === sel.ls && w0.gen.src.course === sel.gt ? <button className="btn ghost" id="rdAll" disabled={!nb} title="Mọi bài thành khung mới, kể cả bài không đổi" onClick={() => sinhLaiCaPhieu(les, plan, ghiChu)}>Sinh lại cả phiếu…</button> : null}
      </section>
      <section className="rdpv" id="rdPv">
        <div className="rdpvh"><b>Layout sơ bộ</b><span className="sp" /><span id="rdPvInfo">{nb} bài · <span>ước tính {nP} trang</span></span></div>
        <div className="rdpages">{pv && pv.pages.map((h: string, i: number) => <div className="rdpg" key={i}><div className="rdpgs"><div className="page paper"><div className="flow" dangerouslySetInnerHTML={{ __html: h }} /></div></div><span className="pno">{i + 1}</span></div>)}</div>
        <p className="tbmut">Ước tính theo dạng bài và số câu (chữ giả "xxx"); chữ thật dài ngắn khác nhau nên số trang có thể lệch.</p>
      </section>
    </div> : null}
  </div>;
}

const fmtDay = (iso: string) => { if (!iso) return '?'; const d = new Date(iso), p = (n: number) => String(n).padStart(2, '0'); return `${p(d.getDate())}/${p(d.getMonth() + 1)} ${p(d.getHours())}:${p(d.getMinutes())}`; };
/** Dạng Q theo bước của phiếu gần nhất cùng lesson (ưu tiên khác đi). Phiếu đang mở cùng lesson cũng tính. */
function lastQs(l: Lesson): QCode[][] {
  const w = St.ws as any, st = w && hasGen(w) && w.gen.src?.lesson === l.lesson.id ? w.gen.structure || [] : [];
  return (l.trinhTu?.buoc || []).map(b => st.filter((x: any) => x.step === b.so).map((x: any) => x.q));
}
async function moPhieu(src: Nguon, l: Lesson, id: string) {
  if (!src.moPhieu) return; const w = await src.moPhieu(l.giaoTrinh.id, l.lesson.id, id); if (!w) { toast('Không mở được phiếu'); return; }
  if (!(await askConfirm('Mở phiếu đã tạo?', 'Phiếu đang mở trong editor sẽ được thay.', 'Mở phiếu'))) return;
  if (L.loadSheet(w, 'Đã mở phiếu đã tạo')) setTb({ rade: false });
}

// ---------- Sinh bài (T3: phiếu khung) ----------
function frameTasks(l: Lesson, plan: P.Plan) {
  const md = P.fakeSheetMd(plan, l.trinhTu!, l.tf, 'x', l.giaoTrinh.tuoi || '7-9');
  const ts = impSheetObj(readMd(md)).tasks as any[], st = P.toStructure(plan, l.trinhTu!.buoc);
  ts.forEach((t, k) => { t.gen = { step: st[k].step, role: st[k].role, q: st[k].q, n: st[k].n, ...(st[k].yc ? { yc: st[k].yc } : {}), status: 'wait', checks: [], history: [] }; });
  return { ts, st };
}
function genOf(l: Lesson, st: any[], note: string, old?: any) {
  const ver = { kienThuc: l.kienThuc?.ver || '', trinhTu: l.trinhTu?.ver || '', tf: l.tf?.ver || '', chung: Object.fromEntries(l.chung.filter(c => c.raw != null).map(c => [String(c.so), c.ver])) };
  return { v: 1, src: { course: l.giaoTrinh.id, unit: l.unit.id, lesson: l.lesson.id, topic: l.chuyenDe.id, names: { course: l.giaoTrinh.ten, unit: l.unit.ten, lesson: l.lesson.ten, topic: l.chuyenDe.ten }, ver },
    structure: st, note, sheetChecks: old?.sheetChecks || [], history: old?.history || [] };
}
/** Ghép cấu trúc mới vào phiếu cũ: bài cùng bước + Q + số câu giữ nguyên (kể cả đã sửa, đã duyệt); còn lại là khung mới. */
export function merge(oldTasks: any[], fresh: any[], st: any[]) {
  const used = new Set<any>(); let kept = 0;
  const out = st.map((x, k) => { const o = oldTasks.find(t => !used.has(t) && t.gen && t.gen.step === x.step && t.gen.q === x.q && t.gen.n === x.n && (t.gen.yc || '') === (x.yc || '')); if (o) { used.add(o); kept++; return o; } return fresh[k]; });
  return { tasks: out, kept, dropped: oldTasks.filter(t => t.gen && !used.has(t)).length };
}
export async function sinhBai(l: Lesson, plan: P.Plan, note: string) {
  const w = St.ws as any, { ts, st } = frameTasks(l, plan);
  const same = w && hasGen(w) && w.gen.src?.course === l.giaoTrinh.id && w.gen.src?.lesson === l.lesson.id;
  if (same) {
    const m = merge(w.tasks, ts, st), all = m.kept === 0 ? true : await askConfirm('Sinh bài theo cấu trúc mới?', `${m.kept} bài không đổi được giữ nguyên (kể cả đã sửa / đã duyệt); ${st.length - m.kept} bài đổi hoặc mới sẽ được sinh${m.dropped ? `; ${m.dropped} bài bị bỏ khỏi phiếu (bản đã duyệt vẫn trong Lịch sử phiếu)` : ''}.`, 'Sinh bài');
    if (!all) return;
    L.commit((w2: any) => { const ids = new Set(w2.tasks.map((t: any) => t.id)); const out = m.tasks.map(t => { if (!ids.has(t.id) || ts.includes(t)) { const c = JSON.parse(JSON.stringify(t)); let i = 1; while (ids.has('t' + i)) i++; c.id = 't' + i; ids.add(c.id); return c; } return w2.tasks.find((x: any) => x.id === t.id); });
      w2.tasks = out; w2.gen = genOf(l, st, note, w2.gen); }, `Đã cập nhật cấu trúc: giữ ${m.kept} bài, ${st.length - m.kept} bài chờ sinh`);
    setTb({ rade: false }); batDau(openReview); return;
  }
  if (w && (w.tasks || []).length && !(await askConfirm('Tạo phiếu mới từ cấu trúc này?', 'Phiếu đang mở trong editor sẽ được thay (giống “+ Phiếu”).', 'Tạo phiếu'))) return;
  const sheet = { title: `${l.unit.ten} · ${l.lesson.ten}`, age: l.giaoTrinh.tuoi || '7-9', tasks: ts, gen: genOf(l, st, note) };
  if (L.loadSheet(sheet, `Đã tạo phiếu khung ${st.length} bài: chờ sinh nội dung`)) { setTb({ rade: false, panel: null, cur: null }); batDau(openReview); }
}
/** Nút "Sinh lại cả phiếu" (5.6): mọi bài thành khung mới. */
export async function sinhLaiCaPhieu(l: Lesson, plan: P.Plan, note: string) {
  if (!(await askConfirm('Sinh lại cả phiếu?', 'Mọi bài thành khung mới (bản đã duyệt vẫn trong Lịch sử phiếu).', 'Sinh lại cả phiếu'))) return;
  const { ts, st } = frameTasks(l, plan);
  L.commit((w2: any) => { w2.tasks = ts; w2.gen = genOf(l, st, note, w2.gen); }, 'Đã dựng lại khung cả phiếu');
  setTb({ rade: false }); batDau(openReview);
}

// cầu cho test (tests/taobai/test_t3.py): luật cấu trúc + layout sơ bộ của một cấu trúc bất kỳ trên bộ mẫu
(window as any).__tbTest = { P, nguonMau, preview(plan: P.Plan, gt: string, ls: string) { const n = nguonMau(); return n.lesson(gt, ls).then(l => { if (!l || !l.trinhTu) return null; const md = P.fakeSheetMd(plan, l.trinhTu, l.tf); return { md, pv: L.previewPages(impSheetObj(readMd(md))), steps: l.trinhTu.buoc }; }); } };
