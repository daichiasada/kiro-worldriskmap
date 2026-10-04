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

  // 矢印キーでのタブ移動 (WAI-ARIA roving tabindex)
  const onTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const next = (index + dir + TABS.length) % TABS.length;
    setTab(TABS[next].id);
    document.getElementById(`tab-${TABS[next].id}`)?.focus();
  };

  return (
    <>
      <header className="site-header">
        <div className="app" style={{ paddingBottom: 0 }}>
          <h1>🌐 World Geopolitical Risk Map</h1>
          <p>公開されている定量化指標に基づき、各国・国家間の地政学リスクを可視化します。</p>
          <nav className="tabs" role="tablist" aria-label="ビュー切り替え">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                id={`tab-${t.id}`}
                role="tab"
                aria-selected={tab === t.id}
                aria-controls="tabpanel"
                tabIndex={tab === t.id ? 0 : -1}
                onClick={() => setTab(t.id)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="app" id="tabpanel" role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0}>
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
