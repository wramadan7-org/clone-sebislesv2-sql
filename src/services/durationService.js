const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const { Duration } = require('../models/Duration');

/**
 * Create duration
 * @param {integer} minute
 * @returns object
 */
const addDuration = async (minute) => {
  const duration = await Duration.create({ duration: minute });

  return duration;
};

/**
 * Get all data duration
 * @returns array
 */
const getAllDuration = async () => Duration.findAll();

/**
 * Get duration by Id
 * @param {uuidv4} id
 * @returns object
 */
const getDurationById = async (id) => {
  const duration = await Duration.findOne(
    {
      where: {
        id,
      },
    },
  );

  return duration;
};

/**
 * Get duration by minute/duration
 * @param {integer} minute
 * @returns object
 */
const getDurationByMinute = async (minute) => {
  const duration = await Duration.findOne(
    {
      where: {
        duration: minute,
      },
    },
  );

  return duration;
};

module.exports = {
  addDuration,
  getAllDuration,
  getDurationById,
  getDurationByMinute,
};
