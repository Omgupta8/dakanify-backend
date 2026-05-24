const { Router } = require('express');
const { validate } = require('../middlewares/validator');
const authValidation = require('../validations/auth.validation');
const authController = require('../controllers/auth.controller');
const auth = require('../middlewares/auth');

const router = Router();

// TO DO: token versioning, token blocklisting, refresh token
router.post('/login', validate(authValidation.loginUser), authController.loginUser);
router.patch('/update-password', auth, validate(authValidation.updatePassword), authController.updatePassword);
router.post('/register', auth,  validate(authValidation.registerUser), authController.registerUser);
router.get('/me', auth, authController.getUser);

module.exports = router;