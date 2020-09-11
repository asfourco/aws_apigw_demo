import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CdkApi from '../lib/cdk-api-demo-stack';

test('DynamoDB Table Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CdkApi.CdkAPIDemo(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(haveResource("AWS::DynamoDB::Table"));
});

test('API Gateway Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new CdkApi.CdkAPIDemo(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(haveResource("AWS::ApiGatewayV2::Api"));
});
