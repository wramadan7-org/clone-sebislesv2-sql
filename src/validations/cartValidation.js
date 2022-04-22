const Joi = require('joi');
const { cartItemStatuses } = require('../constants/carts');

const getCart = {
  query: Joi.object().keys({
    qstatus: Joi.string().valid(...Object.values(cartItemStatuses)).max(12).required(),
  }),
};

const statusCart = {
  body: Joi.object().keys({
    cartItemStatus: Joi.string().valid(...Object.values(cartItemStatuses)).max(12).required(),
  }),
};

const schemaAddCart = {
  body: Joi.object().keys({
    teacherId: Joi.string().guid({ version: 'uuidv4' }).required(),
    teacherSubjectId: Joi.string().guid({ version: 'uuidv4' }).required(),
    availabilityHoursId: Joi.string().guid({ version: 'uuidv4' }).required(),
    typeCourse: Joi.string().valid('private', 'group').required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    requestMaterial: Joi.string().allow(''),
    imageMaterial: Joi.string().allow(''),
  }),
};

const services = Joi.array().min(1).items(schemaAddCart);

const addCart = services.validate([]);

const requestMaterial = {
  body: Joi.object().keys({
    requestMaterial: Joi.string().default(null),
    fileMaterial: Joi.string().default(null),
    email1: Joi.string().email().default(null),
    email2: Joi.string().email().default(null),
    phone1: Joi.string().max(14).default(null).max(14),
    phone2: Joi.string().max(14).default(null).max(14),
  }),
};

module.exports = {
  getCart,
  statusCart,
  addCart,
  requestMaterial,
};
