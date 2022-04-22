const httpStatus = require('http-status');
const moment = require('moment');
const { Op } = require('sequelize');
const uuid = require('uuid');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const topupService = require('../services/topupCoinService');
const userService = require('../services/userService');
const transactionCoinService = require('../services/transactionCoinService');
const coinService = require('../services/coinService');
const { User } = require('../models/User');
const { Role } = require('../models/Role');

const {
  PENDING,
  ACCEPT,
  REJECT,
  CANCEL,
  EXPIRE,
  PROCESS,
  DONE,
  EXPIRE_TIME,
  REFERRAL_PERCENT,
} = process.env;

const topupCoin = catchAsync(async (req, res) => {
  const { coinId, referralCode } = req.body;
  const { id } = req.user;
  let referral = null;

  const coin = await coinService.getCoinById(coinId);

  if (!coin) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan koin yang anda maksud.');

  if (referralCode && referralCode !== '') {
    // const isAvailReferral = await topupService.isAvailReferral(id);

    // console.log('AVAIL REFERRAL', isAvailReferral);

    // if (!isAvailReferral) throw new ApiError(httpStatus.CONFLICT, 'Anda sudah mencapai batas maksimum untuk menggunakan kode referal.');

    const userReferrer = await User.findOne(
      {
        where: {
          referralCode,
          id: {
            [Op.notLike]: id,
          },
        },
        include: {
          model: Role,
        },
      },
    );

    if (userReferrer) {
      referral = userReferrer.referralCode;
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Kode referal tidak ditemukan, harap masukkan kode referal dengan benar.');
    }
  }

  const checkCoinTransaction = await topupService.firstTopupCoin(id);

  if (checkCoinTransaction && checkCoinTransaction.id == coinId) throw new ApiError(httpStatus.BAD_REQUEST, 'Pembelian koin dengan harga Rp. 100.000,00. Hanya dapat dilakukan sekali.');

  let discount = referral ? REFERRAL_PERCENT : 0;
  let subtotal = coin.price;
  let priceDiscount = coin.price * (REFERRAL_PERCENT / 100);
  let total = referral ? subtotal - priceDiscount : coin.price;

  const topupData = {
    userId: id,
    coin: coin.coin,
    price: coin.price,
    statusCoin: PENDING,
    referralCode: referral ? referral : null,
    discount,
    subtotal,
    total,
  };

  const topup = await topupService.topup(id, topupData);

  if (!topup) throw new ApiError(httpStatus.CONFLICT, 'Gagal melakukan topup.');

  const user = await userService.getUserById(id);

  if (!user) throw new ApiError(httpStatus.CONFLICT, 'Tidak dapat menemukan user.');

  const dataTransaction = referral ? {
    item_details: [
      {
        id: topup.id,
        quantity: 1,
        name: `${topup.coin} coin`,
        category: coin.price == 100000 ? 'limit' : 'global',
        merchant_name: 'SEBIS',
        price: topup.price,
      },
      {
        id: uuid.v4(),
        quantity: 1,
        name: 'Referral',
        category: 'Referral',
        merchant_name: 'SEBIS',
        price: parseInt(`-${priceDiscount}`),
      },
    ],
    transaction_details: {
      order_id: topup.id,
      gross_amount: total,
    },
    credit_card: {
      secure: true,
    },
    custom_expiry: {
      order_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      expiry_duration: EXPIRE_TIME,
      unit: 'minute',
    },
    customer_details: {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      phone: user.phone,
    },
    callbacks: {
      finish: 'sebisles://Coin',
    },
  } : {
    item_details: {
      id: topup.id,
      quantity: 1,
      name: `${topup.coin} coin`,
      category: coin.price == 100000 ? 'limit' : 'global',
      merchant_name: 'SEBIS',
      price: topup.price,
    },
    transaction_details: {
      order_id: topup.id,
      gross_amount: total,
    },
    credit_card: {
      secure: true,
    },
    custom_expiry: {
      order_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      expiry_duration: EXPIRE_TIME,
      unit: 'minute',
    },
    customer_details: {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      phone: user.phone,
    },
    callbacks: {
      finish: 'sebisles://Coin',
    },
  };

  const transaction = await transactionCoinService.transactionCoin(dataTransaction);

  if (!transaction) throw new ApiError(httpStatus.CONFLICT, 'Pembelian koin gagal.');

  res.sendWrapped(transaction, httpStatus.OK);
});

module.exports = {
  topupCoin,
};
