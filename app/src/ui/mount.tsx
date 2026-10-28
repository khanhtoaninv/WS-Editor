// Gắn các mảnh giao diện React vào chỗ giữ sẵn trong index.html. Vẽ đồng bộ (flushSync) để khi legacy/app.js chạy,
// mọi phần tử (id) đã có trên trang như ở v106. File này phải được import TRƯỚC legacy/app.js (xem main.ts).
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import type { ReactNode } from 'react';
import { HelpPop } from './TopBar';
import { AppShell } from './AppShell';
import { DataDlg, ConfirmDlg, askConfirm } from './Dialogs';
import { Toast, toast } from './Toast';
import { LW_DEF, LW_KEY, lwMax } from './LeftSplit';
import { ImportDlg, PasteDlg } from './ImportDlg';
import { GenDlg } from './GenDlg';
import { ShowRoot } from '../viewer/ShowRoot';
import { WspDlg } from './wsp/WspDlg';

function mount(id: string, node: ReactNode) {
  const el = document.getElementById(id);
  if (!el) throw new Error('thiếu chỗ gắn #' + id);
  const root = createRoot(el);
  flushSync(() => root.render(node));
}
mount('r-app', <AppShell />);
mount('r-help', <HelpPop />);
mount('r-dlg', <DataDlg />);
mount('r-cfm', <ConfirmDlg />);
mount('r-toast', <Toast />);
mount('r-lib', <ImportDlg />);
mount('r-paste', <PasteDlg />);
mount('r-gen', <GenDlg />);
mount('r-show', <ShowRoot />);
mount('r-wsp', <WspDlg />);

// Cầu nối test: hàm của v106 đã chuyển sang src/ui vẫn gọi được trên window như trước
Object.assign(window, { askConfirm, toast, LW_DEF, LW_KEY, lwMax });
