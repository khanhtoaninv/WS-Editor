// GĐ1a trình chiếu: đầu vào của trình xem và cách tách trang thành các mảnh Task.
// Trình xem chỉ nhận HTML các trang đã dàn + chỗ trả lời + đáp án (không đọc trạng thái WS Editor), để sau này
// chuyển nguyên sang TeacherResource (docs/TUONG_TAC/KE_HOACH_GD1A.md mục 1).
import type { Key, Slot } from '../../../shared/src/index.ts';

export type ShowData = {
  title: string;
  pages: string[];          // HTML bên trong .flow của từng trang A4 (core/layout renderTask)
  slots: Slot[];
  key: Key;
  start?: string | null;    // mã Task mở đầu (Task đang chọn trong WS Editor)
  store?: string;           // tên chỗ lưu nét vẽ trên máy (mặc định theo tiêu đề phiếu)
  notes?: Record<string, string[]>;   // v113: ghi chú theo Task (chưa có đáp án → chấm tay, chỉ xem…), hiện trên Task khi chiếu
};

export type Frag = { task: string; page: number; k: number; html: string };   // k = mảnh thứ k của Task (0 = mảnh đầu)
export type TaskInfo = { id: string; num: string; title: string; frags: Frag[] };
export type Prep = { pages: string[]; tasks: TaskInfo[]; pageOf: Record<string, number>; hash: string };

// Băm ngắn nội dung để biết phiếu đã sửa (nét vẽ cũ không còn đúng chỗ)
export function hashOf(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
}

// Đánh số mảnh (data-frag) cho mọi section Task trên từng trang, gom các mảnh theo Task
export function prep(d: ShowData): Prep {
  const tasks: TaskInfo[] = [], byId: Record<string, TaskInfo> = {}, pageOf: Record<string, number> = {};
  const pages = d.pages.map((html, p) => {
    const box = document.createElement('div'); box.innerHTML = html;
    box.querySelectorAll<HTMLElement>('section.task[data-task]').forEach(sec => {
      const id = sec.dataset.task!;
      let t = byId[id];
      if (!t) {
        const num = sec.querySelector('.g0 .num')?.textContent?.trim() || String(tasks.length + 1);
        const title = sec.querySelector('.g0 .ttl')?.textContent?.trim() || '';
        t = byId[id] = { id, num, title, frags: [] }; tasks.push(t); pageOf[id] = p;
      }
      sec.dataset.frag = String(t.frags.length);
      t.frags.push({ task: id, page: p, k: t.frags.length, html: sec.outerHTML });
    });
    return box.innerHTML;
  });
  return { pages, tasks, pageOf, hash: hashOf(d.pages.join('\n')) };
}
