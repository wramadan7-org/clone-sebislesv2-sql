const httpStatus = require('http-status');
const { Coin } = require('../models/Coin');
const ApiError = require('../utils/ApiError');

/**
 * Get all Coin
 * @return {Promise<ApiError | Coin>}
 */
const getAllCoin = async (query) => {
  const coin = await Coin.findAll({
    where: query,
  });
  return coin;
};

/**
 * Get Coin by id
 * @param {string} id
 * @return {Promise<ApiError | Coin>}
 */
const getCoinById = async (id) => {
  const coin = await Coin.findOne({
    where: {
      id,
    },
  });
  return coin;
};

/**
 * Get Coin by price
 * @param {string} price
 * @return {Promise<ApiError | Coin>}
 */
const getCoinByPrice = async (price) => {
  const coin = await Coin.findOne({
    where: {
      price,
    },
  });
  return coin;
};

/**
 * Create new Coin
 * @param {Object} body
 * @return {Promise<void | Coin>}
 */
const createCoin = async (body) => {
  const coin = await Coin.create(body);
  return coin;
};

/**
 * Update Coin by id
 * @param {string} id
 * @param {Object} body
 * @return {Promise<ApiError|Coin>}
 */
const updateCoinById = async (id, body) => {
  const coin = await getCoinById(id);
  if (!coin) throw new ApiError(httpStatus.NOT_FOUND, 'Coin tidak ditemukan');
  Object.assign(coin, body);
  coin.save();
  return coin;
};

/**
 * Delete Coin by id
 * @param {string} id
 * @return {Promise<ApiError|Coin>}
 */
const deleteCoinById = async (id) => {
  const coin = await getCoinById(id);
  if (!coin) throw new ApiError(httpStatus.NOT_FOUND, 'Koin tidak ditemukan');
  coin.destroy();
  return coin;
};

module.exports = {
  getAllCoin,
  getCoinById,
  getCoinByPrice,
  createCoin,
  updateCoinById,
  deleteCoinById,
};
