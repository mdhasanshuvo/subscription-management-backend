const { body } = require('express-validator');

const purchaseValidators = [
  body('planId').isMongoId().withMessage('planId is required and must be valid'),
  body('autoRenew').optional().isBoolean().withMessage('autoRenew must be boolean'),
];

const planActionValidators = [
  body('planId').isMongoId().withMessage('planId is required and must be valid'),
  body('autoRenew').optional().isBoolean().withMessage('autoRenew must be boolean'),
];

module.exports = {
  purchaseValidators,
  planActionValidators,
};
