import type { RiskBand } from '../domain/types';
import { BAND_COLORS } from '../domain/constants';
import { useI18n } from '../i18n/I18nContext';

export function BandPill({ band }: { band: RiskBand }) {
  const { t } = useI18n();
  return (
    <span className="band-pill" style={{ background: BAND_COLORS[band] }}>
      {t.bands[band]}
    </span>
  );
}
