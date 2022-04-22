const Joi = require('joi');

const createReferralHistory = Joi.object().keys({
  body: {
    referredBy: Joi.string().required(),
    referralCode: Joi.string().required(),
  },
});

const getReferralHistoryById = Joi.object().keys({
  params: {
    referralHistoryId: Joi.string().required(),
  },
});

const updateReferralHistory = Joi.object().keys({
  params: {
    referralHistoryId: Joi.string().required(),
  },
  body: {
    referredBy: Joi.string(),
    referralCode: Joi.string(),
  },
});

module.exports = {
  createReferralHistory,
  getReferralHistoryById,
  updateReferralHistory,
};
