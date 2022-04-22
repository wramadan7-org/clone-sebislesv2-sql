const bcrypt = require('bcrypt');
const httpStatus = require('http-status');
const userService = require('./userService');
const ApiError = require('../utils/ApiError');
const redis = require('../utils/redis');
const { redisRefreshTokenKey } = require('../config/redis');

/**
 * Login with identity and password
 * @param {string} identity
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginWithIdentityAndPassword = async (identity, password) => {
  const user = await userService.getUserByEmail(identity, {
    include: 'role',
  });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Kata sandi salah. Coba lagi atau klik lupa kata sandi untuk mengatur ulang.',
    );
  }
  return user;
};
const pinVerify = async (userId, pin) => {
  const user = await userService.getUserById(userId, {
    include: 'role',
  });
  if (!user.pin) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "you haven't created a withdrawal pin",
    );
  }
  if (!user || !(await bcrypt.compare(pin, user.pin))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid pin.');
  }
  return user;
};

/**
 * Refresh token auth
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  const tokenData = await redis.getObject(
    `${redisRefreshTokenKey}:${refreshToken}`,
  );
  if (!tokenData || tokenData.blacklist !== 'false') throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token not valid.');
  return tokenData;
};

/**
 *
 * @param {string} userId
 * @param {string} newPassword
 * @returns {Promise<User | ApiError>}
 */
const updatePassword = async (userId, newPassword) => {
  const salt = await bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync(newPassword, salt);
  return userService.updateUserById(userId, { password });
};

const updatePin = async (userId, newPin) => {
  const salt = await bcrypt.genSaltSync(10);
  const pin = bcrypt.hashSync(newPin, salt);
  return userService.updateUserById(userId, { pin });
};
/**
 * Login with phone number
 * @params {string}
 */

const loginWithPhoneNumber = async (identity) => {};
module.exports = {
  loginWithIdentityAndPassword,
  refreshAuth,
  updatePassword,
  loginWithPhoneNumber,
  updatePin,
  pinVerify,
};
