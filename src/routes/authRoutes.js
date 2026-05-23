const router = require('express').Router();
const authController = require('../controllers/authController');
const validateRequest = require('../middlewares/validateRequest');
const authenticate = require('../middlewares/auth');
const { registerValidators, loginValidators } = require('../validators/authValidators');

router.post('/register', registerValidators, validateRequest, authController.register);
router.post('/login', loginValidators, validateRequest, authController.login);
router.get('/me', authenticate, authController.me);

module.exports = router;
