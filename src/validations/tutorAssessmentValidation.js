const Joi = require('joi');

const createAssessment = {
  body: Joi.object().keys({
    teachingCertificate: Joi.number().required(),
    teachingTool: Joi.number().required(),
    educationBackground: Joi.number().required(),
    teachingExperience: Joi.number().required(),
    knowledge: Joi.number().required(),
    writtenTestScore: Joi.number().required(),
    status: Joi.string().valid('pending', 'accept', 'reject').required(),
    notes: Joi.string().trim(),
    totalPointScore: Joi.number().required(),
  }),
};

module.exports = {
  createAssessment,
};
