import { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import type { ScoredCountry } from '../domain/types';
import { BAND_LABELS } from '../domain/constants';
import { riskColor } from './colorScale';

// world-atlas 110m TopoJSON (ISO numeric id を持つ)
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface Props {
  scored: ScoredCountry[];
  isoNumericToId: Record<string, string>;
  onSelect: (id: string) => void;
}

interface Tooltip {
  x: number;
  y: number;
  name: string;
  score: number;
  band: string;
}

export function WorldMap({ scored, isoNumericToId, onSelect }: Props) {
  const [tip, setTip] = useState<Tooltip | null>(null);
  const byId = new Map(scored.map((c) => [c.id, c]));

  const resolve = (geoId: string): ScoredCountry | undefined => {
    // world-atlas の id は先頭ゼロなしの数値文字列の場合があるため 3 桁に正規化して照合する
    const padded = geoId.padStart(3, '0');
    const id = isoNumericToId[geoId] ?? isoNumericToId[padded];
    return id ? byId.get(id) : undefined;
  };

  return (
    <div className="map-wrap">
      <ComposableMap
        projectionConfig={{ scale: 150 }}
        width={980}
        height={480}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const country = resolve(String(geo.id));
              const fill = country ? riskColor(country.score) : '#38424f';
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke="#0f1419"
                  strokeWidth={0.3}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none', opacity: country ? 0.8 : 1, cursor: country ? 'pointer' : 'default' },
                    pressed: { outline: 'none' },
                  }}
                  onMouseEnter={(evt) => {
                    if (!country) return;
                    setTip({
                      x: evt.clientX,
                      y: evt.clientY,
                      name: country.nameJa,
                      score: country.score,
                      band: BAND_LABELS[country.band],
                    });
                  }}
                  onMouseMove={(evt) => {
                    setTip((t) => (t ? { ...t, x: evt.clientX, y: evt.clientY } : t));
                  }}
                  onMouseLeave={() => setTip(null)}
                  onClick={() => {
                    if (country) onSelect(country.id);
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      {tip && (
        <div
          className="map-tooltip"
          style={{
            left: Math.min(tip.x + 14, window.innerWidth - 250),
            top: Math.min(tip.y + 14, window.innerHeight - 90),
          }}
          role="tooltip"
        >
          <strong>{tip.name}</strong>
          合成スコア: {tip.score.toFixed(1)} / 100
          <br />
          リスク: {tip.band}
        </div>
      )}
    </div>
  );
}
