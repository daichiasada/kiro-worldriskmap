import { useState } from 'react';
import type { RelationType, ScoredCountry } from '../domain/types';
import { bilateralRisk, classifyBand } from '../domain/risk';
import { BandPill } from '../components/BandPill';
import { ComponentBars } from '../components/ComponentBars';
import { riskColor } from '../components/colorScale';

const RELATION_LABELS: Record<RelationType, string> = {
  ally: '同盟 (×0.6)',
  neutral: '中立 (×1.0)',
  rival: '対立 (×1.4)',
};

interface Props {
  countries: ScoredCountry[];
}

function CountryColumn({ c }: { c: ScoredCountry }) {
  return (
    <div className="panel">
      <h3 style={{ marginTop: 0 }}>
        {c.nameJa} <span className="muted">/ {c.name}</span>
      </h3>
      <div className="big-score" style={{ color: riskColor(c.score) }}>
        {c.score.toFixed(1)}
      </div>
      <div style={{ margin: '8px 0 14px' }}>
        <BandPill band={c.band} />
      </div>
      <ComponentBars components={c.components} />
    </div>
  );
}

export function CompareView({ countries }: Props) {
  const [idA, setIdA] = useState(countries.find((c) => c.id === 'USA')?.id ?? countries[0].id);
  const [idB, setIdB] = useState(countries.find((c) => c.id === 'CHN')?.id ?? countries[1].id);
  const [relation, setRelation] = useState<RelationType>('rival');

  const a = countries.find((c) => c.id === idA)!;
  const b = countries.find((c) => c.id === idB)!;
  const sameCountry = idA === idB;
  const bilateral = bilateralRisk(a, b, relation);

  const options = [...countries].sort((x, y) => x.nameJa.localeCompare(y.nameJa, 'ja'));

  return (
    <section>
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="controls">
          <select value={idA} onChange={(e) => setIdA(e.target.value)} aria-label="国A">
            {options.map((c) => (
              <option key={c.id} value={c.id} disabled={c.id === idB}>
                {c.nameJa}
              </option>
            ))}
          </select>
          <select value={idB} onChange={(e) => setIdB(e.target.value)} aria-label="国B">
            {options.map((c) => (
              <option key={c.id} value={c.id} disabled={c.id === idA}>
                {c.nameJa}
              </option>
            ))}
          </select>
          <select
            value={relation}
            onChange={(e) => setRelation(e.target.value as RelationType)}
            aria-label="2国間の関係"
          >
            {(Object.keys(RELATION_LABELS) as RelationType[]).map((r) => (
              <option key={r} value={r}>
                {RELATION_LABELS[r]}
              </option>
            ))}
          </select>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div className="muted">2国間地政学リスクスコア (対称)</div>
          {sameCountry ? (
            <p className="muted" style={{ margin: '12px 0' }}>
              異なる2国を選択してください。
            </p>
          ) : (
            <>
              <div className="big-score" style={{ color: riskColor(bilateral) }}>
                {bilateral.toFixed(1)}
              </div>
              <div style={{ marginTop: 6 }}>
                <BandPill band={classifyBand(bilateral)} />
              </div>
            </>
          )}
          <p className="muted" style={{ marginTop: 8 }}>
            両国の「対外関係」「紛争・暴力」の平均に関係係数を乗じて算出。国の順序には依存しません。
          </p>
        </div>
      </div>

      <div className="grid-2">
        <CountryColumn c={a} />
        <CountryColumn c={b} />
      </div>
    </section>
  );
}
