import type { ScoredCountry } from '../domain/types';
import { BandPill } from '../components/BandPill';
import { ComponentBars } from '../components/ComponentBars';
import { useI18n } from '../i18n/I18nContext';
import { riskColor } from '../components/colorScale';

interface Props {
  countries: ScoredCountry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function CountryDetailView({ countries, selectedId, onSelect }: Props) {
  const { t, lang, countryName } = useI18n();
  const country = countries.find((c) => c.id === selectedId) ?? countries[0];

  return (
    <section className="panel">
      <div className="controls">
        <select value={country.id} onChange={(e) => onSelect(e.target.value)} aria-label={t.selectCountry}>
          {[...countries]
            .sort((a, b) => countryName(a).localeCompare(countryName(b), lang))
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
            {countryName(country)}{' '}
            <span className="muted">/ {lang === 'ja' ? country.name : country.nameJa}</span>
          </h2>
          <div className="muted" style={{ marginBottom: 12 }}>
            {country.region}
          </div>
          <div className="big-score" style={{ color: riskColor(country.score) }}>
            {country.score.toFixed(1)}
            <span style={{ fontSize: 18, color: 'var(--text-dim)' }}> {t.outOf100}</span>
          </div>
          <div style={{ marginTop: 10 }}>
            {t.riskCategory} <BandPill band={country.band} />
          </div>
        </div>
        <div>
          <h3 style={{ marginTop: 0 }}>{t.riskBreakdown}</h3>
          <ComponentBars components={country.components} />
        </div>
      </div>

      <p className="muted" style={{ marginTop: 16 }}>
        {t.detailHint}
      </p>
    </section>
  );
}
