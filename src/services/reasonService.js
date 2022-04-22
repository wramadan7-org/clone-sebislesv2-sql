const httpStatus = require('http-status');
const { Op } = require('sequelize');
const ApiError = require('../utils/ApiError');

const { Reason } = require('../models/Reason');

/**
 * Create reason
 * @param { Object } body
 * @returns { Promise<Object> }
 */
const createReason = async (body) => Reason.create(body);

/**
 * Get reason
 * @param { Object } opts
 * @returns { Promise<Array> }
 */
const getAllReason = async (opts = {}) => {
  const reason = await Reason.findAll({ ...opts });

  return reason;
};

/**
 * Get reason by category and cartItemId or scheduleId
 * @param { String } id
 * @param { String } category
 * @returns { Promise <Object | null> }
 */
const getReasonByCategoryAndId = async (id, category, opts = {}) => {
  let reason = null;
  if (category) {
    reason = await Reason.findOne(
      {
        where: {
          [Op.or]: [
            {
              id,
            },
            {
              cartItemId: id,
            },
            {
              scheduleId: id,
            },
          ],
          category,
        },
        ...opts,
      },
    );
  }

  reason = await Reason.findOne(
    {
      where: {
        id,
      },
      ...opts,
    },
  );

  return reason;
};
module.exports = {
  createReason,
  getAllReason,
  getReasonByCategoryAndId,
};
