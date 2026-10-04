import type { ScoredCountry } from '../domain/types';
import { BandPill } from '../components/BandPill';
import { ComponentBars } from '../components/ComponentBars';
import { riskColor } from '../components/colorScale';

interface Props {
  countries: ScoredCountry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function CountryDetailView({ countries, selectedId, onSelect }: Props) {
  const country = countries.find((c) => c.id === selectedId) ?? countries[0];

  return (
    <section className="panel">
      <div className="controls">
        <select
          value={country.id}
          onChange={(e) => onSelect(e.target.value)}
          aria-label="国を選択"
        >
          {[...countries]
            .sort((a, b) => a.nameJa.localeCompare(b.nameJa, 'ja'))
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameJa} / {c.name}
              </option>
            ))}
        </select>
      </div>

      <div className="grid-2">
        <div>
          <h2 style={{ margin: '0 0 4px' }}>
            {country.nameJa} <span className="muted">/ {country.name}</span>
          </h2>
          <div className="muted" style={{ marginBottom: 12 }}>
            {country.region}
          </div>
          <div className="big-score" style={{ color: riskColor(country.score) }}>
            {country.score.toFixed(1)}
            <span style={{ fontSize: 18, color: 'var(--text-dim)' }}> / 100</span>
          </div>
          <div style={{ marginTop: 10 }}>
            リスク区分: <BandPill band={country.band} />
          </div>
        </div>
        <div>
          <h3 style={{ marginTop: 0 }}>リスク内訳</h3>
          <ComponentBars components={country.components} />
        </div>
      </div>

      <p className="muted" style={{ marginTop: 16 }}>
        合成スコアは各コンポーネントの重み付き平均です。重みと算出方法は「出典」タブを参照してください。
      </p>
    </section>
  );
}
