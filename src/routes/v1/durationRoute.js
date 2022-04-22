const { Router } = require('express');

const router = Router();

const auth = require('../../middlewares/auth');
const { admin, administrator } = require('../../middlewares/roleValidation');

const durationController = require('../../controllers/durationController');

router.post('/', auth, (admin, administrator), durationController.addDuration);
router.get('/', auth, durationController.getAllDuration);
router.get('/:id', auth, (admin, administrator), durationController.getDurationById);
router.get('/minute/:minute', auth, (admin, administrator), durationController.getDurationByMinute);
router.patch('/availabilityHours/all', durationController.updateAllAvailabilityHoursDuration);

module.exports = router;
