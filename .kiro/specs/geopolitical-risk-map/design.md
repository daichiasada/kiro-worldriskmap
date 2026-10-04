# 設計 (Design) — 地政学リスク可視化サイト

## アーキテクチャ概要
フロントエンド完結の SPA。ドメインロジック(リスク計算)を React から分離し、
テスト容易性を確保する。

```
src/
├── domain/           # React非依存の純粋ロジック(リスク計算・分類)
│   ├── types.ts
│   ├── constants.ts  # 重み・しきい値
│   ├── risk.ts       # 合成スコア・バンド分類・2国間リスク
│   └── risk.test.ts / risk.property.test.ts
├── data/             # 公開統計由来の国別データ(出典明記)
│   └── countries.ts
├── components/       # 再利用UI(地図・凡例・バー・ツールチップ)
├── views/            # 画面(Map/Ranking/CountryDetail/Compare)
├── App.tsx
└── main.tsx
```

## データモデル
```ts
type RiskComponentKey = 'conflict' | 'governance' | 'economic' | 'external' | 'social';
type RiskComponents = Record<RiskComponentKey, number>; // 各 0..100

interface Country {
  id: string;        // ISO3
  name: string;
  nameJa: string;
  components: RiskComponents;
  region: string;
}

type RiskBand = 'low' | 'moderate' | 'high' | 'severe';
```

## 合成スコア
`R = Σ (weight_k × clamp(component_k, 0, 100))`、重み合計=1。
バンド境界: 25 / 50 / 75。

## 2国間リスク
`bilateral(a,b) = clamp( mean(a.external, b.external, a.conflict, b.conflict) × relationFactor, 0, 100)`。
対称性のため a,b を入れ替えても同値。relationFactor は関係テーブル(同盟0.6/中立1.0/対立1.4)。

## 地図
`react-simple-maps` の world-atlas TopoJSON を使用。`d3-scale` の sequential scale で
スコア→色(緑→黄→赤)にマッピング。

## テスト戦略
- 単体: 境界値・既知入力の期待値。
- PBT (fast-check): 範囲内性・一貫性・単調性・対称性・バンド単調性。
- E2E (Playwright): 地図描画・ツールチップ・詳細遷移・比較のスクリーンショット検証。

## 画面
1. Map(ホーム): 地図 + 凡例 + 概要
2. Ranking: 検索・ソート可能な表
3. CountryDetail: 内訳バー + 出典
4. Compare: 2国選択 + 2国間スコア
