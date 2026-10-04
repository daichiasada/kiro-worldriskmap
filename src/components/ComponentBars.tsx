import type { RiskComponentKey, RiskComponents } from '../domain/types';
import { RISK_WEIGHTS } from '../domain/constants';
import { useI18n } from '../i18n/I18nContext';
import { riskColor } from './colorScale';

const KEYS = Object.keys(RISK_WEIGHTS) as RiskComponentKey[];

export function ComponentBars({ components }: { components: RiskComponents }) {
  const { t } = useI18n();
  return (
    <div>
      {KEYS.map((key) => {
        const value = components[key];
        return (
          <div className="bar-row" key={key}>
            <span>
              {t.components[key]}{' '}
              <span className="muted">
                ({t.weight} {RISK_WEIGHTS[key]})
              </span>
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
