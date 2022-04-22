const express = require('express');
const schoolController = require('../../controllers/schoolController');
const validate = require('../../middlewares/validate');
const schoolValidation = require('../../validations/schoolValidation');
const auth = require('../../middlewares/auth');
const { student, administrator } = require('../../middlewares/roleValidation');

const router = express.Router();

router.post(
  '/',
  auth,
  (student, administrator),
  validate(schoolValidation.createSchool),
  schoolController.createSchool,
);
router.get('/', auth, schoolController.getSchool);
router.patch('/', auth, administrator, schoolController.updateSchool);
router.delete('/', auth, administrator, schoolController.deleteSchool);
module.exports = router;
