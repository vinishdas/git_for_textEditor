const express = require('express')
const router = express.Router();

const version_controller = require('../controllers/verion_controller');

// router.post('/',authMiddleware,version_controller.CreateVersion);
router.get('/:fileId/lastest',authMiddleware,version_controller.getLatestVersion);
module.exports = router;