// Gắn các mảnh giao diện React vào chỗ giữ sẵn trong index.html. Vẽ đồng bộ (flushSync) để khi legacy/app.js chạy,
// mọi phần tử (id) đã có trên trang như ở v106. File này phải được import TRƯỚC legacy/app.js (xem main.ts).
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import type { ReactNode } from 'react';
import { TopBar, HelpPop } from './TopBar';
import { DataDlg, ConfirmDlg, askConfirm } from './Dialogs';
import { Toast, toast } from './Toast';
import { LeftSplit, LW_DEF, LW_KEY, lwMax } from './LeftSplit';

function mount(id: string, node: ReactNode) {
  const el = document.getElementById(id);
  if (!el) throw new Error('thiếu chỗ gắn #' + id);
  const root = createRoot(el);
  flushSync(() => root.render(node));
}
mount('r-top', <TopBar />);
mount('r-lsplit', <LeftSplit />);
mount('r-help', <HelpPop />);
mount('r-dlg', <DataDlg />);
mount('r-cfm', <ConfirmDlg />);
mount('r-toast', <Toast />);

// Cầu nối test: hàm của v106 đã chuyển sang src/ui vẫn gọi được trên window như trước
Object.assign(window, { askConfirm, toast, LW_DEF, LW_KEY, lwMax });
