// Báo cáo lớp và từng em (v121–v122).
export function BaoCao({ onBack }: { phien: string; ai: boolean; onBack: () => void; onCham: (hs: string) => void }) {
  return <><button className="lb ghost" onClick={onBack}>← Phiên</button><p className="hint">Báo cáo: bản sau (v121).</p></>;
}
