// v116 gợi ý cách viết khác của đáp án chữ (cột trái, chip dưới ô đáp án). Quy tắc ở shared/src/suggest.ts.
import { suggest } from '../../../shared/src/suggest.ts';
import { its } from './model.js';
import { keyGaps } from './layout.js';
import { gapN } from './answers.js';

// gợi ý của một ô đáp án (k = trường dữ liệu: it.<i>.key hoặc it.<i>.keyg.<j>)
export const sugOf = (t, x, k, v) => (t.answer.params || {}).strictContr ? [] : suggest(String(v ?? ''), (x.sugNo || []).filter(y => y.startsWith(k + ':')).map(y => y.slice(k.length + 1)));
// mọi gợi ý của Task: [i, k, giá trị hiện có, gợi ý]
export function allSug(t) {
  if (!['word', 'sentence'].includes(t.answer.kind)) return [];
  const out = [];
  its(t).forEach((x, i) => {
    if (!x || x.gt || x.pair || x.opts || x.imgs) return;
    const n = gapN(x);
    if (n > 1) keyGaps(x).forEach((v, j) => sugOf(t, x, `it.${i}.keyg.${j}`, v).forEach(g => out.push([i, `it.${i}.keyg.${j}`, v, g])));
    else sugOf(t, x, `it.${i}.key`, x.key).forEach(g => out.push([i, `it.${i}.key`, x.key, g]));
  });
  return out;
}
