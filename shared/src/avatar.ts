// Avatar học sinh: suy ra từ mã học sinh (cùng mã → cùng hình ở mọi màn, không cần lưu thêm).
// Khi tạo học sinh mới, máy chủ chọn mã sao cho trong một lớp các em có hình khác nhau (tới hết bộ hình).
export const AVATARS = ['🐱', '🐶', '🐰', '🦊', '🐼', '🐨', '🦁', '🐯', '🐸', '🐵', '🐧', '🐢', '🦄', '🐙', '🐳', '🦉', '🐝', '🦋', '🐞', '🐬', '🦒', '🐘', '🦜', '🐿️'];
const fnv = (s: string) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
export const avatarIndex = (id: string) => fnv(id) % AVATARS.length;
export const avatarOf = (id: string) => ({ emoji: AVATARS[avatarIndex(id)], hue: (fnv('c' + id) >>> 3) % 360 });
