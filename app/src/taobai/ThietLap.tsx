// Module Tạo bài v128: màn THIẾT LẬP (menu chung của app, nút "⚙ Thiết lập" trên thanh trên và ở màn Ra đề).
//   Giáo trình  cây giáo trình → unit → lesson; mỗi lesson nạp file Kiến thức; nạp giao-trinh.md / cả thư mục
//   Dạng phiếu  mỗi chuyên đề của giáo trình: Trình tự + TF; bộ file dùng chung (1–5) của hệ thống
//   AI          nhà cung cấp (Claude: Sonnet 5.5 / Haiku 5.5 / model khác; tương thích OpenAI), khóa, thử kết nối
// Qua máy chủ (chay-lop.bat → /editor): nạp file lên máy chủ (bản cũ giữ lại), khóa AI lưu ở máy chủ, không về trình duyệt.
// Mở thẳng file HTML: chỉ xem dữ liệu đang dùng (bộ mẫu / thư mục đã chọn); AI dùng chế độ AI ngoài (chép đoạn nhắc).
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useUi, publish, type TbUi } from '../ui/store';
import { askConfirm } from '../ui/Dialogs';
import { toast } from '../ui/Toast';
import { parseGiaoTrinh, TEP_HOP_LE, type TongQuan, type TepTT } from '../../../shared/src/taobai/index.ts';
import { moNguon, nguonThuMuc, nguonMau, datLaiNguon, goi, type Nguon } from './nguon';

const tb = (): TbUi => useUi.getState().tb;
const setTb = (p: Partial<TbUi>) => publish({ tb: Object.assign({}, tb(), p) });
export const openThietLap = (tab: TbUi['tl'] = 'gt') => setTb({ tl: tab, kho: false });
/** Dữ liệu đổi: màn Ra đề (nếu đang mở) đọc lại. */
const doiDuLieu = () => { datLaiNguon(); setTb({ rev: tb().rev + 1 }); };
const TAB: [NonNullable<TbUi['tl']>, string][] = [['gt', 'Giáo trình'], ['dang', 'Dạng phiếu'], ['ai', 'AI']];

/** Đọc một file người dùng chọn thành chữ (chỉ .md / .txt, ≤ 512 KB). */
async function docFile(f: File): Promise<string> {
  if (!/\.(md|txt|markdown)$/i.test(f.name)) throw new Error(`“${f.name}”: chỉ nhận file chữ .md hoặc .txt`);
  if (f.size > 512 * 1024) throw new Error(`“${f.name}” quá lớn (tối đa 512 KB)`);
  return f.text();
}
/** Nút chọn file ẩn: bấm nút → hộp chọn file → cb(file). */
function Nap({ label, onFile, id, dir, cls = 'btn sm', title, disabled }: { label: ReactNode; onFile: (f: FileList) => void; id?: string; dir?: boolean; cls?: string; title?: string; disabled?: boolean }) {
  const r = useRef<HTMLInputElement>(null);
  return <><button className={cls} id={id} title={title} disabled={disabled} onClick={() => r.current?.click()}>{label}</button>
    <input type="file" ref={r} hidden accept=".md,.txt,.markdown" multiple={!!dir} {...(dir ? ({ webkitdirectory: '' } as any) : {})} data-nap={id || ''} onChange={e => { const f = e.target.files; if (f && f.length) onFile(f); e.target.value = ''; }} /></>;
}
const Ver = ({ t }: { t: TepTT }) => t.ver == null ? <span className="tag tlno">chưa có</span> : <span className="tag ok">{t.ver === '?' ? 'có (chưa ghi phiên bản)' : 'v' + t.ver}</span>;

export function ThietLap() { const tab = useUi(s => s.tb.tl); return tab ? <Screen tab={tab} /> : null; }

function Screen({ tab }: { tab: NonNullable<TbUi['tl']> }) {
  const [src, setSrc] = useState<Nguon | null>(null), [tq, setTq] = useState<(TongQuan & { quyen?: boolean }) | null>(null), [err, setErr] = useState('');
  const [xem, setXem] = useState<{ path: string; text: string } | null>(null), [busy, setBusy] = useState(false);
  const may = src?.mode === 'may-chu', quyen = may && tq?.quyen !== false;
  const tai = async (n?: Nguon) => { try { const s = n || await moNguon(); setSrc(s); setTq(await s.tongQuan()); setErr(''); } catch (e) { setErr((e as Error).message); } };
  useEffect(() => { tai(); }, []);
  /** Gọi máy chủ để sửa dữ liệu, cập nhật cây; lỗi thì báo. */
  const sua = async (f: () => Promise<any>, ok: string) => {
    setBusy(true);
    try { await f(); doiDuLieu(); await tai(); toast(ok); }
    catch (e) { toast((e as Error).message); setErr((e as Error).message); } finally { setBusy(false); }
  };
  const napTep = async (t: TepTT, ten: string, fl: FileList) => {
    let text: string; try { text = await docFile(fl[0]); } catch (e) { toast((e as Error).message); return; }
    if (t.ver != null && !(await askConfirm(`Thay ${ten}?`, `Bản đang dùng (${t.ver === '?' ? 'chưa ghi phiên bản' : 'v' + t.ver}) được giữ lại trên máy chủ (thư mục tao-bai/_cu). Phiếu đã tạo vẫn ghi phiên bản cũ đã dùng.`, 'Thay file'))) return;
    await sua(() => goi('/api/taobai/tep', { method: 'PUT', json: { path: t.path, text } }), `Đã nạp ${ten}`);
  };
  const boTep = async (t: TepTT, ten: string) => {
    if (!(await askConfirm(`Bỏ ${ten}?`, 'File được chuyển vào thư mục tao-bai/_cu trên máy chủ (không mất hẳn). Lesson / chuyên đề dùng file này sẽ không tạo bài được cho tới khi nạp lại.', 'Bỏ file'))) return;
    await sua(() => goi('/api/taobai/tep?path=' + encodeURIComponent(t.path), { method: 'DELETE' }), `Đã bỏ ${ten}`);
  };
  const xemTep = async (path: string) => { const t = src ? await src.tep(path) : null; if (t == null) toast('Chưa có file này'); else setXem({ path, text: t }); };
  const napGiaoTrinh = async (fl: FileList) => {
    let text: string; try { text = await docFile(fl[0]); } catch (e) { toast((e as Error).message); return; }
    const slug = fl[0].name.replace(/\.(md|txt|markdown)$/i, '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'giao-trinh';
    const r = parseGiaoTrinh(text, fl[0].name, slug), gid = r.gt.id;
    if (r.loi.length && !r.gt.units.length) { toast('File không phải giao-trinh.md: ' + r.loi.map(n => n.msg).join('; ')); return; }
    if (!/^[a-z0-9][a-z0-9-]{0,60}$/.test(gid)) { toast(`Mã giáo trình “${gid}” không hợp lệ: thêm dòng “Mã: ten-khong-dau” vào file`); return; }
    const co = tq?.giaoTrinh.find(g => g.id === gid);
    if (co && !(await askConfirm(`Thay giao-trinh.md của “${co.ten}”?`, 'Danh sách unit / lesson / chuyên đề sẽ theo file mới. Bản cũ được giữ lại trên máy chủ.', 'Thay file'))) return;
    await sua(() => goi('/api/taobai/tep', { method: 'PUT', json: { path: `${gid}/giao-trinh.md`, text } }), co ? `Đã thay giao-trinh.md của ${r.gt.ten}` : `Đã thêm giáo trình ${r.gt.ten}`);
  };
  const napThuMuc = async (fl: FileList) => {
    const files: Record<string, string> = {};
    for (const f of Array.from(fl)) { const p = ((f as any).webkitRelativePath || f.name).replace(/\\/g, '/'); if (/\.md$/i.test(p) && f.size < 512 * 1024) files[p] = await f.text(); }
    const paths = Object.keys(files), lv = paths.some(p => /^[^/]+\/giao-trinh\.md$/i.test(p)) ? 0 : 1, out: Record<string, string> = {};
    paths.forEach(p => { const q = p.split('/').slice(lv).join('/'); if (TEP_HOP_LE.test(q)) out[q] = files[p]; });
    const n = Object.keys(out).length;
    if (!n) { toast('Thư mục không có file nào đúng chỗ (giao-trinh.md, chuyen-de/…/trinh-tu.md, tf.md, kien-thuc/uN-lM.md)'); return; }
    if (!(await askConfirm(`Nạp ${n} file?`, `${Object.keys(out).slice(0, 4).join(', ')}${n > 4 ? '…' : ''}. File trùng chỗ sẽ được thay (bản cũ giữ lại trên máy chủ).`, 'Nạp'))) return;
    await sua(async () => { const r = await goi('/api/taobai/tep-nhieu', { method: 'PUT', json: { files: out } }); if (r.bo?.length) setTimeout(() => toast(`Bỏ qua ${r.bo.length} file: ${r.bo[0].why}`), 1800); return r; }, `Đã nạp ${n} file`);
  };
  const chonThuMuc = async (fl: FileList) => { const n = await nguonThuMuc(fl); await moNguon(n); doiDuLieu(); tai(n); };

  return <div className="rade tl" id="tlScr" role="dialog" aria-label="Thiết lập">
    <div className="radeh"><b>WS Editor</b><small>Thiết lập</small>
      <span className="tltabs" role="tablist">{TAB.map(([k, n]) => <button key={k} role="tab" aria-selected={tab === k} className={'tbstep' + (tab === k ? ' on' : '')} data-tab={k} onClick={() => setTb({ tl: k })}>{n}</button>)}</span>
      <span className="sp" /><span className="tbmut" id="tlSrc">{src ? src.ten : 'Đang đọc dữ liệu…'}</span>
      <button className="btn sm" id="tlKho" onClick={() => setTb({ tl: null, kho: true })}>Kho phiếu</button>
      <button className="btn sm ghost" id="tlClose" aria-label="Đóng Thiết lập" onClick={() => setTb({ tl: null })}>✕</button>
    </div>
    {src && !may ? <div className="tbwarn tlnote" id="tlFileMode">Đang mở thẳng file HTML (không qua máy chủ): màn này <b>chỉ xem</b> dữ liệu đang dùng. Nạp file, lưu khóa AI cần mở app qua máy chủ (<code>chay-lop.bat</code> → <code>/editor</code>). Không có máy chủ thì Sinh bài dùng <b>chế độ AI ngoài</b> (chép đoạn nhắc sang AI khác, dán kết quả về).
      {tab !== 'ai' ? <span className="tbrow"><Nap label="Chọn thư mục dữ liệu…" dir onFile={chonThuMuc} id="tlChonDir" />{src.mode === 'thu-muc' ? <button className="btn sm ghost" onClick={async () => { const n = nguonMau(); await moNguon(n); doiDuLieu(); tai(n); }}>Dùng bộ mẫu</button> : null}</span> : null}</div> : null}
    {may && tq && tq.quyen === false ? <div className="tbwarn tlnote" id="tlNoPerm">Máy này chỉ xem được. Sửa dữ liệu / khóa AI: dùng chính máy đang chạy máy chủ, hoặc đăng nhập giáo viên ở <code>/gv</code> trước.</div> : null}
    {err ? <p className="tbwarn" id="tlErr">{err}</p> : null}
    {tq && (tq.loi.length || tq.canhBao.length) && tab !== 'ai' ? <details className="rdnotes"><summary>{tq.loi.length} lỗi · {tq.canhBao.length} cảnh báo khi đọc dữ liệu</summary><ul>{[...tq.loi, ...tq.canhBao].map((n, i) => <li key={i}>{n.file}{n.line ? ':' + n.line : ''} · {n.msg}</li>)}</ul></details> : null}
    <div className={'tlbody' + (busy ? ' busy' : '')}>
      {tab === 'gt' && tq ? <TabGt tq={tq} quyen={!!quyen} may={may} xem={xemTep} nap={napTep} bo={boTep} napGt={napGiaoTrinh} napDir={napThuMuc} /> : null}
      {tab === 'dang' && tq ? <TabDang tq={tq} quyen={!!quyen} may={may} xem={xemTep} nap={napTep} bo={boTep} sua={sua} setXem={setXem} /> : null}
      {tab === 'ai' ? <TabAi may={may} /> : null}
    </div>
    {xem ? <div className="tbmodal" role="dialog" aria-modal="true" aria-label={xem.path} id="tlXem" onClick={e => { if (e.target === e.currentTarget) setXem(null); }}><div className="tbmbox tlxem"><h3>{xem.path}</h3><pre>{xem.text}</pre><div className="tbrow end"><button className="btn" id="tlXemClose" onClick={() => setXem(null)}>Đóng</button></div></div></div> : null}
  </div>;
}

type TabP = { tq: TongQuan; quyen: boolean; may: boolean; xem: (p: string) => void; nap: (t: TepTT, ten: string, f: FileList) => void; bo: (t: TepTT, ten: string) => void };
/** Một dòng file: tên · phiên bản · Xem / Nạp / Bỏ. */
function TepRow({ t, ten, nhan, p, extra }: { t: TepTT; ten: string; nhan: ReactNode; p: TabP; extra?: ReactNode }) {
  return <div className="tlrow" data-path={t.path}><span className="tlname">{nhan}</span>{extra}<Ver t={t} /><span className="sp" />
    {t.ver != null ? <button className="btn sm ghost" data-act="xem" onClick={() => p.xem(t.path)}>Xem</button> : null}
    {p.may ? <><Nap label={t.ver == null ? 'Nạp…' : 'Thay…'} onFile={f => p.nap(t, ten, f)} disabled={!p.quyen} cls="btn sm" id={undefined} title={`Nạp file ${ten} (.md / .txt)`} />
      {t.ver != null ? <button className="btn sm ghost" data-act="bo" disabled={!p.quyen} title="Bỏ file (giữ bản cũ trên máy chủ)" onClick={() => p.bo(t, ten)}>Bỏ</button> : null}</> : null}
  </div>;
}

function TabGt(p: TabP & { napGt: (f: FileList) => void; napDir: (f: FileList) => void }) {
  return <section className="tlsec" id="tlGt">
    <div className="tlh"><div><h3>Giáo trình</h3><p className="tbmut">Mỗi lesson một file <b>Kiến thức</b>. Cây giáo trình → unit → lesson lấy từ <code>giao-trinh.md</code> (định dạng tạm: <code>docs/TAO_BAI/DINH_DANG_TAM.md</code>).</p></div>
      {p.may ? <span className="tbrow"><Nap label="＋ Nạp giao-trinh.md" onFile={p.napGt} id="tlNapGt" disabled={!p.quyen} title="Giáo trình mới, hoặc thay danh sách unit / lesson của giáo trình có sẵn" /><Nap label="Nạp cả thư mục…" dir onFile={p.napDir} id="tlNapDir" disabled={!p.quyen} title="Một thư mục giáo trình (có giao-trinh.md, chuyen-de/, kien-thuc/)" /></span> : null}</div>
    {!p.tq.giaoTrinh.length ? <p className="tbmut">Chưa có giáo trình nào.</p> : null}
    {p.tq.giaoTrinh.map(g => <div className="tlgt" key={g.id} data-gt={g.id}>
      <div className="tlgth"><b>{g.ten}</b><span className="tbmut">mã {g.id}{g.tuoi ? ` · tuổi ${g.tuoi}` : ''} · {g.chuyenDe.length} chuyên đề</span><span className="sp" /><button className="btn sm ghost" onClick={() => p.xem(g.file)}>Xem giao-trinh.md</button></div>
      {g.units.map(u => <div className="tlunit" key={u.id}><h5>{u.ten}</h5>
        {u.lessons.map(l => <TepRow key={l.id} p={p} t={l.kienThuc} ten={`Kiến thức ${l.ten}`}
          nhan={<><span data-ls={l.id}>{l.ten}</span> <span className="tag">{g.chuyenDe.find(c => c.id === l.chuyenDe)?.ten || l.chuyenDe || '?'}</span></>}
          extra={<>{l.loi ? <span className="tag tlbad" title={l.loiMsg.join('\n')} data-loi={l.loi}>{l.loi} lỗi: chưa tạo bài được</span> : <span className="tag tlready">tạo bài được</span>}<span className="tbmut">Kiến thức</span></>} />)}
      </div>)}
      {g.units.some(u => u.lessons.some(l => l.loi)) ? <details className="rdnotes"><summary>Vì sao chưa tạo bài được</summary><ul>{g.units.flatMap(u => u.lessons.filter(l => l.loi).map(l => <li key={l.id}><b>{l.ten}</b>: {l.loiMsg.join(' · ')}</li>))}</ul></details> : null}
    </div>)}
  </section>;
}

function TabDang(p: TabP & { sua: (f: () => Promise<any>, ok: string) => Promise<void>; setXem: (x: { path: string; text: string }) => void }) {
  const napChung = async (so: number, ten: string, fl: FileList) => { let text: string; try { text = await docFile(fl[0]); } catch (e) { toast((e as Error).message); return; } await p.sua(() => goi(`/api/taobai/chung/${so}`, { method: 'PUT', json: { text } }), `Đã nạp file chung ${so} · ${ten}`); };
  const veMacDinh = async (so: number) => { if (await askConfirm(`Dùng lại file chung ${so} mặc định?`, 'Bản riêng đã nạp được giữ lại trên máy chủ (tao-bai/_cu).', 'Về mặc định')) await p.sua(() => goi(`/api/taobai/chung/${so}`, { method: 'DELETE' }), `File chung ${so}: dùng bản mặc định`); };
  return <section className="tlsec" id="tlDang">
    <div className="tlh"><div><h3>Dạng phiếu</h3><p className="tbmut">Mỗi chuyên đề của một giáo trình có <b>Trình tự</b> (các bước của phiếu) và <b>TF</b> (dạng bài, nối với dạng câu hỏi Q của app); mọi lesson cùng chuyên đề dùng chung hai file này.</p></div></div>
    {p.tq.giaoTrinh.map(g => <div className="tlgt" key={g.id} data-gt={g.id}>
      <div className="tlgth"><b>{g.ten}</b><span className="tbmut">{g.chuyenDe.length} chuyên đề</span></div>
      {g.chuyenDe.map(c => <div className="tlcd" key={c.id} data-cd={c.id}><h5>{c.ten} <span className="tbmut">· {c.soLesson} lesson</span></h5>
        <TepRow p={p} t={c.trinhTu} ten={`Trình tự ${c.ten}`} nhan="Trình tự" />
        <TepRow p={p} t={c.tf} ten={`TF ${c.ten}`} nhan="TF" />
      </div>)}
    </div>)}
    <div className="tlgt" id="tlChung"><div className="tlgth"><b>File dùng chung</b><span className="tbmut">mọi giáo trình; gửi AI khi sinh bài (1, 2, 3, 5) và chấm (4)</span></div>
      {p.tq.chung.map(c => <div className="tlrow" key={c.so} data-chung={c.so}><span className="tlname">{c.so} · {c.ten}</span>
        {c.raw == null ? <span className="tag tlno">chưa có</span> : <span className="tag ok">{c.ver}</span>}{c.raw != null ? <span className="tbmut">{c.rieng ? 'bản đã nạp' : 'bản mặc định'}</span> : null}<span className="sp" />
        {c.raw != null ? <button className="btn sm ghost" data-act="xem" onClick={() => p.setXem({ path: `File chung ${c.so} · ${c.ten}`, text: c.raw! })}>Xem</button> : null}
        {p.may ? <><Nap label={c.raw == null ? 'Nạp…' : 'Thay…'} disabled={!p.quyen} onFile={f => napChung(c.so, c.ten, f)} />{c.rieng ? <button className="btn sm ghost" disabled={!p.quyen} onClick={() => veMacDinh(c.so)}>Về mặc định</button> : null}</> : null}
      </div>)}
    </div>
  </section>;
}

type AiView = { nhaCC: 'claude' | 'openai'; modelClaude: { id: string; ten: string }[]; claude: { model: string; coKhoa: boolean; duoi: string; tuBienMoiTruong: boolean }; openai: { url: string; model: string; coKhoa: boolean; duoi: string }; san: boolean; dangDung: { nhaCC: string; model: string } | null };
export const tenModel = (v: { modelClaude?: { id: string; ten: string }[] } | null, id: string) => (v?.modelClaude || []).find(m => m.id === id)?.ten || id;

function TabAi({ may }: { may: boolean }) {
  const [v, setV] = useState<AiView | null>(null), [quyen, setQuyen] = useState(true), [err, setErr] = useState('');
  const [f, setF] = useState({ nhaCC: 'claude' as 'claude' | 'openai', ck: '', cm: '', khac: '', ou: '', ok: '', om: '' }), [thu, setThu] = useState('');
  const nap = (x: { ai: AiView; quyen: boolean }) => { setV(x.ai); setQuyen(x.quyen); const std = x.ai.modelClaude.some(m => m.id === x.ai.claude.model);
    setF({ nhaCC: x.ai.nhaCC, ck: '', cm: std ? x.ai.claude.model : '_khac', khac: std ? '' : x.ai.claude.model, ou: x.ai.openai.url, ok: '', om: x.ai.openai.model }); };
  useEffect(() => { if (may) goi('/api/taobai/thiet-lap').then(nap).catch(e => setErr(e.message)); }, [may]);
  if (!may) return <section className="tlsec" id="tlAi"><h3>AI</h3><p className="tbwarn" id="tlAiOff">Ô khóa API chỉ dùng khi mở app qua máy chủ (khóa lưu ở máy chủ, không nằm trong trình duyệt). Mở thẳng file HTML thì Sinh bài dùng <b>chế độ AI ngoài</b>: ở ngăn Duyệt bài, bấm <b>Chép đoạn nhắc</b>, dán sang AI bất kỳ, rồi dán kết quả về ô <b>Dán kết quả</b>.</p></section>;
  if (!v) return <section className="tlsec" id="tlAi"><p className="tbmut">{err || 'Đang đọc…'}</p></section>;
  const luu = async (body: any, msg: string) => { try { nap(await goi('/api/taobai/thiet-lap/ai', { method: 'PUT', json: body })); setErr(''); setThu(''); toast(msg); } catch (e) { setErr((e as Error).message); } };
  const save = () => luu({ nhaCC: f.nhaCC, claude: { key: f.ck, model: f.cm === '_khac' ? f.khac : f.cm }, openai: { url: f.ou, key: f.ok, model: f.om } }, 'Đã lưu thiết lập AI');
  const test = async () => { setThu('Đang gọi thử…'); try { const r = await goi('/api/taobai/thiet-lap/ai/thu', { method: 'POST', json: {} }); setThu(`✓ Nối được: ${r.model} trả lời “${r.text}” sau ${(r.ms / 1000).toFixed(1)} giây`); } catch (e) { setThu('✕ ' + (e as Error).message); } };
  const dirty = f.ck || f.ok || f.nhaCC !== v.nhaCC || (f.cm === '_khac' ? f.khac : f.cm) !== v.claude.model || f.ou !== v.openai.url || f.om !== v.openai.model;
  const S = (k: keyof typeof f) => (e: { target: { value: string } }) => setF(Object.assign({}, f, { [k]: e.target.value }));
  return <section className="tlsec" id="tlAi">
    <div className="tlh"><div><h3>AI dùng để sinh bài</h3><p className="tbmut">Khóa API chỉ lưu trên máy chủ (thư mục dữ liệu, file <code>tao-bai/thiet-lap.json</code>, giữ kín); trình duyệt chỉ thấy 4 ký tự cuối.</p></div></div>
    <p className={v.san ? 'tlstate ok' : 'tbwarn'} id="tlAiState">{v.san && v.dangDung ? <>Đang dùng: <b>{v.dangDung.nhaCC === 'claude' ? tenModel(v, v.dangDung.model) : `${v.dangDung.model} (tương thích OpenAI)`}</b>. Sinh bài gọi AI qua máy chủ.</> : <>Chưa có khóa cho nhà cung cấp đang chọn: Sinh bài dùng <b>chế độ AI ngoài</b> (chép đoạn nhắc / dán kết quả).</>}</p>
    {!quyen ? <p className="tbwarn">Máy này chỉ xem được (xem ghi chú ở trên).</p> : null}
    <fieldset className="tlfs" disabled={!quyen}>
      <label className="tlradio"><input type="radio" name="tlncc" value="claude" checked={f.nhaCC === 'claude'} onChange={S('nhaCC')} /> <b>Claude</b> (Anthropic)</label>
      <div className={'tlgrid' + (f.nhaCC === 'claude' ? '' : ' off')} id="tlClaude">
        <label htmlFor="tlCk">Khóa API</label><span className="tbrow"><input id="tlCk" type="password" autoComplete="off" value={f.ck} onChange={S('ck')} placeholder={v.claude.coKhoa ? `đã có khóa ${v.claude.duoi}${v.claude.tuBienMoiTruong ? ' (biến môi trường)' : ''} · gõ để thay` : 'sk-ant-…'} />
          {v.claude.coKhoa && !v.claude.tuBienMoiTruong ? <button className="btn sm ghost" id="tlCkDel" onClick={async () => { if (await askConfirm('Xóa khóa Claude?', 'Sinh bài sẽ chuyển sang chế độ AI ngoài cho tới khi nhập khóa mới.', 'Xóa khóa')) luu({ claude: { key: null } }, 'Đã xóa khóa Claude'); }}>Xóa khóa</button> : null}</span>
        <label htmlFor="tlCm">Model</label><span className="tbrow"><select id="tlCm" value={f.cm} onChange={S('cm')}>{v.modelClaude.map(m => <option key={m.id} value={m.id}>{m.ten}</option>)}<option value="_khac">Model khác…</option></select>
          {f.cm === '_khac' ? <input id="tlCmKhac" value={f.khac} onChange={S('khac')} placeholder="mã model, vd claude-opus-5-5" /> : <span className="tbmut">{f.cm}</span>}</span>
      </div>
      <label className="tlradio"><input type="radio" name="tlncc" value="openai" checked={f.nhaCC === 'openai'} onChange={S('nhaCC')} /> <b>Tương thích OpenAI</b> <span className="tbmut">(OpenAI, Gemini qua cổng OpenAI, OpenRouter, máy chủ AI riêng… có API <code>/chat/completions</code>)</span></label>
      <div className={'tlgrid' + (f.nhaCC === 'openai' ? '' : ' off')} id="tlOpenai">
        <label htmlFor="tlOu">Địa chỉ API</label><input id="tlOu" value={f.ou} onChange={S('ou')} placeholder="https://api.openai.com/v1" />
        <label htmlFor="tlOk">Khóa API</label><span className="tbrow"><input id="tlOk" type="password" autoComplete="off" value={f.ok} onChange={S('ok')} placeholder={v.openai.coKhoa ? `đã có khóa ${v.openai.duoi} · gõ để thay` : 'khóa của nhà cung cấp'} />
          {v.openai.coKhoa ? <button className="btn sm ghost" onClick={() => luu({ openai: { key: null } }, 'Đã xóa khóa')}>Xóa khóa</button> : null}</span>
        <label htmlFor="tlOm">Model</label><input id="tlOm" value={f.om} onChange={S('om')} placeholder="vd gpt-5.1-mini" />
      </div>
      <div className="tbrow"><button className="btn pri" id="tlAiSave" disabled={!dirty} onClick={save}>Lưu</button><button className="btn" id="tlAiTest" disabled={!!dirty || !v.san} title={dirty ? 'Lưu trước rồi thử' : !v.san ? 'Chưa có khóa' : 'Gửi một câu ngắn để xem khóa / model dùng được không'} onClick={test}>Thử kết nối</button>
        {thu ? <span id="tlAiThu" className={thu.startsWith('✓') ? 'tlok' : thu.startsWith('✕') ? 'tlerr' : 'tbmut'}>{thu}</span> : null}</div>
    </fieldset>
    {err ? <p className="tbwarn" id="tlAiErr">{err}</p> : null}
    <p className="tbmut">Model dùng cho <b>Sinh bài</b> (và sau này AI chấm). Chọn Sonnet 5.5 hay Haiku 5.5 làm mặc định sẽ chốt sau khi thử thật (kế hoạch T6). Mỗi lượt gọi AI ghi vào nhật ký máy chủ (<code>tao-bai/nhat-ky.jsonl</code>: model, số token, thời gian).</p>
  </section>;
}
