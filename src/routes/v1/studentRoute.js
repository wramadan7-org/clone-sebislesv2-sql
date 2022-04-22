const express = require('express');
const auth = require('../../middlewares/auth');
const { student } = require('../../middlewares/roleValidation');
const studentController = require('../../controllers/studentController');
const teacherController = require('../../controllers/teacherController');
const validate = require('../../middlewares/validate');
const userProfileValidation = require('../../validations/userProfileValidation');
const fileValidation = require('../../validations/fileValidation');
// const cartController = require('../../controllers/cartController');

const router = express.Router();

// router.get('/cart', auth, student, cartController.viewCart);
// router.post('/cart', auth, student, cartController.addCart);
router.get(
  '/profile',
  auth,
  student,
  studentController.getCurrentStudentProfile,
);

router.patch(
  '/profile',
  auth,
  student,
  validate(userProfileValidation.updateProfile),
  studentController.updateCurrentStudentProfie,
);

router.patch(
  '/profile/file-profile',
  auth,
  student,
  validate(fileValidation.createFileProfile),
  studentController.createdFilesProfile,
);

router.get(
  '/profile/tutor-info/:id',
  auth,
  validate(userProfileValidation.teacherById),
  teacherController.teacherById,
);

module.exports = router;
