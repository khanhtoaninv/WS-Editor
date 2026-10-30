// Module Tạo bài v129: DỰNG ĐOẠN NHẮC sinh MỘT bài (đặc tả mục 8.1). Hàm thuần, dùng chung cho:
//   - app gọi AI qua máy chủ (POST /api/taobai/ai {system, prompt})
//   - chế độ AI ngoài (giáo viên chép đoạn nhắc sang AI khác)
// Quy tắc (mã S1…) ghi ở docs/TAO_BAI/QUY_TAC_SINH_BAI.md. Đổi đoạn nhắc thì tăng NHAC_VER và ghi vào tài liệu đó.
import { Q_NAME, qUnit, type QCode, type ChiTietLesson, type GenStructItem, type Buoc } from './types.ts';

export const NHAC_VER = 'nhac-2';

/** Một bài đã viết xong trong phiếu (tóm tắt gửi kèm để AI tránh lặp: S9). */
export interface BaiDaCo { so: number; q: string; title: string; ctx?: string; cau: string[] }
export interface NhacVao {
  les: ChiTietLesson;
  cauTruc: GenStructItem[];          // ws.gen.structure (cả phiếu)
  k: number;                         // vị trí bài cần viết trong cấu trúc (0 = bài 1)
  ghiChu?: string;                   // ghi chú cho AI ở màn Ra đề
  daCo?: BaiDaCo[];
  gopY?: string;                     // Sinh lại: góp ý của giáo viên (S22)
  banHienTai?: string;               // Sinh lại: MD bài đang có (S22)
  sua?: { md: string; loi: string[] };   // gửi lại vì lỗi (S15)
}
export interface Nhac { system: string; prompt: string; ver: string; q: QCode; n: number }

/** Mục "## Qn …" của file chung 2 (chỉ gửi mục của dạng được giao: S2). */
export function mucQ(chung2: string | null, q: QCode): string {
  if (!chung2) return '';
  const L = chung2.replace(/\r/g, '').split('\n'), i = L.findIndex(l => new RegExp(`^##\\s*${q}\\b`).test(l.trim()));
  if (i < 0) return '';
  let j = i + 1; while (j < L.length && !/^##(?!#)/.test(L[j].trim())) j++;
  return L.slice(i, j).join('\n').trim();
}
const buocChu = (b: Buoc) => [`Bước ${b.so}: ${b.ten}`, b.vaiTro && `Vai trò: ${b.vaiTro}`, `Dạng được phép: ${b.q.join(', ')}`, `Số câu: ${b.min === b.max ? b.min : `${b.min}–${b.max}`}`, b.chiTiet && `Chi tiết: ${b.chiTiet}`, b.them].filter(Boolean).join('\n');
const khoi = (ten: string, chu: string) => chu.trim() ? `### ${ten}\n${chu.trim()}` : '';

export function dungNhac(v: NhacVao): Nhac {
  const L = v.les, it = v.cauTruc[v.k]; if (!it) throw new Error(`không có bài ${v.k + 1} trong cấu trúc`);
  const q = it.q, n = it.n, unit = qUnit(q), so = v.k + 1, tuoi = L.giaoTrinh.tuoi || '7-9';
  const chung = (s: number) => L.chung.find(c => c.so === s)?.raw || '';
  const buoc = L.trinhTu?.buoc.find(b => b.so === it.step);
  const tf = (L.tf?.dang || []).filter(d => d.q === q);

  // S2: phần hệ thống = vai trò + cách viết (file chung 1, mục Q của file chung 2, file chung 3 và 5 nếu có)
  const system = [
    `Bạn soạn bài tập tiếng Anh cho phiếu bài tập của học sinh ${tuoi} tuổi ở Việt Nam. Mỗi lần bạn viết ĐÚNG MỘT bài (một Task) theo yêu cầu, bằng định dạng MD của app WS Editor.`,
    'Chỉ trả về khối MD của bài, đúng khung ở "Quy tắc viết MD" dưới đây: không lời chào, không giải thích, không bọc trong ```.',
    'Câu chữ tiếng Anh phải đúng ngữ pháp, tự nhiên, hợp độ tuổi; từ vựng trong phạm vi Kiến thức của lesson. Mỗi câu có đúng một đáp án đúng.',
    khoi('Quy tắc viết MD (file chung 1)', chung(1)),
    khoi(`Dạng ${q} ${Q_NAME[q]} (trích file chung 2)`, mucQ(chung(2), q)),
    khoi('Quy tắc hình thức (file chung 3)', chung(3)),
    khoi('Phiếu mẫu đã duyệt (file chung 5)', chung(5)),
  ].filter(Boolean).join('\n\n');

  // S3: phần yêu cầu
  const P: string[] = [];
  P.push(`## Phiếu\nGiáo trình: ${L.giaoTrinh.ten} · ${L.unit.ten} · ${L.lesson.ten} · chuyên đề ${L.chuyenDe.ten} · học sinh ${tuoi} tuổi`);
  P.push(`## Kiến thức của lesson\n${(L.kienThuc?.raw || '(chưa có)').trim()}`);
  P.push(['## Trình tự của chuyên đề', buoc ? `Bài này thuộc:\n${buocChu(buoc)}\n(Số câu và dạng ở trên là điều giáo viên đã quyết cho bài này; "Dạng được phép" và "Số câu" của bước chỉ là gợi ý.)` : it.step === 0 ? 'Đây là BÀI TỰ DO do giáo viên thêm, không thuộc bước nào của Trình tự: viết theo dạng, số câu và yêu cầu riêng ở phần "BÀI CẦN VIẾT".' : '', L.trinhTu?.nguyenTac ? `Nguyên tắc chung:\n${L.trinhTu.nguyenTac}` : ''].filter(Boolean).join('\n\n'));
  P.push(tf.length ? `## Dạng bài (TF) cho ${q}\n${tf.length > 1 ? 'Chọn MỘT dạng hợp với bước nhất.\n\n' : ''}${tf.map(d => d.raw.replace(/^##\s*/, '### ')).join('\n\n')}` : `## Dạng bài (TF)\nTF chưa có dạng nào cho ${q}: viết theo mô tả dạng ${q} ở trên.`);
  P.push(`## Cấu trúc cả phiếu (${v.cauTruc.length} bài)\n` + v.cauTruc.map((x, i) => `- Bài ${i + 1} · ${x.step === 0 ? 'Bài tự do' : `Bước ${x.step}${x.role ? ` (${x.role})` : ''}`} · ${x.q} ${Q_NAME[x.q]} · ${x.n} ${qUnit(x.q)}${x.yc ? ` · yêu cầu: ${x.yc}` : ''}${i === v.k ? '  ← BÀI NÀY' : ''}`).join('\n'));
  const da = (v.daCo || []).filter(b => b.so !== so);
  if (da.length) P.push(`## Các bài đã viết trong phiếu (không lặp câu, chọn ngữ cảnh khác)\n` + da.map(b => `- Bài ${b.so} (${b.q}) “${b.title}”${b.ctx ? ` · ngữ cảnh: ${b.ctx}` : ''}${b.cau.length ? `\n  ${b.cau.slice(0, 3).join(' / ')}` : ''}`).join('\n'));
  if (v.ghiChu && v.ghiChu.trim()) P.push(`## Ghi chú của giáo viên cho cả phiếu\n${v.ghiChu.trim()}`);
  if (v.banHienTai) {
    P.push(`## Bản hiện tại của bài này\n${v.banHienTai.trim()}`);
    P.push(v.gopY && v.gopY.trim() ? `## Góp ý của giáo viên (phải làm theo)\n${v.gopY.trim()}\nViết lại bài theo góp ý; giữ đúng dạng và số ${unit}; phần góp ý không nhắc tới thì giữ như bản hiện tại nếu đã tốt.` : '## Yêu cầu sinh lại\nViết một bản MỚI khác bản hiện tại (câu và ngữ cảnh khác), vẫn đúng bước, dạng và số câu.');
  }
  P.push(`## BÀI CẦN VIẾT: Bài ${so} · ${q} ${Q_NAME[q]} · ${n} ${unit}\n` + [
    `Viết Bài ${so} của phiếu: dạng ${q} (${Q_NAME[q]}), ${q === 'Q12' ? `Dòng viết: ${n} (không có câu đánh số)` : `${n} câu đánh số 1–${n}`} (số giáo viên đã chọn).`,
    it.yc && it.yc.trim() ? `YÊU CẦU RIÊNG CỦA GIÁO VIÊN CHO BÀI NÀY (phải làm theo): ${it.yc.trim()}` : '',
    buoc ? `Bài phục vụ bước "${buoc.ten}"${buoc.vaiTro ? ` (${buoc.vaiTro})` : ''}${buoc.chiTiet ? `; ${buoc.chiTiet}` : ''}.` : '',
    tf.length ? `Tiêu đề "## Task:" dùng câu lệnh tiếng Anh theo "Hướng dẫn mẫu" của dạng TF đã chọn (sửa nhẹ cho khớp nội dung nếu cần).` : '',
    'Ngay dưới "## Task:" ghi "Mục tiêu:" (một câu tiếng Việt) và "Ngữ cảnh:" (vài chữ).',
  ].filter(Boolean).join('\n'));
  if (v.sua) P.push(`## SỬA LỖI\nBản bạn vừa viết:\n\`\`\`\n${v.sua.md.trim()}\n\`\`\`\nApp đọc bản đó thấy lỗi:\n${v.sua.loi.map(x => `- ${x}`).join('\n')}\nViết lại TOÀN BỘ bài, sửa đúng các lỗi trên, giữ phần đã đúng. Chỉ trả về MD.`);
  return { system, prompt: P.filter(Boolean).join('\n\n'), ver: NHAC_VER, q, n };
}

/** Chế độ AI ngoài: ghép phần hệ thống và phần yêu cầu thành một khối để chép (S25). */
export const nhacChep = (n: Nhac) => `${n.system}\n\n==========\n\n${n.prompt}`;
