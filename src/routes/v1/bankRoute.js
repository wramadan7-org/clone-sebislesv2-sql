const { Router } = require('express');

const auth = require('../../middlewares/auth');
const {
  student,
  teacher,
  verifikator,
  finance,
  admin,
  administrator,
} = require('../../middlewares/roleValidation');
const validate = require('../../middlewares/validate');
const bankValidation = require('../../validations/bankValidation');

const router = Router();

const bankController = require('../../controllers/bankController');

router.get('/', auth, bankController.getAllBank);
router.get('/id', auth, bankController.getBankById);
router.get('/account', auth, bankController.getOwnBank);
router.post(
  '/',
  auth,
  validate(bankValidation.createBank),
  bankController.createBank,
);
router.patch(
  '/',
  auth,
  validate(bankValidation.updateBank),
  bankController.updateBank,
);

router.delete('/:id', auth, bankController.deleteBank);
router.delete('/account/:id', auth, bankController.deleteOwnBank);

module.exports = router;
