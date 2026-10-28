// Gọi API máy chủ lớp thử (server/src/app.ts). Lỗi máy chủ trả { loi } → ném Error với câu tiếng Việt.
export async function api<T = any>(path: string, o: { method?: string; json?: unknown; body?: BodyInit } = {}): Promise<T> {
  const r = await fetch(path, {
    method: o.method || (o.json !== undefined || o.body ? 'POST' : 'GET'),
    headers: o.json !== undefined ? { 'content-type': 'application/json' } : o.body ? { 'content-type': 'application/octet-stream' } : {},
    body: o.json !== undefined ? JSON.stringify(o.json) : o.body,
  }).catch(() => { throw new Error('Không nối được máy chủ lớp thử (máy chủ đã tắt hoặc mất wifi?)'); });
  const t = await r.text(); let j: any = null; try { j = t ? JSON.parse(t) : null; } catch { /* */ }
  if (!r.ok) { const e = new Error(j && j.loi ? j.loi : `Lỗi ${r.status}`) as Error & { status?: number }; e.status = r.status; throw e; }
  return j as T;
}
// Kênh sự kiện trực tiếp: tự nối lại khi rớt mạng (EventSource làm sẵn)
export function events(path: string, on: Record<string, (d: any) => void>) {
  const es = new EventSource(path);
  Object.entries(on).forEach(([k, f]) => es.addEventListener(k, e => { try { f(JSON.parse((e as MessageEvent).data)); } catch { /* */ } }));
  return () => es.close();
}
export const fmtTime = (s?: string | null) => s ? new Date(s).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';
export const fmtDate = (s?: string | null) => s ? new Date(s).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';
