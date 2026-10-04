import { WorldMap } from '../components/WorldMap';
import { Legend } from '../components/Legend';
import type { ScoredCountry } from '../domain/types';
import { ISO_NUMERIC_TO_ID } from '../data/isoNumeric';

interface Props {
  scored: ScoredCountry[];
  onSelect: (id: string) => void;
}

export function MapView({ scored, onSelect }: Props) {
  const highest = scored[0];
  const lowest = scored[scored.length - 1];
  const avg = scored.reduce((s, c) => s + c.score, 0) / scored.length;

  return (
    <section>
      <div className="panel" style={{ marginBottom: 16 }}>
        <Legend />
      </div>
      <div className="panel">
        <WorldMap scored={scored} isoNumericToId={ISO_NUMERIC_TO_ID} onSelect={onSelect} />
      </div>
      <div className="grid-2" style={{ marginTop: 16 }}>
        <div className="panel">
          <div className="muted">最高リスク</div>
          <div className="big-score" style={{ color: '#c92a2a' }}>
            {highest.score.toFixed(1)}
          </div>
          <div>{highest.nameJa}</div>
        </div>
        <div className="panel">
          <div className="muted">最低リスク / 平均</div>
          <div className="big-score" style={{ color: '#2e8b57' }}>
            {lowest.score.toFixed(1)}
          </div>
          <div>
            {lowest.nameJa} <span className="muted">平均 {avg.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <p className="muted" style={{ marginTop: 12 }}>
        地図上の国にカーソルを合わせるとスコアが表示されます。クリックすると詳細を開きます。
        グレーの国はデータ未収録です。
      </p>
    </section>
  );
}
