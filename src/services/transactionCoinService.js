const httpStatus = require('http-status');
const moment = require('moment');
const axios = require('axios');
const midtransClient = require('midtrans-client');
const ApiError = require('../utils/ApiError');
const { midtransEnvironment } = require('../config/midtrans');
const payWith = require('../utils/paymentWith');
const notif = require('../utils/notification');

const { User } = require('../models/User');
const { TransactionCoin } = require('../models/TransactionCoin');
const { TopupCoin } = require('../models/TopupCoin');

const userService = require('./userService');
const topupService = require('./topupCoinService');
const deviceService = require('./deviceService');

const {
  PENDING,
  ACCEPT,
  REJECT,
  CANCEL,
  EXPIRE,
  PROCESS,
  DONE,
  DELETE,
  MIDTRANS_ENVIRONMENT,
  MIDTRANS_SERVER_KEY_PROD,
  MIDTRANS_CLIENT_KEY_PROD,
  MIDTRANS_SERVER_KEY_DEV,
  MIDTRANS_CLIENT_KEY_DEV,
} = process.env;

let snap;
let midtransApiUrl;
let defaultMidtransApi;
let midtransAuth;

switch (MIDTRANS_ENVIRONMENT) {
  case midtransEnvironment.PRODUCTION:
    snap = new midtransClient.Snap(
      {
        isProduction: true,
        serverKey: MIDTRANS_SERVER_KEY_PROD,
        clientKey: MIDTRANS_CLIENT_KEY_PROD,
      },
    );
    midtransApiUrl = 'https://api.midtrans.com/v2/token';
    defaultMidtransApi = 'https://api.midtrans.com/v2';
    midtransAuth = MIDTRANS_SERVER_KEY_PROD;
    break;

  case midtransEnvironment.DEVELOPMENT:
    snap = new midtransClient.Snap(
      {
        isProduction: false,
        serverKey: MIDTRANS_SERVER_KEY_DEV,
        clientKey: MIDTRANS_CLIENT_KEY_DEV,
      },
    );
    midtransApiUrl = 'https://api.sandbox.midtrans.com/v2/token';
    defaultMidtransApi = 'https://api.sandbox.midtrans.com/v2';
    midtransAuth = MIDTRANS_SERVER_KEY_DEV;
    break;

  default:
    snap = new midtransClient.Snap(
      {
        isProduction: false,
        serverKey: MIDTRANS_SERVER_KEY_DEV,
        clientKey: MIDTRANS_CLIENT_KEY_DEV,
      },
    );
    midtransApiUrl = 'https://api.sandbox.midtrans.com/v2/token';
    break;
}

/**
 * Create request transaction in midtrans use snap
 * @param {object} parameter
 * @returns object
 */
const transactionCoin = async (parameter) => {
  const create = await snap.createTransaction(parameter);

  if (!create) throw new ApiError(httpStatus.CONFLICT, 'Pembelian koin gagal.');
  return create;
};

/**
 * Get notification callback from midtrans use snap
 * @param {object} body
 */
const notificationSuccessTransaction = async (body) => {
  const notification = await snap.transaction.notification(body);

  let orderId = notification.order_id;
  let transactionStatus = notification.transaction_status;
  let fraudStatus = notification.fraud_status;
  // console.log('ini notifikasi kartu kredit', notification);
  console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

  const paymentBy = payWith(notification);

  let referralCoin = 0;
  let referralOwner = 0;

  let dataTransaction = {
    id: notification.transaction_id,
    paymentType: notification.payment_type,
    status: transactionStatus,
    order_id: orderId,
    paymentUsing: paymentBy,
    paymentAt: notification.settlement_time ? moment(notification.settlement_time).format('YYYY-MM-DD HH:mm:ss') : null,
  };

  // console.log('ini data transaksi', notification);

  // Ambil data topup untuk mengecek status topup
  const topup = await topupService.topupById(orderId);

  if (!topup) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan data topup.');

  let transaction = await TransactionCoin.findOne(
    {
      where: {
        id: notification.transaction_id,
      },
    },
  );

  // Jika sudah ada data transaksi di DB, maka update, jika tidak ada maka buat data
  if (transaction) {
    // console.log('transaksiiiii', transaction);
    Object.assign(transaction, dataTransaction);
    transaction.save();
  } else {
    transaction = await TransactionCoin.create(dataTransaction);
  }

  // console.log('ini awal transaksi', transaction);

  if (transactionStatus == 'capture') {
    if (fraudStatus == 'challenge') {
      dataTransaction = {
        id: notification.transaction_id,
        paymentType: notification.payment_type,
        status: 'challenge',
        order_id: orderId,
        paymentAt: moment(notification.transaction_time).format('YYYY-MM-DD HH:mm:ss'),
      };

      Object.assign(transaction, dataTransaction);
      Object.assign(topup, { statusCoin: PROCESS });

      transaction.save();
      topup.save();
      // console.log('ini status ketika challenge', notification);
      console.log('challenge');
    } else if (fraudStatus == 'accept') {
      dataTransaction = {
        id: notification.transaction_id,
        paymentType: notification.payment_type,
        status: transactionStatus,
        order_id: orderId,
        paymentAt: moment(notification.transaction_time).format('YYYY-MM-DD HH:mm:ss'),
      };

      // console.log('ini transaction', transaction);
      if (topup.statusCoin == PROCESS) {
        const getUser = await userService.getUserById(topup.userId);
        const totalSaldo = parseInt(topup.coin) + parseInt(getUser.coin);

        if (topup.referralCode) {
          referralOwner = 5000;
          referralCoin = 2500;

          const referrer = await User.findOne(
            {
              where: {
                referralCode: topup.referralCode,
              },
            },
          );

          Object.assign(referrer, { coin: referrer.coin + referralOwner });

          referrer.save();
        }

        await userService.updateUserById(topup.userId, { coin: totalSaldo + referralCoin });
      }

      Object.assign(transaction, dataTransaction);
      Object.assign(topup, { statusCoin: DONE });

      transaction.save();
      topup.save();
      // console.log('ini status ketika berhasil/accept', notification);
      console.log('accept');

      // const studentDevice = await deviceService.getOwnDevice(topup.userId);

      // if (studentDevice && studentDevice.length > 0) {
      //   const mapRegisteredToken = studentDevice.map((o) => o.registeredToken);
      //   notif(
      //     mapRegisteredToken,
      //     'Pembayaran berhasil',
      //     topup.referralCode ? 'Terimakasih telah melakukan pembayaran, anda juga mendapatkan bonus koin 2.500' : 'Terimakasih telah melakukan pembayaran',
      //     'student',
      //   );
      // }
    }
  } else if (transactionStatus == 'settlement') {
    // const topup = await topupService.topupById(orderId, { include: User });

    // if (!topup) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan data topup.');

    if (topup.statusCoin == PENDING) {
      const getUser = await userService.getUserById(topup.userId);
      const totalSaldo = parseInt(topup.coin) + parseInt(getUser.coin);

      if (topup.referralCode) {
        referralOwner = 5000;
        referralCoin = 2500;

        const referrer = await User.findOne(
          {
            where: {
              referralCode: topup.referralCode,
            },
          },
        );

        Object.assign(referrer, { coin: referrer.coin + referralOwner });

        referrer.save();
      }

      await userService.updateUserById(topup.userId, { coin: totalSaldo + referralCoin });
    }

    Object.assign(topup, { statusCoin: DONE });

    topup.save();

    console.log('settlement');
  } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
    let defineStatus;

    if (transactionStatus == 'cancel') {
      defineStatus = CANCEL;
    } else if (transactionStatus == 'expire') {
      defineStatus = EXPIRE;
    } else {
      defineStatus = REJECT;
    }

    Object.assign(topup, { statusCoin: defineStatus });

    topup.save();

    console.log(`Transaction ${transactionStatus}`);
  } else if (transactionStatus == 'pending') {
    console.log('pending');
  }
};

/**
 * Action to change status midtrans
 * @param {string} orderId
 * @param {string} type
 * @returns
 */
const actionTransaction = async (orderId, type) => {
  const approve = await axios({
    method: 'post',
    url: `${defaultMidtransApi}/${orderId}/${type}`,
    headers: {
      'content-type': 'application/json',
    },
    auth: {
      username: midtransAuth,
      password: '',
    },
  });

  // console.log(approve);
  return approve.data;
};

/**
 * Get own history data transaction coin
 * @param {string} userId
 * @returns array
 */
const historyTransaction = async (userId) => {
  const history = await topupService.ownTopupCoin(userId, { include: TransactionCoin });

  return history;
};

/**
 * Get transaction coin by id
 * @param {string} id
 * @returns object
 */
const transactionCoinById = async (id, opts = {}) => {
  const transaction = await TransactionCoin.findOne(
    {
      where: {
        id,
      },
      ...opts,
    },
  );

  return transaction;
};

module.exports = {
  transactionCoin,
  notificationSuccessTransaction,
  actionTransaction,
  historyTransaction,
  transactionCoinById,
};
