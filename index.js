var Hapi = require('hapi');
var AWS = require('aws-sdk');
var vogels = require('vogels');
var People = require('./lib/models/People');
var Entities = require('./lib/entities');

AWS.config.update({region: 'us-east-1'});
AWS.config.update({accessKeyId: 'People', secretAccessKey: 'SECRET'});

var db = new AWS.DynamoDB({ endpoint: "http://localhost:8000" });

vogels.AWS.config.update({accessKeyId: 'People', secretAccessKey: 'SECRET'});
vogels.dynamoDriver(db);

var halaciousOpts = {};
var server = Hapi.createServer('localhost', 3000);
server.pack.require('halacious', halaciousOpts, function(err){
    if (err) console.log(err);
});

server.route({ method: 'GET', path: '/people', config: {
        plugins: Entities.people,
        handler: function (request, reply) {
            People.scan().exec(function(err, response) {
                if (err) {
                    console.log(err);
                    return reply(err);
                }
                var out = { people: response.Items.map(function(i) {return i.toJSON();}) }
                reply(out);
            });
        }
    }
});

server.route({ method: 'GET', path: '/people/{id}', config: {
        plugins: Entities.person,
        handler: function (request, reply) {
            People.get(request.params.id, function(err, people) {
                if (err) {
                    console.log(err);
                    return reply(err);
                }
                if (!people) return reply(Hapi.error.notFound('Person Not Found'));
                reply(people);
            })
        }
    }
});

server.route({ method: 'POST', path: '/people', handler: function (request, reply) {
        if (!request.payload.id) request.payload.id = Math.round(new Date().getTime() / 1000);
        People.create(request.payload, function (err, people) {
            if (err) {
                console.log(err);
                return reply(err);
            }
            reply(request.payload.id);
        });
    }
});

server.route({ method: 'POST', path: '/people/{id}', handler: function (request, reply) {
        People.get(request.params.id, function(err, people) {
            if (err) {
                console.log(err);
                return reply(err);
            }
            if (!people) return reply(Hapi.error.notFound('Person Not Found'));
            if (!request.payload.id) request.payload.id = request.params.id;
            people.set(request.payload);
            people.update(function (err) {
                if (err) {
                    console.log(err);
                    return reply(err);
                }
                reply().code(200);
            })
        })
    }
});

server.route({ method: 'DELETE', path: '/people/{id}', handler: function (request, reply) {
    People.destroy(request.params.id, function(err) {
        if (err) {
            console.log(err);
            return reply(err);
        }
        reply().code(200);
    })
}
});

server.start();