const router = require('express').Router();
const webhookController = require('../controllers/webhookController');
const validateRequest = require('../middlewares/validateRequest');
const { webhookValidators } = require('../validators/webhookValidators');

router.post('/payment-update', webhookValidators, validateRequest, webhookController.paymentUpdate);

module.exports = router;
