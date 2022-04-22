const { Router } = require('express');
const validate = require('../../middlewares/validate');
const subjectValidate = require('../../validations/subjectValidation');
const subjectController = require('../../controllers/subjectController');
const auth = require('../../middlewares/auth');

const router = Router();

router.post(
  '/',
  auth,
  validate(subjectValidate.createSubject),
  subjectController.createNewSubject,
);

router.get('/', auth, subjectController.getSubject);
router.patch(
  '/:subjectId',
  auth,
  validate(subjectValidate.updateSubject),
  subjectController.updateSubject,
);
router.delete(
  '/:subjectId',
  auth,
  validate(subjectValidate.deleteSubject),
  subjectController.deleteSubject,
);

module.exports = router;
