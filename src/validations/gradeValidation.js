const Joi = require('joi');

const createGrade = {
  body: Joi.object().keys({
    gradeGroupId: Joi.string().required(),
    gradeCode: Joi.string().required(),
    gradeName: Joi.string().required(),
  }),
};

const getGradeById = {
  params: Joi.object().keys({
    gradeId: Joi.string().required(),
  }),
};

const updateGrade = {
  params: Joi.object().keys({
    gradeId: Joi.string().required(),
  }),

  body: Joi.object().keys({
    gradeCode: Joi.string(),
    gradeName: Joi.string(),
  }),
};
const deleteGradeByid = {
  params: Joi.object().keys({
    gradeId: Joi.string().required(),
  }),
};

module.exports = {
  createGrade,
  getGradeById,
  updateGrade,
  deleteGradeByid,
};
