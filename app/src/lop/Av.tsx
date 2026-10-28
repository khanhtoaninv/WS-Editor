// Avatar học sinh (hình con vật + màu nền theo mã học sinh, shared/src/avatar.ts)
import { avatarOf } from '../../../shared/src/index.ts';
export function Av({ id, size = 28 }: { id: string; size?: number }) {
  const a = avatarOf(id);
  return <span className="av" aria-hidden="true" style={{ width: size, height: size, fontSize: size * 0.62, background: `hsl(${a.hue} 70% 86%)` }}>{a.emoji}</span>;
}
