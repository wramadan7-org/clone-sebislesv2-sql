const { Router } = require('express');
const migrateController = require('../../controllers/migrateController');
const validate = require('../../middlewares/validate');
// const migrateValidation = require('../../validations/migrateValidation')
const router = Router();

router.get('/', migrateController.listUser);
router.post('/user', migrateController.addUser);
router.post('/user-detail', migrateController.addUserDetail);
router.post('/user-teaching-experience', migrateController.addTeachingExperiences);
router.post('/user-education-background', migrateController.addEducationBackground);
router.post('/user-bank-account', migrateController.addBank);
router.post('/user-device', migrateController.addDevice);
router.post('/user-subject', migrateController.addSubject);
router.post('/user-grade-group', migrateController.addGradeGroup);
router.post('/user-availability-hours', migrateController.addAvailabilityHours);
router.post('/user-teacher-subject', migrateController.addTeacherSubjects);
router.post('/user-price', migrateController.addPrice);

module.exports = router;
