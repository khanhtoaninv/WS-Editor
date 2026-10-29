// Module Tạo bài: tách trường meta khỏi MD một bài do AI viết, TRƯỚC khi đưa vào bộ đọc MD của app (core/md.js).
// Đặc tả mục 8.1 bước 3: AI trả một khối MD của MỘT Task + "Mục tiêu:", "Ngữ cảnh:". Bộ đọc của app không biết hai trường này:
// để nguyên thì chúng thành hai câu hỏi và đáp án lệch đi hai câu (phát hiện T0, tests/taobai/test_q12.py).

export interface TachMeta { md: string; goal: string; ctx: string; notes: string[]; tasks: number }

const META = /^\s*(mục tiêu|ngữ cảnh|goal|context)\s*:\s*(.*)$/i;

export function tachMeta(src: string): TachMeta {
  const L = String(src || '').replace(/\r/g, '').split('\n'), out: string[] = [], notes: string[] = [];
  let goal = '', ctx = '', tasks = 0, inAns = false;
  for (const l of L) {
    const t = l.trim();
    if (/^##(?!#)\s*task\b/i.test(t)) { tasks++; inAns = false; }
    else if (/^##(?!#)\s*(đáp án|answers?|answer key)\b/i.test(t)) inAns = true;
    const m = !inAns && tasks > 0 ? META.exec(l) : null;
    if (m) {
      const isGoal = /mục tiêu|goal/i.test(m[1]), v = m[2].trim();
      if ((isGoal ? goal : ctx) && v) notes.push(`có hai dòng “${m[1]}:”, giữ dòng đầu`);
      else if (isGoal) goal = v; else ctx = v;
      continue;
    }
    out.push(l);
  }
  if (!tasks) notes.push('không có dòng “## Task: …”');
  else if (tasks > 1) notes.push(`có ${tasks} dòng “## Task:”, mỗi lần sinh chỉ được một bài`);
  if (tasks && !goal) notes.push('thiếu “Mục tiêu:”');
  if (tasks && !ctx) notes.push('thiếu “Ngữ cảnh:”');
  return { md: out.join('\n'), goal, ctx, notes, tasks };
}
