// Chuẩn hóa chữ khi so khớp đáp án (tài liệu 2 mục 6.2). Áp cho cả bài làm và từng đáp án chấp nhận.
// v116: mở rộng viết tắt theo bảng chuẩn (don't = do not), trừ khi bật Phân biệt viết tắt (strictContr). Dạng ngoài bảng người soạn ghi thêm " / ".
// Dấu câu hai đầu bỏ qua ("were." = "were"), trừ khi đáp án chỉ là dấu câu (sameText).

export interface NormOpts { caseSensitive?: boolean; ignorePunct?: boolean; strictContr?: boolean }

// v116 bảng viết tắt chuẩn (docs/TUONG_TAC/BANG_VIET_TAT_CHUAN.md): mở rộng ở cả bài làm và đáp án trước khi so, nên I'm = I am
// theo cả hai chiều. Chỉ các dạng trong bảng ('s sở hữu như Tom's không đổi; 's = is, 'd = would; nghĩa has / had người soạn ghi thêm).
// strictContr (công tắc "Phân biệt viết tắt", bài dạy viết tắt) thì không mở rộng.
const PRON = ['i', 'you', 'we', 'they', 'he', 'she', 'it'];
export const CONTRACTIONS: Record<string, string> = {
  "i'm": 'i am', "you're": 'you are', "we're": 'we are', "they're": 'they are',
  "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not',
  "don't": 'do not', "doesn't": 'does not', "didn't": 'did not', "haven't": 'have not', "hasn't": 'has not', "hadn't": 'had not',
  "can't": 'cannot', "couldn't": 'could not', "won't": 'will not', "wouldn't": 'would not', "shouldn't": 'should not',
  "mustn't": 'must not', "needn't": 'need not', "shan't": 'shall not', "let's": 'let us',
  ...Object.fromEntries(['he', 'she', 'it', 'that', 'there', 'here', 'what', 'who', 'where', 'when', 'how', 'why'].map(w => [`${w}'s`, `${w} is`])),
  ...Object.fromEntries([...PRON, 'who', 'that', 'there'].map(w => [`${w}'ll`, `${w} will`])),
  ...Object.fromEntries(['i', 'you', 'we', 'they'].map(w => [`${w}'ve`, `${w} have`])),
  ...Object.fromEntries(['i', 'you', 'he', 'she', 'we', 'they'].map(w => [`${w}'d`, `${w} would`])),
};
const CONTR_RE = new RegExp(`(^|[^a-z'])(${Object.keys(CONTRACTIONS).map(k => k.replace(/'/g, "'")).join('|')})(?![a-z'])`, 'gi');
export function expandContr(x: string): string {
  return x.replace(CONTR_RE, (_m, pre: string, w: string) => { const f = CONTRACTIONS[w.toLowerCase()]; return pre + (w[0] !== w[0].toLowerCase() ? f[0].toUpperCase() + f.slice(1) : f); })
    .replace(/\b([Cc])an not\b/g, '$1annot');
}

const EDGE_PUNCT = /^[\s.,!?;:]+|[\s.,!?;:]+$/g;

export function normalize(s: unknown, o: NormOpts = {}): string {
  let x = String(s ?? '').normalize('NFC');
  if (!o.caseSensitive) x = x.toLowerCase();
  x = x.replace(/[‘’ʼ`´]/g, "'").replace(/[“”„]/g, '"');
  if (!o.strictContr) x = expandContr(x);
  x = x.replace(/[-‐-―−]/g, ' ');             // gạch nối, gạch ngang → dấu cách (twenty-one = twenty one)
  if (o.ignorePunct) x = x.replace(/[.,!?;:"()]/g, ' ');
  x = x.replace(/\s+/g, ' ').trim();
  x = x.replace(EDGE_PUNCT, '');                               // dấu câu ở hai đầu
  return x.replace(/\s+/g, ' ').trim();
}

// v113: chỗ trống điền dấu câu (đáp án hoặc bài làm chỉ gồm dấu câu) thì so đúng từng dấu: "." ≠ "?"
const PUNCT_ONLY = /^[\s.,!?;:'"()…‘’ʼ`´“”„\-‐-―−]+$/;
const punctOf = (s: unknown) => String(s ?? '').normalize('NFC').replace(/[‘’ʼ`´]/g, "'").replace(/[“”„]/g, '"').replace(/[‐-―−]/g, '-').replace(/…/g, '...').replace(/\s+/g, '');
export const punctOnly = (s: unknown) => PUNCT_ONLY.test(String(s ?? ''));

export function sameText(a: unknown, b: unknown, o: NormOpts = {}): boolean {
  if (punctOnly(a) || punctOnly(b)) return punctOf(a) === punctOf(b);
  return normalize(a, o) === normalize(b, o);
}
