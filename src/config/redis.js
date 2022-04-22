const redis = require('redis');
const { redis: redisConfiguration } = require('./config');
const { student } = require('../middlewares/roleValidation');

const {
  protocol, host, port, user, password,
} = redisConfiguration;

const redisClient = redis.createClient(`${protocol}://${user}:${password}@${host}:${port}`);

const redisTokenKey = (userId, type) => `user:jwt:${type}:${userId}`;
const redisRefreshTokenKey = 'user:jwt:refresh';
const redisUserLoginKey = 'user:login';

const redisStudentKey = {
  cart: {
    pending: (studentId) => `student:${studentId}:cart:pending`,
  },
  order: {
    history: (studentId) => `student:${studentId}:order:history`,
    expired: (studentId) => `student:${studentId}:order:expired`,
    pending: (studentId) => `student:${studentId}:order:pending`,
  },
};

module.exports = {
  redisClient,
  redisTokenKey,
  redisRefreshTokenKey,
  redisUserLoginKey,
  redisStudentKey,
  redisConfiguration,
};
