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
1. **出典の取得・検証(MCP)**: `fetch` MCP サーバで各指標の公開ページ
   (例: fragilestatesindex.org / matteoiacoviello.com/gpr.htm)を取得し、
   採用する年次・数値の裏付けを確認する。
2. **正規化**: 付属 steering `steering/index-normalization.md` の手順で、
   各指標を 0..100(高いほど高リスク)へ揃える。
3. **合成スコア算出**: 付属 skill `skills/compute-composite-score.md` に従い
   `compositeRisk` で合成スコアを算出する。
4. **バンド分類**を付与する。
5. **2国間比較**: 両国の external/conflict を対称に合成し関係係数で調整する。
6. すべての数値に**出典・年次・免責**を添える。

## パッケージ構成
本 Power は配布可能なパッケージ。詳細は同梱の `README.md` と `manifest.json` を参照。
- `steering/index-normalization.md` — 指標の正規化手順
- `skills/compute-composite-score.md` — 合成スコア算出スキル
- 連携 MCP: `fetch`(出典取得・検証)

## 検証すべき不変条件
- スコアは常に 0..100
- 重み合計 = 1.0
- 全コンポーネント均一ならスコアも同値
- 単一コンポーネント増加でスコアは非減少
- 2国間スコアは順序対称
