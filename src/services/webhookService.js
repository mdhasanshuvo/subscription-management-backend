const ApiError = require('../utils/ApiError');
const compareSecret = require('../utils/compareSecret');
const { webhookSecret } = require('../config/env');
const { processWebhookPaymentUpdate } = require('./subscriptionService');

async function handleWebhook({ secret, payload }) {
  if (!compareSecret(webhookSecret, secret)) {
    throw new ApiError(401, 'Invalid webhook secret');
  }

  const { subscriptionId, eventType, metadata } = payload;
  if (!subscriptionId || !eventType) {
    throw new ApiError(400, 'subscriptionId and eventType are required');
  }

  return processWebhookPaymentUpdate({ subscriptionId, eventType, metadata });
}

module.exports = {
  handleWebhook,
};
