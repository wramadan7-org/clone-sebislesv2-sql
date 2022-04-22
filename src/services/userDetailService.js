const httpStatus = require('http-status');
const { Op } = require('sequelize');
const ApiError = require('../utils/ApiError');
const { UserDetail } = require('../models/UserDetail');

/**
 * Create user detail
 * @param {object} userDetailBody
 * @returns {Promise<UserDetail>}
 */
const createUserDetail = async (userId, userDetailBody) => {
  const data = {
    userId,
    ...userDetailBody,
  };

  const createdUserDetail = await UserDetail.create(data);
  return createdUserDetail;
};

/**
 * Get user detail by userId
 * @param {string} userId
 * @param {object} opts
 * @returns {Promise<UserDetail | ApiError>}
 */
const getUserDetailByUserId = async (userId, opts = {}) => {
  const userDetail = await UserDetail.findOne({
    where: {
      userId,
    },
    ...opts,
  });

  return userDetail;
};

/**
 * Get user detail by userId
 * @param {string} cardNumber
 * @param {object} opts
 * @returns {Promise<UserDetail | ApiError>}
 */
const getAnotherUserDetailByCardNumber = async (
  cardNumber,
  userId,
  opts = {},
) => {
  const userDetail = await UserDetail.findOne({
    where: {
      idCardNumber: {
        [Op.eq]: cardNumber,
      },
      userId: {
        [Op.ne]: userId,
      },
    },
    ...opts,
  });

  if (userDetail) throw new ApiError(httpStatus.CONFLICT, 'Card number already exists');

  return userDetail;
};

/**
 * Update user detail by userId
 * @param {string} userId
 * @param {object} userDetailBody
 * @returns {Promise<UserDetail | ApiError>}
 */
const updateUserDetailByUserId = async (userId, userDetailBody) => {
  const userDetail = await getUserDetailByUserId(userId);
  if (!userDetail) throw new ApiError(httpStatus.NOT_FOUND, 'User detail not found');
  Object.assign(userDetail, userDetailBody);
  await userDetail.save();

  return userDetail;
};

/**
 * Delete user detail by userId
 * @param {string} userId
 * @returns {Promise<UserDetail | ApiError>}
 */
const deleteUserDetailById = async (userId) => {
  const userDetail = await getUserDetailByUserId(userId);
  console.log(userDetail);
  if (!userDetail) throw new ApiError(httpStatus.NOT_FOUND, 'User detail not found');
  await userDetail.destroy();

  return userDetail;
};

module.exports = {
  createUserDetail,
  getUserDetailByUserId,
  getAnotherUserDetailByCardNumber,
  updateUserDetailByUserId,
  deleteUserDetailById,
};
