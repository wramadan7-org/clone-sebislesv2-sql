const Joi = require('joi');

const createWishlist = {
  body: Joi.object().keys({
    teacherId: Joi.string().guid({ version: 'uuidv4' }).required(),
    teacherSubjectId: Joi.string().guid({ version: 'uuidv4' }).required(),
    availabilityHoursId: Joi.string().guid({ version: 'uuidv4' }).required(),
    typeCourse: Joi.string().valid('private', 'group').required(),
    dateTimeStart: Joi.date().required(),
    dateTimeEnd: Joi.date().required(),
  }),
};

module.exports = {
  createWishlist,
};
