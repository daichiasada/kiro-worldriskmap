import { useMemo, useState } from 'react';
import type { ScoredCountry } from '../domain/types';
import { BandPill } from '../components/BandPill';
import { useI18n } from '../i18n/I18nContext';
import { riskColor } from '../components/colorScale';

interface Props {
  scored: ScoredCountry[];
  onSelect: (id: string) => void;
}

export function RankingView({ scored, onSelect }: Props) {
  const { t, lang, countryName } = useI18n();
  const [query, setQuery] = useState('');
  const [desc, setDesc] = useState(true);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = scored.filter(
      (c) => c.name.toLowerCase().includes(q) || c.nameJa.toLowerCase().includes(q),
    );
    const sorted = [...filtered].sort((a, b) => (desc ? b.score - a.score : a.score - b.score));
    return sorted;
  }, [scored, query, desc]);

  return (
    <section className="panel">
      <div className="controls">
        <input
          type="search"
          placeholder={t.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={t.searchPlaceholder}
        />
        <select
          value={desc ? 'desc' : 'asc'}
          onChange={(e) => setDesc(e.target.value === 'desc')}
          aria-label={t.sortOrder}
        >
          <option value="desc">{t.sortDesc}</option>
          <option value="asc">{t.sortAsc}</option>
        </select>
        <span className="muted" style={{ alignSelf: 'center' }}>
          {t.countriesCount(rows.length)}
        </span>
      </div>
      <table className="ranking">
        <thead>
          <tr>
            <th style={{ width: 48 }}>#</th>
            <th>{t.colCountry}</th>
            <th>{t.region}</th>
            <th style={{ width: 90 }}>{t.score}</th>
            <th style={{ width: 80 }}>{t.risk}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c, i) => (
            <tr key={c.id} onClick={() => onSelect(c.id)} data-testid="rank-row">
              <td className="muted">{i + 1}</td>
              <td>
                {countryName(c)}{' '}
                <span className="muted">/ {lang === 'ja' ? c.name : c.nameJa}</span>
              </td>
              <td className="muted">{c.region}</td>
              <td className="score-cell" style={{ color: riskColor(c.score) }}>
                {c.score.toFixed(1)}
              </td>
              <td>
                <BandPill band={c.band} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
