const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const tutoringService = require('../services/tutoringTransactionService');

const createTutoringTransaction = catchAsync(async (req, res) => {
  const { id } = req.user;
  const transactionBody = req.body;

  const transaction = await tutoringService.createTransactionLes(id, transactionBody);

  if (!transaction) throw new ApiError(httpStatus.BAD_REQUEST, 'Gagal membuat transaksi.');

  res.sendWrapped(transaction, httpStatus.OK);
});

module.exports = {
  createTutoringTransaction,
};
