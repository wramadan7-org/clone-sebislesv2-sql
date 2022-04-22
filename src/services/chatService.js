const httpStatus = require('http-status');
const { Op, where } = require('sequelize');
const moment = require('moment');
const ApiError = require('../utils/ApiError');
const { Message } = require('../models/Message');

/**
 * Get all chat
 * @param {object} opts
 * @returns array of object
 */
const getAllChat = async (opts = {}) => {
  const chat = await Message.findAll({ ...opts });

  return chat;
};

/**
 * Get list chat
 * @param {uuidv4} userId
 * @param {object} opts
 * @returns array of object
 */
const getOwnChat = async (userId, opts = {}) => {
  const chat = await Message.findAll(
    {
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              {
                senderId: userId,
              },
              {
                isNew: 1,
              },
            ],
          },
          {
            [Op.and]: [
              {
                recipientId: userId,
              },
              {
                isNew: 1,
              },
            ],
          },
        ],
      },
      ...opts,
    },
  );

  return chat;
};

/**
 * Get detail message
 * @param {uuidv4} messageId
 * @param {object} opts
 */
const getDetailMessage = async (messageId, opts = {}) => {
  const message = Message.findOne(
    {
      where: {
        id: messageId,
      },
      ...opts,
    },
  );

  return message;
};

/**
 * Get message by Id
 * @param {uuidv4} messageId
 * @param {object} opts
 * @returns object
 */
const getMessageById = async (messageId, opts = {}) => {
  const message = await Message.findOne(
    {
      where: {
        id: messageId,
      },
      ...opts,
    },
  );

  return message;
};

/**
 * Get all message with that partnerId
 * @param {uuidv4} userId
 * @param {uuidv4} partnerId
 * @param {object} opts
 * @returns Array
 */
const roomMessage = async (userId, partnerId, opts = {}) => {
  const message = await Message.findAll(
    {
      where: {
        [Op.or]: [
          {
            senderId: partnerId,
            recipientId: userId,
          },
          {
            recipientId: partnerId,
            senderId: userId,
          },
        ],
      },
      ...opts,
    },
  );

  if (message.length > 0) {
    await Message.update(
      { isRead: 1 },
      {
        where: {
          recipientId: userId,
          senderId: partnerId,
        },
      },
    );
  }

  return message;
};

/**
 * Create message / sending message
 * @param {uuidv4} senderId
 * @param {uuidv4} recepientId
 * @param {string} message
 * @returns object
 */
const createChat = async (senderId, recipientId, message) => {
  const data = {
    senderId,
    recipientId,
    message,
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
  };

  await Message.update(
    { isNew: 0 },
    {
      where: {
        [Op.or]: [
          {
            senderId: recipientId,
            recipientId: senderId,
          },
          {
            senderId,
            recipientId,
          },
        ],
      },
    },
  );

  const chat = await Message.create(data);

  return chat;
};

/**
 * Delete message by partner
 * @param {uuidv4} userId
 * @param {uuidv4} partnerId
 * @returns object
 */
const deleteMessageByPartnerId = async (userId, partnerId) => {
  const deleteMessage = await Message.destroy(
    {
      where: {
        [Op.or]: [
          {
            senderId: userId,
            recipientId: partnerId,
          },
          {
            senderId: partnerId,
            recipientId: userId,
          },
        ],
      },
    },
  );

  return deleteMessage;
};

/**
 * Delete message by Id
 * @param {uuidv4} messageId
 * @returns object
 */
const deleteMessageById = async (messageId) => {
  const message = await getDetailMessage(messageId);
  message.destroy();

  return message;
};

module.exports = {
  getAllChat,
  getOwnChat,
  getDetailMessage,
  getMessageById,
  roomMessage,
  createChat,
  deleteMessageByPartnerId,
  deleteMessageById,
};
