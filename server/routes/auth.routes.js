const express = require('express');
const router  = express.Router();
const auth_controller = require('../controllers/auth_controller')

router.login('/login',auth_controller.login);
router.post('/signup',auth_controller.signup);


module.exports = router;