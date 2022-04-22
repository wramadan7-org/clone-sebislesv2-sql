const Joi = require('joi');

const createCurriculum = {
  body: Joi.object().keys({
    curriculumCode: Joi.string().required(),
    curriculumName: Joi.string().required(),
  }),
};

const getCurriculumById = {
  params: Joi.object().keys({
    curriculumId: Joi.string().required(),
  }),
};

const updateCurriculum = {
  params: Joi.object().keys({
    curriculumId: Joi.string().required(),
  }),

  body: Joi.object().keys({
    curriculumCode: Joi.string(),
    curriculumName: Joi.string(),
  }),
};

module.exports = {
  createCurriculum,
  getCurriculumById,
  updateCurriculum,
};
