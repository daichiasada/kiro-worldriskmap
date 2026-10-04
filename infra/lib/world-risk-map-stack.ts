import * as path from 'path';
import { Construct } from 'constructs';
import {
  Stack,
  StackProps,
  RemovalPolicy,
  Duration,
  CfnOutput,
} from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

/**
 * 地政学リスク可視化サイトの静的ホスティング基盤。
 *
 * 構成:
 *  - 非公開 S3 バケット(サイト成果物を格納)
 *  - CloudFront ディストリビューション(OAC 経由で S3 を参照)
 *  - SPA 用に 403/404 を index.html(200)へフォールバック
 *  - BucketDeployment で ../dist をアップロードし、デプロイ毎にキャッシュ無効化
 */
export class WorldRiskMapStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      comment: 'World Geopolitical Risk Map',
      defaultRootObject: 'index.html',
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      defaultBehavior: {
        // OAC 付きの S3 オリジン(バケットポリシーは自動付与される)
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.seconds(10),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.seconds(10),
        },
      ],
    });

    new s3deploy.BucketDeployment(this, 'DeploySite', {
      // ../dist はアプリ側で `npm run build` 済みであること
      sources: [s3deploy.Source.asset(path.join(__dirname, '..', '..', 'dist'))],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
      prune: true,
    });

    new CfnOutput(this, 'SiteURL', {
      value: `https://${distribution.distributionDomainName}`,
      description: '公開サイト URL',
    });
    new CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
    });
    new CfnOutput(this, 'BucketName', {
      value: siteBucket.bucketName,
    });
  }
}
