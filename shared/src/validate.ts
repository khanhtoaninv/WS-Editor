// Kiểm khuôn khối đề (slots) và khối đáp án (key). Trả danh sách lỗi (rỗng = đạt), không ném.
// Dùng khi xuất gói (WS Editor) và khi import (TeacherResource): tài liệu 2 mục 9.
import { INTERACTIONS, type Key, type Slot } from './types.ts';

const ID_RE = /^[A-Za-z0-9_-]+(\.[A-Za-z0-9_()-]+)*$/;
const CHOICE = new Set(['choice-one', 'choice-many', 'match', 'tf']);

export function validate(slots: unknown, key: unknown): string[] {
  const err: string[] = [];
  if (!Array.isArray(slots)) return ['slots không phải danh sách'];
  if (key == null || typeof key !== 'object' || Array.isArray(key)) return ['key không phải đối tượng'];
  const K = key as Key, seen = new Set<string>();
  slots.forEach((s0, i) => {
    const s = s0 as Slot, at = `slot ${i + 1}${s && s.id ? ` (${s.id})` : ''}`;
    if (!s || typeof s !== 'object') { err.push(`${at}: không phải đối tượng`); return; }
    if (typeof s.id !== 'string' || !ID_RE.test(s.id)) err.push(`${at}: id không hợp lệ`);
    else if (seen.has(s.id)) err.push(`${at}: id trùng`); else seen.add(s.id);
    if (typeof s.task !== 'string' || !s.task) err.push(`${at}: thiếu task`);
    if (typeof s.label !== 'string') err.push(`${at}: thiếu label`);
    if (!INTERACTIONS.includes(s.interaction)) err.push(`${at}: interaction lạ "${s.interaction}"`);
    if (!['auto', 'manual', 'none'].includes(s.grading)) err.push(`${at}: grading lạ "${s.grading}"`);
    if ((s.interaction === 'choice-one' || s.interaction === 'choice-many' || s.interaction === 'match') && !(Array.isArray(s.options) && s.options.length >= 2))
      err.push(`${at}: dạng chọn cần ít nhất 2 phương án`);
    if (s.options) {
      const ids = new Set<string>();
      s.options.forEach(o => { if (!o || typeof o.id !== 'string' || !o.id) err.push(`${at}: phương án thiếu id`); else if (ids.has(o.id)) err.push(`${at}: phương án trùng id ${o.id}`); else ids.add(o.id); });
      if (s.options.some(o => o && ('ok' in o || 'correct' in o))) err.push(`${at}: phương án trong đề không được đánh dấu đúng`);
    }
    const k = K[s.id];
    if (s.grading === 'auto') {
      if (!k) { err.push(`${at}: chấm máy nhưng thiếu đáp án`); return; }
      if (k.type !== s.interaction) err.push(`${at}: kiểu đáp án "${k.type}" khác kiểu chỗ trả lời "${s.interaction}"`);
      if (!(typeof k.score === 'number' && k.score > 0)) err.push(`${at}: điểm phải > 0`);
      if (['text', 'text-long', 'cell'].includes(k.type) && !(Array.isArray(k.accept) && k.accept.some(a => String(a).trim())))
        err.push(`${at}: thiếu đáp án chấp nhận`);
      if (CHOICE.has(k.type)) {
        const want = ([] as string[]).concat(k.correct ?? []);
        if (!want.length) err.push(`${at}: thiếu phương án đúng`);
        else if (k.type !== 'tf' && s.options) { const ids = new Set(s.options.map(o => o.id)); want.forEach(w => { if (!ids.has(w)) err.push(`${at}: phương án đúng "${w}" không có trong đề`); }); }
        if (k.type === 'choice-one' && want.length > 1) err.push(`${at}: chọn một nhưng có ${want.length} phương án đúng`);
      }
    }
  });
  Object.keys(K).forEach(id => { if (!seen.has(id)) err.push(`đáp án "${id}" không ứng với chỗ trả lời nào`); });
  return err;
}
