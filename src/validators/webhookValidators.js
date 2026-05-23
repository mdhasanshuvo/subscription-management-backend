const { body } = require('express-validator');

const webhookValidators = [
  body('subscriptionId').isMongoId().withMessage('subscriptionId is required and must be valid'),
  body('eventType').isIn(['payment_success', 'payment_failed', 'renewal_success']).withMessage('eventType is invalid'),
  body('metadata').optional().isObject().withMessage('metadata must be an object'),
];

module.exports = {
  webhookValidators,
};
