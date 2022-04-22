const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { paginator } = require('../utils/pagination');

const deviceService = require('../services/deviceService');

const { User } = require('../models/User');

const createDevice = catchAsync(async (req, res) => {
  const { id } = req.user;
  const deviceBody = req.body;

  const dataDevice = {
    userId: id,
    ...deviceBody,
  };

  const hasDevice = await deviceService.getOwnDevice(id);

  if (hasDevice && hasDevice.length > 0) {
    const updateDevice = await deviceService.updateDeviceById(hasDevice[0].id, dataDevice);

    if (!updateDevice) throw new ApiError(httpStatus.CONFLICT, 'Gagal mengubah dperangkat.');

    return res.sendWrapped(updateDevice, httpStatus.OK);
  }

  const device = await deviceService.createDevice(dataDevice);

  if (!device) throw new ApiError(httpStatus.CONFLICT, 'Gagal membuat perangkat.');

  res.sendWrapped(device, httpStatus.OK);
});

const getAllDevice = catchAsync(async (req, res) => {
  let { page, limit } = req.query;

  if (!page) {
    page = 1;
  } else {
    page = parseInt(page);
  }

  if (!limit) {
    limit = 10;
  } else {
    limit = parseInt(limit);
  }

  const devices = await deviceService.getAllDevice(
    {
      include: {
        model: User,
        attributes: {
          exclude: ['password'],
        },
      },
    },
  );

  const sorting = devices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const paginate = paginator(sorting, page, limit);

  res.sendWrapped(null, httpStatus.OK, paginate);
});

const getOwnDevice = catchAsync(async (req, res) => {
  const userId = req.user.id;
  let { page, limit } = req.query;

  if (!page) {
    page = 1;
  } else {
    page = parseInt(page);
  }

  if (!limit) {
    limit = 10;
  } else {
    limit = parseInt(limit);
  }

  const devices = await deviceService.getOwnDevice(userId);

  const sorting = devices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const paginate = paginator(sorting, page, limit);

  res.sendWrapped(null, httpStatus.OK, paginate);
});

const getDeviceById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const device = await deviceService.getDeviceById(id, { include: { model: User, attributes: { exclude: 'password' } } });

  if (!device) throw new ApiError(httpStatus.NOT_FOUND, 'Perangkat tidak ditemukan.');

  res.sendWrapped(device, httpStatus.OK);
});

const updateDevice = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deviceBody = req.body;

  const device = await deviceService.updateDeviceById(id, deviceBody);

  if (!device) throw new ApiError(httpStatus.CONFLICT, 'Gagal mengganti perangkat.');

  res.sendWrapped(device, httpStatus.OK);
});

const deleteDevice = catchAsync(async (req, res) => {
  const { id } = req.params;

  const validDevice = await deviceService.getDeviceById(id);

  if (!validDevice) throw new ApiError(httpStatus.NOT_FOUND, 'Perangkat tidak ditemukan.');

  await deviceService.deleteDeviceById(id);

  res.sendWrapped(validDevice, httpStatus.OK);
});

module.exports = {
  createDevice,
  getAllDevice,
  getOwnDevice,
  getDeviceById,
  updateDevice,
  deleteDevice,
};
