import { BAND_THRESHOLDS, RISK_WEIGHTS } from '../domain/constants';
import type { RiskComponentKey } from '../domain/types';
import { useI18n } from '../i18n/I18nContext';

const KEYS = Object.keys(RISK_WEIGHTS) as RiskComponentKey[];
const { moderate, high, severe } = BAND_THRESHOLDS;

export function SourcesView() {
  const { t } = useI18n();
  const bandRange = `${t.bands.low} (0–${moderate - 1}) / ${t.bands.moderate} (${moderate}–${
    high - 1
  }) / ${t.bands.high} (${high}–${severe - 1}) / ${t.bands.severe} (${severe}–100)`;

  return (
    <section className="panel">
      <h2 style={{ marginTop: 0 }}>{t.sourcesTitle}</h2>

      <h3>{t.compositeDefTitle}</h3>
      <p className="muted">{t.compositeDefBody}</p>
      <ul className="sources">
        {KEYS.map((k) => (
          <li key={k}>
            {t.components[k]}: {t.weight} <strong>{RISK_WEIGHTS[k]}</strong>
          </li>
        ))}
      </ul>
      <p className="muted">
        {t.bandRangesLabel} {bandRange}
      </p>

      <h3>{t.indicesTitle}</h3>
      <ul className="sources">
        <li>
          Fragile States Index — Fund for Peace:{' '}
          <a href="https://fragilestatesindex.org/" target="_blank" rel="noreferrer">
            fragilestatesindex.org
          </a>
        </li>
        <li>Global Peace Index — Institute for Economics &amp; Peace</li>
        <li>
          Geopolitical Risk (GPR) Index — Caldara &amp; Iacoviello (Federal Reserve):{' '}
          <a href="https://www.matteoiacoviello.com/gpr.htm" target="_blank" rel="noreferrer">
            matteoiacoviello.com/gpr.htm
          </a>
        </li>
        <li>Worldwide Governance Indicators (Political Stability) — World Bank</li>
      </ul>

      <div className="disclaimer">
        <strong>{t.disclaimerLabel}</strong> {t.disclaimerBody}
      </div>
    </section>
  );
}
