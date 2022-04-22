const Joi = require('joi');

const createFileProfile = {
  file: Joi.object().keys({
    fileProfile: Joi.string().required(),
  }),
};

const createFileKTP = {
  file: Joi.object().keys({
    fileKTP: Joi.string().required(),
  }),
};

const createFileNPWP = {
  file: Joi.object().keys({
    fileNPWP: Joi.string().required(),
  }),
};

const createFileCV = {
  file: Joi.object().keys({
    fileCV: Joi.string().required(),
  }),
};

module.exports = {
  createFileProfile,
  createFileKTP,
  createFileNPWP,
  createFileCV,
};
