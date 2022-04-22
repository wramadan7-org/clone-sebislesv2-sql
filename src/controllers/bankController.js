const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const bankServices = require('../services/bankService');

const getAllBank = catchAsync(async (req, res) => {
  const banks = await bankServices.getBankAll();

  if (!banks && banks.length <= 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "You don't have bank account.");
  }

  res.sendWrapped(banks, httpStatus.OK);
});

const getBankById = catchAsync(async (req, res) => {
  const { id } = req.query;
  const bank = await bankServices.getBankById(id);

  res.sendWrapped(bank, httpStatus.OK);
});

const getOwnBank = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const bank = await bankServices.getOwnBank(userId);
  res.sendWrapped(bank, httpStatus.OK);
});

const createBank = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { body } = req;
  body.userId = userId;
  const bank = await bankServices.createNewBank(body);

  res.sendWrapped(bank, httpStatus.OK);
});

const updateBank = catchAsync(async (req, res) => {
  const { body } = req;
  const { bankId } = req.query;
  const bank = await bankServices.updateBank(bankId, body);
  res.sendWrapped(body, httpStatus.OK);
});

const deleteBank = catchAsync(async (req, res) => {
  const { id } = req.params;

  const deleted = await bankServices.deleteBank(id);

  res.sendWrapped(deleted, httpStatus.OK);
});

const deleteOwnBank = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const bank = await bankServices.deleteOwnBank(id, userId);

  res.sendWrapped(bank, httpStatus.OK);
});

module.exports = {
  getAllBank,
  getBankById,
  getOwnBank,
  createBank,
  deleteBank,
  deleteOwnBank,
  updateBank,
};
