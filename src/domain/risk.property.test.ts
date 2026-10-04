import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { compositeRisk, classifyBand, bilateralRisk, clamp } from './risk';
import { RISK_WEIGHTS } from './constants';
import type { Country, RiskComponentKey, RiskComponents } from './types';

// 0..100 の浮動小数 arbitrary
const score = fc.double({ min: 0, max: 100, noNaN: true });

const components = (): fc.Arbitrary<RiskComponents> =>
  fc.record({
    conflict: score,
    governance: score,
    economic: score,
    external: score,
    social: score,
  });

const country = (c: RiskComponents, name = 'X'): Country => ({
  id: name,
  name,
  nameJa: name,
  region: 'R',
  components: c,
});

describe('性質: 合成スコア', () => {
  it('常に 0..100 に収まる', () => {
    fc.assert(
      fc.property(components(), (c) => {
        const r = compositeRisk(c);
        return r >= 0 && r <= 100;
      }),
    );
  });

  it('全コンポーネントが等しければスコアもその値 (重み合計=1 の帰結)', () => {
    fc.assert(
      fc.property(score, (v) => {
        const c: RiskComponents = {
          conflict: v,
          governance: v,
          economic: v,
          external: v,
          social: v,
        };
        return Math.abs(compositeRisk(c) - clamp(v)) < 1e-9;
      }),
    );
  });

  it('単調性: 1コンポーネントを増やすとスコアは減少しない', () => {
    const keys = Object.keys(RISK_WEIGHTS) as RiskComponentKey[];
    fc.assert(
      fc.property(
        components(),
        fc.constantFrom(...keys),
        fc.double({ min: 0, max: 100, noNaN: true }),
        (c, key, delta) => {
          const before = compositeRisk(c);
          const increased: RiskComponents = { ...c, [key]: clamp(c[key] + delta) };
          const after = compositeRisk(increased);
          return after >= before - 1e-9;
        },
      ),
    );
  });
});

describe('性質: バンド分類', () => {
  it('スコアに対して単調非減少 (順位が逆転しない)', () => {
    const order = { low: 0, moderate: 1, high: 2, severe: 3 } as const;
    fc.assert(
      fc.property(score, score, (a, b) => {
        const lo = Math.min(a, b);
        const hi = Math.max(a, b);
        return order[classifyBand(lo)] <= order[classifyBand(hi)];
      }),
    );
  });
});

describe('性質: 2国間リスク', () => {
  it('順序対称 bilateral(a,b) == bilateral(b,a)', () => {
    fc.assert(
      fc.property(components(), components(), (ca, cb) => {
        const a = country(ca, 'A');
        const b = country(cb, 'B');
        return Math.abs(bilateralRisk(a, b) - bilateralRisk(b, a)) < 1e-9;
      }),
    );
  });

  it('常に 0..100', () => {
    fc.assert(
      fc.property(components(), components(), (ca, cb) => {
        const r = bilateralRisk(country(ca, 'A'), country(cb, 'B'), 'rival');
        return r >= 0 && r <= 100;
      }),
    );
  });
});
