const Joi = require('joi');

const createScheduleTime = {
  body: Joi.object().keys({
    dayCode: Joi.number().integer().min(0).max(6)
      .required(),
    timeStart: Joi.string().required(),
    durationId: Joi.string().guid({ version: 'uuidv4' }).required(),
  }),
};

const getScheduleTimeById = {
  params: Joi.object().keys({
    availabilityHoursId: Joi.string().required(),
  }),
};

const updateScheduleTime = {
  params: Joi.object().keys({
    availabilityHoursId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    dayCode: Joi.number().integer().min(0).max(6),
    timeStart: Joi.string(),
    durationId: Joi.string().guid({ version: 'uuidv4' }),
  }),
};

module.exports = {
  createScheduleTime,
  getScheduleTimeById,
  updateScheduleTime,
};
