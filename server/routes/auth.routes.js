const express = require('express');
const router  = express.Router();
const auth_controller = require('../controllers/auth_controller')
const auth_middlewares = require('../middlewares/auth.middleware');

router.post('/login',auth_controller.login);
router.post('/signup',auth_controller.signup);
router.middleware('/middleware',auth_middlewares.middleware)

module.exports = router;