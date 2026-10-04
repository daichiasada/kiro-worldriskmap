# Skill: 合成リスクスコアの算出

このスキルは、正規化済みコンポーネントから合成リスクスコアとバンド、
2国間リスクを算出する手順を提供する。

## 入力
`{ conflict, governance, economic, external, social }`(各 0..100)

## 手順
1. 各コンポーネントを `clamp(0,100)` する。
2. 重み付き平均で合成スコアを算出する:
   `R = 0.30*conflict + 0.25*governance + 0.20*economic + 0.15*external + 0.10*social`
3. バンド分類: `R>=75 severe / >=50 high / >=25 moderate / else low`。
4. 2国間リスク(対称):
   `bilateral(a,b,rel) = clamp( mean(a.external,b.external,a.conflict,b.conflict) * factor(rel) )`
   `factor: ally=0.6 / neutral=1.0 / rival=1.4`

## 参照実装
本リポジトリの `src/domain/risk.ts`(`compositeRisk` / `classifyBand` / `bilateralRisk`)。
不変条件(0..100、重み合計=1、単調性、対称性)は
`src/domain/risk.property.test.ts` で検証済み。

## 出力
`{ score: number, band: 'low'|'moderate'|'high'|'severe' }` と、必要なら
2国間スコア。すべてに出典・免責を添える。
