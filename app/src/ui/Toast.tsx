// Thông báo ngắn ở góc (v106: #toast). Hiện 2,6 giây; thông báo mới thay thông báo cũ và tính lại giờ.
import { useUi, publish } from './store';

let timer: ReturnType<typeof setTimeout> | undefined;
export function toast(m: string) {
  publish({ toastMsg: m, toastShow: true });
  clearTimeout(timer); timer = setTimeout(() => publish({ toastShow: false }), 2600);
}

export function Toast() {
  const { toastMsg, toastShow } = useUi();
  return <div className={'toast' + (toastShow ? ' show' : '')} id="toast" role="status">{toastMsg}</div>;
}
