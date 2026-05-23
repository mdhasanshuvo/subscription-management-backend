const router = require('express').Router();
const webhookController = require('../controllers/webhookController');
const verifyWebhookSecret = require('../middlewares/verifyWebhookSecret');
const validateRequest = require('../middlewares/validateRequest');
const { webhookValidators } = require('../validators/webhookValidators');

router.post('/payment-update', verifyWebhookSecret, webhookValidators, validateRequest, webhookController.paymentUpdate);

module.exports = router;
