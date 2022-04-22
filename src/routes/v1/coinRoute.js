const { Router } = require('express');
const coinController = require('../../controllers/coinController');
const auth = require('../../middlewares/auth');
const {
  admin,
  administrator,
  verifikator,
  finance,
} = require('../../middlewares/roleValidation');

const router = Router();

router.get('/', auth, coinController.getCoin);
router.post('/', auth, coinController.createNewCoin);
router.patch('/', auth, coinController.updateCoin);
router.delete('/', auth, coinController.deleteCoin);

module.exports = router;
