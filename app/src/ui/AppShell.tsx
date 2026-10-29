// Khung app (v106: <div class="app"> + ô đo ẩn #measure). React dựng khung và ba cột;
// cột phải (inspector, insp/), cột trái (danh sách Task + khung soạn, tree/) và khung các trang A4 (stage/) là React.
// Bên trong mỗi trang, các Task vẫn là HTML do core/layout renderTask sinh ra (dùng chung với bộ đo / xếp trang).
import { TopBar } from './TopBar';
import { LeftSplit } from './LeftSplit';
import { Inspector } from './insp/Inspector';
import { Tree } from './tree/Tree';
import { Pages } from './stage/Pages';
import { Guard } from './Guard';
import { TaoBaiBar, TaoBaiDrawer, TbPubDlg } from '../taobai/TaoBai';
import { TbOverlay } from '../taobai/Checks';
import { RaDe } from '../taobai/RaDe';
import { ThietLap } from '../taobai/ThietLap';
import { KhoPhieu } from '../taobai/KhoPhieu';

export function AppShell() {
  return (
    <>
      <Guard name="taobai-bar"><TaoBaiBar /></Guard>
      <div className="app">
        <TopBar />
        <aside className="pane tree" id="tree" aria-label="Cây container"><Guard name="tree"><Tree /></Guard></aside>
        <LeftSplit />
        <main className="pane stage paper" id="stage"><Guard name="pages"><Pages /></Guard></main>
        <aside className="pane insp" id="insp" aria-label="Inspector"><Guard name="inspector"><Inspector /></Guard></aside>
        <Guard name="taobai-drawer"><TaoBaiDrawer /></Guard>
      </div>
      <Guard name="taobai-pub"><TbPubDlg /></Guard>
      <Guard name="taobai-overlay"><TbOverlay /></Guard>
      <Guard name="taobai-rade"><RaDe /></Guard>
      <Guard name="taobai-thietlap"><ThietLap /></Guard>
      <Guard name="taobai-kho"><KhoPhieu /></Guard>
      <div id="measure" className="paper" aria-hidden="true" />
    </>
  );
}
