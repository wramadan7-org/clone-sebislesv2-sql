const httpStatus = require('http-status');
const { getCurriculumById } = require('../services/curriculumService');
const {
  createGradeGroup,
  getAllGradeGroup,
  updateGradeGroupById,
  deleteGradeGroupByid,
  getGradeGroupById,
} = require('../services/gradeGroupService');
const catchAsync = require('../utils/catchAsync');

const createNewGradeGroup = catchAsync(async (req, res) => {
  const gradeGroupBody = req.body;
  const { curriculumId } = req.body;
  await getCurriculumById(curriculumId);
  const gradeGroup = await createGradeGroup(gradeGroupBody);

  res.sendWrapped(gradeGroup, httpStatus.CREATED);
});

const getGradeGroupAll = catchAsync(async (req, res) => {
  const { query } = req;
  const gradeGroup = await getAllGradeGroup(query);
  res.sendWrapped(gradeGroup, httpStatus.OK);
});
const gradeGroupById = catchAsync(async (req, res) => {
  const { gradeGroupId } = req.params;
  const gradeGroup = await getGradeGroupById(gradeGroupId);
  res.sendWrapped(gradeGroup, httpStatus.OK);
});

const updateGradeGroup = catchAsync(async (req, res) => {
  const { gradeGroupId } = req.params;
  const gradeGroupBody = req.body;
  await getGradeGroupById(gradeGroupId);
  const gradeGroup = await updateGradeGroupById(gradeGroupId, gradeGroupBody);
  res.sendWrapped(gradeGroup, httpStatus.OK);
});

const deleteGradeGroup = catchAsync(async (req, res) => {
  const { gradeGroupId } = req.params;
  await getGradeGroupById(gradeGroupId);
  await deleteGradeGroupByid(gradeGroupId);
  res.sendWrapped('Grade group deleted succesfully', httpStatus.OK);
});
module.exports = {
  createNewGradeGroup,
  getGradeGroupAll,
  updateGradeGroup,
  deleteGradeGroup,
  gradeGroupById,
};
