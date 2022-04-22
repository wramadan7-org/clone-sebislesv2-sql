const { Op } = require('sequelize');
const httpStatus = require('http-status');
const { Schedule } = require('../models/Schedule');
const { Subject } = require('../models/Subject');
const { TeacherSubject } = require('../models/TeacherSubject');
const { User } = require('../models/User');
const { Role } = require('../models/Role');
const { Report } = require('../models/Reports');
const { AttendanceTeacher } = require('../models/AttendanceTeacher');
const ApiError = require('../utils/ApiError');
const { ReviewTutor } = require('../models/ReviewTutor');
const { AvailabilityHours } = require('../models/AvailabilityHours');
const { Grade } = require('../models/Grade');
const { RatingTutor } = require('../models/RatingTutor');

const getAllPesananKelas = async (limit, offset) => {
  const pesanan = await Schedule.findAndCountAll({
    limit,
    offset,
    include: [
      {
        model: User,
        as: 'student',
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: User,
        as: 'teacher',
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: TeacherSubject,
        attributes: ['gradeId', 'subjectId'],
        include: [
          { model: Subject, attributes: ['subjectName', 'subJectCode'] },
        ],
      },
    ],
  });
  return pesanan;
};

const getPesananKelas = async (
  statusSchedule,
  startDate,
  endDate,
  limit,
  query,
) => {
  const pesanan = await Schedule.findAndCountAll({
    where: {
      statusSchedule,
      dateSchedule: {
        [Op.between]: [startDate, endDate],
      },
    },
    limit,
    query,
    include: [
      {
        model: User,
        as: 'student',
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: User,
        as: 'teacher',
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: TeacherSubject,
        attributes: ['gradeId', 'subjectId'],
        include: [
          { model: Subject, attributes: ['subjectName', 'subJectCode'] },
        ],
      },
    ],
  });
  return pesanan;
};
const getPesananKelasOnlyDateRange = async (
  startDate,
  endDate,
  limit,
  query,
) => {
  const pesanan = await Schedule.findAndCountAll({
    where: {
      dateSchedule: {
        [Op.between]: [startDate, endDate],
      },
    },
    limit,
    query,
    include: [
      {
        model: User,
        as: 'student',
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: User,
        as: 'teacher',
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: TeacherSubject,
        attributes: ['gradeId', 'subjectId'],
        include: [
          { model: Subject, attributes: ['subjectName', 'subJectCode'] },
        ],
      },
    ],
  });
  return pesanan;
};

const getSiswaBy = async (keyword) => {
  const { id } = await Role.findOne({
    where: {
      roleName: 'student',
    },
  });

  const siswa = await User.findAll({
    where: {
      roleId: id,
      [Op.or]: {
        firstName: {
          [Op.like]: `%${keyword}%`,
        },
        lastName: {
          [Op.like]: `%${keyword}%`,
        },
      },
    },
    include: [
      {
        model: Report,
        where: {
          id: {
            [Op.not]: null,
          },
        },
      },
    ],
  });

  return siswa;
};
const getTutorByReport = async (keyword) => {
  const { id } = await Role.findOne({
    where: {
      roleName: 'teacher',
    },
  });

  const tutor = await User.findAll({
    where: {
      roleId: id,
      [Op.or]: {
        firstName: {
          [Op.like]: `%${keyword}%`,
        },
        lastName: {
          [Op.like]: `%${keyword}%`,
        },
      },
    },
    include: [
      {
        model: Report,
        where: {
          id: {
            [Op.not]: null,
          },
        },
      },
    ],
  });

  return tutor;
};
const getTutorBy = async (keyword) => {
  const { id } = await Role.findOne({
    where: {
      roleName: 'teacher',
    },
  });

  const tutor = await User.findAll({
    where: {
      roleId: id,
      [Op.or]: {
        firstName: {
          [Op.like]: `%${keyword}%`,
        },
        lastName: {
          [Op.like]: `%${keyword}%`,
        },
      },
    },
    include: [
      {
        model: ReviewTutor,
        as: 'teacher',
        where: {
          id: {
            [Op.not]: null,
          },
        },
      },
    ],
  });

  return tutor;
};

const getUserByKeyword = async (keyword) => {
  const user = await User.findAll({
    where: {
      [Op.or]: {
        firstName: {
          [Op.like]: `%${keyword}%`,
        },
        lastName: {
          [Op.like]: `%${keyword}%`,
        },
      },
    },
  });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User Not found');
  return user;
};

const getPesananByUserId = async (
  userId,
  startDate,
  endDate,
  limit,
  offset,
) => {
  const pesanan = await Schedule.findAndCountAll({
    where: {
      [Op.or]: {
        teacherId: userId,
        studentId: userId,
      },
      dateSchedule: {
        [Op.between]: [startDate, endDate],
      },
    },
    limit,
    offset,
    include: [
      {
        model: User,
        as: 'student',
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: User,
        as: 'teacher',
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: TeacherSubject,
        attributes: ['gradeId', 'subjectId'],
        include: [
          { model: Subject, attributes: ['subjectName', 'subJectCode'] },
        ],
      },
    ],
  });
  if (!pesanan) throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');
  return pesanan;
};
const getPesananByAllQuery = async (
  userId,
  statusSchedule,
  startDate,
  endDate,
  limit,
  offset,
) => {
  const pesanan = await Schedule.findAndCountAll({
    where: {
      [Op.or]: {
        teacherId: userId,
        studentId: userId,
      },
      statusSchedule,
      dateSchedule: {
        [Op.between]: [startDate, endDate],
      },
    },
    limit,
    offset,
    include: [
      {
        model: User,
        as: 'student',
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: User,
        as: 'teacher',
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: TeacherSubject,
        attributes: ['gradeId', 'subjectId'],
        include: [
          { model: Subject, attributes: ['subjectName', 'subJectCode'] },
        ],
      },
    ],
  });
  if (!pesanan) throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');
  return pesanan;
};

const getAllSiswa = async (startDate, endDate, limit, offset) => {
  const { id } = await Role.findOne({
    where: {
      roleName: 'student',
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
  });
  const siswa = await User.findAndCountAll({
    where: {
      roleId: id,
    },
    limit,
    offset,
  });
  return siswa;
};

const getAllTutor = async () => {
  const { id } = await Role.findOne({
    where: {
      roleName: 'teacher',
    },
  });
  const tutor = await User.findAll({
    where: {
      roleId: id,
    },
  });
  return tutor;
};

const getSiswaByKeyword = async (
  keyword,
  startDate,
  endDate,
  limit,
  offset,
) => {
  const { id } = await Role.findOne({
    where: {
      roleName: 'student',
    },
  });

  const siswa = await User.findAndCountAll({
    where: {
      roleId: id,
      [Op.or]: {
        firstName: {
          [Op.like]: `%${keyword}%`,
        },
        lastName: {
          [Op.like]: `%${keyword}%`,
        },
        email: {
          [Op.like]: `%${keyword}%`,
        },
      },
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    limit,
    offset,
  });

  return siswa;
};
const getTutorByKeyword = async (
  keyword,
  startDate,
  endDate,
  limit,
  offset,
) => {
  const { id } = await Role.findOne({
    where: {
      roleName: 'teacher',
    },
  });

  const tutor = await User.findAndCountAll({
    where: {
      roleId: id,
      [Op.or]: {
        firstName: {
          [Op.like]: `%${keyword}%`,
        },
        lastName: {
          [Op.like]: `%${keyword}%`,
        },
        email: {
          [Op.like]: `%${keyword}%`,
        },
      },
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    limit,
    offset,
  });

  return tutor;
};

const getReportTutor = async (startDate, endDate, limit, offset) => {
  const report = await Report.findAndCountAll({
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [
      { model: User, attributes: ['id', 'firstName', 'lastName'] },
      {
        model: Schedule,
        attributes: ['dateSchedule', 'teacherId'],
        include: [
          {
            model: User,
            as: 'teacher',
            attributes: ['id', 'firstName', 'lastName'],
          },
        ],
      },
    ],
    limit,
    offset,
  });
  return report;
};
const getReportTutorById = async (id) => {
  const report = await Report.findOne({
    where: {
      id,
    },
    include: [
      { model: User, attributes: ['id', 'firstName', 'lastName'] },
      {
        model: Schedule,
        attributes: ['dateSchedule', 'teacherId'],
        include: [
          {
            model: User,
            as: 'teacher',
            attributes: ['id', 'firstName', 'lastName'],
          },
        ],
      },
    ],
  });
  return report;
};
const getRatingTutors = async (startDate, endDate, limit, offset) => {
  const rating = await ReviewTutor.findAndCountAll({
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [
      {
        model: User,
        as: 'teacher',
        attributes: ['id', 'firstName', 'lastName'],
      },
    ],
    limit,
    offset,
  });
  return rating;
};
const getRatingTutor = async () => {
  const rating = await RatingTutor.findAll({
    include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }],
  });
  return rating;
};
const getRatingTutorById = async (id) => {
  const rating = await RatingTutor.findOne({
    include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }],
  });
  return rating;
};

const getReportTutorByUserId = async (
  userId,
  startDate,
  endDate,
  limit,
  offset,
) => {
  const report = await Report.findAndCountAll({
    where: {
      userId,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },

    limit,
    offset,
    include: [
      { model: User, attributes: ['id', 'firstName', 'lastName'] },
      {
        model: Schedule,
        attributes: ['dateSchedule', 'teacherId'],
        include: [
          {
            model: User,
            as: 'teacher',
            attributes: ['id', 'firstName', 'lastName'],
          },
        ],
      },
    ],
  });

  return report;
};
const getRatingTutorByUserId = async (
  userId,
  startDate,
  endDate,
  limit,
  offset,
) => {
  const rating = await ReviewTutor.findAndCountAll({
    where: {
      tutorId: userId,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },

    limit,
    offset,
    include: [
      {
        model: User,
        as: 'teacher',
        attributes: ['id', 'firstName', 'lastName'],
      },
    ],
  });

  return rating;
};

const createAttendanceTeacher = async (attendanceTeacherBody) => {
  const attendance = await AttendanceTeacher.create(attendanceTeacherBody);
  return attendance;
};

const getAllAttendaceTeacher = async (startDate, endDate, limit, offset) => {
  const attendance = await AttendanceTeacher.findAndCountAll({
    where: {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    limit,
    offset,
    include: [{ model: Schedule }],
  });
  return attendance;
};

const getAttendanceTeacherByKeyword = async (
  keyword,
  startDate,
  endDate,
  limit,
  offset,
) => {
  const attendance = await AttendanceTeacher.findAndCountAll({
    where: {
      [Op.or]: {
        teacherName: {
          [Op.like]: `%${keyword}%`,
        },
        subject: {
          [Op.like]: `%${keyword}%`,
        },
        status: {
          [Op.like]: `%${keyword}%`,
        },
      },
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [{ model: Schedule }],
    limit,
    offset,
  });

  return attendance;
};

const getScheduleClass = async (startDate, endDate, status) => {
  const jadwal = await Schedule.findAndCountAll({
    where: {
      dateSchedule: {
        [Op.between]: [startDate, endDate],
      },
      statusSchedule: status,
    },
  });

  return jadwal;
};
const getScheduleByUserId = async (userId) => {
  const schedule = await Schedule.findAll({
    where: {
      teacherId: userId,
    },
  });

  return schedule;
};
const getScheduleByUserIdAndStatus = async (userId, status) => {
  const schedule = await Schedule.findAll({
    where: {
      teacherId: userId,
      statusSchedule: status,
    },
  });

  return schedule;
};
const getAllSchedule = async (userId) => {
  const schedule = await Schedule.findAll({
    include: [
      { model: User, as: 'teacher' },
      { model: User, as: 'student' },
      { model: AvailabilityHours },
      {
        model: TeacherSubject,
        include: [{ model: Grade }, { model: Subject }],
      },
    ],
  });

  return schedule;
};
module.exports = {
  getAllPesananKelas,
  getPesananKelas,
  getPesananKelasOnlyDateRange,
  getSiswaByKeyword,
  getAllSiswa,
  getReportTutor,
  getReportTutorByUserId,
  getSiswaBy,
  getUserByKeyword,
  getPesananByUserId,
  getPesananByAllQuery,
  createAttendanceTeacher,
  getAllAttendaceTeacher,
  getAttendanceTeacherByKeyword,
  getScheduleClass,
  getTutorByKeyword,
  getTutorBy,
  getRatingTutorByUserId,
  getRatingTutors,
  getScheduleByUserId,
  getAllSchedule,
  getAllTutor,
  getScheduleByUserIdAndStatus,
  getTutorByReport,
  getRatingTutor,
  getReportTutorById,
  getRatingTutorById,
};
