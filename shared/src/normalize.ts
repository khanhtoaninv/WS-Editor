// Chuẩn hóa chữ khi so khớp đáp án (tài liệu 2 mục 6.2). Áp cho cả bài làm và từng đáp án chấp nhận.
// Không tự mở rộng viết tắt (don't ≠ do not): muốn chấp nhận thì người soạn ghi thêm đáp án.

export interface NormOpts { caseSensitive?: boolean; ignorePunct?: boolean }

const EDGE_PUNCT = /^[\s.,!?;:]+|[\s.,!?;:]+$/g;

export function normalize(s: unknown, o: NormOpts = {}): string {
  let x = String(s ?? '').normalize('NFC');
  if (!o.caseSensitive) x = x.toLowerCase();
  x = x.replace(/[‘’ʼ`´]/g, "'").replace(/[“”„]/g, '"');
  x = x.replace(/[-‐-―−]/g, ' ');             // gạch nối, gạch ngang → dấu cách (twenty-one = twenty one)
  if (o.ignorePunct) x = x.replace(/[.,!?;:"()]/g, ' ');
  x = x.replace(/\s+/g, ' ').trim();
  x = x.replace(EDGE_PUNCT, '');                               // dấu câu ở hai đầu
  return x.replace(/\s+/g, ' ').trim();
}

export function sameText(a: unknown, b: unknown, o: NormOpts = {}): boolean {
  return normalize(a, o) === normalize(b, o);
}
