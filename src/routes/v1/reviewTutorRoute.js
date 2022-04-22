const { Router } = require('express');

const auth = require('../../middlewares/auth');
const { student } = require('../../middlewares/roleValidation');
const reviewTutorController = require('../../controllers/reviewTutorController');

const router = Router();

router.post('/', auth, reviewTutorController.createNewReviewTutor);
router.get('/', auth, reviewTutorController.getReviewByTutor);
router.get('/rating-tutor', auth, reviewTutorController.getRatingTutor);
router.delete('/', auth, reviewTutorController.deleteReview);

module.exports = router;
