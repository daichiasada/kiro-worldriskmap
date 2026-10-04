import { useMemo, useState } from 'react';
import { geoCentroid } from 'd3-geo';
import { ComposableMap, Geographies, Geography, Line } from 'react-simple-maps';
import type { ScoredCountry } from '../domain/types';
import { BAND_LABELS, RELATION_COLORS, RELATION_LABELS } from '../domain/constants';
import { getRelation } from '../data/relations';
import { bilateralRisk } from '../domain/risk';
import { riskColor } from './colorScale';

// world-atlas 110m TopoJSON (ISO numeric id を持つ)
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export type MapMode = 'risk' | 'relations';

interface Props {
  scored: ScoredCountry[];
  isoNumericToId: Record<string, string>;
  onSelect: (id: string) => void;
  mode: MapMode;
  /** 関係モードの起点国 ISO3 */
  sourceId?: string;
  /** 関係線を描画する相手国 ISO3 のリスト(代表国) */
  lineTargetIds?: string[];
}

interface Tooltip {
  x: number;
  y: number;
  lines: string[];
}

type Coord = [number, number];

export function WorldMap({
  scored,
  isoNumericToId,
  onSelect,
  mode,
  sourceId,
  lineTargetIds = [],
}: Props) {
  const [tip, setTip] = useState<Tooltip | null>(null);
  const byId = useMemo(() => new Map(scored.map((c) => [c.id, c])), [scored]);
  const source = sourceId ? byId.get(sourceId) : undefined;

  const resolveId = (geoId: string): string | undefined => {
    // world-atlas の id は先頭ゼロなしの数値文字列の場合があるため 3 桁に正規化して照合する
    const padded = geoId.padStart(3, '0');
    return isoNumericToId[geoId] ?? isoNumericToId[padded];
  };

  const fillFor = (id: string | undefined): string => {
    if (!id) return '#38424f';
    const country = byId.get(id);
    if (!country) return '#38424f';
    if (mode === 'relations') {
      if (!sourceId) return '#38424f';
      if (id === sourceId) return '#4da8ff';
      return RELATION_COLORS[getRelation(sourceId, id)];
    }
    return riskColor(country.score);
  };

  const tooltipLines = (id: string): string[] => {
    const country = byId.get(id)!;
    if (mode === 'relations' && source && id !== sourceId) {
      const rel = getRelation(sourceId!, id);
      const bi = bilateralRisk(source, country, rel);
      return [
        country.nameJa,
        `${source.nameJa} との関係: ${RELATION_LABELS[rel]}`,
        `二国間リスク: ${bi.toFixed(1)} / 100`,
      ];
    }
    if (mode === 'relations' && id === sourceId) {
      return [country.nameJa, '起点国'];
    }
    return [
      country.nameJa,
      `合成スコア: ${country.score.toFixed(1)} / 100`,
      `リスク: ${BAND_LABELS[country.band]}`,
    ];
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
          {({ geographies }) => {
            // 関係線用に各国の重心を算出(関係モードのみ)
            const centroidById = new Map<string, Coord>();
            if (mode === 'relations') {
              for (const geo of geographies) {
                const id = resolveId(String(geo.id));
                if (id) centroidById.set(id, geoCentroid(geo) as Coord);
              }
            }
            const sourceCentroid = sourceId ? centroidById.get(sourceId) : undefined;

            return (
              <>
                {geographies.map((geo) => {
                  const id = resolveId(String(geo.id));
                  const interactive = Boolean(id && byId.get(id));
                  const isSource = mode === 'relations' && id === sourceId;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fillFor(id)}
                      stroke={isSource ? '#ffffff' : '#0f1419'}
                      strokeWidth={isSource ? 1.2 : 0.3}
                      style={{
                        default: { outline: 'none' },
                        hover: {
                          outline: 'none',
                          opacity: interactive ? 0.8 : 1,
                          cursor: interactive ? 'pointer' : 'default',
                        },
                        pressed: { outline: 'none' },
                      }}
                      onMouseEnter={(evt) => {
                        if (!interactive || !id) return;
                        setTip({ x: evt.clientX, y: evt.clientY, lines: tooltipLines(id) });
                      }}
                      onMouseMove={(evt) => {
                        setTip((t) => (t ? { ...t, x: evt.clientX, y: evt.clientY } : t));
                      }}
                      onMouseLeave={() => setTip(null)}
                      onClick={() => {
                        if (interactive && id) onSelect(id);
                      }}
                    />
                  );
                })}

                {/* 関係線: 起点国 → 代表国(関係区分の色) */}
                {mode === 'relations' &&
                  sourceCentroid &&
                  lineTargetIds.map((tid) => {
                    if (tid === sourceId) return null;
                    const to = centroidById.get(tid);
                    if (!to) return null;
                    const rel = getRelation(sourceId!, tid);
                    return (
                      <Line
                        key={`line-${tid}`}
                        from={sourceCentroid}
                        to={to}
                        stroke={RELATION_COLORS[rel]}
                        strokeWidth={1.4}
                        strokeLinecap="round"
                        opacity={0.75}
                      />
                    );
                  })}
              </>
            );
          }}
        </Geographies>
      </ComposableMap>
      {tip && (
        <div
          className="map-tooltip"
          style={{
            left: Math.min(tip.x + 14, window.innerWidth - 250),
            top: Math.min(tip.y + 14, window.innerHeight - 110),
          }}
          role="tooltip"
        >
          {tip.lines.map((line, i) => (
            <span key={i}>
              {i === 0 ? <strong>{line}</strong> : line}
              {i < tip.lines.length - 1 && <br />}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
