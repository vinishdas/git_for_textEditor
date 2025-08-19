const express = require('express');
const router  = express.Router();
const  file_controller= require('../controllers/file_controller')
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/files',authMiddleware,file_controller.getfiles);
router.post('/files',authMiddleware,file_controller.createfile);
router.post('/file/title',authMiddleware,file_controller.changetitle);
module.exports =router;