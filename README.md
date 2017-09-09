# Hermes API
Auth0 internal tool that allows the Auth0 Engineers to create tickets in Zendesk on behalf of a customer.

## Auth0 Account
Follow [this](https://github.com/cristiangz14/hermes_client#auth0-account) steps to config the Auth0 account.

## Zendesk
Create a Zendesk account.  
Create a API token to allow the API create ticket using the Zendesk API.

## Installation
```bash
$ npm install
```

## Config ENV variables
Create a .env file at the root of the project set the variables.
``` bash
ZENDESK_URL='https://{zendesk_domain}.zendesk.com'
ZENDESK_EMAIL='{example@company.com}'
ZENDESK_TOKEN={zendesk_token}
PORT=3001
HOST=localhost
AUTH_JWKS_URL='https://{auth0_domain}.auth0.com/.well-known/jwks.json'
AUTH_AUDIENCE_URL={auth0_api_identifier}
AUTH_ISSUER_URL='https://{auth0_domain}.auth0.com/'
```
* **ZENDESK_URL** : Zerndesk account url.
* **ZENDESK_EMAIL**: Zendesk owner's email or admin account email.
* **ZENDESK_TOKEN**: Zendesk API token.
* **PORT**: Port where the API will run.
* **HOST**: Host where the API will run.
* **AUTH_JWKS_URL**: Auth0 public keys.
* **AUTH_AUDIENCE_URL**: Auth0 API audience.

## Devlopment
Run the command to start the project in development env.
```bash
$ npm start
```

## Production
Run the command to start the project in production env.
```bash
$ npm start
```
