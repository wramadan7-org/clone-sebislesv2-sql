const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { paginator } = require('../utils/pagination');

const durationService = require('../services/durationService');
const { TeacherSubject } = require('../models/TeacherSubject');
const { AvailabilityHours } = require('../models/AvailabilityHours');

const addDuration = catchAsync(async (req, res) => {
  const { minute } = req.body;

  const checkDuration = await durationService.getDurationByMinute(minute);

  if (checkDuration) throw new ApiError(httpStatus.BAD_REQUEST, `Durasi ${minute} sudah ada.`);

  const duration = await durationService.addDuration(minute);

  if (!duration) throw new ApiError(httpStatus.CONFLICT, 'Gagal menambahkan durasi');

  res.sendWrapped(duration, httpStatus.CREATED);
});

const getAllDuration = catchAsync(async (req, res) => {
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

  const duration = await durationService.getAllDuration();

  const sorting = duration.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const pagination = paginator(sorting, page, limit);

  res.sendWrapped(null, httpStatus.OK, pagination);
});

const getDurationById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const duration = await durationService.getDurationById(id);

  if (!duration) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan durasi yang anda inginkan');

  res.sendWrapped(duration, httpStatus.OK);
});

const getDurationByMinute = catchAsync(async (req, res) => {
  let { minute } = req.params;

  // minute = parseInt(minute);

  const duration = await durationService.getDurationByMinute(minute);

  if (!duration) throw new ApiError(httpStatus.NOT_FOUND, `Tidak dapat menemukan durasi ${minute}`);

  res.sendWrapped(duration, httpStatus.OK);
});

const updateAllAvailabilityHoursDuration = catchAsync(async (req, res) => {
  let { minute } = req.body;

  minute = parseInt(minute);

  const duration = await durationService.getDurationByMinute(minute);

  if (!duration) throw new ApiError(httpStatus.NOT_FOUND, `Durasi ${duration} tidak ada.`);

  const availabilityHours = await AvailabilityHours.findAll();

  if (!availabilityHours || availabilityHours.length <= 0) throw new ApiError(httpStatus.CONFLICT, 'Tidak ada data jadwal jam mengajar');

  const update = await AvailabilityHours.update({ durationId: duration.id }, { where: { durationId: null } });

  if (!update) throw new ApiError(httpStatus.CONFLICT, 'Gagal menambahkan durasi di tiap-tiap data tabel AvailabiltyHours');

  res.sendWrapped(update, httpStatus.OK);
});

module.exports = {
  addDuration,
  getAllDuration,
  getDurationById,
  getDurationByMinute,
  updateAllAvailabilityHoursDuration,
};
