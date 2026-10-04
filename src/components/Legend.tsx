import { BAND_COLORS, BAND_LABELS, BAND_THRESHOLDS } from '../domain/constants';

const ITEMS: { band: keyof typeof BAND_COLORS; range: string }[] = [
  { band: 'low', range: `0–${BAND_THRESHOLDS.moderate - 1}` },
  { band: 'moderate', range: `${BAND_THRESHOLDS.moderate}–${BAND_THRESHOLDS.high - 1}` },
  { band: 'high', range: `${BAND_THRESHOLDS.high}–${BAND_THRESHOLDS.severe - 1}` },
  { band: 'severe', range: `${BAND_THRESHOLDS.severe}–100` },
];

export function Legend() {
  return (
    <div className="legend" aria-label="リスク凡例">
      <span>合成リスクスコア:</span>
      {ITEMS.map((it) => (
        <span key={it.band}>
          <span className="swatch" style={{ background: BAND_COLORS[it.band] }} />
          {BAND_LABELS[it.band]} ({it.range})
        </span>
      ))}
    </div>
  );
}
