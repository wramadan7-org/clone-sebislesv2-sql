const express = require('express');
const auth = require('../../middlewares/auth');
const { student } = require('../../middlewares/roleValidation');
const validate = require('../../middlewares/validate');
const cartValidate = require('../../validations/cartValidation');
const studentController = require('../../controllers/studentController');
const cartController = require('../../controllers/cartController');

const router = express.Router();

router.get('/', auth, student, cartController.viewCart);
router.get('/:id', auth, cartController.getCartById);
router.post('/', auth, validate(cartValidate.addCart), student, cartController.addCart);
router.patch('/:id', auth, cartController.updateStatusCart);
router.patch('/request-materi/:id', auth, student, cartController.updateRequestMateri);
router.delete('/:id', auth, cartController.deleteCartItem);

module.exports = router;
