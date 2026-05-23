const ApiError = require('../utils/ApiError');
const compareSecret = require('../utils/compareSecret');
const { webhookSecret } = require('../config/env');

function verifyWebhookSecret(req, res, next) {
  const providedSecret = req.headers['x-webhook-secret'];

  if (!compareSecret(webhookSecret, providedSecret)) {
    return next(new ApiError(401, 'Invalid webhook secret'));
  }

  return next();
}

module.exports = verifyWebhookSecret;