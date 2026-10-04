import { BAND_COLORS, BAND_THRESHOLDS } from '../domain/constants';
import type { RiskBand } from '../domain/types';
import { useI18n } from '../i18n/I18nContext';

const ITEMS: { band: RiskBand; range: string }[] = [
  { band: 'low', range: `0–${BAND_THRESHOLDS.moderate - 1}` },
  { band: 'moderate', range: `${BAND_THRESHOLDS.moderate}–${BAND_THRESHOLDS.high - 1}` },
  { band: 'high', range: `${BAND_THRESHOLDS.high}–${BAND_THRESHOLDS.severe - 1}` },
  { band: 'severe', range: `${BAND_THRESHOLDS.severe}–100` },
];

export function Legend() {
  const { t } = useI18n();
  return (
    <div className="legend" aria-label={t.riskLegend}>
      <span>{t.compositeDefTitle}:</span>
      {ITEMS.map((it) => (
        <span key={it.band}>
          <span className="swatch" style={{ background: BAND_COLORS[it.band] }} />
          {t.bands[it.band]} ({it.range})
        </span>
      ))}
    </div>
  );
}
