// Chấm một bài làm (tài liệu 2 mục 6.3, 8). Hàm thuần: cùng một kết quả ở WS Editor (Chấm thử) và máy chủ TeacherResource.
import type { Answers, AnswerValue, Key, KeyEntry, Overrides, Result, Slot, SlotResult, SlotStatus } from './types.ts';
import { sameText } from './normalize.ts';

export const isBlank = (v: AnswerValue | null | undefined): boolean =>
  v == null || (Array.isArray(v) ? v.length === 0 : String(v).trim() === '');

// Một chỗ: trả trạng thái + điểm (null = chờ chấm tay). Không xét overrides.
export function gradeSlot(slot: Slot, k: KeyEntry | undefined, v: AnswerValue | null | undefined): SlotResult {
  const grading = k?.grading ?? slot.grading;
  if (grading === 'none' || slot.interaction === 'static') return { status: 'ungraded', score: null, max: 0 };
  const max = k ? k.score : 1;
  if (isBlank(v)) return { status: 'blank', score: 0, max };
  if (grading === 'manual') return { status: 'pending', score: null, max };
  if (!k) return { status: 'ungraded', score: null, max: 0 };           // thiếu đáp án: validate() đã báo
  const ok = (st: SlotStatus, sc: number): SlotResult => ({ status: st, score: sc, max });
  switch (k.type) {
    case 'text': case 'text-long': case 'cell': {
      const o = { caseSensitive: k.caseSensitive, ignorePunct: k.ignorePunct, strictContr: k.strictContr };
      return (k.accept || []).some(a => sameText(v, a, o)) ? ok('correct', max) : ok('wrong', 0);
    }
    case 'choice-one': case 'match':
      return String(v) === String(k.correct) ? ok('correct', max) : ok('wrong', 0);
    case 'tf':
      return sameText(v, k.correct) ? ok('correct', max) : ok('wrong', 0);
    case 'find': {   // v116 tìm từ: hai đầu từ, kéo chiều nào cũng được
      const ends = (x: unknown) => String(x ?? '').split('-').map(p => p.trim()).sort().join('-');
      return ends(v) === ends(k.correct) ? ok('correct', max) : ok('wrong', 0);
    }
    case 'choice-many': {
      const want = new Set(([] as string[]).concat(k.correct ?? []).map(String));
      const got = new Set(([] as string[]).concat(v as string | string[]).map(String));
      const hit = [...got].filter(x => want.has(x)).length, miss = got.size - hit;
      if (hit === want.size && miss === 0) return ok('correct', max);
      if (k.scoring === 'partial') {
        const sc = Math.max(0, (hit - miss) / want.size) * max;
        return sc > 0 ? ok('partial', Math.round(sc * 100) / 100) : ok('wrong', 0);
      }
      return ok('wrong', 0);
    }
    default:
      return { status: 'ungraded', score: null, max: 0 };
  }
}

export function grade(slots: Slot[], key: Key, answers: Answers, overrides: Overrides = {}): Result {
  const counts: Record<SlotStatus, number> = { correct: 0, wrong: 0, partial: 0, blank: 0, pending: 0, ungraded: 0 };
  const perSlot: Record<string, SlotResult> = {};
  let score = 0, max = 0, autoScore = 0, pendingManual = 0;
  for (const s of slots) {
    let r = gradeSlot(s, key[s.id], answers[s.id]);
    const ov = overrides[s.id];
    const manual = (key[s.id]?.grading ?? s.grading) === 'manual';
    if (ov && r.max > 0) {
      const sc = Math.min(r.max, Math.max(0, ov.score));
      r = { status: sc >= r.max ? 'correct' : sc > 0 ? 'partial' : 'wrong', score: sc, max: r.max };
    } else if (r.score != null && !manual) autoScore += r.score;
    perSlot[s.id] = r; counts[r.status]++;
    max += r.max;
    if (r.score != null) score += r.score;
    if (r.status === 'pending') pendingManual++;
  }
  const rd = (n: number) => Math.round(n * 100) / 100;
  return { score: rd(score), max: rd(max), autoScore: rd(autoScore), pendingManual, counts, perSlot };
}
