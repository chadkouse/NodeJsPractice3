var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
AWS.config.update({accessKeyId: 'People', secretAccessKey: 'SECRET'});

var db = new AWS.DynamoDB({
    endpoint: "http://localhost:8000"
});

var listTables = function (err, data) {
    if (err)
        console.log(err);

    db.listTables({}, function (err, data) {
        console.log(data);
    });

};

db.createTable({
    AttributeDefinitions: [
        {
            AttributeName: "id",
            AttributeType: "N"
        }
    ],
    TableName: "people",
    KeySchema: [
        {
            AttributeName: "id",
            KeyType: "HASH"
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 3,
        WriteCapacityUnits: 3
    }
}, listTables);