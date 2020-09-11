#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CdkAPIDemo } from '../lib/cdk-api-demo-stack';

const app = new cdk.App();
new CdkAPIDemo(app, 'CdkAPIDemoStack');
