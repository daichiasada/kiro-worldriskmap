# 実装タスク (Tasks) — 地政学リスク可視化サイト

- [x] 1. プロジェクト初期化 (Vite + React + TS + ESLint/Prettier)
- [x] 2. ドメイン型・定数・リスク計算ロジック (`src/domain/`)
- [x] 3. ドメインの単体テスト + Property-Based Test
- [x] 4. 国別データ整備 (`src/data/countries.ts`、出典明記)
- [x] 5. 共通UI (凡例・バー・ツールチップ・ナビ)
- [x] 6. 世界地図ビュー (コロプレス + インタラクション)
- [x] 7. ランキングビュー (検索・ソート)
- [x] 8. 国別詳細ビュー
- [x] 9. 2国間比較ビュー
- [x] 10. 出典・免責の明記、README 整備
- [x] 11. Playwright E2E とスクリーンショットによる UI 改善
- [x] 12. 3回のレビュー → Issue 起票 (#1〜#6) → 自律解決
- [x] 13. ビルド確認・デプロイ設定 (GitHub Pages)

## 追加機能 (Issue #7): 代表国から見た関係性ビュー
- [x] 14. 関係データ (`src/data/relations.ts`: 代表国リスト + 関係ペア)
- [x] 15. 関係ドメインロジック (`src/domain/relations.ts`: buildRelations)
- [x] 16. 単体 + Property-Based Test (relations.test.ts / relations.property.test.ts)
- [x] 17. 関係性ビュー (`src/views/RelationsView.tsx`) と新タブ
- [x] 18. Playwright E2E 追加

## 追加機能 (Issue #9): 世界地図の2国間関係オーバーレイ
- [x] 19. WorldMap に mode('risk'|'relations') と sourceId / lineTargetIds を追加
- [x] 20. geoCentroid で重心を算出し関係線 (Line) を描画
- [x] 21. 色分け・ツールチップ・凡例を mode で分岐
- [x] 22. MapView に表示モード切替と起点国セレクタを追加
- [x] 23. Playwright E2E を追加
