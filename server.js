require('dotenv').config();

const Hapi = require('hapi');
const inert = require('inert');
const Good = require('good');

const plugins = [{
    register: Good,
    options: {
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    response: '*',
                    log: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
}, {
  register: inert,
}];

const server = new Hapi.Server();

server.connection({ port: process.env.PORT, host: process.env.HOST });

server.register(plugins, (err) => {

    if (err) {
        throw err;
    }

    server.route({
      method: 'POST',
      path: '/api/tickets',
      handler(request, reply) {
        console.log(request.payload);
        reply({message: 'Ticket created'});
      },
    });

    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log(`Server running at: ${server.info.uri}`);
    });
});
