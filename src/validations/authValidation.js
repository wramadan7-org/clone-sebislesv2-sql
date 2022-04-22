const Joi = require('joi');

const register = {
  body: Joi.object().keys({
    email: Joi.string().email().max(32).required(),
    password: Joi.string().min(8).max(32).required(),
    firstName: Joi.string().max(12).required(),
    lastName: Joi.string().max(32).required(),
    schoolId: Joi.string().min(8).max(64),
    phoneNumber: Joi.string().max(14).required(),
    gender: Joi.string().default('male').required(),
    roleId: Joi.string().min(8).max(64).required(),
  }),
};

const login = {
  body: Joi.object().keys({
    identity: Joi.string().max(32).required(),
    password: Joi.string().min(8).max(32).required(),
  }),
};

const refresh = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    password: Joi.string().min(8).max(32).required(),
  }),
};

const pin = {
  body: Joi.object().keys({
    pin: Joi.string().min(6).max(6).required(),
  }),
};

module.exports = {
  register,
  login,
  refresh,
  resetPassword,
  pin,
};
