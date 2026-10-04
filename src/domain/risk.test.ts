import { describe, it, expect } from 'vitest';
import {
  clamp,
  compositeRisk,
  classifyBand,
  rankCountries,
  bilateralRisk,
} from './risk';
import type { Country, RiskComponents } from './types';

const uniform = (v: number): RiskComponents => ({
  conflict: v,
  governance: v,
  economic: v,
  external: v,
  social: v,
});

const country = (id: string, name: string, components: RiskComponents): Country => ({
  id,
  name,
  nameJa: name,
  region: 'Test',
  components,
});

describe('clamp', () => {
  it('範囲内はそのまま返す', () => {
    expect(clamp(50)).toBe(50);
  });
  it('下限・上限を超えるとクランプする', () => {
    expect(clamp(-10)).toBe(0);
    expect(clamp(150)).toBe(100);
  });
  it('NaN は下限にする', () => {
    expect(clamp(Number.NaN)).toBe(0);
  });
});

describe('compositeRisk', () => {
  it('全コンポーネントが等しければその値になる', () => {
    expect(compositeRisk(uniform(40))).toBeCloseTo(40, 6);
  });
  it('既知の重み付き平均を算出する', () => {
    // 0.3*80 + 0.25*60 + 0.2*40 + 0.15*20 + 0.1*0 = 24+15+8+3+0 = 50
    const c: RiskComponents = {
      conflict: 80,
      governance: 60,
      economic: 40,
      external: 20,
      social: 0,
    };
    expect(compositeRisk(c)).toBeCloseTo(50, 6);
  });
  it('範囲外入力をクランプして算出する', () => {
    expect(compositeRisk(uniform(999))).toBe(100);
    expect(compositeRisk(uniform(-5))).toBe(0);
  });
});

describe('classifyBand', () => {
  it('境界値を正しく分類する', () => {
    expect(classifyBand(0)).toBe('low');
    expect(classifyBand(24.99)).toBe('low');
    expect(classifyBand(25)).toBe('moderate');
    expect(classifyBand(50)).toBe('high');
    expect(classifyBand(75)).toBe('severe');
    expect(classifyBand(100)).toBe('severe');
  });
});

describe('rankCountries', () => {
  it('スコア降順で並ぶ', () => {
    const ranked = rankCountries([
      country('AAA', 'Low', uniform(10)),
      country('BBB', 'High', uniform(90)),
      country('CCC', 'Mid', uniform(50)),
    ]);
    expect(ranked.map((c) => c.id)).toEqual(['BBB', 'CCC', 'AAA']);
  });
});

describe('bilateralRisk', () => {
  const a = country('AAA', 'A', { ...uniform(0), external: 40, conflict: 60 });
  const b = country('BBB', 'B', { ...uniform(0), external: 20, conflict: 80 });

  it('順序に依存しない(対称)', () => {
    expect(bilateralRisk(a, b)).toBeCloseTo(bilateralRisk(b, a), 6);
  });
  it('関係係数を反映する', () => {
    expect(bilateralRisk(a, b, 'rival')).toBeGreaterThan(bilateralRisk(a, b, 'ally'));
  });
});
