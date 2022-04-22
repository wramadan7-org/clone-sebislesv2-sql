const JoiBase = require('joi');
const JoiDate = require('@joi/date');

const Joi = JoiBase.extend(JoiDate);
const {
  PENDING, ACCEPT, REJECT, EXPIRE, DONE,
} = process.env;

const createSchedule = {

  // body: Joi.object().keys({
  //   teacherId: Joi.string().guid({ version: 'uuidv4' }).required(),
  //   studentId: Joi.string().guid({ version: 'uuidv4' }).required(),
  //   teacherSubjectId: Joi.string().guid({ version: 'uuidv4' }).required(),
  //   availabilityHoursId: Joi.string().guid({ version: 'uuidv4' }).required(),
  //   dateSchedule: Joi.date().format('YYYY-MM-DD').raw().error((error) => error),
  //   typeClass: Joi.string().valid('private', 'group').required(),
  //   statusSchedule: Joi.string().valid(PENDING, ACCEPT, REJECT, EXPIRE, DONE).required(),
  // }),

  body: Joi.array().items(Joi.string()),
};

module.exports = {
  createSchedule,
};
