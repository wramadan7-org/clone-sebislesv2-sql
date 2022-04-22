const httpStatus = require('http-status');
const moment = require('moment');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const pagination = require('../utils/pagination');
const statusPayment = require('../utils/statusPayment');

const { TopupCoin } = require('../models/TopupCoin');
const { Coin } = require('../models/Coin');

const transactionCoinService = require('../services/transactionCoinService');

const {
  PENDING,
  ACCEPT,
  REJECT,
  CANCEL,
  EXPIRE,
  PROCESS,
  DONE,
  DELETE,
} = process.env;

/*
const transactionCoin = catchAsync(async (req, res) => {
  let transactioBody = {
    item_details: [
      {
        id: '1111111',
        price: 20000,
        quantity: 1,
        name: 'coin ',
        category: 'global',
        merchant_name: 'SEBIS',
      },
      {
        id: '2222212',
        price: 20000,
        quantity: 1,
        name: 'coin ',
        category: 'global',
        merchant_name: 'SEBIS',
      },
    ],
    transaction_details: {
      order_id: '12120022222',
      gross_amount: 40000,
    },
    credit_card: {
      secure: true,
    },
    custom_expiry: {
      order_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      expiry_duration: 10,
      unit: 'minute',
    },
    customer_details: {
      first_name: 'Wahyu',
      last_name: 'Ramadan',
      email: 'wramadan1203@gmail.com',
      phone: 82257022921,
    },
  };

   const transaction = await transactionCoinService.transactionCoin(transactioBody);

   res.sendWrapped(transaction, httpStatus.OK);
 });
*/

const paymentNotif = catchAsync(async (req, res) => {
  const { body } = req;
  await transactionCoinService.notificationSuccessTransaction(body);
});

const actionTransaction = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  let { type } = req.query;

  type.toLowerCase();

  const value = ['approve', 'deny', 'cancel', 'expire', 'refund'];

  if (!value.some((string) => string.includes(type))) {
    return res.sendWrapped('Parameter query anda salah', httpStatus.BAD_REQUEST);
  }

  const approve = await transactionCoinService.actionTransaction(orderId, type);

  const data = {
    bank: approve.bank ? approve.bank : null,
    eci: approve.eci ? approve.eci : null,
    transaction_id: approve.transaction_id ? approve.transaction_id : null,
    masked_card: approve.masked_card ? approve.masked_card : null,
    order_id: approve.order_id ? approve.order_id : null,
    merchant_id: approve.merchant_id ? approve.merchant_id : null,
    payment_type: approve.payment_type ? approve.payment_type : null,
    transaction_time: approve.transaction_time ? moment(approve.transaction_time).format('YYYY-MM-DD HH:mm:ss') : null,
    transaction_status: approve.transaction_status ? approve.transaction_status : null,
    fraud_status: approve.fraud_status ? approve.fraud_status : null,
    gross_amount: approve.gross_amount ? parseInt(approve.gross_amount) : null,
    currency: approve.currency ? approve.currency : null,
    approval_code: approve.approval_code ? parseInt(approve.approval_code) : null,
  };

  const response = {
    status: approve.status_code ? parseInt(approve.status_code) : null,
    message: approve.status_message ? approve.status_message : null,
    data,
  };

  res.send(response);
});

const historyTransaction = catchAsync(async (req, res) => {
  const { id } = req.user;

  let { page, limit } = req.query;

  if (limit) {
    limit = parseInt(limit);
  } else {
    limit = 10;
  }

  if (page) {
    page = parseInt(page);
  } else {
    page = 1;
  }

  const history = await transactionCoinService.historyTransaction(id);

  if (!history || history.length <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'Anda belum pernah melakukan topup koin');

  const filterHistory = history.filter((o) => o.transactionCoins.length > 0);

  const mapHistory = filterHistory.map((o) => {
    const status = statusPayment(o.statusCoin);

    const data = {
      transactionId: o.transactionCoins[0].id,
      orderId: o.id,
      status,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    };

    return data;
  });

  const results = mapHistory.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const paginating = pagination.paginator(results, page, limit);

  res.sendWrapped('', httpStatus.OK, paginating);
});

const historyTransactionDetail = catchAsync(async (req, res) => {
  const { id } = req.params;

  const transaction = await transactionCoinService.transactionCoinById(id, { include: TopupCoin });

  if (!transaction) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan transaksi.');

  const coin = await Coin.findOne(
    {
      where: {
        coin: transaction.topupCoin.coin,
      },
    },
  );

  if (!coin) throw new ApiError(httpStatus.NOT_FOUND, 'Koin tidak ditemukan.');

  const data = {
    transactionId: id,
    orderId: transaction.order_id,
    coinId: coin.id,
    name: 'Sebis Koin',
    coin: transaction.topupCoin.coin,
    price: transaction.topupCoin.price,
    referalCode: null,
    subtotal: transaction.topupCoin.price,
    total: transaction.topupCoin.price,
  };

  res.sendWrapped(data, httpStatus.OK);
});

module.exports = {
  // transactionCoin,
  paymentNotif,
  actionTransaction,
  historyTransaction,
  historyTransactionDetail,
};
