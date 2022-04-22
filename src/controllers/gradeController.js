const httpStatus = require('http-status');
const { getGradeGroupById } = require('../services/gradeGroupService');
const {
  createGrade,
  getGradeAll,
  updateGradeById,
  deleteGradeById,
} = require('../services/gradeService');
const catchAsync = require('../utils/catchAsync');

const createNewGrade = catchAsync(async (req, res) => {
  const { gradeGroupId } = req.body;
  const gradeBody = req.body;
  await getGradeGroupById(gradeGroupId);
  const grade = await createGrade(gradeBody);
  res.sendWrapped(grade, httpStatus.CREATED);
});

const getGrade = catchAsync(async (req, res) => {
  const { query } = req;
  const grade = await getGradeAll(query);
  res.sendWrapped(grade, httpStatus.OK);
});

const updateGrade = catchAsync(async (req, res) => {
  const { gradeId } = req.params;
  const gradeBody = req.body;
  const grade = await updateGradeById(gradeId, gradeBody);
  res.sendWrapped(grade, httpStatus.OK);
});

const deleteGrade = catchAsync(async (req, res) => {
  const { gradeId } = req.params;
  await deleteGradeById(gradeId);
  res.sendWrapped('Grade deleted successfully', httpStatus.OK);
});
module.exports = {
  createNewGrade,
  getGrade,
  updateGrade,
  deleteGrade,
};
