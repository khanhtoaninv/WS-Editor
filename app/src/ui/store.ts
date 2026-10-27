// Kho trạng thái giao diện (Zustand). Bước 3 (docs/KE_HOACH_REACT.md): phần legacy còn lại "đăng" những gì giao diện
// React cần hiển thị qua publish(); React chỉ đọc kho, bấm nút thì gọi hành động trong actions.ts.
import { create } from 'zustand';
import type { ImpUi } from './ImportDlg';
import { flushSync } from 'react-dom';

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
};

export const useUi = create<UiState>(() => ({
  title: '', age: '7-9', canUndo: false, canRedo: false, zoomLabel: 'Vừa khung', guides: false,
  pages: null, diags: null, helpOpen: false, dataDlg: null, cfm: null, toastMsg: '', toastShow: false, imp: null, paste: null, genOpen: false, codes: (() => { try { return localStorage.getItem('wsEditor.codes.v1') === '1'; } catch (_) { return false; } })(),
}));

// Cập nhật đồng bộ: code cũ (và test) đọc DOM ngay sau render(), nên React phải vẽ xong trước khi publish trả về.
export function publish(p: Partial<UiState>) {
  flushSync(() => useUi.setState(p));
}
