const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { isTokenActive } = require('../services/tokenService');
const { tokenTypes } = require('../config/tokens');

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate.'));
  }

  // check for valid token
  const bearer = 'Bearer ';
  const token = req.headers.authorization.replace(bearer, '');
  if (!await isTokenActive(user.id, tokenTypes.ACCESS, token)) return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Token expired.'));

  req.token = token;
  req.user = user;
  resolve();
};

const auth = async (req, res, next) => new Promise((resolve, reject) => {
  passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
})
  .then(() => next())
  .catch((err) => next(err));

module.exports = auth;
