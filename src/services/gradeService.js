const httpStatus = require('http-status');
const { Grade } = require('../models/Grade');
const { GradeGroup } = require('../models/GradeGroup');
const ApiError = require('../utils/ApiError');

const getGradeById = async (gradeId, opts = {}) => {
  const grade = Grade.findOne({
    where: {
      id: gradeId,
    },
    ...opts,
  });
  if (!grade) throw new ApiError(httpStatus.NOT_FOUND, 'Grade Not Found');
  return grade;
};

const getGradeByCode = async (gradeCode, opts = {}) => {
  const grade = await Grade.findAll({
    where: {
      gradeCode,
    },
    include: [{ model: GradeGroup }],
  });
  if (!grade) throw new ApiError(httpStatus.NOT_FOUND, 'Grade not found');
  return grade;
};
const getGradeAll = async (query) => {
  const grade = await Grade.findAll({
    where: query,
    include: [{ model: GradeGroup }],
  });
  if (!grade) throw new ApiError(httpStatus.NOT_FOUND, 'Grade not found');
  return grade;
};

const createGrade = async (gradeBody) => {
  const checkGrade = await Grade.findOne({
    where: {
      gradeCode: gradeBody.gradeCode,
    },
  });
  if (checkGrade) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `Grade with code ${gradeBody.gradeCode} already created`,
    );
  }
  const grade = await Grade.create(gradeBody);
  return grade;
};

const updateGradeById = async (gradeId, gradeBody) => {
  const grade = await getGradeById(gradeId);
  Object.assign(grade, gradeBody);
  await grade.save();
  return grade;
};

const deleteGradeById = async (gradeId) => {
  const grade = await getGradeById(gradeId);
  grade.destroy();
  return grade;
};
module.exports = {
  createGrade,
  getGradeById,
  getGradeAll,
  getGradeByCode,
  updateGradeById,
  deleteGradeById,
};
