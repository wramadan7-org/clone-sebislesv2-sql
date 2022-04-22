const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const { Bank } = require('../models/Bank');

/**
 * Get all bank account
 * @returns array of object
 */
const getBankAll = async () => {
  const banks = await Bank.findAll();

  return banks;
};

/**
 * Get bank account by Id
 * @param {uuid4} id
 * @returns object
 */
const getBankById = async (id) => {
  const bank = await Bank.findOne({
    where: {
      id,
    },
  });

  if (!bank && bank == undefined) throw new ApiError(httpStatus.NOT_FOUND, 'Bank account not found');

  return bank;
};

/**
 * Get own bank account
 * @param {uuid4} id
 * @param {string} userId
 * @returns object
 */
const getOwnBank = async (userId) => {
  const bank = await Bank.findAll({
    where: {
      userId,
    },
  });

  if (!bank && bank == undefined) throw new ApiError(httpStatus.NOT_FOUND, 'Bank account not found');

  return bank;
};

/**
 * Create or update own bank account
 * @param {uuid4} userId
 * @param {object} bodyBank
 * @returns object
 */
const createOrUpdate = async (userId, bodyBank) => {
  const checkBank = await Bank.findOne({
    where: {
      userId,
    },
  });

  if (checkBank) {
    Object.assign(checkBank, bodyBank);
    checkBank.save();

    return checkBank;
  }

  const data = {
    userId,
    ...bodyBank,
  };
  const insertBank = await Bank.create(data);

  return insertBank;
};

const createNewBank = async (bodyBank) => {
  const bank = await Bank.create(bodyBank);
  return bank;
};

const updateBank = async (bankId, bankBody) => {
  const bank = await getBankById(bankId);
  if (!bank) throw new ApiError(httpStatus.NOT_FOUND, 'Bank account not found');
  Object.assign(bank, bankBody);
  bank.save();
  return bank;
};
/**
 * Delete bank account by Id
 * @param {uuid4} id
 * @returns object
 */
const deleteBank = async (id) => {
  const bank = await getBankById(id);

  if (!bank) throw new ApiError(httpStatus.NOT_FOUND, 'Bank account not found.');

  await bank.destroy();

  return bank;
};

/**
 * Delete own bank account
 * @param {uuid4} id
 * @param {uuid4} userId
 * @returns object
 */
const deleteOwnBank = async (id, userId) => {
  const bank = await getOwnBank(id, userId);

  if (!bank) throw new ApiError(httpStatus.NOT_FOUND, 'Bank account not found.');

  await bank.destroy();

  return bank;
};

module.exports = {
  getBankAll,
  getBankById,
  getOwnBank,
  createOrUpdate,
  deleteBank,
  deleteOwnBank,
  createNewBank,
  updateBank,
};
