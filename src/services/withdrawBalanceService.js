const httpStatus = require('http-status');
const { Bank } = require('../models/Bank');
const { User } = require('../models/User');
const { WithdrawBalance } = require('../models/WithdrawBalance');
const ApiError = require('../utils/ApiError');

const getWithdrawRequestById = async (withdrawId) => {
  const withdraw = await WithdrawBalance.findOne({
    where: {
      id: withdrawId,
    },
  });

  return withdraw;
};
const getWithdrawRequestByTeacherId = async (teacherId, limit, offset) => {
  const withdraw = await WithdrawBalance.findAndCountAll({
    where: {
      teacherId,
    },
    limit,
    offset,
    include: [{ model: User }, { model: Bank }],
    order: [['createdAt', 'DESC']],
  });

  return withdraw;
};
const getAllWithdrawRequest = async (limit, offset) => {
  const withdraw = await WithdrawBalance.findAndCountAll({
    limit,
    offset,
    include: [{ model: User }, { model: Bank }],
    order: [['createdAt', 'DESC']],
  });

  return withdraw;
};
const getWithdrawRequestByStatus = async (withdrawStatus, limit, offset) => {
  const withdraw = await WithdrawBalance.findAndCountAll({
    where: {
      status: withdrawStatus,
    },
    limit,
    offset,
    include: [{ model: User }, { model: Bank }],
    order: [['createdAt', 'DESC']],
  });

  return withdraw;
};
const getWithdrawRequestByStatusAndTutorId = async (
  withdrawStatus,
  teacherId,
  limit,
  offset,
) => {
  const withdraw = await WithdrawBalance.findAndCountAll({
    where: {
      teacherId,
      status: withdrawStatus,
    },
    limit,
    offset,
    include: [{ model: User }, { model: Bank }],
    order: [['createdAt', 'DESC']],
  });

  return withdraw;
};
const checkWithdrawRequest = async (withdrawStatus, teacherId) => {
  const withdraw = await WithdrawBalance.findAll({
    where: {
      teacherId,
      status: withdrawStatus,
    },
  });

  return withdraw;
};

const createNewWithdrawRequest = async (withdrawBody) => {
  const withdraw = await WithdrawBalance.create(withdrawBody);
  return withdraw;
};
const updateWithdrawRequest = async (withdrawId, withdrawBody) => {
  const withdraw = await getWithdrawRequestById(withdrawId);
  if (!withdraw) throw new ApiError(httpStatus.NOT_FOUND, 'Withdraw request not found');
  Object.assign(withdraw, withdrawBody);
  withdraw.save();
  return withdraw;
};

const deleteWithdrawRequest = async (withdrawId) => {
  const withdraw = await WithdrawBalance.findOne({
    where: {
      id: withdrawId,
      status: 'pending',
    },
  });
  if (!withdraw) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Pending withdraw balance request not found',
    );
  }
  withdraw.destroy();
  return withdraw;
};

module.exports = {
  getAllWithdrawRequest,
  getWithdrawRequestById,
  getWithdrawRequestByStatus,
  getWithdrawRequestByStatusAndTutorId,
  getWithdrawRequestByTeacherId,
  createNewWithdrawRequest,
  deleteWithdrawRequest,
  updateWithdrawRequest,
  checkWithdrawRequest,
};
