import { useState } from 'react';
import { WorldMap, type MapMode } from '../components/WorldMap';
import { Legend } from '../components/Legend';
import type { ScoredCountry } from '../domain/types';
import { ISO_NUMERIC_TO_ID } from '../data/isoNumeric';
import { REPRESENTATIVE_COUNTRY_IDS } from '../data/relations';
import { RELATION_COLORS, RELATION_LABELS } from '../domain/constants';
import { COUNTRIES } from '../data/countries';

interface Props {
  scored: ScoredCountry[];
  onSelect: (id: string) => void;
}

function RelationLegend() {
  return (
    <div className="legend" aria-label="関係凡例">
      <span>起点国との関係:</span>
      <span>
        <span className="swatch" style={{ background: '#4da8ff' }} />
        起点国
      </span>
      {(['rival', 'neutral', 'ally'] as const).map((r) => (
        <span key={r}>
          <span className="swatch" style={{ background: RELATION_COLORS[r] }} />
          {RELATION_LABELS[r]}
        </span>
      ))}
    </div>
  );
}

export function MapView({ scored, onSelect }: Props) {
  const [mode, setMode] = useState<MapMode>('risk');
  const [sourceId, setSourceId] = useState('JPN');

  const highest = scored[0];
  const lowest = scored[scored.length - 1];
  const avg = scored.reduce((s, c) => s + c.score, 0) / scored.length;

  const representatives = REPRESENTATIVE_COUNTRY_IDS.map(
    (id) => COUNTRIES.find((c) => c.id === id)!,
  ).sort((a, b) => a.nameJa.localeCompare(b.nameJa, 'ja'));

  return (
    <section>
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="controls">
          <label htmlFor="map-mode" style={{ alignSelf: 'center' }}>
            表示モード:
          </label>
          <select
            id="map-mode"
            value={mode}
            onChange={(e) => setMode(e.target.value as MapMode)}
            aria-label="地図の表示モード"
          >
            <option value="risk">リスク(合成スコア)</option>
            <option value="relations">関係(起点国から見た関係)</option>
          </select>
          {mode === 'relations' && (
            <select
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
          )}
        </div>
        {mode === 'risk' ? <Legend /> : <RelationLegend />}
      </div>

      <div className="panel">
        <WorldMap
          scored={scored}
          isoNumericToId={ISO_NUMERIC_TO_ID}
          onSelect={onSelect}
          mode={mode}
          sourceId={mode === 'relations' ? sourceId : undefined}
          lineTargetIds={REPRESENTATIVE_COUNTRY_IDS}
        />
      </div>

      {mode === 'risk' ? (
        <>
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
        </>
      ) : (
        <p className="muted" style={{ marginTop: 12 }}>
          <strong>{COUNTRIES.find((c) => c.id === sourceId)!.nameJa}</strong>{' '}
          を起点に、各国を関係区分(
          <span style={{ color: RELATION_COLORS.rival }}>対立</span> /{' '}
          <span style={{ color: RELATION_COLORS.neutral }}>中立</span> /{' '}
          <span style={{ color: RELATION_COLORS.ally }}>同盟</span>
          )で色分けしています。起点国(青)から代表国への線は関係区分の色です。
          カーソルで二国間リスクを確認でき、クリックで相手国の詳細を開きます。
        </p>
      )}
    </section>
  );
}
