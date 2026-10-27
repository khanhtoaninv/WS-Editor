// Cột phải (inspector). legacy renderInspector() chỉnh lựa chọn rồi đăng inspRev mới: React dựng lại toàn bộ cột
// (key đổi = gắn mới, giống innerHTML của bản cũ: ô nhập lấy lại giá trị từ phiếu, không giữ trạng thái cũ).
import { Fragment } from 'react';
import { useUi } from '../store';
import { inspView } from './panels';

export function Inspector() {
  const rev = useUi(s => s.inspRev);
  return rev ? <Fragment key={rev}>{inspView()}</Fragment> : null;
}
