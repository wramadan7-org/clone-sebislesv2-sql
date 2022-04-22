const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { Slider } = require('../models/Slider');
const ApiError = require('../utils/ApiError');

const getAllSlider = async (limit, offset) => {
  const slider = await Slider.findAndCountAll({
    limit,
    offset,
  });
  return slider;
};

const getSliderById = async (sliderId) => {
  const slider = await Slider.findAll({
    where: {
      id: sliderId,
    },
  });
  return slider;
};

const getSliderByTitle = async (sliderTitle, limit, offset) => {
  const slider = await Slider.findAndCountAll({
    where: {
      title: {
        [Op.like]: `%${sliderTitle}%`,
      },
    },
    limit,
    offset,
  });
  return slider;
};
const createSlider = async (sliderBody) => {
  const slider = await Slider.create(sliderBody);
  return slider;
};

const updateSliderById = async (sliderId, sliderBody) => {
  const slider = await getSliderById(sliderId);
  if (!slider) throw new ApiError(httpStatus.NOT_FOUND, 'Slider not found');
  Object.assign(slider, sliderBody);
  slider.save();
  return slider;
};

const updateSliderPicture = async (sliderId, file) => {
  let slider = await getSliderById(sliderId);
  if (!slider) throw new ApiError(httpStatus.NOT_FOUND, 'Slider not found');

  await Slider.update(
    {
      picture: file,
    },
    { where: { id: sliderId } },
  );

  slider = await getSliderById(sliderId);
  return slider;
};

const deleteSliderById = async (sliderId) => {
  const slider = await getSliderById(sliderId);
  if (!slider) throw new ApiError(httpStatus.NOT_FOUND, 'Slider not found');
  slider.destroy();
  return slider;
};
module.exports = {
  getAllSlider,
  getSliderById,
  getSliderByTitle,
  updateSliderById,
  deleteSliderById,
  createSlider,
  updateSliderPicture,
};
