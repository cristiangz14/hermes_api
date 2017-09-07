const env = require('./config/env');
const plugins = require('./config/plugins');
const Hapi = require('hapi');
const jwt = require('hapi-auth-jwt2');
const jwksRsa = require('jwks-rsa');
const validateUser = require('./config/validateUser');

const server = new Hapi.Server();

server.connection({ port: env.PORT, host: env.HOST });

server.register(plugins, (err) => {

    if (err) {
        throw err;
    }

    server.auth.strategy('jwt', 'jwt', 'required', {
      complete: true,
      // verify the access token against the
      // remote Auth0 JWKS
      key: jwksRsa.hapiJwt2Key({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: env.AUTH_JWKS_URL
      }),
      verifyOptions: {
        audience: env.AUTH_AUDIENCE_URL,
        issuer: env.AUTH_ISSUER_URL,
        algorithms: ['RS256']
      },
      validateFunc: validateUser
    });

    server.route({
      method: 'POST',
      path: '/api/tickets',
      config: {
        auth: {
          scope: 'create:tickets'
        },
        handler(request, reply) {
          console.log(request.payload);
          reply({message: 'Ticket created'});
        },
      }
    });

    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log(`Server running at: ${server.info.uri}`);
    });
});
