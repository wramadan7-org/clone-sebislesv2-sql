const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { VideoTutorial } = require('../models/VideoTutorial');
const ApiError = require('../utils/ApiError');

const getAllVideoTutorial = async (limit, offset) => {
  const videoTutorial = await VideoTutorial.findAndCountAll({
    limit,
    offset,
  });
  return videoTutorial;
};

const getVideoTutorialById = async (videoTutorialId) => {
  const videoTutorial = await VideoTutorial.findAll({
    where: {
      id: videoTutorialId,
    },
  });
  return videoTutorial;
};

const getVideoTutorialByTitle = async (videoTutorialTitle, limit, offset) => {
  const videoTutorial = await VideoTutorial.findAndCountAll({
    where: {
      title: {
        [Op.like]: `%${videoTutorialTitle}%`,
      },
    },
    limit,
    offset,
  });
  return videoTutorial;
};

const createVideoTutorial = async (videoTutorialBody) => {
  const videoTutorial = await VideoTutorial.create(videoTutorialBody);
  return videoTutorial;
};

const updateVideoTutorialById = async (videoTutorialId, videoTutorialBody) => {
  const videoTutorial = await getVideoTutorialById(videoTutorialId);
  if (!videoTutorial) throw new ApiError(httpStatus.NOT_FOUND, 'Video tutorial not found');
  Object.assign(videoTutorial, videoTutorialBody);
  videoTutorial.save();
  return videoTutorial;
};

const deleteVideoTutorialById = async (videoTutorialId) => {
  const videoTutorial = await getVideoTutorialById(videoTutorialId);
  if (!videoTutorial) throw new ApiError(httpStatus.NOT_FOUND, 'Video tutorial not found');
  videoTutorial.destroy();
  return videoTutorial;
};
module.exports = {
  getAllVideoTutorial,
  getVideoTutorialById,
  getVideoTutorialByTitle,
  updateVideoTutorialById,
  deleteVideoTutorialById,
  createVideoTutorial,
};
