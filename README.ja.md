# 🌐 World Geopolitical Risk Map / 地政学リスク可視化サイト

[English](README.md) | **日本語**

公開されている定量化指標に基づき、各国および国家間の **地政学リスク** を合成スコアとして
可視化するフロントエンド完結型の Web アプリです。
**Kiro University Challenge 2026** の最終試験(バックアッププロジェクト)として、
Kiro の 7 つのコア機能を実演することを目的に構築しました。

🌍 **公開サイト:** https://d1phbaff9oackz.cloudfront.net

## 概要

- 世界地図(コロプレス)で各国のリスクを色分け表示
- リスクランキング(検索・ソート)
- 国別のリスク内訳(5 コンポーネント)
- 2 国間の地政学リスク(対称スコア)比較
- 世界地図上の2国間関係オーバーレイ(起点国から見た 同盟 / 中立 / 対立)
- 使用した指標の出典と免責の明記
- **多言語対応(英語[既定] / 日本語の切替、`localStorage` 保存)**

## アーキテクチャ

![Architecture](docs/architecture.png)

編集可能な図は [`docs/architecture.drawio`](docs/architecture.drawio)(draw.io / diagrams.net で開けます)。
PNG は同梱の `docs/architecture.png`、ベクタは `docs/architecture.svg` です。

- 利用者(ブラウザ)は **CloudFront**(HTTPS 強制・OAC)経由で**非公開 S3** の静的サイトを取得
- フロントは **React + TypeScript (Vite)** の SPA。ビュー層 / 純粋なドメイン層 / データ+i18n 層に分離
- 地図ジオメトリは実行時に **world-atlas TopoJSON (CDN)** から取得
- インフラは **AWS CDK (TypeScript)** でコード化(`infra/`)、CloudFormation スタックとしてデプロイ
- 開発は Kiro の各機能(`.kiro/`: Spec / Steering / Hooks / PBT / MCP / Power / Custom Agent)で駆動

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
- 地図: react-simple-maps + d3-scale / d3-geo(world-atlas TopoJSON)
- テスト: Vitest + Testing Library + **fast-check (Property-Based Testing)** + **Playwright (E2E)**
- Lint/Format: ESLint + Prettier

## 多言語対応 (i18n)

UI は **英語(既定)/ 日本語** を切り替えできます(ヘッダ右上のスイッチャー)。選択言語は
`localStorage` に保存され、`<html lang>` に反映されます。実装は `src/i18n/`
(`messages.ts` の辞書 + `I18nContext` の Provider/`useI18n`)。国名は英/日で出し分けます。

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

## デプロイ (AWS — S3 + CloudFront, CDK)

本番は **AWS CDK (TypeScript)** で S3 + CloudFront 構成にデプロイします(詳細は `infra/README.md`)。

```bash
npm run build            # dist/ を生成 (base は '/')
cd infra && npm install
npx cdk deploy --require-approval never
```

- 非公開 S3 バケット + CloudFront (OAC) + HTTPS 強制 + SPA フォールバック
- 稼働中の公開 URL: https://d1phbaff9oackz.cloudfront.net

> 補助: `GITHUB_PAGES=true npm run build` でビルドすると `base` が `/kiro-worldriskmap/` になり、
> `.github/workflows/deploy.yml` 経由で GitHub Pages へも公開できます(Pages 有効化が必要)。

## Kiro University — 7 レッスンの対応

| レッスン | 機能 | 本リポジトリでの実装箇所 |
|---|---|---|
| 1 | Spec 駆動開発 | `.kiro/specs/geopolitical-risk-map/`(EARS 記法の requirements/design/tasks) |
| 2 | Steering | `.kiro/steering/`(要件・規約・ドメイン知識・MCP利用方針) |
| 3 | Hooks | `.kiro/hooks/hooks.json`(**command型**: 保存時 lint / domain テスト、**agent型**: 不変条件レビュー / Stop時セルフチェック) |
| 4 | Property-Based Testing | `src/domain/risk.property.test.ts`, `src/domain/relations.property.test.ts`(fast-check) |
| 5 | MCP | `.kiro/settings/mcp.json`(fetch / aws-docs)+ 実利用ワークフロー `.kiro/steering/mcp-usage.md` |
| 6 | Powers | `.kiro/powers/geopolitical-risk/`(**配布可能パッケージ**: manifest + power + steering + skill + README) |
| 7 | Custom Agents | `.kiro/agents/`(`risk-data-reviewer`, `submission-auditor`) |

### 開発プロセス(品質保証)
- ドメインロジックの単体テスト + Property-Based Test(**29 件**)
- Playwright による E2E・スクリーンショットでの UI 検証(**11 件**)
- 複数回のレビュー → GitHub Issue 起票(#1〜#15)→ 自律的に修正・クローズ

## ディレクトリ構成

```
.kiro/            # Kiro University 7 レッスンの成果物
docs/             # アーキテクチャ図 (drawio / svg / png)
infra/            # AWS CDK (TypeScript) IaC
src/
├── domain/       # React 非依存の純粋ロジック(リスク計算・関係)+ テスト
├── data/         # 国別データ(出典明記)/ ISO 対応表 / 関係データ
├── components/   # 地図・凡例・バー・バッジ
├── views/        # 地図 / ランキング / 関係性 / 国別詳細 / 2国間比較 / 出典
├── i18n/         # メッセージ辞書(en/ja)+ 言語コンテキスト
└── App.tsx
e2e/              # Playwright E2E
```
