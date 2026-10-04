import { useMemo, useState } from 'react';
import { COUNTRIES } from './data/countries';
import { rankCountries } from './domain/risk';
import { MapView } from './views/MapView';
import { RankingView } from './views/RankingView';
import { CountryDetailView } from './views/CountryDetailView';
import { CompareView } from './views/CompareView';
import { RelationsView } from './views/RelationsView';
import { SourcesView } from './views/SourcesView';
import { useI18n } from './i18n/I18nContext';
import type { Lang } from './i18n/messages';

type Tab = 'map' | 'ranking' | 'relations' | 'detail' | 'compare' | 'sources';

const TAB_IDS: Tab[] = ['map', 'ranking', 'relations', 'detail', 'compare', 'sources'];

export default function App() {
  const { t, lang, setLang } = useI18n();
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
    const next = (index + dir + TAB_IDS.length) % TAB_IDS.length;
    setTab(TAB_IDS[next]);
    document.getElementById(`tab-${TAB_IDS[next]}`)?.focus();
  };

  return (
    <>
      <header className="site-header">
        <div className="app" style={{ paddingBottom: 0 }}>
          <div className="header-top">
            <h1>{t.appTitle}</h1>
            <div className="lang-switch" role="group" aria-label={t.language}>
              {(['en', 'ja'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  className={lang === l ? 'active' : ''}
                >
                  {l === 'en' ? 'EN' : '日本語'}
                </button>
              ))}
            </div>
          </div>
          <p>{t.appTagline}</p>
          <nav className="tabs" role="tablist" aria-label={t.language}>
            {TAB_IDS.map((id, i) => (
              <button
                key={id}
                id={`tab-${id}`}
                role="tab"
                aria-selected={tab === id}
                aria-controls="tabpanel"
                tabIndex={tab === id ? 0 : -1}
                onClick={() => setTab(id)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
              >
                {t.tabs[id]}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="app" id="tabpanel" role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0}>
        {tab === 'map' && <MapView scored={scored} onSelect={openDetail} />}
        {tab === 'ranking' && <RankingView scored={scored} onSelect={openDetail} />}
        {tab === 'relations' && <RelationsView scored={scored} onSelect={openDetail} />}
        {tab === 'detail' && (
          <CountryDetailView countries={scored} selectedId={selectedId} onSelect={setSelectedId} />
        )}
        {tab === 'compare' && <CompareView countries={scored} />}
        {tab === 'sources' && <SourcesView />}
      </main>
    </>
  );
}
