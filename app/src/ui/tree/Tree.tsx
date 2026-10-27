// Cột trái: danh sách Task và khung soạn Task đang mở. Chuyển nguyên văn từ bộ dựng HTML v106 (legacy/app.js: renderTree,
// edHtml + 4 lớp vá v81–v85 đã gộp lại thành một, edItems, edTable, gtEd, qrEd, cardHtml, thumbHtml): giữ đúng thẻ, class,
// data-*, chữ để CSS, các bộ bắt sự kiện (gắn trên #tree) và test cũ dùng được. tests/chuan/giaodien.py so DOM với v106.
// legacy renderTree() đăng treeRev mới → dựng lại cả cột (như innerHTML cũ). Khi đang gõ, legacy liveRender() đăng liveRev:
// chỉ thẻ mô tả, mã QR, tóm tắt các mục, tên Task và số câu có đáp án vẽ lại (ô đang gõ không mất con trỏ).
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, type ReactNode } from 'react';
import { L } from '../legacyApi';
import { useUi } from '../store';
import { qOpts, qPicker, s, tPicker } from '../insp/parts';
import * as Lay from '../../core/layout.js';
import * as Mod from '../../core/model.js';
import * as Md from '../../core/md.js';
import * as St from '../../core/state.js';
const { AR_OPTS, exPick, exPicks, fixedImg, imgArOf, keyGaps, qOf, qnum, qrInner, qrUrl, srcOf, tblAr, tblOpts } = Lay as any;
const { QN, ck, gapCount, its, pkGroups, pkSrc } = Mod as any;
const { TN, brOut, crossLines, fmtCell, tnOf } = Md as any;
const W = (): any => St.ws;   // phiếu đang mở (đọc mỗi lần: setWs thay cả đối tượng)
type N = ReactNode;
const ABC = 'abcdefgh';
const abc = (j: number) => ABC[j] || j + 1;

// Ô gõ (data-k = trường dữ liệu). ph2: chữ gợi ý thay (dòng chữ giữa các câu)
function eIn(k: string, v: any, ph?: string, o: any = {}) {
  return o.area
    ? <textarea key={k} data-k={k} rows={o.rows || 2} placeholder={ph || ''} aria-label={o.label || ph || k} defaultValue={s(v)} className={o.cls} title={o.title} />
    : <input key={k} data-k={k} defaultValue={s(v)} placeholder={ph || ''} aria-label={o.label || ph || k} style={o.w ? { width: o.w } : undefined} className={o.cls} title={o.title} />;
}
function Thumb({ t, k, big }: { t: any; k: string; big?: boolean }) {
  const src = srcOf(t, k), ar = imgArOf(t, k) || '4/3';
  return <button type="button" className={`ithumb ${src ? 'has' : ''}${big ? ' big' : ''}`} data-gen={k} style={{ ['--tar' as any]: ar }} title={src ? 'Mở để thay hoặc tạo lại ảnh' : 'Tạo hoặc tải ảnh'} aria-label={`Ảnh: ${L.slotName(t, k)}`}>
    {src ? <img src={src} alt="" /> : big ? <span>＋ Tải ảnh lên · Tạo ảnh<small>hoặc kéo thả ảnh vào ô trên trang · Ctrl+V</small></span> : <span>+</span>}</button>;
}
// Nút ✕ xóa khối, đứng sau nhãn (có một dấu cách phía trước như bản cũ)
const xb = (v: string, n: string) => <>{' '}<button type="button" className="eb xb" data-eact="blkdel" data-v={v} title={`Xóa ${n}`} aria-label={`Xóa ${n}`}>✕</button></>;
const tinfo = (ctx: string, ti: string) => <button type="button" className="tinfo" data-eact="tinfo" data-ctx={ctx} title={ti} aria-label={ti}>i</button>;
const TXN: any = { b: 'Đậm', i: 'Nghiêng', u: 'Gạch chân', gap: 'Chỗ trống', pick: 'Chọn trong câu', para: 'Sang đoạn mới' };
const txBar = (ctx: string, label: string, suffix: string) => <span className="g3tb" role="toolbar" aria-label={label}>{L.TXB[ctx].map(([n, a]: string[]) => <button key={a} type="button" data-tx={a} title={`${TXN[a]}: ${suffix}`}>{n}</button>)}</span>;

// Phần đọc lại khi đang gõ (liveRev): thẻ mô tả, mã QR, tóm tắt mục, tên Task, số câu có đáp án
const useLive = () => useUi(st => st.liveRev);
const taskOf = (id: string) => W().tasks.find((x: any) => x.id === id);
function Card({ id }: { id: string }) {
  useLive(); const t = taskOf(id); if (!t) return <div className="tcwrap" />;
  const c = L.cardOf(t);
  return <div className="tcwrap"><div className="tcard" data-card={t.id}>{c.chips.map((x: any, i: number) => <button key={i} className={`chip ${x.cls || ''}`} data-go={x.go} data-id={t.id} title={x.title || 'Bấm để tới chỗ chỉnh'}>{s(x.t)}</button>)}</div>
    {c.warns.length ? <ul className="twarn">{c.warns.map((x: any, i: number) => <li key={i} className={x.lv}>{s(x.m)}</li>)}</ul> : null}</div>;
}
function QrP({ id }: { id: string }) { useLive(); const t = taskOf(id); return <span className="qrp" dangerouslySetInnerHTML={{ __html: (t && qrInner(t)) || 'Chưa có mã' }} />; }
function SecSum({ id, k, why }: { id: string; k: string; why?: string }) { useLive(); const t = taskOf(id); return <span className="secs">{why || (t ? s(L.secSums(t)[k] || '') : '')}</span>; }
export function TaskName({ id }: { id: string }) { useLive(); const t = taskOf(id); return <span className="tnm">{t ? L.taskLabel(t) : ''}</span>; }
function Kcnt({ id }: { id: string }) {
  useLive(); const t = taskOf(id); if (!t) return null; const ks = L.keyState(t); if (!ks.need.length) return null;
  return <button type="button" className={`kcnt${ks.miss.length ? ' w' : ''}`} data-eact="keyjump" title={ks.miss.length ? 'Bấm để tới câu còn thiếu đáp án đúng' : 'Mọi câu đã có đáp án đúng'}>{`${ks.need.length - ks.miss.length}/${ks.need.length} câu có đáp án`}</button>;
}

// Mục của khung soạn (đang có) và mục chưa có (tiêu đề mờ + nút thêm)
function Sec({ t, k, code, title, tag, children }: { t: any; k: string; code: string; title: string; tag?: N; children: N }) {
  const o = !!L.SECT[k];
  return <section className={`sec ${o ? 'open' : ''}`} data-sec={k}><button className="sech" data-stg={k} aria-expanded={o ? 'true' : 'false'}><span className="snum">{code}</span><span className="sect">{title}</span><SecSum id={t.id} k={k} />{tag}<span className="car">▶</span></button><div className="secb">{children}</div></section>;
}
function Off({ t, k, code, title, btns, why }: { t: any; k: string; code: string; title: string; btns: string[][]; why?: string }) {
  return <section className="sec off" data-sec={k}><div className="sech"><span className="snum">{code}</span><span className="sect">{title}</span><SecSum id={t.id} k={k} why={why} />{btns.map(([v, n]) => <button key={v} type="button" className="eb sadd" data-eact="blkaddb" data-v={v}>{n}</button>)}</div></section>;
}
const tag = (v: any, ti: string) => v ? <span className="stag" title={ti}>{s(v)}</span> : null;

// G0: tiêu đề, hướng dẫn, track, mã QR nghe
function qrEd(t: any) {
  if (!t.audio) return null;
  const q = t.qr || { src: 'link' }, src = q.src || 'link';
  const seg = <span className="seg">{[['link', 'Link'], ['img', 'Ảnh mã'], ['file', 'File nghe']].map(([v, n]) => <button key={v} type="button" data-eact="qrsrc" data-v={v} className={src === v ? 'on' : ''}>{n}</button>)}</span>;
  const body = src === 'link' ? eIn('qr.link', q.link || '', 'Link nghe, hoặc phần cuối sau địa chỉ gốc', { label: 'Link nghe' })
    : src === 'img' ? <><button type="button" className="btn" data-eact="qrimg">{q.img ? 'Thay ảnh mã…' : 'Tải ảnh mã…'}</button>{q.img ? <button type="button" className="btn" data-eact="qrrm">Gỡ</button> : null}</>
    : <><button type="button" className="btn" data-eact="qrfile">{q.url ? 'Thay file nghe…' : 'Tải file nghe…'}</button>{q.file ? <span className="qrnote">{s(q.file)}</span> : null}{q.url ? <button type="button" className="btn" data-eact="qrrm">Gỡ</button> : null}</>;
  return <><div className="ef col"><span className="elb">Mã QR nghe</span><div className="qrrow"><QrP id={t.id} /><div className="stack" style={{ flex: 1, minWidth: 0, display: 'grid', gap: 6 }}>{seg}<div className="qrrow">{body}</div></div></div></div>
    {src === 'file' ? <p className="qrnote">{`${q.demo ? 'Bản demo: chưa nối kho lưu file nghe, link chỉ là mẫu (không nghe được). Hệ thống thật sẽ trả về link thật.' : 'Link được hệ thống tạo khi tải file lên.'}${q.url ? ' ' + qrUrl(t) : ''}`}</p> : null}
    {src === 'img' ? null : <div className="ef col"><span className="elb">Địa chỉ gốc (cả phiếu)</span>{eIn('qr.base', W().audioBase || '', 'Ví dụ: https://pinta.vn/audio', { label: 'Địa chỉ gốc audio' })}</div>}</>;
}

// G3 (danh sách câu): mỗi câu một hàng
function edItems(t: any) {
  const k = ck(t), it = its(t), c = t.content, a = t.answer, p = a.params || {};
  const noun = L.nounOf(k), exOk = c.form !== 'table' && c.list !== false && !['pairs', 'empty', 'table'].includes(k);
  const ktkOn = ['A4', 'A6'].includes(a.layout);
  const rows = it.map((x: any, i: number) => {
    const gt = !!x.gt;
    let first = true;   // dòng chữ (gt): ô gõ đầu tiên có chữ gợi ý riêng
    const E = (key: string, v: any, ph: string, o: any = {}) => { const ph2 = gt && first ? 'Dòng chữ giữa các câu (không số, không chỗ trả lời)' : ph; first = false; return eIn(key, v, ph2, o); };
    // v86 (F2): ô tích đáp án đúng ngay sau ô chữ của câu (Chọn A/B/C, Đúng/Sai)
    const ktk = () => {
      if (!ktkOn || gt || x.imgs || x.opts) return null; const op = L.optsOfKey(t, x); if (op.length < 2) return null; const on = exPicks(t, x, op);
      return <div className="er2 ktk" key="ktk"><span className="elb">Đúng</span>{op.map((o: any, j: number) => <span className="ko" key={j}><button type="button" className={`tkq${on.includes(j) ? ' on' : ''}`} data-eact="tickopt" data-i={i} data-j={j} aria-pressed={!!(on.includes(j))} title="Đánh dấu đáp án đúng (chọn được nhiều)">✓</button>{a.layout === 'A4' ? `${ABC[j]}. ` : ''}{String(o).replace(/<[^>]+>|\*/g, '')}</span>)}</div>;
    };
    const textF = (ph: string, o: any) => <>{E(`it.${i}.text`, x.text || '', ph, o)}{ktk()}</>;
    let f: N[] = [], whoIn: N = null;
    if (x.who != null) { whoIn = E(`it.${i}.who`, x.who, 'Tên', { w: '92px', label: `Người nói ${i + 1}` }); f = [<div className="er2" key="who">{textF('Lời thoại (___ = chỗ trống)', { label: `Lời ${i + 1}` })}</div>]; }
    else if (x.pair) f = [x.pair.l && x.pair.l.img != null
      ? <div className="er2 pairimg" key="pr"><div className="imgblk"><Thumb t={t} k={'@' + x.id} />{E(`it.${i}.pli`, x.pair.l.img, 'Tên ảnh', { label: `Ảnh vế trái ${i + 1}` })}{E(`it.${i}.pl`, L.fieldVal(x, 'pl'), 'Chữ dưới ảnh', { label: `Chữ dưới ảnh vế trái ${i + 1}` })}</div><span className="eto">↔</span>{E(`it.${i}.pr`, L.fieldVal(x, 'pr'), 'Vế phải', { label: `Vế phải ${i + 1}` })}</div>
      : <div className="er2" key="pr">{E(`it.${i}.pl`, L.fieldVal(x, 'pl'), 'Vế trái', { label: `Vế trái ${i + 1}` })}<span className="eto">↔</span>{E(`it.${i}.pr`, L.fieldVal(x, 'pr'), 'Vế phải', { label: `Vế phải ${i + 1}` })}</div>];
    else if (x.lines) f = [E(`it.${i}.lines`, L.fieldVal(x, 'lines'), 'Mỗi dòng một dòng chữ; {a|b} = chọn', { area: 1, rows: Math.max(2, x.lines.length), label: `Các dòng câu ${i + 1}` })];
    else f = [<Fragment key="tx">{textF(k === 'trace' ? 'Từ để tô' : 'Chữ (___ chỗ trống, {a|b} chọn; dòng trống = sang đoạn)', { label: `Chữ câu ${i + 1}`, area: !x.gt && !x.img && !x.imgs, rows: Math.max(1, Math.min(14, ((x.text || '').match(/\n/g) || []).length + Math.ceil((x.text || '').length / 44))) })}</Fragment>];   // v101: ô câu nhiều dòng
    if (x.img != null) f = (!x.pair && !x.who && !x.lines && !x.imgs) ? [<div className="imgrow2" key="im"><Thumb t={t} k={'@' + x.id} /><div className="imgcol">{E(`it.${i}.img`, x.img, 'Chữ dưới ảnh / tên ảnh', { label: `Chữ dưới ảnh câu ${i + 1}` })}{f}</div></div>]
      : [<div className="imgblk" key="im"><Thumb t={t} k={'@' + x.id} />{E(`it.${i}.img`, x.img, 'Chữ dưới ảnh / tên ảnh', { label: `Chữ dưới ảnh câu ${i + 1}` })}</div>, ...f];
    if (x.imgs) f.push(<div className="imgsgrid" key="imgs" style={{ ['--n' as any]: x.imgs.length }}>{x.imgs.map((im: any, j: number) => <div className="imgblk" key={j}><Thumb t={t} k={`@${x.id}.${j}`} />{E(`it.${i}.imgs.${j}`, im, 'Chữ dưới ảnh', { label: `Chữ dưới ảnh ${j + 1} của câu ${i + 1}` })}{a.layout === 'A5' ? <button type="button" className={`tkq${exPicks(t, x, x.imgs).includes(j) ? ' on' : ''}`} data-eact="tickopt" data-i={i} data-j={j} aria-pressed={!!(!!(String(x.key ?? '').trim() && exPick(t, x, x.imgs) === j))} title="Tick ✓ = ảnh này là đáp án đúng" aria-label={`Đáp án đúng: ảnh ${j + 1} của câu ${i + 1}`}>✓</button> : null}</div>)}</div>);
    if (x.opts) { const pk = exPicks(t, x, x.opts);   // v87: mỗi lựa chọn một dòng: ô tích (đúng, chọn được nhiều) + a. b. c. + ô gõ + ✕
      f.push(<div className="eopts" key="op"><div className="eoh"><span className="elb">Đáp án</span><span className="sp" /><button type="button" className="eb eoadd" data-eact="optadd" data-i={i} title="Thêm đáp án" aria-label={`Thêm đáp án câu ${i + 1}`}>+</button></div>{x.opts.map((o: any, j: number) => <div className="eo" key={j}><button type="button" className={`tkq${pk.includes(j) ? ' on' : ''}`} data-eact="tickopt" data-i={i} data-j={j} aria-pressed={!!(pk.includes(j))} title="Tích = đáp án đúng (chọn được nhiều)" aria-label={`Đáp án đúng: ${abc(j)} câu ${i + 1}`}>✓</button><span className="eol">{`${abc(j)}.`}</span>{E(`it.${i}.opts.${j}`, o, 'Đáp án ' + abc(j), { label: `Lựa chọn ${abc(j)} câu ${i + 1}` })}<button type="button" className="eb" data-eact="optdel" data-i={i} data-j={j} disabled={x.opts.length > 2 ? undefined : true} title="Xóa đáp án này" aria-label={`Xóa lựa chọn ${abc(j)} câu ${i + 1}`}>✕</button></div>)}</div>); }
    if (a.layout === 'A3' && !x.who && !x.pair && !gt) f.push(<div className="er2" key="len"><span className="elb">Số ô</span>{E(`it.${i}.len`, x.len || '', 'tự động', { w: '60px', label: `Số ô chữ câu ${i + 1}` })}</div>);
    const need = L.needKey(t, x);
    const pg = x.opts || x.imgs ? [] : pkGroups(x), ul = !pg.length && p.ulab && a.kind === 'choice' ? [...pkSrc(x).matchAll(/<u>([\s\S]*?)<\/u>/g)].map((m: any) => m[1]) : [];
    if (pg.length && need) f.push(<div className="er2 kpk" key="key"><span className="elb">Đáp án</span><span className="pkr">{pg.map((g: any[], gi: number) => <Fragment key={gi}>{gi ? <span className="pks">·</span> : null}{g.map((o: any, j: number) => <button key={j} type="button" className={`pko${o.ok ? ' on' : ''}`} data-eact="pickopt" data-i={i} data-g={gi} data-j={j} aria-pressed={!!(o.ok)} title="Bấm = vế đúng (bấm lại để bỏ)">{s(o.t || '…')}</button>)}</Fragment>)}</span></div>);   // v89
    else if (ul.length && need) { const Lb = p.upper ? 'ABCDEFGH' : ABC, kk = String(x.key ?? '').trim().toLowerCase(); f.push(<div className="er2 kpk" key="key"><span className="elb">Phần sai</span><span className="pkr">{ul.map((u: string, j: number) => <button key={j} type="button" className={`pko ule${kk === ABC[j] ? ' on' : ''}`} data-eact="ulpick" data-i={i} data-j={j} aria-pressed={!!(kk === ABC[j])} title="Bấm phần gạch chân bị sai = đáp án">{`${Lb[j]}. ${u.replace(/<[^>]+>|\*/g, '')}`}</button>)}</span></div>); }
    else if (need && !x.opts && !x.imgs && (L.gapN(x) > 1 || (L.gapN(x) === 1 && t.wordBank && t.wordBank.kind !== 'image' && t.wordBank.words.length))) { const ks = keyGaps(x), wb = t.wordBank && t.wordBank.kind !== 'image' ? t.wordBank.words : null, n = L.gapN(x);   // v91: mỗi chỗ trống một ô đáp án
      f.push(<div className="er2 kgap" key="key"><span className="elb">Đáp án</span><span className="pkr">{Array.from({ length: n }, (_, j) => { const v = ks[j] || '', gl = L.gapLabs(x.text)[j], lb = gl ? <i>{s(gl)}</i> : n > 1 ? <i>{`(${j + 1})`}</i> : null;
        return wb && wb.length ? <label className="kg" key={j}>{lb}<select data-k={`it.${i}.keyg.${j}`} aria-label={`Đáp án chỗ trống ${j + 1} câu ${i + 1}`} defaultValue={v}><option value="">—</option>{wb.concat(v && !wb.includes(v) ? [v] : []).map((w: string, wi: number) => <option key={wi}>{w}</option>)}</select></label>
          : <label className="kg" key={j}>{lb}{E(`it.${i}.keyg.${j}`, v, 'đáp án', { label: `Đáp án chỗ trống ${j + 1} câu ${i + 1}` })}</label>; })}</span></div>); }
    else if (need && !x.pair && !(x.imgs && a.layout === 'A5') && !x.opts && !(a.layout === 'A6' && L.optsOfKey(t, x).length > 1)) f.push(<div className="er2" key="key"><span className="elb">Đáp án</span>{E(`it.${i}.key`, x.key || '', 'đáp án đúng', { label: `Đáp án đúng câu ${i + 1}` })}</div>);
    const al = L.ansLabel(x);
    return <div className={`eit${al ? ' ans' : ''}${gt ? ' egt' : ''}${x.ex ? ' eex' : ''}`} data-i={i} key={i}><div className="eih"><span className="egrip" draggable="true" data-drag={i} title="Kéo để đổi thứ tự">⋮⋮</span><span className={`ino${x.ex ? ' ex' : ''}`}>{gt ? 'Chữ' : s(qnum(t, i))}</span>{whoIn}
      <span className="sp" /><button className="eb" data-eact="up" data-i={i} disabled={i ? undefined : true} aria-label="Lên">↑</button><button className="eb" data-eact="down" data-i={i} disabled={i < it.length - 1 ? undefined : true} aria-label="Xuống">↓</button>
      {exOk && !gt ? <button className={`eb exb${x.ex ? ' on' : ''}`} data-eact="iexi" data-i={i} aria-pressed={!!(!!x.ex)} title={x.ex ? 'Bỏ câu ví dụ' : 'Đặt làm câu ví dụ: số 0, hiện sẵn đáp án'} aria-label="Câu ví dụ">Ví dụ</button> : null}
      {gt ? null : <button className="eb" data-eact="dupi" data-i={i} aria-label="Nhân đôi câu">⧉</button>}<button className="eb" data-eact="del" data-i={i} aria-label={`Xóa ${noun} ${i + 1}`}>✕</button></div>{f}{al && !gt ? <div className="eans" title="Câu này có chỗ học sinh phải trả lời">{`✎ ${al}`}</div> : null}</div>;
  });
  const heads = k === 'pairs' ? <div className="er2" key="heads"><span className="elb">Tiêu đề cột</span>{eIn('heads.0', (c.heads || [])[0] || '', 'Cột trái', { label: 'Tiêu đề cột trái' })}{eIn('heads.1', (c.heads || [])[1] || '', 'Cột phải', { label: 'Tiêu đề cột phải' })}</div> : null;   // v105
  return [heads, <div className="eitems" key="its">{rows}</div>,
    <div className="erow" key="erow"><button className="btn" data-eact="add">{`+ Thêm ${noun}`}</button>{exOk && ['questions', 'dialogue'].includes(k) ? <button className="btn" data-eact="gtiadd" title="Dòng chữ giữa các câu: không số, không chỗ trả lời (tiêu đề nhóm, lời dẫn phần sau)">+ Dòng chữ</button> : null}<button className="btn" data-eact="paste-items" title={`Dán nhiều dòng, mỗi dòng một ${noun}`}>{`Dán nhiều ${noun}…`}</button></div>,
    it.some((x: any) => x.img || x.imgs) || (k === 'pairs' && it.some((x: any) => x.pair && x.pair.l && x.pair.l.img != null)) ? <div className="edrop" data-drop={t.id} key="drop">{`Kéo nhiều ảnh vào đây: mỗi ảnh vào một ô theo thứ tự, thừa ảnh thì thêm ${noun}.`}</div> : null];
}

// G3 (bảng)
function edTable(t: any) {
  const c = t.content;
  if (tblOpts(t).cross) { const n = L.crossCount(c); return [<p className="hint" key="h1">Mỗi dòng một hàng. <b>#</b> không có ô · <b>.</b> ô trống chưa có đáp án · chữ cái = ô có đáp án · <b>(a)</b> chữ cho sẵn. Số 1, 2, 3 tự đánh.</p>,
    <div className="ef col xgin" key="g"><span className="elb">Lưới ô chữ</span>{eIn('cross.grid', crossLines(c).join('\n'), '#C#S#\n#A#U#\n#TEN#', { area: 1, rows: Math.min(14, Math.max(4, c.rows.length + 1)), label: 'Lưới ô chữ' })}</div>,
    <p className="hint" key="h2"><span id="xcount">{`${n.cells} ô · ${n.words} từ (${n.across} ngang, ${n.down} dọc).`}</span> Lời gợi ý: thêm ở Khối tự do (+ Chữ).</p>]; }
  const head = <div className="etr"><span className="ino">·</span>{eIn('tb.corner', brOut(c.corner || ''), 'Góc', { label: 'Ô góc' })}{c.cols.map((x: any, j: number) => eIn(`tb.col.${j}`, brOut(x), `Cột ${j + 1}`, { label: `Tên cột ${j + 1}` }))}<span className="eb0" /></div>;
  const cTxt = (v: any) => brOut(v && typeof v === 'object' && v.img && !v.tick ? (v.text || '') : fmtCell(v));   // v99: ô có ảnh: ảnh nhỏ bên trái, ô gõ chỉ chữ
  const isO = (v: any) => v && typeof v === 'object';
  // Một ô: [ảnh nhỏ] [ô tích] ô gõ [nút +ảnh / ×]; các phần thêm bọc trong <span class="etc"> như bản cũ
  const cell = (v: any, i: number, j: any, key: string | null, input: N) => {
    let kids: N[] | null = null; let inner: N = input;
    if (isO(v) && v.img && key) kids = [<Thumb key="th" t={t} k={key} />, input];
    if (j !== 'h' && v && v.tick) { kids = [<button key="tk" type="button" className={`tkq${v.ok ? ' on' : ''}`} data-eact="tbok" data-i={i} data-j={j} aria-pressed={!!(!!v.ok)} title="Đánh dấu ô đúng (bản giáo viên)">✓</button>, kids ? <span className="etc" key="in">{kids}</span> : input]; }   // v98
    const bt = isO(v) && (v.tick || v.ans != null) ? null : <button key="im" type="button" className={`eimb${v && v.img ? ' x' : ''}`} data-eact="tbimg" data-i={i} data-j={j} title={v && v.img ? 'Gỡ ảnh khỏi ô (giữ chữ)' : 'Thêm ảnh vào ô'} aria-label={v && v.img ? 'Gỡ ảnh' : 'Thêm ảnh'}>{v && v.img ? '×' : '+ảnh'}</button>;   // v99
    if (bt) kids = kids ? [...kids, bt] : [input, bt];
    inner = kids ? <span className="etc" key={`c${j}`}>{kids}</span> : <Fragment key={`c${j}`}>{input}</Fragment>;
    return inner;
  };
  const rows = c.rows.map((r: any, i: number) => <div className="etr" key={i}><span className="ino">{i + 1}</span>{cell(r.head, i, 'h', r.id && '@' + r.id, eIn(`tb.r.${i}.head`, cTxt(r.head), 'Đầu hàng', { label: `Đầu hàng ${i + 1}` }))}
    {r.cells.map((v: any, j: number) => cell(v, i, j, r.id && `@${r.id}.${j}`, eIn(`tb.r.${i}.c.${j}`, cTxt(v), '(trống)', { label: `Hàng ${i + 1} cột ${j + 1}`, ...(v && v.ans != null ? { cls: 'etka', title: 'Ô học sinh điền: đáp án (in trống)' } : {}) })))}<button className="eb" data-eact="delrow" data-i={i} aria-label={`Xóa hàng ${i + 1}`}>✕</button></div>);
  return [<p className="hint" key="h">Ô để trống = chỗ viết · <b>=chữ</b> = ô học sinh điền, chữ là đáp án (in trống) · <b>[ ]</b> = ô tích, <b>[ ] chữ</b> = ô tích kèm chữ, <b>[x]</b> = ô tích đúng · <b>+ảnh</b> thêm ảnh vào ô, <b>×</b> trên ảnh nhỏ để gỡ</p>,
    <div className="etbl" key="t" style={{ ['--nc' as any]: c.cols.length + 1 }}>{head}{rows}</div>,
    <div className="erow" key="r"><button className="btn" data-eact="addrow">+ Hàng</button><button className="btn" data-eact="addcol">+ Cột</button><button className="btn" data-eact="delcol" disabled={c.cols.length > 1 ? undefined : true}>− Cột cuối</button><button className="btn" data-eact="paste-items" title="Dán bảng: mỗi dòng một hàng, ô cách nhau bằng Tab hoặc |">Dán bảng…</button></div>];
}

// GT: khối tự do
function gtEd(t: any) {
  const Lg = L.gtOrder(t), ex = t.extras || [];
  return <><p className="hint" style={{ margin: '0 0 6px' }}>Khối tự do nằm ngang cả bề rộng Task, không đánh số, không có đáp án. Chữ: ghi chú, ví dụ, luật chơi, danh sách. Ảnh: ảnh minh họa, sơ đồ.</p>
    {ex.map((x: any) => {
      const i = Lg.findIndex((y: any) => y.id === x.id), img = x.kind === 'image', n = ex.filter((y: any) => y.kind === x.kind).indexOf(x) + 1, nm = img ? 'ảnh' : 'chữ';
      return <div className="gtcard" data-x={x.id} key={x.id}><div className="gthd"><b>{`Khối ${nm} ${n}`}</b>{img ? null : tinfo('free', 'Cách viết khối chữ')}<small>{x.pos === 'top' ? 'phía trên bài' : 'phía dưới bài'}</small><span className="gtbt"><button className="eb" data-eact="gtsel" data-x={x.id} title="Chọn trên trang để chỉnh cỡ chữ, căn lề, khung" aria-label={`Chọn khối ${nm} ${n} để chỉnh định dạng`}>⚙</button><button className="eb" data-eact="gtup" data-x={x.id} disabled={i <= 0 || undefined} aria-label="Đưa khối chữ lên">↑</button><button className="eb" data-eact="gtdown" data-x={x.id} disabled={i >= Lg.length - 1 || undefined} aria-label="Đưa khối chữ xuống">↓</button><button className="eb" data-eact="gtrm" data-x={x.id} aria-label={`Xóa khối ${nm} ${n}`}>✕</button></span></div>
        {img ? <div className="ef imgrow">{Lay.gtKeys(x).map((k: string) => <Thumb key={k} t={t} k={k} />)}{eIn(`x.${x.id}.label`, x.label || '', 'Tên ảnh', { label: 'Tên ảnh' })}</div> : eIn(`x.${x.id}.text`, x.text || '', 'Gõ chữ. Đầu dòng "- " là gạch đầu dòng, "1. " là danh sách số, **đậm**, *nghiêng*.', { area: 1, rows: 4, label: `Khối chữ ${n}` })}</div>;
    })}
    <div className="stack"><button className="btn" data-eact="gtadd">+ Chữ</button><button className="btn" data-eact="gtadd" data-kind="image">+ Ảnh</button></div></>;
}

// Khung soạn một Task: thanh thao tác, ⚙ Cấu hình, G0 Tiêu đề, G1 Ảnh chung, G2 Bài đọc, G3 Câu hỏi / Bảng, G4 Khung từ, GT Khối tự do
function TaskEditor({ t }: { t: any }) {
  const ws = W(), c = t.content, k = ck(t), a = t.answer, i = ws.tasks.indexOf(t), n = ws.tasks.length, tn = tnOf(t), qq = qOf(t), ad = L.blkAddable(t), tbl = c.form === 'table';
  const join = t.layout.break === 'join';
  const tools = <div className="tkt" role="toolbar" aria-label={`Thao tác với Task ${i + 1}`}><button className="eb" data-eact="tup" disabled={i ? undefined : true} title="Đưa Task lên" aria-label="Đưa Task lên">↑</button><button className="eb" data-eact="tdown" disabled={i < n - 1 ? undefined : true} title="Đưa Task xuống" aria-label="Đưa Task xuống">↓</button><button className="eb" data-eact="tdup" title="Nhân đôi Task" aria-label="Nhân đôi Task">⧉</button>
    <button className="eb tjn" data-eact="tjoin" disabled={i ? undefined : true} aria-pressed={!!(join)} title={i ? (join ? 'Đã nối vào Task phía trên (phần tiếp, không số / tiêu đề). Bấm để bỏ nối' : 'Nối vào Task phía trên: thành phần tiếp, không số / tiêu đề') : 'Task đầu phiếu không nối được'}>{join ? '↳ Đã nối' : '↳ Nối Task'}</button><span className="sp" />
    <button className="eb dng" data-eact="tdel" title="Xóa Task (có hỏi trước, hoàn tác được)" aria-label="Xóa Task"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5M6.8 7v4M9.2 7v4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg></button></div>;
  // ⚙ Cấu hình: thẻ mô tả, Bố cục T, Dạng câu hỏi Q, tùy chọn của Q, tùy chọn của câu
  const tgI = L.fieldToggles(t).filter((x: any) => !L.TG_BLK[x.id] && !(x.dis && !x.on));
  const cfg = <><Card id={t.id} /><div className="qpick">{tPicker(t, 'tree')}{qPicker(t, 'tree')}{qOpts(t, 'tree')}</div>
    {tgI.length ? <><h3>Tùy chọn của câu</h3><div className="etgs">{tgI.map((x: any) => <label key={x.id} className={`etg ${x.dis ? 'dis' : ''}`} title={x.dis || ''}><input type="checkbox" data-tg={x.id} defaultChecked={!!x.on} />{s(L.TG_BLK[x.id] || x.label)}</label>)}</div></> : null}</>;
  const g0 = <><div className="ef"><span className="elb">Tiêu đề</span>{eIn('title', t.title || '', 'Tên bài / lệnh', { label: 'Tiêu đề' })}</div>
    <div className="ef"><span className="elb">Hướng dẫn</span>{eIn('instruction', t.instruction || '', 'Hướng dẫn', { label: 'Hướng dẫn' })}</div>
    <div className="ef"><span className="elb">Track</span>{eIn('audio', t.audio || '', 'không có', { label: 'Track audio' })}</div>{qrEd(t)}</>;
  // G1
  const g1 = t.image ? <Sec t={t} k="g1" code="G1" title="Ảnh chung"><div className="ef imgrow"><span className="elb">Ảnh chung{xb('G1', 'ảnh chung')}</span>{L.slotsOf(t).some((x: any) => x.key === 'G1') ? <Thumb t={t} k="G1" big /> : null}{eIn('image.label', t.image.label || '', 'Tên ảnh', { label: 'Tên ảnh chung' })}</div>
    {t.image.two ? <div className="ef imgrow"><span className="elb">Ảnh thứ hai{xb('G1b', 'ảnh thứ hai')}</span><Thumb t={t} k="G1b" big />{eIn('image.label2', t.image.label2 || '', 'Tên ảnh', { label: 'Tên ảnh thứ hai' })}</div> : null}
    {ad.includes('G1b') ? <div className="stack"><button className="btn" data-eact="blkaddb" data-v="G1b">+ Ảnh thứ hai</button></div> : null}</Sec>
    : <Off t={t} k="g1" code="G1" title="Ảnh chung" btns={[['G1', '+ Thêm']]} />;
  // G2: bài đọc / lời dẫn (thanh chèn ký hiệu ở hàng nhãn)
  const g2lab = (nm: string, v: string, n2: string) => <span className="elb g2bar">{nm}{xb(v, n2)}{tinfo('passage', 'Cách viết bài đọc / lời dẫn')}{txBar('passage', 'Chèn ký hiệu vào bài đọc', 'chèn vào ô đang gõ')}</span>;
  const lead = c.lead;
  const g2 = lead ? <Sec t={t} k="g2" code="G2" title={lead.kind === 'text' ? 'Lời dẫn' : 'Bài đọc'} tag={tag('theo ' + tn, 'Vị trí bài đọc theo Bố cục ' + TN[tn])}>
    {lead.kind === 'passage' ? <><div className="ef col">{g2lab('Bài đọc', 'G2', 'bài đọc')}{eIn('lead.text', lead.text || '', 'Dán bài đọc vào đây (___ chỗ trống, {a|b} chọn, **đậm**, *nghiêng*, __gạch chân__; dòng trống = sang đoạn)', { area: 1, rows: 5, label: 'Bài đọc' })}</div>
      {gapCount(lead.text || '') || lead.keys ? <div className="ef col"><span className="elb">Đáp án chỗ trống</span>{eIn('lead.keys', (lead.keys || []).join(', '), 'Theo thứ tự chỗ trống: am, go, play', { label: 'Đáp án chỗ trống trong bài đọc' })}</div> : null}</> : null}
    {lead.kind === 'text' ? <div className="ef">{g2lab('Lời dẫn', 'intro', 'lời dẫn')}{eIn('lead.text', lead.text || '', 'Lời giới thiệu', { label: 'Lời dẫn' })}</div> : null}</Sec>
    : <Off t={t} k="g2" code="G2" title="Bài đọc" btns={[...(ad.includes('G2') ? [['G2', '+ Bài đọc']] : []), ...(ad.includes('intro') ? [['intro', '+ Lời dẫn']] : [])]} why={ad.includes('G2') || ad.includes('intro') ? '' : 'không dùng cho dạng này'} />;
  // G3: câu hỏi / bảng
  const g3on = tbl || c.list !== false;
  let g3: N;
  if (g3on) {
    const arOn = L.slotsOf(t).some((x: any) => fixedImg(t, x.key));
    const lst = L.fieldToggles(t).find((x: any) => x.id === 'list'), canOff = lst && lst.on && !lst.dis;
    const inf = tinfo('items', 'Cách viết câu hỏi');
    const nm = tbl ? 'Bảng' : `Danh sách ${L.nounOf(k)}`;
    const subh = <div className="subh"><span className="g3n">{nm === 'Danh sách câu' ? 'Câu hỏi' : nm}{canOff ? xb('G3', 'câu hỏi (giữ câu để bật lại)') : null}</span>{tbl ? null : txBar('items', 'Chèn ký hiệu vào ô câu đang gõ', 'chèn vào ô câu đang gõ')}{arOn ? null : inf}<Kcnt id={t.id} /></div>;
    const after: N[] = [];
    if (!['table', 'empty', 'trace', 'dialogue'].includes(k)) { const qb = !!t.layout.qbold; after.push(<div className="ef qbrow" key="qb"><span className="elb">Chữ câu hỏi</span><span className="seg"><button type="button" data-eact="qbold" data-v="" className={qb ? '' : 'on'}>Bình thường</button><button type="button" data-eact="qbold" data-v="1" className={qb ? 'on' : ''} style={{ fontWeight: 700 }}>Đậm</button></span></div>); }   // v86
    if (k === 'table' && !tblOpts(t).cross) { const o = tblOpts(t), C = (kk: string, nn: string, on: any, dis?: string) => <label className="tbck" key={kk}><input type="checkbox" data-eact="tblo" data-v={`${kk}:${on ? 0 : 1}`} defaultChecked={!!on} disabled={dis ? true : undefined} title={dis || undefined} />{` ${nn}`}</label>;   // v96
      const cells = L.tkCells(t), anyTick = cells.some((v: any) => v && v.tick), hasTx = L.tkHasText(t);
      after.push(<div className="ef tbrow" key="t1"><span className="elb">Kiểu bảng</span><span className="tbcks">{C('head', 'Hàng tiêu đề cột', o.head)}{C('fh', 'Tô nền hàng tiêu đề', o.fh && o.head, o.head ? '' : 'Bật Hàng tiêu đề cột trước')}{C('fr', 'Tô hàng xen kẽ', o.fr === 'zebra' && !o.fc, o.fc ? 'Đang tô cột đầu' : '')}{C('rowHead', 'Cột tiêu đề hàng', o.rowHead)}</span></div>,
        hasTx || anyTick ? <div className="ef tbrow" key="t2"><span className="elb">Chọn đáp án</span><span className="tbcks">{hasTx ? C('tk', 'Hiện ô tích trước chữ', L.tkOn(t)) : null}{anyTick ? C('one', 'Một ô đúng mỗi hàng', !!(t.layout.table || {}).one) : null}</span></div> : null,
        <div className="ef tbrow" key="t3"><span className="elb">Số thứ tự</span><span className="seg">{[['out', 'Ngoài bảng'], ['in', 'Trong cột đầu'], ['off', 'Tắt']].map(([v, nn]) => <button key={v} type="button" data-eact="tblo" data-v={`nm:${v}`} className={o.nm === v ? 'on' : ''}>{nn}</button>)}</span></div>,
        <div className="ef tbrow" key="t4"><span className="elb">Ảnh trong bảng</span><span className="seg">{[['none', 'Không'], ['first', 'Cột đầu'], ['all', 'Mọi ô có chữ']].map(([v, nn]) => <button key={v} type="button" data-eact="tblo" data-v={`im:${v}`} className={L.cimMode(t) === v ? 'on' : ''}>{nn}</button>)}</span></div>); }
    if (k === 'pairs') { const on = !!c.shuffle; after.push(<div className="ef shrow" key="sh"><span className="elb">Xáo vế phải khi in</span><span className="seg"><button type="button" data-eact="pshuf" data-v="1" className={on ? 'on' : ''}>Bật</button><button type="button" data-eact="pshuf" data-v="" className={on ? '' : 'on'}>Tắt</button></span>{on ? <button type="button" className="btn" data-eact="preshuf" title="Đổi thứ tự xáo khác">Xáo lại</button> : null}</div>,
      <p className="hint" key="shh">Bật: gõ cặp <b>đúng</b> cạnh nhau, phiếu in tự xáo vế phải (cố định, in lại không đổi). Tắt: in đúng thứ tự đang gõ.</p>); }   // v90
    g3 = <Sec t={t} k="g3" code="G3" title={tbl ? 'Bảng' : 'Câu hỏi'} tag={tag(qq && 'theo ' + qq, qq ? 'Dạng câu hỏi: ' + QN[qq] : '')}>
      {arOn ? <div className="ef g3ar"><span className="elb">Tỉ lệ ô ảnh</span><span className="seg">{AR_OPTS.map(([v, nn]: string[]) => <button key={v} type="button" data-eact="tblar" data-v={v} className={tblAr(t) === v ? 'on' : ''}>{nn}</button>)}</span>{inf}</div> : null}
      {subh}{after}{tbl ? edTable(t) : edItems(t)}</Sec>;
  } else g3 = <Off t={t} k="g3" code="G3" title="Câu hỏi" btns={[['G3', c.list === false && (c.items || []).length ? '+ Bật lại' : '+ Thêm']]} />;
  // G4: khung từ
  const wb = t.wordBank;
  const g4 = wb ? <Sec t={t} k="g4" code="G4" title={wb.kind === 'image' ? 'Khung từ ảnh' : 'Khung từ'}><div className="ef col"><span className="elb">{wb.kind === 'image' ? 'Khung từ ảnh' : 'Khung từ'}{xb('G4', 'khung từ')}</span>{eIn('wb.words', wb.words.join('\n'), 'Mỗi dòng một từ (hoặc cách nhau bằng dấu phẩy)', { area: 1, rows: Math.min(6, Math.max(2, wb.words.length)), label: 'Khung từ' })}</div>
    {wb.kind === 'image' ? <div className="ef wbth">{wb.words.map((w: string, j: number) => <span className="wbt" key={j}><Thumb t={t} k={'B.' + j} /><small>{s(w)}</small></span>)}</div> : null}</Sec>
    : ad.includes('G4') ? <Off t={t} k="g4" code="G4" title="Khung từ" btns={[['G4', '+ Chữ'], ['G4i', '+ Ảnh']]} /> : <Off t={t} k="g4" code="G4" title="Khung từ" btns={[]} why="không dùng cho dạng này" />;
  const gt = (t.extras || []).length ? <Sec t={t} k="gt" code="GT" title="Khối tự do">{gtEd(t)}</Sec> : <Off t={t} k="gt" code="GT" title="Khối tự do" btns={[['GTt', '+ Chữ'], ['GTi', '+ Ảnh']]} />;
  return <div className="ed" data-ed={t.id}>{tools}<Sec t={t} k="cfg" code="⚙" title="Cấu hình" tag={tag(tn + (qq ? ' · ' + qq : ''), 'Bố cục ' + TN[tn] + (qq ? ' · Dạng câu hỏi ' + QN[qq] : ''))}>{cfg}</Sec>
    <Sec t={t} k="g0" code="G0" title="Tiêu đề">{g0}</Sec>{g1}{g2}{g3}{g4}{gt}</div>;
}

// Cả cột trái: nút + Task / + Phiếu, nút Phiếu, danh sách Task (Task đang mở có khung soạn)
function treeView() {
  const ws = W(), sel = L.sel;
  return <><div className="ttools"><button className="btn pri" data-lib="1" title="Thêm Task vào cuối phiếu: từ mẫu có sẵn, hoặc từ file / dán (JSON, MD, chữ)">+ Task</button><button className="btn" data-newsheet="1" title="Tạo phiếu mới: từ file JSON / MD / chữ, hoặc phiếu trống. Thay phiếu đang mở sau khi xác nhận.">+ Phiếu</button></div>
    <button className={`tnode ${sel.type === 'sheet' ? 'on' : ''}`} data-sel="sheet"><b>Phiếu</b><span className="tag">{`${ws.tasks.length} Task`}</span></button>
    <ul className="tks">{ws.tasks.map((t: any) => {
      const open = L.openTask === t.id, on = L.isOnSel({ type: 'task', id: t.id });
      return <li key={t.id} className={`tk ${open ? 'open' : ''}${open && sel.type !== 'sheet' && sel.id === t.id ? ' cur' : ''}`} data-tk={t.id}><div className="tkh"><button className={`tnode ${on ? 'on' : open ? 'opn' : ''}`} data-sel="task" data-id={t.id} aria-expanded={!!(open)}><span className="chev" title={open ? 'Thu gọn Task' : 'Mở Task để soạn'}>▶</span><span className={`n${t.part ? ' pt' : ''}`}>{`${t.number}${t.part || ''}`}</span><TaskName id={t.id} />{L.hasOverride(t) ? <span className="ovmark" title="Có chỉnh tay" /> : null}</button></div>
        {open ? <div className="tkb"><TaskEditor t={t} /></div> : null}</li>;
    })}</ul></>;
}
export function Tree() {
  const rev = useUi(st => st.treeRev);
  return rev ? <Fragment key={rev}>{treeView()}</Fragment> : null;
}
