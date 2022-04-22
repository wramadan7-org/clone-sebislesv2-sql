const { Router } = require('express');
const validate = require('../../middlewares/validate');
const curriculumValidate = require('../../validations/curriculumValidate');
const curriculumController = require('../../controllers/curriculumController');

const router = Router();

router.post('/', validate(curriculumValidate.createCurriculum), curriculumController.createCurriculum);
router.get('/', curriculumController.getCurriculumAll);
router.get('/:curriculumId', validate(curriculumValidate.getCurriculumById), curriculumController.getCurriculumById);
router.patch('/:curriculumId', validate(curriculumValidate.updateCurriculum), curriculumController.updateCurriculum);
router.delete('/:curriculumId', validate(curriculumValidate.getCurriculumById), curriculumController.deleteCurriculum);

module.exports = router;
