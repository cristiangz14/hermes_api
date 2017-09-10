const env = require('./config/env');
const plugins = require('./config/plugins');
const Hapi = require('hapi');
const jwt = require('hapi-auth-jwt2');
const jwksRsa = require('jwks-rsa');
const validateUser = require('./config/validateUser');
const Joi = require('joi');
const ZendeskService = require('./services/ZendeskService');

const zendeskService = new ZendeskService();
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
        validate: {
          payload: Joi.object().keys({
            subject: Joi.string(),
            description: Joi.string(),
            severity: Joi.string(),
            requestedBy: Joi.object().keys({
              name: Joi.string(),
              email: Joi.string().email(),
            }),
            submittedBy: Joi.object().keys({
              name: Joi.string(),
              email: Joi.string().email(),
            })
          })
        },
        handler(request, reply) {
          const payload = request.payload;
          const ticket = {
            subject: payload.subject,
            priority: payload.severity,
            comment: payload.description,
            requester: payload.requestedBy,
            submitter: payload.submittedBy
          }

          zendeskService.createTicket(ticket)
          .then(function(ticket){
            reply({message: 'The Ticket has been created successfully'});
          }).catch(function(err){
            reply({message: err.message}).code(400);
          });
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
