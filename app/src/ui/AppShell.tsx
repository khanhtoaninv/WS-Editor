// Khung app (v106: <div class="app"> + ô đo ẩn #measure). React dựng khung và ba cột;
// nội dung ba cột (cây soạn bài, các trang A4, inspector) hiện vẫn do bộ dựng HTML của legacy sinh ra
// rồi đặt vào các ô rỗng này — JSX để trống nên React không đụng tới con của chúng.
import { TopBar } from './TopBar';
import { LeftSplit } from './LeftSplit';

export function AppShell() {
  return (
    <>
      <div className="app">
        <TopBar />
        <aside className="pane tree" id="tree" aria-label="Cây container" />
        <LeftSplit />
        <main className="pane stage paper" id="stage" />
        <aside className="pane insp" id="insp" aria-label="Inspector" />
      </div>
      <div id="measure" className="paper" aria-hidden="true" />
    </>
  );
}
