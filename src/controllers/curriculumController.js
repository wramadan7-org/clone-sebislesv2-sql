const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const curriculumService = require('../services/curriculumService');

const createCurriculum = catchAsync(async (req, res) => {
  const curriculumBody = req.body;

  const curriculum = await curriculumService.createCurriculum(curriculumBody);

  res.sendWrapped(curriculum, httpStatus.CREATED);
});

const getCurriculumAll = catchAsync(async (req, res) => {
  const curriculum = await curriculumService.getCurriculumAll();

  res.sendWrapped(curriculum, httpStatus.OK);
});

const getCurriculumById = catchAsync(async (req, res) => {
  const { curriculumId } = req.params;

  const curriculum = await curriculumService.getCurriculumById(curriculumId);

  res.sendWrapped(curriculum, httpStatus.OK);
});

const updateCurriculum = catchAsync(async (req, res) => {
  const { curriculumId } = req.params;
  const curriculumBody = req.body;

  const checkCurriculum = await curriculumService.getCurriculumAnotherByName(
    curriculumBody.curriculumCode,
    curriculumBody.curriculumName,
  );

  if (checkCurriculum) throw new ApiError(httpStatus.CONFLICT, 'Curriculum already exists.');

  const curriculum = await curriculumService.updateCurriculumById(
    curriculumId,
    curriculumBody,
  );

  res.sendWrapped(curriculum, httpStatus.OK);
});

const deleteCurriculum = catchAsync(async (req, res) => {
  const { curriculumId } = req.params;

  const checkCurriculum = await curriculumService.getCurriculumById(curriculumId);

  const curriculum = await curriculumService.deleteCurriculumById(curriculumId);

  res.sendWrapped(curriculum, httpStatus.OK);
});

module.exports = {
  createCurriculum,
  getCurriculumAll,
  getCurriculumById,
  updateCurriculum,
  deleteCurriculum,
};
