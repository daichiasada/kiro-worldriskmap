#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WorldRiskMapStack } from '../lib/world-risk-map-stack';

const app = new cdk.App();

new WorldRiskMapStack(app, 'WorldRiskMapStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'us-east-1',
  },
  description: 'World Geopolitical Risk Map — static site (S3 + CloudFront, OAC)',
});
