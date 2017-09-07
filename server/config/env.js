require('dotenv').config();

exports.PORT = process.env.PORT;
exports.HOST = process.env.HOST;
exports.AUTH_JWKS_URL = process.env.AUTH_JWKS_URL;
exports.AUTH_AUDIENCE_URL = process.env.AUTH_AUDIENCE_URL;
exports.AUTH_ISSUER_URL = process.env.AUTH_ISSUER_URL;
