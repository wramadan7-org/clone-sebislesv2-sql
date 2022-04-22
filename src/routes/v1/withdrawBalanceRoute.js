const { Router } = require('express');
const withdrawBalanceController = require('../../controllers/withdrawBalanceController');
const authController = require('../../controllers/authController');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/authValidation');
const {
  student,
  teacher,
  verifikator,
  finance,
  admin,
  administrator,
} = require('../../middlewares/roleValidation');

const router = Router();
const auth = require('../../middlewares/auth');

router.post('/', auth, withdrawBalanceController.createWithdrawRequest);
router.get('/', auth, withdrawBalanceController.getUserWithdrawRequest);
router.get('/:id', auth, withdrawBalanceController.getWithdrawByid);
router.get(
  '/admin',
  auth,
  (admin, finance, administrator),
  withdrawBalanceController.getWithdrawRequestForAdmin,
);

router.patch(
  '/admin',
  auth,
  (admin, finance, administrator),
  withdrawBalanceController.updateWithdrawForAdmin,
);

router.delete(
  '/',
  auth,
  withdrawBalanceController.deletePendingWithdrawRequest,
);

router.get('/pin', auth, withdrawBalanceController.checkPinUser);
router.post('/forget-pin', auth, authController.forgetPin);
router.patch(
  '/pin',
  auth,
  validate(authValidation.pin),
  authController.resetPin,
);
router.post(
  '/verify-pin',
  auth,
  validate(authValidation.pin),
  authController.verifyPin,
);

module.exports = router;
