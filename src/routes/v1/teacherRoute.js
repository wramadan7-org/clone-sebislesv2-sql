const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userDetailValidation = require('../../validations/userDetailValidation');
const userProfileValidation = require('../../validations/userProfileValidation');
const { teacher } = require('../../middlewares/roleValidation');
const teacherController = require('../../controllers/teacherController');
const cartController = require('../../controllers/cartController');
const cartValidation = require('../../validations/cartValidation');
const fileValidation = require('../../validations/fileValidation');
const adminController = require('../../controllers/adminController');
const scheduleController = require('../../controllers/scheduleController');

const router = express.Router();

router.post(
  '/profile',
  auth,
  teacher,
  validate(userDetailValidation.createUserDetail),
  teacherController.createdUserDetail,
);
router.get('/profile', auth, teacher, teacherController.getUserDetail);
router.patch(
  '/profile',
  auth,
  teacher,
  validate(userDetailValidation.updateUserDetail),
  teacherController.updateUserdetail,
);
router.delete('/profile', auth, teacher, teacherController.deleteUserDetail);
router.get('/profile-info', auth, teacher, teacherController.profileInfo);

router.patch(
  '/profile/basic-info',
  auth,
  teacher,
  validate(userProfileValidation.basicInfo),
  teacherController.createBasicInfo,
);
router.patch(
  '/profile/personal-data',
  auth,
  teacher,
  validate(userProfileValidation.personalData),
  teacherController.createPersonalData,
);

router.post(
  '/profile/teaching-experience',
  auth,
  teacher,
  teacherController.createTeachingExperience,
);
router.patch(
  '/profile/teaching-experience/:teachingExperienceId',
  auth,
  teacher,
  teacherController.updateTeachingExperience,
);
router.delete(
  '/profile/teaching-experience/:teachingExperienceId',
  auth,
  teacher,
  teacherController.deleteTeachingExperience,
);
router.delete(
  '/profile/teaching-experience/:teachingExperienceId/:teachingExperienceDetailId',
  auth,
  teacher,
  teacherController.deleteTeachingExperienceDetail,
);

router.post(
  '/profile/education-background',
  auth,
  teacher,
  teacherController.createEducationBackground,
);
router.patch(
  '/profile/education-background/:educationBackgroundId',
  auth,
  teacher,
  teacherController.updateEducationBackground,
);
router.delete(
  '/profile/education-background/:educationBackgroundId',
  auth,
  teacher,
  teacherController.deleteEducationBackground,
);

router.patch(
  '/profile/file-profile',
  auth,
  teacher,
  validate(fileValidation.createFileProfile),
  teacherController.createdFilesProfile,
);
router.patch(
  '/profile/file-ktp',
  auth,
  teacher,
  validate(fileValidation.createFileKTP),
  teacherController.createFileKTP,
);
router.patch(
  '/profile/file-npwp',
  auth,
  teacher,
  validate(fileValidation.createFileNPWP),
  teacherController.createFileNPWP,
);
router.patch(
  '/profile/file-cv',
  auth,
  teacher,
  validate(fileValidation.createFileCV),
  teacherController.createFileCV,
);
// /profile/teaching-experience [CRUD, no pagination]
// /profile/education-background [CRUD, no pagination]

router.get(
  '/order-list',
  auth,
  teacher,
  validate(cartValidation.getCart),
  scheduleController.orderList,
);
router.patch(
  '/order-list/:cartItemId',
  auth,
  teacher,
  validate(cartValidation.statusCart),
  cartController.approvingOrder,
);

// kehadiran tutor
router.post('/attendance', auth, teacher, adminController.createAttendance);

module.exports = router;
