import { useMemo, useState } from 'react';
import { COUNTRIES } from './data/countries';
import { rankCountries } from './domain/risk';
import { MapView } from './views/MapView';
import { RankingView } from './views/RankingView';
import { CountryDetailView } from './views/CountryDetailView';
import { CompareView } from './views/CompareView';
import { SourcesView } from './views/SourcesView';

type Tab = 'map' | 'ranking' | 'detail' | 'compare' | 'sources';

const TABS: { id: Tab; label: string }[] = [
  { id: 'map', label: '世界地図' },
  { id: 'ranking', label: 'ランキング' },
  { id: 'detail', label: '国別詳細' },
  { id: 'compare', label: '2国間比較' },
  { id: 'sources', label: '出典' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('map');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const scored = useMemo(() => rankCountries(COUNTRIES), []);

  const openDetail = (id: string) => {
    setSelectedId(id);
    setTab('detail');
  };

  return (
    <>
      <header className="site-header">
        <div className="app" style={{ paddingBottom: 0 }}>
          <h1>🌐 World Geopolitical Risk Map</h1>
          <p>公開されている定量化指標に基づき、各国・国家間の地政学リスクを可視化します。</p>
          <nav className="tabs" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="app">
        {tab === 'map' && <MapView scored={scored} onSelect={openDetail} />}
        {tab === 'ranking' && <RankingView scored={scored} onSelect={openDetail} />}
        {tab === 'detail' && (
          <CountryDetailView countries={scored} selectedId={selectedId} onSelect={setSelectedId} />
        )}
        {tab === 'compare' && <CompareView countries={scored} />}
        {tab === 'sources' && <SourcesView />}
      </main>
    </>
  );
}
