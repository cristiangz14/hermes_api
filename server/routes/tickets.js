const Joi = require('joi');

const post = ({webAuth, zendeskService}) => ({
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
        })
      })
    },
    handler(request, reply) {
      webAuth.client.userInfo(request.auth.token, (err, user) => {
        if(err) {
          reply({message: err.message}).code(401);
          return;
        }
        
        const payload = request.payload;
        
        const ticket = {
          subject: payload.subject,
          priority: payload.severity,
          comment: payload.description,
          requester: payload.requestedBy,
          submitter: {
            name: user.name,
            email: user.email
          }
        }

        zendeskService.createTicket(ticket)
        .then(function(ticket){
          reply({message: 'The Ticket has been created successfully'});
        }).catch(function(err){
          reply({message: err.message}).code(400);
        });
     });
    },
  }
})

exports.post = post;