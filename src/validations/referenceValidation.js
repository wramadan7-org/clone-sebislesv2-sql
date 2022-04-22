const Joi = require('joi');

const createReference = {
  body: Joi.array().items({
    nameReference: Joi.string().required(),
    phoneReference: Joi.number().required(),
  }),
};

module.exports = {
  createReference,
};
