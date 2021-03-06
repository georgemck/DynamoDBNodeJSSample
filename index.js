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

const selenajson = require("./selena.json");

///////////////////CODE EXECUTION FLOW//////////////////////////////

console.log("program start");

for (const element of selenajson.results) {

    var params = {
        TableName: 'AppleMusic',
        "Item": element
    };

    if (!element.artistId) {
        return;
    }

    // INSERT DATA INTO DYNAMODB
    docClient.put(params, function (err, data) {
        if (err) {
            console.log(err, "Did not add  --> " + element.artistName + ": " + element.trackName);
        } else {
            console.log(data, "Empty brackets {} means no error. Added " + element.artistName + ": " + element.trackName);
        }
    });

}

console.log("program end");