// React 非依存のドメイン型定義

export type RiskComponentKey =
  | 'conflict'
  | 'governance'
  | 'economic'
  | 'external'
  | 'social';

/** 各コンポーネントは 0(低リスク)〜100(高リスク)に正規化された値 */
export type RiskComponents = Record<RiskComponentKey, number>;

export type RiskBand = 'low' | 'moderate' | 'high' | 'severe';

export type RelationType = 'ally' | 'neutral' | 'rival';

export interface Country {
  /** ISO 3166-1 alpha-3 コード */
  id: string;
  name: string;
  nameJa: string;
  region: string;
  components: RiskComponents;
}

export interface ScoredCountry extends Country {
  score: number;
  band: RiskBand;
}
