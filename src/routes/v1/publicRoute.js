const { Router } = require('express');

const router = Router();
const publicController = require('../../controllers/publicController');

router.get('/', publicController.publicHome);
router.get('/availability-hours/:teacherId', publicController.availabilityHours);

module.exports = router;
