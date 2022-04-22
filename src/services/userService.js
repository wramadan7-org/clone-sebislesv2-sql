const httpStatus = require('http-status');
const { User } = require('../models/User');
const ApiError = require('../utils/ApiError');
const { UserDetail } = require('../models/UserDetail');
const { School } = require('../models/School');
const { Role } = require('../models/Role');
const { RatingTutor } = require('../models/RatingTutor');

/**
 * Get user by phone number
 * @param {string} phoneNumber
 * @param {object} opts
 * @returns {Promise<User | null>}
 */

const getUserByPhoneNumber = async (phoneNumber, opts = {}) => {
  const user = await User.findOne({
    where: {
      phoneNumber,
    },
    ...opts,
  });

  return user;
};

const getUserByRole = async (userRole) => {
  const user = await User.findAll({
    where: {
      roleId: userRole,
    },
    include: [
      { model: UserDetail },
      { model: School },
      { model: Role },
      { model: RatingTutor },
    ],
  });

  return user;
};

/**
 * Get user by email
 * @param {string} email
 * @param {object} opts
 * @returns {Promise<User | null>}
 */
const getUserByEmail = async (email, opts = {}) => {
  const user = await User.findOne({
    where: {
      email,
    },
    ...opts,
  });
  return user;
};

/**
 * Get user by id
 * @param {string} userId
 * @param {object} opts
 * @returns {Promise<User | ApiError>}
 */
const getUserById = async (userId, opts = {}) => {
  const user = await User.findOne({
    where: {
      id: userId,
    },
    ...opts,
  });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'Tidak dapat menmukan user.');
  return user;
};
const getUserByIds = async (userId) => {
  const user = await User.findOne({
    where: {
      id: userId,
    },
    include: [
      { model: UserDetail },
      { model: School },
      { model: Role },
      { model: RatingTutor },
    ],
  });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found.');
  return user;
};

/**
 * Create user
 * @param {object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const checkEmail = await getUserByEmail(userBody.email);
  if (checkEmail) {
    throw new ApiError(httpStatus.CONFLICT, 'Email sudah terdaftar. Silahkan mendaftar dengan email yang lain atau silahkan login menggunakan email tersebut.');
  }
  const checkPhone = await getUserByPhoneNumber(userBody.phoneNumber);
  if (checkPhone) {
    throw new ApiError(httpStatus.CONFLICT, 'Upss... Nomor HP sudah pernah terdaftar. Masukkan nomot HP yang lain.');
  }

  return User.create(userBody);
};
/**
 * Create user by phone number
 * @param {object} userBody
 * @returns {Promise<User>}
 */
const createUserByPhoneNumber = async (userBody) => {
  const checkEmail = await getUserByEmail(userBody.email);
  if (checkEmail) {
    throw new ApiError(httpStatus.CONFLICT, 'Email sudah terdaftar. Silahkan mendaftar dengan email yang lain atau silahkan login menggunakan email tersebut.');
  }
  const checkPhone = await getUserByPhoneNumber(userBody.phoneNumber);
  if (checkPhone) {
    throw new ApiError(httpStatus.CONFLICT, 'Upss... Nomor HP sudah pernah terdaftar. Masukkan nomot HP yang lain.');
  }

  await User.create(userBody);
  const userCreated = await getUserByPhoneNumber(userBody.phoneNumber, {
    include: 'role',
  });
  return userCreated;
};
/**
 * Update user by id
 * @param {string} userId
 * @param {object} userBody
 * @returns {Promise<User | ApiError>}
 */
const updateUserById = async (userId, userBody) => {
  const user = await getUserById(userId);

  Object.assign(user, userBody);
  await user.save();

  return user;
};

const updateProfile = async (userId, file) => {
  const user = await getUserById(userId);

  const data = {
    profile: file,
  };

  Object.assign(user, data);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {string} userId
 * @returns {Promise<User | ApiError>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);

  await user.destroy();

  return user;
};

module.exports = {
  createUser,
  getUserByRole,
  getUserByEmail,
  getUserById,
  getUserByIds,
  updateUserById,
  updateProfile,
  deleteUserById,
  getUserByPhoneNumber,
  createUserByPhoneNumber,
};
