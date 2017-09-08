const env = require('../config/env');
const Zendesk = require('zendesk-node-api');

class ZendeskService {

  constructor() {
    this.api = new Zendesk({
      url: env.ZENDESK_URL,
      email: env.ZENDESK_EMAIL,
      token: env.ZENDESK_TOKEN
    });;
  }

  createTicket(ticket) {
    const self = this;
    return this.searchAgent(ticket.submitter.email)
      .then(function(agents) {
        return agents && agents.length && agents[0].id ? agents[0].id : null;
      })
      .then(function(agentId) {
        if(agentId) {
          return agentId;
        }

        return self.createAgent(ticket.submitter.name, ticket.submitter.email)
          .then(function(agent) {
            return agent && agent.user && agent.user.id ? agent.user.id : null;
          });
      })
      .then(function(agentId) {
        return self.api.tickets.create({
          subject: ticket.subject,
          priority: ticket.priority,
          comment: {
            body: ticket.comment
          },
          requester: ticket.requester,
          submitter_id: agentId
        });
      })
  }

  createAgent(name, email) {
    return this.api.users.create({
      name: name,
      email: email,
      role: 'agent',
    });
  }

  searchAgent(email) {
    return this.api.search
      .list(`query=type:user "${email}"`);
  }
}

module.exports = ZendeskService;
