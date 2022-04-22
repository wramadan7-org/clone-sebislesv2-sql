const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { TopupCoin } = require('../models/TopupCoin');

const { DONE } = process.env;

/**
 * Check topup with price 100.000
 * @param {string} userId
 * @returns boolean
 */
const firstTopupCoin = async (userId) => {
  const topupCoin = await TopupCoin.findOne(
    {
      where: {
        userId,
        price: 100000,
        statusCoin: DONE,
      },
    },
  );

  if (!topupCoin) return false;

  return topupCoin;
};

/**
 * Get data topup by id
 * @param {string} id
 * @param {object} opts
 * @returns object
 */
const topupById = async (id, opts = {}) => {
  const topup = await TopupCoin.findOne(
    {
      where: {
        id,
      },
      ...opts,
    },
  );

  return topup;
};

/**
 * Get all own data topup
 * @param {string} userId
 * @param {object} opts
 * @returns array
 */
const ownTopupCoin = async (userId, opts = {}) => {
  const topupCoin = await TopupCoin.findAll(
    {
      where: {
        userId,
      },
      ...opts,
    },
  );

  return topupCoin;
};

/**
 * Get all data topup coin
 * @param {object} opts
 * @returns array
 */
const allTopupCoin = async (opts = {}) => {
  const topupCoin = await TopupCoin.findAll(
    {
      ...opts,
    },
  );

  return topupCoin;
};

/**
 * Create data topup and send link snap to process checkout/payment
 * @param {string} userId
 * @param {object} topupBody
 * @returns object
 */
const topup = async (userId, topupBody) => {
  const data = {
    userId,
    ...topupBody,
  };

  const topupCoin = await TopupCoin.create(data);

  return topupCoin;
};

/**
 * Update status topup
 * @param {string} id
 * @param {string} status
 * @returns object
 */
const updateStatusTopUp = async (id, status) => {
  const topupCoin = await topupById(id);

  if (!topupCoin) throw new ApiError(httpStatus.NOT_FOUND, 'Topup tidak ditemukan.');

  const data = {
    statusCoin: status,
  };

  Object.assign(topupCoin, data);

  return topupCoin;
};

/**
 * Check user is avail to use referral code or not
 * @param { String } userId
 * @returns { Promise <Boolean> }
 */
const isAvailReferral = async (userId) => {
  const availReferral = await TopupCoin.findAll(
    {
      where: {
        userId,
      },
    },
  );

  if (availReferral && availReferral.length > 0) {
    const filteringReferral = availReferral.filter((o) => o.referralCode && o.statusCoin == DONE);

    return filteringReferral ? false : true;
  }

  return true;
};

module.exports = {
  firstTopupCoin,
  ownTopupCoin,
  allTopupCoin,
  topup,
  topupById,
  updateStatusTopUp,
  isAvailReferral,
};
