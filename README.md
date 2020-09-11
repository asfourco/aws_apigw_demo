# API Gateway Demo

This is a small demonstration on setting up an AWS api gateway (v2) with lambda functions responding to each endpoint.

## Concept

Create the following endpoints

|HTTP Verb| Endpoint | payload|Return|
| --|:--|:--|
| POST| /candidates | body: JSON object of name (string), id (string), skills (string[])| success: 201, error: 500|
|GET | /candidates| none | array of candidates|
|GET | /candidates/search | query: skill="string"| array of candidates|

Notes:

* This demo makes use of dynamoDB as a backend.
* The search is based on one keyword at a time

I've attached a Postman Collection to help with the testing. Please make sure to update the URL variable of the collection to the correct AWS Http API gateway URL.

## Usage

### Global setup

1. Ensure you have `aws cli` authorization, i.e., your `~/.aws/credentials` exists and is valid
1. Installed globally `typescript`, `yarn`, and `aws-cdk`

### local

1. Install modules: `yarn install`
1. To see what the CloudFormation template would be use `cdk synth`
1. Deploy to your AWS account with `cdk deploy`
1. Now use Postman or curl to test the endpoints