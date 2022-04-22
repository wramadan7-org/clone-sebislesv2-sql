const httpStatus = require('http-status');
const { getOwnBank, getBankById } = require('../services/bankService');
const {
  getUserById,
  updateUserById,
  getUserByEmail,
} = require('../services/userService');
const {
  createNewWithdrawRequest,
  getWithdrawRequestByTeacherId,
  getWithdrawRequestByStatusAndTutorId,
  getAllWithdrawRequest,
  getWithdrawRequestByStatus,
  updateWithdrawRequest,
  getWithdrawRequestById,
  checkWithdrawRequest,
  deleteWithdrawRequest,
} = require('../services/withdrawBalanceService');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { definePage, getPagingData } = require('../utils/pagination');

const createWithdrawRequest = catchAsync(async (req, res) => {
  const { body } = req;
  const userId = req.user.id;
  const totalAmount = body.amount + 6500;
  const { coin } = await getUserById(userId);
  const bank = await getBankById(body.bankId);

  const checkWithdraw = await checkWithdrawRequest('pending', userId);

  if (checkWithdraw.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Hapus permintaan penarikan Anda yang tertunda terlebih dahulu',
    );
  }
  if (!bank) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Rekening bank tidak terdaftar');
  }

  if (totalAmount > coin) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Saldo tidak cukup');
  }

  const data = {
    bankId: body.bankId,
    transferCost: 6500,
    amount: body.amount,
    totalAmount,
    teacherId: userId,
  };
  const withdraw = await createNewWithdrawRequest(data);
  res.sendWrapped(withdraw, httpStatus.CREATED);
});

const getUserWithdrawRequest = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { status } = req.query;
  const { page, size, offset } = definePage(req.query.page, req.query.size);
  let withdraw;
  withdraw = await getWithdrawRequestByTeacherId(userId, size, offset);
  if (status) {
    withdraw = await getWithdrawRequestByStatusAndTutorId(
      status,
      userId,
      size,
      offset,
    );
  }

  const result = getPagingData(withdraw, page, size);

  res.sendWrapped(result, httpStatus.OK);
});

const getWithdrawRequestForAdmin = catchAsync(async (req, res) => {
  const { status, id } = req.query;
  const { page, size, offset } = definePage(req.query.page, req.query.size);
  let withdraw;
  withdraw = await getAllWithdrawRequest(size, offset);

  if (status) {
    withdraw = await getWithdrawRequestByStatus(status, size, offset);
  }

  const result = getPagingData(withdraw, page, size);
  res.sendWrapped(result, httpStatus.OK);
});

const getWithdrawByid = catchAsync(async (req, res) => {
  const { id } = req.params;
  const withdraw = await getWithdrawRequestById(id);
  if (!withdraw) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Permintaan penarikan tidak ditemukan',
    );
  }
  res.sendWrapped(withdraw, httpStatus.OK);
});

const updateWithdrawForAdmin = catchAsync(async (req, res) => {
  const { body } = req;
  const { withdrawId } = req.query;

  const withdraw = await getWithdrawRequestById(withdrawId);
  if (!withdraw) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Permintaan penarikan saldo tidak ditemukan',
    );
  }
  const { coin } = await getUserById(withdraw.teacherId);

  let userData;
  let result;
  let withdrawData;

  if (body.status === 'accept' && withdraw.status === 'pending') {
    withdrawData = {
      status: body.status,
    };
    userData = {
      coin: coin - withdraw.totalAmount,
    };
    await updateUserById(withdraw.teacherId, userData);
  } else if (body.status === 'failed' && withdraw.status === 'accept') {
    withdrawData = {
      status: body.status,
    };
    userData = {
      coin: coin + withdraw.totalAmount,
    };
    await updateUserById(withdraw.teacherId, userData);
  } else {
    withdrawData = {
      status: body.status,
    };
  }

  result = await updateWithdrawRequest(withdrawId, withdrawData);

  res.sendWrapped(result, httpStatus.OK);
});

const deletePendingWithdrawRequest = catchAsync(async (req, res) => {
  const { withdrawId } = req.query;
  await deleteWithdrawRequest(withdrawId);
  res.sendWrapped('Permintaan penarikan kamu berhasil di hapus', httpStatus.OK);
});

const checkPinUser = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const user = await getUserById(userId);
  let result;
  let httpCode;
  if (user.pin === null || !user.pin) {
    result = 'Kamu belum memiliki pin untuk penarikan';
    httpCode = httpStatus.NOT_FOUND;
  } else {
    result = 'Kamu memiliki pin';
    httpCode = httpStatus.OK;
  }

  res.sendWrapped(result, httpCode);
});

module.exports = {
  createWithdrawRequest,
  getUserWithdrawRequest,
  getWithdrawRequestForAdmin,
  updateWithdrawForAdmin,
  deletePendingWithdrawRequest,
  checkPinUser,
  getWithdrawByid,
};
