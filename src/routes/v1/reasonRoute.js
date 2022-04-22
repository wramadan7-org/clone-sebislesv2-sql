const { Router } = require('express');

const router = Router();

const auth = require('../../middlewares/auth');

const reasonController = require('../../controllers/reasonController');

router.post('/', auth, reasonController.addReason);
router.get('/', auth, reasonController.getAllReason);

module.exports = router;
