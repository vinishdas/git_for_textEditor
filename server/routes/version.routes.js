const express = require('express')
const router = express.Router();

const version_controller = require('../controllers/verion_controller');

router.post('/',authMiddleware,version_controller.CreateVersion);
router.get('/',authMiddleware,version_controller.GetVersion);
module.exports = router;