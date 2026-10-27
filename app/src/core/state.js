// Trạng thái phiếu đang mở. Module khác đọc `ws` (live binding), chỉ đổi qua setWs().
export let ws = null;
export function setWs(v) { ws = v; }
