// Gắn trình chiếu vào WS Editor: nút ▶ Chiếu nổi ở góc dưới khung trang (không chen vào thanh trên, để thanh trên
// không xuống dòng), mở khi kho có `show`, đóng thì gỡ hết (phiếu soạn không bị đụng tới).
import { publish, useUi } from '../ui/store';
import { actions } from '../ui/actions';
import { Presenter } from './Presenter';

export function ShowRoot() {
  const d = useUi(s => s.show), pages = useUi(s => s.pages);
  return <>
    {d ? null : <button className="btn pri showfab" id="showBtn" title="Trình chiếu phiếu lên lớp (toàn màn hình)" disabled={!pages} onClick={() => actions.present()}>▶ Chiếu</button>}
    {d ? <Presenter data={d} onClose={() => publish({ show: null })} /> : null}
  </>;
}
