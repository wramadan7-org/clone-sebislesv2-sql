const httpStatus = require('http-status');
const { Subject } = require('../models/Subject');
const ApiError = require('../utils/ApiError');

const getSubjectById = async (subjectId, opts = {}) => {
  const subject = Subject.findOne({
    where: {
      id: subjectId,
    },
    ...opts,
  });
  if (!subject) throw new ApiError(httpStatus.NOT_FOUND, 'subject Not Found');
  return subject;
};

const getSubjectByCode = async (subjectCode, opts = {}) => {
  const subject = await Subject.findOne({
    where: {
      subjectCode,
    },
  });
  if (!subject) throw new ApiError(httpStatus.NOT_FOUND, 'subject not found');
  return subject;
};

const getSubjectAll = async (query) => {
  const subject = await Subject.findAll({
    where: query,
  });
  if (!subject) throw new ApiError(httpStatus.NOT_FOUND, 'subject not found');
  return subject;
};

const createSubject = async (subjectBody) => {
  const checkSubject = await Subject.findOne({
    where: {
      subjectCode: subjectBody.subjectCode,
    },
  });
  if (checkSubject) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `Subject with code ${subjectBody.subjectCode} already created`,
    );
  }
  const subject = await Subject.create(subjectBody);
  return subject;
};

const updateSubjectById = async (subjectId, subjectBody) => {
  const subject = await getSubjectById(subjectId);
  Object.assign(subject, subjectBody);
  await subject.save();
  return subject;
};

const deleteSubjectById = async (subjectId) => {
  const subject = await getSubjectById(subjectId);
  if (!subject) throw new ApiError(httpStatus.NOT_FOUND, 'subject not found');
  subject.destroy();
  return subject;
};
module.exports = {
  getSubjectById,
  getSubjectAll,
  getSubjectByCode,
  createSubject,
  deleteSubjectById,
  updateSubjectById,
};
