# infra — AWS CDK (TypeScript)

地政学リスク可視化サイトを **S3 + CloudFront** でホスティングする Infrastructure as Code。

## 構成
- 非公開 S3 バケット(サイト成果物)
- CloudFront ディストリビューション(**OAC** 経由で S3 を参照、HTTPS 強制)
- SPA 用に 403/404 を `index.html` (200) へフォールバック
- `BucketDeployment` で `../dist` をアップロードし、デプロイ毎に CloudFront キャッシュを無効化

## 前提
- 対象アカウントが CDK ブートストラップ済みであること(`cdk bootstrap`)
- AWS 認証情報が環境に設定されていること(リージョン: `us-east-1`)

## デプロイ手順
```bash
# 1. アプリ本体をビルド(リポジトリルートで)
cd ..
npm install
npm run build          # dist/ を生成 (base は '/')

# 2. インフラをデプロイ
cd infra
npm install
npx cdk deploy --require-approval never
```

デプロイ完了後、出力 `SiteURL` が公開 URL です。

## 破棄
```bash
npx cdk destroy --force
```
バケットは `autoDeleteObjects: true` のため中身ごと削除されます。

## スタック出力
- `SiteURL` — 公開サイト URL (CloudFront)
- `DistributionId` — CloudFront ディストリビューション ID
- `BucketName` — S3 バケット名
