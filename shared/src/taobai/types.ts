// Module Tạo bài: kiểu dữ liệu dùng chung (app, máy chủ). Theo docs/TAO_BAI/DAC_TA_TAO_BAI.md mục 3, 9.
// Chỉ dùng cú pháp xóa được (Node chạy thẳng file .ts).

/** Mã 12 dạng câu hỏi của WS Editor (docs/TAO_BAI/1_DANG_Q.md). */
export type QCode = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Q5' | 'Q6' | 'Q7' | 'Q8' | 'Q9' | 'Q10' | 'Q11' | 'Q12';
export const Q_CODES: QCode[] = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12'];
export const Q_NAME: Record<QCode, string> = {
  Q1: 'Điền từ', Q2: 'Viết câu', Q3: 'Chọn A/B/C', Q4: 'Chọn trong câu', Q5: 'Đúng / Sai', Q6: 'Nhìn ảnh viết',
  Q7: 'Chọn ảnh', Q8: 'Nối', Q9: 'Tô chữ', Q10: 'Bảng', Q11: 'Lưới', Q12: 'Viết tự do',
};
/** Q12 đếm số dòng viết thay cho số câu. */
export const qUnit = (q: QCode): 'câu' | 'dòng' => q === 'Q12' ? 'dòng' : 'câu';

/** Số bài tối đa của một bước Trình tự (đặc tả mục 3). */
export const MAX_TASKS_PER_STEP = 2;

// ---------- Dữ liệu đầu vào (đọc từ thư mục giáo trình, qua mô-đun chuyển đổi) ----------

/** Một lỗi / cảnh báo khi đọc dữ liệu: file nào, dòng nào (nếu biết), vì sao. */
export interface DataNote { file: string; line?: number; msg: string }

export interface ChuyenDe { id: string; ten: string }
export interface LessonRef { id: string; ten: string; chuyenDe: string; unit: string }
export interface UnitRef { id: string; ten: string; lessons: LessonRef[] }
export interface GiaoTrinh {
  id: string; ten: string;
  tuoi?: string;                 // 5-6 | 7-9 | 10-12
  chuyenDe: ChuyenDe[];
  units: UnitRef[];
}

/** Một bước của Trình tự (viết kiểu "lai"): app đọc các trường này, phần chữ còn lại gửi AI. */
export interface Buoc {
  so: number;                    // số bước (1, 2, …) theo thứ tự trong file
  ten: string;                   // "Khởi động"
  vaiTro: string;                // "nhận diện cấu trúc"
  q: QCode[];                    // dạng Q được phép (1–3)
  min: number; max: number;      // khoảng số câu (Q12: số dòng)
  batBuoc: boolean;
  toiDa: number;                 // số bài tối đa của bước (≤ MAX_TASKS_PER_STEP)
  chiTiet: string;               // "khung từ", "bài đọc 60–80 từ"… (hiện ở màn Ra đề, gửi AI)
  them: string;                  // các dòng chữ tự do khác của bước (chỉ gửi AI)
}
export interface TrinhTu {
  chuyenDe: string; ver: string;
  soTrangToiDa: number;          // mặc định 2
  buoc: Buoc[];
  nguyenTac: string;             // mục "## Nguyên tắc" (chỉ gửi AI)
  raw: string;
}
export interface TfDang { so: number; ten: string; q: QCode; raw: string }
export interface Tf { chuyenDe: string; ver: string; dang: TfDang[]; raw: string }
export interface KienThuc {
  lesson: string; ver: string;
  mucTieu: string;               // mục "## Mục tiêu" (hiện ở màn Ra đề)
  tuVung: string;                // mục "## Từ vựng" (có thể rỗng)
  muc: Record<string, string>;   // mọi mục "## …" theo tên (nội dung không chuẩn hóa)
  raw: string;
}
/** Bộ file chung của hệ thống (đặc tả mục 3): 1 quy tắc MD, 2 dạng Q, 3 quy tắc hình thức, 4 rubric, 5 phiếu mẫu. */
export interface FileChung { so: 1 | 2 | 3 | 4 | 5; ten: string; ver: string; raw: string | null }

/** Kết quả của mô-đun chuyển đổi cho một lesson (đủ để dựng màn Ra đề và gửi AI). */
export interface ChiTietLesson {
  giaoTrinh: { id: string; ten: string; tuoi?: string };
  unit: { id: string; ten: string };
  lesson: LessonRef;
  chuyenDe: ChuyenDe;
  kienThuc: KienThuc | null;
  trinhTu: TrinhTu | null;
  tf: Tf | null;
  chung: FileChung[];
  /** có lỗi thì không cho tạo bài (thiếu Trình tự / TF / Kiến thức, bước dùng Q mà TF không có…) */
  loi: DataNote[];
  canhBao: DataNote[];
}

// ---------- Dữ liệu gắn vào phiếu (ws.gen, task.gen) — đặc tả mục 9.1 ----------

/** Một bài trong cấu trúc đã duyệt. */
export interface GenStructItem { step: number; role: string; q: QCode; n: number; extra?: string }
export interface GenCheck { id: string; group: 'may' | 'ai'; ok: boolean; why?: string; items?: number[] }
export interface GenSnap<T> { at: string; note?: string; snap: T }

export interface SheetGen {
  v: 1;
  src: {
    course: string; unit: string; lesson: string; topic: string;   // mã
    names?: { course?: string; unit?: string; lesson?: string; topic?: string };
    ver: { kienThuc: string; trinhTu: string; tf: string; chung: Record<string, string> };
  };
  structure: GenStructItem[];
  note: string;
  sheetChecks: GenCheck[];
  history: GenSnap<unknown>[];            // ≤ 3, snap = phiếu không kèm history
}
export type TaskGenStatus = 'wait' | 'todo' | 'ok';   // ⚠ = todo có tiêu chí chưa đạt
export interface TaskGen {
  step: number; role: string; goal?: string; ctx?: string;
  status: TaskGenStatus;
  checks: GenCheck[];
  approvedHash?: string;
  history: GenSnap<unknown>[];            // ≤ 3, snap = Task không kèm history
}
export const GEN_HISTORY_MAX = 3;
