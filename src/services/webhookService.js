const ApiError = require('../utils/ApiError');
const { processWebhookPaymentUpdate } = require('./subscriptionService');

async function handleWebhook({ secret, payload }) {
  const { subscriptionId, eventType, metadata } = payload;
  if (!subscriptionId || !eventType) {
    throw new ApiError(400, 'subscriptionId and eventType are required');
  }

  if (!secret) {
    throw new ApiError(401, 'Invalid webhook secret');
  }

  return processWebhookPaymentUpdate({ subscriptionId, eventType, metadata });
}

module.exports = {
  handleWebhook,
};
