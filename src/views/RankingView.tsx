import { useMemo, useState } from 'react';
import type { ScoredCountry } from '../domain/types';
import { BandPill } from '../components/BandPill';
import { riskColor } from '../components/colorScale';

interface Props {
  scored: ScoredCountry[];
  onSelect: (id: string) => void;
}

export function RankingView({ scored, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [desc, setDesc] = useState(true);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = scored.filter(
      (c) => c.name.toLowerCase().includes(q) || c.nameJa.includes(query.trim()),
    );
    const sorted = [...filtered].sort((a, b) => (desc ? b.score - a.score : a.score - b.score));
    return sorted;
  }, [scored, query, desc]);

  return (
    <section className="panel">
      <div className="controls">
        <input
          type="search"
          placeholder="国名で検索 (例: 日本 / Japan)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="国名で検索"
        />
        <select
          value={desc ? 'desc' : 'asc'}
          onChange={(e) => setDesc(e.target.value === 'desc')}
          aria-label="並び順"
        >
          <option value="desc">リスク高い順</option>
          <option value="asc">リスク低い順</option>
        </select>
        <span className="muted" style={{ alignSelf: 'center' }}>
          {rows.length} カ国
        </span>
      </div>
      <table className="ranking">
        <thead>
          <tr>
            <th style={{ width: 48 }}>#</th>
            <th>国</th>
            <th>地域</th>
            <th style={{ width: 90 }}>スコア</th>
            <th style={{ width: 80 }}>リスク</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c, i) => (
            <tr key={c.id} onClick={() => onSelect(c.id)} data-testid="rank-row">
              <td className="muted">{i + 1}</td>
              <td>
                {c.nameJa} <span className="muted">/ {c.name}</span>
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
