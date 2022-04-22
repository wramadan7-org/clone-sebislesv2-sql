const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const { Device } = require('../models/Device');

/**
 * Create device
 * @param { Object } body
 * @returns { Promise <Object | null> }
 */
const createDevice = async (body) => {
  const device = await Device.create(body);

  return device;
};

/**
 * Get all device
 * @param { Object } opts
 * @returns { Promise <Array> }
 */
const getAllDevice = async (opts = {}) => {
  const device = await Device.findAll(
    {
      ...opts,
    },
  );

  return device;
};

/**
 * Get own device
 * @param { String } userId
 * @param { Object } opts
 * @returns { Promise <Array> }
 */
const getOwnDevice = async (userId, opts = {}) => {
  const device = await Device.findAll(
    {
      where: {
        userId,
      },
      ...opts,
    },
  );

  return device;
};

/**
 * Get device by Id
 * @param { String } Id
 * @param { Object } opts
 * @returns { Promise <Array> }
 */
const getDeviceById = async (id, opts = {}) => {
  const device = await Device.findOne(
    {
      where: {
        id,
      },
      ...opts,
    },
  );

  return device;
};

/**
 * Update device by Id
 * @param { String } id
 * @param { Object } body
 * @param { Object } opts
 * @returns { Promise <Object> }
 */
const updateDeviceById = async (id, body, opts = {}) => {
  const device = await getDeviceById(id, opts);

  if (!device) throw new ApiError(httpStatus.NOT_FOUND, 'Perangkat tidak ditemukan.');

  Object.assign(device, body);

  device.save();

  return device;
};

/**
 * Delete device by Id
 * @param { String } id
 * @returns { Promise <Object> }
 */
const deleteDeviceById = async (id) => {
  const device = await Device.destroy(
    {
      where: {
        id,
      },
    },
  );

  return device;
};

module.exports = {
  createDevice,
  getAllDevice,
  getOwnDevice,
  getDeviceById,
  updateDeviceById,
  deleteDeviceById,
};
