// Gắn trình chiếu vào WS Editor: nút ▶ Chiếu nổi ở góc dưới khung trang (không chen vào thanh trên, để thanh trên
// không xuống dòng), mở khi kho có `show`, đóng thì gỡ hết (phiếu soạn không bị đụng tới). v118: nút "Gói .wsp" nổi cạnh.
import { publish, useUi } from '../ui/store';
import { actions } from '../ui/actions';
import { Presenter } from './Presenter';

// Nút Live chỉ hiện khi editor được máy chủ lớp thử phục vụ (nó chèn thẻ meta ws-lop)
const LOP = /^https?:$/.test(location.protocol) && !!document.querySelector('meta[name="ws-lop"]');

export function ShowRoot() {
  const d = useUi(s => s.show), pages = useUi(s => s.pages);
  return <>
    {d || !LOP ? null : <button className="btn showfab livefab" id="liveBtn" title="Giao phiếu này cho lớp (lớp học thử): mã vào lớp, mã QR, theo dõi trực tiếp" disabled={!pages} onClick={() => publish({ liveOpen: true })}>● Live</button>}
    {d ? null : <button className="btn showfab wspfab" id="wspBtn" title="Gói phiếu tương tác (.wsp): xuất gói cho học sinh làm, hoặc mở lại gói đã xuất" disabled={!pages} onClick={() => publish({ wspOpen: true })}>Gói .wsp</button>}
    {d ? null : <button className="btn pri showfab" id="showBtn" title="Trình chiếu phiếu lên lớp (toàn màn hình)" disabled={!pages} onClick={() => actions.present()}>▶ Chiếu</button>}
    {d ? <Presenter data={d} onClose={() => publish({ show: null })} /> : null}
  </>;
}
