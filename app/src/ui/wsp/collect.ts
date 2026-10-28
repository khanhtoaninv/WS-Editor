// GĐ2: gom phiếu đang mở thành đầu vào gói .wsp (shared/src/wsp.ts): trang HTML tĩnh, CSS trang, phông, ảnh,
// chỗ trả lời + đáp án, phiếu gốc. Ảnh nhúng (data:) và ảnh theo đường dẫn được tách ra media/; phông lấy theo
// font phiếu (fonts/…), chỉ tải được khi app chạy qua http (máy chủ lớp thử: npm run lop).
import { sha256, type Key, type Slot, type WspInput } from '../../../../shared/src/index.ts';
import { actions } from '../actions';

export type Src = { ws: any; pages: string[]; over: number; slots: Slot[]; key: Key; warn: string[]; staticOnly: number; font: { name: string; css: string } };
export type Collected = { input: WspInput; blockers: string[]; warnings: string[] };

const esc = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const EXT: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg' };

function dataBytes(u: string): { type: string; bytes: Uint8Array } | null {
  const m = /^data:([^;,]+)(;base64)?,(.*)$/s.exec(u); if (!m) return null;
  const body = m[2] ? atob(m[3]) : decodeURIComponent(m[3]);
  const b = new Uint8Array(body.length); for (let i = 0; i < body.length; i++) b[i] = body.charCodeAt(i) & 255;
  return { type: m[1].toLowerCase(), bytes: m[2] ? b : new TextEncoder().encode(body) };
}
async function fetchBytes(u: string): Promise<{ type: string; bytes: Uint8Array } | null> {
  try { const r = await fetch(u); if (!r.ok) return null; return { type: (r.headers.get('content-type') || '').split(';')[0].trim().toLowerCase(), bytes: new Uint8Array(await r.arrayBuffer()) }; } catch { return null; }
}
const isPlaceholder = (u: string) => /^data:image\/svg\+xml/i.test(u) && u.length < 4000;   // khung ảnh trống (PH) vẽ bằng SVG nhỏ

// CSS trang: luật trong styles.css có mọi lớp đều dùng trên trang; :root (màu sáng); @font-face của font phiếu
function pageCss(html: string, fontCss: string): { css: string; fonts: string[] } {
  const used = new Set<string>(['paper', 'page', 'flow', 'pfoot', 'wsp-pg']);
  for (const m of html.matchAll(/class="([^"]*)"/g)) m[1].split(/\s+/).forEach(c => c && used.add(c));
  const fams = new Set([...fontCss.matchAll(/"([^"]+)"/g)].map(m => m[1].toLowerCase()));
  const out: string[] = [], fonts: string[] = [];
  const BAD = /#|:hover|:focus|:active|::selection|::-webkit|\[contenteditable|\[data-node\]|\[data-theme/;
  for (const sh of Array.from(document.styleSheets)) {
    let rules: CSSRuleList; try { rules = sh.cssRules; } catch { continue; }
    for (const r of Array.from(rules)) {
      if (r instanceof CSSFontFaceRule) {
        const fam = r.style.getPropertyValue('font-family').replace(/['"]/g, '').trim().toLowerCase();
        if (!fams.has(fam)) continue;
        const u = /url\(\s*["']?([^"')]+)["']?\s*\)/.exec(r.cssText); if (!u) continue;
        const file = u[1].split('/').pop()!;
        fonts.push(file); out.push(r.cssText.replace(u[0], `url(fonts/${file})`));
        continue;
      }
      if (!(r instanceof CSSStyleRule)) continue;
      const sel = r.selectorText;
      if (sel === ':root') { out.push(r.cssText); continue; }
      if (/^\*(\s*,\s*\*?::?(before|after))*$/.test(sel)) { out.push(r.cssText); continue; }
      const keep = sel.split(',').map(s => s.trim()).filter(p => {
        if (BAD.test(p) || /^(html|body)\b/.test(p)) return false;
        const cls = [...p.replace(/:not\([^)]*\)/g, '').matchAll(/\.([\w-]+)/g)].map(m => m[1]);
        return cls.length > 0 && cls.every(c => used.has(c)) && !cls.some(c => c === 'sel' || c === 'cur' || c === 'stage' || c === 'show');
      });
      if (keep.length) out.push(`${keep.join(',')}{${r.style.cssText}}`);
    }
  }
  out.push(`:root{--f-sheet:${fontCss}}`);
  out.push('.wsp-pg{position:relative;left:auto;top:auto;transform:none;box-shadow:none;overflow:hidden;background:#fff;color:var(--ink)}');
  return { css: out.join('\n'), fonts };
}

export async function collect(): Promise<Collected | null> {
  const s = actions.wspSource() as Src | null; if (!s) return null;
  const blockers: string[] = [], warnings: string[] = [...s.warn];
  if (s.over) blockers.push(`${s.over} trang có Task tràn trang: sửa cho hết tràn rồi xuất`);
  if (!s.slots.length) warnings.push('phiếu không có chỗ trả lời nào: học sinh chỉ xem');
  const n = s.pages.length, title = s.ws.title || 'Phiếu';
  let pages = s.pages.map((h, i) => `<div class="page paper wsp-pg" lang="vi" data-page="${i}"><div class="flow">${h}</div><div class="pfoot"><span>${esc(title)}</span><span>Trang ${i + 1}/${n}</span></div></div>`);
  // bỏ lớp chỉ dùng khi soạn
  pages = pages.map(h => h.replace(/\sclass="([^"]*)"/g, (_, c: string) => { const k = c.split(/\s+/).filter(x => x && x !== 'sel' && x !== 'cur').join(' '); return k ? ` class="${k}"` : ''; }));
  // ảnh → media/
  const media: Record<string, Uint8Array> = {}, byUrl = new Map<string, string>();
  const urls = new Set<string>();
  pages.forEach(h => { for (const m of h.matchAll(/\ssrc="([^"]+)"/g)) urls.add(m[1]); for (const m of h.matchAll(/url\((?:&quot;|["'])?([^"')&]+)(?:&quot;|["'])?\)/g)) urls.add(m[1]); });
  for (const u0 of urls) {
    const u = u0.replace(/&amp;/g, '&');
    if (isPlaceholder(u)) continue;
    const got = u.startsWith('data:') ? dataBytes(u) : await fetchBytes(u);
    if (!got) { blockers.push(`không lấy được ảnh ${u.slice(0, 60)}${u.length > 60 ? '…' : ''}: tải ảnh lên lại trong khung ảnh rồi xuất`); continue; }
    const ext = EXT[got.type] || (/\.(png|jpe?g|webp|gif|svg)(\?|$)/i.exec(u)?.[1].toLowerCase().replace('jpeg', 'jpg'));
    if (!ext) { blockers.push(`ảnh dạng lạ (${got.type || 'không rõ'}): ${u.slice(0, 60)}`); continue; }
    if (ext === 'svg' && /<script|\son[a-z]+\s*=|javascript:/i.test(new TextDecoder().decode(got.bytes))) { blockers.push('ảnh SVG có mã chạy: thay bằng ảnh PNG / JPG'); continue; }
    const name = `${(await sha256(got.bytes)).slice(0, 16)}.${ext}`;
    media[name] = got.bytes; byUrl.set(u0, `media/${name}`);
  }
  pages = pages.map(h => { byUrl.forEach((to, from) => { h = h.split(from).join(to); }); return h; });
  // CSS + phông
  const pc = pageCss(pages.join('\n'), s.font.css), fonts: Record<string, Uint8Array> = {};
  let css = pc.css;
  for (const f of [...new Set(pc.fonts)]) {
    const got = await fetchBytes(new URL(`fonts/${f}`, location.href).href);
    if (got && got.bytes.length > 100) fonts[f] = got.bytes;
    else css = css.split('\n').filter(l => !l.includes(`url(fonts/${f})`)).join('\n');
  }
  if (pc.fonts.length && !Object.keys(fonts).length) warnings.push(`gói chưa kèm phông ${s.font.name} (app đang mở thẳng từ file; mở app qua máy chủ lớp thử "npm run lop" để kèm phông). Máy khác sẽ hiện phông thay thế`);
  return {
    input: { sheetId: s.ws.id, version: 1, title, age: s.ws.age, pages, css, fonts, media, slots: s.slots, key: s.key, source: s.ws, staticOnly: s.staticOnly, warnings, docMode: document.compatMode === 'BackCompat' ? 'quirks' : 'standards' },
    blockers, warnings,
  };
}
