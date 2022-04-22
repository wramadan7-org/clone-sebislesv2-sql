const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');
const { tokenTypes } = require('../config/tokens');
const redis = require('../utils/redis');
const {
  redisTokenKey,
  redisRefreshTokenKey,
  redisUserLoginKey,
} = require('../config/redis');

/**
 * Sign token to redis
 * @param {string} userId
 * @param {string} type
 * @param {string} token
 * @param {number} ttl
 * @return {void}
 */
const signToken = (userId, type, token, ttl = -1) => {
  const redisKey = `${redisTokenKey(userId, type)}:${token}`;
  redis
    .setObject(redisKey, {
      blacklist: false,
    })
    .then(() => {
      if (ttl > 0) redis.setExpire(redisKey, ttl);
    });
};

/**
 * Sign refresh token to redis
 * @param {string} userId
 * @param {string} refreshToken
 * @param {number} ttl
 * @return {void}
 */
const signRefreshToken = (userId, refreshToken, ttl = -1) => {
  const redisKey = `${redisRefreshTokenKey}:${refreshToken}`;
  redis
    .setObject(redisKey, {
      userId,
      blacklist: false,
    })
    .then(() => {
      if (ttl > 0) redis.setExpire(redisKey, ttl);
    });
};

/**
 * Revoke token from redis
 * @param {string} userId
 * @param {string} type
 * @param {string} token
 * @return {Promise<Object>}
 */
const revokeToken = (userId, type, token) => {
  const redisKey = `${redisTokenKey(userId, type)}:${token}`;
  return redis.setObject(redisKey, {
    blacklist: true,
  });
};

/**
 * Revoke refresh token from redis
 * @param {string} refreshToken
 * @return {Promise<Object>}
 */
const revokeRefreshToken = async (refreshToken) => {
  const redisKey = `${redisRefreshTokenKey}:${refreshToken}`;
  const refreshTokenData = await redis.getObject(redisKey);
  refreshTokenData.blacklist = 'true';
  return redis.setObject(redisKey, refreshTokenData);
};

/**
 * Check token is active
 * @param {string} userId
 * @param {string} type
 * @param {string} token
 * @return {Promise<object | Error>}
 */
const isTokenActive = (userId, type, token) => new Promise((resolve, reject) => {
  const redisKey = `${redisTokenKey(userId, type)}:${token}`;
  redis
    .getObject(redisKey)
    .then((data) => {
      resolve(data && data.blacklist === 'false');
    })
    .catch((error) => reject(error));
});

/**
 * Check refresh token is active
 * @param refreshToken
 * @return {Promise<object | Error>}
 */
const isRefreshTokenActive = (refreshToken) => new Promise((resolve, reject) => {
  const redisKey = `${redisRefreshTokenKey}:${refreshToken}`;
  redis
    .getObject(redisKey)
    .then((data) => {
      resolve(data.blacklist === 'false');
    })
    .catch((error) => reject(error));
});

/**
 * Generate JWT token
 * @param {string} userId
 * @param {number} expires
 * @param {string} type
 * @param {string} secret
 * @return {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Sign user to redis
 * @param {User} user
 * @return {Promise<Object | Error>}
 */
const signUser = (user) => {
  const redisKey = `${redisUserLoginKey}:${user.id}`;
  return redis.setObject(redisKey, {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role.roleName,
    roleName: user.role.roleName,
  });
};

/**
 * Revoke user from redis
 * @param {string} userId
 */
const revokeUser = (userId) => {
  const redisKey = `${redisUserLoginKey}:${userId}`;
  return redis.delKey(redisKey);
};

/**
 *
 * @param {User} user
 * @return {Promise<{access: {expires: Date, token: string}, refresh: {expires: Date, token: string}}>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    'minutes',
  );
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    tokenTypes.ACCESS,
  );

  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    'days',
  );
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH,
  );

  // save token to redis
  signToken(
    user.id,
    tokenTypes.ACCESS,
    accessToken,
    accessTokenExpires.diff(moment(), 'seconds'),
  );
  signRefreshToken(
    user.id,
    refreshToken,
    refreshTokenExpires.diff(moment(), 'seconds'),
  );

  // save user data to redis
  signUser(user.toJSON());

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const generateResetPasswordToken = async (user) => {
  const secret = config.jwt.secret + user.password;
  const payload = {
    email: user.email,
    id: user.id,
  };
  const token = jwt.sign(payload, secret, { expiresIn: '15m' });
  return token;
};

module.exports = {
  generateAuthTokens,
  revokeToken,
  signUser,
  revokeUser,
  revokeRefreshToken,
  isTokenActive,
  isRefreshTokenActive,
  generateResetPasswordToken,
};
