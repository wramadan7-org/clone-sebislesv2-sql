const { Router } = require('express');

const router = Router();

const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { verifikator } = require('../../middlewares/roleValidation');
const assessmentValidate = require('../../validations/tutorAssessmentValidation');

const verifikatorController = require('../../controllers/verifikatorController');

router.post('/assessment', auth, validate(assessmentValidate.createAssessment), verifikator, verifikatorController.createTutorAssessment);
router.post('/interview-report', auth, verifikator, verifikatorController.reportInterview);
router.get('/interview-report', auth, verifikator, verifikatorController.getAllReportInterview);
router.get('/teacher-subject/:userId', auth, verifikator, verifikatorController.getRequestTeacherSubject);
router.patch('/teacher-subject/approve/:teacherSubjectId', auth, verifikator, verifikatorController.approveTeahcerSubject);
router.get('/teacher-info/:teacherId', auth, verifikator, verifikatorController.infoTutor);
router.patch('/teaching-experience/show/:teachingExperienceId', auth, verifikator, verifikatorController.showTeachingExperience);

module.exports = router;
