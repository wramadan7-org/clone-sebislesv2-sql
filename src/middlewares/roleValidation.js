const httpStatus = require('http-status');
const { roleTypes } = require('../config/roles');
const ApiError = require('../utils/ApiError');

const teacher = async (req, res, next) => {
  const { role } = req.user;
  if (role !== roleTypes.TEACHER) next(new ApiError(httpStatus.FORBIDDEN, 'Access denied'));
  next();
};

const student = async (req, res, next) => {
  const { role } = req.user;
  if (role !== roleTypes.STUDENT) next(new ApiError(httpStatus.FORBIDDEN, 'Access denied'));
  next();
};

const verifikator = async (req, res, next) => {
  const { role } = req.user;
  if (role !== roleTypes.VERIFIKATOR) next(new ApiError(httpStatus.FORBIDDEN, 'Access denied'));
  next();
};

const finance = async (req, res, next) => {
  const { role } = req.user;
  if (role !== roleTypes.FINANCE) next(new ApiError(httpStatus.FORBIDDEN, 'Access denied'));
  next();
};

const admin = async (req, res, next) => {
  const { role } = req.user;
  if (role !== roleTypes.ADMIN) next(new ApiError(httpStatus.FORBIDDEN, 'Access denied'));
  next();
};

const administrator = async (req, res, next) => {
  const { role } = req.user;
  if (role !== roleTypes.ADMINISTRATOR) next(new ApiError(httpStatus.FORBIDDEN, 'Access denied'));
  next();
};

const pteacher = async (req, res, next) => {
  const { role } = req.user;
  if (role !== roleTypes.PTEACHER) next(new ApiError(httpStatus.FORBIDDEN, 'Access denied'));
  next();
};

const rteacher = async (req, res, next) => {
  const { role } = req.user;
  if (role !== roleTypes.RTEACHER) next(new ApiError(httpStatus.FORBIDDEN, 'Access denied'));
  next();
};

module.exports = {
  teacher,
  student,
  verifikator,
  finance,
  admin,
  administrator,
  pteacher,
  rteacher,
};
