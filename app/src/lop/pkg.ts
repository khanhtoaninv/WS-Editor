// Nạp phần đề của một gói từ máy chủ để trình xem dùng: CSS trang (phông, ảnh trỏ về máy chủ) + nội dung .flow từng trang.
import { api } from './api';
import type { Slot } from '../../../shared/src/index.ts';

const loaded = new Set<string>();
export type Pkg = { id: string; title: string; pages: string[]; slots: Slot[] };

export async function loadPkg(id: string, files: string[], title: string, slots: Slot[]): Promise<Pkg> {
  const base = `/api/goi/${encodeURIComponent(id)}/f/`;
  const fix = (s: string) => s.replace(/(src="|url\((?:&quot;|["'])?)((?:media|fonts)\/[\w.-]+)/g, (_, a, p) => a + base + p);
  if (!loaded.has(id)) {
    const r = await fetch(base + 'pages/style.css'); if (!r.ok) throw new Error('Không tải được kiểu trang của phiếu');
    // CSS của gói chỉ áp trong khung trình xem (đã có .paper / .vpage), :root của gói không đè màu của trang lớp thử
    const css = fix((await r.text()).replace(/:root\{--f-sheet:/g, '#wsShow{--f-sheet:'));
    const st = document.createElement('style'); st.dataset.goi = id; st.textContent = css; document.head.appendChild(st); loaded.add(id);
  }
  const pages = await Promise.all(files.map(async f => {
    const r = await fetch(base + f); if (!r.ok) throw new Error('Không tải được trang ' + f);
    const box = document.createElement('div'); box.innerHTML = fix(await r.text());
    const flow = box.querySelector('.flow'); return flow ? flow.innerHTML : box.innerHTML;
  }));
  return { id, title, pages, slots };
}
export const loadKey = (id: string) => api(`/api/goi/${encodeURIComponent(id)}/dap-an`);
