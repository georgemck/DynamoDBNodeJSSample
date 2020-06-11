// ------------ NodeJS runtime ---------------
// Add aws-sdk in package.json as a dependency
// Example:
// {
//     "dependencies": {
//         "aws-sdk": "^2.0.9",
//     }
// }
// Create your credentials file at ~/.aws/credentials (C:\Users\USER_NAME\.aws\credentials for Windows users)
// Format of the above file should be:
//  [default]
//  aws_access_key_id = YOUR_ACCESS_KEY_ID
//  aws_secret_access_key = YOUR_SECRET_ACCESS_KEY


///////////////////VARIABLE INITIALIZATION//////////////////////////////


const AWS = require('aws-sdk');
// Create the DynamoDB Client with the region you want
const region = 'us-west-2';
const dynamoDbClient = createDynamoDbClient(region);
let DynamoTypes = require('dynamodb-types');
const selenajson = require("./selena.json");



///////////////////CODE EXECUTION FLOW//////////////////////////////


console.log("program start");

for (const element of selenajson.results) {
    if (!element.artistId) {
        return;
    }
    // if (!element.collectionId) {
    //     return;
    // }

    if (element.discCount) {
        element.discCount = element.discCount.toString();
    }
    if (element.trackNumber) {
        element.trackNumber = element.trackNumber.toString();
    }
    if (element.trackCount) {
        element.trackCount = element.trackCount.toString();
    }
    if (element.collectionPrice) {
        element.collectionPrice = element.collectionPrice.toString();
    }
    if (element.discNumber) {
        element.discNumber = element.discNumber.toString();
    }
    if (element.trackTimeMillis) {
        element.trackTimeMillis = element.trackTimeMillis.toString();
    }
    if (element.trackPrice) {
        element.trackPrice = element.trackPrice.toString();
    }
    if (element.trackId) {
        element.trackId = element.trackId.toString();
    }
    if (element.collectionId) {
        element.collectionId = element.collectionId.toString();
    }
    if (element.artistId) {
        element.artistId = element.artistId.toString();
    }
    if (element.collectionArtistId) {
        element.collectionArtistId = element.collectionArtistId.toString();
    }
    if (element.trackRentalPrice) {
        element.trackRentalPrice = element.trackRentalPrice.toString();
    }
    if (element.collectionHdPrice) {
        element.collectionHdPrice = element.collectionHdPrice.toString();
    }
    if (element.trackHdPrice) {
        element.trackHdPrice = element.trackHdPrice.toString();
    }
    if (element.trackHdRentalPrice) {
        element.trackHdRentalPrice = element.trackHdRentalPrice.toString();
    }

    let dynamodbJSON = DynamoTypes.default.parse(element);
    processItem(dynamodbJSON);

}

console.log("program end");

/////////////////FUNCTIONS//////////////////////////////

function processItem(item) {
    var data = {
        "TableName": "AppleMusicDB",
        "Item": item
    }

    executePutItem(dynamoDbClient, data)
        .then(datum => {
            console.info('PutItem API call has been executed. ');
        })
        .catch(e => {
            console.log(e);
        });

}

function createDynamoDbClient(regionName) {
    // Set the region
    AWS.config.update({
        region: regionName
    });
    // Use the following config instead when using DynamoDB Local
    // AWS.config.update({region: 'localhost', endpoint: 'http://localhost:8000', accessKeyId: 'access_key_id', secretAccessKey: 'secret_access_key'});
    return new AWS.DynamoDB();
}
// console.log(dynamoDbClient);


// Call DynamoDB's putItem API
async function executePutItem(dynamoDbClient, putItemInput) {
    // Call DynamoDB's putItem API
    try {
        const putItemOutput = await dynamoDbClient.putItem(putItemInput).promise();
        console.info('Successfully put item.');
        // Handle putItemOutput
    } catch (err) {
        handlePutItemError(err);
    }
}

// Call DynamoDB's updateItem API
async function executeUpdateItem(dynamoDbClient, updateItemInput) {
    // Call DynamoDB's updateItem API
    try {
        const updateItemOutput = await dynamoDbClient.updateItem(updateItemInput).promise();
        console.info('Successfully updated item.');
        // Handle updateItemOutput
    } catch (err) {
        handleUpdateItemError(err);
    }
}


///////////////////ERROR HANDLING//////////////////////////////

// Handles errors during PutItem execution. Use recommendations in error messages below to 
// add error handling specific to your application use-case. 
function handlePutItemError(err) {
    if (!err) {
        console.error('Encountered error object was empty');
        return;
    }
    if (!err.code) {
        console.error(`An exception occurred, investigate and configure retry strategy. Error: ${JSON.stringify(err)}`);
        return;
    }
    switch (err.code) {
        case 'ConditionalCheckFailedException':
            console.error(`Condition check specified in the operation failed, review and update the condition check before retrying. Error: ${err.message}`);
            return;
        case 'TransactionConflictException':
            console.error(`Operation was rejected because there is an ongoing transaction for the item, generally safe to retry ' +
       'with exponential back-off. Error: ${err.message}`);
            return;
        case 'ItemCollectionSizeLimitExceededException':
            console.error(`An item collection is too large, you're using Local Secondary Index and exceeded size limit of` +
                `items per partition key. Consider using Global Secondary Index instead. Error: ${err.message}`);
            return;
        default:
            break;
            // Common DynamoDB API errors are handled below
    }
    handleCommonErrors(err);
}

function handleUpdateItemError(err) {
    if (!err) {
        console.error('Encountered error object was empty');
        return;
    }
    if (!err.code) {
        console.error(`An exception occurred, investigate and configure retry strategy. Error: ${JSON.stringify(err)}`);
        return;
    }
    switch (err.code) {
        case 'ConditionalCheckFailedException':
            console.error(`Condition check specified in the operation failed, review and update the condition check before retrying. Error: ${err.message}`);
            return;
        case 'TransactionConflictException':
            console.error(`Operation was rejected because there is an ongoing transaction for the item, generally safe to retry ' +
       'with exponential back-off. Error: ${err.message}`);
            return;
        case 'ItemCollectionSizeLimitExceededException':
            console.error(`An item collection is too large, you're using Local Secondary Index and exceeded size limit of` +
                `items per partition key. Consider using Global Secondary Index instead. Error: ${err.message}`);
            return;
        default:
            break;
            // Common DynamoDB API errors are handled below
    }
    handleCommonErrors(err);
}

function handleCommonErrors(err) {
    switch (err.code) {
        case 'InternalServerError':
            console.error(`Internal Server Error, generally safe to retry with exponential back-off. Error: ${err.message}`);
            return;
        case 'ProvisionedThroughputExceededException':
            console.error(`Request rate is too high. If you're using a custom retry strategy make sure to retry with exponential back-off.` +
                `Otherwise consider reducing frequency of requests or increasing provisioned capacity for your table or secondary index. Error: ${err.message}`);
            return;
        case 'ResourceNotFoundException':
            console.error(`One of the tables was not found, verify table exists before retrying. Error: ${err.message}`);
            return;
        case 'ServiceUnavailable':
            console.error(`Had trouble reaching DynamoDB. generally safe to retry with exponential back-off. Error: ${err.message}`);
            return;
        case 'ThrottlingException':
            console.error(`Request denied due to throttling, generally safe to retry with exponential back-off. Error: ${err.message}`);
            return;
        case 'UnrecognizedClientException':
            console.error(`The request signature is incorrect most likely due to an invalid AWS access key ID or secret key, fix before retrying.` +
                `Error: ${err.message}`);
            return;
        case 'ValidationException':
            console.error(`The input fails to satisfy the constraints specified by DynamoDB, ` +
                `fix input before retrying. Error: ${err.message}`);
            return;
        case 'RequestLimitExceeded':
            console.error(`Throughput exceeds the current throughput limit for your account, ` +
                `increase account level throughput before retrying. Error: ${err.message}`);
            return;
        default:
            console.error(`An exception occurred, investigate and configure retry strategy. Error: ${err.message}`);
            return;
    }
}