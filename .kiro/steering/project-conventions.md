---
inclusion: always
---

# プロジェクト規約 (Steering) — World Geopolitical Risk Map

## プロジェクト概要
国家間・各国の地政学リスクを、公開されている定量化指標をもとに可視化する
フロントエンド完結型 Web アプリ。地図・ランキング・国別詳細・2国間比較を提供する。

## 技術スタック
- 言語: TypeScript (strict)
- フレームワーク: React 18 + Vite
- 地図可視化: react-simple-maps + d3-scale (SVG コロプレス地図)
- グラフ: 自前の軽量 SVG コンポーネント(重い依存を避ける)
- テスト: Vitest + @testing-library/react + fast-check (PBT) + Playwright (E2E)
- Lint/Format: ESLint + Prettier
- デプロイ: 静的ホスティング (GitHub Pages 想定、`base` を設定)

## コーディング規約
- すべての関数・公開APIに型注釈を付ける。`any` は禁止、`unknown`+絞り込みを使う。
- 純粋なドメインロジック(リスク計算等)は `src/domain/` に置き、React 非依存にする。
  → これにより PBT・単体テストが容易になる。
- UI コンポーネントは `src/components/`、ページ単位は `src/views/`。
- データは `src/data/` に静的 JSON/TS として保持(公開統計由来、出典を明記)。
- マジックナンバー禁止。しきい値や重みは `src/domain/constants.ts` に集約。
- コミットは Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`, `chore:`, `refactor:`)。

### Good / Bad 例
```ts
// Good: 純粋関数・型明示・副作用なし
export function compositeRisk(input: RiskComponents): number { /* ... */ }

// Bad: any、副作用、暗黙の戻り値型
function calc(d) { window.foo = d; return d.a + d.b }
```

## ドメインの不変条件 (PBT で検証する性質)
- 合成リスクスコアは常に 0〜100 に収まる。
- 重みの合計は 1.0(浮動小数誤差を許容)。
- 入力コンポーネントが全て等しければ、合成スコアもその値に等しい(冪等性/一貫性)。
- 単調性: ある1コンポーネントだけ増加させると、合成スコアは減少しない。
- リスクバンド分類(低/中/高/深刻)はスコアに対して単調非減少。

## レビュー方針
- 最低3回のセルフレビューを行い、指摘は GitHub Issue に起票してから修正する。
- UI は Playwright でスクリーンショットを取り、視覚的に改善する。
