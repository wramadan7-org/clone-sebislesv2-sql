const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const { TutoringTransaction } = require('../models/TutoringTransaction');
const { TutoringTransactionDetail } = require('../models/TutoringTransactionDetail');

/**
 * Create transaction les.
 * @param {string} studentId
 * @param {object} transactionBody
 * @returns object
 */
const createTransactionLes = async (studentId, transactionBody) => {
  const data = {
    studentId,
    ...transactionBody,
  };

  const transaction = await TutoringTransaction.create(data);

  return transaction;
};

/**
 * Create transaction detail les
 * @param {Array.<Object>} transactionBody
 * @returns object.<Array>
 */
const createTransactionDetailLes = async (transactionBody) => TutoringTransactionDetail.bulkCreate(transactionBody);

/**
 * Delete transaction les
 * @param {id} id
 * @returns object
 */
const deleteTransactionLesById = async (id) => {
  const deleting = await TutoringTransaction.destroy(id);

  return deleting;
};

module.exports = {
  createTransactionLes,
  createTransactionDetailLes,
  deleteTransactionLesById,
};
