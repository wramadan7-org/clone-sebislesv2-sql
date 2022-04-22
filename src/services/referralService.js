const httpStatus = require('http-status');
const { Op } = require('sequelize');
const ApiError = require('../utils/ApiError');
const { User } = require('../models/User');
const userService = require('./userService');
const referralHistoryService = require('./referralHistoryService');

/**
 * Get referral code
 * @param {string} userId;
 * @param {string} referralCode;
 */
const getReferralCode = async (userId, referralCode) => {
  const userReferral = await User.findOne(
    {
      where: {
        id: {
          [Op.ne]: userId,
        },
        referralCode,
      },
    },
  );

  if (!userReferral) throw new ApiError(httpStatus.NOT_FOUND, 'Referral not found.');

  return userReferral;
};

/**
 * Create referred by
 * @param {string} userId;
 * @param {string} referralCode;
 */
const createReferralBy = async (userId, referralCode) => {
  const user = await getReferralCode(userId, referralCode);
  const myAccount = await userService.getUserById(userId);

  if (myAccount.referredBy) throw new ApiError(httpStatus.CONFLICT, 'User already applied referral code.');

  myAccount.referredBy = user.id;
  myAccount.save();

  const createReferralHistory = await referralHistoryService.createReferralHistory(myAccount.id, myAccount.referredBy, referralCode);
  return myAccount;
};

module.exports = {
  getReferralCode,
  createReferralBy,
};
