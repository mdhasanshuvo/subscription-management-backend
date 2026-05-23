const router = require('express').Router();
const analyticsController = require('../controllers/analyticsController');
const authenticate = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/rbac');

router.get('/admin/dashboard', authenticate, authorizeRoles('Admin'), analyticsController.dashboard);

module.exports = router;
