const { Router } = require('express');

const router = Router();

const priceController = require('../../controllers/priceController');

router.get('/:id', priceController.getPriceById);
router.patch('/:id', priceController.updateTeacherPrice);

module.exports = router;
