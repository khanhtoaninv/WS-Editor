// v116 gợi ý cách viết khác khi soạn đáp án chữ (docs/TUONG_TAC/BANG_VIET_TAT_CHUAN.md mục 5, cách A: chip dưới ô đáp án).
// Quy tắc cố định, không AI: cùng một đáp án luôn ra cùng gợi ý. Người soạn bấm chip mới thêm vào " / ", máy chấm không tự đoán.
import { sameText } from './normalize.ts';

const PAIRS: [string, string][] = [
  // Anh – Mỹ
  ['colour', 'color'], ['colours', 'colors'], ['favourite', 'favorite'], ['centre', 'center'], ['theatre', 'theater'], ['metre', 'meter'], ['grey', 'gray'],
  ['neighbour', 'neighbor'], ['honour', 'honor'], ['travelling', 'traveling'], ['travelled', 'traveled'], ['organise', 'organize'], ['realise', 'realize'],
  ['programme', 'program'], ['mum', 'mom'], ['maths', 'math'], ['jewellery', 'jewelry'], ['cheque', 'check'], ['pyjamas', 'pajamas'],
  // từ hay gặp ở tiểu học
  ['ok', 'okay'], ['tv', 'television'], ['photo', 'photograph'], ['bike', 'bicycle'], ['fridge', 'refrigerator'], ['phone', 'telephone'], ['plane', 'aeroplane'],
];
const NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const ORD = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
const sfx = (n: number) => n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th';
const WORDS: [string, string][] = [...PAIRS, ...NUM.map((w, i) => [w, String(i)] as [string, string]), ...ORD.slice(1).map((w, i) => [w, `${i + 1}${sfx(i + 1)}`] as [string, string])];

// viết tắt ngoài bảng mặc định: 's = has, 'd = had, name's = name is (và ngược lại)
const RULES: [RegExp, string][] = [
  [/\b(he|she|it|who|what|where|that|there)['’]s\b/gi, '$1 has'], [/\b(i|you|he|she|we|they)['’]d\b/gi, '$1 had'],
  [/\b(he|she|it|who|what|that|there) has\b/gi, "$1's"], [/\b(i|you|he|she|we|they) had\b/gi, "$1'd"],
  [/\bname is\b/gi, "name's"], [/\bname['’]s\b/gi, 'name is'],
];
const cap = (src: string, w: string) => src[0] !== src[0].toLowerCase() ? w[0].toUpperCase() + w.slice(1) : w;

function variants(a: string): string[] {
  const out: string[] = [];
  for (const [x, y] of WORDS) for (const [p, q] of [[x, y], [y, x]]) {
    const re = new RegExp(`(^|[^\\p{L}\\p{N}])(${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?![\\p{L}\\p{N}])`, 'giu');
    if (re.test(a)) out.push(a.replace(re, (_m, pre: string, w: string) => pre + cap(w, q)));
  }
  for (const [re, to] of RULES) { re.lastIndex = 0; if (re.test(a)) { re.lastIndex = 0; out.push(a.replace(re, to)); } }
  if (/\p{L}-\p{L}/u.test(a)) out.push(a.replace(/(\p{L})-(\p{L})/gu, '$1$2'));   // ice-cream → icecream (ice cream = ice-cream máy đã coi là một)
  return out;
}

// key: đáp án đang ghi ("a / b"); no: các gợi ý người soạn đã bỏ. Trả gợi ý chưa có (máy chưa coi là cùng một cách viết), tối đa 4.
export function suggest(key: string, no: string[] = []): string[] {
  const alts = String(key ?? '').split(/\s+\/\s+/).map(x => x.trim()).filter(Boolean), out: string[] = [];
  for (const a of alts) for (const v of variants(a)) {
    if (alts.some(b => sameText(b, v)) || out.some(b => sameText(b, v)) || no.some(b => b === v)) continue;
    out.push(v);
  }
  return out.slice(0, 4);
}
