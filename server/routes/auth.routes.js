const express = require('express');
const router  = express.Router();
const auth_controller = require('../controllers/auth_controller')
const auth_middlewares = require('../middlewares/auth.middleware');

router.post('/login',auth_controller.login);
router.post('/signup',auth_controller.signup);
router.get('/middleware', auth_middlewares, (req, res) => {
  res.json({ message: 'You are authorized', userId: req.userId });
});

module.exports = router;