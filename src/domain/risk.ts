import type {
  Country,
  RiskBand,
  RiskComponentKey,
  RiskComponents,
  RelationType,
  ScoredCountry,
} from './types';
import {
  BAND_THRESHOLDS,
  RELATION_FACTORS,
  RISK_WEIGHTS,
  SCORE_MAX,
  SCORE_MIN,
} from './constants';

/** 値を [min, max] の範囲にクランプする */
export function clamp(value: number, min = SCORE_MIN, max = SCORE_MAX): number {
  if (Number.isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * 合成リスクスコアを算出する。
 * 各コンポーネントを 0..100 にクランプし、重み付き平均を取る。
 * 戻り値は常に 0..100。
 */
export function compositeRisk(components: RiskComponents): number {
  let total = 0;
  (Object.keys(RISK_WEIGHTS) as RiskComponentKey[]).forEach((key) => {
    total += RISK_WEIGHTS[key] * clamp(components[key]);
  });
  return clamp(total);
}

/** スコアからリスクバンドを分類する(スコアに対して単調非減少) */
export function classifyBand(score: number): RiskBand {
  const s = clamp(score);
  if (s >= BAND_THRESHOLDS.severe) return 'severe';
  if (s >= BAND_THRESHOLDS.high) return 'high';
  if (s >= BAND_THRESHOLDS.moderate) return 'moderate';
  return 'low';
}

/** 国にスコアとバンドを付与する */
export function scoreCountry(country: Country): ScoredCountry {
  const score = compositeRisk(country.components);
  return { ...country, score, band: classifyBand(score) };
}

/** スコア降順(同点は国名昇順)でソートされた配列を返す */
export function rankCountries(countries: Country[]): ScoredCountry[] {
  return countries
    .map(scoreCountry)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

/**
 * 2国間の地政学リスクスコア(対称)。
 * 両国の external と conflict の平均を関係係数で調整し 0..100 にクランプする。
 * a, b の順序に依存しない。
 */
export function bilateralRisk(a: Country, b: Country, relation: RelationType = 'neutral'): number {
  const base =
    (clamp(a.components.external) +
      clamp(b.components.external) +
      clamp(a.components.conflict) +
      clamp(b.components.conflict)) /
    4;
  return clamp(base * RELATION_FACTORS[relation]);
}
