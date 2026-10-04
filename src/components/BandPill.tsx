import type { RiskBand } from '../domain/types';
import { BAND_COLORS, BAND_LABELS } from '../domain/constants';

export function BandPill({ band }: { band: RiskBand }) {
  return (
    <span className="band-pill" style={{ background: BAND_COLORS[band] }}>
      {BAND_LABELS[band]}
    </span>
  );
}
