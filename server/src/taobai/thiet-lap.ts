// Module Tạo bài v128: THIẾT LẬP AI của máy chủ (màn Thiết lập › AI). Lưu ở <dữ liệu máy chủ>/tao-bai/thiet-lap.json.
// Khóa API chỉ nằm ở máy chủ (đặc tả 8.2): API trả về trình duyệt chỉ báo "có khóa" + 4 ký tự cuối, không bao giờ trả khóa.
// Không đặt khóa ở màn Thiết lập thì dùng biến môi trường ANTHROPIC_API_KEY (như Insight AI); model mặc định: TAOBAI_MODEL.
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { HttpError } from '../http.ts';

export type NhaCC = 'claude' | 'openai';
/** Hai model Claude để sẵn (người dùng chọn 29/10/2026); ô "Model khác" nhập tay được. */
export const MODEL_CLAUDE = [{ id: 'claude-sonnet-5-5', ten: 'Claude Sonnet 5.5' }, { id: 'claude-haiku-5-5', ten: 'Claude Haiku 5.5' }];
export const MODEL_MAC_DINH = () => process.env.TAOBAI_MODEL || 'claude-sonnet-5-5';

export interface ThietLapAi {
  nhaCC: NhaCC;
  claude: { key?: string; model: string };
  openai: { url: string; key?: string; model: string };     // "Tương thích OpenAI": mọi hãng có API kiểu /v1/chat/completions
}
/** Cấu hình gọi AI đang dùng (đủ để gọi), null = chưa có khóa. */
export type AiDung = { nhaCC: NhaCC; url: string; key: string; model: string };

const macDinh = (): ThietLapAi => ({ nhaCC: 'claude', claude: { model: MODEL_MAC_DINH() }, openai: { url: '', model: '' } });
const duoi = (k?: string) => (k ? '…' + k.slice(-4) : '');
const sach = (s: unknown, n = 200) => String(s ?? '').trim().slice(0, n);

export class ThietLap {
  private f: string; private v: ThietLapAi;
  constructor(data: string) {
    this.f = join(data, 'tao-bai', 'thiet-lap.json'); this.v = macDinh();
    if (existsSync(this.f)) { try { const j = JSON.parse(readFileSync(this.f, 'utf8')); this.v = { ...this.v, ...j, claude: { ...this.v.claude, ...(j.claude || {}) }, openai: { ...this.v.openai, ...(j.openai || {}) } }; } catch { /* hỏng: dùng mặc định */ } }
  }
  private luu() { mkdirSync(join(this.f, '..'), { recursive: true }); writeFileSync(this.f, JSON.stringify(this.v, null, 1)); }
  /** Bản gửi về trình duyệt: không có khóa. */
  xem() {
    const env = process.env.ANTHROPIC_API_KEY || '', c = this.v.claude, o = this.v.openai, d = this.dung();
    return {
      nhaCC: this.v.nhaCC, modelClaude: MODEL_CLAUDE,
      claude: { model: c.model, coKhoa: !!(c.key || env), duoi: duoi(c.key || env), tuBienMoiTruong: !c.key && !!env },
      openai: { url: o.url, model: o.model, coKhoa: !!o.key, duoi: duoi(o.key) },
      san: !!d, dangDung: d ? { nhaCC: d.nhaCC, model: d.model } : null,
    };
  }
  /** Sửa thiết lập. key: chuỗi rỗng / không gửi = giữ khóa cũ; null = xóa khóa. */
  sua(b: any) {
    const v = this.v;
    if (b.nhaCC !== undefined) { if (b.nhaCC !== 'claude' && b.nhaCC !== 'openai') throw new HttpError(400, 'nhà cung cấp không hợp lệ'); v.nhaCC = b.nhaCC; }
    const key = (x: any, cur?: string) => x === null ? undefined : typeof x === 'string' && x.trim() ? sach(x, 400) : cur;
    if (b.claude) { v.claude.key = key(b.claude.key, v.claude.key); if (b.claude.model !== undefined) v.claude.model = sach(b.claude.model, 80) || MODEL_MAC_DINH(); }
    if (b.openai) {
      v.openai.key = key(b.openai.key, v.openai.key);
      if (b.openai.url !== undefined) { const u = sach(b.openai.url, 300); if (u && !/^https?:\/\/[^\s]+$/i.test(u)) throw new HttpError(400, 'địa chỉ API phải bắt đầu bằng http:// hoặc https://'); v.openai.url = u; }
      if (b.openai.model !== undefined) v.openai.model = sach(b.openai.model, 80);
    }
    this.luu(); return this.xem();
  }
  /** Cấu hình gọi AI hiện dùng (nhà cung cấp đang chọn). */
  dung(): AiDung | null {
    const v = this.v;
    if (v.nhaCC === 'openai') { const o = v.openai; return o.key && o.url && o.model ? { nhaCC: 'openai', url: o.url, key: o.key, model: o.model } : null; }
    const key = v.claude.key || process.env.ANTHROPIC_API_KEY || '';
    return key ? { nhaCC: 'claude', url: process.env.LOP_AI_URL || 'https://api.anthropic.com', key, model: v.claude.model || MODEL_MAC_DINH() } : null;
  }
}

/** Gọi AI một lượt (sinh bài, sửa lỗi, thử kết nối). Trả chữ + model + số token. Lỗi: thông báo tiếng Việt cho giáo viên. */
export async function goiAi(c: AiDung, m: { system?: string; prompt: string; maxTokens?: number }, ms = 180000): Promise<{ text: string; model: string; vao: number; ra: number }> {
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), ms);
  try {
    let r: Response;
    if (c.nhaCC === 'claude') {
      r = await fetch(c.url.replace(/\/+$/, '') + '/v1/messages', { method: 'POST', signal: ctl.signal,
        headers: { 'content-type': 'application/json', 'x-api-key': c.key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: c.model, max_tokens: m.maxTokens || 4000, ...(m.system ? { system: m.system } : {}), messages: [{ role: 'user', content: m.prompt }] }) });
    } else {
      r = await fetch(c.url.replace(/\/+$/, '') + '/chat/completions', { method: 'POST', signal: ctl.signal,
        headers: { 'content-type': 'application/json', authorization: 'Bearer ' + c.key },
        body: JSON.stringify({ model: c.model, messages: [...(m.system ? [{ role: 'system', content: m.system }] : []), { role: 'user', content: m.prompt }] }) });
    }
    const j: any = await r.json().catch(() => ({}));
    if (!r.ok) {
      const msg = j?.error?.message || (typeof j?.error === 'string' ? j.error : '');
      throw new HttpError(502, r.status === 401 || r.status === 403 ? 'khóa API không đúng hoặc không có quyền (xem Thiết lập › AI)' : r.status === 404 ? `không có model “${c.model}” hoặc sai địa chỉ API${msg ? ': ' + msg : ''}`
        : r.status === 429 ? 'AI đang quá tải hoặc hết hạn mức (429), thử lại sau' : r.status === 529 ? 'AI đang quá tải (529), thử lại sau' : `AI báo lỗi ${r.status}${msg ? ': ' + msg : ''}`);
    }
    const text = c.nhaCC === 'claude' ? (j.content || []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('\n').trim() : String(j?.choices?.[0]?.message?.content || '').trim();
    if (c.nhaCC === 'claude' && j.stop_reason === 'refusal') throw new HttpError(502, 'AI từ chối trả lời yêu cầu này');
    if (!text) throw new HttpError(502, 'AI không trả lời chữ nào');
    const u = j.usage || {};
    return { text, model: j.model || c.model, vao: u.input_tokens ?? u.prompt_tokens ?? 0, ra: u.output_tokens ?? u.completion_tokens ?? 0 };
  } catch (e) {
    if (e instanceof HttpError) throw e;
    throw new HttpError(502, (e as Error).name === 'AbortError' ? `AI trả lời quá lâu (quá ${Math.round(ms / 60000)} phút)` : `không gọi được AI: ${(e as Error).message}`);
  } finally { clearTimeout(t); }
}
