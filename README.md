# 🌐 World Geopolitical Risk Map / 地政学リスク可視化サイト

公開されている定量化指標に基づき、各国および国家間の **地政学リスク** を合成スコアとして
可視化するフロントエンド完結型の Web アプリです。
**Kiro University Challenge 2026** の最終試験(バックアッププロジェクト)として、
Kiro の 7 つのコア機能を実演することを目的に構築しました。

## 概要

- 世界地図(コロプレス)で各国のリスクを色分け表示
- リスクランキング(検索・ソート)
- 国別のリスク内訳(5 コンポーネント)
- 2 国間の地政学リスク(対称スコア)比較
- 使用した指標の出典と免責の明記

## リスクの定量化

合成リスクスコア `R`(0〜100、高いほど高リスク)は、0〜100 に正規化した
5 つのコンポーネントの重み付き平均です(重み合計 = 1.0):

| コンポーネント | 重み | 参考指標 |
|---|---|---|
| 紛争・暴力 (conflict) | 0.30 | Global Peace Index / Fragile States Index(安全) |
| ガバナンス/政治安定性 (governance) | 0.25 | WGI Political Stability / FSI(政治) |
| 経済的脆弱性 (economic) | 0.20 | FSI(経済) |
| 対外関係/地政学的緊張 (external) | 0.15 | Geopolitical Risk Index (Caldara & Iacoviello) |
| 社会的結束 (social) | 0.10 | FSI(社会) |

リスク区分: 低 0–24 / 中 25–49 / 高 50–74 / 深刻 75–100

### 出典
- Fragile States Index — Fund for Peace: https://fragilestatesindex.org/
- Global Peace Index — Institute for Economics & Peace
- Geopolitical Risk (GPR) Index — Caldara & Iacoviello (Federal Reserve): https://www.matteoiacoviello.com/gpr.htm
- Worldwide Governance Indicators — World Bank

> **免責:** 本サイトのスコアは教育・可視化を目的とした合成サンプル値であり、各指標の公式値を
> 厳密に再現したものではありません。相対的な序列は公開ランキングを参考にしています。

## 技術スタック

- TypeScript (strict) / React 18 / Vite
- 地図: react-simple-maps + d3-scale(world-atlas TopoJSON)
- テスト: Vitest + Testing Library + **fast-check (Property-Based Testing)** + **Playwright (E2E)**
- Lint/Format: ESLint + Prettier

## 開発

```bash
npm install
npm run dev        # 開発サーバ
npm run test       # 単体 + Property-Based Test (watch)
npm run test:run   # 一度だけ実行
npm run lint       # ESLint + tsc --noEmit
npm run build      # 本番ビルド
npm run e2e        # Playwright E2E (要: npx playwright install chromium)
```

## デプロイ (GitHub Pages)

`main` への push で GitHub Actions が `GITHUB_PAGES=true` でビルドし、Pages へ公開します。
`vite.config.ts` の `base` はリポジトリ名 `/kiro-worldriskmap/` に設定されます。

## Kiro University — 7 レッスンの対応

| レッスン | 機能 | 本リポジトリでの実装箇所 |
|---|---|---|
| 1 | Spec 駆動開発 | `.kiro/specs/geopolitical-risk-map/`(EARS 記法の requirements/design/tasks) |
| 2 | Steering | `.kiro/steering/`(要件・規約・ドメイン知識) |
| 3 | Hooks | `.kiro/hooks/hooks.json`(保存時 lint / domain テスト) |
| 4 | Property-Based Testing | `src/domain/risk.property.test.ts`(fast-check) |
| 5 | MCP | `.kiro/settings/mcp.json`(fetch / aws-docs サーバ) |
| 6 | Powers | `.kiro/powers/geopolitical-risk/power.md`(指標知識とワークフロー) |
| 7 | Custom Agents | `.kiro/agents/risk-data-reviewer.md`(データ品質レビュー専用) |

### 開発プロセス(品質保証)
- ドメインロジックの単体テスト + Property-Based Test(16 件)
- Playwright による E2E・スクリーンショットでの UI 検証(7 件)
- 3 回のレビュー → GitHub Issue 起票(#1〜#6)→ 自律的に修正・クローズ

## ディレクトリ構成

```
.kiro/            # Kiro University 7 レッスンの成果物
src/
├── domain/       # React 非依存の純粋ロジック(リスク計算・分類)+ テスト
├── data/         # 国別データ(出典明記)/ ISO 対応表
├── components/   # 地図・凡例・バー・バッジ
├── views/        # 地図 / ランキング / 国別詳細 / 2国間比較 / 出典
└── App.tsx
e2e/              # Playwright E2E
```
