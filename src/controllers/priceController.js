const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const priceService = require('../services/priceService');
const userDetailService = require('../services/userDetailService');

const createPrice = catchAsync(async (req, res) => {
  const priceBody = req.body;

  const price = await priceService.createPrice(priceBody);

  if (!price) throw new ApiError(httpStatus.CONFLICT, 'Gagal menambah harga.');

  res.sendWrapped(price, httpStatus.CREATED);
});

const getPriceById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const price = await priceService.getPriceById(id);

  if (!price) throw new ApiError(httpStatus.NOT_FOUND, 'Harga yang anda maksut tidak ada.');

  res.sendWrapped(price, httpStatus.OK);
});

const updatePriceById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const priceBody = req.body;
  const price = await priceService.updatePrice(id, priceBody);

  res.sendWrapped(price, httpStatus.OK);
});

const updateTeacherPrice = catchAsync(async (req, res) => {
  const { id } = req.params;
  const priceId = req.body;

  const price = await priceService.updateTeacherPrice(id, priceId);

  if (!price) throw new ApiError(httpStatus.CONFLICT, 'Gagal menambah harga untuk tutor.');

  res.sendWrapped(price, httpStatus.OK);
});

module.exports = {
  createPrice,
  getPriceById,
  updatePriceById,
  updateTeacherPrice,
};
