const httpStatus = require('http-status');
const {
  getAllSlider,
  getSliderByTitle,
  getSliderById,
  createSlider,
  updateSliderById,
  deleteSliderById,
  updateSliderPicture,
} = require('../services/sliderService');
const catchAsync = require('../utils/catchAsync');
const { definePage, getPagingData } = require('../utils/pagination');
const multering = require('../utils/multer');
const resizing = require('../utils/resizeImage');

const getSlider = catchAsync(async (req, res) => {
  const { title } = req.query;
  const { page, size, offset } = definePage(req.query.page, req.query.size);
  let slider;
  slider = await getAllSlider(size, offset);
  if (title) {
    slider = await getSliderByTitle(title, size, offset);
  }

  const result = getPagingData(slider, page, size);

  res.sendWrapped(result, httpStatus.OK);
});

const createNewSlider = catchAsync(async (req, res) => {
  const { body } = req;
  const slider = await createSlider(body);
  res.sendWrapped(slider, httpStatus.CREATED);
});

const updateSlider = catchAsync(async (req, res) => {
  const { body } = req;
  const { id } = req.query;
  const slider = await updateSliderById(id, body);
  res.sendWrapped(slider, httpStatus.OK);
});

const deleteSlider = catchAsync(async (req, res) => {
  const { id } = req.query;
  await deleteSliderById(id);
  res.sendWrapped('Slider berahsil di hapus', httpStatus.OK);
});

const createFilePictureSlider = catchAsync(async (req, res) => {
  const { id } = req.query;
  const destination = 'images/slider';

  multering.options('./', id).single('filePicture')(req, res, async (err) => {
    if (err) {
      return res.sendWrapped(err);
    }

    if (!req.file || !req.file.filename) {
      return res.sendWrapped(
        'Please insert file/photo!',
        httpStatus.BAD_REQUEST,
      );
    }

    const profile = await updateSliderPicture(
      id,
      `static/${destination}/${req.file.filename}`,
    );

    await resizing(
      req.file.path,
      800,
      500,
      100,
      `./public/${destination}/${req.file.filename}`,
    );

    res.sendWrapped(profile, httpStatus.OK);
  });
});
module.exports = {
  getSlider,
  createNewSlider,
  updateSlider,
  deleteSlider,
  createFilePictureSlider,
};
