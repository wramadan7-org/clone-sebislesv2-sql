const { Router } = require('express');

const router = Router();
const auth = require('../../middlewares/auth');
const topupController = require('../../controllers/topupCoinController');

router.post('/', auth, topupController.topupCoin);

module.exports = router;
