const httpStatus = require('http-status');
const { EducationBackground } = require('../models/EducationBackground');
const ApiError = require('../utils/ApiError');

const createEducationBackground = async (teacherId, educationBody) => {
  const data = {
    teacherId,
    ...educationBody,
  };

  const created = await EducationBackground.create(data);
  return created;
};

const getEducationBackgroundById = async (teacherId, educationBackgroundId) => {
  const educationBackground = await EducationBackground.findOne(
    {
      where: {
        id: educationBackgroundId,
        teacherId,
      },
    },
  );
  return educationBackground;
};

const getEducationBackground = async (teacherId) => {
  const eduBackground = await EducationBackground.findAll(
    {
      where: {
        teacherId,
      },
    },
  );

  if (!eduBackground && eduBackground.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'You don\'t have education background');

  return eduBackground;
};

const updateEducationBackground = async (teacherId, educationBackgroundId, data) => {
  const educationBackground = await getEducationBackgroundById(
    teacherId,
    educationBackgroundId,
  );

  if (!educationBackgroundId) throw new ApiError(httpStatus.NOT_FOUND, 'Education background not found.');

  Object.assign(educationBackground, data);
  educationBackground.save();

  return educationBackground;
};

const deletedEducationBackground = async (teacherId, educationBackgroundId) => {
  const educationBackground = await getEducationBackgroundById(teacherId, educationBackgroundId);

  if (!educationBackground) throw new ApiError(httpStatus.NOT_FOUND, 'Education background not found.');

  educationBackground.destroy();
  return educationBackground;
};

module.exports = {
  createEducationBackground,
  getEducationBackgroundById,
  getEducationBackground,
  updateEducationBackground,
  deletedEducationBackground,
};
