const httpStatus = require('http-status');
const moment = require('moment');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { paginator } = require('../utils/pagination');

const { Duration } = require('../models/Duration');
const { User } = require('../models/User');

const availabilityHoursService = require('../services/availabilityHoursService');
const durationService = require('../services/durationService');

const createTutorScheduleTime = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const {
    dayCode,
    timeStart,
    durationId,
  } = req.body;

  const duration = await durationService.getDurationById(durationId);

  const aMinuteLater = moment(`1990-01-01 ${timeStart}`).add(duration.duration, 'minutes').format('HH:mm');

  const data = {
    teacherId: userId,
    dayCode,
    timeStart,
    timeEnd: aMinuteLater,
    durationId: duration.id,
  };

  await availabilityHoursService.createTutorScheduleTime(data);

  res.sendWrapped('Pengajuan penambahan jadwal les berhasil.', httpStatus.CREATED);
});

const getTutorScheduleTimeById = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { availabilityHoursId } = req.params;

  const availabilityHours = await availabilityHoursService.getTutorScheduleTimeById(availabilityHoursId, userId, { include: Duration });

  if (!availabilityHours) throw new ApiError(httpStatus.NOT_FOUND, 'Availability hours not found.');

  res.sendWrapped(availabilityHours, httpStatus.OK);
});

const getTutorScheduleByUserId = catchAsync(async (req, res) => {
  const userId = req.user.id;
  let { page, limit, qday } = req.query;

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

  if (qday) {
    qday = [parseInt(qday)];
  } else {
    qday = [0, 1, 2, 3, 4, 5, 6];
  }

  const availabilityHours = await availabilityHoursService.getTutorScheduleTimes(
    userId,
    qday,
    {
      include: [
        {
          model: Duration,
        },
        {
          model: User,
          as: 'teacher',
          attributes: {
            exclude: ['password'],
          },
        },
      ],
    },
  );

  if (!availabilityHours) throw new ApiError(httpStatus.NOT_FOUND, 'You dont have availability hours');

  const sorting = availabilityHours.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const paginate = paginator(sorting, page, limit);

  res.sendWrapped(null, httpStatus.OK, paginate);
});

const updateTutorScheduleTime = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { availabilityHoursId } = req.params;
  const availabilityHoursBody = req.body;

  const updating = await availabilityHoursService.updatingTutorScheduleTime(
    userId,
    availabilityHoursId,
    availabilityHoursBody,
  );

  res.sendWrapped(updating, httpStatus.OK);
});

const deleteTutorScheduleTime = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { availabilityHoursId } = req.params;

  const availabilityHours = await availabilityHoursService.deletingTutorScheduleTime(
    userId,
    availabilityHoursId,
  );

  res.sendWrapped(availabilityHours, httpStatus.OK);
});

module.exports = {
  createTutorScheduleTime,
  getTutorScheduleByUserId,
  getTutorScheduleTimeById,
  updateTutorScheduleTime,
  deleteTutorScheduleTime,
};
