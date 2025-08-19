const express = require('express')
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware')

const version_controller = require('../controllers/verion_controller');

// router.post('/',authMiddleware,version_controller.CreateVersion);
router.get('/:fileId/branches/:branchId/latest',authMiddleware,version_controller.getLatestVersion);
router.post('/createchunk',authMiddleware,version_controller.createchunk);
router.post('/createversion',authMiddleware,version_controller.createversion);
router.post('/CreateBranch',authMiddleware,version_controller.createBranch);
module.exports = router;