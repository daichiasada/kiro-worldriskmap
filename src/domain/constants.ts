import type { RiskComponentKey, RelationType } from './types';

/** 合成スコアの重み。合計は 1.0。出典・根拠は .kiro/steering/geopolitical-domain.md */
export const RISK_WEIGHTS: Record<RiskComponentKey, number> = {
  conflict: 0.3,
  governance: 0.25,
  economic: 0.2,
  external: 0.15,
  social: 0.1,
};

export const RISK_COMPONENT_LABELS: Record<RiskComponentKey, string> = {
  conflict: '紛争・暴力',
  governance: 'ガバナンス/政治安定性',
  economic: '経済的脆弱性',
  external: '対外関係/地政学的緊張',
  social: '社会的結束',
};

/** リスクバンドの下限しきい値 (以上) */
export const BAND_THRESHOLDS = {
  moderate: 25,
  high: 50,
  severe: 75,
} as const;

export const SCORE_MIN = 0;
export const SCORE_MAX = 100;

/** 2国間の関係性係数 */
export const RELATION_FACTORS: Record<RelationType, number> = {
  ally: 0.6,
  neutral: 1.0,
  rival: 1.4,
};

export const BAND_LABELS: Record<string, string> = {
  low: '低',
  moderate: '中',
  high: '高',
  severe: '深刻',
};

export const BAND_COLORS: Record<string, string> = {
  low: '#2e8b57',
  moderate: '#e3b505',
  high: '#e8590c',
  severe: '#c92a2a',
};
