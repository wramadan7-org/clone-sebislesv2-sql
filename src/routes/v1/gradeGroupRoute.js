const { Router } = require('express');
const validate = require('../../middlewares/validate');
const gradeGroupValidate = require('../../validations/gradeGroupValidation');
const gradeGroupController = require('../../controllers/gradeGroupController');
const auth = require('../../middlewares/auth');

const router = Router();

router.post(
  '/',
  auth,
  validate(gradeGroupValidate.createGradeGroup),
  gradeGroupController.createNewGradeGroup,
);

router.get('/', auth, gradeGroupController.getGradeGroupAll);
router.get(
  '/:gradeGroupId',
  auth,
  validate(gradeGroupValidate.getGradeGroupById),
  gradeGroupController.gradeGroupById,
);
router.patch(
  '/:gradeGroupId',
  auth,
  validate(gradeGroupValidate.updateGradeGroup),
  gradeGroupController.updateGradeGroup,
);
router.delete(
  '/:gradeGroupId',
  auth,
  validate(gradeGroupValidate.deleteGradeGroupByid),
  gradeGroupController.deleteGradeGroup,
);

module.exports = router;
