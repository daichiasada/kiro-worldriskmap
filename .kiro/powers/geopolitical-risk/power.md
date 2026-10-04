---
name: geopolitical-risk
description: 地政学リスクの定量化指標に関する知識と、合成リスクスコア算出のワークフローをパッケージ化した Power
keywords:
  - 地政学
  - geopolitical
  - risk
  - FSI
  - GPI
  - GPR
  - fragile states
  - composite risk score
---

# Geopolitical Risk Power

この Power は、地政学リスクの定量化に関するドメイン知識と、合成リスクスコアを
算出・検証するための標準ワークフローを提供する。

## 提供する知識

### 主要な定量化指標
- **Fragile States Index (FSI)** — Fund for Peace。12指標で国家脆弱性を評価。
- **Global Peace Index (GPI)** — IEP。平和度を3領域で評価。
- **Geopolitical Risk Index (GPR)** — Caldara & Iacoviello (FRB)。新聞ベース。
- **Worldwide Governance Indicators (WGI)** — World Bank。政治的安定性。

### 合成スコアのレシピ
`R = 0.30*conflict + 0.25*governance + 0.20*economic + 0.15*external + 0.10*social`
(各コンポーネントは 0..100 に正規化、R も 0..100)

### リスクバンド
低 0–24 / 中 25–49 / 高 50–74 / 深刻 75–100

## 標準ワークフロー
1. 対象国の5コンポーネントを公開統計から正規化する。
2. `compositeRisk` で合成スコアを算出する。
3. バンド分類を付与する。
4. 2国間比較では両国の external/conflict を対称に合成し関係係数で調整する。
5. すべての数値に出典・年次・免責を添える。

## 検証すべき不変条件
- スコアは常に 0..100
- 重み合計 = 1.0
- 全コンポーネント均一ならスコアも同値
- 単一コンポーネント増加でスコアは非減少
- 2国間スコアは順序対称
