const Joi = require('joi');

const createSubject = {
  body: Joi.object().keys({
    subjectCode: Joi.string().required(),
    subjectName: Joi.string().required(),
  }),
};

const getSubjectById = {
  params: Joi.object().keys({
    subjectId: Joi.string().required(),
  }),
};

const updateSubject = {
  params: Joi.object().keys({
    subjectId: Joi.string().required(),
  }),

  body: Joi.object().keys({
    subjectCode: Joi.string(),
    subjectName: Joi.string(),
  }),
};
const deleteSubject = {
  params: Joi.object().keys({
    subjectId: Joi.string().required(),
  }),
};

module.exports = {
  createSubject,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
