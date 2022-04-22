const { Router } = require('express');

const router = Router();
const filterController = require('../../controllers/filterController');

router.post('/les', filterController.filterLes);
router.get('/recommend-tutor/:teacherSubjectId/:teacherId/:availabilityHoursId', filterController.recommendTutor);

module.exports = router;
