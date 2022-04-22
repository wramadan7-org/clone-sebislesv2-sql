const Joi = require('joi');

const createBank = {
  body: Joi.object().keys({
    temporaryIdentityId: Joi.string().default('-'),
    bankName: Joi.string().uppercase().required(),
    bankNumber: Joi.number().min(10).required(),
    bankOwnerName: Joi.string().required(),
  }),
};
const updateBank = {
  body: Joi.object().keys({
    bankName: Joi.string().uppercase(),
    bankNumber: Joi.number().min(10),
    bankOwnerName: Joi.string(),
  }),
};

module.exports = {
  createBank,
  updateBank,
};
