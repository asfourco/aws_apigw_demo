const { DynamoDB } = require('aws-sdk');

exports.handler = async (event) => {
    console.log("request:", JSON.stringify(event, undefined, 2));

    const client = new DynamoDB.DocumentClient();

    const params = {
        TableName: process.env.TABLE_NAME,
    }

    try {
        let result = await client.scan(params).promise();
        return {statusCode: 200, body: JSON.stringify(result.Items)};
    } catch (dbError) {
        return {statusCode: 500, body: JSON.stringify(dbError)};
    }
}