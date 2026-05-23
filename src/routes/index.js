const router = require('express').Router();

router.use('/auth', require('./authRoutes'));
router.use('/plans', require('./planRoutes'));
router.use('/subscriptions', require('./subscriptionRoutes'));
router.use('/analytics', require('./analyticsRoutes'));
router.use('/webhook', require('./webhookRoutes'));

module.exports = router;
