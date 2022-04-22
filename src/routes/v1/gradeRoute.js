const { Router } = require('express');
const validate = require('../../middlewares/validate');
const gradeValidate = require('../../validations/gradeValidation');
const gradeController = require('../../controllers/gradeController');
const auth = require('../../middlewares/auth');

const router = Router();

router.post(
  '/',
  auth,
  validate(gradeValidate.createGrade),
  gradeController.createNewGrade,
);

router.get('/', auth, gradeController.getGrade);
router.patch(
  '/:gradeId',
  auth,
  validate(gradeValidate.updateGrade),
  gradeController.updateGrade,
);
router.delete(
  '/:gradeId',
  auth,
  validate(gradeValidate.deleteGradeByid),
  gradeController.deleteGrade,
);

module.exports = router;
