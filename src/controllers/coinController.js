const httpStatus = require('http-status');
const {
  createCoin,
  getCoinById,
  getAllCoin,
  getCoinByPrice,
  updateCoinById,
  deleteCoinById,
} = require('../services/coinService');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const topupCoinService = require('../services/topupCoinService');

const createNewCoin = catchAsync(async (req, res) => {
  const { body } = req;
  const coin = await createCoin(body);
  res.sendWrapped(coin, httpStatus.CREATED);
});

const getCoin = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { query } = req;
  let coin = await getAllCoin(query);
  if (!coin.length) throw new ApiError(httpStatus.NOT_FOUND, 'Koin tidak ditemukan');
  const topup = await topupCoinService.firstTopupCoin(id);
  if (topup) {
    const filtering = coin.filter((o) => o.coin !== 100000);
    coin = filtering;
  }
  const sorting = coin.sort((a, b) => a.coin - b.coin);
  res.sendWrapped(sorting, httpStatus.OK);
});

const updateCoin = catchAsync(async (req, res) => {
  const { body } = req;
  const { id } = req.query;
  const coin = await updateCoinById(id, body);
  res.sendWrapped(coin, httpStatus.OK);
});

const deleteCoin = catchAsync(async (req, res) => {
  const { id } = req.query;
  const coin = await deleteCoinById(id);
  if (coin === 0) throw new ApiError(httpStatus.BAD_REQUEST, 'Gagal menghapus Koin');
  res.sendWrapped('Coin berhasil di delete', httpStatus.OK);
});

module.exports = {
  createNewCoin,
  getCoin,
  updateCoin,
  deleteCoin,
};
