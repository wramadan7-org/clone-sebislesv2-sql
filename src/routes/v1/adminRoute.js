const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const adminController = require('../../controllers/adminController');
const {
  student,
  teacher,
  verifikator,
  finance,
  admin,
  administrator,
} = require('../../middlewares/roleValidation');

const router = express.Router();

router.get(
  '/pesanan-kelas',
  auth,
  (admin, administrator),
  adminController.getPesanan,
);
router.get(
  '/list-siswa',
  auth,
  (admin, administrator),
  adminController.getSiswa,
);
router.get(
  '/list-report',
  auth,
  (admin, administrator),
  adminController.getReport,
);
router.get(
  '/report-teacher-student',
  auth,
  (admin, administrator),
  adminController.reportTutorSiswa,
);

router.post(
  '/teacher-attendance',
  auth,
  teacher,
  adminController.createAttendance,
);

router.get(
  '/teacher-attendance',
  auth,
  (admin, administrator),
  adminController.getAttendance,
);

router.get('/kelas-akan-berlangsung', auth, adminController.kelasBerlangsung);
router.get('/teacher-review', auth, adminController.ratingTutor);
router.get('/teacher-detail-class', auth, adminController.detailKelasTutor);
router.get('/teacher-class', auth, adminController.kelasTutor);

module.exports = router;
