// v122 Insight AI: gửi đoạn nhắc (chỉ số liệu ẩn danh, shared/src/baocao.ts aiPrompt) tới Claude Messages API.
// Gọi HTTP thẳng (máy chủ lớp thử không cài gói npm nào). Khóa: biến môi trường ANTHROPIC_API_KEY; mẫu: LOP_AI_MODEL.
// LOP_AI_URL chỉ để test (máy chủ giả).
export const AI_MODEL = 'claude-opus-5-5';

export async function askAi(ai: { key: string; model?: string }, prompt: string): Promise<string> {
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 120000);
  try {
    const r = await fetch((process.env.LOP_AI_URL || 'https://api.anthropic.com') + '/v1/messages', {
      method: 'POST', signal: ctl.signal,
      headers: { 'content-type': 'application/json', 'x-api-key': ai.key, 'anthropic-version': '2026-10-21', 'anthropic-beta': 'server-side-fallback-2026-07-01' },
      body: JSON.stringify({ model: ai.model || AI_MODEL, max_tokens: 4000, output_config: { effort: 'low' }, fallbacks: 'default', messages: [{ role: 'user', content: prompt }] }),
    });
    const j: any = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(r.status === 401 ? 'khóa API không đúng (ANTHROPIC_API_KEY)' : r.status === 429 ? 'AI đang quá tải hoặc hết hạn mức, thử lại sau' : `AI báo lỗi ${r.status}: ${j?.error?.message || ''}`.trim());
    if (j.stop_reason === 'refusal') throw new Error('AI từ chối trả lời yêu cầu này');
    const text = (j.content || []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('\n').trim();
    if (!text) throw new Error('AI không trả lời');
    return text;
  } catch (e) {
    throw new Error((e as Error).name === 'AbortError' ? 'AI trả lời quá lâu (quá 2 phút)' : (e as Error).message);
  } finally { clearTimeout(t); }
}
