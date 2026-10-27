// Cầu nối tạm trong lúc chuyển sang React: các phần giao diện đã là JSX đọc trạng thái và hàm còn nằm trong
// legacy/app.js qua đối tượng này (legacy tự điền ở cuối file khi nạp). Hết legacy thì bỏ.
// Trạng thái thay đổi theo thời gian (sel, multi, lastRes…) là getter nên luôn đọc giá trị hiện tại.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const L: any = {};
