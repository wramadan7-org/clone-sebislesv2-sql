const express = require('express');
const authController = require('../../controllers/authController');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/authValidation');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/google', authController.loginByGoogleTeacher);
router.post('/google-student', authController.loginByGoogleStudent);
router.post(
  '/register',
  validate(authValidation.register),
  authController.register,
);
router.post('/login', validate(authValidation.login), authController.login);

router.post('/logout', auth, authController.logout);
router.post(
  '/refresh',
  validate(authValidation.refresh),
  authController.refreshTokens,
);
router.get('/protected', auth, authController.testProtected);
router.post(
  '/reset-password',
  auth,
  validate(authValidation.resetPassword),
  authController.resetPassword,
);

router.post('/resend-confirmation', authController.resendEmailConfirmation);
router.get('/confirmation/:token', authController.emailConfirmation);
router.post('/register-phone-number', authController.registerByPhoneNumber);
router.post('/login-phone-number', authController.loginByPhoneNumber);
router.post('/forgot-password', authController.sendEmailResetPassword);
router.post(
  '/reset-password/:userId/:token',
  validate(authValidation.resetPassword),
  authController.resetPasswordByEmail,
);

module.exports = router;
