const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Price } = require('../models/Price');
const { UserDetail } = require('../models/UserDetail');
const userService = require('./userService');
const userDetailService = require('./userDetailService');

/**
 * Create price
 * @param {object} body
 * @returns object
 */
const createPrice = async (body) => Price.create(body);

/**
 * Get all price
 * @returns array of object
 */
const getAllPrice = async () => Price.findAll();

/**
 * Get price by Id
 * @param {string} id
 * @returns object
 */
const getPriceById = async (id) => {
  const price = await Price.findOne(
    {
      where: {
        id,
      },
    },
  );

  return price;
};

/**
 * Update price by id
 * @param {string} id
 * @param {object} body
 * @returns object
 */
const updatePrice = async (id, body) => {
  const price = await getPriceById(id);

  if (!price) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan harga dengan ID tersebut.');

  Object.assign(price, body);

  return price.save();
};

/**
 * Update teacher price
 * @param {string} userId
 * @param {object} priceBody
 * @returns object
 */
const updateTeacherPrice = async (userId, priceBody) => {
  const checkUserDetail = await userDetailService.getUserDetailByUserId(userId);

  if (!checkUserDetail) {
    const create = await userDetailService.createUserDetail(userId, priceBody);

    if (!create) throw new ApiError(httpStatus.CONFLICT, 'Gagal menambahkan harga pada tutor.');

    return create;
  }

  Object.assign(checkUserDetail, priceBody);

  await checkUserDetail.save();

  return checkUserDetail;
};

module.exports = {
  createPrice,
  getAllPrice,
  getPriceById,
  updatePrice,
  updateTeacherPrice,
};
