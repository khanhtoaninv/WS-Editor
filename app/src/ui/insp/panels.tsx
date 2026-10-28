// Inspector (cột phải): các panel theo container đang chọn. Chuyển nguyên văn từ legacy/app.js v106 (taskPanel,
// framePanel, cimgPanel, crowPanel, answerPanel, bankPanel, gtPanel, headPanel, sheetPanel, leadPanel) — kể cả các bản
// vá chồng của v81–v85 (nút mặc định theo dạng, panel Câu hỏi, ảnh thứ hai, khung từ ảnh, bài đọc) đã gộp vào một chỗ.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { L } from '../legacyApi';
import * as Lay from '../../core/layout.js';
import * as Mod from '../../core/model.js';
import * as Md from '../../core/md.js';
import * as St from '../../core/state.js';
import { Fragment } from 'react';
import { Cd, type N, autoSec, crumb, diagBox, diagFor, fNum, fRange, fSeg, fld, has, imgCtl, isSet, numRow, panel, presetSeg, qOpts, qPicker, s, sec, tPicker } from './parts';
const { A2MM, FSZ, IW8, imgRowN, T7CW, TA, TBL_DEF, TBL_ROW_MM, a2cfg, a4autoDef, cellCfg, cellDirOf, colsDefault, colsOf, colsRange, fitOf, fontPt, frOf, frameH, g1bFr, gtKeys, gtN, inheritedSpacing, isColI, layoutOf, qOf, ratioOf, rmeta, sheetSpacing, sizeKey, spacingOf, taOf, tblOpts } = Lay as any;
const { AGE, FONTS, GT_SIZE, PRESETS, QN, SIZES, ck, its } = Mod as any;
const { PRESET_NAME } = Md as any;
const W = (): any => St.ws;   // phiếu đang mở (đọc mỗi lần: setWs thay cả đối tượng)

const E = Object.entries;
const splitFmt = (r: any) => `${r} / ${100 - r}`;
const pct = (x: any) => x + '%';

// Phần đầu (đường dẫn + tiêu đề) và phần thân của panel Task, để panel Bài đọc dùng lại phần thân
function taskParts(t: any, sl: any) {
  const Lt = layoutOf(t), lay = t.layout, m = rmeta(t, Lt), cr = colsRange(t, Lt), sp = spacingOf(t), inh = inheritedSpacing(t), wbR = t.wordBank && t.wordBank.placement === 'right', row = cellDirOf(t) === 'row';
  const size: N[] = [], align: N[] = [], content: N[] = [];
  if (ratioOf(t) != null && !row) size.push(fRange('split', Lt === 'T6' ? 'Tỉ lệ nội dung / khung từ' : Lt === 'T4' ? 'Tỉ lệ câu hỏi / đáp án' : 'Tỉ lệ ảnh / nội dung', lay.split, { min: m.range[0], max: m.range[1], step: 5, def: m.ratio, fmt: splitFmt, fmtKey: 'split' }));
  if (Lt === 'T7') { ['Cột trái', 'Cột nối', 'Cột phải'].forEach((n, i) => { size.push(fNum('cw.' + i, n, lay.cw ? lay.cw[i] : null, { min: 10, max: 80, step: 5, unit: '%', def: T7CW[i] })); }); size.push(fNum('rowH', 'Chiều cao hàng', lay.rowH, { min: 8, max: 40, unit: 'mm', def: 'tự động' })); }
  if (cr) { const opts = []; for (let c = cr[0]; c <= cr[1]; c++) opts.push([c, c]); size.push(fSeg('cols', 'Số cột', lay.cols, opts, Math.min(cr[1], Math.max(cr[0], colsDefault(t, Lt))))); }
  if (imgRowN(t)) size.push(fRange('@imgPct', 'Kích thước ảnh (cả khối)', lay.imgPct, { min: 50, max: 150, step: 5, def: 100, fmt: pct, fmtKey: 'zoom' }),
    fSeg('@imgFit', 'Vừa ô', lay.imgFit ? true : false, [[false, 'Theo số ảnh trên hàng'], [true, 'Fit ô']], false, { hint: `Mặc định ${imgRowN(t)} ảnh trên hàng: rộng ${(Lay as any).IMW[imgRowN(t)] ?? Math.round(182 / imgRowN(t) - 6)} mm. Fit ô: ảnh và dòng viết khít bề ngang ô. Ảnh chỉnh độ rộng riêng thì giữ nguyên.` }));   // v115
  if (Lt === 'T5' && !row && colsOf(t) > 1) size.push(fNum('colGap', 'Khoảng cách giữa các cột', lay.colGap, { min: 2, max: 20, unit: 'mm', def: sp.itemGap }));
  if (Lt === 'T6' && !wbR) size.push(fNum('width', 'Độ rộng khối nội dung', lay.width, { min: 40, max: 100, step: 5, unit: '%', def: 100 }));
  if (ck(t) === 'dialogue') size.push(fNum('whoW', 'Cột tên người nói', lay.whoW, { min: 6, max: 40, unit: 'mm', def: 'tự động' }));
  if (Lt === 'T9') size.push(tblOpts(t).cross ? fNum('tbl.xc', 'Cỡ ô', (t.layout.table || {}).xc, { min: 6, max: 16, step: 1, unit: 'mm', def: 10 }) : tblSize(t));
  size.push(<h4 key="kc">Khoảng cách</h4>, <div key="sp" className={`fld s ${t.spacing.preset ? 'ov' : ''}`} data-param="sp.preset"><span className="fl">Mức khoảng cách</span><span className="fc">{presetSeg(t.spacing.preset, 'task-preset', true)}</span><button className="rst" data-act="task-preset" data-v="" hidden={!t.spacing.preset} title="Về theo phiếu" aria-label="Về tự động">↺</button></div>,
    ...Object.keys(L.SP_LABEL).map(k => numRow('task', k, sp[k], inh[k], k in t.spacing.overrides)));
  if (Lt === 'T5' && !row) align.push(fSeg('align', 'Căn nội dung trong ô', lay.align, E(L.HA), 'left'));
  if (Lt === 'T6' && !wbR) align.push(fSeg('align', 'Vị trí khối nội dung', lay.align, E(L.HA), 'left', { hint: lay.width ? '' : 'Có tác dụng khi độ rộng nhỏ hơn 100%.' }));
  if (['T2', 'T3', 'T4', 'T7'].includes(Lt) || (Lt === 'T6' && wbR) || row) align.push(fSeg('valign', row ? 'Căn dọc các hàng (mặc định cho mọi ô)' : 'Căn dọc các cột', lay.valign, E(L.VA), ['T4', 'T7'].includes(Lt) || row ? 'center' : 'top'));
  align.push(fSeg('@ta', 'Căn lề Khối text', taOf(t), TA, 'left', { hint: 'Áp cho hướng dẫn, bài đọc / lời dẫn và khối tự do chữ (khối nào chỉnh riêng thì theo khối đó). Có mã QR file nghe thì lề phải của hướng dẫn là mép trái mã QR.' }));   // v97
  if (Lt === 'T9') align.push(tblOpts(t).cross ? fSeg('tbl.align', 'Vị trí ô chữ', (lay.table || {}).align, E(L.HA), 'center') : fSeg('tbl.align', 'Căn lề nội dung ô', (lay.table || {}).align, E(L.HA), 'left'));
  if (Lt === 'T1' && ck(t) === 'empty') align.push(<p key="na" className="hint" data-na="align">Bài chỉ có ảnh: căn lề nằm ở ảnh.</p>);
  if (Lt === 'T5' && t.content.variant !== 'multi') content.push(fSeg('dir', 'Hướng ô (ảnh so với chữ)', lay.dir, [['col', 'Ảnh trên'], ['row', 'Ảnh trái']], L.dirDefault(t)));
  if (Lt === 'T9') content.push(tblKind(t), !tblOpts(t).cross && (t.content.rows || []).some((r: any) => r.cells.some((v: any) => v && (v.ans != null || v.ok))) ? fSeg('tbl.key', 'Hiện đáp án (bản giáo viên)', (t.layout.table || {}).key, [[true, 'Hiện'], [false, 'Ẩn']], false, { hint: 'Ẩn: ô "=…" in trống, ô tích để trống cho học sinh. Hiện: in chữ đáp án vào ô, ô tích đúng có ✓ và tô nền.' }) : null,
    tblOpts(t).cross ? fSeg('tbl.key', 'Hiện đáp án (bản giáo viên)', (t.layout.table || {}).key, [[true, 'Hiện'], [false, 'Ẩn']], false, { hint: 'Ẩn: học sinh thấy ô trống. Hiện: in chữ đáp án vào ô để làm bản đáp án.' }) : tblStyle(t));
  if (L.cellImgMode(t)) content.push(<p key="ci" className="hint">Mỗi ảnh là một container: bấm vào ảnh trên trang để chỉnh riêng.</p>);
  if (its(t).length > 1 && !['table', 'empty'].includes(ck(t))) content.push(fSeg('@num', 'Số câu ở lề', lay.num, [['on', 'Hiện'], ['off', 'Ẩn']], 'on', { hint: 'Ẩn khi học sinh phải tự điền số vào chỗ trống (bài xếp thứ tự), để số ở lề khỏi lẫn với số phải điền.' }));
  if (its(t).length > 1 && lay.num !== 'off' && !['table', 'empty'].includes(ck(t))) content.push(fSeg('@nlab', 'Kiểu số câu', lay.nlab, [['n', '1 2 3'], ['a', 'a b c']], 'n', { hint: 'Chữ a, b, c khi phiếu gốc đánh a–h (vd bài nối từ với nghĩa).' }));
  if (ck(t) === 'pairs') content.push(fSeg('@mbd', 'Viền hai vế', lay.mbd, [['off', 'Không'], ['on', 'Có']], 'off', { hint: 'Khung viền quanh chữ của vế trái và vế phải (bật / tắt cùng lúc).' }));   // v103
  const brk = fSeg('break', 'Trước và sau Task này', lay.break, [['auto', 'Tự động'], ['page', 'Sang trang mới'], ['keep', 'Giữ liền Task sau'], ['join', 'Nối vào Task trên', W().tasks[0] === t ? 'Task đầu phiếu không nối được' : '']], 'auto', { hint: lay.break === 'join' ? 'Phần tiếp của Task trên: không số, không tiêu đề (chỉ giữ hướng dẫn riêng nếu có), luôn đi liền Task trên, cách trên bằng khoảng cách giữa các nhóm. Mỗi phần giữ đáp án riêng.' : '' });
  // Nút lưu / áp mặc định theo dạng (mục Về tự động, chỉ khi có chỉnh tay)
  const label = L.taskLabel(t), pre = <><button className="btn" data-act="preset-save">{`Lưu làm mặc định cho dạng ${label}`}</button>{L.presetsGet()[L.presetKey(t)] ? <button className="btn" data-act="preset-apply">{`Áp mặc định đã lưu của dạng ${label}`}</button> : null}</>;
  const top = <>{tPicker(t)}{qPicker(t)}{qOpts(t)}</>;
  return { head: <>{crumb(t, sl)}<h2>{`Task ${t.number} · ${label} `}<Cd c={t.typeId} /></h2></>,
    body: <>{diagFor(t)}{top}{sec('size', 'Kích thước', size)}{sec('align', 'Căn lề', align)}{sec('content', 'Kiểu trình bày', content)}{sec('break', 'Ngắt trang', brk)}{sec('auto', 'Về tự động', autoSecTask(t, sl, pre))}</> };
}
const autoSecTask = (t: any, sl: any, pre: N) => autoSec(t, sl, null, pre);
function taskPanel(t: any, sl: any) { const p = taskParts(t, sl); return <>{p.head}{p.body}</>; }

function tblSize(t: any) {
  const o = tblOpts(t), u = t.layout.table || {}, nC = t.content.cols.length, tot = nC + (o.rowHead ? 1 : 0), cur = L.tblColPct(t), cwOn = Array.isArray(u.cw) && u.cw.length === tot;
  const h: N[] = [fSeg('tbl.cols', 'Độ rộng cột', cwOn ? null : u.cols, [['equal', 'Đều'], ['first', 'Cột đầu rộng'], ['auto', 'Theo nội dung']], 'first', { hint: cwOn ? 'Đang chỉnh tay từng cột (bên dưới). Bấm một mức để về tự động.' : '' })];
  if (o.rowHead && !cwOn && o.cols === 'first') h.push(fRange('tbl.first', 'Độ rộng cột đầu', u.first, { min: 15, max: 60, step: 1, def: TBL_DEF.first, fmt: pct }));
  h.push(<h4 key="tc">Từng cột (%)</h4>, ...cur.map((x: number, i: number) => fNum('tbl.cw.' + i, i === 0 && o.rowHead ? 'Cột đầu' : `Cột ${o.rowHead ? i : i + 1}`, cwOn ? u.cw[i] : null, { min: 5, max: 90, step: 1, unit: '%', def: Math.round(x) })));
  h.push(fSeg('tbl.rows', 'Chiều cao hàng', u.rows, [['auto', 'Theo nội dung'], ['equal', 'Đều nhau']], 'auto'), fNum('tbl.minH', 'Chiều cao hàng tối thiểu', u.minH, { min: 0, max: 60, unit: 'mm', def: TBL_ROW_MM }));
  const keys = [...(o.head ? ['h'] : []), ...t.content.rows.map((_: any, i: number) => String(i))], rhs = u.rhs || {};
  h.push(<details key="rh" open={Object.keys(rhs).length ? true : undefined}><summary>{`Từng hàng (mm) · ${keys.length} hàng`}</summary>{keys.map(k => fNum('tbl.rhs.' + k, k === 'h' ? 'Hàng tiêu đề' : `Hàng ${+k + 1}`, rhs[k], { min: 6, max: 80, unit: 'mm', def: u.minH ?? TBL_ROW_MM }))}</details>);
  return h;
}
function tblKind(t: any) { return fSeg('tbl.cross', 'Kiểu bảng', (t.layout.table || {}).cross, [[false, 'Bảng thường'], [true, 'Ô chữ giải đố']], false, { hint: 'Ô chữ giải đố: chỉ ô có chữ mới có viền xám, không có ô đen; số 1, 2, 3 tự đánh.' }); }
function tblStyle(t: any) {
  const u = t.layout.table || {}, o = tblOpts(t), B = [[true, 'Bật'], [false, 'Tắt']];
  return [fSeg('tbl.head', 'Hàng tiêu đề cột', u.head, B, true), fSeg('tbl.rowHead', 'Cột tiêu đề hàng (cột đầu)', u.rowHead, B, true),
    fSeg('tbl.nm', 'Số thứ tự', o.nm, [['out', 'Ngoài bảng'], ['in', 'Trong cột đầu'], ['off', 'Tắt']], 'out'),
    fSeg('tbl.lines', 'Đường kẻ', u.lines, [['all', 'Đầy đủ'], ['h', 'Chỉ ngang'], ['none', 'Không']], 'all'),
    fSeg('tbl.fh', 'Tô nền hàng tiêu đề', u.fh, B, true), fSeg('tbl.fc', 'Tô nền cột đầu', u.fc, B, false),
    fSeg('tbl.fr', 'Tô nền các hàng nội dung', o.fc ? 'none' : u.fr, [['none', 'Không'], ['zebra', 'Xen kẽ', o.fc ? 'Đã tô cột đầu nên không tô các hàng' : '']], 'none'),
    fSeg('tbl.split', 'Cho phép cắt bảng giữa các hàng', u.split, B, true), o.split ? fSeg('tbl.repeat', 'Lặp hàng tiêu đề ở trang sau', u.repeat, B, true) : null];
}
function marksCtl(t: any) {
  if (!t.image) return null;
  const im = t.image, ms = im.marks || [], mk = im.mk || {}, on = L.markMode;
  const seg = (act: string, cur: string, opts: string[][]) => <span className="seg">{opts.map(([v, n]) => <button key={v} data-act={act} data-v={v} className={cur === v ? 'on' : ''}>{n}</button>)}</span>;
  return <><h3>Điểm trên ảnh</h3><div className="stack"><button className={`btn ${on ? 'pri' : ''}`} data-act="mkmode">{on ? 'Đang đặt điểm: bấm vào ảnh' : 'Đặt điểm'}</button>{ms.length ? <button className="btn" data-act="mkclear">Xóa hết</button> : null}</div>
    <div className="field"><span>Hình</span>{seg('mkshape', mk.shape === 'square' ? 'square' : 'circle', [['circle', 'Tròn'], ['square', 'Vuông']])}</div>
    <div className="field"><span>Bên trong</span>{seg('mklabel', mk.label === 'none' ? 'none' : 'num', [['num', 'Số 1, 2, 3'], ['none', 'Ô trống']])}</div>
    <p className="hint">{ms.length ? `${ms.length} điểm. Số điểm n ứng với câu n. Kéo điểm trên ảnh để dời, hoặc bấm số bên dưới để xóa.` : 'Bấm "Đặt điểm" rồi bấm vào ảnh trên trang. Vị trí tính theo ảnh; nếu đổi sang Fit, kiểm tra điểm còn nằm trong khung.'}</p>
    {ms.length ? <div className="mkchips">{ms.map((_: any, i: number) => <button key={i} className="btn" data-act="mkdel" data-v={s(i)} title={`Xóa điểm ${i + 1}`}>{`${i + 1} ✕`}</button>)}</div> : null}</>;
}
const zoomR = (p: string, label: string, v: any) => fRange(p, label, v, { min: 50, max: 300, step: 5, def: 100, fmt: pct, fmtKey: 'zoom' });
const centerBtn = (fr: any) => <button key="ctr" className="btn" data-act="center" disabled={fr.ox || fr.oy || fr.zoom ? undefined : true}>Đưa ảnh về giữa khung</button>;
function framePanel(t: any, sl: any) {
  const Lt = layoutOf(t), fr = frOf(t), f = fitOf(t);
  const size: N[] = [], align: N[] = [], content: N[] = [];
  if (!f && Lt !== 'T8') size.push(fRange('frame.scale', 'Kích thước ảnh (khóa tỉ lệ)', fr.scale, { min: 40, max: 100, step: 5, def: 100, fmt: pct }));
  if (!(f === 'height' && isColI(t))) size.push(fNum('frame.h', 'Chiều cao khung', fr.h, { min: 25, max: 150, step: 5, unit: 'mm', def: f ? (frameH(t) || 'theo ảnh') : 'theo ảnh' }));
  else size.push(<p key="fd" className="hint">Fit dọc: khung cao theo cột nội dung bên cạnh.</p>);
  if (Lt === 'T8') size.push(fNum('frame.w', 'Chiều rộng khung', fr.w, { min: IW8[0], max: IW8[1], step: 5, unit: '% bài đọc', def: IW8[2] }));
  if (Lt === 'T1' || Lt === 'T4') align.push(fSeg('frame.align', 'Căn ngang', fr.align, E(L.HA), Lt === 'T1' ? 'center' : 'left', { hint: Lt === 'T1' ? 'Trái: ảnh thẳng đường dóng của tiêu đề.' : '' }));
  if (Lt === 'T8') align.push(fSeg('frame.align', 'Căn ngang (chữ bao phía còn lại)', fr.align, [['left', 'Trái'], ['right', 'Phải']], 'right'));
  if (isColI(t)) align.push(fSeg('frame.valign', 'Căn dọc so với nội dung', fr.valign, E(L.VA), 'top'));
  content.push(fSeg('frame.fit', 'Hiển thị ảnh trong khung', fr.fit, [['normal', 'Bình thường'], ['width', 'Fit ngang'], ['height', 'Fit dọc']], 'normal', { hint: 'Fit ngang: ngang ảnh bằng ngang khung. Fit dọc: cao ảnh bằng cao khung. Tâm ảnh trùng tâm khung, phần thừa bị cắt. Fit không phóng to khung.' }));
  if (f) content.push(zoomR('frame.zoom', 'Zoom ảnh', fr.zoom), centerBtn(fr));
  content.push(imgCtl(t, 'G1'), marksCtl(t), <p key="kh" className="hint">{`Khung chính là ảnh: kéo cạnh dưới khung trên trang để đổi chiều cao, ảnh đi theo khung.${f ? ' Kéo chấm tâm để dời góc nhìn.' : ''}`}</p>);
  // v85: ảnh thứ hai (mục riêng, đứng trước "Về tự động")
  const two = !!(t.image && t.image.two), ok = ['questions', 'passage', 'empty'].includes(ck(t)), f2 = two ? g1bFr(t) : {};
  const fit2 = two ? <>{fSeg('@cells.G1b.frame.fit', 'Hiển thị ảnh thứ hai', f2.fit, [['', 'Như ảnh 1'], ['normal', 'Bình thường'], ['width', 'Fit ngang'], ['height', 'Fit dọc']], '', { hint: 'Kích thước và căn lề đi theo khung ảnh chung.' })}{f2.fit && f2.fit !== 'normal' ? zoomR('@cells.G1b.frame.zoom', 'Zoom ảnh thứ hai', f2.zoom) : null}</> : null;
  const add = <section className="psec" data-sec="two"><h3>Ảnh thứ hai</h3>{two ? <>{fit2}{imgCtl(t, 'G1b', true)}<div className="stack"><button className="btn" data-act="blkdel" data-v="G1b">Xóa ảnh thứ hai</button></div></> : <div className="stack"><button className="btn" data-act="blkadd" data-v="G1b" disabled={ok ? undefined : true} title={ok ? undefined : 'Hai ảnh dùng cho bài có câu hỏi / bài đọc'}>+ Thêm ảnh thứ hai</button></div>}<p className="hint">Hai ảnh đứng cạnh nhau, cùng cỡ.</p></section>;
  const au = sec('auto', 'Về tự động', autoSec(t, sl));   // bản cũ chèn mục này ngay trước "Về tự động": không có mục đó thì không có
  return <>{crumb(t, sl)}<h2>Ảnh <Cd c="G1" /></h2>{sec('size', 'Kích thước', size)}{sec('align', 'Căn lề', align)}{sec('content', 'Hiển thị ảnh', content)}{au ? add : null}{au}</>;
}
function cimgPanel(t: any, sl: any, all: boolean) {
  const keys = L.cellKeys(t, 'cimg'), key = all ? keys[0] : sl.item, cc = cellCfg(t, key), fr = cc.frame || {}, row = cellDirOf(t) === 'row', f = fr.fit;
  const size: N[] = [fNum('frame.h', 'Chiều cao khung', fr.h, { min: 15, max: 150, step: 5, unit: 'mm', def: f === 'height' ? 35 : 'theo ảnh' })], content: N[] = [];
  if (!row) size.push(fNum('frame.w', 'Độ rộng ảnh', fr.w, { min: 20, max: 100, step: 5, unit: '% ô', def: 'tự động' }));   // v84: mặc định = cỡ hiện tại (rộng hết ô, tối đa 34 mm)
  if (row) size.push(fRange('split', 'Tỉ lệ hàng (ảnh / chữ)', cc.split, { min: 15, max: 50, step: 5, def: 25, fmt: splitFmt, fmtKey: 'split' }));
  const align = row ? fSeg('valign', 'Căn dọc trong hàng', cc.valign, E(L.VA), t.layout.valign || 'center') : fSeg('frame.align', 'Căn ngang trong ô', fr.align, E(L.HA), t.content.variant === 'multi' ? 'center' : (t.layout.align || 'left'));
  content.push(fSeg('frame.fit', 'Hiển thị ảnh trong khung', fr.fit, [['normal', 'Bình thường'], ['width', 'Fit ngang'], ['height', 'Fit dọc']], 'normal'));
  if (f) content.push(zoomR('frame.zoom', 'Zoom ảnh', fr.zoom), centerBtn(fr));
  content.push(all ? null : imgCtl(t, '@' + key), all ? <p key="h" className="hint">{`Đang chỉnh cùng lúc ${keys.length} ô ảnh. Chọn một ô (trên trang) để chỉnh riêng ô đó.`}</p> : <p key="h" className="hint">Kéo cạnh dưới ảnh trên trang để đổi chiều cao khung.</p>);
  return panel(t, sl, all ? `Ảnh · tất cả ${keys.length} ô` : `Ô ${L.labelOf(t, key)} · Ảnh`, { size, align, content, cname: 'Hiển thị ảnh' });
}
function crowPanel(t: any, sl: any) {
  const cc = cellCfg(t, sl.item);
  const size = [fRange('split', 'Tỉ lệ hàng (ảnh / chữ)', cc.split, { min: 15, max: 50, step: 5, def: 25, fmt: splitFmt, fmtKey: 'split' }), fNum('rowH', 'Chiều cao hàng tối thiểu', cc.rowH, { min: 10, max: 120, step: 5, unit: 'mm', def: 'tự động' })];
  const align = fSeg('valign', 'Căn dọc nội dung trong ô', cc.valign, E(L.VA), t.layout.valign || 'center');
  const content = <p className="hint">Kéo thanh ngang dưới ô chữ để đổi chiều cao hàng. Đáp án trong ô (lựa chọn in đậm) có thông số riêng: bấm vào đáp án để chỉnh.</p>;
  return panel(t, sl, `Ô ${L.labelOf(t, sl.item)} · Chữ`, { size, align, content });
}
// Panel Câu hỏi (cả Task: bộ chọn Dạng câu hỏi + thông số chỗ trả lời) / chỗ trả lời của một câu (key)
function answerPanel(t: any, sl: any, key: string | null) {
  const a = t.answer, p = a.params || {}, o = key ? ((p.perItem || {})[key] || {}) : p, La = a.layout, age = (AGE as any)[W().age], inl = a.attach === 'inline';
  const D = (k: string, d: any) => key && isSet(p[k]) ? p[k] : d;
  let size: N[] = [], align: N = null;
  const content: N[] = [];
  if (La === 'A1' || La === 'A8') {
    size = [La === 'A1' ? fNum('lines', 'Số dòng mỗi câu', o.lines, { min: 1, max: 20, def: D('lines', 1) }) : fNum('repeat', 'Số lần tô', o.repeat, { min: 1, max: 5, def: D('repeat', 3) }),
      fNum('lineMm', `Chiều cao dòng (tối thiểu ${age.line})`, o.lineMm, { min: age.line, max: 25, step: .5, unit: 'mm', def: D('lineMm', age.line) }),
      fNum('w', 'Độ rộng dòng', o.w, { min: 40, max: 100, step: 5, unit: '%', def: D('w', 100) })];
  } else if (La === 'A2' && inl) {
    const c = a2cfg(t, key ? { id: key } : null);
    size = [fSeg('lenMode', 'Độ dài gạch', o.lenMode, [['fill', 'Hết lề phải'], ['fixed', 'Cố định']], D('lenMode', 'fixed')), fNum('lenMm', c.mode === 'fill' ? 'Độ dài khi Cố định' : 'Độ dài', o.lenMm, { min: 15, max: 150, step: 5, unit: 'mm', def: D('lenMm', (A2MM as any)[W().age]) }), fNum('lines', 'Số dòng', o.lines, { min: 1, max: 8, def: D('lines', 1) })];
    content.push(fSeg('start', 'Dòng đầu bắt đầu', o.start, [['inline', 'Cạnh chữ'], ['below', 'Hàng dưới']], D('start', 'inline')), <p key="h2" className="hint">Hết lề phải và nhiều dòng chỉ dùng cho chỗ trống ở cuối câu; chỗ trống giữa câu luôn là gạch cố định.</p>);
  } else if (La === 'A2') size = [fNum('width', 'Độ rộng ô', o.width, { min: 4, max: 30, unit: 'ký tự', def: D('width', 'theo từ') })];
  else if (La === 'A3') size = [fNum('boxW', 'Cỡ ô chữ', o.boxW, { min: 5, max: 12, step: .5, unit: 'mm', def: D('boxW', 6.5) })];
  else if (La === 'A4' && inl) { size = [<p key="na" className="hint" data-na="size">Lựa chọn nằm trong câu nên cỡ theo chữ.</p>]; content.push(<p key="h4" className="hint">Viết lựa chọn dạng {'{từ 1|từ 2}'} trong nội dung; hiện thành từ 1 / từ 2, mỗi từ in đậm. Học sinh gạch chân hoặc khoanh từ đúng.</p>); }
  else if (La === 'A4') {
    size = [fNum('gap', 'Khoảng cách các lựa chọn', o.gap, { min: 2, max: 20, unit: 'mm', def: D('gap', 7) })];
    content.push(fSeg('dir', 'Cách xếp', o.dir, E(L.A4DIRS), D('dir', 'auto'), { hint: key ? '' : 'Tự động: lựa chọn ngắn thì xếp một hàng; không vừa thì 2 cột; dài nữa thì mỗi đáp án một dòng. Luôn thẳng cột giữa các câu.' }));
    if (!key) content.push(fNum('autoMax', 'Đáp án “ngắn” khi dài tối đa', o.autoMax, { min: 6, max: 60, unit: 'ký tự', def: a4autoDef() }), fSeg('qv', 'Căn dọc (số câu, chữ câu, lựa chọn)', o.qv, [['top', 'Trên'], ['center', 'Giữa'], ['bottom', 'Dưới']], 'top', { hint: 'Áp cho mọi câu của Task: số câu, chữ câu và dòng lựa chọn cùng đường căn.' }), fSeg('lab', 'Nhãn', o.lab, [['circle', 'ⓐ'], ['dot', 'a.'], ['box', '☐ ô tick']], 'dot'), o.lab === 'box' ? null : fSeg('upper', 'Chữ nhãn', o.upper, [[false, 'a b c'], [true, 'A B C']], false));
  } else if (La === 'A5') size = [fNum('size', 'Cỡ ô tick', o.size, { min: 4, max: 12, step: .5, unit: 'mm', def: D('size', 6.5) })];
  else if (La === 'A6') size = [fNum('size', 'Cỡ ô T/F', o.size, { min: 5, max: 12, step: .5, unit: 'mm', def: D('size', 7.5) })];
  else if (La === 'A7') size = [fNum('size', 'Cỡ chấm nối', o.size, { min: 1.5, max: 6, step: .5, unit: 'mm', def: D('size', 2.8) })];
  if (La === 'A7' && ck(t) === 'pairs') content.push(fSeg('mid', 'Chỗ nối (giữa hai cột)', o.mid, [['dot', 'Chấm nối'], ['box', 'Ô viết chữ'], ['none', 'Không có']], 'dot', { hint: 'Ô viết chữ: học sinh viết chữ cái của vế phải vào ô bên cạnh vế trái (không nối dây).' }));   // v105
  if (inl && (La === 'A2' || La === 'A4')) align = <p className="hint" data-na="align">Đáp án nằm trong câu nên đi theo dòng chữ, không căn riêng.</p>;
  else align = fSeg('align', 'Căn ngang', o.align, E(L.HA), D('align', L.ansAlignDef(t)));
  if (La === 'A6' && !key && p.row) content.push(fSeg('rowv', 'Căn dọc cả khối', p.rowv, [['top', 'Trên'], ['center', 'Giữa'], ['bottom', 'Dưới']], 'center', { hint: 'Áp cho mọi câu của Task: số câu, chữ câu và ô T / F.' }), fRange('tfp', 'Tỉ lệ câu / T-F', p.tfp, { min: 50, max: 90, step: 5, def: 80, fmt: splitFmt, fmtKey: 'split' }));   // v101; v115 theo tỉ lệ
  if (!key) content.push(<p key="hk" className="hint">Bấm vào đáp án của một câu trên trang để chỉnh riêng câu đó.</p>);
  const secs = <>{sec('size', 'Kích thước', size)}{sec('align', 'Căn lề', align)}{sec('content', 'Kiểu hiển thị', content)}{sec('auto', 'Về tự động', autoSec(t, sl, key ? null : <button className="btn" data-act="reset-answer">Về kiểu đáp án ban đầu</button>))}</>;
  if (key) {
    const it = its(t), i = it.findIndex((x: any) => x.id === key), x = it[i] || {};
    const acts = <><h3>Câu này</h3><div className="stack"><button className="btn" data-act="iadd" data-item={key}>+ Thêm câu sau</button><button className="btn" data-act="idup" data-item={key}>⧉ Nhân đôi</button><button className="btn" data-act="iex" data-item={key} aria-pressed={!!x.ex}>{x.ex ? 'Bỏ câu ví dụ' : 'Đặt làm câu ví dụ (số 0)'}</button><button className="btn" data-act="idel" data-item={key}>✕ Xóa câu</button></div>
      {x.ex ? <div className="field"><span>Đáp án mẫu (hiện sẵn)</span><input data-itx={key} data-f="key" defaultValue={x.key || ''} aria-label="Đáp án của câu ví dụ" /></div> : null}<p className="hint">Phím Delete cũng xóa câu đang chọn.</p></>;
    return <>{crumb(t, sl)}<h2>{`Câu ${L.labelOf(t, key)}${x.ex ? ' (ví dụ)' : ''} · chỗ trả lời`}</h2>{acts}{secs}</>;
  }
  const q = qOf(t);
  return <>{crumb(t, sl)}<h2>{`Câu hỏi · ${(QN as any)[q]} `}<Cd c={q} /></h2>{qPicker(t)}{qOpts(t)}{secs}</>;
}
function bankPanel(t: any, sl: any) {
  const b = t.wordBank, pl = b.placement || 'top', right = pl === 'right', img = b.kind === 'image';
  const size = right ? fRange('@split', 'Tỉ lệ nội dung / khung từ', t.layout.split, { min: 40, max: 80, step: 5, def: 62, fmt: splitFmt, fmtKey: 'split' }) : fNum('w', 'Độ rộng khung từ', b.w, { min: 30, max: 100, step: 5, unit: '%', def: 100 });
  const align = right ? fSeg('valign', 'Căn dọc', b.valign, E(L.VA), 'top') : fSeg('align', 'Căn ngang', b.align, E(L.HA), 'center', { hint: b.w ? '' : 'Có tác dụng khi độ rộng nhỏ hơn 100%.' });
  const sg = (act: string, cur: any, opts: any[]) => <div className="seg wrapseg">{opts.map(([v, n]) => <button key={v} data-act={act} data-v={s(v)} className={String(cur) === String(v) ? 'on' : ''}>{n}</button>)}</div>;
  const F = (k: string, label: string, ctl: N) => <div className="field" key={k}><span>{label}</span>{ctl}</div>;
  const content: N[] = [F('k', 'Loại', sg('wbkind', img ? 'image' : 'text', [['text', 'Chữ'], ['image', 'Ảnh']])), F('p', 'Vị trí', sg('wb', pl, [['top', 'Trên câu hỏi'], ['bottom', 'Dưới câu hỏi'], ['right', 'Bên phải']]))];
  if (!img) content.push(F('s', 'Kiểu hiển thị', sg('wbstyle', b.style === 'list' ? 'list' : 'chips', [['chips', 'Từ rời'], ['list', 'Danh sách']])), b.style === 'list' ? F('l', 'Nhãn', sg('wblab', b.label || 'lower', [['lower', 'a b c'], ['upper', 'A B C'], ['none', 'Không']])) : null);
  else content.push(F('l', 'Nhãn', sg('wblab', b.label || 'lower', [['upper', 'A B C'], ['lower', 'a b c'], ['none', 'Không']])), F('c', 'Chữ dưới ảnh', sg('wbcap', b.cap === false ? '0' : '1', [['1', 'Hiện'], ['0', 'Ẩn']])),
    fSeg('frame.fit', 'Hiển thị ảnh trong khung', (b.frame || {}).fit, [['normal', 'Bình thường'], ['width', 'Fit ngang'], ['height', 'Fit dọc']], 'normal', { hint: 'Áp cho mọi ảnh trong khung từ.' }), (b.frame || {}).fit ? zoomR('frame.zoom', 'Zoom ảnh', b.frame.zoom) : null,
    F('a', 'Tỉ lệ ô ảnh', sg('wbar', b.ar || '1/1', [['1/1', '1:1'], ['4/3', '4:3'], ['3/4', '3:4']])), F('n', 'Số ảnh mỗi hàng', sg('wbcols', b.cols || 0, [[0, 'Tự động'], [2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6']])), <p key="h" className="hint">Bấm vào từng ô ảnh trên trang để tải / tạo ảnh. Tên ảnh sửa ở cột trái (mục Nội dung).</p>);
  content.push(<div key="d" className="stack"><button className="btn" data-act="blkdel" data-v="G4">Xóa khung từ</button></div>);
  return panel(t, sl, <>{`Khung từ ${img ? 'ảnh' : 'chữ'} `}<Cd c="G4" /></>, { size, align, content, cname: 'Kiểu hiển thị' });
}
function gtPanel(t: any, sl: any) {
  const x = L.gtOf(t, sl.item), Lg = L.gtOrder(t), i = Lg.findIndex((y: any) => y.id === x.id), n = (t.extras || []).findIndex((y: any) => y.id === x.id) + 1, img = x.kind === 'image';
  const fz = (FSZ as any)[W().age];
  const size = fSeg('size', 'Cỡ chữ', x.size, [[null, `Theo phiếu · ${fz[sizeKey()]} pt`], ...E(GT_SIZE).map(([k, v]) => [k, `${v} · ${fz[k]} pt`])], null);
  const align = img ? fSeg('align', 'Căn lề', x.align, [['left', 'Trái'], ['center', 'Giữa'], ['right', 'Phải']], 'left') : fSeg('align', 'Căn lề', x.align, [['', `Theo Task (${(TA as any).find((y: any) => y[0] === taOf(t))[1]})`], ...TA], '');   // v97
  const frame = img ? null : fSeg('frame', 'Khung', x.frame, [['none', 'Không'], ['line', 'Viền xám'], ['fill', 'Nền xám nhẹ'], ['both', 'Viền + nền']], 'none');
  const cols2 = img ? null : fSeg('cols', 'Số cột chữ', x.cols, [[1, '1 cột'], [2, '2 cột']], 1);
  const wd = img ? <>{fSeg('n', 'Số ảnh trên một hàng', x.n, [[1, '1'], [2, '2'], [3, '3'], [4, '4']], 1)}{fNum('w', gtN(x) > 1 ? 'Độ rộng cả hàng ảnh' : 'Độ rộng ảnh', x.w, { min: 20, max: 100, step: 5, unit: '%', def: gtN(x) > 1 ? 100 : 50 })}</> : null;
  const pos = <><div className="field"><span>Vị trí trong Task</span><div className="seg"><button data-act="gtmove" data-v="-1" disabled={i <= 0 || undefined}>↑ Đưa lên</button><button data-act="gtmove" data-v="1" disabled={i >= Lg.length - 1 || undefined}>↓ Đưa xuống</button></div><p className="hint" style={{ margin: '4px 0 0' }}>{`Đang ở ${x.pos === 'top' ? 'phía trên' : 'phía dưới'} phần bài của Task. Không đánh số, không có đáp án, không phụ thuộc bố cục Task.`}</p></div><div className="stack"><button className="btn" data-act="gtdel">Xóa khối này</button></div></>;
  return <>{crumb(t, sl)}<h2>{`Khối ${img ? 'ảnh' : 'chữ'} ${n} `}<Cd c="G-Text" /></h2>{img ? <>{sec('size', 'Kích thước', wd)}{sec('content', 'Ảnh', gtKeys(x).map((k: string, j: number) => <Fragment key={k}>{gtN(x) > 1 ? <h4>{`Ảnh ${j + 1}`}</h4> : null}{imgCtl(t, k)}</Fragment>))}</> : sec('size', 'Cỡ chữ', [size, cols2])}{sec('align', img ? 'Căn lề' : 'Căn lề & khung', [align, frame])}{sec('pos', 'Vị trí', pos)}{sec('auto', 'Về tự động', autoSec(t, sl))}</>;
}
function headPanel(t: any, sl: any) {
  return <>{crumb(t, sl)}<h2>Tiêu đề <Cd c="G0" /></h2><p className="hint">{`Tiêu đề (số, tên bài, hướng dẫn${t.audio ? ', số track' : ''}) luôn nằm đầu Task, cố định và là mốc của đường dóng. Khi Task bị cắt sang trang mới, trang sau không lặp lại tiêu đề.`}</p></>;
}
function sheetExtra() {
  const n = L.lastRes ? L.lastRes.pages.length : 1;
  return <><h3>Tự động hóa</h3>
    <div className="stack"><button className="btn" data-act="optimize" title="Chỉ đổi các Task đang ở Tự động">Tối ưu bố cục cả phiếu</button></div>
    <div className="fitrow" data-param="fitN"><label htmlFor="fitN">Ép vừa</label><input id="fitN" type="number" min="1" max={s(n)} step="1" defaultValue={s(Math.max(1, n - 1))} /><span>trang</span><button className="btn" data-act="fitN" title="Thử lần lượt: khoảng cách Vừa → Gọn, tối ưu bố cục, Gọn từng Task, ảnh nhỏ hơn 20%, Liền trang. Dừng ở bước đầu tiên đạt số trang.">Thu</button></div>
    <div className={`fld s ${W().fill ? 'ov' : ''}`} data-param="fill"><span className="fl">Lấp đầy trang</span><span className="fc"><span className="seg"><button data-act="fill" data-v="0" className={W().fill ? '' : 'on'}>Tắt</button><button data-act="fill" data-v="1" className={W().fill ? 'on' : ''}>Bật</button></span><span className="hint fh">{`Chia phần trống cuối mỗi trang (trừ trang cuối) vào khoảng giữa các Task, tối đa ${L.FILL_MAX} mm mỗi khoảng.`}</span></span><button className="rst" data-act="fill" data-v="0" hidden={!W().fill} aria-label="Về tự động">↺</button></div></>;
}
function sheetPanel() {
  const sp = sheetSpacing(), sh = W().spacing.preset, d = L.lastRes ? L.lastRes.diags : [], P = L.presetsGet(), keys = Object.keys(P), fk = L.fontKey(), age = (AGE as any)[W().age], fz = (FSZ as any)[W().age];
  const flow = W().flow || 'cont';
  const M0 = { margin: 0 };
  return <><h2>{`Phiếu · ${W().title}`}</h2><p className="hint" style={M0}>{`${W().tasks.length} Task · ${L.lastRes ? L.lastRes.pages.length : '–'} trang A4`}</p>
    {d.map(diagBox)}
    <h3>Xếp trang</h3><div className="field"><div className="seg">{[['cont', 'Liền trang'], ['page', 'Tách trang']].map(([k, n]) => <button key={k} data-act="flow" data-v={k} className={flow === k ? 'on' : ''}>{n}</button>)}</div><p className="hint" style={M0}>{`${flow === 'page' ? 'Tách trang: mỗi trang chỉ chứa các Task trọn vẹn. Task không vừa chỗ còn lại sẽ sang trang mới.' : 'Liền trang: các Task nối tiếp nhau, lấp đầy trang; Task dài được cắt giữa 2 trang ở ranh giới item, hàng hoặc câu.'} Muốn một Task luôn sang trang mới hoặc giữ liền Task sau: chọn Task đó, mục Ngắt trang.`}</p></div>
    <h3>Font chữ phiếu</h3><div className="field"><div className="seg">{Object.keys(FONTS).map(k => <button key={k} data-act="font" data-v={k} className={fk === k ? 'on' : ''} style={{ fontFamily: (FONTS as any)[k].css }}>{(FONTS as any)[k].name}</button>)}</div><p className="hint" style={M0}>{`${(FONTS as any)[fk].hint} Đổi font có thể đổi số trang; phiếu được dàn lại ngay.`}</p></div>
    <h3>Cỡ chữ phiếu</h3><div className="field"><div className="seg">{Object.keys(SIZES).map(k => <button key={k} data-act="size" data-v={k} className={sizeKey() === k ? 'on' : ''} title={`${fz[k]} pt`}>{`${(SIZES as any)[k]} · ${fz[k]} pt`}</button>)}</div><p className="hint" style={M0}>{`Áp cho chữ nội dung và câu hỏi của mọi Task. Mặc định là Vừa. Dòng viết của học sinh vẫn theo độ tuổi (tối thiểu ${age.line} mm). Đổi cỡ chữ có thể đổi số trang.`}</p></div>
    <h3>Khoảng cách</h3><div className="field"><div className="seg">{[...Object.keys(PRESETS).map(k => [k, (PRESET_NAME as any)[k]]), ['free', 'Tự do']].map(([k, n]) => <button key={k} data-act="sheet-preset" data-v={k} className={sh === k ? 'on' : ''}>{n}</button>)}</div></div>
    <p className="hint" style={{ margin: '0 0 4px' }}>{sh === 'free' ? 'Tự do: các số do bạn nhập. Bấm Gọn, Vừa hoặc Thoáng để về bộ số chuẩn.' : 'Các số đi theo mức đã chọn. Sửa tay một số bất kỳ thì chuyển sang Tự do.'}</p>
    {Object.keys(L.SP_LABEL).map(k => numRow('sheet', k, sp[k], sp[k], sh === 'free'))}
    {sheetExtra()}
    <details className="adv"><summary>Nâng cao</summary>
      <h4>{`Mặc định theo dạng bài${keys.length ? ` (${keys.length})` : ''}`}</h4>
      {keys.length ? <ul className="plist">{keys.map(k => <li key={k}><b>{(P[k] && P[k].name) || k}</b><button className="lnk2" data-act="preset-del" data-v={k}>Xóa</button></li>)}</ul> : <p className="hint" style={M0}>Chưa lưu. Chọn một Task đã chỉnh vừa ý, bấm "Lưu làm mặc định cho dạng này"; các phiếu sau mở ra sẽ tự áp.</p>}
      <div className="stack" style={{ marginTop: 6 }}><button className="btn" data-act="import">Nạp phiếu khác (JSON / MD)…</button></div>
      <h4>Quy tắc in</h4><p className="hint" style={M0}>{`Dòng viết tối thiểu ${age.line} mm, cỡ chữ ${fontPt()} pt (${(SIZES as any)[sizeKey()]}; mức To của độ tuổi này là ${fz.l} pt), tối đa ${age.maxCols} cột (độ tuổi ${W().age}).`}</p>
    </details></>;
}
// Bài đọc (G2 của Task có bài đọc): thứ tự so với câu hỏi, xóa bài đọc, rồi các thông số của cả Task
function leadPanel(t: any, sl: any) {
  const qf = t.layout.order === 'qfirst', w8 = !qf && t.layout.task !== 'auto' && ['T8', 'T4'].includes(layoutOf(t));
  const c = <><div className="field"><span>Thứ tự</span><div className="seg"><button data-act="order" data-v="pfirst" className={!qf ? 'on' : ''}>Bài đọc trước</button><button data-act="order" data-v="qfirst" className={qf ? 'on' : ''} disabled={w8 || undefined} title={w8 ? 'Bố cục đang chọn tay (Ảnh trong bài đọc / hai cột): bài đọc luôn đứng trước. Đổi Bố cục về Tự động / Xếp dọc / Ảnh trái / Ảnh phải để đặt câu hỏi trước.' : undefined}>Câu hỏi trước</button></div><p className="hint" style={{ margin: '4px 0 0' }}>Câu hỏi trước: bài đọc in sau câu hỏi (bài đọc khi đó không cắt theo đoạn).</p></div><div className="stack"><button className="btn" data-act="blkdel" data-v="G2">Xóa bài đọc (giữ câu hỏi)</button></div><p className="hint">Sửa chữ bài đọc ở cột trái, mục Nội dung. Phím Delete cũng xóa bài đọc.</p></>;
  return <>{crumb(t, sl)}<h2>Bài đọc <Cd c="G2" /></h2>{sec('content', 'Bài đọc', c)}<h3>Cả Task</h3>{taskParts(t, { type: 'task', id: t.id }).body}</>;
}
// Nội dung inspector theo lựa chọn hiện tại (legacy renderInspector đã chỉnh sel trước khi gọi)
export function inspView(): N {
  const sl = L.sel;
  if (sl.type === 'sheet') return sheetPanel();
  const t = W().tasks.find((x: any) => x.id === sl.id); if (!t) return null;
  if (sl.type === 'group' && sl.g === 'G2' && !sl.item && ck(t) === 'passage') return leadPanel(t, sl);
  const k = L.kindOf(t, sl);
  return k === 'task' ? taskPanel(t, sl) : k === 'frame' ? framePanel(t, sl) : k === 'cimg' ? cimgPanel(t, sl, false) : k === 'cimgs' ? cimgPanel(t, sl, true)
    : k === 'crow' ? crowPanel(t, sl) : k === 'answer' ? answerPanel(t, sl, null) : k === 'aitem' ? answerPanel(t, sl, sl.item) : k === 'bank' ? bankPanel(t, sl) : k === 'gt' ? gtPanel(t, sl) : headPanel(t, sl);
}
