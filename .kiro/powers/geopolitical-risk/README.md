# Geopolitical Risk Power

地政学リスクの定量化に関する知識・正規化手順・算出スキルをまとめた、配布可能な Kiro Power。

## 構成
```
geopolitical-risk/
├── manifest.json                     # パッケージ定義 (version/keywords/entry/steering/skills/mcpServers)
├── power.md                          # エントリ(知識とワークフロー)
├── steering/
│   └── index-normalization.md        # 指標を 0..100 へ正規化する手順
└── skills/
    └── compute-composite-score.md    # 合成スコア/バンド/2国間リスクの算出手順
```

## 起動
`manifest.json` の `keywords`(地政学 / geopolitical / FSI / GPR / composite risk score 等)を
会話で言及すると、Kiro がこの Power のコンテキストを読み込む。

## 連携する MCP サーバ
`manifest.json` の `mcpServers: ["fetch"]`。`fetch` サーバで公開統計の出典 URL を取得・検証する
(ワークフローは `power.md` 参照)。

## 配布
このディレクトリ一式を他リポジトリの `.kiro/powers/` にコピーすれば再利用できる。
`manifest.json` の `version` に従ってバージョン管理する(現在 1.0.0)。

## ライセンス
MIT
