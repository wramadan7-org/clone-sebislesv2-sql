const { sequelize } = require('../config/database');
const { User } = require('./User');
const { UserDetail } = require('./UserDetail');
const { School } = require('./School');
const { Role } = require('./Role');
const { Cart } = require('./Cart');
const { CartItem } = require('./CartItem');
const { Price } = require('./Price');
const { TeachingExperience } = require('./TeachingExperience');
const { TeachingExperienceDetail } = require('./TeachingExperienceDetail');
const { EducationBackground } = require('./EducationBackground');
const { File } = require('./Files');
const { Curriculum } = require('./Curriculum');
const { Grade } = require('./Grade');
const { GradeGroup } = require('./GradeGroup');
const { Subject } = require('./Subject');
const { TeacherSubject } = require('./TeacherSubject');
const { AvailabilityHours } = require('./AvailabilityHours');
const { ReferralHistory } = require('./ReferralHistory');
const { Device } = require('./Device');
const { Bank } = require('./Bank');
const { Reference } = require('./Reference');
const { Schedule } = require('./Schedule');
const { Wishlist } = require('./Wishlist');
const { WishlistItem } = require('./WishlistItem');
const { TutoringTransaction } = require('./TutoringTransaction');
const { TutoringTransactionDetail } = require('./TutoringTransactionDetail');
const { TopupCoin } = require('./TopupCoin');
const { TransactionCoin } = require('./TransactionCoin');
const { FavoriteTeacher } = require('./FavoriteTeacher');
const { Report } = require('./Reports');
const { Message } = require('./Message');
const { ReviewTutor } = require('./ReviewTutor');
const { RatingTutor } = require('./RatingTutor');
const { Duration } = require('./Duration');
const { WithdrawBalance } = require('./WithdrawBalance');
const { Room } = require('./Room');
const { Reason } = require('./Reason');
const { AttendanceTeacher } = require('./AttendanceTeacher');
const { AssessmentTeacher } = require('./AssessmentTeacher');
const { InterviewQuestion } = require('./InterviewReport');

const setupSequelizeAssociations = async () => {
  User.belongsTo(Role);

  User.belongsTo(School);

  // User.hasOne(Cart, {
  //   foreignKey: 'studentId',
  // });
  User.hasOne(UserDetail);

  UserDetail.belongsTo(User);

  UserDetail.belongsTo(Price);

  Price.hasOne(UserDetail);

  School.hasMany(User);

  Role.hasMany(User);

  Cart.belongsTo(User, {
    foreignKey: 'studentId',
    as: 'student',
  });

  User.hasOne(Cart, {
    foreignKey: 'studentId',
  });

  Cart.belongsTo(User, {
    foreignKey: 'teacherId',
    as: 'teacher',
  });

  User.hasOne(Cart, {
    foreignKey: 'teacherId',
  });

  CartItem.belongsTo(Cart, {
    foreignKey: 'cartId',
  });

  Cart.hasMany(CartItem, {
    foreignKey: 'cartId',
  });

  CartItem.belongsTo(User, {
    foreignKey: 'teacherId',
    as: 'teacher',
  });

  User.hasMany(CartItem, {
    foreignKey: 'teacherId',
  });

  CartItem.belongsTo(TeacherSubject, {
    foreignKey: 'teacherSubjectId',
  });

  TeacherSubject.hasMany(CartItem, {
    foreignKey: 'teacherSubjectId',
  });

  CartItem.belongsTo(AvailabilityHours, {
    foreignKey: 'availabilityHoursId',
  });

  AvailabilityHours.hasMany(CartItem, {
    foreignKey: 'availabilityHoursId',
  });

  User.hasMany(TeachingExperience, {
    foreignKey: 'teacherId',
  });

  TeachingExperience.belongsTo(User, {
    foreignKey: 'teacherId',
  });

  TeachingExperience.hasMany(TeachingExperienceDetail, {
    foreignKey: 'teachingExperienceId',
  });

  TeachingExperienceDetail.belongsTo(TeachingExperience, {
    foreignKey: 'teachingExperienceId',
  });

  User.hasMany(EducationBackground, {
    foreignKey: 'teacherId',
  });

  EducationBackground.belongsTo(User, {
    foreignKey: 'teacherId',
  });

  User.hasMany(File, {
    foreignKey: 'userId',
  });

  File.belongsTo(User, {
    foreignKey: 'userId',
  });

  Curriculum.hasMany(GradeGroup, {
    foreignKey: 'curriculumId',
  });

  GradeGroup.belongsTo(Curriculum, {
    foreignKey: 'curriculumId',
  });

  GradeGroup.hasMany(Grade, {
    foreignKey: 'gradeGroupId',
  });

  Grade.belongsTo(GradeGroup, {
    foreignKey: 'gradeGroupId',
  });

  Subject.hasMany(TeacherSubject, {
    foreignKey: 'subjectId',
  });

  TeacherSubject.belongsTo(Subject, {
    foreignKey: 'subjectId',
  });

  Grade.hasMany(TeacherSubject, {
    foreignKey: 'gradeId',
  });

  TeacherSubject.belongsTo(Grade, {
    foreignKey: 'gradeId',
  });

  User.hasMany(TeacherSubject, {
    foreignKey: 'teacherId',
  });

  TeacherSubject.belongsTo(User, {
    foreignKey: 'teacherId',
    as: 'teacher',
  });

  User.hasMany(AvailabilityHours, {
    foreignKey: 'teacherId',
  });

  AvailabilityHours.belongsTo(User, {
    foreignKey: 'teacherId',
    as: 'teacher',
  });

  User.belongsTo(User, {
    foreignKey: 'referredBy',
    as: 'referrerUser',
  });

  User.hasMany(User, {
    foreignKey: 'referredBy',
    as: 'referredUsers',
  });

  User.hasOne(ReferralHistory, {
    foreignKey: 'userId',
  });

  ReferralHistory.belongsTo(User, {
    foreignKey: 'userId',
    as: 'referencedTo',
  });

  User.hasOne(ReferralHistory, {
    foreignKey: 'referredBy',
  });

  ReferralHistory.belongsTo(User, {
    foreignKey: 'referredBy',
    as: 'referencedBy',
  });

  User.hasMany(Device, {
    foreignKey: 'userId',
  });

  Device.belongsTo(User, {
    foreignKey: 'userId',
  });

  User.hasMany(Bank, {
    foreignKey: 'userId',
  });

  Bank.belongsTo(User, {
    foreignKey: 'userId',
  });

  User.hasMany(Reference, {
    foreignKey: 'userRefer',
  });

  Reference.belongsTo(User, {
    foreignKey: 'userRefer',
  });

  User.hasMany(Schedule, {
    foreignKey: 'teacherId',
    as: 'schedule',
  });

  User.hasMany(Schedule, {
    foreignKey: 'studentId',
  });

  Schedule.belongsTo(User, {
    foreignKey: 'teacherId',
    as: 'teacher',
  });

  Schedule.belongsTo(User, {
    foreignKey: 'studentId',
    as: 'student',
  });

  TeacherSubject.hasMany(Schedule, {
    foreignKey: 'teacherSubjectId',
  });

  Schedule.belongsTo(TeacherSubject, {
    foreignKey: 'teacherSubjectId',
  });

  AvailabilityHours.hasMany(Schedule, {
    foreignKey: 'availabilityHoursId',
  });

  Schedule.belongsTo(AvailabilityHours, {
    foreignKey: 'availabilityHoursId',
  });

  Wishlist.belongsTo(User, {
    foreignKey: 'studentId',
    as: 'student',
  });

  User.hasMany(Wishlist, {
    foreignKey: 'studentId',
  });

  Wishlist.belongsTo(User, {
    foreignKey: 'teacherId',
    as: 'teacher',
  });

  User.hasMany(Wishlist, {
    foreignKey: 'teacherId',
  });

  WishlistItem.belongsTo(Wishlist, {
    foreignKey: 'wishlistId',
  });

  Wishlist.hasMany(WishlistItem, {
    foreignKey: 'wishlistId',
  });

  WishlistItem.belongsTo(User, {
    foreignKey: 'teacherId',
    as: 'teacher',
  });

  User.hasMany(WishlistItem, {
    foreignKey: 'teacherId',
  });

  WishlistItem.belongsTo(TeacherSubject, {
    foreignKey: 'teacherSubjectId',
  });

  TeacherSubject.hasMany(WishlistItem, {
    foreignKey: 'teacherSubjectId',
  });

  WishlistItem.belongsTo(AvailabilityHours, {
    foreignKey: 'availabilityHoursId',
  });

  AvailabilityHours.hasMany(WishlistItem, {
    foreignKey: 'availabilityHoursId',
  });

  TutoringTransaction.belongsTo(User, {
    foreignKey: 'studentId',
  });

  User.hasMany(TutoringTransaction, {
    foreignKey: 'studentId',
  });

  TutoringTransactionDetail.belongsTo(Schedule, {
    foreignKey: 'scheduleId',
  });

  Schedule.hasMany(TutoringTransactionDetail, {
    foreignKey: 'scheduleId',
  });

  TutoringTransactionDetail.belongsTo(TutoringTransaction, {
    foreignKey: 'tutoringTransactionId',
  });

  TutoringTransaction.hasMany(TutoringTransactionDetail, {
    foreignKey: 'tutoringTransactionId',
  });

  TopupCoin.belongsTo(User, {
    foreignKey: 'userId',
  });

  User.hasMany(TopupCoin, {
    foreignKey: 'userId',
  });

  TransactionCoin.belongsTo(TopupCoin, {
    foreignKey: 'order_id',
  });

  TopupCoin.hasMany(TransactionCoin, {
    foreignKey: 'order_id',
  });

  FavoriteTeacher.belongsTo(User, {
    foreignKey: 'studentId',
    as: 'student',
  });

  User.hasMany(FavoriteTeacher, {
    foreignKey: 'studentId',
  });

  FavoriteTeacher.belongsTo(User, {
    foreignKey: 'teacherId',
    as: 'teacher',
  });

  User.hasMany(FavoriteTeacher, {
    foreignKey: 'teacherId',
  });

  Report.belongsTo(User, {
    foreignKey: 'userId',
  });

  User.hasMany(Report, {
    foreignKey: 'userId',
  });

  Report.belongsTo(Schedule, {
    foreignKey: 'scheduleId',
  });

  Schedule.hasMany(Report, {
    foreignKey: 'scheduleId',
  });

  CartItem.belongsTo(User, {
    foreignKey: 'friend1',
    as: 'firstFriend',
  });

  User.hasOne(CartItem, {
    foreignKey: 'friend1',
  });

  CartItem.belongsTo(User, {
    foreignKey: 'friend2',
    as: 'secondFriend',
  });

  User.hasOne(CartItem, {
    foreignKey: 'friend2',
  });

  Schedule.belongsTo(User, {
    foreignKey: 'friend1',
    as: 'firstFriend',
  });

  User.hasOne(Schedule, {
    foreignKey: 'friend1',
  });

  Schedule.belongsTo(User, {
    foreignKey: 'friend2',
    as: 'secondFriend',
  });

  User.hasOne(Schedule, {
    foreignKey: 'friend2',
  });

  Message.belongsTo(User, {
    foreignKey: 'senderId',
    as: 'sender',
  });

  User.hasMany(Message, {
    foreignKey: 'senderId',
  });

  Message.belongsTo(User, {
    foreignKey: 'recipientId',
    as: 'recipient',
  });

  User.hasMany(Message, {
    foreignKey: 'recipientId',
  });

  User.hasMany(ReviewTutor, {
    foreignKey: 'tutorId',
    as: 'teacher',
  });

  User.hasMany(ReviewTutor, {
    foreignKey: 'studentId',
    as: 'student',
  });

  ReviewTutor.belongsTo(User, {
    foreignKey: 'tutorId',
    as: 'teacher',
  });

  ReviewTutor.belongsTo(User, {
    foreignKey: 'studentId',
    as: 'student',
  });

  User.hasOne(RatingTutor, {
    foreignKey: 'tutorId',
  });
  RatingTutor.belongsTo(User, {
    foreignKey: 'tutorId',
  });

  Schedule.hasMany(ReviewTutor);

  ReviewTutor.belongsTo(Schedule);

  Duration.hasOne(AvailabilityHours, {
    foreignKey: 'durationId',
  });

  AvailabilityHours.belongsTo(Duration, {
    foreignKey: 'durationId',
  });

  User.hasMany(WithdrawBalance, {
    foreignKey: 'teacherId',
  });
  WithdrawBalance.belongsTo(User, {
    foreignKey: 'teacherId',
  });

  Bank.hasMany(WithdrawBalance);

  WithdrawBalance.belongsTo(Bank);

  Room.belongsTo(Schedule, {
    foreignKey: 'scheduleId',
  });

  Schedule.hasOne(Room, {
    foreignKey: 'scheduleId',
  });

  Reason.belongsTo(Schedule, {
    foreignKey: 'scheduleId',
  });

  Schedule.hasOne(Reason, {
    foreignKey: 'scheduleId',
  });

  Reason.belongsTo(CartItem, {
    foreignKey: 'cartItemId',
  });

  CartItem.hasOne(Reason, {
    foreignKey: 'cartItemId',
  });

  User.hasMany(AttendanceTeacher, {
    foreignKey: 'teacherId',
  });

  AttendanceTeacher.belongsTo(User, {
    foreignKey: 'teacherId',
    as: 'teacher',
  });

  Schedule.hasMany(AttendanceTeacher);
  AttendanceTeacher.belongsTo(Schedule);

  AssessmentTeacher.belongsTo(User, {
    foreignKey: 'userId',
  });

  User.hasOne(AssessmentTeacher, {
    foreignKey: 'userId',
  });

  InterviewQuestion.belongsTo(User, {
    foreignKey: 'userId',
  });

  User.hasOne(InterviewQuestion, {
    foreignKey: 'userId',
  });

  TopupCoin.belongsTo(User, {
    foreignKey: 'referralCode',
  });

  User.hasOne(TopupCoin, {
    foreignKey: 'referralCode',
  });

  // finally sync sequelize
  // await sequelize.sync();
};

module.exports = setupSequelizeAssociations;
