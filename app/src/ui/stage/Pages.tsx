// Các trang A4 trong #stage (v106: drawPages dựng bằng innerHTML). legacy drawPages() tính sẵn từng trang (HTML các Task
// do core/layout renderTask sinh ra, số mm còn trống, thanh lấp đầy) rồi đăng pageView mới; ở đây dựng khung trang,
// đường dóng, chân trang và dòng trạng thái. Mỗi lần vẽ dựng lại toàn bộ (key = rev) như innerHTML cũ, nên legacy vẫn
// gắn lớp chọn (.sel, .cur) và tay kéo vào DOM của Task ngay sau đó.
import { Fragment } from 'react';
import { useUi, type PageView } from '../store';

function Guides({ g }: { g: NonNullable<PageView['guides']> }) {
  return <div className="guides" aria-hidden="true"><i style={{ left: `${g[0]}mm` }} /><i className="b" style={{ left: `${g[1]}mm` }} /><i style={{ left: `${g[2]}mm` }} /></div>;
}
function view(v: PageView) {
  const n = v.pages.length;
  return v.pages.map((p, i) => <div className="pg-wrap" key={i}><div className="pg-scale"><div className="page" data-page={i}><div className="flow" dangerouslySetInnerHTML={{ __html: p.html }} />{v.guides ? <Guides g={v.guides} /> : null}<div className="pfoot"><span>{v.title}</span><span>{`Trang ${i + 1}/${n}`}</span></div></div></div>
    <div className={`pstat ${p.over ? 'bad' : ''}`}>{`Trang ${i + 1} · ${p.over ? 'có Task tràn trang' : `còn trống ${p.free} mm`}`}<span className="bar"><i style={{ width: `${p.fill}%` }} /></span></div></div>);
}
export function Pages() {
  const v = useUi(s => s.pageView);
  return v ? <Fragment key={v.rev}>{view(v)}</Fragment> : null;
}
