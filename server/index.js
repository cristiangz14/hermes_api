const env = require('./config/env');
const plugins = require('./config/plugins');
const Hapi = require('hapi');
const jwt = require('hapi-auth-jwt2');
const jwksRsa = require('jwks-rsa');
const validateUser = require('./config/validateUser');
const ZendeskService = require('./services/ZendeskService');
const auth0 = require('auth0-js');
const ticketRoutes = require('./routes/tickets');
const zendeskService = new ZendeskService();
const server = new Hapi.Server();

const webAuth = new auth0.WebAuth({
  domain: env.AUTH_DOMAIN,
  clientID: env.AUTH_CLIENT_ID
});

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

    server.route(ticketRoutes.post({webAuth, zendeskService}));

    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log(`Server running at: ${server.info.uri}`);
    });
});
