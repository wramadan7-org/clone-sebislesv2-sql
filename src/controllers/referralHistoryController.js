const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const referralService = require('../services/referralService');
const referralHistoryService = require('../services/referralHistoryService');
const ApiError = require('../utils/ApiError');
const { User } = require('../models/User');

const addReferralHistory = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const {
    referredBy,
    referralCode,
  } = req.body;

  const referralHistory = await referralHistoryService.createReferralHistory(
    userId,
    referredBy,
    referralCode,
  );

  res.sendWrapped(referralHistory, httpStatus.CREATED);
});

const getReferralHistories = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const referralHistories = await referralHistoryService.getReferralHistoryAll(
    userId,
    {
      include: [
        {
          model: User,
          foreignKey: 'userId',
          as: 'referencedTo',
        },
        {
          model: User,
          foreignKey: 'referredBy',
          as: 'referencedBy',
        },
      ],
    },
  );

  res.sendWrapped(referralHistories, httpStatus.OK);
});

const getReferralHistoryById = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { referralHistoryId } = req.params;

  const referralHistory = await referralHistoryService.getReferralHistoryById(
    referralHistoryId,
    userId,
    {
      include: [
        {
          model: User,
          foreignKey: 'userId',
          as: 'referencedTo',
        },
        {
          model: User,
          foreignKey: 'referredBy',
          as: 'referencedBy',
        },
      ],
    },
  );

  if (!referralHistory) throw new ApiError(httpStatus.NOT_FOUND, 'Referral not found.');

  res.sendWrapped(referralHistory, httpStatus.OK);
});

const updateReferralHistory = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { referralHistoryId } = req.params;
  const referralBody = req.body;

  const user = await referralService.getReferralCode(userId, referralBody.referralCode);

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'Referral not found.');

  if (user.referralCode !== referralBody.referralCode) throw new ApiError(httpStatus.NOT_FOUND, 'Referral not found.');

  const dataReferralHistory = {
    referralCode: user.referralCode,
    referredBy: user.id,
  };

  const referralHistory = await referralHistoryService.updateReferralHistory(
    referralHistoryId,
    userId,
    dataReferralHistory,
  );

  res.sendWrapped(referralHistory, httpStatus.OK);
});

const deleteReferralHistory = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { referralHistoryId } = req.params;

  const referralHistory = await referralHistoryService.deleteReferralHistory(
    referralHistoryId,
    userId,
  );

  res.sendWrapped(referralHistory, httpStatus.OK);
});

module.exports = {
  addReferralHistory,
  getReferralHistories,
  getReferralHistoryById,
  updateReferralHistory,
  deleteReferralHistory,
};
