const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const date = require('../utils/date');
const day = require('../utils/day');

const userService = require('../services/userService');
const scheduleService = require('../services/scheduleService');

const { UserDetail } = require('../models/UserDetail');
const { User } = require('../models/User');
const { TeacherSubject } = require('../models/TeacherSubject');
const { Subject } = require('../models/Subject');
const { Grade } = require('../models/Grade');
const { GradeGroup } = require('../models/GradeGroup');
const { Curriculum } = require('../models/Curriculum');
const { AvailabilityHours } = require('../models/AvailabilityHours');
const { Room } = require('../models/Room');

const {
  PENDING, ACCEPT, PROCESS, CANCEL, EXPIRE, DONE,
} = process.env;

const home = catchAsync(async (req, res) => {
  const { id } = req.user;

  const serverHost = req.get('host').split(':')[0] == 'localhost' ? `http://${req.get('host')}` : `https://${req.get('host')}`;

  const user = await userService.getUserById(
    id,
    {
      include: [
        {
          model: UserDetail,
        },
      ],
    },
  );

  const schedules = await scheduleService.getOwnScheduleTutorWithStatus(
    id,
    [ACCEPT],
    {
      include: [
        {
          model: User,
          as: 'student',
        },
        {
          model: TeacherSubject,
          include: [
            {
              model: Subject,
            },
            {
              model: Grade,
              include: {
                model: GradeGroup,
                include: {
                  model: Curriculum,
                },
              },
            },
          ],
        },
        {
          model: AvailabilityHours,
        },
        {
          model: Room,
        },
      ],
    },
  );

  let newSchedule = 0;
  let processSchedule = 0;
  let arrayResults = [];

  if (schedules && schedules.length > 0) {
    const filterNewSchedule = schedules.filter((o) => o.statusSchedule === PENDING);
    newSchedule = filterNewSchedule.length;

    const filterProcessSchedule = schedules.filter((o) => o.statusSchedule === ACCEPT);
    processSchedule = filterProcessSchedule.length;

    const filterFiveMntBeforeLes = schedules.filter((o) => o.statusSchedule === ACCEPT && o.room && o.room.isActive === true);

    for (const schedule of schedules) {
      const convertDay = day(schedule.availabilityHour.dayCode);
      const convertDate = date(schedule.dateSchedule);

      const dataSchedule = {
        scheduleId: schedule.id,
        userId: schedule.studentId,
        teacherSubjectId: schedule.teacherSubjectId,
        subjectId: schedule.teacherSubject.subjectId,
        gradeId: schedule.teacherSubject.gradeId,
        gradeGroupId: schedule.teacherSubject.grade.gradeGroupId,
        curriculumId: schedule.teacherSubject.grade.gradeGroup.curriculumId,
        profile: schedule.student.profile,
        name: `${schedule.student.firstName} ${schedule.student.lastName}`,
        subject: `Les ${schedule.teacherSubject.subject.subjectName}`,
        grade: `${schedule.teacherSubject.grade.gradeGroup.gradeGroupName} - Kelas ${schedule.teacherSubject.grade.gradeCode}`,
        typeClass: (schedule.typeClass && schedule.typeClass === 'private') ? 'Kelas Private' : 'Kelas Group',
        date: `${convertDay}, ${convertDate}`,
        time: `${schedule.availabilityHour.timeStart} - ${schedule.availabilityHour.timeEnd}`,
        roomLink: schedule.room ? `${serverHost}/v1/schedule/enter-less/tutor/${id}/${schedule.room.meetingId}` : null,
        isActive: schedule.room ? schedule.room.isActive : false,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt,
      };

      arrayResults.push(dataSchedule);
    }
  }

  const data = {
    userId: user.id,
    name: user.firstName,
    profile: user.profile,
    referralCode: user.referralCode,
    saldo: user.coin,
    newSchedule,
    processSchedule,
    schedules: arrayResults,
  };

  res.sendWrapped(data, httpStatus.OK);
});

module.exports = {
  home,
};
