import { useMemo, useState } from 'react';
import type { ScoredCountry } from '../domain/types';
import { buildRelations } from '../domain/relations';
import { REPRESENTATIVE_COUNTRY_IDS } from '../data/relations';
import { RELATION_COLORS, RELATION_LABELS } from '../domain/constants';
import { COUNTRIES } from '../data/countries';
import { BandPill } from '../components/BandPill';
import { riskColor } from '../components/colorScale';

interface Props {
  scored: ScoredCountry[];
  onSelect: (id: string) => void;
}

export function RelationsView({ scored, onSelect }: Props) {
  const representatives = useMemo(
    () =>
      REPRESENTATIVE_COUNTRY_IDS.map((id) => COUNTRIES.find((c) => c.id === id)!).sort((a, b) =>
        a.nameJa.localeCompare(b.nameJa, 'ja'),
      ),
    [],
  );

  const [sourceId, setSourceId] = useState('JPN');
  const source = COUNTRIES.find((c) => c.id === sourceId)!;
  const sourceScored = scored.find((c) => c.id === sourceId)!;

  const entries = useMemo(() => buildRelations(source, COUNTRIES), [source]);

  const counts = useMemo(() => {
    const c = { ally: 0, neutral: 0, rival: 0 };
    for (const e of entries) c[e.relation] += 1;
    return c;
  }, [entries]);

  return (
    <section>
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="controls">
          <label htmlFor="source-select" style={{ alignSelf: 'center' }}>
            起点国:
          </label>
          <select
            id="source-select"
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            aria-label="起点となる代表国"
          >
            {representatives.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nameJa} / {c.name}
              </option>
            ))}
          </select>
          <span className="muted" style={{ alignSelf: 'center' }}>
            {sourceScored.nameJa} の合成リスク {sourceScored.score.toFixed(1)}{' '}
            <BandPill band={sourceScored.band} />
          </span>
        </div>

        <p className="muted" style={{ margin: '4px 0 10px' }}>
          <strong>{source.nameJa}</strong> から見た各国との関係性です。関係区分(
          <span style={{ color: RELATION_COLORS.rival }}>■</span>対立 {counts.rival} /
          <span style={{ color: RELATION_COLORS.neutral }}> ■</span>中立 {counts.neutral} /
          <span style={{ color: RELATION_COLORS.ally }}> ■</span>同盟 {counts.ally})ごとに、
          二国間地政学リスクスコアの高い順で並べています。
        </p>
      </div>

      <div className="panel">
        <table className="ranking">
          <thead>
            <tr>
              <th>相手国</th>
              <th>地域</th>
              <th style={{ width: 90 }}>関係</th>
              <th style={{ width: 120 }}>二国間リスク</th>
              <th style={{ width: 110 }}>相手国スコア</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr
                key={e.country.id}
                data-testid="relation-row"
                onClick={() => onSelect(e.country.id)}
              >
                <td>
                  {e.country.nameJa} <span className="muted">/ {e.country.name}</span>
                </td>
                <td className="muted">{e.country.region}</td>
                <td>
                  <span
                    className="band-pill"
                    style={{ background: RELATION_COLORS[e.relation] }}
                    data-relation={e.relation}
                  >
                    {RELATION_LABELS[e.relation]}
                  </span>
                </td>
                <td className="score-cell" style={{ color: riskColor(e.bilateral) }}>
                  {e.bilateral.toFixed(1)}
                </td>
                <td className="score-cell" style={{ color: riskColor(e.country.score) }}>
                  {e.country.score.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="muted" style={{ marginTop: 12 }}>
        関係区分(同盟/中立/対立)は一般に知られる同盟・対立の構図を参考にした教育目的の分類であり、
        公式な外交評価ではありません。二国間リスクは両国の「対外関係」「紛争・暴力」の平均に関係係数を
        乗じた対称スコアです。行をクリックすると相手国の詳細を開きます。
      </p>
    </section>
  );
}
