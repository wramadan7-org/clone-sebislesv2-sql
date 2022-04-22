const httpStatus = require('http-status');
const {
  createSubject,
  getSubjectAll,
  updateSubjectById,
  deleteSubjectById,
} = require('../services/subjectService');
const catchAsync = require('../utils/catchAsync');

const createNewSubject = catchAsync(async (req, res) => {
  const subjectBody = req.body;
  const subject = await createSubject(subjectBody);
  res.sendWrapped(subject, httpStatus.CREATED);
});

const getSubject = catchAsync(async (req, res) => {
  const { query } = req;
  const subject = await getSubjectAll(query);
  res.sendWrapped(subject, httpStatus.OK);
});

const updateSubject = catchAsync(async (req, res) => {
  const { subjectId } = req.params;
  const subjectBody = req.body;
  const subject = await updateSubjectById(subjectId, subjectBody);
  res.sendWrapped(subject, httpStatus.OK);
});

const deleteSubject = catchAsync(async (req, res) => {
  const { subjectId } = req.params;
  await deleteSubjectById(subjectId);
  res.sendWrapped('subject deleted successfully', httpStatus.OK);
});
module.exports = {
  createNewSubject,
  getSubject,
  updateSubject,
  deleteSubject,
};
