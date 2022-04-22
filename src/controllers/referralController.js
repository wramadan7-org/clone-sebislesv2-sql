const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const referralService = require('../services/referralService');
const referralHistoryService = require('../services/referralHistoryService');
const ApiError = require('../utils/ApiError');

const addReferredBy = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { referralCode } = req.body;

  const user = await referralService.getReferralCode(userId, referralCode);

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'Referral not found.');

  const addReferred = await referralService.createReferralBy(userId, referralCode);

  res.sendWrapped(addReferred, httpStatus.OK);
});

module.exports = {
  addReferredBy,
};
