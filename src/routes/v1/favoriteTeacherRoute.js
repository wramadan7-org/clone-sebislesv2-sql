const { Router } = require('express');

const router = Router();
const auth = require('../../middlewares/auth');
const { student } = require('../../middlewares/roleValidation');

const favoriteTeacherController = require('../../controllers/favoriteTeacherController');

router.post('/', auth, student, favoriteTeacherController.createFavorite);
router.get('/', auth, favoriteTeacherController.getAllFavoriteTeacher);
router.get('/own', auth, student, favoriteTeacherController.getMyFavoriteTeacher);
router.patch('/', auth, favoriteTeacherController.updateOrCreateFavoriteTeacher);

module.exports = router;
