const Joi = require('joi');

const createSchool = {
  body: Joi.object().keys({
    schoolName: Joi.string().max(32).required(),
    schoolAddress: Joi.string().max(60).required(),
  }),
};

module.exports = {
  createSchool,
};
