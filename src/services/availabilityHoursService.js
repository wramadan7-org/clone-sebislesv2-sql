const httpStatus = require('http-status');
const moment = require('moment');
const { Op } = require('sequelize');
const ApiError = require('../utils/ApiError');
const { AvailabilityHours } = require('../models/AvailabilityHours');
const { Duration } = require('../models/Duration');

/**
 *
 * @param {string} teacherId;
 * @param {number} dayCode;
 * @param {string} timeStart;
 * @param {object} opts;
 * @returns {object};
 */
const getTutorScheduleTime = async (teacherId, dayCode, timeStart, opts = {}) => {
  const availabilityHours = await AvailabilityHours.findOne(
    {
      where: {
        teacherId,
        dayCode,
        timeStart,
      },
      ...opts,
    },
  );

  return availabilityHours;
};

/**
 *
 * @param {string} teacherId;
 * @param {number} dayCode;
 * @param {object} opts;
 * @returns {array};
 */
const getTutorScheduleTimeByDay = async (teacherId, dayCode, opts = {}) => {
  const availabilityHours = await AvailabilityHours.findAll(
    {
      where: {
        teacherId,
        dayCode,
      },
      ...opts,
    },
  );

  return availabilityHours;
};

/**
 * Get All Availability
 * @param {string} teacherId
 * @param {object} opts
 * @returns {array}
 */
const getTutorScheduleTimes = async (teacherId, day, opts = {}) => {
  const availabilityHours = await AvailabilityHours.findAll(
    {
      where: {
        teacherId,
        dayCode: {
          [Op.in]: day,
        },
      },
      ...opts,
    },
  );

  return availabilityHours;
};

/**
 * Get availability hours by id
 * @param {string} availabilityHoursId;
 * @param {string} teacherId;
 * @param {object} opts;
 * @returns {object};
 */
const getTutorScheduleTimeById = async (availabilityHoursId, teacherId, opts = {}) => {
  const availabilityHours = await AvailabilityHours.findOne(
    {
      where: {
        id: availabilityHoursId,
        teacherId,
      },
      ...opts,
    },
  );

  return availabilityHours;
};

/**
 * Check for conflicted hours
 * @param {string} teacherId;
 * @param {number} dayCode;
 * @param {string} timeStart;
 * @param {string} timeEnd;
 * @param {string | optional} availabilityHoursId
 * @param {object<{offsetStart: number, offsetEnd: number}>} options;
 * @returns {boolean};
 */
const isHoursAvailable = async (teacherId, dayCode, timeStart, timeEnd, availabilityHoursId, options = { offsetStart: -15, offsetEnd: 15 }) => {
  let availablityHours;

  if (availabilityHoursId) {
    const availablityHoursAnother = await AvailabilityHours.findAll(
      {
        where: {
          id: {
            [Op.ne]: availabilityHoursId,
          },
          teacherId,
          dayCode,
        },
      },
    );

    availablityHours = availablityHoursAnother;
  } else {
    availablityHours = await getTutorScheduleTimeByDay(teacherId, dayCode);
  }

  if (availablityHours.length <= 0) {
    return true;
  }

  const originalLength = availablityHours.slice().length;

  const currentDate = moment().format('YYYY-MM-DD');
  const inputTimeStart = moment(`${currentDate} ${timeStart}`);
  const inputTimeEnd = moment(`${currentDate} ${timeEnd}`);

  const beforeTime = moment(`${currentDate} 05:59:00`).format();
  const afterTime = moment(`${currentDate} 22:00:01`).format();
  const setOneHourAfterTime = moment(`${currentDate} ${timeEnd}:00`);
  const currentTime = moment(`${currentDate} ${timeStart}:00`).isBetween(beforeTime, afterTime);
  const oneHourAfterTime = moment(setOneHourAfterTime).isBetween(beforeTime, afterTime);

  if (!currentTime || !oneHourAfterTime) throw new ApiError(httpStatus.CONFLICT, 'Jadwal les mulai dari jam 06.00 WIB - 22.00 WIB');

  availablityHours = availablityHours.filter((availabiltyHour) => {
    const recordTimeStart = moment(`${currentDate} ${availabiltyHour.timeStart}`).add(options.offsetStart, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    const recordTimeEnd = moment(`${currentDate} ${availabiltyHour.timeEnd}`).add(options.offsetEnd, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    return !inputTimeStart.isBetween(recordTimeStart, recordTimeEnd) && !inputTimeEnd.isBetween(recordTimeStart, recordTimeEnd);
  });

  return originalLength === availablityHours.length;
};

/**
 * Creating availability hours
 * @param {object={dayCode: number, timeStart: string}} data;
 * @returns {object};
 */
const createTutorScheduleTime = async (data) => {
  const {
    teacherId,
    dayCode,
    timeStart,
    timeEnd,
  } = data;

  const checkSameScheduleTime = await getTutorScheduleTime(teacherId, dayCode, timeStart);
  if (checkSameScheduleTime) throw new ApiError(httpStatus.CONFLICT, `Sudah ada jawal les di antara jam ${timeStart} - ${timeEnd}.`);

  const valid = await isHoursAvailable(teacherId, dayCode, timeStart, timeEnd);

  if (!valid) throw new ApiError(httpStatus.CONFLICT, 'Selisih jadwal les minimal 15 menit dari jadwal les lainnya.');

  await AvailabilityHours.create(data);

  return valid;
};

/**
 * Updating availability hours
 * @param {string} userId;
 * @param {string} availabilityHoursId;
 * @param {object} body;
 * @returns {object};
 */
const updatingTutorScheduleTime = async (userId, availabilityHoursId, body) => {
  const defaultDate = '1990-01-01';
  const availabilityHours = await getTutorScheduleTimeById(availabilityHoursId, userId, { include: Duration });

  if (!availabilityHours) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan jam mengajar yang anda maksut.');

  let durationMinute;

  if (body.durationId) {
    const duration = await Duration.findOne({ where: { id: body.durationId } });
    durationMinute = duration.duration;
  }

  Object.assign(availabilityHours, body);

  availabilityHours.timeEnd = moment(`${defaultDate} ${availabilityHours.timeStart}`).add(durationMinute ? durationMinute : availabilityHours.duration.duration, 'minutes').format('HH:mm');

  const valid = await isHoursAvailable(
    userId,
    availabilityHours.dayCode,
    availabilityHours.timeStart,
    availabilityHours.timeEnd,
    availabilityHoursId,
  );

  if (!valid) throw new ApiError(httpStatus.CONFLICT, 'Jam mengajar sudah ada.');

  availabilityHours.save();

  return availabilityHours;
};

/**
 * Deleting availability hours;
 * @param {string} userId;
 * @param {string} availabilityHoursId;
 * @returns {object};
 */
const deletingTutorScheduleTime = async (userId, availabilityHoursId) => {
  const availabilityHours = await getTutorScheduleTimeById(availabilityHoursId, userId);

  if (!availabilityHours) throw new ApiError(httpStatus.NOT_FOUND, 'Availability hours not found.');

  await availabilityHours.destroy();
  return availabilityHours;
};

module.exports = {
  getTutorScheduleTime,
  getTutorScheduleTimeById,
  getTutorScheduleTimes,
  createTutorScheduleTime,
  updatingTutorScheduleTime,
  deletingTutorScheduleTime,
};
