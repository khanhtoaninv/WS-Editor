// Khung app (v106: <div class="app"> + ô đo ẩn #measure). React dựng khung và ba cột;
// cột phải (inspector, insp/), cột trái (danh sách Task + khung soạn, tree/) và khung các trang A4 (stage/) là React.
// Bên trong mỗi trang, các Task vẫn là HTML do core/layout renderTask sinh ra (dùng chung với bộ đo / xếp trang).
import { TopBar } from './TopBar';
import { LeftSplit } from './LeftSplit';
import { Inspector } from './insp/Inspector';
import { Tree } from './tree/Tree';
import { Pages } from './stage/Pages';
import { Guard } from './Guard';

export function AppShell() {
  return (
    <>
      <div className="app">
        <TopBar />
        <aside className="pane tree" id="tree" aria-label="Cây container"><Guard name="tree"><Tree /></Guard></aside>
        <LeftSplit />
        <main className="pane stage paper" id="stage"><Guard name="pages"><Pages /></Guard></main>
        <aside className="pane insp" id="insp" aria-label="Inspector"><Guard name="inspector"><Inspector /></Guard></aside>
      </div>
      <div id="measure" className="paper" aria-hidden="true" />
    </>
  );
}
