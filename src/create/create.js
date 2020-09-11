const { DynamoDB } = require('aws-sdk');

const RESERVED_RESPONSE = `Error: You're using AWS reserved keywords as attributes`
const DYNAMODB_EXECUTION_ERROR = `Error: Execution update, caused a Dynamodb error, please take a look at your CloudWatch Logs.`;


exports.handler = async (event)=> {
    console.log("request:", JSON.stringify(event, undefined, 2));

    if (!event.body) {
        return { statusCode: 400, body: 'invalid request, you are missing the parameter body' };
    }
    
    const entry = JSON.parse(event.body);
    const tableName = process.env.TABLE_NAME || '';
    let params = {
        RequestItems: {}
    };

    params.RequestItems[tableName] = [];

    entry.skills.forEach((skill) => {
        params.RequestItems[tableName].push({
            PutRequest: {
                Item: {
                    id: entry.id,
                    name: entry.name,
                    skill
                }
            }
        })
    });

    const client = new DynamoDB.DocumentClient();

    try {
        let result = await client.batchWrite(params).promise();
        return { statusCode: 201, body: '' };
    } catch (dbError) {
        const errorResponse = dbError.code === 'ValidationException' && dbError.message.includes('reserved keyword') ?
        DYNAMODB_EXECUTION_ERROR : RESERVED_RESPONSE;
        return { statusCode: 500, body: errorResponse };
      }
}