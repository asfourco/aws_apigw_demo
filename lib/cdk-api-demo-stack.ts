import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigatewayv2';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class CdkAPIDemo extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

      // define resources
      const table = new dynamodb.Table(this, 'Candidates', {
          partitionKey: { name: 'skill', type: dynamodb.AttributeType.STRING },
          sortKey: {name: 'name', type: dynamodb.AttributeType.STRING},
          billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
          removalPolicy: cdk.RemovalPolicy.DESTROY
      });

      const environment = {
          TABLE_NAME: table.tableName,
          PRIMARY_KEY: 'id'
      }
      // Lambda functions
      const createCandidateFn = new lambda.Function(this, 'CreateCandidate', {
          runtime: lambda.Runtime.NODEJS_10_X,
          code: new lambda.AssetCode('src/create'),
          handler: 'create.handler',
          timeout: cdk.Duration.minutes(1),
          environment,
      });

      const searchCandidatesFn = new lambda.Function(this, 'SearchCandidate', {
          runtime: lambda.Runtime.NODEJS_10_X,
          code: new lambda.AssetCode('src/search'),
          handler: 'search.handler',
          timeout: cdk.Duration.minutes(1),
          environment
      });

      const listCandidatesFn = new lambda.Function(this, 'GetCandidates', {
          runtime: lambda.Runtime.NODEJS_10_X,
          code: new lambda.AssetCode('src/list'),
          handler: 'list.handler',
          timeout: cdk.Duration.minutes(1),
          environment
      });

      // Proxy integrations
      const createCandidate = new apigw.LambdaProxyIntegration({handler: createCandidateFn});
      const searchCandidates = new apigw.LambdaProxyIntegration({handler: searchCandidatesFn});
      const listCandidates = new apigw.LambdaProxyIntegration({handler: listCandidatesFn});

      const api = new apigw.HttpApi(this, 'HttpApi');

      api.addRoutes({
          path: '/candidates',
          methods: [apigw.HttpMethod.GET],
          integration: listCandidates
      });
      api.addRoutes({
          path: '/candidates',
          methods: [apigw.HttpMethod.POST],
          integration: createCandidate
      });
      api.addRoutes({
          path: '/candidates/search',
          methods: [apigw.HttpMethod.GET],
          integration: searchCandidates
      });

      table.grantReadWriteData(createCandidateFn);
      table.grantReadWriteData(searchCandidatesFn);
      table.grantReadWriteData(listCandidatesFn);
  }
}
