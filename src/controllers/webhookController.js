const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../middlewares/responseFormatter');
const { handleWebhook } = require('../services/webhookService');

const paymentUpdate = asyncHandler(async (req, res) => {
  const updatedSubscription = await handleWebhook({
    secret: req.headers['x-webhook-secret'],
    payload: req.body,
  });

  return res.status(200).json(successResponse('Webhook processed successfully', updatedSubscription));
});

module.exports = {
  paymentUpdate,
};
