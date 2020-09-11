const { DynamoDB } = require('aws-sdk');

exports.handler = async (event) => {
    console.log("request:", JSON.stringify(event, undefined, 2));

    const client = new DynamoDB.DocumentClient();
    const tableName = process.env.TABLE_NAME || '';

    const query = JSON.parse(event.queryStringParameters);
    let results = []
    try {
       const params = {
            TableName: tableName,
            KeyConditionExpression: 'skill = :skill',
            ExpressionAttributeValues: {
                ':skill': query.skill
            }
        }
    
        results = await client.query(params).promise();
        console.log(`results: ${JSON.stringify(results, undefined, 2)}`);
        return { statusCode: 200, body: JSON.stringify(results.Items)};
    } catch (dbError) {
        return {statusCode: 500, body: JSON.stringify(dbError)};
    }
}