// Kho trạng thái giao diện (Zustand). Bước 3 (docs/KE_HOACH_REACT.md): phần legacy còn lại "đăng" những gì giao diện
// React cần hiển thị qua publish(); React chỉ đọc kho, bấm nút thì gọi hành động trong actions.ts.
import { create } from 'zustand';
import type { ImpUi } from './ImportDlg';
import { flushSync } from 'react-dom';
import type { ShowData } from '../viewer/data';

// Các trang A4 đã dàn (legacy drawPages tính, stage/Pages.tsx dựng). html = các Task của trang (core/layout renderTask)
export type PageView = { rev: number; title: string; guides: [number, string, number] | null; pages: { html: string; over: boolean; free: number; fill: number }[] };

export type UiState = {
  title: string;
  age: string;
  canUndo: boolean;
  canRedo: boolean;
  zoomLabel: string;
  guides: boolean;
  pages: number | null;   // null = chưa dàn trang ("–")
  diags: number | null;
  helpOpen: boolean;
  codes: boolean;         // hiện mã kỹ thuật (T1, G0, A1…)
  dataDlg: { kind: 'json' | 'md'; text: string } | null;   // hộp Xem JSON / Xuất MD
  cfm: { title: string; msg: string; yes: string } | null;  // hộp hỏi xác nhận
  toastMsg: string;
  toastShow: boolean;
  imp: ImpUi | null;                                        // popup "+ Task" / "+ Phiếu" (null = đóng)
  paste: { id: string; unit: string; lines: number } | null; // hộp "Dán nhiều dòng"
  genOpen: boolean;                                         // hộp ảnh
  inspRev: number;                                          // lần dựng cột phải (0 = chưa dựng)
  treeRev: number;                                          // lần dựng cột trái (0 = chưa dựng)
  liveRev: number;                                          // lần vẽ lại phần đọc khi đang gõ (thẻ mô tả, tên Task…)
  pageView: PageView | null;                                // các trang A4 (null = chưa dàn)
  show: ShowData | null;                                    // GĐ1a trình chiếu đang mở (null = đóng)
};

export const useUi = create<UiState>(() => ({
  title: '', age: '7-9', canUndo: false, canRedo: false, zoomLabel: 'Vừa khung', guides: false,
  pages: null, diags: null, helpOpen: false, dataDlg: null, cfm: null, toastMsg: '', toastShow: false, imp: null, paste: null, genOpen: false, inspRev: 0, treeRev: 0, liveRev: 0, pageView: null, show: null, codes: (() => { try { return localStorage.getItem('wsEditor.codes.v1') === '1'; } catch (_) { return false; } })(),
}));

// Cập nhật đồng bộ: code cũ (và test) đọc DOM ngay sau render(), nên React phải vẽ xong trước khi publish trả về.
export function publish(p: Partial<UiState>) {
  flushSync(() => useUi.setState(p));
}
