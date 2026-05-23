const { body, param } = require('express-validator');

const createPlanValidators = [
  body('planName').trim().notEmpty().withMessage('Plan name is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be positive'),
  body('durationInDays').isInt({ gt: 0 }).withMessage('Duration must be at least 1 day'),
  body('features').optional().isArray().withMessage('Features must be an array'),
];

const updatePlanValidators = [
  param('id').isMongoId().withMessage('Invalid plan id'),
  body('planName').optional().trim().notEmpty().withMessage('Plan name cannot be empty'),
  body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be positive'),
  body('durationInDays').optional().isInt({ gt: 0 }).withMessage('Duration must be at least 1 day'),
  body('features').optional().isArray().withMessage('Features must be an array'),
  body('activeStatus').optional().isBoolean().withMessage('activeStatus must be boolean'),
];

module.exports = {
  createPlanValidators,
  updatePlanValidators,
};
