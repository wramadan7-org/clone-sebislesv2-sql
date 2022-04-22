const express = require('express');
const cron = require('node-cron');
const authRoute = require('./authRoute');
const profileRoute = require('./profileRoute');
const schoolRoute = require('./schoolRoute');
const teacherRoute = require('./teacherRoute');
const referralRoute = require('./referralRoute');
const availabilityHoursRoute = require('./availabilityHoursRoute');
const curriculumRoute = require('./curriculumRoute');
const referralHistoryRoute = require('./referralHistoryRoute');
const gradeGroupRoute = require('./gradeGroupRoute');
const gradeRoute = require('./gradeRoute');
const subjectRoute = require('./subjectRoute');
const teacherSubjectRoute = require('./teacherSubjectRoute');
const migrationRoute = require('./migrateRoute');
const cartRoute = require('./cartRoute');
const bankRoute = require('./bankRoute');
const referenceRoute = require('./referenceRoute');
const publicRoute = require('./publicRoute');
const scheduleRoute = require('./scheduleRoute');
const wishlistRoute = require('./wishlistRoute');
const priceRoute = require('./priceRoute');
const tutoringTransactionRoute = require('./tutoringTransactionRoute');
const transactionCoinRoute = require('./transactionCoinRoute');
const topupCoinRouter = require('./topupCoinRoute');
const coinRoute = require('./coinRoute');
const studentRoute = require('./studentRoute');
const favoriteTeacherRoute = require('./favoriteTeacherRoute');
const sliderRoute = require('./sliderRoute');
const reportRoute = require('./reportRoute');
const filterRoute = require('./filterRoute');
const chatRoute = require('./chatRoute');
const reviewTutorRoute = require('./reviewTutorRoute');
const homeRoute = require('./homeRoute');
const rootRoute = require('./rootRoute');
const durationRoute = require('./durationRoute');
const withdrawBalanceRoute = require('./withdrawBalanceRoute');
const adminRoute = require('./adminRoute');
const reasonRoute = require('./reasonRoute');
const verifikatorRoute = require('./verifikatorRoute');
const deviceRoute = require('./deviceRoute');

const statusController = require('../../controllers/statusController');
const cronController = require('../../controllers/cronController');

const router = express.Router();

cron.schedule('* * * * *', cronController.cronJobCartPendingTwoHoursBeforeLes);
cron.schedule('* * * * *', cronController.cronJobExpireScheduleLes);
cron.schedule('* * * * *', cronController.cronJobDeleteVectera);
cron.schedule('* * * * *', cronController.cronJobReminderLess);

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/profile',
    route: profileRoute,
  },
  {
    path: '/school',
    route: schoolRoute,
  },
  {
    path: '/student',
    route: studentRoute,
  },
  {
    path: '/teacher',
    route: teacherRoute,
  },
  {
    path: '/referral',
    route: referralRoute,
  },
  {
    path: '/availability-hours',
    route: availabilityHoursRoute,
  },
  {
    path: '/curriculum',
    route: curriculumRoute,
  },
  {
    path: '/referral/history',
    route: referralHistoryRoute,
  },
  {
    path: '/grade-group',
    route: gradeGroupRoute,
  },
  {
    path: '/grade',
    route: gradeRoute,
  },
  {
    path: '/subjectes',
    route: subjectRoute,
  },
  {
    path: '/teacher-subject',
    route: teacherSubjectRoute,
  },
  {
    path: '/migrate',
    route: migrationRoute,
  },
  {
    path: '/cart',
    route: cartRoute,
  },
  {
    path: '/bank',
    route: bankRoute,
  },
  {
    path: '/reference',
    route: referenceRoute,
  },
  {
    path: '/public',
    route: publicRoute,
  },
  {
    path: '/schedule',
    route: scheduleRoute,
  },
  {
    path: '/wishlist',
    route: wishlistRoute,
  },
  {
    path: '/price',
    route: priceRoute,
  },
  {
    path: '/tutoring-transaction',
    route: tutoringTransactionRoute,
  },
  {
    path: '/transaction-coin',
    route: transactionCoinRoute,
  },
  {
    path: '/topup-coin',
    route: topupCoinRouter,
  },
  {
    path: '/coin',
    route: coinRoute,
  },
  {
    path: '/favorite-teacher',
    route: favoriteTeacherRoute,
  },
  {
    path: '/slider',
    route: sliderRoute,
  },
  {
    path: '/report',
    route: reportRoute,
  },
  {
    path: '/filter',
    route: filterRoute,
  },
  {
    path: '/message',
    route: chatRoute,
  },
  {
    path: '/review-tutor',
    route: reviewTutorRoute,
  },
  {
    path: '/home',
    route: homeRoute,
  },
  {
    path: '/duration',
    route: durationRoute,
  },
  {
    path: '/reason',
    route: reasonRoute,
  },
  {
    path: '/',
    route: rootRoute,
  },
  {
    path: '/withdraw',
    route: withdrawBalanceRoute,
  },
  {
    path: '/admin',
    route: adminRoute,
  },
  {
    path: '/verifikator',
    route: verifikatorRoute,
  },
  {
    path: '/device',
    route: deviceRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
  router.patch('/update-status/:id', statusController.updateStatus);
});

module.exports = router;
