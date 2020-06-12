///////////////////VARIABLE INITIALIZATION//////////////////////////////

const AWS = require('aws-sdk');
// Create the DynamoDB Client with the region you want
const region = 'us-west-2';
AWS.config.update({
    region: region
});

//https://github.com/awsdocs/aws-doc-sdk-examples/blob/master/javascript/example_code/dynamodb/ddbdoc_get.js
// Create DynamoDB document client
var docClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10'
});

///////////////////CODE EXECUTION FLOW//////////////////////////////

console.log("program start");

var file = null;
if (process.argv.length > 2) {
    file = [process.argv[2]][0]
}
if (file === null) {
    console.log("specifify an image number", file);
    process.exit(1);
}

const datajson = require("./data/" + file + ".json");
var params = {
    TableName: 'amazonbins',
    "Item": datajson
};

// INSERT DATA INTO DYNAMODB
docClient.put(params, function (err, data) {
    if (err) {

        console.log(err, "Did not add " + file);
    } else {
        console.log(data, "Empty brackets {} means no error. Added " + file);
    }
});

console.log("program end");