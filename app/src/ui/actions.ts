// Hành động mà giao diện React gọi; phần legacy đăng ký hàm thật khi nạp (legacy/app.js).
type Fn = (...a: any[]) => void;
const noop: Fn = () => {};
export const actions: Record<'undo' | 'redo' | 'setAge' | 'zoomIn' | 'zoomOut' | 'zoomFit' | 'toggleGuides' | 'showJson' | 'showMd' | 'toast' | 'draw' | 'liveScale' | 'lnAdd' | 'impOk' | 'impClosed' | 'pasteItems' | 'present', Fn> = {
  undo: noop, redo: noop, setAge: noop, zoomIn: noop, zoomOut: noop, zoomFit: noop, toggleGuides: noop, showJson: noop, showMd: noop, toast: noop, draw: noop, liveScale: noop, lnAdd: noop, impOk: noop, impClosed: noop, pasteItems: noop, present: noop,
};
