// Báo cáo sau một phiên (Khu thử nghiệm Lớp học v121–v122; TeacherResource GĐ4 dùng lại): hàm thuần, chỉ cần slots + key +
// bài làm đã chấm (kèm điểm sửa tay). Lớp: điểm, phân bố, đúng / sai từng câu, câu sai nhiều + đáp án sai hay gặp, theo Task /
// dạng bài, ai chưa nộp. Từng em: câu đúng / sai, so với lớp, dạng mạnh / yếu. Nhận xét theo quy tắc cố định (insight).
import type { Answers, AnswerValue, Key, KeyEntry, Overrides, Slot } from './types.ts';
import { grade, isBlank } from './grade.ts';

export const Q_NAME: Record<string, string> = { Q1: 'Điền từ', Q2: 'Viết câu', Q3: 'Chọn A/B/C', Q4: 'Chọn trong câu', Q5: 'Đúng / Sai', Q6: 'Nhìn ảnh viết', Q7: 'Chọn ảnh', Q8: 'Nối', Q9: 'Tô chữ', Q10: 'Bảng', Q11: 'Lưới', Q12: 'Viết tự do' };

export type Sub = { hs: string; ten: string; nop: boolean; vao: boolean; answers: Answers; overrides: Overrides; xong: boolean; nhanXet?: string };
export type TaskMeta = { id: string; num: string; title: string };
export type WrongAns = { text: string; n: number };
export type SlotStat = { id: string; task: string; taskNum: string; label: string; q?: string; interaction: string; manual: boolean; max: number;
  n: number; correct: number; partial: number; wrong: number; blank: number; pending: number; pct: number; wrongs: WrongAns[]; key: string };
export type GroupStat = { id: string; name: string; pct: number; n: number };
export type StuRow = { hs: string; ten: string; nop: boolean; vao: boolean; xong: boolean; score: number; max: number; pct: number; pending: number; blank: number };
export type Insight = { muc: 'cao' | 'vua' | 'tot'; text: string };
export type ClassReport = {
  nLop: number; nNop: number; nVao: number; avg: number; median: number; hi: number; lo: number; maxScore: number;
  dist: number[];   // số em theo % điểm: 0–19, 20–39, 40–59, 60–79, 80–100
  slots: SlotStat[]; tasks: GroupStat[]; qs: GroupStat[]; top: SlotStat[]; students: StuRow[];
  chuaNop: string[]; chuaVao: string[]; pending: number; insights: Insight[];
};
export type ItemRow = { id: string; taskNum: string; label: string; q?: string; answer: string; key: string; score: number | null; max: number; classPct: number; status: string; comment?: string };
export type StudentReport = {
  hs: string; ten: string; nop: boolean; xong: boolean; nhanXet: string; score: number; max: number; pct: number; classAvg: number; rank: number; of: number;
  tasks: (GroupStat & { classPct: number })[]; qs: (GroupStat & { classPct: number })[];
  right: ItemRow[]; wrong: ItemRow[]; blank: ItemRow[]; pending: ItemRow[]; insights: Insight[];
};

const r1 = (x: number) => Math.round(x * 10) / 10;
const pctOf = (a: number, b: number) => b > 0 ? r1(a / b * 100) : 0;
const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();

// Task: số + tiêu đề lấy từ HTML trang (đầu Task: .g0 .num / .ttl)
export function taskInfo(pages: string[]): TaskMeta[] {
  const out: TaskMeta[] = [], seen = new Set<string>(), strip = (h: string) => h.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
  for (const h of pages) for (const m of h.matchAll(/<section[^>]*data-task="([^"]+)"[^>]*>/g)) {
    const id = m[1]; if (seen.has(id)) continue; seen.add(id);
    const rest = h.slice(m.index! + m[0].length, m.index! + m[0].length + 4000);
    const num = /class="num"[^>]*>([\s\S]*?)<\//.exec(rest), ttl = /class="ttl"[^>]*>([\s\S]*?)<\/(?:span|div|b|h\d)>/.exec(rest);
    out.push({ id, num: num ? strip(num[1]) : String(out.length + 1), title: ttl ? strip(ttl[1]) : '' });
  }
  return out;
}

// Chữ hiển thị của một câu trả lời / đáp án đúng
export function answerText(s: Slot, v: AnswerValue | null | undefined): string {
  if (isBlank(v)) return '';
  const o = (id: string) => (s.options || []).find(x => x.id === id);
  if (s.interaction === 'choice-one' || s.interaction === 'choice-many' || s.interaction === 'match')
    return ([] as string[]).concat(v as string | string[]).map(id => { const x = o(id); return x ? (x.text || (x.img ? '(ảnh ' + id + ')' : id)) : id; }).join(', ');
  if (s.interaction === 'find') return 'đã khoanh ' + String(v).replace('-', ' → ');
  return Array.isArray(v) ? v.join(', ') : String(v);
}
export function keyText(s: Slot, k: KeyEntry | undefined): string {
  if (!k) return '';
  if (k.accept && k.accept.length) return k.accept[0];
  if (k.sample) return k.sample;
  if (k.correct != null) return s.interaction === 'find' ? s.label : answerText(s, k.correct as AnswerValue);
  return '';
}

export function classReport(slots: Slot[], key: Key, subs: Sub[], tasks: TaskMeta[] = []): ClassReport {
  const pool = subs.filter(s => s.nop).length ? subs.filter(s => s.nop) : subs.filter(s => s.vao);
  const graded = pool.map(s => ({ s, g: grade(slots, key, s.answers, s.overrides) }));
  const tnum = new Map(tasks.map(t => [t.id, t])), taskNum = (id: string) => tnum.get(id)?.num || '?';
  const slotStats: SlotStat[] = slots.map(sl => {
    const k = key[sl.id], manual = (k?.grading ?? sl.grading) === 'manual', st: SlotStat = { id: sl.id, task: sl.task, taskNum: taskNum(sl.task), label: sl.label, q: sl.q, interaction: sl.interaction, manual, max: 0,
      n: 0, correct: 0, partial: 0, wrong: 0, blank: 0, pending: 0, pct: 0, wrongs: [], key: keyText(sl, k) };
    let sc = 0, mx = 0; const tally = new Map<string, WrongAns>();
    for (const { s, g } of graded) {
      const r = g.perSlot[sl.id]; if (!r || r.max <= 0) continue;
      st.max = r.max; st.n++;
      if (r.status === 'correct') st.correct++; else if (r.status === 'partial') st.partial++; else if (r.status === 'wrong') st.wrong++; else if (r.status === 'blank') st.blank++; else if (r.status === 'pending') st.pending++;
      if (r.status !== 'pending') { sc += r.score ?? 0; mx += r.max; }
      if (r.status === 'wrong' && sl.interaction !== 'text-long') {   // bài viết dài không gom (không phải đáp án sai "hay gặp")
        const t = answerText(sl, s.answers[sl.id]), nk = norm(t); const w = tally.get(nk) || { text: t, n: 0 }; w.n++; tally.set(nk, w);
      }
    }
    st.pct = pctOf(sc, mx); st.wrongs = [...tally.values()].sort((a, b) => b.n - a.n).slice(0, 3);
    return st;
  }).filter(x => x.n > 0);
  const group = (keyOf: (s: Slot) => string | undefined, name: (id: string) => string): GroupStat[] => {
    const m = new Map<string, { sc: number; mx: number; n: number }>();
    for (const sl of slots) { const id = keyOf(sl); if (!id) continue; const e = m.get(id) || { sc: 0, mx: 0, n: 0 }; e.n++; m.set(id, e);
      for (const { g } of graded) { const r = g.perSlot[sl.id]; if (r && r.max > 0 && r.status !== 'pending') { e.sc += r.score ?? 0; e.mx += r.max; } } }
    return [...m.entries()].filter(([, e]) => e.mx > 0).map(([id, e]) => ({ id, name: name(id), pct: pctOf(e.sc, e.mx), n: e.n }));
  };
  const tg = group(s => s.task, id => { const t = tnum.get(id); return t ? `Task ${t.num}${t.title ? ': ' + t.title : ''}` : id; });
  const qg = group(s => s.q, id => Q_NAME[id] || id);
  const students: StuRow[] = subs.map(s => { const g = grade(slots, key, s.answers, s.overrides), eff = g.max - pendMax(g, key, slots);
    return { hs: s.hs, ten: s.ten, nop: s.nop, vao: s.vao, xong: s.xong, score: g.score, max: g.max, pct: pctOf(g.score, eff > 0 ? eff : g.max), pending: g.pendingManual, blank: g.counts.blank }; });
  const done = students.filter(s => pool.some(p => p.hs === s.hs)), ps = done.map(s => s.pct).sort((a, b) => a - b);
  const dist = [0, 0, 0, 0, 0]; ps.forEach(p => dist[Math.min(4, Math.floor(p / 20))]++);
  const rep: ClassReport = {
    nLop: subs.length, nNop: subs.filter(s => s.nop).length, nVao: subs.filter(s => s.vao).length,
    avg: ps.length ? r1(ps.reduce((a, b) => a + b, 0) / ps.length) : 0, median: ps.length ? ps[Math.floor((ps.length - 1) / 2)] : 0, hi: ps.length ? ps[ps.length - 1] : 0, lo: ps.length ? ps[0] : 0,
    maxScore: graded[0]?.g.max ?? 0, dist, slots: slotStats, tasks: tg, qs: qg,
    top: slotStats.filter(s => !s.manual && s.n - s.pending > 0 && s.pct < 70).sort((a, b) => a.pct - b.pct || b.wrong - a.wrong).slice(0, 5),
    students: students.sort((a, b) => b.pct - a.pct || a.ten.localeCompare(b.ten)),
    chuaNop: subs.filter(s => s.vao && !s.nop).map(s => s.ten), chuaVao: subs.filter(s => !s.vao).map(s => s.ten),
    pending: graded.reduce((n, x) => n + x.g.pendingManual, 0), insights: [],
  };
  rep.insights = classInsights(rep);
  return rep;
}
// phần điểm còn chờ chấm tay (không tính vào % tạm thời)
function pendMax(g: ReturnType<typeof grade>, _key: Key, slots: Slot[]) { return slots.reduce((n, s) => n + (g.perSlot[s.id]?.status === 'pending' ? g.perSlot[s.id].max : 0), 0); }

const where = (s: SlotStat) => `Task ${s.taskNum} câu ${s.label}`;
export function classInsights(c: ClassReport): Insight[] {
  const out: Insight[] = [];
  if (!c.nNop && !c.nVao) return [{ muc: 'vua', text: 'Chưa có bài làm nào.' }];
  for (const s of c.top.slice(0, 3)) {
    const w = s.wrongs[0], wn = s.n - s.pending;
    out.push({ muc: s.pct < 40 ? 'cao' : 'vua', text: `${where(s)}: chỉ ${s.pct}% đúng${w && w.n >= 2 ? `; ${w.n}/${wn} em cùng trả lời "${w.text}"${s.key ? ` (đáp án: "${s.key}")` : ''} → có thể cùng một chỗ hiểu nhầm, nên chữa chung cả lớp` : ''}.` });
  }
  const weakQ = c.qs.filter(q => q.pct < c.avg - 15 && q.pct < 70).sort((a, b) => a.pct - b.pct)[0];
  if (weakQ) out.push({ muc: 'vua', text: `Dạng "${weakQ.name}" yếu nhất (${weakQ.pct}% so với trung bình ${c.avg}%): nên luyện thêm dạng này.` });
  const strongQ = c.qs.filter(q => q.pct >= 85).sort((a, b) => b.pct - a.pct)[0];
  if (strongQ && c.qs.length > 1) out.push({ muc: 'tot', text: `Lớp làm tốt dạng "${strongQ.name}" (${strongQ.pct}%).` });
  const skip = c.slots.filter(s => s.n >= 3 && s.blank / s.n >= .4).sort((a, b) => b.blank - a.blank)[0];
  if (skip) out.push({ muc: 'vua', text: `${where(skip)}: ${skip.blank}/${skip.n} em bỏ trống → có thể khó hiểu đề hoặc thiếu thời gian.` });
  const help = c.students.filter(s => s.nop && s.pct < 50);
  if (help.length) out.push({ muc: 'cao', text: `${help.length} em dưới 50%: ${help.slice(0, 6).map(s => s.ten).join(', ')}${help.length > 6 ? '…' : ''}. Nên kèm riêng hoặc xếp cặp với bạn làm tốt.` });
  if (c.chuaNop.length) out.push({ muc: 'vua', text: `${c.chuaNop.length} em vào nhưng chưa tự nộp (bài được thu khi kết thúc): ${c.chuaNop.slice(0, 6).join(', ')}.` });
  if (c.chuaVao.length) out.push({ muc: 'vua', text: `${c.chuaVao.length} em không vào phiên: ${c.chuaVao.slice(0, 6).join(', ')}${c.chuaVao.length > 6 ? '…' : ''}.` });
  if (c.pending) out.push({ muc: 'vua', text: `Còn ${c.pending} chỗ chấm tay chưa chấm: điểm hiện tại chưa tính phần này.` });
  if (!out.length) out.push({ muc: 'tot', text: `Lớp làm tốt: trung bình ${c.avg}%, không câu nào dưới 70%.` });
  return out;
}

export function studentReport(slots: Slot[], key: Key, s: Sub, c: ClassReport): StudentReport {
  const g = grade(slots, key, s.answers, s.overrides), cp = new Map(c.slots.map(x => [x.id, x]));
  const row = (sl: Slot): ItemRow => { const r = g.perSlot[sl.id], st = cp.get(sl.id);
    return { id: sl.id, taskNum: st?.taskNum || '?', label: sl.label, q: sl.q, answer: answerText(sl, s.answers[sl.id]), key: keyText(sl, key[sl.id]), score: r.score, max: r.max, classPct: st?.pct ?? 0, status: r.status, comment: s.overrides[sl.id]?.comment }; };
  const rows = slots.filter(sl => g.perSlot[sl.id] && g.perSlot[sl.id].max > 0).map(row);
  const grp = (kOf: (sl: Slot) => string | undefined, cls: GroupStat[]) => {
    const m = new Map<string, { sc: number; mx: number; n: number }>();
    for (const sl of slots) { const id = kOf(sl), r = g.perSlot[sl.id]; if (!id || !r || r.max <= 0 || r.status === 'pending') continue; const e = m.get(id) || { sc: 0, mx: 0, n: 0 }; e.sc += r.score ?? 0; e.mx += r.max; e.n++; m.set(id, e); }
    return cls.filter(x => m.has(x.id)).map(x => { const e = m.get(x.id)!; return { id: x.id, name: x.name, n: e.n, pct: pctOf(e.sc, e.mx), classPct: x.pct }; });
  };
  const me = c.students.find(x => x.hs === s.hs), ranked = c.students.filter(x => x.nop);
  const rep: StudentReport = {
    hs: s.hs, ten: s.ten, nop: s.nop, xong: s.xong, nhanXet: s.nhanXet || '', score: g.score, max: g.max, pct: me?.pct ?? 0, classAvg: c.avg,
    rank: s.nop ? ranked.filter(x => x.pct > (me?.pct ?? 0)).length + 1 : 0, of: ranked.length,
    tasks: grp(sl => sl.task, c.tasks), qs: grp(sl => sl.q, c.qs),
    right: rows.filter(x => x.status === 'correct'), wrong: rows.filter(x => x.status === 'wrong' || x.status === 'partial'), blank: rows.filter(x => x.status === 'blank'), pending: rows.filter(x => x.status === 'pending'), insights: [],
  };
  rep.insights = studentInsights(rep);
  return rep;
}

export function studentInsights(r: StudentReport): Insight[] {
  const out: Insight[] = [];
  if (!r.nop && !r.right.length && !r.wrong.length) return [{ muc: 'vua', text: `${r.ten} chưa làm bài.` }];
  const d = r.pct - r.classAvg;
  out.push({ muc: d <= -15 ? 'cao' : d >= 10 ? 'tot' : 'vua', text: `${r.ten} đạt ${r.pct}% (lớp trung bình ${r.classAvg}%)${r.rank ? `, xếp ${r.rank}/${r.of}` : ''}.` });
  const weak = r.qs.filter(q => q.n >= 2 && (q.pct <= q.classPct - 20 || q.pct < 50)).sort((a, b) => (a.pct - a.classPct) - (b.pct - b.classPct));
  weak.slice(0, 2).forEach(q => out.push({ muc: 'cao', text: `Yếu dạng "${q.name}": ${q.pct}% (lớp ${q.classPct}%). Nên ôn lại dạng này.` }));
  const strong = r.qs.filter(q => q.n >= 2 && q.pct >= 80 && q.pct >= q.classPct + 10);
  strong.slice(0, 2).forEach(q => out.push({ muc: 'tot', text: `Mạnh dạng "${q.name}": ${q.pct}% (lớp ${q.classPct}%).` }));
  const easyMiss = r.wrong.filter(x => x.classPct >= 80);
  if (easyMiss.length) out.push({ muc: 'vua', text: `Sai ${easyMiss.length} câu mà phần lớn lớp làm đúng (${easyMiss.slice(0, 4).map(x => `Task ${x.taskNum} câu ${x.label}`).join(', ')}): có thể do đọc vội, nên hỏi lại em.` });
  if (r.blank.length >= 3) out.push({ muc: 'vua', text: `Bỏ trống ${r.blank.length} chỗ: có thể thiếu thời gian hoặc chưa hiểu đề.` });
  if (r.pending.length) out.push({ muc: 'vua', text: `Còn ${r.pending.length} chỗ chấm tay chưa chấm.` });
  return out;
}

// Đoạn nhắc cho AI: chỉ số liệu ẩn danh (không tên học sinh, không bài viết tự do)
export function aiPrompt(c: ClassReport, s: StudentReport | null, title: string): string {
  const L: string[] = [];
  L.push('Bạn là chuyên gia dạy tiếng Anh cho trẻ em Việt Nam. Dưới đây là số liệu ẩn danh của một bài tập vừa làm trên lớp.');
  L.push(`Phiếu: "${title}". Lớp ${c.nLop} em, ${c.nNop} em nộp. Điểm trung bình ${c.avg}% (thấp nhất ${c.lo}%, cao nhất ${c.hi}%). Phân bố (0–19/20–39/40–59/60–79/80–100%): ${c.dist.join('/')}.`);
  L.push('Theo dạng bài: ' + c.qs.map(q => `${q.name} ${q.pct}%`).join('; ') + '.');
  L.push('Theo Task: ' + c.tasks.map(t => `${t.name} ${t.pct}%`).join('; ') + '.');
  L.push('Từng câu (Task·câu, dạng, % đúng, đáp án đúng, đáp án sai hay gặp):');
  for (const x of c.slots.filter(x => !x.manual)) L.push(`- T${x.taskNum}·${x.label} ${Q_NAME[x.q || ''] || x.interaction} ${x.pct}%${x.key ? ` đúng="${x.key}"` : ''}${x.wrongs.length ? ' sai: ' + x.wrongs.map(w => `"${w.text}"×${w.n}`).join(', ') : ''}${x.blank ? ` bỏ trống ${x.blank}` : ''}`);
  if (s) {
    L.push(`\nMột học sinh (gọi là HS): ${s.pct}% (lớp ${s.classAvg}%). Theo dạng: ${s.qs.map(q => `${q.name} ${q.pct}% (lớp ${q.classPct}%)`).join('; ')}.`);
    L.push('Câu HS sai: ' + (s.wrong.map(x => `T${x.taskNum}·${x.label} ("${x.q === 'Q12' ? '…' : x.answer}" thay vì "${x.key}", lớp đúng ${x.classPct}%)`).join('; ') || 'không') + '.');
    L.push('Viết cho giáo viên, tiếng Việt, ngắn gọn: (1) 2–4 nhận định về điểm mạnh / yếu của HS so với lớp, đoán nguyên nhân lỗi (ngữ pháp, từ vựng, đọc đề…); (2) 2–3 gợi ý ôn tập cụ thể cho HS. Không bịa số liệu ngoài phần trên.');
  } else {
    L.push('\nViết cho giáo viên, tiếng Việt, ngắn gọn: (1) 3–5 nhận định lớp sai ở đâu và đoán nguyên nhân (ngữ pháp, từ vựng, đọc đề, dạng bài…), dựa trên đáp án sai hay gặp; (2) 2–4 gợi ý chữa bài / ôn tập cụ thể cho buổi sau. Không bịa số liệu ngoài phần trên.');
  }
  return L.join('\n');
}
