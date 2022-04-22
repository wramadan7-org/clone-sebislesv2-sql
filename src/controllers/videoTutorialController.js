const httpStatus = require('http-status');

const catchAsync = require('../utils/catchAsync');
const { definePage, getPagingData } = require('../utils/pagination');
const multering = require('../utils/multer');
const resizing = require('../utils/resizeImage');
const {
  getAllVideoTutorial,
  getVideoTutorialByTitle,
  createVideoTutorial,
  updateVideoTutorialById,
  deleteVideoTutorialById,
} = require('../services/videoTutorial');

const getVideoTutorial = catchAsync(async (req, res) => {
  const { title } = req.query;
  const { page, size, offset } = definePage(req.query.page, req.query.size);
  let videoTutorial;
  videoTutorial = await getAllVideoTutorial(size, offset);
  if (title) {
    videoTutorial = await getVideoTutorialByTitle(title, size, offset);
  }

  const result = getPagingData(videoTutorial, page, size);

  res.sendWrapped(result, httpStatus.OK);
});

const createNewVideoTutorial = catchAsync(async (req, res) => {
  const { body } = req;
  const videoTutorial = await createVideoTutorial(body);
  res.sendWrapped(videoTutorial, httpStatus.CREATED);
});

const updateVideoTutorial = catchAsync(async (req, res) => {
  const { body } = req;
  const { id } = req.query;
  const videoTutorial = await updateVideoTutorialById(id, body);
  res.sendWrapped(videoTutorial, httpStatus.OK);
});

const deleteVideoTutorial = catchAsync(async (req, res) => {
  const { id } = req.query;
  await deleteVideoTutorialById(id);
  res.sendWrapped('Video tutorial berahsil di hapus', httpStatus.OK);
});

module.exports = {
  getVideoTutorial,
  createNewVideoTutorial,
  updateVideoTutorial,
  deleteVideoTutorial,
};
