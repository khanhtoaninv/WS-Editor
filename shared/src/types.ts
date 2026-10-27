// Kiểu dữ liệu chuẩn gói wsp/0 (docs/TUONG_TAC/2_CHUAN_GOI_PHIEU.md mục 5, 6, 8).

export const FORMAT = 'wsp/0';

// Cách học sinh trả lời một chỗ (tài liệu 2 mục 5.3)
export type Interaction =
  | 'text'          // gõ chữ vào chỗ trống / dòng
  | 'text-long'     // gõ nhiều dòng
  | 'choice-one'    // bấm một phương án
  | 'choice-many'   // bấm nhiều phương án
  | 'tf'            // bấm một nhãn Đúng / Sai
  | 'match'         // chọn vế phải cho vế trái
  | 'cell'          // gõ vào ô bảng / ô chữ
  | 'draw'          // vẽ / tô
  | 'static';       // chỉ xem, không tương tác

export const INTERACTIONS: readonly Interaction[] = ['text', 'text-long', 'choice-one', 'choice-many', 'tf', 'match', 'cell', 'draw', 'static'];

// auto = máy chấm · manual = giáo viên chấm tay · none = không chấm (không tính vào tổng điểm)
export type Grading = 'auto' | 'manual' | 'none';

export interface SlotOption { id: string; text?: string; img?: string }

// Một chỗ trả lời (khối ĐỀ, không có đáp án)
export interface Slot {
  id: string;               // "<taskId>.<itemId>[.<n>]", "<taskId>.lead.<n>", "<taskId>.cell.<rowId>.<c>", "<taskId>.pair.<itemId>"
  task: string;
  item?: string;
  label: string;            // số câu như in trên phiếu: "3", "3.2", "(a)", "R2C3"
  q?: string;               // dạng câu hỏi WS Editor (Q1…Q12), để báo cáo
  interaction: Interaction;
  options?: SlotOption[];   // dạng chọn: phương án, KHÔNG đánh dấu đúng
  grading: Grading;
  page?: number;            // gắn khi xuất gói (GĐ2)
  boxMm?: [number, number, number, number];
}

// Đáp án của một chỗ (khối ĐÁP ÁN)
export interface KeyEntry {
  type: Interaction;
  score: number;                     // điểm tối đa của chỗ này
  accept?: string[];                 // text / text-long / cell: các đáp án chấp nhận
  correct?: string | string[];       // choice-one / tf / match: một id; choice-many: các id
  scoring?: 'all-or-nothing' | 'partial';
  grading?: Grading;                 // manual: chấm tay (sample là bài mẫu)
  sample?: string;
  explain?: string;
  caseSensitive?: boolean;
  ignorePunct?: boolean;
}

export type Key = Record<string, KeyEntry>;

export type AnswerValue = string | string[];
export type Answers = Record<string, AnswerValue | null | undefined>;

export type SlotStatus = 'correct' | 'wrong' | 'partial' | 'blank' | 'pending' | 'ungraded';

export interface SlotResult { status: SlotStatus; score: number | null; max: number }

export interface Result {
  score: number;          // tổng điểm hiện có (máy + tay đã chấm)
  max: number;            // tổng điểm tối đa (chỗ auto + manual)
  autoScore: number;      // phần máy chấm
  pendingManual: number;  // số chỗ chờ chấm tay
  counts: Record<SlotStatus, number>;
  perSlot: Record<string, SlotResult>;
}

// Giáo viên chấm tay / sửa điểm một chỗ
export type Overrides = Record<string, { score: number; comment?: string }>;
