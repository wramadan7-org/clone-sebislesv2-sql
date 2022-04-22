const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { paginator } = require('../utils/pagination');

const { User } = require('../models/User');

const chatService = require('../services/chatService');
const userService = require('../services/userService');

const io = require('../server');

const sendMessage = catchAsync(async (req, res) => {
  const recepient = req.params.id;
  const sender = req.user.id;
  const { message } = req.body;

  if (!recepient) throw new ApiError(httpStatus.NOT_FOUND, 'Tutor tidak ada');
  if (!message) throw new ApiError(httpStatus.BAD_REQUEST, 'Harap masukkan pesan.');

  const chat = await chatService.createChat(sender, recepient, message);

  if (!chat) throw new ApiError(httpStatus.CONFLICT, 'Gagal mengirim pesan');

  io.io.emit(recepient, { sender, message });

  res.sendWrapped(chat, httpStatus.CREATED);
});

const allMessage = catchAsync(async (req, res) => {
  let { limit, page } = req.query;

  if (page) {
    page = parseInt(page);
  } else {
    page = 1;
  }

  if (limit) {
    limit = parseInt(limit);
  } else {
    limit = 10;
  }

  const message = await chatService.getAllChat(
    {
      include: [
        {
          model: User,
          as: 'sender',
        },
        {
          model: User,
          as: 'recipient',
        },
      ],
    },
  );

  const paginate = paginator(message, page, limit);

  res.sendWrapped(null, httpStatus.OK, paginate);
});

const listMessage = catchAsync(async (req, res) => {
  const userId = req.user.id;
  let { limit, page } = req.query;

  if (page) {
    page = parseInt(page);
  } else {
    page = 1;
  }

  if (limit) {
    limit = parseInt(limit);
  } else {
    limit = 10;
  }

  const message = await chatService.getOwnChat(
    userId,
    {
      include: [
        {
          model: User,
          as: 'sender',
        },
        {
          model: User,
          as: 'recipient',
        },
      ],
    },
  );

  if (message && message.length <= 0) return res.sendWrapped(message, httpStatus.OK);

  const sortingMessage = message.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const unique = [...new Map(sortingMessage.map((item) => [item.recipientId || item.senderId, item])).values()];

  const mapData = unique.map((o) => {
    let profile = null;

    if (o.senderId !== userId) {
      profile = o.sender.profile;
    }

    if (o.recipientId !== userId) {
      profile = o.recipient.profile;
    }

    const data = {
      id: o.id,
      senderId: o.senderId,
      recipientId: o.recipientId,
      sender: `${o.sender.firstName} ${o.sender.lastName}`,
      recipient: `${o.recipient.firstName} ${o.recipient.lastName}`,
      name: o.senderId === userId ? `${o.recipient.firstName} ${o.recipient.lastName}` : `${o.sender.firstName} ${o.sender.lastName}`,
      message: o.message,
      isNew: o.isNew,
      isRead: o.isRead,
      profile: profile ? profile : null,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    };

    return data;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filterNewMessage = mapData.filter((o) => o.isNew);

  const paginate = paginator(filterNewMessage, page, limit);

  res.sendWrapped(null, httpStatus.OK, paginate);
});

const roomMessage = catchAsync(async (req, res) => {
  const partnerId = req.params.id;
  const userId = req.user.id;
  let { limit, page } = req.query;

  if (page) {
    page = parseInt(page);
  } else {
    page = 1;
  }

  if (limit) {
    limit = parseInt(limit);
  } else {
    limit = 10;
  }

  const message = (await chatService.roomMessage(
    userId,
    partnerId,
  )).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const partner = await userService.getUserById(partnerId);

  const data = {
    name: `${partner.firstName} ${partner.lastName}`,
    profile: partner.profile,
    messages: message,
  };

  const paginate = paginator(data.messages, page, limit);

  res.sendWrapped(null, httpStatus.OK, { name: data.name, profile: data.profile, ...paginate });
});

const deleteMessageByPartner = catchAsync(async (req, res) => {
  const partnerId = req.params.id;
  const userId = req.user.id;

  const partner = await userService.getUserById(partnerId);

  const deleteMessage = await chatService.deleteMessageByPartnerId(userId, partnerId);

  if (deleteMessage === 0) throw new ApiError(httpStatus.CONFLICT, `Anda tidak memiliki pesan dengan ${partner.firstName} ${partner.lastName}`);

  res.sendWrapped('Berhasil menghapus pesan.', httpStatus.OK);
});

const deleteMessageById = catchAsync(async (req, res) => {
  const messageId = req.params.id;

  const message = await chatService.getMessageById(messageId);

  if (!message) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menemukan pesan.');

  const deleteMessage = await chatService.deleteMessageById(messageId);

  if (deleteMessage === 0) throw new ApiError(httpStatus.CONFLICT, 'Gagal menghapus pesan.');

  res.sendWrapped('Berhasil menghapus pesan.', httpStatus.OK);
});

module.exports = {
  sendMessage,
  allMessage,
  listMessage,
  roomMessage,
  deleteMessageByPartner,
  deleteMessageById,
};
