import type { RiskComponentKey, RiskComponents } from '../domain/types';
import { RISK_COMPONENT_LABELS, RISK_WEIGHTS } from '../domain/constants';
import { riskColor } from './colorScale';

const KEYS = Object.keys(RISK_WEIGHTS) as RiskComponentKey[];

export function ComponentBars({ components }: { components: RiskComponents }) {
  return (
    <div>
      {KEYS.map((key) => {
        const value = components[key];
        return (
          <div className="bar-row" key={key}>
            <span>
              {RISK_COMPONENT_LABELS[key]}{' '}
              <span className="muted">(重み {RISK_WEIGHTS[key]})</span>
            </span>
            <span className="bar-track">
              <span
                className="bar-fill"
                style={{ width: `${value}%`, background: riskColor(value) }}
              />
            </span>
            <span className="score-cell" style={{ textAlign: 'right' }}>
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
