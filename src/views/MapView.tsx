import { useState } from 'react';
import { WorldMap, type MapMode } from '../components/WorldMap';
import { Legend } from '../components/Legend';
import type { ScoredCountry } from '../domain/types';
import { ISO_NUMERIC_TO_ID } from '../data/isoNumeric';
import { REPRESENTATIVE_COUNTRY_IDS } from '../data/relations';
import { RELATION_COLORS } from '../domain/constants';
import { COUNTRIES } from '../data/countries';
import { useI18n } from '../i18n/I18nContext';

interface Props {
  scored: ScoredCountry[];
  onSelect: (id: string) => void;
}

function RelationLegend() {
  const { t } = useI18n();
  return (
    <div className="legend" aria-label={t.relationLegend}>
      <span>{t.colRelation}:</span>
      <span>
        <span className="swatch" style={{ background: '#4da8ff' }} />
        {t.originCountry}
      </span>
      {(['rival', 'neutral', 'ally'] as const).map((r) => (
        <span key={r}>
          <span className="swatch" style={{ background: RELATION_COLORS[r] }} />
          {t.relations[r]}
        </span>
      ))}
    </div>
  );
}

export function MapView({ scored, onSelect }: Props) {
  const { t, countryName } = useI18n();
  const [mode, setMode] = useState<MapMode>('risk');
  const [sourceId, setSourceId] = useState('JPN');

  const highest = scored[0];
  const lowest = scored[scored.length - 1];
  const avg = scored.reduce((s, c) => s + c.score, 0) / scored.length;

  const representatives = REPRESENTATIVE_COUNTRY_IDS.map(
    (id) => COUNTRIES.find((c) => c.id === id)!,
  );
  const sourceCountry = COUNTRIES.find((c) => c.id === sourceId)!;

  return (
    <section>
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="controls">
          <label htmlFor="map-mode" style={{ alignSelf: 'center' }}>
            {t.mapMode}
          </label>
          <select
            id="map-mode"
            value={mode}
            onChange={(e) => setMode(e.target.value as MapMode)}
            aria-label={t.mapMode}
          >
            <option value="risk">{t.modeRisk}</option>
            <option value="relations">{t.modeRelations}</option>
          </select>
          {mode === 'relations' && (
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              aria-label={t.sourceCountry}
            >
              {representatives.map((c) => (
                <option key={c.id} value={c.id}>
                  {countryName(c)}
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
              <div className="muted">{t.highestRisk}</div>
              <div className="big-score" style={{ color: '#c92a2a' }}>
                {highest.score.toFixed(1)}
              </div>
              <div>{countryName(highest)}</div>
            </div>
            <div className="panel">
              <div className="muted">{t.lowestAndAvg}</div>
              <div className="big-score" style={{ color: '#2e8b57' }}>
                {lowest.score.toFixed(1)}
              </div>
              <div>
                {countryName(lowest)}{' '}
                <span className="muted">
                  {t.average} {avg.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
          <p className="muted" style={{ marginTop: 12 }}>
            {t.mapRiskHint}
          </p>
        </>
      ) : (
        <p className="muted" style={{ marginTop: 12 }}>
          {t.mapRelationsHintPrefix}
          <strong>{countryName(sourceCountry)}</strong>
          {t.mapRelationsHintSuffix}
        </p>
      )}
    </section>
  );
}
