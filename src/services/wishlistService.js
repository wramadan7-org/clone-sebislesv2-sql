const httpStatus = require('http-status');
const { Op } = require('sequelize');
const ApiError = require('../utils/ApiError');
const { Wishlist } = require('../models/Wishlist');
const { WishlistItem } = require('../models/WishlistItem');

/**
 * Check between hours
 * @param {string} scheduleTime
 * @param {number} offsetHours
 * @returns boolean
 */
const checkBetweenHours = async (scheduleTime, offsetHours) => {
  const dateNow = new Date();
  let tempCStart = new Date(`${scheduleTime}:00 GMT+0700`);
  let tempDateNow = new Date(`${dateNow} GMT+0700`);
  tempDateNow.setHours(tempDateNow.getHours() + offsetHours);

  if (tempCStart.getTime() < tempDateNow.getTime()) {
    return false;
  }

  return true;
};

/**
 * Check own wishlist, already exists or not
 * @param {string} teacherId
 * @param {array} wishlistId
 * @param {string} teacherSubjectId
 * @param {string} availabilityHoursId
 * @returns boolean
 */
const checkerWishlist = async (teacherId, wishlistId, teacherSubjectId, availabilityHoursId) => {
  const wishlist = await WishlistItem.findAll(
    {
      where: {
        teacherId,
        teacherSubjectId,
        availabilityHoursId,
        wishlistId: {
          [Op.in]: wishlistId,
        },
      },
    },
  );

  if (wishlist && wishlist.length > 0) {
    return true;
  }

  return false;
};

/**
 * Create wishlist
 * @param {string} studentId
 * @param {string} teacherId
 * @param {object} opts
 * @returns array of object
 */
const findOrCreateWishlist = async (studentId, teacherId, opts = {}) => {
  const wihslist = await Wishlist.findOrCreate(
    {
      where: {
        studentId,
        teacherId,
      },
      ...opts,
    },
  );

  return wihslist;
};

/**
 * Get own wishlist and wishlist item
 * @param {string} studentId
 * @param {object} opts
 * @returns array of object
 */
const getWishlistByStudentId = async (studentId, opts = {}) => {
  const wishlist = await Wishlist.findAll(
    {
      where: {
        studentId,
      },
      ...opts,
    },
  );

  return wishlist;
};

/**
 * Create wishlist item
 * @param {array} wishlistId
 * @param {object} wishlistItemBody
 * @returns object
 */
const createWishlistItem = async (wishlistId, wishlistItemBody) => {
  const data = {
    ...wishlistItemBody,
    wishlistId,
  };

  const wishlist = await WishlistItem.create(data);

  return wishlist;
};

/**
 * Get wishlist item by id
 * @param {string} id
 * @param {string} userId
 * @param {object} opts
 * @returns object
 */
const getWishlistItemById = async (id, userId, opts = {}) => {
  // const wishlist = await getWishlistByStudentId(userId);

  const wishlistItem = await WishlistItem.findOne(
    {
      where: {
        id,
      },
      ...opts,
    },
  );

  if (!wishlistItem) throw new ApiError(httpStatus.NOT_FOUND, 'Item tidak ditemukan.');

  return wishlistItem;
};

/**
 * Deete wishlist item by id
 * @param {string} id
 * @param {object} opts
 * @returns boolean || 1/2
 */
const deleteWishlistItemById = async (id, opts = {}) => WishlistItem.destroy(
  {
    where: {
      id,
    },
  },
);

module.exports = {
  findOrCreateWishlist,
  getWishlistByStudentId,
  getWishlistItemById,
  createWishlistItem,
  checkerWishlist,
  checkBetweenHours,
  deleteWishlistItemById,
};
