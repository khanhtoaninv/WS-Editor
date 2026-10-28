// Chấm chữa từng học sinh (v120).
export function Cham({ onBack }: { phien: string; hs?: string; onBack: () => void; onReport: () => void }) {
  return <><button className="lb ghost" onClick={onBack}>← Phiên</button><p className="hint">Chấm chữa: bản sau (v120).</p></>;
}
