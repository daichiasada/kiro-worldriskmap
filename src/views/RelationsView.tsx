import { useMemo, useState } from 'react';
import type { ScoredCountry } from '../domain/types';
import { buildRelations } from '../domain/relations';
import { REPRESENTATIVE_COUNTRY_IDS } from '../data/relations';
import { RELATION_COLORS } from '../domain/constants';
import { COUNTRIES } from '../data/countries';
import { BandPill } from '../components/BandPill';
import { useI18n } from '../i18n/I18nContext';
import { riskColor } from '../components/colorScale';

interface Props {
  scored: ScoredCountry[];
  onSelect: (id: string) => void;
}

export function RelationsView({ scored, onSelect }: Props) {
  const { t, lang, countryName } = useI18n();
  const representatives = useMemo(
    () =>
      REPRESENTATIVE_COUNTRY_IDS.map((id) => COUNTRIES.find((c) => c.id === id)!).sort((a, b) =>
        (lang === 'ja' ? a.nameJa : a.name).localeCompare(lang === 'ja' ? b.nameJa : b.name, lang),
      ),
    [lang],
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
            {t.sourceCountry}:
          </label>
          <select
            id="source-select"
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
          <span className="muted" style={{ alignSelf: 'center' }}>
            {countryName(sourceScored)} {t.score} {sourceScored.score.toFixed(1)}{' '}
            <BandPill band={sourceScored.band} />
          </span>
        </div>

        <p className="muted" style={{ margin: '4px 0 10px' }}>
          {t.relationsIntroPrefix}
          <strong>{countryName(source)}</strong>
          {t.relationsIntroSuffix}{' '}
          (<span style={{ color: RELATION_COLORS.rival }}>■</span>
          {t.relations.rival} {counts.rival} /
          <span style={{ color: RELATION_COLORS.neutral }}> ■</span>
          {t.relations.neutral} {counts.neutral} /
          <span style={{ color: RELATION_COLORS.ally }}> ■</span>
          {t.relations.ally} {counts.ally})
        </p>
      </div>

      <div className="panel">
        <table className="ranking">
          <thead>
            <tr>
              <th>{t.colRelationTarget}</th>
              <th>{t.region}</th>
              <th style={{ width: 90 }}>{t.colRelation}</th>
              <th style={{ width: 120 }}>{t.colBilateral}</th>
              <th style={{ width: 110 }}>{t.colTargetScore}</th>
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
                  {countryName(e.country)}{' '}
                  <span className="muted">/ {lang === 'ja' ? e.country.name : e.country.nameJa}</span>
                </td>
                <td className="muted">{e.country.region}</td>
                <td>
                  <span
                    className="band-pill"
                    style={{ background: RELATION_COLORS[e.relation] }}
                    data-relation={e.relation}
                  >
                    {t.relations[e.relation]}
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
        {t.relationsFootnote}
      </p>
    </section>
  );
}
