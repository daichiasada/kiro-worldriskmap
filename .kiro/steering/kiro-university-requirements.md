---
inclusion: always
---

# Kiro University Challenge — 要件まとめ (Steering)

出典: https://kiro.dev/2026/university/ および公式Terms / 公開レッスン情報。
このファイルは本リポジトリが Kiro University Challenge の提出要件を満たすための
チェックリストと設計方針を定義する。全セッションで常に参照する。

## 1. チャレンジ概要

- 期間: 2026/09/21 09:00 PT 〜 2026/10/05 23:59 PT
- 9/21〜9/25 に毎日レッスンが公開され、最終試験(=1つのプロジェクト)を提出する
- 最大獲得クレジット: 5,250

## 2. 提出要件 (MUST)

提出が有効と見なされるために以下は必須:

- [ ] **公開(public)GitHub リポジトリ**であること
- [ ] **最初のコミットが 2026/09/21 09:00 PT 以降**であること(それ以前の履歴があると無効)
- [ ] リポジトリに **`.kiro/` フォルダを含む**こと
- [ ] 30秒〜3分の**デモ動画**
- [ ] `#KiroUniversity` `#BuildWithKiro` を付けた **X もしくは LinkedIn の公開投稿**
- [ ] エントリーフォームからの提出 (9/25開始、10/05 23:59 PT 締切)
- [ ] 9/21以降に新規に作られたプロジェクトであること(=実機能を持つ新規ビルド)

### 参加資格 (本人確認事項)
- 18歳以上 / Kiro アカウント保有 / X もしくは LinkedIn アカウント保有
- 参加に使う GitHub アカウントが3ヶ月以上前に作成されていること
- 除外地域の居住者でないこと(日本は除外地域に含まれない)

## 3. スコアリング (7つの必須レッスン + 2つのボーナス)

最終試験は「7つの必須レッスンをいくつ実演できたか」で採点される。

| レッスン | 内容 | クレジット |
|---|---|---|
| Lesson 1 | Spec駆動開発 (EARS記法で要件定義) | 250 (1-3で最大750) |
| Lesson 2 | Steering ドキュメント (プロジェクト規約) | 250 |
| Lesson 3 | Hooks (イベント駆動の自動化) | 250 |
| Lesson 4 | Property-Based Testing (PBT) | 500 (4-5で最大1000) |
| Lesson 5 | MCP (Model Context Protocol サーバ連携) | 500 |
| Lesson 6 | Powers (ツール/知識のパッケージ化) | 1000 (6-7で最大2000) |
| Lesson 7 | Custom Agents (役割特化エージェント) | 1000 |
| 全7レッスン達成ボーナス | | 1000 |
| Bonus Lesson 1 (有料プランのみ) | | 250 |
| Bonus Lesson 2 | | 250 |
| **最大合計** | | **5,250** |

> 注: Lesson 5/6/7 の正確な定義は公式レッスン公開に依存する。本リポジトリでは
> Kiro の公式ドキュメント(MCP / Powers / Custom Agents)の中核機能として解釈し、
> それぞれを `.kiro/` 配下で実装・実演する。

## 4. 本リポジトリでの各レッスン実装方針

- **Lesson 1 (Spec)**: `.kiro/specs/geopolitical-risk-map/` に requirements(EARS) / design / tasks
- **Lesson 2 (Steering)**: `.kiro/steering/` に本ファイル + プロジェクト規約 + ドメイン知識
- **Lesson 3 (Hooks)**: `.kiro/hooks/` に保存時 lint/test の PostFileSave フック
- **Lesson 4 (PBT)**: `src/**/*.property.test.ts` に fast-check を用いた性質テスト
- **Lesson 5 (MCP)**: `.kiro/settings/mcp.json` に地政学データ取得用の MCP サーバ設定
- **Lesson 6 (Power)**: `.kiro/powers/` に地政学リスク指標の知識/ワークフローをパッケージ化
- **Lesson 7 (Custom Agent)**: `.kiro/agents/` にレビュー専用エージェント等を定義

## 5. 提出前チェック (DoD)

- [ ] `.kiro/` に specs / steering / hooks / agents / powers / settings が揃っている
- [ ] アプリが実機能を持ち、ビルド・起動・テストが通る
- [ ] README に概要・技術スタック・各レッスンの対応箇所を明記
- [ ] デモ動画・SNS投稿・エントリーフォームの3点は人間(提出者)が実施する
