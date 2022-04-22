const { Router } = require('express');

const router = Router();
const auth = require('../../middlewares/auth');
const { student } = require('../../middlewares/roleValidation');
const validate = require('../../middlewares/validate');

const transactionController = require('../../controllers/tutoringTransactionController');

router.post('/', auth, student, transactionController.createTutoringTransaction);

module.exports = router;
