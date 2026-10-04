---
inclusion: always
---

# ドメイン知識 (Steering) — 地政学リスクの定量化指標

地政学リスクの可視化にあたり、本プロジェクトは実在する公開の定量化フレームワークに
基づく合成指標を用いる。各指標は 0〜100 に正規化し(高いほど高リスク)、重み付き平均で
合成リスクスコアを算出する。

## 採用する定量化指標 (出典)

1. **Fragile States Index (FSI)** — Fund for Peace
   - 178カ国を12指標(結束/経済/政治/社会)で評価。高スコア=高い脆弱性。
   - 出典: https://fragilestatesindex.org/
2. **Global Peace Index (GPI)** — Institute for Economics & Peace
   - 平和度を安全・紛争・軍事化の3領域で評価。
3. **Geopolitical Risk Index (GPR)** — Caldara & Iacoviello (米FRB)
   - 新聞記事ベースの地政学リスク。国別・2国間へ分解可能。
   - 出典: https://www.matteoiacoviello.com/gpr.htm
4. **Worldwide Governance Indicators (WGI) — 政治的安定性と暴力の不在** — 世界銀行
   - ガバナンスの観点から政治的安定性を評価。

## 合成リスクスコアの定義

本プロジェクトの合成スコア `R` は、各国について以下の正規化済みコンポーネント
(いずれも 0=低リスク 〜 100=高リスク)の重み付き平均:

- `conflict` (紛争・暴力): 重み 0.30 — GPI/FSI の安全領域ベース
- `governance` (ガバナンス/政治安定性): 重み 0.25 — WGI/FSI 政治領域ベース
- `economic` (経済的脆弱性): 重み 0.20 — FSI 経済領域ベース
- `external` (対外関係/地政学的緊張): 重み 0.15 — GPR ベース
- `social` (社会的結束): 重み 0.10 — FSI 社会領域ベース

重み合計 = 1.00。

## リスクバンド分類
- 0–24: 低 (Low)
- 25–49: 中 (Moderate)
- 50–74: 高 (High)
- 75–100: 深刻 (Severe)

## 2国間リスク (Bilateral)
2国間の地政学的緊張は、両国の `external` と `conflict` を基に、関係性係数
(同盟/中立/対立)で調整した対称スコアとして算出する。

## 重要な注意
- 本サイトのスコアは教育・可視化目的の合成値であり、各指標の原データを厳密に再現した
  公式値ではない。データは代表的な公開値を参考にした近似・サンプル値を含む。
- 各数値には必ず出典・年次・算出方法の注記を UI 上に表示する。
