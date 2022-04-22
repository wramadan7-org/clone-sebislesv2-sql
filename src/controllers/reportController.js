const httpStatus = require('http-status');
const moment = require('moment');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const paginate = require('../utils/pagination');
const days = require('../utils/day');
const dates = require('../utils/date');

const { User } = require('../models/User');
const { Schedule } = require('../models/Schedule');
const { AvailabilityHours } = require('../models/AvailabilityHours');
const { TeacherSubject } = require('../models/TeacherSubject');
const { Subject } = require('../models/Subject');
const { Grade } = require('../models/Grade');
const { GradeGroup } = require('../models/GradeGroup');
const { Curriculum } = require('../models/Curriculum');
const { Report } = require('../models/Reports');

const reportService = require('../services/reportService');
const scheduleService = require('../services/scheduleService');

const createReport = catchAsync(async (req, res) => {
  const { id } = req.params;
  const reportBody = req.body;

  const checkSchedule = await scheduleService.getScheduleById(id);

  if (!checkSchedule) throw new ApiError(httpStatus.NOT_FOUND, 'Jadwal les tidak ditemukan');

  const dataUser = {
    studentId: checkSchedule.studentId,
    friend1: checkSchedule.friend1,
    friend2: checkSchedule.friend2,
  };

  const convertArray = Object.values(dataUser);

  const mapBody = reportBody.map((o) => {
    if (!convertArray.some((itm) => o.userId.includes(itm))) {
      return false;
    }
    return true;
  });

  if (!mapBody || mapBody.some((itm) => !itm)) throw new ApiError(httpStatus.CONFLICT, 'Hanya dapat membuat raport berdasarkan user di dalam jadwal tersebut.');

  const report = await reportService.createReport(id, reportBody);

  if (!report) throw new ApiError(httpStatus.CONFLICT, 'Gagal menambah raport');

  res.sendWrapped(report, httpStatus.CREATED);
});

// STUDENT

const getOwnListReport = catchAsync(async (req, res) => {
  const { id, role } = req.user;
  let { page, limit } = req.query;

  if (page) {
    page = parseInt(page);
  } else {
    page = 1;
  }

  if (limit) {
    limit = parseInt(limit);
  } else {
    limit = 10;
  }

  const listSchedule = await scheduleService.historySchedule(
    id,
    role,
    {
      include: [
        {
          model: User,
          as: 'teacher',
        },
        {
          model: TeacherSubject,
          include: [
            {
              model: Subject,
            },
          ],
        },
        {
          model: Report,
        },
      ],
    },
  );

  if (!listSchedule) throw new ApiError(httpStatus.NOT_FOUND, 'Belum ada les yang selesai.');

  const mapListSchedule = listSchedule.map((o) => {
    let status;
    let reportId;

    if (o.reports.length <= 0) {
      status = 'Tutor belum mengisi Report';
    } else {
      status = 'Lihat Report Siswa.';
      const ownReport = o.reports.filter((filtering) => filtering.userId == id);
      reportId = ownReport[0].id;
    }

    const data = {
      reportId: reportId ? reportId : null,
      scheduleId: o.id,
      teacherSubjectId: o.teacherSubjectId,
      subjectId: o.teacherSubject.subjectId,
      les: `Les ${o.teacherSubject.subject.subjectName}`,
      profile: o.teacher.profile,
      status,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    };

    return data;
  });

  const sorting = mapListSchedule.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const pagination = paginate.paginator(sorting, page, limit);

  res.sendWrapped(null, httpStatus.OK, pagination);
});

const getReportDetail = catchAsync(async (req, res) => {
  const { id } = req.params;

  const report = await reportService.getReportById(
    id,
    {
      include: [
        {
          model: Schedule,
          include: [
            {
              model: User,
              as: 'teacher',
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
          ],
        },
      ],
    },
  );

  if (!report) throw new ApiError(httpStatus.NOT_FOUND, 'Report tidak ditemukan.');

  const convertDay = days(report.schedule.availabilityHour.dayCode);
  const convertDate = dates(report.schedule.dateSchedule);

  const dataTutor = {
    profile: report.schedule.teacher.profile,
    name: `${report.schedule.teacher.firstName} ${report.schedule.teacher.lastName}`,
    aboutTeacher: `${report.schedule.teacherSubject.subject.subjectName} - ${report.schedule.teacherSubject.grade.gradeGroup.curriculum.curriculumName} - ${report.schedule.teacherSubject.grade.gradeGroup.gradeGroupName} - Kelas ${report.schedule.teacherSubject.grade.gradeCode}`,
  };

  const dataLes = {
    date: `${convertDay}, ${convertDate} | ${report.schedule.availabilityHour.timeStart} - ${report.schedule.availabilityHour.timeEnd}`,
    subject: `${report.schedule.teacherSubject.subject.subjectName} - ${report.schedule.teacherSubject.grade.gradeGroup.gradeGroupName} - Kelas ${report.schedule.teacherSubject.grade.gradeCode}`,
    typeClass: report.schedule.typeClass,
    material: report.schedule.requestMaterial,
    materialImage: report.schedule.imageMaterial,
  };

  const dataReport = {
    presence: report.presence ? parseInt(report.presence) : null,
    connection: report.connection ? parseInt(report.connection) : null,
    understand: report.understand ? parseInt(report.understand) : null,
    master: report.master ? parseInt(report.master) : null,
    complete: report.complete ? parseInt(report.complete) : null,
    conclude: report.conclude ? parseInt(report.conclude) : null,
    conclusion: report.conclusion ? report.conclusion : null,
    internetAppProblem: report.internetAppProblem ? report.internetAppProblem : null,
    mediaAndLearningResources: report.mediaAndLearningResources ? report.mediaAndLearningResources : null,
    etc: report.etc ? report.etc : null,
    isReported: report.isReported ? report.isReported : null,
  };

  const dataResult = {
    reportId: report.id,
    scheduleId: report.schedule.id,
    teacherId: report.schedule.teacherId,
    availabilityHoursId: report.schedule.availabilityHoursId,
    teacherSubjectId: report.schedule.teacherSubjectId,
    subjectId: report.schedule.teacherSubject.subjectId,
    gradeId: report.schedule.teacherSubject.gradeId,
    gradeGroupId: report.schedule.teacherSubject.grade.gradeGroupId,
    curriculumId: report.schedule.teacherSubject.grade.gradeGroup.curriculumId,
    teacher: dataTutor,
    les: dataLes,
    report: dataReport,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
  };

  res.sendWrapped(dataResult, httpStatus.OK);
});

const updateReport = catchAsync(async (req, res) => {
  const { id } = req.params;
  const reportBody = req.body;

  const report = await reportService.getReportById(id);

  if (!report) throw new ApiError(httpStatus.NOT_FOUND, 'Report tidak ditemukan.');

  const data = {
    ...report,
    presence: reportBody.presence ? reportBody.presence.toString() : report.presence.toString(),
    connection: reportBody.connection ? reportBody.connection.toString() : report.connection.toString(),
    understand: reportBody.understand ? reportBody.understand.toString() : report.understand.toString(),
    master: reportBody.master ? reportBody.master.toString() : report.master.toString(),
    complete: reportBody.complete ? reportBody.complete.toString() : report.complete.toString(),
    conclude: reportBody.conclude ? reportBody.conclude.toString() : report.conclude.toString(),
  };

  Object.assign(reportBody, data);

  await reportService.updateReport(id, reportBody);

  const result = {
    ...reportBody.dataValues,
    presence: parseInt(reportBody.presence),
    connection: parseInt(reportBody.connection),
    understand: parseInt(reportBody.understand),
    master: parseInt(reportBody.master),
    complete: parseInt(reportBody.complete),
    conclude: parseInt(reportBody.conclude),
  };

  res.sendWrapped(result, httpStatus.OK);
});

// TUTOR

const getOwnListReportTutor = catchAsync(async (req, res) => {
  const { id } = req.user;
  let { page, limit } = req.query;

  if (page) {
    page = parseInt(page);
  } else {
    page = 1;
  }

  if (limit) {
    limit = parseInt(limit);
  } else {
    limit = 10;
  }

  const schedule = await scheduleService.getOwnScheduleTutor(
    id,
    {
      include: [
        {
          model: TeacherSubject,
          include: [
            {
              model: Subject,
            },
          ],
        },
        {
          model: Report,
        },
      ],
    },
  );

  const mapSchedule = schedule.map((o) => {
    const data = {
      scheduleId: o.id,
      teacherSubjectId: o.teacherSubjectId,
      subjectId: o.teacherSubject.subjectId,
      subject: `Les ${o.teacherSubject.subject.subjectName}`,
      isReported: (o.reports && o.reports.length > 0) ? true : false,
      status: (o.reports && o.reports.length > 0) ? 'Report sudah dikirim' : 'Anda belum mengirim report',
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    };

    return data;
  });

  const sorting = mapSchedule.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const pagination = paginate.paginator(sorting, page, limit);

  res.sendWrapped(null, httpStatus.OK, pagination);
});

const getDetailReportTutor = catchAsync(async (req, res) => {
  const { id } = req.params;

  const schedule = await scheduleService.getScheduleById(
    id,
    {
      include: [
        {
          model: User,
          as: 'student',
        },
        {
          model: User,
          as: 'firstFriend',
        },
        {
          model: User,
          as: 'secondFriend',
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
          model: Report,
        },
      ],
    },
  );

  if (!schedule) throw new ApiError(httpStatus.NOT_FOUND, 'Jadwal tidak ditemukan.');

  const convertDay = days(schedule.availabilityHour.dayCode);
  const convertDate = dates(schedule.dateSchedule);

  let arrayUser = [
    {
      userId: schedule.studentId,
      userName: `${schedule.student.firstName} ${schedule.student.lastName}`,
    },
    {
      userId: schedule.friend1 ? schedule.friend1 : null,
      userName: schedule.friend1 ? `${schedule.firstFriend.firstName} ${schedule.firstFriend.firstName}` : null,
    },
    {
      userId: schedule.friend2 ? schedule.friend2 : null,
      userName: schedule.friend2 ? `${schedule.secondFriend.firstName} ${schedule.secondFriend.lastName}` : null,
    },
  ];

  arrayUser = arrayUser.filter((o) => o.userId);

  const dataSchedule = {
    scheduleId: schedule.id,
    teacherSubjectId: schedule.teacherSubjectId,
    subjectId: schedule.teacherSubject.subjectId,
    gradeId: schedule.teacherSubject.gradeId,
    gradeGroupId: schedule.teacherSubject.grade.gradeGroupId,
    curriculumId: schedule.teacherSubject.grade.gradeGroup.curriculumId,
    subject: `Les ${schedule.teacherSubject.subject.subjectName}`,
    date: `${convertDay}, ${convertDate}`,
    grade: `${schedule.teacherSubject.grade.gradeGroup.curriculum.curriculumName} - Kelas ${schedule.teacherSubject.grade.gradeCode} - Kelas ${schedule.typeClass}`,
    time: `${schedule.availabilityHour.timeStart} - ${schedule.availabilityHour.timeEnd}`,
    isReported: (schedule.reports && schedule.reports.length > 0) ? true : false,
    user: arrayUser,
    report: schedule.reports,
    createdAt: schedule.createdAt,
    updatedAt: schedule.updatedAt,
  };

  res.sendWrapped(dataSchedule, httpStatus.OK);
});

module.exports = {
  createReport,
  getOwnListReport,
  getReportDetail,
  updateReport,
  getOwnListReportTutor,
  getDetailReportTutor,
};
