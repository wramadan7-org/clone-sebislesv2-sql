const express = require('express');
const referralController = require('../../controllers/referralController');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.patch('/', auth, referralController.addReferredBy);

module.exports = router;
