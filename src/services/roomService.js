const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const { Room } = require('../models/Room');

/**
 * Check is schedule already or not
 * @param { String } scheduleId
 * @param { Object } opts
 * @returns { Promise<Boolean> }
 */
const checkRoomBySchedule = async (scheduleId, opts = {}) => {
  const room = await Room.findOne({ where: { scheduleId }, ...opts });

  if (!room) return false;

  return true;
};

/**
 * Create room
 * @param { Object } body
 * @returns { Promise<Object | null> }
 */
const createRoom = async (body) => {
  const room = await Room.create(body);

  return room;
};

/**
 * Get all data room
 * @param { Object } opts
 * @returns { Promise<Array> }
 */
const getAllRoom = async (opts = {}) => Room.findAll({ ...opts });

/**
 * Get vectera isDeleted false
 * @param {*} opts
 * @returns { Promise<Array | [] >}
 */
const getVecteraNotDelete = async (opts = {}) => {
  const rooms = await Room.findAll(
    {
      where: {
        isVecteraDeleted: false,
      },
      ...opts,
    },
  );

  return rooms;
};

/**
 * Get room by id
 * @param { String } id
 * @param { Object } opts
 * @returns { Promise<Object | null> }
 */
const getRooById = async (id, opts = {}) => Room.findOne({ where: { id }, ...opts });

/**
 * Update isVecteraDeleted to true
 * @param { String } roomId
 * @returns { Promise<Object> }
 */
const updateStatusVecteraRoom = async (roomId) => {
  const room = await Room.update(
    {
      isVecteraDeleted: true,
    },
    {
      where: {
        id: roomId,
      },
    },
  );

  return room;
};

module.exports = {
  checkRoomBySchedule,
  createRoom,
  getAllRoom,
  getRooById,
  getVecteraNotDelete,
  updateStatusVecteraRoom,
};
