const Joi = require('joi');

const createGradeGroup = {
  body: Joi.object().keys({
    curriculumId: Joi.string().required(),
    gradeGroupCode: Joi.string().required(),
    gradeGroupName: Joi.string().required(),
  }),
};

const getGradeGroupById = {
  params: Joi.object().keys({
    gradeGroupId: Joi.string().required(),
  }),
};

const updateGradeGroup = {
  params: Joi.object().keys({
    gradeGroupId: Joi.string().required(),
  }),

  body: Joi.object().keys({
    gradeGroupCode: Joi.string(),
    gradeGroupName: Joi.string(),
  }),
};
const deleteGradeGroupByid = {
  params: Joi.object().keys({
    gradeGroupId: Joi.string().required(),
  }),
};

module.exports = {
  createGradeGroup,
  getGradeGroupById,
  updateGradeGroup,
  deleteGradeGroupByid,
};
