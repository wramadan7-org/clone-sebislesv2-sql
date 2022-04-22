const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { ReferralHistory } = require('../models/ReferralHistory');

/**
 * Create referral history
 * @param {string} userId
 * @param {string} referredBy
 * @param {string} referralCode
 * @returns {Promise<object>} insertReferralHistory
 */
const createReferralHistory = async (userId, referredBy, referralCode) => {
  const dataReferralHistory = {
    userId,
    referredBy,
    referralCode,
  };

  const insertReferralHistory = await ReferralHistory.create(dataReferralHistory);

  return insertReferralHistory;
};

/**
 * Get all referral history
 * @param {string} userId
 * @param {object} opts
 * @returns {Promise<array>} referral history
 */
const getReferralHistoryAll = async (userId, opts = {}) => {
  const referralHistory = await ReferralHistory.findAll(
    {
      where: {
        userId,
      },
      ...opts,
    },
  );

  if (referralHistory.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'You don\'t have referral history');

  return referralHistory;
};

/**
 * Get referral history by id
 * @param {string} id
 * @param {string} userId
 * @param {object} opts
 * @returns {Promise<object>} referral histroy
 */
const getReferralHistoryById = async (id, userId, opts = {}) => {
  const referralHistory = await ReferralHistory.findOne(
    {
      where: {
        id,
        userId,
      },
      ...opts,
    },
  );

  return referralHistory;
};

/**
 * Update referral history by id
 * @param {string} id
 * @param {string} userId
 * @param {object} data
 * @returns {Promise<object>} referral history
 */
const updateReferralHistory = async (id, userId, data) => {
  const referralHistory = await getReferralHistoryById(id, userId);

  if (!referralHistory) throw new ApiError(httpStatus.NOT_FOUND, 'Referral not found.');

  Object.assign(referralHistory, data);

  referralHistory.save();

  return referralHistory;
};

/**
 * Delete referral history by id
 * @param {string} id
 * @param {string} userId
 * @returns {Promise<object>} referral history
 */
const deleteReferralHistory = async (id, userId) => {
  const referralHistory = await getReferralHistoryById(id, userId);

  if (!referralHistory) throw new ApiError(httpStatus.NOT_FOUND, 'Referral not found.');

  referralHistory.destroy();

  return referralHistory;
};

module.exports = {
  createReferralHistory,
  getReferralHistoryAll,
  getReferralHistoryById,
  updateReferralHistory,
  deleteReferralHistory,
};
