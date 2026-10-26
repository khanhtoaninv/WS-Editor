# WS Editor

Công cụ dàn trang phiếu bài tập A4 (một file HTML, JS thuần, không thư viện). Mỗi Task là một khung có tiêu đề, ảnh, nội dung, đáp án; chỉnh bố cục bằng kéo tỉ lệ và gõ số. Dừng ở đầu ra HTML.

## Chạy

Trên Windows: bấm đúp `chay.bat`. File tự lấy bản mới nhất từ GitHub (`git pull`, lần đầu thì `git clone` vào thư mục `WS-Editor` cạnh file) rồi mở app. Cần cài Git. Mất mạng thì vẫn mở bản đang có.

Cách thủ công:

Mở `ws-editor-prototype.html` bằng Chrome hoặc Edge (bấm đúp là chạy). Font Andika, Be Vietnam Pro và Lexend đã nhúng sẵn trong `fonts/`, không cần mạng. Giữ thư mục `fonts/` cạnh file HTML.

Muốn dữ liệu lưu trong trình duyệt (mặc định theo dạng bài, độ rộng cột trái) ổn định, chạy qua máy chủ nhỏ:

    python -m http.server 8000      # rồi mở http://localhost:8000/ws-editor-prototype.html

## Nhập dữ liệu

Nút "+ Task" hoặc "+ Phiếu" ở cột trái, thẻ "Từ file / dán": JSON (ví dụ `samples/ws-sea-sample.json`), MD theo `docs/QUY_UOC_MD.md`, hoặc dán chữ.

## Kiểm thử

    pip install playwright
    python -m playwright install chromium
    python tests/test15.py "$(pwd)/ws-editor-prototype.html"      # chạy một test
    bash tests/run_all.sh "$(pwd)/ws-editor-prototype.html" <bản-cũ.html>   # chạy từng test một

Mỗi test in `PASS`/`FAIL` và dòng cuối `ALL OK` hoặc `SOME FAIL`. `test2` so bố cục với một bản cũ (đối số thứ hai). Trên Windows dùng Git Bash cho `run_all.sh`; đường dẫn truyền vào là đường dẫn tuyệt đối.

## Thư mục

- `docs/`: spec (`WS_EDITOR_SPEC.md`, `WS_EDITOR_SPEC_v37_bo_sung.md`), phương án nhập file, quy ước MD, ghi chú bắt đầu phiên mới.
- `samples/`: phiếu mẫu. Phiếu demo 18 Task có sẵn trong app.
- `tests/`: bộ test Playwright, ảnh và MD mẫu.
- `fonts/`: font nhúng (giấy phép SIL OFL, kèm file giấy phép).

Bản v76.
