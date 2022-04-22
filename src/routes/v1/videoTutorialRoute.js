const express = require('express');
const auth = require('../../middlewares/auth');
const videoController = require('../../controllers/videoTutorialController');
const validate = require('../../middlewares/validate');

const router = express.Router();

router.post('/', auth, videoController.createNewVideoTutorial);
router.get('/', videoController.getVideoTutorial);
router.patch('/', auth, videoController.updateVideoTutorial);
router.delete('/', auth, videoController.deleteVideoTutorial);
module.exports = router;
