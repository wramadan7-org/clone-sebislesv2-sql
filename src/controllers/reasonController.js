const httpStatus = require('http-status');
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const reasonService = require('../services/reasonService');
const cartService = require('../services/cartService');
const scheduleService = require('../services/scheduleService');

const { Schedule } = require('../models/Schedule');
const { CartItem } = require('../models/CartItem');

const { DELETE, CANCEL } = process.env;

const addReason = catchAsync(async (req, res) => {
  const reasonBody = req.body;
  const serverHost = req.get('host').split(':')[0] == 'localhost' ? `http://${req.get('host')}` : `https://${req.get('host')}`;

  if (reasonBody.category == 'cart') {
    reasonBody.scheduleId = null;

    const cart = await cartService.getCartItemById(reasonBody.cartItemId);
    if (!cart) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan item di keranjang.');
  } else if (reasonBody.category == 'schedule') {
    reasonBody.cartItemId = null;

    const schedule = await scheduleService.getScheduleById(reasonBody.scheduleId);
    if (!schedule) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan item.');
  } else {
    return res.sendWrapped('Category hanya dapat diisi dengan cart/schedule!', httpStatus.BAD_REQUEST);
  }

  const reason = await reasonService.createReason(reasonBody);

  if (!reason) throw new ApiError(httpStatus.CONFLICT, 'Gagal menambahkan alasan');

  if (reasonBody.cartItemId) {
    await axios({
      method: 'patch',
      url: `${serverHost}/v1/update-status/${reasonBody.cartItemId}`,
      headers: {
        'content-type': 'application/json',
        Authorization: `${req.headers.authorization}`,
      },
      data: {
        model: reasonBody.category,
        status: CANCEL,
      },
    });
  } else if (reasonBody.scheduleId) {
    await axios({
      method: 'patch',
      url: `${serverHost}/v1/update-status/${reasonBody.cartItemId}`,
      headers: {
        'content-type': 'application/json',
        Authorization: `${req.headers.authorization}`,
      },
      data: {
        model: reasonBody.category,
        status: DELETE,
      },
    });
  }

  res.sendWrapped(reason, httpStatus.CREATED);
});

const getAllReason = catchAsync(async (req, res) => {
  const reason = await reasonService.getAllReason(
    {
      include: [
        {
          model: Schedule,
        },
        {
          model: CartItem,
        },
      ],
    },
  );

  res.sendWrapped(reason, httpStatus.OK);
});

module.exports = {
  addReason,
  getAllReason,
};
