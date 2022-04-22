const httpStatus = require('http-status');
const moment = require('moment');
const { Op } = require('sequelize');
const { Schedule } = require('../models/Schedule');
const { User } = require('../models/User');
const ApiError = require('../utils/ApiError');

const {
  PENDING, ACCEPT, PROCESS, REJECT, CANCEL, EXPIRE, DONE, DELETE,
} = process.env;

// STUDENT

/**
 * Cek semua jadwal les
 * @param {string} teacherId
 * @param {string} teacherSubjectId
 * @param {string} availabilityHoursId
 * @param {string} id
 * @returns boolean
 */
const checkerSchedule = async (teacherId, teacherSubjectId, availabilityHoursId, date, id) => {
  if (id) {
    const ownSchedule = await Schedule.findOne(
      {
        where: {
          teacherId,
          teacherSubjectId,
          availabilityHoursId,
          statusSchedule: {
            [Op.notIn]: [
              REJECT,
              EXPIRE,
            ],
          },
          dateSchedule: date,
          id: {
            [Op.ne]: id,
          },
        },
      },
    );

    if (ownSchedule) {
      return true;
    }

    return false;
  }
  const schedule = await Schedule.findOne(
    {
      where: {
        teacherId,
        teacherSubjectId,
        availabilityHoursId,
        statusSchedule: {
          [Op.notIn]: [
            REJECT,
            EXPIRE,
          ],
        },
        dateSchedule: date,
      },
    },
  );

  // jika jadwal sudah ada, maka tampilkan true
  if (schedule) {
    return true;
  }

  return false;
};

/**
 * Check own schedule in same date and time
 * @param {string} studentId
 * @param {string date only} dateSchedule
 * @param {string} availabilityHoursId
 * @returns boolean
 */
const checkAvailDateSchedule = async (studentId, dateSchedule, availabilityHoursId) => {
  const schedule = await Schedule.findOne(
    {
      where: {
        studentId,
        dateSchedule,
        availabilityHoursId,
      },
    },
  );

  if (schedule) {
    return true;
  }

  return false;
};

/**
 * Membuat jadwal les
 * @param {Array.<{
 * dateSchedule: dateOnly,
 * typeClass: string,
 * statusSchedule: string,
 * teacherSubjectId: string,
 * availabilityHoursId: string,
 * teacherId: string,
 * studentId: string,
 * requestMaterial: string,
 * imageMaterial: string,
 * }>} scheduleBody
 * @returns Object
 */
const createSchedule = async (scheduleBody) => {
  // lakukan pengecekan jadwal
  for (const loopBody of scheduleBody) {
    const checkSchedule = await checkerSchedule(
      loopBody.teacherId,
      loopBody.teacherSubjectId,
      loopBody.availabilityHoursId,
      moment(loopBody.lessonSchedule).utc().format('YYYY-MM-DD HH:mm:ss'),
    );

    if (checkSchedule) throw new ApiError(httpStatus.CONFLICT, 'Sudah ada yang membeli jadwal les ini, harap pilih les jadwal lain.');
  }

  const schedule = await Schedule.bulkCreate(scheduleBody);

  if (!schedule) throw new ApiError(httpStatus.CONFLICT, 'Gagal membuat jadwal les. Harap hubungi administrator kita.');

  const arrayResults = [];

  for (let loopSchedule = 0; schedule.length > loopSchedule; loopSchedule++) {
    const data = {
      body: scheduleBody[loopSchedule],
      schedule: schedule[loopSchedule],
    };

    arrayResults.push(data);
  }

  return arrayResults;
};

/**
 * Mengambil semua data jadwal les
 * @param {object} opts
 * @returns array of object
 */
const getSchedule = async (opts = {}) => {
  const schedule = await Schedule.findAll(
    {
      ...opts,
    },
  );

  return schedule;
};

/**
 * Mengambil data jadwal les berdasarkan id
 * @param {string} id
 * @param {object} opts
 * @returns object
 */
const getScheduleById = async (id, opts = {}) => {
  const schedule = await Schedule.findOne(
    {
      where: {
        id,
      },
      ...opts,
    },
  );

  return schedule;
};

/**
 * Mengambil data jadwal les milik sendiri
 * @param {string} userId
 * @param {object} opts
 * @returns array
 */
const getOwnSchedule = async (userId, opts = {}) => {
  const schedule = await Schedule.findAll(
    {
      where: {
        [Op.or]: [
          {
            studentId: userId,
          },
          {
            friend1: userId,
          },
          {
            friend2: userId,
          },
        ],
      },
      ...opts,
    },
  );

  return schedule;
};

/**
 * Update jadwal les berdasarkan id
 * @param {string} id
 * @param {object} scheduleBody
 * @param {object} opts
 * @returns object
 */
const updateScheduleById = async (id, scheduleBody, opts = {}) => {
  const schedule = await getScheduleById(id);

  if (!schedule) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan jadwal les yang anda inginkan.');

  const checkSchedule = await checkerSchedule(
    scheduleBody.teacherId,
    scheduleBody.teacherSubjectId,
    scheduleBody.availabilityHoursId,
    moment(scheduleBody.dateSchedule).utc().format('YYYY-MM-DD HH:mm:ss'),
    id,
  );

  if (checkSchedule) throw new ApiError(httpStatus.CONFLICT, 'Jadwal les sudah ada. Harap masukkan jadwal les yang lain!');

  Object.assign(schedule, scheduleBody);

  const checkTeacher = await User.findOne(
    {
      where: {
        id: schedule.teacherId,
      },
    },
  );

  const checkStudent = await User.findOne(
    {
      where: {
        id: schedule.studentId,
      },
    },
  );

  if (!checkTeacher) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan tutor..');
  if (!checkStudent) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan murid.');

  schedule.save();

  return schedule;
};

/**
 * Hapus jadwal les berdasarkan id
 * @param {string} id
 * @returns object
 */
const deleteSchedule = async (id) => {
  const schedule = await getScheduleById(id);

  if (!schedule) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan jadwal les yang anda inginkan.');

  schedule.destroy();

  return schedule;
};

/**
 * Mengambil data riwayat les berdasarkan user atau semua data
 * @param {string} userId userId/null
 * @param {string} role
 * @param {object} opts
 * @returns array
 */
const historySchedule = async (userId, role, opts = {}) => {
  let history;
  const valueArray = [PENDING, ACCEPT, PROCESS, REJECT, CANCEL, EXPIRE, DONE, DELETE];

  if (userId && role == 'student') {
    history = await Schedule.findAll(
      {
        where: {
          studentId: userId,
          statusSchedule: {
            [Op.in]: valueArray,
          },
        },
        ...opts,
      },
    );
  } else if (userId && role == 'teacher') {
    history = await Schedule.findAll(
      {
        where: {
          teacherId: userId,
          statusSchedule: {
            [Op.in]: valueArray,
          },
        },
        ...opts,
      },
    );
  } else {
    history = await Schedule.findAll(
      {
        where: {
          statusSchedule: {
            [Op.in]: valueArray,
          },
        },
        ...opts,
      },
    );
  }

  return history;
};

/**
 * Mengambil data detail history
 * @param {string} id
 * @param {object} opts
 * @returns object
 */
const historyScheduleDetail = async (id, opts = {}) => {
  const historyDetail = await Schedule.findOne(
    {
      where: {
        id,
      },
      ...opts,
    },
  );

  return historyDetail;
};

/**
 * Request materi
 * @param {string} id
 * @param {string} file
 * @param {string} description
 * @returns object
 */
const updateRequestMateri = async (id, file, description) => {
  const schedule = await getScheduleById(id);

  if (!schedule) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat meneukan item.');

  const dataRequestMateri = {
    requestMaterial: description,
    imageMaterial: file,
  };

  Object.assign(schedule, dataRequestMateri);

  await schedule.save();
  return schedule;
};

// TUTOR

const getOwnScheduleTutor = async (userId, opts = {}) => {
  const schedule = await Schedule.findAll(
    {
      where: {
        teacherId: userId,
      },
      ...opts,
    },
  );

  return schedule;
};

const getOwnScheduleTutorWithStatus = async (userId, status, opts = {}) => {
  const schedule = await Schedule.findAll(
    {
      where: {
        teacherId: userId,
        statusSchedule: {
          [Op.in]: status,
        },
      },
      ...opts,
    },
  );

  return schedule;
};

module.exports = {
  checkerSchedule,
  checkAvailDateSchedule,
  createSchedule,
  getSchedule,
  getScheduleById,
  getOwnSchedule,
  updateScheduleById,
  deleteSchedule,
  historySchedule,
  historyScheduleDetail,
  updateRequestMateri,
  getOwnScheduleTutor,
  getOwnScheduleTutorWithStatus,
};
