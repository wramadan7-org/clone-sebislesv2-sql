const { Router } = require('express');
const { teacher } = require('../../middlewares/roleValidation');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const teacherSubjectController = require('../../controllers/teacherSubjectController');

const router = Router();

router.post('/', auth, teacher, teacherSubjectController.createTeacherSubject);
router.get('/', auth, teacherSubjectController.getTeacherSubjectAll);
router.get('/own', auth, teacher, teacherSubjectController.getOwnTeacherSubject);
router.get('/:teacherSubjectId', auth, teacher, teacherSubjectController.getTeacherSubjectById);
router.patch('/:teacherSubjectId', auth, teacher, teacherSubjectController.updateTeacherSubject);
router.delete('/:teacherSubjectId', auth, teacher, teacherSubjectController.deleteTeacherSubject);

module.exports = router;
