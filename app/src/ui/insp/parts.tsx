// Inspector (cột phải): các mảnh dùng chung — ô thông số, mục, tiêu đề, bộ chọn Bố cục / Dạng câu hỏi.
// Chuyển nguyên văn từ bộ dựng HTML v106 (legacy/app.js: fld, fNum, fSeg, fRange, sec, crumb, autoSec, panel,
// diagBox, presetSeg, numRow, imgCtl, tPickerHtml, qPickerHtml, qOptsHtml): giữ đúng thẻ, class, data-*, chữ
// để CSS, các bộ bắt sự kiện (gắn trên #insp / #tree) và test cũ dùng được. tests/chuan/giaodien.py so DOM với v106.
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react';
import { L } from '../legacyApi';
import * as Lay from '../../core/layout.js';
import * as Mod from '../../core/model.js';
import * as Md from '../../core/md.js';
import * as St from '../../core/state.js';
const { AR_OPTS, arLabel, imgArOf, qOf, srcOf } = Lay as any;
const { MINS, PRESETS, QN, ck } = Mod as any;
const { LABS, PRESET_NAME, QORDER, TN, q2cfg, qReasons, qStyles, tnOf, tnReasons } = Md as any;
const W = (): any => St.ws;   // phiếu đang mở (đọc mỗi lần: setWs thay cả đối tượng)

export type N = ReactNode;
// Mảnh rỗng như chuỗi rỗng của bản cũ (mục chỉ hiện khi có nội dung)
export const has = (x: any): boolean => Array.isArray(x) ? x.some(has) : !(x == null || x === '' || x === false);
export const isSet = (v: any) => v !== undefined && v !== null && v !== '';
export const fmtN = (v: any) => String(v).replace('.', ',');
export const s = (v: any) => `${v}`;   // như ${v} trong chuỗi mẫu cũ (undefined → "undefined")

export const Cd = ({ c }: { c: any }) => <small className="cd">{s(c)}</small>;
export const LayIcon = ({ L: k }: { L: string }) => <svg viewBox="0 0 36 29" fill="none" stroke="currentColor" strokeWidth="1" dangerouslySetInnerHTML={{ __html: L.ICON[k] }} />;

// Ô thông số chuẩn: nhãn, điều khiển, nút ↺ về tự động
export function fld(p: string, label: N, ctrl: N, man: any, def: any, cls = '') {
  return <div className={`fld ${cls} ${man ? 'ov' : ''}`} data-param={p}><span className="fl">{label}</span><span className="fc">{ctrl}</span><button className="rst" data-act="rst" data-p={p} hidden={!man} title={`Về tự động${isSet(def) ? ` (${fmtN(def)})` : ''}`} aria-label="Về tự động">↺</button></div>;
}
export function fNum(p: string, label: string, val: any, o: any) {
  return fld(p, label + (o.unit ? ` (${o.unit})` : ''), <input type="number" data-pv={p} min={s(o.min)} max={s(o.max)} step={s(o.step || 1)} placeholder={isSet(o.def) ? fmtN(o.def) : 'tự động'} defaultValue={isSet(val) ? s(val) : ''} aria-label={label} />, isSet(val), o.def, 'n');
}
export function fSeg(p: string, label: string, val: any, opts: any[], def: any, o: any = {}) {
  const cur = isSet(val) ? val : def, dn = (opts.find(x => String(x[0]) === String(def)) || [])[1];
  return fld(p, label, <><span className="seg wrapseg">{opts.map(([v, n, dis], i) => <button key={i} data-act="set" data-p={p} data-v={s(v)} data-def={s(def)} className={String(cur) === String(v) ? 'on' : ''} disabled={!!dis || undefined} title={dis || undefined}>{s(n)}</button>)}</span>{o.hint ? <span className="hint fh">{o.hint}</span> : null}</>, isSet(val), dn, 's');
}
export function fRange(p: string, label: string, val: any, o: any) {
  const v = isSet(val) ? val : o.def, f = o.fmt || ((x: any) => x);
  return fld(p, label, <span className="rng"><input type="range" data-pr={p} data-def={s(o.def)} data-fmt={o.fmtKey || ''} min={s(o.min)} max={s(o.max)} step={s(o.step || 5)} defaultValue={s(v)} aria-label={label} /><output>{s(f(v))}</output></span>, isSet(val), f(o.def), 's');
}
export const sec = (key: string, name: string, html: N) => has(html) ? <section className="psec" data-sec={key}><h3>{name}</h3>{html}</section> : null;

export function crumb(t: any, sl: any) {
  // Chỉ liệt kê cấp cha (bấm để lên); tên mục đang chọn nằm ở tiêu đề bên dưới
  return <div className="crumb"><button data-sel="sheet">Phiếu</button>{sl.type === 'task' ? null : <>{' › '}<button data-sel="task" data-id={t.id}>Task {s(t.number)}</button>{sl.item ? <>{' › '}<button data-sel="group" data-id={t.id} data-g={sl.g}>{s(L.GNAME[sl.g])}</button></> : null}</>}</div>;
}
// pre: các nút đứng trước "Về tự động" (chỉ hiện khi có chỉnh tay, như bản cũ)
export function autoSec(t: any, sl: any, extra: N = null, pre: N = null) {
  const man = L.ovOf(t, sl);
  const sc = L.SCOPES.map(([v, n]: any) => [v, n, L.targetsOf(t, sl, v).length]).filter((x: any) => x[2]).map(([v, n, c]: any) => <button key={v} data-act="scope" data-v={v} title={`Áp cho ${c} container`}>{`${n} · ${c}`}</button>);
  const st = [man ? <>{pre}<button className="btn" data-act="auto">Về tự động</button></> : null, extra];
  return [has(st) ? <div className="stack" key="st">{st}</div> : null, sc.length ? <div className="field" style={{ marginTop: 10 }} key="sc"><span>Áp thông số của container này cho</span><div className="seg wrapseg scopes">{sc}</div></div> : null,
    L.multi.length ? <p className="hint" key="m">{`Đang chọn ${L.multi.length + 1} container cùng loại: mọi thay đổi áp cho tất cả.`}</p> : null];
}
export function panel(t: any, sl: any, title: N, o: any) {
  return <>{crumb(t, sl)}<h2>{title}</h2>{o.diag}{o.top}{sec('size', 'Kích thước', o.size)}{sec('align', 'Căn lề', o.align)}{sec('content', o.cname || 'Nội dung', o.content)}{sec('break', 'Ngắt trang', o.brk)}{sec('auto', 'Về tự động', autoSec(t, sl, o.autoExtra, o.autoPre))}</>;
}
export function diagBox(d: any, i?: number) {
  return <div className="diag" key={i}><div>{s(d.msg)}</div><div className="fixes">{(d.fixes || []).map((f: any, j: number) => <button key={j} className="btn" data-act="fix" data-id={d.id} data-v={s(f.v)}>{s(f.label)}</button>)}{L.sel.type === 'sheet' ? <button className="lnk" data-sel="task" data-id={d.id}>Mở Task</button> : null}</div></div>;
}
export const diagFor = (t: any) => (L.lastRes ? L.lastRes.diags.filter((d: any) => d.id === t.id) : []).map(diagBox);
export function presetSeg(cur: any, act: string, withInherit: boolean) {
  const opts = (withInherit ? [['', 'Theo phiếu']] : []).concat(Object.keys(PRESETS).map(k => [k, (PRESET_NAME as any)[k]]), [['free', 'Tự do']]);
  return <div className="seg wrapseg">{opts.map(([k, n]) => <button key={k} data-act={act} data-v={k} className={(cur || '') === k ? 'on' : ''}>{s(n)}</button>)}</div>;
}
export function numRow(scope: string, key: string, val: any, inh: any, ov: any) {
  const label = scope === 'task' && key === 'gapTask' ? 'Cách Task phía trên' : L.SP_LABEL[key];
  return <div key={key} className={`fld n ${ov ? 'ov' : ''}`} data-param={`sp.${key}`}><label className="fl" htmlFor={`sp-${scope}-${key}`}>{`${label} (mm)`}</label><span className="fc"><input id={`sp-${scope}-${key}`} type="number" step="0.5" min={s((MINS as any)[key])} defaultValue={s(val)} data-sp={scope} data-key={key} /></span><button className="rst" data-act="rst-sp" data-sp={scope} data-key={key} hidden={!ov} title={`Về mặc định (${fmtN(inh)} mm)`} aria-label="Về mặc định">↺</button></div>;
}
// Panel ảnh: tải / thay / gỡ + tỉ lệ ô giữ chỗ (noH3: bỏ tiêu đề "Ảnh", dùng cho ảnh thứ hai)
export function imgCtl(t: any, key: string, noH3 = false) {
  if (!key) return null;
  const up = srcOf(t, key), ar = imgArOf(t, key) || '4/3', m = (t.upMeta || {})[key], lr = (L.lowRes[t.id] || []).find((x: any) => x.key === key);
  return <>{noH3 ? null : <h3>Ảnh</h3>}<div className="stack"><div className="erow"><button className="btn" data-act="img-gen" data-v={key}>Tạo ảnh…</button><button className="btn" data-act="img-up" data-v={key}>{up ? 'Thay ảnh…' : 'Tải ảnh lên…'}</button>{up ? <button className="btn" data-act="img-rm" data-v={key}>Gỡ ảnh</button> : null}</div>
    {up ? <p className="hint">{`Ảnh thật${m ? ` ${m.w}×${m.h} px` : ''}, tỉ lệ ${arLabel(ar)}.`}{lr ? <>{' '}<b style={{ color: 'var(--danger)' }}>{`Hơi mờ khi in (~${lr.dpi} dpi, nên ≥ 150).`}</b></> : null}</p>
      : fld('ar', 'Tỉ lệ ô giữ chỗ', <span className="seg wrapseg">{AR_OPTS.map(([v, n]: any) => <button key={v} data-act="img-ar" data-v={`${key}|${v}`} className={String(ar) === v ? 'on' : ''}>{s(n)}</button>)}</span>, false, '', 's')}
    <p className="hint">Cũng có thể kéo thả ảnh vào ô trên trang, hoặc chọn ô rồi bấm Ctrl+V.</p>{key === 'G1' ? <><div className="erow"><button className="btn" data-act="img-del">Xóa khung ảnh</button></div><p className="hint">Bài không cần ảnh chung thì xóa cả khung. Phím Delete cũng được. Thêm lại bằng nút + Thêm ở mục G1 · Ảnh chung (cột trái).</p></> : null}</div></>;
}

// Bộ chọn T (4 kiểu + Tự động) và Q (12 kiểu); side 'tree' = cột trái (data-eact), còn lại inspector (data-act)
const at = (side?: string) => side === 'tree' ? 'data-eact' : 'data-act';
export function tPicker(t: any, side?: string) {
  const why = tnReasons(t), cur = t.layout.task === 'auto' ? 'auto' : tnOf(t), IC: any = { T1: 'T1', T2: 'T2', T3: 'T3', T4: 'T8' };
  const btn = (v: string, n: string, ic: string, dis: any, hint: string) => <button key={v} className={`lay tnb ${cur === v ? 'on' : ''}`} {...{ [at(side)]: 'tn' }} data-v={v} disabled={dis ? true : undefined} title={dis ? dis : hint}><LayIcon L={ic} /><span>{n}</span>{v !== 'auto' ? <Cd c={v} /> : <small className="cd">{s((TN as any)[tnOf(t)])}</small>}</button>;
  const ok = Object.keys(TN).filter(v => !why[v]), locked = Object.keys(TN).filter(v => why[v]);
  return <><h3>Bố cục Task</h3><div className="lay-grid tn-grid">{btn('auto', 'Tự động', IC[tnOf(t)], '', 'Hệ thống tự chọn')}{ok.map(v => btn(v, (TN as any)[v], IC[v], '', L.TN_HINT[v]))}</div>
    {locked.length ? <details className="why"><summary>{`Bố cục chưa dùng được (${locked.length})`}</summary><ul>{locked.map(v => <li key={v}><b>{(TN as any)[v]}</b>{`: ${why[v]}`}</li>)}</ul></details> : null}</>;
}
export function qPicker(t: any, side?: string) {
  const cur = qOf(t), why = qReasons(t);
  return <><h3>Dạng câu hỏi</h3><div className="q-grid">{QORDER.map((q: string) => <button key={q} className={`qbt ${cur === q ? 'on' : ''}`} {...{ [at(side)]: 'q' }} data-v={q} disabled={why[q] ? true : undefined} title={why[q] ? why[q] : `${(QN as any)[q]}: ${L.QHINT[q]}`}><b>{(QN as any)[q]}</b><Cd c={q} /><span className="qpv" aria-hidden="true" dangerouslySetInnerHTML={{ __html: L.QPV[q] || '' }} /></button>)}</div></>;
}
export function qOpts(t: any, side?: string) {
  const a = at(side), st = qStyles(t), ar = L.qArr(t), q = qOf(t), p = t.answer.params || {}, ha = t.answer.kind !== 'none', tbl = ck(t) === 'table';
  const A = (act: string, v: string) => ({ [a]: act, 'data-v': v });
  const h: N[] = [];
  if (!tbl && ck(t) !== 'empty') h.push(<div className="field" key="ha"><span>Có chỗ trả lời</span><div className="seg"><button {...A('hasans', '1')} className={ha ? 'on' : ''}>Có</button><button {...A('hasans', '0')} className={!ha ? 'on' : ''}>Không (chỉ hiển thị)</button></div></div>);
  if (st.length > 1) h.push(<div className="field" key="st"><span>Cách trả lời</span><div className="seg wrapseg">{st.map((x: any) => <button key={x.id} {...A('qst', x.id)} className={x.on ? 'on' : ''}>{s(x.name)}</button>)}</div></div>);
  if (q === 'Q2' && ha && p.frame !== 'box') {   // v95
    const c = q2cfg(t), B = (v: string, lab: string, on: boolean) => <button {...A('q2', v)} className={on ? 'on' : ''}>{lab}</button>;
    h.push(<div className="field q2f" key="q2a"><span>Điểm bắt đầu</span><label className="q2ck"><input type="checkbox" {...A('q2', `start:${c.start === 'end' ? 'below' : 'end'}`)} defaultChecked={c.start === 'end'} /> Từ cuối câu hỏi</label></div>);
    h.push(<div className="field q2f" key="q2b"><span>Chiều dài</span><div className="seg">{B('len:fixed', 'Cố định', c.len === 'fixed')}{B('len:fill', 'Hết dòng', c.len === 'fill')}</div>{c.len === 'fixed' ? <div className="seg q2n">{B('mm:-5', '−', false)}<b data-q2v="mm">{`${c.mm} mm`}</b>{B('mm:+5', '+', false)}</div> : null}</div>);
    h.push(<div className="field q2f" key="q2c"><span>Số hàng</span><div className="seg q2n">{B('ln:-1', '−', false)}<b data-q2v="ln">{s(c.lines)}</b>{B('ln:+1', '+', false)}</div></div>);
    h.push(<p className="hint" key="q2d">{c.start === 'end' ? (c.lines > 1 ? `Gạch ngay sau câu hỏi, thêm ${c.lines - 1} hàng bên dưới.` : 'Gạch ngay sau câu hỏi, cùng hàng.') : `${c.lines} hàng bên dưới câu hỏi.`}</p>);
  }
  if (q === 'Q5' && t.answer.layout === 'A6') { const k = L.labsKey(p); h.push(<div className="field" key="lb"><span>Nhãn lựa chọn</span><div className="seg wrapseg">{Object.keys(LABS).map(x => <button key={x} {...A('labs', x)} className={k === x ? 'on' : ''}>{(LABS as any)[x].join(' / ')}</button>)}</div></div>); }
  if (q === 'Q5' && t.answer.layout === 'A6') h.push(<div className="field" key="tf"><span>Vị trí T / F</span><div className="seg"><button {...A('tfrow', '0')} className={p.row ? '' : 'on'}>Dưới câu</button><button {...A('tfrow', '1')} className={p.row ? 'on' : ''}>Cùng hàng với câu</button></div></div>);
  if (['A1', 'A8'].includes(t.answer.layout) && p.frame !== 'box') h.push(<div className="field" key="ru"><span>Kiểu dòng</span><div className="seg"><button {...A('ruling', '')} className={p.ruling !== '4' ? 'on' : ''}>Dòng thường</button><button {...A('ruling', '4')} className={p.ruling === '4' ? 'on' : ''}>Bốn ô li (tập viết)</button></div></div>);
  if (ar.length) h.push(<div className="field" key="ar"><span>Cách xếp câu</span><div className="seg">{ar.map(([v, n, on]: any) => <button key={v} {...A('qarr', v)} className={on ? 'on' : ''}>{n}</button>)}</div></div>);
  if (tbl) h.push(<p className="hint" key="tb">Chỗ trả lời nằm trong ô: ô để trống = ô viết, ✓ = ô tick.</p>);
  return h;
}
