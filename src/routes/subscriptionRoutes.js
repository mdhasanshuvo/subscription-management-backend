const router = require('express').Router();
const subscriptionController = require('../controllers/subscriptionController');
const authenticate = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/rbac');
const validateRequest = require('../middlewares/validateRequest');
const { purchaseValidators, planActionValidators } = require('../validators/subscriptionValidators');

router.get('/me/current', authenticate, subscriptionController.current);
router.get('/me/history', authenticate, subscriptionController.history);
router.post('/purchase', authenticate, purchaseValidators, validateRequest, subscriptionController.purchase);
router.post('/upgrade', authenticate, planActionValidators, validateRequest, subscriptionController.upgrade);
router.post('/downgrade', authenticate, planActionValidators, validateRequest, subscriptionController.downgrade);
router.patch('/cancel', authenticate, subscriptionController.cancel);
router.get('/admin/all', authenticate, authorizeRoles('Admin'), subscriptionController.adminList);

module.exports = router;
