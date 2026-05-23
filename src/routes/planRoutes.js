const router = require('express').Router();
const planController = require('../controllers/planController');
const authenticate = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/rbac');
const validateRequest = require('../middlewares/validateRequest');
const { createPlanValidators, updatePlanValidators } = require('../validators/planValidators');

router.get('/', planController.listActive);
router.get('/admin/all', authenticate, authorizeRoles('Admin'), planController.listAll);
router.post('/', authenticate, authorizeRoles('Admin'), createPlanValidators, validateRequest, planController.create);
router.put('/:id', authenticate, authorizeRoles('Admin'), updatePlanValidators, validateRequest, planController.update);
router.delete('/:id', authenticate, authorizeRoles('Admin'), updatePlanValidators, validateRequest, planController.remove);

module.exports = router;
