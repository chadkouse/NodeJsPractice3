var vogels = require('vogels');
var People = vogels.define('People', function (schema) {
    schema.Number('id', {hashKey: true});
    schema.String('name_last').required();
    schema.String('name_first').required();
    schema.Boolean('sex').required(); // false = Male, true = Female
    schema.Number('father');
    schema.Number('mother');
});
People.config({tableName: 'people'});
module.exports = People;